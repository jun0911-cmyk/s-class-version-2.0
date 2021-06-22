'use strict';

const get_audioElement = document.querySelector('audio#localAudio');
const get_videoElement = document.querySelector('video#localVideo');
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

function gotAudio(stream) {
    window.stream = stream;
    get_audioElement.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
}
  
function audio_start() {
    const audioSource = audioInputSelect.value;
    const constraints = {
        audio: {deviceId: audioSource ? {exact: audioSource} : undefined}
    };
    navigator.mediaDevices.getUserMedia(constraints).then(gotAudio).then(updateDevicesList).catch(handleError);
}

function gotVideo(stream) {
    window.stream = stream;
    get_videoElement.srcObject = stream;
    return navigator.mediaDevices.enumerateDevices();
}
  
function video_start() {
    const videoSource = videoSelect.value;
    const constraints = {
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    navigator.mediaDevices.getUserMedia(constraints).then(gotVideo).then(updateDevicesList).catch(handleError);
}

//audioInputSelect.onchange = audio_start;
//audioOutputSelect.onchange = audioOutPutChange;
//videoSelect.onchange = video_start;