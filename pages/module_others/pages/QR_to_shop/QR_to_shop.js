// pages/module_others/pages/QR_to_shop/QR_to_shop.js


const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(options.q)
        if (options.q) {
            let url = decodeURIComponent(options.q)
            console.log(url, 666666666666666666)
            if (url.indexOf('https://') != -1 && url.indexOf('?uuid=') != -1) {
                if (url.indexOf(app.globalData.QRCodeUrl) != -1) {
                    let a = url.substring(url.indexOf('?') + 6)
                    wx.request({
                        url: app.globalData.getOneQrUuid,
                        // url: 'http://192.168.8.163:8083/evaluation_war/getOneQrUuid',
                        data: {
                            qrUuid: a
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: res => {
                            console.log(res)
                            let shopid = res.data.data.miniProgram.split('=')[1]
                            // wx.navigateTo({
                            //     url: '/' + res.data.data.miniProgram,
                            // })
                            // if (options.shopid) {
                            this.setData({
                                shopid: shopid
                            })
                            this.getshopinf(shopid)
                            // }else{
                            //     wx.navigateBack({
                            //       delta: 0,
                            //     })
                            // }
                        }
                    })
                    // return
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '请扫描' + (res.result.indexOf(app.globalData.QRCodeUrl) != -1 ? '正式服' : '测试服') + '二维码',
                        success(res) {
                            // return
                        }
                    })
                }
            }
        }
        console.log(options)
    },
    // 获取店铺信息
    getshopinf(shop_id) {
        var that = this;
        console.log("获取店铺信息")
        wx.request({
            url: app.globalData.SelectShopDetails_url,
            data: {
                shop_id: shop_id,
            },
            success: function (res) {
                console.log(res.data[0].shop_name);
                if (res.data != '') {
                    that.setData({
                        shopdetail: res.data[0],
                        shopName: res.data[0].shop_name,
                        wifiName: res.data[0].wifiName,
                        wifiPW: res.data[0].wifiPW
                    })
                    app.globalData.shopdetail = res.data[0]
                    app.getManagementDataServlet(shop_id)
                    wx.setNavigationBarTitle({
                        title: app.globalData.shopdetail.shop_name
                    })

                } else {
                    wx.showModal({
                        title: '错误',
                        content: '获取店铺信息失败，请重试！',
                    })
                }
            }
        })
    },

    toShop() {
        app.globalData.shopid = this.data.shopid
        wx.navigateTo({
            url: '../../../index/index',
        })
    },

    connectShopWIFI() {
        wx.startWifi({
            success: res => {
                wx.onWifiConnected((result) => {
                    if (!this.data.isConnect) {
                        wx.showLoading({
                            title: '连接中...',
                        })
                        setTimeout(res => {
                            wx.hideLoading({
                                success: (res) => {
                                    wx.showModal({
                                        content: '已成功连接至店铺WIFI[' + this.data.wifiName + ']',
                                        showCancel: false,
                                        success: res => {

                                        }
                                    })
                                },
                            })

                        }, 1000)
                        this.setData({
                            isConnect: true
                        })
                    }
                })
                wx.connectWifi({
                    SSID: this.data.wifiName,
                    password: this.data.wifiPW,
                    success: res => {
                        console.log(res.errMsg)
                        if (res.errCode != 0) {
                            console.log(res)
                            wx.showModal({
                                content: '连接失败，请寻求店员帮助',
                                showCancel: false
                            })
                        }
                    },
                    fail: res => {
                        console.log(res)
                        wx.showModal({
                            content: '连接失败，请寻求店员帮助',
                            showCancel: false
                        })
                    }
                })
            },
            fail: res => {
                wx.showModal({
                    content: '您的设备不支持该功能',
                    showCancel: false
                })
            }
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

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