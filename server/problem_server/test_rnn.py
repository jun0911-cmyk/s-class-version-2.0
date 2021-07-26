import tensorflow as tf
import numpy as np
import json

sample_review = ('The movie was cool. The animation and the graphics '
'were out of this world. I would recommend this movie.')

rnn_model_path = 'C:/Users/jun09/OneDrive/Desktop/s-class_system_version/s-class_version-2/server/problem_server/model/rnn_model/rnn_test'

def load_model(load_model):
    load_rnn_model = tf.keras.models.load_model(load_model)
    return load_rnn_model

def request_json():
    message = ''
    json_msg = 'not Found'
    try:
        with open("sendData.json", "r", encoding="UTF-8-sig") as json_file:
            request_json = json.load(json_file)
            json_msg = request_json
        message = "successed!"
    except:
        message = "Request Error"
    return message, json_msg

model = load_model(rnn_model_path)
request_msg, rnn_predict_data = request_json()

data_object = {
    "id": rnn_predict_data["response"][0]["response_id"],
    "description": rnn_predict_data["response"][0]["response_text"],
    "classification": rnn_predict_data["response"][0]["response_classification"],
    "image_name": rnn_predict_data["response"][0]["image_name"],
    "model_id": rnn_predict_data["response"][0]["predict_model_name"]
}

print(request_msg)
print(data_object["id"])
print(data_object["description"])
print(data_object["classification"])
print(data_object["image_name"])
print(data_object["model_id"])

predictions = model.predict(np.array([sample_review]))

if predictions < 0:
    print("The movie review is bad review.")
elif predictions > 0:
    print("The movie review is good review.")