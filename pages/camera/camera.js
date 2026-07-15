// pages/camera/camera.js
const app = getApp()
Page({
  data: {
    is_video_show:app.globalData.is_video_show,
    show: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectData: ['香煎墨鱼饼', '均安煎鱼饼', '风味煎酿尖椒', '风味煎酿三宝', '时菜煲鱼滑', '卡夫脆皮虾角', '香酥海鲜卷', '美味紫苏甘香骨', '菠萝酸甜骨', '特色桂花骨'], //下拉列表的数据
    index: 0, //选择的下拉列 表下标,
    src: '',
    videosUse: []
  },
  onShow:function(){
    this.setData({
      is_video_show:app.globalData.is_video_show,
    })
  },
  selectTap() {
    this.setData({
      show: !this.data.show,
    });
  },
  // 点击下拉列表
  optionTap(e) {
    let Index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    this.setData({
      index: Index,
      show: !this.data.show
    });
  },

  select(e) {
    var that = this
    wx.request({
      url: app.globalData.SelectDishesVideo_url,
      data: {
        'shop_id': 3443,
        'dishes_id': this.data.index + 154362
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data)
        that.setData({
          videosUse: res.data
        })
      }
    })
  },

  //选择视频
  chooseVideo: function() {
    var that = this
    wx.chooseVideo({
      success: function(res) {
        that.setData({
          src: res.tempFilePath,
        })
      }
    })
  },

  //上传视频 目前后台限制最大100M，以后如果视频太大可以在选择视频的时候进行压缩
  uploadvideo: function() {
    var src = this.data.src;
    wx.uploadFile({
      url: app.globalData.UploadVideo_url, //服务器接口
      method: 'POST', //这句话好像可以不用
      filePath: src,
      header: {
        'content-type': 'multipart/form-data'
      },
      formData: {
        'shop_id': 3443,
        'dishes_id': this.data.index + 154362,
        'user_id': 3443
      },
      name: 'file', //服务器定义的Key值
      success: function(res) {

        console.log(res)
        if (res.data == "success") {
          console.log('视频上传成功')
          wx.showToast({
            icon: "success",
            title: "上传成功！",
            duration: 2000
          })
        }

      },
      fail: function() {
        console.log('接口调用失败')
        wx.showToast({
          icon: "success",
          title: "上传失败！",
          duration: 2000
        })
      }
    })
  },




  //获取菜单
  getmenu: function () {
    var that = this
    var menuListItem = []
    wx.request({
      url: app.globalData.Getmenu_url,
      data: {
        Shop_id: app.globalData.shopid
      },
      success: function (res) {
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
        if (res.data.object[0] != "") {// 这里为进去菜单页面看到的菜品
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
          wx.removeStorageSync('menu')
          wx.removeStorageSync('menu1')
          wx.removeStorageSync('menuItem')
          wx.removeStorageSync('menuListItem')
        }
      }
    })
  },


})