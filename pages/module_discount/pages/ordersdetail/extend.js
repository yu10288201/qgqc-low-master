import RMQV3 from '../../../../utils/RMQV3.js';

const rmq = require('../../../../utils/RMQV3.js');
const app = getApp()
const remarkJS = require('../../../../utils/remark.js');
const WXAPI = require('../../../../wxapi/main');
const pay = require('../../../../utils/wxpay');
const qr = require('../../../../utils/QRCode');
var that = Object;

export const closeQRcode = function () {
    wx.request({
        url: app.globalData.GetTicketCode_url,
        data: {
            path: path
        },
        header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        method: 'POST',
        success: function (res) {
            var url = res.data.object
            console.log(url)
            console.log(res)
            that.setData({
                codeImage: url,
                actionSheetHidden1: !that.data.actionSheetHidden1,
                hexiaoShop: item.shopName,
                hexiaoName: item.orderName,
                hexiaoTime: item.createDate,
                hexiaoNum: item.detailedCount,
                hexiaoType: item.ticketDetails[0].ticketInfo.dishesUnit,
                hexiaoMoney: item.orderTotal * 0.01,
                hexiaoOldMomey: item.ticketDetails[0].ticketInfo.originalprice
            })
        }
    })
}

export const showQRcode = function () {
    if (that.data.QRShow) {
        that.setData({
            QRShow: false
        }, () => {
            console.log('关闭绘画框')
        })
    } else {
        this.setData({
            QRShow: true
        }, () => {
            console.log('打开绘画框')
            let text = that.data.thisorderarry.shop_id + "," + that.data.vouchersInfo[that.data.vouchersIndex].management_coupons_uuid
            qr.qrApi.draw(text, 'QRC', 250, 250, null, './logo.png')
            wx.canvasToTempFilePath({
                canvasId: 'QRC',
                success: function (res) {
                    var tempFilePath = res.tempFilePath;
                    that.setData({
                        loadImagePath: tempFilePath,
                    });
                },
                fail: function (res) {
                    console.log(res);
                }
            })
        })
    }
}
export const test = function () {
    console.log(this.data.test);
    console.log(app.globalData);
}
export const CashRegister = function (shopId, orderId) {
    let that = this
    console.log(this.data.paymethod)
    console.log(this.data.thisorderarry.paymethod)
    wx.request({
        // url: 'http://localhost:8080/WX Restaurant/UpdateOrderInfForAllNew',
        url: app.globalData.UpdateOrderInfNew_url,
        data: {
            Order_id: this.data.orderid,
            Shop_id: this.data.shop_id,
            // operator: this.data.loginname,
            operator: this.data.thisorderarry.allCheck.operatorName,
            Order_status: "已买单",
            operation_time: new Date(),
            // payMode:this.data.thisorderarry.paymethod,
            payMode: this.data.paymethod,
            table_id: this.data.thisorderarry.table_id
        },
        method: 'GET',
        success: function (res) {
            if (res.data.result.result == 1) {
                wx.showToast({
                    title: '已支付成功', //提示文字
                    duration: 2000, //显示时长
                })
                that.redress()
            }
            wx.request({
                url: app.globalData.GetOrderPaymentInf_url,
                data: {
                    Order_id: that.data.thisorderarry.order_id
                },
                success(res) {
                    that.setData({
                        payDate: res.data.object[0].pay_date
                    })
                }
            })
        }
    })
}

export const showPrice = function () {
    console.log('7777777777777777777777777777777777777777777777777')
    let that = this
    let a = that.data.calueStoredSelected ? 2 : that.data.PDSelected ? 1 : 0
    if (a == 1) {
        wx.request({
            // url: 'http://localhost:8088/evaluation/getCashierInfoNew',
            url: app.globalData.getCashierInfoNew,
            data: {
                orderId: that.data.thisorderarry.order_id,
                shopId: parseInt(app.globalData.shopid),
                phone: that.data.thisorderarry.phone_num ? that.data.thisorderarry.phone_num : that.data.thisorderarry.vipPhone,
            },
            success: res => {
                if (res.data.code == 1) {
                    if (res.data.params.advanceDeposit) {
                        that.setData({
                            advanceDeposit: res.data.params.advanceDeposit,
                        })
                    }
                    that.setData({
                        actualTotalByOrderId: res.data.params.actualTotalByOrderId,
                        otherAdvanceDeposit: res.data.params.otherAdvanceDeposit,
                        waitPay: res.data.params.otherAdvanceDeposit > 0 ? true : false
                    })
                }
            }
        })
        return;
    }
    wx.request({
        // url: 'http://192.168.8.7:8081/evaluation/getCashierInfo',
        url: app.globalData.getCashierInfo,
        data: {
            orderId: that.data.thisorderarry.order_id,
            phone: that.data.thisorderarry.phone_num ? that.data.thisorderarry.phone_num : that.data.thisorderarry.vipPhone,
            payMode: that.data.calueStoredSelected ? 2 : that.data.PDSelected ? 1 : 0,
            shopId: parseInt(app.globalData.shopid)
        },
        header: {
            'content-type': 'application/json'
        },
        method: "POST",
        success(res) {
            console.log(res)
            let actualTotalByOrderId = res.data.params.actualTotalByOrderId ? res.data.params.actualTotalByOrderId : ''
            let advanceDeposit = res.data.params.advanceDeposit ? res.data.params.advanceDeposit : ''
            let otherAdvanceDeposit = res.data.params.actualTotalByOrderId ? res.data.params.actualTotalByOrderId : ''
            let otherVoupon = res.data.params.otherVoupon ? res.data.params.otherVoupon : ''
            let thisVoupon = res.data.params.thisVoupon ? res.data.params.thisVoupon : ''
            that.setData({
                actualTotalByOrderId,
                advanceDeposit,
                otherAdvanceDeposit,
                otherVoupon,
                thisVoupon,
            })
        }
    })
}

export const initVip = function () {
    let that = this
    let params = {
        shopId: this.data.shop_id,
        orderId: this.data.orderid,
        phone: this.data.vipPhone,
        vipCard: this.data.vipCard,
    }
    console.log(params)
    wx.request({
        // url: 'http://localhost:8081/evaluation/getShopPreferentidInfo',
        url: app.globalData.allUrl.getShopPreferentidInfo,
        data: params,
        method: 'POST',
        header: {
            'content-type': 'application/json'
        },
        success: res => {
            console.log(res)
            var nPD = this.data.nPD
            var calueStored = this.data.calueStored
            var vipCheck = this.data.vipCheck
            var member_level = this.data.member_level
            var calueStoredSelected = this.data.calueStoredSelected
            if (res.data && res.data.data.is_state) {
                vipCheck = false
            }
            let orderPayment = this.data.orderPayment
            if (res.data.data) {
                orderPayment.actual_total = res.data.data.actual_total
                calueStored = res.data.data
                vipCheck = false
                console.log(that.data.thisorderarry.isPayPW)
                that.setData({
                    member_level,
                    nPD,
                    calueStored,
                    PDSelected: false,
                    vipCheck: vipCheck,
                    orderPayment,
                    paymethod: that.data.thisorderarry.paymethod,
                    VIPPayLogin: that.data.thisorderarry.isPayPW == 1
                })
            }
        }
    })
}
export const cancelVipPrice = function (e) {

}
export const newGetYuCun = function (e) {
    wx.request({
        // url: 'https://test.fsmbdlkj.com/WX%20Restaurant/GetOneVipInfo',
        url: app.globalData.GetOneVipInfo,
        data: {
            shopId: app.globalData.shopdetail.shop_id,
            phone: that.data.thisorderarry.phone_num ? that.data.thisorderarry.phone_num : ''
        },
        method: 'GET',
        success: res => {
            if (res.data.object) {
                if (that.data.thisorderarry.isPay == 0 && that.data.thisorderarry.isPayPW == 0) {
                    this.setData({
                        advanceDeposit: res.data.object.prepaidDeposit,
                    })
                }
                this.setData({
                    newYuCunInfo: res.data.object,
                })
            }
        }
    })
}
//线上价完工 6-15 15:30
export const xianShangJiaClac = function (e) {
    let that = this
    if (that.data.thisorderarry.order_equipment_type != 3 && that.data.thisorderarry.order_equipment_type != 6) {
        return 0;
    }
    var orderMoney = 0
    let ds = that.data.dishes
    for (let item of ds) {
        let item_number = Math.abs(item.item_number);
        switch (item.spec_type) {
            case 0:
            case 1:
            case 9:
            case 10:
            case 21:
            case 22:
            case 23:
            case 24:
            case 25:
            case 26:
            case 27:
                if (item.dishes_status == 20) {
                    orderMoney += item.inline_price > 0 ? (Math.abs(item.inline_price) * Math.abs(item.item_number) + Math.abs(item.additional_money)) * -1 :
                        Math.abs(item.item_dishes_money) * -1
                } else {
                    orderMoney += item.inline_price > 0 ? item.inline_price * item.item_number + Number(item.additional_money) :
                        Number(item.item_dishes_money) + Number(item.additional_money);
                }
                continue;
            case 11: //临时菜，暂时不做
                if (item.dishes_status == 20) {
                    orderMoney -= item.item_subtotal
                } else {
                    orderMoney += Number(item.item_subtotal)
                }
                continue;
            case 91: //多拼粥
                let tmpTotalPrice = 0
                if (item.dishes_status == 20) {
                    for (let i = 0; i < item.lstOrderJointSet.length; i++) {
                        const ojs = item.lstOrderJointSet[i]
                        let tmpPrice = 0
                        tmpPrice += ojs.joint_set_inline_price > 0 ? Math.abs(ojs.joint_set_inline_price) * Math.abs(ojs.joint_set_number) * -1 : Math.abs(ojs.joint_set_subtotal) * -1
                        tmpTotalPrice += tmpPrice
                    }
                    orderMoney += (Math.abs(tmpTotalPrice) * item_number + Math.abs(item.additional_money)) * -1
                } else {
                    for (let i = 0; i < item.lstOrderJointSet.length; i++) {
                        const ojs = item.lstOrderJointSet[i]
                        let tmpPrice = 0
                        tmpPrice += ojs.joint_set_inline_price > 0 ? Math.abs(ojs.joint_set_inline_price) * Math.abs(ojs.joint_set_number) : Math.abs(ojs.joint_set_subtotal)
                        tmpTotalPrice += tmpPrice
                    }
                    orderMoney += Math.abs(tmpTotalPrice) * item_number + Math.abs(item.additional_money)
                }
                continue;
            case 2: //多计量多做法
            case 8: //来料加工
                if (item.dishes_status == 20) {
                    orderMoney += item.inline_price > 0 ? (Math.abs(item.inline_price) * Math.abs(item.measurement_value) + Math.abs(item.additional_money)) * -1 :
                        Math.abs(item.item_dishes_money) * -1;
                } else {
                    orderMoney += item.inline_price > 0 ? item.inline_price * item.measurement_value + Number(item.additional_money) :
                        Number(item.item_dishes_money) + Number(item.additional_money);
                }
                continue;
            default:
                if (item.dishes_status == 20) {
                    orderMoney += item.inline_price > 0 ? (Math.abs(item.inline_price) * Math.abs(item.item_number) + Math.abs(item.additional_money)) * -1 :
                        Math.abs(item.item_dishes_money) * -1
                } else {
                    orderMoney += item.inline_price > 0 ? item.inline_price * item.item_number + Number(item.additional_money) :
                        Number(item.item_dishes_money) + Number(item.additional_money);
                }
                continue;
        }
    }
    that.setData({
        orderMoney: orderMoney
    })
}
//选择优惠类型
export const chooseDiscount = function (e) {
    let that = this
    let index = e.currentTarget.dataset.index
    that.setData({
        chooseDiscountIndex: index,
        orderMoney: null,
        newYuCunInfo: ''
    })
    let useList = {
        useXianShangJia: false, //线上价
        useYuCunYouHui: false, //预存优惠
        useQuanDanDaZhe: false, //全单打折
        useBuZhangDaZhe: false, //部长打折
        useHuiYuanJia: false, //会员价
        useJiBieHuiYuanJia: false, //级别会员价
        useCoupon: false, //优惠券
        useNoSale: false, //不使用优惠
        useNewBindCoupon:false,//使用新人关注代金券
    }
    let usedetailList = this.data.chooseSaleList[index].detailList
    that.setData({
        useYuCunYuE: false,
        useCoupon: false,
        vouchersInfo: [],
        PDSelected: false,
        isSatisfy: true,
        paymethod: 0,
    })
    for (let i = 0; i < usedetailList.length; i++) {
        const list = usedetailList[i];

        if(list.coupon_type.toLowerCase()==that.data.used_new_bind_coupon_type.toLowerCase()){        
          
            that.setData({
            check_used_new_bind_show:true,
          })
          useList.useNewBindCoupon=true

         //是新人赠送代金券
                                    
         if(list.newCouponsInfoList&&list.newCouponsInfoList.length>0){

            var  couponObj=list.newCouponsInfoList[0];
            if(couponObj.couponFacevalue>0){

                        var new_bind_spend_price=couponObj.spendPrice;
                        var used_new_bind_coupon_max_count= parseInt(that.data.thisorderarry.total_amount/couponObj.spendPrice)
                        if(used_new_bind_coupon_max_count<=0){
                            wx.showToast({
                            title: '当前小额额不满足条件使用新人优惠券',
                            icon:'error'
                            })
                        }
                        that.setData({
                        used_new_bind_coupon_max_count:used_new_bind_coupon_max_count,
                        new_bind_coupon_face_amount:couponObj.couponFacevalue,
                        new_bind_spend_price:new_bind_spend_price,
                        })
                    }

            }

          //查询已使用的新人优惠券
          that.selectOrderInfNewCoupon();
         
          
        }else{

          that.setData({
            check_used_new_bind_show:false,
          })
          useList.useNewBindCoupon=false
          //不使用新人优惠券
          
        }


        switch (list.type_uid.toLowerCase()) {
            case "D1012BFA-EA95-43E9-BFEC-F223FB37A3A3".toLowerCase(): //级别会员价
                useList.useJiBieHuiYuanJia = true
                break;
            case "3D49B9F1-1481-4495-91B9-D681144BF896".toLowerCase(): //线上价
                useList.useXianShangJia = true
                that.xianShangJiaClac()
                break;
            case "1F8F7B07-449E-4DF6-9EBC-8F4DA12A0C1B".toLowerCase(): //会员价
                useList.useHuiYuanJia = true
                break;
            case "4076BDBE-08D2-4F8C-B5E9-ED219A53D2AF".toLowerCase(): //预存优惠
                useList.useYuCunYouHui = true
                that.newGetYuCun()
                that.setData({
                    useYuCunYuE: true,
                })
                break;
            case "EB110AC9-1EA5-40D6-A220-D36143B80AA9".toLowerCase(): //部长打折
                useList.useBuZhangDaZhe = true
                break;
            case "7C11092F-47B0-4214-B8AC-E16FF2121EE5".toLowerCase(): //全单打折
                useList.useQuanDanDaZhe = true
                break;
            case "00000000-0000-0000-0000-000000000000".toLowerCase(): //不使用优惠
                useList.useNoSale = true
                break;
            default: //优惠券
                useList.useCoupon = true
                that.setData({
                    useCoupon: true,
                    vouchersInfo: list.couponsInfoList
                })
                break;
        }
    }
    this.setData({
        chooseSaleUseList: useList,
    })
}
export const confirmPassword = function (e) {
    let that = this
    // let json = {
    //   shop_id: that.data.shop_id,
    //   order_id: that.data.orderid,
    //   phone: that.data.vipPhone,
    //   pw: that.data.VIPPayPwd,
    //   // deducted_amount: that.data.calueStored ? that.data.calueStored.deduction_price : that.data.nPD ? that.data.orderPayment.actual_total : that.data.PD,
    //   deducted_amount: that.data.advanceDeposit > that.data.actualTotalByOrderId ? that.data.actualTotalByOrderId : that.data.advanceDeposit,
    //   used_other_payment: that.data.orderPayment.actual_total - that.data.PD
    // }
    if (app.globalData.customerInf.password == '' || app.globalData.customerInf.password == null) {
        console.log(app.globalData.customerInf, '注册表信息');
        wx.showModal({
            title: "预存支付密码为空，不能进行预存支付操作\n\t\r请设置密码",
            confirmText: '去设置',
            success: res => {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '/pages/module_others/pages/setUp/setUp',
                    })
                }
            }
        })
        return;
    }
    wx.request({
        // url: 'http://localhost:8087/WX Restaurant/checkPasswordToPay',
        url: app.globalData.checkPasswordToPay,
        data: {
            phone: that.data.vipPhone ? that.data.vipPhone : that.data.thisorderarry.phone_num,
            password: that.data.VIPPayPwd,
            order_id: that.data.orderid,
            shop_id: that.data.shop_id,
            is_other_pay: that.data.advanceDeposit > that.data.actualTotalByOrderId ? 0 : 1,

            used_prepaid_deposit: that.data.advanceDeposit > that.data.actualTotalByOrderId ? that.data.actualTotalByOrderId : that.data.advanceDeposit,

            remain_prepaid_deposit: that.data.advanceDeposit > that.data.actualTotalByOrderId ? that.data.advanceDeposit - that.data.actualTotalByOrderId : 0
        },
        success: res => {
            if (res.data.result.result == 1) {
                let aaa = that.data.thisorderarry
                aaa.isPayPW = 1
                if (that.data.advanceDeposit > that.data.actualTotalByOrderId) {
                    aaa.isPay = 1
                }
                aaa.remain_prepaid_deposit = that.data.advanceDeposit > that.data.actualTotalByOrderId ? that.data.advanceDeposit - that.data.actualTotalByOrderId : 0

                aaa.used_prepaid_deposit = that.data.advanceDeposit > that.data.actualTotalByOrderId ? that.data.actualTotalByOrderId : that.data.advanceDeposit
                that.setData({
                    thisorderarry: aaa,
                    VIPPayLogin: true
                })
            } else if (res.data.result.result == 2) {
                wx.showToast({
                    title: '密码错误',
                    icon: 'error',
                })
            } else {
                wx.showToast({
                    title: '系统错误',
                    icon: 'error',
                })
            }
        }
    })


}

export const closeChooseList = function (e) {   

    //在选择时已做了相关操作，点击确定按钮和取消按钮只需要关闭弹窗即可
//     if (app.globalData.linshiIndex != -1) {
//       this.setData({
//           chooseDiscountIndex: app.globalData.linshiIndex
//       })
//    }
//    app.globalData.linshiIndex = -1
    this.setData({
        showChooseList: false
    })
}

