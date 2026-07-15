const themeApi = require('../themeApi')

Page({
  data: {
    myList: [],
    myPage: 1,
    myTotal: 0,
    myLoading: false
  },

  onLoad() {
    themeApi.login().then(() => this.loadMySignup(true)).catch(() => this.loadMySignup(true))
  },

  loadMySignup(reset) {
    if (this.data.myLoading) return
    const page = reset ? 1 : this.data.myPage
    if (!reset && this.data.myList.length >= this.data.myTotal && this.data.myTotal > 0) return

    this.setData({ myLoading: true })

    themeApi.request({ url: '/signup/my', data: { pageNum: page, pageSize: 10 } }).then(res => {
      if (res && res.code === 200 && res.data) {
        const records = (res.data.records || []).map(item => ({
          ...item,
          amount: item.signupGender === 1 ? (item.priceMale || 0) : (item.priceFemale || 0),
          createTime: (item.createTime || '').replace('T', ' ').slice(0, 19)
        }))
        this.setData({
          myList: reset ? records : this.data.myList.concat(records),
          myPage: page + 1,
          myTotal: res.data.total || 0
        })
      }
    }).catch(() => {
      wx.showToast({ title: '加载失败，请重试', icon: 'none' })
    }).finally(() => {
      this.setData({ myLoading: false })
      if (reset) wx.stopPullDownRefresh()
    })
  },

  onReachBottom() {
    this.loadMySignup(false)
  },

  onPullDownRefresh() {
    this.loadMySignup(true)
  },

  goPay(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `../pay/pay?activityId=${item.activityId}&activityNo=${item.activityNo}&amount=${item.amount}&signupId=${item.id}`
    })
  }
})
