/**
 * Created by lihe on 14/10/10.
 */
var pageSize = 15, pageNo = 1;
var loading = false;

var deptId;
var leader = false;

var summaryScroll;


function gotoQuery() {
    $.mobile.changePage("#gpcx2", {transition: "flip"});
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
                    deptId = data.deptId;
                }

//                alert(leader + ", " + deptId);

                getGpcxData();
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

function getGpcxData() {
    // 如果是领导, 查询汇总信息; 如果不是领导, 查询当前部门的信息
    if (leader) {
        if (loading == false) {
            var startDate = $("#startDate").val();
            var endDate = $("#endDate").val();

            if (startDate == undefined || startDate == null || startDate == "") {
                startDate = "null";
            }
            if (endDate == undefined || endDate == null || endDate == "") {
                endDate = "null";
            }

            $.mobile.loading("show", {text: "正在获取...", textVisible: true});
            loading = true;


            $.ajax({
                url: serverPath + "gpcx/startDate/" + startDate + "/endDate/" + endDate,
                dataType: "jsonp",
                type: "post",
                timeout: 20000,
                jsonpCallback: "gpcx",
                success: function (data) {
                    if (data != undefined && data != null && data.length > 0) {
                        $.mobile.changePage("#gpcx1");
                        $("#gpcx-result tbody").html("");
                        for (var i = 0; i < data.length; i++) {
                            var tableStr = "<tr>";
                            tableStr += "<td><a onclick=getGpcxDetailData('" + data[i].deptNumber + "')>" + data[i].deptName + "</a></td>";
                            tableStr += "<td>" + data[i].gpAll + "</td>";
                            tableStr += "<td>" + data[i].gpYz + "</td>";
                            tableStr += "<td>" + data[i].gpWz + "</td>";
                            tableStr += "</tr>";

                            $(tableStr).appendTo($("#gpcx-result tbody"));
                        }

                        // 刷新table, 否则隐藏coloumn功能不可用
                        $("#gpcx-result").table("refresh");
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
    } else {
        getGpcxDetailData(deptId);
    }

}

function getGpcxDetailData(deptNumber) {
    deptId = deptNumber;

    if (loading == false) {
        pageNo = 1;

        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        // 提交到服务端
        $.ajax({
            url: serverPath + "gpcx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + deptId + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 20000,
            jsonpCallback: "gpcxDetail",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#gpcx3");
                    $("#gpcxDetail-result tbody").html("");
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].gppName + "</td>";
                        tableStr += "<td>" + data[i].gpDate + "</td>";
                        tableStr += "<td>" + data[i].zppName + "</td>";
                        tableStr += "<td>" + data[i].zpDate + "</td>";
                        tableStr += "<td>" + data[i].status + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#gpcxDetail-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#gpcxDetail-result").table("refresh");

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
                getGpcxDetailData(deptId);	// Execute custom function (ajax call?)
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

        if (startDate == undefined || startDate == null || startDate == "") {
            startDate = "null";
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            endDate = "null";
        }

        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "gpcx/startDate/" + startDate + "/endDate/" + endDate + "/dept/" + deptId + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 20000,
            jsonpCallback: "gpcxDetail",
            success: function (data) {
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].deptName + "</td>";
                        tableStr += "<td>" + data[i].gppName + "</td>";
                        tableStr += "<td>" + data[i].gpDate + "</td>";
                        tableStr += "<td>" + data[i].zppName + "</td>";
                        tableStr += "<td>" + data[i].zpDate + "</td>";
                        tableStr += "<td>" + data[i].status + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#gpcxDetail-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#gpcxDetail-result").table("refresh");
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