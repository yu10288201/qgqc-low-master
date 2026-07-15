// pages/index/index.js

const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  chooseImg2a(e) { //点击'拍照'按钮
  var that = this;
  wx.chooseImage({
    count: 1, //最多可以选择的图片总数 
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['camera'], // 可以指定来源是相册还是相机，默认二者都有
    success: function(res) {
      that.setData({
        upimgList2: res.tempFilePaths,
      });
   }
 })
},

chooseImg2b(e) { //点击'拍照'按钮
  var that = this;
  wx.chooseImage({
    count: 1, //最多可以选择的图片总数 
    sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
    sourceType: ['album'], // 可以指定来源是相册还是相机，默认二者都有
    success: function(res) {
      that.setData({
        upimgList2: res.tempFilePaths,
      });
    }
  })
},
deleteImg2: function(e) { //删除临时列表内选择的照片
  var that = this;
  let upimgList = that.data.upimgList2;
  let index = e.currentTarget.dataset.index2;
  upimgList.splice(index, 1); //删除数组中index开始的总共一项
  that.setData({
    upimgList2: upimgList
  });
},
bigimg2: function(e) { //查看照片大图
  console.log(e)
  var that = this;
  var imgs = that.data.upimgList2;
  var index = e.currentTarget.dataset.index2;
  wx.previewImage({
    current: index,
    urls: imgs,
  })
},
taat:function(e){
  wx.uploadFile({
    // url: 'https://test.fsmbdlkj.com/evaluation/UploadImage', //接口地址
    url: app.globalData.allUrl.uploadImage, //接口地址
      filePath: this.data.upimgList2[0],
      name: 'file',
      formData: {
        'assessId': 10063
      },
      success: function(res) {
        console.log(res)
        console.log(res.data)
        if (res.data == "success") {
          console.log('上传成功')
        }
      },
      fail: function(res) {
        if (res.data != "success") {
          console.log('上传失败')
        }
      }
    })
},
qwe(e){
wx.request({
  // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/add_evaluation',
  url: app.globalData.taocan.add_evaluation_url,
  data: {
      "user_name":"jaker",
       "user_avatar":"123",
       "shop_id":3443,
       "assess_tab":123,
       "assess_evaluation":123,
       "assess_surport":123,
       "package_id":"",
       "dishes_id":4,
       "assess_type":2
  },
  header: {
    'content-type': 'application/json'
  },
  method: 'POST',
  success: function(res) {
    console.log(res.data)
  }
  })
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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