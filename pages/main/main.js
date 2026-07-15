const app = getApp(); //引入全局变量
const pay = require('../../utils/wxpay')
//const QRCode = require("../../utils/weapp-qrcode.js")
import drawQrcode from '../../utils/weapp.qrcode.esm.js'
var util = require('../../utils/util.js');
// 自动定位，引入SDK核心类
var QQMapWX = require('../../utils/qqmap-wx-jssdk.js');
const sceneValue = wx.getLaunchOptionsSync()
var qqmap = new QQMapWX({
  //在腾讯地图开放平台申请密钥 http://lbs.qq.com/mykey.html

  key: 'V2QBZ-KVOKQ-3QS5T-GDXJD-SNQFQ-GKBVE' //此处为个人秘钥,可用老板手机号申请公司的秘钥

});
// const sss = wx.createInnerAudioContext({})

Page({

  /**
   * 页面的初始数据 
   */
  data: {
    QRCodePath:'',
    shareDialog: false,
    showDYDialog: false,
    isFromDY: false,
    isShowImage: false,
    showPoster: false,
    pageNum1: 0,
    pageNumCombo: 0,
    pageNum2: 0,
    pageNum3: 0,
    pageSize: 10,
    foodList: [],
    wineList: [],
    comboList: [],
    comboRefresh: false, //超值套餐
    foodRefresh: false, //超值菜品
    wineRefresh: false,
    couponRefresh: true, //优惠券
    randomDishesRefresh: false, //普通菜品
    couponList: [],
    // 城市选择
    cityName: '',
    openId: '',
    countyName: '',
    provinceName: '',
    isAuthorize: false, // 是否注册
    showAuthorize: false, // 是否显示授权弹窗，与授权无关
    isPosition: false, //是否定位
    cityID: '',
    countyID: '',
    myLatitude: '',
    myLongitude: '',
    userInfo: '',
    topNum: 0,
    setmeal: [], //套餐数组
    setmealPageNum: 0, //分页数字
    coupon: [], //优惠券数组
    randomDishes: [], //随机菜品数组
    RD: false, //是否显示菜品
    _phoneLoginCode: '', // wx.login() 缓存的 code，配合 getPhoneNumber 用
    couponPageNum: 0, //优惠券分页数字
    showcoupon: false, //是否显示优惠券（没套餐显示了）
    stopNext: false, //停止下拉增加数据，防止数据过多
    disPageNum: 0, //菜品分页数字
    swiper_background: ["https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (7).png", "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (2).png", "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (3).png", "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (6).png", "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (5).png"],

    searchicon: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/search.png",
    background2: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/authorized.jpg", //授权图片,暂时不能放在服务器

    //首次登陆需要的userinfo信息：
    city: '', //城市的拼音
    country: '', // 国家
    province: '', // 省份
    gender: '', // 性别
    name: '', // 昵称
    focus_time: '', //关注时间
    pageNum: 0,
    // 轮播图
    imgUrls: [{
      // link: '/pages/index/index',//此处为点击图片跳转路径
      url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/swiper1.jpg'
    }, {
      // link: '/pages/index/index',
      url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/swiper2.jpg'
    }, {
      // link: '/pages/index/index',
      url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/swiper3.jpg'
    }],
    indicatorDots: true, //小点
    indicatorColor: "white", //指示点颜色
    activeColor: "coral", //当前选中的指示点颜色
    autoplay: true, //是否自动轮播
    interval: 4000, //间隔时间
    duration: 3000, //滑动时间
    inviterId: '', //邀请人id
    showModal: false,
    panicBuy: [],
    superType: [],

    functions: [{
        url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/index1.png',
        name: '乔信',
        id: '乔信'
      },
      {
        url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/index10.png',
        name: '扫码点餐',
        id: '扫码点餐'
      },
      {
        url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/index3.png',
        name: '脱单套餐',
        id: '脱单套餐'
      },
      {
        url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/index4.png',
        name: '公众号',
        id: '公众号'
      },
      {
        url: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/index9.png",
        name: '注册',
        id: '注册'
      },
      {
        url: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/index7.png",
        name: '我的订单',
        id: '我的订单'
      },
      {
        url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/index3.png',
        name: '互绑收益',
        id: '互绑收益'
      },
      // {
      //   url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/index5.png',
      //   name: '设置',
      //   id: '设置'
      // },
      // {
      //   url: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/index_7.png",
      //   name: '所有点评',
      //   id: '所有点评'
      // },
      {
        url: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/index11.png",
        name: '超值天地',
        id: '超值天地'
      },
      {
        url: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/index8.png",
        name: '帮助中心',
        id: '帮助中心'
      },
      {
        url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/index5.png',
        name: '平台的我',
        id: '平台的我'
      },
    ],
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
            console.log('请求获取用户信息')
            app.globalData.avatarUrl = res.userInfo.avatarUrl
            app.globalData.nickName = res.userInfo.nickName
            wx.request({
              url: app.globalData.allUrl.getUnionID,
              data: {
                code: code,
                encryptedData: res.encryptedData,
                iv: res.iv,
                wechatAppId: app.getWechatAppId(),                
              },
              header: {
                'content-type': 'application/json;charset=utf-8' // 默认值
            },
            method: 'POST',
              success: function (res) {
                console.log(res, "163main")
                if (res.data) {            
                  that.setData({
                    openid: res.data.data.openid,
                    unionId: res.data.data.unionId
                  })
                  app.globalData.unionID = res.data.data.unionId
                  app.globalData.openid = res.data.data.openid                  
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

  //搜索入口  
  wxSearchTab: function () {
    wx.navigateTo({
      url: '../search/search',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    
    // wx.showModal({
    //   title: '功能测试中',
    //   content: '切瓜切菜点餐小程序正在完善中,敬请期待',
    //   showCancel: false
    // })  

    //bind开始
    if (options.q) {
      //console.log(options, 7777777777777)
      let url = decodeURIComponent(options.q)
     // console.log(decodeURIComponent(url), 7777777777777)
      //console.log(url, 666666666666666666)
      if (url.indexOf('https://') != -1 && url.indexOf('?uuid=') != -1) {
        if (url.indexOf(app.globalData.QRCodeUrl) != -1) {
          let a = url.substring(url.indexOf('?') + 6)
          wx.request({
            url: app.globalData.getOneQrUuid,
            // url: 'http://192.168.8.163:8083/evaluation_war/getOneQrUuid',
            data: {
              qrUuid: a
            },
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: res => {


              // console.log(res)
              // wx.redirectTo({
              //   url: '/' + res.data.data.miniProgram,
              // })
                      //微信界面扫码进来处理逻辑更改  先读取是否有订单，如果有，则进入选择订单界面
                      let a = res.data.data.miniProgram
                      var parameter = a.split("=")[1]
                      var parameter_arry = parameter.split("_")
                      console.log(parameter_arry[0])


                      if (parameter_arry[0].search(",") != -1) {
                        var arr = parameter_arry[0].split(",")
                      } else if (parameter_arry[0].search("%2C") != -1) {
                        var arr = parameter_arry[0].split("%2C")
                      }

                      console.log(arr)
                      if (arr != undefined) {
                        var shopid = parseInt(arr[1])
                        var tableid = parseInt(arr[2])
                        that.setData({
                          shopid: shopid,
                          tableid: tableid
                        })
                        that.setAppShopId(shopid)
                     
                        that.getFocusList(shopid, tableid)

                        console.log("店名ID:" + shopid + "桌位ID:" + tableid)
                      }else{
                          
                        wx.navigateTo({
                            url: '/' + res.data.data.miniProgram,
                        })
                              
                      }



            }
          })
          // return
        } else {
          wx.showModal({
            title: '提示',
            content: '请扫描' + (res.result.indexOf(app.globalData.QRCodeUrl) != -1 ? '正式服' : '测试服') + '二维码',
            success(res) {
              // return
            }
          })
        }
      } else if (url.indexOf('https://') != -1 && url.indexOf('?dyToMeal=') != -1) {
        if (url.indexOf(app.globalData.QRCodeUrl) != -1) {
          //console.log(decodeURIComponent(url))
          let str1 = decodeURIComponent(url).substring(decodeURIComponent(url).indexOf('?dyToMeal=') + 10)
          wx.request({
            // url: 'http://localhost:8889/evaluation/selectTiktokVideoManagementByTiktokVideoName',
            url: app.globalData.selectTiktokVideoManagementByTiktokVideoName,
            data: {
              tiktok_video_name: str1
            },
            method: 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: res => {
              if (res.data.code == 1) {
                if (res.data.data != null) {
                  let inf = res.data.data;
                  let file_id = inf.setMeal_id ? 0 : 1;

                  let mini_program_page = '';
                  let data = '';

                  if (inf.setMeal_id > 0 || inf.coupon_id > 0) {
                    if (inf.setMeal_id > 0) data = '?id=0&setMealID=' + inf.setMeal_id + '&ruleID=' + inf.rule_id + '&clip=' + str1;
                    if (inf.coupon_id > 0) data = '?id=1&coupon_id=' + inf.coupon_id + '&ruleID=' + inf.rule_id + '&shop_id=' + inf.shop_id + '&clip=' + str1;
                  } else {
                    if (inf.setMeal_id == 0) data = '?shop_id=' + inf.shop_id + '&shop_name=' + inf.shop_name + '&clip=' + str1;
                    if (inf.coupon_id == 0) data = '?shop_id=' + inf.shop_id + '&shop_name=' + inf.shop_name + '&file_id=' + file_id + '&clip=' + str1;
                  }

                  mini_program_page = '/' + inf.mini_program_page + data;

                  wx.navigateTo({
                    url: mini_program_page,
                  })
                }
              } else {
                wx.showToast({
                  title: '查询失败',
                  icon: 'error'
                })
              }
            }
          })
          return
        } else {
          wx.showModal({
            title: '提示',
            content: '请扫描' + (res.result.indexOf(app.globalData.QRCodeUrl) != -1 ? '正式服' : '测试服') + '二维码',
            success(res) {
              // return
            }
          })
          return
        }
      }
      else if (url.indexOf('https://') != -1 && url.indexOf('?bind_type=') != -1) {
        // if (url.indexOf(app.globalData.QRCodeUrl) != -1) {
        //console.log(decodeURIComponent(url))
        let str1 = decodeURIComponent(url).substring(decodeURIComponent(url).indexOf('?bind_type='))
        // str1.replace(/\?/g,"{\"").replace(/=/g,"\":\"").replace(/&/g,"\",\"")
        let a = JSON.parse(str1.replace(/\?/g, "{\"").replace(/=/g, "\":\"").replace(/&/g, "\",\"") + "\"}")
        // this.setData({
        //   bind_type: a.bind_type,
        //   shop_id: a.shop_id,
        //   associate_id: a.associate_id,
        //   goods_id: a.goods_id,
        //   associate_type: a.associate_type,          
        // })
        // if (this.data.bind_customer_id) {
			console.log('main onload' + JSON.stringify(a))
        wx.navigateTo({
            url: '/pages/module_others/pages/QRCodeToPage/QRCodeToPage?nostr='+JSON.stringify(a),
        })
        // }
      }
    }
    //bind结束

    if (options.focus_path) {
      console.log(options.focus_path.replace(/{"/g, "?").replace(/":"/g, "=").replace(/","/g, "&").replace(/"}/g, "").replace(/\\"/g, ""))
      wx.navigateTo({
        url: "/pages/module_discount/pages/order/order" + options.focus_path.replace(/{"/g, "?").replace(/":"/g, "=").replace(/","/g, "&").replace(/"}/g, "").replace(/\\"/g, ""),
      })
    } else {
      wx.getClipboardData({
        success: res => {
          wx.hideToast({
            success: (res) => {},
          })
          let str = res.data;
          if (str) {
            // let tmp = new RegExp('/(?<=】).*?(?=\s|\.|#)/g');
            let str1 = ''
            let cutstr = new Promise((a, b) => {
              let tmp = new RegExp('[\\】].*?[\\\s|\.|#]{1}');
              let list = str.match(tmp);
              if (!list) {
                return;
              }
              str1 = list[0].substring(1, list[0].length - 1);
              if (str1 == '{0}') {
                wx.request({
                  url: 'https://api.atim2k.top/takeTikTokTitle',
                  data: {
                    url: 'https://' + str.split('https://')[1]
                  },
                  method: 'GET',
                  success: res => {
                    str1 = res.data.title
                    a()
                  }
                })
              } else {
                a()
              }
            })
            cutstr.then(res => {
              if (!str1) {
                return;
              }
              if (wx.getStorageSync('clip') && wx.getStorageSync('clip') != str1) {
                wx.removeStorageSync('clip')
              }
              wx.request({
                // url: 'http://localhost:8889/evaluation/selectTiktokVideoManagementByTiktokVideoName',
                url: app.globalData.selectTiktokVideoManagementByTiktokVideoName,
                data: {
                  tiktok_video_name: str1
                },
                success: res => {
                  if (res.data.code == 1) {
                    if (res.data.data != null) {
                      let inf = res.data.data;
                      let file_id = inf.setMeal_id ? 0 : 1;

                      let mini_program_page = '';
                      let data = '';

                      if (inf.setMeal_id > 0 || inf.coupon_id > 0) {
                        if (inf.setMeal_id > 0) data = '?id=0&setMealID=' + inf.setMeal_id + '&ruleID=' + inf.rule_id + '&clip=' + str1;
                        if (inf.coupon_id > 0) data = '?id=1&coupon_id=' + inf.coupon_id + '&ruleID=' + inf.rule_id + '&shop_id=' + inf.shop_id + '&clip=' + str1;
                      } else {
                        if (inf.setMeal_id == 0) data = '?shop_id=' + inf.shop_id + '&shop_name=' + inf.shop_name + '&clip=' + str1;
                        if (inf.coupon_id == 0) data = '?shop_id=' + inf.shop_id + '&shop_name=' + inf.shop_name + '&file_id=' + file_id + '&clip=' + str1;
                      }

                      mini_program_page = '/' + inf.mini_program_page + data;

                      wx.navigateTo({
                        url: mini_program_page,
                      })
                    }
                  } else {
                    wx.showToast({
                      title: 'dy查询失败',
                      icon: 'error'
                    })
                  }
                }
              })
            })
          }
        },
        complete: res => {
          wx.hideToast({
            success: (res) => {},
          })
        }
      })
    }

    if (options.toshopid) {
      wx.navigateTo({
        url: '../module_others/pages/QR_to_shop/QR_to_shop?shopid=' + options.toshopid,
      })
    }

    console.log(app.globalData.QRCodeUrl)
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res)
          var code = res.code
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName
              })
              app.globalData.encryptedData = res.encryptedData
              app.globalData.iv = res.iv
              console.log("wx.login")
              wx.request({
                url: app.globalData.allUrl.getUnionID,
                data: {
                  wechatAppId: app.getWechatAppId(),                  
                  code: code,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                },
                header: {
                  'content-type': 'application/json;charset=utf-8' // 默认值
                },
                method: 'POST',
                success: function (res) {
                  console.log(res, "unionId和openId")

                  var openid = res.data.data.openid
                  var unionID = res.data.data.unionId

                  let promise = new Promise(resolve => {
                    app.getCustomerInfo(res.data.data.openid)
                    resolve();
                  })

                  promise.then(resolve => {
                    wx.getLocation({
                      type: 'wgs84',
                      success: function (res) {
                        //添加进入小程序的记录(获取经纬度)
                        wx.request({
                          // url: 'http://localhost:8889/evaluation/addLocationHistory',
                          url: app.globalData.addLocationHistory,
                          method: 'POST',
                          data: {
                            customerId: app.globalData.customerInf.id,
                            longitude: res.longitude,
                            latitude: res.latitude
                          },
                          success: res => {                           
                          }
                        })
                      }
                    })
                  })

                  that.setData({
                    openId: openid,
                    unionID: unionID
                  }, () => {
                    console.log(sceneValue.scene, "场景值-1");
                    if (sceneValue.scene == 1011) {
                      that.getFocusList("", "")
                    }
                  })

                  app.globalData.unionID = res.data.data.unionId
                  app.globalData.openid = res.data.data.openid             
                }
              })
            },

            fail: function (res) {
              console.log('获取unionId失败，用户未授权')
              that.setData({
                dy_flesh: true
              })             
            },

          })
        }
      }
    })
    // that.getUserInfo()
    if (app.globalData.username === '') {
      wx.getStorage({
        key: "userInfoName",
        success: res => {
          app.globalData.username = res.data
        }
      })
    }
    if (options.jump == '0') {
      console.log(options.user_id)
      console.log(options.userInfoName)
      console.log(options.phonenumber)
      console.log(options.jump)
      wx.setStorageSync('user_id', options.user_id)
      // wx.setStorageSync('userInfoName', options.userInfoName)
      wx.setStorageSync('phonenumber', options.phonenumber)
      wx.navigateTo({
        url: '/pages/search/search?jump=' + 0,
      })
    }
    if (options.dyuserid) {
      that.jump_taocan_list(options.dyuserid)
    }
    // 当首次登录带有邀请者id的时候，在授权之后记录新用户信息，邀请者加星盾
    // 当登录是带有堂食二维码、获取id，跳转到相对应的店铺
    // 首先获取用户unionId，如果获取不到即视为未登录/未授权，获得到即为登录
    // 而且如果user_code不为null的时候，则为注册
    // 解决背景图无法显示问题
    var that = this;
    if (options.scene != null) {
      console.log(options)
      if (options.scene.indexOf(",") != -1 || options.scene.indexOf("%2C") != -1) {
        wx.redirectTo({
          url: '../guide/guide?scene=' + options.scene,
        })
      } else {
        console.log("部长绑定")
        //店员id和用户id
        var staff_id = options.scene.split("=")[1]
        var union_id = app.globalData.unionID
        that.BindingCustomer(staff_id, union_id)
      }
    }
    //获取中间的图片判断
    wx.request({
      url: app.globalData.ManagementGetDataServlet_url,
      data: {
        shop_id: 20903
      },
      success: function (res) {
        console.log(res.data.mornibg_tea)
        var img_Url = -1;
        if (res.data.data.mornibg_tea == 1) {
          img_Url = 1
        } else {
          img_Url = 0
        }
        that.setData({
          img_Url: img_Url
        })
      }
    })

    // that.authorization() //是否授权

    // app.closeSocket();

    if (options.shopid != null) {
      console.log(options.shopid)
      console.log("options============" + options.shopid + "店铺程序跳转")
      app.globalData.shopid = options.shopid
      wx.navigateTo({
        url: '../index/index',
      })
    }

    // let base64b = wx.getFileSystemManager().readFileSync(that.data.background2, 'base64');

    that.setData({
      // 'background2': 'data:image/jpg;base64,' + base64b,
      isPosition: app.globalData.isPosition
    });
    // app.globalData.background2 = 'data:image/jpg;base64,' + base64b
    app.globalData.background2 = that.data.background2

    //自动跳转到店铺首页
    if (app.globalData.jump == true) {
      app.globalData.jump = false
      wx.navigateTo({
        url: '../index/index',
      })
    }
    //获取套餐
    // wx.request({
    //   // url: 'https://mb.fsmbdlkj.com/diancanxing/shop/cityNameQueryCityID',
    //   url: app.globalData.selectSetmealForNum_url,
    //   data: {
    //     "shop_id": '',
    //     "pageNum": that.data.setmealPageNum
    //   },
    //   header: {
    //     'content-type': 'application/json'
    //   },
    //   method: 'POST',
    //   success: function (res) {
    //     console.log(res)
    //     var setmealPageNum = that.data.setmealPageNum + 20
    //     that.setData({
    //       setmeal: res.data.selectResult,
    //       setmealPageNum: setmealPageNum
    //     })
    //   }
    // })
    //获取代金券
    // that.getCoupon()
    // that.getRandomDishes()
    // that.getRandomDishes2()
    if (options.toLove) {
      wx.navigateTo({
        url: '/pages/module_discount/pages/loveSet/loveSet',
      })
    }
    // 预取 wx.login() code，之后获取手机号时配合 encryptedData 发给后端
    that.refreshPhoneCode()
  },

  // 调用 wx.login() 获取 code 并缓存，不要消费这个 code！
  refreshPhoneCode: function() {
    var that = this
    wx.login({
      success: function(res) {
        if (res.code) {
          console.log('phone login code 已缓存:', res.code.substring(0, 10) + '...')
          that.setData({ _phoneLoginCode: res.code })
        }
      }
    })
  },

  //超值菜品
  getSetMealAllInfo() {
    console.log('超值菜品');
    let that = this
    let ListA = that.data.foodList;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    that.setData({
      foodRefresh: false
    })
    wx.request({
      url: app.globalData.selectAllSetMealInfo_url,
      data: {
        shopId: '',
        typeForSetMeal: 2,
        pageIndex: that.data.pageNum1,
        pageSize: that.data.pageSize,
      },
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.result == 0) {
          that.setData({
            wineRefresh: true
          }, () => {
            that.sv_flesh()
          })
        } else {
          if (res.data.selectResult.length < that.data.pageSize) {
            that.setData({
              wineRefresh: true
            }, () => {
              that.sv_flesh()
            })
          }
          if (res.data.selectResult.length >= that.data.pageSize) {
            that.setData({
              foodRefresh: true
            })
          }
          for (const x of res.data.selectResult) {
            if (x.useTimeType) {
              let usefulDate = x.useTimeType
              if (usefulDate.substr(usefulDate.length - 1, 1) == ',') {
                usefulDate = usefulDate.substr(0, usefulDate.length - 1)
              }
              var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5', '3,4', '4,5,6,7', '4,5,6', '4,5', '5,6,7', '5,6', '6,7']
              if (shit.indexOf(usefulDate) != -1) {
                var day = usefulDate.substring(0, 1).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六') + ' 至 星期' + usefulDate.substring(usefulDate.length - 1, usefulDate.length).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六').replace('7', '日')
                x.useTimeType = '星期' + day + ' 可用'
              } else {
                usefulDate = usefulDate.split(',')
                var day = ''
                if (usefulDate.indexOf('1') != -1) {
                  day += '一、'
                }
                if (usefulDate.indexOf('2') != -1) {
                  day += '二、'
                }
                if (usefulDate.indexOf('3') != -1) {
                  day += '三、'
                }
                if (usefulDate.indexOf('4') != -1) {
                  day += '四、'
                }
                if (usefulDate.indexOf('5') != -1) {
                  day += '五、'
                }
                if (usefulDate.indexOf('6') != -1) {
                  day += '六、'
                }
                if (usefulDate.indexOf('7') != -1) {
                  day += '日、'
                }
                // console.log(day)
                x.useTimeType = '星期' + day.substring(0, day.length - 1) + '可用'
              }
            }
            ListA.push(x)
          }
          that.setData({
            pageNum1: Number(that.data.pageNum1) + 1,
            foodList: ListA,
          }, () => {
            wx.hideLoading({
              success: (res) => {},
            })
          })
        }

      }
    })
  },

  getWineList() {
    let that = this
    let ListA = that.data.wineList;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    that.setData({
      wineRefresh: false
    })
    wx.request({
      url: app.globalData.selectAllSetMealInfo_url,
      data: {
        shopId: '',
        typeForSetMeal: 3,
        pageIndex: that.data.pageNum3,
        pageSize: that.data.pageSize,
      },
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.result == 0) {
          that.setData({
            comboRefresh: true
          }, () => {
            that.sv_flesh()
          })
        } else {
          if (res.data.selectResult.length < that.data.pageSize) {
            that.setData({
              comboRefresh: true
            }, () => {
              that.sv_flesh()
            })
          }
          if (res.data.selectResult.length >= that.data.pageSize) {
            that.setData({
              wineRefresh: true
            })
          }
          for (const x of res.data.selectResult) {
            if (x.useTimeType) {
              let usefulDate = x.useTimeType
              if (usefulDate.substr(usefulDate.length - 1, 1) == ',') {
                usefulDate = usefulDate.substr(0, usefulDate.length - 1)
              }
              var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5', '3,4', '4,5,6,7', '4,5,6', '4,5', '5,6,7', '5,6', '6,7']
              if (shit.indexOf(usefulDate) != -1) {
                var day = usefulDate.substring(0, 1).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六') + ' 至 星期' + usefulDate.substring(usefulDate.length - 1, usefulDate.length).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六').replace('7', '日')
                x.useTimeType = '星期' + day + ' 可用'
              } else {
                usefulDate = usefulDate.split(',')
                var day = ''
                if (usefulDate.indexOf('1') != -1) {
                  day += '一、'
                }
                if (usefulDate.indexOf('2') != -1) {
                  day += '二、'
                }
                if (usefulDate.indexOf('3') != -1) {
                  day += '三、'
                }
                if (usefulDate.indexOf('4') != -1) {
                  day += '四、'
                }
                if (usefulDate.indexOf('5') != -1) {
                  day += '五、'
                }
                if (usefulDate.indexOf('6') != -1) {
                  day += '六、'
                }
                if (usefulDate.indexOf('7') != -1) {
                  day += '日、'
                }
                // console.log(day)
                x.useTimeType = '星期' + day.substring(0, day.length - 1) + '可用'
              }
            }
            ListA.push(x)
          }
          that.setData({
            pageNum3: Number(that.data.pageNum3) + 1,
            wineList: ListA,
          }, () => {
            wx.hideLoading({
              success: (res) => {},
            })
          })
        }

      }
    })
  },
  // 超值优惠券
  getCouponAll() {
    console.log('优惠券');
    let that = this
    let ListC = that.data.couponList
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    that.setData({
      couponRefresh: false,
    })
    wx.request({
      url: app.globalData.getCouponAllPage_url,
      data: {
        shopId: '',
        pageSize: that.data.pageSize,
        pageIndex: that.data.pageNum2,
      },
      success: res => {
        if (res.data.paramsList.length == 0) {
          that.setData({
            foodRefresh: true,
          }, () => {
            that.sv_flesh()
          })
        } else {
          if (res.data.paramsList.length < that.data.pageSize) {
            that.setData({
              foodRefresh: true,
            }, () => {
              that.sv_flesh()
            })
          }
          if (res.data.paramsList.length >= that.data.pageSize) {
            that.setData({
              couponRefresh: true,
            })
          }
          for (const x of res.data.paramsList) {
            if (x.coupon_ruleweekstar) {
              let usefulDate = x.coupon_ruleweekstar
              if (usefulDate.substr(usefulDate.length - 1, 1) == ',') {
                usefulDate = usefulDate.substr(0, usefulDate.length - 1)
              }
              var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5', '3,4', '4,5,6,7', '4,5,6', '4,5', '5,6,7', '5,6', '6,7']
              if (shit.indexOf(usefulDate) != -1) {
                var day = usefulDate.substring(0, 1).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六') + ' 至 周' + usefulDate.substring(usefulDate.length - 1, usefulDate.length).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六').replace('7', '日')
                x.coupon_ruleweekstar = '周' + day + ' 可用'
              } else {
                usefulDate = usefulDate.split(',')
                var day = ''
                if (usefulDate.indexOf('1') != -1) {
                  day += '一、'
                }
                if (usefulDate.indexOf('2') != -1) {
                  day += '二、'
                }
                if (usefulDate.indexOf('3') != -1) {
                  day += '三、'
                }
                if (usefulDate.indexOf('4') != -1) {
                  day += '四、'
                }
                if (usefulDate.indexOf('5') != -1) {
                  day += '五、'
                }
                if (usefulDate.indexOf('6') != -1) {
                  day += '六、'
                }
                if (usefulDate.indexOf('7') != -1) {
                  day += '日、'
                }
                x.coupon_ruleweekstar = '周' + day.substring(0, day.length - 1) + '可用'
              }
              x.coupon_validityend = util.formatTime3(x.coupon_validityend, 'Y-M-D')
              x.coupon_facevalue = util.toFix(x.coupon_facevalue)
            }
            if (x.coupon_type != '45336A43-93C8-48A1-8DE9-90C0258FA548') {
              ListC.push(x)
            }
            x.coupon_original = x.coupon_original.toFixed(2)
          }
          that.setData({
            pageNum2: Number(that.data.pageNum2) + 1,
            couponList: ListC
          }, () => {
            wx.hideLoading({
              success: (res) => {},
            })
          })
        }
      }
    })
  },
  // 超值套餐
  getComboInfo() {
    console.log('超值套餐');
    let that = this
    let ListD = that.data.comboList;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    that.setData({
      comboRefresh: false
    })
    wx.request({
      url: app.globalData.selectAllSetMealInfo_url,
      data: {
        shopId: '',
        typeForSetMeal: 1,
        pageIndex: that.data.pageNumCombo,
        pageSize: that.data.pageSize,
      },
      method: "POST",
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        if (res.data.result == 0) {
          that.setData({
            randomDishesRefresh: true
          }, () => {
            that.sv_flesh()
          })
        } else {
          if (res.data.selectResult.length < that.data.pageSize) {
            that.setData({
              randomDishesRefresh: true
            }, () => {
              that.sv_flesh()
            })
          }
          if (res.data.selectResult.length >= that.data.pageSize) {
            that.setData({
              comboRefresh: true
            })
          }
          for (const x of res.data.selectResult) {
            if (x.useTimeType) {
              let usefulDate = x.useTimeType
              if (usefulDate.substr(usefulDate.length - 1, 1) == ',') {
                usefulDate = usefulDate.substr(0, usefulDate.length - 1)
              }
              var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5', '3,4', '4,5,6,7', '4,5,6', '4,5', '5,6,7', '5,6', '6,7']
              if (shit.indexOf(usefulDate) != -1) {
                var day = usefulDate.substring(0, 1).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六') + ' 至 星期' + usefulDate.substring(usefulDate.length - 1, usefulDate.length).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六').replace('7', '日')
                x.useTimeType = '星期' + day + ' 可用'
              } else {
                usefulDate = usefulDate.split(',')
                var day = ''
                if (usefulDate.indexOf('1') != -1) {
                  day += '一、'
                }
                if (usefulDate.indexOf('2') != -1) {
                  day += '二、'
                }
                if (usefulDate.indexOf('3') != -1) {
                  day += '三、'
                }
                if (usefulDate.indexOf('4') != -1) {
                  day += '四、'
                }
                if (usefulDate.indexOf('5') != -1) {
                  day += '五、'
                }
                if (usefulDate.indexOf('6') != -1) {
                  day += '六、'
                }
                if (usefulDate.indexOf('7') != -1) {
                  day += '日、'
                }
                // console.log(day)
                x.useTimeType = '星期' + day.substring(0, day.length - 1) + '可用'
              }
            }
            ListD.push(x)
          }
          that.setData({
            pageNumCombo: Number(that.data.pageNumCombo) + 1,
            comboList: ListD,
          }, () => {
            wx.hideLoading({
              success: (res) => {},
            })
          })
        }

      }
    })
  },

  fucClick(event) {
    var that = this;
    const id = event.currentTarget.dataset.id;
    if (id == '乔信') {
        //邀请收益 暂无使用
        //   wx.navigateTo({
        //     url: '../invite/invite?openId=' + that.data.openId,
        //   })
        wx.navigateTo({
            url: '/pages/module_others/pages/chatWithCust/chatWithCust',
        })

    } else if (id == '优惠信息') {
      app.undone()
      // wx.navigateTo({
      //   url: '../discount/discount',
      // })
    } else if (id == '限时抢购') {
      // app.undone()
      wx.navigateTo({
        url: '../module_others/pages/lobster/lobster',
      })
    } else if (id == '免费加盟') {
      app.undone()
    } else if (id == '公众号') {
      wx.navigateTo({

        url: '../module_others/pages/wxPublic/out',
      })
    } else if (id == '设置') {
      wx.navigateTo({
        url: '../module_others/pages/setUp/setUp',
      })
    } else if (id == '婚宴酒店') {
      app.undone()
      // wx.navigateTo({
      //   url: '../weddingHotel/weddingHotel',
      // })
    } else if (id == '帮助中心') {
      wx.navigateTo({
        url: '../help/help',
      })
    } else if (id == '临工频道') {
      app.undone()
      // wx.navigateTo({
      //   url: '../temporary/temporary',
      // })
    } else if (id == '首页') {
      wx.navigateTo({
        url: '../main/main',
      })
    } else if (id == '搜索') {
      wx.navigateTo({
        url: '../search/search',
      })
    } else if (id == '运动健身') {
      wx.navigateTo({
        url: '../module_others/pages/T_club/T_club',
      })
    } else if (id == '互绑收益') {
      wx.navigateTo({
        url: '../module_others/pages/bindInfo/bindInfo',
      })
    } else if (id == '客服') {
      wx.navigateTo({
        url: '../module_others/pages/newchat/newchat',
      })
    } else if (id == '注册') {
      if (that.data.openId != '') {
        wx.navigateTo({
          url: '../module_others/pages/register/register?openId=' + that.data.openId + '&unionId=' + that.data.unionID,
        })
      }
    } else if (id == '超值天地') {
      wx.navigateTo({
        url: '../module_discount/pages/greatvalueworld/greatvalueworld?shopId=' + app.globalData.platformShopId,
      })
    } else if (id == '所有点评') {
      wx.navigateTo({
        url: '../module_others/pages/evaluation/evaluation',
      })
    } else if (id == '我的订单') {
      wx.navigateTo({
        url: '../module_discount/pages/orderList/orderList?intoId=0',
      })
      // wx.navigateTo({
      //   url: '../web/web',
      // })
      // that.showOut()
    } else if (id == '扫码点餐') {
      that.qrscan()
    } else if (id == '脱单套餐') {
      wx.navigateTo({
        url: '/pages/module_discount/pages/activityPage/activityPage',
      })
    } else if (id == '平台的我') {
      wx.navigateTo({
        url: '../mine/mine?shopId=' + app.globalData.platformShopId + '&shopName=' + '诗么普平台',
      })
    } else {
      app.undone()
    }

  },
  //普通
  GetQgqcDishesForNum() {
    console.log(3);
    let that = this
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.globalData.GetQgqcDishesForNum_url,
      // url: 'http://localhost:8087/WX Restaurant/GetQgqcDishesForNum',
      data: {
        shop_id: 0,
        pageNum: that.data.pageNum,
      },
      success: res => {
        if (res.data.result.result == 1) {
          let a = that.data.randomDishes
          for (let i = 0; i < res.data.object.length; i++) {
            if (res.data.object[i].search_type === 0) {
              a.push(res.data.object[i])
            }
          }
          that.setData({
            pageNum: Number(that.data.pageNum) + 1,
            randomDishes: a,
          }, () => {
            wx.hideLoading({
              success: (res) => {},
            })
          })
        } else {
          that.setData({
            isShowImage: true
          })
        }

      }
    })
  },



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    app.DYBookCallBack = (bool) => {
      if (app.globalData.user_phone) {
        wx.request({
          url: app.globalData.getTikTokBookComboByPhone,
          method: 'GET',
          data: {
            phone: app.globalData.user_phone
          },
          success: res => {
            if (res.data.data.length < 1) {
              return;
            }
            wx.showLoading({
              title: '加载中...',
            })
            console.log(res)
            let DYMealArry = []
            for (let i = 0; i < res.data.data.length; i++) {
              const element = res.data.data[i];
              if (element.bookType == 1) {
                wx.request({
                  url: app.globalData.getCouponByCouponId,
                  data: {
                    couponId: element.couponId,
                  },
                  method: 'GET',
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: res2 => {
                    let createDate = element.createTime.split(" ")[0].split("-")[1] + "-" + element.createTime.split(" ")[0].split("-")[2]
                    let createTime = element.createTime.split(" ")[1].split(":")[1] + ":" + element.createTime.split(" ")[1].split(":")[2].split('.')[0]
                    let a = res2.data.data
                    a.createDate = createDate
                    a.createTime = createTime
                    a.DYUid = element.uid
                    DYMealArry.push(a)
                    this.setData({
                      DYMealArry: DYMealArry,
                    })
                  }
                })
              } else {
                wx.request({
                  url: app.globalData.selectSetMealInfo_url,
                  data: {
                    setMealID: element.setMealId,
                    shop_id: element.shopId,
                    startUsing: "",
                    typeForSetMeal: ''
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: res2 => {
                    let createDate = element.createTime.split(" ")[0].split("-")[1] + "-" + element.createTime.split(" ")[0].split("-")[2]
                    let createTime = element.createTime.split(" ")[1].split(":")[0] + ":" + element.createTime.split(" ")[1].split(":")[1]
                    let a = res2.data.selectResult[0]
                    a.DYUid = element.uid
                    a.createDate = createDate
                    a.createTime = createTime
                    a.pageUrl = a.pageUrl.length > 0 ? a.pageUrl : [{
                      pageURL: "https://mb.fsmbdlkj.com/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/image/default.jpg"
                    }]
                    DYMealArry.push(a)
                    if (res.data.data.length == 1) {
                      this.DYToDetail({
                        currentTarget: {
                          dataset: {
                            item: {
                              DYUid: a.DYUid,
                              setMealID: a.setMealID,
                              ruleID: a.ruleID
                            }
                          }
                        }
                      })
                    } else {
                      this.setData({
                        showDYDialog: true,
                        DYMealArry: DYMealArry,
                      })
                    }
                    wx.hideLoading({
                      success: (res) => {},
                    })
                  }
                })
              }
            }
          }
        })
      } else {
        this.showDYDialog()
      }
    }
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.sv_flesh()
    app.PayCallBack = (res) => {
      console.log(res)
    }
    pay.version({
      back(res) {
        console.log(res)
      }
    })
    // sss.src = "https://pan.fsmbdlkj.com/view.php/82041890e4780c5c58894fd19389f61b.mp3"
    // sss.play()
    // 城市选择
    var that = this
    app.globalData.needOpenSocket = false // 不需要连接
    if (app.globalData.isOpenSocket == true) { // 处于开启时
      console.log("关闭店铺呼叫连接")
      // app.closeSocket()
    }

    that.setData({
      cityName: app.globalData.defaultCity,
      countyName: app.globalData.defaultCounty,
      cityID: app.globalData.defaultCityID,
      countyID: app.globalData.defaultCountyID,
      isPosition: app.globalData.isPosition
    })
    if (app.globalData.jump == true) {
      app.globalData.jump = false
      wx.navigateTo({
        url: '../index/index',
      })
    }

    // that.dy_jump();
    if (app.globalData.defaultCity != '') {
      that.selectCityID()
    }
    // that.GetQgqcDishesForNum()
    // app.closeSocket();
  },

  showDYDialog: function () {
    this.setData({
      showDYDialog: true
    })
  },

  closeDYDialog: function () {
    this.setData({
      isFromDY: false,
      showDYDialog: false
    })
  },

  confirm: function () {
    this.setData({
      isFromDY: true,
    })
  },

  confirmDYPhone: function (e) {
    var that = this
    // 用 onLoad 时 wx.login() 缓存的 code，而不是 getPhoneNumber 回调里的 code
    // 后端 jscode2session 需要 wx.login 类型的 code
    var code = that.data._phoneLoginCode
    if (!code) {
      // code 还没缓存好，现场获取
      wx.login({
        success: function(loginRes) {
          if (loginRes.code) {
            that.setData({ _phoneLoginCode: loginRes.code })
            that._doDYPhoneRequest(loginRes.code, e.detail.encryptedData, e.detail.iv)
          }
        }
      })
      return
    }
    that._doDYPhoneRequest(code, e.detail.encryptedData, e.detail.iv)
  },
  _doDYPhoneRequest: function(code, encryptedData, iv) {
    var that = this
    let aa = new Promise((bb, cc) => {
      wx.request({
        url: app.globalData.allUrl.QGQCPhoneServlet,
        data: {
          code: code,
          encryptedData: encryptedData,
          iv: iv,
          wechatAppId: app.getWechatAppId(),
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: res => {
          console.log('QGQCPhoneServlet 返回:', JSON.stringify(res.data))
          if (res.data.code != 1000 || !res.data.data || !res.data.data.phoneNumber) {
            wx.showModal({
              title: '提示',
              content: '访问超时，请重试!',
              showCancel: false,
              confirmText: '好的'
            })
            return;
          }
          var phoneNumber = res.data.data.phoneNumber
          wx.setStorageSync('phonenumber', phoneNumber)
          var data = {
            phone: phoneNumber,
            openId: app.globalData.openid
          }
          wx.request({
            url: app.globalData.UpdateCustomerByOpenId_Url,
            data: JSON.stringify(data),
            method: 'POST',
            success: res2 => {
              console.log(res2)
              app.globalData.user_phone = phoneNumber
            }
          })
          that.setData({
            phone: phoneNumber
          }, () => {
            bb()
          })
        }
      })
    })
    aa.then(res => {
      if (!this.data.phone) {
        wx.showToast({
          title: '需授权手机号码才能查询预订',
          icon: 'none'
        })
        return;
      }
      wx.showLoading({
        title: '查询中...',
        mask: true
      })
      wx.request({
        url: app.globalData.getTikTokBookComboByPhone,
        method: 'GET',
        data: {
          phone: this.data.phone
        },
        success: res => {
          if (res.data.data.length < 1) {
            wx.showToast({
              title: '您没有在抖音预定套餐\n请检查手机号码',
              icon: 'none'
            })
            wx.hideLoading()
            // this.closeDYDialog()
            return;
          }
          console.log(res)
          let DYMealArry = []
          for (let i = 0; i < res.data.data.length; i++) {
            const element = res.data.data[i];
            if (element.bookType == 1) {
              wx.request({
                url: app.globalData.getCouponByCouponId,
                data: {
                  couponId: element.couponId,
                },
                method: 'GET',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: res2 => {
                  let createDate = element.createTime.split(" ")[0].split("-")[1] + "-" + element.createTime.split(" ")[0].split("-")[2]
                  let createTime = element.createTime.split(" ")[1].split(":")[1] + ":" + element.createTime.split(" ")[1].split(":")[2].split('.')[0]
                  let a = res2.data
                  a.createDate = createDate
                  a.createTime = createTime
                  DYMealArry.push(a)
                  this.setData({
                    DYMealArry: DYMealArry,
                  })
                }
              })
            } else {
              wx.request({
                url: app.globalData.selectSetMealInfo_url,
                data: {
                  setMealID: element.setMealId,
                  shop_id: element.shopId,
                  startUsing: "",
                  typeForSetMeal: ''
                },
                method: 'POST',
                header: {
                  'content-type': 'application/json' // 默认值
                },
                success: res2 => {
                  let createDate = element.createTime.split(" ")[0].split("-")[1] + "-" + element.createTime.split(" ")[0].split("-")[2]
                  let createTime = element.createTime.split(" ")[1].split(":")[1] + ":" + element.createTime.split(" ")[1].split(":")[2].split('.')[0]
                  let a = res2.data.selectResult[0]
                  a.createDate = createDate
                  a.createTime = createTime
                  DYMealArry.push(a)
                  this.setData({
                    DYMealArry: DYMealArry,
                  })
                }
              })
            }

          }
          wx.hideLoading()
        }
      })
    })
  },
  DYToDetail(e) {
    console.log(e);
    let a = e.currentTarget.dataset.item
    let setMealUrl = '/pages/module_discount/pages/Package_details/Package_details?id=0&setMealID=' + a.setMealID + '&ruleID=' + a.ruleID + '&DYUid=' + a.DYUid
    let couponUrl = '/pages/module_discount/pages/Package_details/Package_details?id=1&coupon_id=' + a.coupon_id + '&ruleID=' + a.coupon_allrule + '&shop_id=' + a.shop_id + '&DYUid=' + a.DYUid

    console.log(setMealUrl)
    console.log(couponUrl)
    wx.navigateTo({
      url: a.coupon_id ? couponUrl : setMealUrl,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {},

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {},

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {},
  // 定位市区
  selectCityID: function () {
    var that = this
    console.log(that.data.cityName)
    wx.request({
      // url: 'https://mb.fsmbdlkj.com/diancanxing/shop/cityNameQueryCityID',
      url: app.globalData.allUrl.defaultCityID,
      data: {
        cityName: that.data.cityName
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          cityID: res.data.result.id
        })
        app.globalData.defaultCityID = that.data.cityID
        if (that.data.city != '') {
          app.globalData.cityIDResult = that.data.cityID.toString();
        }
        console.log(app.globalData.defaultCity + '的id为' + app.globalData.cityIDResult)
      }
    })
  },

  getUser: function () {
    var that = this
    that.setData({
        showAuthorize: false
      },
      setTimeout(function () {
        //要延时执行的代码
        that.selectUnionID()
      }, 4000) //延迟时间 这里是1秒 
    )
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
              console.log(res)
              that.setData({
                avatarUrl: res.userInfo.avatarUrl,
                nickName: res.userInfo.nickName
              })
              app.globalData.encryptedData = res.encryptedData
              app.globalData.iv = res.iv

              
              wx.request({
                url: app.globalData.allUrl.getUnionID,
                // url: 'http://localhost:8080/register/servlet/openIdServlet',
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
                  console.log(res, "unionId和openId")

                  if (that.data.dy_flesh) {
                    // that.dy_jump()
                    that.setData({
                      dy_flesh: false
                    })
                  }

                  app.globalData.unionID = res.data.data.unionId
                  app.globalData.openid = res.data.data.openid

                  that.postUserInfo(res)
                  that.setData({
                    showAuthorize: false
                  })
                }
              })
            }
          })
        }
      }
    })
  },


  //记录首次用户登录信息
  postUserInfo(res) {
    var that = this

    var openid = res.data.openid
    var unionId = res.data.unionId
    var focus_time = that.getNowFormatDate();
    console.log(focus_time)
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

        wx.request({
          // url: 'https://mb.fsmbdlkj.com/register_war/servlet/addCustomerServlet',
          url: app.globalData.allUrl.postUserInfo,
          // url: 'http://localhost:8080/register_war/addCustomerServlet',
          data: {
            openid: openid,
            unionId: unionId,
            city: that.data.city,
            country: that.data.country,
            province: that.data.province,
            gender: sex,
            name: that.data.name,
            focus_time: focus_time //还没获取到时间，
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },

          method: 'POST',
          success: function (res) {
            if (res.data == "success") {
              console.log('该用户首次登记录成功')
            }
          }
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },

  showModalStatus1: function () {
    this.setData({
      showModalStatus1: !this.data.showModalStatus1
    })
  },

  //拒绝授权，返回首页
  refused: function (res) {
    let that = this
    app.globalData.isAuthorize = false
    app.globalData.isRegister = false

    that.setData({
      showAuthorize: false,
      isAuthorize: false
    })

  },

  generateQRCode(){
      console.log('generateQRCode')
      let that = this
      wx.createSelectorQuery()
          .select('#myQrcode')
          .fields({
              node: true,
              size: true
          })
          .exec(res => {
              const canvas = res[0].node      
              // 调用方法drawQrcode生成二维码
              drawQrcode({
                  canvas: canvas,
                  canvasId: 'myQrcode',
                  width: 210,                  
                  padding: 10,
                  background: '#ffffff',
                  foreground: '#000000',
                  text: 'http://www.baidu.com',
              })
      
              // 获取临时路径（得到之后，想干嘛就干嘛了）
              wx.canvasToTempFilePath({
                  canvasId: 'myQrcode',
                  canvas: canvas,
                  x: 0,
                  y: 0,
                  width: 220,
                  height: 220,
                  destWidth: 220,
                  destHeight: 220,
                  success(res) {
                      console.log('二维码临时路径：', res.tempFilePath)
                      that.setData({
                          QRCodePath: res.tempFilePath,
                      })  
                  },
                  fail(res) {
                      console.error(res)
                  }
              })
          })
  },

  authorization: function (res) {
    var that = this

    wx.getUserInfo({
      // 获取用户信息
      success: function (res) {
        console.log('已授权')
        app.globalData.isAuthorize = true
        that.setData({
          isAuthorize: true,
          showAuthorize: false
        })
        if (res.iv) {
          that.selectUnionID()
        }
      },
      fail: function (res) {
        console.log('未授权')
        app.globalData.isAuthorize = false
        app.globalData.isRegister = false
        that.setData({
          isAuthorize: false,
          // showAuthorize: true
        })
      }
    })

  },

  toRegister() {
    wx.navigateTo({
      url: '../register/register', //注意navigateTo只能跳转到带有tab的页面，不能跳转到不带tab的页面
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

  aaa: function () {
    var that = this;
    console.log("https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/platform.png")
  },

  showOut: function (e) {
    var that = this
    that.setData({
      show: true
    })
  },

  qrscan_old: function (res) {
    var that = this
    if (app.globalData.myLongitude == 0 && app.globalData.myLatitude == 0) {
      that.getLocation()
    } else {
      wx.scanCode({
        onlyFromCamera: true,
        success: function (res) {
          that.sound();
          if (res.result) {
            if (res.result.indexOf('https://') != -1 && res.result.indexOf('?uuid=') != -1) {
       
            if (res.result.indexOf(app.globalData.QRCodeUrl) != -1) {
                let a = res.result.substring(res.result.indexOf('?') + 6)
                console.log("a:"+a)
                wx.request({
                  url: app.globalData.getOneQrUuid,
                  // url: 'http://192.168.8.163:8083/evaluation_war/getOneQrUuid',
                  data: {
                    qrUuid: a
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: res => {
                    //console.log(JSON.stringify(res))
                    //if (sceneValue.scene === 1011 || sceneValue.scene === 1047 || sceneValue.scene === 1017 || sceneValue.scene === 1025 || sceneValue.scene === 1124) {
                      //wx.navigateTo({
                        //url: '/' + res.data.data.miniProgram,
                      //})
                    //} else {
                      console.log(res)
                      let a = res.data.data.miniProgram
                      var parameter = a.split("=")[1]
                      var parameter_arry = parameter.split("_")
                      console.log(parameter_arry[0])
                      //  var [status, shopid, tableid] = parameter_arry

                      //  console.log(str.search("3") != -1)
                      if (parameter_arry[0].search(",") != -1) {
                        var arr = parameter_arry[0].split(",")
                      } else if (parameter_arry[0].search("%2C") != -1) {
                        var arr = parameter_arry[0].split("%2C")
                      }

                      console.log(arr)
                      if (arr != undefined) {
                        var shopid = parseInt(arr[1])
                        var tableid = parseInt(arr[2])
                        that.setData({
                          shopid: shopid,
                          tableid: tableid
                        })
                        that.setAppShopId(shopid)
                     
                        that.getFocusList(shopid, tableid)

                        console.log("店名ID:" + shopid + "桌位ID:" + tableid)
                      }
                    //}
                  }
                })
                return
              } else {
                wx.showModal({
                  title: '提示',
                  content: '请扫描' + (res.result.indexOf(app.globalData.QRCodeUrl) != -1 ? '正式服' : '测试服') + '二维码',
                  success(res) {
                    return
                  }
                })
              }
            } else if (res.path) {
              console.log(res)
              var parameter = res.path.split("=")[1]
              var parameter_arry = parameter.split("_")
              console.log(parameter_arry[0])
              //  var [status, shopid, tableid] = parameter_arry

              //  console.log(str.search("3") != -1)
              if (parameter_arry[0].search(",") != -1) {
                var arr = parameter_arry[0].split(",")
              } else if (parameter_arry[0].search("%2C") != -1) {
                var arr = parameter_arry[0].split("%2C")
              }

              console.log(arr)
              if (arr != undefined) {
                var shopid = parseInt(arr[1])
                var tableid = parseInt(arr[2])
                that.setData({
                  shopid: shopid,
                  tableid: tableid
                })
                that.setAppShopId(shopid)
                console.log("店名ID:" + shopid + "桌位ID:" + tableid)
                app.globalData.locationid = tableid
                app.globalData.shopid = shopid
                app.getManagementDataServlet() //获取店铺设置信息
                that.getshopinf(shopid);
                app.getmenu()
                //跳转
                // that.jump_for_here(tableid)
                console.log(sceneValue.scene, "场景值-1");

                // if (sceneValue.scene === 1011 || sceneValue.scene === 1047 || sceneValue.scene === 1017 || sceneValue.scene === 1025 || sceneValue.scene === 1124) {
                //   wx.navigateTo({
                //     url: '../module_others/pages/wxPublic/wxPublic?scene=forhere%2C' + shopid + '%2C' + tableid
                //   })
                // } else {
                //   that.getFocusList(shopid, tableid)
                // }

                that.getFocusList(shopid, tableid)
              } else {
                console.log("部长绑定")
                //员工id,用户unionid
                var staff_id = parameter_arry[0]
                var union_id = app.globalData.unionID
                //部长绑定
                that.BindingCustomer(staff_id, union_id)
              }
            }
          } else if (res.path) {
            console.log(res)
            var parameter = res.path.split("=")[1]
            var parameter_arry = parameter.split("_")
            console.log(parameter_arry[0])
            //  var [status, shopid, tableid] = parameter_arry

            //  console.log(str.search("3") != -1)
            if (parameter_arry[0].search(",") != -1) {
              var arr = parameter_arry[0].split(",")
            } else if (parameter_arry[0].search("%2C") != -1) {
              var arr = parameter_arry[0].split("%2C")
            }

            console.log(arr)
            if (arr != undefined) {
              var status = arr[0]
              var shopid = parseInt(arr[1])
              var tableid = parseInt(arr[2])
              that.setData({
                shopid: shopid,
                tableid: tableid
              })
              that.setAppShopId(shopid)
              console.log("店名ID:" + shopid + "桌位ID:" + tableid)
              that.setData({
                tableid: tableid
              })
              app.globalData.locationid = tableid
              app.globalData.shopid = shopid
              app.getManagementDataServlet() //获取店铺设置信息
              that.getshopinf(shopid);
              app.getmenu()
              //跳转
              // that.jump_for_here(tableid)
              console.log(sceneValue.scene, "场景值-1");
              //1011	扫描二维码 
              //1047	扫描小程序码
              //1017	前往体验版的入口页
              //1025	扫描一维码
              //1024	小程序 profile 页
              //无1124相关的场景值
              //之前有判断场景值，直接跳转到点餐界面，现取消场景值，均优先查询当前订单数
            //   if (sceneValue.scene === 1011 || sceneValue.scene === 1047 || sceneValue.scene === 1017 || sceneValue.scene === 1025 || sceneValue.scene === 1124) {
            //     wx.navigateTo({
            //       url: '../module_others/pages/wxPublic/wxPublic?scene=forhere%2C' + shopid + '%2C' + tableid
            //     })
            //   } else {
            //     that.getFocusList(shopid, tableid)
            //   }

              that.getFocusList(shopid, tableid)
            } else {
              console.log("部长绑定")
              //员工id,用户unionid
              var staff_id = parameter_arry[0]
              var union_id = app.globalData.unionID
              //部长绑定
              that.BindingCustomer(staff_id, union_id)
            }
          }
        },
        fail: function (res) {
          console.log(res)
        }
      })

    }
  },
  qrscan: function (res) {
    var that = this
    if (app.globalData.myLongitude == 0 && app.globalData.myLatitude == 0) {
      that.getLocation()
    } else {
      wx.scanCode({
        onlyFromCamera: true,
        success: function (res) {
          that.sound();
          //测试发现 res.result是实际扫码的结果，res.path是当前页面路径+?q= 实际扫码结果
          if (res.result) {
            if (res.result.indexOf('https://') != -1 && res.result.indexOf('?uuid=') != -1) {
       
            if (res.result.indexOf(app.globalData.QRCodeUrl) != -1) {
                let a = res.result.substring(res.result.indexOf('?') + 6)
                console.log("a:"+a)
                wx.request({
                  url: app.globalData.getOneQrUuid,
                  // url: 'http://192.168.8.163:8083/evaluation_war/getOneQrUuid',
                  data: {
                    qrUuid: a
                  },
                  method: 'POST',
                  header: {
                    'content-type': 'application/json' // 默认值
                  },
                  success: res => {
            
     
                      let a = res.data.data.miniProgram
                      var parameter = a.split("=")[1]
                      var parameter_arry = parameter.split("_")
                      console.log(parameter_arry[0])


                      if (parameter_arry[0].search(",") != -1) {
                        var arr = parameter_arry[0].split(",")
                      } else if (parameter_arry[0].search("%2C") != -1) {
                        var arr = parameter_arry[0].split("%2C")
                      }

                      console.log(arr)
                      if (arr != undefined) {
                        var shopid = parseInt(arr[1])
                        var tableid = parseInt(arr[2])
                        that.setData({
                          shopid: shopid,
                          tableid: tableid
                        })
                        that.setAppShopId(shopid)
                     
                        that.getFocusList(shopid, tableid)

                        console.log("店名ID:" + shopid + "桌位ID:" + tableid)
                      }else{
                          
                        wx.navigateTo({
                            url: '/' + res.data.data.miniProgram,
                        })
                              
                      }
                  }
                })
                return
              } else {
                wx.showModal({
                  title: '提示',
                  content: '请扫描' + (res.result.indexOf(app.globalData.QRCodeUrl) != -1 ? '正式服' : '测试服') + '二维码',
                  success(res) {
                    return
                  }
                })
              }
            } else if (res.path) {
              console.log(res)
              var parameter = res.path.split("=")[1]
              var parameter_arry = parameter.split("_")
              console.log(parameter_arry[0])
              //  var [status, shopid, tableid] = parameter_arry

              //  console.log(str.search("3") != -1)
              if (parameter_arry[0].search(",") != -1) {
                var arr = parameter_arry[0].split(",")
              } else if (parameter_arry[0].search("%2C") != -1) {
                var arr = parameter_arry[0].split("%2C")
              }

              console.log(arr)
              if (arr != undefined) {
                var shopid = parseInt(arr[1])
                var tableid = parseInt(arr[2])
                that.setData({
                  shopid: shopid,
                  tableid: tableid
                })
                that.setAppShopId(shopid)
                console.log("店名ID:" + shopid + "桌位ID:" + tableid)
                app.globalData.locationid = tableid
                app.globalData.shopid = shopid
                app.getManagementDataServlet() //获取店铺设置信息
                that.getshopinf(shopid);
                app.getmenu()
                //跳转
                // that.jump_for_here(tableid)
                console.log(sceneValue.scene, "场景值-1");
                that.getFocusList(shopid, tableid)
              } else {
                console.log("部长绑定")
                //员工id,用户unionid
                var staff_id = parameter_arry[0]
                var union_id = app.globalData.unionID
                //部长绑定
                that.BindingCustomer(staff_id, union_id)
              }
            }
          }
        },
        fail: function (res) {
          console.log(res)
        }
      })

    }
  },

  setAppShopId(shopId){
    //设置app.globalData等地方的shopId ,便于后续订单详情等地方获取店铺id 
    app.globalData.shopid=shopId;
    app.globalData.shopdetail.shop_id=shopId;

  },
  getFocusList(shopId, tableId) {
    let that = this
    // wx.request({
    //   url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList',
    //   data: {
    //     unionId: that.data.unionID
    //   },
    //   success: res => {
    //     if (shopId && tableId) {
    //       that.getTableStatusByNum(res, shopId, tableId)
    //     } else {
    //       if (res.data.list == null || res.data.list.isFocus == '0') {
    //         wx.navigateTo({
    //           url: '../module_others/pages/wxPublic/out',
    //         })
    //       }
    //     }

    //   }
    // })

    //去掉获取是否关注公众号的逻辑
    if (shopId && tableId) {
      that.getTableStatusByNum(shopId, tableId)
    } 
  },
  getTableStatusByNum(shopid, tableid) {
    let that = this
   
    wx.request({
      url: app.globalData.GetTableStatusByNum_Url,
      data: {
        shopId: shopid,
        tableNum: tableid
      },
      success: res => {
        if (res.data.getTableStatusByNum.length == 0) {
          wx.navigateTo({
            url: '../QRorder/QRorder?shop_id=' + that.data.shopid + '&table_id=' + that.data.tableid,
          })
        } else {
          console.log(res.data.getTableStatusByNum.length, "有订单");
          wx.navigateTo({
            url: '../module_others/pages/operation/operation?shopId=' + shopid + '&tableId=' + tableid,
          })
        }
        // if (focusList.data.list != undefined && focusList.data.list != "" && focusList.data.list.isFocus != '0') {
        //   if (res.data.getTableStatusByNum.length === 0) {
        //     wx.navigateTo({
        //       url: '../QRorder/QRorder?shop_id=' + that.data.shopid + '&table_id=' + that.data.tableid,
        //     })
        //   } else {
        //     console.log(res.data.getTableStatusByNum.length, "有订单");
        //     wx.navigateTo({
        //       url: '../module_others/pages/operation/operation?shopId=' + shopid + '&tableId=' + tableid,
        //     })
        //   }
        // } else {
        //   console.log(res.data, "查询桌子没订单");
        //   if (res.data.getTableStatusByNum.length === 0) {
        //     console.log(res.data.getTableStatusByNum.length, "没订单");
        //     wx.navigateTo({
        //       url: '../QRorder/QRorder?popup=1&shop_id=' + shopid + '&table_id=' + tableid,
        //     })
        //   } else {
        //     console.log(res.data.getTableStatusByNum.length, "有订单");
        //     wx.navigateTo({
        //       url: '../module_others/pages/operation/operation?popup=1&shopId=' + shopid + '&tableId=' + tableid,
        //     })
        //   }
        // }
      }
    })

  },
  sound: function () {
    console.log('播放音效')
    const innerAudioContext = wx.createInnerAudioContext(); //新建一个createInnerAudioContext();
    innerAudioContext.autoplay = true; //音频自动播放设置
    innerAudioContext.src = '/audio/sound.mp3'; //链接到音频的地址

    innerAudioContext.onPlay(() => {}); //播放音效

    innerAudioContext.onError((res) => { //打印错误
      console.log(res.errMsg); //错误信息
      console.log(res.errCode); //错误码
    })

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
            that.selectCityID()
            that.qrscan()
          },
          fail: function (res) {
            console.log('获取地址失败' + res);
          },
          complete: function (res) {
            console.log(res);
          }
        })

      },
      fail: function (res) {
        console.log(res)
        if (res.errMsg == 'getLocation:fail auth deny') {
          that.getSetting()
        }
      }
    })
  },

  jump_for_here: function (tableid) {
    var that = this;
    if (app.globalData.managementData) {
      console.log(app.globalData.managementData.eat_in_distance)
      var eat_in_distance = app.globalData.managementData.eat_in_distance //后台设置的堂食有效距离
      if (app.globalData.myLongitude == 0 && app.globalData.myLatitude == 0) {
        wx.showModal({
          title: '提示',
          content: '没有授权地理位置信息,不能进行堂食点餐',
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
              wx.showModal({
                title: '提示',
                content: '您未到达该店,不能进行该店的扫码点餐操作',
              })
            } else {
              console.log(1)
              wx.navigateTo({
                url: '/pages/search/search?tableid=' + tableid + '&jump=' + 1,
              })
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

  getshopinf: function (e) {
    var that = this;
    wx.request({
      url: app.globalData.SelectShopDetails_url,
      data: {
        shop_id: e
      },
      success: function (res) {
        console.log(res)
        that.setData({
          shopdetail: res.data[0],
          topimage: res.data[0].shop_img
        })
        app.globalData.shopdetail = res.data[0]
      }
    })
  },
  getSetting: function () {
    var that = this;
    wx.getSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
          wx.showModal({
            title: '是否授权当前位置',
            content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
            success: function (res) {
              if (res.cancel) {
                that.setData({
                  isshowCIty: false
                })
                wx.showToast({
                  title: '授权失败',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用getLocationt的API
                      that.getLocation(that);
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'success',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
          that.getLocation();
        } else { //授权后默认加载
          that.getLocation();
        }
      }
    })
  },
  ycts: function () {
    var that = this
    that.setData({
      showModal: false
    })
  },
  //抖音弹窗的表单提交按钮
  input_num: function (e) {
    var that = this
    console.log(e)
    that.setData({
      douYin_number: e.detail.value
    })
  },
  dyNum: function () {
    var that = this;
    var douYin_number = that.data.douYin_number
    console.log(douYin_number)

    that.setData({
      showModal: false
    })
  },


  sv_flesh(e) {
    let that = this
    if (that.data.foodRefresh) {
      that.getSetMealAllInfo()
    } else if (that.data.couponRefresh) {
      that.getCouponAll()
    } else if (that.data.comboRefresh) {
      that.getComboInfo()
    } else if (that.data.randomDishesRefresh) {
      that.GetQgqcDishesForNum()
    } else if (that.data.wineRefresh) {
      that.getWineList();
    }
  },
  //此函数应该不使用了
  BindingCustomer: function (staff_id, union_id) {
    wx.request({
      // url: 'https://test.fsmbdlkj.com/evaluation/staffBindCustomer',
      // url: 'http://192.168.8.163/evaluation_war/staffBindCustomer',
      url: app.globalData.staffBindCustomer_url,
      data: {
        staff_id: staff_id,
        union_id: union_id
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      success: function (res) {
        if (res.data.result == 'success') {
          wx.showModal({
            title: '绑定提示',
            content: '绑定成功',
          })
        } else if (res.data.result == 'fail' && res.data.reason == 'The customer is already bound in this store!') {
          wx.showModal({
            title: '绑定提示',
            content: '您已经绑定过一位店员',
          })
        } else {
          wx.showModal({
            title: '绑定提示',
            content: '绑定失败',
          })
        }
      }
    })
  },
  taocanJump: function (e) {
    var that = this;
    console.log(e)
    var shop_id = e.currentTarget.dataset.item.shop_id;
    console.log(shop_id)
    app.globalData.shopid = shop_id
    if (e.currentTarget.dataset.item.parent_type_id) {
      app.globalData.twoListDisId = e.currentTarget.dataset.item.parent_type_id,
        app.globalData.threeListDisId = e.currentTarget.dataset.item.subclass_type_id
    }
    wx.navigateTo({
      url: '../module_discount/pages/Package_details/Package_details?id=' + '0' + '&setMealID=' + e.currentTarget.dataset.item.setMealID + '&ruleID=' + e.currentTarget.dataset.item.ruleID + '&shop_id=' + shop_id,
    })
  },

  taocanJump1: function (e) {
    var that = this;
    console.log(e)
    var shop_id = e.currentTarget.dataset.item.shop_id;
    console.log(shop_id)
    app.globalData.shopid = shop_id
    if (e.currentTarget.dataset.item.parent_type_id) {
      app.globalData.twoListDisId = e.currentTarget.dataset.item.parent_type_id,
        app.globalData.threeListDisId = e.currentTarget.dataset.item.subclass_type_id
    }
    wx.navigateTo({
      // url: '/pages/search/search?jump=' + 0,
      url: '../module_discount/pages/Package_details/Package_details?id=' + '1' + '&coupon_id=' + e.currentTarget.dataset.item.coupon_id + '&ruleID=' + e.currentTarget.dataset.item.coupon_allrule + '&shop_id=' + shop_id,
    })
  },

  taocanJump2: function (e) {
    var that = this;
    console.log(e)
    var shop_id = e.currentTarget.dataset.item.shop_id;
    console.log(shop_id)
    app.globalData.shopid = shop_id
    if (e.currentTarget.dataset.item.parent_type_id) {
      app.globalData.twoListDisId = e.currentTarget.dataset.item.parent_type_id,
        app.globalData.threeListDisId = e.currentTarget.dataset.item.subclass_type_id
    }
    wx.navigateTo({
      url: '/pages/search/search?jump=' + 0,
    })
  },
  getCoupon: function () {
    var that = this;
    var RD = that.data.RD //优惠券顶值判断
    if (!RD) {
      //获取代金券
      wx.request({
        // url: 'https://test.fsmbdlkj.com/WX Restaurant/SelectcouponInfForNum',
        url: app.globalData.SelectcouponInfForNum_url,
        data: {
          "pageNum": that.data.couponPageNum,
          "shop_id": ""
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          var couponPageNum = that.data.couponPageNum + 20
          var coupon = res.data.object
          that.setData({
            coupon: coupon,
            couponPageNum: couponPageNum
          })
          if (res.data.object == null || res.data.object.length < 20) {
            that.setData({
              RD: true
            })
          }
        }
      })
    } else {
      that.getRandomDishes();
    }
  },

  getRandomDishes: function () {

    var that = this
    var stopNext = that.data.stopNext
    if (!stopNext) {
      wx.request({
        // url: 'https://test.fsmbdlkj.com/WX Restaurant/SelectcouponInfForNum',
        url: app.globalData.SelectDishesInfForNum_url,
        data: {
          "pageNum": that.data.disPageNum,
          "shop_id": ""
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
        },
        method: 'POST',
        success: function (res) {
          var disPageNum = that.data.disPageNum + 20
          var randomDishes = that.data.randomDishes
          if (res.data.object) {
            for (var i = 0; i < res.data.object.length; i++) {
              randomDishes.push(res.data.object[i])
            }
            that.setData({
              randomDishes: randomDishes,
              disPageNum: disPageNum
            })
          }
          //当出的数据少于20条，开始显示优惠券
          if (disPageNum > 200) {
            that.setData({
              stopNext: true
            })
          }
        }
      })
    }
  },
  goTop: function (e) { // 一键回到顶部
    this.setData({
      topNum: 0
    });
  },
  //进入页面后的抖音判断
  dy_jump: function (e) {
    var that = this;
    //获取粘贴板内容，抖音相关功能
    setTimeout(function () {
      //要延时执行的代码
      wx.getClipboardData({
        success(res) {
          console.log(res.data)
          var clipboard = res.data
          console.log('----------' + app.globalData.unionID + '--------')
          if (app.globalData.unionID != '') {
            that.selectUnionID()
            if (clipboard.indexOf('dy') == 0) {
              console.log('检测到粘贴板有带有抖音的信息')
              //获取相关的抖音订单，创建一个相关菜品的订单
              console.log(clipboard)
              wx.request({
                url: app.globalData.SelectDyuser_url,
                data: {
                  dy_order_id: clipboard,
                  unionId: ''
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                },
                method: 'POST',
                success: function (res) {
                  var dy_list = res
                  console.log(res)
                  console.log(that.data.user_id)
                  //res.data.object[0].dy_code要经过裁剪，才能获得菜品信息，把mid:后的剪出来，再剪','获取每个菜品
                  if (res.data.result.result == 1) {
                    var dyuserid = res.data.object[0].dyUser.usid
                    var taocanId = res.data.object[0].dyUser.dy_code.split('mid:')[1]
                    taocanId = taocanId.replace(new RegExp(/( )/g), "");
                    var taocan_id = taocanId.split(',');
                    var s_id = (res.data.object[0].dyUser.dy_code.split('-mid:')[0])
                    var shop_id = Number(s_id.split('sid:')[1])
                    var dy_open_id = res.data.object[0].dyUser.dy_open_id
                    console.log(taocan_id)

                    //绑定当前dy_open_id到customer表中对应unionId的用户的dy_id
                    wx.request({
                      url: app.globalData.BindDyOpenIdServlet_url,
                      data: {
                        unionId: app.globalData.unionID,
                        dy_open_id: dy_open_id
                      },
                      success: function (res) {
                        console.log(res)
                      }
                    })
                    //根据接口循环获取user_id,然后写入数据库中
                    var user_id = ''
                    wx.request({
                      url: app.globalData.UserLogin_url,
                      data: {
                        Open_id: app.globalData.unionID,
                        Shop_id: shop_id
                      },
                      success: function (res) {
                        // app.getCustomerInfo(unionId) //获取用户信息
                        console.log(res)
                        if (res.data.object == null || res.data.object == 'null' || res.data.result == null || res.data.result.result == 0) {
                          wx.request({
                            url: app.globalData.UserRegistration_url,
                            data: {
                              Head_portrait_img: that.data.avatarUrl,
                              User_nickname: that.data.nickName,
                              Wx_openid: app.globalData.unionID,
                              Shop_id: shop_id
                            },
                            success: function (res) {
                              user_id = res.data.object[0].user_id
                              for (var a = 0; a < dy_list.data.object[0].ticeketDetailed.length; a++) {
                                var tc = dy_list.data.object[0].ticeketDetailed[a]
                                // 每个套餐的id都要分别下一张单
                                wx.request({
                                  url: app.globalData.taocan.AddTicketOrderInfo_url,
                                  // url: 'https://test.fsmbdlkj.com/WX Restaurant/AddTicketOrderInfo',
                                  data: {
                                    "user_id": user_id, //?            
                                    "shop_id": shop_id, //截取
                                    "ticketNum": 1,
                                    "order_status": "0",
                                    "order_remark": "0",
                                    "ticket_id": tc.setMealID, //截取
                                    "ticket_type": 2, //2-超值套餐，1-优惠券，3-代金券
                                    "ticket_remark": "",
                                    "appointment": "0",
                                    "appointment_time": "",
                                    "order_name": tc.setMealName, //套餐名称
                                    "order_total": tc.price * 100, //套餐价格
                                    "detailed_count": 1,
                                    "telephone": app.globalData.user_phone,
                                    "user_name": app.globalData.user_name
                                  },
                                  header: {
                                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                  },
                                  method: 'POST',
                                  success: function (res) {
                                    console.log(res)

                                  }
                                })
                                //跳转到超值天地的'我的订单'
                                if (a == dy_list.data.object[0].ticeketDetailed.length - 1) {
                                  that.jump_taocan_list(dyuserid)
                                }
                              }
                            }
                          })
                        } else {
                          user_id = res.data.object[0].user_id
                          for (var a = 0; a < dy_list.data.object[0].ticeketDetailed.length; a++) {
                            var tc = dy_list.data.object[0].ticeketDetailed[a]
                            // 每个套餐的id都要分别下一张单
                            wx.request({
                              url: app.globalData.taocan.AddTicketOrderInfo_url,
                              // url: 'https://test.fsmbdlkj.com/WX Restaurant/AddTicketOrderInfo',
                              data: {
                                "user_id": user_id, //?            
                                "shop_id": shop_id, //截取
                                "ticketNum": 1,
                                "order_status": "0",
                                "order_remark": "0",
                                "ticket_id": tc.setMealID, //截取
                                "ticket_type": 2, //2-超值套餐，1-优惠券，3-代金券
                                "ticket_remark": "",
                                "appointment": "0",
                                "appointment_time": "",
                                "order_name": tc.setMealName, //套餐名称
                                "order_total": tc.price * 100, //套餐价格
                                "detailed_count": 1,
                                "telephone": app.globalData.user_phone,
                                "user_name": app.globalData.user_name
                              },
                              header: {
                                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                              },
                              method: 'POST',
                              success: function (res) {
                                console.log(res)
                              }
                            })
                            //跳转到超值天地的'我的订单'
                            if (a == dy_list.data.object[0].ticeketDetailed.length - 1) {
                              that.jump_taocan_list(dyuserid)
                            }
                          }
                        }
                      }
                    })

                  } else if (res.data.result.result == 2) {
                    //有带抖音id进来，但是id被用过，可能是再次下单，进行为操作订单判断
                    wx.request({
                      url: app.globalData.SelectDyuser_url,
                      data: {
                        dy_order_id: '',
                        unionId: app.globalData.unionID
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                      },
                      method: 'POST',
                      success: function (res) {
                        console.log(res)
                        var dy_list = res
                        //res.data.object[0].dy_code要经过裁剪，才能获得菜品信息，把mid:后的剪出来，再剪','获取每个菜品
                        if (res.data.result.result == 1) {
                          //为1才有订单
                          var dyuserid = res.data.object[0].dyUser.usid
                          var taocanId = res.data.object[0].dyUser.dy_code.split('mid:')[1]
                          taocanId = taocanId.replace(new RegExp(/( )/g), "");
                          var taocan_id = taocanId.split(',');
                          var s_id = (res.data.object[0].dyUser.dy_code.split('-mid:')[0])
                          var shop_id = Number(s_id.split('sid:')[1])
                          //根据接口循环获取user_id,然后写入数据库中
                          var user_id = ''
                          wx.request({
                            url: app.globalData.UserLogin_url,
                            data: {
                              Open_id: app.globalData.unionID,
                              Shop_id: shop_id
                            },
                            success: function (res) {
                              // app.getCustomerInfo(unionId) //获取用户信息
                              if (res.data.result == null || res.data.result.result == 0) {
                                wx.request({
                                  url: app.globalData.UserRegistration_url,
                                  data: {
                                    Head_portrait_img: that.data.avatarUrl,
                                    User_nickname: that.data.nickName,
                                    Wx_openid: app.globalData.unionID,
                                    Shop_id: shop_id
                                  },
                                  success: function (res) {
                                    user_id = res.data.object[0].user_id
                                    for (var a = 0; a < dy_list.data.object[0].ticeketDetailed.length; a++) {
                                      var tc = dy_list.data.object[0].ticeketDetailed[a]
                                      // 每个套餐的id都要分别下一张单
                                      wx.request({
                                        url: app.globalData.taocan.AddTicketOrderInfo_url,
                                        // url: 'https://test.fsmbdlkj.com/WX Restaurant/AddTicketOrderInfo',
                                        data: {
                                          "user_id": user_id, //?            
                                          "shop_id": shop_id, //截取
                                          "ticketNum": 1,
                                          "order_status": "0",
                                          "order_remark": "0",
                                          "ticket_id": tc.setMealID, //截取
                                          "ticket_type": 2, //2-超值套餐，1-优惠券，3-代金券
                                          "ticket_remark": "",
                                          "appointment": "0",
                                          "appointment_time": "",
                                          "order_name": tc.setMealName, //套餐名称
                                          "order_total": tc.price * 100, //套餐价格
                                          "detailed_count": 1,
                                          "telephone": app.globalData.user_phone,
                                          "user_name": app.globalData.user_name
                                        },
                                        header: {
                                          'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                        },
                                        method: 'POST',
                                        success: function (res) {
                                          console.log(res)
                                        }
                                      })
                                      if (a == dy_list.data.object[0].ticeketDetailed.length - 1) {
                                        that.jump_taocan_list(dyuserid)
                                      }
                                    }
                                  }
                                })
                              } else {
                                user_id = res.data.object[0].user_id
                                for (var a = 0; a < dy_list.data.object[0].ticeketDetailed.length; a++) {
                                  var tc = dy_list.data.object[0].ticeketDetailed[a]
                                  // 每个套餐的id都要分别下一张单
                                  wx.request({
                                    url: app.globalData.taocan.AddTicketOrderInfo_url,
                                    // url: 'https://test.fsmbdlkj.com/WX Restaurant/AddTicketOrderInfo',
                                    data: {
                                      "user_id": user_id, //?            
                                      "shop_id": shop_id, //截取
                                      "ticketNum": 1,
                                      "order_status": "0",
                                      "order_remark": "0",
                                      "ticket_id": tc.setMealID, //截取
                                      "ticket_type": 2, //2-超值套餐，1-优惠券，3-代金券
                                      "ticket_remark": "",
                                      "appointment": "0",
                                      "appointment_time": "",
                                      "order_name": tc.setMealName, //套餐名称
                                      "order_total": tc.price * 100, //套餐价格
                                      "detailed_count": 1,
                                      "telephone": app.globalData.user_phone,
                                      "user_name": app.globalData.user_name
                                    },
                                    header: {
                                      'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                    },
                                    method: 'POST',
                                    success: function (res) {
                                      console.log(res)
                                    }
                                  })
                                  if (a == dy_list.data.object[0].ticeketDetailed.length - 1) {
                                    that.jump_taocan_list(dyuserid)
                                  }
                                }
                              }
                            }
                          })

                        }
                      }
                    })
                  }
                }
              })
            } else {
              wx.request({
                url: app.globalData.SelectDyuser_url,
                data: {
                  dy_order_id: '',
                  unionId: app.globalData.unionID
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                },
                method: 'POST',
                success: function (res) {
                  console.log(res)
                  var dy_list = res
                  //res.data.object[0].dy_code要经过裁剪，才能获得菜品信息，把mid:后的剪出来，再剪','获取每个菜品
                  if (res.data.result.result == 1) {
                    //为1才有订单
                    var dyuserid = res.data.object[0].dyUser.usid
                    var taocanId = res.data.object[0].dyUser.dy_code.split('mid:')[1]
                    taocanId = taocanId.replace(new RegExp(/( )/g), "");
                    var taocan_id = taocanId.split(',');
                    var s_id = (res.data.object[0].dyUser.dy_code.split('-mid:')[0])
                    var shop_id = Number(s_id.split('sid:')[1])
                    //根据接口循环获取user_id,然后写入数据库中
                    var user_id = ''
                    wx.request({
                      url: app.globalData.UserLogin_url,
                      data: {
                        Open_id: app.globalData.unionID,
                        Shop_id: shop_id
                      },
                      success: function (res) {
                        // app.getCustomerInfo(unionId) //获取用户信息
                        if (res.data.result == null || res.data.result.result == 0) {
                          wx.request({
                            url: app.globalData.UserRegistration_url,
                            data: {
                              Head_portrait_img: that.data.avatarUrl,
                              User_nickname: that.data.nickName,
                              Wx_openid: app.globalData.unionID,
                              Shop_id: shop_id
                            },
                            success: function (res) {
                              user_id = res.data.object[0].user_id
                              for (var a = 0; a < dy_list.data.object[0].ticeketDetailed.length; a++) {
                                var tc = dy_list.data.object[0].ticeketDetailed[a]
                                // 每个套餐的id都要分别下一张单
                                wx.request({
                                  url: app.globalData.taocan.AddTicketOrderInfo_url,
                                  // url: 'https://test.fsmbdlkj.com/WX Restaurant/AddTicketOrderInfo',
                                  data: {
                                    "user_id": user_id, //?            
                                    "shop_id": shop_id, //截取
                                    "ticketNum": 1,
                                    "order_status": "0",
                                    "order_remark": "0",
                                    "ticket_id": tc.setMealID, //截取
                                    "ticket_type": 2, //2-超值套餐，1-优惠券，3-代金券
                                    "ticket_remark": "",
                                    "appointment": "0",
                                    "appointment_time": "",
                                    "order_name": tc.setMealName, //套餐名称
                                    "order_total": tc.price * 100, //套餐价格
                                    "detailed_count": 1,
                                    "telephone": app.globalData.user_phone,
                                    "user_name": app.globalData.user_name
                                  },
                                  header: {
                                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                  },
                                  method: 'POST',
                                  success: function (res) {
                                    console.log(res)
                                  }
                                })
                                if (a == dy_list.data.object[0].ticeketDetailed.length - 1) {
                                  that.jump_taocan_list(dyuserid)
                                }
                              }
                            }
                          })
                        } else {
                          user_id = res.data.object[0].user_id
                          for (var a = 0; a < dy_list.data.object[0].ticeketDetailed.length; a++) {
                            var tc = dy_list.data.object[0].ticeketDetailed[a]
                            // 每个套餐的id都要分别下一张单
                            wx.request({
                              url: app.globalData.taocan.AddTicketOrderInfo_url,
                              // url: 'https://test.fsmbdlkj.com/WX Restaurant/AddTicketOrderInfo',
                              data: {
                                "user_id": user_id, //?            
                                "shop_id": shop_id, //截取
                                "ticketNum": 1,
                                "order_status": "0",
                                "order_remark": "0",
                                "ticket_id": tc.setMealID, //截取
                                "ticket_type": 2, //2-超值套餐，1-优惠券，3-代金券
                                "ticket_remark": "",
                                "appointment": "0",
                                "appointment_time": "",
                                "order_name": tc.setMealName, //套餐名称
                                "order_total": tc.price * 100, //套餐价格
                                "detailed_count": 1,
                                "telephone": app.globalData.user_phone,
                                "user_name": app.globalData.user_name
                              },
                              header: {
                                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                              },
                              method: 'POST',
                              success: function (res) {
                                console.log(res)
                              }
                            })
                            if (a == dy_list.data.object[0].ticeketDetailed.length - 1) {
                              that.jump_taocan_list(dyuserid)
                            }
                          }
                        }
                      }
                    })

                  }
                }
              })
            }
          } else {
            if (clipboard.indexOf('dy') == 0) {
              //第一次的新用户，带着抖音码进，就得申请授权
              that.setData({
                dy_flesh: true
              })
              // that.authorization() //是否授权
            }
          }
        }
      })
    }, 1000)
  },
  //跳转到超值天地的订单详情页面
  jump_taocan_list: function (Usid) {
    var that = this
    wx.request({
      url: app.globalData.UpdateDyuser_url,
      data: {
        usid: Number(Usid)
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      method: 'POST',
      success: function (res) {
        console.log(res)
      }
    })
    wx.navigateTo({
      url: '../module_discount/pages/greatvalueworld/greatvalueworld?gotoList=true',
    })
  },

  onShareAppMessage: function (e) {
    var that = this;
    that.closeShareDialog();
    let a = this.data.shareTimeLineE
    let item = a.detail.currentTarget.dataset.item
    let id = a.detail.currentTarget.dataset.id
    let i = a.detail.currentTarget.dataset.indexshare
    let isWhat = a.currentTarget.dataset.iswhat
    let name = ''
    if (item.coupon_id){
        name = item.coupon_name
    }else{
        name = item.setMealName
    }
    var title = '推荐一个好东西给你：' + name;    
    var imgUrl = item.coupon_id ? 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/yhq5.png' : (item.pageUrl.length > 0 ? 
        item.pageUrl[0].pageURL : 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/yhq5.png');
    
    let shareObj = {
      title: title,
      path: 'pages/module_discount/pages/Package_details/Package_details?bind_type=3&bind_shop_id=' + item.shop_id + '&bind_customer_id=' + app.globalData.customerInf.id + '&bind_meals_type=' + (item.coupon_id ? '3' : '2') + '&bind_meals_id=' + (item.coupon_id ? item.coupon_id : item.setMealID) + '&bind_person_name=' + app.globalData.customerInf.name,
      imageUrl: imgUrl,
      success: function (res) {

        if (res.errMsg == 'shareAppMessage:ok') {
          that.hide();
        }
        wx.showToast({
          title: '发送成功！',
        })
      },
      fail: function (res) {
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          that.hide();
        } else if (res.errMsg == 'shareAppMessage:fail') {
          that.hide();
        }
      },
    };
    // 分享人次 +1
    wx.request({
      url: app.globalData.addShareNum_url,
      data: {
        shareId: item.coupon_id ? item.coupon_id : item.setMealID,
        isCombo: item.coupon_id ? 1 : 0
      },
      success: res => {
        console.log(item, "balala");
        if (isWhat == "1") {
          let a = that.data.couponList
          a[i].share_num = Number(a[i].share_num) + 1
          that.setData({
            couponList: a
          })
        } else if (isWhat == "2") {
          let b = that.data.foodList
          b[i].shareNum = Number(b[i].shareNum) + 1
          that.setData({
            foodList: b
          })
        } else if (isWhat == "3") {
          let c = that.data.wineList
          c[i].shareNum = Number(c[i].shareNum) + 1
          that.setData({
            wineList: c
          })
        } else {
          let d = that.data.comboList
          d[i].shareNum = Number(d[i].shareNum) + 1
          that.setData({
            comboList: d
          })
        }
      }
    })
    console.log(shareObj.path, "地址");
    return shareObj;
  },

  shareSelect(e) {    
    this.setData({
      shareDialog: true,
      shareTimeLineE: e
    })
  },

  closeShareDialog() {
    this.setData({
      shareDialog: false,
      // shareTimeLineE: null
    })
  },

  shareTimeLine() {
    console.log("shareTimeLine：")       
    this.closeShareDialog
    this.onShare1() 
  },

  onShare(e) {
    console.log("进来了", e);
    let that = this
    let item = e.detail.currentTarget.dataset.item
    let id = e.detail.currentTarget.dataset.id
    let i = e.detail.currentTarget.dataset.indexshare
    let isWhat = e.currentTarget.dataset.iswhat
    let page = 'pages/module_discount/pages/Package_details/Package_details'
    let shareUrl='';
    if (app.globalData.customerInf == '' || app.globalData.customerInf == null || app.globalData.customerInf == null) {
      wx.request({
        url: app.globalData.selectCustomerInfByOpenId_url,
        data: {
          openid: app.globalData.openid
        },
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          if (res.data != null && res.data != '') { //有记录
            shareUrl=app.globalData.getImageCode_url + '?page=' + page + '&a=a=' + (id == 0 ? item.setMealID : item.coupon_id) + '&version=' + app.globalData.QRCodeVersion + '&b=b=' + id + '&c=c=' + res.data.id;
            
            console.log("shareUrl:"+shareUrl);
            wx.request({
              url: shareUrl,
              method: "POST",
              responseType: 'arraybuffer',
              success: res => {
                const fsm = wx.getFileSystemManager();
                const fileName = wx.env.USER_DATA_PATH + '/share_img.jpeg';
                fsm.writeFile({ //获取到的数据写入临时路径
                  filePath: fileName, //临时路径
                  encoding: 'binary', //编码方式，二进制
                  data: res.data, //请求到的数据
                  success: res => {
                    console.log(res)
                    console.log(fileName) //打印路径
                    that.setData({
                      loadImagePath2: fileName,
                    }, () => {
                      if (that.waitImage) {
                        that.waitImage(true)
                      }
                    });
                  },
                })
              }
            })
          }
        }
      })
    } else {

      shareUrl=app.globalData.getImageCode_url + '?page=' + page + '&a=a=' + (id == 0 ? item.setMealID : item.coupon_id) + '&version=' + app.globalData.QRCodeVersion + '&b=b=' + id + '&c=c=' + app.globalData.customerInf.id;
      console.log("shareUrl:"+shareUrl);
      wx.request({
        url: shareUrl,
        method: "POST",
        responseType: 'arraybuffer',
        success: res => {
          const fsm = wx.getFileSystemManager();
          const fileName = wx.env.USER_DATA_PATH + '/share_img' + (Date.parse(new Date()) / 1000) + '.jpeg';
          fsm.writeFile({ //获取到的数据写入临时路径
            filePath: fileName, //临时路径
            encoding: 'binary', //编码方式，二进制
            data: res.data, //请求到的数据
            success: res => {
              console.log(res)
              console.log(fileName) //打印路径
              that.setData({
                loadImagePath2: fileName,
              }, () => {
                if (that.waitImage) {
                  that.waitImage(true)
                }
              });
            },
          })
        }
      })
    }

    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    let isPic = id == 0 ? !item.posterUrl : !item.share_url
    if (isPic || item.share_url == 'undefined' || item.posterUrl == 'undefined') {
      wx.showModal({
        title: '提示',
        content: '该超值优惠暂无海报!',
        showCancel: false
      })
      wx.hideLoading({
        success: (res) => {},
      })
      return;
    } else {
      wx.request({
        url: app.globalData.addShareNum_url,
        data: {
          shareId: id == 0 ? item.setMealID : item.coupon_id,
          isCombo: id
        },
        success: res => {
          console.log(item, "balala");
          if (isWhat == "1") {
            let a = that.data.couponList
            a[i].share_num = Number(a[i].share_num) + 1
            that.setData({
              couponList: a
            })
          } else if (isWhat == "2") {
            let b = that.data.foodList
            b[i].shareNum = Number(b[i].shareNum) + 1
            that.setData({
              foodList: b
            })
          } else if (isWhat == "3") {
            let c = that.data.wineList
            c[i].shareNum = Number(c[i].shareNum) + 1
            that.setData({
              wineList: c
            })
          } else {
            let d = that.data.comboList
            d[i].shareNum = Number(d[i].shareNum) + 1
            that.setData({
              comboList: d
            })
          }
        }
      })
    }
    that.setData({
      spawnSetMealID: id == 0 ? item.setMealID : item.coupon_id,
      showPoster: !that.data.showPoster,
      currentPoster: id == 0 ? item.posterUrl : item.share_url
    })
    wx.createSelectorQuery()
      .select('#canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec(that.init.bind(that))
  },

  init(res) {
      
    let that = this
    const width = res[0].width
    const height = res[0].height
    this.setData({
      canvas: res[0].node,
      loadImagePath: '',
      loadImagePath2: '',
    })
    const canvas = res[0].node
    const ctx = canvas.getContext('2d')
    const dpr = wx.getSystemInfoSync().pixelRatio
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    that.drawBackground().then(function () {
      that.drawQRCode().then(function () {
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 621 * wx.getSystemInfoSync().pixelRatio,
          height: 1104 * wx.getSystemInfoSync().pixelRatio,
          destWidth: 621,
          destHeight: 1104,
          canvas: that.data.canvas,
          success: function (res) {
            console.log(res)
            that.setData({
              loadImagePath: res.tempFilePath,
            });
            wx.hideLoading({
              success: (res) => {},
            })
          },
          fail: res => {
            console.log(res)
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      })
    })
  },

  generatePoster() {      
    let that = this
    that.closeShareDialog()
    let a = this.data.shareTimeLineE
    let item = a.detail.currentTarget.dataset.item    

    wx.createSelectorQuery()
      .select('#canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec(res => {
        const canvas = res[0].node
        var ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio          
        const width = res[0].width
        const height = res[0].height
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        
        wx.downloadFile({
            url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/sszg/04.png',
            success: res => {
                let img2 = canvas.createImage()
                img2.src = res.tempFilePath
                new Promise((a, b) => {
                    img2.onload = () => {
                        ctx.drawImage(img2, 0, 0, 621, 1104)
                        ctx.fillStyle = 'rgb(255, 255, 255)';
                        ctx.fillRect(430, 780, 210, 210);
                        //在背景加一些灰度以使上面的字更清晰一点
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                        ctx.fillRect(0, 30, 621, 984);
                        a()
                    }
                }).then(res => {
                    wx.downloadFile({
                        url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/sszg/shareTemplate.png',
                        success: res => {
                            let img = canvas.createImage()
                            img.src = res.tempFilePath
                            new Promise((a, b) => {
                                img.onload = () => {
                                    //分享模板图
                                    ctx.drawImage(img, 0, 0, 621, 1104)  
                                    a()
                                }
                            }).then(res => {
                                let roundURL = item.coupon_id ? 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/yhq5.png' : 
                                (item.pageUrl.length > 0 ? item.pageUrl[0].pageURL : 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/yhq5.png')
                                roundURL = roundURL + '?x-oss-process=image/circle,r_3000/format,png'                                                      
                                wx.downloadFile({
                                    url: roundURL,
                                    success: res =>{
                                        let img3 = canvas.createImage()
                                        img3.src = res.tempFilePath;
                                        new Promise((a,b) =>{
                                            img3.onload = () =>{
                                                ctx.drawImage(img3, 20, 100, 581, 464);  
                                                a()
                                            }
                                        }).then(res => {                                  
                                            
                                            //套餐参数
                                            ctx.font = "45px Georgia"
                                            ctx.textAlign = "left"
                                            ctx.fillStyle = "#FFFFFF"
                                            console.log('generatePoster: 菜名' + item.setMealName)
                                            ctx.fillText(item.setMealName ? item.setMealName : item.coupon_name, 30, 650)
                                            ctx.fillText(item.setMealName ? item.setMealName : item.coupon_name, 30.5, 650.5)
                                            ctx.fillText(item.setMealName ? item.setMealName : item.coupon_name, 29.5, 649.5)
                                            ctx.fillText(item.setMealName ? item.setMealName : item.coupon_name, 29, 649)
                                            ctx.fillText(item.setMealName ? item.setMealName : item.coupon_name, 31, 651)
                                            
                                            ctx.font = "50px Georgia"
                                            ctx.textAlign = "left"
                                            ctx.fillStyle = "white"

                                            ctx.fillText("￥" + (item.coupon_original ? item.coupon_original : item.price), 25, 725)
                                            ctx.fillText("￥" + (item.coupon_original ? item.coupon_original : item.price), 25.5, 725.5)
                                            ctx.fillText("￥" + (item.coupon_original ? item.coupon_original : item.price), 26, 726)
                                            ctx.fillText("￥" + (item.coupon_original ? item.coupon_original : item.price), 24, 724)
                                            ctx.fillText("￥" + (item.coupon_original ? item.coupon_original : item.price), 24.5, 724.5)
                                            
                                            if(item.originalPrice){
                                                ctx.font = "36px Georgia"
                                                ctx.textAlign = "left"
                                                ctx.fillStyle = "white"
                                                ctx.fillText("￥" + item.originalPrice, 220, 720)
                                                ctx.fillText("￥" + item.originalPrice, 220.5, 720.5)
                                                ctx.fillText("￥" + item.originalPrice, 221, 721)
                                                ctx.fillText("￥" + item.originalPrice, 219, 719)
                                                ctx.fillText("￥" + item.originalPrice, 219.5, 719.5)

                                                //原价划线
                                                ctx.fillStyle = 'white';
                                                ctx.fillRect(215, 705, 115, 6);
                                            }

                                            let text1 = (item.customer_platform_commission_amount > 0 ? item.customer_platform_commission_amount + '元[平台现金]' : item.customer_platform_commission_star > 0 ? item.customer_platform_commission_star +
                                            '个[平台星盾]' : '') 
                                            let text2 = (item.customer_shop_commission_amount > 0 ? item.customer_shop_commission_amount + '元[商家现金]' : item.customer_shop_commission_star > 0 ? item.customer_shop_commission_star + 
                                            '个[商家星盾]' : '')  
                                                                
                                            if (text1 != '' || text2 != '') {
                                                ctx.font = "32px Georgia"
                                                ctx.fillText("提成奖励：", 35, 830)
                                                ctx.fillText("提成奖励：", 35.5, 830.5)
                                                ctx.fillText("提成奖励：", 36, 831)
                                                ctx.fillText("提成奖励：", 36.5, 831.5)
                                                ctx.fillText("提成奖励：", 37, 832)

                                                ctx.font = "29px Georgia"

                                                if(text1 != ''){
                                                    ctx.fillText(text1, 50, 870)
                                                    ctx.fillText(text1, 50.5, 870.5)
                                                    ctx.fillText(text1, 51, 871)
                                                    ctx.fillText(text1, 51.5, 871.5)
                                                    ctx.fillText(text1, 52, 872)
                                                    if (text2 != ''){
                                                        ctx.fillText(text2, 50, 910)
                                                        ctx.fillText(text2, 50.5, 910.5)
                                                        ctx.fillText(text2, 51, 911)
                                                        ctx.fillText(text2, 51.5, 911.5)
                                                        ctx.fillText(text2, 52, 912)
                                                    }
                                                } else {
                                                    ctx.fillText(text2, 50, 870)
                                                    ctx.fillText(text2, 50.5, 870.5)
                                                    ctx.fillText(text2, 51, 871)
                                                    ctx.fillText(text2, 51.5, 871.5)
                                                    ctx.fillText(text2, 52, 872)
                                                }
                                            }                        
  

                                            //店铺名
                                            ctx.font = "25px Georgia"
                                            ctx.textAlign = "left"
                                            ctx.fillStyle = "#FFFFFF"
                                            ctx.fillText(item.shop_name, 21, 1050)
                                            ctx.fillText(item.shop_name, 21.5, 1050.5)
                                            
                                            //店铺地址
                                            if(item.shop_address){
                                            ctx.font = "18px Georgia"
                                            ctx.textAlign = "left"
                                            ctx.fillStyle = "#FFFFFF"
                                            
                                            let address = item.shop_address
                                            let addressSecond = ""
                                            if (address.length > 29) {
                                                addressSecond = address.slice(29)
                                                address = address.substring(0, 29)
                                            }
                                            ctx.fillText("地址：" + address, 21, 1080)
                                            ctx.fillText("地址：" + address, 21.5, 1080.5)
                                            if (addressSecond != "") {
                                                ctx.fillText(addressSecond, 80, 1100)
                                                ctx.fillText(addressSecond, 80.5, 1100.5)
                                            }
                                            }

                                            //套餐有效期
                                            ctx.font = "25px Georgia"
                                            ctx.textAlign = "right"
                                            ctx.fillStyle = "#FFFFFF"
                                            let time = !item.setMealName ? item.using_end_date : item.endTime.time                      
                                            ctx.fillText("有效期：" + new Date(time).getFullYear() + '-' + new Date(time).getMonth() + '-' + new Date(time).getDay() + "止", 618, 1000)
                                            ctx.fillText("有效期：" + new Date(time).getFullYear() + '-' + new Date(time).getMonth() + '-' + new Date(time).getDay() + "止", 618.5, 1000.5)                        
                                                
                                            wx.createSelectorQuery()
                                            .select('#myQrcode')
                                            .fields({
                                                node: true,
                                                size: true,
                                            })
                                            .exec(res => {
                                                let QRcanvas = res[0].node
                                                drawQrcode({
                                                    canvas: QRcanvas,
                                                    canvasId: 'myQrcode',
                                                    width: 200,
                                                    padding: 20,
                                                    background: '#ffffff',
                                                    foreground: '#000000',                           
                                                    text: app.getServerUrl()+"/QRCode/?bind_type=3&bind_meals_type=" + (item.coupon_id ? 3 : 2) + "&bind_meals_id=" + (item.coupon_id ? item.coupon_id : item.setMealID) +"&bind_customer_id=" + app.globalData.customerInf.id,                                                          
                                                })                    
                                                
                                                wx.canvasToTempFilePath({
                                                    canvasId: 'myQrcode',  
                                                    canvas: QRcanvas,                      
                                                    x: 0,
                                                    y: 0,
                                                    width: 220,
                                                    height: 220,
                                                    destWidth: 220,
                                                    destHeight: 220,
                                                    success(res) {                                                                                                               
                                                        let img3 = QRcanvas.createImage()
                                                        img3.src = res.tempFilePath
                                                        new Promise((a, b) => {
                                                            img3.onload = () => {
                                                            ctx.drawImage(img3, 401, 749, 220, 220)
                                                            a()
                                                            }
                                                        }).then(res => {
                                                            wx.canvasToTempFilePath({
                                                                x: 0,
                                                                y: 0,
                                                                width: 621 * wx.getSystemInfoSync().pixelRatio,
                                                                height: 1104 * wx.getSystemInfoSync().pixelRatio,
                                                                destWidth: 621,
                                                                destHeight: 1104,
                                                                canvas: canvas,
                                                                success: res2 => {
                                                                    wx.hideLoading()
                                                                    that.setData({
                                                                    loadImagePath: res2.tempFilePath,
                                                                    });                                    
                                                                    that.uploadShareCardFile(res2.tempFilePath,1)
                                                                }
                                                            })
                                                        })
                                                    }
                                                })
                                            })
                                        })                     
                                    }
                                })
                            })
                        }
                    })
                })
            }
        })
    })     

    wx.showLoading({
      title: '正在加载...',
      mask: true
    })
    that.setData({
      spawnSetMealID: this.data.id == 0 ? item.setMealID : item.coupon_id,
      showPoster: true,
      currentPoster: this.data.id == 0 ? item.posterUrl : item.share_url
    })
  },

  addShareCardInf(){
    let that = this;
    let data = {
      shop_id: app.globalData.shopid,
      poster_url: that.data.poster_url,
      video_url: that.data.video_url
    }

    wx.request({
      url: app.globalData.addShareCardInf,
      method: 'POST',
      data: data,
      success: res=>{
        if(res.data.code == 1){
          let shareCardInf = res.data.data;
          that.setData({
            shareCardInf
          })
        }
      }
    })
  },

  uploadShareCardFile(e,f){
    let that = this;
    wx.uploadFile({
      url: app.globalData.UploadAliYunFile,
      filePath: e,
      name: 'file',
      success: res=>{
        let result = JSON.parse(res.data);
        if (result.lst[0].success) {
          let url = result.lst[0].url;
          let poster_url = that.data.poster_url;
          let video_url = that.data.temporaryVideo;

          that.setData({
            poster_url: f == 1 ? url : poster_url,
            video_url: video_url
          },()=>{
            if(f == 1 && !that.data.shareCardInf){
              that.addShareCardInf();
            }else if(f == 1 && that.data.shareCardInf){
              that.updateShareCardInf()
            }
          })
        }
      }
    })
  },

  drawQRCode() {
    const that = this
    const canvas = this.data.canvas
    const ctx = canvas.getContext('2d')
    const img2 = canvas.createImage()
    return new Promise(function (resolve, reject) {
      that.waitImage = (bool) => {
        if (bool) {
          img2.src = that.data.loadImagePath2
          img2.onload = () => {
            ctx.drawImage(img2, 505, 1000, 90, 90)
            resolve()
          }
        }
      }
    })
  },

  drawBackground() {
    const that = this
    const canvas = this.data.canvas
    const ctx = canvas.getContext('2d')
    const img = canvas.createImage()
    img.src = that.data.currentPoster
    return new Promise(function (resolve, reject) {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 621, 1104)
        resolve()
      }
    })
  },
  closePosterWindow() {
    let that = this
    that.setData({
      showPoster: !that.data.showPoster,
      loadImagePath2: '',
      loadImagePath: '',
      currentPoster: '',
      // foodList: [],
      // pageNum1: 0,
      // },()=>{
      //    that.getSetMealAllInfo()
    })
  },
  showBigImage() {
    let that = this
    let arr = []
    arr.push(that.data.loadImagePath)
    wx.previewImage({
      urls: arr,
    })
  },
  toMall_Guide(e){
    console.log("toMall_Guide");
   wx.navigateTo({
     url: '/pages/mall_guide/mall_guide',
   }) 
  }
})