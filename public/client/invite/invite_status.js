export function inviteStatus(socket, user) {
    socket.emit('inviteStatus', user);
    socket.on('notInvite', function(result) {
        Swal.fire(
            '현황 없음',
            `현재 ${result.email}님은 현재 참가 요청한 강사가 없습니다!`,
            'success'
        )
    });

    socket.on('inviteStatus', function(result) {
        if (result.access_status == 0) {
            Swal.fire(
                '현황 확인',
                `현재 요청한 강사 이름 : ${result.select_teacher}, 요청 상태 : 보류중`,
                'success'
            )
        } else if (result.access_status == 1) {
            Swal.fire(
                '현황 확인',
                `현재 요청한 강사 이름 : ${result.select_teacher}, 요청 상태 : 승인되었습니다!`,
                'success'
            )
        }
    });
}