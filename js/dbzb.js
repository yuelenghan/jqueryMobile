/**
 * Created by lihe on 14/10/8.
 */
var pageSize = 15, pageNo = 1;
var loading = false;

var leader = false;
var mainDeptId;

function gotoQuery() {
    $.mobile.changePage("#dbzb2", {transition: "flip"});
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

                getDbzbData();
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

function getDbzbData() {
    if (loading == false) {
        var date = $("#date").val();
        var banci = $("#banci").val();

        if (date == undefined || date == null || date == "") {
            date = "null";
        }
        if (banci == undefined || banci == null || banci == "") {
            banci = "null";
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        if (leader) {
            $.ajax({
                url: serverPath + "summary/zbdbld/date/" + date + "/banci/" + banci,
                dataType: "jsonp",
                type: "post",
                timeout: 10000,
                jsonpCallback: "zbdbldSummary",
                success: function (data) {
                    if (data != undefined && data != null && data.length > 0) {
                        $.mobile.changePage("#dbzb1");
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
        } else {
            // 提交到服务端
            $.ajax({
                url: serverPath + "summary/zbdbld/date/" + date + "/dept/" + mainDeptId + "/banci/" + banci,
                dataType: "jsonp",
                type: "post",
                timeout: 10000,
                jsonpCallback: "zbdbldSummary",
                success: function (data) {
                    if (data != undefined && data != null && (data.zb.length > 0 || data.db.length > 0)) {
                        $.mobile.changePage("#dbzb3");
                        $("#dbzb2-result tbody").html("");

                        var zbList = data.zb;
                        var dbList = data.db;

                        if (zbList.length < dbList.length) {
                            for (var i = 0; i < zbList.length; i++) {
                                var tableStr = "<tr>";
                                tableStr += "<td>" + zbList[i] + "</td>";
                                tableStr += "<td>" + dbList[i] + "</td>";
                                tableStr += "</tr>";

                                $(tableStr).appendTo($("#dbzb2-result tbody"));
                            }

                            for (var i = zbList.length; i < dbList.length; i++) {
                                var tableStr = "<tr>";
                                tableStr += "<td></td>";
                                tableStr += "<td>" + dbList[i] + "</td>";
                                tableStr += "</tr>";

                                $(tableStr).appendTo($("#dbzb2-result tbody"));
                            }
                        }

                        if (zbList.length > dbList.length) {
                            for (var i = 0; i < dbList.length; i++) {
                                var tableStr = "<tr>";
                                tableStr += "<td>" + zbList[i] + "</td>";
                                tableStr += "<td>" + dbList[i] + "</td>";
                                tableStr += "</tr>";

                                $(tableStr).appendTo($("#dbzb2-result tbody"));
                            }

                            for (var i = dbList.length; i < zbList.length; i++) {
                                var tableStr = "<tr>";
                                tableStr += "<td>" + zbList[i] + "</td>";
                                tableStr += "<td></td>";
                                tableStr += "</tr>";

                                $(tableStr).appendTo($("#dbzb2-result tbody"));
                            }
                        }

                        if (zbList.length == dbList.length) {
                            for (var i = 0; i < dbList.length; i++) {
                                var tableStr = "<tr>";
                                tableStr += "<td>" + zbList[i] + "</td>";
                                tableStr += "<td>" + dbList[i] + "</td>";
                                tableStr += "</tr>";

                                $(tableStr).appendTo($("#dbzb2-result tbody"));
                            }
                        }


                        // 刷新table, 否则隐藏coloumn功能不可用
                        $("#dbzb2-result").table("refresh");

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
}