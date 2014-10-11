/**
 * Created by lihe on 14/10/8.
 */
var serverPath = "http://localhost:8080/DataService/";
var pageSize = 15, pageNo = 1;
var loading = false;

function getDbzbData() {
    if (loading == false) {
        var date = $("#date").val();

        if (date == undefined || date == null || date == "") {
            date = "null";
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        // 提交到服务端
        $.ajax({
            url: serverPath + "summary/zbdbld/date/" + date,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "zbdbldSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#dbzb2");
                    $("#dbzb-result tbody").html("");
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].zb + "</td>";
                        tableStr += "<td>" + data[i].db + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#dbzb-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#dbzb-result").table("refresh");

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