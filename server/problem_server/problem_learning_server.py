import matplotlib.pyplot as plt
import numpy as np
import os
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers
from tensorflow.keras.models import Sequential

# 너비, 높이, 소그룹 데이터 갯수
batch_size = 32
img_height = 180
img_width = 180

data_dir = 'C:/Users/jun09/.keras/datasets/paper_checkes'

print(data_dir)

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
print(train_ds)
class_names = train_ds.class_names

# tf.data 런타임이 실행 시에 동적으로 값을 조정한다.
AUTOTUNE = tf.data.experimental.AUTOTUNE

print(AUTOTUNE)

# 데이터 셋을 메모리 또는 로컬 저장소에 개시한다. 셔플은 반한된 요소들의 내부 버퍼를 사용한다. 첫 번째 에포크 동안 디스크에서로드 된 후 이미지를 메모리에 보관합니다. 이렇게하면 모델을 학습하는 동안 데이터 세트가 병목 현상이 발생하지 않습니다. 데이터 세트가 너무 커서 메모리에 맞지 않는 경우이 방법을 사용하여 고성능 온 디스크 캐시를 만들 수도 있습니다.
train_ds = train_ds.cache().shuffle(1000).prefetch(buffer_size=AUTOTUNE)

val_ds = val_ds.cache().prefetch(buffer_size=AUTOTUNE) # 훈련하는 동안 데이터 전처리 및 모델 실행과 겹칩니다.

# RGB 채널 값이 [0, 255]범위 내에 있습니다. 이것은 신경망에 이상적이지 않습니다. 일반적으로 입력 값을 작게 만들어야합니다. 여기에서는 [0, 1]Rescaling 레이어를 사용하여 값이 범위 내에 있도록 표준화합니다 .
normalization_layer = layers.experimental.preprocessing.Rescaling(1./255)

# 이 레이어를 사용하는 방법에는 두 가지가 있습니다. map을 호출하여 데이터 세트에 적용 할 수 있습니다. 또는 모델 정의 내에 계층을 포함하여 배포를 단순화 할 수 있습니다
normalized_ds = train_ds.map(lambda x, y: (normalization_layer(x), y))
image_batch, labels_batch = next(iter(normalized_ds))
first_image = image_batch[0]
print(np.min(first_image), np.max(first_image))

# 클래스 네임 list의 클래스 갯수
num_classes = 3

# 과적 합은 일반적으로 훈련 예제가 적을 때 발생합니다. 데이터 증가 는 기존 예제에서 믿을 수있는 이미지를 생성하는 임의 변환을 사용하여 추가 훈련 데이터를 생성하는 접근 방식을 취합니다. 이렇게하면 모델을 데이터의 더 많은 측면에 노출하고 더 잘 일반화 할 수 있습니다.
# 의 레이어를 사용하여 데이터 증대를 구현합니다 tf.keras.layers.experimental.preprocessing. 이들은 다른 레이어와 마찬가지로 모델 내부에 포함될 수 있으며 GPU에서 실행될 수 있습니다.
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
    data_augmentation,
    layers.experimental.preprocessing.Rescaling(1./255),
    layers.Conv2D(16, 3, padding='same', activation='relu'), # 컨블루션 진행 padding을 same으로 설정하고 활성화 함수를 relu로 설정한다. 필터 갯수를 16개로 설정하며 합성곱을 3x3형태로 진행
    layers.MaxPooling2D(), # maxpooling 진행
    layers.Conv2D(32, 3, padding='same', activation='relu'), # 컨블루션 진행
    layers.MaxPooling2D(), # maxpooling 진행
    layers.Conv2D(64, 3, padding='same', activation='relu'), # 컨블루션 진행
    layers.MaxPooling2D(), # maxpooling 진행
    layers.Dropout(0.2), # 드롭 아웃은 0.1, 0.2, 0.4 등의 형식으로 소수를 입력 값으로 사용합니다. 이는 적용된 레이어에서 출력 단위의 10 %, 20 % 또는 40 %를 무작위로 제거하는 것을 의미합니다.
    layers.Flatten(), # 현재 출력은 3D 텐서이다. 먼저 3D 출력을 1D로 평평하게 (또는 펼친 다음) 위에 하나 이상의 Dense 레이어를 추가한다.
    layers.Dense(128, activation='relu'), # 모델을 완성하기 위해 컨벌루션베이스 (모양 (4, 4, 64))의 마지막 출력 텐서를 하나 이상의 Dense 레이어로 공급하여 분류를 수행 64 Flatten
    layers.Dense(num_classes) # 최종 모델 훈련 클래스 갯수 추가
])

# 컴파일 진행 옵티마이저 adam, 설정 손실 함수 설정, 어큐러시 측정 설정
model.compile(optimizer='adam',
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    metrics=['accuracy'])

model.summary()

epochs = 15

# 15번 훈련을 진행 테스트 훈련과 훈련을 진행
history = model.fit(
  train_ds,
  validation_data=val_ds,
  epochs=epochs
)

# 최종 훈련 결과 출력
loss, accuracy = model.evaluate(train_ds, verbose=2)

print('training accuracy : ', accuracy)
print('training loss : ', loss)

# 이미지 로드
image_data = 'test2.jpg'

# path 변수에 경로지정
path = 'C:/Users/jun09/OneDrive\desktop/s-class_system_version/s-class_version-2/server/problem_server/test_image/' + image_data

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