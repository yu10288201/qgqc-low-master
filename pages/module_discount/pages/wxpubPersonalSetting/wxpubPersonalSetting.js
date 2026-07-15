// pages/module_discount/pages/wxpubPersonalSetting/wxpubPersonalSetting.js
let app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    receiveDailySum: '', //接收数量
    receiveStartTime: '', //接收开始时间
    receiveEndTime: '', //接收结束时间
    shopList: [], //店铺列表
    pageIndex: 0, //分页第几页
    pageSize: 20, //查询数量
    shopName: '', //查询的店铺名称
    unionId: '',
    openId: '',
    focusId: '',
    customerInf: '', //用户信息
  },

  onLoad: function (options) {

  },

  onShow() {
    let that = this;

    if(app.globalData.unionID){
      that.setData({
        unionId: app.globalData.unionID,
        openId: app.globalData.openid,
      })
      wx.request({
        url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
        data: {
          unionId: app.globalData.unionID
        },
        success: res => {
          if (res.data.list != null && res.data.list != "" && res.data.list.isFocus != '0') {
            that.setData({
              focusId: res.data.list.focusId,
              checkWxpublic: true
            })
            
            wx.request({
              url: app.globalData.selectCustomerInfByOpenId_url,
              data: {
                openid: app.globalData.openid
              },
              method: 'POST',
              success: res2 => {
                console.log(res2,"res2");
                that.setData({
                  customerInf: res2.data
                },()=>{
                  let data = {
                    unionId: app.globalData.unionID,
                    platformShopId: app.globalData.platformShopId,
                    pageIndex: that.data.pageIndex,
                    pageSize: that.data.pageSize
                  }
                  that.selectShop(data);
                  that.selectReceiveCount();
                })
                wx.hideLoading();
              }
            })
          } else {
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '您尚未关注，是否前往关注',
              success: res => {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '../../../module_others/pages/wxPublic/out',
                  })
                } else {
                  wx.navigateTo({
                    url: '../../../main/main',
                  })
                }
              }
            })
          }
        }
      })
      return
    }
    let promise = that.selectUnionID();
    promise.then(res=>{
      if(res){
        let data = {
          unionId: that.data.unionId,
          platformShopId: app.globalData.platformShopId,
          pageIndex: that.data.pageIndex,
          pageSize: that.data.pageSize
        }
        that.selectShop(data);
        that.selectReceiveCount();
      }
    })
  },

  //获取是否关注平台
  selectUnionID() {
    let that = this;

    wx.showLoading({
      title: '请稍等...',
    })
    return new Promise((resolve, reject) => {
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code
            wx.getUserInfo({
              success: function (res) {
                wx.request({
                  url: app.globalData.allUrl.getUnionID,
                  data: {
                    code: code,
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    wechatAppId: app.getWechatAppId(),
                    //wsk: app.globalData.wsk,
                  },
                  header: {
                    'content-type': 'application/json;charset=utf-8' // 默认值
                  },
                  method: 'POST',
                  success: function (res) {
                    that.setData({
                      unionId: res.data.data.unionId,
                      openId: res.data.data.openid
                    })
                    wx.request({
                      url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
                      data: {
                        unionId: that.data.unionId
                      },
                      success: res => {
                        if (res.data.list != null && res.data.list != "" && res.data.list.isFocus != '0') {
                          that.setData({
                            focusId: res.data.list.focusId,
                            checkWxpublic: true
                          })
                          
                          wx.request({
                            url: app.globalData.selectCustomerInfByOpenId_url,
                            data: {
                              openid: that.data.openId
                            },
                            method: 'POST',
                            success: res2 => {
                              console.log(res2,"res2");
                              that.setData({
                                customerInf: res2.data
                              })
                              wx.hideLoading();
                              resolve(true);
                            }
                          })
                        } else {
                          wx.hideLoading();
                          resolve(false);
                          wx.showModal({
                            title: '提示',
                            content: '您尚未关注，是否前往关注',
                            success: res => {
                              if (res.confirm) {
                                wx.navigateTo({
                                  url: '../../../module_others/pages/wxPublic/out',
                                })
                              } else {
                                wx.navigateTo({
                                  url: '../../../main/main',
                                })
                              }
                            }
                          })
                        }
                      }
                    })
                  }
                })
              }
            })
          }
        }
      })
    })
  },

  //查询商家
  selectShop(obj, isClick) {
    let that = this;
    let data = obj;

    wx.showLoading({
      title: '请稍等...',
    })

    wx.request({
      url: app.globalData.getShopListByUnionId,
      data: data,
      success: res => {
        if (res.data.code == 1) {
          //当前店铺列表
          let shopList1 = that.data.shopList;
          //分页查询返回的新店铺列表
          let shopList2 = res.data.paramsList;
          //拼接的新列表
          let shopList = [];

          if (isClick) {
            shopList1 = [];
          }

          if (shopList2.length == 0) {
            wx.showToast({
              title: '已经到底啦！',
              icon: 'error'
            })

            wx.hideLoading();
            return;
          }

          if (shopList1.length != 0) {
            shopList = shopList1.concat(shopList2);
          } else {
            shopList = shopList2;
          }

          that.setData({
            shopList: shopList
          }, () => {
            wx.hideLoading()
          })
        } else {
          wx.showToast({
            title: '查询失败',
            icon: 'error'
          })

          wx.hideLoading()
        }
      },
    })
  },

  //通过名称查询店铺列表
  selectShopByName() {
    let that = this;

    that.setData({
      pageIndex: 0,
    }, () => {
      let data = {
        unionId: that.data.unionId,
        platformShopId: app.globalData.platformShopId,
        shopName: that.data.shopName,
        pageIndex: that.data.pageIndex,
        pageSize: that.data.pageSize
      }

      //点击查询
      let isClick = true;
      that.selectShop(data, isClick);
    })
  },

  //scroll-view触底触发 分页查询店铺列表
  reachBottom() {
    let that = this;

    let pageIndex = that.data.pageIndex;

    that.setData({
      pageIndex: Number(pageIndex) + 1,
    })

    let data = {
      unionId: that.data.unionId,
      platformShopId: app.globalData.platformShopId,
      pageIndex: pageIndex + 1,
      pageSize: that.data.pageSize
    }

    that.selectShop(data);
  },

  //选择开始时间
  bindTimeChange1(e) {
    this.setData({
      receiveStartTime: e.detail.value,
    })
  },

  //选择结束时间
  bindTimeChange2(e) {
    this.setData({
      receiveEndTime: e.detail.value,
    })
  },

  //保存设置
  saveAll() {
    let that = this;

    let receiveDailySum = that.data.receiveDailySum;
    let receiveStartTime = that.data.receiveStartTime;
    let receiveEndTime = that.data.receiveEndTime;

    if (!receiveDailySum) {
      wx.showToast({
        title: '请填写接收量',
        icon: 'error'
      })
      return;
    }

    if (receiveStartTime) {
      if (receiveEndTime) {
        let str1 = '2020/1/1 ' + receiveStartTime;
        let str2 = '2020/1/1 ' + receiveEndTime;

        if (new Date(str1).getTime() > new Date(str2).getTime()) {
          wx.showToast({
            title: '正确选择时间！',
            icon: 'error'
          })
          return;
        }
      } else {
        wx.showToast({
          title: '填写结束时间',
          icon: 'error'
        })
        return;
      }
    } else {
      wx.showToast({
        title: '填写开始时间',
        icon: 'error'
      })
      return;
    }

    wx.showLoading({
      title: '保存中...',
    })
    //接口：保存设置============================================
    wx.request({
      url: app.globalData.updateFansSetting,
      data: {
        unionId: that.data.unionId,
        receiveStartTime: receiveStartTime,
        receiveEndTime: receiveEndTime,
        receiveDailySum: that.data.receiveDailySum
      },
      success: res => {
        if (res.data.code == 1) {
          wx.showToast({
            title: '保存成功!',
            icon: 'success'
          })
        } else {
          wx.showToast({
            title: '保存失败!',
            icon: 'error'
          })
        }
        wx.hideLoading();
      }
    })
  },

  //查询每日接收信息量
  selectReceiveCount() {
    let that = this;

    wx.showLoading({
      title: '请稍等...',
    })

    wx.request({
      url: app.globalData.getFansSetting,
      data: {
        unionId: that.data.unionId
      },
      success: res => {
        if (res.data.code == 1) {
          that.setData({
            receiveDailySum: res.data.params.receive_daily_sum,
            receiveStartTime: res.data.params.receive_start_time ?  res.data.params.receive_start_time.substring(0, 5) :'',
            receiveEndTime: res.data.params.receive_end_time ? res.data.params.receive_end_time.substring(0, 5) : '',
          })
        } else {
          wx.showToast({
            title: '查询失败...',
            icon: 'error'
          })
        }
        wx.hideLoading()
      }
    })
  },

  //输入接收量
  inputReceiveCount(e) {
    this.setData({
      receiveDailySum: e.detail.value
    })
  },

  //选择需要关注的商家
  updateSelectShop(e) {
    let that = this;
    let obj = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    let shopList = that.data.shopList;

    if (e.detail.value[0] == 1) {
     

      wx.showLoading({
        title: '关注中...',
      })

      //关注商家
      wx.request({
        url: app.globalData.addOrUpdatePublicFans,
        method: 'POST',
        data: {
          shopId: obj.shop_id,
          customerId: that.data.customerInf.id,
          focusId: that.data.focusId,
          fansSource: '',
          nickName: that.data.customerInf.name,
          isFocus: 1,
          fansSex: that.data.customerInf.gender == "未知" ? 0 : that.data.customerInf.gender == "男" ? 1 : 2 ,
          unionId: that.data.unionId
        },
        success: res => {
          if (res.data.code == 1) {
            wx.showToast({
              title: '关注成功!',
              icon: 'success'
            })
            shopList[index].isFocus = 1;
          } else {
            wx.showToast({
              title: '关注失败!',
              icon: 'error'
            })
          }
          wx.hideLoading();
        }
      })
    } else {
      

      wx.showLoading({
        title: '取消中...',
      })

      //取消关注商家
      wx.request({
        url: app.globalData.addOrUpdatePublicFans,
        method: 'POST',
        data: {
          customerId: that.data.customerInf.id,
          shopId: obj.shop_id,
          unionId: that.data.unionId,
          isFocus: 0
        },
        success: res => {
          if (res.data.code == 1) {
            wx.showToast({
              title: '取消成功!',
              icon: 'success'
            })
            shopList[index].isFocus = 0;
          } else {
            wx.showToast({
              title: '取消失败！',
              icon: 'error'
            })
          }
          wx.hideLoading();
        }
      })
    }

    that.setData({
      shopList: shopList
    })
  },

  inputName(e) {
    this.setData({
      shopName: e.detail.value
    })
  }
})