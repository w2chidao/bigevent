// 获取裁剪区域的 DOM 元素
var $image = $('#image')
// 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 创建裁剪区域
$image.cropper(options)

$('.layui-btn').on('click', function () {
    $('#file').click()
})

$('#file').on('change', function (e) {
    // const fileList = this.files;
    const fileList = e.target.files;
    if (fileList.length === 0) {
        return layer.msg('请选择文件')
    }

    // 拿到用户选择的文件
    var file = e.target.files[0];
    // 将文件，转化为路径
    var imgURL = URL.createObjectURL(file);
    // 重新初始化裁剪区域
    $image
        .cropper('destroy') // 销毁旧的裁剪区域
        .attr('src', imgURL) // 重新设置图片路径
        .cropper(options) // 重新初始化裁剪区域
})

$('#uploadBtn').on('click', function () {
    var dataURL = $image
        .cropper('getCroppedCanvas', {
            // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')
    
    $.ajax({
        type: 'POST',
        url: '/my/update/avatar',
        data: {
            avatar: dataURL,
        },
        success: function (res) {
            if (res.status !== 0) {
                return layer.msg('上传头像失败')
            }
            layer.msg('更换头像成功')
            window.parent.getUserInfo()
        }
    })
})