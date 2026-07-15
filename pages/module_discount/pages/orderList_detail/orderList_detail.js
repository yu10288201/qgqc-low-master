// pages/orderList_detail/orderList_detail.js
var util = require('../../../../utils/util.js');
const app = getApp(); //引入全局变量
Page({

  /**
   * 页面的初始数据
   */
  data: {
id:0,
actionSheetHidden1:true,
actionSheetHidden: true,
Successful_appointment:true,
fail_appointment:true
  },
  callsever:function(e){
   wx.navigateTo({
     url: '../newchat/newchat',
   })
  },
  callshop:function(e){
wx.makePhoneCall({
  phoneNumber: this.data.shopList.contact_number,
})
  },
  goshop(e){
wx.navigateTo({
  url: '../Shop_ordering/Shop_ordering?shop_id='+this.data.shopList.shop_id,
})
  },
  assess(e){
    var that =this
    wx.navigateTo({
      url: '../assess1/assess1?dishes_id='+that.data.setMealID+'&order_id='+that.data.order_id+'&order_status='+that.data.SelectTicketOrderInfo[0].order_status+'&id='+that.data.id+'&shop_id='+that.data.shopList.shop_id,
    })
  },

  SelectTicketOrderInfo:function(e){
    var that= this
    wx.request({
      url:  app.globalData.SelectTicketOrderInfo_url,
      // url: 'https://test.fsmbdlkj.com/WX Restaurant/SelectTicketOrderInfo',
      data: {
        "order_id":that.data.order_id,                      
        "user_id":"",
        "shop_id":""
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      method: 'POST',
      success: function(res) {
       console.log(res)
       var create_date = []
       for(var x of res.data.object){
        var s = x.create_date.indexOf('.') //找到第一次出现下划线的位置
        create_date.push(x.create_date.substring(0,s))
       }
       var ordernum = ''
       var i =0
       for(var x of res.data.object[0].order_code){
         if(i%4==0){
           ordernum =ordernum+' '+x
         }else{
         ordernum = ordernum+x
         }
         i++
       }
       var SelectTicketOrderInfo= res.data.object
       that.setData({
        SelectTicketOrderInfo:SelectTicketOrderInfo,
        create_date:create_date,
        ordernum:ordernum
       })
       wx.request({
        url:  app.globalData.Selectshopid_url,
        // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectshopid',
        method:'POST',
        data: {         
          shop_id:that.data.SelectTicketOrderInfo[0].shop_id,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function(res) {
        console.log(res)
        var shopList = res.data[0]
        that.setData({
          shopList:shopList
        })
        }
      })
    }
    })
  },
  again:function(e){
    var that= this
    wx.request({
      url:  app.globalData.SelectTicketOrderDetailed_url,
      // url: 'https://test.fsmbdlkj.com/WX Restaurant/SelectTicketOrderDetailed',
      data: {
        "id":"",                      
        "order_id":that.data.order_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      method: 'POST',
      success: function(res) {
       //console.log(res)
       var orderList_detail = res.data.object
       that.setData({
         orderList_detail:orderList_detail
       })
       var i =0
         for(var x of res.data.object){
                 if(x.appointment==1&&x.appointmentOnShop==0&&x.ticket_status==0){
                   i=1
                 }else if(x.appointment==0&&x.appointmentOnShop==1&&x.ticket_status==0){
                   i=2
                 }else if(x.appointment==2&&x.appointmentOnShop==0&&x.ticket_status==0){
          i=3
        }
               }
       if(i ==1){
        setTimeout(function(){
          that.again()
        }, 10000);
       }
       if(i ==2){
         that.setData({
          Successful_appointment:!that.data.Successful_appointment
         })
       }
       if(i==3){
        that.setData({
        fail_appointment:!that.data.fail_appointment
      })
       }
      }
    })
  },
  shoptap:function(e){
    var that =this
    if(that.data.id ==0){
    wx.navigateTo({
      url: '../shop/shop?setMealID='+that.data.setMealID+'&id='+that.data.id,
    })
  }else{
    wx.navigateTo({
      url: '../shop/shop?coupon_id='+that.data.setMealID+'&id='+that.data.id,
    })
  }
  },
  selectshop:function(e){
    var that =this
    if(that.data.id ==0){
     var setMealID=that.data.setMealID
     var coupon_id=''
    }else{
      var setMealID=''
      var coupon_id=that.data.setMealID
    }
    wx.request({
      url:  app.globalData.taocan.selectSetmeal_url,
      // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectSetmeal',
      method: 'POST',
      data: {
        setMealID:setMealID,
        coupon_id:coupon_id
        
      },
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
      //console.log(res.data)
      var shop=res.data
      that.setData({
        shop:shop
      })
      }
    })
  },
  meal:function(e){
    var that= this
    wx.request({
      url:  app.globalData.selectSetMealInfo_url,
      // url: 'https://test.fsmbdlkj.com/diancanxing/setMeal/selectSetMealInfo',
      data: {
        setMealID:that.data.setMealID,             
        shop_id:"",
        startUsing:"",
        typeForSetMeal:''
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
       console.log(res)
       var mealList = res.data.selectResult[0]
       var time = res.data.selectResult[0].timeForUse
       var num = 1
       var endnum = 0
       var timeList = []
       for (var i of time) {
         if (i == ';') {
           timeList.push(time.substring(endnum, num - 1))
           endnum = num
         }
         if (num == time.length) {
           timeList.push(time.substring(endnum, time.length))
         }
         num++
       }
       for (var y = 0; y < timeList.length; y++) {
         if (y % 2 == 0) {
           timeList[y] = timeList[y] + '~'
         } else {
           if (y == timeList.length - 1) {} else {
             if (y == 3) {
               timeList[y] = timeList[y] + '\n'
             } else {
               timeList[y] = timeList[y] + '|'
             }
           }
         }
       }
       that.setData({
        mealList:mealList,
        timeList: timeList
       })
      }
    })
  },
  selectCoupon:function(e){
    var that= this
    wx.request({
      url:  app.globalData.selectCoupon_url,
      // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectCoupon',
      data: {
        coupon_id:that.data.setMealID,             
        shop_id:""
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
       console.log(res)
       var mealList = res.data[0]
       that.setData({
        mealList:mealList
       })
      }
    })
  },

  longTap:function (e) {
    var that =this
    wx.setClipboardData({
      data: that.data.SelectTicketOrderInfo[0].order_code,
      success: function (res) {
      }
      })
 
  },

  getcode:function(e){
    var that= this
    that.setData({
      index: e.currentTarget.dataset.index
    })
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      data: {
        grant_type:'client_credential',             
        appid:"wxd5cdf788dbd8a0d7",
        secret:"bda2220dfece9a80c1f2eb47859043d8"
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      success: function(res) {
       console.log(res)
       wx.request({
        url: 'https://api.weixin.qq.com/cgi-bin/wxaapp/createwxaqrcode?access_token='+res.data.access_token,
        data: {
          path:"pages/index/index?id="+that.data.orderList_detail[that.data.index].id+'&order_id='+that.data.orderList_detail[that.data.index].order_id+'&shop_id='+that.data.SelectTicketOrderInfo[0].shop_id      
        },
        responseType: 'arraybuffer',
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function(res) {
         console.log(res)
         var url = wx.arrayBufferToBase64(res.data)
         console.log(url)
         that.setData({
           codeImage:url,
           actionSheetHidden1:!that.data.actionSheetHidden1
         })
        }
      })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({                       
      id : options.id,
      order_id:options.order_id,
      setMealID:options.setMealID
    })
    if(options.id ==0){
      that.meal()
      }else{
        that.selectCoupon()
      }
    that.selectshop()
    that.SelectTicketOrderInfo()
    that.again()
  },
  coupon:function(e){
  this.setData({
    actionSheetHidden1:false
  })
  },
  modalChange:function(e) {
    this.setData({
    actionSheetHidden1: true
    })  
  },
  modalChange1:function(e) {
    this.setData({
    actionSheetHidden: !this.data.actionSheetHidden
    })  
  },
  modalChange2:function(e) {
    this.setData({
      Successful_appointment: !this.data.Successful_appointment
    })  
  },
  modalChange3:function(e) {
    this.setData({
      fail_appointment: !this.data.fail_appointment
    })  
  },
  startDateChange: function (e) { //选择开始日期
    var that = this
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      startdate: e.detail.value
    })
  },
  startTimeChange: function (e) { //选择开始日期
    var that = this
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    that.setData({
      starttime: e.detail.value
    })
  },
  gosubscribe: function (e) {
    var that = this
    // 再通过setData更改Page()里面的data，动态更新页面的数据

    var time = util.formatTime(new Date());
    console.log(time)
    var appointment_time = that.data.startdate + ' ' + that.data.starttime + ':00'
    var appointment_time1 = that.data.startdate + ' ' + '00:00:00'
    var appointment_time2 = that.data.startdate + ' ' + '23:59:59'
    if (that.data.startdate == undefined || that.data.starttime == undefined || appointment_time < time ) {
      wx.showToast({
        title: '预约时间不正确',
        icon: 'success',
        duration: 2000
      })
    } else {
      that.setData({
        actionSheetHidden: !that.data.actionSheetHidden
      })
      wx.request({
        url:  app.globalData.SelectAppointment_url,
        // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectAppointment',
        data: {
          "appointment_time1": appointment_time1,
          "appointment_time2": appointment_time2
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          console.log(res.data[0])
            if (res.data[0] >= that.data.mealList.dailySales&&that.data.mealList.dailySales!=0) {//修改
                        wx.showToast({
                          title: '今日预约数量已达上限',
                          icon: 'success',
                          duration: 2000
                        })
                      } else{
                    wx.request({
                      url:  app.globalData.UpdateTicketOrderDetailed_url,
                        // url: 'https://test.fsmbdlkj.com/WX Restaurant/UpdateTicketOrderDetailed',
                      data: {
                        "id": that.data.orderList_detail[that.data.index].id,
                        "ticket_status": "0",
                        "action_time": "",
                        "ticket_remark": "",
                        "appointment": "1",
                        "appointment_time": appointment_time
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                      },
                      method: 'POST',
                      success: function (res) {
                        console.log(res)
                        wx.showModal({
                          title: '提示',
                          content: '提交成功!请注意查看\n订单是否预约成功',
                          success: function (res) {
                            if (res.confirm) {
                              setTimeout(function(){
                                that.again()
                              }, 10000);
                            } else {
                              setTimeout(function(){
                                that.again()
                              }, 10000);
                            }
                          }
                        })
                        
                      }
                    })
          }
        }
      })
    }
  },
  // selectConfirmation: function (e) {
  //   var that = this
  //   for (var x = 0; x < that.data.subscribeNum; x++) {
  //     wx.request({
  //         url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectConfirmation',
  //       data: {
  //         "order_id": that.data.Order[x].id
  //       },
  //       header: {
  //         'content-type': 'application/json'
  //       },
  //       method: 'POST',
  //       success: function (res) {
  //         console.log(res)
  //         var Confirmation = res.data
  //         that.setData({
  //           Confirmation:Confirmation
  //         })
  //         if (res.data == '') {
  //           setTimeout(function () {
  //             that.selectConfirmation()
  //           }, 10000)
  //         } else {}
  //       }
  //     })
  //   }
  // },
  subscribe: function (e) {
    var that = this
    that.setData({
      index : e.currentTarget.dataset.index
      })
    that.setData({
      actionSheetHidden: !that.data.actionSheetHidden
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