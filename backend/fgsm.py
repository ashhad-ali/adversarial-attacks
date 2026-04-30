import torch
import torch.nn.functional as F


def fgsm_attack(image_tensor, epsilon, model):
    # Step 1: tell PyTorch we want gradients with respect to this image
    # Normally gradients are only tracked for model weights, not inputs
    image_tensor.requires_grad = True

    # Step 2: forward pass — run image through model to get predictions
    output = model(image_tensor)

    # Step 3: find what class the model currently predicts
    # output is a tensor of 1000 scores, argmax gives us the index of the highest
    predicted_class = output.argmax(dim=1)

    # Step 4: compute loss — how wrong is the model relative to its own prediction?
    # We use the model's own predicted class as the "correct" label
    # The goal of FGSM is to maximize this loss
    loss = F.cross_entropy(output, predicted_class)

    # Step 5: zero out any existing gradients then backpropagate
    # This computes d(loss)/d(image_tensor) — how does each pixel affect the loss?
    model.zero_grad()
    loss.backward()

    # Step 6: image_tensor.grad now contains the gradient
    # We take the sign (+1 or -1) of each value
    # This tells us the direction each pixel should move to increase loss
    gradient_sign = image_tensor.grad.sign()

    # Step 7: create the adversarial image
    adversarial_image = image_tensor + epsilon * gradient_sign

    return adversarial_image