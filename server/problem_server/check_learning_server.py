import tensorflow as tf
import numpy as np
import pytesseract
from tensorflow import keras
from PIL import Image 

pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe'

img_height = 180
img_width = 180

problem_cnn_class_names = ['drawing', 'paper', 'problem']

cnn_model_path = 'C:/Users/jun09/OneDrive/Desktop/s-class_system_version/s-class_version-2/server/problem_server/model/1626093961'

load_cnn_model = tf.keras.models.load_model(cnn_model_path)

image_data = 'test1.jpg'

image_path = 'C:/Users/jun09/OneDrive/desktop/s-class_system_version/s-class_version-2/server/problem_server/test_image/' + image_data

open_image = Image.open(image_path)

img = keras.preprocessing.image.load_img(
    image_path, target_size=(img_height, img_width)
)

img_array = keras.preprocessing.image.img_to_array(img)
img_array = tf.expand_dims(img_array, 0)

predictions = load_cnn_model.predict(img_array)

score = tf.nn.softmax(predictions[0])

accuracy = 100 * np.max(score)
score_class_name = problem_cnn_class_names[np.argmax(score)]

if score_class_name == 'problem' and accuracy > 70.0:
    problem_text = pytesseract.image_to_string(open_image, lang='kor')
    print(problem_text)
else:
    print(
    "해당 이미지는 {}일 확률이 {:.2f}%로 측정되었습니다."
    .format(score_class_name, accuracy)
)