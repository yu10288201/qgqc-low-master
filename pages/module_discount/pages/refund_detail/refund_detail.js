// pages/module_discount/pages/refund_detail/refund_detail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
  },

  selectPayMentRefund(e){
    var that =this
    wx.showLoading({
      title: '加载中',
      mask:true
    })
    wx.request({
      url: app.globalData.getPayMentRefund_url,
      data:{
        payMentRefund_code:'',
        payMentRefundId:'',
        order_id:that.data.orderId,
        order_type:that.data.order_type,
        shop_id:''
      },
      method:'GET',
      header: {
        'content-type': 'application/json'
      },
      success:function(res){
        console.log(res)
        if(res.data.result.result ==1){
          var semp =res.data.object[0]
          var recordList=[]
          var createMap={
            title:"申请成功",
            data:semp.create_date.substring(0,19),
            msg:"您已提交申请退款，等待确认!"
          }
          var shopVerifyMap={
            title:"切瓜切菜审核通过",
            data:semp.shopVerifyDate.substring(0,19),
            msg:"切瓜切菜已受理您的退款申请!"
          }
          var refuseShopVerifyMap={
            title:"切瓜切菜拒绝您的退款申请",
            data:semp.shopVerifyDate.substring(0,19),
            msg:semp.shop_describe
          }
          var acceptMap={
            title:"微信受理退款",
            data:semp.shopVerifyDate.substring(0,19),
            msg:"您的退款申请已被微信受理!"
          }
          var refundMap={
            title:"退款已入账",
            data:semp.refund_date.substring(0,19),
            msg:"微信将在 "+ semp.refund_date.substring(0,19) +" 前将 "+ that.data.orderTotal/100 +" 元入账至您的微信零钱，如有疑问请使用交易号 "+semp.payMentRefund_code+" 拨打微信客服 95017 咨询"
          }
          if(semp.refund_status==0&&semp.shop_verify==0){ //等待退款
            recordList.push(createMap)
          }else if(semp.refund_status==0&&semp.shop_verify==1){ //同意退款
            recordList.push(createMap)
            recordList.push(shopVerifyMap)
          }else if(semp.refund_status==0&&semp.shop_verify==2){ //拒绝
            recordList.push(createMap)
            recordList.push(refuseShopVerifyMap)
          }else if(semp.refund_status==2){  //退款中
            recordList.push(createMap)
            recordList.push(shopVerifyMap)
            recordList.push(acceptMap)
          }else if(semp.refund_status==1){  //退款已完成
            recordList.push(createMap)
            recordList.push(shopVerifyMap)
            recordList.push(acceptMap)
            recordList.push(refundMap)
          }
          that.setData({
            selectPayMentRefund:res.data.object,
            recordList:recordList
          })
          wx.hideLoading()
        }else{
          that.setData({
            selectPayMentRefund:[],
            recordList:[]
          })
          wx.hideLoading()
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that =this
    that.setData({
      orderCode:options.orderCode,
      orderName:options.orderName,
      orderTotal:options.orderTotal,
      shopName:options.shopName,
      order_type:options.order_type,
      orderId:options.orderId
    })
    that.selectPayMentRefund()
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