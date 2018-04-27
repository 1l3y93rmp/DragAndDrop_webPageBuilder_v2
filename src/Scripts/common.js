$(function () {
    registerNewsletter();
    registerLogin();
    registerForgot();
    registerCallme();
    registerShoppingFirst();
    console.log('批')
    $.postJSON = function (c, b, a) {
        $.ajax({
            type: "POST",
            url: c,
            data: b,
            timeout: 3e3,
            async: false,
            dataType: "json",
            success: a
        });
    };

    window.mq = window.mq || {};
    mq.alert = Popup('alert');
    mq.confirm = Popup('confirm');
});

function registerNewsletter() {
    $("#btnSubscribe,#btnNewletter").on("click", function (event) {
        var strErrMsg = "";
        var strEmail = $(this).closest('form').children("input[type='text']").val();
        var email_check = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;

        if (strEmail == NaN || strEmail == "") {
            parent.mq.alert('請填寫 E-mail 信箱 !', '提示訊息');
            $(this).closest().children(".txt").focus();
        }
        else if (!email_check.test(strEmail)) {
            parent.mq.alert('請填寫有效的 E-mail 信箱 !', '提示訊息');
            $(this).closest().children(".txt").focus();
        }
        else {
            $.post("/Home/Newsletter/", {email: strEmail }, function (data) {
                if (data.result) {
                    parent.mq.alert('訂閱電子報完成 !', '提示訊息');
                }
                else {
                    parent.mq.alert(data.errorMsg, '提示訊息');
                }
            }, "json");
        }

        event.preventDefault();
    });
}

function registerLogin() {

    $("form#loginform input").keypress(function (e) {
        if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
            $("#btnLogin").click();
            return false;
        } else {
            return true;
        }
    });

    $("#btnLogin").on("click", function (event) {
        var strErrMsg = "";
        var strUserName = $("#username").val();
        var strPassword = $("#password").val();
        var strLoginCode = $("#LoginCode").val();
        var strTargetUrl = $("#targetUrl").val();
        var ValidateCode = $("#vclogin").val();

        if (strUserName == NaN || strUserName == "") {
            parent.mq.alert('請輸入會員帳號 !', '提示訊息');
            $(".popup__ok").focus();
        }
        else if (strPassword == NaN || strPassword == "") {
            parent.mq.alert('請輸入會員密碼 !', '提示訊息');
            $(".popup__ok").focus();
        }
        else if (strLoginCode == NaN || strLoginCode == "") {
            parent.mq.alert('請輸入驗證碼 !', '提示訊息');
            $(".popup__ok").focus();
        }
        else {
            $.ajax({
                url: "/Member/Login",
                type: "POST",
                data: { username: strUserName, password: strPassword, code: strLoginCode, targetUrl: strTargetUrl, remember: $('#rememberMe').prop('checked'), validatecode: ValidateCode },
                success: function (response) {
                    if (response != undefined || response != null) {
                        if (response.result) {
                            parent.window.location.href = response.redirectUrl;
                        }
                        else {
                            $("#password").val("");
                            $("#LoginCode").val("");
                            $("#LoginCaptcha").click();
                            parent.mq.alert(response.errorMsg, '提示訊息');
                            $(".popup__ok").focus();
                        }
                    }
                }
            });
        }

        event.preventDefault();
    });

}

function registerForgot() {
    $("#btnForgot").on("click", function (event) {
        var strErrMsg = "";
        var strUserName = $("#accountForgot").val();
        var strForgetCode = $("#ForgetCode").val();

        if (strUserName == NaN || strUserName == "") {
            parent.mq.alert('請輸入會員帳號 !', '提示訊息');
            $("#accountForgot").focus();
        }
        else if (strForgetCode == NaN || strForgetCode == "") {
            parent.mq.alert('請輸入驗證碼 !', '提示訊息');
            $("#ForgetCode").focus();
        }
        else {
            $.ajax({
                url: "/Member/Forgot",
                type: "POST",
                data: { username: strUserName, code: strForgetCode },
                success: function (response) {
                    if (response != undefined || response != null) {
                        if (response.result) {
                            $("#accountForgot").val("");
                            $("#ForgetCode").val("");
                            parent.mq.alert('已寄送新密碼至您的信箱。', '提示訊息');
                            parent.$.magnificPopup.close();
                        }
                        else {
                            parent.mq.alert(response.errorMsg, '提示訊息');
                        }
                    }
                }
            });
        }

        event.preventDefault();
    });
    
}

