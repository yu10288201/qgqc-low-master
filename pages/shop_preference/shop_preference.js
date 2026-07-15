// pages/shop_preference/shop_preference.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_name:'',
    shop_id:''
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
  menu:function(e){ 
    wx.navigateTo({
      url: '../module_discount/pages/Shop_ordering/Shop_ordering?shop_id='+this.data.shop_id+'&shop_name='+this.data.shop_name,
    })
  }, 
  coupon:function(e){
    wx.navigateTo({
      url: '../module_discount/pages/Shop_ordering_couponid/Shop_ordering_couponid?file_id=1&&shop_id='+this.data.shop_id+'&shop_name='+this.data.shop_name,
    })
  },
  history:function(e){
    wx.navigateTo({
      url: '../module_discount/pages/orderList/orderList?shop_id='+this.data.shop_id + '&shopName=' + this.data.shop_name ,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var shop_name = app.globalData.shopdetail.shop_name
    var shop_id = app.globalData.shopdetail.shop_id
    console.log(shop_id)
    that.setData({
      shop_name:shop_name,
      shop_id:shop_id
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