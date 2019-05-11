const db = require('../config/db');

const schema = new db.Schema({
    userName: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true
    },
    // 昵称
    nickName: {
        type: String,
        default: '普通用户'
    },
    // 是佛是管理员
    isAdmin: {
        type: Number,
        default: 0
    }
});

module.exports = db.model('user', schema);