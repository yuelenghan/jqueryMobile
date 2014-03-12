/**
 * Created by lh on 14-2-27.
 */

var serverPath = "http://192.168.1.105:8080/DataService/";
var pageSize = 15;

// 从服务端得到入井信息统计的数据
function getRjxxcxData() {
    var startDate = $("#startDate-10").val();
    var endDate = $("#endDate-10").val();
    var name = $("#name-10").val();

    if (startDate == undefined || startDate == null || startDate == "") {
        alert("请输入开始日期!");
        return false;
    }
    if (endDate == undefined || endDate == null || endDate == "") {
        alert("请输入结束日期!");
        return false;
    }

    if (name == undefined || name == null || name == "") {
        alert("请输入姓名!");
        return false;
    }

    // 提交到服务端
    $.ajax({
        url: serverPath + "summary/rjxx/startDate/" + startDate + "/endDate/" + endDate + "/name/" + name + "/start/0/limit/" + pageSize,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "rjxxSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#rjxxcx2");
                $("#rjxxcx-result tbody").html("");
                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].deptName + "</td>";
                    tableStr += "<td>" + data[i].name + "</td>";
                    tableStr += "<td>" + data[i].downTime + "</td>";
                    tableStr + "</tr>";

                    //                                $(tableStr).insertAfter($("#rjxxcx-result tr:last"));
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

    // 测试========start========
    /*unit = "010102";
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
     });*/
    // 测试========end========
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
        url: serverPath + "summary/dbjhb/date/" + date + "/banci/" + banci + "/name/" + name + "/start/0/limit/" + pageSize,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "dbjhbSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#dbjhb2");
                $("#dbjhb-result tbody").html("");
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
        url: serverPath + "summary/gpxx/start/0/limit/" + pageSize,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "gpxxSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#gpxx");
                $("#gpxx-result tbody").html("");
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
        url: serverPath + "summary/fswxx/startDate/" + startDate + "/endDate/" + endDate + "/name/" + name + "/start/0/limit/" + pageSize,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "fswxxSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#fswxx2");
                $("#fswxx-result tbody").html("");
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
        url: serverPath + "summary/zbdbld/date/" + date + "/start/0/limit/" + pageSize,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "zbdbldSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#zbdbld2");
                $("#zbdbld-result tbody").html("");
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
        url: serverPath + "summary/ydyhhz/date/" + date + "/start/0/limit/" + pageSize,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "ydyhhzSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#ydyhhz2");
                $("#ydyhhz-result tbody").html("");
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

function getLdxjdbData() {
    var startDate = $("#startDate-7").val();
    var endDate = $("#endDate-7").val();
    var name = $("#name-7").val();
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
        url: serverPath + "summary/ldxjdb/startDate/" + startDate + "/endDate/" + endDate + "/name/" + name + "/start/0/limit/" + pageSize,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "ldxjdbSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#ldxjdb2");
                $("#ldxjdb-result tbody").html("");

                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].deptName + "</td>";
                    tableStr += "<td>" + data[i].name + "</td>";
                    tableStr += "<td>" + data[i].posName + "</td>";
                    tableStr += "<td>" + data[i].rjAll + "</td>";
                    tableStr += "<td>" + data[i].planFreq + "</td>";
                    tableStr += "<td>" + data[i].dbrj + "</td>";
                    tableStr += "<td>" + data[i].yhAll + "</td>";
                    tableStr += "<td>" + data[i].swAll + "</td>";
                    tableStr += "</tr>";

                    $(tableStr).appendTo($("#ldxjdb-result tbody"));
                }

                // 刷新table, 否则隐藏coloumn功能不可用
                $("#ldxjdb-result").table("refresh");
            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
}

function getKzdkyhData() {
    var date = $("#date-6").val();
    if (date == undefined || date == null || date == "") {
        alert("请输入日期！");
        return;
    }

    $.ajax({
        url: serverPath + "summary/kzdkyh/date/" + date + "/start/0/limit/" + pageSize,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "kzdkyhSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#kzdkyh2");
                $("#kzdkyh-result tbody").html("");

                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].deptName + "</td>";
                    tableStr += "<td>" + data[i].zrDeptName + "</td>";
                    tableStr += "<td>" + data[i].yhAll + "</td>";
                    tableStr += "<td>" + data[i].yhYbh + "</td>";
                    tableStr += "<td>" + data[i].yhWbh + "</td>";
                    tableStr += "<td>" + data[i].yhLsyq + "</td>";
                    tableStr += "<td>" + data[i].yhA + "</td>";
                    tableStr += "<td>" + data[i].yhB + "</td>";
                    tableStr += "<td>" + data[i].yhC + "</td>";
                    tableStr += "</tr>";

                    $(tableStr).appendTo($("#kzdkyh-result tbody"));
                }

                // 刷新table, 否则隐藏coloumn功能不可用
                $("#kzdkyh-result").table("refresh");
            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
}


