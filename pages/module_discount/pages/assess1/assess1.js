// pages/assess/assess.js
const app = getApp()
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
    one_2: 0,
    two_2: 5,
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
      value: '服务态度好',
      selected: false,
      title: '服务态度好'
    }, {
      value: '上菜快',
      selected: false,
      title: '上菜快'
    }, {
      value: '口味正宗',
      selected: false,
      title: '口味正宗'
    }, {
      value: '优惠实惠',
      selected: false,
      title: '优惠实惠'
    }]

  },
  in_xin:function(e){
    var in_xin = e.currentTarget.dataset.in;
    var one_2;
    if (in_xin === 'use_sc2'){
      one_2 = Number(e.currentTarget.id);
    } else {
      one_2 = Number(e.currentTarget.id) + this.data.one_2;
    }
    this.setData({
      one_2: one_2,
      two_2: 5 - one_2
    })
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

  onLoad: function(options) {
    var that = this
    that.setData({
      dishes_id:options.dishes_id,
      shop_name: '东海明珠酒楼',
      shop_address: '',
      area: '',
      shop_id: options.shop_id,
      order_id:options.order_id,
      order_status:options.order_status,
      ticket_type:options.ticket_type,
      id:options.id
    })
    if(options.id == 0){
      that.setData({
        ticket_type:2
      })
    }else if(options.id == 1){
      that.setData({
        ticket_type:3
      })
    }
    wx.getUserInfo({
      success: function(res) {
        console.log(res)
        var avatarUrl = 'userInfo.avatarUrl';
        var nickName = 'userInfo.nickName';
        that.setData({
          avatarUrl: res.userInfo.avatarUrl,
          nickName: res.userInfo.nickName,
        })
        console.log(that.data.avatarUrl + ' ' + that.data.nickName);
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

  },

  //统计文本框字数的
  getDataBindTap: function(e) {
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

  tapEvaluation(e){
    var that= this
    if(that.data.one_2  ==0){
    wx.showModal({
      title: '提示',
      content: '评分不能为空',
      success: function (res) {
        if (res.confirm) { //这里是点击了确定以后

        } else { //这里是点击了取消以后
        }
      }
    })
  }else{
    that.submitForm()
  }
  },
  submitForm(e) {
    var that = this
    const content = that.data.content

    if (content) {
      wx.downloadFile({
        url: that.data.avatarUrl,
        success(res) {
          // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
          if (res.statusCode === 200) {
            that.setData({
              avatar: res.tempFilePath
            })
            console.log(that.data.avatar)
            wx.uploadFile({ //获取用户的头像，缺点是不同步，只保存用户当时的头像(别人也写过，方法重复)
              url: app.globalData.allUrl.UploadAvatar,
              filePath: that.data.avatar,
              name: 'file',
              success: function(res) {
                console.log(res)
                console.log('上传头像成功')
                that.setData({
                  avatar: res.data
                })

                wx.showLoading({
                  title: '正在上传...',
                  mask: true
                })
                // 先上传头像，返回地址，再和其他内容一起上传
                var object = {
                  "user_name": that.data.nickName,
                  "shop_id": that.data.shop_id,
                  "assess_tab": that.data.tabs,
                  "assess_evaluation": content,
                  "user_avatar": res.data,
                  "assess_surport":that.data.one_2,
                  "package_id":'',
                  "dishes_id":that.data.dishes_id,
                  "assess_type":that.data.ticket_type
                }
                console.log(JSON.stringify(object))

                wx.request({
                  // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/add_evaluation',
                  url: app.globalData.taocan.add_evaluation_url,
                  data: JSON.stringify(object),
                  header: {
                    'content-type': 'application/json'
                  },
                  method: 'POST',
                  success: function(res) {
                    console.log(res.data);
                    if (that.data.images != "") {
                      console.log(that.data.images)
                      let num = 0
                      for (var x of that.data.images) {
                        wx.uploadFile({
                        //  url: 'https://test.fsmbdlkj.com/evaluation/UploadImage', //接口地址
                         url: app.globalData.allUrl.UploadImage,
                          filePath: x,
                          name: 'file',
                          formData: {
                            'assessId': res.data
                          },
                          success: function(res) {
                            console.log(res.data)
                            if (res.data == "success") {
                              console.log(x + '上传成功')
                              num++
                            }
                          },
                          fail: function(res) {
                            if (res.data != "success") {
                              console.log(x + '上传失败')
                            }
                          }
                        })
                      }
                      if (num == that.data.images.length) {
                        console.log('图片全部上传成功')
                      }
                    }
                    wx.hideLoading()

                    wx.showToast({
                      title: '评价成功',
                      duration: 3000,
                      success: function() {
                        var pages = getCurrentPages();
                        var prevPage = pages[pages.length - 2]; //上一个页面
                        prevPage.onLoad()                       //刷新上一个页面，但是没啥用，因为无法重新渲染
                        wx.navigateBack({
                          success: function() {
                            prevPage.SelectTicketOrderInfo(); // 执行前一个页面的onLoad方法
                        }
                      }); //关闭当前页面，返回上一个页面
                      }
                    });
                    console.log("评论成功！");
                    wx.request({ 
                      // url: 'https://test.fsmbdlkj.com/WX Restaurant/UpdateTicketOrderInfo',
                      url: app.globalData.taocan.UpdateTicketOrderInfo_url,
                      data: {
                        "order_id":that.data.order_id,                    
                        "order_status":that.data.order_status,
                        "order_remark":1
                      },
                      header: {
                        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                      },
                      method: 'POST',
                      success: function(res) {
                        that.SetmealLike() 
                      }
                    })
                  }
                })
              },
              fail: function(res) {
                if (res.data != "success") {
                  console.log('上传头像失败')
                }
              }
            })
          }
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

  SetmealLike:function(e){//新增方法
    var that =this
    if(that.data.SelectTicketOrderInfoList.ticket_type==2){
      wx.request({
        // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/updataSetMeal',
        url: app.globalData.taocan.updataSetMeal_url,
        method: 'POST',
        data: {
          setMealID: that.data.order_id,
          id:1
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
        }
      })
    }else{
    wx.request({
      url: app.globalData.taocan.updataCoupon_url,
      method: 'POST',
      data: {
        setMealID: that.data.order_id,
        id:1
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
  }
})
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