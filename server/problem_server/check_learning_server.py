import tensorflow as tf
import numpy as np
from tensorflow import keras

img_height = 180
img_width = 180

class_names = ['drowing', 'paper', 'problem_text']

cnn_model_path = 'C:/Users/jun09/OneDrive/Desktop/s-class_system_version/s-class_version-2/server/problem_server/model/1625844412'

load_cnn_model = tf.keras.models.load_model(cnn_model_path)

image_data = 'test7.jpg'

path = 'C:/Users/jun09/OneDrive\desktop/s-class_system_version/s-class_version-2/server/problem_server/test_image/' + image_data

img = keras.preprocessing.image.load_img(
    path, target_size=(img_height, img_width)
)

img_array = keras.preprocessing.image.img_to_array(img)
img_array = tf.expand_dims(img_array, 0)

predictions = load_cnn_model.predict(img_array)

score = tf.nn.softmax(predictions[0])

print(
    "This image most likely belongs to {} with a {:.2f}% percent confidence."
    .format(class_names[np.argmax(score)], 100 * np.max(score))
)