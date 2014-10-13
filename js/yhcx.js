/**
 * Created by lihe on 14/10/9.
 */
var pageSize = 15, pageNo = 1;
var loading = false;

var leader;
var mainDeptId;

var summaryScroll;

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

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }

        if (dept == undefined || dept == null || dept == "") {
            dept = "null";
        }

        if (status == undefined || status == null || status == "") {
            status = "null";
        }

        if (place == undefined || place == null || place == "") {
            place = -1;
        }

        if (zgType == undefined || zgType == null || zgType == "") {
            zgType = "null";
        }


//        alert("startDate = " + startDate + ", endDate = " + endDate + ", dept = " + dept + ", status = " + status + ", pcType = " + pcType + ", type = " + type + ", place = " + place + ", zgType = " + zgType + ", level = " + level);
//        return;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        // 提交到服务端
        $.ajax({
            url: serverPath + "yhcx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + dept + "/status/" + status + "/pcType/" + pcType + "/type/" + type + "/place/" + place + "/zgType/" + zgType + "/level/" + level + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "yhcx",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#yhcx2");
                    $("#yhcx-result tbody").html("");
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].pcTime + "</td>";
                        tableStr += "<td>" + data[i].levelName + "</td>";
                        tableStr += "<td>" + data[i].typeName + "</td>";
                        tableStr += "<td>" + data[i].status + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#yhcx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#yhcx-result").table("refresh");

                    // 销毁下拉刷新插件
                    if (summaryScroll) {
                        summaryScroll.destroy();
                        summaryScroll = null;
                    }

                    loadSummaryScroll();


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

function loadSummaryScroll() {
    var pullDownEl = document.getElementById('summaryPullDown');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('summaryPullUp');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

    summaryScroll = new iScroll('summaryWrapper', {
        useTransition: true,
        topOffset: pullDownOffset,
        onRefresh: function () {
            if (pullDownEl.className.match('loading')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
            } else if (pullUpEl.className.match('loading')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
            }
        },
        onScrollMove: function () {
//            console.log("y = " + this.y + ", minY = " + this.minScrollY + ", maxY = " + this.maxScrollY + ", pullUpOffset = " + pullUpOffset);
            if (this.y > 5 && !pullDownEl.className.match('flip')) {
                pullDownEl.className = 'flip';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '松手开始更新...';
                this.minScrollY = 0;
            } else if (this.y < 5 && pullDownEl.className.match('flip')) {
                pullDownEl.className = '';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '下拉刷新...';
                this.minScrollY = -pullDownOffset;
            } else if (this.y < (this.maxScrollY - 5) && !pullUpEl.className.match('flip')) {
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                getYhcxData();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                summaryScrollPullUp();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('summaryWrapper').style.left = '0';
    }, 800);
}

function summaryScrollPullUp() {
    if (loading == false) {
        pageNo++;

        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        var dept = $("#deptNumber").text();
        var status = $("#status").val();
        var pcType = $("#pcType").val();
        var type = $("#type").val();
        var place = $("#place").val();
        var zgType = $("#zgType").val();
        var level = $("#level").val();

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }

        if (dept == undefined || dept == null || dept == "") {
            dept = "null";
        }

        if (status == undefined || status == null || status == "") {
            status = "null";
        }

        if (place == undefined || place == null || place == "") {
            place = -1;
        }

        if (zgType == undefined || zgType == null || zgType == "") {
            zgType = "null";
        }

        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "yhcx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + dept + "/status/" + status + "/pcType/" + pcType + "/type/" + type + "/place/" + place + "/zgType/" + zgType + "/level/" + level + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 20000,
            jsonpCallback: "yhcx",
            success: function (data) {
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].pcTime + "</td>";
                        tableStr += "<td>" + data[i].levelName + "</td>";
                        tableStr += "<td>" + data[i].typeName + "</td>";
                        tableStr += "<td>" + data[i].status + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#yhcx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#yhcx-result").table("refresh");
                } else {
                    $().toastmessage('showToast', {
                        text: '没有新数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                summaryScroll.refresh();
                $.mobile.loading("hide");
                loading = false;
            },
            error: function () {
                $.mobile.loading("hide");
                loading = false;
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