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
            var btn = document.getElementById('join_btn');
            var pwd = document.getElementById('pwd');
            var check_pwd = document.getElementById('check_pwd');
            var check;

            $('#loading').hide();
            $('#check_pwd').hide();

            socket.emit('check_class', roomId, user);

            check = new Vue({
                el: '#title',
                data: {
                    message: `${roomId}번 강의실은 현재 호스트가 접속해있지 않습니다.`
                }
            });
            
            socket.on('not_class', function(roomId) {
                check.message = `${roomId}번 강의실은 존재하지 않는 강의실 입니다.`;
            });

            socket.on('offline_class', function(roomId) {
                console.log(roomId);
                check.message = `${roomId}번 강의실은 현재 열려있지 않는 강의실 입니다.`;
            });

            socket.on('full_class', function(roomId) {
                check.message = `${roomId}번 강의실은 정원 초과로 접속할 수 없습니다.`;
            });
            
            btn.innerText = `강의실 접속불가`;
            btn.disabled = true;

            socket.on('ready_join', function(roomId, user) {
                check.message = `${roomId}번의 강의실에 접속하시겠습니까? 사용자 아이디 : ${user.user_id}`;
                btn.innerText = `강의실 접속하기`;
                btn.disabled = false;
            });

            document.getElementById('join_btn').addEventListener('click', function() {
                check.message = `${roomId}번 강의실 접속 확인중...`;
                btn.innerText = '로딩중...';
                btn.disabled = true;
                setTimeout(function() {
                    check.message = `${roomId}번 강의실의 회의 암호를 입력해주세요.`;
                    btn.remove();
                    $('#check_pwd').show();
                    pwd.innerHTML = `<input type="password" id="pwd_class" class="pwd_class" placeholder="여기에 암호를 입력해주세요.." size="50"/>`;
                    check_pwd.innerHTML = `<button type="button" id="check_btn" class="btn btn-primary btn-lg" style="font-weight: 600;">확인</button>`;
                }, 1500);
            });

            check_pwd.addEventListener('click', function() {
                check.message = '암호 확인중...';
                $('#pwd_class').hide();
                $('#check_btn').hide();
                $('#loading').show();
                setTimeout(function() {
                    var pwdClass = $('#pwd_class').val();
                    socket.emit('check_class_pwd', roomId, pwdClass);
                }, 1500);
            });

            socket.on('check_success_pwd', function(roomId) {
                check.message = '강의실 연결중...';
                setTimeout(function() {
                    check.message = `${roomId}번 호스트가 귀하를 들어오게 할 것입니다.`;
                    socket.emit('waiting_room', roomId, user);
                }, 1500);
            });

            socket.on('waiting_room', function(roomId, email, result) {
                if (result == 'success') {
                    socket.emit('join_class', roomId, email, user);
                } else if (result == 'fail') {
                    socket.emit('join_fail', roomId, email, user);
                }
            });

            socket.on('joinFailed', function(roomId) {
                check.message = `${roomId}번 호스트가 귀하를 승인하지 않았습니다. 연결해제중...`;
                setTimeout(function() {
                    location.href = `/student/class`;
                }, 3000);
            });

            socket.on('check_fail_pwd', function(roomId) {
                check.message = `${roomId}번 강의실에 대한 암호가 일치하지 않습니다.`;
                setTimeout(function() {
                    location.href = '/student/class'; 
                }, 1500);
            });

            socket.on('joined', function(roomId, client) {
                check.message = `${roomId}번 강의실에 참가중... 현재 접속인원 : ${client}명`;
                setTimeout(function() {
                    window.open(`/class/live/room/classroom/setting/${roomId}&testing&testing`);
                    check.message = `강의실 참가 완료.`;
                }, 1500);
                setTimeout(function() {
                    location.href = `/student/class`;
                }, 3000);
            });
        },
        error: function(request,status,error) { 
            console.log('서버 통신중 오류가 발생하였습니다.');
            console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        }
    });
});