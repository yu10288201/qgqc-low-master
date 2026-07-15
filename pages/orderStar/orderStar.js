// pages/orderStar/orderStar.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  toShopClaim: function() {
    wx.navigateTo({
      url: '../shopclaim/shopclaim',
      success: function(res) {

      },
      fail: function(res) {
        console.log(res)
      }
    })
  },

  shop_shopDetailInfo: function () {
    wx.navigateTo({
      // url: '../shop_shopDetailInfo/shop_shopDetailInfo',
      url: '../module_others/pages/shop_shopDetailInfo/shop_shopDetailInfo',
      success: function (res) {

      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  returnBack: function() {
    var pages = getCurrentPages(); //当前页面
    var beforePage = pages[pages.length - 2]; //前一页
    wx.navigateBack({
      success: function() {
        // beforePage.onLoad(); // 执行前一个页面的onLoad方法
      }
    });
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

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