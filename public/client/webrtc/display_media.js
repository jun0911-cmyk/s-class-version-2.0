var sdpCheck;

export function displayMedia(navigator, localVideo, rtcPeerConnection, my_screen_video, sendMessage, ScreenSendMessage, DevicesRtcPeerConnection, screen) {
    navigator.mediaDevices.getDisplayMedia({
        video: {
            cursor: "always"
        },
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            sampleRate: 44100
        }
    }).then(function(screenStream){
        localVideo.srcObject = screenStream;
        screenStream.getTracks().forEach(track => rtcPeerConnection.addTrack(track));
        my_screen_video.disabled = false;
        screen.disabled = true;

        ScreenSendMessage('CONNECT_SCREEN', 1);

        screenStream.getVideoTracks()[0].onended = function (track) {
            my_screen_video.disabled = true;
            screen.disabled = false;
            localVideo.srcObject = null;
            ScreenSendMessage('CLOSE_SCREEN', 1);
        }
    }).catch(function(e){
        console.log(e)
    });
}

export function displayConnectProtocol(DevicesRtcPeerConnection, sendMessage, onMessage) {
    function callDispalyMedia_protocol() {
        sendMessage('SCREEN_SDP', sdpCheck);
    }

    async function displayMedia_protocol() {
        const sdpOffer = await DevicesRtcPeerConnection.createOffer();
        DevicesRtcPeerConnection.setLocalDescription(sdpOffer);
        sendMessage('SCREEN_SDP', sdpOffer);
        sdpCheck = sdpOffer;
    } 

    if (sdpCheck !== undefined) {
        callDispalyMedia_protocol();
        return;
    }

    if (sdpCheck === undefined) {
        DevicesRtcPeerConnection.addEventListener('negotiationneeded', displayMedia_protocol);
    }

    onMessage('SCREEN_SDP', sdpAnswer => {
        DevicesRtcPeerConnection.setRemoteDescription(new RTCSessionDescription(sdpAnswer)); 
    });

    DevicesRtcPeerConnection.addEventListener('icecandidate', e => {
        if (e.candidate === null) return;
        sendMessage('SCREEN_ICE', e.candidate)  
    });

    onMessage('SCREEN_ICE', iceCandidate => {
        DevicesRtcPeerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
    });
}

export function RemoteDisplayConnectProtocol(DevicesRtcPeerConnection, remoteScreenVieo, sendMessage, onMessage) {
    async function sendScreenSdpAnswer(sdpOffer) {
        await DevicesRtcPeerConnection.setRemoteDescription(new RTCSessionDescription(sdpOffer)); 
        const sdpAnswer = await DevicesRtcPeerConnection.createAnswer();
        await DevicesRtcPeerConnection.setLocalDescription(sdpAnswer);
        sendMessage('SCREEN_SDP', sdpAnswer);
    }

    onMessage('SCREEN_SDP', sendScreenSdpAnswer);

    DevicesRtcPeerConnection.addEventListener('icecandidate', e => {
        if (e.candidate === null) return;
        sendMessage('SCREEN_ICE', e.candidate)  
    });

    onMessage('SCREEN_ICE', iceCandidate => {
        DevicesRtcPeerConnection.addIceCandidate(new RTCIceCandidate(iceCandidate));
    });

    DevicesRtcPeerConnection.addEventListener('track', e => {
        remoteScreenVieo.srcObject = new MediaStream([e.track])
    });
}