function registerCallme() {
    $("#btnCallme").on("click", function (event) {
        var strErrMsg = "";
        var strEmail = $("#email").val();
        var strCheck = $("#check").val();
        var email_check = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,6}$/i;
        
        if (strEmail == NaN || strEmail == "") {
            parent.mq.alert('請填寫 E-mail 信箱 !', '提示訊息');
            $("#email").focus();
        }
        else if (strEmail != strCheck) {
            parent.mq.alert('電子郵件不相符', '提示訊息');
            $("#check").focus();
        }
        else if (!email_check.test(strEmail)) {
            parent.mq.alert('請填寫有效的 E-mail 信箱 !', '提示訊息');
            $("#email").focus();
            $("#check").val("");
        }
        else {
            $.post("/Product/ArrivalNotice", { barcode: $(".product-barcode", window.parent.document).text(), email: strEmail }, function (data) {
                if (data.result) {
                    parent.mq.alert('已加入貨到通知 !', '提示訊息');
                }
                else {
                    parent.mq.alert(data.errorMsg, '提示訊息');
                }
                parent.$.magnificPopup.close();
            }, "json");
        }

        event.preventDefault();
    });
}

function registerShoppingFirst() {
    $("#btnShoppingFirst").on("click", function (event) {
        parent.location = getParameterByName("ReturnUrl");
        event.preventDefault();
    });
}

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function FormatNumber(n) {
    n += "";
    var arr = n.split(".");
    var re = /(\d{1,3})(?=(\d{3})+$)/g;
    return arr[0].replace(re, "$1,") + (arr.length == 2 ? "." + arr[1] : "");
}

function FormatFloat(num, pos) {
    var size = Math.pow(10, pos);
    return Math.round(num * size) / size;
}

function openwin(url, title, width, height, config) {
    if (!config) config = "resizable=1,scrollbars=1,status=1";
    if (!width) width = 700;
    if (!height) height = 500;
    config += ",width=" + width + ",height=" + height;

    if (typeof screen != "undefined") {
        w_left = parseInt((screen.width - width) / 2);
        w_top = parseInt((screen.height - height) / 2);
        config += ",left=" + w_left + ",top=" + w_top;
    }

    oWin = window.open(url, title, config);
    oWin.focus();
    return oWin;
}

function IsEmail(email) {
    var regex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regex.test(email);
}

/*
 * constructor
 * create alert or confirm dialog.
 * param {string} type determine whate type to create, alert or confirm.
 */
function Popup(type) {
    var html = '<div class="popup">' +
                  '<div class="popup__inner">' +
                    '<div class="popup__header"><span></span></div>' +
                    '<div class="popup__body"></div>' +
                    '<div class="popup__buttons">' +
                      '<a href="javascripts:;" class="btn popup__cancel">CANCEL</a>' +
                      '<a href="javascripts:;" class="btn popup__ok">OK</a>' +
                    '</div>' +
                  '</div>' +
                '</div>';

    /*
     * call alert or confirm dialog
     * param {string} msg the message to show. required!
     * param {string} title the title of dialog. can be omitted.
     * param {function} callback execute when close the dialog. can be omitted.
     */
    function CreatePopup(msg, title, callback) {
        if (!(this instanceof CreatePopup)) {
            return new CreatePopup(msg, title, callback);
        }

        if (type == 'confirm') {
            this.$el = $(html);
            this.type = 'confirm';
        } else {
            this.$el = $(html);
            this.$el.find('.popup__cancel').remove();
            this.type = 'alert';
        }

        this.init(msg, title, callback);
    }

    CreatePopup.prototype = {
        init: function (msg, title, callback) {
            var self = this,
                args = Array.prototype.slice.call(arguments);

            this.$el.find('.popup__ok').on('click', function (event) {
                self.close();

                if (typeof args[1] === 'function') {
                    args[1](true);
                } else if (typeof args[2] === 'function') {
                    args[2](true);
                }

                event.preventDefault();
            });

            if (this.type == 'confirm') {
                this.$el.find('.popup__cancel').on('click', function (event) {
                    self.close();

                    if (typeof args[1] === 'function') {
                        args[1](false);
                    } else if (typeof args[2] === 'function') {
                        args[2](false);
                    }

                    event.preventDefault();
                });
            }

            this.open(msg, title);
        },

        open: function (msg, title) {
            var self = this,
                $popup_inner = this.$el.find('.popup__inner'),
                height;

            if (typeof msg !== 'string') {
                throw new Error('no msseges!');
            } else {
                this.$el.find('.popup__body').html(msg);
            }

            if (typeof title === 'string') {
                this.$el.find('.popup__header > span').html(title);
            }

            this.$el.appendTo('body');
            $popup_inner.css('opacity', 0);

            height = -(parseInt($popup_inner.outerHeight() / 2, 10)) + 'px';

            setTimeout(function () {
                $popup_inner.css({
                    'opacity': 1,
                    'margin-top': height
                });
            }, 10);
        },

        close: function () {
            this.$el.remove();
        }

    }

    return CreatePopup;

}