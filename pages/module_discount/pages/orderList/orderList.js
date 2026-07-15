// pages/order_package/order_package.js
const app = getApp();
var time = require('../../../../utils/util.js');
var util = require('../../../../utils/util.js');
Page({

    /**
     * 页面的初始数据
     */
    data: {
        closelineFlesh: false,
        isShowGetAvatar: false, //获取头像和名称授权弹框显示
        showAuthorize: false, //获取手机号授权弹框显示
        ordersList: [],
        package_type: 2,
        package_status: 0,
        user_id: '',
        actionSheetHidden1: true,
        actionSheetHidden: true,
        codeImage: '',
        hexiaoShop: '', //
        hexiaoName: '', //核销弹窗名称
        hexiaoTime: '', //核销弹窗时间
        hexiaoNum: '', //核销弹窗数量
        hexiaoType: '', //核销弹窗单位
        hexiaoMoney: '', //核销弹窗价格
        hexiaoOldMomey: '', //核销弹窗原价
        detailPage: 0, //分页
        detailIsfresh: 0, //是否刷新（0不刷新，1刷新）
        phoneNum: '',
        tel: '', //后来输入的电话号码
        chooseUrl: 'url("https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/appimg/buttonMealBlue_20211201114918.png") no-repeat;',
        // chooseUrl: 'url("https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/appimg/buttonMealYellow_20211201114947.png") no-repeat;',
        unChooseUrl: '#666666',
        // unChooseUrl: 'url("https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/appimg/buttonMealBlue_20211201114918.png") no-repeat;',
        goodsFromGiver: '',
        receivePhone: '',
        receiveName: '',
        goodsPrice: '',
        openid: '',
        union_id: '',
        isAgainReceive: false,
    },
    goToShopIndex() {
        let that = this
        // app.globalData.shopid = e.currentTarget.dataset.shopid
        // app.getManagementDataServlet() //获取店铺设置信息
        wx.redirectTo({
            url: '../../../index/index?shopid=' + that.data.shop_id,
        })
    },

    go_to_order: function (e) {
        var that = this;
        console.log(e)
        // let shop_id = e.currentTarget.dataset.item.shopId
        let orderId = e.currentTarget.dataset.item.orderId
        let sum = e.currentTarget.dataset.item.orderTotal;
        let num = e.currentTarget.dataset.item.detailedCount;
        wx.request({
            url: app.globalData.SelectTicketOrderDetailed_url,
            // url: 'http://localhost:8087/WX Restaurant/SelectTicketOrderDetailed',
            data: {
                "id": '',
                "order_id": orderId
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                if (that.data.package_type === "4") {
                    that.selectshop(res.data.object[0].distribution_uuid, orderId, sum, num)
                } else {
                    that.selectshop(res.data.object[0].ticket_id, orderId, sum, num)
                }
            }
        })
    },

    go_to_list: function (e) {
        var that = this;
        console.log(e.currentTarget.dataset.index);
        let a = e.currentTarget.dataset.index
        wx.navigateTo({
            url: '../superValueOrderDetail/superValueOrderDetail?orderId=' + that.data.ordersList[a].orderId + '&packageIndex=' + that.data.package_type,
        })
        // console.log(e)
        // let item = e.currentTarget.dataset.item.ticketDetails[0].ticketInfo;
        // let id = 0;
        // if(that.data.package_type === "4"){
        //   wx.navigateTo({
        //     url: '../../../module_others/pages/distributionBuy/distributionBuy?shopId=' + item.distribution[0].shopId + '&uuid=' + item.distribution[0].distributionUuid,
        //   })
        // }else{
        //    if(that.data.package_type!=2){
        //   id = 1
        // }
        // wx.navigateTo({
        //   url: '../Package_details/Package_details?id=' + id + '&setMealID=' + item.setmealid + '&ruleID=' + item.ruleid + '&shop_id=' + item.shopId+ '&coupon_id=' + item.coupon_id,
        // })
        // }

    },
    gotoRefund: function (e) {
        var that = this;
        var item = e.currentTarget.dataset.item
        console.log(e)
        wx.navigateTo({
            url: '/pages/module_discount/pages/refund/refund?id=2&orderCode=' + item.orderCode + '&orderName=' + item.orderName + '&orderTotal=' + item.orderTotal + '&shopName=' + item.shopName + '&orderId=' + item.orderId + '&orderInf=' + JSON.stringify(item),
        })

    },
    gotoRefundDetail: function (e) {
        var that = this;
        var item = e.currentTarget.dataset.item
        wx.navigateTo({
            url: '/pages/module_discount/pages/refund_detail/refund_detail?orderCode=' + item.orderCode + '&orderTotal=' + item.orderTotal + '&shopName=' + item.shopName + '&orderName=' + item.orderName + '&order_type=' + 1 + '&orderId=' + item.orderId,
        })
    },
    telInput: function (e) {
        var that = this;
        console.log(e)
        var tel = e.detail.value
        that.setData({
            tel: tel
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
        let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
        var phoneNum = ''
        if (app.globalData.user_phone && app.globalData.user_phone != '' && app.globalData.user_phone != null) {
            phoneNum = app.globalData.user_phone
        }
        if (options != '') {
            if (options.packageIndex != null) {
                let a = 0
                switch (options.packageIndex) {
                    case '0':
                        a = 2;
                        break;
                    case '1':
                        a = 3;
                        break;
                    case '4':
                        a = 4;
                        break;
                }
                this.setData({
                    package_type: a,
                })
            }
            if (options.shop_id) {

                that.setData({
                    shop_id: options.shop_id,
                    shopName: options.shopName,
                    package_type: options.shop_id == 21404 ? 3 : that.data.package_type,
                })
            }
        }
        that.setData({
            // scollyHeigth: windowHeight * 750 / windowWidth - 300,
            union_id: app.globalData.unionID,
            openid: app.globalData.openid,
            phoneNum: phoneNum
        })
        if (options.isFromGiver) {
            let goodsFromGiver = {
                orderNewStatus: options.orderNewStatus,
                isFromGiver: options.isFromGiver,
                giverOpenId: options.giverOpenId,
                detailCode: options.detailCode,
                uuid: options.uuid,
                orderId: options.orderId,
                goodsPrice: options.goodsPrice,
                shopId: options.shopId,
                giverUserId: options.userId,
                packageIndex: options.packageIndex
            }
            that.setData({
                isAgainReceive: true,
                goodsFromGiver: goodsFromGiver,
                shop_id: goodsFromGiver.shopId,
                package_type: goodsFromGiver.packageIndex
            })
        }
        if(options.fromBind){
            that.setData({
                package_type: 3,
                closelineFlesh: false
            })
        }
    },
    //获取unionid
    getUserId(unionId, shopId) {
        var that = this
        wx.showLoading({
            title: '稍等...',
        })
        if (unionId != undefined && unionId != null) {
            wx.request({
                url: app.globalData.UserLogin_url,
                data: {
                    Open_id: unionId,
                    Shop_id: shopId
                },
                success: function (res) {
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    //没注册的进行注册
                    if (res.data.result == null || res.data.result.result == 0) {
                        if (!shopId) {
                            return;
                        }
                        wx.request({
                            url: app.globalData.UserRegistration_url,
                            data: {
                                Head_portrait_img: app.globalData.customerInf.avatarUrl ? app.globalData.customerInf.avatarUrl : 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
                                User_nickname: app.globalData.username ? app.globalData.username : '微信用户',
                                Wx_openid: unionId,
                                Shop_id: shopId
                            },
                            success: function (res) {
                                wx.hideLoading()
                                app.globalData.user_id = res.data.object.user_id
                                that.receiveGoodsFromGiver();
                                wx.setStorage({
                                    key: "user_id",
                                    data: res.data.object.user_id
                                })
                                that.setData({
                                    user_id: res.data.object.user_id
                                },()=>{
                                    // if(that.data.bindInfo){
                                    //     that.giveGiftByBind()
                                    // }
                                })
                            },
                        })
                    } else {
                        app.globalData.user_id = res.data.object[0].user_id
                        that.receiveGoodsFromGiver();
                        that.setData({
                            user_id: res.data.object[0].user_id
                        },()=>{
                            // if(that.data.bindInfo){
                            //     that.giveGiftByBind()
                            // }
                        })

                        wx.setStorage({
                            key: "user_id",
                            data: res.data.object[0].user_id
                        })

                        clearInterval(that.data.timer);
                        // that.updateorderinf(app.globalData.user_id)
                        that.setData({
                            showModalStatus1: false
                        })
                    }
                }
            })
        } else {
            console.log("你的unionId为undefined或null")
            wx.hideLoading({
                success: (res) => {},
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
        var that = this
        wx.showLoading({
            title: '稍等...',
        })

        that.selectUnionID()

        that.setData({
            isfresh: 1,
            detailPage: 0,
            closelineFlesh: false
        })
        //that.selectTicketOrdersByShopId()
        that.toFlesh()

    },

    selectUnionID() {
        var that = this
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
                                    wechatAppId: app.globalData.serverConfig.wechatAppId,
                                    //wsk: app.globalData.wsk,
                                },
                                header: {
                                    'content-type': 'application/json;charset=utf-8' // 默认值
                                },
                                method: 'POST',
                                success: function (res) {
                                    app.globalData.unionID = res.data.data.unionId
                                    app.globalData.openid = res.data.data.openid
                                    app.globalData.isAuthorize = true

                                    that.getCustomerInfo(app.globalData.openid)

                                    wx.hideLoading({
                                        success: (res) => {},
                                    })
                                }
                            })
                        },
                        fail: function (res) {
                            console.log('获取unionId失败，用户未授权')
                            wx.hideLoading({
                                success: (res) => {},
                            })
                        },
                    })
                }
            }
        })
    },
    refused() {
        wx.redirectTo({
            url: '/pages/main/main',
        })
    },

    getCustomerInfo: function (openid) {
        var that = this
        if (openid != null && openid != '') {
            wx.request({
                url: app.globalData.selectCustomerInfByOpenId_url,
                data: {
                    openid: openid
                },
                header: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                success: function (res) {
                    if (res.data != null && res.data != '') { //有记录
                        let customerInf = res.data;
                        app.globalData.customerInf = customerInf;
                        that.setData({
                            union_id: res.data.unionid,
                        })
                        if (that.data.goodsFromGiver) {
                            //判断是否有头像
                            if (!customerInf.name) {
                                that.setData({
                                    isShowGetAvatar: true
                                })
                                return;
                            } else if (!customerInf.phone) { //获取手机号码
                                that.setData({
                                    showAuthorize: true
                                })
                                return;
                            } else {
                                that.selectMember(customerInf.phone, that.data.shop_id, customerInf.userCode, customerInf.name)
                                // 判断是否存在user_id
                                if (!app.globalData.user_id) {
                                    //获取user_id
                                    that.getUserId(res.data.unionid, that.data.goodsFromGiver.shopId)
                                } else {
                                    // 直接接收
                                    that.receiveGoodsFromGiver();
                                }
                            }
                        }

                        // if(that.data.bindInfo){
                        //     //判断是否有头像
                        //     if (!customerInf.name) {
                        //         that.setData({
                        //             isShowGetAvatar: true
                        //         })
                        //         return;
                        //     } else if (!customerInf.phone) { //获取手机号码
                        //         that.setData({
                        //             showAuthorize: true
                        //         })
                        //         return;
                        //     } else {
                        //         that.selectMember(customerInf.phone, that.data.shop_id, customerInf.userCode, customerInf.name)
                        //         // 判断是否存在user_id
                        //         if (!app.globalData.user_id) {
                        //             //获取user_id
                        //             that.getUserId(res.data.unionid, that.data.bindInfo.shop_id)
                        //         } else {
                        //             // 直接赠送
                        //             that.giveGiftByBind();
                        //         }
                        //     }
                        // }

                        // if (that.data.goodsFromGiver.isFromGiver) {
                        //   let goodsFromGiver = that.data.goodsFromGiver
                        //   that.getUserId(app.globalData.unionID, goodsFromGiver.shopId)
                        // }
                    }
                }
            })
        }
    },
    // giveGiftByBind(){
    //     let that = this
    //     if(!that.data.bindInfo){
    //         return;
    //     }
    //     wx.showLoading({
    //       title: '请稍后',
    //     })
    //     wx.request({
    //         url: app.globalData.giveGiftByBind,
    //     //   url: 'http://localhost:8080/evaluation/giveGiftByBind',
    //       data:{
    //           shop_id: that.data.bindInfo.shop_id,
    //           user_id: that.data.user_id,
    //           user_name: app.globalData.customerInf.name,
    //           telephone: app.globalData.customerInf.phone,
    //       },
    //       method: 'POST',
    //       success: res=>{
    //         wx.hideLoading()
    //         that.setData({
    //             closelineFlesh: false,
    //             package_type: 3
    //         })
    //         that.selectTicketOrdersByShopId()
    //       }
    //     })
    // },
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
                            shop_id: that.data.goodsFromGiver.shopId,
                        },
                        success: res => {}
                    })
                } else {
                    that.modifyMemberInfo(res1.data.object[0].ID, app.globalData.openid, app.globalData.unionID, userCode, nickname)
                }
            }
        })
    },

    //获取手机号码
    getPhoneNumber(e) {
        let that = this
        //获取手机号码
        wx.login({
            success: function (res) {
                if (res.code) {
                    let code = res.code
                    //获取手机号码
                    wx.request({
                        url: app.globalData.allUrl.getPhone,
                        data: {
                            code: code,
                            encryptedData: e.detail.encryptedData,
                            iv: e.detail.iv,
                            wechatAppId: app.globalData.serverConfig.wechatAppId,
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
                                }, () => {
                                    //判断是否有user_id
                                    if (!app.globalData.user_id) {
                                        that.getUserId(that.data.union_id, that.data.goodsFromGiver.shopId)
                                    } else {
                                        //直接接收
                                        that.receiveGoodsFromGiver();
                                        // if(that.data.bindInfo){
                                        //     that.giveGiftByBind()
                                        // }
                                    }
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

                                //通过openid更新用户信息
                                wx.request({
                                    url: app.globalData.UpdateCustomerByOpenId_Url,
                                    data: JSON.stringify(data),
                                    method: 'POST',
                                    success: res2 => {
                                        //查询用户信息
                                        let nickname = app.globalData.username ? app.globalData.username : app.globalData.customerInf.name
                                        that.selectMember(app.globalData.user_phone, that.data.goodsFromGiver.shopId, app.globalData.customerInf.userCode, nickname)
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
    refreshAvatar() {
        this.getUserInfo()
    },
    getUserInfo(e) {
        let that = this;
        that.setData({
            isShowGetAvatar: false
        })
        //获取手机号码
        if (!app.globalData.customerInf.phone) {
            that.setData({
                showAuthorize: true
            })
            return;
        } else {
            // 判断是否存在user_id
            if (!app.globalData.user_id) {
                //获取user_id
                that.getUserId(app.globalData.customerInf.unionid, that.data.goodsFromGiver.shopId)
            } else {
                // 直接接收
                that.receiveGoodsFromGiver();
                // if(that.data.bindInfo){
                //     that.giveGiftByBind()
                // }
            }
        }

    },

    receiveGoodsFromGiver() {
        let that = this;
        let a = app.globalData.customerInf

        if (!that.data.isAgainReceive) {
            return;
        }

        wx.request({
            url: app.globalData.selectOrderBelongUser,
            data: {
                uuid: that.data.goodsFromGiver.uuid,
                orderId: that.data.goodsFromGiver.orderId,
                userId: that.data.goodsFromGiver.giverUserId,
            },
            success: res => {
                if (res.data.code == 1) {
                    if (that.data.goodsFromGiver.giverOpenId == app.globalData.openid) {
                        wx.showModal({
                            title: '提示',
                            content: '已赠送,等待对方接收!',
                            showCancel: false
                        })
                        that.setData({
                            isfresh: 1,
                            isAgainReceive: false
                        })
                        that.selectTicketOrdersByShopId()
                        return;
                    }

                    wx.request({
                        url: app.globalData.giveGoods,
                        // url: 'http://192.168.8.18:8088/evaluation/giveGoods',
                        method: 'GET',
                        header: {
                            'content-type': 'application/json'
                        },
                        data: {
                            detailCode: that.data.goodsFromGiver.detailCode,
                            orderNewStatus: that.data.goodsFromGiver.orderNewStatus,
                            orderDetailUuid: that.data.goodsFromGiver.uuid,
                            orderId: that.data.goodsFromGiver.orderId,
                            userId: app.globalData.user_id,
                            orderAmount: that.data.goodsFromGiver.goodsPrice,
                            nickName: app.globalData.username ? app.globalData.username : app.globalData.customerInf.name,
                            phone: app.globalData.user_phone ? app.globalData.user_phone : app.globalData.customerInf.phone,
                        },
                        success: res => {
                            if (res.data.result == 1) {
                                wx.showToast({
                                    title: '接收成功',
                                    icon: 'success',
                                })
                                that.setData({
                                    isfresh: 1,
                                    isAgainReceive: false
                                })
                                that.selectTicketOrdersByShopId()
                                that.selectPublicFans()
                            } else {
                                wx.showToast({
                                    title: '接收失败',
                                    icon: 'error',
                                })
                            }
                            wx.hideLoading({
                                success: (res) => {},
                            })
                        },
                        fail: res => {
                            wx.showToast({
                                title: '接收失败',
                                icon: 'error',
                            })
                        }
                    })
                } else {
                    if (that.data.goodsFromGiver.giverOpenId == app.globalData.openid) {
                        wx.showModal({
                            title: '提示',
                            content: '该赠送已被接收',
                            showCancel: false,
                        })
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '该券已接收',
                            showCancel: false,
                        })
                    }
                    that.setData({
                        isfresh: 1,
                        isAgainReceive: false
                    })
                    that.selectTicketOrdersByShopId()
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
                        shopId: that.data.goodsFromGiver.shopId,
                        customerId: app.globalData.customerInf.id,
                        focusId: isFocus == 0 ? '00000000-0000-0000-0000-000000000000' : res.data.list.focusId,
                        fansSource: '',
                        nickName: app.globalData.username ? app.globalData.username : app.globalData.customerInf.name,
                        isFocus: isFocus,
                        fansSex: app.globalData.customerInf.gender == "未知" ? 0 : app.globalData.customerInf.gender == "男" ? 1 : 2,
                        unionId: app.globalData.unionID,
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
    toOrderDetail: function (e) {
        this.setData({
            toFlesh: 0
        }, () => {
            wx.navigateTo({
                url: '../orderDetail_package/orderDetail_package?order_id=' + e.currentTarget.dataset.orderid
            })
        })
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
        console.log(111)
    },

    toFlesh: function () {
        var that = this;
        that.setData({
            closelineFlesh: false,
            detailPage: 0,
            ordersList: [],
        })
        that.selectTicketOrdersByShopId()
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
    //下拉刷新
    lineFlesh: function (e) {
        var that = this
        if (!that.data.closelineFlesh) {
            var detailPage = that.data.detailPage + 1
            that.setData({
                detailPage: detailPage,
                detailIsfresh: 1
            })
            that.selectTicketOrdersByShopId()
        }
    },

    pingjia: function (e) {
        var that = this;
        var shop_id = e.currentTarget.dataset.item.shopId
        wx.request({
            url: app.globalData.SelectShopDetails_url,
            data: {
                shop_id: shop_id
            },
            success: function (res) {
                console.log(res)
                that.setData({
                    shopdetail: res.data[0],
                    topimage: res.data[0].shop_img
                })
                app.globalData.shopdetail = res.data[0]
                wx.navigateTo({
                    url: '../../../module_others/pages/evaluation/evaluation'
                })
            }
        })
    },

    // tapp: function (e) {
    //   var that = this
    //   console.log("执行订单跳转")
    //   var orderinf = e.currentTarget.dataset.orderinf
    //   if (orderinf.orderStatus == 1) {
    //     setTimeout(function () {
    //       wx.request({
    //         url: app.globalData.SelectTicketOrderDetailed_url,
    //         data: {
    //           "id": "",
    //           "order_id": orderinf.orderId
    //         },
    //         header: {
    //           'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
    //         },
    //         method: 'POST',
    //         success: function (res) {
    //           if (orderinf.ticketType == 2) {
    //             wx.navigateTo({
    //               url: '../orderList_detail/orderList_detail?id=0&setMealID=' + res.data.object[0].ticket_id + '&order_id=' + orderinf.orderId,
    //             })
    //           } else {
    //             wx.navigateTo({
    //               url: '../orderList_detail/orderList_detail?id=1&setMealID=' + res.data.object[0].ticket_id + '&order_id=' + orderinf.orderId,
    //             })
    //           }
    //         }
    //       })
    //     })

    //   } else {
    //     wx.showModal({
    //       title: '提示',
    //       content: '订单未支付无法跳转',
    //       success(res) {
    //         if (res.confirm) {
    //           console.log('用户点击确定')
    //         } else if (res.cancel) {
    //           console.log('用户点击取消')
    //         }
    //       }
    //     })
    //   }
    // },

    switchCategory: function (e) {
        var that = this
        var category = e.currentTarget.dataset.category
        that.setData({
            package_type: category,
            ordersList: [],
            detailPage: 0,
            closelineFlesh: false,
            package_status: 0,
            isfresh: 1,
        })
        that.selectTicketOrdersByShopId()
    },
    switchState: function (e) {
        var that = this
        var state = e.currentTarget.dataset.state
        that.setData({
            ordersList: [],
            detailPage: 0,
            closelineFlesh: false,
            package_status: state,
            isfresh: 1
        })
        that.selectTicketOrdersByShopId()
    },

    gopay: function (e) {
        var that = this;
        var orderinf = e.currentTarget.dataset.orderinf
        console.log(orderinf, "支付商品的信息");
        let goodsUuid = that.data.package_type == 2 ? orderinf.ticketDetails[0].ticketInfo.uuid : orderinf.ticketDetails[0].ticketInfo.coupon_uuid
        
       
        wx.navigateTo({
            url: '../pay1/pay1?order_code=' + orderinf.orderCode + '&order_name=' + orderinf.orderName + '&actualSum=' +
                orderinf.orderTotal * 0.01 + '&shop_id=' + orderinf.shopId + '&order_id=' + orderinf.orderId + '&openId=' +
                that.data.openid + '&shopName=' + orderinf.shopName + '&inviteOpenId=' + orderinf.inviteOpenId + '&ticket_orderinfo_id=' +
                orderinf.orderId + '&package_type=' + that.data.package_type + '&commissionPrice=' + orderinf.ticketDetails[0].ticketInfo.commission_price +
                '&uuid=' + goodsUuid + '&orderNum=' + orderinf.detailedCount + '&packageType=' + that.data.package_type + "&ticketInfo=" + JSON.stringify(orderinf.ticketDetails[0].ticketInfo),
        })
        // wx.request({ //获取店铺信息，名称地址等,虽然不知道干嘛的，但是删掉，订单部分会报错
        //   url: app.globalData.ManagementGetDataServlet_url,
        //   data: {
        //     // shop_id: that.globalData.shop_id, //店铺 id
        //     shop_id: orderinf.shopId //店铺 id
        //   },
        //   header: {
        //     'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
        //   },
        //   method: 'POST',
        //   success(res) {
        //     if (res.data != null) {
        //       var managementData = res.data
        //       console.log("获取店铺的管理信息")
        //       wx.request({
        //         url:  app.globalData.taocan.selectSetmeal_url,
        //         // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectSetmeal',
        //         method: 'POST',
        //         data: {
        //           setMealID:orderinf.ticketDetails[0].ticketInfo.setmealid,
        //           coupon_id:''

        //         },
        //         header: {
        //           'content-type': 'application/json'
        //         },
        //         success: function(res) {
        //          if(res.data.length > 0){

        //           // + '&payment_address=' + payment_address + '&SYB_APPID='+ SYB_APPID + '&cusid='+  cusid+ '&sub_merchants_id='+ sub_merchants_id
        //          }

        //         }
        //       })
        //     }
        //   }
        // })

    },

    // tap: function (e) {
    //   var that = this
    //   this.setData({
    //     index: e.currentTarget.dataset.index
    //   })
    //   wx.navigateTo({
    //     url: '../orderList_detail/orderList_detail?order_id=' + that.data.SelectTicketOrderInfo[that.data.index].order_id,
    //   })
    // },

    again: function (e) {
        var that = this
        var orderinf = e.currentTarget.dataset.orderinf
        var setMealID = orderinf.ticketDetails[0].ticketInfo.setmealid
        let couponId = orderinf.ticketDetails[0].ticketInfo.coupon_id
        that.AgainOrder(setMealID, couponId)
    },

    deleteorder: function (e) {
        var that = this
        var orderinf = e.currentTarget.dataset.orderinf
        wx.showModal({
            title: '提示',
            content: '是否删除该订单',
            success(res) {
                if (res.confirm) {
                    setTimeout(function () {
                        wx.request({
                            url: app.globalData.SelectTicketOrderDetailed_url,
                            // url: 'http://localhost:8087/WX Restaurant/SelectTicketOrderDetailed',
                            data: {
                                "id": "",
                                "order_id": orderinf.orderId
                            },
                            header: {
                                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                            },
                            method: 'POST',
                            success: function (res) {
                                var usetype = ''
                                for (var x of res.data.object) {
                                    if (x.ticket_status == 0) {
                                        usetype = 1
                                    }
                                }
                                that.setData({
                                    usetype: usetype
                                })
                                console.log(usetype)
                                if (usetype == 1) {
                                    wx.request({
                                        url: app.globalData.DeleteTicketOrderInfo_url,
                                        // url: 'http://localhost:8087/WX Restaurant/DeleteTicketOrderInfo',
                                        data: {
                                            "order_id": orderinf.orderId
                                        },
                                        header: {
                                            'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                        },
                                        method: 'POST',
                                        success: function (res) {
                                            that.toFlesh()
                                        }
                                    })
                                } else {
                                    wx.showModal({
                                        title: '提示',
                                        content: '订单未使用不能删除',
                                        success: function (res) {
                                            if (res.confirm) { //这里是点击了确定以后

                                                //   console.log('用户点击确定')
                                            } else { //这里是点击了取消以后
                                                //    console.log('用户点击取消')
                                            }
                                        }
                                    })
                                }
                            }
                        })
                    }, 200)
                } else if (res.cancel) {
                    console.log('用户点击取消')
                }
            }
        })
    },



    // 查询当日套餐订单
    // 超值套餐/菜品 超值代金券
    // 全部、代付款、待使用、待评价、退款/售后
    // package_type 订单类型： 票券类别:2-超值套餐，1-优惠券，3-代金券 4-分销
    // package_status 订单状态： 全部 -0、代付款 -1、待使用 -2、待评价 -3、退款/售后 -4
    selectTicketOrdersByShopId: function () {
        var that = this
        if (that.data.closelineFlesh) {
            return;
        }
        wx.showLoading({
            title: '请稍后',
        })
        wx.request({
            url: app.globalData.selectTicketOrdersByUnionId_url,
            //url: "http://localhost:8080/evaluation_war/selectTicketOrdersByUnionId",
            data: {
                union_id: that.data.union_id,
                package_type: that.data.package_type,
                package_status: that.data.package_status,
                pages: that.data.detailPage,
                shop_id: that.data.shop_id == undefined || that.data.shop_id == '' || that.data.shop_id == null ? '' : that.data.shop_id,
                isfresh: that.data.detailIsfresh
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
                if (res.data.result != 'fail') {
                    wx.hideLoading()
                    var ordersList = res.data.data

                    for (var i = 0; i < ordersList.length; i++) {
                        if (app.globalData.isTicketOrderPay) {
                            if (ordersList[i].orderId == app.globalData.isTicketOrderPay) {
                                ordersList[i].orderNewStatus = 1
                                app.globalData.isTicketOrderPay = ''
                            }
                        }

                        //初始时间
                        ordersList[i].ticketDetails[0].ticketInfo.starttime = time.formatTimeTwo(ordersList[i].ticketDetails[0].ticketInfo.starttime, 'Y-M-D')
                        //结束时间
                        ordersList[i].ticketDetails[0].ticketInfo.endtime = time.formatTimeTwo(ordersList[i].ticketDetails[0].ticketInfo.endtime, 'Y-M-D')
                        //下单时间
                        ordersList[i].createDate = time.formatTimeTwo(ordersList[i].createDate, 'Y-M-D h:m:s')
                        if (ordersList[i].ticketDetails[0].orderDetail.appointmentTime != null) {
                            ordersList[i].ticketDetails[0].orderDetail.appointmentTime = time.formatTimeTwo(ordersList[i].ticketDetails[0].orderDetail.appointmentTime, 'Y-M-D h:m:s')
                        }
                    }
                    if (ordersList.length < 10) {
                        //停止刷新
                        that.setData({
                            closelineFlesh: true
                        })
                    }
                    let list = that.data.ordersList
                    list = list.concat(ordersList)
                    that.setData({
                        ordersList: list,
                    })
                    //   if (that.data.isfresh == 0) {
                    //     //加载
                    //     var list = that.data.ordersList
                    //     for (var a = 0; a < ordersList.length; a++) {
                    //       list.push(ordersList[a])
                    //     }
                    //     console.log(list)
                    //     that.setData({
                    //       ordersList: list,
                    //       isfresh: 0
                    //     })
                    //   } else if (that.data.isfresh == 1) {
                    //     //刷新
                    //     that.setData({
                    //       ordersList: ordersList,
                    //       isfresh: 0
                    //     })
                    //   }
                    // console.log(ordersList)
                    wx.hideLoading({
                        success: (res) => {},
                    })
                } else {
                    wx.hideLoading()
                }
            },
            fail: function (res) {
                wx.hideLoading()
            }
        })
    },
    // 订单详情
    selectshop: function (setMealID, orderId, sum, num) {
        var that = this
        if (that.data.package_type === "4") {
            wx.request({
                url: app.globalData.getSettingList,
                // url: 'http://192.168.8.5:8088/evaluation/getSettingList',
                data: {
                    uuid: setMealID
                },
                success: res => {
                    app.getManagementDataServlet(res.data[0].shop_id)
                    app.globalData.orderListJump = true

                    wx.navigateTo({
                        url: '../order/order?distribution=1&distributionFoodInfo=' + JSON.stringify(res.data) + '&shop_id=' + res.data[0].shopId + '&orderListCome=' + 'true' + '&orderListId=' + orderId + '&OLSum=' + sum + '&OLNum=' + num,
                    })
                }
            })

        } else {
            wx.request({
                url: app.globalData.taocan.selectSetmeal_url,
                // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectSetmeal',
                method: 'POST',
                data: {
                    setMealID: setMealID,
                    coupon_id: ''

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
                        shop: shop,
                        SYB_APPID: SYB_APPID,
                        cusid: cusid,
                        sub_merchants_id: sub_merchants_id
                    })
                    app.getManagementDataServlet(res.data[0].shop_id)
                    app.globalData.orderListJump = true
                    wx.navigateTo({
                        url: '../order/order?setMealID=' + setMealID + '&id=' + 0 + '&shop_id=' + res.data[0].shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&orderListCome=' + 'true' + '&orderListId=' + orderId + '&OLSum=' + sum + '&OLNum=' + num
                    })
                }
            })
        }

    },
    //再来一单
    AgainOrder: function (setMealID, couponId) {
        var that = this
        wx.request({
            url: app.globalData.taocan.selectSetmeal_url,
            // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectSetmeal',
            method: 'POST',
            data: {
                setMealID: setMealID,
                coupon_id: couponId

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
                    shop: shop,
                    SYB_APPID: SYB_APPID,
                    cusid: cusid,
                    sub_merchants_id: sub_merchants_id
                })
                app.getManagementDataServlet(res.data[0].shop_id)
                app.globalData.orderListJump = true
                if (that.data.package_type == 2) {
                    wx.navigateTo({
                        url: '../order/order?setMealID=' + setMealID + '&id=' + 0 + '&shop_id=' + res.data[0].shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id
                    })
                } else {
                    wx.navigateTo({
                        url: '../order/order?coupon_id=' + couponId + '&id=' + 1 + '&shop_id=' + res.data[0].shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id
                    })
                }


            }
        })
    },
    getcode: function (e) {
        var that = this;
        var item = e.currentTarget.dataset.orderinf
        var index = e.currentTarget.dataset.index
        var path = "pages/index/index?id=" + item.ticketDetails[0].orderDetail.id + '&order_id=' + item.ticketDetails[0].orderDetail.orderId + '&shop_id=' + item.shopId
        if (that.data.ordersList[index].ministerTakesOrdersRecord != null) {
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
        } else {
            wx.showModal({
                title: '提示',
                content: '需要部长先接单才能核销'
            })
        }
    },
    modalChange: function (e) {
        var that = this;
        that.setData({
            actionSheetHidden1: true
        })
        var codeImage = that.data.codeImage
        codeImage = codeImage.split('fsmbdlkj.com/')[1]
        console.log(codeImage)

        wx.request({
            url: app.globalData.ClearFile_url,
            data: {
                pageUrl: codeImage
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                that.toFlesh()
            }
        })
    },

    changelike: function (e) {
        var that = this;
        var item = e.currentTarget.dataset.item
        var praiseFlag = e.currentTarget.dataset.praiseflag
        var index = e.currentTarget.dataset.index
        var ordersList = that.data.ordersList
        //判断当前praiseFlag的状态，进行接口调用
        if (!praiseFlag) { //触发点赞方法
            wx.request({
                // url: 'http://localhost:8088/evaluation/updateSetMealGood',
                url: app.globalData.updateSetMealGood,
                data: {
                    isCombo: that.data.package_type == 2 ? 1 : 0,
                    bindId: that.data.package_type == 2 ? item.ticketDetails[0].ticketInfo.setmealid : item.ticketDetails[0].ticketInfo.coupon_id,
                    isLike: 1,
                    orderId: item.orderId
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    console.log(res)
                    if (res.data.code == 1) {
                        ordersList[index].ticketDetails[0].orderDetail[0].praiseFlag = 1
                        that.setData({
                            ordersList: ordersList
                        })
                    }
                }
            })
        } else if (praiseFlag == 1) {
            wx.request({
                // url: 'http://localhost:8088/evaluation/updateSetMealGood',
                url: app.globalData.updateSetMealGood,
                data: {
                    isCombo: that.data.package_type == 2 ? 1 : 0,
                    bindId: that.data.package_type == 2 ? item.ticketDetails[0].ticketInfo.setmealid : item.ticketDetails[0].ticketInfo.coupon_id,
                    isLike: 0,
                    orderId: item.orderId
                },
                header: {
                    'content-type': 'application/json'
                },
                success: function (res) {
                    console.log(res)
                    if (res.data.code == 1) {
                        ordersList[index].ticketDetails[0].orderDetail[0].praiseFlag = 0
                        that.setData({
                            ordersList: ordersList
                        })
                    }
                }
            })
        }

        //更改当前praiseFlag的状态
    },
    gotoCustomerAddressList:function(){
      wx.navigateTo({
        url: '../customeraddresslist/customeraddresslist',
      })
    },
    
})