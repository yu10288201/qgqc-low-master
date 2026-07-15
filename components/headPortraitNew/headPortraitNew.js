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
    phone:'',
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
      // if (that.data.phone=='') {
      //   wx.showModal({
      //     title: '提示',
      //     content: '请获取手机号',
      //     showCancel: false,
      //   })
      //   return
      // }
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
              phone:that.data.phone,
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
    getPhoneNumber (e) {
      console.log(e);
      console.log(e.detail.code)
      var that = this
      wx.login({
      success: function (res) {
          if (res.code) {
          var code = res.code
          wx.request({
              url: app.globalData.allUrl.QGQCPhoneServlet,
              data: {
              code: code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              wechatAppId: app.globalData.wechatAppId,
              },
              dataType:'json',
              header: {
                  //'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                  'content-type': 'application/json'
                },
              method: 'POST',
              success: function (res) {

              console.log(res)
              if (res.errMsg == 'request:ok') {
                  if (res.data.code!=1000) {
                      wx.showModal({
                          title: '提示',
                          content: '请重试',
                          showCancel: false,
                          confirmText: '好的'
                      })
                      return;
                  }
                  that.setData({
                      phone: res.data.data.phoneNumber
                  })

                  // var data={
                  //     openid: app.globalData.openid,
                  //     phone:res.data.data.phoneNumber
                  // }
                  // var url=app.globalData.updateCustomerPhoneByOpenId;
                  // that.updateCustomerByOpenId(data,url);
  
              } else {
                  wx.showModal({
                  title: '错误',
                  content: '获取失败',
                  })
              }
              }
          })
          }
      }
      })

    },
    updateCustomerByOpenId(data,url){
      //avatarUrl  name phone  更新接口 


      var that =this;
      wx.showLoading("提交中");
         wx.request({
             //url: app.globalData.UpdateCustomerByOpenId_Url,
             url:url,
             data: data,
             method: 'POST',
             dataType:'json',
             success: res => {
                     console.log(res);
                     if(res.data.code==1000){
                         //成功
                         that.selectCustomerInfByOpenIdNew();
                         console.log("成功")
                     }else{
                         wx.showToast({
                           title: '失败'+res.data.result,
                         })
                     }
                     //获取头像等信息     
             },
             complete:res=>{
                 wx.hideLoading();
             }
         });

   },

  }

})