/**
 * Created by Administrator on 14-1-7.
 */
var yhScroll, swScroll, rjScroll,
    pageNo = 1, pageSize = 15,
    yhTypeId, swTypeId, rjTypeId;

var serverPath = "http://192.168.1.105:8080/DataService/";

// 初始化安全隐患页面
function initAqyh() {
    // 延迟200ms执行, 否则界面没有渲染完成, 取不到listview1
    setTimeout(function () {
        getYhBaseInfo()
    }, 200);
}

// 得到隐患的基础信息
function getYhBaseInfo() {
    var listView = $('#listview1');
    listView.empty();
    $.ajax({
        url: serverPath + "baseInfo/1",
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "baseInfo",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var list = "<li><a href='#' onclick='gotoYh(this)' id='" + data[i].infoid + "'>" + data[i].infoname + "</a></li>";
                listView.append(list);
            }
            listView.listview('refresh');
        },
        error: function () {
            alert("error");
        }
    });
}

// 得到三违的基础信息
function getSwBaseInfo() {
    var listView = $('#listview2');
    listView.empty();
    $.ajax({
        url: serverPath + "baseInfo/102",
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "baseInfo",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var list = "<li><a href='#' onclick='gotoSw(this)' id='" + data[i].infoid + "'>" + data[i].infoname + "</a></li>";
                listView.append(list);
            }
            listView.listview('refresh');
        },
        error: function () {
            alert("error");
        }
    });
}

// 得到入井的基础信息
function getRjBaseInfo() {
    var listView = $('#listview3');
    listView.empty();
    var list = "<li><a href='#' onclick='gotoRj(this)' id='1'>正常</a></li>";
    listView.append(list);
    list = "<li><a href='#' onclick='gotoRj(this)' id='2'>代班</a></li>";
    listView.append(list);

    // 延迟刷新
    setTimeout(function () {
        listView.listview('refresh');
    }, 200);

}

// 进入隐患页面
function gotoYh(item) {
    $.mobile.changePage("#yh");
    var listView = $("#yhListview");
    if (yhTypeId != item.id) {
        listView.empty();
        yhTypeId = item.id;
    }
    var li = listView.html().trim();
    if (li == null || li == "") {
        // 如果listView中没有数据, 从后台加载第一页的数据
        getFirstYhInfo(listView, yhTypeId);
    }
}

// 进入三违页面
function gotoSw(item) {
    $.mobile.changePage("#sw");

    var listView = $("#swListview");
    if (swTypeId != item.id) {
        listView.empty();
        swTypeId = item.id;
    }
    var li = listView.html().trim();
    if (li == null || li == "") {
        // 如果listView中没有数据, 从后台加载第一页的数据
        getFirstSwInfo(listView, swTypeId);
    }
}

// 进入入井记录页面
function gotoRj(item) {
    $.mobile.changePage("#rj");

    var listView = $("#rjListview");
    if (rjTypeId != item.id) {
        listView.empty();
        rjTypeId = item.id;
    }
    var li = listView.html().trim();
    if (li == null || li == "") {
        // 如果listView中没有数据, 从后台加载第一页的数据
        getFirstRjInfo(listView, rjTypeId);
    }
}

// 从后台取得隐患的第一页信息
function getFirstYhInfo(listView, typeId) {
    pageNo = 1;
    var start = (pageNo - 1) * pageSize;
    var limit = pageSize;

    $.ajax({
        url: serverPath + "yhinput/typeId/" + typeId + "/start/" + start + "/limit/" + limit,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "yhInfo",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var list = "<li><a href='#'>id:" + data[i].yhputinid + " 班次:" + data[i].banci + " 排查时间:" + data[i].intime + "</a></li>";
                listView.append(list);
            }

            listView.listview('refresh');

            // 销毁下拉刷新插件
            if (yhScroll) {
                yhScroll.destroy();
                yhScroll = null;
            }
            //加载下拉刷新插件
            loadYhScroll();

        },
        error: function () {
            alert("error");
        }
    });
}

// 从后台取得三违的第一页信息
function getFirstSwInfo(listView, typeId) {
    pageNo = 1;
    var start = (pageNo - 1) * pageSize;
    var limit = pageSize;

    $.ajax({
        url: serverPath + "swinput/typeId/" + typeId + "/start/" + start + "/limit/" + limit,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "swInfo",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var list = "<li><a href='#'>id:" + data[i].swinputid + " 班次:" + data[i].banci + " 录入时间:" + data[i].intime + "</a></li>";
                listView.append(list);
            }

            listView.listview('refresh');

            // 销毁下拉刷新插件
            if (swScroll) {
                swScroll.destroy();
                swScroll = null;
            }
            //加载下拉刷新插件
            loadSwScroll();

        },
        error: function () {
            alert("error");
        }
    });
}

