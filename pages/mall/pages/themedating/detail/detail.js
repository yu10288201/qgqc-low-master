const themeApi = require('../themeApi')

Page({
  data: {
    headerImg: '',
    headerIsVideo: false,
    activity: null,
    mediaList: [],
    shareDialog: false,
    is_fenxiangpengyouquan: 0,
    shareTitleDialog: false,
    shareTitleInput: '',
    qrcodeDialog: false,
    qrcodeImg: '',
    posterDialog: false,
    posterUrl: ''
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
    this.setData({ is_fenxiangpengyouquan: 1 })
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    })
  },

  hideFenXiangPengYouQuan() {
    this.setData({ is_fenxiangpengyouquan: 0 })
  },

  toDingKe() {
    this.closeShareDialog()
  },

  toMallBaseArticleTemplateMain() {
    this.closeShareDialog()
  },

  stopPropagation() {},

  generatePosterClick_ToDetail() {
    this.closeShareDialog()
    const a = this.data.activity
    if (!a) return
    wx.showLoading({ title: '海报生成中...', mask: true })

    themeApi.request({ url: '/wx/qrcode', data: { activityNo: a.activityNo } }).then(res => {
      if (!res || res.code !== 200 || !res.data) {
        wx.hideLoading()
        wx.showToast({ title: '获取二维码失败', icon: 'none' })
        return
      }
      const qrcodeBase64 = 'data:image/png;base64,' + res.data
      const firstImg = this.data.mediaList.find(m => m.mediaType !== 1)
      const coverUrl = firstImg ? firstImg.url : this.data.headerImg

      wx.createSelectorQuery()
        .select('#posterCanvas')
        .fields({ node: true, size: true })
        .exec(canvasRes => {
          const canvas = canvasRes[0].node
          const ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio
          canvas.width = 621 * dpr
          canvas.height = 1099 * dpr
          ctx.scale(dpr, dpr)

          ctx.fillStyle = '#ffffff'
          ctx.fillRect(0, 0, 621, 1099)

          const drawInfo = () => {
            ctx.fillStyle = '#f7f7f7'
            ctx.fillRect(0, 580, 621, 519)

            ctx.font = 'bold 36px SimHei'
            ctx.fillStyle = '#222222'
            ctx.textAlign = 'left'
            const title = '活动标题：' + (a.title || '')
            if (ctx.measureText(title).width > 560) {
              ctx.fillText(title.substring(0, 14), 30, 640)
              ctx.fillText(title.substring(14), 30, 686)
            } else {
              ctx.fillText(title, 30, 640)
            }

            ctx.font = 'bold 28px SimHei'
            ctx.fillStyle = '#222222'
            ctx.fillText('活动类型：', 30, 730)
            ctx.font = '28px SimHei'
            ctx.fillStyle = '#555555'
            ctx.fillText(a.activityType || '主题交友', 30 + ctx.measureText('活动类型：').width, 730)

            ctx.font = 'bold 28px SimHei'
            ctx.fillStyle = '#222222'
            ctx.fillText('活动地点：', 30, 776)
            ctx.font = '28px SimHei'
            ctx.fillStyle = '#555555'
            ctx.fillText(a.location || '', 30 + ctx.measureText('活动地点：').width, 776)

            ctx.font = 'bold 28px SimHei'
            ctx.fillStyle = '#222222'
            ctx.fillText('活动时间：', 30, 822)
            ctx.font = '28px SimHei'
            ctx.fillStyle = '#555555'
            ctx.fillText(a.activityDateStart || '', 30 + ctx.measureText('活动时间：').width, 822)

            ctx.font = 'bold 28px SimHei'
            ctx.fillStyle = '#222222'
            ctx.fillText('活动费用：', 30, 868)
            ctx.font = '28px SimHei'
            ctx.fillStyle = '#555555'
            ctx.fillText('男 ¥' + (a.priceMale || 0) + '  女 ¥' + (a.priceFemale || 0), 30 + ctx.measureText('活动费用：').width, 868)

            const qrImg = canvas.createImage()
            qrImg.src = qrcodeBase64
            qrImg.onload = () => {
              ctx.drawImage(qrImg, 411, 890, 180, 180)
              wx.canvasToTempFilePath({
                canvas,
                success: r => {
                  wx.hideLoading()
                  this.setData({ posterUrl: r.tempFilePath, posterDialog: true })
                },
                fail: () => {
                  wx.hideLoading()
                  wx.showToast({ title: '海报生成失败', icon: 'none' })
                }
              })
            }
          }

          if (coverUrl) {
            wx.downloadFile({
              url: coverUrl,
              success: dlRes => {
                const img = canvas.createImage()
                img.src = dlRes.tempFilePath
                img.onload = () => {
                  ctx.drawImage(img, 0, 0, 621, 580)
                  drawInfo()
                }
                img.onerror = () => drawInfo()
              },
              fail: () => drawInfo()
            })
          } else {
            ctx.fillStyle = '#52A76E'
            ctx.fillRect(0, 0, 621, 580)
            drawInfo()
          }
        })
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '海报生成失败', icon: 'none' })
    })
  },

  generatePosterClick_ToResult() {
    this.closeShareDialog()
    wx.showToast({ title: '海报编辑页', icon: 'none' })
  },

  closePosterDialog() {
    this.setData({ posterDialog: false, posterUrl: '' })
  },

  savePoster() {
    const url = this.data.posterUrl
    if (!url) return
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success: () => wx.showToast({ title: '已保存到相册', icon: 'success' }),
      fail: (err) => {
        if (err.errMsg && err.errMsg.includes('auth deny')) {
          wx.showToast({ title: '请授权相册权限', icon: 'none' })
        } else {
          wx.showToast({ title: '保存失败', icon: 'none' })
        }
      }
    })
  },

  selectCustomerIsStaff() {
    this.closeShareDialog()
    const a = this.data.activity
    if (!a || !a.activityNo) return
    wx.showLoading({ title: '生成中...', mask: true })
    themeApi.request({ url: '/wx/qrcode', data: { activityNo: a.activityNo } }).then(res => {
      wx.hideLoading()
      if (res && res.code === 200 && res.data) {
        this.setData({
          qrcodeImg: 'data:image/png;base64,' + res.data,
          qrcodeDialog: true
        })
      } else {
        wx.showToast({ title: res && res.msg || '获取失败', icon: 'none' })
      }
    }).catch(err => {
      wx.hideLoading()
      console.error('[detail] 获取二维码异常:', err)
      wx.showToast({ title: '获取失败', icon: 'none' })
    })
  },

  closeQrcodeDialog() {
    this.setData({ qrcodeDialog: false, qrcodeImg: '' })
  },

  saveQrcode() {
    const img = this.data.qrcodeImg
    if (!img) return
    const base64 = img.replace('data:image/png;base64,', '')
    const arrayBuffer = wx.base64ToArrayBuffer(base64)
    const filePath = `${wx.env.USER_DATA_PATH}/qrcode_${Date.now()}.png`
    const fs = wx.getFileSystemManager()
    fs.writeFile({
      filePath,
      data: arrayBuffer,
      encoding: 'binary',
      success: () => {
        wx.saveImageToPhotosAlbum({
          filePath,
          success: () => wx.showToast({ title: '已保存到相册', icon: 'success' }),
          fail: (err) => {
            if (err.errMsg && err.errMsg.includes('auth deny')) {
              wx.showToast({ title: '请授权相册权限', icon: 'none' })
            } else {
              wx.showToast({ title: '保存失败', icon: 'none' })
            }
          }
        })
      },
      fail: () => wx.showToast({ title: '保存失败', icon: 'none' })
    })
  },

  openShareTitleDialog() {
    const a = this.data.activity
    this.closeShareDialog()
    this.setData({
      shareTitleDialog: true,
      shareTitleInput: `活动标题：${a ? a.title : '主题交友活动'}`
    })
  },

  onShareTitleInput(e) {
    this.setData({ shareTitleInput: e.detail.value })
  },

  confirmShareTitle() {
    this.setData({ shareTitleDialog: false })
  },

  cancelShareTitle() {
    this.setData({ shareTitleDialog: false })
  },

  onShareAppMessage() {
    const a = this.data.activity
    return {
      title: this.data.shareTitleInput || `活动邀请：${a ? a.title : '主题交友活动'}`,
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
