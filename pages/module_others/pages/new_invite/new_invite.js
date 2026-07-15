// pages/invite/invite.js
const appInstance = getApp(); //引入全局变量

const auth = require('../../../../utils/auth.js');

//获取倍率
const ratepx = 750.0 / wx.getSystemInfoSync().windowWidth;

//获取canvas转化后的rpx
const rate = function (rpx) {
  return rpx / ratepx
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    // showModal: true,
    // register: false,
    register: false, //是否注册
    isAuthorize: true, //是否登录/授权
    // showPosterImage: true,
    // isCreate: false,
    // isShow: false,
    openid: '', //用户openID
    unionID: '', //用户unionID
    inviterId: '', //邀请者unionID
    showAuthorize: false,

    avatar: "",
    backPic: "/images/main1.png",
    logo: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/logo1.png",
    today: 0,
    followers: 0,
    income: 0,
    background2: "/images/authorized.jpg", //授权图片,暂时不能放在服务器
  },

  /**
   * 生命周期函数--监听页面加载
   * 
   * 这是分享邀请的首页，当被邀请了会先获取授权，判断是否注册，然后记录新用户信息
   */
  // onLaunch:function(e){
  //   console.log('1')
  //   appInstance.selectUnionID()
  // },

  onLoad: function (options) {
    var that = this;
    // appInstance.getCustomerInfo()
    if (options != undefined) {
      if (options.inviterId != null) {
        console.log("options============" + options.inviterId + "邀请者已经注册")
        that.setData({
          inviterId: options.inviterId,
        })
        // appInstance.globalData.inviterId = options.inviterId
        console.log("邀请者unionid: " + that.data.inviterId);
      }
    }

    if (appInstance.globalData.isAuthorize && appInstance.globalData.unionID != '') {
      console.log('记录')
      // appInstance.getCustomerInfo(appInstance.globalData.unionID)
    }

    // bug缓解术，避免受邀请后，无法判定是否授权，所以写了延时获取unionId
    setTimeout(function () {
      that.setData({
        isAuthorize: appInstance.globalData.isAuthorize,
        register: appInstance.globalData.isRegister
      })
    }, 1000);


    if (appInstance.globalData.isRegister) {
      console.log('查询收益')
      that.setData({
        register: appInstance.globalData.isRegister
      })
      that.selectInvite()

    } else if (!appInstance.globalData.isRegister) {
      console.log('用户未注册')
    }
    let base64b = wx.getFileSystemManager().readFileSync(that.data.background2, 'base64');
    // appInstance.postUserInfo()
    that.authorization()

    that.setData({
      'background2': 'data:image/jpg;base64,' + base64b,
    });

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
    that.setData({
      isAuthorize: appInstance.globalData.isAuthorize,
      register: appInstance.globalData.isRegister
    })
    if (appInstance.globalData.isAuthorize) {
      that.selectInvite()
    }

  },

  getUser: function () {
    var that = this
    that.setData({
      showAuthorize: false
    },
      setTimeout(function () {
        //要延时执行的代码
        that.selectUnionID()
      }, 2000) //延迟时间 这里是1秒 
    )
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
  // invite: function() {
  //   this.setData({
  //     showModal: true
  //   })
  // },
  // hide: function() {
  //   this.setData({
  //     showModal: false
  //   })
  // },

  toRegister: function () {
    console.log('前往注册')
    wx.navigateTo({
      url: '../module_others/pages/register_invite/register_invite',
    })
  },

  toIndex: function () {
    wx.switchTab({
      url: '../main/main',
    })
  },

  toHelp: function () {
    wx.navigateTo({
      url: '../help/help?invite=1',
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var that = this;

    var shareObj = {
      title: "微信小程序餐饮平台·点开有奖", // 默认是小程序的名称(可以写slogan等)
      //当注册之后转发是带有邀请人openId的
      path: '/pages/invite/invite', // 默认是当前页面，必须是以‘/’开头的完整路径
      // imageUrl: 'https://mb.fsmbdlkj.com/evaluation/images/share.png',
      imageUrl: appInstance.globalData.allImagesUrl.invite_Url,
      //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          that.hide();
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          that.hide();
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
          that.hide();
        }
      },
      complete: function () {

      }
    };
    // 来自页面内的按钮的转发
    if (that.data.register) {
      // 此处可以修改 shareObj 中的内容
      shareObj.path = '/pages/invite/invite?inviterId=' + appInstance.globalData.unionID;
      // shareObj.path = '/pages/invite/invite?inviterId=oX7vm1YWseFmXr_Bzkx69nZm_gfQ'; //测试用
      console.log(shareObj.path)
    };
    // 返回shareObj
    return shareObj;
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


  //拒绝授权，返回首页
  refused: function (res) {
    let that = this
    appInstance.globalData.isAuthorize = false
    appInstance.globalData.isRegister = false
    wx.switchTab({
      url: '../main/main',
    })

    that.setData({
      showAuthorize: false,
      isAuthorize: false
    })

  },

  // // 获取UnionID
  // selectUnionID: function() {
  //   var that = this
  //   setTimeout(function () {
  //     appInstance.selectUnionID(),
  //     that.setData({
  //       isAuthorize: true
  //     })
  //   }, 1000);
  // },

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
                  var customerInfo=res.data.data.customer;
                  console.log('customerInfo:');
                  console.log(customerInfo);
                  app.globalData.caustomerId = customerInfo.id
                  app.globalData.customerInf = customerInfo
                  app.globalData.user_phone = customerInfo.phone
                  app.globalData.user_name = customerInfo.name  
                  
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
      }, complete: function () {
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

  addStar: function (e) {
    var that = this
    var object = {
      "inviterId": that.data.inviterId
    }
    console.log(JSON.stringify(object))
    wx.request({
      url: appInstance.globalData.allUrl.addStar,

      data: JSON.stringify(object),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data == "success") {
          console.log(that.data.inviterId + "邀请人获得收益成功")
        } else {
          console.log(that.data.inviterId + "邀请人获得收益失败")
        }
      }
    })
  },

  tran: function () {
    var that = this
    that.setData({
      isRegister: !that.data.isRegister
    })
  },

  changeData: function () {
    let that = this
    that.onLoad(); //最好是只写需要刷新的区域的代码，onload也可，效率低，有点low
  },

})