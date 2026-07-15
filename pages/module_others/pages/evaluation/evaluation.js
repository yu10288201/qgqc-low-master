const appInstance = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    height: 900,
    navbarActiveIndex: 0,
    shopid: '', //商店ID
    openid: '',
    isConsume: true,      // 是否消费
    evaluations: [],
    pictures: '',
    scroll_height:0,
    allCounts: 0,          // 评论总数
    recentCounts: 0,       // 目前只支持最多显示30条
    picturesCounts: 0,     // 测试总数
    evaluations_picture: '',
    evaluations_recent: '',
    navbarTitle: ["全部","晒图","最近"],   // "低分",
    textAll: false,
    approval: false,
    // supportNum: 126,

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
    tabs: '',

    listmenu: 0,
    leftscroll: 0,
    pop_window: 0,
    windowWidth: 0,
    windowHeight: 0,
    pop_window_for: 0,

    stopRefresh: false,
    loadMore: false, // 加载更多
    loadingMore: true, // 加载更多
    ellipsis: true, // 点击全文

    fixTop: '', //区域离顶部的高度
    scrollTop: 0, //滑动条离顶部的距离
    pageNum: 0 ,
  },

  onLoad: function(options) {
    var that = this;
    console.log("onLoad")
    console.log( appInstance.globalData.shopdetail)


    that.setData({
      shop_name: appInstance.globalData.shopdetail.shop_name,
      shop_address: appInstance.globalData.shopdetail.shop_address,
      area: appInstance.globalData.shopdetail.city,
      shopid: appInstance.globalData.shopdetail.shop_id,
      unionId: appInstance.globalData.unionID
    })
   
    that.selectIsConsume();
    
  },
  //筛选
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
    that.selectAllEvaluation(1)
  },

  getheight: function (res) {
    var that = this
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    that.setData({
      windowHeight: windowHeight,
      windowWidth: windowWidth,
      leftscroll: windowHeight - 41.2 - 80 - 40,
      listmenu: windowHeight - 45,
      pop_window: windowHeight * 0.72,
      pop_window_for: windowHeight * 0.7 - 80 - 40 - 70 - 25 - 80
    })
    console.log(that.data.leftscroll)
  },


  /**
   * 点击导航栏
   */
  onNavBarTap: function(event) {
    let that = this
    // 获取点击的navbar的index
    let navbarTapIndex = event.currentTarget.dataset.navbarIndex
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    that.setData({
      navbarActiveIndex: navbarTapIndex
    })
  },

  /**
   * 
   */
  onBindAnimationFinish: function({
    detail
  }) {
    // 设置data属性中的navbarActiveIndex为当前点击的navbar
    this.setData({
      navbarActiveIndex: detail.current
    })
  },

  approval:function(e){
    that.setData({
      approval: !that.data.approval,
      // supportNum: supportNum1,
    })
  },

  //全文
  ellipsis: function() {
    var value = !this.data.ellipsis;
    console.log('展开全文!');
    wx.onCompassChange(function(res) {

    })
    this.setData({
      ellipsis: value
    })
  },

  toAssess: function() {
    if (this.data.isConsume) {
      console.log('跳转到评价页面')
      wx.navigateTo({
        url: '../../../assess/assess',
      })
    } else {
      console.log('跳转到店铺页面')
      wx.navigateTo({
        url: '../../../index/index',
      })
    }

  },

  onShow: function() {
    let self = this;
    wx.createSelectorQuery().select('.navbar').boundingClientRect(function(rect) {
      self.setData({
        fixTop: rect.top,
      })
    }).exec()
    self.setData({
      pageNum: 0,
      evaluations: [],
    })
    self.selectAllEvaluation(0);
    // self.selectPictureEvaluation();
    // self.selectRecentEvaluation();
    // self.selectCount();
    self.getheight();
  },
  // onPageScroll: function(res) {
  //   let self = this;
  //   let top = res.scrollTop;
  //   self.setData({
  //     scrollTop: top
  //   });
  // },

  selectAllEvaluation: function(a) {
    var that = this
    if(a===1){
      console.log(that.data.tabs,'1111');
      that.setData({
        pageNum: 0,
        evaluations: []
      })
    }
    wx.request({
      url: appInstance.globalData.allUrl.selectAllEvaluation,
      // url: 'http://localhost:8088/evaluation/SelectAllEvaluation',
      data: {
        shopId: that.data.shopid,
        pageNum: that.data.pageNum,
        tabs: that.data.tabs
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data);
        let a = that.data.evaluations
        let b =[]
        b=a.concat(res.data.evaluation)
        if(res.data.evaluation.length == 0){
          that.setData({
            loadMore: true,
            stopRefresh: true
          })
        }
        that.setData({
          evaluations: b,
          evaluations_picture: res.data.hasPicture,
          evaluations_recent: res.data.recent,
          pageNum: Number(that.data.pageNum) + 1,
          allCounts: b.length,
          picturesCounts: res.data.hasPicture.length,
          recentCounts: res.data.recent.length > 30 ? 30 : res.data.recent.length
        })
        console.log(res.data)
      }
    })
  },
  downRefresh(){
    let that = this 
    if(!that.data.stopRefresh){
       that.selectAllEvaluation()
    }
   
  },

  // selectPictureEvaluation: function(res) {
  //   var that = this
  //   wx.request({
  //     url: appInstance.globalData.allUrl.selectPictureEvaluation,
  //     data: {
  //       shopId: that.data.shopid
  //     },
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     method: 'POST',
  //     success: function(res) {
  //       that.setData({
  //         evaluations: res.data
  //       })
  //       console.log(res.data)
  //       // that.selectPicture()
  //     }
  //   })
  // },

  // selectRecentEvaluation: function(res) {
  //   var that = this
    
  //   wx.request({
  //     url: appInstance.globalData.allUrl.selectRecentEvaluation,
  //     data: {
  //       shopId: that.data.shopid
  //     },
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     method: 'POST',
  //     success: function(res) {
  //       that.setData({
  //         evaluations_recent: res.data
  //       })
  //       console.log(res.data)
  //       // that.selectPicture()
  //     }
  //   })
  // },

  previewImg: function(e) {
    console.log(e.target);
    var index = [e.currentTarget.dataset.url];
    var imgArr = e.currentTarget.dataset.url;
    wx.previewImage({
      current: imgArr, //当前图片地址
      urls: index, //所有要预览的图片的地址集合 数组形式
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  // selectCount: function(e) {
  //   var that = this
  //   var object = {
  //     shopId: that.data.shopid
  //   }
  //   wx.request({
  //     url: appInstance.globalData.allUrl.selectCount,
  //     data: JSON.stringify(object),
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     method: 'POST',
  //     success: function(res) {
  //       console.log(res);
  //       that.setData({
  //         allCounts: res.data.all,
  //         picturesCounts: res.data.picture,
  //         recentCounts: res.data.all > 30 ? 30 : res.data.all
  //       })
        
  //     }
  //   })
  // },

  // selectPictureEvaluation: function(res) {
  //   var that = this

  //   wx.request({
  //     url: appInstance.globalData.allUrl.selectPictureEvaluation,
  //     // url: 'http://localhost:8088/evaluation/SelectPictureEvaluation',
  //     data: {
  //       shopId: that.data.shopid
  //     },
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     method: 'POST',
  //     success: function(res) {
  //       that.setData({
  //         evaluations_picture: res.data
  //       })
  //       // that.selectPicture()
  //     }
  //   })
  // },

  //查询是否消费，以最近一条订单已付款为准
  selectIsConsume: function(res) {
    var that = this
    var object = {
      "shopId": that.data.shopid,
      "openId": that.data.unionId
    }
    console.log(JSON.stringify(object))
    wx.request({
      url: appInstance.globalData.allUrl.selectIsConsume,
      // url: 'http://localhost:8088/evaluation/SelectIsConsume',
      data: JSON.stringify(object),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        console.log(res.data)
        that.setData({
          isConsume: res.data
        })
      }
    })
  },

})