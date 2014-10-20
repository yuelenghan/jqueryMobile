/**
 * Created by lihe on 14/10/9.
 */

var pageSize = 15, pageNo = 1;
var loading = false;

var summaryScroll;

function gotoQuery() {
    initSwType();
    initSwLevel();

    $.mobile.changePage("#swcx2", {transition: "flip"});
}

function initSwType() {
    $.ajax({
        url: serverPath + "baseInfo/102",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "swType",
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
        timeout: 10000,
        jsonpCallback: "swLevel",
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
            $().toastmessage('showToast', {
                text: '访问服务器错误！',
                sticky: false,
                position: 'middle-center',
                type: 'error'
            });
        }
    });
}

function getSwcxData() {
    if (loading == false) {
        pageNo = 1;

        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        var dept = $("#deptNumber").text();
        var name = $("#name").val();
        var type = $("#type").val();
        var level = $("#level").val();


//        alert("startDate = " + startDate + ", endDate = " + endDate + ", dept = " + dept + ", name = " + name + ", type = " + type + ", level = " + level);

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }

        if (dept == undefined || dept == null || dept == "") {
            dept = "null";
        }

        if (name == undefined || name == null || name == "") {
            name = "null";
        }

        if (type == undefined || type == null || type == "") {
            type = -1;
        }

        if (level == undefined || level == null || level == "") {
            level = -1;
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        // 提交到服务端
        $.ajax({
            url: serverPath + "swcx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + dept + "/name/" + name + "/type/" + type + "/level/" + level + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 20000,
            jsonpCallback: "swcx",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#swcx1");
                    $("#swcx-result tbody").html("");
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].mainDeptName + "</td>";
                        tableStr += "<td>" + data[i].zrkqName + "</td>";
                        tableStr += "<td>" + data[i].swpName + "</td>";
                        tableStr += "<td>" + data[i].pctime + "</td>";
                        tableStr += "<td>" + data[i].levelName + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#swcx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#swcx-result").table("refresh");

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
                getSwcxData();	// Execute custom function (ajax call?)
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
        var name = $("#name").val();
        var type = $("#type").val();
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

        if (name == undefined || name == null || name == "") {
            name = "null";
        }

        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "swcx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + dept + "/name/" + name + "/type/" + type + "/level/" + level + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 20000,
            jsonpCallback: "swcx",
            success: function (data) {
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].mainDeptName + "</td>";
                        tableStr += "<td>" + data[i].zrkqName + "</td>";
                        tableStr += "<td>" + data[i].swpName + "</td>";
                        tableStr += "<td>" + data[i].pctime + "</td>";
                        tableStr += "<td>" + data[i].levelName + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#swcx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#swcx-result").table("refresh");
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
    $.mobile.changePage("#swcx2", {transition: "flip"});
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