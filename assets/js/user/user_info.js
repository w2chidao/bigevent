$(function () {
    const { form, layer } = layui;

    form.verify({
        nickname: function (value) {
            if (value.length > 6) {
                return '昵称长度必须在1-6之间'
            }
        }
    })

    initUserInfo();
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户名失败')
                }
                console.log(res);
                form.val('userInfo', res.data)
            }
        })
    }

    $('#resetBtn').on('click', function (e) {
        e.preventDefault();
        initUserInfo();
    })

    $('.layui-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取用户名失败')
                }
                //fm子页面调用父页面渲染方法
                window.parent.getUserInfo()
                console.log();
            }

        })
    })
})
