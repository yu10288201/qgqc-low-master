// pages/guide/guide.js
var util = require('../../utils/util.js');
const appInstance = getApp(); //引入全局变量

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shop_name: '',
    scene: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    console.log(appInstance.globalData.user_id)
    var that = this

    if (options.scene != null) {
      // 切割小程序二维码的参数，得到桌位tableid和店铺shop_id
      appInstance.globalData.wechatsweep = true
      if (options.scene.search(",") != -1) {
        var arr = options.scene.split(",")
      } else if (options.scene.search("%2C") != -1) {
        var arr = options.scene.split("%2C")
      }

      var status = arr[0]
      var shop_id = parseInt(arr[1])

      wx.request({ //查询店铺详细信息，获得店名
        url: appInstance.globalData.SelectShopDetails_url,
        data: {
          shop_id: shop_id
        },
        success: function(res) {
          console.log(res.data[0])
          that.setData({
            shop_name: res.data[0].shop_name,
            scene: options.scene
          })
          wx.setNavigationBarTitle({
            title: "[" + res.data[0].shop_name + "]"
          })
          appInstance.globalData.shopid = res.data[0].shop_id
          appInstance.globalData.shopdetail = res.data[0]
          console.log("店名:" + res.data[0].shop_id)
        },
      })
      that.getmenu(shop_id) // 获取菜单
      appInstance.globalData.needOpenSocket = true
      // appInstance.initSocket()



    } else {
      wx.redirectTo({
        url: '../main/main',
      })
    }
  },

  toQRorder: function() {
    var that = this
    wx.navigateTo({
      url: '../QRorder/QRorder?scene_after=' + that.data.scene + '&stopJump='+true,
    })
  },

  //浏览菜单
  toMenu: function() {
    wx.navigateTo({
      url: '/pages/module_others/pages/menu/menu?lookMenu=1',
    })
  },

  toOrders : function () {
    wx.navigateTo({
      url: '../orders/orders',
    })
  },
  //获取菜单
  getmenu: function() {
    var that = this
    var menuListItem = []
    wx.request({
      url: appInstance.globalData.Getmenu_url,
      data: {
        Shop_id: appInstance.globalData.shopid
      },
      success: function(res) {
        console.log(res.data.object)
        //取出菜单下所有菜品
        for (var a = 0; a < res.data.object[0].length; a++) {
          for (var b = 0; b < res.data.object[0][a].class1s.length; b++) {
            for (var c = 0; c < res.data.object[0][a].class1s[b].class2.length; c++) {
              for (var d = 0; d < res.data.object[0][a].class1s[b].class2[c].dishesInfs.length; d++) {
                menuListItem.push(res.data.object[0][a].class1s[b].class2[c].dishesInfs[d])
              }
            }
          }
        }
        //仅取出第一级类别第一项、第二级类别第一项、第三级类别第一项下的菜品
        if (res.data.object[0] != "") { // 这里为进去菜单页面看到的菜品
          var menuItem = []
          for (var j = 0; j < res.data.object[1][0].class1s[0].parent_type_dishesInfList.length; j++)
            menuItem.push(res.data.object[1][0].class1s[0].parent_type_dishesInfList[j])


          wx.setStorage({
            key: 'menu',
            data: res.data.object[0],
          })
          wx.setStorage({
            key: 'menu1',
            data: res.data.object[1],
          })
          wx.setStorage({
            key: 'menuItem',
            data: menuItem,
          })
          wx.setStorage({
            key: 'menuListItem',
            data: menuListItem,
          })
          console.log(menuListItem)
          console.log(res.data.object[0][0])
          console.log(menuItem)


          // 注解，星盾折扣菜现在和特价菜是没有区别的
          that.setData({
            menuListItem: menuListItem,
          })
        } else {
          console.log("该店没有录入菜品")
        }
      }
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})