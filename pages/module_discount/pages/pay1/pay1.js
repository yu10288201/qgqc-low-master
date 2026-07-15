// pages/pay/pay.js
const app = getApp()
const wxpay = require('../../../../utils/wxpay')
const util = require('../../../../utils/util')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        wechatAppId: "wx7601bb0ab62f48aa", //APPID
        //wsk: "b7362e5e2b5f32d9c314655b7b28de43", //SecretKey
        //公众号appid(诗么普科技)
        appid: 'wx78455227a0fd853f',
        //服务商户号(诗么普科技公司)
        mch_id: '1525534221',
        sub_merchants_id: '',
        payment_address: '',
        actualSum: 0,
        shopName: '',
        inviteOpenId: '', //邀请人openid
        commission_price: 0,
        order_total: 0,
        customer_platform_commission_amount:0,
    },
    pay2: function (e) {
        var that = this
        var total = ''
        if (!that.data.order_total) {
            total = Number(that.data.actualSum)
        } else {
            total = that.data.order_total
        }
        wx.request({
            url: app.globalData.AddTicketOrderPayment_url,
            data: {
                "order_id": that.data.order_id,
                "actual_total": total * 100,
                "payment_status": 1,
                "payment_type": 1
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                if (res.data.result.result == 1) {
                    wx.request({
                        url: app.globalData.taocan.UpdateTicketOrderInfo_url,
                        data: {
                            "order_id": that.data.order_id,
                            "order_status": 1,
                            "order_remark": 0
                        },
                        header: {
                            'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                        },
                        method: 'POST',
                        success: function (res) {
                            console.log(res)
                            if (res.data.result.result == 1) {
                                wx.showModal({
                                    title: '提示',
                                    content: '付款成功',
                                    success: function (res) {
                                        that.SetmealLike()
                                        if (res.confirm) { //这里是点击了确定以后

                                            wx.navigateBack({
                                                delta: 1,
                                                success: function (res) {
                                                    that.SetmealLike()
                                                    wx.showToast({
                                                        title: '支付成功',
                                                        icon: 'success',
                                                        duration: 2000
                                                    })
                                                },
                                            })
                                            //   console.log('用户点击确定')
                                        } else { //这里是点击了取消以后
                                            //    console.log('用户点击取消')
                                        }
                                    }
                                })

                            }
                        }
                    })
                }
            }
        })

    },
    SelectTicketOrderInfo: function (e) {
        var that = this
        wx.request({
            url: app.globalData.SelectTicketOrderInfo_url,
            data: {
                "order_id": that.data.order_id,
                "user_id": "",
                "shop_id": ""
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var SelectTicketOrderInfoList = res.data.object[0]
                var ordernum = ''
                var i = 0
                for (var x of SelectTicketOrderInfoList.order_code) {
                    if (i % 4 == 0) {
                        ordernum = ordernum + ' ' + x
                    } else {
                        ordernum = ordernum + x
                    }
                    i++
                }
                that.setData({
                    SelectTicketOrderInfoList: SelectTicketOrderInfoList,
                    ordernum: ordernum
                })
            }
        })
    },
    selectshopid: function (e) {
        var that = this
        wx.request({
            url: app.globalData.SelectShopDetails_url,
            data: {
                "shop_id": that.data.shop_id
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var shop = res.data[0]
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
        var that = this
        console.log(options)
        that.setData({
            package_type: options.package_type,
            ticket_orderinfo_id: options.ticket_orderinfo_id,
            inviteOpenId: options.inviteOpenId,
            setMealName: options.setMealName,
            shop_id: options.shop_id,
            actualSum: Number(options.actualSum),
            order_name: options.order_name,
            order_total: options.order_total,
            order_code: options.order_code,
            shopName: options.shopName,
            order_id: options.order_id,
            payment_address: options.payment_address,
            SYB_APPID: options.SYB_APPID,
            cusid: options.cusid,
            sub_merchants_id: options.sub_merchants_id,
            commission_price: options.commissionPrice,
            uuid: options.uuid,
            orderNum: options.orderNum,
            packageType: options.packageType,
            ticketInfo: JSON.parse(options.ticketInfo)
        })
        if(this.data.ticketInfo){
          if(this.data.ticketInfo.customer_platform_commission_amount){
            this.setData({
              customer_platform_commission_amount:this.data.ticketInfo.customer_platform_commission_amount,
            })
          }
        }
    },
    pay1: function () {
        wx.request({
            url: app.globalData.SelectShopDetails_url,
            data: {
                shop_id: this.data.shop_id
            },
            success: res => {
                this.setData({
                    shopdetail: res.data[0],
                    topimage: res.data[0].shop_img
                })
                app.globalData.shopdetail = res.data[0]
                this.pay()
            }
        })
    },
    
    pay: function () {
        var that = this
        let sub_mch_id = app.globalData.shopdetail.sub_merchants_id ? app.globalData.shopdetail.sub_merchants_id : '1615440524' //孟贲账户
        let out_trade_no = that.data.order_code + 'CZ'
        let order_id = Number(that.data.order_id)
        let shop_id = Number(that.data.shop_id)
        let total_fee = app.globalData.QRCodeVersion == 'release' ? !that.data.order_total ? Number(that.data.actualSum) * 100 : Number(that.data.order_total) * 100 : 5 //支付金额
        let openid = app.globalData.openid
        let inviteOpenId = that.data.inviteOpenId
        let percent_total = that.data.customer_platform_commission_amount 
        let profit_sharing = inviteOpenId != '' && inviteOpenId != openid && percent_total > 0 ? 1 : 0
        
        wx.request({
            url: app.globalData.updatePaymentDate,
            // url: 'http://192.168.8.5:8088/evaluation/updatePaymentDate',
            method: 'POST',
            data: {
                ticketOrderInfoId: that.data.ticket_orderinfo_id,
                shopId: that.data.shop_id,
                goodsUuid: that.data.uuid,
                buyOpenid: app.globalData.openid,
                incomeOpenid: that.data.inviteOpenId,
                distributionPrice: that.data.actualSum,
                commissionPrice: that.data.commission_price,
                goodsName: that.data.order_name,
                buyNickName: app.globalData.nickName,
                buyCode: app.globalData.customerInf.userCode,
                orderNum: that.data.orderNum,
                packageType: that.data.packageType == "2" ? 0 : 1,
            },
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                app.globalData.isTicketOrderPay = that.data.ticket_orderinfo_id,
                    console.log(res, "插入数据库成功");
                    wxpay.pay({
                        di_id: res.data.data,
                        t_o_id: that.data.ticket_orderinfo_id,
                        sm_id: that.data.ticketInfo.setmealid ? that.data.ticketInfo.setmealid : 0,
                        co_id: that.data.ticketInfo.coupon_id ? that.data.ticketInfo.coupon_id : 0,
                        o_n_status: 1,
                        order_num: Number(that.data.orderNum),
                        sub_mch_id: sub_mch_id,
                        body: '请到订单详情查看',
                        out_trade_no: out_trade_no, //订单号
                        order_id: order_id, //1
                        shop_id: shop_id, //2
                        total_fee: total_fee, //支付金额(单位分)
                        openid: openid,
                        profit_sharing: profit_sharing,                        
                        back: res => {
                            if (res.result != 'success') {
                                console.log(res, '不成功'); 
                                return
                            }
                            app.globalData.isTicketOrderPay = that.data.ticket_orderinfo_id,
                                console.log(res, "插入数据库成功");                                

                            if(profit_sharing == 1){                             
                                console.log("进入分销");
                                wxpay.profitSharing({
                                    out_trade_no: out_trade_no, //20位orderCode
                                    sub_mch_id: sub_mch_id,
                                    openid: inviteOpenId, //邀请人的openid
                                    description: '分销奖励',
                                    amount: parseInt(percent_total) * 100, //分销返佣  Number(that.data.commision_price) * 100                                   
                                    back: res => {
                                        if (res.result == 'fail') {
                                            console.log(res, "分销失败")
                                            return
                                        }
                                    }
                                })
                            } 
                            if (that.data.packageType == 3) {
                                wx.request({
                                    url: app.globalData.SavePeopleCoupons_Url,
                                    // url:'http://localhost:8088/evaluation/savePeopleCoupons',
                                    method: 'POST',
                                    data: {
                                        ticket_orderinfo_id: that.data.order_id, //订单主表id
                                        couponsSettingUid: that.data.uuid,
                                        couponName: that.data.ticketInfo.coupon_name, //优惠名称
                                        denomination: that.data.ticketInfo.coupon_facevalue, //面额
                                        couponNum: that.data.orderNum, //数量
                                        customerId: app.globalData.customerInf.id, //顾客id
                                        shopId: that.data.shop_id, //店铺id
                                        totalAmount: Number(that.data.ticketInfo.coupon_facevalue) * Number(that.data.orderNum), //总金额
                                        effectiveDay: that.data.ticketInfo.period_of_validity, //有效天数
                                        effectiveStartDate: util.formatTimeTwo(that.data.ticketInfo.coupon_validitystar, 'Y-M-D h:m:s'),
                                        effectiveEndDate: util.formatTimeTwo(that.data.ticketInfo.coupon_validityend, 'Y-M-D h:m:s'),
                                        obtainWay: 1, //获取方式  0-充值赠送
                                        couponsType: 0, //类别 0-优惠券 1-代金券
                                        customerPhone: app.globalData.customerInf.phone,
                                    },
                                    success: res => {
                                        console.log(res.data, '1-优惠券管理信息新增成功 0-失败');
                                    }
                                })
                            }          
            
                            wx.navigateBack({
                                delta: 0,
                            })
            
                        }
                    })
                // wx.request({
                //     url: app.globalData.updateTicketOrderNewStatus,
                //     data: {
                //         orderId: that.data.ticket_orderinfo_id,
                //         status: 1
                //     },
                //     success: res => {
                //         console.log("订单状态改变成功");
                //     }
                // })

                // //memberInfo表记录首次消费时间
                // wx.request({
                //     url: app.globalData.updateFirstConsumeOfMemberInfo,
                //     data: {
                //         shopId: that.data.shop_id,
                //         phone: app.globalData.customerInf.phone,
                //     },
                // })
            }
        })
    },

    // selectBindCustomerRecordPay:function(pay_url,out_trade_no,sub_mch_id,percent_total){
    //   console.log("进入:selectBindCustomerRecordPay");
    //   var that=this;
    //   wx.request({
    //     url: pay_url,
    //     // url:'http://localhost:8088/evaluation/savePeopleCoupons',
    //     method: 'GET',
    //     data: {
    //     },
    //     success: res => {
    //       console.log("selectBindCustomerRecordPay调用成功")
    //       console.log(res);

    //        if(res.data.code==1000){
    //         let inviteOpenId=res.data.data;
    //         that.wxProfitSharing(out_trade_no,sub_mch_id,inviteOpenId,percent_total);
    //        }
    //     }
    // })
    // },

    // wxProfitSharing:function(out_trade_no,sub_mch_id,inviteOpenId,percent_total){
    //     console.log("进入分销");
    //     console.log("out_trade_no:"+out_trade_no);
    //     console.log("sub_mch_id:"+sub_mch_id);
    //     console.log("openid:"+inviteOpenId);
        
    //     percent_total=percent_total*100;
    //     percent_total=parseInt(percent_total);

    //     console.log("percent_total："+percent_total);     

    //     wxpay.profitSharing({
    //         out_trade_no: out_trade_no, //20位orderCode
    //         sub_mch_id: sub_mch_id,
    //         openid: inviteOpenId, //邀请人的openid
    //         description: '分销奖励',
    //         amount: percent_total, //分销返佣
    //         back: res => {
    //           console.log("分销返回结果");
    //           console.log(res);
    //             if (res.result == 'fail') {
    //                 console.log(res, "分销失败")
    //                 return
    //             }
    //         }
    //     })
    // },

    SetmealLike: function (e) { //新增方法
        var that = this
        if (that.data.SelectTicketOrderInfoList.ticket_type == 2) {
            wx.request({
                url: app.globalData.taocan.updataSetMeal_url,
                method: 'POST',
                data: {
                    setMealID: that.data.order_id,
                    id: 0
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    console.log(res)
                }
            })
        } else {
            wx.request({
                url: app.globalData.taocan.updataCoupon_url,
                method: 'POST',
                data: {
                    setMealID: that.data.order_id,
                    id: 0
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    console.log(res)
                }
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
    onShow: function () {

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

    }
})