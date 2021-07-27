from re import T
import tensorflow as tf
import numpy as np
import pytesseract
import cv2
import json
import time
from tensorflow import keras

pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

img_height = 180
img_width = 180

image_name = 'test1.jpg'
model_name = '1627062415'

class_names = ['drawing', 'paper', 'problem']

model_path = 'C:/Users/jun09/OneDrive/Desktop/s-class_system_version/s-class_version-2/server/problem_server/model/cnn_model/' + model_name

image_path = 'C:/Users/jun09/OneDrive/desktop/s-class_system_version/s-class_version-2/server/problem_server/test_image/' + image_name

def load_model():
    return tf.keras.models.load_model(model_path)

def load_image():
    return keras.preprocessing.image.load_img(image_path, target_size=(img_height, img_width))

def image_array():
    load_img = load_image()
    img_array = keras.preprocessing.image.img_to_array(load_img)
    return tf.expand_dims(img_array, 0)

def predict_image():
    img_array = image_array()
    model = load_model()
    return model.predict(img_array)

def accuracy_calculation():
    predictions = predict_image()
    score = tf.nn.softmax(predictions[0])
    accuracy = 100 * np.max(score)
    score_class_name = class_names[np.argmax(score)]
    return accuracy, score_class_name

def ocr_image(image_name):
    ocr_predict_image = cv2.imread(image_name)
    ocr_config = '-l kor+eng+equ --oem 3 --psm 11'
    return pytesseract.image_to_string(ocr_predict_image, config=ocr_config)

def create_json(ocr_data):
    t = time.time()
    json_data = {
        "response": [
            {
                "response_id": int(t),
                "response_text": ocr_data,
                "response_classification": "ocr",
                "image_name": image_name,
                "predict_model_name": model_name
            }
        ]
    }
    return json_data

def response_json(response_data):
    message = ''
    try:
        with open("sendData.json", "w", encoding="UTF-8-sig") as json_file:
            json_file.write(json.dumps(response_data, ensure_ascii=False))
        message = "successed! {}".format(response_data)
    except:
        message = "Response Error"
    return message
    

accuracy, score_class_name = accuracy_calculation()

if score_class_name == 'problem' and accuracy > 70.0:
    print('Extracting text...')
    ocr_problem_text = ocr_image(image_path)
    json_data = create_json(ocr_problem_text)
    response_msg = response_json(json_data)
    print(response_msg)
elif score_class_name == 'problem' and accuracy < 70.0:
    print(
        "The image was not accurately recognized. Please select another image or re-recognize it. Current measured accuracy: {:.2f}".format(accuracy)
    )
else:
    print(
        "Failed to extract text, less than 70% accuracy or not problematic. Measured Results : {}, result accuracy : {:.2f}%"
        .format(score_class_name, accuracy)
    )