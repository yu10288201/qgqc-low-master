const app = getApp();
var util = require('../../../../utils/util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cityValue: ["广东省", "佛山市", "禅城区"],
    genderItems: [{
      value: '男',
      checked: ''
    },
    {
      value: '女',
      checked: ''
    }
    ],
    // genderArray: ['　　', '男', '女'],
    // genderIndex: 0,
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
    isRegistered: false, //是否验证并通过了手机
    isRegister: false, //是否已经注册
    genderValue: '', //性别的值
    isgetuserinfo: '',
    appCount: '', //获取验证码的计时器
    tmpCount: '', //清除验证码的计时器

    startTime: '', //开始时间毫秒值
    nowTime: '', //当前时间毫秒值
    birthday: '',
    today: '',
    showModalStatus: false,
  },

  returnBack: function () {
    var pages = getCurrentPages(); //当前页面
    var beforePage = pages[pages.length - 2]; //前一页
    wx.navigateBack({
      success: function () {
        // beforePage.onLoad(); // 执行前一个页面的onLoad方法
      }
    });
  },


  genderBindchange(e) { //性别选择框
    var that = this;
    that.setData({
      genderValue: e.detail.value
    })
    console.log(that.data.genderValue)
    wx.setStorage({ //性别的缓存值
      key: 'genderValue',
      data: e.detail.value
    })
  },

  bindCityChange(e) { //城市下拉框
    var that = this;
    that.setData({
      cityValue: e.detail.value //直接赋值给date
    })
    wx.setStorage({ //城市的缓存值
      key: 'cityValue',
      data: that.data.cityValue
    })
  },

  nameBindinput(e) { //监听姓名输入框输入存缓存(每输入一次就存一次)
    var that = this;
    wx.setStorage({ //城市的缓存值
      key: 'nameValue',
      data: e.detail.value
    })
  },

  changeDate(e) {
    var that = this;
    that.setData({
      birthday: e.detail.value
    });
    wx.setStorage({ //出生年份的缓存值
      key: 'birthday',
      data: e.detail.value
    })
  },

  phoneBindinput(e) { //获取手机号码值(顺便存缓存)
    var that = this;
    console.log(e.detail.value)
    that.setData({
      phoneNumberValue: e.detail.value
    })
    wx.setStorage({ //手机号码的缓存值
      key: 'phoneValue',
      data: e.detail.value
    })
  },

  sureCodeBindinput(e) { //获取验证码值
    var that = this;
    console.log(e.detail.value)
    that.setData({
      sureCodeValue: e.detail.value
    })
    wx.setStorage({ //验证码的缓存值
      key: 'sureCodeValue',
      data: e.detail.value
    })
  },


  passwordBindinput(e) {
    var that = this;
    wx.setStorage({ //密码的缓存值
      key: 'passwordValue',
      data: e.detail.value
    })
  },

  confirmPasswordBindinput(e) {
    var that = this;
    wx.setStorage({ //确认密码的缓存值
      key: 'confirmPasswordValue',
      data: e.detail.value
    })
  },

  /**
   * 手机号校验
   */
  mobileValid(mobile) {
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!/^[1][3,4,5,7,8][0-9]{9}$/.test(mobile)) {
      return false;
    } else {
      return true;
    }
  },


  getCode: function (e) { //点击获取验证码按钮
    var that = this;
    console.log("获取验证码");
    clearInterval(that.data.appCount); //先清空获取验证码的计时器
    clearInterval(that.data.tmpCount); //再清空清除验证码的计时器
    let mobile = that.data.phoneNumberValue;
    if (!mobile || !that.mobileValid(mobile)) {
      wx.showModal({
        title: '无效的手机号',
        content: '请重新输入',
      })
    } else {
      that.setData({
        send: false,
        alreadySend: true
      });

      wx.request({
        // url: "https://mb.fsmbdlkj.com/register_war/servlet/sendSmsServlet",
        url: app.globalData.allUrl.sendSmsServlet,
        // url: "http://localhost:8080/register/servlet/sendSmsServlet",
        data: {
          SignName: "切瓜切菜",
          TemplateCode: 'SMS_190781133',
          phoneNumber: mobile,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
        },
        success: function (res) {
          console.log(res)
          if (res.data == "短信发送成功") {
            wx.showToast({
              title: '短信发送成功',
              icon: "success",
              duration: 2000
            });
          }
          if (res.data == "短信发送失败") {
            wx.showToast({
              title: '短信发送失败',
              icon: "loading",
              duration: 2000
            })
            that.setData({
              send: true,
              second: 60,
              alreadySend: false,
            })
          }
        }
      })

      var nsecond = 60;
      that.data.appCount = setInterval(function () { //倒计时
        nsecond -= 1;
        that.setData({
          second: nsecond
        })
        if (nsecond < 1) {
          clearInterval(that.data.appCount);
          //取消指定的setInterval函数将要执行的代码 
          that.setData({
            send: true,
            second: 60,
            alreadySend: false,
          })
        }
        // console.log(nsecond);
      }, 1000);
    }
  },

  sureCodeBindtap(e) { //点击确定按钮，验证手机验证码
    var that = this;
    if (that.data.sureCodeValue == '') {
      wx.showModal({
        title: '您未输入验证码',
        showCancel: false,
      })
    } else {
      wx.request({
        // url: "https://mb.fsmbdlkj.com/register_war/servlet/checkCodeServlet",
        url: app.globalData.allUrl.checkCodeServlet,
        data: {
          phoneNumber: that.data.phoneNumberValue,
          code: that.data.sureCodeValue,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
        },
        success: function (res) {
          console.log(res)
          if (res.data == 'success') {
            wx.showModal({
              title: '手机号码验证成功',
              showCancel: false,
            })
            that.setData({
              isRegistered: true,
              send: true,
              alreadySend: false,
              second: 60,
            })
          } else if (res.data == 'wrong') {
            wx.showModal({
              title: '您输入的验证码有误',
              showCancel: false,
            })
            that.setData({
              isRegistered: false,
            })
          } else if (res.data == 'overdue') {
            wx.showModal({
              title: '您输入的验证码已过期',
              showCancel: false,
            })
            that.setData({
              isRegistered: false,
            })
          }
        }
      })
    }
  },


  bindsubmit(e) { //点击注册按钮，表单提交
    var that = this
    console.log("startTime: " + that.data.startTime)
    console.log("nowTime: " + that.data.nowTime)
    console.log(e.detail.value)
    if (
      // e.detail.value.birthday == '' ||
      e.detail.value.name == '' ||
      e.detail.value.city == '' ||
      that.data.genderValue == '' ||
      e.detail.value.phone == '' ||
      e.detail.value.password == '' ||
      e.detail.value.confirmPassword == '') {
      console.log(1)
      wx.showModal({
        title: '信息不完整',
        content: '请填写完整信息',
      })
    } else { //这里就是全部信息有填写的情况
      if (e.detail.value.password != e.detail.value.confirmPassword) {
        console.log(2)
        wx.showModal({
          title: '密码不一致',
          content: '请重新输入',
        })
      } else if (that.data.isRegistered != true) {
        console.log(3)
        wx.showToast({
          title: '未验证有效手机号码',
          icon: "loading",
          duration: 2000
        })

      } else if (that.data.isRegistered == true && e.detail.value.password == e.detail.value.confirmPassword) {
        console.log(5)

        if (that.data.unionId != '') { //如果授权获取了信息，拿到了unionId
          console.log(6)
          var that = this;
          // 调用函数时，传入new Date()参数，返回值是日期和时间  
          var time = util.formatTime(new Date());
          var tmpTime = (time.split(' '));
          var tmpNumList1 = tmpTime[0].split("-");
          var tmpNumList2 = tmpTime[1].split(":");
          var tmpNum1 = '';
          var tmpNum2 = '';
          for (var i = 0; i < tmpNumList1.length; i++) {
            tmpNum1 = tmpNum1 + tmpNumList1[i]
          }
          for (var i = 0; i < tmpNumList2.length; i++) {
            tmpNum2 = tmpNum2 + tmpNumList2[i]
          }

          var randomCode = '';
          //设置随机字符
          var random = new Array(0, 1, 2, 3, 4, 5, 6, 7, 8, 9);
          for (var i = 0; i < 5; i++) {
            //设置随机数范围,这设置为0 ~ 9 
            var index = Math.floor(Math.random() * 9);
            //字符串拼接 将每次随机的字符 进行拼接 
            randomCode += random[index];
          }
          that.setData({
            registration_time: tmpTime[0], //获取日期
            user_code: tmpNum1 + tmpNum2 + randomCode //获取用户唯一编码
          });

          console.log("用户唯一编码为： " + that.data.user_code)
          console.log("注册日期为： " + that.data.registration_time)

          wx.request({
            // url: 'https://mb.fsmbdlkj.com/register_war/servlet/customerServlet',
            url: app.globalData.allUrl.updateUserInfo,
            // url: 'http://localhost:8080/register/servlet/customerServlet',
            data: {
              city: e.detail.value.city,
              name: e.detail.value.name,
              gender: e.detail.value.gender,
              phone: e.detail.value.phone,
              birthday: e.detail.value.birthday,
              password: e.detail.value.password,
              registration_time: that.data.registration_time,
              openid: that.data.openid,
              user_code: that.data.user_code,
              unionId: that.data.unionId
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
              if (res.data == 'success') {
                wx.showModal({
                  title: '注册成功',
                  showCancel: false
                })

                //这里是注册成功清空页面数据
                that.data.genderItems[0].checked = "",
                  that.data.genderItems[1].checked = "",
                  that.setData({
                    genderItems: that.data.genderItems,
                    cityValue: ["广东省", "佛山市", "禅城区"],
                    nameValue: '', //姓名的值
                    phoneNumberValue: '', //手机号码的值
                    sureCodeValue: '', //验证码的值
                    passwordValue: '', //密码的值
                    confirmPasswordValue: '', //确认密码的值
                    isRegistered: false, //是否验证并通过了手机

                    birthday: '', //出生日期的值
                    isRegister: true
                  })
                that.delBtnClick()
                that.changeParentData()
                app.globalData.isRegistered = true

                wx.navigateBack({
                  delta: 1
                })
              } else if (res.data == "registered") {
                wx.showModal({
                  title: '已注册的用户',
                  showCancel: false
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
    }
  },

  onGotUserInfo: function (e) {
    var that = this;
    console.log(e)
    if (e.detail.errMsg == "getUserInfo:ok") {
      console.log('获取unionId')
      that.setData({
        isgetuserinfo: false,
      })
      that.setData({
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      })
      if (that.data.code && that.data.encryptedData != '' && that.data.iv != '') {
        wx.request({
          // url: 'https://mb.fsmbdlkj.com/register_war/servlet/openIdServlet',
          url: app.globalData.allUrl.getUnionID,
          data: {
            code: that.data.code,
            encryptedData: that.data.encryptedData,
            iv: that.data.iv
          },
          header: {
            'content-type': 'application/json;charset=utf-8' // 默认值
          },
          method: 'POST',
          success: function (res) {
            if (res.data) {
              var tmpList = res.data.data;
              that.setData({
                openid: tmpList.openid,
                unionId: tmpList.unionId,
                // isAuthorize:true
              })
              console.log("openid是： " + that.data.openid)
              console.log("unionId是： " + that.data.unionId)
            }
          },
          complete: function (res) {
            that.onLoad()
          }
        })
      }
    }
  },

  getUserInfo(){
    let that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res)
          var code = res.code
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              that.setData({
                avatarUrl:res.userInfo.avatarUrl,
                nickName:res.userInfo.nickName
              })
              app.globalData.encryptedData = res.encryptedData
              app.globalData.iv = res.iv
            wx.request({
              // url: 'https://api.weixin.qq.com/sns/jscode2session',
              url: app.globalData.allUrl.getUnionID,
              data: {
                wechatAppId: app.getWechatAppId(),
                //wsk: app.globalData.wsk,
                code: code,
                encryptedData: res.encryptedData,
                iv: res.iv,
              },
              header: {
                'content-type': 'application/json;charset=utf-8' // 默认值
              },
              method: 'POST',
              success: function (res) {
                console.log(res,"unionId和openId")
               
                var openid = res.data.data.openid
                var unionID = res.data.data.unionId
                that.setData({
                  openid:openid,
                  unionId:unionID
                })
               
                wx.request({
                  url: app.globalData.selectCustomerInfByOpenId_url,
                  method: 'POST',
                  data: {
                    openid: openid
                  },
                  header: {
                    'content-type': 'application/json;charset=utf-8' // 默认值
                  },
                  success: function (res) {
                    if (res.data == '') {//没有进来过的客人
                      app.globalData.showModalQR = true
                      console.log('会弹出弹窗')
                    } else {//有进来过的客人
                      console.log('不会弹出弹窗')
                      app.globalData.showModalQR = false
                    }
                  }
                })
              }
            })
            },

            fail: function (res) {
              console.log('获取unionId失败，用户未授权')
              that.setData({
                dy_flesh:true
              })
              // 申请授权
              that.authorization()
            },

          })  
        }
      }
    })
  },

  changeParentData: function () {
    var pages = getCurrentPages(); //当前页面栈
    if (pages.length > 1) {
      console.log('刷新')
      var beforePage = pages[pages.length - 2]; //获取上一个页面实例对象
      beforePage.changeData(); //触发父页面中的方法

      // wx.navigateBack({
      //   delta: 1,
      // })
    }
  },


  cancelTap: function (e) {
    var that = this;
    that.setData({
      isgetuserinfo: false,
    })
    wx.showModal({
      title: '请重新确认',
      content: '不授权获取的话将无法完成注册',
      success: function (res) {
        if (res.cancel) { } else {
          that.setData({
            isgetuserinfo: true,
          })
        }
      }
    })
  },

  tmpBindtap(e) {
    var that = this;
    wx.redirectTo({
      url: '../storePersonnal/storePersonnal',
    })
  },

  test(e) {
    var tmpValue = wx.getStorage({
      key: 'cityValue',
      success(res) {
        console.log(res)
      }
    })
    console.log(tmpValue)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {
    var that = this;
    //that.onGotUserInfo();
    that.getUserInfo();
    var time = util.formatTime(new Date()).split(' ')[0];
    that.setData({
      today: time,
      isRegister: app.globalData.isRegister
    })

    wx.getStorage({ //城市缓存数据回显
      key: 'cityValue',
      success(res) {
        console.log(res)
        var tmpList = []
        for (var i = 0; i < res.data.length; i++) {
          tmpList.push(res.data[i])
        }
        that.setData({
          cityValue: tmpList
        })
      }
    })

    wx.getStorage({ //姓名缓存数据回显
      key: 'nameValue',
      success(res) {
        console.log(res)
        that.setData({
          nameValue: res.data
        })
      }
    })

    wx.getStorage({ //姓名缓存数据回显
      key: 'genderValue',
      success(res) {
        console.log(res)
        let sex = ''
        for (var i = 0; i < that.data.genderItems.length; i++) {
          if (that.data.genderItems[i].value == res.data) {
            that.data.genderItems[i].checked = true
            sex = that.data.genderItems[i].value
          }
        }

        that.setData({
          genderValue: sex,
          genderItems: that.data.genderItems
        })
      }
    })

    wx.getStorage({ //手机号码缓存数据回显
      key: 'phoneValue',
      success(res) {
        console.log(res)
        that.setData({
          phoneNumberValue: res.data
        })
      }
    })

    wx.getStorage({ //手机号码缓存数据回显
      key: 'sureCodeValue',
      success(res) {
        console.log(res)
        that.setData({
          sureCodeValue: res.data
        })
      }
    })

    wx.getStorage({ //出生年月日缓存数据回显
      key: 'birthday',
      success(res) {
        console.log(res)
        that.setData({
          birthday: res.data
        })
      }
    })


    wx.getStorage({ //密码缓存数据回显
      key: 'passwordValue',
      success(res) {
        console.log(res)
        that.setData({
          passwordValue: res.data
        })
      }
    })

    wx.getStorage({ //确认密码缓存数据回显
      key: 'confirmPasswordValue',
      success(res) {
        console.log(res)
        that.setData({
          confirmPasswordValue: res.data
        })
      }
    })

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
  },


  // 删除本地缓存
  delBtnClick: function () {
    var that = this;

    wx.removeStorage({
      key: 'nameValue',
      success: function (res) {
        console.log('nameValue' + '清除缓存')
      },
    })

    wx.removeStorage({
      key: 'cityValue',
      success: function (res) {
        console.log('cityValue' + '清除缓存')
      },
    })

    wx.removeStorage({
      key: 'genderValue',
      success: function (res) {
        console.log('genderValue' + '清除缓存')
      },
    })

    wx.removeStorage({
      key: 'phoneValue',
      success: function (res) {
        console.log('phoneValue' + '清除缓存')
      },
    })

    wx.removeStorage({
      key: 'sureCodeValue',
      success: function (res) {
        console.log('sureCodeValue' + '清除缓存')
      },
    })

    wx.removeStorage({
      key: 'birthday',
      success: function (res) {
        console.log('birthday' + '清除缓存')
      },
    })

    wx.removeStorage({
      key: 'passwordValue',
      success: function (res) {
        console.log('passwordValue' + '清除缓存')
      }
    })

    wx.removeStorage({
      key: 'confirmPasswordValue',
      success: function (res) {
        console.log('confirmPasswordValue' + '清除缓存')
      },
    })

  },

  refuse: function (e) {
    let that = this
    that.setData({
      showModalStatus: false
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      isRegister: app.globalData.isRegister
    })
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

  login: function () {
    let that = this
    that.setData({
      isgetuserinfo: true
    })
  }
})