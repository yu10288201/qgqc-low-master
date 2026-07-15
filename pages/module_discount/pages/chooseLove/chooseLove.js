// pages/module_discount/pages/chooseLove/chooseLove.js
const app = getApp()
const util = require('../../../../utils/util')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    needChooseList: [],
    needChoose: [],
    needChooseIndex: -1,
    ChooseList: [],
    customerInf: ''
  },
  onShow: function () {
    let that = this
    if (that.data.customerInf != '') {
      wx.request({
        // url: 'http://192.168.8.5:8088/evaluation/getChoiceList',
        url: app.globalData.getChoiceList,
        data: {
          customerId: that.data.customerInf.id,
        },
        method: 'GET',
        success: res => {
          console.log(res)
          this.setData({
            needChooseList: res.data.params.meList,
            ChooseList: res.data.params.otherList
          })
        }
      })
    }
  },

  onLoad: function (options) {
    let that = this
    this.setData({
      customerInf: JSON.parse(options.customerInf),
      comboList: JSON.parse(options.comboList),
    }, () => {
      if (!that.data.comboList.distribute_num) {
        wx.showModal({
          title: '提示',
          content: '您尚未被分配编号，请等待',
          showCancel: false,
        })
      }
      wx.request({
        // url: 'http://localhost:8088/evaluation/selectApplyComboByCustomerId',
        url: app.globalData.selectApplyComboByCustomerId,
        data: {
          setMealID: that.data.comboList.setMealID,
          customerId: that.data.customerInf.id,
          dinnerTime: that.data.comboList.dinner_time
        },
        method: 'GET',
        success: res => {
          console.log(res)
          let a = res.data.paramsList
          let b = []
          for (let c of a) {
            if (c.distribute_num) {
              b.push(c)
            }
          }
          that.setData({
            needChoose: b
          })
        }
      })
      wx.request({
        // url: 'http://192.168.8.5:8088/evaluation/getChoiceList',
        url: app.globalData.getChoiceList,
        data: {
          customerId: that.data.customerInf.id,
        },
        method: 'GET',
        success: res => {
          console.log(res)
          this.setData({
            needChooseList: res.data.params.meList
          })
        }
      })
    })
  },
  bindPickerChange: function (e) {
    this.setData({
      needChooseIndex: e.detail.value
    })
  },
  radioChange: function (e) {
    let that = this
    console.log(e)
    // e.target.dataset.type
    // e.target.dataset.id
    wx.showModal({
      content: '确定要' + (e.target.dataset.type == 'confirm' ? '同意' : '不同意') + '该申请?',
      success: res => {
        if (res.confirm) {
          wx.request({
            // url: 'http://192.168.8.5:8088/evaluation/agreeOrRefuse',
            url: app.globalData.agreeOrRefuse,
            data: {
              agreeStatus: e.target.dataset.type == 'confirm' ? 1 : 2,
              uid: that.data.ChooseList[e.target.dataset.id].uid
            },
            success: res => {
              if (res.data.code == 1) {
                wx.showToast({
                  title: e.target.dataset.type == 'confirm' ? '同意' : '不同意' + '成功!',
                  duration: 1500,
                  success: res => {
                    that.onShow()
                  }
                })
              }
            }
          })
        }
      }
    })
  },
  meEnd: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.id)
    wx.showModal({
      content: '确定要' + '结束' + '吗?',
      success: res => {
        if (res.confirm) {
          wx.request({
            // url: 'http://192.168.8.5:8088/evaluation/beEnd',
            url: app.globalData.beEnd,
            data: {
              index: 1,
              meUid: that.data.needChooseList[e.currentTarget.dataset.id].apply_combo_me_uid,
              uid: that.data.needChooseList[e.currentTarget.dataset.id].uid
            },
            success: res => {
              console.log(res)
              that.onShow()
            }
          })
        }
      }
    })
  },
  beEnd: function (e) {
    let that = this
    console.log(e.currentTarget.dataset.id)
    wx.showModal({
      content: '确定要' + '结束' + '吗?',
      success: res => {
        if (res.confirm) {
          wx.request({
            // url: 'http://192.168.8.5:8088/evaluation/beEnd',
            url: app.globalData.beEnd,
            data: {
              index: 2,
              otherUid: that.data.needChooseList[e.currentTarget.dataset.id].apply_combo_other_uid,
              uid: that.data.ChooseList[e.currentTarget.dataset.id].uid
            },
            success: res => {
              console.log(res)
              that.onShow()
            }
          })
        }
      }
    })
  },
  needChooseConfirm: function (e) {
    let that = this
    let needChooseIndex = this.data.needChooseIndex
    let needChoose = this.data.needChoose
    let a = needChoose[needChooseIndex]
    if (!that.data.comboList.distribute_num) {
      wx.showToast({
        title: '请等待分配编号',
      })
      return;
    }
    wx.request({
      // url: 'http://192.168.8.5:8088/evaluation/addChoose',
      url: app.globalData.addChoose,
      data: {
        apply_combo_other_uid: a.uid,
        apply_combo_me_uid: that.data.comboList.uid,
        customer_other_id: a.customer_id,
        customer_me_id: that.data.customerInf.id,
        me_num: that.data.comboList.distribute_num,
        other_num: a.distribute_num,
        setMealID: a.setMealID,
        dinner_time: util.formatTime3(a.dinner_time, 'Y-M-D'),
      },
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: res => {
        console.log(res)
        if (res.data.code == 1) {
          wx.request({
            // url: 'http://192.168.8.5:8088/evaluation/getChoiceList',
            url: app.globalData.getChoiceList,
            data: {
              customerId: that.data.customerInf.id,
            },
            method: 'GET',
            success: res => {
              console.log(res)
              this.setData({
                needChooseList: res.data.params.meList,
                needChooseIndex: -1,
              })
              wx.showToast({
                title: '已发送申请~',
              })
            }
          })
        } else if (res.data.code == 4) {
          wx.showToast({
            title: '已发送申请~',
          })
        } else if (res.data.code == 2) {
          wx.showToast({
            title: '对方正在谈话中',
          })
        } else if (res.data.code == 3) {
          wx.showToast({
            title: '数量超出，请等待',
          })
        }
      }
    })
  }
})