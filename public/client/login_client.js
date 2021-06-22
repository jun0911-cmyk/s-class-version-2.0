$(function() {

    $(document).on('click', '#login_btn', function() {
        $.ajax({
            url: '/user/login',
            datatype: 'json',
            type: 'POST',
            data: {
                email: $("#email").val(),
                password: $("#password").val(),
            },   
            success: function(result) {
                data = result.result;
                if(data == 1) {
                    new Vue({
                        el: '#login_contention',
                        template: '<div id="login_contention" style="color: red;">아이디 또는 비밀번호가 일치하지 않습니다.</div>'
                    });
                }
                if(data == 0) {
                    location.href = '/';
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
                url: '/user/login',
                datatype: 'json',
                type: 'POST',
                data: {
                    email: $("#email").val(),
                    password: $("#password").val(),
                },   
                success: function(result) {
                    data = result.result;
                    if(data == 1) {
                        new Vue({
                            el: '#login_contention',
                            template: '<div id="login_contention" style="color: red;">아이디 또는 비밀번호가 일치하지 않습니다.</div>'
                        });
                    }
                    if(data == 0) {
                        location.href = '/';
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