export const getOrderApplyList = function () {
    let that = this
    wx.request({
        // url: 'http://localhost:8088/evaluation/getOrderApplyList',
        url: app.globalData.getOrderApplyList,
        data: {
            shopId: that.data.thisorderarry.shop_id,
            orderId: that.data.thisorderarry.order_id,
        },
        success: res => {
            if (res.data.code == 1) {
                if (res.data.orderApplyBuy) {
                    let orderApplyBuy = res.data.orderApplyBuy
                    let chooseSaleList = that.data.chooseSaleList
                    for (let i = 0; i < chooseSaleList.length; i++) {
                        if (orderApplyBuy.shopMultipleDiscountUid == chooseSaleList[i].uid) {

                            let a = chooseSaleList
                            let b = chooseSaleList[i]
                            a.splice(i, 1)
                            a.splice(0, 0, b)

                            that.setData({
                                chooseSaleList: a,
                                paymethod: orderApplyBuy.payMethod,
                                PDSelected: orderApplyBuy.isUsePrestoreAmount ? true : false
                            })
                            let detailList = chooseSaleList[0].detailList
                            let typeUid = [
                                'D1012BFA-EA95-43E9-BFEC-F223FB37A3A3', //级别会员价
                                '3D49B9F1-1481-4495-91B9-D681144BF896', //线上价
                                '1F8F7B07-449E-4DF6-9EBC-8F4DA12A0C1B', //会员价
                                '4076BDBE-08D2-4F8C-B5E9-ED219A53D2AF', //预存优惠
                                'EB110AC9-1EA5-40D6-A220-D36143B80AA9', //部长打折
                                '7C11092F-47B0-4214-B8AC-E16FF2121EE5', //全单打折
                                '00000000-0000-0000-0000-000000000000' //不使用优惠
                            ]
                            for (let x of detailList) { //循环多重优惠组合
                                if (typeUid.indexOf(x.type_uid) == -1) { //判断是否有优惠券
                                    let couponsInfoList = x.couponsInfoList
                                    if (orderApplyBuy.couponList) {
                                        for (let i = 0; i < couponsInfoList.length; i++) { //循环优惠券
                                            let k = couponsInfoList[i]
                                            for (let v of orderApplyBuy.couponList) { //遍历申请使用的优惠券
                                                if (k.management_coupons_uuid == v.management_coupons_uid) { //高亮申请使用的优惠券
                                                    k.color = '#00dd00'
                                                    couponsInfoList.splice(i, 1)
                                                    couponsInfoList.splice(0, 0, k)
                                                }
                                            }
                                        }
                                    }
                                    that.setData({
                                        vouchersInfo: couponsInfoList,
                                        useCoupon: true,
                                    })
                                }
                                if (x.type_uid == '4076BDBE-08D2-4F8C-B5E9-ED219A53D2AF') {
                                    that.newGetYuCun()
                                }
                            }
                        }
                    }
                }
            }
        }
    })
}
export const showChooseList = function (e) {
    this.setData({
        showChooseList: true
    })
}
export const getDiscountList = function (e) {
    let that = this
    wx.request({
        url: app.globalData.getShopUseMultipleDiscount,
        data: {
            shop_id: app.globalData.shopdetail.shop_id,
            order_id:that.data.orderid,
            phone: that.data.thisorderarry.phone_num ? that.data.thisorderarry.phone_num : ''
        },
        success: res => {
            if (res.data.code == 1) {
                var chooseSaleList = []
                chooseSaleList = res.data.paramsList
                chooseSaleList.push({
                    code: "0000",
                    is_show: 1,
                    detailList: [{
                        is_show: 1,
                        discount_name: "不使用优惠",
                        group_uid: "00000000-0000-0000-0000-000000000000",
                        is_delete: "0",
                        shop_id: app.globalData.shopdetail.shop_id,
                        type_id: "1",
                        type_uid: "00000000-0000-0000-0000-000000000000",
                        coupon_type: "00000000-0000-0000-0000-000000000000",
                        uid: "00000000-0000-0000-0000-000000000000"
                    }],
                    shop_id: app.globalData.shopdetail.shop_id,
                    uid: "00000000-0000-0000-0000-000000000000",
                })
                chooseSaleList.reverse()
                
                //如果下单方式是在线下单，则默认选择线上价的优惠项
                let indexA = 0                
                if(that.data.thisorderarry.order_equipment_type == 3){                    
                  for (let k = 0; k < chooseSaleList.length; k++) {                      
                    if(chooseSaleList[k].detailList.length == 1 && chooseSaleList[k].detailList[0].type_uid == '3D49B9F1-1481-4495-91B9-D681144BF896'){
                      indexA = k
                    }
                  }
                } 
                
                //如果下单方式是在线或到店使用已购/赠送，则默认选择使用已购/赠送的优惠项
                let indexB = 0                 
                if(that.data.thisorderarry.order_equipment_type == 6 || that.data.thisorderarry.order_equipment_type == 7){
                    for (let k = 0; k < chooseSaleList.length; k++) {
                      if(chooseSaleList[k].detailList.length == 1 && chooseSaleList[k].detailList[0].type_uid == '8EE38585-A268-4C06-989F-93003D4082D5'){
                        indexB = k
                      }
                    }
                }
                
                that.setData({
                    chooseSaleList: chooseSaleList,
                    chooseDiscountIndex: indexA > 0 ? indexA : indexB > 0 ? indexB : 0,
                }, () => {
                  
                    if (that.data.thisorderarry.order_status == "申请买单") {
                        that.getOrderApplyList()
                    }else if (that.data.thisorderarry.order_status == '等待买单' || that.data.thisorderarry.order_status == "已买单") {
                        for (let i = 0; i < chooseSaleList.length; i++) {
                            if (that.data.thisorderarry.shop_multiple_discount_use_uid == chooseSaleList[i].uid) {

                                let a = chooseSaleList
                                let b = chooseSaleList[i]
                                a.splice(i, 1)
                                a.splice(0, 0, b)

                                that.setData({
                                    chooseSaleList: a,
                                    paymethod: that.data.thisorderarry.payMethod,
                                    PDSelected: that.data.thisorderarry.isAdvance == 1
                                })
                                let detailList = chooseSaleList[0].detailList
                                let typeUid = [
                                    'D1012BFA-EA95-43E9-BFEC-F223FB37A3A3', //级别会员价
                                    '3D49B9F1-1481-4495-91B9-D681144BF896', //线上价
                                    '1F8F7B07-449E-4DF6-9EBC-8F4DA12A0C1B', //会员价
                                    '4076BDBE-08D2-4F8C-B5E9-ED219A53D2AF', //预存优惠
                                    'EB110AC9-1EA5-40D6-A220-D36143B80AA9', //部长打折
                                    '7C11092F-47B0-4214-B8AC-E16FF2121EE5', //全单打折
                                    '00000000-0000-0000-0000-000000000000' //不使用优惠
                                ]
                                for (let x of detailList) { //循环多重优惠组合
                                    if (typeUid.indexOf(x.type_uid) == -1) { //判断是否有优惠券
                                        that.setData({
                                            vouchersInfo: that.data.thisorderarry.platformCouponsList,
                                            useCoupon: true,
                                        })
                                    }
                                    if (x.type_uid == '4076BDBE-08D2-4F8C-B5E9-ED219A53D2AF') {
                                        that.newGetYuCun()
                                        that.setData({
                                            useYuCunYuE: true,
                                        })
                                    }
                                }
                            }
                        }
                    }else if(that.data.thisorderarry.order_equipment_type == 3 ){
                      if(indexA != 0){                        
                        that.chooseDiscount({currentTarget: {dataset:{index:indexA}}})
                      }
                    }
                })
                
            }
        }
    })
}
export const changeVipUsed = function () {
    if (!that.data.VipUsed) {        
        wx.request({            
            url: app.globalData.VipCalculateDiscountInformation,
            data: {
                order_id: this.data.orderid,
                shop_id: this.data.shop_id,
                phone: this.data.vipPhone ? this.data.vipPhone : this.data.thisorderarry.phone_num,
                card: this.data.vipCard,
            },
            method: 'POST',
            success: res => {
                if (res.data.result == "success") {
                    let orderPayment = this.data.orderPayment
                    let isAdvanceDeposit = 0
                    if (res.data.object) { //普通会员
                        orderPayment.actual_total = res.data.object.actual_total
                        this.setData({
                            vipCheck: true,
                            vipCheck2: true,
                            total_vip_account: res.data.object.total_vip_amount, //会员总价
                            total_vip_distinct_account: res.data.object.total_vip_distinct_amount, // 会员折后价总计
                            vip_preferential_amount: res.data.object.vip_preferential_amount,
                            member_level: res.data.object.member_level, //会员等级 actual_total
                            orderPayment,
                            paymethod: 0,
                        })
                        isAdvanceDeposit = 1
                    } else { //超值会员
                        orderPayment.actual_total = res.data.data.actual_total
                        this.setData({
                            orderPayment,
                            vipCheck: true,
                            vipCheck2: true,
                            member_level: "超值预存会员",
                            calueStored: res.data.data,
                            calueStoredSelected: true,
                            paymethod: 0,
                        })
                    }
                    that.setData({
                        VipUsed: true
                    }, () => {
                        that.showPrice()
                    })
                }
            }
        })
    } else {
        wx.request({
            // url: 'http://192.168.8.163:8083/evaluation_war/CancelVipCalculateDiscountInformation',
            url: app.globalData.CancelVipCalculateDiscountInformation,
            data: {
                order_id: this.data.thisorderarry.order_id,
                shop_id: this.data.thisorderarry.shop_id,
            },
            method: "POST",
            header: {
                "content-type": 'application/json'
            },
            success: res => {
                this.setData({
                    VipUsed: false,
                    rmqfresh: true
                })
                if (res.data.result == "success") {
                    that.refresh()
                }
            }
        })
    }
}
export const toVipCheck = function () {
    let that = this
    let a = this.data.thisorderarry
    a.order_status = "申请买单"    
    this.setData({
        thisorderarry: a
    })
    let couponList = []
    if (that.data.vouchersInfo) {
        let vouchersInfo = that.data.vouchersInfo
        for (let x of vouchersInfo) {
            if (x.color && x.color == '#00dd00') {
                let detail = {
                    management_coupons_uid: x.management_coupons_uuid,
                    shop_id: x.shop_id,
                }
                couponList.push(detail)
            }
        }
    }

    let chooseDiscount = that.data.chooseSaleList[that.data.chooseDiscountIndex]

    wx.request({
        // url: 'http://localhost:8088/evaluation/addOrderApply',
        url: app.globalData.addOrderApply,
        method: "POST",
        data: {
            shopMultipleDiscountUid: chooseDiscount.uid,
            orderId: a.order_id,
            shopId: a.shop_id,
            payMethod: that.data.paymethod,
            isUsePrestoreAmount: that.data.PDSelected ? 1 : 0,
            couponList: couponList,
            chooseDiscountList: chooseDiscount.detailList,
        },
        success: res => {
            if (res.data.code == 1) {

                wx.hideLoading({
                    success: (res) => {
                        RMQV3.sendRabbitMQMsg({
                            msg_id: 'SSZGSSZGSSZGSSZGSSZGSSZGSSZ' + app.globalData.caustomerId,
                            from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
                            msg: {
                                type: 'refresh',
                                text: '刷新'
                            },
                            table_name: app.globalData.locationname,
                            table_id: app.globalData.locationid,
                            tg: "bz",
                            shop_id: app.globalData.shopid,
                            back: res => {
                                console.log(res);
                            }
                        })
                    },
                })
                // 添加粉丝表
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
                console.log(res);
            }

        }
    })
    // this.setData({vipCheck:true})
    // console.log(this.data.vipCard)
    // if (this.data.vipPhone ? this.data.vipPhone : this.data.thisorderarry.phone_num || this.data.vipCard) {
    //   wx.request({
    //     // url: 'http://192.168.8.163:8080/evaluation_war/VipCalculateDiscountInformation',
    //     url: app.globalData.VipCalculateDiscountInformation,
    //     data: {
    //       order_id: this.data.orderid,
    //       shop_id: this.data.shop_id,
    //       phone: this.data.vipPhone ? this.data.vipPhone : this.data.thisorderarry.phone_num,
    //       card: this.data.vipCard,
    //     },
    //     method: 'POST',
    //     success: res => {
    //       if (res.data.result == "success") {
    //         let orderPayment = this.data.orderPayment
    //         let isAdvanceDeposit = 0
    //         if(res.data.object){//普通会员
    //           orderPayment.actual_total = res.data.object.actual_total
    //           this.setData({
    //             vipCheck: true,
    //             vipCheck2: true,
    //             total_vip_account: res.data.object.total_vip_amount, //会员总价
    //             total_vip_distinct_account: res.data.object.total_vip_distinct_amount, // 会员折后价总计
    //             vip_preferential_amount: res.data.object.vip_preferential_amount,
    //             member_level: res.data.object.member_level, //会员等级 actual_total
    //             orderPayment,
    //             paymethod: 0,
    //           })
    //           isAdvanceDeposit = 1
    //         }else{//超值会员
    //           orderPayment.actual_total = res.data.data.actual_total
    //           this.setData({
    //             orderPayment,
    //             vipCheck: true,
    //             vipCheck2: true,
    //             member_level: "超值预存会员",
    //             calueStored:res.data.data,
    //             calueStoredSelected: true,
    //             paymethod: 9
    //           })
    //           isAdvanceDeposit = 0
    //         }
    //         wx.request({
    //           url:app.globalData.updateIsAdvanceDeposit,
    //           data:{
    //             orderId:this.data.orderid,
    //             isAdvanceDeposit: isAdvanceDeposit
    //           },
    //           success: res =>{
    //           }
    //         })
    //         // this.printAllConfirm();
    //         // app.globalData.RMQmsg_id = app.spawnUUID()

    //         this.toPayment();
    //       } else {
    //         this.toPayment();
    //       }
    //     }
    //   })
    // }else{
    //   this.toPayment();
    // }
    rmq.sendRabbitMQMsg({
        msg_id: 'SSZGSSZGSSZGSSZGSSZGSSZGSSZ' + app.globalData.caustomerId,
        from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
        msg: {
            type: 'jump',
            text: '客人申请买单',
            orderId: that.data.orderid
        },
        table_name: app.globalData.locationname,
        table_id: app.globalData.locationid,
        tg: "bz",
        shop_id: app.globalData.shopid,
        back: res => {
            console.log(res)
        }
    })
}

//新人关注代金券
export const toUseNewCouponCheck = function () {
  let that = this
  let a = this.data.thisorderarry
  let couponList = []
  if (that.data.vouchersInfo) {
      let vouchersInfo = that.data.vouchersInfo
      for (let x of vouchersInfo) {
          if (x.color && x.color == '#00dd00') {
              let detail = {
                  management_coupons_uid: x.management_coupons_uuid,
                  shop_id: x.shop_id,
              }
              couponList.push(detail)
          }
      }
  }

  let chooseDiscount = that.data.chooseSaleList[that.data.chooseDiscountIndex]

  wx.request({
      // url: 'http://localhost:8088/evaluation/addOrderApply',
      url: app.globalData.addNewCouponOrderApply,
      method: "POST",
      data: {
          shopMultipleDiscountUid: chooseDiscount.uid,
          orderId: a.order_id,
          shopId: a.shop_id,
          payMethod: that.data.paymethod,
          isUsePrestoreAmount: that.data.PDSelected ? 1 : 0,
          couponList: couponList,
          chooseDiscountList: chooseDiscount.detailList,
      },
      success: res => {
          if (res.data.code == 1) {

              wx.hideLoading({
                  success: (res) => {
                      RMQV3.sendRabbitMQMsg({
                          msg_id: 'SSZGSSZGSSZGSSZGSSZGSSZGSSZ' + app.globalData.caustomerId,
                          from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
                          msg: {
                              type: 'refresh',
                              text: '刷新'
                          },
                          table_name: app.globalData.locationname,
                          table_id: app.globalData.locationid,
                          tg: "bz",
                          shop_id: app.globalData.shopid,
                          back: res => {
                              console.log(res);
                          }
                      })
                  },
              })
              console.log(res);
          }
      }
  })
  

  rmq.sendRabbitMQMsg({
      msg_id: 'SSZGSSZGSSZGSSZGSSZGSSZGSSZ' + app.globalData.caustomerId,
      from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
      msg: {
          type: 'jump',
          text: '客人选择新人关注代金券',
          orderId: that.data.orderid
      },
      table_name: app.globalData.locationname,
      table_id: app.globalData.locationid,
      tg: "bz",
      shop_id: app.globalData.shopid,
      back: res => {
          console.log(res)
      }
  })
}

