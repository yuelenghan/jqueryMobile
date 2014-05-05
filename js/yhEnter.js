/**
 * 隐患录入js
 * Created by Administrator on 2014/4/2.
 */

var serverPath = "http://10.1.168.50:8080/DataService/";
var mainDeptId, loading = false;

/**
 * 初始化隐患级别
 */
function initYhLevel() {
    $.ajax({
        url: serverPath + "baseInfo/41",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "yhLevel",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#yhLevelSelect");
                select.html("");
                var selectStr = "";
                for (var i = 0; i < data.length; i++) {
                    selectStr += "<option value='" + data[i].infoid + "'>" + data[i].infoname + "</option>";
                }
                $(selectStr).appendTo(select);
                select.selectmenu('refresh', true);

                var filterSelect = $("#yhyjLevel");
                filterSelect.html("");
                var filterSelectStr = "<option value='null'>--全部--</option>";
                for (var i = 0; i < data.length; i++) {
                    filterSelectStr += "<option value='" + data[i].infoid + "'>" + data[i].infoname + "</option>";
                }
                $(filterSelectStr).appendTo(filterSelect);
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

/**
 * 初始化隐患类型
 */
function initYhType() {
    $.ajax({
        url: serverPath + "baseInfo/1",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "yhType",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#yhTypeSelect");
                select.html("");
                var selectStr = "";
                for (var i = 0; i < data.length; i++) {
                    selectStr += "<option value='" + data[i].infoid + "'>" + data[i].infoname + "</option>";
                }
                $(selectStr).appendTo(select);
                select.selectmenu('refresh', true);

                var filterSelect = $("#yhyjType");
                filterSelect.html("");
                var filterSelectStr = "<option value='null'>--全部--</option>";
                for (var i = 0; i < data.length; i++) {
                    filterSelectStr += "<option value='" + data[i].infoid + "'>" + data[i].infoname + "</option>";
                }
                $(filterSelectStr).appendTo(filterSelect);
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

/**
 * 初始化排查人员（登录人员）
 */
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

                // 登录人员为领导，初始化部门列表
                if (data.roleLevel == 1) {
                    $.ajax({
                        url: serverPath + "yhEnter/department",
                        dataType: "jsonp",
                        type: "post",
                        timeout: 10000,
                        jsonpCallback: "department",
                        success: function (data) {
                            if (data != undefined && data != null && data.length > 0) {
                                var select = $("#deptSelect");
                                select.html("");
                                var selectStr = "";
                                for (var i = 0; i < data.length; i++) {
                                    selectStr += "<option value='" + data[i].deptNumber + "'>" + data[i].deptName + "</option>";
                                }
                                $(selectStr).appendTo(select);
                                select.selectmenu('refresh', true);

                                mainDeptId = select.val();

                                // 显示部门列表
                                $("#deptSelectDiv").show();
                            }
                        },
                        error: function () {
//                            alert("error!");
                            $().toastmessage('showToast', {
                                text: '访问服务器错误！',
                                sticky: false,
                                position: 'middle-center',
                                type: 'error'
                            });
                        }
                    });
                } else {
                    // 初始化隐患依据
                    mainDeptId = data.mainDeptId;
//                    window.localStorage.setItem("mainDeptId", mainDeptId);
//                    getYhBasis(mainDeptId);
                    // 隐藏部门列表
                    $("#deptSelectDiv").hide();
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

/**
 * 初始化隐患专业
 */
function initYhzy() {
    $.ajax({
        url: serverPath + "baseInfo/116",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "yhzy",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#yhzySelect");
                select.html("");
                var selectStr = "";
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

/**
 * 根据输入的部门编码查询隐患依据、危险源、责任单位、排查地点
 */
/*function getYhBasis(deptNumber) {
 *//*var deptNumber = $("#deptNumber").val();

 if (deptNumber == undefined || deptNumber == null || deptNumber == "") {
 alert("请输入部门编码！");
 return;
 }*//*

 // 查询隐患依据
 $.ajax({
 url: serverPath + "yhEnter/yhBasis/deptNumber/" + deptNumber,
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "yhBasis",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#yhBasisSelect");
 select.html("");
 var selectStr = "";
 for (var i = 0; i < data.length; i++) {
 selectStr += "<option value='" + data[i].yhId + "'>" + data[i].yhContent + "</option>";
 }
 $(selectStr).appendTo(select);
 select.selectmenu('refresh', true);

 // 根据选中的隐患依据，初始化隐患级别
 $.ajax({
 url: serverPath + "yhEnter/yhBasisLevel/" + select.val(),
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "yhBasisLevel",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#yhLevelSelect");
 select.val(data);
 select.selectmenu('refresh', true);
 }
 },
 error: function () {
 alert("error!");
 }
 });

 // 根据选中的隐患依据，初始化隐患类型
 $.ajax({
 url: serverPath + "yhEnter/yhBasisType/" + select.val(),
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "yhBasisType",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#yhTypeSelect");
 select.val(data);
 select.selectmenu('refresh', true);
 }
 },
 error: function () {
 alert("error!");
 }
 });

 // 根据选中的隐患依据，初始化危险源
 $.ajax({
 url: serverPath + "yhEnter/basisHazard/" + select.val(),
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "basisHazard",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#hazardSelect");
 select.val(data);
 select.selectmenu('refresh', true);
 }
 },
 error: function () {
 alert("error!");
 }
 });

 var selectText = select.find("option:selected").text();
 $("#yhContent").val(selectText);
 } else {
 alert("没有隐患依据数据！");
 }
 },
 error: function () {
 alert("error!");
 }
 });

 // 查询危险源
 $.ajax({
 url: serverPath + "yhEnter/hazard/deptNumber/" + deptNumber,
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "hazard",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#hazardSelect");
 select.html("");
 var selectStr = "";
 for (var i = 0; i < data.length; i++) {
 selectStr += "<option value='" + data[i].hNumber + "'>" + data[i].hContent + "</option>";
 }
 $(selectStr).appendTo(select);
 select.selectmenu('refresh', true);
 }
 },
 error: function () {
 alert("error!");
 }
 });

 // 查询责任单位
 $.ajax({
 url: serverPath + "yhEnter/zrdw/deptNumber/" + deptNumber,
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "zrdw",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#zrdwSelect");
 select.html("");
 var selectStr = "";
 for (var i = 0; i < data.length; i++) {
 selectStr += "<option value='" + data[i].deptNumber + "'>" + data[i].deptName + "</option>";

 }
 $(selectStr).appendTo(select);
 select.selectmenu('refresh', true);

 // 根据选中的责任单位初始化责任人
 $.ajax({
 url: serverPath + "yhEnter/zrr/deptId/" + select.val(),
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "zrr",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#zrrSelect");
 select.html("");
 var selectStr = "";
 for (var i = 0; i < data.length; i++) {
 selectStr += "<option value='" + data[i].personNumber + "'>" + data[i].name + "</option>";

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
 },
 error: function () {
 alert("error!");
 }
 });

 // 查询排查地点
 $.ajax({
 url: serverPath + "yhEnter/place/deptNumber/" + deptNumber,
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "place",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#placeSelect");
 select.html("");
 var selectStr = "";
 for (var i = 0; i < data.length; i++) {
 selectStr += "<option value='" + data[i].placeid + "'>" + data[i].placename + "</option>";

 }
 $(selectStr).appendTo(select);
 select.selectmenu('refresh', true);
 }
 },
 error: function () {
 alert("error!");
 }
 });
 }*/

/**
 * 根据选择的隐患依据初始化隐患级别、隐患类型、危险源
 * @param selectVal 选中的隐患依据
 */
/*function selectBasis(selectVal) {
 //    alert(selectVal.options[selectVal.selectedIndex].text);
 var selectText = selectVal.options[selectVal.selectedIndex].text;

 // 初始化隐患级别
 $.ajax({
 url: serverPath + "yhEnter/yhBasisLevel/" + selectVal.value,
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "yhBasisLevel",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#yhLevelSelect");
 select.val(data);
 select.selectmenu('refresh', true);
 }
 },
 error: function () {
 alert("error!");
 }
 });

 // 初始化隐患类型
 $.ajax({
 url: serverPath + "yhEnter/yhBasisType/" + selectVal.value,
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "yhBasisType",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#yhTypeSelect");
 select.val(data);
 select.selectmenu('refresh', true);
 }
 },
 error: function () {
 alert("error!");
 }
 });

 // 初始化危险源
 $.ajax({
 url: serverPath + "yhEnter/basisHazard/" + selectVal.value,
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "basisHazard",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#hazardSelect");
 select.val(data);
 select.selectmenu('refresh', true);
 }
 },
 error: function () {
 alert("error!");
 }
 });

 $("#yhContent").val(selectText);
 }*/

/**
 * 根据选择的责任单位初始化责任人
 * @param selectVal 选中的责任单位
 */
function selectZrdw(selectVal) {
//    alert(selectVal.value);

    // 初始化责任人
    $.ajax({
        url: serverPath + "yhEnter/zrr/deptId/" + selectVal.value,
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "zrr",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#zrrSelect");
                select.html("");
                var selectStr = "";
                for (var i = 0; i < data.length; i++) {
                    selectStr += "<option value='" + data[i].personNumber + "'>" + data[i].name + "</option>";

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

/**
 * 当选择的排查类型为矿专项检查或公司专项检查时，显示隐患专业div
 * @param selectVal 选中的排查类型
 */
function selectPcType(selectVal) {
    if (selectVal.value == 4 || selectVal.value == 7) {
        // 显示隐患专业div
        $("#yhzyDiv").show();
    } else {
        // 隐藏隐患专业div
        $("#yhzyDiv").hide();
    }
}

/**
 * 当选择的整改方式为新增时，显示限期整改div
 * @param selectVal 选中的整改方式
 */
function selectZgfs(selectVal) {
    if (selectVal.value == "新增") {
        // 显示限期整改div
        $("#xqzgDiv").show();
    } else {
        // 隐藏限期整改div
        $("#xqzgDiv").hide();
    }
}

/**
 * 提交隐患信息，插入数据库
 */
function submitInfo() {
    if (confirm("确认提交？")) {
        if (loading == false) {
            var yhyj = $("#yhBasisValue").val();   // 隐患依据
            var yhjb = $("#yhLevelSelect").val();   // 隐患级别
            var yhlx = $("#yhTypeSelect").val();    // 隐患类型
            var wxy = $("#hazardValue").val();     // 危险源
            var yhms = $("#yhContent").val();       // 隐患描述
            var zrdw = $("#zrdwSelect").val();      // 责任单位
            var zrr = $("#zrrSelect").val();        // 责任人
            var pcdd = $("#placeSelect").val();     // 排查地点
            var mxdd = $("#placeDetail").val();     // 明细地点
            var pcsj = $("#pcTime").val();          // 排查时间
            var pcbc = $("#pcbc").val();            // 排查班次
            var pcry = $("#pcPersonNumber").val();  // 排查人员
            var pclx = $("#pcType").val();          // 排查类型
            var yhzy = $("#yhzySelect").val();      // 隐患专业
            var zgfs = $("#zgfs").val();            // 整改方式
            var zgqx = $("#zgqx").val();            // 整改期限
            var zgbc = $("#zgbcSelect").val();      // 整改班次

            if (yhyj == undefined || yhyj == null || yhyj == "") {
                alert("请填写隐患依据！");
                return;
            }

            if (wxy == undefined || wxy == null || wxy == "") {
                alert("请填写危险源！");
                return;
            }

            if (yhms == undefined || yhms == null || yhms == "") {
                alert("请填写隐患描述！");
                return;
            }
            if (pcdd == undefined || pcdd == null || pcdd == "") {
                alert("请填写排查地点！");
                return;
            }
            if (pcsj == undefined || pcsj == null || pcsj == "") {
                alert("请填写排查时间！");
                return;
            }
            if (pcry == undefined || pcry == null || pcry == "") {
                alert("排查人员无法获取，请登录！");
                return;
            }

            if (mxdd == undefined || mxdd == null || mxdd == "") {
                mxdd = "null";
            }
            if (zgqx == undefined || zgqx == null || zgqx == "") {
                zgqx = "null";
            }


            /*   alert("yhyj = " + yhyj + ", yhjb = " + yhjb + ", yhlx = " + yhlx + ", wxy = " + wxy + ", yhms = " + yhms + ", zrdw = " + zrdw + ", zrr = " + zrr
             + ", pcdd = " + pcdd + ", mxdd = " + mxdd + ", pcsj = " + pcsj + ", pcbc = " + pcbc + ", pcry = " + pcry + ", pclx = " + pclx
             + ", yhzy = " + yhzy + ", zgfs = " + zgfs + ", zgqx = " + zgqx + ", zgbc = " + zgbc);*/

            $.mobile.loading("show", {text: "正在录入...", textVisible: true});
            loading = true;

            $.ajax({
                url: serverPath + "yhEnter/insertInfo/" + yhyj + "/" + yhjb + "/" + yhlx + "/" + wxy + "/" + yhms + "/" + zrdw + "/" + zrr + "/" + pcdd + "/" + mxdd + "/" + pcsj + "/" + pcbc + "/" + pcry + "/" + pclx + "/" + zgfs + "/" + zgqx + "/" + zgbc + "/" + yhzy + "/" + mainDeptId,
                dataType: "jsonp",
                type: "post",
                timeout: 10000,
                jsonpCallback: "insertInfo",
                success: function (data) {
                    if (data == "success") {
//                        alert("录入成功！")
                        $().toastmessage('showToast', {
                            text: '录入成功！',
                            sticky: false,
                            position: 'middle-center',
                            type: 'success'
                        });
                    } else {
//                        alert("录入失败！");
                        $().toastmessage('showToast', {
                            text: '录入失败！',
                            sticky: false,
                            position: 'middle-center',
                            type: 'error'
                        });
                    }

                    $.mobile.loading("hide");
                    loading = false;
                },
                error: function () {
                    $.mobile.loading("hide");
                    loading = false;
//                    alert("error!");
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

/**
 * 过滤隐患依据
 */
function filterYhyj() {
    if (loading == false) {
        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        var yhyjLevel = $("#yhyjLevel").val();
        var yhyjType = $("#yhyjType").val();
        var yhyjText = $("#yhyjText").val();
//    alert(yhyjLevel + "," + yhyjType + "," + yhyjText);

        if (yhyjLevel == undefined || yhyjLevel == null || yhyjLevel == "") {
            yhyjLevel = "null";
        }

        if (yhyjType == undefined || yhyjType == null || yhyjType == "") {
            yhyjType = "null";
        }

        if (yhyjText == undefined || yhyjText == null || yhyjText == "") {
            yhyjText = "null";
        }

        // 从后台取得过滤之后的隐患依据列表
        $.ajax({
            url: serverPath + "yhEnter/yhBasis/deptNumber/" + mainDeptId + "/" + yhyjLevel + "/" + yhyjType + "/" + yhyjText,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "yhBasis",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    var select = $("#yhyjList");
                    select.html("");
                    var selectStr = "";
                    for (var i = 0; i < data.length; i++) {
                        selectStr += "<option value='" + data[i].yhId + "'>" + data[i].yhContent + "</option>";
                    }
                    $(selectStr).appendTo(select);
                    select.selectmenu('refresh', true);

                } else {
//                    alert("没有隐患依据数据！");
                    $().toastmessage('showToast', {
                        text: '没有隐患依据数据！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'warning'
                    });
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

/**
 * 过滤危险源
 */
/*function filterHazard() {
 // 过滤条件
 var arg = $("#hazardFilter").val();
 if (arg == undefined || arg == null || arg == "") {
 return;
 }

 $.ajax({
 url: serverPath + "yhEnter/hazard/deptNumber/" + mainDeptId + "/" + arg,
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "hazard",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#hazardSelect");
 select.html("");
 var selectStr = "";
 for (var i = 0; i < data.length; i++) {
 selectStr += "<option value='" + data[i].hNumber + "'>" + data[i].hContent + "</option>";
 }
 $(selectStr).appendTo(select);
 select.selectmenu('refresh', true);
 }
 },
 error: function () {
 $.mobile.loading("hide");
 loading = false;
 alert("error!");

 }
 });
 }*/

/**
 * 过滤地点
 */
function filterPlace() {
    if (loading == false) {
        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        // 过滤条件
        var arg = $("#placeFilter").val();
        if (arg == undefined || arg == null || arg == "") {
            arg = "null";
        }

        $.ajax({
            url: serverPath + "yhEnter/place/deptNumber/" + mainDeptId + "/" + arg,
            dataType: "jsonp",
            type: "post",
            jsonpCallback: "place",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    var select = $("#placeSelect");
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

function returnYhyj() {
    var yhyj = $("#yhyjList").val();
    var yhyjText = $("#yhyjList").find("option:selected").text();
//    alert(yhyj);

//    $('#yhyj-filter-dialog').dialog('close');
    $.mobile.changePage("#yhEnter1", {transition: "flip"});

    if (yhyj != undefined && yhyj != null && yhyj != "") {
        /*   var select = $("#yhBasisSelect");
         select.val(yhyj);
         select.selectmenu('refresh', true);*/

        $("#yhBasisValue").val(yhyj);
        $("#yhBasisText").val(yhyjText);

        // 初始化隐患级别
        $.ajax({
            url: serverPath + "yhEnter/yhBasisLevel/" + yhyj,
            dataType: "jsonp",
            type: "post",
            jsonpCallback: "yhBasisLevel",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
//                    alert(data);
                    var select = $("#yhLevelSelect");
                    select.val(data);
                    select.selectmenu('refresh', true);
                }
            },
            error: function () {
//                alert("error!");
                $().toastmessage('showToast', {
                    text: '访问服务器错误！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'error'
                });
            }
        });

        // 初始化隐患类型
        $.ajax({
            url: serverPath + "yhEnter/yhBasisType/" + yhyj,
            dataType: "jsonp",
            type: "post",
            jsonpCallback: "yhBasisType",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    var select = $("#yhTypeSelect");
                    select.val(data);
                    select.selectmenu('refresh', true);
                }
            },
            error: function () {
//                alert("error!");
                $().toastmessage('showToast', {
                    text: '访问服务器错误！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'error'
                });
            }
        });

        // 初始化危险源
        $.ajax({
            url: serverPath + "yhEnter/basisHazard/" + yhyj,
            dataType: "jsonp",
            type: "post",
            jsonpCallback: "basisHazard",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    var select = $("#hazardSelect");
                    select.val(data);
                    select.selectmenu('refresh', true);
                }
            },
            error: function () {
//                alert("error!");
                $().toastmessage('showToast', {
                    text: '访问服务器错误！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'error'
                });
            }
        });

        $("#yhContent").val(yhyjText);
    }

}

function filterWxy() {
    if (loading == false) {
        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        var wxyLevel = $("#wxyLevel").val();
        var wxyText = $("#wxyText").val();

        if (wxyLevel == undefined || wxyLevel == null || wxyLevel == "") {
            wxyLevel = "null";
        }
        if (wxyText == undefined || wxyText == null || wxyText == "") {
            wxyText = "null";
        }

        $.ajax({
            url: serverPath + "yhEnter/hazard/deptNumber/" + mainDeptId + "/" + wxyLevel + "/" + wxyText,
            dataType: "jsonp",
            type: "post",
            jsonpCallback: "hazard",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    var select = $("#wxyList");
                    select.html("");
                    var selectStr = "";
                    for (var i = 0; i < data.length; i++) {
                        selectStr += "<option value='" + data[i].hNumber + "'>" + data[i].hContent + "</option>";
                    }
                    $(selectStr).appendTo(select);
                    select.selectmenu('refresh', true);

                } else {
//                    alert("没有危险源数据！");
                    $().toastmessage('showToast', {
                        text: '没有危险源数据！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'warning'
                    });
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

function returnWxy() {
    var wxy = $("#wxyList").val();
    var wxyText = $("#wxyList").find("option:selected").text();
//    alert(wxy);

//    $('#wxy-filter-dialog').dialog('close');

    $.mobile.changePage("#yhEnter1", {transition: "flip"});

    /*    var select = $("#hazardSelect");
     select.val(wxy);
     select.selectmenu('refresh', true);*/

    $("#hazardValue").val(wxy);
    $("#hazardText").val(wxyText);

}

function zrdwFilter() {
    if (loading == false) {
        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        var arg = $("#zrdwFilter").val();

        if (arg == undefined || arg == null || arg == "") {
            arg = "null";
        }

        $.ajax({
            url: serverPath + "yhEnter/zrdw/deptNumber/" + mainDeptId + "/" + arg,
            dataType: "jsonp",
            type: "post",
            jsonpCallback: "zrdw",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    var select = $("#zrdwSelect");
                    select.html("");
                    var selectStr = "";
                    for (var i = 0; i < data.length; i++) {
                        selectStr += "<option value='" + data[i].deptNumber + "'>" + data[i].deptName + "</option>";
                    }
                    $(selectStr).appendTo(select);
                    select.selectmenu('refresh', true);

                    // 初始化责任人
                    $.ajax({
                        url: serverPath + "yhEnter/zrr/deptId/" + select.val(),
                        dataType: "jsonp",
                        type: "post",
                        jsonpCallback: "zrr",
                        success: function (data) {
                            if (data != undefined && data != null && data.length > 0) {
                                var select = $("#zrrSelect");
                                select.html("");
                                var selectStr = "";
                                for (var i = 0; i < data.length; i++) {
                                    selectStr += "<option value='" + data[i].personNumber + "'>" + data[i].name + "</option>";

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
//                            alert("error!");
                            $().toastmessage('showToast', {
                                text: '访问服务器错误！',
                                sticky: false,
                                position: 'middle-center',
                                type: 'error'
                            });
                        }

                    });
                } else {
                    $.mobile.loading("hide");
                    loading = false;
//                    alert("没有责任单位数据！");
                    $().toastmessage('showToast', {
                        text: '没有责任单位数据！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'warning'
                    });
                }
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

function zrrFilter() {
    if (loading == false) {
        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        var deptId = $("#zrdwSelect").val();
        var arg = $("#zrrFilter").val();

        if (arg == undefined || arg == null || arg == "") {
            arg = "null";
        }

        $.ajax({
            url: serverPath + "yhEnter/zrr/deptId/" + deptId + "/" + arg,
            dataType: "jsonp",
            type: "post",
            jsonpCallback: "zrr",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    var select = $("#zrrSelect");
                    select.html("");
                    var selectStr = "";
                    for (var i = 0; i < data.length; i++) {
                        selectStr += "<option value='" + data[i].personnumber + "'>" + data[i].name + "</option>";
                    }
                    $(selectStr).appendTo(select);
                    select.selectmenu('refresh', true);
                } else {
//                    alert("没有责任人数据！");
                    $().toastmessage('showToast', {
                        text: '没有责任人数据！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'warning'
                    });
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

function selectDept(deptId) {
//    alert(deptId);
    mainDeptId = deptId;
}