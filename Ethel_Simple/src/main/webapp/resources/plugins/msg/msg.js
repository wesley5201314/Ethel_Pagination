//消息插件
(function ($) {
    var msg = '.msg';

    var Msg = function (type, text) {
        this.$div;
        this.timeout;
        this.init(type, text);
    };

    Msg.prototype.init = function (type, text) {
        if (!this.$div) {
            this.$div = $('<div id="msg" class="msg"></div>');
            $(document.body).append(this.$div);
        } else {
            this.$div.hide();
        }
        switch (type) {
            case 'success':
                this.$div.html('<span class="msg-success">' + text + '</span>');
                break;
            case 'fail':
                this.$div.html('<span class="msg-fail">' + text + '</span>');
                break;
            case 'tip':
                this.$div.html('<span class="msg-tip">' + text + '</span>');
                break;
        }
        clearTimeout(this.timeout);
        this.$div.css('margin-left', '-' + this.$div.outerWidth() / 2 + 'px');
        this.$div.fadeIn(200, $.proxy(Msg.prototype.hide, this));
    };

    Msg.prototype.hide = function () {
        if (this.$div) {
            this.timeout = setTimeout(function (obj) {
                return function () {
                    obj.$div.fadeOut(200);
                }
            }(this), 3000);
        } else {
            $(this).fadeOut(200);
        }
    };

    $.msg = function (type, text) {
        var $this = $(document.body),
            data = $this.data('Msg');
        if (!data) {
            return $this.data('Msg', (data = new Msg(type, text)));
        } else {
            data.init(type, text);
        }
    };

    $(document).on('click', msg, Msg.prototype.hide);

})(jQuery);
