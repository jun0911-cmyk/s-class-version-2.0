const socket = window.io();

$(function() {
    $.ajax({
        url: '/class/check/room/:roomid',
        datatype: 'json',
        type: 'POST',
        data: {
        },   
        success: function(result) {
            var user = result.user;
            var roomId = result.roomid;
            var btn = document.getElementById('create_btn');
            var check;

            socket.emit('check_create_class', roomId, user);

            check = new Vue({
                el: '#title',
                data: {
                    message: `${roomId}번 강의실은 현재 시작할 수 없습니다.`
                }
            });

            socket.on('not_class', function(roomId) {
                check.message = `${roomId}번 강의실은 존재하지 않는 강의실 입니다.`;
            });

            socket.on('no_permissions', function(roomId) {
                check.message = `${roomId}번 강의실을 시작할 권한이 없습니다.`;
            });

            socket.on('not_authenticated', function(roomId) {
                check.message = `${roomId}번 강의실을 시작할 수 있는 호스트가 아닙니다.`;
            });

            btn.innerText = `강의실 시작불가`;
            btn.disabled = true;

            socket.on('ready_create', function(roomId, user) {
                check.message =  `${roomId}번의 강의실을 시작하시겠습니까? 호스트 아이디 : ${user.user_id}`;
                btn.innerText = `강의실 시작하기`;
                btn.disabled = false;
            });

            document.getElementById('create_btn').addEventListener('click', function() {
                check.message = `${roomId}번 강의실 시작중...`;
                btn.innerText = '로딩중...';
                btn.disabled = true;
                setTimeout(function() {
                    socket.emit('create_class', roomId, user);
                }, 1500);
            });

            socket.on('created', function(roomId, host) {
                check.message = `${roomId}번 강의실에 참가중... 현재 호스트 : ${host}`;
                setTimeout(function() {
                    window.open(`/class/live/room/classroom/setting/${roomId}&testing&testing`);
                    check.message = `강의실 생성 완료.`;
                }, 1500);
                setTimeout(function() {
                    location.href = `/teacher/class`;
                }, 3000);
            });
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});