// pages/order/order.js
//获取应用实例
const app = getApp()
var util = require('../../../../utils/util.js');
const wxpay = require('../../../../utils/wxpay')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showAuthorize: false,
    useTimeList: [],
    sumStarShop: -1,
    sumStarPlatform: -1,
    isUseStarDustCount: -1,
    actualOfUsingStar: -1,
    isUseStarDust: false,
    chooseMeal: [],
    chooseMealIndex: [],
    isChoose: false,
    students: '',
    parents: '',
    inviteOpenId: '', //邀请人openId
    actionSheetHidden: false,
    wechatAppId: 'wx7601bb0ab62f48aa',
    //wsk: 'b7362e5e2b5f32d9c314655b7b28de43',
    num: 1,
    minusStatus: 'disable',
    setMeal: '',
    timeList: [],
    imgUrl: [],
    ladderArr: [],
    setMealTypeList: [],
    orderListCome: false, //判断是否从列表进来，列表进来的话，就是修改状态了
    orderListId: '', //从列表进来带过来的orderid
    Data: [{
      id: 1,
      name: '一'
    },
    {
      id: 2,
      name: '二'
    },
    {
      id: 3,
      name: '三'
    }, {
      id: 4,
      name: '四'
    },
    {
      id: 5,
      name: '五'
    },
    {
      id: 6,
      name: '六'
    },
    {
      id: 7,
      name: '日'
    }
    ],
    actionSheetItems: [{
      bindtap: 1,
      txt: '星期一',
      id: '一'
    },
    {
      bindtap: 2,
      txt: '星期二',
      id: '二'
    },
    {
      bindtap: 3,
      txt: '星期三',
      id: '三'
    },
    {
      bindtap: 4,
      txt: '星期四',
      id: '四'
    },
    {
      bindtap: 5,
      txt: '星期五',
      id: '五'
    },
    {
      bindtap: 6,
      txt: '星期六',
      id: '六'
    },
    {
      bindtap: 7,
      txt: '星期日',
      id: '日'
    }
    ],
    startData: '',
    endData: '',
    CouponList: '',
    distributionFoodInfo: [],
    actualSum: '',
    zone: '请选择配送地址',
    hallFoodChecked: true,
    takeOutFoodChecked: false,
  },

  toSelectZone() {
    wx.navigateTo({
      url: '../zoneList/zoneList',
    })
  },

  changeRadio(e) {
    let that = this;
    that.setData({
      radio: e.detail.value
    }, () => {
      if (e.detail.value == 2) {
        that.setData({
          hallFoodChecked: false,
          takeOutFoodChecked: true,
        })
        if (app.globalData.deliveryAddressInf) {
          that.setData({
            deliveryAddressInf: app.globalData.deliveryAddressInf
          })
        } else {
          wx.request({
            url: app.globalData.selectTicketCustomerAddress,
            data: {
              unionid: app.globalData.unionID
            },
            success: res => {
              if (res.data.code == 1) {
                let deliveryAddressInfList = res.data.data;

                that.setData({
                  deliveryAddressInf: deliveryAddressInfList[0]
                })
              }
              wx.hideLoading()
            }
          })
        }
      } else {
        that.setData({
          deliveryAddressInf: '',
          hallFoodChecked: true,
          takeOutFoodChecked: false,
        })
      }
    })
  },

  showRemarkDialog() {
    let that = this;
    that.setData({
      isShowRemarkDialog: !that.data.isShowRemarkDialog
    })
  },

  cancel() {
    let that = this;
    that.showRemarkDialog();
    app.globalData.deliveryAddressInf = '';
    that.setData({
      radio: 1,
      deliveryAddressInf: '',
      goods_remark: '',
      hallFoodChecked: true,
      takeOutFoodChecked: false,
    })
  },

  useStarDustChange(e) {
    let that = this;

    if (e.detail.value[0] == 1) {
      that.setData({
        isUseStarDust: true,
      }, () => {
        that.useStarCal()
      })
    } else {
      that.setData({
        isUseStarDust: false,
        isUseStarDustCount: 0,
        actualOfUsingStar: 0,
      })
    }
  },

  changIsUseStar() {
    let that = this;
    that.setData({
      isUseStarDust: !that.data.isUseStarDust
    }, () => {
      if (that.data.isUseStarDust) {
        that.useStarCal()
      } else {
        that.setData({
          isUseStarDust: false,
          isUseStarDustCount: 0,
          actualOfUsingStar: 0,
        })
      }
    })
  },

  useStarCal() {
    let that = this;
    let customerInf = that.data.customerInf;
    let setMealInf = that.data.setMeal[0];
    let goodsTotal = setMealInf.useStarDust * that.data.num;

    //领盾购买
    if (setMealInf.wayOfUseStarDust == 4) {
      that.setData({
        isUseStarDustCount: goodsTotal,
        actualOfUsingStar: that.data.actualSum - goodsTotal,
      })
      return;
    }

    //账户星盾为0
    if (customerInf.sum_star_platform == 0 && setMealInf.wayOfUseStarDust == 1) {
      wx.showToast({
        title: '平台星盾为0',
        icon: 'error'
      })
      that.setData({
        isUseStarDust: false
      })
      return;
    } else if (customerInf.sum_star_shop == 0 && setMealInf.wayOfUseStarDust == 2) {
      wx.showToast({
        title: '店铺星盾为0',
        icon: 'error'
      })
      that.setData({
        isUseStarDust: false
      })
      return;
    } else if (customerInf.sum_star_shop == 0 && customerInf.sum_star_platform == 0 && setMealInf.wayOfUseStarDust == 3) {
      wx.showToast({
        title: '星盾余额不足',
        icon: 'error'
      })
      that.setData({
        isUseStarDust: false
      })
      return;
    }

    //商品可使用星盾总数 > 账户星盾
    if (goodsTotal > customerInf.sum_star_platform && setMealInf.wayOfUseStarDust == 1) {
      wx.showModal({
        title: '该商品可使用' + goodsTotal + '星盾,您当前拥有' + customerInf.sum_star_platform + '平台星盾,是否继续使用？',
        success: res => {
          if (res.confirm) {
            that.setData({
              isUseStarDustCount: customerInf.sum_star_platform,
              actualOfUsingStar: that.data.actualSum - customerInf.sum_star_platform,
              sumStarPlatform: 0,
            })
          } else {
            that.setData({
              isUseStarDust: false
            })
          }
        }
      })
    } else if (goodsTotal > customerInf.sum_star_shop && setMealInf.wayOfUseStarDust == 2) {
      wx.showModal({
        title: '该商品可使用' + goodsTotal + '星盾,您当前拥有' + customerInf.sum_star_shop + '店铺星盾,是否继续使用？',
        success: res => {
          if (res.confirm) {
            that.setData({
              isUseStarDustCount: customerInf.sum_star_shop,
              actualOfUsingStar: that.data.actualSum - customerInf.sum_star_shop,
              sumStarShop: 0
            })
          } else {
            that.setData({
              isUseStarDust: false
            })
          }
        }
      })
    } else if (goodsTotal > (customerInf.sum_star_shop + customerInf.sum_star_platform) && setMealInf.wayOfUseStarDust == 3) {
      wx.showModal({
        title: '该商品可使用' + goodsTotal + '星盾,您当前拥有' + customerInf.sum_star_platform + '平台星盾,' + customerInf.sum_star_shop + '店铺星盾,是否继续使用？',
        success: res => {
          if (res.confirm) {
            that.setData({
              isUseStarDustCount: customerInf.sum_star_shop + customerInf.sum_star_platform,
              actualOfUsingStar: that.data.actualSum - (customerInf.sum_star_shop + customerInf.sum_star_platform),
              sumStarShop: 0,
              sumStarPlatform: 0
            })
          } else {
            that.setData({
              isUseStarDust: false
            })
          }
        }
      })
    } else if (goodsTotal <= customerInf.sum_star_platform && setMealInf.wayOfUseStarDust == 1) { //商品可使用星盾总数 <= 账户星盾
      that.setData({
        isUseStarDustCount: goodsTotal,
        actualOfUsingStar: that.data.actualSum - goodsTotal,
        sumStarPlatform: customerInf.sum_star_platform - goodsTotal,
      })
    } else if (goodsTotal <= customerInf.sum_star_shop && setMealInf.wayOfUseStarDust == 2) {
      that.setData({
        isUseStarDustCount: goodsTotal,
        actualOfUsingStar: that.data.actualSum - goodsTotal,
        sumStarShop: customerInf.sum_star_shop - goodsTotal,
      })
    } else if (goodsTotal <= (customerInf.sum_star_shop + customerInf.sum_star_platform) && setMealInf.wayOfUseStarDust == 3) {
      if (goodsTotal <= customerInf.sum_star_shop) {
        that.setData({
          isUseStarDustCount: goodsTotal,
          actualOfUsingStar: that.data.actualSum - goodsTotal,
          sumStarPlatform: customerInf.sum_star_platform,
          sumStarShop: customerInf.sum_star_shop - goodsTotal,
        })
      } else {
        that.setData({
          isUseStarDustCount: goodsTotal,
          actualOfUsingStar: that.data.actualSum - goodsTotal,
          sumStarPlatform: customerInf.sum_star_shop + customerInf.sum_star_platform - goodsTotal,
          sumStarShop: 0
        })
      }
    }
  },

  bindMinus: function () {
    let that = this;
    var num = this.data.num;
    if (num > 1) {
      num--;
    }
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
    if (this.data.id == 0) {
      var actualSum = 0
      if (that.data.setMeal[0].startUsing3 == 1) {
        actualSum = num * (that.data.customerInf1.gender == '女' ? that.data.setMeal[0].ladyPrice : that.data.setMeal[0].manPrice)
      } else {
        actualSum = num * ((this.data.setMeal[0].focus_price > 0 && this.data.checkWxpublic) ? Number(this.data.setMeal[0].focus_price) : this.data.setMeal[0].price)

      }
    } else if (this.data.distribution === '1') {
      var actualSum = num * this.data.distributionFoodInfo[0].distributionPrice
    } else {
      var actualSum = num * ((this.data.CouponList.focus_price > 0 && this.data.checkWxpublic) ? Number(this.data.CouponList.focus_price) : this.data.CouponList.coupon_original)
    }
    this.setData({
      actualSum: actualSum.toFixed(2)
    }, () => {
      if (that.data.isUseStarDust) {
        that.useStarCal()
      }
    })
  },

  selectGuanz: function () {
    let that = this
    wx.request({
      url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
      data: {
        unionId: this.data.unionId
      },
      success: res => {
        this.setData({
          checkWxpublic: res.data.list != null && res.data.list != "" && res.data.list.isFocus != '0'
        }, () => {
          if ((that.data.CouponList.focus_price > 0 || that.data.setMeal[0].focus_price > 0) && that.data.checkWxpublic) {
            that.setData({
              actualSum: that.data.id == 0 ? Number(that.data.setMeal[0].focus_price) : Number(that.data.CouponList.focus_price)
            })
          }
          if (that.focusCB) {
            that.focusCB(true)
          }
        })
      }
    })
  },

  /*点击加号*/
  bindPlus: function () {
    let that = this;
    var num = this.data.num;
    num++;
    var minusStatus = num > 1 ? 'normal' : 'disable';

    if (this.data.setMeal) {
      let ladder = this.data.setMeal[0].ladder
      for (let i = 0; i < ladder.length; i++) {
        if (ladder[0].ladderNumber > 0) {
          if (ladder[0] && (num > ladder[0].limited_number || num > ladder[0].ladderNumber)) {
            wx.showToast({
              title: '已达到抢购上限',
              duration: 1500
            })
            return;
          }
        } else if (ladder[i].ladderNumber > 0 && ladder[i - 1].ladderNumber == 0) {
          if (ladder[i] && (num > ladder[i].limited_number || num > ladder[i].ladderNumber)) {
            wx.showToast({
              title: '已达到抢购上限',
              duration: 1500
            })
            return;
          }
        }
      }
    } else if (this.data.CouponList) {
      let a = this.data.CouponList
      if (a.coupon_purchaselimitation != -1 && num > a.coupon_purchaselimitation) {
        wx.showToast({
          title: '该券限购' + a.coupon_purchaselimitation + '张',
          icon: 'error',
          mask: true,
          duration: 1500
        })
        return;
      }
    } else if (this.data.ladderArr.length > 0) {
      let ladder = this.data.ladderArr

      for (let i = 0; i < ladder.length; i++) {
        // if (Number(ladder[0].ladderNum - ladder[0].userNumber) > 0){
        if (ladder[0] && (num > ladder[0].limited_number || num > Number(ladder[0].ladderNum - ladder[0].userNumber))) {
          wx.showToast({
            title: '已达到抢购上限',
            duration: 1500
          })
          return;
        }
        // }
        // else if(Number(ladder[i].ladderNum - ladder[i].userNumber) > 0 && Number(ladder[i - 1].ladderNumber - ladder[i - 1].userNumber) == 0){
        else if (ladder[i] && (num > ladder[i].limited_number || num > Number(ladder[i].ladderNum - ladder[i].userNumber))) {
          wx.showToast({
            title: '已达到抢购上限',
            duration: 1500
          })
          return;
        }
        // }
      }
    }


    this.setData({
      num: num,
      minusStatus: minusStatus
    })
    if (this.data.id == 0) {
      var actualSum = 0
      if (that.data.setMeal[0].startUsing3 == 1) {
        actualSum = num * (that.data.customerInf1.gender == '女' ? that.data.setMeal[0].ladyPrice : that.data.setMeal[0].manPrice)
      } else {
        actualSum = num * ((this.data.setMeal[0].focus_price > 0 && this.data.checkWxpublic) ? Number(this.data.setMeal[0].focus_price) : this.data.setMeal[0].price)

      }
    } else if (this.data.distribution === '1') {
      var actualSum = num * this.data.distributionFoodInfo[0].distributionPrice
    } else {
      var actualSum = num * ((this.data.CouponList.focus_price > 0 && this.data.checkWxpublic) ? Number(this.data.CouponList.focus_price) : this.data.CouponList.coupon_original)
    }
    this.setData({
      actualSum: actualSum.toFixed(2)
    }, () => {
      if (that.data.isUseStarDust) {
        that.useStarCal()
      }
    })
  },
  /*输入框事件*/
  bindManual: function (e) {
    var num = e.detail.value;
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      num: num,
      minusStatus: minusStatus
    })
  },


  select: function (e) {
    var that = this
    console.log(that.data.setMealID)
    wx.request({
      // url: 'https://test.fsmbdlkj.com/diancanxing/setMeal/selectSetMealInfo',
      url: app.globalData.selectSetMealInfo_url,
      // url: 'http://localhost:8088/setMeal/selectSetMealInfo',
      method: 'POST',
      data: {
        isOrder: 1,
        setMealID: that.data.setMealID,
        shop_id: "",
        startUsing: "",
        typeForSetMeal: ''
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
        let setMeal = that.data.setMeal
        setMeal = res.data.selectResult

        let ladder = setMeal[0].ladder


        for (let i = 0; i < ladder.length; i++) {
          if (ladder[0].ladderNumber > 0) {
            setMeal[0].price = ladder[0].ladderPrice
          } else if (ladder[i].ladderNumber > 0 && ladder[i - 1].ladderNumber == 0) {
            setMeal[0].price = ladder[i].ladderPrice
          }
        }
        that.setData({
          setMeal: setMeal
        }, () => {
          if (that.data.setMeal[0].startUsing3 == 1) {
            let useTimeList = that.data.setMeal[0].usefulDate.split(',');
            let useTimeList1 = []
            for (let a of that.data.aWeek) {
              for (let b of useTimeList) {
                if (a.day == b) {
                  useTimeList1.push(a.newday)
                }
              }
            }
            that.setData({
              useTimeList: useTimeList1
            })
          }
          //获取user_id
          that.getUserInfo()

        })

        //var imgstr = that.data.setMeal[0].pageUrl
        var usefulDate = that.data.setMeal[0].usefulDate
        var time = that.data.setMeal[0].timeForUse

        var num = 1
        var endnum = 0
        //var imgstrid = 1
        // var imgstrendid = 0
        for (var i of time) {
          if (i == ';') {
            that.data.timeList.push(time.substring(endnum, num - 1))
            endnum = num
          }
          if (num == time.length) {
            that.data.timeList.push(time.substring(endnum, time.length))
          }
          num++
        }
        for (var y = 0; y < that.data.timeList.length; y++) {
          if (y % 2 == 0) {
            that.data.timeList[y] = that.data.timeList[y] + '~'
          } else {
            if (y == that.data.timeList.length - 1) { } else {
              if (y == 3) {
                that.data.timeList[y] = that.data.timeList[y] + '\n'
              } else {
                that.data.timeList[y] = that.data.timeList[y] + '|'
              }
            }
          }
        }
        //   for(var z of imgstr){
        //     if(z == ';'){
        //       that.data.imgUrl.push(imgstr.substring(imgstrendid,imgstrid-1))
        //       imgstrendid = imgstrid
        //     }
        //     if(imgstrid == imgstr.length){
        //       that.data.imgUrl.push(imgstr.substring(imgstrendid,imgstrid.length))
        //     }
        //     imgstrid++
        // }
        let text = ''
        var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5', '3,4', '4,5,6,7', '4,5,6', '4,5', '5,6,7', '5,6', '6,7']
        if (usefulDate.substr(usefulDate.length - 1, 1) == ',') {
          usefulDate = usefulDate.substr(0, usefulDate.length - 1)
        }
        if (shit.indexOf(usefulDate) != -1) {
          var day = usefulDate.substring(0, 1).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六') + ' 至 星期' + usefulDate.substring(usefulDate.length - 1, usefulDate.length).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六').replace('7', '日')
          text = '星期' + day + ' 可用'
        } else {
          var usefulDate = usefulDate.split(',')
          var day = ''
          if (usefulDate.indexOf('1') != -1) {
            day += '一、'
          }
          if (usefulDate.indexOf('2') != -1) {
            day += '二、'
          }
          if (usefulDate.indexOf('3') != -1) {
            day += '三、'
          }
          if (usefulDate.indexOf('4') != -1) {
            day += '四、'
          }
          if (usefulDate.indexOf('5') != -1) {
            day += '五、'
          }
          if (usefulDate.indexOf('6') != -1) {
            day += '六、'
          }
          if (usefulDate.indexOf('7') != -1) {
            day += '日、'
          }
          // console.log(day)
          text = '星期' + day.substring(0, day.length - 1) + '可用'
        }

        //别人拉屎我也拉，我直接拉一大坨
        var actualSum = (that.data.setMeal[0].startUsing3 == 1 ? (that.data.customerInf1.gender == '女' ? that.data.setMeal[0].ladyPrice : that.data.setMeal[0].manPrice) : Number(that.data.setMeal[0].price)) * Number(that.data.num)
        console.log(actualSum);
        // var actualSum = Number(that.data.setMeal[0].price) * Number(that.data.num)
        var startTime = util.formatTimeTwo(that.data.setMeal[0].startTime.time, 'Y-M-D')
        var endTime = util.formatTimeTwo(that.data.setMeal[0].endTime.time, 'Y-M-D')
        that.setData({
          actualSum: actualSum.toFixed(2),
          imgUrl: that.data.imgUrl,
          // startData: Data.substring(0, s1),
          usefulDateText: text,
          timeList: that.data.timeList,
          startTime: startTime,
          endTime: endTime
        })

        for (var x of that.data.setMealTypeList) {
          if (x.id == that.data.setMeal[0].setMealType) {
            that.setData({
              setMealType: x.name
            })
          }
        }
        var setMealType = that.data.setMeal[0].setMealType
        for (var t of that.data.Data) {
          if (that.data.startData == t.id) {
            that.setData({
              startData: t.name
            })
          } else if (that.data.endData == t.id) {
            that.setData({
              endData: t.name
            })
          }
        }
      }
    })
  },

  // 获取当前日期，格式为YYYY-MM-DD
  getNowFormatDate: function () {
    var date = new Date();
    var seperator1 = "-";
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    if (month >= 1 && month <= 9) {
      month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
      strDate = "0" + strDate;
    }
    var currentdate = year + seperator1 + month + seperator1 + strDate;
    return currentdate;
  },

  remarkInput(e) {
    let that = this;
    that.setData({
      goods_remark: e.detail.value
    })
  },

  AddTicketOrderInfo: function (e) {
    var that = this
    wx.showLoading({
      title: '请稍后',
      mask: true,
    })

    var num = Number(that.data.num)
    var parents = Number(this.data.parents)
    var students = Number(this.data.students)
    if (that.data.setMeal) {
      if (that.data.setMeal[0].startUsing3 == 1) {
        if (!that.data.usingDate && !that.data.setMeal[0].activityDate.time) {
          wx.showToast({
            title: '请选择日期',
            icon: "error"
          })
          wx.hideLoading({
            success: (res) => { },
          })
          return
        }
      } else if (that.data.setMeal[0].startUsing3 == 3) {

        if (parents + students != num) {
          wx.showToast({
            title: '请输入正确的人数',
            icon: "none"
          })
          wx.hideLoading({
            success: (res) => { },
          })
          return
        }

      }
    }


    var actualOfUsingStar = Number(that.data.actualOfUsingStar) * 100
    var actualSum = Number(that.data.actualSum) * 100

    var price = Number((actualSum).toFixed(2))
    if (that.data.id == 0) {
      var ticket_type = 2
      var ticket_id = that.data.setMeal[0].setMealID
      var order_name = that.data.setMeal[0].setMealName
    } else {
      var ticket_type = 3
      var ticket_id = that.data.coupon_id
      var order_name = that.data.CouponList.coupon_name
    }

    if (that.data.CouponList != '' || that.data.setMeal != '') {
      var n = that.data.num

      let ladderVoucherId = undefined
      let ladderId = undefined
      let dishesId = 0
      if (this.data.setMeal) {
        var ladder = this.data.setMeal[0].ladder
        for (let i = 0; i < ladder.length; i++) {
          if (ladder[i].ladderNumber > 0) {
            ladder = ladder[i]
            ladderId = ladder.id
            break;
          }
        }
        dishesId = this.data.setMeal[0].setMealID
      } else if (this.data.ladderArr.length > 0) {
        var ladderArr = this.data.ladderArr
        for (let i = 0; i < ladderArr.length; i++) {
          if (Number(ladderArr[i].ladderNum - ladderArr[i].userNumber) > 0) {
            ladderArr = ladderArr[i]
            ladderVoucherId = ladderArr.id
            break;
          }
        }
      }
      if (that.data.constituteTypeList) {
        for (let x of that.data.constituteTypeList) {
          let num = 0
          if (x.choosableCount != -1) {
            for (let a of x.setMealConstituteList) {
              if (!a.isChoose) {
                num++
              }
            }
            if (num != x.choosableCount) {
              wx.hideLoading({
                success: (res) => { },
              })
              wx.showToast({
                title: '请选择菜品',
                duration: 1500,
                icon: "error"
              })
              return;
            }
          }
        }
      }
      wx.request({
        url: app.globalData.taocan.AddTicketOrderInfo_url,
        //url: 'http://localhost:8083/WX%20Restaurant/AddTicketOrderInfo',
        data: {
          "constituteTypeList": JSON.stringify(that.data.constituteTypeList) ? JSON.stringify(that.data.constituteTypeList) : '',
          "user_id": app.globalData.user_id,
          "isCoupon": that.data.id == 0 ? 0 : 1,
          "shop_id": that.data.shop_id,
          "ticketNum": 1,
          "order_status": "0",
          "order_remark": "0",
          "ticket_id": ticket_id,
          "ticket_type": ticket_type,
          "ticket_remark": "",
          "appointment": "0",
          "appointment_time": "",
          "order_name": order_name,
          "order_total": that.data.isUseStarDust ? actualOfUsingStar : price,
          "detailed_count": num,
          "telephone": that.data.setMeal != [] ? that.data.setMeal[0].startUsing3 == 1 ? that.data.customerInf1.phone : app.globalData.user_phone : app.globalData.user_phone,
          "user_name": that.data.setMeal != [] ? that.data.setMeal[0].startUsing3 == 1 ? that.data.customerInf1.realName : app.globalData.user_name : app.globalData.customerInf.name ? app.globalData.customerInf.name : '微信用户',
          "ladderId": ladderId,
          "openid": that.data.openid ? that.data.openid : app.globalData.openid,
          "dishesId": dishesId,
          "ladderVoucherId": ladderVoucherId,
          "coupon_id": that.data.coupon_id,
          "inviteOpenId": that.data.inviteOpenId,
          "students": students,
          "parents": parents,
          "unionid": app.globalData.unionID,
          "goods_remark": that.data.goods_remark ? that.data.goods_remark : '',
          "address_uid": that.data.deliveryAddressInf ? that.data.deliveryAddressInf.uid : '',
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
        },
        method: 'POST',
        success: function (res) {
          if (res.data.result.result != 1) {
            wx.hideLoading({
              success: (res) => { },
            })
            wx.showModal({
              title: '提示',
              content: res.data.cause,
              showCancel: false,
            })
            return;
          }
          // if(res.data.result.cause=='insert Sucess.'){
          if (res.data.result.result == 1) {
            app.globalData.deliveryAddressInf = '';
            if (that.data.id == 0) {
              if (that.data.setMeal[0].startUsing3 == 1) { //该套餐属于活动套餐
                var order_code = res.data.object.order_code
                var orderId = res.data.object.order_id
                let activityDates = '';
                let activityDates1 = '';
                if (that.data.setMeal[0].activityDate.time) {
                  var time = new Date(that.data.setMeal[0].activityDate.time);
                  var year = time.getFullYear();
                  var month = time.getMonth() + 1;
                  var date = time.getDate();
                  var hour = time.getHours();
                  var minute = time.getMinutes();
                  var second = time.getSeconds();
                  month = month < 10 ? "0" + month : month;
                  date = date < 10 ? "0" + date : date;
                  hour = hour < 10 ? "0" + hour : hour;
                  minute = minute < 10 ? "0" + minute : minute;
                  second = second < 10 ? "0" + second : second;
                  activityDates = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
                  activityDates1 = year + "年" + month + "月" + date + '日';
                }

                wx.request({ //添加活动报名申请
                  url: app.globalData.addApplyCombo,
                  // url: 'http://192.168.8.5:8088/evaluation/addApplyCombo',
                  method: 'POST',
                  header: {
                    'content-type': "application/json"
                  },
                  data: {
                    customer_open_id: app.globalData.openid,
                    customer_id: that.data.customerInf.id,
                    real_name: that.data.customerInf1.realName ? that.data.customerInf1.realName : '',
                    sex: that.data.customerInf1.gender == "男" ? 1 : 2,
                    age: that.data.customerInf1.age ? that.data.customerInf1.age : 0,
                    phone: that.data.customerInf1.phone ? that.data.customerInf1.phone : '',
                    job: "",
                    address: that.data.customerInf.city ? that.data.customerInf.city : '',
                    dinner_time: that.data.setMeal[0].activityDate.time ? activityDates : that.data.usingDate.replace('年', '-').replace('月', '-').replace('日', ' 00:00:00'),
                    setMealID: that.data.setMeal[0].setMealID,
                    combo_name: that.data.setMeal[0].setMealName,
                    combo_price: that.data.actualSum,
                    union_id: app.globalData.unionID,
                    shop_id: that.data.setMeal[0].shop_id,
                    county_id: 0,
                    customer_remark: that.data.customer_remark ? that.data.customer_remark : "",
                    ticket_order_inf_id: orderId,
                  },
                  success: res => {
                    console.log(res);
                    let sub_mch_id = app.globalData.shopdetail.sub_merchants_id ? app.globalData.shopdetail.sub_merchants_id : '1615440524' //孟贲账户
                    let out_trade_no = order_code
                    let order_id = orderId
                    let shop_id = that.data.shop_id
                    let total_fee = app.globalData.QRCodeVersion == 'release' ? that.data.actualSum * 100 : 1 //支付金额
                    let openid = app.globalData.openid
                    // let inviteOpenId = that.data.inviteOpenId
                    // let profit_sharing = inviteOpenId != '' && inviteOpenId != openid ? 1 : 0
                    // let percent_pay = inviteOpenId != '' && inviteOpenId != openid ? 1 : 0
                    // let percent_total = inviteOpenId != '' && inviteOpenId != openid ? parseInt(((total_fee-(total_fee*0.002))*(percent_pay/100))) : 0
                    // let percent_total = app.globalData.QRCodeVersion == 'release' ? inviteOpenId != '' && inviteOpenId != openid ? that.data.commission_price : 0 : 1
                    wxpay.pay({ //拉起支付
                      sub_mch_id: sub_mch_id,
                      body: '请到订单详情查看',
                      out_trade_no: out_trade_no, //订单号
                      order_id: order_id,
                      shop_id: shop_id,
                      // total_fee:  that.data.actualSum * 100,
                      total_fee: total_fee, //支付金额(单位分)
                      openid: openid,
                      profit_sharing: app.globalData.loveInviterOpenid ? app.globalData.loveInviterOpenid != app.globalData.openid ? 1 : 0 : 0,
                      percent_pay: 0,
                      percent_total: app.globalData.loveInviterOpenid ? app.globalData.loveInviterOpenid != app.globalData.openid ? that.data.customerInf1.gender == '女' ? that.data.setMeal[0].commission_ladyPrice : that.data.setMeal[0].commission_manPrice : 0 : 0,
                      back: res => {
                        if (res.result == 'fail') {
                          wx.hideLoading({
                            success: (res) => { },
                          })
                          wx.showToast({
                            icon: 'error',
                            title: '已取消支付',
                          })
                          return;
                        }
                        if (res.result != 'success') {
                          console.log(res, '不成功');
                          wx.showModal({
                            content: '网络错误，请重试...',
                            showCancel: false,
                          })
                          wx.hideLoading({
                            success: (res) => { },
                          })
                          return
                        }
                        if (app.globalData.loveInviterOpenid) {
                          if (app.globalData.loveInviterOpenid != app.globalData.openid) {
                            wxpay.profitSharing({
                              out_trade_no: out_trade_no, //20位orderCode
                              sub_mch_id: sub_mch_id,
                              openid: app.globalData.loveInviterOpenid, //邀请人的openid
                              description: '分销奖励',
                              amount: parseInt(app.globalData.loveInviterOpenid ? app.globalData.loveInviterOpenid != app.globalData.openid ? that.data.customerInf1.gender == '女' ? that.data.setMeal[0].commission_ladyPrice : that.data.setMeal[0].commission_manPrice : 0 : 0) * 100, //分销返佣  Number(that.data.commision_price) * 100
                              // amount: 0.03 * 100,  //分销返佣  Number(that.data.commision_price) * 100
                              back: res => {
                                app.globalData.loveInviterOpenid = ''
                                if (res.result == 'fail') {
                                  console.log(res, "分销失败")
                                  wx.hideLoading({
                                    success: (res) => { },
                                  })
                                  return
                                }
                                console.log(res, "分享成功");
                              }
                            })
                          }
                        }
                        wx.request({ //支付成功
                          url: app.globalData.updatePaymentDate,
                          // url: 'http://192.168.8.5:8088/evaluation/updatePaymentDate',
                          method: 'POST',
                          data: {
                            ticketOrderInfoId: orderId,
                            shopId: that.data.shop_id,
                            goodsUuid: that.data.setMeal[0].uuid,
                            buyOpenid: app.globalData.openid,
                            incomeOpenid: '',
                            distributionPrice: that.data.actualSum,
                            commissionPrice: that.data.setMeal[0].commission_price,
                            goodsName: that.data.setMeal[0].setMealName,
                            buyNickName: app.globalData.nickName,
                            buyCode: app.globalData.customerInf.userCode,
                            orderNum: that.data.num,
                            packageType: that.data.packageType == "2" ? 0 : 1,
                          },
                          header: {
                            'content-type': 'application/json'
                          },
                          success: res2 => {
                            app.globalData.loveSetMeal = {
                              setMealName: that.data.setMeal[0].setMealName,
                              ladyPrice: that.data.setMeal[0].ladyPrice,
                              manPrice: that.data.setMeal[0].manPrice,
                              usingDate: that.data.setMeal[0].activityDate.time ? activityDates1 : that.data.usingDate,
                              customerInf1: that.data.customerInf1,
                            }
                            wx.hideLoading({
                              success: (res) => { },
                            })
                            wx.navigateBack({
                              delta: 3,
                            })
                          }
                        })
                      }
                    })
                  }
                })

              } else if (that.data.setMeal[0].startUsing3 == 3) { //该套餐属于活动套餐

                var order_code = res.data.object.order_code
                var orderId = res.data.object.order_id
                let activityDates = '';
                let activityDates1 = '';
                if (that.data.setMeal[0].activityDate.time) {
                  var time = new Date(that.data.setMeal[0].activityDate.time);
                  var year = time.getFullYear();
                  var month = time.getMonth() + 1;
                  var date = time.getDate();
                  var hour = time.getHours();
                  var minute = time.getMinutes();
                  var second = time.getSeconds();
                  month = month < 10 ? "0" + month : month;
                  date = date < 10 ? "0" + date : date;
                  hour = hour < 10 ? "0" + hour : hour;
                  minute = minute < 10 ? "0" + minute : minute;
                  second = second < 10 ? "0" + second : second;
                  activityDates = year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
                  activityDates1 = year + "年" + month + "月" + date + '日';
                }

                console.log(res);
                let sub_mch_id = app.globalData.shopdetail.sub_merchants_id ? app.globalData.shopdetail.sub_merchants_id : '1615440524' //孟贲账户
                let out_trade_no = order_code
                let order_id = orderId
                let shop_id = that.data.shop_id
                let total_fee = app.globalData.QRCodeVersion == 'release' ? that.data.actualSum * 100 : 1 //支付金额
                let openid = app.globalData.openid
                // let inviteOpenId = that.data.inviteOpenId
                // let profit_sharing = inviteOpenId != '' && inviteOpenId != openid ? 1 : 0
                // let percent_pay = inviteOpenId != '' && inviteOpenId != openid ? 1 : 0
                // let percent_total = inviteOpenId != '' && inviteOpenId != openid ? parseInt(((total_fee-(total_fee*0.002))*(percent_pay/100))) : 0
                // let percent_total = app.globalData.QRCodeVersion == 'release' ? inviteOpenId != '' && inviteOpenId != openid ? that.data.commission_price : 0 : 1
                wxpay.pay({ //拉起支付
                  sub_mch_id: sub_mch_id,
                  body: '请到订单详情查看',
                  out_trade_no: out_trade_no, //订单号
                  order_id: order_id,
                  shop_id: shop_id,
                  // total_fee:  that.data.actualSum * 100,
                  total_fee: total_fee, //支付金额(单位分)
                  openid: openid,
                  profit_sharing: app.globalData.loveInviterOpenid ? app.globalData.loveInviterOpenid != app.globalData.openid ? 1 : 0 : 0,
                  percent_pay: 0,
                  percent_total: app.globalData.loveInviterOpenid ? app.globalData.loveInviterOpenid != app.globalData.openid ? that.data.customerInf1.gender == '女' ? that.data.setMeal[0].commission_ladyPrice : that.data.setMeal[0].commission_manPrice : 0 : 0,
                  back: res => {
                    if (res.result == 'fail') {
                      wx.hideLoading({
                        success: (res) => { },
                      })
                      wx.showToast({
                        icon: 'error',
                        title: '已取消支付',
                      })
                      // 用于回滚
                      that.deleteTicketByOrderId(order_id)
                      return;
                    }
                    if (res.result != 'success') {
                      console.log(res, '不成功');
                      wx.showModal({
                        content: '网络错误，请重试...',
                        showCancel: false,
                      })
                      wx.hideLoading({
                        success: (res) => { },
                      })
                      // 用于回滚
                      that.deleteTicketByOrderId(order_id)
                      return
                    }
                    // if (app.globalData.loveInviterOpenid) {
                    //   if (app.globalData.loveInviterOpenid != app.globalData.openid) {
                    //     wxpay.profitSharing({
                    //       out_trade_no: out_trade_no, //20位orderCode
                    //       sub_mch_id: sub_mch_id,
                    //       openid: app.globalData.loveInviterOpenid, //邀请人的openid
                    //       description: '分销奖励',
                    //       amount: parseInt(app.globalData.loveInviterOpenid ? app.globalData.loveInviterOpenid != app.globalData.openid ? that.data.customerInf1.gender == '女' ? that.data.setMeal[0].commission_ladyPrice : that.data.setMeal[0].commission_manPrice : 0 : 0) * 100, //分销返佣  Number(that.data.commision_price) * 100
                    //       // amount: 0.03 * 100,  //分销返佣  Number(that.data.commision_price) * 100
                    //       back: res => {
                    //         app.globalData.loveInviterOpenid = ''
                    //         if (res.result == 'fail') {
                    //           console.log(res, "分销失败")
                    //           wx.hideLoading({
                    //             success: (res) => {},
                    //           })
                    //           return
                    //         }
                    //         console.log(res, "分享成功");
                    //       }
                    //     })
                    //   }
                    // }
                    wx.request({ //支付成功
                      url: app.globalData.updatePaymentDate,
                      // url: 'http://192.168.8.5:8088/evaluation/updatePaymentDate',
                      method: 'POST',
                      data: {
                        ticketOrderInfoId: orderId,
                        shopId: that.data.shop_id,
                        goodsUuid: that.data.setMeal[0].uuid,
                        buyOpenid: app.globalData.openid,
                        incomeOpenid: '',
                        distributionPrice: that.data.actualSum,
                        commissionPrice: that.data.setMeal[0].commission_price,
                        goodsName: that.data.setMeal[0].setMealName,
                        buyNickName: app.globalData.nickName,
                        buyCode: app.globalData.customerInf.userCode,
                        orderNum: that.data.num,
                        packageType: that.data.packageType == "2" ? 0 : 1,
                      },
                      header: {
                        'content-type': 'application/json'
                      },
                      success: res2 => {
                        app.globalData.loveSetMeal = {
                          setMealName: that.data.setMeal[0].setMealName,
                          ladyPrice: that.data.setMeal[0].ladyPrice,
                          manPrice: that.data.setMeal[0].manPrice,
                          usingDate: that.data.setMeal[0].activityDate.time ? activityDates1 : that.data.usingDate,
                          customerInf1: that.data.customerInf1,
                        }
                        wx.hideLoading({
                          success: (res) => { },
                        })
                        wx.navigateTo({
                          url: '../orderList/orderList?shop_id=' + that.data.shop_id + '&packageIndex=' + that.data.id,
                        })
                      }
                    })
                  }
                })



              } else {
                wx.hideLoading({
                  success: (res) => { },
                })
                wx.navigateTo({
                  url: '../orderList/orderList?shop_id=' + that.data.shop_id + '&packageIndex=' + that.data.id,
                })
              }
            } else {
              if (that.data.isUseStarDust && that.data.setMeal[0].wayOfUseStarDust != 4) {
                wx.request({
                  url: app.globalData.UpdateUserSumOfStar,
                  // url: 'http://localhost:8087/WX Restaurant/UpdateUserSumOfStar',
                  data: {
                    unionid: app.globalData.unionID,
                    sumStarPlatform: that.data.sumStarPlatform != -1 ? that.data.sumStarPlatform : '',
                    sumStarShop: that.data.sumStarShop != -1 ? that.data.sumStarShop : '',
                  },
                  success: res => {
                    console.log(res, "扣除星盾成功");
                  }
                })
              }
              if (app.globalData.orderListJump) {
                wx.hideLoading({
                  success: (res) => { },
                })
                wx.navigateBack({
                  delta: 1
                })
                app.globalData.orderListJump = false
              } else {
                wx.hideLoading({
                  success: (res) => { },
                })
                wx.navigateTo({
                  url: '../orderList/orderList?shop_id=' + that.data.shop_id + '&packageIndex=' + that.data.id,
                })
              }
            }
            if (that.data.DYUid) {
              wx.request({
                url: app.globalData.updateTikTokBookIsBuyByUid,
                data: {
                  uid: that.data.DYUid
                },
                success: res => {
                  console.log(res)
                }
              })
            }
          } else {
            wx.showModal({
              title: '提示',
              content: '订单创建失败'
            })
            wx.hideLoading({
              success: (res) => { },
            })
          }
        }
      })
    }

    // 添加店铺粉丝
    that.selectPublicFans()
  },

  radioChange(e) {
    console.log(e)
    let date = e.detail.value
    this.setData({
      usingDate: date
    })
  },

  customerRemarkInput(e) {
    this.setData({
      customer_remark: e.detail.value
    })
  },

  dealTime: function (num) {
    var time = new Date()
    var date = new Date(time.setDate(time.getDate() + num)).getDate()
    var year = time.getFullYear()
    var month = time.getMonth() + 1
    var day = time.getDay()
    switch (day) {
      case 0:
        day = "7"
        break
      case 1:
        day = "1"
        break
      case 2:
        day = "2"
        break
      case 3:
        day = "3"
        break
      case 4:
        day = "4"
        break
      case 5:
        day = "5"
        break
      case 6:
        day = "6"
        break
    }
    var obj = {
      date: date,
      day: day,
      month: month,
      newday: year + "年" + month + '月' + date + "日"
    }
    return obj
  },
  next7: function () {
    var arr = []
    for (let i = 0; i < 8; i++) {
      arr.push(this.dealTime(i))
    }
    arr[0].day = '(今天)'
    this.setData({
      aWeek: arr
    }, () => {
      console.log(this.data.aWeek)
    })
  },

  ChangeTicketOrderInfo: function (e) {
    var that = this
    console.log(e)
    var actualSum = Number(that.data.actualSum) * 100
    var num = Number(that.data.num)
    var price = Number((actualSum / num).toFixed(2))
    // if(that.data.distribution === "1"){
    //   var distributionUuid = that.data.distributionFoodInfo[0].distributionUuid 
    //   var order_name = that.data.distributionFoodInfo[0].dishesName 
    //   var ticket_type = 4
    //   let ladderVoucherId = undefined
    //   let ladderId = undefined
    //   let dishesId = 0
    //   var ticket_id = 0
    //   if(num>1){
    //     wx.request({
    //     url: app.globalData.taocan.AddTicketOrderInfo_url,
    //       // url: 'http://localhost:8087/WX Restaurant/AddTicketOrderInfo',
    //       data: {
    //         "user_id": that.data.user_id,
    //         "shop_id": that.data.shop_id,
    //         "ticketNum": 1,
    //         "order_status": "0",
    //         "order_remark": "0",
    //         "ticket_id": ticket_id,
    //         "ticket_type": ticket_type,
    //         "ticket_remark": "",
    //         "appointment": "0",
    //         "appointment_time": "",
    //         "order_name": order_name,
    //         "order_total": price,
    //         "detailed_count": 1,
    //         "orderNum":num-1,
    //         "telephone":app.globalData.user_phone,
    //         "user_name":app.globalData.user_name,
    //         "ladderId":ladderId,
    //         "openid":that.data.openid,
    //         "dishesId":dishesId,
    //         "distributionUuid": distributionUuid,
    //         "ladderVoucherId":ladderVoucherId,
    //         "coupon_id":that.data.coupon_id
    //       },
    //       header: {
    //         'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
    //       },
    //       method: 'POST',
    //       success:res=>{
    //           console.log(res);
    //           if(res.data.result.result == 1){
    //             wx.navigateTo({
    //               url: '../orderList/orderList?shop_id=' + that.data.shop_id,
    //             })
    //           }
    //       }
    //   })
    //   }else{
    //      if(app.globalData.orderListJump){
    //       wx.navigateBack({
    //         delta: 1
    //       })  
    //       app.globalData.orderListJump = false
    //     }
    //   }
    // }else{
    var ticket_type = 2
    var ticket_id = that.data.setMeal[0].setMealID
    var order_name = that.data.setMeal[0].setMealName


    //这里写修改的方法，对当前订单进行修改
    if (num > 1) {
      wx.request({
        url: app.globalData.taocan.AddTicketOrderInfo_url,
        data: {
          "user_id": that.data.user_id,
          // "user_id":2194,                   
          "shop_id": that.data.shop_id,
          "ticketNum": 1,
          "order_status": "0",
          "order_remark": "0",
          "ticket_id": ticket_id,
          "ticket_type": ticket_type,
          "ticket_remark": "",
          "appointment": "0",
          "appointment_time": "",
          "order_name": order_name,
          "order_total": price,
          "detailed_count": 1,
          "orderNum": num - 1,
          "telephone": app.globalData.user_phone,
          "user_name": app.globalData.user_name
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
        },
        method: 'POST',
        success: function (res) {
          console.log(res)
          if (res.data.result.cause == "insert Sucess.") {
            if (app.globalData.orderListJump) {
              wx.navigateBack({
                delta: 1
              })
              app.globalData.orderListJump = false
            } else {
              wx.navigateTo({
                url: '../orderList/orderList',
              })
            }
          }
        }
      })
    } else {
      if (app.globalData.orderListJump) {
        wx.navigateBack({
          delta: 1
        })
        app.globalData.orderListJump = false
      } else {
        wx.navigateTo({
          url: '../orderList/orderList',
        })
      }
    }
    // }
  },

  userInfo: function (e) {
    var that = this
    var unionID = that.data.unionID
    if (unionID != undefined && unionID != null) {
      wx.request({
        url: app.globalData.UserLogin_url,
        data: {
          Open_id: that.data.unionID,
          Shop_id: that.data.shopId
        },
        success: function (res) {
          // app.getCustomerInfo(unionID) //获取用户信息
          if (res.data.result == null || res.data.result.result == 0) {
            wx.request({
              url: app.globalData.UserRegistration_url,
              data: {
                Head_portrait_img: app.globalData.userInfo.avatarUrl,
                User_nickname: app.globalData.username ? app.globalData.username : '暂无',
                Wx_openid: that.data.unionID,
                Shop_id: that.data.shop_id
              },
              success: function (res) {
                app.globalData.user_id = res.data.object[0].user_id
                wx.setStorage({
                  key: "user_id",
                  data: res.data.object[0].user_id
                })
                that.setData({
                  user_id: res.data.object[0].user_id
                })
              },
            })
          } else {
            app.globalData.user_id = res.data.object[0].user_id
            that.setData({
              user_id: res.data.object[0].user_id
            })
            wx.setStorage({
              key: "user_id",
              data: res.data.object[0].user_id
            })
          }
        }
      })
    } else {
      console.log("你的unionId为undefined或null")
    }
  },

  openid: function (e) {
    var that = this
    wx.login({
      success: function (res) {
        console.log(res)
        if (res.code) {
          var code = res.code
          wx.getUserInfo({
            success: function (res) {
              console.log(res)
              wx.request({
                url: app.globalData.allUrl.getUnionID,
                // url: 'https://test.fsmbdlkj.com/register_war/servlet/openIdServlet',
                data: {
                  code: code,
                  encryptedData: res.encryptedData,
                  iv: res.iv,
                  wechatAppId: that.data.wechatAppId,
                  //wsk: that.data.wsk,
                },
                header: {
                  'content-type': 'application/json;charset=utf-8' // 默认值
                },
                method: 'POST',
                success: function (res) {
                  console.log(res)
                  var unionID = res.data.data.unionId
                  var openid = res.data.data.openid

                  console.log('获取unionId成功，用户已授权！')
                  that.setData({
                    unionID: unionID,
                    openid: openid
                  })
                  // that.userInfo()
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
  },
  
  authorization: function (res) {
    var that = this
    wx.showLoading({
      title: '数据加载中...',
    });
    wx.getUserInfo({
      // 获取用户信息
      success: function (res) {
        console.log('已授权')
        console.log(res)
        app.globalData.userInfo = res.userInfo

        wx.hideLoading();
        that.setData({
          userinfo: app.globalData.userInfo,
        })
        if (res.iv) {
          that.openid()
        }
      },
      fail: function (res) {
        console.log('未授权')
        wx.hideLoading();
        app.globalData.userInfo = false
        that.setData({
          userinfo: app.globalData.userInfo,
        })
      }
    })

  },
  selectCoupon: function (e) { //查询代金券
    var that = this
    wx.request({
      url: app.globalData.getCouponByCouponId,
      method: 'GET',
      data: {
        isOrder: 1,
        couponId: that.data.coupon_id
      },
      success: function (res) {
        console.log(res)
        if (res.data == '') {
          that.setData({
            CouponList: ''
          })
        } else {
          var CouponList = res.data.data
          var week = []
          for (var y of that.data.actionSheetItems) {
            if (y.bindtap == CouponList.coupon_ruleweekstar) {
              week.push(y.id)
            }
            if (y.bindtap == CouponList.coupon_ruleweekend) {
              week.push(y.id)
            }
          }

          var actualSum = (CouponList.focus_price > 0 && that.data.checkWxpublic) ? Number(CouponList.focus_price) : CouponList.coupon_original.toFixed(2)
          CouponList.coupon_original = CouponList.coupon_original.toFixed(2)
          wx.request({
            // url:  "http://localhost:8080/WX Restaurant/GetLadderVoucher",
            url: app.globalData.GetLadderVoucher,
            method: 'GET',
            data: {
              shopId: app.globalData.shopid,
              id: that.data.coupon_id
            },
            success: res => {
              let ladderStart = that.data.ladderStart
              let ladder = res.data
              if (res.data.length > 0) {
                ladderStart = true;
                for (let i = 0; i < ladder.length; i++) {
                  if (i == 0 && Number(ladder[i].ladderNum - ladder[i].userNumber) > 0) {
                    CouponList.coupon_original = ladder[i].ladderPrice.toFixed(2)
                    actualSum = ladder[i].ladderPrice
                    CouponList.number = Number(ladder[i].ladderNum - ladder[i].userNumber)
                  } else if (Number(ladder[i].ladderNum - ladder[i].userNumber) > 0 && Number(ladder[i - 1].ladderNum - ladder[i - 1].userNumber) == 0) {
                    CouponList.coupon_original = ladder[i].ladderPrice.toFixed(2)
                    actualSum = ladder[i].ladderPrice
                    CouponList.number = Number(ladder[i].ladderNum - ladder[i].userNumber)
                  }

                }

              }
              that.setData({
                ladderArr: ladder,
                ladderStart: ladderStart,
                CouponList: CouponList,
                week: week,
                actualSum: actualSum
              }, () => {
                //获取user_id
                that.getUserInfo()
              })
            }
          })


          // that.setData({
          //   CouponList: CouponList,
          //   week: week,
          //   actualSum: actualSum
          // })
        }

      }
    })
  },

  getCustomerInfo() {
    let that = this;
    wx.request({
      url: app.globalData.selectCustomerInfByOpenId_url,
      data: {
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: res => {
        if (res.data != null && res.data != '') { //有记录
          app.globalData.customerInf = res.data
          that.setData({
            customerInf: res.data,
          }, () => {
            if (that.data.id == 0) {
              that.select()
            }
            if (that.data.id == 1) {
              that.selectCoupon()
            }

            if (!app.globalData.customerInf.phone) {
              //获取手机号码
              that.setData({
                showAuthorize: true
              })
            } else {
              // 添加顾客信息
              that.selectMember(app.globalData.customerInf.phone, that.data.shop_id, app.globalData.customerInf.userCode, app.globalData.customerInf.name)
            }

          })
        }
      }
    })
  },
  toWXPublic() {
    let that = this
    wx.request({ //发送信息临时表
      url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addLink',
      data: {
        unionId: app.globalData.unionID,
        title: "点击这里继续购买",
        link: 'pages/main/main?focus_path=' + this.data.focus_path
      },
      method: 'GET',
      success(res) {
        wx.removeStorageSync('clip')
        wx.setClipboardData({
          data: that.data.toPublic,
          complete: res => {
            wx.navigateTo({
              url: '/pages/module_others/pages/wxPublic/out',
            })
          }
        })
      }
    })
  },
  getUserInfo: function () {
    var that = this
    that.setData({
      openid: app.globalData.openid,
      unionId: app.globalData.unionID,
    }, () => {
      that.selectGuanz()
      that.focusCB = (bool) => {
        if (that.data.CouponList) {

        }
      }
    })
    if (that.data.unionId != undefined && that.data.unionId != null) {
      wx.request({
        url: app.globalData.UserLogin_url,
        data: {
          Open_id: that.data.unionId,
          Shop_id: that.data.shop_id ? that.data.shop_id : app.globalData.shopid
        },
        success: function (res) {
          if (res.data.result == null || res.data.result.result == 0) {
            wx.request({
              url: app.globalData.UserRegistration_url,
              data: {
                Head_portrait_img: app.globalData.avatarUrl,
                User_nickname: app.globalData.username ? app.globalData.username : '暂无',
                Wx_openid: that.data.unionId,
                Shop_id: that.data.shop_id ? that.data.shop_id : app.globalData.shopid
              },
              success: function (res) {
                app.globalData.user_id = res.data.object.user_id
                wx.setStorage({
                  key: "user_id",
                  data: res.data.object.user_id
                })
                that.setData({
                  user_id: res.data.object.user_id
                })
              },
            })
          } else {
            app.globalData.user_id = res.data.object[0].user_id
            that.setData({
              user_id: res.data.object[0].user_id
            })
            wx.setStorage({
              key: "user_id",
              data: res.data.object[0].user_id
            })
            that.setData({
              showModalStatus1: false
            })
          }
        }
      })
    } else {
      console.log("你的unionId为undefined或null")
    }
  },
  refused() {
    wx.navigateBack({
      delta: 1,
    })
  },
  //获取手机号码
  getPhoneNumber(e) {
    var that = this
    console.log(e.detail);
    wx.login({
      success: function (res) {
        if (res.code) {
          var code = res.code
          wx.request({
            url: app.globalData.allUrl.getPhone,
            data: {
              code: code,
              encryptedData: e.detail.encryptedData,
              iv: e.detail.iv,
              wechatAppId: app.getWechatAppId(),
              //wsk: app.globalData.wsk,
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
              if (res.errMsg == 'request:ok') {
                if (!res.data.phoneNumber) {
                  wx.showModal({
                    title: '提示',
                    content: '访问超时，请重试!',
                    showCancel: false,
                    confirmText: '好的'
                  })
                  return;
                }
                that.setData({
                  showAuthorize: false, //关闭弹窗
                  phonenumber: res.data.phoneNumber
                })
                app.globalData.user_phone = res.data.phoneNumber
                wx.setStorage({
                  key: 'phonenumber',
                  data: res.data.phoneNumber,
                })
                var data = {
                  phone: res.data.phoneNumber,
                  openId: app.globalData.openid
                }
                wx.request({
                  url: app.globalData.UpdateCustomerByOpenId_Url,
                  data: JSON.stringify(data),
                  method: 'POST',
                  success: res2 => {
                    console.log(res2);
                    that.selectMember(app.globalData.user_phone, that.data.shop_id, app.globalData.customerInf.userCode, app.globalData.customerInf.name)
                  }
                })
                app.globalData.phonenumber = e.detail.value
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
  //添加客户信息表
  selectMember(phone, shopId, userCode, nickname) {
    let that = this
    wx.request({
      url: app.globalData.SelectMemberInfoIs_url,
      data: {
        phone: phone,
        shop_id: shopId,
        name: ''
      },
      success: res1 => {
        if (res1.data.object.length === 0) {
          //添加用户信息
          wx.request({
            url: app.globalData.AddMemberInfo_url,
            // url: 'http://localhost:8087/WX Restaurant/AddMemberInfo',
            data: {
              nickname: nickname,
              phone: phone,
              shop_id: shopId,
            },
            success: res => {
            }
          })
        } else {
          if (res1.data.object.userCode) {
            that.modifyMemberInfo(res1.data.object[0].ID, app.globalData.openid, app.globalData.unionID, userCode, nickname)
          }
        }
      }
    })
  },
  // 添加粉丝表
  selectPublicFans() {
    let that = this
    // 查询是否关注
    wx.request({
      url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
      data: {
        unionId: that.data.unionId,
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
            customerId: that.data.customerInf.id,
            focusId: isFocus == 0 ? '00000000-0000-0000-0000-000000000000' : res.data.list.focusId,
            fansSource: '',
            nickName: that.data.customerInf.name,
            isFocus: isFocus,
            fansSex: that.data.customerInf.gender == "未知" ? 0 : that.data.customerInf.gender == "男" ? 1 : 2,
            unionId: that.data.unionId
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
  //修改memberInfo的
  modifyMemberInfo(id, openId, unionId, userCode, nickname) {
    wx.request({
      // url: 'http://localhost:8087/WX Restaurant/UpdateMember',
      url: app.globalData.UpdateMember_url,
      data: {
        nickname: nickname,
        customer_openid: openId,
        customer_unionid: unionId,
        use_code: userCode,
        ID: id
      },
      success: res => {
        console.log(res, '修改');
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(JSON.stringify(options))
    this.setData({
      focus_path: JSON.stringify(options)
    })
    if (wx.getStorageSync('clip')) {
      this.setData({
        toPublic: '】' + wx.getStorageSync('clip') + '#'
      })
      wx.removeStorageSync('clip')
      wx.setClipboardData({
        data: ' ',
        complete: res => {
          wx.hideToast({
            success: (res) => { },
          })
        }
      })
    }
    this.next7()
    var that = this;
    var SYB_APPID = options.SYB_APPID
    var cusid = options.cusid
    var sub_merchants_id = options.sub_merchants_id
    that.setData({
      DYUid: options.DYUid ? options.DYUid : null,
      setMealID: options.setMealID,
      coupon_id: options.coupon_id,
      id: options.id,
      shop_id: options.shop_id,
      SYB_APPID: options.SYB_APPID,
      cusid: options.cusid,
      // distribution: options.distribution,
      sub_merchants_id: options.sub_merchants_id,
      inviteOpenId: options.inviteOpenId ? options.inviteOpenId : '',
    })
    // that.authorization()
    //that.showBusy()
    if (options.isFromBuyLoveSet) {
      that.setData({
        customerInf1: JSON.parse(options.customerInf)
      })
    }
    if (options.orderListCome == 'true') {
      that.setData({
        orderListCome: true,
        orderListId: options.orderListId,
        actualSum: options.OLSum.toFixed(2),
        num: options.OLNum
      })
      // }

    }
    //公私户设置

    var payment_address
    if ((app.globalData.managementData.pay_address == 0 || app.globalData.managementData.pay_address == 1) && !(sub_merchants_id == '' || sub_merchants_id == null || sub_merchants_id == 'null' || sub_merchants_id == 'undefined' || sub_merchants_id == undefined)) {
      payment_address = 1
    } else {
      payment_address = 2
    }
    if (payment_address == 2 && (cusid == '' || cusid == null || cusid == 'null' || cusid == 'undefined' || cusid == undefined || SYB_APPID == '' || SYB_APPID == 'null' || SYB_APPID == 'undefined' || SYB_APPID == null || SYB_APPID == undefined)) {
      if (sub_merchants_id == '' || sub_merchants_id == null || sub_merchants_id == 'null' || sub_merchants_id == 'undefined' || sub_merchants_id == undefined) {
        //也没有公户商家号，不能支付
        payment_address = 3
      } else {
        //没有对应的私户信息，只能公户支付
        payment_address = 1

      }
    }
    that.setData({
      payment_address: payment_address
    })
  },
  bigimg2: function (e) { //查看照片大图
    // console.log(e)
    var that = this;
    var imgBox = []
    if (e.currentTarget.dataset.src.substring(e.currentTarget.dataset.src.length - 2, e.currentTarget.dataset.src.length) != '\r\n') {
      imgBox.push(e.currentTarget.dataset.src.substring(0, e.currentTarget.dataset.src.length - 4) + 'big')
    } else {
      imgBox.push(e.currentTarget.dataset.src.substring(0, e.currentTarget.dataset.src.length - 6) + 'big')
    }
    that.setData({
      imgBox: imgBox
    })
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: imgBox // 需要预览的图片http链接列表
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
    let that = this

    that.setData({
      isUseStarDust: false,
      sumStarShop: -1,
      sumStarPlatform: -1,
      isUseStarDustCount: -1,
      actualOfUsingStar: -1,
    })

    if (app.globalData.deliveryAddressInf) {
      that.setData({
        deliveryAddressInf: app.globalData.deliveryAddressInf
      })
    }


    // let setMeal = that.data.setMeal
    // let actualSum
    // for (const iterator of setMeal) {
    //   actualSum = iterator.price
    // }
    that.selectConstitute()




    that.setData({
      num: 1,
      // actualSum:actualSum,
    })

    that.getCustomerInfo()

  },
  chooseChange: function (e) {
    // 直接拉一大坨shi
    let that = this
    let item = e.currentTarget.dataset.item //选中的  constituteTypeList
    let chooseindex = e.currentTarget.dataset.chooseindex // 选中 constituteTypeList.setMealConstituteList 的下标
    let chooseMeal = that.data.chooseMeal //已选的 constituteTypeList 的下标数组
    let index = e.currentTarget.dataset.index //选中的constituteTypeList 的下标
    let g = true
    let chooseMealIndex = []
    //切换数组
    if (chooseMeal[index]) {
      chooseMealIndex = chooseMeal[index]
    }
    //遍历数组，是否重新点
    for (let x = 0; x < chooseMealIndex.length; x++) {
      if (chooseMealIndex[x] == chooseindex) {
        chooseMealIndex.splice(x, 1)
        g = false
      }
    }
    if (g) {
      chooseMealIndex.push(chooseindex)
    }
    chooseMeal[index] = chooseMealIndex
    that.setData({
      chooseMeal: chooseMeal, // 已选constituteTypeList的下标
      chooseMealIndex: chooseMealIndex, //已选 constituteTypeList.setMealConstituteList的下标
    })
    let d = []
    //判断 已选个数 是否等于 可选数
    if (that.data.chooseMealIndex.length == item.choosableCount) {
      //遍历   constituteTypeList.setMealConstituteList 数组
      for (var i = 0; i < item.setMealConstituteList.length; i++) {
        //判断 已选数组是否含有 constituteTypeList.setMealConstituteList的下标
        if (that.data.chooseMealIndex.indexOf(i) == -1) {
          item.setMealConstituteList[i].isChoose = true
        } else {
          d.push(item.setMealConstituteList[i]) //d  已选的setMealConstituteList
          item.setMealConstituteList[i].isChoose = false
        }
      }
      let constituteTypeList1 = that.data.constituteTypeList //用于修改回显
      constituteTypeList1[index] = item
      that.setData({
        constituteTypeList: constituteTypeList1,
        chooseMealIndex: [],
      })
    } else {
      for (var i = 0; i < item.setMealConstituteList.length; i++) {
        item.setMealConstituteList[i].isChoose = false
      }
      let constituteTypeList1 = that.data.constituteTypeList
      constituteTypeList1[index] = item
      that.setData({
        constituteTypeList: constituteTypeList1
      })
    }
  },
  selectConstitute: function (e) { //阶梯价
    var that = this
    that.setData({
      chooseMealIndex: [],
      chooseMeal: [],
    })
    //console.log(that.data.setMealID)
    wx.request({
      url: app.globalData.taocan.select_constitute_url,
      // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/select_constitute',
      method: 'POST',
      data: {
        setMealID: that.data.setMealID,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res)
        var constituteTypeList = []
        var stituteList = []
        var tapnum = ''
        var num = -1 //类别id
        for (var x of res.data.setmealConstituteUsers) {
          var List = {
            constituteID: "",
            constituteName: "",
            constituteUnit: "",
            constituteNum: "",
            constituteValue: "",
            isChoose: false,
          }
          var TypeList = {
            constituteTypeID: '',
            constituteTypeName: '',
            constituteTypeCount: '',
            choosableCount: '',
            setMealConstituteList: [],
          }
          List.constituteID = x.constituteID
          List.constituteName = x.constituteName
          List.constituteUnit = x.constituteUnit
          List.constituteNum = x.constituteNum
          List.constituteValue = x.constituteValue
          // 前面添加的类别，如果后面有相同的类，就放到前面那个相同的类里
          if (x.constituteTypeID != tapnum) { //判断前后两个类别是否相等
            var typename = '' //如果有相同的类，把那个类存到typename字段中
            if (tapnum == '') { //存储第一个字段
              TypeList.constituteTypeID = x.constituteTypeID
              TypeList.constituteTypeName = x.constituteTypeName
              TypeList.constituteTypeCount = x.constituteTypeCount
              TypeList.choosableCount = x.choosableCount
              constituteTypeList.push(TypeList)
              num++
              constituteTypeList[num].setMealConstituteList.push(List)
            } else { //如果不是第一个字段
              for (var t of constituteTypeList) {
                if (t.constituteTypeID == x.constituteTypeID) {
                  typename = t //循环判断是否有相同的类别名称
                }
              }
              if (typename != '') { //有相同的类时
                typename.setMealConstituteList.push(List)
              } else {
                TypeList.constituteTypeID = x.constituteTypeID
                TypeList.constituteTypeName = x.constituteTypeName
                TypeList.constituteTypeCount = x.constituteTypeCount
                TypeList.choosableCount = x.choosableCount
                constituteTypeList.push(TypeList)
                num++
                constituteTypeList[num].setMealConstituteList.push(List)
              }

            }
            that.setData({
              constituteTypeList: constituteTypeList,
            })
          } else { //前后两个类别相同时
            var typename = ''
            for (var t of constituteTypeList) {
              //console.log(t.constituteTypeName)
              //console.log(x.constituteTypeName)
              if (t.constituteTypeID == x.constituteTypeID) {
                typename = t
              }
            }
            if (typename != '') {
              typename.setMealConstituteList.push(List)
            } else {
              stituteList.push(List)
              constituteTypeList[num].setMealConstituteList.push(List)
            }
            that.setData({
              constituteTypeList: constituteTypeList,
            })
          }
          //console.log(x)
          tapnum = x.constituteTypeID
        }
      }
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
    app.globalData.deliveryAddressInf = '';
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

  deleteTicketByOrderId: function (orderId) {
    wx.request({
      // url: 'http://localhost:8081/evaluation/deleteTicketByOrderId',
      url: app.globalData.deleteTicketByOrderIdm,
      data: orderId,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: {

      }
    })

  },
})