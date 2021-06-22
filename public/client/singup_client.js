$(function() {

    $(document).on('click', '#singup_btn', function() {
        $.ajax({
            type: 'POST',
            url: '/user/singup',
            data: {
                email: $("#email").val(),
                password: $("#password").val(),
                repassword: $("#repassword").val(),
            },   
            datatype: 'json',
            success: function(result) {
                data = result.result;
                
                if(data == 1) {
                    new Vue({
                        el: '#singup_contention',
                        template: `<div style="color: red;">회원가입 중 잘못된 부분이 있거나 이미 중복된 계정의 이메일이 있습니다.</br>중복된 이메일이 있다면 다른 계정으로 가입해주시거나 <a href="/user/login">여기</a>를 눌러 로그인 해주세요.</div>`
                    });
                }

                if(data == 0) {
                    location.href = '/user/login';
                }
            },
            error: function(request,status,error) { 
                console.log('서버 통신중 오류가 발생하였습니다.');
                console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
            }
        });
    });

    $(document).on('keydown', function(event) {
        if (event.key == 'Enter') {
            $.ajax({
                url: '/user/singup',
                datatype: 'json',
                type: 'POST',
                data: {
                    email: $("#email").val(),
                    password: $("#password").val(),
                    repassword: $("#repassword").val(),
                },   
                success: function(result) {
                    data = result.result;

                    if(data == 1) {
                        new Vue({
                            el: '#singup_contention',
                            template: `<div style="color: red;">회원가입 중 잘못된 부분이 있거나 이미 중복된 계정의 이메일이 있습니다.</br>중복된 이메일이 있다면 다른 계정으로 가입해주시거나 <a href="/user/login">여기</a>를 눌러 로그인 해주세요.</div>`
                        });
                    }

                    if(data == 0) {
                        alert('회원가입이 완료되었습니다.');
                        location.href = '/user/login';
                    }
                },
                error: function(request,status,error) { 
                    console.log('서버 통신중 오류가 발생하였습니다.');
                    console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
                }
            });
        }
    });
});