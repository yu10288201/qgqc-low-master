// pages/module_others/pages/wxPublic/wxPublic.js
var app = getApp();
var util = require('../../../../utils/util.js');
const sceneValue = wx.getLaunchOptionsSync();
import RMQV3 from '../../../../utils/RMQV3.js';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        showAuthorize: false,
        showAuthorize1: false,
        bindInfo: '',
        shopName: '',
        unionId: '',
        openId: '',
        shopid: '',
        tableid: '',
        checkWxpublic: false,
        getSettingList: [],
        bottomMsg: '马上关注,立享好礼',
        settingContent: '',
        // 2022-03-31 呼叫部长功能属性
        shineb: true,
        shinef: true,
        bzColor: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png',
        fwColor: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png',
        // -----------------end--------------------------------
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let that = this

        if (options.scene) {
            //参数处理
            var parameter = options.scene
            var parameter_arry = parameter.split("_")
            if (parameter_arry[0].search(",") != -1) {
                var arr = parameter_arry[0].split(",")
            } else if (parameter_arry[0].search("%2C") != -1) {
                var arr = parameter_arry[0].split("%2C")
            }
            if (arr != undefined) {
                var shopid = parseInt(arr[1])
                var tableid = parseInt(arr[2])
                that.setData({
                    shopid: shopid,
                    tableid: tableid
                })
            }
            app.globalData.shopid = shopid
            // that.getSettingList(shopid)
            that.getSettingContent(shopid)

            app.getmenu() // 获取菜单 

            // 2022-03-31 添加呼叫部长，服务员功能

            app.globalData.RMQCallBack = (res) => {
                console.log('收到消息', res)
                let msg = res.data
                console.log(msg, "消息内容")
                let a = new Date()
                // if(msg.table_id == app.globalData.locationid){
                if (msg.table_id == tableid) {
                    if (msg.tg == "bz" && msg.msg_id == app.globalData.RMQmsg_id) {
                        clearInterval(app.globalData.cbz)
                        app.globalData.cbz = ''
                        if (msg.msg.text == "部长收到") {
                            console.log("bzzzzzzzzzzzzzzzzz");
                            // wx.showToast({
                            //   title: '部长收到',
                            //   icon: 'success',
                            //   duration: 2000
                            // })
                            clearInterval(that.data.timerb);
                            that.setData({
                                bzColor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                                shineb: true
                            })
                            app.globalData.countDown_minister = false
                            app.globalData.RMQmsg_id = ''
                        }
                    } else if (msg.tg == "fw" && msg.msg_id == app.globalData.RMQmsg_id) {
                        clearInterval(app.globalData.cfw)
                        app.globalData.cfw = ''
                        if (msg.msg.text == "服务员收到") {
                            // wx.showToast({
                            //   title: '服务员收到',
                            //   icon: 'success',
                            //   duration: 2000
                            // })
                            clearInterval(that.data.timerf);
                            that.setData({
                                fwColor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                                shinef: true
                            })
                            app.globalData.countDown_waiter = false
                            app.globalData.RMQmsg_id = ''
                        }
                    }
                }
            }

            var object = {
                "tableId": tableid
            }
            wx.request({ // tableid查询桌位的名字
                url: app.globalData.allUrl.selectTableNameByTableID,
                data: JSON.stringify(object),
                header: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                success: function (res) {
                    if (res.data == '') {
                        wx.showModal({
                            title: '提示',
                            content: '没有找到这张桌子',
                            showCancel: false,
                            success(res) {
                                if (res.confirm) {
                                    //返回到首页
                                    wx.reLaunch({
                                        url: '../../../main/main',
                                    })
                                    console.log('返回首页方法')
                                }
                            }
                        })
                    } else {
                        that.setData({
                            table_name: res.data
                        })
                        app.globalData.locationname = res.data //这里应该还要加上厅的名字
                    }
                }
            })

        }
        if (options.staf_id) {
            // 扫码绑定-------查询顾客是否有昵称和手机号
            let bindInfo = {
                staf_id: options.staf_id,
                shop_id: options.shop_id
            }
            that.setData({
                bindInfo
            })

        }
        that.selectUnionID()
        // ---------------end-------------------------------
    },
    getCustomerInfo() {
        let that = this
        wx.request({
            url: app.globalData.selectCustomerInfByOpenId_url,
            data: {
                openid: that.data.openId,
            },
            method: 'POST',
            success(res2) {
                let customerInfo = res2.data
                if (!customerInfo.name) {
                    // 获取昵称
                    that.setData({
                        showAuthorize1: true
                    })
                    return;
                }
                if (!customerInfo.phone) {
                    // 获取手机号码
                    that.setData({
                        showAuthorize: true
                    })
                    return
                }
                //   绑定部长
                that.bindSSZGMinister()
            }
        })
    },
    getUserInfo() {
        let that = this;
        app.getWxUserInfo().then((res, rej) => {
            that.setData({
                showAuthorize1: false
            })
            //获取手机号码
            if (!app.globalData.customerInf.phone) {
                that.setData({
                    showAuthorize: true
                })
                return;
            } else {
                //   绑定部长
                that.bindSSZGMinister()
            }
        })
    },
    //   绑定部长
    bindSSZGMinister() {
        let that = this
        wx.request({
            url: app.globalData.AddBindingRecord,
            // url: 'http://localhost:8087/WX Restaurant/AddBindingRecord',
            data: {
                storepersonnal_id: that.data.bindInfo.staf_id,
                unionid: that.data.unionId,
            },
            success: res => {
                let code = res.data.result.result
                if (code == 1) {
                    wx.showToast({
                        title: '绑定成功!',
                        icon: "none",
                        duration: 5000,
                    })
                } else if (code == 2) {
                    wx.showToast({
                        title: '已绑定!',
                        icon: "none",
                        duration: 5000,
                    })
                } else if (code == 3) {
                    wx.showToast({
                        title: '绑定失败,已被绑定!',
                        icon: "none",
                        duration: 5000
                    })
                }
            }
        })
    },
    // 不授权
    refused(e) {
        let that = this
        let index = e.currentTarget.dataset.index
        if (index == 1) {
            that.setData({
                showAuthorize1: false
            })
            //获取手机号码
            if (!app.globalData.customerInf.phone) {
                that.setData({
                    showAuthorize: true
                })
                return;
            } else {
                //   绑定部长
                that.bindSSZGMinister()
            }
        }
        if (index == 2) {
            that.setData({
                showAuthorize: false
            })
            //   绑定部长
            that.bindSSZGMinister()
        }
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
                            wechatAppId: app.getWechatAppId(),
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
                                    //   绑定部长
                                    that.bindSSZGMinister()
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
                                        that.selectMember(app.globalData.user_phone, that.data.bindInfo.shop_id, app.globalData.customerInf.userCode, nickname)
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
                            shop_id: that.data.bindInfo.shop_id,
                        },
                        success: res => {}
                    })
                } else {
                    that.modifyMemberInfo(res1.data.object[0].ID, that.data.openId, that.data.unionId, userCode, nickname)
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

    //获取unionid
    getUserId() {
        var that = this
        if (that.data.unionId != undefined && that.data.unionId != null) {
            wx.request({
                url: app.globalData.UserLogin_url,
                data: {
                    Open_id: that.data.unionId,
                    Shop_id: app.globalData.shopid ? app.globalData.shopid : that.data.shopid
                },
                success: function (res) {
                    if (res.data.result == null || res.data.result.result == 0) {
                        wx.request({
                            url: app.globalData.UserRegistration_url,
                            data: {
                                Head_portrait_img: app.globalData.customerInf.avatarUrl,
                                User_nickname: app.globalData.customerInf.name,
                                Wx_openid: that.data.unionId,
                                Shop_id: app.globalData.shopid ? app.globalData.shopid : that.data.shopid
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
        }
    },
    //查询粉丝奖励设置列表
    getSettingList(shopId) {
        let that = this
        wx.request({
            // url: 'http://localhost:8088/evaluation/selectFansRewardSetting',
            url: app.globalData.selectFansRewardSetting_url,
            data: {
                shopId: shopId
            },
            success: res => {
                for (let i = 0; i < res.data.getList.length; i++) {
                    if (res.data.getList[i].dishesId.length != 0 && res.data.getList[i].dishesId.length > 1) {
                        let a = res.data.getList[i].dishesId[0].dishesInfo.dishes_name + "..."
                        res.data.getList[i].dishesName = a.replace(/[0-9]+/g, "")
                    } else if (res.data.getList[i].dishesId.length == 1) {
                        let a = res.data.getList[i].dishesId[0].dishesInfo.dishes_name
                        res.data.getList[i].dishesName = a.replace(/[0-9]+/g, "")
                    } else {
                        res.data.getList[i].dishesName = ''
                    }
                }
                that.ascending(res.data.getList)
            }
        })
    },
    getSettingContent(shopId) {
        let that = this
        wx.request({
            // url: 'http://localhost:8088/evaluation/getSettingContent',
            url: app.globalData.getSettingContent,
            data: {
                shopId: shopId,
            },
            success: res => {
                if (res.data.code == 1) {
                    that.setData({
                        settingContent: res.data.result
                    })
                }
            }
        })
    },
    // 2022-03-31 添加呼叫部长，服务员功能
    callBZ: function () {
        var that = this
        that.selectGuanz()
        that.focusCB = (bool) => {
            if (!that.data.checkWxpublic) {
                wx.showModal({
                    title: '提示',
                    content: '请关注公众号',
                    showCancel: false
                })
                return;
            }

            if (app.globalData.countDown_minister) {

                wx.showToast({
                    title: '已取消呼叫',
                    icon: 'success',
                    duration: 1000
                })
                clearInterval(that.data.timerb);
                that.setData({
                    bzColor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                    shineb: true
                })
                app.globalData.countDown_minister = false
                app.globalData.RMQmsg_id = ''
                return;
            }
            app.globalData.RMQmsg_id = app.spawnUUID()
            if (that.data.shineb == true) {
                RMQV3.sendRabbitMQMsg({
                    msg_id: app.globalData.RMQmsg_id,
                    from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
                    msg: {
                        type: 'call',
                        text: '客人呼叫部长'
                    },
                    table_name: app.globalData.locationname,
                    // table_name:'A05',
                    // table_id:51197,
                    table_id: that.data.tableid,
                    tg: "bz",
                    shop_id: app.globalData.shopid,
                    back: res => {
                        if (res.result == 'success') {
                            that.setData({
                                shineb: false
                            })
                            app.globalData.countDown_minister = true
                            that.countDown(0)
                            wx.showToast({
                                title: '正在呼叫部长',
                                icon: 'success'
                            })
                            app.globalData.cbz = setInterval(res => {
                                that.cbz()
                            }, 2000)
                            setTimeout(res => {
                                if (app.globalData.cbz != '') {
                                    wx.showToast({
                                        title: '网络异常或当前无部长在线',
                                        icon: 'none'
                                    })
                                    clearInterval(app.globalData.cbz)
                                    clearInterval(that.data.timerb);
                                    that.setData({
                                        bzColor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                                        shineb: true
                                    })
                                    app.globalData.countDown_minister = false
                                    app.globalData.RMQmsg_id = ''
                                }
                            }, 6000)
                        }
                    }
                })
            }
        }
    },
    cbz: function () {
        var that = this
        if (app.globalData.RMQmsg_id == '') {
            clearInterval(app.globalData.cbz)
            app.globalData.cbz = ''
            return;
        }
        RMQV3.sendRabbitMQMsg({
            msg_id: app.globalData.RMQmsg_id,
            from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
            msg: {
                type: 'call',
                text: '客人呼叫部长'
            },
            table_name: app.globalData.locationname,
            // table_name:'A05',
            // table_id:51197,
            table_id: that.data.tableid,
            tg: "bz",
            shop_id: app.globalData.shopid,
            back: res => {}
        })
    },
    //计时器，用于闪烁
    countDown: function (res) {
        var that = this
        var countDownNum = 10000
        if (res == 0 && app.globalData.countDown_minister == true) {
            that.setData({
                timerb: setInterval(function () {
                    that.setData({
                        bzColor: that.data.bzColor == "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_red.png" ? "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png" : "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_red.png"
                    })
                }, 1000)
            })
        } else if (res == 1 && app.globalData.countDown_waiter == true) {
            that.setData({
                timerf: setInterval(function () {
                    that.setData({
                        fwColor: that.data.fwColor == "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_red.png" ? "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png" : "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_red.png"
                    })
                }, 1000)
            })
        }
    },

    callFWY: function () {
        var that = this
        that.selectGuanz()
        that.focusCB = (bool) => {
            if (!that.data.checkWxpublic) {
                wx.showModal({
                    title: '提示',
                    content: '请关注公众号',
                    showCancel: false
                })
                return;
            }
            if (app.globalData.countDown_waiter) {
                wx.showToast({
                    title: '已取消呼叫',
                    icon: 'success',
                    duration: 1000
                })
                clearInterval(that.data.timerf);
                that.setData({
                    fwColor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                    shinef: true
                })
                app.globalData.countDown_waiter = false
                app.globalData.RMQmsg_id = ''
                return;
            }
            app.globalData.RMQmsg_id = app.spawnUUID()
            if (that.data.shinef == true) {
                RMQV3.sendRabbitMQMsg({
                    msg_id: app.globalData.RMQmsg_id,
                    from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
                    msg: {
                        type: 'call',
                        text: '客人呼叫服务员'
                    },
                    table_name: app.globalData.locationname,
                    // table_name:'A05',
                    // table_id:51197,
                    table_id: that.data.tableid,
                    tg: "fw",
                    shop_id: app.globalData.shopid,
                    back: res => {
                        if (res.result == 'success') {
                            that.setData({
                                shinef: false
                            })
                            app.globalData.countDown_waiter = true
                            that.countDown(1)
                            wx.showToast({
                                title: '正在呼叫服务员',
                                icon: 'success'
                            })
                            app.globalData.cfw = setInterval(res => {
                                that.cfw()
                            }, 2000)
                            setTimeout(res => {
                                if (app.globalData.cfw != '') {
                                    wx.showToast({
                                        title: '网络异常或当前无服务员在线',
                                        icon: 'none'
                                    })
                                    clearInterval(app.globalData.cfw)
                                    clearInterval(that.data.timerf);
                                    that.setData({
                                        fwColor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                                        shinef: true
                                    })
                                    app.globalData.countDown_waiter = false
                                    app.globalData.RMQmsg_id = ''
                                }
                            }, 6000)
                        }
                    }
                })
            }
        }
    },
    cfw: function () {
        var that = this
        if (app.globalData.RMQmsg_id == '') {
            clearInterval(app.globalData.cfw)
            app.globalData.cfw = ''
            return;
        }
        RMQV3.sendRabbitMQMsg({
            msg_id: app.globalData.RMQmsg_id,
            from_user: app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
            msg: {
                type: 'call',
                text: '客人呼叫服务员'
            },
            table_name: app.globalData.locationname,
            // table_name:'A05',
            // table_id:51197,
            table_id: that.data.tableid,
            tg: "fw",
            shop_id: app.globalData.shopid,
            back: res => {}
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
                    if (that.focusCB) {
                        that.focusCB(true)
                    }
                })
            }
        })
    },
    // -----------------------------------------end----------------------------------------------
    // 注册
    jumpRegister() {
        let that = this
        that.selectGuanz()
        that.focusCB = (bool) => {
            if (!that.data.checkWxpublic) {
                wx.showModal({
                    title: '提示',
                    content: '请关注公众号',
                    showCancel: false
                })
                return;
                return;
            }
            wx.navigateTo({
                url: '../register/register?openId=' + that.data.openId + '&unionId=' + that.data.unionId,
            })
        }
    },
    // 规则
    jumpRule() {
        wx.downloadFile({ //运用微信自带的方法对该链接进行下载转换获取到临时的可供微信使用的链接
            url: 'https://mb.fsmbdlkj.com/XDYT/upload/20903/file/082032“切瓜切菜”餐饮平台简介.docx',
            success(res2) {
                wx.openDocument({ //打开这个临时链接，也就是打开文件，这里可以两个方法整合在一起，作为一个打开文件按钮
                    filePath: res2.tempFilePath,
                    success: function (res3) {},
                    fail: function () {
                        wx.showModal({
                            title: '提示',
                            content: '没有找到可以使用的打开工具',
                        })
                    }
                })

            }
        })
    },

    ascending(getSettingList) { //升序
        var that = this;
        var max = 0;
        var tmp = 0;
        var a = getSettingList;

        for (var i = 0; i < a.length; i++) {
            max = i; //
            /**查找第 i小的数，直到记下第 i小数的位置***/
            for (var j = i + 1; j < a.length; j++) {
                if (a[max].peopleFirst > a[j].peopleFirst)
                    max = j; //记下较小数位置，再次比较，直到最大
            }
            /***如果第 i小 数的位置不在 i,则交换****/
            if (i != max) {
                tmp = a[i];
                a[i] = a[max];
                a[max] = tmp;
            }
        }
        that.setData({
            getSettingList: a
        })
    },
    //扫码进入判断是否已关注公众号
    selectUnionID() {
        let that = this
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
                                    //wsk: app.globalData.wsk,
                                },
                                header: {
                                    'content-type': 'application/json;charset=utf-8' // 默认值
                                },
                                method: 'POST',
                                success: function (res) {
                                    that.setData({
                                        unionId: res.data.data.unionId,
                                        openId: res.data.data.openid
                                    }, () => {
                                        if (!app.globalData.user_id && that.data.data.shopid) {
                                            that.getUserId()
                                        }
                                        if (that.data.bindInfo) {
                                            that.getCustomerInfo()
                                        }
                                    })
                                    wx.request({
                                        url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
                                        data: {
                                            unionId: that.data.unionId
                                        },
                                        success: res => {
                                            console.log("获取关注列表成功")

                                            if (res.data.list == null) {
                                                //插入临时表
                                                wx.request({
                                                    url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/addOrUpdateShopMiddleTemporary',
                                                    data: {
                                                        shopId: that.data.shopid,
                                                        unionId: that.data.unionId,
                                                    },
                                                    method: "POST",
                                                    success: res => {
                                                        console.log(res);
                                                    }
                                                })
                                            }
                                            if (res.data.list != null && res.data.list != "" && res.data.list.isFocus != '0') {
                                                that.setData({
                                                    focusId: res.data.list.focusId,
                                                    checkWxpublic: true
                                                }, () => {
                                                    that.selOrder()
                                                })
                                            }
                                        }
                                    })
                                   
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

    selOrder() {
        let that = this
        wx.request({
            url: app.globalData.GetTableStatusByNum_Url,
            data: {
                shopId: that.data.shopid,
                tableNum: that.data.tableid
            },
            success: res => {
                that.setData({
                    getTableStatusByNum: res.data.getTableStatusByNum
                }, () => {
                    if (that.data.getTableStatusByNum.length == 0 && that.data.checkWxpublic) {
                        wx.navigateTo({
                            url: '../../../QRorder/QRorder?isTemporaryNotRegister=true&shop_id=' + that.data.shopid + '&table_id=' + that.data.tableid,
                        })
                    }
                    if (that.data.getTableStatusByNum.length > 0) {

                        console.log("前往订单详情")
                        var orderItem = that.data.getTableStatusByNum[0];
                        console.log("orderItem", orderItem)
                        var preorder_starus = orderItem.preorderStarus
                        var orderId = orderItem.orderId
                        var ordercode = orderItem.orderCode
                        var user_count = orderItem.userCount
                        var table_id = orderItem.tableId
                        var total_amount = orderItem.totalAmount
                        var user_id = orderItem.userId
                        var tbc_count = orderItem.tbcCount
                        var shopId = orderItem.shopId
                        app.globalData.table_id = orderItem.tableId
                        app.globalData.table_name = orderItem.tableName

                        wx.navigateTo({
                            url: '../../../ordersdetail/ordersdetail?isFromBuy=true&orderid=' + orderId + '&ordercode=' + ordercode + '&table_id=' + table_id + '&user_count=' + user_count + '&total_amount=' + total_amount + '&user_id=' + user_id + '&preorder_starus=' + preorder_starus + '&tbc_count=' + tbc_count + '&shopId=' + shopId
                        })

                    }
                })
            }
        })
    },
    // 获取店铺信息
    getshopinf: function (shop_id) {
        var that = this;
        console.log("获取店铺信息")
        wx.request({
            url: app.globalData.SelectShopDetails_url,
            data: {
                shop_id: that.data.shopid,
            },
            success: function (res) {
                console.log(res.data[0].shop_name);
                if (res.data != '') {
                    that.setData({
                        shopdetail: res.data[0],
                        shopName: res.data[0].shop_name
                    })
                    app.globalData.shopdetail = res.data[0]
                    app.getManagementDataServlet(shop_id)
                    wx.setNavigationBarTitle({
                        title: "堂食点餐 [" + app.globalData.shopdetail.shop_name + "]"
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
    orderNow() {
        let that = this
        that.selectGuanz()
        // if (that.data.getTableStatusByNum.length === 0) {
            wx.navigateTo({
                url: '../../../QRorder/QRorder?isTemporaryNotRegister=true&shop_id=' + that.data.shopid + '&table_id=' + that.data.tableid,
            })
        // } else {
        //     wx.navigateTo({
        //         url: '../operation/operation?wxQrCode=true&shopName=' + that.data.shopName + '&shopId=' + that.data.shopid + '&tableId=' + that.data.tableid,
        //     })
        // }
        // that.focusCB = (bool) => {
        //   //获取storage名字
        //   app.getWxUserInfo().then(function () {})
        //   if (!that.data.checkWxpublic) {
        //     wx.showModal({
        //       title: '提示',
        //       content: '请关注公众号',
        //       showCancel: false
        //     })
        //     return;
        //   }
        //   wx.request({
        //     url: app.globalData.selectCustomerInfByOpenId_url,
        //     data: {
        //       openid: that.data.openId ? that.data.openId : app.globalData.openid
        //     },
        //     method: 'POST',
        //     success(res2) {
        //       app.globalData.signIn = res2.data.signIn == '1'
        //       if (res2.data.signIn == '0') {
        //         wx.showModal({
        //           content: '您尚未注册平台账户\n注册后可以享受平台和商家的更多优惠',
        //           cancelText: '暂不注册',
        //           confirmText: '前往注册',
        //           success(res) {
        //             if (res.confirm) {
        //               //前往注册逻辑
        //               wx.navigateTo({
        //                 url: '/pages/module_others/pages/register/register?openId=' + that.data.openId + '&unionId=' + that.data.unionId + '&eat=true',
        //               })
        //             } else {
        //               if (that.data.getTableStatusByNum.length === 0) {
        //                 wx.navigateTo({
        //                   url: '../../../QRorder/QRorder?isTemporaryNotRegister=true&shop_id=' + that.data.shopid + '&table_id=' + that.data.tableid,
        //                 })
        //               } else {
        //                 wx.navigateTo({
        //                   url: '../operation/operation?wxQrCode=true&shopName=' + that.data.shopName + '&shopId=' + that.data.shopid + '&tableId=' + that.data.tableid,
        //                 })
        //               }
        //             }
        //           }
        //         })
        //       } else {
        //         if (that.data.getTableStatusByNum.length === 0) {
        //           wx.navigateTo({
        //             url: '../../../QRorder/QRorder?isTemporaryNotRegister=true&shop_id=' + that.data.shopid + '&table_id=' + that.data.tableid,
        //           })
        //         } else {
        //           wx.navigateTo({
        //             url: '../operation/operation?wxQrCode=true&shopName=' + that.data.shopName + '&shopId=' + that.data.shopid + '&tableId=' + that.data.tableid,
        //           })
        //         }
        //       }

        //     }
        //   })
        // }
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
        if (that.data.shopid) {
            that.getshopinf()
        }

    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        console.log('隐藏')
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {},

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