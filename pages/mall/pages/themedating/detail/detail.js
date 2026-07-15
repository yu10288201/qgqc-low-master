const themeApi = require('../themeApi')

Page({
  data: {
    headerImg: '',
    headerIsVideo: false,
    activity: null,
    mediaList: [],
    shareDialog: false
  },

  onLoad(options) {
    console.log('[detail] onLoad options:', JSON.stringify(options))
    const { activityNo } = options
    if (activityNo) this.loadDetail(activityNo)
  },

  loadDetail(activityNo) {
    themeApi.request({ url: `/activity/fullDetail/${activityNo}` }).then(res => {
      if (res && res.code === 200 && res.data) {
        const d = res.data
        const rawList = (d.mediaList || []).sort((a, b) => a.mediaType - b.mediaType)
        const mediaList = rawList.map((item, i) => {
          const isVideo = item.mediaType === 1
          const prevIsVideo = i > 0 && rawList[i - 1].mediaType === 1
          return { ...item, needGap: isVideo || prevIsVideo }
        })
        const firstImg = mediaList.find(m => m.mediaType !== 1)
        const firstVideo = mediaList.find(m => m.mediaType === 1)
        const headerMedia = firstImg || firstVideo || null
        const headerImg = headerMedia ? headerMedia.url : (d.headerImg || '')
        const headerIsVideo = headerMedia ? headerMedia.mediaType === 1 : /\.(mp4|mov|avi|wmv|flv|webm)(\?|$)/i.test(headerImg)
        this.setData({
          headerImg,
          headerIsVideo,
          activity: d.activity || null,
          mediaList
        })
      }
    }).catch(err => {
      console.error('[detail] fullDetail 异常:', err)
    })
  },

  previewMedia(e) {
    const { url } = e.currentTarget.dataset
    const imgUrls = this.data.mediaList
      .filter(m => m.mediaType === 2)
      .map(m => m.url)
    wx.previewImage({ urls: imgUrls, current: url })
  },

  shareSelect() {
    this.setData({ shareDialog: true })
  },

  closeShareDialog() {
    this.setData({ shareDialog: false })
  },

  shareTimeLine() {
    this.closeShareDialog()
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  toDingKe() {
    this.closeShareDialog()
  },

  toMallBaseArticleTemplateMain() {
    this.closeShareDialog()
  },

  generatePosterClick_ToDetail() {
    this.closeShareDialog()
    wx.showToast({ title: '海报生成中...', icon: 'none' })
  },

  generatePosterClick_ToResult() {
    this.closeShareDialog()
    wx.showToast({ title: '海报编辑页', icon: 'none' })
  },

  selectCustomerIsStaff() {
    this.closeShareDialog()
    wx.showToast({ title: '生成二维码', icon: 'none' })
  },

  onShareAppMessage() {
    this.closeShareDialog()
    const a = this.data.activity
    return {
      title: `活动邀请：${a ? a.title : '主题交友活动'}`,
      path: `pages/mall/pages/themedating/detail/detail?activityNo=${a ? a.activityNo : ''}`,
      imageUrl: this.data.headerImg || '',
      success() {
        wx.showToast({ title: '发送成功！' })
      }
    }
  },

  onShareTimeline() {
    const a = this.data.activity
    return {
      title: `活动邀请：${a ? a.title : '主题交友活动'}`,
      path: `pages/mall/pages/themedating/detail/detail?activityNo=${a ? a.activityNo : ''}`,
      imageUrl: this.data.headerImg || ''
    }
  },

  goSignup() {
    const a = this.data.activity
    if (!a) return
    wx.navigateTo({
      url: `../activitylist/activitylist?activityNo=${encodeURIComponent(a.activityNo)}`
    })
  },

  goChat() {
    const a = this.data.activity
    wx.navigateTo({ url: `../chat/chat?activityId=${a.id}` })
  },

  goPromotion() {
    const a = this.data.activity
    wx.navigateTo({ url: `../promotion/promotion?activityId=${a.id}` })
  }
})
