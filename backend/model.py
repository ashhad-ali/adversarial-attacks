import torch
import torchvision.transforms as transforms
from torchvision import models

# Load pretrained ResNet-18
# weights=DEFAULT means use the best available pretrained weights
model = models.resnet18(weights=models.ResNet18_Weights.DEFAULT)

# Put model in eval mode
# This disables things like dropout that only make sense during training
model.eval()

transform = transforms.Compose([
    # Force the image to 224x224. This will "squash" wide images into a square, 
    # but it guarantees no parts of the car are chopped off.
    transforms.Resize((224, 224)), 
    transforms.ToTensor(),
])

# These are the 1000 ImageNet class labels
# ResNet outputs a number (0-999), we use this to get the actual name
weights = models.ResNet18_Weights.DEFAULT
class_labels = weights.meta["categories"]