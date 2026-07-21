//app.js

var util = require('utils/util.js');
var rmq = require('./utils/RMQV3.js');
var QQMapWX = require('/utils/qqmap-wx-jssdk.js');
var socketOpen = false
var screenShow = false
var PayCallBack = function () {}
var qqmap = new QQMapWX({
    //在腾讯地图开放平台申请密钥 http://lbs.qq.com/mykey.html

    key: 'V2QBZ-KVOKQ-3QS5T-GDXJD-SNQFQ-GKBVE' //此处为个人秘钥,可用老板手机号申请公司的秘钥

});

////体验版
// let serverConfig = {
//     realm: 'test.fsmbdlkj.com',
//     url: 'https://test.fsmbdlkj.com',
//     dev: 'https://test.fsmbdlkj.com',
//     prod: 'https://test.fsmbdlkj.com',
//     hj: 'test',   //呼叫地址
//     wechatAppId: "wx7601bb0ab62f48aa", //APPID 弹叮商城
//     //wechatAppId: "wxe7b669187f75f818", //APPID 你搞定
//     //wechatAppId: "wx4f0edbf172b1693e", //APPID 孟奔商城
   
//     platformShopId: 20987,//诗么普平台shopId
//     QRCodeVersion: 'trial', //要打开的小程序版本。正式版为 "release"，体验版为 "trial"，开发版为 "develop"
// }

////正式服
let serverConfig = {
    url: 'https://mb.fsmbdlkj.com',
    realm: 'https://mb.fsmbdlkj.com',
    dev: 'https://mb.fsmbdlkj.com',
    prod: 'https://mb.fsmbdlkj.com',
    hj: 'real', //呼叫地址
    wechatAppId: "wx7601bb0ab62f48aa", //APPID
    platformShopId: 20994, //诗么普平台shopId
    QRCodeVersion: 'release', //要打开的小程序版本。正式版为 "release"，体验版为 "trial"，开发版为 "develop"
}

