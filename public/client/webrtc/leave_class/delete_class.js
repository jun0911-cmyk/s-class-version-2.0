export function delete_call(socket, roomId) {
    document.getElementById('delect_class').addEventListener('click', e => {
        Swal.fire({
            title: '강의실을 정말로 종료하시겠습니까?',
            text: "종료하시려면 종료를 눌러주세요.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '종료',
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    '승인코드 : 205',
                    '강의실이 종료되었습니다.',
                    'success'
                ).then((leave) => {
                    if (leave.isConfirmed) {
                        socket.emit('close_class', roomId);
                        window.close();
                    } else {
                        socket.emit('close_class', roomId);
                        window.close();
                    }
                });
            }
        });
    });
}

export function host_delete_class(socket) {
    /*socket.on('close_class', function(roomId) {
        alert(`${roomId}번 강의실에 강의가 종료되었습니다.`);
        window.close();
    });*/
}

export function client_close_class(socket) {
    socket.on('close_class', function(roomId) {
        Swal.fire(
            '강의실 종료',
            `호스트에의해 ${roomId}번 강의실이 종료되었습니다.`,
            'warning'
        ).then((leave) => {
            if (leave.isConfirmed) {
                window.close();
            } else {
                window.close();
            }
        });
    });
}