export const closeTickerQRCode = function(e){
    this.setData({
        writeOffHidden: false
    })
}
export const showTicketQRCode = function(e){
    var that = this;
    console.log(e)
        this.setData({
            writeOffSelected: true,
            writeOffHidden:true
        })
        let ticketWriteOffList = []
        for (let i = 0; i < this.data.testPackage.length; i++) {
            const element = this.data.testPackage[i];
            //超值菜品貌似有问题
            wx.request({
                url: app.globalData.selectTicketOrderDetailByDetailId,
                data: {
                    detailId: element.dishes_id
                },
                success: res=>{
                    element.ticketOrderinfo = res.data.params
                    this.setData({
                        hexiaoShop: app.globalData.shopdetail.shop_name
                    })
                    var path = "pages/index/index?id=" + element.ticketOrderinfo.uuid + '&order_id=' + element.ticketOrderinfo.order_id + '&shop_id=' + app.globalData.shopid + '&packageIndex=2'
                    console.log(path)
                    wx.request({
                        url: app.globalData.GetTicketCode_url,
                        data: {
                            path: path
                        },
                        header: {
                        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                        },
                        method: 'POST',
                        success: res => {
                            var url = res.data.object
                            console.log(url)
                            ticketWriteOffList.push({
                                name: element.dishes_name ? element.dishes_name : element.name,
                                orderTotal: element.ticketOrderinfo.set_meal_order_price/100,
                                codeImage: url
                            })
                            this.setData({
                                ticketWriteOffList: ticketWriteOffList,
                            })
                            // that.setData({
                            //     codeImage: url,
                            //     actionSheetHidden1: !that.data.actionSheetHidden1,
                            //     hexiaoShop: item.shopName,
                            //     hexiaoName: item.orderName,
                            //     hexiaoTime: item.createDate,
                            //     hexiaoNum: item.detailedCount,
                            //     hexiaoType: item.ticketDetails[0].ticketInfo.dishesUnit,
                            //     hexiaoMoney: item.orderTotal * 0.01,
                            //     hexiaoOldMomey: item.ticketDetails[0].ticketInfo.originalprice
                            // })
                        }
                    })
                }
            })
            
        }
    // var item = e.currentTarget.dataset.orderinf
    // var index = e.currentTarget.dataset.index
    // var path = "pages/index/index?id=" + item.ticketDetails[0].orderDetail.id + '&order_id=' + item.ticketDetails[0].orderDetail.orderId + '&shop_id=' + item.shopId
    // if (that.data.ordersList[index].ministerTakesOrdersRecord != null) {
    //   console.log(path)
    //   wx.request({
    //     url: app.globalData.GetTicketCode_url,
    //     data: {
    //       path: path
    //     },
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    //     },
    //     method: 'POST',
    //     success: function (res) {
    //       var url = res.data.object
    //       console.log(url)
    //       console.log(res)
    //       that.setData({
    //         codeImage: url,
    //         actionSheetHidden1: !that.data.actionSheetHidden1,
    //         hexiaoShop: item.shopName,
    //         hexiaoName: item.orderName,
    //         hexiaoTime: item.createDate,
    //         hexiaoNum: item.detailedCount,
    //         hexiaoType: item.ticketDetails[0].ticketInfo.dishesUnit,
    //         hexiaoMoney: item.orderTotal * 0.01,
    //         hexiaoOldMomey: item.ticketDetails[0].ticketInfo.originalprice
    //       })
    //     }
    //   })
    // } else {
    //   wx.showModal({
    //     title: '提示',
    //     content: '需要部长先接单才能核销'
    //   })
    // }
}
export const vouchersMethod = function (e) {
    console.log(e)
    let that = this
    this.setData({
        vouchersIndex: e.currentTarget.dataset.index
    })
}
export const toCheck = function () {
    wx.showLoading({
        title: '请求中...',
    })
    // if (!that.data.writeOffSelected && that.data.testPackage.length > 0) {
    //     wx.hideLoading({
    //         success: (res) => {},
    //     })
    //     wx.showModal({
    //       content: '套餐还未核销\n请先勾选[已购核销]',
    //       showCancel: false,
    //     })
    //     return;
    // }
    if(this.data.cartList.length > this.data.testPackage.length){
      if (this.data.paymethod == 0) {
        wx.hideLoading({
            success: (res) => {},
        })
        wx.showToast({
            title: '请选择支付方式',
            icon: "error"
        })
        return;
      } else {
        if (this.data.paymethod == 6) {
            if (that.data.newYuCunInfo.prepaidDeposit < that.data.thisorderarry.total_amount) {
                wx.hideLoading({
                    success: (res) => {},
                })
                wx.showToast({
                    title: '预存余额不足抵扣\n请选择支付方式',
                    icon: 'none'
                })
                return;
            }
        }
      }
    }
    

    if (that.data.eat) {
        wx.hideLoading({
            success: (r) => {
                that.setData({
                    eat: false
                })
                that.toVipCheck()
            }
        })
        return
    }
    if (that.data.guidelink) {
        wx.hideLoading({
            success: (r) => {
                that.setData({
                    guidelink: false
                })
                that.toVipCheck()
            }
        })
        return
    }

    if (!app.globalData.unionID) {
        setTimeout(res => {
            that.toCheck()
        }, 500)
    }
    that.toVipCheck()
    // wx.request({
    //   url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList',
    //   data: {unionId: app.globalData.unionID},
    //   success(res){
    //     if (res.data.result == "success") {
    //       wx.request({
    //         url: app.globalData.selectCustomerInfByOpenId_url,
    //         data: {openid: app.globalData.openid},
    //         method: 'POST',
    //         success(res2){
    //           wx.hideLoading({
    //             success: (r) => {
    //               app.globalData.isFocus = false
    //               if(res.data.list != null){
    //                 app.globalData.focusId = res.data.list.focusId
    //                 app.globalData.isFocus = res.data.list.isFocus == '1'
    //               }
    //               if (res2.data) app.globalData.signIn = res2.data.signIn == '1'
    //               if (app.globalData.isFocus == '1' && app.globalData.signIn == '1') {
    //                 //继续买单逻辑
    //                 that.toVipCheck()
    //               }else if (app.globalData.isFocus != '1'){
    //                 wx.showModal({
    //                   content:'您尚未关注"切瓜切菜"公众号\n关注公众号即可获取平台的5个星盾奖励和商家的买单打折优惠',
    //                   cancelText: '直接买单',
    //                   confirmText: '前往关注',
    //                   success(res){
    //                     if (res.confirm) {
    //                       if (app.globalData.signIn != '1'){
    //                         //前往注册逻辑
    //                         wx.request({
    //                           url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addLink',
    //                           data:{
    //                             unionId: app.globalData.unionID,
    //                             title: "点击这里前往小程序",
    //                             link: "/pages/module_others/pages/register/register?orderid="+that.data.orderid+"&shop_id="+app.globalData.shopid+"&guidelink=true"
    //                           },
    //                           method: 'GET',
    //                           success (res){
    //                             wx.navigateTo({
    //                               url: '/pages/module_others/pages/wxPublic/out',
    //                             })
    //                           }
    //                         })
    //                       }else{
    //                         wx.request({
    //                           url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addLink',
    //                           data:{
    //                             unionId: app.globalData.unionID,
    //                             title: "点击这里继续买单",
    //                             link: "/pages/ordersdetail/ordersdetail?orderid="+that.data.orderid+"&shop_id="+app.globalData.shopid+"&guidelink=true"
    //                           },
    //                           method: 'GET',
    //                           success (res){
    //                             //插入店铺临时表
    //                             wx.request({
    //                               url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addOrUpdateShopMiddleTemporary',
    //                               data: {
    //                                 shopId: app.globalData.shopid,
    //                                 unionId: app.globalData.unionID,
    //                               },
    //                               method: "POST",
    //                               success: res => {
    //                                 wx.navigateTo({
    //                                   url: '/pages/module_others/pages/wxPublic/out',
    //                                 })
    //                               }
    //                             })
    //                           }
    //                         })
    //                       }
    //                       //前往注册逻辑
    //                     }else{
    //                       //继续买单逻辑
    //                       that.toVipCheck()
    //                     }
    //                   }
    //                 })
    //               }else{
    //                 console.log(app.globalData)
    //                 wx.showModal({
    //                   content:'您尚未注册"切瓜切菜"平台账户\n注册平台即可获取平台的5个星盾奖励和商家的买单打折优惠',
    //                   cancelText: '直接买单',
    //                   confirmText: '前往注册',
    //                   success(res){
    //                     if (res.confirm) {
    //                       that.setData({eat: true})
    //                       wx.navigateTo({
    //                         url: '/pages/module_others/pages/register/register?openId=' + app.globalData.openid + '&unionId=' + app.globalData.unionID + '&eat=true',
    //                       })
    //                     }else{
    //                       //继续买单逻辑
    //                       that.toVipCheck()
    //                     }
    //                   }
    //                 })
    //               }
    //             },
    //           })
    //         }
    //       })
    //     }
    //   }
    // })
}

export const toUseOffer = function () {
    wx.showModal({
        title: "温馨提示", // 提示的标题
        content: "是否确认优惠事项", // 提示的内容
        showCancel: true, // 是否显示取消按钮，默认true
        cancelText: "取消", // 取消按钮的文字，最多4个字符
        cancelColor: "#000000", // 取消按钮的文字颜色，必须是16进制格式的颜色字符串
        confirmText: "确定", // 确认按钮的文字，最多4个字符
        confirmColor: "#576B95", // 确认按钮的文字颜色，必须是 16 进制格式的颜色字符串
        success: (res) => {
            console.log("接口调用成功的回调函数");
            if (res.confirm) {
                console.log('用户点击确定')
                this.useOffer();
            } else if (res.cancel) {
                console.log('用户点击取消')
            }
        }
    })
}

export const toPD = function (e) {
    if ((!this.data.vipPhone && !this.data.vipCard) || this.data.thisorderarry.phone_num) {
        wx.showModal({
            title: '提示',
            content: '请输入卡号或手机号',
            showCancel: false, //是否显示取消按钮
            confirmText: "确定", //默认是“确定”
        })
    } else {
        wx.request({
            // url: 'http://localhost:8080/WX Restaurant/SelectPrepaidDeposit',
            url: app.globalData.SelectPrepaidDeposit,
            data: {
                phone: this.data.vipPhone ? this.data.vipPhone : this.data.thisorderarry.phone_num,
                card: this.data.vipCard,
                shopId: app.globalData.shopid
            },
            method: 'GET',
            success: (res) => {
                if (res.data == null) {
                    wx.showModal({
                        title: '提示',
                        content: '未查询到该账号的预存信息',
                        showCancel: false, //是否显示取消按钮
                        confirmText: "确定", //默认是“确定”
                    })
                } else if (res.data >= this.data.orderPayment.actual_total) {
                    this.setData({
                        nPD: res.data,
                        paymethod: e.currentTarget.dataset.index,
                    })
                    wx.request({
                        url: app.globalData.UpdateOrderInf_url,
                        data: {
                            Shop_id: app.globalData.shopid,
                            Order_id: this.data.orderid,
                            paymethod: parseInt(e.currentTarget.dataset.index)
                        },
                        success: function (res) {}
                    })
                } else {
                    this.setData({
                        PD: res.data,
                        paymethod: e.currentTarget.dataset.index,
                    })
                    wx.request({
                        url: app.globalData.UpdateOrderInf_url,
                        data: {
                            Shop_id: app.globalData.shopid,
                            Order_id: this.data.orderid,
                            paymethod: parseInt(e.currentTarget.dataset.index)
                        },
                        success: function (res) {}
                    })
                    this.setData({
                        paymethod: e.currentTarget.dataset.index,
                    })
                    if (that.data.calueStored) {
                        that.setData({
                            waitPay: true
                        })
                    }
                }
            }
        })
    }

}
export const zhenLiCartList = function (dishes) {
    that = this
    var weight_arry = [] // 称重菜品列表
    var eatAndSpec_arry = [] //多规格多做法菜品列表
    var temporary = [] //临时菜品列表
    var number = 0
    //单规格+配菜-7，来料加工-8，多拼粥品-9
    var side_arry = [] //单规格+配菜
    var processing_arry = [] //来料加工
    var porridge_arry = [] //多拼粥品
    var single = [] //单规格
    var set_meal_array=[];//210 211 220 超值套餐
    var many = [] //多配多规格
    var testPackage = []
    var tbc_count1 = 0
    // 这个是待确认数，无论是可确认菜品的数量还是订单中部长确认的操作数量
    // 包括全单部长确认操作、客人数量确认、全单打折
    let mealandcouponmoney = 0
    var vaildTotal = 0
    for (var i = 0; i < dishes.length; i++) {
        console.log(dishes[i].reminderNum, '催单次数');
        var minReminderNum = dishes[i].reminderNum
        if (dishes[i].reminderNum < minReminderNum) {
            minReminderNum = dishes[i].reminderNum;
        }
    }
    that.setData({
        minReminderNum: minReminderNum
    })
    wx.request({
        //  url: 'http://localhost:8080/WX Restaurant/GetOneOrderInfo',
        url: app.globalData.GetOneOrderInfo,
        data: {
            order_id: that.data.orderid,
            shop_id: that.data.shop_id
        },
        success: resp => {
            that.setData({
                vaildTotal: Number(resp.data).toFixed(2)

            })

        }
    })

    for (var i = 0; i < dishes.length; i++) {
        if (dishes[i].dishes_status != 20) {
            // 统计数量总数
            var num = 0
            if (that.data.listData_temp != '') {
                var temp123 = JSON.stringify(that.data.listData_temp)
                var listData = JSON.parse(temp123)
                //2020-12-04 通用方法
                listData = that.pageageCheckListData(listData, dishes[i]);

                dishes[i].listData = listData
            }
            // 同意修改之后item_number会改，所以以item_number为准
            if (dishes[i].item_type != 1) { //在菜品未取消的情况下
                if (dishes[i].spec_type == 3 || dishes[i].spec_type == 5 || dishes[i].spec_type == 6) { // 当为称重多做法，计件多做法,称重单规格的情况下，视为1
                    num = 1
                } else if (dishes[i].spec_type == 4) { // 单规格多做法 
                    num = parseInt(dishes[i].item_number.split(',')[0])
                } else if (dishes[i].spec_type == 10) {
                    num = parseInt(dishes[i].measurement_value)
                } else if (dishes[i].spec_type == 2 || dishes[i].spec_type == 8) {
                    num = 1;
                    if (dishes[i].lstOrderEmBlockEating != null && dishes[i].lstOrderEmBlockEating.length != 0) {
                        num = Number(dishes[i].lstOrderEmBlockEating.length)
                    }
                } else {
                    num = parseInt(dishes[i].item_number)
                }
            } else {
                //已取消状态 ，统计数量。cancel_number是取消的份数
                num = parseInt(dishes[i].initial_number) - parseInt(dishes[i].cancel_number)

            }

            if (dishes[i].measurement_value == 0) { //下策，因为业务要求不显示 0 的重量
                dishes[i].measurement_value = ''
            }
            if (dishes[i].copyOrder > 1) {
                number = number + Number(num * Number(dishes[i].copyOrder))
            } else {
                number = number + Number(num)
            }
            //订单状态：0-正常 1-申请取消 2-已取消 3申请修改 4-已修改
            //菜品未确认数 item.xiugaidengji == 0 || (item.xiugaidengji == 2 && level ==1
            if ((dishes[i].dishes_status == 0 || dishes[i].dishes_status == 5) && (that.data.level >= dishes[i].querendengji)) {
                tbc_count1 = Number(tbc_count1) + 1;
            }
            // 0 - 正常类别、1 - 茶位米饭、2 - 酒水、3 - 其他用品、 4 - 早市、 5 - 饭市、 6 - 临时菜品
            // spec_type 规格类型：单规格-0，多规格-1，称重多做法-2，计件多做法-3,称重单规格-5，单规格多做法-4，称重多规格-6

            if (dishes[i].spec_type == 2 || dishes[i].spec_type == 6) { // 称重菜品
                weight_arry.push(dishes[i])
            } else if (dishes[i].specal_type == 6) { // 临时
                temporary.push(dishes[i])
            } else if (dishes[i].spec_type == 7) { // 单规格+配菜
                side_arry.push(dishes[i]) // 
            } else if (dishes[i].spec_type == 8) { //来料加工
                if (dishes[i].weighingByLocation == 1) {
                    let arr = [];
                    dishes[i].lstOrderEmBlockEating.forEach((item, index) => {
                        let arr1 = JSON.parse(JSON.stringify(dishes[i]))
                        arr1.lstOrderEmBlockEating = []
                        arr[index] = []
                        arr1.lstOrderEmBlockEating.push(item)
                        arr[index] = arr1
                        processing_arry.push(arr[index]) // 
                    })
                } else {
                    processing_arry.push(dishes[i])
                }
            } else if (dishes[i].spec_type == 10) { // 多规格多做法
                eatAndSpec_arry.push(dishes[i])
            } /*-- 2020-11-16 多拼粥--*/
            else if (dishes[i].spec_type == 9 || dishes[i].spec_type == 91) { //多拼粥品
                porridge_arry.push(dishes[i]) //
            } else if (dishes[i].spec_type == 0 || dishes[i].spec_type == 21 || dishes[i].spec_type == 23 || dishes[i].spec_type == 25 || dishes[i].spec_type == 22 || dishes[i].spec_type == 24 || dishes[i].spec_type == 26 || dishes[i].spec_type == 27) { // 单规格
                single.push(dishes[i])
            }else if(dishes[i].spec_type==210||dishes[i].spec_type==211||dishes[i].spec_type==220){
                set_meal_array.push(dishes[i]);
            } 
            else if (dishes[i].spec_type == 1) { // 多规格 || dishes[i].spec_type == 22 || dishes[i].spec_type == 24
                many.push(dishes[i])
            } else if (dishes[i].spec_type == 100 || dishes[i].spec_type == 101) {
                // wx.request({
                //   url: app.globalData.selectTicketOrdersByOrderId_url,
                //   data:{
                //     orderId: dishes[i].dishes_id
                //   },
                //   method: 'GET',
                //   success: res => {
                //     dishes[i].ticketOrderinfo = res.data.ticketOrderinfo
                //     testPackage.push(dishes[i])
                //   }
                // })
                testPackage.push(dishes[i])
                // let a = dishes[i]
                // wx.request({
                //     url: app.globalData.SelectTicketOrderDetailedWithSetMeal,
                //     // url:'http://192.168.8.163:8083/evaluation_war/SelectTicketOrderDetailedWithSetMeal',
                //     // url:'http://192.168.8.7:8081/evaluation/SelectTicketOrderDetailedWithSetMeal',
                //     data: {
                //         shop_id: app.globalData.shopdetail.shop_id,
                //         user_id: app.globalData.user_id,
                //         typeForSetMeal: 0
                //     },
                //     method: 'POST',
                //     header: {
                //         'content-type': 'application/json' // 默认值
                //     },
                //     success: res => {
                //         let data = res.data.data
                //         data.forEach(r=>{
                //             if (r.ticket_order_detailed_id == a.dishes_id) {
                //                 wx.request({
                //                     url: app.globalData.selectTicketOrdersByOrderId_url,
                //                     data:{
                //                         orderId: r.orderId
                //                     },
                //                     method: 'GET',
                //                     success: res => {
                //                         wx.request({
                //                             url: app.globalData.taocan.select_constitute_url,
                //                             method: 'POST',
                //                             data: {
                //                                 setMealID: res.data.ticketOrderinfo.ticketDetails[0].ticketInfo.setmealid,
                //                             },
                //                             header: {
                //                                 'content-type': 'application/json'
                //                             },
                //                             success: res2=>{
                //                                 // console.log(cartList[i])
                //                                 a.ticketOrderinfo = res.data.ticketOrderinfo
                //                                 a.lstSetMealConstitute = res2.data.setmealConstituteUsers
                //                                 let dishes_introduce = ""
                //                                 for (let d = 0; d < a.lstSetMealConstitute.length; d++) {
                //                                     dishes_introduce += "套餐组成：\n\n" + Number(d + 1) + "." + a.lstSetMealConstitute[d].constituteName + "                       " + a.lstSetMealConstitute[d].constituteNum + a.lstSetMealConstitute[d].constituteUnit + "\n\n"
                //                                 }
                //                                 a.dishes_introduce = dishes_introduce
                //                                 // cartList[i] = a
                //                                 let c = that.data.dishes
                //                                 for (let b = 0; b < c.length; b++) {
                //                                     const element = c[b];
                //                                     if(element.dishes_id == a.dishes_id){
                //                                         element = a
                //                                         mealandcouponmoney = mealandcouponmoney + a.ticketOrderinfo.orderTotal / 100
                //                                     }
                //                                 }
                //                                 testPackage.push(a)
                //                                 that.setData({
                //                                     dishes: c,
                //                                     testPackage: testPackage,
                //                                     mealandcouponmoney: mealandcouponmoney
                //                                 })
                
                //                             }
                //                         })
                //                     }
                //                 })
                //             }
                //         })
                //     }
                // })
            }

        }
        if (that.data.preorder_starus != 1) {
            tbc_count1 + 1
        }
        if (that.data.isDiscountInf == '' || that.data.isDiscountInf == null) {
            tbc_count1 + 1
        }
        // var tmp = that.data.tbc_count.split(",")
        // 修改订单信息
        if (i == dishes.length - 1) {
            wx.request({
                url: app.globalData.UpdateOrderInf_url,
                data: {
                    Order_id: that.data.orderid,
                    Shop_id: that.data.shop_id,
                    dishes_count: number
                },
                success: function (res) {},
                complete: function (res) {
                    that.setData({
                        submit: true,
                        tbc_count1: tbc_count1
                    })
                }
            })
            that.setData({
                dishes: dishes,
                weight_arry: weight_arry,
                eatAndSpec_arry: eatAndSpec_arry,
                single: single,
                set_meal_array:set_meal_array,
                many: many,
                testPackage: testPackage,
                number: number,
                side_arry: side_arry,
                processing_arry: processing_arry,
                porridge_arry: porridge_arry,
                temporary: temporary,
                hasOrderDetailed: true,
                // testPackage: testPackage
            })
        }
    }

}

  // 查看食物详情
