/**
 * Created by Administrator on 14-1-7.
 */
var yhScroll, swScroll, rjScroll,
    pageNo = 1, pageSize = 15,
    yhTypeId, swTypeId, rjTypeId;

var loading = false;

var serverPath = "http://10.1.168.50:8080/DataService/";

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
        timeout: 10000,
        jsonpCallback: "baseInfo",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var list = "<li><a onclick='gotoYh(this)' id='" + data[i].infoid + "'>" + data[i].infoname + "</a></li>";
                listView.append(list);
            }
            listView.listview('refresh');
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

// 得到三违的基础信息
function getSwBaseInfo() {
    var listView = $('#listview2');
    listView.empty();
    $.ajax({
        url: serverPath + "baseInfo/102",
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "baseInfo",
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                var list = "<li><a onclick='gotoSw(this)' id='" + data[i].infoid + "'>" + data[i].infoname + "</a></li>";
                listView.append(list);
            }
            listView.listview('refresh');
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

// 得到入井的基础信息
function getRjBaseInfo() {
    var listView = $('#listview3');
    listView.empty();
    var list = "<li><a href='#' onclick='gotoRj(this)' id='1'>正常</a></li>";
    listView.append(list);
    list = "<li><a href='#' onclick='gotoRj(this)' id='2'>带班</a></li>";
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
    if (loading == false) {
        loading = true;
        pageNo = 1;
        var start = (pageNo - 1) * pageSize;
        var limit = pageSize;

        $.ajax({
            url: serverPath + "yhinput/typeId/" + typeId + "/start/" + start + "/limit/" + limit,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "yhInfo",
            success: function (data) {
                if (data != null && data.length > 0) {
                    listView.empty();

                    for (var i = 0; i < data.length; i++) {
                        var list = "<li><a href='#' onclick='gotoYhDetail(this)'  id='" + data[i].yhputinid + "'>级别:" + data[i].levelname + " 单位:" + data[i].maindeptname + data[i].zrdeptname + " 时间:" + data[i].pctime + "</a></li>";
                        listView.append(list);
                    }

                    listView.listview('refresh');

                    // 销毁下拉刷新插件
                    if (yhScroll) {
                        yhScroll.destroy();
                        yhScroll = null;
                    }

                    loadYhScroll();
                } else {
                    $().toastmessage('showToast', {
                        text: '没有数据！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'warning'
                    });
                }

                loading = false;

            },
            error: function () {
                $().toastmessage('showToast', {
                    text: '访问服务器错误！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'error'
                });
                loading = false;
            }
        });
    }

}

function gotoYhDetail(item) {
    $.mobile.changePage("#yhDetail");
    $.ajax({
        url: serverPath + "yhinput/" + item.id,
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "yhDetail",
        success: function (data) {
            if (data != null) {
                $("#yhputinid").html(data.yhputinid);
                $("#typename").html(data.typename);
                $("#levelname").html(data.levelname);
                $("#banci").html(data.banci);
                $("#intime").html(data.intime);
                $("#status").html(data.status);
                $("#jctypeDesc").html(data.jctypeDesc);
                $("#remarks").html(data.remarks);
                $("#xqdate").html(data.xqdate);
                $("#xqbanci").html(data.xqbanci);
                $("#maindeptname").html(data.maindeptname);
                $("#zrdeptname").html(data.zrdeptname);
                $("#zrpername").html(data.zrpername);
                $("#placename").html(data.placename);
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

// 从后台取得三违的第一页信息
function getFirstSwInfo(listView, typeId) {
    if (loading == false) {
        loading = true;

        pageNo = 1;
        var start = (pageNo - 1) * pageSize;
        var limit = pageSize;

        $.ajax({
            url: serverPath + "swinput/typeId/" + typeId + "/start/" + start + "/limit/" + limit,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "swInfo",
            success: function (data) {
                if (data != null && data.length > 0) {
                    listView.empty();

                    for (var i = 0; i < data.length; i++) {
                        var list = "<li><a href='#' onclick='gotoSwDetail(this)' id='" + data[i].swinputid + "'>级别:" + data[i].levelname + " 单位:" + data[i].maindeptname + data[i].zrkqname + " 时间:" + data[i].pctime + "</a></li>";
                        listView.append(list);
                    }

                    listView.listview('refresh');

                    // 销毁下拉刷新插件
                    if (swScroll) {
                        swScroll.destroy();
                        swScroll = null;
                    }
                    //加载下拉刷新插件
                    /*  setTimeout(function () {
                     loadSwScroll()
                     }, 200);*/
                    loadSwScroll();
                } else {
                    $().toastmessage('showToast', {
                        text: '没有数据！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'warning'
                    });
                }

                loading = false;

            },
            error: function () {
                $().toastmessage('showToast', {
                    text: '访问服务器错误！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'error'
                });
                loading = false;
            }
        });
    }

}

function gotoSwDetail(item) {
    $.mobile.changePage("#swDetail");

    $.ajax({
        url: serverPath + "swinput/" + item.id,
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "swDetail",
        success: function (data) {
            if (data != null) {
                $("#swinputid").html(data.swinputid);
                $("#swtypename").html(data.typename);
                $("#zyname").html(data.zyname);
                $("#swlevelname").html(data.levelname);
                $("#swbanci").html(data.banci);
                $("#swpctime").html(data.pctime);
                $("#pcpname").html(data.pcpname);
                $("#pcpnameNow").html(data.pcpnameNow);
                $("#swstatus").html(data.status);
                $("#swjctypeDesc").html(data.jctypeDesc);
                $("#islearn").html(data.islearn);
                $("#swremarks").html(data.remarks);
                $("#swmaindeptname").html(data.maindeptname);
                $("#zrkqname").html(data.zrkqname);
                $("#swpname").html(data.swpname);
                $("#swplacename").html(data.placename);
                $("#swcontent").html(data.content);
                $("#isfine").html(data.isfine);
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

// 从后台取得入井记录的第一页信息
function getFirstRjInfo(listView, typeId) {
    if (loading == false) {
        loading = true;
        pageNo = 1;
        var start = (pageNo - 1) * pageSize;
        var limit = pageSize;

        $.ajax({
            url: serverPath + "kqRecord/typeId/" + typeId + "/start/" + start + "/limit/" + limit,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "rjInfo",
            success: function (data) {
                if (data != null && data.length > 0) {

                    listView.empty();

                    for (var i = 0; i < data.length; i++) {
                        var list = "<li><a href='#' onclick='gotoRjDetail(this)' id='" + data[i].rjid + "'>姓名:" + data[i].kqpname + " 时间:" + data[i].kqtime + " 单位:" + data[i].deptDesc + "</a></li>";
                        listView.append(list);
                    }

                    listView.listview('refresh');

                    // 销毁下拉刷新插件
                    if (rjScroll) {
                        rjScroll.destroy();
                        rjScroll = null;
                    }
                    //加载下拉刷新插件
                    /* setTimeout(function () {
                     loadRjScroll()
                     }, 200);*/
                    loadRjScroll();
                } else {
                    $().toastmessage('showToast', {
                        text: '没有数据！',
                        sticky: false,
                        position: 'middle-center',
                        type: 'warning'
                    });
                }

                loading = false;

            },
            error: function () {
                $().toastmessage('showToast', {
                    text: '访问服务器错误！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'error'
                });
                loading = false;
            }
        });
    }

}

function gotoRjDetail(item) {
    $.mobile.changePage("#rjDetail");

    $.ajax({
        url: serverPath + "kqRecord/" + item.id,
        dataType: "jsonp",
        type: "post",
        timeout: 10000,
        jsonpCallback: "rjDetail",
        success: function (data) {
            if (data != null) {
                $("#rjid").html(data.rjid);
                $("#kqpnumber").html(data.kqpnumber);
                $("#kqpname").html(data.kqpname);
                $("#kqtypeDesc").html(data.kqtypeDesc);
                $("#datafromDesc").html(data.datafromDesc);
                $("#kqtime").html(data.kqtime);
                $("#kqdept").html(data.deptDesc);
                $("#kqbenci").html(data.kqbenci);
                $("#downtime").html(data.downtime);
                $("#uptime").html(data.uptime);
                $("#worktime").html(data.worktime);
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

//隐患下拉事件, 取得最新的数据
function yhPullDownAction() {
    var listView = $("#yhListview");
//    listView.empty();

    getFirstYhInfo(listView, yhTypeId);
}

//三违下拉事件, 取得最新的数据
function swPullDownAction() {
    var listView = $("#swListview");
//    listView.empty();

    getFirstSwInfo(listView, swTypeId);
}

//入井记录下拉事件, 取得最新的数据
function rjPullDownAction() {
    var listView = $("#rjListview");
//    listView.empty();

    getFirstRjInfo(listView, rjTypeId);
}


//隐患上拉事件, 分页
function yhPullUpAction() {
    if (loading == false) {
        loading = true;
        pageNo++;
        var listView = $("#yhListview");

        var start = (pageNo - 1) * 15;
        var limit = pageSize;
        $.ajax({
            url: serverPath + "yhinput/typeId/" + yhTypeId + "/start/" + start + "/limit/" + limit,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "yhInfo",
            success: function (data) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var list = "<li><a href='#' onclick='gotoYhDetail(this)' id='" + data[i].yhputinid + "'>级别:" + data[i].levelname + " 单位:" + data[i].maindeptname + data[i].zrdeptname + " 时间:" + data[i].pctime + "</a></li>";
                        listView.append(list);
                    }
                }

                listView.listview('refresh');
                yhScroll.refresh();

                loading = false;
            },
            error: function () {
                $().toastmessage('showToast', {
                    text: '访问服务器错误！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'error'
                });
                loading = false;
            }
        });
    }

}

//三违上拉事件, 分页
function swPullUpAction() {
    if (loading == false) {
        loading = true;
        pageNo++;
        var listView = $("#swListview");

        var start = (pageNo - 1) * 15;
        var limit = pageSize;
        $.ajax({
            url: serverPath + "swinput/typeId/" + swTypeId + "/start/" + start + "/limit/" + limit,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "swInfo",
            success: function (data) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var list = "<li><a href='#' onclick='gotoSwDetail(this)' id='" + data[i].swinputid + "'>级别:" + data[i].levelname + " 单位:" + data[i].maindeptname + data[i].zrkqname + " 时间:" + data[i].pctime + "</a></li>";
                        listView.append(list);
                    }
                }

                listView.listview('refresh');
                swScroll.refresh();

                loading = false;
            },
            error: function () {
                $().toastmessage('showToast', {
                    text: '访问服务器错误！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'error'
                });
                loading = false;
            }
        });
    }

}

//入井记录上拉事件, 分页
function rjPullUpAction() {
    if (loading == false) {
        loading = true;
        pageNo++;
        var listView = $("#rjListview");

        var start = (pageNo - 1) * 15;
        var limit = pageSize;
        $.ajax({
            url: serverPath + "kqRecord/typeId/" + rjTypeId + "/start/" + start + "/limit/" + limit,
            dataType: "jsonp",
            type: "post",
            timeout: 10000,
            jsonpCallback: "rjInfo",
            success: function (data) {
                if (data.length > 0) {
                    for (var i = 0; i < data.length; i++) {
                        var list = "<li><a href='#' onclick='gotoRjDetail(this)' id='" + data[i].rjid + "'>姓名:" + data[i].kqpname + " 时间:" + data[i].kqtime + " 单位:" + data[i].deptDesc + "</a></li>";
                        listView.append(list);
                    }
                }

                listView.listview('refresh');
                rjScroll.refresh();

                loading = false;
            },
            error: function () {
                $().toastmessage('showToast', {
                    text: '访问服务器错误！',
                    sticky: false,
                    position: 'middle-center',
                    type: 'error'
                });
                loading = false;
            }
        });
    }

}

function loadYhScroll() {
    var pullDownEl = document.getElementById('yhPullDown');
    var pullDownOffset = pullDownEl.offsetHeight;
    var pullUpEl = document.getElementById('yhPullUp');
    var pullUpOffset = pullUpEl.offsetHeight;
//    alert("pullDownOffset = " + pullDownOffset + ", pullUpOffset = " + pullUpOffset);

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
