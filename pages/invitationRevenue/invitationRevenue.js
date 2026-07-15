// pages/invitationRevenue/invitationRevenue.js
const appInstance = getApp(); //引入全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    today: 0,
    followers: 0,
    income: 0,
    register:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      register: appInstance.globalData.isRegister
    })
    that.selectInvite()
  },

  selectInvite: function (e) {
    var that = this
    var object = {
      "unionid": appInstance.globalData.unionID
    }

    if (that.data.register) {
      console.log(JSON.stringify(object))
      wx.request({
        url: appInstance.globalData.allUrl.selectInvite,

        data: JSON.stringify(object),
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            today: res.data.Today,
            followers: res.data.Followers,
            income: res.data.Coin,
          })
        },
        fail: function (res) {
          console.log(errMsg)
        }
      })
    } else {
      console.log('未注册，不能查询收益')
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