// pages/module_others/pages/VIPlevel/VIPlevel.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shopId: '',
    memberInfo: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this 
    console.log(options);
    if(options.shopId){
      that.setData({
        shopId: options.shopId,
      })
    }
    that.getMemberInfo()
  },
  getMemberInfo(){
    let that = this 
    wx.request({
      url: app.globalData.houduan_war_exploded_url,
      data:{
        shop_id: that.data.shopId,
        phone: app.globalData.customerInf.phone,
        pageNum: 0,
      },
      success: res=>{
        let a = res.data.object[0]
        that.setData({
          memberInfo: a
        })
      }
    })
  },
  returnBack(){
    wx.navigateBack({
      delta: 1,
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