export function SDPStatusProtoCol(navigator, rtcPeerConnection, remoteVideo, status, socket, roomId) {
    if (status[1] === '1') { // defult
        if (status[0] == '1') {  
        }

        if (status[0] == '0') {
        }
    }

    if (status[1] === '0') { // new
        if (status[0] == '0') {
        }

        if (status[0] == '1') {
            async function sendSdpOffer() {
                const createOffer = await rtcPeerConnection.createOffer();
                rtcPeerConnection.setLocalDescription(createOffer);
                socket.emit('offerCreate', createOffer, roomId);
            }
        
            rtcPeerConnection.addEventListener('negotiationneeded', sendSdpOffer);
        
            socket.on('answerCreate', function(answer) {
                rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(answer));
            });
                
            rtcPeerConnection.addEventListener('icecandidate', e => {
                if (e.candidate === null) return;
                socket.emit('iceandidate', e.candidate, roomId);
            });
        
            socket.on('clienticeandidate', function(ice) {
                rtcPeerConnection.addIceCandidate(new RTCIceCandidate(ice));
            });
        
            rtcPeerConnection.addEventListener('track', e => {
                remoteVideo.srcObject = new MediaStream([e.track])
            });
        }
    }
}