export const  showDishesDetail = function (e) {
var that = this
// that.timed_refresh(1)
var dishesitem = e.currentTarget.dataset.dishesitem
if(dishesitem.spec_type == 100 || dishesitem.spec_type == 101){
    wx.showLoading({
      title: '请稍后',
    })
    wx.request({
        url: app.globalData.selectTicketOrderDetailByDetailId,
        data: {
            detailId: dishesitem.dishes_id
        },
        success: res=>{
            if(res.data.code == 1){
                let result = res.data.params
                wx.navigateTo({
                    url: '../module_discount/pages/Package_details/Package_details?id=0&setMealID=' + result.ticket_id + '&shop_id=' + app.globalData.shopdetail.shop_id + '&fromMenu=true&orderId=' + result.order_id,
                },()=>{
                    wx.hideLoading()
                })
            }else{
                wx.showModal({
                  title: '提示',
                  content: '网络异常',
                  showCancel: false
                },()=>{
                    wx.hideLoading()
                })
            }
        },
        complete: res=>{
            wx.hideLoading()
        }
    })
    return  
}
if (!that.data.showDishesDetail) {
    
    var dishes = that.getDishesInf(dishesitem.dishes_id)
    that.formatTaste(dishesitem.tastes) // 回显口味
    that.setData({
    dishes: dishes
    })
    if (dishes.sideDishes != 0) {
    var SideDishList = []
    var SideDishList_choose = []
    if (dishesitem.sideDisht) {
        SideDishList = JSON.parse(dishesitem.sideDisht)
        for (var x of SideDishList) {
        if (x.orderDetailedNum > 0) {
            SideDishList_choose.push(x)
        }
        }
    }
    that.setData({
        hasSideDish: true,
        shrinkIntrIntroduction: true,
        SideDishList: SideDishList,
        SideDishList_choose: SideDishList_choose,
    })
    } else {
    that.setData({
        hasSideDish: false,
        shrinkIntrIntroduction: false,
        SideDishList: [],
        SideDishList_choose: [],
    })
    }
    if (dishes.spec_type == 9 || dishes.spec_type == 91) {
    // 多拼粥
    var jointSet = dishesitem.jointSet
    var jointSets = jointSet.split(',')
    var selName = []
    var sum = 0
    var foodNum = []
    for (var i = 0; i < jointSets.length; i++) {
        foodNum[i] = jointSets[i].split('-')
        jointSets[i] = parseInt(jointSets[i].split('-')[0])
    }
    var shopData = {
        shop_id: app.globalData.shopdetail.shop_id,
        // jointSetValuation: dishes.jointSetValuation
        dishes_id:dishesitem.dishes_id
    }
    wx.request({
        url: app.globalData.SelectJointSet,
        method:'GET',
        data:shopData,
        success:res=>{
        if (res.data.result.result == 1) {
        res.data.object.currentNum = res.data.object.jointSetNum
        res.data.object.list = res.data.object.list.map(item => ({
            ...item,
            checked: false,
            selectStatus: jointSets.indexOf(item.ID) != -1,
            jointSetDealPrice: ((item.jointSetPrice) / 100).toFixed(2),
        }))
        for (var x of res.data.object.list) {
            if (x.selectStatus) {
            selName.push(x.jointSetName)
            }
        }
        selName = selName.join('+');
        dishesitem.item_subtotal * dishesitem.copyOrder
        // 初始化dishes的数值（选中、单价份数、数量、总金额）
        sum = Number(dishesitem.item_subtotal * dishesitem.copyOrder)
        res.data.object.selName = selName
        res.data.object.selAllPrice = sum
        var goodModel = {
            dishes_img: dishes.dishes_img,
            poridgeName: dishesitem.dishes_name,
            dishes_name: dishesitem.dishes_name,
            selName: selName,
            dishes_price: dishesitem.item_price,
            poridgeNum: dishesitem.item_number,
            poridgeAllPrice: sum,
            vip_price:dishesitem.vip_price,
            inline_price:dishesitem.inline_price,
            spec_type:dishesitem.spec_type,
        }
        this.getFoodNum(res,foodNum)
        this.formatMaterial(res.data.object.list)
        this.setData({
            porridgeObject: res.data.object,
            show: true,
            currentDishesModel: dishes,
            goodModel: goodModel,
            goodsIntroduce: dishes.dishes_introduce ? dishes.dishes_introduce : "",
            foodIntroduce: dishes.dishes_introduce ? dishes.dishes_introduce : "",
            dishes_remark: dishesitem.remarks ? dishesitem.remarks : "",
        })
        } else {
        wx.showToast({
            title: '获取详情失败',
            icon: 'none', //如果要纯文本，不要icon，将值设为'none'
            duration: 2000
        })
        }
        }
    })
    
    // 初始化dishes的数值（选中、单价份数、数量、总金额）
    this.setData({
        currentItemType: dishesitem.item_type,
        porridgeBackObject: dishesitem.porridgeObject,
        porridgeObject: dishesitem.porridgeObject,
        //showDishesDetail :true,
        show: true,
    })
    // return;
    } else {
    dishesitem.dishes_introduce = dishes.dishes_introduce ? dishes.dishes_introduce : dishesitem.dishes_introduce? dishesitem.dishes_introduce : ''
    dishesitem.praise_points = dishes.praise_points
    dishesitem.monthly_sales_volume = dishes.monthly_sales_volume
    let remarkStr = remarkJS.splitRemarkStr(dishesitem.remarks, 1);
    let quickRemarkStr = remarkJS.splitRemarkStr(dishesitem.remarks, 0);
    that.setData({
        dishes_remark: remarkStr,
        quickRemark: quickRemarkStr,
        goodsIntroduce: dishes.dishes_introduce,
        dishesDetail: dishesitem,
        showDishesDetail: true
    })
    }
} else { // 关闭的时候，可能会记录菜品备注
    if (that.data.thisorderarry.help_order == 2 && (that.data.dishes_remark != '' || that.data.tastes != '')) { //只有直接下单的时候才会备注
    //修改订单详情，跟其他菜品一样，不同的是，连菜品名称都可以修改
    var dishesDetail = that.data.dishesDetail
    if (dishesDetail.remarks != that.data.dishes_remark) {
        WXAPI.updateOrderDetailedForAll({
        id: dishesDetail.id,
        Order_id: dishesDetail.order_id,
        Shop_id: that.data.shop_id,
        remarks: that.data.dishes_remark
        }).then(function (data) {
        if (data.result.result == 1) {
            //备注成功
            that.setData({
            dishes_remark: '',
            })
            that.redress()
        } else {
            wx.showToast({
            title: '备注失败',
            icon: 'none', //如果要纯文本，不要icon，将值设为'none'
            duration: 2000
            })
        }
        }).catch(function (e) {
        //备注失败
        wx.showToast({
            title: '备注失败',
            icon: 'none', //如果要纯文本，不要icon，将值设为'none'
            duration: 2000
        })
        })
    } else {
        that.setData({
        dishes_remark: ""
        })
    }
    if (dishesDetail.tastes != that.data.tastes) {
        WXAPI.updateOrderDetailedForAll({
        id: dishesDetail.id,
        Order_id: dishesDetail.order_id,
        Shop_id: that.data.shop_id,
        tastes: that.data.tastes
        }).then(function (data) {
        if (data.result.result == 1) {
            //备注口味成功
            that.redress()
            that.setData({
            tastes: '',
            tastesRemark: '',
            })
        } else {
            wx.showToast({
            title: '备注口味失败',
            icon: 'none', //如果要纯文本，不要icon，将值设为'none'
            duration: 2000
            })
        }
        }).catch(function (e) {
        //备注失败
        wx.showToast({
            title: '备注失败',
            icon: 'none', //如果要纯文本，不要icon，将值设为'none'
            duration: 2000
        })
        })
    } else {
        that.setData({
        tastes: "",
        tastesRamark: "",
        })
    }
    }
    that.setData({
    dishes: [],
    dishesDetail: [],
    goodsIntroduce: "",
    showDishesDetail: false
    })
}
}


export const getFoodNum = function (res, foodNum) {
    b: for (let i = 0; i < res.data.object.list.length; i++) {
        let a = res.data.object.list[i].ID
        a: for (let j = 0; j < foodNum.length; j++) {
            if (a == foodNum[j][0]) {
                res.data.object.list[i].foodNum = foodNum[j][1]
                res.data.object.list[i].totalPrice = Number(foodNum[j][1]) * Number(res.data.object.list[i].jointSetDealPrice)
                continue b
            }
        }
    }
}
//来料加工打开详情
export const processOpenDetail = function (item) {
    that = this
    var detailItem = item.currentTarget.dataset.item
    var index = item.currentTarget.dataset.index
    var weight_image_arry = []
    var hasSideDish = false
    var SideDishList = []
    var SideDishList_choose = []
    var eatMethodArray = []
    var tastesRemark = ""
    var isWhole = true;
    var remarkStr = that.data.detailItem.remarks;
    var quickRemark = '';
    var dishes = that.getDishesInf(detailItem.dishes_id)
    // that.getEatMethod(detailItem.dishes_id) //获取吃法
    tastesRemark = that.tastesRemark(detailItem.tastes)

    eatMethodArray = JSON.parse(JSON.stringify(detailItem.lstOrderEmBlockEating))

    if (eatMethodArray[0].em_block_name == '全部位') {
        isWhole = true
    } else {
        isWhole = false
    }
    if (detailItem.spec_type == 8 || detailItem.spec_type == 2) { //来料加工的数组少了单价和数量，这里加上
        if (eatMethodArray[0].em_block_name == '全部位') {} else {
            for (var x = 0; x < eatMethodArray[0].length; x++) {
                if (eatMethodArray[x].lstOrderSideDish.length != 0) {
                    hasSideDish = true;
                }
            }
        }
    }
    that.setData({
        index2: index,
        dishes: dishes,
        isWhole: isWhole,
        weight_image: weight_image_arry,
        detailItem: item.currentTarget.dataset.item,
        specialType: item.currentTarget.dataset.specialtype,
        tastesRemark: hasSideDish ? '' : tastesRemark,
        eatMethodArray: eatMethodArray,
    })
    if (dishes.sideDishes != 0 && eatMethodArray[0].lstOrderSideDish.length) {
        SideDishList_choose = eatMethodArray[0].lstOrderSideDish
        // for (var i = 0; i < SideDishList.length; i++) {
        //   if (Number(SideDishList[i].orderDetailedNum) > 0) {
        //     SideDishList[i].orderDetailedSum = SideDishList[i].sideDishdPrice * SideDishList[i].orderDetailedNum * 0.01
        //     SideDishList[i].checked = true
        //     SideDishList_choose.push(SideDishList[i])
        //   } else {
        //     SideDishList[i].orderDetailedSum = 0
        //     SideDishList[i].checked = false
        //   }
        // }
        hasSideDish = true
    } else if (dishes.sideDishes != 0 && hasSideDish == true) {
        SideDishList = detailItem.em_id;
    } else {
        hasSideDish = false
    }
    if (eatMethodArray.length != 0) {
        that.formatTaste(eatMethodArray[0].tastes);
        // that.formatSideDishList(eatMethodArray[0].SideDishList, dishes.sideDishes);
        remarkStr = remarkJS.splitRemarkStr(eatMethodArray[0].remarks, 1);
        quickRemark = remarkJS.splitRemarkStr(eatMethodArray[0].remarks, 0);
    } else {
        remarkStr = remarkJS.splitRemarkStr(remarkStr, 1);
        quickRemark = remarkJS.splitRemarkStr(remarkStr, 0);
    }
    let ingredientsAmount = Number(detailItem.measurement_value) * Number(detailItem.item_price);
    if (detailItem.em_id != null && detailItem.em_id.length != 0) {
        for (let i = 0; i < detailItem.em_id.length; i++) {
            ingredientsAmount += detailItem.em_id[i].no_sideDish_money;
        }
    }
    that.setData({
        SideDishList_choose: SideDishList_choose,
        eatMethodChooseIndex: hasSideDish ? 0 : -1,
        SideDishList: SideDishList,
        hasSideDish: hasSideDish,
        shrinkIntrIntroduction: hasSideDish,
        showProcessingDetail: !that.data.showProcessingDetail,
        "detailItem.remarks": remarkStr,
        "detailItem.quickRemark": quickRemark,
        "detailItem.ingredientsAmount": ingredientsAmount,
    })
    if (detailItem.dishes_status == 10 || detailItem.dishes_status == 11 || detailItem.dishes_status == 12) {
        that.setData({
            isModifiedDetail: true
        })
    }
}

export const toCancelOrderDetails = function (foodItem, numb) {
    let num = numb;
    let id = foodItem.id;
    if (foodItem.spec_type == 2 || foodItem.spec_type == 8) {
        num = foodItem.item_number
    }
    console.log(num, id)

    wx.request({
        url: app.globalData.CancelOrderDetailsNew,
        data: {
            id: id,
            item_number: num
        },
        method: 'POST',
        header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        success: res => {
            console.log(res)
            if (res.data.result.result == 1) {
                this.cancelNew(foodItem);
            }
            this.setData({
                showCancel: false
            })
        }
    })
  
}

export const closePrintAllConfirm = function () {
    this.setData({
        showAllConfirmPrintView: false
    })
}

export const printAllConfirmNew = function () {
    let that = this
    let order_choose_printer = ''
    var e = that.data.allConfirmInf //拿回存着的数据
    if (that.data.printArray.length > 0) {
        if (that.data.printIndex > -1)
            order_choose_printer = that.data.printArray[that.data.printIndex].printer_id
    }
    wx.request({
        url: app.globalData.printTotalOrder,
        data: {
            Order_id: that.data.orderid,
            total_order_print: 0,
            choose_checkout_printer: order_choose_printer

        },
        success: res => {
            if (res.data.result.result == 1) {
                that.recordConfirmationInf(0, "等待买单", null)
                that.discount_checked_minister();
                if (that.data.thisorderarry.help_order != 2) { // 主动下单不需要确认人数
                    that.sureUserCount(e) //确认用餐人数
                }
                that.useOffer(e) //优惠信息部长确认确认
                wx.showToast({
                    title: '打印成功!',
                    icon: 'success',
                    duration: 2000
                })
                this.setData({
                    showCashRegister: true,
                    showPrint: false
                })
            } else {
                wx.showToast({
                    title: '打印结账总单失败，请重新确认!',
                    icon: 'fail',
                    duration: 2000
                })
            }
        },
        complete: function () {
            that.redress() // 刷新
            that.closePrint2() // 关闭弹窗
        }
    })
}

export const toCancel = function () {
    this.setData({
        showCancel: false
    })
}

export const toCancelConfirm = function () {

    var nm = this.data.nm //要取消的份数
    var foodItem = this.data.cancelFoodItem

    if (foodItem.spec_type == 2 || foodItem.spec_type == 8) {
        nm = foodItem.initial_number
    }
    if (nm > foodItem.initial_number) {
        wx.showToast({
            title: '取消份数不能大于原有份数',
            icon: 'none',
            duration: 2000,
        })
        return;
    }
    wx.request({        
        url: app.globalData.toCancelConfirm,
        data: {
            number: nm,
            id: foodItem.id
        },
        success: res => {

        }
    })
    this.cancelNew(foodItem)
    this.setData({
        showCancel: false
    })    
}

export const toCancelConfirmDel = function () {

    var nm = this.data.nm //要取消的份数
    var foodItem = this.data.cancelFoodItem

    if (foodItem.spec_type == 2 || foodItem.spec_type == 8) {
        nm = foodItem.initial_number
    }
    if (nm > foodItem.initial_number) {
        wx.showToast({
            title: '取消份数不能大于原有份数',
            icon: 'none',
            duration: 2000,
        })
        return;
    }

    wx.request({
        
        url: app.globalData.toCancelConfirmDel,
        data: {
            id: foodItem.id,
            orderId: foodItem.order_id,
            number: parseInt(nm),
            itemPrice: foodItem.item_price
        },
        method: 'POST',
        header: {
            'content-type': 'application/json;charset=utf-8'
        },
        success: res => {
            wx.showToast({
                title: res.data.result,
                icon: 'none',
                duration: 1500,
            })
        }
    })
    
    this.setData({
        showCancel: false
    })
    this.redress()
}
export const VIPPayPwdInput = function (e) {
    this.setData({
        VIPPayPwd: e.detail.value
    })
}

