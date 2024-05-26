import cv2
import matplotlib.pyplot as plt
import numpy as np
import pytesseract
import re
import pandas as pd
import os

# Set the path to the Tesseract executable for Ubuntu
pytesseract.pytesseract.tesseract_cmd = r'/usr/bin/tesseract'

def preprocess_image(image_path):
    if not os.path.exists(image_path):
        raise FileNotFoundError(f"Image file not found: {image_path}")
    
    image = cv2.imread(image_path, cv2.IMREAD_COLOR)
    if image is None:
        raise ValueError(f"Failed to read image from {image_path}")

    # Upscale the image
    upscale_factor = 2
    image = cv2.resize(image, None, fx=upscale_factor, fy=upscale_factor, interpolation=cv2.INTER_CUBIC)

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    # Apply Gaussian blur to remove noise
    gray = cv2.GaussianBlur(gray, (5, 5), 0)

    # Apply sharpening filter
    kernel = np.array([[0, -1, 0],
                       [-1, 5,-1],
                       [0, -1, 0]])
    gray = cv2.filter2D(gray, -1, kernel)

    # Binarize the image
    _, binary_image = cv2.threshold(gray, 150, 255, cv2.THRESH_BINARY_INV)
    
    plt.imshow(binary_image, cmap='gray')
    plt.title('Preprocessed Image')
    plt.show()
    
    return binary_image

def extract_text_from_image(image):
    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(image, config=custom_config)
    print("Extracted Text:")
    print(text)
    return text

def parse_scoreboard_text(text):
    lines = text.split('\n')
    parsed_data = []
    for line in lines:
        match = re.match(r'(\w+#\d+)\s+(\d+)\s+(\d+)\s+(\d+:\d+)\s+(\d+)\s+(\d+)', line)
        if match:
            username, score, kills, time, defends, deaths = match.groups()
            parsed_data.append({
                'Username': username,
                'Score': score,
                'Kills': kills,
                'Time': time,
                'Defends': defends,
                'Deaths': deaths
            })
    return parsed_data

def save_to_csv(data, output_path):
    df = pd.DataFrame(data)
    df.to_csv(output_path, index=False)
    print(f"Data saved to {output_path}")

def main(image_path, output_path):
    processed_image = preprocess_image(image_path)
    extracted_text = extract_text_from_image(processed_image)
    scoreboard_data = parse_scoreboard_text(extracted_text)
    save_to_csv(scoreboard_data, output_path)

if __name__ == "__main__":
    image_path = '/home/luke/lisa/clan-match-stat-tracker/tesseract/images/WhatsApp Image 2024-05-26 at 14.56.32 (2).jpeg'  # Path to your scoreboard image
    output_path = 'scoreboard_data.csv'  # Path to save the CSV file
    main(image_path, output_path)
