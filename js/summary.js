/**
 * 统计查询js
 * Created by lh on 14-2-27.
 */

var serverPath = "http://10.1.168.50:8080/DataService/";
var pageSize = 15, pageNo = 1;
var summaryScroll1, summaryScroll2, summaryScroll3, summaryScroll4, summaryScroll5,
    summaryScroll6, summaryScroll7, summaryScroll8, summaryScroll9, summaryScroll10,
    summaryScroll11, summaryScroll12, summaryScroll13, summaryScroll81;
var loading = false;

// 从服务端得到入井信息统计的数据
function getRjxxcxData() {
    if (loading == false) {
        pageNo = 1;

        var startDate = $("#startDate-10").val();
        var endDate = $("#endDate-10").val();
        var dept = $("#dept-10").val();

        if (startDate == undefined || startDate == null || startDate == "") {
            alert("请输入开始日期!");
            return;
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            alert("请输入结束日期!");
            return;
        }

        if (dept == undefined || dept == null || dept == "") {
            dept = "null";
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        // 提交到服务端
        $.ajax({
            url: serverPath + "summary/rjxx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + dept + "/start/0/limit/" + pageSize,
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
                    if (summaryScroll10) {
                        summaryScroll10.destroy();
                        summaryScroll10 = null;
                    }

                    loadSummaryScroll10();


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

function loadSummaryScroll10() {
    var pullDownEl = document.getElementById('summaryPullDown10');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('summaryPullUp10');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

    summaryScroll10 = new iScroll('summaryWrapper10', {
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
                getRjxxcxData();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                summaryScroll10PullUp();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('summaryWrapper10').style.left = '0';
    }, 800);
}

function summaryScroll10PullUp() {
    if (loading == false) {
        pageNo++;

        var startDate = $("#startDate-10").val();
        var endDate = $("#endDate-10").val();
        var dept = $("#dept-10").val();

        if (startDate == undefined || startDate == null || startDate == "") {
            alert("请输入开始日期!");
            return;
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            alert("请输入结束日期!");
            return;
        }

        if (dept == undefined || dept == null || dept == "") {
            dept = "null";
        }

        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/rjxx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + dept + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "rjxxSummary",
            success: function (data) {
                if (data != null && data.length > 0) {
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

                } else {
//                    alert("没有新数据！");
//                    $.mobile.changePage("#alert2-dialog");
                    $().toastmessage('showToast', {
                        text: '没有新数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                summaryScroll10.refresh();
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

/**
 * 带班计划表
 */
function getDbjhbData() {
    if (loading == false) {
        $.mobile.changePage("#dbjhb2");

        pageNo = 1;

        var date = $("#date-1").val();
        var banci = $("#banci-1").val();
        var name = $("#name-1").val();

        if (date == undefined || date == null || date == "") {
            date = "null";
        }
        if (name == undefined || name == null || name == "") {
            name = "null";
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/dbjhb/date/" + date + "/banci/" + banci + "/name/" + name + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "dbjhbSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {

                    $("#dbjhb-result tbody").html("");

                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].mineDate + "</td>";
                        tableStr += "<td>" + data[i].banci + "</td>";
                        tableStr += "<td>" + data[i].person + "</td>";
                        tableStr += "<td>" + data[i].changePerson + "</td>";
                        tableStr += "<td>" + data[i].realPerson + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#dbjhb-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#dbjhb-result").table("refresh");

                    // 销毁下拉刷新插件
                    if (summaryScroll1) {
                        summaryScroll1.destroy();
                        summaryScroll1 = null;
                    }

                    loadSummaryScroll1();

//                    setTimeout(summaryScroll1.refresh(), 200);
//                    summaryScroll1.refresh();

                } else {
//                    alert("没有数据!");
//                    $.mobile.changePage("#alert-dialog");
//                    $().toastmessage('showNoticeToast', 'some message here');
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

function loadSummaryScroll1() {
    var pullDownEl = document.getElementById('summaryPullDown1');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('summaryPullUp1');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

    summaryScroll1 = new iScroll('summaryWrapper1', {
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
                getDbjhbData();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                summaryScroll1PullUp();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('summaryWrapper1').style.left = '0';
    }, 800);
}

function summaryScroll1PullUp() {
    if (loading == false) {
        pageNo++;

        var date = $("#date-1").val();
        var banci = $("#banci-1").val();
        var name = $("#name-1").val();

        if (date == undefined || date == null || date == "") {
            date = "null";
        }
        if (name == undefined || name == null || name == "") {
            name = "null";
        }

        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/dbjhb/date/" + date + "/banci/" + banci + "/name/" + name + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "dbjhbSummary",
            success: function (data) {
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].mineDate + "</td>";
                        tableStr += "<td>" + data[i].banci + "</td>";
                        tableStr += "<td>" + data[i].person + "</td>";
                        tableStr += "<td>" + data[i].changePerson + "</td>";
                        tableStr += "<td>" + data[i].realPerson + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#dbjhb-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#dbjhb-result").table("refresh");

                } else {
//                    alert("没有新数据！");
//                    $.mobile.changePage("#alert2-dialog");
                    $().toastmessage('showToast', {
                        text: '没有新数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                summaryScroll1.refresh();

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

/**
 * 挂牌信息
 */
function getGpxxData() {
    if (loading == false) {
        $.mobile.changePage("#gpxx");

        pageNo = 1;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/gpxx/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "gpxxSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {

                    $("#gpxx-result tbody").html("");
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].maindeptname + "</td>";
                        tableStr += "<td>" + data[i].zrpersonname + "</td>";
                        tableStr += "<td>" + data[i].gpdate + "</td>";
                        tableStr += "<td>" + data[i].gpbanci + "</td>";
                        tableStr += "<td>" + data[i].httypeDesc + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#gpxx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#gpxx-result").table("refresh");

                    // 销毁下拉刷新插件
                    if (summaryScroll5) {
                        summaryScroll5.destroy();
                        summaryScroll5 = null;
                    }

                    loadSummaryScroll5();
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

function loadSummaryScroll5() {
    var pullDownEl = document.getElementById('summaryPullDown5');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('summaryPullUp5');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

    summaryScroll5 = new iScroll('summaryWrapper5', {
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
                getGpxxData();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                summaryScroll5PullUp();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('summaryWrapper5').style.left = '0';
    }, 800);
}

function summaryScroll5PullUp() {
    if (loading == false) {
        pageNo++;

        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/gpxx/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "gpxxSummary",
            success: function (data) {
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].maindeptname + "</td>";
                        tableStr += "<td>" + data[i].zrpersonname + "</td>";
                        tableStr += "<td>" + data[i].gpdate + "</td>";
                        tableStr += "<td>" + data[i].gpbanci + "</td>";
                        tableStr += "<td>" + data[i].httypeDesc + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#gpxx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#gpxx-result").table("refresh");

                } else {
//                    alert("没有新数据！");
//                    $.mobile.changePage("#alert2-dialog");
                    $().toastmessage('showToast', {
                        text: '没有新数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                summaryScroll5.refresh();

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

/**
 * 反三违信息
 */
function getFswxxData() {
    if (loading == false) {
        $.mobile.changePage("#fswxx2");

        pageNo = 1;

        var startDate = $("#startDate-2").val();
        var endDate = $("#endDate-2").val();
        var name = $("#name-2").val();

//    alert("startDate = " + startDate + ", endDate = " + endDate + ", name = " + name);

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }
        if (name == undefined || name == null || name == "") {
            name = "null";
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/fswxx/startDate/" + startDate + "/endDate/" + endDate + "/name/" + name + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "fswxxSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {

                    $("#fswxx-result tbody").html("");
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].name + "</td>";
                        tableStr += "<td>" + data[i].ybsw + "</td>";
                        tableStr += "<td>" + data[i].jyzsw + "</td>";
                        tableStr += "<td>" + data[i].yzsw + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#fswxx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#fswxx-result").table("refresh");

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

function loadSummaryScroll2() {
    var pullDownEl = document.getElementById('summaryPullDown2');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('summaryPullUp2');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

    summaryScroll2 = new iScroll('summaryWrapper2', {
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
//                alert("y = " + this.y + ", maxScrollY = " + this.maxScrollY);
//                console.log("y = " + this.y + ", maxScrollY = " + this.maxScrollY);
                pullUpEl.className = 'flip';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '松手开始更新...';
                this.maxScrollY = this.maxScrollY;
            } else if (this.y > (this.maxScrollY + 5) && pullUpEl.className.match('flip')) {
//                alert(2);
                pullUpEl.className = '';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '上拉加载更多...';
                this.maxScrollY = pullUpOffset;
            }
        },
        onScrollEnd: function () {
            if (pullDownEl.className.match('flip')) {
                pullDownEl.className = 'loading';
                pullDownEl.querySelector('.pullDownLabel').innerHTML = '加载中...';
                getFswxxData();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                summaryScroll2PullUp();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('summaryWrapper2').style.left = '0';
    }, 800);
}

function summaryScroll2PullUp() {
    if (loading == false) {
        pageNo++;

        var startDate = $("#startDate-2").val();
        var endDate = $("#endDate-2").val();
        var name = $("#name-2").val();

//    alert("startDate = " + startDate + ", endDate = " + endDate + ", name = " + name);

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }
        if (name == undefined || name == null || name == "") {
            name = "null";
        }

        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/fswxx/startDate/" + startDate + "/endDate/" + endDate + "/name/" + name + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "fswxxSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].name + "</td>";
                        tableStr += "<td>" + data[i].ybsw + "</td>";
                        tableStr += "<td>" + data[i].jyzsw + "</td>";
                        tableStr += "<td>" + data[i].yzsw + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#fswxx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#fswxx-result").table("refresh");

                } else {
//                    alert("没有新数据!")
//                    $.mobile.changePage("#alert2-dialog");
                    $().toastmessage('showToast', {
                        text: '没有新数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                summaryScroll2.refresh();

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

/**
 * 值班带班领导
 * @param flag
 */
function getZbdbldData(flag) {
    /*var date = $("#date-3").val();
     if (date == undefined || date == null || date == "") {
     alert("请输入日期！");
     return;
     }*/

//alert(flag.id);
    if (loading == false) {
        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading == true;

        var date = new Date();
        var year = date.getFullYear();
        var month = date.getMonth() + 1;
        var day = date.getDate();

        // 今天
        if (flag.id == "jt") {
        }

        // 明天
        if (flag.id == "mt") {
            day = date.getDate() + 1;
        }

        if (month < 10) {
            month = "0" + month;
        }
        if (day < 10) {
            day = "0" + day;
        }

//          alert(year + "," +month + "," + day);

        var curDate = year + "-" + month + "-" + day;

        $.ajax({
            url: serverPath + "summary/zbdbld/date/" + curDate,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "zbdbldSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#zbdbld2");

                    $("#zbdbld-result tbody").html("");

                    for (var i = 0; i < data.length; i++) {
//                    alert(data.length);

                        var tableStr = "<tr>";
                        tableStr += "<td rowspan='4'>" + data[i].deptName + "</td>";
                        tableStr += "<td colspan='2'>值班</td>";
                        tableStr += "<td>" + data[i].detail + "</td></tr>";

                        tableStr += "<tr>";
                        tableStr += "<td rowspan='3'>带班</td>";
                        tableStr += "<td>夜班</td>";
                        tableStr += "<td>" + data[i].yb + "</td></tr>";

                        tableStr += "<tr>";
                        tableStr += "<td>早班</td>";
                        tableStr += "<td>" + data[i].zb + "</td></tr>";

                        tableStr += "<tr>";
                        tableStr += "<td>中班</td>";
                        tableStr += "<td>" + data[i].zhb + "</td></tr>";

                        $(tableStr).appendTo($("#zbdbld-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#zbdbld-result").table("refresh");

                    // 销毁下拉刷新插件
                    if (summaryScroll3) {
                        summaryScroll3.destroy();
                        summaryScroll3 = null;
                    }
                    loadSummaryScroll3();
                } else {
//                alert("没有数据!")
//                $.mobile.changePage("#alert-dialog");
                    $().toastmessage('showToast', {
                        text: '没有数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                $.mobile.loading("hide");
                loading == false;

            },
            error: function () {
                $.mobile.loading("hide");
                loading == false;
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

function loadSummaryScroll3() {
    setTimeout(function () {
        document.getElementById('summaryWrapper3').style.left = '0';
    }, 800);
}

/**
 * 月度隐患汇总
 */
function getYdyhhzData() {
    if (loading == false) {
        pageNo = 1;

        var date = $("#date-9").val();
        if (date == undefined || date == null || date == "") {
            alert("请输入日期！");
            return;
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/ydyhhz/date/" + date,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "ydyhhzSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#ydyhhz2");
                    $("#ydyhhz-result tbody").html("");
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].yhAll + "</td>";
                        tableStr += "<td>" + data[i].yhA + "</td>";
                        tableStr += "<td>" + data[i].yhB + "</td>";
                        tableStr += "<td>" + data[i].yhC + "</td>";
                        tableStr += "<td>" + data[i].yhYqwzg + "</td>";
                        tableStr += "<td>" + data[i].yhLsyq + "</td>";
                        tableStr += "<td>" + data[i].yhYbh + "</td>";
                        tableStr += "<td>" + data[i].yhWbh + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#ydyhhz-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#ydyhhz-result").table("refresh");

                    // 销毁下拉刷新插件
                    if (summaryScroll9) {
                        summaryScroll9.destroy();
                        summaryScroll9 = null;
                    }

                    loadSummaryScroll9();
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

function loadSummaryScroll9() {
    /*   var pullDownEl = document.getElementById('summaryPullDown9');
     var pullDownOffset = pullDownEl.offsetHeight;
     var pullUpEl = document.getElementById('summaryPullUp9');
     var pullUpOffset = pullUpEl.offsetHeight;
     //    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

     summaryScroll9 = new iScroll('summaryWrapper9', {
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
     getYdyhhzData();	// Execute custom function (ajax call?)
     } else if (pullUpEl.className.match('flip')) {
     pullUpEl.className = 'loading';
     pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
     summaryScroll9PullUp();	// Execute custom function (ajax call?)
     }
     }
     });*/


    setTimeout(function () {
        document.getElementById('summaryWrapper9').style.left = '0';
    }, 800);
}

function summaryScroll9PullUp() {
    if (loading == false) {
        pageNo++;

        var date = $("#date-9").val();
        if (date == undefined || date == null || date == "") {
            alert("请输入日期！");
            return;
        }

        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/ydyhhz/date/" + date + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "ydyhhzSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].yhAll + "</td>";
                        tableStr += "<td>" + data[i].yhA + "</td>";
                        tableStr += "<td>" + data[i].yhB + "</td>";
                        tableStr += "<td>" + data[i].yhC + "</td>";
                        tableStr += "<td>" + data[i].yhYqwzg + "</td>";
                        tableStr += "<td>" + data[i].yhLsyq + "</td>";
                        tableStr += "<td>" + data[i].yhYbh + "</td>";
                        tableStr += "<td>" + data[i].yhWbh + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#ydyhhz-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#ydyhhz-result").table("refresh");

                } else {
//                    alert("没有新数据!")
//                    $.mobile.changePage("#alert2-dialog");
                    $().toastmessage('showToast', {
                        text: '没有新数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                summaryScroll9.refresh();

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

/**
 * 领导下井带班
 */
function getLdxjdbData() {
    if (loading == false) {
        pageNo = 1;

        var startDate = $("#startDate-7").val();
        var endDate = $("#endDate-7").val();
        var name = $("#name-7").val();
//    alert("startDate = " + startDate + ", endDate = " + endDate + ", name = " + name);

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }
        if (name == undefined || name == null || name == "") {
            name = "null";
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/ldxjdb/startDate/" + startDate + "/endDate/" + endDate + "/name/" + name + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "ldxjdbSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#ldxjdb2");
                    $("#ldxjdb-result tbody").html("");

                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].name + "</td>";
                        tableStr += "<td>" + data[i].posName + "</td>";
                        tableStr += "<td>" + data[i].rjAll + "</td>";
                        tableStr += "<td>" + data[i].planFreq + "</td>";
                        tableStr += "<td>" + data[i].dbrj + "</td>";
                        tableStr += "<td>" + data[i].yhAll + "</td>";
                        tableStr += "<td>" + data[i].swAll + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#ldxjdb-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#ldxjdb-result").table("refresh");

                    // 销毁下拉刷新插件
                    if (summaryScroll7) {
                        summaryScroll7.destroy();
                        summaryScroll7 = null;
                    }

                    loadSummaryScroll7();
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

function loadSummaryScroll7() {
    var pullDownEl = document.getElementById('summaryPullDown7');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('summaryPullUp7');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

    summaryScroll7 = new iScroll('summaryWrapper7', {
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
                getLdxjdbData();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                summaryScroll7PullUp();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('summaryWrapper7').style.left = '0';
    }, 800);
}

function summaryScroll7PullUp() {
    if (loading == false) {
        pageNo++;

        var startDate = $("#startDate-7").val();
        var endDate = $("#endDate-7").val();
        var name = $("#name-7").val();
//    alert("startDate = " + startDate + ", endDate = " + endDate + ", name = " + name);

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }
        if (name == undefined || name == null || name == "") {
            name = "null";
        }

        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/ldxjdb/startDate/" + startDate + "/endDate/" + endDate + "/name/" + name + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "ldxjdbSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].name + "</td>";
                        tableStr += "<td>" + data[i].posName + "</td>";
                        tableStr += "<td>" + data[i].rjAll + "</td>";
                        tableStr += "<td>" + data[i].planFreq + "</td>";
                        tableStr += "<td>" + data[i].dbrj + "</td>";
                        tableStr += "<td>" + data[i].yhAll + "</td>";
                        tableStr += "<td>" + data[i].swAll + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#ldxjdb-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#ldxjdb-result").table("refresh");

                } else {
//                    alert("没有新数据!")
//                    $.mobile.changePage("#alert2-dialog");
                    $().toastmessage('showToast', {
                        text: '没有新数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                summaryScroll7.refresh();

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

/**
 * 各矿隐患查询
 */
function getKzdkyhData() {
    if (loading == false) {
        pageNo = 1;

        var startDate = $("#startDate-6").val();
        if (startDate == undefined || startDate == null || startDate == "") {
            alert("请输入开始日期！");
            return;
        }

        var endDate = $("#endDate-6").val();
        if (endDate == undefined || endDate == null || endDate == "") {
            alert("请输入截止日期！");
            return;
        }

        var mine = $("#mine-6").val();
        if (mine == undefined || mine == null || mine == "") {
            alert("请选择煤矿！");
            return;
        }

//        alert("date = " + date + " mine = " + mine);

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/kzdkyh/startDate/" + startDate + "/endDate/" + endDate + "/mine/" + mine + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "kzdkyhSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#kzdkyh2");
                    $("#kzdkyh-result tbody").html("");

                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].zrDeptName + "</td>";
                        tableStr += "<td>" + data[i].yhAll + "</td>";
                        tableStr += "<td>" + data[i].yhYbh + "</td>";
                        tableStr += "<td>" + data[i].yhWbh + "</td>";
                        tableStr += "<td>" + data[i].yhLsyq + "</td>";
                        tableStr += "<td>" + data[i].yhA + "</td>";
                        tableStr += "<td>" + data[i].yhB + "</td>";
                        tableStr += "<td>" + data[i].yhC + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#kzdkyh-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#kzdkyh-result").table("refresh");

                    // 销毁下拉刷新插件
                    if (summaryScroll6) {
                        summaryScroll6.destroy();
                        summaryScroll6 = null;
                    }

                    loadSummaryScroll6();
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


function loadSummaryScroll6() {
    var pullDownEl = document.getElementById('summaryPullDown6');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('summaryPullUp6');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

    summaryScroll6 = new iScroll('summaryWrapper6', {
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
                getKzdkyhData();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                summaryScroll6PullUp();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('summaryWrapper6').style.left = '0';
    }, 800);
}

function summaryScroll6PullUp() {
    if (loading == false) {
        pageNo++;

        var startDate = $("#startDate-6").val();
        if (startDate == undefined || startDate == null || startDate == "") {
            alert("请输入开始日期！");
            return;
        }

        var endDate = $("#endDate-6").val();
        if (endDate == undefined || endDate == null || endDate == "") {
            alert("请输入截止日期！");
            return;
        }

        var mine = $("#mine-6").val();
        if (mine == undefined || mine == null || mine == "") {
            alert("请选择煤矿！");
            return;
        }

        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/kzdkyh/startDate/" + startDate + "/endDate/" + endDate + "/mine/" + mine + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "kzdkyhSummary",
            success: function (data) {
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].zrDeptName + "</td>";
                        tableStr += "<td>" + data[i].yhAll + "</td>";
                        tableStr += "<td>" + data[i].yhYbh + "</td>";
                        tableStr += "<td>" + data[i].yhWbh + "</td>";
                        tableStr += "<td>" + data[i].yhLsyq + "</td>";
                        tableStr += "<td>" + data[i].yhA + "</td>";
                        tableStr += "<td>" + data[i].yhB + "</td>";
                        tableStr += "<td>" + data[i].yhC + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#kzdkyh-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#kzdkyh-result").table("refresh");

                } else {
//                    alert("没有新数据！");
//                    $.mobile.changePage("#alert2-dialog");
                    $().toastmessage('showToast', {
                        text: '没有新数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                summaryScroll6.refresh();

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

/**
 * 月度三违挂牌汇总
 */
function getYdswgphzData() {
    if (loading == false) {
        pageNo = 1;

        var date = $("#date-8").val();
        if (date == undefined || date == null || date == "") {
            alert("请输入日期!");
            return;
        }

        var type = $("#type-8").val();

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/ydswgphz/date/" + date + "/type/" + type,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "ydswgphzSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    if (type == "sw") {
                        $.mobile.changePage("#ydswgphz2");
                        $("#ydswgphz-result tbody").html("");
                        for (var i = 0; i < data.length; i++) {
                            var tableStr = "<tr>";
                            tableStr += "<td>" + data[i].deptName + "</td>";
                            tableStr += "<td>" + data[i].swAll + "</td>";
                            tableStr += "<td>" + data[i].swYz + "</td>";
                            tableStr += "<td>" + data[i].swJyz + "</td>";
                            tableStr += "<td>" + data[i].swYb + "</td>";
                            /*       tableStr += "<td>" + data[i].gpAll + "</td>";
                             tableStr += "<td>" + data[i].gpWz + "</td>";
                             tableStr += "<td>" + data[i].gpYz + "</td>";*/
                            tableStr += "</tr>";

                            $(tableStr).appendTo($("#ydswgphz-result tbody"));
                        }

                        // 刷新table, 否则隐藏coloumn功能不可用
                        $("#ydswgphz-result").table("refresh");

                        // 销毁下拉刷新插件
                        if (summaryScroll8) {
                            summaryScroll8.destroy();
                            summaryScroll8 = null;
                        }

                        loadSummaryScroll8();
                    }
                    if (type == "gp") {
                        $.mobile.changePage("#ydswgphz3");
                        $("#ydswgphz2-result tbody").html("");
                        for (var i = 0; i < data.length; i++) {
                            var tableStr = "<tr>";
                            tableStr += "<td>" + data[i].deptName + "</td>";
                            /*   tableStr += "<td>" + data[i].swAll + "</td>";
                             tableStr += "<td>" + data[i].swYz + "</td>";
                             tableStr += "<td>" + data[i].swJyz + "</td>";
                             tableStr += "<td>" + data[i].swYb + "</td>";*/
                            tableStr += "<td>" + data[i].gpAll + "</td>";
                            tableStr += "<td>" + data[i].gpWz + "</td>";
                            tableStr += "<td>" + data[i].gpYz + "</td>";
                            tableStr += "</tr>";

                            $(tableStr).appendTo($("#ydswgphz2-result tbody"));
                        }

                        // 刷新table, 否则隐藏coloumn功能不可用
                        $("#ydswgphz2-result").table("refresh");

                        // 销毁下拉刷新插件
                        if (summaryScroll81) {
                            summaryScroll81.destroy();
                            summaryScroll81 = null;
                        }

                        loadSummaryScroll81();
                    }
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

function loadSummaryScroll8() {
    setTimeout(function () {
        document.getElementById('summaryWrapper8').style.left = '0';
    }, 800);
}

function loadSummaryScroll81() {
    setTimeout(function () {
        document.getElementById('summaryWrapper81').style.left = '0';
    }, 800);
}

/**
 * 三违信息查询
 */
function getSwxxcxData() {
    if (loading == false) {
        pageNo = 1;

        var startDate = $("#startDate-11").val();
        var endDate = $("#endDate-11").val();
        var dept = $("#dept-11").val();

        if (startDate == undefined || startDate == null || startDate == "") {
            alert("请输入开始日期!");
            return;
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            alert("请输入结束日期!");
            return;
        }

        if (dept == undefined || dept == null || dept == "") {
            dept = "null";
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        // 提交到服务端
        $.ajax({
            url: serverPath + "summary/swxx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + dept + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "swxxSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#swxxcx2");
                    $("#swxxcx-result tbody").html("");
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].mainDeptName + "</td>";
                        tableStr += "<td>" + data[i].zrkqName + "</td>";
                        tableStr += "<td>" + data[i].swpName + "</td>";
                        tableStr += "<td>" + data[i].pctime + "</td>";
                        tableStr += "<td>" + data[i].levelName + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#swxxcx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#swxxcx-result").table("refresh");

                    // 销毁下拉刷新插件
                    if (summaryScroll11) {
                        summaryScroll11.destroy();
                        summaryScroll11 = null;
                    }

                    loadSummaryScroll11();

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

function loadSummaryScroll11() {
    var pullDownEl = document.getElementById('summaryPullDown11');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('summaryPullUp11');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

    summaryScroll11 = new iScroll('summaryWrapper11', {
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
                getSwxxcxData();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                summaryScroll11PullUp();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('summaryWrapper11').style.left = '0';
    }, 800);
}

function summaryScroll11PullUp() {
    if (loading == false) {
        pageNo++;

        var startDate = $("#startDate-11").val();
        var endDate = $("#endDate-11").val();
        var dept = $("#dept-11").val();

        if (startDate == undefined || startDate == null || startDate == "") {
            alert("请输入开始日期!");
            return;
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            alert("请输入结束日期!");
            return;
        }

        if (dept == undefined || dept == null || dept == "") {
            dept = "null";
        }


        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/swxx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + dept + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "swxxSummary",
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

                        $(tableStr).appendTo($("#swxxcx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#swxxcx-result").table("refresh");

                } else {
//                    alert("没有新数据！");
//                    $.mobile.changePage("#alert2-dialog");
                    $().toastmessage('showToast', {
                        text: '没有新数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                summaryScroll11.refresh();

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

/**
 * 隐患分类统计查询
 */
function getYhfltjcxData() {
    if (loading == false) {
        pageNo = 1;

        var startDate = $("#startDate-12").val();
        var endDate = $("#endDate-12").val();
        var unit = $("#unit-12").val();

        if (startDate == undefined || startDate == null || startDate == "") {
            alert("请输入开始日期!");
            return;
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            alert("请输入结束日期!");
            return;
        }

        if (unit == undefined || unit == null || unit == "") {
            unit = "null";
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/yhfltjcx/startDate/" + startDate + "/endDate/" + endDate + "/unit/" + unit + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "yhfltjcxSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#yhfltjcx2");
                    $("#yhfltjcx-result tbody").html("");
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].zrDeptName + "</td>";
                        tableStr += "<td>" + data[i].yhAll + "</td>";
                        tableStr += "<td>" + data[i].yhYbh + "</td>";
                        tableStr += "<td>" + data[i].yhWbh + "</td>";
                        tableStr += "<td>" + data[i].yhLsyq + "</td>";
                        tableStr += "<td>" + data[i].yhA + "</td>";
                        tableStr += "<td>" + data[i].yhB + "</td>";
                        tableStr += "<td>" + data[i].yhC + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#yhfltjcx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#yhfltjcx-result").table("refresh");

                    // 销毁下拉刷新插件
                    if (summaryScroll12) {
                        summaryScroll12.destroy();
                        summaryScroll12 = null;
                    }

                    loadSummaryScroll12();
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

function loadSummaryScroll12() {
    var pullDownEl = document.getElementById('summaryPullDown12');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('summaryPullUp12');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

    summaryScroll12 = new iScroll('summaryWrapper12', {
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
                getYhfltjcxData();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                summaryScroll12PullUp();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('summaryWrapper12').style.left = '0';
    }, 800);
}

function summaryScroll12PullUp() {
    if (loading == false) {
        pageNo++;

        var startDate = $("#startDate-12").val();
        var endDate = $("#endDate-12").val();
        var unit = $("#unit-12").val();

        if (startDate == undefined || startDate == null || startDate == "") {
            alert("请输入开始日期!");
            return;
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            alert("请输入结束日期!");
            return;
        }

        if (unit == undefined || unit == null || unit == "") {
            unit = "null";
        }


        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/yhfltjcx/startDate/" + startDate + "/endDate/" + endDate + "/unit/" + unit + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "yhfltjcxSummary",
            success: function (data) {
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].zrDeptName + "</td>";
                        tableStr += "<td>" + data[i].yhAll + "</td>";
                        tableStr += "<td>" + data[i].yhYbh + "</td>";
                        tableStr += "<td>" + data[i].yhWbh + "</td>";
                        tableStr += "<td>" + data[i].yhLsyq + "</td>";
                        tableStr += "<td>" + data[i].yhA + "</td>";
                        tableStr += "<td>" + data[i].yhB + "</td>";
                        tableStr += "<td>" + data[i].yhC + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#yhfltjcx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#yhfltjcx-result").table("refresh");

                } else {
//                    alert("没有新数据！");
//                    $.mobile.changePage("#alert2-dialog");
                    $().toastmessage('showToast', {
                        text: '没有新数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                summaryScroll12.refresh();

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

/**
 * 隐患信息综合查询
 */
function getYhxxzhcxData() {
    if (loading == false) {
        pageNo = 1;

        var startDate = $("#startDate-13").val();
        var endDate = $("#endDate-13").val();
        var unit = $("#unit-13").val();

//    alert("startDate = " + startDate + ", endDate = " + endDate + ", unit = " + unit + ", banci = " + banci);
        if (startDate == undefined || startDate == null || startDate == "") {
            alert("请输入开始日期!");
            return;
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            alert("请输入结束日期!");
            return;
        }

        if (unit == undefined || unit == null || unit == "") {
            unit = "null";
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/yhxxzhcx/startDate/" + startDate + "/endDate/" + endDate + "/unit/" + unit + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "yhxxzhcxSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#yhxxzhcx2");
                    $("#yhxxzhcx-result tbody").html("");
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].zrDeptName + "</td>";
                        tableStr += "<td>" + data[i].banci + "</td>";
                        tableStr += "<td>" + data[i].pcTime + "</td>";
                        tableStr += "<td>" + data[i].levelName + "</td>";
                        tableStr += "<td>" + data[i].typeName + "</td>";
                        tableStr += "<td>" + data[i].status + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#yhxxzhcx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#yhxxzhcx-result").table("refresh");

                    // 销毁下拉刷新插件
                    if (summaryScroll13) {
                        summaryScroll13.destroy();
                        summaryScroll13 = null;
                    }

                    loadSummaryScroll13();

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

function loadSummaryScroll13() {
    var pullDownEl = document.getElementById('summaryPullDown13');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('summaryPullUp13');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

    summaryScroll13 = new iScroll('summaryWrapper13', {
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
                getYhxxzhcxData();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                summaryScroll13PullUp();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('summaryWrapper13').style.left = '0';
    }, 800);
}

function summaryScroll13PullUp() {
    if (loading == false) {
        pageNo++;

        var startDate = $("#startDate-13").val();
        var endDate = $("#endDate-13").val();
        var unit = $("#unit-13").val();

//    alert("startDate = " + startDate + ", endDate = " + endDate + ", unit = " + unit + ", banci = " + banci);
        if (startDate == undefined || startDate == null || startDate == "") {
            alert("请输入开始日期!");
            return;
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            alert("请输入结束日期!");
            return;
        }

        if (unit == undefined || unit == null || unit == "") {
            unit = "null";
        }


        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/yhxxzhcx/startDate/" + startDate + "/endDate/" + endDate + "/unit/" + unit + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "yhxxzhcxSummary",
            success: function (data) {
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].zrDeptName + "</td>";
                        tableStr += "<td>" + data[i].banci + "</td>";
                        tableStr += "<td>" + data[i].pcTime + "</td>";
                        tableStr += "<td>" + data[i].levelName + "</td>";
                        tableStr += "<td>" + data[i].typeName + "</td>";
                        tableStr += "<td>" + data[i].status + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#yhxxzhcx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#yhxxzhcx-result").table("refresh");

                } else {
//                    alert("没有新数据！");
//                    $.mobile.changePage("#alert2-dialog");
                    $().toastmessage('showToast', {
                        text: '没有新数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                summaryScroll13.refresh();

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

/**
 * 工伤信息
 */
function getGsxxData() {
    if (loading == false) {
        pageNo = 1;

        var startDate = $("#startDate-4").val();
        var endDate = $("#endDate-4").val();
        var unit = $("#unit-4").val();
        var level = $("#level-4").val();
        var name = $("#name-4").val();

//    alert("startDate = " + startDate + ", endDate = " + endDate + ", unit = " + unit + ", level = " + level + ", name = " + name);

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }

        if (unit == undefined || unit == null || unit == "") {
            unit = "null";
        }
        if (name == undefined || name == null || name == "") {
            name = "null";
        }
//    alert("startDate = " + startDate + ", endDate = " + endDate + ", unit = " + unit + ", level = " + level + ", name = " + name);

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/gsxx/startDate/" + startDate + "/endDate/" + endDate + "/unit/" + unit + "/level/" + level + "/name/" + name + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "gsxxSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#gsxx2");
                    $("#gsxx-result tbody").html("");
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].name + "</td>";
                        tableStr += "<td>" + data[i].level + "</td>";
                        tableStr += "<td>" + data[i].happenDate + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#gsxx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#gsxx-result").table("refresh");

                    // 销毁下拉刷新插件
                    if (summaryScroll4) {
                        summaryScroll4.destroy();
                        summaryScroll4 = null;
                    }

                    loadSummaryScroll4();

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

function loadSummaryScroll4() {
    var pullDownEl = document.getElementById('summaryPullDown4');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('summaryPullUp4');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

    summaryScroll4 = new iScroll('summaryWrapper4', {
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
                getGsxxData();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                summaryScroll4PullUp();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('summaryWrapper4').style.left = '0';
    }, 800);
}

function summaryScroll4PullUp() {
    if (loading == false) {
        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;
        pageNo++;

        var startDate = $("#startDate-4").val();
        var endDate = $("#endDate-4").val();
        var unit = $("#unit-4").val();
        var level = $("#level-4").val();
        var name = $("#name-4").val();

//    alert("startDate = " + startDate + ", endDate = " + endDate + ", unit = " + unit + ", level = " + level + ", name = " + name);

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }

        if (unit == undefined || unit == null || unit == "") {
            unit = "null";
        }
        if (name == undefined || name == null || name == "") {
            name = "null";
        }

        var start = (pageNo - 1) * 15;
        var limit = pageSize;
        $.ajax({
            url: serverPath + "summary/gsxx/startDate/" + startDate + "/endDate/" + endDate + "/unit/" + unit + "/level/" + level + "/name/" + name + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "gsxxSummary",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].name + "</td>";
                        tableStr += "<td>" + data[i].level + "</td>";
                        tableStr += "<td>" + data[i].happenDate + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#gsxx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#gsxx-result").table("refresh");

                } else {
//                    alert("没有新数据!")
//                    $.mobile.changePage("#alert2-dialog");
                    $().toastmessage('showToast', {
                        text: '没有新数据',
                        sticky: false,
                        position: 'middle-center',
                        type: 'notice'
                    });
                }

                summaryScroll4.refresh();

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

function gotoGsxx() {
    $.mobile.changePage("#gsxx1");

    $.ajax({
        url: serverPath + "baseInfo/gsLevel",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "gsLevel",
        success: function (data) {
            if (data != undefined && data != null && data.length > 0) {
                var select = $("#level-4");
                select.html("");
                var selectStr = "<option value='null'>--全部--</option>";
                for (var i = 0; i < data.length; i++) {
                    selectStr += "<option value='" + data[i].infoname + "'>" + data[i].infoname + "</option>";
                }
                $(selectStr).appendTo(select);
            } else {
//                alert("没有数据!")
//                $.mobile.changePage("#alert-dialog");
                $().toastmessage('showToast', {
                    text: '没有数据',
                    sticky: false,
                    position: 'middle-center',
                    type: 'notice'
                });
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