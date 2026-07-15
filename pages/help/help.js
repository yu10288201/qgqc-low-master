var app = getApp();
Page({
  data: {
    from_page:'',
    winHeight: "", //窗口高度
    winWidth: "",
    currentTab: 0, //预设当前项的值
    scrollLeft: 0, //tab标题的滚动条位置
    //reply:"false",
    //=========================================
    helpSecondList: [], //全部内容数组
    helpbehindList: [], //其他内容数组
    xdytList: [],
    shopList: [],
    successPath: '',  //上传成功返回路径
    tempFilePath: '', //临时文件路径

    //找个办法变成从数据库取出来
    helpArraynew: [],
    shop_id: app.globalData.shopId,	//店铺id
    platform_id:20903,//平台id
    allList: [{
      helpInfoTitleId: 0,
      helpInfoTitleName: '全部',
      shopId: app.globalData.shopid,
      helpInfoDetails: []
    }],//所有标题
    tempexpList: [],
    tempdetailnew: [],
  },
  // 滚动切换标签样式
  switchTab: function (e) {
    this.setData({
      currentTab: e.detail.current
    });
    // this.checkCor();
  },
  // 点击标题切换当前页时改变样式
  swichNav: function (e) {
    console.log(e)
    var cur = e.currentTarget.dataset.current;//第几个标题
    this.swichNavExec(cur);
    // if (this.data.currentTaB == cur) {
    //   return false;
    // } else {
    //   this.setData({
    //     currentTab: cur
    //   })
    // }
  },
  swichNavExec: function (cur) {
    if (this.data.currentTaB == cur) {
      return false;
    } else {
      this.setData({
        currentTab: cur
      })
    }
  },
  //判断当前滚动超过一屏时，设置tab标题滚动条。
  checkCor: function () {
    if (this.data.currentTab > 2) {
      this.setData({
        scrollLeft: 400
      })
    } else {
      this.setData({
        scrollLeft: 0
      })
    }
  },

  //这是打开文件的按钮对应的方法，目前已完成，不用管

  check(e) { //点击按钮，选择文件,返回文件的name和path 
    //进行下载并预览功能
    var that = this;
    that.setData({
      successPath: e.currentTarget.dataset.address
    })
    wx.downloadFile({ //运用微信自带的方法对该链接进行下载转换获取到临时的可供微信使用的链接
      url: that.data.successPath,

      success(res2) {
        that.setData({
          tempFilePath: res2.tempFilePath
        })
        wx.openDocument({ //打开这个临时链接，也就是打开文件，这里可以两个方法整合在一起，作为一个打开文件按钮
          filePath: that.data.tempFilePath,
          success: function (res3) {
          },
          fail: function () {
            wx.showModal({
              title: '提示',
              content: '没有找到可以使用的打开工具',
            })
          }
        })

      }
    })
  },




  onLoad: function (options) {
    var that = this;

    if(options.from_page){
        this.setData({
          from_page:options.from_page,
        })
    }
    //  高度自适应
    wx.getSystemInfo({
      success: function (res) {
        var clientHeight = res.windowHeight,
          clientWidth = res.windowWidth,
          rpxR = 750 / clientWidth;
        var calc = clientHeight * rpxR - 180;
        that.setData({
          winHeight: calc,
          windowWidth: clientWidth,
          shop_id: app.globalData.shopdetail.shop_id
        });
      }
    });
    that.getType();//获取分类信息


  },
  getList: function () {

    var that = this;
    //把allList的数据赋值到helpSecondList和helpbehindList中，用作数据显示
    //先把helpInfoDetails置空，否则会出现空行
    var listpush = [];
    var listpush2 = [];
    for (var k = 1; k < that.data.allList.length; k++) {
      listpush.push(that.data.allList[k])
      listpush2.push(that.data.allList[k].helpInfoDetails)

    }
    var list4 = {
      helpInfoTitleId: that.data.allList[1].helpInfoDetails.helpInfoFileName, helpInfoTitleName: 2222
    }
    that.setData({
      helpSecondList: that.data.allList[0],
      helpbehindList: listpush
    })
    that.setData({
      helpSecondList: that.data.helpSecondList
    })
    that.getDom();//获取文档信息

    if(this.data.allList.length>1){
      if(this.data.from_page=='mall_index'){
        this.swichNavExec(1);
      }
      
    }


  }, 
  getType: function () {
    var that = this;
    //先获取星点云台的所有分类，加载到分类列表中
    var data = {
      shop_id: that.data.platform_id
    }
    wx.request({//获取星点云台拥有的分类
      url: app.globalData.selectTitle_url,
      data: data,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      method: 'POST',
      success: function (res) {
        var xdytpush = [];
        var listexp = that.data.allList;
        for (var i = 0; i < res.data.length; i++) {//循环一边获得的标题，加入到标题列表中
          res.data[i].helpInfoDetails = []//先把文档清空，放在出现空文档列
          listexp.push(res.data[i])
          xdytpush = [];
          xdytpush.push(res.data[i].helpInfoTitleId, res.data[i].helpInfoTitleName);
          that.data.xdytList.push(xdytpush);
        }
        that.setData({//赋值到循环数组中，显示出标题
          allList: listexp
        })
        that.getList()
      }
    })




  },

  returnBack: function () {
    var pages = getCurrentPages(); //当前页面
    var beforePage = pages[pages.length - 2]; //前一页
    wx.navigateBack({
      success: function () {
        // beforePage.onLoad(); // 执行前一个页面的onLoad方法
      }
    });
  },

  getDom: function () {
    var that = this
    var data2 = {//获取xdyt平台公告的所有文档数据
      shop_id: that.data.platform_id
    }
    wx.request({
      url: app.globalData.GetShopHelpInfServlet_url,
      data: data2,
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
      method: 'POST',
      success: function (res2) {
        for (var x = 0; x < res2.data.length; x++) {
          for (var n = 0; n < that.data.allList.length; n++) {
            if (res2.data[x].help_info_dname == that.data.allList[n].helpInfoTitleName) {
              //获取到当前文档对应的id
              that.addFile(that.data.allList[n].helpInfoTitleId, that.data.allList[n].helpInfoTitleName, res2.data[x].help_info_fileaddress, res2.data[x].help_info_filename)//把文档放入对应id的数组中,参数是id，类型,url，文件名
              break;
            }
          }
          // that.addFile(res.data[x], res.data[x].help_infoTitle_id)

        }
      },
    })
  },

  addFile: function (id, type, url, name) {//往指定类别中加入文件,helpSecondList是全部文件，helpbehindList是后面的切换卡的文件
    var that = this;
    var list = {
      helpInfoTitleId: id,
      helpInfoTitleName: type,
      shopId: app.globalData.shopid,
      helpInfoAddress: url,
      helpInfoFileName: name
    };
    var pushList = that.data.helpSecondList;
    for (var i = 0; i < that.data.helpbehindList.length; i++) {
      if (id == that.data.helpbehindList[i].helpInfoTitleId) {
        that.data.helpbehindList[i].helpInfoDetails.push(list)
        that.setData({
          helpbehindList: that.data.helpbehindList
        })
      }
    }
    pushList.helpInfoDetails.push(list)
    that.setData({
      helpSecondList: pushList,
    })
  }
})
