$(function () {
    const { form, layer } = layui

    initCateInfo();

    function initCateInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('res.message')
                }
                const htmlStr = template('tpl-table', res);
                $('tbody').html(htmlStr);
                console.log(res);
            }
        })
    }

    let addIndex = null;
    $('#addCateBtn').on('click', function () {
        addIndex = layer.open({
            type: '1',
            aera: ['500px', '300px'],
            title: '添加类别',
            content: $('#dialog-add').html(),
        })
    })

    $('body').on('submit', '#form-add', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg(res.message)
                }
                initCateInfo();
                layer.msg('新增分类成功');
                layer.close(addIndex)
            }
        })
    })

    let editIndex = null;
    $('tbody').on('click', '.btn-edit', function () {
        editIndex = layer.open({
            type: '1',
            aera: ['500px', '300px'],
            title: '添加类别',
            content: $('#dialog-edit').html(),
        })
        const id = $(this).data('id');
        console.log(id);
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                form.val('form-edit', res.data);
            }
        })
    })

    $('body').on('submit', '#form-edit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('更新分类失败')
                }
                layer.msg('更新分类成功');
                layer.close(editIndex);
                initCateInfo()
            }
        })
    })

    $('tbody').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否要删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除分类失败！')
                    }
                    layer.msg('删除分类成功！')
                    layer.close(index)
                    initCateInfo()
                }
            })
        })
    })
})

