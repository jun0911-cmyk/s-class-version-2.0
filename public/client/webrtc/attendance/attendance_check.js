export async function attendanceCheck(socket, roomId) {
    const { value: studentClient } = await Swal.fire({
        title: `학생 전자 출석부`,
        input: 'text',
        inputLabel: '총 학생수를 입력해주세요',
        inputPlaceholder: '여기에 학생수를 입력해주세요...'
    });

    var Studentnum = await Number(studentClient);

    if (Studentnum > 1000) {
        Swal.fire(
            `학생수 확인실패`,
            `총 학생수가 1000명을 넘을수 없습니다.`,
            'error'
        );
        return;
    }

    if (Studentnum) {
        Swal.fire(
            `학생수 확인`,
            `총 학생수가 ${studentClient}명이 맞으십니까?`,
            'info'
        ).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    icon: 'info',
                    title: `출석부 형식을 선택해주세요.`,
                    text: `원하는 형식의 버튼을 눌러주세요. 선택하지 않을시 학생을 기록만 하여 표시합니다`,
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: `학생을 기록하여 출석부에 표시`,
                    cancelButtonText: '학생을 기록만 하여 표시'
                }).then((result) => {
                    if (result.isConfirmed) {
                        Swal.fire(
                            `테스트`,
                            '이 기능은 곧 추가 됩니다.',
                            'success'
                        );
                    } else {
                        Swal.fire(
                            `테스트`,
                            '이 기능은 곧 추가 됩니다.',
                            'success'
                        );
                    }
                });
            }
        });
    }
}