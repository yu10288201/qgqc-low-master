const themeApi = require('../../../mall/pages/themedating/themeApi')

Page({
  data: {
    activityList: [],
    activityIndex: 0,
    tableList: [],
    showReplyModal: false,
    replyIndex: -1,
    replyMessage: '',
    showDetailModal: false,
    detailItem: {},
    selectedIndex: -1,
    showGuideModal: false,
    myNo: '',
    myNickname: ''
  },

  onLoad() {
    themeApi.login().catch(() => {})
    this.loadActivityList()
    // this._useMock()
  },

  onShow() {
    this._startPolling()
  },

  onHide() {
    this._stopPolling()
  },

  onUnload() {
    this._stopPolling()
  },

  _playNotify() {
    wx.vibrateShort({ type: 'heavy' })
    const audio = wx.createInnerAudioContext()
    audio.src = '/audio/sound.mp3'
    audio.play()
  },

  _checkNotify(newList) {
    const oldList = this.data.tableList
    if (!oldList.length) return
    const oldMap = {}
    oldList.forEach(r => { oldMap[r.no] = r })
    newList.forEach(r => {
      const old = oldMap[r.no]
      if (!old) return
      // 新增被邀请
      if (!old.invitedSelected && r.invitedSelected) {
        wx.showToast({ title: `${r.name} 邀请了你！`, icon: 'none', duration: 3000 })
        this._playNotify()
      }
      // 对方回复了我的邀请
      if (!old.hisReplyStatus && r.hisReplyStatus) {
        wx.showToast({ title: `${r.name} 回复了你！`, icon: 'none', duration: 3000 })
        this._playNotify()
      }
    })
  },

  _startPolling() {
    this._stopPolling()
    this._pollTimer = setInterval(() => {
      const { activityList, activityIndex } = this.data
      if (activityList.length === 0) return
      const activity = activityList[activityIndex]
      this.loadTableList(activity.activityId, activity.myActivityNo)
    }, 5000)
  },

  _stopPolling() {
    if (this._pollTimer) {
      clearInterval(this._pollTimer)
      this._pollTimer = null
    }
  },

  onPullDownRefresh() {
    const { activityList, activityIndex } = this.data
    if (activityList.length === 0) {
      this.loadActivityList()
      wx.stopPullDownRefresh()
      return
    }
    const activity = activityList[activityIndex]
    this.loadTableList(activity.activityId, activity.myActivityNo)
    wx.showToast({ title: '已刷新', icon: 'none', duration: 1000 })
    wx.stopPullDownRefresh()
  },

  _useMock() {
    this.setData({
      activityList: [
        { activityId: 'K001', title: 'KTV主题交友活动 K001', myActivityNo: '01' },
        { activityId: 'T001', title: '旅游主题交友活动 T001', myActivityNo: '02' }
      ],
      activityIndex: 0,
      tableList: [
        { no: '01', name: '张三（我）', age: 25, gender: 1, isSelf: true,  inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '02', name: '李四',       age: 28, gender: 1, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '03', name: '王五',       age: 26, gender: 2, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '04', name: '赵六',       age: 30, gender: 1, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '05', name: '陈七',       age: 27, gender: 2, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '06', name: '刘八',       age: 24, gender: 1, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '07', name: '周九',       age: 29, gender: 2, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '08', name: '吴十',       age: 31, gender: 1, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '09', name: '郑十一',     age: 23, gender: 2, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '10', name: '孙十二',     age: 32, gender: 1, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '11', name: '冯十三',     age: 26, gender: 2, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '12', name: '蒋十四',     age: 28, gender: 1, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '13', name: '沈十五',     age: 25, gender: 2, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '14', name: '韩十六',     age: 30, gender: 1, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '15', name: '杨十七',     age: 27, gender: 2, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '16', name: '林十八',     age: 24, gender: 1, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '17', name: '何十九',     age: 29, gender: 2, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '18', name: '罗二十',     age: 31, gender: 1, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '19', name: '梁二一',     age: 23, gender: 2, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
        { no: '20', name: '宋二二',     age: 32, gender: 1, isSelf: false, inviteSelected: false, invitedSelected: false, replySelected: false, myReplyStatus: null, knock: '', hisKnockContent: '', reply: '', myReplyContent: '', occupation: '', education: '', talent: '', selfIntro: '' },
      ]
    })
    wx.showToast({ title: '模拟：初始状态', icon: 'none', duration: 1500 })

    // 10秒后：02号邀请了我
    setTimeout(() => {
      const tableList = this.data.tableList.map((r, i) => {
        if (i === 1) return Object.assign({}, r, { invitedSelected: true, replySelected: true, hisKnockContent: '你好，很高兴认识你，希望活动当天能一起玩！' })
        return r
      })
      this._checkNotify(tableList)
      this.setData({ tableList })
    }, 10000)

    // 20秒后：04号邀请了我（用来测回复接受/拒绝场景）
    setTimeout(() => {
      const tableList = this.data.tableList.map((r, i) => {
        if (i === 3) return Object.assign({}, r, { invitedSelected: true, replySelected: true, hisKnockContent: '嘿！看起来我们有很多共同点，期待认识你！' })
        return r
      })
      this._checkNotify(tableList)
      this.setData({ tableList })
    }, 20000)

    // 30秒后：我邀请的02号回复了我
    setTimeout(() => {
      const tableList = this.data.tableList.map((r, i) => {
        if (i === 1) return Object.assign({}, r, { inviteSelected: true, hisReplyStatus: 1, reply: '期待和你认识！' })
        return r
      })
      this._checkNotify(tableList)
      this.setData({ tableList })
    }, 3000)
  },

  loadActivityList() {
    themeApi.request({ url: '/signup/my/orders', data: { pageNum: 1, pageSize: 100 } }).then(res => {
      if (!res || res.code !== 200 || !res.data) return
      const seen = new Set()
      const activityList = (res.data.records || [])
        .filter(r => r.signupStatus === 1)
        .filter(r => {
          if (seen.has(r.activityId)) return false
          seen.add(r.activityId)
          return true
        })
        .map(r => ({ activityId: r.activityId, title: r.title || r.activityId, myActivityNo: r.activityNo || '' }))
      this.setData({ activityList, activityIndex: 0, tableList: [] })
      if (activityList.length > 0) {
        this.loadTableList(activityList[0].activityId, activityList[0].myActivityNo)
      }
    }).catch(() => {
      wx.showToast({ title: '获取活动列表失败', icon: 'none' })
    })
  },

  loadTableList(activityId, myActivityNo) {
    themeApi.request({ url: '/match/list', data: { activityId } }).then(res => {
      if (!res || res.code !== 200 || !res.data) return
      const records = Array.isArray(res.data) ? res.data : (res.data.records || [])
      if (records.length > 0 && records[0].activityEnded) {
        console.log('[activityPage] 活动已结束，停止轮询')
        this._stopPolling()
      }
      const tableList = records.map(r => {
        const formatTime = t => {
          if (!t) return ''
          const d = new Date(t)
          d.setHours(d.getHours() + 8)
          return d.toISOString().replace('T', ' ').slice(0, 19)
        }
        return {
          no: r.activityNo || '—',
          name: r.nickname || r.signupName || '—',
          signupName: r.signupName || '—',
          age: r.signupAge || '—',
          gender: r.signupGender || 0,
          occupation: r.occupation || '',
          education: r.education || '',
          talent: r.talent || '',
          selfIntro: r.selfIntro || '',
          isSelf: myActivityNo && r.activityNo === myActivityNo,
          inviteSelected: !!r.iinvited,
          invitedSelected: !!r.heInvitedMe,
          replySelected: !!r.heInvitedMe || !!(r.hisReplyStatus),
          myReplyStatus: r.myReplyStatus || null,
          hisReplyStatus: r.hisReplyStatus || null,
          knock: r.myKnockContent || '',
          hisKnockContent: r.hisKnockContent || '',
          reply: r.hisReplyContent || '',
          myReplyContent: r.myReplyContent || '',
          myInviteTime: formatTime(r.myInviteTime),
          hisInviteTime: formatTime(r.hisInviteTime),
          myReplyTime: formatTime(r.myReplyTime),
          hisReplyTime: formatTime(r.hisReplyTime)
        }
      })
      this._checkNotify(tableList)
      this.setData({ tableList })
      const selfItem = tableList.find(r => r.isSelf)
      if (selfItem) this.setData({ myNo: selfItem.no, myNickname: selfItem.name })
    }).catch(() => {
      wx.showToast({ title: '获取名单失败', icon: 'none' })
    })
  },

  onActivityChange(e) {
    const index = parseInt(e.detail.value)
    this.setData({ activityIndex: index, tableList: [], selectedIndex: -1 })
    const activity = this.data.activityList[index]
    if (activity) this.loadTableList(activity.activityId, activity.myActivityNo)
  },

  onReplyInvite(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.tableList[index]
    if (item.isSelf) {
      wx.showToast({ title: '不能操作自己', icon: 'none' })
      return
    }
    if (!item.inviteSelected) {
      wx.showToast({ title: '你尚未邀请对方', icon: 'none' })
      return
    }
    this._openDetailWithMode(index, 'view_invite')
  },

  onInvite(e) {
    const index = e.currentTarget.dataset.index
    const tableList = this.data.tableList
    if (tableList[index].isSelf) {
      wx.showToast({ title: '不能邀请自己', icon: 'none' })
      return
    }
    // 已邀请过，直接打开详情看对方回应
    if (tableList[index].inviteSelected) {
      this.setData({
        showDetailModal: true,
        detailItem: Object.assign({}, tableList[index], { detailMode: 'invite' })
      })
      return
    }
    // 未邀请，打开详情弹窗填写敲门内容
    this.setData({
      showDetailModal: true,
      detailItem: Object.assign({}, tableList[index], { detailMode: 'invite', knock: '' })
    })
  },

  onInvited(e) {
    const index = e.currentTarget.dataset.index
    const tableList = this.data.tableList
    if (tableList[index].isSelf) {
      wx.showToast({ title: '不能操作自己', icon: 'none' })
      return
    }
    if (!tableList[index].invitedSelected) {
      wx.showToast({ title: '对方还未邀请你', icon: 'none' })
      return
    }
    // 打开详情弹窗，显示对方敲门内容和我的回应
    this.setData({
      showDetailModal: true,
      detailItem: Object.assign({}, tableList[index], { detailMode: 'invited' })
    })
  },

  onReply(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.tableList[index]
    if (item.isSelf) {
      wx.showToast({ title: '不能操作自己', icon: 'none' })
      return
    }
    // 对方邀请了我
    if (item.invitedSelected) {
      // 已回复 → 查看详情（只显示对方敲门+我的回复）
      if (item.myReplyStatus !== null && item.myReplyStatus !== undefined) {
        this._openDetailWithMode(index, 'view_invited')
        return
      }
      // 未回复 → 弹回复弹窗
      this.setData({ showReplyModal: true, replyIndex: index, replyMessage: '' })
      return
    }
    wx.showToast({ title: '对方未邀请你', icon: 'none' })
  },

  onCloseReply() {
    this.setData({ showReplyModal: false, replyIndex: -1, replyMessage: '' })
  },

  onReplyMessageInput(e) {
    this.setData({ replyMessage: e.detail.value })
  },

  stopPropagation() {},

  _submitReply(replyStatus) {
    const { replyIndex, tableList, replyMessage } = this.data
    const activityId = this.data.activityList[this.data.activityIndex].activityId
    const fromNo = tableList[replyIndex].no
    wx.showLoading({ title: '提交中...' })
    themeApi.request({
      url: '/match/reply',
      method: 'POST',
      data: { activityId, fromNo, replyStatus, replyContent: replyMessage || '' }
    }).then(res => {
      wx.hideLoading()
      if (res && res.code === 200) {
        wx.showToast({ title: replyStatus === 1 ? '已接受' : '已拒绝', icon: 'success' })
        this.setData({ showReplyModal: false, replyIndex: -1, replyMessage: '' })
        const activity = this.data.activityList[this.data.activityIndex]
        this.loadTableList(activity.activityId, activity.myActivityNo)
      } else {
        wx.showToast({ title: (res && res.msg) || '提交失败', icon: 'none' })
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '网络异常', icon: 'none' })
    })
  },

  onAccept() { this._submitReply(1) },
  onReject()  { this._submitReply(2) },

  onSelectRow(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    this.setData({ selectedIndex: index })
  },

  _openDetail(index) {
    const item = this.data.tableList[index]
    this.setData({
      showDetailModal: true,
      detailItem: Object.assign({}, item, { detailMode: 'view_all' })
    })
  },

  _openDetailWithMode(index, mode) {
    const item = this.data.tableList[index]
    this.setData({
      showDetailModal: true,
      detailItem: Object.assign({}, item, { detailMode: mode })
    })
  },

  onDetail() {
    const { selectedIndex } = this.data
    if (selectedIndex === -1) {
      wx.showToast({ title: '请先选择一行', icon: 'none' })
      return
    }
    this._openDetail(selectedIndex)
  },

  onCloseDetail() {
    this.setData({ showDetailModal: false })
  },

  onShowGuide() {
    this.setData({ showGuideModal: true })
  },

  onCloseGuide() {
    this.setData({ showGuideModal: false })
  },

  onDetailInput(e) {
    const detailItem = this.data.detailItem
    detailItem.knock = e.detail.value
    this.setData({ detailItem })
  },

  onSend() {
    const { detailItem } = this.data
    const activityId = this.data.activityList[this.data.activityIndex].activityId
    wx.showLoading({ title: '发送中...' })
    themeApi.request({
      url: '/match/invite',
      method: 'POST',
      data: { activityId, toNo: detailItem.no, knockContent: detailItem.knock || '' }
    }).then(res => {
      wx.hideLoading()
      if (res && res.code === 200) {
        wx.showToast({ title: '邀请已发送', icon: 'success' })
        this.setData({ showDetailModal: false })
        const activity = this.data.activityList[this.data.activityIndex]
        this.loadTableList(activity.activityId, activity.myActivityNo)
      } else {
        wx.showToast({ title: (res && res.msg) || '发送失败', icon: 'none' })
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '网络异常', icon: 'none' })
    })
  },

  onReplyContentInput(e) {
    this.setData({ 'detailItem.myReplyContent': e.detail.value })
  },

  onRejectInvite() {
    const { detailItem } = this.data
    const activityId = this.data.activityList[this.data.activityIndex].activityId
    const replyStatus = detailItem.myReplyStatus === 2 ? 1 : 2
    wx.showLoading({ title: '提交中...' })
    themeApi.request({
      url: '/match/reply',
      method: 'POST',
      data: { activityId, fromNo: detailItem.no, replyStatus, replyContent: detailItem.myReplyContent || '' }
    }).then(res => {
      wx.hideLoading()
      if (res && res.code === 200) {
        wx.showToast({ title: replyStatus === 2 ? '已拒绝' : '已接受', icon: 'success' })
        this.setData({ showDetailModal: false })
        const activity = this.data.activityList[this.data.activityIndex]
        this.loadTableList(activity.activityId, activity.myActivityNo)
      } else {
        wx.showToast({ title: (res && res.msg) || '提交失败', icon: 'none' })
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '网络异常', icon: 'none' })
    })
  },

  onEditReply() {
    const { detailItem } = this.data
    const activityId = this.data.activityList[this.data.activityIndex].activityId
    wx.showLoading({ title: '修改中...' })
    themeApi.request({
      url: '/match/updateReply',
      method: 'POST',
      data: { activityId, fromNo: detailItem.no, replyContent: detailItem.myReplyContent || '' }
    }).then(res => {
      wx.hideLoading()
      if (res && res.code === 200) {
        wx.showToast({ title: '回复语已修改', icon: 'success' })
        this.setData({ showDetailModal: false })
        const activity = this.data.activityList[this.data.activityIndex]
        this.loadTableList(activity.activityId, activity.myActivityNo)
      } else {
        wx.showToast({ title: (res && res.msg) || '修改失败', icon: 'none' })
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '网络异常', icon: 'none' })
    })
  },

  onCancelInvite() {
    const { detailItem } = this.data
    const activityId = this.data.activityList[this.data.activityIndex].activityId
    wx.showLoading({ title: '取消中...' })
    themeApi.request({
      url: '/match/cancelInvite',
      method: 'POST',
      data: { activityId, toNo: detailItem.no }
    }).then(res => {
      wx.hideLoading()
      if (res && res.code === 200) {
        wx.showToast({ title: '已取消邀请', icon: 'success' })
        this.setData({ showDetailModal: false })
        const activity = this.data.activityList[this.data.activityIndex]
        this.loadTableList(activity.activityId, activity.myActivityNo)
      } else {
        wx.showToast({ title: (res && res.msg) || '取消失败', icon: 'none' })
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '网络异常', icon: 'none' })
    })
  },

  onEditKnock() {
    const { detailItem } = this.data
    const activityId = this.data.activityList[this.data.activityIndex].activityId
    wx.showLoading({ title: '修改中...' })
    themeApi.request({
      url: '/match/updateKnock',
      method: 'POST',
      data: { activityId, toNo: detailItem.no, knockContent: detailItem.knock || '' }
    }).then(res => {
      wx.hideLoading()
      if (res && res.code === 200) {
        wx.showToast({ title: '敲门语已修改', icon: 'success' })
        this.setData({ showDetailModal: false })
        const activity = this.data.activityList[this.data.activityIndex]
        this.loadTableList(activity.activityId, activity.myActivityNo)
      } else {
        wx.showToast({ title: (res && res.msg) || '修改失败', icon: 'none' })
      }
    }).catch(() => {
      wx.hideLoading()
      wx.showToast({ title: '网络异常', icon: 'none' })
    })
  },

  onChat() {
    wx.navigateTo({ url: '/pages/module_others/pages/chatWithCust/chatWithCust' })
  }
})

