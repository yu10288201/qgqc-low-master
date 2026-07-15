// pages/module_discount/pages/refund/refund.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CauseList: [
      "买错了", "后悔了,不想买了", "预约不上", "商家停业/装修",
      "之前去过了", "评价不好", "购买其他同类商品", "误认为是外卖", "没看清使用规则", "计划有变", "其他"
    ],
    refund_total: 100,
    refund_account: 1
  },
  checkboxChange(e) {
    var that = this
    var refundReason = ''
    var temp = 0
    for (var x of e.detail.value) {
      if (temp == e.detail.value.length - 1) {
        refundReason = refundReason + x
      } else {
        refundReason = refundReason + x + ','
      }
      temp++
    }
    that.setData({
      refundReason: refundReason
    })
  },
  AddPayMentRefund: function (e) {
    var that = this
    if (that.data.refundReason == '' || that.data.refundReason == undefined) {
      wx.showToast({
        title: '未选择退款原因',
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: app.globalData.AddPayMentRefund,
        // url: 'https://test.fsmbdlkj.com/WX Restaurant/AddPayMentRefund',
        method: 'GET',
        data: {
          order_type: that.data.order_type,
          order_id: that.data.orderId,
          refundReason: that.data.refundReason,
          refund_total: that.data.refund_total,
          refund_account: that.data.refund_account
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
          if (res.data.result.result == 1) {
            wx.request({
              url: app.globalData.updateTicketOrderNewStatus,
              data: {
                orderId: that.data.orderId,
                status: 6
              },
              success: res=>{}
            })
            that.UpdateTicketOrderInfo()
          } else {
            wx.showToast({
              title: '信息不完整',
              icon: 'success',
              duration: 3000
            })
            console.log("fail")
            wx.hideLoading()
          }
        }
      })
    }
  },
  UpdateTicketOrderInfo: function (e) {
    var that = this
    wx.request({
      // url: 'http://192.168.8.8:8086/WX Restaurant/UpdateTicketOrderInfo',
      url: app.globalData.taocan.UpdateTicketOrderInfo_url,
      method: 'GET',
      data: {
        order_id: that.data.orderId,
        order_status: that.data.orderInf.orderStatus,
        order_remark: that.data.orderInf.orderRemark,
        order_total: that.data.orderInf.orderTotal,
        detailed_count: that.data.orderInf.detailedCount,
        order_refund: that.data.orderInf.orderRefund,
        order_refund_status: 1,
        telephone: that.data.orderInf.telephone
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        if (res.data.result.result == 1) {
          // wx.navigateTo({
          //   url: '../refundDetails/refundDetails?orderCode=' + that.data.orderCode + '&orderTotal=' + that.data.orderTotal + '&shopName=' + that.data.shopName + '&orderName=' + that.data.orderName+'&order_type=' + that.data.order_type+'&orderId=' + that.data.orderId,
          // })
          wx.redirectTo({
            url: '/pages/module_discount/pages/refund_detail/refund_detail?orderCode=' + that.data.orderCode + '&orderTotal=' + that.data.orderTotal + '&shopName=' + that.data.shopName + '&orderName=' + that.data.orderName + '&order_type=' + that.data.order_type + '&orderId=' + that.data.orderId,
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: '信息不完整',
            icon: 'success',
            duration: 3000
          })
          console.log("fail")
          wx.hideLoading()
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.id == 0) {
      var order_type = 2
    } else {
      var order_type = 1
    }
    that.setData({
      orderCode: options.orderCode,
      orderName: options.orderName,
      orderTotal: options.orderTotal,
      shopName: options.shopName,
      order_type: order_type,
      orderId: options.orderId,
      orderInf: JSON.parse(options.orderInf)
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})