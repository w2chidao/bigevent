(function () {
    getUserInfo()

    $('#outBtn').on('click', function () {
        layui.layer.confirm('确认退出?', { icon: 3, title: '提示' }, function (index) {
            localStorage.removeItem('token');
            location.href='/login.html'
            layer.close(index);
        });
    })
})()

function getUserInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     // Authorization: localStorage.getItem('token')||'',
        //     Authorization: localStorage.token,
        // },
        success: function (res) {
            if (res.status !== 0) {
                return layui.layer.msg(res.message)
            }
            renderAvater(res.data);
        },
        // complete: function (res) {
        //     if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
        //         localStorage.removeItem('token');
        //         location.href = '/login.html';
        //     }
        // }
    })
}

//封装渲染用户函数
function renderAvater(user) {
    //渲染文字
    const name = user.nickname || user.username;
    $('#welcome').html(name);
console.log(user);
    // 渲染头像
    if (user.user_pic) {
        $('.layui-nav-img').attr('src', user.user_pic).show();
        $('.text-avatar').hide();
    } else {
        $('.layui-nav-img').hide();
        const first = name[0].toUpperCase();
        $('.text-avatar').html(first).show()
    }
}