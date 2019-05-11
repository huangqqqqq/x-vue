
(function () {

    var Admin = function () {
        // 定义这个页面需要的一些数据
        this.pageNum = 1; // 当前的页码数
        this.pageSize = 5; // 每页显示的条数
        this.totalPage = 0; // 总的页数
        this.adminList = []; // admin 数据

        // 需要用到的 dom 对象  性能优化 - dom缓存
        this.dom = {
            table: $('#admin-table tbody'), // table 的 tbody
            pagination: $('#pagination'), // 分页的ul
            // nameInput: $('#inputEmail3'), // 名字的输入框
            // urlInput: $('#inputPassword3'), // url的输入框
            // addModal: $('#addModal'), // 新增的模态框
            // submitAdd: $('#bannerAdd'), // 确认新增的按钮
        }
    }

    // 查询的方法
    Admin.prototype.search = function () {
        var _this = this;
        $.get('/admin/search', {
            pageNum: this.pageNum,
            pageSize: this.pageSize
        }, function (result) {
            if (result.code === 0) {
                console.log(result.data);

                layer.msg('查询成功');

                // 将result.data 写入到实例的 bannerList
                _this.adminList = result.data;
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
    Admin.prototype.renderTable = function () {
        this.dom.table.html('');
        for (var i = 0; i < this.adminList.length; i++) {
            var item = this.adminList[i];
            this.dom.table.append(
                `
                    <tr>
                        <td>${item._id}</td>
                        <td>${item.userName}</td>
                        <td>${item.nickName}</td>
                        <td>${item.isAdmin}</td>
                        <td>
                            <a class="layui-btn" data-id="${item._id}" href="javascript:;">删除</a>
                            <a class="layui-btn" data-id="${item._id}" href="javascript:;">修改</a>
                            <a class="layui-btn" data-id="${item._id}" href="javascript:;">增加</a>

                        </td>
                    </tr>
                `
            )
        }
    }

    // 渲染分页
    Admin.prototype.renderPage = function () {
        // 禁用上下页
        var prevClassName = this.pageNum === 1 ? 'disabled' : '';
        var nextClassName = this.pageNum === this.totalPage ? 'disabled' : '';

        // 清空
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
        
        // 根据 this.totalPage 循环 li
        for (var i = 1; i < this.totalPage; i++) {
            this.dom.totalPage.append(
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










    // 实例化
    $(function () {
        var Admin = new Admin();
        Admin.bindDOM();
        Admin.search();
    })

})();