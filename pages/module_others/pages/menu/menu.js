import {
    MorePorridgeModel
} from '../../../../models/morePorridge.js'
var morePorridgeModel = new MorePorridgeModel();
import Dialog from '../../../../miniprogram_npm/@vant/weapp/dialog/dialog';
import RMQV3 from '../../../../utils/RMQV3.js';
const app = getApp()
const WXAPI = require('../../../../wxapi/main');
var util = require('../../../../utils/util.js');
const remarkJS = require('../../../../utils/remark.js');
const jurisdiction = require('../../../../utils/jurisdiction.js');

Page({

    data: {
        set_meal_array:[],//套餐 210 211 220 3种
        is_video_show:app.globalData.is_video_show,
        fromYuDing: false,
        xdswidth: false,
        c1Idx: 0,
        c2Idx: 0,
        c3Idx: 0,
        // 
        maodian: '',
        lock: false, //多拼粥备注锁定按钮控制
        tempShare: [],
        temporaryCode: true, //用来显示临时菜加减按钮
        menuList: [],
        cartList: [],
        scrollTop: 100,
        showModalStatus: false, //选规格弹窗标志
        showModalStatus1: false, //菜篮子的称重详情显示标志
        showModalStatus2: false, //菜单多做法显示标志
        showModalStatus5: false, //菜单多规格多做法显示标志
        showModalStatus4: false, //菜品介绍显示标志
        showModalStatus6: false, //单规格称重弹框控制
        showIntroduction: false, //菜品介绍弹窗显示标志
        showTaste: false, //显示口味选择
        showRemarkList: false, // 快捷备注框
        showpeicai: false, //配菜弹框
        showMultipleEatMethodView: false,
        showMultipleEatAndSpecView: false,
        showMaterial: false, //多拼粥 显示材料选择
        showAdv: false,
        isAdd: false,
        sum: '',
        inputvalue: 0,
        inputvalue1: 99,
        sVideo: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/smp/2021-10-26/29cf9f8977174343aed3a17c8a5a74f5.mp4',
        menu_img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/index/menu.png',
        i_close_img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/i_close.png',
        radio_on_img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/radio_on.png',
        radio_off_img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/radio_off.png',
        text_img: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/text.png",
        tempImg: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/tempImg.jpg',
        showSide: false,
        sumMonney: 0, //2020-12-16 底部购物车的价格显示
        cupNumber: 0, //购物车右上角统计数量小标
        showCart: false,
        guige_Num: '', //选择规格后的数量
        guige_name: '', //选择规格后的名称(只有称重多规格)
        s1: 0, //菜单级别标志
        s2: -1,
        s3: -1,
        s4: 0,
        dishesSpecArry: [], //做法数组
        countarry: [], //计菜品组数量
        weightarry: [], // 称重菜品组
        showRecommended: false, //显示推荐
        showdiscount: false, //显示折扣优惠
        addtobuyarry: [], //添加购买的菜品  加购的时候会用到
        fackyousevencolor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
        fackyousevencolor1: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
        showsecond: true,
        cookwayindex: -1,
        cookway: "",
        remark: '', //备注
        pages: 1,
        menu: [], //菜单
        showloadmore: true,
        reachbottom: false, //到底了
        showlack: false,
        difference_state: 3600000, //1小时,
        difference_flag: false, //判断是否确定时间
        selecthowtodo_flag: true, //选择吃法 不过现在没怎么用
        eatMethodArray: [],
        quickRemarkType: 0,
        quickRemarkList: [], // 快捷备注列表
        remark_index: [], // 快捷备注选择序号
        quickRemark: '', //2020-11-19 快捷备注，显示用
        chooseGuigeIndex: -1, //配菜选规格时选中的下表，记得变回-1
        isWhole: true,
        changeweightdishes_flag: false,
        result_em: true,
        result_en: true,
        afterAddNum: [],
        afterAddflag: true,
        addnum_init: [],
        orderDetail: [],
        orderDetail_cantchange: [],
        menu_num: 0, //刷新次数
        username: app.globalData.username, //用户名
        dishes: [], //菜品信息
        SideDishList: [], // 配菜信息
        SideDishList_choose: [], // 选中的配菜信息
        conventional_dishes: 0, //普通菜品
        tea_rice: 0, //茶位米饭
        drinks_dishes: 0, //酒水
        other_dishes: 0, //其他菜品
        weighing_dishes: 0, //称重菜品
        morning_dishes: 0, //早市
        afternoon_dishes: 0, //午市
        weighting_afterflag: false, //称重后菜品标志
        parttoeat: -1,
        embasicarry: [], //xin
        enbasicarry: [], //xin
        indexqq: '',
        video_open: false, //打开视频播放
        video_src: '', //视频地址
        video_name: '', //打开视频的菜的名字
        dishesIndex: '', //菜品的
        parent_type_id: 0, //记录'米饭'的二级类别id,用于操作米饭不默认数量,而茶位默认数量
        takeOut: false, //判断是否是自提外卖
        sum_position: 0, //选择的部位 , 加收的总额
        queryData: "", // 搜索输入框
        isQuery: false, //是否是搜索状态，作用于隐藏第三级别
        lastTapDiffTime: 0, // 上一次触摸距离页面打开时间毫秒数，默认为0
        setInter: '',
        needRemain: false, //需要剩余部位
        Order_type: '', //订单类型：0-堂食、1-预定、2-外卖
        Shop_id: '', //店铺ID
        Table_id: '', //店铺ID
        User_count: '', //用餐人数
        user_name: '', //用户姓名
        phone_num: '00000000000', //电话号码
        dinner_time: '0000-00-00 00:00:00', //用餐时间
        table_name: '', //桌位名称
        dishes_count: '', //菜品数量
        User_id: '',
        Users_id: '', //点餐人id，可多人点餐
        Grand_total: '', //应收
        Order_subtotal: '', //订单小计
        arrival_time: '0000-00-00 00:00:00',
        order_wait: 0, //菜品是否需要叫起 0-即上 ，1-叫起，2-现在上菜和即上，3-现在上菜和叫起
        invoice_flag: 0, //是否开发票 0-不开 1-开
        preorder_starus: 1, //预定订单状态 0-未确认、1-已确认、2-申请取消、3-已取消、4-已申请确认、5-申请修改、6-已修改、7-不能修改
        operator: '000', //操作人员记录
        operation_time: '0000-00-00 00:00:00', //订单操作时间
        tbc_count: '', //待确认菜品数
        help_order: 2, //0-自点餐、1-帮客点餐、2-直接点餐
        cz_flag: 0, //充整标志0-不充整，1-充整
        order_id: '',
        order_code: '', // 订单码
        tastes: '', // 口味标签，下单提交用
        tastesRemark: '', // 口味标签，显示用
        Order_remark: '', //订单备注
        tasteList: [], //口味选择
        shrinkIntrIntroduction: false, // 是否缩小介绍框
        ordertype: 0, //0-下单、1-加餐
        // 是否显示弹窗、商品数据、食材的数据、菜品介绍、客人备注
        show: false, // 是否显示多拼粥弹框
        foodIntroduce: "", //菜品介绍
        // guestRemark: "", //客人备注
        porridgeObject: {}, // 多拼粥材料
        porridgeObjectList: [], // 多拼粥材料,已选
        porridgeBackObject: {},
        goodModel: {},
        currentDishesModel: {},
        remark_height: 500, // 常用备注滚动框的高度
        specBtnChooseIndex: 0, //默认选择第一个规格

        whole: [], //全部位的做法分组
        parts: [], //分部位的做法分组
        em_index: [],
        en_index: [],
        em_arry: [],
        em_basicarry: [],
        en_basicarry: [],
        measurementValueInput: '', //称重菜品的重量，输入用

        dishesNumber: 0, // 多规格弹窗，显示用，份数
        dishesMoney: 0.0, // 多规格弹窗，显示用，金额
        isType10: true,
        EatmethodAndSpec: [], //多规格多做法的数组，在spec_type = 10的时候才使用,
        isActive: false, //沽清按钮是否被选中
        isChecked: false, //沽清食材是否选中
        foods_material: [], //菜品的食材
        isSelloff: false, //菜品是否被沽清
        isShowModal: false, //带有食材的弹出框
        stuffList: [], //沽清食材id

        levellist: [], //权限数组

        readOnly: true, //备注弹框输入控制判断，false是可输入状态
        chooseDishesIndex: -1, //多选更改时，选择的菜的下标，与newList有关

        inputSpecNum: 1, //多规格数量输入框
        choosedishesSpecArry: [], //多规格已选中规格的数组
        choosedishesSpecIndex: 0, //多规格已选中规格的数组的下标
        chooseSpecItem: '', //多规格--规格
        eatMethodArraySum: 0,
        eatMethodArrayNumber: 0,
        eamChoose: -1, //多规格多做法选中的做法下标
        spec_type1: '', //用于多拼粥判断
        toMenu: '',
        shineb: true,
        shinef: true,
        checkmenu: 0,
        curr: 0,
        videoList: [], //广告视频

        firstlevel: '', //菜品第一级
        secondlevel: '', //菜品第二级
        thirdlevel: '', //菜品第三级
        is_join_platform: 1, //是否入驻
    },



    // 分类显示标志（菜单列表显示分类）
    order_show: function () {
        var that = this;
        var cartList = that.data.cartList;
        console.log(cartList)
        for (var i = 0; i < cartList.length; i++) {
            // 普通菜品分类
            if (cartList[i].specal_type == 0 && cartList[i].spec_name != '称重') {
                var conventional_dishes = 1;
            }
            // 茶位米饭
            if (cartList[i].specal_type == 1 && cartList[i].spec_name != '称重') {
                var tea_rice = 1;
            }
            // 酒水
            if (cartList[i].specal_type == 2 && cartList[i].spec_name != '称重') {
                var drinks_dishes = 1;
            }
            // 其他菜品
            if (cartList[i].specal_type == 3 && cartList[i].spec_name != '称重') {
                var other_dishes = 1;
            }
            // 早市菜品
            if (cartList[i].specal_type == 4 && cartList[i].spec_name != '称重') {
                var morning_dishes = 1;
            }
            // 午市菜品
            if (cartList[i].specal_type == 5 && cartList[i].spec_name != '称重' || (cartList[i].specal_type == 5 && cartList[i].dishes_spec_type == 5)) {
                var afternoon_dishes = 1;
            }
            // 称重菜品
            if (cartList[i].spec_name == '称重' && cartList[i].dishes_spec_type != 5) {
                var weighing_dishes = 1;
            }
        }

        that.setData({
            conventional_dishes: conventional_dishes,
            tea_rice: tea_rice,
            drinks_dishes: drinks_dishes,
            other_dishes: other_dishes,
            weighing_dishes: weighing_dishes,
            morning_dishes: morning_dishes,
            afternoon_dishes: afternoon_dishes,
        })

        app.globalData.conventional_dishes = conventional_dishes;
        app.globalData.tea_rice = tea_rice;
        app.globalData.drinks_dishes = drinks_dishes;
        app.globalData.other_dishes = other_dishes;
        app.globalData.weighing_dishes = weighing_dishes;
        app.globalData.morning_dishes = morning_dishes;
        app.globalData.afternoon_dishes = afternoon_dishes;
    },


    // 点击一级分类
    tapClassify1(e) {
        console.log(e)
        const {
            c1Idx
        } = e.currentTarget.dataset
        var dishesInfs = []
        if (this.data.menuList[c1Idx].class1s[0].class2.length > 0) {
            var dishesInfs = this.data.menuList[c1Idx].class1s[0].class2[0].dishesInfs
        }
        let showsecond = this.data.showsecond
        if (this.data.c1Idx == c1Idx) {
            showsecond = !showsecond
        } else {
            showsecond = true
        }
        this.setData({
            showsecond,
            c1Idx,
            c2Idx: 0,
            c3Idx: 0,
            menu: dishesInfs,
            temporaryCode: this.data.menuList[c1Idx].specal_type !== 6
        })

    },
    // 点击一级分类
    tapClassifyBargain(e) {
        const {
            c1Idx
        } = e.currentTarget.dataset

        let valueMeals = this.data.valueMeals
        // valueMeals.push(this.data.valueMeals)
        let specialDishes = this.data.specialDishes
        // specialDishes.push(this.data.specialDishes)
        let dishesInfs = this.data.menu
        if (c1Idx == 100) {
            dishesInfs = valueMeals
        } else if (c1Idx == 101) {
            dishesInfs = specialDishes
        }
        this.setData({
            c1Idx,
            menu: dishesInfs,
        })
    },

    SelectTicketOrderDetailedWithSetMeal() {
        let that = this
        // console.log(app.globalData.user_id);
        // console.log(app.globalData.user_id);
        let shopdetail = app.globalData.shopdetail
        // if(that.data.thisorderarry){
        //   app.globalData.user_id = that.data.thisorderarry.user_id
        // }
        wx.request({
            url: app.globalData.SelectTicketOrderDetailedWithSetMeal,
            // url:'http://192.168.8.163:8083/evaluation_war/SelectTicketOrderDetailedWithSetMeal',
            // url:'http://192.168.8.7:8081/evaluation/SelectTicketOrderDetailedWithSetMeal',
            data: {
                shop_id: shopdetail.shop_id,
                user_id: app.globalData.user_id,
                typeForSetMeal: 0
            },
            method: 'POST',
            header: {
                'content-type': 'application/json' // 默认值
            },
            success: res => {
                let data = res.data.data
                var valueMeals = []
                var specialDishes = []
                var a = new Date().getFullYear() + '-' + (new Date().getMonth() + 1 > 10 ? (new Date().getMonth() + 1) : '0' + (new Date().getMonth() + 1)) + '-' + (new Date().getDate() > 10 ? new Date().getDate() : '0' + new Date().getDate())
                var sm = {
                    class1s: [{
                        class2: [{
                            dishesInfs: [],
                            shop_id: shopdetail.shop_id,
                            subclass_type_id: 66666,
                            type_name: "已购",
                        }, {
                            dishesInfs: [],
                            shop_id: shopdetail.shop_id,
                            subclass_type_id: 66666,
                            type_name: "赠送",
                        }],
                        parent_type_dishesInfList: {},
                        parent_type_id: 66666,
                        type_name: "普通套餐"
                    }, {
                        class2: [{
                            dishesInfs: [],
                            shop_id: shopdetail.shop_id,
                            subclass_type_id: 66666,
                            type_name: "已购",
                        }, {
                            dishesInfs: [],
                            shop_id: shopdetail.shop_id,
                            subclass_type_id: 66666,
                            type_name: "赠送",
                        }],
                        parent_type_dishesInfList: {},
                        parent_type_id: 66666,
                        type_name: "超值菜品"
                    },{
                        class2: [{
                            dishesInfs: [],
                            shop_id: shopdetail.shop_id,
                            subclass_type_id: 66666,
                            type_name: "已购",
                        }, {
                            dishesInfs: [],
                            shop_id: shopdetail.shop_id,
                            subclass_type_id: 66666,
                            type_name: "赠送",
                        }],
                        parent_type_dishesInfList: {},
                        parent_type_id: 66666,
                        type_name: "超值套餐"
                    }],
                    class_i_id: 6666,
                    mainType: "已购/赠送",
                    specal_type: 5
                }
                //这里变为普通套餐
                var isbuyMeals = sm.class1s[0].class2[0].dishesInfs
                var isfreeMeals = sm.class1s[0].class2[1].dishesInfs
                var isbuyDishes = sm.class1s[1].class2[0].dishesInfs
                var isfreeDishes = sm.class1s[1].class2[1].dishesInfs
                //这里加上超值套餐
                var isbuySetMeals = sm.class1s[2].class2[0].dishesInfs
                var isfreeSetMeals = sm.class1s[2].class2[1].dishesInfs

                data.forEach(e => {
                    if (e.typeForSetMeal == 1 && e.ticketStatus == 0) {
                        e.spec_type = 100
                        e.dishes_id =  e.ticket_order_detailed_id
                        e.sideDishes = 0
                        let dishes_introduce = ""
                        for (let i = 0; i < e.lstSetMealConstitute.length; i++) {
                            dishes_introduce += "套餐组成：\n\n" + Number(i + 1) + "." + e.lstSetMealConstitute[i].constituteName + "                       " + e.lstSetMealConstitute[i].constituteNum + e.lstSetMealConstitute[i].constituteUnit + "\n\n"
                        }
                        e.dishes_introduce = dishes_introduce
                        e.showAdd = a == e.use_time
                        valueMeals.push(e)
                        if(e.isBargainSetMeal == 1){
                            //超值套餐
                            isbuySetMeals.push(e)
                        }else{
                            //普通套餐
                            isbuyMeals.push(e)
                        }                        
                    } else if (e.ticketStatus == 0) {
                        e.spec_type = 101
                        e.dishes_id = e.ticket_order_detailed_id
                        e.sideDishes = 0
                        e.showAdd = a == e.use_time
                        specialDishes.push(e)
                        isbuyDishes.push(e)
                    }
                })
                
                let zzz = this.data.menuList
                let zbool = false
                for (let i = 0; i < this.data.menuList.length; i++) {
                    const element = this.data.menuList[i];
                    if (element.mainType == "已购/赠送") {
                        zbool = true
                    }
                }
                if (zbool) {
                    zzz.splice(zzz.length - 1, 1, sm)
                } else if (isbuyDishes.length > 0 || isbuyMeals.length > 0 || isbuySetMeals.length > 0) {
                    zzz.push(sm)
                }
                this.setData({
                    valueMeals,
                    specialDishes,
                    menuList: zzz
                },()=>{
                    let menuListNew1 = this.data.menuList
                    for (let i = 0; i < menuListNew1.length; i++) {
                        if(menuListNew1[i].class_i_id == '6666'){
                            this.setData({
                                c1Idx: i
                            },()=>{
                              let ddd = 0
                              if(isbuyMeals.length == 0 ){
                                ddd = 1
                              }else if(isbuyDishes.length == 0) {
                                ddd = 2
                              }
                              this.tapClassify2({"currentTarget":{"dataset":{c2Idx:ddd}}})
                            })
                            break;
                        }
                    }
                    
                    
                })
            }
        })
    },
    //选中左侧事件
    selectMenu(e) {
        console.log(e.currentTarget.dataset.name == '临时菜品')
        if (e.currentTarget.dataset.name == '临时菜品') {
            this.setData({
                temporaryCode: false
            })
        } else {
            this.setData({
                temporaryCode: true
            })
        }
        var that = this
        console.log(e);
        //光标是否在临时菜品上，1号奥特曼
        app.globalData.s1 = e.currentTarget.dataset.index
        if (e.currentTarget) {
            var name = e.currentTarget.dataset.name
        } else {
            var name = e;
        }
        const menuList = this.data.menuList
        var topmenuList = []
        var bottommenuList = []
        var count
        for (var i = 0; i < menuList.length; i++) {
            if (menuList[i].mainType == name) {
                count = i
                break
            }
        }
        for (var i = 0; i < menuList.length; i++) {
            if (i <= count) {
                topmenuList.push(menuList[i])
            } else {
                bottommenuList.push(menuList[i])
            }
        }
        that.setData({
            topmenuList: topmenuList,
            bottommenuList: bottommenuList,
            thirdblankheight: '70rpx'
        })
        if (menuList[that.data.s1].mainType == name) {
            that.setData({
                showsecond: !that.data.showsecond,
                s1: topmenuList.length - 1,
                s2: 0,
                s3: 0,
                s4: 0,
            })
        } else {
            that.setData({
                showsecond: true,
                s1: topmenuList.length - 1,
                s2: 0,
                s3: 0,
                s4: 0,
            })
        }
        //---------------------------------控制顶部菜单距顶高度--------------------------------------
        var num = 10
        if (that.data.s1 >= 0) {
            for (var i = 0; i < that.data.menuList[that.data.s1].class1s[0].class2.length; i++) {
                num += that.data.menuList[that.data.s1].class1s[0].class2[i].type_name.length * 28 + 15
            }

            if (num > 610) {
                that.setData({
                    // thirdblankheight: '170rpx'
                    thirdblankheight: '120rpx'
                })
            } else {
                that.setData({
                    thirdblankheight: '120rpx'
                })
            }
        } else {
            that.setData({
                thirdblankheight: '70rpx'
            })
        }
        //--------------------------------------------------------------------------------------
        that.changemenu()
    },
    // 点击二级分类
    tapClassify2(e) {
        const {
            c2Idx
        } = e.currentTarget.dataset
        for (let index = 0; index < this.data.menuList[this.data.c1Idx].class1s[c2Idx].class2[0].dishesInfs.length; index++) {
            if (this.data.menuList[this.data.c1Idx].class1s[c2Idx].class2[0].dishesInfs[index].scan != undefined) {
                this.data.menuList[this.data.c1Idx].class1s[c2Idx].class2[0].dishesInfs[index].scan = undefined
            }
        }
        this.setData({
            c2Idx,
            c3Idx: 0,
            menu: this.data.menuList[this.data.c1Idx].class1s[c2Idx].class2[0].dishesInfs
        })
        this.tapClassify3({"currentTarget":{"dataset":{c3Idx:0}}})
    },

    //选中左侧二层事件
    selectSecondMenu: function (e) {
        var that = this

        //重复点击同一二级类别不作处理
        if (e) {
            if (e.currentTarget.dataset.index == that.data.s2) {


            } else {
                that.setData({
                    s1: e.currentTarget.dataset.type,
                    s2: e.currentTarget.dataset.index,
                    s3: 0,
                    s4: 0,
                    SideDishList_choose: [],
                    SideDishList: [],
                })
            }
        }
        //距顶高度，同上
        var num = 10
        if (that.data.s1 >= 0 && that.data.s2 >= 0) {
            for (var i = 0; i < that.data.menuList[that.data.s1].class1s[that.data.s2].class2.length; i++) {
                num += that.data.menuList[that.data.s1].class1s[that.data.s2].class2[i].type_name.length * 28 + 15
            }

            if (num > 610) {
                that.setData({
                    thirdblankheight: '120rpx'
                })
            } else {
                that.setData({
                    thirdblankheight: '120rpx'
                })
            }
        } else {
            that.setData({
                thirdblankheight: '70rpx'
            })
        }
        that.changemenu()
    },

    // 点击三级菜单
    tapClassify3(e) {
        const {
            c3Idx
        } = e.currentTarget.dataset

        let a = this.data.menuList[this.data.c1Idx].class1s[this.data.c2Idx].class2
        let b = []
        for (let i = 0; i < a.length; i++) {
            const element = a[i];
            for (let j = 0; j < element.dishesInfs.length; j++) {
                const element2 = element.dishesInfs[j];
                b.push(element2)
            }
        }

        this.setData({
            c3Idx,
            menu: b
            // menu: this.data.menuList[this.data.c1Idx].class1s[this.data.c2Idx].class2[c3Idx].dishesInfs
        })
    },

    //选中顶部栏事件
    selectThirdMenu: function (e) {
        var that = this
        // console.log(e);

        if (e.currentTarget.dataset.name == '新增临时菜品') {
            wx.navigateTo({
                url: '/pages/temporary/temporary?cartList=' + JSON.stringify(that.data.cartList) + '&menuList=' + JSON.stringify(that.data.menuList) + "&newTemporary=true"
            })
        } else {
            this.setData({
                s3: e.currentTarget.dataset.index,
                s4: 0,
            })
            that.changemenu()
        }
    },

    //改变当前菜品列表
    changemenu: function (res) {
        var that = this
        var s1 = that.data.s1
        var s2 = that.data.s2
        var s3 = that.data.s3
        var menuList = that.data.menuList
        var menuList_sort = that.data.menuList_sort
        var menuListItem = []

        if (s2 < 0) {
            //获取选中第一级下 未选中的第二级第一项、第三级第一项下的菜品
            for (var j = 0; j < menuList[s1].class1s[0].class2.length; j++) {
                for (var i = 0; i < menuList[s1].class1s[0].class2[j].dishesInfs.length; i++) {
                    menuListItem.push(menuList[s1].class1s[0].class2[j].dishesInfs[i])
                }
            }
            var reachbottom = that.data.windowHeight / 100 < menuListItem.length ? true : false
            that.setData({
                menuListItem: menuListItem,
                pages: 1,
                menu: [],
                reachbottom: reachbottom,
                showloadmore: true
            })
            that.pagehelper(1, menuListItem)
            that.showImg()
            that.updateMenu()
        } else if (s3 < 0) { //获取选中第一级、第二级下 未选中的第三级第一项下的菜品
            var reachbottom = that.data.windowHeight / 100 < menuList_sort[s1].class1s[s2].parent_type_dishesInfList.length ? true : false
            that.setData({
                menu: menuList_sort[s1].class1s[s2].parent_type_dishesInfList,
                reachbottom: reachbottom,
                showloadmore: false
            })
            that.echoDishes();
            that.showImg();
            that.updateMenu();
        } else {
            //获取最后一级的菜品
            that.setData({
                menu: menuList[s1].class1s[s2].class2[s3].dishesInfs
            })
            that.echoDishes()
            that.showImg()
            that.updateMenu()
        }
    },

    //获取屏幕高度
    getheight: function (res) {
        let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
        let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
        this.setData({
            remark_height: windowHeight * 750 / windowWidth - 330,
            windowHeight: windowHeight,
            windowWidth: windowWidth,
            //菜单页面取消呼叫的长度，不取消如上注释
            leftscroll1: windowHeight * 750 / windowWidth - 80 - 90,
            listmenu: windowHeight - 40,
            pop_window: 0,
            pop_window_special: windowHeight * 0.88,
            pop_window_em: windowHeight * 0.9,
            pop_window_for: 160
        })

    },
    //单规格弹窗显示份数输入提升
    showNoOpen: function (e) {
        wx.showToast({
            icon: 'none',
            title: '请先输入份数',
        })
    },

    // 菜品做法
    choosecookway: function (e) {
        var that = this
        var index = e.currentTarget.dataset.index
        var dishesSpecArry = that.data.dishesSpecArry
        if (that.data.cookwayindex != index) {
            that.setData({
                cookwayindex: index,
                cookway: "(" + dishesSpecArry[index].spec_name + ")"
            })
        } else {
            that.setData({
                cookwayindex: -1,
                cookway: ""
            })
        }

    },

    //预览照片
    photo: function (e) {
        var that = this;
        var arry = []
        var img = e.currentTarget.dataset.bigimage
        img = img.replace('\r\n', '')
        arry.push(img)
        wx.previewImage({
            urls: arry,
            success: function (res) {}
        })
    },

    //弹窗-特别推荐
    showRecommended: function (e) {
        var that = this;
        var dishes = that.data.menu[e.currentTarget.dataset.index]
        this.setData({
            showRecommended: !this.data.showRecommended,
            dishes: dishes
        })
    },

    // 弹出多种做法或多种吃法的弹窗
    showhowtodo() {
        this.setData({
            showModalStatus2: !this.data.showModalStatus2,
        })
    },

    //选择多种做法或多种吃法
    selecthowtodo(e) {
        var index = e.currentTarget.dataset.index
        var cookwayindex = this.data.cookwayindex
        if (index == 1 && this.data.result_em) {
            this.setData({
                selecthowtodo_flag: true
            })
        } else if (index == 2 && cookwayindex == -1) {
            this.setData({
                selecthowtodo_flag: false
            })
        }
    },
    // 吃法菜品规格
    eatmethod: function (e) {
        // --------------------------------获取菜品吃法--------------------------------------
        var that = this;
        var item = e.currentTarget.dataset.item;
        var cartList = that.data.cartList
        var dishes_id = e.currentTarget.dataset.item.dishes_id;

        wx.request({
            url: app.globalData.SelectEatingMethod_url,
            data: {
                dishes_id: dishes.dishes_id
            },
            success: function (res) {
                if (res.data.result.result == 1) {
                    //--------------将部位和整吃分为两个数组----------------------
                    var em_arry = res.data.object
                    var parts = [] //部位的数组
                    var whole = [] //整体的数组
                    if (res.data.object[0]) {
                        whole = res.data.object[0]
                    }
                    if (res.data.object[1]) {
                        for (var i in em_arry) {

                            if (i > 0)
                                parts.push(res.data.object[i])
                        }
                    }
                    //---------------------------------------------------
                    var em_basicarry = []
                    var en_basicarry = []
                    // --------------获取不同部位的的数量----------------
                    that.setData({
                        parts: parts
                    })
                    // --------------------- console.log(em_parts);在em_parts中添加number,且同部位的number值是一样的------------------
                    for (var i = 0; i < parts; i++) {
                        em_basicarry.push(-1)
                    }

                    // --------------获取不同的的数量----------------

                    that.setData({
                        whole: whole
                    })
                    var g0 = false
                    if (whole.length > 0) {
                        g0 = true
                    } else {
                        g0 = false
                    }
                    that.setData({
                        green_show0: g0,
                    })

                    // --------------------- console.log(em_parts);在em_parts中添加number,且同部位的number值是一样的------------------
                    for (var i = 0; i < whole; i++) {
                        en_basicarry.push(-1)
                    }
                    var display
                    spec_type == 3 || spec_type == 4 ? display = true : display = false
                    that.setData({
                        em_arry: res.data.object,
                        changeweightdishes_flag: false,
                        em_index: em_basicarry,
                        em_basicarry: em_basicarry,
                        en_index: en_basicarry,
                        en_basicarry: en_basicarry,
                        display: display

                    })
                    wx.hideLoading();

                }

                that.setData({
                    em_arry: res.data.object,
                })
            }
        })
    },

    //多规格多做法获取规格
    selectEatmethodAndSpec: function (e) {
        var that = this
        wx.request({
            url: app.globalData.SelectEatingMethodWithSpecification,
            // url:  'http://192.168.8.2:8080/WX Restaurant/SelectEatingMethodWithSpecification',
            method: 'post',
            data: {
                dishes_id: e
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            success: function (res) {
                that.setData({
                    EatmethodAndSpec: res.data.object
                })
            }
        })
    },

    //弹窗-优惠
    showdiscount: function (e) {
        var that = this;
        var dishes = that.data.menu[e.currentTarget.dataset.index]
        that.setData({
            showdiscount: !that.data.showdiscount,
            dishes: dishes
        })
    },

    //选择称重多规格的规格
    choose_guige(e) {
        var that = this;
        var guige_Num = '';
        var guige_Num2 = '';
        var guige_name = '';
        var dishesSpecArry = that.data.dishesSpecArry
        var czgg = e.currentTarget.dataset.item
        //如果是选中的规格,则赋值为一,否则为零,防止重复选择多个规格
        for (var i = 0; i < dishesSpecArry.length; i++) {
            if (dishesSpecArry[i].spec_id == czgg.spec_id) {
                dishesSpecArry[i].number = 1
                guige_Num = dishesSpecArry[i].weightingMin
                guige_Num2 = dishesSpecArry[i].weightingMax
                guige_name = dishesSpecArry[i].spec_name
            } else {
                dishesSpecArry[i].number = 0
            }
        }
        that.chooseGuige(e)
        that.setData({
            czgg: czgg,
            dishesSpecArry: dishesSpecArry,
            guige_Num: guige_Num,
            guige_Num2: guige_Num2,
            guige_name: guige_name
        })
    },

    //当选规格菜品是有加菜的时候，选择规格的方法
    chooseGuige(e) {
        this.setData({
            chooseGuigeIndex: e.currentTarget.dataset.index
        })
    },

    showGuigeMoneyAndNumber: function (type) {
        var that = this
        if (type == 0) {
            var dishesSpecArry = that.data.dishesSpecArry
            var dishesMoney = 0
            var dishesNumber = 0
            for (var x of dishesSpecArry) {
                if (x.number > 0) {
                    dishesMoney += x.spec_price * x.number
                    dishesNumber += x.number
                }
            }
            that.setData({
                dishesMoney: dishesMoney,
                dishesNumber: dishesNumber,
            })
        } else if (type == 1) { // 多做法显示总金额
            var eatMethodArray = that.data.eatMethodArray
            var emMoney = 0
            var sideDishMoney = 0
            if (eatMethodArray.length != 0) {
                for (var x of eatMethodArray) {
                    emMoney += x.money
                }
            }
            if (that.data.dishes.sideDishes != 0) {
                if (that.data.SideDishList_choose.length != 0) {
                    for (var x of that.data.SideDishList_choose) {
                        sideDishMoney += x.orderDetailedNum * x.sideDishdPrice * 0.01
                    }
                }
            }
            var dishes = that.data.dishes
            if (dishes.spec_type == 10) {
                emMoney = 0; //多规格多做法不需要加收，已经算在规格里面了
                if (eatMethodArray.length > 0)
                    dishes.dishes_metering_type = eatMethodArray[0].dishesSpec.spec_name
            }
            dishesMoney = Number(that.data.measurementValueInput) * Number(dishes.dishes_price) + Number(emMoney) + Number(sideDishMoney)
            that.setData({
                dishesMoney: dishesMoney,
                dishes: dishes
            })
        }
    },

    //选择一菜多吃的做法部位
    choose_part(e) {
        var that = this
        var emnumber = e.currentTarget.dataset.index
        var index = e.currentTarget.dataset.index
        var name = e.currentTarget.dataset.name
        var item = e.currentTarget.dataset.item
        var en_index = that.data.en_index
        var em_arry = that.data.em_arry
        var em_index = that.data.em_index
        var em_basicarry = []
        if (that.data.em_basicarry != undefined) {
            em_basicarry = JSON.parse(JSON.stringify(that.data.em_basicarry))
        }
        em_basicarry[emnumber] && em_basicarry[emnumber].eating_method == item.eating_method ? em_basicarry[emnumber] = -1 : em_basicarry[emnumber] = JSON.parse(JSON.stringify(item))
        // em_basicarry = JSON.parse(JSON.stringify(em_basicarry))//在json格式中反复横跳,防止em_basicarry和em_index连体情况
        em_index[emnumber] && em_index[emnumber].eating_method == item.eating_method ? em_index[emnumber] = -1 : em_index[emnumber] = JSON.parse(JSON.stringify(item))
        var result = em_index.every(function (item, index, arry) { //对数组中的每一项运行给定的函数，如果该函数对每一项都返回true，则结果返回true。
            return item == -1
        })
        var result2 = en_index.every(function (item, index, arry) { //对数组中的每一项运行给定的函数，如果该函数对每一项都返回true，则结果返回true。
            return item == -1
        })
        result2 == true ? result2 = true : result2 = false
        that.setData({
            em_basicarry: em_basicarry,
            em_index: em_index,
            result_em: result,
            result_en: result2, //去掉 xin
        })
        if (that.data.dishes.spec_type == 4) {
            that.sumPosition()
        }
    },

    //选择一菜多吃的做法全鱼
    choose_whole(e) {
        var that = this;
        var emnumber = 0
        var index = e.currentTarget.dataset.index
        var name = e.currentTarget.dataset.name
        var em_index = that.data.em_index
        var en_index = that.data.en_index
        var en_basicarry = []
        var item = e.currentTarget.dataset.item
        en_basicarry = JSON.parse(JSON.stringify(that.data.en_basicarry))

        en_basicarry[emnumber] && en_basicarry[emnumber].eating_method == item.eating_method ? en_basicarry[emnumber] = -1 : en_basicarry[emnumber] = item
        en_basicarry = JSON.parse(JSON.stringify(en_basicarry)) //在json格式中反复横跳,防止en_basicarry和en_index连体情况
        en_index[emnumber] && en_index[emnumber].eating_method == item.eating_method ? en_index[emnumber] = -1 : en_index[emnumber] = item
        var result = en_index.every(function (item, index, arry) { //对数组中的每一项运行给定的函数，如果该函数对每一项都返回true，则结果返回true。
            return item == -1
        })
        var result1 = em_index.every(function (item, index, arry) { //对数组中的每一项运行给定的函数，如果该函数对每一项都返回true，则结果返回true。
            return item == -1
        })
        result1 == true ? result1 = true : result1 = false
        this.setData({
            en_basicarry: en_basicarry,
            en_index: en_index,
            result_en: result,
            result_em: result1 //去掉 xin
        })
        if (that.data.dishes.spec_type == 4) {
            that.sumPosition()
        }
    },

    // 打开选规格的时候判断是打开空页面、已经预定页面或者选规格中的修改页面
    selectInfo: function (e) {
        var that = this;
        var dishes = that.data.menu[e.currentTarget.dataset.index];
        var cartList = that.data.cartList;
        if (cartList != '' && cartList != undefined && cartList != null) {
            for (var i = 0; i < cartList.length; i++) {
                if (dishes.dishes_id == cartList[i].dishes_id) {
                    // 是否显示加号的标志，如果是1就显示加号，否则不显示
                    dishes["doMuchway_detail"] = 1;
                }
            }
        }

        if (dishes.DGG_off) {
            // 点击加号进入的弹出空数据弹窗
            that.selectInfo_null(e);
            var showModalStatus2 = false;
        } else if (dishes.doMuchway_detail) {
            // 多做法有一份菜进入修改的弹窗
            // that.selectInfovv(e);
            that.selectInfo_booking(e);
            var showModalStatus2 = true;
        } else {
            //第一次进多做法
            that.selectInfo_booking(e);
            var showModalStatus2 = true;
        }
        that.setData({
            showCartflag: false,
            showModalStatus2: showModalStatus2
        })
    },



    //弹窗-多做法(超过2个多做法按钮变灰) 
    selectInfo_null: function (e) {
        var that = this
        that.setData({
            showCartflag: false,
            showModalStatus2: false
        })
    },



    //弹窗-多做法(菜单页面的选规格 第一次进)
    selectInfo_booking: function (e) {
        var that = this;
        var remark = ''
        wx.showLoading({
            title: '加载中...',
        })
        var dishes = that.data.menu[e.currentTarget.dataset.index];
        var cartList = that.data.cartList;
        var weightarry = that.data.weightarry
        var num = Number(e.currentTarget.dataset.num)
        var name
        var shrinkIntrIntroduction = false
        var dishesIndex = e.currentTarget.dataset.index;
        if (dishes.sideDishes != 0 || dishes.spec_type != 0) {
            shrinkIntrIntroduction = true
        }
        that.setData({
            dishesIndex: dishesIndex,
            shrinkIntrIntroduction: shrinkIntrIntroduction,
            goodsIntroduce: dishes.dishes_introduce
        })
        if (weightarry != undefined && weightarry != '' && weightarry != null) {
            for (var a = 0; a < weightarry.length; a++) {
                if (weightarry[a].dishes_id == e.currentTarget.dataset.item.dishes_id) {
                    var agreenopen = true
                }
            }
            if (agreenopen == true && num == 2) {
                wx.showToast({
                    icon: 'none',
                    title: '该键此刻不能操作,如需添加请点击"+"',
                    duration: 3000
                })
            } else if (agreenopen == true && num == 1) {
                that.setData({
                    remark: '',
                    showModalStatus2: true
                })
                var dishesSpecArry = that.data.dishesSpecArry;
                // 下单多做法显示标志
                var showModalStatus2 = that.data.showModalStatus2;
                // 菜篮子打开详情显示标志
                var showModalStatus1 = that.data.showModalStatus1;
                // 下单选规格显示标志
                // var showModalStatus = that.showModalStatus;
                if (dishes != undefined) {
                    var dishes_statu = dishes.dishes_statu;
                    var spec_type = dishes.spec_type;
                    if (dishes_statu == 2) {
                        if (spec_type == 0) {
                            that.setData({
                                showModalStatus1: !that.data.showModalStatus1,
                                dishes: dishes
                            })

                        } else if (spec_type == 1 || spec_type == 2 || spec_type == 3 || spec_type == 4 || spec_type == 6 || spec_type == 8) {
                            var cart_list = [];
                            var j = 0;
                            var okey
                            if (that.data.dishesSpecArry.length > 0 && cartList.length > 0) {
                                for (var i = 0; i < cartList.length; i++) {
                                    if (cartList != undefined) {

                                        if (cartList[i].dishes_id == dishes.dishes_id) {

                                            cart_list[j] = cartList[i];
                                            j++;

                                        }
                                    }
                                }
                            }

                            wx.request({
                                url: app.globalData.SelectEatingMethod_url,
                                data: {
                                    dishes_id: dishes.dishes_id
                                },
                                success: function (res) {

                                    if (res.data.result.result == 1) {

                                        //--------------将部位和整吃分为两个数组----------------------
                                        var em_arry = res.data.object
                                        var parts = [] //部位的数组
                                        var whole = [] //整体的数组
                                        if (res.data.object[0]) {
                                            whole = res.data.object[0]
                                        }
                                        if (res.data.object[1]) {
                                            for (var i in em_arry) {
                                                if (i > 0)
                                                    parts.push(res.data.object[i])
                                            }
                                        }
                                        //---------------------------------------------------
                                        var em_basicarry = []
                                        var en_basicarry = []
                                        // --------------获取不同部位的的数量----------------
                                        that.setData({
                                            parts: parts
                                        })
                                        // --------------------- console.log(em_parts);在em_parts中添加number,且同部位的number值是一样的------------------
                                        for (var i = 0; i < parts; i++) {
                                            em_basicarry.push(-1)
                                        }

                                        // --------------获取不同的的数量----------------

                                        that.setData({
                                            whole: whole
                                        })

                                        // --------------------- console.log(em_parts);在em_parts中添加number,且同部位的number值是一样的------------------
                                        for (var i = 0; i < whole; i++) {
                                            en_basicarry.push(-1)
                                        }
                                        var display = false
                                        var showSide = false
                                        if (spec_type == 3 || spec_type == 4 || spec_type == 8) {
                                            display = true
                                        }
                                        if (spec_type == 8) {
                                            showSide = true
                                        }
                                        that.setData({
                                            em_arry: res.data.object,
                                            changeweightdishes_flag: false,
                                            em_index: em_basicarry,
                                            em_basicarry: em_basicarry,
                                            en_index: en_basicarry,
                                            en_basicarry: en_basicarry,
                                            display: display,
                                            showSide: showSide
                                        })
                                        wx.hideLoading();

                                    }
                                    that.setData({
                                        em_arry: res.data.object,
                                    })
                                }
                            })

                            that.setData({
                                dishes: dishes
                            })
                        }
                    }
                    if (dishes.sideDishes != 0) { //不等于0的时候视为存在配菜，并且值为配菜二级类别
                        that.getSideDishes(dishes.sideDishes)
                    }
                } else {
                    that.setData({
                        changeweightdishes_flag: false,
                        showModalStatus1: false,
                        showModalStatus: false,
                        cookwayindex: -1,
                        cookway: "",
                        inputvalue: "",
                        inputvalue1: ""
                    })
                }
            } else {
                that.setData({
                    remark: '',
                    showModalStatus2: true
                })
                var dishesSpecArry = that.data.dishesSpecArry;
                // 下单多做法显示标志
                var showModalStatus2 = that.data.showModalStatus2;
                // 菜篮子打开详情显示标志
                var showModalStatus1 = that.data.showModalStatus1;
                // 下单选规格显示标志
                // var showModalStatus = that.showModalStatus;
                if (dishes != undefined) {
                    var dishes_statu = dishes.dishes_statu;
                    var spec_type = dishes.spec_type;
                    if (dishes_statu == 2) {
                        if (spec_type == 0) {
                            that.setData({
                                showModalStatus1: !that.data.showModalStatus1,
                                dishes: dishes
                            })

                        } else if (spec_type == 1 || spec_type == 2 || spec_type == 3 || spec_type == 4 || spec_type == 6 || spec_type == 8) {
                            var cart_list = [];
                            var j = 0;
                            var okey
                            if (that.data.dishesSpecArry.length > 0 && cartList.length > 0) {
                                for (var i = 0; i < cartList.length; i++) {
                                    if (cartList != undefined) {

                                        if (cartList[i].dishes_id == dishes.dishes_id) {

                                            cart_list[j] = cartList[i];
                                            j++;

                                        }
                                    }
                                }
                            }

                            wx.request({
                                url: app.globalData.SelectEatingMethod_url,
                                data: {
                                    dishes_id: dishes.dishes_id
                                },
                                success: function (res) {

                                    if (res.data.result.result == 1) {

                                        //--------------将部位和整吃分为两个数组----------------------
                                        var em_arry = res.data.object
                                        var parts = [] //部位的数组
                                        var whole = [] //整体的数组
                                        if (res.data.object[0]) {
                                            whole = res.data.object[0]
                                        }
                                        if (res.data.object[1]) {
                                            for (var i in em_arry) {

                                                if (i > 0)
                                                    parts.push(res.data.object[i])
                                            }
                                        }
                                        //---------------------------------------------------
                                        var em_basicarry = []
                                        var en_basicarry = []
                                        // --------------获取不同部位的的数量----------------
                                        that.setData({
                                            parts: parts
                                        })
                                        // --------- console.log(em_parts);在em_parts中添加number,且同部位的number值是一样的------------------
                                        for (var i = 0; i < parts; i++) {
                                            em_basicarry.push(-1)
                                        }

                                        // --------------获取不同的的数量----------------

                                        that.setData({
                                            whole: whole
                                        })
                                        var g0 = false
                                        if (whole.length > 0) {
                                            g0 = true
                                        } else {
                                            g0 = false
                                        }

                                        that.setData({
                                            green_show0: g0
                                        })

                                        // --------------------- console.log(em_parts);在em_parts中添加number,且同部位的number值是一样的------------------
                                        for (var i = 0; i < whole; i++) {
                                            en_basicarry.push(-1)
                                        }
                                        var display = false
                                        var showSide = false
                                        if (spec_type == 3 || spec_type == 4 || spec_type == 8) {
                                            display = true
                                        }
                                        if (spec_type == 8) {
                                            showSide = true
                                        }

                                        that.setData({
                                            em_arry: res.data.object,
                                            changeweightdishes_flag: false,
                                            em_index: em_basicarry,
                                            em_basicarry: em_basicarry,
                                            en_index: en_basicarry,
                                            en_basicarry: en_basicarry,
                                            display: display,
                                            showSide: showSide

                                        })
                                        wx.hideLoading();

                                    }
                                    that.setData({
                                        em_arry: res.data.object,
                                    })
                                }
                            })
                            that.setData({
                                dishes: dishes
                            })
                        }
                    }
                } else {
                    that.setData({
                        changeweightdishes_flag: false,
                        showModalStatus1: false,
                        showModalStatus: false,
                        cookwayindex: -1,
                        cookway: "",
                        inputvalue: "",
                        inputvalue1: ""
                    })
                }
            }
        } else {
            that.setData({
                remark: '',
                showModalStatus2: true
            })
            var dishesSpecArry = that.data.dishesSpecArry;
            // 下单多做法显示标志
            var showModalStatus2 = that.data.showModalStatus2;
            // 菜篮子打开详情显示标志
            var showModalStatus1 = that.data.showModalStatus1;
            // 下单选规格显示标志
            // var showModalStatus = that.showModalStatus;
            if (dishes != undefined) {
                var dishes_statu = dishes.dishes_statu;
                var spec_type = dishes.spec_type;
                if (dishes_statu == 2) {
                    if (spec_type == 0) {
                        that.setData({
                            showModalStatus1: !that.data.showModalStatus1,
                            dishes: dishes
                        })

                    } else if (spec_type == 1 || spec_type == 2 || spec_type == 3 || spec_type == 4 || spec_type == 6 || spec_type == 8) {
                        var cart_list = [];
                        var j = 0;
                        var okey
                        if (that.data.dishesSpecArry.length > 0 && cartList.length > 0) {
                            for (var i = 0; i < cartList.length; i++) {
                                if (cartList != undefined) {

                                    if (cartList[i].dishes_id == dishes.dishes_id) {

                                        cart_list[j] = cartList[i];
                                        j++;

                                    }
                                }
                            }
                        }
                        wx.request({
                            url: app.globalData.SelectEatingMethod_url,
                            data: {
                                dishes_id: dishes.dishes_id
                            },
                            success: function (res) {

                                if (res.data.result.result == 1) {

                                    //--------------将部位和整吃分为两个数组----------------------
                                    var em_arry = res.data.object
                                    var parts = [] //部位的数组
                                    var whole = [] //整体的数组
                                    if (res.data.object[0]) {
                                        whole = res.data.object[0]
                                    }
                                    if (res.data.object[1]) {
                                        for (var i in em_arry) {

                                            if (i > 0)
                                                parts.push(res.data.object[i])
                                        }
                                    }
                                    //---------------------------------------------------
                                    var em_basicarry = []
                                    var en_basicarry = []
                                    // --------------获取不同部位的的数量----------------
                                    that.setData({
                                        parts: parts
                                    })
                                    // --------------------- console.log(em_parts);在em_parts中添加number,且同部位的number值是一样的------------------
                                    for (var i = 0; i < parts; i++) {
                                        em_basicarry.push(-1)
                                    }
                                    // --------------获取不同的的数量----------------
                                    that.setData({
                                        whole: whole
                                    })
                                    var g0 = false
                                    if (whole.length > 0) {
                                        g0 = true
                                    } else {
                                        g0 = false
                                    }

                                    that.setData({
                                        green_show0: g0,
                                    })

                                    // ------------------- console.log(em_parts);在em_parts中添加number,且同部位的number值是一样的------------------
                                    for (var i = 0; i < whole; i++) {
                                        en_basicarry.push(-1)
                                    }

                                    var display = false
                                    var showSide = false
                                    if (spec_type == 3 || spec_type == 4 || spec_type == 8) {
                                        display = true
                                    }
                                    if (spec_type == 8) {
                                        showSide = true
                                    }
                                    that.setData({
                                        em_arry: res.data.object,
                                        changeweightdishes_flag: false,
                                        em_index: em_basicarry,
                                        em_basicarry: em_basicarry,
                                        en_index: en_basicarry,
                                        en_basicarry: en_basicarry,
                                        display: display,
                                        showSide: showSide

                                    })
                                    wx.hideLoading();

                                }
                                that.setData({
                                    em_arry: res.data.object,
                                })
                            }
                        })

                        that.setData({
                            dishes: dishes
                        })
                    }
                }
                if (dishes.sideDishes != 0) { //不等于0的时候视为存在配菜，并且值为配菜二级类别
                    that.getSideDishes(dishes.sideDishes)
                }
            } else {
                that.setData({
                    changeweightdishes_flag: false,
                    showModalStatus1: false,
                    showModalStatus: false,
                    cookwayindex: -1,
                    cookway: "",
                    inputvalue: "",
                    inputvalue1: ""
                })
            }
        }
    },

    selectInfo_booking_newType10: function (e) {
        var that = this;
        var dishes = that.data.menu[e.currentTarget.dataset.index]
        // var cartList = that.data.cartList
        // var weightarry = that.data.weightarry
        // var num = Number(e.currentTarget.dataset.num) // 是否第二次添加
        var shrinkIntrIntroduction = false // 是否缩小菜品介绍框
        var dishesIndex = e.currentTarget.dataset.index
        var remark = ''
        var tastes = ''
        var tastesRemark = ''
        var eatMethodArray = []
        if (dishes.sideDishes != 0) {
            shrinkIntrIntroduction = true
            that.getSideDishes(dishes.sideDishes)
        }
        if (dishes != undefined) {
            var dishes_statu = dishes.dishes_statu;
            if (dishes_statu == 2) {
                let promise = new Promise(function (resolve, reject) {
                    that.getEatMethod(dishes.dishes_id)
                    that.selectEatmethodAndSpec(dishes.dishes_id)

                    that.setData({
                        showModalStatus5: !that.data.showModalStatus5,
                        showModalStatus1: false,
                        eatMethodArrayNumber: 0,
                        eatMethodArraySum: 0
                    })
                    resolve()
                });
                promise.then(function (res) {
                    that.showMultipleEatMethodView()
                })
                that.setData({
                    dishes: dishes,
                    remark: remark,
                    tastes: tastes,
                    eatMethodArray: eatMethodArray,
                    tastesRemark: tastesRemark,
                    dishesIndex: dishesIndex,
                    shrinkIntrIntroduction: shrinkIntrIntroduction,
                    goodsIntroduce: dishes.dishes_introduce,
                })
            }
        } else {
            that.setData({
                changeweightdishes_flag: false,
                showModalStatus1: false,
                inputvalue: "",
                inputvalue1: "",
                quickRemark: ''
            })
        }
    },

    //弹窗-多做法(菜单页面的选规格 第一次进)
    selectInfo_booking_new: function (e) {

        var that = this;
        var dishes = that.data.menu[e.currentTarget.dataset.index]
        var cartList = that.data.cartList
        var weightarry = that.data.weightarry
        var num = Number(e.currentTarget.dataset.num) // 是否第二次添加
        var shrinkIntrIntroduction = false // 是否缩小菜品介绍框
        var dishesIndex = e.currentTarget.dataset.index
        var remark = ''
        var tastes = ''
        var tastesRemark = ''
        var eatMethodArray = []
        var agreenopen = false

        if (dishes.sideDishes != 0 || (dishes.spec_type != 0 && dishes.spec_type != 4)) {
            shrinkIntrIntroduction = true
        }

        if (dishes.sideDishes == 0) {
            shrinkIntrIntroduction = false
        } else {
            that.getSideDishes(dishes.sideDishes)
        }

        if (weightarry != undefined && weightarry != '' && weightarry != null) {
            for (var a = 0; a < weightarry.length; a++) {
                if (weightarry[a].dishes_id == e.currentTarget.dataset.item.dishes_id) {
                    agreenopen = true
                }
            }
        }

        if (agreenopen == true && num == 2) { // 第一次下单，不能下的时候
            wx.showToast({
                icon: 'none',
                title: '该键此刻不能操作,如需添加请点击"+"',
                duration: 3000
            })
        } else {
            if (dishes != undefined) {
                var dishes_statu = dishes.dishes_statu;
                var spec_type = dishes.spec_type;
                if (dishes_statu == 2) {
                    if (spec_type == 2 || spec_type == 3 || spec_type == 4 || spec_type == 10) {
                        let promise = new Promise(function (resolve, reject) {
                            that.getEatMethod(dishes.dishes_id)
                            if (spec_type == 10) {
                                that.selectEatmethodAndSpec(dishes.dishes_id)
                            }
                            if (spec_type == 10) {
                                that.setData({
                                    showModalStatus5: !that.data.showModalStatus5,
                                    showModalStatus1: false,
                                    eatMethodArrayNumber: 0,
                                    eatMethodArraySum: 0
                                })
                            } else {
                                that.setData({
                                    showModalStatus2: !that.data.showModalStatus2,
                                    showModalStatus1: false,
                                })
                            }
                            resolve()
                        });

                        promise.then(function (res) {
                            that.showMultipleEatMethodView()
                        })

                    } else {}
                    that.setData({
                        dishes: dishes,
                        remark: remark,
                        tastes: tastes,
                        eatMethodArray: eatMethodArray,
                        tastesRemark: tastesRemark,
                        dishesIndex: dishesIndex,
                        shrinkIntrIntroduction: shrinkIntrIntroduction,
                        goodsIntroduce: dishes.dishes_introduce,
                    })
                }
            } else {
                that.setData({
                    changeweightdishes_flag: false,
                    showModalStatus1: false,
                    inputvalue: "",
                    inputvalue1: "",
                    quickRemark: ''
                })
            }
        }
    },

    //菜品介绍
    dishesInfo: function (e) {
        const {
            index,
            id
        } = e.currentTarget.dataset
        var that = this;
        // var dishes = this.data.menuList[this.data.c1Idx].class1s[this.data.c2Idx].class2[this.data.c3Idx].dishesInfs[index]
        var dishes = this.data.menu[index]
        var dishesIndex = e.currentTarget.dataset.index;
        var shrinkIntrIntroduction = false
        let countarry = that.data.countarry
        let readOnly = true
        let cartList = that.data.cartList
        let newList = []
        let cartListItem = [] //单规格称重菜当前菜
        let weightarry = that.data.weightarry

        //如果是已购套餐100或菜品101,或者是普通套餐210，直接跳转商品详情页面        
        if (dishes.spec_type == 100 || dishes.spec_type == 101) {  
            //跳转前传入cartList 跳转回来的时候，onShow会获取 app.globalData.cartList;
            app.globalData.cartList=cartList              
            wx.navigateTo({
                url: '/pages/module_discount/pages/Package_details/Package_details?id=0' + '&setMealID=' + dishes.ticketId + '&shop_id=' + app.globalData.shopdetail.shop_id + '&fromMenu=true&orderId=' + dishes.orderId,
            });    
            return
        }

        //普通套餐210，直接跳转商品详情页面     
        if (dishes.spec_type == 210) {
            console.log(e);
          
            var setMealID=dishes.dishes_id;
            var shop_id=dishes.shop_id;
            var dishes_index=dishesIndex;
            wx.navigateTo({
                url: '/pages/module_discount/pages/package_details_buy/package_details_buy?id=0&setMealID=' + setMealID + '&shop_id=' + shop_id + '&orderId=0&dishes_index='+dishes_index,
            });    
            return
        }

        if (dishes.tastes != undefined && dishes.tastes != null) {
            that.formatTaste(dishes.tastes)
        }
        if (dishes.remark != undefined && dishes.remark != null) {
            that.setData({
                remark: dishes.remark,
            })
        }
        if (dishes.spec_type == 5) {
            for (let b = 0; b < cartList.length; b++) {
                if (cartList[b].dishes_id == dishes.dishes_id) {
                    //默认用最后下单的那个
                    cartListItem = cartList[b]
                }
            }
        }
        if (countarry == undefined) {
            countarry = []
        }
        for (let i = 0; i < countarry.length; i++) {
            if (countarry[i].dishes_id == dishes.dishes_id) {
                // id相同，看分数
                if (countarry[i].countnum > 0) {
                    readOnly = false
                    dishes.dishesNum = countarry[i].countnum
                }
            }
        }
        if (dishes.spec_type == 5) {
            //单规格称重菜
            for (let i = 0; i < weightarry.length; i++) {
                if (weightarry[i].dishes_id == dishes.dishes_id) {
                    // id相同，看分数
                    // 把cartList的数组名字对应的菜放到一个新数组里
                    for (let n = 0; n < cartList.length; n++) {
                        if (cartList[n].dishes_id == dishes.dishes_id) {
                            newList.push(JSON.parse(JSON.stringify(cartList[n])))
                        }
                    }
                }
            }
        }

        // 显示标志
        var showModalStatus4 = that.data.showModalStatus4;
        var showModalStatus6 = that.data.showModalStatus6
        if (dishes.sideDishes != 0) { //不等于0的时候视为存在配菜，并且值为配菜二级类别
            that.getSideDishes(dishes.sideDishes)
            shrinkIntrIntroduction = true
        }
        // subclass_type_id == 50182
        if (dishes.specal_type == 6) {
            dishes
            let tempNumber = 0;
            for (let x of countarry) {
                if (x.dishes_id == dishes.dishes_id) {
                    tempNumber = x.tempNumber
                }
            }
            wx.navigateTo({
                url: '/pages/temporary/temporary?dishes=' + JSON.stringify(dishes) + '&cartList=' + JSON.stringify(this.data.cartList) + '&menuList=' + JSON.stringify(this.data.menuList) + '&tempNumber=' + tempNumber +
                    "&difference_flag=" + JSON.stringify(this.data.difference_flag) + "&locationindex=" + JSON.stringify(this.data.locationindex)
            })
        } else {
            that.setData({
                dishes: dishes,
                shrinkIntrIntroduction: shrinkIntrIntroduction,
                goodsIntroduce: dishes.dishes_introduce,
                readOnly: readOnly, //设置备注和口味打开判断（false打开）
                showCartflag: false,
                dishesIndex: dishesIndex
            })
            if (dishes.spec_type == 5) {
                if (cartListItem.SideDishList) {
                    //当这个菜有选过配菜的时候，进行配菜回显
                    that.formatSideDishList(cartListItem.SideDishList)
                }
                that.setData({
                    newList: newList,
                    showModalStatus6: !showModalStatus6
                })
            } else {
                that.setData({
                    showModalStatus4: !showModalStatus4
                })
            }
        }
    },
    goToSetMealDetail(){
        wx.showLoading({
          title: '请稍后',
        })
        let that = this 
        let dishes = that.data.dishes
        wx.navigateTo({
            url: '/pages/module_discount/pages/Package_details/Package_details?id=0' + '&setMealID=' + dishes.ticketId + '&shop_id=' + app.globalData.shopdetail.shop_id + '&fromMenu=true&orderId=' + dishes.orderId,
        },()=>{
            wx.hideLoading()
        })
    },
    //视频弹框外层
    videoInfo: function (e) {
        var that = this;
        that.setData({
            video_open: false,
            video_name: '',
            video_src: '',
        })
    },

    closePopupView: function (e) {
        this.setData({
            show: false,
            lock: false
        });
    },

    onClose() {
        this.setData({
            show: false
        });
    },

    // 多规格 选规格弹窗需要操作
    selectInfo_guige_new: function (e) {
        console.log(e)
        var that = this;
        wx.showLoading({
            title: '加载中...',
        })
        var shrinkIntrIntroduction = false; //是否缩小菜品介绍
        var cartList = this.data.cartList; //2020-11-16
        var dishesIndex = e.currentTarget.dataset.index;
        var difference_flag = that.data.difference_flag
        // var dishes = this.data.menuList[this.data.c1Idx].class1s[this.data.c2Idx].class2[this.data.c3Idx].dishesInfs[dishesIndex] // 获取菜品信息
        var dishes = e.currentTarget.dataset.item
        //多拼粥逻辑处理
        var poridgeType, poridgeName, poridgeAllPrice, poridgeNum = 1
        if (dishes.spec_type == '9' || dishes.spec_type == '91') {
            // if (dishes.jointSetValuation == '1') {
            if (dishes.spec_type == '9') {
                // 按份计算
                poridgeType = dishes.jointsetNumForOne
                poridgeAllPrice = dishes.dishes_price;
            } else {
                // 按食材计算
                poridgeType = dishes.jointsetNumForNum
                dishes.dishes_price = 0
            }
            switch (poridgeType) {
                case 2:
                    poridgeName = "双拼粥"
                    break;
                case 3:
                    poridgeName = "三拼粥"
                    break;
                case 4:
                    poridgeName = "四拼粥"
                    break;
                default:
                    poridgeName = "多拼粥"
                    break;
            };
            dishes.poridgeAllPrice = poridgeAllPrice
            dishes.poridgeNum = poridgeNum
            dishes.poridgeName = poridgeName
            dishes.selName = "请选择"
        }
        var agreenopen = true
        var spec_type = dishes.spec_type;
        if (dishes != undefined) {
            var spec_type = dishes.spec_type;
            this.setData({
                spec_type1: spec_type
            })
            if (spec_type == 1 || spec_type == 22 || spec_type == 24) {
                dishes.remark = "";
                dishes.tastes = "";
                that.setData({
                    inputSpecNum: 1
                })
            }
            if ((spec_type == 1 || spec_type == 22 || spec_type == 24) && e.currentTarget.dataset.num == 2) {
                for (var x of that.data.cartList) {
                    if (x.dishes_id == dishes.dishes_id) { // 当存在的时候
                        agreenopen = false
                    }
                }
            }
            //2020-11-13 多拼粥
            if ((spec_type == 9 || spec_type == 91) && e.currentTarget.dataset.num == 2 && dishes.sideDishes != 0) {
                for (var x of that.data.cartList) {
                    if (x.dishes_id == dishes.dishes_id) { // 当存在的时候
                        agreenopen = false
                    }
                }
            }
            if (!agreenopen) {
                wx.showToast({
                    icon: 'none',
                    title: '该键此刻不能操作,如需添加请点击"+"',
                    duration: 3000
                })
            } else {
                if (dishes.sideDishes != 0 || (spec_type != 0 && (spec_type != 9 || spec_type != 91))) { //是否缩小菜品介绍
                    shrinkIntrIntroduction = true
                }
                //if (dishes.sideDishes > 0 && dishes.sideDishes != null) { //不等于0的时候视为存在配菜，并且值为配菜二级类别
                that.getSideDishes(dishes.sideDishes)
                // }
                if (dishes.tastes) {
                    that.formatTaste(dishes.tastes)
                } else {
                    that.setData({
                        tastes: '',
                        tastesRemark: ''
                    })
                }
                let promise = new Promise(function (resolve, reject) {
                    var selectInfo_guigeflag = false;
                    if (cartList.length > 0) {
                        cartList.map(food => {
                            if (food.dishes_id == dishes.dishes_id && (food.adddishes_flag == 0 || difference_flag == false)) {
                                // 已点选规格菜品，要显示之前的多规格菜品
                                selectInfo_guigeflag = true;
                            }
                        })
                    }
                    resolve({
                        data: {
                            "that": that,
                            "selectInfo_guigeflag": selectInfo_guigeflag,
                            "dishes": dishes
                        }
                    });
                });
                promise.then(function (res) {
                    var that = res.data["that"]
                    console.log("是否已存在菜：" + res.data["selectInfo_guigeflag"])
                    if (!res.data["selectInfo_guigeflag"]) {
                        // 未点选规格菜品，直接显示空的值
                        console.log("不存在")
                        that.selectInfo_guige1(JSON.parse(JSON.stringify(res.data["dishes"])));
                    } else {
                        if ((dishes.spec_type == 1 || dishes.spec_type == 22 || dishes.spec_type == 24) && e.currentTarget.dataset.num == "1") {
                            console.log("存在?不存在的")
                            that.selectInfo_guige1(JSON.parse(JSON.stringify(res.data["dishes"])));
                        } else if ((dishes.spec_type == 9 || dishes.spec_type == 91) && e.currentTarget.dataset.num == "1") {
                            console.log("多拼粥不存在，再来一份！")
                            that.selectInfo_guige1(JSON.parse(JSON.stringify(res.data["dishes"])));
                        } else {
                            console.log("存在")
                            that.selectInfo_guige2(e);
                        }
                    }

                    that.setData({
                        goodsIntroduce: dishes.dishes_introduce,
                        dishesIndex: dishesIndex,
                        dishes: dishes,
                        shrinkIntrIntroduction: shrinkIntrIntroduction,
                        remark: dishes.remark,
                        quickRemark: ''
                    })
                });
                wx.hideLoading()
            }

        } else {
            that.setData({
                changeweightdishes_flag: false,
                showModalStatus1: false,
                showModalStatus2: false,
                showModalStatus5: false,
                showModalStatus: false,
                showModalStatus3: false,
                show: false,
                cookwayindex: -1,
                cookway: "",
                inputvalue: "",
                inputvalue1: ""
            })
            wx.hideLoading()
        }
    },

    // 多规格 选规格弹窗需要操作
    selectInfo_guige: function (e) {
        var that = this;
        var selectInfo_guigeflag = false;
        var shrinkIntrIntroduction = false;
        var cartList = that.data.cartList;
        var dishesIndex = e.currentTarget.dataset.index;
        var difference_flag = that.data.difference_flag
        var dishes = that.data.menu[e.currentTarget.dataset.index]; // 获取菜品信息
        if (dishes.sideDishes != 0 || dishes.spec_type != 0) {
            shrinkIntrIntroduction = true
        }

        wx.showLoading({
            title: '加载中...',
        })

        that.selectInfo_guige1(e);

        that.setData({
            goodsIntroduce: dishes.dishes_introduce,
            dishesIndex: dishesIndex,
            shrinkIntrIntroduction: shrinkIntrIntroduction,
            remark: dishes.remark
        })

        setTimeout(function () {
            if (cartList != undefined && cartList.length > 0) {
                for (var i = 0; i < cartList.length; i++) {
                    if (cartList[i].dishes_id == dishes.dishes_id && (cartList[i].adddishes_flag == 0 || difference_flag == false)) {
                        // 已点选规格菜品，要显示之前的多规格菜品
                        that.selectInfo_guige2(e);
                        selectInfo_guigeflag = true;
                    }
                }
            }
            if (!selectInfo_guigeflag) {
                // 未点选规格菜品，直接显示空的值
                that.selectInfo_guige1(e);
            }
        }, 500)
    },



    // 拼粥 处理选择食材之后的逻辑
    selPorridgeBackObject: function (event) {
        this.data.porridgeBackObject = event.detail.porridgeBackObject;
        var result = event.detail.result;
        if (result == -1) {} else if (result == 1) {
            // if (this.data.currentDishesModel.jointSetValuation == '1') {
            if (this.data.currentDishesModel.spec_type == 9) {
                // 按份计算   
                this.data.currentDishesModel.selName = this.data.porridgeBackObject.selName ? this.data.porridgeBackObject.selName : "请选择"
                this.data.currentDishesModel.poridgeAllPrice = (this.data.currentDishesModel.dishes_price * this.data.currentDishesModel.poridgeNum).toFixed(2)
                this.setData({
                    goodModel: this.data.currentDishesModel,
                })
            } else {
                // 按食材计算
                this.data.currentDishesModel.selName = this.data.porridgeBackObject.selName ? this.data.porridgeBackObject.selName : "请选择"
                this.data.currentDishesModel.dishes_price = this.data.porridgeBackObject.selAllPrice
                this.data.currentDishesModel.poridgeAllPrice = (this.data.porridgeBackObject.selAllPrice * this.data.currentDishesModel.poridgeNum).toFixed(2)
                this.setData({
                    goodModel: this.data.currentDishesModel,
                })
            }
        }

    },

    //格式化多拼粥食材，并回显
    formatMaterial: function (list) {
        if (list.length == 0 || list == undefined) {
            return
        }
        var porridgeObjectList = []
        for (var x of list) {
            if (x.selectStatus) {
                porridgeObjectList.push(x)
            }
        }
        this.setData({
            porridgeObjectList: porridgeObjectList
        })
    },

    //格式化口味，并回显
    formatSideDishList: function (SideDishList, sideDishes) {
        var that = this
        if (sideDishes != 0) {
            var SideDishList_choose = []
            for (var x of SideDishList) {
                if (x.checked) {
                    SideDishList_choose.push(x)
                }
            }
            that.setData({
                SideDishList_choose: SideDishList_choose,
                SideDishList: SideDishList,
            })
        } else {
            that.setData({
                SideDishList_choose: [],
                SideDishList: [],
            })
        }
    },

    //弹窗-选规格(显示选规格详情---出单前)
    selectInfo_guige2: function (e) {
        var that = this;
        const dishes = this.data.menuList[this.data.c1Idx].class1s[this.data.c2Idx].class2[this.data.c3Idx].dishesInfs[index]
        // if (dishes.spec_type == 9) {
        if (dishes.spec_type == 9 || dishes.spec_type == 91) {
            var sum = 0
            var cartList = that.data.cartList
            var cartListItem = ""
            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i].dishes_id == dishes.dishes_id) {
                    cartListItem = cartList[i]
                }
            }
            var jointSet = cartListItem.jointSet
            var jointSets = jointSet.split(',')

            for (var i = 0; i < jointSets.length; i++) {
                jointSets[i] = parseInt(jointSets[i].split('-')[0])
            }
            morePorridgeModel.getPorridgMaterial({
                shop_id: app.globalData.shopdetail.shop_id,
                // jointSetValuation: dishes.jointSetValuation
            }).then(res => {
                if (res.data.result.result == 1) {
                    var selName = []
                    res.data.object.currentNum = dishes.jointSetNum
                    res.data.object.list = res.data.object.list.map(item => ({
                        ...item,
                        checked: false,
                        selectStatus: jointSets.indexOf(item.ID) != -1,
                        jointSetDealPrice: ((item.jointSetPrice) / 100).toFixed(2)
                    }))

                    for (var x of res.data.object.list) {
                        if (x.selectStatus) {
                            selName.push(x.jointSetName)
                        }
                    }
                    selName = selName.join('+');

                    // 初始化dishes的数值（选中、单价份数、数量、总金额）
                    sum = Number(cartListItem.sum)
                    res.data.object.selName = selName
                    res.data.object.selAllPrice = sum
                    var goodModel = {
                        dishes_img: dishes.dishes_img,
                        dishes_price: dishes.dishes_price,
                        poridgeName: dishes.dishes_name,
                        selName: selName,
                        poridgeNum: cartListItem.number || 1,
                        poridgeAllPrice: sum
                    }
                    that.formatMaterial(res.data.object.list)
                    that.formatSideDishList(cartListItem.SideDishList, dishes.sideDishes)

                    this.setData({
                        porridgeObject: res.data.object,
                        porridgeBackObject: cartListItem.porridgeObject,
                        show: true,
                        remark: cartListItem.remark,
                        tastes: cartListItem.tastes,
                        tastesRemark: cartListItem.tastesRemark,
                        currentDishesModel: dishes,
                        goodModel: goodModel,
                        foodIntroduce: dishes.dishes_introduce ? dishes.dishes_introduce : "",
                    })
                } else {
                    wx.showToast({
                        title: '获取详情失败',
                        icon: 'none', //如果要纯文本，不要icon，将值设为'none'
                        duration: 2000
                    })
                }
            }).catch(res => {});
        } else {
            that.getDishesSpec(dishes.dishes_id).then(function (res) {
                var that = res.that
                var dishesSpecArry = res.dishesSpecArry
                var cartList = that.data.cartList
                var difference_flag = that.data.difference_flag
                // var okey
                var czgg = [];
                var cart_list = [];
                var j = 0;
                if (dishesSpecArry.length > 0 && cartList.length > 0) {
                    for (var i = 0; i < cartList.length; i++) {
                        if (cartList != undefined) {
                            if (cartList[i].dishes_id == dishes.dishes_id && difference_flag == true && cartList[i].adddishes_flag == 0) {
                                cart_list.push(cartList[i]);
                                j++;
                            } else if (cartList[i].dishes_id == dishes.dishes_id && difference_flag == false) {
                                cart_list.push(cartList[i]);
                                j++;
                            }
                        }
                    }

                    for (var i = 0; i < cart_list.length; i++) {
                        for (var j = 0; j < dishesSpecArry.length; j++) {
                            if (cart_list[i].dishes_id == dishes.dishes_id && dishesSpecArry[j].spec_name == cart_list[i].spec_name) {
                                dishesSpecArry[j].number = cart_list[i].number;
                                if (dishesSpecArry[j].number > 0) {
                                    that.formatTaste(cart_list[i].tastes)
                                    that.formatSideDishList(cart_list[i].SideDishList)
                                    that.setData({
                                        chooseGuigeIndex: j
                                    })
                                }
                                czgg = dishesSpecArry[j];
                            }
                        }
                    }
                }

                that.setData({
                    dishesSpecArry: dishesSpecArry,
                    czgg: czgg
                })
                if (dishes.spec_type != 6) {
                    that.setData({
                        showModalStatus: true
                    })
                } else {
                    that.setData({
                        showModalStatus3: true
                    })
                }
                that.showGuigeMoneyAndNumber(0)
            }).catch(res => {})
        }

        wx.hideLoading()
    },

    //弹窗-选规格(显示选规格详情---出单前)
    selectInfo_guige2_1: function (dishes) {
        var that = this;
        var difference_flag = that.data.difference_flag
        var cart_list = [];
        var j = 0;
        var okey
        var cartList = that.data.cartList;
        var dishesSpecArry = that.data.dishesSpecArry;
        var czgg = [];
        if (that.data.dishesSpecArry.length > 0 && cartList.length > 0) {
            for (var i = 0; i < cartList.length; i++) {
                if (cartList != undefined) {

                    if (cartList[i].dishes_id == dishes.dishes_id && difference_flag == true && cartList[i].adddishes_flag == 0) {
                        cart_list[j] = cartList[i];
                        j++;
                    } else if (cartList[i].dishes_id == dishes.dishes_id && difference_flag == false) {
                        cart_list[j] = cartList[i];
                        j++;
                    }
                }
            }
            for (var i = 0; i < cart_list.length; i++) {
                if (that.data.dishesSpecArry.length == cart_list.length) {
                    if (cart_list[i].dishes_id == dishes.dishes_id && that.data.dishesSpecArry[i].spec_name == cart_list[i].spec_name) {
                        // okey 是否对dishesSpecArry更新标志
                        var okey = true;
                        that.data.dishesSpecArry[i].number = cart_list[i].number;
                        czgg = that.data.dishesSpecArry[i];
                    } else if (cart_list[i].dishes_id == dishes.dishes_id && (cart_list[i].spec_name == that.data.dishesSpecArry[1].spec_name || cart_list[i].spec_name == that.data.dishesSpecArry[0].spec_name)) {
                        var okey = true;
                        if (i == 0) {
                            that.data.dishesSpecArry[i].number = cart_list[1].number;
                        } else {
                            that.data.dishesSpecArry[i].number = cart_list[0].number;
                        }
                    } else {
                        that.data.dishesSpecArry[i].number = 0;
                    }
                } else {
                    for (var j = 0; j < that.data.dishesSpecArry.length; j++) {
                        if (cart_list[i].dishes_id == dishes.dishes_id && that.data.dishesSpecArry[j].spec_name == cart_list[i].spec_name) {
                            // okey 是否对dishesSpecArry更新标志
                            var okey = true;
                            that.data.dishesSpecArry[j].number = cart_list[i].number;
                            czgg = that.data.dishesSpecArry[j];
                            console.log(that.data.dishesSpecArry);
                        } else {
                            that.data.dishesSpecArry[j].number = 0;
                        }
                    }
                }

            }
        }
        that.setData({
            dishesSpecArry: that.data.dishesSpecArry,
            czgg: czgg
        })
        if (dishes.spec_type != 6) {
            that.setData({
                showModalStatus: true
            })
        } else {
            that.setData({
                showModalStatus3: true
            })
        }
        wx.hideLoading()
    },

    //弹窗-选规格(菜单页面的选规格--空)
    selectInfo_guige1: function (dishes) { // 直接点
        // 下单多做法显示标志
        var that = this
        var difference_flag = that.data.difference_flag
        var dishes_statu = dishes.dishes_statu;
        var spec_type = dishes.spec_type;
        // 菜篮子打开详情显示标志
        // 下单选规格显示标志
        // 规格类型：单规格-0，多规格-1，称重多做法-2，计件多做法-3,称重单规格-5，单规格多做法-4，称重多规格-6，单规格+配菜-7，来料加工-8，多拼粥品-9
        // 多规格： 1、多规格，6、称重多规格 才查询多规格
        // 多做法： 2、称重多做法, 3、计件多做法，4、单规格多做法
        if (dishes_statu == 2) {
            if (spec_type == 0) { //单规格
                that.setData({
                    showModalStatus1: !that.data.showModalStatus1
                })
            } else if (spec_type == 1 || spec_type == 6 || spec_type == 22 || spec_type == 24) { // 多规格
                this.getDishesSpec(dishes.dishes_id).then(function (res) {
                    var that = res.that
                    var dishesSpecArry = res.dishesSpecArry
                    var cartList = that.data.cartList
                    if (dishesSpecArry.length > 0) {
                        if (cartList.length > 0) {
                            var cart_list = [];
                            var j = 0
                            for (var i = 0; i < cartList.length; i++) {
                                if (cartList != undefined) {
                                    if (cartList[i].dishes_id == dishes.dishes_id && difference_flag == true && cartList[i].adddishes_flag == 0) {
                                        cart_list[j] = cartList[i];
                                        j++;
                                    } else if (cartList[i].dishes_id == dishes.dishes_id && difference_flag == false) {
                                        cart_list[j] = cartList[i];
                                        j++;
                                    }
                                }
                            }

                            for (var i = 0; i < cart_list.length; i++) {
                                if (dishesSpecArry.length == cart_list.length) {
                                    if (cart_list[i].dishes_id == dishes.dishes_id && dishesSpecArry[i].spec_name == cart_list[i].spec_name) {
                                        dishesSpecArry[i].number = cart_list[i].number;
                                    } else {
                                        dishesSpecArry[i].number = 0;
                                    }
                                } else {
                                    for (var j = 0; j < dishesSpecArry.length; j++) {
                                        if (cart_list[i].dishes_id == dishes.dishes_id && dishesSpecArry[j].spec_name == cart_list[i].spec_name) {
                                            dishesSpecArry[j].number = cart_list[i].number;
                                        } else {
                                            dishesSpecArry[j].number = 0;
                                        }
                                    }
                                }
                            }
                        }
                        if (dishes.spec_type != 6) {
                            that.setData({
                                showModalStatus: !that.data.showModalStatus
                            })
                        } else {
                            that.setData({
                                showModalStatus3: !that.data.showModalStatus3
                            })
                        }
                    } else {
                        wx.showToast({
                            icon: 'none',
                            duration: 3000,
                            title: '查询不到规格',
                        })
                    }
                    that.setData({
                        dishesSpecArry: dishesSpecArry
                    })
                })
            } else if (spec_type == 2 || spec_type == 3 || spec_type == 4) { //多做法
                that.getEatMethod(dishes.dishes_id)
                that.selectInfo_booking(e);
            } else if (spec_type == 5) {
                that.setData({
                    showModalStatus1: !that.data.showModalStatus1,
                    dishes: dishes
                })
            } else if (spec_type == 8) {
                that.toOrderProcessing_1(dishes)
                that.setData({
                    showModalStatus3: true
                })
            } else if (spec_type == 9 || spec_type == 91) {
                // 多拼粥
                var shopData = {
                    shop_id: dishes.shop_id,
                    // jointSetValuation: dishes.jointSetValuation
                    dishes_id: dishes.dishes_id
                }

                wx.request({
                    url: app.globalData.SelectJointSet_url,
                    // url: "http://192.168.8.2:8080/WX Restaurant/SelectJointSet",
                    method: 'GET',
                    data: shopData,
                    success: res => {

                        if (res.data.object == null) {
                            wx.showToast({
                                icon: 'none',
                                duration: 3000,
                                title: '查询不到多拼粥食材',
                            })
                            return;
                        }
                        // 初始化dishes的数值（选中、单价份数、数量、总金额）
                        dishes.selName = "请选择"
                        res.data.object.selName = "请选择"
                        res.data.object.selAllPrice = 0
                        dishes.poridgeAllPrice = dishes.spec_type == 9 ? dishes.dishes_price : 0
                        dishes.dishes_price = dishes.spec_type == 9 ? dishes.dishes_price : 0
                        // res.data.object.currentNum = dishes.jointSetValuation == 1 ? res.data.object.jointSetNum[0].jointsetNumForOne : res.data.object.jointSetNum[0].jointsetNumForNum
                        res.data.object.currentNum = dishes.jointSetNum
                        res.data.object.list = res.data.object.list.map(item => ({
                            ...item,
                            selectStatus: false,
                            // jointSetDealPrice: ((item.jointSetPrice) / 100).toFixed(2)
                            jointSetDealPrice: ((item.jointSetPrice) / 100)
                        }))

                        console.log("打个断点")
                        this.setData({
                            porridgeObject: res.data.object,
                            porridgeObjectList: [],
                            show: true,
                            currentDishesModel: dishes,
                            goodModel: dishes,
                            foodIntroduce: dishes.dishes_introduce ? dishes.dishes_introduce : "",
                            remark: "",
                            tastes: "",
                            tastesRemark: "",
                        })
                        wx.hideLoading()
                    }
                })
                return;
            }
        }
    },

    //弹窗-选规格(菜单页面的选规格--空)
    selectInfo_guige1_1: function (dishes) {
        var that = this;
        var difference_flag = that.data.difference_flag
        var cartList = that.data.cartList;
        var dishesSpecArry = that.data.dishesSpecArry;
        // 下单多做法显示标志
        // 菜篮子打开详情显示标志
        var showModalStatus1 = that.data.showModalStatus1;
        // 下单选规格显示标志
        var showModalStatus = that.showModalStatus;
        if (dishes != undefined) {
            var dishes_statu = dishes.dishes_statu;
            var spec_type = dishes.spec_type;
            if (dishes_statu == 2) {
                if (spec_type == 0) {
                    that.setData({
                        showModalStatus1: !that.data.showModalStatus1,
                        dishes: dishes
                    })
                } else if (spec_type == 1 || spec_type == 2 || spec_type == 4 || spec_type == 6 || spec_type == 8) {
                    var cart_list = [];
                    var j = 0
                    var okey
                    if (dishesSpecArry.length > 0 && cartList.length > 0) {
                        for (var i = 0; i < cartList.length; i++) {
                            if (cartList != undefined) {
                                if (cartList[i].dishes_id == dishes.dishes_id && difference_flag == true && cartList[i].adddishes_flag == 0) {
                                    cart_list[j] = cartList[i];
                                    j++;
                                } else if (cartList[i].dishes_id == dishes.dishes_id && difference_flag == false) {
                                    cart_list[j] = cartList[i];
                                    j++;
                                }
                            }
                        }
                        for (var i = 0; i < cart_list.length; i++) {
                            if (dishesSpecArry.length == cart_list.length) {
                                if (cart_list[i].dishes_id == dishes.dishes_id && dishesSpecArry[i].spec_name == cart_list[i].spec_name) {
                                    // okey 是否对dishesSpecArry更新标志
                                    dishesSpecArry[i].number = cart_list[i].number;
                                    console.log(dishesSpecArry);
                                } else {
                                    dishesSpecArry[i].number = 0;
                                }
                            } else {
                                for (var j = 0; j < dishesSpecArry.length; j++) {
                                    if (cart_list[i].dishes_id == dishes.dishes_id && dishesSpecArry[j].spec_name == cart_list[i].spec_name) {
                                        // okey 是否对dishesSpecArry更新标志
                                        dishesSpecArry[j].number = cart_list[i].number;
                                    } else {
                                        dishesSpecArry[j].number = 0;
                                    }
                                }
                            }
                        }
                        that.setData({
                            dishesSpecArry: dishesSpecArry
                        })
                    }

                    wx.request({
                        url: app.globalData.GetDishesSpec_url,
                        data: {
                            Dishes_id: dishes.dishes_id
                        },
                        success: function (res) {
                            var arry = res.data.object
                            if (res.data.result.result == 1) {
                                if (arry.length != 0) {
                                    for (var i = 0; i < arry.length; i++) {
                                        if (that.data.cartList.length > 0) {
                                            for (var j = 0; j < that.data.cartList.length; j++) {
                                                if (arry[i].dishes_id == that.data.cartList[j].dishes_id && arry[i].spec_price == that.data.cartList[j].price) {
                                                    var difference_flag = that.data.difference_flag
                                                    difference_flag ? arry[i].number = 0 : arry[i].number = that.data.cartList[j].number
                                                } else {
                                                    arry[i].number = 0
                                                }
                                            }
                                        } else {
                                            arry[i].number = 0
                                        }
                                    }
                                } else {
                                    console.log("不存在多规格")
                                }

                                setTimeout(function () {
                                    that.setData({
                                        dishesSpecArry: arry,
                                        dishes: dishes
                                    })
                                    if (dishes.spec_type != 6) {
                                        that.setData({
                                            showModalStatus: true
                                        })
                                    } else {
                                        that.setData({
                                            showModalStatus3: true
                                        })
                                    }
                                }, 100) //延迟时间

                            } else {
                                wx.showToast({
                                    icon: 'none',
                                    title: '查询不到规格',
                                })
                            }
                        }
                    })

                }
            }
        } else {
            that.setData({
                changeweightdishes_flag: false,
                showModalStatus1: false,
                showModalStatus: false,
                showModalStatus3: false,
                cookwayindex: -1,
                cookway: "",
                inputvalue: "",
                inputvalue1: ""
            })
        }

        wx.hideLoading()
    },

    getDishesSpec(dishes_id) {
        var that = this
        return new Promise(function (resolve, reject) {
            var dishesSpecArry = []
            WXAPI.getDishesSpec({
                Dishes_id: dishes_id
            }).then(function (data) {
                if (data.result.result == 1) {
                    console.log("获取多规格成功")
                    dishesSpecArry = data.object
                    if (dishesSpecArry.length != 0) {
                        for (var i = 0; i < dishesSpecArry.length; i++) {
                            if (that.data.cartList.length > 0) {
                                for (var j = 0; j < that.data.cartList.length; j++) {
                                    if (dishesSpecArry[i].dishes_id == that.data.cartList[j].dishes_id && dishesSpecArry[i].spec_price == that.data.cartList[j].price) {
                                        var difference_flag = that.data.difference_flag
                                        difference_flag ? dishesSpecArry[i].number = 0 : dishesSpecArry[i].number = that.data.cartList[j].number
                                    } else {
                                        dishesSpecArry[i].number = 0
                                    }
                                }
                            } else {
                                dishesSpecArry[i].number = 0
                            }
                        }
                    } else {
                        console.log("不存在多规格")
                    }

                    resolve({
                        "that": that,
                        "dishesSpecArry": dishesSpecArry
                    })
                } else {
                    console.log("获取多规格失败")
                    resolve({
                        "that": that,
                        "dishesSpecArry": dishesSpecArry
                    })
                }

            }).catch(res => {
                console.log("获取多规格失败")
                resolve({
                    "that": that,
                    "dishesSpecArry": dishesSpecArry
                })

            })
        })
    },

    //弹窗-称重
    selectInfo1: function (e) {
        var that = this;
        var dishes = that.data.menu[e.currentTarget.dataset.index]
        if (s4 != undefined) {
            if (dishes.dishes_statu == 3 || dishes.dishes_statu == 0) {} else {
                that.setData({
                    showModalStatus1: !that.data.showModalStatus1,
                    sum: '',
                    dishes: dishes,
                })
            }
        } else {
            that.setData({
                showModalStatus1: !that.data.showModalStatus1,
                sum: ''
            })
        }
    },

    closeWindow: function () {
        var that = this;
        var showCartflag = that.data.showCartflag;
        if (!showCartflag) {
            var showCart = false;
        } else {
            var showCart = true;
        }

        that.setData({
            showModalStatus: false,
            showModalStatus1: false,
            showModalStatus2: false,
            showModalStatus5: false,
            showModalStatus3: false,
            showModalStatus4: false,
            showModalStatus6: false,
            showAdv: false,
            dishesMoney: 0,
            dishesNumber: 0,
            parttoeat: -1,
            remark: '', //点击取消的时候，把客人备注清除
            tastes: '', //点击取消的时候，把口味清除
            tastesRemark: '', //点击取消的时候，把口味清除
            quickRemark: '',
            czgg: [],
            newList: [],
            chooseDishesIndex: -1,
            result_em: true,
            result_en: true,
            pop_window: 0,
            showCart: showCart,
            inputvalue: '',
            inputvalue1: '',
            parts: [],
            whole: [],
            em_arry: [],
            em_index: [],
            en_index: [],
            selectInfovv_flag: false,
            sum_position: 0,
            chooseGuigeIndex: -1,
            readOnly: false, //默认可以打开备注和选口味
            choosedishesSpecArry: [],
            sideDishList_choose: '',
            eatMethodChooseIndex: -1,
            specBtnChooseIndex: 0,
            chooseSpecItem: '',
            inputSpecNum: '',
            eatMethodArray: [],
            sideDishList_choose: [],
            SideDishList: [],
            eamChoose: -1,
            choosedishesSpecIndex: -1,
        })
    },

    closeWindow_guige: function () {
        var that = this;
        that.setData({
            showModalStatus: false,
            showModalStatus1: false,
            showModalStatus2: false,
            showModalStatus5: false,
            showModalStatus4: false,
            showModalStatus6: false,
            parttoeat: -1,
            result_em: true,
            result_en: true,
            pop_window: 0,
            showCart: false,
            inputvalue: '',
            inputvalue1: ''
        })
    },

    closeWindow_video: function () {
        var that = this;
        that.setData({
            video_open: false,
        })
    },



    //输入菜品重量
    keyinput: function (e) {
        var dishes = this.data.dishes
        var sum = e.detail.value * dishes.dishes_price
        var spec_type = dishes.spec_type
        var inputvalue1
        spec_type == 3 || spec_type == 4 || spec_type == 8 ? inputvalue1 = e.detail.value : inputvalue1 = this.data.inputvalue1
        this.setData({
            sum: sum,
            inputvalue: e.detail.value,
            inputvalue1: inputvalue1
        })
    },

    keyinput1: function (e) {
        this.setData({
            inputvalue1: e.detail.value
        })
    },

    // 称重菜品输入重量
    measurementValueInput: function (e) {
        this.setData({
            measurementValueInput: e.detail.value
        })
        this.showGuigeMoneyAndNumber(1)
    },

    //弹窗里面的菜品数量增加
    addCountDishes: function (e) {
        var that = this
        var orderDetail = that.data.orderDetail
        var difference_flag = that.data.difference_flag;
        var i = e.currentTarget.dataset.index
        var dishesSpecArry = that.data.dishesSpecArry
        if (orderDetail == undefined) {
            dishesSpecArry[i].number++;
            that.setData({
                dishesSpecArry: dishesSpecArry
            })
        } else {
            for (var j = 0; j < orderDetail.length; j++) {
                if (orderDetail[j].dishes_id == dishesSpecArry[i].dishes_id && difference_flag) {
                    var notadd = true
                }
            }
            if (dishesSpecArry[i].number < 99 && difference_flag && notadd) {
                if (dishesSpecArry[i].number != '') { //有时候茶位会是空
                    dishesSpecArry[i].number++;
                } else {
                    dishesSpecArry[i].number = 1;
                }
                that.setData({
                    dishesSpecArry: dishesSpecArry
                })
            } else {
                if (dishesSpecArry[i].number != '') {
                    dishesSpecArry[i].number++;
                } else {
                    dishesSpecArry[i].number = 1;
                }
                that.setData({
                    dishesSpecArry: dishesSpecArry
                })
            }
        }
        that.showGuigeMoneyAndNumber(0)
    },

    //弹窗里面的菜品数量减少
    reduceCountDishes: function (e) {
        var that = this
        var i = e.currentTarget.dataset.index
        var dishesSpecArry = that.data.dishesSpecArry
        if (that.data.locationindex == 3) {
            if (dishesSpecArry[i].number >= 1) {
                dishesSpecArry[i].number--;
                that.setData({
                    dishesSpecArry: dishesSpecArry
                })
            }
        } else {
            if (dishesSpecArry[i].number > 0) {
                dishesSpecArry[i].number--;
                that.setData({
                    dishesSpecArry: dishesSpecArry
                })
            }
        }
        that.showGuigeMoneyAndNumber(0)
    },

    reduceDish(e) { // 单规格
        const {
            index,
            id
        } = e.currentTarget.dataset
        console.log(index, id);
        let cartItemIdx
        const cartItem = this.data.cartList.find((d, idx) => {
            if (d.dishes_id === id && !d.id) {
                cartItemIdx = idx
                return true
            } else {
                return false
            }
        })
        if (cartItemIdx != undefined && cartItem) {
            if (cartItem.number - 1 > 0) {
                this.setData({
                    [`cartList[${cartItemIdx}].number`]: cartItem.number - 1,
                    [`cartList[${cartItemIdx}].sum`]: cartItem.sum - cartItem.dishes_price
                })
            } else {
                let cartList = this.data.cartList
                cartList.splice(cartItemIdx, 1)
                this.setData({
                    cartList
                })
            }
        } else {
            return false
        }

    },

    reduceDish2(e) { // 单规格
        const {
            index,
            id
        } = e.currentTarget.dataset
        console.log(index, id);
        let cartItemIdx
        const cartItem = this.data.cartList.find((d, idx) => {
            if (d.uuid === id) {
                cartItemIdx = idx
                return true
            } else {
                return false
            }
        })
        if (cartItemIdx != undefined && cartItem) {
            if (cartItem.number - 1 > 0) {
                this.setData({
                    [`cartList[${cartItemIdx}].number`]: cartItem.number - 1,
                    [`cartList[${cartItemIdx}].sum`]: cartItem.sum - cartItem.dishes_price
                })
            } else {
                let cartList = this.data.cartList
                cartList.splice(cartItemIdx, 1)
                this.setData({
                    cartList
                })
            }
        } else {
            return false
        }

    },

    //在菜单中删除购物车的商品
    delectCartNum: function (e) {
        var that = this
        that.modifyDishes(e.currentTarget.dataset.index, 1);
        var dishes = that.data.menu[e.currentTarget.dataset.index]
        var cartList = that.data.cartList
        var addtobuyarry = that.data.addtobuyarry
        var countarry = that.data.countarry
        var model = dishes.dishes_name;
        var count_number = 0
        var cando = 1 // 你就说能不能做
        //这个for循环是为了判断如果已经下单的菜品 在menu菜单不能减为0只能删除
        var i = -1
        let copyOrder = 1;
        if (cartList.length != 0) {
            for (var j = 0; j < cartList.length; j++) {
                if (cartList[j].dishes_id == dishes.dishes_id) {
                    if (cartList[j].number == 1 && cartList[j].decdishes_flag == 1 && cartList[j].adddishes_flag == 1) {
                        var reduction = false
                    } else {
                        var reduction = true
                    }
                    i = j
                    break;
                }
            }

            if (i != -1) {
                copyOrder = Number(cartList[i].copyOrder)
                if (reduction == true) { //已经下单的菜
                    if (cartList[i].number > 0) {
                        cando = 2
                    }
                    var model2 = that.data.cartList[i].name
                    if (that.data.difference_flag) {
                        if (model == model2 && cartList[i].adddishes_flag == 0) {
                            var sum = that.data.sumMonney - Number((Number(cartList[i].price) * Number(copyOrder)).toFixed(2));
                            sum = parseFloat(sum.toFixed(2))
                            if (cartList[i].sum >= 0 && cartList[i].number >= 0 && that.data.cupNumber >= 0) {
                                if (Number(cartList[i].sum) < Number(cartList[i].price)) {
                                    cartList[i].sum = 0
                                } else {
                                    cartList[i].sum = parseFloat((Number(cartList[i].sum) - Number(cartList[i].price)).toFixed(2));
                                }
                                if (cartList[i].number <= 1) {
                                    cartList.splice(i, 1)
                                } else {
                                    cartList[i].number--
                                }
                                for (var k = 0; k < countarry.length; k++) {
                                    if (countarry[k].countname == dishes.dishes_name && countarry[k].dishes_id == dishes.dishes_id) {
                                        if (countarry[k].countnum >= 1) {
                                            countarry[k].countnum--
                                        } else {
                                            countarry[k].countnum = 0
                                        }
                                        if (Number(countarry[k].countprice) < Number(dishes.dishes_price)) {
                                            countarry[k].countprice = 0
                                        } else {
                                            countarry[k].countprice = parseFloat((Number(countarry[k].countprice) - Number(dishes.dishes_price)).toFixed(2));
                                        }
                                    }
                                }
                                if (that.data.isQuery) {
                                    that.setData({
                                        queryData: ''
                                    })
                                }
                                that.setData({
                                    cartList: cartList,
                                    sumMonney: sum,
                                    cupNumber: that.data.cupNumber - Number(copyOrder),
                                    countarry: countarry
                                })
                            } else {
                                console("减份数出错")
                                wx.showToast({
                                    title: '减份数出现错误',
                                    icon: 'none',
                                    duration: 2000,
                                })
                            }

                        }
                    } else {
                        if (model == model2) {
                            if (cartList[i].sum >= 0 && cartList[i].number >= 0 && that.data.cupNumber >= 0) {
                                var sum = 0
                                if (that.data.sumMonney >= Number(cartList[i].price)) {

                                    sum = parseFloat((Number(that.data.sumMonney) - Number((Number(cartList[i].price) * Number(cartList[i].copyOrder)).toFixed(2))).toFixed(2))
                                } else {
                                    sum = 0
                                }
                                if (Number(cartList[i].sum) < Number(cartList[i].price)) {
                                    cartList[i].sum = 0
                                } else {
                                    cartList[i].sum = parseFloat((Number(cartList[i].sum) - Number(cartList[i].price)).toFixed(2));
                                }
                                if (cartList[i].number <= 1) {
                                    cartList.splice(i, 1)
                                } else {
                                    cartList[i].number--
                                }
                                for (var k = 0; k < countarry.length; k++) {
                                    if (countarry[k].countname == dishes.dishes_name && countarry[k].dishes_id == dishes.dishes_id) {
                                        if (countarry[k].countnum >= 1) {
                                            countarry[k].countnum--
                                        } else {
                                            countarry[k].countnum = 0
                                        }

                                        if (Number(countarry[k].countprice) < Number(dishes.dishes_price)) {
                                            countarry[k].countprice = 0
                                        } else {
                                            countarry[k].countprice = parseFloat((Number(countarry[k].countprice) - Number(dishes.dishes_price)).toFixed(2));
                                        }
                                    }
                                }
                                that.setData({
                                    cartList: cartList,
                                    sumMonney: sum,
                                    cupNumber: (that.data.cupNumber - Number(copyOrder)) >= 0 ? Number(((that.data.cupNumber - Number(copyOrder)).toFixed(2))) : 0,
                                    countarry: countarry
                                })

                            } else {
                                console("减份数出错")
                                wx.showToast({
                                    title: '减份数出现错误',
                                    icon: 'none',
                                    duration: 2000,
                                })
                            }
                        }
                    }
                    if (cando == 2) {
                        for (var n = 0; n < addtobuyarry.length; n++) {
                            if (addtobuyarry[n].dishes_id == dishes.dishes_id) {
                                if (addtobuyarry[n].sum >= addtobuyarry[n].price) {
                                    addtobuyarry[n].sum -= addtobuyarry[n].price
                                }
                                if (addtobuyarry[n].number >= 1) {
                                    addtobuyarry[n].number--;
                                }
                                that.setData({
                                    addtobuyarry: addtobuyarry
                                })
                            }
                        }
                    }
                } else {
                    if (cartList[i].adddishes_flag && cartList[i].adddishes_flag) {
                        if (cartList[i].adddishes_flag == 0 || cartList[i].adddishes_flag == 0) {
                            if (cartList[i].sum >= 0 && cartList[i].number >= 0 && that.data.cupNumber >= 0) {
                                var sum = 0
                                if (that.data.sumMonney >= Number(cartList[i].price)) {
                                    sum = parseFloat((Number(that.data.sumMonney) - Number(cartList[i].price)).toFixed(2))
                                } else {
                                    sum = 0
                                }
                                if (Number(cartList[i].sum) < Number(cartList[i].price)) {
                                    cartList[i].sum = 0
                                } else {
                                    cartList[i].sum = parseFloat((Number(cartList[i].sum) - Number(cartList[i].price)).toFixed(2));
                                }
                                if (cartList[i].number <= 1) {
                                    cartList.splice(i, 1)
                                } else {
                                    cartList[i].number--
                                }

                                for (var k = 0; k < countarry.length; k++) {
                                    if (countarry[k].countname == dishes.dishes_name && countarry[k].dishes_id == dishes.dishes_id) {
                                        if (countarry[k].countnum >= 1) {
                                            countarry[k].countnum--
                                        } else {
                                            countarry[k].countnum = 0
                                        }
                                        if (Number(countarry[k].countprice) < Number(dishes.dishes_price)) {
                                            countarry[k].countprice = 0
                                        } else {
                                            countarry[k].countprice = parseFloat((Number(countarry[k].countprice) - Number(dishes.dishes_price)).toFixed(2));
                                        }
                                    }
                                }

                                that.setData({
                                    cartList: cartList,
                                    sumMonney: sum,
                                    cupNumber: that.data.cupNumber >= 1 ? that.data.cupNumber - 1 : 0,
                                    countarry: countarry
                                })

                            } else {
                                console("减份数出错")
                                wx.showToast({
                                    title: '减份数出现错误',
                                    icon: 'none',
                                    duration: 2000,
                                })
                            }
                        } else {
                            console.log("不能减")
                        }
                    } else {
                        console.log("??")
                    }
                }
            } else {
                console.log('购物车没有这道菜,不能减')
                for (var k = 0; k < countarry.length; k++) {
                    if (countarry[k].countname == dishes.dishes_name && countarry[k].dishes_id == dishes.dishes_id) {
                        if (countarry[k].countnum >= 1) {
                            countarry[k].countnum--
                        } else {
                            countarry[k].countnum = 0
                        }
                        if (Number(countarry[k].countprice) < Number(dishes.dishes_price)) {
                            countarry[k].countprice = 0
                        } else {
                            countarry[k].countprice = parseFloat((Number(countarry[k].countprice) - Number(dishes.dishes_price)).toFixed(2));
                        }
                    }
                    that.setData({
                        countarry: countarry
                    })
                }
            }

        } else {
            console.log('购物车为空,不能减')
        }
    },


    addDish(e, remark = '') {
        var that = this
        if (this.data.is_join_platform == 0) {
            wx.showModal({
                title: '提示',
                content: '该商铺还未入驻本平台',
            })
        } else {
            if (that.data.toMenu === '100') {
                wx.showModal({
                    title: '当前状态不能进行点餐操作!',
                    showCancel: false,
                    confirmText: '返回',
                    success(res) {
                        if (res.confirm) {
                            wx.navigateBack({
                                delta: 1,
                            })
                        }
                    }
                })
            }
            const {
                index,
                id,
                item
            } = e.currentTarget.dataset

            if (item.everyday_price != 0 && item.weekend != -1 && item.everyone_limit == 0) {
                wx.showToast({
                    title: '购买上限为0',
                    icon: 'error'
                })
                return;
            }

            this.setData({
                dishesIndex: index
            })
            let cartList = [...this.data.cartList]
            let cartItemIdx
            let cartItem = cartList.find((d, idx) => {
                if (d.dishes_id === id && !d.id) {
                    cartItemIdx = idx
                    return true
                }
                return false
            })

            // const dishes = this.data.menuList[this.data.c1Idx].class1s[this.data.c2Idx].class2 [this.data.c3Idx].dishesInfs[index]
            const dishes = this.data.menu[index]
            if (!dishes) {
                throw new Error('选中菜品错误')
            }
            dishes.dishes_price = that.data.haveSale && that.data.c1Idx == 0 && dishes.everyday_price > 0 ? dishes.everyday_price : dishes.dishes_price
            let copyOrder = 1
            let sumMonney = Number(this.data.sumMonney) + Number((Number(dishes.dishes_price) * Number(copyOrder)).toFixed(2));
            sumMonney = parseFloat(sumMonney.toFixed(2))
            if (this.data.isQuery) {
                this.setData({
                    queryData: ''
                })
            }

            if (cartItem && cartItemIdx != undefined && !cartItem.hadOrdered) {
                if (item.weekend != -1 && item.everyday_price != 0 && Number(cartItem.number) + 1 > item.everyone_limit) {
                    wx.showToast({
                        title: '超出购买上限',
                        icon: 'error'
                    })
                    return;
                }

                this.setData({
                    [`cartList[${cartItemIdx}].number`]: Number(cartItem.number) + 1,
                    [`cartList[${cartItemIdx}].sum`]: (Number(cartItem.number) + 1) * cartItem.dishes_price,
                    [`cartList[${cartItemIdx}].remark`]: remark
                })
            } else {

                if (this.data.difference_flag && this.data.locationindex == 3) {
                    var item_type = 2;
                } else {
                    var item_type = 0;
                    if (Number(app.globalData.subSeatsNum) > 1) {
                        copyOrder = Number(app.globalData.subSeatsNum)
                    }
                }
                let remark = ''
                if (dishes.remark || dishes.quickRemark) {
                    remark = dishes.remark || '' + ';' + dishes.quickRemark || ''
                }

                function week(num) {
                    var arr = ["日", "一", "二", "三", "四", "五", "六", "全"]
                    return num == -1 ? arr[7] : arr[num]
                }
                let newDish = {
                    "sale_dishe": that.data.haveSale && that.data.c1Idx == 0 && dishes.everyday_price > 0,
                    "name": that.data.haveSale && that.data.c1Idx == 0 && dishes.everyday_price > 0 ? "[" + week(dishes.weekend) + "]" + dishes.dishes_name : dishes.dishes_name,
                    "price": dishes.dishes_price ? dishes.dishes_price : 0,
                    "dishes_price": dishes.dishes_price ? dishes.dishes_price : 0,
                    "number": 1,
                    "sum": dishes.dishes_price ? dishes.dishes_price : 0,
                    "img_url": dishes.dishes_img,
                    "big_img_url": dishes.big_dishes_img,
                    "dishes_id": dishes.dishes_id,
                    "spec_name": dishes.dishes_metering_type,
                    "spec_type": dishes.spec_type,
                    "dishes_metering_type": dishes.dishes_metering_type,
                    "dishes_spec_type": dishes.spec_type, //是否多规格
                    "disher_weight": 0,
                    "specal_type": dishes.specal_type,
                    "weighing": dishes.weighing,
                    "dishes_introduce": dishes.dishes_introduce,
                    "remark": remark,
                    "decdishes_flag": 1, //1为此为减菜前点的商品，不能改动
                    "adddishes_flag": 0, //1为此为加菜前点的商品，不能改
                    "dishes_status": 0,
                    "u_item_number": 0,
                    "item_type": item_type,
                    "sideDisht": '',
                    "tastes": this.data.tastes,
                    "tastesRemark": this.data.tastesRemark,
                    "hadOrdered": false,
                    "freeOrder": 0,
                    "repairOrder": 0,
                    "copyOrder": copyOrder,
                    "waitOrder": 0,
                    "baleOrder": 0,
                    "transferOrder": 0,
                    "depositOrder": 0,
                    "jointSet": '',
                    "vip_price": dishes.vip_price ? dishes.vip_price : 0,
                    "inline_price": dishes.inline_price ? dishes.inline_price : 0,
                    "inline_price_commission": dishes.inline_price_commission ? dishes.inline_price_commission : 0
                }

                cartList.push(newDish)
                this.setData({
                    cartList: cartList,
                    sumMonney: sumMonney,
                    cupNumber: that.data.cupNumber + Number(copyOrder)
                })
            }
        }

    },
    addDishNew: function (e) {
        var that = this

        const {
            index,
            id
        } = e.currentTarget.dataset

        let cartList = [...this.data.cartList]
        let cartItemIdx

        for (const iterator of cartList) {
            if (iterator.uuid == id) {
                return
            }
        }

        const dishes = this.data.menu[index]
        if (!dishes) {
            throw new Error('选中菜品错误')
        }

        let copyOrder = 1
        let sumMonney = Number(this.data.sumMonney) + Number((Number(dishes.dishes_price) * Number(copyOrder)).toFixed(2));
        sumMonney = parseFloat(sumMonney.toFixed(2))


        if (this.data.difference_flag && this.data.locationindex == 3) {
            var item_type = 2;
        } else {
            var item_type = 0;
            if (Number(app.globalData.subSeatsNum) > 1) {
                copyOrder = Number(app.globalData.subSeatsNum)
            }
        }
        let remark = ''
        if (dishes.remark || dishes.quickRemark) {
            remark = dishes.remark || '' + ';' + dishes.quickRemark || ''
        }
        let newDish = {
            "name": dishes.dishes_name,
            "price": dishes.dishes_price ? dishes.dishes_price : 0,
            "dishes_price": dishes.dishes_price ? dishes.dishes_price : 0,
            "number": 1,
            "sum": dishes.dishes_price ? dishes.dishes_price : 0,
            "sum1": dishes.spec_type == 100 || dishes.spec_type == 101 ? dishes.ticketPrice : 0,
            "img_url": dishes.dishes_img,
            "big_img_url": dishes.big_dishes_img,
            "dishes_id": dishes.dishes_id,
            "spec_name": dishes.dishes_unit,
            "spec_type": dishes.spec_type,
            "dishes_metering_type": dishes.dishes_unit,
            "dishes_spec_type": dishes.spec_type, //是否多规格
            "disher_weight": 0,
            "specal_type": dishes.specal_type,
            "weighing": dishes.weighing,
            "dishes_introduce": dishes.dishes_introduce,
            "remark": remark,
            "decdishes_flag": 1, //1为此为减菜前点的商品，不能改动
            "adddishes_flag": 0, //1为此为加菜前点的商品，不能改
            "dishes_status": 0,
            "u_item_number": 0,
            "item_type": item_type,
            "sideDisht": '',
            "tastes": this.data.tastes,
            "tastesRemark": this.data.tastesRemark,
            "hadOrdered": false,
            "freeOrder": 0,
            "repairOrder": 0,
            "copyOrder": copyOrder,
            "waitOrder": 0,
            "baleOrder": 0,
            "transferOrder": 0,
            "depositOrder": 0,
            "jointSet": '',
            "ticketOrderinfo": dishes,
            "vip_price": dishes.vip_price ? dishes.vip_price : 0,
            "inline_price": dishes.inline_price ? dishes.inline_price : 0,
            "uuid": dishes.uuid,
            "inline_price_commission": dishes.inline_price_commission ? dishes.inline_price_commission : 0
        }

        cartList.push(newDish)
        this.setData({
            cartList: cartList,
            sumMonney: sumMonney,
            cupNumber: that.data.cupNumber + Number(copyOrder),
            itemDishes: dishes.dishes_id,
        })


    },

    //多规格菜品加入购物车
    // spec_type 规格类型：规格类型：单规格-0，多规格-1，称重多做法-2，计件多做法-3,称重单规格-5，单规格多做法-4，称重多规格-6，单规格+配菜-7，来料加工-8，多拼粥品-9
    addToCart2: function () {
        var that = this
        var dishesSpecArry = that.data.dishesSpecArry
        var sumMonney = that.data.sumMonney
        var cupNumber = that.data.cupNumber
        var countarry = that.data.countarry
        var cartList = that.data.cartList
        var dishesIndex = that.data.dishesIndex;
        var chooseGuigeIndex = that.data.chooseGuigeIndex;
        var orderDetail = that.data.orderDetail
        var menu = that.data.menu;
        var dishes = that.data.dishes
        var remark = ""
        var tastes = ""
        var difference_flag = that.data.difference_flag;
        var List = []
        let copyOrder = 1
        if (that.data.SideDishList) {
            List = JSON.parse(JSON.stringify(that.data.SideDishList))
        }

        // 后加的菜品判断是否已经进入确认时间
        if (difference_flag && that.data.locationindex == 3) {
            var item_type = 2; //进入确认时间的菜需要将菜品状态置2
        } else {
            var item_type = 0; //否则默认将菜品状态置0，标识时间外的加菜
            if (Number(app.globalData.subSeatsNum) > 1) {
                copyOrder = Number(app.globalData.subSeatsNum)
            }
        }
        if (that.data.remark != undefined && that.data.remark != "") {
            dishes.remark = that.data.remark;
            remark = that.data.remark
        }
        remark = remarkJS.joinRemarkStr(that.data.quickRemark, dishes.remark);

        that.save_remark(dishes);
        if (that.data.tastes != undefined && that.data.tastes != "") {
            tastes = that.data.tastes
            dishes.tastes = that.data.tastes;
        }

        menu[dishesIndex] = dishes

        // 判断是否有配菜的情况下
        if (dishes.sideDishes == 0) {
            let promise = new Promise(function (resolve, reject) {
                var isChoose = false
                for (var x of dishesSpecArry) {
                    if (x.number > 0) {
                        isChoose = true
                    }
                }
                resolve(isChoose)
            });

            promise.then(function (res) {
                if (!res) {
                    wx.showModal({
                        title: '错误',
                        content: '请选择规格'
                    })
                } else {
                    for (var a = 0; a < dishesSpecArry.length; a++) {
                        var dishes_name = dishes.dishes_name
                        // 中括号是因为之前的菜品名称会把 做法 写入菜品名内
                        dishes.dishes_name.includes("(") ? dishes_name = dishes_name.replace(/\([^\)]*\)/g, "") : dishes_name
                        dishes.spec_type == 4 ? dishes_name = dishes_name + "(" + dishesSpecArry[a].spec_name + ")" : dishes_name

                        var addItem = {
                            "name": dishes_name,
                            "price": dishesSpecArry[a].spec_price,
                            "dishes_price": dishesSpecArry[a].spec_price,
                            "number": dishesSpecArry[a].number,
                            "spec_id": dishesSpecArry[a].spec_id,
                            "sum": parseFloat((dishesSpecArry[a].spec_price * dishesSpecArry[a].number).toFixed(2)),
                            "img_url": dishes.dishes_img,
                            "big_img_url": dishes.big_dishes_img,
                            "dishes_id": dishes.dishes_id,
                            "spec_name": dishesSpecArry[a].spec_name,
                            "u_spec_name": dishesSpecArry[a].u_spec_name,
                            "spec_type": dishes.dishes_metering_type,
                            "dishes_spec_type": dishes.spec_type, //是否多规格
                            "disher_weight": 0,
                            "specal_type": dishes.specal_type,
                            "weighing": dishes.weighing,
                            "dishes_introduce": dishes.dishes_introduce,
                            "remark": remark,
                            "adddishes_flag": 0, //1为此为加菜前点的商品，不能改动
                            "dishes_status": 4,
                            "item_type": item_type,
                            "sideDisht": '',
                            "tastes": tastes,
                            "tastesRemark": that.data.tastesRemark,
                            "hadOrdered": false,
                            "freeOrder": 0,
                            "repairOrder": 0,
                            "copyOrder": copyOrder,
                            "waitOrder": 0,
                            "baleOrder": 0,
                            "transferOrder": 0,
                            "depositOrder": 0,
                            "jointSet": '',
                            "vip_price": dishes.vip_price ? dishes.vip_price : 0,
                            "inline_price": dishes.inline_price ? dishes.inline_price : 0,
                            "inline_price_commission": dishes.inline_price_commission ? dishes.inline_price_commission : 0
                        }

                        if (dishes.spec_type == 6) {
                            addItem.disher_weight_ceiling = dishesSpecArry[a].weightingMin
                            addItem.item_number = dishesSpecArry[a].weightingMin + ',' + dishesSpecArry[a].weightingMax
                            addItem.sum = 0
                        }

                        if (dishesSpecArry[a].number > 0) {
                            if (cartList.length == 0) {
                                if (dishes.spec_type != 6) {
                                    sumMonney += Number((Number(addItem.sum) * Number(copyOrder)).toFixed(2))
                                }
                                cupNumber += Number((Number(addItem.number) * Number(copyOrder)).toFixed(2))
                                cartList.push(addItem);
                                that.addtobuy(addItem);

                            } else {
                                for (var i = 0; i < cartList.length; i++) {
                                    if (cartList[i].name == addItem.name && cartList[i].price == addItem.price && difference_flag == true && cartList[i].adddishes_flag == 0) {

                                        if (!that.data.difference_flag) {
                                            console.log("1")
                                            if (dishes.spec_type == 6) {

                                            } else {
                                                sumMonney -= Number((Number(cartList[i].sum) * Number(copyOrder)).toFixed(2))
                                                sumMonney += Number((Number(addItem.sum) * Number(copyOrder)).toFixed(2))
                                            }
                                            cupNumber -= Number((Number(cartList[i].number) * Number(copyOrder)).toFixed(2))
                                            cupNumber += Number((Number(addItem.number) * Number(copyOrder)).toFixed(2))
                                            var number_nochange = cartList[i].number
                                            var sum_nochange = cartList[i].sum
                                            cartList[i].number = Number(addItem.number)
                                            cartList[i].sum = Number(addItem.sum)

                                            cartList[i].tastes = addItem.tastes
                                            cartList[i].remark = addItem.remark

                                            addItem.number -= number_nochange
                                            addItem.sum -= sum_nochange
                                            that.addtobuy(addItem)
                                            break;
                                        } else {
                                            if (cartList[i].adddishes_flag == addItem.adddishes_flag) {
                                                if (cartList[i].number > addItem.number) {
                                                    if (dishes.spec_type == 6) {} else {
                                                        sumMonney = sumMonney - Number((Number((cartList[i].number - addItem.number) * addItem.price) * Number(copyOrder)).toFixed(2))
                                                    }
                                                    cupNumber = cupNumber - Number(Number((cartList[i].number - addItem.number) * Number(copyOrder)).toFixed(2))
                                                } else if (cartList[i].number < addItem.number) {
                                                    if (dishes.spec_type == 6) {} else {
                                                        sumMonney = sumMonney + Number(Number(((addItem.number - cartList[i].number) * addItem.price) * Number(copyOrder)).toFixed(2))
                                                    }
                                                    cupNumber = cupNumber + Number(((addItem.number - cartList[i].number) * Number(copyOrder)).toFixed(2))
                                                } else {

                                                }
                                                cartList[i].number = Number(addItem.number)
                                                cartList[i].sum = Number(addItem.sum)
                                                sumMonney = sumMonney
                                                cupNumber = cupNumber
                                                that.addtobuy(addItem)
                                                break;
                                            } else {
                                                console.log("2")
                                                if (dishes.spec_type == 6) {} else {
                                                    sumMonney += Number(Number(Number(addItem.sum) * Number(copyOrder)).toFixed(2))
                                                }
                                                cupNumber += Number(Number(Number(addItem.number) * Number(copyOrder)).toFixed(2))
                                                cartList.push(addItem);
                                                that.addtobuy(addItem)
                                                break;
                                            }
                                        }
                                    } else if (cartList[i].name == addItem.name && cartList[i].price == addItem.price && difference_flag == false) {
                                        if (!that.data.difference_flag) {
                                            console.log("1")
                                            if (dishes.spec_type == 6) {} else {
                                                sumMonney -= Number(Number(Number(cartList[i].sum) * Number(copyOrder)).toFixed(2))
                                                sumMonney += Number(Number(Number(addItem.sum) * Number(copyOrder)).toFixed(2))
                                            }
                                            cupNumber -= Number(Number(Number(cartList[i].number) * Number(copyOrder)).toFixed(2))
                                            cupNumber += Number(Number(Number(addItem.number) * Number(copyOrder)).toFixed(2))
                                            var number_nochange = cartList[i].number
                                            var sum_nochange = cartList[i].sum
                                            cartList[i].number = Number(addItem.number)
                                            cartList[i].sum = Number(addItem.sum)
                                            cartList[i].tastes = addItem.tastes
                                            cartList[i].remark = addItem.remark
                                            addItem.number -= number_nochange
                                            addItem.sum -= sum_nochange
                                            that.addtobuy(addItem)
                                            break;
                                        } else {
                                            if (cartList[i].adddishes_flag == addItem.adddishes_flag) {
                                                if (cartList[i].number > addItem.number) {
                                                    if (dishes.spec_type == 6) {} else {
                                                        sumMonney = sumMonney - Number((Number((cartList[i].number - addItem.number) * addItem.price) * Number(copyOrder)).toFixed(2))
                                                    }
                                                    cupNumber = cupNumber - Number((Number(cartList[i].number - addItem.number) * Number(copyOrder)).toFixed(2))
                                                } else if (cartList[i].number < addItem.number) {
                                                    if (dishes.spec_type == 6) {} else {
                                                        sumMonney = sumMonney + Number((Number((addItem.number - cartList[i].number) * addItem.price) * Number(copyOrder)).toFixed(2))
                                                    }
                                                    cupNumber = cupNumber + Number((Number(addItem.number - cartList[i].number) * Number(copyOrder)).toFixed(2))
                                                } else {

                                                }
                                                cartList[i].number = Number(addItem.number)
                                                cartList[i].sum = Number(addItem.sum)
                                                cartList[i].tastes = addItem.tastes
                                                cartList[i].remark = addItem.remark
                                                sumMonney = sumMonney
                                                cupNumber = cupNumber
                                                that.addtobuy(addItem)
                                                break;
                                            } else {
                                                console.log("2")
                                                if (dishes.spec_type == 6) {} else {
                                                    sumMonney += Number(Number(Number(addItem.sum) * Number(copyOrder)).toFixed(2))
                                                }
                                                cupNumber += Number(Number(Number(addItem.number) * Number(copyOrder)).toFixed(2))
                                                cartList.push(addItem);
                                                that.addtobuy(addItem)
                                                break;
                                            }
                                        }
                                    } else {
                                        if (i == cartList.length - 1) {
                                            console.log("3")
                                            if (dishes.spec_type == 6) {} else {
                                                sumMonney += Number(Number(Number(addItem.sum) * Number(copyOrder)).toFixed(2))
                                            }
                                            cupNumber += Number(Number(Number(addItem.number) * Number(copyOrder)).toFixed(2))
                                            cartList.push(addItem);
                                            that.addtobuy(addItem)
                                            break;
                                        }
                                    }
                                }
                            }
                        } else {
                            for (var b = 0; b < cartList.length; b++) {
                                if (dishesSpecArry[a].spec_name == cartList[b].spec_name &&
                                    dishesSpecArry[a].dishes_id == cartList[b].dishes_id &&
                                    dishesSpecArry[a].spec_price == cartList[b].price &&
                                    parseInt(dishesSpecArry[a].spec_id) == parseInt(cartList[b].spec_id) &&
                                    cartList[b].dishes_spec_type != 6) {
                                    cupNumber -= Number((Number(cartList[b].number) * Number(copyOrder)).toFixed(2));
                                    if (dishes.spec_type == 6) {

                                    } else {
                                        sumMonney -= Number(Number(Number(cartList[b].price * cartList[b].number) * Number(copyOrder)).toFixed(2));
                                    }
                                    cartList.splice(b, 1)
                                }
                            }
                        }

                    }

                    var countname = addItem.name
                    var countnum = 0
                    var countprice = 0
                    for (var i = 0; i < cartList.length; i++) {
                        if (!that.data.difference_flag) {
                            if (cartList[i].dishes_id == addItem.dishes_id) {
                                countname = cartList[i].name
                                if (cartList[i].dishes_spec_type == 6) {
                                    countnum += Number(cartList[i].item_number.split(',')[0])
                                } else {
                                    countnum += Number(cartList[i].number)
                                }
                                countprice += cartList[i].sum
                                cartList[i].remark = addItem.remark
                                cartList[i].tastes = addItem.tastes
                            }
                        } else {
                            if (addItem != undefined) {
                                if (cartList[i].dishes_id == addItem.dishes_id && cartList[i].adddishes_flag == 0) {
                                    countname = cartList[i].name
                                    if (cartList[i].dishes_spec_type == 6) {
                                        countnum += Number(cartList[i].item_number.split(',')[0])
                                    } else {
                                        countnum += Number(cartList[i].number)
                                    }
                                    cartList[i].remark = addItem.remark
                                    cartList[i].tastes = addItem.tastes
                                    countprice += cartList[i].sum
                                }
                            } else {
                                console.log("添加为空")
                            }
                        }
                    }

                    var count = {
                        "dishes_id": addItem.dishes_id,
                        "countname": countname,
                        "countnum": Number(countnum),
                        "countprice": countprice
                    }
                    if (item_type == 2) {
                        count.addItem = true
                    }

                    countarry = that.returnCountArry(count, countarry);

                    if (that.data.isQuery) {
                        that.setData({
                            queryData: ''
                        })
                    }
                    //对修改的数据进行setdata
                    that.setData({
                        countarry: countarry,
                        cartList: cartList,
                        showModalStatus: false,
                        showModalStatus3: false,
                        cupNumber: cupNumber,
                        sumMonney: sumMonney,
                        menu: menu,
                        remark: '',
                        tastes: '',
                        dishesNumber: 0,
                        dishesMoney: 0,
                        tastesRemark: '',
                        chooseGuigeIndex: -1
                    })
                    app.globalData.cartList = cartList;
                    app.globalData.cupNumber = cupNumber;
                    app.globalData.sumMonney = sumMonney;
                }
            })
        } else if (dishes.sideDishes != 0) {
            //当有配菜的时候就进入到这个方法进行判断
            //拿出当前选择的规格
            if (chooseGuigeIndex == -1) {
                wx.showModal({
                    title: '错误',
                    content: '请选择规格'
                })
            } else {
                let choose_dishes = dishesSpecArry[chooseGuigeIndex]
                //选中的配菜
                var sideDisht = '';
                var dishes_sum = Number(choose_dishes.spec_price);
                for (var i = 0; i < List.length; i++) {
                    if (List[i].checked) {
                        if (List[i].orderDetailedNum != '' && List[i].orderDetailedNum != 0) {
                            if (List[i].orderDetailedSum) {
                                dishes_sum += Number(List[i].orderDetailedSum)
                            }
                            sideDisht = sideDisht + List[i].ID + '-' + List[i].orderDetailedNum + ','
                        }
                    }
                }
                //创建一个菜
                var addItem = {
                    "name": dishes.dishes_name,
                    "price": choose_dishes.spec_price,
                    "dishes_price": choose_dishes.spec_price,
                    "number": 1,
                    "spec_id": choose_dishes.spec_id,
                    "sum": dishes_sum,
                    "img_url": dishes.dishes_img,
                    "big_img_url": dishes.big_dishes_img,
                    "dishes_id": dishes.dishes_id,
                    "spec_name": choose_dishes.spec_name,
                    "u_spec_name": choose_dishes.u_spec_name,
                    "spec_type": dishes.dishes_metering_type,
                    "dishes_spec_type": dishes.spec_type, //是否多规格
                    "disher_weight": 0,
                    "specal_type": dishes.specal_type,
                    "weighing": dishes.weighing,
                    "dishes_introduce": dishes.dishes_introduce,
                    "remark": remark,
                    "adddishes_flag": 0, //1为此为加菜前点的商品，不能改动
                    "dishes_status": 4,
                    "item_type": item_type,
                    "sideDisht": sideDisht,
                    "tastes": tastes,
                    "tastesRemark": that.data.tastesRemark,
                    "jointSet": '',
                    "SideDishList": List,
                    "hadOrdered": false,
                    "freeOrder": 0,
                    "repairOrder": 0,
                    "copyOrder": copyOrder,
                    "waitOrder": 0,
                    "baleOrder": 0,
                    "transferOrder": 0,
                    "depositOrder": 0,
                    "dishesSpecArry": dishesSpecArry,
                    "vip_price": choose_dishes.vip_price ? choose_dishes.vip_price : 0,
                    "inline_price": choose_dishes.inline_price ? choose_dishes.inline_price : 0,
                    "inline_price_commission": choose_dishes.inline_price_commission ? choose_dishes.inline_price_commission : 0
                }

                if (dishes.spec_type == 6) {
                    addItem.disher_weight_ceiling = dishesSpecArry[chooseGuigeIndex].weightingMin
                    addItem.item_number = dishesSpecArry[chooseGuigeIndex].weightingMin + ',' + dishesSpecArry[chooseGuigeIndex].weightingMax
                    addItem.sum = 0
                }
                cartList.push(addItem);
                that.addtobuy(addItem);

                var countname = addItem.name
                var countnum = 0
                var countprice = 0
                for (var i = 0; i < cartList.length; i++) {
                    if (!that.data.difference_flag) {
                        if (cartList[i].dishes_id == addItem.dishes_id) {
                            countname = cartList[i].name
                            if (cartList[i].dishes_spec_type == 6) {
                                countnum += Number(cartList[i].item_number.split(',')[0])
                            } else {
                                countnum += Number(cartList[i].number)
                            }
                            countprice += cartList[i].sum
                            cartList[i].remark = addItem.remark
                            cartList[i].tastes = addItem.tastes
                        }
                    } else {
                        if (addItem != undefined) {
                            if (cartList[i].dishes_id == addItem.dishes_id && cartList[i].adddishes_flag == 0) {
                                countname = cartList[i].name
                                if (cartList[i].dishes_spec_type == 6) {
                                    countnum += Number(cartList[i].item_number.split(',')[0])
                                } else {
                                    countnum += Number(cartList[i].number)
                                }
                                cartList[i].remark = addItem.remark
                                cartList[i].tastes = addItem.tastes
                                countprice += cartList[i].sum
                            }
                        } else {
                            console.log("添加为空")
                        }
                    }
                }

                var count = {
                    "dishes_id": addItem.dishes_id,
                    "countname": countname,
                    "countnum": Number(countnum),
                    "countprice": countprice
                }

                if (countarry == undefined || countarry.length == 0) {
                    countarry = []
                    countarry.push(count)
                } else {
                    for (var i = 0; i < countarry.length; i++) {
                        //如果countarry中有同名的菜品,则删除同名的菜品
                        if (countarry[i].countname == count.countname) {
                            countarry.splice(i, 1)
                            //如果替代的菜品数量为0,则不用替代到原菜品上,防止显示bug
                            if (count.countnum != 0) {
                                countarry.push(count)
                            }
                            break
                        } else {
                            //如果没有同名的菜品,则把新菜品推入countarry中
                            if (i == countarry.length - 1 && countarry[i].countname != count.countname) {
                                countarry.push(count)
                                break
                            }
                        }
                    }
                }

                sumMonney += Number(Number(Number(addItem.sum) * Number(copyOrder)).toFixed(2))
                cupNumber += Number(copyOrder)

                if (that.data.isQuery) {
                    that.setData({
                        queryData: ''
                    })
                }
                //对修改的数据进行setdata
                console.log(sumMonney)
                that.setData({
                    countarry: countarry,
                    cartList: cartList,
                    showModalStatus: false,
                    showModalStatus3: false,
                    cupNumber: cupNumber,
                    sumMonney: sumMonney,
                    menu: menu,
                    remark: '',
                    tastes: '',
                    tastesRemark: '',
                    chooseGuigeIndex: -1
                })
                app.globalData.cartList = cartList;
                app.globalData.cupNumber = cupNumber;
                app.globalData.sumMonney = sumMonney;
            }
        }
    },

    //删除已选的多种规格 
    resetMultipleSpecifications: function (e) {
        var that = this
        var dishesSpecArry = that.data.dishesSpecArry
        var sumMonney = that.data.sumMonney
        var cupNumber = that.data.cupNumber
        var countarry = that.data.countarry
        var cartList = that.data.cartList

        for (var a = 0; a < dishesSpecArry.length; a++) {
            for (var i = 0; i < countarry.length; i++) {
                //如果countarry中有同名的菜品,则删除同名的菜品
                if (countarry[i].dishes_id == dishesSpecArry[a].dishes_id) {
                    countarry.splice(i, 1)
                }
            }

            for (var b = 0; b < cartList.length; b++) {
                if (dishesSpecArry[a].spec_name == cartList[b].spec_name &&
                    dishesSpecArry[a].dishes_id == cartList[b].dishes_id &&
                    dishesSpecArry[a].spec_price == cartList[b].price &&
                    parseInt(dishesSpecArry[a].spec_id) == parseInt(cartList[b].spec_id)) {
                    cupNumber -= cartList[b].number
                    sumMonney -= (cartList[b].price * cartList[b].number);
                    cartList.splice(b, 1)
                }
            }
        }

        //对修改的数据进行setdata
        that.setData({
            countarry: countarry,
            cartList: cartList,
            showModalStatus: false,
            showModalStatus3: false,
            cupNumber: cupNumber,
            sumMonney: sumMonney,
            dishesNumber: 0,
            dishesMoney: 0,
            remark: '',
            chooseGuigeIndex: -1
        })
        app.globalData.cartList = cartList
        app.globalData.cupNumber = cupNumber
        app.globalData.sumMonney = sumMonney
    },

    // 多做法中选择重量添加菜品到购物车
    // 也视为菜品
    addToCart3: function (e) {
        var that = this;
        var dishes = that.data.dishes
        var measurementValueInput = that.data.measurementValueInput //称重值
        var inputvalue = that.data.inputvalue
        var inputvalue1 = that.data.inputvalue1
        var em_index = that.data.em_index
        var en_index = that.data.en_index
        var em_basicarry = that.data.em_basicarry
        var en_basicarry = that.data.en_basicarry
        var menu = that.data.menu
        var difference_flag = that.data.difference_flag
        var dishesIndex = that.data.dishesIndex
        var List = [] // 已选择的配菜
        var sideDisht = '' // 需要提交的配菜
        var remark = '' // 备注
        var tastes = '' // 口味
        var tastesRemark = '' // 常用空位显示
        let copyOrder = 1
        if (that.data.SideDishList) {
            List = JSON.parse(JSON.stringify(that.data.SideDishList))
        }
        if (en_index.length == 0 && em_index.length == 0) {
            wx.showToast({
                title: '请选择做法',
                icon: 'none',
                duration: 2000,
            })
        } else {
            var cartList = that.data.cartList;
            var weightarry = that.data.weightarry
            var number = 1

            //2020-11-20 多规格多做法备注重写
            remark = remarkJS.joinRemarkStr(that.data.quickRemark, that.data.remark);

            that.save_remark(dishes);
            if (that.data.tastes != undefined && that.data.tastes != "" && that.data.tastes != null) {
                tastes = that.data.tastes
            }
            if (that.data.tastesRemark != undefined && that.data.tastesRemark != "" && that.data.tastesRemark != null) {
                tastesRemark = that.data.tastesRemark
            }

            dishes.remark = that.data.remark
            menu[dishesIndex] = dishes

            if (dishes.spec_type == 4) {
                inputvalue = 1
                inputvalue1 = 1
            } else {
                inputvalue = 0
                inputvalue1 = 99
            }

            if (difference_flag && that.data.locationindex == 3) {
                var item_type = 2; //点餐类别：点餐-0、退餐--1、加菜-2、修改-3
            } else {
                var item_type = 0; //点餐类别：点餐-0、退餐--1、加菜-2、修改-3
                if (Number(app.globalData.subSeatsNum) > 1) {
                    copyOrder = Number(app.globalData.subSeatsNum)
                }
            }

            if (measurementValueInput != '' && measurementValueInput != null) {
                if (measurementValueInput > 0) {
                    var sum = 0
                    var measurement_value = measurementValueInput
                    var dishes_sum = 0;
                    if (dishes.sideDishes != 0) {
                        for (var i = 0; i < List.length; i++) {
                            if (List[i].checked && List[i].orderDetailedNum > 0) {
                                if (List[i].orderDetailedSum) {
                                    dishes_sum += Number(List[i].orderDetailedSum)
                                }
                                sideDisht = sideDisht + List[i].ID + '-' + List[i].orderDetailedNum + ','
                            }
                        }
                    }

                    if (dishes.spec_type == 4) { //单规格多做法的情况
                        if (dishes.sideDishes == 0) {
                            sum = Number(parseFloat(((Number(dishes.dishes_price) + Number(that.data.sum_position)) * Number(inputvalue)).toFixed(2)))
                            measurement_value = Number(inputvalue);
                        } else {
                            measurement_value = 1;
                            sum = Number(parseFloat(Number(dishes.dishes_price) + Number(dishes_sum) + Number(that.data.sum_position)))
                        }
                    } else {
                        sum = Number(dishes.dishes_price) * Number(measurementValueInput) + Number(that.data.sum_position) + Number(dishes_sum)
                    }
                    
                    var addItem = {
                        "id": 0,
                        "name": dishes.dishes_name,
                        "price": dishes.dishes_price,
                        "measurement_value": measurement_value,
                        "dishes_price": dishes.dishes_price,
                        "number": 1,
                        "sum": sum,
                        "img_url": dishes.dishes_img,
                        "big_img_url": dishes.big_dishes_img,
                        "dishes_id": dishes.dishes_id,
                        "spec_name": "称重",
                        "spec_type": dishes.dishes_metering_type,
                        "dishes_spec_type": dishes.spec_type,
                        "disher_weight": inputvalue,
                        "specal_type": dishes.specal_type,
                        "weighing": dishes.weighing,
                        "remark": remark,
                        "dishes_introduce": dishes.dishes_introduce,
                        "adddishes_flag": 0, //1为此为加菜前点的商品，不能改动
                        "disher_weight_ceiling": inputvalue1,
                        "em_basicarry": em_basicarry,
                        "en_basicarry": en_basicarry,
                        "item_number": inputvalue + ',' + inputvalue1,
                        "dishes_status": 5,
                        "en_index": en_index,
                        "em_index": em_index,
                        "item_type": item_type,
                        "dishes_index": 1, //这个可以标识区分同名菜品
                        "SideDishList": List,
                        "sideDisht": sideDisht,
                        "tastes": tastes,
                        "tastesRemark": tastesRemark,
                        "jointSet": '',
                        "hadOrdered": false,
                        "freeOrder": 0,
                        "repairOrder": 0,
                        "copyOrder": copyOrder,
                        "waitOrder": 0,
                        "baleOrder": 0,
                        "transferOrder": 0,
                        "depositOrder": 0,
                        "vip_price": dishes.vip_price ? dishes.vip_price : 0,
                        "inline_price": dishes.inline_price ? dishes.inline_price : 0,
                        "inline_price_commission": dishes.inline_price_commission ? dishes.inline_price_commission : 0
                    }

                    if (dishes.spec_type == 4) {
                        number = Number(inputvalue1),
                            addItem.number = Number(inputvalue1)
                    }
                    if (dishes.spec_type == 10) {
                        number = Number(measurement_value),
                            addItem.number = Number(measurement_value)
                    }
                    var weightitem = {
                        "id": 0,
                        "name": dishes.dishes_name,
                        "dishes_id": dishes.dishes_id,
                        "dishes_price": dishes.dishes_price,
                        "sum": Number(sum),
                        "weight": inputvalue,
                        "weight_ceiling": inputvalue1,
                        "number": number,
                        "dishes_metering_type": dishes.dishes_metering_type,
                        "vip_price": dishes.vip_price ? dishes.vip_price : 0,
                        "inline_price": dishes.inline_price ? dishes.inline_price : 0,
                        "inline_price_commission": dishes.inline_price_commission ? dishes.inline_price_commission : 0
                    }
                    if (weightarry.length == 0) {
                        weightarry.push(weightitem)
                    } else {
                        if (!that.data.changeweightdishes_flag) {
                            for (var i = 0; i < weightarry.length; i++) {
                                console.log(weightarry[i].dishes_id == weightitem.dishes_id)
                                if (weightarry[i].dishes_id == weightitem.dishes_id) {
                                    weightarry[i].weight = Number(weightitem.weight) + Number(weightarry[i].weight)
                                    weightarry[i].sum += Number(weightitem.sum)
                                    weightarry[i].number += weightitem.number
                                    break
                                }
                                if (i == weightarry.length - 1 && weightarry[i].dishes_id != weightitem.dishes_id) {
                                    weightarry.push(weightitem)
                                    break
                                }
                            }
                        } else {
                            for (var i = 0; i < weightarry.length; i++) {
                                if (weightarry[i].dishes_id == weightitem.dishes_id && weightarry[i].weight == weightitem.weight) {
                                    weightarry[i].weight = weightitem.weight
                                    weightarry[i].sum = Number(weightitem.sum)
                                }
                            }
                        }
                    }
                    // 判断是否超过1份相同的鱼，如果两份以上就不显多规格
                    for (var k = 0; k < weightarry.length; k++) {
                        if (weightarry[k].number > 1) {
                            var cartList = that.data.cartList
                            if (cartList != '' && cartList != undefined && cartList != null) {
                                for (var i = 0; i < menu.length; i++) {
                                    if (dishes.dishes_id == menu[i].dishes_id) {
                                        // 同名菜品超过1份，标识dishes_index 
                                        addItem.dishes_index = weightarry[k].number;
                                    }
                                }
                            }
                        }
                    }
                    if (!that.data.changeweightdishes_flag) {
                        var sumMonney = that.data.sumMonney + Number(Number(sum * Number(copyOrder)).toFixed(2));
                        var cupNumber = that.data.cupNumber + Number(Number(number * Number(copyOrder)).toFixed(2));
                        cartList.push(addItem)
                        that.setData({
                            weightarry: weightarry,
                            cartList: cartList,
                            showModalStatus1: false,
                            showModalStatus2: false,
                            showModalStatus5: false,
                            changeweightdishes_flag: false,
                            sumMonney: sumMonney,
                            cupNumber: cupNumber,
                            parttoeat: -1,
                            inputvalue: inputvalue,
                            inputvalue1: inputvalue1,
                            en_index: [],
                            em_index: [],
                            result_em: true,
                            measurementValueInput: '',
                            result_en: true,
                            parts: [],
                            whole: [],
                            em_arry: [],
                            isWhole: true,
                            needRemain: false,
                            eatMethodArray: [],
                            SideDishList_choose: [],
                            SideDishList: [],
                            remark: '',
                            quickRemark: '',
                            tastes: '',
                            menu: menu,
                            tastesRemark: '',
                            sum_position: 0,
                            dishesMoney: ''
                        })
                    } else {
                        for (var i = 0; i < cartList.length; i++) {
                            if (addItem.name == cartList[i].name) {
                                var qqq = that.data.sumMonney - Number(((cartList[i].sum + addItem.sum) * copyOrder).toFixed(2))
                                var sumMonney_hh = parseFloat(qqq.toFixed(2))
                                cartList[i] = addItem
                                break
                            }
                        }
                        var sumMonney = sumMonney_hh
                        var cupNumber = that.data.cupNumber
                        that.setData({
                            weightarry: weightarry,
                            cartList: cartList,
                            showModalStatus1: false,
                            showModalStatus2: false,
                            showModalStatus5: false,
                            changeweightdishes_flag: false,
                            sumMonney: sumMonney,
                            cupNumber: cupNumber,
                            inputvalue: '',
                            inputvalue1: '',
                            measurementValueInput: '',
                            parts: [],
                            whole: [],
                            em_arry: [],
                            SideDishList_choose: [],
                            SideDishList: [],
                            isWhole: true,
                            needRemain: false,
                            eatMethodArray: [],
                            remark: '',
                            quickRemark: '',
                            tastes: '',
                            tastesRemark: '',
                            menu: menu,
                            sum_position: 0,
                            dishesMoney: ''
                        })
                    }
                    that.addtobuy(addItem)

                } else {
                    wx.showToast({
                        title: '重量不能为零',
                        icon: 'none',
                        duration: 2000,
                    })
                }
            } else {
                wx.showToast({
                    title: '请输入菜品的数量',
                    icon: 'none',
                    duration: 2000,
                })
            }

            if (that.data.isQuery) {
                that.setData({
                    queryData: ''
                })
            }
            app.globalData.cartList = cartList;
            app.globalData.cupNumber = cupNumber;
            app.globalData.sumMonney = sumMonney;
        }


    },

    //称重详情中的确认修改加入购物车，并且更新数据到购物车cartList
    addToCart4: function (e) {
        console.log(e);
        var that = this;
        that.difference();
        var difference_flag = that.data.difference_flag;
        var cartList = that.data.cartList
        console.log("这是cartList")
        console.log(cartList)
        var dishes = that.data.dishes
        var inputvalue = that.data.inputvalue
        var inputvalue1 = that.data.inputvalue1
        var cookway = that.data.cookway
        var em_index = that.data.em_index
        var em_basicarry = that.data.em_basicarry
        console.log("这是em_basicarry")
        console.log(em_basicarry)
        var en_index = that.data.en_index
        var en_basicarry = that.data.en_basicarry
        console.log("这是en_basicarry")
        console.log(en_basicarry)
        var em_result = that.data.result_em
        var selecthowtodo_flag = that.data.selecthowtodo_flag
        var result = that.data.result
        var index4 = that.data.indexqq
        var orderDetail = that.data.orderDetail
        let copyOrder = 1
        var emresult = em_basicarry.every(function (item, index, array) {
            return item == -1
        })
        var enresult = en_basicarry.every(function (item, index, array) {
            return item == -1
        })

        if (difference_flag && that.data.locationindex == 3) {
            var item_type = 2; //点餐类别：点餐-0、退餐--1、加菜-2、修改-3
        } else {
            var item_type = 0; //点餐类别：点餐-0、退餐--1、加菜-2、修改-3
            if (Number(app.globalData.subSeatsNum) > 1) {
                copyOrder = Number(app.globalData.subSeatsNum)
            }
        }
        if (emresult == true && enresult == true) { //xin
            en_basicarry = that.data.embasicarry
            // en_index = that.data.em_index
        } else {
            en_basicarry = that.data.en_basicarry
            // en_index = that.data.en_index
        }
        if (difference_flag) {
            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i].dishes_id == dishes.dishes_id) {
                    cartList[i].u_item_number = cartList[i].item_number
                    if (cartList[index4].dishes_status == 99 && orderDetail[index4].dishes_status == 5) {
                        cartList[i].u_em_id = cartList[i].u_em_id
                    } else {
                        cartList[i].u_em_id = cartList[i].em_basicarry
                    }
                    // 更新订单em_id调换标志，用于order页面的ensurepay方法，
                    cartList[i].switch_emid_flag = 1
                }
            }
        }
        console.log(em_index)
        console.log(em_basicarry)
        if (em_index != undefined) {
            var em_result = em_index.every(function (item, index, array) {
                return item != -1
            })
        }
        if (en_index != undefined) {
            var en_result = en_index.every(function (item, index, array) {
                return item != -1
            })
        }
        // 全鱼还是部位？
        if (en_result == true || em_result == true) {
            var result = true;
        } else {
            var result = false;
        }

        if (!result) {
            wx.showToast({
                title: '请选择所有部位的做法',
                icon: 'loading',
                duration: 2000,
            })
        } else if (inputvalue > 0 && inputvalue1 > 0 && inputvalue1 > inputvalue && result) {
            var sum = 0;
            var remark = ""
            if (that.data.remark != undefined && that.data.remark != "") {
                remark = that.data.remark
            }

            remark = remarkJS.joinRemarkStr(that.data.quickRemark, dishes.remark);

            that.save_remark(dishes);
            if (that.data.selecthowtodo_flag) {
                em_basicarry = 0
            } else {
                cookway = ""
            }

            // 修改购物车当前菜品的信息
            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i].dishes_id == dishes.dishes_id) {
                    console.log(typeof (cartList[i]))
                    cartList[i].sum = sum;
                    cartList[i].disher_weight = inputvalue;
                    cartList[i].disher_weight_ceiling = inputvalue1;
                    cartList[i].item_number = inputvalue + ',' + inputvalue1;
                    cartList[i].em_basicarry = em_basicarry;
                    cartList[i].em_index = em_index;
                    cartList[i].en_basicarry = en_basicarry;
                    cartList[i].en_index = en_index;
                    if (difference_flag) {
                        // 先将dishes_status置99，标识称重的菜品是在下单的时候更换成10
                        cartList[i].dishes_status = 99;

                    }

                }
            }
            var sumMonney = 0;
            for (var j = 0; j < cartList.length; j++) {
                sumMonney += Number(Number(cartList[j].sum * Number(copyOrder)).toFixed(2));
            }

            if (that.data.showCartflag) {
                var showCart = true;
            } else {
                var showCart = false;
            }

            if (that.data.isQuery) {
                that.setData({
                    queryData: ''
                })
            }

            that.setData({
                cartList: cartList,
                en_index: en_index,
                sumMonney: sumMonney,
                showModalStatus1: false,
                showModalStatus2: false,
                showModalStatus5: false,
                selectInfovv_flag: false,
                showCart: showCart
            })

        }
        // app.globalData.cartList = cartList;
        // app.globalData.cupNumber = cupNumber;
        // app.globalData.sumMonney = sumMonney;
    },

    //加单规格+配菜的菜
    addToCart5: function (e) {
        var that = this
        var dishes = that.data.dishes
        //获取当前单规格+配菜数组
        var List = that.data.SideDishList
        let dishes_sum = dishes.dishes_price
        var remark = ''
        var sideDisht = ''
        let copyOrder = 1
        var menu = that.data.menu
        var food = menu[e.currentTarget.dataset.index]
        console.log(food)
        console.log(e)
        console.log(menu)
        for (var i = 0; i < List.length; i++) {
            if (List[i].checked) {
                if (List[i].orderDetailedSum) {
                    dishes_sum += Number(List[i].orderDetailedSum)
                }
                sideDisht = sideDisht + List[i].ID + '-' + List[i].orderDetailedNum + ','
            }
        }


        that.difference(); //计算时间差
        var countarry = that.data.countarry //计菜品组数量
        // num和p为计数器
        if (that.data.remark != '') {
            remark = that.data.remark
        } else {
            if (!dishes.remark) {
                remark = ''
            } else {
                remark = dishes.remark
            }
        }

        remark = remarkJS.joinRemarkStr(that.data.quickRemark, dishes.remark);

        that.save_remark(dishes);
        //判断时间（即判断出单前出单后）
        var difference_flag = that.data.difference_flag;
        if (dishes.dishes_statu == 3 || dishes.dishes_statu == 0) {} else {
            var num = 0;
            var p;
            var difference_flag = that.data.difference_flag;
            if (difference_flag && that.data.locationindex == 3) {
                var item_type = 2;
            } else {
                var item_type = 0;
                if (Number(app.globalData.subSeatsNum) > 1) {
                    copyOrder = Number(app.globalData.subSeatsNum)
                }
            }
            console.log(sideDisht)
            //出单前将菜品————订单信息取出
            var addItem = {
                "name": dishes.dishes_name,
                "price": dishes.dishes_price,
                "dishes_price": dishes.dishes_price,
                "number": 1,
                "sum": dishes_sum,
                "img_url": dishes.dishes_img,
                "big_img_url": dishes.big_dishes_img,
                "dishes_id": dishes.dishes_id,
                "spec_name": "默认",
                "spec_type": dishes.dishes_metering_type,
                "dishes_spec_type": dishes.spec_type, //是否多规格
                "disher_weight": 0,
                "specal_type": dishes.specal_type,
                "weighing": dishes.weighing,
                "dishes_introduce": dishes.dishes_introduce,
                "remark": remark,
                "decdishes_flag": 1, //1为此为减菜前点的商品，不能改动
                "adddishes_flag": 0, //1为此为加菜前点的商品，不能改
                "dishes_status": 0,
                "u_item_number": 0,
                "item_type": item_type,
                "SideDishList": List,
                "sideDisht": sideDisht,
                "tastes": that.data.tastes,
                "tastesRemark": that.data.tastesRemark,
                "hadOrdered": false,
                "freeOrder": 0,
                "repairOrder": 0,
                "copyOrder": copyOrder,
                "waitOrder": 0,
                "baleOrder": 0,
                "transferOrder": 0,
                "depositOrder": 0,
                "jointSet": '',
                "vip_price": dishes.vip_price ? dishes.vip_price : 0,
                "inline_price": dishes.inline_price ? dishes.inline_price : 0,
                "inline_price_commission": dishes.inline_price_commission ? dishes.inline_price_commission : 0
            }
            var count = {
                "dishes_id": addItem.dishes_id,
                "countname": addItem.name,
                "countnum": addItem.number,
                "countprice": addItem.sum
            }
            if (countarry == undefined || countarry.length == 0) {
                countarry = []
                countarry.push(count)
            } else {
                for (var z = 0; z < countarry.length; z++) {
                    if (countarry[z].countname == count.countname) {
                        countarry[z].countnum += count.countnum
                        countarry[z].countprice = (Number(countarry[z].countprice) + Number(count.countprice)).toFixed(2);
                        break
                    } else {
                        if (z == countarry.length - 1) {
                            countarry.push(count)
                            break
                        }
                    }
                }
            }
            that.setData({
                countarry: countarry
            }, function () {})
            //计算小计
            var sumMonney = Number(that.data.sumMonney) + Number(Number(addItem.sum * Number(copyOrder)).toFixed(2))
            sumMonney = parseFloat(sumMonney.toFixed(2))
            var cartList = that.data.cartList;
            cartList.push(addItem);
            that.setData({
                cartList: cartList,
                sumMonney: sumMonney,
                cupNumber: that.data.cupNumber + Number(copyOrder),
                tastes: "",
                tastesRemark: "",
                remark: "",
                showModalStatus4: false, //关闭弹窗
                quickRemark: ''
            })

            //全局购物车列表
            app.globalData.cartList = cartList;
            app.globalData.cupNumber = that.data.cupNumber;
            app.globalData.sumMonney = sumMonney;
        }
    },
    chooseDishes: function () {
        //选择的修改的菜
        let that = this;
        that.setData({
            showChooseDishesModel: !that.data.showChooseDishesModel
        })
    },
    chooseChangeDishes: function (e) {
        var that = this;
        console.log(e)
        //获取选的是第几个，标记放入全局，修改的时候对放入对应菜中
        that.setData({
            showChooseDishesModel: false,
            chooseDishesIndex: e.currentTarget.dataset.index
        })
    },
    addToCart6: function (e) {
        // 单规格称重，把详情选择的数据放入到指定的菜里面
        var that = this;
        let newList = that.data.newList //同名菜的数组，如果大于1，则说明有多个同名菜
        let chooseDishesIndex = that.data.chooseDishesIndex //newList选中菜的下标
        let dishes = []
        var remark = ''
        let chooseBol = false
        let cartList = that.data.cartList
        let sumMonney = that.data.sumMonney
        let weightarry = that.data.weightarry

        if (chooseDishesIndex == -1 && chooseBol) {
            // 需要选菜但是没有选，默认是最新的那个
            chooseDishesIndex = newList.length - 1
        }

        if (newList.length > 1) {
            chooseBol = true //需要选菜
            dishes = newList[chooseDishesIndex]
        } else {
            dishes = newList[0]
        }
        //配菜处理
        let dishes_sum = 0
        var List = that.data.SideDishList
        var sideDisht = '';

        for (var i = 0; i < List.length; i++) {
            if (List[i].checked) {
                if (List[i].orderDetailedSum) {
                    dishes_sum += Number(List[i].orderDetailedSum)
                }
                sideDisht = sideDisht + List[i].ID + '-' + List[i].orderDetailedNum + ','
            }
        }

        dishes.SideDishList = List
        dishes.sideDisht = sideDisht
        dishes.sum = Number((Number(dishes.dishes_price) * Number(dishes.disher_weight) + dishes_sum).toFixed(2))
        //备注处理
        if (that.data.remark != '') {
            remark = that.data.remark
        } else {
            if (!dishes.remark) {
                remark = ''
            } else {
                remark = dishes.remark
            }
        }

        remark = remarkJS.joinRemarkStr(that.data.quickRemark, dishes.remark);

        dishes.remark = remark;
        dishes.tastes = that.data.tastes
        if (chooseBol) {
            //有重复的菜
            let n = 0;
            for (let m = 0; m < cartList.length; m++) {
                if (cartList[m].dishes_id == dishes.dishes_id) {
                    if (n == chooseDishesIndex) {
                        sumMonney = sumMonney - cartList[m].sum + dishes.sum
                        cartList[m] = dishes
                        break;
                    } else {
                        n++ //保证是相同的菜中，选的那一个
                    }
                }
            }
        } else {
            //没有重复的菜，直接放回到cartList
            for (let m = 0; m < cartList.length; m++) {
                if (cartList[m].dishes_id == dishes.dishes_id) {
                    sumMonney = sumMonney - cartList[m].sum + dishes.sum
                    cartList[m] = dishes
                    break;
                }
            }
        }
        for (var t of weightarry) {
            if (t.dishes_id == dishes.dishes_id) {
                //减去斤数*金额，加上总金额
                if (t.sideDishesSum) {
                    t.sideDishesSum = t.sideDishesSum - Number(((Number(dishes.dishes_price) * Number(dishes.disher_weight))).toFixed(2)) + dishes.sum
                } else {
                    t.sideDishesSum = dishes.sum
                }
            }
        }
        //最后的回显和清除数据
        that.setData({
            cartList: cartList,
            sumMonney: sumMonney,
            weightarry: weightarry
        })
        that.closeWindow();
    },

    //展示购物车的清单
    showCartList: function () {
        console.log(this.data.menuList)
        console.log(this.data.cartList)
        var that = this;
        console.log(that.data.cartList.length)
        if (that.data.cartList.length != 0) {
            that.setData({
                showCart: !that.data.showCart,
            })
        }
    },

    //清空购物车（如果点加菜进入该页面，原本已点的菜品不会清空）
    clearCartList: function (e) {
        var that = this
        var menu_cartList = that.data.menu_cartList
        var cartList = that.data.cartList
        var addtobuyarry = []
        var menu = that.data.menu
        for (i = 0; i < menu.length; i++) {
            menu[i].countNum = 0
        }
        if (that.data.locationindex != undefined && that.data.locationindex != 'undefined') {
            var sum = 0
            var num = 0
            //此为保留清空购物车的商品的方法（加菜）
            for (var i = 0; i < menu_cartList.length; i++) {
                sum += menu_cartList[i].sum
                num += Number(menu_cartList[i].number)
            }
            that.setData({
                cartList: menu_cartList,
                countarry: [],
                weightarry: [],
                showCart: false,
                sumMonney: sum,
                cupNumber: num,
                addtobuyarry: []
            })
        } else {
            that.setData({
                cartList: [],
                countarry: [],
                weightarry: [],
                showCart: false,
                sumMonney: 0,
                cupNumber: 0,
            })
        }
    },

    //增加购物车里的商品
    addNumber: function (e) {
        var that = this
        var index = e.currentTarget.dataset.index;
        var cartList = that.data.cartList;
        var countarry = that.data.countarry
        var orderDetail = that.data.orderDetail

        //在原基础上允许原菜单上加菜
        if (!that.data.difference_flag || (that.data.difference_flag && cartList[index].adddishes_flag == 0) || (that.data.difference_flag && cartList[index].adddishes_flag == 1)) {
            cartList[index].number++;
            console.log("cartList[index].number-----------" + cartList[index].number)
            var sum = Number(that.data.sumMonney) + Number(cartList[index].price);
            cartList[index].sum = Number(cartList[index].sum) + Number(cartList[index].price);
            for (var i = 0; i < countarry.length; i++) {
                if (countarry[i].countname == cartList[index].name) {
                    Number(countarry[i].countnum++);
                    countarry[i].countprice = Number(countarry[i].countprice) + Number(cartList[index].price)
                }
            }
            var item = {
                "id": cartList[index].id,
                "name": cartList[index].name,
                "price": cartList[index].price,
                "dishes_price": cartList[index].dishes_price,
                "number": 1,
                "sum": cartList[index].price,
                "img_url": cartList[index].img_url,
                "dishes_id": cartList[index].dishes_id,
                "spec_name": "默认",
                // "spec_name": cartList[index].spec_name,
                "spec_type": cartList[index].spec_type,
                "dishes_spec_type": cartList[index].dishes_spec_type,
                "disher_weight": 0,
                "specal_type": cartList[index].specal_type,
                "weighing": cartList[index].weighing,
                "remark": cartList[index].remark,
                "dishes_introduce": cartList[index].dishes_introduce,
                "adddishes_flag": cartList[index].adddishes_flag, //1为此为加菜前点的商品，不能改动
                "afterAddDishNum": cartList[index].afterAddDishNum,
                "afterAddDishflag": 0,
                "addnum_init": cartList[index].addnum_init,
                "dishes_status": 0,
                "vip_price": cartList[index].vip_price ? cartList[index].vip_price : 0,
                "inline_price": cartList[index].inline_price ? cartList[index].inline_price : 0,
            }
            that.addtobuy(item)

            that.setData({
                cartList: cartList,
                sumMonney: sum,
                cupNumber: that.data.cupNumber + 1,
                countarry: countarry
            });
        }
    },

    // 取消按钮
    decCancel: function (e) {
        var that = this;
        var index = e.currentTarget.dataset.index;
        var cartList = that.data.cartList;
        cartList[index].number = 1;
        that.reducedishesnum(e);

    },

    //将备注存入全局变量
    remarks: function (e) {
        console.log(e.detail.value)
        this.setData({
            remark: e.detail.value
        })

    },

    // 组件备注返回
    remarkBack: function (event) {
        var that = this;
        this.data.currentDishesModel.remark = event.detail.remarkText;
        if (that.data.dishes.spec_type == 1 && that.data.choosedishesSpecIndex != -1) {
            var eatMethodArray = that.data.eatMethodArray;
            eatMethodArray[that.data.choosedishesSpecIndex].remark = event.detail.remarkText;
        } else if (that.data.dishes.spec_type == 10 && (that.data.eatMethodArray.length >= 1 && that.data.eamChoose != -1)) {
            var eatMethodArray = that.data.eatMethodArray;
            eatMethodArray[that.data.eamChoose].remark = event.detail.remarkText;
        }
        this.setData({
            remark: event.detail.remarkText
        })
    },

    //将备注放到指定菜品里面
    save_remark(e) {
        var that = this;
        var dishes
        var cartList = that.data.cartList
        // if(cartList.spec_type == 100){
        //   cartList.remark == 
        // }
        dishes = this.data.menuList[this.data.c1Idx].class1s[this.data.c2Idx].class2[this.data.c3Idx].dishesInfs[this.data.dishesIndex]
        // var menu = that.data.menu
        var dishesIndex = that.data.dishesIndex
        //2020-11-20 备注重写
        dishes.remark = remarkJS.joinRemarkStr(that.data.quickRemark, that.data.remark);
        dishes.tastes = that.data.tastes
        for (var i = 0; i < cartList.length; i++) {
            if (cartList[i].dishes_id == dishes.dishes_id) {
                cartList[i].remark = dishes.remark
                cartList[i].tastes = dishes.tastes
                break;
            }
        }

        that.setData({
            [`menuList[${this.data.c1Idx}].class1s[${this.data.c2Idx}].class2[${this.data.c3Idx}].dishesInfs[${this.data.dishesIndex}].remark`]: dishes.remark,
            [`menuList[${this.data.c1Idx}].class1s[${this.data.c2Idx}].class2[${this.data.c3Idx}].dishesInfs[${this.data.dishesIndex}].tastes`]: dishes.tastes,
            [`menuList[${this.data.c1Idx}].class1s[${this.data.c2Idx}].class2[${this.data.c3Idx}].dishesInfs[${this.data.dishesIndex}].tastes`]: dishes.tastesRemark,
            cartList: cartList,
            showModalStatus: false,
            showModalStatus1: false,
            showModalStatus2: false,
            showModalStatus5: false,
            showModalStatus4: false,
            showModalStatus6: false,
            remark: '',
            tastes: "",
            tastesRemark: "",
            quickRemark: ''
        })
    },

    // 菜篮子在确定之前随意取消
    cancelWindiow: function (e) {
        var that = this
        wx.showModal({
            title: '温馨提示',
            content: '是否确定要取消',
            cancelText: "否",
            confirmText: "是",
            success: function (res) {
                if (res.confirm) {
                    that.cancelBtn(e);
                    that.cancelweighing(e)
                }
                if (res.cancel) {

                }
            }
        })
    },

    //茶位按人头加上去
    addHead: function (e) {
        var that = this
        that.difference(); //计算时间差
        var countarry = that.data.countarry //计菜品组数量
        var orderDetail = that.data.orderDetail
        // num和p为计数器
        //通过e.currentTarget.dataset.index找到对应菜品
        var dishes = that.data.menu[e.currentTarget.dataset.index]
        if (!dishes.remark) {
            dishes.remark = ''
        }
        //判断时间（即判断出单前出单后）
        var difference_flag = that.data.difference_flag;
        var ordertype = that.data.ordertype //是否加餐或者点餐状态


        var num = 0;
        var p;
        var difference_flag = that.data.difference_flag;
        if (difference_flag && that.data.locationindex == 3) {
            var item_type = 2;
        } else {
            var item_type = 0;
        }
        //出单前将菜品————订单信息取出
        var addItem = {
            "name": dishes.dishes_name,
            "price": dishes.dishes_price,
            "dishes_price": dishes.dishes_price,
            "number": Number(app.globalData.userNum),
            "sum": dishes.dishes_price * Number(app.globalData.userNum),
            "img_url": dishes.dishes_img,
            "big_img_url": dishes.big_dishes_img,
            "dishes_id": dishes.dishes_id,
            "spec_name": "默认",
            "spec_type": dishes.dishes_metering_type,
            "dishes_spec_type": dishes.spec_type, //是否多规格
            "disher_weight": 0,
            "specal_type": dishes.specal_type,
            "weighing": dishes.weighing,
            "dishes_introduce": dishes.dishes_introduce,
            "remark": dishes.remark,
            "decdishes_flag": 1, //1为此为减菜前点的商品，不能改动
            "adddishes_flag": 0, //1为此为加菜前点的商品，不能改
            "dishes_status": 0,
            "u_item_number": 0,
            "item_type": item_type,
            "sideDisht": '',
            "tastes": '',
            "hadOrdered": false,
            "freeOrder": 0,
            "repairOrder": 0,
            "copyOrder": 1,
            "waitOrder": 0,
            "baleOrder": 0,
            "transferOrder": 0,
            "depositOrder": 0,
            "jointSet": '',
            "vip_price": dishes.vip_price ? dishes.vip_price : 0,
            "inline_price": dishes.inline_price ? dishes.inline_price : 0,
            "inline_price_commission": dishes.inline_price_commission ? dishes.inline_price_commission : 0
        }
        var count = {
            "dishes_id": addItem.dishes_id,
            "countname": addItem.name,
            "countnum": addItem.number,
            "countprice": addItem.sum
        }
        if (countarry == undefined || countarry.length == 0) {
            countarry = []
            countarry.push(count)
        } else {
            for (var z = 0; z < countarry.length; z++) {
                if (countarry[z].countname == count.countname) {
                    countarry[z].countnum += count.countnum
                    countarry[z].countprice = parseFloat((Number(countarry[z].countprice) + Number(count.countprice)).toFixed(2));
                    break
                } else {
                    if (z == countarry.length - 1) {
                        countarry.push(count)
                        break
                    }
                }
            }
        }
        that.setData({
            countarry: countarry
        }, function () {})
        //计算小计
        var sumMonney = Number(that.data.sumMonney) + Number(dishes.dishes_price * Number(app.globalData.userNum));
        sumMonney = parseFloat(sumMonney.toFixed(2))
        var cartList = that.data.cartList;
        if (cartList.length == 0 || cartList == undefined) {
            cartList.push(addItem);
        } else {
            //判断菜品是否已经加入cartList
            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i].dishes_id != addItem.dishes_id) {
                    num++
                } else {
                    p = i;
                }
            }
            //未加入
            if (num == cartList.length) {
                cartList.push(addItem);
                // 加购
                that.addtobuy(addItem);
            } else {
                //已加入
                if (!that.data.difference_flag) {
                    cartList[p].number = Number(cartList[p].number) + Number(app.globalData.userNum);
                    cartList[p].sum = parseFloat((Number(cartList[p].sum) + Number(cartList[p].price) * Number(app.globalData.userNum)).toFixed(2));
                    cartList[p].remark = dishes.remark
                } else {
                    if (cartList[p].adddishes_flag == addItem.adddishes_flag) {
                        cartList[p].number = Number(cartList[p].number) + Number(app.globalData.userNum);
                        cartList[p].sum = parseFloat((Number(cartList[p].sum) + Number(cartList[p].price) * Number(app.globalData.userNum)).toFixed(2));
                        cartList[p].remark = dishes.remark
                    } else {
                        cartList.push(addItem);
                    }
                }
            }
        }
        that.setData({
            cartList: cartList,
            sumMonney: sumMonney,
            cupNumber: Number(that.data.cupNumber) + Number(app.globalData.userNum),
        })
        //全局购物车列表
        app.globalData.cartList = cartList;
        app.globalData.cupNumber = that.data.cupNumber;
        app.globalData.sumMonney = sumMonney;
        // }
    },

    //茶位按用餐人数调整
    addHeadMultiple: function (e) {
        var that = this
        var orderDetail = that.data.orderDetail
        var difference_flag = that.data.difference_flag;
        var i = e.currentTarget.dataset.index
        var dishesSpecArry = that.data.dishesSpecArry
        if (orderDetail == undefined) {
            dishesSpecArry[i].number = Number(app.globalData.userNum);
            that.setData({
                dishesSpecArry: dishesSpecArry
            })
        } else {
            for (var j = 0; j < orderDetail.length; j++) {
                if (orderDetail[j].dishes_id == dishesSpecArry[i].dishes_id && difference_flag) {
                    var notadd = true
                }
            }
            if (dishesSpecArry[i].number < 99 && difference_flag && notadd) {
                dishesSpecArry[i].number = Number(app.globalData.userNum)
                that.setData({
                    dishesSpecArry: dishesSpecArry
                })
            } else {
                dishesSpecArry[i].number = Number(app.globalData.userNum);
                that.setData({
                    dishesSpecArry: dishesSpecArry
                })
            }
        }

    },

    cancelBtn: function (e) {
        var that = this
        var dishes = that.data.dishes
        var item = e.currentTarget.dataset.item
        var weightarry = that.data.weightarry

        // 判断是否超过1份相同的鱼，如果两份以上减少之后显多规格
        for (var k = 0; k < weightarry.length; k++) {
            if (weightarry[k].number > 1) {
                for (var i = 0; i < that.data.menu.length; i++) {
                    if (dishes.dishes_id == that.data.menu[i].dishes_id) {
                        // DGG_off=0 标识选规格的按钮是灰色
                        dishes["DGG_off"] = 0;
                        console.log(dishes);
                        var arr = []
                        arr.push(dishes);
                        that.data.menu[i] = arr[0];
                        that.setData({
                            menu: that.data.menu
                        })
                        console.log(that.data.menu);
                    }
                }
            }
        }
    },
    //在右侧菜单中删除相对应的菜品
    cancelweighing: function (e) {
        var that = this
        var dishes = that.data.dishes
        var item = e.currentTarget.dataset.item
        var cartList = that.data.cartList
        var weightarry = that.data.weightarry
        var cupNumber = that.data.cupNumber
        var sumMonney = that.data.sumMonney
        var dishes_sum = 0
        var dishes_number = 0
        var thisorderarry = that.data.thisorderarry
        var delectif = false;

        for (var i = cartList.length - 1; i >= 0; i--) {
            if (cartList[i].dishes_id == item.dishes_id && (cartList[i].adddishes_flag == 0 || !(thisorderarry) || thisorderarry.order_status == '待确认')) {
                sumMonney -= parseFloat(Number(cartList[i].sum).toFixed(2))
                if (cartList[i].dishes_spec_type == 4) {
                    cupNumber -= Number(cartList[i].item_number.split(',')[0])
                } else {
                    cupNumber--
                }
                cartList.splice(i, 1)
                for (var n = 0; n < weightarry.length; n++) {
                    if (weightarry[n].dishes_id == item.dishes_id) {
                        weightarry.splice(n, 1)
                    }
                }
                delectif = true;
            }
        }
        if (!delectif) {
            wx.showModal({
                title: '温馨提示',
                content: '此处不能取消该菜品',
                confirmText: "是",
            })
        }
        that.setData({
            cartList: cartList,
            weightarry: weightarry,
            sumMonney: sumMonney,
            cupNumber: cupNumber,
            showModalStatus: false
        })
    },


    //到确认点餐\下单页面  (到提交页面)
    goBalance_new_new_new: function (e) {
        if (this.data.is_join_platform == 0) {
            wx.showModal({
                title: '提示',
                content: '该商铺还未入驻本平台',
            })
        } else {
            if (this.data.processing && !this.data.xuanhaole) {
                wx.showToast({
                    title: '加载中，三秒后重试',
                    icon: 'none'
                })
                return;
            }
            this.setData({
                xuanhaole: false
            })
            wx.showLoading({
                title: '提交中'
            })
            wx.setStorageSync('menuList', JSON.stringify(this.data.cartList))

            var that = this
            var content

            that.setData({
                processing: false,
                processing_orderid: '',
            });
            if (that.data.cartList.length > 0) {
                app.globalData.cartList = that.data.cartList
                app.globalData.sumMonney = that.data.sumMonney
                app.globalData.cupNumber = that.data.cupNumber
                if (that.data.locationindex == 3) {
                    app.globalData.cartList = that.data.cartList
                    app.globalData.sumMonney = that.data.sumMonney
                    app.globalData.cupNumber = that.data.cupNumber
                    wx.navigateTo({
                        url: '/pages/module_discount/pages/ordersdetail/ordersdetail?'+ (that.data.fromYuDing ? 'fromYuDing=true&' : '') +'detailsType=' + 2 + '&orderid=' + that.data.orderid + '&firstIssue=' + that.data.firstIssue + '&locationid=' + that.data.locationid + '&isFromCartImg=' + e.currentTarget.dataset.isfromcartimg
                    })

                } else if (that.data.locationindex == 4) {
                    app.globalData.cartList = that.data.cartList
                    app.globalData.sumMonney = that.data.sumMonney
                    app.globalData.cupNumber = that.data.cupNumber
                    wx.navigateTo({
                        url: '/pages/module_discount/pages/ordersdetail/ordersdetail?'+ (that.data.fromYuDing ? 'fromYuDing=true&' : '') +'detailsType=' + 4 + '&orderid=' + that.data.orderid + '&firstIssue=' + that.data.firstIssue + '&locationid=' + that.data.locationid + '&isFromCartImg=' + e.currentTarget.dataset.isfromcartimg
                    })

                } else if (this.data.isHadOrder) {
                    wx.navigateTo({
                        url: '/pages/module_discount/pages/ordersdetail/ordersdetail?'+ (that.data.fromYuDing ? 'fromYuDing=true&' : '') +'detailsType=' + this.data.detailsType + '&orderid=' + this.data.orderid + '&firstIssue=' + this.data.firstIssue + '&locationid=' + that.data.locationid + '&isFromCartImg=' + e.currentTarget.dataset.isfromcartimg
                    })
                } else {
                    if(that.data.fromYuDing){
                        let cartList = that.data.cartList
                        let isReturn = 0
                        for (let x of cartList) {
                            if(x.spec_type == 100 || x.spec_type == 101){
                                isReturn = 1
                            }
                        }
                        if(isReturn == 0){
                            wx.showModal({
                                title: '提示',
                                content: '请选择预订套餐或菜品',
                                showCancel: false
                            })
                            wx.hideLoading({
                              success: (res) => {},
                            })
                            return;
                        }
                    }
                    wx.navigateTo({
                        url: '/pages/module_discount/pages/ordersdetail/ordersdetail?'+ (that.data.fromYuDing ? 'fromYuDing=true&' : '') +'detailsType=' + 1 + '&locationid=' + that.data.locationid + '&isFromCartImg=' + e.currentTarget.dataset.isfromcartimg
                    })
                }
            } else {
                console.log("购物车为空，无法跳转")
            }
            wx.hideLoading()
        }
    },


    //显示菜品介绍的弹框
    showIntroduction: function () {
        this.setData({
            showIntroduction: !this.data.showIntroduction
        })
    },

    // 究极份数和金额矫正接口
    //加入加购标识
    addtobuy: function (res) {
        console.log('addtobuy方法开始执行');
        var that = this
        if (that.data.locationindex == 3) {
            var addtobuyarry = that.data.addtobuyarry
            if (addtobuyarry.length == 0) {
                addtobuyarry.push(JSON.parse(JSON.stringify(res)))
            } else {
                var num = 0
                for (var i = 0; i < addtobuyarry.length; i++) {
                    if (addtobuyarry[i].dishes_id == res.dishes_id && addtobuyarry[i].price == res.price) {
                        if (res.dishes_spec_type == 1) {
                            //处于单规格的菜品，如果有重复的菜品，则替换数量，而不是增加新

                            addtobuyarry[i].sum == res.sum
                            addtobuyarry[i].number == Number(res.number)
                        } else {
                            addtobuyarry[i].sum += res.sum
                            addtobuyarry[i].number += Number(res.number)
                        }
                        break
                    } else {
                        num++
                        if (num == addtobuyarry.length) {
                            addtobuyarry.push(JSON.parse(JSON.stringify(res)))
                            break
                        }
                    }
                }
            }
            that.setData({
                addtobuyarry: addtobuyarry
            })
        }
        console.log('addtobuy方法执行完毕');
    },
    // 报错弹框
    ErrFunction: function (msg) {
        //执行失败操作
        var that = this;
        //弹出模态框
        if (!that.data.errorModal) {
            //先修改判断值,防止多个弹框
            that.setData({
                errorModal: true
            })
            //当前没有模态框显示
            wx.showModal({
                title: '错误',
                content: msg,
                confirmText: "重试",
                success(res) {
                    if (res.confirm) {
                        console.log('用户点击确定')
                    } else if (res.cancel) {
                        console.log('用户点击取消')

                    }
                }
            })
            //
        } else {
            // 当前已触发模态框的显示,不需要重复触发
            console.log("已有重复的弹框")
        }
    },

    //计算时间差
    difference() {
        var that = this;
        var difference_flag
        //是否在禁止修改的时间内 difference_flag = true 不允许修改
        app.globalData.preorder_starus == 1 ? difference_flag = true : difference_flag = false
        that.setData({
            difference_flag: difference_flag
        })
    },

    // 显示缺少菜品页面
    showlack: function () {
        this.setData({
            showlack: !this.data.showlack
        })
    },

    //去首页
    goindex: function () {
        wx.reLaunch({
            url: '/pages/index/index',
        })
    },

    compare: function (property, bol) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            if (bol) {
                return value1 - value2;
            } else {
                return value2 - value1;
            }
        }
    },
    video_play: function (e) {
        var that = this;
        console.log(e)
        if (e.currentTarget.dataset.src != '') {
            console.log("播放视频")
            that.setData({
                video_open: true,
                video_src: e.currentTarget.dataset.src,
                video_name: e.currentTarget.dataset.video_name
            })
        }
    },

    formsubmit: function (e) { //设置form方法,获取输入的预定金额
        //单规格称重菜品加入购物车 
        var that = this
        // var weight_money1 = e.detail.value.weight_money1;  //因为要两个框合成一个框
        var weight_money1 = e.detail.value.weight_money2;
        var weight_money2 = e.detail.value.weight_money2;
        that.difference(); //计算时间差
        var countarry = that.data.countarry //计菜品组数量
        var orderDetail = that.data.orderDetail
        // num和p为计数器
        //通过e.currentTarget.dataset.index找到对应菜品
        var dishes = that.data.menu[e.detail.target.dataset.index]
        var difference_flag = that.data.difference_flag;
        if (dishes.dishes_statu == 3 || dishes.dishes_statu == 0) {} else {
            var num = 0;
            var p;
            var difference_flag = that.data.difference_flag;
            if (difference_flag && that.data.locationindex == 3) {
                var item_type = 2;
            } else {
                var item_type = 0;
            }
            if (weight_money1 > 0 && weight_money2 > 0) {
                //出单前将菜品————订单信息取出
                
                var addItem = {
                    "id": 0,
                    "name": dishes.dishes_name, //菜品名称
                    "price": 0, //菜品金额
                    "dishes_price": dishes.dishes_price,
                    "number": 1,
                    "sum": parseFloat(Number(dishes.dishes_price) * Number(weight_money1)), //菜品总价,膳食掌柜因为是部长下的单，所以直接就写好重量就行    可能后面要在这里加上多做法的加收金额
                    "img_url": dishes.dishes_img, //菜品图片
                    "big_img_url": dishes.big_dishes_img, //菜品大图片
                    "dishes_id": dishes.dishes_id, //菜品id
                    "spec_name": "称重",
                    "spec_type": dishes.dishes_metering_type, //计量单位
                    "dishes_spec_type": dishes.spec_type, //规格类型
                    // "disher_weight": 1,//是否称重
                    "specal_type": dishes.specal_type, //菜品类型
                    "weighing": dishes.weighing,
                    "remark": that.data.remark, //客人备注
                    "dishes_introduce": dishes.dishes_introduce,
                    "decdishes_flag": 1, //1为此为减菜前点的商品，不能改动
                    "adddishes_flag": 0, //1为此为加菜前点的商品，不能改
                    "dishes_status": 0, //菜品状态
                    "u_item_number": 0, //修改后的小计
                    "operator": app.globalData.loginname,
                    "operation_time": util.formatTime(new Date()),
                    "item_type": item_type, //点餐-0、退餐--1、加菜-2、修改-3
                    "disher_weight": weight_money1,
                    "disher_weight_ceiling": weight_money2,
                    "item_number": weight_money1 + ',' + weight_money2,
                    "dishes_status": 5,
                    "dishes_index": 1, //这个可以标识区分同名菜品
                    "sideDisht": '',
                    "tastes": '',
                    "hadOrdered": false,
                    "freeOrder": 0,
                    "repairOrder": 0,
                    "copyOrder": 1,
                    "waitOrder": 0,
                    "baleOrder": 0,
                    "transferOrder": 0,
                    "depositOrder": 0,
                    "jointSet": '',
                    "vip_price": dishes.vip_price ? dishes.vip_price : 0,
                    "inline_price": dishes.inline_price ? dishes.inline_price : 0,
                    "inline_price_commission": dishes.inline_price_commission ? dishes.inline_price_commission : 0
                }
                console.log(addItem)
                //计算小计
                var sumMonney = Number(that.data.sumMonney) + Number(addItem.sum);
                sumMonney = parseFloat(sumMonney.toFixed(2))
                var cartList = that.data.cartList;
                if (cartList.length == 0 || cartList == undefined) {
                    cartList.push(addItem);
                } else {
                    //判断菜品是否已经加入cartList
                    for (var i = 0; i < cartList.length; i++) {
                        if (cartList[i].dishes_id != addItem.dishes_id) {
                            num++
                        } else {
                            p = i;
                        }
                    }
                    //未加入
                    // if (num == cartList.length) {
                    cartList.push(addItem);
                    // 加购
                    that.addtobuy(addItem);
                    // }
                    //已加入
                }

                var count = {
                    "dishes_id": addItem.dishes_id,
                    "countname": addItem.name,
                    "countnum": addItem.number,
                    "countprice": addItem.sum
                }
                console.log(count)
                if (countarry == undefined || countarry.length == 0) {
                    countarry = []
                    countarry.push(count)
                } else {
                    for (var z = 0; z < countarry.length; z++) {
                        if (countarry[z].countname == count.countname) {
                            countarry[z].countnum += count.countnum
                            countarry[z].countprice += count.countprice
                            break
                        } else {
                            if (z == countarry.length - 1) {
                                countarry.push(count)
                                break
                            }
                        }
                    }
                }

                var weightarry = that.data.weightarry //设置下单时候的样式变更
                var weightitem = {
                    "id": 0,
                    "name": dishes.dishes_name,
                    "dishes_id": dishes.dishes_id,
                    "dishes_price": addItem.dishes_price,
                    "sum": Number(addItem.sum),
                    "weight": weight_money1,
                    "weight_ceiling": weight_money2,
                    "number": 1,
                    "dishes_metering_type": dishes.dishes_metering_type,
                    "operator": app.globalData.loginname,
                    "operation_time": util.formatTime(new Date()),
                    "sideDishesSum": Number(addItem.sum),
                    "vip_price": addItem.vip_price ? addItem.vip_price : 0,
                    "inline_price": addItem.inline_price ? addItem.inline_price : 0,
                }
                // that.updateMenu()
                if (weightarry.length == 0) {
                    weightarry.push(weightitem)
                } else {
                    if (!that.data.changeweightdishes_flag) {
                        for (var i = 0; i < weightarry.length; i++) {
                            console.log(weightarry[i].dishes_id == weightitem.dishes_id)
                            if (weightarry[i].dishes_id == weightitem.dishes_id) {
                                weightarry[i].weight = Number(weightitem.weight) + Number(weightarry[i].weight)
                                weightarry[i].sum += Number(weightitem.sum)
                                weightarry[i].sideDishesSum += Number(weightitem.sideDishesSum)
                                weightarry[i].number += weightitem.number
                                break
                            }
                            if (i == weightarry.length - 1 && weightarry[i].dishes_id != weightitem.dishes_id) {
                                weightarry.push(weightitem)
                                break
                            }
                        }
                    } else {
                        for (var i = 0; i < weightarry.length; i++) {
                            if (weightarry[i].dishes_id == weightitem.dishes_id && weightarry[i].weight == weightitem.weight) {
                                weightarry[i].weight = weightitem.weight
                                weightarry[i].sum = Number(weightitem.sum)
                            }
                        }
                    }
                }

                that.setData({
                    cartList: cartList,
                    sumMonney: sumMonney,
                    cupNumber: that.data.cupNumber + 1,
                    countarry: countarry,
                    weightarry: weightarry
                })
            } else if (weight_money1 > weight_money2) {
                wx.showToast({
                    title: '请输入正确的重量',
                    icon: 'loading',
                    duration: 2000,
                })
            } else if (weight_money1 <= 0 || weight_money2 <= 0) {
                wx.showToast({
                    title: '请输入菜品重量',
                    icon: 'none',
                    duration: 2000,
                })
            }

            //全局购物车列表
            app.globalData.cartList = cartList;
            app.globalData.cupNumber = that.data.cupNumber;
            app.globalData.sumMonney = sumMonney;
        }
        // }
    },

    load_countarry: function (order_id) {
        var that = this;
        var cartList = app.globalData.cartList;
        var countarry = []
        var weightarry = []
        var menu = that.data.menu
        if (cartList.length > 0) {
            for (var i = 0; i < cartList.length; i++) {
                if (cartList[i].weighing == 0 || cartList[i].dishes_spec_type == 6) {
                    var count = {
                        "dishes_id": cartList[i].dishes_id,
                        "countname": cartList[i].name,
                        "countnum": Number(cartList[i].number),
                        "countprice": cartList[i].sum,
                        "tempNumber": cartList[i].tempNumber ? cartList[i].tempNumber : cartList[i].number
                    }
                    if (cartList[i].item_type == 2) {
                        count.addItem = true
                    }
                    countarry.push(count) //xin
                    if (i == cartList.length - 1) {
                        var resultArr = [];
                        countarry = countarry.sort(that.compare('dishes_id', true))
                        var sum = 0;
                        var num = 0;
                        var resultArr = [];
                        resultArr[0] = countarry[0];
                        var tempDishesId = countarry[0].dishes_id;

                        for (var z = 1; z < countarry.length; z++) {
                            if (tempDishesId == countarry[z].dishes_id) {
                                sum = Number(resultArr[num].countnum)
                                if (countarry[z].tempNumber > 0) {
                                    sum += Number(countarry[z].tempNumber)
                                } else {
                                    sum += Number(countarry[z].countnum)
                                }
                                resultArr[num].countnum = sum
                                resultArr[num].tempNumber = Number((Number(resultArr[num].tempNumber) + Number(countarry[z].tempNumber)).toFixed(2))
                                resultArr[num].countprice = Number((Number(resultArr[num].countprice) + Number(countarry[z].countprice)).toFixed(2))
                            } else {
                                num++;
                                resultArr[num] = countarry[z]
                                tempDishesId = countarry[z].dishes_id
                            }
                        }
                        countarry = resultArr
                    }
                } else if (cartList[i].weighing == 1) {
                    var number = 1;
                    if (cartList[i].dishes_spec_type == 4) {
                        number = Number(cartList[i].item_number.split(',')[0])
                    } else if (cartList[i].dishes_spec_type == 10) {
                        number = cartList[i].measurement_value
                    } else if (cartList[i].dishes_spec_type == 8) {
                        //2020-11-28 来料加工
                        if (cartList[i].em_index != null && cartList[i].en_index != null) {
                            number = Number(cartList[i].em_index.length + cartList[i].en_index.length);
                        } else {
                            number = Number(cartList[i].item_number.split(',')[0])
                        }
                    }
                    var weightitem = {
                        "id": cartList[i].id,
                        "name": cartList[i].name,
                        "dishes_id": cartList[i].dishes_id,
                        "dishes_price": cartList[i].dishes_price,
                        "sum": Number(cartList[i].sum),
                        "weight": cartList[i].disher_weight,
                        "weight_ceiling": cartList[i].disher_weight_ceiling,
                        "number": number,
                        "dishes_metering_type": cartList[i].spec_type,
                        "vip_price": cartList[i].vip_price ? cartList[i].vip_price : 0,
                        "inline_price": cartList[i].inline_price ? cartList[i].inline_price : 0,
                    }

                    if (cartList[i].item_type == 2) {
                        weightitem.addItem = true
                    }
                    if (cartList[i].dishes_spec_type == 5) {
                        weightitem.operator = cartList[i].operator
                        weightitem.operation_time = cartList[i].operation_time
                    }
                    // that.updateMenu()
                    if (weightarry.length == 0) {
                        weightarry.push(weightitem)
                    } else {
                        for (var j = 0; j < weightarry.length; j++) {
                            if (weightarry[j].dishes_id == weightitem.dishes_id) {
                                weightarry[j].weight = Number(weightitem.weight) + Number(weightarry[j].weight)
                                weightarry[j].sum += Number(weightitem.sum)
                                weightarry[j].number += weightitem.number
                                break;
                            }
                            if (j == weightarry.length - 1 && weightarry[j].dishes_id != weightitem.dishes_id) {
                                weightarry.push(weightitem)
                                break;
                            }
                        }
                    }
                }
                // 回显菜单的备注和口味
                if (cartList[i].dishes_spec_type == 0 || cartList[i].dishes_spec_type == 1) {
                    if (cartList[i].remark != '' || cartList[i].tastes != '') {
                        for (var x = 0; x < that.data.menu.length; x++) {
                            if (menu[x].dishes_id == cartList[i].dishes_id) {
                                menu[x].remark = cartList[i].remark
                                menu[x].tastes = cartList[i].tastes
                            }
                        }
                    }
                }

                if (i == cartList.length - 1) {
                    wx.hideLoading()
                    break;
                }
            }
            that.setData({
                menu: menu,
                weightarry: weightarry,
                countarry: countarry,
                showCart: false
            })
            that.echoDishes()
        } else {
            that.setData({
                weightarry: [],
                countarry: [],
                showCart: false
            })
        }
    },

    sumPosition: function () {
        var that = this;
        var em_basicarry = that.data.em_basicarry;
        var en_basicarry = that.data.en_basicarry;
        var whole = that.data.whole;
        var parts = that.data.parts;
        var sum_position = 0;
        console.log(em_basicarry)
        console.log(en_basicarry)

        if (em_basicarry.length) {
            for (var i = 0; i < em_basicarry.length; i++) {
                if (em_basicarry[i] != -1) {
                    sum_position += Number(em_basicarry[i].money)
                }
            }
        }
        if (en_basicarry) {
            for (var i = 0; i < en_basicarry.length; i++) {
                if (en_basicarry[i] != -1) {
                    sum_position += Number(en_basicarry[i].money)
                }
            }
        }
        that.setData({
            sum_position: sum_position
        })

    },
    //选配菜 旧，逐渐替换组件
    checkboxChange: function (e) {
        var that = this;
        const items = that.data.SideDishList
        const values = e.detail.value
        for (let i = 0, lenI = items.length; i < lenI; ++i) {
            items[i].checked = false
            for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
                if (items[i].sideDishName === values[j]) {
                    items[i].checked = true
                    break
                }
            }
        }
        that.setData({
            SideDishList: items
        })
    },
    // 获取配菜组件，并保存
    saveSideDishList: function (event) {
        this.setData({
            SideDishList: event.detail
        })
    },

    // 常用口味选择
    chooseTaste: function () {
        var that = this
        var dishes = this.data.dishes
        var em_index = that.data.em_index
        var en_index = that.data.en_index
        if (!that.data.showTaste) {
            console.log("打开口味")
            if (dishes.spec_type == 10 && en_index.length == 0 && em_index.length == 0) {
                wx.showToast({
                    title: '请选择做法',
                    icon: 'none',
                    duration: 2000,
                })
            }
            //2020-11-13 多拼粥食材
            // else if (this.data.dishes.spec_type == 9 && this.data.porridgeObject.selName == "请选择") {
            else if ((this.data.dishes.spec_type == 9 || this.data.dishes.spec_type == 91) && this.data.porridgeObject.selName == "请选择") {
                wx.showToast({
                    title: '请选择食材',
                    icon: 'none',
                    duration: 2000,
                })
            } else if (that.data.eatMethodArray.length > 1 && !(that.data.eamChoose || that.data.eamChoose != -1)) {
                wx.showToast({
                    title: '请选择菜品',
                    icon: 'none',
                    duration: 2000,
                })
            } else {
                var tastes = ''
                var tasteList = app.globalData.remark_taste
                for (var x = 0; x < tasteList.length; x++) {
                    tasteList[x].checked = false
                }
                if (that.data.tastes != '' && that.data.tastes != null) {
                    tastes = that.data.tastes.split(',')
                    for (var x of tastes) {
                        for (var y = 0; y < tasteList.length; y++) {
                            if (tasteList[y].value === x) {
                                tasteList[y].checked = true
                            }
                        }
                    }
                }
                that.setData({
                    tasteList: tasteList,
                    showTaste: !that.data.showTaste
                })
            }
        } else {
            console.log("关闭口味")
            that.setData({
                showTaste: false
            })
        }
    },

    // 选择常用口味,还要回显到备注框里
    submitTaste: function (event) {
        var tastesRemark = ''
        var that = this
        var dishes = that.data.dishes
        if (event.detail != null && event.detail != '') {
            var tastes = event.detail.split(',')
            for (var x = 0; x < tastes.length; x++) {
                tastes[x] = "[" + tastes[x] + "]"
            }
            tastesRemark = tastes.join(" ")
            console.log("选择的口味：" + tastesRemark)
            this.setData({
                tastes: event.detail,
                tastesRemark: tastesRemark,
                showTaste: !this.data.showTaste
            })
            if (dishes.spec_type == 10) {
                //多规格多做法的情况下，把口味放到
                var eatMethodArray = that.data.eatMethodArray
                let eamChoose = that.data.eamChoose
                eatMethodArray[eamChoose].tastes = event.detail
                eatMethodArray[eamChoose].tastesRemark = tastesRemark
                that.setData({
                    eatMethodArray: eatMethodArray
                })
            }
        } else {
            wx.showToast({
                title: '请选择口味',
                icon: 'none',
                duration: 2000,
                success: function () {}
            })
        }
    },

    chooseMaterial: function () {
        var that = this
        if (!that.data.showMaterial) {
            that.setData({
                showMaterial: !that.data.showMaterial
            })
        } else {
            that.setData({
                showMaterial: !that.data.showMaterial
            })
        }
    },

    closeMaterial: function () {
        var that = this
        that.setData({
            showMaterial: false,
        })
    },

    // 选择常用口味,还要回显到备注框里
    submitMaterial: function (event) {
        console.log("关闭多拼粥材料")
        this.setData({
            porridgeObjectList: event.detail.porridgeObjectList,
            porridgeObject: event.detail.porridgeObject,
            porridgeBackObject: event.detail.porridgeObject,
            showMaterial: !this.data.showMaterial
        })
    },

    //格式化口味，并回显
    formatTaste: function (tastes) {
        var tastesRemark = ''
        if (tastes != '') {
            var taste = tastes.split(',')
            for (var x = 0; x < taste.length; x++) {
                taste[x] = "[" + taste[x] + "]"
            }
            tastesRemark = taste.join(" ")
        }
        console.log("口味：" + tastesRemark)
        this.setData({
            tastes: tastes,
            tastesRemark: tastesRemark
        })
    },

    //格式化配菜，并回显
    formatSideDishList: function (SideDishList) {
        var SideDishList_choose = []
        if (SideDishList) {
            if (SideDishList.length != 0) {
                for (var x of SideDishList) {
                    if (x.checked && x.orderDetailedNum > 0) {
                        SideDishList_choose.push(x)
                    }
                }
            }
        }
        this.setData({
            SideDishList_choose: SideDishList_choose,
            SideDishList: SideDishList
        })
    },

    loadMenu() {
        if (app.globalData.menuList == undefined) {
            app.menucallback = (bool) => {
                if (bool) {

                }
            }
        }
    },

    startVideo() {
        let vList = this.data.videoList;
        let vLen = vList.length; // 播放列表的长度
        let current = this.data.curr

        if (vList[current] == this.data.sVideo) {
            current++
        }

        this.setData({
            sVideo: vList[current],
        })

        this.videoContext.autoplay = 'true'
        this.videoContext.play()

        if (current < vLen - 1) {
            current++
        } else {
            current = 0
        }

        this.setData({
            curr: current
        })
    },
    getAdv() {
        let that = this
        wx.request({
            url: app.globalData.SelectAllDishesAd,
            method: "POST",
            header: {
                'content-type': 'application/x-www-form-urlencoded'
            },
            data: {
                shop_id: app.globalData.shopdetail.shop_id
            },
            success: res => {
                let videoList = [];
                for (let item of res.data.object) {
                    videoList.push(item.dishes_controller)
                }
                app.globalData.videoList = videoList;
                if (res.data.object.length != 0) {
                    that.setData({
                        videoList: videoList,
                        sVideo: videoList[0],
                        showAdv: true
                    })
                }
            }
        })
    },
    getManagementDataServlet(e) {
        var that = this;
        var shop_id = e
        wx.request({
            url: app.globalData.ManagementGetDataServlet_url,
            data: {
                shop_id: shop_id //店铺 id
            },
            success(res) {
                if (res.data.data != null) {
                    that.setData({
                        is_join_platform: 1
                    })
                    app.globalData.managementData = res.data.data
                }
            }
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        console.log("menu  onLoad")
        if (options.fromYuDing) {
            this.setData({
                fromYuDing: true
            })
            this.SelectTicketOrderDetailedWithSetMeal()
        }
        wx.showLoading({
            mask: true,
            title: '稍等'
        })
        if (app.globalData.xdswidth) {
            this.setData({
                xdswidth: app.globalData.xdswidth
            })
        }
        console.log(options);
        this.getManagementDataServlet(app.globalData.shopid)
        let datetd = new Date()
        let weekarr = ["日", "一", "二", "三", "四", "五", "六"]
        this.setData({
            today: weekarr[datetd.getDay()],
            toMenu: options.toMenu,
            checkmenu: options.checkmenu,
            firstlevel: options.first,
            secondlevel: options.second,
            thirdlevel: options.third,
        })

        wx.getStorage({
            key: 'userInfoName',
            success(res) {
                app.globalData.username = res.data
            }
        })
        if (app.globalData.menuList) {
            wx.showLoading({
                mask: true,
                title: '稍等'
            })
            if (app.globalData.menuList[0].class1s[0].class2[0].shop_id != app.globalData.shopid) {
                app.getmenu()

                app.menucallback = (bool) => {
                    if (bool) {
                        this.getLevel(options)
                    }
                }
            } else {
                this.getLevel(options)
            }
        } else {
            if (app.globalData.menuList != undefined && app.globalData.menuList != '') {
                this.setData({
                    menuList: app.globalData.menuList,
                    menu: app.globalData.menuList[this.data.c1Idx].class1s[this.data.c2Idx].class2[this.data.c3Idx].dishesInfs,
                })
                this.getAdv()
            } else {
                app.getmenu()
                app.menucallback = (bool) => {
                    if (bool) {
                        this.setData({
                            menuList: app.globalData.menuList,
                            menu: app.globalData.menuList[this.data.c1Idx].class1s[this.data.c2Idx].class2[this.data.c3Idx].dishesInfs,
                        })
                        this.getAdv()
                    }
                }
            }

        }


        let shop_id = app.globalData.shopdetail.shop_id
        //获取临时菜的单位
        wx.request({
            url: app.globalData.selectUnit,
            data: {
                shop_id
            },
            success(res) {
                app.globalData.unitList = res.data
            }
        })
        this.setData({
            tempShare: app.globalData.tempShare
        })
        var that = this;
        var orderDetail
        var cartList_arr = []
        var username = app.globalData.username
        var cupNumber = app.globalData.cupNumber
        var sumMonney = app.globalData.sumMonney
        var cartList = app.globalData.cartList
        var addtobuyarry = app.globalData.addtobuyarry
        var menu = app.globalData.menu
        var menuList_sort = app.globalData.menu1
        var menuListItem = app.globalData.menuItem
        var pages = that.data.pages
        var thisorderarry
        var topmenuList = []
        var bottommenuList = []
        var rice_boolean = false
        that.difference(); //计算时间差

        // socket
        if (app.globalData.socket_shopId != app.globalData.shopid || app.globalData.isOpenSocket == false) {
            console.log("需要重新连接")
            console.log(app.globalData.socket_shopId);
            console.log(app.globalData.shopid);
            console.log(app.globalData.isOpenSocket);
            // app.initSocket()
        }

        if (options != '') {
            if (options.thisorderarry == undefined) {
                thisorderarry = that.data.thisorderarry
            } else {
                thisorderarry = JSON.parse(options.thisorderarry)
            }
        }
        wx.setNavigationBarTitle({
            title: "菜单列表 [" + app.globalData.shopdetail.shop_name + "]"
        })

        if (thisorderarry != undefined && thisorderarry != '') {
            console.log("获取订单")

            var orderstatus
            if (thisorderarry.order_code) {
                orderstatus = true
            } else {
                orderstatus = false
            }
            that.setData({
                orderstatus: orderstatus,
                thisorderarry: thisorderarry,
                locationid: thisorderarry.table_id || thisorderarry.tableId,
                locationname: thisorderarry.table_name || thisorderarry.tableName,
                userNum: thisorderarry.user_count || thisorderarry.userCount,
                orderid: thisorderarry.order_id || thisorderarry.orderId,
                firstIssue: thisorderarry.firstIssue,
            })
        }

        //2020-12-08 界面高度
        let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
        let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
        console.log(windowHeight * 750 / windowWidth - 330)
        that.setData({
            scroll_height: windowHeight * 750 / windowWidth - 330,
            page_view_height: windowHeight * 750 / windowWidth - 430,
            // topmenuList: topmenuList,
            menuList_sort: menuList_sort,
            quickRemarkList: app.globalData.remark_normal,
            username: username,
            locationindex: options.locationindex,
            addtobuyarry: app.globalData.addtobuyarry,
            s2: 0,
            s3: 0,
            s4: 0,
            levellist: app.globalData.levellist //获取全局权限
        })

        // 点图片进来之后,按照类别id,设置s1~s4
        if (options.ptid && options.ciid) {
            that.goPagePosition(options.ptid, options.ciid)
        }

        //-------------------------------------------------------------------
        //加菜或者复制订单 加菜-3
        if (options.locationindex == 1 || options.locationindex == 2 || options.locationindex == 3) {
            that.difference() //查看时间差
            console.log("直接加菜-全新版本")
            that.getCartListByOrderId_new(options.orderid);

        } else {
            //如果没有数据，就是非加菜状态，
            if (cupNumber == '' || sumMonney == '' || cartList == '' || cupNumber == undefined || sumMonney == undefined || cartList == undefined) {
                that.setData({
                    ordertype: 0,
                    userNum: app.globalData.userNum,
                    locationid: app.globalData.locationid,
                    locationname: app.globalData.locationname
                })
            } else {
                that.setData({
                    cupNumber: cupNumber,
                    sumMonney: sumMonney,
                    cartList: cartList,
                    userNum: app.globalData.userNum,
                    locationid: app.globalData.locationid,
                    locationname: app.globalData.locationname
                })
            }

        }
        wx.hideLoading({
            success: (res) => {},
        })
        
    },

    //直接加菜-全新版本
    //独立出来做一个方法
    getCartListByOrderId_new: function (orderid) {
        var that = this;
        wx.request({
            url: app.globalData.SelectOrderDetailedCartListByOrderId_url,
            // url: "http://192.168.8.7:8081/evaluation/SelectOrderDetailedCartListByOrderIdNew",
            data: {
                order_id: orderid
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
                console.log(res.data)
                if (res.data != '') {
                    var addToBuyArray = res.data.addToBuyArray
                    var newcartList = res.data.cartLists
                    var addtobuyarry = that.data.addtobuyarry
                    var sumMonney = res.data.sumMonney
                    var cupNumber = res.data.cupNumber
                    if (addtobuyarry) {
                        var addtobuyarry2 = JSON.parse(JSON.stringify(addtobuyarry))
                        for (let m = 0; m < addtobuyarry2.length; m++) {
                            newcartList.push(addtobuyarry2[m])
                            sumMonney += Number(addtobuyarry2[m].sum)
                            cupNumber += Number(addtobuyarry2[m].number)
                        }
                    } else {
                        addtobuyarry = []
                    }
                    var cartList = newcartList
                    var weightarry = []
                    var countarry = []
                    var set_meal_array=[];
                    for (var i = 0; i < newcartList.length; i++) {
                        newcartList[i].cancelNumber = parseInt(newcartList[i].cancelNumber)
                        if ((newcartList[i].dishes_spec_type == 10 && newcartList[i].item_type == 1) && newcartList[i].dishes_status != 20) {
                            let q = {
                                id: newcartList[i].id,
                                name: newcartList[i].name,
                                dishes_id: newcartList[i].dishes_id,
                                dishes_price: newcartList[i].dishes_price,
                                sum: newcartList[i].sum,
                                weighing: newcartList[i].weighing,
                                number: newcartList[i].number,
                                disher_weight_ceiling: newcartList[i].disher_weight_ceiling,
                                disher_metering_type: newcartList[i].spec_type
                            }
                            weightarry.push(q)
                            that.setData({
                                weightarry
                            })
                        } else if(
                            (newcartList[i].spec_type==210)&&newcartList[i].dishes_status != 20
                            ){
              
                              var bExists=false;
                              for(var j=0;j<set_meal_array.length;j++){
                                var set_meal_obj=set_meal_array[j];
                                if(set_meal_obj.dishes_id==newcartList[i].dishes_id&&set_meal_obj.spec_type==newcartList[i].dishes_spec_type){
                                  //之前已存在
                                  set_meal_obj.sum=set_meal_obj.sum+newcartList[i].sum;
                                  set_meal_obj.item_number=set_meal_obj.item_number+Number(newcartList[i].number);
                                  bExists=true;
                                  break;
                                }
                              }
                              if(bExists==false){
                                //之前不存在
                                set_meal_array.push({
                                  dishes_id:newcartList[i].dishes_id,
                                  spec_type:newcartList[i].dishes_spec_type,
                                  item_number:Number(newcartList[i].number),
                                  sum:newcartList[i].sum,
                                })
                              }
                              that.setData({
                                set_meal_array:set_meal_array,
                              })             
              
                        }
                        else if (((newcartList[i].weighing == 0) && newcartList[i].item_type == 1) && newcartList[i].dishes_status != 20) {
                            var count = {
                                "dishes_id": cartList[i].dishes_id,
                                "countname": cartList[i].name,
                                "countnum": Number(cartList[i].item_number),
                                "countprice": Number(cartList[i].sum)
                            }
                            countarry.push(count) //xin
                            that.setData({
                                countarry
                            })
                        }
                    }
                    addtobuyarry = addtobuyarry.concat(addToBuyArray)
                    app.globalData.initial_cartList = addToBuyArray
                    app.globalData.cartList = newcartList
                    app.globalData.sumMonney = sumMonney
                    app.globalData.cupNumber = cupNumber
                    console.log("订单份数为:" + cupNumber + ",订单金额为：" + sumMonney)
                    that.setData({
                        ordertype: 1,
                        menu_cartList: newcartList,
                        cartList: newcartList,
                        sumMonney: sumMonney,
                        cupNumber: cupNumber,
                        orderid: orderid,
                        addtobuyarry: addtobuyarry
                    })
                    for (var i = 0; i < cartList.length; i++) {
                        //2020-11-30 时间戳转日期
                        if (typeof (cartList[i].operation_time) == "number") {
                            cartList[i].operation_time = util.formatTime3(cartList[i].operation_time, 'Y-M-D h:m:s.0')
                        }
                        if (cartList[i].hadOrdered) {
                            cartList[i] = that.createEmId(cartList[i]);
                        }

                        if (cartList[i].weighing == 0 && cartList[i].dishes_status != 3 && cartList[i].item_type != 1) {
                            if (cartList[i].dishes_spec_type == 6) {
                                var count = {
                                    "dishes_id": cartList[i].dishes_id,
                                    "countname": cartList[i].name,
                                    "countnum": Number(cartList[i].number.split(',')[0]),
                                    "countprice": cartList[i].sum
                                }
                            } else {
                                var count = {
                                    "dishes_id": cartList[i].dishes_id,
                                    "countname": cartList[i].name,
                                    "countnum": Number(cartList[i].number),
                                    "countprice": cartList[i].sum,

                                    "tempNumber": Number(cartList[i].number)
                                }
                            }
                            countarry.push(count) //xin
                        } else if (cartList[i].weighing == 1 && cartList[i].dishes_status != 9 && cartList[i].item_type != 1) {
                            var nnn = 1
                            if (cartList[i].dishes_spec_type == 10) {
                                nnn = cartList[i].number
                            } else if ((cartList[i].dishes_spec_type == 8 || cartList[i].dishes_spec_type == 2) && cartList[i].hadOrdered) {
                                nnn = cartList[i].item_number
                            } else if ((cartList[i].dishes_spec_type == 8 || cartList[i].dishes_spec_type == 2) && !cartList[i].hadOrdered) {
                                nnn = cartList[i].en_index.length
                            }
                            var weightitem = {
                                "id": cartList[i].id,
                                "name": cartList[i].name,
                                "dishes_id": cartList[i].dishes_id,
                                "dishes_price": cartList[i].dishes_price,
                                "sum": Number(cartList[i].sum),
                                "weight": cartList[i].disher_weight,
                                "weight_ceiling": cartList[i].disher_weight_ceiling,
                                "number": nnn,
                                "dishes_metering_type": cartList[i].spec_type,
                                "vip_price": cartList[i].vip_price ? cartList[i].vip_price : 0,
                                "inline_price": cartList[i].inline_price ? cartList[i].inline_price : 0,
                            }
                            if (cartList[i].item_type == 2) {
                                weightitem.addItem = true
                            }
                            // that.updateMenu()
                            if (weightarry.length == 0) {
                                weightarry.push(weightitem)
                            } else {
                                for (var j = 0; j < weightarry.length; j++) {
                                    if (weightarry[j].dishes_id == weightitem.dishes_id) {
                                        weightarry[j].weight = Number(weightitem.weight) + Number(weightarry[j].weight)
                                        weightarry[j].weight_ceiling = Number(weightitem.weight_ceiling) + Number(weightarry[j].weight_ceiling)
                                        weightarry[j].sum += Number(weightitem.sum)
                                        weightarry[j].number = parseInt(weightitem.number) + parseInt(weightarry[j].number)
                                        break;
                                    }
                                    if (j == weightarry.length - 1 && weightarry[j].dishes_id != weightitem.dishes_id) {
                                        weightarry.push(weightitem)
                                        break;
                                    }
                                }
                            }
                        }
                        //直接加菜的时候，给cartList数组加上ingredientsAmount字段和isWhole字段，isWhole判断是否全部位，ingredientsAmount参考ordersdetail页面，或者看看那个页面有没有数组重构方法
                        if (cartList[i].weighing == 1 && cartList[i].em_id != null && cartList[i].em_id[0].all == 1) {
                            cartList[i].isWhole = true
                        } else if (cartList[i].weighing == 1) {
                            cartList[i].isWhole = false
                            cartList[i].ingredientsAmount = cartList[i].sum
                        }
                        if (i == cartList.length - 1) {
                            countarry = countarry.sort(that.compare('dishes_id', true))
                            if (countarry.length > 0) {
                                var resultArr = [];
                                var sum = 0;
                                var num = 0;
                                resultArr[0] = countarry[0];
                                var tempDishesId = countarry[0].dishes_id;
                                for (var z = 1; z < countarry.length; z++) {
                                    if (tempDishesId == countarry[z].dishes_id) {
                                        sum = Number(resultArr[num].countnum)
                                        // sum += Number(countarry[z].countnum)
                                        resultArr[num].countnum = sum
                                        resultArr[num].countprice += countarry[z].countprice
                                    } else {
                                        num++;
                                        resultArr[num] = countarry[z]
                                        tempDishesId = countarry[z].dishes_id
                                    }
                                }
                            }
                            countarry = resultArr
                            that.setData({
                                weightarry: weightarry,
                                countarry: countarry,
                                showCart: false
                            })
                            that.echoDishes()
                            wx.hideLoading()
                        }
                    }
                    that.setData({
                        cartList: cartList,
                        processing: false,
                    })

                }
            },
            complete: function () {
                wx.hideLoading()
            }
        })
    },

    // 显示配菜组件 确认配菜
    changeBoxNum: function (event) {
        console.log("修改回调")
        var SideDishList = event.detail.SideDishList_choose
        if (SideDishList.length != 0) {
            this.setData({
                SideDishList_choose: SideDishList,
                SideDishList: event.detail.SideDishList,
            })
        } else {
            console.log("没有修改配菜")
        }
    },

    // 判断是否订单中是否已存在订单号
    orderstatustest: function (e) {
        var that = this;
        var thisorderarry = that.data.thisorderarry
        if (thisorderarry.order_code) {
            var orderstatus = true
        } else {
            var orderstatus = false
        }
        that.setData({
            orderstatus: orderstatus
        })
    },
    //分页
    pagehelper: function (pages, arry) {
        var that = this
        console.log("执行分页")
        var menu = that.data.menu
        var itemList = arry
        var count = 0
        for (var i = 0; i < itemList.length; i++) {
            menu.push(itemList[i])
            count++
        }
        var reachbottom = that.data.windowHeight / 100 < menu.length ? true : false
        if (count == 20) {
            that.setData({
                menu: menu,
                showloadmore: true
            })
        } else {
            that.setData({
                menu: menu,
                showloadmore: false,
                reachbottom: reachbottom
            })
        }
        that.echoDishes()
        that.updateMenu()

    },

    // 快捷备注，区分订单和菜品
    quickRemarkConfirm: function (event) {
        var that = this
        var temps = event.detail
        if (temps == '') {
            wx.showToast({
                title: '未选择常用备注！',
                icon: 'none',
                duration: 2000,
            })
        } else {
            var tempArray = temps.split("、")
            var eatMethodArray = that.data.eatMethodArray;
            if (that.data.quickRemarkType == 0) {
                console.log("菜品-快捷备注")
                var quickRemarkList = app.globalData.remark_normal
                if (that.data.dishes.spec_type == 10) {
                    eatMethodArray[that.data.eamChoose].quickRemark = event.detail;
                }
                if (that.data.dishes.spec_type == 1 && that.data.choosedishesSpecIndex != -1) {
                    eatMethodArray[that.data.choosedishesSpecIndex].quickRemark = event.detail;
                }
                that.setData({
                    //remark: remark + temps,
                    quickRemark: event.detail,
                    quickRemarkList: quickRemarkList,
                    showRemarkList: false,
                    eatMethodArray: eatMethodArray
                })
            } else {
                console.log("订单-快捷备注")
                var quickRemarkList = app.globalData.remark_normal
                var Order_remark = that.data.Order_remark
                temps = app.tempArray(Order_remark, tempArray)
                that.setData({
                    Order_remark: Order_remark + temps,
                    quickRemarkList: quickRemarkList,
                    showRemarkList: false
                })
            }
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {
        this.videoContext = wx.createVideoContext('sVideo')
        this.supercall = this.selectComponent("#supercall");
        if (app.globalData.countDown_minister) {
            this.countDown(0)
        } else {
            clearInterval(this.data.timerb);
            this.setData({
                fackyousevencolor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                shineb: true
            })
            this.stopFlash()
            app.globalData.countDown_minister = false
        }
        if (app.globalData.countDown_waiter) {
            this.countDown(1)
        } else {
            clearInterval(this.data.timerf);
            this.setData({
                fackyousevencolor1: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                shinef: true
            })
            this.stopFlash1()
            app.globalData.countDown_waiter = false
        }
    },
    startFlash: function () {
        this.supercall.startFlash()
    },
    stopFlash: function () {
        this.supercall.stopFlash()
    },
    startFlash1: function () {
        this.supercall.startFlash1()
    },
    stopFlash1: function () {
        this.supercall.stopFlash1()
    },
    callBZ: function () {
        let that = this
        if (app.globalData.countDown_minister) {
            wx.showToast({
                title: '已取消呼叫',
                icon: 'success',
                duration: 1000
            })
            clearInterval(that.data.timerb);
            that.setData({
                fackyousevencolor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                shineb: true
            })
            that.stopFlash()
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
                table_id: app.globalData.locationid,
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
                                    fackyousevencolor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                                    shineb: true
                                })
                                that.stopFlash()
                                app.globalData.countDown_minister = false
                                app.globalData.RMQmsg_id = ''
                            }
                        }, 6000)
                    }
                }
            })
        }
    },
    cbz: function () {
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
            table_id: app.globalData.locationid,
            tg: "bz",
            shop_id: app.globalData.shopid,
            back: res => {}
        })
    },
    cfw: function () {
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
            table_id: app.globalData.locationid,
            tg: "fw",
            shop_id: app.globalData.shopid,
            back: res => {}
        })
    },
    callFWY: function () {
        let that = this
        if (app.globalData.countDown_waiter) {
            wx.showToast({
                title: '已取消呼叫',
                icon: 'success',
                duration: 1000
            })
            clearInterval(that.data.timerf);
            that.setData({
                fackyousevencolor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                shinef: true
            })
            that.stopFlash1()
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
                table_id: app.globalData.locationid,
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
                                    fackyousevencolor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                                    shinef: true
                                })
                                that.stopFlash1()
                                app.globalData.countDown_waiter = false
                                app.globalData.RMQmsg_id = ''
                            }
                        }, 6000)
                    }
                }
            })
        }
    },
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {

        console.log("menu  onShow app.globalData.cartList")
        console.log(app.globalData.cartList);
        var that = this
        this.setData({
          is_video_show:app.globalData.is_video_show,
        })

        

        wx.getSystemInfo({
            success: res => {
                console.log(res)
                let b = res.screenHeight - res.safeArea.bottom
                that.setData({
                    marginBottom: b
                })
            }
        })

        if(app.globalData.is_set_meal_return==true){
            app.globalData.is_set_meal_return=false;
            return;
        }


        if(app.globalData.is_set_meal_detail_from_menu==true){
            //设置全局变量，如果是从菜单页进到详情页，则不进行后续逻辑处理，阻止其他逻辑改写数据。
            //本段代码可以去掉
            app.globalData.is_set_meal_detail_from_menu=false;
            return;
        }

        if (app.globalData.tempC3Idx) {
            var e = {
                currentTarget: {
                    dataset: {
                        c3Idx: this.data.c3Idx
                    }
                }
            }
            this.tapClassify3(e)

        }
        //滚动条置顶 判断是不是临时菜新增出来的，是的话滚动
        if (app.globalData.newTemp) {
            wx.pageScrollTo({
                scrollTop: 0
            })
            app.globalData.newTemp = false
        }
        if (app.globalData.dishes_inf != null && app.globalData.dishes_inf.length != 0) {
            // 来料加工的新增菜品显示
            var mmm = this.data.menuList[this.data.c1Idx].class1s[this.data.c2Idx].class2[this.data.c3Idx].dishesInfs
            mmm.unshift(app.globalData.dishes_inf)
            this.setData({
                [`menuList[${this.data.c1Idx}].class1s[${this.data.c2Idx}].class2[${this.data.c3Idx}].dishesInfs`]: mmm
            })
            app.globalData.dishes_inf = []
        }
        var that = this;
        that.getheight()
        // console.log(app.globalData);
        var cupNumber = app.globalData.cupNumber
        var sumMonney = parseFloat(app.globalData.sumMonney)
        var cartList = app.globalData.cartList

        that.showImg()
        that.load_countarry(that.data.orderid);
        that.echoDishes();
        if (that.data.s1 == 7) {
            that.setData({
                temporaryCode: false
            })
        }
        that.setData({
            cupNumber: cupNumber,
            sumMonney: sumMonney,
            cartList: cartList,
            tempShare: app.globalData.tempShareNum
        })
        app.globalData.spcallback = (bool) => {
            if (app.globalData.countDown_minister) {
                wx.showToast({
                    title: '已取消呼叫',
                    icon: 'success',
                    duration: 1000
                })
                clearInterval(that.data.timerb);
                that.setData({
                    fackyousevencolor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                    shineb: true
                })
                that.stopFlash()
                app.globalData.countDown_minister = false
                app.globalData.RMQmsg_id = ''
                return;
            } else if (app.globalData.countDown_waiter) {
                wx.showToast({
                    title: '已取消呼叫',
                    icon: 'success',
                    duration: 1000
                })
                that.setData({
                    shinef: true
                })
                that.stopFlash1()
                app.globalData.countDown_waiter = false
                app.globalData.RMQmsg_id = ''
                return;
            }
        }
        app.globalData.RMQCallBack = (res) => {
            console.log('收到消息', res)
            let msg = res.data
            console.log(msg, "消息内容")
            let a = new Date()
            if (msg.table_id == app.globalData.locationid) {
                if (msg.tg == "bz" && msg.msg_id == app.globalData.RMQmsg_id) {
                    console.log(app.globalData.cbz)
                    clearInterval(app.globalData.cbz)
                    app.globalData.cbz = ''
                    console.log(app.globalData.cbz)
                    if (msg.msg.text == "部长收到") {
                        console.log("bzzzzzzzzzzzzzzzzz");
                        // wx.showToast({
                        //   title: '部长收到',
                        //   icon: 'success',
                        //   duration: 2000
                        // })
                        clearInterval(that.data.timerb);
                        that.setData({
                            fackyousevencolor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                            shineb: true
                        })
                        that.stopFlash()
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
                            fackyousevencolor1: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
                            shinef: true
                        })
                        that.stopFlash1()
                        app.globalData.countDown_waiter = false
                        app.globalData.RMQmsg_id = ''
                    }
                }
            }
        }
    },
    getLevel(options) {
        var that = this
        if (app.globalData.menuList != null) {
            that.setData({
                menuList: app.globalData.menuList,
                haveSale: app.globalData.saleMenu.class1s[0].class2[0].dishesInfs.length > 0 ? true : false
            })

            if (options.fromselect) {
                let menuList = app.globalData.menuList
                for (let i = 0; i < menuList.length; i++) {
                    if (that.data.firstlevel == menuList[i].class_i_id) {
                        that.setData({
                            c1Idx: i
                        });
                        break;
                    }
                };
                let c1Idx = this.data.c1Idx;
                let menuList1 = menuList[c1Idx].class1s;
                for (let i = 0; i < menuList1.length; i++) {
                    if (that.data.secondlevel == menuList1[i].parent_type_id) {
                      that.setData({
                            c2Idx: i
                        });
                        break;
                    }
                };
                let c2Idx = that.data.c2Idx;
                let menuList2 = menuList[c1Idx].class1s[c2Idx].class2
                // for (let i = 0; i < menuList2.length; i++) {
                //     if (this.data.thirdlevel == menuList2[i].subclass_type_id) {
                //         this.setData({
                //             c3Idx: i
                //         });
                //         break;
                //     }
                // }
            }

            let list_new = [];
            for(let item of app.globalData.menuList[that.data.c1Idx].class1s[that.data.c2Idx].class2){
              list_new = list_new.concat(item.dishesInfs);
            }

            that.setData({
                // menu: app.globalData.menuList[this.data.c1Idx].class1s[this.data.c2Idx].class2[this.data.c3Idx].dishesInfs
                menu: list_new
            },()=>{
              that.getAdv();

              that.setData({
                maodian: options.maodian
              }, () => {
                  wx.hideLoading({
                      success: (res) => {},
                  })
              })
            })

            

        } else {
            wx.showToast({
                title: '该店铺尚未添加菜品',
            })
        }
    },

    getEatMethod: function (dishesid) {
        var that = this
        wx.showLoading({
            title: '加载中...',
        })
        WXAPI.selectEatingMethod({
            dishes_id: dishesid
        }).then(function (data) {
            var partsName = []
            var em_arry = []
            var needRemain = false //剩余的数组
            if (data.result.result == 1) {
                console.log("获取吃法成功")
                if (data.object.length != 0) {
                    em_arry = Object.values(data.object)
                    if (em_arry.length > 1) {
                        for (var x = 0; x < em_arry.length; x++) {
                            if ("剩余部位".indexOf(em_arry[x][0].em_name) != -1) {
                                needRemain = true
                            }
                            partsName.push({
                                "em_name": em_arry[x][0].em_name,
                                "checked": false
                            })
                        }
                    }
                }
            } else {
                console.log("获取吃法失败")
            }
            that.setData({
                em_arry: em_arry,
                partsName: partsName,
                needRemain: needRemain
            })
            wx.hideLoading({
                complete: (res) => {},
            })
        }).catch(res => {
            console.log("获取吃法失败")
            console.log(res)
            that.setData({
                em_arry: [],
                partsName: [],
                needRemain: [],
            })
            wx.hideLoading({
                complete: (res) => {},
            })
        })
    },

    // 显示多种做法弹窗
    showMultipleEatMethodView(event) {
        if (!this.data.showMultipleEatMethodView) {
            if (this.data.em_arry.length != 0) {
                console.log(this.data.em_arry)
                this.setData({
                    showMultipleEatMethodView: !this.data.showMultipleEatMethodView,

                })
            }
        } else {
            this.setData({
                showMultipleEatMethodView: !this.data.showMultipleEatMethodView
            })
        }
        //this.selectComponent('#s-multipleEatMethodView').temp();
    },

    showMultipleEatAndSpecView(event) {
        if (!this.data.showMultipleEatAndSpecView) {
            if (this.data.em_arry.length != 0) {
                this.setData({
                    showMultipleEatAndSpecView: !this.data.showMultipleEatAndSpecView
                })
            } else {

            }
        } else {
            this.setData({
                showMultipleEatAndSpecView: !this.data.showMultipleEatAndSpecView
            })
        }
    },

    dmev: function (event) {
        var that = this
        console.log(event)
        that.setData({
            eatMethodArray: event.detail
        })
        //更新总金额和数量
        that.addEASSum()
    },
    //确认做法 
    submitEatMethod: function (event) {
        var that = this
        let eatMethodArray = that.data.eatMethodArray
        if (event.detail.result == 0) {
            console.log("未选择做法")
            wx.showToast({
                icon: 'none',
                title: '请选择做法！',
                duration: 3000
            })
        } else if (event.detail.result == 2) {
            console.log("未选择剩余部位")
            wx.showToast({
                icon: 'none',
                title: '请选择剩余部位的做法！',
                duration: 3000
            })
        } else if (event.detail.result == 1) {
            console.log("选择成功")
            var dishes = that.data.dishes
            if (event.detail.Type10) {
                dishes.dishes_price = Number(event.detail.eatMethodArray[0].dishesSpec.spec_price)
                let item = event.detail.eatMethodArray[0]
                item.sum = Number((Number(item.Number) * Number(item.dishesSpec.spec_price)).toFixed(2))

                eatMethodArray.push(item)
                if (eatMethodArray.length == 1) {
                    that.setData({
                        eamChoose: 0
                    })
                }
                that.setData({
                    eatMethodArray: eatMethodArray
                })
                that.addEASSum()
            } else {
                that.setData({
                    eatMethodArray: event.detail.eatMethodArray
                })
            }
            this.setData({
                // em_arry: event.detail.eatMethodArray,
                dishes: dishes,
                en_index: event.detail.isWhole ? event.detail.eatMethodArray : [],
                en_basicarry: event.detail.isWhole ? event.detail.eatMethodArray : [],
                em_index: !event.detail.isWhole ? event.detail.eatMethodArray : [],
                em_basicarry: !event.detail.isWhole ? event.detail.eatMethodArray : [],
                showMultipleEatMethodView: false,
                showMultipleEatAndSpecView: false,
            })

            this.showGuigeMoneyAndNumber(1)
        }
    },


    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        clearInterval(this.data.timerb); //让计时器取消定时a
        clearInterval(this.data.timerf); //让计时器取消定时a
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
        let that = this;
        // 2021-8-17修改 他会把我之前存的用户昵称和用户手机清除,会使我重新授权
        // wx.clearStorageSync('menuList')
        // app.closeSocket()
        clearInterval(that.data.timerb); //让计时器取消定时a
        clearInterval(that.data.timerf); //让计时器取消定时a
        if (that.data.locationindex != undefined && that.data.locationindex != 'undefined') {
            app.globalData.cartList = []
            app.globalData.sumMonney = 0
            app.globalData.cupNumber = 0
        } else {
            app.globalData.cartList = that.data.cartList
            app.globalData.sumMonney = that.data.sumMonney
            app.globalData.cupNumber = that.data.cupNumber
        }
        that.stopFlash()
        that.stopFlash1()
        app.globalData.lastShopid = app.globalData.shopid

        if (app.globalData.orderCode) {
            wx.request({
                url: app.globalData.delTableChoose,
                // url: 'http://192.168.8.18:8080/evaluation/delTableChoose',
                data: {
                    shopId: app.globalData.shopid,
                    orderCode: app.globalData.orderCode,
                    tableId: that.data.locationid,
                    bookerId: app.globalData.customerInf.id,
                    bookTime: app.globalData.dinnerTime,
                    bookerType: 0,
                },
                success: res => {
                    console.log(res);
                }
            })

            app.globalData.orderCode = "";
        }
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
        if (this.data.s2 < 0) {
            var pages = this.data.pages + 1
            this.pagehelper(pages)
            this.setData({
                pages: pages
            })
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

    bindtouchend: function (e) {
        this.showImg()
    },

    bindtouchstart: function (e) {
        this.showImg()
    },

    updateMenu: function () {
        console.log("更新菜单")
        var that = this;
        var menu = that.data.menu
        var weightarry = that.data.weightarry
        var s1 = that.data.s1
        var s2 = that.data.s2
        var s3 = that.data.s3
        var menuList = that.data.menuList
        if (weightarry != "") {
            for (var i = 0; i < weightarry.length; i++) {
                for (var j = 0; j < menu.length; j++) {
                    if (menu[j].dishes_id == weightarry[i].dishes_id) {
                        var new_arr = menu[j]
                        new_arr.thisMenuBoolean = 1
                        menu[j] = new_arr
                        break;
                    }
                }
            }
        }
        //多拼粥逻辑处理
        for (var j = 0; j < menu.length; j++) {
            var menuModel = menu[j]
            var poridgeType, poridgeName, poridgeAllPrice, poridgeNum = 1
            if (menuModel.spec_type == '9' || menuModel.spec_type == '91') {
                if (menuModel.spec_type == '9') {
                    // 按份计算
                    poridgeType = menuModel.jointsetNumForOne
                    poridgeAllPrice = menuModel.dishes_price
                } else {
                    // 按食材计算
                    poridgeType = menuModel.jointsetNumForNum
                    menuModel.dishes_price = 0
                    poridgeAllPrice = 0
                }

                switch (poridgeType) {
                    case 2:
                        poridgeName = "双拼粥"
                        break;
                    case 3:
                        poridgeName = "三拼粥"
                        break;
                    case 4:
                        poridgeName = "四拼粥"
                        break;
                    default:
                        poridgeName = "多拼粥"
                        break;
                };
                menuModel.poridgeAllPrice = poridgeAllPrice
                menuModel.poridgeNum = poridgeNum
                menuModel.poridgeName = poridgeName
                menuModel.selName = "请选择"
            }
        }
        // that.showImg()
        // that.setData({
        //   goodModel: goodModel
        // })
    },

    getSideDishes: function (sideDishSetType) {
        var that = this
        if (sideDishSetType > 0 && sideDishSetType != null) {
            //在这里把当前二级类别的配菜查出来SelectSideDish
            WXAPI.getSideDish({
                shop_id: app.globalData.shopdetail.shop_id,
                sideDishSetType: sideDishSetType,
            }).then(function (data) {
                if (data.result.result == 1) {
                    console.log("获取配菜成功")
                    var SideDishList = data.object
                    for (var x = 0; x < SideDishList.length; x++) {
                        SideDishList[x].orderDetailedNum = 0
                        SideDishList[x].orderDetailedSum = 0
                        SideDishList[x].checked = false //2020-11-26 回显
                    }
                    that.setData({
                        SideDishList_choose: [],
                        SideDishList: SideDishList
                    })
                    app.globalData.SideDishList = SideDishList
                } else {
                    console.log("获取配菜失败")
                    that.setData({
                        SideDishList_choose: [],
                        SideDishList: []
                    })
                }
            }).catch(function (err) {
                console.log("获取配菜失败")
                console.log(err.message);
            })
        } else {
            that.setData({
                SideDishList_choose: [],
                SideDishList: []
            })
        }
    },

    // 多拼粥弹窗，组件回调，返回输入的份数
    currentBackGoodModel: function (event) {
        this.data.currentDishesModel = event.detail.currentBackGoodModel;
    },

    // 保存多拼粥cartList
    addToCartMorePoridge: function () {
        var that = this
        var dishes = that.data.currentDishesModel
        var dishesInf = that.data.dishes
        var menu = that.data.menu
        var dishesIndex = that.data.dishesIndex;
        //多拼粥食材的id和num
        var List = that.data.porridgeBackObject.list
        let dishes_sum = parseFloat(dishes.poridgeAllPrice) // 粥的钱
        var jointSetArray = []
        var jointSetString = ''
        var remark = ""
        var tastes = ""
        var tastesRemark = '' // 常用口味显示
        var sideDisht = ""
        var num = 0;
        var SideDishList = [] // 配菜
        var menu = that.data.menu;
        let copyOrder = 1;

        if (dishes.poridgeNum == '' || dishes.poridgeNum == null) {
            wx.showModal({
                content: `数量不能为空，请输入份数。`,
                showCancel: false
            })
            return;
        } else {
            if (dishes.poridgeNum <= 0) {
                wx.showModal({
                    content: `请输入正确份数`,
                    showCancel: false
                })
                return;
            } else {
                if (List) {
                    for (let i = 0; i < List.length; i++) {
                        var porridgeGood = List[i]
                        if (porridgeGood.selectStatus) {
                            // var tempStr = porridgeGood.ID + '-' + porridgeGood.jointSetUnit
                            var tempStr = porridgeGood.ID + '-' + (porridgeGood.foodNum == undefined ? "1" : porridgeGood.foodNum)
                            jointSetArray.push(tempStr)
                            num++
                        }
                    }
                }
                // 判断当前选中的数量是否符合多拼粥,不能大于几拼
                if (num > that.data.porridgeBackObject.currentNum) {
                    wx.showModal({
                        content: `请根据${dishes.poridgeName}，选择对应数量的食材。`,
                        showCancel: false
                    })
                    return;
                }
                if (num == 0) {
                    wx.showModal({
                        content: `请选择至少一种食材。`,
                        showCancel: false
                    })
                    return;
                }

                if (dishes.sideDishes != 0) {
                    var sideDishes_sum = 0
                    if (that.data.SideDishList) {
                        SideDishList = JSON.parse(JSON.stringify(that.data.SideDishList))
                    }
                    for (var i = 0; i < SideDishList.length; i++) {
                        if (SideDishList[i].checked && SideDishList[i].orderDetailedNum > 0) {
                            if (SideDishList[i].orderDetailedSum) {
                                sideDishes_sum += Number(SideDishList[i].orderDetailedSum)
                            }
                            sideDisht = sideDisht + SideDishList[i].ID + '-' + SideDishList[i].orderDetailedNum + ','
                        }
                    }
                    dishes_sum += sideDishes_sum
                }

                if (that.data.remark != undefined && that.data.remark != "" && that.data.remark != null) {
                    remark = that.data.remark
                    dishesInf.remark = that.data.remark

                }
                //2020-11-19 快捷备注重写
                remark = remarkJS.joinRemarkStr(that.data.quickRemark, remark);

                //that.save_remark(dishes);
                if (that.data.tastes != undefined && that.data.tastes != "" && that.data.tastes != null) {
                    tastes = that.data.tastes
                    dishesInf.tastes = that.data.tastes
                }
                if (that.data.tastesRemark != undefined && that.data.tastesRemark != "" && that.data.tastesRemark != null) {
                    tastesRemark = that.data.tastesRemark
                }

                jointSetString = jointSetArray.join(",");

                that.difference(); //计算时间差
                var countarry = that.data.countarry //计菜品组数量
                // num和p为计数器
                if (!dishes.remark) {
                    dishes.remark = ''
                }
                //判断时间（即判断出单前出单后）
                var difference_flag = that.data.difference_flag;
                if (dishes.dishes_statu == 3 || dishes.dishes_statu == 0) {} else {
                    var num = 0;
                    var p;
                    var difference_flag = that.data.difference_flag;
                    if (difference_flag && that.data.locationindex == 3) {
                        var item_type = 2;
                    } else {
                        var item_type = 0;
                        if (Number(app.globalData.subSeatsNum) > 1) {
                            copyOrder = Number(app.globalData.subSeatsNum)
                        }
                    }
                    console.log(jointSetString)
                    //出单前将菜品————订单信息取出
                    //这里的方法是多拼粥自己的，如果是按食材计，则price就是全部食材加起来
                    let price = dishesInf.dishes_price;
                    if (dishes.spec_type == 91) {
                        price = dishes_sum
                    }
                    var addItem = {
                        "name": dishesInf.dishes_name,
                        "price": price,
                        // "dishes_price": price,
                        "dishes_price": dishes.dishes_price,
                        "number": dishes.poridgeNum,
                        "sum": dishes_sum,
                        "img_url": dishesInf.dishes_img,
                        "big_img_url": dishesInf.big_dishes_img,
                        "dishes_id": dishesInf.dishes_id,
                        "spec_name": dishesInf.dishes_metering_type, // "默认"
                        "spec_type": '份',
                        "dishes_spec_type": dishesInf.spec_type, //是否多规格
                        "disher_weight": 0,
                        "specal_type": dishesInf.specal_type,
                        "weighing": dishesInf.weighing,
                        "dishes_introduce": dishesInf.dishes_introduce,
                        "remark": remark,
                        "decdishes_flag": 1, //1为此为减菜前点的商品，不能改动
                        "adddishes_flag": 0, //1为此为加菜前点的商品，不能改
                        "dishes_status": 0,
                        "u_item_number": 0,
                        "item_type": item_type,
                        "jointSet": jointSetString,
                        "sideDisht": sideDisht,
                        "tastes": tastes,
                        "tastesRemark": tastesRemark,
                        "dishes": dishes,
                        "SideDishList": SideDishList,
                        "porridgeObject": that.data.porridgeBackObject,
                        "hadOrdered": false,
                        "freeOrder": 0,
                        "repairOrder": 0,
                        "copyOrder": copyOrder,
                        "waitOrder": 0,
                        "baleOrder": 0,
                        "transferOrder": 0,
                        "depositOrder": 0,
                        "vip_price": dishesInf.vip_price ? dishesInf.vip_price : 0,
                        "inline_price": dishesInf.inline_price ? dishesInf.inline_price : 0,
                    }

                    //计算小计
                    var cartList = that.data.cartList;
                    var cartIndex = -1
                    var sumMonney = Number(that.data.sumMonney)
                    var cupNumber = Number(that.data.cupNumber)

                    // 修改菜品或者是添加菜品，搞不懂为什么要在菜单修改菜品
                    for (var x = 0; x < cartList.length; x++) {
                        if (cartList[x].dishes_id == addItem.dishes_id && !cartList[x].hadOrdered) {
                            //2020-11-13 多拼粥
                            // if (addItem.dishes_spec_type == 9) {
                            if (addItem.dishes_spec_type == 9 || addItem.dishes_spec_type == 91) {
                                // if(cartList[x].jointSet == addItem.jointSet && cartList[x].sideDisht == addItem.sideDisht){
                                //   cartIndex = x
                                // }
                            } else {
                                cartIndex = x
                            }
                        }
                    }
                    if (cartIndex != -1) { //当购物车存在菜品时候
                        sumMonney = sumMonney - Number(((cartList[cartIndex].sum + addItem.sum) * Number(copyOrder)).toFixed(2))
                        cupNumber = cupNumber - Number(((Number(cartList[cartIndex].number) + Number(addItem.number)) * Number(copyOrder)).toFixed(2))
                        cartList[cartIndex] = addItem
                    } else {
                        sumMonney = sumMonney + Number((addItem.sum * Number(copyOrder)).toFixed(2))
                        cupNumber = cupNumber + Number((Number(addItem.number) * Number(copyOrder)).toFixed(2))
                        cartList.push(addItem);
                    }

                    // --------------------------------------------------------------------------------------------------
                    var count = {
                        "dishes_id": addItem.dishes_id,
                        "countname": addItem.name,
                        "countnum": addItem.number,
                        "countprice": addItem.sum,
                        "tempNumber": addItem.tempNumber
                    }
                    //countarry:当前显示已点菜的数组
                    //如果countarry为空,则直接推入数组
                    if (countarry == undefined || countarry.length == 0) {
                        countarry = []
                        countarry.push(count)
                    } else {
                        for (var i = 0; i < countarry.length; i++) {
                            //如果countarry中有同名的菜品,则删除同名的菜品
                            if (countarry[i].dishes_id == count.dishes_id) {
                                //2020-11-16 多拼粥 
                                // if (addItem.dishes_spec_type == 9) {
                                if (addItem.dishes_spec_type == 9 || addItem.dishes_spec_type == 91) {
                                    countarry[i].countnum += count.countnum;
                                    countarry[i].countprice += count.countprice;
                                    break
                                } else {
                                    countarry.splice(i, 1)
                                    //如果替代的菜品数量为0,则不用替代到原菜品上,防止显示bug
                                    if (count.countnum != 0) {
                                        countarry.push(count)
                                    }
                                    break
                                }
                            } else {
                                //如果没有同名的菜品,则把新菜品推入countarry中
                                if (i == countarry.length - 1 && countarry[i].dishes_id != count.dishes_id) {
                                    countarry.push(count)
                                    break
                                }
                            }
                        }
                    }
                    // --------------------------------------------------------------------------------------------------

                    sumMonney = parseFloat(Number(sumMonney).toFixed(2))
                    menu[dishesIndex] = dishesInf
                    that.setData({
                        cartList: cartList,
                        sumMonney: sumMonney,
                        cupNumber: cupNumber,
                        countarry: countarry,
                        show: false, //关闭弹窗
                        lock: false, //多拼粥备注锁定按钮颜色控制
                        remark: "",
                        tastes: "",
                        menu: menu,
                        sideDisht: "",
                        tastesRemark: '', // 常用口味显示
                        porridgeObject: {}, // 多拼粥材料
                        porridgeObjectList: [], // 多拼粥材料,已选
                        porridgeBackObject: {},
                        quickRemark: ''
                    })
                    //全局购物车列表
                    app.globalData.cartList = cartList;
                    app.globalData.cupNumber = that.data.cupNumber;
                    app.globalData.sumMonney = sumMonney;
                }
            }
        }
    },

    //若是从首页图片进来的,设置s1~4,并进行跳转选项方法
    goPagePosition: function (ptid, ciid) {
        var that = this;
        var menuList = that.data.menuList
        var s1 = 0;
        var s2 = 0;
        var name = '';
        console.log(menuList)
        for (var i = 0; i < menuList.length; i++) {
            if (menuList[i].class_i_id == ciid) {
                s1 = i;
                name = menuList[i].mainType
                break;
            }
        }
        for (var a = 0; a < menuList[s1].class1s.length; a++) {
            if (menuList[s1].class1s[a].parent_type_id == ptid) {
                s2 = a;
                break;
            }
        }
        that.setData({
            s1: s1,
            s2: s2,
        })
        // 点图片进来之后,按照类别id,设置s1~s2
        //查询当前两个id的类别信息
        if (s1 != 0) {
            that.setData({
                showsecond: false, //设为false,下面执行selectMenu的时候,会把它! ,从而显示第二类别
            })
            that.selectMenu(name)
        }
        that.selectSecondMenu()
    },

    //设置aaa方法,在防止滚动穿透的同时,让后台不发出警报信息
    aaa() {
        return;
    },

    showImg() {
        return false
        let that = this;
        let menu = that.data.menu
        let height = that.data.windowHeight // 页面的可视高度
        console.log('触发showImg')
        wx.createSelectorQuery().selectAll('.item').boundingClientRect((ret) => {
            ret.forEach((item, index) => {
                if (item.top <= height) { //判断是否在显示范围内
                    menu[index].show = true // 根据下标改变状态
                }
            })
            that.setData({
                menu: menu
            })
        }).exec()

    },



    queryReset: function (e) {
        var that = this
        console.log("触发重置")
        that.setData({
            queryData: '',
            isQuery: false
        })
        that.changemenu()
    },

    queryInput: function (e) {
        this.setData({
            queryData: e.detail.value
        })
        this.query(e.detail.value)
    },

    queryInput1(event) {
        var that = this
        var valueInput = event.detail.value
        clearTimeout(that.data.setInter)
        var setInter = setTimeout(function () {
            console.log('0.5s后再执行执行搜索' + valueInput);
            that.query(valueInput)
        }, 500)
        that.setData({
            queryData: valueInput,
            setInter: setInter
        })
    },


    // 搜索菜品
    query: function (queryData) {
        var that = this
        console.log("搜索菜品：" + queryData)
        // pageNum是当前页数，pageSize是每一页有多少条数据, 获取maxPageNum 所有
        WXAPI.getDishesInfoForSearchName({
            shop_id: app.globalData.shopdetail.shop_id,
            searchName: queryData, //查询字段，中文字，大小写拼音，如果不是全中文字，会把中文字去掉，保留拼音
            pageNum: 1, // 当前页数
            pageSize: 30 // 每页的数据
        }).then(function (data) {
            if (data.result.result == 1) {
                var maxNum = 0 //搜索结果的最大值
                var resultNum = 0 //搜索结果的数量
                if (data.object != '') {
                    maxNum = data.object[0].maxNum
                    resultNum += data.object.length
                    that.setData({
                        menu: data.object,
                        maxNum: maxNum,
                        resultNum: resultNum,
                        isQuery: true
                    })
                    setTimeout(function () {
                        that.echoDishes();
                        that.showImg()
                    }, 500)
                }
            } else {
                console.log("搜索结果为空")
                wx.showToast({
                    icon: 'none',
                    title: '搜索结果为空',
                    duration: 3000
                })
            }
        })
    },

    queryQR: function () { // 扫码点菜
        var that = this
        if (this.data.is_join_platform == 0) {
            wx.showModal({
                title: '提示',
                content: '该商铺还未入驻本平台',
            })
        } else {
            wx.scanCode({
                success(res) {
                    that.sound(); //ATim 12-27
                    // 例子： "shopId=19318&dishesId=170354"
                    wx.request({
                        url: app.globalData.getOneQrUuid,
                        // url: 'http://192.168.8.5:8088/evaluation/getOneQrUuid',
                        // url: 'http://192.168.8.163:8083/evaluation_war/getOneQrUuid',
                        data: {
                            qrUuid: res.result.split('uuid=')[1]
                        },
                        method: 'POST',
                        header: {
                            'content-type': 'application/json' // 默认值
                        },
                        success: res => {
                            console.log(res)
                            var url = res.data.data.miniProgram.split("&");
                            var shopId = url[0].split("=")[1];
                            if (shopId != app.globalData.shopdetail.shop_id) {
                                wx.showToast({
                                    icon: 'none',
                                    title: '不是该店的菜品',
                                    duration: 3000
                                })
                                return
                            }
                            var dishesId = url[1].split("=")[1];
                            console.log("店铺ID：" + shopId + ",菜品ID：" + dishesId)
                            console.log(that.data.menuList)
                            var menuList = that.data.menuList
                            console.log(menuList)
                            //ms[x] cd1x
                            //ms[x].class1s[x] cd2x
                            //ms[x].class1s[x].class2s[x] cd3x
                            //ms[x].class1s[x].class2s[x].dishesInfs[x] cd
                            for (var a = 0; a < menuList.length; a++) {
                                const cd1 = menuList[a].class1s
                                for (var b = 0; b < cd1.length; b++) {
                                    const cd2 = cd1[b].class2
                                    for (var c = 0; c < cd2.length; c++) {
                                        const cd3 = cd2[c].dishesInfs
                                        for (var d = 0; d < cd3.length; d++) {
                                            const cd = cd3[d]
                                            if (cd.dishes_id == dishesId) {
                                                console.log(a)
                                                that.tapClassify1({
                                                    currentTarget: {
                                                        dataset: {
                                                            c1Idx: a
                                                        }
                                                    }
                                                })
                                                that.setData({
                                                    showsecond: true,
                                                })
                                                console.log(b)
                                                that.tapClassify2({
                                                    currentTarget: {
                                                        dataset: {
                                                            c2Idx: b
                                                        }
                                                    }
                                                })
                                                console.log(c)
                                                that.tapClassify3({
                                                    currentTarget: {
                                                        dataset: {
                                                            c3Idx: c
                                                        }
                                                    }
                                                })
                                                console.log(d)
                                                //菜品第 d 个
                                                console.log(cd)
                                                if (cd.spec_type == 2 || cd.spec_type == 8) {
                                                    that.toOrderProcessing({
                                                        currentTarget: {
                                                            dataset: {
                                                                index: d,
                                                                item: cd,
                                                                num: "2"
                                                            }
                                                        }
                                                    })
                                                }
                                                if (cd.spec_type == 10) {
                                                    that.selectInfo_booking_newType10({
                                                        currentTarget: {
                                                            dataset: {
                                                                index: d,
                                                                dishes_statu: cd.dishes_statu,
                                                                dishesid: cd.dishes_id,
                                                                item: cd,
                                                                num: "2",
                                                                dishes_type: cd.spec_type,
                                                                weighing: cd.weighing
                                                            }
                                                        }
                                                    })
                                                }
                                                if (cd.spec_type == 1) {
                                                    that.selectInfo_guige_new({
                                                        currentTarget: {
                                                            dataset: {
                                                                dishes_statu: cd.dishes_statu,
                                                                dishesid: cd.dishes_id,
                                                                index: d,
                                                                item: cd,
                                                                num: "2",
                                                                dishes_type: cd.spec_type,
                                                                weighing: cd.weighing
                                                            }
                                                        }
                                                    })
                                                }
                                                menuList[a].class1s[b].class2[c].dishesInfs[d].scan = true
                                                let menus = that.data.menu
                                                let item = menus.splice(d, 1)
                                                console.log(item)
                                                console.log(menus)
                                                menus.splice(0, 0, item[0])
                                                console.log(menus)
                                                that.setData({
                                                    menu: menus
                                                })
                                                that.setData({
                                                    scrollTop: 0
                                                })
                                                return
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    })
                }
            })
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

    //打开订单详情
    dakaixiangqing: function (dishes) {
        console.log("dakaixiangqing,打开详情");
        var dishesIndex = -1
        var that = this
        for (var x = 0; x < that.data.menu.length; x++) {
            dishesIndex = x;
        }
        if (dishesIndex > -1) {
            if (dishes.spec_type == 0 || dishes.dishes_spec_type == 21 || dishes.dishes_spec_type == 23 || dishes.dishes_spec_type == 25 || dishes.dishes_spec_type == 26 || dishes.dishes_spec_type == 27) { // 单规格
                console.log("打开单规格详情");
                var shrinkIntrIntroduction = false
                var showModalStatus4 = that.data.showModalStatus4; // 显示标志
                if (dishes.tastes != undefined && dishes.tastes != null) {
                    that.formatTaste(dishes.tastes)
                }
                if (dishes.remark != undefined && dishes.remark != null) {
                    that.setData({
                        remark: dishes.remark,
                    })
                }
                if (dishes.sideDishes != 0) { //不等于0的时候视为存在配菜，并且值为配菜二级类别
                    that.getSideDishes(dishes.sideDishes)
                    shrinkIntrIntroduction = true
                }
                that.setData({
                    dishes: dishes,
                    shrinkIntrIntroduction: shrinkIntrIntroduction,
                    goodsIntroduce: dishes.dishes_introduce,
                    showCartflag: false,
                    // showModalStatus4: !showModalStatus4,
                    dishesIndex: dishesIndex
                })
            } else if (dishes.spec_type == 10) { // 来料加工
                // that.toOrderProcessing_1(dishes)


                var shrinkIntrIntroduction = false // 是否缩小菜品介绍框
                var remark = ''
                var tastes = ''
                var tastesRemark = ''
                var eatMethodArray = []
                if (dishes.sideDishes != 0) {
                    shrinkIntrIntroduction = true
                    that.getSideDishes(dishes.sideDishes)
                }
                if (dishes != undefined) {
                    var dishes_statu = dishes.dishes_statu;
                    if (dishes_statu == 2) {
                        let promise = new Promise(function (resolve, reject) {
                            that.getEatMethod(dishes.dishes_id)
                            that.selectEatmethodAndSpec(dishes.dishes_id)

                            that.setData({
                                showModalStatus5: !that.data.showModalStatus5,
                                showModalStatus1: false,
                                eatMethodArrayNumber: 0,
                                eatMethodArraySum: 0
                            })
                            resolve()
                        });
                        promise.then(function (res) {
                            that.showMultipleEatMethodView()
                        })
                        that.setData({
                            dishes: dishes,
                            remark: remark,
                            tastes: tastes,
                            eatMethodArray: eatMethodArray,
                            tastesRemark: tastesRemark,
                            shrinkIntrIntroduction: shrinkIntrIntroduction,
                            goodsIntroduce: dishes.dishes_introduce,
                        })
                    }
                } else {
                    that.setData({
                        changeweightdishes_flag: false,
                        showModalStatus1: false,
                        inputvalue: "",
                        inputvalue1: "",
                        quickRemark: ''
                    })
                }


            } else if (dishes.spec_type != 6 && dishes.weighing == 1) { // 多做法

                that.toOrderProcessing_1(dishes)

            } else {
                console.log("打开多规格菜品详情");
                wx.showLoading({
                    title: '加载中...',
                })
                var shrinkIntrIntroduction = false; //是否缩小菜品介绍
                var cartList = that.data.cartList;
                var difference_flag = that.data.difference_flag
                var SideDishList = []
                var num = 1
                var agreenopen = true

                if (dishes != undefined) {
                    var spec_type = dishes.spec_type;
                    if (spec_type == 1 && dishes.sideDishes != 0) {
                        for (var x of that.data.cartList) {
                            if (x.dishes_id == dishes.dishes_id) { // 当村子的时候
                                num = 2
                                agreenopen = false
                            }
                        }
                    }
                    if (!agreenopen) {
                        wx.showToast({
                            icon: 'none',
                            title: '该键此刻不能操作,如需添加请点击"+"',
                            duration: 3000
                        })
                    } else {
                        if (dishes.sideDishes != 0 || spec_type != 0) { //是否缩小菜品介绍
                            shrinkIntrIntroduction = true
                        }
                        if (dishes.sideDishes != 0) { //不等于0的时候视为存在配菜，并且值为配菜二级类别
                            that.getSideDishes(dishes.sideDishes)
                        }
                        if (dishes.tastes) {
                            that.formatTaste(dishes.tastes)
                        }
                        let promise = new Promise(function (resolve, reject) {
                            var selectInfo_guigeflag = false;
                            if (cartList.length > 0) {
                                cartList.map(food => {
                                    if (food.dishes_id == dishes.dishes_id && (food.adddishes_flag == 0 || difference_flag == false)) {
                                        // 已点选规格菜品，要显示之前的多规格菜品
                                        selectInfo_guigeflag = true;
                                    }
                                })
                            }
                            resolve({
                                data: {
                                    "that": that,
                                    "selectInfo_guigeflag": selectInfo_guigeflag,
                                    "dishes": dishes
                                }
                            });
                        });
                        promise.then(function (res) {
                            var that = res.data["that"]
                            console.log("是否已存在菜：" + res.data["selectInfo_guigeflag"])
                            if (!res.data["selectInfo_guigeflag"]) {
                                // 未点选规格菜品，直接显示空的值
                                console.log("不存在")
                                that.selectInfo_guige1(res.data["dishes"]);
                            } else {
                                if (dishes.spec_type == 1 && num == 1 && dishes.sideDishes != 0) {
                                    console.log("存在?不存在的")
                                    that.selectInfo_guige1(res.data["dishes"]);
                                } else {
                                    console.log("存在")
                                    that.selectInfo_guige2(e);
                                }
                            }

                            that.setData({
                                goodsIntroduce: dishes.dishes_introduce,
                                dishesIndex: dishesIndex,
                                dishes: dishes,
                                SideDishList: SideDishList,
                                shrinkIntrIntroduction: shrinkIntrIntroduction,
                                remark: dishes.remark
                            })
                        });
                        wx.hideLoading()
                    }

                } else {
                    that.setData({
                        changeweightdishes_flag: false,
                        showModalStatus1: false,
                        showModalStatus2: false,
                        showModalStatus5: false,
                        showModalStatus: false,
                        showModalStatus3: false,
                        show: false,
                        cookwayindex: -1,
                        cookway: "",
                        inputvalue: "",
                        inputvalue1: ""
                    })
                    wx.hideLoading()
                }

            }
        }
    },

    hideModal: function (e) {
        var that = this
        that.setData({
            showRemarkList: false,
            quickRemarkList: app.globalData.remark_normal,
            showOrderList: false,
            listOrderList: [],
            xuanzezhege: -1
        })
    },

    // 部长确认
    showRemarkList: function (e) {
        var that = this
        var quickRemarkList = that.data.quickRemarkList
        for (var x = 0; x < quickRemarkList.length; x++) {
            quickRemarkList[x].checked = false
        }
        if (!that.data.showRemarkList) {
            var remark = e.currentTarget.dataset.type == 1 ? that.data.Order_remark : that.data.remark
            if (remark) {
                for (var x = 0; x < quickRemarkList.length; x++) {
                    if (remark.indexOf(quickRemarkList[x].value) != -1) {
                        quickRemarkList[x].checked = true
                    }
                }
            }
        }
        that.setData({
            showRemarkList: !that.data.showRemarkList,
            quickRemarkList: quickRemarkList,
            quickRemarkType: e.currentTarget.dataset.type ? e.currentTarget.dataset.type : 0,
            remark_index: []
        })
    },

    //2020-11-19 新快捷备注方法
    showRemarkList_new: function (e) {
        var that = this
        var quickRemarkList = that.data.quickRemarkList
        for (var x = 0; x < quickRemarkList.length; x++) {
            quickRemarkList[x].checked = false
        }
        if (!that.data.showRemarkList) {
            var remark = e.currentTarget.dataset.type == 1 ? that.data.Order_remark : that.data.quickRemark
            for (var x = 0; x < quickRemarkList.length; x++) {
                if (remark.indexOf(quickRemarkList[x].value) != -1) {
                    quickRemarkList[x].checked = true
                }
            }
        }
        that.setData({
            showRemarkList: !that.data.showRemarkList,
            quickRemarkList: quickRemarkList,
            quickRemarkType: e.currentTarget.dataset.type ? e.currentTarget.dataset.type : 0,
            remark_index: []
        })
    },

    // 快捷备注多选
    quickRemark: function (e) {
        var that = this
        var quickRemarkList = that.data.quickRemarkList
        quickRemarkList[e.currentTarget.dataset.remark_index].checked = !quickRemarkList[e.currentTarget.dataset.remark_index].checked
        that.setData({
            quickRemarkList: quickRemarkList
        })
    },

    // 显示选择配菜组件
    showpeicai: function (e) {
        var that = this
        if (this.data.SideDishList || this.data.SideDishList.length != 0) {
            //2020-11-13 多拼粥未选择食材，不能打开配菜 
            // if (this.data.dishes.spec_type == 9 && this.data.porridgeObject.selName == "请选择") {
            if ((this.data.dishes.spec_type == 9 || this.data.dishes.spec_type == 91) && this.data.porridgeObject.selName == "请选择") {
                wx.showToast({
                    title: '请选择食材',
                    icon: 'none',
                    duration: 2000,
                })
            } else if ((that.data.eatMethodArray.length > 1 && that.data.eamChoose == -1)) {
                wx.showToast({
                    title: '请选择菜品',
                    icon: 'none',
                    duration: 2000,
                })
            } else {

                this.setData({
                    showpeicai: !this.data.showpeicai
                })
                this.selectComponent('#sideDishList_peicai').init();
                console.log("showpeicai")
            }
        } else {
            wx.showToast({
                icon: 'none',
                title: '没有获取到配菜',
                duration: 3000
            })
            this.getSideDishes(dishes.sideDishes)
        }
    },
    // 显示配菜组件 确认配菜
    submitSideDish: function (event) {
        let that = this
        console.log(event.detail)
        var SideDishList = event.detail.SideDishList_choose
        var dishes = that.data.dishes
        if (SideDishList.length != 0) {
            // if (dishes.spec_type == 9) {
            if (dishes.spec_type == 9 || dishes.spec_type == 91) {
                var dpzpeicai = {
                    dishes: dishes,
                    dishes_id: dishes.dishes_id,
                    SideDishList_choose: SideDishList,
                    SideDishList: event.detail.SideDishList,
                }
                app.globalData.dpzpeicai.push(dpzpeicai)
            }
            if (dishes.spec_type == 10) {
                //多规格多做法的时候，就把配菜放入到指定的菜中
                let eatMethodArray = that.data.eatMethodArray
                let eamChoose = that.data.eamChoose
                eatMethodArray[eamChoose].SideDishList_choose = SideDishList
                eatMethodArray[eamChoose].SideDishList = event.detail.SideDishList
                that.setData({
                    eatMethodArray: eatMethodArray,
                    SideDishList_choose: SideDishList,
                    SideDishList: event.detail.SideDishList,
                    showpeicai: false
                })
            } else {
                this.setData({
                    SideDishList_choose: SideDishList,
                    SideDishList: event.detail.SideDishList,
                    showpeicai: false
                })
                if (this.data.dishes.spec_type == 4 || this.data.dishes.spec_type == 2) {
                    //2020-12-09 增加称重多做法选择配菜
                    this.showGuigeMoneyAndNumber(1)
                } else {
                    this.showGuigeMoneyAndNumber(0)
                }
            }
        } else {
            wx.showToast({
                icon: 'none',
                title: '请选择配菜',
                duration: 3000
            })
        }
    },

    // 去来料加工
    toOrderProcessing: function (e) {
        if (e.currentTarget.dataset.item != '') {
            app.globalData.lailiaojiagongdishesinf = e.currentTarget.dataset.item
            app.globalData.cartList = this.data.cartList
            var agreenopen = true
            if (e.currentTarget.dataset.num == '2') {
                for (var x of this.data.cartList) {
                    if (x.dishes_id == e.currentTarget.dataset.item.dishes_id) { // 当存在的时候
                        agreenopen = false
                    }
                }
            }

            if (!agreenopen) {
                wx.showToast({
                    icon: 'none',
                    title: '该键此刻不能操作,如需添加请点击"+"',
                    duration: 3000
                })
            } else {
                wx.navigateTo({
                    url: "../order_processing/order_processing?ordertype=" + this.data.ordertype + "&orderid=" + this.data.orderid + "&firstIssue=" + this.data.firstIssue
                })
            }
        }
    },

    // 去来料加工
    toOrderProcessing_1: function (dishes) {
        if (dishes != '') {
            app.globalData.lailiaojiagongdishesinf = dishes
            app.globalData.cartList = this.data.cartList
            wx.navigateTo({
                url: "../order_processing/order_processing?ordertype=" + 1 + "&orderid=" + this.data.orderid + "&firstIssue=" + this.data.firstIssue
            })
        }
    },

    hideRemark: function () {
        console.log("hideRemark")
        this.setData({
            quickRemark: '',
        })
    },
    // 点击沽清按钮
    sellOff(e) {
        // console.log(e);
        let {
            isActive
        } = this.data
        isActive = !isActive
        this.setData({
            isActive
        })
    },
    showSellOff(e) {
        let that = this
        let dishes_id = e.currentTarget.dataset.dishesid
        let index = e.currentTarget.dataset.index
        let dishes = this.data.menu[index]

        let dishes_statu = dishes.dishes_statu
        let {
            isActive,
            isShowModal
        } = this.data
        if (isActive) {
            wx.request({
                url: app.globalData.SelectDishesFoods, //获取菜品食材
                data: {
                    dishes_id
                },
                success(res) {
                    let foods_material = res.data.object //菜品的食材
                    that.setData({
                        foods_material
                    })
                    console.log(foods_material);
                    if (dishes_statu === 2) {
                        if (foods_material.length === 0) {
                            wx.showModal({
                                title: '提示',
                                content: '您是否要沽清该商品',
                                success(res) {
                                    if (res.confirm) {
                                        that.data.isSelloff = true
                                        that.setData({
                                            isSelloff: that.data.isSelloff
                                        })
                                        // console.log(dishes_id);
                                        wx.request({
                                            url: app.globalData.UpdateDishesInIngredients, //根据菜品删除菜品
                                            method: 'POST',
                                            data: {
                                                dishes_id
                                            },
                                            header: {
                                                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                            },
                                            success(res) {
                                                dishes_statu = 0
                                                // console.log(res)
                                                var menu = 'menu[' + index + '].dishes_statu'

                                                console.log(dishes_statu);
                                                that.setData({
                                                    [menu]: dishes_statu
                                                })
                                            }
                                        })
                                    } else if (res.cancel) {
                                        console.log('用户点击了取消');
                                    }
                                }
                            })

                        } else {
                            isShowModal = true
                            that.setData({
                                isShowModal
                            })
                        }
                    } else if (dishes_statu === 0) {
                        wx.showToast({
                            title: '该菜品已被沽清',
                            icon: 'none'
                        })
                    }
                }
            })
        }
    },
    // 沽清弹出框的取消按钮
    modal_click_Hidden() {
        this.data.isShowModal = false
        this.setData({
            isShowModal: this.data.isShowModal
        })
    },
    // 沽清弹出框的确定按钮
    bindSure() {
        let that = this
        let {
            shop_id,
            foods_material,
            menu
        } = this.data
        // console.log(menu);
        let stuffList = [] //菜品的食材id列表
        stuffList = this.data.stuffList
        stuffList = stuffList.map(Number)
        console.log(stuffList);
        shop_id = app.globalData.shopdetail.shop_id

        console.log(stuffList);
        wx.request({
            url: app.globalData.UpdateDishesInIngredients, //根据食材或菜品沽清菜品地址
            data: {
                shop_id,
                stuffList
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            success(res) {
                console.log(res);
                let DishList = res.data.object.DishList
                console.log(DishList); //沽清菜品的id
                menu.forEach(v => {
                    DishList.forEach(k => {
                        if (k === v.dishes_id) {
                            v.dishes_statu = 0
                        }
                    })
                })
                console.log(menu);
                that.setData({
                    menu
                })
            }
        })
        this.data.isShowModal = false
        this.setData({
            isShowModal: this.data.isShowModal
        })
    },
    //  食材复选框 
    checkboxChange(e) {
        console.log(e);
        let {
            isChecked,
            stuffList
        } = this.data
        stuffList = []
        isChecked = !isChecked
        if (isChecked) {
            stuffList.push(e.detail.value)
        }
        this.setData({
            stuffList: stuffList[0]
        })
    },
    clickEatAndMethod(event) {
        let that = this
        //这里获取id，控制选择的菜
        console.log(event)
        let eamChoose = event.detail
        let eatMethodArray = that.data.eatMethodArray

        //防止空判断
        if (eatMethodArray[eamChoose].SideDishList_choose) {} else {
            eatMethodArray[eamChoose].SideDishList_choose = []
        }
        if (eatMethodArray[eamChoose].SideDishList) {} else {
            eatMethodArray[eamChoose].SideDishList = app.globalData.SideDishList
        }
        if (eatMethodArray[eamChoose].tastes) {} else {
            eatMethodArray[eamChoose].tastes = ''
        }
        if (eatMethodArray[eamChoose].tastesRemark) {} else {
            eatMethodArray[eamChoose].tastesRemark = ''
        }
        if (eatMethodArray[eamChoose].remark) {} else {
            eatMethodArray[eamChoose].remark = ''
        }
        if (eatMethodArray[eamChoose].quickRemark) {} else {
            eatMethodArray[eamChoose].quickRemark = ''
        }
        //组件返回选择的下标，返回当前选择的菜对应的配菜、口味、备注、常用备注，回显出来
        that.setData({
            eatMethodChooseIndex: eamChoose,
            eamChoose: eamChoose,
            SideDishList_choose: eatMethodArray[eamChoose].SideDishList_choose,
            SideDishList: eatMethodArray[eamChoose].SideDishList,
            tastes: eatMethodArray[eamChoose].tastes,
            tastesRemark: eatMethodArray[eamChoose].tastesRemark,
            remark: eatMethodArray[eamChoose].remark,
            quickRemark: eatMethodArray[eamChoose].quickRemark
        })
    },
    // 判断是否存在临时菜品如果无则跳转到临时菜品页面
    gotoTemporary() {
        let that = this
        let {
            shop_id
        } = this.data

        wx.request({ //请求临时菜品数据
            url: app.globalData.SelectAllDishes,
            data: {
                shop_id: shop_id,
                index: 0,
                class_i_id: 4434,
                parent_type_id: 10617,
                subclass_type_id: 50182
            },
            success(res) {
                console.log(res);
                if (res.data.object.length === 0) {
                    wx.navigateTo({
                        url: '/pages/temporary/temporary?newTemporary=true' + '&menuList=' + JSON.stringify(that.data.menuList) + '&cartList=' + JSON.stringify(that.data.cartList),
                    })
                    var isShowTemporary = true
                    that.setData({
                        isShowTemporary,
                        temporaryCode: false
                    })
                } else {
                    console.log('已有临时菜品');
                    var isShowTemporary = true
                    let {
                        s1,
                        s2,
                        s3
                    } = that.data
                    var s4 = 0
                    //三级菜单回显，1号奥特曼
                    app.globalData.s1 = 7
                    that.setData({
                        temporaryCode: false,
                        topmenuList: that.data.menuList,
                        bottommenuList: [],
                        isShowTemporary,
                        s1: 7,
                        s2: 0,
                        s3: 0,
                        s4
                    })
                    that.changemenu()
                }
            }
        })

    },
    //权限不足时调用此方法
    jump: function (e) {
        jurisdiction.permissionShow()
    },

    //加菜时处理从数据库查询出来的菜
    createEmId: function (cartListItem) {
        if (cartListItem.em_basicarry && cartListItem.em_basicarry != '' && cartListItem.dishes_status != 20) {
            var em_Str = JSON.parse(cartListItem.em_basicarry);
            cartListItem.en_index = em_Str;
            cartListItem.en_basicarry = em_Str;
            cartListItem.em_index = [];
            cartListItem.em_basicarry = [];
            cartListItem.em_id = em_Str;
        }
        return cartListItem;
    },

    //回显当前菜单下的菜品数量
    echoDishes: function () {
        var that = this;
        var menu = that.data.menu;
        var countarry = that.data.countarry;
        var cartList = that.data.cartList;
        if (countarry != null) {
            menu.forEach(item => {
                var find = countarry.find(value => value.dishes_id == item.dishes_id);
                var findIndex = cartList.findIndex(obj => obj.dishes_id == item.dishes_id);
                item.countNum = 0;
                if (find != undefined && findIndex != -1) {
                    item.countNum = find.countnum;
                }
            })
            that.setData({
                menu
            })
        }
    },

    //点击菜品+-时调用
    modifyDishes(index, type) {
        const cartList = this.data.cartList;
        const menu = this.data.menu
        if (type == 0) {
            let countNum = menu[index].countNum + 1
            let dishes_pricing = menu[index].dishes_price * countNum
            this.setData({
                [`menu[${index}].countNum`]: countNum,
                [`menu[${index}].dishes_pricing`]: dishes_pricing
            })
        } else {
            if (menu[index].countNum > 0) {
                let cartItem = cartList.find(item => item.dishes_id == menu[index].dishes_id);
                if (cartItem.adddishes_flag == 0) {
                    menu[index].countNum--;
                    menu[index].dishes_pricing = menu[index].countNum * menu[index].dishes_price
                }
            }
            this.setData({
                menu
            })
        }
    },

    //2021-01-18 多规格的菜品，加入购物车，不想直接改原有的逻辑，现直接在方法外加一层判断
    addToCartBySpecType: function () {
        var that = this;
        if (that.data.dishes.spec_type == 1 || that.data.dishes.spec_type == 22 || that.data.dishes.spec_type == 24) {
            if (that.data.choosedishesSpecIndex == -1) {
                wx.showToast({
                    title: '请选择规格',
                    icon: 'none',
                    duration: 2000,
                })
            } else {
                var cartList = that.data.cartList;
                var eatMethodArray = that.data.eatMethodArray;
                var dishes = that.data.dishes;
                var sumMonney = that.data.sumMonney;
                var cupNumber = that.data.cupNumber;
                var countarry = that.data.countarry;
                var sideDisht = '';
                var countnum = 0
                var countprice = 0
                for (let i = 0; i < eatMethodArray.length; i++) {
                    var sideDishList_choose = eatMethodArray[i].sideDishList_choose;
                    if (sideDishList_choose != null && sideDishList_choose.length != 0) {
                        for (let j = 0; j < sideDishList_choose.length; j++) {
                            sideDisht = sideDisht + sideDishList_choose[j].ID + '-' + sideDishList_choose[j].orderDetailedNum + ",";
                        }
                    }
                    var remark = remarkJS.joinRemarkStr(eatMethodArray[i].quickRemark, eatMethodArray[i].remark)
                    
                    var addTemp = {
                        "price": eatMethodArray[i].price,
                        "dishes_price": eatMethodArray[i].spec_price,
                        "number": eatMethodArray[i].number,
                        "sum": eatMethodArray[i].sum,
                        "spec_name": eatMethodArray[i].em_name,
                        "remark": remark,
                        "sideDisht": sideDisht,
                        "tastes": eatMethodArray[i].tastes,
                        "tastesRemark": eatMethodArray[i].tastesRemark,
                        "vip_price": eatMethodArray[i].vip_price ? eatMethodArray[i].vip_price : 0,
                        "inline_price": eatMethodArray[i].inline_price ? eatMethodArray[i].inline_price : 0,
                        "inline_price_commission": dishes.inline_price_commission ? dishes.inline_price_commission : 0
                    };
                    var item = that.createDetailItem(addTemp, dishes);
                    cartList.push(item);
                    cupNumber += Number(eatMethodArray[i].number);
                    sumMonney += Number(eatMethodArray[i].sum);
                    countnum += Number(eatMethodArray[i].number);
                    countprice += Number(eatMethodArray[i].sum);
                }
                if (countarry != null && countarry.length != 0) {
                    for (let i = 0; i < countarry.length; i++) {
                        if (countarry[i].dishes_id == dishes.dishes_id) {
                            countnum += Number(countarry[i].countnum);
                            countprice += Number(countarry[i].countprice);
                        }
                    }
                }
                var count = {
                    "dishes_id": dishes.dishes_id,
                    "countname": dishes.dishes_name,
                    "countnum": Number(countnum),
                    "countprice": countprice
                }
                countarry = that.returnCountArry(count, countarry);
                that.setData({
                    countarry: countarry,
                    cartList: cartList,
                    cupNumber: cupNumber,
                    sumMonney: sumMonney,
                    showModalStatus: false,
                    eatMethodArray: [],
                    remark: '',
                    tastesRemark: '',
                    quickRemark: '',
                    sideDishList_choose: '',
                    choosedishesSpecArry: [],
                    chooseSpecItem: '',
                    inputSpecNum: '',
                    choosedishesSpecIndex: -1,
                    eatMethodChooseIndex: -1,
                    specBtnChooseIndex: 0,
                    dishesNumber: 0,
                    dishesMoney: 0.0,
                })
                app.globalData.cartList = cartList;
                app.globalData.cupNumber = cupNumber;
                app.globalData.sumMonney = sumMonney;
            }
        } else {
            that.addToCart2();
        }
    },

    //2021-01-25 多规格多做法菜品，页面内多个菜品的录入方法
    addToCartBySpecAndMethod: function () {
        var that = this;
        var dishes = that.data.dishes
        var inputvalue = that.data.inputvalue
        var inputvalue1 = that.data.inputvalue1
        var em_index = that.data.em_index
        var en_index = that.data.en_index
        var menu = that.data.menu
        var difference_flag = that.data.difference_flag
        var List = [] // 已选择的配菜
        var sideDisht = '' // 需要提交的配菜
        let eatMethodArray = that.data.eatMethodArray; //多规格多做法选的规格做法数组
        let copyOrder = 1
        if (en_index.length == 0 && em_index.length == 0) {
            wx.showToast({
                title: '请选择做法',
                icon: 'none',
                duration: 2000,
            })
        } else {
            var cartList = that.data.cartList;
            var weightarry = that.data.weightarry
            var number = 1
            //这里开始，要创建好新的dishes,循环出菜
            for (let x of eatMethodArray) {
                List = []
                var en_basicarry = []
                en_basicarry.push(x)
                var measurementValueInput = x.Number //计量值
                inputvalue = 0
                inputvalue1 = 99
                if (x.SideDishList) {
                    List = JSON.parse(JSON.stringify(x.SideDishList))
                }

                if (difference_flag && that.data.locationindex == 3) {
                    var item_type = 2; //点餐类别：点餐-0、退餐--1、加菜-2、修改-3
                } else {
                    var item_type = 0; //点餐类别：点餐-0、退餐--1、加菜-2、修改-3
                    if (Number(app.globalData.subSeatsNum) > 1) {
                        copyOrder = Number(app.globalData.subSeatsNum)
                    }
                }

                var sum = 0
                var measurement_value = measurementValueInput
                var dishes_sum = 0;
                if (dishes.sideDishes != 0 && x.SideDishList_choose && x.SideDishList_choose.length > 0) {
                    for (var i = 0; i < List.length; i++) {
                        if (List[i].checked && List[i].orderDetailedNum > 0) {
                            if (List[i].orderDetailedSum) {
                                dishes_sum += Number(List[i].orderDetailedSum)
                            }
                            sideDisht = sideDisht + List[i].ID + '-' + List[i].orderDetailedNum + ','
                        }
                    }
                    1
                }

                sum = Number(x.dishesSpec.spec_price) * Number(measurementValueInput) + Number(that.data.sum_position) + Number(dishes_sum)
                
                var addItem = {
                    "id": 0,
                    "name": dishes.dishes_name,
                    "price": x.dishesSpec.spec_price,
                    "measurement_value": measurement_value,
                    "dishes_price": x.dishesSpec.spec_price,
                    "number": measurement_value,
                    "sum": sum,
                    "img_url": dishes.dishes_img,
                    "big_img_url": dishes.big_dishes_img,
                    "dishes_id": dishes.dishes_id,
                    "spec_name": x.dishesSpec.spec_name,
                    "spec_type": x.dishesSpec.spec_name,
                    "dishes_spec_type": dishes.spec_type,
                    "disher_weight": inputvalue,
                    "specal_type": dishes.specal_type,
                    "weighing": dishes.weighing,
                    "remark": x.remark,
                    "quickRemark": x.quickRemark,
                    "dishes_introduce": dishes.dishes_introduce,
                    "adddishes_flag": 0, //1为此为加菜前点的商品，不能改动
                    "disher_weight_ceiling": inputvalue1,
                    "em_basicarry": [],
                    "en_basicarry": en_basicarry,
                    "item_number": inputvalue + ',' + inputvalue1,
                    "dishes_status": 5,
                    "en_index": en_index,
                    "em_index": em_index,
                    "item_type": item_type,
                    "dishes_index": 1, //这个可以标识区分同名菜品
                    "SideDishList": List,
                    "sideDisht": sideDisht,
                    "tastes": x.tastes,
                    "tastesRemark": x.tastesRemark,
                    "jointSet": '',
                    "hadOrdered": false,
                    "freeOrder": 0,
                    "repairOrder": 0,
                    "copyOrder": copyOrder,
                    "waitOrder": 0,
                    "baleOrder": 0,
                    "transferOrder": 0,
                    "depositOrder": 0,
                    "vip_price": x.dishesSpec.vip_price ? x.dishesSpec.vip_price : 0,
                    "inline_price": x.dishesSpec.inline_price ? x.dishesSpec.inline_price : 0,
                }
                if (dishes.spec_type == 10) {
                    number = Number(measurement_value),
                        addItem.number = Number(measurement_value)
                }
                var weightitem = {
                    "id": 0,
                    "name": dishes.dishes_name,
                    "dishes_id": dishes.dishes_id,
                    "dishes_price": dishes.dishes_price,
                    "sum": Number(sum),
                    "weight": inputvalue,
                    "weight_ceiling": inputvalue1,
                    "number": number,
                    "dishes_metering_type": dishes.dishes_metering_type,
                    "vip_price": dishes.vip_price ? dishes.vip_price : 0,
                    "inline_price": dishes.inline_price ? dishes.inline_price : 0,
                    "inline_price_commission": dishes.inline_price_commission ? dishes.inline_price_commission : 0
                }
                if (weightarry.length == 0) {
                    weightarry.push(weightitem)
                } else {
                    if (!that.data.changeweightdishes_flag) {
                        for (var i = 0; i < weightarry.length; i++) {
                            console.log(weightarry[i].dishes_id == weightitem.dishes_id)
                            if (weightarry[i].dishes_id == weightitem.dishes_id) {
                                weightarry[i].weight = Number(weightitem.weight) + Number(weightarry[i].weight)
                                weightarry[i].sum += Number(weightitem.sum)
                                weightarry[i].number += Number(weightitem.number)
                                break
                            }
                            if (i == weightarry.length - 1 && weightarry[i].dishes_id != weightitem.dishes_id) {
                                weightarry.push(weightitem)
                                break
                            }
                        }
                    } else {
                        for (var i = 0; i < weightarry.length; i++) {
                            if (weightarry[i].dishes_id == weightitem.dishes_id && weightarry[i].weight == weightitem.weight) {
                                weightarry[i].weight = weightitem.weight
                                weightarry[i].sum = Number(weightitem.sum)
                            }
                        }
                    }
                }
                // 判断是否超过1份相同的鱼，如果两份以上就不显多规格
                for (var k = 0; k < weightarry.length; k++) {
                    if (weightarry[k].number > 1) {
                        var cartList = that.data.cartList
                        if (cartList != '' && cartList != undefined && cartList != null) {
                            for (var i = 0; i < menu.length; i++) {
                                if (dishes.dishes_id == menu[i].dishes_id) {
                                    // 同名菜品超过1份，标识dishes_index 
                                    addItem.dishes_index = weightarry[k].number;
                                }
                            }
                        }
                    }
                }
                if (!that.data.changeweightdishes_flag) {
                    var sumMonney = that.data.sumMonney + Number(Number(sum * Number(copyOrder)).toFixed(2));
                    var cupNumber = that.data.cupNumber + Number(Number(number * Number(copyOrder)).toFixed(2));
                    cartList.push(addItem)
                    that.setData({
                        weightarry: weightarry,
                        cartList: cartList,
                        showModalStatus1: false,
                        showModalStatus2: false,
                        showModalStatus5: false,
                        changeweightdishes_flag: false,
                        sumMonney: sumMonney,
                        cupNumber: cupNumber,
                        parttoeat: -1,
                        inputvalue: inputvalue,
                        inputvalue1: inputvalue1,
                        en_index: [],
                        em_index: [],
                        result_em: true,
                        measurementValueInput: '',
                        result_en: true,
                        parts: [],
                        whole: [],
                        em_arry: [],
                        isWhole: true,
                        needRemain: false,
                        eatMethodArray: [],
                        SideDishList_choose: [],
                        SideDishList: [],
                        remark: '',
                        quickRemark: '',
                        tastes: '',
                        menu: menu,
                        tastesRemark: '',
                        sum_position: 0,
                        dishesMoney: ''
                    })
                } else {
                    for (var i = 0; i < cartList.length; i++) {
                        if (addItem.name == cartList[i].name) {
                            var qqq = that.data.sumMonney - Number(((cartList[i].sum + addItem.sum) * copyOrder).toFixed(2))
                            var sumMonney_hh = parseFloat(qqq.toFixed(2))
                            cartList[i] = addItem
                            break
                        }
                    }
                    var sumMonney = sumMonney_hh
                    var cupNumber = that.data.cupNumber
                    that.setData({
                        weightarry: weightarry,
                        cartList: cartList,
                        showModalStatus1: false,
                        showModalStatus2: false,
                        showModalStatus5: false,
                        changeweightdishes_flag: false,
                        sumMonney: sumMonney,
                        cupNumber: cupNumber,
                        inputvalue: '',
                        inputvalue1: '',
                        measurementValueInput: '',
                        parts: [],
                        whole: [],
                        em_arry: [],
                        SideDishList_choose: [],
                        SideDishList: [],
                        isWhole: true,
                        needRemain: false,
                        eatMethodArray: [],
                        remark: '',
                        quickRemark: '',
                        tastes: '',
                        tastesRemark: '',
                        menu: menu,
                        sum_position: 0,
                        dishesMoney: ''
                    })
                }
                that.addtobuy(addItem)

                if (that.data.isQuery) {
                    that.setData({
                        queryData: ''
                    })
                }
                app.globalData.cartList = cartList;
                app.globalData.cupNumber = cupNumber;
                app.globalData.sumMonney = sumMonney;

            }
            //清空数据
            that.setData({
                sideDishList_choose: [],
                SideDishList: [],
                eamChoose: -1
            })
        }

    },

    createDetailItem: function (addTemp, dishes) {
        var that = this;
        var item_type;
        // 后加的菜品判断是否已经进入确认时间
        if (that.data.difference_flag && that.data.locationindex == 3) {
            item_type = 2; //进入确认时间的菜需要将菜品状态置2
        } else {
            item_type = 0; //否则默认将菜品状态置0，标识时间外的加菜
        }
        var item = {
            "name": dishes.dishes_name,
            "spec_id": 0,
            "img_url": dishes.dishes_img,
            "big_img_url": dishes.big_dishes_img,
            "dishes_id": dishes.dishes_id,
            //"u_spec_name": choose_dishes.u_spec_name,
            "spec_type": dishes.spec_type,            
            "dishes_spec_type": dishes.spec_type, //是否多规格
            "disher_weight": 0,
            "specal_type": dishes.specal_type,
            "weighing": dishes.weighing,
            "dishes_introduce": dishes.dishes_introduce,
            "adddishes_flag": 0, //1为此为加菜前点的商品，不能改动
            "SideDishList": this.data.SideDishList,
            "dishes_status": 4,
            "item_type": item_type,
            "jointSet": '',
            "hadOrdered": false,
            "freeOrder": 0,
            "repairOrder": 0,
            "copyOrder": Number(app.globalData.subSeatsNum),
            "waitOrder": 0,
            "baleOrder": 0,
            "transferOrder": 0,
            "depositOrder": 0,                        
        }                  
        item = Object.assign(item, addTemp);        
        return item;
    },

    //点击规格按钮
    clickSpecBtn: function (e) {
        console.log(e);
        var that = this
        var item = e.currentTarget.dataset.item;
        var index = e.currentTarget.dataset.index;
        var dishes = that.data.dishes;
        var choosedishesSpecIndex = that.data.choosedishesSpecIndex;
        var sideDishList_choose = that.data.sideDishList_choose
        console.log(item);
        that.setData({
            inputSpecNum: 1,
            specBtnChooseIndex: index,
            chooseSpecItem: item,
            sideDishList_choose: ''
        })
    },

    //规格输入框
    bindinputSpecNum: function (e) {
        this.setData({
            inputSpecNum: e.detail.value
        })
    },

    //点击规格确定按钮
    clickSpecSubmit: function () {
        var that = this;
        var inputSpecNum = that.data.inputSpecNum;
        var choosedishesSpecArry = that.data.choosedishesSpecArry;
        var eatMethodArray = that.data.eatMethodArray;
        var dishesNumber = that.data.dishesNumber;
        var dishesMoney = that.data.dishesMoney;
        var dishes = that.data.dishes;
        var spec_type = dishes.spec_type
        var choosedishesSpecIndex = that.data.choosedishesSpecIndex;
        var dishesSpecArry = that.data.dishesSpecArry;
        console.log(choosedishesSpecIndex)
        if (inputSpecNum != null && inputSpecNum > 0) {
            var item = {
                spec_name: that.data.chooseSpecItem.spec_name,
                spec_price: that.data.chooseSpecItem.spec_price,
                number: inputSpecNum,
                price: Number(inputSpecNum) * Number(that.data.chooseSpecItem.spec_price),
            }
            if (item.spec_price != null) {
                choosedishesSpecArry.push(item);
                dishesNumber += Number(inputSpecNum);
                dishesMoney += Number(inputSpecNum) * Number(that.data.chooseSpecItem.spec_price);
            }
            var temp = {
                em_name: that.data.chooseSpecItem.spec_name,
                eating_method: '',
                spec_price: that.data.chooseSpecItem.spec_price,
                number: inputSpecNum,
                price: Number(inputSpecNum) * Number(that.data.chooseSpecItem.spec_price),
                sum: Number(inputSpecNum) * Number(that.data.chooseSpecItem.spec_price),
                inline_price: that.data.chooseSpecItem.inline_price,
                vip_price: that.data.chooseSpecItem.vip_price
            }
            
            if (temp.spec_price != null) {
                eatMethodArray.push(temp);
            }
            var index = 0;
            if (that.data.choosedishesSpecIndex > 0) {
                index = that.data.choosedishesSpecIndex;
            }
            that.setData({
                choosedishesSpecArry: choosedishesSpecArry,
                choosedishesSpecIndex: index,
                eatMethodChooseIndex: index,
                eatMethodArray: eatMethodArray,
                dishesNumber: dishesNumber,
                dishesMoney: dishesMoney,
            })
            //	多规格 默认选择第一种规格
            if (spec_type == 1 || spec_type == 22 || spec_type == 24) {
                if (!that.data.chooseSpecItem) {
                    var item = {
                        spec_name: dishesSpecArry[0].spec_name,
                        spec_price: dishesSpecArry[0].spec_price,
                        number: inputSpecNum,
                        price: Number(inputSpecNum) * Number(dishesSpecArry[0].spec_price),
                    }
                    choosedishesSpecArry.push(item);
                    dishesNumber += Number(inputSpecNum);
                    dishesMoney += Number(inputSpecNum) * Number(dishesSpecArry[0].spec_price);
                    var temp = {
                        em_name: dishesSpecArry[0].spec_name,
                        eating_method: '',
                        spec_price: dishesSpecArry[0].spec_price,
                        number: inputSpecNum,
                        price: Number(inputSpecNum) * Number(dishesSpecArry[0].spec_price),
                        sum: Number(inputSpecNum) * Number(dishesSpecArry[0].spec_price),
                        inline_price: dishesSpecArry[0].inline_price,
                        vip_price: dishesSpecArry[0].vip_price
                    }
                    eatMethodArray.push(temp);
                    that.setData({
                        choosedishesSpecArry: choosedishesSpecArry,
                        eatMethodArray: eatMethodArray,
                        dishesNumber: dishesNumber,
                        dishesMoney: dishesMoney,
                    })
                }
                that.setData({
                    choosedishesSpecIndex: choosedishesSpecArry.length - 1
                })
            }
        } else {
            wx.showToast({
                title: '请输入数量',
                icon: 'none',
                duration: 2000,
            })
        }
    },

    //多规格菜品切换规格
    chooseDishesSpec: function (event) {
        var that = this;
        console.log(event.detail);
        var eatMethodArray = that.data.eatMethodArray;
        var sideDishList_choose = eatMethodArray[event.detail].sideDishList_choose;
        var tastesRemark = eatMethodArray[event.detail].tastesRemark;
        var tastes = eatMethodArray[event.detail].tastes;
        var quickRemarkList = that.data.quickRemarkList;
        var quickRemark = eatMethodArray[event.detail].quickRemark;
        var remark = eatMethodArray[event.detail].remark;
        for (var x = 0; x < quickRemarkList.length; x++) {
            quickRemarkList[x].checked = false
            if (quickRemark != null && quickRemark != '') {
                var quickRemarkItem = quickRemark.split("、");
                for (var i = 0; i < quickRemarkItem.length; i++) {
                    if (quickRemarkList[x].value === quickRemarkItem[i]) {
                        quickRemarkList[x].checked = true
                    }
                }
            }
        }
        that.setData({
            choosedishesSpecIndex: event.detail,
            eatMethodChooseIndex: event.detail,
            sideDishList_choose: sideDishList_choose != null ? sideDishList_choose : '',
            tastesRemark: tastesRemark != null ? tastesRemark : '',
            tastes: tastes != null ? tastes : '',
            quickRemarkList: quickRemarkList,
            quickRemark: quickRemark != null ? quickRemark : '',
            remark: remark != null ? remark : '',
        })
    },

    // 显示选择配菜组件
    showpeicaiAndTaste: function (e) {
        var that = this;
        var tastes = '';
        //var tasteList = app.globalData.remark_taste;


        //2021-01-18 多规格未选择规格，不能打开配菜
        if (that.data.dishes.spec_type == 1 && that.data.choosedishesSpecIndex == -1) {
            wx.showToast({
                title: '请选择规格',
                icon: 'none',
                duration: 2000,
            })
        } else if (that.data.dishes.spec_type == 10 && that.data.eamChoose == -1) {
            wx.showToast({
                title: '请选择菜品',
                icon: 'none',
                duration: 2000,
            })
            // } else if (this.data.dishes.spec_type == 9 && this.data.porridgeObject.selName == "请选择") {
        } else if ((this.data.dishes.spec_type == 9 || this.data.dishes.spec_type == 91) && this.data.porridgeObject.selName == "请选择") {
            wx.showToast({
                title: '请选择食材',
                icon: 'none',
                duration: 2000,
            })
        } else {
            var tastes = ''
            var tasteList = app.globalData.remark_taste;
            var SideDishList = that.data.SideDishList;
            var sideDishList_choose = that.data.SideDishList_choose; // 3/10
            if (that.data.SideDishList != null) {
                SideDishList = JSON.parse(JSON.stringify(that.data.SideDishList));
                for (var x = 0; x < SideDishList.length; x++) {
                    SideDishList[x].checked = false
                    SideDishList[x].orderDetailedSum = 0
                    SideDishList[x].orderDetailedNum = 0
                    if (sideDishList_choose != '' && sideDishList_choose != undefined) {
                        for (var y of sideDishList_choose) {
                            if (y.ID == SideDishList[x].ID) {
                                SideDishList[x].checked = y.checked
                                SideDishList[x].orderDetailedSum = y.orderDetailedSum
                                SideDishList[x].orderDetailedNum = y.orderDetailedNum
                                // sideDishIndex = x;
                            }
                        }
                    }
                }
            }
            for (var x = 0; x < tasteList.length; x++) {
                tasteList[x].checked = false
            }
            if (that.data.tastes != '' && that.data.tastes != null) {
                tastes = that.data.tastes.split(',')
                for (var x of tastes) {
                    for (var y = 0; y < tasteList.length; y++) {
                        if (tasteList[y].value === x) {
                            tasteList[y].checked = true
                        }
                    }
                }
            }
            if (that.data.eatMethodArray.length == 1) {
                that.setData({
                    eatMethodChooseIndex: 0
                })
            }
            that.setData({
                tasteList: tasteList,
                showpeicaiAndTaste: !this.data.showpeicaiAndTaste,
                SideDishList: SideDishList,
            })
            console.log("showpeicaiAndTaste")
        }
    },

    submitSpecAndTaste: function (event) {
        console.log(event);
        var that = this;
        var eatMethodArray = that.data.eatMethodArray;
        var dishesMoney = 0;
        var dishes = that.data.dishes
        if (dishes.spec_type == 10) {
            eatMethodArray[that.data.eamChoose].SideDishList = event.detail.SideDishList;
            eatMethodArray[that.data.eamChoose].SideDishList_choose = event.detail.SideDishList_choose;
            eatMethodArray[that.data.eamChoose].tastesRemark = event.detail.tastesRemark;
            eatMethodArray[that.data.eamChoose].tastes = event.detail.tastes;
            //计算菜品总价
            var price = eatMethodArray[that.data.eamChoose].dishesSpec.spec_price;
            var sum = 0;
            if (event.detail.SideDishList_choose != null && event.detail.SideDishList_choose.length != 0) {
                for (let i = 0; i < event.detail.SideDishList_choose.length; i++) {
                    sum += Number(event.detail.SideDishList_choose[i].orderDetailedSum);
                }
            }
            sum += price;
            eatMethodArray[that.data.eamChoose].sum = sum;
            that.addEASSum()
            let e = {
                "detail": that.data.eamChoose
            }
            that.clickEatAndMethod(e)
            // } else if (dishes.spec_type == 9) {
        } else if ((dishes.spec_type == 9 || dishes.spec_type == 91)) {
            that.setData({
                SideDishList_choose: event.detail.SideDishList_choose,
                tastesRemark: event.detail.tastesRemark,
                tastes: event.detail.tastes,
                showpeicaiAndTaste: false,
                SideDishList: event.detail.SideDishList,
            })
        } else {
            eatMethodArray[that.data.choosedishesSpecIndex].sideDishList_choose = event.detail.SideDishList_choose;
            eatMethodArray[that.data.choosedishesSpecIndex].tastesRemark = event.detail.tastesRemark;
            eatMethodArray[that.data.choosedishesSpecIndex].tastes = event.detail.tastes;
            //计算菜品总价
            var price = eatMethodArray[that.data.choosedishesSpecIndex].price;
            console.log("计算菜品总价", eatMethodArray[that.data.choosedishesSpecIndex]);
            var sum = 0;
            if (event.detail.SideDishList_choose != null && event.detail.SideDishList_choose.length != 0) {
                for (let i = 0; i < event.detail.SideDishList_choose.length; i++) {
                    sum += Number(event.detail.SideDishList_choose[i].orderDetailedSum);
                }
            }
            sum += price;
            eatMethodArray[that.data.choosedishesSpecIndex].sum = sum;
        }
        for (let i = 0; i < eatMethodArray.length; i++) {
            dishesMoney += Number(eatMethodArray[i].sum);
        }
        that.setData({
            eatMethodArray: eatMethodArray,
            sideDishList_choose: event.detail.SideDishList_choose,
            tastesRemark: event.detail.tastesRemark,
            tastes: event.detail.tastes,
            showpeicaiAndTaste: false,
            SideDishList: event.detail.SideDishList,
            dishesMoney: dishesMoney,
        })

    },

    returnCountArry: function (count, countarry) {
        //countarry:当前显示已点菜的数组
        //如果countarry为空,则直接推入数组
        if (countarry == undefined || countarry.length == 0) {
            countarry = []
            countarry.push(count)
        } else {
            for (var i = 0; i < countarry.length; i++) {
                //如果countarry中有同名的菜品,则删除同名的菜品
                if (countarry[i].countname == count.countname) {
                    countarry.splice(i, 1)
                    //如果替代的菜品数量为0,则不用替代到原菜品上,防止显示bug
                    if (count.countnum != 0) {
                        countarry.push(count)
                    }
                    break
                } else {
                    //如果没有同名的菜品,则把新菜品推入countarry中
                    if (i == countarry.length - 1 && countarry[i].countname != count.countname) {
                        countarry.push(count)
                        break
                    }
                }
            }
        }
        return countarry;
    },
    addEASSum() {
        var that = this;
        //多规格多做法数据回显
        let eatMethodArray = that.data.eatMethodArray
        let sum = 0;
        let num = 0;
        for (let i of eatMethodArray) {
            sum += Number(i.sum)
            num += Number(i.Number)
        }
        that.setData({
            eatMethodArrayNumber: num,
            eatMethodArraySum: sum
        })

    },
    //计时器，用于闪烁
    countDown: function (res) {
        var that = this
        var countDownNum = 10000
        if (res == 0 && app.globalData.countDown_minister == true) {
            that.startFlash()
            that.setData({
                timerb: setInterval(function () {
                    that.setData({
                        fackyousevencolor: that.data.fackyousevencolor == "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_red.png" ? "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png" : "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_red.png"
                    })
                }, 1000)
            })
        } else if (res == 1 && app.globalData.countDown_waiter == true) {
            that.startFlash1()
            that.setData({
                timerf: setInterval(function () {
                    that.setData({
                        fackyousevencolor1: that.data.fackyousevencolor1 == "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_red.png" ? "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png" : "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_red.png"
                    })
                }, 1000)
            })
        }
    },

    choosePackage(e) {
        console.log(e);
        wx.navigateTo({
            url: "/pages/module_discount/pages/packagePage/packagePage?dishesId=" + e.currentTarget.dataset.dishesid + '&statu=1'
        })
    },

    delChoosePackage(e) {
        const {
            index,
            id
        } = e.currentTarget.dataset
        console.log(index, id);
        let cartItemIdx
        const cartItem = this.data.cartList.find((d, idx) => {
            if (d.dishes_id === id && !d.id) {
                cartItemIdx = idx
                return true
            } else {
                return false
            }
        })
        if (cartItemIdx != undefined && cartItem) {
            if (cartItem.number - 1 > 0) {

                this.setData({
                    [`cartList[${cartItemIdx}].number`]: cartItem.number - 1,
                    [`cartList[${cartItemIdx}].sum`]: cartItem.sum - cartItem.dishes_price
                })
            } else {
                let cartList = this.data.cartList
                cartList.splice(cartItemIdx, 1)
                this.setData({
                    cartList
                })
            }
            let countarry = this.data.countarry
            // countarry.forEach(e =>{
            for (let i = 0; i < countarry.length; i++) {
                if (countarry[i].dishes_id == id) {
                    if (countarry[i].countnum - 1 > 0) {

                        countarry[i].countnum = countarry[i].countnum - 1
                        countarry[i].tempNumber = countarry[i].tempNumber - 1
                        countarry[i].countprice = countarry[i].countprice - cartItem.dishes_price
                    } else {
                        countarry.splice(i, 1)
                    }

                }
            }


            // })
            this.setData({
                countarry
            })

        } else {
            return false
        }
    },
    genSetMealOrder(dishes_index,number,item_price,inline_price,sum,remark,lstOrderSetMealConstituteType){
        console.log("从订单订单表返回")
    
        console.log(lstOrderSetMealConstituteType)
                //对超值套餐，普通套餐，超值菜品下单
    
                var that = this
    
                const dishes = this.data.menu[dishes_index]
                if (!dishes) {
                  throw new Error('选中菜品错误')
                }
    
                let cartList = [...this.data.cartList]
               
    
                console.log(cartList);
            
                let copyOrder = 1
                let sumMonney = Number(this.data.sumMonney) + sum;
                sumMonney = parseFloat(sumMonney.toFixed(2))
                if (this.data.isQuery) {
                  this.setData({
                    queryData: ''
                  })
                }
    
                  if (this.data.difference_flag && this.data.locationindex == 3) {
                    var item_type = 2;
                  } else {
                    var item_type = 0;
                    if (Number(getApp().globalData.subSeatsNum) > 1) {
                      copyOrder = Number(getApp().globalData.subSeatsNum)
                    }
                  }
               
                  console.log("newDish")
                  let newDish = {
                    "sale_dishe": false,
                    "name": dishes.dishes_name,
                    "price": item_price,
                    "dishes_price": item_price,
                    "number": number,
                    "sum": parseFloat(sum.toFixed(2)),
                    "img_url": dishes.dishes_img,
                    "big_img_url": dishes.big_dishes_img,
                    "dishes_id": dishes.dishes_id,
                    "spec_name": dishes.dishes_metering_type,
                    "spec_type": dishes.spec_type,
                    "dishes_metering_type": dishes.dishes_metering_type,
                    "dishes_spec_type": dishes.spec_type, //是否多规格
                    "disher_weight": 0,
                    "specal_type": dishes.specal_type,
                    "weighing": dishes.weighing,
                    "dishes_introduce": dishes.dishes_introduce,
                    "remark": remark,
                    "decdishes_flag": 1, //1为此为减菜前点的商品，不能改动
                    "adddishes_flag": 0, //1为此为加菜前点的商品，不能改
                    "dishes_status": 0,
                    "u_item_number": 0,
                    "item_type": item_type,
                    "sideDisht": '',
                    "tastes": '',
                    "tastesRemark": '',
                    "hadOrdered": false,
                    "freeOrder": 0,
                    "repairOrder": 0,
                    "copyOrder": copyOrder,
                    "waitOrder": 0,
                    "baleOrder": 0,
                    "transferOrder": 0,
                    "depositOrder": 0,
                    "jointSet": '',
                    "vip_price": dishes.vip_price ? dishes.vip_price : 0,
                    "inline_price": dishes.inline_price ? dishes.inline_price : 0,
                    "inline_price_commission":0,
                    "lstOrderSetMealConstituteType":lstOrderSetMealConstituteType,
                  }

                  cartList.push(newDish)
                  console.log(cartList);
                  console.log(sumMonney);
                  console.log(copyOrder);
    
                  this.setData({
                    cartList: cartList,
                    sumMonney: sumMonney,
                    cupNumber: that.data.cupNumber + Number(copyOrder)
                  })
    
                  let set_meal_array = that.data.set_meal_array
                  var set_meal_obj=null;
                  var bExists=false;
                  var cartListSum=0;
                  var cartListNumber=0;
                  for(var i=0;i<cartList.length;i++){
                    var cartObj=cartList[i];
                    if(cartObj.spec_type==dishes.spec_type&&cartObj.dishes_id==dishes.dishes_id){
                      cartListSum+=Number(cartObj.sum);
                      cartListNumber+=Number(cartObj.number);
                    }
                    
                  }
                  //查找
                  for(var i=0;i<set_meal_array.length;i++){
                    var set_meal_obj=set_meal_array[i];
                    if(set_meal_obj.dishes_id==dishes.dishes_id&&set_meal_obj.spec_type==dishes.spec_type){
                      //之前已存在
                      set_meal_obj.sum=cartListSum;
                      set_meal_obj.item_number=cartListNumber;
                      bExists=true;
                      break;
                    }
                  }
                  if(bExists==false){
                    //之前不存在
                    set_meal_array.push({
                      dishes_id:newDish.dishes_id,
                      spec_type:dishes.spec_type,
                      item_number:number,
                      sum:sum,
                    })
                  }
                  this.setData({
                    set_meal_array:set_meal_array,
                  })
      },
    
})