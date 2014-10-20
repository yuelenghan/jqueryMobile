/**
 * Created by lihe on 14/9/26.
 */
var currentDisplayLevel = 1;

// 初始化第一级部门
function initDept() {
    if (currentDisplayLevel > 1) {
        while (currentDisplayLevel > 1) {
            $("#dept-" + currentDisplayLevel).remove();
            currentDisplayLevel--;
        }
    }
    $.ajax({
        url: serverPath + "department/0101",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "initDept11",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
//                $.mobile.changePage("#dept-filter");
                $.mobile.changePage("#dept-filter", {transition: "flip"});
                var select = $("#dept-1");
                select.html("");
                var selectStr = "<option value='-1'>--全部--</option>";
                for (var i = 0; i < data.length; i++) {
                    selectStr += "<option value='" + data[i].deptNumber + "'>" + data[i].deptName + "</option>";
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

function selectDept(selectVal) {
    // 在有ajax请求的时候，这个方法会重复调用，重复调用时selectVal和selectVal.value为空
    // 加上下边的判断，在重复调用的情况下，直接返回
    if (selectVal == null || selectVal == undefined || selectVal.value == undefined) {
        return;
    }

    $.ajax({
        url: serverPath + "department/" + selectVal.value,
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "selectDept",
        success: function (data) {
            var selectId = selectVal.id;
            if (data != undefined && data != null && data.length > 0) {
                // 如果选择的select是当前显示的最下级的部门所在的select
                if (selectId == "dept-" + currentDisplayLevel) {
                    // 创建一个select
                    var div = $("#dynamic");
                    currentDisplayLevel++;
                    var newSelectId = "dept-" + currentDisplayLevel;
                    var newSelect = "<select id='" + newSelectId + "' data-mini='true' data-native-menu='false' onchange='selectDept(this)'></select>";
                    div.append(newSelect).trigger("create");

                    // 给新创建的select赋值
                    var select = $("#" + newSelectId);
                    select.html("");
                    var selectStr = "<option value='-1'>--全部--</option>";
                    for (var i = 0; i < data.length; i++) {
                        selectStr += "<option value='" + data[i].deptNumber + "'>" + data[i].deptName + "</option>";
                    }
                    $(selectStr).appendTo(select);
                    select.selectmenu('refresh', true);
                } else {
                    var selectLevel = selectId.split("-")[1];
                    while (currentDisplayLevel > selectLevel) {
                        $("#dept-" + currentDisplayLevel).remove();
                        currentDisplayLevel--;
                    }

                    // 创建一个select
                    var div = $("#dynamic");
                    currentDisplayLevel++;
                    var newSelectId = "dept-" + currentDisplayLevel;
                    var newSelect = "<select id='" + newSelectId + "' data-mini='true' data-native-menu='false' onchange='selectDept(this)'></select>";
                    div.append(newSelect).trigger("create");

                    // 给新创建的select赋值
                    var select = $("#" + newSelectId);
                    select.html("");
                    var selectStr = "<option value='-1'>--全部--</option>";
                    for (var i = 0; i < data.length; i++) {
                        selectStr += "<option value='" + data[i].deptNumber + "'>" + data[i].deptName + "</option>";
                    }
                    $(selectStr).appendTo(select);
                    select.selectmenu('refresh', true);
                }
            } else {
                var selectLevel = selectId.split("-")[1];
                while (currentDisplayLevel > selectLevel) {
                    $("#dept-" + currentDisplayLevel).remove();
                    currentDisplayLevel--;
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


