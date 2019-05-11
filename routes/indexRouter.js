// 页面渲染的 路由
const express = require('express');
const userCheck = require('../middlewares/userCheck');
const router = express.Router();


// 首页 - http:// localhost:3000/
router.get('/', userCheck, (req, res) => {
    // 获取用户登录的用户名
    // console.log(req.cookies);
    let nickName = req.cookies.nickName;
    let isAdmin = req.cookies.isAdmin ? true : false;
    
    if (nickName) {
        // 存在
        res.render('index', {
            nickName: req.cookies.nickName,
            isAdmin: parseInt(req.cookies.isAdmin)
        });
    } else {
        // 不存在 跳到登录页面
        res.redirect('/login.html');
    }

});

// register 页面 - http://localhost:3000/register
router.get('/register.html', (req, res) => {
    res.render('register');
})

// login页面 - http://localhost:3000/login
router.get('/login.html', (req, res) => {
    res.render('login');
})


// banner 页面 - http://localhost:3000/banner
router.get('/banner.html', (req, res) => {
    // 获取用户登录的用户名
    // let nickName = req.cookies.nickName;
    // let isAdmin = req.cookies.isAdmin ? true : false;
    res.render('banner', {
        nickName: req.cookies.nickName,
        isAdmin: parseInt(req.cookies.isAdmin)
    });
})

// admin 页面 - http://localhost:3000/admin
router.get('/admin.html', (req, res) => {
    // 获取用户登录的用户名
    // let nickName = req.cookies.nickName;
    // let isAdmin = req.cookies.isAdmin ? true : false;
    res.render('admin', {
        nickName: req.cookies.nickName,
        isAdmin: parseInt(req.cookies.isAdmin)
    });
})

// films 页面 - http://localhost:3000/films
router.get('/films.html', (req, res) => {
    // 获取用户登录的用户名
    let nickName = req.cookies.nickName;
    let isAdmin = req.cookies.isAdmin ? true : false;
    res.render('films', {
        nickName: req.cookies.nickName,
        isAdmin: parseInt(req.cookies.isAdmin)
    });
})

// cinema 页面 - http://localhost:3000/cinema
router.get('/cinema.html', (req, res) => {
    // 获取用户登录的用户名
    let nickName = req.cookies.nickName;
    let isAdmin = req.cookies.isAdmin ? true : false;
    res.render('cinema', {
        nickName: req.cookies.nickName,
        isAdmin: parseInt(req.cookies.isAdmin)
    });
})




module.exports = router;