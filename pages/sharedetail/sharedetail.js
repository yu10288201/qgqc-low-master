const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    menuListItem: [],
    disabled: true,
    shareList:[]
  },

  //选择图片
  chooseimage: function() {
    var that = this
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: ['camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths[0]
        that.setData({
          image: tempFilePaths
        })
      }
    })
  },

  //获取备注
  getcontent: function(e) {
    console.log(e.detail.value)
    if (e.detail.value != undefined && e.detail.value != '') {
      this.setData({
        sharetitle: e.detail.value,
        disabled: false
      })
      app.globalData.sharetitle = e.detail.value
    } else {
      this.setData({
        disabled: true
      })
    }

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;
    // var menuListItem = that.data.menuListItem
    var id = options.id
    console.log(id)
    console.log(options)
    console.log(app.globalData.shareArr)
    var list = app.globalData.shareArr
    that.setData({
      shareList:list
    })
    console.log(list)
    console.log(that.data.shareList)

    if(app.globalData.sharetitle!='' && app.globalData.sharetitle!='' && app.globalData.sharetitle!=undefined && app.globalData.sharetitle!=null){
      that.setData({
        old_sharetitle : app.globalData.sharetitle
      })
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function(res) {
    var shareimage = this.data.shareList[0].bigDishesImg
    if (this.data.image != undefined) {
      shareimage = this.data.image
    }
    app.globalData.jump=true
    return {
      title: this.data.sharetitle,
      //TODO 现在跳到的是商店主页，后面需要改成跳到程序主页，即搜索页面后，在判定跳转到商店首页
      path: '/pages/main/main',
      imageUrl: shareimage
    }

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

  }


})