/**
 * Created by lihe on 14/9/29.
 */
var serverPath = "http://localhost:8080/DataService/";
var pageSize = 15, pageNo = 1;
var loading = false;

var summaryScroll1;

function initZwjb() {
    if (loading == false) {
        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "baseInfo/152",
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "zwjb",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    var select = $("#zwjb");
                    select.html("");
                    var selectStr = "<option value='-1'>--全部--</option>";
                    for (var i = 0; i < data.length; i++) {
                        selectStr += "<option value='" + data[i].infocode + "'>" + data[i].infoname + "</option>";
                    }
                    $(selectStr).appendTo(select);
                    select.selectmenu('refresh', true);
                } else {
                    $().toastmessage('showToast', {
                        text: '没有职务级别数据',
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

// 从服务端得到入井信息统计的数据
function getRjxxcxData() {
    if (loading == false) {
        pageNo = 1;

        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        var dept = $("#deptNumber").text();
        var zwjb = $("#zwjb").val();
        var name = $("#name").val();

//        alert("startDate = " + startDate + ", endDate = " + endDate + ", dept = " + dept + ", name = " + name);

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }

        if (dept == undefined || dept == null || dept == "") {
            dept = "null";
        }

        if (zwjb == "-1" || zwjb == -1) {
            zwjb = "null";
        }

        if (name == undefined || name == null || name == "") {
            name = "null";
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        // 提交到服务端
        $.ajax({
            url: serverPath + "summary/rjxx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + dept + "/zwjb/" + zwjb + "/name/" + name + "/start/0/limit/" + pageSize,
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
                    if (summaryScroll1) {
                        summaryScroll1.destroy();
                        summaryScroll1 = null;
                    }

                    loadSummaryScroll1();


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
                getRjxxcxData();	// Execute custom function (ajax call?)
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

        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        var dept = $("#deptNumber").text();
        var zwjb = $("#zwjb").val();
        var name = $("#name").val();

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }

        if (dept == undefined || dept == null || dept == "") {
            dept = "null";
        }

        if (zwjb == "-1" || zwjb == -1) {
            zwjb = "null";
        }

        if (name == undefined || name == null || name == "") {
            name = "null";
        }

        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "summary/rjxx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + dept + "/zwjb/" + zwjb + "/name/" + name + "/start/" + start + "/limit/" + pageSize,
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

function returndept() {
//    $.mobile.changePage("#rjxxcx1");
    $.mobile.changePage("#rjxxcx1", {transition: "flip"});
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