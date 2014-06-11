/**
 * Created by lihe on 14-6-5.
 */
var serverPath = "http://10.1.168.50:8080/DataService/";
var personData;
var mainDeptId, loading = false;

function getIrisData() {
    // 获得登陆人员信息
    $.ajax({
        url: serverPath + "yhEnter/pcPerson",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "pcPerson",
        success: function (data) {
            if (data != undefined && data != null && data != "null") {
//                alert(data.personNumber + "," + data.personName);
                personData = data;

                // 根据登陆人员信息获取虹膜数据
                var irisSelect = $("#irisDataSelect");
                irisSelect.html("");
                $.ajax({
                    url: serverPath + "iris/" + personData.personNumber,
                    dataType: "jsonp",
                    type: "post",
                    timeout: 10000,
                    jsonpCallback: "irisData",
                    success: function (data) {
                        if (data != undefined && data != null && data != "null" && data.length > 0) {
                            // 有虹膜数据, 自动变成选择录入界面
                            $("#xz").attr("checked", true).checkboxradio("refresh");
//                            $("sd").removeAttr("checked");
                            selectXz();

                            var selectStr = "";
                            for (var i = 0; i < data.length; i++) {
                                selectStr += "<option value='" + data[i].key + "'>" + data[i].departName + ", " + data[i].inWellTime + "</option>";
                            }
                            $(selectStr).appendTo(irisSelect);
                            irisSelect.selectmenu('refresh', true);
                        } else {
                            // 没有虹膜数据, 自动变成手动录入
                            $("#sd").attr("checked", "checked").checkboxradio("refresh");
                            selectSd();
                        }
                    },
                    error: function () {
                        $().toastmessage('showToast', {
                            text: '获取虹膜数据错误！',
                            sticky: false,
                            position: 'middle-center',
                            type: 'error'
                        });
                    }
                });

                // 手动录入界面, 初始化部门信息
                // 登录人员为领导，初始化部门列表
                if (personData.roleLevel == 1) {
                    var deptSelect = $("#kqDept");
                    deptSelect.html("");

                    $.ajax({
                        url: serverPath + "yhEnter/department",
                        dataType: "jsonp",
                        type: "post",
                        timeout: 10000,
                        jsonpCallback: "department",
                        success: function (data) {
                            if (data != undefined && data != null && data.length > 0) {
                                var selectStr = "";
                                for (var i = 0; i < data.length; i++) {
                                    selectStr += "<option value='" + data[i].deptNumber + "'>" + data[i].deptName + "</option>";
                                }
                                $(selectStr).appendTo(deptSelect);
                                deptSelect.selectmenu('refresh', true);

                                mainDeptId = deptSelect.val();

                                // 显示部门列表
                                $("#deptSelectDiv").show();
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
                } else {
                    mainDeptId = personData.mainDeptId;
                    // 隐藏部门列表
                    $("#deptSelectDiv").hide();
                }
            } else {
                $().toastmessage('showToast', {
                    text: '获取不到登陆人员信息, 请重新登陆! ',
                    sticky: false,
                    position: 'middle-center',
                    type: 'warning'
                });
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

function selectXz() {
    $("#xzDiv").show();
    $("#sdDiv").hide();
}

function selectSd() {
//    alert("sd");
//    alert(personData.roleLevel);

    $("#xzDiv").hide();
    $("#sdDiv").show();


}

function selectKqDept(selectVal) {
//    alert(selectVal.value);
    mainDeptId = selectVal.value;
//    alert(mainDeptId);
}

function confirmInfo() {
    if (confirm("确认信息? ")) {
        if (loading == false) {
            // 储存部门信息和登陆的人员信息, 在录入隐患时使用
            var localStorage = window.localStorage;
            localStorage.setItem("mainDeptId", mainDeptId);
            localStorage.setItem("personNumber", personData.personNumber);
            localStorage.setItem("personName", personData.personName);

            var lrfs = $('input[name="lrfs"]:checked').val();

            if (lrfs == 1) {
                // 选择虹膜数据
                // 把虹膜信息插入数据库
                var key = $("#irisDataSelect").val();
                var kqType = $("#kqType").val();
//        alert(key);

                if (key == undefined || key == null || key == "") {
                    alert("请选择虹膜数据! ");
                    return;
                }

                $.mobile.loading("show", {text: "正在录入...", textVisible: true});
                loading = true;

                $.ajax({
                    url: serverPath + "kqRecord/" + key + "/" + mainDeptId + "/" + kqType,
                    dataType: "jsonp",
                    type: "post",
                    timeout: 10000,
                    jsonpCallback: "insertKqRecord",
                    success: function (data) {
                        if (data != null) {
                            $().toastmessage('showToast', {
                                text: '插入虹膜数据成功！',
                                sticky: false,
                                position: 'middle-center',
                                type: 'success'
                            });

                            window.localStorage.setItem("rjid", data.rjid);
                            window.localStorage.setItem("banci", data.kqbenci);
                            window.localStorage.setItem("pcsj", data.kqtime);
                        } else {
                            $().toastmessage('showToast', {
                                text: '插入虹膜数据没有返回正确的结果！',
                                sticky: false,
                                position: 'middle-center',
                                type: 'warning'
                            });
                        }

                        $.mobile.loading("hide");
                        loading = false;

                        window.location.href = "yhEnter2.html";
                    },
                    error: function () {
                        $.mobile.loading("hide");
                        loading = false;

                        $().toastmessage('showToast', {
                            text: '插入虹膜数据错误！',
                            sticky: false,
                            position: 'middle-center',
                            type: 'error'
                        });
                    }
                });
            } else if (lrfs == 2) {
                // 手动录入
                var kqDept = $("#kqDept").val();
                var inWellTime = $("#inWellTime").val();
                var outWellTime = $("#outWellTime").val();
                var attendDate = $("#attendDate").val();
                var banci = $("#banci").val();
                var kqType = $("#kqType").val();

                /*alert("kqDept = " + kqDept + ", inWellTime = " + inWellTime +
                 ", outWellTime = " + outWellTime + ", attendDate = " +
                 attendDate + ", banci = " + banci + ", kqType = " + kqType);*/

                if (inWellTime == undefined || inWellTime == null || inWellTime == "") {
                    alert("请输入入井时间! ");
                    return;
                }

                if (outWellTime == undefined || outWellTime == null || outWellTime == "") {
                    alert("请输入出井时间! ");
                    return;
                }

                if (attendDate == undefined || attendDate == null || attendDate == "") {
                    alert("请输入考勤日期! ");
                    return;
                }

                $.mobile.loading("show", {text: "正在录入...", textVisible: true});
                loading = true;

                // 把手动录入的数据插入数据库
                $.ajax({
                    url: serverPath + "kqRecord/" + personData.personNumber + "/" + inWellTime + "/" + outWellTime + "/" + attendDate + "/" + banci + "/" + kqType + "/" + kqDept,
                    dataType: "jsonp",
                    type: "post",
                    timeout: 10000,
                    jsonpCallback: "insertKqRecord",
                    success: function (data) {
//                alert(data);
                        if (data != null) {
                            $().toastmessage('showToast', {
                                text: '插入虹膜数据成功！',
                                sticky: false,
                                position: 'middle-center',
                                type: 'success'
                            });

                            window.localStorage.setItem("rjid", data.rjid);
                            window.localStorage.setItem("banci", banci);
                            window.localStorage.setItem("pcsj", data.kqtime);
                        } else {
                            $().toastmessage('showToast', {
                                text: '插入虹膜数据没有返回正确的结果！',
                                sticky: false,
                                position: 'middle-center',
                                type: 'warning'
                            });
                        }

                        $.mobile.loading("hide");
                        loading = false;

                        window.location.href = "yhEnter2.html";
                    },
                    error: function () {
                        $.mobile.loading("hide");
                        loading = false;

                        $().toastmessage('showToast', {
                            text: '插入虹膜数据错误！',
                            sticky: false,
                            position: 'middle-center',
                            type: 'error'
                        });
                    }
                });
            }

        }


    }
}