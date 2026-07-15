const themeApi = require('../themeApi')

Page({
  data: {
    orderId: '',
    activityId: '',
    amount: 0,
    title: '',
    activityNo: '',
    activityType: '',
    location: '',
    activityTimeStr: '',
    signupDeadlineStr: '',
    priceMale: 0,
    priceFemale: 0,
    currentCount: 0,
    maxCount: 0,
    promotionReward: '',
    status: '',
    description: '',
    submitting: false
  },

  onLoad(options) {
    const orderId = options.orderId || ''
    const activityId = options.activityId || ''
    const payStatus = parseInt(options.payStatus || '0')
    const amount = options.amount || 0
    this.setData({ orderId, activityId, payStatus, amount })
    if (activityId) {
      themeApi.request({ url: `/activity/detail/${activityId}` }).then(res => {
        if (!res || res.code !== 200 || !res.data) return
        const a = res.data
        const s = a.activityDateStart ? a.activityDateStart.slice(0, 16).replace('T', ' ') : ''
        const e = a.activityDateEnd ? a.activityDateEnd.slice(0, 16).replace('T', ' ') : ''
        const dl = a.signupDeadline ? a.signupDeadline.slice(0, 16).replace('T', ' ') : ''
        this.setData({
          title: a.title || '',
          activityNo: a.activityNo || '',
          activityType: a.activityType || '',
          location: a.location || '',
          activityTimeStr: s ? (e ? s + ' - ' + e : s) : '—',
          signupDeadlineStr: dl || '—',
          priceMale: a.priceMale || 0,
          priceFemale: a.priceFemale || 0,
          currentCount: a.currentCount || 0,
          maxCount: a.maxCount || 0,
          promotionReward: a.promotionReward || '',
          status: a.status,
          description: a.description || ''
        })
      }).catch(() => {})
    }
  },

  onRefund() {
    const { orderId, payStatus, submitting } = this.data
    if (payStatus === 0) {
      wx.showToast({ title: '您尚未支付，无法申请退款', icon: 'none' })
      return
    }
    if (submitting) return
    wx.showModal({
      title: '申请退款',
      content: '确认申请退款？',
      success: (res) => {
        if (!res.confirm) return
        this.setData({ submitting: true })
        wx.showLoading({ title: '处理中...' })
        themeApi.request({
          url: `/signup/refund/${orderId}`,
          method: 'POST'
        }).then(res => {
          wx.hideLoading()
          this.setData({ submitting: false })
          if (res && res.code === 200) {
            wx.showToast({ title: '退款申请已提交', icon: 'success' })
            setTimeout(() => wx.navigateBack(), 1500)
          } else {
            wx.showToast({ title: (res && res.msg) || '操作失败', icon: 'none' })
          }
        }).catch(() => {
          wx.hideLoading()
          this.setData({ submitting: false })
          wx.showToast({ title: '网络异常', icon: 'none' })
        })
      }
    })
  }
})