function getYdswgphzData() {
    var date = $("#date-8").val();
    if (date == undefined || date == null || date == "") {
        alert("请输入日期!");
        return false;
    }

    $.ajax({
        url: serverPath + "summary/ydswgphz/date/" + date + "/start/0/limit/" + pageSize,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "ydswgphzSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#ydswgphz2");
                $("#ydswgphz-result tbody").html("");
                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].deptName + "</td>";
                    tableStr += "<td>" + data[i].swAll + "</td>";
                    tableStr += "<td>" + data[i].swYz + "</td>";
                    tableStr += "<td>" + data[i].swJyz + "</td>";
                    tableStr += "<td>" + data[i].swYb + "</td>";
                    tableStr += "<td>" + data[i].gpAll + "</td>";
                    tableStr += "<td>" + data[i].gpWz + "</td>";
                    tableStr += "<td>" + data[i].gpYz + "</td>";
                    tableStr += "</tr>";

                    $(tableStr).appendTo($("#ydswgphz-result tbody"));
                }

                // 刷新table, 否则隐藏coloumn功能不可用
                $("#ydswgphz-result").table("refresh");
            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
}

function getSwxxcxData() {
    var startDate = $("#startDate-11").val();
    var endDate = $("#endDate-11").val();
    var name = $("#name-11").val();

    if (startDate == undefined || startDate == null || startDate == "") {
        alert("请输入开始日期!");
        return false;
    }
    if (endDate == undefined || endDate == null || endDate == "") {
        alert("请输入结束日期!");
        return false;
    }

    if (name == undefined || name == null || name == "") {
        alert("请输入姓名!");
        return false;
    }

    // 提交到服务端
    $.ajax({
        url: serverPath + "summary/swxx/startDate/" + startDate + "/endDate/" + endDate + "/name/" + name + "/start/0/limit/" + pageSize,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "swxxSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#swxxcx2");
                $("#swxxcx-result tbody").html("");
                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].mainDeptName + "</td>";
                    tableStr += "<td>" + data[i].zrkqName + "</td>";
                    tableStr += "<td>" + data[i].swpName + "</td>";
                    tableStr += "<td>" + data[i].pctime + "</td>";
                    tableStr += "<td>" + data[i].levelName + "</td>";
                    tableStr + "</tr>";

                    $(tableStr).appendTo($("#swxxcx-result tbody"));
                }

                // 刷新table, 否则隐藏coloumn功能不可用
                $("#swxxcx-result").table("refresh");

            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
}

function getYhfltjcxData() {
    var startDate = $("#startDate-12").val();
    var endDate = $("#endDate-12").val();
    var unit = $("#unit-12").val();

    if (startDate == undefined || startDate == null || startDate == "") {
        alert("请输入开始日期!");
        return false;
    }
    if (endDate == undefined || endDate == null || endDate == "") {
        alert("请输入结束日期!");
        return false;
    }

    if (unit == undefined || unit == null || unit == "") {
        unit = "null";
    }

    $.ajax({
        url: serverPath + "summary/yhfltjcx/startDate/" + startDate + "/endDate/" + endDate + "/unit/" + unit + "/start/0/limit/" + pageSize,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "yhfltjcxSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#yhfltjcx2");
                $("#yhfltjcx-result tbody").html("");
                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].deptName + "</td>";
                    tableStr += "<td>" + data[i].zrDeptName + "</td>";
                    tableStr += "<td>" + data[i].yhAll + "</td>";
                    tableStr += "<td>" + data[i].yhYbh + "</td>";
                    tableStr += "<td>" + data[i].yhWbh + "</td>";
                    tableStr += "<td>" + data[i].yhLsyq + "</td>";
                    tableStr += "<td>" + data[i].yhA + "</td>";
                    tableStr += "<td>" + data[i].yhB + "</td>";
                    tableStr += "<td>" + data[i].yhC + "</td>";
                    tableStr + "</tr>";

                    $(tableStr).appendTo($("#yhfltjcx-result tbody"));
                }

                // 刷新table, 否则隐藏coloumn功能不可用
                $("#yhfltjcx-result").table("refresh");

            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
}

