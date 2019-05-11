// 用来做用户验证的中间件函数
module.exports = function(req, res, next){
    // 得到nickName 
    let nickName = req.cookies.nickName;
    if(nickName) {
        // 存在
        next();
    } else {
        // 不存在 跳到登录页面
        res.redirect('/login.html');
    }
}