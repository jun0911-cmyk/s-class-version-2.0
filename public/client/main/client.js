$(function() {
    $.ajax({
        type: 'POST',
        url: '/s-class',
        data: {
            connect: 1
        },   
        datatype: 'json',
        success: function(result) {
            const data = result.auth;
            const user = result.user;
            if(data == true) {
                Vue.component('account-component', {
                    template: `
                        <div class="dropdown">
                            <a href="javascript:void(0)" class="singup">
                                <i class="fas fa-user-circle" style="font-size: 27px; margin-top: 10px"></i>
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

                new Vue({
                    el: '#list',
                    template: '<a class="collect" href="/student/class">내 강의실</a>'
                });

                new Vue({
                    el: '#account'
                });

                if (user.user_group == 'teacher' || user.user_group == 'admin') {
                    new Vue({
                        el: '#list_teacher',
                        template: '<a class="collect" href="/teacher/class">강의실 관리</a>'
                    });
                }
            } 
            if(data == false) {
                Vue.component('account-component', {
                    template: `
                    <div>
                        <a href="/user/login" class="login">로그인</a>
                        <a href="/user/singup" class="singup">회원가입</a>
                    </div>`
                });

                Vue.component('bell-component', {
                    template: `
                        <div></div>`
                });

                Vue.component('button-component', {
                    template: `
                        <button class="button_style" onclick = "location.href = '/user/singup' ">시작하기</button>
                    `
                });

                new Vue({
                    el: '#account'
                });
            }
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});