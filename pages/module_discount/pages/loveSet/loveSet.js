// pages/module_discount/pages/loveSet/loveSet.js
const app = getApp()
const util = require('../../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    type: 1,
    customerInf: '',
    realName: '',
    phone: '',
    age: '',
    isSet: false,
    loveSetMeal: [],
    genderArray: ["男", "女"],
    genderIndex: 0,
    isRegister: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {console.log(options,1111); },
  getCustomerInfo() {
    let that = this
    wx.request({
      url: app.globalData.selectCustomerInfByOpenId_url,
      method: 'POST',
      data: {
        openid: app.globalData.openid
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
          let customerInf = res.data
          let b = new Date(customerInf.birthday)
          let n = new Date()
          let age = n.getFullYear() - b.getFullYear() - ((n.getMonth() < b.getMonth() || n.getMonth() < b.getMonth() && n.getDay() < b.getDay()) ? 1 : 0) //生日计算 2-9 ATim
          customerInf.age = age
          customerInf.gender = customerInf.gender == '未知' ? '男' : customerInf.gender == '女' ? '女' : '男'
          that.setData({
            customerInf: customerInf,
            realName: customerInf.realName,
            phone: customerInf.phone,
            age: customerInf.age,
            isRegister: false,
            genderIndex: customerInf.gender == '男' ? 0 : 1
          })
          that.setData({
            customerId: res.data.id
          })
          that.isFocus();
        } else {
          that.showRegister()
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
        if (res.data.list != undefined && res.data.list != "" && res.data.list.isFocus != '0') { } else {
          that.showFocus()
        }
      }
    })
  },

  select: function (e) {
    var that = this
    //console.log(that.data.setMealID)
    wx.request({
      // url: app.globalData.taocan.selectRule_url,
      url: 'https://mb.fsmbdlkj.com/wx_table/testBoot/selectRule',
      method: 'POST',
      data: {
        ruleID: 75
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res)
        if (res.data.length > 0) {
          var ruleList = ''
          var rule = ''
          rule = res.data[0].ruleContent
          ruleList = res.data[0]
          that.setData({
            ruleList: ruleList,
            rule: rule
          })
        }
      }
    })
  },

  showRegister() {
    let that = this;
    that.setData({
      isRegister: true,
    })
    // wx.showModal({
    //   title: '提示',
    //   content: '需注册本平台账号后方可报名套餐',
    //   showCancel: false,
    //   success: res => {
    //     if (res.confirm) {
    //       wx.navigateTo({
    //         url: '/pages/module_others/pages/register/register?openId=' + that.data.openId + '&unionId=' + that.data.unionID,
    //       })
    //     }
    //   }
    // })
  },
  goToRegister(){
    let that = this
    wx.navigateTo({
      url: '/pages/module_others/pages/register/register?openId=' + that.data.openId + '&unionId=' + that.data.unionID,
    })
  },
  showFocus() {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '需关注"切瓜切菜"公众号后方可报名套餐',
      showCancel: false,
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
            url: '/pages/module_others/pages/wxPublic/out?toLove=true',
          })
        }
      }
    })
  },

  toBuyLoveSet: function () {
    console.log(this.data.phone)
        console.log(this.data.realName)
        console.log(this.data.age)
        console.log(this.data.customerInf)
        if (this.data.phone.length != 11 || this.data.realName == null || this.data.realName == '' || parseInt(this.data.age) < 0) {
          wx.showModal({
            content: '信息不完整，请填写完整信息。',
            showCancel: false,
          })
          this.getCustomerInfo()
          return;
        }else
        if (this.data.customerInf.phone.length != 11 || this.data.customerInf.realName == null || this.data.customerInf.realName == '' || parseInt(this.data.customerInf.age) < 0) {
          wx.showModal({
            content: '信息不完整，请填写完整信息后点击确定按钮。',
            showCancel: false,
          })
          this.getCustomerInfo()
          return;
        }else{
          if (this.data.customerInf.length < 1) {
            wx.showModal({
              content: '请先确定注册信息!',
              showCancel: false,
            })
            this.getCustomerInfo()
          }else{
            wx.navigateTo({
              url: '../buyLoveSet/buyLoveSet?customerInf=' + JSON.stringify(this.data.customerInf),
            })
          }
        }
  },

  changeCustInf: function (e) {
    console.log(e)
    switch (e.currentTarget.dataset.id) {
      case "realName":
        this.setData({
          realName: e.detail.value
        })
        break;
      case "gender":
        this.setData({
          genderIndex: e.detail.value
        })
        break;
      case "phone":
        this.setData({
          phone: e.detail.value
        })
        break;
      case "age":
        this.setData({
          age: e.detail.value
        })
        break;
      case "confirm":
        if (this.data.phone.length < 11 || this.data.phone.length > 11) {
          wx.showModal({
            content: '请输入正确的11位手机号',
            showCancel: false,
          })
          return;
        }else{
          let a = this.data.customerInf.length > 0 ? this.data.customerInf : {}
          a.realName = this.data.realName
          a.gender = this.data.genderArray[this.data.genderIndex]
          a.phone = this.data.phone
          a.age = this.data.age
          this.setData({
            customerInf: a
          }, () => {
            wx.showModal({
              showCancel: false,
              content: "确定信息成功！",
              title: "提示："
            })
          })
        }
        break;
    }
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
    this.select()
    let that = this
    if (app.globalData.openid) {
      that.setData({
        openId: app.globalData.openid,
        unionId: app.globalData.unionID,
      })
      this.getCustomerInfo()
    } else {
      app.getCustomerInfo()
      app.getCustomerCallBack = (bool) => {
        if (bool) {
          that.setData({
            openId: app.globalData.openid,
            unionId: app.globalData.unionID,
          })
          console.log('我已进入方法我已进入方法我已进入方法我已进入方法我已进入方法我已进入方法我已进入方法我已进入方法')
          let b = new Date(app.globalData.customerInf.birthday)
          let n = new Date()
          let age = n.getFullYear() - b.getFullYear() - ((n.getMonth() < b.getMonth() || n.getMonth() < b.getMonth() && n.getDay() < b.getDay()) ? 1 : 0) //生日计算 2-9 ATim
          let customerInf = app.globalData.customerInf
          customerInf.age = age
          customerInf.gender = customerInf.gender == '未知' ? '男' : customerInf.gender == '女' ? '女' : '男'
          that.setData({
            customerInf: customerInf,
            realName: customerInf.realName,
            phone: customerInf.phone,
            age: customerInf.age,
          },()=>{
            this.getCustomerInfo()
          })
        }
      }
    }
    let a = app.globalData.loveSetMeal
    console.log(a)
    if (a != '') {
      a.activityDate = util.formatTimeTwo(app.globalData.loveSetMeal.activityDate / 1000, 'Y-M-D H:m:s')
      this.setData({
        isSet: true,
        loveSetMeal: app.globalData.loveSetMeal,
        phone1: app.globalData.loveSetMeal.customerInf1.phone,
        realName1: app.globalData.loveSetMeal.customerInf1.realName,
        age1: app.globalData.loveSetMeal.customerInf1.age,
      }, () => {
        app.globalData.loveSetMeal = ''
      })
    }
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