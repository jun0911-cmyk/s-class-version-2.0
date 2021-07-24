import tensorflow as tf
import numpy as np
import pytesseract
import cv2
from tensorflow import keras
from PIL import Image 

pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

img_height = 180
img_width = 180

image_name = 'test1.jpg'

problem_cnn_class_names = ['drawing', 'paper', 'problem']

cnn_model_path = 'C:/Users/jun09/OneDrive/Desktop/s-class_system_version/s-class_version-2/server/problem_server/model/cnn_model/1627062415'

image_path = 'C:/Users/jun09/OneDrive/desktop/s-class_system_version/s-class_version-2/server/problem_server/test_image/' + image_name

def load_model_image(load_model):
    load_cnn_model = tf.keras.models.load_model(load_model)
    return load_cnn_model, image_path

def load_image(model_path):
    load_cnn_model, image_path =  load_model_image(model_path)
    img = keras.preprocessing.image.load_img(image_path, target_size=(img_height, img_width))
    img_array = keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)
    return img_array, load_cnn_model

def predict_image(model_path, class_names):
    img_array, load_cnn_model = load_image(model_path)
    predictions = load_cnn_model.predict(img_array)
    score = tf.nn.softmax(predictions[0])
    accuracy = 100 * np.max(score)
    score_class_name = class_names[np.argmax(score)]
    return accuracy, score_class_name

def ocr_image(image_name):
    ocr_iamge_name = cv2.imread(image_name)
    gray_image = cv2.cvtColor(ocr_iamge_name, cv2.COLOR_BGR2GRAY)
    ocr_predict_image = cv2.threshold(gray_image, 0, 255, cv2.THRESH_BINARY | cv2.THRESH_OTSU)[1]
    problem_text = pytesseract.image_to_string(ocr_predict_image, lang='kor+eng')
    return problem_text

accuracy, score_class_name = predict_image(cnn_model_path, problem_cnn_class_names)

if score_class_name == 'problem' and accuracy > 70.0:
    print('Extracting text...')
    ocr_problem_text = ocr_image(image_path)
    print(ocr_problem_text)
else:
    print(
        "Failed to extract text, less than 70% accuracy or not problematic. Measured Results : {}, result accuracy : {:.2f}%"
        .format(score_class_name, accuracy)
    )