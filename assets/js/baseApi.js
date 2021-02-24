$.ajaxPrefilter(function (option) {
    //统一
    option.url = 'http://ajax.frontend.itheima.net' + option.url;

    //统一
    if (option.url.includes('/my')) {
        option.headers = {
            Authorization: localStorage.token || '',
        }
    };

    //统一挂载complete回调函数
    option.complete= function (res) {
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            localStorage.removeItem('token');
            location.href = '/login.html';
        }
    }
})

