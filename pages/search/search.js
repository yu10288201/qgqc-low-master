// pages/search/search.js
const appInstance = getApp();
var WxSearch = require('../../wxSearchView/wxSearchView.js');
// 自动定位，引入SDK核心类
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

    // 城市选择
    cityName: '',
    countyName: '',
    longitude: 0, //经度
    latitude: 0, //维度
    selectStore: appInstance.globalData.selectStore,
    provinceID: '',
    cityID: '',
    countyID: '',
    storeCache: "",
    datacache: [],
    shop_name: '',
    store_img: '',
    shop_id: '',
    dataNum:0,//数据获取判断计数
    haverecent:false,//是否有最近使用餐厅
    showModalQR:false,//是否弹出弹框
    focus : false,
    input_bol : true,
    bdan : false,
    HotSpot: [],//热词
    LatelyRestaurant: [],//最近使用店铺
    ShopCollection: [],//我的餐厅
  },
  wxSearchFocus:function(){
    var that = this
    that.getLocation()
  },
  getsearchMainData(){
    let that = this
    if (!appInstance.globalData.unionID) {
      wx.showLoading({title: '获取数据中'})
      that.unionback = (bool) => {
        wx.request({
          url: appInstance.globalData.GetQgqcSearchPageData,
          method:'POST',
          header:{
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          data:{
            keyword_count: 10,
            unionid: appInstance.globalData.unionID
          },
          success:res=>{
            wx.hideLoading({
              success: (res) => {},
            })
            console.log(res.data.object,"查询页面主体内容");
            let object = res.data.object
            let fiveLatelyRestaurant = object.lstLatelyRestaurant.splice(0,5)
            that.setData({
              HotSpot: object.lstHotSpot,
              LatelyRestaurant: fiveLatelyRestaurant,
              ShopCollection: object.lstShopCollection
            })
    
            WxSearch.init(
              that,  // 本页面一个引用
              that.data.HotSpot, // 热点搜索推荐，[]表示不使用
              ['湖北', '湖南', '北京', "南京"],// 搜索匹配，[]表示不使用
              that.mySearchFunction, // 提供一个搜索回调函数
              that.myGobackFunction //提供一个返回回调函数
            );
          },
          fail: res => {
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      }
    }else{
      wx.request({
        url: appInstance.globalData.GetQgqcSearchPageData,
        method:'POST',
        header:{
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        data:{
          keyword_count: 10,
          unionid: appInstance.globalData.unionID
        },
        success:res=>{
          console.log(res.data.object,"查询页面主体内容");
          let object = res.data.object
          let fiveLatelyRestaurant = object.lstLatelyRestaurant.splice(0,5)
          that.setData({
            HotSpot: object.lstHotSpot,
            LatelyRestaurant: fiveLatelyRestaurant,
            ShopCollection: object.lstShopCollection
          })
  
          WxSearch.init(
            that,  // 本页面一个引用
            that.data.HotSpot, // 热点搜索推荐，[]表示不使用
            ['湖北', '湖南', '北京', "南京"],// 搜索匹配，[]表示不使用
            that.mySearchFunction, // 提供一个搜索回调函数
            that.myGobackFunction //提供一个返回回调函数
          );
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //var value = wx.getStorageSync('loca')
    // that.getUserInfo()
    
    // if(value === '' || value === true){
    //   
    // }
    
    if (options.jump == '0') {
      wx.navigateTo({
        url: '/pages/index/index',
      })
    } 
    // else if(options.jump == '1'){
    //   wx.navigateTo({
    //     url: '/pages/index/index?perform=' + true + '&tableid=' + appInstance.globalData.locationid,
    //   })
    // }
    if (!appInstance.globalData.unionID) {
      this.getUserInfo();
    }else{
      this.getsearchMainData()
    }

    if( !(appInstance.globalData.showModalQR || appInstance.globalData.unionID)){
      that.setData({
        showModalQR:true
      })
      appInstance.globalData.showModalQR = true
    }else{
      that.setData({
        showModalQR:false
      })
      appInstance.globalData.showModalQR = false
    }
    
    var cacheNameList = {};
    var cache = [];
    
    // that.getLocation()
    that.setData({
      isPosition: appInstance.globalData.isPosition
    })
    that.getLocation()
  },
 
  // 转发函数,固定部分
  wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  showTemp:function(){
    wx.showModal({
      title: '提示',
      content: '正在调试中，敬请期待',
    })
  },

  getLocation: function () {
    let that = this

    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
          console.log("经纬度：" + "(" + res.latitude + "," + res.longitude+")")
          var result1 = require('../../utils/util').transformFromWGSToGCJ( res.latitude, res.longitude);
          that.setData({
            myLatitude: result1.latitude,
            myLongitude: result1.longitude
          })
        //用腾讯地图的api，根据经纬度获取城市
        qqmap.reverseGeocoder({
          location: {
            latitude: result1.latitude,
            longitude: result1.longitude
          },
          success: function (res) {
            console.log(res,"所在地地图位置");
            var a = res.result.address_component
            //获取市和区（区可能为空）
            that.setData({
              provinceName: a.province,
              cityName: a.city,
              // countyName: a.district,
              isPosition: true,
              // focus:true,
              input_bol:false
            }) 
            //赋值给全局变量
            appInstance.globalData.defaultProvince = that.data.provinceName
            appInstance.globalData.defaultCity = that.data.cityName
            // appInstance.globalData.defaultCounty = that.data.countyName
            // appInstance.globalData.localtionCounty = that.data.countyName
            appInstance.globalData.myLongitude = that.data.myLongitude
            appInstance.globalData.myLatitude = that.data.myLatitude
            appInstance.globalData.isPosition = that.data.isPosition
            //控制台输出结果
            console.log(that.data.provinceName, that.data.countyName, that.data.myLatitude, that.data.myLongitude)
            that.selectCityID();
          },
          fail: function (res) {
            console.log('获取地址失败' + res);
          },
          complete: function (res) {
            that.setData({
              input_bol:false
            })
          }
        })

      },fail : function(res){
        console.log(res);
         //console.log('获取定位')
          // wx.showModal({
          //   title: '提示',
          //   content: '请打开定位',
          // })
      }
    })
  },

  // 定位市区
  selectCityID: function () {
    var that = this
    wx.request({
      // url: 'http://192.168.8.5:8087/WX Restaurant/GetInfoByCityName',
      url: appInstance.globalData.allUrl.defaultCityID,
      data: {
        provinceName: that.data.provinceName,
        cityName: that.data.cityName
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      success: function (res) {
        console.log(res,"定位市区结果");
        console.log(appInstance.globalData.defaultCounty,'区/县');
        if(res.data.object != null){
          let allArea = res.data.object
          that.setData({
            cityID: allArea.city.id,
            provinceID : allArea.province.id,
            cityCode: res.data.object.city.cityCode
          })
          appInstance.globalData.defaultProvinceID = that.data.provinceID;
          appInstance.globalData.defaultCityID = that.data.cityID;
          appInstance.globalData.cityIDResult = that.data.cityID.toString();
          appInstance.globalData.countyList = allArea.county;
          appInstance.globalData.areaList = allArea.area;
          appInstance.globalData.cityCode = that.data.cityCode

          // for(let item of appInstance.globalData.countyList){
          //   if(appInstance.globalData.defaultCounty == item.countyName){
          //     appInstance.globalData.defaultCountyID = item.id
          //   }
          // }
        }else{
          wx.showModal({
            title: '提示',
            content: '定位市区不成功'
          })
        }
        
      }
    })
  },
  

  // 搜索回调函数
  mySearchFunction: function (value) {
    // do your job here
    // 跳转
    console.log('搜索回调函数：' + appInstance.globalData.selectStore)
    if (appInstance.globalData.selectStore == 'dianPu') {
      wx.navigateTo({
        url: '../mainResult/mainResult?searchValue=' + value,
      })
    } else if (appInstance.globalData.selectStore == 'caiPin') {
      wx.navigateTo({
        url: '../module_others/pages/dishes/dishes?searchValue=' + value,
      })
    } 
    else if (appInstance.globalData.selectStore == 'jiuShui') {
      wx.navigateTo({
        url: '../module_others/pages/disheswine/disheswine?searchValue=' + value,
      })
    } 
    else if (appInstance.globalData.selectStore == 'youhui') {
      wx.navigateTo({
        url: '../module_others/pages/searchresult/searchresult?searchValue=' + value,
      })
    } else {
      wx.navigateTo({
        url: '../mainResult/mainResult?searchValue=' + value,
      })
    }
  },

  // 返回回调函数
  myGobackFunction: function () {
    // do your job here
    // 跳转
    wx.redirectTo({
      url: '../index/index?searchValue=返回'
    })
  },

  nearbyStore: function () {
    // 调转附近的店铺的页面 ，暂时
    var that = this
    console.log('附近的店铺')
    wx.navigateTo({
      url: '../mainResult/mainResult?searchValue=' + '附近',
    })
  },




  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    this.setData({
      longitude: appInstance.globalData.myLongitude, //经度
      latitude: appInstance.globalData.myLatitude, //维度
    })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;

    // 城市选择
    this.setData({
      cityName: appInstance.globalData.defaultCity,
      countyName: appInstance.globalData.defaultCounty,
      selectStore: appInstance.globalData.selectStore,
    })
    wx.getStorage({
      key: "showModalQR",
      success (res) {
        appInstance.globalData.showModalQR = res.data
        if(appInstance.globalData.showModalQR == true){
          that.setData({
            showModalQR:true
          })
        }else{
          that.setData({
            showModalQR:false
          })
        }
      }
    })
    // console.log(appInstance.globalData.showModalQR,"search279");

    

    appInstance.globalData.needOpenSocket = false // 不需要连接
    if(appInstance.globalData.isOpenSocket == true){ // 处于开启时
      console.log("关闭店铺呼叫连接")
      // appInstance.closeSocket()
    }

    var that = this
    // that.storeCacheselect()
    appInstance.delBtnClick();
    // appInstance.closeSocket();
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

  },

  imageToStore: function (e) {
    appInstance.globalData.shopid = e.currentTarget.dataset.id
    appInstance.getManagementDataServlet() //获取店铺设置信息
    wx.navigateTo({
      url: '../index/index',
    })
  },

  MyStore:function(e){
    appInstance.globalData.shopid = e.currentTarget.dataset.shopid
    appInstance.getManagementDataServlet() //获取店铺设置信息
    wx.navigateTo({
      url: '../index/index',
    })
  },

  storeCacheselect: function () {
    var that = this

    var arr = wx.getStorageSync('ResentStoreID') || [];
    console.log(arr);
    var storeID = arr.join();
    var storeCache = "";

    // arr = arr.reverse();
    console.log(storeID,"search358")

    var object = {
      "shopID": storeID
    }

    console.log(JSON.stringify(object))

    wx.request({
      // url: 'https://mb.fsmbdlkj.com/diancanxing/shop/shopIDQueryDetails',
      url: appInstance.globalData.allUrl.defaultStoreCache,
      data: JSON.stringify(object),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          storeCache: res.data.result
        })
        console.log(that.data.storeCache)
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
            console.log('请求获取用户信息')
            appInstance.globalData.avatarUrl = res.userInfo.avatarUrl
            appInstance.globalData.nickName = res.userInfo.nickName
            
            wx.request({
              //  url: 'https://mb.fsmbdlkj.com/register_war/servlet/openIdServlet',
              // url: 'http://192.168.102.13:8080/register/servlet/openIdServlet',
              url: appInstance.globalData.allUrl.getUnionID,
              data: {
                code: code,
                encryptedData: res.encryptedData,
                iv: res.iv,
                wechatAppId: appInstance.getWechatAppId(),
                //wsk: appInstance.globalData.wsk
              },
              header: {
                'content-type': 'application/json;charset=utf-8' //默认值
              },
              method: 'POST',
              success: function (res) {
                if (that.unionback) {
                  // wx.showToast({
                  //   title: '回调成功',
                  // })
                  that.unionback(true)
                }
                if (res.data) {
                  that.setData({
                    openid: res.data.data.openid,
                    unionId: res.data.data.unionId
                  })
                  appInstance.globalData.unionID = res.data.data.unionId
                  appInstance.globalData.openid = res.data.data.openid
                  that.getsearchMainData()
                  var unionId = res.data.unionId
                  if (unionId != undefined && unionId != null) {
                    wx.request({
                      url: appInstance.globalData.UserLogin_url,
                      data: {
                        Open_id: that.data.unionId,
                        Shop_id: appInstance.globalData.shopid
                      },
                      success: function (res) {
                        // appInstance.getCustomerInfo(unionId) //获取用户信息
                        if (res.data.result == null || res.data.result.result == 0) {
                          wx.request({
                            url: appInstance.globalData.UserRegistration_url,
                            data: {
                              Head_portrait_img: appInstance.globalData.avatarUrl,
                              User_nickname: appInstance.globalData.nickName,
                              Wx_openid: that.data.unionId,
                              Shop_id: appInstance.globalData.shopid
                            },
                            success: function (res) {
                              appInstance.globalData.user_id = res.data.object.user_id
                              wx.setStorage({
                                key: "user_id",
                                data: res.data.object.user_id
                              })
                              that.setData({
                                user_id: res.data.object.user_id
                              })
                              that.updateorderinf(appInstance.globalData.user_id)

                              that.isCollection() //查询收藏店铺

                            },
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

  ycts:function(){
    var that = this
    that.setData({
      showModalQR:false
    })
    appInstance.globalData.showModalQR=false
    wx.setStorage({
      key: "showModalQR",
      data: false
    })
  },
  noycts:function(){
    var that = this
    that.setData({
      showModalQR:true
    })
    appInstance.globalData.showModalQR=true
  },
  
})