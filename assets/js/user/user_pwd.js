$(function () {
    const { form, layer } = layui;

    form.verify({
        pwd: [/^[\S]{6,12}$/, '密码不符合规则'],
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能一样'
            }
        },
        rePwd: function (value) {
            if (value !== $('[name=newPwd]').val()) {
                return '两次新密码不一样'
            }
        },
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('密码更新失败')
                }
                layer.msg('密码更新成功')
                // DOM方法重置表单
                $('.layui-form')[0].reset();
            }
        })
    })
})