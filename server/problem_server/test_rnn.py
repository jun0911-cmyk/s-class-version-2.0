import tensorflow as tf
import numpy as np 

sample_review = ('The movie was cool. The animation and the graphics '
'were out of this world. I would recommend this movie.')

rnn_model_path = 'C:/Users/jun09/OneDrive/Desktop/s-class_system_version/s-class_version-2/server/problem_server/model/rnn_test'

def load_model(load_model):
    load_rnn_model = tf.keras.models.load_model(load_model)
    return load_rnn_model

model = load_model(rnn_model_path)

predictions = model.predict(np.array([sample_review]))

if predictions < 0:
    print("The movie review is bad review.")
elif predictions > 0:
    print("The movie review is good review.")