export const toPayOrder = function () {
    that = this
    let orderCode = that.data.thisorderarry.order_code
    let orderId = that.data.orderid
    let shopId = that.data.shop_id
    // let paymethod = that.data.paymethod
    let paymethod = that.data.thisorderarry.paymethod
    let thisVoupon = that.data.thisVoupon
    let otherVoupon = that.data.otherVoupon
    console.log(orderId + '收到了' + paymethod + '收到了' + orderCode)
    console.log(app.globalData)
    if (that.data.orderPayment.actual_total - (thisVoupon ? thisVoupon : 0) - (otherVoupon ? otherVoupon : 0) == 0) {
        that.payIt()
        return
    }
    if (paymethod == (6)) { //预存余额支付
        if (that.data.nPD != '' && that.data.nPD != null) {
            return;
        }
        that.setData({
            paymethod: 0
        })
    } else if (paymethod == 2) { //微信支付
        let sub_mch_id = app.globalData.shopdetail.sub_merchants_id ? app.globalData.shopdetail.sub_merchants_id : '1615440524' //孟贲账户
        let body = '请到订单详情查看'
        let out_trade_no = that.data.thisorderarry.order_code + 'MD'
        let order_id = that.data.orderid
        let shop_id = that.data.shop_id
        let total_fee = 0
        wx.request({
            url: app.globalData.getOrderPayment,
            data: {
                orderId: that.data.orderid
            },
            success(res) {
                total_fee = Number(res.data.params.excess_remaining_amount ? res.data.params.excess_remaining_amount : that.data.orderPayment.actual_total) * 100
                // let total_fee = 5 // 测试用5分钱，后期get(单位: 分)
                if (that.data.waitPay) {
                    total_fee = Number(((res.data.params.excess_remaining_amount ? res.data.params.excess_remaining_amount : that.data.orderPayment.actual_total) - (that.data.thisorderarry.used_prepaid_deposit == 0 ? that.data.PD : that.data.thisorderarry.used_prepaid_deposit) - (thisVoupon ? thisVoupon : 0) - (otherVoupon ? otherVoupon : 0)).toFixed(2)) * 100
                }
                // total_fee = total_fee.toFixed(2)
                let openid = app.globalData.openid
                let profit_sharing = '0'
                let percent_pay = 30
                let percent_total = parseInt(((total_fee - (total_fee * 0.002)) * (percent_pay / 100)))
                wx.request({
                    url: app.globalData.selectShopCustomerBindIncome_CommonPay,
                    data:{
                        order_id: that.data.thisorderarry.order_id
                    },
                    method: 'GET',
                    success: res => {
                        console.log(res)
                        if (res.data.code == 1000 && res.data.data != null) {
                            profit_sharing = res.data.data.platform_give_amount == 0 && res.data.data.shop_give_amount == 0 ? '0' : '1'
                            pay.pay({
                                sub_mch_id: sub_mch_id,
                                body: '请到订单详情查看',
                                out_trade_no: out_trade_no, //订单号
                                order_id: order_id,
                                shop_id: shop_id,
                                total_fee: parseInt(total_fee), //支付金额(单位分)
                                openid: openid,
                                profit_sharing: profit_sharing,
                                percent_pay: percent_pay,
                                percent_total: percent_total,
                                back: res2 => {
                                    if (res2.result != 'success') {
                                        console.log(res2)
                                        return
                                    }
            
                                    that.payIt()
                                    RMQV3.sendRabbitMQMsg({
                                        msg_id: 'SSZGSSZGSSZGSSZGSSZGSSZGSSZ' + app.globalData.caustomerId,
                                        from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
                                        msg: {
                                            type: 'refresh',
                                            text: '刷新'
                                        },
                                        table_name: app.globalData.locationname,
                                        table_id: app.globalData.locationid,
                                        tg: "bz",
                                        shop_id: app.globalData.shopid,
                                        back: res => {
                                            console.log(res);
                                        }
                                    })
                                    if (profit_sharing == '1') {
                                        let mo = Number(res.data.data.platform_give_amount) + Number(res.data.data.shop_give_amount)
                                        require('../../../../utils/wxpay').profitSharing({
                                            out_trade_no: res.data.data.order_code + 'MD', //20位orderCode
                                            sub_mch_id: '1615440524',
                                            openid: res.data.data.main_customer_openid, //邀请人的openid ooTqv4pmYasTnEz5Nvn5nx13Fq10
                                            description: '朋友互绑点餐提成',
                                            amount: Number(mo) * 100,
                                            back: res => {
                                                console.log(res)
                                            }
                                        })
                                    }
                                }
                            })
                        }else{
                            pay.pay({
                                sub_mch_id: sub_mch_id,
                                body: '请到订单详情查看',
                                out_trade_no: out_trade_no, //订单号
                                order_id: order_id,
                                shop_id: shop_id,
                                total_fee: parseInt(total_fee), //支付金额(单位分)
                                openid: openid,
                                profit_sharing: profit_sharing,
                                percent_pay: percent_pay,
                                percent_total: percent_total,
                                back: res => {
                                    if (res.result != 'success') {
                                        console.log(res)
                                        return
                                    }
            
                                    that.payIt()
                                    RMQV3.sendRabbitMQMsg({
                                        msg_id: 'SSZGSSZGSSZGSSZGSSZGSSZGSSZ' + app.globalData.caustomerId,
                                        from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
                                        msg: {
                                            type: 'refresh',
                                            text: '刷新'
                                        },
                                        table_name: app.globalData.locationname,
                                        table_id: app.globalData.locationid,
                                        tg: "bz",
                                        shop_id: app.globalData.shopid,
                                        back: res => {
                                            console.log(res);
                                        }
                                    })

                                    ///此处找不到分账对象，应该是测试数据 不放开 2023-04-05
                                    // pay.profitSharing({
                                    //   out_trade_no: orderCode,//20位orderCode
                                    //   sub_mch_id: sub_mch_id,
                                    //   // openid: 'ooTqv4pmYasTnEz5Nvn5nx13Fq10',
                                    //   openid: openid,
                                    //   description: '分账百分之三十',
                                    //   amount: percent_total,
                                    //   back: res => {
                                    //     if (res.result == 'fail') {
                                    //       console.log(res)
                                    //       return
                                    //     }
                                    //   }
                                    // })

                                }
                            })
                        }
                    }
                })
            }
        })

    } else if (paymethod == 4 || paymethod == 3 || paymethod == 8 || paymethod == 5 || paymethod == 9) { //银行卡，现金，其它方式
        that.payIt()
    }
}
export const payIt = function () {
    wx.request({
        // url: 'https://test.fsmbdlkj.com/evaluation/updateIsPay',
        url: app.globalData.updateIsPay_url,
        data: {
            orderId: that.data.thisorderarry.order_id,
        },
        success: res => {
            if (res.data.code == 1) {
              //memberInfo表记录首次消费时间
                wx.request({
                  url: app.globalData.updateFirstConsumeOfMemberInfo,
                  data: {
                    shopId: that.data.shop_id,
                    phone: that.data.vipPhone ? that.data.vipPhone : that.data.thisorderarry.phone_num,
                  },
                })

                rmq.sendRabbitMQMsg({
                    msg_id: 'SSZGSSZGSSZGSSZGSSZGSSZGSSZ' + app.globalData.caustomerId,
                    from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
                    msg: {
                        type: 'jump',
                        text: '客人已买单,请确认',
                        orderId: that.data.thisorderarry.order_id
                    },
                    table_name: app.globalData.locationname,
                    table_id: app.globalData.locationid,
                    tg: "bz",
                    shop_id: app.globalData.shopid,
                    back: res => {
                        console.log(res)
                        if (app.globalData.isFocus) {
                            wx.request({
                                url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/selectFans',
                                data: {
                                    unionId: app.globalData.unionID,
                                    shopId: app.globalData.shopid,
                                },
                                success: res => {
                                    console.log(res);
                                    if (res.data.publicFans == null) {
                                        wx.showModal({
                                            title: "提示",
                                            content: '是否关注' + app.globalData.shopdetail.shop_name + '信息',
                                            success: res => {
                                                if (res.confirm) {
                                                    wx.request({
                                                        url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addFans',
                                                        data: {
                                                            shopId: app.globalData.shopid,
                                                            unionid: app.globalData.unionID,
                                                            focusId: app.globalData.focusId,
                                                            focusSource: '买单关注',
                                                        },
                                                        success: res => {
                                                            console.log(res);
                                                        }
                                                    })
                                                }
                                            }
                                        })
                                    }

                                }
                            })
                        }
                    }
                })
                that.setData({
                    isWXPayIt: true,
                    waitPay: false
                })
            }
        }
    })
}
export const SelectPrinter = function (shop_id) {
    //查询当前商家打印机信息
    that = this
    wx.request({
        url: app.globalData.SelectPrinter_url,
        data: {
            shop_id: shop_id
        },
        success: function (res) {
            let printShowArray = []
            let printArray = res.data.object
            for (let i = 0; i < printArray.length; i++) {
                if (printArray[i].status == 1) {
                    let list = {
                        'name': printArray[i].name,
                        'num': that.addzero2(printArray[i].printer_num),
                        'check': false,
                        'id': printArray[i].printer_id,
                        'connect_status': printArray[i].connect_status, //判断连接还是未连接的参数，0(未连接),1(联机),2(脱机)
                        'paper_state': printArray[i].paper_state, //纸是否没了,0缺纸，1有纸
                    }
                    printShowArray.push(list)
                }
            }
            that.setData({
                printArray: printArray,
                printShowArray: printShowArray
            })
        }
    })
}
export const VIPPayLoginto = function () {
    that = this
    let json = {
        shop_id: that.data.shop_id,
        order_id: that.data.orderid,
        phone: that.data.vipPhone,
        pw: that.data.VIPPayPwd,
        // deducted_amount: that.data.calueStored ? that.data.calueStored.deduction_price : that.data.nPD ? that.data.orderPayment.actual_total : that.data.PD,
        deducted_amount: that.data.advanceDeposit > that.data.actualTotalByOrderId ? that.data.actualTotalByOrderId : that.data.advanceDeposit,
        used_other_payment: that.data.orderPayment.actual_total - that.data.PD
    }
    if (app.globalData.customerInf.password == '' || app.globalData.customerInf.password == null) {
        console.log(app.globalData.customerInf, '注册表信息');
        wx.showModal({
            title: "预存支付密码为空，不能进行预存支付操作\n\t\r请设置密码",
            confirmText: '去设置',
            success: res => {
                if (res.confirm) {
                    wx.navigateTo({
                        url: '/pages/module_others/pages/setUp/setUp',
                    })
                }
            }
        })
        return;
    }
    wx.request({
        url: app.globalData.isCVerifyPw_url,
        data: json,
        method: 'POST',
        header: {
            'content-type': 'application/json' // 默认值
        },
        success(res) {
            console.log(res.data)
            if (res.data.result.result == '1') {
                that.setData({
                    VIPPayLogin: true
                })
                wx.request({
                    url: app.globalData.allUrl.updatePayPW,
                    data: {
                        orderId: that.data.orderid
                    },
                    success: res => {
                        let aaa = that.data.thisorderarry
                        aaa.isPayPW = 1
                        that.setData({
                            thisorderarry: aaa,
                        })
                        if (that.data.thisorderarry.isPayPW == '1' && !that.data.calueStored && !that.data.nPD) {
                            wx.request({
                                url: app.globalData.getIsAdvance,
                                data: {
                                    orderId: that.data.orderid,
                                },
                                success: res => {
                                    if (res.data.code == 1) {
                                        that.setData({
                                            isAdvance: true,
                                            paymethod: 0
                                        })
                                    }
                                }
                            })
                            that.setData({
                                waitPay: true
                            })
                        } else if (that.data.thisorderarry.isPayPW == '1' && !that.data.calueStored && !that.data.nPD) {
                            that.payIt()
                        } else if (that.data.thisorderarry.isPayPW == '1' && that.data.calueStored) {
                            wx.request({
                                url: app.globalData.updateIsAdvanceDeposit,
                                data: {
                                    orderId: that.data.orderid,
                                    isAdvanceDeposit: 0,
                                    shopId: that.data.shop_id,
                                    phone: that.data.vipPhone,
                                    card: that.data.vipCard
                                },
                                success: res => {
                                    console.log("进来了");
                                    that.setData({
                                        paymethod: 0,
                                        calueStoredSelected: isAdvanceDeposit == 0
                                    })
                                    that.refresh()
                                }
                            })
                        }
                    }
                })
                that.toPayOrder()
            } else {
                wx.showModal({
                    title: '切瓜切菜',
                    content: "密码错误\n请重新输入"
                })
            }
        }
    })
}
export const toPayment = function () {
    let orderId = this.data.orderid

    wx.request({
        // url: 'http://localhost:8082/evaluation/toPayment',  
        url: app.globalData.toPayment,
        data: {
            orderId: orderId
        },
        success: res => {
            this.redress()
        }
    })
}

//菜品点赞
export const changelike = function (e) {
    that = this
    let index = e.currentTarget.dataset.index
    // var cartList = that.data.cartList
    // cartList[index].praise_flag == 1 ? cartList[index].praise_flag = 0 : cartList[index].praise_flag = 1
    wx.request({
        url: app.globalData.UpdateDishesPoint_url,
        data: {
            id: e.currentTarget.dataset.id
        },
        success: function (res) {
            console.log(res.data)
            if (res.data.result == 1) {
                let point_index = that.data.point_index
                //点赞成功
                if (res.data.cause == 'success praised') {
                    point_index[index] = 1
                } else if (res.data.cause == 'Cancel praised') {
                    point_index[index] = 0
                }
                that.setData({
                    point_index: point_index
                })
            } else {
                //点赞失败
                wx.showToast({
                    title: '点赞失败!',
                    icon: 'fail',
                    duration: 2000
                })
            }

        }
    })
}

//订单详情--预付定金 （出单后）
export const advanceDeposit = function (e) {
    that = this
    console.log("总额", that.data.sumMonney)
    // if(this.data.thisorderarry.down_payment == undefined && this.data.thisorderarry.down_payment > 0) return //TODO 2021-10-8 待做
    wx.request({
        url: app.globalData.advanceDeposit,
        //url: 'http://192.168.8.7:8081/evaluation/advanceDepositBefore',
        // url: 'http://192.168.8.7:8081/evaluation/advanceDeposit',
        data: {
            shopId: app.globalData.shopid,
            // totalAmount: that.data.sumMonney,
            orderId: this.data.orderid,
            phone: that.data.thisorderarry.phone_num
        },
        success: function (res) {
            console.log("预付定金", res.data)
            if (res.data.code == 1) {
                that.setData({
                    params_money: res.data.params.money,
                    isShowDeposit: true
                })
            } else if (res.data.code == 3) {
                that.setData({
                    params_money: that.data.thisorderarry.deposit_price == 0 ? -1 : that.data.thisorderarry.deposit_price,
                    isShowDeposit: true,
                })
            } else {
                that.setData({
                    isShowDeposit: false
                })
            }

        }
    })
}
//下单详情--预付定金 （出单前）
export const advanceDepositBefore = function (e) {
    that = this
    console.log("总额", that.data.sumMonney)
    // if(this.data.thisorderarry.down_payment == undefined && this.data.thisorderarry.down_payment > 0) return //TODO 2021-10-8 待做
    wx.request({
        url: app.globalData.advanceDepositBefore,
        //url: 'http://192.168.8.7:8081/evaluation/advanceDepositBefore',
        // url: 'http://192.168.8.7:8081/evaluation/advanceDeposit',
        data: {
            shopId: app.globalData.shopid,
            totalAmount: that.data.sumMonney,
            phone: that.data.thisorderarry.phone_num
            // orderId:this.data.orderid
        },
        success: function (res) {
            console.log("预付定金", res.data)
            if (res.data.code == 1) {
                that.setData({
                    params_money: res.data.params.money,
                    isShowDeposit: true
                })
            } else if (res.data.code == 3) {
                that.setData({
                    params_money: -1,
                    isShowDeposit: true,
                })
            } else {
                that.setData({
                    isShowDeposit: false
                })
            }

        }
    })
}
export const toPayDeposit = function () {
    that = this
    let sub_mch_id = app.globalData.shopdetail.sub_merchants_id ? app.globalData.shopdetail.sub_merchants_id : '1615440524'
    let out_trade_no = that.data.thisorderarry.order_code + "DJ"
    let orderId = that.data.orderid
    let shopId = that.data.shop_id
    let total_fee = that.data.params_money * 100 // 预付定金
    // let total_fee = 1 // 测试用1分钱
    let openid = app.globalData.openid
    pay.pay({
        sub_mch_id: sub_mch_id,
        body: '预付订金',
        out_trade_no: out_trade_no, //订单号
        order_id: orderId,
        shop_id: shopId,
        total_fee: parseInt(total_fee), //支付金额(单位分)
        openid: openid,
        profit_sharing: 0,
        percent_pay: 0,
        percent_total: 0,
        back: res => {
            if (res.result != 'success') {
                console.log(res)
                wx.showModal({
                    title: '提示',
                    content: '定金支付失败',
                    showCancel: false,
                })
                return
            } else {
                if (orderId) {
                    wx.request({
                        // url: 'http://192.168.8.5:8088/evaluation/updateDownPay',
                        url: app.globalData.updateDownPay,
                        data: {
                            orderId: orderId,
                            money: that.data.params_money,
                        },
                        success: res => {
                            console.log(res);
                        }
                    })
                }
                wx.showToast({
                    title: '支付成功',
                    icon: 'success',
                    showCancel: false,
                    duration: 2000
                })
                that.setData({
                    isShowDeposit: false,
                    isDownPayMent: that.data.params_money,
                })
            }
        }
    })
    // wx.request({
    //   url: app.globalData.allUrl.wxPayService,
    //   method: "GET",
    //   data: {
    //     //公众号appid
    //     appid: 'wx7601bb0ab62f48aa',
    //     //商户号
    //     mch_id: '1576959441',
    //     //支付说明
    //     body: '请到订单详情查看',
    //     //订单号
    //     out_trade_no: that.data.thisorderarry.order_code+"1",
    //     //支付接口
    //     trade_type: 'JSAPI',
    //     //支付金额(单位分)
    //     total_fee: total_fee,
    //     //用户openid
    //     openid: openid,
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     console.log(res.data[0].package)
    //     if (res.statusCode == 500){
    //       wx.showToast({
    //         title: '商户id错误',
    //         icon: 'none',
    //         showCancel: false,
    //         duration: 1000
    //       })
    //     }
    //     wx.requestPayment({
    //       'timeStamp': res.data[0].timeStamp,
    //       'nonceStr': res.data[0].nonceStr,
    //       'package': res.data[0].package,
    //       'signType': res.data[0].signType,
    //       'paySign': res.data[0].sign,
    //       'success': function (res) {
    //         console.log(res)
    //         wx.showToast({
    //           title: '支付成功',
    //           icon: 'success',
    //           showCancel: false,
    //           duration: 2000
    //         })
    //         that.setData({
    //           isShowDeposit: false
    //         })
    //       },
    //       'fail': function (res) {
    //         console.log(res)
    //         wx.showModal({
    //           title: '提示',
    //           content: '定金支付失败',
    //           showCancel: false,
    //         })
    //       }
    //     })
    //   }
    // })
    // wx.request({
    //   url:  app.globalData.allUrl.wxPayPlusService,
    //   // url: 'https://test.fsmbdlkj.com/WX Restaurant/WxPayPlusService',
    //   method: "GET",
    //   data: {
    //     //公众号appid
    //     appid: 'wx78455227a0fd853f',
    //     //商户号
    //     mch_id: '1525534221',
    //     //小程序 sub_appid
    //     sub_appid: "wx7601bb0ab62f48aa",
    //     //子商户号 sub_mch_id: app.globalData.shopdetail.sub_merchants_id,
    //     sub_mch_id: sub_mch_id,
    //     body: '请到订单详情查看',
    //     out_trade_no: out_trade_no, //订单号
    //     attach:"{order_id:"+orderId+",shop_id:"+shopId+",percent_pay:"+1+",percent_total:"+1+"}",
    //     // total_fee: Number(that.data.actualSum) * 100, //支付金额(单位分)
    //     total_fee: total_fee, //支付金额(单位分)
    //     trade_type: 'JSAPI',
    //     openid: openid,
    //     profit_sharing: profit_sharing
    //   },
    //   success: function (res) {
    //     console.log(res)
    //     console.log(res.data[0].package)
    //     if (res.statusCode == 500){
    //       wx.showToast({
    //         title: '商户id错误',
    //         icon: 'none',
    //         showCancel: false,
    //         duration: 1000
    //       })
    //     }
    //     wx.requestPayment({
    //       'timeStamp': res.data[0].timeStamp,
    //       'nonceStr': res.data[0].nonceStr,
    //       'package': res.data[0].package,
    //       'signType': res.data[0].signType,
    //       'paySign': res.data[0].sign,
    //       'success': function (res) {
    //         console.log(res)
    //         wx.showToast({
    //           title: '支付成功',
    //           icon: 'success',
    //           showCancel: false,
    //           duration: 2000
    //         })
    //         that.setData({
    //           isShowDeposit: false
    //         })
    //       },
    //       'fail': function (res) {
    //         console.log(res)
    //         wx.showModal({
    //           title: '提示',
    //           content: '定金支付失败',
    //           showCancel: false,
    //         })
    //       }
    //     })
    //   }
    // })
}

