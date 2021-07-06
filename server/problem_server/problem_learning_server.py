import matplotlib.pyplot as plt
import numpy as np
import os
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential
import pathlib

# 너비, 높이, 소그룹 데이터 갯수
batch_size = 32
img_height = 180
img_width = 180

# 사진 URL 불러옴
dataset_url = "https://storage.googleapis.com/download.tensorflow.org/example_images/flower_photos.tgz"

# URL로 불러온 데이터 이미지를 저장
data_dir = tf.keras.utils.get_file('flower_photos', origin=dataset_url, untar=True)
data_dir = pathlib.Path(data_dir)

# 불러온 URL의 다운받은 이미지를 토대로 데이터샛을 생성한다. 훈련 전용 데이터 샛 : 80%의 데이터를 가지고 있음
train_ds = tf.keras.preprocessing.image_dataset_from_directory(
    data_dir,
    validation_split=0.2,
    subset="training",
    seed=123,
    image_size=(img_height, img_width),
    batch_size=batch_size)

# 검증 전용 데이터 샛 20%의 데이터를 가지고 있음 머신러닝을 진행할때 훈련 데이터 80%와 검증 데이터 20%로 분할해서 테스트해야 더욱 안정적으로 훈련이 가능하다.
val_ds = tf.keras.preprocessing.image_dataset_from_directory(
    data_dir,
    validation_split=0.2,
    subset="validation",
    seed=123,
    image_size=(img_height, img_width),
    batch_size=batch_size)

# 저장한 데이터샛의 분할된 클래스를 list 형태로 받는다.
class_names = train_ds.class_names

# 아직 뭔지 모름
AUTOTUNE = tf.data.experimental.AUTOTUNE

# 아직 뭔지 모름
train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)
val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE)

# 아직 뭔지 모름
normalization_layer = layers.experimental.preprocessing.Rescaling(1./255)

# 아직 뭔지 모름
normalized_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
image_batch, labels_batch = next(iter(normalized_ds))
first_image = image_batch[0]
print(np.min(first_image), np.max(first_image))

# 클래스 네임 list의 클래스 갯수
num_classes = 5

# 이해가 안됌
data_augmentation = keras.Sequential(
    [
        layers.experimental.preprocessing.RandomFlip("horizontal", 
        input_shape=(img_height, img_width, 3)),
        layers.experimental.preprocessing.RandomRotation(0.1),
        layers.experimental.preprocessing.RandomZoom(0.1),
    ]
)

# 모델을 생성한다.
model = Sequential([
    data_augmentation, # 모르겟음
    layers.experimental.preprocessing.Rescaling(1./255), # 모르겠음
    layers.Conv2D(16, 3, padding='same', activation='relu'), # 컨블루션 진행 padding을 same으로 설정하고 활성화 함수를 relu로 설정한다. 필터 갯수를 16개로 설정하며 합성곱을 3x3형태로 진행
    layers.MaxPooling2D(), # maxpooling 진행
    layers.Conv2D(32, 3, padding='same', activation='relu'), # 컨블루션 진행
    layers.MaxPooling2D(), # maxpooling 진행
    layers.Conv2D(64, 3, padding='same', activation='relu'), # 컨블루션 진행
    layers.MaxPooling2D(), # maxpooling 진행
    layers.Dropout(0.2), # 모르겟음
    layers.Flatten(), # 패턴 추출 1D 백터형태로 반환 한것을 3D로 변경하는 작업
    # Dense층을 추가하여 최종적으로 모델 생성 진행
    layers.Dense(128, activation='relu'),
    layers.Dense(num_classes)
])

# 컴파일 진행 옵티마이저 adam, 설정 손실 함수 설정, 어큐러시 측정 설정
model.compile(optimizer='adam',
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    metrics=['accuracy'])

epochs = 15

# 15번 훈련을 진행 테스트 훈련과 훈련을 진행
history = model.fit(
  train_ds,
  validation_data=val_ds,
  epochs=epochs
)

# 최종 훈련 결과 그래프화
acc = history.history['accuracy']
val_acc = history.history['val_accuracy']

loss = history.history['loss']
val_loss = history.history['val_loss']

epochs_range = range(epochs)

plt.figure(figsize=(8, 8))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Training Accuracy')
plt.plot(epochs_range, val_acc, label='Validation Accuracy')
plt.legend(loc='lower right')
plt.title('Training and Validation Accuracy')

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Training Loss')
plt.plot(epochs_range, val_loss, label='Validation Loss')
plt.legend(loc='upper right')
plt.title('Training and Validation Loss')
plt.show()

