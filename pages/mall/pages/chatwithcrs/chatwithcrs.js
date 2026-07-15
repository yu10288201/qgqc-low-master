
const recorder = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    current_pay_audio_id:0,
    is_recording:false,
    custInfo:null,//客人信息
    insert_customer:1,
    staffInfo:null,
    keyboardHeight:0,
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
    def_avatar_url:'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

    // console.log(JSON.parse(options.custInfo))
    var that=this;
    this.setData({
      custInfo: JSON.parse(options.custInfo),
      staffInfo: JSON.parse(options.staffInfo)
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
    that.initRecordAuthorize();
    //事件监听
    recorder.onStart(() => {
        console.info('开始录音');
          that.setData({
            is_recording:true,
          })
      });
      recorder.onPause(() => {
        console.info('暂停录音');
      });
      //结束获取录取文件
      recorder.onStop((res) => {
        console.info('停止录音');
        that.setData({
          is_recording:false,
        })
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
    console.log("scroll")
    console.log(e)
    return;
  },
  getOldData(){

    var that=this;
    var isOldLoading=this.data.isOldLoading;
    if(isOldLoading==true){
        return;
    }
    //max_id=0 传入服务器后，则会自动设置max_id为int的最大值。
    var last_max_id=0;
    var recordList = that.data.recordList;
    if(recordList&&recordList.length>0){
        var last_index=0;
        last_max_id=recordList[0].id;
    }else{
        recordList=[];
    }
    that.setData({
        isOldLoading:true,
    })
    wx.request({
        url: app.globalData.selectMallCsrMsgRecord_Old,
        //url: 'http://localhost:8080/evaluation_war/mall/selectMallCsrMsgRecord_Old',
        method: 'POST',
        data: {
          last_max_id: last_max_id,
          page_size: that.data.pageSize,
          customer_id: app.globalData.customerInf.id,
          shop_id: this.data.custInfo.shop_id,
          is_current_customer:1,
          is_read:1,
        },
        success: res => {
            that.setData({
                isOldLoading:false,
            })
            console.log(res);
          if (res.data.code == 1000) {
            var  resList = res.data.data
            if(resList&&resList.length>0){
                var newList=resList.concat(recordList);
                that.setData({
                    recordList: newList,
                })
                var current_page_id="page_"+resList[resList.length-1].id;
                setTimeout(function(){
                    that.setData({
                        pageId:current_page_id,
                      })
                  },300)
                  that.chatWithCust_Last(3,that.data.custInfo.customer_id,app.globalData.customerInf.id)
            }else{
                setTimeout(function(){
                    that.setData({
                        pageId:"s2",
                      })
                  },300)
            }
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
  getNewData(){

    console.log("getNewData")
    var that=this;
    
    //max_id=0 传入服务器后，则会自动设置max_id为int的最大值。
    var last_max_id=0;
    var recordList = that.data.recordList;
    if(recordList&&recordList.length>0){
        var last_index=recordList.length-1;
        last_max_id=recordList[last_index].id;
    }else{
        recordList=[];
    }
    wx.request({
         url: app.globalData.selectMallCsrMsgRecord_New,
        //url: 'http://localhost:8080/evaluation_war/mall/selectMallCsrMsgRecord_New',
        data: {
          last_max_id: last_max_id,
          page_size: that.data.pageSize,
          customer_id: app.globalData.customerInf.id,
          shop_id: that.data.custInfo.shop_id,
          is_current_customer:1,
          is_read:1,
        },
        method:'POST',
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
                        pageId:current_page_id,
                      })
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
    //到达顶部后，向下滚动10px,使视图可以再次滚动
    var that=this;
    this.getOldData();
    // setTimeout(function(){
    //     that.setData({
    //         pageId:"s2",
    //       })
    //   },800)

    
    
    // this.setData({
    //   scrollTopPos:2000,
    // })
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

    var wechat_type=2;

    var shop_id=that.data.custInfo.shop_id;
    var sender_id=app.globalData.customerInf.id;
    var receiver_id=0;
    var insert_customer=this.data.insert_customer;

    //msg_type 消息类型 1-文字 2-图片 3-语音 4-视频
    //msg 消息内容
    //wechat_type 聊天类型： 1-店员->客户 2-客户->店员

    var data={
      shop_id: shop_id,
      msg_type: msg_type,
      duration:duration,
      msg: msg,
      wechat_type: wechat_type,
      sender_id: sender_id,
      receiver_id: receiver_id,
      insert_customer:insert_customer,
    };
    wx.showLoading({
      title: '发送中',
    })
    wx.request({
      url: app.globalData.insertMallCsrMsgRecord,
      //url: 'http://localhost:8080/evaluation_war/mall/insertMallCsrMsgRecord',
      method: 'POST',
      data: data,
      success: res => {
        wx.hideLoading();
        that.getNewData();
        if (res.data.code == 1000) {
          that.setData({
            insert_customer:0,
          })
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
    //receiver_id=383;
    //var wechat_type=3;

    //var shop_id=that.data.custInfo.shopId ? that.data.custInfo.shop_id : app.globalData.shopdetail.length > 0 ? app.globalData.shopdetail.shop_id :  0;
    //var sender_id=app.globalData.customerInf.id;
    //var receiver_id=that.data.custInfo.customer_id;
 
    var msgObj={
        data:{
            msg:{
                type: "mall_csr_msg_record",
                tg: "mall_csr_msg_record",
                shop_id: shop_id,
                wechat_type: wechat_type,
                sender_id: sender_id,
                receiver_id: receiver_id,
            }
        }
    }

    var task_queue_names='';
    var staffInfo=this.data.staffInfo;
    for(var i=0;i<staffInfo.lstStorepersonnal.length;i++){
      var csr=staffInfo.lstStorepersonnal[i];
      if(task_queue_names==''){
        task_queue_names=app.globalData.hj +'_'+csr.shop_id+ "_sszg_" + csr.id;
      }else{
        task_queue_names +=(","+app.globalData.hj +'_'+csr.shop_id+ "_sszg_" + csr.id);
      }
    }
    var msgJson=JSON.stringify(msgObj);
    var data={
        task_queue_names:task_queue_names,
        msg:msgJson,
    }
    wx.request({
      url: app.globalData.SendRabbitMqMsgWithExchange,
      method: 'POST',
      data: data,
      success: res => {
        console.log(res)
      },
      fail: res => {
       
      }
    })
  },
  // sendRabbitMqMsg(wechat_type,shop_id,sender_id,receiver_id){

  //   var that=this;

  //   var msgObj={
  //       data:{
  //           msg:{
  //               type: "mall_csr_msg_record",
  //               tg: "mall_csr_msg_record",
  //               shop_id: shop_id,
  //               wechat_type: wechat_type,
  //               sender_id: sender_id,
  //               receiver_id: receiver_id,
  //           }
  //       }
  //   }

  //   var task_queue_names='';
  //   var staffInfo=this.data.staffInfo;
  //   for(var i=0;i<staffInfo.lstStorepersonnal.length;i++){
  //     var csr=staffInfo.lstStorepersonnal[i];
  //     if(task_queue_names==''){
  //       task_queue_names=app.globalData.hj +'_'+csr.shop_id+ "_sszg_" + csr.id;
  //     }else{
  //       task_queue_names +=(","+app.globalData.hj +'_'+csr.shop_id+ "_sszg_" + csr.id);
  //     }
  //   }
  //   var msgJson=JSON.stringify(msgObj);
  //   var data={
  //       task_queue_names:task_queue_names,
  //       msg:msgJson,
  //   }
  //   wx.request({
  //     //url: app.globalData.SendRabbitMqMsgWithExchange,
  //     url:app.globalData.SendRabbitMqMsg,
  //     method: 'POST',
  //     data: data,
  //     success: res => {
  //       console.log(res)
  //     },
  //     fail: res => {
       
  //     }
  //   })


  // },

  changeKeyboardType() {
    this.setData({
      keyboardType: !this.data.keyboardType
    })
  },
  initRecordAuthorize(){
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success () {
              // 用户已经同意小程序使用录音功能，后续调用 wx.startRecord 接口不会弹窗询问
              
            },
            fail:function(res){
                var msg=res.errMsg;
                wx.showModal({
                  title: '初始化话筒',
                  content: msg,
                  complete: (res) => {
                    if (res.confirm) {
                      
                    }
                  }
                })
    
            }
          })
        }
      },
      fail:function(res){
        var msg=JSON.stringify(res);
        wx.showToast({
          title: '异常2:'+msg,
          icon:'error'
        })
      },
    })   
  },
  recordStart(e) {
    console.log("recordStart")
    var that=this;
      // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.record']) {
            wx.openSetting({
            });
          }else{
            that.recordStartExec();
          }
        },
        fail:function(res){
          var msg=JSON.stringify(res);
          wx.showToast({
            title: '异常:'+msg,
            icon:'error'
          })
        },
      })   
  },
  recordStartExec(e) {
    try{
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
    }catch(e){
        wx.showToast({
          title: '录音异常',
          icon:'error'
        })
    }
  },
  recordEnd(e) {
      try{
        recorder.stop();
      }catch(e){
        wx.showToast({
          title: '录音结束异常',
          icon:'error'
        })
      }
    
    
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

    // this.setData({
    //   keyboardUp: false,
    //   keyboardHeight: this.data.utilUp ? '200' : this.data.keyboardHeight,
    //   utilUp: this.data.utilUp ? true : false,
    //   utilDownClass: 'utilDown',
    //   keyboardDownClass: 'keyboardDown'
    // })

    if(this.data.keyboardUp||this.data.utilUp){
      this.setData({
        keyboardDownClass: 'keyboardDown',
        utilDownClass: 'utilDown',
      })
    }
    
    this.setData({
      keyboardUp: false,
      utilUp:false,
      keyboardHeight: '0',
      
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
          that.setData({
            utilUp: !this.data.utilUp,
          })
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
    var that=this;
    try{
      console.log("playAudio")
      console.log(e)
      var item=e.currentTarget.dataset.item;
    
      var current_pay_audio_id=item.id;
      console.log(item)

      if(item&&item.msg){
        innerAudioContext.autoplay = false;

    
        that.setData({
          current_pay_audio_id:current_pay_audio_id,
        })

        innerAudioContext.src = item.msg,
          innerAudioContext.onPlay(() => {
            
            console.log('开始播放')
          })
          innerAudioContext.onError((res) => {
            that.setData({
              current_pay_audio_id:0,
            })
            console.log(res.errMsg)
            console.log(res.errCode)
          })
          innerAudioContext.onStop((res) => {
            that.setData({
              current_pay_audio_id:0,
            })
            console.log("停止播放")
          })
          innerAudioContext.onEnded((res) => {
            console.log("结束播放")
            that.setData({
              current_pay_audio_id:0,
            })
          })
          innerAudioContext.play();

      }
    }catch(e){
      that.setData({
        current_pay_audio_id:0,
      })
        wx.showToast({
          title: '播放异常',
          icon:'error'
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

  },
  msgChange(e){
      this.setData({
        msg:e.detail.value,
      });
  },
})