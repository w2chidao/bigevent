(function () {
    $('#link_reg').on('click', function () {
        $('.reg-box').show();
        $('.login-box').hide();
    });
    $('#link_login').on('click', function () {
        $('.reg-box').hide();
        $('.login-box').show();
    })

    const form = layui.form;
    const layer = layui.layer;

    form.verify({
        pwd: [/^[\S]{6,12}$/, '输入密码不符合规则'],
        repwd: function (value) {
            const password = $('.reg-box [name=password]').val()
            if (password !== value) {
                return '两次输入不一致'
            }
        }
    })

    $('#reg-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            type: 'POST',
            url: '/api/reguser',
            data: {
                username: $('#reg-form [name=username]').val(),
                password: $('#reg-form [name=password]').val()
            },
            success: function (res) {
                if (res.status !== 0) {
                    // return console.log(res.message);
                    return layer.msg(res.message)
                }
                // console.log('success');
                layer.msg('注册成功');
                $('#link_login').click()
            }
        })
    })

    $('#login-form').on('submit', function (e) {
        e.preventDefault();
        $.ajax({
            method: 'POST',
            url: '/api/login',
            data: $(this).serialize(),//获取表单的所有属性
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('登陆失败')
                }
                
                localStorage.setItem('token', res.token);
                location.href = '/index.html'//本地跳转主页面
            }
        })
    })
})()

