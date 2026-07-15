// pages/module_others/pages/discountManagement/discountManagement.js
var app = getApp();
var util = require("../../../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    managementCouponsList: [],
    managementCouponDetail: {},
    chooseType:['赠送','购买','全部'],
    queryByType: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options);
    wx.showLoading({
      title: '请稍后~',
    })
    that.getManagementCouponsList(options.customerId,options.shopId)
    that.setData({
      customerId: options.customerId,
      shopId: options.shopId
    })
  },
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },
  getManagementCouponsList(customerId,shopId){
    let that = this
    wx.request({
      // url: 'http://localhost:8088/evaluation/getManagementCouponsList',
      url: app.globalData.GetManagementCouponsList_Url,
      data: {
        shopId: shopId,
        customerId: customerId
      },
      success:res=>{
        console.log(res.data.list);
        let a = res.data.list
        for(let i = 0;i <a.length;i++){
           a[i].createTime = util.formatTime3(a[i].createTime,'Y-M-D')
        }
        that.setData({
          managementCouponsList: res.data.list
        })
        wx.hideLoading({success: (res) => {},})
      }
    })
  },
  onDetail(e){
    console.log(e.currentTarget.dataset.index)
    let that = this
    let a = e.currentTarget.dataset.index
    console.log(that.data.managementCouponsList[a]);
    that.setData({
      chooseList: a,
      managementCouponDetail: that.data.managementCouponsList[a],
      openDetail: true
    })
  },
  queryList(e){
    let that = this
    console.log(e.detail.value);
    if(e.detail.value.queryByType === '2'){
      e.detail.value.queryByType = ''
    }
    wx.request({
      // url: 'http://localhost:8088/evaluation/getManagementCouponsList',
      url: app.globalData.GetManagementCouponsList_Url,
      data: {
        shopId: that.data.shopId,
        customerId: that.data.customerId,
        couponsType: e.detail.value.queryByType,
        couponName: e.detail.value.queryByNmae
      },
      success:res=>{
        console.log(res.data);
        let a = res.data.list
        for(let i = 0;i < res.data.length;i++){
          a[i].createTime = util.formatTime3(a[i].createTime,'Y-M-D')
        }
        that.setData({
          managementCouponsList: res.data.list
        })
      }
    })
  },
  clocePop(){
    let that = this
    that.setData({
      openDetail: false,
      chooseList: null
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