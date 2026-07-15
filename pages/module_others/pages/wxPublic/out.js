Page({
  data:{
    purl: ''
  },
  onLoad: function (options) {
    var app = getApp()
    let that = this
    if (options.toReg) {
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code
            wx.getUserInfo({
              success: function (res) {
                console.log(res)
                that.setData({
                  avatarUrl: res.userInfo.avatarUrl,
                  nickName: res.userInfo.nickName
                })
                app.globalData.encryptedData = res.encryptedData
                app.globalData.iv = res.iv
                wx.request({
                  url: app.globalData.allUrl.getUnionID,
                  data: {
                    code: code,
                    encryptedData: res.encryptedData,
                    iv: res.iv,
                    wechatAppId: app.getWechatAppId(),
                    //wsk: app.globalData.wsk,
                  },
                  header: {
                    'content-type': 'application/json;charset=utf-8' // 默认值
                  },
                  method: 'POST',
                  success: function (res) {
                    console.log(res, "unionId和openId")
                    app.globalData.unionID = res.data.data.unionId
                    app.globalData.openid = res.data.data.openid
                   
                    wx.request({
                      url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addLink',
                      data:{
                        unionId: app.globalData.unionID,
                        title: "点击这里前往毛家饭店",
                        link: "/pages/index/index?shopid=20974"
                      },
                      method: 'GET',
                      success (res){}
                    })
                  }
                })
              }
            })
          }
        }
      })
    }
    if (options.toLove) {
      wx.request({
        url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addLink',
        data:{
          unionId: app.globalData.unionID,
          title: "点击这里返回小程序",
          link: "/pages/main/main?toLove=true"
        },
        method: 'GET',
        success (res){}
      })
    }

  },
})