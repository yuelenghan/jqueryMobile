/**
 * Created by Administrator on 2014/4/18.
 */
var serverPath = "http://192.168.1.105:8080/DataService/";
var mainDeptId;

/**
 * 初始化隐患级别
 */
function initYhLevel() {
    $.ajax({
        url: serverPath + "baseInfo/41",
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "yhLevel",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var filterSelect = $("#yhyjLevel");
                filterSelect.html("");
                var filterSelectStr = "<option value='null'>--全部--</option>";
                for (var i = 0; i < data.length; i++) {
                    filterSelectStr += "<option value='" + data[i].infoid + "'>" + data[i].infoname + "</option>";
                }
                $(filterSelectStr).appendTo(filterSelect);
                filterSelect.val("null");
                filterSelect.selectmenu('refresh', true);

            }
        },
        error: function () {
            alert("error!");
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
        jsonpCallback: "yhType",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var filterSelect = $("#yhyjType");
                filterSelect.html("");
                var filterSelectStr = "<option value='null'>--全部--</option>";
                for (var i = 0; i < data.length; i++) {
                    filterSelectStr += "<option value='" + data[i].infoid + "'>" + data[i].infoname + "</option>";
                }
                $(filterSelectStr).appendTo(filterSelect);
                filterSelect.val("null");
                filterSelect.selectmenu('refresh', true);
            }
        },
        error: function () {
            alert("error!");
        }
    });
}

/**
 * 过滤隐患依据
 */
function filterYhyj() {
    mainDeptId = window.localStorage.getItem("mainDeptId");
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
                alert("没有隐患依据数据！");
            }
        },
        error: function () {
            alert("error!");
        }
    });
}

function returnYhyj() {
    var yhyj = $("#yhyjList").val();
    var yhyjText = $("#yhyjList").find("option:selected").text();
//    alert(yhyj);
    $.mobile.changePage("yhEnter.html");
//    window.location.href = "yhEnter.html";
    var select = $("#yhBasisSelect");
    select.val(yhyj);
    select.selectmenu('refresh', true);

    if (yhyj != undefined || yhyj != null || yhyj != "") {
        var select = $("#yhBasisSelect");
        select.val(yhyj);
        select.selectmenu('refresh', true);

        // 初始化隐患级别
        $.ajax({
            url: serverPath + "yhEnter/yhBasisLevel/" + yhyj,
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
                alert("error!");
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
                alert("error!");
            }
        });

        $("#yhContent").val(yhyjText);
    }

}
