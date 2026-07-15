/***
 * // 定义数据格式
 * "wxSearchData":{
 *  configconfig:{
 *    style: "wxSearchNormal" 
 *  },
 *  view:{
 *    hidden: true,
 *    searchbarHeght: 20
 *  }
 *  hotKeys:[],//自定义热门搜索 
 *  his:[]//历史搜索关键字
 *  value
 * }
 */

var appInstance = getApp();
var qqmap = appInstance.globalData.qqmap
// 提示集合
var __tipKeys = [];
// 搜索回调函数 
var __searchFunction = null;
// 返回函数 
var __goBackFunction = null;
// 应用变量
var __that = null;

// 初始化函数
function init(that, hotKeys, tipKeys, searchFunction, goBackFunction) {

  __that = that;
  __tipKeys = tipKeys;
  __searchFunction = searchFunction;
  __goBackFunction = goBackFunction;

  var temData = {};
  var barHeight = 130;
  var view = {
    barHeight: barHeight
  }
  temData.hotKeys = hotKeys;

  wx.getSystemInfo({
    success: function(res) {
      console.log(res)
      var wHeight = res.windowHeight;
      view.seachHeight = wHeight - (barHeight/2) -10;
      temData.view = view;
      __that.setData({
        wxSearchData: temData
      });
    }
  });

  getHisKeys(__that);
}



// 搜索框输入时候操作
function wxSearchInput(e) {
  var inputValue = e.detail.value.replace(/\s+/g, '');
  // 页面数据
  var temData = __that.data.wxSearchData;
  // 寻找提示值 
  var tipKeys = [];
  // 当输入值不为空的时候，联想热门词汇，暂时用不上
  // if (inputValue && inputValue.length > 0) {
    // for (var i = 0; i < __tipKeys.length; i++) {
    //   var mindKey = __tipKeys[i];
    //   // 包含字符串
    //   if (mindKey.indexOf(inputValue) != -1) {
    //     tipKeys.push(mindKey);
    //   }
    // }
  // }

  // 更新数据
  temData.value = inputValue;
  temData.tipKeys = tipKeys;
  // 更新视图
  __that.setData({
    wxSearchData: temData
  });
}

// 清空输入
function wxSearchClear() {

  console.log('清空输入!');
  // 页面数据
  var temData = __that.data.wxSearchData;
  // 更新数据
  temData.value = "";
  temData.tipKeys = [];
  // 更新视图
  __that.setData({
    wxSearchData: temData
  });
}

// 点击提示或者关键字、历史记录时的操作
function wxSearchKeyTap(e) {
  // search(e.target.dataset.key);
  // wxSearchClear();

  var inputValue = e.target.dataset.key;

  // 添加历史记录
  // wxSearchAddHisKey(inputValue);
  // 更新
  var temData = __that.data.wxSearchData;
  temData.value = inputValue;

  __that.setData({
    wxSearchData: temData
  });

}


 
// 确任或者回车
function wxSearchConfirm(e) {
  var that = this
  if(e){
    var key = e.target.dataset.key;
  }else{
    var key ='';
  }
  console.log(key)
  appInstance.globalData.selectStore = key
  if(appInstance.globalData.defaultCity){
    __that.setData({
      isPosition : true
    })
    if (key == 'back') {
      __goBackFunction();
      wxSearchClear(); //清除搜索页面搜索框缓存
      appInstance.globalData.selectStore = ''; //用完清空缓存
    } else if (key == 'dianPu') {
      search(__that.data.wxSearchData.value,key);
      wxSearchClear();
      appInstance.globalData.selectStore = '';
    } else if (key == 'caiPin') {
      search(__that.data.wxSearchData.value,key);
      wxSearchClear();
      appInstance.globalData.selectDishes = '';
    } else if (key == 'youHui') {
      search(__that.data.wxSearchData.value,key);
      wxSearchClear();
      appInstance.globalData.selectStore = '';
    } else if (key == 'jiuShui') {
      search(__that.data.wxSearchData.value,key);
      wxSearchClear();
      appInstance.globalData.selectStore = '';
    } else {
      search(__that.data.wxSearchData.value,key);
      wxSearchClear();
      appInstance.globalData.selectStore = '';
    } 
    wx.setStorage({
      key: "loca",
      data: true,
    })
  }else{
    getLocation(e);
      // that.wxSearchConfirm(e)
      // setTimeout(function() {
      //   //要延时执行的代码
      //   that.wxSearchConfirm(e)
      // }, 500) //延迟时间 这里是1秒 
  }
  
}


