$(function () {
    var Management = function () {
    };

    var $listDtb = $('#list-dtb');
        

    //初始化数据表格
    Management.prototype.initListDtb = function () {
        var options = {
            url: $listDtb.data('ajax-request-url'),
            colHandler: {
                operate: function ($td, row) {
                    return $td.append(
                        '<a class="link-operate" href="javascript:void(0);">编辑</a>' +
                        '<a class="link-danger link-operate" href="javascript:void(0);">删除</a>');
                }
            }
        };
        $listDtb.dataTable(options);
    };


    Management.prototype.initListDtb();
});