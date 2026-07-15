// pages/order/order.js
//获取应用实例
const app = getApp()
var util = require('../../../../utils/util.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    menu_img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/index/menu.png',
    i_close_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/i_close.png',
    quick_remark:'',
    pop_remark_dlg_show:false,
    quickRemarkList:[],//备注列表
    dishes_index:-1,
    goods_remark:'',//套餐备注信息
    quickRemark: '',//快捷备注

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
    // var minusStatus = num > 1 ? 'normal' : 'disable';

    // if (this.data.setMeal) {
    //   let ladder = this.data.setMeal[0].ladder
    //   for (let i = 0; i < ladder.length; i++) {
    //     if (ladder[0].ladderNumber > 0) {
    //       if (ladder[0] && (num > ladder[0].limited_number || num > ladder[0].ladderNumber)) {
    //         wx.showToast({
    //           title: '已达到抢购上限',
    //           duration: 1500
    //         })
    //         return;
    //       }
    //     } else if (ladder[i].ladderNumber > 0 && ladder[i - 1].ladderNumber == 0) {
    //       if (ladder[i] && (num > ladder[i].limited_number || num > ladder[i].ladderNumber)) {
    //         wx.showToast({
    //           title: '已达到抢购上限',
    //           duration: 1500
    //         })
    //         return;
    //       }
    //     }
    //   }
    // } else if (this.data.CouponList) {
    //   let a = this.data.CouponList
    //   if (a.coupon_purchaselimitation != -1 && num > a.coupon_purchaselimitation) {
    //     wx.showToast({
    //       title: '该券限购' + a.coupon_purchaselimitation + '张',
    //       icon: 'error',
    //       mask: true,
    //       duration: 1500
    //     })
    //     return;
    //   }
    // } else if (this.data.ladderArr.length > 0) {
    //   let ladder = this.data.ladderArr

    //   for (let i = 0; i < ladder.length; i++) {
    //     // if (Number(ladder[0].ladderNum - ladder[0].userNumber) > 0){
    //     if (ladder[0] && (num > ladder[0].limited_number || num > Number(ladder[0].ladderNum - ladder[0].userNumber))) {
    //       wx.showToast({
    //         title: '已达到抢购上限',
    //         duration: 1500
    //       })
    //       return;
    //     }
    //     // }
    //     // else if(Number(ladder[i].ladderNum - ladder[i].userNumber) > 0 && Number(ladder[i - 1].ladderNumber - ladder[i - 1].userNumber) == 0){
    //     else if (ladder[i] && (num > ladder[i].limited_number || num > Number(ladder[i].ladderNum - ladder[i].userNumber))) {
    //       wx.showToast({
    //         title: '已达到抢购上限',
    //         duration: 1500
    //       })
    //       return;
    //     }
    //     // }
    //   }
    // }


    // this.setData({
    //   num: num,
    //   minusStatus: minusStatus
    // })
    if (this.data.id == 0) {
      var actualSum = 0
        actualSum = num * this.data.setMeal[0].price
    }
    this.setData({
      num: num,
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
          // if (ladder[0].ladderNumber > 0) {
          //   setMeal[0].price = ladder[0].ladderPrice
          // } else if (ladder[i].ladderNumber > 0 && ladder[i - 1].ladderNumber == 0) {
          //   setMeal[0].price = ladder[i].ladderPrice
          // }
        }
        that.setData({
          setMeal: setMeal
        }, () => {
          // if (that.data.setMeal[0].startUsing3 == 1) {
          //   let useTimeList = that.data.setMeal[0].usefulDate.split(',');
          //   let useTimeList1 = []
          //   for (let a of that.data.aWeek) {
          //     for (let b of useTimeList) {
          //       if (a.day == b) {
          //         useTimeList1.push(a.newday)
          //       }
          //     }
          //   }
          //   that.setData({
          //     useTimeList: useTimeList1
          //   })
          // }
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
        //var actualSum = (that.data.setMeal[0].startUsing3 == 1 ? (that.data.customerInf1.gender == '女' ? that.data.setMeal[0].ladyPrice : that.data.setMeal[0].manPrice) : Number(that.data.setMeal[0].price)) * Number(that.data.num)

        var actualSum=Number(that.data.setMeal[0].price)*Number(that.data.num);

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

  saveData: function (e) {
    var that = this
    
    //数量
    var num = Number(that.data.num)
    console.log(num);

    if (that.data.setMeal) {
      if (that.data.setMeal.length>0&&that.data.setMeal[0].startUsing == 1) {
          //套餐OK
      }else{
        wx.showToast({
          title: '餐品已下架',
          duration: 1500,
          icon: "error"
        })
        return;
      } 
    }else{
      wx.showToast({
        title: '无餐品信息',
        duration: 1500,
        icon: "error"
      })
      return;
    }

    if (that.data.constituteTypeList) {
      for (let x of that.data.constituteTypeList) {
        let chooseCount = 0
        if (x.choosableCount != -1) {
          for (let a of x.setMealConstituteList) {
            if (!a.isChoose) {
              chooseCount++
            }
          }
          if (chooseCount != x.choosableCount) {
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



    console.log(this.data.setMeal);


    var setMealObj=this.data.setMeal[0];
    


    var actualSum = Number(that.data.actualSum)

    console.log(actualSum)

    console.log(that.data.setMeal[0]);
    console.log(that.data.constituteTypeList)

    //组成类型列表
    var lstOrderSetMealConstituteType=[];

    if(that.data.constituteTypeList&&that.data.constituteTypeList.length>0){

      var constituteTypeList=that.data.constituteTypeList;
      for (var i = 0; i < constituteTypeList.length; i++) {
        var typeObj=constituteTypeList[i];
          if(typeObj.setMealConstituteList&&typeObj.setMealConstituteList.length>0){

              var lstOrderSetMealConstitute=[];
              for(var j=0;j<typeObj.setMealConstituteList.length;j++){

                var constituteObj=typeObj.setMealConstituteList[j];
                if(
                     (typeObj.choosableCount==-1&&typeObj.constituteTypeCount==-1)
                     ||(constituteObj.isChoose==false&&typeObj.choosableCount>0&&typeObj.constituteTypeCount>0)
                  ){
                    // typeObj.choosableCount==-1&&typeObj.constituteTypeCount==-1 代表固定有效
                    // constituteObj.isChoose 代表已选择的内容
                    lstOrderSetMealConstitute.push({
                      id:0,
                      order_set_meal_constitute_type_id:0,
                      shop_id:0,
                      order_id:0,
                      order_detailed_id:0,
                      set_meal_id:setMealObj.setMealID,
                      dishes_id:constituteObj.dishesId?constituteObj.dishesId:0,
                      dishes_spec_type:constituteObj.dishesSpecType?constituteObj.dishesSpecType:0,
                      constitute_id:constituteObj.constituteID,
                      constitute_name:constituteObj.constituteName,
                      constitute_unit:constituteObj.constituteUnit,
                      constitute_num:constituteObj.constituteNum,
                      constitute_value:constituteObj.constituteValue
                    })
                }                
              }
          }
          //类型添加到列表
          lstOrderSetMealConstituteType.push({
            id:0,
            shop_id:0,
            order_id:0,
            order_detailed_id:0,
            set_meal_id:setMealObj.setMealID,
            constitute_type_id:typeObj.constituteTypeID,
            constitute_type_name:typeObj.constituteTypeName,
            lstOrderSetMealConstitute:lstOrderSetMealConstitute,
          })
      } 
    }


    var dishes_index=this.data.dishes_index
    var remark=that.data.quick_remark+that.data.goods_remark;
    var number=num;
    var sum=actualSum;

    var item_price=this.data.setMeal[0].originalPrice
    var inline_price=this.data.setMeal[0].price
    
    
    console.log(lstOrderSetMealConstituteType);
    this.genSetMealOrder(dishes_index,number,item_price,inline_price,sum,remark,lstOrderSetMealConstituteType);

    return;

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
      console.log(that.data.constituteTypeList)
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
        url: app.globalData.taocan.AddTicketOrderInfo_url1,
        // url: 'http://192.168.8.18:8087/WX Restaurant/AddTicketOrderInfo',
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
                  url: app.globalData.addApplyCombo1,
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
            


              } else {
                wx.hideLoading({
                  success: (res) => { },
                })
                // wx.navigateTo({
                //   url: '../orderList/orderList?shop_id=' + that.data.shop_id + '&packageIndex=' + that.data.id,
                // })
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

  },
  genSetMealOrder(dishes_index,number,item_price,inline_price,sum,remark,lstOrderSetMealConstituteType){
        try {
            
            let pages = getCurrentPages(); //获取当前界面的所有信息
            console.log(pages);
            
            if(pages.length<3){
              wx.showModal({
                title: '提示',
                content: '订单创建失败'
              })
              return;
            }
            
            let prevPage = pages[pages.length - 3];
            

            //订单详情界面必须有这个函数
            console.log(prevPage)
            //确保是订单详情界面的路径
            if(prevPage){
                if(prevPage.route){
                    if(prevPage.route.indexOf('pages/menu/menu')>=0){
                      console.log("查找到菜单页面")  
                      prevPage.genSetMealOrder(dishes_index,number,item_price,inline_price,sum,remark,lstOrderSetMealConstituteType);
                      wx.navigateBack({
                        delta: 2
                        });
                    }
                }
            }
           
           

        } catch (error) {
            
        }
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
  refused() {
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.is_set_meal_return=true;
    console.log(JSON.stringify(options))
    var that=this;

    if(app.globalData.remark_normal){
      var quickRemarkList=app.globalData.remark_normal;
      for (var x of quickRemarkList) {
        x.checked=false;
      }
      this.setData({
        quickRemarkList: quickRemarkList,//备注列表
      })
    }

    this.setData({
      quick_remark:'',
    })
    
  
    this.next7()
 
    that.setData({
      setMealID: options.setMealID,
      coupon_id: options.coupon_id,
      dishes_index:Number(options.dishes_index),
      id: options.id,
      shop_id: options.shop_id
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
    that.selectConstitute()
    that.setData({
      num: 1,
    })
    that.select();
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
    console.log("selectConstitute:")
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
            dishesId:0,
            dishesSpecType:0,
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
          List.dishesId=x.dishesId
          List.dishesSpecType=x.dishesSpecType
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

  popRemarkDlgTap:function(){
    this.setData({
        pop_remark_dlg_show:true,
    })
  },
  hideModal:function(){
    this.setData({
        pop_remark_dlg_show:false,
    })
  },
  chooseRemark: function (e) {
    var quickRemarkList = this.data.quickRemarkList
    quickRemarkList[e.currentTarget.dataset.index].checked = !quickRemarkList[e.currentTarget.dataset.index].checked
    console.log(111)
    console.log(quickRemarkList)
    this.setData({
      quickRemarkList: quickRemarkList
    })
  },
  quickRemarkConfirm: function (e) {

    console.log(" quickRemarkConfirm");
    var remark = []
    var quick_remark = ""
    for (var x of this.data.quickRemarkList) {
      if (x.checked) {
        remark.push(x.value)
      }
    }
    console.log(" quickRemarkConfirm 1");
    quick_remark = remark.join("、")
    console.log(" quickRemarkConfirm 2");
    this.setData({
        quick_remark:quick_remark,
        pop_remark_dlg_show:false,
    })
    console.log(" quickRemarkConfirm 3");
  },

})