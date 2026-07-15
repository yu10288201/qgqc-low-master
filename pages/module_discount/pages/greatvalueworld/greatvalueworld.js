// pages/greatvalueworld/greatvalueworld.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isPlatform: false
  },

  returnBack: function () {
    var pages = getCurrentPages(); //当前页面
    var beforePage = pages[pages.length - 2]; //前一页
    wx.navigateBack({
      success: function () {
        // beforePage.onLoad(); // 执行前一个页面的onLoad方法
      }
    });
  },

  SetMeal:function(){
    var that = this;
    console.log(111)
    wx.navigateTo({
      url: '/pages/SetMeal1/SetMeal1',
    })
  },

  superCoupon: function () {
    var that = this;
    console.log(111)
    wx.showModal({
      title: '提示',
      content: '暂无此类代金券',
    })
  },

  menu:function(e){
    wx.navigateTo({
      url: '../Shop_ordering/Shop_ordering',
    }) 
  },
  coupon:function(e){
    wx.navigateTo({
      url: '../Shop_ordering_couponid/Shop_ordering_couponid?file_id=1',
    })
  },
  history:function(e){
     wx.navigateTo({
       url: '../orderList/orderList?intoId=0',
     })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let that = this 
    that.setData({
      isPlatform: options.shopId == app.globalData.platformShopId
    })
    if(options.gotoList=='true'){
      this.history()
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