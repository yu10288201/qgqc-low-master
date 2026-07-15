// pages/myStarCoin/myStarCoin.js
const app = getApp(); //引入全局变量
const util = require("../../utils/util.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    openId: '',
    unionId: '',
    pageIndex: 0,
    choseFlesh: true,
    shopId: '',
    isPlatform: false,
    sum1: 0,
    sum2: 0 
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this 
    that.setData({
      shopId: options.shopId,
      isPlatform: options.shopId == app.globalData.platformShopId
    })
  },
  getCustomerInfo(openId){
    let that = this 
    wx.request({
      url: app.globalData.selectCustomerInfByOpenId_url,
      data:{
        openid: openId,
      },
      method: 'POST',
      success:res=>{
        console.log(res.data);
        that.setData({
          customerInfo: res.data
        })
        if (res.data.signIn != 1) {
          wx.showModal({
            title: '您尚未注册平台,不能进行查询星盾!',
            cancelText: '返回',
            confirmText: '去注册',
            success(res) {
              console.log(res.confirm);
              console.log(res.cancel);
              if (res.confirm) {
                wx.navigateTo({
                  url: '../module_others/pages/register/register?openId=' + that.data.openId + '&unionId=' + that.data.unionId,
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1,
                })
              }
            }
          })
        } else{
          that.getStarList()
        }
      }
    })
  },
  listFlesh(){
    if(this.data.choseFlesh){
      this.setData({
        pageIndex: Number(this.data.pageIndex)+1
      })
      this.getStarList()
    }
  },
  getStarList(){
    let that = this
    wx.request({
      // url: 'http://localhost:8889/evaluation/getListByShopId',
      url: app.globalData.getListByShopId_url,
      data:{
        shopId: that.data.shopId,
        customerId: that.data.customerInfo.id,
        // customerId: 2013,
        pageIndex: that.data.pageIndex,
      },
      success: res=>{
        console.log(res.data.list);
        let a = that.data.listData
        if(res.data.list.length < 20){
          that.setData({
            choseFlesh: false
          })
        }
        for (let i = 0;i < res.data.list.length;i++) {
          // x.createTime = util.formatTime3(x.createTime,'Y-M-D')
          let obj = res.data.list[i];
          if(i == 0){
            obj["starSum"] = obj.starNum;
          }else{
            obj["starSum"] = obj.starNum + res.data.list[i - 1].starSum;
          }
          a.push(obj);
        }
        
        that.setData({
          listData: a
        },()=>{
          let sum1 = 0;
          let sum2 = 0;
          for(let item of a){
            if(item.type == 1){
              sum1 += item.starNum;
            }else{
              sum2 += item.starNum;
            }
          }

          that.setData({
            sum1,sum2
          })
        })
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
    let that = this
    console.log(app.globalData.unionID, 'unionId');
    console.log(app.globalData.openid, 'openId');
    that.setData({
      openId: app.globalData.openid,
      unionId: app.globalData.unionID,
    })
    that.getCustomerInfo(app.globalData.openid)
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


})