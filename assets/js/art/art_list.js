$(function () {
    const { form, layer, laypage } = layui;

    // 定义查询参数对象q
    const q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    };

    template.defaults.imports.dataFormat = function (date) {
        const dt = new Date(date)
        const y = padZero(dt.getFullYear());
        const m = padZero(dt.getMonth() + 1);
        const d = padZero(dt.getDate());
        const h = padZero(dt.getHours());
        const w = padZero(dt.getMinutes());
        const s = padZero(dt.getSeconds());
        return y + '-' + m + '-' + d + ' ' + h + ':' + w + ':' + s
    }
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initTable();
    // 初始化表格
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                const htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr)
                renderPage(res.total)
            }
        })
    }

    initCate();
    // 初始化选择
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                const htmlStr = template('tpl-cate', res);
                $('[name=cate_id]').html(htmlStr)
                //layui重新渲染页面
                form.render()
            }
        })
    }

    $('#form-search').on('submit', function (e) {
        e.preventDefault()
        // 获取表单中选中项的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()
        // 为查询参数对象 q 中对应的属性赋值
        q.cate_id = cate_id
        q.state = state
        // 根据最新的筛选条件，重新渲染表格的数据
        initTable()
    })

    //渲染分页
    function renderPage(total) {
        console.log(total)
        laypage.render({
            elem: 'page-box', // 分页容器的 Id
            count: total, // 总数据条数
            limit: q.pagesize, // 每页显示几条数据
            curr: q.pagenum, // 设置默认被选中的分页
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],// 每页展示多少条
            jump(obj, first) {
                // console.log(obj.curr);
                q.pagenum = obj.curr;
                q.pagesize = obj.limit;
                if (!first) {
                    initTable()
                }
            },
        })
    }

    $('tbody').on('click', '.btn-delete', function () {
        const length = $('.btn-delete').length;
        // 获取到文章的 id
        var id = $(this).attr('data-id');
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    // if (length === 1) {
                    //     q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1;
                    // }
                    if (length === 1 && q.pagenum !== 1) {
                        q.pagenum--;
                    }
                    layer.msg('删除文章成功！')
                    initTable()
                }
            })
            layer.close(index)
        })
    })
})
