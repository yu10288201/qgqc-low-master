// pages/module_others/pages/discount_info/discount_info.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseIndex: null,
    shopDiscountNameList: [],
    pageIndex: 0,
    pageSize: 20,
    isSelect: true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.shopId) {
      that.setData({
        shopId: options.shopId,
        shopName: options.shopName,
      })
      that.getShopDiscountNameList(options.shopId)
    }
  },
  returnBack() {
    wx.navigateBack({
      delta: 1,
    })
  },
  goToDetail() {
    let that = this
    if (that.data.chooseIndex != null) {
      let index = that.data.chooseIndex
      let item = that.data.shopDiscountNameList[index]
      if (item.type_id == 1) { //超值套餐
        wx.navigateTo({
          url: '/pages/module_discount/pages/Shop_ordering/Shop_ordering?shop_id=' + that.data.shopId + '&shop_name=' + that.data.shopName,
        })
      } else if (item.type_id == 2) { //预存优惠
        wx.navigateTo({
          url: '../weixinpay/weixinpay?shopId=' + that.data.shopId + '&shopName=' + that.data.shopName,
        })
      } else if (item.type_id == 3) { //超值优惠券
        wx.navigateTo({
          url: '/pages/module_discount/pages/Shop_ordering_couponid/Shop_ordering_couponid?file_id=1&shop_id=' + that.data.shopId + '&shop_name=' + that.data.shopName,
        })
      }
    } else {
      wx.showToast({
        title: '请选择优惠项目',
        icon: 'error'
      })
    }
  },
  scrollBindtap() {
    let that = this
    if (that.data.isSelect) {
      that.setData({
        pageIndex: that.data.pageIndex + 1
      }, () => {
        that.getShopDiscountNameList(that.data.shopId)
      })
    }
  },
  getShopDiscountNameList(shopId) {
    let that = this
    wx.request({
      // url: 'http://localhost:8088/evaluation/getShopDiscountNameList',
      url: app.globalData.getShopDiscountNameList,
      data: {
        shopId: shopId,
        pageIndex: that.data.pageIndex,
        pageSize: that.data.pageSize,
      },
      success: res => {
        if (res.data.code == 1) {
          if (!res.data.paramsList || res.data.paramsList.length < that.data.pageSize) {
            that.setData({
              isSelect: false,
            })
          }
          that.setData({
            shopDiscountNameList: res.data.paramsList,
          })
        } else {
          wx.showToast({
            title: '网络错误',
            icon: 'error',
          })
        }
      }
    })
  },
  changeIndex(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    that.setData({
      chooseIndex: index
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