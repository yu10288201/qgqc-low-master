let app = getApp();
Page({
  data: {
    index: 1,   //新增修改   1-新增页面 否则为修改
    labelIndex: 0,   //标签
    contacts: '',  //联系人
    sex: 1, //性别  1-男  0-女
    phone: '',  //手机
    userInf: '', //用户信息
    inf: '',   //地址
    houseNum: '',  //门牌号
  },

  onLoad(options) {
    let index = options.index;
    let userInf = '';
    let inf = '';
    if (options && options.userInf) {
      userInf = JSON.parse(options.userInf);
      inf = {
        address: userInf.address,
        addressDetail: userInf.addressDetail,
        latitude: userInf.latitude,
        longitude: userInf.longitude,
      }

      this.setData({
        labelIndex: userInf.labelType,
        sex: userInf.sex,
        phone: userInf.phone,
        contacts: userInf.contacts,
        houseNum: userInf.houseNum
      })
    }

    this.setData({
      index,
      userInf,
      inf,
    })
  },

  onReady() {
    this.mapCtx = wx.createMapContext('myMap');
    this.mapCtx.setCenterOffset({
      offset: [0.5, 0.25],
      success: res => {
        console.log(res);
      }
    })
  },

  onShow() {

  },

  selectLable(e) {
    let that = this;
    that.setData({
      labelIndex: that.data.labelIndex == e.currentTarget.dataset.labelindex ? 0 : e.currentTarget.dataset.labelindex
    })
  },

  selectSex(e) {
    let that = this;
    that.setData({
      sex: e.detail.value
    })
  },

  chooseLocation() {
    let that = this;
    wx.chooseLocation({
      success: res => {
        let inf = {
          address: res.name,
          addressDetail: res.address,
          latitude: res.latitude,
          longitude: res.longitude
        }
        that.setData({
          inf
        })
      }
    })
  },

  inputHouseNum(e) {
    let that = this;

    that.setData({
      houseNum: e.detail.value
    })
  },

  inputContacts(e) {
    let that = this;

    that.setData({
      contacts: e.detail.value
    })
  },

  inputPhone(e) {
    let that = this;

    that.setData({
      phone: e.detail.value
    })
  },

  save() {
    let that = this;

    if (!that.data.inf) {
      wx.showToast({
        title: '请选择配送地址',
        icon: 'none'
      })
      return;
    } else if (!that.data.contacts) {
      wx.showToast({
        title: '请输入联系人',
        icon: 'none'
      })
      return;
    } else if (!that.data.phone) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return;
    }

    let str = /^1[3|4|5|6|7|8|9]\d{9}$/;
    if(!str.test(that.data.phone)){
      wx.showToast({
        title: '请输入正确的手机号码!',
        icon: 'none'
      })
      return;
    }

    let data = {
      address: that.data.inf.address,
      addressDetail: that.data.inf.addressDetail,
      phone: that.data.phone,
      contacts: that.data.contacts,
      sex: that.data.sex,
      houseNum: that.data.houseNum,
      labelType: that.data.labelIndex,
      customerUnionid: app.globalData.unionID,
      latitude: that.data.inf.latitude,
      longitude: that.data.inf.longitude
    }

    wx.request({
      url: app.globalData.addTicketCustomerAddress,
      method: 'POST',
      data: JSON.stringify(data),
      success: res => {
        if (res.data.code == 1) {
          wx.showToast({
            title: '保存成功',
            icon: 'success'
          })
          wx.navigateBack();
        } else {
          wx.showToast({
            title: '保存失败',
            icon: 'error'
          })
        }
      }
    })
  },

  update() {
    let that = this;

    if (!that.data.inf) {
      wx.showToast({
        title: '请选择配送地址',
        icon: 'none'
      })
      return;
    } else if (!that.data.contacts) {
      wx.showToast({
        title: '请输入联系人',
        icon: 'none'
      })
      return;
    } else if (!that.data.phone) {
      wx.showToast({
        title: '请输入手机号码',
        icon: 'none'
      })
      return;
    }

    let str = /^1[3|4|5|6|7|8|9]\d{9}$/;
    console.log(str.test(that.data.phone));
    if(!str.test(that.data.phone)){
      wx.showToast({
        title: '请输入正确的手机号码!',
        icon: 'none'
      })
      return;
    }

    let data = {
      uid: that.data.userInf.uid,
      customerUnionid: app.globalData.unionID,
      address: that.data.inf.address,
      addressDetail: that.data.inf.addressDetail,
      phone: that.data.phone,
      contacts: that.data.contacts,
      sex: that.data.sex,
      houseNum: that.data.houseNum,
      labelType: that.data.labelIndex,
      latitude: that.data.inf.latitude,
      longitude: that.data.inf.longitude
    }

    wx.request({
      url: app.globalData.updateTicketCustomerAddress,
      // url: 'http://192.168.8.18:8088/evaluation/updateTicketCustomerAddress',
      method: 'POST',
      data: JSON.stringify(data),
      success: res => {
        if (res.data.code == 1) {
          wx.showToast({
            title: '修改成功',
            icon: 'success'
          })
          wx.navigateBack()
        } else {
          wx.showToast({
            title: '修改失败',
            icon: 'error'
          })
        }
      }
    })
  },

  delete() {
    let that = this;

    wx.showModal({
      title: '删除地址',
      content: '确认删除该收货地址?',
      success: res => {
        if (res.confirm) {
          wx.request({
            url: app.globalData.delTicketCustomerAddress,
            data: {
              uid: that.data.userInf.uid
            },
            success: res => {
              if (res.data.code == 1) {
                wx.showToast({
                  title: '删除成功',
                  icon: 'success'
                })
                wx.navigateBack()
              } else {
                wx.showToast({
                  title: '删除失败',
                  icon: 'error'
                })
              }
            }
          })
        }
      }
    })
  },
})