// 小程序开发api接口统一配置 
const app = getApp()
// const API_BASE_URL = 'https://' + app.globalData.server_name // 主域名

const request = (url, method, data, header) => {
  // let _url = getApp().getServerUrl() + url
  let _url = app.globalData.QRCodeUrl + url
  // let _url = 'https://test.fsmbdlkj.com' + url
  // let _url = 'https://mb.fsmbdlkj.com' + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': header
      },
      // dataType: dataType,
      // responseType: responseType,
      success: (result) => {
        resolve(result.data)
      },
      fail: (error) => {
        reject(error)
      },
      complete: (res) => {},
    })
  })
}

const request2 = (url, method, data, header) => {
  let _url = "http://192.168.8.2:8080/" + url
  return new Promise((resolve, reject) => {
    wx.request({
      url: _url,
      method: method,
      data: data,
      header: {
        'Content-Type': header
      },
      // dataType: dataType,
      // responseType: responseType,
      success: (result) => {
        resolve(result.data)
      },
      fail: (error) => {
        reject(error)
      },
      complete: (res) => {},
    })
  })
}

// 把小程序函数变成promise函数
const promisify = (fn) => {
  return (options, ...params) => {
    return new Promise((resolve, reject) => {
      fn(Object.assign({}, options, {
        success: resolve,
        fail: reject
      }), ...params);
    });
  }
};

/**
 * 小程序的promise没有finally方法，扩展
 */
//Promise.prototype.finally = function (callback) {
Promise.prototype.final = function (callback) {
  var Promise = this.constructor;
  return this.then(
    function (value) {
      Promise.resolve(callback()).then(
        function () {
          return value;
        }
      );
    },
    function (reason) {
      Promise.resolve(callback()).then(
        function () {
          throw reason;
        }
      );
    }
  );
}
//调用模板,直接复制，作用用
// WXAPI.接口名({
//   data:data
// }).then(function (data) {
//   if (data.result.result == 1) {

//   }else{

//   }
// }).catch(res=>{
//   console.log(res)
// })

// 因为这是新加的统一调用模块，所以很多接口还在app.js里面，后续会慢慢都加入这里统一调用。
module.exports = {
  request,
  getSideDish: (data) => request("/WX Restaurant/SelectSideDish", 'post', data, "application/x-www-form-urlencoded"),
  getShopDetailes: (data) => request("/WX Restaurant/GetShopDetailes", 'post', data, "application/x-www-form-urlencoded"),
  updateOrderDetailedForAll: (data) => request("/WX Restaurant/UpdateOrderDetailedForAll", 'post', data, "application/x-www-form-urlencoded"),
  getDefaultRemark: (data) => request("/WX Restaurant/GetDefaultRemark", 'post', data, "application/x-www-form-urlencoded"),
  getDishesInfoForSearchName: (data) => request("/WX Restaurant/GetDishesInfoForSearchName", 'post', data, "application/x-www-form-urlencoded"),
  getOrderCountForTableIDByDay: (data) => request("/WX Restaurant/GetOrderCountForTableIDByDay", 'post', data, "application/x-www-form-urlencoded"),
  getDishesSpec: (data) => request("/WX Restaurant/GetDishesSpec", 'post', data, "application/x-www-form-urlencoded"),
  getDishes: (data) => request("/WX Restaurant/GetDishes", 'post', data, "application/x-www-form-urlencoded"),
  selectEatingMethod: (data) => request("/WX Restaurant/SelectEatingMethod", 'post', data, "application/x-www-form-urlencoded"),
  updateOrderDetails: (data) => request("/WX Restaurant/UpdateOrderDetails", 'post', data, "application/json"),
  updateOrderInfForAll: (data) => request("/WX Restaurant/UpdateOrderInfForAll", 'post', data, "application/x-www-form-urlencoded"),
  synchronizedAmount: (data) => request("/WX Restaurant/SynchronizedAmount", 'post', data, "application/x-www-form-urlencoded"),
  writeOrder: (data) => request("/WX Restaurant/WriteOrder", 'post', data, "application/x-www-form-urlencoded"),
  getOrderCode: (data) => request("/evaluation/getOrderCode", 'post', data, "application/x-www-form-urlencoded"),
  updateOrderPayment: (data) => request("/evaluation/UpdateOrderPayment", 'post', data, "application/x-www-form-urlencoded"),
  whetherToOrderAccordingTheSeatInServer: (data) => request("/evaluation/whetherToOrderAccordingTheSeatInServer", 'post', data, "application/x-www-form-urlencoded"),
  selectOrderByOrderCode: (data) => request("/evaluation/selectOrderByOrderCode", 'post', data, "application/x-www-form-urlencoded"),
  getOrderSytle: (data) => request("/WX Restaurant/GetOrderSytle", 'post', data, "application/x-www-form-urlencoded"),
  transferOrderDetailed: (data) => request("/evaluation/transferOrderDetailed", 'post', data, "application/x-www-form-urlencoded"),
  getEmAndEaBySubclassTypeId: (data) => request("/WX Restaurant/GetEmAndEaBySubclassTypeId", 'GET', data, "application/x-www-form-urlencoded"),
  selectDishesSC: (data) => request("/WX Restaurant/SelectDishesSC", 'GET', data, "application/x-www-form-urlencoded"),
  selectDishesPC: (data) => request("/WX Restaurant/SelectDishesPC", 'GET', data, "application/x-www-form-urlencoded"),
  addEmBlock: (data) => request("/WX Restaurant/AddEmBlock", 'GET', data, "application/json"),
  addEatingMethod: (data) => request("/WX Restaurant/AddEatingMethod", 'GET', data, "application/json"),
  promisify:promisify,
  cuidanServlet: (data) => request("/foodMaterial_war/Servlet/cuidanServlet", 'GET', data, "application/json"),
}