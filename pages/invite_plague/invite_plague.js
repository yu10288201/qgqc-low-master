// pages/invite_ plague/invite_ plague.js
const appInstance = getApp(); //引入全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false,
    num: 0,
    inviterId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */

  // 获取当前日期，格式为YYYY-MM-DD
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },
  
  onLoad: function(options) {
    var that = this
    if (options != undefined) {
      if (options.inviterId != null) {
        that.setData({
          inviterId: options.inviterId,
        })
        console.log("邀请者unionid: " + that.data.inviterId);
      }
    }
    that.authorization()
  },

  // 获取UnionID
  selectUnionID: function () {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code
          wx.getUserInfo({
            success: function (res) {
              appInstance.globalData.encryptedData = res.encryptedData
              appInstance.globalData.iv = res.iv

              wx.request({
                url: appInstance.globalData.allUrl.getUnionID,
                data: {
                  code: code,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  wechatAppId: appInstance.getWechatAppId(),
                  //wsk: appInstance.globalData.wsk,
                },
                header: {
                  'content-type': 'application/json;charset=utf-8' // 默认值
                },
                method: 'POST',
                success: function (res) {
                  that.setData({
                    unionID: res.data.data.unionId,
                    openid: res.data.data.openid,
                    // showModalStatus: false
                  })
               
                  appInstance.globalData.unionID = res.data.data.unionId
                  appInstance.globalData.openid = res.data.data.openid
               
                  appInstance.getCustomerInfo(res.data.data.openid) //获取用户信息
                  // that.postUserInfo(res)
                  that.setData({
                    isAuthorize: true,
                    showAuthorize: false
                  })
                }
              })
            },
            fail: function (res) {
              wx.showModal({
                title: '提示',
                content: '授权失败，请重试！',
              })
              that.setData({
                isAuthorize: false,
                showAuthorize: false
              })
            },
            complete: function () {
              setTimeout(function () {
                that.setData({
                  isAuthorize: appInstance.globalData.isAuthorize,
                  register: appInstance.globalData.isRegister
                })
                that.selectInvite()
              }, 1000);
            }
          })
        }
      }
    })
  },

  selectInvite: function (e) {
    var that = this
    var object = {
      "unionid": appInstance.globalData.unionID
    }

    if (that.data.register) {
      console.log(JSON.stringify(object))
      wx.request({
        url: appInstance.globalData.allUrl.selectInvite,

        data: JSON.stringify(object),
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          that.setData({
            today: res.data.Today,
            followers: res.data.Followers,
            income: res.data.Coin,
          })
        },
        fail: function (res) {
          console.log(errMsg)
        }
      })
    } else {
      console.log('未注册，不能查询收益')
    }
  },

  // 判断是否注册
  authorization: function (res) {
    var that = this

    wx.getUserInfo({
      // 获取用户信息
      success: function (res) {
        console.log('已授权')
        appInstance.globalData.isAuthorize = true
        that.setData({
          isAuthorize: true,
          showAuthorize: false
        })
        if (res.iv) {
          that.selectUnionID()
        }
      },
      fail: function (res) {
        console.log('未授权')
        appInstance.globalData.isAuthorize = false
        appInstance.globalData.isRegister = false
        that.setData({
          isAuthorize: false,
          showAuthorize: true
        })
      }
    })

  },


  //记录首次用户登录信息,还有邀请绑定
  postUserInfo(res) {
    var that = this
    var openid = res.data.openid
    var unionId = res.data.unionId
    var focus_time = that.getNowFormatDate();

    console.log(that.data.inviterId)
    wx.getUserInfo({
      success: function (res) {
        let sex = '';
        switch (res.userInfo.gender) {
          case 1:
            sex = '男'
            break;
          case 2:
            sex = '女'
            break;
          default:
            sex = '未知'
        }
        that.setData({
          city: res.userInfo.city,
          country: res.userInfo.country,
          province: res.userInfo.province,
          gender: sex,
          name: res.userInfo.nickName,
        })

        // 0：未知、1：男、2：女
        wx.request({
          url: appInstance.globalData.allUrl.postUserInfo,
          data: {
            openid: openid,
            unionId: unionId,
            city: that.data.city,
            country: that.data.country,
            province: that.data.province,
            gender: sex,
            name: that.data.name,
            focus_time: focus_time,
            // inviterId: that.data.inviterId
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          method: 'POST',
          success: function (res) {
            if (res.data == "success") {
              console.log('开始绑定')
              if (that.data.inviterId != null && unionId != that.data.inviterId) {
                var object = {
                  "unionId": unionId,
                  "inviterId": that.data.inviterId,
                }
                wx.request({
                  url: appInstance.globalData.allUrl.bindingInviter,
                  data: JSON.stringify(object),
                  header: {
                    'content-type': 'application/json'
                  },
                  method: 'POST',
                  success: function (res) {
                    console.log(res)
                    if (res.data == "success") {
                      console.log("绑定成功")
                    } else {
                      console.log("绑定失败")
                    }
                  },
                  fail: function (res) {
                    console.log("绑定失败")
                  }
                })

              } else {
                console.log('首次登录记录成功，没有邀请')
              }
            }
          }
        })
      },
      fail: function (res) {
        console.log(errMsg)
      },
      complete: function () {
        if (that.data.inviterId != '' && appInstance.globalData.unionID != '' && that.data.inviterId != appInstance.globalData.unionID) {
          var object = {
            "unionId": appInstance.globalData.unionID,
            "inviterId": that.data.inviterId,
          }
          wx.request({

            url: appInstance.globalData.allUrl.bindingInviter,
            data: JSON.stringify(object),
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
              console.log(res)
              if (res.data == "success") {
                console.log("绑定成功")
              } else {
                console.log("绑定失败")
              }
            },
            fail: function (res) {
              console.log("绑定失败")
            }
          })

        } else {
          console.log('首次登录记录成功，没有邀请')
        }
      }
    })

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

  },

  // 去邀请页面
  toInvite: function(e) {
    var that = this
    wx.navigateTo({
      url: '../invite/invite?inviterId=' + that.data.inviterId,
    })
  },

  // 去邀请页面
  toMain: function(e) {
    wx.reLaunch({
      url: '../main/main',
    })
  },

  toWebInvite: function (e) {
    wx.reLaunch({
      url: '../web_invite/web_invite',
    })
  },

  showOut: function(e) {
    var that = this
    console.log(that.data.show)
    that.setData({
      show: !that.data.show
    })
  }

})