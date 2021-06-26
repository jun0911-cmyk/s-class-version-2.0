export function inviteStatus(socket, user) {
    socket.emit('inviteStatus', user);
    socket.on('notInvite', function(result) {
        Swal.fire(
            '강사 없음',
            `현재 ${result.email}님은 현재 강사가 없습니다!`,
            'success'
        )
    });

    socket.on('inviteStatus', function(result) {
        Swal.fire(
            '강사 확인',
            `강사 이름 : ${result.select_teacher} 승인상태 : 승인완료`,
            'success'
        )
    });
}