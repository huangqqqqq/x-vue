const express = require('express');
const UserModel = require('../models/userModel');
const router = express.Router();

// 注册 -  /user/register
router.post('/register', (req, res) => {
    // 1. 得到数据 用户信息

    let user = new UserModel(req.body);

    user.save()
        .then(() => {
            res.json({
                code: 0,
                msg: '注册成功'
            })
        })
        .catch(err => {
            res.json({
                code: -1,
                msg: err.message
            })
        })
})

// 登录 - /user/login
router.post('/login', (req, res) => {
    // 1. 得到传过来的数据
    let userName = req.body.userName;
    let password = req.body.password;

    // 2. 数据库查询
    UserModel.findOne({
        userName,
        password
    }).then(data => {
        console.log(data);
        // 判断，如果存在data值， 不存在 data 为null
        if (!data) {
            res.json({
                code: -1,
                msg: '用户名或密码错误'
            })
        } else {

            //  可以先设置cookie 返回数据
            res.cookie('nickName', data.nickName, {
                maxAge: 1000 * 60 * 10
            });

            res.cookie('isAdmin', data.isAdmin, {
                maxAge: 1000 * 60 * 10
            })


            // 返回数据
            res.json({
                code: 0,
                msg: '登录成功',
                data: {
                    _id: data._id,
                    nickName: data.nickName,
                    isAdmin: data.isAdmin
                }
            })
        }
    }).catch(err => {
        // console.log(error);
        res.json({
            code: -1,
            msg: err.message + '1'
        })
    })
})



module.exports = router;