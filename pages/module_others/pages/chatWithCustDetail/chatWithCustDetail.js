// pages/shop_manage/pages/chatWithCustDetail/chatWithCustDetail.js
const recorder = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    keyboardType: true,
    keyboardDownClass: 'keyboardNormal',
    keyboardUp: false,
    utilUp: false,
    utilDownClass: 'utilDownNormal',
    cameraBack: true,
    msg: '',
    pageId: 'page_0',
    pageIndex: 1,
    pageSize: 20,
    recordList: [],
    scrollLoading: 0,
    scrollTops: 0,
    startTimestamp:0,
    isLoading:true,//是否正在加载
    isOldLoading:false,//正在获取旧资料
    isNewLoading:false,//正在获取新资料
    isAnchoring: false, // 是否正在执行scroll-into-view锚定，锚定期间屏蔽手动滚动干扰
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    var that=this;
    this.setData({
      custInfo: JSON.parse(options.custInfo),
      customerInf: app.globalData.customerInf
    })
    let sis = wx.getSystemInfoSync()
    let mbbc = wx.getMenuButtonBoundingClientRect()
    this.setData({
      return_out_top: sis.statusBarHeight,
      return_out_height: (mbbc.height + (mbbc.top - sis.statusBarHeight) * 2),
      tabBarHeight: sis.screenHeight - sis.safeArea.bottom,
      pageHeight: sis.safeArea.bottom - (sis.statusBarHeight + (mbbc.height + (mbbc.top - sis.statusBarHeight) * 2)) - 50,
      pageTop: sis.statusBarHeight + (mbbc.height + (mbbc.top - sis.statusBarHeight) * 2)
    })
    that.getOldData();
    //事件监听
    recorder.onStart(() => {
        console.info('开始录音');
        wx.showLoading({
            title: '录音中...',
          })

      });
      recorder.onPause(() => {
        console.info('暂停录音');
      });
      //结束获取录取文件
      recorder.onStop((res) => {
        console.info('停止录音');
        wx.hideLoading();
        console.info(res); //可以看到录音文件

        //let duration = res.duration;
        var duration=(Date.now() - this.data.startTimestamp)/1000;
        if(duration < 2) {
          wx.showToast({
            title: '录音时间太短!',
            icon: 'none',
            duration: 1500
          })
          return;
        }
        
        if(res&&res.tempFilePath){
            var tempFilePath=res.tempFilePath;
            that.uploadAudio(tempFilePath,duration);
        }
      });

  },
  scroll(e) {
    // 记录当前滚动位置
    this._scrollTop = e.detail.scrollTop;
  },
  getOldData(){
    var that=this;
    var isOldLoading=this.data.isOldLoading;
    if(isOldLoading==true){
        // 如果已经在加载中，重置 scrollLoading 避免死锁
        that.setData({ scrollLoading: 0 });
        return;
    }
    //max_id=0 传入服务器后，则会自动设置max_id为int的最大值。
    var max_id=0;
    var recordList = that.data.recordList;
    console.log(recordList,'recordlist')
    if(recordList&&recordList.length>0){
        var last_index=0;
        max_id=recordList[0].id;
    }else{
        recordList=[];
    }
    that.setData({
        isOldLoading:true,
    })
    wx.request({
        url: app.globalData.selectWechatMsgRecord_StaffToCustomer_Old,
      //   url: 'http://localhost:8080/evaluation/selectWechatMsgRecord_StaffToCustomer_Old',
        data: {
          max_id: max_id,
          page_size: that.data.pageSize,
          customer_id: app.globalData.customerInf.id,
          shop_id: app.globalData.shopdetail.length > 0 ? app.globalData.shopdetail.shop_id : 0,
          staff_id: that.data.custInfo.customer_id,
        },
        success: res => {
            console.log(res,'res')
          if (res.data.code == 1000) {
            var  resList = res.data.data
            console.log('===== recordList 完整消息列表 =====', JSON.parse(JSON.stringify(resList)));
            console.log('===== res 完整响应 =====', JSON.parse(JSON.stringify(res.data)));

            if(resList&&resList.length>0){
                var newList=resList.concat(recordList);
                var current_page_id="page_"+resList[resList.length-1].id;
                // 先设置数据，再在回调中更新 pageId 和加载状态
                // 关键修复：不再定时清空 pageId，避免 scroll-into-view 被移除时滚动条跳动
                that.setData({
                    recordList: newList,
                }, () => {
                  setTimeout(function(){
                      that.setData({
                          pageId: current_page_id,
                          isOldLoading: false,
                          scrollLoading: 0,
                          isAnchoring: true, // 标记锚定中，scroll 事件会追踪用户是否离开锚点
                      })
                      that._anchorTargetTop = undefined; // 锚点目标位置未知，由 scroll 事件自然追踪
                  }, 300)
                })
                that.chatWithCust_Last(3,that.data.custInfo.customer_id,app.globalData.customerInf.id)
            }else{
                // 没有更多历史数据，锚到顶部占位元素
                setTimeout(function(){
                    that.setData({
                        pageId: "s2",
                        isOldLoading: false,
                        scrollLoading: 0,
                        isAnchoring: true,
                    })
                    that._anchorTargetTop = undefined;
                }, 300)
            }
          } else {
            that.setData({
                isOldLoading: false,
                scrollLoading: 0,
            })
            wx.showModal({
              title: '提示',
              content: '异常'+res.data.result,
              showCancel: false,
            })
          }
        },
        fail: res => {
            that.setData({
                isOldLoading:false,
                scrollLoading: 0,
            })
            wx.showModal({
                title: '提示',
                content: '网络异常',
                showCancel: false,
            })
        }
      })
  },
  getNewData(){
    var that=this;
    //max_id=0 传入服务器后，则会自动设置max_id为int的最大值。
    var min_id=0;
    var recordList = that.data.recordList;
    if(recordList&&recordList.length>0){
        var last_index=recordList.length-1;
        min_id=recordList[last_index].id;
    }else{
        recordList=[];
    }
    wx.request({
        url: app.globalData.selectWechatMsgRecord_StaffToCustomer_New,
      //   url: 'http://localhost:8080/evaluation/selectWechatMsgRecord_StaffToCustomer_Old',
        data: {
          min_id: min_id,
          page_size: that.data.pageSize,
          customer_id: app.globalData.customerInf.id,
          shop_id: app.globalData.shopdetail.length > 0 ? app.globalData.shopdetail.shop_id : 0,
          staff_id: that.data.custInfo.customer_id,
        },
        success: res => {
          if (res.data.code == 1000) {
            var  resList = res.data.data
            if(resList&&resList.length>0){
                var newList=recordList.concat(resList);
                that.setData({
                    recordList: newList,
                })
                var current_page_id="page_"+resList[resList.length-1].id;
                setTimeout(function(){
                    that.setData({
                        pageId: current_page_id,
                        isAnchoring: true,
                    })
                    that._anchorTargetTop = undefined;
                  },300)
            }
            that.chatWithCust_Last(3,that.data.custInfo.customer_id,app.globalData.customerInf.id)
          } else {
            wx.showModal({
              title: '提示',
              content: '异常'+res.data.result,
              showCancel: false,
            })
          }
        },
        fail: res => {
            that.setData({
                isOldLoading:false,
            })
            wx.showModal({
                title: '提示',
                content: '网络异常',
                showCancel: false,
            })
            that.setData({
                scrollLoading: 0,
            })
        }
      })
  },
  scrollToUpper:function(e){
    console.log("scroll-view 拉取到最顶部")
    var that=this;
    // 防抖：如果正在加载旧数据，忽略重复触发
    if (that.data.isOldLoading || that.data.scrollLoading == 1) {
      console.log("正在加载中，忽略重复触发");
      return;
    }
    that.setData({ scrollLoading: 1 });
    this.getOldData();
  },
  // 发送
  addSendRecord(e) {
    let that = this
    let msg = e.detail.value
    if (!msg) {
      return
    }
    that.sendMsgExec(1,msg);
  },
  btnSendRecord(e) {
    let that = this
    var msg=this.data.msg;
    if (!msg) {
      return
    }
    that.sendMsgExec(1,msg);
    return;
  },
  sendMsgExec(msg_type,msg,duration){
    var that=this;
    var wechat_type=3;
    var shop_id=that.data.custInfo.shopId ? that.data.custInfo.shop_id : app.globalData.shopdetail.length > 0 ? app.globalData.shopdetail.shop_id :  0;
    var sender_id=app.globalData.customerInf.id;
    var receiver_id=that.data.custInfo.customer_id;
    //msg_type 消息类型 1-文字 2-图片 3-语音 4-视频
    //msg 消息内容
    //wechat_type 聊天类型： 1-店员->客户 2-客户->店员 3-客户->客户
    var data={
      shop_id: shop_id,
      msg_type: msg_type,
      duration:duration,
      msg: msg,
      wechat_type: wechat_type,
      sender_id: sender_id,
      receiver_id: receiver_id,
    };
    wx.showLoading({
      title: '发送中',
    })
    wx.request({
      url: app.globalData.insertWechatMsgRecord,
      // url: 'http://localhost:8080/evaluation/insertWechatMsgRecord',
      method: 'POST',
      data: data,
      success: res => {
        wx.hideLoading();
        that.getNewData();
        if (res.data.code == 1000) {
            if(msg_type==1){
                that.setData(
                    {
                        msg:'',
                    }
                )
            }
            that.sendRabbitMqMsg(wechat_type,shop_id,sender_id,receiver_id);
        
        } else {
          wx.showModal({
            title: '提示',
            content: '发送失败',
            showCancel: false
          })
          
        }
      },
      fail: res => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '发送失败',
          showCancel: false
        })
        
      }
    })
  },
  sendRabbitMqMsg(wechat_type,shop_id,sender_id,receiver_id){

    var that=this;
    //var wechat_type=3;

    //var shop_id=that.data.custInfo.shopId ? that.data.custInfo.shop_id : app.globalData.shopdetail.length > 0 ? app.globalData.shopdetail.shop_id :  0;
    //var sender_id=app.globalData.customerInf.id;
    //var receiver_id=that.data.custInfo.customer_id;
 
    var msgObj={
        data:{
            msg:{
                type: "wechat",
                tg: "wechat",
                shop_id: shop_id,
                wechat_type: wechat_type,
                sender_id: sender_id,
                receiver_id: receiver_id,
            }
        }
    }

    var msgJson=JSON.stringify(msgObj);
    var data={
        task_queue_names:app.globalData.hj + "_qgqc_" + receiver_id,
        msg:msgJson,
    }
    wx.request({
      url: app.globalData.SendRabbitMqMsg,
      method: 'POST',
      data: data,
      success: res => {
        console.log(res)
      },
      fail: res => {
       
      }
    })
  },
  changeKeyboardType() {
    this.setData({
      keyboardType: !this.data.keyboardType
    })
  },
  recordStart(e) {
    console.log(e)
    this.data.startTimestamp = Date.now();
    const options = {
        duration: 600000,//指定录音的时长，单位 ms，最大为10分钟（600000），默认为1分钟（60000）
        sampleRate: 16000,//采样率
        numberOfChannels: 1,//录音通道数
        encodeBitRate: 96000,//编码码率
        format: 'mp3',//音频格式，有效值 aac/mp3
        frameSize: 50,//指定帧大小，单位 KB
      }
    recorder.start(options);
  
  },
  recordEnd(e) {
      
    recorder.stop();
    
  },
  getKeyboardHeight(e) {
    if (this.data.keyboardUp || e.detail.height == 0) return
    console.log(e)
    // wx.showToast({
    //   title: e.detail.height,
    // })
    this.setData({
      keyboardHeight: e.detail.height,
    }, () => {
      this.setData({
        keyboardUp: true,
        utilUp: false,
        keyboardDownClass: 'keyboardDown'
      })

    })
  },

  showKeyboardDown(e) {
    console.log("showKeyboardDown")
    console.log(e)
    this.setData({
      keyboardUp: false,
      keyboardHeight: this.data.utilUp ? '200' : this.data.keyboardHeight,
      utilUp: this.data.utilUp ? true : false,
      utilDownClass: 'utilDown',
      keyboardDownClass: 'keyboardDown'
    })
  },
  utilChange(e) {
    console.log(e)
    this.setData({
      utilUp: !this.data.utilUp,
      keyboardHeight: this.data.utilUp ? '200' : '',
      utilDownClass: 'utilDown',
      keyboardDownClass: 'keyboardDown'
    })
  },

  returnBack() {
    wx.navigateBack({
      delta: 0,
    })
  },

  chooseMedia(e) {
    let that=this;
    let image = e.currentTarget.dataset.id == 0
    wx.chooseMedia({
      count: 1,
      mediaType: image ? ['image'] : ['video'],
      sourceType: ['album', 'camera'],
      maxDuration: 30,
      camera: 'back',
      success: res => {

        console.log(res);
       
        if(res.tempFiles){
          if(res.tempFiles.length==0){
              console.log("选择了0个文件")
          }else{
            var filePath=res.tempFiles[0].tempFilePath;

            console.log(res.tempFiles[0].tempFilePath);
            console.log(res.tempFiles[0].size);
            if(image){
              //图片上传
              that.uploadImage(filePath);
            }else{
              //视频上传
              that.uploadVideo(filePath);
            }
          }
        }
        console.log(res.tempFiles.tempFilePath)
        console.log(res.tempFiles.size)


      }
    })
  },
  uploadImage(filePath) {
    let that = this
      wx.uploadFile({
        filePath: filePath,
        name: 'file',
        url: app.globalData.UploadFile,
        formData: {
          oldUrl: '',
        },
        success: res => {
          console.log(res);
          let a = JSON.parse(res.data);
          if(a.object){
            if(a.object.length>10){
              that.sendMsgExec(2,a.object,0);
            }
          }
        },
      })
    
  },
  uploadVideo(filePath, isImage) {
    let that = this
      wx.uploadFile({
        filePath: filePath,
        name: 'file',
        url: app.globalData.UploadFile,
        formData: {
          oldUrl: '',
        },
        success: res => {
          let a = JSON.parse(res.data);
          if(a.object){
            if(a.object.length>10){
              that.sendMsgExec(4,a.object,0);
            }
          }          
        },
      })
    
  },
  uploadAudio(filePath,duration) {
    let that = this
      wx.uploadFile({
        filePath: filePath,
        name: 'file',
        url: app.globalData.UploadFile,
        formData: {
          oldUrl: '',
        },
        success: res => {
          let a = JSON.parse(res.data);
          if(a.object){
            if(a.object.length>10){
              that.sendMsgExec(3,a.object,duration);
            }
          }          
        },
      })
    
  },
  showBigPhoto: function (e) {
    console.log(e);
    var arry = []
    var img = e.currentTarget.dataset.bigimage
    img = img.replace('\r\n', '').trim()
    arry.push(img)
    wx.previewImage({
      urls: arry,
      success: function (res) {}
    })
  },
  playAudio:function(e){
      console.log("playAudio")
      console.log(e)
      var item=e.target.dataset.item;
      console.log(item)

      if(item&&item.msg){
        innerAudioContext.autoplay = true
        innerAudioContext.src = item.msg,
          innerAudioContext.onPlay(() => {
            console.log('开始播放')
          })
        innerAudioContext.onError((res) => {
          console.log(res.errMsg)
          console.log(res.errCode)
        })
      }
  },
  chatWithCust_Last(wechat_type,sender_id,receiver_id){
    try {
        console.log("chatWithCust_Last");
        let pages = getCurrentPages(); //获取当前界面的所有信息
        console.log(pages);
        
        if(pages.length<2){
          return;
        }
        console.log("chatWithCust_Last1");
        let prePage = pages[pages.length - 2];
      
   
        console.log("chatWithCust_Last2");

        //订单详情界面必须有这个函数
       
        //确保是订单详情界面的路径
        if(prePage){
            if(prePage.route){
                if(prePage.route.indexOf('pages/chatWithCust/chatWithCust')>=0){
                  console.log("查找到聊天列表界面")

                  prePage.selectWechatMsgRecord_Last(wechat_type,sender_id,receiver_id);
                }
            }
        }
       
       

    } catch (error) {
        console.log("chatWithCustDetail_GetNewMsg err");
        console.log(error)
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

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})