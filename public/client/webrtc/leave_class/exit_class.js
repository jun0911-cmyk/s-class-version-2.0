export function host_leave_class(socket, remoteVideo) {
    socket.on('leave_class', function(roomId) {
    });
}

export function leave_call(socket, roomId, user) {
    document.getElementById('exit_class').addEventListener('click', e => {
        Swal.fire({
            title: `정말로 ${roomId}번 강의실을 나가시겠습니까?`,
            text: "강의실을 나가시려면 나가기를 클릭해주세요.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '나가기',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    '승인코드 : 205',
                    '강의실을 나가셨습니다.',
                    'success'
                ).then((leave) => {
                    if (leave.isConfirmed) {
                        socket.emit('leave_class', roomId, user);
                        window.close();
                    } else {
                        socket.emit('leave_class', roomId, user);
                        window.close();
                    }
                });
            }
        });
    });
}

export function client_leave_class(socket, user) {
    socket.on('leave_class', function(roomId) {
    });
}