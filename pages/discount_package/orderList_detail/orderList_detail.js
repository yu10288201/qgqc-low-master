// pages/orderList_detail/orderList_detail.js
const app = getApp()

Page({
  /**
   * 页面的初始数据
   */
  data: {
    id: 0,
    actionSheetHidden: true
  },
  callsever: function (e) {
    wx.navigateTo({
      url: '../../../module_others/pages/newchat/newchat',
    })
  },
  callshop: function (e) {
    wx.makePhoneCall({
      phoneNumber: this.data.shopList.contact_number,
    })
  },
  goshop(e) {
    wx.navigateTo({
      url: '../Shop_ordering/Shop_ordering?shop_id=' + this.data.shopList.shop_id,
    })
  },
  assess(e) {
    var that = this
    wx.navigateTo({
      url: '../assess1/assess1?dishes_id=' + that.data.mealList.setMealID + '&order_id=' + that.data.order_id + '&order_status=' + that.data.SelectTicketOrderInfo[0].order_status,
    })
  },
  select: function (e) {
    var that = this
    wx.request({
      url: app.globalData.Selectshopid_url,
      method: 'POST',
      data: {
        shop_id: 3443,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        var shopList = res.data[0]
        that.setData({
          shopList: shopList
        })
      }
    })
  },
  SelectTicketOrderInfo: function (e) {
    var that = this
    wx.request({
      url: app.globalData.SelectTicketOrderInfo_url,
      data: {
        "order_id": that.data.order_id,
        "user_id": "",
        "shop_id": ""
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var create_date = []
        for (var x of res.data.object) {
          var s = x.create_date.indexOf('.') //找到第一次出现下划线的位置
          create_date.push(x.create_date.substring(0, s))
        }
        var ordernum = ''
        var i = 0
        for (var x of res.data.object[0].order_code) {
          if (i % 4 == 0) {
            ordernum = ordernum + ' ' + x
          } else {
            ordernum = ordernum + x
          }
          i++
        }
        var SelectTicketOrderInfo = res.data.object
        that.setData({
          SelectTicketOrderInfo: SelectTicketOrderInfo,
          create_date: create_date,
          ordernum: ordernum
        })
      }
    })

  },
  again: function (e) {
    var that = this
    wx.request({
      url: app.globalData.SelectTicketOrderDetailed_url,
      data: {
        "id": "",
        "order_id": that.data.order_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var orderList_detail = res.data.object
        that.setData({
          orderList_detail: orderList_detail
        })
        that.meal()
      }
    })
  },
  meal: function (e) {
    var that = this
    wx.request({
      url: app.globalData.selectSetMealInfo_url,
      data: {
        setMealID: that.data.setMealID,
        shop_id: "",
        startUsing: ""
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        var mealList = res.data.selectResult[0]
        that.setData({
          mealList: mealList
        })
      }
    })
  },

  longTap: function (e) {
    var that = this
    wx.setClipboardData({
      data: that.data.SelectTicketOrderInfo[0].order_code,
      success: function (res) {}
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      id: options.id,
      order_id: options.order_id,
      setMealID: options.setMealID
    })
    that.select()
    that.SelectTicketOrderInfo()
    that.again()
  },
  coupon: function (e) {
    this.setData({
      actionSheetHidden: false
    })
  },
  modalChange: function (e) {
    this.setData({
      actionSheetHidden: true
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