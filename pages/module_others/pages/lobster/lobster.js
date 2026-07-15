const app = getApp();
var util = require("../../../../utils/util.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hiddenview: false,//模态框显示
    shop_name: '',//店铺名称
    shop_id: '',//店铺id
    event_id: '',//活动id
    event_name: '',//活动名称
    unit_price: '',//活动单价
    count: '',//活动数量
    target_xd: '',//目标星盾
    coupon_id: '',//优惠券id
    xd_royalty: '',//首发人提成
    event_rule: '',//活动规则
    create_date: null,//开始日期
    unit: '',//单位
    user_id: '',
    initNum: '',
    name: '暂未注册',
    gender: '暂未注册',
    city: '暂未注册',
    phone: '暂未注册',
    ifUser: false

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(options)
    that.setData({
      shop_id: options.shop_id,
      shop_name: options.shop_name,
      event_id: options.event_id,
      user_id: options.user_id,
    })
    var time = util.formatTime(new Date());
    that.setData({
      create_date: time
    })
    wx.request({
      url: 'https://test.fsmbdlkj.com/web10_war/Servlet/FindActServlet',
      // url: 'http://localhost:8080/Servlet/FindActServlet',

      data: {
        event_id: that.data.event_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      method: 'POST',
      success(res) {
        //把后台获得的数据传到页面的data中
        console.log(res.data)
        that.setData({
          count: res.data[0].count,
          event_name: res.data[0].event_name,
          coupon_id: res.data[0].coupon_id,
          event_rule: res.data[0].event_rule,
          target_xd: res.data[0].target_xd,
          xd_royalty: res.data[0].xd_royalty,
          unit_price: res.data[0].unit_price,
          unit: res.data[0].unit,
          initNum: res.data[0].initNum
        })

      }
    })
    if (that.data.user_id != '' && that.data.user_id != null) {
      wx.request({
        url: 'https://test.fsmbdlkj.com/web10_war/Servlet/FindUserServlet',
        // url: 'http://localhost:8080/Servlet/FindUserServlet',

        data: {
          user_id: that.data.user_id
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
        },
        method: 'POST',
        success(res) {
          //把后台获得的数据传到页面的data中
          console.log(res.data)
          if (res.data != null) {
            that.setData({
              name: res.data.name,
              gender: res.data.gender,
              phone: res.data.phone,
              city: res.data.city,
              ifUser: true
            })
          } else {
            that.setData({
              ifUser: false
            })
          }

        }
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

  },
  sign: function () {
    var that = this;
    that.setData({
      hiddenview: true
    })
  },
  cancel: function () {
    var that = this;
    that.setData({
      hiddenview: false
    })
  },
  onShareAppMessage: function (res) {
    var shareimage = '../../imager/lobster.jpg'
    return {
      title: "免费吃大龙虾",
      // path: '/pages/sharedetail/sharedetail?id=' + this.data.id,
      path: '/pages/home/home',
      imageUrl: shareimage
    }
  },
  signAct: function () {
    var that = this;
    if (that.data.ifUser) {
      wx.request({
        url: 'https://test.fsmbdlkj.com/web10_war/Servlet/FindActInitServlet',
        // url: 'http://localhost:8080/Servlet/FindActInitServlet',

        data: {
          user_id: that.data.user_id,
          event_id: that.data.event_id,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
        },
        method: 'POST',
        success(res) {
          //把后台获得的数据传到页面的data中
          console.log(res.data)
          if (res.data) {
            wx.request({
              url: 'https://test.fsmbdlkj.com/web10_war/Servlet/InitSignActServlet',
              // url: 'http://localhost:8080/Servlet/InitSignActServlet',

              data: {
                user_id: that.data.user_id,
                create_date: that.data.create_date,
                event_id: that.data.event_id,
                xd_count: 0,
                shop_id: that.data.shop_id
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
              },
              method: 'POST',
              success(res) {
                wx.showModal({
                  title: '报名成功',
                  confirmText: '返回首页',
                  success(e) {
                    if (e.confirm) {
                      wx.redirectTo({
                        url: '../home/home',
                      })
                    } else if (e.cancel) {
                      var that = this;
                      that.setData({
                        hiddenview: false
                      })
                    }
                  }
                })

              }
            })
          } else {
            wx.showModal({
              title: '已经报名过这个活动了'
            })

          }
        }
      })
    } else {
      wx.showModal({
        title: '请先注册',
        content: '请注册成为会员，再参加活动',
      })
    }
  },
  join: function () {
    wx.navigateTo({
      url: '../customer/customer',
    })
  }
})