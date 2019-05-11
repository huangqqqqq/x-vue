(function(){
    var User = function(){
        // this.userName = '';
        // this.password = '';

        this.dom = {
            submitBtn: $('#btn'),
            userNameInput: $('input[type=text]'),
            passwordInput: $('input[type=password]')
        }
    }

    User.prototype.bindDOM = function(){
        var _this = this;
        this.dom.submitBtn.click(function(){
            // 发送之前 判断是佛有锁
            if(!_this.btnLock){
                // 没有锁的时候加锁， 并发请求
                _this.btnLock = true;
                _this.handleLogin();
            }
        })
    }



    // 登录的方法，调取ajax
    User.prototype.handleLogin = function(){
        var _this = this;
        $.post('/user/login', {
            userName: this.dom.userNameInput.val(),
            password: this.dom.passwordInput.val()
        }, function(res){
            if(res.code === 0){
                // 登录成功
                layer.msg('登录成功');
                
                // 跳到首页
                setTimeout(() => {                   
                    window.location.href = '/';
                }, 1000);

            } else {
                // 登录失败
                layer.msg(res.msg);
            }

            // 解锁
            _this.btnLock = false;
        })
    }


    // 最后 实例化
    var user = new User();
    user.bindDOM();


})();