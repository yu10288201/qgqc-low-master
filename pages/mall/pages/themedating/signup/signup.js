const themeApi = require('../themeApi')
const app = getApp()

Page({
  data: {
    activityId: '',
    activityNo: '',
    activityType: '',
    activityName: '',
    activityDateStart: '',
    activityDateEnd: '',
    activityAddress: '',
    activityRule: '',
    activityPrice: 0,
    priceMale: 0,
    priceFemale: 0,
    signupName: '',
    signupGender: 1,
    signupAge: '',
    signupPhone: '',
    occupation: '',
    education: '',
    idCardNo: '',
    idCardFrontImg: '',
    idCardBackImg: '',
    avatarPhoto: '',
    selfIntro: '',
    uploadingFront: false,
    uploadingBack: false,
    uploadingAvatar: false,
    agreed: false
  },

  onLoad(options) {
    const { activityId, activityNo, activityName, activityTime, activityDateEnd, activityAddress, priceMale, priceFemale, activityType, activityRule } = options
    const pm = parseFloat(priceMale) || 0
    const pf = parseFloat(priceFemale) || 0
    this.setData({
      activityId: activityId || '',
      activityNo: decodeURIComponent(activityNo || ''),
      activityType: activityType || '',
      activityName: decodeURIComponent(activityName || ''),
      activityDateStart: decodeURIComponent(activityTime || ''),
      activityDateEnd: decodeURIComponent(activityDateEnd || ''),
      activityAddress: decodeURIComponent(activityAddress || ''),
      activityRule: decodeURIComponent(activityRule || ''),
      priceMale: pm,
      priceFemale: pf,
      activityPrice: pm
    })
    console.log('customerId:', app.globalData.customerInf && app.globalData.customerInf.id)
    themeApi.login().catch(() => {})
  },

  fetchLatestIntro() {
    themeApi.request({ url: '/signup/my/latestIntro', method: 'GET' }).then(res => {
      if (res && res.code === 200 && res.data && res.data.selfIntro) {
        this.setData({ selfIntro: res.data.selfIntro })
      }
    }).catch(() => {})
  },

  onInput(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value })
  },

  goDetail() {
    const { activityNo } = this.data
    if (!activityNo) return
    wx.navigateTo({ url: `../detail/detail?activityNo=${encodeURIComponent(activityNo)}` })
  },

  onGenderChange(e) {
    const gender = parseInt(e.detail.value) + 1
    const price = gender === 1 ? this.data.priceMale : this.data.priceFemale
    this.setData({ signupGender: gender, activityPrice: price })
  },

  toggleAgree() {
    this.setData({ agreed: !this.data.agreed })
  },

  uploadImage(type, dataKey, loadingKey) {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({ [loadingKey]: true })
        // 确保 token 有效再上传
        themeApi.login().then(() => {
          return themeApi.upload({ filePath: res.tempFiles[0].tempFilePath, type })
        }).then(url => {
          this.setData({ [dataKey]: url })
        }).catch(() => {
          wx.showToast({ title: '上传失败，请重试', icon: 'none' })
        }).finally(() => {
          this.setData({ [loadingKey]: false })
        })
      }
    })
  },

  uploadIdCardFront() { this.uploadImage('idcard_front', 'idCardFrontImg', 'uploadingFront') },
  uploadIdCardBack()  { this.uploadImage('idcard_back',  'idCardBackImg',  'uploadingBack') },
  uploadAvatar()      { this.uploadImage('avatar',       'avatarPhoto',    'uploadingAvatar') },

  onSubmit() {
    const d = this.data
    const isTravel = String(d.activityType) === '2'
    if (!d.agreed)       return wx.showToast({ title: '请先同意活动协议', icon: 'none' })
    if (!d.activityId)   return wx.showToast({ title: '活动信息缺失，请返回重新进入', icon: 'none' })
    if (!d.signupName)   return wx.showToast({ title: '请输入姓名', icon: 'none' })
    if (!/^1\d{10}$/.test(d.signupPhone)) return wx.showToast({ title: '请输入正确的手机号', icon: 'none' })
    if (!d.signupAge || isNaN(parseInt(d.signupAge))) return wx.showToast({ title: '请输入年龄', icon: 'none' })
    if (isTravel) {
      if (!d.idCardNo) return wx.showToast({ title: '请输入身份证号', icon: 'none' })
      if (!/^\d{17}[\dXx]$/.test(d.idCardNo)) return wx.showToast({ title: '身份证号格式不正确', icon: 'none' })
      if (!d.idCardFrontImg) return wx.showToast({ title: '请上传身份证正面', icon: 'none' })
      if (!d.idCardBackImg)  return wx.showToast({ title: '请上传身份证反面', icon: 'none' })
    }
    if (!d.avatarPhoto) return wx.showToast({ title: '请上传本人照片', icon: 'none' })

    wx.showLoading({ title: '提交中...' })
    console.log('customerId:', getApp().globalData.customerInf && getApp().globalData.customerInf.id)

    themeApi.request({
      url: '/signup/add',
      method: 'POST',
      data: {
        activityId:     d.activityId,
        activityNo:     d.activityNo,
        userId:         themeApi.getOpenId(),
        signupName:     d.signupName,
        signupGender:   d.signupGender,
        signupAge:      parseInt(d.signupAge),
        signupPhone:    d.signupPhone,
        occupation:     d.occupation,
        education:      d.education,
        idCardNo:       isTravel ? d.idCardNo : null,
        idCardFrontImg: isTravel ? d.idCardFrontImg : null,
        idCardBackImg:  isTravel ? d.idCardBackImg : null,
        avatarPhoto:    d.avatarPhoto,
        selfIntro:      d.selfIntro,
        customerId:     app.globalData.customerInf.id
      }
    }).then(res => {
      wx.hideLoading()
      if (res && res.code === 200) {
        wx.showToast({ title: '报名成功', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 1500)
      } else {
        wx.showToast({ title: res && res.msg || '报名失败，请重试', icon: 'none' })
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '网络异常，请重试', icon: 'none' })
    })
  }
})
