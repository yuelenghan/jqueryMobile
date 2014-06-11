/**
 * 三违录入js
 * Created by Administrator on 2014/4/10.
 */

var serverPath = "http://192.168.1.123:8080/DataService/";
var mainDeptId;
var loading = false;

/**
 * 初始化三违性质
 */
function initSwLevel() {
    $.ajax({
        url: serverPath + "baseInfo/46",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "swLevel",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#swLevelSelect");
                select.html("");
                var selectStr = "";
                for (var i = 0; i < data.length; i++) {
                    selectStr += "<option value='" + data[i].infoid + "'>" + data[i].infoname + "</option>";
                }
                $(selectStr).appendTo(select);
                select.selectmenu('refresh', true);

                var filterSelect = $("#swyjLevel");
                filterSelect.html("");
                var filterSelectStr = "<option value='null'>--全部--</option>";
                for (var i = 0; i < data.length; i++) {
                    filterSelectStr += "<option value='" + data[i].infoid + "'>" + data[i].infoname + "</option>";
                }
                $(filterSelectStr).appendTo(filterSelect);
            }
        },
        error: function () {
            alert("error!");
        }
    });
}

/**
 * 初始化三违类型
 */
function initSwType() {
    $.ajax({
        url: serverPath + "baseInfo/102",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "swType",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#swTypeSelect");
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
            alert("error!");
        }
    });
}

/**
 * 初始化三违专业
 */
function initSwPro() {
    $.ajax({
        url: serverPath + "baseInfo/106",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "swPro",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#swProSelect");
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
            alert("error!");
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
                            alert("error!");
                        }
                    });
                } else {
                    mainDeptId = data.mainDeptId;
                    // 隐藏部门列表
                    $("#deptSelectDiv").hide();

//                    initDeptList();
                }
            }
        },
        error: function () {
            alert("error!");
        }
    });
}

