(function () {
    // 定义构造函数
    var Banner = function () {
        // 定义这个页面需要的一些数据
        this.pageNum = 1; // 当前的页码数
        this.pageSize = 2; // 每页显示的条数
        this.totalPage = 0; // 总的页数
        this.bannerList = []; // banner数据

        // 需要用到的 dom 对象  性能优化 - dom缓存
        this.dom = {
            table: $('#banner-table tbody'), // table的tbody
            pagination: $('#pagination'), // 分页的ul
            nameInput: $('#inputEmail3'), // 名字的输入框
            urlInput: $('#inputPassword3'), // url的输入框
            addModal: $('#addModal'), // 新增的模态框
            submitAdd: $('#bannerAdd'), // 确认新增的按钮
        }
    }


    // 新增的方法
    Banner.prototype.add = function () {
        var _this = this;

        // ajax 提交，并且带有文件
        // 1. 实例化一个 FormData 对象
        var formData = new FormData();

        // 2. 给 formData 对象 加属性
        formData.append('bannerName', this.dom.nameInput.val());
        formData.append('bannerImg', this.dom.urlInput[0].files[0]);

        $.ajax({
            url: '/banner/add',
            method: 'POST',
            // ！！！！！！！！！ , 上传文件的时候，需要设置这两个属性
            contentType: false,
            processData: false,

            data: formData,
            success: function () {
                layer.msg('添加成功');
                // 
                _this.search();
            },
            error: function (error) {
                console.log(error.message);
                layer.msg('网络异常，请稍后重试');
            },
            complete: function () {
                // 不管成功还是失败，都会进入的一个回调函数
                // 手动调用关闭的方法
                _this.dom.addModal.modal('hide');
                // 手动清空输入框的内容
                _this.dom.nameInput.val('');
                _this.dom.urlInput.val('');
            }
        })

        // 不带文件的
        // $.post('/banner/add', {
        //     bannerName: this.dom.nameInput.val(),
        //     bannerUrl: this.dom.urlInput.val()
        // }, function (res) {
        //     if (res.code === 0) {
        //         // 成功
        //         layer.msg('添加成功');

        //         // 请求一下数据
        //         _this.search();
        //     } else {
        //         // PS: 很多时候，真正的错误信息不会给到用户去看。
        //         layer.msg('网络异常，请稍后重试');
        //     }

        //     // 手动调用关闭的方法
        //     _this.dom.addModal.modal('hide');
        //     // 手动清空输入框的内容
        //     _this.dom.nameInput.val('');
        //     _this.dom.urlInput.val('');
        // });
    }

    // 查询的方法
    Banner.prototype.search = function () {
        var _this = this;
        $.get('/banner/search', {
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }, function (result) {
            if (result.code === 0) {
                layer.msg('查询成功');

                // 将result.data 写入到实例的 bannerList
                _this.bannerList = result.data;
                // 将result.totalPage 写入到实例的 totalPage
                _this.totalPage = result.totalPage;

                // 调用渲染table
                _this.renderTable();

                // 调用渲染分页
                _this.renderPage();

            } else {
                console.log(result.msg);
                layer.msg('网络异常，请稍后重试');
            }
        })
    }

    // 渲染table 
    Banner.prototype.renderTable = function () {
        this.dom.table.html('');
        for (var i = 0; i < this.bannerList.length; i++) {
            var item = this.bannerList[i];
            this.dom.table.append(
                `
                        <tr>
                            <td>${item._id}</td>
                            <td>${item.name}</td>
                            <td><img src="${item.imgUrl}" alt="">
                            </td>
                            <td>
                                <a class="delete layui-btn" data-id="${item._id}" href="javascript:;">删除</a>
                                <a class="update layui-btn" data-id="${item._id}" href="javascript:;">修改</a>
                            </td>
                        </tr>
                    `
            )
        }
    }

    // 渲染分页
    Banner.prototype.renderPage = function () {
        var prevClassName = this.pageNum === 1 ? 'disabled' : ''; // 禁用
        var nextClassName = this.pageNum === this.totalPage ? 'disabled' : '';

        // 0 清空
        this.dom.pagination.html('');
        // 添加上一页
        this.dom.pagination.append(
            `
                <li class="${prevClassName}" data-num="${this.pageNum - 1}">
                    <a href="#" aria-label="Previous">
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
                `
        )

        // 根据this.totalPage 循环有多少个Li
        for (var i = 1; i <= this.totalPage; i++) {
            this.dom.pagination.append(
                `
                    <li class="${this.pageNum === i ? 'active' : ''}" data-num="${i}">
                        <a href="#">${i}</a>
                    </li>
                `
            )
        }

        // 添加下一页
        this.dom.pagination.append(
            `
                <li class="${nextClassName}" data-num="${this.pageNum + 1}">
                    <a href="#" aria-label="Next">
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
                `
        )
    }

    // 将dom 事件的操作
    Banner.prototype.bindDOM = function () {
        var _this = this;
        // 点击确认新增按钮需要调用add
        this.dom.submitAdd.click(function () {
            _this.add();
        })

        // 分页按钮点击事件
        this.dom.pagination.on('click', 'li', function () {


            // 1. 得到页码
            console.log($(this).data('num'));
            var num = parseInt($(this).data('num'));
            // 1.1 判断是否是相同页
            if (_this.pageNum == num || num < 1 || num > _this.totalPage) {
                return;
            }
            // 2. 设置给 this.pageNum
            _this.pageNum = num;

            // 3. 再次调用this.search()
            _this.search();
        })


        // 删除按钮点击事件
        this.dom.table.on('click', '.delete', function () {
            // 1. 得到id
            var id = $(this).data('id');
            console.log(id);


            // 2. 二次确认框
            layer.confirm('确认删除吗', function (id) {
                console.log('确认');








                data.id.del(); //删除对应行（tr）的DOM结构

                // layer.close(index);
                //向服务端发送删除指令

            }, function () {
                console.log('取消');
            })
        })

    }


    // 最后实例化
    $(function () {
        var banner = new Banner();
        banner.bindDOM();
        banner.search();
    })


})()


































