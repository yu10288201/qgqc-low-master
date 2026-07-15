// pages/store/store.js
const app = getApp(); //引入全局变量
var util = require('../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  pay:function(){
    var that = this;
    // var object 
    wx.request({
      url: "https://test.fsmbdlkj.com/WX Restaurant/AllinPay",
      // url: "http://192.168.1.9:8080/AllinPay",
      data:  {
        "trxamt": 1,  //价格(单位:分)
        "paytype": 'W06', //支付方式(固定)
        "body": '测试接口', //订单标题
        "remark": '第一次测试', //备注
        'acct': 'oX7vm1YmPvyuOsj05Pss4GIRKFUQ', //用户的openID
        "notify_url": 'https://test.fsmbdlkj.com/WX Restaurant/AdviceOfPaymentByAllinPay', //交易结果通知地址
        // 'cusid':'56058805812ZVTM',//通联商户号(乔氏1)appid:00186804
        // "SYB_APPID":'00187079',//商家SYB_APPID，从数据库拿(乔氏)
        'cusid':'5615880581255G1',//通联商户号
        "SYB_APPID":'00190062',//商家SYB_APPID，
        "limit_pay": 'no_credit' ,//支付限制,  no_credit--指定不能使用信用卡支付
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var list  = JSON.parse(res.data[0].payinfo)
        console.log(list)
        wx.requestPayment({ //微信支付
          'timeStamp': list.timeStamp,
          'nonceStr': list.nonceStr,
          'package': list.package,
          'signType': list.signType,
          'paySign': list.paySign,
          'success': function (res) {
            console.log(res)
            //这里是支付成功的方法,写一个延时跳转和支付成功的弹窗
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            })
            console.log("success pay result:  " + res)

          },
          'fail': function (res) {
            console.log(res)

          }
        })
      }
    })
  },
  coupon:function(){
    var that = this;
    wx.request({
      // url: "https://test.fsmbdlkj.com/WX Restaurant/AllinPay",
      // url: "http://192.168.1.9:8080/AllinPay",
      url: "https://test.fsmbdlkj.com/foodMaterial_war/Servlet/SelectCouponServlet",
      data: {
        shop_id : -1
      },
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
      }
    })
  },
  setmeal:function(){
    var that = this;
    wx.request({
      // url: "https://test.fsmbdlkj.com/WX Restaurant/AllinPay",
      // url: "http://192.168.1.9:8080/AllinPay",
      url: "https://test.fsmbdlkj.com/diancanxing/setMeal/selectSetmealForNum",
      data: '{}',
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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