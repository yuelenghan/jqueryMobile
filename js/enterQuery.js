/**
 * Created by Administrator on 2014/4/23.
 */

var serverPath = "http://192.168.1.123:8080/DataService/";
var mainDeptId, loading = false;

function initYhLevel() {
    $.ajax({
        url: serverPath + "baseInfo/41",
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "yhLevel",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#level");
                select.html("");
                var selectStr = "<option value='null'>--全部--</option>";
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

function initSwLevel() {
    $.ajax({
        url: serverPath + "baseInfo/46",
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "swLevel",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#level");
                select.html("");
                var selectStr = "<option value='null'>--全部--</option>";
                for (var i = 0; i < data.length; i++) {
                    selectStr += "<option value='" + data[i].infoid + "'>" + data[i].infoname + "</option>";
                }
                $(selectStr).appendTo(select);
                select.selectmenu('refresh', true);
            }
        },
        error: function () {
            alert("error!");
        }
    });
}

function selectTarget(selVal) {
//    alert(selVal);
    if (selVal == "yh") {
        initYhLevel();
        initYhType();
    }
    if (selVal == "sw") {
        initSwLevel();
        initSwType();
    }
}

function initYhType() {
    $.ajax({
        url: serverPath + "baseInfo/1",
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "yhType",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#type");
                select.html("");
                var selectStr = "<option value='null'>--全部--</option>";
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

function initSwType() {
    $.ajax({
        url: serverPath + "baseInfo/102",
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "swType",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#type");
                select.html("");
                var selectStr = "<option value='null'>--全部--</option>";
                for (var i = 0; i < data.length; i++) {
                    selectStr += "<option value='" + data[i].infoid + "'>" + data[i].infoname + "</option>";
                }
                $(selectStr).appendTo(select);
                select.selectmenu('refresh', true);
            }
        },
        error: function () {
            alert("error!");
        }
    });
}

function query() {
    var target = $("#target").val();
    var banci = $("#banci").val();
    var level = $("#level").val();
    var type = $("#type").val();

    if (banci == undefined || banci == null || banci == "") {
        banci = "null";
    }
    if (level == undefined || level == null || level == "") {
        level = "null";
    }
    if (type == undefined || type == null || type == "") {
        type = "null";
    }

    var inputPersonId;

    if (loading == false) {
        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "yhEnter/pcPerson",
            dataType: "jsonp",
            type: "post",
            jsonpCallback: "pcPerson",
            success: function (data) {
                if (data != undefined && data != null && data != "null") {
//                alert(data.personNumber + "," + data.personName);
                    inputPersonId = data.personNumber;

                    if (target == "yh") {
                        $.ajax({
                            url: serverPath + "enterQuery/yhEnter/" + inputPersonId + "/" + banci + "/" + level + "/" + type,
                            dataType: "jsonp",
                            type: "post",
                            jsonpCallback: "yhEnterQuery",
                            success: function (data) {
                                if (data != undefined && data != null && data.length > 0) {
                                    $.mobile.changePage("#yhResult");
                                    $("#yhEnterQuery-result tbody").html("");

                                    for (var i = 0; i < data.length; i++) {
                                        var tableStr = "<tr>";
                                        tableStr += "<td>" + data[i].deptName + "</td>";
                                        tableStr += "<td>" + data[i].yhContent + "</td>";
                                        tableStr += "<td>" + data[i].inTime + "</td>";
                                        tableStr += "</tr>";

                                        $(tableStr).appendTo($("#yhEnterQuery-result tbody"));
                                    }

                                    $("#yhEnterQuery-result").table("refresh");
                                } else {
                                    $().toastmessage('showToast', {
                                        text: '没有数据！',
                                        sticky: false,
                                        position: 'middle-center',
                                        type: 'notice'
                                    });
                                }

                                loading = false;
                                $.mobile.loading("hide");
                            },
                            error: function () {
                                loading = false;
                                $.mobile.loading("hide");
                                $().toastmessage('showToast', {
                                    text: '访问服务器错误！',
                                    sticky: false,
                                    position: 'middle-center',
                                    type: 'error'
                                });
                            }
                        });
                    }

                    if (target == "sw") {
                        $.ajax({
                            url: serverPath + "enterQuery/swEnter/" + inputPersonId + "/" + banci + "/" + level + "/" + type,
                            dataType: "jsonp",
                            type: "post",
                            jsonpCallback: "swEnterQuery",
                            success: function (data) {
                                if (data != undefined && data != null && data.length > 0) {
                                    $.mobile.changePage("#swResult");
                                    $("#swEnterQuery-result tbody").html("");

                                    for (var i = 0; i < data.length; i++) {
                                        var tableStr = "<tr>";
                                        tableStr += "<td>" + data[i].swPerson + "</td>";
                                        tableStr += "<td>" + data[i].swContent + "</td>";
                                        tableStr += "<td>" + data[i].inTime + "</td>";
                                        tableStr += "</tr>";

                                        $(tableStr).appendTo($("#swEnterQuery-result tbody"));
                                    }

                                    $("#swEnterQuery-result").table("refresh");
                                } else {
                                    $().toastmessage('showToast', {
                                        text: '没有数据！',
                                        sticky: false,
                                        position: 'middle-center',
                                        type: 'notice'
                                    });
                                }

                                loading = false;
                                $.mobile.loading("hide");
                            },
                            error: function () {
                                loading = false;
                                $.mobile.loading("hide");
                                $().toastmessage('showToast', {
                                    text: '访问服务器错误！',
                                    sticky: false,
                                    position: 'middle-center',
                                    type: 'error'
                                });
                            }
                        });
                    }
                } else {
                    loading = false;
                    $.mobile.loading("hide");
                    $().toastmessage('showToast', {
                        text: '请重新登录！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'error'
                    });
                }
            },
            error: function () {
                loading = false;
                $.mobile.loading("hide");
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