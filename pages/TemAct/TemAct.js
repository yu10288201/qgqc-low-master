const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_name: '',
  },

  // customerBind(e){
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../customer/customer',
  //   })
  // },

  // addShopBind(e){
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../addShop/addShop',
  //   })
  // },

  userLogin: function (e) {
    var that = this;
    wx.login({
      success(res) {
        if (res.code) {
          // 发起网络请求
          wx.request({
            url: app.globalData.GetUserOpenid_url,
            data: {
              Appid: app.globalData.appid,
              // Secret: app.globalData.wsk,
              js_code: res.code
            },
            success(res) {
              console.log(res.data.object.openid);
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  shopBind(e) {
    var that = this;
    wx.navigateTo({
      url: '../shopDetailInfo/shopDetailInfo',
    })
  },

  jump(e) {
    var that = this;
    wx.navigateTo({
      url: '../shopInformation/shopInformation',
    })
  },

  partitionBind(e) {
    var that = this;
    wx.navigateTo({
      url: '../partition2/partition2',
    })
  },

  staffManagementBind(e) {
    var that = this;
    wx.navigateTo({
      url: '../staffManagement/staffManagement',
    })
  },


  testBind(e) {
    var that = this;
    wx.navigateTo({
      url: '../test/test',
    })
  },


  // bindtap1(e) {
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../invite_prize/invite_prize',
  //   })
  // },

  // bindtap2(e) {
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../management/management',
  //   })
  // },

  // bindtap3(e) {
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../daily/daily',
  //   })
  // },

  // bindtap4(e) {
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../management/management',
  //   })
  // },

  // bindtap5(e) {	//跳转登录
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../login/login',
  //   })
  // },

  // bindtap6(e) {	//跳转预存优惠管理
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../preference/preference',
  //   })
  // },

  // bindtap7(e) {	//跳转商家日报
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../daliy2/daliy2',
  //   })
  // },


  // bindtap8(e) { //跳转预存金额管理
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../moneymanagement/moneymanagement',
  //   })
  // },

  takeOut: function () {
    var that = this;
    wx.navigateTo({
      url: '../takeOut/takeOut',
    });
  },

  takeOut2: function () {
    var that = this;
    wx.navigateTo({
      url: '../takeOut/takeOut' + '?notHavePage='+ true,
    });
  },
  // shangjia: function () {
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../shangjiapay/shangjiapay',
  //   });
  // },

  // preferential: function () {
  //   var that = this;
  //   wx.navigateTo({
  //     url: '../shop_preference/shop_preference',
  //   });
  // },
  comeback: function () {
    var that = this;
    wx.navigateBack({
      delta: 1
    })
  },

  orders1:function(){
    var that = this;
    //跳转到我的订单位置
    wx.navigateTo({
      url: '../module_others/pages/orders1/orders1',
    });
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      shop_name: app.globalData.shopdetail.shop_name,
    })

    that.userLogin();

    // that.bindtap6();
    // that.bindtap8();
    // that.guke();
    // that.preferential();
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