export const bindsubmitThisOrder = function (e) {
    let that = this
    if(app.globalData.user_id<=0){
      //因为未登陆，无法获取用户的user_id ,导致下单失败，现再下单接口判断user_id是否有值，如无则获取成功后再下单
      wx.request({
        url: app.globalData.UserLogin_url,
        data: {
            Open_id: app.globalData.unionID,
            Shop_id: app.globalData.shopid ? app.globalData.shopid : that.data.shop_id
        },
        success: function (res) {
            
            if (res.data.result != null &&res.data.result.result != 0) {
              app.globalData.user_id = res.data.object[0].user_id
              wx.setStorage({
                  key: "user_id",
                  data: res.data.object[0].user_id
              })

              if (that.data.cartList.length != that.data.testPackage.length && that.data.params_money && that.data.params_money != -1 && !that.data.thisorderarry.down_payment && that.data.isShowDeposit && (that.data.thisorderarry.order_status == '待确认' || !that.data.thisorderarry.order_status)) {
                wx.showModal({
                    title: '提示',
                    content: '预付订金未支付，是否继续提交？',
                    confirmText: '继续',
                    success: res => {
                        if (res.confirm) {
                            that.submitTheOrder()
                        }
                    }
                })
                return;
            }
            that.submitTheOrder()


            
            } 
        }
    })

    }else{

      if (that.data.cartList.length != that.data.testPackage.length && that.data.params_money && that.data.params_money != -1 && !that.data.thisorderarry.down_payment && that.data.isShowDeposit && (that.data.thisorderarry.order_status == '待确认' || !that.data.thisorderarry.order_status)) {
        wx.showModal({
            title: '提示',
            content: '预付订金未支付，是否继续提交？',
            confirmText: '继续',
            success: res => {
                if (res.confirm) {
                    that.submitTheOrder()
                }
            }
        })
        return;
    }
    that.submitTheOrder()


    }

    // 预付订金有且未支付,且未出单
    //  预付订金                      预付订金不为 -1                  订单未支付预付订金                     订单未支付预付订金 
    
}
//确认提交订单或确认加餐
export const submitTheOrder = function (e) {

    that = this
    console.log(that.data.shop_id)
    //console.log(that.data.thisorderarry.dinner_time,"这里是2673")
    //locationindex  写入数据库后的操作 1-复制订单，需要写入，2-更换桌号 ，3-加菜
    //order_type 订单类型：0-堂食、1-预定、2-外卖、3-外卖自提
    //2021/1/8方法修改，把提示框单独拖出来成为showSubmitTheOrder方法，然后这个方法成为单独的提交方法，方便插入打印框
    let order_choose_printer = ''
    if (that.data.printType1) {
        //选择的是默认打印，正常出单
    } else {
        //选择的是指定打印机，则把选择的打印机编号放入到order_inf表
        //一手判断防止报错
        if (that.data.printArray.length > 0) {
            if (that.data.printIndex > -1)
                order_choose_printer = that.data.printArray[that.data.printIndex].printer_id
        }
    }
    wx.showLoading({
        title: '加载中',
    })
    if (that.data.detailsType == 1) {
        var count = 0;
        var user_count = app.globalData.userNum
        var order_name = that.data.thisorderarry.user_name
        var dishescount = 0
        var tbcCount = that.data.cartList.length // 部长待确认数不需要下单时填写
        var order_type = 1 // 部长下单视为堂食
        // 新需求 help_order变更为 ：0-手机下单，1-触屏下单，2-线上下单，3-扫码下单，4-帮客下单
        var help_order = 0
        var preorder_starus = 0 // 凡是部长下单都直接视为出单
        var arrivaltime = String(app.globalData.date) + ' ' + String(app.globalData.time) //差一个日期
        // var nowtime = time.formatTime(new Date)
        var needToCreate = false

        for (var m = 0; m < that.data.cartList.length; m++) {
            //2020-12-01 来料加工 部位当份数算
            if ((that.data.cartList[m].dishes_spec_type == 8 || that.data.cartList[m].dishes_spec_type == 2) && that.data.cartList[m].em_index != null && that.data.cartList[m].en_index != null) {
                dishescount += ((Number(that.data.cartList[m].em_index.length) + Number(that.data.cartList[m].en_index.length)) * Number(that.data.cartList[m].copyOrder));
            } else {
                if (that.data.cartList[m].dishes_spec_type == 1) {
                    dishescount += Number(that.data.cartList[m].number);
                } else {
                    dishescount += (Number(that.data.cartList[m].number) * Number(that.data.cartList[m].copyOrder))
                }
            }
        }

        var subSeatsId = '';
        for (let m = 0; m < that.data.subSeatsList.length; m++) {
            // if(app.globalData.locationid != that.data.subSeatsList[m].table_id){
            if (subSeatsId.length > 0) {
                subSeatsId += "," + that.data.subSeatsList[m].table_id
            } else {
                subSeatsId += that.data.subSeatsList[m].table_id
            }
            // }
        }

        var orderRemarks = remarkJS.joinRemarkStr(that.data.Order_quick_remark, that.data.Order_remark);
        console.log(app.globalData.time123)
        if (that.data.xdfs === true) {
            var orderEquipmentType = (that.data.testPackage.length > 0 && that.data.fromYuDing) ? 6 : 3
        } else {
            var orderEquipmentType = (that.data.testPackage.length > 0 && that.data.fromYuDing) ? 7 : 4
            order_type = 0
            help_order = 2
            preorder_starus = 1
        }
        let payment_status = 0;
        if(that.data.cartList.length == that.data.testPackage.length){
          payment_status = 99
        }
        var order_updata = {
            Order_type: order_type, //订单类型：0-堂食、1-预定、2-外卖
            Shop_id: that.data.shop_id,
            Table_id: app.globalData.locationid,
            // 我要改2.0
            Order_code: app.globalData.orderCodeValue, //订单编码后五位，通过
            User_count: user_count, //用餐人数
            User_id: app.globalData.user_id,
            customer_id: app.globalData.user_id,
            Users_id: app.globalData.user_id, //点餐人id，可多人点餐
            arrival_time: arrivaltime,
            dinner_time: app.globalData.dinnerTime,
            phone_num: app.globalData.phonenumber, //电话号码
            user_name: order_name, //用户姓名
            dishes_count: dishescount, //菜品数量
            table_name: app.globalData.locationname, //桌位名称
            preorder_starus: app.globalData.managementData.is_minister_confirm == 1 ? 0 : preorder_starus, //预定订单状态 0-未确认、1-已确认、2-申请取消、3-已取消、4-已申请确认、5-申请修改、6-已修改、7-不能修改
            operator: that.data.loginname, //操作人员记录
            // operation_time: nowtime, //订单操作时间 
            tbc_count: tbcCount, //待确认菜品数
            help_order: app.globalData.managementData.is_minister_confirm == 1 ? 0 : help_order, //0-正常单、1-帮人点但未转发、2-帮人点已转发
            cz_flag: that.data.cz_flag, //充整标志0-不充整，1-充整
            Grand_total: that.data.sumMonney, //应收
            Order_subtotal: that.data.sumMonney, //订单小计
            order_wait: that.data.all_wait_order ? that.data.all_wait_order : 0, //菜品是否需要叫起
            invoice_flag: that.data.invoice_flag, //是否开发票 0-不开 1-开
            Order_remark: orderRemarks, //订单备注
            paymethod: that.data.paymethod, // 默认支付方式
            copyOrderNum: that.data.copyOrderNum,
            order_choose_printer: order_choose_printer, //选择指定打印的打印机编号
            all_free_order: that.data.all_free_order ? that.data.all_free_order : 0,
            all_repair_order: that.data.all_repair_order ? that.data.all_repair_order : 0,
            all_wait_order: that.data.all_wait_order ? that.data.all_wait_order : 0,
            all_bale_order: that.data.all_bale_order ? that.data.all_bale_order : 0,
            vipPhone: app.globalData.vipPhone,
            vipCard: app.globalData.vipCard,
            // 8-25要改
            order_equipment_type: orderEquipmentType,
            subSeatsTableId: subSeatsId,
            down_payment: that.data.isDownPayMent ? that.data.isDownPayMent : 0,
            rmq_user_id: app.globalData.rmqData.mqtt_queue_pre + "qgqc_" + app.globalData.caustomerId,
            payment_status: payment_status,
        }

        order_updata.Order_code = app.globalData.orderCode,
            wx.request({ // 创建订单
                url: app.globalData.WriteOrder_url,               
                data: order_updata,                
                success: function (res) {
                    if (res.data.result.result == '1') {
                        //把缓存的暂时修改的餐桌编号清空
                        app.globalData.temporaryTableId = ''
                        that.setData({
                            order_code: res.data.object[0].order_code,
                            order_id: res.data.object[0].order_id,
                        })                        
                        if (app.globalData.selectedManagerId > 0){
                            //用户选了订房部长，需要写到订单表里
                            wx.request({                                
                                url:app.globalData.updateDownPayment,
                                data:{
                                    minister_id: app.globalData.selectedManagerId,
                                    minister_name: app.globalData.selectedManagerName,
                                    shopId: app.globalData.shopid,
                                    orderId: that.data.order_id              
                                },
                                method:'POST',
                                header: {
                                'content-type': 'application/json'
                                },                                
                            })
                        }                       

                        rmq.sendRabbitMQMsg({
                            msg_id: 'SSZGSSZGSSZGSSZGSSZGSSZGSSZ' + app.globalData.caustomerId,
                            from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
                            msg: {
                                type: 'jump',
                                text: '客人已下单',
                                orderId: res.data.object[0].order_id
                            },
                            table_name: app.globalData.locationname,
                            table_id: app.globalData.locationid,
                            tg: "bz",
                            shop_id: app.globalData.shopid,
                            back: res => {
                                console.log(res)
                            }
                        })
                        var cartList = that.data.cartList
                        // var orderdetail = that.data.orderdetail;
                        var orderdetail = [];
                        var addtobuyarry = that.data.addtobuyarry

                        WXAPI.updateOrderPayment({
                            order_id: res.data.object[0].order_id,
                            actual_total: that.data.sumMonney
                        }).then(function (data) {
                            if (data.result == "success") {
                                //订单价格修改成功
                            } else {
                                //订单价格修改失败
                            }
                        }).catch(res => {
                            //订单价格修改失败
                        })

                        for (var i = 0; i < cartList.length; i++) {
                            if (cartList[i].dishes_spec_type == 5) {
                                cartList[i].weighing = 5;
                                cartList[i].number = cartList[i].disher_weight + "," + cartList[i].disher_weight_ceiling;
                            }
                            // 0-正常类别、1-茶位米饭、2-酒水、3-其他用品、4-早市、5-饭市 6-临时菜品
                            //规格类型：单规格-0，多规格-1，称重多做法-2，计件多做法-3,称重单规格-5，单规格多做法-4，称重多规格-6，单规格+配菜-7，来料加工-8，多拼粥品-9
                            if (cartList[i].dishes_spec_type == 0 ||
                                cartList[i].dishes_spec_type == 1 ||
                                cartList[i].dishes_spec_type == 5 ||
                                cartList[i].dishes_spec_type == 6 ||
                                cartList[i].dishes_spec_type == 9 ||
                                cartList[i].dishes_spec_type == 91 ||
                                cartList[i].dishes_spec_type == 21 ||
                                cartList[i].dishes_spec_type == 22 ||
                                cartList[i].dishes_spec_type == 23 ||
                                cartList[i].dishes_spec_type == 24 ||
                                cartList[i].dishes_spec_type == 25 ||
                                cartList[i].dishes_spec_type == 26 ||
                                cartList[i].dishes_spec_type == 27 ||
                                cartList[i].dishes_spec_type == 100 ||
                                cartList[i].dishes_spec_type == 101||
                                cartList[i].dishes_spec_type == 210||
                                cartList[i].dishes_spec_type == 211||
                                cartList[i].dishes_spec_type == 220
                            ) {
                                var dishes_status
                                cartList[i].specal_type == 0 ? dishes_status = 4 : dishes_status = 0
                                var measurement_value11 = 0
                                if (cartList[i].specal_type == 6) {
                                    measurement_value11 = cartList[i].measurement_value
                                }
                                let item_price;
                                if (cartList[i].dishes_spec_type == 9 || cartList[i].dishes_spec_type == 91) {
                                    // item_price = cartList[i].dishes_price / cartList[i].number
                                    item_price = cartList[i].dishes_price
                                } else {
                                    if (cartList[i].dishes_spec_type == 27) {
                                        item_price = cartList[i].dishes_price
                                    } else {
                                        item_price = cartList[i].dishes_price
                                    }
                                }

                                var lstOrderSetMealConstituteType=[];
                                if(cartList[i].lstOrderSetMealConstituteType&&cartList[i].lstOrderSetMealConstituteType.length>0){
                                lstOrderSetMealConstituteType=cartList[i].lstOrderSetMealConstituteType
                                }

                                var item = {
                                    "user_id": app.globalData.user_id,
                                    "dishes_id": cartList[i].dishes_id,
                                    "dishes_status": dishes_status,
                                    "item_price": item_price,
                                    "dishes_price": cartList[i].dishes_price,
                                    "item_subtotal": cartList[i].sum,
                                    "item_type": cartList[i].item_type,
                                    "measurement_value": measurement_value11,
                                    "order_id": res.data.object[0].order_id,
                                    "spec_id": cartList[i].weighing,
                                    "praise_flag": 0,
                                    "userchecked": 0,
                                    "dishes_img": cartList[i].img_url,
                                    "dishes_name": cartList[i].name,
                                    // cartList[i].specal_type == 6 || cartList[i].spec_type == 0 ? cartList[i].spec_name : cartList[i].spec_type,
                                    "dishes_metering_type": cartList[i].spec_name,
                                    "operator": that.data.loginname, //操作人员记录
                                    // "operation_time": nowtime, //订单操作时间 
                                    "spec_name": cartList[i].spec_name,
                                    "item_number": cartList[i].number,
                                    "remarks": cartList[i].remark,
                                    "specal_type": cartList[i].specal_type,
                                    "em_id": 0,
                                    "u_item_number": 0, //初始化未减菜的份数0
                                    "initial_number": parseInt(cartList[i].number), // 初始菜品份数,称重菜品视为一份
                                    "sideDisht": (cartList[i].sideDisht != null && cartList[i].sideDisht.length != 0) ? cartList[i].sideDisht : '',
                                    "jointSet": cartList[i].jointSet,
                                    "tastes": cartList[i].tastes,
                                    "freeOrder": cartList[i].freeOrder,
                                    "repairOrder": cartList[i].repairOrder,
                                    "copyOrder": cartList[i].copyOrder,
                                    "waitOrder": cartList[i].waitOrder,
                                    "baleOrder": cartList[i].baleOrder,
                                    "transferOrder": cartList[i].transferOrder,
                                    "depositOrder": cartList[i].depositOrder,
                                    "spec_type": cartList[i].dishes_spec_type,
                                    "vip_price": cartList[i].vip_price,
                                    "inline_price": cartList[i].inline_price,
                                    "shop_id": that.data.shop_id,
                                    "ticket_order_detial_uuid": cartList[i].uuid ? cartList[i].uuid : 0,
                                    "constituteTypeList": cartList[i].constituteTypeList,
                                    "inline_price_commission": cartList[i].inline_price_commission,
                                    "lstOrderSetMealConstituteType":JSON.stringify(lstOrderSetMealConstituteType),
                                }
                                if (cartList[i].dishes_spec_type == 6) {
                                    item.disher_weight_ceiling = cartList[i].item_number.split(',')[0]
                                    item.item_number = cartList[i].item_number
                                    item.initial_number = parseInt(cartList[i].item_number)
                                }
                                orderdetail.push(item)

                            } else if (cartList[i].dishes_spec_type == 8 || cartList[i].dishes_spec_type == 2) { // 来料加工、多计量多做法
                                if (!cartList[i].isWhole) {
                                    var eatMethodArray1 = cartList[i].em_index
                                    if (eatMethodArray1) {
                                        if (eatMethodArray1.length != 0) {
                                            var em_num = 0;
                                            for (var x of eatMethodArray1) {
                                                var sideDisht1 = ''
                                                var sideDishtStr = [];
                                                if (x.SideDishList != null && x.SideDishList != '') { // 记录配菜asdasd
                                                    for (var k = 0; k < x.SideDishList.length; k++) {
                                                        if (x.SideDishList[k].checked) {
                                                            sideDisht1 = sideDisht1 + x.SideDishList[k].ID + '-' + x.SideDishList[k].orderDetailedNum + ','
                                                        }
                                                    }
                                                }
                                                if (x.SideDishList_choose != null && x.SideDishList_choose != '') {
                                                    for (let k = 0; k < x.SideDishList_choose.length; k++) {
                                                        var str = x.SideDishList_choose[k].sideDishName + '*' + x.SideDishList_choose[k].orderDetailedNum;
                                                        sideDishtStr.push(str);
                                                    }
                                                }
                                                em_num++;
                                                var eatMethodArray_temp = []
                                                eatMethodArray_temp.push({
                                                    "all": x.all,
                                                    "count": x.count,
                                                    "dishes_id": x.dishes_id,
                                                    "eating_method": x.eating_method,
                                                    "em_name": x.em_name,
                                                    "id": x.id,
                                                    "money": x.money,
                                                    "price": x.price,
                                                    "number": x.number,
                                                    "remarks": x.remarks,
                                                    "no_sideDish_money": x.no_sideDish_money,
                                                    "SideDishList": x.SideDishList,
                                                    "SideDishList_choose": x.SideDishList_choose,
                                                    "sideDishtStr": sideDishtStr.join(),
                                                    "em_num": em_num + "/" + eatMethodArray1.length,
                                                })
                                                let dishePrice = 0;
                                                if (cartList[i].dishes_price) {
                                                    dishePrice = Number(cartList[i].dishes_price);
                                                }

                                                var addItem = {
                                                    "item_price": dishePrice,
                                                    "dishes_price": x.price + dishePrice * x.number,
                                                    "item_subtotal": x.money + dishePrice * x.number,
                                                    "measurement_value": x.number,
                                                    "item_number": cartList[i].measurement_value + "," + cartList[i].measurement_value,
                                                    "remarks": x.remarks,
                                                    "em_id": JSON.stringify(eatMethodArray_temp),
                                                    "disher_weight_ceiling": x.number,
                                                    "sideDisht": sideDisht1,
                                                    "tastes": x.tastes,
                                                    "spec_type": cartList[i].dishes_spec_type,
                                                    "vip_price": cartList[i].vip_price,
                                                    "inline_price": cartList[i].inline_price,
                                                    "shop_id": that.data.shop_id,
                                                    "weighingByLocation": cartList[i].weighingByLocation,
                                                    "max_wish_weight": cartList[i].max_wish_weight,
                                                    "min_wish_weight": cartList[i].min_wish_weight,
                                                    "inline_price_commission": cartList[i].inline_price_commission,
                                                }
                                                var item = that.createDetailItem(addItem, cartList[i], res.data.object[0].order_id);
                                                orderdetail.push(item)
                                            }
                                        }
                                    }
                                } else {
                                    //这里是全部位
                                    var em_id;
                                    var em_result = cartList[i].em_basicarry.every(function (item, index, array) {
                                        return item != -1
                                    })
                                    var en_result = cartList[i].en_basicarry.every(function (item, index, array) {
                                        return item != -1
                                    })
                                    if (en_result && cartList[i].en_basicarry != 0) {
                                        em_id = cartList[i].en_basicarry;
                                    } else if (em_result && cartList[i].em_basicarry != 0) {
                                        em_id = cartList[i].em_basicarry;
                                    } else {
                                        em_id = cartList[i].en_basicarry;
                                    }
                                    if (em_id != null) {
                                        let em_num = 0;
                                        for (let j = 0; j < em_id.length; j++) {
                                            em_num++;
                                            em_id[j].em_num = em_num + "/" + em_id.length;
                                            var sideDishtStr = [];
                                            if (em_id[j].SideDishList_choose != null && em_id[j].SideDishList_choose != "" && em_id[j].SideDishList_choose.length != 0) {
                                                for (let k = 0; k < em_id[j].SideDishList_choose.length; k++) {
                                                    var str = em_id[j].SideDishList_choose[k].sideDishName + '*' + em_id[j].SideDishList_choose[k].orderDetailedNum;
                                                    sideDishtStr.push(str);
                                                }
                                            }
                                            em_id[j].sideDishtStr = sideDishtStr.join();
                                        }
                                    }
                                    var addItem = {
                                        "item_price": cartList[i].dishes_price,
                                        "inline_price": cartList[i].inline_price,
                                        "dishes_price": cartList[i].dishes_price,
                                        "item_subtotal": cartList[i].sum,
                                        "measurement_value": cartList[i].measurement_value,
                                        "item_number": cartList[i].disher_weight + "," + cartList[i].disher_weight_ceiling,
                                        "remarks": cartList[i].remark,
                                        "em_id": JSON.stringify(em_id),
                                        "disher_weight_ceiling": cartList[i].disher_weight_ceiling,
                                        "sideDisht": cartList[i].sideDisht,
                                        "tastes": cartList[i].tastes,
                                        "spec_type": cartList[i].dishes_spec_type,
                                        "vip_price": cartList[i].vip_price,
                                        "shop_id": that.data.shop_id,
                                        "weighingByLocation": cartList[i].weighingByLocation,
                                        "max_wish_weight": cartList[i].max_wish_weight,
                                        "min_wish_weight": cartList[i].min_wish_weight,
                                        "inline_price_commission": cartList[i].inline_price_commission,
                                    }
                                    if (cartList[i].weighingByLocation == 0 && cartList[i].dishes_spec_type == 2) {
                                        addItem.em_count = cartList[i].em_count
                                    }
                                    var item = that.createDetailItem(addItem, cartList[i], res.data.object[0].order_id);
                                    orderdetail.push(item)
                                }
                            } else {
                                var em_id;
                                var em_result = cartList[i].em_basicarry.every(function (item, index, array) {
                                    return item != -1
                                })
                                var en_result = cartList[i].en_basicarry.every(function (item, index, array) {
                                    return item != -1
                                })
                                if (en_result && cartList[i].en_basicarry != 0) {
                                    em_id = cartList[i].en_basicarry;
                                } else if (em_result && cartList[i].em_basicarry != 0) {
                                    em_id = cartList[i].em_basicarry;
                                } else {
                                    em_id = cartList[i].en_basicarry;
                                }
                                if (em_id != null) {
                                    let em_num = 0;
                                    for (let j = 0; j < em_id.length; j++) {
                                        em_num++;
                                        em_id[j].em_num = em_num + "/" + em_id.length;
                                    }
                                }
                                var item = {
                                    "inline_price_commission": cartList[i].inline_price_commission,
                                    "user_id": app.globalData.user_id,
                                    "dishes_id": cartList[i].dishes_id,
                                    "dishes_status": 5,
                                    "item_price": cartList[i].dishes_price,
                                    "inline_price": cartList[i].inline_price,
                                    "dishes_price": cartList[i].dishes_price,
                                    "item_subtotal": cartList[i].sum,
                                    "item_type": cartList[i].item_type,
                                    "measurement_value": cartList[i].measurement_value,
                                    "order_id": res.data.object[0].order_id,
                                    "spec_id": cartList[i].weighing,
                                    "praise_flag": 0,
                                    "userchecked": 1,
                                    "dishes_img": cartList[i].img_url,
                                    "dishes_name": cartList[i].name,
                                    "dishes_metering_type": cartList[i].specal_type == 6 ? cartList[i].spec_name : cartList[i].spec_type,
                                    "spec_name": cartList[i].spec_name,
                                    "item_number": cartList[i].disher_weight + "," + cartList[i].disher_weight_ceiling,
                                    "remarks": (cartList[i].dishes_spec_type == 10 && cartList[i].quickRemark) ? (cartList[i].quickRemark + ";" + cartList[i].remark) : cartList[i].remark,
                                    "operator": that.data.loginname, //操作人员记录
                                    // "operation_time": nowtime, //订单操作时间 
                                    "specal_type": cartList[i].specal_type,
                                    "em_id": JSON.stringify(em_id),
                                    "u_item_number": 0, //初始化未减菜的份数0
                                    "u_measurement_value": 0, //初始化修改后的重量
                                    "disher_weight_ceiling": cartList[i].disher_weight_ceiling,
                                    "dishes_index": cartList[i].dishes_index,
                                    "initial_number": 1, // 初始菜品份数,称重菜品视为一份
                                    "sideDisht": cartList[i].sideDisht,
                                    "jointSet": '',
                                    "tastes": cartList[i].tastes,
                                    "freeOrder": cartList[i].freeOrder,
                                    "repairOrder": cartList[i].repairOrder,
                                    "copyOrder": cartList[i].copyOrder,
                                    "waitOrder": cartList[i].waitOrder,
                                    "baleOrder": cartList[i].baleOrder,
                                    "transferOrder": cartList[i].transferOrder,
                                    "depositOrder": cartList[i].depositOrder,
                                    "spec_type": cartList[i].dishes_spec_type,
                                    "vip_price": cartList[i].vip_price,
                                    "shop_id": that.data.shop_id,
                                }
                                orderdetail.push(item)
                            }
                        }
                        wx.request({
                            url: app.globalData.WriteOrderDetails_url,
                            // url:'http://192.168.8.17:8087/WX Restaurant/WriteOrderDetailsNew',
                            data: {
                                OrderDetaileds: JSON.stringify(orderdetail)
                            },
                            method: "POST",
                            header: {
                                "Content-Type": "application/x-www-form-urlencoded"
                            },
                            success: function (res) {
                                if (res.data.result.result == '1') {


                                    if (orderEquipmentType == 3 || orderEquipmentType == 6) {
                                        for (const item of cartList) {
                                            for (let i = 0; i < item.number; i++) {
                                                wx.request({
                                                    // url: 'http://localhost:8081/evaluation/addFood',
                                                    url: app.globalData.addFood,
                                                    data: {
                                                        dishesId: item.dishes_id,
                                                        shopId: that.data.shop_id
                                                    },
                                                    success: res => {

                                                    }
                                                })
                                            }

                                        }
                                    }



                                    RMQV3.sendRabbitMQMsg({
                                        msg_id: 'SSZGSSZGSSZGSSZGSSZGSSZGSSZ' + app.globalData.caustomerId,
                                        from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
                                        msg: {
                                            type: 'refresh',
                                            text: '刷新'
                                        },
                                        table_name: app.globalData.locationname,
                                        table_id: app.globalData.locationid,
                                        tg: "bz",
                                        shop_id: app.globalData.shopid,
                                        back: res => {
                                            console.log(res);
                                        }
                                    })
                                    app.resetOrderInf(1) //清空订单信息
                                    // app.recordConfirmationInf(0, "直接点餐", null, that.data.order_id, app.globalData.user_id) //记录直接点餐的确认信息
                                    wx.showToast({
                                        title: '下单成功',
                                        icon: 'success',
                                        duration: 2000,
                                        success: function (res) {
                                            app.resetOrderInf()
                                            wx.hideLoading()
                                            app.globalData.Order_remark = ''; //2020-11-26 清空备注
                                            app.globalData.Order_quick_remark = '';
                                            app.globalData.subSeatsBol = false; //分席数据清空
                                            app.globalData.subSeatsChar = '';
                                            app.globalData.subSeatsNum = 0;
                                            app.globalData.subSeatsList = [];
                                            app.globalData.this_old_subList = [];
                                            app.globalData.table_id = ''
                                            var storagearray = new Map()
                                            var user_id = wx.getStorageSync('user_id')
                                            var userInfoName = wx.getStorageSync('userInfoName')
                                            var phonenumber = wx.getStorageSync('phonenumber')
                                            storagearray.set("user_id", user_id)
                                            storagearray.set("userInfoName", userInfoName)
                                            storagearray.set("phonenumber", phonenumber)

                                            //销毁餐桌选择

                                            if (that.data.selectedLocationid) {
                                                wx.request({
                                                    url: app.globalData.delTableChoose,
                                                    // url: 'http://192.168.8.5:8088/evaluation/delTableChoose',
                                                    data: {
                                                        shopId: app.globalData.shopid,
                                                        orderCode: app.globalData.orderCode,
                                                        tableId: that.data.selectedLocationid,
                                                        bookTime: app.globalData.dinnerTime,
                                                        bookerId: app.globalData.customerInf.id,
                                                        bookerType: 0,
                                                    },
                                                    success: res => {
                                                        console.log(res);
                                                    }
                                                })

                                                app.globalData.orderCode = "";
                                            }

                                            wx.navigateTo({
                                                url: '/pages/orders/orders?user_id=' + user_id + '&userInfoName=' + userInfoName + '&phonenumber=' + phonenumber,
                                            })
                                            console.log("这里是3090");
                                        }
                                    })
                                    wx.request({
                                        url: app.globalData.SynchronizedAmount_url,
                                        // url:'http://localhost:8080/WX%20Restaurant/SynchronizedAmount',
                                        data: {
                                            order_id: res.data.object[0].order_id,
                                        },
                                        success: function (res) {
                                            if (res.data.result.result == 1) {
                                                //刷新成功
                                                // that.getThisOrderInf(that.data.orderid) //获得该订单信息
                                                // that.selectDiscountInformationByOrderId()
                                                // that.getThisOrderDetailAndInf()
                                                // that.getorderpayment()
                                                // that.resetOffer() //重置优惠信息
                                            }
                                        }
                                    })
                                } else {}
                                
                            },
                            fail: function (res) {
                                //菜单创建失败,无法提交菜品
                            },
                            complete() {
                                wx.hideLoading()
                            }
                        })
                        for (let m = 0; m < that.data.subSeatsList.length; m++) {
                            wx.request({
                                url: app.globalData.UpdateTableInf_url,
                                data: {
                                    Table_id: that.data.subSeatsList[m].table_id,
                                    Shop_id: that.data.shop_id,
                                    Table_status: 0,
                                    Order_id: res.data.object[0].order_id,
                                    subSeatsId: that.data.subSeatsList[m].subSeatsId
                                },
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                },
                                method: 'POST',
                                success: function (res) {

                                },
                            });
                        }

                    } else {
                        //订单创建失败
                        wx.hideLoading()
                    }
                },
                fail: function (res) {
                    //订单创建失败
                    wx.hideLoading()
                }
            })
       
    } else if (that.data.detailsType == 2) { // 加菜重写
        //加菜
        // 先获取订单中的已购买菜品信息，initial_cartList在menu页面中写入
        var newarry = app.globalData.initial_cartList //查出原来数据库里面的菜品数xin
        var cartList = that.data.cartList //加菜后总共的菜品数xin
        var dishes_add = [] // 待添加的菜品信息
        var dishes_cancel = [] // 待取消的菜品信息
        var dishes_change = [] // 待修改的菜品信息
        var dishes_unsubmitted = [] // 未提交的菜品信息
        var dishes_add_item = [] // 待添加的菜品信息 提交用
        var dishes_cancel_item = [] // 待取消的菜品信息 提交用
        var dishes_change_item = [] // 待修改的菜品信息 提交用
        // 这里开始是查看是否有菜品需要删除
        var preorder_starus = app.globalData.preorder_starus

        for (var i = 0; i < cartList.length; i++) {
            var item
            if (cartList[i].dishes_status != 20) {
                if (cartList[i].hadOrdered) { // 订单已有的情况下，视为取消，或者是修改
                    // 取消菜品操作，
                    if (cartList[i].item_type == 1) { // 取消的菜品，因为膳食掌柜，已下单的菜品，并不会从购物车中删除，所以可以用item_type 为1来标识
                        dishes_cancel.push(cartList[i])
                        item = {
                            id: cartList[i].id,
                            Shop_id: app.globalData.shopdetail.shop_id,
                            Order_id: that.data.orderid,
                            item_type: 1,
                            item_number: 0,
                            item_subtotal: 0,
                            u_item_number: -Number(cartList[i].u_item_number)
                        }
                        dishes_cancel_item.push(item)
                    } else { // 当排除了删除和新增的菜品之后，剩下的菜品视为修改。

                    }

                } else { //后加, 因为原本订单中没有的菜，都视为新加的菜
                    dishes_add.push(cartList[i])
                    if (cartList[i].dishes_spec_type == 5) {
                        cartList[i].weighing = 5;
                        cartList[i].number = cartList[i].disher_weight + "," + cartList[i].disher_weight_ceiling;
                    }
                    if ((cartList[i].disher_weight == 0 && cartList[i].dishes_spec_type != 10 && cartList[i].dishes_spec_type != 2) || cartList[i].dishes_spec_type == 5) {
                        var dishes_status
                        cartList[i].specal_type == 0 ? dishes_status = 4 : dishes_status = 0;
                        let item_type = cartList[i].item_type;
                        if (item_type == 2 && that.data.firstIssue == 1) {
                            //这是来料加工先出单，把菜品改回正常
                            item_type = 0;
                        };

                        item = {
                            "inline_price_commission": cartList[i].inline_price_commission,
                            "user_id": that.data.thisorderarry.user_id || app.globalData.user_id || 1,
                            "dishes_id": cartList[i].dishes_id,
                            "dishes_status": dishes_status,
                            "item_price": cartList[i].dishes_price,
                            "dishes_price": cartList[i].dishes_price,
                            "item_subtotal": cartList[i].sum,
                            "item_type": item_type,
                            "measurement_value": cartList[i].measurement_value,
                            "order_id": that.data.orderid || that.data.order_id,
                            "spec_id": cartList[i].weighing,
                            "praise_flag": 0,
                            "userchecked": 0,
                            "dishes_img": cartList[i].img_url,
                            "dishes_name": cartList[i].name,
                            // "dishes_metering_type": cartList[i].specal_type == 6 ? cartList[i].spec_name : cartList[i].spec_type,
                            "dishes_metering_type": cartList[i].spec_name,
                            // "spec_name": cartList[i].spec_name,
                            "spec_name": cartList[i].spec_name,
                            "item_number": cartList[i].number,
                            "remarks": cartList[i].remark,
                            "specal_type": cartList[i].specal_type,
                            "em_id": 0,
                            "u_item_number": 0, //初始化未减菜的份数0
                            "u_measurement_value": 0, //初始化修改后的重量
                            "initial_number": Number(cartList[i].dishes_spec_type) == 5 ? 1 : cartList[i].number,
                            "sideDisht": cartList[i].sideDisht,
                            "jointSet": cartList[i].jointSet,
                            "tastes": cartList[i].tastes,
                            "freeOrder": cartList[i].freeOrder,
                            "repairOrder": cartList[i].repairOrder,
                            "copyOrder": cartList[i].copyOrder,
                            "waitOrder": cartList[i].waitOrder,
                            "baleOrder": cartList[i].baleOrder,
                            "transferOrder": cartList[i].transferOrder,
                            "depositOrder": cartList[i].depositOrder,
                            "vip_price": cartList[i].vip_price,
                            "inline_price": cartList[i].inline_price,
                            "shop_id": that.data.shop_id,
                            "spec_type": cartList[i].dishes_spec_type,
                            "weighingByLocation": cartList[i].weighingByLocation,
                            "max_wish_weight": cartList[i].max_wish_weight,
                            "min_wish_weight": cartList[i].min_wish_weight
                        }
                        dishes_add_item.push(item)
                    } else if (cartList[i].dishes_spec_type == 8 || cartList[i].dishes_spec_type == 2) {
                        //来料加工,称重多做法 分部位
                        if (!cartList[i].isWhole) {
                            var eatMethodArray1 = cartList[i].em_index
                            if (eatMethodArray1) {
                                if (eatMethodArray1.length != 0) {
                                    var em_num = 0;
                                    for (var x of eatMethodArray1) {
                                        var sideDisht1 = '';
                                        var sideDishtStr = [];
                                        if (x.SideDishList != null && x.SideDishList != '') { // 记录配菜asdasd
                                            for (var k = 0; k < x.SideDishList.length; k++) {
                                                if (x.SideDishList[k].checked) {
                                                    sideDisht1 = sideDisht1 + x.SideDishList[k].ID + '-' + x.SideDishList[k].orderDetailedNum + ','
                                                }
                                            }
                                        }
                                        if (x.SideDishList_choose != null && x.SideDishList_choose != '') {
                                            for (let k = 0; k < x.SideDishList_choose.length; k++) {
                                                var str = x.SideDishList_choose[k].sideDishName + '*' + x.SideDishList_choose[k].orderDetailedNum;
                                                sideDishtStr.push(str);
                                            }
                                        }
                                        em_num++;
                                        var eatMethodArray_temp = []
                                        eatMethodArray_temp.push({
                                            "all": x.all,
                                            "count": x.count,
                                            "dishes_id": x.dishes_id,
                                            "eating_method": x.eating_method,
                                            "em_name": x.em_name,
                                            "id": x.id,
                                            "money": x.price,
                                            "price": x.price,
                                            "no_sideDish_money": x.no_sideDish_money,
                                            "number": x.number,
                                            "remarks": x.remarks,
                                            "SideDishList": x.SideDishList,
                                            "SideDishList_choose": x.SideDishList_choose,
                                            "sideDishtStr": sideDishtStr.join(),
                                            "em_num": em_num + "/" + eatMethodArray1.length,
                                        })
                                        let dishePrice = 0;
                                        if (cartList[i].dishes_price) {
                                            dishePrice = Number(cartList[i].dishes_price);
                                        }
                                        var addTemp = {
                                            "user_id": that.data.thisorderarry.user_id,
                                            "item_price": dishePrice,
                                            "dishes_price": x.price + dishePrice * x.number,
                                            "item_subtotal": x.money + dishePrice * x.number,
                                            "measurement_value": x.number,
                                            "item_number": cartList[i].measurement_value + "," + cartList[i].measurement_value,
                                            "remarks": x.remarks,
                                            "em_id": JSON.stringify(eatMethodArray_temp),
                                            "disher_weight_ceiling": x.number,
                                            "sideDisht": sideDisht1,
                                            "tastes": x.tastes,
                                            "vip_price": x.vip_price,
                                            "inline_price": x.inline_price,
                                            "shop_id": that.data.shop_id,
                                            "weighingByLocation": cartList[i].weighingByLocation,
                                            "max_wish_weight": cartList[i].max_wish_weight,
                                            "min_wish_weight": cartList[i].min_wish_weight,
                                            "inline_price_commission": cartList[i].inline_price_commission,
                                        };
                                        var item = that.createDetailItem(addTemp, cartList[i], that.data.orderid);
                                        dishes_add_item.push(item)
                                    }
                                }
                            }
                        } else {
                            //这里是全部位
                            var em_id;
                            var measurement_value = 0
                            var em_result = cartList[i].em_basicarry.every(function (item, index, array) {
                                return item != -1
                            })
                            var en_result = cartList[i].en_basicarry.every(function (item, index, array) {
                                return item != -1
                            })
                            if (en_result && cartList[i].en_basicarry != 0) {
                                em_id = cartList[i].en_basicarry;
                            } else if (em_result && cartList[i].em_basicarry != 0) {
                                em_id = cartList[i].em_basicarry;
                            } else {
                                em_id = cartList[i].en_basicarry;
                            }
                            if (em_id != null) {
                                let em_num = 0;
                                for (let j = 0; j < em_id.length; j++) {
                                    em_num++;
                                    em_id[j].em_num = em_num + "/" + em_id.length;
                                    var sideDishtStr = [];
                                    if (em_id[j].SideDishList_choose != null && em_id[j].SideDishList_choose != "" && em_id[j].SideDishList_choose.length != 0) {
                                        for (let k = 0; k < em_id[j].SideDishList_choose.length; k++) {
                                            var str = em_id[j].SideDishList_choose[k].sideDishName + '*' + em_id[j].SideDishList_choose[k].orderDetailedNum;
                                            sideDishtStr.push(str);
                                        }
                                    }
                                    em_id[j].sideDishtStr = sideDishtStr.join();
                                }
                            }
                            var addItem = {
                                "user_id": that.data.thisorderarry.user_id,
                                "item_price": cartList[i].dishes_price,
                                "dishes_price": cartList[i].dishes_price,
                                "item_subtotal": cartList[i].sum,
                                "measurement_value": cartList[i].measurement_value,
                                "item_number": cartList[i].disher_weight + "," + cartList[i].disher_weight_ceiling,
                                "remarks": cartList[i].remark,
                                "em_id": JSON.stringify(em_id),
                                "disher_weight_ceiling": cartList[i].disher_weight_ceiling,
                                "initial_number": Number(cartList[i].dishes_spec_type) == 5 ? 1 : cartList[i].number, // 初始菜品份数
                                "sideDisht": cartList[i].sideDisht,
                                "tastes": cartList[i].tastes,
                                "vip_price": cartList[i].vip_price,
                                "inline_price": cartList[i].inline_price,
                                "shop_id": that.data.shop_id,
                                "weighingByLocation": cartList[i].weighingByLocation,
                                "max_wish_weight": cartList[i].max_wish_weight,
                                "min_wish_weight": cartList[i].min_wish_weight,
                                "inline_price_commission": cartList[i].inline_price_commission,
                            }
                            if (cartList[i].weighingByLocation == 0 && cartList[i].dishes_spec_type == 2) {
                                addItem.em_count = cartList[i].em_count
                            }
                            var item = that.createDetailItem(addItem, cartList[i], that.data.orderid)
                            dishes_add_item.push(item)
                        }
                    } else {
                        var em_id;
                        var num = 0;
                        var em_basicarry2 = [];
                        var measurement_value = 0
                        var em_result = cartList[i].em_basicarry.every(function (item, index, array) {
                            return item != -1
                        })
                        var en_result = cartList[i].en_basicarry.every(function (item, index, array) {
                            return item != -1
                        })
                        if (en_result && cartList[i].en_basicarry != 0) {
                            em_id = cartList[i].en_basicarry;
                        } else if (em_result && cartList[i].em_basicarry != 0) {
                            em_id = cartList[i].em_basicarry;
                        } else {
                            em_id = cartList[i].en_basicarry;
                        }
                        if (em_id != null) {
                            let em_num = 0;
                            for (let j = 0; j < em_id.length; j++) {
                                em_num++;
                                em_id[j].em_num = em_num + "/" + em_id.length;
                            }
                        }
                        if (cartList[i].dishes_spec_type == 3 || cartList[i].dishes_spec_type == 4 || cartList[i].dishes_spec_type == 5 || cartList[i].dishes_spec_type == 10 || cartList[i].dishes_spec_type == 8) {
                            measurement_value = cartList[i].measurement_value
                        } else {
                            measurement_value = 0
                        }
                        let item_type = cartList[i].item_type;
                        if (item_type == 2 && that.data.firstIssue == 1) {
                            //这是来料加工先出单，把菜品改回正常
                            item_type = 0;
                        }
                        item = {
                            "user_id": that.data.thisorderarry.user_id,
                            "dishes_id": cartList[i].dishes_id,
                            "dishes_status": 5,
                            // "item_price": cartList[i].dishes_spec_type == 9 || cartList[i].dishes_spec_type == 91 ? (cartList[i].dishes_price / cartList[i].number) : cartList[i].dishes_price,
                            "item_price": cartList[i].dishes_price,
                            "dishes_price": cartList[i].dishes_price,
                            "item_subtotal": cartList[i].sum,
                            "item_type": item_type,
                            "measurement_value": measurement_value,
                            "order_id": that.data.orderid,
                            "spec_id": cartList[i].weighing,
                            "praise_flag": 0,
                            "userchecked": 1,
                            "dishes_img": cartList[i].img_url,
                            "dishes_name": cartList[i].name,
                            // cartList[i].spec_type,
                            // "dishes_metering_type": cartList[i].specal_type == 6 ? cartList[i].spec_name : cartList[i].spec_type,
                            "dishes_metering_type": cartList[i].spec_name,
                            "spec_name": cartList[i].spec_name,
                            "item_number": cartList[i].disher_weight + "," + cartList[i].disher_weight_ceiling,
                            "remarks": (cartList[i].dishes_spec_type == 10 && cartList[i].quickRemark) ? (cartList[i].quickRemark + ";" + cartList[i].remark) : cartList[i].remark,
                            "specal_type": cartList[i].specal_type,
                            "em_id": JSON.stringify(em_id),
                            "u_item_number": 0, //初始化未减菜的份数0
                            "u_measurement_value": 0, //初始化修改后的重量
                            "disher_weight_ceiling": cartList[i].disher_weight_ceiling,
                            "dishes_index": cartList[i].dishes_index,
                            "initial_number": Number(cartList[i].dishes_spec_type) == 5 ? 1 : cartList[i].number, // 初始菜品份数
                            "sideDisht": cartList[i].sideDisht,
                            "jointSet": '',
                            "tastes": cartList[i].tastes,
                            "freeOrder": cartList[i].freeOrder,
                            "repairOrder": cartList[i].repairOrder,
                            "copyOrder": cartList[i].copyOrder,
                            "waitOrder": cartList[i].waitOrder,
                            "baleOrder": cartList[i].baleOrder,
                            "transferOrder": cartList[i].transferOrder,
                            "depositOrder": cartList[i].depositOrder,
                            "vip_price": cartList[i].vip_price,
                            "inline_price": cartList[i].inline_price,
                            "shop_id": that.data.shop_id,
                            "spec_type": cartList[i].dishes_spec_type,
                            "ticket_order_detial_uuid": cartList[i].uuid ? cartList[i].uuid : 0,
                            "inline_price_commission": cartList[i].inline_price_commission,
                        }
                        dishes_add_item.push(item)
                    }
                }
            }
        }
        // ----------------------------------------------------------------------
        if (dishes_add_item.length != 0) {
            wx.request({
                url: app.globalData.WriteOrderDetails_url,
                // url:'http://192.168.8.17:8087/WX Restaurant/WriteOrderDetailsNew',
                data: {
                    OrderDetaileds: JSON.stringify(dishes_add_item)
                },
                method: "POST",
                header: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                success: function (res) {
                    if (res.data.result.result == 1) {
                        let order_remark = remarkJS.joinRemarkStr(that.data.Order_quick_remark, that.data.Order_remark);
                        wx.request({
                            url: app.globalData.UpdateOrderInf_url,
                            //url:"http://localhost:8080/WX Restaurant/UpdateOrderInfForAll",
                            data: {
                                Shop_id: app.globalData.shopdetail.shop_id,
                                Order_id: that.data.orderid,
                                Total_amount: that.data.sumMonney,
                                dishes_count: that.data.number,
                                order_remark: order_remark,
                                //firstIssue:that.data.firstIssue,
                                firstIssue: 0, //加菜一定是0
                            },
                            success: function (res) {
                                if (res.data.result.result == 1) {
                                    delete app.globalData.order_id
                                    WXAPI.updateOrderPayment({
                                        order_id: that.data.orderid,
                                        actual_total: that.data.sumMonney
                                    }).then(function (data) {
                                        if (data.result == "success") {
                                            //订单价格修改成功
                                        } else {
                                            //订单价格修改失败
                                        }
                                    }).catch(res => {
                                        //订单价格修改失败
                                    })
                                    wx.showToast({
                                        title: '下单成功',
                                        icon: 'success', //如果要纯文本，不要icon，将值设为'none'
                                        duration: 2000,
                                        success: function () {
                                            app.globalData.Order_remark = ''; //2020-11-26 清空备注
                                            app.globalData.Order_quick_remark = '';
                                            app.globalData.subSeatsBol = false; //分席数据清空
                                            app.globalData.subSeatsChar = '';
                                            app.globalData.subSeatsNum = 0;
                                            app.globalData.subSeatsList = [];
                                            app.globalData.this_old_subList = [];
                                            app.globalData.table_id = ''
                                            var storagearray = new Map()
                                            var user_id = wx.getStorageSync('user_id')
                                            var userInfoName = wx.getStorageSync('userInfoName')
                                            var phonenumber = wx.getStorageSync('phonenumber')
                                            storagearray.set("user_id", user_id)
                                            storagearray.set("userInfoName", userInfoName)
                                            storagearray.set("phonenumber", phonenumber)
                                            // wx.reLaunch({
                                            //   url: '/pages/orders/orders?user_id='+user_id+'&userInfoName='+userInfoName+'&phonenumber='+phonenumber,
                                            // })
                                            wx.reLaunch({
                                                url: '../orders/orders?toOrder=' + that.data.order_id + '&user_id=' + user_id + '&userInfoName=' + userInfoName + '&phonenumber=' + phonenumber,
                                            })
                                        }
                                    })
                                } else {
                                    //订单修改失败
                                    wx.showModal({
                                        title: '警告',
                                        content: '加菜失败,请重试',
                                        showCancel: false, //是否显示取消按钮
                                        confirmText: '是',
                                        success(res) {
                                            if (res.confirm) {
                                                app.globalData.Order_remark = ''; //2020-11-26 清空备注
                                                app.globalData.Order_quick_remark = '';
                                                app.globalData.subSeatsBol = false; //分席数据清空
                                                app.globalData.subSeatsChar = '';
                                                app.globalData.subSeatsNum = 0;
                                                app.globalData.subSeatsList = [];
                                                app.globalData.this_old_subList = [];
                                                app.globalData.table_id = ''
                                                wx.navigateTo({ // 跳转到订单列表就好了
                                                    url: '../orders/orders?&currentTab=' + 2,
                                                })
                                            }
                                        }
                                    })
                                }
                            },
                            fail: function (res) {
                                wx.showModal({
                                    title: '警告',
                                    content: '加菜失败,请重试',
                                    showCancel: false, //是否显示取消按钮
                                    confirmText: '是',
                                    success(res) {
                                        if (res.confirm) {
                                            app.globalData.Order_remark = ''; //2020-11-26 清空备注
                                            app.globalData.Order_quick_remark = '';
                                            app.globalData.subSeatsBol = false; //分席数据清空
                                            app.globalData.subSeatsChar = '';
                                            app.globalData.subSeatsNum = 0;
                                            app.globalData.subSeatsList = [];
                                            app.globalData.this_old_subList = [];
                                            app.globalData.table_id = ''
                                            wx.navigateTo({ // 跳转到订单列表就好了
                                                url: '../orders/orders?&currentTab=' + 2,
                                            })
                                        }
                                    }
                                })
                            }
                        })
                    } else {
                        //that.ErrFunction("网络异常,请重试")
                        //菜单创建失败
                    }
                },
                fail: function (res) {
                    //that.ErrFunction("网络异常,请重试")
                    //菜单创建失败
                }
            })
        } else {
            //没有新增菜品，直接执行跳转
            app.globalData.Order_remark = ''; //2020-11-26 清空备注
            app.globalData.Order_quick_remark = '';
            app.globalData.subSeatsBol = false; //分席数据清空
            app.globalData.subSeatsChar = '';
            app.globalData.subSeatsNum = 0;
            app.globalData.subSeatsList = [];
            app.globalData.this_old_subList = [];
            app.globalData.table_id = '';
            if (that.data.firstIssue == 1) {
                var orderId = that.data.orderid;
                wx.request({
                    url: app.globalData.UpdateOrderInf_url,
                    data: {
                        Order_id: orderId,
                        Shop_id: app.globalData.shopdetail.shop_id,
                        firstIssue: 0, //加菜一定是0
                    },
                    success: function () {}
                })
            }
            // wx.reLaunch({
            //   url: '../index/index?toOrder=' + that.data.order_id,
            // })
            wx.navigateTo({ // 跳转到订单列表就好了
                url: '../orders/orders?&currentTab=' + 2,
            })
        }
        if (dishes_cancel_item.length != 0) {
            //取消菜品成功
            WXAPI.updateOrderDetails({
                OrderDetaileds: JSON.stringify(dishes_cancel_item),
            }).then(function (data) {
                var remark_normal = []
                if (data.result.result == 1) {
                    //取消菜品执行成功
                }
            }).catch(res => {
                //取消菜品失败
            })
        }
        var order_remark = remarkJS.joinRemarkStr(that.data.Order_quick_remark, that.data.Order_remark);
        //2020-11-28 加菜 保存备注
        if (order_remark != "") {
            var orderId = that.data.orderid;
            wx.request({
                url: app.globalData.UpdateOrderInf_url,
                data: {
                    Order_id: orderId,
                    Shop_id: app.globalData.shopdetail.shop_id,
                    order_remark: order_remark
                },
                success: function () {}
            })
        }
        this.redress()

    }
    let aaa = ''
    for (let a = 0; a < that.data.cartList.length; a++) {
        const element = that.data.cartList[a];
        if ((element.spec_type == 100 || element.spec_type == 101) && !element.id) {
            // aaa.push(element.uuid)
            aaa += element.uuid + ","
        }
    }
    if (aaa.length > 0) {
        wx.request({
            url: app.globalData.updateTicketStatus,
            // url: 'http://192.168.8.7:8081/evaluation/updateTicketStatus',
            data: {
                idList: aaa.substring(0, aaa.length - 1),
                state: 2
            },
            success: r => {
                console.log(r)
            }
        })
    }
}

