// pages/balance_list/balance_list.js
const app = getApp();
const util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mall_member_total_recharge_amount: 0, //用户余额
    member_balance_array:[],//预存消费记录
    type_1:true,
    type_2:false,
    recharge_item:null,
    consumption_item:null,


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
    this.selectMallMemberTotalRechargeAmount();
    this.selectMallMemberBalance();
  },
  closePop(e){
    this.setData({
      type_1:false,
      type_2:false,
    })
  },
  selectMallMemberTotalRechargeAmount(){
    var that=this;

    var customer_openid=app.globalData.openid;
    if(customer_openid==undefined||customer_openid==null||customer_openid==''){
        that.showErrMsg("unionid为空");
        return;
    }
    wx.request({
      url: app.globalData.selectMallMemberTotalRechargeAmount,
      data: {customer_openid:customer_openid},
      header: {
          'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
          if(res.data.code==1000){
                var mall_member_total_recharge_amount=res.data.data;
                that.setData({
                  mall_member_total_recharge_amount:mall_member_total_recharge_amount,
                })

          }else{
                that.showErrMsg(""+res.data.msg);
          }
      }
    })
  },
  selectMallMemberBalance(){
    var that=this;

    var customer_openid=app.globalData.openid;
    if(customer_openid==undefined||customer_openid==null||customer_openid==''){
        that.showErrMsg("unionid为空");
        return;
    }
    wx.request({
      url: app.globalData.selectMallMemberBalance,
      data: {customer_openid:customer_openid},
      header: {
          'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
          if(res.data.code==1000){
                var member_balance_array=res.data.data;
                that.setData({
                  member_balance_array:member_balance_array,
                })

          }else{
                that.showErrMsg(""+res.data.msg);
          }
      }
    })
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
  detailShow() {
    let that = this
    let listIndex = that.data.listIndex
    if(listIndex == null){
        wx.showToast({
            title: '请选择具体预存记录',
            icon: 'error',
            duration: 1000
        })
        return
    }
    var type = that.data.member_balance_array[listIndex].type;
    var id=that.data.member_balance_array[listIndex].id;

    if(type==1){
      that.selectMallMemberRechargeRecordById(id)
    }else{

      that.selectMallMemberConsumptionRecordById(id)
    }
    return;
  },
  selectMallMemberRechargeRecordById(id){
    var that=this;
    wx.request({
      url: app.globalData.selectMallMemberRechargeRecordById,
      data: {id:id},
      header: {
          'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
          if(res.data.code==1000){
                var recharge_item=res.data.data;
                that.setData({
                  recharge_item:recharge_item,
                  type_1:true,
                })

          }else{
                that.showErrMsg(""+res.data.msg);
          }
      }
    })


  },
  selectMallMemberConsumptionRecordById(id){

     var that=this;
      wx.request({
      url: app.globalData.selectMallMemberConsumptionRecordById,
      data: {id:id},
      header: {
          'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
          if(res.data.code==1000){
                var consumption_item=res.data.data;
                that.setData({
                  consumption_item:consumption_item,
                  type_2:true,
                })

          }else{
                that.showErrMsg(""+res.data.msg);
          }
      }
    })

  },
  showErrMsg(msg,icon='error'){
    wx.showToast({
      title: ''+msg,
      icon:icon,
    })
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