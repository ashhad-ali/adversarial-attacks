import os
import io
import base64
import torch
import torchattacks
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from model import model, transform, class_labels

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── helpers ──────────────────────────────────────────────────────────────────

def load_image(file_bytes: bytes):
    """Convert raw uploaded bytes into a preprocessed tensor ready for the model."""
    image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
    tensor = transform(image).unsqueeze(0)  # [1, 3, 224, 224]
    return tensor


def predict(tensor):
    """Run a forward pass and return (class_index, class_label)."""
    with torch.no_grad():
        output = model(tensor)
    idx = output.argmax(dim=1).item()
    return idx, class_labels[idx]


def tensor_to_base64(tensor):
    """Convert a [1, 3, 224, 224] normalized tensor to a base64 PNG string."""
    img = tensor.squeeze(0).detach().clone()

    # Reverse ImageNet normalization
    mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
    std  = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
    img  = img * std + mean
    img  = img.clamp(0, 1)

    # Convert to PIL and encode
    img = img.permute(1, 2, 0).numpy()
    img = (img * 255).astype("uint8")
    pil = Image.fromarray(img)

    buffer = io.BytesIO()
    pil.save(buffer, format="PNG")
    return base64.b64encode(buffer.getvalue()).decode("utf-8")


def build_response(original_tensor, adversarial_tensor, original_label, adversarial_label):
    """Package everything into the JSON response the frontend expects."""
    return {
        "original_label":    original_label,
        "adversarial_label": adversarial_label,
        "original_image":    tensor_to_base64(original_tensor),
        "adversarial_image": tensor_to_base64(adversarial_tensor),
    }


# ── endpoints ─────────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    return {"message": "Adversarial Attacks API is running"}


@app.post("/attacks/fgsm")
async def attack_fgsm(
    file: UploadFile = File(...),
    epsilon: float = Form(0.05),
):
    tensor = load_image(await file.read())
    original_idx, original_label = predict(tensor)

    attack = torchattacks.FGSM(model, eps=epsilon)
    label_tensor = torch.tensor([original_idx])
    adv_tensor = attack(tensor, label_tensor)

    _, adversarial_label = predict(adv_tensor)

    return build_response(tensor, adv_tensor, original_label, adversarial_label)


@app.post("/attacks/pgd")
async def attack_pgd(
    file: UploadFile = File(...),
    epsilon: float = Form(0.05),
    steps: int = Form(40),
):
    tensor = load_image(await file.read())
    original_idx, original_label = predict(tensor)

    # alpha is the step size per iteration — standard practice is eps/4
    attack = torchattacks.PGD(model, eps=epsilon, alpha=epsilon/4, steps=steps)
    label_tensor = torch.tensor([original_idx])
    adv_tensor = attack(tensor, label_tensor)

    _, adversarial_label = predict(adv_tensor)

    return build_response(tensor, adv_tensor, original_label, adversarial_label)


@app.post("/attacks/deepfool")
async def attack_deepfool(
    file: UploadFile = File(...),
    steps: int = Form(50),
):
    tensor = load_image(await file.read())
    original_idx, original_label = predict(tensor)

    # DeepFool doesn't use epsilon — it finds the minimum perturbation automatically
    attack = torchattacks.DeepFool(model, steps=steps)
    label_tensor = torch.tensor([original_idx])
    adv_tensor = attack(tensor, label_tensor)

    _, adversarial_label = predict(adv_tensor)

    return build_response(tensor, adv_tensor, original_label, adversarial_label)


# Keep the old /attack endpoint working so the existing fgsm page
# doesn't break until we update it to use /attacks/fgsm
@app.post("/attack")
async def attack_legacy(
    file: UploadFile = File(...),
    epsilon: float = Form(0.05),
):
    return await attack_fgsm(file=file, epsilon=epsilon)