//查询可用的优惠券
export const selectOrderInfNewCoupon=function(e){

  var that=this;

  wx.request({
          url: app.globalData.selectOrderInfNewCoupon,
         //url: 'http://localhost:8080/evaluation_war/selectOrderInfNewCoupon',
          data: {
            order_id: this.data.thisorderarry.order_id ? this.data.thisorderarry.order_id : 0,
            shop_id: app.globalData.shopid ? app.globalData.shopid : 0,
          },
          success: res => {
              console.log(res)
              if (res.data.code == 1) {

                var used_new_bind_coupon_count=0;
                var used_new_bind_coupon_face_amount=0;
                var lstCoupon=[];
                var used_new_bind_coupon_list=[];
          
                  if(res.data.data!=null){
                       var orderInf=res.data.data;
                       used_new_bind_coupon_count=orderInf.used_new_bind_coupon_count;
                       used_new_bind_coupon_face_amount=orderInf.used_new_bind_coupon_face_amount;

                       if(orderInf.lstCoupon){

                         if(orderInf.lstCoupon==null){
                           orderInf.lstCoupon=[];
                         }
                         lstCoupon=orderInf.lstCoupon;
                         for(var i=0;i<lstCoupon.length;i++){
                           if(lstCoupon[i].ticket_status==1){
                            used_new_bind_coupon_list.push(lstCoupon[i]);
                           }
                         }

                       }
                  }

                  that.setData({
                    new_bind_coupon_list: lstCoupon,
                    used_new_bind_coupon_list:used_new_bind_coupon_list,
                    used_new_bind_coupon_count:used_new_bind_coupon_count,
                    used_new_bind_coupon_face_amount:used_new_bind_coupon_face_amount,
                  })
              }
          },
          complete: res => {
              
          }
      })
}