/* 原代码备份
const app = getApp()
Page({
    data: {
        customerInf: '',
        comboList:'',
        showChoose: false,
    },
    onShow: function(){
        let  that = this
        that.setData({
            showChoose: false,
        })
        wx.request({
            url: app.globalData.selectCustomerInfByOpenId_url,
            method: 'POST',
            data: {
              openid: app.globalData.openid
            },
            success: res => {
                this.setData({
                    customerInf: res.data
                })
                wx.request({
                    url: app.globalData.getComboListByCustomerId,
                    data: {
                        customerId: that.data.customerInf.id,
                    },
                    success: res => {
                        console.log(res)
                        this.setData({
                            comboList:res.data.paramsList
                        })
                    }
                })
            }
        })
    },
    onLoad: function (options) {},
    chooseDinnerTime: function(){
        if (this.data.comboList.length == 0) {
            wx.showModal({
              content: '您还未购买套餐!',
              showCancel: false
            })
        }else{
            this.setData({ showChoose: true })
        }
    },
    toLoveSet: function(){
        wx.navigateTo({ url: '../loveSet/loveSet' })
    },
    closeChooseDinnerTime: function(){
        this.setData({ showChoose: false })
    },
    goChooseLove: function (e) {
        wx.navigateTo({
            url: '../chooseLove/chooseLove?customerInf=' + JSON.stringify(this.data.customerInf) + '&comboList=' + JSON.stringify(this.data.comboList[e.currentTarget.dataset.id]),
        })
    },
})
*/
