const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: true,
    invitation_image: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/treat/bg3.png'
  },

  //单选框 
  changeradio: function(e) {
    var that = this;
    that.setData({
      index: !that.data.index
    })
  },

  //获取备注
  getcontent: function(e) {    
    this.setData({
      sharetitle1: e.detail.value
    })   
  },

  //获得此用户所有信息
  getallorder: function() {
    var that = this;
    wx.request({
      url: app.globalData.GetOrderInf_url,
      data: {
        User_id: app.globalData.user_id,
        shop_id: app.globalData.shopid
      },
      success: function(res) {
        for (var i = 0; i < res.data.object.length; i++) {
          if (res.data.object[i].order_id == that.data.orderid) {
            var field = app.globalData.field
            //找出tableid对应的厅名或房名
            for (var a = 0; a < field.length; a++) {
              for (var b = 0; b < field[a].tableManage.length; b++) {
                if (field[a].tableManage[b].table_id == res.data.object[i].table_id) {
                  that.setData({
                    fieldname: field[a].field_name
                  })
                }
              }
            }
            //对到店时间进行处理
            var arrivaltime = res.data.object[i].arrival_time
            var datetime = arrivaltime.split(" ")
            var date = datetime[0]
            var time = datetime[1].split(":")
            var hour = time[0]
            var minute = time[1]
            that.setData({
              orderinfo: res.data.object[i],
              date: date,
              hour: hour,
              minute: minute
            })
          }
        }
      },
    })
  },

  //获取详细订单
  getorderdetail: function() {
    var that = this
    wx.request({
      url: app.globalData.GetOrderDetails_url,
      data: {
        Order_id: that.data.orderid
      },
      success: function(res) {
        that.setData({
          orderDetail: res.data.object,
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    that.setData({
      orderid: options.orderid,
      shopname: app.globalData.shopdetail.shop_name,
      shop_address:app.globalData.shopdetail.shop_address
      
    })

    that.getallorder()
    that.getorderdetail()

    if(app.globalData.sharetitle1!='' && app.globalData.sharetitle1!=undefined && app.globalData.sharetitle1!=null){
      that.setData({
        old_sharetitle1 : app.globalData.sharetitle1
      })
    }
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {    
    var title = '本人已订【' + this.data.shopname + '】的' + this.data.orderinfo.table_name + '号桌， 诚邀您于' + this.data.date + ' ' + this.data.hour + '时' + this.data.minute + '分前到达该房用餐，谢谢！'
    var shopid = this.data.orderinfo.shop_id
    var orderid = this.data.orderid
    var isShowMenu = false
    if (this.data.index) {
      isShowMenu = 0
    }else{
      isShowMenu = 1
    }    
    var path = '/pages/index/index?orderId=' + orderid + '&title=' + title + '&shopid=' + shopid + '&isFromTreat=true' +
    '&senderOpenid=' + app.globalData.openid + '&sendContent=' + this.data.sharetitle1 + '&senderCustomerId=' + app.globalData.customerInf.id + '&isShowMenu=' + isShowMenu
   
    return {
      title: title,
      //TODO 现在跳到的是商店主页，后面需要改成跳到程序主页，即搜索页面后，在判定跳转到商店首页,到时候下面的路径需要加上shopid的字段。
      path: path,
      imageUrl: this.data.invitation_image,
    }
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


})