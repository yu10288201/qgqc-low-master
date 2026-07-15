//index.js
//获取应用实例
var util = require('../../utils/util.js');
const app = getApp()
const WXAPI = require('../../wxapi/main');
var SocketTask;
const sceneValue = wx.getLaunchOptionsSync()
Page({
    data: {
        is_video_show:app.globalData.is_video_show,
        isShowGetAvatar: false,
        swiperInterval: 3000,
        videoIndex: 0,
        topNum: 0,
        videoList: [],
        topimageList: [],
        videoAutoplay: false,
        swiperAutoplay: true,
        showChoose: false,
        toBookingDialog: false,
        isShowMenu: 1,
        showMenuContent: '',
        isFromTreat: false,
        titles: '',
        bindUser: '',
        isOrder: true,
        showPoster: false,
        serive: [],
        isWeb: false,
        foodRefresh: false,
        wineRefresh: false,
        comboRefresh: false,
        randomDishesRefresh: false,
        couponRefresh: true,
        foodList: [],
        wineList: [],
        comboList: [],
        pageSize: 10,
        pageNum1: 0,
        pageNum2: 0,
        pageNum3: 0,
        couponList: [],
        isHall: true,
        // tableType: '宴会厅B厅',
        hall_id: 0,
        hallIndex: 0,
        openid: '',
        user_id: '',
        items: [],
        way: 2,
        hidden: true, //默认模态框为隐藏状态
        hidden2: true,
        operatingstate: '', //营业状态
        //  appid: 'wx44b4aff1273f5fe0',
        //  secret: '72cebfa572d5cc0bd4f1aedacb9524e6', 
        // 佛山应用小程序开发
        appid: app.getWechatAppId(),
        secret: app.globalData.wsk,
        socketOpen: false,
        starimage: '',
        shop_type_value: [],
        setmealPageNum: 20, //因为一进来就拿了20个显示，所以基数为20
        couponPageNum: 0, //因为一进来就拿了20个显示，所以基数为20
        stopNext: false, //停止下拉增加数据，防止数据过多
        disPageNum: 0, //菜品分页数字
        randomDishes: [], //随机菜品数组
        showModalStatus: false,
        showModalStatus1: false,
        invitation_image: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1553514888119&di=f358cc34199e64d794e75ffad96a6550&imgtype=0&src=http%3A%2F%2Fpic.58pic.com%2F58pic%2F11%2F88%2F41%2F50C58PICetF.JPG',
        background2: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/authorized.jpg", //授权图片,暂时不能放在服务器
        fackyousevencolor: '#218c78',
        fackyousevencolor1: '#218c78',
        tableNowNum: '',
        set_meal: [], //外卖套餐数组
        showcoupon: false,
        RD: false, //是否显示菜品
        callmsg: {
            //验证代码 固定服务器分发带盐加密
            "systemcall": "sha256",
            //发送的用户组  
            "users": "bz",
            //发送的人 如果不带这个参数就给全体拜年
            // "hapiname": "部长",
            //自定义参数内容
            "msg": JSON.stringify({
                msg: "煞笔樊德钦",
                table: "00010"
            }),
        },
        operatingTime: '', //营业时间
        isCollection: false, //是否收藏店铺
        QRorderid: '', //选择的订单id

        menuList_discount: [],
        menuList_recommend: [],
        menuList_new: [],
        menuList_specialty: [],
        bbp: '', //底端随机抽出来的图片链接
        imgList: [{
            "img": "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (5).png"
        }, {
            "img": "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (2).png",
        }, {
            "img": "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (6).png",
        }, {
            "img": "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (8).png",
        }, ],
        bottom_bg_list: [{
            "img": "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/bottom_bg (1).png"
        }, {
            "img": "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/bottom_bg (2).png",
        }, {
            "img": "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/bottom_bg (3).png",
        }, {
            "img": "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/bottom_bg (4).png",
        }, {
            "img": "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/bottom_bg (5).png",
        }, ],
        bookswitch: true,
        isIn: false, //商家是否入驻
        swiper_background: ["https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (7).png", "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (2).png", "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (3).png", "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (6).png", "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/index/swiper_backgroundIMG1 (5).png"],
    },
    goTop: function (e) { // 一键回到顶部
      this.setData({
        topNum: 0
      });
    },
    goToOrdersList() {

        wx.navigateTo({
            url: '../module_discount/pages/orderList/orderList?shop_id=' + this.data.shopid + '&shopName=' + this.data.shopdetail.shop_name,
        })
    },
    collection: function () {
        var that = this
        var isFavorite = !that.data.isCollection ? true : false
        wx.setStorage({
            key: "isFavorite",
            data: isFavorite,
        })
        var object = {
            "shopId": that.data.shopid,
            "unionid": that.data.unionId,
            "isFavorite": isFavorite,
        }
        console.log(JSON.stringify(object), "index92");
        wx.request({
            url: app.globalData.allUrl.favoriteShop,
            data: JSON.stringify(object),
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: 'POST',
            success: function (res) {
                if (res.data.result == "success") {
                    console.log("关注成功")
                    that.setData({
                        isCollection: true
                    })
                    that.isCollection();
                }
            }
        })
    },
    tel: function () {
        wx.navigateTo({
            url: '/pages/module_others/pages/newchat/newchat',
        })
    },
    help: function () {
        wx.navigateTo({
            url: '/pages/help/help',
        })
    },
    gomymessage(){
        wx.navigateTo({
            url: '../mymessage/mymessage?shopId='+ this.data.shopdetail.shop_id + '&customerId=' + app.globalData.customerInf.id,
          })
    },
    tosaleData: function () {
        wx.navigateTo({
            url: '/pages/module_others/pages/saleData/saleData',
        })
    },
    showChoose: function () {
        let that = this
        this.setData({
            showChoose: !this.data.showChoose
        })
    },
    bindPickerChange: function (e) {
        console.log('picker发送选择改变，携带值为', e.target.dataset.item.id)
        this.setData({
            hallIndex: e.target.dataset.item.id
        })
        app.globalData.hallIndex = e.target.dataset.item.id
        app.globalData.hall_id = e.currentTarget.dataset.item.id
    },
    changeType: function (e) {
        let that = this
        console.log("切换类型")
        if (e.currentTarget.dataset.item.isHall) {
            that.setData({
                hall_id: e.currentTarget.dataset.item.id,
                tableType: e.currentTarget.dataset.item.name,
                isHall: true,
                // table_name: '',
                // table_id: '',
                way: 2
            })
            that.bindPickerChange(e)
        } else {
            that.setData({
                hall_id: e.currentTarget.dataset.item.id,
                tableType: e.currentTarget.dataset.item.name,
                isHall: false,
                // table_name: '',
                // table_id: '',
                way: 2
            })
        }
    },
    toBooking1() {
        let that = this 
        wx.showLoading({
          title: '请稍后',
        })
        wx.request({
            url: app.globalData.SelectTicketOrderDetailedWithSetMeal,
            data: {
                shop_id: app.globalData.shopdetail.shop_id,
                user_id: app.globalData.user_id,
                typeForSetMeal: 0
            },
            method: 'POST',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: res=>{
                if(res.data.data.length == 0){
                    wx.showModal({
                        title: '提示',
                        content: '没有已购/赠送',
                        showCancel: false,
                    })
                    wx.hideLoading({
                      success: (res) => {},
                    })
                    return;
                }else{
                    let data = res.data.data
                    let isBuy = false
                    for (let x of data) {
                        if(x.ticketStatus == 0){
                            isBuy = true
                        }
                    }
                    wx.hideLoading({
                        success: (res) => {},
                    })
                    if (isBuy) {
                        that.setData({
                            toBookingDialog: !that.data.toBookingDialog,
                        })
                    }else{
                        wx.showModal({
                            title:'提示',
                            content: '没有已购/赠送',
                            showCancel: false
                        })
                    }
                    
                }
            }
        })
        
    },
    toBooking: function (e) {
        wx.showLoading({
            title: '加载中...',
        })
        this.setData({
            toBookingDialog: false,
        })
        let that = this
        let hailArray = [] // 大厅信息
        let tableArray = [] // 桌位信息
        let compartmentLists = [] //包房信息
        let hallArray = [] //大厅名字列表
        let hallTablesArray = [] //大厅名字列表
        let typeItem = [] //抬头信息
        console.log(e);
        let a = e.currentTarget.dataset.index
        //弹窗
        console.log(app.globalData.managementData)
        if (app.globalData.managementData.orderStyleOnline) {
            if (that.data.shopdetail.shop_settlement == 0) {
                wx.showModal({
                    title: '提示',
                    content: '该商铺还未入驻本平台',
                })

                that.setData({
                    isIn: false
                })

                wx.hideLoading();
            } else {
                var eat_in_distance = app.globalData.managementData.eat_in_distance //后台设置的堂食有效距离
                if (app.globalData.myLongitude == 0 && app.globalData.myLatitude == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '没有授权地理位置信息,不能进行堂食点餐',
                    })

                    wx.hideLoading();
                } else {
                    wx.request({
                        url: app.globalData.GetDistanceServlet_url,
                        data: {
                            lat1: app.globalData.shopdetail.latitude,
                            lng1: app.globalData.shopdetail.longitude,
                            lat2: app.globalData.myLatitude,
                            lng2: app.globalData.myLongitude,
                        },
                        success: function (res) {
                            console.log(res, '当前距离')
                            console.log(eat_in_distance, '设置距离');
                            if (app.globalData.BookLocationCheck && res.data >= eat_in_distance && eat_in_distance > 0) { //实际填大于三千米，由于测试所以填零
                                wx.showModal({
                                    title: '提示',
                                    content: '您未到达该店,不能进行到店点餐操作',
                                    showCancel: false,
                                })
                                wx.hideLoading({
                                  success: (res) => {},
                                })
                            } else {
                                //aaaaa
                                wx.hideLoading();
                                wx.request({
                                    // url: "http://192.168.102.114:8080/GetFreeTableInf",
                                    url: app.globalData.GetFreeTableInf_url,
                                    data: {
                                        shop_id: app.globalData.shopid,
                                        startingTime: util.formatTime(new Date()),
                                    },
                                    success: function (res) {
                                        console.log(res)
                                        wx.showLoading({
                                            title: '加载中',
                                        })
                                        if (res.data) {
                                            console.log("查询所有的厅和包房，并分组")
                                            for (var i = 0; i < res.data.object.length; i++) { //大厅信息
                                                for (var y = 0; y < res.data.object[i].tableManage.length; y++) {
                                                    res.data.object[i].tableManage[y].table_nickname = res.data.object[i].field_name + ' ' + res.data.object[i].tableManage[y].table_name
                                                    res.data.object[i].tableManage[y].field_name = res.data.object[i].field_name
                                                    tableArray.push(res.data.object[i].tableManage[y])
                                                }

                                                if (res.data.object[i].field_type == 0 && res.data.object[i].field_status == 1) {
                                                    hailArray.push(res.data.object[i]);
                                                    // tableArray.push(res.data.object[i]);
                                                    for (var y = 0; y < res.data.object[i].tableManage.length; y++) {
                                                        res.data.object[i].tableManage[y].table_nickname = res.data.object[i].field_name + ' ' + res.data.object[i].tableManage[y].table_name
                                                        res.data.object[i].tableManage[y].field_name = res.data.object[i].field_name
                                                        res.data.object[i].tableManage[y].checked = false
                                                    }

                                                    hallArray.push(res.data.object[i].field_name)
                                                    hallTablesArray.push(res.data.object[i].tableManage)
                                                    var item = {
                                                        id: typeItem.length,
                                                        name: res.data.object[i].field_name,
                                                        isHall: true,
                                                        checked: false
                                                    }
                                                    typeItem.push(item)
                                                } else if (res.data.object[i].field_type == 1 && res.data.object[i].field_status == 1) { // 字段类型:field_type
                                                    for (var y = 0; y < res.data.object[i].tableManage.length; y++) {
                                                        res.data.object[i].tableManage[y].table_nickname = res.data.object[i].field_name + ' ' + res.data.object[i].tableManage[y].table_name
                                                        res.data.object[i].tableManage[y].field_name = res.data.object[i].field_name
                                                        compartmentLists.push(res.data.object[i].tableManage[y])
                                                    }
                                                }
                                            }
                                            var item = {
                                                id: typeItem.length,
                                                name: '包房',
                                                isHall: false,
                                                checked: false
                                            }
                                            typeItem.push(item)
                                            // console.log(compartmentLists)
                                            console.log(typeItem)
                                            that.setData({
                                                xql: res.data.object, //原始信息
                                                tableArray: tableArray,
                                                hailArray: hailArray,
                                                compartmentLists: compartmentLists,
                                                hallTablesArray: hallTablesArray,
                                                hallArray: hallArray,
                                                typeItem: typeItem
                                            }, () => {
                                                wx.hideLoading();
                                                if (that.data.fromQR) {
                                                    for (let a = 0; a < that.data.tableArray.length; a++) {
                                                        const element = that.data.tableArray[a];
                                                        if (that.data.QRTableId == element.table_id) {
                                                            let b = {
                                                                detail: {
                                                                    target: {
                                                                        dataset: {
                                                                            item: element
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                            that.table_Bindsubmit(b)
                                                            that.setData({
                                                                fromQR: false,
                                                                QRTableId: null
                                                            })
                                                            break
                                                        }
                                                    }
                                                } else {
                                                    that.setData({
                                                        showChoose: true,
                                                        isOrder: a == 0 ? true : false,
                                                    })
                                                }
                                            })
                                            wx.hideLoading();
                                        } else {
                                            wx.hideLoading()
                                            that.toBooking()
                                        }
                                    },
                                })
                            }
                        }
                    })
                }
            }
        }
    },
    isCollection: function () {
        var that = this
        var object = {
            "shopId": that.data.shopid,
            "unionid": app.globalData.unionID,
        }
        wx.request({
            url: app.globalData.allUrl.isFavoriteShop,
            data: JSON.stringify(object),
            header: {
                'content-type': 'application/json'
                // 默认值
            },
            method: 'POST',
            success: function (res) {
                console.log("是否关注" + res.data)
                that.setData({
                    isCollection: res.data
                })
            }
        })
    },

    // menuList_specialty: menuList_specialty,   // 特色菜
    // // menuList_recommend: menuList_recommend,   // 推荐菜
    // menuList_discount: menuList_discount,     // 特价菜
    // menuList_new: menuList_new,               // menuList_discount

    // 首页展示菜品图片   星盾
    getDishesSequence1: function (e) {
        var that = this
        // Dishes_type可选值：
        // xdSequence、newDishesSequence、dishes_recommendSequence、dishes_specialtySequence
        var type = "xdSequence"
        wx.request({
            url: app.globalData.GetDishesSequence_url,
            data: {
                shop_id: that.data.shopid,
                Dishes_type: type
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                if (res.data.result.result == 1) {
                    that.setData({
                        menuList_specialty: res.data.object
                    })
                }
            }
        })
    },
    // 首页展示菜品图片 大厨推荐
    getDishesSequence2: function (e) {
        var that = this
        var type = "dishes_recommendSequence"
        wx.request({
            url: app.globalData.GetDishesSequence_url,
            data: {
                shop_id: that.data.shopid,
                Dishes_type: type
            },
            success: function (res) {
                if (res.data.result.result == 1) {
                    that.setData({
                        menuList_recommend: res.data.object
                    })
                }
            }
        })
    },
    // 首页展示菜品图片 新菜品
    getDishesSequence3: function (e) {
        var that = this
        wx.request({
            url: app.globalData.GetDishesSequence_url,
            data: {
                shop_id: that.data.shopid,
                Dishes_type: "newDishesSequence"
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                if (res.data.result.result == 1) {
                    that.setData({
                        menuList_new: res.data.object
                    })
                }
            }
        })
    },
    // 首页展示菜品图片 特价菜
    getDishesSequence4: function (e) {
        var that = this
        wx.request({
            url: app.globalData.GetDishesSequence_url,
            data: {
                shop_id: that.data.shopid,
                Dishes_type: "dishes_specialtySequence"
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            method: 'POST',
            success: function (res) {
                if (res.data.result.result == 1) {
                    that.setData({
                        menuList_discount: res.data.object
                    })
                }
            }
        })
    },


    tapOneDialogButton(e) {
        this.setData({
            showOneButtonDialog: true
        })
    },

    //改变拼桌方式
    changeway: function (e) {
        var that = this
        console.log(e.currentTarget.dataset.index)
        that.setData({
            way: e.currentTarget.dataset.index,
        })
    },
    //确认拼桌方式
    confirm: function () {
        var that = this
        var way = that.data.way
        var tableNowNum = that.data.tablenumber
        var QRorderid = that.data.QRorderid
        var userClaim = that.data.userClaim
        var orderid = orderid
        that.setData({
            hidden: true
        })
        if (way == 0) {
            wx.navigateTo({
                url: '../QRorder/QRorder?table_id=' + that.data.tableid + '&shop_id=' + that.data.shopid + '&add=' + true + '&tableNowNum=' + tableNowNum,
            })
        } else if (way == 1) {
            wx.navigateTo({
                url: '../QRorder/QRorder?table_id=' + that.data.tableid + '&shop_id=' + that.data.shopid,
            })
        } else if (way == 2) {
            console.log("不拼桌")
        } else if (way == 3) {
            if (QRorderid == '') {
                wx.showModal({
                    title: '提示',
                    content: '请选择订单',
                })
            } else {
                if (orderid) {
                    that.toOrderDetailPage(orderid, userClaim)
                } else {
                    that.toOrderDetailPage(QRorderid, userClaim)
                }
            }
        }
        //关闭弹框，清空数组
        that.setData({
            hidden: true,
            hidden2: true,
            orderId_directy: []
        })
    },

    qrscan_old: function (res) {
        var that = this
        var eat_in_distance = app.globalData.managementData.eat_in_distance //后台设置的堂食有效距离

        if (app.globalData.managementData.orderStyleInside) {
            if (that.data.shopdetail.shop_settlement == 0) {
                wx.showModal({
                    title: '提示',
                    content: '该商铺还未入驻本平台',
                })

                that.setData({
                    isIn: false
                })
            } else {
                if (app.globalData.myLongitude == 0 && app.globalData.myLatitude == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '没有授权地理位置信息,不能进行堂食点餐',
                    })
                } else {
                    wx.request({
                        url: app.globalData.GetDistanceServlet_url,
                        data: {
                            lat1: app.globalData.shopdetail.latitude,
                            lng1: app.globalData.shopdetail.longitude,
                            lat2: app.globalData.myLatitude,
                            lng2: app.globalData.myLongitude,
                        },
                        success: function (res) {
                            console.log(res, '当前距离')
                            console.log(eat_in_distance, '设置距离');
                            if (app.globalData.BookLocationCheck && res.data >= eat_in_distance && eat_in_distance > 0) { //实际填大于三千米，由于测试所以填零
                                wx.showModal({
                                    title: '提示',
                                    content: '您未到达该店,不能进行到店点餐操作',
                                    showCancel: false,
                                })
                                wx.hideLoading({
                                  success: (res) => {},
                                })
                            } else {

                                //正式点餐操作
                                wx.scanCode({
                                    onlyFromCamera: true,
                                    success: function (res) {
                                        that.sound()
                                        console.log('堂食点餐')
                                        console.log("res.path", res.path);
                                        console.log(res)
                                        //获取当前扫码的桌号，店id
                                        if (res.result) {
                                            if (res.result.indexOf('https://') != -1 && res.result.indexOf('?uuid=') != -1) {
                                                if (res.result.indexOf(app.globalData.QRCodeUrl) != -1) {
                                                    let a = res.result.substring(res.result.indexOf('?') + 6)
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
                                                            //if (sceneValue.scene === 1011 || sceneValue.scene === 1047 || sceneValue.scene === 1017 || sceneValue.scene === 1025 || sceneValue.scene === 1124) {
                                                               // wx.navigateTo({
                                                                   // url: '/' + res.data.data.miniProgram,
                                                                //})
                                                            //} else {
                                                                console.log(res)
                                                                let a = res.data.data.miniProgram
                                                                var parameter = a.split("=")[1]
                                                                var parameter_arry = parameter.split("_")
                                                                console.log(parameter_arry[0])
                                                                //  var [status, shopid, tableid] = parameter_arry

                                                                //  console.log(str.search("3") != -1)
                                                                if (parameter_arry[0].search(",") != -1) {
                                                                    var arr = parameter_arry[0].split(",")
                                                                } else if (parameter_arry[0].search("%2C") != -1) {
                                                                    var arr = parameter_arry[0].split("%2C")
                                                                }

                                                                console.log(arr)
                                                                if (arr != undefined) {
                                                                    var shopid = parseInt(arr[1])
                                                                    var tableid = parseInt(arr[2])
                                                                    that.setData({
                                                                        shopid: shopid,
                                                                        tableid: tableid
                                                                    })
                                                                    that.getFocusList(shopid, tableid)
                                                                    console.log("店名ID:" + shopid + "桌位ID:" + tableid)
                                                                }
                                                            //}

                                                        }
                                                    })
                                                    return
                                                } else {
                                                    wx.showModal({
                                                        title: '提示',
                                                        content: '请扫描' + (res.result.indexOf(app.globalData.QRCodeUrl) != -1 ? '正式服' : '测试服') + '二维码',
                                                        success(res) {
                                                            return
                                                        }
                                                    })
                                                }
                                            } else if (res.path) {
                                                console.log(res)
                                                var parameter = res.path.split("=")[1]
                                                var parameter_arry = parameter.split("_")
                                                var startingTime;
                                                console.log(parameter_arry[0])

                                                if (parameter_arry[0].search(",") != -1) {
                                                    var arr = parameter_arry[0].split(",")
                                                } else if (parameter_arry[0].search("%2C") != -1) {
                                                    var arr = parameter_arry[0].split("%2C")
                                                }
                                                console.log(arr)
                                                var status = arr[0]
                                                var shopid = parseInt(arr[1])
                                                var tableid = parseInt(arr[2])
                                                console.log("断点输出tableid" + tableid)
                                                that.setData({
                                                    shopid: shopid,
                                                    tableid: tableid
                                                })
                                                console.log("店名ID:" + shopid + "桌位ID:" + tableid)
                                                //获取完毕，对shop进行判断
                                                if (shopid == app.globalData.shopid) {
                                                    app.globalData.locationid = tableid
                                                    startingTime = util.formatTime(new Date())
                                                    console.log(that.data.user_id)
                                                    console.log(app.globalData.user_id)
                                                    console.log(sceneValue.scene, "场景值-1");
                                                    app.getmenu()
                                                    // if (sceneValue.scene === 1011 || sceneValue.scene === 1047 || sceneValue.scene === 1017 || sceneValue.scene === 1025 || sceneValue.scene === 1124) {
                                                    //     console.log(sceneValue.scene, "场景值-1");
                                                    //     wx.navigateTo({
                                                    //         url: '../module_others/pages/wxPublic/wxPublic?scene=forhere%2C' + shopid + '%2C' + tableid
                                                    //     })
                                                    // } else {
                                                    //     that.getFocusList(shopid, tableid)
                                                    // }
                                                    that.getFocusList(shopid, tableid)
                                                } else {
                                                    //不是本店id，进行shop跳转
                                                    that.setData({
                                                        tableid: tableid
                                                    })
                                                    app.globalData.locationid = tableid
                                                    app.globalData.shopid = shopid
                                                    wx.reLaunch({
                                                        url: '/pages/index/index?perform=' + true + '&tableid=' + tableid,
                                                    })
                                                }
                                            }
                                        } else if (res.path) {
                                            console.log(res)
                                            var parameter = res.path.split("=")[1]
                                            var parameter_arry = parameter.split("_")
                                            var startingTime;
                                            console.log(parameter_arry[0])

                                            if (parameter_arry[0].search(",") != -1) {
                                                var arr = parameter_arry[0].split(",")
                                            } else if (parameter_arry[0].search("%2C") != -1) {
                                                var arr = parameter_arry[0].split("%2C")
                                            }
                                            console.log(arr)
                                            var status = arr[0]
                                            var shopid = parseInt(arr[1])
                                            var tableid = parseInt(arr[2])
                                            console.log("断点输出tableid" + tableid)
                                            that.setData({
                                                shopid: shopid,
                                                tableid: tableid
                                            })
                                            console.log("店名ID:" + shopid + "桌位ID:" + tableid)
                                            //获取完毕，对shop进行判断
                                            if (shopid == app.globalData.shopid) {
                                                app.globalData.locationid = tableid
                                                startingTime = util.formatTime(new Date())
                                                console.log(that.data.user_id)
                                                console.log(app.globalData.user_id)
                                                console.log(sceneValue.scene, "场景值-1");
                                                app.getmenu()
                                                // if (sceneValue.scene === 1011 || sceneValue.scene === 1047 || sceneValue.scene === 1017 || sceneValue.scene === 1025 || sceneValue.scene === 1124) {
                                                //     console.log(sceneValue.scene, "场景值-1");
                                                //     wx.navigateTo({
                                                //         url: '../module_others/pages/wxPublic/wxPublic?scene=forhere%2C' + shopid + '%2C' + tableid
                                                //     })
                                                // } else {
                                                //     that.getFocusList(shopid, tableid)
                                                // }
                                                that.getFocusList(shopid, tableid)
                                            } else {
                                                //不是本店id，进行shop跳转
                                                that.setData({
                                                    tableid: tableid
                                                })
                                                app.globalData.locationid = tableid
                                                app.globalData.shopid = shopid
                                                wx.reLaunch({
                                                    url: '/pages/index/index?perform=' + true + '&tableid=' + tableid,
                                                })
                                            }
                                        }
                                    },
                                    fail: function (res) {
                                        console.log(res)
                                    }
                                })
                            }
                        }
                    })
                }
            }
        } else {
            wx.showModal({
                title: '提示',
                content: '该店尚未开通此项功能',
            })
        }

    },

    qrscan: function (res) {
        var that = this
        var eat_in_distance = app.globalData.managementData.eat_in_distance //后台设置的堂食有效距离

        if (app.globalData.managementData.orderStyleInside) {
            if (that.data.shopdetail.shop_settlement == 0) {
                wx.showModal({
                    title: '提示',
                    content: '该商铺还未入驻本平台',
                })

                that.setData({
                    isIn: false
                })
            } else {
                if (app.globalData.myLongitude == 0 && app.globalData.myLatitude == 0) {
                    wx.showModal({
                        title: '提示',
                        content: '没有授权地理位置信息,不能进行堂食点餐',
                    })
                } else {
                    wx.request({
                        url: app.globalData.GetDistanceServlet_url,
                        data: {
                            lat1: app.globalData.shopdetail.latitude,
                            lng1: app.globalData.shopdetail.longitude,
                            lat2: app.globalData.myLatitude,
                            lng2: app.globalData.myLongitude,
                        },
                        success: function (res) {
                            console.log(res, '当前距离')
                            console.log(eat_in_distance, '设置距离');
                            if (app.globalData.BookLocationCheck && res.data >= eat_in_distance && eat_in_distance > 0) { //实际填大于三千米，由于测试所以填零
                                wx.showModal({
                                    title: '提示',
                                    content: '您未到达该店,不能进行到店点餐操作',
                                    showCancel: false,
                                })
                                wx.hideLoading({
                                  success: (res) => {},
                                })
                            } else {

                                //正式点餐操作
                                wx.scanCode({
                                    onlyFromCamera: true,
                                    success: function (res) {
                                        that.sound()
                                        console.log('堂食点餐')
                                        console.log("res.path", res.path);
                                        console.log(res)
                                        //获取当前扫码的桌号，店id
                                        if (res.result) {
                                            if (res.result.indexOf('https://') != -1 && res.result.indexOf('?uuid=') != -1) {
                                                if (res.result.indexOf(app.globalData.QRCodeUrl) != -1) {
                                                    let a = res.result.substring(res.result.indexOf('?') + 6)
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
                                                          
                                                                console.log(res)
                                                                let a = res.data.data.miniProgram
                                                                var parameter = a.split("=")[1]
                                                                var parameter_arry = parameter.split("_")
                                                                console.log(parameter_arry[0])
                                                                //  var [status, shopid, tableid] = parameter_arry

                                                                //  console.log(str.search("3") != -1)
                                                                if (parameter_arry[0].search(",") != -1) {
                                                                    var arr = parameter_arry[0].split(",")
                                                                } else if (parameter_arry[0].search("%2C") != -1) {
                                                                    var arr = parameter_arry[0].split("%2C")
                                                                }

                                                                console.log(arr)
                                                                if (arr != undefined) {
                                                                    var shopid = parseInt(arr[1])
                                                                    var tableid = parseInt(arr[2])
                                                                    that.setData({
                                                                        shopid: shopid,
                                                                        tableid: tableid
                                                                    })
                                                                    that.getFocusList(shopid, tableid)
                                                                    console.log("店名ID:" + shopid + "桌位ID:" + tableid)
                                                                }else{

                                                                     if (sceneValue.scene === 1011 || sceneValue.scene === 1047 || sceneValue.scene === 1017 || sceneValue.scene === 1025 || sceneValue.scene === 1124) {
                                                                        wx.navigateTo({
                                                                            url: '/' + res.data.data.miniProgram,
                                                                            })
                                                                        }
                                                                }
                                                            

                                                        }
                                                    })
                                                    return
                                                } else {
                                                    wx.showModal({
                                                        title: '提示',
                                                        content: '请扫描' + (res.result.indexOf(app.globalData.QRCodeUrl) != -1 ? '正式服' : '测试服') + '二维码',
                                                        success(res) {
                                                            return
                                                        }
                                                    })
                                                }
                                            } else if (res.path) {
                                               
                                                var parameter = res.path.split("=")[1]
                                                var parameter_arry = parameter.split("_")
                                                var startingTime;
                                                console.log(parameter_arry[0])

                                                if (parameter_arry[0].search(",") != -1) {
                                                    var arr = parameter_arry[0].split(",")
                                                } else if (parameter_arry[0].search("%2C") != -1) {
                                                    var arr = parameter_arry[0].split("%2C")
                                                }
                                                console.log(arr)
                                                var status = arr[0]
                                                var shopid = parseInt(arr[1])
                                                var tableid = parseInt(arr[2])
                                                console.log("断点输出tableid" + tableid)
                                                that.setData({
                                                    shopid: shopid,
                                                    tableid: tableid
                                                })
                                                console.log("店名ID:" + shopid + "桌位ID:" + tableid)
                                                //获取完毕，对shop进行判断
                                                if (shopid == app.globalData.shopid) {
                                                    app.globalData.locationid = tableid
                                                    startingTime = util.formatTime(new Date())
                                                    console.log(that.data.user_id)
                                                    console.log(app.globalData.user_id)
                                                    console.log(sceneValue.scene, "场景值-1");
                                                    app.getmenu()
                                                   
                                                    that.getFocusList(shopid, tableid)
                                                } else {
                                                    //不是本店id，进行shop跳转
                                                    that.setData({
                                                        tableid: tableid
                                                    })
                                                    app.globalData.locationid = tableid
                                                    app.globalData.shopid = shopid
                                                    wx.reLaunch({
                                                        url: '/pages/index/index?perform=' + true + '&tableid=' + tableid,
                                                    })
                                                }
                                            }
                                        } else if (res.path) {
                                            console.log(res)
                                            var parameter = res.path.split("=")[1]
                                            var parameter_arry = parameter.split("_")
                                            var startingTime;
                                            console.log(parameter_arry[0])

                                            if (parameter_arry[0].search(",") != -1) {
                                                var arr = parameter_arry[0].split(",")
                                            } else if (parameter_arry[0].search("%2C") != -1) {
                                                var arr = parameter_arry[0].split("%2C")
                                            }
                                            console.log(arr)
                                            var status = arr[0]
                                            var shopid = parseInt(arr[1])
                                            var tableid = parseInt(arr[2])
                                            console.log("断点输出tableid" + tableid)
                                            that.setData({
                                                shopid: shopid,
                                                tableid: tableid
                                            })
                                            console.log("店名ID:" + shopid + "桌位ID:" + tableid)
                                            //获取完毕，对shop进行判断
                                            if (shopid == app.globalData.shopid) {
                                                app.globalData.locationid = tableid
                                                startingTime = util.formatTime(new Date())
                                                console.log(that.data.user_id)
                                                console.log(app.globalData.user_id)
                                                console.log(sceneValue.scene, "场景值-1");
                                                app.getmenu()
                             
                                                that.getFocusList(shopid, tableid)
                                            } else {
                                                //不是本店id，进行shop跳转
                                                that.setData({
                                                    tableid: tableid
                                                })
                                                app.globalData.locationid = tableid
                                                app.globalData.shopid = shopid
                                                wx.reLaunch({
                                                    url: '/pages/index/index?perform=' + true + '&tableid=' + tableid,
                                                })
                                            }
                                        }
                                    },
                                    fail: function (res) {
                                        console.log(res)
                                    }
                                })
                            }
                        }
                    })
                }
            }
        } else {
            wx.showModal({
                title: '提示',
                content: '该店尚未开通此项功能',
            })
        }

    },


    facilities: function (e) {
        wx.navigateTo({
            url: '../module_others/pages/shop_service/shop_service',
        })
    },
    //获取关注公众号列表
    getFocusList(shopId, tableId) {
        let that = this
        // wx.request({
        //     url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList',
        //     data: {
        //         unionId: that.data.unionId
        //     },
        //     success: res => {
        //         that.getTableStatusById(res, shopId, tableId)
        //     }
        // })
        //去掉关注公众号的逻辑
        that.getTableStatusById(shopId, tableId)
    },
    //此函数暂不使用
    getTableStatusById_Old(shopId, tableId) {
        let that = this
        wx.request({
            url: app.globalData.GetTableStatusByNum_Url,
            data: {
                shopId: shopId,
                tableNum: tableId
            },
            success: res => {
                if (focusList.data.list != undefined && focusList.data.list != "" && focusList.data.list.isFocus != '0') {
                    
                  //？ 扫码绑定到店铺？ 此功能应该已取消 开始
                  wx.request({
                        url: app.globalData.bindingRelationship_Url,
                        // url: 'http://localhost:8088/evaluation/bindingRelationship',
                        data: {
                            primaryBindingOpenId: that.data.inviterOpenid,
                            passiveBindingOpenId: that.data.openid,
                            shopId: that.data.shopid ? that.data.shopid : 0,
                        },
                        header: {
                            'content-type': 'application/json'
                        },
                        success: function (res) {
                            console.log("alex显示数据:", res)
                            if (res.data.result == '1') {
                                console.log("绑定成功")
                            } else {
                                console.log("绑定失败")
                            }
                        },
                        fail: function (res) {
                            console.log("绑定失败")
                        }
                    })
                    //？ 扫码绑定到店铺？ 此功能应该已取消 结束

                    if (res.data.getTableStatusByNum.length === 0) {
                        wx.navigateTo({
                            url: '../QRorder/QRorder?shop_id=' + shopId + '&table_id=' + tableId,
                        })
                    } else {
                        console.log(res.data.getTableStatusByNum.length, "有订单");
                        wx.navigateTo({
                            url: '../module_others/pages/operation/operation?shopId=' + shopId + '&tableId=' + tableId,
                        })
                    }

                } else {
                    console.log(res.data, "查询桌子没订单");
                    if (res.data.getTableStatusByNum.length === 0) {
                        console.log(res.data.getTableStatusByNum.length, "没订单");
                        wx.navigateTo({
                            url: '../QRorder/QRorder?popup=1&shop_id=' + shopId + '&table_id=' + tableId,
                        })
                    } else {
                        console.log(res.data.getTableStatusByNum.length, "有订单");
                        wx.navigateTo({
                            url: '../module_others/pages/operation/operation?popup=1&shopId=' + shopId + '&tableId=' + tableId,
                        })
                    }
                }
            }
        })

    },
    //只关注当前桌位的订单数，有订单，跳转到选择界面，无订单，跳转到下单界面
    getTableStatusById(shopId, tableId) {
        let that = this
        wx.request({
            url: app.globalData.GetTableStatusByNum_Url,
            data: {
                shopId: shopId,
                tableNum: tableId
            },
            success: res => {
                    if (res.data.getTableStatusByNum.length === 0) {
                        console.log(res.data.getTableStatusByNum.length, "没订单");
                        wx.navigateTo({
                            url: '../QRorder/QRorder?popup=1&shop_id=' + shopId + '&table_id=' + tableId,
                        })
                    } else {
                        console.log(res.data.getTableStatusByNum.length, "有订单");
                        wx.navigateTo({
                            url: '../module_others/pages/operation/operation?popup=1&shopId=' + shopId + '&tableId=' + tableId,
                        })
                    }
                }
            
        })

    },
    //堂食是否拼桌
    pinzhuo: function (e) {
        console.log(e)
        var that = this
        var tableid = Number(e)
        var startingTime;
        that.setData({
            tableid: tableid
        })
        var shopid = that.data.shopid
        console.log("店名ID:" + shopid + "桌位ID:" + tableid)
        //获取完毕，对shop进行判断
        if (shopid == app.globalData.shopid) {
            app.globalData.locationid = tableid
            startingTime = util.formatTime(new Date())
            console.log(that.data.user_id)
            console.log(app.globalData.user_id)
            console.log(sceneValue, "场景值");
            if (sceneValue.scene === 1011) {
                console.log(sceneValue.scene, "场景值-1");
                wx.navigateTo({
                    url: '../module_others/pages/wxPublic/wxPublic?scene=forhere%2C' + shopid + '%2C' + tableid
                })
            } else {
                wx.request({
                    url: app.globalData.GetTableStatusByNum_Url,
                    data: {
                        shopId: shopid,
                        tableNum: tableid
                    },
                    success: res => {
                        console.log(res.data, "第二次进入查询订单");
                        if (res.data.getTableStatusByNum.length === 0) {
                            console.log(res.data.getTableStatusByNum.length, "没订单");
                            wx.navigateTo({
                                url: '../QRorder/QRorder?shop_id=' + that.data.shopid + '&table_id=' + that.data.tableid,
                            })
                        } else {
                            console.log(res.data.getTableStatusByNum.length, "有订单");
                            wx.navigateTo({
                                url: '../module_others/pages/operation/operation?shopName=' + that.data.shopName + '&shopId=' + shopid + '&tableId=' + tableid,
                            })
                        }
                    }
                })
            }           

        } else {
            //不是本店id，进行shop跳转
            that.setData({
                tableid: tableid
            })
            app.globalData.locationid = tableid
            app.globalData.shopid = shopid
        }
    },


    //地图定位方法
    map: function () {
        var that = this
        wx.getSetting({
            success: function (res) {
                console.log(res)
                if (res.authSetting['scope.userLocation'] || res.authSetting['scope.userLocation'] == undefined) {
                    var latitude = that.data.shopdetail.latitude
                    var longitude = that.data.shopdetail.longitude
                    wx.openLocation({
                        latitude: Number(latitude),
                        longitude: Number(longitude),
                        scale: 28,
                    })
                } else {
                    wx.openSetting({
                        success: function (res) {
                            console.log(res)
                        }
                    })
                }
            }
        })
    },

    //预览照片
    photo: function (e) {
        var that = this;
        var items = []
        console.log(e.currentTarget.dataset.index)
        var index = e.currentTarget.dataset.index
        if (e.currentTarget.dataset.arry != undefined) {
            var arry = e.currentTarget.dataset.arry
            for (var i = index; i < arry.length; i++) {
                items.push(arry[i].big_dishes_img)
            }
            for (var j = 0; j < index; j++) {
                items.push(arry[j].big_dishes_img)
            }
        } else if (e.currentTarget.dataset.item != undefined) {
            items.push(e.currentTarget.dataset.img)
        }
        wx.previewImage({
            urls: items,
            success: function (res) {}
        })
    },

    //计时器,用于判断用户是否授权
    authorization: function (res) {
        var that = this
        var countDownNum = 10000
        that.setData({
            timer: setInterval(function () {
                wx.getUserInfo({
                    success: function (res) {
                        if (res.iv) {
                            that.getUserInfo()
                            clearInterval(that.data.timer);
                            //如果用户授权了信息，让计时器取消定时
                            that.setData({
                                showModalStatus1: false
                            })
                        }
                    },
                    fail: function (res) {
                        that.setData({
                            showModalStatus1: true
                        })
                    }
                })
            }, 550) //这里的单位是毫秒，是计时器在倒数时的间隔时间,如果想把闪烁速度调快，把这里的数值调低
        })
    },

    //获取unionid
    getUserInfo: function () {
        var that = this
        console.log(app.globalData.openid, 'openId');
        console.log(app.globalData.unionID, 'unionId');
        that.setData({
            openid: app.globalData.openid,
            unionId: app.globalData.unionID,
        })
        if (that.data.unionId != undefined && that.data.unionId != null) {
            wx.request({
                url: app.globalData.UserLogin_url,
                data: {
                    Open_id: that.data.unionId,
                    Shop_id: app.globalData.shopid ? app.globalData.shopid : that.data.shopid
                },
                success: function (res) {
                    that.getCustomerInfo(that.data.openid) //获取用户信息

                    if (res.data.result == null || res.data.result.result == 0) {
                        wx.request({
                            url: app.globalData.UserRegistration_url,
                            data: {
                                Head_portrait_img: app.globalData.avatarUrl,
                                User_nickname: app.globalData.username,
                                Wx_openid: that.data.unionId,
                                Shop_id: app.globalData.shopid
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
                                // that.updateorderinf(app.globalData.user_id)
                                // that.isCollection() //查询收藏店铺
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

    //打电话方法
    calling: function () {
        var that = this
        if (that.data.shopdetail.contact_number && that.data.shopdetail.contact_number != '无添加') {

            wx.makePhoneCall({
                phoneNumber: that.data.shopdetail.contact_number.split(" ")[0],
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
    //选择照片功能
    imageUpload: function () {
        wx.chooseImage({
            success(res) {
                console.log(res)
            }
        })
    },

    //预约点餐方法
    book: function (e) {
        var that = this
        console.log(e.currentTarget.dataset.index ? e.currentTarget.dataset.index : 666)        
        this.setData({
            toBookingDialog: false,
        })
        if (that.data.bookswitch) {
            that.data.bookswitch = false
            if (app.globalData.username == 'null') {                
                wx.getUserProfile({
                    desc: '用于完善会员资料',
                    success: (res) => {
                        that.data.bookswitch = true
                        let getuserinfoname = res.userInfo.nickName
                        app.globalData.username = getuserinfoname
                        wx.setStorage({
                            key: "userInfoName",
                            data: getuserinfoname,
                            success: (res) => {
                                app.globalData.username = getuserinfoname
                                if (app.globalData.managementData.orderStyleOnline) {
                                    if (that.data.shopdetail.shop_settlement == 0) {
                                        wx.showModal({
                                            title: '提示',
                                            content: '该商铺还未入驻本平台',
                                        })

                                        that.setData({
                                            isIn: false
                                        })
                                    } else {
                                        wx.navigateTo({
                                            url: '../module_others/pages/book/book' + (e.currentTarget.dataset.index ? '?fromYuDing=true' : ''),
                                        })
                                    }
                                } else {
                                    wx.showModal({
                                        title: '提示',
                                        content: '该店尚未开通此项功能',
                                    })
                                }
                            },
                            fail: function (res) {
                                console.log("置入内存错误")
                            }
                        })
                    },
                    fail: (res) => {
                        that.data.bookswitch = true
                        wx.showModal({
                            title: '温馨提示',
                            content: '不授权的话无法点餐哦',
                            success(res) {
                                if (res.confirm) {
                                    console.log('用户点击确定')
                                } else if (res.cancel) {
                                    console.log('用户点击取消')
                                }
                            }
                        })
                    }
                })
                
            } else {
                console.log(app.globalData.managementData)
                if (app.globalData.managementData.orderStyleOnline) {
                    if (that.data.shopdetail.shop_settlement == 0) {
                        wx.showModal({
                            title: '提示',
                            content: '该商铺还未入驻本平台',
                        })

                        that.setData({
                            isIn: false
                        })
                    } else {
                        var eat_in_distance = app.globalData.managementData.eat_in_distance //后台设置的堂食有效距离
                        if (app.globalData.myLongitude == 0 && app.globalData.myLatitude == 0) {
                            wx.showModal({
                                title: '提示',
                                content: '没有授权地理位置信息,不能进行堂食点餐',
                            })
                        } else {
                            wx.request({
                                url: app.globalData.GetDistanceServlet_url,
                                data: {
                                    lat1: app.globalData.shopdetail.latitude,
                                    lng1: app.globalData.shopdetail.longitude,
                                    lat2: app.globalData.myLatitude,
                                    lng2: app.globalData.myLongitude,
                                },
                                success: function (res) {
                                    console.log(res, '当前距离')
                                    console.log(eat_in_distance, '设置距离');
                                    if (app.globalData.BookLocationCheck && eat_in_distance >= res.data) { //实际填大于三千米，由于测试所以填零
                                        wx.showModal({
                                            title: '提示',
                                            content: '距离餐馆太近，无法线上点餐',
                                            showCancel: false,
                                        })
                                        return;
                                    } else {
                                        //aaaaa
                                        wx.navigateTo({
                                            url: '../module_others/pages/book/book' + (e.currentTarget.dataset.index ? '?fromYuDing=true' : ''),
                                        })
                                    }
                                }
                            })
                        }
                    }
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '该店尚未开通此项功能',
                    })
                }
            }
            setTimeout(() => {
                console.log("ok");
                that.data.bookswitch = true
            }, 2000);
        } else {
            console.log("不许点");
        }
    },
    //跳转商户信息页面
    shopinfo: function () {
        wx.navigateTo({
            // url: '../shopinfo/shopinfo',
            url: '../shopdetail/shopdetail',
        })
    },

    //跳转公众号
    helpCenter: function () {
        wx.navigateTo({
            url: '../module_others/pages/wxPublic/out',
        })
    },

    //跳转订单页面
    orders: function () {       
        console.log('userid: ' + app.globalData.user_id + ', username: ' + app.globalData.username)
        wx.getStorage({
            key: "userInfoName",
            success(res) {
                console.log("找到名字");
                var storagearray = new Map()
                var user_id = wx.getStorageSync('user_id')
                var userInfoName = wx.getStorageSync('userInfoName')
                var phonenumber = wx.getStorageSync('phonenumber')
                storagearray.set("user_id", user_id)
                storagearray.set("userInfoName", userInfoName)
                storagearray.set("phonenumber", phonenumber)
                wx.reLaunch({
                    url: '/pages/orders/orders?user_id=' + user_id + '&userInfoName=' + userInfoName + '&phonenumber=' + phonenumber,
                })
            },
            fail(res) {
                wx.getUserProfile({
                    desc: '用于完善会员资料',
                    success: (res) => {
                        console.log(res.userInfo.nickName);
                        var storagearray = new Map()
                        var user_id = wx.getStorageSync('user_id')
                        var userInfoName = res.userInfo.nickName
                        // var phonenumber = wx.getStorageSync('phonenumber')
                        storagearray.set("user_id", user_id)
                        storagearray.set("userInfoName", userInfoName)
                        // storagearray.set("phonenumber",phonenumber)
                        wx.reLaunch({
                            url: '/pages/orders/orders?user_id=' + user_id + '&userInfoName=' + userInfoName,
                        })
                    },
                    fail: (res) => {
                        if(app.globalData.user_id != undefined && app.globalData.user_id !=null && app.globalData.user_id !=''){
                            wx.reLaunch({
                                url: '/pages/orders/orders?user_id=' + app.globalData.user_id + '&userInfoName=' + app.globalData.username,
                            })
                        }else{
                            wx.reLaunch({
                                url: '/pages/orders/orders?user_id=' + wx.getStorageSync('user_id') + '&userInfoName=' + app.globalData.username,
                            })    
                        }
                    }
                })
            }
        })

    },
    //跳转优惠活动页面
    discount: function () {
        wx.navigateTo({
            url: '../discount/discount',
        })
    },
    //跳转自提外卖页面
    TemAct: function () {
        wx.navigateTo({
            url: '../TemAct/TemAct',
        })
    },

    platform(){
        wx.navigateTo({
            url: '../web/web',
        })
    },

    //邀请有奖
    pingtai: function () {
        var that = this;
        wx.navigateTo({
            url: '../invite/invite?shopid=' + that.data.shopid,
        })
        // that.showOut()
    },
    assessment: function () {
        wx.navigateTo({
            url: '../module_others/pages/evaluation/evaluation',
        })
    },
    //跳转龙虾页面
    lobster: function () {
        var that = this;
        // wx.navigateTo({
        //   url: '../lobster/lobster?user_id=25&shop_id=5252&event_id=10&shop_name=aaa'
        // })
        wx.navigateTo({
            url: '../shop_preference/shop_preference',
        })
    },
    //跳转我的页面
    mine: function () {
        let that = this
        wx.navigateTo({
            url: '../mine/mine?shopId=' + that.data.shopdetail.shop_id + '&shopName=' + that.data.shopdetail.shop_name,
        })
    },
    //功能尚未推出，敬请期待
    showtoast: function () {
        wx.showToast({
            title: '敬请期待',
            icon: 'loading',
            duration: 1500,
        })
    },
    //测试
    toMenu1: function () {
        var that = this

        wx.navigateTo({
            url: '/pages/module_others/pages/menu/menu?toMenu=100&checkmenu=1',
        })
        if (that.data.shopdetail.shop_settlement == 0) {
            // wx.showModal({
            //     title: '提示',
            //     content: '该商铺还未入驻本平台',
            // })

            that.setData({
                isIn: false
            })
        } else {

        }
    },
    hall_Bindsubmit: function (e) {
        let that = this
        if (that.data.isOrder) {
            if (e.detail.target.dataset.item.table_status == 0) {
                wx.showToast({
                    title: '房间已订',
                    icon: 'error'
                })
                return
            }
            wx.request({
                url: app.globalData.getOrderCode,
                data: {
                    shop_id: app.globalData.shopid,
                },
                success: function (res) {
                    console.log(res.data.orderCode);
                    app.globalData.orderCode = res.data.orderCode
                    app.globalData.locationid = e.detail.target.dataset.item.table_id
                    app.globalData.locationname = e.detail.target.dataset.item.field_name + " " + e.detail.target.dataset.item.table_name
                    app.globalData.eatin = false
                    app.globalData.atime = util.formatTimeTwo(new Date(), 'h:m')
                    app.globalData.time = util.formatTimeTwo(new Date(), 'h:m')
                    app.globalData.date = util.formatTimeTwo(new Date(), 'Y-M-D')
                    app.globalData.userNum = 1
                    app.globalData.xdswidth = false
                    app.globalData.username = wx.getStorageSync('userInfoName')
                    app.globalData.phonenumber = wx.getStorageSync('phonenumber')
                    app.globalData.dinner_time = util.formatTimeTwo(new Date(), 'Y-M-D') + ' ' + util.formatTimeTwo(new Date(), 'h:m') + ':00'
                    that.setData({
                        showChoose: false
                    })
                    wx.navigateTo({
                        url: '/pages/module_others/pages/menu/menu?locationindex=' + e.detail.target.dataset.item.table_id,
                    })
                }
            })
        } else {
            let b = e.detail.target.dataset.item
            that.selectOrderNum(b.shop_id, b.table_id, b.table_name)
        }

    },
    // console.log(e)
    // console.log(util.formatTimeTwo(new Date(),'Y-M-D'))
    // console.log(util.formatTimeTwo(new Date(),'h:m'))
    // console.log(wx.getStorageSync('phonenumber'))
    // console.log(wx.getStorageSync('userInfoName'))
    // console.log(util.formatTimeTwo(new Date(),'Y-M-D') + ' ' + util.formatTimeTwo(new Date(),'h:m') + ':00')
    table_Bindsubmit(e) {
        let that = this
        console.log(e)
        // return
        if (that.data.isOrder) {
            if (e.detail.target.dataset.item.table_status == 0 || e.detail.target.dataset.item.table_status == 3) {
                wx.showToast({
                    title: '房间已订',
                    icon: 'error'
                })
                return
            }
            wx.request({
                url: app.globalData.getOrderCode,
                data: {
                    shop_id: app.globalData.shopid,
                },
                success: function (res) {
                    console.log(res.data.orderCode);
                    app.globalData.orderCode = res.data.orderCode
                    app.globalData.locationid = e.detail.target.dataset.item.table_id
                    app.globalData.locationname = e.detail.target.dataset.item.field_name + " " + e.detail.target.dataset.item.table_name
                    app.globalData.eatin = false
                    app.globalData.atime = util.formatTimeTwo(new Date(), 'h:m')
                    app.globalData.time = util.formatTimeTwo(new Date(), 'h:m')
                    app.globalData.date = util.formatTimeTwo(new Date(), 'Y-M-D')
                    app.globalData.userNum = 1
                    app.globalData.xdswidth = false
                    app.globalData.username = wx.getStorageSync('userInfoName') ? wx.getStorageSync('userInfoName') : '微信用户'
                    app.globalData.phonenumber = wx.getStorageSync('phonenumber')
                    app.globalData.dinner_time = util.formatTimeTwo(new Date(), 'Y-M-D') + ' ' + util.formatTimeTwo(new Date(), 'h:m') + ':00'
                    that.setData({
                        showChoose: false
                    })
                    wx.navigateTo({
                        url: '/pages/module_others/pages/menu/menu?locationindex=' + e.detail.target.dataset.item.table_id + '&fromYuDing=true',
                    })
                }
            })
        } else {
            let b = e.detail.target.dataset.item
            that.selectOrderNum(b.shop_id, b.table_id, b.table_name)
        }
    },
    //查询桌子订单
    selectOrderNum(shopId, tableId, tableName) {
        let that = this
        wx.request({
            // url: 'http://localhost:8088/evaluation/getTableStatusByNum',
            url: app.globalData.GetTableStatusByNum_Url,
            data: {
                shopId: shopId,
                tableNum: tableId
            },
            success: res => {
                console.log(res);
                if (res.data.getTableStatusByNum.length == 0) {
                    wx.showToast({
                        title: '该桌无订单',
                        icon: 'error'
                    })
                    return
                } else if (res.data.getTableStatusByNum.length == 1) {
                    app.globalData.locationid = tableId
                    app.globalData.locationname = tableName
                    that.setData({
                        bindUser: res.data.getTableStatusByNum[0].customerId,
                    }, () => {
                        that.getFoodDetail(res.data.getTableStatusByNum[0].orderId)
                    })

                } else {
                    wx.navigateTo({
                        url: '../module_others/pages/operation/operation?tableId=' + tableId + '&shopId=' + shopId,
                    })
                }
            }
        })
    },
    //买单点桌跳转详情
    getFoodDetail(orderId) {
        console.log("进入getFoodDetail")
        let that = this
        wx.request({
            // url: 'https://test.fsmbdlkj.com/WX%20Restaurant/GetOrderDetailsNew',
            url: app.globalData.GetOrderDetails_url,
            data: {
                Order_id: orderId
            },
            success: res => {
                console.log(res)
                that.setData({
                    orderDetail: res.data.object
                })
                // that.getOrderInfo()
                wx.request({
                    method: "POST",
                    // url: 'https://test.fsmbdlkj.com/evaluation/SelectOrderAllDetailedByOrderId?order_id=' + orderId,
                    url: app.globalData.SelectOrderAllDetailedByOrderId_url + '?order_id=' + orderId,
                    success: res => {
                        console.log(res)
                        console.log("getFoodDetail成功")
                        that.setData({
                            getOrderInf: res.data.data.orderInf
                        })
                        console.log("前往订单详情")
                        var orderItem = that.data.getOrderInf;
                        console.log("orderItem", orderItem)
                        var preorder_starus = orderItem.preorderStarus
                        var ordercode = orderItem.orderCode
                        var user_count = orderItem.userCount
                        var table_id = orderItem.tableId
                        var total_amount = orderItem.totalAmount
                        var user_id = orderItem.userId
                        var tbc_count = orderItem.tbcCount
                        var shopId = that.data.getOrderInf.shopId
                        app.globalData.table_id = orderItem.tableId
                        app.globalData.table_name = orderItem.tableName
                        if (that.data.bindUser == 0) {
                            wx.navigateTo({
                                url: '../ordersdetail/ordersdetail?isFromBuy=true&isBindUser=true&orderid=' + orderId + '&ordercode=' + ordercode + '&table_id=' + table_id + '&user_count=' + user_count + '&total_amount=' + total_amount + '&user_id=' + user_id + '&preorder_starus=' + preorder_starus + '&tbc_count=' + tbc_count + '&shopId=' + shopId
                            })
                        } else {
                            wx.navigateTo({
                                url: '../ordersdetail/ordersdetail?isFromBuy=true&orderid=' + orderId + '&ordercode=' + ordercode + '&table_id=' + table_id + '&user_count=' + user_count + '&total_amount=' + total_amount + '&user_id=' + user_id + '&preorder_starus=' + preorder_starus + '&tbc_count=' + tbc_count + '&shopId=' + shopId
                            })
                        }

                    }
                })
            }
        })
    },
    //买单   预订扫码
    qrscanForBuy() {
        let that = this
        if (that.data.isOrder) {
            console.log("使用预订扫码");
            wx.scanCode({
                onlyFromCamera: true,
                success: res => {
                    that.sound()
                    if (res.result.indexOf('https://') != -1 && res.result.indexOf('?uuid=') != -1) {
                        if (res.result.indexOf(app.globalData.QRCodeUrl) != -1) {
                            let a = res.result.substring(res.result.indexOf('?') + 6)
                            wx.request({
                                url: app.globalData.getOneQrUuid,
                                data: {
                                    qrUuid: a
                                },
                                method: 'POST',
                                header: {
                                    'content-type': 'application/json' // 默认值
                                },
                                success: res => {
                                    console.log(res)
                                    let c = res.data.data.miniProgram.split("%2C")
                                    console.log(c);
                                    wx.request({
                                        url: app.globalData.getTableNameByTableId,
                                        data: {
                                            tableId: c[2]
                                        },
                                        success: res => {
                                            if (res.data.code == 1) {
                                                let result = res.data.params
                                                if (result.table_name && result.field_name) {
                                                    wx.request({
                                                        url: app.globalData.getOrderCode,
                                                        data: {
                                                            shop_id: app.globalData.shopid,
                                                        },
                                                        success: function (res) {
                                                            console.log(res.data.orderCode);
                                                            app.globalData.orderCode = res.data.orderCode
                                                            app.globalData.locationid = c[2]
                                                            app.globalData.locationname = result.field_name + " " + result.table_name
                                                            app.globalData.eatin = false
                                                            app.globalData.atime = util.formatTimeTwo(new Date(), 'h:m')
                                                            app.globalData.time = util.formatTimeTwo(new Date(), 'h:m')
                                                            app.globalData.date = util.formatTimeTwo(new Date(), 'Y-M-D')
                                                            app.globalData.userNum = 1
                                                            app.globalData.username = wx.getStorageSync('userInfoName') ? wx.getStorageSync('userInfoName') : '微信用户'
                                                            app.globalData.phonenumber = wx.getStorageSync('phonenumber')
                                                            app.globalData.dinner_time = util.formatTimeTwo(new Date(), 'Y-M-D') + ' ' + util.formatTimeTwo(new Date(), 'h:m') + ':00'
                                                            that.setData({
                                                                showChoose: false
                                                            })
                                                            wx.navigateTo({
                                                                url: '/pages/module_others/pages/menu/menu?locationindex=' + c[2],
                                                            })
                                                        }
                                                    })

                                                } else {
                                                    wx.showModal({
                                                        title: '提示',
                                                        content: '请扫描其他桌子'
                                                    })
                                                    return
                                                }
                                            }
                                        }
                                    })


                                    // that.selectOrderNum(c[1], c[2])
                                }
                            })
                            return
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '请扫描' + (res.result.indexOf(app.globalData.QRCodeUrl) != -1 ? '正式服' : '测试服') + '二维码',
                                success(res) {
                                    return
                                }
                            })
                        }
                    }
                }
            })

        } else {
            wx.scanCode({
                onlyFromCamera: true,
                success: res => {
                    that.sound()
                    if (res.result.indexOf('https://') != -1 && res.result.indexOf('?uuid=') != -1) {
                        if (res.result.indexOf(app.globalData.QRCodeUrl) != -1) {
                            let a = res.result.substring(res.result.indexOf('?') + 6)
                            wx.request({
                                url: app.globalData.getOneQrUuid,
                                data: {
                                    qrUuid: a
                                },
                                method: 'POST',
                                header: {
                                    'content-type': 'application/json' // 默认值
                                },
                                success: res => {
                                    console.log(res)
                                    let c = res.data.data.miniProgram.split("%2C")
                                    that.selectOrderNum(c[1], c[2])
                                }
                            })
                            return
                        } else {
                            wx.showModal({
                                title: '提示',
                                content: '请扫描' + (res.result.indexOf(app.globalData.QRCodeUrl) != -1 ? '正式服' : '测试服') + '二维码',
                                success(res) {
                                    return
                                }
                            })
                        }
                    }
                }
            })
        }
    },
    //获取菜单
    getmenu: function () {
        var that = this
        var menuListItem = []
        wx.request({
            url: app.globalData.Getmenu_url,
            data: {
                Shop_id: app.globalData.shopid
            },
            success: function (res) {
                console.log(res.data.object)
                //取出菜单下所有菜品
                for (var a = 0; a < res.data.object[0].length; a++) {
                    for (var b = 0; b < res.data.object[0][a].class1s.length; b++) {
                        for (var c = 0; c < res.data.object[0][a].class1s[b].class2.length; c++) {
                            for (var d = 0; d < res.data.object[0][a].class1s[b].class2[c].dishesInfs.length; d++) {
                                menuListItem.push(res.data.object[0][a].class1s[b].class2[c].dishesInfs[d])
                            }
                        }
                    }
                }
                //仅取出第一级类别第一项、第二级类别第一项、第三级类别第一项下的菜品
                if (res.data.object[0] != "") { // 这里为进去菜单页面看到的菜品
                    var menuItem = []
                    for (var j = 0; j < res.data.object[1][0].class1s[0].parent_type_dishesInfList.length; j++)
                        menuItem.push(res.data.object[1][0].class1s[0].parent_type_dishesInfList[j])


                    wx.setStorage({
                        key: 'menu',
                        data: res.data.object[0],
                    })
                    wx.setStorage({
                        key: 'menu1',
                        data: res.data.object[1],
                    })
                    wx.setStorage({
                        key: 'menuItem',
                        data: menuItem,
                    })
                    wx.setStorage({
                        key: 'menuListItem',
                        data: menuListItem,
                    })

                    // 注解，星盾折扣菜现在和特价菜是没有区别的
                    that.setData({
                        menuListItem: menuListItem,
                    })

                    that.setData({
                        menuList: res.data.object[0]
                    })
                    // that.getSetMeal()
                    // that.getSetMeal2()
                    that.getSetMeal3()
                } else {
                    console.log("该店没有录入菜品")
                    wx.removeStorageSync('menu')
                    wx.removeStorageSync('menu1')
                    wx.removeStorageSync('menuItem')
                    wx.removeStorageSync('menuListItem')
                }
            }
        })
    },


    // 修改订单信息
    updateorderinf: function (user_id) {
        var that = this
        var orderid_update = that.data.orderid_update
        var shopid_update = that.data.shopid_update
        if (orderid_update != undefined && shopid_update != undefined && orderid_update != '' && shopid_update != '') {
            console.log(orderid_update)
            console.log(shopid_update)
            console.log(user_id)
            wx.request({
                url: app.globalData.UpdateOrderInf_url,
                data: {
                    Order_id: orderid_update,
                    Shop_id: shopid_update,
                    User_id: user_id
                },
                success: function (res) {
                    console.log(res)
                }
            })
        }
    },


    //获得所有大厅、包厢、桌子的信息
    getallfield: function () {
        wx.request({
            url: app.globalData.GetTablesInf_url,
            data: {
                Shop_id: app.globalData.shopid
            },
            success: function (res) {
                app.globalData.field = res.data.object
            }
        })
    },

    // 获取商店环境照片
    selectShopDetails: function () {
        var that = this
        wx.request({
            url: app.globalData.SelectPhotoServlet_url,
            data: {
                shop_id: app.globalData.shopid
            },
            success: function (res) {
                var facade = []
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].quyu.indexOf('门面') != -1) {
                        facade.push(res.data[i].value)
                    }
                }
                that.setData({
                    facade: facade,
                    //  topimage: facade[0]
                })
            }
        })
        // wx.request({
        //   url: app.globalData.SelectShopDetails_url,
        //   data: {
        //     shop_id: app.globalData.shopid
        //   },
        //   success: function (res) {
        //     //  that.getserver(res.data[0].shop_name, res.data[0].shop_address)
        //     wx.request({
        //       url: app.globalData.SelectPhotoServlet_url,
        //       data: {
        //         shop_id: app.globalData.shopid
        //       },
        //       success: function (res) {
        //         var facade = []
        //         for (var i = 0; i < res.data.length; i++) {
        //           if (res.data[i].quyu.indexOf('门面') != -1) {
        //             facade.push(res.data[i].value)
        //           }
        //         }
        //         that.setData({
        //           facade: facade,
        //           //  topimage: facade[0]
        //         })
        //       }
        //     })
        //   },
        // })
    },

    //获取屏幕高度
    getheight: function (res) {
        let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
        let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
        this.setData({
            scroll_height: windowHeight * 750 / windowWidth - 480
        })
    },

    //邀请函弹窗
    showModalStatus: function () {
        this.setData({
            isFromTreat: !this.data.isFromTreat
        })
    },

    //获取营业状态
    getoperatingstate: function () {
        var that = this
        var operatingstate //营业状态
        wx.request({
            url: app.globalData.ManagementGetShopStateServlet_url,
            data: {
                shop_id: app.globalData.shopid
            },
            success: function (res) {
                that.setData({
                    operatingstate: res.data
                })
            }
        })
    },
    getOperatingTime: function () {
        var that = this
        wx.request({
            url: app.globalData.ManagementGetEasyDateServlet_url,
            data: {
                shop_id: app.globalData.shopid
            },
            success: function (res) {
                if (res.data == "101") {
                    that.setData({
                        operatingTime: '没有设置时间'
                    })
                } else {
                    that.setData({
                        operatingTime: res.data
                    })
                }
            }
        })
    },
    showOut: function (e) {
        var that = this
        that.setData({
            show: true
        })
        console.log(111)
    },

    init123: function (e) {
        var object = {
            "shopId": app.globalData.shopid,
            "unionid": app.globalData.unionID,
        }
        wx.request({
            url: app.globalData.allUrl.GetQgqcMainPageData,
            data: JSON.stringify(object),
            method: {
                shopId: app.globalData.shopid,
                unionid: app.globalData.unionID,
            },
            success: function (res) {
                console.log(res.data)
                that.getShopWIFI(app.globalData.shopid)                
            }
        })
    },

    init() {
        let that = this
        wx.request({
            url: app.globalData.allUrl.GetQgqcMainPageData,
            data: {
                shop_id: app.globalData.shopid,
                unionid: app.globalData.unionID,
            },
            success: function (res) {
                app.globalData.shopdetail.shop_id = app.globalData.shopid               
                that.getShopWIFI(app.globalData.shopid)                
                switch (res.data.object.shop.star) {
                    case 6:
                        that.setData({
                            starimage: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/6star.png'
                        })
                        break;
                    case 5:
                        that.setData({
                            starimage: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/5star.png'
                        })
                        break;
                    case 4:
                        that.setData({
                            starimage: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/4star.png'
                        })
                        break;
                    case 3:
                        that.setData({
                            starimage: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/3star.png'
                        })
                        break;
                    case 2:
                        that.setData({
                            starimage: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/2star.png'
                        })
                        break;
                    case 1:
                        that.setData({
                            starimage: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/1star.png'
                        })
                        break;
                    case 0:
                        that.setData({
                            starimage: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/0star.png'
                        })
                        break;
                }
                let type_name = "";
                let allShopType = app.globalData.allShopType
                if (res.data.object.shop.shop_type != null) {
                    var type_id = res.data.object.shop.shop_type.split(",")
                    for (var i = 0; i < type_id.length; i++) {
                        for (var i2 = 0; i2 < allShopType.length; i2++) {
                            if (type_id[i] == allShopType[i2].name) {
                                if (type_name != "") {
                                    type_name = type_name + ',' + allShopType[i2].name
                                } else {
                                    type_name = allShopType[i2].name
                                }
                            }
                        }
                    }
                }
                that.setData({
                    shop_type_value: type_name
                })               
                that.setData({
                    isIn: res.data.object.shop.shop_settlement == 0 ? false : true,
                    topimage: res.data.object.shop.shop_img,
                    operatingstate: res.data.object.shopState,
                    shopdetail: res.data.object.shop,
                    operatingTime: res.data.object.operatingTime,
                    isCollection: res.data.object.isfavoriteShop,
                },()=>{
                  wx.request({
                    url: app.globalData.SelectPhoto,
                    data: {
                      shop_id: app.globalData.shopid,
                    },
                    success: res=>{
                      if(res.data.result.result == 1){
                         let list = res.data.object;
                         let videoList = [];
                         for(let item of list){
                           if(item.type_id == 2 && item.quyu.indexOf('店铺视频介绍') != -1){
                            videoList.push(item);
                           }
                         }

                         that.setData({
                           videoList
                         })
                      }
                    }
                  })
                })

                app.globalData.shopdetail = res.data.object.shop
                app.globalData.managementData = res.data.object.shopSetUp
                app.globalData.searchInterval = res.data.object.shopSetUp.interval_search
                setTimeout((res2 => {
                    that.setData({
                        set_meal: res.data.object.lstSetMealForNum,
                    })
                }), 10)
                setTimeout((res2 => {
                    that.setData({
                        menuList_specialty: res.data.object.lstxdSequenceDishesInfList,
                    })
                }), 20)
                setTimeout((res3 => {
                    that.setData({
                        menuList_recommend: res.data.object.lstdishes_recommendSequenceDishesInfList,
                    })
                }), 30)
                setTimeout((res4 => {
                    that.setData({
                        menuList_new: res.data.object.lstdishes_specialtySequenceDishesInfList,
                        menuList_discount: res.data.object.lstnewDishesSequenceDishesInfList,
                    })
                    if (!that.data.fromQR) {
                        wx.hideLoading({
                            success: (res) => {},
                        })
                    }
                    that.getallfield()
                    if (that.getMenuCallBack) {
                        that.getMenuCallBack(true)
                    }
                }), 40)
                if (res.data.object.shop.service_items) {
                    var result = res.data.object.shop.service_items.split(",")
                    var serive = []
                    var meal = []
                    for (var i = 0; i < result.length; i++) {
                        if (result[i] == '早茶' || result[i] == '午餐' || result[i] == '午茶' || result[i] == '晚餐' || result[i] == '夜市' || result[i] == '外卖') {
                            meal.push(result[i])
                        } else {
                            serive.push(result[i])
                        }
                    }
                    that.setData({
                        meal: meal,
                        serive: serive
                    })
                } else {
                    console.log("没有设置服务项目")
                }
            }
        })

    },
    getShopWIFI(shop_id) {
        var that = this;
        wx.request({
            url: app.globalData.SelectShopDetails_url,
            data: {
                shop_id: shop_id,
            },
            success: res => {
                console.log(res.data[0].shop_name);
                if (res.data != '') {
                    that.setData({
                        wifiName: res.data[0].wifiName,
                        wifiPW: res.data[0].wifiPW
                    })
                }
            }
        })
    },
    connectShopWIFI() {
        wx.showLoading({
            title: '连接中...',
            mask: true,
            success: res => {
                wx.startWifi({
                    success: res => {
                        wx.connectWifi({
                            SSID: this.data.wifiName,
                            password: this.data.wifiPW,
                            success: res => {
                                console.log(res.errMsg)
                                if (res.errCode != 0) {
                                    console.log(res)
                                    wx.showModal({
                                        content: '连接失败，请寻求店员帮助',
                                        showCancel: false,
                                    })
                                    wx.hideLoading()
                                } else {
                                    wx.showModal({
                                        content: '已成功连接至店铺WIFI[' + this.data.wifiName + ']',
                                        showCancel: false,
                                    })
                                    wx.hideLoading()
                                    this.setData({
                                        isConnect: true
                                    })
                                }
                            },
                            fail: res => {
                                console.log(res)
                                wx.showModal({
                                    content: '连接失败，请寻求店员帮助',
                                    showCancel: false
                                })
                                wx.hideLoading()
                            }
                        })
                    },
                    fail: res => {
                        wx.showModal({
                            content: '您的设备不支持该功能',
                            showCancel: false
                        })
                        wx.hideLoading()
                    }
                })
            }
        })
    },

    onLoad: function (options) {
        var that = this;
        if (options.shopid) {
            that.setData({
                shopid: options.shopid,
                isWeb: true,
                fromQR: options.fromQR,
                QRTableId: options.fromQR ? options.QRTableId : null
            })
            app.globalData.shopid = options.shopid            
            wx.login({
                success: function (res) {
                    if (res.code) {
                        var code = res.code
                        wx.getUserInfo({
                            success: function (res) {                                
                                that.setData({
                                    avatarUrl: res.userInfo.avatarUrl,
                                    nickName: res.userInfo.nickName
                                })
                                app.globalData.encryptedData = res.encryptedData
                                app.globalData.iv = res.iv
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
                                        if (that.data.dy_flesh) {
                                            that.setData({
                                                dy_flesh: false
                                            })
                                        }
                                        app.globalData.unionID = res.data.data.unionId
                                        app.globalData.openid = res.data.data.openid
                                        var customerInfo=res.data.data.customer;
                                        console.log('customerInfo:');
                                        console.log(customerInfo);
                                        app.globalData.caustomerId = customerInfo.id
                                        app.globalData.customerInf = customerInfo
                                        app.globalData.user_phone = customerInfo.phone
                                        app.globalData.user_name = customerInfo.name  

                                       
                                        let promise = new Promise(resolve => {
                                            app.getCustomerInfo(res.data.data.openid)
                                            resolve();
                                        })
                        
                                        promise.then(resolve => {
                                            wx.getLocation({
                                                type: 'wgs84',
                                                success: function (res) {
                                                    app.globalData.myLongitude = res.longitude
                                                    app.globalData.myLatitude = res.latitude
                                                    
                                                    //添加进入小程序的记录(获取经纬度)
                                                    wx.request({                                                    
                                                        url: app.globalData.addLocationHistory,
                                                        method: 'POST',
                                                        data: {
                                                            customerId: app.globalData.customerInf.id,
                                                            longitude: res.longitude,
                                                            latitude: res.latitude
                                                        },
                                                        success: res => {                           
                                                        }
                                                    })
                                                }
                                            })
                                        })

                                        that.getUserInfo()                                 
                                        that.init()
                                            
                                        if (that.data.QRTableId) {
                                            that.toBooking()
                                        }
                                        that.getMenuCallBack = (bool) => {
                                            if (bool) {
                                                app.getmenu()
                                            }
                                        }

                                    }
                                    
                                })
                            },
                            fail: function (res) {
                                console.log('获取unionId失败，用户未授权')
                                that.setData({
                                  dy_flesh: true
                                })             
                            },
                        })                        
                    }
                }
            })
            if (options.isFromTreat) {
                that.setData({
                    treatOrderId: options.orderId,
                    titles: options.title,
                    isFromTreat: options.isFromTreat,
                    senderOpenid: options.senderOpenid,
                    sendContent: options.sendContent,
                    senderCustomerId: options.senderCustomerId,
                    isShowMenu: options.isShowMenu
                })
                wx.request({
                    url: app.globalData.GetOrderDetails_url,
                    data: {
                        Order_id: options.orderId
                    },
                    success: res => {
                        let arr = res.data.object
                        let showMenuContent = ''
                        if (arr.length > 5) {
                            arr.splice(5, arr.length - 5);
                            arr.forEach(val => {
                                showMenuContent += ',' + val.dishes_name
                            });
                            showMenuContent = showMenuContent.substr(1)
                            showMenuContent += "……"
                        } else {
                            arr.forEach(val => {
                                showMenuContent += ',' + val.dishes_name
                            });
                            showMenuContent = showMenuContent.substr(1)
                        }
                        that.setData({
                            showMenuContent: showMenuContent
                        })
                    }
                })
            }
        }else{
            that.getUserInfo()       
            that.init()
        }
        that.getMenuCallBack = (bool) => {
            if (bool) {
                app.getmenu()
            }
        }

        that.setData({
            shopid: app.globalData.shopid
        })
        
        that.sv_flesh()
        that.getheight()        
        app.globalData.adddishes = true
        app.globalData.cartList = []
        app.globalData.countarry = []
        app.globalData.weightarry = []
        app.globalData.userNum = ''
        app.globalData.date = ''
        app.globalData.time = ''
        app.globalData.atime = ''
        app.globalData.username = ''
        app.globalData.phonenumber = ''
        app.globalData.locationname = ''
        app.globalData.locationid = ''
        app.globalData.cartList = []
        app.globalData.sumMonney = 0
        app.globalData.cupNumber = 0
        
        if (app.globalData.username == '') {
            wx.getStorage({
                key: "userInfoName",
                success(res) {
                    console.log(res.data);
                    app.globalData.username = res.data
                    console.log(app.globalData.username);
                },
                fail(res) {
                    app.globalData.username = "null"
                }
            })
        }       
        
        var bottom_bg_list = that.data.bottom_bg_list
        var index = Math.floor((Math.random() * bottom_bg_list.length));
        var bbp = bottom_bg_list[index].img
        console.log(bbp)
        that.setData({
            bbp: bbp
        })

    },

    toMyMessage() {
        wx.navigateTo({
            url: '../mymessage/mymessage?shopId=' + this.data.shopid + '&customerId=' + app.globalData.customerInf.id,
        })
    },
    
    getCustomerInfo(openid) {
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
                        if(!res.data.name){
                          that.setData({
                            isShowGetAvatar: true
                          })
                        }
                        app.globalData.caustomerId = res.data.id
                        app.globalData.customerInf = res.data
                        app.globalData.user_phone = res.data.phone
                        app.globalData.user_name = res.data.name
                        
                        if (that.data.isFromTreat) {
                            let data1 = {}
                            data1 = {
                                shopId: that.data.shopid,
                                senderOpenid: that.data.senderOpenid,
                                sendContent: that.data.sendContent ? that.data.sendContent : 0,
                                senderCustomerId: that.data.senderCustomerId,
                                receiveCustomerId: app.globalData.customerInf.id,
                                receiveOpenid: that.data.openid,
                                orderId: that.data.treatOrderId,
                                isShowMenu: that.data.isShowMenu ? 1 : 0,
                            }

                            wx.request({
                                url: app.globalData.addTreatInfo,
                                // url: 'http://192.168.8.5:8088/evaluation/addTreatInfo',
                                method: 'POST',
                                data: data1,
                                header: {
                                    'content-type': 'application/json'
                                },
                                success: res => {
                                    console.log(res, "接收请客消息成功");
                                }
                            })
                        }
                    } else {
                        console.log('未注册');
                    }

                },
                fail: function (res) {
                    console.log('查询是否注册失败' + res);
                },
            })
        } else {
            console.log('未授权')
        }

    },
    getRemarkNormal: function () {
        var that = this
        if (app.globalData.remark_normal.length > 0) {
            return;
        }
        WXAPI.getDefaultRemark({
            shop_id: app.globalData.shopid,
            remarkType: 1
        }).then(function (data) {
            var remark_normal = []
            if (data.result.result == 1) {
                console.log("获取常用备注模板成功")
                for (var x of data.object) {
                    var item = {
                        value: x.defaultRemark,
                        checked: false
                    }
                    remark_normal.push(item)
                }
            }
            app.globalData.remark_normal = remark_normal
        })

        WXAPI.getDefaultRemark({
            shop_id: app.globalData.shopid,
            remarkType: 2
        }).then(function (data) {
            var remark_cancel = []
            if (data.result.result == 1) {
                console.log("获取取消备注模板成功")
                for (var x = 0; x < data.object.length; x++) {
                    var item = {
                        value: data.object[x].defaultRemark,
                        index: x
                    }
                    remark_cancel.push(item)
                }
                remark_cancel.push({
                    value: "其他原因",
                    index: data.object.length
                })
            } else {
                remark_cancel.push({
                    value: "其他原因",
                    index: 0
                })
            }
            app.globalData.remark_cancel = remark_cancel
        })

        WXAPI.getDefaultRemark({
            shop_id: app.globalData.shopid,
            remarkType: 3
        }).then(function (data) {
            var remark_gift = []
            if (data.result.result == 1) {
                console.log("获取赠送备注模板成功")
                for (var x = 0; x < data.object.length; x++) {
                    var item = {
                        value: data.object[x].defaultRemark,
                        index: x
                    }
                    remark_gift.push(item)
                }
                remark_gift.push({
                    value: "其他原因",
                    index: data.object.length
                })
            } else {
                remark_gift.push({
                    value: "其他原因",
                    index: 0
                })
            }
            app.globalData.remark_gift = remark_gift

        })

        WXAPI.getDefaultRemark({
            shop_id: app.globalData.shopid,
            remarkType: 4
        }).then(function (data) {
            var remark_taste = []
            if (data.result.result == 1) {
                console.log("获取口味列表成功")
                for (var x = 0; x < data.object.length; x++) {
                    var item = {
                        value: data.object[x].defaultRemark,
                        checked: false
                    }
                    remark_taste.push(item)
                }
            }

            app.globalData.remark_taste = remark_taste
        })

    },

    perform: function (tableid) {
        var that = this;
        if (that.data.user_id) {
            that.pinzhuo(tableid)
        } else {
            setTimeout(function () {
                that.perform(tableid)
            }, 1000)
        }
    },

    selectShopType: function () {
        var that = this
        wx.request({ //店铺的类型信息回显，
            url: app.globalData.SelectGpsServlet_url,
            data: {
                shop_id: that.data.shopid,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                var type_name = "";
                let allShopType = app.globalData.allShopType
                if (res.data[0].shop_type != null) {
                    var type_id = res.data[0].shop_type.split(",")
                    for (var i = 0; i < type_id.length; i++) {
                        for (var i2 = 0; i2 < allShopType.length; i2++) {
                            if (Number(type_id[i]) == Number(allShopType[i2].id)) {
                                if (type_name != "") {
                                    type_name = type_name + ',' + allShopType[i2].name
                                } else {
                                    type_name = allShopType[i2].name
                                }
                            }
                        }
                    }
                }
                that.setData({
                    shop_type_value: type_name
                })
                // wx.hideToast();
            }
        })
    },




    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        var that = this
        //is_video_show
        this.setData({
          is_video_show:app.globalData.is_video_show,
        })
        // that.getDishesSequence1()
        // that.getDishesSequence2()
        // that.getDishesSequence3()
        // that.getDishesSequence4()
        //常用备注，下单设置菜单备注需要
        that.getRemarkNormal();
        if (app.globalData.unionID != null) {
            // that.isCollection() //查询收藏店铺
        }
    },
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
      this.videoContext = wx.createVideoContext('sVideo')
    },
    onHide: function () {
        if (typeof app.globalData.user_id == undefined || app.globalData.user_id == undefined) {
            this.getUserInfo()
        }
    },

    sound: function () {
        console.log('播放音效')
        const innerAudioContext = wx.createInnerAudioContext(); //新建一个createInnerAudioContext();
        innerAudioContext.autoplay = true; //音频自动播放设置
        innerAudioContext.src = '/audio/sound.mp3'; //链接到音频的地址

        innerAudioContext.onPlay(() => {}); //播放音效

        innerAudioContext.onError((res) => { //打印错误
            console.log(res.errMsg); //错误信息
            console.log(res.errCode); //错误码
        })

    },
    jump: function (e) {
        //点击对应的地方跳转到对应的页面,从setdata里面获取标识
        //djq跳转到代金券页面,tc跳转到套餐页面,cp跳到菜品
        var that = this;
        var type = e.currentTarget.dataset.type;
        if (type == "cp") {
            console.log(e)
            var ptid = e.currentTarget.dataset.arry[e.currentTarget.dataset.index].parent_type_id;
            var ciid = e.currentTarget.dataset.arry[e.currentTarget.dataset.index].class_i_id;
            wx.navigateTo({
                url: '/pages/module_others/pages/menu/menu?ptid=' + ptid + '&ciid=' + ciid,
            })
        } else if (type == 'djq') {
            wx.navigateTo({
                // url: '../superCoupon/superCoupon', 
                url: '../greatvalueworld/greatvalueworld',
            })
        } else if (type == 'tc') {
            wx.navigateTo({
                // url: '../SetMeal/SetMeal',
                url: '../greatvalueworld/greatvalueworld',
            })
        }
    },
    //拒绝授权，返回首页
    refused: function (res) {
        let that = this
        app.globalData.isAuthorize = false
        app.globalData.isRegister = false

        wx.navigateBack({
            delta: 1
        })

    },

    
    getSetMeal3: function () {
        var that = this;
        var set_meal = [];
        console.log(app.globalData.shopdetail.shop_id)
        wx.request({ //店铺的类型信息回显，
            url: app.globalData.selectSetmealForNum_url,
            data: {
                pageNum: 0,
                shop_id: that.data.shopid,
            },
            header: {
                'content-type': 'application/json' // 默认值
            },
            method: 'POST',
            success: function (res) {
                console.log(res)
                if (res.data.selectResult && res.data != null && res.data != '') {
                    set_meal = res.data.selectResult
                    that.setData({
                        set_meal: set_meal
                    })
                } else {
                    that.setData({
                        showcoupon: true
                    })
                }
            }
        })
    },

    // getCoupon: function () {
    //     wx.showLoading({
    //         title: '加载中...',
    //     })
    //     var that = this;
    //     var RD = that.data.RD //优惠券顶值判断
    //     console.log(app.globalData.shopid)
    //     if (!RD) {
    //         wx.request({ //店铺的类型信息回显，
    //             url: app.globalData.SelectcouponInfForNum_url,
    //             data: {
    //                 "pageNum": that.data.couponPageNum,
    //                 "shop_id": app.globalData.shopid
    //             },
    //             header: {
    //                 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
    //             },
    //             method: 'POST',
    //             success: function (res) {
    //                 console.log(res)
    //                 if (res.data.object && res.data.object != null && res.data.object != '' && res.data.object != undefined) {
    //                     var couponPageNum = that.data.couponPageNum + 20
    //                     var coupon = res.data.object
    //                     that.setData({
    //                         coupon: coupon,
    //                         couponPageNum: couponPageNum
    //                     })
    //                     if (res.data.object.length < 20 && !that.data.isWeb) {
    //                         that.setData({
    //                             RD: true
    //                         })
    //                     }
    //                 } else {
    //                     that.getRandomDishes();
    //                     if (!that.data.fromQR) {
    //                         wx.hideLoading({
    //                             success: (res) => {},
    //                         })
    //                     }
    //                 }
    //                 if (that.caiPinCallBack) {
    //                     that.caiPinCallBack(true)
    //                 }
    //             }
    //         })
    //     } else {
    //         that.getRandomDishes();
    //         if (!that.data.fromQR) {
    //             wx.hideLoading({
    //                 success: (res) => {},
    //             })
    //         }
    //     }
    // },
    getSetMealAllInfo() {
        let that = this
        let ListA = that.data.foodList;
        that.setData({
            foodRefresh: false,
        })
        wx.request({
            url: app.globalData.selectAllSetMealInfo_url,
            data: {
                shopId: that.data.shopid,
                typeForSetMeal: 2,
                pageIndex: that.data.pageNum1,
                pageSize: that.data.pageSize,
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                console.log(res);
                if (res.data.result == 0) {
                    that.setData({
                        wineRefresh: true
                    })
                    that.sv_flesh()
                } else {
                    if (res.data.selectResult.length < that.data.pageSize) {
                        that.setData({
                            wineRefresh: true
                        })
                    }
                    if (res.data.selectResult.length == that.data.pageSize) {
                        that.setData({
                            foodRefresh: true
                        })
                    }
                    for (const x of res.data.selectResult) {
                        if (x.useTimeType) {
                            let usefulDate = x.useTimeType
                            if (usefulDate.substr(usefulDate.length - 1, 1) == ',') {
                                usefulDate = usefulDate.substr(0, usefulDate.length - 1)
                            }
                            var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5', '3,4', '4,5,6,7', '4,5,6', '4,5', '5,6,7', '5,6', '6,7']
                            if (shit.indexOf(usefulDate) != -1) {
                                var day = usefulDate.substring(0, 1).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六') + ' 至 星期' + usefulDate.substring(usefulDate.length - 1, usefulDate.length).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六').replace('7', '日')
                                x.useTimeType = '星期' + day + ' 可用'
                            } else {
                                usefulDate = usefulDate.split(',')
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
                                x.useTimeType = '星期' + day.substring(0, day.length - 1) + '可用'
                            }
                        }

                        ListA.push(x)
                    }
                    that.setData({
                        pageNum1: Number(that.data.pageNum1) + 1,
                        foodList: ListA,
                    })
                }
            }
        })
    },
    getCouponAll() {
        let that = this
        let ListC = that.data.couponList
        that.setData({
            couponRefresh: false,
        })
        wx.request({
            url: app.globalData.getCouponAllPage_url,
            data: {
                shopId: that.data.shopid,
                pageSize: that.data.pageSize,
                pageIndex: that.data.pageNum2,
            },
            success: res => {
                if (res.data.paramsList.length >= that.data.pageSize) {
                    that.setData({
                        couponRefresh: true
                    })
                }
                if (res.data.paramsList.length == 0) {
                    that.setData({
                        foodRefresh: true,
                    }, () => {
                        that.sv_flesh()
                    })

                } else {
                    if (res.data.paramsList.length < that.data.pageSize) {
                        that.setData({
                            foodRefresh: true,
                        }, () => {
                            that.sv_flesh()
                        })
                    }
                    for (const x of res.data.paramsList) {
                        if (x.coupon_ruleweekstar) {
                            let usefulDate = x.coupon_ruleweekstar
                            if (usefulDate.substr(usefulDate.length - 1, 1) == ',') {
                                usefulDate = usefulDate.substr(0, usefulDate.length - 1)
                            }
                            var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5', '3,4', '4,5,6,7', '4,5,6', '4,5', '5,6,7', '5,6', '6,7']
                            if (shit.indexOf(usefulDate) != -1) {
                                var day = usefulDate.substring(0, 1).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六') + ' 至 周' + usefulDate.substring(usefulDate.length - 1, usefulDate.length).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六').replace('7', '日')
                                x.coupon_ruleweekstar = '周' + day + ' 可用'
                            } else {
                                usefulDate = usefulDate.split(',')
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
                                x.coupon_ruleweekstar = '周' + day.substring(0, day.length - 1) + '可用'
                            }
                        }

                        x.coupon_validityend = util.formatTime3(x.coupon_validityend, 'Y-M-D')
                        x.coupon_facevalue = util.toFix(x.coupon_facevalue)
                        x.coupon_original = x.coupon_original.toFixed(2)
                        if (x.coupon_type != '45336A43-93C8-48A1-8DE9-90C0258FA548') {
                            ListC.push(x)
                        }
                    }
                    that.setData({
                        pageNum2: Number(that.data.pageNum2) + 1,
                        couponList: ListC
                    })
                }
            }
        })
    },
    getComboList() {
        let that = this
        let ListD = that.data.comboList;
        that.setData({
            comboRefresh: false,
        })
        wx.request({
            url: app.globalData.selectAllSetMealInfo_url,
            data: {
                shopId: that.data.shopid,
                typeForSetMeal: 1,
                pageIndex: that.data.pageNumCombo,
                pageSize: that.data.pageSize,
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                console.log(res);
                if (res.data.result == 0) {
                    that.setData({
                        randomDishesRefresh: true
                    }, () => {
                        that.sv_flesh()
                    })
                } else {
                    if (res.data.selectResult.length < that.data.pageSize) {
                        that.setData({
                            randomDishesRefresh: true
                        }, () => {
                            that.sv_flesh()
                        })
                    }
                    if (res.data.selectResult.length == that.data.pageSize) {
                        that.setData({
                            comboRefresh: true
                        })
                    }
                    for (const x of res.data.selectResult) {
                        if (x.useTimeType) {
                            let usefulDate = x.useTimeType
                            if (usefulDate.substr(usefulDate.length - 1, 1) == ',') {
                                usefulDate = usefulDate.substr(0, usefulDate.length - 1)
                            }
                            var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5', '3,4', '4,5,6,7', '4,5,6', '4,5', '5,6,7', '5,6', '6,7']
                            if (shit.indexOf(usefulDate) != -1) {
                                var day = usefulDate.substring(0, 1).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六') + ' 至 星期' + usefulDate.substring(usefulDate.length - 1, usefulDate.length).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六').replace('7', '日')
                                x.useTimeType = '星期' + day + ' 可用'
                            } else {
                                usefulDate = usefulDate.split(',')
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
                                x.useTimeType = '星期' + day.substring(0, day.length - 1) + '可用'
                            }
                        }

                        ListD.push(x)
                    }
                    that.setData({
                        pageNumCombo: Number(that.data.pageNumCombo) + 1,
                        comboList: ListD,
                    })
                }
            }
        })
    },
    getWineList() {
        let that = this
        let ListA = that.data.wineList;
        that.setData({
            wineRefresh: false,
        })
        // 888
        wx.request({
            url: app.globalData.selectAllSetMealInfo_url,
            data: {
                shopId: that.data.shopid,
                typeForSetMeal: 3,
                pageIndex: that.data.pageNum3,
                pageSize: that.data.pageSize,
            },
            method: "POST",
            header: {
                'content-type': 'application/json'
            },
            success: res => {
                console.log(res);
                if (res.data.result == 0) {
                    that.setData({
                        comboRefresh: true
                    })
                    that.sv_flesh()
                } else {
                    if (res.data.selectResult.length < that.data.pageSize) {
                        that.setData({
                            comboRefresh: true
                        })
                    }
                    if (res.data.selectResult.length == that.data.pageSize) {
                        that.setData({
                            wineRefresh: true
                        })
                    }
                    for (const x of res.data.selectResult) {
                        if (x.useTimeType) {
                            let usefulDate = x.useTimeType
                            if (usefulDate.substr(usefulDate.length - 1, 1) == ',') {
                                usefulDate = usefulDate.substr(0, usefulDate.length - 1)
                            }
                            var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5', '3,4', '4,5,6,7', '4,5,6', '4,5', '5,6,7', '5,6', '6,7']
                            if (shit.indexOf(usefulDate) != -1) {
                                var day = usefulDate.substring(0, 1).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六') + ' 至 星期' + usefulDate.substring(usefulDate.length - 1, usefulDate.length).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六').replace('7', '日')
                                x.useTimeType = '星期' + day + ' 可用'
                            } else {
                                usefulDate = usefulDate.split(',')
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
                                x.useTimeType = '星期' + day.substring(0, day.length - 1) + '可用'
                            }
                        }

                        ListA.push(x)
                    }
                    that.setData({
                        pageNum3: Number(that.data.pageNum3) + 1,
                        wineList: ListA,
                    })
                }
            }
        })
    },
    //下拉刷新
    sv_flesh(e) {
        let that = this
        if (that.data.foodRefresh) {
            that.getSetMealAllInfo()
        } else if (that.data.couponRefresh) {
            that.getCouponAll()
        } else if (that.data.comboRefresh) {
            that.getComboList()
        } else if (that.data.randomDishesRefresh) {
            that.getRandomDishes();
        } else if (that.data.wineRefresh) {
            that.getWineList();
        }


        // var showcoupon = that.data.showcoupon
        // console.log(e)
        // if (!showcoupon) {
        //   wx.request({
        //     // url: 'https://mb.fsmbdlkj.com/diancanxing/shop/cityNameQueryCityID',
        //     url: app.globalData.selectSetmealForNum_url,
        //     data: {
        //       "shop_id": that.data.shopid,
        //       "pageNum": that.data.setmealPageNum
        //     },
        //     header: {
        //       'content-type': 'application/json'
        //     },
        //     method: 'POST',
        //     success: function (res) {
        //       console.log(res)
        //       var setmealPageNum = that.data.setmealPageNum + 20
        //       var set_meal = that.data.set_meal
        //       if (res.data.selectResult) {
        //         for (var i = 0; i < res.data.selectResult.length; i++) {
        //           set_meal.push(res.data.selectResult[i])
        //         }
        //         that.setData({
        //           set_meal: set_meal,
        //           setmealPageNum: setmealPageNum
        //         })
        //       }
        //       //当出的数据少于20条，开始显示优惠券
        //       if (!(res.data.selectResult) || res.data.selectResult.length < 20) {
        //         that.setData({
        //           showcoupon: true
        //         })
        //       }
        //     }
        //   })
        // } else {
        //   that.getCoupon()
        // }
    },

    getRandomDishes: function () {
        if (this.data.shopid == 21403) {
            return;
        }
        var that = this
        var stopNext = that.data.stopNext
        wx.showLoading({
            title: '加载中~',
            mask: true
        })
        that.setData({
            randomDishesRefresh: false
        })
        if (!stopNext) {
            wx.request({
                // url: 'https://test.fsmbdlkj.com/WX Restaurant/SelectcouponInfForNum',
                url: app.globalData.SelectDishesInfForNum_url,
                data: {
                    "pageNum": that.data.disPageNum,
                    "shop_id": that.data.shopid
                },
                header: {
                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                },
                method: 'POST',
                success: function (res) {
                    var disPageNum = that.data.disPageNum + 1
                    var randomDishes = that.data.randomDishes

                    if (res.data.object) {
                        if (res.data.object.length == 10) {
                            that.setData({
                                randomDishesRefresh: true
                            })
                        }
                        for (var i = 0; i < res.data.object.length; i++) {
                            randomDishes.push(res.data.object[i])
                        }
                        that.setData({
                            randomDishes: randomDishes,
                            disPageNum: disPageNum
                        }, () => {
                            wx.hideLoading({
                                success: (res) => {},
                            })
                        })
                    } else {
                        wx.hideLoading({
                            success: (res) => {},
                        })

                    }
                    //当出的数据少于20条，开始显示优惠券
                    if (disPageNum > 200) {
                        that.setData({
                            stopNext: true
                        })
                    }
                }

            })
        }
    },
    toTClub() {
        let that = this
        wx.navigateTo({
            url: '../module_others/pages/T_club/T_club',
        })
    },
    taocanJump: function (e) {
        var that = this;
        console.log(e)
        var shop_id = e.currentTarget.dataset.item.shop_id;
        console.log(shop_id)
        app.globalData.shopid = shop_id
        if (e.currentTarget.dataset.item.parent_type_id) {
            app.globalData.twoListDisId = e.currentTarget.dataset.item.parent_type_id,
                app.globalData.threeListDisId = e.currentTarget.dataset.item.subclass_type_id
        }
        wx.navigateTo({
            url: '../module_discount/pages/Package_details/Package_details?id=' + (e.currentTarget.dataset.item.setMealID ? '0' : '1') + (e.currentTarget.dataset.item.setMealID ? '&setMealID=' + e.currentTarget.dataset.item.setMealID : '&coupon_id=' + e.currentTarget.dataset.item.coupon_id) + '&ruleID=' + (e.currentTarget.dataset.item.ruleID ? e.currentTarget.dataset.item.ruleID : e.currentTarget.dataset.item.coupon_allrule) + '&shop_id=' + that.data.shopid,
        })
    },
    taocanJump1: function (e) {
        var that = this;
        let item = e.currentTarget.dataset.item;
        let fromselect = true;
        let maodian = "dishes" + item.dishes_id;

        wx.navigateTo({
          url: '/pages/module_others/pages/menu/menu?first=' + item.class_i_id + '&second=' + item.parent_type_id + '&third=' + item.subclass_type_id +'&fromselect='+fromselect + '&maodian=' + maodian,
        })
        // wx.showModal({
        //     title: '提示',
        //     content: '请点击‘线上点餐’或‘到店点餐’按钮点餐',
        // })


    },
    errorFunction: function () {
        var that = this;
        var imgList = that.data.imgList
        var index = Math.floor((Math.random() * imgList.length));
        var path = imgList[index].img
        console.log(path)
        that.setData({
            topimage: path
        })
    },
    navigateToMiniProgram() {
        wx.navigateToMiniProgram({
            appId: 'wxd5cdf788dbd8a0d7',
            path: 'pages/index/index',
            envVersion: 'develop',
            success(res) {
                // 打开其他小程序成功同步触发
                wx.showToast({
                    title: '跳转成功'
                })
            }
        })
    },
    //把当前改版后的数组中各种菜品整合到一个数组
    changeOldCartList: function (list) {
        var that = this
        var arry = []
        if (list.breakfast) {
            for (var i = 0; i < list.breakfast.length; i++) {
                arry.push(list.breakfast[i].dishes_detailed)
            }
        }
        if (list.dinnerNormal) {
            for (var i = 0; i < list.dinnerNormal.length; i++) {
                arry.push(list.dinnerNormal[i].dishes_detailed)
            }
        }
        if (list.weighingCategory) {
            for (var i = 0; i < list.weighingCategory.length; i++) {
                arry.push(list.weighingCategory[i].dishes_detailed)
            }
        }
        if (list.pieceCategory) {
            for (var i = 0; i < list.pieceCategory.length; i++) {
                arry.push(list.pieceCategory[i].dishes_detailed)
            }
        }
        if (list.teaRice) {
            for (var i = 0; i < list.teaRice.length; i++) {
                arry.push(list.teaRice[i].dishes_detailed)
            }
        }
        if (list.drinks) {
            for (var i = 0; i < list.drinks.length; i++) {
                arry.push(list.drinks[i].dishes_detailed)
            }
        }
        if (list.otherSupplies) {
            for (var i = 0; i < list.otherSupplies.length; i++) {
                arry.push(list.otherSupplies[i].dishes_detailed)
            }
        }
        console.log(arry)


        for (var i = 0; i < arry.length; i++) {
            // 普通菜品分类
            if (arry[i].specalType == 0 && arry[i].specName != '称重') {
                var conventional_dishes = 1;
            }
            // 茶位米饭
            if (arry[i].specalType == 1 && arry[i].specName != '称重') {
                var tea_rice = 1;
            }
            // 酒水
            if (arry[i].specalType == 2 && arry[i].specName != '称重') {
                var drinks_dishes = 1;
            }
            // 其他菜品
            if (arry[i].specalType == 3 && arry[i].specName != '称重') {
                var other_dishes = 1;
            }
            // 早市菜品
            if (arry[i].specalType == 4 && arry[i].specName != '称重') {
                var morning_dishes = 1;
            }
            // 午市菜品
            if ((arry[i].specalType == 5 && arry[i].specName != '称重') || (arry[i].specalType == 5 && arry[i].specId == 5)) {
                var afternoon_dishes = 1;
            }
            // 称重菜品
            if (arry[i].specName == '称重' && arry[i].specId != 5) {
                var weighing_dishes = 1;
            }
        }


        app.globalData.conventional_dishes = conventional_dishes;
        app.globalData.tea_rice = tea_rice;
        app.globalData.drinks_dishes = drinks_dishes;
        app.globalData.other_dishes = other_dishes;
        app.globalData.weighing_dishes = weighing_dishes;
        app.globalData.morning_dishes = morning_dishes;
        app.globalData.afternoon_dishes = afternoon_dishes;
        app.globalData.locationindex = 3;

    },
    getThisorderarry: function (orderid) {
        wx.request({
            url: app.globalData.SelectOneOrder1_url,
            data: {
                order_id: orderid
            },
            success: function (res) {
                if (res.data.result.result == 1) {
                    app.globalData.thisorderarry = res.data.object
                }
            }
        })
    },
    toOrderDetailPage: function (orderid, userClaim) {
        var that = this;
        var user_id = that.data.user_id
        wx.request({
            url: app.globalData.SelectOrderAllDetailedByOrderId_url,
            data: {
                order_id: orderid //通过orderID获取整张表的具体数据
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
                //先判断是否是部长下单
                console.log(res)
                var order_inf = res.data.data.orderInf
                var dishes_inf = res.data.data.DishesInfs
                console.log(order_inf)
                that.changeOldCartList(dishes_inf)
                that.getThisorderarry(orderid)
                that.setData({
                    username: app.globalData.user_name,
                    phonenumber: app.globalData.user_phone
                })
                // that.data.username = app.globalData.user_name
                // that.data.phonenumber = app.globalData.user_phone 
                //公私户设置
                var payment_address = order_inf.paymentAddress
                if (payment_address == 0) {
                    if (app.globalData.managementData.pay_address == 0 || app.globalData.managementData.pay_address == 1) {
                        payment_address = 1
                    } else {
                        payment_address = 2
                    }
                }
                that.setData({
                    payment_address: payment_address,
                    QRorderid: orderid
                })
                if (userClaim != '' && userClaim != null && userClaim != undefined && userClaim != 'null' && userClaim != 0) {
                    //此单被认领了
                    //我他吗直接进详情

                    that.setData({
                        way: 3,
                        hidden: true,
                        // userClaim:userClaim
                    })
                    // that.confirm()
                    wx.navigateTo({
                        url: '../order1/order1?orderid=' + orderid + '&locationindex=' + 1 + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&refreshdelay=' + true + '&QR_judge=' + true
                    })

                } else {
                    // 此单没被认领
                    //自己点的详情，哭着也要认领

                    if (that.data.bindOrderIf || that.data.way == 3) {
                        that.confirm()
                        that.setData({
                            bindOrderIf: false,
                            way: 2
                        })
                        //我他吗直接认领订单
                        wx.request({
                            url: app.globalData.ClaimOrder_url,
                            data: {
                                Order_id: orderid,
                                user_id: user_id,
                                user_name: app.globalData.user_name,
                                phone_num: app.globalData.user_phone,
                            },
                            success: function (res) {
                                console.log(res)
                                if (res.data.result.result == '1') {
                                    console.log('认领成功')
                                    //成功认领该订单
                                    //改OrderDetails符合order_id的所有菜
                                    wx.request({
                                        url: app.globalData.UpdateOrderUserid_url,
                                        // url: 'http://192.168.102.236:8080/UpdateOrderDetails',
                                        method: "POST",
                                        data: {
                                            order_id: orderid,
                                            user_id: app.globalData.user_id
                                        },
                                        header: {
                                            "Content-Type": "application/x-www-form-urlencoded"
                                        },
                                        success: function (res) {
                                            console.log(res)
                                            if (res.data.result.result == 1) {
                                                wx.navigateTo({
                                                    url: '../order1/order1?orderid=' + orderid + '&locationindex=' + 1 + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&refreshdelay=' + true + '&QR_judge=' + true
                                                })
                                            }
                                        },
                                    })
                                } else if (res.data.result.result == '101') {
                                    //该订单已被认领
                                    wx.showModal({
                                        title: '提示',
                                        content: "此订单已被认领",
                                        confirmText: "查看订单", //默认是“确定”
                                        // confirmText: "此单为部长下的订单，是否绑定到您的信息",
                                        success(res) {
                                            if (res.confirm) {
                                                wx.navigateTo({
                                                    url: '../order1/order1?orderid=' + orderid + '&locationindex=' + 1 + '&allowedsubmit=' + false + '&allowedflesh=' + true + '&refreshdelay=' + true + '&QR_judge=' + true
                                                })
                                            } else if (res.cancel) {}
                                        }
                                    })
                                } else {
                                    wx.showModal({
                                        title: '提示',
                                        content: "绑定失败",
                                        confirmText: "重试", //默认是“确定”
                                        cancelText: "取消", //默认是“取消”
                                        // confirmText: "此单为部长下的订单，是否绑定到您的信息",
                                        success(res) {
                                            if (res.confirm) {
                                                that.toOrderDetailPage(orderid, userClaim)
                                            } else if (res.cancel) {}
                                        }
                                    })
                                }
                            }
                        })


                    }

                }

            }
        })
    },
    bindOrder: function (e) {
        var that = this;
        var orderId = e.currentTarget.dataset.item.orderId
        var userClaim = e.currentTarget.dataset.item.userClaim
        console.log(e)
        that.setData({
            way: 3,
            bindOrderIf: true
        })
        that.toOrderDetailPage(orderId, userClaim)

        //关闭弹框，清空数组
        that.setData({
            hidden: true,
            hidden2: true,
            orderId_directy: []
        })
    },
    onShareAppMessage: function (e) {
        var that = this;
        let a = this.data.shareTimeLineE
        let item = a.detail.currentTarget.dataset.item
        let id = a.detail.currentTarget.dataset.id
        let i = a.detail.currentTarget.dataset.indexshare
        let isWhat = a.currentTarget.dataset.iswhat
        var title = '我给你分享了一个优惠，快来打开查看吧';
        var imgUrl = item.coupon_id ? 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/coupon_give.png' : (item.pageUrl.length > 0? item.pageUrl[0].pageURL : 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/coupon_give.png');
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
        if (isWhat == "1") {
          let a = that.data.couponList
          a[i].share_num = Number(a[i].share_num) + 1
          that.setData({
            couponList: a
          })
        } else if (isWhat == "2") {
          let b = that.data.foodList
          b[i].shareNum = Number(b[i].shareNum) + 1
          that.setData({
            foodList: b
          })
        } else if (isWhat == "3") {
          let c = that.data.wineList
          c[i].shareNum = Number(c[i].shareNum) + 1
          that.setData({
            wineList: c
          })
        } else {
          let d = that.data.comboList
          d[i].shareNum = Number(d[i].shareNum) + 1
          that.setData({
            comboList: d
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
            // shareTimeLineE: null
        })
    },
    shareTimeLine(){
        this.onShare(this.data.shareTimeLineE)
        this.closeShareDialog()
    },
    onShare(e) {
        console.log("进来了", e);
        let that = this
        let item = e.detail.currentTarget.dataset.item
        let page = 'pages/module_discount/pages/Package_details/Package_details'
        let id = e.detail.currentTarget.dataset.id
        let i = e.detail.currentTarget.dataset.indexshare
        let isWhat = e.currentTarget.dataset.iswhat
        wx.request({
            url: app.globalData.getImageCode_url + '?page=' + page + '&a=a=' + (id == 0 ? item.setMealID : item.coupon_id) + '&version=' + app.globalData.QRCodeVersion + '&b=b=' + id + '&c=c=' + app.globalData.customerInf.id,
            method: "POST",
            responseType: 'arraybuffer',
            success: res => {
                const fsm = wx.getFileSystemManager();
                const fileName = wx.env.USER_DATA_PATH + '/share_img' + (Date.parse(new Date()) / 1000) + '.jpeg';
                fsm.writeFile({ //获取到的数据写入临时路径
                    filePath: fileName, //临时路径
                    encoding: 'binary', //编码方式，二进制
                    data: res.data, //请求到的数据
                    success: res => {
                        console.log(res)
                        console.log(fileName) //打印路径
                        that.setData({
                            loadImagePath2: fileName,
                        }, () => {
                            if (that.waitImage) {
                                that.waitImage(true)
                            }
                        });
                    },
                })
            }
        })
        wx.showLoading({
            title: '正在加载...',
            mask: true
        })
        let isPic = id == 0 ? !item.posterUrl : !item.share_url
        if (isPic) {
            wx.showModal({
                title: '提示',
                content: '该超值优惠暂无海报!',
                showCancel: false
            })
            wx.hideLoading({
                success: (res) => {},
            })
            return;
        } else {
            wx.request({
                url: app.globalData.addShareNum_url,
                data: {
                    shareId: id == 0 ? item.setMealID : item.coupon_id,
                    isCombo: id
                },
                success: res => {
                  if (isWhat == "1") {
                    let a = that.data.couponList
                    a[i].share_num = Number(a[i].share_num) + 1
                    that.setData({
                      couponList: a
                    })
                  } else if (isWhat == "2") {
                    let b = that.data.foodList
                    b[i].shareNum = Number(b[i].shareNum) + 1
                    that.setData({
                      foodList: b
                    })
                  } else if (isWhat == "3") {
                    let c = that.data.wineList
                    c[i].shareNum = Number(c[i].shareNum) + 1
                    that.setData({
                      wineList: c
                    })
                  } else {
                    let d = that.data.comboList
                    d[i].shareNum = Number(d[i].shareNum) + 1
                    that.setData({
                      comboList: d
                    })
                  }
                }
            })
        }
        that.setData({
            spawnSetMealID: id == 0 ? item.setMealID : item.coupon_id,
            showPoster: !that.data.showPoster,
            currentPoster: id == 0 ? item.posterUrl : item.share_url
        })
        wx.createSelectorQuery()
            .select('#canvas')
            .fields({
                node: true,
                size: true,
            })
            .exec(that.initd.bind(that))
    },
    initd(res) {
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
        }, () => {
            that.getSetMealAllInfo()
        })
    },
    showBigImage() {
        let that = this
        let arr = []
        arr.push(that.data.loadImagePath)
        wx.previewImage({
            urls: arr,
        })
    },

    videoEnded(){
      let that = this;
      let videoIndex = that.data.videoIndex;
      let videoList = that.data.videoList;

      if(videoList[videoIndex].value == that.data.currentVideo){
        if(videoIndex < videoList.length - 1){
          videoIndex++
        }else{
          videoIndex = 0
        }
      }

      that.setData({
        videoIndex,
        currentVideo: videoIndex == 0 ? '' : videoList[videoIndex].value,
      })

    if(videoIndex == 0){
      that.videoContext.autoplay = 'false'
      that.videoContext.pause();
      that.setData({
        swiperAutoplay:  true,
        swiperInterval: 1000
      })
    }else{
      that.videoContext.autoplay = 'true'
      that.videoContext.play()
    }
    },

    swiperChange(e){
      let that = this;
      let index = e.detail.current;
      let videoList = that.data.videoList;

      that.setData({
        swiperAutoplay: index == 0 ? true : false,
        currentVideo: index == 0 ? '' : videoList[0].value,
        swiperInterval: 3000,
      },()=>{
        if(index == 1){
          that.videoContext.autoplay = 'true'
          that.videoContext.play();
        }else{
          that.videoContext.autoplay = 'false'
          that.videoContext.pause();
        }
      })
    }
})