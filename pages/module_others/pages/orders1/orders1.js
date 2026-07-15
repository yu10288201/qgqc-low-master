// pages/orders/orders.js
const app = getApp();
var util = require('../../../../utils/util.js');
Page({


  /**
   * 页面的初始数据
   */
  data: {
    orderslist: [],
    showOrHidden: true, //ture会在订单页面显示点餐按钮
    showOrHidden2: true,
    showOrHidden3: false,
    tabIndex: 0,
    showpay: false,
    paymentway: 'orange',
    window: false,
    difference_time: 3600000, //一个小时的时间戳
    orderoperation: [],
    feedback: false, //回馈判断
    getbookorderNum: 0, //加载数据失败的刷新判断
  },

  //跳转回首页
  engoindex: function() {
    app.globalData.thisorderarry = '';
    wx.reLaunch({
      url: '/pages/main/main?jump=' + 0,
    })

  },
  //页面刷新
  flesh: function() {
    var that = this
    that.getbookorder()
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500,
    })
  },
  //获得这个用户在这店铺的所有外卖订单
  getbookorder: function() {
    var that = this;
    wx.request({
      url: app.globalData.GetOrderInf_url,
      data: {
        User_id: app.globalData.user_id,
        shop_id: app.globalData.shopid
      },
      success: function(res) {
        console.log(res)
        if (res.data.result == null && that.data.getbookorderNum < 4) {
          that.setData({
            getbookorderNum: that.data.getbookorderNum + 1
          })
          setTimeout(function() {
            that.getbookorder() //防止进入太快,没有获取到参数导致bug
          }, 500) //延迟时间 这里是0.5秒
        } else if (res.data.result == null && that.data.getbookorderNum >= 4) {
          wx.showModal({
            title: '错误',
            content: '显示订单失败',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                console.log('用户点击确定')
                that.engoindex();
              }
            }
          })
        } else {
          if (res.data.result.result == 1) {
            var orderlist = []
            for (var i = 0; i < res.data.object.length; i++) {
              if ((res.data.object[i].order_display == 1) && (res.data.object[i].order_type == 2 || res.data.object[i].order_type == 3)) {
                orderlist.push(res.data.object[i])
              }
            }
            var flag
            orderlist.length == 0 ? flag = true : flag = false
            that.setData({
              showOrHidden: flag,
              orderslist: orderlist,
              oldorderslist: orderlist,
              oldTypeOrdersList: orderlist,

            })
            console.log(orderlist)
          }
          wx.hideLoading();
          var object = {
            "user_id": app.globalData.user_id,
            "shop_id": app.globalData.shopid
          }
          var orderoperation = []
          wx.request({
            url: app.globalData.SelectOrderConfirmationInfByUserId_url, //获取出单买单的操作信息
            data: JSON.stringify(object),
            method: 'POST',
            header: {
              'content-type': 'application/json'
            },
            success: function(res) {
              console.log(res)
              that.setData({
                orderoperation: res.data
              })

            }
          })
          that.setData({ //加载出来就置零
            getbookorderNum: 0
          })
        }

      },
    })
  },

  //获取屏幕高度
  getheight: function(res) {
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    this.setData({
      windowHeight: windowHeight,
      windowWidth: windowWidth,
      leftscroll: windowHeight * 750 / windowWidth - 80 - 160 - 82.4,
      listmenu: windowHeight - 45,
      pop_window: windowHeight * 0.7,
      pop_window_special: windowHeight * 0.8,
      // pop_window_special_fuck: windowHeight * 0.85,
      pop_window_special_fuck: windowHeight * 0.96,
      pop_window_for: windowHeight * 0.7 - 80 - 40 - 70 - 25 - 80
    })

  },

  //加菜
  adddishes: function(e) {
    wx.showLoading({
      title: '跳转中...',
    })
    app.globalData.ordre_code = e.currentTarget.dataset.ordercode
    app.globalData.order_tablename = e.currentTarget.dataset.order_tablename
    app.globalData.order_arrival_time = e.currentTarget.dataset.arrivaltime
    wx.request({
      url: app.globalData.GetOrderInf_url,
      data: {
        User_id: app.globalData.user_id,
        shop_id: app.globalData.shopid
      },
      success: function(res) {
        if (res.data.result.result == 1) {
          console.log(res.data.object)
          console.log("跳转menu啦")
          for (var i = 0; i < res.data.object.length; i++) {
            if (res.data.object[i].order_id == e.currentTarget.dataset.orderid) {
              var thisorderarry = JSON.stringify(res.data.object[i])
              app.globalData.preorder_starus = JSON.parse(thisorderarry).preorder_starus;
              wx.hideLoading();
              wx.navigateTo({
                url: '../menu/menu?locationindex=3&orderid=' + e.currentTarget.dataset.orderid + '&ordertype=' + e.currentTarget.dataset.ordertype + '&thisorderarry=' + thisorderarry,
              })
            }
          }
        }
      }
    })

  },

  //开始点餐，去预约点餐页面
  gobook: function() {
    wx.navigateTo({
      url: '../module_others/pages/book/book',
    })
  },
  //调用手机相机，扫描二维码
  gomenu: function() {
    wx.scanCode({
      onlyFromCamera: true,
      success(res) {
        console.log(res)
      }
    })
  },

  feedback: function(e) {
    var that = this;
    that.setData({
      feedback: true
    })
    that.goordersItem(e)
  },

  //订单详细信息页面
  goordersItem: function(e) {
    var that = this
    wx.showLoading({
      title: '请等待...',
    })
    console.log(e)
    var orderid = e.currentTarget.dataset.orderid

    wx.request({
      url: app.globalData.GetOrderInf_url,
      data: {
        User_id: app.globalData.user_id,
        shop_id: app.globalData.shopid
      },
      success: function (res) {
        if (res.data.result.result == 1) {
          for (var i = 0; i < res.data.object.length; i++) {
            if (res.data.object[i].order_id == e.currentTarget.dataset.orderid) {
              var thisorderarry = JSON.stringify(res.data.object[i])
              break;
            }
          }

          wx.request({
            url: app.globalData.GetOrderDetails_url,
            data: {
              Order_id: orderid
            },
            success: function(res) {
              console.log(res)
              var orderDetail = res.data.object
              var model
              if (that.data.showOrHidden2) {
                model = 0
              } else if (that.data.showOrHidden3) {
                model = 1
              }
              var newcartList = []
              var sumMonney = 0
              var cupNumber = 0
              for (var i = 0; i < res.data.object.length; i++) {
                if (res.data.object[i].dishes_status != 3 || (res.data.object[i].dishes_status == 3 && res.data.object[i].operator != '')) { //不显示时间之外的取消的菜品
                  var weight = 0
                  var weighing = 0
                  var dishes_spec_type

                  if (res.data.object[i].item_type == 3) { //该菜单为修改过的状态,价格应取修改后的价格
                    var sum = res.data.object[i].u_item_subtotal
                  } else {
                    var sum = res.data.object[i].item_subtotal
                  }
                  var set_meal = that.data.set_meal 
                  for (var n = 0; n < set_meal.length; n++) {
                    if (res.data.object[i].dishes_id == set_meal[n].dishes_id) {
                      var monthly_sales_volume = set_meal[n].monthly_sales_volume
                      var praise_points = set_meal[n].praise_points
                    }
                  }
                    var item = {
                      "id": res.data.object[i].id,
                      "name": res.data.object[i].dishes_name,
                      "price": res.data.object[i].item_price,
                      "dishes_price": res.data.object[i].item_price,
                      "number": res.data.object[i].item_number,
                      "item_number": res.data.object[i].item_number,
                      "sum": sum,
                      "monthly_sales_volume": monthly_sales_volume,
                      "praise_points": praise_points,
                      "img_url": res.data.object[i].dishes_img,
                      "dishes_id": res.data.object[i].dishes_id,
                      "spec_name": res.data.object[i].spec_name,
                      "spec_type": res.data.object[i].dishes_metering_type,
                      "dishes_spec_type": res.data.object[i].spec_id,
                      "disher_weight": weight,
                      "specal_type": res.data.object[i].specal_type,
                      "weighing": weighing,
                      "isDriving": res.data.object[i].isDriving,
                      "remark": res.data.object[i].remarks,
                      "decdishes_flag": 1, //1为此为减菜前点的商品，不能改动
                      "adddishes_flag": 1, //1为此为加菜前点的商品，不能改动
                      "dishes_status": res.data.object[i].dishes_status,
                      "operator": res.data.object[i].operator,
                      "operation_time": res.data.object[i].operation_time,
                      // "afterAddDishNum": res.data.object[i].item_number
                      "item_type": res.data.object[i].item_type,
                      "u_item_number": res.data.object[i].u_item_number,
                      "u_measurement_value": res.data.object[i].u_measurement_value,
                      "praise_flag": res.data.object[i].praise_flag,
                      "userchecked": res.data.object[i].userchecked
                    }
                  
                  newcartList.push(item)
                  if (res.data.object[i].dishes_status != 3 && res.data.object[i].dishes_status != 9) {
                    sumMonney += item.sum
                  }
                  if ((res.data.object[i].spec_name != "称重" || res.data.object[i].spec_id == 0) && res.data.object[i].dishes_status != 3) {
                    cupNumber += Number(res.data.object[i].item_number)
                  } else if (res.data.object[i].spec_name == "称重" && res.data.object[i].item_number != 0 && res.data.object[i].dishes_status != 9) {
                    cupNumber++
                  } else {

                  }

                }
              }
              app.globalData.cartList = newcartList
              app.globalData.sumMonney = sumMonney
              app.globalData.cupNumber = cupNumber
              // var cartList = app.globalData.cartList
              var cartList = res.data.object
              
              var takeOut_dishes 
              //套餐不分类
              if (cartList.length > 0) {
                takeOut_dishes = 1
              }

              that.setData({
                takeOut_dishes: takeOut_dishes
              })
              app.globalData.conventional_dishes = false;
              app.globalData.tea_rice = false;
              app.globalData.drinks_dishes = false;
              app.globalData.other_dishes = false;
              app.globalData.weighing_dishes = false;
              app.globalData.afternoon_dishes = false;
              app.globalData.morning_dishes = false;
              app.globalData.takeOut_dishes = takeOut_dishes;
              app.globalData.preorder_starus = JSON.parse(thisorderarry).preorder_starus;
              app.globalData.thisorderarry = JSON.parse(thisorderarry);
              app.globalData.locationindex = 3;
              //-------------------------------------------------------------------------
              wx.hideLoading();
              if (JSON.parse(thisorderarry).order_type == 2 || JSON.parse(thisorderarry).order_type == 3) {
                if (JSON.parse(thisorderarry).order_type == 2){
                  app.globalData.delivery = '配送'
                } else {
                  app.globalData.delivery = '自提'
                }
                app.globalData.address = JSON.parse(thisorderarry).table_name
                app.globalData.arrival_time = JSON.parse(thisorderarry).arrival_time
                wx.navigateTo({
                  url: '../order/order?orderid=' + orderid + '&model=' + model + '&orderDetail=' + orderDetail + '&thisorderarry=' + thisorderarry + '&locationindex=' + 3 + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&feedback=' + that.data.feedback + '&takeOut=' + true + '&takeOrder=' + true ,
                })
              }
            }
          })

        }
      }
    })

  },

  //取消订单
  cancel: function(e) {
    var that = this
    var orderslist = that.data.orderslist
    var orderid = e.currentTarget.dataset.orderid
    var cancel
    for (var i = 0; i < orderslist.length; i++) {
      if (orderslist[i].order_id == orderid) {
        orderslist[i].order_status == '待确认' ? cancel = true : cancel = false
        break;
      }

    }
    if (that.data.tabIndex == 0 && cancel == true) {
      wx.showModal({
        content: '是否确定取消该订单',
        cancelText: "否",
        confirmText: "是",
        success: function(res) {

          if (res.confirm) {
            wx.request({
              url: app.globalData.UpdateOrderInf_url,
              data: {
                Order_id: orderid,
                Shop_id: app.globalData.shopid,
                Order_status: '已取消',
                preorder_starus: 3 //传入状态会自动获取取消时间
              },
              success: function(res) {
                if (res.data.result.result == 1) {
                  that.getbookorder()
                }
              },
            })
          }
        },
      })
    } else if (cancel == false) {
      wx.showModal({
        content: '该订单已进入不能取消状态，确定需要取消请于部长协商确认',
        cancelText: "否",
        confirmText: "是",
        success: function(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.UpdateOrderInf_url,
              data: {
                Order_id: orderid,
                Shop_id: app.globalData.shopid,
                Order_status: '等待取消',
                preorder_starus: 2 //传入状态3会自动获取取消时间
              },
              success: function(res) {
                if (res.data.result.result == 1) {
                  that.getbookorder()
                }
              },
            })
          }
        },
      })
    }
  },
  //打开二维码 
  openImg: function (e) {
    var that = this;
    console.log('打开订单二维码')
    console.log(e)
    that.setData({
      QRcode: e.currentTarget.dataset.qrcode,
      showModalQR: true
    })
  },
  //关闭二维码
  qrInfo: function () {
    var that = this;
    that.setData({
      showModalQR: false,
      QRcode:''
    })
  },

  /**
   * 生命周期函数--监听页面加载
   * 获取订单信息
   */
  onLoad: function(options) {
    var that = this
    that.getheight()
    wx.setNavigationBarTitle({
      title: "订单列表 [" + app.globalData.shopdetail.shop_name + "]"
    })


    var set_meal = wx.getStorageSync("set_meal")
    that.setData({
      set_meal: set_meal
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var that = this
    that.getbookorder()

    if (app.globalData.paymentway_num != undefined) {
      that.setData({
        paymentway_num: app.globalData.paymentway_num
      })
    }
    that.setData({
      feedback: false
    })
    app.globalData.needOpenSocket = true
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
  
  // 这里开始对抬头部分的三个类型进行跳转
  type1:function(){//超值套餐按钮
    var that = this
    var type1 = [];
    var oldorderslist = that.data.oldorderslist
    for(var i = 0;i<oldorderslist.length;i++){
      if(oldorderslist[i].order_type==4){
        type1.push(oldorderslist[i])
      }
    }
    
    that.setData({
      oldTypeOrdersList:type1
    })
    that.btn1();
  },
   // 这里开始对抬头部分的三个类型进行跳转
   type2:function(){//超值代金券按钮
    var that = this
    var type2 = [];
    var oldorderslist = that.data.oldorderslist
    
    for(var i = 0;i<oldorderslist.length;i++){
      if(oldorderslist[i].order_type==5){
        type2.push(oldorderslist[i])
      }
    }
    
    that.setData({
      oldTypeOrdersList:type2
    })
    that.btn1();
  },
   // 这里开始对抬头部分的三个类型进行跳转
   type3:function(){//外卖套餐按钮
    var that = this
    var type3 = [];
    var oldorderslist = that.data.oldorderslist
    for(var i = 0;i<oldorderslist.length;i++){
      if(oldorderslist[i].order_type==2 || oldorderslist[i].order_type==3){
        type3.push(oldorderslist[i])
      }
    }
    
    that.setData({
      oldTypeOrdersList:type3
    })
    that.btn1();
  },

  // 这里开始对抬头部分的五个样式进行跳转
  btn1:function(){//全部按钮
    var that = this
    // 显示当前所有的订单
    that.setData({
      orderslist: that.data.oldTypeOrdersList,
    })
  },
  btn2:function(){//待确认按钮
    var that  = this
    // 显示当前所有的订单
    var oldTypeOrdersList = that.data.oldTypeOrdersList
    var ol2 = [];
    for(var i = 0;i<oldTypeOrdersList.length;i++){
      if(oldTypeOrdersList[i].order_status=='待确认'){
        ol2.push(oldTypeOrdersList[i])
      }
    }
    that.setData({
      orderslist:ol2
    })
  },
  btn3:function(){//正在用餐按钮
    var that  = this
    // 显示当前所有的订单
    var oldTypeOrdersList = that.data.oldTypeOrdersList
    var ol3 = [];
    for(var i = 0;i<oldTypeOrdersList.length;i++){
      if(oldTypeOrdersList[i].order_status=='正在用餐'||oldTypeOrdersList[i].order_status=='等待用餐'){
        ol3.push(oldTypeOrdersList[i])
      }
    }
    that.setData({
      orderslist:ol3
    })
  },
  btn4:function(){//等待买单按钮
    var that  = this
    // 显示当前所有的订单
    var oldTypeOrdersList = that.data.oldTypeOrdersList
    var ol4 = [];
    for(var i = 0;i<oldTypeOrdersList.length;i++){
      if(oldTypeOrdersList[i].order_status=='等待买单'){
        ol4.push(oldTypeOrdersList[i])
      }
    }
    that.setData({
      orderslist:ol4
    })
  },
  btn5:function(){//已买单按钮
    var that  = this
    // 显示当前所有的订单
    var oldTypeOrdersList = that.data.oldTypeOrdersList
    var ol5 = [];
    for(var i = 0;i<oldTypeOrdersList.length;i++){
      if(oldTypeOrdersList[i].order_status=='已买单'){
        ol5.push(oldTypeOrdersList[i])
      }
    }
    that.setData({
      orderslist:ol5
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
})

