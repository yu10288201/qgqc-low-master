const app = getApp()

Page({
  data: {},

  onLoad() {},

  toSignup() {
    wx.navigateTo({
      url: './activitylist/activitylist'
    })
  },

  toDoubleChoice() {
    wx.navigateTo({
      url: '/pages/module_discount/pages/activityPage/activityPage'
    })
  },

  toChat() {
    wx.navigateTo({
      url: '/pages/module_others/pages/chatWithCust/chatWithCust'
    })
  },

  toMySignup() {
    wx.navigateTo({
      url: './mysignup/mysignup'
    })
  },

  toMyOrder() {
    wx.navigateTo({
      url: './myorder/myorder'
    })
  },

  toPromotion() {
    wx.navigateTo({
      url: './promotion/promotion'
    })
  }
})