App({
    getServerType: () => {
        return serverConfig.url == serverConfig.dev ? 1 : 2
    },
    getServerUrl: () => {
        return serverConfig.url
    },
    getWechatAppId: () => {
      return serverConfig.wechatAppId
  },
    /*
     * @description 动态更改调用的域名
     * @param type {Number}: 1为serverDevelopment, 2为serverProd
     */
    setServerUrl: (type) => {
        if (type === 1) {
            serverConfig.url = serverConfig.dev
            serverConfig.realm = 'test.fsmbdlkj.com'
        } else {
            serverConfig.url = serverConfig.prod
            serverConfig.realm = 'mb.fsmbdlkj.com'
        }
        getApp().globalData = getGlobalData()
        return true
    },

    checkUpdateVersion() {
        console.log('版本自动更新事件');
        //判断微信版本是否 兼容小程序更新机制API的使用
        if (wx.canIUse('getUpdateManager')) {
            console.log('检测版本更新');
            const updateManager = wx.getUpdateManager();
            //检测版本更新
            updateManager.onCheckForUpdate(function (res) {
                if (res.hasUpdate) {
                    console.log('确定更新版本');
                    updateManager.onUpdateReady(function () {
                        console.log('更新完毕');
                        updateManager.applyUpdate()
                    })
                    updateManager.onUpdateFailed(function () {
                        console.log('更新失败');
                        // 新版本下载失败
                        wx.showModal({
                            title: '已有新版本',
                            content: '请您删除小程序，重新搜索进入',
                        })
                    })
                } else {
                    console.log('无需更新');
                }
            })
        } else {
            console.log('版本号过低');
            wx.showModal({
                title: '溫馨提示',
                content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
            })
        }
    },


    onShow: function () {
        // screenShow = true
        let that = this
        // that.dy_jump();
        console.log('切换到前台')
        // that.getManagementDataServlet()
        this.checkUpdateVersion()
        if (!that.globalData.RMQOpenStatus && that.globalData.caustomerId) {
          if(that.globalData.customerInf.userCode){
            if(that.globalData.customerInf.userCode!=''){
              rmq.initSocket(that.globalData.customerInf.userCode)
            }
        }
            

        }
        that.getAllShopType()
    },
    onHide: function () {
        // screenShow = false
        console.log('切换到后台')
        // if (that.globalData.RMQOpenStatus) {
        //   wx.closeSocket()
        // }
    },
    getAllShopType: function () {
        var that = this
        wx.request({ //查询总的店铺类型
            url: that.globalData.SelectAllShopType_url,
            header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
                var list = res.data.object
                let aaa = []
                for (var i = 0; i < list.length; i++) {
                    //排除一些无效的数据，空值啊，null啊
                    if (list[i].type_name != ' ' && list[i].type_name != 'undefined' && list[i].type_name != '' && list[i].type_name != 'NULL') {
                        aaa.push({
                            name: list[i].type_name,
                            id: list[i].id,
                            checked: ''
                        })
                    }
                }
                that.globalData.allShopType = aaa
                console.log(that.globalData.allShopType)
            }
        })
    },
    // onReady:function(){
    //   var that = this;
    //   that.dy_jump();
    // },

    globalData: {
    //从哪个店铺进入的系统 商城商品推荐点击或者扫码进入系统 8888代表是平台
    search_keywords:'',
    scan_staff_goods_id:0,//扫码商品id
    scan_staff_shop_id:0,//扫码对应的员工
    scan_staff_customer_id:0,//扫码的员工对应的客人id
    is_staff_special_commission:0,
    card_is_in_activity:0,
    channel_type_path:'',
    is_get_openid_ok:false,
    enter_shop_id:8888,
    enter_shop_id_inited:false,//enter_shop_id 是否初始化过，只能更改一次
		shopping_cart_img:"data:image/svg+xml,%3Csvg%20t%3D%221689238055285%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%221653%22%20width%3D%2264%22%20height%3D%2264%22%3E%3Cpath%20d%3D%22M352.456912%20832.032253c-35.434907%200-63.989249%2028.554342-63.989249%2063.989249%200%2035.434907%2028.554342%2063.989249%2063.989249%2063.989249s63.989249-28.554342%2063.989249-63.989249C416.446162%20860.586595%20387.891819%20832.032253%20352.456912%20832.032253L352.456912%20832.032253z%22%20fill%3D%22%23575B66%22%20p-id%3D%221654%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M800.55367%20832.032253c-35.434907%200-63.989249%2028.554342-63.989249%2063.989249%200%2035.434907%2028.554342%2063.989249%2063.989249%2063.989249s63.989249-28.554342%2063.989249-63.989249C864.54292%20860.586595%20835.816563%20832.032253%20800.55367%20832.032253L800.55367%20832.032253z%22%20fill%3D%22%23575B66%22%20p-id%3D%221655%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M864.026877%20800.037628%20344.200235%20800.037628c-46.099782%200-86.695112-36.466991-92.199563-83.082815l-54.356459-382.043339L166.853687%20156.360826c-1.892155-15.653284-16.169326-28.382328-29.930455-28.382328L95.983874%20127.978498c-17.717453%200-31.994625-14.277171-31.994625-31.994625s14.277171-31.994625%2031.994625-31.994625l40.767344%200c46.615824%200%2087.727196%2036.466991%2093.403662%2083.082815l30.790526%20177.86259L315.473879%20708.698135c1.720141%2014.793214%2015.309256%2027.350244%2028.726356%2027.350244l519.826642%200c17.717453%200%2031.994625%2014.277171%2031.994625%2031.994625S881.744331%20800.037628%20864.026877%20800.037628z%22%20fill%3D%22%23575B66%22%20p-id%3D%221656%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M384.279523%20672.05913c-16.685369%200-30.618512-12.729044-31.82261-29.586427-1.376113-17.545439%2011.868974-33.026709%2029.586427-34.230808l434.163615-31.994625c15.997312-0.172014%2029.414413-12.55703%2031.134554-26.834201l50.400134-288.295649c1.204099-10.664875-1.720141-22.533848-8.084663-29.758441-4.128339-4.644381-9.288762-7.052579-15.309256-7.052579L319.946246%20224.3064c-17.717453%200-31.994625-14.277171-31.994625-31.994625S302.400806%20159.973123%20319.946246%20159.973123l554.05745%200c24.426004%200%2046.959852%2010.148833%2063.301193%2028.554342%2018.749538%2021.157736%2027.178229%2050.744163%2023.565933%2081.706703l-50.400134%20288.467663c-5.504452%2044.895683-45.927768%2081.362674-92.027549%2081.362674l-431.755417%2031.82261C385.82765%20671.887116%20384.967579%20672.05913%20384.279523%20672.05913z%22%20fill%3D%22%23575B66%22%20p-id%3D%221657%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E",
		share_img:"data:image/svg+xml,%3Csvg%20t%3D%221689320478585%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%221464%22%20width%3D%2264%22%20height%3D%2264%22%3E%3Cpath%20d%3D%22M1009.777778%20503.466667l-443.733334-455.111111c-5.688889-5.688889-11.377778%200-11.377777%205.688888v267.377778C8.533333%20409.6%202.844444%20918.755556%2017.066667%20932.977778c0%200%2045.511111-48.355556%20164.977777-113.777778%2085.333333-48.355556%20224.711111-85.333333%20369.777778-102.4v261.688889c0%208.533333%2011.377778%2011.377778%2014.222222%205.688889l443.733334-480.711111z%20m-398.222222%20358.4v-199.111111l-36.977778-2.844445c-221.866667%208.533333-378.311111%2073.955556-497.777778%20156.444445%2076.8-275.911111%20267.377778-403.911111%20466.488889-438.044445l68.266667-2.844444v-199.111111l312.888888%20312.888888s8.533333%205.688889%208.533334%2014.222223-8.533333%2014.222222-8.533334%2014.222222l-312.888888%20344.177778z%22%20fill%3D%22%23545E68%22%20p-id%3D%221465%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E",
		customer_service_img:"data:image/svg+xml,%3Csvg%20t%3D%221689322270271%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%222369%22%20width%3D%22200%22%20height%3D%22200%22%3E%3Cpath%20d%3D%22M288.460645%20330.313136a36.351245%2036.351245%200%200%200-36.703237%2036.703237v102.02988a36.703237%2036.703237%200%200%200%2073.406475%200v-102.02988a36.351245%2036.351245%200%200%200-36.703238-36.703237z%22%20fill%3D%22%235F5F5F%22%20p-id%3D%222370%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M551.287184%20469.046253v-102.02988a36.703237%2036.703237%200%201%200-73.406475%200v102.02988a36.703237%2036.703237%200%200%200%2073.406475%200z%22%20fill%3D%22%235F5F5F%22%20p-id%3D%222371%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M767.906682%20469.046253v-102.02988a36.703237%2036.703237%200%201%200-73.406475%200v102.02988a36.703237%2036.703237%200%200%200%2073.406475%200z%22%20fill%3D%22%235F5F5F%22%20p-id%3D%222372%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M515.303931%200a418.583301%20418.583301%200%200%200-265.59448%20739.904624%2035.663259%2035.663259%200%200%200%2023.359514%208.815817%2034.815276%2034.815276%200%200%200%2027.727424-13.215726%2036.351245%2036.351245%200%200%200-4.383909-51.374932A342.744877%20342.744877%200%201%201%20515.303931%20763.392136a34.14329%2034.14329%200%200%200-25.599468%2011.007771L302.924345%20960.844032a37.07123%2037.07123%200%200%200%2025.599468%2063.134688%2034.14329%2034.14329%200%200%200%2025.599468-11.007771L530.631613%20836.782611A418.599301%20418.599301%200%200%200%20515.303931%200z%22%20fill%3D%22%235F5F5F%22%20p-id%3D%222373%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E",
		payment_success_img:"data:image/svg+xml,%3Csvg%20t%3D%221690425995421%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%225061%22%20width%3D%22200%22%20height%3D%22200%22%3E%3Cpath%20d%3D%22M512%201024C229.23264%201024%200%20794.76736%200%20512S229.23264%200%20512%200s512%20229.23264%20512%20512-229.23264%20512-512%20512zM283.92448%20484.07552l-41.8816%2055.84896%20223.41632%20209.4592%20339.77344-386.32448-32.57344-37.24288-307.2%20316.5184-181.53472-158.2592z%22%20fill%3D%22%2316AA68%22%20p-id%3D%225062%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E",
        is_set_meal_detail_from_menu:false,//是否超值套餐详情页返回
        is_set_meal_return:false,//是否从超值套餐界面返回
        is_video_show:0,
        BookLocationCheck: serverConfig.QRCodeVersion == 'release', //特码的我测试服要个屁判断距离点餐啊，不用测试啊？
        RMQDebug:false, //RMQ调试模式默认关闭，特码的这玩意会爆内存干你乃
        RMQclient: Object,
        loveInviterOpenid: '',
        loveSetMeal: '',
        platformShopId: serverConfig.platformShopId,
        RMQOpenStatus: false,
        QRCodeVersion: serverConfig.QRCodeVersion,
        RMQmsg_id: '',
        //alex
        QRCodeUrl: serverConfig.url,
        tempC3Idx: false,
        dishes_inf: [],
        newTemp: false, //判断是不是临时菜新增出来的
        unitList: [],
        dpzpeicai: [],
        SideDishList: [],
        tempShareNum: '',
        confirm_level: 0, // 确认级别，作用于各种按钮的操作，例如相对应订单和菜品的部长确认 0-不能修改 1-服务员 2-部长
        levellist: {},
        userInfo: null,
        position: '', // 职位
        shopid: '',
        lastShopid: '',
        helpdirectly: true,
        id: 0, // 用户id
        loginname: " ",
        area_name: '正在加载...',
        shopname: null,
        field: null,
        jurisdiction: [], //辖区下的桌位id
        hujiao: 0,
        hujiaolist: [], // 呼叫数组
        hujiaouserlist: [],
        thisisbgm: "/websocket/bgm/11250.wav",
        dingbgm: "/websocket/bgm/ding_music.wav",
        dingbgm3: "/websocket/bgm/ding_music3.wav",
        hiddenvieww: '',
        musicjiange: 5,
        menuListItem: [], //店铺菜单
        managementData: '', //是否有电子
        callRecord: [], //呼叫记录
        callRecords: [], //呼叫记录集合
        initial_cartList: [], // 直接加菜，购物车信息
        countarry: [],
        weightarry: [],
        helpOrderItem: [], // 帮客点餐的订单
        addtable: true,
        username: '',
        phonenumber: '',
        locationname: '',
        locationid: '',
        numberOfCalling: 0,
        needMusic: false,
        s1: -1,
        myDevice: null,
        imgUrl: [],
        searchInterval: 500, //菜单搜索时间间隔 0.5s 
        reconnectLimit: 0, //重连的次数
        callOrderCode: '', //作用于呼叫的订单在当日订单中显示

        lailiaojiagongdishesinf: [],

        user_id: '',
        dinnerTime: '',
        staffDetail: [],
        remark_normal: [], //标配 备注
        remark_cancel: [], //取消 备注
        remark_gift: [], //赠送 备注
        remark_taste: [], //口味选择
        city: "定位中",
        defaultCity: "", //市级
        defaultProvince: "", //省份
        defaultCounty: "",
        defaultCountyCache: "",
        defaultProvinceID: '',
        defaultCityID: "",
        defaultCountyID: "",
        countyList: [], //区级地区列表
        areaList: [], //商圈列表
        myLongitude: 0, //经度
        myLatitude: 0, //纬度
        storeCache: [],
        shopdetail: [],
        twoListDisId: 0, //主页点击菜品进来时记录的二级id
        threeListDisId: 0, //主页点击菜品进来时记录的三级id
        shopid: "",
        lastShopid: '',
        sumMonney: 0,
        cupNumber: 0,
        // shopid: 3443,
        cityIDResult: "",
        localtionCounty: "", //当前定位城市
        dinePhoneNumber: null, // 堂食电话
        isPosition: false, //是否定位
        operatingTime: '', //店铺营业时间(简单版))
        deposit_code: 0,
        qqmap: qqmap,
        orderListJump: false,

        //wechatAppId: "wx7601bb0ab62f48aa", //APPID
        //wsk: "b7362e5e2b5f32d9c314655b7b28de43",

        //------------------------微信支付专用-----------------------------
        //公众号appid(诗么普科技)
        appid: 'wx78455227a0fd853f',
        //服务商户号(诗么普科技公司)
        mch_id: '1525534221',
        //-----------------------------------------------------------------

        encryptedData: "",
        iv: "",
        // unionID: "on7mZ5c_fprVohwgiaKzzzDAbBYY",测试用unionID
        openid: "",
        unionID: "",
        // register: false, //是否注册

        selectStore: "",
        selectDishes: "",
        locationindex: false,
        img_url: "", // 门面照
        sharetitle: '', //菜品转发的内容
        sharetitle1: '', //请客吃饭转发的内容

        sex: "先生",
        jump: false,
        date: "",
        atime: "",
        time: "",
        userNum: "",
        selectedManagerId: 0,
        selectedManagerName: '',
        helporder: false,
        backorder: false,
        countDown_minister: false,
        countDown_waiter: false,
        eatin: false,
        nickName: "", //昵称
        avatarUrl: "", //头像
        show_toMenu: false,
        cartList: [], // 全局的购物车

        isAuthorize: false, // 是否授权
        isRegister: false, // 是否注册
        latitude: 0, //经纬度
        longitude: 0, //经纬度
        inviterId: '', // 邀请人的id
        needOpenSocket: true, // 是否需要打开webscoket
        isOpenSocket: false, // 是否需要打开webscoket
        socket_shopId: '', //当前连接的呼叫服务员的店铺id
        showModalQR: true, //搜索页面提示
        server_name: "test.fsmbdlkj.com",
        orderCode: "", //获取订单号
        level: 1, // 职务级别 1-服务员 2-部长

    selectSingleMallBaseGoods_url: serverConfig.url + '/evaluation/mall/selectSingleMallBaseGoods',//获取商城里的商品详情信息

    selectMallPersonalBenefit:serverConfig.url + '/evaluation/mall/selectMallPersonalBenefit',//获取个人收益
    selectMallBaseGoodsCollectList:serverConfig.url + '/evaluation/mall/selectMallBaseGoodsCollectList',//获取收藏的商品
    deleteMallBaseGoodsCollect:serverConfig.url + '/evaluation/mall/deleteMallBaseGoodsCollect',//获取收藏的商品
    insertMemberInfo:serverConfig.url + '/evaluation/mall/insertMemberInfo',//获取商城里的商品详情信息
    selectCustomerIsStaff:serverConfig.url + '/evaluation/mall/selectCustomerIsStaff',//获取商城里的商品详情信息
    //查询店铺信息
    selectMallPersonelMemberInfo:serverConfig.url + '/evaluation/mall/selectMallPersonelMemberInfo',
    selectCustomerIsStaff1:serverConfig.url + '/evaluation/mall/selectCustomerIsStaff1',//获取商城里的商品详情信息
    insertQrCodeMallBillMain:serverConfig.url + '/evaluation/mall/insertQrCodeMallBillMain',//添加扫码对应的订单
    //查询店铺信息

    execPGetBillDayCode:serverConfig.url + '/evaluation/mall/execPGetBillDayCode',//获取订单号
    checkCustomerPassword:serverConfig.url + '/evaluation/mall/checkCustomerPassword',//检查密码是否正确
  

    selectTop50Shop:serverConfig.url + "/evaluation/mall/selectTop50Shop",
    selectSingleShop: serverConfig.url + '/evaluation/mall/selectSingleShop',
		selectMallBillMainList_url: serverConfig.url + '/evaluation/mall/selectMallBillMainList',
    updateMallBillMainStatus_url: serverConfig.url + '/evaluation/mall/updateMallBillMainStatus', //更新订单状态
    updateMallBillDetailRefund:serverConfig.url + '/evaluation/mall/updateMallBillDetailRefund', //退款申请
    giveMallMemberVip:serverConfig.url + '/evaluation/mall/giveMallMemberVip', //退款申请
    insertMallBindRecord_url: serverConfig.url + "/evaluation/mall/insertMallBindRecord",
    updateDingKeLocation: serverConfig.url + "/evaluation/mall/updateDingKeLocation",
    selectMallBindRecordDingKe: serverConfig.url + "/evaluation/mall/selectMallBindRecordDingKe",

    //删除未付款的订单
    deleteMallBillMain_url: serverConfig.url + "/evaluation/mall/deleteMallBillMain",
    //充值会员账户余额抵扣
    deductionMallMemberTotalRechargeAmount_url: serverConfig.url + "/evaluation/mall/deductionMallMemberTotalRechargeAmount",
    //查询每个状态分别多少个订单
    selectMallBillMainStatusCount_url: serverConfig.url + "/evaluation/mall/selectMallBillMainStatusCount",
    //在订单列表里点付款按钮触发此接口获取具体收费相关的参数
    selectMallBillMainPaymentInfo_url: serverConfig.url + "/evaluation/mall/selectMallBillMainPaymentInfo",
    //查询可用的充值套餐规则
    selectMallMemberRechargeRuleShopUse: serverConfig.url + "/evaluation/mall/selectMallMemberRechargeRuleShopUse",
    //查询当前总余额
    selectMallMemberTotalRechargeAmount:serverConfig.url + "/evaluation/mall/selectMallMemberTotalRechargeAmount",
    //查询购物车数量
    selectMallBillShoppingCartTotalNumber: serverConfig.url + '/evaluation/mall/selectMallBillShoppingCartTotalNumber',
    insertMallMemberRechargeRecord:serverConfig.url + '/evaluation/mall/insertMallMemberRechargeRecord',
    insertMallMemberVipRechargeRecord:serverConfig.url + '/evaluation/mall/insertMallMemberVipRechargeRecord',
    //提交评论
    insertMallBillComment_url: serverConfig.url + '/evaluation/mall/insertMallBillComment',
    selectMallMemberBalance:serverConfig.url + '/evaluation/mall/selectMallMemberBalance',
    //查询单条充值记录
    selectMallMemberRechargeRecordById:serverConfig.url + '/evaluation/mall/selectMallMemberRechargeRecordById',
    
    //查询单条消费记录
    selectMallMemberConsumptionRecordById:serverConfig.url + '/evaluation/mall/selectMallMemberConsumptionRecordById',
    selectBatteryTotalAmount:serverConfig.url + '/evaluation/mall/selectBatteryTotalAmount',
    //查询会员推荐提成
    selectMallMemberStaffShopVo:serverConfig.url + '/evaluation/mall/selectMallMemberStaffShopVo',
    selectMallCsrMsgRecord_Old:serverConfig.url + '/evaluation/mall/selectMallCsrMsgRecord_Old',
    selectMallCsrMsgRecord_New:serverConfig.url + '/evaluation/mall/selectMallCsrMsgRecord_New',
    insertMallCsrMsgRecord:serverConfig.url + '/evaluation/mall/insertMallCsrMsgRecord',
    selectMallCsrCustomer_StorepersonnalDataShopId:serverConfig.url + '/evaluation/mall/selectMallCsrCustomer_StorepersonnalDataShopId',

    updateMallBillRiceDeliverySetStatus:serverConfig.url + '/evaluation/mall/updateMallBillRiceDeliverySetStatus',
    
    //查询素材
    selectMallBaseArticleMainByKeyWord:serverConfig.url + "/evaluation/mall/selectMallBaseArticleMainByKeyWord",
    
    //模板
    selectMallBaseGoodsMultiMediaTemplateMain:serverConfig.url + '/evaluation/mall/selectMallBaseGoodsMultiMediaTemplateMain',  

    //新增或者修改模板
    insertOrUpdateMallBaseArticleTemplateMain:serverConfig.url + '/evaluation/mall/insertOrUpdateMallBaseArticleTemplateMain',  

    //新增或者修改发送记录主表
    insertOrUpdateMallBaseArticleEffectMain:serverConfig.url + '/evaluation/mall/insertOrUpdateMallBaseArticleEffectMain',  
    
    insertOrUpdateMallBaseArticleEffectDetail:serverConfig.url + '/evaluation/mall/insertOrUpdateMallBaseArticleEffectDetail',  
    //查询商品图片
    selectMallBaseGoodsMultiMediaByGoodsId:serverConfig.url + '/evaluation/mall/selectMallBaseGoodsMultiMediaByGoodsId',
    
    //查询商品9宫格1
    selectMallBaseGoodsNineByGoodsId:serverConfig.url + '/evaluation/mall/selectMallBaseGoodsNineByGoodsId', 
    //查询已有模板
    selectMallBaseArticleTemplateMainByKeyWord:serverConfig.url + '/evaluation/mall/selectMallBaseArticleTemplateMainByKeyWord',

    selectMallBaseArticleTemplateMainById:serverConfig.url + '/evaluation/mall/selectMallBaseArticleTemplateMainById',

    deleteMallBaseArticleTemplateMain:serverConfig.url + '/evaluation/mall/deleteMallBaseArticleTemplateMain',
    selectSingleMallBaseDescription:serverConfig.url + '/evaluation/mall/selectSingleMallBaseDescription',

    selectMallBaseArticleEffectMain:serverConfig.url + '/evaluation/mall/selectMallBaseArticleEffectMain',
    selectMallBaseArticleEffectDetailByMainId:serverConfig.url + '/evaluation/mall/selectMallBaseArticleEffectDetailByMainId',
    selectAllDingMsgRecordDingKeFromMemberInfo:serverConfig.url + '/evaluation/mall/selectAllDingMsgRecordDingKeFromMemberInfo',
    selectDingMsgRecordNotReadTotal:serverConfig.url + '/evaluation/mall/selectDingMsgRecordNotReadTotal',
    selectMallColorGlobalTotalVoucher:serverConfig.url + '/evaluation/mall/selectMallColorGlobalTotalVoucher',
    insertMallOutfitPerson:serverConfig.url + '/evaone/mallOutfitPerson/insertMallOutfitPerson',
    mallOutfitAnyoneSendTask:serverConfig.url + '/evaone/mallOutfitAnyone/sendTask',
    mallOutfitAnyoneGetTaskResult:serverConfig.url + '/evaone/mallOutfitAnyone/getTaskResult',
    mallOutfitGoodsKeywordsSelectMallOutfitGoodsKeywordsByCustomerId:serverConfig.url + '/evaone/mallOutfitGoodsKeywords/selectMallOutfitGoodsKeywordsByCustomerId',
    mallOutfitGoodsKeywordsInsertMallOutfitGoodsKeywords:serverConfig.url + '/evaone/mallOutfitGoodsKeywords/insertMallOutfitGoodsKeywords',

    mallOutfitPersonUpdateMallOutfitPersonSetIsDefault:serverConfig.url + '/evaone/mallOutfitPerson/updateMallOutfitPersonSetIsDefault',

    mallOutfitRuleSelectMallOutfitRule:serverConfig.url + '/evaone/mallOutfitRule/selectMallOutfitRule',
    mallOutfitAnyoneDeleteMallOutfitAnyone:serverConfig.url + '/evaone/mallOutfitAnyone/deleteMallOutfitAnyone',

    mallOutfitPersonSelectAllMallOutfitPersonByCustomerId:serverConfig.url + '/evaone/mallOutfitPerson/selectAllMallOutfitPersonByCustomerId',
    mallOutfitAnyoneSelectMallOutfitAnyoneByCustomerId:serverConfig.url + '/evaone/mallOutfitAnyone/selectMallOutfitAnyoneByCustomerId',

    mallOutfitAnyoneSelectMallOutfitAnyoneByIds:serverConfig.url + '/evaone/mallOutfitAnyone/selectMallOutfitAnyoneByIds',

    
    mallOutfitAnyoneUpdateOssImageUrl:serverConfig.url + '/evaone/mallOutfitAnyone/updateOssImageUrl',
    mallOutfitPersonDeleteMallOutfitPerson:serverConfig.url + '/evaone/mallOutfitPerson/deleteMallOutfitPerson',
    mallOutfitPersonSelectDefaultMallOutfitPersonByCustomerId:serverConfig.url + '/evaone/mallOutfitPerson/selectDefaultMallOutfitPersonByCustomerId',

		UploadFile: serverConfig.url + "/WX Restaurant/UploadFile",
        insertWechatMsgRecord:'https://mb.fsmbdlkj.com/qiaoxin/insertWechatMsgRecord',//新增消息
        updateWechatMsgRecord_IsRead:'https://mb.fsmbdlkj.com/qiaoxin/updateWechatMsgRecord_IsRead',//修改当前状态
        selectWechatMsgRecord_Last:'https://mb.fsmbdlkj.com/qiaoxin/selectWechatMsgRecord_Last',//获取最后一条消息
        selectWeChatMsgRecord_QGQC_Customer:'https://mb.fsmbdlkj.com/qiaoxin/selectWeChatMsgRecord_QGQC_Customer',
        selectWeChatMsgRecord_QGQC_Customer_Page:'https://mb.fsmbdlkj.com/qiaoxin/selectWeChatMsgRecord_QGQC_Customer_Page',
        selectMallPlatformTotaAmountData:serverConfig.url + "/evaluation/mall/selectMallPlatformTotaAmountData",
        //顾客互绑
        selectShareCardInf: serverConfig.url + "/evaluation/selectShareCardInf",
        updateShareCardInf: serverConfig.url + "/evaluation/updateShareCardInf",
        addShareCardInf: serverConfig.url + "/evaluation/addShareCardInf",
        UpdataOrderConfirmTime: serverConfig.url + "/WX Restaurant/UpdataOrderConfirmTime",
        giveGiftByBind: serverConfig.url + "/evaluation/giveGiftByBind",
        getBindFacePrice: serverConfig.url + "/evaluation/getBindFacePrice",
        selectShopCustomerBindIncome_CommonPay: serverConfig.url + "/evaluation/selectShopCustomerBindIncome_CommonPay",
        insertShopCustomerMsgPublishMain: 'https://mb.fsmbdlkj.com/qiaoxin/insertShopCustomerMsgPublishMain',
        selectWechatMsgRecord_StaffToCustomer_Page: 'https://mb.fsmbdlkj.com/qiaoxin/selectWechatMsgRecord_StaffToCustomer_Page',
        selectWechatMsgRecord_StaffToCustomer_Old: 'https://mb.fsmbdlkj.com/qiaoxin/selectWechatMsgRecord_StaffToCustomer_Old',
        selectWechatMsgRecord_StaffToCustomer_New: 'https://mb.fsmbdlkj.com/qiaoxin/selectWechatMsgRecord_StaffToCustomer_New',
        selectShopCustomerMsgPublishMainWechatPerson: 'https://mb.fsmbdlkj.com/qiaoxin/selectShopCustomerMsgPublishMainWechatPerson',
        selectBindCustomerRecordDetailList_StorePersonnal: serverConfig.url + '/evaluation/selectBindCustomerRecordDetailList_StorePersonnal',
        selectBindCustomerRecordQgqcMainList_Customer: serverConfig.url + '/evaluation/selectBindCustomerRecordQgqcMainList_Customer',
        UploadAliYunFile: serverConfig.url + '/WX Restaurant/UploadAliYunFile',
        addLocationHistory: serverConfig.url + '/evaluation/addLocationHistory',
        staffBindCustomer: serverConfig.url + '/evaluation/staffBindCustomer',
        insertBindCustomerRecord: serverConfig.url + '/evaluation/insertBindCustomerRecord',
        //insertBindCustomerRecord: 'http://localhost:8080/evaluation_war/insertBindCustomerRecord',
        selectBindCustomerRecordCount_Customer: serverConfig.url + '/evaluation/selectBindCustomerRecordCount_Customer',
        updateFirstConsumeOfMemberInfo: serverConfig.url + '/evaluation/updateFirstConsumeOfMemberInfo',
        getTableNameByTableId: serverConfig.url + '/evaluation/getTableNameByTableId',
        addTicketRemark: serverConfig.url + '/evaluation/addTicketRemark',
        getTicketRemarkList: serverConfig.url + '/evaluation/getTicketRemarkList',
        delTicketCustomerAddress: serverConfig.url + '/evaluation/delTicketCustomerAddress',
        addTicketCustomerAddress: serverConfig.url + '/evaluation/addTicketCustomerAddress',
        updateTicketCustomerAddress: serverConfig.url + '/evaluation/updateTicketCustomerAddress',
        selectTicketCustomerAddress: serverConfig.url + '/evaluation/selectTicketCustomerAddress',
        updateTicketOrderNewStatus: serverConfig.url + '/evaluation/updateTicketOrderNewStatus',
        updateTicketDetailIsGive: serverConfig.url + '/evaluation/updateTicketDetailIsGive',
        selectTiktokVideoManagementByTiktokVideoName: serverConfig.url + '/evaluation/selectTiktokVideoManagementByTiktokVideoName',
        selectShopAvailableInfo: serverConfig.url + '/evaluation/selectShopAvailableInfo',
        getTikTokBookComboByPhone: serverConfig.url + '/tiktok_smp/getTikTokBookComboByPhone',
        updateTikTokBookIsBuyByUid: serverConfig.url + '/tiktok_smp/updateTikTokBookIsBuyByUid',
        selectGiveGiftRule: serverConfig.url + '/evaluation/selectGiveGiftRule',
        AddBindingRecord: serverConfig.url + '/WX Restaurant/AddBindingRecord',
        SelectPhoto: serverConfig.url + '/WX Restaurant/SelectPhoto',
        checkPasswordToPay: serverConfig.url + '/WX Restaurant/checkPasswordToPay',
        GetDishes: serverConfig.url + '/WX Restaurant/GetDishes',
        getCashierInfoNew: serverConfig.url + '/evaluation/getCashierInfoNew',
        getOrderApplyList: serverConfig.url + '/evaluation/getOrderApplyList',
        addFood: serverConfig.url + '/evaluation/addFood',
        addOrderApply: serverConfig.url + '/evaluation/addOrderApply',
        addNewCouponOrderApply:serverConfig.url + '/evaluation/addNewCouponOrderApply', //新人关注优惠券写入
        updateMemberInfoIsRegister: serverConfig.url + '/evaluation/updateMemberInfoIsRegister',
        getShopDiscountNameList: serverConfig.url + '/evaluation/getShopDiscountNameList',
        getShopListByUnionId: serverConfig.url + '/evaluation/getShopListByUnionId',
        updateFansSetting: serverConfig.url + '/evaluation/updateFansSetting',
        getFansSetting: serverConfig.url + '/evaluation/getFansSetting',
        addOrUpdatePublicFans: serverConfig.url + '/evaluation/addOrUpdatePublicFans',
        getSettingContent: serverConfig.url + '/evaluation/getSettingContent',
        delTableChoose: serverConfig.url + "/evaluation/delTableChoose",
        addTableManageChoose: serverConfig.url + "/evaluation/addTableManageChoose",
        DeleteChooseTableManageByOrderCode: serverConfig.url + "/WX Restaurant/DeleteChooseTableManageByOrderCode",
        WriteChooseTableManage: serverConfig.url + "/WX Restaurant/WriteChooseTableManage",
        UpdateUserSumOfStar: serverConfig.url + '/WX Restaurant/UpdateUserSumOfStar',
        GetQgqcDiscountSearchKeyWordDetailVo: serverConfig.url + '/WX Restaurant/GetQgqcDiscountSearchKeyWordDetailVo',
        selectShopPreferentid_url: serverConfig.url + '/evaluation/selectShopPreferentid', //获取优惠信息
        selectOneApplyCombo_url: serverConfig.url + '/evaluation/selectOneApplyCombo',
        AddPayMentRefund: serverConfig.url + "/WX Restaurant/AddPayMentRefund",
        //alex
        diancnaxing_domain_name: serverConfig.url + '/diancanxing',
        orther_domain_name: serverConfig.url + '/demofoshan-0.0.1-SNAPSHOT',
        orther_domain_name2: serverConfig.url + '/register_war',
        orther_domain_name3: serverConfig.url + '/WX Restaurant',

        imgUrl: serverConfig.url + "/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/",

        // 以下部分店铺部分信息为旧数据，以后店铺信息统一放在shopDetail里面
        shop_id: '', //店铺id  
        shop_name: '', //店铺名
        shop_address: '', //店铺地址
        shopNameValue: '',
        area: '',
        isLogin: false, //是否已经登录
        user_id: '',
        user_permission: [],

        listData: [],
        listDataAll: [],
        remark_normal: [], //标配 备注
        remark_cancel: [], //取消 备注
        remark_gift: [], //赠送 备注
        remark_taste: [], //口味选择
        Order_remark: "", //订单备注
        subSeatsBol: false, //分席判断
        subSeatsChar: '', //分席字符
        subSeatsNum: 0, //分席编号
        subSeatsList: [], //分席数组
        this_old_subList: [], //分席保留数组

        vipPhone: "",
        vipCard: "",
        getTicketWriteOffInfoByTicketDetailUuid: serverConfig.url + '/evaluation/getTicketWriteOffInfoByTicketDetailUuid',
        getShopUseMultipleDiscount: serverConfig.url + '/evaluation/getShopUseMultipleDiscountNew',
        beEnd: serverConfig.url + '/evaluation/beEnd',
        getComboListByCustomerId: serverConfig.url + '/evaluation/getComboListByCustomerId',
        getChoiceList: serverConfig.url + '/evaluation/getChoiceList',
        selectApplyComboByCustomerId: serverConfig.url + '/evaluation/selectApplyComboByCustomerId',
        agreeOrRefuse: serverConfig.url + '/evaluation/agreeOrRefuse',
        addChoose: serverConfig.url + '/evaluation/addChoose',
        getSetMealByStartUsing3: serverConfig.url + '/evaluation/getSetMealByStartUsing3',
        addApplyCombo: serverConfig.url + '/evaluation/addApplyCombo',
        getTreatInfoByCustomerId: serverConfig.url + '/evaluation/getTreatInfoByCustomerId',
        addTreatInfo: serverConfig.url + '/evaluation/addTreatInfo',
        selectOrderBelongUser: serverConfig.url + '/evaluation/selectOrderBelongUser',
        giveGoods: serverConfig.url + '/evaluation/giveGoods',
        getPayMentRefund_url: serverConfig.url + '/WX Restaurant/GetPayMentRefund',
        bindUser_url: serverConfig.url + '/evaluation/bindUser',
        addShareNum_url: serverConfig.url + '/evaluation/addShareNum',
        getDistributionInCome: serverConfig.url + '/evaluation/getDistributionInCome',
        updateIsPay_url: serverConfig.url + '/evaluation/updateIsPay',
        getImageCode_url: serverConfig.url + '/evaluation/getImageCode',
        getOneQrUuid: serverConfig.url + '/evaluation/getOneQrUuid',
        selectSetMealInfo_url: serverConfig.url + '/evaluation/selectSetMealInfo',
        
        
        selectMallBindRecordGoodsList_FenXiaoShouYi_Qgqc: serverConfig.url + '/evaluation/mall/selectMallBindRecordGoodsList_FenXiaoShouYi_Qgqc',
        selectMallBindRecordCount_FenXiaoShouYi_Qgqc: serverConfig.url + '/evaluation/mall/selectMallBindRecordCount_FenXiaoShouYi_Qgqc',

        updateMallMemberRechargeRecordBuyerAddressId: serverConfig.url +'/evaluation/mall/updateMallMemberRechargeRecordBuyerAddressId',
        selectMallPlatformMemberInfo_url: serverConfig.url +'/evaluation/mall/selectMallPlatformMemberInfo',
        insertMallBaseGoodsCollect:serverConfig.url +'/evaluation/mall/insertMallBaseGoodsCollect',
        insertMallBillShoppingCart_url:serverConfig.url + '/evaluation//mall/insertMallBillShoppingCart',
        selectMallBillShoppingCartCategoryCount:serverConfig.url + '/evaluation/mall/selectMallBillShoppingCartCategoryCount',  
        updateMallBillShoppingCart_url:serverConfig.url + '/evaluation//mall/updateMallBillShoppingCart',   
        selectMallBillShoppingCart_url:serverConfig.url + '/evaluation//mall/selectMallBillShoppingCart',
        deleteMallBillShoppingCart_url:serverConfig.url + '/evaluation//mall/deleteMallBillShoppingCart',   
        insertMallBillMain_url:serverConfig.url + '/evaluation/mall/insertMallBillMain',
        checkIsMallVip:serverConfig.url + '/evaluation/mall/checkIsMallVip',
        selectMerchandiseBillMainPayVo_url:serverConfig.url + '/evaluation/selectMerchandiseBillMainPayVo',
        selectMerchandiseWxPayDetailedExists_url:serverConfig.url + '/evaluation/selectMerchandiseWxPayDetailedExists',
        deleteCustomerShoppingCart_url:serverConfig.url + '/evaluation/deleteCustomerShoppingCart',
        selectMallBillCommentList_url: serverConfig.url + '/evaluation/mall/selectMallBillCommentList',

        selectDefaultMallBaseBuyerAddress_url:serverConfig.url + '/evaluation/mall/selectDefaultMallBaseBuyerAddress',

        selectStarById_url: serverConfig.url + '/evaluation/selectStarById',
        addStarByFocusPublic_url: serverConfig.url + '/evaluation/addStarByFocusPublic',
        selectAllSetMealInfo_url: serverConfig.url + '/evaluation/selectAllSetMealInfo',
        selectMallBaseGoodsList_url: serverConfig.url + '/evaluation/mall/selectMallBaseGoodsList',
        selectIndexMallBaseGoodsList_url: serverConfig.url + '/evaluation/mall/selectIndexMallBaseGoodsList',

        selectMallBillRiceDeliverySetList: serverConfig.url + '/evaluation/mall/selectMallBillRiceDeliverySetList',
        selectTop1MallBillRiceDeliverySetList: serverConfig.url + '/evaluation/mall/selectTop1MallBillRiceDeliverySetList',
        
        selectDingMsgRecordDingKeFromMemberInfo:serverConfig.url + '/evaluation/mall/selectDingMsgRecordDingKeFromMemberInfo',
        selectDingMsgRecordDingKeFromChat:serverConfig.url + '/evaluation/mall/selectDingMsgRecordDingKeFromChat',
        insertDingMsgRecord:serverConfig.url + '/evaluation/mall/insertDingMsgRecord',
        
        selectDingMsgRecord_New:serverConfig.url + '/evaluation/mall/selectDingMsgRecord_New',
        selectDingMsgRecord_Old:serverConfig.url + '/evaluation/mall/selectDingMsgRecord_Old',

        selectShopDescribes_url: serverConfig.url + '/evaluation/selectShopDescribes',
        selectPlatformTopCountSetMealInfo_url: serverConfig.url + '/evaluation/selectPlatformTopCountSetMealInfo',
        getCouponAllPage_url: serverConfig.url + '/evaluation/getCouponAllPage',
        updatePaymentDate: serverConfig.url + '/evaluation/updatePaymentDate',
        getIsAdvance: serverConfig.url + '/evaluation/getIsAdvance',
        updateIsAdvance: serverConfig.url + '/evaluation/updateIsAdvance',
        applyVouponUse: serverConfig.url + '/evaluation/applyVouponUse',
        GetQgqcSearchPageData: serverConfig.url + '/WX%20Restaurant/GetQgqcSearchPageData',
        getVouchersInfo: serverConfig.url + '/evaluation/getVouchersInfo',
        getOtherVouchersInfo: serverConfig.url + '/evaluation/getMultiCouponSale',
        getOtherVouchersUsed: serverConfig.url + '/evaluation/getOtherCouponOne',//获取店铺内已使用优惠券multi_coupon_use
        selectCouponUseIsUse: serverConfig.url + '/evaluation/selectCouponUseIsUse',//设置当前优惠券为已核销
        updateIsAdvanceDeposit: serverConfig.url + '/evaluation/updateIsAdvanceDeposit',
        deleteTicketByOrderId: serverConfig.url + '/evaluation/deleteTicketByOrderId',
        SelectTicketOrderDetailedWithSetMeal: serverConfig.url + '/evaluation/SelectTicketOrderDetailedWithSetMeal',

        //alex
        
        selectTicketOrderDetailByDetailId: serverConfig.url + "/evaluation/selectTicketOrderDetailByDetailId",
        selectComboConstitute: serverConfig.url + "/evaluation/selectComboConstitute",
        updateSetMealGood: serverConfig.url + '/evaluation/updateSetMealGood',
        getListByShopId_url: serverConfig.url + '/evaluation/getListByShopId',
        WxPublicGetList_Url: serverConfig.url + '/wxpublic/WXPublic/getList',
        GetDefaultRemark: serverConfig.url + '/WX Restaurant/GetDefaultRemark',
        toCancelConfirmDel: serverConfig.url + '/evaluation/toCancelConfirmDel',
        SelPublicFans_Url: serverConfig.url + '/wxpublic/WXPublic/selPublicFans',
        bindingRelationship_Url: serverConfig.url + '/evaluation/bindingRelationship',
        SavePeopleCoupons_Url: serverConfig.url + '/evaluation/savePeopleCoupons',
        SelectBindCustomerRecordPay_Url: serverConfig.url + '/evaluation/selectBindCustomerRecordPay',
        GetManagementCouponsList_Url: serverConfig.url + '/evaluation/getManagementCouponsList',
        UpdateCustomerByOpenId_Url: serverConfig.url + '/evaluation/updateCustomerByOpenId',
        updateCustomerAvatarUrlByOpenId: serverConfig.url + '/evaluation/updateCustomerAvatarUrlByOpenId',
        updateCustomerNameByOpenId: serverConfig.url + '/evaluation/updateCustomerNameByOpenId',
        updateCustomerPhoneByOpenId: serverConfig.url + '/evaluation/updateCustomerPhoneByOpenId',
        GetTableStatusByNum_Url: serverConfig.url + '/evaluation/getTableStatusByNum',
        GetShopSetUp_Url: serverConfig.url + "/WX Restaurant/GetShopSetUp",
        GiveOrderDetails: serverConfig.url + "/WX Restaurant/GiveOrderDetails",
        UpdateOrderDetailedOperation: serverConfig.url + '/WX Restaurant/UpdateOrderDetailedOperation',
        SelectJointSet: serverConfig.url + "/WX Restaurant/SelectJointSet",
        ProcessWriteOrder_url: serverConfig.url + "/WX Restaurant/ProcessWriteOrder",
        selectIfRemark: serverConfig.url + "/WX%20Restaurant/selectIfRemark",
        GetLadderVoucher: serverConfig.url + "/WX%20Restaurant/GetLadderVoucher",
        getScinfoByShopId: serverConfig.url + "/evaluation/getScinfoByShopId",
        GetSCInfoForSearchName: serverConfig.url + "/WX Restaurant/GetSCInfoForSearchName",
        getCooking: serverConfig.url + "/evaluation/getCooking",
        selectUnit: serverConfig.url + "/WX%20Restaurant/selectUnit",
        SelectDishesFoods: serverConfig.url + "/WX Restaurant/SelectDishesFoods",
        UpdateDishesInIngredients: serverConfig.url + "/WX Restaurant/UpdateDishesInIngredients",
        SelectAllDishes: serverConfig.url + "/WX Restaurant/SelectAllDishes",
        SelectPrinter_url: serverConfig.url + "/WX Restaurant/SelectPrinter", //查询当前商家的打印机信息
        updateTableSubSeatsId_url: serverConfig.url + "/foodMaterial_war/Servlet/updateTableSubSeatsId",
        ChangeTableServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/ChangeTableServlet",
        UpdateOrderDetailedNew_url: serverConfig.url + "/WX Restaurant/UpdateOrderDetailedForAllNew",
        UpdateOrderDetailedServing_url: serverConfig.url + "/WX Restaurant/UpdateOrderDetailedServing",
        GetFieldTable_url: serverConfig.url + "/WX Restaurant/GetFieldTable", // 查询大厅桌位信息
        SelectShopDetails_NEW_url: serverConfig.url + "/WX Restaurant/GetShopDetailes",
        GetHailInf_url: serverConfig.url + "/WX Restaurant/GetFields", // 查询大厅和包房信息
        GetQgqcDishesForNum_url: serverConfig.url + '/WX Restaurant/GetQgqcDishesForNum', //查询普通/超值/抢购 菜品/套餐
        WriteDishes_url: serverConfig.url + "/WX Restaurant/WriteDishes", //新增菜品
        UpdateDishes_url: serverConfig.url + "/WX Restaurant/UpdateDishes", //修改菜品信息
        AddDishesMaterial_url: serverConfig.url + "/WX Restaurant/AddDishesMaterial", //添加菜品
        GetTempSDishes_url: serverConfig.url + "/WX Restaurant/GetTempSDishes", //模糊搜索临时菜品详情
        DeleteDishes_url: serverConfig.url + "/WX Restaurant/DeleteDishes", //删除菜单中的一道菜，临时菜品用
        UpdateFieldInf_url: serverConfig.url + "/WX Restaurant/UpdateFieldInf",
        SelectDishesIC_url: serverConfig.url + "/WX Restaurant/SelectDishesIC", // 添加临时菜品，第一级类型
        SelectDishesPC_url: serverConfig.url + "/WX Restaurant/SelectDishesPC", // 添加临时菜品，第二级类型
        SelectDishesSC_url: serverConfig.url + "/WX Restaurant/SelectDishesSC", // 添加临时菜品，第三级类型
        SelectTempDishesSC_url: serverConfig.url + "/WX Restaurant/SelectTempDishesSC", // 添加临时菜品，第三级临时类型
        DeleteFieldInf_url: serverConfig.url + "/WX Restaurant/DeleteFieldInf",
        AddFieldInf_url: serverConfig.url + "/WX Restaurant/AddFieldInf",
        DeleteRoomServlet_url: serverConfig.url + "/WX Restaurant/DeleteFieldInf",
        DeleteRoomImgServlet_url: serverConfig.url + "/WX Restaurant/DeleteFieldImg",
        SelectEatingMethod_url: serverConfig.url + "/WX Restaurant/SelectEatingMethod",
        SelectCountHelpOrder_url: serverConfig.url + "/WX Restaurant/SelectCountHelpOrderNew",
        GetShopOrderInf_url: serverConfig.url + "/WX Restaurant/GetShopOrderInfNew",
        AddTableInf_url: serverConfig.url + "/WX Restaurant/AddTableInf",
        WriteTable_url: serverConfig.url + "/WX Restaurant2/WriteTable",
        UpdateTableInf_url: serverConfig.url + "/WX Restaurant/UpdateTableInf",
        DeleteTableInf_url: serverConfig.url + "/WX Restaurant/DeleteTableInf",
        UpdateImg_url: serverConfig.url + "/WX Restaurant/UploadFieldImg",
        WriteHailImg_url: serverConfig.url + "/WX Restaurant/WriteFieldImg",
        SelectDishesSetMealTypeSel: serverConfig.url + "/WX Restaurant/SelectDishesSetMealTypeSel",
        Upload_url: serverConfig.url + "/WX Restaurant2/upload/",
        GetShopName_url: serverConfig.url + '/WX Restaurant/SelectShopName', //通过店名模糊查询商铺
        SelectCommissionrecordForShop_url: serverConfig.url + "/WX Restaurant/SelectCommissionrecordForShop",
        Shop_type_detailsServlet_url: serverConfig.url + "/demo1_war/servlet/shop_type_detailsServlet",
        SelectShopTypeIdServlet_url: serverConfig.url + "/demo1_war/servlet/selectShopTypeIdServlet",
        SelectShopTypeServlet_url: serverConfig.url + "/demo1_war/servlet/selectShopTypeServlet",
        SelectRoomImgServlet_url: serverConfig.url + "/demo1_war/servlet/selectRoomImgServlet", // 查询房间图片
        UpdateRoomServlet_url: serverConfig.url + "/demo1_war/servlet/updateRoomServlet",
        RoomImgIdServlet_url: serverConfig.url + "/demo1_war/servlet/roomImgIdServlet",
        AddRoomServlet_url: serverConfig.url + "/demo1_war/servlet/addRoomServlet",
        UploadServlet_url: serverConfig.url + "/demo1_war/servlet/uploadServlet",
        RoomImgServlet_url: serverConfig.url + "/demo1_war/servlet/roomImgServlet",
        LandmarkServlet_url: serverConfig.url + "/demo1_war/servlet/landmarkServlet",
        AddServeServlet_url: serverConfig.url + "/demo1_war/servlet/addServeServlet",
        DeletePhotoServlet_url: serverConfig.url + "/demo1_war/servlet/deletePhotoServlet",
        UpdateLandmarkServlet_url: serverConfig.url + "/demo1_war/servlet/updateLandmarkServlet",
        DeleteLandmarkServlet_url: serverConfig.url + "/demo1_war/servlet/deleteLandmarkServlet",
        UpdateRoomImgNameServlet_url: serverConfig.url + "/demo1_war/servlet/updateRoomImgNameServlet",
        Selectalluser_url: serverConfig.url + "/register_war/servlet/selectStorePersonnalServlet", // 查询所有员工信息
        UpdatePartitionServlet_url: serverConfig.url + "/register_war/servlet/updatePartitionServlet", // 更新辖区
        DeleteUsefulRuleByID_url: serverConfig.url + '/diancanxing/setMeal/deleteUsefulRuleByID',
        AddUsefulRule_url: serverConfig.url + '/diancanxing/setMeal/addUsefulRule',
        UpdateUsefulRuleByID_url: serverConfig.url + '/diancanxing/setMeal/updateUsefulRuleByID',
        UploadFileServlet_url: serverConfig.url + "/register_war/servlet/uploadFileServlet",
        AddShopTypeServlet_url: serverConfig.url + "/register_war/servlet/addShopTypeServlet",
        InsertTitle_url: serverConfig.url + "/demofoshan-0.0.1-SNAPSHOT/insertTitle",
        InsertTitle2_url: serverConfig.url + "/demofoshan-0.0.1-SNAPSHOT/insertTitle2",
        SelectTitleother_url: serverConfig.url + "/demofoshan-0.0.1-SNAPSHOT/selectTitleother",
        LoginServlet_url: serverConfig.url + "/register_war/servlet/loginServlet",
        AddShopServlet_url: serverConfig.url + "/register_war/servlet/addShopServlet",
        AddShopSearchRecord_url: serverConfig.url + "/diancanxing/shop/addShopSearchRecord",
        FindShopActInfServlet_url: serverConfig.url + "/web10_war/Servlet/FindShopActInfServlet",
        ShopNewActServlet_url: serverConfig.url + "/web10_war/Servlet/ShopNewActServlet",
        FindHelpInfServlet_url: serverConfig.url + "/web10_war/Servlet/FindHelpInfServlet",
        FindActNameServlet_url: serverConfig.url + "/web10_war/Servlet/FindActNameServlet",
        FindInitInfoServlet_url: serverConfig.url + "/web10_war/Servlet/FindInitInfoServlet",
        SendSmsServlet_url: serverConfig.url + "/register_war/servlet/sendSmsServlet",
        CheckCodeServlet_url: serverConfig.url + "/register_war/servlet/checkCodeServlet",
        CustomerServlet_url: serverConfig.url + "/register_war/servlet/customerServlet",
        OpenIdServlet_url: serverConfig.url + "/register_war/servlet/openIdServlet",
        AddCustomerServlet_url: serverConfig.url + "/register_war/servlet/addCustomerServlet",
        InvitePrizeServlet_url: serverConfig.url + "/register_war/servlet/invitePrizeServlet",
        SelectCountServlet_url: serverConfig.url + "/register_war/servlet/selectCountServlet",
        ManagementLoginServlet_url: serverConfig.url + "/register_war/servlet/managementLoginServlet",
        UpdateManagementServlet_url: serverConfig.url + "/register_war/servlet/updateManagementServlet",
        AlterPasswordServlet_url: serverConfig.url + "/register_war/servlet/alterPasswordServlet",
        SelectManagementServlet_url: serverConfig.url + "/register_war/servlet/selectManagementServlet",
        DeleteManagementServlet_url: serverConfig.url + "/register_war/servlet/deleteManagementServlet",
        AddManagementServlet_url: serverConfig.url + "/register_war/servlet/addManagementServlet",
        SelectPermissionsServlet_url: serverConfig.url + "/register_war/servlet/selectPermissionsServlet",
        UpdatePartitionHailServlet_url: serverConfig.url + "/register_war/servlet/updatePartitionHailServlet",
        UpdatePartitionRoomServlet_url: serverConfig.url + "/register_war/servlet/updatePartitionRoomServlet",
        SaveHailInfoServlet_url: serverConfig.url + "/register_war/servlet/saveHailInfoServlet",
        SaveRoomInfoServlet_url: serverConfig.url + "/register_war/servlet/saveRoomInfoServlet",
        DeletePartitionServlet_url: serverConfig.url + "/register_war/servlet/deletePartitionServlet",
        SelectPartitionServlet_url: serverConfig.url + "/register_war/servlet/selectPartitionServlet",
        SelectAreaNameServlet_url: serverConfig.url + "/register_war/servlet/selectAreaNameServlet",
        UpdateShopDetailsServlet_url: serverConfig.url + "/register_war/servlet/updateShopDetailsServlet",
        AddShopNicknameServlet_url: serverConfig.url + "/register_war/servlet/addShopNicknameServlet",
        UpdateShopNicknameServlet_url: serverConfig.url + "/register_war/servlet/updateShopNicknameServlet",
        DeleteShopNicknameServlet_url: serverConfig.url + "/register_war/servlet/deleteShopNicknameServlet",
        UpdateShopInformationServlet_url: serverConfig.url + "/register_war/servlet/updateShopInformationServlet",
        SelectShopNicknnameServlet_url: serverConfig.url + "/register_war/servlet/selectShopNicknnameServlet",
        UpdateStorePersonnalServlet_url: serverConfig.url + "/register_war/servlet/updateStorePersonnalServlet",
        AddStorepersonnalServlet_url: serverConfig.url + "/register_war/servlet/addStorepersonnalServlet",
        DeletestorePersonnalServlet_url: serverConfig.url + "/register_war/servlet/deletestorePersonnalServlet",
        StorePersonnalServlet_url: serverConfig.url + "/register_war/servlet/storePersonnalServlet",
        GetOneTablesInf_url: serverConfig.url + "/WX Restaurant/GetOneTablesInf", // 查询桌位信息
        SelectOneOrder_url: serverConfig.url + "/WX Restaurant/SelectOneOrder", // 查询订单详细信息,订单码查询
        SelectOneOrderByOrderId_url: serverConfig.url + "/WX Restaurant/SelectOneOrder1New", // 查询订单详细信息，订单Id查询
        GetCommissionrecordAndBindingrecord_url: serverConfig.url + '/WX Restaurant/GetCommissionrecordAndBindingrecord',
        SelectOneAddAccount_Url: serverConfig.url + '/WX Restaurant/SelectOneAddAccount',
        select_people_url: serverConfig.url + "/wx_table/testBoot/select_people",
        select_table_url: serverConfig.url + "/wx_table/testBoot/select_table",
        update_table_url: serverConfig.url + "/wx_table/testBoot/update",
        getShopDisServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/GetShopDisServlet",
        addDiscountServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/addDiscountServlet",
        updateKeywordServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/updateKeywordServlet",
        delectDiscountServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/DelectDiscountServlet",
        updataShopDiscountServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/UpdataShopDiscountServlet",
        addSetMealConstituteForAll_url: serverConfig.url + '/diancanxing/setMeal/addSetMealConstituteForAll',
        UploadSetMealController_url: serverConfig.url + '/WX Restaurant/UploadSetMealController',
        UploadSetMealImg_url: serverConfig.url + '/WX Restaurant/UploadSetMealImg',
        addSetMealInfo_url: serverConfig.url + '/diancanxing/setMeal/addSetMealInfo',
        selectShop_url: serverConfig.url + '/wx_table/testBoot/selectShop',
        AddCouponForNew_url: serverConfig.url + '/WX Restaurant/AddCouponForNew',
        selectUsefulRuleByID_url: serverConfig.url + '/diancanxing/setMeal/selectUsefulRuleByID',
        upadteSetMealConstituteTypee_url: serverConfig.url + '/diancanxing/setMeal/upadteSetMealConstituteType',
        upadteSetMealConstitute_url: serverConfig.url + '/diancanxing/setMeal/upadteSetMealConstitute',
        deleteSetMealConstitute_url: serverConfig.url + '/diancanxing/setMeal/deleteSetMealConstitute',
        deleteSetMealConstituteType_url: serverConfig.url + '/wx_table/testBoot/deleteSetMealConstituteType',
        addSetMealConstitute_url: serverConfig.url + '/diancanxing/setMeal/addSetMealConstitute',
        addSetMealPage_url: serverConfig.url + '/diancanxing/setMeal/AddSetMealPage',
        addSetMealApplyMerchantForList_url: serverConfig.url + '/diancanxing/setMeal/addSetMealApplyMerchantForList',
        deleteSetMealApplyMerchantForList_url: serverConfig.url + '/diancanxing/setMeal/deleteSetMealApplyMerchantForList',
        DeleteSetMealPage_url: serverConfig.url + '/diancanxing/setMeal/DeleteSetMealPage',
        updateSetMealInfoByID_url: serverConfig.url + '/diancanxing/setMeal/updateSetMealInfoByID',
        UpdateCouponForNew_url: serverConfig.url + '/WX Restaurant/UpdateCouponForNew',
        DeleteCoupon_url: serverConfig.url + '/WX Restaurant/DeleteCoupon',
        selectUsefulRuleByShopID_url: serverConfig.url + '/diancanxing/setMeal/selectUsefulRuleByShopID',
        tableUpdate_url: serverConfig.url + "/wx_table/testBoot/update",
        tableSelect_url: serverConfig.url + "/wx_table/testBoot/select_table",
        tableUpdateOrderinf_url: serverConfig.url + "/wx_table/testBoot/update_orderinf",
        toPayment: serverConfig.url + "/evaluation/toPayment",
        // search最近使用餐厅
        shopHistorySelect: serverConfig.url + "/evaluation/latelyRestaurant",
        // isCVerifyPw_url: serverConfig.url + "/evaluation/isCVerifyPw",
        isCVerifyPw_url: serverConfig.url + "/WX Restaurant/isCVerifyPw",

        SelectAllDishesAd: serverConfig.url + "/WX Restaurant/SelectAllDishesAd",

        getSettingList: serverConfig.url + "/evaluation/getSettingList",
        // ------------------------------------------------------------------------------------------------------------------//
        UpdateSetMealPage_url: serverConfig.url + '/diancanxing/setMeal/UpdateSetMealPage',
        SelectOrderDetailed_url: serverConfig.url + '/wx_table/testBoot/selectOrder_detailed',
        // ------------------------------------------------------切瓜切菜------------------------------------------------------//
        houduan_war_exploded_url: serverConfig.url + '/WX Restaurant/SelectMemberInfo', //根据电话号码查找卡号,等级
        SelectOneOrder2_url: serverConfig.url + '/evaluation/getTableForAddFood', //根据点单编号查找订单详情
        houduan_war_exploded2_url: serverConfig.url + '/houduan_war_exploded/SelectMemberInfo', //根据会员号查找订单详情
        GetDishesInfoForSearchName_url: serverConfig.url + '/WX Restaurant/GetDishesInfoForSearchName',
        GetDefaultRemark_url: serverConfig.url + "/WX Restaurant/GetDefaultRemark",
        AddConsignOrder_url: serverConfig.url + '/WX Restaurant/AddConsignOrder', // 寄存接口

        selectRule_url: serverConfig.url + '/wx_table/testBoot/selectRule',
        select_evaluation_url: serverConfig.url + '/wx_table/testBoot/select_evaluation',
        select_picevaluation_url: serverConfig.url + '/wx_table/testBoot/select_picevaluation',
        defaultQueryCity: serverConfig.url + "/WX Restaurant/GetAllCityByProvince", // 获取城市列表
        defaultQueryCounty: serverConfig.url + "/diancanxing/shop/cityIDQueryCounty", // 省级市ID获取市级
        defaultQueryArea: serverConfig.url + "/diancanxing/shop/countyIDQueryArea", // 市级ID获取商业区
        GetTableNowName_url: serverConfig.url + "/WX Restaurant/GetTableNowName", //获取第几个孖台
        selectOrderall_url: serverConfig.url + '/demofoshan-0.0.1-SNAPSHOT/selectOrderall',
        selectOrderList_url: serverConfig.url + '/demofoshan-0.0.1-SNAPSHOT/selectOrderList',
        selectTodayOrder_url: serverConfig.url + '/wx_table/testBoot/selectTodayOrder',
        GetEmAndEaBySubclassTypeId_url: serverConfig.url + '/WX Restaurant/GetEmAndEaBySubclassTypeId',
        AddEmBlock_url: serverConfig.url + '/WX Restaurant/AddEmBlockXCX',
        AddEatingMethod_url: serverConfig.url + '/WX Restaurant/AddEatingMethodXCX',
        CancelOrderDetailsQGQC: serverConfig.url + '/WX Restaurant/CancelOrderDetailsQGQC',


        getCouponByCouponId: serverConfig.url + '/evaluation/getCouponByCouponId',
        SelectStorePersonnalServlet_url: serverConfig.url + "/evaluation/selectStorePersonnalServlet",
        getConsumptionDetailed_url: serverConfig.url + '/evaluation/getConsumptionDetailed',
        updateDownPay: serverConfig.url + '/evaluation/updateDownPay',
        updateDownPayment: serverConfig.url + '/evaluation/updateDownPayment',
        updateNumberConfirmationFalse: serverConfig.url + '/evaluation/updateNumberConfirmationFalse',
        selectJurisdiction_url: serverConfig.url + "/evaluation/selectJurisdiction", //查询用户的辖区
        SelectActiveOrderRecordByOrderId_url: serverConfig.url + "/evaluation/SelectActiveOrderRecordByOrderId",
        SelectOrderDirectlyDishesByShopId_url: serverConfig.url + "/evaluation/SelectOrderDirectlyDishesByShopId",
        QueryTheNumberOfOrdersOnCalling_url: serverConfig.url + "/evaluation/QueryTheNumberOfOrdersOnCalling", //查询呼叫订单数量
        SelectTodayTakeawayOrderLists_url: serverConfig.url + "/evaluation/SelectTodayTakeawayOrderLists", // 获取当日外卖自提的订单
        addPicture_url: serverConfig.url + '/evaluation/addPicture', //点评
        selectFansRewardSetting_url: serverConfig.url + "/evaluation/selectFansRewardSetting",

        UpdateBiaoDan_url: serverConfig.url + "/evaluation/UpdateBiaoDan", //全订单属性选择
        schedulingWork_url: serverConfig.url + "/evaluation/SchedulingWork", //经理排工表提交
        AnswerCallWithOrder_url: serverConfig.url + "/evaluation/AnswerCallWithOrder",
        SelectIsConsume_url: serverConfig.url + "/evaluation/SelectIsConsume", //查询是否消费
        getStaffQRCode_url: serverConfig.url + "/evaluation/getStaffQRCode", // 生成部长二维码
        acceptPreRrders_url: serverConfig.url + "/evaluation/acceptPreRrders", // 套餐接受预购
        refusePreRrders_url: serverConfig.url + "/evaluation/refusePreRrders", // 套餐拒绝预购
        writeOffPackage_url: serverConfig.url + "/evaluation/writeOffPackage", // 核销套餐
        writeOffSelectNewBindCoupon_url: serverConfig.url +"/evaluation/writeOffSelectNewBindCoupon", //核销新人赠送优惠券
        selectOrderInfNewCoupon:serverConfig.url + '/evaluation/selectOrderInfNewCoupon',
        SelectAllJurisdiction_url: serverConfig.url + "/evaluation/SelectAllJurisdiction",
        selectNameByPhone: serverConfig.url + "/evaluation/SelectNameByPhone", //根据手机号查询用户名
        selectNameByPhone: serverConfig.url + "/evaluation/SelectNameByPhone", //根据手机号查询用户名
        AnswerCallWithoutOrder_url: serverConfig.url + "/evaluation/AnswerCallWithoutOrder", //回应订单呼叫部长
        SelectRecentEvaluation_url: serverConfig.url + "/evaluation/SelectRecentEvaluation", // 查询最近评价
        InsertActiveOrderRecord_url: serverConfig.url + "/evaluation/InsertActiveOrderRecord", //记录主动下单的菜品记录
        SelectPictureEvaluation_url: serverConfig.url + "/evaluation/SelectPictureEvaluation",
        // SelectNumsOfOrders_url:  "/evaluation/SelectNumsOfOrders", // 获取订单数量
        SelectNumsOfOrders_url: serverConfig.url + "/evaluation/SelectNumsOfOrdersNew", // 获取订单数量
        SelectIngredients_url: serverConfig.url + "/evaluation/SelectIngredients", //未完成 搜索店铺食材
        TransferOrderDetailed_url: serverConfig.url + '/evaluation/transferOrderDetailed', //转单
        SelectAllEvaluation_url: serverConfig.url + "/evaluation/SelectAllEvaluation", // 查询所有评价
        SelectEvaluationCount_url: serverConfig.url + "/evaluation/SelectEvaluationCount", // 查询图片数量
        DeleteJurisdiction_url: serverConfig.url + "/evaluation/deleteJurisdiction", //店铺管理_分区管理_删除该区
        SelectTodayOrderLists_url: serverConfig.url + "/evaluation/SelectTodayOrderListsNew", //究极获取单日订单
        SelectTableNameByTableID_url: serverConfig.url + "/evaluation/SelectTableNameByTableID", // 查找桌子名称
        selectActiveOrderDishes_url: serverConfig.url + "/evaluation/SelectActiveOrderDishes", //查询主动下单的菜品
        DeleteIngredientsByDishesId_url: serverConfig.url + "/evaluation/DeleteIngredientsByDishesId", //删除菜品食材
        CalculateDiscountInformation_url: serverConfig.url + "/evaluation/CalculateDiscountInformationNew", //部长确认打折用
        SelectTicketDetailsByOrderId_url: serverConfig.url + "/evaluation/selectTicketDetailsByOrderId", // 查询套餐订单
        CallEmployeeRecordsOnCalling_url: serverConfig.url + "/evaluation/CallEmployeeRecordsOnCalling", //查询当天呼叫记录信息，以员工进行区分
        whetherToOrderAccordingTheSeatInServer_url: serverConfig.url + "/evaluation/whetherToOrderAccordingTheSeatInServerNew", // 
        getOrderCode_url: serverConfig.url + "/evaluation/getOrderCode", //获取订单编码后五位
        SelectTicketOrdersByShopIdWithConditions_url: serverConfig.url + "/evaluation/SelectTicketOrdersByShopIdWithConditions", //查询套餐店铺套餐订单 带条件
        CreateOrderDetailedCartListByOrderIdWithTeat_url: serverConfig.url + '/evaluation/CreateOrderDetailedCartListByOrderIdWithTeat', //部长直接点餐，人头茶位
        UpdateOrderPayment_url: serverConfig.url + '/evaluation/UpdateOrderPayment', //修改订单价格
        updateAllConfirmation: serverConfig.url + '/evaluation/updateAllConfirmation', //修改订单价格
        updateNumberConfirmation: serverConfig.url + '/evaluation/updateNumberConfirmation', //修改订单价格
        CancelOrderRefuse: serverConfig.url + '/evaluation/CancelOrderRefuse', //修改订单价格

        // collection_websocket_url: serverConfig.url + "wss://test.fsmbdlkj.com/WX Restaurant/webSocket/",
        findUserInfoByOpenId: serverConfig.url + "/WX Restaurant/FindUserInfoByOpenId",
        updataUserOpenID: serverConfig.url + "/WX Restaurant/updataUserOpenID",
        CancelOrderDetails: serverConfig.url + "/WX Restaurant/CancelOrderDetails",

        getDishCategory: serverConfig.url + "/evaluation/getDishCategory", //获取早市，饭市的第三级类别
        SelectPrepaidDeposit: serverConfig.url + "/WX Restaurant/SelectPrepaidDeposit",
        CancelOrderDetailsNew: serverConfig.url + "/WX Restaurant/CancelOrderDetailsNew", //取消菜品
        printTotalOrder: serverConfig.url + "/WX Restaurant/printTotalOrder",


        selectUnCheckCountByOrderID_url: serverConfig.url + "/evaluation/SelectUnCheckCountByOrderID", //给订单列表添加未确认菜品数
        findTableDetail: serverConfig.url + "/evaluation/findTableDetail", //给订单列表添加未确认菜品数
        GetOneOrderInfo: serverConfig.url + "/WX Restaurant/GetOneOrderInfoNew",
        GetOrderSytle_url: serverConfig.url + "/WX Restaurant/GetOrderSytle",
        SelectEatingMethodWithSpecification: serverConfig.url + "/WX Restaurant/SelectEatingMethodWithSpecification",
        getOrderCode: serverConfig.url + '/evaluation/getOrderCode',
        GetOrderCountForTableIDByDay_url: serverConfig.url + '/WX Restaurant/GetOrderCountForTableIDByDay',
        SelectUserIDByShopIDAndTableID_url: serverConfig.url + '/WX Restaurant/SelectUserIDByShopIDAndTableID',
        GetTicketCode_url: serverConfig.url + '/WX Restaurant/GetTicketCode', //huoq接口
        ClearFile_url: serverConfig.url + '/WX Restaurant/ClearFile', //删除文件接口
        BindDyOpenIdServlet_url: serverConfig.url + '/register_war/servlet/bindDyOpenIdServlet',
        UpdateDyuser_url: serverConfig.url + "/WX Restaurant/UpdateDyuser",
        SelectDyuser_url: serverConfig.url + "/WX Restaurant/SelectDyuser",
        selectTicketOrdersByUnionId_url: serverConfig.url + "/evaluation/selectTicketOrdersByUnionId",
        selectTicketOrdersByOrderId_url: serverConfig.url + "/evaluation/selectTicketOrdersByOrderId",
        SelectSellingDiscount_url: serverConfig.url + '/WX Restaurant/SelectSellingDiscount', //查询售卖时段折扣
        SelectSideDish_url: serverConfig.url + '/WX Restaurant/SelectSideDish', //查询配菜
        SelectJointSet_url: serverConfig.url + '/WX Restaurant/SelectJointSet', //查询多拼粥品
        ClaimOrder_url: serverConfig.url + '/WX Restaurant/ClaimOrder',
        staffBindCustomer_url: serverConfig.url + '/evaluation/staffBindCustomer',
        SelectTicketOrdersByShopId_url: serverConfig.url + '/evaluation/selectTicketOrdersByShopId',
        UpdateOrderUserid_url: serverConfig.url + '/WX Restaurant/UpdateOrderUserid',
        whetherToOrderAccordingTheSeat_url: serverConfig.url + '/evaluation/whetherToOrderAccordingTheSeat',
        keyWordSearchCouponInfo_url: serverConfig.url + '/diancanxing/coupon/keyWordSearchCouponInfo',
        AddTicketOrderPayment_url: serverConfig.url + '/WX Restaurant/AddTicketOrderPayment',
        Addcommissionrecord_url: serverConfig.url + '/WX Restaurant/Addcommissionrecord',
        getOrderPayment: serverConfig.url + '/evaluation/getOrderPayment',
        AllinPay_url: serverConfig.url + "/WX Restaurant/AllinPay",
        selectEmBlockWithEatingMethodByDishesId_url: serverConfig.url + '/evaluation/selectEmBlockWithEatingMethodByDishesId', //单独查询吃法，输入dishes_id
        SelectDishesInfForNum_url: serverConfig.url + '/WX Restaurant/SelectDishesInfForNum',
        selectDishesServlet_url: serverConfig.url + '/foodMaterial_war/Servlet/selectDishesServlet', //随机出20个菜
        SelectcouponInfForNum_url: serverConfig.url + '/WX Restaurant/SelectcouponInfForNum',
        selectSetmealForNum_url: serverConfig.url + '/diancanxing/setMeal/selectSetmealForNum',
        // selectSetMealInfo_url: serverConfig.url + '/diancanxing/setMeal/selectSetMealInfo',
        selectCustomerInfByOpenId_url: serverConfig.url + '/evaluation/selectCustomerInfByOpenId',
        selectCustomerInfByOpenIdNew:serverConfig.url + '/evaluation/selectCustomerInfByOpenIdNew',
        SelectOneOrder1_url: serverConfig.url + '/WX Restaurant/SelectOneOrder1New',
        createTakeawayQRCode_url: serverConfig.url + '/evaluation/createTakeawayQRCode',
        ShopImgServlet_url: serverConfig.url + '/register_war/servlet/shopImgServlet',
        WriteShopImgServlet_url: serverConfig.url + '/register_war/servlet/writeShopImgServlet',
        WriteShopImg2Servlet_url: serverConfig.url + '/register_war/servlet/writeShopImg2Servlet',
        SelectAreaByCountyName_url: serverConfig.url + "/evaluation/SelectAreaByCountyName", // 城市名查询商业区
        CreateNewShop_url: serverConfig.url + "/evaluation/createNewShop", // 创建新店铺
        SelectShopByAmbiguousName_url: serverConfig.url + "/evaluation/SelectShopByAmbiguousName", // 模糊查询店铺名
        UpdataOrderDiscountLog_url: serverConfig.url + "/evaluation/UpdataOrderDiscountLog",
        addBalanceRecordServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/addBalanceRecordServlet",
        SelectDishesVideo_url: serverConfig.url + '/evaluation/SelectDishesVideo',
        UploadVideo_url: serverConfig.url + '/evaluation/UploadVideo',
        Getmenu_url: serverConfig.url + "/WX Restaurant/Getmenu",
        GetDishesSequence_url: serverConfig.url + "/WX Restaurant/GetDishesSequence",
        CalculatedPriceServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/CalculatedPriceServlet", //计算订单优惠金额
        addDepositServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/addDepositServlet", //订金表的数据增加
        updataDepositServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/updataDepositServlet", //订金表的数据修改
        selectDepositServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/selectDepositServlet", //订金表的数据查询
        getDishes_url: serverConfig.url + "/WX Restaurant/GetDishes",
        SelectOrderAllDetailedByOrderId_url: serverConfig.url + "/evaluation/SelectOrderAllDetailedByOrderId",
        SelectDiscountInformationByOrderId_url: serverConfig.url + "/evaluation/SelectDiscountInformationByOrderId", //查询打折信息
        selectOrderConfirmationInfByOrderID_url: serverConfig.url + '/evaluation/SelectOrderConfirmationInfByOrderID', //给单条订单添加确认信息
        selectOrderConfirmationsInfByOrderID_url: serverConfig.url + '/evaluation/SelectOrderConfirmationsInfByOrderID', //给订单列表添加确认信息
        SelectServicePicture_url: serverConfig.url + '/evaluation/SelectServicePicture',
        UploadServicePicture_url: serverConfig.url + "/evaluation/UploadServicePicture",
        GetShopHelpInfServlet_url: serverConfig.url + "/XDYT/Servlet/GetShopHelpInfServlet", //获取xdyt平台公告的所有文档数据
        selectTitle_url: serverConfig.url + "/demofoshan-0.0.1-SNAPSHOT/selectTitle", //获取星点云台拥有的分类
        GetDistanceServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/GetDistanceServlet", //计算经纬度之间的距离
        ManagementGetEasyDateServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/ManagementGetEasyDateServlet", //查询简便的营业时间
        SelectUserInfServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/SelectUserInfServlet", //通过用户open_id和shop_id查询user_inf表信息；
        UpdataPreStatusServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/UpdataPreStatusServlet", //给重整预存设置为充整成功
        czUseBooleanServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/czUseBooleanServlet", //判断该页面当前是否能使用充整
        addPreStoreServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/addPreStoreServlet",
        SelectCZInfServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/SelectCZInfServlet",
        addUserCashCouponServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/addUserCashCouponServlet",
        VipCalculateDiscountInformation: serverConfig.url + "/evaluation/VipCalculateDiscountInformation",
        getCashierInfo: serverConfig.url + "/evaluation/getCashierInfo",
        getOrderInfoByOrderId: serverConfig.url + "//WX Restaurant/getOrderInfoByOrderId",
        CancelVipCalculateDiscountInformation: serverConfig.url + '/evaluation/CancelVipCalculateDiscountInformation',
        selectOrderVipInfo: serverConfig.url + "/WX Restaurant/selectOrderVipInfo",
        GetOrderPaymentInf_url: serverConfig.url + "/WX Restaurant/GetOrderPaymentInf",
        GetConsignOrder_url: serverConfig.url + "/WX Restaurant/GetConsignOrder", // 寄存查询接口
        UpdateConsignOrder_url: serverConfig.url + "/WX Restaurant/UpdateConsignOrder", // 寄存修改接口
        UpdateOrderInfNew_url: serverConfig.url + "/WX Restaurant/UpdateOrderInfForAllNew",
        AddMemberInfo_url: serverConfig.url + "/WX Restaurant/AddMemberInfo", //添加顾客信息表
        UpdateMember_url: serverConfig.url + "/WX Restaurant/UpdateMember", //添加顾客信息表
        SelectMemberInfoIs_url: serverConfig.url + "/WX Restaurant/SelectMemberInfoIs", //查询顾客预存信息表


        updateTicketStatus: serverConfig.url + "/evaluation/updateTicketStatus",
        CuidanServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/cuidanServlet", // 获取人工还是
        ManagementGetDataServlet_url: serverConfig.url + "/evaluation/ManagementGetDataServlet", // 获取人工还是
        WriteOrder_url: serverConfig.url + "/WX Restaurant/WriteOrderNew",
        SynchronizedAmount_url: serverConfig.url + "/WX Restaurant/SynchronizedAmount", //加菜结束,修改菜品结束调用此接口
        SelectAllShopType_url: serverConfig.url + '/WX Restaurant/SelectAllShopType', //查询总的店铺类型
        SelectGpsServlet_url: serverConfig.url + '/demo1_war/servlet/selectGpsServlet',
        WriteOrderDetails_url: serverConfig.url + "/WX Restaurant/WriteOrderDetailsNew",
        // UpdateOrderInf_url: "/WX Restaurant/UpdateOrderInf",
        DeleteOrder_url: serverConfig.url + "/WX Restaurant/DeleteOrder",
        UpdateOrderInf_url: serverConfig.url + "/WX Restaurant/UpdateOrderInfForAll",
        GetOrderDetails_url: serverConfig.url + "/WX Restaurant/GetOrderDetailsNew",
        GetOrderPaymentInf_url: serverConfig.url + "/WX Restaurant/GetOrderPaymentInf",
        UpdateOrderPaymentInf_url: serverConfig.url + "/WX Restaurant/UpdateOrderPaymentInf",
        // UpdateOrderDetailed_url: "/WX Restaurant/UpdateOrderDetailed",
        UpdateOrderDetailed_url: serverConfig.url + "/WX Restaurant/UpdateOrderDetailedForAll",
        DeleteOrderdetailed_url: serverConfig.url + "/WX Restaurant/DeleteOrderdetailed", //删除单个菜品
        UpdateOrderDetails_url: serverConfig.url + "/WX Restaurant/UpdateOrderDetails", //批量更新数据
        GetFreeTableInf_url: serverConfig.url + "/WX Restaurant/GetFreeTableInf",
        GetOrderInf_url: serverConfig.url + "/WX Restaurant/GetOrderInfNew",
        GetOrderInf1_url: serverConfig.url + "/WX Restaurant/GetOrderInf1",
        GetTablesInf_url: serverConfig.url + "/WX Restaurant/GetTablesInf",
        GetShopDetailes_url: serverConfig.url + "/WX Restaurant/GetShopDetailes",
        SelectShopDetails_url: serverConfig.url + "/register_war/servlet/selectShopDetailsServlet",
        SelectPhotoServlet_url: serverConfig.url + "/demo1_war/servlet/selectPhotoServlet",
        SelectServeServlet_url: serverConfig.url + "/demo1_war/servlet/selectServeServlet",
        SelectShopImgServlet_url: serverConfig.url + "/register_war/servlet/selectShopImgServlet",
        SelectLandmarkServlet_url: serverConfig.url + "/demo1_war/servlet/selectLandmarkServlet",
        GetUserOpenid_url: serverConfig.url + "/WX Restaurant/GetUserOpenid",
        UserLogin_url: serverConfig.url + "/WX Restaurant/UserLogin",
        UserRegistration_url: serverConfig.url + "/WX Restaurant/UserRegistration",
        GetDishesSpec_url: serverConfig.url + "/WX Restaurant/GetDishesSpec",
        UpdateDishesPoint_url: serverConfig.url + "/WX Restaurant/UpdateDishesPoint",
        GetOneVipInfo: serverConfig.url + "/WX Restaurant/GetOneVipInfo",
        advanceDeposit: serverConfig.url + "/evaluation/advanceDeposit",
        advanceDepositBefore: serverConfig.url + "/evaluation/advanceDepositBefore",
        // advanceDepositBefore: serverConfig.url + "/evaluation/advanceDepositBefore",
        getOrderLike_url: serverConfig.url + "/evaluation/getOrderLike",
        SelectHail_url: serverConfig.url + "/WX Restaurant/GetFields",
        SelectTable_url: serverConfig.url + "/WX Restaurant/GetFieldTable",
        SelectRoomServlet_url: serverConfig.url + "/WX Restaurant/GetFields",
        SelectHailImg_url: serverConfig.url + "/WX Restaurant/GetFieldImg",
        UpdateUserInf_url: serverConfig.url + "/WX Restaurant/UpdateUserInf",
        SelectShopCzRule_url: serverConfig.url + "/WX Restaurant/SelectShopCzRule",
        CreateCoupon_url: serverConfig.url + "/WX Restaurant/CreateCoupon",
        SelectCoupon_url: serverConfig.url + "/WX Restaurant/SelectCoupon",
        AddAddAccount_url: serverConfig.url + "/WX Restaurant/AddAddAccount",
        SelectSelectEatingMethod_url: serverConfig.url + "/WX Restaurant/SelectEatingMethod",
        GetDinnerTime_url: serverConfig.url + "/foodMaterial_war/Servlet/ManagementGetDataServlet",
        SelectOrderConfirmationInfByUserId_url: serverConfig.url + "/evaluation/SelectOrderConfirmationInfByUserId",
        RecordOrderConfirmationInf_url: serverConfig.url + "/evaluation/RecordOrderConfirmationInf", //记录操作信息
        ManagementGetShopStateServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/ManagementGetShopStateServlet", //获取是否在营业
        selectObjByMoney_url: serverConfig.url + '/evaluation/selectObjByMoney', //查询对应的预存额度
        openidQueryUserInfo_url: serverConfig.url + "/diancanxing/discount/openidQueryUserInfo", //openid查询用户信息
        selectpreferencemaxandmin_url: serverConfig.url + "/demofoshan-0.0.1-SNAPSHOT/selectpreferencemaxandmin", //查询预存活动优惠阈值
        discountRules_url: serverConfig.url + "/diancanxing/discount/discountRules", //加载优惠规则
        preStorageOrder_url: serverConfig.url + "/diancanxing/discount/preStorageOrder", //新增预存订单
        wxPreStorageOrder_url: serverConfig.url + "/diancanxing/pay/wxPreStorageOrder", //预存调起微信支付
        selectpreference_url: serverConfig.url + '/demofoshan-0.0.1-SNAPSHOT/selectpreference', //查询对应的预存额度
        SelectPreStoreServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/SelectPreStoreServlet", //获取用户预存明细
        UpdataPreBalanceServlet_url: serverConfig.url + "/foodMaterial_war/Servlet/UpdataPreBalanceServlet", //预存成功后，添加流水账
        GetTableNowName_url: serverConfig.url + "/WX Restaurant/GetTableNowName", //获取第几个孖台
        UpdateOrderInfForAll_url: serverConfig.url + "/WX Restaurant/UpdateOrderInfForAll", //更新餐桌 用餐时间等信息
        GetDishesSequence_url: serverConfig.url + "/WX Restaurant/GetDishesSequence", //获取菜品类别顺序
        KeyWordSearchSetMealInfo_url: serverConfig.url + "/diancanxing/setMeal/keyWordSearchSetMealInfo", //查询套餐
        Selectshopid_url: serverConfig.url + '/wx_table/testBoot/selectshopid',
        SelectTicketOrderInfo_url: serverConfig.url + '/WX Restaurant/SelectTicketOrderInfo',
        SelectTicketOrderDetailed_url: serverConfig.url + '/WX Restaurant/SelectTicketOrderDetailed',
        // SelectAppointment_url: serverConfig.url + '/wx_table/testBoot/selectAppointment',
        SelectAppointment_url: serverConfig.url + '/evaluation/selectAppointment',
        UpdateTicketOrderDetailed_url: serverConfig.url + '/WX Restaurant/UpdateTicketOrderDetailed',
        SelectConfirmation_url: serverConfig.url + '/wx_table/testBoot/selectConfirmation',
        DeleteTicketOrderInfo_url: serverConfig.url + '/WX Restaurant/DeleteTicketOrderInfo',
        whetherToPayAccordingTheSeat_url: serverConfig.url + "/evaluation/whetherToPayAccordingTheSeat", // 判断是否存在代付订单
        toCancelConfirm: serverConfig.url + "/evaluation/toCancelConfirm",

        // 2021/8/17在膳食掌柜那边拿的获取购物车信息的接口
        SelectOrderDetailedCartListByOrderId_url: serverConfig.url + '/evaluation/SelectOrderDetailedCartListByOrderIdNew', //获取订单中购物车信息

        allUrl: {
            GetQgqcMainPageData: serverConfig.url + '/WX Restaurant/GetQgqcMainPageData', // 获取商家页面信息
            getPhone: serverConfig.url + "/register_war/servlet/PhoneServlet", // 获取电话
            QGQCPhoneServlet: serverConfig.url + "/evaluation/QGQCPhoneServlet", // 获取电话 新接口
            whetherWin: serverConfig.url + "/evaluation/whetherWin", // 查询是否中奖
            getIntoFlag: serverConfig.url + "/WX Restaurant/GetIntoFlag", // 获取flag进去店铺           
            getUnionID: serverConfig.url + "/evaluation/openIdServletNew", // 获取UnionID
 
            defaultStoreSelect: serverConfig.url + "/WX%20Restaurant/GetQgqcKeyWordQueryShopFrom", // 搜索功能-搜索店铺列表
            getAllProvince: serverConfig.url + "/WX Restaurant/getAllProvince",
            defaultQueryCity: serverConfig.url + "/WX Restaurant/GetAllCityByProvince", // 获取城市列表
            defaultQueryCounty: serverConfig.url + "/diancanxing/shop/cityIDQueryCounty", // 省级市ID获取市级
            defaultQueryArea: serverConfig.url + "/diancanxing/shop/countyIDQueryArea", // 市级ID获取商业区
            defaultShopNearby: serverConfig.url + "/diancanxing/shop/shopNearby", // 获取附近的店铺
            defaultDishesSelect: serverConfig.url + "/WX%20Restaurant/GetQgqcKeyWordQueryDishesFrom", // 搜索功能-搜索菜品列表
            defaultWineSelect: serverConfig.url + "/WX%20Restaurant/GetQgqcKeyWordQueryWineFrom", // 搜索功能-搜索菜品列表
            defaultStoreCache: serverConfig.url + "/diancanxing/shop/shopHistory", // 最近使用的店铺
            defaultCityID: serverConfig.url + "/WX Restaurant/GetInfoByCityName", // 市级名换市级ID
            // defaultShopName: "/diancanxing/shop/shopIDQueryDetails",        // 店铺ID换店铺名字，图片，iD
            postUserInfo: serverConfig.url + "/register_war/servlet/addCustomerServlet", // 首次登录记录，邀请绑定
            updateUserInfo: serverConfig.url + "/register_war/servlet/customerServlet", // 更新注册数据
            selectInvite: serverConfig.url + "/evaluation/SelectInvite", // 查询星友，星盾
            isRegister: serverConfig.url + "/evaluation/SelectByUnionId", // 查询是否注册
            addStar: serverConfig.url + "/evaluation/AddStar", // 星盾收益
            selectInviteNew: serverConfig.url + "/evaluation/SelectInviteNew", // 查询星友，星盾
            getBindingRelationshipNum: serverConfig.url + "/evaluation/getBindingRelationshipNum", // 查询星友，星盾
            getOpenIdByCustomerId_url: serverConfig.url + "/evaluation/getOpenIdByCustomerId",
            invitationBinding: serverConfig.url + "/evaluation/InvitationBinding", // 绑定
            recordStarforce: serverConfig.url + "/evaluation/recordStarforce", // 判断关注增加5星盾
            favoriteShop: serverConfig.url + "/evaluation/FavoriteShop", // 收藏店铺
            isFavoriteShop: serverConfig.url + "/evaluation/isFavoriteShop", // 是否关注
            selectFavoriteShopByUnionId: serverConfig.url + "/evaluation/SelectFavoriteShopByUnionId", //查询店铺

            selectAllEvaluation: serverConfig.url + "/evaluation/SelectAllEvaluation", // 查询所有评价
            selectPictureEvaluation: serverConfig.url + "/evaluation/SelectPictureEvaluation", //查询带图评价
            selectRecentEvaluation: serverConfig.url + "/evaluation/SelectRecentEvaluation", // 查询最近评价
            selectPicture: serverConfig.url + "/evaluation/SelectEvaluationPicture", // 查询图片
            selectCount: serverConfig.url + "/evaluation/SelectEvaluationCount", // 查询图片数量
            selectIsConsume: serverConfig.url + "/evaluation/SelectIsConsume", // 查询是否最近在此店铺消费

            uploadAvatar: serverConfig.url + "/evaluation/UploadAvatar", // 上传头像
            uploadReview: serverConfig.url + "/evaluation/UploadReview", // 上传评价
            uploadImage: serverConfig.url + "/evaluation/UploadImage", // 上传图片


			bindingInviter: serverConfig.url + "/evaluation/BindingInviter", //绑定并增加星盾
			//新增绑定关系，用户点击了别人转发的链接或者扫描了别人生成的专门用于绑定的二维码跳转到商品详情页面的时候触发
			 
            selectCoinDetailByUnionId: serverConfig.url + "/evaluation/SelectCoinDetailByUnionId", //查询星盾明细图

            selectTableNameByTableID: serverConfig.url + "/evaluation/SelectTableNameByTableID", // 查找桌子名称
            selectCustomerDetail: serverConfig.url + "/evaluation/SelectCustomerDetail", // 查询客户详细信息
            updateAppellation: serverConfig.url + "/evaluation/UpdateAppellation", // 二维码点餐上传手机号和称呼
            selectRoomImgServlet: serverConfig.url + "/demo1_war/servlet/selectRoomImgServlet", // 查询包房图片
            getOneTablesInf: serverConfig.url + "/WX Restaurant/GetOneTablesInf", // 查询桌位信息	
            selectOneOrder: serverConfig.url + "/WX Restaurant/SelectOneOrder", // 查询订单详细信息
            wxPayPlusService: serverConfig.url + "/WX Restaurant/WxPayPlusService", // 测试支付用，
            wxPayPlusMallService: serverConfig.url + "/WX Restaurant/WxPayPlusMallService", // 调微信支付接口，

            wxPayService: serverConfig.url + "/WX Restaurant/WxPay", // 主体收款      
            wxPayPlusPreStoreService: serverConfig.url + "/WX Restaurant/WxPayPlusPreStoreService", //预存收费的支付接口
            wxPayProfitsharing: serverConfig.url + "/WX Restaurant/WxpayProfitsharing", // 分账接口，
            selectOneWxPayDetailed: serverConfig.url + "/WX Restaurant/SelectOneWxPayDetailed",            
            //商家商品查询支付明细
            selectOneMerchandiseWxPayDetailed:serverConfig.url + "/WX Restaurant/SelectOneMerchandiseWxPayDetailed",            
            getShopPreferentidInfo: serverConfig.url + "/evaluation/getShopPreferentidInfo",
            updatePayPW: serverConfig.url + "/evaluation/updatePayPW",
            server: serverConfig.url + "/WeChat applet/Server", //调用后台 api，使用 code 换取 openid 和 session_key  注：404，接口崩掉了
            sendSmsServlet: serverConfig.url + "/register_war/servlet/sendSmsServlet", // 获取验证码验证手机号（注册用）
            checkCodeServlet: serverConfig.url + "/register_war/servlet/checkCodeServlet", // 测试二维码

            insertMallBaseBuyerAddress:serverConfig.url + '/evaluation/mall/insertMallBaseBuyerAddress',
            selectMallBaseBuyerAddress:serverConfig.url + '/evaluation/mall/selectMallBaseBuyerAddress',
            updateMallBaseBuyerAddress:serverConfig.url + '/evaluation/mall/updateMallBaseBuyerAddress',
            deleteMallBaseBuyerAddress:serverConfig.url + '/evaluation/mall/deleteMallBaseBuyerAddress',
            WxPayPlusMallMemberRechargeRecordWxPayService: serverConfig.url + "/WX Restaurant/WxPayPlusMallMemberRechargeRecordWxPayService", //预存收费的支付接口
            WxPayPlusMallMemberVipRechargeRecordWxPayService: serverConfig.url + "/WX Restaurant/WxPayPlusMallMemberVipRechargeRecordWxPayService", //VIP收费的支付接口
            selectMallMemberConsumptionRecordByOpenid:serverConfig.url + '/evaluation/mall/selectMallMemberConsumptionRecordByOpenid',
            updateMallMemberConsumptionRecordIsCustomerConfirm:serverConfig.url + '/evaluation/mall/updateMallMemberConsumptionRecordIsCustomerConfirm',
        },
        taocan: {
            add_evaluation_url: serverConfig.url + '/wx_table/testBoot/add_evaluation',
            AddTicketOrderInfo_url: serverConfig.url + '/WX Restaurant/AddTicketOrderInfo',
            UpdateTicketOrderInfo_url: serverConfig.url + '/WX Restaurant/UpdateTicketOrderInfo',
            selectSetmeal_url: serverConfig.url + '/wx_table/testBoot/selectSetmeal',
            selectCoupon_url: serverConfig.url + '/wx_table/testBoot/selectCoupon',
            select_constitute_url: serverConfig.url + '/wx_table/testBoot/select_constitute',
            selectRule_url: serverConfig.url + '/wx_table/testBoot/selectRule',
            // select_evaluation_url: serverConfig.url +'/wx_table/testBoot/select_evaluation',
            select_evaluation_url: serverConfig.url + '/evaluation/select_evaluation',
            select_picevaluation_url: serverConfig.url + '/wx_table/testBoot/select_picevaluation',
            select_numvaluation_url: serverConfig.url + '/wx_table/testBoot/select_numvaluation',
            updataCoupon_url: serverConfig.url + '/wx_table/testBoot/updataCoupon',
            updataSetMeal_url: serverConfig.url + '/wx_table/testBoot/updataSetMeal'
        },
        callBz_url: serverConfig.url + "/evaluation/SendBzRabbitMqMsg",
        callFw_url: serverConfig.url + "/evaluation/SendFwRabbitMqMsg",
        SendRabbitMqMsg:serverConfig.url + "/evaluation/SendRabbitMqMsg",//自定义消息发送接口
        SendRabbitMqMsgWithExchange:serverConfig.url + "/evaluation/SendRabbitMqMsgWithExchange",//自定义消息发送接口
        web_src: serverConfig.url + "/wx_official/web/index.jsp", //公众号连接
        allImagesUrl: { //静态图片
            invite_Url: serverConfig.url + "/IMG/切瓜切菜/images/share.jpg", // 邀请图片
            invite_back_Url: serverConfig.url + "/IMG/切瓜切菜/images/back.jpg", // 邀请背景
        },
        // websocket_url: serverConfig.url.replace('https://','wss://') + `/evaluation/websocket`,
        customerInf: '', // 用户信息
        localSocket: {},
        RMQCallBack: function () {},
        RMQRefreshCB: function () {},
        openCollectionSocket: {},
        // 下单方式位置
        // 订单详情改变下单方式
        xdswidth: true,
        xdswidthnumber: 3,
        // 不同的加菜
        adddishes: true,

        // rabbitmq的操作
        customerId: "",
        hj: serverConfig.hj,
        mqtt_password: '',
        mqtt_url: '',
        mqtt_username: '',
        mqtt_queue_pre: '',
        mqtt_port: '',

    },
    // 全局确认信息记录
    // 类型、确认信息操作、菜品信息、订单id、操作人id
    // 因为有些地方一开始没有套餐确认信息，所以会有缺漏，全局是完整的
    recordConfirmationInf: function (type, value, item, order_id, user_id) {
        var that = this
        var object;
        console.log("记录确认信息")
        switch (type) {
            case 0: //订单信息
                // 1，确认买单=等待买单、2，确认出单、3，取消订单确认、4，全单打折、5，优惠信息确认、6，已买单、7,订单信息的操作确认
                console.log("订单信息：")
                object = {
                    "operator_type": type,
                    "shop_id": that.globalData.shopdetail.shop_id,
                    "order_id": order_id,
                    "user_id": user_id,
                    "operator_id": that.globalData.staffDetail.id,
                    "operator_name": that.globalData.staffDetail.name,
                    "order_operator": value,
                }
                break;
            case 1: //订单菜品信息
                // 1，膳食掌柜临时菜品下单、2，多种做法修改确认
                console.log("订单菜品信息：")
                var dishes_item = item
                object = {
                    "operator_type": type,
                    "shop_id": that.globalData.shopDetail.shop_id,
                    "order_id": order_id,
                    "user_id": user_id,
                    "operator_id": that.globalData.staffDetail.id,
                    "operator_name": that.globalData.staffDetail.name,
                    "dishes_detailed_id": dishes_item.id,
                    "dishes_id": dishes_item.dishes_id,
                    "dishes_name": dishes_item.dishes_name,
                    "dishes_specal_type": dishes_item.specal_type,
                    "dishes_operator": value,
                }
                break;
            case 2: // 部长反馈
                console.log("部长反馈信息：")
                object = {
                    "operator_type": type,
                    "shop_id": that.globalData.shopDetail.shop_id,
                    "user_id": user_id,
                    "order_id": order_id,
                    "operator_id": that.globalData.staffDetail.id,
                    "operator_name": that.globalData.staffDetail.name,
                    "remark": value,
                }
                break;
            case 3:
                console.log("套餐操作确认信息：")
                var package_item = item
                object = { // 套餐订单操作、注意套餐订单的order_id和普通的订单order_id不一样
                    "operator_type": type,
                    "shop_id": that.globalData.shopDetail.shop_id,
                    "user_id": user_id,
                    "order_id": order_id,
                    "operator_id": that.globalData.staffDetail.id,
                    "operator_name": that.globalData.staffDetail.name,
                    "package_id": parseInt(package_item.ticketInfo.setmealid),
                    "package_name": package_item.ticketInfo.setmealname,
                    "package_operator": value,
                    "package_type": 1, // 套餐还是代金券
                    "package_detailed_id": value == "套餐订单部长接单" ? -1 : package_item.orderDetail.id
                }
                break;
            default:
                return
        }
        console.log(JSON.stringify(object))
        wx.request({
            url: that.globalData.RecordOrderConfirmationInf_url,
            data: JSON.stringify(object),
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
                if (res.data == "success") {
                    console.log(value + '确认信息记录成功');
                } else {
                    console.log(value + '确认信息记录失败');
                }
            }
        })
    },
    // 删除数组方法,
    remove: function (array, val) {
        for (var i = array.length - 1; i > -1; i--) {
            if (array[i].substring(array[i].lastIndexOf('=') + 1, array[i].length) == val) {
                array.splice(i, 1);
            }
        }
    },
    // 删除某元素方法
    removen: function (array, val) { // 数组删除
        for (var i = array.length - 1; i > -1; i--) {
            if (array[i] == val) {
                array.splice(i, 1);
            }
        }
    },
    // 删除单个某元素方法
    removen1: function (array, val) { // 数组删除
        for (var i = array.length - 1; i > -1; i--) {
            if (array[i] == val) {
                array.splice(i, 1);
                break; // 现在需要删除单个元素
            }
        }
    },
    // 删除所有方法
    removeAll: function (array) {
        for (var i = array.length - 1; i > -1; i--) {
            array.splice(i, 1);
        }
    },
    tempArray: function (remark, tempArray) {
        var temps = ""
        var tempArray1 = []
        for (var x = 0; x < tempArray.length; x++) {
            if (remark.indexOf(tempArray[x]) == -1) {
                tempArray1.push(tempArray[x])
            }
        }
        temps = tempArray1.join("、")
        return temps
    },
    // 数组去重
    unique: function (arr) {
        if (!Array.isArray(arr)) {
            console.log('type error!')
            return
        }
        let res = [arr[0]]
        for (let i = 1; i < arr.length; i++) {
            let flag = true
            for (let j = 0; j < res.length; j++) {
                if (arr[i] === res[j]) {
                    flag = false;
                    break
                }
            }
            if (flag) {
                res.push(arr[i])
            }
        }
        return res
    },
    // 音效
    playmusic: function (e) {
        var that = this;
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src = serverConfig.url + '' + that.globalData.thisisbgm
        innerAudioContext.onPlay(() => {
            console.log('开始播放音效')
        })
        innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    },
 // 音效
  playding: function (e) {
    try{
        var that = this;
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src = serverConfig.url + '' + that.globalData.dingbgm;
        innerAudioContext.onPlay(() => {
            console.log('开始播放音效')
        })
        innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    }catch(e){

    }
    
  },
  playding3: function (e) {
    try{
        var that = this;
        const innerAudioContext = wx.createInnerAudioContext()
        innerAudioContext.autoplay = true
        innerAudioContext.src = serverConfig.url + '' + that.globalData.dingbgm3;
        innerAudioContext.onPlay(() => {
            console.log('开始播放音效')
        })
        innerAudioContext.onError((res) => {
            console.log(res.errMsg)
            console.log(res.errCode)
        })
    }catch(e){

    }
    
  },
    // 重置购物车信息，或者将订单菜品信息写入购物车
    resetOrderInf: function (type, order_id) {
        var that = this
        console.log("重置购物车")
        that.globalData.cartList = []
        that.globalData.sumMonney = 0
        that.globalData.cupNumber = 0
        that.globalData.userNum = ''
        that.globalData.date = ''
        that.globalData.time = ''
        that.globalData.atime = ''
        that.globalData.username = ''
        that.globalData.phonenumber = ''
        that.globalData.selectedManagerId = 0
        that.globalData.selectedManagerName = ''
        that.globalData.locationname = ''
        that.globalData.locationid = ''

    },

    GetOrderSytle: function (e) {
        let self = this
        wx.request({
            url: self.globalData.GetOrderSytle_url,
            method: 'POST',
            data: {
                shop_id: self.globalData.shopid,
                type_id: 0
            },
            header: {
                //设置参数内容类型为x-www-form-urlencoded
                'content-type': 'application/x-www-form-urlencoded',
            },
            success: function (res) {
                console.log(res)
                if (res.data.result.result == 1) {
                    console.log("获取订单属性成功")
                    if (res.data.object.length != 0) {
                        var listData = []
                        var listDataAll = []
                        for (var x of res.data.object) {
                            var item = {
                                value: x.orderStyleName,
                                checked: false
                            }
                            listData.push(item)
                            listDataAll.push(x.orderStyleName)
                        }
                        self.globalData.listData = listData
                        self.globalData.listDataAll = listDataAll
                    } else {
                        console.log("不存在订单属性")
                    }
                } else {
                    console.log("搜索不到订单属性")
                }
            }
        })
    },

    // 设置监听器
    watch: function (ctx, obj) {
        Object.keys(obj).forEach(key => {
            this.observer(ctx.data, key, ctx.data[key], function (value) {
                obj[key].call(ctx, value)
            })
        })
    },
    // 监听属性，并执行监听函数
    observer: function (data, key, val, fn) {
        Object.defineProperty(data, key, {
            configurable: true,
            enumerable: true,
            get: function () {
                return val
            },
            set: function (newVal) {
                if (newVal === val) return
                fn && fn(newVal)
                val = newVal
            },
        })
    },
    // 判断是否关注、注册
    getCustomerInfo: function (openid) {
        var that = this
        console.log(10086)
        if(that.globalData.isRegister = true&&that.globalData.isAuthorize == true&&that.globalData.caustomerId>0){
            if (that.getCustomerCallBack) {
                that.getCustomerCallBack(true)
            }
            if (that.globalData.user_phone) {
                wx.setStorageSync('phonenumber', that.globalData.user_phone)
            }
            //已调用过，则不调用了
            return;
        }

        if (openid != null && openid != '') {
            wx.request({
                url: that.globalData.selectCustomerInfByOpenId_url,
                data: {
                    openid: openid
                },
                header: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                success: function (res) {
                    if (res.data != null && res.data != '') { //有记录

                        that.globalData.caustomerId = res.data.id
                        that.globalData.customerInf = res.data
                        that.globalData.user_phone = res.data.phone
                        that.globalData.user_name = res.data.name
                        if (that.getCustomerCallBack) {
                            that.getCustomerCallBack(true)
                        }
                        if (res.data.phone) {
                            wx.setStorageSync('phonenumber', res.data.phone)
                        }
                        if (res.data.userCode != null && res.data.userCode != '') {
                            console.log('已经关注,并注册')
                            that.globalData.isRegister = true
                        } else {
                            console.log('已经关注，未注册')
                        }
                        that.globalData.isAuthorize = true
                        // } else {
                        //   // that.postUserInfo(res)
                        //   // that.globalData.isRegister = false
                        //   // that.globalData.isAuthorize = false
                        //   // console.log('未关注，未注册')
                        //   // that.postUserInfo()
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
    getWxUserInfo() {
      var that = this
      return new Promise(function (a, b) {
        wx.request({
          url: that.globalData.selectCustomerInfByOpenId_url,
          data: {
            openid: that.globalData.openid
          },
          header: {
            'content-type': 'application/json'
          },
          method: 'POST',
          success: res1 => {
            if (res1.data) {
              let obj = res1.data;
              that.globalData.customerInf = obj;
  
              if (!obj.name) {
                wx.getUserProfile({
                  desc: '用于完善资料信息',
                  success: (res) => {
                    let getUserInfoName = res.userInfo.nickName
                    that.globalData.username = getUserInfoName
                    wx.setStorageSync("userInfoName", getUserInfoName)
                    switch (res.userInfo.gender) {
                      case 0:
                        var sex = '未知'
                        break;
                      case 1:
                        var sex = '男'
                        break;
                      case 2:
                        var sex = '女'
                        break;
                    }
                    var data = {
                      avatarUrl: res.userInfo.avatarUrl ? res.userInfo.avatarUrl : 'https://thirdwx.qlogo.cn/mmopen/vi_32/POgEwh4mIHO4nibH0KlMECNjjGxQUq24ZEaGT4poC6icRiccVGKSyXwibcPq4BWmiaIGuG1icwxaQX6grC9VemZoJ8rg/132',
                      gender: sex,
                      country: res.userInfo.country,
                      province: res.userInfo.province,
                      name: res.userInfo.nickName ? res.userInfo.nickName : '微信用户',
                      openId: that.globalData.openid,
                    }
                    wx.request({
                      url: that.globalData.UpdateCustomerByOpenId_Url,
                      // url:'http://localhost:8887/evaluation_war/updateCustomerByOpenId',
                      data: JSON.stringify(data),
                      method: 'POST',
                      success: res => {
                        console.log(res);
                        a()
                      }
                    })
                  },
                  fail: res => {
                    b()
                  }
                })
              } else {
                a()
              }
            }
          }
        })
  
  
      })
    },
    getWxPublicFocus() {
        return new Promise((a, b) => {
            var that = this
            wx.request({
                url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
                data: {
                    unionId: that.globalData.unionID
                },
                success: res => {
                    if (res.data.list) {
                        console.log(res.data.list.isFocus, "关注")
                        that.globalData.isFocus = res.data.list.isFocus
                    } else {
                        that.globalData.isFocus = 0
                    }
                    a()
                },
                fail: res => {
                    b()
                }
            })
        })
    },
    // 呼叫的获取customerId
    getCustomerInfoHJ: function (openid) {
        var that = this
        if (openid != null && openid != '') {
            wx.request({
                url: that.globalData.selectCustomerInfByOpenId_url,
                data: {
                    openid: openid
                },
                header: {
                    'content-type': 'application/json'
                },
                method: 'POST',
                success: function (res) {
                    if (res.data != null && res.data != '') { //有记录

                        
                        

                        that.globalData.caustomerId = res.data.id
                        that.globalData.customerInf = res.data
                        if(that.globalData.customerInf.userCode){
                          if(that.globalData.customerInf.userCode!=''){
                            rmq.initSocket(that.globalData.customerInf.userCode)
                          }
                      }
                        that.globalData.user_phone = res.data.phone
                        that.globalData.user_name = res.data.name

                        // if (that.DYBookCallBack) {
                        //     that.DYBookCallBack(true)
                        // }//2022-8-24 抖音启动取消
                        if (res.data.userCode != null && res.data.userCode != '') {
                            console.log('已经关注,并注册')
                            that.globalData.isRegister = true
                        } else {
                            console.log('已经关注，未注册')
                        }
                        that.globalData.isAuthorize = true
                    } else {
                        that.postUserInfo(res)
                        that.globalData.isRegister = false
                        that.globalData.isAuthorize = false
                        console.log('未关注，未注册')
                        that.postUserInfo()
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

    // 获取UnionID
    selectUnionID: function () {
        var that = this
        console.log("selectUnionID被调用")

        if(that.globalData.unionID.length>10&&that.globalData.openid.length>10&&that.globalData.isAuthorize == true){
        
            if (that.globalData.openid) {
                that.getCustomerInfo(that.globalData.openid)
                that.getCustomerInfoHJ(that.globalData.openid)
            }
            if (that.getUnionIDCallBack) {
                that.getUnionIDCallBack(true)
            }
            return;
        }

        wx.login({
            success: function (res) {

                if (res.code) {
                  getApp().getOpenId(res.code);                
                }
            }
        })
    },

    getOpenId:function(code){
      var that=this;      
      wx.request({
        url: that.globalData.allUrl.getUnionID,        
        data: {
            code: code,
            encryptedData: "",
            iv: "",
            wechatAppId: that.getWechatAppId(),
            channel_type_path: that.globalData.channel_type_path        
        },
        header: {
            'content-type': 'application/json;charset=utf-8' // 默认值
        },
        method: 'POST',
        success: function (res) {
                  if(res.data.code==1){
                    that.globalData.unionID = res.data.data.unionId
                    that.globalData.openid = res.data.data.openid
                    console.log('app.js openid' + res.data.data.openid)
                    console.log('app.js unionID' + res.data.data.unionId)
                    console.log('app.js 获取unionId成功，用户已授权！')
                    that.globalData.isAuthorize = true

                    var customerInfo=res.data.data.customer;
                    console.log('customerInfo:');
                    console.log(customerInfo);
                    that.globalData.caustomerId = customerInfo.id
                    that.globalData.customerInf = customerInfo
                    that.globalData.user_phone = customerInfo.phone
                    that.globalData.user_name = customerInfo.name

                    if (res.data.data.openid) {
                        that.getCustomerInfo(res.data.data.openid)
                        that.getCustomerInfoHJ(res.data.data.openid)
                    }
                    if (that.getUnionIDCallBack) {
                        that.getUnionIDCallBack(true)
                    }
                  }
                    
                }
            });        

    },
    //记录首次用户登录信息,好像不好用  
    //11-04注释
    // postUserInfo(res) {
    //   var that = this
    //   console.log('首次记录用户信息')

    //   var openid = that.globalData.openid
    //   var unionId = that.globalData.unionID
    //   var focus_time = util.formatTime(new Date()) //关注时间，记为第一次授权时间

    //   console.log(focus_time)
    //   if (that.globalData.customerInf == null || that.globalData.customerInf.length == 0) {
    //     wx.getUserInfo({
    //       success: function (res) {
    //         that.globalData.city = res.userInfo.city,
    //           that.globalData.country = res.userInfo.country,
    //           that.globalData.province = res.userInfo.province,
    //           that.globalData.gender = res.userInfo.gender,
    //           that.globalData.name = res.userInfo.nickName,

    //           wx.request({
    //             // url: '/register_war/servlet/addCustomerServlet',
    //             url: that.globalData.allUrl.postUserInfo,
    //             data: {
    //               openid: openid,
    //               unionId: unionId,
    //               city: that.globalData.city,
    //               country: that.globalData.country,
    //               province: that.globalData.province,
    //               gender: that.globalData.gender,
    //               name: that.globalData.name,
    //               focus_time: focus_time,
    //             },
    //             header: {
    //               'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    //             },

    //             method: 'POST',
    //             success: function (res) {
    //               if (res.data == "success") {
    //                 console.log('首次关注成功')
    //                 that.globalData.isAuthorize = true
    //               } else {
    //                 console.log('首次关注失败')
    //               }
    //             },
    //             fail: function (res) {
    //               console.log('首次关注失败')
    //             }
    //           })
    //       },
    //       fail: function (res) {
    //         console.log(errMsg)
    //       }
    //     })
    //   }

    // },



    // 未完成
    undone: function () {
        wx.showModal({
            title: '提示',
            content: '功能暂未开放，敬请期待！',
        })
    },

    //获取店铺的管理信息
    getManagementDataServlet: function (e) {
        var that = this;
        var shop_id
        if (e) {
            shop_id = e
        } else {
            shop_id = that.globalData.shopid
        }
        wx.request({ //获取店铺信息，名称地址等,虽然不知道干嘛的，但是删掉，订单部分会报错
            url: that.globalData.ManagementGetDataServlet_url,
            data: {
                // shop_id: that.globalData.shop_id, //店铺 id
                shop_id: shop_id //店铺 id
            },
            success(res) {
                if (res.data != null) {
                    that.globalData.managementData = res.data.data
                    console.log("获取店铺的管理信息")
                }
            }
        })
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

    // 删除本地缓存
    delBtnClick: function () {
        var that = this;
        wx.removeStorage({
            key: 'menu',
            success: function (res) {
                console.log('menu' + '清除缓存')
            },
        })
        wx.removeStorage({
            key: 'menuItem',
            success: function (res) {
                console.log('menuItem' + '清除缓存')
            },
        })
    },

    getLocation: function () {
         let that = this
         console.log('获取定位')

        wx.getLocation({
            type: 'wgs84',
            success: function (res) {
                that.globalData.myLatitude = res.latitude,
                    that.globalData.myLongitude = res.longitude
                qqmap.reverseGeocoder({
                    location: {
                        latitude: that.globalData.myLatitude,
                        longitude: that.globalData.myLongitude
                    },
                    success: function (res) {
                        var a = res.result.address_component
                        //获取市和区（区可能为空）
                        var provinceName = a.province
                        var cityName = a.city
                        var countyName = a.district
                        var isPosition = true
                        //赋值给全局变量
                        that.globalData.defaultProvince = provinceName
                        that.globalData.defaultCity = cityName
                        that.globalData.defaultCounty = countyName
                        that.globalData.localtionCounty = countyName
                        that.globalData.isPosition = isPosition
                        //控制台输出结果
                        console.log(that.globalData.provinceName, that.globalData.countyName, that.globalData.myLatitude, that.globalData.myLongitude)
                        // that.selectCityID()
                    },
                    fail: function (res) {
                        console.log('获取地址失败' + res);
                    },
                    complete: function (res) {
                        console.log(res);
                    }
                })

            },
            fail: function (res) {
                console.log(res)
                if (res.errMsg == 'getLocation:fail auth deny') {
                    that.getSetting()
                }
            }
        })
    },

    getSetting: function () {
        var that = this;
        wx.getSetting({
            success: (res) => {
                if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
                    wx.showModal({
                        title: '是否授权当前位置',
                        content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
                        success: function (res) {
                            if (res.cancel) {
                                // that.setData({
                                //   isshowCIty: false
                                // })
                                wx.showToast({
                                    title: '授权失败',
                                    icon: 'none',
                                    duration: 1000
                                })
                            } else if (res.confirm) {
                                wx.openSetting({
                                    success: function (dataAu) {
                                        if (dataAu.authSetting["scope.userLocation"] == true) {
                                            wx.showToast({
                                                title: '授权成功',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                            //再次授权，调用getLocationt的API
                                            that.getLocation(that);
                                        } else {
                                            wx.showToast({
                                                title: '授权失败',
                                                icon: 'success',
                                                duration: 1000
                                            })
                                        }
                                    }
                                })
                            }
                        }
                    })
                } else if (res.authSetting['scope.userLocation'] == undefined) { //初始化进入
                    that.getLocation();
                } else { //授权后默认加载
                    that.getLocation();
                }
            }
        })
    },

    //用于生成uuid
    S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    },
    guid() {
        return (this.S4() + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4());
    },
    generateMinisterId() { //作用于WebSocket 新的用户id
        return this.globalData.shopid + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()
    },

    generateCustomerId() { //作用于WebSocket 新的用户id
        return this.globalData.shopid + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + "-" + this.S4() + this.S4() + this.S4()
    },

    // initSocket() {
    //   let that = this

    //   if (that.globalData.unionID != null && that.globalData.unionID != '' && that.globalData.shopid != '' && that.globalData.shopid != '') {
    //     var userhead = "yh"
    //     var uuid = "cms" + "-" + userhead + "-" + that.generateCustomerId();

    //     that.globalData.localSocket = wx.connectSocket({
    //       url: that.globalData.websocket_url,
    //       header: {
    //         'content-type': 'application/json',
    //         "hapiname": uuid,
    //         "acclimt": userhead,
    //         "unionid": that.globalData.unionID,
    //         "shopid": that.globalData.shopid,
    //       },
    //       success() {
    //         console.log(uuid,"1353app.js");
    //         console.log(userhead,"1353app.js");
    //         console.log(that.globalData.unionID,"1353app.js");
    //         console.log(that.globalData.shopid,"1353app.js");
    //         console.log('用户' + userhead + '加入会话');
    //       },
    //       fail() {
    //         console.log('用户 ' + uuid + ' 作为' + userhead + '加入会话失败')
    //       }
    //     })

    //     //版本库需要在 1.7.0 以上
    //     that.globalData.localSocket.onOpen(function (res) {
    //       console.log(that.globalData.localSocket,"1362app.js");
    //       console.log('WebSocket连接已打开！readyState=' + that.globalData.localSocket.readyState)
    //       console.log("当前连接店铺ID为：" + that.globalData.shopid)
    //       that.globalData.isOpenSocket = true
    //       that.globalData.socket_shopId = that.globalData.shopid
    //     })
    //     that.globalData.localSocket.onError(function (res) {
    //       console.log('WebSocket连接错误！readyState=' + that.globalData.localSocket.readyState)
    //       that.globalData.isOpenSocket = false
    //     })
    //     that.globalData.localSocket.onClose(function (res) {
    //       console.log('WebSocket连接已关闭！readyState=' + that.globalData.localSocket.readyState)
    //       that.globalData.isOpenSocket = false
    //       that.reconnect()
    //     })
    //     that.globalData.localSocket.onMessage(function (res) {
    //       // 用于在其他页面监听 websocket 返回的消息
    //       console.log(res,"app.js1379");
    //       that.globalData.callback(res)
    //     })

    //   }


    // },

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

    // reconnect: function () { // 重连技术,当需要连接的时候，并且没有连接上的时候重连
    //   var that = this
    //   // if (that.globalData.localSocket.readyState != 3) return;
    //   if (that.globalData.needOpenSocket == false) return;

    //   if (that.globalData.needOpenSocket && that.globalData.isOpenSocket == false) {
    //     if (that.globalData.reconnectLimit < 10) {
    //       var timer = setTimeout(() => {
    //         // that.initSocket() //先关掉再说，一直报错
    //         console.log("重新连接")
    //         clearTimeout(timer)
    //         that.globalData.reconnectLimit = that.globalData.reconnectLimit + 1
    //       }, 2000);
    //     } else {
    //       console.log('无法连接到webSocket服务器')
    //     }
    //   }
    // },

    // closeSocket() { // 断开连接，并且重置
    //   var that = this;
    //   if (that.globalData.localSocket.readyState == 1 || that.globalData.localSocket.readyState == 0) {
    //     that.globalData.needOpenSocket = false
    //     that.globalData.reconnectLimit = 0
    //     wx.closeSocket(function (res) {
    //       url: that.globalData.websocket_url
    //     })
    //   }
    // },

    //统一发送消息，可以在其他页面调用此方法发送消息
    // sendSocketMessage: function (msg) {
    //   let that = this
    //   return new Promise((resolve, reject) => {
    //     if (this.globalData.localSocket.readyState === 1) { // 当连接成功的时候，发送信息
    //       console.log('发送消息', msg)
    //       this.globalData.localSocket.send({
    //         data: JSON.stringify(msg),
    //         success: function (res) {
    //           resolve(res)
    //         },
    //         fail: function (e) {
    //           reject(e)
    //         }
    //       })
    //     } else {
    //       console.log('已断开')
    //     }
    //   })
    // },
    //创建websocket,作用于收款通知
    // collection_websocket: function () {
    //   var that = this

    //   wx.connectSocket({
    //     url: +that.globalData.shopid,
    //     // data: {

    //     // },
    //     header: {
    //       'content-type': 'application/x-www-form-urlencoded;'
    //     },
    //     method: 'post',
    //     success: function (res) {
    //       console.log('收款提醒，WebSocket连接创建', res)
    //       that.globalData.openCollectionSocket == 1
    //     },
    //     fail: function (err) {
    //       wx.showToast({
    //         title: '网络异常！',
    //       })
    //       console.log(err)
    //     },
    //   })
    // },
    getdatestr(today, addDayCount) {
        var dd;
        if (today) {
            dd = new Date(today);
        } else {
            dd = new Date();
        }
        dd.setDate(dd.getDate() + addDayCount); //获取AddDayCount天后的日期 
        var y = dd.getFullYear();
        var m = dd.getMonth() + 1; //获取当前月份的日期 
        var d = dd.getDate();
        if (m < 10) {
            m = '0' + m;
        };
        if (d < 10) {
            d = '0' + d;
        };
        return y + "-" + m + "-" + d;
    },

    getShopDetails: function (shop_id) { //获取店铺的详细信息
        let that = this
        wx.showLoading({
            title: '登录中...',
        })
        wx.request({
            url: that.globalData.SelectShopDetails_NEW_url,
            data: {
                Shop_id: shop_id
            },
            success: function (res) {
                if (res.data.result.result == 1) {
                    console.log("获取店铺信息成功")
                    that.globalData.shopDetail = res.data.object
                    that.globalData.isLogin = true
                    wx.redirectTo({
                        url: '../index/index',
                    })
                } else {
                    console.log("获取店铺信息失败")
                    that.globalData.isLogin = false
                    wx.showToast({
                        title: '获取店铺信息失败',
                        icon: 'none',
                        duration: 2000,
                        success: function () {
                            that.getShopDetails(shop_id)
                        }
                    })
                }
            },
            complete: () => {

                wx.hideLoading()
            }
        })
    },

    onLaunch: function (options) {
        var that = this;
        console.log("来源:");
        console.log(options);
        // var scene = '';

        // if(options.scene) {
        //   scene = decodeURIComponent(options.scene);
        // }
         var path='';
        if(options.path) {
          path = decodeURIComponent(options.path);
          that.globalData.channel_type_path=path;
          console.log(path);
        }
        // var query=options.query;
        // var str_query=JSON.stringify(query);
        // wx.showToast({
        //   title: ''+scene+' '+path,
        //   icon:'none'
        // })
        


        let accountInfo = wx.getAccountInfoSync();
        let appid = accountInfo.miniProgram.appId; // "wxfb6368d158c85cb7"小程序appid
        let envVersion = accountInfo.miniProgram.envVersion; // "develop"开发版
        let version = accountInfo.miniProgram.version; // 1.0.0 小程序版本号
        let oldVersion = wx.getStorageSync('version')
        if (envVersion == "release" && oldVersion) {
            let bbb = oldVersion.split('.')
            let ccc = version.split('.')
            if (bbb[0] < ccc[0] || bbb[1] < ccc[1] || bbb[2] < ccc[2]) {
                wx.clearStorage({
                    success: (res) => {
                        wx.setStorageSync('version', version)
                    },
                })
            }
        }
        
        that.selectUnionID()
        that.rabbitmqpassword()

        wx.loadFontFace({
          family: 'nainao',
          source: 'url("https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/sszg/nainao.ttf")',
          scopes: ['webview','native'],
          global: true,
          success: res=>{
            console.log(res.status)
          }
        })

        wx.loadFontFace({
          family: 'sanji',
          source: 'url("https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/sszg/sanji.ttf")',
          scopes: ['webview','native'],
          global: true,
          success: res=>{
            console.log(res.status)
          }
        })

        // 展示本地存储能力
        // var logs = wx.getStorageSync('logs') || []
        // logs.unshift(Date.now())
        // wx.setStorageSync('logs', logs)

        // this.globalData.myDevice = wx.getSystemInfoSync()

        // wx.onNetworkStatusChange(function(res) {
        //   wx.setStorageSync('onNetworkStatusChange', res)
        //   if (!res.isConnected) {
        //     wx.showLoading({
        //       title: '无网络',
        //     })
        //   }else{
        //     wx.hideLoading()
        //   }
        // })
        // 展示本地存储能力
        const logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        // 登录
      
        // 获取用户信息
        wx.getSetting({
            success: res => {
                if (res.authSetting['scope.userInfo']) {
                    // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                    wx.getUserInfo({
                        success: res => {
                            // 可以将 res 发送给后台解码出 unionId
                            that.globalData.userInfo = res.userInfo

                            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                            // 所以此处加入 callback 以防止这种情况
                            if (that.userInfoReadyCallback) {
                                that.userInfoReadyCallback(res)
                            }
                        }
                    })
                }
            }
        })
    },



    //判断是否是数字
    isNumber: function (val) {

        var regPos = /^\d+(\.\d+)?$/; //非负浮点数
        var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/; //负浮点数
        if (regPos.test(val) || regNeg.test(val)) {
            return true;
        } else {
            return false;
        }
    },

    //获取菜单
    getmenu: function () {
        var that = this
        console.log("获取菜单")
        var menuListItem = []
        wx.request({
            url: that.globalData.Getmenu_url,
            // url: "http://192.168.8.2:8080/WX%20Restaurant/Getmenu",
            data: {
                Shop_id: that.globalData.shopid
            },
            success: function (res) {

                // const menuList=JSON.stringify(res.data.object[0])
                // wx.setStorage({
                //   data: menuList,
                //   key: 'menuList',
                // })
                getApp().globalData.menuList = res.data.object[0]
                var sm = {
                    class1s: [{
                        class2: [{
                            dishesInfs: [],
                            shop_id: 19318,
                            subclass_type_id: 89990,
                            type_name: "每日特价",
                        }],
                        parent_type_dishesInfList: {},
                        parent_type_id: 89990,
                        type_name: "每日特价"
                    }],
                    class_i_id: 8990,
                    mainType: "每日特价",
                    specal_type: 5
                }
                var saleMenu = sm.class1s[0].class2[0].dishesInfs
                //取出菜单下所有菜品
                for (var a = 0; a < res.data.object[0].length; a++) {
                    for (var b = 0; b < res.data.object[0][a].class1s.length; b++) {
                        for (var c = 0; c < res.data.object[0][a].class1s[b].class2.length; c++) {
                            for (var d = 0; d < res.data.object[0][a].class1s[b].class2[c].dishesInfs.length; d++) {
                                let dishes = res.data.object[0][a].class1s[b].class2[c].dishesInfs[d]
                                if (dishes.everyday_price > 0 && dishes.weekend != -1) {
                                    saleMenu.push(dishes)
                                    console.log(dishes)
                                }
                                // delete dishes.shop_id
                                delete dishes.dishes_pricing
                                // delete dishes.subclass_type_id
                                delete dishes.dishes_discount
                                delete dishes.praise_points
                                delete dishes.commercial_area_id
                                delete dishes.county_id
                                delete dishes.city_id
                                // delete dishes.class_i_id
                                // delete dishes.parent_type_id
                                delete dishes.querendengji
                                // delete dishes.dishes_controller
                                delete dishes.recommendRoyalty
                                delete dishes.royaltyMoney
                                delete dishes.present
                                delete dishes.dishesNamePy
                                delete dishes.create_date
                                delete dishes.dishesNamePy
                                // res.data.object[0][a].class1s[b].class2[c].dishesInfs[d] = item
                                menuListItem.push(dishes)
                            }
                        }
                    }
                }
                //仅取出第一级类别第一项、第二级类别第一项、第三级类别第一项下的菜品
                if (res.data.object[0] != "") { // 这里为进去菜单页面看到的菜品
                    // 已经不需要存缓存，因为菜单包含菜品状态
                    // that.globalData.menu = res.data.object[0]
                    // that.globalData.menu1 = res.data.object[1]
                    that.globalData.menuItem = res.data.object[0][0].class1s[0].parent_type_dishesInfList
                    that.globalData.menuListItem = menuListItem

                    // 注解，星盾折扣菜现在和特价菜是没有区别的
                    if (that.menucallback) {
                        that.menucallback(true)
                    }
                } else {
                    console.log("该店没有录入菜品")
                }
                if (saleMenu.length > 0) {
                    getApp().globalData.saleMenu = sm
                    getApp().globalData.menuList.unshift(sm)
                } else {
                    getApp().globalData.saleMenu = sm
                }
            }
        })
    },

    //进入页面后的抖音判断
    dy_jump: function (e) {
        var that = this;
        //获取粘贴板内容，抖音相关功能
        setTimeout(function () {
            //要延时执行的代码
            wx.getClipboardData({
                success(res) {
                    console.log(res.data)
                    var clipboard = res.data
                    console.log('----------' + that.globalData.unionID + '--------')
                    if (that.globalData.unionID != '') {
                        // that.selectUnionID()
                        if (clipboard.indexOf('dy') == 0) {
                            console.log('检测到粘贴板有带有抖音的信息')
                            //获取相关的抖音订单，创建一个相关菜品的订单
                            console.log(clipboard)
                            wx.request({
                                url: that.globalData.SelectDyuser_url,
                                data: {
                                    dy_order_id: clipboard,
                                    unionId: ''
                                },
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                },
                                method: 'POST',
                                success: function (res) {
                                    var dy_list = res
                                    console.log(res)
                                    // console.log(that.globalData.user_id)
                                    //res.data.object[0].dy_code要经过裁剪，才能获得菜品信息，把mid:后的剪出来，再剪','获取每个菜品
                                    if (res.data.result.result == 1) {
                                        var dyuserid = res.data.object[0].dyUser.usid
                                        var taocanId = res.data.object[0].dyUser.dy_code.split('mid:')[1]
                                        taocanId = taocanId.replace(new RegExp(/( )/g), "");
                                        var taocan_id = taocanId.split(',');
                                        var s_id = (res.data.object[0].dyUser.dy_code.split('-mid:')[0])
                                        var shop_id = Number(s_id.split('sid:')[1])
                                        var dy_open_id = res.data.object[0].dyUser.dy_open_id
                                        console.log(taocan_id)

                                        //绑定当前dy_open_id到customer表中对应unionId的用户的dy_id
                                        wx.request({
                                            url: that.globalData.BindDyOpenIdServlet_url,
                                            data: {
                                                unionId: that.globalData.unionID,
                                                dy_open_id: dy_open_id
                                            },
                                            success: function (res) {
                                                console.log(res)
                                            }
                                        })
                                        //根据接口循环获取user_id,然后写入数据库中
                                        var user_id = ''
                                        wx.request({
                                            url: that.globalData.UserLogin_url,
                                            data: {
                                                Open_id: that.globalData.unionID,
                                                Shop_id: shop_id
                                            },
                                            success: function (res) {
                                                // app.getCustomerInfo(unionId) //获取用户信息
                                                console.log(res)
                                                if (res.data.object == null || res.data.object == 'null' || res.data.result == null || res.data.result.result == 0) {
                                                    wx.request({
                                                        url: that.globalData.UserRegistration_url,
                                                        data: {
                                                            Head_portrait_img: that.globalData.avatarUrl,
                                                            User_nickname: that.globalData.nickName,
                                                            Wx_openid: that.globalData.unionID,
                                                            Shop_id: shop_id
                                                        },
                                                        success: function (res) {
                                                            console.log(res)
                                                            console.log(that.globalData.unionID)
                                                            console.log(that.globalData.nickName)
                                                            console.log(that.globalData.avatarUrl)
                                                            user_id = res.data.object[0].user_id
                                                            console.log(that.globalData.user_phone)
                                                            console.log(that.globalData.user_name)
                                                            // var  a = dy_list.data.object[0].ticeketDetailed.length;
                                                            for (var a = 0; a < dy_list.data.object[0].ticeketDetailed.length; a++) {
                                                                var tc = dy_list.data.object[0].ticeketDetailed[a]
                                                                // 每个套餐的id都要分别下一张单
                                                                wx.request({
                                                                    url: that.globalData.taocan.AddTicketOrderInfo_url,
                                                                    // url: '/WX Restaurant/AddTicketOrderInfo',
                                                                    data: {
                                                                        "user_id": user_id, //?            
                                                                        "shop_id": shop_id, //截取
                                                                        "ticketNum": 1,
                                                                        "order_status": "0",
                                                                        "order_remark": "0",
                                                                        "ticket_id": tc.setMealID, //截取
                                                                        "ticket_type": 2, //2-超值套餐，1-优惠券，3-代金券
                                                                        "ticket_remark": "",
                                                                        "appointment": "0",
                                                                        "appointment_time": "",
                                                                        "order_name": tc.setMealName, //套餐名称
                                                                        "order_total": tc.price * 100, //套餐价格
                                                                        "detailed_count": 1,
                                                                        "orderNum": 1,
                                                                        "telephone": that.globalData.user_phone,
                                                                        "user_name": that.globalData.user_name
                                                                    },
                                                                    header: {
                                                                        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                                                    },
                                                                    method: 'POST',
                                                                    success: function (res) {
                                                                        console.log(res)

                                                                    }
                                                                })
                                                                //跳转到超值天地的'我的订单'
                                                                if (a == dy_list.data.object[0].ticeketDetailed.length - 1) {
                                                                    that.jump_taocan_list(dyuserid)
                                                                }
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    user_id = res.data.object[0].user_id
                                                    console.log(that.globalData.user_phone)
                                                    console.log(that.globalData.user_name)
                                                    // var  a = dy_list.data.object[0].ticeketDetailed.length;
                                                    for (var a = 0; a < dy_list.data.object[0].ticeketDetailed.length; a++) {
                                                        var tc = dy_list.data.object[0].ticeketDetailed[a]
                                                        // 每个套餐的id都要分别下一张单
                                                        wx.request({
                                                            url: that.globalData.taocan.AddTicketOrderInfo_url,
                                                            // url: '/WX Restaurant/AddTicketOrderInfo',
                                                            data: {
                                                                "user_id": user_id, //?            
                                                                "shop_id": shop_id, //截取
                                                                "ticketNum": 1,
                                                                "order_status": "0",
                                                                "order_remark": "0",
                                                                "ticket_id": tc.setMealID, //截取
                                                                "ticket_type": 2, //2-超值套餐，1-优惠券，3-代金券
                                                                "ticket_remark": "",
                                                                "appointment": "0",
                                                                "appointment_time": "",
                                                                "order_name": tc.setMealName, //套餐名称
                                                                "order_total": tc.price * 100, //套餐价格
                                                                "detailed_count": 1,
                                                                "orderNum": 1,
                                                                "telephone": that.globalData.user_phone,
                                                                "user_name": that.globalData.user_name
                                                            },
                                                            header: {
                                                                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                                            },
                                                            method: 'POST',
                                                            success: function (res) {
                                                                console.log(res)

                                                            }
                                                        })
                                                        //跳转到超值天地的'我的订单'
                                                        if (a == dy_list.data.object[0].ticeketDetailed.length - 1) {
                                                            that.jump_taocan_list(dyuserid)
                                                        }
                                                    }
                                                }
                                            }
                                        })

                                    } else if (res.data.result.result == 2) {
                                        //有带抖音id进来，但是id被用过，可能是再次下单，进行为操作订单判断
                                        wx.request({
                                            url: that.globalData.SelectDyuser_url,
                                            data: {
                                                dy_order_id: '',
                                                unionId: that.globalData.unionID
                                            },
                                            header: {
                                                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                            },
                                            method: 'POST',
                                            success: function (res) {
                                                console.log(res)
                                                var dy_list = res
                                                //res.data.object[0].dy_code要经过裁剪，才能获得菜品信息，把mid:后的剪出来，再剪','获取每个菜品
                                                if (res.data.result.result == 1) {
                                                    //为1才有订单
                                                    var dyuserid = res.data.object[0].dyUser.usid
                                                    var taocanId = res.data.object[0].dyUser.dy_code.split('mid:')[1]
                                                    taocanId = taocanId.replace(new RegExp(/( )/g), "");
                                                    var taocan_id = taocanId.split(',');
                                                    var s_id = (res.data.object[0].dyUser.dy_code.split('-mid:')[0])
                                                    var shop_id = Number(s_id.split('sid:')[1])
                                                    //根据接口循环获取user_id,然后写入数据库中
                                                    var user_id = ''
                                                    wx.request({
                                                        url: that.globalData.UserLogin_url,
                                                        data: {
                                                            Open_id: that.globalData.unionID,
                                                            Shop_id: shop_id
                                                        },
                                                        success: function (res) {
                                                            // app.getCustomerInfo(unionId) //获取用户信息
                                                            if (res.data.result == null || res.data.result.result == 0) {
                                                                wx.request({
                                                                    url: that.globalData.UserRegistration_url,
                                                                    data: {
                                                                        Head_portrait_img: that.globalData.avatarUrl,
                                                                        User_nickname: that.globalData.nickName,
                                                                        Wx_openid: that.globalData.unionID,
                                                                        Shop_id: shop_id
                                                                    },
                                                                    success: function (res) {
                                                                        user_id = res.data.object[0].user_id
                                                                        console.log(that.globalData.user_phone)
                                                                        console.log(that.globalData.user_name)
                                                                        // var  a = dy_list.data.object[0].ticeketDetailed.length;
                                                                        for (var a = 0; a < dy_list.data.object[0].ticeketDetailed.length; a++) {
                                                                            var tc = dy_list.data.object[0].ticeketDetailed[a]
                                                                            // 每个套餐的id都要分别下一张单
                                                                            wx.request({
                                                                                url: that.globalData.taocan.AddTicketOrderInfo_url,
                                                                                // url: '/WX Restaurant/AddTicketOrderInfo',
                                                                                data: {
                                                                                    "user_id": user_id, //?            
                                                                                    "shop_id": shop_id, //截取
                                                                                    "ticketNum": 1,
                                                                                    "order_status": "0",
                                                                                    "order_remark": "0",
                                                                                    "ticket_id": tc.setMealID, //截取
                                                                                    "ticket_type": 2, //2-超值套餐，1-优惠券，3-代金券
                                                                                    "ticket_remark": "",
                                                                                    "appointment": "0",
                                                                                    "appointment_time": "",
                                                                                    "order_name": tc.setMealName, //套餐名称
                                                                                    "order_total": tc.price * 100, //套餐价格
                                                                                    "detailed_count": 1,
                                                                                    "orderNum": 1,
                                                                                    "telephone": that.globalData.user_phone,
                                                                                    "user_name": that.globalData.user_name
                                                                                },
                                                                                header: {
                                                                                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                                                                },
                                                                                method: 'POST',
                                                                                success: function (res) {
                                                                                    console.log(res)
                                                                                }
                                                                            })
                                                                            if (a == dy_list.data.object[0].ticeketDetailed.length - 1) {
                                                                                that.jump_taocan_list(dyuserid)
                                                                            }
                                                                        }
                                                                    }
                                                                })
                                                            } else {
                                                                user_id = res.data.object[0].user_id
                                                                console.log(that.globalData.user_phone)
                                                                console.log(that.globalData.user_name)
                                                                // var  a = dy_list.data.object[0].ticeketDetailed.length;
                                                                for (var a = 0; a < dy_list.data.object[0].ticeketDetailed.length; a++) {
                                                                    var tc = dy_list.data.object[0].ticeketDetailed[a]
                                                                    // 每个套餐的id都要分别下一张单
                                                                    wx.request({
                                                                        url: that.globalData.taocan.AddTicketOrderInfo_url,
                                                                        // url: '/WX Restaurant/AddTicketOrderInfo',
                                                                        data: {
                                                                            "user_id": user_id, //?            
                                                                            "shop_id": shop_id, //截取
                                                                            "ticketNum": 1,
                                                                            "order_status": "0",
                                                                            "order_remark": "0",
                                                                            "ticket_id": tc.setMealID, //截取
                                                                            "ticket_type": 2, //2-超值套餐，1-优惠券，3-代金券
                                                                            "ticket_remark": "",
                                                                            "appointment": "0",
                                                                            "appointment_time": "",
                                                                            "order_name": tc.setMealName, //套餐名称
                                                                            "order_total": tc.price * 100, //套餐价格
                                                                            "detailed_count": 1,
                                                                            "orderNum": 1,
                                                                            "telephone": that.globalData.user_phone,
                                                                            "user_name": that.globalData.user_name
                                                                        },
                                                                        header: {
                                                                            'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                                                        },
                                                                        method: 'POST',
                                                                        success: function (res) {
                                                                            console.log(res)
                                                                        }
                                                                    })
                                                                    if (a == dy_list.data.object[0].ticeketDetailed.length - 1) {
                                                                        that.jump_taocan_list(dyuserid)
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    })

                                                }
                                            }
                                        })
                                    }
                                }
                            })
                        } else {
                            wx.request({
                                url: that.globalData.SelectDyuser_url,
                                data: {
                                    dy_order_id: '',
                                    unionId: that.globalData.unionID
                                },
                                header: {
                                    'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                },
                                method: 'POST',
                                success: function (res) {
                                    console.log(res)
                                    var dy_list = res
                                    //res.data.object[0].dy_code要经过裁剪，才能获得菜品信息，把mid:后的剪出来，再剪','获取每个菜品
                                    if (res.data.result.result == 1) {
                                        //为1才有订单
                                        var dyuserid = res.data.object[0].dyUser.usid
                                        var taocanId = res.data.object[0].dyUser.dy_code.split('mid:')[1]
                                        taocanId = taocanId.replace(new RegExp(/( )/g), "");
                                        var taocan_id = taocanId.split(',');
                                        var s_id = (res.data.object[0].dyUser.dy_code.split('-mid:')[0])
                                        var shop_id = Number(s_id.split('sid:')[1])
                                        //根据接口循环获取user_id,然后写入数据库中
                                        var user_id = ''
                                        wx.request({
                                            url: that.globalData.UserLogin_url,
                                            data: {
                                                Open_id: that.globalData.unionID,
                                                Shop_id: shop_id
                                            },
                                            success: function (res) {
                                                // app.getCustomerInfo(unionId) //获取用户信息
                                                if (res.data.result == null || res.data.result.result == 0) {
                                                    wx.request({
                                                        url: that.globalData.UserRegistration_url,
                                                        data: {
                                                            Head_portrait_img: that.globalData.avatarUrl,
                                                            User_nickname: that.globalData.nickName,
                                                            Wx_openid: that.globalData.unionID,
                                                            Shop_id: shop_id
                                                        },
                                                        success: function (res) {
                                                            user_id = res.data.object[0].user_id
                                                            console.log(that.globalData.user_phone)
                                                            console.log(that.globalData.user_name)
                                                            // var  a = dy_list.data.object[0].ticeketDetailed.length;
                                                            for (var a = 0; a < dy_list.data.object[0].ticeketDetailed.length; a++) {
                                                                var tc = dy_list.data.object[0].ticeketDetailed[a]
                                                                // 每个套餐的id都要分别下一张单
                                                                wx.request({
                                                                    url: that.globalData.taocan.AddTicketOrderInfo_url,
                                                                    // url: '/WX Restaurant/AddTicketOrderInfo',
                                                                    data: {
                                                                        "user_id": user_id, //?            
                                                                        "shop_id": shop_id, //截取
                                                                        "ticketNum": 1,
                                                                        "order_status": "0",
                                                                        "order_remark": "0",
                                                                        "ticket_id": tc.setMealID, //截取
                                                                        "ticket_type": 2, //2-超值套餐，1-优惠券，3-代金券
                                                                        "ticket_remark": "",
                                                                        "appointment": "0",
                                                                        "appointment_time": "",
                                                                        "order_name": tc.setMealName, //套餐名称
                                                                        "order_total": tc.price * 100, //套餐价格
                                                                        "detailed_count": 1,
                                                                        "orderNum": 1,
                                                                        "telephone": that.globalData.user_phone,
                                                                        "user_name": that.globalData.user_name
                                                                    },
                                                                    header: {
                                                                        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                                                    },
                                                                    method: 'POST',
                                                                    success: function (res) {
                                                                        console.log(res)
                                                                    }
                                                                })
                                                                if (a == dy_list.data.object[0].ticeketDetailed.length - 1) {
                                                                    that.jump_taocan_list(dyuserid)
                                                                }
                                                            }
                                                        }
                                                    })
                                                } else {
                                                    user_id = res.data.object[0].user_id
                                                    // var  a = dy_list.data.object[0].ticeketDetailed.length;
                                                    console.log(that.globalData.user_phone)
                                                    console.log(that.globalData.user_name)
                                                    for (var a = 0; a < dy_list.data.object[0].ticeketDetailed.length; a++) {
                                                        var tc = dy_list.data.object[0].ticeketDetailed[a]
                                                        // 每个套餐的id都要分别下一张单
                                                        wx.request({
                                                            url: that.globalData.taocan.AddTicketOrderInfo_url,
                                                            // url: '/WX Restaurant/AddTicketOrderInfo',
                                                            data: {
                                                                "user_id": user_id, //?            
                                                                "shop_id": shop_id, //截取
                                                                "ticketNum": 1,
                                                                "order_status": "0",
                                                                "order_remark": "0",
                                                                "ticket_id": tc.setMealID, //截取
                                                                "ticket_type": 2, //2-超值套餐，1-优惠券，3-代金券
                                                                "ticket_remark": "",
                                                                "appointment": "0",
                                                                "appointment_time": "",
                                                                "order_name": tc.setMealName, //套餐名称
                                                                "order_total": tc.price * 100, //套餐价格
                                                                "detailed_count": 1,
                                                                "orderNum": 1,
                                                                "telephone": that.globalData.user_phone,
                                                                "user_name": that.globalData.user_name
                                                            },
                                                            header: {
                                                                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                                                            },
                                                            method: 'POST',
                                                            success: function (res) {
                                                                console.log(res)
                                                            }
                                                        })
                                                        if (a == dy_list.data.object[0].ticeketDetailed.length - 1) {
                                                            that.jump_taocan_list(dyuserid)
                                                        }
                                                    }
                                                }
                                            }
                                        })

                                    }
                                }
                            })
                        }
                    } else {
                        if (clipboard.indexOf('dy') == 0) {
                            //第一次的新用户，带着抖音码进，就得申请授权
                        }
                    }
                }
            })
        }, 1000)
    },

    jump_taocan_list: function (dyuserid) {
        var that = this;
        wx.reLaunch({
            url: '/pages/main/main?dyuserid=' + dyuserid,
        })
    },

    //ATim-- 11-11 通信服务V2
    spawnUUID: function () {
        let s = [];
        let hexDigits = "0123456789abcdef";
        for (var i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4";
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
        let uuid = s.join("").replace("-", "");
        return uuid
    },
    // initSocket: function(caustomerId){
    //   let that = this
    //   //ATim--创建链接
    //   wx.connectSocket({
    //     url: 'wss://'+that.globalData.mqtt_url+'/ws',
    //     header: {
    //       login: that.globalData.mqtt_username,
    //       passcode: that.globalData.mqtt_password,
    //       'client-id': that.spawnUUID()
    //     },
    //     success() {
    //       that.initRabbitMQ(caustomerId)
    //     }
    //   })
    // },
    // initRabbitMQ: function(caustomerId){
    //   console.log('ATim--进入通信服务初始化')
    //   let that = this
    //   let client = Object
    //   function sendSocketMessage(msg) {
    //     if (socketOpen) {
    //       wx.sendSocketMessage({
    //         data: msg
    //       })
    //     }
    //   }
    //   function SocketClose(e){
    //     console.log(e)
    //     client._cleanUp()
    //   }
    //   function stdebug(e){
    //     console.log(e)
    //   }
    //   //ATim--定义websocket对象
    //   var ws = {
    //     send: sendSocketMessage,
    //     onopen: null,
    //     onmessage: null,
    //     close: SocketClose,
    //   }
    //   //ATim--打开链接
    //   wx.onSocketOpen(function (res) {
    //     console.log('ATim--WS连接已打开！')
    //     socketOpen = true
    //     ws.onopen && ws.onopen()
    //   })
    //   //ATim--关闭链接
    //   wx.onSocketClose(function (res) {
    //     SocketClose()
    //     socketOpen = false
    //     console.log('ATim--WS已关闭！')
    //     if (screenShow) {
    //       console.log('ATim--WS将在5秒后重连！')
    //       ws.onclose && ws.onclose(res)
    //       setTimeout(()=>{that.initSocket(that.globalData.caustomerId)},5000)
    //     }
    //   })
    //   //ATim--收到信息
    //   wx.onSocketMessage(function (res) {
    //     if (res && res.data) {
    //       let value = res.data;
    //       let code = value.charCodeAt(value.length - 1);
    //       if (code !== 0x00) {
    //         value += String.fromCharCode(0x00);
    //         res.data = value;
    //       }
    //     }
    //     ws.onmessage && ws.onmessage(res)
    //     if (res.data.charCodeAt(res.data) != 10){
    //       console.log('ATim--收到消息',res)
    //     }
    //   })
    //   //ATim--初始化链接部分
    //   client = Stomp.over(ws);
    //   let destination = serverConfig.hj + "_qgqc_" + caustomerId;
    //   console.log(destination)
    //   client.connect('smp', 'smp83131326', function (sessionId) {
    //     client.subscribe(destination, function (body, headers) {
    //       if(body.body.charCodeAt(0) == "123"){
    //         // console.log(JSON.parse(body.body))
    //         if (body.body.msg == "部长") {
    //           that.globalData.countDown_minister = false
    //         }
    //         if (body.body.msg == "服务员") {
    //           that.globalData.countDown_minister = false
    //         }
    //         that.globalData.RMQCallBack(JSON.parse(body.body))
    //       }
    //     },{'auto-delete':false,'x-message-ttl':30000,exclusive:false});
    //   })
    //   client.debug = stdebug
    // },

    rabbitmqpassword: function () {
        let that = this
        wx.request({
            url: serverConfig.url + '/WX%20Restaurant/SelectRabbitmqSetting',
            success(res) {
                that.globalData.rmqData = res.data.object
                that.globalData.is_video_show=res.data.object.is_video_show;
            }
        })
    },
    insertMemberInfoExec: function (shop_id,customer_openid) {
      console.log("insertMemberInfoExec:"+shop_id)
      console.log("enter_shop_id:"+shop_id)
      console.log("customer_openid:"+customer_openid)
      let that = this
     var channel_type_path=  that.globalData.channel_type_path
      wx.request({
          url: serverConfig.url + '/evaluation/mall/insertMemberInfo',
          method: "POST",
          data:{
            shop_id:shop_id,
            customer_openid:customer_openid,
            channel_type_path:channel_type_path,
          },
          success(res) {
            console.log('insertMemberInfoExec:');
             console.log(res)
          }
      })
  },
    chatWithCustDetail_GetNewMsg(chatObj){
        try {
            this.playding3();
            console.log("chatWithCustDetail_GetNewMsg");
            console.log(chatObj);
            let pages = getCurrentPages(); //获取当前界面的所有信息
            console.log(pages);
            
            if(pages.length<1){
              return;
            }
            console.log("chatWithCustDetail_GetNewMsg1");
            let curPage = pages[pages.length - 1];
          
       
            console.log("chatWithCustDetail_GetNewMsg2");

            //订单详情界面必须有这个函数
           
            //确保是订单详情界面的路径
            if(curPage){
                if(curPage.route){
                    
                    if(curPage.route.indexOf('pages/chatWithCust/chatWithCust')>=0){
                        console.log("查找到聊天列表界面")
                        curPage.selectWechatMsgRecord_Last(chatObj.wechat_type,chatObj.sender_id,chatObj.receiver_id);
                        return;
                      }
                      if(curPage.route.indexOf('pages/chatWithCustDetail/chatWithCustDetail')>=0){
                        console.log("查找到聊天界面")
                        curPage.getNewData();
                      }
                      if(pages.length>1){
                            var prePage= pages[pages.length - 2];
                            if(prePage){
                                if(prePage.route){
                                    
                                    if(prePage.route.indexOf('pages/chatWithCust/chatWithCust')>=0){
                                    console.log("查找到聊天列表界面")
                                    prePage.selectWechatMsgRecord_Last(chatObj.wechat_type,chatObj.sender_id,chatObj.receiver_id);
                                    }
                
                                }
                            }
                    }
                }
            }
            

            

           
        

        } catch (error) {
            console.log("chatWithCustDetail_GetNewMsg err");
            console.log(error)
        }
    },


    chatwithcrs_GetNewMsg(chatObj){
      try {
          this.playding3();
          console.log("chatwithcrs_GetNewMsg");
          console.log(chatObj);
          let pages = getCurrentPages(); //获取当前界面的所有信息
          console.log(pages);
          
          if(pages.length<1){
            return;
          }
          console.log("chatwithcrs_GetNewMsg");
          let curPage = pages[pages.length - 1];
        
     
          console.log("chatwithcrs_GetNewMsg");

          //订单详情界面必须有这个函数
         
          //确保是订单详情界面的路径
          if(curPage){
              if(curPage.route){
                    if(curPage.route.indexOf('pages/chatwithcrs/chatwithcrs')>=0){
                      console.log("查找到聊天界面")
                      curPage.getNewData();
                    }
              }
          }
      

      } catch (error) {
          console.log("chatWithCustDetail_GetNewMsg err");
          console.log(error)
      }
  },

  chatwithdingke_GetNewMsg(chatObj){
        try {
            console.log("chatwithdingke_GetNewMsg");
            console.log(chatObj);
            let pages = getCurrentPages(); //获取当前界面的所有信息
            console.log(pages);
            this.playding();
            if(pages.length<1){
              return;
            }
            console.log("chatwithdingke_GetNewMsg");
            let curPage = pages[pages.length - 1];
          
      
            console.log("chatwithdingke_GetNewMsg");

            //订单详情界面必须有这个函数
          
            //确保是订单详情界面的路径
            if(curPage){
                if(curPage.route){
                      if(curPage.route.indexOf('pages/dingkechat/dingkechat')>=0){
                        console.log("查找到聊天界面")
                        curPage.getNewData();
                      }else if(curPage.route.indexOf('pages/dingke/dingke')>=0){
                        console.log("查找到聊天列表界面")
                        curPage.selectDingMsgRecordDingKeFromChat();
                      }
                      // else{
                      //   wx.showToast({
                      //     title: '您有新的叮聊消息',
                      //     icon:'none'
                      //   })
                      // }
                }
            }
        

        } catch (error) {
            console.log("chatWithCustDetail_GetNewMsg err");
            console.log(error)
        }
    },

    showFailMessage(code, res){
      var err = ''
      var msg = ''
      //http的返回status不为200的情况
      if(code == 1){
        err = '服务器正在升级。请稍后再试。若问题持续，请截图找客服。HTTP Status:' + res.statusCode
      }  
      //res.data.code不为1000的情况，服务器定义的其他情况，通常在res.data.msg可以获取
      else if (code == 2){
        err = '请求失败。出错代码：' + res.data.code
        msg = '  错误信息:' + res.data.msg
      }
      //request 直接fail的情况
      else if (code == 3){
        err = '网络错误。请稍后再试。若问题持续，请截图找客服。'
      }
      wx.showModal({
        title: '出错',
        content: err + msg,
        showCancel: false
      })
    },
})
