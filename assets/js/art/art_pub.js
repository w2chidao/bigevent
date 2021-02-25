$(function () {
    const { form, layer } = layui;

    initCate();
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('初始化文章分类失败！')
                }
                // 调用模板引擎，渲染分类的下拉菜单
                var htmlStr = template('tpl-cate', res)
                $('[name=cate_id]').html(htmlStr)
                // 一定要记得调用 form.render() 方法
                form.render()
            }
        })
    }

    initEditor();

    // 初始化图片裁剪器
    var $image = $('#image')
    // 裁剪选项
    var options = {
        aspectRatio: 400 / 280,
        preview: '.img-preview'
    }
    // 初始化裁剪区域
    $image.cropper(options)

    $("#btnChooseImage").on('click', function () {
        $('#coverFile').click();
    })

    $('#coverFile').on('change', function () {
        const fileList = this.files;
        console.log(fileList);
        if (!fileList) return
        // 根据文件，创建对应的 URL 地址
        var newImgURL = URL.createObjectURL(fileList[0])
        // 为裁剪区域重新设置图片
        $image
            .cropper('destroy') // 销毁旧的裁剪区域
            .attr('src', newImgURL) // 重新设置图片路径
            .cropper(options) // 重新初始化裁剪区域

    })

    let art_state = '已发布';
    $('#saveBtn').on('click', function () {
        art_state = '草稿'
    })

    $('#form-pub').on('submit', function (e) {
        e.preventDefault();
        //构建formaData
        var fd = new FormData(this);
        fd.append('state', art_state);
        $image
            .cropper('getCroppedCanvas', {
                // 创建一个 Canvas 画布
                width: 400,
                height: 280
            })
            .toBlob(function (blob) {
                // 将 Canvas 画布上的内容，转化为文件对象
                // 得到文件对象后，进行后续的操作
                // 5. 将文件对象，存储到 fd 中
                fd.append('cover_img', blob)
                publish(fd)
            })
        // fd.forEach(function (k,v) {
        //     console.log(k,v);
        // })
    })

    function publish(fd) {
        $.ajax({
            method: 'POST',
            url: '/my/article/add',
            data: fd,
            //提交 FormData 格式必须添加以下两个配置项
            contentType: false,
            processData: false,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('发布文章失败！')
                }
                layer.msg('发布文章成功！')
                // 发布文章成功后，跳转到文章列表页面
                location.href = '/art/art_list.html'
                
            }
            
        })
    }
})