const themeApi = require('../themeApi')

Page({
  data: {
    signupId: '',
    activityNo: '',
    activityName: '',
    signupName: '',
    signupPhone: '',
    amount: 0
  },

  onLoad(options) {
    const { signupId, activityNo, activityName, signupName, signupPhone, amount } = options
    this.setData({
      signupId: signupId || '',
      activityNo: decodeURIComponent(activityNo || ''),
      activityName: decodeURIComponent(activityName || ''),
      signupName: decodeURIComponent(signupName || ''),
      signupPhone: decodeURIComponent(signupPhone || ''),
      amount: parseFloat(amount) || 0
    })
  },

  onPay() {
    wx.showLoading({ title: '支付中...' })
    // TODO: 后端支付下单接口就绪后替换
    setTimeout(() => {
      wx.hideLoading()
      wx.showToast({ title: '支付成功', icon: 'success' })
      setTimeout(() => wx.navigateBack(), 1500)
    }, 1000)
  }
})
