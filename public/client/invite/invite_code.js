export async function invite_code(socket, user) {
    const { value: InviteCode } = await Swal.fire({
        title: `강의실 참가하기`,
        input: 'text',
        inputLabel: '강의실 참가 코드를 입력해주세요 ( 대소문자 구분 필수 )',
        inputPlaceholder: '여기에 참가 코드를 입력해주세요...'
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
        console.log(user);
        Swal.fire({
            icon: 'info',
            title: `강사 확인`,
            text: `해당 초대 코드의 강사는 ${Teacherresult.class_host} 강사입니다. 해당 강사가 맞으십니까?`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `네`,
            cancelButtonText: '아니요'
        }).then((result) => {
            if (result.isConfirmed) {
                socket.emit('AddInvite', Teacherresult.class_host, user);
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
            `강사에게 요청을 성공적으로 보냈습니다!`,
            'success'
        );
    });

    socket.on('fail_code', function(InviteCode) {
        Swal.fire(
            `요청 전송 실패`,
            `${InviteCode} 코드는 올바르지 않은 코드입니다.`,
            'error'
        )
    });
}