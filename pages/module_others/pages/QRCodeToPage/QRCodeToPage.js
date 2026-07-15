// pages/module_others/pages/QRCodeToPage/QRCodeToPage.js
const app = getApp()
var checkFocusIntl = null
Page({

    /**
     * 页面的初始数据
     */
    data: {
        navigateToUrl: '',
        isShowGetAvatar: false,
        showAuthorize: false,
        isFirstBind: false,
        bind_type: '',
        bind_shop_id: '',
        bind_customer_id: '',
        bind_staf_id: '',
        bind_meals_type: '',
        bind_meals_id: '',
        bind_person_name: '',
        giftInfo: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log('qrcodetopage: ' + options)
        let a = JSON.parse(options.nostr)       

		var bindUrl='pages/module_discount/pages/Merchandise_details/Merchandise_details?'
		bindUrl+="bind_type="+a.bind_type
        bindUrl+="&shop_id="+a.shop_id
        bindUrl+="&goods_id="+a.goods_id
        bindUrl+="&associate_type="+a.associate_type
        bindUrl+="&associate_id="+a.associate_id           

        console.log(bindUrl);        
        wx.navigateTo({
            url: bindUrl
        })  
        
        //暂时保留~~扫码进入小程序，可能未获取到openid unionid
        app.selectUnionID()

        //绑定的部分继续屏蔽
        // app.getCustomerCallBack = (res) => {         
        //     this.bindCust()
        //     this.checkFocus()            
        //     app.getCustomerCallBack = null
        // }      
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
                            wechatAppId: app.globalData.wechatAppId,
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
                                        that.getUserId(app.globalData.unionID, that.data.bind_shop_id)
                                    } else {
                                        //直接接收
                                        //that.giveGiftByBind()
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
                                        that.selectMember(app.globalData.user_phone, that.data.bind_shop_id, app.globalData.customerInf.userCode, nickname)
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
                                wx.setStorage({
                                    key: "user_id",
                                    data: res.data.object.user_id
                                })
                                that.setData({
                                    user_id: res.data.object.user_id
                                }, () => {
                                    //that.giveGiftByBind()
                                })
                            },
                        })
                    } else {
                        app.globalData.user_id = res.data.object[0].user_id
                        that.setData({
                            user_id: res.data.object[0].user_id
                        }, () => {
                            //that.giveGiftByBind()
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

    refused() {
        wx.redirectTo({
            url: '/pages/main/main',
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
                that.getUserId(app.globalData.customerInf.unionid, that.data.bind_shop_id)
            } else {
                //that.giveGiftByBind()
            }
        }
    },

    //注意：2023-03-09 后台实现，店铺内生成user_id，员工绑定客户，查询赠送表，循环写入ticket_orderInf表。后续可能，再优化
        //注意：因为前端调用逻辑混乱，并且跟绑定客户接口关联太弱，后台接口也有BUG，将相关逻辑在绑定接口中，由后台实现。
    giveGiftByBind() {

        let that = this
        wx.showLoading({
            title: '请稍后',
        })
        // 赠送
        wx.request({
            url: app.globalData.giveGiftByBind,
            // url: 'http://localhost:8080/evaluation/giveGiftByBind',
            data: {
                shop_id: that.data.bind_shop_id,
                user_id: that.data.user_id,
                user_name: app.globalData.customerInf.name,
                telephone: app.globalData.customerInf.phone ? app.globalData.customerInf.phone : that.data.phonenumber,
            },
            method: 'POST',
            success: res => {
                wx.hideLoading()
            },
            fail: res => {
                wx.hideLoading()
            }
        })

    },

    goToStartList(){
        wx.navigateTo({
          url: '/pages/myStarCoin/myStarCoin',
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

    goToOrderList(){
        wx.navigateTo({
          url: '../../../module_discount/pages/orderList/orderList?fromBind=1',
        })
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    toPage() {
        wx.navigateTo({
            url: this.data.navigateToUrl,
        })
    },

    bindCust() {
        let that = this
        if (that.data.bind_customer_id) {
            // 朋友互绑
            wx.request({
                url: app.globalData.insertBindCustomerRecord,
                data: {
                    customer_name: app.globalData.customerInf.name,
                    customer_code: app.globalData.customerInf.userCode,
                    bind_person_name: that.data.bind_person_name,
                    shop_id: that.data.bind_shop_id,
                    bind_type: that.data.bind_type,
                    bind_person_type: 2,
                    bind_person_id: that.data.bind_customer_id,
                    customer_id: app.globalData.customerInf.id,
                    meals_id: that.data.bind_meals_id,
                    meals_type: that.data.bind_meals_type,
                    customer_unionId: app.globalData.customerInf.unionid,
                },
                method: 'POST',
                header: {
                    'content-type': 'application/json' // 默认值
                },
                success: res => {
                    if (res.data.data.isFirstBind) {
                        that.setData({
                            isFirstBind: true
                        })
                    }               
                    
                    console.log('BindCustomer还在进行中吗，成功了！')            
                }
            })
        } else if (that.data.bind_staf_id)(
            // 部长绑定
            wx.request({
                url: app.globalData.insertBindCustomerRecord,
                //url: 'http://localhost:8083/evaluation/insertBindCustomerRecord',
                data: {

                    customer_name: app.globalData.customerInf.name,
                    customer_code: app.globalData.customerInf.userCode,
                    bind_person_name: that.data.bind_person_name,
                    shop_id: parseInt(that.data.bind_shop_id),
                    bind_type: that.data.bind_type,
                    bind_person_type: 1,
                    bind_person_id: that.data.bind_staf_id,
                    customer_id: app.globalData.customerInf.id,
                    meals_id: that.data.bind_meals_id,
                    meals_type: that.data.bind_meals_type,
                    customer_unionId: app.globalData.unionID,
                },
                method: 'POST',
                header: {
                    'content-type': 'application/json' // 默认值
                }, 
                success: res => {
                    this.setData({
                        navigateToUrl: '/pages/module_discount/pages/Package_details/Package_details?bind_type=3&bind_shop_id=' + that.data.bind_shop_id + '&bind_staf_id=' + that.data.bind_staf_id + '&bind_meals_type=' + that.data.bind_meals_type + '&bind_meals_id=' + that.data.bind_meals_id
                    })
                    if (res.data.data.isFirstBind) {
                        wx.request({
                            url: app.globalData.getBindFacePrice,                       
                            data:{
                                shop_id: that.data.bind_shop_id
                            },
                            success: res=>{
                                if(res.data.code == 1){
                                    that.setData({
                                        giftInfo: res.data.data,
                                    })
                                }
                            }
                        })
                        that.setData({
                            isFirstBind: true,
                        })
                        //判断是否有头像
                        if (!app.globalData.customerInf.name) {
                            that.setData({
                                isShowGetAvatar: true
                            })
                            return;
                        } else if (!app.globalData.customerInf.phone) { //获取手机号码
                            that.setData({
                                showAuthorize: true
                            })
                            return;
                        } else {
                            that.selectMember(app.globalData.customerInf.phone, that.data.bind_shop_id, app.globalData.customerInf.userCode, app.globalData.customerInf.name)
                            // 判断是否存在user_id
                            if (!app.globalData.user_id) {
                                //获取user_id
                                that.getUserId(app.globalData.unionID, that.data.bind_shop_id)
                            } else {
                                // 直接赠送
                                that.giveGiftByBind();
                            }
                        }
                    }


                }
            })
        )
    },

    checkFocus() {
        let that = this
        checkFocusIntl = setInterval(res => {
            wx.request({
                url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
                data: {
                    unionId: app.globalData.unionID
                },
                success: res => {
                    this.setData({
                        isFocus: res.data.list != null && res.data.list != "" && res.data.list.isFocus != '0'
                    }, () => {
                        if (that.focusCB) {
                            that.focusCB(res.data.list != null && res.data.list != "" && res.data.list.isFocus != '0')
                        }
                    })
                }
            })
        }, 2000)
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        console.log("onShow")
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {
        console.log("onHide")
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
        clearInterval(checkFocusIntl)
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})