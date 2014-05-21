/**
 * Created by Administrator on 2014/5/6.
 */
/**
 * 三违信息查询
 */
var serverPath = "http://192.168.1.105:8080/DataService/";
var pageSize = 15, pageNo = 1;
var swxcScroll;
var loading = false;

function getSwxcList() {
    if (loading == false) {
        pageNo = 1;

        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();

        if (startDate == undefined || startDate == null || startDate == "") {
            alert("请输入开始日期!");
            return;
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            alert("请输入结束日期!");
            return;
        }

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        // 提交到服务端
        $.ajax({
            url: serverPath + "swxcQuery/swxcList/" + startDate + "/" + endDate + "/0/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "swxcList",
            success: function (data) {
                if (data != undefined && data != null && data.length > 0) {
                    $.mobile.changePage("#swxcQuery2");
                    var listView = $("#swxcListview");
                    listView.empty();
                    for (var i = 0; i < data.length; i++) {
                        var list = "<li><a href='#' onclick='gotoSwxcDetail(this)'  id='" + data[i].swinputId + "'>描述:" + data[i].remarks + " 班次:" + data[i].banci + " 排查时间:" + data[i].pcTime + "</a></li>";
                        listView.append(list);
                    }

                    listView.listview('refresh');

                    // 销毁下拉刷新插件
                    if (swxcScroll) {
                        swxcScroll.destroy();
                        swxcScroll = null;
                    }

                    loadSwxcScroll();

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

function loadSwxcScroll() {
    var pullDownEl = document.getElementById('swxcPullDown');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('swxcPullUp');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

    swxcScroll = new iScroll('swxcWrapper', {
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
                getSwxcList();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                swxcPullUpAction();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('swxcWrapper').style.left = '0';
    }, 800);
}

function swxcPullUpAction() {
    if (loading == false) {
        pageNo++;

        var startDate = $("#startDate").val();
        var endDate = $("#endDate").val();
        var dept = $("#dept").val();

        if (startDate == undefined || startDate == null || startDate == "") {
            alert("请输入开始日期!");
            return;
        }
        if (endDate == undefined || endDate == null || endDate == "") {
            alert("请输入结束日期!");
            return;
        }


        var start = (pageNo - 1) * 15;
        var limit = pageSize;

        $.mobile.loading("show", {text: "正在获取...", textVisible: true});
        loading = true;

        $.ajax({
            url: serverPath + "swxcQuery/swxcList/" + startDate + "/" + endDate + "/" + start + "/" + pageSize,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "swxcList",
            success: function (data) {
                if (data != null && data.length > 0) {
                    var listView = $("#swxcListview");
                    for (var i = 0; i < data.length; i++) {
                        var list = "<li><a href='#' onclick='gotoSwxcDetail(this)'  id='" + data[i].swinputId + "'>描述:" + data[i].remarks + " 班次:" + data[i].banci + " 排查时间:" + data[i].pcTime + "</a></li>";
                        listView.append(list);
                    }

                    listView.listview('refresh');

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

                swxcScroll.refresh();

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

function gotoSwxcDetail(item) {
    var url = "http://10.1.168.51/YSNewSearch/SwView.aspx?Swid=" + item.id;
    window.location.href = url;
//    window.open(url);

    /* window.plugins.webintent.startActivity({
     action: "android.intent.action.VIEW",
     url: url},
     function () {
     },
     function () {
     alert('出错了！');
     }
     );*/
}
