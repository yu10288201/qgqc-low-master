//book.js
const {
    formatTimeTwo
} = require('../../../../utils/util.js');
var util = require('../../../../utils/util.js');
const app = getApp()
var now = new Date();
let month = now.getMonth() + 1
Page({

    /**
     * 页面的初始数据
     */
    data: {
        fromYuDing: false,
        window6: false,
        bookingroom: false,
        hallAllType: [],
        RoomNum: ["12", "15"],
        tablecanset: ["2-3", "4-6", "8-12", "12-15"],
        showOrHidden1: true,
        showOrHidden2: false,
        tabIndex: 0,
        window: false,
        window1: false,
        window2: false,
        window3: false,
        window4: false,
        hallType: '',
        hallName: '',
        hallId: null,
        roomId: null,
        roomname: '',
        tablenum: '',
        locationid: null,
        room: [],
        hall: [],
        halldata: [],
        roomdata: [],
        newhallarry: [],
        index: 0,
        isshowtable: true,
        hadchangetable: false,
        show_sbwindow: false,
        show_toMenu: app.globalData.show_toMenu,
        thisorderarry: '',
        difference_time: 3600000, //一个半小时的时间戳
        thisroom: {},
        inde: '',
        inde1: '',
        roomname: [],
        toview: false, //判断是否是显示查看菜谱
        noteshows: false, //请部长点餐的备注弹窗
        remark: '', //请部长点餐备注
        models: '',
        background2: '',
        operatingstate: '', //营业状态.
        operatingTime: '', //营业时间
        btn2: "url('https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/book/btn2.png')",
        btn3: "url('https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/book/btn3.png')",
        btn4: "url('https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/book/btn4.png')",
        hui: "url('https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/book/hui.png')",
        photoShow: false,
        isFirst: false, //第一次到店的判断
        dineUserName: "", //用户名的记录
        dinePhoneNumber: "", //用户电话号码的记录
        showAuthorize: false, //若没有注册,则通过授权获取电话
        getfreetableNum: 0, //得到餐座数据的执行次数
        username: app.globalData.nickName,
        userInfo: app.globalData.username,
        date: "",
        allManagers: [], 
        selectedManagerName: "",
        //selectedManagerId: 0
    },

    selectManager: function(e) {
        this.setData({
          selectedManagerName: this.data.allManagers[e.detail.value].nameAndPosition,
          //selectedManagerId: this.data.allManagers[e.detail.value].id
        })
        app.globalData.selectedManagerId = this.data.allManagers[e.detail.value].id
        app.globalData.selectedManagerName = this.data.allManagers[e.detail.value].name        
    },

    loadAllManagers(){
        var that = this       
        wx.request({
            url: app.globalData.SelectStorePersonnalServlet_url,
            data: {
                shop_id: app.globalData.shopid
            },
            success: function (res) {
                if (res.data.code == 1) {                    
                    var allManagers = []
                    allManagers.push({id: 0, name: '', nameAndPosition: '不选'}) 
                    for(var i = 0; i < res.data.paramsList.length; i++){
                        if(res.data.paramsList[i].storePersonnal_IP == 'yes'){
                            allManagers.push({
                                id: res.data.paramsList[i].id, 
                                name: res.data.paramsList[i].name, 
                                nameAndPosition: res.data.paramsList[i].name + '(' + res.data.paramsList[i].position + ')'  
                            })
                        }                       
                    }                                       
                    that.setData({
                        allManagers: allManagers
                    })
                }
            }
        })
    },
    
    //点餐人姓名
    bookusername: function (e) {
        var that = this;        
        var look = e.detail.value
        var toview
        look == '' || look == null ? toview = true : toview = false
        that.setData({
            username: e.detail.value,
            show_toMenu: app.globalData.show_toMenu,
            toview: toview
        })
        app.globalData.username = e.detail.value
    },
    
    //点餐人性别
    changeradio: function (e) {
        var that = this;
        that.setData({
            index: e.currentTarget.dataset.index
        })
        if (e.currentTarget.dataset.index == 0) {
            app.globalData.sex = '先生'
        } else if (e.currentTarget.dataset.index == 1) {
            app.globalData.sex = '女士'
        }
    },
    //点餐人电话
    phonenumber: function (e) {
        var that = this;        
        that.setData({
            phonenumber: e.detail.value
        })
        app.globalData.phonenumber = e.detail.value
    },
    //用餐日期
    bindDateChange: function (e) {
        var that = this;        
        that.setData({
            date: e.detail.value
        })        
        if (that.data.date != '' && that.data.atime != '' && that.data.time != '') {}
        app.globalData.date = e.detail.value
    },
    //用餐时间
    bindTimeChange: function (e) {
        var that = this;
        console.log('用餐时间', e.detail.value)
        that.setData({
            time: e.detail.value,
            atime: e.detail.value,
            dtime: e.detail.value
        })
        if (that.data.date != '' && that.data.atime != '' && that.data.time != '') {
            that.getfreetableinfo(1)
            // that.setData({
            //   isshowtable: true
            // })
        }
        app.globalData.time = e.detail.value
        app.globalData.atime = e.detail.value
    },
    //用餐人数
    userNum: function (e) {
        var that = this;        
        that.setData({
            userNum: e.detail.value,
        })
        app.globalData.userNum = e.detail.value
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
                if (res.data != "错误") {
                    that.setData({
                        operatingstate: res.data
                    })
                }
            }
        })
    },
    //获取空闲桌位信息
    getfreetableinfo: function (e) {
        var that = this
        var halldata = [];
        var room = [];
        var hall = [];
        var roomdata = [];
        var hallAllType = [];
        var alltable = []
        var startingTime
        console.log(e)
        if (!e) {
            startingTime = util.formatTime(new Date())
        } else {
            startingTime = that.data.date + " " + that.data.time
        }
        console.log(startingTime)
        app.globalData.dinnerTime = formatTimeTwo(startingTime, 'Y-M-D h:m:s')
        console.log(app.globalData.dinnerTime)
        // var startingTime = that.data.date + " " + that.data.atime
        wx.request({
            // url: "http://192.168.8.18:8087/WX Restaurant/GetFreeTableInf",
            url: app.globalData.GetFreeTableInf_url,
            data: {
                shop_id: app.globalData.shopid,
                startingTime: startingTime,
            },
            success: function (res) {
                console.log(res)
                wx.showLoading({
                    title: '加载中',
                })
                if (res.data != '') {
                    for (var i = 0; i < res.data.object.length; i++) {
                        if (res.data.object[i].field_type == 0) {
                            hall.push(res.data.object[i])
                        } else {
                            room.push(res.data.object[i])
                        }
                    }
                    console.log(room)
                    for (var i = 0; i < hall.length; i++) {
                        for (var j = 0; j < hall[i].tableManage.length; j++) {
                            hall[i].tableManage[j].field_name = hall[i].field_name
                            halldata.push(hall[i].tableManage[j])
                        }
                    }
                    for (var i = 0; i < room.length; i++) {
                        for (var j = 0; j < room[i].tableManage.length; j++) {
                            roomdata.push(room[i].tableManage[j])
                        }
                    }
                    console.log(roomdata)
                    for (var i = 0; i < hall.length; i++) {
                        hallAllType.push(hall[i].field_name)
                    }
                    for (var i = 0; i < res.data.object.length; i++) {
                        for (var j = 0; j < res.data.object[i].tableManage.length; j++) {
                            alltable.push(res.data.object[i].tableManage[j])
                        }
                    }
                    if (e == undefined) {
                        for (var i = 0; i < halldata.length; i++) {
                            halldata[i].table_status = 1
                        }
                    }
                    setTimeout(function () {
                        if (alltable != undefined) {
                            wx.hideLoading()
                        }
                    }, 1000)
                    app.globalData.field = res.data.object
                    that.setData({
                        halldata: halldata, //大厅桌子数
                        roomdata: roomdata, //在房间的桌子
                        room: room, //房间数
                        hall: hall, //大厅数
                        field: res.data.object, //包房+大厅数量
                        hallAllType: hallAllType, //大厅名字
                        alltable: alltable //所有桌子
                    },()=>{
                      wx.request({
                        url: app.globalData.SelectHailImg_url,
                        data: {
                            field_img_url: res.data.object[0].field_img_url
                        },
                        success: function (res) {
                            that.setData({
                                hallphoto: res.data.object
                            })
                            if (res.data.object.length > 0) {
                                that.setData({
                                    photoShow: true
                                })
                            }
                        },
                    })
                    })
                    console.log(room)
                    var roomname = [];
                    for (var y = 0; y < room.length; y++) {
                        roomname.push(room[y].field_name)
                    }
                    that.setData({
                        roomname: roomname
                    })
                } else {
                    if (Number(that.data.getfreetableNum) < 3) {
                        that.setData({
                            getfreetableNum: Number(that.data.getfreetableNum) + 1
                        })
                        setTimeout(function () {
                            that.getfreetableinfo(e)
                        }, 2000)
                    } else {
                        wx.showModal({
                            title: '提示',
                            content: '获取数据失败',
                            showCancel: false,
                            success: function (res) {
                                if (res.confirm) {
                                    //点击确定
                                    wx.navigateBack({
                                        delta: 1
                                    })
                                }
                            }
                        })
                        wx.hideLoading();
                    }
                }
            },
        })
    },



    // 搜索厅的桌子
    selecthailltable: function () {
        var that = this
        var hailItem = []
        wx.request({
            url: app.globalData.SelectHail_url,
            data: {
                shop_id: app.globalData.shopid,
                field_type: 0
            },
            success: function (res) {
                console.log(res)
                for (var i = 0; i < res.data.object.length; i++) {

                    wx.request({
                        url: app.globalData.SelectTable_url,
                        data: {
                            field_id: res.data.object[i].hailid
                            // hailid: res.data.object[i].hailid
                        },
                        success: function (res) {
                            console.log(res)
                            for (var m = 0; m < res.data.object.length; m++) {
                                hailItem.push(res.data.object[m])
                            }
                        },
                    })
                }
                console.log(hailItem)
            },
        })
    },
    // 搜索包房
    selectroom: function () {
        console.log(app.globalData.shopdetail)
        wx.request({
            url: app.globalData.SelectRoomServlet_url,
            data: {
                shop_name: app.globalData.shopdetail.shop_name,
                shop_address: app.globalData.shopdetail.shop_address,
            },
            success: function (res) {
                console.log(res)
            },
        })
    },




    //大厅？包房？
    changeTab: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index
        if (that.data.tabIndex != index) {
            that.setData({
                tabIndex: index,
                showOrHidden1: !that.data.showOrHidden1,
                showOrHidden2: !that.data.showOrHidden2,
                locationid: null,
                hallType: '',
                bindKeyInput: '',
                newhallarry: [],
                hallphoto: [],
                photoShow: false
            })
        }
    },

    //选择大厅类型,弹窗
    upwindow: function (e) {


        console.log('picker发送选择改变，携带值为', e.detail.value)

        this.setData({

            inde: e.detail.value,
            hallType: this.data.hallAllType[e.detail.value],
            hallId: e.detail.value
        })


        // this.setData({
        //   window: !this.data.window
        // })
    },
    // 选择大厅
    hallchoose: function (res) {
        var index = res.currentTarget.dataset.id
        this.setData({
            hallType: this.data.hallAllType[index],
            hallId: index,
        })
    },

    //选择包房类型
    upwindow2: function () {
        this.setData({
            window2: !this.data.window2
        })
    },
    //选择包房名称
    chooseRoom: function (res) {
        this.setData({
            roomname: res.currentTarget.dataset.item
        })
    },
    //桌子可坐人数
    tableNum: function (res) {
        console.log(res.currentTarget.dataset.id)
        this.setData({
            tablenum: res.currentTarget.dataset.id
        })
    },
    // 可坐人数
    bindKeyInput(e) {
        this.setData({
            inputValue: e.detail.value,
        })
        console.log(e.detail.value)
    },
    //查询
    query: function (e) {
        console.log(this.data.inputValue)
        console.log(this.data.hallId)

        this.setData({ //清空当前图片数组
            photoShow: false,
            hallphoto: []
        })
        var newhallarry = [];
        if (this.data.inputValue == undefined && this.data.hallId != null) {
            for (var i = 0; i < this.data.halldata.length; i++) {
                if (this.data.halldata[i].field_id == this.data.hall[this.data.hallId].field_id) {
                    newhallarry.push(this.data.halldata[i])
                }
            }
        } else if (this.data.inputValue != undefined && this.data.hallId == null) {
            for (var i = 0; i < this.data.halldata.length; i++) {
                if (this.data.inputValue <= this.data.halldata[i].user_count) {
                    newhallarry.push(this.data.halldata[i])
                }
            }
        } else if (this.data.inputValue != undefined && this.data.hallId != null) {
            for (var i = 0; i < this.data.halldata.length; i++) {
                if (this.data.inputValue <= this.data.halldata[i].user_count && this.data.halldata[i].field_id == this.data.hall[this.data.hallId].field_id) {
                    newhallarry.push(this.data.halldata[i])
                }
            }
        }
        this.setData({
            newhallarry: newhallarry
        })
    },
    //包房名称
    upwindow3: function (e) {

        console.log('picker发送选择改变，携带值为', e.detail.value)

        this.setData({

            inde1: e.detail.value,
            roomType: this.data.roomdata[e.detail.value].table_name,
            roomId: e.detail.value
        })
    },
    //包房可坐人数输入
    bindKeyInput1: function (e) {
        this.setData({
            inputValue1: e.detail.value
        })
    },

    //清空查询
    clean: function () {
        this.setData({
            newhallarry: [],
            hallType: '',
            roomType: '',
            inde: '',
            inde1: '',
            //清空当前图片数组
            photoShow: false,
            hallphoto: []

        })
    },


    //选择房间
    roomchoose: function (res) {
        console.log(res.currentTarget.dataset.id)
        var index = res.currentTarget.dataset.id
        this.setData({
            roomType: this.data.room[index].field_name,
            roomId: index,
        })
    },

    //包房查询
    query1: function () {
        var newhallarry = []
        var room_name = '';
        if (this.data.inputValue1 == undefined && this.data.roomId != null) {
            for (var i = 0; i < this.data.roomdata.length; i++) {
                if (this.data.roomdata[i].field_id == this.data.room[this.data.roomId].field_id) {
                    room_name = this.data.room[this.data.roomId].field_name
                    newhallarry.push(this.data.roomdata[i])
                }
            }
        } else if (this.data.inputValue1 != undefined && this.data.roomId == null) {
            for (var i = 0; i < this.data.roomdata.length; i++) {
                if (this.data.inputValue1 <= this.data.roomdata[i].user_count) {
                    newhallarry.push(this.data.roomdata[i])
                }
            }
        } else if (this.data.inputValue1 != undefined && this.data.roomId != null) {
            for (var i = 0; i < this.data.halldata.length; i++) {
                if (this.data.inputValue1 <= this.data.roomdata[i].user_count && this.data.roomdata[i].field_id == this.data.room[this.data.roomId].field_id) {
                    newhallarry.push(this.data.roomdata[i])
                }
            }
        }
        this.setData({
            newhallarry: newhallarry,
            room_name: room_name
        })
    },

    showDetail() {
        let that = this;
        if (!that.data.locationid) {
            wx.showToast({
                title: '请选择餐桌',
                icon: 'error'
            })
            return;
        }
        that.setData({
            window6: !that.data.window6,
        })
    },

    //包房详情
    upwindow4: function () {
        var that = this
        if (that.data.locationid != null) {
            var roomdetail = that.data.roomdetail
            var room = that.data.room
            var roomid
            for (var i = 0; i < room.length; i++) {
                for (var j = 0; j < room[i].tableManage.length; j++) {
                    if (room[i].tableManage[j].table_id == that.data.locationid) {
                        roomid = room[i].field_img_url
                    }
                }
            }
            var thisroom = {}
            for (var i = 0; i < roomdetail.object.length; i++) {
                if (roomdetail.object[i].field_img_url == roomid) {
                    that.setData({
                        thisroom: roomdetail.object[i]
                    })
                }
            }
            // wx.request({
            //   // url: 'https://mb.fsmbdlkj.com/demo1_war/servlet/selectRoomImgServlet',
            //   url: app.globalData.allUrl.selectRoomImgServlet,
            //   data: {
            //     // shop_id: app.globalData.shopid,
            //     field_img_url: roomid
            //   },
            //   success: function (res) {
            //     console.log(res)
            //     that.setData({
            //       roomphoto: res.data.object
            //     })
            //   },
            // })

            that.setData({
                window4: !that.data.window4
            })
        } else {
            wx.showToast({
                title: '请选择查询房间',
                icon: 'loading',
                duration: 2000,
            })
        }
    },

    sbwindow_sure: function () {
        app.globalData.userNum = ''
        app.globalData.date = ''
        app.globalData.time = ''
        app.globalData.atime = ''
        app.globalData.username = ''
        app.globalData.phonenumber = ''
        app.globalData.locationname = ''
        app.globalData.locationid = ''
        app.globalData.jump = true
        // 第二次下单的时候会影响
        wx.reLaunch({
            url: '../index/index',
        })

    },


    //选择桌位号
    selectlocation: function (e) {
        var that = this
        var halldata = that.data.halldata
        var roomdata = that.data.roomdata
        if (that.data.newhallarry == '' || that.data.newhallarry == null) {
            var newhallarry = this.data.showOrHidden2 ? that.data.roomdata : that.data.halldata
        } else {
            var newhallarry = that.data.newhallarry
        }
        var id = e.currentTarget.dataset.id
        var num = e.currentTarget.dataset.num

        if ((newhallarry[id].table_status == 1 && num == '2') || this.data.showOrHidden2 ? (roomdata[id].table_status == 1 && num == '1') : (halldata[id].table_status == 1 && num == '0')) {
            var fieldname
            var field = that.data.field
            var table_id = e.currentTarget.dataset.table_id
            for (var i = 0; i < field.length; i++) {

                if (e.currentTarget.dataset.item.field_name == field[i].field_name) {
                    that.setData({
                        field_parameter: field[i].field_parameter
                    })
                }

                for (var j = 0; j < field[i].tableManage.length; j++) {
                    if (field[i].tableManage[j].table_id == e.currentTarget.dataset.table_id) {
                        fieldname = field[i].field_name
                        var field_img_url = field[i].field_img_url
                        var field_id = field[i].field_id
                    }
                }
            }


            var locationname = fieldname + " " + e.currentTarget.dataset.table_name
            console.log(e.currentTarget.dataset.item, "642");
            var locationNum = e.currentTarget.dataset.table_name
            that.setData({
                locationid: e.currentTarget.dataset.table_id,
                locationname: locationname,
                locationNum: locationNum,
                userCount: e.currentTarget.dataset.item.user_count,
            })
            app.globalData.locationid = e.currentTarget.dataset.table_id
            app.globalData.locationname = locationname
            wx.request({
                url: app.globalData.SelectHailImg_url,
                data: {
                    field_img_url: field_img_url
                },
                success: function (res) {
                    that.setData({
                        hallphoto: res.data.object
                    })
                    if (res.data.object.length > 0) {
                        that.setData({
                            photoShow: true
                        })
                    }
                },
            })
        } else {
            wx.showToast({
                title: '房间已订',
                icon: 'error',
                duration: 2000,

            })
        }

    },


    //预览照片
    photo: function (e) {
        var that = this;
        var arry = []
        if (e.currentTarget.dataset.type == 1) {
            var hallphoto = that.data.hallphoto
            for (var i = 0; i < hallphoto.length; i++) {
                arry.push(hallphoto[i].img_url)
            }
        } else if (e.currentTarget.dataset.type == 2) {
            var hallphoto = that.data.hallphoto
            for (var i = 0; i < hallphoto.length; i++) {
                arry.push(hallphoto[i].img_url)
            }
        }
        wx.previewImage({
            urls: arry,
        })
    },


    //创建订单不点菜 (单单创建一张没有菜品信息的订单)
    submit: function () {
        var that = this
        wx.showModal({
            content: '此为订台不点餐',
            success: function (res) {
                if (res.confirm) {
                    var sex = sex = '女士'
                    if (that.data.index == 0) {
                        sex = '先生'
                    }
                    var field = that.data.field
                    var fieldname
                    for (var i = 0; i < field.length; i++) {
                        for (var j = 0; j < field[i].tableManage.length; j++) {
                            if (field[i].tableManage[j].table_id == that.data.locationid) {
                                fieldname = field[i].field_name
                            }
                        }
                    }
                    var help_order = 0
                    if (app.globalData.help_order == true) {
                        help_order = 1
                    }
                    wx.request({
                        url: app.globalData.WriteOrder_url,
                        data: {
                            Order_type: 1, //订单类型：0-堂食、1-预定、2-外卖
                            Shop_id: app.globalData.shopid,
                            Table_id: that.data.locationid,
                            User_count: that.data.userNum, //用餐人数
                            User_id: app.globalData.user_id,
                            Users_id: app.globalData.user_id, //点餐人id，可多人点餐
                            Grand_total: 0, //应收
                            Order_subtotal: 0, //订单小计
                            arrival_time: String(that.data.date) + ' ' + String(that.data.atime) + ':00', //差一个日期

                            order_wait: 0, //菜品是否需要叫起
                            phone_num: that.data.phonenumber,
                            user_name: that.data.username + sex,
                            dishes_count: 0,
                            invoice_flag: 0,
                            preorder_starus: 0,
                            operator: "无",
                            tbc_count: "0,0",
                            table_name: that.data.locationname,
                            help_order: help_order,
                            cz_flag: 0
                        },
                        success: function (res) {
                            console.log(res)
                            if (res.data.result.result == 1) {
                                that.setData({
                                    show_sbwindow: true
                                })

                            }
                        },
                    })
                }
            },
        })
    },
    //预订信息修改
    changeinformation: function () {
        var that = this
        var thisorderarry
        var orderslist = that.data.orderslist
        for (var i = 0; i < orderslist.length; i++) {
            if (orderslist[i].order_id == that.data.orderid) {
                that.setData({
                    thisorderarry: orderslist[i],
                })
                break
            }
        }
        console.log(that.data.locationid)
        console.log(that.data.locationname)
        console.log(that.data.locationNum)
        //获取用餐时间
        if (that.data.thisorderarry.order_status == '待确认') {
            var old_locationid = that.data.old_locationid
            var locationid = that.data.locationid
            if (that.data.hadchangetable == false) {
                if (that.data.locationindex == 2) {
                    wx.request({
                        url: app.globalData.GetTablesInf_url,
                        data: {
                            Shop_id: app.globalData.shopid
                        },
                        success: function (res) {
                            var field = res.data.object
                            for (var i = 0; i < field.length; i++) {
                                for (var j = 0; j < field[i].tableManage.length; j++) {
                                    if (field[i].tableManage[j].table_id == old_locationid) {
                                        that.setData({
                                            old_fieldname: field[i].field_name + old_locationid + "号桌"
                                        })
                                    }
                                }
                            }
                            for (var i = 0; i < field.length; i++) {
                                for (var j = 0; j < field[i].tableManage.length; j++) {
                                    if (field[i].tableManage[j].table_id == app.globalData.locationid) {
                                        that.setData({
                                            new_fieldname: field[i].field_name + app.globalData.locationid + "号桌"
                                        })
                                    }
                                }
                            }
                            wx.request({
                                // url: app.globalData.UpdateOrderInf_url,
                                url: app.globalData.UpdateOrderInfForAll_url,
                                data: {
                                    Order_id: that.data.orderid,
                                    Shop_id: app.globalData.shopid,
                                    User_count: that.data.userNum,
                                    table_id: app.globalData.locationid,
                                    table_name: that.data.locationname,
                                    dinner_time: String(app.globalData.date) + ' ' + String(app.globalData.time) + ':00'
                                },
                                success: function (res) {
                                    console.log(res)
                                    if (res.data.result.result == 1) {
                                        that.setData({
                                            hadchangetable: true,
                                            old_locationid: locationid
                                        })
                                        that.getfreetableinfo()
                                        wx.reLaunch({
                                            url: '/pages/orders/orders',
                                        })
                                    }
                                }
                            })
                        }
                    })
                }
            }

        } else {
            wx.showModal({
                content: '该订单已进入不能取消状态，确定需要取消请于部长协商确认',
                cancelText: "否",
                confirmText: "是",
                success: function (res) {
                    if (res.confirm) {
                        var old_locationid = that.data.old_locationid
                        var locationid = that.data.locationid
                        if (that.data.hadchangetable == false) {
                            if (that.data.locationindex == 2) {
                                wx.request({
                                    url: app.globalData.GetTablesInf_url,
                                    data: {
                                        Shop_id: app.globalData.shopid
                                    },
                                    success: function (res) {
                                        console.log(res)
                                        var field = res.data.object
                                        console.log(field)
                                        for (var i = 0; i < field.length; i++) {
                                            for (var j = 0; j < field[i].tableManage.length; j++) {
                                                if (field[i].tableManage[j].table_id == old_locationid) {
                                                    that.setData({
                                                        old_fieldname: field[i].field_name + old_locationid + "号桌"
                                                    })
                                                    console.log(that.data.old_fieldname)
                                                }
                                            }
                                        }
                                        for (var i = 0; i < field.length; i++) {
                                            for (var j = 0; j < field[i].tableManage.length; j++) {
                                                if (field[i].tableManage[j].table_id == app.globalData.locationid) {
                                                    that.setData({
                                                        new_fieldname: field[i].field_name + app.globalData.locationid + "号桌"
                                                    })
                                                }
                                            }
                                        }
                                        wx.request({
                                            url: app.globalData.UpdateOrderInfForAll_url,
                                            data: {
                                                Order_id: that.data.orderid,
                                                Shop_id: app.globalData.shopid,
                                                User_count: that.data.userNum,
                                                table_id: that.data.thisorderarry.table_id,
                                                table_name: that.data.thisorderarry.table_name,
                                                dinner_time: that.data.thisorderarry.dinner_time,
                                                before_dinner_time: String(app.globalData.date) + ' ' + String(app.globalData.time) + ':00',
                                                before_table_id: app.globalData.locationid,
                                                before_table_name: that.data.locationname,
                                                change_order_status: 2,
                                            },
                                            success: function (res) {
                                                console.log(res)
                                                if (res.data.result.result == 1) {
                                                    that.setData({
                                                        hadchangetable: true,
                                                        old_locationid: locationid
                                                    })
                                                    that.getfreetableinfo()
                                                    wx.reLaunch({
                                                        url: '/pages/orders/orders',
                                                    })
                                                }
                                            }
                                        })

                                    }
                                })
                            }
                        }

                    }
                }
            })

        }

    },
    //单单只是换桌
    changetable: function () {
        var that = this
        var old_locationid = that.data.old_locationid
        var locationid = that.data.locationid
        if (that.data.hadchangetable == false) {
            if (that.data.locationindex == 2 && old_locationid != locationid) {
                wx.request({
                    url: app.globalData.GetTablesInf_url,
                    data: {
                        Shop_id: app.globalData.shopid
                    },
                    success: function (res) {
                        console.log(res)
                        var field = res.data.object
                        console.log(field)
                        for (var i = 0; i < field.length; i++) {
                            for (var j = 0; j < field[i].tableManage.length; j++) {
                                if (field[i].tableManage[j].table_id == old_locationid) {
                                    that.setData({
                                        old_fieldname: field[i].field_name + old_locationid + "号桌"
                                    })
                                    console.log(that.data.old_fieldname)
                                }
                            }
                        }
                        for (var i = 0; i < field.length; i++) {
                            for (var j = 0; j < field[i].tableManage.length; j++) {
                                if (field[i].tableManage[j].table_id == app.globalData.locationid) {
                                    that.setData({
                                        new_fieldname: field[i].field_name + app.globalData.locationid + "号桌"
                                    })
                                    console.log(that.data.new_fieldname)
                                }
                            }
                        }
                        wx.showModal({
                            title: '温馨提示',
                            content: '您已将桌号：' + that.data.old_fieldname + '改为新桌号：' + that.data.new_fieldname,
                            showCancel: true,
                            success: function (res) {
                                if (res.confirm) {
                                    wx.request({
                                        url: app.globalData.UpdateOrderInf_url,
                                        data: {
                                            Order_id: that.data.orderid,
                                            Shop_id: app.globalData.shopid,
                                            User_count: that.data.userNum,
                                            Table_id: app.globalData.locationid,
                                            table_name: that.data.new_fieldname,
                                            dinner_time: that.data.time
                                        },
                                        success: function (res) {
                                            console.log(res)
                                            if (res.data.result.result == 1) {
                                                that.setData({
                                                    hadchangetable: true,
                                                    old_locationid: locationid
                                                })
                                                that.getfreetableinfo()
                                            }
                                        }
                                    })
                                }
                            },
                        })
                    }
                })
            }
        }
    },

    //浏览菜单
    toMenu1: function () {
        var dinner_time = String(app.globalData.date) + ' ' + String(app.globalData.time) + ':00'
        app.globalData.dinner_time = dinner_time;
        console.log("dinner_time" + app.globalData.dinner_time);
        console.log(app.globalData.shopid)
        var shop_id = app.globalData.shopid
        console.log(app.globalData.operator_id);
        wx.request({
            url: app.globalData.getOrderCode,
            data: {
                shop_id: shop_id,
            },
            success: function (res) {
                console.log(res.data.orderCode);
                app.globalData.orderCode = res.data.orderCode
            }
        })
        wx.navigateTo({
            url: '../menu/menu'  ,
        })
    },

    //确认选好座位，判断参数都填好后就跳转
    toMenu: function (e) {
        var that = this;
        var canbook = false
        var hadchangetable = that.data.hadchangetable
        var locationindex = that.data.locationindex
        app.globalData.xdswidth = true
        app.globalData.xdswidthnumber = 3
        console.log(that.data.locationindex)

        wx.request({
            url: app.globalData.getOrderCode,
            data: {
                shop_id: app.globalData.shopid,
                orderTime: that.data.date
            },
            success: function (res) {
                console.log(res.data.orderCode);
                let code = res.data.orderCode
                app.globalData.orderCode = res.data.orderCode

                if (hadchangetable == false && locationindex == 2) {

                } else if (hadchangetable == true && locationindex == 2) {
                    //判断到店时间和用餐时间是否合理
                    var timestamp = Date.parse(new Date());
                    var bookdate = that.data.date + ' ' + that.data.time
                    var bookdate1 = that.data.date + ' ' + that.data.atime
                    var bookdatestamp = new Date(bookdate.replace(/-/g, "/")).getTime()
                    var bookdatestamp1 = new Date(bookdate1.replace(/-/g, "/")).getTime()
                    var legaltime = false
                    if (timestamp < bookdatestamp1 && bookdatestamp1 <= bookdatestamp) {
                        legaltime = true
                    }
                    if (that.data.locationid != null && that.data.username != undefined && that.data.username != '' && that.data.phonenumber != undefined && that.data.phonenumber.length == 11 && that.data.userNum != undefined && that.data.userNum != '' && that.data.userNum > 0 && that.data.old_locationid == that.data.locationid && legaltime == true && e.currentTarget.dataset.model == 1) {
                        app.globalData.eatin = false

                        wx.navigateTo({
                            url: '../menu/menu'+ (that.data.fromYuDing ? '?fromYuDing=true&' : '?') + 'checkmenu=0&locationindex=' + that.data.locationindex + '&orderid=' + that.data.orderid + '&ordertype=' + that.data.ordertype   ,
                        })

                    } else if (e.currentTarget.dataset.model != 1) {} else if (that.data.userNum == undefined || that.data.userNum == '' || that.data.userNum <= 0) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '用餐人数必须填写并且大于0',
                            showCancel: false,
                        })
                    } else if (that.data.phonenumber == undefined || that.data.phonenumber.length < 11) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '必须填写真实有效的手机号码',
                            showCancel: false,
                        })
                    } else if (that.data.username == undefined || that.data.username == '') {
                        wx.showModal({
                            title: '温馨提示',
                            content: '必须填写点餐人姓名',
                            showCancel: false,
                        })
                    } else
                    if (that.data.locationid == undefined || that.data.locationid < 0) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '必须选择餐桌位置',
                            showCancel: false,
                        })
                    } else if (that.data.locationid > 0 && that.data.old_locationid != that.data.locationid) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '请选择您已订的餐桌',
                            showCancel: false,
                        })
                    } else if (legaltime != true) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '请填写合理的时间',
                            showCancel: false,
                        })
                    } else {
                        wx.showModal({
                            title: '温馨提示',
                            content: '未知错误',
                            showCancel: false,
                        })
                    }
                } else {
                    console.log(3)
                    //判断桌号是否空闲
                    for (var i = 0; i < that.data.alltable.length; i++) {
                        if (that.data.alltable[i].table_id == that.data.locationid && that.data.alltable[i].table_status == 1) {
                            canbook = true
                            break
                        }
                    }
                    //判断到店时间和用餐时间是否合理
                    var timestamp = Date.parse(new Date());
                    var bookdate = that.data.date + ' ' + that.data.time
                    var bookdate1 = that.data.date + ' ' + that.data.atime
                    var bookdatestamp = new Date(bookdate.replace(/-/g, "/")).getTime()
                    var bookdatestamp1 = new Date(bookdate1.replace(/-/g, "/")).getTime()
                    var legaltime = false
                    if (timestamp < bookdatestamp1 && bookdatestamp1 <= bookdatestamp) {
                        legaltime = true
                    }
                    if (that.data.locationid != null && that.data.userInfo != undefined && that.data.userInfo != '' && that.data.phonenumber != undefined && that.data.phonenumber.length == 11 && that.data.userNum != undefined && that.data.userNum != '' && that.data.userNum > 0 && canbook == true && legaltime == true) {

                        if (e.currentTarget.dataset.model == 1) {
                            app.globalData.eatin = false

                            //进入页面前，把数据放到全局，防止第一次点的时候，又跳回来
                            app.globalData.atime = that.data.atime
                            app.globalData.time = that.data.time
                            app.globalData.date = that.data.date
                            app.globalData.userNum = that.data.userNum
                            app.globalData.username = that.data.username
                            app.globalData.phonenumber = that.data.phonenumber

                            let bookTime = that.data.date + " " + (that.data.time ? that.data.time : '00:00:00')
                            wx.request({
                                url: app.globalData.addTableManageChoose,
                                // url: 'http://192.168.8.18:8080/evaluation/addTableManageChoose',
                                data: {
                                    tableId: that.data.locationid,
                                    orderCode: code,
                                    shopId: app.globalData.shopid,
                                    bookerId: app.globalData.customerInf.id,
                                    bookTime: bookTime,
                                    bookerType: 0,
                                },
                                success: res => {
                                    if (res.data.code == 2) {
                                        wx.showToast({
                                            title: '该桌已被占用！',
                                            icon: "error",
                                            duration: 1000,
                                            success: res => {
                                                that.getfreetableinfo(1);
                                            }
                                        })
                                    } else if (res.data.code == 1) {
                                        // 判断购物车是否有菜品，有就返回购物车页面
                                        if (app.globalData.cartList.length > 0) {
                                            wx.navigateTo({
                                                url: '../menu/menu'+ (that.data.fromYuDing ? '?fromYuDing=true&' : '?') + 'locationindex=' + that.data.locationindex + '&orderid=' + that.data.orderid + '&ordertype=' + that.data.ordertype   ,
                                            })
                                        } else {
                                            var dinner_time = String(app.globalData.date) + ' ' + String(app.globalData.time) + ':00'
                                            app.globalData.dinner_time = dinner_time;
                                            wx.navigateTo({
                                                url: '../menu/menu'+ (that.data.fromYuDing ? '?fromYuDing=true&' : '?') + 'locationindex=' + that.data.locationindex + '&orderid=' + that.data.orderid + '&ordertype=' + that.data.ordertype  ,
                                            })
                                        }
                                    }
                                }
                            })


                        } else {
                            if (locationindex != 2) {
                                that.submit()
                            }
                        }

                    } else if (that.data.userNum == undefined || that.data.userNum == '' || that.data.userNum <= 0) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '用餐人数必须填写并且大于0',
                            showCancel: false,
                        })
                    } else if (that.data.phonenumber == undefined || that.data.phonenumber.length < 11) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '必须填写真实有效的手机号码',
                            showCancel: false,
                        })
                        // } else if (that.data.username == undefined || that.data.username == '') {
                    } else if (that.data.userInfo == undefined || that.data.userInfo == '') {
                        wx.showModal({
                            title: '温馨提示',
                            content: '必须填写点餐人姓名',
                            showCancel: false,
                        })
                    } else if (that.data.locationid == undefined || that.data.locationid < 0) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '必须选择餐桌位置',
                            showCancel: false,
                        })
                    } else if (that.data.locationid > 0 && canbook == false) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '请选择状态为空闲的餐桌',
                            showCancel: false,
                        })
                    } else if (legaltime != true) {
                        wx.showModal({
                            title: '温馨提示',
                            content: '请填写合理的时间',
                            showCancel: false,
                        })
                    } else {
                        wx.showModal({
                            title: '温馨提示',
                            content: '未知错误',
                            showCancel: false,
                        })
                    }
                }
            }
        })
        // 添加粉丝表
        that.selectPublicFans()
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
                        shopId: that.data.shopdetail.shop_id,
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
    },
    closeBooking() {
        let that = this
        that.setData({
            bookingroom: false,
        })
    },
    booking() {
        let that = this
        app.globalData.eatin = false
        // 判断购物车是否有菜品，有就返回购物车页面
        if (app.globalData.cartList.length > 0) {
            wx.navigateTo({
                url: '../menu/menu'+ (that.data.fromYuDing ? '?fromYuDing=true&' : '?') + 'locationindex=' + that.data.locationindex + '&orderid=' + that.data.orderid + '&ordertype=' + that.data.ordertype  ,
            })
        } else {
            var dinner_time = String(app.globalData.date) + ' ' + String(app.globalData.time) + ':00'
            app.globalData.dinner_time = dinner_time;

            var sex = sex = '女士'
            if (that.data.index == 0) {
                sex = '先生'
            }
            wx.request({ //获取订单号
                url: app.globalData.getOrderCode_url,
                data: {
                    shop_id: app.globalData.shopid,
                },
                success: function (res) {
                    console.log(res.data.orderCode);
                    that.setData({
                        orderCode: res.data.orderCode
                    }, () => {
                        wx.request({
                            url: app.globalData.WriteOrder_url,
                            data: {
                                Order_remark: that.data.orderRemark ? that.data.orderRemark : '',
                                Order_code: that.data.orderCode,
                                Order_type: 1, //订单类型：0-堂食、1-预定、2-外卖
                                Shop_id: app.globalData.shopid,
                                Table_id: that.data.locationid,
                                User_count: that.data.userNum, //用餐人数
                                User_id: app.globalData.user_id,
                                Users_id: app.globalData.user_id, //点餐人id，可多人点餐
                                Grand_total: 0, //应收
                                Order_subtotal: 0, //订单小计
                                arrival_time: String(that.data.date) + ' ' + String(that.data.atime) + ':00', //差一个日期
                                dinner_time: String(app.globalData.date) + ' ' + String(app.globalData.time) + ':00',
                                order_wait: 0, //菜品是否需要叫起
                                phone_num: that.data.phonenumber,
                                user_name: that.data.userInfo + sex,
                                dishes_count: 0,
                                invoice_flag: 0,
                                preorder_starus: 0,
                                operator: "无",
                                tbc_count: "0,0",
                                table_name: that.data.locationname,
                                help_order: 0,
                                cz_flag: 0,
                                order_equipment_type: 3,
                                customer_id: app.globalData.user_id,
                            },
                            success: function (res) {
                                if (res.data.result.result == 1) {
                                    that.setData({
                                        bookingroom: false,
                                    })
                
                                    if (app.globalData.selectedManagerId > 0){
                                        //用户选了订房部长，需要写到订单表里
                                        wx.request({                                
                                            url:app.globalData.updateDownPayment,
                                            data:{
                                                minister_id: app.globalData.selectedManagerId,
                                                minister_name: app.globalData.selectedManagerName,
                                                shopId: app.globalData.shopid,
                                                orderId: res.data.object[0].order_id              
                                            },
                                            method:'POST',
                                            header: {
                                            'content-type': 'application/json'
                                            },                                
                                        })
                                    }                    

                                    wx.showToast({
                                        title: '订房成功',
                                        icon: 'success',
                                        duration: 1500
                                    })
                                    wx.reLaunch({
                                        url: '/pages/orders/orders?user_id=' + app.globalData.user_id + '&userInfoName=' + that.data.userInfo + '&phonenumber=' + that.data.phonenumber,
                                    })
                                } else {
                                    wx.showToast({
                                        title: '订房失败',
                                        icon: 'error',
                                        duration: 1500
                                    })
                                }
                            }
                        })
                    })
                }
            })

        }
    },
    //订房提交
    bookroom: function (e) {
        var that = this;
        var canbook = false
        var hadchangetable = that.data.hadchangetable
        var locationindex = that.data.locationindex

        //判断桌号是否空闲
        for (var i = 0; i < that.data.alltable.length; i++) {
            if (that.data.alltable[i].table_id == that.data.locationid && that.data.alltable[i].table_status == 1) {
                canbook = true
                break
            }
        }
        //判断到店时间和用餐时间是否合理
        var timestamp = Date.parse(new Date());
        var bookdate = that.data.date + ' ' + that.data.time
        var bookdate1 = that.data.date + ' ' + that.data.atime
        var bookdatestamp = new Date(bookdate.replace(/-/g, "/")).getTime()
        var bookdatestamp1 = new Date(bookdate1.replace(/-/g, "/")).getTime()
        var legaltime = false
        if (timestamp < bookdatestamp1 && bookdatestamp1 <= bookdatestamp) {
            legaltime = true
        }
        if (that.data.locationid != null && that.data.username != undefined && that.data.username != '' && that.data.phonenumber != undefined && that.data.phonenumber.length == 11 && that.data.userNum != undefined && that.data.userNum != '' && that.data.userNum > 0 && canbook == true && legaltime == true) {
            that.setData({
                bookingroom: true
            })
        } else if (that.data.userNum == undefined || that.data.userNum == '' || that.data.userNum <= 0) {
            wx.showModal({
                title: '温馨提示',
                content: '用餐人数必须填写并且大于0',
                showCancel: false,
            })
        } else if (that.data.phonenumber == undefined || that.data.phonenumber.length < 11) {
            wx.showModal({
                title: '温馨提示',
                content: '必须填写真实有效的手机号码',
                showCancel: false,
            })
        } else if (that.data.username == undefined || that.data.username == '') {
            wx.showModal({
                title: '温馨提示',
                content: '必须填写点餐人姓名',
                showCancel: false,
            })
        } else
        if (that.data.locationid == undefined || that.data.locationid < 0) {
            wx.showModal({
                title: '温馨提示',
                content: '必须选择餐桌位置',
                showCancel: false,
            })
        } else if (that.data.locationid > 0 && canbook == false) {
            wx.showModal({
                title: '温馨提示',
                content: '请选择状态为空闲的餐桌',
                showCancel: false,
            })
        } else if (legaltime != true) {
            wx.showModal({
                title: '温馨提示',
                content: '请填写合理的时间',
                showCancel: false,
            })
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '未知错误',
                showCancel: false,
            })
        }
       

    },

    //跳出请部长弹窗
    changehelporder: function (e) {
        var that = this;
        var models = e.currentTarget.dataset.model
        var noteshows
        that.setData({
            noteshows: true,
            models: models
        })
    },

    //请部长点餐备注
    addremarks: function (e) {
        console.log(e.detail.value)
        var that = this
        var remark = e.detail.value
        that.setData({
            remark: remark
        })
    },
    //确认选好座位，判断参数都填好后就跳转 帮客点餐
    closeWindow: function (e) {
        var that = this;
        var noteshows
        that.setData({
            noteshows: false
        })
        var canbook = false
        var hadchangetable = that.data.hadchangetable
        var locationindex = that.data.locationindex
        console.log(3)
        //判断桌号是否空闲
        for (var i = 0; i < that.data.alltable.length; i++) {
            if (that.data.alltable[i].table_id == that.data.locationid && that.data.alltable[i].table_status == 1) {
                canbook = true
                break
            }
        }
        //判断到店时间和用餐时间是否合理
        var timestamp = Date.parse(new Date());
        var bookdate = that.data.date + ' ' + that.data.time
        var bookdate1 = that.data.date + ' ' + that.data.atime
        var bookdatestamp = new Date(bookdate.replace(/-/g, "/")).getTime()
        var bookdatestamp1 = new Date(bookdate1.replace(/-/g, "/")).getTime()
        var legaltime = false
        if (timestamp < bookdatestamp1 && bookdatestamp1 <= bookdatestamp) {
            legaltime = true
        }
        if (that.data.locationid != null && that.data.username != undefined && that.data.username != '' && that.data.phonenumber != undefined && that.data.phonenumber.length == 11 && that.data.userNum != undefined && that.data.userNum != '' && that.data.userNum > 0 && canbook == true && legaltime == true) {
            if (that.data.models == 0) {
                app.globalData.eatin = false
                // 判断购物车是否有菜品，有就返回购物车页面
                if (app.globalData.cartList.length > 0) {

                    // wx.navigateBack({
                    //   delta: 1
                    // })

                    wx.navigateTo({
                        url: '../menu/menu'+ (that.data.fromYuDing ? '?fromYuDing=true&' : '?') + 'locationindex=' + that.data.locationindex + '&orderid=' + that.data.orderid + '&ordertype=' + that.data.ordertype  ,
                    })
                } else {

                    var dinner_time = String(app.globalData.date) + ' ' + String(app.globalData.time) + ':00'
                    app.globalData.dinner_time = dinner_time;
                    console.log("dinner_time" + app.globalData.dinner_time);



                    var sex = sex = '女士'
                    if (that.data.index == 0) {
                        sex = '先生'
                    }
                    var help_order = 1
                    wx.request({
                        url: app.globalData.WriteOrder_url,
                        data: {
                            Order_type: 1, //订单类型：0-堂食、1-预定、2-外卖
                            Shop_id: app.globalData.shopid,
                            Table_id: that.data.locationid,
                            User_count: that.data.userNum, //用餐人数
                            User_id: app.globalData.user_id,
                            Users_id: app.globalData.user_id, //点餐人id，可多人点餐
                            Grand_total: 0, //应收
                            Order_subtotal: 0, //订单小计
                            arrival_time: String(that.data.date) + ' ' + String(that.data.atime) + ':00', //差一个日期
                            dinner_time: String(app.globalData.date) + ' ' + String(app.globalData.time) + ':00',
                            order_wait: 1, //菜品是否需要叫起
                            phone_num: that.data.phonenumber,
                            user_name: that.data.username + sex,
                            dishes_count: 0,
                            invoice_flag: 0,
                            preorder_starus: 0,
                            operator: "无",
                            tbc_count: "0,0",
                            table_name: that.data.locationname,
                            help_order: help_order,
                            cz_flag: 0,
                            Order_remark: that.data.remark, //订单备注
                        },

                        success: function (res) {

                            wx.navigateTo({
                                url: '../orders/orders?locationindex=' + that.data.locationindex + '&orderid=' + that.data.orderid + '&ordertype=' + that.data.ordertype,
                            })
                        }
                    })

                }

            } else {
                if (locationindex != 2) {
                    that.submit()
                }
            }

        } else if (that.data.userNum == undefined || that.data.userNum == '' || that.data.userNum <= 0) {
            wx.showModal({
                title: '温馨提示',
                content: '用餐人数必须填写并且大于0',
                showCancel: false,
            })
        } else if (that.data.phonenumber == undefined || that.data.phonenumber.length < 11) {
            wx.showModal({
                title: '温馨提示',
                content: '必须填写真实有效的手机号码',
                showCancel: false,
            })
        } else if (that.data.username == undefined || that.data.username == '') {
            wx.showModal({
                title: '温馨提示',
                content: '必须填写点餐人姓名',
                showCancel: false,
            })
        } else
        if (that.data.locationid == undefined || that.data.locationid < 0) {
            wx.showModal({
                title: '温馨提示',
                content: '必须选择餐桌位置',
                showCancel: false,
            })
        } else if (that.data.locationid > 0 && canbook == false) {
            wx.showModal({
                title: '温馨提示',
                content: '请选择状态为空闲的餐桌',
                showCancel: false,
            })
        } else if (legaltime != true) {
            wx.showModal({
                title: '温馨提示',
                content: '请填写合理的时间',
                showCancel: false,
            })
        } else {
            wx.showModal({
                title: '温馨提示',
                content: '未知错误',
                showCancel: false,
            })
        }

    },




    //获得现在的年月日
    getdate: function () {
        var timestamp = Date.parse(new Date());
        var date = new Date(timestamp);
        // var date2 = new Date(timestamp + 5184000000) //可以提前2个月预订
        var date2 = new Date(timestamp + 160057209400)
        //年  
        var Y = date.getFullYear();
        //月  
        var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
        //日  
        var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
        //年  
        var y = date2.getFullYear();
        //月  
        var m = (date2.getMonth() + 1 < 10 ? '0' + (date2.getMonth() + 1) : date2.getMonth() + 1);
        //日  
        var d = date2.getDate() < 10 ? '0' + date2.getDate() : date2.getDate();

        var nowdate = Y + '-' + M + '-' + D
        var afterdate = y + '-' + m + '-' + d
        // var afterdate = Y + '-' + M + '-' + D
        this.setData({
            nowdate: nowdate,
            afterdate: afterdate
        })

    },

    //查询包房
    roomdetail: function (res) {
        var that = this
        wx.request({
            // url: 'https://mb.fsmbdlkj.com/demo1_war/servlet/selectRoomServlet',
            url: app.globalData.SelectRoomServlet_url,
            data: {
                shop_id: app.globalData.shopid,
                field_type: 1
            },
            success: function (res) {
                that.setData({
                    roomdetail: res.data
                })
            },
        })
    },
    //获取营业时间
    getoperatingTime: function () {
        var that = this;
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
    comeback: function () {
        var that = this;
        wx.navigateBack({
            delta: 1
        })
    },
    // 获取UnionID
    selectUnionID: function () {
        var that = this
        wx.login({
            success: function (res) {
                if (res.code) {
                    var code = res.code
                    wx.getUserInfo({
                        success: function (res) {
                            app.globalData.encryptedData = res.encryptedData
                            app.globalData.iv = res.iv
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
                                    console.log(res)
                                    that.setData({
                                        unionID: res.data.data.unionId,
                                        openid: res.data.data.openid,
                                        showModalStatus: false
                                    })
                                    that.isFirst(res.data.data.openid, res.data.data.unionId)
                                },
                                fail: function (res) {
                                    console.log(res.errMsg);
                                }
                            })
                        },
                        fail: function (res) {
                            console.log(res.errMsg);
                        }
                    })
                }
            },
            fail: function (res) {
                console.log(res.errMsg);
            }
        })
    },

    // 判断第一次到店
    isFirst: function (openid, unionid) {
        var that = this
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
                console.log(res.data)
                if (res.data.appellation != null) {
                    console.log("再次光临");
                    that.setData({
                        isFirst: false,
                        dineUserName: res.data.appellation,
                        dinePhoneNumber: res.data.phone,
                        username: res.data.name,
                        phonenumber: res.data.phone,
                        uerCode: res.data.userCode,
                        toview: false
                    })
                    app.globalData.username = res.data.name
                    app.globalData.phonenumber = res.data.phone
                }
                that.setData({
                  userInfo: res.data.name
                })
                if (res.data.phone == '' || res.data.phone == undefined || res.data.phone == null || res.data.phone == 'null') {
                    that.authorization() //是否授权
                } else {
                    that.setData({
                        phonenumber: res.data.phone,
                    })
                    //TODO 用电话号码查询memberInfo，存在记录则修改union_id，open_id和平台编号
                    // 不存在插入电话号码，union_id,open_id和平台编号
                    console.log(app.globalData.shopid);
                    wx.request({
                        url: app.globalData.SelectMemberInfoIs_url,
                        data: {
                            phone: res.data.phone,
                            shop_id: app.globalData.shopid,
                            name: ''
                        },
                        success: res1 => {
                            if (res1.data.object.length === 0) {
                                wx.request({
                                    url: app.globalData.AddMemberInfo_url,
                                    // url: 'http://localhost:8087/WX Restaurant/AddMemberInfo',
                                    data: {
                                        nickname: res.data.name,
                                        phone: res.data.phone,
                                        name: res.data.realName,
                                        nickname: res.data.name,
                                        shop_id: app.globalData.shopid
                                    },
                                    success: res => {
                                        console.log(res);
                                    }
                                })
                            } else {
                                that.modifyMemberInfo(res1.data.object[0].ID, openid, unionid, res.data.userCode,res.data.name)
                            }
                        }
                    })
                    app.globalData.phonenumber = res.data.phone
                }

            },
            fail: function (res) {
                console.log('查询是否首次使用堂食失败' + res);
            }
        })

    },

    //修改memberInfo的注册字段
    modifyMemberInfo(id, openId, unionId, userCode,nickname) {
        wx.request({
            // url: 'http://localhost:8087/WX Restaurant/UpdateMember',
            url: app.globalData.UpdateMember_url,
            data: {
                nickname:nickname,
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

    authorization: function (res) {
        var that = this
        var phonenumber = wx.getStorageSync("phonenumber")
        if (phonenumber && phonenumber != 'null') {
            that.setData({
                showAuthorize: false,
                phonenumber: phonenumber
            })

            app.globalData.phonenumber = phonenumber
        } else {
            that.setData({
                showAuthorize: true
            })
        }
    },

    //拒绝授权，返回首页
    refused: function (res) {
        let that = this

        that.setData({
            showAuthorize: false
        })
        wx.navigateBack({
            delta: 1,
        })

    },

    //获取手机号码
    getPhoneNumber(e) {
        var that = this
        console.log(e.detail);
        wx.login({
            success: function (res) {
                if (res.code) {
                    var code = res.code
                    wx.request({
                        url: app.globalData.allUrl.getPhone,
                        data: {
                            code: code,
                            encryptedData: e.detail.encryptedData,
                            iv: e.detail.iv,
                            wechatAppId: app.getWechatAppId(),
                            //wsk: app.globalData.wsk,
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
                                wx.request({
                                    url: app.globalData.UpdateCustomerByOpenId_Url,
                                    data: JSON.stringify(data),
                                    method: 'POST',
                                    success: res2 => {
                                        app.getCustomerInfo(app.globalData.openid)
                                        wx.request({
                                            url: app.globalData.SelectMemberInfoIs_url,
                                            data: {
                                                phone: res.data.phoneNumber,
                                                shop_id: app.globalData.shopid,
                                                name: ''
                                            },
                                            success: res1 => {
                                                if (res1.data.object.length === 0) {
                                                    wx.request({
                                                        url: app.globalData.AddMemberInfo_url,
                                                        // url: 'http://localhost:8087/WX Restaurant/AddMemberInfo',
                                                        data: {
                                                            nickname: app.globalData.customerInf.name ? app.globalData.customerInf.name : '',
                                                            phone: res.data.phoneNumber,
                                                            shop_id: app.globalData.shopid
                                                        },
                                                        success: res => {
                                                            console.log(res);
                                                        }
                                                    })
                                                } else {
                                                    that.modifyMemberInfo(res1.data.object[0].ID, app.globalData.openid, app.globalData.unionID, app.globalData.customerInf.userCode,app.globalData.customerInf.name)
                                                }
                                            }
                                        })
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

    //获取屏幕高度
    getheight: function (res) {
        let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
        let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
        this.setData({
            windowHeight: windowHeight,
            windowWidth: windowWidth,
            leftscroll: windowHeight * 750 / windowWidth - 80 - 160 - 82.4,
            listmenu: windowHeight - 45,
            pop_window: 0,
            orderdetail_window: windowHeight * 0.95,
            pop_window_special: windowHeight * 0.8,
            pop_window_special_fuck: windowHeight * 0.85,
            // pop_window_for: windowHeight * 0.7 - 80 - 40 - 70 - 25 - 80
            pop_window_for: 130
        })
        console.log(windowHeight)
        console.log(this.data.leftscroll)
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if (options.fromYuDing) {
            this.setData({
                fromYuDing: true
            })
        }
        var that = this;
        that.selectUnionID()

        app.globalData.adddishes = false        
        app.globalData.cartList = []
        app.globalData.countarry = []
        app.globalData.weightarry = []
        app.globalData.sumMonney = 0;
        app.globalData.cupNumber = 0;
        app.globalData.userNum = ''
        app.globalData.date = now.getFullYear() + "-" + month + "-" + now.getDate()
        app.globalData.time = ''
        app.globalData.atime = ''        
        app.globalData.phonenumber = ''
        app.globalData.locationname = ''
        app.globalData.locationid = ''        
        let shijian = now.getFullYear() + "-" + month + "-" + now.getDate()
        this.setData({
            date: shijian
        })
        that.getoperatingstate()
        that.getoperatingTime();
        var cartList = app.globalData.cartList        
        that.getheight();
        wx.setNavigationBarTitle({
            title: "线上点餐 [" + app.globalData.shopdetail.shop_name + "]"
        })
        that.setData({
            shopdetail: app.globalData.shopdetail,
            cartList: cartList
        })
        that.setData({
            background2: app.globalData.background2
        })
        if (options) {           
            if (options.locationindex != undefined) {                
                that.setData({
                    locationindex: options.locationindex, //判断是否需要修改已经写入数据库的订单
                    orderid: options.orderid,
                    ordertype: options.ordertype
                })                
                if (options.locationindex == 1 || options.locationindex == 2) {
                    wx.request({
                        url: app.globalData.GetOrderInf_url,
                        data: {
                            User_id: app.globalData.user_id,
                            shop_id: app.globalData.shopid
                        },
                        success: function (res) {
                            if (res.data.result.result == 1) {
                                var orderlist = []
                                for (var i = 0; i < res.data.object.length; i++) {
                                    if (res.data.object[i].order_display == 1) {
                                        orderlist.push(res.data.object[i])
                                    }
                                }
                                that.setData({
                                    orderslist: orderlist,
                                    isshowtable: true
                                })
                                for (var i = 0; i < res.data.object.length; i++) {
                                    if (res.data.object[i].order_id == options.orderid) {
                                        var arr = res.data.object[i].arrival_time.split(" ")
                                        var arr1 = res.data.object[i].dinner_time.split(" ")
                                        var atime1 = arr[1].substring(0, 5)
                                        var atime2 = arr1[1].substring(0, 5)
                                        var name = res.data.object[i].user_name.substring(0, res.data.object[i].user_name.length - 2)
                                        app.globalData.userNum = res.data.object[i].user_count
                                        app.globalData.atime = atime1
                                        app.globalData.dtime = atime2
                                        app.globalData.time = atime2
                                        console.log(" app.globalData.time" + app.globalData.time)
                                        app.globalData.date = arr1[0]
                                        app.globalData.username = name
                                        app.globalData.phonenumber = res.data.object[i].phone_num
                                        app.globalData.locationid = res.data.object[i].table_id
                                        if (options.locationindex == 2) {
                                            that.setData({
                                                old_locationid: res.data.object[i].table_id
                                            })
                                        }
                                        console.log(res.data.object[i])
                                        that.setData({
                                            userNum: res.data.object[i].user_count,
                                            atime: atime1,
                                            dtime: atime2,
                                            time: atime2,
                                            date: arr1[0],
                                            locationid: res.data.object[i].table_id,
                                            username: name,
                                            locationname: res.data.object[i].table_name,
                                            phonenumber: res.data.object[i].phone_num
                                        })
                                    }
                                }
                                that.getfreetableinfo()
                            }
                        },
                    })
                }
            }
        } else {            
            this.setData({
                atime: app.globalData.atime,
                time: app.globalData.time,
                date: app.globalData.date,
                userNum: app.globalData.userNum,
                username: app.globalData.username,
                phonenumber: app.globalData.phonenumber
            })
            if (this.data.date != '' && this.data.time != '' && this.data.atime != '') {
                that.getfreetableinfo()
                this.setData({
                    isshowtable: true
                })
            }

        }
        that.getdate()
        that.roomdetail()
        that.getfreetableinfo()
        app.globalData.sex = '先生'        
        this.setData({
            userInfo: app.globalData.customerInf.name,
            phonenumber: app.globalData.customerInf.phone,
        })
        app.getmenu()
        that.loadAllManagers()
    },
})