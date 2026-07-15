const themeApi = require('../themeApi')

Page({
  data: {
    titleKeyword: '',
    dateStart: '',
    dateEnd: '',
    hasFilter: false,
    orderList: [],
    page: 1,
    total: 0,
    loading: false,
    refundModal: false,
    refundReason: '',
    refundOrderId: ''
  },

  onLoad() {
    themeApi.login().catch(() => {})
    this.loadOrders(true)
  },

  onShow() {
    if (this.data.orderList.length > 0) {
      this.loadOrders(true)
    }
  },

  onPullDownRefresh() {
    this.loadOrders(true)
  },

  onReachBottom() {
    const { orderList, total } = this.data
    if (orderList.length < total) {
      this.loadOrders(false)
    }
  },

  onSearchInput(e) {
    const val = e.detail.value
    this.setData({
      [e.currentTarget.dataset.field]: val,
      hasFilter: !!(val || this.data.dateStart || this.data.dateEnd)
    })
  },

  onDateStartChange(e) {
    const val = e.detail.value
    const { dateEnd } = this.data
    if (dateEnd && val > dateEnd) {
      wx.showToast({ title: '开始日期不能晚于结束日期', icon: 'none' })
      return
    }
    this.setData({ dateStart: val, hasFilter: !!(val || this.data.titleKeyword || dateEnd) })
  },

  onDateEndChange(e) {
    const val = e.detail.value
    const { dateStart } = this.data
    if (dateStart && val < dateStart) {
      wx.showToast({ title: '结束日期不能早于开始日期', icon: 'none' })
      return
    }
    this.setData({ dateEnd: val, hasFilter: !!(val || this.data.titleKeyword || dateStart) })
  },

  onClear() {
    if (!this.data.hasFilter) return
    this.setData({ titleKeyword: '', dateStart: '', dateEnd: '', hasFilter: false })
    this.loadOrders(true)
  },

  onSearch() {
    this.loadOrders(true)
  },

  loadOrders(reset) {
    if (this.data.loading) return
    const page = reset ? 1 : this.data.page
    this.setData({ loading: true })
    const { titleKeyword, dateStart, dateEnd } = this.data
    const params = { pageNum: page, pageSize: 10 }
    if (titleKeyword) params.titleKeyword = titleKeyword
    if (dateStart) params.dateStart = dateStart
    if (dateEnd) params.dateEnd = dateEnd
    themeApi.request({
      url: '/signup/my/orders',
      data: params
    }).then(res => {
      wx.stopPullDownRefresh()
      if (!res || res.code !== 200 || !res.data) {
        this.setData({ loading: false })
        return
      }
      const records = (res.data.records || []).map(item => {
        const s = item.activityDateStart ? item.activityDateStart.slice(0, 16).replace('T', ' ') : ''
        const e = item.activityDateEnd ? item.activityDateEnd.slice(0, 16).replace('T', ' ') : ''
        const ct = item.createTime ? (() => {
          const d = new Date(item.createTime.replace(' ', 'T'))
          d.setHours(d.getHours() + 8)
          return d.toISOString().replace('T', ' ').slice(0, 10)
        })() : ''
        let orderStatusText = '未知'
        if (item.refundStatus === 1) orderStatusText = '退款审核中'
        else if (item.refundStatus === 2) orderStatusText = '已退款'
        else if (item.refundStatus === 3) orderStatusText = '退款已拒绝'
        else if (item.signupStatus === 0) orderStatusText = '待确认'
        else if (item.signupStatus === 1) orderStatusText = '已确认'
        else if (item.signupStatus === 2) orderStatusText = '已取消'
        else if (item.signupStatus === 3) orderStatusText = '已退款'
        const activityTypeMap = { 1: 'KTV', 2: '旅游', 3: '美食' }
        const activityTypeText = activityTypeMap[item.activityType] || '—'
        const canEdit = item.signupStatus === 0 || item.refundStatus === 3
        const isHighlight = item.payStatus === 1 && item.signupStatus === 1
        let refundAuditTimeStr = ''
        if (item.refundAuditTime) {
          const d = new Date(item.refundAuditTime.replace(' ', 'T'))
          d.setHours(d.getHours() + 8)
          refundAuditTimeStr = d.toISOString().replace('T', ' ').slice(0, 16)
        }
        return Object.assign({}, item, {
          activityTimeStr: s ? (e ? s + ' - ' + e : s) : '—',
          createTimeStr: ct || '—',
          orderStatusText,
          activityTypeText,
          canEdit,
          isHighlight,
          refundAuditTimeStr
        })
      })
      const total = res.data.total || 0
      this.setData({
        orderList: reset ? records : this.data.orderList.concat(records),
        page: page + 1,
        total,
        loading: false
      })
      if (reset) {
        wx.showToast({ title: total > 0 ? `共 ${total} 条订单` : '暂无相关订单', icon: 'none', duration: 1500 })
      }
    }).catch(() => {
      wx.stopPullDownRefresh()
      this.setData({ loading: false })
      wx.showToast({ title: '网络异常，请重试', icon: 'none' })
    })
  },

  onPay(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `../pay/pay?orderId=${item.id}&amount=${item.priceMale}`
    })
  },

  onRefund(e) {
    const item = e.currentTarget.dataset.item
    this.setData({ refundModal: true, refundReason: '', refundOrderId: item.id })
  },

  onCloseRefund() {
    this.setData({ refundModal: false })
  },

  stopPropagation() {},

  onRefundReasonInput(e) {
    this.setData({ refundReason: e.detail.value })
  },

  onSubmitRefund() {
    const { refundReason, refundOrderId } = this.data
    if (!refundReason.trim()) {
      wx.showToast({ title: '请输入退款原因', icon: 'none' })
      return
    }
    themeApi.request({
      url: `/signup/refund/${refundOrderId}?refundReason=${encodeURIComponent(refundReason)}`,
      method: 'POST'
    }).then(res => {
      if (res && res.code === 200) {
        wx.showToast({ title: '申请已提交', icon: 'success' })
        this.setData({ refundModal: false })
        this.loadOrders(true)
      } else {
        wx.showToast({ title: res.msg || '提交失败', icon: 'none' })
      }
    }).catch(() => {
      wx.showToast({ title: '网络错误', icon: 'none' })
    })
  },

  onDetail(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `../detail/detail?activityNo=${encodeURIComponent(item.activityId || '')}`
    })
  },

  onNavigate(e) {
    const item = e.currentTarget.dataset.item
    wx.showLoading({ title: '获取位置...' })
    themeApi.request({ url: `/activity/detail/${item.activityId}` }).then(res => {
      wx.hideLoading()
      if (!res || res.code !== 200 || !res.data) {
        wx.showToast({ title: '获取活动信息失败', icon: 'none' })
        return
      }
      const { latitude, longitude, location, title } = res.data
      if (!latitude || !longitude) {
        wx.showToast({ title: '该活动暂无定位信息', icon: 'none' })
        return
      }
      wx.openLocation({
        latitude: parseFloat(latitude),
        longitude: parseFloat(longitude),
        name: title || '活动地点',
        address: location || '',
        scale: 16
      })
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '网络错误', icon: 'none' })
    })
  },

  onEdit(e) {
    const item = e.currentTarget.dataset.item
    wx.navigateTo({
      url: `../editorder/editorder?item=${encodeURIComponent(JSON.stringify(item))}&canEdit=${item.canEdit ? 1 : 0}`
    })
  }
})
