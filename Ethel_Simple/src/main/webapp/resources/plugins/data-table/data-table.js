(function ($) {
    //modernizr检查CSS3支持度
    var low = $('html').hasClass('no-borderradius') ? true : false;

    var DataTable = function (table, options, conds) {
        this.$table = $(table);
        this.$footer;
        this.$loading;
        this.options = $.extend({}, DataTable.DEFAULT, options);
        this.cols = [];
        this.checkboxColName;//缓存复选框的类名
        this.conds = {};
        this.dataSnap = null;
        this._init(conds);
    };

    DataTable.DEFAULT = {
        //数据请求地址
        url: null,
        //json数据
        jsonData: null,
        /*
         jsonData : '{
         "rows" : [],
         "total" : 10
         }'
         */
        //请求参数
        data: null,
        /*
         data : {
         param1: 'value1',
         param2: 'value2',
         }
         */
        //隔行变色
        isStriped: true,
        //是否分页
        isPagination: true,
        //单页记录数
        pageSize: 10,
        //页码数
        paginationSize: 5,
        //是否显示跳页
        isSkipPage: true,
        //清除footer浮动
        isClearFooter: true,
        //列处理器
        colHandler: {},
        /*
         colHandler : {
         handler1 : func,
         handler2 : func
         }
         */
        //分组数据
        groupData: null,
        /*
         groupData : {
         priId : 'provinceCode',
         priName : 'province',
         subName : 'eparchy'
         }
         */
        //processData
        processData: function (data) {
            return data;
        },
        //afterRender
        afterRender: function (data) {
            return true;
        },
        //操作工具条
        toolbars: '',
        //是否显示全选
        isShowCheckAll: false
    };

    DataTable.prototype._init = function (conds) {
        var _this = this;
        //加载样式
        _this._loadStyle();
        $('thead>tr>th', _this.$table).each(function () {
            var $this = $(this),
                colName = $this.data('dtb-col'),
                isCheckbox = $this.data('dtb-checkbox');
            //设置列宽
            if (typeof $this.data('dtb-width') == 'number') $this.css('width', $this.data('dtb-width') + '%');

            //设置列加载方式，优先匹配colHandler
            for (var handler in _this.options.colHandler) {
                if (handler == colName) {
                    _this.cols.push(_this.options.colHandler[handler]);
                    return true;
                }
            }

            //当该列是复选框时记录列名
            if(isCheckbox){
                _this.checkboxColName = colName;
            }

            _this.cols.push(colName);
        });
        _this.load(0, conds);
        //分组事件
        if (_this.options.groupData) {
            _this.$table.off('click', 'div.priCol', DataTable.prototype.collapseSubRow);
            _this.$table.on('click', 'div.priCol', DataTable.prototype.collapseSubRow);
        }
    };

    //加载样式
    DataTable.prototype._loadStyle = function () {
        if (!$('>tbody', this.$table)[0]) {
            this.$table
                .addClass('data-table')
                .append('<tbody></tbody>')
                .after('<div class="data-table-footer"><div class="toolbars">'+this.options.toolbars+'</div><div class="page-area"></div></div>');
        }
        //loading
        this.$loading = $('.loading', this.$table);
        if (!this.$loading[0]) {
            this.$loading = $('<span class="loading"><i class="fa fa-spinner fa-spin" /></span>');
            $('>thead>tr>th:nth-child(1)', this.$table).append(this.$loading);
        }
        //隔行变色
        if (this.options.isStriped && !this.options.groupData) {
            this.$table.addClass('data-table-striped');
        } else {
            this.$table.removeClass('data-table-striped');
        }
        //页脚
        this.$footer = this.$table.next();
        //不分页
        if (!this.options.isPagination) {
            this.$footer.addClass('none-pagination');
        } else {
            this.$footer.removeClass('none-pagination');
        }
        //增加全选按钮
        if (this.options.isShowCheckAll ) {
            this.$footer.prepend('<label class="show-check-all"><input type="checkbox">全选</label>');
        }
    };

    //beforeSend
    DataTable.prototype._beforeSend = function (jqXHR, settings) {
        var $this = $(this),
            $loading = $('span.loading', $this);
        if (!$('>tbody>tr', $this)[0]) {
            $loading.css('top', '4px');
            $loading.css('left', '10px');
        } else {
            $loading.css('top', $this.height() / 2 - 15 + 'px');
            $loading.css('left', $this.width() / 2 - 40 + 'px');
        }
        $loading.show();
        return true;
    };

    DataTable.prototype.load = function (pageIndex, conds) {
        var _this = this;
        _this.$footer.show();
        _this.$footer.find('.show-check-all').children('input').prop('checked', false);
        //更新查询条件
        if (conds) {
            _this.conds = {};
            for (var p in conds) {
                _this.conds[p] = conds[p];
            }
        }
        if (_this.options.data) {
            _this.conds = $.extend({}, _this.conds, _this.options.data);
        }
        if (_this.options.isPagination) {
            _this.conds.pageIndex = pageIndex;
            _this.conds.pageSize = _this.options.pageSize;
        }
        if (_this.options.url) {
            //请求数据
            $.ajax({
                url: _this.options.url,
                type: 'POST',
                dataType: 'json',
                data: _this.conds,
                context: _this.$table,
                beforeSend: _this._beforeSend
            })
                .done(function (data) {
                    _this._parseData(pageIndex, data);
                })
                .fail(function () {
                    $.msg('fail', '请求失败，请检查网络设置');
                })
                .always(function () {
                    _this.$loading.hide();
                });
        } else if (_this.options.jsonData) {
            var data = JSON.parse(_this.options.jsonData);
            _this._parseData(pageIndex, data);
        }
    };

    //处理数据
    DataTable.prototype._parseData = function (pageIndex, data) {
        this.dataSnap = $.extend(true,{},data);
        //processData
        data = this.options.processData(data);
        //存在数据
        if (data.total > 0) {
            //加载数据
            if (this.options.groupData) {
                this._loadGroupData(data.rows);
            } else {
                this._loadData(data.rows);
            }
            //加载分页
            if (this.options.isPagination) {
                this._loadPagination(pageIndex, data.total);
            }
            //无数据
        } else {
            //加载警告
            this._loadAlert();
        }
        //afterRender
        this.options.afterRender(data);
    };

    //加载数据
    DataTable.prototype._loadData = function (rows) {
        var $tbody = $('tbody', this.$table),
            $trs = $('<tbody></tbody>'),
            row,
            $tr,
            $td;
        for (var i in rows) {
            row = rows[i];
            $tr = $('<tr></tr>');
            for (var j in this.cols) {
                $td = $('<td></td>');
                if (typeof this.cols[j] == 'function') {
                    $td = this.cols[j]($td, row);
                } else if (typeof this.cols[j] == 'string'){
                    if(this.checkboxColName && this.cols[j] === this.checkboxColName){//当存在复选框的时候设置复选框
                        $td.append('<input type="checkbox" class="dtb-checkbox" data-row="'+JSON.stringify(row)+'"/>');
                    }
                    $td.append(row[this.cols[j]]);
                }

                $tr.append($td);
            }
            $trs.append($tr);
        }
        $tbody.html($trs.html());
        if (low && this.$table.hasClass('data-table-striped')) $('tr:odd', $tbody).addClass('dtbStripedBgColor');
    };

    //加载分组数据
    DataTable.prototype._loadGroupData = function (rows) {
        var $tbody = $('tbody', this.$table),
            $trs = $('<tbody></tbody>'),
            row,
            subRow,
            $tr,
            $td;
        for (var i in rows) {
            row = rows[i];
            $tr = $('<tr class="priRow" data-dtb-pri-id="' + row[this.options.groupData.priId] + '"></tr>');
            for (var j in this.cols) {
                $td = $('<td></td>');
                if (this.cols[j] == 'groupCol') {
                    if (row.subRows.length > 0) {
                        $td.append('<div class="priCol">' + row[this.options.groupData.priName] + '</div>');
                    } else {
                        $td.append(row[this.options.groupData.priName]);
                    }
                } else if (typeof this.cols[j] == 'function') {
                    $td = this.cols[j]($td, row);
                } else if (typeof this.cols[j] == 'string') {
                    $td.append(row[this.cols[j]]);
                }
                $tr.append($td);
            }
            $trs.append($tr);
            for (var k in row.subRows) {
                subRow = row.subRows[k];
                $tr = $('<tr class="subRow" data-dtb-pri-id="' + row[this.options.groupData.priId] + '"></tr>');
                for (var j in this.cols) {
                    $td = $('<td></td>');
                    if (this.cols[j] == 'groupCol') {
                        $td = $td.append(subRow[this.options.groupData.subName]);
                    } else if (typeof this.cols[j] == 'function') {
                        $td = this.cols[j]($td, subRow);
                    } else if (typeof this.cols[j] == 'string') {
                        $td.append(subRow[this.cols[j]]);
                    }
                    $tr.append($td);
                }
                $trs.append($tr);
            }
        }
        $tbody.html($trs.html());
        $('tr.priRow:odd', $tbody).addClass('dtbStripedBgColor');
    };

    //加载分页
    DataTable.prototype._loadPagination = function (pageIndex, total) {
        //pagination
        var $pagination = this.$footer.children('div.page-area').children('ul.pagination');
        if (!$pagination[0]) {
            $pagination = $('<ul class="pagination pagination-sm"></ul>');
            this.$footer.children('div.page-area').append($pagination);
        }
        var $lis = $('<ul></ul>'),
            lastPageIndex = Math.ceil(total / this.options.pageSize) - 1,
            paginationMid = this.options.paginationSize % 2 == 0 ? (this.options.paginationSize) / 2 : (this.options.paginationSize - 1) / 2;
        pageIndex = Number(pageIndex);
        if (pageIndex > 0) {
            $lis
                .append(this._paginationTmpl('首页', 0))
                .append(this._paginationTmpl('上页', pageIndex - 1));
        }
        if (pageIndex < paginationMid) {
            for (var i = 0; i < this.options.paginationSize; i++) {
                if (i != pageIndex && i <= lastPageIndex) $lis.append(this._paginationTmpl(i + 1, i));
                if (i == pageIndex) $lis.append(this._paginationTmpl(i + 1, i, 'active'));
            }
        } else if (lastPageIndex - pageIndex < paginationMid) {
            for (var i = lastPageIndex - this.options.paginationSize + 1; i <= lastPageIndex; i++) {
                if (i != pageIndex && i >= 0) $lis.append(this._paginationTmpl(i + 1, i));
                if (i == pageIndex) $lis.append(this._paginationTmpl(i + 1, i, 'active'));
            }
        } else {
            for (var i = -paginationMid; i <= paginationMid; i++) {
                if (i != 0 && pageIndex + i >= 0 && pageIndex + i <= lastPageIndex) $lis.append(this._paginationTmpl(pageIndex + i + 1, pageIndex + i));
                if (i == 0) $lis.append(this._paginationTmpl(pageIndex + 1, pageIndex, 'active'));
            }
        }
        if (pageIndex < lastPageIndex) {
            $lis
                .append(this._paginationTmpl('下页', pageIndex + 1))
                .append(this._paginationTmpl('尾页', lastPageIndex));
        }
        $pagination.html($lis.html());
        //skipPage
        if (this.options.isSkipPage) {
            var $skipPage = this.$footer.children('.page-area').children('ul.skipPage');
            if (!$skipPage[0]) {
                $skipPage = $('<ul class="skipPage"></ul>');
                $skipPage
                    .append('<li>转到<input type="text" />页</li>')
                    .append('<li><button type="button" class="btn btn-primary">确定</button></li>');
                $pagination.after($skipPage);
            }
        }
        //pageInfo
        var $pageInfo = this.$footer.children('.page-area').children('ul.pageInfo');
        if (!$pageInfo[0]) {
            $pageInfo = $('<ul class="pageInfo"></ul>');
            $pageInfo
                .append('<li class="totalPage">共' + (lastPageIndex + 1) + '页</li>')
                .append('<li class="totalRecord">' + total + '条记录</li>');
            $pagination.before($pageInfo);
        }
        $pageInfo.children('li.totalPage').html('共' + (lastPageIndex + 1) + '页');
        $pageInfo.children('li.totalRecord').html(total + '条记录');
    };

    //页码模板
    DataTable.prototype._paginationTmpl = function (content, pageIndex, clazz) {
        return $('<li' + (clazz ? ' class="' + clazz + '"' : '') + '><a href="' + pageIndex + '">' + content + '</a></li>');
    };

    //加载警告
    DataTable.prototype._loadAlert = function () {
        var $trs = $('<tbody></tbody>'),
            $td = $('<td colspan="' + this.cols.length + '"></td>'),
            $div = $('<div class="alert alert-warning"></div>');
        $div.html('没有符合条件的条目，请重新输入条件，进行查询！');
        $trs.append($td.append($div));
        $('tbody', this.$table).html($trs.html());
        this.$footer.hide();
    };

    //换页
    DataTable.prototype.page = function (e) {
        e.preventDefault();
        var $this = $(this),
            $li = $this.parent();
        if ($li.hasClass('active') || $li.hasClass('total')) return false;
        $this
            .parents('.page-area').parents('.data-table-footer')
            .prev()
            .data('data-table')
            .load(Number($this.attr('href')));
    };

    //跳转
    DataTable.prototype.skip = function (e) {
        e.preventDefault();
        var $this = $(this),

            inputNum = Number($this.parent().prev().children('input').val()),
            totalPage = Number($this.parents('ul.skipPage').siblings('ul.pageInfo').children('li.totalPage').html().replace(/\D/g, ""));
        if (!$.isNumeric(inputNum) || inputNum <= 0 || inputNum > totalPage) return false;
        $this
            .parents('.page-area').parents('.data-table-footer')
            .prev()
            .data('data-table')
            .load(inputNum - 1);
    };

    //跳转页数只能输入数字
    DataTable.prototype.skipPageInput = function (e) {
        var $this = $(this),
            inputVal = $this.val();
        if (!(/^\d+$/.test(inputVal))) {
            $this.val(/^\d+/.exec(inputVal));
            return false;
        }
    };

    //展开&收起subRow
    DataTable.prototype.collapseSubRow = function (e) {
        var $this = $(this),
            $tbody = $this.parents('tbody'),
            $tr = $this.parents('tr'),
            priId = $this.parents('tr').data('dtb-pri-id');
        if (!$this.hasClass('priColExpand')) {
            $('>tr.subRow[data-dtb-pri-id="' + priId + '"]', $tbody).show();
        } else {
            $('>tr.subRow[data-dtb-pri-id="' + priId + '"]', $tbody).hide();
        }
        $this.toggleClass('priColExpand');
    };

    //获取数据
    DataTable.prototype.getData = function (e) {
        return $.extend(true,{},this.dataSnap);
    };

    //获取所有被选中的数据
    DataTable.prototype.getSelections = function (e) {
        var selections = [];
        var rows = this.dataSnap.rows;
        this.$table.find('.dtb-checkbox').each(function(i){
            if($(this).prop('checked')){
                selections.push(rows[i]);
            }
        });
        return selections;
    };

    //点击全选文字
    DataTable.prototype.labelCheckAll = function(){
        var $this = $(this);
        if($this.children('input').prop('checked')){
            $this.parents('.data-table-footer').prev('table').find('.dtb-checkbox').prop('checked', false);
        } else{
            $this.parents('.data-table-footer').prev('table').find('.dtb-checkbox').prop('checked', true);
        }
    };
    //点击全选选择框
    DataTable.prototype.checkBoxAll = function(){
        var $this = $(this);
        if($this.prop('checked')){
            $this.prop('checked', true);
            $this.parents('.data-table-footer').prev('table').find('.dtb-checkbox').prop('checked', true);
        } else{
            $this.prop('checked', false);
            $this.parents('.data-table-footer').prev('table').find('.dtb-checkbox').prop('checked', false);
        }
    };

    //点击表格中的checkBox
    DataTable.prototype.singleSelection = function(){
        var isChecked = true,
            $this=$(this),
            $table=$this.parents('table');
        $table.find('.dtb-checkbox').each(function(){
            var $this = $(this);
            if(!$this.prop('checked')){
                isChecked = false;
                return false;
            }
        });
        if(isChecked){
            $this.parents('table').next('.data-table-footer').children('.show-check-all').children('input').prop('checked', true)
        }else{
            $this.parents('table').next('.data-table-footer').children('.show-check-all').children('input').prop('checked', false)
        }

    };

    $.fn.dataTable = function (options, param) {
        if (typeof options == 'string') return $.fn.dataTable.methods[options](this, param);
        return this.each(function () {
            var $this = $(this),
                data = $this.data('data-table');
            return $this.data('dataTable', (data = new DataTable(this, options, param)));
        });
    };

    $.fn.dataTable.methods = {
        //重新加载数据
        reload: function (table, conds) {
            return $(table).data('data-table').load(0, conds);
        },
        //刷新当页数据
        refresh: function (table, conds) {
            var dataTable = $(table).data('data-table');
            return dataTable.load(dataTable.conds.pageIndex, conds);
        },
        //获取数据
        getData: function (table, conds) {
            var dataTable = $(table).data('data-table');
            return dataTable.getData();
        },
        //获取所有被选中的数据
        getSelections:function (table) {
            var dataTable = $(table).data('data-table');
            return dataTable.getSelections();
        }
    };

    $(document).on('click','.show-check-all>input', function (e) {
        e.stopPropagation();
    });

    $(document)
        .on('click', '.dtb-checkbox', DataTable.prototype.singleSelection)
        .on('click', '.show-check-all', DataTable.prototype.labelCheckAll)
        .on('click', '.show-check-all>input', DataTable.prototype.checkBoxAll)
        .on('click', 'ul.pagination>li>a', DataTable.prototype.page)
        .on('click', 'ul.skipPage>li>button', DataTable.prototype.skip)
        .on('keyup', '.skipPage>li>input[type="text"]', DataTable.prototype.skipPageInput)
        .on('click', 'ul.skipPage>li>button', DataTable.prototype.skip)

})(jQuery);