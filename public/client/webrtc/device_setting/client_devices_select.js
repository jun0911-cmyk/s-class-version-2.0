'use strict';

import {sendMessage, onMessage, ScreenSendMessage, ScreenOnMessage} from "../webrtc_protocol/signaling_client.js";

const socket = window.io();
const videoElement = document.querySelector('video#localVideo');
const videoSelect = document.querySelector('select#videoSource');
const audioOutputSelect = document.querySelector('select#audioOutput');
const audioInputSelect = document.querySelector('select#audioSource');
const selectors = [videoSelect, audioInputSelect, audioOutputSelect];

var videoSource;
var audioSource;
var audioDestination;
var roomId;

$(function() {
    $.ajax({
        url: '/class/live/room/classroom/setting/:id&:pwd',
        datatype: 'json',
        type: 'POST',
        data: {
        },   
        success: function(result) {
            roomId = result.roomid;
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});

$('#loading').hide();
$('#btn').show();

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
    audioDestination = audioOutputSelect.value;
    videoElement.setSinkId(audioDestination)
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
    audioSource = audioInputSelect.value;
    videoSource = videoSelect.value;
    const constrains = {
        audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
        video: {deviceId: videoSource ? {exact: videoSource} : undefined}
    };
    navigator.mediaDevices.getUserMedia(constrains).then(gotStream).then(updateDevicesList).catch(err => {
        Swal.fire(
            '미리보기에 연결할 수 없습니다.',
            `오디오 또는 비디오에 연결할수 없습니다. 오디오 비디오를 허용여부를 거부했는지 확인해주세요.`,
            'error'
        )
    });
}

audioInputSelect.onchange = media_stream;
audioOutputSelect.onchange = audioOutPutChange;
videoSelect.onchange = media_stream;

media_stream();

document.getElementById('btn').addEventListener('click',function(e) {
    $('#loading').show();
    $('#btn').hide();
    console.log(videoSource, audioSource, audioDestination);
    localStorage.setItem('videoSource', videoSource);
    localStorage.setItem('audioSource', audioSource);
    localStorage.setItem('audioOutPutSinkid', audioDestination);
    location.href = `/class/live/room/classroom/${roomId}&testing&testing/`;
});