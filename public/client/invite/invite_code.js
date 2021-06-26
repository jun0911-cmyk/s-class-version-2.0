export async function invite_code(socket, user) {
    const { value: InviteCode } = await Swal.fire({
        title: `강사 코드입력`,
        input: 'text',
        inputLabel: '강의실 강사 코드를 입력해주세요 ( 대소문자 구분 필수 )',
        inputPlaceholder: '여기에 강사 코드를 입력해주세요...'
    });

    if (InviteCode) {
        Swal.fire(
            `입력 확인`,
            `입력하신 코드 번호가 ${InviteCode}가 맞으십니까?`,
            'info'
        ).then((result) => {
            if (result.isConfirmed) {
                socket.emit('checkInviteCode', InviteCode);
            }
        });
    }

    socket.on('success_code', function(InviteCode, Teacherresult) {
        Swal.fire({
            icon: 'info',
            title: `강사 확인`,
            text: `해당 초대 코드의 강사는 ${Teacherresult.user_id}번 강사입니다. 해당 강사가 맞으십니까?`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `네`,
            cancelButtonText: '아니요'
        }).then((result) => {
            if (result.isConfirmed) {
                socket.emit('AddInvite', Teacherresult.email, user);
            } else {
                Swal.fire(
                    `요청 취소`,
                    '요청자가 요청을 취소하였습니다.',
                    'error'
                );
            }
        });
    });

    socket.on('userOverlap', function(classname) {
        Swal.fire(
            `요청 취소`,
            `${classname} 강사로 이미 요청을 보내셨습니다.`,
            'error'
        );
    });

    socket.on('successInvite', function(result) {
        Swal.fire(
            `요청 전송 성공!`,
            `강사요청이 성공적으로 완료되었습니다!`,
            'success'
        ).then(function(resultData) {
            location.reload();
        });
    });

    socket.on('fail_code', function(InviteCode) {
        Swal.fire(
            `요청 전송 실패`,
            `${InviteCode} 코드는 올바르지 않은 코드입니다.`,
            'error'
        )
    });
}