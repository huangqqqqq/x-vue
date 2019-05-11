(function () {
    var User = function () {
        // this.userName = '';
        // this.password = '';

        this.dom = {
            submitBtn: $('#btn'),
            userNameInput: $('input[name=userName]'),
            passwordInput: $('input[name=password]'),
            nickNameInput: $('input[name=nickName]'),
            isAdminInput: $('input[name=isAdmin]')
        }
    }

    User.prototype.bindDOM = function () {
        var _this = this;
        this.dom.submitBtn.click(function () {
            _this.handleRegister();
        })
    }

    // 注册的方法
    User.prototype.handleRegister = function () {

        $.post('/user/register', {
            userName: this.dom.userNameInput.val(),
            password: this.dom.passwordInput.val(),
            nickName: this.dom.nickNameInput.val(),
            isAdmin: this.dom.isAdminInput.val(),
        }, function (res) {
            if(res.code === 0){
              
                // 登录成功
                layer.msg('注册成功');
                
                // 跳到首页
                setTimeout(() => {     

                    window.location.href = '/login.html';

                }, 1000);

            } else {
                // 登录失败
                layer.msg('注册失败' + res.msg);
            }
        })

    }



    // 最后 实例化
    var user = new User();
    user.bindDOM();



})();