const app = getApp(); //引入全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    url: '', //公众号文章链接
    inviterId: '', //邀请者unionid
    inviterOpenid: '', //邀请者openid
    shopid: '', //店铺id
    unionId: '',
    openid: '',
    displayBox: false,
    isRegister: '',
    inviteShare: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    console.log(options);
    if (options != undefined) {
      //如果邀请人的id不为空
      if (options.inviterOpenid != null) {
        that.setData({
          inviterOpenid: options.inviterOpenid,
          shopid: options.shopid,
        })
      }
    }
    that.selectUnionID(); //获取用户unionid
  },
  // 获取用户信息
  selectUnionID: function () {
    var that = this
    wx.login({
      success: function (res) {
        console.log("获取登录授权数据:", res)
        if (res.code) {
          var code = res.code
          wx.getUserInfo({
            success: function (res) {
              console.log("获取用户信息:", res)
              app.globalData.encryptedData = res.encryptedData
              app.globalData.iv = res.iv
              that.qwe(res.encryptedData, res.iv, code)
            },
            fail: function (res) {
              wx.showModal({
                title: '提示',
                content: '授权失败，请重试！',
              })
            },
          })
        }
      }
    })
  },
  //获取用户openid
  qwe: function (encryptedData, iv, code) {
    let that = this;
    wx.request({
      url: app.globalData.allUrl.getUnionID,
      data: {
        code: code,
        encryptedData: encryptedData,
        iv: iv,
        wechatAppId: app.getWechatAppId(),
        //wsk: app.globalData.wsk,
      },
      header: {
        'content-type': 'application/json;charset=utf-8' // 默认值
      },
      method: 'POST',
      success: function (res) {
        console.log("获取数据:", res)
        that.setData({
          unionId: res.data.data.unionId,
          openid: res.data.data.openid,
          // showModalStatus: false
        })
        app.globalData.unionID = res.data.data.unionId;
        app.globalData.openid = res.data.data.openid;
        var customerInfo=res.data.data.customer;
        console.log('customerInfo:');
        console.log(customerInfo);
        app.globalData.caustomerId = customerInfo.id
        app.globalData.customerInf = customerInfo
        app.globalData.user_phone = customerInfo.phone
        app.globalData.user_name = customerInfo.name  
        
        that.getCustomer(res.data.data.openid)
      }
    })
  },
  getCustomer(openid) {
    let that = this
    wx.request({
      url: app.globalData.selectCustomerInfByOpenId_url,
      data: {
        openid: openid
      },
      method: 'POST',
      success: res => {
        that.setData({
          isRegister: res.data.signIn
        })
        that.selectFocus()
      }
    })
  },
  selectFocus() { 
    let that = this;
    wx.request({
      url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
      data: {
        unionId: that.data.unionId
      },
      success: res => {
        if (res.data.list == null) {
          // 将邀请人的openid 和自己的openid，unionid插入邀请绑定临时表
          wx.request({
            url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addOrUpdateShopMiddleTemporary',
            method: "POST",
            data: {
              shopId: that.data.shopid ? that.data.shopid : 0,
              unionId: app.globalData.unionID,
            },
            success:res=>{
              wx.request({
              url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addOrUpdateInviteBindTemporary',
              data: {
                inviterOpenid: that.data.inviterOpenid,
                passiveBindOpenid: that.data.openid,
                passiveBindUnionid: that.data.unionId,
                shopId: that.data.shopid ? that.data.shopid : 0,
              },
              method: "POST",
              success:res=>{
                console.log(res);
              }
            })
            }
          })
         
        }
        if (res.data.list != undefined && res.data.list != "" && res.data.list.isFocus != '0') {
          console.log("关注成功")
          wx.request({
            url: app.globalData.bindingRelationship_Url,
            data: {
              primaryBindingOpenId: that.data.inviterOpenid,
              passiveBindingOpenId: that.data.openid,
              shopId: that.data.shopid ? that.data.shopid : 0,
            },
          })
          if (that.data.isRegister == 0) {
            // if (that.data.inviteShare == "1") {
              wx.reLaunch({
                url: '../register/register?openId=' + that.data.openid + '&unionId=' + that.data.unionId,
              })
          } else {
              wx.reLaunch({
                url: '../../../main/main',
              })
          }
        }
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
    let that = this
    console.log(that.data);
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