'''
# 원래 있던 이미지 예측 코드가 이상해서 내가 직접 수정함. 재훈련 하지 않고 이미지만 놓으면 훈련결과를 예측하게 만듬
# 이미지 로드
image_data = 'sunflower_data.jpg'
# path 변수에 경로지정
path = '/content/' + image_data

# 이미지 로드하여 훈련 사이즈로 이미지 변환
img = keras.preprocessing.image.load_img(
    path, target_size=(img_height, img_width)
)

# 배열형태로 저장
img_array = keras.preprocessing.image.img_to_array(img)
img_array = tf.expand_dims(img_array, 0) # Create a batch

# 재훈련하지않고 이미지 배열형태로 저장한 데이터를 원래 훈련되있던 모델로 예측시작
predictions = model.predict(img_array)
# 훈련 스코어 받아옴
score = tf.nn.softmax(predictions[0])

# 가장 예측 스코프가 높은 데이터를 class_name에 있는 데이터와 비교해서 가져옴
print(
    "This image most likely belongs to {} with a {:.2f}% percent confidence."
    .format(class_names[np.argmax(score)], 100 * np.max(score))
)
'''


'''
# 전에 했던 코드
import tensorflow as tf
from tensorflow.keras import datasets, layers, models
import numpy as np 
import matplotlib.pyplot as plt

# 손글씨와 숫자로만 이루어진 데이터 Set을 로드하여 저장
(train_images, train_labels), (test_images, test_labels) = datasets.mnist.load_data()

# 이미지를 재설정하지 않으면 shape의 값을 알수 없기 때문에 튜플형태로 재설정을 함, 초기화 방법 데이터변수.reshape((도합데이터 갯수, image_height, image_width, 두꺠(strid)))
train_images = train_images.reshape((60000, 28, 28, 1))
test_images = test_images.reshape((10000, 28, 28, 1))

# px 범위 0~1 사이로 정규화
train_images, test_images = train_images / 255.0, test_images / 255.0

# Sequential 형태로 모델 생성
model = models.Sequential()

# 컨블루션 으로 설정 밤법 layers.Conv2D(총필터갯수, (높이, 너비), activation='활성화 함수', input_shape(높이, 너비, 두깨)) 활성화 함수 relu는 그래프상 양수 값만 따지고 음수값은 0으로 무시하겠다는 함수 컨블루션을 할시 28x28이 26x26이 된다.
model.add(layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)))

# MaxPooling 진행 2x2 사이즈로 Pooling시 원래 필터에서 2배가 감소함 : 13x13
model.add(layers.MaxPooling2D((2, 2)))

# 컨블루션 진행 11x11
model.add(layers.Conv2D(64, (3, 3), activation='relu'))

# 컨블루션 진행 5x5
model.add(layers.MaxPooling2D((2, 2)))

# Pooling 진행 3x3
model.add(layers.Conv2D(64, (3, 3), activation='relu'))

# 현재 출력은 3D 텐서이다. 먼저 3D 출력을 1D로 평평하게 (또는 펼친 다음) 위에 하나 이상의 Dense 레이어를 추가 576 백터
model.add(layers.Flatten())

# 모델을 완성하기 위해 컨벌루션베이스 (모양 (4, 4, 64))의 마지막 출력 텐서를 하나 이상의 Dense 레이어로 공급하여 분류를 수행 64 Flatten
model.add(layers.Dense(64, activation='relu'))

# 10 개의 출력 클래스가 있으므로 10 개의 출력이있는 최종 Dense 레이어를 사용 10 classes 활성화 함수를 softmax로 설정한다.
model.add(layers.Dense(10, activation='softmax'))

# 모델 계층 출력
model.summary()

# 옵티마지어와, 손실함수(loss) 어큐러시를 설정
model.compile(optimizer='adam',
    loss='sparse_categorical_crossentropy',
    metrics=['accuracy'])

# 모델 학습 epochs=분류 갯수
epochs=5

history = model.fit(train_images, train_labels, epochs=epochs, validation_data=(test_images, test_labels))

# 어큐러시 테스트 서버와 훈련 가중치 서버 측정
acc = history.history['accuracy']
val_acc = history.history['val_accuracy']

loss = history.history['loss']
val_loss = history.history['val_loss']

print('total_accuracy : ', acc)
print('loss function : ', loss)
print('test_server-total_accuracy : ', val_acc)
print('test_server-loss function : ', val_loss)

# 어큐러시 상태 그래프화
epochs_range = range(epochs)

plt.figure(figsize=(8, 8))
plt.subplot(1, 2, 1)
plt.plot(epochs_range, acc, label='Training Accuracy')
plt.plot(epochs_range, val_acc, label='Validation Accuracy')
plt.legend(loc='lower right')
plt.title('Training and Validation Accuracy')

plt.subplot(1, 2, 2)
plt.plot(epochs_range, loss, label='Training Loss')
plt.plot(epochs_range, val_loss, label='Validation Loss')
plt.legend(loc='upper right')
plt.title('Training and Validation Loss')
plt.show()
'''