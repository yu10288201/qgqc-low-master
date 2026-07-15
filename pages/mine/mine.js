// pages/mine/mine.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isHide: true,
    customerId: '',
    shopId: ''
  },
  mymessage: function() {
    let that = this
    let a = that.data.shopId ? that.data.shopId : app.globalData.platformShopId
    wx.navigateTo({
      url: '../mymessage/mymessage?shopId='+ a + '&customerId=' + that.data.customerId,
    })
  },
  help: function() {
    wx.navigateTo({
      url: '../help/help',
    })
  },
  //跳转点评界面
  assessment: function () {
    wx.navigateTo({
      url: '../module_others/pages/evaluation/evaluation',
    })
  },
  goSetting(){//设置
    wx.navigateTo({
      url: '../module_others/pages/setUp/setUp',
    })
  },
  learnPlatform(){//了解平台
    wx.navigateTo({
      url: '../web/web',
    })
  },
  //跳转优惠活动页面
  discount: function () {//预存
    let that = this
    wx.navigateTo({ 
      url: '../module_others/pages/weixinpay/weixinpay?shopId=' + that.data.shopId + '&shopName=' + that.data.shopName,
    })
  },
  consumptionDetail(){//分销收入
    let shopId = this.data.shopId ? this.data.shopId : ''
    wx.navigateTo({
      url: '../module_discount/pages/distribution_income/distribution_income?shopId=' + shopId,
    })
  },
  VIPlevel(){//会员
    let that = this
    let a = that.data.shopId ? that.data.shopId : app.globalData.platformShopId
    wx.navigateTo({
      url: '../module_others/pages/VIPlevel/VIPlevel?shopId=' + a,
    })
  },
  discountManagement(){//优惠券
    let that = this
    wx.showLoading({
      title: '请稍后~',
    })
    let a = this.data.shopId ? this.data.shopId : app.globalData.platformShopId
    wx.navigateTo({
      url: '../module_others/pages/discountManagement/discountManagement?shopId='+ a + '&customerId=' + that.data.customerId,
    })
    wx.hideLoading({
      success: (res) => {},
    })
  },
  tel: function() {
    wx.navigateTo({
      url: '../module_others/pages/newchat/newchat',
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

  //我的星盾
  tokens: function() {
    let a = this.data.shopId ? this.data.shopId : app.globalData.platformShopId
    wx.navigateTo({
      url: '../myStarCoin/myStarCoin?shopId=' + a,
    })
  },

  //去主页
  toMain: function() {
    wx.redirectTo({
      url: '../main/main',
    })
  },

  // 邀请收益
  earnings: function() {
    wx.navigateTo({
      url: '../invitationRevenue/invitationRevenue',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that  = this
    that.getCustomerInfo(app.globalData.openid)
    that.setData({
      shopName: options.shopName,
      shopId: options.shopId,
    },()=>{
        //平台的我   隐藏相关内容
      if(that.data.shopId == app.globalData.platformShopId){
        that.setData({
          isHide: false,
        })
      }
    })
  },
  onShow: function(){
    
  },
  getCustomerInfo(openId) {
    let that = this
    wx.request({
      url: app.globalData.selectCustomerInfByOpenId_url,
      // url: 'http://localhost:8887/evaluation_war/selectCustomerInfByOpenId',
      method: 'POST',
      data: {
        openid: openId
      },
      header: {
        'content-type': 'application/json;charset=utf-8' // 默认值
      },
      success: function (res) {
        that.setData({
          customerId: res.data.id,
          customerInfo: res.data,
        })
      }
    })
  },

  personalSetting(){
    let that = this;

    wx.navigateTo({
      url: '../module_discount/pages/wxpubPersonalSetting/wxpubPersonalSetting',
    });
  },


})