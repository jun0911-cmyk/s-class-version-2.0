export function WaitingRoom(socket) {
    socket.on('host_waiting_room', function(roomId , user) {
        Swal.fire({
            title: `강의실 접속시도자 확인됨 시도자 이메일 : ${user.email}`,
            text: "접속시도자가 접속을 시도하고 있습니다 현재 대기실로 이동시켰으며 승인하시려면 승인을 클릭해주세요.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '승인',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                socket.emit('acknowledgment_class', roomId, user.email);
            } else {
                socket.emit('unlicensed_class', roomId, user.email);
            }
        });
    });
}