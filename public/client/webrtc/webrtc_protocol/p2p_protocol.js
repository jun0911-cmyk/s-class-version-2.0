var tracks;
var trackStatus;

class TrackManager {
    constructor(stream, rtcPeerConnection) {
        this.stream = stream;
        this.rtcPeerConnection = rtcPeerConnection;
        this.sender;
        this.track;
    }
    
    addTrack() {
        this.track = this.stream.getVideoTracks()[0];
        this.sender = this.rtcPeerConnection.addTrack(this.track, this.stream);
        trackStatus = this.sender;
    }

    removeTrack() {
        this.rtcPeerConnection.removeTrack(trackStatus);
    }

    AddAndRemove() {
        this.removeTrack();
        this.addTrack();
    }
}

export async function SDPStatusProtoCol(navigator, remoteVideo, localVideo, socket, roomId, stream, status, client) {
    console.log(status);
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
            SDPOfferProtoCol(navigator, remoteVideo, localVideo, socket, roomId, stream)
        }
    }
}

export async function SDPOfferProtoCol(navigator, remoteVideo, localVideo, socket, roomId, stream) {
    var localStream;

    const rtcPeerConnection = await new RTCPeerConnection({
        iceServers: [{
            urls: 'stun:stun.l.google.com:19302'
        }]
    });

    await navigator.mediaDevices.getUserMedia({
        audio: true, 
        video: true
    }).then(stream => {
        localVideo.srcObject = stream;
        localStream = stream;
    }).catch(err => {
        Swal.fire(
            '강의실에 연결할 수 없습니다.',
            `내 화면을 킬 수 없습니다. 다른 장치를 선택해주세요. ${err.name}`,
            'error'
        )
    });

    var trackStream = await localStream.getVideoTracks()[0];
    await rtcPeerConnection.addTrack(trackStream, localStream);
    
    try {
        const offer = await rtcPeerConnection.createOffer();
        await rtcPeerConnection.setLocalDescription(offer);
        socket.emit('offerCreate', offer, roomId);
    } catch {
        console.log('Offer Create Error');
    }

    socket.on('answerCreate', function(answer) {
        try {
            rtcPeerConnection.setRemoteDescription(answer);
        } catch {
            console.log('Peer SetremoteDescription Error');
        }
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

export async function SDPAnswerProtoCol(navigator, rtcPeerConnection, remoteVideo, socket, roomId) {
    async function sendSdpAnswer(sdpOffer) {
        try {
            await rtcPeerConnection.setRemoteDescription(sdpOffer); 
            const sdpAnswer = await rtcPeerConnection.createAnswer();
            await rtcPeerConnection.setLocalDescription(sdpAnswer);
            socket.emit('answerCreate', sdpAnswer, roomId);
        } catch {
            console.log('Answer Create Error');
        }
    }

    socket.on('offerCreate', function(offer) {
        sendSdpAnswer(offer);
    });
    
    rtcPeerConnection.addEventListener('icecandidate', e => {
        if (e.candidate === null) return;
        socket.emit('clienticeandidate', e.candidate, roomId);
    });

    socket.on('iceandidate', function(ice) {
        rtcPeerConnection.addIceCandidate(new RTCIceCandidate(ice));
    });
    
    rtcPeerConnection.addEventListener('track', e => {
        $('#loading').hide();
        remoteVideo.srcObject = new MediaStream([e.track])
    });
}