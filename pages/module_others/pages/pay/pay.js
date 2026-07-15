// pages/pay/pay.js
const app = getApp()
var util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    key: 'foshanshimengbengdianlikeji00000',
    order_code: '',
    total_amount: '',
    order_id: '',
    shop_id: '',
    shop_name: '',
    imgUrls: [
      'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/1.png',
      'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/2.png',
      'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/3.png',
    ],
    use_balance: 0,//用户要使用的余额
    use_coin: 0,//用户要使用的星盾
    index: 0,
    customer_id: '',
  },

  pay2: function () {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(app.globalData.wechatAppId)
          console.log(app.globalData.wsk)
          console.log(res.code)
          wx.request({ //调用后台 api，使用 code 换取 openid 和 session_key 
            // url: 'https://wx.fsmbdlkj.com/WeChat applet/Server',
            url: app.globalData.GetUserOpenid_url,
            data: {
              Appid: app.globalData.wechatAppId,
              // Secret: app.globalData.wsk,
              js_code: res.code
            },
            success: function (res) {
              console.log('返回值：', res.data)
              // console.log(res.object.openid)
              console.log({
                //公众号appid
                appid: app.globalData.appid,
                //商户号
                mch_id: app.globalData.mch_id,
                //小程序sub_appid
                sub_appid: app.globalData.wechatAppId,
                //子商户号
                sub_mch_id: app.globalData.shopdetail.sub_merchants_id ? app.globalData.shopdetail.sub_merchants_id : '1615440524',
                body: '中国',
                out_trade_no: that.data.order_code,//订单号
                total_fee: Number(that.data.total_amount) * 100,//支付金额(单位分)
                trade_type: 'JSAPI',
                openid: res.data.object.openid
              })

              if (that.data.payment_address == 1) {
                //公户支付
                console.log('公户支付')
                wx.request({
                  url: app.globalData.allUrl.wxPayPlusService,
                  method: "GET",
                  data: {
                    //公众号appid
                    appid: app.globalData.appid,
                    //商户号
                    mch_id: app.globalData.mch_id,
                    //小程序sub_appid
                    sub_appid: app.globalData.wechatAppId,
                    //子商户号
                    // sub_mch_id: app.globalData.shopdetail.sub_merchants_id,
                    sub_mch_id: app.globalData.shopdetail.sub_merchants_id ? app.globalData.shopdetail.sub_merchants_id : '1615440524',
                    body: '中国',
                    out_trade_no: that.data.order_code,//订单号
                    // total_fee: Number(that.data.total_amount) * 100,//支付金额(单位分)
                    total_fee: 1,//支付金额(单位分)
                    trade_type: 'JSAPI',
                    openid: res.data.object.openid
                  },
                  success: function (res) {

                    console.log(res)
                    console.log(res.data[0].package)
                    wx.requestPayment({
                      'timeStamp': res.data[0].timeStamp,
                      'nonceStr': res.data[0].nonceStr,
                      'package': res.data[0].package,
                      'signType': res.data[0].signType,
                      'paySign': res.data[0].sign,
                      'success': function (res) {
                        that.pay_success();
                        console.log("success pay result:  " + res)
                      },
                      'fail': function (res) {
                        console.log(res)
                      }
                    }) //微信支付
                  }
                })
              } else {
                //私户支付
                console.log('私户支付')
                wx.request({
                  url: app.globalData.AllinPay_url,
                  data: {
                    // "trxamt": Number(that.data.total_amount) * 100,  //价格(单位:分)
                    "trxamt": 1,  //价格(单位:分)
                    "paytype": 'W06', //支付方式(固定)
                    "body": '测试接口', //订单标题
                    "remark": '第一次测试', //备注
                    'acct': res.data.object.openid, //用户的openID
                    "notify_url": 'https://test.fsmbdlkj.com/WX Restaurant/AdviceOfPaymentByAllinPay', //交易结果通知地址
                    'cusid': app.globalData.cusid,//通联商户号,这个需要在数据库获取
                    "SYB_APPID": app.globalData.SYB_APPID,//商家SYB_APPID，这个需要在数据库获取
                    "limit_pay": 'no_credit',//支付限制,  no_credit--指定不能使用信用卡支付
                  },
                  header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                  },
                  method: 'POST',
                  success: function (res) {
                    console.log(res)
                    var list = JSON.parse(res.data[0].payinfo)
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
                        that.pay_success();
                        console.log("success pay result:  " + res)

                      },
                      'fail': function (res) {
                        console.log(res)

                      }
                    })
                  }
                })
              }
            }
          })
        }
      }
    })

  },
  getCustomer: function () {
    var that = this;
    var openid = app.globalData.openid
    console.log(openid)
    wx.request({ //调用后台 api，使用 code 换取 openid 和 session_key 
      // url: 'https://wx.fsmbdlkj.com/WeChat applet/Server',
      url: app.globalData.selectCustomerInfByOpenId_url,
      method: 'POST',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json;charset=utf-8' // 默认值
      },
      success: function (res) {
        console.log(res)
        that.setData({
          customer_id: res.data.id
        })
        console.log(that.data.customer_id)
      }
    })
    // 
  },


  pay_success: function () {
    var that = this;
    wx.request({
      // url: 'https://mb.fsmbdlkj.com/WX Restaurant/GetOrderPaymentInf',
      url: app.globalData.GetOrderPaymentInf_url,
      data: {
        Order_id: that.data.order_id
      },
      success(res) {
        // console.log("Order_payment_id---->", res.data.object[0].order_payment_id)
        wx.request({
          // url: 'https://mb.fsmbdlkj.com/WX Restaurant/UpdateOrderPaymentInf',
          url: app.globalData.UpdateOrderPaymentInf_url,
          data: {
            Order_payment_id: res.data.object[0].order_payment_id,
            Shop_id: that.data.shop_id,
            order_id: that.data.order_id,
            Payment_status: 2
          },
          success(res) {
            console.log("修改订单支付状态:", res)
          }
        }) //修改订单支付状态
      }
    }) //GetOrderPaymentInf接口，获取order_payment_id
    wx.request({
      // url: 'https://mb.fsmbdlkj.com/WX Restaurant/UpdateOrderInf',
      url: app.globalData.UpdateOrderInf_url,
      data: {
        Order_id: that.data.order_id,
        Shop_id: that.data.shop_id,
        Order_status: '已买单'
      },
      success(res) {
        console.log("修改订单信息：", res)
      }
    }) //修改订单信息
    //确认充整信息的状态
    wx.request({
      // url: 'https://mb.fsmbdlkj.com/WX Restaurant/UpdataPreStatusServlet',
      url: app.globalData.UpdataPreStatusServlet_url,
      data: {
        pay_status: 1,
        order_num: that.data.order_code
      },
      success(res) {
        console.log("修改订单信息：", res)
      }
    }) //修改订单信息

    //新增订单提成记录
    wx.request({
      url: app.globalData.Addcommissionrecord_url,
      method: 'POST',
      data: {
        'order_id': that.data.order_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      success(res) {
        console.log("修改订单信息：", res)
      }
    })

    wx.navigateTo({
      url: '../paysuccess/paysuccess',
      success: function (res) {
        wx.showToast({
          title: '支付成功',
          icon: 'success',
          duration: 2000
        })
      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad: function (options) {
    console.log("options", options)
    var that = this;
    that.setData({
      order_code: options.order_code,
      total_amount: options.total_amount,
      order_id: options.order_id,
      shop_id: options.shop_id,
      shop_name: options.shop_name,
      payment_address: options.payment_address
    })
    var customer = app.globalData.customerInf
    console.log(customer)
    if (customer) {
      that.getCustomer()
    } else {
      that.setData({
        customer: customer
      })
    }
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