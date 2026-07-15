const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    treatInfo: [],
    isShowAll: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      shopId: options.shopId,
      customerId: options.customerId
    })
    var treat = []
    wx.request({
      url: app.globalData.getTreatInfoByCustomerId,      
      data:{
        receiveCustomerId: that.data.customerId,
        shopId: that.data.shopId
      },
      success: res=>{
        treat = res.data.treatInfo
        treat.sort(function(a, b) {
            return b.createTime.localeCompare(a.createTime);
        });
        that.setData({
            treatInfo: treat
        })      
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  map: function () {
    var that = this
    wx.getSetting({
        success: function (res) {
            
            if (res.authSetting['scope.userLocation'] || res.authSetting['scope.userLocation'] == undefined) {
                var latitude = app.globalData.shopdetail.latitude
                var longitude = app.globalData.shopdetail.longitude
                wx.openLocation({
                    latitude: Number(latitude),
                    longitude: Number(longitude),
                    scale: 28,
                })
            } else {
                wx.openSetting({
                    success: function (res) {
                        console.log(res)
                    }
                })
            }
        }
    })
},

  clickMore(e){
    let that = this
    let index = e.currentTarget.dataset.index
    let treatInfo = that.data.treatInfo

    if(!that.data.isShowAll){
      treatInfo[index].webkitline = '100'
      treatInfo[index].transform = "rotate(180deg)"
    }else{
      treatInfo[index].webkitline = '3'
      treatInfo[index].transform = "rotate(0deg)"
    }

    that.setData({
      isShowAll: !that.data.isShowAll,
      treatInfo:treatInfo
    })
  }
})