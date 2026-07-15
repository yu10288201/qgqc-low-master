// pages/balance_list/balance_list.js
const app = getApp();
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    user_balance: 0, //用户余额
    existingBalance: 0,
    user_id: "",
    user_record: [],
    listIndex: null,
    openDetail: false,

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      shop_id: options.shopId,
      shop_name: options.shopName,
    })
    that.getCustomerInfo(app.globalData.openid)

  },
  //选择列表
  chooseList(e) {
    let that = this
    console.log(e);
    console.log(e.currentTarget.dataset.index);
    that.setData({
      listIndex: e.currentTarget.dataset.index
    })
  },
  //详情
  openAllDetail() {
    let that = this
    let a = that.data.listIndex
    if(a == null){
        wx.showToast({
            title: '请选择具体预存记录',
            icon: 'error',
            duration: 1000
        })
        return
    }
    
    let b = that.data.user_record[a].status
    if (b === "0") {
      console.log(that.data.user_record[a].id, '选中id');
      //查询订单详情
    //   wx.request({
    //     url: app.globalData.SelectOneOrderByOrderId_url,
    //     data: {
    //       order_id: that.data.user_record[a].id
    //     },
    //     success: res => {
    //       console.log(res);
    //       if (res.data.result.result === 1) {
    //         res.data.object.order_code = res.data.object.order_code.substring(14,19)
    //         res.data.object.operation_time = util.formatTime3(res.data.object.operation_time, 'Y-M-D h:m:s')
    //         that.setData({
    //           orderDetail: res.data.object,
    //           openDetail: true,
    //           consumptionDetail: true
    //         })
    //       }
    //     }
    //   })
    wx.navigateTo({
        url: '../../../module_discount/pages/superValueOrderDetail/superValueOrderDetail?orderId=' + that.data.user_record[a].id + '&packageIndex=2',
    })
    } else {
      console.log(that.data.user_record[a].id, '选中id');
      //查询充值明细
      wx.request({        
        url: app.globalData.SelectOneAddAccount_Url,
        data: {
          userId: that.data.user_record[a].id,
          shopId: that.data.user_record[a].shopId,
          usePhone: that.data.user_record[a].userPhone
        },
        success: res => {
          if (res.data.result.result === 1) {
            res.data.object.create_time = util.formatTime3(res.data.object.create_time.time, 'Y-M-D')
            if(res.data.object.confirmTime){
              res.data.object.confirmTime = util.formatTime3(res.data.object.confirmTime.time, 'Y-M-D h:m:s')
            }else{
              res.data.object.confirmTime = ''
            }
            that.setData({
              prestoreDetail: true,
              openDetail: true,
              addAccountDetail: res.data.object
            })
          }
        }

      })
    }
  },
  //关闭详情
  clocePop() {
    let that = this
    that.setData({
      prestoreDetail: false,
      consumptionDetail: false,
      openDetail: false,
    })
  },
  consumptionDetailed(phone) {
    let that = this
    wx.request({
      // url: 'http://localhost:8088/evaluation/getConsumptionDetailed',
      url: app.globalData.getConsumptionDetailed_url,
      data: {
        userPhone: phone,
        shopId: that.data.shop_id,
      },
      success: res => {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].createTime = util.formatTime3(res.data[i].createTime, 'Y-M-D')
        }
        that.setData({
          user_record: res.data
        })
      }
    })
  },
  getCustomerInfo() {
    let that = this
    wx.request({
      url: app.globalData.selectCustomerInfByOpenId_url,
      // url: 'http://localhost:8887/evaluation_war/selectCustomerInfByOpenId',
      method: 'POST',
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json;charset=utf-8' // 默认值
      },
      success: res => {
        that.consumptionDetailed(res.data.phone)
        wx.request({
          url: app.globalData.houduan_war_exploded_url,
          data: {
            shop_id: that.data.shop_id,
            phone: res.data.phone,
            name: ''
          },
          success: res => {
            console.log(res, '预存余额');
            if (res.data.object[0].prepaidDeposit != undefined || res.data.object[0].prepaidDeposit > 0) {
              console.log(res.data.object[0].prepaidDeposit, '现有余额');
              that.setData({
                existingBalance: res.data.object[0].prepaidDeposit
              })
            }
          }
        })
      }
    })

  },
  returnBack: function () {
    var pages = getCurrentPages(); //当前页面
    var beforePage = pages[pages.length - 2]; //前一页
    wx.navigateBack({
      success: function () {
        // beforePage.onLoad(); // 执行前一个页面的onLoad方法
      }
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