// pages/shop/shop.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index :''
  },
  selectshop:function(e){
    var that =this
    wx.request({
      // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectSetmeal',
      url: app.globalData.taocan.selectSetmeal_url,
      method: 'POST',
      data: {
        setMealID:that.data.setMealID
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        var shopList=''
        var shop =[]
        for(var x of res.data){
          if(x.shop_id ==3443){
            shop.push(x)
          }
        }
      //console.log(res.data)
      shopList=res.data
      that.setData({
        shopList:shopList,
        shop:shop
      })
      }
    })
  },

  checkbox:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      index:index
    })
    wx.makePhoneCall({
      phoneNumber: that.data.shopList[that.data.index].contact_number,
    })
    //console.log(that.data.shopList[that.data.index].contact_number)
  },

  tap:function(e){
    var that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      index:index
    })
    wx.navigateTo({
      url: '../Shop_ordering/Shop_ordering?shop_id='+that.data.shopList[that.data.index].shop_id,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      setMealID:options.setMealID
    })
    this.selectshop()
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