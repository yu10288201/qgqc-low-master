var app = getApp()
Page({
    data: {
        canPinListIndex: -1,
        canPinList: [],
        todayData: true,
        
        setMealPageIndex: 0,
        setMealPageSize: 20,
        pageCouponIndex: 0,
        pageCouponSize: 20,
        // 下拉获取时间限制
        isGetSetMealList: true,
        isGetCouponList: false,
	},
	
    onLoad(options) {
        // console.log(app.globalData.shopid)
        //返回块Top
        // console.log(wx.getSystemInfoSync().statusBarHeight)
        //返回块高度
        // console.log(wx.getMenuButtonBoundingClientRect().height + (wx.getMenuButtonBoundingClientRect().top - wx.getSystemInfoSync().statusBarHeight) * 2)
        let that = this
        that.setData({
            return_out_top: wx.getSystemInfoSync().statusBarHeight,
            return_out_height: (wx.getMenuButtonBoundingClientRect().height + (wx.getMenuButtonBoundingClientRect().top - wx.getSystemInfoSync().statusBarHeight) * 2),
        })

	},
	
    toBindingCustomerDetail() {
        wx.navigateTo({
            url: '../BindingCustomerDetail/BindingCustomerDetail',
        })
	},
	
    changeToadyData(e) {
        let that = this
        let id = e.currentTarget.dataset.id
        that.setData({
            todayData: id == 0,
        }, () => {
            that.getBindCustomerRecordCount()
        })
	},
	
    getBindCustomerRecordCount() {
        let that = this
        wx.showLoading({
            title: '请稍后',
        })
        wx.request({
            url: app.globalData.selectBindCustomerRecordCount_Customer,
            // url: 'http://localhost:8080/evaluation/selectBindCustomerRecordCount_Customer',
            data: {
                shop_id: app.globalData.shopdetail.shop_id,
                main_customer_unionId: app.globalData.unionID,
                query_date_type: that.data.todayData ? 1 : 2,
            },
            success: res => {
                // console.log(res)
                if (res.data.code == 1000) {
                    that.setData({
                        saleDataInf: res.data.data
                    })
                    wx.hideLoading()
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '网络异常',
                        showCancel: false,
                    })
                    wx.hideLoading()
                }
            },
            fail: res => {
                wx.showModal({
                    title: '提示',
                    content: '网络异常',
                    showCancel: false,
                })
                wx.hideLoading()
            }
        })
	},
	
    bindscrolltolower_setmeal() {
        let that = this
        if (that.data.isGetSetMealList) {
            that.setData({
                setMealPageIndex: Number(that.data.setMealPageIndex) + Number(that.data.setMealPageSize)
            }, () => {
                that.getSetMealList()
            })
        } else if (that.data.isGetCouponList) {
            that.setData({
                pageCouponIndex: Number(that.data.pageCouponIndex) + Number(that.data.pageCouponSize)
            }, () => {
                that.getCouponList()
            })
        }

    },
    getSetMealList() {
        let that = this
        that.setData({
            isGetSetMealList: false
        })
        wx.request({
            url: app.globalData.selectAllSetMealInfo_url,
            data: {
                shopId: app.globalData.shopdetail.shop_id,
                typeForSetMeal: '',
                pageIndex: that.data.setMealPageIndex,
                pageSize: that.data.setMealPageSize,
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                if (res.data.result == 1) {
                    let resList = res.data.selectResult
                    if (resList.length > 0) {
                        if (resList.length >= that.data.setMealPageSize) {
                            that.setData({
                                isGetSetMealList: true
                            })
                        }
                        let canPinList = that.data.canPinList
                        let a = []
                        a = a.concat(resList)
                        a = a.concat(canPinList)
                        that.setData({
                            canPinList: a
                        })
                    } else {
                        that.setData({
                            isGetCouponList: true
                        })
                    }
                } else {
                    // 获取优惠券
                    that.getCouponList()
                }
            }
        })
    },
    getCouponList() {
        let that = this
        that.setData({
            isGetCouponList: false
        })
        wx.request({
            url: app.globalData.getCouponAllPage_url,
            data: {
                shopId: app.globalData.shopdetail.shop_id,
                pageSize: that.data.pageCouponSize,
                pageIndex: that.data.pageCouponIndex,
            },
            success: res => {
                if (res.data.code == 1) {
                    if (res.data.paramsList.length > 0) {
                        if (res.data.paramsList.length >= that.data.pageCouponSize) {
                            that.setData({
                                isGetCouponList: true
                            })
                        }
                        let resList = res.data.paramsList
                        let canPinList = that.data.canPinList
                        let a = []
                        a = a.concat(resList)
                        a = a.concat(canPinList)
                        that.setData({
                            canPinList: a
                        })
                    }
                }
            }
        })
    },
    onShow() {
        let that = this
        // 查询是否注册
        that.checkRegister()
        // 查询是否关注
        that.checkFocus()
        // 查询绑定数据
        that.getBindCustomerRecordCount()

        that.setData({
            canPinList: [],
            isGetSetMealList: true,
            isGetCouponList: false
        })
        // 查询套餐，优惠券
        that.getSetMealList()
        that.getCouponList()

    },
    toFriBindRule() {

	},
	
    toHelp() {
        wx.navigateTo({
            url: '/pages/help/help',
        })
	},
	
    returnBack() {
        wx.navigateBack({
            delta: 0,
        })
	},
	
    showQRCode() {
        if (!this.data.isFocus) {
            wx.showModal({
                content: '您尚未关注"切瓜切菜"公众号\n无法绑定朋友',
                cancelText: '返回页面',
                confirmText: '前往关注',
                success: res => {
                    if (res.confirm) {
                        wx.request({ //发送信息临时表
                            url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addLink',
                            data: {
                                unionId: app.globalData.unionID,
                                title: "点击这里回到小程序",
                                link: ""
                            },
                            method: 'GET',
                            success(res) {
                                wx.navigateTo({
                                    url: '/pages/module_others/pages/wxPublic/out',
                                })
                            }
                        })
                    }
                }
            })
            return;
        }

        if (!this.data.isRegister) {
            wx.showModal({
                content: '您尚未注册"切瓜切菜"平台账号\n无法绑定朋友',
                cancelText: '返回页面',
                confirmText: '前往注册',
                success: res => {
                    if (res.confirm) {
                        wx.navigateTo({
                            url: '/pages/module_others/pages/register/register?eat=1&openId=' + app.globalData.openid + '&unionId=' + app.globalData.unionID,
                        })
                    }
                }
            })
            return;
        }

        if (this.data.canPinListIndex == -1) {
            wx.showModal({
                content: '请先选择绑定餐品',
                showCancel: false,
            })
            return;
        }
        this.setData({
            showDishesDetail: true,
        }, () => {
            wx.showLoading({
                title: '生成中...',
            })
        })
        let qrt = "https://mb.fsmbdlkj.com/QRCode/?bind_type=3" + "&bind_shop_id=" + app.globalData.shopid + "&bind_customer_id=" + app.globalData.customerInf.id + "&bind_meals_type=" + (this.data.canPinList[this.data.canPinListIndex].coupon_id ? 3 : 2) + "&bind_meals_id=" + (this.data.canPinList[this.data.canPinListIndex].coupon_id ? this.data.canPinList[this.data.canPinListIndex].coupon_id : this.data.canPinList[this.data.canPinListIndex].setMealID) + '&bind_person_name=' + app.globalData.customerInf.name
        console.log(qrt)
        wx.downloadFile({
            url: app.getServerUrl()+'/IMG/%E5%88%87%E7%93%9C%E5%88%87%E8%8F%9C/logo.png',
            success: res => {
                console.log(res.tempFilePath)
                require('../../../../utils/qrcode.min.atim.js')({
                    width: 200,
                    height: 200,
                    x: 0,
                    y: 0,
                    canvasId: 'myQrcode',
                    typeNumber: 13,
                    text: qrt,
                    image: {
                        imageResource: res.tempFilePath,
                        dx: 70,
                        dy: 70,
                        dWidth: 60,
                        dHeight: 60
                    },
                    callback(e) {
                        console.log('e: ', e)
                        wx.hideLoading({
                            success: (res) => {},
                        })
                    }
                })
            }
        })
    },
    offalert() {
        this.setData({
            showDishesDetail: false
        }, () => {
            this.onShow()
        })
    },

    selectCanPin(e) {
        console.log(e)
        let cpli = this.data.canPinListIndex
        let si = e.currentTarget.dataset.index
        this.setData({
            canPinListIndex: cpli == si ? -1 : si,
        })
    },

    checkFocus() {
        wx.request({
            url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
            data: {
                unionId: app.globalData.unionID
            },
            success: res => {
                this.setData({
                    isFocus: res.data.list && res.data.list.isFocus != '0'
                })
            }
        })
    },

    checkRegister() {
        wx.request({
            url: app.globalData.selectCustomerInfByOpenId_url,
            method: 'POST',
            data: {
                openid: app.globalData.openid
            },
            header: {
                'content-type': 'application/json;charset=utf-8' // 默认值
            },
            success: res => {
                this.setData({
                    isRegister: res.data && res.data.signIn != 0
                })
            }
        })
    },
})