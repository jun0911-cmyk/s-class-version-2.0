export function attendanceCheck(socket, roomId) {
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