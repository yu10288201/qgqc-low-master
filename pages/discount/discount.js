const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_name: '',
  },


  userLogin: function (e) {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: app.globalData.GetUserOpenid_url,
            data: {
              Appid: app.globalData.appid,
              // Secret: app.globalData.wsk,
              js_code: res.code
            },
            success(res) {
              console.log(res.data.object.openid);
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },
 
  shopBind(e) {
    var that = this;
    wx.navigateTo({
      url: '../shopDetailInfo/shopDetailInfo',
    })
  },

  jump(e) {
    var that = this;
    wx.navigateTo({
      url: '../shopInformation/shopInformation',
    })
  },

  partitionBind(e) {
    var that = this;
    wx.navigateTo({
      url: '../partition2/partition2',
    })
  },

  staffManagementBind(e) {
    var that = this;
    wx.navigateTo({
      url: '../staffManagement/staffManagement',
    })
  },


  testBind(e) {
    var that = this;
    wx.navigateTo({
      url: '../test/test',
    })
  },



  guke: function () {
    var that = this;
    wx.navigateTo({
      url: '../module_others/pages/weixinpay/weixinpay',
    });
  },
    

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      shop_name: app.globalData.shopdetail.shop_name,
    })

    that.userLogin();

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