//搜索调用
function search(inputValue,key) {
  if (inputValue && inputValue.length > 0 || key == 'dianPu' ) {
    // 添加历史记录
    wxSearchAddHisKey(inputValue);
    // 更新
    var temData = __that.data.wxSearchData;
    temData.value = inputValue;

    __that.setData({
      wxSearchData: temData
    });
    // 回调搜索
    __searchFunction(inputValue);
  }
}

// 读取缓存
function getHisKeys() {
  var value = [];
  try {
    value = wx.getStorageSync('wxSearchHisKeys')
    if (value) {
      // Do something with return value
      var temData = __that.data.wxSearchData;
      temData.his = value;
      console.log('历史记录长度：' + temData.his.length)
      console.log('历史记录：' + temData.his)
      __that.setData({
        wxSearchData: temData
      });
    }
  } catch (e) {
    // Do something when catch error
  }
}

// 添加缓存
function wxSearchAddHisKey(inputValue) {
  if (!inputValue || inputValue.length == 0) {
    return;
  }
  var value = wx.getStorageSync('wxSearchHisKeys');
  if (value.length > 5) {
    value.pop()
  }
  if (value) {
    if (value.indexOf(inputValue) < 0) {
      value.unshift(inputValue); //将元素添加至第一位
    }
    wx.setStorage({
      key: "wxSearchHisKeys",
      data: value,
      success: function() {
        getHisKeys(__that);
      }
    })
  } else {
    value = [];
    value.push(inputValue);
    wx.setStorage({
      key: "wxSearchHisKeys",
      data: value,
      success: function() {
        getHisKeys(__that);
      }
    })
  }
}

// 删除缓存
function wxSearchDeleteAll() {
  wx.removeStorage({
    key: 'wxSearchHisKeys',
    success: function(res) {
      var value = [];
      var temData = __that.data.wxSearchData;
      temData.his = value;
      __that.setData({
        wxSearchData: temData
      });
    }
  })
}



// 导出接口
module.exports = {
  init: init, //初始化函数
  wxSearchInput: wxSearchInput, // 输入变化时的操作
  wxSearchKeyTap: wxSearchKeyTap, // 点击提示或者关键字、历史记录时的操作
  wxSearchDeleteAll: wxSearchDeleteAll, // 删除所有的历史记录
  wxSearchConfirm: wxSearchConfirm, // 搜索函数
  wxSearchClear: wxSearchClear, // 清空函数
}


// 获取定位
function getLocation(e){
  let that = this
  console.log('获取定位')

  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      appInstance.globalData.myLatitude = res.latitude,
        appInstance.globalData.myLongitude = res.longitude
      //用腾讯地图的api，根据经纬度获取城市
      qqmap.reverseGeocoder({
        location: {
          latitude: appInstance.globalData.myLatitude,
          longitude: appInstance.globalData.myLongitude
        },
        success: function (res) {
          var a = res.result.address_component
          //获取市和区（区可能为空）
          var provinceName = a.province
          var cityName = a.city
          // var countyName = a.district 
          var isPosition = true
          //赋值给全局变量
          appInstance.globalData.defaultProvince = provinceName
          appInstance.globalData.defaultCity = cityName
          // appInstance.globalData.defaultCounty = countyName
          // appInstance.globalData.localtionCounty = countyName
          appInstance.globalData.isPosition = isPosition
          __that.setData({
            cityName:cityName,
            // countyName:countyName,
            focus:true,
            input_bol:false,
            isPosition:true
          })
          //控制台输出结果
          // console.log(that.globalData.provinceName, that.globalData.countyName, that.globalData.myLatitude, that.globalData.myLongitude)
          // that.selectCityID()
          // wxSearchConfirm(e) 
        },
        fail: function (res) {
          console.log('获取地址失败' + res);
        },
        complete: function (res) {
          console.log(res);
          __that.setData({
            input_bol:false
          })
        }
      })

    },
    fail:function(res){
      console.log(res)
      if (res.errMsg =='getLocation:fail auth deny'){
        getSetting(e)
      }
    }
  })
}

// 避免再次授权
function getSetting(e){
  var that = this;
  wx.getSetting({
    success: (res) => {
      if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {//非初始化进入该页面,且未授权
        wx.showModal({
          title: '是否授权当前位置',
          content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
          success: function (res) {
            if (res.cancel) {
              // that.setData({
              //   isshowCIty: false
              // })
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
                    getLocation(that);
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
      } else if (res.authSetting['scope.userLocation'] == undefined) {//初始化进入
        getLocation(e);
      }
      else { //授权后默认加载
        getLocation(e);
      }
    }
  })
}
