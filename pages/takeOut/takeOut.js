//book.js
var util = require('../../utils/util.js');
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hallAllType: [],
    RoomNum: ["12", "15"],
    tablecanset: ["2-3", "4-6", "8-12", "12-15"],
    delivery_arry: ["自提", "配送"],
    showOrHidden1: true,
    showOrHidden2: false,
    tabIndex: 0,
    window: false,
    window1: false,
    window2: false,
    window3: false,
    window4: false,
    hallType: '',
    hallName: '',
    hallId: null,
    roomId: null,
    roomname: '',
    tablenum: '',
    locationid: null,
    room: [],
    hall: [],
    halldata: [],
    roomdata: [],
    newhallarry: [],
    index: 0,
    isshowtable: true,
    hadchangetable: false,
    show_sbwindow: false,
    show_toMenu: app.globalData.show_toMenu,
    thisorderarry: '',
    difference_time: 3600000, //一个半小时的时间戳
    showAuthorize: false, // 是否显示授权弹窗，与授权无关
    thisroom: {},
    inde: '',
    inde1: '',
    roomname: [],
    toview: true, //判断是否是显示查看菜谱
    noteshows: false, //请部长点餐的备注弹窗
    remark: '', //请部长点餐备注
    models: '',
    operatingstate: '', //营业状态.
    operatingTime: '', //营业时间
    btn2: "url('https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/book/btn2.png')",
    btn3: "url('https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/book/btn3.png')",
    btn4: "url('https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/book/btn4.png')",
    hui: "url('https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/book/hui.png')",
    background2: "/images/authorized.jpg", //授权图片,暂时不能放在服务器
    photoShow: false,
    isFirst: false, //第一次到店的判断
    dineUserName: "", //用户名的记录
    dinePhoneNumber: "", //用户电话号码的记录
    address:'',//用户的地址记录
    set_meal:[],//总的套餐数组
    choice_List:[],//有输入过数字的套餐数组
  },
  //点餐人姓名
  bookusername: function(e) {
    var that = this;
    var look = e.detail.value
    var toview
    look == '' || look == null ? toview = true : toview = false
    console.log(e.detail.value)
    that.setData({
      username: e.detail.value,
      show_toMenu: app.globalData.show_toMenu,
      toview: toview
    })

    app.globalData.username = e.detail.value
    console.log(app.globalData.show_toMenu)
  },
  //点餐人性别
  changeradio: function(e) {
    var that = this;
    that.setData({
      index: e.currentTarget.dataset.index
    })
    if (e.currentTarget.dataset.index == 0) {
      app.globalData.sex = '先生'
    } else if (e.currentTarget.dataset.index == 1) {
      app.globalData.sex = '女士'
    }
  },
  //点餐人电话
  phonenumber: function(e) {
    var that = this;
    console.log('用户电话号码', e.detail.value)
    that.setData({
      phonenumber: e.detail.value
    })
    app.globalData.phonenumber = e.detail.value
  },
  address: function (e) {
    var that = this;
    console.log('用户地址', e.detail.value)
    that.setData({
      address: e.detail.value
    })
    app.globalData.address = e.detail.value
  },
  //用餐日期
  bindDateChange: function(e) {
    var that = this;
    console.log('用餐日期', e.detail.value)
    that.setData({
      date: e.detail.value
    })
    console.log(that.data.date)
    if (that.data.date != '' && that.data.atime != '' && that.data.time != '') {
    }
    app.globalData.date = e.detail.value
  },
  //用餐时间
  bindTimeChange: function(e) {
    var that = this;
    console.log('用餐时间', e.detail.value)
    that.setData({
      time: e.detail.value,
      atime: e.detail.value,
      dtime: e.detail.value
    })
    if (that.data.date != '' && that.data.atime != '' && that.data.time != '') {
    }
    app.globalData.time = e.detail.value
    app.globalData.atime = e.detail.value
  },
  //选择配送方式
  bindDeliveryChange: function(e) {
    var that = this;
    console.log('配送方式', e.detail.value)
    that.setData({
      delivery: that.data.delivery_arry[e.detail.value]
    })
    app.globalData.delivery = that.data.delivery_arry[e.detail.value]
  },

  //获取营业状态
  getoperatingstate: function() {
    var that = this
    var operatingstate //营业状态
    wx.request({
      url: app.globalData.ManagementGetShopStateServlet_url,
      data: {
        shop_id: app.globalData.shopid
      },
      success: function(res) {
        if (res.data != "错误") {
          that.setData({
            operatingstate: res.data
          })
        }
      }
    })
  },

  sbwindow_sure: function() {
    app.globalData.userNum = ''
    app.globalData.date = ''
    app.globalData.time = ''
    app.globalData.atime = ''
    app.globalData.username = ''
    app.globalData.phonenumber = ''
    app.globalData.locationname = ''
    app.globalData.locationid = ''
    app.globalData.jump = true
    // 第二次下单的时候会影响
    wx.reLaunch({
      url: '../index/index',
    })
  },

  //创建订单不点菜 (单单创建一张没有菜品信息的订单)
  submit: function() {
    var that = this
    wx.showModal({
      content: '此为订台不点餐',
      success: function(res) {
        if (res.confirm) {
          var sex = sex = '女士'
          if (that.data.index == 0) {
            sex = '先生'
          }
          var field = that.data.field
          var fieldname
          for (var i = 0; i < field.length; i++) {
            for (var j = 0; j < field[i].tableManage.length; j++) {
              if (field[i].tableManage[j].table_id == that.data.locationid) {
                fieldname = field[i].field_name
              }
            }
          }
          var help_order = 0
          if (app.globalData.help_order == true) {
            help_order = 1
          }
          wx.request({
            url: app.globalData.WriteOrder_url,
            data: {
              Order_type: 1, //订单类型：0-堂食、1-预定、2-外卖
              Shop_id: app.globalData.shopid,
              Table_id: 0,
              User_count: 1, //用餐人数
              User_id: app.globalData.user_id,
              Users_id: app.globalData.user_id, //点餐人id，可多人点餐
              Grand_total: 0, //应收
              Order_subtotal: 0, //订单小计
              arrival_time: String(that.data.date) + ' ' + String(that.data.atime) + ':00', //差一个日期

              order_wait: 0, //菜品是否需要叫起
              phone_num: that.data.phonenumber,
              user_name: that.data.username + sex,
              dishes_count: 0,
              invoice_flag: 0,
              preorder_starus: 0,
              operator: "无",
              tbc_count: "0,0",
              table_name: that.data.locationname,
              help_order: help_order,
              cz_flag: 0
            },
            success: function(res) {
              console.log(res)
              if (res.data.result.result == 1) {
                that.setData({
                  show_sbwindow: true
                })

              }
            },
          })
        }
      },
    })
  },
  //预订信息修改
  changeinformation: function() {
    var that = this
    var thisorderarry
    var orderslist = that.data.orderslist
    for (var i = 0; i < orderslist.length; i++) {
      if (orderslist[i].order_id == that.data.orderid) {
        that.setData({
          thisorderarry: orderslist[i],
        })
        break
      }
    }
    //获取用餐时间
    if (that.data.thisorderarry.order_status == '待确认') {
      var old_locationid = that.data.old_locationid
      var locationid = that.data.locationid
      if (that.data.hadchangetable == false) {
        if (that.data.locationindex == 2) {
          wx.request({
            url: app.globalData.GetTablesInf_url,
            data: {
              Shop_id: app.globalData.shopid
            },
            success: function(res) {
              console.log(res)
              var field = res.data.object
              console.log(field)
              for (var i = 0; i < field.length; i++) {
                for (var j = 0; j < field[i].tableManage.length; j++) {
                  if (field[i].tableManage[j].table_id == old_locationid) {
                    that.setData({
                      old_fieldname: field[i].field_name + old_locationid + "号桌"
                    })
                    console.log(that.data.old_fieldname)
                  }
                }
              }
              for (var i = 0; i < field.length; i++) {
                for (var j = 0; j < field[i].tableManage.length; j++) {
                  if (field[i].tableManage[j].table_id == app.globalData.locationid) {
                    that.setData({
                      new_fieldname: field[i].field_name + app.globalData.locationid + "号桌"
                    })
                    console.log(that.data.new_fieldname)
                  }
                }
              }
              wx.request({
                url: app.globalData.UpdateOrderInfForAll_url,
                data: {
                  Order_id: that.data.orderid,
                  Shop_id: app.globalData.shopid,
                  User_count: that.data.userNum,
                  table_id: app.globalData.locationid,
                  table_name: that.data.locationname,
                  dinner_time: String(app.globalData.date) + ' ' + String(app.globalData.time) + ':00'
                },
                success: function(res) {
                  console.log(res)
                  if (res.data.result.result == 1) {
                    that.setData({
                      hadchangetable: true,
                      old_locationid: locationid
                    })
                    wx.reLaunch({
                      url: '/pages/orders/orders',
                    })
                  }
                }
              })
            }
          })
        }
      }

    } else {
      wx.showModal({
        content: '该订单已进入不能取消状态，确定需要取消请于部长协商确认',
        cancelText: "否",
        confirmText: "是",
        success: function(res) {
          if (res.confirm) {
            var old_locationid = that.data.old_locationid
            var locationid = that.data.locationid
            if (that.data.hadchangetable == false) {
              if (that.data.locationindex == 2) {
                wx.request({
                  url: app.globalData.GetTablesInf_url,
                  data: {
                    Shop_id: app.globalData.shopid
                  },
                  success: function(res) {
                    console.log(res)
                    var field = res.data.object
                    console.log(field)
                    for (var i = 0; i < field.length; i++) {
                      for (var j = 0; j < field[i].tableManage.length; j++) {
                        if (field[i].tableManage[j].table_id == old_locationid) {
                          that.setData({
                            old_fieldname: field[i].field_name + old_locationid + "号桌"
                          })
                        }
                      }
                    }
                    for (var i = 0; i < field.length; i++) {
                      for (var j = 0; j < field[i].tableManage.length; j++) {
                        if (field[i].tableManage[j].table_id == app.globalData.locationid) {
                          that.setData({
                            new_fieldname: field[i].field_name + app.globalData.locationid + "号桌"
                          })
                        }
                      }
                    }
                    wx.request({
                      url: app.globalData.UpdateOrderInfForAll_url,
                      data: {
                        Order_id: that.data.orderid,
                        Shop_id: app.globalData.shopid,
                        User_count: that.data.userNum,
                        table_id: that.data.thisorderarry.table_id,
                        table_name: that.data.thisorderarry.table_name,
                        dinner_time: that.data.thisorderarry.dinner_time,
                        before_dinner_time: String(app.globalData.date) + ' ' + String(app.globalData.time) + ':00',
                        before_table_id: app.globalData.locationid,
                        before_table_name: that.data.locationname,
                      },
                      success: function(res) {
                        console.log(res)
                        if (res.data.result.result == 1) {
                          that.setData({
                            hadchangetable: true,
                            old_locationid: locationid
                          })
                          wx.reLaunch({
                            url: '/pages/orders/orders',
                          })
                          // wx.navigateBack({

                          //   delta: 1 //默认值是1

                          // })
                        }
                      }
                    })

                  }
                })
              }
            }

          }
        }
      })

    }

  },

  //确认选好座位，判断参数都填好后就跳转
  toOrder: function(e) {
    var that = this;
    var hadchangetable = that.data.hadchangetable
    var locationindex = that.data.locationindex
    console.log(that.data.locationindex)
    var locationid = 0;
    if (hadchangetable == false && locationindex == 2) {

    } else if (hadchangetable == true && locationindex == 2) {
      //判断到店时间和用餐时间是否合理
      var timestamp = Date.parse(new Date());
      var bookdate = that.data.date + ' ' + that.data.time
      var bookdate1 = that.data.date + ' ' + that.data.atime
      var bookdatestamp = new Date(bookdate.replace(/-/g, "/")).getTime()
      var bookdatestamp1 = new Date(bookdate1.replace(/-/g, "/")).getTime()
      var legaltime = false
      if (timestamp < bookdatestamp1 && bookdatestamp1 <= bookdatestamp) {
        legaltime = true
      }
      if (that.data.username != undefined && that.data.username != '' && that.data.phonenumber != undefined && that.data.phonenumber.length == 11 && that.data.userNum != undefined && that.data.userNum != '' && that.data.userNum > 0 && legaltime == true && e.currentTarget.dataset.model == 1 && that.data.delivery != '' && that.data.delivery != undefined && that.data.address != '' && that.data.address != undefined) {
        app.globalData.eatin = false
        that.write_cartList()
      } else if (that.data.phonenumber == undefined || that.data.phonenumber.length < 11) {
        wx.showModal({
          title: '温馨提示',
          content: '必须填写真实有效的手机号码',
          showCancel: false,
        })
      } else if (that.data.username == undefined || that.data.username == '') {
        wx.showModal({
          title: '温馨提示',
          content: '必须填写点餐人姓名',
          showCancel: false,
        })
      } else if (that.data.delivery == '' || that.data.delivery != undefined) {
        wx.showModal({
          title: '温馨提示',
          content: '必须选择配送方式',
          showCancel: false,
        })
      } else if (that.data.address == '' || that.data.address == undefined) {
        wx.showModal({
          title: '温馨提示',
          content: '必须填写地址',
          showCancel: false,
        })
      } else
      if (legaltime != true) {
        wx.showModal({
          title: '温馨提示',
          content: '请填写合理的时间',
          showCancel: false,
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '未知错误',
          showCancel: false,
        })
      }
    } else {
      //判断到店时间和用餐时间是否合理
      var timestamp = Date.parse(new Date());
      var bookdate = that.data.date + ' ' + that.data.time
      var bookdate1 = that.data.date + ' ' + that.data.atime
      var bookdatestamp = new Date(bookdate.replace(/-/g, "/")).getTime()
      var bookdatestamp1 = new Date(bookdate1.replace(/-/g, "/")).getTime()
      var legaltime = false
      if (timestamp < bookdatestamp1 && bookdatestamp1 <= bookdatestamp) {
        legaltime = true
      }
      if (that.data.username != undefined && that.data.username != '' && that.data.phonenumber != undefined && that.data.phonenumber.length == 11 && legaltime == true && that.data.delivery != '' && that.data.delivery != undefined && that.data.address != '' && that.data.address != undefined) {

        if (e.currentTarget.dataset.model == 1) {
          app.globalData.eatin = false
          app.globalData.locationid = 0;
          app.globalData.userNum = 1;
          app.globalData.locationname = that.data.delivery
          // 判断购物车是否有菜品，有就返回购物车页面
          if (app.globalData.cartList.length > 0) {
            that.write_cartList()
          } else {
            var dinner_time = String(app.globalData.date) + ' ' + String(app.globalData.time) + ':00'
            app.globalData.dinner_time = dinner_time;
            console.log("dinner_time" + app.globalData.dinner_time);

            console.log(that.data.locationindex)

            that.write_cartList()
          }

        } else {
          if (locationindex != 2) {
            that.submit()
          }
        }
      } else if (that.data.phonenumber == undefined || that.data.phonenumber.length < 11) {
        wx.showModal({
          title: '温馨提示',
          content: '必须填写真实有效的手机号码',
          showCancel: false,
        })
      } else if (that.data.username == undefined || that.data.username == '') {
        wx.showModal({
          title: '温馨提示',
          content: '必须填写点餐人姓名',
          showCancel: false,
        })
      } else if (that.data.delivery == '' || that.data.delivery == undefined) {
        wx.showModal({
          title: '温馨提示',
          content: '必须选择配送方式',
          showCancel: false,
        })
      } else if (that.data.address == '' || that.data.address == undefined) {
        wx.showModal({
          title: '温馨提示',
          content: '必须填写地址',
          showCancel: false,
        })
      }else
      if (legaltime != true) {
        wx.showModal({
          title: '温馨提示',
          content: '请填写合理的时间',
          showCancel: false,
        })
      } else {
        wx.showModal({
          title: '温馨提示',
          content: '未知错误',
          showCancel: false,
        })
      }
    }
  },
  //到订单确认页面    
  write_cartList: function() {
    var that = this
    that.order_show();
    var show_toMenu = false
    that.setData({
      show_toMenu: true
    })
    //到选好了逻辑修改
    app.globalData.show_toMenu = true
    var xx = that.data.username
    var ph = that.data.phonenumber
    var da = that.data.date
    var ti = that.data.time
    var un = app.globalData.userNum
    var li = app.globalData.locationid

    //this.data.locationindex != 3判断是否加菜模式 , takeOut为自提外卖
    if (((xx == undefined || xx == '' || ph == undefined || ph == '' || da == undefined || da == '' || ti == undefined || ti == '') && that.data.locationindex != 3) && !that.data.takeOut) {
      setTimeout(function() {
        //要延时执行的代码
        wx.showModal({
          title: '温馨提示',
          content: '请先完善点餐基本信息',
          cancelText: "否",
          confirmText: "是",
          showCancel: false,
        })

      }, 2000) //延迟时间
      // wx.navigateTo({
      //   url: '../book/book'
      // })
      wx.navigateBack({
        delta: 1,
      })
    }
    //locationindex=3时,是加菜状态,允许跳转到订单详情
    console.log(that.data.cupNumber)
    if ((that.data.cupNumber != 0 && xx != undefined && xx != '' && ph != undefined && ph != '' && da != undefined && da != '' && ti != undefined && ti != '') || (that.data.cupNumber != 0 && that.data.locationindex == 3) || (that.data.cupNumber != 0 && that.data.takeOut && (xx == undefined || xx != '' || ph != undefined || ph != '' || da != undefined || da != '' || ti != undefined || ti != ''))) {

      that.setAppData();
      app.globalData.arrival_time = app.globalData.date + ' ' + app.globalData.time
      if (that.data.locationindex == undefined || that.data.locationindex == 'undefined') {
        //更换桌号
        if (app.globalData.backorder == true) {
          app.globalData.backorder = false
          wx.navigateBack({
            delta: 2,
          })
        } else {
          wx.navigateTo({
            url: '../order/order?allowedsubmit=' + true + '&takeOut=' + true  
          })
        }
      } else {
        wx.navigateTo({
          url: '../order/order?locationindex=' + that.data.locationindex + '&orderid=' + that.data.orderid + '&addtobuyarry=' + that.data.addtobuyarry + '&orderDetail=' + that.data.orderDetail + '&em_index=' + that.data.em_index + '&allowedsubmit=' + true + '&takeOut=' + true
        })
      }

    }
  },

  // 分类显示标志（菜单列表显示分类）
  order_show: function() {
    var that = this;
    var cartList = that.data.choice_List;
    var takeOut_dishes
    //套餐不分类
    if(cartList.length>0){
      takeOut_dishes = 1
    }

    that.setData({
      takeOut_dishes: takeOut_dishes
    })
    app.globalData.takeOut_dishes = takeOut_dishes;

  },


  //获得现在的年月日
  getdate: function() {
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    var date2 = new Date(timestamp + 160057209400)
    //年  
    var Y = date.getFullYear();
    //月  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //日  
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    //年  
    var y = date2.getFullYear();
    //月  
    var m = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1);
    //日  
    var d = date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate();

    var nowdate = Y + '-' + M + '-' + D
    var afterdate = y + '-' + m + '-' + d
    // var afterdate = Y + '-' + M + '-' + D
    this.setData({
      nowdate: nowdate,
      afterdate: afterdate
    })

  },

  //获取营业时间
  getoperatingTime: function() {
    var that = this;
    wx.request({
      url: app.globalData.ManagementGetEasyDateServlet_url,
      data: {
        shop_id: app.globalData.shopid
      },
      success: function(res) {
        if (res.data == "101") {
          that.setData({
            operatingTime: '没有设置时间'
          })
        } else {
          that.setData({
            operatingTime: res.data
          })
        }
      }
    })
  },
  comeback: function() {
    var that = this;
    wx.navigateBack({
      delta: 1
    })
  },
  // 获取UnionID
  selectUnionID: function() {
    var that = this
    wx.login({
      success: function(res) {
        if (res.code) {
          var code = res.code
          wx.getUserInfo({
            success: function(res) {
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
                success: function(res) {
                  console.log(res)
                  that.setData({
                    unionID: res.data.data.unionId,
                    openid: res.data.data.openid,
                    showModalStatus: false
                  })
                  that.isFirst(res)
                },
                fail: function(res) {
                  console.log(res.errMsg);
                }
              })
            },
            fail: function(res) {
              console.log(res.errMsg);
            }
          })
        }
      },
      fail: function(res) {
        console.log(res.errMsg);
      }
    })
  },
 
  // 判断第一次到店
  isFirst: function(res) {
    var that = this
    wx.request({
      url: app.globalData.allUrl.selectCustomerInfByOpenId_url,
      data: {
        openId: res.data.openid
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data)
        if (res.data.appellation != null) {
          console.log("再次光临");
          that.setData({
            isFirst: false,
            dineUserName: res.data.appellation,
            dinePhoneNumber: res.data.phone,
            username: res.data.name,
            phonenumber: res.data.phone,
            toview: false
          })
            app.globalData.username = res.data.name,
            app.globalData.phonenumber = res.data.phone
        }
        if (res.data.phone == '' || res.data.phone == undefined || res.data.phone == null) {
          that.authorization() //是否授权
        }

      },
      fail: function(res) {
        console.log('查询是否首次使用堂食失败' + errMsg);
      }
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
      pop_window: 0,
      orderdetail_window: windowHeight * 0.95,
      pop_window_special: windowHeight * 0.8,
      pop_window_special_fuck: windowHeight * 0.85,
      // pop_window_for: windowHeight * 0.7 - 80 - 40 - 70 - 25 - 80
      pop_window_for: 130
    })
    console.log(windowHeight)
  },

  //菜品介绍
  dishesInfo: function (e) {
    var that = this;
    console.log("dishesInfo");
    var index = e.currentTarget.dataset.index
    var set_meal = that.data.set_meal;
    var dishes_id = e.currentTarget.dataset.dishesid;
    var image = set_meal[index].dishes_img
    var dishes_introduce = set_meal[index].dishes_introduce
    // var remark = set_meal[index].remark
    if(set_meal[index].remark){
      var remark = set_meal[index].remark
    }else{
      var remark = ''
    }
    var foodname = set_meal[index].dishes_name
    var foodprices = set_meal[index].dishes_price
    var foodspecifications = set_meal[index].dishes_metering_type
    var showModalStatus4 = that.showModalStatus4;
    that.setData({
      // dishes: dishes,
      foodprices: foodprices, //菜品介绍价格
      foodspecifications: foodspecifications, //菜品介绍规格
      foodname: foodname,
      dishes_introduce: dishes_introduce,
      image: image,
      remark: remark,
      showCartflag: false,
      showModalStatus4: !showModalStatus4,
      foodidnex: index,
    })

    var praise_points = set_meal[index].praise_points
    var monthly_sales_volume = set_meal[index].monthly_sales_volume
      that.setData({
        monthly_sales_volume: monthly_sales_volume,
        praise_points: praise_points
      })

  },
  //叉叉关闭
  closeWindow: function (e) {
    var that = this;
    var index = that.data.foodidnex
    that.setData({
      showModalStatus4: false,
      foodprices: '', //菜品介绍价格
      foodspecifications: '', //菜品介绍规格
      foodname: '',
      image: '',
    })
  },
  //'确认'关闭
  closeWindow2: function (e) {
    var that = this;
    var index = that.data.foodidnex
    var set_meal = that.data.set_meal;
    set_meal[index].remark = that.data.remark
    that.setData({
      showModalStatus4: false,
      foodprices: '', //菜品介绍价格
      foodspecifications: '', //菜品介绍规格
      foodname: '',
      image: '',
      set_meal: set_meal
    })
  },

  //将备注存入全局变量
  addremarks: function (e) {
    console.log(e)
    this.setData({
      remark: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;
    app.globalData.cartList = []
    app.globalData.countarry = []
    app.globalData.weightarry = []
    app.globalData.userNum = ''
    app.globalData.sumMonney = 0
    app.globalData.cupNumber = 0
    app.globalData.date = ''
    app.globalData.time = ''
    app.globalData.atime = ''
    app.globalData.username = ''
    app.globalData.phonenumber = ''
    app.globalData.locationname = ''
    app.globalData.locationid = ''
    console.log(that);
    that.getoperatingstate()
    that.getoperatingTime();
    var cartList = app.globalData.cartList
    console.log(cartList);
    that.getheight();
    that.setData({
      background2: app.globalData.background2
    })
    wx.setNavigationBarTitle({
      title: "线上点餐 [" + app.globalData.shopdetail.shop_name + "]"
    })
    that.setData({
      shopdetail: app.globalData.shopdetail,
      cartList: cartList
    })
    //如果有这个参数,就代表着是从下面两个按钮跳转过来的,给出提示后进行遣返
    if (options.notHavePage){
      wx.showModal({
        title: '提示',
        content: '商家尚未设置此套餐',
        success(res) {
          if (res.cancel) {
            // 用户点击了取消属性的按钮
            //返回上一个页面
            wx.navigateBack({//返回
              delta: 1
            })
          } else if (res.confirm) {
            // 用户点击了确定属性的按钮
            //返回上一个页面
            wx.navigateBack({//返回
              delta: 1
            })
          }
        }
      })
    }
    that.setData({
      cartList: cartList
    })
    if (options) {
      console.log(options)
      if (options.locationindex != undefined) {
        that.setData({
          locationindex: options.locationindex, //判断是否需要修改已经写入数据库的订单
          orderid: options.orderid,
          ordertype: options.ordertype
        })
        if (options.locationindex == 1 || options.locationindex == 2) {
          wx.request({
            url: app.globalData.GetOrderInf_url,
            data: {
              User_id: app.globalData.user_id,
              shop_id: app.globalData.shopid
            },
            success: function(res) {
              if (res.data.result.result == 1) {
                var orderlist = []
                for (var i = 0; i < res.data.object.length; i++) {
                  if (res.data.object[i].order_display == 1) {
                    orderlist.push(res.data.object[i])
                  }
                }
                that.setData({
                  orderslist: orderlist,
                  isshowtable: true
                })
                for (var i = 0; i < res.data.object.length; i++) {
                  if (res.data.object[i].order_id == options.orderid) {
                    var arr = res.data.object[i].arrival_time.split(" ")
                    var arr1 = res.data.object[i].dinner_time.split(" ")
                    var atime1 = arr[1].substring(0, 5)
                    var atime2 = arr1[1].substring(0, 5)
                    var name = res.data.object[i].user_name.substring(0, res.data.object[i].user_name.length - 2)
                    app.globalData.userNum = res.data.object[i].user_count
                    app.globalData.atime = atime1
                    app.globalData.dtime = atime2
                    app.globalData.time = atime2
                    console.log(" app.globalData.time" + app.globalData.time)
                    app.globalData.date = arr1[0]
                    app.globalData.username = name
                    app.globalData.phonenumber = res.data.object[i].phone_num
                    app.globalData.locationid = res.data.object[i].table_id
                    if (options.locationindex == 2) {
                      that.setData({
                        old_locationid: res.data.object[i].table_id
                      })
                    }
                    that.setData({
                      userNum: res.data.object[i].user_count,
                      atime: atime1,
                      dtime: atime2,
                      time: atime2,
                      date: arr1[0],
                      locationid: res.data.object[i].table_id,
                      username: name,
                      phonenumber: res.data.object[i].phone_num
                    })
                  }
                }
              }
            },
          })
        }
      }
    } else {
      this.setData({
        atime: app.globalData.atime,
        time: app.globalData.time,
        date: app.globalData.date,
        userNum: app.globalData.userNum,
        username: app.globalData.username,
        phonenumber: app.globalData.phonenumber
      })
      if (this.data.date != '' && this.data.time != '' && this.data.atime != '') {
        this.setData({
          isshowtable: true
        })
      }

    }
    that.getdate()
    that.selectUnionID()
    app.globalData.sex = '先生'
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    that.getSetMeal()
    
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  authorization: function (res) {
    var that = this
    var phonenumber = wx.getStorageSync("phonenumber")
    if (phonenumber){
      that.setData({
        showAuthorize:false,
        phonenumber: phonenumber
      })
    }else{
      that.setData({
        showAuthorize:true
      })
    }

  },


//后面优化改成接口筛选完再直接返回数组给前端处理
  //获取要显示的套餐
  getSetMeal: function() {
    var that = this;
    var menuList = wx.getStorageSync("menu")
    var set_meal = [];
    if (menuList.length > 0) {
      for (var i = 0; i < menuList.length; i++) {
        for (var n = 0; n < menuList[i].class1s.length; n++) {
          if (menuList[i].class1s[n].type_name.indexOf('超值套餐') != -1) {
            //有套餐这个二级分类
            for (var m = 0; m < menuList[i].class1s[n].class2[0].dishesInfs.length; m++) {
              console.log(menuList[i].class1s[n].class2[0].dishesInfs.length)
              menuList[i].class1s[n].class2[0].dishesInfs[m].dishes_number = 0
              set_meal.push(menuList[i].class1s[n].class2[0].dishesInfs[m])
            }
          }
        }
      }
    }
    console.log(set_meal)
    that.setData({
      set_meal: set_meal
    })
  },
//输入数量
  toNum : function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var set_meal = that.data.set_meal
    var choice_List = that.data.choice_List
    console.log(e)
    set_meal[index].dishes_number = Number(e.detail.value)

    //判断当前菜单中的数组是否有这个套餐
    if(choice_List.length>0){
      for (var i = 0; i < choice_List.length; i++) {
        if (set_meal[index].dishes_id == choice_List[i].dishes_id) {
          if (Number(e.detail.value) == 0) {
            choice_List.splice(i, 1)
            //删掉当前数据
          } else {
            choice_List[i].number = Number(e.detail.value)
            choice_List[i].sum = Number(e.detail.value) * Number(choice_List[i].price)
          }
          break
        } else if (i == choice_List.length - 1) {
          choice_List.push(that.toCartList(set_meal[index]))
        }
      }
    }else{
      choice_List.push(that.toCartList(set_meal[index]))
    }
   
    that.setData({
      set_meal : set_meal,
      choice_List: choice_List
    })
    console.log(that.data.choice_List)
  },

  //对数据进行cartList化,使得order页面可以显示出来
  toCartList: function (dishes){
    var that = this;
    if(dishes.remark){
    }else{
      dishes.remark = ''
    }
    var item = {
      "name": dishes.dishes_name,
      "price": dishes.dishes_price,
      "dishes_price": dishes.dishes_price,
      "number": dishes.dishes_number,
      "sum": Number(dishes.dishes_price) * Number(dishes.dishes_number),
      "img_url": dishes.dishes_img,
      "dishes_id": dishes.dishes_id,
      "monthly_sales_volume": dishes.monthly_sales_volume,//销量
      "praise_points": dishes.praise_points,//点赞
      "spec_name": "默认",
      "spec_type": dishes.dishes_metering_type,
      "dishes_spec_type": dishes.spec_type, //是否多规格
      "disher_weight": 0,
      "specal_type": dishes.specal_type,
      "weighing": dishes.weighing,
      "remark": that.data.remark,
      "remark": dishes.remark,
      "decdishes_flag": 1, //1为此为减菜前点的商品，不能改动
      "adddishes_flag": 0, //1为此为加菜前点的商品，不能改
      "dishes_status": 0,
      "u_item_number": 0,
      "item_type": 0  //0为点餐 2为加菜
    }
    return item;
  },
  setAppData:function(){
    var that = this;
    var list = that.data.choice_List;
    app.globalData.cartList = that.data.choice_List
    app.globalData.thisorderarry = that.data.choice_List 
    app.globalData.locationindex = that.data.locationindex
    app.globalData.locationname = that.data.address
    if (list.length > 0) {
      var cupNumber = 0;
      var money = 0;
      for (var i = 0; i < list.length; i++) {
        cupNumber += Number(list[i].number);
        money += Number(list[i].sum);
      }
      app.globalData.sumMonney = money
      app.globalData.cupNumber = cupNumber
      app.globalData.old_money = money
      app.globalData.show_money = money
      app.globalData.discount_Monney = money
      app.globalData.discount_after_money = money
    }
  },
  //拒绝授权，返回首页
  refused: function (res) {
    let that = this

    that.setData({
      showAuthorize: false
    })

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
              if(res.errMsg=='request:ok'){
                that.setData({
                  showAuthorize: false,//关闭弹窗
                  phonenumber: res.data.phoneNumber
                })
                wx.setStorage({
                  key: 'phonenumber',
                  data: res.data.phoneNumber,
                })
              }else{
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
  }
})