function initDeptList() {
    $.ajax({
        url: serverPath + "swEnter/department/" + mainDeptId,
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "deptList",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#deptList");
                select.html("");
                var selectStr = "";
                for (var i = 0; i < data.length; i++) {
                    selectStr += "<option value='" + data[i].deptNumber + "'>" + data[i].deptName + "</option>";
                }
                $(selectStr).appendTo(select);
                select.selectmenu('refresh', true);
            } else {
                $.mobile.loading("hide");
                loading = false;
//                alert("没有部门数据！");
                $().toastmessage('showToast', {
                    text: '没有部门数据！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'warning'
                });
            }
        },
        error: function () {
            $.mobile.loading("hide");
            loading = false;
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
 * 根据输入的部门编码查询三违依据、危险源、排查地点
 */
/*function getSwBasis() {
 var deptNumber = $("#deptNumber").val();

 if (deptNumber == undefined || deptNumber == null || deptNumber == "") {
 alert("请输入部门编码！");
 return;
 }

 mainDeptId = deptNumber;

 // 查询三违依据
 $.ajax({
 url: serverPath + "swEnter/swBasis/deptNumber/" + deptNumber,
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "swBasis",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#swBasisSelect");
 select.html("");
 var selectStr = "";
 for (var i = 0; i < data.length; i++) {
 selectStr += "<option value='" + data[i].swId + "'>" + data[i].swContent + "</option>";
 }
 $(selectStr).appendTo(select);
 select.selectmenu('refresh', true);

 // 根据选中的三违依据初始化三违性质
 $.ajax({
 url: serverPath + "swEnter/swBasisLevel/" + select.val(),
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "swBasisLevel",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#swLevelSelect");
 select.val(data);
 select.selectmenu('refresh', true);
 }
 },
 error: function () {
 alert("error!");
 }
 });

 // 根据选中的三违依据初始化三违类型
 $.ajax({
 url: serverPath + "swEnter/swBasisType/" + select.val(),
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "swBasisType",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#swTypeSelect");
 select.val(data);
 select.selectmenu('refresh', true);
 }
 },
 error: function () {
 alert("error!");
 }
 });

 // 根据选中的三违依据初始化危险源
 $.ajax({
 url: serverPath + "swEnter/basisHazard/" + select.val(),
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
 $("#swContent").val(selectText);
 } else {
 alert("没有数据！");
 }
 },
 error: function () {
 alert("error!");
 }
 });

 // 查询危险源
 $.ajax({
 url: serverPath + "swEnter/hazard/deptNumber/" + deptNumber,
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

 // 查询排查地点
 $.ajax({
 url: serverPath + "swEnter/place/deptNumber/" + deptNumber,
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
 * 根据选中的三违依据初始化三违性质、三违类型、危险源
 * @param selectVal 选中的三违依据
 */
/*function selectBasis(selectVal) {
 //    alert(selectVal.options[selectVal.selectedIndex].text);
 var selectText = selectVal.options[selectVal.selectedIndex].text;

 // 初始化三违性质
 $.ajax({
 url: serverPath + "swEnter/swBasisLevel/" + selectVal.value,
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "swBasisLevel",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#swLevelSelect");
 select.val(data);
 select.selectmenu('refresh', true);
 }
 },
 error: function () {
 alert("error!");
 }
 });

 // 初始化三违类型
 $.ajax({
 url: serverPath + "swEnter/swBasisType/" + selectVal.value,
 dataType: "jsonp",
 type: "post",
 jsonpCallback: "swBasisType",
 success: function (data) {
 if (data != undefined && data != null && data.length > 0) {
 var select = $("#swTypeSelect");
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
 url: serverPath + "swEnter/basisHazard/" + selectVal.value,
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

 $("#swContent").val(selectText);
 }*/

/**
 * 根据输入的过滤条件查询三违人员列表
 */
function getSwry() {
    initDeptList();

    $.mobile.changePage("#swry-filter", {transition: "flip"});
}

/**
 * 提交三违信息，插入数据库
 */
function submitInfo() {
    if (confirm("确认提交？")) {
        if (loading == false) {
            var swyj = $("#swBasisValue").val();   // 三违依据
            var swxz = $("#swLevelSelect").val();   // 三违性质
            var swlx = $("#swTypeSelect").val();    // 三违类型
            var swzy = $("#swProSelect").val();     // 三违专业
//            var wxy = $("#hazardValue").val();     // 危险源
            var swms = $("#swContent").val();       // 三违描述
            var swry = $("#swryNumber").val();            // 三违人员
            var pcry = $("#pcPersonNumber").val();  // 排查人员
            var pcdd = $("#placeSelect").val();     // 排查地点
            var mxdd = $("#placeDetail").val();     // 明细地点
            var pcsj = $("#pcTime").val();          // 排查时间
            var pcbc = $("#pcbc").val();            // 排查班次
            var jcfs = $("#jcType").val();          // 检查方式

            var dwjf = $("#dwjf").is(":checked");
            var dwfk = $("#dwfk").is(":checked");
            var grjf = $("#grjf").is(":checked");
            var grfk = $("#grfk").is(":checked");
            var jbxx = $("#jbxx").is(":checked");
            var dismiss = $("#dismiss").is(":checked");
            /*alert("单位积分 : " + dwjf + ", 单位罚款 : " + dwfk + ", 个人积分 : " + grjf +
             ", 个人罚款 : " + grfk + ", 进班学习 : " + jbxx + ", 解除劳动合同 : " + dismiss);*/

            var dwjfValue = $("#dwjfValue").val();
            var dwfkValue = $("#dwfkValue").val();
            var grjfValue = $("#grjfValue").val();
            var grfkValue = $("#grfkValue").val();
            var jbxxValue = $("#jbxxValue").val();

            if (dwjfValue == undefined || dwjfValue == null || dwjfValue == "") {
                dwjfValue = 0;
            }
            if (dwfkValue == undefined || dwfkValue == null || dwfkValue == "") {
                dwfkValue = 0;
            }
            if (grjfValue == undefined || grjfValue == null || grjfValue == "") {
                grjfValue = 0;
            }
            if (grfkValue == undefined || grfkValue == null || grfkValue == "") {
                grfkValue = 0;
            }
            if (jbxxValue == undefined || jbxxValue == null || jbxxValue == "") {
                jbxxValue = 0;
            }

            var intMatch = /0|(^[1-9][0-9]*$)/; // 正则表达式--0或正整数
            if (!intMatch.test(dwjfValue)) {
                alert("请填写正确的单位积分数据! ");
                return;
            }
            if (!intMatch.test(dwfkValue)) {
                alert("请填写正确的单位罚款数据! ");
                return;
            }
            if (!intMatch.test(grjfValue)) {
                alert("请填写正确的个人积分数据! ");
                return;
            }
            if (!intMatch.test(grfkValue)) {
                alert("请填写正确的个人罚款数据! ");
                return;
            }
            if (!intMatch.test(jbxxValue)) {
                alert("请填写正确的进班学习数据! ");
                return;
            }

            /*   alert("单位积分 = " + dwjfValue + ", 单位罚款 = " + dwfkValue +
             ", 个人积分 = " + grjfValue + ", 个人罚款 = " + grfkValue + ", 进班学习 = " + jbxxValue);

             return;*/

            if (swyj == undefined || swyj == null || swyj == "") {
                alert("请填写三违依据！");
                return;
            }
            /*if (wxy == undefined || wxy == null || wxy == "") {
             alert("请填写危险源！");
                return;
             }*/

            if (swms == undefined || swms == null || swms == "") {
                alert("请填写三违描述！");
                return;
            }

            if (swry == undefined || swry == null || swry == "") {
                alert("请选择三违人员！");
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
            if (pcdd == undefined || pcdd == null || pcdd == "") {
                alert("请填写排查地点！");
                return;
            }

            if (mxdd == undefined || mxdd == null || mxdd == "") {
                mxdd = "null";
            }

            /*                alert("swyj = " + swyj + ", swxz = " + swxz + ", swlx = " + swlx + ", swzy = " + swzy + ", wxy = " + wxy + ", swms = " + swms + ", swry = " + swry
             + ", pcry = " + pcry + ", pcdd = " + pcdd + ", mxdd = " + mxdd + ", pcsj = " + pcsj + ", pcbc = " + pcbc + ", jcfs = " + jcfs);*/

            $.mobile.loading("show", {text: "正在录入...", textVisible: true});
            loading = true;


            $.ajax({
                url: serverPath + "swEnter/insertInfo/" + swyj + "/" + swxz + "/" + swlx + "/" + swzy + "/" + swms + "/" + swry + "/" + pcry + "/" + pcdd + "/" + mxdd + "/" + pcsj + "/" + pcbc + "/" + jcfs + "/" + mainDeptId + "/" + dwjf + "/" + dwjfValue + "/" + dwfk + "/" + dwfkValue + "/" + grjf + "/" + grjfValue + "/" + grfk + "/" + grfkValue + "/" + jbxx + "/" + jbxxValue + "/" + dismiss,
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
 * 过滤三违依据
 */
function filterSwyj() {
    if (loading == false) {
        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        // 过滤条件
        var swyjLevel = $("#swyjLevel").val();
        var swyjText = $("#swyjText").val();

        if (swyjLevel == undefined || swyjLevel == null || swyjLevel == "") {
            swyjLevel = "null";
        }
        if (swyjText == undefined || swyjText == null || swyjText == "") {
            swyjText = "null";
        }

        $.ajax({
            url: serverPath + "swEnter/swBasis/deptNumber/" + mainDeptId + "/" + swyjLevel + "/" + swyjText,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "swBasis",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    var select = $("#swyjList");
                    select.html("");
                    var selectStr = "";
                    for (var i = 0; i < data.length; i++) {
                        selectStr += "<option value='" + data[i].swId + "'>" + data[i].swContent + "</option>";
                    }
                    $(selectStr).appendTo(select);
                    select.selectmenu('refresh', true);
                } else {
//                    alert("没有三违依据数据！");
                    $().toastmessage('showToast', {
                        text: '没有三违依据数据！',
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
 url: serverPath + "swEnter/hazard/deptNumber/" + mainDeptId + "/" + arg,
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
            url: serverPath + "swEnter/place/deptNumber/" + mainDeptId + "/" + arg,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
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

function selectDept(deptId) {
//    alert(deptId);
    mainDeptId = deptId;
}

function returnSwyj() {
    var swyj = $("#swyjList").val();
    var swyjText = $("#swyjList").find("option:selected").text();
//    alert(yhyj);

//    $('#yhyj-filter-dialog').dialog('close');
    $.mobile.changePage("#swEnter1", {transition: "flip"});

    if (swyj != undefined && swyj != null && swyj != "") {
        /*   var select = $("#yhBasisSelect");
         select.val(yhyj);
         select.selectmenu('refresh', true);*/

        $("#swBasisValue").val(swyj);
        $("#swBasisText").val(swyjText);

        // 根据选中的三违依据初始化三违性质
        $.ajax({
            url: serverPath + "swEnter/swBasisLevel/" + swyj,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "swBasisLevel",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    var select = $("#swLevelSelect");
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

        // 根据选中的三违依据初始化三违类型
        $.ajax({
            url: serverPath + "swEnter/swBasisType/" + swyj,
            dataType: "jsonp",
            type: "post",
            jsonpCallback: "swBasisType",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    var select = $("#swTypeSelect");
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

        // 根据选中的三违依据初始化危险源
        $.ajax({
            url: serverPath + "swEnter/basisHazard/" + swyj,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
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

        $("#swContent").val(swyjText);
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
            url: serverPath + "swEnter/hazard/deptNumber/" + mainDeptId + "/" + wxyLevel + "/" + wxyText,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
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

    $.mobile.changePage("#swEnter1", {transition: "flip"});

    /*    var select = $("#hazardSelect");
     select.val(wxy);
     select.selectmenu('refresh', true);*/

    $("#hazardValue").val(wxy);
    $("#hazardText").val(wxyText);

}

function filterSwry() {
    if (loading == false) {
        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        var shortName = $("#swryText").val();
        var deptId = $("#deptList").val();

        if (shortName == undefined || shortName == null || shortName == "") {
            shortName = "null";
        }
        if (deptId == undefined || deptId == null || deptId == "") {
            deptId = "null";
        }

        $.ajax({
            url: serverPath + "swEnter/person/" + deptId + "/" + shortName,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "swry",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    var select = $("#swryList");
                    select.html("");
                    var selectStr = "";
                    for (var i = 0; i < data.length; i++) {
                        selectStr += "<option value='" + data[i].personnumber + "'>" + data[i].name + "</option>";
                    }
                    $(selectStr).appendTo(select);
                    select.selectmenu('refresh', true);

                } else {
//                    alert("没有三违人员数据！");
                    $().toastmessage('showToast', {
                        text: '没有三违人员数据！',
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

function returnSwry() {
    var swryNumber = $("#swryList").val();
    var swryName = $("#swryList").find("option:selected").text();

    var deptNumber = $("#deptList").val();
    var deptName = $("#deptList").find("option:selected").text();

//    alert(swryNumber + ", " + swryName);

    $.mobile.changePage("#swEnter1", {transition: "flip"});

    $("#swryNumber").val(deptNumber + "@" + swryNumber);
    $("#swryName").val(deptName + " -- " + swryName);
}

function checkDwjf() {
    if ($("#dwjf").is(':checked')) {
        $("#dwjfDiv").show();
    } else {
        $("#dwjfValue").val(0);
        $("#dwjfDiv").hide();
    }
}

function checkDwfk() {
    if ($("#dwfk").is(':checked')) {
        $("#dwfkDiv").show();
    } else {
        $("#dwfkValue").val(0);
        $("#dwfkDiv").hide();
    }
}

function checkGrjf() {
    if ($("#grjf").is(':checked')) {
        $("#grjfDiv").show();
    } else {
        $("#grjfValue").val(0);
        $("#grjfDiv").hide();
    }
}

function checkGrfk() {
    if ($("#grfk").is(':checked')) {
        $("#grfkDiv").show();
    } else {
        $("#grfkValue").val(0);
        $("#grfkDiv").hide();
    }
}
function checkJbxx() {
    if ($("#jbxx").is(':checked')) {
        $("#jbxxDiv").show();
    } else {
        $("#jbxxValue").val(0);
        $("#jbxxDiv").hide();
    }
}

function getSwFineSet() {
    if (loading == false) {
        var levelId = $("#swLevelSelect").val();
        var jcType = $("#jcType").val();
//    alert("mainDeptId = " + mainDeptId + ", levelId = " + levelId + ", jcType = " + jcType);

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "swEnter/fineSet/" + levelId + "/" + jcType + "/" + mainDeptId,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "fineSet",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        if (data[i].fineobject == 0) {
                            // 单位处罚
                            if (data[i].finetype == 0) {
                                // 单位积分
                                $("#dwjf").checkboxradio("disable");
                                $("#dwjf").attr("checked", true).checkboxradio("refresh");
                                $("#dwjfDiv").show();
                                $("#dwjfValue").val(data[i].fine);
                            } else if (data[i].finetype == 1) {
                                // 单位罚款
                                $("#dwfk").checkboxradio("disable");
                                $("#dwfk").attr("checked", true).checkboxradio("refresh");
                                $("#dwfkDiv").show();
                                $("#dwfkValue").val(data[i].fine);
                            } else {
                                $().toastmessage('showToast', {
                                    text: '对单位的处罚类型错误！处罚类型为 : ' + data[i].finetype,
                                    sticky: false,
                                    position: 'middle-center',
                                    type: 'error'
                                });
                            }
                        } else if (data[i].fineobject == 1) {
                            // 个人处罚
                            if (data[i].finetype == 0) {
                                // 个人积分
                                $("#grjf").checkboxradio("disable");
                                $("#grjf").attr("checked", true).checkboxradio("refresh");
                                $("#grjfDiv").show();
                                $("#grjfValue").val(data[i].fine);
                            } else if (data[i].finetype == 1) {
                                // 个人罚款
                                $("#grfk").checkboxradio("disable");
                                $("#grfk").attr("checked", true).checkboxradio("refresh");
                                $("#grfkDiv").show();
                                $("#grfkValue").val(data[i].fine);
                            } else if (data[i].finetype == 2) {
                                //  进班学习
                                $("#jbxx").checkboxradio("disable");
                                $("#jbxx").attr("checked", true).checkboxradio("refresh");
                                $("#jbxxDiv").show();
                                $("#jbxxValue").val(data[i].fine);
                            } else if (data[i].finetype == 3) {
                                // 解除劳动合同
                                $("#dismiss").attr("checked", true).checkboxradio("refresh");
                            }
                        } else {
                            $().toastmessage('showToast', {
                                text: '处罚对象错误！处罚对象为 : ' + data[i].fineobject,
                                sticky: false,
                                position: 'middle-center',
                                type: 'error'
                            });
                        }
                    }
                } else {
                    $().toastmessage('showToast', {
                        text: '没有处罚信息数据！',
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