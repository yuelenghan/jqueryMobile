/**
 * Created by lh on 14-2-27.
 */

var serverPath = "http://192.168.1.105:8080/DataService/";

// 从服务端得到入井信息统计的数据
function getRjxxcxData() {
    var startDate = $("#startDate-10").val();
    var endDate = $("#endDate-10").val();
    var unit = $("#unit-10").val();
    var title = $("#title-10").val();


    // TODO : 打开注释, 删除测试方法
    // 校验提交的参数
    /*  if (checkRjxxcxData(startDate, endDate, unit, title)) {
     // 提交到服务端
     $.ajax({
     url: serverPath + "summary/rjxx/beginDate/" + startDate + "/endDate/" + endDate + "/dwid/" + unit + "/zwjb/" + title,
     dataType: "jsonp",
     type: "post",
     jsonpCallback: "rjxxSummary",
     success: function (data) {
     if (data != undefined && data != null && data.length > 0) {
     $.mobile.changePage("#rjxxcx2");
     for (var i = 0; i < data.length; i++) {
     var tableStr = "<tr>";
     tableStr += "<td>" + data[i].deptName + "</td>";
     tableStr += "<td>" + data[i].name + "</td>";
     if (data != undefined && data != null && data.length > 0) {
     $.mobile.changePage("#rjxxcx2");
     for (var i = 0; i < data.length; i++) {
     var tableStr = "<tr>";
     tableStr += "<td>" + data[i].deptName + "</td>";
     tableStr += "<td>" + data[i].name + "</td>";
     tableStr += "<td>" + data[i].rjsj + "</td>";
     tableStr + "</tr>";

     //                                $(tableStr).insertAfter($("#rjxxcx-result tr:last"));
     $(tableStr).appendTo($("#rjxxcx-result tbody"));
     }

     // 刷新table, 否则隐藏coloumn功能不可用
     $("#rjxxcx-result").table("refresh");
     } else {
     alert("没有数据!")
     }

     }
     } else {
     alert("没有数据!")
     }

     },
     error: function () {
     alert("error");
     }
     });
     }*/

    // 测试========start========
    unit = "010102";
    title = "152";
    $.ajax({
        url: serverPath + "summary/rjxx/beginDate/" + startDate + "/endDate/" + endDate + "/dwid/" + unit + "/zwjb/" + title,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "rjxxSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#rjxxcx2");
                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].deptName + "</td>";
                    tableStr += "<td>" + data[i].name + "</td>";
                    tableStr += "<td>" + data[i].rjsj + "</td>";
                    tableStr + "</tr>";

//                    $(tableStr).insertAfter($("#rjxxcx-result tr:last"));
                    $(tableStr).appendTo($("#rjxxcx-result tbody"));
                }

                // 刷新table, 否则隐藏coloumn功能不可用
                $("#rjxxcx-result").table("refresh");
            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
    // 测试========end========
}

// 校验入井信息统计提交到服务端的参数
function checkRjxxcxData(startDate, endDate, unit, title) {
    if (startDate == undefined || startDate == null || startDate == "") {
        alert("请输入开始日期!");
        return false;
    }
    if (endDate == undefined || endDate == null || endDate == "") {
        alert("请输入结束日期!");
        return false;
    }
    if (unit == undefined || unit == null || unit == "") {
        alert("请选择单位!");
        return false;
    }
    if (title == undefined || title == null || title == "") {
        alert("请选择职务级别!");
        return false;
    }
}

function getDbjhbData() {
    var date = $("#date-1").val();
    var banci = $("#banci-1").val();
    var name = $("#name-1").val();

    if (date == undefined || date == null || date == "") {
        date = "null";
    }
    if (name == undefined || name == null || name == "") {
        name = "null";
    }

    $.ajax({
        url: serverPath + "summary/dbjhb/date/" + date + "/banci/" + banci + "/name/" + name,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "dbjhbSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#dbjhb2");
                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].mineDate + "</td>";
                    tableStr += "<td>" + data[i].banci + "</td>";
                    tableStr += "<td>" + data[i].person + "</td>";
                    tableStr += "<td>" + data[i].changePerson + "</td>";
                    tableStr += "<td>" + data[i].realPerson + "</td>";
                    tableStr += "</tr>";

                    $(tableStr).appendTo($("#dbjhb-result tbody"));
                }

                // 刷新table, 否则隐藏coloumn功能不可用
                $("#dbjhb-result").table("refresh");
            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
}

