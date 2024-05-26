import cv2
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

    # Save original image
    cv2.imwrite("original_image.png", image)

    # Convert to grayscale
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    cv2.imwrite("gray_image.png", gray)

    # Apply Gaussian blur to remove noise
    blurred = cv2.GaussianBlur(gray, (3, 3), 0)
    cv2.imwrite("blurred_image.png", blurred)

    # Apply adaptive thresholding
    binary_image = cv2.adaptiveThreshold(blurred, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
    cv2.imwrite("binary_image.png", binary_image)

    # Resize the image to improve OCR accuracy
    scale_factor = 2
    resized_image = cv2.resize(binary_image, (binary_image.shape[1] * scale_factor, binary_image.shape[0] * scale_factor), interpolation=cv2.INTER_LINEAR)
    cv2.imwrite("resized_image.png", resized_image)
    
    return resized_image

def extract_text_from_image(image):
    custom_config = r'--oem 3 --psm 6'
    text = pytesseract.image_to_string(image, config=custom_config)
    print("Extracted Text:")
    print(text)
    with open("extracted_text.txt", "w") as text_file:
        text_file.write(text)
    return text

def clean_extracted_text(text):
    # Remove unwanted characters and lines
    cleaned_lines = []
    for line in text.split('\n'):
        line = line.strip()
        if line and not re.match(r'^[^\w\s]+$', line):  # Remove lines with non-alphanumeric characters only
            cleaned_lines.append(line)
    cleaned_text = '\n'.join(cleaned_lines)
    print("Cleaned Text:")
    print(cleaned_text)
    with open("cleaned_text.txt", "w") as text_file:
        text_file.write(cleaned_text)
    return cleaned_text

def parse_scoreboard_text(text):
    lines = text.split('\n')
    parsed_data = []
    pattern = re.compile(r'([A-Za-z0-9_\[\]]+#\d+)\s+(\d+)\s+(\d+)\s+(\d+:\d+|\d+)\s+(\d+)\s+(\d+)')
    for line in lines:
        match = pattern.search(line)  # Use search instead of match to allow partial matches
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
        else:
            print(f"Failed to match line: {line}")
    return parsed_data

def save_to_csv(data, output_path):
    df = pd.DataFrame(data)
    df.to_csv(output_path, index=False)
    print(f"Data saved to {output_path}")

def main(image_path, output_path):
    processed_image = preprocess_image(image_path)
    extracted_text = extract_text_from_image(processed_image)
    cleaned_text = clean_extracted_text(extracted_text)
    scoreboard_data = parse_scoreboard_text(cleaned_text)
    save_to_csv(scoreboard_data, output_path)

if __name__ == "__main__":
    image_path = '/home/luke/lisa/clan-match-stat-tracker/tesseract/images/WhatsApp Image 2024-05-26 at 15.27.35.jpeg'  # Path to your scoreboard image
    output_path = 'scoreboard_data.csv'  # Path to save the CSV file
    main(image_path, output_path)
