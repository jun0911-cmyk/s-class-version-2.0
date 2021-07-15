import tensorflow as tf
import numpy as np
import pytesseract
from tensorflow import keras
from PIL import Image 

pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

img_height = 180
img_width = 180

image_name = 'test7.jpg'

problem_cnn_class_names = ['drawing', 'paper', 'problem']

cnn_model_path = 'C:/Users/jun09/OneDrive/Desktop/s-class_system_version/s-class_version-2/server/problem_server/model/1626093961'

image_path = 'C:/Users/jun09/OneDrive/desktop/s-class_system_version/s-class_version-2/server/problem_server/test_image/' + image_name

def load_model_image(load_model):
    load_cnn_model = tf.keras.models.load_model(load_model)
    open_image = Image.open(image_path)
    return load_cnn_model, image_path, open_image

def load_image(model_path):
    load_cnn_model, image_path, open_image =  load_model_image(model_path)
    img = keras.preprocessing.image.load_img(image_path, target_size=(img_height, img_width))
    img_array = keras.preprocessing.image.img_to_array(img)
    img_array = tf.expand_dims(img_array, 0)
    return img_array, open_image, load_cnn_model

def predict_image(model_path, class_names):
    img_array, open_image, load_cnn_model = load_image(model_path)
    predictions = load_cnn_model.predict(img_array)
    score = tf.nn.softmax(predictions[0])
    accuracy = 100 * np.max(score)
    score_class_name = class_names[np.argmax(score)]
    return accuracy, score_class_name, open_image

accuracy, score_class_name, open_image = predict_image(cnn_model_path, problem_cnn_class_names)

if score_class_name == 'problem' and accuracy > 70.0:
    print('Extracting text...')
    problem_text = pytesseract.image_to_string(open_image, lang='kor+eng')
    print(problem_text)
else:
    print(
        "Failed to extract text, less than 70% accuracy or not problematic. Measured Results : {}, result accuracy : {:.2f}%"
        .format(score_class_name, accuracy)
    )