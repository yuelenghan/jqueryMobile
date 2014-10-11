/**
 * Created by lihe on 14/10/8.
 */
var loading = false;
var serverPath = "http://localhost:8080/DataService/";

function getAqgk() {
    if (loading == false) {
        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }

        var curDate = year + "-" + month + "-" + day;

//            var testDate = "2013-10-22";

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "aqgk/" + curDate,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "aqgk",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("aqgk.html");

                    setTimeout(function () {
                        $("#aqgk-result tbody").html("");

                        for (var i = 0; i < data.length; i++) {
                            var tableStr = "<tr>";
                            tableStr += "<td>" + data[i].deptName + "</td>";
                            tableStr += "<td>" + data[i].yhAll + "</td>";
                            tableStr += "<td>" + data[i].swAll + "</td>";
                            tableStr += "<td>" + data[i].gpAll + "</td>";
                            tableStr += "</tr>";

                            $(tableStr).appendTo($("#aqgk-result tbody"));
                        }

                        // 刷新table, 否则隐藏coloumn功能不可用
                        $("#aqgk-result").table("refresh");
                    }, 200);
                } else {
                    $().toastmessage('showToast', {
                        text: '没有数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                $.mobile.loading("hide");
                loading = false;

            },
            error: function () {
                $.mobile.loading("hide");
                loading = false;

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