$(function() {
    $.ajax({
        url: '/student/check/class',
        datatype: 'json',
        type: 'POST',
        data: {
        },   
        success: function(result) {
            var data = result.data;
            var classroom = result.classroom;
            var count_number = result.rows_number;
            var status = result.status;

            Vue.component('account-component', {
                template: `
                    <div class="dropdown">
                        <a href="javascript:void(0)" class="singup">
                            <i class="fas fa-user-circle" style="font-size: 27px; margin-top: 10px; margin-left: 10px;"></i>
                        </a>
                        <div class="dropdown-content">
                            <a href="/student/check/class">수강 이력</a>
                            <a href="#">내 정보</a>
                            <a href="#">정보 변경</a>
                            <a href="/user/logout">로그아웃<i class="fas fa-sign-out-alt"></i></a>
                        </div>
                    </div>
                `
            });

            Vue.component('bell-component', {
                template: `
                    <i class="fas fa-bell" style="font-size: 27px; margin-left: 30px;"></i>
                `
            });

            Vue.component('main-component', {
                template: `
                    <h1>${data.email} 님의 강의수강 이력</h1>
                `
            });

            Vue.component('sub-component', {
                template: `
                <h3>현재 ${data.email} 님의 출결상태 목록</h3>
                `
            });

            new Vue({
                el: '#main_content'
            });

            new Vue({
                el: '#sub_content'
            });

            new Vue({
                el: '#account'
            });

            new Vue({
                el: '#col',
                data() {
                    return {
                        classroom_data: []
                    }
                },
                created() {
                    if (status == 'no') {
                        Swal.fire(
                            '강의실 없음',
                            '현재 열린 강의실이나 등록되신 강의실이 없으십니다.',
                            'error'
                        )
                    } else {
                        this.classroom_data = count_number.rows
                    }
                }
            });
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});