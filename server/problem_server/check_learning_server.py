import tensorflow as tf
import numpy as np
import pytesseract
from tensorflow import keras

# image open module import
from PIL import Image 

img_height = 180
img_width = 180

problem_cnn_class_names = ['drawing', 'paper', 'problem']

cnn_model_path = 'C:/Users/jun09/OneDrive/Desktop/s-class_system_version/s-class_version-2/server/problem_server/model/1625844412'

load_cnn_model = tf.keras.models.load_model(cnn_model_path)

image_data = 'test5.jpg'

path = 'C:/Users/jun09/OneDrive/desktop/s-class_system_version/s-class_version-2/server/problem_server/test_image/' + image_data

image = Image.open(path)

print(image)

img = keras.preprocessing.image.load_img(
    path, target_size=(img_height, img_width)
)

img_array = keras.preprocessing.image.img_to_array(img)
img_array = tf.expand_dims(img_array, 0)

predictions = load_cnn_model.predict(img_array)

score = tf.nn.softmax(predictions[0])

accuracy = 100 * np.max(score) # 측정결과 어큐러시 100분율로 표시 정규화 해제
score_class_name = problem_cnn_class_names[np.argmax(score)] # class_name 중 어큐러시가 가장 높은 class_name 가져옴

print(
    "해당 이미지는 {}일 확률이 {:.2f}%로 측정되었습니다."
    .format(score_class_name, accuracy)
)

if score_class_name == 'problem' and accuracy > 70.0:
    pytesseract.pytesseract.tesseract_cmd = r'C:/Program Files/Tesseract-OCR/tesseract.exe' # 경로지정
    problem_text = pytesseract.image_to_string(image, lang='kor') # OCR
    print(problem_text)
else:
    print('문제집이 아니기 때문에 텍스트를 추출할 수 없습니다.')