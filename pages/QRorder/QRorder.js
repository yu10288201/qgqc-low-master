// pages/QRorder/QRorder.js
const app = getApp(); //引入全局变量
var util = require('../../utils/util.js');
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
var qqmap = new QQMapWX({
  //在腾讯地图开放平台申请密钥 http://lbs.qq.com/mykey.html
  key: 'V2QBZ-KVOKQ-3QS5T-GDXJD-SNQFQ-GKBVE' //此处为个人秘钥,可用老板手机号申请公司的秘钥
});

Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: "",
    shop_name: "",
    shop_id: '',
    userNum: 1,
    dineUserName: '',
    dinePhoneNumber: '',
    dinedineUserName: '',
    shopdetail: "",
    img_url: "",
    isFirst: true,
    table_name: "",
    table_id: '',
    user_id: '',
    stopJump: false, //跳转判读
    hidden1: true,
    shopdetail: [],
    show_qr: true, //是否显示堂食判断框
    hidden: true, //默认模态框为隐藏状态
    way: 2,
    showAuthorize: false, //手机获取弹框信息
    showPhone: true, //多次赋值限制
    hidden2: true,
    stopWtoats: true,
    items: [{
      name: '先生',
      checked: true
    }, {
      name: '女士',
      checked: false
    }],
    sex: true,
    unionID: "",
    fackyousevencolor: '#ffffff',
    fackyousevencolor1: '#ffffff',
    orderId_directy: [], //单桌部长复数下单对应的数组
    makeUpTable: false, //是否拼桌
    shineb: true,
    shinef: true,
    get_customer_info_ok:false,
  },

  //改变拼桌方式
  changeway: function (e) {
    var that = this
    console.log(e.currentTarget.dataset.index)
    that.setData({
      way: e.currentTarget.dataset.index,
    })
  },

  confirm1: function () {
    var that = this
    var that = this
    var way = that.data.way
    var tableNowNum = Number(that.data.tablenumber)
    that.setData({
      hidden1: true
    })
    if (way == 0) {
      app.globalData.addtable = "true" //区分是否是够时间使用
      app.globalData.locationname = app.globalData.locationname + -(++tableNowNum)
      app.globalData.eatin = true
      app.globalData.wechatsweep = false
      that.getUserInfo()
      if (that.data.unionID != '') {
        that.recording() // 记录电话 菜单
      }
    } else if (way == 1) {
      app.globalData.addtable = "true" //区分是否是够时间使用
      app.globalData.wechatsweep = false
      app.globalData.eatin = true
      that.getUserInfo()
      if (that.data.unionID != '') {
        that.recording() // 记录电话 菜单
      }
    } else {
      console.log("不拼桌")
    }

  },

  //确认拼桌方式
  confirm: function () {
    var that = this
    var way = that.data.way
    var tableNowNum = Number(that.data.tablenumber)
    var userClaim = that.data.userClaim
    var orderid = that.data.orderid
    that.setData({
      hidden: true
    })
    if (way == 0) {
      app.globalData.addtable = "true" //区分是否是够时间使用
      app.globalData.locationname = app.globalData.locationname + -(++tableNowNum)
      app.globalData.eatin = true
      that.getUserInfo()
      that.recording() // 记录电话 菜单
      wx.navigateTo({
        url: "/pages/module_others/pages/menu/menu?locationindex=undefined&order_type=0"
      })
      // wx.navigateTo({
      //   url: '../QRorder/QRorder?table_id=' + that.data.tableid + '&shop_id=' + that.data.shopid + '&add=' + true + '&tableNowNum=' + tableNowNum,
      // })
    } else if (way == 1) {
      app.globalData.addtable = "true" //区分是否是够时间使用
      app.globalData.eatin = true
      that.getUserInfo()
      that.recording() // 记录电话 菜单
      wx.navigateTo({
        url: "/pages/module_others/pages/menu/menu?locationindex=undefined&order_type=0"
      })
    } else if (way == 2) {
      console.log("不拼桌,回到首页")
      wx.reLaunch({
        url: '/pages/main/main?jump=' + 0,
      })
    } else if (way == 3) {
      that.toOrderDetailPage(orderid, userClaim)
    }

  },
  bindOrder: function (e) {
    var that = this;
    var orderId = e.currentTarget.dataset.item.orderId
    var userClaim = e.currentTarget.dataset.item.userClaim
    console.log(e)
    that.toOrderDetailPage(orderId, userClaim)
  },
  closeHidden2: function () {
    var that = this;
    var tablenumber = that.data.tablenumber
    if (that.data.tablenumber == 0) {} else {
      that.setData({
        table_name: app.globalData.locationname + -(++tablenumber)
      })
    }
    that.setData({
      hidden2: !that.data.hidden2,
      makeUpTable: true,
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // if (options.popup) {
    //   wx.showModal({
    //     content: '您尚未关注"切瓜切菜"公众号\n关注公众号即可获取平台的5个星盾奖励和商家的买单打折优惠',
    //     cancelText: '直接点餐',
    //     confirmText: '前往关注',
    //     success: res => {
    //       if (res.confirm) {
    //         wx.request({
    //           url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addOrUpdateShopMiddleTemporary',
    //           data: {
    //             shopId: options.shop_id,
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
    //                   link: "/pages/QRorder/QRorder?shop_id=" + options.shop_id + "&table_id=" + options.table_id
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
    //                   link: "/pages/module_others/pages/register/register?orderlink=true" + "&shop_id=" + options.shop_id + "&table_id=" + options.table_id
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
    // }else if(app.globalData.customerInf.signIn == 0){
    //   if(!options.isTemporaryNotRegister){
    //     wx.showModal({
    //       content:'您尚未注册"切瓜切菜"平台账户\n注册平台即可获取平台的5个星盾奖励和商家的买单打折优惠',
    //       cancelText: '暂不注册',
    //       confirmText: '前往注册',
    //       success:res=>{
    //         if(res.confirm){
    //           wx.navigateTo({
    //             url: "../module_others/pages/register/register?openId=" + that.data.openid + "&unionId=" + that.data.unionId ,
    //           })
    //         }
    //       }
    //     })
    //   }
      
    // }
    //that.authorization1()

    if (wx.getStorageSync('userInfoName')) {
      that.setData({
        isFirst: false,
        dineUserName: wx.getStorageSync('userInfoName')
      })
    }
    app.globalData.userNum = that.data.userNum
    app.globalData.adddishes = false
    app.globalData.xdswidth = false
    app.globalData.xdswidthnumber = 4
    app.globalData.locationid = options.table_id
    app.globalData.needOpenSocket = true
    that.getUserInfo() // 获取用户信息
    
    //从数据库获取用户信息
    // setTimeout(function() {
    //         that.getCustomerInfo(app.globalData.openid);
    //    }, 3000);
    that.timeOutGetNickName();
    
    // that.authorization() // 获取unionID

    if (app.globalData.socket_shopId != app.globalData.shopid || app.globalData.isOpenSocket == false) {
      console.log("需要重新连接")
      // app.initSocket()
    }

    that.setData({
      background2: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/authorized.jpg"
    })

    if (options != '') {
      if (options.table_id != null && options.add == "true") {
        shop_id = options.shop_id
        table_id = options.table_id
        app.globalData.shopid = options.shop_id

        var tableNowNum = Number(options.tableNowNum)
        that.getshopinf(shop_id) //查询店铺详细信息，获得店名
        var object = {
          "tableId": table_id
        }
        wx.request({ // tableid查询桌位的名字
          url: app.globalData.allUrl.selectTableNameByTableID,
          data: JSON.stringify(object),
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          success: function (res) {
            console.log(res)
            that.setData({
              table_name: res.data + -(tableNowNum)
            })

            app.globalData.locationname = res.data + -(tableNowNum)
            app.globalData.addtable = "true" //区分是否是孖台
          }
        })

      } else if (options.table_id != null) {
        shop_id = options.shop_id
        table_id = options.table_id
        app.globalData.shopid = options.shop_id
        that.getshopinf(shop_id) //查询店铺详细信息，获得店名

        var object = {
          "tableId": table_id
        }
        wx.request({ // tableid查询桌位的名字
          url: app.globalData.allUrl.selectTableNameByTableID,
          data: JSON.stringify(object),
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          success: function (res) {
            if (res.data == '') {
              wx.showModal({
                title: '提示',
                content: '没有找到这张桌子',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    //返回到首页
                    wx.reLaunch({
                      url: '../main/main',
                    })
                    console.log('返回首页方法')
                  }
                }
              })
            } else {
              that.setData({
                table_name: res.data
              })
              app.globalData.locationname = res.data //这里应该还要加上厅的名字
              app.globalData.addtable = "true" //区分是否是够时间使用
            }
          }
        })

      }
      console.log(111)
      console.log(options)
      console.log(options.scene)
      if (options.scene && options.scene != null && options.scene != undefined && options.scene != 'undefined' && options.scene != '') { // 判断是否是扫码进，先判断是否有待支付的部长点餐的支付订单。
        // 切割小程序二维码的参数，得到桌位tableid和店铺shop_id
        app.globalData.wechatsweep = true
        if (options.scene.search(",") != -1) {
          var arr = options.scene.split(",")
        } else if (options.scene.search("%2C") != -1) {
          var arr = options.scene.split("%2C")
        }

        var shop_id = parseInt(arr[1])
        var table_id = parseInt(arr[2])

        app.globalData.shop_id = shop_id
        app.globalData.shopid = shop_id
        app.globalData.locationid = table_id
        that.setData({
          scene: options.scene
        })

        that.getLocation() // 获取位置
        that.getshopinf(shop_id) //查询店铺详细信息，获得店名
        var object = {
          "tableId": table_id
        }
        console.log(JSON.stringify(object))
        wx.request({ // tableid查询桌位的名字
          url: app.globalData.allUrl.selectTableNameByTableID,
          data: JSON.stringify(object),
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          success: function (res) {
            that.setData({
              table_name: res.data
            })
            that.trytryjiutrytry()
            app.globalData.locationname = res.data //这里应该还要加上厅的名字
            console.log(that.data.table_name)
          }
        })
        //触发判断订单
        that.wtoats()


      } else {
        that.setData({
          stopJump: true
        })
      }
      console.log(options.stopJump)
      if (options.stopJump) {
        that.setData({
          stopJump: options.stopJump
        })
      }

      if (options.scene_after != null) {
        // 切割小程序二维码的参数，得到桌位tableid和店铺shop_id
        app.globalData.wechatsweep = true
        console.log(111)
        console.log(options)
        console.log(options.scene_after)
        if (options.scene_after.search(",") != -1) {
          var arr = options.scene_after.split(",")
        } else if (options.scene_after.search("%2C") != -1) {
          var arr = options.scene_after.split("%2C")
        }

        var shop_id = parseInt(arr[1])
        var table_id = parseInt(arr[2])
        app.globalData.shopid = shop_id
        app.globalData.locationid = table_id

        var object = {
          "tableId": table_id
        }
        wx.request({ // tableid查询桌位的名字
          url: app.globalData.allUrl.selectTableNameByTableID,
          data: JSON.stringify(object),
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          success: function (res) {
            that.setData({
              table_name: res.data
            })
            that.trytryjiutrytry()
            app.globalData.locationname = res.data //这里应该还要加上厅的名字
            console.log(that.data.table_name)
          }
        })
      }
    }
    console.log(app.globalData.myLatitude, "经纬度");
    console.log(app.globalData.myLongitude, "经纬度");
    if (!app.globalData.myLatitude && !app.globalData.myLongitude) {
      that.getLocation() // 获取位置
    } else {
      that.arrivalDistance() //判断到店距离
    }

    // app.getmenu()
  },

  timeOutGetNickName(){
    var that=this;
      setTimeout(function() {

        //一定保证从服务器获取到信息
        if(that.data.get_customer_info_ok==false){
          if(app.globalData.openid&&app.globalData.openid.length>10){
            that.getCustomerInfo(app.globalData.openid);
          }else{
            that.timeOutGetNickName();
          }
        }
       }, 3000);
    

    
  },
  arrivalDistance() {
    let that = this
    console.log(app.globalData.shopdetail, '店铺详情');
    let eat_in_distance = app.globalData.managementData.eat_in_distance
    wx.request({
      url: app.globalData.GetDistanceServlet_url,
      data: {
        lat1: app.globalData.shopdetail.latitude,
        lng1: app.globalData.shopdetail.longitude,
        lat2: app.globalData.myLatitude,
        lng2: app.globalData.myLongitude,
      },
      success: function (res) {
        console.log(res, '当前距离')
        console.log(eat_in_distance, '设置距离');
        if (res.data >= eat_in_distance && eat_in_distance > 0) { //实际填大于三千米，由于测试所以填零
          wx.showModal({
            title: '提示',
            content: '您未到达该店,不能进行到店点餐操作',
            showCancel: false,
            success: res => {
              wx.navigateBack({
                delta: 1,
              })
            }
          })
        }
      }
    })
  },
  wtoats: function () {
    var that = this
    if (app.globalData.username && that.data.stopWtoats) {
      that.setData({
        stopWtoats: false
      })
      that.whetherToPayAccordingTheSeat(app.globalData.shop_id, app.globalData.locationid, that.data.scene) // 判断是否存在需要支付订单

    } else {
      setTimeout(function () {
        that.wtoats()
      }, 500)
    }
  },

  //订单详细信息页面
  toOrderDetailPage: function (orderid, userClaim) {
    var that = this
    console.log("获取订单详情，并跳转")
    if (that.data.show_qr) {
      wx.request({
        url: app.globalData.SelectOrderAllDetailedByOrderId_url,
        data: {
          order_id: orderid //通过orderID获取整张表的具体数据
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
        },
        method: 'POST',
        success: function (res) {
          //先判断是否是部长下单
          console.log(res)
          var order_inf = res.data.data.orderInf
          var dishes_inf = res.data.data.DishesInfs
          var discount_Monney = Number(res.data.data.orderPayment.actualTotal.toFixed(2))
          console.log(order_inf)
          that.changeOldCartList(dishes_inf)
          that.getThisorderarry(orderid)
          //公私户设置
          var payment_address = order_inf.paymentAddress
          if (payment_address == 0) {
            if (app.globalData.managementData.pay_address == 0 || app.globalData.managementData.pay_address == 1) {
              payment_address = 1
            } else {
              payment_address = 2
            }
          }
          that.setData({
            payment_address: payment_address
          })
          if (order_inf.helpOrder != 0) {
            //部长下单
            //认领判断
            if (userClaim != '' && userClaim != null && userClaim != undefined && userClaim != 'null' && userClaim != 0) {
              //变量未定义
              //进入用户判断
              var user1 = app.globalData.user_id
              var user2 = res.data.data.orderInf.userId
              if (user1 != user2) {
                // 非认领者，进入订单详情
                //去订单详情
                wx.navigateTo({
                  url: '../order1/order1?orderid=' + orderid + '&locationindex=' + undefined + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&refreshdelay=' + true + '&QR_judge=' + true
                })
              } else {
                //认领的用户，判断订单状态
                if (order_inf.orderStatus == '等待买单') {
                  wx.showModal({
                    title: '提示',
                    content: "当前订单为等待买单状态",
                    confirmText: "去支付", //默认是“确定”
                    cancelText: "查看详情", //默认是“取消”
                    confirmColor: 'green', //确定文字的颜色
                    cancelColor: 'grey', //取消文字的颜色
                    // confirmText: "此单为部长下的订单，是否绑定到您的信息",
                    success(res) {
                      if (res.confirm) {
                        console.log('用户点击去支付')
                        //去支付的方法
                        wx.navigateTo({
                          url: '../module_others/pages/pay/pay?order_code=' + order_inf.orderCode +
                            '&total_amount=' + discount_Monney +
                            '&order_id=' + order_inf.orderId +
                            '&shop_id=' + order_inf.shopId +
                            '&shop_name=' + app.globalData.shopdetail.shop_name +
                            // '&cz_flag=' + 0 + that.data.payment_address+
                            '&payment_address=' + payment_address
                        })
                      } else if (res.cancel) {
                        console.log('用户点击查看详情')
                        //去查看详情
                        wx.navigateTo({
                          url: '../order1/order1?orderid=' + orderid + '&locationindex=' + undefined + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&refreshdelay=' + true + '&QR_judge=' + true
                        })
                      }
                    }
                  })
                } else {
                  wx.navigateTo({
                    url: '../order1/order1?orderid=' + orderid + '&locationindex=' + undefined + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&refreshdelay=' + true + '&QR_judge=' + true
                  })
                }
              }
              that.setData({
                hidden2: true
              })

            } else {
              //未认领
              // wx.showModal({
              //   title: '提示',
              //   content: "此单为部长下的订单，是否认领此订单",
              //   confirmText: "是", //默认是“确定”
              //   cancelText: "否", //默认是“取消”
              //   // confirmText: "此单为部长下的订单，是否绑定到您的信息",
              //   success(res) {
              //     if (res.confirm) {
              console.log('用户点击确定')
              //进行订单认领
              //先判定是否有phone_num
              var phone_num = app.globalData.phonenumber
              var user_name = app.globalData.username
              var user_id = app.globalData.user_id

              wx.request({
                url: app.globalData.ClaimOrder_url,
                data: {
                  Order_id: orderid,
                  user_id: user_id,
                  user_name: user_name,
                  phone_num: phone_num,
                },
                success: function (res) {
                  console.log(res)
                  if (res.data.result.result == '1') {
                    console.log('认领成功')
                    //成功认领该订单
                    //改OrderDetails符合order_id的所有菜
                    wx.request({
                      url: app.globalData.UpdateOrderUserid_url,
                      // url: 'http://192.168.102.236:8080/UpdateOrderDetails',
                      method: "POST",
                      data: {
                        order_id: orderid,
                        user_id: app.globalData.user_id
                      },
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      success: function (res) {
                        console.log(res)
                        if (res.data.result.result == 1) {

                        }
                      },
                    })
                    //认领的用户，判断订单状态
                    if (order_inf.orderStatus == '等待买单') {
                      wx.showModal({
                        title: '提示',
                        content: "当前订单为等待买单状态",
                        confirmText: "去支付", //默认是“确定”
                        cancelText: "查看详情", //默认是“取消”
                        confirmColor: 'green', //确定文字的颜色
                        cancelColor: 'grey', //取消文字的颜色
                        // confirmText: "此单为部长下的订单，是否绑定到您的信息",
                        success(res) {
                          if (res.confirm) {
                            console.log('用户点击去支付')
                            //去支付的方法
                            wx.navigateTo({
                              url: '../module_others/pages/pay/pay?order_code=' + order_inf.orderCode +
                                '&total_amount=' + discount_Monney +
                                '&order_id=' + order_inf.orderId +
                                '&shop_id=' + order_inf.shopId +
                                '&shop_name=' + app.globalData.shopdetail.shop_name +
                                // '&cz_flag=' + 0 + that.data.payment_address+
                                '&payment_address=' + payment_address
                            })
                          } else if (res.cancel) {
                            console.log('用户点击查看详情')
                            //去查看详情
                            wx.navigateTo({
                              url: '../order1/order1?orderid=' + orderid + '&locationindex=' + undefined + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&refreshdelay=' + true + '&QR_judge=' + true
                            })
                          }
                        }
                      })
                    } else {
                      wx.navigateTo({
                        url: '../order1/order1?orderid=' + orderid + '&locationindex=' + undefined + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&refreshdelay=' + true + '&QR_judge=' + true
                      })
                    }

                  } else if (res.data.result.result == '101') {
                    //该订单已被认领
                    wx.showModal({
                      title: '提示',
                      content: "此订单已被认领",
                      confirmText: "查看订单", //默认是“确定”
                      cancelText: "是", //默认是“取消”
                      // confirmText: "此单为部长下的订单，是否绑定到您的信息",
                      success(res) {
                        if (res.confirm) {
                          wx.navigateTo({
                            url: '../order1/order1?orderid=' + orderid + '&locationindex=' + undefined + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&refreshdelay=' + true + '&QR_judge=' + true
                          })
                        } else if (res.cancel) {}
                      }
                    })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: "绑定失败",
                      confirmText: "重试", //默认是“确定”
                      cancelText: "取消", //默认是“取消”
                      // confirmText: "此单为部长下的订单，是否绑定到您的信息",
                      success(res) {
                        if (res.confirm) {
                          that.toOrderDetailPage(orderid, userClaim)
                        } else if (res.cancel) {}
                      }
                    })
                  }
                }
              })
              wx.request({
                url: app.globalData.UpdateOrderInf_url,
                data: {
                  Order_id: orderid,
                  Shop_id: app.globalData.shopid,
                  user_id: app.globalData.user_id,
                  user_name: app.globalData.username,
                  phone_num: app.globalData.phonenumber,
                },
                success: function (res) {
                  if (res.data.result.result == 1) {
                    console.log('认领成功')
                    //改OrderDetails符合order_id的所有菜
                    wx.request({
                      url: app.globalData.UpdateOrderUserid_url,
                      // url: 'http://192.168.102.236:8080/UpdateOrderDetails',
                      method: "POST",
                      data: {
                        order_id: orderid,
                        user_id: app.globalData.user_id
                      },
                      header: {
                        "Content-Type": "application/x-www-form-urlencoded"
                      },
                      success: function (res) {
                        console.log(res)
                        if (res.data.result.result == 1) {

                        }
                      },
                    })
                  } else {
                    console.log("订单修改失败")
                  }
                }
              })


              // } else if (res.cancel) {
              //   console.log('用户不认领')
              //   wx.navigateTo({
              //     url: '../order1/order1?orderid=' + orderid + '&locationindex=' + undefined + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&refreshdelay=' + true + '&QR_judge=' + true
              //   })
              // }
            }
            // })  
            // }
          } else {
            // 用户下单
            //去订单详情
            wx.navigateTo({
              url: '../order1/order1?orderid=' + orderid + '&locationindex=' + undefined + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&refreshdelay=' + true + '&QR_judge=' + true
            })
          }
        }
      })
    }
  },


  // 判断是否存在需要支付的订单
  whetherToPayAccordingTheSeat: function (shop_id, table_id, scene) {
    console.log("判断是否存在需要支付的订单")
    var that = this
    var user_id = that.data.user_id
    console.log(that.data.stopJump)
    //如果传入user_id,则会根据这个user_id去寻找当前桌子是否有这个id的用户的订单
    //如果不传入user_id,则能看出部长在当前桌子的下单，如果有相对应的订单，则绑到用户身上
    wx.request({ // tableid查询桌位的名字
      url: app.globalData.whetherToOrderAccordingTheSeat_url,
      data: {
        shop_id: shop_id,
        table_id: table_id,
        user_id: user_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
        if (res.data.result == "success" && res.data.orders.orderId_online && res.data.orders.orderId_online.length > 0) {
          that.setData({
            hidden1: true
          })
          console.log("存在代付订单，跳转订单详情页面")
          //进行拼单和补单的询问
          // console.log(res)
          //   wx.showModal({
          //     title: '提示',
          //     content: "此单为部长下的订单，是否认领此订单",
          //     confirmText: "认领已有的订单", //默认是“确定”
          //     cancelText: "不认领", //默认是“取消”
          //     // confirmText: "此单为部长下的订单，是否绑定到您的信息",
          //     success(res) {
          //       if (res.confirm) {
          //         console.log('用户认领')
          //         that.toOrderDetailPage(res.data.orders.orderId_online.orderId,res.data.orders.orderId_online.userClaim)
          //       } else if (res.cancel) {
          //         console.log('用户不认领')
          //         }
          //     }
          // })
          var oo = res.data.orders.orderId_online;
          for (var m = 0; m < oo.length; m++) {
            if (that.data.user_id == oo[m].userId) {
              that.toOrderDetailPage(oo[m].orderId, oo[m].userClaim)
              break;
            } else if (m == oo.length - 1) {
              //没有对应的订单，直接不管，让他自己点
            }
          }
        } else {
          that.setData({
            hidden1: true
          })

          if (res.data.result == "success" && res.data.orders.orderId_directy.length > 0) {
            console.log("存在部长点的订单，进行订单绑定，跳转订单详情页面")
            //进行拼单和补单的询问
            var od = res.data.orders.orderId_directy

            var orderid = res.data.orders.orderId_directy[0].orderId
            var userClaim = res.data.orders.orderId_directy[0].userClaim
            that.setData({
              userClaim: userClaim,
              orderid: orderid
            })
            for (var m = 0; m < od.length; m++) {
              if (that.data.user_id == od[m].userId) {
                // 有相同的id,进入到对应的订单
                that.toOrderDetailPage(od[m].orderId, od[m].userClaim)
                break;
              } else if (m == od.length - 1) {
                //没有相同的id，问是否认领    
                if (od.length > 1) {
                  //如果当前返回的订单有userid和当前用户的id相同，则直接进入订单
                  for (var n = 0; n < od.length; n++) {
                    if (od[n].userId == user_id) {
                      // 有订单
                      console.log('有订单，是第' + n + '个')
                      // 直接跳过认领，直接触发方法
                      that.toOrderDetailPage(od[n].orderId, od[n].userClaim)
                      that.setData({
                        orderId_directy: od,
                      })
                      break;
                    } else if (n == od.length - 1) {
                      //当前没有认领的订单，按照一开始需求的显示
                      //有两分以上，需要选哪份
                      that.setData({
                        orderId_directy: od,
                        hidden2: false
                      })
                    }
                  }
                } else {
                  // wx.showModal({
                  //   title: '提示',
                  //   content: "该桌已订用",
                  //   confirmText: "订单详情", //默认是“确定”
                  //   cancelText: "拼桌", //默认是“取消”
                  //   success(res) {
                  //     if (res.confirm) {
                  //       console.log('订单详情').

                  //单订单直接不管
                  // that.toOrderDetailPage(od[0].orderId,od[0].userClaim);
                  that.setData({
                    orderId_directy: od
                  })
                  //     } else if (res.cancel) {
                  //     console.log('拼桌')
                  //     }
                  //   }
                  // })
                }

              }
            }

          } else if (!(that.data.stopJump)) {
            console.log("既不存在待付订单，也不存在部长线上点单，跳转堂食")
            wx.redirectTo({
              url: '../guide/guide?scene=' + scene,
            })
          }

        }
      }
    })
  },


  trytryjiutrytry: function () {
    var that = this
    var tableid = app.globalData.locationid;
    var halldata = [];
    var room = [];
    var hall = [];
    var roomdata = [];
    var hallAllType = [];
    var alltable = []
    var startingTime
    startingTime = util.formatTime(new Date())
    wx.request({
      url: app.globalData.GetFreeTableInf_url,
      data: {
        shop_id: app.globalData.shopid,
        startingTime: startingTime,
      },
      success: function (res) {
        console.log(res.data.object)
        for (var i = 0; i < res.data.object.length; i++) {
          if (res.data.object[i].field_type == 0) {
            hall.push(res.data.object[i])
          } else {
            room.push(res.data.object[i])
          }
        }
        console.log(room)
        for (var i = 0; i < hall.length; i++) {
          for (var j = 0; j < hall[i].tableManage.length; j++) {
            halldata.push(hall[i].tableManage[j])
          }
        }
        for (var i = 0; i < room.length; i++) {
          for (var j = 0; j < room[i].tableManage.length; j++) {
            roomdata.push(room[i].tableManage[j])
          }
        }
        var run = true
        for (var z = 0; z < halldata.length; z++) {
          if (halldata[z].table_id == tableid) {
            if (halldata[z].table_status == 0 || halldata[z].table_status == 2 || halldata[z].table_status == 3) {
              var run = false
              break;
            }
          }
        }

        for (var y = 0; y < roomdata.length; y++) {
          if (roomdata[y].table_id == tableid) {
            if (roomdata[y].table_status == 0 || roomdata[y].table_status == 2 || roomdata[y].table_status == 3) {
              var run = false
              break;
            }
          }
        }

        if (run == false) {
          // wx.request({
          //   url: app.globalData.GetTableNowName_url,
          //   data: {
          //     shop_id: app.globalData.shopid,
          //     startingTime: startingTime,
          //     table_id: tableid
          //   },
          //   success: function (res) {
          //     if (res.data.result.result == 1 && res.data.tableNowNum !=0) {
          //       that.setData({
          //         hidden1: false,
          //         eatdinnertime: res.data.object.dinner_time,
          //         tablenumber: res.data.object.tableNowNum,
          //       })
          //     }
          //   }
          // })
          wx.request({
            url: app.globalData.GetOrderCountForTableIDByDay_url,
            data: {
              shop_id: app.globalData.shopid,
              table_id: tableid
            },
            success: function (res) {
              if (res.data.result.result == 1 && res.data.tableNowNum != 0) {
                that.setData({
                  eatdinnertime: res.data.object.dinner_time,
                  tablenumber: res.data.object.tableNowNum
                })
                if (that.data.makeUpTable) { //拼桌
                  that.setData({
                    hidden: true,
                    way: 1,
                  })
                  that.confirm()
                } else {
                  that.setData({
                    hidden: false,
                  })
                }
              }
            }
          })

        } else {
          app.globalData.eatin = true
          that.getUserInfo()
        }
      },
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
  // %2C19289%2C50995
  onShow: function () {
    var that = this
    if (app.globalData.countDown_minister) {
      this.countDown(0)
    } else {
      clearInterval(this.data.timerb);
      this.setData({
        fackyousevencolor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
        shineb: true
      })
      app.globalData.countDown_minister = false
    }
    if (app.globalData.countDown_waiter) {
      this.countDown(1)
    } else {
      clearInterval(this.data.timerf);
      this.setData({
        fackyousevencolor1: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
        shinef: true
      })
      app.globalData.countDown_waiter = false
    }
    app.globalData.RMQCallBack = (res) => {
      console.log('收到消息', res)
      let msg = res.data
      console.log(msg, "消息内容")
      let a = new Date()
      if (msg.table_id == app.globalData.locationid) {
        if (msg.tg == "bz" && msg.msg_id == app.globalData.RMQmsg_id) {
          console.log("bzzzzzzzzzzzzzzzzz");
        //   wx.showToast({
        //     title: '部长收到',
        //     icon: 'success',
        //     duration: 2000
        //   })
          that.setData({
            fackyousevencolor: "#ffffff",
            shineb: true,
          })
          clearInterval(that.data.timer);
          app.globalData.countDown_minister = false
        } else if (msg.tg == "fw" && msg.msg_id == app.globalData.RMQmsg_id) {
          console.log("fwwwwwwwwwwwwww");
        //   wx.showToast({
        //     title: '服务员收到',
        //     icon: 'success',
        //     duration: 2000
        //   })
          that.setData({
            fackyousevencolor1: "#ffffff",
            shinef: true
          })
          clearInterval(that.data.timerf);
          app.globalData.countDown_waiter = false
        }
      }
    }
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

    this.setData({
      fackyousevencolor: "#ffffff",
      fackyousevencolor1: "#ffffff",
      shineb: true,
      shinef: true
    })
    clearInterval(this.data.timer);
    clearInterval(this.data.timerf);
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

  },

  toOrder: function () {
    var that = this

    app.globalData.date = that.getNowFormatDate();
    app.globalData.time = that.CurentTime();
    app.globalData.atime = that.CurentTime();
    console.log(app.globalData.cartList, '购物车菜品');
    if (app.globalData.cartList) {
      app.globalData.cartList = []
    }
    console.log(
      app.globalData.phonenumber,
      app.globalData.sex,
      app.globalData.username,
      app.globalData.userNum,
      app.globalData.shopid,
      app.globalData.date,
      app.globalData.time,
      app.globalData.atime,
      app.globalData.locationid,
      app.globalData.locationname
    )
    wx.request({
      // 我要改1.0
      url: app.globalData.getOrderCode,
      data: {
        shop_id: app.globalData.shopid,
      },
      success: function (res) {
        console.log(res.data.orderCode);
        app.globalData.orderCode = res.data.orderCode
      }
    })
    // if (
    //   // app.globalData.phonenumber == null || undefined
    //   // app.globalData.username == null ||
    //   // app.globalData.username == undefined ||
    //   // app.globalData.username == ''
    //   that.data.dineUserName == null ||
    //   that.data.dineUserName == undefined ||
    //   that.data.dineUserName == ''
    // ) {
    //   wx.showModal({
    //     title: '提示',
    //     content: '请填写称呼',
    //     success: function (res) {
    //       return;
    //     }
    //   })

    // } 
    // else {

    if (app.globalData.wechatsweep == true) {
      // app.globalData.locationid = tableid
      var tableid = app.globalData.locationid;
      var halldata = [];
      var room = [];
      var hall = [];
      var roomdata = [];
      var hallAllType = [];
      var alltable = []
      var startingTime
      startingTime = util.formatTime(new Date())
      wx.request({
        url: app.globalData.GetFreeTableInf_url,
        data: {
          shop_id: app.globalData.shopid,
          startingTime: startingTime,
        },
        success: function (res) {
          console.log(res)
          console.log(res.data.object)
          for (var i = 0; i < res.data.object.length; i++) {
            if (res.data.object[i].field_type == 0) {
              hall.push(res.data.object[i])
            } else {
              room.push(res.data.object[i])
            }
          }
          console.log(room)
          for (var i = 0; i < hall.length; i++) {
            for (var j = 0; j < hall[i].tableManage.length; j++) {
              halldata.push(hall[i].tableManage[j])
            }
          }
          for (var i = 0; i < room.length; i++) {
            for (var j = 0; j < room[i].tableManage.length; j++) {
              roomdata.push(room[i].tableManage[j])
            }
          }
          var run = true
          for (var z = 0; z < halldata.length; z++) {
            if (halldata[z].table_id == tableid) {
              if (halldata[z].table_status == 0 || halldata[z].table_status == 2 || halldata[z].table_status == 3) {
                var run = false
                break;
              }
            }
          }

          for (var y = 0; y < roomdata.length; y++) {
            if (roomdata[y].table_id == tableid) {
              if (roomdata[y].table_status == 0 || roomdata[y].table_status == 2 || roomdata[y].table_status == 3) {
                var run = false
                break;
              }
            }
          }
          if (run == false) {
            // wx.request({
            //   url: app.globalData.GetTableNowName_url,
            //   data: {
            //     shop_id: app.globalData.shopid,
            //     startingTime: startingTime,
            //     table_id: tableid
            //   },
            //   success: function (res) {
            //     if (res.data.result.result == 1 && res.data.tableNowNum !=0) {
            //       that.setData({
            //         eatdinnertime: res.data.object.dinner_time,
            //         tablenumber: res.data.object.tableNowNum
            //       })
            //       if(that.data.makeUpTable){//拼桌
            //         that.setData({
            //           hidden: true,
            //           way:1,
            //         })
            //         that.confirm()
            //       }else{
            //         that.setData({
            //           hidden: false,
            //         })
            //       }
            //     }
            //   }
            // })
            wx.request({
              url: app.globalData.GetOrderCountForTableIDByDay_url,
              data: {
                shop_id: app.globalData.shopid,
                table_id: tableid
              },
              success: function (res) {
                if (res.data.result == 'Select is null,') {
                  console.log('当天此桌没有订单')
                } else {
                  if (res.data.result.result == 1 && res.data.tableNowNum != 0) {
                    that.setData({
                      eatdinnertime: res.data.object.dinner_time,
                      tablenumber: res.data.object.tableNowNum
                    })
                    if (that.data.makeUpTable) { //拼桌
                      that.setData({
                        hidden: true,
                        way: 1,
                      })
                      that.confirm()
                    } else {
                      that.setData({
                        hidden: false,
                      })
                    }
                  }
                }
              }
            })

          } else {
            app.globalData.eatin = true
            that.getUserInfo()
            that.recording() // 记录电话 菜单

            wx.navigateTo({
              url: "/pages/module_others/pages/menu/menu?locationindex=undefined&order_type=0"
            })

          }
        },
      })
    } else {
      app.globalData.eatin = true
      that.getUserInfo()
      that.recording() // 记录电话 菜单

      wx.navigateTo({
        url: "/pages/module_others/pages/menu/menu?locationindex=undefined&order_type=0"
      })


    }
    // }
  },


  //点餐人电话
  dinePhoneNumber: function (e) {
    var that = this;
    console.log('用户电话号码', e.detail.value)
    that.setData({
      dinePhoneNumber: e.detail.value
    })
    app.globalData.phonenumber = e.detail.value.replace(/\s*/g, "");
  },

  //点餐人性别
  changeSex: function (e) {
    var that = this;

    console.log(e.currentTarget.dataset.sex)
    that.setData({
      sex: !that.data.sex
    })
    if (that.data.sex) {
      app.globalData.sex = '先生'
      console.log(app.globalData.sex)
    } else if (!that.data.sex) {
      app.globalData.sex = '女士'
      console.log(app.globalData.sex)
    }
  },


  //用餐人数
  userNum: function (e) {
    var that = this;
    console.log('用餐人数', e.detail.value)
    that.setData({
      userNum: e.detail.value,
    })
    // 清除空格避免报错
    app.globalData.userNum = e.detail.value.replace(/\s*/g, "");
  },


  //点餐人姓名
  bookusername: function (e) {
    var that = this;
    console.log('用户称呼', e.detail.value)
    that.setData({
      dineUserName: e.detail.value
    })
    // 清除空格避免报错
    app.globalData.username = e.detail.value.replace(/\s*/g, "");
  },


  //计时器,用于判断用户是否授权
  authorization: function () {
    var that = this
    var countDownNum = 10000
    that.setData({
      timer: setInterval(function () {
        wx.getUserInfo({
          success: function (res) {
            if (res.iv) {
              console.log('获取用户信息')
              that.selectUnionID()
              clearInterval(that.data.timer);
              //如果用户授权了信息，让计时器取消定时
              that.setData({
                showModalStatus: false
              })
            } else {
              that.setData({
                showModalStatus: true
              })
            }
          },
          fail: function (res) {
            that.setData({
              showModalStatus: true
            })
          }
        })
      }, 550) //这里的单位是毫秒，是计时器在倒数时的间隔时间,如果想把闪烁速度调快，把这里的数值调低
    })

  },

  // 获取UnionID
  selectUnionID: function () {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code
          wx.getUserInfo({
            success: function (res) {
              app.globalData.encryptedData = res.encryptedData
              app.globalData.iv = res.iv
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
                  console.log(res)
                  that.setData({
                    unionID: res.data.data.unionId,
                    openid: res.data.data.openid,
                    showModalStatus: false
                  })
                  app.globalData.unionID = res.data.data.unionId
                  var customerInfo=res.data.data.customer;
                  console.log('customerInfo:');
                  console.log(customerInfo);
                  app.globalData.caustomerId = customerInfo.id
                  app.globalData.customerInf = customerInfo
                  app.globalData.user_phone = customerInfo.phone
                  app.globalData.user_name = customerInfo.name  

                  that.isFirst(res)
                  // that.getUserInfo();//重新调用方法，查看是否有订单
                  // that.whetherToPayAccordingTheSeat(app.globalData.shop_id, app.globalData.locationid, that.data.scene) // 判断是否存在需要支付订单
                },
                fail: function (res) {
                  console.log(res.errMsg);
                }
              })
            },
            fail: function (res) {
              console.log(res.errMsg);
            }
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg);
      }
    })
  },
  //获取unionid
  getUserInfo: function () {
    var that = this
    wx.login({
      success: function (res) {
        console.log("获取登录态")
        var code = res.code
        wx.getUserInfo({
          success: function (res) {
            app.globalData.avatarUrl = res.userInfo.avatarUrl
            app.globalData.nickName = res.userInfo.nickName
            wx.request({
              url: app.globalData.allUrl.getUnionID,
              data: {
                code: code,
                encryptedData: res.encryptedData,
                iv: res.iv,
                wechatAppId: app.getWechatAppId(),
                //wsk: app.globalData.wsk
              },
              header: {
                'content-type': 'application/json;charset=utf-8' // 默认值
              },
              method: 'POST',
              success: function (res) {
                console.log(res)
                if (res.data) {
                  that.setData({
                    openid: res.data.data.openid,
                    unionId: res.data.data.unionId
                  })
                  var unionId = res.data.unionId
                  var customerInfo=res.data.data.customer;
                  console.log('customerInfo:');
                  console.log(customerInfo);
                  app.globalData.caustomerId = customerInfo.id
                  app.globalData.customerInf = customerInfo
                  app.globalData.user_phone = customerInfo.phone
                  app.globalData.user_name = customerInfo.name  

                  if (unionId != undefined && unionId != null) {
                    wx.request({
                      url: app.globalData.UserLogin_url,
                      data: {
                        Open_id: that.data.unionId,
                        Shop_id: app.globalData.shopid
                      },
                      success: function (res) {
                        console.log(res.data.result.cause)
                        if (res.data.result.result == 0) {
                          wx.request({
                            url: app.globalData.UserRegistration_url,
                            data: {
                              Head_portrait_img: app.globalData.avatarUrl,
                              User_nickname: app.globalData.nickName,
                              Wx_openid: that.data.unionId,
                              Shop_id: app.globalData.shopid
                            },
                            success: function (res) {
                              console.log(res.data)
                              app.globalData.user_id = res.data.object[0].user_id
                              that.setData({
                                user_id: res.data.object[0].user_id
                              })
                              that.updateorderinf(app.globalData.user_id)
                            },
                          })
                        } else {
                          app.globalData.user_id = res.data.object[0].user_id
                          that.setData({
                            user_id: res.data.object[0].user_id
                          })
                          clearInterval(that.data.timer);
                          that.updateorderinf(app.globalData.user_id)
                          that.setData({
                            showModalStatus1: false
                          })
                        }
                      }
                    })
                  } else {
                    console.log("你的unionId为undefined或null")
                  }
                }
              }
            })
          },
          fail: function (res) {
            console.log(res)
            that.setData({
              showModalStatus1: true
            })
          }
        })
      }
    })
  },
  //从数据库获取客户信息
  getCustomerInfo(openId) {
    console.log("openId:"+openId);
    let that = this
    wx.request({
      url: app.globalData.selectCustomerInfByOpenId_url,
      // url: 'http://localhost:8887/evaluation_war/selectCustomerInfByOpenId',
      method: 'POST',
      data: {
        openid: openId
      },
      header: {
        'content-type': 'application/json;charset=utf-8' // 默认值
      },
      success: function (res) {
        
        console.log("手机号码"+res.data.phone);
        console.log(res);
        var name =res.data.name?res.data.name:'';
        var phone=res.data.phone?res.data.phone:'';
        that.setData({
          dineUserName: name,
          dinePhoneNumber: phone,
        })
        if(phone.length>0){
          that.setData({
            get_customer_info_ok:true,
          })
        }
        
      }
    })
  },


  //记录首次用户登录信息
  postUserInfo(res) {
    var that = this

    var openid = that.data.openid
    var unionId = that.data.unionID
    var focus_time = that.getNowFormatDate();
    wx.getUserInfo({
      success: function (res) {
        let sex = '';
        switch (res.userInfo.gender) {
          case 1:
            sex = '男'
            break;
          case 2:
            sex = '女'
            break;
          default:
            sex = '未知'
        }
        that.setData({
          city: res.userInfo.city,
          country: res.userInfo.country,
          province: res.userInfo.province,
          gender: sex,
          name: res.userInfo.nickName,
        })
        app.globalData.username = res.userInfo.nickName

        wx.request({
          url: app.globalData.allUrl.postUserInfo,
          data: {
            openid: openid,
            unionId: unionId,
            city: that.data.city,
            country: that.data.country,
            province: that.data.province,
            gender: sex,
            name: that.data.name,
            focus_time: focus_time, //还没获取到时间，
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },

          method: 'POST',
          success: function (res) {
            console.log(res)
            if (res.data == "success") {
              console.log('该用户首次登记录成功,记录信息')
            }
          }
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })

  },


  // 判断第一次到店
  isFirst: function (res) {
    var that = this
    wx.request({
      url: app.globalData.allUrl.selectCustomerInfByOpenId_url,
      // url:'http://localhost:8887/evaluation_war/SelectCustomerDetail',
      data: {
        openId: res.data.openid
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data, "这里是1481")
        if (res.data != '') {
          console.log("再次光临");
          wx.getStorage({
            key: "userInfoName",
            success(res) {
              console.log(res.data);
              that.setData({
                isFirst: false,
                dineUserName: res.data.name, //这里是修改将微信用户修改成微信的真实用户昵称
                username: res.data.name,
                toview: false
              })
            }
          })
          app.globalData.username = res.data.name
        } else {
          that.postUserInfo(res) //首次登陆,记录用户信息
        }
        // if (res.data.phone == '' || res.data.phone == undefined || res.data.phone == null) {
        //   that.authorization1() //是否授权
        // } else {
        //   that.setData({
        //     phonenumber: res.data.phone,
        //     dinePhoneNumber: res.data.phone,
        //   })
        //   app.globalData.phonenumber = res.data.phone
        // }

      },
      fail: function (res) {
        console.log('查询是否首次使用堂食失败', res);
      }
    })

  },

  // 记录称呼电话，第一次用
  recording: function (res) {
    var that = this
    var number = app.globalData.phonenumber
    if (number == "00000000000") {
      number = null
    }

    var object = {
      "unionid": that.data.unionID,
      "name": app.globalData.username,
      "phone": number
    }
    console.log(JSON.stringify(object))
    wx.request({
      url: app.globalData.allUrl.updateAppellation,
      data: JSON.stringify(object),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        console.log("记录" + res.data)
      }
    })
  },

  // 获取当前日期，格式为YYYY-MM-DD
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  CurentTime: function () {
    var now = new Date();


    var hh = now.getHours(); //时

    var mm = now.getMinutes(); //分


    var clock = hh + ":";
    if (mm < 10) clock += '0';
    clock += mm;
    return (clock);
  },

  // 修改订单信息
  updateorderinf: function (user_id) {
    var that = this
    var orderid_update = that.data.orderid_update
    var shopid_update = that.data.shopid_update
    if (orderid_update != undefined && shopid_update != undefined && orderid_update != '' && shopid_update != '') {
      wx.request({
        url: app.globalData.UpdateOrderInf_url,
        data: {
          Order_id: orderid_update,
          Shop_id: shopid_update,
          User_id: user_id
        },
        success: function (res) {
          console.log(res)
        }
      })
    }
  },

  //计时器，用于闪烁
  countDown: function (res) {
    var that = this
    var countDownNum = 10000
    if (res == 0 && app.globalData.countDown_minister == true) {
      that.setData({
        timer: setInterval(function () {
          that.setData({
            fackyousevencolor: that.data.fackyousevencolor == 'red' ? 'white' : 'red'
          })
        }, 1000),
      })
    } else if (res == 1 && app.globalData.countDown_waiter == true) {
      that.setData({
        timerf: setInterval(function () {
          that.setData({
            fackyousevencolor: that.data.fackyousevencolor == 'red' ? 'white' : 'red'
          })
        }, 1000)
      })
    }
  },

  getLocation: function () {
    let that = this
    console.log('获取定位')

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        that.setData({
          myLatitude: res.latitude,
          myLongitude: res.longitude
        })
        console.log("经纬度：" + "(" + res.latitude + "," + res.longitude + ")")
        //用腾讯地图的api，根据经纬度获取城市
        qqmap.reverseGeocoder({
          location: {
            latitude: that.data.myLatitude,
            longitude: that.data.myLongitude
          },
          success: function (res) {
            var a = res.result.address_component
            //获取市和区（区可能为空）
            that.setData({
              provinceName: a.province,
              cityName: a.city,
              countyName: a.district,
              isPosition: true
            })
            //赋值给全局变量
            app.globalData.defaultProvince = that.data.provinceName
            app.globalData.defaultCity = that.data.cityName
            app.globalData.defaultCounty = that.data.countyName
            app.globalData.localtionCounty = that.data.countyName
            app.globalData.myLongitude = that.data.myLongitude
            app.globalData.myLatitude = that.data.myLatitude
            app.globalData.isPosition = that.data.isPosition
            //控制台输出结果
            console.log(that.data.provinceName, that.data.countyName, that.data.myLatitude, that.data.myLongitude)
            // that.jump_for_here()

            if (that.getShopDistance) {
              that.getShopDistance(true)
            }
          },
          fail: function (res) {
            console.log('获取地址失败' + res);
          },
          complete: function (res) {
            console.log(res);
            that.jump_for_here()
          }
        })

      },
      fail: function (res) {
        console.log(res)
        //取消授权
        //返回到首页
        console.log('返回首页方法')
        wx.showModal({
          title: '提示',
          content: '没有地理授权信息',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              //返回到首页
              wx.reLaunch({
                url: '../main/main',
              })
              console.log('返回首页方法')
            }
          }
        })
      }
    })
  },

  jump_for_here: function (tableid) {
    var that = this;
    console.log(app.globalData.managementData)
    console.log(app.globalData.myLongitude)
    if (app.globalData.managementData) {
      console.log(app.globalData.managementData.eat_in_distance)
      var eat_in_distance = app.globalData.managementData.eat_in_distance //后台设置的堂食有效距离
      if (app.globalData.myLongitude == 0 && app.globalData.myLatitude == 0) {
        that.setData({
          show_qr: false
        })
        wx.showModal({
          title: '提示',
          content: '没有授权地理位置信息,不能进行堂食点餐',
          success(res) {
            if (res.confirm) {
              //返回到首页
              console.log('返回首页方法')
              wx.reLaunch({
                url: '../main/main',
              })
            }
          }
        })
      } else {
        wx.request({
          url: app.globalData.GetDistanceServlet_url,
          data: {
            lat1: app.globalData.shopdetail.latitude,
            lng1: app.globalData.shopdetail.longitude,
            lat2: app.globalData.myLatitude,
            lng2: app.globalData.myLongitude,
          },
          success: function (res) {
            console.log(res)
            if (res.data >= eat_in_distance && eat_in_distance > 0) { //实际填大于三千米，由于测试所以填零

              that.setData({
                show_qr: false
              })
              wx.showModal({
                title: '提示',
                content: '您未到达该店,不能进行该店的扫码点餐操作',
                showCancel: false,
                success(res) {
                  if (res.confirm) {
                    //返回到首页
                    wx.reLaunch({
                      url: '../main/main',
                    })
                    console.log('返回首页方法')
                  }
                }
              })
            } else {
              console.log(1)
              // wx.navigateTo({
              //   url: '/pages/search/search?tableid=' + tableid + '&jump=' + 1,
              // })
              console.log('返回搜索方法')
            }
          }
        })
      }
    } else {
      setTimeout(function () {
        that.jump_for_here()
      }, 500)
    }

  },
  // 获取店铺信息
  getshopinf: function (shop_id) {
    var that = this;
    console.log("获取店铺信息")
    wx.request({
      url: app.globalData.SelectShopDetails_url,
      data: {
        shop_id: shop_id
      },
      success: function (res) {
        if (res.data != '') {
          that.setData({
            shopdetail: res.data[0],
          })
          app.globalData.shopdetail = res.data[0]
          app.getManagementDataServlet(shop_id)
          wx.setNavigationBarTitle({
            title: "堂食点餐 [" + app.globalData.shopdetail.shop_name + "]"
          })
        } else {
          wx.showModal({
            title: '错误',
            content: '获取店铺信息失败，请重试！',
          })
        }

      }
    })
  },

  getTableInf: function (table_id) {

  },

  //获取手机号码
  getPhoneNumber(e) {
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code
          wx.request({
            url: app.globalData.allUrl.getPhone,
            data: {
              code: code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              wechatAppId: app.getWechatAppId(),
              //wsk: app.globalData.wsk,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
              if (!res.data.phoneNumber) {
                wx.showModal({
                  title: '提示',
                  content: '访问超时，请重试!',
                  showCancel: false,
                  confirmText: '好的'
                })
                return;
              }
              console.log(res)
              console.log(that.data.openid)
              var data = {
                phone: res.data.phoneNumber,
                openId: that.data.openid
              }
              wx.request({
                url: app.globalData.UpdateCustomerByOpenId_Url,
                data: JSON.stringify(data),
                method: 'POST',
                success: res => {
                  console.log(res);
                }
              })
              if (res.errMsg == 'request:ok') {
                that.setData({
                  showAuthorize: false, //关闭弹窗
                  phonenumber: res.data.phoneNumber,
                  dinePhoneNumber: res.data.phoneNumber,
                })
                wx.setStorage({
                  key: 'phonenumber',
                  data: res.data.phoneNumber,
                })

                app.globalData.phonenumber = e.detail.value
              } else {
                wx.showModal({
                  title: '错误',
                  content: '获取失败',
                })
              }
            }
          })
        }
      }
    })

    that.setData({
      showPhone: true
    })
  },
  //拒绝授权，返回首页
  refused: function (res) {
    let that = this

    that.setData({
      showAuthorize: false
    })
    wx.reLaunch({
      url: '../main/main',
    })

  },
  //查看缓存是否有电话
  authorization1: function () {
    var that = this
    if (that.data.showPhone) {
      var phonenumber = wx.getStorageSync("phonenumber")
      if (phonenumber) {
        that.setData({
          showAuthorize: false,
          phonenumber: phonenumber,
          dinePhoneNumber: phonenumber,
          showPhone: false
        })
        app.globalData.phonenumber = phonenumber
      } else {
        that.setData({
          showAuthorize: true,
          showPhone: false
        })
      }
    }
  },
  //把当前改版后的数组中各种菜品整合到一个数组
  changeOldCartList: function (list) {
    var that = this
    var arry = []
    if (list.breakfast) {
      for (var i = 0; i < list.breakfast.length; i++) {
        arry.push(list.breakfast[i].dishes_detailed)
      }
    }
    if (list.dinnerNormal) {
      for (var i = 0; i < list.dinnerNormal.length; i++) {
        arry.push(list.dinnerNormal[i].dishes_detailed)
      }
    }
    if (list.weighingCategory) {
      for (var i = 0; i < list.weighingCategory.length; i++) {
        arry.push(list.weighingCategory[i].dishes_detailed)
      }
    }
    if (list.pieceCategory) {
      for (var i = 0; i < list.pieceCategory.length; i++) {
        arry.push(list.pieceCategory[i].dishes_detailed)
      }
    }
    if (list.teaRice) {
      for (var i = 0; i < list.teaRice.length; i++) {
        arry.push(list.teaRice[i].dishes_detailed)
      }
    }
    if (list.drinks) {
      for (var i = 0; i < list.drinks.length; i++) {
        arry.push(list.drinks[i].dishes_detailed)
      }
    }
    if (list.otherSupplies) {
      for (var i = 0; i < list.otherSupplies.length; i++) {
        arry.push(list.otherSupplies[i].dishes_detailed)
      }
    }
    console.log(arry)


    for (var i = 0; i < arry.length; i++) {
      // 普通菜品分类
      if (arry[i].specalType == 0 && arry[i].specName != '称重') {
        var conventional_dishes = 1;
      }
      // 茶位米饭
      if (arry[i].specalType == 1 && arry[i].specName != '称重') {
        var tea_rice = 1;
      }
      // 酒水
      if (arry[i].specalType == 2 && arry[i].specName != '称重') {
        var drinks_dishes = 1;
      }
      // 其他菜品
      if (arry[i].specalType == 3 && arry[i].specName != '称重') {
        var other_dishes = 1;
      }
      // 早市菜品
      if (arry[i].specalType == 4 && arry[i].specName != '称重') {
        var morning_dishes = 1;
      }
      // 午市菜品
      if ((arry[i].specalType == 5 && arry[i].specName != '称重') || (arry[i].specalType == 5 && arry[i].specId == 5)) {
        var afternoon_dishes = 1;
      }
      // 称重菜品
      if (arry[i].specName == '称重' && arry[i].specId != 5) {
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
    app.globalData.locationindex = 3;

  },
  getThisorderarry: function (orderid) {
    wx.request({
      url: app.globalData.SelectOneOrder1_url,
      data: {
        order_id: orderid
      },
      success: function (res) {
        console.log(orderid, "QRorder2136");
        if (res.data.result.result == 1) {
          app.globalData.thisorderarry = res.data.object
        }
      }
    })
  },
  call: function (e) { //Type 0=部长 1=服务员
    var that = this
    console.log(e.currentTarget.dataset.id)
    let type = e.currentTarget.dataset.id
    app.globalData.RMQmsg_id = app.spawnUUID()
    if (type == 0) {
      if (that.data.shineb == true) {
        var call = {
          msg_id: app.globalData.RMQmsg_id,
          from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
          msg: {
            type: 'call',
            text: '客人呼叫部长'
          },
          table_name: app.globalData.locationname,
          table_id: app.globalData.locationid,
          tg: "bz",
          shop_id: app.globalData.shopid
        }
        console.log("呼叫部长", JSON.stringify(call), call);
        wx.request({
          url: app.globalData.callBz_url,
          data: JSON.stringify(call),
          method: "POST",
          success: function (res) {
            console.log(res, "index36");
            app.globalData.countDown_minister = true
            that.countDown(0)
            that.setData({
              shineb: false
            })
          }
        })
      }else{
        wx.showToast({
          title: '已取消呼叫',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          fackyousevencolor: "#ffffff",
          shineb: true,
        })
        clearInterval(that.data.timer);
        app.globalData.countDown_minister = false
        return;
      }
    } else if (type == 1) {
      if (that.data.shinef == true) {
        var call = {
          msg_id: app.globalData.RMQmsg_id,
          from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
          msg: {
            type: 'call',
            text: '客人呼叫服务员'
          },
          table_name: app.globalData.locationname,
          table_id: app.globalData.locationid,
          tg: "fw",
          shop_id: app.globalData.shopid
        }
        console.log("呼叫服务员", JSON.stringify(call), call);
        wx.request({
          url: app.globalData.callFw_url,
          data: JSON.stringify(call),
          method: "POST",
          success: function (res) {
            console.log(res, "index36");
            app.globalData.countDown_waiter = true
            that.countDown(1)
            that.setData({
              shinef: false
            })
          }
        })
      }else{
        wx.showToast({
          title: '已取消呼叫',
          icon: 'success',
          duration: 1000
        })
        that.setData({
          fackyousevencolor1: "#ffffff",
          shinef: true
        })
        clearInterval(that.data.timerf);
        app.globalData.countDown_waiter = false
        return;
      }
    }
  },
})