//设置不使用
export const updateOrderInfNewCouponUnUse=function(e){
    let item = e.currentTarget.dataset.item
     let that=this;
     wx.request({
         url: app.globalData.updateOrderInfNewCouponUnUse,
         //url: 'http://localhost:8080/evaluation_war/updateOrderInfNewCouponUnUse',
         data: {
             shop_id:app.globalData.shopid ? app.globalData.shopid : 0,
             dbo_user_inf_order_id: this.data.thisorderarry.order_id ? this.data.thisorderarry.order_id : 0,
             ticket_order_uuid:item.uuid,
             ticket_orderinfo_id:item.ticket_orderinfo_id,
         },
         success: res => {
             console.log(res)
             if (res.data.code == 1) {
                 that.selectOrderInfNewCoupon();
             }
         },
         complete: res => {
             wx.hideLoading()
         }
     })
}

//设置使用-核销
export const writeOffSelectNewBindCoupon=function(e){
 console.log(e)
     let item = e.currentTarget.dataset.item
     let that=this;
     
     var select_new_bind_coupon_list=this.data.select_new_bind_coupon_list;
     if(select_new_bind_coupon_list.length==0){
       wx.showToast({
         title: '请先选择优惠券',
         icon:'error',
       })
       return;
     }
     var select_ticket_order_uuid_list_str=select_new_bind_coupon_list.join(',');
     console.log(select_ticket_order_uuid_list_str)
     wx.request({
         url: app.globalData.writeOffSelectNewBindCoupon_url,
         //url: 'http://localhost:8080/evaluation_war/writeOffSelectNewBindCoupon',
         data: {
             select_ticket_order_uuid_list_str: select_ticket_order_uuid_list_str,
             operator_name: app.globalData.staffDetail.name ? app.globalData.staffDetail.name : '', //员工名字，确认的员工
             operator_id: app.globalData.operator_id ? app.globalData.operator_id : app.globalData.id, //操作人id
             dbo_user_inf_order_id:this.data.thisorderarry.order_id ? this.data.thisorderarry.order_id : 0,
             shop_id: app.globalData.shopid ? app.globalData.shopid : 0,
         },
         success: res => {
             console.log(res)
             if (res.data.code == 1) {
                 //that.selectOrderInfNewCoupon();
                 var used_new_bind_coupon_count=0;
               var used_new_bind_coupon_face_amount=0;
               var lstCoupon=[];
               var used_new_bind_coupon_list=[];

                 if(res.data.data!=null){
                      var orderInf=res.data.data;
                      used_new_bind_coupon_count=orderInf.used_new_bind_coupon_count;
                      used_new_bind_coupon_face_amount=orderInf.used_new_bind_coupon_face_amount;

                      if(orderInf.lstCoupon){

                        if(orderInf.lstCoupon==null){
                          orderInf.lstCoupon=[];
                        }
                        lstCoupon=orderInf.lstCoupon;
                        for(var i=0;i<lstCoupon.length;i++){
                          if(lstCoupon[i].ticket_status==1){
                          
                           used_new_bind_coupon_list.push(lstCoupon[i]);
                          }
                        }

                      }
                 }

                 that.setData({

                   new_bind_coupon_list: lstCoupon,
                   used_new_bind_coupon_list:used_new_bind_coupon_list,
                   used_new_bind_coupon_count:used_new_bind_coupon_count,
                   used_new_bind_coupon_face_amount:used_new_bind_coupon_face_amount,

                 })
                 

                  //使用新人优惠券
                   // that.toUseNewCouponCheck()
             }
         },
         complete: res => {
             wx.hideLoading()
         }
     })

}


export const changeNewCopupon=function(e){
    this.setData({
    select_new_bind_coupon_list:e.detail.value
    })

}


