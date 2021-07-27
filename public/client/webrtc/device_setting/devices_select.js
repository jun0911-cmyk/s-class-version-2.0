'use strict';

const videoElement = document.querySelector('video#localVideo');
const videoSelect = document.querySelector('select#availableCameras');
const audioOutputSelect = document.querySelector('select#availableOutPutAudios');
const audioInputSelect = document.querySelector('select#availableAudios');
const selectors = [videoSelect, audioInputSelect, audioOutputSelect];

audioOutputSelect.disabled = !('sinkId' in HTMLMediaElement.prototype);

function updateDevicesList() {
    navigator.mediaDevices.enumerateDevices().then((deviceInfos) => {
        const values = selectors.map(select => select.value);
        selectors.forEach(select => {
            while (select.firstChild) {
                select.removeChild(select.firstChild);
            }
        });
        for (let i = 0; i !== deviceInfos.length; ++i) {
            const deviceInfo = deviceInfos[i];
            const option = document.createElement('option');
            option.value = deviceInfo.deviceId;
            if (deviceInfo.kind === 'audioinput') {
                option.text = deviceInfo.label || `마이크 장치 검색중`;
                audioInputSelect.appendChild(option);
            } else if (deviceInfo.kind === 'audiooutput') {
                option.text = deviceInfo.label || `스피커 장치 검색중`;
                audioOutputSelect.appendChild(option);
            } else if (deviceInfo.kind === 'videoinput') {
                option.text = deviceInfo.label || `비디오 장치 검색중`;
                videoSelect.appendChild(option);
            } else {
                console.log('Some other kind of source/device: ', deviceInfo);
            }
        }
        selectors.forEach((select, selectorIndex) => {
            if (Array.prototype.slice.call(select.childNodes).some(n => n.value === values[selectorIndex])) {  
                select.value = values[selectorIndex];
            }
        });
    });
}

navigator.mediaDevices.enumerateDevices().then(updateDevicesList);

function handleError(error) {
    console.log('navigator.MediaDevices.getUserMedia error: ' + error.message + '  error name : ' + error.name);
}

function audioOutPutChange() {
    const audioDestination = audioOutputSelect.value;
    get_audioElement.setSinkId(audioDestination)
}

function gotStream(stream) {
    window.stream = stream;
    videoElement.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
}

function media_stream() {
    if (window.stream) {
        window.stream.getTracks().forEach(track => {
            track.stop();
        });
    }
    const audioSource = audioInputSelect.value;
    const videoSource = videoSelect.value;
    const constrains = {
        audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    navigator.mediaDevices.getUserMedia(constrains).then(gotStream).then(updateDevicesList).catch(err => {
        Swal.fire(
            '강의실에 연결할 수 없습니다.',
            `오디오 또는 비디오에 연결할수 없습니다. 다른 장치를 선택해주세요. ${err.name}`,
            'error'
        )
    });
}

audioInputSelect.onchange = media_stream;
audioOutputSelect.onchange = audioOutPutChange;
videoSelect.onchange = media_stream;