const room_socket = window.io();

$(function() {
    $.ajax({
        url: '/student/invite',
        datatype: 'json',
        type: 'POST',
        data: {
        },   
        success: function(result) {
            var data = result.data;
            var invite = result.invite;
            var status = result.status;
            var delect_teacher_email;
            var inviteList = [];

            room_socket.emit('inviteList', invite, data);

            room_socket.on('inviteList', function(inviteLists) {
                for (var i = 0; i < inviteLists.length; i++) {
                    inviteList.push(inviteLists[i]);
                }
            });

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
                    <h1>${data.email} 님의 강사 목록</h1>
                `
            });

            Vue.component('sub-component', {
                template: `
                <h3>현재 강사 목록</h3>
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
                        inviteList_data: []
                    }
                },
                created() {
                    if (status == 'no') {
                        Swal.fire(
                            '강의실 없음',
                            '현재 등록되신 강사가 없으십니다. 강사코드로 강사를 추가해보세요. (이 메시지는 경고메시지가 아닙니다.)',
                            'error'
                        )
                    } else {
                        this.inviteList_data = inviteList
                    }
                }
            });

            $(document).on("click", "#remove_btn", function() {
                var checkBtn = $(this);
                var tr = checkBtn.parent().parent();
                var td = tr.children();
                var room_name = td.eq(0).text(); 
                for(var i = 0; i < inviteList.length; i++) {
                    if (inviteList[i].email == room_name) {
                        delect_teacher_email = inviteList[i].email
                        Swal.fire({
                            title: `${inviteList[i].email} 강사를 취소하시겠습니까?`,
                            text: "모든 강의목록과 온라인 강의목록에서 삭제됩니다.",
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: '강사취소',
                            cancelButtonText: '취소'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                room_socket.emit('delect_teacher', delect_teacher_email, data);
                            }
                        });
                    }
                }
            });

            room_socket.on('delect_teacher', function(success) {
                Swal.fire(
                    '취소 성공',
                    `강사를 성공적으로 취소하였습니다.`,
                    'success'
                ).then(function(result) {
                    location.reload();
                });
            });
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});