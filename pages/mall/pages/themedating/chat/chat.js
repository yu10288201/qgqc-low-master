const app = getApp()

const GROUP_MESSAGES = [
  { id: 1, openId: 'other1', nickname: '小美', avatar: '', content: '大家好，期待周末的活动！', isSelf: false },
  { id: 2, openId: 'other2', nickname: '阿强', avatar: '', content: '我也报名了，有没有一起拼车的？', isSelf: false },
  { id: 3, openId: 'self', nickname: '我', avatar: '', content: '我可以，我在三里屯附近', isSelf: true },
  { id: 4, openId: 'other1', nickname: '小美', avatar: '', content: '太好了！我们可以提前加个微信', isSelf: false }
]

const PRIVATE_MESSAGES = {
  other1: [
    { id: 101, openId: 'other1', nickname: '小美', avatar: '', content: '我们可以提前加个微信', isSelf: false },
    { id: 102, openId: 'self', nickname: '我', avatar: '', content: '可以呀', isSelf: true }
  ],
  other2: [
    { id: 201, openId: 'other2', nickname: '阿强', avatar: '', content: '有没有一起拼车的？', isSelf: false },
    { id: 202, openId: 'self', nickname: '我', avatar: '', content: '我在三里屯附近', isSelf: true }
  ]
}

Page({
  data: {
    mode: 'list',
    activityId: '',
    inputVal: '',
    scrollToId: '',
    currentSessionId: '',
    currentSession: {},
    currentMessages: [],
    sessionList: [
      {
        id: 'group',
        type: 'group',
        name: '周末美食探店群',
        avatar: '',
        lastMsg: '小美：太好了！我们可以提前加个微信',
        lastTime: '14:32',
        unread: 3
      },
      {
        id: 'other1',
        type: 'private',
        name: '小美',
        avatar: '',
        lastMsg: '我们可以提前加个微信',
        lastTime: '14:30',
        unread: 2
      },
      {
        id: 'other2',
        type: 'private',
        name: '阿强',
        avatar: '',
        lastMsg: '有没有一起拼车的？',
        lastTime: '昨天',
        unread: 0
      }
    ],
    messageMap: {
      group: GROUP_MESSAGES,
      other1: PRIVATE_MESSAGES.other1,
      other2: PRIVATE_MESSAGES.other2
    }
  },

  onLoad(options) {
    this.setData({
      activityId: options.activityId || ''
    })
  },

  openSession(e) {
    const id = e.currentTarget.dataset.id
    const currentSession = this.data.sessionList.find(item => item.id === id) || {}
    const currentMessages = this.data.messageMap[id] || []

    const sessionList = this.data.sessionList.map(item => {
      if (item.id === id) {
        return Object.assign({}, item, { unread: 0 })
      }
      return item
    })

    this.setData({
      mode: 'chat',
      currentSessionId: id,
      currentSession,
      currentMessages,
      sessionList,
      inputVal: ''
    })

    this.scrollToBottom()
  },

  backToList() {
    this.setData({
      mode: 'list',
      currentSessionId: '',
      currentSession: {},
      currentMessages: [],
      inputVal: ''
    })
  },

  onInput(e) {
    this.setData({
      inputVal: e.detail.value
    })
  },

  onSend() {
    const content = this.data.inputVal.trim()
    if (!content) return

    const id = this.data.currentSessionId
    const newMsg = {
      id: Date.now(),
      openId: 'self',
      nickname: '我',
      avatar: '',
      content,
      isSelf: true
    }

    const currentMessages = this.data.currentMessages.concat(newMsg)
    const messageMap = Object.assign({}, this.data.messageMap, {
      [id]: currentMessages
    })

    const sessionList = this.data.sessionList.map(item => {
      if (item.id === id) {
        return Object.assign({}, item, {
          lastMsg: content,
          lastTime: '刚刚'
        })
      }
      return item
    })

    this.setData({
      currentMessages,
      messageMap,
      sessionList,
      inputVal: ''
    })

    this.scrollToBottom()
  },

  chooseImage() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      success: () => {
        this.sendSpecialMessage('[图片]')
      }
    })
  },

  sendSpecialMessage(content) {
    const id = this.data.currentSessionId
    const newMsg = {
      id: Date.now(),
      openId: 'self',
      nickname: '我',
      avatar: '',
      content,
      isSelf: true
    }

    const currentMessages = this.data.currentMessages.concat(newMsg)
    const messageMap = Object.assign({}, this.data.messageMap, {
      [id]: currentMessages
    })

    this.setData({
      currentMessages,
      messageMap
    })

    this.scrollToBottom()
  },

  scrollToBottom() {
    const msgs = this.data.currentMessages
    if (msgs.length > 0) {
      setTimeout(() => {
        this.setData({
          scrollToId: `msg_${msgs[msgs.length - 1].id}`
        })
      }, 50)
    }
  }
})
