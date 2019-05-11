// 入口文件
const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
// const muter = require('muter');
const app = express();

// 引入路由中间件
const indexRouter = require('./routes/indexRouter');
const bannerRouter = require('./routes/bannerRouter');
const userRouter = require('./routes/userRouter');

// 使用中间件
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 设置模板语言 ejs
app.set('views', path.resolve(__dirname, './views'));
app.set('view engine', 'ejs');

// 静态文件托管
app.use(express.static(path.resolve(__dirname, './public')));

app.use(function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Headers', 'Content-Type');
  // res.set('Access-Control-Allow-Headers', 'Content-Type,XFILENAME,XFILECATEGORY,XFILESIZE');
  // res.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept")');
  // res.set('header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");')
  next();
})

// 路由中间件的使用
app.use('/', indexRouter);
app.use('/banner', bannerRouter);
app.use('/user', userRouter);


app.listen(3000);
console.log('服务器启动');
