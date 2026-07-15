const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
  },
  //点餐人电话
  phonenumber: function(e) {
    var that = this;
    console.log('用户电话号码', e.detail.value)
    that.setData({
      phonenumber: e.detail.value
    })
  },

  //点餐人姓名
  bookusername: function(e) {
    var that = this;
    console.log('用户姓名', e.detail.value)
    that.setData({
      username: e.detail.value
    })
  },
  //点餐人性别
  changeradio: function(e) {
    var that = this;
    that.setData({
      index: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index == 0) {
      app.globalData.sex = '先生'
    } else if (e.currentTarget.dataset.index == 1) {
      app.globalData.sex = '女士'
    }
  },

  //确认
  ensure: function() {
    var that = this
    if (that.data.username != undefined && that.data.username != '' && that.data.phonenumber != undefined && that.data.phonenumber != '' && that.data.phonenumber.length == 11) {
      app.globalData.username = that.data.username
      app.globalData.phonenumber = that.data.phonenumber
      if (that.data.index == 1) {
        console.log("女士")
        app.globalData.sex = '女士'
      } else {
        console.log("先生")
        app.globalData.sex = '先生'
      }
      console.log(that.data.tableid)
      app.globalData.locationid = that.data.tableid
      wx.navigateTo({
        url: '/pages/module_others/pages/menu/menu',
      })
    } else if (that.data.username == undefined || that.data.username == '') {
      wx.showModal({
        title: '通知',
        content: '请填写您的姓名',
        showCancel: false,
      })
    } else if (that.data.phonenumber == undefined || that.data.phonenumber == '' || that.data.phonenumber.length != 11) {
      wx.showModal({
        title: '通知',
        content: '请填写有效的电话号码',
        showCancel: false,
      })
    } else {
      wx.showModal({
        title: '通知',
        content: '未知错误',
        showCancel: false,
      })
    }

  },
  //跳过
  skip: function() {
    app.globalData.username = '某'
    app.globalData.phonenumber = ''
    app.globalData.sex = '先生'
    wx.navigateTo({
      url: '/pages/module_others/pages/menu/menu',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      tableid: options.tableid
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})