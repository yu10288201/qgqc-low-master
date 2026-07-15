const themeApi = require('../themeApi')

Page({
  data: {
    headerHeight: 0,
    showForm: true,
    // 搜索
    searchTitle: '',
    searchLocation: '',
    searchDateStart: '',
    searchDateEnd: '',
    searchMinPrice: '',
    searchMaxPrice: '',
    priceCleared: false,
    editingField: '',
    searchType: '',
    activityTypeList: ['全部', 'KTV', '旅游', '美食'],
    searchTypeIndex: 0,
    // 活动列表
    activityList: [],
    activityPage: 1,
    activityTotal: 0,
    activityLoading: false,
    selectedActivityId: '',
    // 报名表单（选中的活动信息）
    activityId: '',
    activityNo: '',
    activityType: '',
    activityName: '',
    activityDateStart: '',
    activityDateEnd: '',
    activityAddress: '',
    activityRule: '',
    priceMale: 0,
    priceFemale: 0,
    activityPrice: 0,
    // 报名表单（用户填写）
    signupName: '',
    signupGender: 1,
    signupAge: '',
    signupPhone: '',
    occupation: '',
    education: '',
    educationList: ['初中', '高中', '大专', '本科', '硕士', '博士'],
    educationIndex: -1,
    idCardNo: '',
    idCardFrontImg: '',
    idCardBackImg: '',
    avatarPhoto: '',
    selfIntro: '',
    talent: '',
    nickname: '',
    maritalStatus: 0,
    remark: '',
    nextNo: '',
    uploadingFront: false,
    uploadingBack: false,
    uploadingAvatar: false,
    agreed: false
  },

  onLoad(options) {
    themeApi.login().catch(() => {})
    const app = getApp()
    const nickName = (app.globalData && app.globalData.user_name) || ''
    if (nickName) this.setData({ nickname: nickName })
    if (options.activityNo) {
      this.loadAndSelectActivity(decodeURIComponent(options.activityNo))
    } else {
      this.autoSelectLatestActivity()
    }
  },

  loadAndSelectActivity(activityNo) {
    themeApi.request({ url: '/activity/list', data: { pageNum: 1, pageSize: 100, status: 1 } }).then(res => {
      if (!res || res.code !== 200 || !res.data) return
      const list = res.data.records || []
      const item = list.find(r => r.activityNo === activityNo) || list[0]
      if (!item) return
      const pm = item.priceMale || 0
      const pf = item.priceFemale || 0
      this.setData({
        showForm: true,
        selectedActivityId: item.id,
        activityId: item.id,
        activityNo: item.activityNo || '',
        activityType: item.activityType || '',
        activityName: item.title || '',
        activityDateStart: item.activityDateStart || '',
        activityDateEnd: item.activityDateEnd || '',
        activityAddress: item.location || '',
        activityRule: item.description || '',
        priceMale: pm,
        priceFemale: pf,
        searchTitle: item.title || '',
        searchLocation: item.location || ''
      })
      this.fetchNextNo(item.activityNo || item.id, 1)
    }).catch(() => {})
  },

  autoSelectLatestActivity() {
    themeApi.request({ url: '/activity/list', data: { pageNum: 1, pageSize: 100, status: 1 } }).then(res => {
      if (!res || res.code !== 200 || !res.data) return
      const list = res.data.records || []
      if (!list.length) return
      // 找 activityDateStart 最晚的活动
      const latest = list.reduce((a, b) => {
        return (a.activityDateStart || '') >= (b.activityDateStart || '') ? a : b
      })
      const pm = latest.priceMale || 0
      const pf = latest.priceFemale || 0
      this.setData({
        showForm: true,
        selectedActivityId: latest.id,
        searchTitle: latest.title || '',
        searchLocation: latest.location || '',
        searchDateStart: (latest.activityDateStart || '').slice(0, 16),
        searchDateEnd: (latest.activityDateEnd || '').slice(0, 16),
        searchMinPrice: latest.priceMale ? String(latest.priceMale) : '',
        searchMaxPrice: latest.priceFemale ? String(latest.priceFemale) : '',
        searchTypeIndex: latest.activityType ? latest.activityType : 0,
        searchType: latest.activityType ? String(latest.activityType) : '',
        activityId: latest.id,
        activityNo: latest.activityNo || '',
        activityType: latest.activityType || '',
        activityName: latest.title || '',
        activityDateStart: latest.activityDateStart || '',
        activityDateEnd: latest.activityDateEnd || '',
        activityAddress: latest.location || '',
        activityRule: latest.description || '',
        priceMale: pm,
        priceFemale: pf
      })
      this.fetchNextNo(latest.activityNo || latest.id, 1)
    }).catch(() => {})
  },

  fetchNextNo(activityId, gender) {
    themeApi.request({ url: '/signup/nextNo', data: { activityId, gender } }).then(res => {
      if (res && res.code === 200 && res.data) {
        this.setData({ nextNo: res.data })
      }
    }).catch(() => {})
  },

  onReady() {
    this.updateHeaderHeight()
  },

  updateHeaderHeight() {
    wx.createSelectorQuery().select('#sticky-header').boundingClientRect(rect => {
      if (rect) {
        console.log('[headerHeight]', rect.height)
        this.setData({ headerHeight: rect.height })
      }
    }).exec()
  },

  onSearch() {
    this.setData({
      showForm: false,
      activityList: [],
      activityPage: 1,
      activityTotal: 0,
      priceCleared: false,
      editingField: ''
    })
    this.loadActivities(true, true)
  },

  // 打勾选中活动，赋值并切回表单
  onSelectActivity(e) {
    const item = e.currentTarget.dataset.item
    const pm = item.priceMale || 0
    const pf = item.priceFemale || 0
    this.setData({
      showForm: true,
      selectedActivityId: item.id,
      searchTitle: item.title || '',
      searchLocation: item.location || '',
      searchDateStart: item.activityDateStart || '',
      searchDateEnd: item.activityDateEnd || '',
      searchMinPrice: item.priceMale ? String(item.priceMale) : '',
      searchMaxPrice: item.priceFemale ? String(item.priceFemale) : '',
      activityId: item.id,
      activityNo: item.activityNo || '',
      activityType: item.activityType || '',
      activityName: item.title || '',
      activityDateStart: item.activityDateStart || '',
      activityDateEnd: item.activityDateEnd || '',
      activityAddress: item.location || '',
      activityRule: item.description || '',
      priceMale: pm,
      priceFemale: pf,
      activityPrice: pm
    })
    wx.nextTick(() => this.updateHeaderHeight())
  },

  onSearchInput(e) {
    const field = e.currentTarget.dataset.field
    this.setData({ [field]: e.detail.value })
  },

  onSearchTypeChange(e) {
    const index = parseInt(e.detail.value)
    // index 0 = 全部，1=KTV(1)，2=旅游(2)，3=美食(3)
    this.setData({ searchTypeIndex: index, searchType: index === 0 ? '' : String(index) })
  },

  onDateStartChange(e) {
    const newDate = e.detail.value // yyyy-MM-dd
    const oldVal = this.data.searchDateStart || ''
    const timePart = oldVal.length > 10 ? oldVal.slice(10) : ' 00:00'
    const newVal = newDate + timePart
    this.setData({ searchDateStart: newVal })
    const { searchDateEnd } = this.data
    if (searchDateEnd && newVal > searchDateEnd) {
      wx.showToast({ title: '开始时间不能晚于结束时间', icon: 'none' })
    }
  },

  onDateEndChange(e) {
    const newDate = e.detail.value // yyyy-MM-dd
    const oldVal = this.data.searchDateEnd || ''
    const timePart = oldVal.length > 10 ? oldVal.slice(10) : ' 23:59'
    const newVal = newDate + timePart
    this.setData({ searchDateEnd: newVal })
    const { searchDateStart } = this.data
    if (searchDateStart && newVal < searchDateStart) {
      wx.showToast({ title: '结束时间不能早于开始时间', icon: 'none' })
    }
  },

  onFieldTap(e) {
    const field = e.currentTarget.dataset.field
    const update = { editingField: field }
    if (field === 'price' && !this.data.priceCleared) {
      update.searchMinPrice = ''
      update.searchMaxPrice = ''
      update.priceCleared = true
    }
    this.setData(update)
  },

  onFieldBlur() {
    this.setData({ editingField: '' })
  },

  onPriceFocus() {
    if (!this.data.priceCleared) {
      this.setData({ searchMinPrice: '', searchMaxPrice: '', priceCleared: true })
    }
  },

  onPriceBlur(e) {
    const field = e.currentTarget.dataset.field
    const { searchMinPrice, searchMaxPrice } = this.data
    const min = parseFloat(searchMinPrice)
    const max = parseFloat(searchMaxPrice)
    if (field === 'searchMaxPrice' && searchMinPrice && searchMaxPrice && max <= min) {
      wx.showToast({ title: '最高价须大于最低价', icon: 'none' })
    }
    if (field === 'searchMinPrice' && searchMinPrice && searchMaxPrice && min >= max) {
      wx.showToast({ title: '最低价须小于最高价', icon: 'none' })
    }
  },

  loadActivities(reset, ignoreSearch) {
    if (this.data.activityLoading) return
    const page = reset ? 1 : this.data.activityPage
    if (!reset && this.data.activityList.length >= this.data.activityTotal && this.data.activityTotal > 0) return

    this.setData({ activityLoading: true })

    const params = { pageNum: page, pageSize: 10, status: 1 }
    if (!ignoreSearch) {
      if (this.data.searchTitle)     params.title = this.data.searchTitle
      if (this.data.searchLocation)  params.location = this.data.searchLocation
      if (this.data.searchDateStart) params.startDate = this.data.searchDateStart
      if (this.data.searchDateEnd)   params.endDate = this.data.searchDateEnd
      if (this.data.searchType)      params.activityType = this.data.searchType
      if (this.data.searchMinPrice)  params.minPrice = parseFloat(this.data.searchMinPrice)
      if (this.data.searchMaxPrice)  params.maxPrice = parseFloat(this.data.searchMaxPrice)
    }

    themeApi.request({ url: '/activity/list', data: params }).then(res => {
      if (res && res.code === 200 && res.data) {
        const list = (res.data.records || []).map(item => ({
          id: item.id,
          activityNo: item.activityNo || '',
          activityType: item.activityType || '',
          title: item.title || '',
          location: item.location || '',
          activityDateStart: (item.activityDateStart || '').slice(0, 16),
          activityDateEnd: (item.activityDateEnd || '').slice(0, 16),
          signupDeadline: (item.signupDeadline || '').slice(0, 16),
          priceMale: item.priceMale || 0,
          priceFemale: item.priceFemale || 0,
          currentCount: item.currentCount || 0,
          maxCount: item.maxCount || 0,
          coverImg: item.coverImg || '',
          description: item.description || ''
        }))
        this.setData({
          activityList: reset ? list : this.data.activityList.concat(list),
          activityPage: page + 1,
          activityTotal: res.data.total || 0
        })
      } else if (reset) {
        this.setData({ activityList: [], activityTotal: 0 })
      }
    }).catch(() => {
      wx.showToast({ title: '加载失败，请重试', icon: 'none' })
    }).finally(() => {
      this.setData({ activityLoading: false })
      wx.nextTick(() => this.updateHeaderHeight())
      if (reset) {
        wx.stopPullDownRefresh()
        const count = this.data.activityList.length
        wx.showToast({ title: count > 0 ? `共找到 ${this.data.activityTotal} 条` : '暂无相关活动', icon: 'none', duration: 1500 })
      }
    })
  },

  onReachBottom() {
    if (!this.data.showForm) this.loadActivities(false)
  },

  onPullDownRefresh() {
    if (!this.data.showForm) this.loadActivities(true)
    else wx.stopPullDownRefresh()
  },

  // 报名表单方法
  onInput(e) {
    this.setData({ [e.currentTarget.dataset.field]: e.detail.value })
  },

  onEducationChange(e) {
    const index = parseInt(e.detail.value)
    const educationList = ['初中', '高中', '大专', '本科', '硕士', '博士']
    this.setData({ educationIndex: index, education: educationList[index] })
  },

  onGenderChange(e) {
    const gender = parseInt(e.detail.value) + 1
    const price = gender === 1 ? this.data.priceMale : this.data.priceFemale
    this.setData({ signupGender: gender, activityPrice: price })
    this.fetchNextNo(this.data.activityNo || this.data.activityId, gender)
  },

  onMaritalChange(e) {
    this.setData({ maritalStatus: parseInt(e.detail.value) + 1 })
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

  previewFront() {
    wx.previewImage({ urls: [this.data.idCardFrontImg], current: this.data.idCardFrontImg })
  },

  previewBack() {
    wx.previewImage({ urls: [this.data.idCardBackImg], current: this.data.idCardBackImg })
  },

  deleteIdCardFront() { this.setData({ idCardFrontImg: '' }) },
  deleteIdCardBack()  { this.setData({ idCardBackImg: '' }) },
  previewAvatar()     { wx.previewImage({ urls: [this.data.avatarPhoto], current: this.data.avatarPhoto }) },
  deleteAvatar()      { this.setData({ avatarPhoto: '' }) },

  goDetail() {
    const { activityNo } = this.data
    if (!activityNo) return
    wx.navigateTo({ url: `../detail/detail?activityNo=${encodeURIComponent(activityNo)}` })
  },

  onToPay() {
    wx.navigateTo({
      url: '../pay/pay'
    })
  },

  fetchLatestIntro() {
    themeApi.request({ url: '/signup/my/latestIntro', method: 'GET' }).then(res => {
      if (res && res.code === 200 && res.data && res.data.selfIntro) {
        this.setData({ selfIntro: res.data.selfIntro })
      } else {
        wx.showToast({ title: '暂无历史简介', icon: 'none' })
      }
    }).catch(() => {
      wx.showToast({ title: '获取失败，请重试', icon: 'none' })
    })
  },

  onSubmit() {
    const d = this.data
    const isTravel = String(d.activityType) === '2'
    if (!d.agreed)       return wx.showToast({ title: '请先同意活动协议', icon: 'none' })
    if (!d.activityId)   return wx.showToast({ title: '请先选择活动', icon: 'none' })
    if (!d.signupName.trim())   return wx.showToast({ title: '请输入姓名', icon: 'none' })
    if (!d.signupPhone)  return wx.showToast({ title: '请输入手机号', icon: 'none' })
    if (!/^1\d{10}$/.test(d.signupPhone)) return wx.showToast({ title: '手机号格式不正确', icon: 'none' })
    if (!d.signupAge)    return wx.showToast({ title: '请输入年龄', icon: 'none' })
    if (isNaN(parseInt(d.signupAge))) return wx.showToast({ title: '年龄须为数字', icon: 'none' })
    const age = parseInt(d.signupAge)
    if (age < 18 || age > 99) return wx.showToast({ title: '年龄须在18-99岁之间', icon: 'none' })
    if (isTravel) {
      if (!d.idCardNo) return wx.showToast({ title: '请输入身份证号', icon: 'none' })
      if (!/^\d{17}[\dXx]$/.test(d.idCardNo)) return wx.showToast({ title: '身份证号格式不正确', icon: 'none' })
      if (!d.idCardFrontImg) return wx.showToast({ title: '请上传身份证正面', icon: 'none' })
      if (!d.idCardBackImg)  return wx.showToast({ title: '请上传身份证反面', icon: 'none' })
    }

    wx.showLoading({ title: '提交中...' })

    themeApi.request({
      url: '/signup/add',
      method: 'POST',
      data: {
        activityId:     d.activityNo,
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
        talent:         d.talent,
        nickname:       d.nickname || null,
        maritalStatus:  d.maritalStatus || null,
        remark:         d.remark || null,
        unionId:        themeApi.getOpenId() || null
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
