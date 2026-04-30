import io
import base64
import torch
import os
import torch.nn.functional as F
from fastapi import FastAPI, UploadFile, File, Form
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

from model import model, transform, class_labels
from fgsm import fgsm_attack

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {"message": "FGSM Attack API is running"}


@app.post("/attack")
async def run_attack(
    file: UploadFile = File(...),
    epsilon: float = Form(...)
):
    # Step 1: read the uploaded file and open it as a PIL image
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")

    # Step 2: apply the transform pipeline to get a tensor
    # unsqueeze(0) adds a batch dimension: shape goes from [3,224,224] to [1,3,224,224]
    # models expect a batch of images, not a single image
    image_tensor = transform(image).unsqueeze(0)

    # Step 3: get original prediction (no gradients needed here)
    with torch.no_grad():
        original_output = model(image_tensor)
    original_class_idx = original_output.argmax(dim=1).item()
    original_label = class_labels[original_class_idx]

    # Step 4: run FGSM attack
    adversarial_tensor = fgsm_attack(image_tensor, epsilon, model)

    # Step 5: get adversarial prediction
    with torch.no_grad():
        adversarial_output = model(adversarial_tensor)
    adversarial_class_idx = adversarial_output.argmax(dim=1).item()
    adversarial_label = class_labels[adversarial_class_idx]

    # Step 6: convert both tensors back to viewable images
    adv_image = adversarial_tensor.squeeze(0).detach().clone()
    orig_image = image_tensor.squeeze(0).detach().clone() # Grab the resized original

    # Reverse the normalization
    mean = torch.tensor([0.485, 0.456, 0.406]).view(3, 1, 1)
    std = torch.tensor([0.229, 0.224, 0.225]).view(3, 1, 1)
    
    adv_image = adv_image * std + mean
    orig_image = orig_image * std + mean

    # Clamp, convert to [H,W,C], then to uint8
    adv_image = adv_image.clamp(0, 1).permute(1, 2, 0).numpy()
    adv_image = (adv_image * 255).astype("uint8")
    
    orig_image = orig_image.clamp(0, 1).permute(1, 2, 0).numpy()
    orig_image = (orig_image * 255).astype("uint8")

    # Convert to PIL and encode to base64
    buffer_adv = io.BytesIO()
    Image.fromarray(adv_image).save(buffer_adv, format="PNG")
    encoded_adv = base64.b64encode(buffer_adv.getvalue()).decode("utf-8")

    buffer_orig = io.BytesIO()
    Image.fromarray(orig_image).save(buffer_orig, format="PNG")
    encoded_orig = base64.b64encode(buffer_orig.getvalue()).decode("utf-8")

    return {
        "original_label": original_label,
        "adversarial_label": adversarial_label,
        "adversarial_image": encoded_adv,
        "original_image": encoded_orig  # Send the resized original back!
    }