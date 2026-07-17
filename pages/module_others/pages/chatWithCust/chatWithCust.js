// pages/shop_manage/pages/chatWithCust/chatWithCust.js
const app = getApp()
const at = require('../utils/wechat.format.atim.js')

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'


Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageIndex: 0,
        phone:'',
        nickname:'',
        tmp_nick_name:'',
        avatarUrl: defaultAvatarUrl,
        msgList: [],
        total_is_not_read_count:0,
        msgPageIndex: 0,
        hasNextMsgPage: true,
        isLoadingMsgPage: false,
        _pollTimer: null,
        _socketTask: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // console.log(app.globalData.shopid)
        //返回块Top
        // console.log(sis.statusBarHeight)
        //返回块高度
        // console.log(mbbc.height + (mbbc.top - sis.statusBarHeight) * 2)
        //底部栏高度
        // console.log(sis.screenHeight - sis.safeArea.bottom)
        let sis = wx.getSystemInfoSync()
        let mbbc = wx.getMenuButtonBoundingClientRect()
        this.setData({
            return_out_top: sis.statusBarHeight,
            return_out_height: (mbbc.height + (mbbc.top - sis.statusBarHeight) * 2),
            tabBarHeight: sis.screenHeight - sis.safeArea.bottom,
            swiperHeight: sis.safeArea.bottom - (sis.statusBarHeight + (mbbc.height + (mbbc.top - sis.statusBarHeight) * 2)) - 50,
            swiperTop: sis.statusBarHeight + (mbbc.height + (mbbc.top - sis.statusBarHeight) * 2)
        })
       
        this.initMsg();
        this.selectCustomerInfByOpenIdNew();
        this.connectWebSocket();
    },

    sortMsgListByLastTime(msgList) {
      return msgList.sort((a, b) => {
          const timeA = a.lstWechatMsgRecord && a.lstWechatMsgRecord.length > 0
              ? new Date(a.lstWechatMsgRecord[0].create_time.replace(' ', 'T')).getTime()
              : 0;
          const timeB = b.lstWechatMsgRecord && b.lstWechatMsgRecord.length > 0
              ? new Date(b.lstWechatMsgRecord[0].create_time.replace(' ', 'T')).getTime()
              : 0;
          return timeB - timeA;
      });
  },
    getTotalUnreadCount(msgList) {
        return msgList.reduce((total, msg) => {
            const records = msg.lstWechatMsgRecord || [];
            return total + (records.length > 0 ? (records[0].is_not_read_count || 0) : 0);
        }, 0);
    },
    formatMsgList(msgList) {
        msgList.forEach(msg => {
            const records = msg.lstWechatMsgRecord || [];
            if (records.length > 0) {
                msg.time = at.weChatTimeFormat(records[0].create_time);
            }
        });
        return msgList;
    },
    initMsg(silent) {
        this.loadMsgPage(1, true, silent);
    },
    loadNextMsgPage() {
        if (this.data.isLoadingMsgPage || !this.data.hasNextMsgPage) {
            return;
        }
        this.loadMsgPage(this.data.msgPageIndex + 1, false, true);
    },
    loadMsgPage(pageIndex, replace, silent) {
        if (this.data.isLoadingMsgPage || (!replace && !this.data.hasNextMsgPage)) {
            return;
        }
        const that = this;
        this.setData({ isLoadingMsgPage: true });
        if (replace && !silent) {
            wx.showLoading({ title: '请稍后' });
        }
        const shop_id = app.globalData.shopdetail.length > 0 ? app.globalData.shopdetail.shop_id : 0;
        const bind_person_id = app.globalData.customerInf.id;
        wx.request({
            url: app.globalData.selectWeChatMsgRecord_QGQC_Customer_Page,
            data: {
                shop_id,
                bind_person_id,
                page_index: pageIndex,
            },
            success: res => {
                console.log('会话列表分页接口响应:', res.data);
                if (res.data.code == 1000) {
                    const pageData = res.data.data || {};
                    const pageList = that.formatMsgList(Array.isArray(pageData.list) ? pageData.list : []);
                    const msgList = replace ? pageList : that.data.msgList.concat(pageList);
                    that.setData({
                        msgList,
                        total_is_not_read_count: that.getTotalUnreadCount(msgList),
                        msgPageIndex: pageData.page_index || pageIndex,
                        hasNextMsgPage: pageData.has_next === true,
                    });
                    if (!replace) {
                        console.log('会话列表分页结果:', pageData);
                        wx.showToast({ title: '分页加载成功', icon: 'success' });
                    }
                } else if (!silent) {
                    wx.showModal({ title: '提示', content: res.data.result || '分页接口请求失败', showCancel: false });
                }
            },
            fail: err => {
                console.error('会话列表分页接口请求失败:', err);
                if (!silent) {
                    wx.showModal({ title: '提示', content: '分页接口网络请求失败', showCancel: false });
                }
            },
            complete: () => {
                that.setData({ isLoadingMsgPage: false });
                if (replace && !silent) {
                    wx.hideLoading();
                }
            }
        });
    },
    selectWechatMsgRecord_Last(wechat_type,sender_id,receiver_id) {
        //获取最新的消息
        var that = this
        wx.request({
            url: app.globalData.selectWechatMsgRecord_Last,
            // url: 'http://localhost:8080/evaluation/selectWeChatMsgRecord_QGQC_Customer',23112123
            data: {
                wechat_type: wechat_type,
                sender_id: sender_id,
                receiver_id: receiver_id,
            },
            success: res => {
                if (res.data.code == 1000) {
                    if(res.data.data!=null&&res.data.data.length>0){
                   
                        var wechatMsgRecord=res.data.data[0];
                        var msgList=that.data.msgList;
                        var total_is_not_read_count=0;
                        for(var i=0;i<msgList.length;i++){
                            var oldItem=msgList[i];
                        
                            if(oldItem.customer_id==wechatMsgRecord.receiver_id||oldItem.customer_id==wechatMsgRecord.sender_id){
                                oldItem.lstWechatMsgRecord=res.data.data;
                                // 同步更新 time 字段，确保排序正确
                                if (res.data.data.length > 0) {
                                    oldItem.time = at.weChatTimeFormat(res.data.data[0].create_time);
                                }
                                console.log("oldItem:",oldItem);
                            }
                            if(oldItem.lstWechatMsgRecord.length!=0){
                                total_is_not_read_count=total_is_not_read_count+oldItem.lstWechatMsgRecord[0].is_not_read_count;
                            }
                        }

                        that.sortMsgListByLastTime(msgList);
                        console.log('123')
                        that.setData({
                            msgList:msgList,
                            total_is_not_read_count:total_is_not_read_count,
                        })
                        
                        
                    }
                }
            },
            fail: res => {
 
            }
        })
    },
    pageChangeEvent(e) {
        console.log(e)
        this.setData({
            pageIndex: e.currentTarget.dataset.current ? e.currentTarget.dataset.current : e.detail.current
        })
    },

    chatWithCustDetail(e) {
        // 点击进入会话时，立即清除该会话的未读红点（乐观更新）
        var item = e.currentTarget.dataset.item;
        var msgList = this.data.msgList;
        var total_is_not_read_count = this.data.total_is_not_read_count;
        for (var i = 0; i < msgList.length; i++) {
            if (msgList[i].customer_id == item.customer_id) {
                if (msgList[i].lstWechatMsgRecord && msgList[i].lstWechatMsgRecord.length > 0) {
                    var unreadCount = msgList[i].lstWechatMsgRecord[0].is_not_read_count || 0;
                    total_is_not_read_count -= unreadCount;
                    msgList[i].lstWechatMsgRecord[0].is_not_read_count = 0;
                }
                break;
            }
        }
        this.setData({
            msgList: msgList,
            total_is_not_read_count: Math.max(0, total_is_not_read_count),
        });
        wx.navigateTo({
            url: '../chatWithCustDetail/chatWithCustDetail?custInfo=' + JSON.stringify(item),
        })
    },

    returnBack() {
        wx.navigateBack({
            delta: 0,
        })
    },
    onChooseAvatar(e) {
        console.log(e)
        var that=this;

        const { avatarUrl } = e.detail 
        this.setData({
          avatarUrl,
        });
        that.upLoadAvatarUrl();



      },
      getPhoneNumber (e) {
        console.log(e);
        console.log(e.detail.code)
        var that = this
        wx.login({
        success: function (res) {
            if (res.code) {
            var code = res.code
            wx.request({
                url: app.globalData.allUrl.QGQCPhoneServlet,
                data: {
                code: code,
                encryptedData: e.detail.encryptedData,
                iv: e.detail.iv,
                wechatAppId: app.globalData.wechatAppId,
                },
                dataType:'json',
                header: {
                    //'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                    'content-type': 'application/json'
                  },
                method: 'POST',
                success: function (res) {

                console.log(res)
                if (res.errMsg == 'request:ok') {
                    if (res.data.code!=1000) {
                        wx.showModal({
                            title: '提示',
                            content: '请重试',
                            showCancel: false,
                            confirmText: '好的'
                        })
                        return;
                    }
                    that.setData({
                        phone: res.data.data.phoneNumber
                    })

                    var data={
                        openid: app.globalData.openid,
                        phone:res.data.data.phoneNumber
                    }
                    var url=app.globalData.updateCustomerPhoneByOpenId;
                    that.updateCustomerByOpenId(data,url);
    
                } else {
                    wx.showModal({
                    title: '错误',
                    content: '获取失败',
                    })
                }
                }
            })
            }
        }
        })

      },
      upLoadAvatarUrl(){
        //更改头像
        var that=this;
        var avatarUrl=this.data.avatarUrl;
        if(avatarUrl==''){
            return;
        }
        //先上传再修改
        wx.showLoading({
          title: '上传头像中',
        })
        wx.uploadFile({ //照片上传 
            url: app.globalData.UploadAliYunFile,
            filePath: avatarUrl,
            name: 'file',
            success(res) { //照片上传成功后再写库
            let result = JSON.parse(res.data);
            if (result.lst[0].success) {

                let avUrl = result.lst[0].url;
                console.log(avUrl);

                var data={
                    openid: app.globalData.openid,
                    avatarUrl:avUrl
                }
                var url=app.globalData.updateCustomerAvatarUrlByOpenId;
                that.updateCustomerByOpenId(data,url);

                // var data = {
                // avatarUrl: list,
                // name: that.data.nickName,
                // openId: app.globalData.openid,
                // }
                // wx.request({
                // url: app.globalData.UpdateCustomerByOpenId_Url,
                // data: JSON.stringify(data),
                // method: 'POST',
                // success: res => {
                //         that.setData({
                //         isShow: false
                //         },()=>{
                //         wx.setStorageSync('userInfoName', that.data.nickName)
                //         app.getCustomerInfo(app.globalData.openid)
                //         that.refreshAvatar()
                //         })
                //         wx.hideLoading();
                // }
                // })
            } else {
                wx.showModal({
                title: '提示',
                content: '网络异常，请重试',
                showCancel: false,
                })
                wx.hideLoading();
                return;
            }
            },
            fail: res => {
                wx.showModal({
                    title: '提示',
                    content: '网络异常，请重试',
                    showCancel: false,
                })
                wx.hideLoading();
                return;
            },
            complete:res=>{
                wx.hideLoading();
            }
        })

      },
      updateCustomerByOpenId(data,url){
         //avatarUrl  name phone  更新接口 
         var that =this;
         wx.showLoading("提交中");
            wx.request({
                //url: app.globalData.UpdateCustomerByOpenId_Url,
                url:url,
                data: data,
                method: 'POST',
                dataType:'json',
                success: res => {
                        console.log(res);
                        if(res.data.code==1000){
                            //成功
                            that.selectCustomerInfByOpenIdNew();
                            console.log("成功")
                        }else{
                            wx.showToast({
                              title: '失败'+res.data.result,
                            })
                        }
                        //获取头像等信息     
                },
                complete:res=>{
                    wx.hideLoading();
                }
            });

      },
      selectCustomerInfByOpenIdNew(){
        console.log("selectCustomerInfByOpenIdNew");
        var data={
            openid: app.globalData.openid,
        }
        var that=this;
            wx.request({
                //url: app.globalData.UpdateCustomerByOpenId_Url,
                url:app.globalData.selectCustomerInfByOpenIdNew,
                data: data,
                method: 'POST',
                dataType:'json',
                success: res => {
                        console.log(res);
                        if(res.data.code==1000){
                            //成功
                            console.log("成功")
                            var phone=res.data.data.phone;
                            var name =res.data.data.name;
                            var avatarUrl=res.data.data.avatarUrl;

                            if(phone&&phone.length>5){
                                that.setData({
                                    phone:phone,
                                })
                            }
                            if(name&&name.length>0){
                                that.setData({
                                    nickname:name,
                                })
                            }
                            if(avatarUrl&&avatarUrl.length>10){
                                that.setData({
                                    avatarUrl:avatarUrl,
                                })
                            }
                            

                        }else{
                            wx.showToast({
                              title: '失败'+res.data.result,
                            })
                        }
                        //获取头像等信息     
                },
                complete:res=>{
                 
                }
            });

      },
      getTmpNickNameValue(e){
        //获取输入框的值
        console.log("getTmpNickNameValue:")
        console.log(e.detail) 
        var value=e.detail.value;
        if(value){
            this.setData({
                tmp_nick_name:value,
            })

        }else{
            this.setData({
                tmp_nick_name:'',
            })
        }
      },
      saveNickName(e){

          var that=this;
          console.log(e)
          var tmp_nick_name=this.data.tmp_nick_name;
         
          if(tmp_nick_name){
            var data={
                openid: app.globalData.openid,
                name:tmp_nick_name
            }
            var url=app.globalData.updateCustomerNameByOpenId;
            that.updateCustomerByOpenId(data,url);
          }
      },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        // 每次页面显示时刷新会话列表
        this.initMsg();
        // 轮询已注释，改为 WebSocket 推送刷新
        // this._startPolling();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        // this._stopPolling();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        // this._stopPolling();
        if (this.data._socketTask) {
            this.data._socketTask.close({ code: 1000, reason: '页面退出' });
            this.data._socketTask = null;
        }
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
        // 下拉刷新：完整刷新（带 loading），刷新完成后停止下拉动画
        var that = this;
        this.initMsg();
        // initMsg 是异步的，简单延时后停止下拉动画
        setTimeout(function () {
            wx.stopPullDownRefresh();
        }, 1500);
    },

    connectWebSocket() {
        var that = this;
        var userId = app.globalData.customerInf.id;
        var socketTask = wx.connectSocket({
            url: 'wss://mb.fsmbdlkj.com/qiaoxin/ws/chat/' + userId,
            success: function() {
                console.log('chatWithCust WebSocket 连接请求成功');
            }
        });

        socketTask.onOpen(function() {
            console.log('进入乔信建立WebSocket, ws:/' + userId);
        });

        socketTask.onMessage(function(res) {
            try {
                var data = JSON.parse(res.data);
                if (data.code === 9999) return;
                // 刷新会话列表
                that.selectWechatMsgRecord_Last(data.wechat_type, data.sender_id, data.receiver_id);
                // 如果当前在聊天详情页，通知详情页刷新消息列表
                var pages = getCurrentPages();
                var curPage = pages[pages.length - 1];
                if (curPage && curPage.route && curPage.route.indexOf('chatWithCustDetail') >= 0) {
                    curPage.getNewData();
                    // 对方发来的消息才 toast 提示
                    if (data.sender_id !== app.globalData.customerInf.id) {
                        wx.showToast({ title: '收到新消息', icon: 'none', duration: 1500 });
                    }
                }
            } catch(e) {
                console.error('chatWithCust WebSocket 消息解析失败', e);
            }
        });

        socketTask.onClose(function() {
            console.log('chatWithCust WebSocket 已断开');
        });

        socketTask.onError(function(err) {
            console.error('chatWithCust WebSocket 错误', err);
        });

        this.data._socketTask = socketTask;
        app.globalData.chatSocketTask = socketTask;
    },

    /**
     * 启动轮询：每5秒静默刷新消息列表
     */
    _startPolling() {
        this._stopPolling();
        var that = this;
        this.data._pollTimer = setInterval(function () {
            that.initMsg(true); // 静默刷新，不显示 loading
        }, 5000);
    },

    /**
     * 停止轮询
     */
    _stopPolling() {
        if (this.data._pollTimer) {
            clearInterval(this.data._pollTimer);
            this.data._pollTimer = null;
        }
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {
        this.loadNextMsgPage();
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})