// $(function () {

//     var pageNum = 1;
//     var pageSize = 3;

//     // 默认调用一次
//     search(pageNum, pageSize);

//     $('#bannerAdd').click(function () {
//         $.post('/banner/add', {
//             bannerName: $('#inputEmail3').val(),
//             bannerUrl: $('#inputPassword3').val()
//         }, function (res) {
//             console.log(res); // 返回一个对象

//             if (res.code === 0) {
//                 layer.msg('添加成功');
//             } else {
//                 console.log(res.msg);
//                 layer.msg('网络异常，请稍后重试');
//             }
//             // 手动调用关闭的方法
//             $('#myModal').modal('hide');
//             // 手动清空
//             $('#inputEmail3').val('');
//             $('#inputPassword3').val('');
//         })
//     })
// })

// //  查询 banner数据的方法 
// function search(pageNum, pageSize) {
//     $.get('/banner/search', {
//         pageNum,
//         pageSize
//     }, function (result) {
//         if (result.code === 0) {
//             layer.msg('查询成功');

//             for (var i = 0; i < result.data.length; i++) {
//                 var item = result.data[i];
//                 $('#banner-table tbody').append(
//                     `
//                     <tr>
//                         <td>${item._id}</td>
//                         <td>${item.name}</td>
//                         <td><img src="${item.imgUrl}" alt="">
//                         </td>
//                         <td>
//                             <a href="javascript:;">删除</a>
//                             <a href="javascript:;">修改</a>
//                         </td>
//                     </tr>
//                     `
//                 )
//             }


//         } else {
//             console.log(result.msg);
//             layer.msg('网络异常，请稍后重试');
//         }
//     })
// }