'use strict';

import {sendMessage, onMessage} from "../webrtc_protocol/signaling_client.js";
import {leave_call, client_leave_class} from "../leave_class/exit_class.js";
import {mute_audio, enabled_video} from "../device_setting/devices_mute.js";
import {client_close_class} from "../leave_class/delete_class.js";
// import {SDPAnswerProtoCol} from "../webrtc_protocol/p2p_protocol.js";

const socket = window.io();
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');
const muteAudio = document.getElementById('audios');
const muteVideo = document.getElementById('videos');
const rtcPeerConnection = new RTCPeerConnection({
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

            // MediaStream connect
            muteAudio.addEventListener('click', audios);
            muteVideo.addEventListener('click', videos);
        
            function audios() {
                mute_audio(localVideo, localStream);
            }
        
            function videos() {
                enabled_video(localVideo, localStream);
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

                var track = stream.getVideoTracks()[0];
                rtcPeerConnection.addTrack(track, stream);

                localStorage.removeItem('videoSource');
                localStorage.removeItem('audioSource');
                localStorage.removeItem('audioOutPutSinkid');
            });
            
            socket.emit('joined_class', roomId, user);

            socket.on('joined_class', function(client) {
                console.log(`${client.connect_room}번 강의실에 성공적으로 참가하였습니다.`);

                onMessage('CONNECTION_SCREEN', function(data) {
                    if (data.id == roomId) {
                        window.open(`/class/live/room/classroom/screen/10329912&testing&testing`);
                    }
                });
            });

            leave_call(socket, roomId, user);
            client_leave_class(socket, user);
            client_close_class(socket);
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
}); 
