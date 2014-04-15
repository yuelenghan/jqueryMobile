/**
 * 登录js
 * Created by Administrator on 2014/4/1.
 */

var serverPath = "http://192.168.1.105:8080/DataService/";

/**
 * 登录
 */
function login() {
    var userName = $("#userName").val();
    var password = $("#password").val();
//    alert("userName = " + userName + ", password = " + password);

    if (userName == undefined || userName == null || userName == "") {
        alert("请输入用户名!");
        return;
    }

    if (password == undefined || password == null || password == "") {
        alert("请输入密码!");
        return;
    }

    $.ajax({
        url: serverPath + "user/login/userName/" + userName + "/password/" + password,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "login1",
        success: function (data) {
            if (data == "success") {
                $.mobile.changePage("index2.html");
            } else {
                alert("登录失败！");
            }
        },
        error: function () {
            alert("登录失败！");
        }
    });
}