function getGpxxData() {
    $.ajax({
        url: serverPath + "summary/gpxx",
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "gpxxSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#gpxx");
                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].maindeptname + "</td>";
                    tableStr += "<td>" + data[i].zrpersonname + "</td>";
                    tableStr += "<td>" + data[i].gpdate + "</td>";
                    tableStr += "<td>" + data[i].gpbanci + "</td>";
                    tableStr += "<td>" + data[i].httypeDesc + "</td>";
                    tableStr += "</tr>";

                    $(tableStr).appendTo($("#gpxx-result tbody"));
                }

                // 刷新table, 否则隐藏coloumn功能不可用
                $("#gpxx-result").table("refresh");
            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
}

function getFswxxData() {
    var startDate = $("#startDate-2").val();
    var endDate = $("#endDate-2").val();
    var name = $("#name-2").val();

//    alert("startDate = " + startDate + ", endDate = " + endDate + ", name = " + name);

    if (startDate == undefined || startDate == null || startDate == "") {
        startDate = "null";
    }
    if (endDate == undefined || endDate == null || endDate == "") {
        endDate = "null";
    }
    if (name == undefined || name == null || name == "") {
        name = "null";
    }

    $.ajax({
        url: serverPath + "summary/fswxx/startDate/" + startDate + "/endDate/" + endDate + "/name/" + name,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "fswxxSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#fswxx2");
                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].deptName + "</td>";
                    tableStr += "<td>" + data[i].name + "</td>";
                    tableStr += "<td>" + data[i].ybsw + "</td>";
                    tableStr += "<td>" + data[i].jyzsw + "</td>";
                    tableStr += "<td>" + data[i].yzsw + "</td>";
                    tableStr += "</tr>";

                    $(tableStr).appendTo($("#fswxx-result tbody"));
                }

                // 刷新table, 否则隐藏coloumn功能不可用
                $("#fswxx-result").table("refresh");
            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
}

function getZbdbldData() {
    var date = $("#date-3").val();
    if (date == undefined || date == null || date == "") {
        alert("请输入日期！");
        return;
    }

    $.ajax({
        url: serverPath + "summary/zbdbld/date/" + date,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "zbdbldSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#zbdbld2");
                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].deptName + "</td>";
                    tableStr += "<td>" + data[i].detail + "</td>";
                    tableStr += "<td>" + data[i].zb + "</td>";
                    tableStr += "<td>" + data[i].zhb + "</td>";
                    tableStr += "<td>" + data[i].yb + "</td>";
                    tableStr += "</tr>";

                    $(tableStr).appendTo($("#zbdbld-result tbody"));
                }

                // 刷新table, 否则隐藏coloumn功能不可用
                $("#zbdbld-result").table("refresh");
            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
}

function getYdyhhzData() {
    var date = $("#date-9").val();
    if (date == undefined || date == null || date == "") {
        alert("请输入日期！");
        return;
    }

    $.ajax({
        url: serverPath + "summary/ydyhhz/date/" + date,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "ydyhhzSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#ydyhhz2");
                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].deptName + "</td>";
                    tableStr += "<td>" + data[i].yhAll + "</td>";
                    tableStr += "<td>" + data[i].yhA + "</td>";
                    tableStr += "<td>" + data[i].yhB + "</td>";
                    tableStr += "<td>" + data[i].yhC + "</td>";
                    tableStr += "<td>" + data[i].yhYqwzg + "</td>";
                    tableStr += "<td>" + data[i].yhLsyq + "</td>";
                    tableStr += "<td>" + data[i].yhYbh + "</td>";
                    tableStr += "<td>" + data[i].yhWbh + "</td>";
                    tableStr += "</tr>";

                    $(tableStr).appendTo($("#ydyhhz-result tbody"));
                }

                // 刷新table, 否则隐藏coloumn功能不可用
                $("#ydyhhz-result").table("refresh");
            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
}
