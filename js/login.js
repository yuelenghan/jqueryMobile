/**
 * 登录js
 * Created by Administrator on 2014/4/1.
 */

var serverPath = "http://localhost:8080/DataService/";
var loading = false;

/**
 * 登录
 */
function login() {
    if (loading == false) {
        var userName = $("#userName").val();
        var password = $("#password").val();
        var flag = $("#rememberMe").is(':checked');
//    alert("userName = " + userName + ", password = " + password +", flag = " + flag);

        if (userName == undefined || userName == null || userName == "") {
            alert("请输入用户名!");
            return;
        }

        if (password == undefined || password == null || password == "") {
            alert("请输入密码!");
            return;
        }

        var localStorage = window.localStorage;
        localStorage.setItem("flag", flag);
        if (flag) {
            // 记住用户
            localStorage.setItem("userName", userName);
            localStorage.setItem("password", password);
        } else {
            // 清除用户
            localStorage.removeItem("userName");
            localStorage.removeItem("password");
        }

        $.mobile.loading("show", {text: "正在登录...", textVisible: true});
        loading = true;


        $.ajax({
            url: serverPath + "user/login/userName/" + userName + "/password/" + password,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "login1",
            success: function (data) {
                if (data == "success") {
//                $.mobile.changePage("index2.html");
                    window.location.href = "index2.html";
                } else {
                    $().toastmessage('showToast', {
                        text: '登录失败！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'error'
                    });
                }

                $.mobile.loading("hide");
                loading = false;
            },
            error: function () {
                $().toastmessage('showToast', {
                    text: '访问服务器错误！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'error'
                });
                $.mobile.loading("hide");
                loading = false;
            }
        });
    }

}

function logout() {
    if (confirm("确认退出？")) {
        window.location.href = "index.html";
        $.ajax({
            url: serverPath + "user/logout",
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "logout1",
            success: function (data) {
                if (data == "success") {
                    $().toastmessage('showToast', {
                        text: '成功退出！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'success'
                    });
                }
            },
            error: function () {
                $().toastmessage('showToast', {
                    text: '访问服务器错误！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'error'
                });
            }
        });
    }

}

