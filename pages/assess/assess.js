// pages/assess/assess.js
const appInstance = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

    // 字数限制
    current: 0,
    font_max: 300,
    images: [],
    content: '',
    list: ['味道好', '服务好', '上菜快', '正宗', '优惠实惠'],
    tab: true,
    tabs: '',
    // username: '测试', //用户名字

    avatarUrl: "", //用户头像路径
    nickName: "", //用户昵称
    avatar: "",

    shop_id: '', //商店ID
    assesstab: '', //标签
    shop_name: '',
    popErrorMsg: "",



    riderCommentList: [{
      value: '味道好',
      selected: false,
      title: '味道好'
    }, {
      value: '上菜快',
      selected: false,
      title: '上菜快'
    }, {
      value: '口味正宗',
      selected: false,
      title: '口味正宗'
    }, {
      value: '服务好',
      selected: false,
      title: '服务好'
    }, {
      value: '用料足',
      selected: false,
      title: '用料足'
    }, {
      value: '秘制蘸料',
      selected: false,
      title: '秘制蘸料'
    }, {
      value: '味道一般',
      selected: false,
      title: '味道一般'
    }],

  },
  checkboxChange(e) {
    var that = this
    console.log('checkboxChange e:', e);
    let string = "riderCommentList[" + e.target.dataset.index + "].selected"
    this.setData({
      [string]: !this.data.riderCommentList[e.target.dataset.index].selected
    })
    let detailValue = this.data.riderCommentList.filter(it => it.selected).map(it => it.value)
    let value = detailValue.join(",")
    this.setData({
      tabs: value
    })
    console.log('所有选中的值为：', that.data.tabs)
  },
  /**
   * 生命周期函数--监听页面加载 
   */

  onLoad: function (options) {
    let that = this
    console.log(appInstance.globalData.shopdetail)
    that.setData({
      shop_name: appInstance.globalData.shopdetail.shop_name,
      shop_address: appInstance.globalData.shopdetail.shop_address,
      area: appInstance.globalData.shopdetail.city,
      shop_id: appInstance.globalData.shopdetail.shop_id,
    })

    that.getCustomer()

    // wx.getUserInfo({
    //   success: function(res) {
    //     console.log(res)
    //     var avatarUrl = 'userInfo.avatarUrl';
    //     var nickName = 'userInfo.nickName';
    //     that.setData({
    //       avatarUrl: res.userInfo.avatarUrl,
    //       nickName: res.userInfo.nickName,
    //     })
    //     console.log(that.data.avatarUrl + ' ' + that.data.nickName);
    //   }
    // })
  },

  getCustomer() {
    let that = this
    wx.request({
      url: appInstance.globalData.selectCustomerInfByOpenId_url,
      data: {
        openid: appInstance.globalData.openid
      },
      method: "POST",
      success: res => {
        console.log(res);
        that.setData({
          avatarUrl: res.data.avatarUrl,
          nickName: res.data.name,
        })
      }
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

  },

  //统计文本框字数的
  getDataBindTap: function (e) {
    var value = e.detail.value;
    var length = parseInt(value.length);

    if (length > this.data.noteMaxLen) {
      return;
    }

    this.setData({
      current: length,
      content: value
    });

  },
  chooseImage(e) {
    var that = this

    wx.chooseImage({
      sizeType: ['original', 'compressed'], //可选择原图或压缩后的图片
      sourceType: ['album', 'camera'], //可选择性开放访问相册、相机
      success: res => {
        const images = that.data.images.concat(res.tempFilePaths)
        // 限制最多只能留下6张照片
        // that.data.images = images.length <= 6 ? images : images.slice(0, 6)
        that.setData({
          images: images.length <= 6 ? images : images.slice(0, 6)
        })
        console.log('选择图片成功!,共' + that.data.images.length + '张图')
      },
      count: 6,
      fail: res => {
        console.log('选择图片成功!,共' + images.length + '张图')
        console.log(res.errMsg)
      },
      complete: res => {
        console.log(typeof that.data.images)
      },
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

  submitForm(e) {
    var that = this
    const content = that.data.content

    if (content) {
      var object = {
        "userName": that.data.nickName,
        "shopId": that.data.shop_id,
        "assessTab": that.data.tabs,
        "assessEvaluation": content,
        "userAvatar": that.data.avatarUrl,
      }
      wx.request({
        url: appInstance.globalData.allUrl.uploadReview,
        data: JSON.stringify(object),
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          console.log(res.data);
          if (that.data.images.length != 0) {
            let num = 0
            for (var x of that.data.images) {
              console.log(x);
              wx.uploadFile({
                url: 'https://test.fsmbdlkj.com/WX Restaurant/UploadFile',
                filePath: x,
                name: 'file',
                formData: {
                  oldUrl: '',
                },
                success: res1 => {
                  let a = JSON.parse(res1.data)
                  console.log(a);
                  if (a.result.result == 1) {
                    wx.request({
                      // url: 'http://localhost:8088/evaluation/addPicture',
                      url: appInstance.globalData.addPicture_url,
                      data: {
                        imgUrl: a.object,
                        assessId: res.data
                      },
                      success: res => {
                        console.log(res);
                      }
                    })
                    num++
                    if (num == that.data.images.length) {
                      wx.showModal({
                        title: '提示',
                        content: '评价成功',
                        showCancel: false,
                        success: res=>{
                          wx.navigateBack()
                        }
                      })
                    }
                  }
                }
              })
            }
          } else {
            wx.showModal({
              title: '提示',
              content: '评价成功',
              showCancel: false,
              success: res=>{
                wx.navigateBack()
              }
            })
          }
          wx.hideLoading()


        }
      })
    } else {
      console.log("评价不能为空")
      that.setData({
        popErrorMsg: "评价内容不能为空"
      });
      that.ohShitfadeOut();
      return;
    }
  },


  //定时器提示框3秒消失
  ohShitfadeOut() {
    var fadeOutTimeout = setTimeout(() => {
      this.setData({
        popErrorMsg: ''
      });
      clearTimeout(fadeOutTimeout);
    }, 3000);
  },

})