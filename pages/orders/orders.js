// pages/orders/orders.js
const app = getApp();
var util = require('../../utils/util.js');
let timer = 0;
Page({
  /**
   * 页面的初始数据
   */
  data: {
    isClick: false,
    shineb: true,
    shinef: true,
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
    orderNum:20,//拿出第0条到第orderNum条数据（分页），一开始为拿20条
    closelineFlesh:false,//停止下拉刷新
    // stopRefresh:false,//自动刷新
    type :0,
    allOrderList: [],
  },

  clickBtn(){
    let that = this;
    that.setData({
      isClick: !that.data.isClick,
    },()=>{
      that.afterOrder()
    })
  },

  sureEat(e){
      let that = this
      wx.request({
        url: app.globalData.UpdataOrderConfirmTime,
        // url: 'https://mb.fsmbdlkj.com/WX%20Restaurant/UpdataOrderConfirmTime',
        data:{
            order_id: e.currentTarget.dataset.orderid,
            shop_id: e.currentTarget.dataset.shopid,
            preorder_starus: 4
        },
        method: 'GET',
        success: res => {
            if (res.data.result.result == 1) {
                wx.showToast({
                  title: '确认成功',
                  icon: 'success'
                })
                this.to_flesh()
            }
        }
      })
  },

  afterOrder(){
    let that = this;
    let allOrderList = that.data.allOrderList
    that.setData({
      showOrHidden: true
    })

    let date1 = new Date();
    let yesterday = new Date(new Date().getTime() - (60 * 60 * 24 * 1000));
    let y = date1.getFullYear();
    let y1 = yesterday.getFullYear();
    let m = date1.getMonth() + 1;
    let m1 = yesterday.getMonth() + 1;
    let d = date1.getDate();
    let d1 = yesterday.getDate();
    
    let dateStr = y + "/" + m + "/" + d + " 23:59:59";
    let dateStr1 = y1 + "/" + m1 + "/" + d1 + " 00:00:00";


    let time = new Date(dateStr).getTime();
    let time1 = new Date(dateStr1).getTime();

    var List = [];
    if(that.data.isClick){
      //明后订单查询
      for(let item of allOrderList){
        let dinnerTime = item.dinner_time.replaceAll("-","/").replaceAll(".0","");
        if(new Date(dinnerTime).getTime() > time && item.order_status != '待确认'){
          List.push(item);
        }
      }
      if(List.length != 0){
        that.setData({
          orderslist: List,
          showOrHidden: false
        })
        List.sort((a, b) => {
            const dinnerTimeA = new Date(a.dinner_time.replaceAll("-","/").replaceAll(".0",""));
            const dinnerTimeB = new Date(b.dinner_time.replaceAll("-","/").replaceAll(".0",""));
            return dinnerTimeA - dinnerTimeB;
          })          
      }
    }else{
      //今前订单查询
      for(let item of allOrderList){
        let dinnerTime = item.dinner_time.replaceAll("-","/").replaceAll(".0","");
        if(new Date(dinnerTime).getTime() < time || item.order_status == '待确认'){
          List.push(item);
        }
      }
      if(List.length != 0){
        that.setData({
          orderslist: List,
          showOrHidden: false
        })
      }
    }
  },
 
  //跳转回首页
  engoindex: function() {
    var storagearray = new Map()
    var user_id = wx.getStorageSync('user_id')
    var userInfoName = wx.getStorageSync('userInfoName')
    var phonenumber = wx.getStorageSync('phonenumber')
    storagearray.set("user_id",user_id)
    storagearray.set("userInfoName",userInfoName)
    storagearray.set("phonenumber",phonenumber)
    wx.reLaunch({
      url: '../main/main?jump=0&user_id='+user_id+'&userInfoName='+userInfoName+'&phonenumber='+phonenumber,
    })
  },

 // 定时刷新 
 time_flesh: function () {
  var that = this
  var type = that.data.type 
    clearTimeout(that.data.timer);
    if (type == 0) {
      console.log("定时刷新")
    } else {
      console.log("打断再刷新")
    }
},

  //页面刷新
  to_flesh: function () {
    var that = this
    // that.geteatinorder()
    that.getbookorder()
  },

  //页面刷新
  flesh: function() {
    var that = this
    // that.geteatinorder()
    that.to_flesh()
    wx.showToast({
        title: '刷新成功',
        icon: 'success',
        duration: 1500,
    })
  },
  //获得这个用户在这店铺的所有预约订单
  getbookorder: function() {
    var that = this;
    var orderNum = that.data.orderNum;
    wx.request({
      url: app.globalData.GetOrderInf_url,
      // url: 'http://localhost:8088/houduan_war_exploded/GetOrderInfNew',
      data: {
        User_id: app.globalData.user_id,
        shop_id: app.globalData.shopid,
        pageNum: 0,//第几条记录开始获取
        orderNum:orderNum//一共获取多少条记录
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
              if (res.data.object[i].order_display == 1 && (res.data.object[i].order_type != 2 && res.data.object[i].order_type != 3)) {
                orderlist.push(res.data.object[i])
              }
            }
            var flag = orderlist.length == 0
            that.setData({
                showOrHidden: flag,
                orderslist: orderlist,
                allOrderList: res.data.object,
            })
            if(res.data.object.length<orderNum){
            // 已经没有数据了，下拉不要再触发这个方法了
                that.setData({
                    closelineFlesh:true
                })
            }
            that.afterOrder();
            orderlist.forEach(element => {
                wx.request({
                  url: app.globalData.GetOrderDetails_url,
                  // url:"http://192.168.8.7:8080/WX Restaurant/GetOrderDetailsNew",
                  data: {
                    Order_id: element.order_id
                  },
                  success: res2 => {
                      if (res2.data.result.result == 1) {
                          if (res2.data.object.length < 1) {
                            element.payment_status = 99
                          }
                          
                        }
                    }
                })
            });
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
              let a = []
              let today = util.formatTime(new Date()).replace('/','-').replace('/','-').substr(0,10)

              let date = new Date();
              let str = new Date(date.getTime() - 86400000);
              let yesterday = str.getFullYear() + '-' + (str.getMonth() + 1) + '-' + str.getDate();
              for(let i of res.data){
                if (i.createTime.substr(0,10) == today || i.createTime.substr(0,10) == yesterday) {
                  a.push(i)
                }
              }
              that.setData({
                orderoperation: a
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

  //支付弹窗
  showpay: function(res) {
    if (res.currentTarget.dataset.state == '等待买单' || res.currentTarget.dataset.state == undefined) {
      this.setData({
        order_total: res.currentTarget.dataset.total,
        pay_index: res.currentTarget.dataset.index, //订单列表的下标
        showpay: !this.data.showpay,
      })
    }
  },




  //加菜
  adddishes: function(e) {    
    wx.showLoading({
      title: '跳转中...',
    })
    app.globalData.ordre_code = e.currentTarget.dataset.ordercode
    app.globalData.order_tablename = e.currentTarget.dataset.order_tablename
    app.globalData.locationname = e.currentTarget.dataset.order_tablename
    app.globalData.order_arrival_time = e.currentTarget.dataset.arrivaltime
    var thisorderarry = JSON.stringify(e.currentTarget.dataset.dishesitem)
    app.globalData.thisorderarry = thisorderarry
    app.globalData.preorder_starus = JSON.parse(thisorderarry).preorder_starus;
    app.globalData.locationid = e.target.dataset.dishesitem.table_id
    wx.navigateTo({
      url: '/pages/module_others/pages/menu/menu?locationindex=3&orderid=' + e.currentTarget.dataset.orderid + '&ordertype=' + e.currentTarget.dataset.ordertype + '&thisorderarry=' + thisorderarry + '&tableid=' + e.target.dataset.dishesitem.table_id,
    })
    wx.hideLoading();
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
    console.log(e,"1666666666666666");
    app.globalData.locationid = e.target.dataset.item.table_id
    app.globalData.locationname = e.target.dataset.item.table_name
    wx.showLoading({
      title: '请等待...',
    })
    console.log(e)
    var orderid = e.currentTarget.dataset.orderid
    var item = e.currentTarget.dataset.item
    var thisorderarry = JSON.stringify(item)
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
            var sum =0;
            if (res.data.object[i].item_type == 3 && res.data.object[i].u_item_subtotal!=-1) { //该菜单为修改过的状态,价格应取修改后的价格
              sum = res.data.object[i].u_item_subtotal
            } else {
              sum = res.data.object[i].item_subtotal
            }

            if (res.data.object[i].dishes_status != 3 && res.data.object[i].dishes_status != 9 && res.data.object[i].item_type !=5) {
              sumMonney += sum
              sumMonney = Number(sumMonney.toFixed(2))
            }
            if ((res.data.object[i].spec_name != "称重"|| res.data.object[i].spec_id == 0) && res.data.object[i].dishes_status != 3  && res.data.object[i].spec_type != 6)  {
              cupNumber += Number(res.data.object[i].item_number)
            } else if (res.data.object[i].spec_name == "称重" && res.data.object[i].spec_type == 4  && res.data.object[i].dishes_status != 9 && res.data.object[i].dishes_status != 10 && res.data.object[i].dishes_status != 11 && res.data.object[i].dishes_status != 12) {
              cupNumber += Number(res.data.object[i].measurement_value)
            }  else if (res.data.object[i].spec_name == "称重" && res.data.object[i].spec_type == 4  && res.data.object[i].dishes_status != 9 && (res.data.object[i].dishes_status != 10 || res.data.object[i].dishes_status != 11  ||  res.data.object[i].dishes_status != 12)) {
              cupNumber += Number(res.data.object[i].item_number.split(',')[0])
            } else if ((res.data.object[i].spec_name == "称重" && res.data.object[i].item_number != 0  && res.data.object[i].dishes_status != 9) ||   res.data.object[i].spec_type == 6) {
              cupNumber++
            } else {
            }
          }
        }
        // app.globalData.cartList = newcartList
        app.globalData.sumMonney = sumMonney
        app.globalData.cupNumber = cupNumber
        // var cartList = app.globalData.cartList
        var cartList = res.data.object
        for (var i = 0; i < cartList.length; i++) {
          // 普通菜品分类
          if (cartList[i].specal_type == 0 && cartList[i].spec_name != '称重') {
            var conventional_dishes = 1;
          }
          // 茶位米饭
          if (cartList[i].specal_type == 1 && cartList[i].spec_name != '称重') {
            var tea_rice = 1;
          }
          // 酒水
          if (cartList[i].specal_type == 2 && cartList[i].spec_name != '称重') {
            var drinks_dishes = 1;
          }
          // 其他菜品
          if (cartList[i].specal_type == 3 && cartList[i].spec_name != '称重') {
            var other_dishes = 1;
          }
          // 早市菜品
          if (cartList[i].specal_type == 4 && cartList[i].spec_name != '称重') {
            var morning_dishes = 1;
          }
          // 午市菜品
          if ((cartList[i].specal_type == 5 && cartList[i].spec_name != '称重') || (cartList[i].specal_type == 5 && cartList[i].spec_id == 5)) {
            var afternoon_dishes = 1;
          }
          // 称重菜品
          if (cartList[i].spec_name == '称重' && cartList[i].spec_id != 5) {
            var weighing_dishes = 1;
          }

        }

        app.globalData.conventional_dishes = conventional_dishes;
        app.globalData.tea_rice = tea_rice;
        app.globalData.drinks_dishes = drinks_dishes;
        app.globalData.other_dishes = other_dishes;
        app.globalData.weighing_dishes = weighing_dishes;
        app.globalData.morning_dishes = morning_dishes;
        app.globalData.afternoon_dishes = afternoon_dishes;
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
            url: '../order/order?orderid=' + orderid + '&model=' + model + '&orderDetail=' + orderDetail + '&thisorderarry=' + thisorderarry + '&locationindex=' + 3 + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&feedback=' + that.data.feedback + '&takeOut=' + true ,
          }) 
        } else {
          wx.navigateTo({
            url: '../ordersdetail/ordersdetail?orderid=' + orderid + '&model=' + model + '&orderDetail=' + orderDetail + '&thisorderarry=' + thisorderarry + '&locationindex=' + 3 + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&refreshdelay=' + true + '&feedback=' + that.data.feedback,
          })
        }

      }
    })

  },
  //上菜
  shangcai: function(e) {
    var that = this
    var item = e.currentTarget.dataset.item
    var content
    var object
    item.order_wait == 3 ? content = '帮你再催促上菜' : content = '是否立刻为您上菜'
    wx.showModal({
      content: content,
      cancelText: "否",
      confirmText: "是",
      success: function(res) {
        if (res.confirm) {
          if (e.currentTarget.dataset.item.order_wait == 1) {
            var order_wait = e.currentTarget.dataset.item.order_wait
            order_wait == 0 ? order_wait = 2 : order_wait = 3
            wx.request({
              url: app.globalData.UpdateOrderInf_url,
              data: {
                Shop_id: app.globalData.shopid,
                Order_id: e.currentTarget.dataset.item.order_id,
                order_wait: order_wait,
                Order_status:'正在用餐'
              },
              success: function(res) {

                if (res.data.result.result == 1) {
                  if (that.data.tabIndex == 0) {
                    that.getbookorder()
                  } else {
                    that.geteatinorder()
                  }
                  //确认信息记录
                  object = {
                    "operator_type": 0,
                    "shop_id": app.globalData.shopid,
                    "order_id": e.currentTarget.dataset.item.order_id,
                    "user_id": parseInt(app.globalData.user_id),
                    "operator_id": -1,
                    "operator_name": '本人',
                    "order_operator": '已叫上菜',
                  }

                  wx.request({
                    url: app.globalData.RecordOrderConfirmationInf_url,
                    data: JSON.stringify(object),
                    header: {
                      'content-type': 'application/json'
                    },
                    method: 'POST',
                    success: function(res) {
                      console.log("确认信息记录")
                      if (res.data == "success") {
                        console.log('确认信息记录成功');
                      } else {
                        console.log('确认信息记录失败');
                      }
                    },
                    complete: function(res) {

                    }
                  })


                }
              },
            })
          }
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
  lineFlesh:function(e){
    var that = this
    if(!that.data.closelineFlesh){
      var orderNum = that.data.orderNum + 20
      that.setData({
        orderNum:orderNum
      })
      that.getbookorder()
    }
  },
  /**
   * 生命周期函数--监听页面加载
   * 获取订单信息
   */
  onLoad: function(options) {
    app.globalData.RMQRefreshCB = (msg) => {
      console.log('收到刷新指令')
      this.to_flesh()
    }
    var that = this
    app.globalData.adddishes = true
   
    that.getheight()    
    wx.setNavigationBarTitle({
      title: "订单列表 [" + app.globalData.shopdetail.shop_name + "]"
    })
    wx.setStorageSync('user_id', options.user_id)
    
    wx.setStorageSync('phonenumber', options.phonenumber)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
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
    app.globalData.sumMonney = 0;
    app.globalData.cupNumber = 0;
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {
    var that = this
     clearTimeout(that.data.timer);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {
    var that = this
     clearTimeout(that.data.timer);
    this.stopFlash()
    this.stopFlash1()
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

  }
})