// pages/shop_manage/pages/tse1/tse1.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    is_video_show:app.globalData.is_video_show,
    openid: '',
    unionId: '',
    inviteOpenId: '',
    shop: [],
    godappraise: -1,
    godappraise1: 6,
    evaluations: '',
    width: wx.getSystemInfoSync().windowWidth * 0.94 * 0.96,
    height: wx.getSystemInfoSync().windowWidth * 0.94 * 0.96 * 1.3 / 2,
    moreInf: true,
    shopid: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    console.log(options);
    if (options.moreInf != null) {
      that.setData({
        moreInf: false
      })
    }

    //如果邀请人的id不为空
    if (options.inviterOpenid != null) {
      that.setData({
        inviterOpenid: options.inviterOpenid,
        shopid: options.shopid,
        uuid: options.distributionUuid,
      })
      
    }

    that.getFoodInfo(options.distributionUuid)
    that.getShopdetail(options.shopid)
  },
  //分销菜品详情
  getFoodInfo(uuid) {
    let that = this
    wx.request({
      url: app.globalData.getSettingList,
      // url: 'http://192.168.8.5:8088/evaluation/getSettingList',
      data: {
        uuid: uuid
      },
      success: res => {
        console.log(res);
        that.setData({
          distributionFoodInfo: res.data,
          dishesId: res.data[0].dishesId
        })
      }
    })
  },
  //店铺详情
  getShopdetail(shopId) {
    let that = this
    wx.request({
      url: app.globalData.Selectshopid_url,
      data: {
        shop_id: shopId
      },
      method: "POST",
      success: res => {
        console.log(res);
        that.setData({
          shop: res.data
        })
      }
    })
  },
  //联系商家
  call: function (e) {
    var that = this
    if (that.data.shop[0].contact_number && that.data.shop[0].contact_number != '无添加') {

      wx.makePhoneCall({
        phoneNumber: that.data.shop[0].contact_number.split(" ")[0],
        success(res) {
          console.log('拨打电话成功')
        },
        fail(res) {
          console.log('拨打电话失败')
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '该商铺还未设置电话号码',
      })
    }
  },
  //店铺详情
  detail: function (e) {
    app.globalData.shopid = this.data.shop[0].shop_id
    wx.navigateTo({
      url: '../../../index/index?shopid=' + this.data.shop[0].shop_id,
    })
  },
  //用户评论
  file: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    that.setData({
      file_id: index,
    });
    if (index == 0) {
      that.setData({
        godappraise: -1,
        godappraise1: 6
      })
      that.selectAllEvaluation()
    } else if (index == 1) {
      that.setData({
        godappraise: 3,
        godappraise1: 6,
      })
      that.selectAllEvaluation()
    } else if (index == 2) {
      that.setData({
        godappraise: -1,
        godappraise1: 4,
      })
      that.selectAllEvaluation()
    } else {
      that.selectPicevaluation()
    }
  },
  //查询图片评论
  selectPicevaluation: function (res) {
    var that = this
    wx.request({
      url: app.globalData.taocan.select_picevaluation_url,
      // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/select_picevaluation',
      data: {
        "shop_id": that.data.shopId,
        "dishes_id": that.data.dishesId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          evaluations: res.data
        })
      }
    })
  },
  //查询评论
  selectAllEvaluation: function (res) {
    var that = this
    wx.request({
      url: app.globalData.taocan.select_evaluation_url,
      // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/select_evaluation',
      data: {
        "shop_id": that.data.shopId,
        "assess_surport": that.data.godappraise,
        "assess_surport1": that.data.godappraise1,
        "dishes_id": that.data.dishesId
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          evaluations: res.data
        })
      }
    })
  },
  //查看照片大图
  bigimg2: function (e) {
    var that = this;
    var imgBox = []
    //  if(e.currentTarget.dataset.src.substring(e.currentTarget.dataset.src.length-2,e.currentTarget.dataset.src.length)!='\r\n'){
    //   imgBox.push(e.currentTarget.dataset.src.substring(0,e.currentTarget.dataset.src.length-4)+'big')
    //  }else{
    imgBox.push(e.currentTarget.dataset.src)
    //  }
    that.setData({
      imgBox: imgBox
    })
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: imgBox // 需要预览的图片http链接列表
    })
  },
  buy() {
    wx.navigateTo({
      url: '../../../module_discount/pages/order/order?distribution=1&distributionFoodInfo=' + JSON.stringify(this.data.distributionFoodInfo) + '&shop_id=' + this.data.shopId + '&inviteOpenId=' + this.data.inviteOpenId,
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
    this.setData({
      is_video_show:app.globalData.is_video_show,
    })
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
        // if (res.data.list == null) {
        //   wx.request({
        //     url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addOrUpdateShopMiddleTemporary',
        //     data: {
        //       shopId: that.data.shopid,
        //       unionId: that.data.unionId,
        //     },
        //     method: "POST",
        //     success:res=>{
        //       wx.request({
        //         url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addOrUpdateInviteBindTemporary',
        //         data: {
        //           inviterOpenid: that.data.inviterOpenid,
        //           passiveBindOpenid: that.data.openid,
        //           passiveBindUnionid: that.data.unionId,
        //           shopId: that.data.shopid,
        //         },
        //         method: "POST",
        //       })
        //     }
        //   })
          
        // }
        if (res.data.list != undefined && res.data.list != "" && res.data.list.isFocus != '0') {
          console.log("关注成功")
          if (that.data.isRegister == 0) {
            wx.showModal({
              content: '您尚未注册"切瓜切菜"平台账户\n注册平台即可获取平台的5个星盾奖励和商家的买单打折优惠',
              cancelText: '直接购买',
              confirmText: '前往注册',
              success: res => {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../register/register?openId=' + that.data.openid + '&unionId=' + that.data.unionId,
                  })
                }
              }
            })
          }
        } else {
          wx.showModal({
            content: '您尚未关注"切瓜切菜"公众号\n关注公众号即可获取平台的5个星盾奖励和商家的买单打折优惠',
            cancelText: '直接购买',
            confirmText: '前往关注',
            success: res => {
              if (res.confirm) {
                wx.request({
                  url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addOrUpdateShopMiddleTemporary',
                  data: {
                    shopId: that.data.shopid,
                    unionId: that.data.unionId,
                  },
                  method: "POST",
                  success: res => {
                    wx.request({
                      url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addOrUpdateInviteBindTemporary',
                      data: {
                        inviterOpenid: that.data.inviterOpenid,
                        passiveBindOpenid: that.data.openid,
                        passiveBindUnionid: that.data.unionId,
                        shopId: that.data.shopid,
                      },
                      method: "POST",
                      success:res=>{
                        if (app.globalData.customerInf.signIn == 1) {
                          wx.request({
                            url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addLink',
                            data: {
                              unionId: app.globalData.unionID,
                              title: "点击这里继续购买",
                              link: "/pages/module_others/pages/distributionBuy/distributionBuy?shopid=" + that.data.shopid + '&distributionUuid=' + that.data.uuid + '&inviterOpenid=' + that.data.inviterOpenid
                            },
                            method: 'GET',
                            success(res) {
                              wx.navigateTo({
                                url: '/pages/module_others/pages/wxPublic/out',
                              })
                            }
                          })
                        } else {
                          wx.request({
                            url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addLink',
                            data: {
                              unionId: app.globalData.unionID,
                              title: "点击这里前往小程序",
                              link: "/pages/module_others/pages/register/register?inviteBuy=true&shopid=" + that.data.shopid + '&distributionUuid=' + that.data.uuid + '&inviterOpenid=' + that.data.inviterOpenid
                            },
                            method: 'GET',
                            success(res) {
                              wx.navigateTo({
                                url: '/pages/module_others/pages/wxPublic/out',
                              })
                            }
                          })
                        }
                      }
                    })
                    
                  }
                })
              }
            }
          })
        }
      }
    })
  },
})