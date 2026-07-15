// pages/module_discount/pages/superValueOrderDetail/superValueOrderDetail.js
const util = require('../../../../utils/util.js')
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    actionSheetHidden: false, //预约
    ListIndex: null, //选中行数
    startdate: '', //
    orderId: '', //订单id
    actionSheetHidden1: false, //核销
    packageIndex: 0,
    goods: '',
    showInquiry: false,
    remarkList: [],
    goodsRemark: '',
    scrollTop: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      orderId: options.orderId,
      packageIndex: options.packageIndex,
    })
    that.getOneTicket(options.orderId)
    let b = new Date(app.globalData.customerInf.birthday)
    let n = new Date()
    let age = n.getFullYear() - b.getFullYear() - ((n.getMonth() < b.getMonth() || n.getMonth() < b.getMonth() && n.getDay() < b.getDay()) ? 1 : 0) //生日计算 2-9 ATim
    let customerInf = app.globalData.customerInf
    customerInf.age = age
    that.setData({
      customerInf: customerInf,
      realName: customerInf.realName,
      gender: customerInf.gender,
      phone: customerInf.phone,
      age: customerInf.age,
      openId: app.globalData.openid,
      unionId: app.globalData.unionID,
    })
  },
  moreInf() { //更多信息
    console.log("打开套餐更多信息")
    var that = this
    var packageItem = that.data.ticketInfo
    if (that.data.packageIndex === '2') {
      wx.navigateTo({
        url: '../Package_details/Package_details?id=' + '0' + '&setMealID=' + packageItem.setmealid + '&ruleID=' + packageItem.ruleid + '&shop_id=' + packageItem.shopId + '&moreInf=false',
      })
    } else if (that.data.packageIndex === '3') {
      wx.navigateTo({
        url: '../Package_details/Package_details?id=1&coupon_id=' + packageItem.coupon_id + '&ruleID=' + packageItem.coupon_allrule + '&shop_id=' + packageItem.shop_id + '&moreInf=false',
      })
    }
    // else if(that.data.packageIndex === '4'){
    //   wx.navigateTo({
    //     url: '../../../module_others/pages/distributionBuy/distributionBuy?moreInf=false&uuid=' + packageItem.distribution[0].distributionUuid + '&shopId=' + packageItem.distribution[0].shopId,
    //   })
    // }

  },
  getOneTicket(orderId) { //根据orderId获取订单信息
    let that = this
    wx.request({
      //   url: 'http://192.168.8.18:8088/evaluation/selectTicketOrdersByOrderId',
      url: app.globalData.selectTicketOrdersByOrderId_url,
      data: {
        orderId: orderId,
      },
      success: res => {
        var a = res.data.ticketOrderinfo;
        // if(a.isGiveAway == 1 && !a.ministerTakesOrdersRecord){
        //   a.ministerTakesOrdersRecord = {a: 1};
        // }

        if (that.data.packageIndex === '2') {
          let s = a.ticketDetails[0].ticketInfo.timeforuse.split(";")
          that.setData({
            useTime: s,
            ordersList: a,
            orderCode: a.orderCode,
            orderTime: a.createDate,
            orderStatus: a.orderStatus,
            ticketInfo: a.ticketDetails[0].ticketInfo,
            orderTotal: a.orderTotal,
            showStatus: a.orderRefundStatus == '1' ? '退款中' : a.orderRefundStatus == '2' ? '已退款' : a.showStatus,
            ministerTakesOrdersRecord: a.ministerTakesOrdersRecord,
            orderDetail: a.ticketDetails[0].orderDetail,
            orderName: a.orderName,
          }, () => {
            that.getTicketRemarkList();
          })
        } else if (that.data.packageIndex === '3') {
          that.setData({
            ordersList: a,
            orderDetailList: a.ticketDetails[0].orderDetail,
            ticketInfo: a.ticketDetails[0].ticketInfo,
            is_prestore: a.ticketDetails[0].ticketInfo.is_prestore == 1
          }, () => {
            that.getTicketRemarkList();
            if (a.ticketDetails[0].ticketInfo.is_prestore == 1) {
              wx.request({
                url: app.globalData.getTicketWriteOffInfoByTicketDetailUuid,
                // url: 'http://192.168.8.18:8088/evaluation/getTicketWriteOffInfoByTicketDetailUuid',
                data: {
                  ticketDetailUuid: a.ticketDetails[0].orderDetail[0].uuid
                },
                method: 'GET',
                success: res => {
                  this.setData({
                    ticketWriteInfo: res.data.data
                    // ticketWriteInfo: res.data.data.reverse()
                  })
                }
              })

            }
          })

        }
        if (a.ticketDetails[0].ticketInfo.startUsing3 == "1") {
          wx.request({
            // url: 'http://localhost:8088/evaluation/selectOneApplyCombo',
            url: app.globalData.selectOneApplyCombo_url,
            data: {
              orderId: orderId
            },
            success: res => {
              console.log(res);
              let a = res.data.paramsList[0]
              that.setData({
                comboRealName: a.real_name,
                comboSex: a.sex == 1 ? "男" : "女",
                comboAge: a.age,
                comboPhone: a.phone,
                comboSetMealName: a.combo_name,
                comboPrice: a.combo_price,
                comboDinnerTime: a.dinner_time,
                comboCustomerRemark: a.customer_remark,
                comboReplyRemark: a.reply_remark,
              })
            }
          })
        }
        // else if(that.data.packageIndex === '4'){
        //   var a = res.data.ticketOrderinfo
        //   that.setData({
        //     ordersList: a ,
        //     orderDetailList: a.ticketDetails[0].orderDetail,
        //     ticketInfo: a.ticketDetails[0].ticketInfo,
        //   })
        // }
      },
      complete: res=>{
        wx.hideLoading({
          success: (res) => {},
        })
      }
    })
  },
  startTimeChange: function (e) { //选择时间日期
    var that = this
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      starttime: e.detail.value
    })
  },
  modalChange1: function (e) { //预约遮罩层
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden,
      ListIndex: null,
    })
  },
  startDateChange: function (e) { //选择开始日期
    var that = this
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      startdate: e.detail.value
    })
  },
  subscribe: function (e) { //预约点击时间
    var that = this
    console.log(e);
    var index = e.currentTarget.dataset.index
    that.setData({
      ListIndex: index,
      startdate: '',
      starttime: ''
    })
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
    })
  },
  gosubscribe: function (e) { //确定预约
    var that = this
    // 再通过setData更改Page()里面的data，动态更新页面的数据
    var time = util.formatTime(new Date());
    var index = that.data.index
    let a = that.data.ListIndex
    var item = that.data.ordersList
    var appointment_time = that.data.startdate + ' ' + that.data.starttime + ':00'
    if (!that.data.startdate || !that.data.starttime || appointment_time < time) {
      wx.showToast({
        title: '预约时间不正确',
        icon: 'error',
        duration: 2000
      })
    } else {
      that.setData({
        actionSheetHidden: !that.data.actionSheetHidden,
        ListIndex: null,
      })
      wx.request({
        url: app.globalData.SelectAppointment_url,
        // url: 'http://localhost:8088/evaluation/selectAppointment',
        data: {
          "appointmentTime": that.data.startdate,
          "ticketId": item.ticketDetails[0].orderDetail[a].ticketId
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.appointmentNum >= item.ticketDetails[0].ticketInfo.dailysales && item.ticketDetails[0].ticketInfo.dailysales != 0) { //修改
            wx.showModal({
              title: '提示',
              content: '　对不起，您预约的订单当天已约满，不能预约了，请预约其他时间，谢谢！',
              showCancel: false,
            })
          } else {
            wx.request({
              url: app.globalData.UpdateTicketOrderDetailed_url,
              // url: 'http://localhost:8087/WX Restaurant/UpdateTicketOrderDetailed',
              data: {
                "uuid": item.ticketDetails[0].orderDetail[a].uuid,
                "ticket_status": "0",
                "appointment": "1",
                "appointment_time": appointment_time
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
              },
              method: 'POST',
              success: function (res) {
                wx.request({
                  url: app.globalData.updateTicketOrderNewStatus,
                  data: {
                    orderId: item.orderId,
                    status: 3
                  },
                  success: res => { }
                })
                wx.showModal({
                  title: '提示',
                  content: '提交成功!请注意查看\n订单是否预约成功',
                  showCancel: false,
                  success: function (res) {
                    //TODO 刷新
                    that.getOneTicket(item.ticketDetails[0].orderDetail[a].orderId)
                  }
                })

              }
            })
            var o_id = item[index].orderId
            wx.request({
              url: app.globalData.taocan.UpdateTicketOrderInfo_url,
              // url: 'https://test.fsmbdlkj.com/WX Restaurant/UpdateTicketOrderInfo',
              data: {
                "order_id": o_id,
                "telephone": that.data.tel
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
              },
              method: 'POST',
              success: function (res) {
                console.log(res)
              }
            })
          }
        }
      })
    }

  },
  refresh() { //刷新
    let that = this
    wx.showLoading({
      title: '请稍后',
    })
    that.getOneTicket(that.data.orderId);
    that.getTicketRemarkList();
  },

  checkGetCode(e) {
    let that = this;
    let isgive = e.currentTarget.dataset.isgive
    var a = e.currentTarget.dataset.index

    if (isgive == 1) {
      wx.showModal({
        title: '提示',
        content: '已赠送，是否要核销?',
        success: res => {
          if (res.confirm) {
            that.getcode(a)
          }
        }
      })
    } else {
      that.getcode(a)
    }
  },

  getcode: function (data) { //核销码
    var that = this;
    var item = that.data.ordersList
    var a = data
    if (that.data.packageIndex == 2) {
      if (that.data.ticketInfo.appointment == 1) {
        if (that.data.orderDetail[a].appointmentOnShop != 1) {
          that.setData({
            isNeed: true
          })
        }
      }
    }
    that.setData({
      ListIndex: a,
    })
    var path = "pages/index/index?id=" + item.ticketDetails[0].orderDetail[a].uuid + '&order_id=' + item.orderId + '&shop_id=' + item.shopId + '&packageIndex=' + that.data.packageIndex
    wx.request({
      url: app.globalData.GetTicketCode_url,
      data: {
        path: path
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      success: function (res) {
        var url = res.data.object
        that.setData({
          codeImage: app.globalData.QRCodeVersion == 'release' ? url : url.replace("mb.fsmbdlkj.com", "test.fsmbdlkj.com"),
          actionSheetHidden1: !that.data.actionSheetHidden1,
          hexiaoShop: item.shopName,
          hexiaoName: item.orderName,
          hexiaoTime: item.createDate,
          hexiaoNum: item.detailedCount,
          hexiaoType: item.ticketDetails[0].ticketInfo.dishesUnit,
          hexiaoMoney: item.orderTotal * 0.01,
          hexiaoOldMomey: item.ticketDetails[0].ticketInfo.originalprice
        })
      }
    })
  },

  modalChange1: function (e) {
    var that = this;
    that.setData({
      actionSheetHidden1: false,
      ListIndex: null,
    })
    var codeImage = that.data.codeImage
    codeImage = codeImage.split('fsmbdlkj.com/')[1]
    console.log(codeImage)

    wx.request({
      url: app.globalData.ClearFile_url,
      data: {
        pageUrl: codeImage
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        that.refresh()
      }
    })
  },
  modalChange() {
    this.setData({
      actionSheetHidden: false,
      ListIndex: null
    })
  },
  
 
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  showInquiry(e) {
    let that = this;
    let item = e.currentTarget.dataset.item;
    that.setData({
      goods: item,
      showInquiry: true
    })

  },

  cancelInquiry() {
    this.setData({
      goods: '',
      showInquiry: false
    })
  },

  remarkInput(e) {
    let that = this;
    that.setData({
      goodsRemark: e.detail.value
    })
  },

  //发送反馈信息
  send() {
    let that = this;
    if (!that.data.goodsRemark) {
      return;
    }

    let data = {
      shopId: that.data.ordersList.shopId,
      ticketOrderInfoId: that.data.ordersList.orderId,
      remarkType: 0,
      customerUnionid: app.globalData.unionID,
      goodsRemark: that.data.goodsRemark
    }

    wx.request({
      url: app.globalData.addTicketRemark,
      method: 'POST',
      data: JSON.stringify(data),
      success: res => {
        if (res.data.code == 1) {
          that.setData({
            goodsRemark: ''
          })
          that.getTicketRemarkList();
        } else {
          wx.showToast({
            title: '发送失败!',
            icon: 'error'
          })
        }
      }
    })
  },

  getTicketRemarkList() {
    let that = this;
    wx.request({
      url: app.globalData.getTicketRemarkList,
      data: {
        shopId: that.data.ordersList.shopId,
        orderId: that.data.ordersList.orderId,
      },
      success: res => {
        if (res.data.code == 1) {
          that.setData({
            remarkList: res.data.data
          }, () => {
            let query = wx.createSelectorQuery().in(that);
            query.select('.message-box-list').boundingClientRect(res => {
              this.setData({
                scrollTop: res.height > 300 ? res.height : 0
              })
            })
            query.exec(res => { })
          })
        }
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
    var goods = e.target.dataset.item
    var that = this;
    var title = '';
    var imgUrl = '';

    that.setData({
      showInquiry: false,
      goods: ''
    })

    wx.request({
      //   url: 'http://192.168.8.18:8088/evaluation/updateTicketDetailIsGive',
      url: app.globalData.updateTicketDetailIsGive,
      data: {
        uid: goods.uuid,
      },
      success: res => {
        that.getOneTicket(goods.orderId);
      }
    })

    if (that.data.packageIndex == 2) {
      title = that.data.orderName;
      imgUrl = that.data.ticketInfo.minpageurl;
    } else {
      let a = ''
      if (goods.detail_code) {
        a = '\n订单号:' + goods.detail_code
      }
      title = that.data.ordersList.orderName + a;
      imgUrl = 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/coupon_give.png';
    }

    let shareObj = {
      title: title,
      path: '',
      imageUrl: imgUrl,
      //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        if (res.errMsg == 'shareAppMessage:ok') {
          that.hide();
        }
      },
      fail: function () {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          that.hide();
        } else if (res.errMsg == 'shareAppMessage:fail') {
          that.hide();
        }
      },
    };

    if (that.data.ticketInfo.price) {
      price = that.data.ticketInfo.price
    } else if (that.data.ticketInfo.coupon_original) {
      price = that.data.ticketInfo.coupon_original
    }

    var price = that.data.ordersList.orderTotal / that.data.ordersList.detailedCount
    var shopid = that.data.ticketInfo.shopId ? that.data.ticketInfo.shopId : that.data.ticketInfo.shop_id

    shareObj.path = '/pages/module_discount/pages/orderList/orderList?isFromGiver=true&giverOpenId=' + app.globalData.openid
      + '&uuid=' + goods.uuid + '&orderId=' + goods.orderId + '&goodsPrice=' + price + '&detailCode=' + (goods.detail_code ? goods.detail_code : '') + '&shopId=' + shopid + '&userId=' + that.data.ordersList.userId + '&packageIndex=' + that.data.packageIndex + '&orderNewStatus=' + (that.data.ordersList.orderNewStatus == 1 ? 1 : 2);
    console.log(shareObj.path, "地址");
    return shareObj;
  }
})