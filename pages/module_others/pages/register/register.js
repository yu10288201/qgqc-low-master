const app = getApp();
var util = require('../../../../utils/util.js');
const JSEncrypt = require('../utils/jsencrypt.min.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isShowGetAvatar: false,
    isGetPhone: false,
    isAgree: false,
    _phoneLoginCode: '', // wx.login() 拿到的 code，用于手机号解密
    onOfficialAccounts: '',
    publicKey:'-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC+2cwk61EWUYJ2ytyEv62e+ojcDOFqtXtkMr+TG57I4diaFBrxwuitddPHKQtkkdKa283Tugm3ARf/ekDnm5MKaDeGUaK5KZfC6GjA+MKU9VbgzdVybZBddLXi5+JubM/V307AtWkU7OJnwDSI10vTYHRsO9ACpnm0fkKsWAkehwIDAQAB-----END PUBLIC KEY-----',
    avatarUrl: "https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132",
    showAuthorize: false,
    background2: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/authorized.jpg",
    cityValue: [],
    nickName: '',
    genderItems: [{value: '男',checked: ''}, {value: '女',checked: ''}],
    isAuthorize: false, // 是否授权
    date: '', //日期
    nowDate: '',
    openid: '',
    user_code: '', //用户唯一编码
    registration_time: '', //注册时间
    code: '',
    unionId: '',
    passwordValue: '', //密码的值
    confirmPasswordValue: '', //确认密码的值
    phoneNumberValue: '', //手机号码的值
    sureCodeValue: '', //验证码的值
    second: 60, //默认验证码秒数为60
    send: true, //显示 "点击获取"
    alreadySend: false, //显示 "秒数倒计时""
    // isRegistered: false, //是否验证并通过了手机
    isRegister: false, //是否已经注册
    genderValue: '', //性别的值
    isgetuserinfo: '',
    appCount: '', //获取验证码的计时器
    tmpCount: '', //清除验证码的计时器
    needClose: false,
    // showNeedClose: false,
    startTime: '', //开始时间毫秒值
    nowTime: '', //当前时间毫秒值
    birthday: '',
    today: '',
    showModalStatus: false,
    topHeight: 0,
  },

  refused(){
    let that = this
    if (that.data.guidelink) {
      wx.redirectTo({
        url: "/pages/ordersdetail/ordersdetail?orderid="+that.data.orderid+"&shop_id="+that.data.shopid+"&guidelink=true",
      })
    }else if(that.data.orderlink){
      wx.redirectTo({
        url: "/pages/QRorder/QRorder?shop_id=" + that.data.shopid + "&table_id=" + that.data.tableid,
      })
    }else if(that.data.operationlink){
      wx.redirectTo({
        url: "/pages/module_others/pages/operation/operation?shopId=" + that.data.shopid + "&tableId=" + that.data.tableid,
      })
    }else if(that.data.directRegister){
      wx.redirectTo({
        url: "/pages/main/main",
      })
    }else if(that.data.inviteBuy){
      wx.redirectTo({
        url: "/pages/module_discount/pages/Package_details/Package_details?a=" + that.data.a + "&b=0&c=" + that.data.c
      })
    }else{
      wx.navigateBack({
        delta: 1,
      })
    }
  },

  genderBindchange(e) { //性别选择框
    var that = this;
    that.setData({
      genderValue: e.detail.value
    })
  },

  bindCityChange(e) { //城市下拉框
    var that = this;
    that.setData({
      cityValue: e.detail.value //直接赋值给date
    })
  },
  bindCancelCity(){
    console.log(this.data.city);
    this.setData({
      city: ''
    })
  },

  changeDate(e) {
    var that = this;
    that.setData({
      birthday: e.detail.value
    });
  },

  phoneBindinput(e) { //获取手机号码值(顺便存缓存)
    var that = this;
    console.log(e.detail.value)
    that.setData({
      phoneNumberValue: e.detail.value
    })
  },

  /**
   * 手机号校验
   */
  mobileValid(mobile) {
    if (/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/.test(mobile)) {
      return false;
    } else {
      return true;
    }
  },




  bindsubmit(e) { //点击注册按钮，表单提交
    var that = this

    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(this.data.publicKey);
    let encrypted = encrypt.encrypt(e.detail.value.password);
    console.log("加密结果",encrypted);
    if(!that.data.isAgree){
      wx.showToast({
        title: '请同意协议',
        icon: 'error',
        duration: 1500
      })
      return
    }
    if(that.data.cityValue.length == 0){
      e.detail.value.city = ''
    }
    if (e.detail.value.name == '' || e.detail.value.city == '' || e.detail.value.gender == '' || e.detail.value.phone == '' || e.detail.value.password == '' || e.detail.value.confirmPassword == '') {
      console.log(e)
      wx.showModal({
        title: '信息不完整',
        content: '请填写完整信息',
      })
      return
    } else { //这里就是全部信息有填写的情况
      let a = that.mobileValid(e.detail.value.phone)
      if(a){
        wx.showModal({
          title: '手机号码不正确',
          content: '请输入正确的手机号码',
        })
        return 
      }
     if(e.detail.value.password != ''){
        if (e.detail.value.password != e.detail.value.confirmPassword) {
          wx.showModal({
            title: '密码不一致',
            content: '请重新输入',
          })
          return
        }
      } 
      if(e.detail.value.confirmPassword != ''){
        if (e.detail.value.password != e.detail.value.confirmPassword) {
          wx.showModal({
            title: '密码不一致',
            content: '请重新输入',
          })
          return
        }
      }
      if (that.data.openid != '') { //如果授权获取了信息，拿到了unionId
        var data = {
          city: e.detail.value.city,
          realName: e.detail.value.name,
          gender: e.detail.value.gender,
          phone: e.detail.value.phone,
          birthday: e.detail.value.birthday,
          password: encrypted,
          registrationTime: util.formatTime(),
          openid: that.data.openid,
          customerId: app.globalData.customerInf.id,
          sumStarPlatform: app.globalData.customerInf.sum_star_platform,
          platformShopId: app.globalData.platformShopId,
          signIn: 1,
        }
        console.log(data);
        wx.request({
        url: app.globalData.UpdateCustomerByOpenId_Url,
          // url: 'http://localhost:8088/evaluation/updateCustomerByOpenId',
          data:JSON.stringify(data),
          method:'POST',
          success:res=>{
            console.log(res,'success');
            if(res.data.result === 'success'){
              that.updateMemberInfoIsRegister(app.globalData.unionID,1)
              that.getCustomerInfo(that.data.openid)
              wx.showToast({
                title: '注册成功！',
                duration: 2500,
              })
              setTimeout(res=>{
                if (that.data.eat) {
                  wx.navigateBack({
                    delta: 1,
                  })
                }else if (that.data.guidelink) {
                  wx.redirectTo({
                    url: "/pages/ordersdetail/ordersdetail?orderid="+that.data.orderid+"&shop_id="+that.data.shopid+"&phone="+that.data.phoneNumberValue+"&guidelink=true",
                  })
                }
              },1000)
            }
            if(res.data.code == 0){
              wx.showModal({
                title: '提示',
                content: '该手机号码已被注册，请重新输入手机号码',
                showCancel: false,
                success: res=>{
                  that.setData({
                    phoneNumberValue: '',
                  })
                }
              })
            }
          }
        })
      } else { //一系列判断下来，这里的情况就是未授权获取拿到信息去后去unionid了
        wx.showModal({
          title: '注册失败',
          content: '未授权获取您的基本信息',
        })
      }
    }
  },
  updateMemberInfoIsRegister(unionId,isRegister){
    let that = this
    wx.request({
      url: app.globalData.updateMemberInfoIsRegister,
      // url: 'http://localhost:8088/evaluation/updateMemberInfoIsRegister',
      data:{
        unionId: unionId,
        isRegister: isRegister,
      },
      success: res=>{
        console.log(res);
      }
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    // 获取协议
    that.getDom()
    // 计算顶部高度
    wx.getSystemInfo({
      success: res => {
          //导航高度
          let topHeight = res.statusBarHeight + 46;
          that.setData({
            topHeight
          })
      },
      fail(err) {
          console.log(err);
      }
  })
    that.setData({
      phoneNumberValue: app.globalData.user_phone
    })
    that.getCustomerInfo(options.openId)
    if (options.guide) {
      that.setData({
        guide: options.guide
      })
    }
    if(options.orderlink){
      that.setData({
        orderlink: options.orderlink
      })
    }
    //公众号卡片跳转标识   买单     扫码下单     扫码拼桌
    if (options.guidelink || options.orderlink || options.operationlink) {
      that.setData({
        guidelink: options.guidelink ? options.guidelink : '',
        operationlink: options.operationlink ? options.operationlink : '',
        orderlink: options.orderlink ? options.orderlink : '',
        orderid: options.orderid ? options.orderid : '',
        shopid: options.shop_id ? options.shop_id : '',
        tableid: options.table_id ? options.table_id : '',
      })
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code
            wx.getUserInfo({
              success: function (res) {
                app.globalData.avatarUrl = res.userInfo.avatarUrl
                app.globalData.nickName = res.userInfo.nickName
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
                    app.globalData.unionID = res.data.data.unionId
                    app.globalData.openid = res.data.data.openid
                    that.setData({openid: res.data.data.openid, unionID: res.data.data.unionId})
                    var customerInfo=res.data.data.customer;
                    console.log('customerInfo:');
                    console.log(customerInfo);
                    app.globalData.caustomerId = customerInfo.id
                    app.globalData.customerInf = customerInfo
                    app.globalData.user_phone = customerInfo.phone
                    app.globalData.user_name = customerInfo.name  

                    app.globalData.isAuthorize = true
                  }
                })
              },
              fail: function (res) {
                console.log('获取unionId失败，用户未授权')
              },
            })
          }
        }
      })
    }
    //公众号分销购买标识
    if(options.inviteBuy){
      this.setData({
        a: options.a,
        b: options.b,
        c: options.c,
        inviteBuy: options.inviteBuy,
      })
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code
            wx.getUserInfo({
              success: function (res) {
                app.globalData.avatarUrl = res.userInfo.avatarUrl
                app.globalData.nickName = res.userInfo.nickName
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
                    app.globalData.unionID = res.data.data.unionId
                    app.globalData.openid = res.data.data.openid
                    that.setData({openid: res.data.data.openid, unionID: res.data.data.unionId})
                    var customerInfo=res.data.data.customer;
                    console.log('customerInfo:');
                    console.log(customerInfo);
                    app.globalData.caustomerId = customerInfo.id
                    app.globalData.customerInf = customerInfo
                    app.globalData.user_phone = customerInfo.phone
                    app.globalData.user_name = customerInfo.name  
                    app.globalData.isAuthorize = true
                  }
                })
              },
              fail: function (res) {
                console.log('获取unionId失败，用户未授权')
              },
            })
          }
        }
      })
    }
   //公众号跳转注册标识 
    if(options.directRegister){
      this.setData({
        directRegister: options.directRegister,
      })
      wx.login({
        success: function (res) {
          if (res.code) {
            var code = res.code
            wx.getUserInfo({
              success: function (res) {
                app.globalData.avatarUrl = res.userInfo.avatarUrl
                app.globalData.nickName = res.userInfo.nickName
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
                    app.globalData.unionID = res.data.data.unionId
                    app.globalData.openid = res.data.data.openid
                    that.setData({openid: res.data.data.openid, unionID: res.data.data.unionId},()=>{
                      //查询星盾明细表，没记录则加五个平台星盾、有则不管
                    wx.request({
                      url: app.globalData.selectStarById_url,
                      data: {
                        openId: that.data.openid,
                        starFromUuid: 'DA897977-F318-4828-979A-3FB053560FB5'
                      },
                      success: res=>{
                        if(res.data.code == 1){
                          if(res.data.list.length == 0){
                            //赠送5星盾
                            wx.request({
                              url: app.globalData.addStarByFocusPublic_url,
                              data: {
                                openId: that.data.openid,
                                starFromUuid: 'DA897977-F318-4828-979A-3FB053560FB5'
                              },
                              success: res=>{
                                console.log(res);
                              }
                            })
                          }
                        }
                      }
                    })
                    })
                    app.globalData.isAuthorize = true
                  }
                })
              },
            })
          }
        }
      })
    }
    
    if (options.eat) {
      that.setData({
        eat: options.eat
      })
    }
    // var time = util.formatTime(new Date()).split(' ')[0];
    that.setData({
      today: time,
      // birthday: time,
      openid: options.openId
    })
    if (typeof options !== "undefined") {
      if (typeof options.needClose !== "undefined") {
        if (options.needClose == 1) {
          that.setData({
            needClose: true
          })
        }
      }
    }

    var time = util.formatTime(new Date());
    var tmpTime = (time.split(' '));
    // console.log(time)
    that.setData({
      date: tmpTime[0], //获取日期
      nowDate: tmpTime[0],
    });
    let tmp1 = new Date(that.data.date).getTime(); //当前时间的毫秒值
    let tmp2 = new Date("1880-01-01").getTime(); //设置好的默认最早时间的毫秒值
    that.setData({
      startTime: tmp2,
      nowTime: tmp1
    })
    
    // 预取 wx.login() code，之后 getPhoneNumber 时配合 encryptedData 发给后端
    that.refreshPhoneCode()
  },
  // 调用 wx.login() 获取 code 并缓存，不要消费这个 code！
  refreshPhoneCode: function() {
    var that = this
    wx.login({
      success: function(res) {
        if (res.code) {
          console.log('phone login code 已缓存:', res.code.substring(0, 10) + '...')
          that.setData({ _phoneLoginCode: res.code })
        }
      }
    })
  },
  getPhoneNumber(e) {
    var that = this
    console.log(e.detail);
    // 用 onLoad 时 wx.login() 缓存的 code 发给后端。
    // wx.login code → jscode2session → session_key → 解密 encryptedData ✅
    // getPhoneNumber 回调里的 code 是另一种 code，不能用于 jscode2session ❌
    var code = that.data._phoneLoginCode
    if (!code) {
      // code 还没缓存好，现场获取
      wx.login({
        success: function(loginRes) {
          if (loginRes.code) {
            that.setData({ _phoneLoginCode: loginRes.code })
            that._doGetPhoneRequest(loginRes.code, e.detail.encryptedData, e.detail.iv)
          }
        }
      })
      return
    }
    that._doGetPhoneRequest(code, e.detail.encryptedData, e.detail.iv)
  },
  _doGetPhoneRequest: function(code, encryptedData, iv) {
    var that = this
    wx.request({
      url: app.globalData.allUrl.QGQCPhoneServlet,
      data: {
        code: code,
        encryptedData: encryptedData,
        iv: iv,
        wechatAppId: app.getWechatAppId(),
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function(res) {
        console.log('QGQCPhoneServlet 返回:', JSON.stringify(res.data))
        if (res.data.code != 1000 || !res.data.data || !res.data.data.phoneNumber) {
          wx.showModal({
            title: '提示',
            content: '访问超时，请重试!',
            showCancel: false,
            confirmText: '好的'
          })
          return;
        }
        var phoneNumber = res.data.data.phoneNumber
        app.globalData.user_phone = phoneNumber
        if (res.errMsg == 'request:ok') {
          var data= {
            phone: phoneNumber,
            openId:app.globalData.openid
          }
          wx.request({
            url: app.globalData.UpdateCustomerByOpenId_Url,
            data:JSON.stringify(data),
            method:'POST',
            success:res=>{
              console.log(res);
              if(res.data.result == 'success'){
                wx.request({
                  url: app.globalData.addStarByFocusPublic_url,
                  data: {
                    openId: that.data.openid,
                    starFromUuid: 'DA897977-F318-4828-979A-3FB053560FB5',
                  },
                  success: res=>{
                  }
                })
              }
            }
          })
          that.setData({
            showAuthorize: false,
            isGetPhone: true,
            phoneNumberValue: phoneNumber
          })
          wx.setStorage({
            key: 'phonenumber',
            data: phoneNumber,
          })
          app.globalData.phonenumber = phoneNumber
        } else {
          wx.showModal({
            title: '错误',
            content: '获取失败',
          })
        }
      }
    })
  },
  refreshAvatar(){
    this.getCustomerInfo(this.data.openid)
  },
  //获取customer信息
  getCustomerInfo(openid) {
    let that = this
    wx.request({
      url: app.globalData.selectCustomerInfByOpenId_url,
      // url:'http://localhost:8887/evaluation_war/selectCustomerInfByOpenId',
      method: 'POST',
      data: {
        openid: openid
      },
      header: {
        'content-type': 'application/json;charset=utf-8' // 默认值
      },
      success: function (res) {
        if(res.data.city){
          res.data.city = res.data.city.replace("[","").replace("]","").replaceAll("\"","")
        }
        if (res.data.signIn == 1 ) {
          if(res.data.gender == "男"){
            let a = [{value: '男',checked: 'true'}, {value: '女',checked: ''}]
            that.setData({
              genderItems: a,
            })
          }else if(res.data.gender == "女"){
            let a = [{value: '男',checked: ''}, {value: '女',checked: 'true'}]
            that.setData({
              genderItems: a,
            })
          }
          that.setData({
            cityValue: res.data.city,
            isRegister: true,
            passwordValue: res.data.password,
            phoneNumberValue: res.data.phone,
            birthday: res.data.birthday,
            nameValue: res.data.name,
            avatarUrl: res.data.avatarUrl,
            gender: res.data.gender,
            nickName: res.data.name,
            onOfficialAccounts: res.data.onOfficialAccounts,
            registration_time: res.data.registrationTime
          })
        }else{
          if(!res.data.avatarUrl){
            that.setData({
                isShowGetAvatar: true,
            })
          }
          if(!res.data.phone){
            that.setData({
              showAuthorize: true
            })
          }
          that.setData({
            phoneNumberValue:res.data.phone,
            avatarUrl: res.data.avatarUrl ? res.data.avatarUrl : that.data.avatarUrl,
            nickName: res.data.name,
            nameValue: res.data.name,
          })
        }
        console.log(that.data, '123456');
      }
    })
  },
  //获取协议
  getDom: function () {
    var that = this
    wx.request({
      url: app.globalData.GetShopHelpInfServlet_url,
      data: {
        shop_id: 20903
      },
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
      method: 'POST',
      success: function (res) {
        for (const x of res.data) {
          if(x.help_info_filename == '切瓜切菜用户服务协议.docx'){
            that.setData({
              help_info_fileaddress: x.help_info_fileaddress,
              fileName: '切瓜切菜用户服务协议'
            })
          }
        }
      },
    })
  },
  check(e) { //打开协议
    //进行下载并预览功能
    var that = this;
    let successPath = that.data.help_info_fileaddress
    wx.downloadFile({ //运用微信自带的方法对该链接进行下载转换获取到临时的可供微信使用的链接
      url: successPath,

      success(res2) {
        that.setData({
          tempFilePath: res2.tempFilePath
        })
        wx.openDocument({ //打开这个临时链接，也就是打开文件，这里可以两个方法整合在一起，作为一个打开文件按钮
          filePath: that.data.tempFilePath,
          success: function (res3) {
          },
          fail: function () {
            wx.showModal({
              title: '提示',
              content: '没有找到可以使用的打开工具',
            })
          }
        })

      }
    })
  },
  agreeProtocol(e){
    let a = e.detail.value[0]
    if(a){
      console.log(a);
      this.setData({
        isAgree: true,
      })
    }else{
      this.setData({
        isAgree: false,
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    var that = this;
    that.checkPhone()
  },
  checkPhone(){  //判断手机号码与缓存的是否一致，一致则禁用输入框
    let that = this 
    let phone = that.data.phoneNumberValue
    if(phone == wx.getStorageSync('phonenumber') && phone != ''){
        that.setData({
            isGetPhone: true
        })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },


})