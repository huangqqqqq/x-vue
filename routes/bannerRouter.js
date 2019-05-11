// 提供前端ajax 接口地址 URL
const express = require('express');
const BannerModel = require('../models/bannerModel');
const async = require('async');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 创建 文件夹存放
const upload = multer({
    dest: 'i:/tmp'
})
const router = express.Router();


// 添加banner - http://localhost:3000/banner/add
router.post('/add', upload.single('bannerImg'), (req, res) => {
    // 1. 操作文件
    let newFileName = new Date().getTime() + '_' + req.file.originalname;
    let newFilePath = path.resolve(__dirname, '../public/upload/banners/', newFileName)

    // 2. 移动文件
    try {
        let data = fs.readFileSync(req.file.path);  // 读文件
        fs.writeFileSync(newFilePath, data);        // 写文件
        fs.unlinkSync(req.file.path);               // 删除源文件

        // 文件的名字 +  banner 图的名字 写入到数据库中
        let banner = new BannerModel({
            name: req.body.bannerName,
            imgUrl: 'http://localhost:3000/upload/banners/' + newFileName
        });

        banner.save()
        .then(() => {
            res.json({
                code: 0,
                msg: 'ok'
            })
        })
        .catch(error => {
            res.json({
                code: -1,
                msg: error.message
            })
        })


    } catch (error) {
        res.json({
            code: -1,
            msg: error.message
        })
    }

    // 获取前端传来的数据
    // var banner = new BannerModel({
    //     name: req.body.bannerName,
    //     imgUrl: req.body.bannerUrl
    // });
    // banner.save(function (err) {
    //     if (err) {
    //         res.json({
    //             code: -1,
    //             msg: err.message
    //         })
    //     } else {
    //         res.json({
    //             code: 0,
    //             msg: 'ok'
    //         })
    //     }
    // })
});

// 搜索 or 查询 banner - http://localhost:3000/banner/search
router.get('/search', (req, res) => {
    // 分页
    // 1. 得到参数
    let pageNum = parseInt(req.query.pageNum) || 1; // 当前的页数
    let pageSize = parseInt(req.query.pageSize) || 3; // 每页显示的条数

    // 采用并行无关联
    async.parallel([
        function (cb) {
            BannerModel.find().count()
                .then(num => {
                    cb(null, num);
                })
                .catch(err => { cb(err); })
        },
        function (cb) {
            BannerModel.find().skip(pageNum * pageSize - pageSize).limit(pageSize)
            .then(data => { cb(null, data); })
            .catch(err => { cb(err); })
        }
    ], function (err, result) {
        if(err){
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
    













    // BannerModel.find(function(err, data){
    //     if(err){
    //         console.log('查询失败');
    //         res.json({
    //             code: -1,
    //             msg: err.message
    //         })
    //     } else {
    //         console.log('查询成功');
    //         res.json({
    //             code: 0,
    //             msg: 'ok',
    //             data: data
    //         })
    //     }
    // })
})

// 删除 - http://localhost:3000/banner/delete
router.post('/delete', (req, res) => {
    let id = req.body.id;

    // 操作删除方法
    BannerModel.deleteOne({
        _id: id
    }).then((data) => {
        console.log(data);
        if(data.deletedCount > 0){
            res.json({
                code: 0,
                msg: 'ok'
            })
        } else {
            return Promise.reject(new Error('未找到相关数据'));
            // res.json({
            //     code: -1,
            //     msg: '未找到相关数据'
            // })
        }
    }).catch(error => {
        res.json({
            code: -1,
            msg: error.message
        })
    })
})


module.exports = router;