function getYhxxzhcxData() {
    var startDate = $("#startDate-13").val();
    var endDate = $("#endDate-13").val();
    var unit = $("#unit-13").val();
    var banci = $("#banci-13").val();

//    alert("startDate = " + startDate + ", endDate = " + endDate + ", unit = " + unit + ", banci = " + banci);
    if (startDate == undefined || startDate == null || startDate == "") {
        alert("请输入开始日期!");
        return false;
    }
    if (endDate == undefined || endDate == null || endDate == "") {
        alert("请输入结束日期!");
        return false;
    }

    if (unit == undefined || unit == null || unit == "") {
        unit = "null";
    }

    $.ajax({
        url: serverPath + "summary/yhxxzhcx/startDate/" + startDate + "/endDate/" + endDate + "/unit/" + unit + "/banci/" + banci + "/start/0/limit/" + pageSize,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "yhxxzhcxSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#yhxxzhcx2");
                $("#yhxxzhcx-result tbody").html("");
                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].zrDeptName + "</td>";
                    tableStr += "<td>" + data[i].banci + "</td>";
                    tableStr += "<td>" + data[i].pcTime + "</td>";
                    tableStr += "<td>" + data[i].levelName + "</td>";
                    tableStr += "<td>" + data[i].typeName + "</td>";
                    tableStr += "<td>" + data[i].status + "</td>";
                    tableStr + "</tr>";

                    $(tableStr).appendTo($("#yhxxzhcx-result tbody"));
                }

                // 刷新table, 否则隐藏coloumn功能不可用
                $("#yhxxzhcx-result").table("refresh");

            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
}

function getGsxxData() {
    var startDate = $("#startDate-4").val();
    var endDate = $("#endDate-4").val();
    var unit = $("#unit-4").val();
    var level = $("#level-4").val();
    var name = $("#name-4").val();

//    alert("startDate = " + startDate + ", endDate = " + endDate + ", unit = " + unit + ", level = " + level + ", name = " + name);

    if (startDate == undefined || startDate == null || startDate == "") {
        startDate = "null";
    }
    if (endDate == undefined || endDate == null || endDate == "") {
        endDate = "null";
    }

    if (unit == undefined || unit == null || unit == "") {
        unit = "null";
    }
    if (name == undefined || name == null || name == "") {
        name = "null";
    }
//    alert("startDate = " + startDate + ", endDate = " + endDate + ", unit = " + unit + ", level = " + level + ", name = " + name);

    $.ajax({
        url: serverPath + "summary/gsxx/startDate/" + startDate + "/endDate/" + endDate + "/unit/" + unit + "/level/" + level + "/name/" + name + "/start/0/limit/" + pageSize,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "gsxxSummary",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                $.mobile.changePage("#gsxx2");
                $("#gsxx-result tbody").html("");
                for (var i = 0; i < data.length; i++) {
                    var tableStr = "<tr>";
                    tableStr += "<td>" + data[i].deptName + "</td>";
                    tableStr += "<td>" + data[i].name + "</td>";
                    tableStr += "<td>" + data[i].level + "</td>";
                    tableStr += "<td>" + data[i].happenDate + "</td>";
                    tableStr + "</tr>";

                    $(tableStr).appendTo($("#gsxx-result tbody"));
                }

                // 刷新table, 否则隐藏coloumn功能不可用
                $("#gsxx-result").table("refresh");

            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
}

function gotoGsxx() {
    $.mobile.changePage("#gsxx1");

    $.ajax({
        url: serverPath + "baseInfo/gsLevel",
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "gsLevel",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#level-4");
                select.html("");
                var selectStr = "<option value='null'>--全部--</option>";
                for (var i = 0; i < data.length; i++) {
                    selectStr += "<option value='" + data[i].infoname + "'>" + data[i].infoname + "</option>";
                }
                $(selectStr).appendTo(select);
            } else {
                alert("没有数据!")
            }

        },
        error: function () {
            alert("error");
        }
    });
}