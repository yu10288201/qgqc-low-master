// pages/newchat/newchat.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    images: [],
    imagesUse: [],
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function (e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  tel: function () {
    wx.makePhoneCall({
      phoneNumber: '0757-83131326',
    })
  },

  /**
    * 生命周期函数--监听页面加载
    */
  onLoad: function (options) {
    this.select()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  // carouselToDetail: function () {
  //   wx.navigateTo({
  //     url: '/pages/newchat/newchat',
  //   })
  // },

  chooseImage(e) {
    var that = this

    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = that.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下6张照片
        that.setData({
          images: images.length <= 6 ? images : images.slice(0, 6)
        })
        console.log('选择图片成功!,共' + that.data.images.length + '张图')
      },
      count: 6,
      fail: res => {
        console.log(res.errMsg)
      },
      complete: res => {
        console.log(typeof that.data.images)
      },
    })
  },

  submitForm(e) {
    var that = this
    let num = 0
    for (var x of that.data.images) {
      wx.uploadFile({
        url: app.globalData.UploadServicePicture_url, //接口地址
        filePath: x,
        name: 'file',
        success: function (res) {
          console.log(res.data)
          if (res.data == "success") {
            console.log(x + '上传成功')
            num++
          } else {
            console.log(x + '上传失败')
          }
        },
        fail: function (res) {
          if (res.data != "success") {
            console.log(x + '上传失败')
          }
        }
      })
    }
    if (num == that.data.images.length) {
      console.log('图片全部上传成功')
    }


  },
 
  select(e) {
    var that = this
    wx.request({
      url: app.globalData.SelectServicePicture_url,
      success: function (res) {
        console.log(res.data)
        that.setData({
          imagesUse: res.data
        })
      }
    })
  },

  //删除图片
  removeImage(e) {
    var that = this;
    var idx = e.currentTarget.dataset.idx;
    var images = that.data.images;
    images.splice(idx, 1);
    that.setData({
      images: images
    });
    console.log(that.data.images);
  },

  //点击放大图片
  handleImagePreview(e) {
    const idx = e.target.dataset.idx
    const images = this.data.images
    wx.previewImage({
      current: images[idx], //当前预览的图片
      urls: images, //所有要预览的图片
    })
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

  }


})