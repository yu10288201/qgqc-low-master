// pages/invite/invite.js
const app = getApp(); //引入全局变量

const auth = require('../../utils/auth.js');

//获取倍率
const ratepx = 750.0 / wx.getSystemInfoSync().windowWidth;

//获取canvas转化后的rpx
const rate = function (rpx) {
  return rpx / ratepx
};

Page({
  /**
   * 页面的初始数据
   */
  data: {
    shopId: 0,
    isShowRegister: false, //是否注册
    isShowFocus: false, //是否关注
    isShare: false,
    isAuthorize: true, //是否登录/授权
    customerId: '',
    openId: '', //用户openID
    unionID: '', //用户unionID
    showAuthorize: false,
    backPic: "/images/main1.png",
    logo: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/logo1.png",
    background2: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/authorized.jpg', //授权图片,暂时不能放在服务器
  },

  check(e) {
    let that = this;
    wx.downloadFile({ //运用微信自带的方法对该链接进行下载转换获取到临时的可供微信使用的链接
      url: "https://mb.fsmbdlkj.com/XDYT/upload/20903/file/083049邀请新朋友终生收益活动规则.docx",

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

  showRegister() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '您尚未注册本平台账号,是否注册',
      success: res => {
        if (res.confirm) {
          wx.navigateTo({
            //url: '../module_others/pages/register_invite/register_invite',
            url: '../module_others/pages/register/register?openId=' + that.data.openId + '&unionId=' + that.data.unionID,
          })
        }
      }
    })
  },

  showFocus() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '请关注"切瓜切菜"公众号,才可以邀请获得收益',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addOrUpdateShopMiddleTemporary',
            data: {
              shopId: that.data.shopId ? that.data.shopId : 0,
              unionId: that.data.unionId,
            },
            method: "POST",
            success: res => {
              console.log(res);
            }
          })
          wx.navigateTo({
            url: '../module_others/pages/wxPublic/out',
          })
        }
      }
    })
  },

  onLoad: function (options) {
    var that = this;
    if (options.shopid != '') {
      that.setData({
        shopId: options.shopid ? options.shopid : 0
      })
    }
    that.setData({
      openId: app.globalData.openid,
      unionId: app.globalData.unionID,
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;

    that.setData({
      isAuthorize: app.globalData.isAuthorize,
    })

    that.getCustomerInfo();
  },



  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (options) {
    var that = this;
    var items = ['1', '2'];
    var item = items[Math.floor(Math.random() * items.length)];
    console.log('https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E5%88%87%E7%93%9C%E5%88%87%E8%8F%9C/images/share' + item + '.png')
    var shareObj = {
      title: "微信小程序餐饮平台·点开有奖", // 默认是小程序的名称(可以写slogan等)
      //当注册之后转发是带有邀请人openId的
      path: '/pages/invite/invite', // 默认是当前页面，必须是以‘/’开头的完整路径
      imageUrl: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/share' + item + '.jpg',
      // imageUrl: app.globalData.allImagesUrl.invite_Url,
      //自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径，支持PNG及JPG，不传入 imageUrl 则使用默认截图。显示图片长宽比是 5:4
      success: function (res) {
        // 转发成功之后的回调
        if (res.errMsg == 'shareAppMessage:ok') {
          that.hide();
        }
      },
      fail: function () {
        // 转发失败之后的回调
        if (res.errMsg == 'shareAppMessage:fail cancel') {
          that.hide();
          // 用户取消转发
        } else if (res.errMsg == 'shareAppMessage:fail') {
          // 转发失败，其中 detail message 为详细失败信息
          that.hide();
        }
      },
      complete: function () {

      }
    };
    // 来自页面内的按钮的转发
      // 此处可以修改 shareObj 中的内容
      shareObj.path = '/pages/module_others/pages/invite_plague/invite_plague?inviterOpenid=' + app.globalData.openid + '&shopid=' + that.data.shopId;
    // 返回shareObj
    return shareObj;
  },



  //拒绝授权，返回首页
  refused: function (res) {
    let that = this
    app.globalData.isAuthorize = false
    app.globalData.isRegister = false
    wx.switchTab({
      url: '../main/main',
    })

    that.setData({
      showAuthorize: false,
      isAuthorize: false
    })

  },

  getCustomerInfo() {
    let that = this
    wx.request({
      url: app.globalData.selectCustomerInfByOpenId_url,
      method: 'POST',
      data: {
        openid: that.data.openId
      },
      header: {
        'content-type': 'application/json;charset=utf-8' // 默认值
      },
      success: function (res) {
        console.log(res, "获取个人信息");
        that.setData({
          signIn: res.data.signIn,
        })
        if (that.data.signIn == 1) {
          that.setData({
            isShowRegister: false,
            customerId: res.data.id
          })
          that.isFocus();
        } else {
          that.setData({
            isShowRegister: true
          })
        }
      }
    })
  },

  //是否关注
  isFocus() {
    let that = this;
    wx.request({
      url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
      data: {
        unionId: app.globalData.unionID
      },
      success: res => {
        if (res.data.list != undefined && res.data.list != "" && res.data.list.isFocus != '0') {
          console.log("关注成功")
          that.setData({
            isShowRegister: false,
            isShowFocus: false,
            isShare: true,
          })
          // wx.request({
          //   //插入数据
          //   url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/selPublicFans', //公众号关注固定正式库
          //   // url: app.globalData.SelPublicFans_Url,
          //   data: {
          //     openId: app.globalData.openid,
          //     shopId: 0,
          //     focusId: res.data.list.focusId
          //   },
          //   success: res => {}
          // })
        } else {
          that.setData({
            isShowRegister: false,
            isShowFocus: true,
            isShare: false,
          })
        }
      }
    })
  },

  //跳转分销有奖页面
  todistributionReward() {
    let openId = app.globalData.openid
    wx.navigateTo({
      url: '../module_others/pages/distributionReward/distributionReward?openId=' + openId +'&customerId=' + this.data.customerId,
    })
  }

})