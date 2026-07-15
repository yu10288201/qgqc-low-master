// pages/module_others/pages/operation/operation.js
var app = getApp();
var util = require('../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isTemporaryNotRegister: false,
    shopName: '',
    shopid: '',
    tableid: '',
    selectedOrder: '',
    orderDetail: '',
    getOrderInf: '',
    chooseList: 0,
    getTableStatusByNum: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (app.globalData.username === '') {
      app.globalData.username = wx.getStorageSync('userInfoName')
    }
    
    console.log(options);
    that.setData({
      shopid: options.shopId,
      tableid: options.tableId
    })
    // that.getshopinf(options.shopId)
    // that.getmenu()
    // if (options.popup === "1") {
    //   wx.showModal({
    //     content: '您尚未关注"切瓜切菜"公众号\n关注公众号即可获取平台的5个星盾奖励和商家的买单打折优惠',
    //     cancelText: '暂不关注',
    //     confirmText: '前往关注',
    //     success: res => {
    //       if (res.confirm) {
    //         wx.request({
    //           url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addOrUpdateShopMiddleTemporary',
    //           data: {
    //             shopId: options.shopId,
    //             unionId: app.globalData.unionID,
    //           },
    //           method: "POST",
    //           success: res => {
    //             if (app.globalData.customerInf.signIn == 1) {
    //               wx.request({
    //                 url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addLink',
    //                 data: {
    //                   unionId: app.globalData.unionID,
    //                   title: "点击这里继续点餐",
    //                   link: "/pages/module_others/pages/operation/operation?shopId=" + that.data.shopid + "&tableId=" + that.data.tableid
    //                 },
    //                 method: 'GET',
    //                 success(res) {
    //                   wx.navigateTo({
    //                     url: '/pages/module_others/pages/wxPublic/out',
    //                   })
    //                 }
    //               })
    //             } else {
    //               wx.request({
    //                 url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addLink',
    //                 data: {
    //                   unionId: app.globalData.unionID,
    //                   title: "点击这里前往小程序",
    //                   link: "/pages/module_others/pages/register/register?operationlink=true" + "&shop_id=" + that.data.shopid + "&table_id=" + that.data.tableid
    //                 },
    //                 method: 'GET',
    //                 success(res) {
    //                   wx.navigateTo({
    //                     url: '/pages/module_others/pages/wxPublic/out',
    //                   })
    //                 }
    //               })
    //             }
    //           }
    //         })
    //       }
    //     }
    //   })
    // }else if(!options.wxQrCode){
    //   if(app.globalData.customerInf.signIn != 1){
    //     wx.showModal({
    //       content:'您尚未注册"切瓜切菜"平台账户\n注册平台即可获取平台的5个星盾奖励和商家的买单打折优惠',
    //       cancelText: '暂不注册',
    //       confirmText: '前往注册',
    //       success: res=>{
    //         if(res.confirm){
    //           wx.navigateTo({
    //             url: '../register/register?openId=' + app.globalData.openid + '&unionId=' + app.globalData.unionID,
    //           })
    //         }else{
    //           that.setData({
    //             isTemporaryNotRegister: true,
    //           })
    //         }
    //       }
    //     })
    //   }
    // }else if(options.wxQrCode){
    //   that.setData({
    //     isTemporaryNotRegister: true,
    //   })
    // }
   
    that.selOrder()
    if(options.isFromBuy){
      that.setData({
        isFromBuy: true
      })
    }
  },
  //拼桌,买单,加菜
  chooseOpenTable(e) {
    //判断是否第一次进入
    let that = this
    if (app.globalData.username === '') {
      //获取用户信息
      wx.getUserProfile({
        desc: '用于完善资料信息',
        success: (res) => {
          console.log(res, '用户信息');
          let getUserInfoName = res.userInfo.nickName
          app.globalData.username = getUserInfoName
          wx.setStorage({
            key: "userInfoName",
            data: getUserInfoName
          })
          switch (res.userInfo.gender) {
            case 0:
              var sex = '未知'
              break;
            case 1:
              var sex = '男'
              break;
            case 2:
              var sex = '女'
              break;
          }
          console.log(res.userInfo);
          console.log(that.data.openId);
          console.log(that.data.unionID);
          console.log(util.formatTime());
          var data = {
            city: res.userInfo.city,
            gender: sex,
            province: res.userInfo.province,
            name: res.userInfo.nickName,
            openId: that.data.openId,
            registrationTime: util.formatTime(),
          }
          console.log(data);
          //修改customer信息
          wx.request({
            // url: 'https://test.fsmbdlkj.com/evaluation/updateCustomerByOpenId',
            url: app.globalData.UpdateCustomerByOpenId_Url,
            data: JSON.stringify(data),
            method: 'POST',
            success: res => {
              console.log(res);
            }
          })
          const id = e.currentTarget.dataset.id;
          if (id === '0') {
            console.log('开台/拼桌');
            that.openOrSpell()
          } else if (id === '1') {
            console.log('加菜');
            that.addFood()
          } else if (id === '2') {
            console.log('买单');
            that.payBill()
          }
        },
        fail: res => {
          console.log("未授权,获取昵称失败!");
        }
      })
    } else {
      const id = e.currentTarget.dataset.id;
      if (id === '0') {
        console.log('开台/拼桌');
        that.openOrSpell()
      } else if (id === '1') {
        console.log('加菜');
        that.addFood()
      } else if (id === '2') {
        console.log('买单');
        that.payBill()
      }
    }

  },
  //拼桌
  openOrSpell() {
    let that = this
    console.log(that.data.getTableStatusByNum.length)
    let tableNowNum = that.data.getTableStatusByNum.length
    wx.navigateTo({
      url: '../../../QRorder/QRorder?isTemporaryNotRegister='+ that.data.isTemporaryNotRegister +'&shop_id=' + that.data.shopid + '&table_id=' + that.data.tableid + '&add=' + true + '&tableNowNum=' + tableNowNum,
    })
  },
  //加菜
  addFood() {
    let that = this
    if (that.data.selectedOrder === '') {
      that.setData({
        selectedOrder: that.data.getTableStatusByNum[0]
      })
    }
    console.log(that.data.selectedOrder);
    wx.showLoading({
      title: '跳转中...',
    })
    var orderId = that.data.selectedOrder.orderId
    var orderType = that.data.selectedOrder.orderType
    var thisorderarry = that.data.selectedOrder
    app.globalData.user_id = that.data.selectedOrder.userId
    app.globalData.orderCode = thisorderarry.orderCode
    console.log(thisorderarry, 'thisorderarry');
    console.log(app.globalData.orderCode, 'orderCode');
    thisorderarry = JSON.stringify(thisorderarry)
    app.globalData.thisorderarry = thisorderarry
    app.globalData.preorder_starus = thisorderarry.preorderStarus;
    wx.navigateTo({
      url: '../menu/menu?locationindex=3&orderid=' + orderId + '&ordertype=' + orderType + '&thisorderarry=' + thisorderarry,
    })
    wx.hideLoading();
  },
  //买单
  payBill() {
    let that = this
    if (that.data.selectedOrder === '') {
      that.setData({
        selectedOrder: that.data.getTableStatusByNum[0],
        isBindUser: that.data.getTableStatusByNum[0].customerId
      },()=>{
        that.getFoodDetail(that.data.selectedOrder.orderId)
      })
    }else{
      that.setData({
        isBindUser: that.data.selectedOrder.customerId
      },()=>{
        that.getFoodDetail(that.data.selectedOrder.orderId)
      })
    }
    app.globalData.locationid = that.data.selectedOrder.tableId
    app.globalData.locationname = that.data.selectedOrder.tableName
   
  },
  getFoodDetail(orderId) {
    let that = this
    wx.request({
      // url: 'https://test.fsmbdlkj.com/WX%20Restaurant/GetOrderDetailsNew',
      url: app.globalData.GetOrderDetails_url,
      data: {
        Order_id: orderId
      },
      success: res => {
        console.log(res)
        that.setData({
          orderDetail: res.data.object
        })
        // that.getOrderInfo()
        wx.request({
          method: "POST",
          // url: 'https://test.fsmbdlkj.com/evaluation/SelectOrderAllDetailedByOrderId?order_id=' + orderId,
          url: app.globalData.SelectOrderAllDetailedByOrderId_url + '?order_id=' + orderId,
          success: res => {
            that.setData({
              getOrderInf: res.data.data.orderInf
            })
            console.log("前往订单详情")
            var orderItem = that.data.getOrderInf;
            console.log("orderItem", orderItem)
            var preorder_starus = orderItem.preorderStarus
            var ordercode = orderItem.orderCode
            var user_count = orderItem.userCount
            var table_id = orderItem.tableId
            var total_amount = orderItem.totalAmount
            var user_id = orderItem.userId
            var tbc_count = orderItem.tbcCount
            var shopId = that.data.getOrderInf.shopId
            app.globalData.table_id = orderItem.tableId
            app.globalData.table_name = orderItem.tableName
            if(that.data.isBindUser == 0){
              wx.navigateTo({
                url: '../../../ordersdetail/ordersdetail?isFromBuy=true&isBindUser=true&orderid=' + orderId + '&ordercode=' + ordercode + '&table_id=' + table_id + '&user_count=' + user_count + '&total_amount=' + total_amount + '&user_id=' + user_id + '&preorder_starus=' + preorder_starus + '&tbc_count=' + tbc_count + '&shopId=' + shopId
              })
            }else{
              wx.navigateTo({
                url: '../../../ordersdetail/ordersdetail?isFromBuy=true&orderid=' + orderId + '&ordercode=' + ordercode + '&table_id=' + table_id + '&user_count=' + user_count + '&total_amount=' + total_amount + '&user_id=' + user_id + '&preorder_starus=' + preorder_starus + '&tbc_count=' + tbc_count + '&shopId=' + shopId
              })
            }
            
          }
        })
      }
    })
  },
  //获取店铺信息
  getshopinf: function (shop_id) {
    var that = this;
    console.log("获取店铺信息")
    wx.request({
      url: app.globalData.SelectShopDetails_url,
      data: {
        shop_id: shop_id
      },
      success: function (res) {
        console.log(res.data[0].shop_name);
        if (res.data != '') {
          that.setData({
            shopdetail: res.data[0],
            shopName: res.data[0].shop_name
          })
          app.globalData.shopdetail = res.data[0]
          app.getManagementDataServlet(shop_id)
          wx.setNavigationBarTitle({
            title: "堂食点餐 [" + app.globalData.shopdetail.shop_name + "]"
          })
          // app.getmenu(shop_id) // 获取菜单 
        } else {
          wx.showModal({
            title: '错误',
            content: '获取店铺信息失败，请重试！',
          })
        }
      }
    })
  },
  //获取菜单
  getmenu: function () {
    var that = this
    console.log("获取菜单")
    console.log(that.data);
    var menuListItem = []
    wx.request({
      url: app.globalData.Getmenu_url,
      // url: "http://192.168.8.2:8080/WX%20Restaurant/Getmenu",
      data: {
        Shop_id: that.data.shopid
      },
      success: function (res) {
        getApp().globalData.menuList = res.data.object[0]
        //取出菜单下所有菜品
        for (var a = 0; a < res.data.object[0].length; a++) {
          for (var b = 0; b < res.data.object[0][a].class1s.length; b++) {
            for (var c = 0; c < res.data.object[0][a].class1s[b].class2.length; c++) {
              for (var d = 0; d < res.data.object[0][a].class1s[b].class2[c].dishesInfs.length; d++) {
                let dishes = res.data.object[0][a].class1s[b].class2[c].dishesInfs[d]
                delete dishes.dishes_pricing
                delete dishes.dishes_discount
                delete dishes.praise_points
                delete dishes.commercial_area_id
                delete dishes.county_id
                delete dishes.city_id
                delete dishes.querendengji
                delete dishes.recommendRoyalty
                delete dishes.royaltyMoney
                delete dishes.present
                delete dishes.dishesNamePy
                delete dishes.create_date
                delete dishes.dishesNamePy
                menuListItem.push(dishes)
              }
            }
          }
        }
        //仅取出第一级类别第一项、第二级类别第一项、第三级类别第一项下的菜品
        if (res.data.object[0] != "") { // 这里为进去菜单页面看到的菜品
          // 已经不需要存缓存，因为菜单包含菜品状态
          app.globalData.menuItem = res.data.object[0][0].class1s[0].parent_type_dishesInfList
          app.globalData.menuListItem = menuListItem
          // 注解，星盾折扣菜现在和特价菜是没有区别的
        } else {
          console.log("该店没有录入菜品")
        }
      }
    })
  },
  //查询该桌订单
  selOrder() {
    let that = this
    wx.request({
      url: app.globalData.GetTableStatusByNum_Url,
      data: {
        shopId: that.data.shopid,
        tableNum: that.data.tableid
      },
      success: res => {
        for (var x = 0; x < res.data.getTableStatusByNum.length; x++) {
          console.log(x);
          res.data.getTableStatusByNum[x].orderCode = res.data.getTableStatusByNum[x].orderCode.slice(14, 19)
          console.log(res.data.getTableStatusByNum[x].orderCode);
        }
        that.setData({
          getTableStatusByNum: res.data.getTableStatusByNum
        })
      }
    })
  },
  //点击列表事件
  getOrder(e) {
    let that = this
    console.log(e.currentTarget.dataset.id, 'id');
    console.log(e);
    let a = e.currentTarget.dataset.id
    console.log(that.data.getTableStatusByNum[a]);
    that.setData({
      chooseList: a,
      selectedOrder: that.data.getTableStatusByNum[a]
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