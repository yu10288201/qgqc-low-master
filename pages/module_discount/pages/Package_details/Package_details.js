// pages/Package_details/Package_details.js
const app = getApp()
const QRCode = require("../../../../utils/weapp-qrcode.js")
var util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
      new_coupon_dlg_show:false,//显示详情对话框
      shop_id:0,
      shopId:0,
      bind_type:0,
      is_video_show:app.globalData.is_video_show,
      is_fresh_distribution:0,
      is_set_meal_weight:0,
      currentBlockColor: "#000000",
      blockColor: "#000000",
      colorGamut:"-webkit-linear-gradient(left, #ffffff 0%, #ff0000 100%)",
      colorGray:"-webkit-linear-gradient(left, #000000 0%, #ffffff 100%)",
      colorGamutTip:"#ff0000",
      colorGrayTip:"#ffffff",
      colorValue:0,
      colorGamutValue:0,
      colorGrayValue:0,
        isShowGetAvatar:false,
        constituteByOrderIdList: [],
        ticket_order_id:0,
        fromMenu: false,
        refund: 0,
        private_room: 0,
        holidays: 0,
        past_refund: 0,
        isFromBuyLoveSet: false,
        customerInf: '',
        inviterOpenid: '',
        moreInf: true,
        ruleid: false,
        transform: 'rotate(0deg)',
        webkitline: 6,
        setMeal: '',
        setMealType: '',
        startData: '',
        endData: '',
        timeList: [],
        file_id: 0,
        id: 0,
        bind_dbo_order_inf_order_id:0,//绑定到的单号
        godappraise: -1,
        godappraise1: 6,
        ladderStart: false,
        width: parseInt(wx.getSystemInfoSync().windowWidth * 0.94 * 0.96),
        height: parseInt(wx.getSystemInfoSync().windowWidth * 0.94 * 0.96 * 1.3 / 2),
        show_rule: false,
        cusid: '',
        SYB_APPID: '',
        sub_merchants_id: '',
        picture: [{
                img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3306430909,3982376892&fm=26&gp=0.jpg'
            },
            {
                img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3419315812,2223739414&fm=26&gp=0.jpg'
            },
            {
                img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4006551618,3513016832&fm=26&gp=0.jpg'
            },
            {
                img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1682160878,3531013921&fm=26&gp=0.jpg'
            }
        ],
        setMealTypeList: [{
            id: 0,
            name: '小吃快餐'
        }, {
            id: 1,
            name: '粉面汤粥'
        }, {
            id: 2,
            name: '火锅烧烤'
        }, {
            id: 3,
            name: '生鲜蔬果'
        }, {
            id: 4,
            name: '日韩料理'
        }, {
            id: 5,
            name: '甜品饮品'
        }, {
            id: 6,
            name: '辣味特色'
        }, {
            id: 7,
            name: '自助套餐'
        }, {
            id: 8,
            name: '食品保健'
        }, {
            id: 9,
            name: '生鲜蔬果'
        }, {
            id: 10,
            name: '聚餐宴请'
        }, {
            id: 11,
            name: '海鲜'
        }, {
            id: 12,
            name: '粤菜'
        }, {
            id: 13,
            name: '福建菜'
        }, {
            id: 14,
            name: '山西菜'
        }, {
            id: 15,
            name: '川湘菜'
        }, {
            id: 16,
            name: '江浙菜'
        }, {
            id: 17,
            name: '湖北菜'
        }, {
            id: 18,
            name: '西北菜'
        }, {
            id: 19,
            name: '东北菜'
        }, {
            id: 20,
            name: '京菜鲁菜'
        }, {
            id: 21,
            name: '云贵菜'
        }, {
            id: 22,
            name: '新疆菜'
        }, {
            id: 23,
            name: '台湾菜'
        }, {
            id: 24,
            name: '东南亚菜'
        }, {
            id: 25,
            name: '西餐'
        }, {
            id: 26,
            name: '特色菜'
        }, {
            id: 27,
            name: '其他菜'
        }, ],
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
        ]
    },
    ruletap: function (e) {
        this.setData({
            ruleid: !this.data.ruleid
        })
        if (this.data.ruleid == true) {
            this.setData({
                transform: 'rotate(180deg)',
                webkitline: 10000,
            })
        } else {
            this.setData({
                transform: 'rotate(0deg)',
                webkitline: 6,
            })
        }
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
                    if (that.focusCB) {
                        that.focusCB(true)
                    }
                })
            }
        })
    },

    Mealtap: function (e) {
        var that = this
        app.getManagementDataServlet(this.data.shop_id)
        if (that.data.setMeal[0].startUsing3 == 1) {
            wx.navigateTo({
                url: '/pages/module_discount/pages/loveSet/loveSet',
            })
        } else {
          let customerInfo = app.globalData.customerInf
          if(!customerInfo.name){
            that.setData({
              isShowGetAvatar: true
            })
            return;
          }
          console.log('this.data.is_fresh_distribution:'+this.data.is_fresh_distribution)
          if(this.data.bind_type==3){
            //保证能生成绑定关系
            if (!app.globalData.unionID){
              that.selectUnionIDAndBindCustomerAndNav();
            }else{
              that.insertBindCustomerRecordAndNav();
            }
          }else{

           
             if(this.data.is_fresh_distribution==3){
                wx.navigateTo({
                  url: '../freshorder/freshorder?inviteOpenId=' + that.data.inviterOpenid + '&setMealID=' + that.data.setMeal[0].setMealID + '&id=' + that.data.id + '&shop_id=' + that.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) + (that.data.DYUid ? '&DYUid=' + that.data.DYUid : ''),
              })
             }else{
              wx.navigateTo({
                url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&setMealID=' + that.data.setMeal[0].setMealID + '&id=' + that.data.id + '&shop_id=' + that.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) + (that.data.DYUid ? '&DYUid=' + that.data.DYUid : ''),
            })
             }
              

          }
          
        
          // if(this.data.is_fresh_distribution==1){

          //   wx.navigateTo({
          //     url: '../freshorder/freshorder?inviteOpenId=' + that.data.inviterOpenid + '&setMealID=' + that.data.setMeal[0].setMealID + '&id=' + that.data.id + '&shop_id=' + that.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) + (that.data.DYUid ? '&DYUid=' + that.data.DYUid : ''),
          // })
          // }else{
            
          //   wx.navigateTo({
          //     url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&setMealID=' + that.data.setMeal[0].setMealID + '&id=' + that.data.id + '&shop_id=' + that.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) + (that.data.DYUid ? '&DYUid=' + that.data.DYUid : ''),
          // })

          // }
         
        }
    },

    refreshAvatar(){
      let that = this 
      if(that.data.id == 0){
        if(!that.data.isFromBuyLoveSet){
          wx.navigateTo({
            url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&setMealID=' + that.data.setMeal[0].setMealID + '&id=' + that.data.id + '&shop_id=' + that.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) + (that.data.DYUid ? '&DYUid=' + that.data.DYUid : ''),
        })
        }else{
          wx.navigateTo({
            url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&setMealID=' + this.data.setMeal[0].setMealID + '&id=' + this.data.id + '&shop_id=' + this.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) +
                '&isFromBuyLoveSet=' + that.data.isFromBuyLoveSet,
        })
        }
      }else if(that.data.id == 1){
        wx.navigateTo({
          url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&coupon_id=' + that.data.coupon_id + '&id=' + that.data.id + '&shop_id=' + that.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) + (that.data.DYUid ? '&DYUid=' + that.data.DYUid : ''),
        })
      }
      
    },

    Mealtap1() {
        var that = this
        app.getManagementDataServlet(this.data.shop_id)
        wx.navigateTo({
            url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&setMealID=' + this.data.setMeal[0].setMealID + '&id=' + this.data.id + '&shop_id=' + this.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) +
                '&isFromBuyLoveSet=' + that.data.isFromBuyLoveSet,
        })
    },

    Coupontap: function (e) { //aaaaa
        var that = this
        if (this.data.ladderArr.length > 0) {
            wx.request({
                url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
                data: {
                    unionId: app.globalData.unionID
                },
                success: res => {
                    if (res.data.list == undefined || res.data.list == "" || res.data.list.isFocus == '0') {
                        wx.showModal({
                            content: '您尚未关注"切瓜切菜"公众号\n关注公众号即可抢购',
                            cancelText: '取消',
                            confirmText: '前往关注',
                            success: res => {
                                if (res.confirm) {
                                    wx.request({ //发送信息临时表
                                        url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addLink',
                                        data: {
                                            unionId: app.globalData.unionID,
                                            title: "点击这里继续购买",
                                            link: '/pages/module_discount/pages/Package_details/Package_details?coupon_id=' + that.data.coupon_id + "&id=1&ruleID=" + that.data.ruleID + '&shop_id=' + that.data.shop_id
                                            // link: "/pages/module_discount/pages/Package_details/Package_details?a=" + that.data.coupon_id + "&b=1&c=" + app.globalData.customerInf.id
                                        },
                                        method: 'GET',
                                        success(res) {
                                            wx.navigateTo({
                                                url: '/pages/module_others/pages/wxPublic/out',
                                            })
                                        }
                                    })
                                } else {
                                    return;
                                }
                            }
                        })
                    } else {
                      app.getManagementDataServlet(this.data.shop_id)
                      let customerInfo = app.globalData.customerInf
                      if (!customerInfo.name) {
                        that.setData({
                          isShowGetAvatar: true
                        })
                        return;
                      }
                      wx.navigateTo({
                        url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&coupon_id=' + that.data.coupon_id + '&id=' + that.data.id + '&shop_id=' + that.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) + (that.data.DYUid ? '&DYUid=' + that.data.DYUid : ''),
                      })
                    }
                }
            })
        } else {
          app.getManagementDataServlet(this.data.shop_id)
          let customerInfo = app.globalData.customerInf
          if (!customerInfo.name) {
            that.setData({
              isShowGetAvatar: true
            })
            return;
          }
          wx.navigateTo({
            url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&coupon_id=' + that.data.coupon_id + '&id=' + that.data.id + '&shop_id=' + that.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) + (that.data.DYUid ? '&DYUid=' + that.data.DYUid : ''),
          })
        }
    },
    bigimg2: function (e) { //查看照片大图                                       
        var that = this;
        var imgBox = []
        //  if(e.currentTarget.dataset.src.substring(e.currentTarget.dataset.src.length-2,e.currentTarget.dataset.src.length)!='\r\n'){
        //   imgBox.push(e.currentTarget.dataset.src.substring(0,e.currentTarget.dataset.src.length-4)+'big')
        //  }else{
        imgBox.push(e.currentTarget.dataset.src)
        //  }
        that.setData({
            imgBox: imgBox
        })
        wx.previewImage({
            current: e.currentTarget.dataset.src, // 当前显示图片的http链接
            urls: imgBox // 需要预览的图片http链接列表
        })
    },
    select: function (e) {
        var that = this
        //console.log(that.data.setMealID)
        wx.request({
            url: app.globalData.selectSetMealInfo_url,
            // url: 'https://test.fsmbdlkj.com/diancanxing/setMeal/selectSetMealInfo',
            method: 'POST',
            data: {
                setMealID: that.data.setMealID,
                shop_id: "",
                startUsing: "",
                typeForSetMeal: ''
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                let setMeal = res.data.selectResult
                var price = setMeal[0].price
                setMeal.price = Number(price.toFixed(2))
                let ladder = setMeal[0].ladder

                for (let i = 0; i < ladder.length; i++) {
                    if (i == 0 && ladder[i].ladderNumber > 0) {
                        setMeal[0].price = ladder[i].ladderPrice
                        setMeal[0].number = ladder[i].ladderNumber
                    } else if (ladder[i].ladderNumber > 0 && ladder[i - 1].ladderNumber == 0) {
                        setMeal[0].price = ladder[i].ladderPrice
                        setMeal[0].number = ladder[i].ladderNumber
                    }

                    if (i == 0 && ladder[i].ladderTotalNumber > 0) {
                        ladder[i].numberString = 1
                        ladder[i].numberCount = ladder[i].ladderTotalNumber
                    } else {
                        ladder[i].numberString = 1
                        ladder[i].numberCount = ladder[i].ladderTotalNumber
                    }

                    if (i > 0) {
                        ladder[i].numberString = Number(ladder[i - 1].numberCount + 1)
                        ladder[i].numberCount = Number(ladder[i - 1].numberCount + ladder[i].ladderTotalNumber)
                    }
                    // let ladderStart = that.data.ladderStart
                    if (ladder[i].ladderNumber > 0) {
                        // ladderStart = true
                        that.setData({
                            ladderStart: true
                        })
                    } else if (!that.data.ladderStart) {
                        that.setData({
                            ladderStart: false
                        })
                    }
                }
                setMeal[0].ladder = ladder
                var startTime = util.formatTimeTwo(setMeal[0].startTime.time, 'Y-M-D')
                var endTime = util.formatTimeTwo(setMeal[0].endTime.time, 'Y-M-D')
           
                var is_fresh_distribution=setMeal[0].is_fresh_distribution;
                var is_set_meal_weight=setMeal[0].is_set_meal_weight;

                that.setData({
                    startTime: startTime,
                    endTime: endTime,
                    setMeal: setMeal,
                    shop_id: setMeal[0].shop_id,
                    ruleID: setMeal[0].ruleID,
                    is_fresh_distribution:is_fresh_distribution,
                    is_set_meal_weight:is_set_meal_weight,
                }, () => {
                    console.log(that.data.shop_id, "店铺id");
                    if (that.data.inviteCustomerId) {
                        that.getOpenIdByCustomerId(that.data.inviteCustomerId)
                    }
                    if (!app.globalData.unionID) {
                        //同步异步问题，所以拉屎
                        that.selectUnionID()
                        that.getUnionIDCallBack = (bool) => {
                            if (bool) {
                                that.setData({
                                    unionId: app.globalData.unionID,
                                    openid: app.globalData.openid,
                                }, () => {
                                    that.selectFocus()
                                    that.getUserInfo(that.data.shop_id)
                                })
                            }
                        }
                    }

                    if (!app.globalData.user_id) {
                        that.getUserInfo(that.data.shop_id)
                    }

                    that.selectRule()
                    that.selectAllEvaluation()
                })
                var time = that.data.setMeal[0].timeForUse

                var num = 1
                var endnum = 0
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
                        if (y == that.data.timeList.length - 1) {} else {
                            if (y == 3) {
                                that.data.timeList[y] = that.data.timeList[y] + '\n'
                            } else {
                                that.data.timeList[y] = that.data.timeList[y] + '|'
                            }
                        }
                    }
                }
                let text = ''
                if (setMeal[0].usefulDate) {
                    var usefulDate = setMeal[0].usefulDate
                    if (usefulDate.substr(usefulDate.length - 1, 1) == ',') {
                        usefulDate = usefulDate.substr(0, usefulDate.length - 1)
                    }
                    var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5', '3,4', '4,5,6,7', '4,5,6', '4,5', '5,6,7', '5,6', '6,7']
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
                }
                //别人拉屎我也拉，我直接拉一大坨
                that.setData({
                    imgUrl: that.data.imgUrl,
                    usefulDateText: text,
                    timeList: that.data.timeList
                })

                for (var x of that.data.setMealTypeList) {
                    if (x.id == that.data.setMeal[0].setMealType) {
                        that.data.setMealType = x.name
                        that.setData({
                            setMealType: that.data.setMealType
                        })
                    }
                }
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
                that.selectshop()
            }
        })
    },

    selectConstitute: function (e) { //阶梯价
        var that = this
        //console.log(that.data.setMealID)
        wx.request({
            url: app.globalData.taocan.select_constitute_url,
            // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/select_constitute',
            method: 'POST',
            data: {
                setMealID: that.data.setMealID
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
                        isCheck: false,
                        constituteName: "",
                        constituteUnit: "",
                        constituteNum: "",
                        constituteValue: ""
                    }
                    var TypeList = {
                        constituteTypeName: '',
                        constituteTypeCount: '',
                        choosableCount: '',
                        setMealConstituteList: [],
                    }
                    if(that.data.constituteByOrderIdList){
                        let constituteByOrderIdList = that.data.constituteByOrderIdList
                        for (let i of constituteByOrderIdList) {
                          if(i.constitute_id == x.constituteID){
                            List.isCheck = true
                          }
                        }
                      }
                    List.constituteName = x.constituteName
                    List.constituteUnit = x.constituteUnit
                    List.constituteNum = x.constituteNum
                    List.constituteValue = x.constituteValue
                    // 前面添加的类别，如果后面有相同的类，就放到前面那个相同的类里
                    if (x.constituteTypeCount == -1) {
                        var typename1 = ''
                        for (var t of constituteTypeList) {
                            if (t.constituteTypeCount == -1 && t.constituteTypeName == '固定菜品') {
                                typename1 = t //循环判断是否有相同的类别名称
                            }
                        }
                        if (typename1 != '') { //有相同的类时
                            typename1.setMealConstituteList.push(List)
                        } else {
                            TypeList.constituteTypeName = '固定菜品'
                            TypeList.constituteTypeCount = x.constituteTypeCount
                            TypeList.choosableCount = x.choosableCount
                            constituteTypeList.push(TypeList)
                            num++
                            constituteTypeList[num].setMealConstituteList.push(List)
                        }
                        that.setData({
                            constituteTypeList: constituteTypeList
                        })
                    } else {
                        if (x.constituteTypeID != tapnum) { //判断前后两个类别是否相等

                            var typename = '' //如果有相同的类，把那个类存到typename字段中

                            if (tapnum == '') { //存储第一个字段
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
                                    TypeList.constituteTypeName = x.constituteTypeName
                                    TypeList.constituteTypeCount = x.constituteTypeCount
                                    TypeList.choosableCount = x.choosableCount
                                    constituteTypeList.push(TypeList)
                                    num++
                                    constituteTypeList[num].setMealConstituteList.push(List)
                                }
                            }
                            that.setData({
                                constituteTypeList: constituteTypeList
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
                                constituteTypeList: constituteTypeList
                            })
                        }
                    }


                    //console.log(x)
                    tapnum = x.constituteTypeID

                }
            }
        })
    },

    selectRule: function (e) {
        var that = this
        //console.log(that.data.setMealID)
        wx.request({
            url: app.globalData.taocan.selectRule_url,
            // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectRule',
            method: 'POST',
            data: {
                ruleID: that.data.ruleID
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                //console.log(res)
                if (res.data.length > 0) {

                    var ruleList = ''
                    var rule = ''
                    rule = res.data[0].ruleContent.substring(0, 112)
                    ruleList = res.data[0]
                    that.setData({
                        ruleList: ruleList,
                        rule: rule
                    })
                }
            }
        })
    },

    getUserInfo(shopId) {
        var that = this
        var unionID = app.globalData.unionID
        if (unionID != undefined && unionID != null) {
            wx.request({
                url: app.globalData.UserLogin_url,
                data: {
                    Open_id: unionID,
                    Shop_id: shopId
                },
                success: function (res) {
                    // app.getCustomerInfo(unionID) //获取用户信息
                    if (res.data.result == null || res.data.result.result == 0) {
                        wx.request({
                            url: app.globalData.UserRegistration_url,
                            data: {
                                Head_portrait_img: app.globalData.customerInf.avatarUrl ? app.globalData.customerInf.avatarUrl : "normal",
                                User_nickname: app.globalData.customerInf.name,
                                Wx_openid: unionID,
                                Shop_id: shopId
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
                    }
                }
            })
        } else {
            console.log("你的unionId为undefined或null")
        }

    },

    selectshop: function (e) {
        var that = this
        if (that.data.id == 0) {
            var setMealID = that.data.setMealID
            var coupon_id = ''
        } else {
            var setMealID = ''
            var coupon_id = that.data.coupon_id
        }
        wx.request({
            url: app.globalData.taocan.selectSetmeal_url,
            // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectSetmeal',
            method: 'POST',
            data: {
                setMealID: setMealID,
                coupon_id: coupon_id

            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                var shopList = ''
                var shop = []
                for (var x of res.data) {
                    if (x.shop_id == that.data.shop_id) {
                        shop.push(x)
                    }
                }
                console.log(shop)
                shopList = res.data
                var SYB_APPID = shopList[0].syb_APPID
                var cusid = shopList[0].cusid
                var sub_merchants_id = shopList[0].sub_merchants_id
                that.setData({
                    shopList: shopList,
                    shop: shop,
                    SYB_APPID: SYB_APPID,
                    cusid: cusid,
                    sub_merchants_id: sub_merchants_id
                })
            }
        })
    },
    shoptap: function (e) {
        var that = this
        if (that.data.id == 0) {
            wx.navigateTo({
                url: '../shop/shop?setMealID=' + that.data.setMealID + '&id=' + that.data.id,
            })
        } else {
            wx.navigateTo({
                url: '../shop/shop?coupon_id=' + that.data.coupon_id + '&id=' + that.data.id,
            })
        }
    },
    call: function (e) {
        var that = this
        if (that.data.shop[0].contact_number && that.data.shop[0].contact_number != '无添加') {

            wx.makePhoneCall({
                phoneNumber: that.data.shop[0].contact_number.split(" ")[0],
                success(res) {
                    console.log('拨打电话成功')
                },
                fail(res) {
                    console.log('拨打电话失败')
                }
            })
        } else {
            wx.showModal({
                title: '提示',
                content: '该商铺还未设置电话号码',
            })
        }
    },
    detail: function (e) {
        app.globalData.shopid = this.data.shop[0].shop_id
        wx.reLaunch({
            url: '../../../index/index?shopid=' + this.data.shop[0].shop_id,
        })
    },
    file: function (e) {
        var that = this
        var index = e.currentTarget.dataset.index
        that.setData({
            file_id: index,
        });
        if (index == 0) {
            that.setData({
                godappraise: -1,
                godappraise1: 6
            })
            that.selectAllEvaluation()
        } else if (index == 1) {
            that.setData({
                godappraise: 3,
                godappraise1: 6,
            })
            that.selectAllEvaluation()
        } else if (index == 2) {
            that.setData({
                godappraise: -1,
                godappraise1: 4,
            })
            that.selectAllEvaluation()
        } else {
            that.selectPicevaluation()
        }
    },
    selectAllEvaluation: function (res) {
        var that = this
        if (that.data.id == 0) {
            var dishes_id = that.data.setMealID
        } else {
            var dishes_id = that.data.coupon_id
        }
        wx.request({
            url: app.globalData.taocan.select_evaluation_url,
            // url: 'http://localhost:8088/evaluation/select_evaluation',
            data: {
                "shop_id": that.data.shop_id,
                "assess_surport": that.data.godappraise,
                "assess_surport1": that.data.godappraise1,
                // "dishes_id": dishes_id
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
                that.setData({
                    evaluations: res.data
                })
            }
        })
    },
    selectPicevaluation: function (res) {
        var that = this
        if (that.data.id == 0) {
            var dishes_id = that.data.setMealID
        } else {
            var dishes_id = that.data.coupon_id
        }
        wx.request({
            url: app.globalData.taocan.select_evaluation_url,
            // url: 'http://localhost:8088/evaluation/select_evaluation',
            data: {
                "shop_id": that.data.shop_id,
                "isImage": 1,
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
                that.setData({
                    evaluations: res.data
                })
            }
        })
    },
    select_numvaluation: function (res) {
        var that = this

        wx.request({
            url: app.globalData.taocan.select_numvaluation_url,
            // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/select_numvaluation',
            data: {},
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
                that.setData({
                    numvaluation: res.data
                })
            }
        })
    },
    selectCoupon: function (e) { //查询规则
        var that = this
        wx.request({
            url: app.globalData.getCouponByCouponId,
            // url: app.globalData.taocan.selectCoupon_url,
            //   url: 'http://localhost:8088/evaluation/getCouponByCouponId',
            data: {
                couponId: that.data.coupon_id
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if (res.data.code == 1) {
                    var CouponList = res.data.data
                    var week = []
                    for (var y of that.data.actionSheetItems) {
                        if (y.bindtap == res.data.data.coupon_ruleweekstar) {
                            week.push(y.id)
                        }
                        if (y.bindtap == res.data.data.coupon_ruleweekend) {
                            week.push(y.id)
                        }
                    }

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
                                        CouponList.coupon_facevalue = ladder[i].ladderPrice
                                        CouponList.number = Number(ladder[i].ladderNum - ladder[i].userNumber)
                                    } else if (Number(ladder[i].ladderNum - ladder[i].userNumber) > 0 && Number(ladder[i - 1].ladderNum - ladder[i - 1].userNumber) == 0) {
                                        CouponList.coupon_facevalue = ladder[i].ladderPrice
                                        CouponList.number = Number(ladder[i].ladderNum - ladder[i].userNumber)
                                    }

                                    if (i == 0 && ladder[i].ladderTotalNumber > 0) {
                                        ladder[i].numberString = 1
                                        ladder[i].numberCount = ladder[i].ladderTotalNumber
                                    } else {
                                        ladder[i].numberString = 1
                                        ladder[i].numberCount = ladder[i].ladderTotalNumber
                                    }

                                    if (i > 0) {
                                        ladder[i].numberString = Number(ladder[i - 1].numberCount + 1)
                                        ladder[i].numberCount = Number(ladder[i - 1].numberCount + ladder[i].ladderTotalNumber)
                                    }
                                    // let ladderStart = that.data.ladderStart
                                    if (Number(ladder[i].ladderNum - ladder[i].userNumber) > 0) {
                                        // ladderStart = true
                                        that.setData({
                                            ladderStart: true
                                        })
                                    } else if (!that.data.ladderStart) {
                                        that.setData({
                                            ladderStart: false
                                        })
                                    }
                                }

                            } else {
                                ladderStart = false
                            }
                            that.setData({
                                refund: CouponList.refund,
                                private_room: CouponList.private_room,
                                holidays: CouponList.holidays,
                                past_refund: CouponList.past_refund,
                                ladderArr: ladder,
                                ladderStart: ladderStart,
                                CouponList: CouponList,
                                week: week,
                                ruleID: CouponList.coupon_allrule,
                                shop_id: CouponList.shop_id,
                                coupon_id: CouponList.coupon_id,
                            }, () => {
                                if (that.data.inviteCustomerId) {
                                    that.getOpenIdByCustomerId(that.data.inviteCustomerId)
                                }
                                that.selectRule()
                                that.selectAllEvaluation()
                                that.selectshop()
                            })
                        }
                    })
                }
            }
        })
    },
    selectCouponShop: function (e) { //查询规则
        var that = this
        wx.request({
            url: app.globalData.Selectshopid_url,
            // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectshopid',
            method: 'POST',
            data: {
                shop_id: that.data.shop_id,
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                var shop = res.data
                that.setData({
                    shop: shop
                })
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log(options);
        if (options.clip) {
            if (wx.getStorageSync('clip')) {
                wx.removeStorageSync('clip')
                wx.setClipboardData({
                    data: ' ',
                    complete: res => {
                        wx.hideToast({
                            success: (res) => {},
                        })
                    }
                })
            } else {
                wx.setStorageSync('clip', options.clip)
            }
        } else {
            if (wx.getStorageSync('clip')) {
                wx.removeStorageSync('clip')
                wx.setClipboardData({
                    data: ' ',
                    complete: res => {
                        wx.hideToast({
                            success: (res) => {},
                        })
                    }
                })
            }
        }
        var that = this;
        if (options.moreInf != null) { //订单详情跳转
            that.setData({
                moreInf: false
            })
        }
        if (options.setMealID || options.coupon_id) { //普通页面跳转如   主页面，店铺主页，超值天地，分销等
            that.setData({
                isFromBuyLoveSet: options.isFromBuyLoveSet,
                setMealID: options.setMealID ? options.setMealID : '',
                id: options.id,
                ruleID: options.ruleID ? options.ruleID : '',
                coupon_id: options.coupon_id ? options.coupon_id : '',
            }, () => {
                if (that.data.isFromBuyLoveSet) {
                    that.setData({
                        customerInf: JSON.parse(options.customerInf)
                    })
                }
            })
            if (options.shop_id) {
                app.globalData.shopid = options.shop_id
                that.setData({
                    shop_id: options.shop_id,
                    shopId: options.shop_id
                })
            }            
        }
        if (options.bind_type) {
            that.setData({
                shop_id: options.bind_shop_id,
                shopId: options.bind_shop_id
            })
            this.setData({
                bind_person_name: options.bind_person_name,
                bind_customer_id: options.bind_customer_id ? options.bind_customer_id : 0,
                bind_type: options.bind_type,
                bind_shop_id: options.bind_shop_id,
                bind_unionID: options.bind_unionID ? options.bind_unionID : 0,
                bind_staf_id: options.bind_staf_id ? options.bind_staf_id : 0,
                bind_meals_type: options.bind_meals_type,
                bind_meals_id: options.bind_meals_id,
                setMealID: options.bind_meals_type == '2' ? options.bind_meals_id : '',
                coupon_id: options.bind_meals_type == '3' ? options.bind_meals_id : '',
                id: options.bind_meals_type == '3' ? 1 : 0,
                bind_dbo_order_inf_order_id:options.bind_dbo_order_inf_order_id?options.bind_dbo_order_inf_order_id:0,
            }, () => {
                if (!app.globalData.unionID) {
                    //同步异步问题，所以拉屎
                    that.selectUnionID()
                    that.getUnionIDCallBack = (bool) => {

                        if (bool) {
                          
                            var bind_staf_id=that.data.bind_staf_id ?parseInt(that.data.bind_staf_id):0;
                            var bind_customer_id=that.data.bind_customer_id?parseInt(that.data.bind_customer_id):0;
                            var bind_person_type=0;
                            var bind_person_id=0;
                            if(bind_staf_id>0){
                              bind_person_type=1;
                              bind_person_id=bind_staf_id;
                            }else if(bind_customer_id>0){
                              bind_person_type=2;
                              bind_person_id=bind_customer_id;
                            }

                            let data = {
                                shop_id: parseInt(that.data.bind_shop_id),
                                bind_type: parseInt(that.data.bind_type),
                                bind_person_type: bind_person_type,
                                bind_person_id: bind_person_id,
                                bind_person_name: that.data.bind_person_name,
                                customer_code: app.globalData.customerInf.userCode,
                                customer_name: app.globalData.customerInf.name,
                                customer_id: app.globalData.customerInf.id,
                                meals_id: parseInt(that.data.bind_meals_id),
                                meals_type: parseInt(that.data.bind_meals_type),
                                customer_unionId: app.globalData.unionID,
                                bind_dbo_order_inf_order_id:parseInt(that.data.bind_dbo_order_inf_order_id),
                            }
                            console.log("进入绑定");
                            console.log(data);

                            wx.request({
                                url: app.globalData.insertBindCustomerRecord,
                                //url: 'http://localhost:8080/evaluation_war/insertBindCustomerRecord',
                                data: {
                                    // bind_type: that.data.bind_type,
                                    // shop_id: that.data.bind_shop_id,
                                    // main_customer_unionId: that.data.bind_unionID,
                                    // sub_customer_unionId: app.globalData.unionID,
                                    // meals_type: that.data.bind_meals_type,
                                    // meals_id: that.data.bind_meals_id,

                                    shop_id: parseInt(that.data.bind_shop_id),
                                    bind_type: parseInt(that.data.bind_type),
                                    bind_person_type: bind_person_type,
                                    bind_person_id: bind_person_id,
                                    bind_person_name: that.data.bind_person_name,
                                    customer_code: app.globalData.customerInf.userCode,
                                    customer_name: app.globalData.customerInf.name,
                                    customer_id: app.globalData.customerInf.id,
                                    meals_id: parseInt(that.data.bind_meals_id),
                                    meals_type: parseInt(that.data.bind_meals_type),
                                    customer_unionId: app.globalData.unionID,
                                    bind_dbo_order_inf_order_id:parseInt(that.data.bind_dbo_order_inf_order_id),
                                },
                                method: 'POST',
                                header: {
                                    'content-type': 'application/json' // 默认值
                                },
                                success: res => {
                                    
                                    console.log(res)
                                    if(res.data){
                                        if(res.data.code==1000){
                                            if(res.data.data){
                                                if(res.data.data.isHaveNewCoupon==1){
                                                    that.setData({
                                                        new_coupon_dlg_show:true,
                                                    })
                                                }
                                            }
                                        }
                                    }
                                    
                                },
                                fail: res=>{
                                   console.log("绑定失败");
                                }
                            })
                        }
                    }
                } else {


                            var bind_staf_id=that.data.bind_staf_id ?parseInt(that.data.bind_staf_id):0;
                            var bind_customer_id=that.data.bind_customer_id?parseInt(that.data.bind_customer_id):0;
                            var bind_person_type=0;
                            var bind_person_id=0;
                            if(bind_staf_id>0){
                              bind_person_type=1;
                              bind_person_id=bind_staf_id;
                            }else if(bind_customer_id>0){
                              bind_person_type=2;
                              bind_person_id=bind_customer_id;
                            }

                    let data = {
                        shop_id: parseInt(that.data.bind_shop_id),
                        bind_type: parseInt(that.data.bind_type),
                        bind_person_type: bind_person_type,
                        bind_person_id: bind_person_id,
                        bind_person_name: that.data.bind_person_name,
                        customer_code: app.globalData.customerInf.userCode,
                        customer_name: app.globalData.customerInf.name,
                        customer_id: app.globalData.customerInf.id,
                        meals_id: parseInt(that.data.bind_meals_id),
                        meals_type: parseInt(that.data.bind_meals_type),
                        customer_unionId: app.globalData.unionID,
                        bind_dbo_order_inf_order_id:parseInt(that.data.bind_dbo_order_inf_order_id),
                    }
                    console.log("进入绑定");
                    console.log(data);

                    wx.request({
                        url: app.globalData.insertBindCustomerRecord,
                         //url: 'http://localhost:8080/evaluation_war/insertBindCustomerRecord',
                        data: {
                            // bind_type: that.data.bind_type,
                            // shop_id: that.data.bind_shop_id,
                            // main_customer_unionId: that.data.bind_unionID,
                            // sub_customer_unionId: app.globalData.unionID,
                            // meals_type: that.data.bind_meals_type,
                            // meals_id: that.data.bind_meals_id,

                            shop_id: parseInt(that.data.bind_shop_id),
                            bind_type: parseInt(that.data.bind_type),
                            bind_person_type: bind_person_type,
                            bind_person_id: bind_person_id,
                            bind_person_name: that.data.bind_person_name,
                            customer_code: app.globalData.customerInf.userCode,
                            customer_name: app.globalData.customerInf.name,
                            customer_id: app.globalData.customerInf.id,
                            meals_id: parseInt(that.data.bind_meals_id),
                            meals_type: parseInt(that.data.bind_meals_type),
                            customer_unionId: app.globalData.unionID,
                            bind_dbo_order_inf_order_id:parseInt(that.data.bind_dbo_order_inf_order_id),
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: res => {
                            console.log(res)
                            if(res.data){
                                if(res.data.code==1000){
                                    if(res.data.data){
                                        if(res.data.data.isHaveNewCoupon==1){
                                            that.setData({
                                                new_coupon_dlg_show:true,
                                            })
                                        }
                                    }
                                }
                            }
                           
                        },
                        fail: res=>{
                           console.log("绑定失败");
                        }
                    })
                }
            })
        }
        if (options.scene) {
            const scene = decodeURIComponent(options.scene)
            let arr = []
            console.log(scene, "扫描二维码进入");
            arr = scene.split("&")
            let obj = {}
            for (var dnlm of arr) {
                obj[dnlm.split("=")[0]] = dnlm.split("=")[1]
            }
            console.log(obj);
            if (obj.a) { //分销进入
                if (obj.b == 0) {
                    that.setData({
                        setMealID: obj.a,
                        id: obj.b,
                        inviteCustomerId: obj.c,
                    })
                } else {
                    that.setData({
                        coupon_id: obj.a,
                        id: obj.b,
                        inviteCustomerId: obj.c,
                    })
                }
            }

        }
        if (options.DYUid) {
            this.setData({
                DYUid: options.DYUid
            })
        }
        if (options.fromMenu) {
            app.globalData.is_set_meal_detail_from_menu=true;
            that.setData({
                fromMenu: true,
                ticket_order_id: options.orderId,
            })
        }
        setTimeout(function () { //创建节点选择器
            var query = wx.createSelectorQuery();
            query.select('#xxx').boundingClientRect()
            query.exec(function (res) {
                //res就是 所有标签为mjltest的元素的信息 的数组
                console.log(res);
                //取高度
                console.log(res[0].height);
                console.log(wx.getSystemInfoSync().windowHeight)
                console.log(Math.round((wx.getSystemInfoSync().windowHeight) / (res[0].height)))
                if (Math.round((wx.getSystemInfoSync().windowHeight) / (res[0].height)) <= 6) {
                    that.setData({
                        show_rule: true
                    })
                }
            })
        }, 500)
    },
    returnBackToMenu() {
        wx.navigateBack({
            delta: 1,
        })
    },
    selectUnionID: function () {
        var that = this
        wx.login({
            success: function (res) {
                if (res.code) {
                    var code = res.code
                    wx.getUserInfo({
                        success: function (res) {
                            wx.request({
                                url: app.globalData.allUrl.getUnionID,
                                data: {
                                    code: code,
                                    encryptedData: res.encryptedData,
                                    iv: res.iv,
                                    wechatAppId: app.getWechatAppId(),
                                },
                                header: {
                                    'content-type': 'application/json;charset=utf-8' // 默认值
                                },
                                method: 'POST',
                                success: function (res) {
                                    app.globalData.unionID = res.data.data.unionId
                                    app.globalData.openid = res.data.data.openid
                                    if (that.getUnionIDCallBack) {
                                        that.getUnionIDCallBack(true)
                                    }
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

    selectUnionIDAndBindCustomerAndNav: function () {
      var that = this
      wx.login({
          success: function (res) {
              if (res.code) {
                  var code = res.code
                  wx.getUserInfo({
                      success: function (res) {
                          wx.request({
                              url: app.globalData.allUrl.getUnionID,
                              data: {
                                  code: code,
                                  encryptedData: res.encryptedData,
                                  iv: res.iv,
                                  wechatAppId: app.getWechatAppId(),
                              },
                              header: {
                                  'content-type': 'application/json;charset=utf-8' // 默认值
                              },
                              method: 'POST',
                              success: function (res) {
                                  app.globalData.unionID = res.data.data.unionId
                                  app.globalData.openid = res.data.data.openid
                                  var customerInfo=res.data.data.customer;
                                  console.log('customerInfo:');
                                  console.log(customerInfo);
                                  app.globalData.caustomerId = customerInfo.id
                                  app.globalData.customerInf = customerInfo
                                  app.globalData.user_phone = customerInfo.phone
                                  app.globalData.user_name = customerInfo.name

                                  that.insertBindCustomerRecordAndNav();
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
  insertBindCustomerRecordAndNav(){
    var that=this;
          wx.request({
            url: app.globalData.insertBindCustomerRecord,
            data: {
                shop_id: parseInt(that.data.bind_shop_id),
                bind_type: parseInt(that.data.bind_type),
                bind_person_type: that.data.bind_staf_id ?1:2,
                bind_person_id: that.data.bind_staf_id ? parseInt(that.data.bind_staf_id) : parseInt(that.data.bind_customer_id),
                bind_person_name: that.data.bind_person_name,
                customer_code: app.globalData.customerInf.userCode,
                customer_name: app.globalData.customerInf.name,
                customer_id: app.globalData.customerInf.id,
                meals_id: parseInt(that.data.bind_meals_id),
                meals_type: parseInt(that.data.bind_meals_type),
                customer_unionId: app.globalData.unionID,
            },
            method: 'POST',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: res => {
                wx.navigateTo({
                  url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&setMealID=' + that.data.setMeal[0].setMealID + '&id=' + that.data.id + '&shop_id=' + that.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) + (that.data.DYUid ? '&DYUid=' + that.data.DYUid : ''),
              });

            },
            fail: res=>{
              console.log("绑定失败");
            }
        })

      }
  ,

    getOpenIdByCustomerId(customerId) { //通过customerId获取openid
        wx.request({
            // url: 'http://localhost:8088/evaluation/getOpenIdByCustomerId',
            url: app.globalData.allUrl.getOpenIdByCustomerId_url,
            data: {
                customerId: customerId,
            },
            success: res => {
                if (res.data.code == 1) {
                    this.setData({
                        inviterOpenid: res.data.openId,
                    })
                    app.globalData.loveInviterOpenid = res.data.openId;
                }
            }
        })
    },

    selectFocus() {
        let that = this;
        wx.request({
            url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
            data: {
                unionId: app.globalData.unionID
            },
            success: res => {
                if (res.data.list != undefined && res.data.list != "" && res.data.list.isFocus != '0') {
                    console.log("关注成功")
                    wx.request({ //已经关注后绑定关系
                        url: app.globalData.bindingRelationship_Url,
                        data: {
                            primaryBindingOpenId: that.data.inviterOpenid,
                            passiveBindingOpenId: that.data.openid,
                            shopId: that.data.shop_id ? that.data.shop_id : 0,
                        },
                    })
                    // if (that.data.isRegister == 0) { //没注册提示
                    //     wx.showModal({
                    //         content: '您尚未注册"切瓜切菜"平台账户\n注册平台即可获取平台的5个星盾奖励和商家的买单打折优惠',
                    //         cancelText: '直接购买',
                    //         confirmText: '前往注册',
                    //         success: res => {
                    //             if (res.confirm) {
                    //                 wx.navigateTo({
                    //                     url: '../register/register?openId=' + that.data.openid + '&unionId=' + that.data.unionId,
                    //                 })
                    //             }
                    //         }
                    //     })
                    // }
                } else {
                    // wx.showModal({
                    //     content: '您尚未关注"切瓜切菜"公众号\n关注公众号即可获取平台的5个星盾奖励和商家的买单打折优惠',
                    //     cancelText: '直接购买',
                    //     confirmText: '前往关注',
                    //     success: res => {
                    //         if (res.confirm) {
                    //             wx.request({ //店铺临时表
                    //                 url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addOrUpdateShopMiddleTemporary',
                    //                 data: {
                    //                     shopId: that.data.shop_id,
                    //                     unionId: that.data.unionId,
                    //                 },
                    //                 method: "POST",
                    //                 success: res => {
                    //                     wx.request({ //邀请绑定临时表
                    //                         url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addOrUpdateInviteBindTemporary',
                    //                         data: {
                    //                             inviterOpenid: that.data.inviterOpenid,
                    //                             passiveBindOpenid: that.data.openid,
                    //                             passiveBindUnionid: that.data.unionId,
                    //                             shopId: that.data.shop_id,
                    //                         },
                    //                         method: "POST",
                    //                         success: res => {
                    //                             if (app.globalData.customerInf.signIn == 1) {
                    //                                 wx.request({ //发送信息临时表
                    //                                     url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addLink',
                    //                                     data: {
                    //                                         unionId: app.globalData.unionID,
                    //                                         title: "点击这里继续购买",
                    //                                         link: "/pages/module_discount/pages/Package_details/Package_details?a=" + that.data.setMealID + "&b=0&c=" + that.data.inviteCustomerId
                    //                                     },
                    //                                     method: 'GET',
                    //                                     success(res) {
                    //                                         wx.navigateTo({
                    //                                             url: '/pages/module_others/pages/wxPublic/out',
                    //                                         })
                    //                                     }
                    //                                 })
                    //                             } else {
                    //                                 wx.request({
                    //                                     url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addLink',
                    //                                     data: {
                    //                                         unionId: app.globalData.unionID,
                    //                                         title: "点击这里前往小程序",
                    //                                         link: "/pages/module_others/pages/register/register?inviteBuy=true&a=" + that.data.setMealID + '&b=0&c=' + that.data.inviteCustomerId
                    //                                     },
                    //                                     method: 'GET',
                    //                                     success(res) {
                    //                                         wx.navigateTo({
                    //                                             url: '/pages/module_others/pages/wxPublic/out',
                    //                                         })
                    //                                     }
                    //                                 })
                    //                             }
                    //                         }
                    //                     })
                    //                 }
                    //             })
                    //         }
                    //     }
                    // })
                }
            }
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
        this.setData({
          is_video_show:app.globalData.is_video_show,
        })
        if (that.data.id == 0) {
            if(that.data.fromMenu){
                that.selectComboFrom(that.data.ticket_order_id)
            }else{
                that.selectConstitute()
            }
            that.select()
        } else {
            that.selectCoupon()
            that.selectCouponShop()
        }
    },
    selectComboFrom(orderId){
        let that =  this
        //从menu跳转进来查看已选择菜品
        wx.request({
          url: app.globalData.selectComboConstitute,
          data:{
            orderId: orderId
          },
          success:res=>{
            console.log(res);
            if(res.data.code == 1){
              that.setData({
                constituteByOrderIdList: res.data.paramsList
              },()=>{
                that.selectConstitute()
              })
            }
          }
        })
      },

    onShareAppMessage: function (e) {
        var that = this;
        that.closeShareDialog();
        let a = this.data.shareTimeLineE
        let item = that.data.CouponList ? that.data.CouponList : that.data.setMeal[0] 
        let id = a.currentTarget.dataset.id
        let i = a.currentTarget.dataset.indexshare
        let name = ''
        if (item.coupon_id){
            name = item.coupon_name
        }else{
            name = item.setMealName
        }
        var title = '推荐一个好东西给你：' + name;        
        var imgUrl = item.coupon_id ? 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/yhq5.png' : (item.pageUrl.length > 0? 
            item.pageUrl[0].pageURL : 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/yhq5.png');
        let shareObj = {
            title: title,
            path: 'pages/module_discount/pages/Package_details/Package_details?bind_type=3&bind_shop_id='+item.shop_id+'&bind_customer_id='+app.globalData.customerInf.id+'&bind_meals_type='+(item.coupon_id ? '3' : '2')+'&bind_meals_id='+(item.coupon_id ? item.coupon_id : item.setMealID) + '&bind_person_name=' + app.globalData.customerInf.name,

            imageUrl: imgUrl,
            success: function (res) {
                if (res.errMsg == 'shareAppMessage:ok') {
                    that.hide();
                }
                wx.showToast({
                  title: '发送成功！',
                })
            },
            fail: function (res) {
                if (res.errMsg == 'shareAppMessage:fail cancel') {
                    that.hide();
                } else if (res.errMsg == 'shareAppMessage:fail') {
                    that.hide();
                }
            },
        };
                // 分享人次 +1
                wx.request({
                    url: app.globalData.addShareNum_url,
                    data: {
                        shareId: item.coupon_id ? item.coupon_id : item.setMealID,
                        isCombo: item.coupon_id ? 1 : 0
                    },
                    success: res => {
                        console.log(item, "balala");
                        if (!item.coupon_id) {
                            let a = that.data.setMeal
                            a[0].share_num = Number(a[0].share_num) + 1
                            that.setData({
                                setMeal: a
                            })
                        } else {
                            let b = that.data.CouponList
                            b.share_num = Number(b.share_num) + 1
                            that.setData({
                                CouponList: b
                            })
                        }
                    }
                })
        console.log(shareObj.path, "地址");
        return shareObj;
    },
    shareSelect(e){
        console.log(e)
        this.setData({
            shareDialog:true,
            shareTimeLineE: e
        })
    },
    closeShareDialog(){
        this.setData({
            shareDialog:false,
        })
    },
    shareTimeLine(e){
        this.closeShareDialog()
        this.setData({
          showIndex: e.currentTarget.dataset.index,
          showShareImageWindow: true,
        })
    },
    // onShare(e) {
    //     console.log("进来了", e);
    //     let that = this
    //     let item = e.currentTarget.dataset.item
    //     let page = 'pages/module_discount/pages/Package_details/Package_details'
    //     let id = that.data.id
    //     wx.request({
    //         url: app.globalData.getImageCode_url + '?page=' + page + '&a=a=' + (id == 0 ? item.setMealID : that.data.coupon_id) + '&version=' + app.globalData.QRCodeVersion + '&b=b=' + id + '&c=c=' + app.globalData.customerInf.id,
    //         method: "POST",
    //         responseType: 'arraybuffer',
    //         success: res => {
    //             const fsm = wx.getFileSystemManager();
    //             const fileName = wx.env.USER_DATA_PATH + '/share_img' + (Date.parse(new Date()) / 1000) + '.jpeg';
    //             fsm.writeFile({ //获取到的数据写入临时路径
    //                 filePath: fileName, //临时路径
    //                 encoding: 'binary', //编码方式，二进制
    //                 data: res.data, //请求到的数据
    //                 success: res => {
    //                     console.log(res)
    //                     console.log(fileName) //打印路径
    //                     that.setData({
    //                         loadImagePath2: fileName,
    //                     }, () => {
    //                         if (that.waitImage) {
    //                             that.waitImage(true)
    //                         }
    //                     });
    //                 },
    //             })
    //         }
    //     })
    //     wx.showLoading({
    //         title: '正在加载...',
    //         mask: true
    //     })
    //     let isPic = id == 0 ? !item.posterUrl : !that.data.CouponList.share_url
    //     if (isPic) {
    //         wx.showModal({
    //             title: '提示',
    //             content: '该超值优惠暂无海报!',
    //             showCancel: false
    //         })
    //         wx.hideLoading({
    //             success: (res) => {},
    //         })
    //         return;
    //     } else {
    //         wx.request({
    //             url: app.globalData.addShareNum_url,
    //             data: {
    //                 shareId: id == 0 ? item.setMealID : that.data.coupon_id,
    //                 isCombo: id == 0 ? 0 : 1,
    //             },
    //             success: res => {
    //                 console.log(res);
    //                 if (id == 0) {
    //                     let a = that.data.setMeal
    //                     a[0].share_num = Number(a[0].share_num) + 1
    //                     that.setData({
    //                         setMeal: a
    //                     })
    //                 } else {
    //                     let a = that.data.CouponList
    //                     a.share_num = Number(a.share_num) + 1
    //                     that.setData({
    //                         CouponList: a
    //                     })
    //                 }
    //             }
    //         })
    //     }
    //     that.setData({
    //         spawnSetMealID: id == 0 ? item.setMealID : that.data.coupon_id,
    //         showPoster: !that.data.showPoster,
    //         currentPoster: id == 0 ? item.posterUrl : that.data.CouponList.share_url
    //     })
    //     wx.createSelectorQuery()
    //         .select('#canvas')
    //         .fields({
    //             node: true,
    //             size: true,
    //         })
    //         .exec(that.init.bind(that))
    // },
    
    onShare(e) {      
      let that = this
      let item = e.currentTarget.dataset.item      
      
      wx.createSelectorQuery()
        .select('#canvas')
        .fields({
          node: true,
          size: true,
        })
        .exec(res => {
          const canvas = res[0].node
          var ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio          
          const width = res[0].width
          const height = res[0].height
          canvas.width = width * dpr
          canvas.height = height * dpr
          ctx.scale(dpr, dpr)
  
          let imgUrl = 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/sszg/04.png';          
  
          wx.downloadFile({
            url: imgUrl,
            success: res => {
              let img2 = canvas.createImage()
              img2.src = res.tempFilePath
              new Promise((a, b) => {
                img2.onload = () => {
                  ctx.drawImage(img2, 0, 0, 621, 1104)
                  ctx.fillStyle = 'rgb(255, 255, 255)';
                  ctx.fillRect(430, 780, 210, 210);
                  //在背景加一些灰度以使上面的字更清晰一点
                  ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                  ctx.fillRect(0, 30, 621, 984);
                  a()
                }
              }).then(res => {
                wx.downloadFile({
                  url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/sszg/shareTemplate.png',
                  success: res => {
                    let img = canvas.createImage()
                    img.src = res.tempFilePath
                    new Promise((a, b) => {
                      img.onload = () => {
                        //分享模板图
                        ctx.drawImage(img, 0, 0, 621, 1104)                        
                        let roundURL = item.coupon_id ? 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/yhq5.png' : 
                                (item.pageUrl.length > 0 ? item.pageUrl[0].pageURL : 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/yhq5.png')
                        roundURL = roundURL + '?x-oss-process=image/circle,r_3000/format,png'                     
                        wx.downloadFile({
                          url: roundURL,
                          success: res =>{
                            let img3 = canvas.createImage()
                            img3.src = res.tempFilePath;  
                            new Promise((a,b) =>{
                              img3.onload = () =>{
                                ctx.drawImage(img3, 20, 100, 581, 464); 
                                a()
                              }
                            }).then(res => {                        
                        
                        //套餐参数
                        ctx.font = "45px Georgia"
                        ctx.textAlign = "left"
                        ctx.fillStyle = "#FFFFFF"
                        ctx.fillText(item.setMealName ? item.setMealName : item.coupon_name, 30, 650)
                        ctx.fillText(item.setMealName ? item.setMealName : item.coupon_name, 30.5, 650.5)
                        ctx.fillText(item.setMealName ? item.setMealName : item.coupon_name, 29.5, 649.5)
                        ctx.fillText(item.setMealName ? item.setMealName : item.coupon_name, 29, 649)
                        ctx.fillText(item.setMealName ? item.setMealName : item.coupon_name, 31, 651)                        
                        
                        ctx.font = "50px Georgia"
                        ctx.textAlign = "left"
                        ctx.fillStyle = "white"
  
                        ctx.fillText("￥" + (item.coupon_original ? item.coupon_original : item.price), 25, 725)
                        ctx.fillText("￥" + (item.coupon_original ? item.coupon_original : item.price), 25.5, 725.5)
                        ctx.fillText("￥" + (item.coupon_original ? item.coupon_original : item.price), 26, 726)
                        ctx.fillText("￥" + (item.coupon_original ? item.coupon_original : item.price), 24, 724)
                        ctx.fillText("￥" + (item.coupon_original ? item.coupon_original : item.price), 24.5, 724.5)
  
                        if(that.data.id == 0){
                          ctx.font = "36px Georgia"
                          ctx.textAlign = "left"
                          ctx.fillStyle = "white"
                          ctx.fillText("￥" + item.originalPrice, 220, 720)
                          ctx.fillText("￥" + item.originalPrice, 220.5, 720.5)
                          ctx.fillText("￥" + item.originalPrice, 221, 721)
                          ctx.fillText("￥" + item.originalPrice, 219, 719)
                          ctx.fillText("￥" + item.originalPrice, 219.5, 719.5)

                          //原价划线
                          ctx.fillStyle = 'white';
                          ctx.fillRect(215, 705, 115, 6);
                        }

                        let text1 = (item.customer_platform_commission_amount > 0 ? item.customer_platform_commission_amount + '元[平台现金]' : item.customer_platform_commission_star > 0 ? item.customer_platform_commission_star +
                         '个[平台星盾]' : '') 
                        let text2 = (item.customer_shop_commission_amount > 0 ? item.customer_shop_commission_amount + '元[商家现金]' : item.customer_shop_commission_star > 0 ? item.customer_shop_commission_star + 
                         '个[商家星盾]' : '')  
                                            
                        if (text1 != '' || text2 != '') {
                            ctx.font = "32px Georgia"
                            ctx.fillText("提成奖励：", 35, 830)
                            ctx.fillText("提成奖励：", 35.5, 830.5)
                            ctx.fillText("提成奖励：", 36, 831)
                            ctx.fillText("提成奖励：", 36.5, 831.5)
                            ctx.fillText("提成奖励：", 37, 832)

                            ctx.font = "29px Georgia"

                            if(text1 != ''){
                                ctx.fillText(text1, 50, 870)
                                ctx.fillText(text1, 50.5, 870.5)
                                ctx.fillText(text1, 51, 871)
                                ctx.fillText(text1, 51.5, 871.5)
                                ctx.fillText(text1, 52, 872)
                                if (text2 != ''){
                                    ctx.fillText(text2, 50, 910)
                                    ctx.fillText(text2, 50.5, 910.5)
                                    ctx.fillText(text2, 51, 911)
                                    ctx.fillText(text2, 51.5, 911.5)
                                    ctx.fillText(text2, 52, 912)
                                }
                            } else {
                                ctx.fillText(text2, 50, 870)
                                ctx.fillText(text2, 50.5, 870.5)
                                ctx.fillText(text2, 51, 871)
                                ctx.fillText(text2, 51.5, 871.5)
                                ctx.fillText(text2, 52, 872)
                            }
                        }                   
  
  
                        //店铺名
                        ctx.font = "25px Georgia"
                        ctx.textAlign = "left"
                        ctx.fillStyle = "#FFFFFF"
                        ctx.fillText(that.data.shop[0].area + "丨" + item.shop_name, 21, 1050)
                        ctx.fillText(that.data.shop[0].area + "丨" + item.shop_name, 21.5, 1050.5)
                        //店铺地址
                        ctx.font = "18px Georgia"
                        ctx.textAlign = "left"
                        ctx.fillStyle = "#FFFFFF"
                        let address = that.data.shop[0].shop_address
                        let addressSecond = ""
                        if (address.length > 29) {
                          addressSecond = address.slice(29)
                          address = address.substring(0, 29)
                        }
                        ctx.fillText("地址：" + address, 21, 1080)
                        ctx.fillText("地址：" + address, 21.5, 1080.5)
                        if (addressSecond != "") {
                          ctx.fillText(addressSecond, 80, 1100)
                          ctx.fillText(addressSecond, 80.5, 1100.5)
                        }
                        //套餐有效期
                        ctx.font = "25px Georgia"
                        ctx.textAlign = "right"
                        ctx.fillStyle = "#FFFFFF"
                        let time = !item.setMealName ? item.using_end_date : item.endTime.time
                        ctx.fillText("有效期：" + new Date(time).getFullYear() + '-' + new Date(time).getMonth() + '-' + new Date(time).getDay() + "止", 618, 1000)
                        ctx.fillText("有效期：" + new Date(time).getFullYear() + '-' + new Date(time).getMonth() + '-' + new Date(time).getDay() + "止", 618.5, 1000.5)
                        
                                        
                      let shopId = that.data.setMeal ? that.data.setMeal[0].shop_id : that.data.CouponList.shop_id;
                      new QRCode('myQrcode', {  
                        text: app.getServerUrl()+"/QRCode/?bind_type=3&bind_shop_id=" + shopId + "&bind_staf_id=" + app.globalData.staffDetail.id + "&bind_meals_type=" + (item.coupon_id ? 3 : 2) + "&bind_meals_id=" + (item.coupon_id ? item.coupon_id : item.setMealID) +"&bind_customer_id=" + app.globalData.customerInf.id + "&bind_person_name=" + app.globalData.customerInf.name,                     
                        width: 200, //canvas 画布的宽
                        height: 200, //canvas 画布的高
                        padding: 10, // 生成二维码四周自动留边宽度，不传入默认为0
                        correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
                        colorDark: "#000000", //分别为两种交替颜色
                        colorLight: "#FFFFFF",
                        callback: (e) => {                
                          wx.canvasToTempFilePath({
                            x: 0,
                            y: 0,
                            width: 300,
                            height: 300,
                            destWidth: 300,
                            destHeight: 300,
                            canvasId: 'myQrcode',
                            success(res) {                              
                              let img3 = canvas.createImage()
                              img3.src = res.tempFilePath
                              new Promise((a, b) => {
                                img3.onload = () => {
                                  ctx.drawImage(img3, 401, 749, 220, 220)
                                  a()
                                }
                              }).then(res => {
                                wx.canvasToTempFilePath({
                                  x: 0,
                                  y: 0,
                                  width: 621 * wx.getSystemInfoSync().pixelRatio,
                                  height: 1104 * wx.getSystemInfoSync().pixelRatio,
                                  destWidth: 621,
                                  destHeight: 1104,
                                  canvas: canvas,
                                  success: res2 => {
                                    wx.hideLoading()
                                    that.setData({
                                      loadImagePath: res2.tempFilePath,
                                    });                                    
                                    that.uploadShareCardFile(res2.tempFilePath,1)
                                  }
                                })
                              })
                            }
                          })
                        }
                      })                     
                    })
                          }
                        })
                      }
                    })
                  }
                })
              })
            }
        })
    })  
      
      wx.showLoading({
        title: '正在加载...',
        mask: true
      })
      that.setData({
        //spawnSetMealID: this.data.id == 0 ? item.setMealID : item.coupon_id,
        showPoster: that.data.fromOnShare1 ? false : !that.data.showPoster,
        //currentPoster: this.data.id == 0 ? item.posterUrl : item.share_url
      })
    },

    onShare1(e){
      let that = this;
  
      wx.showLoading({
        title: '请稍等...',
      })
  
      that.setData({
        fromOnShare1: true
      },()=>{
        new Promise((c,d)=>{
          wx.createSelectorQuery()
          .select('#canvas1')
          .fields({
            node: true,
            size: true,
          }).exec(res =>{
            const canvas = res[0].node;
            let ctx = canvas.getContext('2d');
            const dpr = wx.getSystemInfoSync().pixelRatio;
            const width = res[0].width
            const height = res[0].height
            canvas.width = width * dpr
            canvas.height = height * dpr
            ctx.scale(dpr, dpr)
            ctx.clearRect(0,0,500,400);
    
            let imgUrl = that.data.temporaryImage ? that.data.temporaryImage : 
                      that.data.temporaryImageOfVideo ? that.data.temporaryImageOfVideo : 
                      that.data.setMeal && that.data.setMeal[0].pageUrl.length > 0 ? that.data.setMeal[0].pageUrl[0].pageURL : 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/coupon_give.png';
            wx.downloadFile({
              url: imgUrl,
              success: res1 => {
                let img = canvas.createImage()
                img.src = res1.tempFilePath
                new Promise((a,b) => {
                  img.onload = () => {
                    //分享模板图
                    ctx.drawImage(img, 0, 0, 500, 400);
    
                    if (that.data.shareImageDetail) {
                      for (let i = 0; i < that.data.shareImageDetail.length; i++) {
                        const element = that.data.shareImageDetail[i];
                        
                        ctx.font = "50px nainao";
                        ctx.textAlign = "center";
                        ctx.fillStyle = that.data.currentBlockColor;
                        ctx.fillText(element, 250, (110 + (i * 50)));
                      }
                    }else{
                      ctx.font = "50px nainao"
                      ctx.textAlign = "center"
                      ctx.fillStyle = that.data.currentBlockColor
  
                      let str = that.data.setMeal ? that.data.setMeal[0].setMealAbout : that.data.CouponList.coupon_Scopeofapplication;
                      ctx.fillText(str, 250, 110)
                    }
                    a();
                  }
                }).then(res2 =>{
                  wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: 500 * wx.getSystemInfoSync().pixelRatio,
                    height: 400 * wx.getSystemInfoSync().pixelRatio,
                    destWidth: 500,
                    destHeight: 400,
                    canvas: canvas,
                    success: res3 => {
                      wx.hideLoading()
                      that.setData({
                        // showPoster: true,
                        loadImagePath1: res3.tempFilePath,
                      },()=>{
                        wx.showToast({
                          title: '生成成功',
                          icon: 'success'
                        })
                        c()
                      });
                    }
                  })
                })
              }
            })
          })
        }).then(res=>{
          that.onShare(e);
        })
      })
      
    },
    
    uploadShareCardFile(e,f){
      let that = this;
      wx.uploadFile({
        url: app.globalData.UploadAliYunFile,
        filePath: e,
        name: 'file',
        success: res=>{
          let result = JSON.parse(res.data);
          if (result.lst[0].success) {
            let url = result.lst[0].url;
            let poster_url = that.data.poster_url;
            let video_url = that.data.temporaryVideo;
  
            that.setData({
              poster_url: f == 1 ? url : poster_url,
              video_url: video_url
            },()=>{
              if(f == 1 && !that.data.shareCardInf){
                that.addShareCardInf();
              }else if(f == 1 && that.data.shareCardInf){
                that.updateShareCardInf()
              }
            })
          }
        }
      })
    },
  
    addShareCardInf(){
      let that = this;
      let data = {
        shop_id: app.globalData.shopid,
        poster_url: that.data.poster_url,
        video_url: that.data.video_url
      }
  
      wx.request({
        url: app.globalData.addShareCardInf,
        method: 'POST',
        data: data,
        success: res=>{
          if(res.data.code == 1){
            let shareCardInf = res.data.data;
            that.setData({
              shareCardInf
            })
          }
        }
      })
    },
  
    updateShareCardInf(){
      let that = this;
      let data = {
        id: that.data.shareCardInf.id,
        poster_url: that.data.poster_url,
        video_url: that.data.video_url
      }
  
      wx.request({
        url: app.globalData.updateShareCardInf,
        method: 'POST',
        data: data,
        success: res=>{
          if(res.data.code == 1){
            console.log('updateShareCardInf is success');
          }else{
            console.log('updateShareCardInf is fail');
          }
        }
      })
    },
    
    uploadImageOrVideo(){
      let that = this;
      wx.chooseMedia({
        count: 1,
        success: res1=>{
          let filePath = res1.tempFiles[0].tempFilePath;
  
          wx.uploadFile({
            filePath: filePath,
            name: 'file',
            url: app.globalData.UploadVideo_url,
            formData: {
              oldUrl: '',
            },
            success: res => {
              let a = JSON.parse(res.data);
              if(a.object){
                that.setData({
                  temporaryImage: res1.tempFiles[0].fileType == 'image' ? a.object : '',
                  temporaryVideo: res1.tempFiles[0].fileType == 'video' ? a.object : '',
                  temporaryImageOfVideo: res1.tempFiles[0].fileType == 'video' ? (a.object + '?x-oss-process=video/snapshot,t_1000,f_jpg,w_500,h_400,m_fast') : ''
                })
              }else{
                wx.showModal({
                  title: '提示',
                  content: '文件过大，上传失败',
                  showCancel: false
                })
              }
            }
          })
        }
      })
    },

    cancelTemporaryImage(){
      let that = this;
      that.setData({
        temporaryImage: '',
        temporaryVideo: '',
        temporaryImageOfVideo: '',
        loadImagePath: '',
        loadImagePath1: '',
      })
    },

    shareImageConfirm() {
      this.setData({
        showShareImageWindow: false,
        isShareToPYQ: true,
        shareDialog: false,
      }, () => {
        this.onShare(this.data.shareTimeLineE)
      })
    },

    shareImageConfirm1() {
      this.setData({
        // showShareImageWindow: false,
        isShareToPYQ: true
      }, () => {
        this.onShare1(this.data.shareTimeLineE)
      })
    },

    tips(){
      wx.showModal({
        title: '提示',
        content: '请先确认生成卡片',
        showCancel: false
      })
    },

    shareToCust(e) {
      // wx.navigateTo({
      //   url: '/pages/shop_manage/pages/BindingCustomerDetail/BindingCustomerDetail?bind_type=3&bind_shop_id=' + this.data.shop_id + '&bind_staf_id=' + app.globalData.staffDetail.id + '&bind_meals_type=' + (this.data.coupon_id ? '3' : '2') + '&bind_meals_id=' + (this.data.coupon_id ? this.data.coupon_id : this.data.setMeal[0].setMealID) + '&shareImageTitle=' + this.data.shareImageTitle + '&shareImageDetail1=' + (this.data.shareImageDetail1 ? this.data.shareImageDetail1 : this.data.setMeal ? this.data.setMeal[0].setMealAbout : this.data.CouponList.coupon_Scopeofapplication) + '&poster_url=' + this.data.poster_url + '&video_url=' + this.data.video_url,
      // })
    },

    showChangeFontColorDialog(e){
      let that = this;
      let index = e.currentTarget.dataset.index;
      let currentBlockColor = that.data.currentBlockColor;
      let blockColor = that.data.blockColor;
  
      that.setData({
        isShowChangeFontColorDialog: index == 1,
        currentBlockColor: index == 2 ? blockColor : currentBlockColor,
      })
    },

    shareImageTitleConfirm(e) {
      console.log(e)
      this.setData({
        shareImageTitle: e.detail.value
      })
    },

    changeCorlor(e) {
      var value = e.detail.value
      var colors = []
      if (value >= 0 && value < 17) {
        colors = this.gradientColors("#ff0000", "#ffff00", 17, 2.2)
        value = value
      } else if (value >= 17 && value < 33) {
        colors = this.gradientColors("#ffff00", "#00ff00", 17, 2.2)
        value = value - 17
      } else if (value >= 33 && value < 50) {
        colors = this.gradientColors("#00ff00", "#00ffff", 17, 2.2)
        value = value - 33
      } else if (value >= 50 && value < 67) {
        colors = this.gradientColors("#00ffff", "#0000ff", 17, 2.2)
        value = value - 50
      } else if (value >= 67 && value < 83) {
        colors = this.gradientColors("#0000ff", "#ff00ff", 17, 2.2)
        value = value - 67
      } else {
        colors = this.gradientColors("#ff00ff", "#ff0000", 17, 2.2)
        value = value - 83
      }
      if (value >= colors.length) {
        value = value - 1
      }
      this.setData({
        colorValue:value,
        colorGamutTip: colors[value],
        colorGamut: "-webkit-linear-gradient(left, #ffffff 0%," + colors[value] + " 100%)"
      })
  
      var colorGamuts=[]
      colorGamuts = this.gradientColors("#ffffff", this.data.colorGamutTip, 100, 2.2)
      this.setData({
        colorGrayTip: colorGamuts[this.data.colorGamutValue],
        colorGray: "-webkit-linear-gradient(left, #000000 0%," + colorGamuts[this.data.colorGamutValue] + " 100%)"
      })
  
  
      var colorGrays=[]
      colorGrays = this.gradientColors("#000000",this.data.colorGrayTip,100,2.2)
      this.setData({
        blockColor:colorGrays[this.data.colorGrayValue]
      })
    },
    changeCorlorGamut(e){
      var value = e.detail.value
      var colorGamuts = []
      colorGamuts = this.gradientColors("#ffffff", this.data.colorGamutTip, 100, 2.2)
      if (value >= colorGamuts.length) {
        value = value - 1
      }
      this.setData({
        colorGamutValue:value,
        colorGrayTip: colorGamuts[value],
        colorGray: "-webkit-linear-gradient(left, #000000 0%," + colorGamuts[value] + " 100%)"
      })
  
      var colorGrays = []
      colorGrays = this.gradientColors("#000000", this.data.colorGrayTip, 100, 2.2)
      this.setData({
        blockColor: colorGrays[this.data.colorGrayValue]
      })
    },
    changeCorlorGray(e){
      var value = e.detail.value
      var colorGrays = []
      colorGrays = this.gradientColors("#000000", this.data.colorGrayTip, 100, 2.2)
      if (value >= colorGrays.length) {
        value = value - 1
      }
      this.setData({
        colorGrayValue:value,
        blockColor: colorGrays[value],
      })
    },
    
    parseColor: function (hexStr) {
      return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) {
        return 0x11 * parseInt(s, 16);
      }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) {
        return parseInt(s, 16);
      })
    },
  
    // zero-pad 1 digit to 2
    pad: function (s) {
      return (s.length === 1) ? '0' + s : s;
    },
  
    gradientColors: function (start, end, steps, gamma) {
      var i, j, ms, me, output = [],
        so = [];
      gamma = gamma || 1;
      var normalize = function (channel) {
        return Math.pow(channel / 255, gamma);
      };
      start = this.parseColor(start).map(normalize);
      end = this.parseColor(end).map(normalize);
      for (i = 0; i < steps; i++) {
        ms = i / (steps - 1);
        me = 1 - ms;
        for (j = 0; j < 3; j++) {
          so[j] = this.pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
        }
        output.push('#' + so.join(''));
      }
      return output;
    },
  
    closeShareImageDetail(e){
      let that = this;
  
      that.setData({
        showShareImageWindow: false,
        loadImagePath: '',
        loadImagePath1: '',
        shareImageTitle: '',
        shareContent: '',
        temporaryImage: '',
        temporaryVideo: '',
        fromOnShare1: false
      })
    },
    closePosterWindow() {
      let that = this
      that.setData({
        showPoster: !that.data.showPoster,
        loadImagePath2: '',
        loadImagePath: '',
        currentPoster: '',
        shareImageTitle: '',
        shareImageDetail: []
      })
    },

    init(res) {
        let that = this
        const width = res[0].width
        const height = res[0].height
        this.setData({
            canvas: res[0].node,
            loadImagePath: '',
            loadImagePath2: '',
        })
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        that.drawBackground().then(function () {
            that.drawQRCode().then(function () {
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: 621 * wx.getSystemInfoSync().pixelRatio,
                    height: 1104 * wx.getSystemInfoSync().pixelRatio,
                    destWidth: 621,
                    destHeight: 1104,
                    canvas: that.data.canvas,
                    success: function (res) {
                        console.log(res)
                        that.setData({
                            loadImagePath: res.tempFilePath,
                        });
                        wx.hideLoading({
                            success: (res) => {},
                        })
                    },
                    fail: res => {
                        console.log(res)
                        wx.hideLoading({
                            success: (res) => {},
                        })
                    }
                })
            })
        })
    },
    drawQRCode() {
        const that = this
        const canvas = this.data.canvas
        const ctx = canvas.getContext('2d')
        const img2 = canvas.createImage()
        return new Promise(function (resolve, reject) {
            that.waitImage = (bool) => {
                if (bool) {
                    img2.src = that.data.loadImagePath2

                    img2.onload = () => {
                        ctx.drawImage(img2, 505, 1000, 90, 90)
                        resolve()
                    }
                }
            }
        })
    },
    drawBackground() {
        const that = this
        const canvas = this.data.canvas
        const ctx = canvas.getContext('2d')
        const img = canvas.createImage()
        img.src = that.data.currentPoster
        return new Promise(function (resolve, reject) {
            img.onload = () => {
                ctx.drawImage(img, 0, 0, 621, 1104)
                resolve()
            }
        })
    },
    closePosterWindow() {
        let that = this
        that.setData({
            showPoster: !that.data.showPoster,
            loadImagePath2: '',
            loadImagePath: '',
            currentPoster: '',
            foodList: [],
            pageNum1: 0,
        })
    },
//秘邻视频审核失败回调方法
    videoVertifyFailed(e){
      console.log(e)
    },
    // 秘邻视频审核通过回调方法
    videoVertifySuccess(e){
      console.log(e)
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
    toHome(){
        wx.navigateTo({
            url: '/pages/main/main',
          })
    },
    toShop(){
        if(this.data.shop_id){
            app.globalData.shopid = this.data.shop_id
            app.getManagementDataServlet() //获取店铺设置信息
            wx.navigateTo({
              url: '/pages/index/index',
            })
        }else{
            wx.showToast({
              title: '无店铺信息',
            })
        }
        
    },
    toOrderList:function(e){
        wx.navigateTo({
            url: '/pages/module_discount/pages/orderList/orderList?packageIndex=1',
          })
    },
    hideNewCouponDlgShow:function(e){
        this.setData({
            new_coupon_dlg_show:false,
        })
    }
    //packageIndex
})