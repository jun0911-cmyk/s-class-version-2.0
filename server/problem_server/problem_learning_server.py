import tensorflow as tf
from tensorflow.keras import datasets, layers, models
import numpy as np 
import matplotlib.pyplot as plt

# 손글씨와 숫자로만 이루어진 데이터 Set을 로드하여 저장
(train_images, train_labels), (test_images, test_labels) = datasets.mnist.load_data()

# 이미지를 재설정하지 않으면 shape의 값을 알수 없기 때문에 튜플형태로 재설정을 함, 초기화 방법 데이터변수.reshape((도합데이터 갯수, image_height, image_width, 두꺠))
train_images = train_images.reshape((60000, 28, 28, 1))
test_images = test_images.reshape((10000, 28, 28, 1))

# px 범위 0~1 사이로 정규화
train_images, test_images = train_images / 255.0, test_images / 255.0

# Sequential 형태로 모델 생성
model = models.Sequential()

# 컨블루션 으로 설정 밤법 layers.Conv2D(총필터갯수, (높이, 너비), activation='활성화 함수', input_shape(높이, 너비, 두깨)) 활성화 함수 relu는 그래프상 양수 값만 따지고 음수값은 0으로 무시하겠다는 함수
model.add(layers.Conv2D(32, (3, 3), activation='relu', input_shape=(28, 28, 1)))

# MaxPooling 진행 2x2 사이즈로 Pooling시 원래 필터에서 2배가 감소함
model.add(layers.MaxPooling2D((2, 2)))

# 컨블루션 진행
model.add(layers.Conv2D(64, (3, 3), activation='relu'))

# 컨블루션 진행
model.add(layers.MaxPooling2D((2, 2)))

# Pooling 진행
model.add(layers.Conv2D(64, (3, 3), activation='relu'))

# 3D 피쳐 맵 백터로 1D 형태로 피쳐맵을 바꿈
model.add(layers.Flatten())

# 현재 출력은 3D 텐서이다. 먼저 3D 출력을 1D로 평평하게 (또는 펼친 다음) 위에 하나 이상의 Dense 레이어를 추가
model.add(layers.Dense(64, activation='relu'))

# 10 개의 출력 클래스가 있으므로 10 개의 출력이있는 최종 Dense 레이어를 사용
model.add(layers.Dense(10))

# 모델 계층 출력
model.summary()

# 옵티마지어와, 손실함수(loss) 어큐러시를 설정
model.compile(optimizer='adam',
    loss=tf.keras.losses.SparseCategoricalCrossentropy(from_logits=True),
    metrics=['accuracy'])

# 모델 학습 epochs=분류 갯수
history = model.fit(train_images, train_labels, epochs=10, validation_data=(test_images, test_labels))

# 정확도 계산 verobse 0 = silent, 1 = progress bar, 2 = one line per epoch
test_loss, test_acc = model.evaluate(test_images,  test_labels, verbose=2)

print('종합 어큐러시 : ', test_acc)

# 어큐러시 상태 그래프화
plt.plot(history.history['accuracy'], label='accuracy')
plt.plot(history.history['val_accuracy'], label = 'val_accuracy')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.ylim([0.7, 1])
plt.legend(loc='lower right')
plt.show()