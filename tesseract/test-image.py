import cv2
import matplotlib.pyplot as plt

def preprocess_image(image_path):
    image = cv2.imread(image_path, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binary_image = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
    plt.imshow(binary_image, cmap='gray')
    plt.title('Preprocessed Image')
    plt.show()
    return binary_image

# Test the preprocessing
preprocess_image('/images/test1.jpeg')