// 从后台取得入井记录的第一页信息
function getFirstRjInfo(listView, typeId) {
    pageNo = 1;
    var start = (pageNo - 1) * pageSize;
    var limit = pageSize;

    $.ajax({
        url: serverPath + "kqRecord/typeId/" + typeId + "/start/" + start + "/limit/" + limit,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "rjInfo",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var list = "<li><a href='#'>id:" + data[i].rjid + " 姓名:" + data[i].kqpname + " 班次:" + data[i].kqbenci + " 数据来源:" + data[i].datafromDesc + "</a></li>";
                listView.append(list);
            }

            listView.listview('refresh');

            // 销毁下拉刷新插件
            if (rjScroll) {
                rjScroll.destroy();
                rjScroll = null;
            }
            //加载下拉刷新插件
            loadRjScroll();

        },
        error: function () {
            alert("error");
        }
    });
}

//隐患下拉事件, 取得最新的数据
function yhPullDownAction() {
    var listView = $("#yhListview");
    listView.empty();

    getFirstYhInfo(listView, yhTypeId);
}

//三违下拉事件, 取得最新的数据
function swPullDownAction() {
    var listView = $("#swListview");
    listView.empty();

    getFirstSwInfo(listView, swTypeId);
}

//入井记录下拉事件, 取得最新的数据
function rjPullDownAction() {
    var listView = $("#rjListview");
    listView.empty();

    getFirstRjInfo(listView, rjTypeId);
}


//隐患上拉事件, 分页
function yhPullUpAction() {
    pageNo++;
    var listView = $("#yhListview");

    var start = (pageNo - 1) * 15;
    var limit = pageSize;
    $.ajax({
        url: serverPath + "yhinput/typeId/" + yhTypeId + "/start/" + start + "/limit/" + limit,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "yhInfo",
        success: function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var list = "<li><a href='#'>id:" + data[i].yhputinid + " 班次:" + data[i].banci + " 排查时间:" + data[i].intime + "</a></li>";
                    listView.append(list);
                }
            }

            listView.listview('refresh');
            yhScroll.refresh();
        },
        error: function () {
            alert("error");
        }
    });
}

//三违上拉事件, 分页
function swPullUpAction() {
    pageNo++;
    var listView = $("#swListview");

    var start = (pageNo - 1) * 15;
    var limit = pageSize;
    $.ajax({
        url: serverPath + "swinput/typeId/" + swTypeId + "/start/" + start + "/limit/" + limit,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "swInfo",
        success: function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var list = "<li><a href='#'>id:" + data[i].swinputid + " 班次:" + data[i].banci + " 录入时间:" + data[i].intime + "</a></li>";
                    listView.append(list);
                }
            }

            listView.listview('refresh');
            swScroll.refresh();
        },
        error: function () {
            alert("error");
        }
    });
}

//入境记录上拉事件, 分页
function rjPullUpAction() {
    pageNo++;
    var listView = $("#rjListview");

    var start = (pageNo - 1) * 15;
    var limit = pageSize;
    $.ajax({
        url: serverPath + "kqRecord/typeId/" + rjTypeId + "/start/" + start + "/limit/" + limit,
        dataType: "jsonp",
        type: "post",
        jsonpCallback: "rjInfo",
        success: function (data) {
            if (data.length > 0) {
                for (var i = 0; i < data.length; i++) {
                    var list = "<li><a href='#'>id:" + data[i].rjid + " 姓名:" + data[i].kqpname + " 班次:" + data[i].kqbenci + " 数据来源:" + data[i].datafromDesc + "</a></li>";
                    listView.append(list);
                }
            }

            listView.listview('refresh');
            rjScroll.refresh();
        },
        error: function () {
            alert("error");
        }
    });
}

function loadYhScroll() {
    var pullDownEl = document.getElementById('yhPullDown');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('yhPullUp');
    var pullUpOffset = pullUpEl.offsetHeight;

    yhScroll = new iScroll('yhWrapper', {
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
                yhPullDownAction();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                yhPullUpAction();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('yhWrapper').style.left = '0';
    }, 800);
}

function loadSwScroll() {
    var pullDownEl = document.getElementById('swPullDown');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('swPullUp');
    var pullUpOffset = pullUpEl.offsetHeight;

    swScroll = new iScroll('swWrapper', {
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
                swPullDownAction();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                swPullUpAction();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('swWrapper').style.left = '0';
    }, 800);
}

function loadRjScroll() {
    var pullDownEl = document.getElementById('rjPullDown');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('rjPullUp');
    var pullUpOffset = pullUpEl.offsetHeight;

    rjScroll = new iScroll('rjWrapper', {
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
                rjPullDownAction();	// Execute custom function (ajax call?)
            } else if (pullUpEl.className.match('flip')) {
                pullUpEl.className = 'loading';
                pullUpEl.querySelector('.pullUpLabel').innerHTML = '加载中...';
                rjPullUpAction();	// Execute custom function (ajax call?)
            }
        }
    });


    setTimeout(function () {
        document.getElementById('rjWrapper').style.left = '0';
    }, 800);
}
