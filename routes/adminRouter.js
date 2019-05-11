const express = require('express');
const UserModel = require('../models/userModel');
const async = require('async');
const path = require('path');
const fs = require('fs');
const router = express.Router();

// 创建查询的方法 http://localhost:3000/admin/search
router.get('/search', (req, res) => {
    // 分页
    // 1. 得到参数
    let pageNum = parseInt(req.query.pageNum) || 1; // 当前的页数
    let pageSize = parseInt(req.query.pageSize) || 5; // 每页显示的条数

    // 采用并行无关联
    async.parallel([
        function (cb) {
            UserModel.find().count()
                .then(num => {
                    cb(null, num);
                })
                .catch(err => {
                    cb(err);
                })
        },
        function (cb) {
            UserModel.find().skip(pageNum * pageSize - pageSize).limit(pageSize)
                .then(data => { cb(null, data); })
                .catch(err => { cb(err); })
        }
    ], function (err, result) {
        if (err) {
            res.json({
                code: -1,
                msg: err.message
            })
        } else {
            res.json({
                code: 0,
                msg: 'ok',
                data: result[1],
                totalPage: Math.ceil(result[0] / pageSize), // 总的页数
                totalSize: result[0], // 总的条数
            })
        }
    })
})




module.exports = router;