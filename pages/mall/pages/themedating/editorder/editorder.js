const themeApi = require('../themeApi')

Page({
  data: {
    orderId: '',
    canEdit: true,
    activityType: '',
    signupName: '',
    signupGender: 1,
    signupAge: '',
    signupPhone: '',
    talent: '',
    occupation: '',
    education: '',
    selfIntro: '',
    idCardNo: '',
    idCardFrontImg: '',
    idCardBackImg: '',
    avatarPhoto: '',
    nickname: '',
    maritalStatus: 0,
    remark: '',
    activityNo: '',
    refundTimeStr: '',
    refundBy: '',
    refundReason: '',
    uploadingFront: false,
    uploadingBack: false,
    uploadingAvatar: false,
    submitting: false,
    educationList: ['初中', '高中', '大专', '本科', '硕士', '博士'],
    educationIndex: 0
  },

  onLoad(options) {
    const item = options.item ? JSON.parse(decodeURIComponent(options.item)) : {}
    const canEdit = options.canEdit !== '0'
    wx.setNavigationBarTitle({ title: canEdit ? '修改订单' : '查看订单' })
    this.setData({ orderId: item.id || '', canEdit })
    this.fetchLatestOrder(item.id, item.activityId)
  },

  fetchLatestOrder(orderId, activityId) {
    themeApi.request({ url: '/signup/my/orders', data: { pageNum: 1, pageSize: 100 } }).then(res => {
      if (!res || res.code !== 200 || !res.data) return
      const found = (res.data.records || []).find(r => r.id == orderId)
      if (found) {
        let refundTimeStr = ''
        if (found.refundAuditTime) {
          const d = new Date(found.refundAuditTime.replace(' ', 'T'))
          d.setHours(d.getHours() + 8)
          refundTimeStr = d.toISOString().replace('T', ' ').slice(0, 19)
        }
        this.setData({
          signupName: found.signupName || '',
          signupGender: found.signupGender || 1,
          signupAge: found.signupAge ? String(found.signupAge) : '',
          signupPhone: found.signupPhone || '',
          talent: found.talent || '',
          occupation: found.occupation || '',
          education: found.education || '',
          educationIndex: Math.max(0, ['初中', '高中', '大专', '本科', '硕士', '博士'].indexOf(found.education || '')),
          selfIntro: found.selfIntro || '',
          idCardNo: found.idCardNo || '',
          idCardFrontImg: found.idCardFrontImg || '',
          idCardBackImg: found.idCardBackImg || '',
          avatarPhoto: found.avatarPhoto || '',
          nickname: found.nickname || (getApp().globalData && getApp().globalData.user_name) || '',
          maritalStatus: found.maritalStatus || 0,
          remark: found.remark || '',
          activityNo: found.activityNo || '',
          refundTimeStr,
          refundBy: found.refundAuditBy || '',
          refundReason: found.refundReason || ''
        })
        const aid = activityId || found.activityId
        if (aid) {
          themeApi.request({ url: `/activity/detail/${aid}` }).then(res => {
            if (res && res.code === 200 && res.data) {
              this.setData({ activityType: res.data.activityType || '' })
            }
          }).catch(() => {})
        }
      }
    }).catch(() => {})
  },

  onInput(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value })
  },

  onGenderChange(e) {
    this.setData({ signupGender: parseInt(e.detail.value) + 1 })
  },

  onMaritalChange(e) {
    this.setData({ maritalStatus: parseInt(e.detail.value) + 1 })
  },

  onEducationChange(e) {
    const index = parseInt(e.detail.value)
    const educationList = ['初中', '高中', '大专', '本科', '硕士', '博士']
    this.setData({ educationIndex: index, education: educationList[index] })
  },

  uploadImage(type, dataKey, loadingKey) {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album', 'camera'],
      success: res => {
        this.setData({ [loadingKey]: true })
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

  previewFront()  { wx.previewImage({ urls: [this.data.idCardFrontImg], current: this.data.idCardFrontImg }) },
  previewBack()   { wx.previewImage({ urls: [this.data.idCardBackImg],  current: this.data.idCardBackImg }) },
  previewAvatar() { wx.previewImage({ urls: [this.data.avatarPhoto],    current: this.data.avatarPhoto }) },

  deleteIdCardFront() { this.setData({ idCardFrontImg: '' }) },
  deleteIdCardBack()  { this.setData({ idCardBackImg: '' }) },
  deleteAvatar()      { this.setData({ avatarPhoto: '' }) },

  onSubmit() {
    const d = this.data
    if (!d.signupName.trim()) return wx.showToast({ title: '请输入姓名', icon: 'none' })
    if (!d.signupPhone) return wx.showToast({ title: '请输入手机号', icon: 'none' })
    if (!/^1\d{10}$/.test(d.signupPhone)) return wx.showToast({ title: '手机号格式不正确', icon: 'none' })
    if (!d.signupAge) return wx.showToast({ title: '请输入年龄', icon: 'none' })
    const age = parseInt(d.signupAge)
    if (age < 18 || age > 99) return wx.showToast({ title: '年龄须在18-99岁之间', icon: 'none' })
    if (d.submitting) return

    this.setData({ submitting: true })
    wx.showLoading({ title: '提交中...' })
    themeApi.request({
      url: '/signup/update',
      method: 'PUT',
      data: {
        id: d.orderId,
        signupName: d.signupName,
        signupGender: d.signupGender,
        signupAge: age,
        signupPhone: d.signupPhone,
        talent: d.talent,
        occupation: d.occupation,
        education: d.education,
        selfIntro: d.selfIntro,
        idCardNo: d.idCardNo,
        idCardFrontImg: d.idCardFrontImg,
        idCardBackImg: d.idCardBackImg,
        avatarPhoto: d.avatarPhoto,
        nickname: d.nickname || null,
        maritalStatus: d.maritalStatus || null,
        remark: d.remark || null
      }
    }).then(res => {
      wx.hideLoading()
      this.setData({ submitting: false })
      if (res && res.code === 200) {
        wx.showToast({ title: '修改成功', icon: 'success' })
        setTimeout(() => wx.navigateBack(), 1500)
      } else {
        wx.showToast({ title: (res && res.msg) || '修改失败', icon: 'none' })
      }
    }).catch(() => {
      wx.hideLoading()
      this.setData({ submitting: false })
      wx.showToast({ title: '网络异常', icon: 'none' })
    })
  }
})
