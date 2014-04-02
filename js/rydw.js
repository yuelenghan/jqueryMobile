/**
 * Created by Administrator on 2014/3/21.
 */
var serverPath = "http://10.1.168.50:8080/DataService/";
var rydwScroll1;
var pageSize = 15, pageNo = 1;
var loading = false;

function getInMinePeople() {
    if (loading == false) {
        pageNo = 1;

        var date = $("#date-1").val();
//    alert("date = " + date);

        if (date == undefined || date == null || date == "") {
            alert("请输入日期！");
            return;
        }

        $.ajax({
            url: serverPath + "rydw/inMinePeople/date/" + date + "/start/0/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            jsonpCallback: "inMinePeople",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#inMinePeople2");

                    $("#inMinePeople-result tbody").html("");

                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].peopleName + "</td>";
                        /*  tableStr += "<td>" + data[i].rankName + "</td>";
                         tableStr += "<td>" + data[i].deptName + "</td>";
                         tableStr += "<td>" + data[i].deptFullName + "</td>";
                         tableStr += "<td>" + data[i].workTypeName + "</td>";*/
                        tableStr += "<td>" + data[i].positionDesc + "</td>";
                        /*  tableStr += "<td>" + data[i].firstReportTime + "</td>";
                         tableStr += "<td>" + data[i].lastReportTime + "</td>";*/
                        tableStr += "<td>" + data[i].inMineTime + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#inMinePeople-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#inMinePeople-result").table("refresh");

                    // 销毁下拉刷新插件
                    if (rydwScroll1) {
                        rydwScroll1.destroy();
                        rydwScroll1 = null;
                    }

                    loadRydwScroll1();

                } else {
                    alert("没有数据!")
                }

                loading = false;

            },
            error: function () {
                alert("error");
                loading = false;
            }
        });
    }
}

function loadRydwScroll1() {
    var pullDownEl = document.getElementById('rydwPullDown1');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('rydwPullUp1');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

    rydwScroll1 = new iScroll('rydwWrapper1', {
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
                getInMinePeople();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                rydwScroll1PullUp();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('rydwWrapper1').style.left = '0';
    }, 800);
}

function rydwScroll1PullUp() {
    if (loading == false) {
        pageNo++;

        var date = $("#date-1").val();

        if (date == undefined || date == null || date == "") {
            alert("请输入日期!");
            return;
        }

        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        loading = true;

        $.ajax({
            url: serverPath + "rydw/inMinePeople/date/" + date + "/start/" + start + "/limit/" + pageSize,
            dataType: "jsonp",
            type: "post",
            jsonpCallback: "inMinePeople",
            success: function (data) {
                if (data != null && data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var tableStr = "<tr>";
                        tableStr += "<td>" + data[i].peopleName + "</td>";
                        /*         tableStr += "<td>" + data[i].rankName + "</td>";
                         tableStr += "<td>" + data[i].deptName + "</td>";
                         tableStr += "<td>" + data[i].deptFullName + "</td>";
                         tableStr += "<td>" + data[i].workTypeName + "</td>";*/
                        tableStr += "<td>" + data[i].positionDesc + "</td>";
                        /*         tableStr += "<td>" + data[i].firstReportTime + "</td>";
                         tableStr += "<td>" + data[i].lastReportTime + "</td>";*/
                        tableStr += "<td>" + data[i].inMineTime + "</td>";
                        tableStr += "</tr>";

                        $(tableStr).appendTo($("#inMinePeople-result tbody"));
                    }

                    // 刷新table, 否则隐藏coloumn功能不可用
                    $("#inMinePeople-result").table("refresh");

                } else {
                    alert("没有新数据！");
                }

                rydwScroll1.refresh();
                loading = false;
            },
            error: function () {
                alert("error");
                loading = false;
            }
        });
    }

}