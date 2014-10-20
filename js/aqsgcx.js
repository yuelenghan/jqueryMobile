/**
 * Created by lihe on 14/10/11.
 */
var pageSize = 15, pageNo = 1;
var loading = false;

var summaryScroll;

function gotoQuery() {
    $.mobile.changePage("#aqsgcx2", {transition: "flip"});
}

function getAqsgcxData() {
    if (loading == false) {
        pageNo = 1;

        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        var dept = $("#deptNumber").text();
        var xz = $("#xz").val();

//        alert("startDate = " + startDate + ", endDate = " + endDate + ", dept = " + dept + ", xz = " + xz);

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }

        if (dept == undefined || dept == null || dept == "") {
            dept = "null";
        }

        if (xz == undefined || xz == null || xz == "") {
            xz = "null";
        }


        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        // 提交到服务端
        $.ajax({
            url: serverPath + "aqsgcx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + dept + "/xz/" + xz + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 20000,
            jsonpCallback: "aqsgcx",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#aqsgcx1");
                    $("#aqsgcx-result tbody").html("");
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].zgDeptName + "</td>";
                        tableStr += "<td>" + data[i].placeName + "</td>";
                        tableStr += "<td>" + data[i].date + "</td>";
                        tableStr += "<td>" + data[i].xz + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#aqsgcx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#aqsgcx-result").table("refresh");

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
                getAqsgcxData();	// Execute custom function (ajax call?)
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
        var xz = $("#xz").val();

//        alert("startDate = " + startDate + ", endDate = " + endDate + ", dept = " + dept + ", xz = " + xz);

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }

        if (dept == undefined || dept == null || dept == "") {
            dept = "null";
        }

        if (xz == undefined || xz == null || xz == "") {
            xz = "null";
        }

        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "aqsgcx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + dept + "/xz/" + xz + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 20000,
            jsonpCallback: "aqsgcx",
            success: function (data) {
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].zgDeptName + "</td>";
                        tableStr += "<td>" + data[i].placeName + "</td>";
                        tableStr += "<td>" + data[i].date + "</td>";
                        tableStr += "<td>" + data[i].xz + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#aqsgcx-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#aqsgcx-result").table("refresh");
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
    $.mobile.changePage("#aqsgcx2", {transition: "flip"});
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