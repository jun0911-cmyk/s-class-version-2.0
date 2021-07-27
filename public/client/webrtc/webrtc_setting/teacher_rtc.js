'use strict';

import {sendMessage, onMessage, ScreenSendMessage, ScreenOnMessage} from "../webrtc_protocol/signaling_client.js";
import {host_leave_class} from "../leave_class/exit_class.js";
import {delete_call, host_delete_class} from "../leave_class/delete_class.js";
import {mute_audio, enabled_video} from "../device_setting/devices_mute.js";
import {displayMedia, displayConnectProtocol} from "../webrtc_protocol/display_media.js";
import {WaitingRoom} from "../wait_room/host_waiting_room.js";
//import {select_devicesList} from "../device_setting/select_devices.js";
//import {audio_devices_setting} from "../device_setting/select_devices_setting.js";
import {attendanceCheck} from "../attendance/attendance_check.js";
import {problem_search} from "../problem_books/select_problem.js";
//import {SDPOfferProtoCol, SDPStatusProtoCol} from "../webrtc_protocol/p2p_protocol.js";

const socket = window.io();
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const attendance = document.getElementById('user_checks');
const localScreenVideo = document.getElementById('localScreenVideo');
const my_video = document.getElementById('my_video');
const my_screen_video = document.getElementById('my_screen_video');
const muteAudio = document.getElementById('audios');
const muteVideo = document.getElementById('videos');
const screen = document.getElementById('screens');
const videoSelect = document.getElementById('VideoSelect');
const problem_book = document.getElementById('levels');
const audioOutputSelect = document.getElementById('AudioOutputSelect');
const audioInputSelect = document.getElementById('AudioInputSelect');
const selectors = [videoSelect, audioInputSelect, audioOutputSelect];
const rtcPeerConnection = new RTCPeerConnection({
    iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
    }]
});

const DevicesRtcPeerConnection = new RTCPeerConnection({
    iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
    }]
});

$(function() {
    $.ajax({
        url: '/class/live/room/classroom/:id&:pwd',
        datatype: 'json',
        type: 'POST',
        data: {
        },   
        success: function(result) {
            var user = result.user;
            var roomId = result.roomid;
            var localStream;
            var videoSource = localStorage.getItem('videoSource');
            var audioSource = localStorage.getItem('audioSource');
            var audioOutPutSinkid = localStorage.getItem('audioOutPutSinkid');

            WaitingRoom(socket);

            $('#localScreenVideo').hide();

            // MediaStream connect
            muteAudio.addEventListener('click', audios);
            muteVideo.addEventListener('click', videos);
            attendance.addEventListener('click', attendanceCheck);
            problem_book.addEventListener('click', problem_page);
        
            function audios() {
                mute_audio(localVideo, localStream);
            }
        
            function videos() {
                enabled_video(localVideo, localStream);
            }

            function problem_page() {
                problem_search(user, roomId);
            }

            if (audioOutPutSinkid != undefined) {
                localVideo.setSinkId(audioOutPutSinkid);
            }

            navigator.mediaDevices.getUserMedia({
                audio: {deviceId: audioSource ? {exact: audioSource} : undefined},
                video: {deviceId: videoSource ? {exact: videoSource} : undefined}
            }).then(stream => {
                stream.getVideoTracks().forEach(function(track) {
                    track.enabled = false;
                });
            
                stream.getAudioTracks().forEach(function(track) {
                    track.enabled = false;
                });

                localVideo.srcObject = stream;
                localStream = stream;

                localStorage.removeItem('videoSource');
                localStorage.removeItem('audioSource');
                localStorage.removeItem('audioOutPutSinkid');
            }).catch(err => {
                Swal.fire(
                    '강의실에 연결할 수 없습니다.',
                    `내 화면을 킬 수 없습니다. 다른 장치를 선택해주세요. ${err.name}`,
                    'error'
                )
            });
            
            my_screen_video.disabled = true;
            
            socket.emit('created_class', roomId, user);

            socket.on('created_class', function(host) {
                console.log(`성공적으로 생성되었습니다. 생성된 강의실 ID : ${host.id} 강의실 이름 : ${host.name}`);
                
                screen.addEventListener('click', display);

                function display() {
                    sendMessage('CONNECTION_SCREEN', host);
                    
                    displayMedia(navigator, localScreenVideo, DevicesRtcPeerConnection, my_screen_video, sendMessage, ScreenSendMessage, DevicesRtcPeerConnection, screen);
                    
                    displayConnectProtocol(DevicesRtcPeerConnection, ScreenSendMessage, ScreenOnMessage);
                }
                
                my_video.addEventListener('click', () => {
                    $('#localScreenVideo').hide();
                    $('#localVideo').show();
                });

                my_screen_video.addEventListener('click', () => {
                    $('#localScreenVideo').show();
                    $('#localVideo').hide();
                });
            });

            socket.on('join', function(client) {
                console.log(client);
            });

            host_leave_class(socket, remoteVideo);
            delete_call(socket, roomId);
            host_delete_class(socket);
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});