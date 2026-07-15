// components/supercall.js
const app = getApp()
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    openId: {
      type: String,
      value: ''
    },
    isShow: {
      type: Boolean,
      value: false
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    avatarUrl: '',
    nickName: '',
  },
  /**
   * 组件的方法列表
   */
  mounted() {},
  methods: {
    refused() {
      this.setData({
        isShow: false,
      })
      wx.navigateBack()
    },
    refreshAvatar() {
      this.triggerEvent("refreshAvatar")
    },
    onChooseAvatar(e) {
      const {
        avatarUrl
      } = e.detail
      this.setData({
        avatarUrl,
      })
    },
    getUserInfo() {
      let that = this
      if (!that.data.avatarUrl) {
        wx.showModal({
          title: '提示',
          content: '请获取头像',
          showCancel: false,
        })
        return
      }
      if (!that.data.nickName) {
        wx.showModal({
          title: '提示',
          content: '请输入昵称',
          showCancel: false,
        })
        return
      }
      wx.showLoading({
        title: '请稍后',
      })
      //先上传再修改
      wx.uploadFile({ //照片上传 
        url: app.globalData.UploadAliYunFile,
        filePath: that.data.avatarUrl,
        name: 'file',
        success(res) { //照片上传成功后再写库
          let result = JSON.parse(res.data);
          if (result.lst[0].success) {
            let list = result.lst[0].url;
            var data = {
              avatarUrl: list,
              name: that.data.nickName,
              openId: app.globalData.openid,
            }
            wx.request({
              url: app.globalData.UpdateCustomerByOpenId_Url,
              data: JSON.stringify(data),
              method: 'POST',
              success: res => {
                that.setData({
                  isShow: false
                },()=>{
                  wx.setStorageSync('userInfoName', that.data.nickName)
                  app.getCustomerInfo(app.globalData.openid)
                  that.refreshAvatar()
                })
                wx.hideLoading();
              }
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '网络异常，请重试',
              showCancel: false,
            })
            wx.hideLoading();
            return;
          }
        },
        fail: res => {
          wx.showModal({
            title: '提示',
            content: '网络异常，请重试',
            showCancel: false,
          })
          wx.hideLoading();
          return;
        }
      })

    },
  }

})