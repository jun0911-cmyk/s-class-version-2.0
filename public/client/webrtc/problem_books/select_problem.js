export async function problem_search(user, roomId) {
    const { value: problem_cate } = await Swal.fire({
        title: `문제 카테고리를 입력해주세요.`,
        input: 'text',
        inputLabel: '입력 예시 ex): 과목명 문제카테고리 = 수학 근해공식',
        icon: 'info'
    });

    if (problem_cate) {
        Swal.fire({
            icon: 'info',
            title: `검색결과 : ${problem_cate}`,
            text: `카테고리 검색 결과를 확인해주세요. 선택하신 정보로 문제를 보내시겠습니까?`,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: `문제 보내기`,
            cancelButtonText: '취소'
        }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire(
                    `테스트`,
                    '이 기능은 곧 추가 됩니다.',
                    'success'
                );
            }
        });
    }
}