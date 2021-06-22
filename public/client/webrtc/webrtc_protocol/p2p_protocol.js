/* 클라이언트 강의실 새로고침 확인하여 종료 시킴
async function removeClient(rtcPeerConnection, localVideo, localStream, remoteVideo, roomId) {
    if (rtcPeerConnection.iceConnectionState == 'closed') {
        var track = await localStream.getVideoTracks()[0];
        await rtcPeerConnection.removeTrack(track);
        localVideo.srcObject = null;
        remoteVideo.srcObject = null;
        Swal.fire(
            '강의실을 나가셨습니다.',
            `사용자의 페이지 새로고침이 감지 되어 통신이 종료되었습니다. 오류코드 : 400 강제종료 강의실 : ${roomId}`,
            'warning'
        ).then((result) => {
            if (result.isConfirmed) {
                socket.emit('client_leave', roomId);
                window.close();
            } else {
                socket.emit('client_leave', roomId);
                window.close();
            }
        });
    }
}*/