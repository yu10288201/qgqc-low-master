var util = require('../../../../utils/util.js');
var app = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        pid: '',
        giftRuleList: [],
        radioDisabled: false,
        itemList: [{
            value: '0',
            name: '否',
            checked: 'true'
        }, {
            value: '1',
            name: '是',
        }],
        list: [],
        userinfo: [],
        now_money: 0,
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo'),
        shop_id: 0,
        phone: '',
        realName: '',
        sex: '',
        prestoreMoneymax: 0,
        prestoreMoneymin: 0,
        preferentidGift: '',
        preferentidRules: '',
        preferentCount: 0,
        preferentDiscount: 0,
        preferentMoney: 0,
        paymentweixin_status: 0, //0默认是微信支付
        paymentzhifubao_status: 0,
        paymentbankcard_status: 0,
        paymentcash_status: 0,
        user_balance: "", //余额 
        shop_name: "",
        payment_address: '',
        existingBalance: 0,
        customerId: '',
        couponName: '',
        closeInput: false,
        givingAmount: 0,
        effectiveDay: '',
        changeColor: false,
        deductionProportion: '100.00',
        isSuper: 0,
        listIndex:0,
        prestoreName:'',
        preferentRule:'',
        amount_of_deposit:0,
    },
    //刷新流水记录
    preferentItemClick:function(e){
      var item=e.currentTarget.dataset.item;
      var index=e.currentTarget.dataset.index;
      this.setItemData(item,index);
    
    },
    setItemData(item,index){
      var that=this;
      console.log(item);
      this.setData({
        listIndex:index,
        prestoreName:item.prestoreName?item.prestoreName:'',
        preferentRule:item.preferentRule?item.preferentRule:'',

      })

      //充值金额
      var number=Number(item.prestoreMoneyStart);
      //赠送金额
      var givingAmount=Number(item.givingAmount);
      //存后余额
      var  user_balance = Number(that.data.existingBalance) +number+givingAmount;

      //折扣
      var preferentDiscount=Number(item.deductionProportion);
      //赠送优惠券张数
      var preferentCount=Number(item.preferentCount);
      that.setData({
        user_balance: user_balance,
        amount_of_deposit:number,
        number:number,
        givingAmount:givingAmount,
        preferentDiscount:preferentDiscount,
        preferentDiscount:preferentDiscount,
        preferentCount:preferentCount,
     });
    },

    //微信存入 备份 ，之前的逻辑 商城使用有问题，暂不使用
    wechat_pay_bak: function wechat_pay(e) {
        var that = this;
        var openid = app.globalData.unionID;
        var order_id = '';
        var shop_id = that.data.shop_id;
        var user_id = that.data.user_id;
        var amount_of_deposit = that.data.amount_of_deposit;
        var store_way = '微信';
        var preferent_count = that.data.preferentCount;
        var preferent_discount = that.data.preferentDiscount;
        var preferent_money = that.data.preferentMoney;

       


        var amount_of_deposit = that.data.amount_of_deposit; //预存金额
        console.log(amount_of_deposit)
        console.log(that.data.number)

        if (that.data.number == null || that.data.number == '') {
            if (that.data.number != amount_of_deposit) {
                wx.showModal({
                    title: '提示',
                    content: '请重新输入要充值的金额!',
                })
                return;
            }
        }
        if (amount_of_deposit == null || amount_of_deposit == "") { //判断输入是否为空
            wx.showModal({
                title: '提示',
                content: '请输入要充值的金额!',
                // content: '请输入要充值的金额',
            })
            return;
        }
        if (amount_of_deposit < that.data.prestoreMoneymin) {
            wx.showModal({
                title: '当前充值金额无法获取优惠',
                cancelText: '返回',
                confirmText: '继续',
                success(res) {
                    if (res.confirm) {
                        console.log(res.confirm);

                        wx.request({
                            url: app.globalData.allUrl.wxPayPlusPreStoreService,
                            method: "GET",
                            data: {
                                //公众号appid
                                appid: 'wx78455227a0fd853f',
                                //商户号 诗么普
                                mch_id: '1525534221', 
                                //小程序id
                                sub_appid: "wx7601bb0ab62f48aa",
                                //hardcode的是孟贲账户
                                sub_mch_id: app.globalData.shopdetail.sub_merchants_id ? app.globalData.shopdetail.sub_merchants_id : '1615440524',
                                //支付说明
                                body: '预存金额存入',
                                //订单号
                                out_trade_no: util.formatTime(new Date()).replace('/', "").replace('/', "").replace(" ", "").replace(":", "").replace(":", "") + that.data.phone,
                                //支付接口
                                trade_type: 'JSAPI',
                                //支付金额(单位分)
                                total_fee: that.data.amount_of_deposit * 100,                               
                                //用户openid
                                openid: app.globalData.openid,                                
                            },
                            success: function (res) {
                                console.log(res)
                                console.log(res.data[0].package)
                                if (res.statusCode == 500) {
                                    wx.showToast({
                                        title: '服务器500错误',
                                        icon: 'none',
                                        showCancel: false,
                                        duration: 1000
                                    })
                                }
                                wx.requestPayment({
                                    'timeStamp': res.data[0].timeStamp,
                                    'nonceStr': res.data[0].nonceStr,
                                    'package': res.data[0].package,
                                    'signType': res.data[0].signType,
                                    'paySign': res.data[0].sign,
                                    'success': function (res) {
                                        console.log(res)
                                        wx.showToast({
                                            title: '支付成功',
                                            icon: 'success',
                                            showCancel: false,
                                            duration: 2000
                                        })
                                        var sex = 2
                                        //新增明细记录
                                        if (that.data.sex === '男') {
                                            sex = 1
                                        } else if (that.data.sex === '女') {
                                            sex = 0
                                        }

                                        wx.request({
                                            url: app.globalData.AddAddAccount_url,                                            
                                            data: {
                                                shop_id: shop_id,
                                                create_time: util.formatTime3(new Date(), 'Y-M-D h:m:s'),
                                                user_name: that.data.realName,
                                                user_sex: sex,
                                                user_phone: that.data.phone,
                                                prestore_money: that.data.amount_of_deposit,
                                                mode: '微信',
                                                user_balance: 'NaN',
                                                discount: that.data.preferentDiscount,
                                                couponNum: preferent_count,
                                                givingAmount: that.data.givingAmount,
                                                effectiveDay: that.data.effectiveDay,
                                                couponDenomination: preferent_money,
                                                deductionProportion: that.data.deductionProportion,
                                                confirmBy: '',
                                                confirmStatus: 0,
                                                startTime: that.data.startTime ? that.data.startTime : '',
                                                endTime: that.data.endTime ? that.data.endTime : '',
                                                isSuper: that.data.isSuper,
                                                state: 1
                                            },
                                            header: {
                                                'content-type': 'application/json'
                                            },
                                            success: function (res) {
                                                console.log(res)
                                                let money = Number(that.data.number) + Number(that.data.givingAmount)
                                                if (res.data.result.result === 1) {
                                                    wx.showModal({
                                                        title: '存入成功！',
                                                        content: '本次存入成功，已存入' + money + '元' + "\n请等待管理员确认",
                                                        showCancel: false,
                                                        success: function (res) {
                                                            wx.navigateBack({
                                                                delta: 1,
                                                            })
                                                        }
                                                    })
                                                } else {
                                                    wx.showModal({
                                                        title: '存入失败',
                                                        showCancel: false,
                                                    })
                                                }
                                            }
                                        })
                                    },
                                    'fail': function (res) {
                                        console.log(res)
                                        wx.showModal({
                                            title: '提示',
                                            content: '支付失败',
                                            showCancel: false,
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        that.setData({
                            closeInput: false,
                            number: '',
                            user_balance: ''
                        })
                    }
                }
            })
            return;
            
        } else {
            //新增预存优惠订单
            wx.request({
                url: app.globalData.allUrl.wxPayPlusPreStoreService,
                method: "GET",
                data: {
                    //公众号appid
                    appid: 'wx78455227a0fd853f',
                    //商户号 诗么普
                    mch_id: '1525534221',
                    //小程序id
                    sub_appid: "wx7601bb0ab62f48aa",
                    //孟贲账户
                    sub_mch_id: app.globalData.shopdetail.sub_merchants_id ? app.globalData.shopdetail.sub_merchants_id : '1615440524',
                    //支付说明
                    body: '预存金额存入',
                    //订单号
                    out_trade_no: util.formatTime(new Date()).replace('/', "").replace('/', "").replace(" ", "").replace(":", "").replace(":", "") + that.data.phone,
                    //支付接口
                    trade_type: 'JSAPI',
                    //支付金额(单位分)
                    total_fee: that.data.amount_of_deposit * 100,                    
                    //用户openid
                    openid: app.globalData.openid,
                },
                success: function (res) {
                    console.log(res)
                    console.log(res.data[0].package)
                    if (res.statusCode == 500) {
                        wx.showToast({
                            title: '服务器错误',
                            icon: 'none',
                            showCancel: false,
                            duration: 1000
                        })
                    }
                    wx.requestPayment({
                        'timeStamp': res.data[0].timeStamp,
                        'nonceStr': res.data[0].nonceStr,
                        'package': res.data[0].package,
                        'signType': res.data[0].signType,
                        'paySign': res.data[0].sign,
                        'success': function (res) {
                            console.log(res)
                            wx.showToast({
                                title: '支付成功',
                                icon: 'success',
                                showCancel: false,
                                duration: 2000
                            })
                            //新增明细记录
                            var sex = 2
                            if (that.data.sex === '男') {
                                sex = 1
                            } else if (that.data.sex === '女') {
                                sex = 0
                            }
                            wx.request({
                                url: app.globalData.AddAddAccount_url,
                                data: {
                                    shop_id: shop_id,
                                    create_time: util.formatTime3(new Date(), 'Y-M-D h:m:s'),
                                    user_name: that.data.realName,
                                    user_sex: sex,
                                    user_phone: that.data.phone,
                                    prestore_money: that.data.amount_of_deposit,
                                    mode: '微信',
                                    user_balance: 'NaN',
                                    discount: that.data.preferentDiscount,
                                    couponNum: preferent_count,
                                    givingAmount: that.data.givingAmount,
                                    effectiveDay: that.data.effectiveDay,
                                    couponDenomination: preferent_money,
                                    deductionProportion: that.data.deductionProportion,
                                    confirmBy: '',
                                    confirmStatus: 0,
                                    startTime: that.data.startTime ? that.data.startTime : '',
                                    endTime: that.data.endTime ? that.data.endTime : '',
                                    isSuper: that.data.isSuper,
                                    state: 1
                                },
                                header: {
                                    'content-type': 'application/json'
                                },
                                success: res => {
                                    console.log(res)
                                    let money = Number(that.data.number) + Number(that.data.givingAmount)
                                    if (res.data.result.result === 1) {
                                        wx.showModal({
                                            title: '存入成功！',
                                            content: '本次存入成功，已存入' + money + '元' + "\n请等待管理员确认",
                                            showCancel: false,
                                            success: function (res) {
                                                wx.navigateBack({
                                                    delta: 1,
                                                })
                                            }
                                        })
                                    } else {
                                        wx.showModal({
                                            title: '存入失败',
                                            showCancel: false,
                                        })
                                    }
                                },
                                fail: () => {
                                    wx.showModal({
                                        title: '存入失败',
                                        showCancel: false,
                                    })
                                }
                            })
                        },
                        'fail': function (res) {
                            console.log(res)
                            wx.showModal({
                                title: '提示',
                                content: '支付失败',
                                showCancel: false,
                            })
                        }
                    })
                }
            })
        }
        // 添加粉丝表
        that.selectPublicFans()
    },
//微信存入
wechat_pay: function wechat_pay(e) {
  var that = this;

  var lst=this.data.PreferentList;
  var listIndex=this.data.listIndex;

  if(lst.length<listIndex+1){
    wx.showModal({
      title: '提示',
      content: '请选择充值套餐!',
     })
     return;
  }

  //当前选择的充值套餐
  var item=lst[listIndex];
  var openid = app.globalData.unionID;
  var order_id = '';
  var shop_id = that.data.shop_id;
  var user_id = that.data.user_id;
  var amount_of_deposit = Number(item.prestoreMoneyStart)
  var store_way = '微信';
  var preferent_count = Number(item.preferentCount);
  var deductionProportion=Number(item.deductionProportion);
  var preferent_money = Number(item.prestoreMoneyStart);
  var isSuper=item.isSuper;
  var givingAmount=Number(item.givingAmount);

      //新增预存优惠订单
      wx.request({
          url: app.globalData.allUrl.wxPayPlusPreStoreService,
          method: "GET",
          data: {
              //公众号appid
              appid: 'wx78455227a0fd853f',
              //商户号 诗么普
              mch_id: '1525534221',
              //小程序id
              sub_appid: "wx7601bb0ab62f48aa",
              //孟贲账户
              sub_mch_id: app.globalData.shopdetail.sub_merchants_id ? app.globalData.shopdetail.sub_merchants_id : '1615440524',
              //支付说明
              body: '预存金额存入',
              //订单号
              out_trade_no: util.formatTime(new Date()).replace('/', "").replace('/', "").replace(" ", "").replace(":", "").replace(":", "") + that.data.phone,
              //支付接口
              trade_type: 'JSAPI',
              //支付金额(单位分)
              total_fee: that.data.amount_of_deposit * 100,                    
              //用户openid
              openid: app.globalData.openid,
          },
          success: function (res) {
              console.log(res)
              console.log(res.data[0].package)
              if (res.statusCode == 500) {
                  wx.showToast({
                      title: '服务器错误',
                      icon: 'none',
                      showCancel: false,
                      duration: 1000
                  })
              }
              wx.requestPayment({
                  'timeStamp': res.data[0].timeStamp,
                  'nonceStr': res.data[0].nonceStr,
                  'package': res.data[0].package,
                  'signType': res.data[0].signType,
                  'paySign': res.data[0].sign,
                  'success': function (res) {
                      console.log(res)
                      wx.showToast({
                          title: '支付成功',
                          icon: 'success',
                          showCancel: false,
                          duration: 2000
                      })
                      
                      //新增明细记录
                      var sex = 2
                      if (that.data.sex === '男') {
                          sex = 1
                      } else if (that.data.sex === '女') {
                          sex = 0
                      }
                      wx.request({
                          url: app.globalData.AddAddAccount_url,
                          data: {
                              shop_id: shop_id,
                              create_time: util.formatTime3(new Date(), 'Y-M-D h:m:s'),
                              user_name: that.data.realName,
                              user_sex: sex,
                              user_phone: that.data.phone,
                              prestore_money: amount_of_deposit,
                              mode: store_way,
                              user_balance: 'NaN',
                              discount: 0,
                              couponNum: 0,
                              givingAmount: givingAmount,
                              effectiveDay: 0,
                              couponDenomination: 0,
                              deductionProportion: deductionProportion,
                              confirmBy: '',
                              confirmStatus: 0,
                              startTime: that.data.startTime ? that.data.startTime : '',
                              endTime: that.data.endTime ? that.data.endTime : '',
                              isSuper: isSuper,
                              state: 1
                          },
                          header: {
                              'content-type': 'application/json'
                          },
                          success: res => {
                              console.log(res)
                              let money = Number(that.data.number) + Number(that.data.givingAmount)
                              if (res.data.result.result === 1) {
                                  wx.showModal({
                                      title: '存入成功！',
                                      content: '本次存入成功，已存入' + money + '元' + "\n请等待管理员确认",
                                      showCancel: false,
                                      success: function (res) {
                                          wx.navigateBack({
                                              delta: 1,
                                          })
                                      }
                                  })
                              } else {
                                  wx.showModal({
                                      title: '存入失败',
                                      showCancel: false,
                                  })
                              }
                          },
                          fail: () => {
                              // wx.showModal({
                              //     title: '存入失败',
                              //     showCancel: false,
                              // })
                              //测试写入
                          }
                      })
                  },
                  'fail': function (res) {
                      console.log(res)
                      wx.showModal({
                          title: '提示',
                          content: '支付失败',
                          showCancel: false,
                      })

                      //测试写入




                      //新增明细记录
                      var sex = 2
                      if (that.data.sex === '男') {
                          sex = 1
                      } else if (that.data.sex === '女') {
                          sex = 0
                      }
                      var url=''+app.globalData.AddAddAccount_url;
                      url='http://localhost:8083/WX%20Restaurant/AddAddAccount'
                      wx.request({
                          url: url,
                          data: {
                              shop_id: shop_id,
                              create_time: util.formatTime3(new Date(), 'Y-M-D h:m:s'),
                              user_name: that.data.realName,
                              user_sex: sex,
                              user_phone: that.data.phone,
                              prestore_money: amount_of_deposit,
                              mode: store_way,
                              user_balance: 'NaN',
                              discount: 0,
                              couponNum: 0,
                              givingAmount: givingAmount,
                              effectiveDay: 0,
                              couponDenomination: 0,
                              deductionProportion: deductionProportion,
                              confirmBy: '',
                              confirmStatus: 0,
                              startTime: that.data.startTime ? that.data.startTime : '',
                              endTime: that.data.endTime ? that.data.endTime : '',
                              isSuper: isSuper,
                              state: 1
                          },
                          header: {
                              'content-type': 'application/json'
                          },
                          success: res => {
                              console.log(res)
                              let money = Number(that.data.number) + Number(that.data.givingAmount)
                              if (res.data.result.result === 1) {
                                  wx.showModal({
                                      title: '存入成功！',
                                      content: '本次存入成功，已存入' + money + '元' + "\n请等待管理员确认",
                                      showCancel: false,
                                      success: function (res) {
                                          wx.navigateBack({
                                              delta: 1,
                                          })
                                      }
                                  })
                              } else {
                                  wx.showModal({
                                      title: '存入失败',
                                      showCancel: false,
                                  })
                              }
                          },
                          fail: () => {
                              // wx.showModal({
                              //     title: '存入失败',
                              //     showCancel: false,
                              // })
                              //测试写入
                          }
                      })








                  }
              })
          }
      })
  
  // 添加粉丝表
  that.selectPublicFans()
},

    selectPublicFans() {
        let that = this
        // 查询是否关注
        wx.request({
            url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
            data: {
                unionId: app.globalData.unionID,
            },
            success: res => {
                let isFocus = 0
                if (res.data.list != null && res.data.list != "" && res.data.list.isFocus != '0') {
                    isFocus = 1
                }
                // 添加粉丝表
                wx.request({
                    url: app.globalData.addOrUpdatePublicFans,
                    method: 'POST',
                    data: {
                        shopId: that.data.shop_id,
                        customerId: app.globalData.customerInf.id,
                        focusId: isFocus == 0 ? '00000000-0000-0000-0000-000000000000' : res.data.list.focusId,
                        fansSource: '',
                        nickName: app.globalData.customerInf.name,
                        isFocus: isFocus,
                        fansSex: app.globalData.customerInf.gender == "未知" ? 0 : app.globalData.customerInf.gender == "男" ? 1 : 2,
                        unionId: app.globalData.unionID
                    },
                    success: res => {
                        if (res.data.code == 1) {
                            console.log("添加粉丝成功");
                        } else {
                            console.log("添加粉丝失败");
                        }
                    }
                })
            }
        })
    },
    alipay: function () {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '请移步到前台咨询相关操作',
        })
    },

    bank_card_pay: function () {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '请移步到前台咨询相关操作',
        })
    },

    cash_pay: function () {
        var that = this;
        wx.showModal({
            title: '提示',
            content: '请移步到前台咨询相关操作',
        })
    },

    //0微信支付 1是支付宝支付 2是银行卡 3是现金
    changemodelweixin: function () {
        var that = this;
        if (that.data.paymentweixin_status != 0) {
            that.setData({
                paymentweixin_status: 0,
                paymentzhifubao_status: 0,
                paymentbankcard_status: 0,
                paymentcash_status: 0
            })
        }
    },
    changemodelzhifubao: function () {
        var that = this;
        if (that.data.paymentzhifubao_status != 1) {
            that.setData({
                paymentweixin_status: 1,
                paymentzhifubao_status: 1,
                paymentbankcard_status: 1,
                paymentcash_status: 1
            })
        }
    },
    changemodelbankcard: function () {
        var that = this;
        if (that.data.paymentbankcard_status != 2) {
            that.setData({
                paymentweixin_status: 2,
                paymentzhifubao_status: 2,
                paymentbankcard_status: 2,
                paymentcash_status: 2
            })
        }
    },
    changemodelcash: function () {
        var that = this;
        if (that.data.paymentcash_status != 3) {
            that.setData({
                paymentweixin_status: 3,
                paymentzhifubao_status: 3,
                paymentbankcard_status: 3,
                paymentcash_status: 3
            })
        }
    },
    getNum(e) {
        var that = this;
        if (!(/^[0-9]*$/.test(e.detail.value))) {
            wx.showToast({
                title: '请输入整数的金额',
                icon: 'none',
                duration: 2000,
            })
            that.setData({
                number: ''
            })
        } else {
            that.setData({
                number: e.detail.value
            })
        }
    },
    radioChange(e) {
        console.log(e);
        let a = e.detail.value
        this.setData({
            isSuper: a
        })

    },

    selectGiveGiftRule() {
        let that = this;
        wx.request({
            url: app.globalData.selectGiveGiftRule,
            data: {
                shop_id: that.data.shop_id,
                shop_preferentid_id: that.data.pid,
            },
            success: res => {
                if (res.data.code == 1) {
                    that.setData({
                        giftRuleList: res.data.data
                    })
                }
            }
        })
    },

    numbindblur() {
        var that = this;
        let num = Number(that.data.number)
        console.log(num)
        if (that.data.number == null || that.data.number == '') {
            wx.showModal({
                title: '提示',
                content: '请输入要充值的金额!',
            })
        } else {
            wx.showModal({
                title: '确定充值:' + num + '元',
                cancelText: '返回',
                confirmText: '确定',
                success(res) {
                    if (res.confirm) {
                        console.log('确定');
                        that.setData({
                            closeInput: true,
                            radioDisabled: true,
                            amount_of_deposit: num,
                        })
                        if (num < that.data.prestoreMoneymin) {
                            let money = Number(that.data.existingBalance) + Number(that.data.number) + Number(that.data.givingAmount)
                            that.setData({
                                user_balance: money
                            })
                        }
                        if (num >= that.data.prestoreMoneymin && num <= that.data.prestoreMoneymax) {
                            console.log(num)
                            wx.request({
                                url: app.globalData.selectObjByMoney_url,
                                data: {
                                    isSuper: that.data.isSuper,
                                    shopId: that.data.shop_id,
                                    prestoreMoney: num,
                                },
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                },
                                success: function (res) {
                                    if (res.data.code === "1") {
                                        let nowA = Date.parse(new Date())
                                        let endA = res.data.objByMoney.endTime
                                        let thesecond = 24 * 60 * 60 * 1000;
                                        var availableDays = parseInt((Number(endA) - Number(nowA)) / thesecond)
                                        console.log(availableDays, '天数');
                                        if (res.data.objByMoney.useStatus === 0 && nowA < endA) {
                                            console.log("启用且有效");
                                            let money = Number(that.data.existingBalance) + Number(that.data.number) + Number(res.data.objByMoney.givingAmount)
                                            if (Number(res.data.objByMoney.effectiveDay) === 0) {
                                                var effective = availableDays
                                            } else {
                                                if (Number(availableDays) < Number(res.data.objByMoney.effectiveDay)) {
                                                    var effective = availableDays
                                                } else {
                                                    var effective = res.data.objByMoney.effectiveDay
                                                }
                                            }

                                            that.setData({
                                                pid: res.data.objByMoney.pid,
                                                user_balance: money,
                                                givingAmount: res.data.objByMoney.givingAmount,
                                                preferentCount: res.data.objByMoney.preferentCount,
                                                preferentDiscount: res.data.objByMoney.preferentDiscount,
                                                preferentMoney: res.data.objByMoney.preferentMoney,
                                                preferentidRules: res.data.objByMoney.preferentGift,
                                                couponName: res.data.objByMoney.prestoreName,
                                                deductionProportion: res.data.objByMoney.deductionProportion,
                                                startTime: res.data.objByMoney.startTime,
                                                endTime: res.data.objByMoney.endTime,
                                                isSuper: res.data.objByMoney.isSuper,
                                                effectiveDay: effective
                                            }, () => {
                                                that.selectGiveGiftRule();
                                            })
                                        }
                                    }


                                }
                            })
                        }
                        if (num > that.data.prestoreMoneymax) {
                            wx.request({
                                url: app.globalData.selectObjByMoney_url,
                                // url:'http://localhost:8088/evaluation/selectObjByMoney',
                                data: {
                                    shopId: that.data.shop_id,
                                    prestoreMoney: that.data.prestoreMoneymax,
                                },
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                },
                                success: function (res) {
                                    console.log(res)
                                    if (res.data.code === "1") {
                                        let nowA = Date.parse(new Date())
                                        let endA = Date.parse(res.data.objByMoney.endTime)
                                        let thesecond = 24 * 60 * 60 * 1000;
                                        var availableDays = parseInt((Number(endA) - Number(nowA)) / thesecond)
                                        console.log(availableDays, '天数');
                                        if (res.data.objByMoney.useStatus === 0 && nowA < endA) {
                                            console.log("启用且有效");
                                            let money = Number(that.data.existingBalance) + Number(that.data.number) + Number(res.data.objByMoney.givingAmount)
                                            if (Number(res.data.objByMoney.effectiveDay) === 0) {
                                                var effective = availableDays
                                            } else {
                                                if (Number(availableDays) < Number(res.data.objByMoney.effectiveDay)) {
                                                    var effective = availableDays
                                                } else {
                                                    var effective = res.data.objByMoney.effectiveDay
                                                }
                                            }
                                            that.setData({
                                                user_balance: money,
                                                givingAmount: res.data.objByMoney.givingAmount,
                                                preferentCount: res.data.objByMoney.preferentCount,
                                                preferentDiscount: res.data.objByMoney.preferentDiscount,
                                                preferentMoney: res.data.objByMoney.preferentMoney,
                                                preferentidRules: res.data.objByMoney.preferentGift,
                                                couponName: res.data.objByMoney.prestoreName,
                                                deductionProportion: res.data.objByMoney.deductionProportion,
                                                startTime: res.data.objByMoney.startTime,
                                                endTime: res.data.objByMoney.endTime,
                                                isSuper: res.data.objByMoney.isSuper,
                                                effectiveDay: effective
                                            })
                                        }
                                    }
                                }
                            })
                        }
                    }
                }
            })
        }

        // that.setData({
        //   preferentidRules: '',
        //   preferentCount: '',
        //   preferentDiscount: '',
        //   preferentMoney: '',
        //   amount_of_deposit: num,
        // })
        // console.log(that.data.prestoreMoneymin, 'min');
        // console.log(that.data.prestoreMoneymax, 'max');
        // if (num >= that.data.prestoreMoneymin && num <= that.data.prestoreMoneymax) {
        //   console.log(num)
        //   wx.request({
        //     url: app.globalData.selectpreference_url,
        //     data: {
        //       shopId: that.data.shop_id,
        //       prestoreMoney: num,
        //     },
        //     header: {
        //       'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
        //     },
        //     method: 'POST',
        //     success: function (res) {
        //       console.log(res)
        //       that.setData({
        //         preferentCount: res.data[0].preferentCount,
        //         preferentDiscount: res.data[0].preferentDiscount,
        //         preferentMoney: res.data[0].preferentMoney,
        //         preferentidRules: res.data[0].present,
        //         couponName: res.data[0].prestoreName
        //       })
        //     }
        //   })
        // }
        // if (num > that.data.prestoreMoneymax) {
        //   console.log(111)
        //   wx.request({
        //     url: app.globalData.selectpreference_url,
        //     data: {
        //       shopId: that.data.shop_id,
        //       prestoreMoney: that.data.prestoreMoneymax,
        //     },
        //     header: {
        //       'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
        //     },
        //     method: 'POST',
        //     success: function (res) {
        //       console.log(res)
        //       that.setData({
        //         preferentCount: res.data[0].preferentCount,
        //         preferentDiscount: res.data[0].preferentDiscount,
        //         preferentMoney: res.data[0].preferentMoney,
        //       })
        //     }
        //   })
        // }
        // console.log(222)
    },
    onShow: function () {
        var that = this;
        //查询顾客是否已注册
        //that.getCustomerInfo(app.globalData.openid, app.globalData.unionID, that.data.shop_id)
    },

    onLoad: function (options) {
        var that = this;
        that.setData({
            shop_name: options.shopName,
            shop_id: options.shopId
        })

        this.selectCustomerInfByOpenIdNew();

        var shop_id = that.data.shop_id;
        var openid = app.globalData.unionID;
        console.log(app.globalData.unionID, 'unionId');
        console.log(app.globalData.openid, 'openId');
        console.log("openid:" + openid);
        console.log("shop_id:" + shop_id);

        //加载礼物规则与预存优惠规则
        var param = {
            "shop_id": shop_id
        };
        wx.request({
            url: app.globalData.discountRules_url,
            data: JSON.stringify(param),
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
                //礼物规则与预存优惠规则赋值
                that.setData({
                    // preferentidRule: res.data.discount_rules, //优惠礼物
                    preferentidGift: res.data.gift_rules //优惠规则
                })
            }
        })


        wx.setNavigationBarTitle({
            title: that.data.shop_name,
        })

        // //加载用户余额
        // var param2 = {
        //   "shop_id": shop_id,
        //   "openid": app.globalData.unionID
        // };
        // console.log(JSON.stringify(param2)) 
        // wx.request({
        //   url: app.globalData.openidQueryUserInfo_url,
        //   data: JSON.stringify(param2),
        //   header: {
        //     'content-type': 'application/json'
        //   },
        //   method: 'POST',
        //   success: function(res) {
        //     //用户余额赋值
        //     that.setData({
        //       user_balance: res.data.userBalance,
        //       user_id: res.data.userID
        //     });
        //   }
        // })


        var time = util.formatTime(new Date());
        this.setData({
            dates: time,
        })
        if (app.globalData.userInfo) {
            this.setData({
                userInfo: app.globalData.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            app.userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.globalData.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    })
                }
            })
        }

        wx.request({ //获取最低的开始价格和最高的结束价格
            url: app.globalData.selectpreferencemaxandmin_url,
            data: {
                shopId: that.data.shop_id,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                that.setData({
                    prestoreMoneymax: res.data.prestoreMoneymax,
                    prestoreMoneymin: res.data.prestoreMoneymin
                })
            },
        })

        that.selectShopPreferentid();
        // getUserInfo: function (e) {
        //   app.globalData.userInfo = e.detail.userInfo
        //   this.setData({
        //     userInfo: e.detail.userInfo,
        //     hasUserInfo: true
        //   })
        // },

        // submitSub: function (e) {
        //   var that = this;
        //   wx.request({
        //     url: app.globalData.wxPayPlusService,
        //     method: 'GET',
        //     data: {
        //       appid: 'wx91f23c5fa6378695',
        //       mch_id: '1525534221',
        //       sub_appid: that.data.appid,
        //       // sub_mch_id: '1524899351',
        //       sub_mch_id: '1540824111',
        //       body: '中国',
        //       out_trade_no: '197779798778',
        //       // out_trade_no: '19101416401265640',
        //       total_fee: '1',
        //       trade_type: 'JSAPI',
        //       openid: app.globalData.unionID,
        //       formId: e.detail.formId,
        //       profit_sharing: 0
        //     },
        //     success: function (res) {}
        //   })
        //   if (!e.detail.value.number) {
        //     wx.showToast({
        //       title: '请输入充值金额',
        //       icon: 'none',
        //       duration: 1000,
        //     })
        //     return false;
        //   }
        //   wx.request({
        //     url: app.globalData.WxPayPlusService,
        //     method: 'GET',
        //     data: {
        //       appid: 'wx91f23c5fa6378695',
        //       mch_id: '1509704181',
        //       sub_appid: that.data.appid,
        //       sub_mch_id: '1524899351',
        //       body: '中国',
        //       out_trade_no: '197779798778',
        //       total_fee: '1',
        //       trade_type: 'JSAPI',
        //       openid: app.globalData.unionID,
        //       price: e.detail.value.number,
        //       profit_sharing: 0
        //     },
        //     success(res) {
        //       if (res.data.code == 200) {
        //         wx.requestPayment({
        //           timeStamp: res.data[0].timeStamp,
        //           nonceStr: res.data[0].nonceStr,
        //           package: res.data[0].package,
        //           signType: 'MD5',
        //           paySign: res.data[0].sign,
        //           success: function (res) {
        //             wx.showToast({
        //               title: '支付成功',
        //               icon: 'success',
        //               duration: 1000,
        //             })
        //             that.setData({
        //               now_money: parseFloat(that.data.now_money) + parseFloat(e.detail.value.number)
        //             });
        //             setTimeout(function () {
        //               wx.navigateTo({
        //                 url: '/pages/main/main?now=' + that.data.now_money + '&uid=' + app.globalData.uid,
        //               })
        //             }, 1200)
        //           },
        //           fail: function (res) {
        //             wx.showToast({
        //               title: '支付失败',
        //               icon: 'success',
        //               duration: 1000,
        //             })
        //           },
        //           complete: function (res) {
        //             if (res.errMsg == 'requestPayment:cancel') {
        //               wx.showToast({
        //                 title: '取消支付',
        //                 icon: 'none',
        //                 duration: 1000,
        //               })
        //             }
        //           },
        //         })
        //       } else {
        //         wx.showToast({
        //           title: '支付失败',
        //           icon: 'none',
        //           duration: 1000,
        //         })
        //       }
        //     }
        //   })
        // },
        // jumpmingxi: function () {
        //   wx.navigateTo({
        //     url: '../balance_list/balance_list'
        //   });
        // },
        // jumpmingxi: function() {
        //   wx.navigateTo({
        //     url: '../balance_list/balance_list',
        //   });
        // },

        // //公私户设置
        // var payment_address
        // var sub_merchants_id = app.globalData.shopdetail.sub_merchants_id
        // var cusid = app.globalData.cusid
        // var SYB_APPID = app.globalData.SYB_APPID
        // if ((app.globalData.managementData.pay_address == 0 || app.globalData.managementData.pay_address == 1) && !(sub_merchants_id == '' || sub_merchants_id == null || sub_merchants_id == 'null' || sub_merchants_id == 'undefined' || sub_merchants_id == undefined || sub_merchants_id == 0)) {
        //   payment_address = 1
        // } else {
        //   payment_address = 2
        // }
        // if (payment_address == 2 && (cusid == '' || cusid == null || cusid == 'null' || cusid == 'undefined' || cusid == undefined || SYB_APPID == '' || SYB_APPID == 'null' || SYB_APPID == 'undefined' || SYB_APPID == null || SYB_APPID == undefined)) {
        //   if (sub_merchants_id == '' || sub_merchants_id == null || sub_merchants_id == 'null' || sub_merchants_id == 'undefined' || sub_merchants_id == undefined) {
        //     //也没有公户商家号，不能支付
        //     payment_address = 3
        //   } else {
        //     //没有对应的私户信息，只能公户支付
        //     payment_address = 1
        //   }
        // }
        // that.setData({
        //   payment_address: payment_address
        // })
    },

    selectShopPreferentid() {
        let that = this;
        wx.request({
            url: app.globalData.selectShopPreferentid_url,
            // url: app.globalData.selectShopAvailableInfo,
            // url: 'http://192.168.8.18:8088/evaluation/selectShopAvailableInfo',
            data: {
                shopId: that.data.shop_id,
            },
            success: res => {
                if (res.data) {
                    let PreferentList = res.data;

                    const stableSorting = (item1, item2) => {
                        if (item1.prestoreMoneyStart < item2.prestoreMoneyStart) return -1;
                        if (item1.prestoreMoneyStart == item2.prestoreMoneyStart) {
                            if (item1.prestoreMoneyEnd < item2.prestoreMoneyEnd) return -1;
                            if (item1.prestoreMoneyEnd == item2.prestoreMoneyEnd) {
                                if (item1.givingAmount < item2.givingAmount) return -1;
                            }
                        }
                        return 1;
                    };

                    PreferentList.sort(stableSorting);
                    if(PreferentList.length>0){
                      
                      that.setData({
                        prestoreName:PreferentList[0].prestoreName,
                        preferentRule:PreferentList[0].preferentRule,
                        listIndex:0,
                      })
                      this.setItemData(PreferentList[0],0);
                    }

                    that.setData({
                        PreferentList: PreferentList
                    })
                }

                // if(res.data.code == 1){
                //   let PreferentList = res.data.data;

                //   const stableSorting = (item1, item2) => {
                //     if (item1.prestoreMoneyStart < item2.prestoreMoneyStart) return -1;
                //     if (item1.prestoreMoneyStart == item2.prestoreMoneyStart){
                //       if(item1.prestoreMoneyEnd < item2.prestoreMoneyEnd) return -1;
                //       if(item1.prestoreMoneyEnd == item2.prestoreMoneyEnd){
                //         if(item1.givingAmount < item2.givingAmount) return -1;
                //       }
                //     }
                //     return 1;
                //   };

                //   PreferentList.sort(stableSorting);

                //   that.setData({
                //     PreferentList: PreferentList
                //   })
                // }
            }
        })
    },
    // //存代金券优惠券
    // managementCoupons(preferentMoney, preferentCount) {
    //   let that = this

    //   var totalAmount = preferentMoney * preferentCount
    //   //新增优惠券
    //   wx.request({
    //     url: app.globalData.SavePeopleCoupons_Url,
    //     method: 'POST',
    //     data: {
    //       couponName: that.data.couponName, //优惠名称
    //       denomination: preferentMoney, //面额
    //       couponsNum: preferentCount, //数量
    //       customerId: that.data.customerId, //顾客id
    //       shopId: that.data.shop_id, //店铺id
    //       totalAmount: totalAmount, //总金额
    //       effectiveDay: that.data.effectiveDay, //有效天数
    //       obtainWay: 0, //获取方式  0-充值赠送
    //       couponsType: 0 //类别 0-优惠券 1-代金券
    //     },
    //     success: res => {
    //       console.log(res.data, '1-优惠券管理信息新增成功 0-失败');
    //     }
    //   })
    // },
    //获取customer信息
    getCustomerInfo(openId, unionId, shopId) {
        let that = this
        wx.request({
            url: app.globalData.selectCustomerInfByOpenId_url,
            // url: 'http://localhost:8887/evaluation_war/selectCustomerInfByOpenId',
            method: 'POST',
            data: {
                openid: openId
            },
            header: {
                'content-type': 'application/json;charset=utf-8' // 默认值
            },
            success: function (res) {
                that.setData({
                    phone: res.data.phone,
                    sex: res.data.gender,
                    realName: res.data.realName,
                    customerId: res.data.id
                })
                if (res.data.signIn != 1) {
                    wx.showModal({
                        title: '您尚未注册平台,不能进行预存操作!',
                        cancelText: '返回',
                        confirmText: '去注册',
                        success(res) {
                            console.log(res.confirm);
                            console.log(res.cancel);
                            if (res.confirm) {
                                console.log('注册');
                                if (openId != '' || openId != undefined) {
                                    wx.navigateTo({
                                        url: '../register/register?openId=' + openId + '&unionId=' + unionId,
                                    })
                                }
                            } else if (res.cancel) {
                                console.log('返回');
                                wx.navigateBack({
                                    delta: 1,
                                })
                            }
                        }
                    })
                } else {
                    if (res.data.password == '') {
                        wx.showModal({
                            title: "预存支付密码为空，不能进行预存操作\n\t\r请设置密码",
                            confirmText: '去设置',

                            success: res => {
                                if (res.confirm) {
                                    wx.navigateTo({
                                        url: '/pages/module_others/pages/setUp/setUp',
                                    })
                                }
                                if (res.cancel) {
                                    wx.navigateBack({
                                        delta: 1,
                                    })
                                }
                            }
                        })
                        return;
                    }
                    that.consumptionDetailed(res.data.phone, shopId)
                    wx.request({
                        url: app.globalData.SelectMemberInfoIs_url,
                        data: {
                            phone: res.data.phone,
                            shop_id: shopId,
                            name: ''
                        },
                        success: res1 => {
                            var a = 0
                            if (res.data.gender === '男') {
                                a = 1
                            }
                            if (res1.data.object.length === 0) {

                                wx.request({
                                    url: app.globalData.AddMemberInfo_url,
                                    // url: 'http://localhost:8087/WX Restaurant/AddMemberInfo',
                                    data: {
                                        phone: res.data.phone,
                                        name: res.data.realName,
                                        nickname: res.data.name,
                                        sex: a,
                                        shop_id: shopId
                                    },
                                    success: res => {
                                        console.log(res);
                                    }
                                })
                            } else {
                                if (res1.data.object[0].signIn === 0) {
                                    that.modifyMemberInfo(res1.data.object[0].ID, openId, unionId, res.data.userCode, a)
                                }
                                console.log(res1, '预存余额');
                                if (res1.data.object[0].prepaidDeposit != undefined || res1.data.object[0].prepaidDeposit > 0) {
                                    console.log(res1.data.object[0].prepaidDeposit, '现有余额');
                                    that.setData({
                                        existingBalance: res1.data.object[0].prepaidDeposit
                                    })
                                }
                            }
                        }
                    })
                }
            }
        })
    },
    selectCustomerInfByOpenIdNew(){

     
      var data={
          openid: app.globalData.openid,
      }
      var that=this;
          wx.request({
              //url: app.globalData.UpdateCustomerByOpenId_Url,
              url:app.globalData.selectCustomerInfByOpenIdNew,
              data: data,
              method: 'POST',
              dataType:'json',
              success: res => {
                      console.log(res);
                      if(res.data.code==1000){
                          //成功
                          console.log("成功")
                          var phone=res.data.data.phone;
                          var name =res.data.data.name;

                          //var avatarUrl=res.data.data.avatarUrl;

                          that.setData({
                            phone:phone,
                            realName:name,
                          })
                          that.setData({

                          })

                         
                         

                      }else{
                          wx.showToast({
                            title: '失败'+res.data.result,
                          })
                      }
                      //获取头像等信息     
              },
              complete:res=>{
               
              }
          });

    },
    //修改memberInfo的注册字段
    modifyMemberInfo(id, openId, unionId, userCode, sex) {
        wx.request({
            // url: 'http://localhost:8087/WX Restaurant/UpdateMember',
            url: app.globalData.UpdateMember_url,
            data: {
                signIn: 1,
                ID: id,
                sex: sex,
                customer_openid: openId,
                customer_unionid: unionId,
                use_code: userCode
            },
            success: res => {
                console.log(res, '修改');
            }
        })
    },

    consumptionDetailed(phone, shopId) {
        let that = this
        wx.request({
            // url: 'http://localhost:8088/evaluation/getConsumptionDetailed',
            url: app.globalData.getConsumptionDetailed_url,
            data: {
                userPhone: phone,
                shopId: shopId,
            },
            success: res => {
                for (let i = 0; i < res.data.length; i++) {
                    if (res.data[i].confirmStatus) {
                        that.setData({
                            changeColor: true
                        })
                    }

                }
            }
        })
    },

    jumpmingxi: function () {
        wx.navigateTo({
            url: '../balance_list/balance_list?shopId=' + this.data.shop_id + '&shopName=' + this.data.shop_name,
        });
    },

    callPayment: function (pay_param, shop_id, user_id, user_balance) {
        console.log(pay_param)
        wx.requestPayment({
            'timeStamp': pay_param.data.timeStamp,
            'nonceStr': pay_param.data.nonceStr,
            'package': pay_param.data.package,
            'signType': pay_param.data.signType,
            'paySign': pay_param.data.paySign,
            'success': function (res) {
                //支付成功
                wx.showModal({
                    title: '提示',
                    content: '存入成功',
                    success: function (res) {
                        var data = {
                            shop_id: shop_id,
                            user_id: user_id,
                            balance: user_balance
                        };
                        console.log(data)
                        wx.request({ //流水记录
                            url: app.globalData.UpdataPreBalanceServlet_url,
                            // url: "http://localhost:8080/foodMaterial/Servlet/UpdataPreBalanceServlet",
                            data: data,
                            header: {
                                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                            },
                            method: 'POST',
                            success: function (res) {
                                console.log(res)
                            }
                        })

                        if (res.cancel) {
                            //点击取消,刷新页面
                            const pages = getCurrentPages();
                            const perpage = pages[pages.length - 1];
                            perpage.onLoad();
                        } else {
                            //点击确认,刷新页面
                            const pages = getCurrentPages();
                            const perpage = pages[pages.length - 1];
                            perpage.onLoad();
                            that.jumpmingxi(); //跳到消费明细
                        }
                    }
                })
            },
            'fail': function (res) {
                //支付失败
                console.log('fail:' + JSON.stringify(res));
            }
        })

    },
    pay_success: function (shop_id, user_id, user_balance) {
        var that = this
        var data = {
            shop_id: shop_id,
            user_id: user_id,
            balance: user_balance
        };
        console.log(data)
        wx.request({ //流水记录
            url: app.globalData.UpdataPreBalanceServlet_url,
            // url: "http://localhost:8080/foodMaterial/Servlet/UpdataPreBalanceServlet",
            data: data,
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
            }
        })

        if (res.cancel) {
            //点击取消,刷新页面
            const pages = getCurrentPages();
            const perpage = pages[pages.length - 1];
            perpage.onLoad();
        } else {
            //点击确认,刷新页面
            const pages = getCurrentPages();
            const perpage = pages[pages.length - 1];
            perpage.onLoad();
        }
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

})

function onBridgeReady(paramJson) {
    WeixinJSBridge.invoke(
        'getBrandWCPayRequest',
        paramJson,
        function (res) {
            if (res.err_msg == "get_brand_wcpay_request:ok") {

            } else {

            }
        })
}