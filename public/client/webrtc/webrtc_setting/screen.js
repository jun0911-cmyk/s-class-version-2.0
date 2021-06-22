'use strict';

import {ScreenSendMessage, ScreenOnMessage} from "../webrtc_protocol/signaling_client.js";
import {RemoteDisplayConnectProtocol} from "../webrtc_protocol/display_media.js";

const video = document.getElementById('screenVideo'); 
const DevicesRtcPeerConnection = new RTCPeerConnection({
    iceServers: [{
        urls: 'stun:stun.l.google.com:19302'
    }]
});

$(function() {
    $.ajax({
        url: '/class/live/room/classroom/screen/:id&:pwd',
        datatype: 'json',
        type: 'POST',
        data: {
        },   
        success: function(result) {
            var user = result.user;
            var roomId = result.roomid;

            ScreenOnMessage('CONNECT_SCREEN', function(data) {
                if (data) {
                    RemoteDisplayConnectProtocol(DevicesRtcPeerConnection, video, ScreenSendMessage, ScreenOnMessage);
                }
            });

            ScreenOnMessage('CLOSE_SCREEN', function(data) {
                if (data) {
                    window.close();
                }
            });
        }
    });
}); 