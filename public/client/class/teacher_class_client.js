const room_socket = window.io();

$(function() {
    $.ajax({
        url: '/teacher/class',
        datatype: 'json',
        type: 'POST',
        data: {
        },   
        success: function(result) {
            var user = result.user;
            var classroom = result.classroom;
            var count_number = result.rows_number;

            document.getElementById('invite').addEventListener('click', function(e) {
                room_socket.emit('invite_code_check', user);
            });

            room_socket.on('invite_code_check', function(teacheruser) {
                Swal.fire(
                    `강사 코드 확인`,
                    `${teacheruser.email}님의 강의실 초대코드 : ${teacheruser.invite_code} 해당코드는 3일후에 다시 생성되며 신뢰하지 않는 사람에게는 알려주지 마십시오.`,
                    'success'
                )
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
                    <h1>${user.email} 님의 강의실 관리</h1>
                `
            });

            Vue.component('sub-component', {
                template: `
                <h3>현재 ${user.email} 강사님의 강의 목록</h3>
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
                    for(var i = 0; i < classroom.length; i++) {
                        if(count_number.rows[i].class_status == '1') {
                            count_number.rows[i].class_status = '🟢'
                        } else {
                            count_number.rows[i].class_status = '🔴'
                        }
                    }
                    this.classroom_data = count_number.rows
                }
            });

            $(document).on("click", "#room_btn", function() {
                var checkBtn = $(this);
                var tr = checkBtn.parent().parent();
                var td = tr.children();
                var room_name = td.eq(0).text();
                for(var i = 0; i < classroom.length; i++) {
                    if (classroom[i].class_name == room_name) {
                        Swal.fire({
                            title: `${classroom[i].class_name}을 시작하겠습니까?`,
                            text: "강의실을 시작하시려면 시작하기를 눌러주세요.",
                            icon: 'question',
                            showCancelButton: true,
                            confirmButtonColor: '#3085d6',
                            cancelButtonColor: '#d33',
                            confirmButtonText: '시작하기',
                            cancelButtonText: '취소'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                for (var j = 0; j < classroom.length; j++) {
                                    if (classroom[j].class_name == room_name) {
                                        location.href = `/class/check/room/${classroom[j].class_id}`;
                                    }
                                }
                            }
                        });
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