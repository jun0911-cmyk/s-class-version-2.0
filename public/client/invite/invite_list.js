const socket = window.io();

$(function() {
    $.ajax({
        url: '/teacher/invite/list',
        datatype: 'json',
        type: 'POST',
        data: {
        },   
        success: function(result) {
            var user = result.user;
            var invite = result.inviteList;
            var inviteList = [];

            for (var i = 0; i < invite.length; i++) {
                const array = invite[i].select_teacher.split(", ");
                for (var j = 0; j < array.length; j++) {
                    if (array[j] == user.email) {
                        inviteList.push(invite[i]);
                    }
                }
            }

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
                    <h1>${user.email} 님의 초대 현황</h1>
                `
            });

            Vue.component('sub-component', {
                template: `
                <h3>현재 ${user.email} 강사님의 강의실 초대 현황</h3>
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
                        inviteData: []
                    }
                },
                created() {
                    this.inviteData = inviteList
                }
            });

            $(document).on("click", "#access_denied", function() {
                var checkBtn = $(this);
                var tr = checkBtn.parent().parent();
                var td = tr.children();
                var userEmail = td.eq(0).text();
                for(var i = 0; i < invite.length; i++) {
                    if (invite[i].email == userEmail) {
                        Swal.fire({
                            title: `제거 확인`,
                            text: `${userEmail} 학생을 정말로 승인 요청에서 제거하시겠습니까?`,
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: '제거',
                            cancelButtonText: '취소'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                socket.emit('access_denied', invite[i], userEmail, user);
                            }
                        });
                    }
                }
            });

            $(document).on("click", "#approve_access", function() {
                var checkBtn = $(this);
                var tr = checkBtn.parent().parent();
                var td = tr.children();
                var userEmail = td.eq(0).text();
                for(var i = 0; i < invite.length; i++) {
                    if (invite[i].email == userEmail) {
                        Swal.fire({
                            title: `승인 확인`,
                            text: `${userEmail} 학생을 정말로 승인하시겠습니까?`,
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: '승인',
                            cancelButtonText: '취소'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                socket.emit('approve_access', invite[i], userEmail, user);
                            }
                        });
                    }
                }
            });

            socket.on('access_denied', function(userEmail) {
                Swal.fire(
                    '제거 완료',
                    `${userEmail}을 성공적으로 승인 요청에서 제거하였습니다.`,
                    'success'
                )
            });

            socket.on('approve_access', function(userEmail) {
                Swal.fire(
                    '승인 성공!',
                    `${userEmail} 학생을 성공적으로 승인하였습니다.`,
                    'success'
                )
            });
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});