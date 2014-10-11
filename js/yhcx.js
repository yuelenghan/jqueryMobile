/**
 * Created by lihe on 14/10/9.
 */
var serverPath = "http://localhost:8080/DataService/";
var pageSize = 15, pageNo = 1;
var loading = false;

var mainDeptId;
var leader = false;

var summaryScroll2;

function initYhLevel() {
    $.ajax({
        url: serverPath + "baseInfo/41",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "yhLevel",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#level");
                select.html("");
                var selectStr = "<option value='-1'>--全部--</option>";
                for (var i = 0; i < data.length; i++) {
                    selectStr += "<option value='" + data[i].infoid + "'>" + data[i].infoname + "</option>";
                }
                $(selectStr).appendTo(select);
                select.selectmenu('refresh', true);
            }
        },
        error: function () {
//            alert("error!");
            $().toastmessage('showToast', {
                text: '访问服务器错误！',
                sticky: false,
                position: 'middle-center',
                type: 'error'
            });
        }
    });
}

function initYhType() {
    $.ajax({
        url: serverPath + "baseInfo/1",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "yhType",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#type");
                select.html("");
                var selectStr = "<option value='-1'>--全部--</option>";
                for (var i = 0; i < data.length; i++) {
                    selectStr += "<option value='" + data[i].infoid + "'>" + data[i].infoname + "</option>";
                }
                $(selectStr).appendTo(select);
                select.selectmenu('refresh', true);
            }
        },
        error: function () {
//            alert("error!");
            $().toastmessage('showToast', {
                text: '访问服务器错误！',
                sticky: false,
                position: 'middle-center',
                type: 'error'
            });
        }
    });
}

function initPcPerson() {
    $.ajax({
        url: serverPath + "yhEnter/pcPerson",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "pcPerson",
        success: function (data) {
            if (data != undefined && data != null && data != "null") {
//                alert(data.personNumber + "," + data.personName);
                $("#pcPersonNumber").val(data.personNumber);
                $("#pcPersonName").val(data.personName);

                // 登录人员为领导
                if (data.roleLevel == 1) {
                    leader = true;
                } else {
                    mainDeptId = data.mainDeptId;
                }

            }
        },
        error: function () {
//            alert("error!");
            $().toastmessage('showToast', {
                text: '访问服务器错误！',
                sticky: false,
                position: 'middle-center',
                type: 'error'
            });
        }
    });

}

function getYhcxData() {
    if (loading == false) {
        pageNo = 1;

        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        var dept = $("#deptNumber").text();
        var status = $("#status").val();
        var pcType = $("#pcType").val();
        var type = $("#type").val();
        var place = $("#place").val();
        var zgType = $("#zgType").val();
        var level = $("#level").val();


//        alert("startDate = " + startDate + ", endDate = " + endDate + ", dept = " + dept + ", name = " + name);

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }

        if (dept == undefined || dept == null || dept == "") {
            dept = "null";
        }

        if (zwjb == "-1" || zwjb == -1) {
            zwjb = "null";
        }

        if (name == undefined || name == null || name == "") {
            name = "null";
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        // 提交到服务端
        $.ajax({
            url: serverPath + "summary/rjxx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + dept + "/zwjb/" + zwjb + "/name/" + name + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
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
                        tableStr += "</tr>";

                        //                                $(tableStr).insertAfter($("#rjxxcx-result tr:last"));
                        $(tableStr).appendTo($("#rjxxcx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#rjxxcx-result").table("refresh");

                    // 销毁下拉刷新插件
                    if (summaryScroll2) {
                        summaryScroll2.destroy();
                        summaryScroll2 = null;
                    }

                    loadSummaryScroll2();


                } else {
//                    alert("没有数据!")
//                    $.mobile.changePage("#alert-dialog");
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
//                alert("error");
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

function returndept() {
    $.mobile.changePage("#yhcx1", {transition: "flip"});
    var deptNumber, deptName;
    if ($("#dept-" + currentDisplayLevel).val() == -1) {
        if (currentDisplayLevel == 1) {
            deptNumber = "";
            deptName = "";
        } else {
            deptNumber = $("#dept-" + (currentDisplayLevel - 1)).val();
            deptName = $("#dept-" + (currentDisplayLevel - 1)).find("option:selected").text();
        }
    } else {
        deptNumber = $("#dept-" + currentDisplayLevel).val();
        deptName = $("#dept-" + currentDisplayLevel).find("option:selected").text();
    }
    $("#deptNumber").text(deptNumber);
    $("#deptName").text(deptName);

}

function filterPlace() {
    if (loading == false) {
        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        // 过滤条件
        var arg = $("#placeFilter").val();
        if (arg == undefined || arg == null || arg == "") {
            arg = "null";
        }

        // 如果是领导, 直接根据arg过滤; 如果不是领导, 根据arg和部门过滤
        if (leader) {
            $.ajax({
                url: serverPath + "yhcx/place/" + arg,
                dataType: "jsonp",
                type: "post",
                jsonpCallback: "place",
                success: function (data) {
                    if (data != undefined && data != null && data.length > 0) {
                        var select = $("#place");
                        select.html("");
                        var selectStr = "";
                        for (var i = 0; i < data.length; i++) {
                            selectStr += "<option value='" + data[i].placeid + "'>" + data[i].placename + "</option>";

                        }
                        $(selectStr).appendTo(select);
                        select.selectmenu('refresh', true);
                    }

                    $.mobile.loading("hide");
                    loading = false;
                },
                error: function () {
                    $.mobile.loading("hide");
                    loading = false;
//                alert("error!");
                    $().toastmessage('showToast', {
                        text: '访问服务器错误！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'error'
                    });
                }
            });
        } else {
            $.ajax({
                url: serverPath + "yhcx/place/deptNumber/" + mainDeptId + "/" + arg,
                dataType: "jsonp",
                type: "post",
                jsonpCallback: "place",
                success: function (data) {
                    if (data != undefined && data != null && data.length > 0) {
                        var select = $("#place");
                        select.html("");
                        var selectStr = "";
                        for (var i = 0; i < data.length; i++) {
                            selectStr += "<option value='" + data[i].placeid + "'>" + data[i].placename + "</option>";

                        }
                        $(selectStr).appendTo(select);
                        select.selectmenu('refresh', true);
                    }

                    $.mobile.loading("hide");
                    loading = false;
                },
                error: function () {
                    $.mobile.loading("hide");
                    loading = false;
//                alert("error!");
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

}