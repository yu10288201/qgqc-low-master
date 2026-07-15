// pages/quyu/quyu.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityName:'佛山市',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'http://192.168.1.136:8080/shop/getCounty.do',
    data:{
      name:that.data.cityName,
    },
    header:{
      'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    method: 'POST',
    success:function(res){
      console.log(res.data.data)
      that.setData({
        cityNameList:res.data.data
      })
      console.log(that.data.cityNameList)
    }
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