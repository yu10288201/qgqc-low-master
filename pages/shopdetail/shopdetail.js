const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    operatingTime: '',//营业时间
    managementData:'',//商铺设置
    timeBoolean1:false,//第一个时间的显示判断
    timeBoolean2: false,//第二个时间的显示判断
    day1: [],//第一个时间的跨度
    day2: [],//第二个时间的跨度
    time1: [],//第一个时间的早上
    time2: [],//第一个时间的中午
    time3: [],//第一个时间的晚上
    time4: [],//第二个时间的早上
    time5: [],//第二个时间的中午
    time6: [],//第二个时间的晚上
  },

  getOperatingTime: function(){
    var that = this;
    that.setData({
      managementData: app.globalData.managementData
    })
    var managementData = that.data.managementData
    console.log(managementData.timeStr1)
    console.log(managementData.timeStr2)
    if (managementData.timeStr1){
      if (managementData.timeStr1.indexOf("-1") == -1) {//第一个时间有设置
        that.setData({//显示第一个时间
          timeBoolean1: true,
          day1: managementData.timeStr1.split(',')[0].split('/'),
          time1: managementData.timeStr1.split(',')[1].split('/'),
          time2: managementData.timeStr1.split(',')[2].split('/'),
          time3: managementData.timeStr1.split(',')[3].split('/'),
        })
      } else {
        that.setData({//不显示第一个时间
          timeBoolean1: false
        })
      }
    }
    if (managementData.timeStr2) {
      if (managementData.timeStr2.indexOf("-1") == -1) {//第二个时间有设置
        that.setData({//显示第二个时间
          timeBoolean2: true,
          day2: managementData.timeStr2.split(',')[0].split('/'),
          time4: managementData.timeStr2.split(',')[1].split('/'),
          time5: managementData.timeStr2.split(',')[2].split('/'),
          time6: managementData.timeStr2.split(',')[3].split('/'),
        })
      } else {
        that.setData({//不显示第二个时间
          timeBoolean2: false
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    that.getOperatingTime();
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