/**
 * 订单详情页面 注意点：
 *  -------------------------------------------------优惠模块--------------------------------------------------
 * 1、优惠打折信息项的只能由部长确认，即使没有确认，直接点击"全单部长确认"按钮在操作时也会再次触发这个方法。
 */
const {
  test,CashRegister,toVipCheck,toUseNewCouponCheck,toUseOffer,toPD,getFoodNum,
  zhenLiCartList,toCancelOrderDetails,processOpenDetail,closePrintAllConfirm,printAllConfirmNew
  ,toCancel,toCancelConfirm,toPayment,toPayOrder,VIPPayLoginto,VIPPayPwdInput,SelectPrinter,changelike,submitTheOrder,toPayDeposit
  ,advanceDepositBefore,advanceDeposit,toCancelConfirmDel,initVip,toCheck,vouchersMethod,showQRcode,closeQRcode,changeVipUsed,showPrice
  ,payIt,showTicketQRCode,closeTickerQRCode,getDiscountList,chooseDiscount,newGetYuCun,getOrderApplyList,showChooseList,closeChooseList,confirmPassword,getPrestoreAmount,bindsubmitThisOrder,showDishesDetail
  ,xianShangJiaClac,selectOrderInfNewCoupon,updateOrderInfNewCouponUnUse,writeOffSelectNewBindCoupon,changeNewCopupon
} = require('./extend.js')

import {
  MorePorridgeModel
} from '../../../../models/morePorridge.js'
const WXAPI = require('../../../../wxapi/main');
var time = require('../../../../utils/util.js');
const remarkJS = require('../../../../utils/remark.js');
const RMQV3 = require('../../../../utils/RMQV3');
var morePorridgeModel = new MorePorridgeModel();
const jurisdiction = require('../../../../utils/jurisdiction.js');
var UtilJS = require('../../../../utils/util.js');
var app = getApp();
var wayIndex = -1;   
var school_area = '';
var grade = '';
// 当联想词数量较多，使列表高度超过340rpx，那设置style的height属性为340rpx，小于340rpx的不设置height，由联想词列表自身填充
// 结合上面wxml的<scroll-view>
var arrayHeight = 0;
Page({
    xianShangJiaClac,
    selectOrderInfNewCoupon:selectOrderInfNewCoupon,
    updateOrderInfNewCouponUnUse:updateOrderInfNewCouponUnUse,
    writeOffSelectNewBindCoupon:writeOffSelectNewBindCoupon,
    changeNewCopupon:changeNewCopupon,
    showDishesDetail,
  payIt,
  closeTickerQRCode,
  showTicketQRCode,
  test: test,
  getPrestoreAmount,
  bindsubmitThisOrder,
  confirmPassword: confirmPassword,
  showChooseList: showChooseList,
  closeChooseList: closeChooseList,
  getOrderApplyList: getOrderApplyList,
  newGetYuCun: newGetYuCun,
  getDiscountList: getDiscountList,
  chooseDiscount: chooseDiscount,
  CashRegister:CashRegister,
  closeQRcode:closeQRcode,
  showQRcode:showQRcode,
  toVipCheck:toVipCheck,
  toUseNewCouponCheck:toUseNewCouponCheck,
  toUseOffer:toUseOffer,
  showPrice,
  toPD,
  getFoodNum,
  zhenLiCartList,
  toCancelOrderDetails,
  processOpenDetail,
  closePrintAllConfirm,
  printAllConfirmNew,
  toCancel,
  toCancelConfirm,
  toPayment,
  toPayOrder,
  VIPPayLoginto,
  VIPPayPwdInput,
  SelectPrinter,
  changelike,
  submitTheOrder,
  initVip,
  toCheck,
  changeVipUsed,
  toPayDeposit,
  advanceDepositBefore,
  advanceDeposit,
  toCancelConfirmDel,
  vouchersMethod,
  vipCheck2:false,
  /**
   * 页面的初始数据
   */
  data: {
    set_meal_array:[],//210 211 220 套餐
    isMinisterConfirm: true,
    check_used_new_bind_show:false,
    used_new_bind_coupon_count:0,
    new_bind_spend_price:0,//新人优惠券使用限额
    new_bind_coupon_face_amount:0,//新人优惠券面额
    used_new_bind_coupon_face_amount:0,//已使用新人代金券总面额
    used_new_bind_coupon_face_total_amount:0,//新人代进去面额
    used_new_bind_coupon_max_count:0,//可使用的新人代金券张数
    used_new_bind_coupon_list:[],
    new_bind_coupon_list:[],//包含已使用的和未使用的代金券
    used_new_bind_coupon_type:'AA871BBF-BE24-446B-8F50-3A5586D201ED',//新人优惠绑定类型 固定
    select_new_bind_coupon_list:[],
    

    isFromCartImg: false,
    isConfirmPassword: false,
    showChooseList: false,
    isSatisfy: true,
    chooseSaleUseList: [],
    useYuCunYuE: false,
    chooseDiscountIndex: null,
    chooseSaleList: [],
    selectedLocationid: '',
    isDownPayMent: 0,
    usePayment: '未选中',
    QRShow: false,
    isSuper: false,
    PDSelected: false,
    calueStoredSelected: false,
    allowCZYC: false,
    eat: false,
    vouchersIndex: -1,
    isVouchersUsed: false,
    VipUsed:false,
    VIPPayPwd: '',
    VIPPayLogin: false,
    isWXPayIt: false,
    reminderIntervalTime: 0,//催单上菜时间
    minReminderNum: 0,//全催单次数
    fullReminder: false,//全催单按钮
    showZhifuFangShi:true,
    showPrint:true,//显示结账买单按钮
    showCashRegister:false,//显示收银按钮
    test: 'test',
    nm:1,
    curStyleIdx: -1,
    serving: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/Serving.png",// 扫码上菜标识
    jin: 0,//临时菜重量
    id: true,//临时菜出单后的id
    qitayuanyin: false,//部长取消弹窗 其他原因输入框显示控制
    qitayuanyin1: false,//赠送弹窗 其他原因输入框显示控制
    lock: false,//多拼粥备注锁定按钮控制
    anniu: false, //多拼粥控制下单后 按钮是否可用
    tempSideDish: false,
    showDishesPC: false,
    readonly: false,
    index: 0,
    index1: 0, // 开发票
    index2: 0, // 这是是多种做法，点开详情的时候重新实称用
    submit: true, // 减数量确认用
    loading: true, //默认true
    isDiscount: false,
    levellist: [],
    // levellist: "3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21",
    changetab: 0,
    titleName: '订单详情',
    orderid: null,
    result_em: false,
    isVipPay:true,
    em_arry: '',
    u_em_arry: '',
    changeweightdishes_flag: false,
    check_biaodan: false,
    xuanzezhege: -1,
    zhandan_tableName: '',
    zhandan_tableId: -1,
    zhandan_orderId: -1,
    nowTiem: time.formatTime(new Date),
    hasSideDish: false,
    em_index: '',
    em_basicarry: '',
    item_number: '',
    // measurement_value:'',
    confirmweighing: 0,
    newcarList: [],
    menuListItem: [],
    dishesspec: [],
    dishesSpecArry: [],
    eatMethodArray: [],
    hiddenupdateorders: true,
    deduction: "",
    eatMethodChooseIndex: -1,
    weight_arry: "",
    eatAndSpec_arry: [],
    bulk_arry: [],
    SideDishList: [],
    SideDishList_choose: [],
    showModalStatus1: false,
    showprintmodalstatus: false,
    showDirectEatMenthod_ordering: false, // 直接点餐，多种做法详情
    showEatAndSpec_ordering: false, //多规格多做法
    showDirectPiece_ordering: false, // 直接点餐，计件
    showPieceDetail_ordering: false, // 直接点餐，计件
    showPresentation: false, // 赠送菜品框
    showCancel: false, //取消菜品框
    showProcessingDetail: false, //取消菜品框
    showSingleMultiple: false, //单规格多做法框
    showDepositDetail: false, //寄存框
    showRemarkList: false, // 快捷备注框
    showMaterial: false, //选择食材弹框
    showpeicai: false, //选择配菜弹框
    showpeicaiF: false,//多拼粥配菜和口味弹窗
    showTaste: false, //显示菜品介绍弹框
    showMultipleEatMethodView: false, // 显示多种做法的弹框
    showMultipleEatMethodViewF: false, // 显示多种做法的弹框
    showMultipleEatAndSpecView: false, //显示多规格多做法的弹框
    showMorePoridgeDishesDetail: false, // 显示多拼粥的弹框，下单后
    showModalQR: false, // 显示订单属性的弹框
    whole: [],
    parts: [],
    partsName_choose: [],
    needRemain: false, //需要剩余部位
    count_morning_arry: [], //早市
    count_evening_arry: [], //饭市
    porridge_arry: [], // 多拼粥
    side_arry: [],
    processing_arry: [], //饭市
    multiple_array: [], //单规格多做法
    needToReconfirmOffer: false,
    dggOrderStatus: 0,
    orderPayment: [], //支付订单
    chenzhonweight: '',
    customerCheckOther: false, //客人是否确认其他费用
    customerNeekCheck: false, //客人是否需要确认其他费用 部长直接点餐的情况下不需要客人确认加收的金额
    coin_prestore: "", //使用的星盾数量
    // old_money: 0,
    cupNumber: 0, //
    orderdetail: [],
    cz_flag: 0, // 充整标志0-不充整，1-充整
    sumMonney: 0, // 订单小计
    order_wait: 1, // 菜品是否需要叫起
    invoice_flag: 0, // 是否开发票 0-不开 1-开
    freeDishRemark: "", //赠送菜品弹框 备注 其他理由用
    cancelRemark: "", // 取消菜品弹框 备注 其他理由用  2020-11-28 取消订单弹框
    quickRemarkType: 0,
    quickRemarkList: [], // 快捷备注列表
    readyToOrder: false, // 部长直接点餐，准备下单
    readyToAddMeals: false, // 部长直接点餐，直接加餐
    user_count: 0,
    detailsType: 0, // 提交类型      //2020-11-27 1-下单前 0-下单后 2-加菜
    hallArray: [],
    hallTablesArray: [],
    hallIndex: 0,
    cinput: {}, // 称重菜品输入数量
    ninput: {}, // 计件菜品输入数量
    dinput: {}, // 称重单规格菜品输入数量
    confirm_level: 0, //确认级别
    paymethod: 0, //默认选择微信支付
    specialType: '',
    selecthowtodo_flag: false,
    showTemporaryDishes: false, //显示临时菜品
    showTemporaryDishesDetail: false, //显示临时菜品详情
    showTemporaryDishesDirecty: false, //显示临时菜品 直接点餐
    showTemporaryDishesDetailDirecty: false, //显示临时菜品详情 直接点餐
    showProcessingDetailHasOrder: false,
    detailItem: '', //多种详情菜品
    wanggouarray: [], //临时菜品-食材
    temporary: [], // 临时菜品-填写用
    tempNumber: 0, // 临时份数-填写用
    tempPrice: 0, // 临时价格-填写用
    tempUnit: '份', // 临时单位-填写用
    tempSum: 0, // 临时总额-填写用
    isModifiedDetail: false,
    hiddenview: false, //临时菜品-食材框
    fixTop: '', //区域离顶部的高度
    scrollTop: 0, //滑动条离顶部的距离
    // 这是临时菜品 下拉类型
    selectShowFirst: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectShowSecond: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectShowThird: false, //控制下拉列表的显示隐藏，false隐藏、true显示
    selectDataFirst: ["临时"], //临时第一级别
    selectDataSecond: ["临时"], //临时第二级别
    selectDataThird: ["临时"], //临时第三级别
    dishes_remark: '', // 菜品备注
    Order_remark: "", // 订单备注
    Order_quick_remark: "",//全单备注中常用备注的快捷备注
    remark: "", // 订单备注
    remark_index: [], // 快捷备注选择序号
    feedback: '',
    noEnough: false,
    infList: [],
    unCheck: 0,
    cartList: [], // 购物车
    selectDataFirsts: ["临时"], //临时第一级别
    selectDataSeconds: ["临时"], //临时第二级别
    selectDataThirds: ["临时"], //临时第三级别
    dataFirst: '', //临时第一级别-选中
    dataSecond: '', //临时第二级别-选中
    dataThird: '临时', //临时第三级别-选
    indexFirst: 0, //选择的下拉列表下标
    indexSecond: 0, //选择的下拉列表下标
    indexThird: 0, //选择的下拉列表下标
    class_i_id: 0, //临时第一级别
    parent_id: 0, //临时第二级别
    subclass_type_id: 0, //临时第三级别
    feedbackInf: [], // 部长反馈的确认信息
    isDiscountInf: [], // 确认优惠信息
    isAllDiscountInf: [], // 全单打折信息
    setInter: '', //定时刷新 
    timer: '',
    timer_shine: '',
    waitPay: false,
    temporaryCheckedColor: false, //这个是临时菜品的确认之后的操作者颜色，因为修改确认之后，不能及时更新tempDetail,所以就用个参数来判断
    indexTemp: '', //B计划，解决及时更新tempDetail
    isTemp: false, // 是否已有临时菜，很坑的一个判断，建议后期删除
    tempDetail: '', //临时菜品具体的菜品信息，获取三级菜单用
    tempItem: '', //临时菜品的详情，在新增临时菜品的情况下的情况下是以前的临时菜品信息，在订单详情页面则是临时菜品的信息
    temp_operator: '', //临时菜品用，操作人，就为了临时菜品下单或者是修改的时候的时候，显示一下操作人和时间
    temp_operation_time: '', //临时菜品用，操作时间
    /**
     * 订单状态：0-正常 2-申请取消 3-已取消 4-无需确认 5-称重菜品待确认 6- 称重菜品重新确认(手动输入重量用)  7-称重已确认 8-称重申请取消  9- 称重菜品已取消 10-申请修改 11-已修改 12-不能修改 13-不能取消
     */
    cookway: '',
    u_cookway: '',
    // iscookway: true, // 是否是做法
    isScales: false, //判断是否有电子秤,有电子秤时，有电子秤就取消实称的输入框，没称就显示
    isDeposit: false, //判断是否需要定金
    tempValue: '', //点击结果项之后替换到文本框的值
    temporaryValue: '',
    bindSource: [], //绑定到页面的数据，根据用户输入动态变化
    hideScroll: true,
    showTemporaryDetail: false,
    temp_spec_type: 0,
    deposit_list: [],
    ingredient: [],    //全部食材
    ingredients: [],  //全部食材的名称
    ingredientsTemp: [],
    tempDishes: '',
    dishesDetail: [],
    showDishesDetail: false,
    showfoodDetail: false,
    showBottomBar: false, // 显示底栏
    dishesDirectlyNum: [],
    navbar: ['待确认', '正在用餐', '完成/取消'],
    listData_temp: [],
    listData: [],
    listDataAll: [],
    allBiaoDan: false,
    allBuDan: false,
    allJiaoQi: false,
    allJiShang: true,
    allDaBao: false,
    allFenXi: false,
    allJiaJi: false,
    allCuiDan: false,
    bidDetailitem: [],
    order_status_end: ["等待买单", "已付款", "走单", "已完成", "已买单"],
    discount_checked_minister: false,
    discount_checked_guests: false,
    directList: [],
    dishes_directly: [],
    showIntroduction: false, //显示菜品介绍弹框
    showIntroduction1: false, //多规格多做法订单详情弹窗里的
    showIntroduction2: false, //多拼粥订单详情弹窗里的   订单详情会自动刷新 用来判断的参数会被干掉
    shrinkIntrIntroduction: false, //是否缩小介绍框
    // 取消的原因列表
    ListOfCancellation: [],
    // 赠送的原因列表
    ListOfPresentation: [],
    PD:'',
    specs: [{
      name: '单一规格',
      value: 0,
      checked: true
    },
    {
      name: '多种规格',
      value: 1,
      checked: false
    },
    {
      name: '称重',
      value: 2,
      checked: false
    },
    {
      name: '计件',
      value: 3,
      checked: false
    },
    ],
    menu_img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/index/menu.png',
    i_like_on_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/i_like_on.png',
    i_like_off_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/i_like_off.png',
    dot_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/dot.png',
    message_url: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/img/message.png",
    text_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/text.png',
    i_close_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/i_close.png',
    radio_on_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/radio_on.png',
    radio_off_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/radio_off.png',
    radio_on_1_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/radio_on.png',
    radio_off_1_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/radio_off.png',
    discountRate: '',
    discountMoney: '',
    serviceFeeRate: '', //服务费比率
    serviceFeeMoney: '', //服务费比率
    pre_money: '',
    isSocketLind: true,
    hasMenu: true,
    hasOrderInf: true,
    hasOrderDetailed: true,
    hasPaymentInf: true,
    hasConfirmationRecord: true,
    numberOfCalling: 0,
    callRecord: [],
    callRecords: [],
    userInfo: {},
    hasUserInfo: false,
    showDirectDishes: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    navData: [],
    currentTab: -1,
    navScrollLeft: 0,
    discountRecords: [],
    otherRecords: [],
    tipRecords: [],
    discountChange: false,
    cancelFoodItem: [], // 选中的取消菜品信息
    freeFoodItem: [], // 选中的赠送菜品信息
    tastes: "", // 选中的口味信息
    tastesRemark: "", //备注中显示用
    select_cancel: false,
    select_free: false,
    cancellation: '操作失误',
    presentation: '主动赠送',
    cancelType: '',//2020-11-28 取消订单类型  1下单后/加菜
    copyOrderNum: 1,
    all_free_order: 0,
    all_repair_order: 0,
    all_wait_order: 0,
    all_bale_order: 0,
    showChoose: false,
    showChooseChange: false,
    isHall: true,
    hall_id: 0,
    applyList: [],
    chosseType: -1,//选择餐桌的类型，0位转台，1为分席
    tasteList: [], //口味选择
    guestPhone: '', //客户电话
    guestInputPhone: '', //录入时的客户电话
    // 多拼粥
    // 是否显示弹窗、商品数据、食材的数据、菜品介绍、客人备注
    show: false,
    foodIntroduce: "", //菜品介绍
    // guestRemark: "", //客人备注
    porridgeObject: {},
    porridgeBackObject: {},
    goodModel: {},
    currentDishesModel: {},
    currentItemType: 0,
    remark_height: 500, // 常用备注滚动框的高度
    EatmethodAndSpec: [], //多规格多做法的数组，在spec_type = 10的时候才使用
    quickRemark: '', //2020-11-19 快捷备注，显示用
    partIndex: 0,//2020-11-24 来料加工选部位下标
    eatMethodIndex: -1,//2020-11-24 来料加工选做法下标
    subSeatsNum: '',//分席的数字
    subSeatsChar: '',//分席的编号
    subSeatsBol: false,//当前订单是否有分席
    subSeatsList: [],//当前选择的分席数组
    thisTableArray: [],//当前主餐桌信息
    this_old_subList: [],
    printType1: true,//默认打印机默认为选中
    printType2: false,//选择打印机打印默认为非选中
    table_id: '',//table_id不解释
    showPrintChoose: false,//选择打印机打印后，显示选择框
    printIndex: -1,//打印机选择项
    printArray: [],//打印机数组
    printShowArray: [],//打印机选择显示数组
    showAllConfirmPrintView: false,//结账总单打印框
    allConfirmInf: [],//结账总单信息，放在本地，防止弹框导致数据丢失，框用完记得清此数据
    printAllPayOrderSigns: -1,//是否打印结账总单标识，默认-1，改为1则为‘是’，0则为‘否’，一般来说直接跳转，这个用来保证显示不会错误
    firstIssue: '',//订单总单是否先出单
    prePrice:false,//判断是否点击了预存+现金按钮
    vipCheck:false,//判断是否点击了会员买单
    disabledB: true,//全分席关闭
    getorderCode:app.globalData.orderCode,
    xdfs:true,
    point_index: [],
    shineb: true,
    shinef: true,
    fackyousevencolor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png"
  },
  // 2021-8-31改
    //加菜
    // adddishes: function(e) {
    //   wx.showLoading({
    //     title: '跳转中...',
    //   })
    //   app.globalData.ordre_code = e.currentTarget.dataset.ordercode
    //   app.globalData.order_tablename = e.currentTarget.dataset.order_tablename
    //   app.globalData.locationname = e.currentTarget.dataset.order_tablename
    //   app.globalData.order_arrival_time = e.currentTarget.dataset.arrivaltime
    //   var thisorderarry = JSON.stringify(e.currentTarget.dataset.dishesitem)
    //   app.globalData.thisorderarry = thisorderarry
    //   app.globalData.preorder_starus = JSON.parse(thisorderarry).preorder_starus;
    //   wx.navigateTo({
    //     url: '/pages/module_others/pages/menu/menu?locationindex=3&orderid=' + e.currentTarget.dataset.orderid + '&ordertype=' + e.currentTarget.dataset.ordertype + '&thisorderarry=' + thisorderarry,
    //   })
    //   wx.hideLoading();
    // },
    callminister(e) {
      console.log("呼叫部长");
      
    },
  zceshi(e) {
    console.log(app.globalData.orderCode);
  },
  createOrder(e) { // 先出单
    var that = this
    if (!this.data.printType1) {
    }
    wx.showLoading({
      title: '提交中',
    })
    if(this.data.detailsType == 1) {
      var curDish = this.data.curDish
      let money = curDish.sum
      let number = curDish.number
      var nowtime = UtilJS.formatTime(new Date)
      var arrivaltime = String(app.globalData.date) + ' ' + String(app.globalData.time) //差一个日期
      var order_updata = {
        Order_type: 0, //订单类型：0-堂食、1-预定、2-外卖
        Shop_id: app.globalData.shopdetail.shop_id,
        Table_id: app.globalData.locationid,
        Order_code: app.globalData.orderCodeValue, //订单编码后五位，通过
        User_count: app.globalData.userNum, //用餐人数
        User_id: 0,
        Users_id: 0, //点餐人id，可多人点餐
        arrival_time: arrivaltime,
        dinner_time: nowtime,
        phone_num: app.globalData.phonenumber, //电话号码
        user_name: app.globalData.username, //用户姓名
        dishes_count: number, //菜品数量
        table_name: app.globalData.locationname, //桌位名称
        preorder_starus: 1, //预定订单状态 0-未确认、1-已确认、2-申请取消、3-已取消、4-已申请确认、5-申请修改、6-已修改、7-不能修改
        operator: app.globalData.loginname, //操作人员记录
        operation_time: nowtime, //订单操作时间
        tbc_count: 1, //待确认菜品数
        help_order: 2, //0-正常单、1-帮人点但未转发、2-帮人点已转发
        cz_flag: 0, //充整标志0-不充整，1-充整
        Grand_total: Number(money), //应收
        Order_subtotal: Number(money), //订单小计
        order_wait: that.data.all_wait_order ? that.data.all_wait_order : 0, //菜品是否需要叫起
        invoice_flag: 0, //是否开发票 0-不开 1-开
        Order_remark: '', //订单备注
        paymethod: 0, // 默认支付方式
        copyOrderNum: 1,
        //order_choose_printer:order_choose_printer,//选择指定打印的打印机编号
        all_free_order: 0,
        all_repair_order: 0,
        all_wait_order: 0,
        all_bale_order: 0,
        firstIssue: 1
      }
      wx.request({
        url: app.globalData.WriteOrder_url,
        data: order_updata,
        success: function (res) {
          that.setData({
            detailsType: 2
          })
          getApp().globalData.detailsType = 2
          const order_id = res.data.object[0].order_id
          getApp().globalData.order_id = order_id
          that.setData({
            orderid: order_id,
            order_id: order_id
          })
          const pages = getCurrentPages()
          const prev = pages[pages.length -2]
          prev.setData({
            orderid: order_id,
            ordertype: 1,
            detailsType: 2,
            isHadOrder: true
          })
          WXAPI.updateOrderPayment({
            order_id: res.data.object[0].order_id,
            actual_total: that.data.sumMonney
          }).then(function (data) {
            if (data.result == "success") {
              //订单价格修改成功
            } else {
              //订单价格修改失败
            }
          }).catch(res => {
            //订单价格修改失败
          })
          var orderdetail = []  
          var item = {
            "user_id": app.globalData.user_id,
            "dishes_id": curDish.dishes_id,
            "dishes_status": 2,
            "item_price": curDish.dishes_spec_type == 9 ? (curDish.dishes_price / curDish.number) : curDish.dishes_price,
            "dishes_price": curDish.dishes_price,
            "item_subtotal": curDish.sum,
            "item_type": curDish.item_type,
            "measurement_value": curDish.spec === 6? 0: curDish.measurement_value,
            "order_id": res.data.object[0].order_id,
            "spec_id": curDish.weighing,
            "praise_flag": 0,
            "userchecked": 0,
            "dishes_img": curDish.img_url,
            "dishes_name": curDish.name,
            "dishes_metering_type": curDish.spec_type == 0 ? curDish.spec_name : curDish.spec_type,
            "operator": that.data.loginname, //操作人员记录
            "operation_time": nowtime, //订单操作时间 
            "spec_name": curDish.spec_name,
            "item_number": curDish.number,
            "remarks": curDish.remark,
            "specal_type": curDish.specal_type,
            "em_id": 0,
            "u_item_number": 0, //初始化未减菜的份数0
            "initial_number": parseInt(curDish.number), // 初始菜品份数,称重菜品视为一份
            "sideDisht": (curDish.sideDisht != null && curDish.sideDisht.length != 0) ? curDish.sideDisht : '',
            "jointSet": curDish.jointSet,
            "tastes": curDish.tastes,
            "freeOrder": curDish.freeOrder,
            "repairOrder": curDish.repairOrder,
            "copyOrder": curDish.copyOrder,
            "waitOrder": curDish.waitOrder,
            "baleOrder": curDish.baleOrder,
            "transferOrder": curDish.transferOrder,
            "depositOrder": curDish.depositOrder,
            "firstIssue": 1
          }
          orderdetail.push(item)
          wx.request({
            url: app.globalData.WriteOrderDetails_url,
            // url: 'http://192.168.8.3:8080/WX Restaurant/WriteOrderDetails',
            data: {
              OrderDetaileds: JSON.stringify(orderdetail)
            },
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              const cartList = that.data.cartList
              cartList[curDish.cartList_index].hadOrdered = true
              that.setData({
                cartList
              })
              
              getApp().globalData.cartList = cartList
              wx.showToast({
                title: '先出单成功',
              })              
              console.log(curDish)
              that.alterHadOrdered(curDish)
            }
          })
        }
      })
    }else {
      var curDish = this.data.curDish
      let money = curDish.sum
      let number = curDish.number
      var nowtime = UtilJS.formatTime(new Date)
      var arrivaltime = String(app.globalData.date) + ' ' + String(app.globalData.time) //差一个日期
      var curDish = this.data.curDish
      console.log(curDish)
      var orderdetail = []
          var item = {
            "user_id": app.globalData.user_id,
            "dishes_id": curDish.dishes_id,
            "dishes_status": 2,
            "item_price": curDish.dishes_spec_type == 9 ? (curDish.dishes_price / curDish.number) : curDish.dishes_price,
            "dishes_price": curDish.dishes_price,
            "item_subtotal": curDish.sum,
            "item_type": curDish.item_type,
            "measurement_value": curDish.spec === 6? 0: curDish.measurement_value,
            "order_id": that.data.order_id || app.globalData.order_id,
            "spec_id": curDish.weighing,
            "praise_flag": 0,
            "userchecked": 0,
            "dishes_img": curDish.img_url,
            "dishes_name": curDish.name,
            "dishes_metering_type": curDish.specal_type == 6 || curDish.specal_type == 0 ? curDish.spec_name : curDish.spec_type,
            "operator": that.data.loginname, //操作人员记录
            "operation_time": nowtime, //订单操作时间 
            "spec_name": curDish.spec_name,
            "item_number": curDish.number,
            "remarks": curDish.remark,
            "specal_type": curDish.specal_type,
            "em_id": 0,
            "u_item_number": 0, //初始化未减菜的份数0
            "initial_number": parseInt(curDish.number), // 初始菜品份数,称重菜品视为一份
            "sideDisht": (curDish.sideDisht != null && curDish.sideDisht.length != 0) ? curDish.sideDisht : '',
            "jointSet": curDish.jointSet,
            "tastes": curDish.tastes,
            "freeOrder": curDish.freeOrder,
            "repairOrder": curDish.repairOrder,
            "copyOrder": curDish.copyOrder,
            "waitOrder": curDish.waitOrder,
            "baleOrder": curDish.baleOrder,
            "transferOrder": curDish.transferOrder,
            "depositOrder": curDish.depositOrder,
            "firstIssue": 1
          }
          orderdetail.push(item)
      wx.request({
        url: app.globalData.WriteOrderDetails_url,
        // url: 'http://192.168.8.3:8080/WX Restaurant/',
        data: {
          OrderDetaileds: JSON.stringify(orderdetail)
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          const cartList = that.data.cartList
              cartList[curDish.cartList_index].hadOrdered = true
              that.setData({
                cartList
              })
              
              getApp().globalData.cartList = cartList
          wx.showToast({
            title: '先出单成功',
          })
          that.alterHadOrdered(curDish)          
        }
      })
    }
    
  },
  alterHadOrdered(curDish) {
    var that = this
  
    if (curDish.dishes_spec_type == 9 || curDish.dishes_spec_type == 91) { //多拼粥
      const porridge_arry = that.data.porridge_arry
      porridge_arry[that.data.curStyleIdx].hadOrdered = true
        console.log(porridge_arry)
        that.setData({
          porridge_arry
        })
    }
    else if (curDish.specal_type == 6) { // 临时
      const temporary = that.data.temporary
      temporary[that.data.curStyleIdx].hadOrdered = true
        console.log(temporary)
        that.setData({
          temporary
        })
    }
    else if (curDish.dishes_spec_type == 2 || curDish.dishes_spec_type == 6) { // 称重菜品
      const weight_arry = that.data.weight_arry
      weight_arry[that.data.curStyleIdx].hadOrdered = true
        console.log(weight_arry)
        that.setData({
          weight_arry
        })
    }
    else if (curDish.dishes_spec_type == 10) { // 多规格多做法
      const eatAndSpec_arry = that.data.eatAndSpec_arry
      eatAndSpec_arry[that.data.curStyleIdx].hadOrdered = true
        console.log(eatAndSpec_arry)
        that.setData({
          eatAndSpec_arry
        })
    } else if (curDish.dishes_spec_type == 0 || curDish.dishes_spec_type == 21 || curDish.dishes_spec_type == 23 ||
      curDish.dishes_spec_type == 25 || curDish.dishes_spec_type == 22 || curDish.dishes_spec_type == 24 || curDish.dishes_spec_type == 26 || curDish.dishes_spec_type == 27) { // 单规格
        const single = that.data.single
        single[that.data.curStyleIdx].hadOrdered = true
        console.log(single)
        that.setData({
          single
        })
    } else if (curDish.dishes_spec_type == 1 ) { // 多规格  || curDish.dishes_spec_type == 22 || 24
      const many = that.data.many
      many[that.data.curStyleIdx].hadOrdered = true
        console.log(many)
        that.setData({
          many
        })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.globalData.RMQRefreshCB = (msg) => {
      console.log('收到刷新指令')
      var that = this
      wx.stopPullDownRefresh();
      that.redress() // 矫正金额和刷新
      that.getDepositList(false) //刷新寄存
      wx.request({
        url:app.globalData.selectOrderVipInfo,
        data:{
          orderId:this.data.orderid,
          shopId:this.data.shop_id
        },
        method:"GET",
        async:false,
        success: res => {
          if(res.statusCode == 200){
            let vipPhone = res.data[0]
            let vipCard = res.data[1]
            if(!vipPhone || vipPhone==0){
              vipPhone=""
            }
            if(!vipCard || vipCard==0){
              vipCard=""
            }
            that.setData({
              vipPhone,
              vipCard
            })
          }
        }
      })
    }
    this.SelectSideDish
    var that = this

    if (options.fromYuDing) {
        this.setData({
            fromYuDing: true
        })
    }

    if(options.guidelink){
      this.setData({
        guidelink: true
      })
      app.globalData.order_id = options.orderid
      app.globalData.orderId = options.orderid
      that.setData({
        orderid: options.orderid
      })
      app.globalData.shopdetail.shop_id = options.shop_id
      app.globalData.shopid = options.shop_id
      that.setData({
        shop_id: options.shop_id
      })
      if (options.phone) {
        that.setData({vipPhone: options.phone})
      }
    }
    var listData = []
    var listDataAll = []
    let cartList = wx.getStorageSync('menuList') //购物车
    if (cartList) {
       cartList = JSON.parse(cartList)
    }
    that.setData({
      isFromCartImg: options.isFromCartImg == 1 ? true : false,
      selectedLocationid: options.locationid,
      xdfs:app.globalData.xdswidth
    })
    var shopId1= app.globalData.shopid ?app.globalData.shopid: options.shopId
    that.zceshi()
    that.setData({
      getorderCode: app.globalData.orderCode
    })
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    wx.request({
      url: app.globalData.GetOrderSytle_url,
      method: 'POST',
      data: {
        shop_id: 19318,
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
            
            for (var x of res.data.object) {
              var item = {
                value: x.orderStyleName,
                checked: false
              }
              if(item.value === '即上'){
                item.checked = true
              }
              listData.push(item)
              listDataAll.push(x.orderStyleName)
              that.setData({
                listData: listData,
                listData_temp:listData,
                listDataAll: listDataAll,
              })
            }
            
            for(let i=0;i<cartList.length;i++){
              cartList[i].listData = listData
            }
            that.mangnerCarList(cartList) // 整理cartList
            app.globalData.listData = listData
            app.globalData.listDataAll = listDataAll
          } else {
            console.log("不存在订单属性")
          }
        } else {
          console.log("搜索不到订单属性")
        }
      }
    })
    that.setData({
      scroll_height: windowHeight * 750 / windowWidth - 600,
      remark_height: windowHeight * 750 / windowWidth - 330,
      levellist: app.globalData.levellist,
      quickRemarkList: app.globalData.remark_normal,
      Order_remark: app.globalData.Order_remark,
      Order_quick_remark: app.globalData.Order_quick_remark,
      loginname: app.globalData.loginname,
      shop_id: app.globalData.shopdetail.shop_id || options.shopId,
      level: app.globalData.level, //级别
      confirm_level: app.globalData.confirm_level, // 确认级别
      wanggouarray: that.data.wanggouarray,
      renshuradiocolor: false,
      surenewusercount: false,
      ListOfPresentation: app.globalData.remark_gift,
      ListOfCancellation: app.globalData.remark_cancel
    })
    if (typeof app.globalData.managementData.usebalance != "undefined" && app.globalData.managementData.usebalance == 1) {
      that.setData({
        isScales: true
      })
    }
    if (typeof app.globalData.managementData.deposit != "undefined" && app.globalData.managementData.deposit == 1) {
      that.setData({
        isDeposit: true
      })
    }
    if (options) {
      if (options.toMessage == 1) {
        timer1: setTimeout(function () {
          that.pageScrollToBottom()
        }, 1000)
      }
      that.setData({
        orderid: options.orderid || app.globalData.order_id, //订单id
        ordercode: options.order_code, //订单码
        preorder_starus: options.preorder_starus, //预订状态
        table_id: options.table_id, //桌位id
        user_count: options.user_count, //客人总数
        total_amount: options.total_amount, //总金额
        user_id: options.user_id, //客人id
        tbc_count: options.tbc_count, //待确认项,不只是待确认菜品数了
      })
      if (options.detailsType) {
        if (options.detailsType == 1) { // 部长直接点餐，确认提交页面类型

          wx.setNavigationBarTitle({ title: '下单详情' })

          if (cartList.length > 0) {
            // wx.getStorageSync({
            //   key:"userInfoName",
            //   success (res) {
            //     console.log(res.data,"这里是801")
            //     app.globalData.username = res.data
            //     console.log(app.globalData.username);
            //   }
            // })
            app.globalData.username = app.globalData.customerInf.name ? app.globalData.customerInf.name : '';
            if(!app.globalData.phonenumber){
              app.globalData.phonenumber = wx.getStorageSync('phonenumber')
            }
            console.log();
            var thisorderarry = {
              table_name: app.globalData.locationname,
              user_name: app.globalData.username,
              phone_num: app.globalData.phonenumber,
              user_count: app.globalData.userNum,
              order_code: app.globalData.orderCode,
              paymethod: 0,
              dinner_time: String(app.globalData.date) + ' ' + String(app.globalData.time),
              help_order: 3,
              payment_status: 0,
            }
            // console.log(table_name, "1111111111111111111111")
            that.selectting()
            // 修改订单信息
            that.setData({
              thisorderarry: thisorderarry,
              loading: false,
              hasOrderDetailed: true,
              detailsType: 1
            })
          } else {
            that.setData({
              hasOrderDetailed: false,
              loading: false,
            })
          }
          that.setData({
            showZhifuFangShi:false,
            table_name: app.globalData.locationname,
            readyToOrder: true,
            titleName: '下单详情'
          })
          that.ingredients() // 搜索店铺食材
        } else if (options.detailsType == 2 || options.detailsType == 4) { // 部长直接点餐，直接加菜
          wx.setNavigationBarTitle({ title: '下单详情' })
          // var cartList = app.globalData.cartList //购物车
          var orderid = options.orderid || app.globalData.order_id
          var hasOrderDetailed = false
          if (options.detailsType == 2) {
            that.setData({
              firstIssue: options.firstIssue,//从来料加工过来的
              readyToAddMeals: true,
              readyToOrder: false,
            })
          } else {
            that.setData({
              firstIssue: options.firstIssue,//从来料加工过来的
              readyToAddMeals: false,
              readyToOrder: true,
            })
          }
          that.getThisOrderInf(orderid)

          that.getThisOrderInfCB = (bool) => {
            that.mangnerCarList(cartList) // 整理cartList
          }
          if (cartList.length > 0) {
            hasOrderDetailed = true
          }
          else {
            hasOrderDetailed = false
          }
          that.setData({
            showZhifuFangShi:false,
            detailsType: 2,
            loading: false,
            table_name: app.globalData.locationname,
            hasOrderDetailed: hasOrderDetailed,
            titleName: '下单详情'
          })
        }
      } else {
        that.showme()
        that.getThisOrderInf(that.data.orderid) //获得该订单信息
        that.ingredients() // 搜索店铺食材
        that.changeHidden() //执行隐藏
        that.selectDiscountInformationByOrderId() // 查询订单中的确认信息
        that.getorderpayment() // 获取支付订单
        that.getActiveOrderDishes() // 获取主动下单的菜
        // that.timed_refresh(0) // 定时刷新
        that.selectting()
        // that.countDown()
      }
    } else {
      //执行加载
      that.showme()
      that.getThisOrderInf(that.data.orderid) //获得该订单信息
      that.ingredients() // 搜索店铺食材
      that.changeHidden() //执行隐藏
      that.selectDiscountInformationByOrderId() // 查询订单中的确认信息
      that.getorderpayment() // 获取支付订单
      that.getActiveOrderDishes() // 获取主动下单的菜
      // that.timed_refresh(0) // 定时刷新
      that.selectting()
      // that.countDown()
    }
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          pixelRatio: res.pixelRatio,
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      },
    })
    that.SelectPrinter(app.globalData.shopdetail.shop_id)
    //获取口味跟配菜 210220
    //  this.getRemarkNormal()
    //  this.selectDishesPC()
    wx.request({
      // url: 'http://localhost:8080/WX%20Restaurant/selectOrderVipInfo',
      url:app.globalData.selectOrderVipInfo,
      data:{
        orderId:this.data.orderid,
        shopId:this.data.shop_id
      },
      method:"GET",
      async:false,
      success : res =>{
        if(res.statusCode == 200){
          let vipPhone = res.data[0]
          let vipCard = res.data[1]
          if(!vipPhone || vipPhone == 0){
            vipPhone = ""
          }
          if(!vipCard || vipCard == 0){
            vipCard = ""
          }
          that.setData({
            vipPhone,
            vipCard
          })
           if(vipPhone || vipCard){
            if(this.data.thisorderarry.isVip == 1){
              if (that.data.PDSelected) {
                wx.request({
                  // url: 'http://localhost:8080/WX Restaurant/SelectPrepaidDeposit',
                  url: app.globalData.SelectPrepaidDeposit,
                  data: {
                    phone: vipPhone,
                    card: vipCard,
                    shopId:app.globalData.shopid
                  },
                  method: 'GET',
                  success: (res) => {
                    this.setData({
                      PD: that.data.orderPayment.actual_total >= res.data ? res.data : '' ,
                      nPD: that.data.orderPayment.actual_total < res.data && res.data > 0 ? res.data : '' ,
                      paymethod: 6
                    })
                  }
                })
              }
              wx.request({
                // url: 'http://localhost:8081/evaluation/getOrderPayment',
                url:app.globalData.getOrderPayment,
                data:{orderId:this.data.orderid},
                success: res =>{
                  let orderPayment = this.data.orderPayment
                  if(res.data.code == 1 && res.data.params.actual_total > 0){
                    orderPayment.actual_total = res.data.params.actual_total
                  }
                  this.setData({
                    isVipPay:false,
                    orderPayment
                  })
                }
              })
            }
            if(this.data.thisorderarry.order_status == '等待买单' || this.data.thisorderarry.order_status == '已买单'){
              wx.request({
                url: app.globalData.SelectDiscountInformationByOrderId_url,
                data: JSON.stringify({
                  order_id: that.data.orderid,
                }),
                header: {
                  'content-type': 'application/json'
                },
                method: 'POST',
                success: function (res) {
                  let orderPayment = that.data.orderPayment
                  orderPayment.actual_total = res.data.object.paymentRecord.total_vip_amount == 0 ?  res.data.object.paymentRecord.total_vip_distinct_amount : res.data.object.paymentRecord.total_vip_amount
                  that.setData({
                    vipCheck: true,
                    total_vip_account: res.data.object.paymentRecord.total_vip_amount, //会员总价
                    total_vip_distinct_account: res.data.object.paymentRecord.total_vip_distinct_amount, // 会员折后价总计
                    vip_preferential_amount: res.data.object.paymentRecord.vip_preferential_amount,
                    member_level: res.data.object.paymentRecord.member_level, //会员等级 actual_total
                    orderPayment:orderPayment,
                  })
                }
              })
            }
            // wx.request({
            //   url: app.globalData.VipCalculateDiscountInformation,
            //   data: {
            //     order_id: this.data.orderid,
            //     shop_id: this.data.shop_id,
            //     phone: this.data.vipPhone ? this.data.vipPhone : this.data.thisorderarry.phone_num,
            //     card: this.data.vipCard,
            //   },
            //   method: 'POST',
            //   success: res => {
            //     if (res.data.result == "success") {
            //       let orderPayment = this.data.orderPayment
            //       if(res.data.object){//普通会员
            //         orderPayment.actual_total = res.data.object.actual_total
            //         this.setData({
            //           vipCheck: true,
            //           vipCheck2: true,
            //           total_vip_account: res.data.object.total_vip_amount, //会员总价
            //           total_vip_distinct_account: res.data.object.total_vip_distinct_amount, // 会员折后价总计
            //           vip_preferential_amount: res.data.object.vip_preferential_amount,
            //           member_level: res.data.object.member_level, //会员等级 actual_total
            //           orderPayment,
            //           paymethod: that.data.thisorderarry.paymethod,
            //         },()=>{
            //           that.showPrice()
            //         })
            //       }else{//超值会员
            //         orderPayment.actual_total = res.data.data.actual_total
            //         wx.request({
            //           // url: 'http://localhost:8081/evaluation/getShopPreferentidInfo',
            //           url: app.globalData.allUrl.getShopPreferentidInfo,
            //           data: {
            //             shopId: that.data.shop_id,
            //             orderId: that.data.orderid,
            //             phone: that.data.vipPhone,
            //             vipCard: that.data.vipCard,
            //           },
            //           method: 'POST',
            //           header: {
            //             'content-type': 'application/json'
            //           },
            //           success: res =>{
            //             console.log(res)
            //             var nPD = this.data.nPD
            //             var calueStored = this.data.calueStored
            //             var vipCheck = this.data.vipCheck
            //             var member_level = this.data.member_level
            //             var calueStoredSelected = this.data.calueStoredSelected
            //             if(res.data && res.data.data.is_state){
            //               vipCheck = false
            //             }
            //             let orderPayment = this.data.orderPayment
            //             if(res.data.data){
            //               orderPayment.actual_total = res.data.data.actual_total
            //               calueStored = that.data.thisorderarry.isAdvanceDeposit == 0 ? res.data.data : ''
            //               calueStoredSelected = that.data.thisorderarry.isAdvanceDeposit == 0 
            //               vipCheck = false
            //               console.log(that.data.thisorderarry.isPayPW)
            //               that.setData({
            //                 nPD,
            //                 vipCheck: true,
            //                 vipCheck2: true,
            //                 member_level: "超值预存会员",
            //                 calueStored: that.data.thisorderarry.isAdvanceDeposit == 0 ? res.data.data : '',
            //                 calueStoredSelected: that.data.thisorderarry.isAdvanceDeposit == 0 ,
            //                 PDSelected: false,
            //                 vipCheck:vipCheck,
            //                 orderPayment,
            //                 paymethod: that.data.thisorderarry.paymethod,
            //                 VIPPayLogin: that.data.thisorderarry.isPayPW == 1
            //               },()=>{
            //                 that.showPrice()
            //               })
            //             }
            //           }
            //         })
            //       }
            //     }
            //   }
            // })
          }

          if(this.data.orderid){
            wx.request({
              url: app.globalData.GetOrderPaymentInf_url,
              data: {
                Order_id: this.data.orderid
              },
              success(res) {
                that.setData({payDate:res.data.object[0].pay_date})
                // if(res.data.object[0].pay_date && (vipPhone || vipCard)){
                //   that.toVipCheck()
                // }
              }
            })
          }
          wx.request({
            url: app.globalData.selectOneWxPayDetailed,
            data:{
              out_trade_no:that.data.thisorderarry.order_code,
            },
            success: res => {
              if(res.data.result != 0){
                that.setData({
                  isWXPayIt: true
                })
              }
            }
          })
        }
      }
    })
    if(options.isFromBuy){
      that.setData({
        isFromBuy: true
      })
      if(options.isBindUser){
        that.bindUser()
      }
    }
  },
  bindUser(){
    let that = this
    wx.request({
      // url: 'http://192.168.8.5:8088/evaluation/bindUser',
      url: app.globalData.bindUser_url,
      data:{orderId: that.data.orderid,userId: app.globalData.user_id,rmq_user_id: app.globalData.rmqData.mqtt_queue_pre + "qgqc_" + app.globalData.caustomerId},
      success:res=>{
        console.log(res.data);
      }
    })
  },
  // 位数补零
  addzero2: function (num) {
    if (Number(num) > 10) {
      return '0' + num
    } else {
      return '00' + num
    }
  },
  addremarks1: function (e) {
    this.setData({
      remarksBol: true,
      dishes_remark: e.detail.value
    })
  },
  //将备注存入全局变量
  addremarks2: function (e) {
    this.setData({
      remarksBol: false,
      dishes_remark: e.detail.value
    })
  },
  // 取消按钮 还没提交数据库时的取消
  decCancel: function (e) {
    var that = this
    var item = e.currentTarget.dataset.item
    if (item.hadOrdered && that.data.readyToAddMeals) {
      wx.showModal({
        title: '提示',
        content: '订单已有菜品不能在直接加菜中取消。',
        showCancel: false,
        confirmText: "是",
        success(res) {
          if (res.confirm) { }
        }
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '是否取消该菜品',
        cancelText: "否",
        confirmText: "是",
        success(res) {
          if (res.confirm) {
            var cartList = that.data.cartList
            for (var i = 0; i < cartList.length; i++) {
              if (item.cartList_index == cartList[i].cartList_index) {
                cartList.splice(i, 1)
                app.globalData.cartList = cartList
                const pages = getCurrentPages()
                const prevPage = pages[pages.length - 2]
                prevPage.setData({
                  cartList:cartList
                })
              }
            }
            that.mangnerCarList(cartList)
            if(app.globalData.cartList.length == 0){
              wx.navigateBack({
                delta: 1,
              })
            }
          } else if (res.cancel) {
          }
        }
      })
    }
  },

  /**
   * 20210408，需求变动，小重构代码
   * 把原本的早市，饭市等，数组干掉，新增单规格，多配多规格两个数组
   * 修改 mangnerCarList（）方法 的同时请把 getThisOrderDetailAndInf（）也一同修改了，此方法是获取订单详情菜品信息的
   */

  //整理购物车
  mangnerCarList: function (cartList) {
    var that = this
    if (cartList.length > 0) {
    
      var weight_arry = [] // 称重菜品列表
      var eatAndSpec_arry = [] //多规格多做法菜品列表
      var single = [] //单规格
      var set_meal_array=[];//210 211 220 套餐
      var many = [] //多配多规格
      var temporary = [] //临时菜品列表
      var processing_arry = [] //临时菜品列表
      var porridge_arry = [] //多拼粥
      var testPackage = []//超值套餐/菜品

      var number = 0.0
      var sumMonney = 0.0
      var copyOrder = 1
      var cupNumber = 0; //2020-11-27 购物车数量--来料加工数量重算
      let mealandcouponmoney = 0
      // 这个是待确认数，无论是可确认菜品的数量还是订单中部长确认的操作数量
      // 包括全单部长确认操作、客人数量确认、全单打折
      for (var i = 0; i < cartList.length; i++) {
        if(cartList[i].dishes_status != 20){
          cartList[i].cartList_index = i
        if (that.data.listData_temp != '') {
          var temp123 = JSON.stringify(that.data.listData_temp)
          var listData = JSON.parse(temp123)
          if ((cartList[i].hadOrdered != null || cartList[i].hadOrdered != true) && cartList[i].bufenxi == null) {
            cartList[i].bufenxi = 0;
          }
          //2020-12-04 通用方法
          listData = that.pageageCheckListData(listData, cartList[i]);
          cartList[i].listData = listData
        }
        if (cartList[i].copyOrder != '') {
          copyOrder = cartList[i].copyOrder > 0 ? Number(cartList[i].copyOrder) : 1
        } else {
          copyOrder = 1
        }
        // 统计数量总数
        if (cartList[i].item_type != 1) { // 当菜品取消时，不计算价格和份数
          if (cartList[i].dishes_spec_type == 10) {//多规格多做法数量
            number += Number(cartList[i].measurement_value||cartList[i].number) * copyOrder
            cupNumber += Number(cartList[i].measurement_value|| cartList[i].number) * copyOrder;
          } else if (cartList[i].dishes_spec_type == 8||cartList[i].dishes_spec_type == 2) { //2020-11-27 来料加工数量
            number += Number(cartList[i].number) * copyOrder
            if (cartList[i].em_index != null && cartList[i].en_index != null) {
              cupNumber += Number(cartList[i].em_index.length + cartList[i].en_index.length) * copyOrder;
            }else if(cartList[i].lstOrderEmBlockEating.length){
              cupNumber += Number(cartList[i].item_number) * copyOrder;
            } else {
              cupNumber += Number(cartList[i].number) * copyOrder
            }
          } else {
            number += Number(cartList[i].number) * copyOrder
            cupNumber += Number(cartList[i].number) * copyOrder;
          }
        }
        // 当菜品取消时、被赠送、标单、补单，不计算价格和份数
        if (cartList[i].item_type != 1 && cartList[i].freeOrder != 1 && cartList[i].repairOrder != 1 && cartList[i].item_type != 5) {
          sumMonney += Number(cartList[i].sum) * copyOrder
        }
        if (cartList[i].measurement_value) {
          if (cartList[i].measurement_value == 0 || cartList[i].measurement_value == '0') { //下策，因为业务要求不显示 0 的重量
            cartList[i].measurement_value = ''
          }
        }
        // 订单状态：0-正常 1-申请取消 2-已取消 3申请修改 4-已修改
        // 0 - 正常类别、1 - 茶位米饭、2 - 酒水、3 - 其他用品、 4 - 早市、 5 - 饭市、 6 - 临时菜品
        // spec_type 规格类型：单规格-0，多规格-1，称重多做法-2，计件多做法-3,称重单规格-5，单规格多做法-4，称重多规格-6，单规格加配菜-7，来料加工-8
        
        if (cartList[i].dishes_spec_type == 9 || cartList[i].dishes_spec_type == 91) { //多拼粥
          porridge_arry.push(cartList[i])
        }
        else if (cartList[i].specal_type == 6) { // 临时
          temporary.push(cartList[i])
        }
        else if (cartList[i].dishes_spec_type == 2 || cartList[i].dishes_spec_type == 6) { // 称重菜品
          weight_arry.push(cartList[i])
        }
        else if (cartList[i].dishes_spec_type == 8) { // 来料加工
          if(cartList[i].id && cartList[i].weighingByLocation==1){
            let arr = [];
            cartList[i].lstOrderEmBlockEating.forEach((item,index)=>{
              let arr1 = JSON.parse(JSON.stringify(cartList[i]))
              arr1.lstOrderEmBlockEating = []
              arr[index] = []
              arr1.lstOrderEmBlockEating.push(item)
              arr[index] = arr1
              processing_arry.push(arr[index]) // 
            })
          }else{
            processing_arry.push(cartList[i])
          }
        } else if (cartList[i].dishes_spec_type == 10) { // 多规格多做法
          eatAndSpec_arry.push(cartList[i])
        } else if (cartList[i].dishes_spec_type == 0 || cartList[i].dishes_spec_type == 21 || cartList[i].dishes_spec_type == 23 ||
          cartList[i].dishes_spec_type == 25 || cartList[i].dishes_spec_type == 22 || cartList[i].dishes_spec_type == 24 || cartList[i].dishes_spec_type == 26 || cartList[i].dishes_spec_type == 27) { // 单规格
          single.push(cartList[i])
        }else if(cartList[i].dishes_spec_type==210||cartList[i].dishes_spec_type==211||cartList[i].dishes_spec_type==220){
            set_meal_array.push(cartList[i]);
        }else if (cartList[i].dishes_spec_type == 1 ) { // 多规格 || cartList[i].dishes_spec_type == 22 || 24
          many.push(cartList[i])
        }else if(cartList[i].spec_type == 100 || cartList[i].spec_type == 101 ){
            testPackage.push(cartList[i])            
        }

        }

      
      }
      sumMonney = Number(sumMonney).toFixed(2)
      // app.globalData.cartList = cartList
      app.globalData.sumMonney = sumMonney
      app.globalData.cupNumber = cupNumber
      // 修改订单信息
      that.setData({
        cartList: cartList,
      
        weight_arry: weight_arry,
        eatAndSpec_arry: eatAndSpec_arry,
        porridge_arry: porridge_arry,
        processing_arry: processing_arry,
        many: many,
        single: single,
        set_meal_array:set_meal_array,
        temporary: temporary,
        testPackage:testPackage,

       
        //2020-11-28 来料加工数量按部位算
        //number: Number(number),
        number: Number(cupNumber),

        sumMonney: Number(sumMonney),
      })
    } else {
      app.globalData.cartList = cartList
      app.globalData.sumMonney = 0.0
      app.globalData.cupNumber = 0.0
      that.setData({
        cartList: [],
        set_meal_array:[],
        weight_arry: [], // 称重菜品列表
        eatAndSpec_arry: [], //多规格多做法菜品列表
        porridge_arry: [], //多拼粥菜品列表
        temporary: [], //临时菜品列表
        processing_arry: [], //临时菜品列表
        number: 0.0,
        sumMonney: 0.0
      })
    }
    if(that.data.readyToOrder||that.data.readyToAddMeals){
        that.advanceDepositBefore();
    }else {
      that.getThisOrderInfCB = (bool) => {
        that.advanceDeposit();
      }
    }
  },
  //打开详情页面
  directOpendetail(e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var eatMethodArray = []
    var em_index = []
    var en_index = []
    var em_basicarry = []
    var en_basicarry = []
    //2020-11-19 备注重写
    var quickRemarkStr = '';
    var remarksStr = '';
    quickRemarkStr = item.quickRemark
    remarksStr = remarkJS.splitRemarkStr(item.remark, 1);
    var dishes = that.getDishesInf(item.dishes_id)
    if (item.en_basicarry && item.em_basicarry) {
      if(item.en_basicarry.length != 0 && item.em_basicarry.length == 0){
        en_index = item.en_basicarry
        en_basicarry = item.en_basicarry
        eatMethodArray = item.en_basicarry
      }
      
    } else if(item.lstOrderEmBlockEating){
      if(item.lstOrderEmBlockEating.length != 0){
        en_index = item.lstOrderEmBlockEating
        en_basicarry = item.lstOrderEmBlockEating
        eatMethodArray = item.lstOrderEmBlockEating
      }

    }
    else if (item.em_basicarry.length != 0 && item.en_basicarry.length == 0) {
      em_index = item.em_basicarry
      em_basicarry = item.em_basicarry
      eatMethodArray = item.em_basicarry
    } else { }

    if (dishes.spec_type == 10) {
      if (item.quickRemark) {
        quickRemarkStr = item.quickRemark
      } else {
        quickRemarkStr = ''
      }
      dishes.dishes_price = item.dishes_price
      dishes.dishes_metering_type = item.spec_type
      // that.selectEatmethodAndSpec(dishes.dishes_id)
      eatMethodArray = item.en_basicarry
      if (item.taste != '') {
        that.formatTaste(item.taste)
      }
      if (item.id != 0) {
        if (item.sideDisht != null && item.sideDisht != '') {
          that.setData({
            shrinkIntrIntroduction: true,
            hasSideDish: true,
            SideDishList_choose: item.en_basicarry.SideDishList_choose
          })
        }
      }
    }
    if (dishes.spec_type == 8 && !item.hadOrdered) {
      dishes.dishes_price = item.dishes_price
      dishes.dishes_metering_type = item.spec_type
    }
    if (item.tastes) {
      if (item.tastes != '') {
        that.formatTaste(item.tastes)
      }
    }
    if (item.SideDishList) {
      if (dishes.sideDishes != 0 && item.SideDishList.length == 0) {
        that.SelectSideDish(dishes.sideDishes)
      }
      that.formatSideDishList(item.SideDishList, dishes.sideDishes)
    } else {
      //2020-11-10 没有配菜
      that.setData({
        hasSideDish: false,
        shrinkIntrIntroduction: false,
        SideDishList_choose: [],
        SideDishList: [],
      })
    }
    if (item.dishes_spec_type == 4) { // 单规格多做法菜品
      that.setData({
        showDirectPiece_ordering: true,
        showEatAndSpec_ordering: false,
        showPieceDetail_ordering: false,
        showDirectEatMenthod_ordering: false,
        showProcessingDetail_ordering: false,
      })
    } else if (item.dishes_spec_type == 3) { // 计件
      that.setData({
        showPieceDetail_ordering: true,
        showDirectPiece_ordering: false,
        showEatAndSpec_ordering: false,
        showDirectEatMenthod_ordering: false,
        showProcessingDetail_ordering: false,
      })
    } else if (item.dishes_spec_type == 8 || item.dishes_spec_type == 2) { // 来料加工、称重多做法
      if (eatMethodArray.length != 0) {
        that.formatTaste(eatMethodArray[0].tastes);
        that.formatSideDishList(eatMethodArray[0].SideDishList, dishes.sideDishes);
        quickRemarkStr = remarkJS.splitRemarkStr(eatMethodArray[0].remarks, 0);
        remarksStr = remarkJS.splitRemarkStr(eatMethodArray[0].remarks, 1);
      }
      that.setData({
        eatMethodArray: eatMethodArray,
        eatMethodChooseIndex: 0,
        showProcessingDetail_ordering: false,
        showPieceDetail_ordering: false,
        showEatAndSpec_ordering: false,
        showDirectPiece_ordering: false,
        showDirectEatMenthod_ordering: true,
      })
    } else if (item.dishes_spec_type == 10) { // 多规格多做法
      that.setData({
        showProcessingDetail_ordering: false,
        showPieceDetail_ordering: false,
        showEatAndSpec_ordering: true,
        showDirectPiece_ordering: false,
        showDirectEatMenthod_ordering: false,
      })
    } else { // 称重多做法菜品
      that.setData({
        confirmweighing: item.measurement_value,
        showDirectEatMenthod_ordering: true,
        showPieceDetail_ordering: false,
        showEatAndSpec_ordering: false,
        showDirectPiece_ordering: false,
        showProcessingDetail_ordering: false,
      })
    }
    that.setData({
      em_index: em_index,
      en_index: en_index,
      dishesMoney: item.sum,
      inputvalue: item.disher_weight,
      inputvalue1: item.disher_weight_ceiling,
      em_basicarry: em_basicarry,
      en_basicarry: en_basicarry,
      adddishes_flag: item.adddishes_flag,
      eatMethodArray: eatMethodArray,
      dishes: dishes,
      dishesitem: item,
      dishes_remark: remarksStr,
      quickRemark: quickRemarkStr,
      confirmweighing: item.measurement_value,
      totalamount: item.sum,
      dishes_introduce: item.dishes_introduce
    })
    // 判断购物车中的em_basicarry是否有吃法，并且每个部位都被选择
    that.getEatMethod(item.dishes_id)
  },
  directOpendetail111(e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var eatMethodArray = []
    var em_index = []
    var en_index = []
    var em_basicarry = []
    var en_basicarry = []
    //2020-11-19 备注重写
    var quickRemarkStr = '';
    var remarksStr = '';
    if (item.remark != undefined) {
      quickRemarkStr = remarkJS.splitRemarkStr(item.remark, 0);
      remarksStr = remarkJS.splitRemarkStr(item.remark, 1);
    }
    var dishes = that.getDishesInf(item.dishes_id)
    if (dishes.spec_type == 10) {
      // dishes.dishes_price = item.dishes_price
      // dishes.dishes_metering_type = item.spec_type
      // eatMethodArray = item.en_basicarry
      let eat ={
        eating_method:item.eating_method,
        dishesSpec:{
          spec_name:item.dishes_metering_type,
          vip_price:item.vip_price,
          inline_price:item.inline_price,
          spec_price:item.dishes_price,
        },
        Number:item.item_number,
        sum:item.sum
      }
      eatMethodArray.push(eat)
      if (item.taste != '') {
        that.formatTaste(item.taste)
      }
      if (item.id != 0) {
        if (item.sideDisht != null && item.sideDisht != '') {
          that.setData({
            shrinkIntrIntroduction: true,
            hasSideDish: true,
            SideDishList_choose: item.lstOrderSideDish
          })
        } else {
          //2020-11-10 没有配菜
          that.setData({
            hasSideDish: false,
            shrinkIntrIntroduction: false,
            SideDishList_choose: [],
            SideDishList: [],
          })
        }
      }
    }
    that.setData({
      eatMethodArray: eatMethodArray,
      eatMethodChooseIndex: 0,
      showProcessingDetail_ordering: false,
      showPieceDetail_ordering: false,
      showEatAndSpec_ordering: false,
      showDirectPiece_ordering: false,
      showDirectEatMenthod_ordering: true,
    })
    if (item.dishes_spec_type == 10) { // 多规格多做法
      that.setData({
        showProcessingDetail_ordering: false,
        showPieceDetail_ordering: false,
        showEatAndSpec_ordering: true,
        showDirectPiece_ordering: false,
        showDirectEatMenthod_ordering: false,
      })
    } else { // 称重多做法菜品
      that.setData({
        confirmweighing: item.measurement_value,
        showDirectEatMenthod_ordering: true,
        showPieceDetail_ordering: false,
        showEatAndSpec_ordering: false,
        showDirectPiece_ordering: false,
        showProcessingDetail_ordering: false,
      })
    }
    that.setData({
      em_index: em_index,
      en_index: en_index,
      dishesMoney: item.sum,
      inputvalue: item.disher_weight,
      inputvalue1: item.disher_weight_ceiling,
      em_basicarry: em_basicarry,
      en_basicarry: en_basicarry,
      adddishes_flag: item.adddishes_flag,
      eatMethodArray: eatMethodArray,
      dishes: dishes,
      dishesitem: item,
      dishes_remark: remarksStr,
      quickRemark: quickRemarkStr,
      confirmweighing: item.measurement_value,
      totalamount: item.sum,
      dishes_introduce: item.dishes_introduce
    })
    // 判断购物车中的em_basicarry是否有吃法，并且每个部位都被选择
    that.getEatMethod(item.dishes_id)
  },
  //选择做法 来料加工
  eatMethodChoose: function (event) {
    if (this.data.detailsType == 0) {
      if (this.data.detailItem.lstOrderEmBlockEating != null) {
        let eatMethodArray = JSON.parse(JSON.stringify(this.data.detailItem.lstOrderEmBlockEating));
        let remarkStr = remarkJS.splitRemarkStr(eatMethodArray[event.detail].remarks, 1);
        let quickRemarkStr = remarkJS.splitRemarkStr(eatMethodArray[event.detail].remarks, 0);
        this.setData({
          eatMethodChooseIndex: event.detail,
          SideDishList_choose: eatMethodArray[event.detail].lstOrderSideDish,
          // tastesRemark: eatMethodArray[event.detail].tastesRemark,
          tastesRemark: eatMethodArray[event.detail].tastes,
          dishes_remark: remarkStr,
          quickRemark: quickRemarkStr,
          "detailItem.remarks": remarkJS.splitRemarkStr(this.data.eatMethodArray[event.detail].remarks, 1),
          "detailItem.quickRemark": remarkJS.splitRemarkStr(this.data.eatMethodArray[event.detail].remarks, 0),
          tastes: eatMethodArray[event.detail].tastes,
          // SideDishList: eatMethodArray[event.detail].SideDishList
        })
      }
    } else {
      if (this.data.eatMethodArray.length > 1) {
        if (event.detail != -1) {
          let remarkStr = remarkJS.splitRemarkStr(this.data.eatMethodArray[event.detail].remarks, 1);
          let quickRemarkStr = remarkJS.splitRemarkStr(this.data.eatMethodArray[event.detail].remarks, 0);
          let SideDishList = this.data.eatMethodArray[event.detail].SideDishList;
          if (SideDishList == null || SideDishList.length == 0) {
            this.SelectSideDish(this.data.dishes.sideDishes)
          } else {
            this.setData({
              SideDishList: this.data.eatMethodArray[event.detail].SideDishList
            })
          }
          this.setData({
            eatMethodChooseIndex: event.detail,
            SideDishList_choose: this.data.eatMethodArray[event.detail].SideDishList_choose,
            tastesRemark: this.data.eatMethodArray[event.detail].tastesRemark,
            dishes_remark: remarkStr,
            quickRemark: quickRemarkStr,
            tastes: this.data.eatMethodArray[event.detail].tastes,
            SideDishList: this.data.eatMethodArray[event.detail].SideDishList,
            "detailItem.remarks": remarkStr,
            "detailItem.quickRemark": quickRemarkStr
          })
        } else {
          this.setData({
            eatMethodChooseIndex: event.detail,
            SideDishList_choose: [],
            tastesRemark: "",
            dishes_remark: "",
            remarks: "",
            quickRemark: '',
            tastes: ''
          })
        }
      } else {
        this.setData({
          eatMethodChooseIndex: event.detail,
        })
      }
    }
  },

  aaa() {
    return true;
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
        dishesMoney: dishesMoney.toFixed(2),
        dishesNumber: dishesNumber,
      })
    } else if (type == 1) { // 多做法显示总金额
      var eatMethodArray = that.data.eatMethodArray
      var dishesitem = that.data.dishesitem
      var dishesMoney = 0
      var emMoney = 0
      var ingredientsAmount = 0
      var sideDishMoney = 0
      var dishesPrice = 0;//菜品单价
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
      if (that.data.dishes.spec_type == 8 || that.data.dishes.spec_type == 2) {
        if (dishesitem.isWhole) { //全部位
          var price = eatMethodArray[0].price
          var number = eatMethodArray[0].number != '' ? eatMethodArray[0].number : ''
          dishesMoney = Number(number) * price + sideDishMoney
        } else {
          if (eatMethodArray.length != 0) {
            for (var x of this.data.eatMethodArray) {
              dishesMoney += x.money
              ingredientsAmount += x.price * x.number
            }
          }
          dishesitem.ingredientsAmount = ingredientsAmount
          that.setData({
            dishesitem: dishesitem
          })
        }
        dishesPrice = Number(that.data.dishes.dishes_price) * Number(that.data.confirmweighing);
      } else {
        dishesMoney = Number(that.data.confirmweighing) * that.data.dishes.dishes_price + emMoney + sideDishMoney
      }
      if (that.data.dishes.spec_type == 10) {
        var dishes = that.data.dishes;
        dishes.dishes_price = Number(eatMethodArray[0].dishesSpec.spec_price)
        dishes.dishes_metering_type = eatMethodArray[0].dishesSpec.spec_name
        that.setData({
          dishes: dishes
        })
      }
      that.setData({
        dishesMoney: dishesMoney + Number(dishesPrice)
      })
    }
  },

  // 显示创建订单前的吃法
  showEatway1: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var cartList = that.data.cartList
    var index = e.currentTarget.dataset.index
    var inputvalue7 = Number(item.disher_weight)
    var inputvalue8 = Number(item.disher_weight_ceiling)
    var before_en_index = JSON.parse(JSON.stringify(that.data.en_basicarry));
    var before_em_index = that.data.em_basicarry;

    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].cartList_index == item.cartList_index) {
        that.setData({
          dishes: cartList[i]
        })
        index = i
      }
    }
    var inputvalue, inputvalue1
    inputvalue = Number(item.disher_weight)
    inputvalue1 = Number(item.disher_weight_ceiling)
    var en_index = cartList[index].en_index;
    var em_index = cartList[index].em_index;
    var em_basicarry = cartList[index].em_basicarry;
    var en_basicarry = JSON.parse(JSON.stringify(cartList[index].em_basicarry));
    that.setData({
      inputvalue: inputvalue,
      inputvalue1: inputvalue1,
      inputvalue7: inputvalue7,
      inputvalue8: inputvalue8,
      selecthowtodo_flag: false,
      en_index: en_index,
      em_index: em_index,
      em_basicarry: em_basicarry,
      en_basicarry: en_basicarry,
      before_en_index: before_en_index,
      before_em_index: before_em_index,
    })
  },
  //加菜 直接点餐用
  adddishes: function (e) {
    var that = this
    // that.timed_refresh(1)
    // 2021-9-1 21:26
    if(app.globalData.adddishes == false){
      console.log("这里是返回");
      wx.navigateBack({
        url: '/pages/module_others/pages/menu/menu'
      })
    }else{
      console.log("这里是加菜");
      wx.showLoading({
        title: '跳转中...',
      })
      var thisorderarry = that.data.thisorderarry
      app.globalData.ordre_code = thisorderarry.ordre_code
      app.globalData.order_tablename = thisorderarry.order_tablename
      app.globalData.order_arrival_time = thisorderarry.order_arrival_time
      app.globalData.preorder_starus = thisorderarry.preorder_starus;
      app.globalData.userNum = thisorderarry.user_count
  
      wx.navigateTo({
        url: '/pages/module_others/pages/menu/menu?locationindex=3&orderid=' + thisorderarry.order_id + '&ordertype=' + 1 + '&thisorderarry=' + JSON.stringify(thisorderarry)
      })
    }
  },
  // 下单前
  adddishesage: function () {
    console.log("禁止加菜1713");
  },
  // 显示已有订单的吃法
  showEatway: function (e) {
    var that = this;
    var item = e.currentTarget.dataset.item;
    var cartList = that.data.cartList
    var orderDetail = that.data.orderDetail
    var dishes = that.data.cartList;
    var index = e.currentTarget.dataset.index
    var dishes_id = e.currentTarget.dataset.item.dishes_id;
    var cartList_index = e.currentTarget.dataset.item.cartList_index;
    var showModalStatus1 = that.data.showModalStatus;
    var showModalStatus = that.data.showModalStatus1;
    var difference_flag = that.data.difference_flag;
    var whole = that.data.whole;
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].cartList_index == cartList_index) {
        that.setData({
          dishes: cartList[i]
        })
      }
    }
    // setTimeout(function() {
    //要延时执行的代码
    var inputvalue, inputvalue1
    inputvalue = Number(item.disher_weight)
    inputvalue1 = Number(item.disher_weight_ceiling)
    var inputvalue7 = Number(item.disher_weight)
    var inputvalue8 = Number(item.disher_weight_ceiling)
    var weight_image_arry = []
    var before_en_index = that.data.en_basicarry;
    var before_em_index = that.data.em_basicarry;
    var result1 = orderDetail[index].weigh_img.includes(",")
    if (result1) {
      weight_image_arry = orderDetail[index].weigh_img.split(",")
    } else {
      weight_image_arry.push(orderDetail[index].weigh_img)
    }
    var weight_image = orderDetail[index].weigh_img
    if (cartList[index].switch_emid_flag && cartList[index].u_em_id != 0) {
      if (cartList[index].u_em_id.length == 1) {
        var before_en_index = cartList[index].em_basicarry;
        var before_em_index = -1;
      } else {
        var before_em_index = cartList[index].em_basicarry;
        var before_en_index = -1;
      }
    }
    if (difference_flag) {
      var en_index = that.data.en_index;
      var em_index = that.data.em_index;
    } else {
      if (cartList[index].en_index == undefined) {
        var en_index = that.data.en_index; //xin
        var em_index = that.data.em_index; //xin 
      } else {
        var en_index = cartList[index].en_index;
        var em_index = cartList[index].em_index;
      }
    }
    if (cartList[index].dishes_status == 10 && orderDetail[index].dishes_status == 5) {
      en_index = cartList[index].en_index
      em_index = cartList[index].em_index
      var em_basicarry = JSON.parse(JSON.stringify(cartList[index].em_basicarry))
      var en_basicarry = cartList[index].em_basicarry
    }
    that.setData({
      inputvalue: inputvalue,
      inputvalue1: inputvalue1,
      inputvalue7: inputvalue7,
      inputvalue8: inputvalue8,
      selecthowtodo_flag: false,
      en_index: en_index,
      em_index: em_index,
      before_en_index: before_en_index,
      before_em_index: before_em_index,
    })
    if (weight_image_arry != undefined) {
      that.setData({
        weight_image: weight_image_arry
      })
    }
    // }, 1000)
  },

  //吃法菜品规格1
  getEatmethod: function (e) {
    // --------------------------------获取菜品吃法--------------------------------------
    var that = this;
    var item = e.currentTarget.dataset.item
    var orderDetail = that.data.orderDetail
    var index3 = e.currentTarget.dataset.index
    var cartList = that.data.cartList
    var parts = [] //部位的数组
    var whole = [] //整体的数组

    wx.request({
      url: app.globalData.SelectEatingMethod_url,
      data: {
        dishes_id: item.dishes_id
      },
      success: function (res) {
        if (res.data.result.result == 1) {
          //--------------将部位和整吃分为两个数组----------------------
          var em_arry = res.data.object
          for (var i = 0; i < cartList.length; i++) {
            if (item.cartList_index == cartList[i].cartList_index) {
              index3 = i
            }
          }
          var en_index = cartList[index3].en_index;
          var em_index = cartList[index3].em_index;
          var em_basicarry = cartList[index3].em_basicarry;
          var en_basicarry = cartList[index3].em_basicarry;
          em_arry = res.data.object
          if (res.data.object[0]) {
            whole = res.data.object[0]
          }
          if (res.data.object[1]) {
            for (var i in em_arry) {
              if (i > 0) parts.push(res.data.object[i])
            }
          }
          that.setData({
            whole: whole,
            parts: parts,
            em_arry: em_arry,
            changeweightdishes_flag: false,
            em_index: JSON.parse(JSON.stringify(em_basicarry)),
            em_basicarry: em_basicarry,
            en_index: JSON.parse(JSON.stringify(en_basicarry)),
            en_basicarry: en_basicarry,
            index3: index3
          })
          var em_parts = that.data.parts
          if (that.data.em_id != undefined) {
            var em_id = JSON.parse(that.data.em_id);
          } else if (item.em_basicarry != 0) {
            var em_id = item.em_basicarry;
          } else {
            var em_id = item.em_basicarry;
          }
          var em_index = []
          var en_index = []
          if (em_id.length == 1) {
            var result = em_id.every(function (item, index, arry) {
              return item == -1
            })
            that.setData({
              result_en: result,
              result_em: !result,
            })
          } else {
            var result = em_id.every(function (item, index, arry) {
              return item == -1
            })
            that.setData({
              result_em: result,
              result_en: !result,
            })
          }
          if (cartList[index3].dishes_spec_type == 4) {
            that.sumPosition()
          }
          var g0 = false
          if (whole > 0) {
            g0 = true
          } else {
            g0 = false
          }
          that.setData({
            green_show0: g0,
            em_arry: em_arry,
          })
          var dishes_status
          if (cartList[index3].dishes_status == 10 && orderDetail[index3].dishes_status == 5) {
            var en_index = cartList[index3].en_index
            var em_index = cartList[index3].em_index
            var em_basicarry = cartList[index3].em_basicarry
            var en_basicarry = JSON.parse(JSON.stringify(cartList[index3].em_basicarry))
            that.setData({
              en_index: en_index,
              em_index: em_index,
              em_basicarry: em_basicarry,
              en_basicarry: en_basicarry,
            })
          }
          if (orderDetail == undefined || (orderDetail != undefined && cartList[index3].id == 0)) {
            that.showEatway1(e)
          } else {
            if (orderDetail[index3].em_id != 0) {
              // 显示已有订单的吃法
              that.showEatway(e)
            } else {
              // 显示创建订单前的吃法
              that.showEatway1(e)
            }
          }
        } else {
          setTimeout(function () {
            wx.showToast({
              title: '网络异常,请刷新', //提示文字
              duration: 2000, //显示时长
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
            })
          }, 2000)
        }
        wx.hideLoading()
      }
    })
  },
  //吃法菜品规格1
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
        if (data.object.length != 0) {
          em_arry = Object.values(data.object)
          if (em_arry.length > 0) {
            for (var x = 0; x < em_arry.length; x++) {
              if ("剩余部位".indexOf(em_arry[x][0].em_name) != -1) {
                needRemain = true
              }
              for (var y = 0; y < em_arry[x].length; y++) {
                em_arry[x][y].checked = false
                em_arry[x][y].number = ''
                em_arry[x][y].place = em_arry[x][y].em_name
                em_arry[x][y].additional = em_arry[x][y].money
                em_arry[x][y].practice = em_arry[x][y].eating_method
                em_arry[x][y].price = em_arry[x][y].money
                em_arry[x][y].tastes = ""
                em_arry[x][y].tastesRemark = ""
                em_arry[x][y].remarks = ""
                em_arry[x][y].SideDishList = []
                em_arry[x][y].SideDishList_choose = []
              }
              partsName.push({
                "em_name": em_arry[x][0].em_name,
                "checked": false
              })
            }
          }
        }
      } else { }
      that.setData({
        em_arry: em_arry,
        partsName: partsName,
        needRemain: needRemain
      })
      wx.hideLoading({
        complete: (res) => { },
      })
    }).catch(res => {
      wx.hideLoading({
        complete: (res) => { },
      })
    })
  },
  //通过修改详情加入购物车,多种做法菜品
  addToCart4: function (e) {
    var that = this;
    var cartList = that.data.cartList
    var dishes = that.data.dishes
    var dishesitem = that.data.dishesitem
    var em_index = that.data.em_index
    var em_basicarry = that.data.em_basicarry
    var confirmweighing = that.data.confirmweighing
    var en_index = that.data.en_index
    var en_basicarry = that.data.en_basicarry
    var index = dishesitem.cartList_index
    var inputvalue = that.data.inputvalue
    var inputvalue1 = that.data.inputvalue1
    var sum = 0;
    var remark = dishesitem.remark
    var tastes = dishesitem.tastes

    if (dishes.sideDishes != 0) {
      if (dishesitem.SideDishList != undefined) {
        if (that.data.SideDishList != dishesitem.SideDishList) {
          cartList[index].SideDishList = that.data.SideDishList
          cartList[index].sideDisht = that.toSideDisht(that.data.SideDishList)
        }
      }
    }
    if (that.data.tastes != undefined && that.data.tastes != dishesitem.tastes) {
      tastes = that.data.tastes
    }
    if (that.data.confirmweighing != "" && that.data.confirmweighing != cartList[index].measurement_value) {
      cartList[index].measurement_value = that.data.confirmweighing
    }
    var sum_position = that.sumPosition();
    if (cartList[index].dishes_spec_type == 10) {
      cartList[index].number = Number(confirmweighing)
    }
    if (cartList[index].dishes_spec_type == 8) {
      cartList[index].dishes_price = that.data.dishes.dishes_price
      if (!dishesitem.isWhole) {
        cartList[index].ingredientsAmount = dishesitem.ingredientsAmount
      }
    }
    cartList[index].em_basicarry = em_basicarry;
    cartList[index].em_index = em_index;
    cartList[index].en_basicarry = en_basicarry;
    cartList[index].en_index = en_index;
    cartList[index].remark = remark;
    cartList[index].tastes = tastes;
    if (cartList[index].dishes_spec_type == 10) {
      cartList[index].sum = Number(that.data.confirmweighing) * Number(cartList[index].dishes_price);
    } else {
      cartList[index].sum = that.data.dishesMoney;
    }
    that.mangnerCarList(cartList)
    that.setData({
      en_index: en_index,
      showDirectEatMenthod_ordering: false,
      showDirectPiece_ordering: false,
      showPieceDetail_ordering: false,
      showProcessingDetail_ordering: false,
      showEatAndSpec_ordering: false,
      dishes_remark: '',
      confirmweighing: 0,
      textareaOpen: true,
    })
  },
  // 通过修改详情加入购物车  来料加工专用
  // 份数视为1道菜
  // 总价：（单价+加收） * 重量/个数 + 配菜
  addToCart5: function (e) {
    var that = this;
    var cartList = that.data.cartList
    var dishes = that.data.dishes
    var inputvalue = that.data.inputvalue
    var inputvalue1 = that.data.inputvalue1
    var em_index = that.data.em_index
    var em_basicarry = that.data.em_basicarry
    var en_index = that.data.en_index
    var en_basicarry = that.data.en_basicarry
    var result = that.data.result
    var index = that.data.index3
    var orderDetail = that.data.orderDetail
    var cupNumber = that.data.cupNumber
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].dishes_id == dishes.id) {
        cartList[i].u_item_number = cartList[i].item_number
        if (cartList[i].dishes_status == 10 && orderDetail[i].dishes_status == 5) {
          cartList[i].u_em_id = cartList[i].u_em_id
        } else {
          cartList[i].u_em_id = cartList[i].em_basicarry
        }
        // 更新订单em_id调换标志
        cartList[i].switch_emid_flag = 1
        index = i
      }
    }
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
    if (inputvalue >= 0 && inputvalue1 >= 0 && inputvalue1 >= inputvalue && result) {
      var sum = 0;
      var remark = "无"
      if (that.data.dishes_remark != undefined && that.data.dishes_remark != "") {
        remark = that.data.dishes_remark
      }
      if (cartList[index].dishes_id == dishes.dishes_id) {
        var sum_position = that.sumPosition();
        if (cartList[index].dishes_spec_type == 4) {
          cartList[index].measurement_value = Number(inputvalue)
          cartList[index].sum = Number(inputvalue) * (cartList[index].dishes_price + Number(sum_position));
        }
        cartList[index].disher_weight = inputvalue;
        cartList[index].disher_weight_ceiling = inputvalue1;
        cartList[index].item_number = inputvalue + ',' + inputvalue1;
        if (cartList[index].dishes_spec_type == 4) {
          cartList[index].number = Number(inputvalue);
          cartList[index].sum = Number(inputvalue) * (Number(cartList[index].price) + Number(sum_position));
        }
        cartList[index].em_basicarry = em_basicarry;
        cartList[index].em_index = em_index;
        cartList[index].en_basicarry = en_basicarry;
        cartList[index].en_index = en_index;
        cartList[index].remark = remark;
      }
      that.mangnerCarList(cartList)
      that.setData({
        en_index: en_index,
        showDirectEatMenthod_ordering: false,
        showDirectPiece_ordering: false,
        showPieceDetail_ordering: false,
        showEatAndSpec_ordering: false,
        // cupNumber:cupNumber,
        dishes_remark: '',
        textareaOpen: true,
      })
    }
  },
  //通过修改详情加入购物车,多规格多做法菜品
  addToCart6: function (e) {
    var that = this;
    var cartList = that.data.cartList
    var dishes = that.data.dishes
    var dishesitem = that.data.dishesitem
    var em_index = that.data.em_index
    var em_basicarry = that.data.em_basicarry
    var confirmweighing = that.data.confirmweighing
    var en_index = that.data.en_index
    var en_basicarry = that.data.en_basicarry
    var index = dishesitem.cartList_index
    var inputvalue = that.data.inputvalue
    var inputvalue1 = that.data.inputvalue1
    var sum = 0;
    var remark = dishesitem.remark
    var tastes = dishesitem.tastes

    if (that.data.dishes_remark != undefined && that.data.dishes_remark != dishesitem.remark) {
      remark = that.data.dishes_remark
    }
    if (dishes.sideDishes != 0) {
      if (dishesitem.SideDishList != undefined) {
        if (that.data.SideDishList != dishesitem.SideDishList) {
          cartList[index].SideDishList = that.data.SideDishList
          cartList[index].sideDisht = that.toSideDisht(that.data.SideDishList)
        }
      }
    }
    if (that.data.tastes != undefined && that.data.tastes != dishesitem.tastes) {
      tastes = that.data.tastes
    }
    if (that.data.confirmweighing != "" && that.data.confirmweighing != cartList[index].measurement_value) {
      cartList[index].measurement_value = that.data.confirmweighing
    }
    if (cartList[index].dishes_spec_type == 10) {
      cartList[index].number = Number(confirmweighing)
    }
    cartList[index].em_basicarry = em_basicarry;
    cartList[index].em_index = em_index;
    cartList[index].en_basicarry = en_basicarry;
    cartList[index].en_index = en_index;
    cartList[index].remark = remark;
    cartList[index].tastes = tastes;
    cartList[index].sum = Number(that.data.confirmweighing) * Number(en_basicarry[0].dishesSpec.spec_price);
    cartList[index].dishes_price = Number(en_basicarry[0].dishesSpec.spec_price);
    cartList[index].price = Number(en_basicarry[0].dishesSpec.spec_price);

    that.mangnerCarList(cartList)
    that.setData({
      en_index: en_index,
      showDirectEatMenthod_ordering: false,
      showDirectPiece_ordering: false,
      showPieceDetail_ordering: false,
      showEatAndSpec_ordering: false,
      dishes_remark: '',
      confirmweighing: 0,
      textareaOpen: true,
    })
  },
  //选择一菜多吃的做法部位
  choose_part(e) {
    var that = this
    var emnumber = e.currentTarget.dataset.inde
    var em_index = that.data.em_index
    var em_basicarry = that.data.em_basicarry
    var item = e.currentTarget.dataset.item
    em_basicarry[emnumber] = item
    em_index[emnumber] = item
    var result = em_index.every(function (item, index, arry) { //对数组中的每一项运行给定的函数，如果该函数对每一项都返回true，则结果返回true。
      return item == -1
    })
    that.setData({
      em_basicarry: em_basicarry,
      em_index: em_index,
      result_em: result
    })
    if (that.data.dishes.dishes_spec_type == 4) {
      that.sumPosition()
    }
  },
  //输入菜品重量
  keyinput: function (e) {
    var dishes = this.data.dishes
    var sum = e.detail.value * dishes.dishes_price
    var spec_type = dishes.spec_type
    var inputvalue1
    spec_type == '斤' ? inputvalue1 = this.data.inputvalue1 : inputvalue1 = e.detail.value
    this.setData({
      sum: sum,
      inputvalue: e.detail.value,
      inputvalue1: inputvalue1
    })
    if (this.data.dishes.dishes_spec_type == 4 || this.data.dishes.spec_type == 10) {
      this.setData({
        confirmweighing: Number(e.detail.value)
      })
    }
  },
  keyinput1: function (e) {
    this.setData({
      inputvalue1: e.detail.value
    })
  },
  //选择一菜多吃的做法全鱼
  choose_whole(e) {
    var that = this
    var emnumber = 0
    var en_index = that.data.en_index
    var en_basicarry = that.data.en_basicarry
    var item = e.currentTarget.dataset.item
    en_index[emnumber] = item;
    en_basicarry[emnumber] = item
    var result = en_index.every(function (item, index, arry) { //对数组中的每一项运行给定的函数，如果该函数对每一项都返回true，则结果返回true。
      return item == -1
    })
    that.setData({
      en_basicarry: en_basicarry,
      en_index: en_index,
      result_en: result
    })
    if (that.data.dishes.dishes_spec_type == 4) {
      that.sumPosition()
    }
  },
  sumPosition: function () { //加收选择的时候进行金额的显示控制
    var that = this;
    var em_basicarry = that.data.em_basicarry;
    var en_basicarry = that.data.en_basicarry;
    var sum_position = 0;
    if (em_basicarry.length) {
      for (var i = 0; i < em_basicarry.length; i++) {
        if (em_basicarry[i] != -1 && em_basicarry[i] != null) {
          sum_position += Number(em_basicarry[i].money)
        }
      }
    }
    if (en_basicarry) {
      for (var i = 0; i < en_basicarry.length; i++) {
        if (em_basicarry[i] != -1 && em_basicarry[i] != null) {
          sum_position += Number(en_basicarry[i].money)
        }
      }
    }
    that.setData({
      sum_position: sum_position
    })
    return sum_position
  },
  // 赠送菜品，下单用
  freeDishes_order: function (e) {
    var that = this
    var dishesitem = e.currentTarget.dataset.dishesitem
    var cartList = that.data.cartList
    for (var i = 0; i < cartList.length; i++) {
      if (dishesitem.cartList_index == cartList[i].cartList_index) {
        if (dishesitem.item_type == 0) {
          cartList[i].item_type = 5
          cartList[i].sum = 0
        } else if (dishesitem.item_type == 5) {
          cartList[i].item_type = 0
          if (dishesitem.dishes_spec_type == 2 || dishesitem.dishes_spec_type == 3 || dishesitem.dishes_spec_type == 5 || dishesitem.dishes_spec_type == 6) {
            cartList[i].sum = 0 // 称重菜品还是为0
          } else {
            cartList[i].sum = (Number(cartList[i].number) * Number(cartList[i].price)).toFixed(2)
          }
        }
      }
    }
    that.mangnerCarList(cartList)
  },
  // 部长赠送菜品
  freeDishesToCustomer: function (e) {
    var that = this;
    let foodItem = e.currentTarget.dataset.dishesitem
    // that.timed_refresh(1)
    //  operatorchecked
    if (foodItem.item_type != 1) { //不是退餐的情况下
      var flag = true
      //计件/称重菜品需要先部长确认称重之后，才能赠送，避免赠送之后再确认混淆价格
      if (foodItem.spec_type == 2 || foodItem.spec_type == 3 || foodItem.spec_type == 5 || foodItem.spec_type == 6) {
        if (foodItem.operatorchecked != 1) {
          flag = false
        }
      }
      if (flag) {
        that.setData({
          showPresentation: true,
          freeFoodItem: foodItem,
          freeDishRemark: ''
        })
      } else {
        time.show_NOCANCEL_Model("称重/计件菜品需要确认称重才能赠送")
      }
    } else {
      time.show_NOCANCEL_Model("菜品已取消，无法赠送")
    }
  },
  //输入单规格称重菜品的重量
  keyInput2_order: function (e) {
    var that = this
    var cartList = that.data.cartList
    var item = e.currentTarget.dataset.item;
    var num = e.detail.value
    //双框合一
    cartList[item.cartList_index].item_number = num + "," + num;
    cartList[item.cartList_index].disher_weight = num
    cartList[item.cartList_index].disher_weight_ceiling = num
    cartList[item.cartList_index].operator = app.globalData.loginname
    cartList[item.cartList_index].operation_time = time.formatTime(new Date())
    cartList[item.cartList_index].sum = parseFloat(Number(num) * Number(cartList[item.cartList_index].dishes_price).toFixed(2))
    that.mangnerCarList(cartList)
  },
  formsubmit2: function (e) {
    var that = this
    var cartList = that.data.cartList
    var item = e.detail.target.dataset.item;
    var num = e.detail.value.weight_money2
    if (num <= 0) {
      wx.showToast({
        title: '请输入正确的重量',
        icon: 'success',
        duration: 2000,
      })
    } else {
      cartList[item.cartList_index].item_number = num + "," + num;
      cartList[item.cartList_index].disher_weight = num
      cartList[item.cartList_index].disher_weight_ceiling = num
      cartList[item.cartList_index].operator = app.globalData.loginname
      cartList[item.cartList_index].operation_time = time.formatTime(new Date())
      cartList[item.cartList_index].sum = parseFloat(Number(num) * Number(cartList[item.cartList_index].dishes_price).toFixed(2))
    }
    that.mangnerCarList(cartList)
  },
  //输入单规格称重菜品的重量
  keyinput2: function (e) {
    var that = this;
    var cartList = that.data.cartList
    var id = e.currentTarget.dataset.id //拿出修改的菜的id
    var number1 = -1;
    var c_id = -1;
    //判断是否与之前的值相同,否则进入修改状态
    for (var i = 0; i < cartList.length; i++) { //获取原来的数值,赋值为number1
      if (cartList[i].id == id) {
        number1 = cartList[i].item_number.split(',')[0];
        c_id = i;
        break;
      }
    }
    if (number1 != e.detail.value) {
      // 用餐时间内需要部长确认修改  
      //preorder_starus就是order_inf表里面的preorder_starus,是订单的状态
      if (app.globalData.preorder_starus == 1 && cartList[c_id].adddishes_flag != 0 && that.data.locationindex != 1) {
        var decNumflag = 1;
        app.globalData.decNumflag = decNumflag;
        that.reserve_modify1(e);
        // 判断是否加菜或者新的订单 加菜 新订单随时可减少 已有订单修改需要判断时间
      } else if (app.globalData.preorder_starus == 4 || app.globalData.preorder_starus == 0 || cartList[c_id].adddishes_flag == 0 || that.data.locationindex == 1) {
        that.reserve_modify1(e);
        //  订单已过期不能修改
      } else {
        wx.showModal({
          title: '提示',
          content: '订单已过期',
          cancelText: "否",
          confirmText: "是",
          success(res) {
            if (res.confirm) {
              //用户点击确定
            }
            if (res.cancel) {
              //用户点击取消
            }
          }
        })
      }
    } else {
      //变回普通状态
    }
  },

  keyinput3: function (e) {
    var that = this;
    var cartList = that.data.cartList
    var id = e.currentTarget.dataset.id
    var number2 = -1;
    //判断是否与之前的值相同,否则进入修改状态
    for (var i = 0; i < cartList.length; i++) { //获取原来的数值,赋值为number1
      if (cartList[i].id == id) {
        number2 = cartList[i].item_number.split(',')[0];
        break;
      }
    }
    if (number2 != e.detail.value) {
      that.reserve_modify2(e);
    } else {
      that.reserve_modify2(e);
    }
  },
  // 部长直接 订单中的加号
  directQuantity: function (e) {
    var that = this
    var dishesitem = e.currentTarget.dataset.dishesitem
    var cartList = that.data.cartList
    
      for (var i = 0; i < cartList.length; i++) {
        if (dishesitem.dishes_id == cartList[i].dishes_id) {
          cartList[i].number++
          cartList[i].sum = cartList[i].dishes_price * cartList[i].number
          app.globalData.cartList = cartList
          const pages = getCurrentPages()
          const prevPage = pages[pages.length - 2]
          prevPage.setData({
            cartList:cartList
          })
        }
      }
      that.mangnerCarList(cartList)   
  },

  // 部长直接 订单中的减号
  directReduction: function (e) {
    var that = this
    var dishesitem = e.currentTarget.dataset.dishesitem
    var cartList = that.data.cartList

    if (dishesitem.number - 1 > 0) {
      for (var i = 0; i < cartList.length; i++) {
        if (dishesitem.dishes_id == cartList[i].dishes_id) {
          if(cartList[i].number <= 1) return;
          cartList[i].number--
          cartList[i].sum = cartList[i].dishes_price * cartList[i].number
          app.globalData.cartList = cartList
          const pages = getCurrentPages()
          const prevPage = pages[pages.length - 2]
          prevPage.setData({
            cartList:cartList
          })
        }
      }
      that.mangnerCarList(cartList);

    }    
  },

  bindPickerPrintChange: function (e) {
    var that = this;
    //选择打印机的触发事件
    that.setData({
      printIndex: e.detail.value
    })
  },
  chooseOnePrint: function (e) {
    // 选择单个打印机
    var that = this;
    var printShowArray = that.data.printShowArray
    let id = e.currentTarget.dataset.item.id
    let printIndex = -1
    //打印机只能选一个
    for (let i = 0, len = printShowArray.length; i < len; ++i) {
      printShowArray[i].check = printShowArray[i].id === id
      if (printShowArray[i].id === id) {
        printIndex = i
      }
    }
    that.setData({
      printShowArray: printShowArray,
      printIndex: printIndex
    })
  },
  choosePrint: function (e) {
    var that = this;
    //选择打印方式
    let type = e.currentTarget.dataset.type
    if (type == 0) {
      //默认打印
      that.setData({
        printType1: true,
        printType2: false,
        showPrintChoose: false,
      })
    } else {
      //选择指定打印机打印
      that.setData({
        printType1: false,
        printType2: true,
        showPrintChoose: true,
      })
    }
  },
  //弹出打印小票的窗口
  showPrint: function () {
    var that = this
    // that.setData({
    //   showprintmodalstatus: true,
    //   printType1: true,
    //   printType2: false
    // })
    // app.globalData.orderCode
    console.log(app.globalData.orderCode)
    var count = 0;
    var user_count = app.globalData.userNum
    var order_name = that.data.thisorderarry.user_name
    var dishescount = 0
    var tbcCount = that.data.cartList.length // 部长待确认数不需要下单时填写
    var order_type = 1 // 部长下单视为堂食
    // 新需求 help_order变更为 ：0-手机下单，1-触屏下单，2-线上下单，3-扫码下单，4-帮客下单
    var help_order = 0
    var preorder_starus = 0 // 凡是部长下单都直接视为出单
    var arrivaltime = String(app.globalData.date) + ' ' + String(app.globalData.time) //差一个日期
    var nowtime = time.formatTime(new Date)
    var needToCreate = false
    var orderRemarks = remarkJS.joinRemarkStr(that.data.Order_quick_remark, that.data.Order_remark);
    var order_updata = {
      Order_type: order_type, //订单类型：0-堂食、1-预定、2-外卖
      Shop_id: app.globalData.shopdetail.shop_id,
      Table_id: app.globalData.locationid,
      // 我要改2.0
      Order_code: app.globalData.orderCodeValue, //订单编码后五位，通过
      User_count: user_count, //用餐人数
      User_id: app.globalData.user_id,
      Users_id: app.globalData.user_id, //点餐人id，可多人点餐
      arrival_time: arrivaltime,
      dinner_time: app.globalData.dinnerTime,
      phone_num: app.globalData.phonenumber, //电话号码
      user_name: order_name, //用户姓名
      dishes_count: dishescount, //菜品数量
      table_name: app.globalData.locationname, //桌位名称
      preorder_starus: preorder_starus, //预定订单状态 0-未确认、1-已确认、2-申请取消、3-已取消、4-已申请确认、5-申请修改、6-已修改、7-不能修改
      operator: that.data.loginname, //操作人员记录
      operation_time: nowtime, //订单操作时间 
      tbc_count: tbcCount, //待确认菜品数
      help_order: help_order, //0-正常单、1-帮人点但未转发、2-帮人点已转发
      cz_flag: that.data.cz_flag, //充整标志0-不充整，1-充整
      Grand_total: that.data.sumMonney, //应收
      Order_subtotal: that.data.sumMonney, //订单小计
      order_wait: that.data.all_wait_order ? that.data.all_wait_order : 0, //菜品是否需要叫起
      invoice_flag: that.data.invoice_flag, //是否开发票 0-不开 1-开
      Order_remark: orderRemarks, //订单备注
      paymethod: that.data.paymethod, // 默认支付方式
      copyOrderNum: that.data.copyOrderNum,
      // order_choose_printer: order_choose_printer,//选择指定打印的打印机编号
      all_free_order: that.data.all_free_order ? that.data.all_free_order : 0,
      all_repair_order: that.data.all_repair_order ? that.data.all_repair_order : 0,
      all_wait_order: that.data.all_wait_order ? that.data.all_wait_order : 0,
      all_bale_order: that.data.all_bale_order ? that.data.all_bale_order : 0,
      vipPhone:app.globalData.phonenumber,
      vipCard:app.globalData.vipCard,
      order_equipment_type : 3
    }
    order_updata.Order_code=app.globalData.orderCode,
    console.log(app.globalData.shopdetail.shop_id);
    console.log(order_updata.order_equipment_type);
    console.log(order_updata.Order_code);
    wx.request({ // 创建订单
        url: app.globalData.WriteOrder_url,
        // url:'http://localhost:8088/houduan_war_exploded/WriteOrderNew',
        data: {
          Shop_id:app.globalData.shopdetail.shop_id,
          Order_code:app.globalData.orderCode,
          order_equipment_type:order_updata.order_equipment_type
        },
        // data: getorderCode,
        success: function (res) {
          console.log(res,"请求成功8-17-14");
        },
        fail: function (res) {
          //订单创建失败
          wx.hideLoading()
        }
      })
  },
  closePrint: function () {
    var that = this
    that.setData({
      showprintmodalstatus: false,
      showPrintChoose: false,
    })
  },
  closePrint2: function () {
    var that = this
    that.setData({
      showprintmodalstatus: false,
      showPrintChoose: false,
      showAllConfirmPrintView: false,
    })
  },
  //显示确认提交订单或确认加餐的框
  showSubmitTheOrder: function (e) {
    var that = this
    //locationindex  写入数据库后的操作 1-复制订单，需要写入，2-更换桌号 ，3-加菜
    //order_type 订单类型：0-堂食、1-预定、2-外卖、3-外卖自提
    var content = "是否确认提交";
    if (that.data.readyToOrder && !that.data.readyToAddMeals) {
      content = '确认提交订单';
    } else if (!that.data.readyToOrder && that.data.readyToAddMeals) {
      content = '确认直接加菜';
    }
    wx.showModal({
      title: '提示',
      content: content,
      cancelText: '否',
      confirmText: '是',
      success(res) {
        if (res.confirm) {
          //确认提交，显示出打印选择框
          that.showPrint()
        } else {
        }
      }
    })
  },
  

  switchNav(event) {
    var cur = event.currentTarget.dataset.current;
    //每个tab选项宽度占1/5
    var singleNavWidth = this.data.windowWidth / 5;
    //tab选项居中                            
    this.setData({
      navScrollLeft: (cur - 2) * singleNavWidth
    })
    if (this.data.currentTab == cur) {
      // return false;
      this.setData({
        currentTab: -1,
        showDirectDishes: false
      })
    } else {
      this.setData({
        currentTab: cur,
        showDirectDishes: true
      })
    }
  },
  // 获取容器高度，使页面滚动到容器底部
  pageScrollToBottom: function () {
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#message').boundingClientRect()
    query.exec(function (res) {
      //获取高度，并跳转
      wx.pageScrollTo({
        scrollTop: res[0].top,
      })
    })
  },
  // 获取容器高度，使页面滚动到容器头部
  pageScrollToTop: function () {
    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id
    query.select('#orderInf').boundingClientRect()
    query.exec(function (res) {
      //获取高度，并跳转
      wx.pageScrollTo({
        scrollTop: res[0].top + 10,
      })
    })
  },
 
  endSetInter: function () {
    var that = this;
    //清除计时器  即清除setInter
    clearTimeout(that.data.timer);
    clearInterval(that.data.setInter)
    clearInterval(that.data.surveillanceCycle)
  },
  onHide: function () {
    var that = this;
    //清除计时器  即清除setInter
    clearTimeout(that.data.timer);
    clearTimeout(that.data.timer_shine);
    clearInterval(that.data.setInter)
    clearInterval(that.data.surveillanceCycle)
  },
  onUnload: function () {
    console.log('6666')
    if(this.data.isFromBuy){
      wx.reLaunch({
        url: '/pages/orders/orders',
      })
    }
    var that = this;
    //清除计时器  即清除setInter
    this.stopFlash()
    this.stopFlash1()
    clearTimeout(that.data.timer);
    clearTimeout(that.data.timer_shine);
    clearInterval(that.data.setInter)
    clearInterval(that.data.surveillanceCycle)
    if (app.globalData.guideback) {
      app.globalData.guideback = false
    }
    //2020-12-02 取消订单，不返回到点菜页面
    if (that.data.thisorderarry.order_status == "已取消" && that.data.detailsType == "2") {
      wx.reLaunch({
        url: '/pages/orders_list/orders_list',//永久重定向到a页面
      })
    }
  },
  // 打折
  isDiscount: function () {
    var that = this;
    // if (app.globalData.levellist.indexOf("18") != -1 || app.globalData.levellist.indexOf("1") != -1) {
    if (that.data.isDiscount == false) {
      wx.showModal({
        content: '是否全单打折',
        showCancel: true, //是否显示取消按钮
        confirmText: "是", //默认是“确定”
        cancelText: "否", //默认是“取消”
        confirmColor: '#519763', //取消文字的颜色
        cancelColor: '#519763', //确定文字的颜色
        success: function (res) {
          if (res.confirm) {
            //点击取消,默认隐藏弹框
            that.setData({
              isDiscount: true
            })
            that.recordConfirmationInf(0, "全单打折", null)
            if (that.data.discountRate != '') { // 重新计算价钱
              //重新计算打折金额
              var discount_money = that.discount(that.data.discountRate, true)
              that.setData({
                discountMoney: discount_money
              })
            }
          } else { }
        },
        fail: function (res) { }, //接口调用失败的回调函数
        complete: function (res) {
          that.redress()
        }, //接口调用结束的回调函数（调用成功、失败都会执行）
      })
    } else {
      that.setData({
        isDiscount: false
      })
      if (that.data.discountRate != '') { // 重新计算价钱
        //重新计算打折金额
        var discount_money = that.discount(that.data.discountRate, false)
        that.setData({
          discountMoney: discount_money
        })
      }
    }
  },
  //将备注存入全局变量
  foodRemark: function (e) {
    this.setData({
      dishes_remark: e.detail.value
    })
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
    porridgeObjectList[0].totalPrice = Number(porridgeObjectList[0].totalPrice).toFixed(2)
    this.setData({
      porridgeObjectList: porridgeObjectList
    })
  },
  //格式化口味，并回显
  formatTaste: function (tastes) {
    var tastesRemark = ''
    if (tastes != '' && tastes != undefined) {
      var taste = tastes.split(',')
      for (var x = 0; x < taste.length; x++) {
        taste[x] = "[" + taste[x] + "]"
      }
      tastesRemark = taste.join(" ")
    } else {
      tastes = '';
      tastesRemark = '';
    }
    this.setData({
      tastes: tastes,
      tastesRemark: tastesRemark
    })
  },
  //格式化口味，并回显
  // sideDishes当不为0的时候，视为有配菜
  formatSideDishList: function (SideDishList, sideDishes) {
    var that = this
    if (sideDishes != 0) {
      var SideDishList_choose = []
      if (SideDishList != "" && SideDishList != undefined) {
        for (var x of SideDishList) {
          if (x.checked) {
            SideDishList_choose.push(x)
          }
        }
      }
      that.setData({
        hasSideDish: true,
        shrinkIntrIntroduction: true,
        SideDishList_choose: SideDishList_choose,
        SideDishList: SideDishList,
      })
    } else {
      that.setData({
        hasSideDish: false,
        shrinkIntrIntroduction: false,
        SideDishList_choose: [],
        SideDishList: [],
      })
    }
  },
  //菜品介绍,下单前用
  showfoodDetail: function (e) {
    console.log(e)
    // return;
    var that = this;
    var item = e.currentTarget.dataset.dishesitem
    var index = -1
    var cartList = that.data.cartList
    var foodname = item.name
    var dishes = that.getDishesInf(item.dishes_id)
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].cartList_index == item.cartList_index) {
        index = i;
      }
      if (item.dishes_id == cartList[i].dishes_id) {
        that.setData({
          dishes_introduce: cartList[i].dishes_introduce
        })
      }
    }
    //控制详情的配菜跟口味按钮显示 6是临时菜
    //210220
    if (item.specal_type == 6 && item.id != undefined) {
      this.setData({ id: false })
    }
    // 显示标志
    if (item.dishes_spec_type == 6) {
      foodname = item.spec_name
    }
    
    if(item.spec_type == 101 || item.spec_type == 100){        
        wx.navigateTo({
          url: '../module_discount/pages/Package_details/Package_details?id=0&setMealID=' + item.ticketOrderinfo.ticketId + '&shop_id=' + app.globalData.shopdetail.shop_id + '&fromMenu=true&orderId=' + item.ticketOrderinfo.orderId,
        })
        return
    }
    
    //210205 dishes.sideDishes
    if (item.sideDishes != 0) {
      var SideDishList = []
      var SideDishList_choose = []
      if (item.SideDishList) {
        SideDishList = item.SideDishList
        for (var x of SideDishList) {
          if (x.checked) {
            SideDishList_choose.push(x)
          }
        }
      }
      that.setData({
        hasSideDish: true,
        shrinkIntrIntroduction: true,
        SideDishList_choose: SideDishList_choose,
        SideDishList: item.SideDishList,
      })
    } else {
      that.setData({
        hasSideDish: false,
        shrinkIntrIntroduction: false,
        SideDishList_choose: [],
        SideDishList: [],
      })
    }
    //if (item.tastes) {
    that.formatTaste(item.tastes) // 回显口味
    // }
    //2020-11-19 备注重写
    let quickRemarkStr = '';
    let remarksStr = '';

    quickRemarkStr = remarkJS.splitRemarkStr(item.remark, 0);
    remarksStr = remarkJS.splitRemarkStr(item.remark, 1);
    // 多拼粥
    if (item.dishes_spec_type == 9 || item.dishes_spec_type == 91) {
      if (item.SideDishList) {
        if (dishes.sideDishes != 0 && item.SideDishList.length == 0) {
          that.SelectSideDish(dishes.sideDishes)
        }
        that.formatSideDishList(item.SideDishList, dishes.sideDishes)
      } else {
        //2020-11-10 没有配菜
        that.setData({
          hasSideDish: false,
          shrinkIntrIntroduction: false,
          SideDishList_choose: [],
          SideDishList: [],
        })
      }
      // 初始化dishes的数值（选中、单价份数、数量、总金额）
      this.formatMaterial(item.porridgeObject.list)
      item.dishes.poridgeNum = item.number
      item.dishes.poridgeAllPrice = item.sum
      this.setData({
        // goodModel: item.dishes,
        currentItemType: item.item_type,
        porridgeBackObject: item.porridgeObject,
        porridgeObject: item.porridgeObject,
        show: true,
        dishes: dishes,
        foodindex: index,
        currentDishesModel: item.dishes,
        goodModel: item.dishes,
        dishesitem: item,
        goodsIntroduce: item.dishes.dishes_introduce ? item.dishes.dishes_introduce : "",
        foodIntroduce: item.dishes.dishes_introduce ? item.dishes.dishes_introduce : "",
        dishes_remark: remarksStr,
        tastes: item.tastes ? item.tastes : "",
        tastesRemark: item.tastesRemark ? item.tastesRemark : "",
        quickRemark: quickRemarkStr
      })
      return;
    }
    that.setData({
      //210205  修改了详情的价格 price
      foodprices: item.dishes_price, //菜品介绍价格
      foodspecifications: item.spec_type, //菜品介绍规格
      dishes_introduce: item.dishes_introduce, //旧的
      goodsIntroduce: item.dishes_introduce,
      monthly_sales_volume: 0,
      foodname: foodname,
      dishes: dishes,
      dishesitem: item,
      image: item.img_url,
      dishes_remark: remarksStr,
      showCartflag: false,
      showfoodDetail: true, // !that.data.showfoodDetail
      foodindex: index,
      textareaOpen: false,
      //2020-11-18 普通粥口味
      tastes: item.tastes ? item.tastes : "",
      //tastesRemark: item.tastesRemark ? item.tastesRemark : "",
      quickRemark: quickRemarkStr,
      spec_name: item.spec_name,
      sum: item.sum,
    })
    if (item.specal_type == 6 || item.specal_type == 4) {
      //210320 临时菜详情数据处理
      var SideDishList = []
      var SideDishList_choose1 = []
      if (item.id != undefined) {
        //出单后
        if (item.remarks != undefined) {
          quickRemarkStr = remarkJS.splitRemarkStr(item.remarks, 0);
          remarksStr = remarkJS.splitRemarkStr(item.remarks, 1);
        } else {
          quickRemarkStr = remarkJS.splitRemarkStr(item.remark, 0);
          remarksStr = remarkJS.splitRemarkStr(item.remark, 1);
        }
        if (item.sideDisht != "") {
          SideDishList = JSON.parse(item.sideDisht)
          for (var x of SideDishList) {
            if (x.orderDetailedNum > 0) {
              SideDishList_choose1.push(x)
            }
          }
        }
        var sum1
        // var number
        if (item.sum == undefined) {
          sum1 = item.item_subtotal
        } else {
          sum1 = item.sum
        }
      
        this.setData({
          sum: sum1,
          measurement_value: item.measurement_value,
          // number:number,
          foodprices: item.item_price,
          foodspecifications: item.spec_name,
          image: item.dishes_img,
          quickRemark: quickRemarkStr,
          dishes_remark: remarksStr,
          SideDishList_choose: SideDishList_choose1,
          tastesRemark: item.taste
        })
      } else {
        // ,number:item.number 
        this.setData({ sum: item.sum, measurement_value: item.measurement_value })
      }
    }
  },
  // 拼粥 处理选择食材之后的逻辑
  selPorridgeBackObject: function (event) {
    this.data.porridgeBackObject = event.detail.porridgeBackObject;
    var result = event.detail.result;
    if (result == -1) {
      wx.showToast({
        icon: 'none',
        duration: 2000,
        title: '不能继续添加食材。',
      })
    } else if (result == 1) {
      if (this.data.currentDishesModel.jointSetValuation == '1') {
        // 按份计算
        this.data.currentDishesModel.selName = this.data.porridgeBackObject.selName ? this.data.porridgeBackObject.selName : "请选择"
        this.data.currentDishesModel.poridgeAllPrice = this.data.currentDishesModel.dishes_price * this.data.currentDishesModel.poridgeNum
        this.setData({
          goodModel: this.data.currentDishesModel,
        })
      } else {
        // 按食材计算
        this.data.currentDishesModel.selName = this.data.porridgeBackObject.selName ? this.data.porridgeBackObject.selName : "请选择"
        this.data.currentDishesModel.dishes_price = this.data.porridgeBackObject.selAllPrice
        this.data.currentDishesModel.poridgeAllPrice = this.data.porridgeBackObject.selAllPrice * this.data.currentDishesModel.poridgeNum
        this.setData({
          goodModel: this.data.currentDishesModel,
        })
      }
    }
  },
  // 返回输入的数量
  currentBackGoodModel: function (event) {
    this.data.currentDishesModel = event.detail.currentBackGoodModel;
  },
  // 组件备注返回
  remarkBack: function (event) {
    this.data.currentDishesModel.remark = event.detail.remarkText;
    this.setData({
      dishes_remark: event.detail.remarkText
    })
    this.commonSpecType8(2, event.detail.remarkText);
  },
  // 点击多拼粥弹窗详情修改保存, 下单前
  addToCartMorePoridge: function (e) {
    var that = this
    var cartList = that.data.cartList
    var dishes = that.data.currentDishesModel
    var dishesitem = that.data.dishesitem
    //多拼粥食材的id和num
    var List = that.data.porridgeBackObject.list
    let dishes_sum = parseFloat(dishes.poridgeAllPrice.toFixed(2))
    var jointSetArray = []
    var jointSetString = ''
    //var remark = dishesitem.remark
    var tastes = dishesitem.tastes
    var tastesRemark = dishesitem.tastesRemark ? dishesitem.tastesRemark : ''
    var index = dishesitem.cartList_index
    var sideDisht = dishesitem.sideDisht ? dishesitem.sideDisht : []
    var SideDishList = dishesitem.SideDishList ? dishesitem.SideDishList : []
    var num = 0;
    var remark = '';
    if (dishes.poridgeNum == '' || dishes.poridgeNum == null) {
      time.show_NOCANCEL_Model("数量不能为空，请输入份数")
      return;
    } else {
      if (that.data.quickRemark != undefined) {
        remark = that.data.quickRemark + ";" + that.data.dishes_remark
      } else {
        remark = that.data.dishes_remark;
      }
      if (dishes.sideDishes != 0) {
        var sideDishes_sum = 0
        SideDishList = that.data.SideDishList
        sideDisht = that.toSideDisht(that.data.SideDishList)
        for (var i = 0; i < SideDishList.length; i++) {
          if (SideDishList[i].checked && SideDishList[i].orderDetailedNum > 0) {
            if (SideDishList[i].orderDetailedSum) {
              sideDishes_sum += Number(SideDishList[i].orderDetailedSum)
            }
          }
        }
        dishes_sum += sideDishes_sum
      }
      if (that.data.tastes != undefined && that.data.tastes != dishesitem.tastes) {
        tastes = that.data.tastes
        tastesRemark = that.data.tastesRemark
      }
      if (List) {
        for (let i = 0; i < List.length; i++) {
          var porridgeGood = List[i]
          if (porridgeGood.selectStatus) {
            var tempStr = porridgeGood.ID + '-' + porridgeGood.jointSetUnit
            jointSetArray.push(tempStr)
            num++
          }
        }
      }
      // 判断当前选中的数量是否符合多拼粥
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
      jointSetString = jointSetArray.join(",");
      //出单前将菜品————订单信息取出
      dishesitem.remark = remark
      dishesitem.jointSet = jointSetString
      dishesitem.tastes = tastes
      dishesitem.tastesRemark = tastesRemark
      dishesitem.number = dishes.poridgeNum
      dishesitem.sum = dishes_sum
      dishesitem.dishes_price = dishes.dishes_price
      dishesitem.price = dishes.dishes_price
      dishesitem.sideDisht = sideDisht
      dishesitem.SideDishList = SideDishList
      dishesitem.porridgeObject = that.data.porridgeBackObject,
        dishesitem.item_type = that.data.currentItemType,
        dishesitem.dishes = dishes,
        // 替换
        // cartList.splice(index, 1, addItem)
        cartList.splice(index, 1, dishesitem)
      that.setData({
        show: false, //关闭弹窗
        lock: false  //多拼粥备注锁定按钮颜色控制
      })
      that.mangnerCarList(cartList)
    }
  },
  // 点击多拼粥弹窗详情修改保存, 下单后
  closePopupView: function (e) {
    this.setData({
      show: false,
      anniu: false,
      lock: false,
      showDishesDetail: false //订单详情的详情弹页关闭
    });
  },
  onClose() {
    this.setData({
      showModalStatus3: false,
      showfoodDetail: false,
      show: false,
      dishes_introduce: ''
    });
  },
  getDishesInf(dishes_id) {
    var dishes = ""
    app.globalData.menuListItem.map(function (menu) {
      if (dishes_id == menu.dishes_id) {
        dishes = menu;
      }
    })
    return dishes;
  },
  // 下单后，订单详情多拼粥的打开与关闭
  showMorePoridgeDishesDetail: function (e) {
    var that = this
    // that.timed_refresh(1)
    if (!that.data.show) {
      var dishesitem = e.currentTarget.dataset.dishesitem
      if (dishesitem.id != null && dishesitem.id != '' && dishesitem.id != undefined) {
        //控制口味配菜等按钮  出单后变灰
        that.setData({
          anniu: true
        })
      }
      var dishes = that.getDishesInf(dishesitem.dishes_id)
      that.formatTaste(dishesitem.taste) // 回显口味
      if (dishes.sideDishes != 0) {
        var SideDishList = []
        var SideDishList_choose = []
        if (dishesitem.sideDisht) {
          SideDishList = JSON.parse(dishesitem.sideDisht)
          for (var x of SideDishList) {
            if (x.orderDetailedNum > 0) {
              SideDishList_choose.push(x)
            }
          }
        }
        that.setData({
          hasSideDish: true,
          shrinkIntrIntroduction: true,
          SideDishList: SideDishList,
          SideDishList_choose: SideDishList_choose,
          dishes_remark: dishesitem.remark
        })
      } else {
        that.setData({
          hasSideDish: false,
          shrinkIntrIntroduction: false,
          SideDishList: [],
          SideDishList_choose: [],
        })
      }
      //2020-11-19 备注重写
      let quickRemarkStr = '';
      let remarksStr = '';
      if (dishesitem.remarks && dishesitem.remarks.indexOf(";") != -1) {
        quickRemarkStr = dishesitem.remarks.split(";")[0];
        remarksStr = dishesitem.remarks.split(";")[1];
      } else {
        remarksStr = dishesitem.remarks;
      }
      // 多拼粥
      var jointSet = dishesitem.jointSet
      var jointSets = jointSet.split(',')
      var selName = []
      var sum = 0
      var foodNum = []

      for (var i = 0; i < jointSets.length; i++) {
        foodNum[i] = jointSets[i].split('-')
        jointSets[i] = parseInt(jointSets[i].split('-')[0])
      }
      var shopData = {
        shop_id: app.globalData.shopdetail.shop_id,
        dishes_id:dishesitem.dishes_id
      }
      wx.request({
        url: app.globalData.SelectJointSet,
        method:'GET',
        data:shopData,
        success:res=>{
        if (res.data.result.result == 1) {
          res.data.object.currentNum = res.data.object.jointSetNum
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
          dishesitem.item_subtotal * dishesitem.copyOrder
          // 初始化dishes的数值（选中、单价份数、数量、总金额）
          //sum = Number(dishesitem.item_subtotal * dishesitem.copyOrder)
          res.data.object.selName = selName
          res.data.object.selAllPrice = sum
          dishes.poridgeNum = dishesitem.number
          dishes.poridgeAllPrice = dishesitem.sum
          var goodModel = {
            dishes_name: dishesitem.name,
            dishes_img: dishes.dishes_img,
            poridgeName: dishesitem.dishes_name,
            selName: selName,
            jointSetValuation: dishes.jointSetValuation,
            dishes_price: dishesitem.dishes_price,
            poridgeNum: dishesitem.number,
            poridgeAllPrice: dishesitem.sum,
            vip_price:dishesitem.vip_price,
            inline_price:dishesitem.inline_price,
            spec_type:dishesitem.dishes_spec_type,
          }
          this.getFoodNum(res,foodNum)
          this.formatMaterial(res.data.object.list)
          this.setData({
            porridgeObject: res.data.object,
            porridgeBackObject: res.data.object,
            show: true,
            currentDishesModel: dishes,
            goodModel: goodModel,
            goodsIntroduce: dishes.dishes_introduce ? dishes.dishes_introduce : "",
            foodIntroduce: dishes.dishes_introduce ? dishes.dishes_introduce : "",
          })
        } else {
          wx.showToast({
            title: '获取详情失败',
            icon: 'none', //如果要纯文本，不要icon，将值设为'none'
            duration: 2000
          })
        }
      }
      })
      dishesitem.dishes_introduce = dishes.dishes_introduce
      dishesitem.praise_points = dishes.praise_points
      dishesitem.monthly_sales_volume = dishes.monthly_sales_volume
      // 初始化dishes的数值（选中、单价份数、数量、总金额）
      this.setData({
        dishes: dishes,
        currentItemType: dishesitem.item_type,
        porridgeBackObject: dishesitem.porridgeObject,
        porridgeObject: dishesitem.porridgeObject,
        //dishes_remark: dishesitem.remarks,
        dishes_remark: remarksStr,
        quickRemark: quickRemarkStr,
        goodsIntroduce: dishes.dishes_introduce,
        dishesDetail: dishesitem,
        show: true,
      })

    } else { // 关闭的时候，可能会记录菜品备注
      if (that.data.thisorderarry.help_order == 2) { //只有直接下单的时候才会备注
        //修改订单详情，跟其他菜品一样，不同的是，连菜品名称都可以修改
        var remarks = ''
        var tastes = ''
        var sideDisht = ''
        var jointSetString = ''
        var fenshu = false
        var dishesDetail = that.data.dishesDetail
        var data = {
          "id": dishesDetail.id,
          "Order_id": dishesDetail.order_id,
          "Shop_id": that.data.shop_id
        }
        if (dishesDetail.remarks != that.data.dishes_remark) {
          remarks = that.data.dishes_remark
          data.remarks = that.data.dishes_remark
        }
        if (dishesDetail.tastes != that.data.tastes) {
          data.tastes = that.data.tastes
        }
        if (Number(that.data.currentDishesModel.poridgeNum) != Number(dishesDetail.item_number)) {
          data.item_number = that.data.currentDishesModel.poridgeNum
          data.item_price = that.data.currentDishesModel.dishes_price
          data.Item_subtotal = that.data.currentDishesModel.poridgeAllPrice
          fenshu = true
        }
        if (dishesDetail.sideDisht != '') { // 没有矫正金额
          sideDisht = that.toSideDisht(that.data.SideDishList)
          if (sideDisht != '') {
            data.sideDisht = sideDisht
          }
        }
        if (that.data.porridgeBackObject.list) { // 没有矫正金额
          var List = that.data.porridgeBackObject.list
          if (List != '') {
            var jointSetArray = []
            for (let i = 0; i < List.length; i++) {
              var porridgeGood = List[i]
              if (porridgeGood.selectStatus) {
                var tempStr = porridgeGood.ID + '-' + porridgeGood.jointSetUnit
                jointSetArray.push(tempStr)
              }
            }
            jointSetString = jointSetArray.join(",");
            if (jointSetString != dishesDetail.jointSet) {
              data.jointSet = jointSetString
            } else {
              jointSetString = ''
            }
          }
        }

        if (remarks != '' || tastes != '' || sideDisht != '' || jointSetString != '' || fenshu) {
          WXAPI.updateOrderDetailedForAll(data).then(function (data) {
            if (data.result.result == 1) {
              //修改信息成功
              that.redress()
            } else {
              //修改信息失败
            }
          }).catch(function (e) {
            //备注失败
          })
        }
      }
      that.setData({
        dishes: [],
        show: false,
        dishesDetail: [],
        tastes: '',
        tastesRemark: '',
        dishes_remark: "",
        SideDishList: [],
        SideDishList_choose: [],
        goodsIntroduce: "",
      })
    }
  },


  //查看寄存详情
  showDepositDetail: function (e) {
    var that = this
    that.setData({
      showDepositDetail: !that.data.showDepositDetail
    })
  },
  //刷新，矫正金额和菜品数量（未）
  redress: function (e) {
    let that = this
    wx.request({
      url: app.globalData.SynchronizedAmount_url,
      data: {
        order_id: that.data.orderid,
      },
      success: function (res) {
        if (res.data.result.result == 1) {
          //刷新成功
          that.getThisOrderInf(that.data.orderid) //获得该订单信息
          that.selectDiscountInformationByOrderId()
          that.getThisOrderDetailAndInf()
          that.getorderpayment()
          that.resetOffer() //重置优惠信息
        }
      }
    })
  },
  //计时器，用于闪烁的红点
  showme: function () {
    var that = this
    // that.setData({
    //   timer_shine: setInterval(function () {
    //     if (!that.data.showme) {
    //       that.setData({
    //         showme: true,
    //       });
    //     } else {
    //       that.setData({
    //         showme: false,
    //       });
    //     }
    //   }, 1200) 
    setInterval(function () {
      if (!that.data.showme) {
        that.setData({
          showme: true,
        });
      } else {
        that.setData({
          showme: false,
        });
      }
    }, 1200)
    //这里的单位是毫秒，是计时器在倒数时的间隔时间,如果想把闪烁速度调快，把这里的数值调低
    // })
  },
  //获取详细订单，菜品分类
  getThisOrderDetailAndInf: function () {
    var that = this
    //获取详细订单
    wx.request({
      url: app.globalData.GetOrderDetails_url,
      // url:"http://192.168.8.7:8080/WX Restaurant/GetOrderDetailsNew",
      data: {
        Order_id: that.data.orderid
      },
      success: function (res) {
        if (res.data.result.result == 1) {
          var dishes = res.data.object
          wx.request({
            url: app.globalData.selectOrderConfirmationInfByOrderID_url,
            data: JSON.stringify({
              "order_id": that.data.orderid
            }),
            header: {
              'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
              if (res.data != null) {
                var infs = res.data
                for (var x = 0; x < dishes.length; x++) {
                  infs.map(function (inf) {
                    if (inf.dishesOperator == "多种做法修改" && dishes[x].id == inf.dishesDetailedId) {
                      dishes[x].multipleTypeChangeInf = inf
                    }
                    if (inf.dishesOperator == "多种做法确认" && dishes[x].id == inf.dishesDetailedId) {
                      dishes[x].multipleTypeCheckInf = inf
                    }
                    if (inf.dishesOperator == "临时菜品修改" && dishes[x].id == inf.dishesDetailedId) {
                      dishes[x].temporaryDishChangeInf = inf
                    }
                    if (inf.dishesOperator == "临时菜品下单" && dishes[x].id == inf.dishesDetailedId) {
                      dishes[x].temporaryDishCheckInf = inf
                    }
                    if (inf.dishesOperator == "取消菜品" && dishes[x].id == inf.dishesDetailedId) {
                      dishes[x].cancelDishInf = inf
                    }
                    if (inf.dishesOperator == "赠送菜品" && dishes[x].id == inf.dishesDetailedId) {
                      dishes[x].freeDishInf = inf
                    }
                  })
                  // if (dishes[x].em_id.length > 0 && dishes[x].dishes_status!=20) {
                  //   dishes[x].em_id = JSON.parse(dishes[x].em_id)
                  // }
                }
                that.setData({
                  hasConfirmationRecord: true
                })
              } else {
                that.setData({
                  hasConfirmationRecord: false
                })
              }
            },
            fail: function (res) {
              that.setData({
                hasConfirmationRecord: false
              })
            },
            complete: function (res) {
            
             that.zhenLiCartList(dishes)
            }
          })
        } else {
          that.setData({
            hasOrderDetailed: false
          })
        }
      },
      fail: function () {
        that.setData({
          hasOrderDetailed: false
        })
      },
      complete: function () {
      }
    })
  },
  // 获取滚动条当前位置
  onPageScroll: function (e) {
    let self = this;
    let top = e.scrollTop;
    if (e.scrollTop > 100) {
      self.setData({
        floorstatus: true,
        scrollTop: top
      });
    } else {
      self.setData({
        floorstatus: false,
        scrollTop: top
      });
    }
  },

  //回到顶部
  goTop: function (e) { // 一键回到顶部
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  //回到底部
  goBottom: function (e) { // 一键回到底部
    if (wx.pageScrollTo) {
      wx.createSelectorQuery().select('#page').boundingClientRect(function (rect) {
        if (rect) {
          // 使页面滚动到底部
          wx.pageScrollTo({
            scrollTop: rect.height
          })
        }
      }).exec()
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },

  checkboxChange1: function (e) {
    var ListOfCancellation = this.data.ListOfCancellation
    var i = e.currentTarget.dataset.index
    ListOfCancellation[i].checked = !ListOfCancellation[i].checked
    this.setData({
      ListOfCancellation: ListOfCancellation
    })
  },
  checkboxChange2: function (e) {
    var ListOfPresentation = this.data.ListOfPresentation
    var i = e.currentTarget.dataset.index
    ListOfPresentation[i].checked = !ListOfPresentation[i].checked
    this.setData({
      ListOfPresentation: ListOfPresentation
    })
  },
  cancelNew:function(foodItem){
   
    var that =this;
    var weight_arry = that.data.weight_arry// 多计量多做法
    var eatAndSpec_arry = that.data.eatAndSpec_arry //多规格多做法菜品列表
    var temporary = that.data.temporary //临时菜品列表
    var processing_arry = that.data.processing_arry//来料加工
    var porridge_arry = that.data.porridge_arry //多拼粥品
    var single = that.data.single //单规格
    var many = that.data.many //多配多规格

    var vaildTotal
    // var number
    if((foodItem.spec_type==0 ||foodItem.spec_type==21||foodItem.spec_type==22||foodItem.spec_type==23||foodItem.spec_type==24||foodItem.spec_type==25 ||foodItem.spec_type==26||foodItem.spec_type==27)&& foodItem.specal_type!=6){
        // 单规格
      for(var i=0;i<single.length;i++){
        if(single[i].id==foodItem.id){
        //   single[i].dishes_status=3;
        //   single[i].item_type=1;
        //   single[i].cancel_number=that.data.nm;
        //   single[i].operator=app.globalData.loginname;

        //  vaildTotal=Number(Number(that.data.vaildTotal)-(Number(that.data.nm)*Number(single[i].item_price)))
        //  .toFixed(2)
        single[i].cancel_apply = 1
        }
    }
  }
  if(foodItem.specal_type==6){
    // 临时菜
    for(var i=0;i<temporary.length;i++){
      if(temporary[i].id==foodItem.id){
      //   temporary[i].dishes_status=3;
      //   temporary[i].item_type=1;
      //   temporary[i].cancel_number=that.data.nm;
      //   temporary[i].operator=app.globalData.loginname;

      //  vaildTotal=Number(Number(that.data.vaildTotal)-(Number(temporary[i].item_subtotal))).toFixed(2)
      temporary[i].cancel_apply = 1
      }
    }
  }
  if(foodItem.spec_type==8){
    // 来料加工
    for(var i=0;i<processing_arry.length;i++){
      if((processing_arry[i].dishes_id==foodItem.dishes_id)&&(processing_arry[i].id==foodItem.id)){
      //   processing_arry[i].dishes_status=3;
      //   processing_arry[i].item_type=1;
      //   processing_arry[i].cancel_number=that.data.nm;
      //   processing_arry[i].operator=app.globalData.loginname;

      //  vaildTotal=Number(Number(that.data.vaildTotal)-(Number(processing_arry[i].item_subtotal))).toFixed(2)
      processing_arry[i].cancel_apply = 1
      }
    }
  }
  if(foodItem.spec_type==1){
    // 多配多规格
    for(var i=0;i<many.length;i++){
      if(many[i].id==foodItem.id){      
        many[i].cancel_apply = 1
      }
    }
  }
  if(foodItem.spec_type==9 || foodItem.spec_type==91){
    // 多拼粥品
    for(var i=0;i<porridge_arry.length;i++){
      if(porridge_arry[i].id==foodItem.id){
      //   porridge_arry[i].dishes_status=3;
      //   porridge_arry[i].item_type=1;
      //   porridge_arry[i].cancel_number=that.data.nm;
      //   porridge_arry[i].operator=app.globalData.loginname;

      //  vaildTotal=Number(Number(that.data.vaildTotal)-(Number(porridge_arry[i].item_subtotal))).toFixed(2)
      porridge_arry[i].cancel_apply = 1
      }
    }
  }
  if(foodItem.spec_type==10){
    // 多规格多做法
    for(var i=0;i<eatAndSpec_arry.length;i++){
      if(eatAndSpec_arry[i].id==foodItem.id){
      //   eatAndSpec_arry[i].dishes_status=3;
      //   eatAndSpec_arry[i].item_type=1;
      //   eatAndSpec_arry[i].cancel_number=that.data.nm;
      //   eatAndSpec_arry[i].operator=app.globalData.loginname;

      //  vaildTotal=Number(Number(that.data.vaildTotal)-(Number(eatAndSpec_arry[i].item_subtotal))).toFixed(2)
      eatAndSpec_arry[i].cancel_apply = 1
      }
    }
  }
  if(foodItem.spec_type==2){
    // 多计量多做法
    for(var i=0;i<weight_arry.length;i++){
      if(weight_arry[i].id==foodItem.id){
      //   weight_arry[i].dishes_status=3;
      //   weight_arry[i].item_type=1;
      //   weight_arry[i].cancel_number=that.data.nm;
      //   weight_arry[i].operator=app.globalData.loginname;

      //  vaildTotal=Number(Number(that.data.vaildTotal)-(Number(weight_arry[i].item_subtotal))).toFixed(2)
      weight_arry[i].cancel_apply = 1
      }
    }
  }
      
      that.setData({single,temporary,processing_arry,many,weight_arry,porridge_arry,eatAndSpec_arry});

  },
  // 取消菜品弹框 的确认按钮
  cancelConfirm: function (e) {
    var that = this
    //取消菜品
    var godata
    var foodItem = that.data.cancelFoodItem
    var cancelPrice = 0
    var shuzu = this.data.ListOfCancellation
    var shuzu1 = []
    for (var i = 0; i < shuzu.length; i++) {
      if (shuzu[i].checked) {
        shuzu1[i] = shuzu[i]
      }
    }
    if (this.data.qitayuanyin && that.data.cancelRemark == '') {
      wx.showToast({
        title: '其他理由不能为空',
        icon: 'none',
        duration: 2000,
      })
    } else if (shuzu1.length == 0 && !this.data.qitayuanyin) {
      wx.showToast({
        title: '请选择取消理由',
        icon: 'none',
        duration: 2000,
      })
    } else {
      var dishes_num
      var nm = this.data.nm //要取消的份数
      if (nm <= foodItem.initial_number) {
        if (foodItem.spec_id == 1 || foodItem.spec_id == 5) {
          dishes_num = 1
        } else {
          dishes_num = Number(nm)
        }
      } else {
        wx.showToast({
          title: '取消份数不能大于原有份数',
          icon: 'none',
          duration: 2000,
        })
        return;
      }
      that.toCancelOrderDetails(foodItem,nm);
   
    }
   this.redress()
  },

  // 取消菜品弹框 的取消按钮
  cancelCancel: function (e) {
    this.setData({
      showCancel: false,
      cancelFoodItem: '',
      cancelRemark: '',
      cancellation: '操作失误',
    })
  },

  // 赠送弹框 的确认按钮
  freeDishConfirm: function (e) {
    var that = this
    var godata
    var foodItem = that.data.freeFoodItem
    var shuzu = this.data.ListOfPresentation
    var shuzu1 = []
    for (var i = 0; i < shuzu.length; i++) {
      if (shuzu[i].checked) {
        shuzu1[i] = shuzu[i]
      }
    }

    if (this.data.qitayuanyin1 && that.data.freeDishRemark == '') {
      wx.showToast({
        title: '其他理由不能为空',
        icon: 'none',
        duration: 2000,
      })
    } else if (shuzu1.length == 0 && !this.data.qitayuanyin1) {
      wx.showToast({
        title: '请选择赠送理由',
        icon: 'none',
        duration: 2000,
      })
    } else {
      //确认赠送赠送
      // spec_type 规格类型：单规格-0，多规格-1，称重多做法-2，计件多做法-3,称重单规格-5，单规格多做法-4，称重多规格-6
      //2020-11-18 下单前赠送
      if (that.data.detailsType == 1) {
        //下单前操作
        that.data.cart_item.item_type = 5;//点餐类别：加餐id、点餐-0、退餐--1 赠送-5
        that.data.cartList[that.data.cart_item.cartList_index].item_type = 5;
        wx.showToast({
          title: '赠送菜品成功',
          icon: 'success',
          duration: 2000,
          success: function (res) {
            that.setData({
              showPresentation: false
            })
          }
        })
      } else {
        wx.request({
          url: app.globalData.UpdateOrderDetailed_url,
          data: {
            id: foodItem.id,
            Order_id: foodItem.order_id,
            Shop_id: that.data.shop_id,
            Item_subtotal: 0,
            operator: app.globalData.loginname, //operator
            Item_type: 5, //点餐类别：加餐id、点餐-0、退餐--1 赠送-5
          },
          success: function (res) {
            if (res.data.result.result == 1) {
              that.recordConfirmationInf(1, "赠送菜品", foodItem)
              wx.showToast({
                title: '赠送菜品成功',
                icon: 'success',
                duration: 2000,
                success: function (res) {
                  that.setData({
                    showPresentation: false,
                    needToReconfirmOffer: true,
                    freeFoodItem: [],
                    freeDishRemark: ''
                  })
                  that.redress() //矫正金额和获取订单
                }
              })
              //赠送成功
            } else {
              //赠送失败
            }
          },
          fail: function (res) {
            //赠送失败
          }
        })
      }
    }
  },
  // 赠送弹框 的取消按钮
  freeDishCancel: function (e) {
    this.setData({
      showPresentation: false,
      cancelFoodItem: '',
      cancelRemark: '',
      presentation: '主动赠送'
    })
  },
  // 赠送弹框 的备注
  freeDishRemark: function (e) {
    //记录赠送理由
    var that = this
    // that.timed_refresh(1)
    that.setData({
      freeDishRemark: e.detail.value
    })
  },

  cancelRemark: function (e) {
    //记录取消理由
    var that = this
    // that.timed_refresh(1)
    that.setData({
      cancelRemark: e.detail.value
    })
  },
  // 直接点餐取消菜品
  cancelDishesDirect: function (e) {
    var that = this;
    let foodItem = e.currentTarget.dataset.detailitem
    var ListOfCancellation = this.data.ListOfCancellation
    that.setData({nm:1})
    if (that.data.order_status_end.indexOf(that.data.thisorderarry.order_status) == -1) {
      for (var i = 0; i < ListOfCancellation.length; i++) {
        ListOfCancellation[i].checked = false
      }
      that.setData({
        qitayuanyin: false,
        ListOfCancellation: ListOfCancellation,
        showCancel: true,
        needToReconfirmOffer: true,
        cancelFoodItem: foodItem,
        cancelRemark: ''
      })
    } else {
      time.show_NOCANCEL_Model("订单已完成,取消菜品失败")
    }
    // that.timed_refresh(1)
  },
  shopTypeBindsubmit(e) { //店铺类型模态框的x操作
    var that = this;
    that.data.setmingcheng = e.detail.value.shopTypeGroup
    that.setData({
      setmingcheng: e.detail.value.shopTypeGroup,
      hiddenview: false,
    })
  },
  exittips(e) { //店铺类型模态框的x操作
    var that = this;
    app.globalData.hiddenvieww = false
    that.setData({
      hiddenvieww: app.globalData.hiddenvieww,
    })
  },
  exitTableBindtap(e) { //店铺类型模态框的x操作
    var that = this;
    that.setData({
      hiddenview: false,
    })
  },
  shopTypeBindtap(e) { //点击店铺类型框
    var that = this;
    that.ingredients()
    that.setData({
      hiddenview: true,
    })
  },
  //预览照片
  photo: function (e) {
    var arry = []
    var dishes_id = e.currentTarget.dataset.dishesid
    var img = ''
    app.globalData.menuListItem.map(function (food) {
      if (food.dishes_id == dishes_id) {
        img = food.big_dishes_img
      }
    })
    arry.push(img)
    wx.previewImage({
      urls: arry,
      success: function (res) { }
    })
  },
  // 添加临时菜品食材
  addshicai: function (e) {
    var that = this;
    // that.timed_refresh(1)
    if (that.data.setmingcheng != 'undefined' &&
      that.data.setfenliang != 'undefined' &&
      that.data.setfenliang != null &&
      that.data.setfenliang != '' &&
      that.data.setmingcheng != '' &&
      that.data.setmingcheng != null) {
      if (that.data.setfenliang) { //这是用正则表达是检查
        that.data.wanggouarray.push({ //录入的数据保存到列表数组中
          hailnum: that.data.setfenliang,
          hailname: that.data.setmingcheng
        });

        var wanggouarray = that.data.wanggouarray
        var dest = [],
          map = {}
        for (var i = 0; i < wanggouarray.length; i++) {
          var temp = wanggouarray[i];
          if (!map[temp.hailname]) {
            dest.push({
              hailnum: temp.hailnum,
              hailname: temp.hailname
            });
            map[temp.hailname] = temp
          } else {
            for (var j = 0; j < dest.length; j++) {
              var dj = dest[j];
              if (dj.hailname == temp.hailname) {
                dj.hailnum = (parseFloat(dj.hailnum) + parseFloat(temp.hailnum)).toString();
                break;
              }
            }
          };
        }
        that.setData({
          wanggouarray: dest,
          setmingcheng: '',
          setfenliang: '',
        });
      } else {
        wx.showToast({
          title: "份量填写错误",
          icon: 'none',
          duration: 1500,
        })
      }
    } else {
      wx.showToast({
        title: "信息不能为空",
        icon: 'none',
        duration: 1500,
      })
    }
  },
  //删除食材
  deleteshicai: function (e) {
    var that = this;
    // that.timed_refresh(1)
    var wanggouarray = that.data.wanggouarray
    var shicaiindex = that.data.shicaiindex

    if (wanggouarray.length == 1 && shicaiindex == 0) {
      that.setData({
        wanggouarray: [],
        setmingcheng: '',
        setfenliang: '',
        shicaiindex: null,
      });
    } else if (shicaiindex != undefined && shicaiindex != null) {
      if (shicaiindex == 0) {
        if (wanggouarray.length != 1) {
          for (var x = 1; x <= wanggouarray.length; x++) {
            wanggouarray[x - 1] = wanggouarray[x]
          }
          wanggouarray.pop();
        }
      } else {
        wanggouarray.splice(shicaiindex, 1)
      }
      that.setData({
        wanggouarray: wanggouarray,
        setmingcheng: '',
        setfenliang: '',
      });
    }
  },
  // 临时菜品，选中食材
  chooseshicai: function (e) {
    var that = this;
    // that.timed_refresh(1)
    that.setData({
      listIndex: e.currentTarget.dataset.index,
      setmingcheng: e.currentTarget.dataset.hailname,
      setfenliang: e.currentTarget.dataset.hailnum,
      shicaiindex: e.currentTarget.dataset.index,
    });
  },
  numberInput: function (e) {
    var that = this
    // that.timed_refresh(1)
    that.setData({
      tempNumber: e.detail.value
    })
    that.statistics()
  },
  priceInput: function (e) {
    var that = this
    // that.timed_refresh(1)
    that.setData({
      tempPrice: e.detail.value
    })
    that.statistics()
  },
  unitInput: function (e) {
    var that = this
    // that.timed_refresh(1)
    that.setData({
      tempUnit: e.detail.value
    })
    that.statistics()
  },

  statistics: function () {
    var that = this
    // that.timed_refresh(1)
    if (that.data.tempNumber != null &&
      that.data.tempPrice != null &&
      that.data.tempNumber != '' &&
      that.data.tempPrice != '') {
      var tempNumber = that.data.tempNumber
      var tempPrice = that.data.tempPrice

      tempNumber = parseInt(tempNumber);
      tempPrice = parseFloat(tempPrice).toFixed(2);

      that.setData({
        tempSum: tempNumber * tempPrice
      })
    } else {
      that.setData({
        tempSum: 0
      })
    }
  },
  // 设置份量
  setfenliang: function (e) {
    var that = this;
    // that.timed_refresh(1)
    that.setData({
      setfenliang: e.detail.value
    })
  },
  // 是否开发票checkbox
  changeradio: function (e) {
    var that = this;
    // that.timed_refresh(1)
    that.setData({
      index: e.currentTarget.dataset.index
    })
  },
  //获得房名或大厅名
  getfieldname: function () {
    var field = app.globalData.field
    for (var i = 0; i < field.length; i++) {
      for (var j = 0; j < field[i].tableManage.length; j++) {
        if (field[i].tableManage[j].table_id == that.data.table_id) {
          that.setData({
            fieldname: field[i].field_name
          })
        }
      }
    }
  },

  //将备注存入全局变量
  addremarks: function (e) {
    this.setData({
      dishes_remark: e.detail.value
    })
  },
  remark: function (e) {
    wx.request({
      url: app.globalData.UpdateOrderDetailed_url,
      data: {
        id: newarry[i].id,
        Shop_id: app.globalData.shopdetail.shop_id,
        Order_id: that.data.orderid,
        dishes_remark: e.currentTarget.dataset.value
      },
      success: function (res) {
        if (res.data.result.result == 1) {
          //修改成功
        } else {
          //修改失败
        }
      },
      fail: function (res) {
        //请求失败
      }
    })
  },
  // 寄存菜品 
  addConsignOrder: function (detail_id, dishes_id, dishesNum, bidDetailitem) {
    if (dishes_id != '' && dishesNum != '') {
      var that = this
      var bidDetailitem = bidDetailitem
      wx.request({
        url: app.globalData.AddConsignOrder_url,
        data: {
          user_id: that.data.thisorderarry.user_id,
          dishes_id: dishes_id,
          dishesNum: dishesNum,
          oldOrderInfId: that.data.thisorderarry.order_id,
          consignStatus: 1,
          storepersonnalId: app.globalData.staffDetail.id,
          initialDishesNum: dishesNum,
          userPhone: 18024164915
        },
        success: function (res) {
          if (res.data.result.result == 1) {
            wx.request({
              url: app.globalData.UpdateOrderDetailed_url,
              data: {
                id: detail_id,
                Shop_id: app.globalData.shopdetail.shop_id,
                Order_id: that.data.orderid,
                depositOrder: dishesNum
              },
              success: function (res) {
                if (res.data.result.result == 1) {
                  //寄存成功
                  that.recordConfirmationInf(3, '寄存菜品保存', bidDetailitem)
                } else {
                  //寄存失败
                }
              },
              fail: function (res) {
                //寄存失败
              }
            })
          } else {
            //寄存失败
          }
        },
        fail: function (res) {
          //请求失败
        }
      })
    }
  },
  showAllConfirmPrint: function (e) {
    //显示全单部张确认的时候，弹出需要打印的
    var that = this;
    that.setData({
      showAllConfirmPrintView: true,
      allConfirmInf: e
    })
  },
  printAllConfirm: function () {
    var that = this
    var e = that.data.allConfirmInf //拿回存着的数据
    let order_choose_printer = ''
    if (that.data.printArray.length > 0) {
      if (that.data.printIndex > -1)
        order_choose_printer = that.data.printArray[that.data.printIndex].printer_id
    }
    wx.request({
      // url: app.globalData.UpdateOrderInf_url,
            url: app.globalData.UpdateOrderInfNew_url,
            // url:'http://localhost:8080/WX Restaurant/UpdateOrderInfForAllNew',
      data: {
        Order_id: that.data.orderid,
        Shop_id: that.data.shop_id,
        preorder_starus: 1,
        operator: app.globalData.loginname,
        operatorchecked: 1,
        Order_status: '等待买单',
        order_choose_printer: order_choose_printer
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      success: function (res_detail) {
        if (res_detail.data.result.result == 1) {
          that.recordConfirmationInf(0, "等待买单", null)
          that.discount_checked_minister();
          if (that.data.thisorderarry.help_order != 2) { // 主动下单不需要确认人数
            that.sureUserCount(e) //确认用餐人数
          }
          that.useOffer(e) //优惠信息部长确认确认
          wx.showToast({
            title: '全单确认成功!',
            icon: 'success',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '全单确认失败，请重新确认!',
            icon: 'fail',
            duration: 2000
          })
        }
      },
      complete: function () {
        that.redress() // 刷新
        that.closePrint2()// 关闭弹窗
      }
    })
  },

  printAllPayOrder: function (e) {
    //是否打印结账总单
    let that = this
    let type = e.currentTarget.dataset.type
    //先改显示
    that.setData({
      printAllPayOrderSigns: type
    })
    if (type == 0) {
      //选的是：‘是’
    }
  },

  // 新订单全单 部长确认确认
  allConfirm: function (e) { // 有个问题，多种做法的重量不能在取中位数了，而且全单确认不应该再修改金额
    var that = this
    // that.timed_refresh(1) //刷新
    that.selectUncheckedNumber(that.data.orderid)
    var thisorderarry = this.data.thisorderarry
    thisorderarry.preorder_starus = 1
    that.setData({
      thisorderarry: thisorderarry
    })

    let unChecked = 0
    var object = {
      "order_ids": that.data.orderid,
      "level": app.globalData.level,
    }
    wx.request({
      url: app.globalData.selectUnCheckCountByOrderID_url,
      data: JSON.stringify(object),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data != null) {
          var infList = res.data
          unChecked = res.data[0].unconfirmedNumber
          that.setData({
            unCheck: unChecked
          });
          //2020-11-25 需求更改，部长不能全单确认
          if (unChecked != 0) {
            var content = '还有' + unChecked + '项未经确认';
            time.show_NOCANCEL_Model(content);
          } else {
            //2021、1、11暂时注释掉上面的代码，因为上面的代码判断貌似在接口已经完成返回了
            that.showAllConfirmPrint(e)
          }
        }
      },
      complete: function () {
        return unChecked
      }
    })
  },
  // 是否确认反馈
  isFeedback: function (e) {
    let that = this
    // that.timed_refresh(1)
    let feedback = that.data.feedback

    if (feedback.length != 0) {
      wx.showModal({
        // title: ' ',
        content: '是否确认反馈',
        showCancel: true, //是否显示取消按钮
        confirmText: "是", //默认是“确定”
        cancelText: "否", //默认是“取消”
        cancelColor: '#519763', //取消文字的颜色
        confirmColor: '#519763', //确定文字的颜色
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.UpdateOrderInf_url,
              data: {
                Order_id: that.data.orderid,
                Shop_id: that.data.shop_id,
                parameter2: that.data.feedback,

              },
              header: {
                'content-type': 'application/x-www-form-urlencoded;'
              },
              method: 'POST',
              success: function (res) {
                if (res.data.result.result == 1) {
                  //反馈成功
                  that.recordConfirmationInf(2, that.data.feedback, null)
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000,
                    success: function (res) {
                      that.redress() // 矫正金额和刷新
                    }
                  })
                } else {
                  //反馈失败
                }
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: "反馈不能为空"
      })
    }
  },
  // 是否确认备注
  isOrderRemark: function (e) {
    let that = this
    // that.timed_refresh(1)
    let orderRemark = that.data.Order_remark

    if (orderRemark.length != 0) {
      wx.showModal({
        content: '是否确认备注',
        showCancel: true, //是否显示取消按钮
        confirmText: "是", //默认是“确定”
        cancelText: "否", //默认是“取消”
        cancelColor: '#519763', //取消文字的颜色
        confirmColor: '#519763', //确定文字的颜色
        success: function (res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.UpdateOrderInf_url,
              data: {
                Order_id: that.data.orderid,
                Shop_id: that.data.shop_id,
                order_remark: orderRemark
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded;'
              },
              method: 'POST',
              success: function (res) {
                if (res.data.result.result == 1) {
                  //备注成功
                  wx.showToast({
                    title: '成功',
                    icon: 'success',
                    duration: 2000,
                    success: function (res) {
                      that.redress() // 矫正金额和刷新
                    }
                  })
                } else {
                  //反馈失败
                }
              }
            })
          }
        }
      })
    } else {
      wx.showModal({
        title: "反馈不能为空"
      })
    }
  },
  feedbackInput: function (e) {
    let that = this;
    that.setData({
      feedback: e.detail.value,
    })
    // that.timed_refresh(1)
  },
  // 称重菜品详情页面输入重量
  measurementValueInput: function (e) {
    this.setData({
      confirmweighing: e.detail.value
    })
    this.showGuigeMoneyAndNumber(1)
  },

  // 称重菜品详情页面输入重量
  measurementValueInput1: function (e) {
    var eatMethodArray = this.data.eatMethodArray
    if (this.data.dishesitem.isWhole) {
      for (var x = 0; x < eatMethodArray.length; x++) {
        eatMethodArray[x].number = e.detail.value
        eatMethodArray[x].money = Number(e.detail.value) * eatMethodArray[x].price
      }
      this.setData({
        eatMethodArray: eatMethodArray,
        confirmweighing: e.detail.value
      })
      this.showGuigeMoneyAndNumber(1)
    } else {
      this.setData({
        confirmweighing: e.detail.value
      })
    }
  },
  // 新确认确定菜品 服务员或者部长确认,其中包括多种做法和单一/多规格的操作，因为多种做法改了，所以确认菜品的操作也要改
  // 菜品的确认不在修改状态 Dishes_status 了，避免确认状态和修改状态的冲突
  // 输入重量之后不再直接写入数据库，需要部长确认值之后才写进数据库
  // 加入称重多做法的确认，因为称重多做法称重区间有点不一样，所以会去除称重区域的判断
  surecaipin_new: function (e) {
    var that = this;
    // 菜品的详情
    var detailItem = e.currentTarget.dataset.detailitem
    var index = e.currentTarget.dataset.index
    var weight // 称重菜品的重量
    var number // 计件菜品的数量量
    var godata
    // that.timed_refresh(1)
    wx.showLoading({
      title: '正在确认',
    })
    if (detailItem.spec_id == 1) { // 多种做法菜品
      let type // 区分称重和计件
      if (detailItem.measurement_value != '' && detailItem.measurement_value != 0) {
        weight = detailItem.measurement_value
      } else {
        weight = that.data.cinput[index]
      }
      number = that.data.ninput[index]
      type = detailItem.spec_type
      // 称重-2，计件-3
      if (type == 2 || type == 5) { //称重单规格和称重多做法
        //称重菜品
        var other = 0 // 加收的钱
        var original = 0 // 材料的钱 
        var subtotal = 0 // 小计
        var sideDisht_add = 0 // 配菜的钱
        if (detailItem.sideDisht != "") {
          for (var x of JSON.parse(detailItem.sideDisht)) {
            if (Number(x.orderDetailedNum) >= 0) {
              sideDisht_add += (x.orderDetailedNum * x.sideDishdPrice * 0.01)
            }
          }
        }
        if (that.data.isScales) { // 当有电子秤的情况下,应该由电子秤称重写入measurement_value值
          //  称重之后
          if (detailItem.measurement_value != null && detailItem.measurement_value != '' && detailItem.measurement_value != undefined) {
            other = 0 //加收重置
            var em_id = JSON.parse(detailItem.em_id)
            for (var x of em_id) {
              other += x.money
            }
            original = detailItem.measurement_value * detailItem.item_price

            if (detailItem.item_type == 3 && detailItem.operatorchecked == 1) { //已经修改的情况下
              if (detailItem.u_measurement_value != null && detailItem.u_measurement_value != '' && detailItem.u_measurement_value != undefined) {
                original = detailItem.u_measurement_value * detailItem.item_price
              }
              if (detailItem.u_em_id != null && detailItem.u_em_id != '' && detailItem.u_em_id != undefined && detailItem.u_em_id != "0") {
                var u_em_id = JSON.parse(detailItem.u_em_id)
                other = 0
                for (var x of u_em_id) {
                  other += x.money
                }
              }
              if (other == undefined || other == '' || other == null || other == NaN) {
                other = 0
                subtotal = Number(original) + Number(sideDisht_add)
              } else {
                subtotal = Number(original) + Number(other) + Number(sideDisht_add)
              }
              //第一种称重确认
              godata = {
                id: detailItem.id, //详单 id
                Order_id: detailItem.order_id, //订单 id
                Shop_id: that.data.shop_id, //店铺 id 
                operator: app.globalData.loginname,
                u_item_subtotal: subtotal,
                operatorchecked: 1,
                userchecked: 1,
              }
            } else {
              if (other == undefined || other == '' || other == null || other == NaN) {
                other = 0
                subtotal = Number(original) + Number(sideDisht_add)
              } else {
                subtotal = Number(original) + Number(other) + Number(sideDisht_add)
              }
              //第二种称重确认
              godata = {
                id: detailItem.id, //详单 id
                Order_id: detailItem.order_id, //订单 id
                Shop_id: that.data.shop_id, //店铺 id 
                operator: app.globalData.loginname,
                Item_subtotal: subtotal,
                operatorchecked: 1,
                userchecked: 1,
              }
            }
          } else {
            wx.showToast({
              title: '称重不能为空', //提示文字
              duration: 3000, //显示时长
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
              icon: 'none', //图标，支持"success"、"loading"  
              success: function () {
                return
              }, //接口调用成功
            })
          }
        } else {
          // 在没有电子称的情况下，输入的值在确认之后
          // 输入值不能为空
          if (weight != null && weight != '' && weight != undefined) {
            // 当菜品同意修改之后,区间就会变为修改之后的区间范围 ，这里是为了避免出单之后，客户在输入重量之前就申请修改重量
            // 重写，分为两种，一种同意修改，另外一种是常规，不能修改和不能取消状态 不影响这个
            var original = detailItem.item_price * parseFloat(weight.fore) //菜品材料的钱，因为还未确认，所以采用输入值
            if (detailItem.em_id != "0" && detailItem.em_id != 0 && detailItem.em_id != '' && detailItem.u_em_id != undefined && detailItem.em_id != "[0]") { //吃法为零不加收
              var em_id = JSON.parse(detailItem.em_id)
              other = 0 //加收重置
              for (var x of em_id) {
                other += x.money
              }
            }
            if (other == undefined || other == '' || other == null || other == NaN) {
              other = 0
              subtotal = Number(original) + Number(sideDisht_add)
            } else {
              subtotal = Number(original) + Number(other) + Number(sideDisht_add)
            }
            // 同意修改的情况
            if (detailItem.item_type == 3 || detailItem.dishes_status == 11) {
              // 当修改了做法的情况下的加收
              if (detailItem.u_em_id != null && detailItem.u_em_id != '' && detailItem.u_em_id != undefined) {
                var u_em_id = JSON.parse(detailItem.u_em_id)
                other = 0 //加收重置
                for (var x of u_em_id) {
                  other += x.money
                }
              }
              // 当修改了重量的情况下的的输入后的数量
              if (weight.after != null && weight.after != '' && weight.after != undefined) {
                var qujian = detailItem.u_item_number
                var min = parseFloat(qujian.split(',')[0])
                var max = parseFloat(qujian.split(',')[1])

                if (parseFloat(weight.after) < min || parseFloat(weight.after) > max) {
                  //修改后重量输入错误
                  time.show_NOCANCEL_Model("输入重量不在预订重量范围之中");
                  return
                } else {
                  original = parseFloat(weight.after) * detailItem.item_price
                  if (other == undefined || other == '' || other == null || other == NaN) {
                    other = 0
                    subtotal = Number(original) + Number(sideDisht_add)
                  } else {
                    subtotal = Number(original) + Number(other) + Number(sideDisht_add)
                  }
                  //第三种称重确认
                  godata = {
                    id: detailItem.id, //详单 id
                    Order_id: detailItem.order_id, //订单 id
                    Shop_id: that.data.shop_id, //店铺 id 
                    operatorchecked: 1,
                    userchecked: 1,
                    operator: app.globalData.loginname,
                    u_item_subtotal: subtotal,
                    u_measurement_value: parseFloat(weight.after)
                  }
                }
              } else {
                //第四种称重确认
                if (other == undefined || other == '' || other == null || other == NaN) {
                  other = 0
                  subtotal = Number(original) + Number(sideDisht_add)
                } else {
                  subtotal = Number(original) + Number(other) + Number(sideDisht_add)
                }
                godata = {
                  id: detailItem.id, //详单 id
                  Order_id: detailItem.order_id, //订单 id
                  Shop_id: that.data.shop_id, //店铺 id 
                  operatorchecked: 1,
                  userchecked: 1,
                  operator: app.globalData.loginname,
                  u_item_subtotal: subtotal,
                }
              }
              //------------------------------------------------------------------------------------------------
            } else { // 一般的情况下,当输入值不能为空的情况下
              if (weight != null && weight != '' && weight != undefined) {
                var qujian = detailItem.item_number
                var min = parseFloat(qujian.split(',')[0])
                var max = parseFloat(qujian.split(',')[1])

                if (parseFloat(weight.fore) == 0) { // 当输入0 重量时
                  wx.showToast({
                    title: '重量不能为零', //提示文字
                    duration: 3000, //显示时长
                    mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
                    icon: 'none', //图标，支持"success"、"loading"  
                    success: function () {
                      wx.hideLoading()
                      return
                    }, //接口调用成功
                  })
                } else { //当不为零的情况下
                  if (parseFloat(weight.fore) < min || parseFloat(weight.fore) > max) {
                    //重量输入错误
                    time.show_NOCANCEL_Model("输入重量不在预订重量范围之中");
                    wx.hideLoading()
                    return
                  } else {
                    //第五种称重确认 重量正确
                    if (that.data.thisorderarry.help_order == 2) {
                      godata = {
                        id: detailItem.id, //详单 id
                        Order_id: detailItem.order_id, //订单 id
                        Shop_id: that.data.shop_id, //店铺 id 
                        operator: app.globalData.loginname,
                        userchecked: 1,
                        operatorchecked: 1,
                        // Item_subtotal: subtotal,
                        // Measurement_value: parseFloat(weight.fore)
                      }
                    } else {
                      godata = {
                        id: detailItem.id, //详单 id
                        Order_id: detailItem.order_id, //订单 id
                        Shop_id: that.data.shop_id, //店铺 id 
                        operator: app.globalData.loginname,
                        userchecked: 1,
                        operatorchecked: 1,
                        Item_subtotal: subtotal,
                        Measurement_value: parseFloat(weight.fore)
                      }
                    }
                  }
                }
              }
            }
          } else {
            wx.showToast({
              title: '重量不能为空', //提示文字
              duration: 3000, //显示时长
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
              icon: 'none', //图标，支持"success"、"loading"  
              success: function () {
                return
              }, //接口调用成功
            })
          }
        }

      } else if (type == 3) {
        //计件菜品
        var other = 0 // 加收的钱
        var original = 0 // 材料的钱 
        var subtotal = 0 // 小计
        var sideDisht_add = 0 // 配菜的钱

        if (detailItem.sideDisht != "") {
          for (var x of JSON.parse(detailItem.sideDisht)) {
            if (Number(x.orderDetailedNum) >= 0) {
              sideDisht_add += (x.orderDetailedNum * x.sideDishdPrice * 0.01)
            }
          }
        }

        if (detailItem.measurement_value != '' && detailItem.measurement_value != null && that.data.thisorderarry.help_order == 2) {
          var original = detailItem.item_price * Number(detailItem.measurement_value) //菜品材料的钱，因为还未确认，所以采用输入值
          if (detailItem.em_id != "0" && detailItem.em_id != 0 && detailItem.em_id != '' && detailItem.u_em_id != undefined && detailItem.em_id != "[0]") { //吃法为零不加收
            var em_id = JSON.parse(detailItem.em_id)
            other = 0 //加收重置
            for (var x of em_id) {
              other += x.money
            }
          }
          if (other == undefined || other == '' || other == null || other == NaN) {
            other = 0
            subtotal = Number(original) + Number(sideDisht_add)
          } else {
            subtotal = Number(original) + Number(other) + Number(sideDisht_add)
          }
          godata = {
            id: detailItem.id, //详单 id
            Order_id: detailItem.order_id, //订单 id
            Shop_id: that.data.shop_id, //店铺 id 
            operator: app.globalData.loginname,
            userchecked: 1,
            operatorchecked: 1,
            Item_subtotal: subtotal,
          }
        } else {
          if (number != null && number != '' && number != undefined) {
            // 当菜品同意修改之后,区间就会变为修改之后的区间范围 ，这里是为了避免出单之后，客户在输入数量之前就申请修改数量
            // 重写，分为两种，一种同意修改，另外一种是常规，不能修改和不能取消状态 不影响这个
            var original = detailItem.item_price * number.fore //菜品材料的钱，因为还未确认，所以采用输入值
            if (detailItem.em_id != "0" && detailItem.em_id != 0 && detailItem.em_id != '' && detailItem.u_em_id != undefined && detailItem.em_id != "[0]") { //吃法为零不加收
              var em_id = JSON.parse(detailItem.em_id)
              other = 0 //加收重置
              for (var x of em_id) {
                other += x.money
              }
            }
            if (other == undefined || other == '' || other == null || other == NaN) {
              other = 0
              subtotal = Number(original) + Number(sideDisht_add)
            } else {
              subtotal = Number(original) + Number(other) + Number(sideDisht_add)
            }
            // 同意修改的情况
            if (detailItem.item_type == 3 || detailItem.dishes_status == 11) {
              // 当修改了做法的情况下的加收
              if (detailItem.u_em_id != null && detailItem.u_em_id != '' && detailItem.u_em_id != undefined && detailItem.u_em_id != "0" && detailItem.u_em_id != 0) {
                var u_em_id = JSON.parse(detailItem.u_em_id)
                other = 0 //加收重置
                for (var x of u_em_id) {
                  other += x.money
                }
              }
              // 当修改了数量的情况下的的输入后的数量
              if (number.after != null && number.after != '' && number.after != undefined) {
                var qujian = detailItem.u_item_number
                var min = parseFloat(qujian.split(',')[0])
                var max = parseFloat(qujian.split(',')[1])

                if (number.after > max) {
                  //修改后数量输入错误
                  time.show_NOCANCEL_Model("输入数量不能超过预订数量");
                  return
                } else {
                  original = number.after * detailItem.item_price
                  other = number.after * other
                  if (other == undefined || other == '' || other == null || other == NaN) {
                    other = 0
                    subtotal = Number(original) + Number(sideDisht_add)
                  } else {
                    subtotal = Number(original) + Number(other) + Number(sideDisht_add)
                  }
                  //同意修改的情况下，加收乘于修改后的份数 第六种称重确认
                  godata = {
                    id: detailItem.id, //详单 id
                    Order_id: detailItem.order_id, //订单 id
                    Shop_id: that.data.shop_id, //店铺 id 
                    operatorchecked: 1,
                    userchecked: 1,
                    operator: app.globalData.loginname,
                    u_item_subtotal: subtotal,
                    u_measurement_value: number.after
                  }
                }
              } else {
                //同意修改的情况下，修改之后的加收乘于原本份数:" + other 第七种称重确认
                if (other == undefined || other == '' || other == null || other == NaN) {
                  other = 0
                  subtotal = Number(original) + Number(sideDisht_add)
                } else {
                  other = number.fore * other
                  subtotal = Number(original) + Number(other) + Number(sideDisht_add)
                }
                godata = {
                  id: detailItem.id, //详单 id
                  Order_id: detailItem.order_id, //订单 id
                  Shop_id: that.data.shop_id, //店铺 id 
                  operatorchecked: 1,
                  userchecked: 1,
                  operator: app.globalData.loginname,
                  u_item_subtotal: subtotal,
                }
              }
              //------------------------------------------------------------------------------------------------
            } else { // 一般的情况下,当输入值不能为空的情况下
              if (number != null && number != '' && number != undefined) {
                var qujian = detailItem.item_number
                var min = parseFloat(qujian.split(',')[0])
                var max = parseFloat(qujian.split(',')[1])
                if (number.fore == 0) { // 当输入0 数量时
                  wx.showToast({
                    title: '数量不能为零', //提示文字
                    duration: 3000, //显示时长
                    mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
                    icon: 'none', //图标，支持"success"、"loading"  
                    success: function () {
                      return
                    }, //接口调用成功
                  })
                } else { //当不为零的情况下
                  if (number.fore > max) {
                    //数量输入错误
                    time.show_NOCANCEL_Model("输入数量不能超过预订数量");
                    return
                  } else {
                    //第八种称重确认 一般情况下,正常的加收：" + other 数量正确
                    var original = detailItem.item_price * number.fore //菜品材料的钱，因为还未确认，所以采用输入值
                    if (detailItem.em_id != "0" && detailItem.em_id != 0 && detailItem.em_id != '' && detailItem.u_em_id != undefined && detailItem.em_id != "[0]") { //吃法为零不加收
                      var em_id = JSON.parse(detailItem.em_id)
                      other = 0
                      for (var x of em_id) {
                        other += x.money
                      }
                    }
                    if (other == undefined || other == '' || other == null || other == NaN) {
                      other = 0
                      subtotal = Number(original) + Number(sideDisht_add)
                    } else {
                      other = number.fore * other
                      subtotal = Number(original) + Number(other) + Number(sideDisht_add)
                    }
                    godata = {
                      id: detailItem.id, //详单 id
                      Order_id: detailItem.order_id, //订单 id
                      Shop_id: that.data.shop_id, //店铺 id 
                      operator: app.globalData.loginname,
                      userchecked: 1,
                      operatorchecked: 1,
                      Item_subtotal: subtotal,
                      Measurement_value: number.fore
                    }
                  }
                }
              }
            }
          } else {
            wx.showToast({
              title: '数量不能为空', //提示文字
              duration: 3000, //显示时长
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
              icon: 'none', //图标，支持"success"、"loading"  
              success: function () {
                return
              }, //接口调用成功
            })
          }
        }
      } else if (type == 6) { //称重多规格
        var other = 0 // 加收的钱
        var original = 0 // 材料的钱 
        var subtotal = 0 // 小计
        var sideDisht_add = 0 // 配菜的钱

        if (detailItem.sideDisht != "") {
          for (var x of JSON.parse(detailItem.sideDisht)) {
            if (Number(x.orderDetailedNum) >= 0) {
              sideDisht_add += (x.orderDetailedNum * x.sideDishdPrice * 0.01)
            }
          }
        }
        if (that.data.isScales) { // 当有电子秤的情况下,应该由电子秤称重写入measurement_value值
          //  称重之后

          if (detailItem.measurement_value != null && detailItem.measurement_value != '' && detailItem.measurement_value != undefined) {
            other = 0 //加收重置
            var em_id = JSON.parse(detailItem.em_id)
            for (var x of em_id) {
              other += x.money
            }
            original = detailItem.measurement_value * detailItem.item_price
            if (detailItem.item_type == 3 && detailItem.operatorchecked == 1) { //已经修改的情况下
              if (detailItem.u_measurement_value != null && detailItem.u_measurement_value != '' && detailItem.u_measurement_value != undefined) {
                original = detailItem.u_measurement_value * detailItem.item_price
              }
              if (detailItem.u_em_id != null && detailItem.u_em_id != '' && detailItem.u_em_id != undefined && detailItem.u_em_id != "0") {
                var u_em_id = JSON.parse(detailItem.u_em_id)
                other = 0
                for (var x of u_em_id) {
                  other += x.money
                }
              }

              subtotal = Number(original) + Number(sideDisht_add)
              //第一种称重确认
              godata = {
                id: detailItem.id, //详单 id
                Order_id: detailItem.order_id, //订单 id
                Shop_id: that.data.shop_id, //店铺 id 
                operator: app.globalData.loginname,
                u_item_subtotal: subtotal,
                operatorchecked: 1,
                userchecked: 1,
              }
            } else {
              subtotal = Number(original) + Number(sideDisht_add)
              //第二种称重确认
              godata = {
                id: detailItem.id, //详单 id
                Order_id: detailItem.order_id, //订单 id
                Shop_id: that.data.shop_id, //店铺 id 
                operator: app.globalData.loginname,
                Item_subtotal: subtotal,
                operatorchecked: 1,
                userchecked: 1,
              }
            }
          } else {
            wx.showToast({
              title: '称重不能为空', //提示文字
              duration: 3000, //显示时长
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
              icon: 'none', //图标，支持"success"、"loading"  
              success: function () {
                return
              }, //接口调用成功
            })
          }
        } else {
          // 在没有电子称的情况下，输入的值在确认之后
          // 输入值不能为空
          if (weight != null && weight != '' && weight != undefined) {
            // 当菜品同意修改之后,区间就会变为修改之后的区间范围 ，这里是为了避免出单之后，客户在输入重量之前就申请修改重量
            // 重写，分为两种，一种同意修改，另外一种是常规，不能修改和不能取消状态 不影响这个
            var original = detailItem.item_price * parseFloat(weight.fore) //菜品材料的钱，因为还未确认，所以采用输入值
            if (detailItem.em_id != "0" && detailItem.em_id != 0 && detailItem.em_id != '' && detailItem.u_em_id != undefined && detailItem.em_id != "[0]") { //吃法为零不加收
              var em_id = JSON.parse(detailItem.em_id)
              other = 0 //加收重置
              for (var x of em_id) {
                other += x.money
              }
            }
            subtotal = Number(original) + Number(sideDisht_add)
            // 同意修改的情况
            if (detailItem.item_type == 3 || detailItem.dishes_status == 11) {
              // 当修改了做法的情况下的加收
              if (detailItem.u_em_id != null && detailItem.u_em_id != '' && detailItem.u_em_id != undefined) {
                var u_em_id = JSON.parse(detailItem.u_em_id)
                other = 0 //加收重置
                for (var x of u_em_id) {
                  other += x.money
                }
              }
              // 当修改了重量的情况下的的输入后的数量, 称重多规格不需要区间
              if (weight.after != null && weight.after != '' && weight.after != undefined) {
                var qujian = detailItem.u_item_number
                var min = parseFloat(qujian.split(',')[0])
                var max = parseFloat(qujian.split(',')[1])

                if (parseFloat(weight.after) < min || parseFloat(weight.after) > max) {
                  //修改后重量输入错误
                  time.show_NOCANCEL_Model("输入重量不在误差重量范围之中");
                  return
                } else {
                  original = parseFloat(weight.after) * detailItem.item_price
                  subtotal = Number(original) + Number(sideDisht_add)
                  //第三种称重确认
                  godata = {
                    id: detailItem.id, //详单 id
                    Order_id: detailItem.order_id, //订单 id
                    Shop_id: that.data.shop_id, //店铺 id 
                    operatorchecked: 1,
                    userchecked: 1,
                    operator: app.globalData.loginname,
                    u_item_subtotal: subtotal,
                    u_measurement_value: parseFloat(weight.after)
                  }
                }
              } else {
                //第四种称重确认
                subtotal = Number(original) + Number(sideDisht_add)
                godata = {
                  id: detailItem.id, //详单 id
                  Order_id: detailItem.order_id, //订单 id
                  Shop_id: that.data.shop_id, //店铺 id 
                  operatorchecked: 1,
                  userchecked: 1,
                  operator: app.globalData.loginname,
                  u_item_subtotal: subtotal,
                }
              }
              //------------------------------------------------------------------------------------------------
            } else { // 一般的情况下,当输入值不能为空的情况下
              if (weight != null && weight != '' && weight != undefined) {
                var qujian = detailItem.item_number
                var min = parseFloat(qujian.split(',')[0])
                var max = parseFloat(qujian.split(',')[1])
                if (parseFloat(weight.fore) == 0) { // 当输入0 重量时
                  wx.showToast({
                    title: '重量不能为零', //提示文字
                    duration: 3000, //显示时长
                    mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
                    icon: 'none', //图标，支持"success"、"loading"  
                    success: function () {
                      wx.hideLoading()
                      return
                    }, //接口调用成功
                  })
                } else { //当不为零的情况下
                  if (parseFloat(weight.fore) < min || parseFloat(weight.fore) > max) {
                    //重量输入错误
                    time.show_NOCANCEL_Model("输入重量不在误差重量范围之中");
                    wx.hideLoading()
                    return
                  } else {
                    //第五种称重确认 重量正确
                    godata = {
                      id: detailItem.id, //详单 id
                      Order_id: detailItem.order_id, //订单 id
                      Shop_id: that.data.shop_id, //店铺 id 
                      operator: app.globalData.loginname,
                      userchecked: 1,
                      operatorchecked: 1,
                      Item_subtotal: subtotal,
                      Measurement_value: parseFloat(weight.fore)
                    }
                  }
                }
              }
            }
          } else {
            wx.showToast({
              title: '重量不能为空', //提示文字
              duration: 3000, //显示时长
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
              icon: 'none', //图标，支持"success"、"loading"  
              success: function () {
                return
              }, //接口调用成功
            })
          }
        }

      } else if (type == 8) {
        // 来料加工的
        var other = 0 // 加收的钱
        var original = 0 // 材料的钱 
        var subtotal = 0 // 小计
        var sideDisht_add = 0 // 配菜的钱

        if (detailItem.sideDisht != "") {
          for (var x of JSON.parse(detailItem.sideDisht)) {
            if (Number(x.orderDetailedNum) >= 0) {
              sideDisht_add += (x.orderDetailedNum * x.sideDishdPrice * 0.01)
            }
          }
        }

        if (number != null && number != '' && number != undefined) {
          // 当菜品同意修改之后,区间就会变为修改之后的区间范围 ，这里是为了避免出单之后，客户在输入数量之前就申请修改数量
          // 重写，分为两种，一种同意修改，另外一种是常规，不能修改和不能取消状态 不影响这个
          var original = 0

          if (detailItem.em_id != "0" && detailItem.em_id != 0 && detailItem.em_id != '' && detailItem.u_em_id != undefined && detailItem.em_id != "[0]") { //吃法为零不加收
            var em_id = JSON.parse(detailItem.em_id)
            other = 0 //加收重置
            for (var x of em_id) {
              other += x.money
            }
          }
          if (other == undefined || other == '' || other == null || other == NaN) {
            other = 0
            original = 0
            subtotal = Number(original) + Number(sideDisht_add)
          } else {
            original = other * Number(number.fore)
            subtotal = Number(original) + Number(sideDisht_add)
          }
          // 同意修改的情况
          if (detailItem.item_type == 3 || detailItem.dishes_status == 11) {
            // 当修改了做法的情况下的加收
            if (detailItem.u_em_id != null && detailItem.u_em_id != '' && detailItem.u_em_id != undefined && detailItem.u_em_id != "0" && detailItem.u_em_id != 0) {
              var u_em_id = JSON.parse(detailItem.u_em_id)
              other = 0 //加收重置
              for (var x of u_em_id) {
                other += x.money
              }
            }
            // 当修改了数量的情况下的的输入后的数量
            if (number.after != null && number.after != '' && number.after != undefined) {
              var qujian = detailItem.u_item_number
              var min = parseFloat(qujian.split(',')[0])
              var max = parseFloat(qujian.split(',')[1])
              if (number.after > max) {
                //修改后数量输入错误
                time.show_NOCANCEL_Model("输入数量不能超过预订数量");
                return
              } else {
                if (other == undefined || other == '' || other == null || other == NaN) {
                  other = 0
                  original = 0
                  subtotal = Number(original) + Number(sideDisht_add)
                } else {
                  original = number.after * other
                  subtotal = Number(original) + Number(sideDisht_add)
                }
                //同意修改的情况下，加收乘于修改后的份数:" + other 第六种来料加工确认
                godata = {
                  id: detailItem.id, //详单 id
                  Order_id: detailItem.order_id, //订单 id
                  Shop_id: that.data.shop_id, //店铺 id 
                  operatorchecked: 1,
                  userchecked: 1,
                  operator: app.globalData.loginname,
                  u_item_subtotal: subtotal,
                  u_measurement_value: number.after
                }
              }
            } else {
              //同意修改的情况下，修改之后的加收乘于原本份数:" + other 第七种来料加工确认
              if (other == undefined || other == '' || other == null || other == NaN) {
                other = 0
                original = 0
                subtotal = Number(original) + Number(sideDisht_add)
              } else {
                original = number.after * other
                subtotal = Number(original) + Number(sideDisht_add)
              }
              godata = {
                id: detailItem.id, //详单 id
                Order_id: detailItem.order_id, //订单 id
                Shop_id: that.data.shop_id, //店铺 id 
                operatorchecked: 1,
                userchecked: 1,
                operator: app.globalData.loginname,
                u_item_subtotal: subtotal,
              }
            }
            //------------------------------------------------------------------------------------------------
          } else { // 一般的情况下,当输入值不能为空的情况下
            if (number != null && number != '' && number != undefined) {
              var qujian = detailItem.item_number
              var min = parseFloat(qujian.split(',')[0])
              var max = parseFloat(qujian.split(',')[1])

              if (number.fore == 0) { // 当输入0 数量时
                wx.showToast({
                  title: '数量不能为零', //提示文字
                  duration: 3000, //显示时长
                  mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
                  icon: 'none', //图标，支持"success"、"loading"  
                  success: function () {
                    return
                  }, //接口调用成功
                })
              } else { //当不为零的情况下
                if (number.fore > max) {
                  //数量输入错误
                  time.show_NOCANCEL_Model("输入数量不能超过预订数量")
                  return
                } else {
                  //第八种来料加工确认 一般情况下,正常的加收：" + other + ",配菜:" + sideDisht_add数量正确
                  var original = 0
                  // var original = detailItem.item_price * number.fore //菜品材料的钱，因为还未确认，所以采用输入值
                  if (detailItem.em_id != "0" && detailItem.em_id != 0 && detailItem.em_id != '' && detailItem.u_em_id != undefined && detailItem.em_id != "[0]") { //吃法为零不加收
                    var em_id = JSON.parse(detailItem.em_id)
                    other = 0
                    for (var x of em_id) {
                      other += x.money
                    }
                  }
                  if (other == undefined || other == '' || other == null || other == NaN) {
                    other = 0
                    original = 0
                    subtotal = Number(original) + Number(sideDisht_add)
                  } else {
                    original = number.fore * other
                    subtotal = Number(original) + Number(sideDisht_add)
                  }
                  godata = {
                    id: detailItem.id, //详单 id
                    Order_id: detailItem.order_id, //订单 id
                    Shop_id: that.data.shop_id, //店铺 id 
                    operator: app.globalData.loginname,
                    userchecked: 1,
                    operatorchecked: 1,
                    Item_subtotal: subtotal,
                    Measurement_value: number.fore
                  }
                }
              }
            }
          }
        } else {
          wx.showToast({
            title: '数量不能为空', //提示文字
            duration: 3000, //显示时长
            mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
            icon: 'none', //图标，支持"success"、"loading"  
            success: function () {
              return
            }, //接口调用成功
          })
        }
      }
    } else { //单一、多种规格菜品的确认
      //第九种称重确认
      var subtotal = detailItem.item_number * detailItem.item_price
      godata = {
        id: detailItem.id,
        Order_id: detailItem.order_id,
        Shop_id: that.data.shop_id,
        operatorchecked: 1,
        userchecked: 1,
        operator: app.globalData.loginname,
        operation_time: time.formatTime(new Date()),
        Item_subtotal: subtotal
      }
    }
    if (godata != null && godata != '') {
      //调用的接口参数为:" + JSON.stringify(godata))
      WXAPI.updateOrderDetailedForAll(godata).then(function (data) {
        if (data.result.result == 1) {
          //完成确认
          that.recordConfirmationInf(1, "多种做法确认", detailItem)
          WXAPI.synchronizedAmount({
            order_id: detailItem.order_id,
          }).then(function (data) {
            if (data.result.result == 1) {
              that.redress() // 矫正金额和刷新
              //矫正金额和刷新成功
            } else {
              //矫正价格失败
            }
            wx.hideLoading()
          }).catch(res => {
            //矫正价格失败
          })
        } else {
          //获取多做法菜品失败
          wx.showToast({
            title: '确认多做法菜品失败', //提示文字
            duration: 3000, //显示时长
            icon: 'none', //图标，支持"success"、"loading"  
            success: function () {
              wx.hideLoading()
            }, //接口调用成功
          })
        }
      }).catch(function (res) {
        //确认多做法菜品失败
      })
    } else {
      //确认失败
      wx.showToast({
        title: '确认多做法菜品失败', //提示文字
        duration: 3000, //显示时长
        icon: 'none', //图标，支持"success"、"loading"  
        success: function () {
          wx.hideLoading()
        }, //接口调用成功
      })
    }
  },
  // 称重单规格特定确认菜品，因为称重计件已经弄了一个新确认菜品了，为了避免歧义，重新弄一个新的确认菜品
  singleDishesCheck: function (e) {
    var that = this;
    var godata;
    // that.timed_refresh(1)
    wx.showLoading({
      title: '正在确认',
    })
    // 菜品的详情
    var detailItem = e.currentTarget.dataset.detailitem
    var index = e.currentTarget.dataset.index
    var weight = that.data.dinput[index]
    var subtotal = 0

    if (that.data.isScales) { // 当有电子秤的情况下,应该由电子秤称重写入measurement_value值
      //  称重之后
      if (detailItem.measurement_value != null && detailItem.measurement_value != '' && detailItem.measurement_value != undefined) {

        subtotal = detailItem.measurement_value * detailItem.item_price

        if (detailItem.item_type == 3 && detailItem.operatorchecked == 1) { //已经修改的情况下
          if (detailItem.u_measurement_value != null && detailItem.u_measurement_value != '' && detailItem.u_measurement_value != undefined) {
            subtotal = detailItem.u_measurement_value * detailItem.item_price
          }
          //第一种计件确认
          godata = {
            id: detailItem.id, //详单 id
            Order_id: detailItem.order_id, //订单 id
            Shop_id: that.data.shop_id, //店铺 id 
            operator: app.globalData.loginname,
            u_item_subtotal: subtotal,
            operatorchecked: 1,
            userchecked: 1,
          }
        } else {
          //第二种计件确认
          godata = {
            id: detailItem.id, //详单 id
            Order_id: detailItem.order_id, //订单 id
            Shop_id: that.data.shop_id, //店铺 id 
            operator: app.globalData.loginname,
            Item_subtotal: subtotal,
            operatorchecked: 1,
            userchecked: 1,
          }
        }
      } else {
        wx.showToast({
          title: '称重不能为空', //提示文字
          duration: 3000, //显示时长
          mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
          icon: 'none', //图标，支持"success"、"loading"  
          success: function () {
            return
          }, //接口调用成功
        })
      }
    } else {
      // 在没有电子称的情况下，输入的值在确认之后
      // 输入值不能为空
      if (weight != null && weight != '' && weight != undefined) {
        // 当菜品同意修改之后,区间就会变为修改之后的区间范围 ，这里是为了避免出单之后，客户在输入重量之前就申请修改重量
        // 重写，分为两种，一种同意修改，另外一种是常规，不能修改和不能取消状态 不影响这个 
        // 同意修改的情况
        if (detailItem.item_type == 3 || detailItem.dishes_status == 11) {
          // 当修改了重量的情况下的的输入后的数量
          if (weight.after != null && weight.after != '' && weight.after != undefined) {
            var qujian = detailItem.u_item_number
            var min = parseFloat(qujian.split(',')[0])
            var max = parseFloat(qujian.split(',')[1])

            if (parseFloat(weight.after) < min || parseFloat(weight.after) > max) {
              //修改后重量输入错误
              time.show_NOCANCEL_Model("输入重量不在预订重量范围之中")
              return
            } else {
              //第三种计件确认
              subtotal = parseFloat(weight.after) * detailItem.item_price
              godata = {
                id: detailItem.id, //详单 id
                Order_id: detailItem.order_id, //订单 id
                Shop_id: that.data.shop_id, //店铺 id 
                operatorchecked: 1,
                userchecked: 1,
                operator: app.globalData.loginname,
                u_item_subtotal: subtotal,
                u_measurement_value: parseFloat(weight.after)
              }
            }

          } else {
            //第四种计件确认
            godata = {
              id: detailItem.id, //详单 id
              Order_id: detailItem.order_id, //订单 id
              Shop_id: that.data.shop_id, //店铺 id 
              operatorchecked: 1,
              userchecked: 1,
              operator: app.globalData.loginname,
              u_item_subtotal: subtotal,
            }
          }
          //------------------------------------------------------------------------------------------------
        } else { // 一般的情况下,当输入值不能为空的情况下
          if (weight != null && weight != '' && weight != undefined) {
            var qujian = detailItem.item_number
            var min = parseFloat(qujian.split(',')[0])
            var max = parseFloat(qujian.split(',')[1])

            if (parseFloat(weight.fore) == 0) { // 当输入0 重量时
              wx.showToast({
                title: '重量不能为零', //提示文字
                duration: 3000, //显示时长
                mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
                icon: 'none', //图标，支持"success"、"loading"  
                success: function () {
                  wx.hideLoading()
                  return
                }, //接口调用成功
              })
            } else { //当不为零的情况下
              if (parseFloat(weight.fore) < min || parseFloat(weight.fore) > max) {
                //重量输入错误
                time.show_NOCANCEL_Model("输入重量不在预订重量范围之中")
                wx.hideLoading()
                return
              } else {
                // 第一次输入重量且正确的时候
                //重量正确 第五种计件确认
                subtotal = parseFloat(weight.fore) * detailItem.item_price
                godata = {
                  id: detailItem.id, //详单 id
                  Order_id: detailItem.order_id, //订单 id
                  Shop_id: that.data.shop_id, //店铺 id 
                  operator: app.globalData.loginname,
                  userchecked: 1,
                  operatorchecked: 1,
                  Item_subtotal: subtotal,
                  Measurement_value: parseFloat(weight.fore)
                }
              }
            }
          }
        }

      } else {
        wx.showToast({
          title: '重量不能为空', //提示文字
          duration: 3000, //显示时长
          mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
          icon: 'none', //图标，支持"success"、"loading"  
          success: function () {
            return
          }, //接口调用成功
        })
      }
    }
    // 核价状态：不需核价-0、未核价-1、已核价-2
    if (godata != null && godata != '') {
      //调用的接口参数为:" + JSON.stringify(godata))

      WXAPI.updateOrderDetailedForAll(godata).then(function (data) {
        if (data.result.result == 1) {
          //完成确认
          that.recordConfirmationInf(1, "多种做法确认", detailItem)
          WXAPI.synchronizedAmount({
            order_id: detailItem.order_id,
          }).then(function (data) {
            if (data.result.result == 1) {
              that.redress() // 矫正金额和刷新
              //矫正金额和刷新成功
            } else {
              //矫正价格失败
            }
          }).catch(res => {
            //矫正价格失败
          })
        } else {
          //确认称重菜品失败
          wx.showToast({
            title: '确认称重菜品失败', //提示文字
            duration: 3000, //显示时长
            icon: 'none', //图标，支持"success"、"loading"  
            success: function () {
              wx.hideLoading()
            }, //接口调用成功
          })
        }
      }).catch(function (res) {
        //确认称重菜品失败
      })
    } else {
      //确认失败
      wx.hideLoading()
    }
  },
  //拒绝申请减少菜品,因为拒绝拒绝减数量，只需要取消申请修改的状态就好了，金钱和菜品数量都不要改变
  refuse: function (e) {
    var that = this
    //拒绝申请减数量
    // that.timed_refresh(1)

    if (e.currentTarget.dataset.number >= 1 || e.currentTarget.dataset.number != '') { // 数量为整数
      that.setData({
        submit: false
      })
      that.showLoading()
      var godata

      if (e.currentTarget.dataset.dishes_status == 10) {
        //拒绝修改
        godata = {
          id: e.currentTarget.dataset.paymentid,
          Order_id: e.currentTarget.dataset.orderid,
          Shop_id: that.data.shop_id,
          operator: app.globalData.loginname,
          Dishes_status: 12,
        }
        WXAPI.updateOrderDetailedForAll(godata).then(function (data) {
          if (data.result.result == 1) {
            //拒绝成功
            WXAPI.synchronizedAmount({
              order_id: that.data.orderid,
            }).then(function (data) {
              if (data.result.result == 1) {
                that.redress() // 矫正金额和刷新
                //矫正金额和刷新成功
              } else {
                //矫正价格失败
              }
            }).catch(res => {
              //矫正价格失败
            })
          } else {
            //拒绝失败
          }
        }).catch(function (res) {
          //拒绝失败
        })
      }
    }
  },
  // 允许减少菜品，并更改订单
  reduceAmount: function (e) {
    var that = this
    // that.timed_refresh(1)

    var u_item_number = Math.abs(Number(e.currentTarget.dataset.u_item_number)) // 取绝对值
    var foodItem = e.currentTarget.dataset.item

    wx.showModal({
      title: '修改订单',
      content: '是否允许修改',
      cancelText: '否',
      confirmText: '是',
      cancelColor: '#519763', //取消文字的颜色
      confirmColor: '#519763', //确定文字的颜色
      success(res) {
        if (res.cancel) {
          // 用户点击了取消属性的按钮，对应选择了'否'
          that.refuse(e)

        } else if (res.confirm) {
          // 用户点击了确定属性的按钮，对应选择了'是'
          if (e.currentTarget.dataset.number >= 1) { // 数量为整数
            that.setData({
              submit: false
            })

            that.showLoading()

            var sum = e.currentTarget.dataset.price * (Number(e.currentTarget.dataset.number) - u_item_number)

            var itemtype = foodItem.item_type
            if (e.currentTarget.dataset.number == u_item_number) {
              itemtype = 1
            } else {
              itemtype = 3
            }

            var godata

            if (e.currentTarget.dataset.dishes_status == 10) {
              //第三种减法
              godata = {
                id: e.currentTarget.dataset.paymentid,
                Order_id: e.currentTarget.dataset.orderid,
                Shop_id: that.data.shop_id,
                item_number: Number(Number(e.currentTarget.dataset.number) - Number(u_item_number)),
                operator: app.globalData.loginname,
                u_item_subtotal: Number(sum),
                Item_type: itemtype,
                Dishes_status: 11
              }
              // 核价状态：不需核价-0、未核价-1、已核价-2
              wx.request({
                url: app.globalData.UpdateOrderDetailed_url,
                data: godata,
                success: function (res) {
                  if (res.data.result.result == 1) {
                    wx.request({
                      url: app.globalData.SynchronizedAmount_url,
                      data: {
                        order_id: that.data.orderid,
                      },
                      success: function (res) {
                        if (res.data.result.result == 1) {
                          that.redress(); // 刷新
                        }
                      }
                    })
                  }
                }
              })
            }
          }
        }
      }
    })
  },

  // 允许修改菜品，单规格多做法，多做法有做法加收，所以计算价格的时候需要加上去
  // 单规格多做法，因为是直接写入修改后的份数，所以现在是直接以u_item_number 为修改后的份数，而不是之前的被减数
  reduceAmount_single: function (e) {
    var that = this
    // that.timed_refresh(1)
    var dishesItem = e.currentTarget.dataset.item
    var u_item_number
    if (dishesItem.u_item_number != '') {
      var value2 = dishesItem.u_item_number.split('-');
      u_item_number = Math.abs(parseInt(value2[0]));
    }
    var value1 = dishesItem.item_number.split('-');
    var number = Math.abs(parseInt(value1[0]));

    wx.showModal({
      title: '修改订单',
      content: '是否允许修改',
      cancelText: '否',
      confirmText: '是',
      cancelColor: '#519763', //取消文字的颜色
      confirmColor: '#519763', //确定文字的颜色
      success(res) {
        if (res.cancel) {
          // 用户点击了取消属性的按钮，对应选择了'否'
          that.refuse(e)
          that.recordConfirmationInf(1, "多种做法修改", dishesItem)
        } else if (res.confirm) {
          // 用户点击了确定属性的按钮，对应选择了'是'
          that.setData({
            submit: false
          })
          that.showLoading()
          var em_id = JSON.parse(dishesItem.em_id)
          var u_em_id
          var other = 0
          var subtotal = 0
          var sum = 0

          if (dishesItem.u_em_id != '' && dishesItem.u_em_id != "null" && dishesItem.u_em_id != 0 && dishesItem.u_em_id != null) {
            //当修改的吃法不为空.因为切瓜切菜传过来的参数不稳定。
            u_em_id = JSON.parse(dishesItem.u_em_id)
            for (var x of em_id) { // 修改后吃法的item_number
              other += x.money
            }
          } else {
            for (var x of em_id) { // 原吃法的item_number
              other += x.money
            }
          }
          if (u_item_number != '') { //材料金额，当存在u_item_number时。
            sum = dishesItem.item_price * (Number(u_item_number))
          } else {
            sum = dishesItem.item_price * (Number(number))
          }
          subtotal = sum + other // 原价加上加收的价钱
          var godata
          if (dishesItem.dishes_status == 10) { // 同意修改的时候，不需要更改item_number
            //第三种减法
            godata = {
              id: dishesItem.id,
              Order_id: dishesItem.order_id,
              Shop_id: that.data.shop_id,
              operator: app.globalData.loginname,
              u_item_subtotal: Number(subtotal),
              Dishes_status: 11
            }
            // 核价状态：不需核价-0、未核价-1、已核价-2
            wx.request({
              url: app.globalData.UpdateOrderDetailed_url,
              data: godata,
              success: function (res) {
                if (res.data.result.result == 1) {
                  wx.request({
                    url: app.globalData.SynchronizedAmount_url,
                    data: {
                      order_id: that.data.orderid,
                    },
                    success: function (res) {
                      if (res.data.result.result == 1) {
                        that.recordConfirmationInf(1, "多种做法修改", dishesItem)
                        that.redress(); // 刷新
                      }
                    }
                  })
                }
              }
            })
          } else {
            time.show_NOCANCEL_Model("该菜品不在修改状态")
          }
        }
      },
      complete() {
        wx.hideLoading({
          complete: (res) => { },
        })
      }
    })
  },

  //重写警告
  getOrderDishes: function () { //得到其他费用加减的方法
    var that = this;
    //在获取order_payment的时候,把使用的预存和星盾也获取,并setDate出来
    wx.request({
      url: app.globalData.GetOrderPaymentInf_url,
      data: {
        Order_id: that.data.orderid
      },
      success: function (res) {
        if (res.data.result.result == 1) {
          that.setData({
            // orderPayment: res.data.object[0],
            coin_prestore: res.data.object[0].use_coin,
            prestore: res.data.object[0].use_balance
          })
          if (res.data.object[0].actual_total == 0) {
            that.setData({
              discount_after_money: app.globalData.sumMonney,
            })
          } else {
            that.setData({
              discount_after_money: res.data.object[0].actual_total,
            })
          }
        } else {
          that.setData({
            orderDetailData: false
          })
        }
      }
    })

    wx.request({
      url: app.globalData.SelectDiscountInformationByOrderId_url,
      data: {
        order_id: that.data.orderid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      method: 'POST',
      success: function (res) {
        if (res.data.object.otherRecords.length > 0) {
          that.setData({
            haveOtherBoolean: true,
            amountCharged: res.data.object.otherRecords[0].amountCharged,
            amountDeducted: res.data.object.otherRecords[0].amountDeducted,
          })
          if (res.data.object.otherRecords[0].amountCharged == 0 && res.data.object.otherRecords[0].amountDeducted == 0) {
            that.setData({
              otherBoolean: false,
              acBoolean: false,
              adBoolean: false
            })
          } else if (res.data.object.otherRecords[0].amountCharged == 0 && res.data.object.otherRecords[0].amountDeducted != 0) {
            that.setData({
              acBoolean: false,
              adBoolean: true
            })
          } else if (res.data.object.otherRecords[0].amountCharged != 0 && res.data.object.otherRecords[0].amountDeducted == 0) {
            that.setData({
              acBoolean: true,
              adBoolean: false
            })
          }
        } else { //没有需要加减的操作,按钮不用亮,其他费用的加减不需要显示
          that.setData({
            haveOtherBoolean: false,
            otherBoolean: true,
            acBoolean: false,
            adBoolean: false
          })
        }
        if (res.data.object.discountRecords.length == 0 && res.data.object.otherRecords.length == 0 &&
          res.data.object.tipRecords.length == 0) {
          //部长没有更改过金额,所以实付还是0
          that.setData({
            disNotHaveRecords: false
          })
        } else { //部长有更改过金额
          that.setData({
            disNotHaveRecords: true
          })
        }
      }
    })
  },
  // 部长取消
  quxiaocaipin: function (e) {
    var that = this;
    let foodItem = e.currentTarget.dataset.item
    // that.timed_refresh(1)
    wx.showModal({
      content: '是否确定要取消该菜品',
      showCancel: true, //是否显示取消按钮
      confirmText: "是", //默认是“确定”
      cancelText: "否", //默认是“取消”
      cancelColor: '#519763', //取消文字的颜色
      confirmColor: '#519763', //确定文字的颜色
      success: function (res) {
        if (res.confirm) {
          var godata
          if (foodItem.spec_id == 1) { //称重菜品规格名称为1
            godata = {
              id: foodItem.id,
              Order_id: foodItem.order_id,
              Shop_id: that.data.shop_id,
              Dishes_status: 9,
              operator: app.globalData.loginname, //operator
              Item_type: 1, //点餐类别：加餐id、点餐-0、退餐--1
            }
          } else {
            godata = {
              id: foodItem.id,
              Order_id: foodItem.order_id,
              Shop_id: that.data.shop_id,
              Dishes_status: 3,
              operator: app.globalData.loginname,
              Item_type: 1,
            }
          }
          //取消的参数：" + JSON.stringify(godata)

          var dishes_num
          if (foodItem.spec_id == 1 || foodItem.spec_id == 5) {
            dishes_num = 1
          } else {
            dishes_num = Number(foodItem.item_number)
          }
          WXAPI.updateOrderDetailedForAll(godata).then(function (data) {
            if (data.result.result == 1) {
              //取消该菜品成功
              WXAPI.updateOrderInfForAll({
                Order_id: that.data.orderid,
                Shop_id: that.data.shop_id,
                dishes_count: Number(Number(that.data.thisorderarry.dishes_count) - dishes_num)
              }).then(function (data) {
                if (data.result.result == 1) {
                  that.redress() // 矫正金额和刷新
                  //矫正金额和刷新成功
                } else {
                  //矫正价格失败
                }
              }).catch(res => {
                //矫正价格失败
              })
            } else {
              //取消菜品失败
              wx.showToast({
                title: '取消菜品失败', //提示文字
                duration: 3000, //显示时长
                icon: 'none', //图标，支持"success"、"loading"  
                success: function () {
                  wx.hideLoading()
                }, //接口调用成功
              })
            }
          }).catch(function (res) {
            //取消菜品失败
          })
          //点击取消,默认隐藏弹框
        } else { //  拒绝取消之后的操作
          //点击确定
          //拒绝取消
          var godata = {
            id: foodItem.id,
            Order_id: foodItem.order_id,
            Shop_id: that.data.shop_id,
            Dishes_status: 13,
            // operatorchecked: 1,
            operator: app.globalData.loginname, //operator
            // Item_type: 1, //点餐类别：加餐id、点餐-0、退餐--1
          }
          wx.request({
            url: app.globalData.UpdateOrderDetailed_url,
            data: godata,
            success: function (res) {
              if (res.data.result.result == 1) {
                that.redress() //矫正金额和获取订单
              }
            }
          })
        }
      },
      fail: function (res) { }, //接口调用失败的回调函数
      complete: function (res) { }, //接口调用结束的回调函数（调用成功、失败都会执行）
    })
  },
  yanxiradiocolor: function (e) {
    var that = this;
    that.setData({
      yanxiradiocolor: true
    })
  },
  // 说出来你也不信.这是临时菜品的部长确认，下单前
  temporaryConfirm: function (e) {
    var that = this;
    // that.timed_refresh(1)
    that.data.linshibuzhangradiocolor = true
    var ls_img_url = "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/ls.png"

    if (that.data.order_status_end.indexOf(that.data.thisorderarry.order_status) == -1) {
      // if (Number(that.data.thisorderarry.operatorchecked1) != 1) {
      if (that.data.temporaryValue == null || that.data.temporaryValue == '') {
        // 临时菜名，输入用
        wx.showToast({
          title: '临时菜名不能为空',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      } else if (that.data.wanggouarray == null || that.data.wanggouarray == '') {
        // 临时菜品食材组成
        wx.showToast({
          title: '食材组成不能为空',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      } else if (that.data.tempNumber == null || that.data.tempNumber == '') {
        // 临时份数-填写用
        wx.showToast({
          title: '份数不能为空',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      } else if (that.data.tempPrice == null || that.data.tempPrice == '') {
        // 临时价格-填写用
        wx.showToast({
          title: '价格不能为空',
          icon: 'none',
          duration: 2000,
          mask: true
        })
      } else {
        wx.showLoading({
          title: '正在下单',
        })
        var isTemp = that.data.isTemp
        var temporary = that.data.temporary; // 临时菜品-填写用
        var tempNumber = that.data.tempNumber; // 临时份数-填写用
        var tempPrice = that.data.tempPrice; // 临时价格-填写用
        var tempSum = that.data.tempSum; // 临时总额-填写用
        var temporaryValue = that.data.temporaryValue
        var wanggouarrays = that.data.wanggouarray
        var tempUnit = that.data.tempUnit
        var temp_spec_type = that.data.temp_spec_type
        let remarks = ""
        let tempDetail = that.data.tempDetail
        var temp_img_url = ""

        for (var x of wanggouarrays) {
          let a = x.hailname + ": " + x.hailnum + "斤, "
          remarks += a
        }

        if (tempDetail) { // 判断是否为之前的菜品，如果是的话，就直接下单
          if (remarks != tempDetail.dishes_introduce || tempPrice != tempDetail.dishes_price || tempUnit != tempDetail.dishes_metering_type || temp_spec_type != tempDetail.spec_type) {
            isTemp = false
            that.setData({
              isTemp: false
            })
          } else {
            isTemp = true
            that.setData({
              isTemp: true
            })
          }
        }

        //------------------------------------------------------------
        //先判断是否有这个菜，没有就写进去， 临时菜品的添加;PS：当选中以前的临时菜品之后，再进行修改的话，就会变成新的临时菜品
        //------------------------
        if (that.data.readyToOrder || that.data.readyToOrder) {
          //直接加菜的情况下
          if (isTemp) {
            //已有的临时菜 -- 直接点餐
            var temp = {
              adddishes_flag: 0,
              big_img_url: ls_img_url,
              decdishes_flag: 1,
              disher_weight: 0,
              dishes_id: tempDetail.dishes_id,
              dishes_introduce: remarks,
              dishes_price: parseFloat(that.data.tempPrice),
              dishes_spec_type: 0,
              dishes_status: 0,
              dishes_name: tempDetail.dishes_name,
              img_url: ls_img_url,
              item_type: 0,
              name: tempDetail.dishes_name,
              number: parseInt(that.data.tempNumber),
              price: parseFloat(that.data.tempPrice),
              dishes_remark: remarks,
              spec_name: tempDetail.dishes_metering_type,
              spec_type: that.data.temp_spec_type > 1 ? 1 : that.data.temp_spec_type,
              specal_type: 6,
              sum: that.data.tempSum,
              u_item_number: 0,
              weighing: 0,
              isTemp: isTemp // 是否已有的临时菜，boolean
            }

            wx.showToast({
              title: '添加成功', //提示文字
              duration: 3000, //显示时长
              mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false  
              icon: 'success', //图标，支持"success"、"loading"  
              success: function () {
                wx.hideLoading()
              }, //接口调用成功
            })
          } else if (!isTemp) {
            //新增的临时菜
            var cartList = that.data.cartList
            wx.request({
              url: app.globalData.WriteDishes_url,
              data: {
                sales_category: 0, //是 Int 2 售卖类型
                dishes_img: ls_img_url, //是 String 1.jpeg 菜品照片
                dishes_metering_type: that.data.tempUnit, //是 String 斤 计量类型
                dishes_name: temporaryValue, //是 String 测试菜 菜品名称 
                dishes_price: parseFloat(that.data.tempPrice), //是 Float 22 菜品价格
                dishes_pricing: 1, //是 Int 1 是否需要核价
                dishes_recommend: 0, //是 Int 1 是否为推荐菜
                dishes_specialty: 0, //是 Int 1 是否为特价菜
                dishes_statu: 2, //是 Int 1 菜品状态
                dishes_discount: 0, //是 Int 1 是否允许折扣
                dishes_introduce: remarks, //否 String 测试菜 菜品介绍
                spec_type: that.data.temp_spec_type > 1 ? 1 : that.data.temp_spec_type, //是 Int 1 规格类型
                xd: 0,
                nature: "饲养",
                position: 1,
                weighing: 0,
                reduce_flag: 0,
                specal_type: 6,
                querendengji: 2,
                xiugaidengji: 0,
                preferential: 0,
                shop_id: that.data.shop_id, //是 Int 1 所属店铺 id
                city_id: 1, //城市id
                county_id: 1, //省id
                finished_product: 0,
                class_i_id: that.data.class_i_id,
                parent_type_id: that.data.parent_id,
                subclass_type_id: that.data.subclass_type_id,
                commercial_area_id: 7,
                place_of_origin: "省内",
                big_dishes_img: "https://mb.fsmbdlkj.com/WX Restaurant/dishesImg/1564799013292big",
                residual_alarm: 0,
                sideDisht: "",
                hadOrdered: false,
                freeOrder: 0,
                repairOrder: 0,
                copyOrder: 1,
                waitOrder: 0,
                baleOrder: 0,
                transferOrder: 0,
                depositOrder: 0,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
              },
              method: 'POST',
              success: function (res) {
                if (res.data.result.result == 1) {
                  //菜单添加临时菜品成功
                  that.addDishesMaterial(res.data.object.dishes_id)
                  var temp = {
                    adddishes_flag: 0,
                    big_img_url: ls_img_url,
                    decdishes_flag: 1,
                    disher_weight: 0,
                    dishes_id: res.data.object.dishes_id,
                    dishes_introduce: remarks,
                    dishes_price: parseFloat(that.data.tempPrice),
                    dishes_spec_type: 0,
                    dishes_status: 0,
                    dishes_name: temporaryValue,
                    img_url: ls_img_url,
                    item_type: 0,
                    name: temporaryValue,
                    number: parseInt(that.data.tempNumber),
                    price: parseFloat(that.data.tempPrice),
                    dishes_remark: remarks,
                    spec_name: tempUnit,
                    spec_type: tempUnit,
                    specal_type: 6,
                    sum: that.data.tempSum,
                    u_item_number: 0,
                    weighing: 0,
                    isTemp: isTemp,
                    sales_category: 0, //是 Int 2 售卖类型
                    dishes_img: ls_img_url, //是 String 1.jpeg 菜品照片
                    dishes_metering_type: that.data.tempUnit, //是 String 斤 计量类型
                    dishes_pricing: 1, //是 Int 1 是否需要核价
                    dishes_recommend: 0, //是 Int 1 是否为推荐菜
                    dishes_specialty: 0, //是 Int 1 是否为特价菜
                    dishes_statu: 2, //是 Int 1 菜品状态
                    dishes_discount: 0, //是 Int 1 是否允许折扣
                    xd: 0,
                    nature: "饲养",
                    position: 1,
                    reduce_flag: 0,
                    querendengji: 2,
                    xiugaidengji: 0,
                    preferential: 0,
                    shop_id: that.data.shop_id, //是 Int 1 所属店铺 id
                    city_id: 1, //城市id
                    county_id: 1, //省id
                    finished_product: 0,
                    class_i_id: that.data.class_i_id,
                    parent_type_id: that.data.parent_id,
                    subclass_type_id: that.data.subclass_type_id,
                    commercial_area_id: 7,
                    place_of_origin: "省内",
                    big_dishes_img: "https://mb.fsmbdlkj.com/WX Restaurant/dishesImg/1564799013292big",
                    residual_alarm: 0,
                    sideDisht: "",
                    jointSet: "",
                    tastes: "",
                    hadOrdered: false,
                    freeOrder: 0,
                    repairOrder: 0,
                    copyOrder: 1,
                    waitOrder: 0,
                    baleOrder: 0,
                    transferOrder: 0,
                    depositOrder: 0,
                  }
                  cartList.push(temp)
                  that.mangnerCarList(cartList)
                  wx.showToast({
                    title: '添加成功', //提示文字
                    duration: 3000, //显示时长
                    mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false  
                    icon: 'success', //图标，支持"success"、"loading"  
                    success: function () {
                      wx.hideLoading()
                    }, //接口调用成功
                  })

                } else if (res.data.result.result != 1) {
                  //菜单添加临时菜品失败
                }
              },
              fail: function (res) {
                //写单失败
              },
              complete: function (res) {
                wx.hideLoading()
              }
            })
            //直接点餐，临时菜品加菜!
          }
        } else {
          //出单加菜的情况下
          if (isTemp) {
            //已有的临时菜
            that.newTemporaryDishes(e)
          } else if (!isTemp) {
            //新增的临时菜
            wx.request({
              url: app.globalData.WriteDishes_url,
              data: {
                sales_category: 0, //是 Int 2 售卖类型
                dishes_img: ls_img_url, //是 String 1.jpeg 菜品照片
                dishes_metering_type: that.data.tempUnit, //是 String 斤 计量类型
                dishes_name: temporaryValue, //是 String 测试菜 菜品名称 
                dishes_price: parseFloat(that.data.tempPrice), //是 Float 22 菜品价格
                dishes_pricing: 1, //是 Int 1 是否需要核价
                dishes_recommend: 0, //是 Int 1 是否为推荐菜
                dishes_specialty: 0, //是 Int 1 是否为特价菜
                dishes_statu: 2, //是 Int 1 菜品状态
                dishes_discount: 0, //是 Int 1 是否允许折扣
                dishes_introduce: remarks, //否 String 测试菜 菜品介绍
                spec_type: that.data.temp_spec_type > 1 ? 1 : that.data.temp_spec_type, //是 Int 1 规格类型
                xd: 0,
                nature: "饲养",
                position: 1,
                weighing: 0,
                reduce_flag: 0,
                specal_type: 6,
                querendengji: 2,
                xiugaidengji: 0,
                preferential: 0,
                shop_id: that.data.shop_id, //是 Int 1 所属店铺 id
                city_id: 1, //城市id
                county_id: 1, //省id
                finished_product: 0,
                class_i_id: that.data.class_i_id,
                parent_type_id: that.data.parent_id,
                subclass_type_id: that.data.subclass_type_id,
                commercial_area_id: 7,
                place_of_origin: "省内",
                big_dishes_img: "https://mb.fsmbdlkj.com/WX Restaurant/dishesImg/1564799013292big",
                residual_alarm: 0,
                sideDisht: "",
                hadOrdered: false,
                freeOrder: 0,
                repairOrder: 0,
                copyOrder: 1,
                waitOrder: 0,
                baleOrder: 0,
                transferOrder: 0,
                depositOrder: 0,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
              },
              method: 'POST',
              success: function (res) {
                if (res.data.result.result == 1) {
                  //菜单添加临时菜品成功
                  that.addDishesMaterial(res.data.object.dishes_id)
                  that.recordConfirmationInf(1, "临时菜品下单", res.data.object)
                  // let temporary_id =             res.data.object.dishes_id  
                  //====================================================================================================
                  var temp = {
                    "user_id": parseInt(that.data.user_id), // 点餐用户id
                    "order_id": parseInt(that.data.orderid), // 订单id
                    "dishes_id": res.data.object.dishes_id, // 菜品id
                    "dishes_name": res.data.object.dishes_name,
                    "item_number": parseInt(that.data.tempNumber), // 菜品份数
                    "item_price": parseFloat(that.data.tempPrice), // 单价
                    "item_subtotal": that.data.tempSum, // 小计 
                    "dishes_status": 0, // 核价状态 
                    "item_type": 2, // 2
                    "measurement_value": 0,
                    "spec_id": 0,
                    "praise_flag": 1,
                    "userchecked": 0,
                    "remarks": remarks,
                    "dishes_img": "https://mb.fsmbdlkj.com/WX Restaurant/dishesImg/1556158550064",
                    "dishes_metering_type": res.data.object.dishes_metering_type,
                    "spec_name": that.data.tempUnit,
                    "specal_type": 6,
                    "em_id": '',
                    "operator": app.globalData.loginname,
                    "operatorchecked": 1,
                    "initial_number": parseInt(that.data.tempNumber), // 初始菜品份数
                    "sideDisht": '',
                    "jointSet": '',
                    "tastes": '',
                    "freeOrder": 0,
                    "repairOrder": 0,
                    "copyOrder": 1,
                    "waitOrder": 0,
                    "baleOrder": 0,
                    "transferOrder": 0,
                    "depositOrder": 0,
                  }
                  var orderdetail = []
                  orderdetail.push(temp)
                  //临时菜品加菜!
                  wx.request({
                    url: app.globalData.WriteOrderDetails_url,
                    data: {
                      OrderDetaileds: JSON.stringify(orderdetail)
                    },
                    method: "POST",
                    header: {
                      "Content-Type": "application/x-www-form-urlencoded"
                    },
                    success: function (res) {
                      if (res.data.result.result == 1) {
                        let paymentid = res.data.object[0].id
                        let order_id = res.data.object[0].order_id
                        // 暂定
                        let temp_operation_time = time.formatTime(new Date())
                        that.setData({
                          temp_operation_time: temp_operation_time,
                          temp_operator: app.globalData.loginname
                        })
                        wx.request({
                          url: app.globalData.UpdateOrderDetailed_url,
                          data: {
                            id: paymentid,
                            Order_id: order_id,
                            Shop_id: that.data.shop_id,
                            operator: app.globalData.loginname,
                            Dishes_status: 0
                          },
                          success: function (res) {
                            if (res.data.result.result == 1) {
                              that.setData({
                                temp_operation_time: temp_operation_time,
                              })
                            }
                          }
                        })
                        //详细订单改完后，因为主订单的金额与与详细订单金额总和不对应，需修改主订单与支付订单
                        wx.request({
                          url: app.globalData.UpdateOrderInf_url,
                          data: {
                            Order_id: that.data.orderid,
                            Shop_id: that.data.shop_id,
                            dishes_count: Number(Number(that.data.thisorderarry.dishes_count) + that.data.tempNumber)
                          },
                          success: function (res) {
                            if (res.data.result.result == 1) {
                              wx.request({
                                url: app.globalData.SynchronizedAmount_url,
                                data: {
                                  order_id: that.data.orderid,
                                },
                                success: function (res) {
                                  if (res.data.result.result == 1) {
                                    wx.showToast({
                                      title: '下单成功', //提示文字
                                      duration: 3000, //显示时长
                                      mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false  
                                      icon: 'success', //图标，支持"success"、"loading"  
                                      success: function () {
                                        wx.hideLoading()
                                      }, //接口调用成功
                                    })
                                    that.redress() // 矫正金额和刷新
                                  }
                                }
                              })
                            }
                          }
                        })
                      }
                    }
                  })
                  //=========================================================================
                } else if (res.data.result.result != 1) {
                  //菜单添加临时菜品失败
                }
              },
              fail: function (res) {
                //写单失败
              },
              complete: function (res) {
                wx.hideLoading()
              }
            })
          }
        }
      }
    } else {
      time.show_NOCANCEL_Model("订单已完成,临时菜操作失败")
    }

  },

  // 确认信息记录
  recordConfirmationInf: function (type, value, item) {
    var that = this
    var object;
    // that.timed_refresh(1)


    switch (type) {
      case 0: //订单信息
        // 1，确认买单=等待买单、2，确认出单、3，取消订单确认、4，全单打折、5，优惠信息确认、6，已买单、7,订单信息的操作确认
        var cancelRemark = ''
        if (value == "取消订单") {
          if (that.data.cancellation != '其他原因') {
            cancelRemark = that.data.cancellation
          } else {
            cancelRemark = that.data.cancelRemark
          }
        }
        object = {
          "operator_type": type,
          "shop_id": that.data.shop_id,
          "order_id": parseInt(that.data.orderid),
          "user_id": parseInt(that.data.thisorderarry.user_id),
          "operator_id": app.globalData.staffDetail.id,
          "operator_name": app.globalData.staffDetail.name,
          "order_operator": value,
          "remark": cancelRemark,
        }
        break;
      case 1: //订单菜品信息
        // 1，膳食掌柜临时菜品下单、2，多种做法修改确认
        var dishes_item = item
        var cancelRemark = ''
        if (value == "取消菜品") {
          if (that.data.cancellation != '其他原因') {
            cancelRemark = that.data.cancellation
          } else {
            cancelRemark = that.data.cancelRemark
          }
        }
        object = {
          "operator_type": type,
          "shop_id": that.data.shop_id,
          "order_id": parseInt(that.data.orderid),
          "user_id": parseInt(that.data.user_id),
          "operator_id": app.globalData.staffDetail.id,
          "operator_name": app.globalData.staffDetail.name,
          "dishes_detailed_id": dishes_item.id,
          "dishes_id": dishes_item.dishes_id,
          "dishes_name": dishes_item.dishes_name,
          "dishes_specal_type": dishes_item.specal_type,
          "dishes_operator": value,
          "remark": cancelRemark,
        }
        break;
      case 2: // 部长反馈
        object = {
          "operator_type": type,
          "shop_id": that.data.shop_id,
          "user_id": parseInt(that.data.user_id),
          "order_id": parseInt(that.data.orderid),
          "operator_id": app.globalData.staffDetail.id,
          "operator_name": app.globalData.staffDetail.name,
          "remark": value,
        }
        break;
      case 3: // 寄存取出记录
        var dishes_item = item
        object = {
          "operator_type": 1,
          "shop_id": that.data.shop_id,
          "user_id": parseInt(that.data.user_id),
          "order_id": parseInt(that.data.orderid),
          "operator_id": app.globalData.staffDetail.id,
          "operator_name": app.globalData.staffDetail.name,
          "dishes_operator": value,
          "dishes_name": dishes_item.dishes_name,
          "dishes_id": dishes_item.dishes_id,
          "dishes_specal_type": dishes_item.specal_type,
          "dishes_detailed_id": dishes_item.id,
          "remark": '',
        }
        break;
      default:
        var package_item = item
        object = { // 套餐订单操作
          "operator_type": type,
          "shop_id": that.data.shop_id,
          "user_id": parseInt(that.data.user_id),
          "order_id": parseInt(that.data.orderid),
          "operator_id": app.globalData.staffDetail.id,
          "operator_name": app.globalData.staffDetail.name,
          "package_id": parseInt(package_item.setMealID),
          "package_name": package_item.setMealName,
          "package_operator": value,
          "package_type": parseInt(package_item.ticket_type),
          "package_detailed_id": ticket_id
        }
    }
    wx.request({
      url: app.globalData.RecordOrderConfirmationInf_url,
      data: JSON.stringify(object),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        //确认信息记录
        if (res.data == "success") {
          //确认信息记录成功
        } else {
          //确认信息记录失败
        }
      },
      complete: function (res) {
      }
    })
  },
  // 配菜转换为sideDisht形式 
  toSideDisht: function (List) {
    var sideDisht = ''
    if (List) {
      for (var i = 0; i < List.length; i++) {
        if (List[i].checked) {
          if (List[i].orderDetailedNum != '' && List[i].orderDetailedNum != 0) {
            sideDisht = sideDisht + List[i].ID + '-' + List[i].orderDetailedNum + ','
          }
        }
      }
    }
    return sideDisht;
  },
  SelectSideDish: function (sideDishSetType) { //查询配菜
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    WXAPI.getSideDish({
      sideDishSetType: sideDishSetType,
      shop_id: that.data.shop_id
    }).then(function (data) {
      if (data.result.result == 1) {
        //获取配菜
        var list = []
        list = data.object.map(item => ({
          ...item,
          checked: false,
          orderDetailedSum: 0,
          orderDetailedNum: 0
        }))
        that.setData({
          SideDishList: list
        })
        // that.reorder(data.object)
      } else {
        that.setData({
          SideDishList: []
        })
      }
      wx.hideLoading()
    }).catch(res => {
    })
  },
  //关闭菜品介绍弹窗
  closeWindow: function (e) {
    var that = this;
    var remark = that.data.dishes_remark
    var tastes = that.data.tastes
    // SideDishList
    var SideDishList = that.data.SideDishList_choose
    var cartList = that.data.cartList;
    var index = that.data.foodindex;
    //2020-12-02 常用备注
    remark = remarkJS.joinRemarkStr(that.data.quickRemark, remark);
    cartList[index].remark = remark && remark != '' ? remark : ""
    cartList[index].tastes = tastes && tastes != '' ? tastes : ""
    if (cartList[index].SideDishList != SideDishList) {
      //配菜改变
      var sideDishe_sum = 0
      for (var i = 0; i < SideDishList.length; i++) {
        if (Number(SideDishList[i].orderDetailedNum) > 0) {
          sideDishe_sum += SideDishList[i].sideDishdPrice * SideDishList[i].orderDetailedNum * 0.01
        }
      }
      if (cartList[index].dishes_spec_type == 5) {
        cartList[index].sum = Number(cartList[index].disher_weight) * cartList[index].dishes_price + sideDishe_sum
      } else {
        cartList[index].sum = cartList[index].number * cartList[index].dishes_price + sideDishe_sum
      }
      cartList[index].SideDishList = SideDishList
      cartList[index].sideDisht = that.toSideDisht(cartList[index].SideDishList)
    }

    that.mangnerCarList(cartList)
    that.setData({
      showDishesDetail: false,
      showfoodDetail: false,
      showProcessingDetail_ordering: false,
      showModalStatus3: false,
      foodprices: '', //菜品介绍价格
      SideDishList: [], //配菜
      SideDishList_choose: [],
      foodspecifications: '', //菜品介绍规格
      foodname: '',
      image: '',
      dishes_remark: '',
      textareaOpen: true,
      ch_guige: false
    })
  },
  // 不要怀疑，这就是临时菜品修改,
  temporaryChange: function (e) {
    var that = this
    // that.timed_refresh(1)

    if (that.data.order_status_end.indexOf(that.data.thisorderarry.order_status) == -1) {
      wx.showLoading({
        title: '修改中',
      })
      var tempDetail = that.data.tempItem
      //变色！
      that.setData({
        temporaryCheckedColor: true
      })
      var wanggouarrays = that.data.wanggouarray
      let remarks = ""
      let num = tempDetail.item_number
      for (var x of wanggouarrays) {
        let a = x.hailname + ": " + x.hailnum + "斤, "
        remarks += a
      }
      //修改订单详情，跟其他菜品一样，不同的是，连菜品名称都可以修改
      var godata = {
        id: tempDetail.id,
        Order_id: tempDetail.order_id,
        Shop_id: that.data.shop_id,
        item_number: that.data.tempNumber,
        operator: app.globalData.loginname,
        Item_subtotal: that.data.tempSum,
        u_item_subtotal: that.data.tempSum,
        Dishes_status: 11,
        Item_type: 3,
        Dishes_metering_type: that.data.tempUnit,
        Item_price: that.data.tempPrice,
        remarks: remarks
      }
      wx.request({ // 修改
        url: app.globalData.UpdateOrderDetailed_url,
        data: godata,
        success: function (res) {
          if (res.data.result.result == 1) {
            that.recordConfirmationInf(1, "临时菜品修改", tempDetail)
            if (remarks != tempDetail.remarks) {
              //修改菜单
              var object = {
                "dishes_id": tempDetail.id
              }
              wx.request({ //修改临时菜品的食材组成
                url: app.globalData.DeleteIngredientsByDishesId_url,
                data: JSON.stringify(object),
                header: {
                  'content-type': 'application/json'
                },
                method: 'POST',
                success: function (res) {
                  if (res.data == "success") {
                    that.addDishesMaterial(tempDetail.id)
                  }
                }
              })
            }
            wx.request({
              url: app.globalData.UpdateOrderInf_url,
              data: {
                Order_id: tempDetail.order_id,
                Shop_id: that.data.shop_id,
                dishes_count: Number(Number(that.data.thisorderarry.dishes_count) - Number(tempDetail.item_number) + Number(that.data.tempNumber))
              },
              success: function (res) {
                wx.request({
                  url: app.globalData.SynchronizedAmount_url,
                  data: {
                    order_id: tempDetail.order_id,
                  },
                  success: function (res) {
                    if (res.data.result.result == 1) {
                      //修改订单详情临时菜
                      //-------------------------------------------------
                      wx.request({
                        url: app.globalData.UpdateDishes_url,
                        data: {
                          dishes_id: tempDetail.dishes_id,
                          dishes_metering_type: that.data.tempUnit, //是 String 斤 计量类型
                          dishes_name: that.data.temporaryValue, //是 String 测试菜 菜品名称 
                          dishes_price: parseFloat(that.data.tempPrice), //是 Float 22 菜品价格
                          dishes_introduce: remarks, //否 String 测试菜 菜品介绍
                          spec_type: that.data.temp_spec_type > 1 ? 1 : that.data.temp_spec_type, //是 Int 1 规格类型
                          shop_id: that.data.shop_id, //是 Int 1 所属店铺 id
                          class_i_id: that.data.class_i_id,
                          parent_type_id: that.data.parent_id,
                          subclass_type_id: that.data.subclass_type_id, //是 Int 1 所属子类别 id
                        },
                        header: {
                          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
                        },
                        method: 'POST',
                        success: function (res) {
                          if (res.data.result.result == 1) {
                            that.redress() // 矫正金额和刷新
                            //修改菜单表临时菜
                          }
                        },
                        complete: function (res) {
                          wx.showToast({
                            title: '修改成功', //提示文字
                            duration: 3000, //显示时长
                            mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false  
                            icon: 'success', //图标，支持"success"、"loading"  
                            success: function () {
                              wx.hideLoading()
                            }, //接口调用成功
                          })
                          that.setData({
                            tempDetail: that.data.temporary[that.data.indexTemp]
                          })
                        }
                      })
                      //-------------------------------------------------
                    }
                  }
                })
              }
            })
          }
        }
      })
    } else {
      time.show_NOCANCEL_Model("订单已完成,修改临时菜品失败。")
    }
  },
  // 不要怀疑，这就是临时菜品的取消 
  temporaryDelete: function (e) {
    var that = this
    let tempDetail = that.data.tempItem
    // that.timed_refresh(1)
    wx.showModal({
      title: '提示',
      content: "是否确认删除临时菜",
      showCancel: true, //是否显示取消按钮
      confirmText: "是", //默认是“确定”
      cancelText: "否", //默认是“取消”
      cancelColor: '#519763', //取消文字的颜色
      confirmColor: '#519763', //确定文字的颜色
      success: function (res) {
        if (res.cancel) {
          //取消删除
        } else {
          wx.showLoading({
            title: '正在删除..',
          })
          wx.request({
            url: app.globalData.DeleteOrderdetailed_url,
            data: {
              id: tempDetail.id,
            },
            success: function (res) {
              if (res.data.result.result == 1) {
                //订单详情临时菜品删除成功
                wx.request({
                  url: app.globalData.DeleteDishes_url,
                  data: {
                    dishes_id: tempDetail.dishes_id,
                  },
                  success: function (res) {
                    if (res.data.result.result == 1) {
                      var object = {
                        "dishes_id": tempDetail.id
                      }
                      wx.request({ //修改临时菜品的食材组成
                        url: app.globalData.DeleteIngredientsByDishesId_url,
                        data: JSON.stringify(object),
                        header: {
                          'content-type': 'application/json'
                        },
                        method: 'POST',
                        success: function (res) {
                          if (res.data == "success") {
                            //菜单临时菜品菜品组成删除成功
                          }
                        }
                      })
                      //菜单临时菜品删除成功
                      wx.request({
                        url: app.globalData.SynchronizedAmount_url,
                        data: {
                          order_id: tempDetail.order_id
                        },
                        success: function (res) {
                          if (res.data.result.result == 1) {
                            //刷新
                            that.redress() // 矫正金额和刷新
                            that.temporaryReturn()
                          }
                        }
                      })
                    }
                  },
                })
              }
            },
            complete: function (res) {
              wx.hideLoading()
            }
          })
        }
      }
    })
  },

  discount_checked_minister: function (e) {
    var that = this;
    // that.timed_refresh(1)
    that.setData({
      discount_checked_minister: true,
    })
  },
  discount_checked_guests: function (e) {
    var that = this;
    // that.timed_refresh(1)
    that.setData({
      discount_checked_guests: true,
    })
  },
  // 输入部长打折，
  useDiscount: function (e) {
    var that = this
    // that.timed_refresh(1)
    if (e.detail.value != '') {
      var input = e.detail.value.replace(/\s*/g, "") // 去除空格
      var discount_money = that.discount(input, that.data.isDiscount)
      if (that.data.discountRecords != '') {
        if (parseFloat(input) != that.data.discountRecords.discountRate) {
          that.setData({
            discountChange: true
          })
        }
      }
      that.setData({
        discountRate: input,
        discountMoney: discount_money
      })
    } else {
      //未输入打折
    }
  },
  // 部长打折，显示价格，用于计算当前的打折优惠金额。 加入分席的概念
  discount: function (discountRate, isAll) {
    var that = this
    var caiping = that.data.dishes
    if (discountRate <= 0 || discountRate == '' || discountRate == null) {
      return 0
    }
    var discount_money = 0
    // that.timed_refresh(1)
    var discountRate = parseFloat(discountRate) >= 0 ? parseFloat(discountRate) > 10 ? 10 : parseFloat(discountRate) : 0
    discountRate = (10 - discountRate)
    if (isAll) {
      for (var x of caiping) {
        let temp = 0
        let copyNum = x.copyOrder >= 1 ? x.copyOrder : 1
        if (x.dishes_status != 11) {
          temp = x.item_subtotal != '' ? x.item_subtotal * copyNum * discountRate * 0.1 : 0
        } else {
          if (x.u_item_subtotal != '') {
            temp = x.u_item_subtotal != '' ? x.u_item_subtotal * copyNum * discountRate * 0.1 : 0
          } else {
            temp = x.item_subtotal != '' ? x.item_subtotal * copyNum * discountRate * 0.1 : 0
          }
        }
        discount_money = discount_money + temp
      }
    } else {
      for (var x of caiping) {
        let copyNum = x.copyOrder >= 1 ? x.copyOrder : 1
        var bb = 0
        if (x.dishes_discount == 1) {
          let temp = 0
          if (x.dishes_status != 11) {
            temp = x.item_subtotal != '' ? x.item_subtotal * copyNum * discountRate * 0.1 : 0
          } else {
            if (x.u_item_subtotal != '') {
              temp = x.u_item_subtotal != '' ? x.u_item_subtotal * copyNum * discountRate * 0.1 : 0
            } else {
              temp = x.item_subtotal != '' ? x.item_subtotal * copyNum * discountRate * 0.1 : 0
            }
          }
          discount_money = discount_money + temp
        } else {
          bb++
        }
        if (bb == caiping.length) {
          wx.showToast({
            title: "没有部长打折的菜品。",
            icon: 'none',
            duration: 2000,
          })
        }
      }
    }
    discount_money = discount_money.toFixed(2)
    return discount_money
  },

  // 其他费用加钱，
  addMoney: function (e) {
    var that = this
    // that.timed_refresh(1)
    if (that.data.otherRecords != '') {
      if (parseFloat(e.detail.value) != that.data.otherRecords.amountCharged) {
        that.setData({
          discountChange: true
        })
      }
    }
    that.setData({
      amount_charged: e.detail.value,
    })
  },
  // 其他费用减钱，
  reduceMoney: function (e) {
    var that = this
    // that.timed_refresh(1)
    if (that.data.otherRecords != '') {
      if (parseFloat(e.detail.value) != that.data.otherRecords.amountDeducted) {
        that.setData({
          discountChange: true
        })
      }
    }
    that.setData({
      amount_deducted: e.detail.value,
    })
  },
  // 加收服务费
  serviceCharge: function (e) {
    var that = this
    // that.timed_refresh(1)
    if (that.data.tipRecords != '') {
      if (parseFloat(e.detail.value) != that.data.tipRecords.servicefeeRate) {
        that.setData({
          discountChange: true
        })
      }
    }
    that.setData({
      serviceFeeMoney: that.data.thisorderarry.total_amount * parseFloat(e.detail.value) * 0.01,
      serviceFeeRate: e.detail.value
    })
  },
  // 本来全单打折才有确认信息记录，但是为了避免退出再进来的时候不显示打折记录，所有改成只要按了部长确认
  //部长确认打折
  useOffer: function () {
    var that = this;
    // that.timed_refresh(1)
    // if (app.globalData.levellist.indexOf("17") != -1 || app.globalData.levellist.indexOf("1") != -1) {
    //部长确认优惠信息
    that.setData({
      discount_checked_minister: true,
      needToReconfirmOffer: false,
      discountChange: false
    })
    var object = {
      shop_id: app.globalData.shopdetail.shop_id,
      order_id: parseInt(that.data.orderid),
      operator_id: 0,
      operator_name: ' ',
      // operator_id: app.globalData.staffDetail.id,
      // operator_name: app.globalData.staffDetail.name,
      order_code: parseInt(that.data.thisorderarry.order_code)
    }
    if (that.data.discountRate != '' && that.data.discountRate != null && that.data.discountRate != undefined) { //当有打折信息的时候
      object["isAllDishes"] = that.data.isDiscount ? 1 : 0;
      object["discount_rate"] = that.data.discountRate // 因为一开始后台的比率是按照0.01算的，所以现在需要乘于十
    }
    if (that.data.serviceFeeRate != '' && that.data.serviceFeeRate != null && that.data.serviceFeeRate != undefined) { //当有服务费的时候
      object["serviceFee_rate"] = that.data.serviceFeeRate
    }
    if (that.data.amount_charged != '' && that.data.amount_charged != null && that.data.amount_charged != undefined) { //当有加钱的时候
      object["amount_charged"] = that.data.amount_charged
    }
    if (that.data.amount_deducted != '' && that.data.amount_deducted != null && that.data.amount_deducted != undefined) { //当有减钱的时候
      object["amount_deducted"] = that.data.amount_deducted
    }
    wx.request({
      url: app.globalData.CalculateDiscountInformation_url,
      data: JSON.stringify(object),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.result == "success") {
          // 打折成功
          that.setData({
            discountMoney: res.data.discount_data.discount_money,
            serviceFeeMoney: res.data.discount_data.serviceFee_money, //服务费比率
            pre_money: res.data.discount_data.pre_store, //预存余额
            preferential_amount:res.data.preferential_amount, //合计增减
          })
          //确认优惠信息成功
          that.recordConfirmationInf(0, "确认优惠信息", null)
          that.redress()
        } else {
          time.show_NOCANCEL_Model("确认优惠信息,请重试")
        }
      }
    })
  },
  // 重置部长打折
  // 可能存在一些未知的逻辑错误，因为这个方法是要确认优惠信息的，但是用来重置价格。
  resetOffer: function () {
    var that = this;
    if (that.data.needToReconfirmOffer) {
      //重置优惠信息
      var object = {
        shop_id: app.globalData.shopdetail.shop_id,
        order_id: parseInt(that.data.orderid),
        operator_id: 0,
        operator_name: ' ',
        // operator_id: app.globalData.staffDetail.id,
        // operator_name: app.globalData.staffDetail.name,
        order_code: parseInt(that.data.thisorderarry.order_code)
      }
      if (that.data.discountRate != '' && that.data.discountRate != null && that.data.discountRate != undefined) { //当有打折信息的时候
        object["isAllDishes"] = that.data.isDiscount ? 1 : 0;
        object["discount_rate"] = that.data.discountRate // 因为一开始后台的比率是按照0.01算的，所以现在需要乘于十
      }
      if (that.data.serviceFeeRate != '' && that.data.serviceFeeRate != null && that.data.serviceFeeRate != undefined) { //当有服务费的时候
        object["serviceFee_rate"] = that.data.serviceFeeRate
      }
      if (that.data.amount_charged != '' && that.data.amount_charged != null && that.data.amount_charged != undefined) { //当有加钱的时候
        object["amount_charged"] = that.data.amount_charged
      }
      if (that.data.amount_deducted != '' && that.data.amount_deducted != null && that.data.amount_deducted != undefined) { //当有减钱的时候
        object["amount_deducted"] = that.data.amount_deducted
      }
      wx.request({
        url: app.globalData.CalculateDiscountInformation_url,
        data: JSON.stringify(object),
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          if (res.data.result == "success") {
            // 打折成功
            that.setData({
              discountMoney: res.data.discount_data.discount_money,
              // needToReconfirmOffer: false,
              serviceFeeMoney: res.data.discount_data.serviceFee_money, //服务费比率
              pre_money: res.data.discount_data.pre_store, //预存余额
            })
            that.getorderpayment()//重新获取一次order_payment 的数据
          }
        }
      })
    }
  },
  // 设置称重, fore和after 是用来标记���改前和修改后的重量输入，
  // 当填入参数时，不写进数据库，只有部长确认之后才会写进数据库
  setmeasurement_value: function (e) {
    // 称重数值确认，当第一次输入时，也就
    //设置称重
    var that = this;
    let name = e.currentTarget.dataset.name
    var detailItem = e.currentTarget.dataset.detailitem
    var index = e.currentTarget.dataset.index
    let item = {}
    if (name == "fore") {
      item = {
        "fore": e.detail.value,
        "after": 0,
      }
    } else if (name == "after") {
      item = {
        "fore": detailItem.measurement_value,
        "after": e.detail.value,
      }
    }
    that.data.cinput[index] = item
    // that.timed_refresh(1)
    that.setData({
      cinput: that.data.cinput
    })
  },
  // 设置称重, fore和after 是用来标记修改前和修改后的重量输入，
  // 当填入参数时，不写进数据库，只有部长确认之后才会写进数据库
  setmeasurement_single_value: function (e) {
    // 称重数值确认，当第一次输入时，也就
    var that = this;
    //设置称重
    let name = e.currentTarget.dataset.name
    var detailItem = e.currentTarget.dataset.detailitem
    var index = e.currentTarget.dataset.index
    let item = {}
    if (name == "fore") {
      item = {
        "fore": e.detail.value,
        "after": 0,
      }
    } else if (name == "after") {
      item = {
        "fore": detailItem.measurement_value,
        "after": e.detail.value,
      }
    }
    that.data.dinput[index] = item
    // that.timed_refresh(1)
    that.setData({
      dinput: that.data.dinput
    })
  },
  // 设置数量, fore和after 是用来标记修改前和修改后的数量输入，
  // 当填入参数时，不写进数据库，只有部长确认之后才会写进数据库
  setnumber_value: function (e) {
    // 称重数值确认，当第一次输入时，也就
    var that = this;
    //设置数量
    let name = e.currentTarget.dataset.name
    var index = e.currentTarget.dataset.index
    var detailItem = e.currentTarget.dataset.detailitem

    if (e.detail.value != null && e.detail.value != '') {
      let item = {}
      if (name == "fore") {
        item = {
          "fore": parseFloat(e.detail.value),
          "after": 0,
        }
      } else if (name == "after") {
        item = {
          "fore": detailItem.measurement_value,
          "after": parseFloat(e.detail.value),
        }
      }
      that.data.ninput[index] = item
      // that.timed_refresh(1)
      that.setData({
        ninput: that.data.ninput
      })
    } else {
      //无效输入
    }
  },
  setnewusercount: function (e) {
    var that = this;

    that.setData({
      renshuradiocolor: false,
      surenewusercount: false,
      setnewusercount: e.detail.value
    })
  },
  setnewusercount_buzhang: function (e) {
    var that = this;
    var num
    if (e.detail.value != '') {
      num = Number(e.detail.value)
    } else {
      num = 0
    }
    wx.request({
      url: app.globalData.UpdateOrderInf_url,
      data: {
        Order_id: that.data.orderid,
        Shop_id: that.data.shop_id,
        User_count: Number(e.detail.value),
      },
      success: function (res) {
        if (res.data.result.cause == "Update success.") {
          //部长直接点餐，直接点餐
          that.setData({
            user_count: Number(e.detail.value)
          })
          that.recordConfirmationInf(0, "确定用餐人数", null)
        } else {
          wx.showToast({
            title: "修改人数失败.",
            icon: 'none',
            duration: 2000,
          })
        }
      },
    })
  },
  setnewtableid: function (e) {
    var that = this;
    that.setData({
      setnewtableid: e.detail.value,
      hiddenupdateorders: false
    })
  },
  //获得所有大厅、包厢、桌子的信息
  getallfield: function () {
    var that = this;
    wx.request({
      url: app.globalData.GetTablesInf_url,
      data: {
        Shop_id: that.data.shop_id
      },
      success: function (res) {
        app.globalData.field = res.data.object
        var field = res.data.object
        for (var i = 0; i < field.length; i++) {
          for (var j = 0; j < field[i].tableManage.length; j++) {
            if (field[i].tableManage[j].table_id == that.data.table_id) {
              that.setData({
                fieldname: field[i].field_name
              })
            }
          }
        }
      }
    })
  },
  //获得这个用户在这店铺的所有订单 
  //用餐人数，服务员确认
  sureUserCount: function (e) {
    var that = this;
    // that.timed_refresh(1)
    var tipsusercount = that.data.setnewusercount
    if (tipsusercount == '' || tipsusercount == 'undefined' || tipsusercount == null) {
      tipsusercount = that.data.user_count
    }
    if (tipsusercount == that.data.user_count) {
      that.setData({
        renshuradiocolor: true
      })
      that.recordConfirmationInf(0, "确定用餐人数", null)
    } else {
      wx.showModal({
        // title: ' ',
        content: '是否修改人数为' + tipsusercount + "人",
        showCancel: true, //是否显示取消按钮
        confirmText: "是", //默认是“确定”
        cancelText: "否", //默认是“取消”
        cancelColor: '#519763', //取消文字的颜色
        confirmColor: '#519763', //确定文字的颜色
        success: function (res) {
          if (res.confirm) {
            //点击取消,默认隐藏弹框
            if (that.data.setnewusercount == '' ||
              that.data.setnewusercount == 'undefined' ||
              that.data.setnewusercount == null) {
              that.data.setnewusercount = that.data.user_count
            }
            wx.request({
              url: app.globalData.UpdateOrderInf_url,
              data: {
                Order_id: that.data.orderid,
                Shop_id: that.data.shop_id,
                User_count: Number(that.data.setnewusercount),
              },
              success: function (res) {
                if (res.data.result.cause == "Update success.") {
                  that.setData({
                    renshuradiocolor: true
                  })
                  that.recordConfirmationInf(0, "确定用餐人数", null)
                  that.onShow();
                }
              },
            })
          } else {
            that.setData({
              surenewusercount: false,
            })
          }
        },
        fail: function (res) { }, //接口调用失败的回调函数
        complete: function (res) { }, //接口调用结束的回调函数（调用成功、失败都会执行）
      })
    }
  },
  //获得这个用户在这店铺的所有订单
  updateorders: function (e) {
    var that = this;

    if (that.data.setnewtableid == '' || that.data.setnewtableid == 'undefined' || that.data.setnewusercount == null) {
      that.data.setnewtableid = that.data.table_id
    }
    if (that.data.setnewusercount == '' || that.data.setnewusercount == 'undefined' || that.data.setnewusercount == null) {
      that.data.setnewusercount = that.data.user_count
    }
    wx.request({
      url: app.globalData.UpdateOrderInf_url,
      data: {
        Order_id: that.data.orderid,
        Shop_id: that.data.shop_id,
        User_count: Number(that.data.setnewusercount),
        Table_id: that.data.setnewtableid,
      },
      success: function (res) {
        that.setData({
          hiddenupdateorders: true
        })

        if (res.data.result.cause == "Update success.") {
          if (that.data.renshuradiocolor) {
            that.setData({
              renshuradiocolor: false
            })
          } else {
            that.setData({
              renshuradiocolor: true
            })
          }
          time.show_NOCANCEL_Model("成功确定")
          that.onShow();
        }
      },
    })
  },
  // 监视数据是否拿到
  surveillance: function (e) {
    var that = this
    if (that.data.isSocketLind == false) {
      if (app.globalData.localSocket.readyState == 3 && app.globalData.needOpenSocket) { //当关闭的时候
        wx.showModal({
          title: '警告',
          content: "连接失败",
          confirmText: '重试',
          showCancel: false,
          success(res) {
            if (res.confirm) {
              // app.initSocket()
            }
          }
        })
      }
    }
    if (that.data.hasOrderInf == false) {
      wx.showModal({
        title: '警告',
        content: "无法获取订单详情",
        confirmText: '重试',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            that.redress() // 矫正金额和刷新
          }
        }
      })
    }
    if (that.data.hasOrderDetailed == false) {
      wx.showModal({
        title: '警告',
        content: "无法获取订单菜品详情",
        confirmText: '重试',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            that.getThisOrderDetailAndInf()
          }
        }
      })
    }
    if (that.data.hasPaymentInf == false) {
      wx.showModal({
        title: '警告',
        content: "无法获取订单账单信息",
        confirmText: '重试',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            that.getorderpayment()
          }
        }
      })
    }
    if (that.data.hasConfirmationRecord == false) {
      wx.showModal({
        title: '警告',
        content: "无法获取订单确认信息",
        confirmText: '重试',
        showCancel: false,
        success(res) {
          if (res.confirm) {
            that.getThisOrderDetailAndInf()
          }
        }
      })
    }

  },

  // 叫起和即上checkbox
  changeradio1: function (e) {
    var that = this;
    that.setData({
      index1: e.currentTarget.dataset.index
    })
  },
  //复制订单
  copyorder: function () {
    wx.navigateTo({
      url: '../module_others/pages/book/book?locationindex=1&orderid=' + that.data.orderPayment.order_id,
    })
  },
  //更换桌号
  changelocation: function (e) {
    wx.navigateTo({
      url: '../module_others/pages/book/book?locationindex=2&orderid=' + that.data.orderPayment.order_id,
    })
  },
  //请客吃饭
  treat: function () {
    wx.navigateTo({
      url: '../treat/treat?orderid=' + this.data.orderPayment.order_id,
    })
  },

  //增加主动下单菜品的数量
  addDishesDirectlyNum: function (e) {
    var that = this
    // that.timed_refresh(1)
    var number = that.data.dishesDirectlyNum
    number[that.data.currentTab][e.currentTarget.dataset.index]++
    that.setData({
      dishesDirectlyNum: number
    })
  },

  // 显示选择配菜组件
  showpeicai: function (e) {
    //2020-11-18 查询不到配菜列表
    //210220 修改判断   this.data.SideDishList.length != 0   this.data.selectDishesPC.length != 0
    if (this.data.SideDishList || this.data.SideDishList.length != 0) {
      this.setData({
        showpeicai: !this.data.showpeicai,
      })
      this.selectComponent('#sideDishList_peicai').init();
    } else {
      wx.showToast({
        icon: 'none',
        title: '没有获取配菜',
        duration: 3000
      })
    }
  },

  // 显示选择配菜组件 asdasd
  showpeicaiF: function (e) {
    if (this.data.eatMethodChooseIndex != -1 || this.data.dishes_type != 0) {
      var SelectSideDish = this.data.SelectSideDish
      var sideDishList_choose = this.data.sideDishList_choose
      var quickRemarkList = this.data.quickRemarkList
      var tasteList = this.data.tasteList
      for (var x = 0; x < SelectSideDish.length; x++) {
        SelectSideDish[x].checked = false
        SelectSideDish[x].orderDetailedSum = 0
        SelectSideDish[x].orderDetailedNum = 0
        if (sideDishList_choose != '') {
          for (var y of sideDishList_choose) {
            if (y.ID == SelectSideDish[x].ID) {
              SelectSideDish[x].checked = y.checked
              SelectSideDish[x].orderDetailedSum = y.orderDetailedSum
              SelectSideDish[x].orderDetailedNum = y.orderDetailedNum
            }
          }
        }
      }
      for (var x = 0; x < quickRemarkList.length; x++) {
        quickRemarkList[x].checked = false
        if (this.data.remarks != '') {
          if (quickRemarkList[x].value.indexOf(this.data.remarks) != -1) {
            quickRemarkList[x].checked = true
          }
        }
      }
      for (var x = 0; x < tasteList.length; x++) {
        tasteList[x].checked = false
        if (this.data.tastes != '') {
          if (this.data.tastes.indexOf(tasteList[x].value) != -1) {
            tasteList[x].checked = true
          }
        }
      }

      if (!this.data.showpeicai) {
        this.setData({
          showpeicai: !this.data.showpeicai,
          eatMethodRemark: this.data.remarks,
          eatMethodTastesRemark: this.data.tastesRemark,
          quickRemarkList: quickRemarkList,
          tasteList: tasteList,
          SelectSideDish: SelectSideDish,
        })
      } else {
        this.setData({
          showpeicai: !this.data.showpeicai
        })
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '请先选择做法',
        duration: 3000
      })
    }
  },
  //0224
  showpeicaiAndTaste: function (e) {
    var that = this;
    //2021-01-18 多规格未选择规格，不能打开配菜
    var tastes = ''
    var tasteList = app.globalData.remark_taste;
    var SideDishList = that.data.SideDishList;
    var sideDishList_choose = that.data.sideDishList_choose;
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
    that.setData({
      tasteList: tasteList,
      showpeicaiAndTaste: !this.data.showpeicaiAndTaste,
      eatMethodChooseIndex: 0
      //SideDishList: SideDishList,
    })
    this.selectComponent('#sideDishList_peicai').init();
  },

  //目前适用多拼粥用
  submitSpecAndTaste: function (event) {
    var SideDishList = event.detail.SideDishList_choose
    if (SideDishList.length != 0) {
      this.setData({
        SideDishList_choose: event.detail.SideDishList_choose,
        tastesRemark: event.detail.tastesRemark,
        tastes: event.detail.tastes,
        showpeicaiAndTaste: false,
        SideDishList: event.detail.SideDishList,
      })
      this.showGuigeMoneyAndNumber(0)
    } else {
      wx.showToast({
        icon: 'none',
        title: '没有选择配菜',
        duration: 3000
      })
    }
  },

  // 显示配菜组件 确认配菜
  submitSideDish: function (event) {
    var SideDishList = event.detail.SideDishList_choose
    if (SideDishList.length != 0) {
      this.setData({
        SideDishList_choose: SideDishList,
        SideDishList: event.detail.SideDishList,
        showpeicai: false
      })
      if (this.data.dishes.spec_type == 4) {
        this.showGuigeMoneyAndNumber(1)
      } else if (this.data.dishes.spec_type == 8 || this.data.dishes.spec_type == 2) { // 当为来料加工，区分全部位还是分部位的情况，因为分部位需要写进eatMethodArray里面
        var dishesitem = this.data.dishesitem
        var eatMethodArray = this.data.eatMethodArray
        // if (!dishesitem.isWhole) {
        var money = 0
        var methodMoney = 0
        var sideDishesMoney = 0
        for (var x of event.detail.SideDishList_choose) {
          sideDishesMoney += x.orderDetailedSum
        }
        if (this.data.dishes.weighingByLocation == 1) {
          //来料加工
          methodMoney = eatMethodArray[this.data.eatMethodChooseIndex].price * Number(eatMethodArray[this.data.eatMethodChooseIndex].number)
        } else {
          methodMoney = eatMethodArray[this.data.eatMethodChooseIndex].price
        }

        money = methodMoney + sideDishesMoney
        eatMethodArray[this.data.eatMethodChooseIndex].SideDishList = event.detail.SideDishList
        eatMethodArray[this.data.eatMethodChooseIndex].SideDishList_choose = event.detail.SideDishList_choose
        eatMethodArray[this.data.eatMethodChooseIndex].money = money

        /*}else{
          eatMethodArray[0].SideDishList = event.detail.SideDishList
          eatMethodArray[0].SideDishList_choose = event.detail.SideDishList_choose
        }*/
        this.setData({
          eatMethodArray: eatMethodArray
        })

        this.showGuigeMoneyAndNumber(1)
      } else {
        this.showGuigeMoneyAndNumber(0)
      }
    } else {
      wx.showToast({
        icon: 'none',
        title: '没有选择配菜',
        duration: 3000
      })
    }
  },

  // 显示配菜组件 确认配菜
  changeBoxNum: function (event) {
    //修改回调
    var SideDishList = event.detail.SideDishList_choose
    if (SideDishList.length != 0) {
      this.setData({
        SideDishList_choose: SideDishList,
        SideDishList: event.detail.SideDishList,
      })
    } else {
      //没有修改配菜
    }
  },
  //减少主动下单菜品的数量
  reduceDishesDirectlyNum: function (e) {
    var that = this
    // that.timed_refresh(1)
    var number = that.data.dishesDirectlyNum
    if ([e.currentTarget.dataset.index] >= 0) {
      if (number[that.data.currentTab][e.currentTarget.dataset.index] >= 1) {
        number[that.data.currentTab][e.currentTarget.dataset.index]--
        that.setData({
          dishesDirectlyNum: number
        })
      } else {
        //不能为负数
      }
    }
  },
  // 关闭主动下单菜品的页面
  closeDirectDishes: function (e) {
    this.setData({
      dishes_directly: [],
      currentTab: -1,
      showDirectDishes: false,
      showBottomBar: false
    })
    this.getActiveOrderDishes()
  },
  // 主动下单一并提交
  orderDishesDirectlyUpload: function (e) {
    var that = this
    wx.showLoading({
      title: '正在添加..',
    })
    var dishes_directly = that.data.dishes_directly
    //新增主动下单菜品
    this.dishesDirectlyUpload(dishes_directly)

    setTimeout(function () {
      wx.hideLoading()
      // that.getActiveOrderDishes()
      wx.request({ // 校验价格
        url: app.globalData.SynchronizedAmount_url,
        data: {
          order_id: that.data.orderid,
        },
        success: function (res) {
          if (res.data.result.result == 1) {
            //主动下单校价成功
            that.setData({
              needToReconfirmOffer: true
            })
          }
        },
        complete: function (res) {
          that.redress();
          that.closeDirectDishes();
          wx.showToast({
            title: '成功',
            icon: 'succes',
            duration: 500,
            mask: true
          })
        }
      })
    }, 3000);
  },
  // 同步上传所有主动菜品下单
  dishesDirectlyUpload: function (dishes_directly) {
    var that = this
    dishes_directly.map(function (dishes) {
      var dishesinf = dishes.dishesinf
      var item_subtotal = dishesinf.dishesPrice * dishes.dishesQuantity
      var dishesId = dishesinf.dishesId
      var dishesQuantity = dishes.dishesQuantity
      var item = {
        "user_id": that.data.thisorderarry.user_id, //点餐用户id
        "dishes_id": dishesId, // 菜品id
        "dishes_status": 0, //核价状态 
        "item_number": dishes.dishesQuantity, // 菜品份数
        "item_price": dishesinf.dishesPrice, //单价
        "item_subtotal": item_subtotal, //小计 
        "item_type": 4, //4  主动下单的后加标识为4
        "measurement_value": 0,
        "order_id": that.data.orderid, //订单id
        "operatorchecked": 1,
        "spec_id": 0,
        "praise_flag": 0,
        "userchecked": 2,
        "remarks": "",
        "dishes_img": dishesinf.dishesImg,
        "dishes_name": dishesinf.dishesName,
        "dishes_metering_type": dishesinf.dishesMeteringType,
        "spec_name": dishesinf.dishesMeteringType,
        "specal_type": dishesinf.specalType,
        "em_id": "0",
        "isDriving": 1,
        "initial_number": parseInt(dishes.dishesQuantity), // 初始菜品份数
        "sideDisht": '',
        "jointSet": '',
        "tastes": '',
        "freeOrder": 0,
        "repairOrder": 0,
        "copyOrder": 1,
        "waitOrder": 0,
        "baleOrder": 0,
        "transferOrder": 0,
        "depositOrder": 0,
      }
      var orderdetail = []
      orderdetail.push(item)
      wx.request({
        url: app.globalData.WriteOrderDetails_url,
        data: {
          OrderDetaileds: JSON.stringify(orderdetail)
        },
        method: "POST",
        header: {
          "Content-Type": "application/x-www-form-urlencoded"
        },
        success: function (res) {
          if (res.data.result.result == 1) {
            //详细订单改完后，因为主订单的金额与与详细订单金额总和不对应，需修改主订单与支付订单
            that.recordActiveOrder(dishesQuantity, dishesId) // 记录主动下单的记录
          }
        }
      })
    })
  },
  // 在部长直接点餐的情况下，加一份变为多出一张单  原本方法：adddishesnum
  // 暂时不用
  addDishesByStaff: function (e) {
    var that = this
    that.writeOrderDetails('', e.currentTarget.dataset.dishesitem.dishes_id, 1)
  },
  // 究极加菜方法
  // 菜品信息、菜品id、菜单份数、
  // 暂时只有单规格/多规格的菜
  writeOrderDetails: function (dishes_inf, dishes_id, number) {
    var that = this
    var dishesInf = dishes_inf
    var dishesId = dishes_id
    var subtotal = 0
    var item
    if (dishesInf == '') { // 当菜品信息为空的时候，需要去菜单拿菜品信息
      if (dishesId == '') {
        //不存在菜品
        wx.showToast({
          title: '加菜失败！',
          icon: "none"
        })
        return
      } else {
        app.globalData.menuListItem.map(function (food) {
          if (food.dishes_id == dishesId) {
            dishesInf = food
          }
        })
      }
    } else {
      if (dishesId == '') {
        dishesId = dishesInf.dishes_id
      }
    }
    if (number <= 0) {
      //份数不能为零
      wx.showToast({
        title: '加菜失败！',
        icon: "none"
      })
      return
    }
    subtotal = number * dishesInf.dishes_price
    item = {
      "user_id": that.data.thisorderarry.user_id, //点餐用户id
      "dishes_id": dishesId, // 菜品id
      "dishes_status": 0, //核价状态 
      "item_number": number, // 菜品份数
      "item_price": dishesInf.dishes_price, //单价
      "item_subtotal": subtotal, //小计 
      "item_type": 2, //2  主动下单的后加标识为2
      "measurement_value": 0,
      "order_id": that.data.orderid, //订单id
      "operatorchecked": 1,
      "spec_id": 0,
      "praise_flag": 0,
      "userchecked": 2,
      "remarks": "",
      "dishes_img": dishesInf.dishes_img,
      "dishes_name": dishesInf.dishes_name,
      "dishes_metering_type": dishesInf.dishes_metering_type,
      "spec_name": dishesInf.dishes_metering_type,
      "specal_type": dishesInf.specal_type,
      "em_id": "0",
      "isDriving": 0,
      "initial_number": parseInt(number), // 初始菜品份数
      "sideDisht": '',
      "jointSet": '',
      "tastes": '',
      "freeOrder": 0,
      "repairOrder": 0,
      "copyOrder": 1,
      "waitOrder": 0,
      "baleOrder": 0,
      "transferOrder": 0,
      "depositOrder": 0,
    }

    var orderdetail = []
    orderdetail.push(item)
    //加菜提交的数组
    wx.request({
      url: app.globalData.WriteOrderDetails_url,
      data: {
        OrderDetaileds: JSON.stringify(orderdetail)
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.result.result == 1) {
          wx.request({
            url: app.globalData.UpdateOrderInf_url,
            data: {
              Order_id: that.data.orderid,
              Shop_id: that.data.shop_id,
              dishes_count: Number(Number(that.data.thisorderarry.dishes_count) + 1)
            },
            success: function (res) {
              if (res.data.result.result == 1) {
                //加数量成功
                wx.request({
                  url: app.globalData.SynchronizedAmount_url,
                  data: {
                    order_id: that.data.orderid,
                  },
                  success: function (res) {
                    if (res.data.result.result == 1) {
                      that.redress() // 矫正金额和刷新
                      //校价成功
                    }
                  }
                })
              }
            }
          })
        } else {
          wx.showToast({
            title: '加菜失败！',
            icon: "none"
          })
        }
      }
    })
  },
  // 主动下单的新操作，先放入缓存数组，然后统一提交
  // 主动下单模块属于逻辑比较复杂的模块，以三级类别和菜品作二维数组，从数据库获取下来的菜品资料会记录未确认下单时的菜品数，部长确认之后的菜品不会直接提交到后台，需要确认下单之后才提交到后台。加减数也是临时的二维数组，当点击右上角的关闭时，会清空临时加减数组和菜品数组，起到需要确认下单的需求。
  orderDishesDirectly_new: function (e) {
    var that = this
    var dishesitem = e.currentTarget.dataset.dishesinf
    var dishesDirectlyNum = that.data.dishesDirectlyNum
    var number = dishesDirectlyNum[that.data.currentTab][e.currentTarget.dataset.index] //这个是用来拿到应该加的菜品数量
    var directList = that.data.directList
    var dishes_directly = that.data.dishes_directly
    if (number > 0) {
      var object = {
        dishesId: dishesitem.dishesId,
        dishesinf: dishesitem,
        operator: app.globalData.loginname,
        dishesFrequency: directList[that.data.currentTab][e.currentTarget.dataset.index].dishesDirectlyInf != null ? directList[that.data.currentTab][e.currentTarget.dataset.index].dishesDirectlyInf.length + 1 : 0,
        dishesQuantity: number,
        unload: 1,
      }
      dishes_directly.push(object)
      if (directList[that.data.currentTab][e.currentTarget.dataset.index].dishesDirectlyInf == null) {
        directList[that.data.currentTab][e.currentTarget.dataset.index].dishesDirectlyInf = []
      }
      directList[that.data.currentTab][e.currentTarget.dataset.index].dishesDirectlyInf.push(object)
      directList[that.data.currentTab][e.currentTarget.dataset.index].dishesDirectlySubtotal += parseInt(number) * dishesitem.dishesPrice
      dishesDirectlyNum[that.data.currentTab][e.currentTarget.dataset.index] = 0

      that.setData({
        directList: directList,
        dishes_directly: dishes_directly,
        dishesDirectlyNum: dishesDirectlyNum
      })
    } else {
      wx.showToast({
        title: '数量不能为空!',
        icon: "none"
      })
    }
  },
  //直接加数量，作用于 部长点餐用的。
  adddishesnum: function (e) {
    var that = this
    // that.timed_refresh(1)
    var dishesItem = e.currentTarget.dataset.dishesitem
    if (that.data.submit == true) {
      if (that.data.order_status_end.indexOf(that.data.thisorderarry.order_status) == -1) {
        if (dishesItem.item_type != 1 && dishesItem.item_type != 5) { //赠送和取消的情况下，不能操作
          var sum = dishesItem.item_price * (Number(dishesItem.item_number) + 1)
          var orderid = dishesItem.order_id
          //部长直接点餐，加数量
          that.setData({
            submit: false
          })
          that.showLoading()
          if (dishesItem.sideDisht != '') {
            var sideDishe_sum = 0
            var SideDishList = JSON.parse(dishesItem.sideDisht)
            for (var i = 0; i < SideDishList.length; i++) {
              if (Number(SideDishList[i].orderDetailedNum) > 0) {
                sideDishe_sum += SideDishList[i].sideDishdPrice * SideDishList[i].orderDetailedNum * 0.01
              }
            }
            sum += sideDishe_sum
          }

          var godata = {
            id: dishesItem.id,
            Order_id: orderid,
            Shop_id: that.data.shop_id,
            item_number: Number(Number(dishesItem.item_number) + 1),
            Item_subtotal: Number(sum),
            Item_type: Number(Number(dishesItem.item_number) + 1) == dishesItem.initial_number ? 0 : 2,
          }
          WXAPI.updateOrderDetailedForAll(godata).then(function (data) {
            if (data.result.result == 1) {
              WXAPI.updateOrderInfForAll({
                Order_id: that.data.orderid,
                Shop_id: that.data.shop_id,
                dishes_count: Number(Number(that.data.thisorderarry.dishes_count) + 1)
              }).then(function (data) {
                if (data.result.result == 1) {
                  WXAPI.synchronizedAmount({
                    order_id: that.data.orderid,
                  }).then(function (data) {
                    if (data.result.result == 1) {
                      that.setData({
                        needToReconfirmOffer: true
                      })
                      that.redress() // 矫正金额和刷新
                      //加数量成功
                    } else {
                      //矫正价格失败
                    }
                  }).catch(res => {
                    //矫正价格失败
                  })
                } else {
                  //修改订单价格失败
                }
              }).catch(res => {
                //修改订单价格失败
              })
            } else {
              //加份数失败
            }
          }).catch(res => {
            //修改订单价格失败
          })
        } else {
          wx.showToast({
            title: dishesItem.item_type == 1 ? '菜品已取消' : '菜品已赠送' + "，不能操作",
            mask: true,
            icon: 'none',
            duration: 2000,
          });
        }
      } else {
        time.show_NOCANCEL_Model("订单已完成,直接加数量失败")
      }
    } else {
      //不能执行过快
      return;
    }
  },

  // 减数量 部长点餐用
  reducedishesnum: function (e) {
    var that = this
    var dishesItem = e.currentTarget.dataset.dishesitem
    // that.timed_refresh(1)
    //执行减数量的操作
    if (that.data.order_status_end.indexOf(that.data.thisorderarry.order_status) == -1) {
      if (dishesItem.item_type != 1 && dishesItem.item_type != 5) { //赠送和取消的情况下，不能操作
        if ((that.data.thisorderarry.total_amount <= 0 && dishesItem.freeOrder != 1) || parseInt(dishesItem.item_number) <= 0 || that.data.submit == false) {
          //没钱就不能再减了
          return
        } else if (parseInt(dishesItem.item_number) > 1 && that.data.submit == true) { // 数量为整数
          that.setData({
            submit: false
          })
          that.showLoading()
          var sum = dishesItem.item_price * (Number(dishesItem.item_number) - 1)
          var itemtype = 0
          if (dishesItem.item_number == 1) {
            itemtype = 1
          }
          if (dishesItem.sideDisht != '') {
            var sideDishe_sum = 0
            var SideDishList = JSON.parse(dishesItem.sideDisht)
            for (var i = 0; i < SideDishList.length; i++) {
              if (Number(SideDishList[i].orderDetailedNum) > 0) {
                sideDishe_sum += SideDishList[i].sideDishdPrice * SideDishList[i].orderDetailedNum * 0.01
              }
            }
            sum += sideDishe_sum
          }
          var godata
          if (dishesItem.item_number - 1 == 0) { // 取消
            //第一种减法
            godata = {
              id: dishesItem.id,
              Order_id: dishesItem.order_id,
              Shop_id: that.data.shop_id,
              item_number: Number(Number(dishesItem.item_number) - 1),
              operator: app.globalData.loginname,
              Item_subtotal: 0,
              Item_type: itemtype,
              Dishes_status: 3
            }
          } else { // 一般来说 称重菜品和计件菜品不存在减数量方法，于是就不存在特殊状态
            //当菜品不为一的减法
            godata = {
              id: dishesItem.id,
              Order_id: dishesItem.order_id,
              operator: app.globalData.loginname,
              Shop_id: that.data.shop_id,
              item_number: Number(Number(dishesItem.item_number) - 1),
              Item_subtotal: Number(sum),
              operatorchecked: 0,
              Item_type: itemtype,
              Dishes_status: 0,
            }
          }
          //提交的参数
          wx.request({
            url: app.globalData.UpdateOrderDetailed_url,
            data: godata,
            success: function (res) {
              if (res.data.result.result == 1) {
                wx.request({
                  url: app.globalData.UpdateOrderInf_url,
                  data: {
                    Order_id: that.data.orderid,
                    Shop_id: that.data.shop_id,
                    dishes_count: Number(Number(that.data.thisorderarry.dishes_count) - 1)
                  },
                  success: function (res) {
                    if (res.data.result.result == 1) {
                      wx.request({
                        url: app.globalData.SynchronizedAmount_url,
                        data: {
                          order_id: that.data.orderid,
                        },
                        success: function (res) {
                          if (res.data.result.result == 1) {
                            that.setData({
                              needToReconfirmOffer: true
                            })
                            that.redress() // 矫正金额和刷新
                            //减数量成功
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
          //不能执行过快
          return
        }
      } else {
        wx.showToast({
          title: dishesItem.item_type == 1 ? '菜品已取消' : '菜品已赠送' + "，不能操作",
          mask: true,
          icon: 'none',
          duration: 2000,
        });
      }
    } else {
      wx.showModal({
        title: '提示',
        content: '订单已完成,直接减数量失败。',
        showCancel: false, //是否显示允许按钮
        success: function (res) { }
      })
    }
  },
 

  //查询打折信息
  selectDiscountInformationByOrderId: function (e) {
    var that = this
    var object = {
      "order_id": that.data.orderid,
    }
    wx.request({
      url: app.globalData.SelectDiscountInformationByOrderId_url,
      data: JSON.stringify(object),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data.result = "success") {
          if (res.data.object != null && res.data.object != "") {
            var customerNeekCheck = false

            if (res.data.object.discountRecords != null && res.data.object.discountRecords != '' && res.data.object.discountRecords[0] != undefined) { //有打折信息
              that.setData({
                discountMoney: res.data.object.discountRecords[0].amountDeducted,
                discountRate: res.data.object.discountRecords[0].discountRate,
                isDiscount: res.data.object.discountRecords[0].isalldishes == 1,
                discountRecords: res.data.object.discountRecords[0]
              })
            }
            if (res.data.object.otherRecords != null && res.data.object.otherRecords != '') { //有其他费用信息
              if (res.data.object.otherRecords[0].amountCharged > 0) {
                //存在其他费用加收
                customerNeekCheck = true
              }
              that.setData({
                amount_charged: res.data.object.otherRecords[0].amountCharged,
                amount_deducted: res.data.object.otherRecords[0].amountDeducted,
                otherRecords: res.data.object.otherRecords[0]
              })
            }
            if (res.data.object.tipRecords != null && res.data.object.tipRecords != '') { //有服务费信息
              if (res.data.object.tipRecords[0].amountCharged > 0) {
                //存在其他费用加收
                customerNeekCheck = true
              }
              that.setData({
                serviceFeeRate: res.data.object.tipRecords[0].servicefeeRate,
                serviceFeeMoney: res.data.object.tipRecords[0].amountCharged,
                tipRecords: res.data.object.tipRecords[0]
              })
            }
            that.setData({ // 部长直接点餐的情况下不需要客人确认加收的金额
              customerNeekCheck: customerNeekCheck,
              preferential_amount:res.data.object.paymentRecord.preferentialAmount.toFixed(2),
              jiangrandTotal: res.data.object.paymentRecord.grandTotal,
            })
          }
        }
      }
    })
  },
  // 获取该订单的orderinf 信息
  getThisOrderInf: function (order_id) {
    var that = this;
    wx.request({      
      url: app.globalData.getOrderInfoByOrderId,
      data: {
        orderId: order_id
      },
      success: function (res) {
        if (res.data.result.result == 1) {
          if(res.data.object.order_equipment_type == 4 || res.data.object.order_equipment_type == 7){
            that.setData({
              xdfs: false
            })
          }
          //获取整张单的信息
          var order_remark = remarkJS.splitRemarkStr(res.data.object.order_remark, 1);
          var order_quick_remark = remarkJS.splitRemarkStr(res.data.object.order_remark, 0);
          if (that.data.firstIssue == 1) {
            //从来料加工过来
            order_remark = app.globalData.Order_remark;
            order_quick_remark = app.globalData.Order_quick_remark;
          }
          that.setData({
            thisorderarry: res.data.object,
            Order_remark: order_remark,
            Order_quick_remark: order_quick_remark,
            paymethod: res.data.object.paymethod,
            allBiaoDan: res.data.object.all_free_order == 1,
            allBuDan: res.data.object.all_repair_order == 1,
            allJiaoQi: res.data.object.all_wait_order == 1,
            allJiShang: res.data.object.all_wait_order == 0,
            allJiaJi: res.data.object.all_wait_order == 2,
            allDaBao: res.data.object.all_bale_order == 1,
            allFenXi: res.data.object.copyOrderNum > 1,
            copyOrderNum: res.data.object.copyOrderNum,
            hasOrderInf: true,
            customerNeekCheck: res.data.object.help_order == 2 ? false : that.data.customerNeekCheck,
            calueStoredSelected: res.data.object.isAdvanceDeposit == 0,
            PDSelected: res.data.object.isAdvance == 1,
            VIPPayLogin: res.data.object.isPayPW == 1,
            VipUsed: res.data.object.isCancelVipPay == 1
          },()=>{
            that.getDiscountList()
            // if(res.data.object.isAdvanceDeposit == 0) that.initVip()
            that.showPrice()
            if(that.getThisOrderInfCB){
              that.getThisOrderInfCB(true)
            }
          })
          that.advanceDeposit()
        } else {
          that.setData({
            hasOrderInf: false
          })
        }
        if (that.data.eat) {
          that.toCheck()
        }
        if (that.data.guidelink) {
          that.toCheck()
        }
        // that.getVouchers()
        that.getOtherVouchers()
      },
      fail: function (res) {
        that.setData({
          hasOrderInf: false
        })
      },
      complete: function (res) {
        that.selectOrderConfirmationInfByOrderID(that.data.thisorderarry)
        that.setData({
          submit: true
        })
      }
    })
  },
  //获取支付订单
  getorderpayment: function () {
    var that = this
    wx.request({
      url: app.globalData.GetOrderPaymentInf_url,
      data: {
        Order_id: that.data.orderid
      },
      success: function (res) {
        if (res.data.result.cause == "Select success.") {
            let orderPayment = res.data.object[0]
            if(res.data.object[0].actual_total > that.data.orderPayment.actual_total){
              orderPayment.actual_total = that.data.orderPayment.actual_total
            }
         

          that.setData({
            orderPayment: orderPayment,
            hasPaymentInf: true
          })
        } else {
          that.setData({
            hasPaymentInf: false
          })
        }

        if(that.data.vipPhone || that.data.vipCard){
          wx.request({
            // url: 'http://localhost:8081/evaluation/getOrderPayment',
            url:app.globalData.getOrderPayment,
            data:{orderId:that.data.orderid},
            success: res =>{
              let orderPayment = that.data.orderPayment
              if(res.data.code == 1 && res.data.params.actual_total > 0){
                orderPayment.actual_total = res.data.params.actual_total
              }
              that.setData({
                isVipPay:false,
                orderPayment
              })
            }
          })
      
        }
      },
      fail: function (res) {
        that.setData({
          hasPaymentInf: false
        })
      }
    })
  },
  // 获取主动下单的菜品和记录
  getActiveOrderDishes: function () {
    var that = this
    var object = {
      "shop_id": that.data.shop_id,
      "level": that.data.level,
      "order_id": that.data.orderid
    }
    wx.request({
      url: app.globalData.selectActiveOrderDishes_url,
      data: JSON.stringify(object),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data != '') {
          var arrayLists = res.data
          var name = []
          var dishesDirectlyNum = [];
          for (var x of arrayLists) {
            name.push({
              text: x[0].typeName
            })
            var temp = []
            for (var a = 0; a < x.length; a++) {
              temp.push(0)
            }
            dishesDirectlyNum.push(temp)
          }
          that.setData({
            directList: arrayLists,
            dishesDirectlyNum: dishesDirectlyNum,
            navData: name
          })
        }
      },
      fail: function (res) {
      },
      complete: function (res) {
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this
    this.supercall = this.selectComponent("#supercall");
    if (app.globalData.countDown_minister) { this.countDown(0) } else {
      clearInterval(this.data.timerb);
      this.setData({fackyousevencolor:"https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",shineb: true})
      this.stopFlash()
      app.globalData.countDown_minister = false
    }
    if (app.globalData.countDown_waiter) { this.countDown(1) } else {
      clearInterval(this.data.timerf);
      this.setData({fackyousevencolor1:"https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",shinef: true})
      this.stopFlash1()
      app.globalData.countDown_waiter = false
    }
  },
  callBZ: function (){
    let that = this
    if (app.globalData.countDown_minister) {
      wx.showToast({
        title: '已取消呼叫',
        icon: 'success',
        duration: 1000
      })
      clearInterval(that.data.timerb);
      that.setData({fackyousevencolor:"https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",shineb: true})
      that.stopFlash()
      app.globalData.countDown_minister = false
      app.globalData.RMQmsg_id = ''
      return;
    }
    app.globalData.RMQmsg_id = app.spawnUUID()
    RMQV3.sendRabbitMQMsg({
      msg_id: app.globalData.RMQmsg_id,
      from_user:app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
      msg: {
        type: 'call',
        text: '客人呼叫部长'
      },
      table_name:app.globalData.locationname,
      table_id:app.globalData.locationid,
      tg:"bz",
      shop_id:app.globalData.shopid,
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
          app.globalData.cbz = setInterval(res=>{
            that.cbz()
          },2000)
          setTimeout(res=>{
            if (app.globalData.cbz != ''){
              wx.showToast({
                title: '网络异常或当前无部长在线',
                icon: 'none'
              })
              clearInterval(app.globalData.cbz)
              clearInterval(that.data.timerb);
              that.setData({fackyousevencolor:"https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",shineb: true})
              that.stopFlash()
              app.globalData.countDown_minister = false
              app.globalData.RMQmsg_id = ''
            }
          },6000)
        }
      }
    })
  },
  cbz: function () {
    if (app.globalData.RMQmsg_id == '') {
      clearInterval(app.globalData.cbz)
      app.globalData.cbz = ''
      return;
    }
    RMQV3.sendRabbitMQMsg({
      msg_id: app.globalData.RMQmsg_id,
      from_user:app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
      msg: {
        type: 'call',
        text: '客人呼叫部长'
      },
      table_name:app.globalData.locationname,
      table_id:app.globalData.locationid,
      tg:"bz",
      shop_id:app.globalData.shopid,
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
      from_user:app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
      msg: {
        type: 'call',
        text: '客人呼叫服务员'
      },
      table_name:app.globalData.locationname,
      table_id:app.globalData.locationid,
      tg:"fw",
      shop_id:app.globalData.shopid,
      back: res => {}
    })
  },
  callFWY: function (){
    let that = this
    if (app.globalData.countDown_waiter) {
      wx.showToast({
        title: '已取消呼叫',
        icon: 'success',
        duration: 1000
      })
      clearInterval(that.data.timerf);
      that.setData({fackyousevencolor:"https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",shinef: true})
      that.stopFlash1()
      app.globalData.countDown_waiter = false
      app.globalData.RMQmsg_id = ''
      return;
    }
    app.globalData.RMQmsg_id = app.spawnUUID()
    RMQV3.sendRabbitMQMsg({
      msg_id: app.globalData.RMQmsg_id,
      from_user:app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
      msg: {
        type: 'call',
        text: '客人呼叫服务员'
      },
      table_name:app.globalData.locationname,
      table_id:app.globalData.locationid,
      tg:"fw",
      shop_id:app.globalData.shopid,
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
          app.globalData.cfw = setInterval(res=>{
            that.cfw()
          },2000)
          setTimeout(res=>{
            if (app.globalData.cfw != ''){
              wx.showToast({
                title: '网络异常或当前无服务员在线',
                icon: 'none'
              })
              clearInterval(app.globalData.cfw)
              clearInterval(that.data.timerf);
              that.setData({fackyousevencolor:"https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",shinef: true})
              that.stopFlash1()
              app.globalData.countDown_waiter = false
              app.globalData.RMQmsg_id = ''
            }
          },6000)
        }
      }
    })
  },
  startFlash: function(){this.supercall.startFlash()},
  stopFlash: function () {this.supercall.stopFlash()},
  startFlash1: function(){this.supercall.startFlash1()},
  stopFlash1: function () {this.supercall.stopFlash1()},
  countDown: function (res) {
    var that = this
    var countDownNum = 10000
    if (res == 0 && app.globalData.countDown_minister == true) {
      that.startFlash()
    }else if (res == 1 && app.globalData.countDown_waiter == true){
      that.startFlash1()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      shineb:true,
      shinef:true
    })
    app.getCustomerInfo(app.globalData.openid)
    wx.createSelectorQuery().select('.top').boundingClientRect(function (rect) {
      that.setData({
        fixTop: rect.top,
      })
    }).exec()
    that.getheight()
    app.globalData.jump = false
    if (!that.data.readyToOrder && !that.data.readyToAddMeals) {
      // that.redress()
      //刷新成功
      that.getThisOrderInf(that.data.orderid) //获得该订单信息
      that.selectDiscountInformationByOrderId()
      that.getThisOrderDetailAndInf()
      that.getorderpayment()
      that.resetOffer() //重置优惠信息
      
    }
    if(that.data.orderid){
      wx.request({
        url: app.globalData.getOrderLike_url,
        data:{
          "shopId": app.globalData.shopdetail.shop_id,
          "orderId": that.data.orderid
        }, method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        success: res=>{
          console.log(res.data)
          let flag = res.data
          let point_index = that.data.point_index
          for(let i = 0 ; i< res.data.length;i++){
            if(res.data[i].praise_flag == 1){
              point_index[i] = 1
            }
          }
          this.setData({point_index})
        }
      })
    }
    that.getShopSetUp()
    app.globalData.spcallback = (bool) => {
      if (app.globalData.countDown_minister) {
        wx.showToast({
          title: '已取消呼叫',
          icon: 'success',
          duration: 1000
        })
        clearInterval(that.data.timerb);
        that.setData({fackyousevencolor:"https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",shineb: true})
        that.stopFlash()
        app.globalData.countDown_minister = false
        app.globalData.RMQmsg_id = ''
        return;
      }else if (app.globalData.countDown_waiter) {
        wx.showToast({
          title: '已取消呼叫',
          icon: 'success',
          duration: 1000
        })
        that.setData({shinef: true})
        that.stopFlash1()
        app.globalData.countDown_waiter = false
        app.globalData.RMQmsg_id = ''
        return;
      }
    }
    app.globalData.RMQCallBack = (res) => {
      console.log('收到消息',res)
      let msg = res.data
      console.log(msg,"消息内容")
      let a = new Date()
      if(msg.table_id == app.globalData.locationid){
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
            that.setData({shineb: true})
            that.stopFlash()
            app.globalData.countDown_minister = false
            app.globalData.RMQmsg_id = ''
          }
        }else if (msg.tg == "fw" && msg.msg_id == app.globalData.RMQmsg_id) {
          clearInterval(app.globalData.cfw)
          app.globalData.cfw = ''
          if (msg.msg.text == "服务员收到") {
            console.log("fwwwwwwwwwwwwww");
            // wx.showToast({
            //   title: '服务员收到',
            //   icon: 'success',
            //   duration: 2000
            // })
            that.setData({shinef: true})
            that.stopFlash1()
            app.globalData.countDown_waiter = false
            app.globalData.RMQmsg_id = ''
          }
        }
      } 
    }
  },
  //使用优惠券 ：设置当前优惠券所在行颜色为绿色
  useVouchers(){
    let that = this
    let vouchersInfo = this.data.vouchersInfo
    let vouchersIndex = this.data.vouchersIndex
    vouchersInfo[vouchersIndex].color = '#00dd00'
    this.setData({
      vouchersInfo: vouchersInfo
    }, () => {
      wx.showToast({
        title: '使用成功！',
      })
    })
    

    // let data = {
    //   id:vouchersInfo[vouchersIndex].management_coupons_uuid,
    //   is_write_off: 2
    // }

    // wx.request({
    //   url: app.globalData.applyVouponUse,
    //   data:data,
    //   success:res =>{
    //     if (res.data.code == '1') {
    //       that.refresh()
    //       RMQV3.sendRabbitMQMsg({
    //         msg_id: 'SSZGSSZGSSZGSSZGSSZGSSZGSSZ'+app.globalData.caustomerId,
    //         from_user:app.globalData.hj + "_qgqc_" + app.globalData.caustomerId,
    //         msg: {
    //           type: 'refresh',
    //           text: '刷新'
    //         },
    //         table_name:app.globalData.locationname,
    //         table_id:app.globalData.locationid,
    //         tg:"bz",
    //         shop_id:app.globalData.shopid,
    //         back: res => {
    //           console.log(res);
    //         }
    //       })
    //     }
    //     // console.log(that.data.orderPayment.actual_total)
    //     // console.log(vouchersInfo[vouchersIndex].denomination)
    //     // console.log(that.data.orderPayment.actual_total - vouchersInfo[vouchersIndex].denomination)
    //     // if (res.data.code == '1') {
    //     //   let a = that.data.orderPayment
    //     //   a.actual_total == a.actual_total - vouchersInfo[vouchersIndex].denomination
    //     //   that.setData({
    //     //     isVouchersUsed: true,
    //     //     orderPayment: a,
    //     //     denomination: vouchersInfo[vouchersIndex].denomination
    //     //   })
    //     //   that.refresh()
    //     // }
    //   }
    // })
  },
  getOtherVouchers(){
    let that = this
    console.log(that.data.thisorderarry)
    wx.request({
      url: app.globalData.getOtherVouchersInfo,
      data:{
        shopId: app.globalData.shopid,
      },
      success(res){
        wx.request({
          url: app.globalData.getOtherVouchersUsed,
          data: {
            orderId: that.data.thisorderarry.order_id,
            shopId: app.globalData.shopid,
          },
          header: {
            'content-type': 'application/json' // 默认值
          },
          method: 'POST',
          success(res2){
            let a = res.data.paramsList
            let b = res2.data.paramsList
            let c = []
            for (let i = 0; i < a.length; i++) {
              for (let j = 0; j < b.length; j++) {
                if (b[j].multi_coupon_set_id == a[i].id) {
                  let d = a[i]
                  d.count = b[j].useNumber
                  d.management_coupons_uuid_four = d.id.substring(d.id.length - 4,d.id.length)
                  c.push(d)
                  let e = that.data.denomination
                  e = e + b[c].denomination
                  that.setData({
                    denomination: e,
                  })
                }
              }
            }
            that.setData({
              otherVouchersInfo: c
            })
          }
        })
      }
    })
  },
  // getVouchers(){
  //   let that = this
  //   console.log(that.data.thisorderarry)
  //   wx.request({
  //     url: app.globalData.getVouchersInfo,
  //     data:{
  //       shopId: app.globalData.shopid,
  //       phone: that.data.thisorderarry.phone_num
  //     },
  //     success(res){
  //       let b = res.data.object
  //       let d = []
  //       for (let c = 0 ; c < b.length ; c++) {
  //         b[c].management_coupons_uuid_four = b[c].management_coupons_uuid.substring(b[c].management_coupons_uuid.length - 4,b[c].management_coupons_uuid.length)
  //         if (b[c].is_write_off == 1) {
  //           if (b[c].order_id == that.data.thisorderarry.order_id) {
  //             b[c].color = '#fcaf17'
  //             // let a = that.data.orderPayment
  //             // a.actual_total == a.actual_total - b[c].denomination
  //             let e = that.data.denomination
  //             e = e + b[c].denomination
  //             that.setData({
  //               denomination: e,
  //             })
  //             d.push(b[c])
  //           }
  //         }else if (b[c].is_write_off == 2){
  //           b[c].color = '#00dd00'
  //           d.push(b[c])
  //         }else{
  //           d.push(b[c])
  //         }
  //       }
  //       that.setData({
  //         vouchersInfo: d
  //       })
  //     }
  //   })
  // },
  //获取店铺设置
  getShopSetUp(){
  let that = this
  wx.request({
    url: app.globalData.GetShopSetUp_Url,
    data: {
      shop_id: app.globalData.shopdetail.shop_id,
    },
    success:res=>{
      console.log(res.data.object[0].normalServingTime,'上菜时间');
      that.setData({
        reminderIntervalTime: res.data.object[0].reminderTime,
        normalServingTime: res.data.object[0].normalServingTime
      })
      console.log(that.data.thisorderarry.dinner_time,"用餐时间");
      if(UtilJS.timeDifferenceByMinute (that.data.thisorderarry.dinner_time,UtilJS.formatTime()) > res.data.object[0].normalServingTime){
        console.log("可以催单");
        that.setData({
          fullReminder: true
        })
      }
    }
  })
},


  // 备注模板
  remark_normal: function (e) {
    var that = this

    that.setData({
      dishes_remark: that.data.dishes_remark + e.currentTarget.dataset.remark
    })
  },
  //回应顾客呼叫，呼叫提醒
  selectCallEmployeeRecord: function (e) {
    var that = this
    var object = {
      "operatorId": app.globalData.staffDetail.id
    }
    wx.request({
      url: app.globalData.CallEmployeeRecordsOnCalling_url,
      data: JSON.stringify(object),
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data != null) {
          //呼叫提醒
          if (res.data != null && res.data != '') {
            that.setData({
              callRecord: res.data[0],
              callRecords: res.data,
              numberOfCalling: res.data.length,
              showCallRecords: true
            })
            app.globalData.callRecord = res.data[0]
            app.globalData.callRecords = res.data
            app.globalData.numberOfCalling = res.data.length
          } else {
            app.globalData.needMusic = false
            that.setData({
              callRecord: '',
              callRecords: '',
              numberOfCalling: 0,
              showCallRecords: false
            })
            app.globalData.callRecord = 0
            app.globalData.callRecords = 0
            app.globalData.numberOfCalling = 0
          }
        }
      }
    })
  },
  //确认呼叫提醒
  sureRecords: function (e) {
    var that = this
    app.globalData.hiddenvieww = false

    if (that.data.callRecord.callType == 0) {
      //跳转订单呼叫
      app.globalData.callOrderCode = that.data.callRecord.orderCode
      that.setData({
        showCallRecords: false
      })
      wx.navigateTo({
        url: '../orders/orders',
      })
    } else {
      var object = {
        "recode_id": that.data.callRecord.id,
        "operator": app.globalData.staffDetail.name,
        "operator_id": app.globalData.staffDetail.id,
        "operator_type": app.globalData.staffDetail.position
      }
      wx.request({
        url: app.globalData.AnswerCallWithoutOrder_url,
        data: JSON.stringify(object),
        method: "POST",
        header: {
          "Content-Type": "application/json"
        },
        success: function (res) {
          if (res.data == "success") {
            that.responseMessageForCalling(that.data.callRecord.unionId)
            that.selectCallEmployeeRecord()
          }
        },
      })
    }
  },

  // 回应顾客呼叫，作用于让用户的呼叫
  responseMessageForCalling: function (unionid) {
    var that = this
    var user
    if (app.globalData.level == 2) { //部长回应
      user = "部长"
    } else {
      user = "服务员"
    }
    wx.sendSocketMessage({
      data: JSON.stringify({
        //验证代码 固定服务器分发带盐加密
        "systemcall": "toClient",
        //发送的用户组,
        "users": app.globalData.level == 2 ? "bz" : "fw",
        // 呼叫的类型
        "type": "recallCustomer",
        // 呼叫的店铺
        "shopid": app.globalData.shopdetail.shop_id,
        // 回应的用户unionID
        "unionid": unionid,
        // 自定义参数内容
        "msg": JSON.stringify({
          msg: user + "回应呼叫",
          unionid: unionid,
          tg: "response" ///呼叫
        })
      }),
      success: function () {
        //回应信息成功
      }
    })
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
  },
  showLoading: function () {
    var that = this
    //开弹幕
    wx.showToast({
      title: '修改中',
      mask: true,
      icon: 'loading',
      duration: 2500,
      complete: function () {
        that.setData({
          submit: true
        })
      },
    });
  },

  applyChangeOrderInf: function (e) {
    var that = this
    wx.showModal({
      // title: ' ',
      content: '是否允许修改订单',
      showCancel: true, //是否显示允许按钮
      confirmText: "是", //默认是“确定”
      cancelText: "否", //默认是“取消”
      cancelColor: '#519763', //取消文字的颜色
      confirmColor: '#519763', //确定文字的颜色
      success: function (res) {
        if (res.cancel) {
          //点击取消,默认隐藏弹框
          wx.request({
            url: app.globalData.UpdateOrderInf_url,
            data: {
              Order_id: that.data.orderid,
              Shop_id: that.data.shop_id,
              change_order_status: 3
            },
            success: function (res) {
              if (res.data.result.result == 1) {
                //不允许修改
              }

            }
          })
        } else {
          //点击确定
          wx.request({
            url: app.globalData.UpdateOrderInf_url,
            data: {
              Order_id: that.data.orderid,
              Shop_id: that.data.shop_id,
              change_order_status: 1
            },
            success: function (res) {
              if (res.data.result.result == 1) {
                //允许修改
              }
            }
          })
        }
      },
      fail: function (res) { }, //接口调用失败的回调函数
      complete: function (res) {
        that.redress() // 矫正金额和刷新
      }, //接口调用结束的回调函数（调用成功、失败都会执行）
    })

  },

  selectInfo: function (e) {
    var that = this
    var item_number = null
    var measurement_value = null
    var dishes = null
    if (e.currentTarget.dataset.measurement_value != undefined) {
      measurement_value = e.currentTarget.dataset.measurement_value
    }
    if (e.currentTarget.dataset.item_number != undefined) {
      item_number = e.currentTarget.dataset.item_number.replace(",", " ~ ")
    }
    if (e.currentTarget.dataset.dishesid != undefined) {
      app.globalData.menuListItem.map(function (menu) {
        if (e.currentTarget.dataset.dishesid == menu.dishes_id) {
          dishes = menu
        }
      })
    }
    if (dishes != null) {
      var dishes_statu = dishes.dishes_statu
      var spec_type = dishes.spec_type
      if (dishes_statu == 1) {
        if (spec_type == 0) {
          that.setData({
            showModalStatus1: !that.data.showModalStatus1
          })
        } else if (spec_type == 1) {
          wx.request({
            url: app.globalData.SelectEatingMethod_url,
            data: {
              dishes_id: e.currentTarget.dataset.dishesid
            },
            success: function (res) {
              if (res.data.result.result == 1) {
                var max = 4 //  原本是0
                var em_basicarry = []
                for (var i = 0; i < res.data.object.length; i++) {
                  if (max < res.data.object[i].count) {
                    max = res.data.object[i].count
                  }
                }
                for (var i = 0; i < max; i++) {
                  em_basicarry.push(-1)
                }
                that.setData({
                  em_arry: res.data.object,
                  changeweightdishes_flag: false,
                  em_index: em_basicarry,
                  em_basicarry: em_basicarry
                })
              } else {
                if (e.currentTarget.dataset.weighing == 0) {
                  that.setData({
                    showModalStatus: !that.data.showModalStatus,
                  })
                } else {
                  that.setData({
                    changeweightdishes_flag: false,
                    showModalStatus1: !that.data.showModalStatus1,
                  })
                }
              }
            },
          })
          wx.request({
            url: app.globalData.GetDishesSpec_url,
            data: {
              Dishes_id: e.currentTarget.dataset.dishesid
            },
            success: function (res) {
              var arry = res.data.object
              that.setData({
                dishesSpecArry: arry,
                dishes: dishes,
                item_number: item_number,
                measurement_value: measurement_value
              })
            }
          })
        }
      }
    } else {
      that.setData({
        changeweightdishes_flag: false,
        showDirectPiece_ordering: false,
        showDirectEatMenthod_ordering: false,
        showEatAndSpec_ordering: false,
        cookwayindex: -1,
        u_cookwayindex: -1,
        cookway: "",
        u_cookway: "",
        inputvalue: "",
        inputvalue1: ""
      })
    }
  },

  // 直接点餐，详情关闭   
  selectInfo_directy(e) {
    var index = e.currentTarget.dataset.index
    var that = this
    that.setData({
      dishes: this.data.dishes,
      showDirectEatMenthod_ordering: false,
      showPieceDetail_ordering: false,
      showDirectPiece_ordering: false,
      showEatAndSpec_ordering: false,
      showProcessingDetail_ordering: false,
      SideDishList: [],
      inputvalue: '',
      inputvalue1: '',
      weight_image: '',
      result_em: true,
      result_en: true,
      textareaOpen: true,
      sum_position: 0,
      dishes_introduce: ''
    })
  },
  //获取屏幕高度
  getheight: function (res) {
    var that = this
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    that.setData({
      windowHeight: windowHeight,
      windowWidth: windowWidth,
      leftscroll: windowHeight - 41.2 - 80 - 40,
      listmenu: windowHeight - 45,
      pop_window: windowHeight * 0.7,
      pop_window_for: windowHeight * 0.7 - 80 - 40 - 70 - 25 - 80
    })
  },

  //弹窗-称重
  selectInfo1: function (e) {
    var that = this;
    that.setData({
      showModalStatus1: false,
      showModalStatus2: false,
      showProcessingDetail: false,
      isModifiedDetail: false,
      sum: '',
      showProcessingDetailHasOrder: false,
    })
  },

  //弹窗-单规格多做法
  closeSingleMultiple: function (e) {
    var that = this;
    that.setData({
      showSingleMultiple: !that.data.showSingleMultiple,
      isModifiedDetail: false,
      sum: ''
    })
  },

  //弹窗-单规格多做法
  closeProcessingDetail: function (e) {
    var that = this;
    that.setData({
      showProcessingDetail: !that.data.showProcessingDetail,
      isModifiedDetail: false,
      sum: ''
    })
  },

  //弹窗-订单详情
  opendetail: function (e) {
    var that = this
    var detailItem = e.currentTarget.dataset.item
    var index = e.currentTarget.dataset.index
    var weight_image_arry = []
    var hasSideDish = false
    var SideDishList = []
    var SideDishList_choose = []
    var eatMethodArray = []
    var tastesRemark = ""
    var isWhole = true;
    var remarkStr = JSON.parse(JSON.stringify(detailItem.remarks));
    var quickRemark = '';
    var dishes = that.getDishesInf(detailItem.dishes_id)
    that.getEatMethod(detailItem.dishes_id) //获取吃法
    tastesRemark = that.tastesRemark(detailItem.tastes)
    that.selectEatmethodAndSpec(detailItem.dishes_id)
    if (detailItem.dishes_status == 11 && detailItem.u_em_id != '' && detailItem.u_em_id != null && detailItem.u_em_id != 0 && detailItem.u_em_id != '0') {
      eatMethodArray = JSON.parse(detailItem.u_em_id)
      if (eatMethodArray[0].em_name == '全部位') {
        isWhole = true
      } else {
        isWhole = false
      }
    } else {
      if (typeof (detailItem.em_id) === "string") {
        eatMethodArray = JSON.parse(detailItem.em_id);
      } else if(detailItem.em_id){
        eatMethodArray = detailItem.em_id;
      }

      if ((eatMethodArray.length&&eatMethodArray[0].em_name == '全部位')||(detailItem.lstOrderEmBlockEating.length&&detailItem.lstOrderEmBlockEating[0].em_block_name=='全部位')) {
        isWhole = true
      } else {
        isWhole = false
      }
    }
    if (detailItem.weigh_img != null && detailItem.spec_type != 8 && detailItem.spec_type != 2) {
      var result1 = detailItem.weigh_img.includes(",")
      if (result1) {
        weight_image_arry = detailItem.weigh_img.split(",")
      } else {
        weight_image_arry.push(detailItem.weigh_img)
      }
    }
    if (detailItem.spec_type == 8 || detailItem.spec_type == 2) { //来料加工的数组少了单价和数量，这里加上
      if (eatMethodArray[0].em_name == '全部位') { } else {
        for (var x = 0; x < eatMethodArray.length; x++) {
          if (eatMethodArray[x].SideDishList_choose != null && eatMethodArray[x].SideDishList_choose != "") {
            if (eatMethodArray[x].SideDishList_choose.length != 0) {
              hasSideDish = true;
            }
          }
        }
      }
    }
    that.setData({
      index2: index,
      dishes: dishes,
      isWhole: isWhole,
      weight_image: weight_image_arry,
      detailItem: e.currentTarget.dataset.item,
      specialType: e.currentTarget.dataset.specialtype,
      tastesRemark: hasSideDish ? '' : tastesRemark,
      eatMethodArray: eatMethodArray,
    })
    //2020-12-25 称重多做法跟来料加工一样
    if (detailItem.spec_id == 1 && detailItem.spec_type != 4 && detailItem.dishes_spec_type != 8 && detailItem.spec_type != 8 && detailItem.spec_type != 10 && detailItem.spec_type != 2) {
      if (detailItem.sideDisht != '' && dishes.sideDishes != 0) {
        SideDishList = JSON.parse(detailItem.sideDisht)
        for (var i = 0; i < SideDishList.length; i++) {
          if (Number(SideDishList[i].orderDetailedNum) > 0) {
            SideDishList[i].orderDetailedSum = SideDishList[i].sideDishdPrice * SideDishList[i].orderDetailedNum * 0.01
            SideDishList[i].checked = true
          } else {
            SideDishList[i].orderDetailedSum = 0
            SideDishList[i].checked = false
          }
        }
      }
      that.setData({
        SideDishList: SideDishList,
        showModalStatus1: !that.data.showModalStatus1,
      })

      if (detailItem.dishes_status == 10 || detailItem.dishes_status == 11 || detailItem.dishes_status == 12) {
        that.setData({
          isModifiedDetail: true
        })
      }
    } else if (detailItem.spec_id == 1 && detailItem.spec_type == 4) { //单规格多做法
      that.setData({
        showSingleMultiple: !that.data.showSingleMultiple,
      })
      if (detailItem.dishes_status == 10 || detailItem.dishes_status == 11 || detailItem.dishes_status == 12) {
        that.setData({
          isModifiedDetail: true
        })
      }
    }else if (detailItem.spec_type == 10) {
      let eatMethodArray = []
      let eat ={
        eating_method:detailItem.eating_method,
        dishesSpec:{
          spec_name:detailItem.dishes_metering_type,
          vip_price:detailItem.vip_price,
          inline_price:detailItem.inline_price,
          spec_price:detailItem.item_price,
        },
        Number:detailItem.item_number
      }
      eatMethodArray.push(eat)
      
      quickRemark = remarkJS.splitRemarkStr(remarkStr, 0);
      remarkStr = remarkJS.splitRemarkStr(remarkStr, 1);
      
      if (dishes.sideDishes != 0 && detailItem.sideDisht != '') {
        SideDishList_choose = []
        SideDishList_choose = detailItem.lstOrderSideDish
        // SideDishList = JSON.parse(detailItem.sideDisht)
        // for (var i = 0; i < SideDishList.length; i++) {
        //   if (Number(SideDishList[i].orderDetailedNum) > 0) {
        //     SideDishList[i].orderDetailedSum = SideDishList[i].sideDishdPrice * SideDishList[i].orderDetailedNum * 0.01
        //     SideDishList[i].checked = true
        //     SideDishList_choose.push(SideDishList[i])
        //   } else {
        //     SideDishList[i].orderDetailedSum = 0
        //     SideDishList[i].checked = false
        //   }
        // }
        hasSideDish = true
      }
      else if (dishes.sideDishes != 0 && hasSideDish == true) {
        // SideDishList = detailItem.em_id;
      }
      else {
        hasSideDish = false
      }
      that.setData({
        eatMethodArray:eatMethodArray,
        showModalStatus2: !that.data.showModalStatus2,
        SideDishList: SideDishList,
        hasSideDish: hasSideDish,
        SideDishList_choose: SideDishList_choose,
        //quickRemark:detailItem.em_id[0].quickRemark
        "detailItem.remarks": remarkStr,
        quickRemark: quickRemark
      })
    } else if (detailItem.spec_id == 1&&detailItem.dishes_spec_type != 8 && detailItem.spec_type != 8) { //单规格多做法
      that.setData({
        showModalStatus2: !that.data.showModalStatus2,
      })
    }
    //来料加工直接出单之后，这里的逻辑是硬加上去的
    else if (detailItem.dishes_spec_type == 8 || detailItem.dishes_spec_type == 2) {//下单详情走这里与上面注释不符
      if (eatMethodArray.length != 0) {
        SideDishList = eatMethodArray[0].SideDishList;
        if (SideDishList != null && SideDishList.length != 0) {
          hasSideDish = true;
        }
        that.formatTaste(eatMethodArray[0].tastes);
        that.formatSideDishList(eatMethodArray[0].SideDishList, dishes.sideDishes);
        remarkStr = remarkJS.splitRemarkStr(eatMethodArray[0].remarks, 1);
        quickRemark = remarkJS.splitRemarkStr(eatMethodArray[0].remarks, 0);
      } else {
        remarkStr = remarkJS.splitRemarkStr(remarkStr, 1);
        quickRemark = remarkJS.splitRemarkStr(remarkStr, 0);
      }
      that.formatTaste(eatMethodArray[0].tastes);
      that.setData({
        eatMethodChooseIndex: hasSideDish ? 0 : -1,
        SideDishList: SideDishList,
        hasSideDish: hasSideDish,
        shrinkIntrIntroduction: hasSideDish,
        showProcessingDetailHasOrder: !that.data.showProcessingDetailHasOrder,//下单详情
        "detailItem.remarks": remarkStr,
        "detailItem.quickRemark": quickRemark,
      })
    }
  },
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

  tapStyleCheckbox: function (e) {
    
    const obj = {}
    let list = this.data.listData
    list.forEach(item => {
      obj[item.value] = item.checked
    })
    let {value, checked} = e.currentTarget.dataset.item
    console.log(value, checked);
    checked = !checked
    console.log(obj);
    if(checked) {
      if(value=='即上' || value=='叫起' || value=='加急') {
        obj['即上'] = obj['叫起'] = obj['加急'] = false
      }else if(value=='标单'||value=='赠送') {
        obj['标单'] = obj['赠送'] = false
      }else if(value=='分席' || value=='不分席') {
        obj['分席'] = obj['不分席'] = false
      }else if(value=='先出单'){
        
      }else {
  
      }
      obj[value] = true
    }else {
      obj[value] = false
    }
    list.forEach(item => {
      item.checked = obj[item.value]
    })
    
    this.setData({
      listData: list
    })
    
    var that = this
    var listData = that.data.listData
    var idx = e.currentTarget.dataset.idx
    if (e.currentTarget.dataset.item.value == "赠送" && listData[idx].checked) {
      //2020-11-18 下单前可以赠送 TODO 计件/称重菜品没判断
      if (that.data.detailsType == 1) {
        //下单前操作
        listData[idx].checked = true
        that.setData({
          listData: listData,
          showPresentation: true,
          qitayuanyin1: false
        })
      } else {
        // 部长赠送菜品
        let foodItem = that.data.bidDetailitem.length == 0 ? that.data.cart_item : that.data.bidDetailitem
        // that.timed_refresh(1)

        if (foodItem.item_type != 1) { //不是退餐的情况下
          var flag = true
          //计件/称重菜品需要先部长确认称重之后，才能赠送，避免赠送之后再确认混淆价格
          if (foodItem.spec_type == 2 || foodItem.spec_type == 3 || foodItem.spec_type == 5 || foodItem.spec_type == 6) {
            if (foodItem.operatorchecked != 1) {
              flag = false
            }
          }
          if (flag) {
            listData[idx].checked = true
            that.setData({
              listData: listData,
              showPresentation: true,
              freeFoodItem: foodItem,
              freeDishRemark: '',
              qitayuanyin1: false
            })
          } else {
            time.show_NOCANCEL_Model("称重/计件菜品需要确认称重才能赠送")
          }
        } else {
          time.show_NOCANCEL_Model("菜品已取消，无法赠送")
        }
      }
    }

   
  },

  // 做法菜品规格
  dishesdecs(dishes_id, cookway, u_cookway) {
    var that = this
    wx.request({
      url: app.globalData.GetDishesSpec_url,
      data: {
        Dishes_id: dishes_id
      },
      success: function (res) {
        if (res.data.result.result == 1) {
          var arry = res.data.object
          if (u_cookway != '' || u_cookway != null || u_cookway != undefined) {
            for (var i = 0; i < arry.length; i++) {
              if (arry[i].spec_name == u_cookway) {
                that.setData({
                  u_cookwayindex: i,
                  u_cookway: "(" + u_cookway + ")"
                })
                break
              }
            }
          }
          for (var i = 0; i < arry.length; i++) {
            if (arry[i].spec_name == cookway) {
              that.setData({
                cookwayindex: i,
                cookway: "(" + cookway + ")"
              })
              break
            }
          }
          that.setData({
            dishesSpecArry: arry,
          })
        } else {
          //获取做法失败
        }
      }
    })
  },
  // 称重菜品的总金额，方便
  sum_money: function (price, measurement_value, em_id) {
    var sum = 0
    var num = parseFloat(price) * parseFloat(measurement_value)
    var other = 0
    var jsonData = JSON.parse(em_id);
    for (var x of jsonData) {
      other += parseFloat(x.money)
    }
    sum = num + other
    return sum;
  },

  //吃法菜品规格
  eatmethod: function (detailItem) {
    var that = this
    //查询多种吃法
    wx.request({
      url: app.globalData.SelectEatingMethod_url,
      data: {
        dishes_id: detailItem.dishes_id
      },
      success: function (res) {
        if (res.data.result.result == 1) {
          //详情获取吃法成功
          var em_arry = res.data.object
          var u_em_arry = res.data.object
          var em_id = detailItem.em_id
          var u_em_id = detailItem.u_em_id
          var em_id_json = JSON.parse(em_id)
          var index2 = [] //正常
          var index3 = [] //修改
          for (var x in em_arry) {
            for (var y = 0; y < em_arry[x].length; y++) {
              em_arry[x][y].checked = false
              for (var z = 0; z < em_id_json.length; z++) {
                if (em_arry[x][y].id == em_id_json[z].id) {
                  em_arry[x][y].checked = true
                }
              }
              index2.push(em_arry[x][y])
            }
          }

          if (u_em_id != '' && u_em_id != 0 && u_em_id != '0') {
            //存在修改后吃法
            var u_em_ids = JSON.parse(u_em_id)
            for (var x in u_em_arry) {
              for (var y = 0; y < u_em_arry[x].length; y++) {
                u_em_arry[x][y].checked = false
                for (var z = 0; z < u_em_ids.length; z++) {
                  if (u_em_arry[x][y].id == u_em_ids[z].id) {
                    u_em_arry[x][y].checked = true
                  }
                }
                index3.push(u_em_arry[x][y])
              }
            }
            that.setData({
              u_em_arry: index3,
            })
          }
          that.setData({
            em_arry: index2,
          })
        } else {
          //获取吃法失败
        }
      }
    })
  },
  // 查看大图
  showweightimage(e) {
    var image = e.currentTarget.dataset.image
    var image_arry = this.data.weight_image
    wx.previewImage({
      current: image, // 当前显示图片的http链接
      urls: image_arry // 需要预览的图片http链接列表
    })
  },

  // 下拉刷新
  refresh: function () {
    var that = this
    wx.stopPullDownRefresh();
    that.redress() // 矫正金额和刷新
    that.getDepositList(false) //刷新寄存
    wx.request({
      url:app.globalData.selectOrderVipInfo,
      data:{
        orderId:this.data.orderid,
        shopId:this.data.shop_id
      },
      method:"GET",
      async:false,
      success: res => {
        if(res.statusCode == 200){
          let vipPhone = res.data[0]
          let vipCard = res.data[1]
          if(!vipPhone || vipPhone==0){
            vipPhone=""
          }
          if(!vipCard || vipCard==0){
            vipCard=""
          }
          that.setData({
            vipPhone,
            vipCard
          })
          let params={
            shopId:app.globalData.shopid,
            orderId:this.data.orderid,
            phone:vipPhone,
            vipCard:vipCard
          }
          // wx.request({
          //   url:app.globalData.getShopPreferentidInfo,
          //   data:params,
          //   method: 'POST',
          //   header: {
          //     'content-type': 'application/json'
          //   },
          //   success: resp =>{
          //     var nPD = this.data.nPD
          //     var isSuper = this.data.isSuper
          //     var calueStored = this.data.calueStored
          //     var vipCheck = this.data.vipCheck
          //     var member_level = this.data.member_level
          //     var calueStoredSelected = this.data.calueStoredSelected
          //     if(resp.data && resp.data.data.is_state){
          //       vipCheck = false
          //     }
          //     let orderPayment = this.data.orderPayment
          //     if(resp.data.data){
          //       orderPayment.actual_total = resp.data.data.actual_total
          //       isSuper = true
          //       calueStored = resp.data.data
          //       calueStoredSelected = true
          //       vipCheck = false
          //     }else {
          //       nPD = res.data
          //     }
          //     this.setData({
          //       member_level,
          //       nPD,
          //       calueStored,
          //       isSuper,
          //       calueStoredSelected: calueStoredSelected,
          //       PDSelected: !calueStoredSelected,
          //       vipCheck:vipCheck,
          //       orderPayment,
          //       VIPPayLogin: that.data.thisorderarry.isPayPW == 1
          //     })
          //   }
          // })
        }
      }
    })
    wx.showToast({
      title: '刷新成功',
      icon: 'success',
      duration: 1500,
    })
  },
  // 显示临时菜品
  showTemporaryDishes: function () {
    var that = this
    // if (app.globalData.levellist.indexOf("22") != -1 || app.globalData.levellist.indexOf("1") != -1) {
    that.selectTempDishesSC()
    for (var x in that.data.specs) {
      that.data.specs[x].checked = false
    }
    if (!that.data.readyToAddMeals && !that.data.readyToOrder) {
      that.setData({
        tempDetail: '',
        tempUnit: '份',
        wanggouarray: [],
        tempPrice: '',
        tempNumber: '',
        tempSum: '',
        tempValue: '',
        hideScroll: true,
        bindSource: [],
        isTemp: false,
        indexFirst: 0, //选择的下拉列表下标
        indexSecond: 0, //选择的下拉列表下标
        indexThird: 0, //选择的下拉列表下标
        temp_operator: '', //临时菜品用，操作人，就为了临时菜品下单或者是修改的时候的时候，显示一下操作人和时间
        temp_operation_time: '', //临时菜品用，操作时间
        showTemporaryDishes: !that.data.showTemporaryDishes,
        showTemporaryDishesDetail: false
      })
    } else {
      that.setData({
        tempDetail: '',
        tempUnit: '份',
        wanggouarray: [],
        tempPrice: '',
        tempNumber: '',
        tempSum: '',
        tempValue: '',
        hideScroll: true,
        bindSource: [],
        isTemp: false,
        indexFirst: 0, //选择的下拉列表下标
        indexSecond: 0, //选择的下拉列表下标
        indexThird: 0, //选择的下拉列表下标
        temp_operator: '', //临时菜品用，操作人，就为了临时菜品下单或者是修改的时候的时候，显示一下操作人和时间
        temp_operation_time: '', //临时菜品用，操作时间
        showTemporaryDishesDirecty: !that.data.showTemporaryDishesDirecty,
        showTemporaryDishesDetailDirecty: false
      })
    }
  },
  isModifiedDetail: function (res) {
    //显示修改
    let self = this
    if (self.data.isModifiedDetail) {
      self.setData({
        isModifiedDetail: false
      });
    } else {
      self.setData({
        showModalStatus1: true,
        isModifiedDetail: true
      });
    }
  },
  // 给订单信息加上确认记录
  selectOrderConfirmationInfByOrderID: function (thisorderarry) {
    var that = this
    if (thisorderarry != '') {
      thisorderarry.allCheck = []
      var object = {
        "order_id": thisorderarry.order_id
      }
      wx.request({
        url: app.globalData.selectOrderConfirmationInfByOrderID_url,
        data: JSON.stringify(object),
        header: {
          'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          if (res.data != null) {
            var infList = res.data
            //我觉得可以
            for (var x in infList) {
              if (infList[x].operatorType == 0) {
                if (infList[x].orderOperator == "等待买单") {
                  thisorderarry.allCheck = infList[x]
                  //确认信息有
                  that.setData({
                    thisorderarry: thisorderarry,
                  })
                }
                if (infList[x].orderOperator == "确认优惠信息") {
                  //有确认优惠信息
                  that.setData({
                    isDiscountInf: infList[x],
                    discount_checked_minister: true,
                  })
                }
                if (infList[x].orderOperator == "全单打折") {
                  //全单打折
                  that.setData({
                    isAllDiscountInf: infList[x],
                    isDiscount: true
                  })
                }
                //2020-11-13
                if (infList[x].orderOperator == "确定用餐人数" || infList[x].orderOperator == "直接点餐") {
                  //确定用餐人数 || 直接点餐
                  that.setData({
                    renshuradiocolor: true
                  })
                }
                if (infList[x].orderOperator == "客人确认其他费用") {
                  //客人确认其他费用
                  that.setData({
                    customerCheckOther: true
                  })
                }
                //2020-11-30 显示取消订单的操作人 操作时间
                if (infList[x].orderOperator == "取消订单") {
                  that.setData({
                    "thisorderarry.cancelStr": "[" + infList[x].operatorName + "]",
                    "thisorderarry.cancelStr_Time": infList[x].createTime
                  })
                }
              }
              if (infList[x].operatorType == 2) {
                //反馈信息有
                that.setData({
                  feedbackInf: infList[x]
                })
              }
            }
            that.setData({
              infList: infList
            },()=>{
              console.log(that.data.xdfs,'========================xdfs=============================');
              console.log(app.globalData.managementData);

              if(!that.data.xdfs){
                if(app.globalData.managementData.is_minister_confirm == 1){
                  that.setData({
                    isMinisterConfirm: false
                  },()=>{
                    for(let item of that.data.infList){
                      if(item.orderOperator == '确认出单'){
                        that.setData({
                          isMinisterConfirm: true
                        })
                        break;
                      }
                    }
                  })
                }
              }else{
                that.setData({
                  isMinisterConfirm: false
                },()=>{
                  for(let item of that.data.infList){
                    if(item.orderOperator == '确认出单'){
                      that.setData({
                        isMinisterConfirm: true
                      })
                      break;
                    }
                  }
                })
              }
            })
          }
        },
        complete: function () { }
      })
    }
  },
  // 这个是称重/计件菜品专用的允许修改，避免修改重量、预计重量和做法的混乱.实际上就是订单余额和订单状态的修改
  // ps:为了避免金额上的混乱，以及电子称的混乱，同意修改不再核实价格
  // pps:同意修改的情况下，可能要顺便修改价格，不然的话，用户可能不会用
  isAllow_out: function (e) {
    var that = this

    wx.showLoading({
      title: '正在操作',
    })

    var index = e.currentTarget.dataset.index
    var detailitem = that.data.detailItem

    if (index == '1') {
      // 仅仅是修改了菜品的状态，不再核实价格，避免价格混乱
      // 需要重新确认菜品,
      //允许修改
      var input
      if (that.data.specialType == '1') { //称重
        //称重菜品
        input = that.data.cinput[that.data.index2] != null ? that.data.cinput[that.data.index2].after : null
      } else if (that.data.specialType == '2') { //计件
        input = that.data.ninput[that.data.index2] != null ? that.data.ninput[that.data.index2].after : null
      }

      if (input != '' && input != 0 && input != null && input == undefined) {
        var em_id
        var other = 0 //额外的钱
        var original = detailitem.measurement_value * detailitem.item_price //材料钱

        if (detailitem.u_em_id != null && detailitem.u_em_id != '' && detailitem.u_em_id != undefined && detailitem.u_em_id != "0") {
          em_id = JSON.parse(detailitem.u_em_id)
        } else {
          em_id = JSON.parse(detailitem.em_id)
        }
        other = 0 //加收重置
        for (var x of em_id) {
          other += x.money
        }
        var subtotal = original + other
        var godata = {
          id: detailitem.id, // 详单 id
          Order_id: detailitem.order_id, // 订单 id
          Shop_id: that.data.shop_id, // 店铺 id
          Dishes_status: 11,
          Item_type: 3,
          operator: app.globalData.loginname,
          u_item_subtotal: subtotal
        }
        wx.request({
          url: app.globalData.UpdateOrderDetailed_url,
          data: godata,
          success: function (res) {
            if (res.data.result.result == 1) {
              wx.request({
                url: app.globalData.SynchronizedAmount_url,
                data: {
                  order_id: detailitem.order_id,
                },
                success: function (res) {
                  if (res.data.result.result == 1) {
                    that.redress() // 矫正金额和刷新
                    that.recordConfirmationInf(1, "多种做法修改", detailitem)

                    that.setData({
                      showModalStatus1: false,
                      isModifiedDetail: false
                    });
                    //同意修改并计算价格
                  }
                }
              })
            }
          },
          complete: function (res) {
            wx.hideLoading()
          }
        })
      } else { // 不修改金额，只通过状态
        wx.request({
          url: app.globalData.UpdateOrderDetailed_url,
          data: {
            id: detailitem.id, // 详单 id
            Order_id: detailitem.order_id, // 订单 id
            Shop_id: that.data.shop_id, // 店铺 id
            Dishes_status: 11,
            Item_type: 3,
            operator: app.globalData.loginname,
            operatorchecked: 0 // 菜品回到未确认的状态
          },
          success: function (res) {
            if (res.data.result.result == 1) {
              that.redress() // 矫正金额和刷新
              that.recordConfirmationInf(1, "多种做法修改", detailitem)
              that.setData({
                showModalStatus1: false,
                isModifiedDetail: false
              });
              //同意修改不计算价格
            }
          },
          complete: function (res) {
            wx.hideLoading()
          }
        })
      }
    } else if (index == '2') {
      //不能修改
      //拒绝修改不需要重新确认菜单
      wx.request({
        url: app.globalData.UpdateOrderDetailed_url,
        data: {
          id: detailitem.id, // 详单 id
          Order_id: detailitem.order_id, // 订单 id
          Shop_id: that.data.shop_id, // 店铺 id
          operator: app.globalData.loginname,
          Dishes_status: 12, //不能修改
        },
        success: function (res) {
          if (res.data.result.result == 1) {
            //已拒绝修改
            that.recordConfirmationInf(1, "多种做法修改", detailitem)
            that.redress()
            that.setData({
              showModalStatus1: false,
              isModifiedDetail: false
            });
          }
        },
        complete: function (res) {
          wx.hideLoading()
        }
      })
    }
  },
  // 这个是称重单规格特有的允许修改
  isAllow_single: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var detailitem = e.currentTarget.dataset.item
    // that.timed_refresh(1)
    wx.showModal({
      title: '申请修改',
      content: '是否允许修改',
      cancelText: '否',
      confirmText: '是',
      success(res) {
        wx.showLoading({
          title: '正在操作',
        })
        if (res.cancel) {
          // 用户点击了取消属性的按钮，对应选择了'否'
          // that.refuse(e)
          //拒绝申请修改
          that.setData({
            submit: false
          })
          if (detailitem.dishes_status == 10) {
            //拒绝修改
            // 核价状态：不需核价-0、未核价-1、已核价-2
            wx.request({
              url: app.globalData.UpdateOrderDetailed_url,
              data: {
                id: detailitem.id,
                Order_id: detailitem.order_id,
                Shop_id: that.data.shop_id,
                operator: app.globalData.loginname,
                Dishes_status: 12,
              },
              success: function (res) {
                wx.request({
                  url: app.globalData.SynchronizedAmount_url,
                  data: {
                    order_id: detailitem.order_id,
                  },
                  success: function (res) {
                    if (res.data.result.result == 1) {
                      that.recordConfirmationInf(1, "多种做法修改", detailitem)
                      that.redress() // 矫正金额和刷新
                    }
                  },
                  complete: function (res) {
                    wx.hideLoading()
                  }
                })
              }
            })
          }
        } else if (res.confirm) {
          wx.request({
            url: app.globalData.UpdateOrderDetailed_url,
            data: {
              id: detailitem.id,
              Order_id: detailitem.order_id,
              Shop_id: that.data.shop_id,
              operatorchecked: 0, //未确认
              operator: app.globalData.loginname,
              Item_type: 3,
              Dishes_status: 11
            },
            success: function (res) {
              if (res.data.result.result == 1) {
                that.recordConfirmationInf(1, "多种做法修改", detailitem)
                that.redress() // 矫正金额和刷新
              }
            },
            complete: function (res) {
              wx.hideLoading()
            }
          })
        }
      }
    })
  },
  selectIngredients: function (e) {
    let self = this
    var value = e.detail.value
    value = value.replace(/\s*/g, "")
    var ingredients = self.data.ingredients
    var ingredientsTemp = ingredients
    var a = []
    if (value != '' && value != null) {
      for (var x = 0; x < ingredients.length; x++) {
        if (ingredients[x].indexOf(value) >= 0) {
          a.push(ingredients[x])
        }
      }
      if (a.length > 0) {
        self.setData({
          ingredientsTemp: a
        })
      } else {
        self.setData({
          ingredientsTemp: []
        })
      }
    } else {
      self.ingredients()
    }
  },
  // 搜索店铺食材
  ingredients: function (e) {
    //搜索店铺食材
    let self = this
    var object = {
      "shopId": self.data.shop_id
    }
    wx.request({
      url: app.globalData.SelectIngredients_url,
      method: 'POST',
      data: JSON.stringify(object),
      header: {
        //设置参数内容类型为x-www-form-urlencoded
        'content-type': 'application/json',
      },
      success: function (res) {
        if (res.data != '') {
          //搜索店铺食材成功
          let ingredients = []
          for (var x of res.data) {
            ingredients.push(x.scname)
          }
          self.setData({
            ingredient: res.data,
            ingredients: ingredients,
            ingredientsTemp: ingredients
          })
        } else {
          //搜索不到店铺食材
        }
      }
    })
  },
  // 点击下拉显示框
  selectTap(e) {
    let index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    if (index == '1') {
      this.setData({
        selectShowFirst: !this.data.selectShowFirst
      });
    } else if (index == '2') {
      this.setData({
        selectShowSecond: !this.data.selectShowSecond
      });
    } else if (index == '3') {
      this.setData({
        selectShowThird: !this.data.selectShowThird
      });
    }
  },
  // 点击下拉列表
  optionTap: function (e) {
    var that = this
    let index = e.currentTarget.dataset.index; //获取点击的下拉列表的下标
    let num = e.currentTarget.dataset.num; //获取点击的下拉列表的下标
    var selectDataFirsts = that.data.selectDataFirsts;
    var selectDataSeconds = that.data.selectDataSeconds;
    var selectDataThirds = that.data.selectDataThirds;
    var selectDataFirst = that.data.selectDataFirsts;
    var selectDataSecond = that.data.selectDataSeconds;
    var selectDataThird = that.data.selectDataThirds;
    let a = []
    let b = []
    let c = []

    if (num == '1') {
      let class_i_id = e.currentTarget.dataset.class_i_id
      for (var x of selectDataSecond) {
        if (x.class_type == class_i_id) {
          b.push(x)
          for (var y of selectDataThird) {
            if (y.parent_id == x.parent_type_id) {
              c.push(y)
            }
          }
        }
      }
      let subclass_type_id = c[Object.keys(c)[0]].subclass_type_id
      let parent_id = b[Object.keys(b)[0]].parent_type_id

      that.setData({
        indexFirst: index,
        selectDataSecond: b,
        selectDataThird: c,
        class_i_id: class_i_id,
        parent_id: parent_id,
        subclass_type_id: subclass_type_id,
        selectShowFirst: !that.data.selectShowFirst
      });

    } else if (num == '2') {
      let class_type = e.currentTarget.dataset.class_type
      let parent_type_id = e.currentTarget.dataset.parent_type_id
      for (var y of selectDataThird) {
        if (y.parent_id == parent_type_id) {
          c.push(y)
        }
      }

      let subclass_type_id = c[Object.keys(c)[0]].subclass_type_id

      that.setData({
        indexSecond: index,
        selectDataThird: c,
        class_i_id: class_type,
        parent_id: parent_type_id,
        subclass_type_id: subclass_type_id,
        selectShowSecond: !that.data.selectShowSecond
      });
    } else if (num == '3') { // 有个坑，不选的话，可能会报错
      let subclass_type_id = e.currentTarget.dataset.subclass_type_id

      that.setData({
        indexThird: index,
        // class_i_id: class_type,
        // parent_id: parent_type_id,
        subclass_type_id: subclass_type_id,
        selectShowThird: !that.data.selectShowThird
      });
    }
  },

  showTempDishesSC: function (tempDetail) {
    var that = this

    if (tempDetail != null) {
      var selectDataFirsts = that.data.selectDataFirsts;
      var selectDataSeconds = that.data.selectDataSeconds;
      var selectDataThirds = that.data.selectDataThirds;

      var class_i_id = tempDetail.class_i_id;
      var parent_type_id = tempDetail.parent_type_id;
      var subclass_type_id = tempDetail.subclass_type_id;

      let indexFirst = 0; //选择的下拉列表下标
      let indexSecond = 0; //选择的下拉列表下标
      let indexThird = 0; //选择的下拉列表下标

      for (var x = 0; x < selectDataFirsts.length; x++) {
        if (class_i_id == selectDataFirsts[x].class_i_id) {
          indexFirst = x;
        }
      }
      for (var x = 0; x < selectDataSeconds.length; x++) {
        if (parent_type_id == selectDataSeconds[x].parent_type_id && class_i_id == selectDataSeconds[x].class_type) {
          indexSecond = x;
        }
      }
      for (var x = 0; x < selectDataThirds.length; x++) {
        if (subclass_type_id == selectDataThirds[x].subclass_type_id &&
          parent_type_id == selectDataThirds[x].parent_id) {
          indexThird = x;
        }
      }
      that.setData({
        class_i_id: class_i_id,
        parent_id: parent_type_id,
        subclass_type_id: subclass_type_id,
        indexFirst: indexFirst,
        indexSecond: indexSecond,
        indexThird: indexThird,
      })
    }
  },

  selectTempDishesSC: function () {
    var that = this

    wx.request({
      url: app.globalData.SelectDishesIC_url,
      data: {
        shop_id: that.data.shop_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          selectDataFirst: res.data.object,
          selectDataFirsts: res.data.object,
          class_i_id: res.data.object[0].class_i_id
        })
      }
    })

    wx.request({
      url: app.globalData.SelectDishesPC_url,
      data: {
        shop_id: that.data.shop_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          selectDataSecond: res.data.object,
          selectDataSeconds: res.data.object,
          parent_id: res.data.object[0].parent_type_id
        })
      }
    })

    wx.request({
      url: app.globalData.SelectDishesSC_url,
      data: {
        shop_id: that.data.shop_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      success: function (res) {
        // let subclass_type_id = res.data.object[0].subclass_type_id
        that.setData({
          selectDataThird: res.data.object,
          selectDataThirds: res.data.object,
          subclass_type_id: res.data.object[0].subclass_type_id,
        })
      }
    })
  },

  //当键盘输入时，触发input事件
  bindinput: function (e) {
    //用户实时输入值
    let self = this
    var prefix = e.detail.value
    //匹配的结果
    var newSource = []
    var adapterSource = []

    prefix = prefix.replace(/\s*/g, "");
    // let value = e.detail.value
    if (prefix != "") {
      wx.request({
        url: app.globalData.GetTempSDishes_url,
        method: 'POST',
        data: {
          shop_id: self.data.shop_id,
          dishes_name: prefix
        },
        header: {
          //设置参数内容类型为x-www-form-urlencoded
          'content-type': 'application/x-www-form-urlencoded',
        },
        success: function (res) {
          let y = res.data.object

          if (y != null && y != '') {
            for (var x of y) {
              adapterSource.push(x)
            }
            // 对于数组array进行遍历，功能函数中的参数 `e`就是遍历时的数组元素值。
            adapterSource.forEach(function (e) {
              // 用户输入的字符串如果在数组中某个元素中出现，将该元素存到newSource中
              if (e.dishes_name.indexOf(prefix) != -1) {
                newSource.push(e)
              }
            })

            // 如果匹配结果存在，那么将其返回，相反则返回空数组
            if (newSource.length != 0) {
              self.setData({
                // 匹配结果存在，显示自动联想词下拉列表
                hideScroll: false,
                bindSource: newSource,
                arrayHeight: newSource.length * 71
              })
            } else {
              self.setData({
                // 匹配无结果，不现实下拉列表
                hideScroll: true,
                bindSource: []
              })
            }
          } else {
            self.setData({
              // 匹配无结果，不现实下拉列表
              hideScroll: true,
              bindSource: [],
              isTemp: false
            })
          }
          self.setData({
            temporaryDishes: y
          })

          if (self.data.tempDetail) {

            if (prefix != self.data.tempDetail.dishes_name) {
              self.setData({
                tempDetail: '',
                isTemp: false
              })
            }
          }
        }
      })
    } else {
      self.setData({
        // 匹配无结果，不现实下拉列表
        hideScroll: true,
        bindSource: []
      })
    }
    self.setData({
      temporaryValue: prefix,
    })
  },

  // 用户点击选择某个联想字符串时，获取该联想词，并清空提醒联想词数组
  // 当点击已有菜品时，自动读取详情
  itemtap: function (e) {
    let that = this
    let temp_name = '临时'
    var tempDishes = e.currentTarget.dataset.item
    let specs = that.data.specs
    let wanggouarray = []
    let temps = tempDishes.dishes_introduce.replace(/\s/g, "").split(","); //字符分割
    for (var x = 0; x < temps.length - 1; x++) {
      let temp = temps[x].substring(0, temps[x].length - 1)
      temp = temp.split(":")
      var item = {
        'hailname': temp[0],
        'hailnum': parseFloat(temp[1])
      }
      wanggouarray.push(item)
    }
    let spec_type = tempDishes.spec_type
    let temp_spec_type = 0
    for (var spec in specs) {
      specs[spec].checked = specs[spec].value == tempDishes.spec_type
      if (specs[spec].value == tempDishes.spec_type) {
        temp_spec_type = specs[spec].value
      }
    }
    that.setData({
      // .id在wxml中被赋值为{{item}}，即当前遍历的元素值
      tempDetail: tempDishes,
      tempValue: tempDishes.dishes_name,
      tempUnit: tempDishes.dishes_metering_type,
      wanggouarray: wanggouarray,
      temp_spec_type: temp_spec_type,
      tempNumber: '',
      tempSum: '',
      // 当用户选择某个联想词，隐藏下拉列表
      hideScroll: true,
      bindSource: [],
      isTemp: true,
      specs: specs,
      tempPrice: tempDishes.dishes_price,
    })
  },
  // 显示底栏
  showBottomBar: function (e) {
    var that = this;

    if (that.data.directList.length == 0) {
      time.show_NOCANCEL_Model("没有设置主动下单的菜品")
    } else {
      that.pageScrollToTop()
      if (that.data.showBottomBar) {
        that.setData({
          showBottomBar: false,
          showDirectDishes: false
        })
      } else {
        var cur = 0;
        //每个tab选项宽度占1/5
        var singleNavWidth = that.data.windowWidth / 5;
        //tab选项居中                            
        that.setData({
          navScrollLeft: (cur - 2) * singleNavWidth,
          currentTab: cur,
          showDirectDishes: true,
          showBottomBar: true
        })
      }
    }
  },
  radioChange: function (e) {
    //单规格-0，多规格-1，称重-2，计件-3,多做法-4
    let that = this
    let x = parseInt(e.detail.value)
    for (var spec in that.data.specs) {
      that.data.specs[spec].checked = that.data.specs[spec].value == x
    }
    that.setData({
      temp_spec_type: x
    })
    //临时菜品规格为:', that.data.specs[x].name, e.detail.value)
  },
  newTemporaryDishes: function (e) {
    var that = this
    var tempDetail = that.data.tempDetail
    var wanggouarrays = that.data.wanggouarray
    let remarks = ""
    for (var x of wanggouarrays) {
      let a = x.hailname + ": " + x.hailnum + "斤, "
      remarks += a
    }
    if (that.data.isTemp) {
      var temp = {
        "user_id": parseInt(that.data.user_id), //点餐用户id
        "order_id": parseInt(that.data.orderid), //订单id
        "dishes_id": tempDetail.dishes_id, // 菜品id
        "dishes_name": tempDetail.dishes_name,
        "item_number": parseInt(that.data.tempNumber), // 菜品份数
        "item_price": parseFloat(that.data.tempPrice), //单价
        "item_subtotal": that.data.tempSum, //小计 
        "dishes_status": 0, //核价状态 
        "item_type": 2, //2
        "measurement_value": 0,
        "spec_id": 0,
        "praise_flag": 1,
        "userchecked": 2,
        "remarks": remarks,
        "dishes_img": "https://mb.fsmbdlkj.com/WX Restaurant/dishesImg/1556158550064",
        "dishes_metering_type": tempDetail.dishes_metering_type,
        "spec_name": tempDetail.dishes_metering_type,
        "specal_type": 6,
        "em_id": '',
        "operator": app.globalData.loginname,
        "operatorchecked": 1,
        "initial_number": parseInt(that.data.tempNumber), // 初始菜品份数
        "sideDisht": '',
        "jointSet": '',
        "tastes": '',
        "freeOrder": 0,
        "repairOrder": 0,
        "copyOrder": 1,
        "waitOrder": 0,
        "baleOrder": 0,
        "transferOrder": 0,
        "depositOrder": 0,
      }
      var orderdetail = []
      orderdetail.push(temp)
      //临时菜品加菜
    }
    wx.request({
      url: app.globalData.WriteOrderDetails_url,
      data: {
        OrderDetaileds: JSON.stringify(orderdetail)
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.result.result == 1) {
          //详细订单改完后，因为主订单的金额与与详细订单金额总和不对应，需修改主订单与支付订单
          let order_id = res.data.object[0].order_id
          // 核价状态：不需核价-0、未核价-1、已核价-2
          wx.request({
            url: app.globalData.UpdateOrderDetailed_url,
            data: {
              id: res.data.object[0].id, //详单 id
              Order_id: order_id, //订单 id
              Shop_id: that.data.shop_id, //店铺 id
              Dishes_status: 0,
              operator: app.globalData.loginname,
            },
            success: function (res) {
              //已有临时菜品完成下单
              if (res.data.result.result == 1) {
                wx.request({
                  url: app.globalData.SynchronizedAmount_url,
                  data: {
                    order_id: order_id
                  },
                  success: function (res) {
                    if (res.data.result.result == 1) {
                      that.setData({
                        needToReconfirmOffer: true
                      })
                      wx.showToast({
                        title: '下单成功', //提示文字
                        duration: 3000, //显示时长
                        mask: false, //是否显示透明蒙层，防止触摸穿透，默认：false  
                        icon: 'success', //图标，支持"success"、"loading"  
                        success: function () {
                          wx.hideLoading()
                        }, //接口调用成功
                      })
                      that.redress() // 矫正金额和刷新
                    }
                  }
                })
              }
            }
          })
        }
      },
    })
    //<!------------------------------------------------------------------------------------------------------------->
  },
  getUsePayment(){
    let usePayment = ''
    switch(that.data.thisorderarry.paymethod){
      case "2":
        usePayment = "微信线上"
        break;
      case "9":
        usePayment = "微信线下"
        break;
      case "4":
        usePayment = "银行卡"
        break;
      case "5":
        usePayment = "支付宝"
        break;
      case "3":
        usePayment = "现金"
        break;
      case "8":
        usePayment = "其他方式"
        break;
      default:
        usePayment = "未选中"
        break;
    }
    // that.setData({
    //   usePayment: usePayment
    // })
    return usePayment
  },
  //改变支付方式
  changepay: function (e) {
    console.log(e)
    var that = this
    var thisorderarry = that.data.thisorderarry
    let index = e.currentTarget.dataset.index
    that.setData({
      paymethod: index,
    })
    if(index == 6){
      if(that.data.newYuCunInfo.prepaidDeposit && that.data.newYuCunInfo.prepaidDeposit > thisorderarry.total_amount){
          that.setData({
            isSatisfy: !that.data.isSatisfy
          })
      }
      that.setData({
        PDSelected: !that.data.PDSelected,
      })
    }
    // if (that.data.readyToOrder || that.data.readyToAddMeals) { //没有thisorderarry , 处于还没下单的状态 , 可以直接改
    //   that.setData({
    //     paymethod: e.currentTarget.dataset.index,
    //   })
    // } else {
    //   if (thisorderarry) {
    //     if (thisorderarry.order_status == '等待买单' || thisorderarry.order_status == '待确认' || thisorderarry.order_status == '申请买单' || thisorderarry.order_status == '正在用餐' || thisorderarry.order_status == '等待用餐') {
    //       if(e.currentTarget.dataset.index == 6){
    //         // if(that.data.nPD - that.data.orderPayment.actual_total <= 0) that.setData({noEnough: true})
    //         if(that.data.PDSelected){
    //           wx.request({
    //             url:app.globalData.updateIsAdvance,
    //             data:{
    //               orderId: that.data.orderid,
    //             },
    //             success: res =>{
    //               if(res.data.code == 1){
    //                 that.setData({
    //                   PD:'',
    //                   nPD:'',
    //                   PDSelected: false
    //                 })
    //               }
    //             }
    //           })
    //         }else{
    //           wx.request({
    //             url:app.globalData.getIsAdvance,
    //             data:{
    //               orderId: that.data.orderid,
    //             },
    //             success: res =>{
    //               if(res.data.code == 1){
    //                 that.toPD(e)
    //                 that.setData({
    //                   paymethod: 0,
    //                   PDSelected: true
    //                 })
    //               }
    //             }
    //           })
    //         }
    //         return;
    //       }
    //       if(e.currentTarget.dataset.index == 11){
    //         let isAdvanceDeposit = 0
    //         if(this.data.calueStoredSelected){
    //           that.setData({
    //             // vipCheck: true,
    //             calueStored: null,
    //             nPD:'',
    //             PD:'',
    //             calueStoredSelected: false
    //           })
    //           isAdvanceDeposit = 1
    //         }else{
    //           that.initVip()
    //           isAdvanceDeposit = 0
    //         }
    //         wx.request({
    //           url:app.globalData.updateIsAdvanceDeposit,
    //           data:{
    //             orderId:this.data.orderid,
    //             isAdvanceDeposit:isAdvanceDeposit,
    //             shopId :that.data.shop_id,
    //             phone:that.data.vipPhone,
    //             card:that.data.vipCard
    //           },
    //           success: res =>{
    //             console.log("进来了");
    //             this.setData({
    //               paymethod: 0,
    //               calueStoredSelected: isAdvanceDeposit == 0
    //             })

    //             this.refresh()
    //           }
    //         })
    //         return;
    //       }
    //       if ((e.currentTarget.dataset.index == 7 || e.currentTarget.dataset.index == 6) && !this.data.vipPhone && !this.data.vipCard) {
    //           return;
    //       }
    //       wx.request({
    //         url: app.globalData.UpdateOrderInf_url,
    //         data: {
    //           Shop_id: app.globalData.shopid,
    //           Order_id: that.data.orderid,
    //           paymethod: parseInt(e.currentTarget.dataset.index)
    //         },
    //         success: function (res) {
    //           let o = that.data.thisorderarry
    //           o.paymethod = parseInt(e.currentTarget.dataset.index)
    //           that.setData({
    //             thisorderarry: o
    //           })
    //         }
    //       })
    //       that.setData({
    //         paymethod: e.currentTarget.dataset.index,
    //       })
    //       if(!that.data.waitPay){
    //         that.setData({
    //           PD:'',
    //           nPD:'',
    //         })
    //       }
    //       that.showPrice()
    //     }
    //   } else { //没有thisorderarry , 处于还没下单的状态 , 可以直接改
    //     that.setData({
    //       paymethod: e.currentTarget.dataset.index,
    //     })
    //   }
    // }
  },
  //临时菜品的详情
  openTempDetail: function (e) {
    //打开临时菜详情
    var that = this
    var tempItem = e.currentTarget.dataset.tempdetail
    var tempDetail = []
    tempItem.tempChange = []
    let isOpen = !that.data.showTemporaryDishesDetail
    let wanggouarray = []

    app.globalData.menuListItem.map(function (menu) {
      if (e.currentTarget.dataset.tempdetail.dishes_id == menu.dishes_id) {
        tempDetail = menu
      }
    })

    for (var y = 0; y < that.data.infList.length; y++) {
      if (that.data.infList[y] != null) {
        if (that.data.infList[y].dishesId == tempDetail.dishes_id && that.data.infList[y].dishesOperator == "临时菜品修改") {
          //确实修改了
          tempItem.tempChange = that.data.infList[y]
        }
      }
    }

    that.selectTempDishesSC()

    //临时菜品的食材组成的展开
    let temps = tempItem.remarks.replace(/\s/g, "").split(","); //字符分割
    for (var x = 0; x < temps.length - 1; x++) {
      let temp = temps[x].substring(0, temps[x].length - 1)
      temp = temp.split(":")
      var item = {
        'hailname': temp[0],
        'hailnum': parseFloat(temp[1])
      }
      wanggouarray.push(item)
    }
    //规格名称
    let spec_type = 0
    let specs = that.data.specs
    that.showTempDishesSC(tempDetail)

    wx.request({
      url: app.globalData.GetDishes_url,
      data: {
        Dishes_id: tempItem.dishes_id,
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.result.result == 1) {
          spec_type = res.data.object.spec_type
          for (var spec in that.data.specs) {
            specs[spec].checked = specs[spec].value == res.data.object.spec_type
          }
        }
      },
      complete: function (res) {
        that.setData({
          // showTemporaryDetail: showTemporaryDetail,
          tempDetail: isOpen ? tempDetail : '',
          tempItem: isOpen ? tempItem : '',
          tempUnit: isOpen ? tempItem.dishes_metering_type : '',
          wanggouarray: isOpen ? wanggouarray : '',
          tempPrice: isOpen ? tempItem.item_price : '',
          tempNumber: isOpen ? tempItem.item_number : '',
          tempSum: isOpen ? tempItem.item_subtotal : '',
          tempValue: isOpen ? tempItem.dishes_name : '',
          showTemporaryDishes: false, //显示临时菜品
          temp_spec_type: spec_type,
          temporaryCheckedColor: tempItem.item_type == 3, //部长字体颜色
          indexTemp: e.currentTarget.dataset.index,
          specs: specs,
          showTemporaryDishesDetail: !that.data.showTemporaryDishesDetail
        })
      }
    })
    // 待确认
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
      if (that.data.quickRemarkType == 1) {
        //订单-快捷备注
        var quickRemarkList = app.globalData.remark_normal
        var Order_remark = that.data.Order_remark
        if (Order_remark == undefined || Order_remark == null) {
          Order_remark = ""
        }
        temps = app.tempArray(Order_remark, tempArray)
        that.setData({
          Order_quick_remark: temps,//全单备注中的快捷备注
          Order_remark: Order_remark,
          quickRemarkList: quickRemarkList,
          //quickRemarkList:tempArray,
          showRemarkList: false
        })
        app.globalData.Order_quick_remark = temps;
      } else { //惊喜
        //菜品-快捷备注
        var quickRemarkList = app.globalData.remark_normal
        //2020-11-19 来料加工备注重写
        this.commonSpecType8(1, event.detail);
        that.setData({
          quickRemarkList: quickRemarkList,
          showRemarkList: false,
          quickRemark: event.detail
        })
      }
    }
  },
  // 临时菜品的返回按钮，不严谨
  temporaryReturn: function (e) {
    let that = this
    that.setData({
      tempDetail: '',
      tempUnit: '份',
      wanggouarray: [],
      tempPrice: '',
      tempNumber: '',
      tempSum: '',
      tempValue: '',
      temp_operator: '', //临时菜品用，操作人，就为了临时菜品下单或者是修改的时候的时候，显示一下操作人和时间
      temp_operation_time: '', //临时菜品用，操作时间
      hideScroll: true,
      bindSource: [],
      isTemp: false,
      showTemporaryDishes: false,
      showTemporaryDishesDetail: false,
      showTemporaryDishesDirecty: false, //显示临时菜品 直接点餐
      showTemporaryDishesDetailDirecty: false, //显示临时菜品详情 直接点餐
    })
  },
  // 显示多种做法的弹窗
  showMultipleEatMethodView(event) {
    this.setData({
      showMultipleEatMethodView: !this.data.showMultipleEatMethodView
    })
  },

  // 显示多种做法的弹窗
  showMultipleEatMethodViewF(event) {
    var em_arry = this.data.em_arry
    var partsName = this.data.partsName
    var eatMethodArray = this.data.eatMethodArray
    //2020-11-24 选做法回显
    var n = true;
    var eatMethodIndex = -1;
    for (var x = 0; x < em_arry.length; x++) {
      for (var z of eatMethodArray) {
        for (var y = 0; y < em_arry[x].length; y++) {
          if (em_arry[x][y].id == z.id) {
            em_arry[x][y] = JSON.parse(JSON.stringify(z));
            //2020-11-24 部位上的数字回显，有点问题，强行加的
            /*for (var t = 0; t < em_arry[x].length; t++) {
              em_arry[x][t].number = z.number;
            };*/
            if (n) {
              eatMethodIndex = y;
              n = false;
            }
          }
        }
      }
    }
    //2020-11-24 选部位回显
    var i = true;
    var partIndex = 0;
    for (var x = 0; x < partsName.length; x++) {
      partsName[x].checked = false
      for (var z of eatMethodArray) {
        if (z.em_name == partsName[x].em_name) {
          partsName[x].checked = true;
          if (i) {
            partIndex = x;
            i = false;
          }
        }
      }
    }
    this.setData({
      em_arry: em_arry,
      partsName: partsName,
      partIndex: partIndex,
      eatMethodIndex: eatMethodIndex,
      showMultipleEatMethodViewF: !this.data.showMultipleEatMethodViewF
    })
    //this.selectComponent('#specType8-method3').init();
  },
  showMultipleEatAndSpecView(event) {
    this.setData({
      showMultipleEatAndSpecView: !this.data.showMultipleEatAndSpecView
    })
    var spec_type = this.data.dishes.spec_type
    if (spec_type == 10) {
      this.setData({
        eatMethodChooseIndex: 0
      })
    }
  },
  //确认做法 
  submitEatMethodF: function (event) {
    var that = this
    if (event.detail.result == 0) {
      //未选择做法
      wx.showToast({
        icon: 'none',
        title: '请先选择做法！',
        duration: 3000
      })
    } else if (event.detail.result == 3) {
      wx.showToast({
        icon: 'none',
        title: '',
        duration: 3000
      })
    } else if (event.detail.result == 2) {
      //未选择剩余部位
      wx.showToast({
        icon: 'none',
        title: '请选择剩余部位的做法！',
        duration: 3000
      })
    } else if (event.detail.result == 1) {
      //选择成功
      var eatMethodArray = event.detail.eatMethodArray
      var inputUnitprice = 0;
      if (eatMethodArray[0].place == '全部位') {
        if (that.data.dishes.spec_type == 8) {
          inputUnitprice = eatMethodArray[0].price;
        } else {
          inputUnitprice = that.data.inputUnitprice != '' ? Number(that.data.inputUnitprice) : 1;
        }
        eatMethodArray[0].tastes = that.data.tastes != '' ? that.data.tastes : ''
        eatMethodArray[0].tastesRemark = that.data.tastesRemark != '' ? that.data.tastesRemark : ''
        eatMethodArray[0].remarks = that.data.remarks != '' ? that.data.remarks : ''
        eatMethodArray[0].SideDishList = that.data.SideDishList != '' ? that.data.SideDishList : []
        eatMethodArray[0].SideDishList_choose = that.data.SideDishList_choose != '' ? that.data.SideDishList_choose : []
        //把配菜金额赋值回去
        if (eatMethodArray[0].SideDishList_choose) {
          if (eatMethodArray[0].SideDishList_choose != '') {
            var money = 0
            var add = 0
            for (var y of eatMethodArray[0].SideDishList_choose) {
              add += y.orderDetailedSum
            }
            money = eatMethodArray[0].price * Number(eatMethodArray[0].number) + add
            money = Math.floor(Number(money) * 100) / 100
            eatMethodArray[0].money = money
          }
        }
        that.setData({
          eatMethodArray: eatMethodArray,
          hasWhole: true,
          inputAmount: eatMethodArray[0].number,
          confirmweighing: eatMethodArray[0].number,
          inputUnitprice: inputUnitprice,
          en_index: event.detail.isWhole ? eatMethodArray : [],
          en_basicarry: event.detail.isWhole ? eatMethodArray : [],
          em_index: !event.detail.isWhole ? eatMethodArray : [],
          em_basicarry: !event.detail.isWhole ? eatMethodArray : [],
          eatMethodChooseIndex: 0,
          showMultipleEatMethodViewF: false
        })
        this.showGuigeMoneyAndNumber(1)

      } else {
        var eatMethodArrayR = []
        var hasWhole = false;
        var inputUnitprice = that.data.inputUnitprice != '' ? Number(that.data.inputUnitprice) : 0
        for (var x = 0; x < eatMethodArray.length; x++) {
          if (eatMethodArray[x].number > 0 && that.data.dishes.weighingByLocation == 1) {
            if (eatMethodArray[x].SideDishList_choose) {
              if (eatMethodArray[x].SideDishList_choose != '') {
                var money = 0
                var add = 0
                for (var y of eatMethodArray[x].SideDishList_choose) {
                  add += y.orderDetailedSum
                }
                money = eatMethodArray[x].price * Number(eatMethodArray[x].number) + add
                money = Math.floor(Number(money) * 100) / 100
                eatMethodArray[x].money = money
              }
            }
            eatMethodArrayR.push(eatMethodArray[x])
          } else if (that.data.dishes.weighingByLocation == null || that.data.dishes.weighingByLocation != 1) {
            hasWhole = true;
            if (eatMethodArray[x].SideDishList_choose) {
              if (eatMethodArray[x].SideDishList_choose != '') {
                var money = 0
                var add = 0
                for (var y of eatMethodArray[x].SideDishList_choose) {
                  add += y.orderDetailedSum
                }
                money = Math.floor(Number(add) * 100) / 100
                eatMethodArray[x].money = money;
                eatMethodArray[x].number = 0;
              }
            }
            eatMethodArrayR.push(eatMethodArray[x])
          }
        }
        that.setData({
          eatMethodArray: eatMethodArrayR,
          hasWhole: hasWhole,
          //SideDishList: eatMethodArray[0].SideDishList,
          SideDishList_choose: eatMethodArray[0].SideDishList_choose,
          en_index: event.detail.isWhole ? eatMethodArrayR : [],
          en_basicarry: event.detail.isWhole ? eatMethodArrayR : [],
          em_index: !event.detail.isWhole ? eatMethodArrayR : [],
          em_basicarry: !event.detail.isWhole ? eatMethodArrayR : [],
          showMultipleEatMethodViewF: false
        })
        this.showGuigeMoneyAndNumber(1)
        this.setData({
          eatMethodChooseIndex: 0
        })
      }
    }
  },
  //确认做法 
  submitEatMethod: function (event) {
    var that = this
    if (event.detail.result == 0) {
      //未选择做法
      wx.showToast({
        icon: 'none',
        title: '请先选择做法！',
        duration: 3000
      })
    } else if (event.detail.result == 3) {
      wx.showToast({
        icon: 'none',
        title: '',
        duration: 3000
      })
    } else if (event.detail.result == 2) {
      //未选择剩余部位
      wx.showToast({
        icon: 'none',
        title: '请选择剩余部位的做法！',
        duration: 3000
      })
    } else if (event.detail.result == 1) {
      //选择成功
      var eatMethodArray = event.detail.eatMethodArray
      if (eatMethodArray[0].place == '全部位') {
        var inputUnitprice = that.data.inputUnitprice != '' ? Number(inputUnitprice) : 0
        eatMethodArray[0].tastes = that.data.tastes != '' ? that.data.tastes : ''
        eatMethodArray[0].tastesRemark = that.data.tastesRemark != '' ? that.data.tastesRemark : ''
        eatMethodArray[0].remarks = that.data.remarks != '' ? that.data.remarks : ''
        eatMethodArray[0].SideDishList = that.data.SideDishList != '' ? that.data.SideDishList : []
        eatMethodArray[0].SideDishList_choose = that.data.SideDishList_choose != '' ? that.data.SideDishList_choose : []
        if (event.detail.Type10) {
          var dishes = that.data.dishes
          dishes.dishes_price = eatMethodArray[0].dishesSpec.spec_price
          dishes.dishes_metering_type = eatMethodArray[0].dishesSpec.spec_name
          that.setData({
            dishes: dishes
          })
        }
        that.setData({
          eatMethodArray: eatMethodArray,
          hasWhole: true,
          inputAmount: eatMethodArray[0].number,
          inputUnitprice: eatMethodArray[0].price,
          en_index: event.detail.isWhole ? eatMethodArray : [],
          en_basicarry: event.detail.isWhole ? eatMethodArray : [],
          em_index: !event.detail.isWhole ? eatMethodArray : [],
          em_basicarry: !event.detail.isWhole ? eatMethodArray : [],
          eatMethodChooseIndex: 0,
          showMultipleEatMethodView: false,
          showMultipleEatAndSpecView: false
        })
      } else {
        var eatMethodArrayR = []
        var inputUnitprice = that.data.inputUnitprice != '' ? Number(inputUnitprice) : 0
        for (var x = 0; x < eatMethodArray.length; x++) {
          if (eatMethodArray[x].number > 0) {
            if (eatMethodArray[x].SideDishList_choose) {
              if (eatMethodArray[x].SideDishList_choose != '') {
                var money = 0
                var add = 0
                for (var y of eatMethodArray[x].SideDishList_choose) {
                  add += y.orderDetailedSum
                }
                money = eatMethodArray[x].price * Number(eatMethodArray[x].number) + add
                money = Math.floor(Number(money) * 100) / 100
                eatMethodArray[x].money = money
              }
            }
            eatMethodArrayR.push(eatMethodArray[x])
          }
        }
        that.setData({
          eatMethodArray: eatMethodArrayR,
          hasWhole: false,
          sideDishList: eatMethodArray[0].SideDishList,
          sideDishList_choose: eatMethodArray[0].SideDishList_choose,
          en_index: event.detail.isWhole ? eatMethodArrayR : [],
          en_basicarry: event.detail.isWhole ? eatMethodArrayR : [],
          em_index: !event.detail.isWhole ? eatMethodArrayR : [],
          em_basicarry: !event.detail.isWhole ? eatMethodArrayR : [],
          showMultipleEatMethodView: false
        })
        this.setData({
          eatMethodChooseIndex: 0,
        })
      }
    }
  },
  // 标单、补单、分席、叫起、即上、赠送、打包、转单、寄存
  noycts: function (e) {
    var that = this;
    //2020-11-24 订单状态为 等待买单、已付款、已完成、已取消，则不打开
    if (that.data.thisorderarry.order_status != "等待买单" && that.data.thisorderarry.order_status != "已付款" && that.data.thisorderarry.order_status != "已完成" && that.data.thisorderarry.order_status != "已取消") {
      if (!that.data.showModalQR) {
        var bidDetailitem = e.currentTarget.dataset.detailitem
        var listData = that.data.listData
        //2020-12-04 通用方法
        listData = that.pageageCheckListData(listData, bidDetailitem);
        that.setData({
          bidDetailitem: bidDetailitem,
          showModalQR: true,
          listData: listData
        })
      } else {
        that.setData({
          bidDetailitem: [],
          showModalQR: false
        })
      }
    }
  },
  // 标单、补单,直接点餐，提交订单前
  noycts_unOrdered: function (e) {
    const { idx, cart_item } = e.currentTarget.dataset
    this.setData({
      curDish: cart_item,
      curStyleIdx: idx
    })
    console.log(this.data.curStyleIdx, cart_item);
    var that = this
    if (!that.data.showModalQR) {
      // var cart_item = e.currentTarget.dataset.cart_item
      var listData = that.data.listData;
      //2020-12-04 通用方法
      listData = that.pageageCheckListData(listData, cart_item);
      that.setData({
        cart_item: cart_item,
        showModalQR: true,
        listData: listData
      })
    } else {
      that.setData({
        cart_item: [],
        showModalQR: false
      })
    }
  },
  hideModal: function (e) {
    var that = this
    that.setData({
      showRemarkList: false,
      quickRemarkList: app.globalData.remark_normal,
      showOrderList: false,
      listOrderList: [],
      xuanzezhege: -1,
      zhandan_tableId: -1,
      zhandan_orderId: -1,
    })
  },
  //旧的(可用)
  showRemarkList: function (e) {
    var that = this
    var quickRemarkList = that.data.quickRemarkList
    for (var x = 0; x < quickRemarkList.length; x++) {
      quickRemarkList[x].checked = false
    }
    if (!that.data.showRemarkList) {
      var remark = e.currentTarget.dataset.type == 1 ? that.data.Order_quick_remark : that.data.dishes_remark
      for (var x = 0; x < quickRemarkList.length; x++) {
        if (quickRemarkList[x].value.indexOf(remark) != -1) {
          quickRemarkList[x].checked = true
        }
      }
    }
    that.setData({
      showRemarkList: !that.data.showRemarkList,
      quickRemarkList: quickRemarkList,
      quickRemarkType: e.currentTarget.dataset.type,
      remark_index: []
    })
  },
  //下单详情，菜品详情，客人备注回显新方法
  showRemarkList_huixian: function (e) {
    var that = this
    var temps2 = []
    var temps1 = that.data.dishes_remark
    if (temps1 != null && temps1 != '') {
      temps2 = temps1.split("、")
    }
    var quickRemarkList = that.data.quickRemarkList
    for (var x = 0; x < quickRemarkList.length; x++) {
      quickRemarkList[x].checked = false
    }
    if (!that.data.showRemarkList) {
      var remark = e.currentTarget.dataset.type == 1 ? that.data.Order_quick_remark : that.data.dishes_remark
      if (temps2 != null && temps2.length != 0) {
        for (var i of temps2) {
          for (var x = 0; x < quickRemarkList.length; x++) {
            if (i == quickRemarkList[x].value) {
              quickRemarkList[x].checked = true
            }
          }
        }
      }
    }
    that.setData({
      showRemarkList: !that.data.showRemarkList,
      quickRemarkList: quickRemarkList,
      quickRemarkType: e.currentTarget.dataset.type,
      remark_index: []
    })
  },
  //2020-11-19 新快捷备注方法
  showRemarkList_new: function (e) {
    var temps2 = []
    var that = this
    var temps1 = that.data.Order_quick_remark
    console.log(temps1,"11831ordersdetail")
    console.log(temps2,"11832ordersdetail");
    if (temps1 != null && temps1 != '') {
      temps2 = temps1.split("、")
    }
    var quickRemarkList = that.data.quickRemarkList
    console.log(quickRemarkList,"11837ordersdetail");
    //每次进来都是将快捷备注状态改为false
    for (var x = 0; x < quickRemarkList.length; x++) {
      quickRemarkList[x].checked = false
    }
    if (!that.data.showRemarkList) {
      var remark = e.currentTarget.dataset.type == 1 ? that.data.Order_remark : that.data.quickRemark
      if (temps2 != null && temps2.length != 0) {
        for (var i of temps2) {
          for (var x = 0; x < quickRemarkList.length; x++) {
            if (i == quickRemarkList[x].value) {
              quickRemarkList[x].checked = true
            }
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
  xuanzezhege: function (e) {
    var that = this
    that.setData({
      zhandan_tableName: e.currentTarget.dataset.item.tableName,
      zhandan_tableId: e.currentTarget.dataset.item.tableId,
      zhandan_orderId: e.currentTarget.dataset.item.orderId,
      xuanzezhege: e.currentTarget.dataset.index
    })
  },

  quedingzhuandan: function (e) {
    var that = this
    if (that.data.zhandan_orderId != '') {
      wx.showModal({
        content: '是否确认从' + that.data.thisorderarry.table_name + '转去' + that.data.zhandan_tableName,
        confirmText: "是",
        cancelText: "否",
        success(res) {
          if (res.confirm) {
            WXAPI.transferOrderDetailed({
              OrderDetailed_id_before: that.data.bidDetailitem.id,
              Order_id_before: that.data.thisorderarry.order_id,
              order_id_after: that.data.zhandan_orderId
            }).then(function (data) {
              if (data.result == "success") {
                //转单成功
                wx.showToast({
                  title: '转单成功', //提示文字
                  icon: 'success',
                  duration: 2000, //显示时长
                  mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
                })
                that.redress()
              } else {
                wx.showToast({
                  title: '转单失败', //提示文字
                  icon: 'none',
                  duration: 2000, //显示时长
                  mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
                })
                //转单失败
              }
              that.setData({
                showOrderList: false,
                showChooseChange: false,
                showModalQR: false
              })
            }).catch(res => {
              //转单失败
              wx.showToast({
                title: '转单失败', //提示文字
                icon: 'none',
                duration: 2000, //显示时长
                mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
              })
            })
          } else {
          }
        }
      })
    } else {
      wx.showToast({
        title: '请选择订单', //提示文字
        icon: 'none',
        duration: 2000, //显示时长
        mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
      })
    }
  },

  buxiBindsubmit: function (e) {
    var godata = {}
    var that = this
    var depositOpen = true
    //选择订单属性
    if (e.detail.value.checkbox_value.length >= 0) {
      if (this.data.temporary.length > 0) {
        for (let i of this.data.temporary) {
          godata = {
            id: i.id,
            Order_id: that.data.orderid,
            Shop_id: that.data.shop_id,
          }
        }
      }
      if (this.data.bidDetailitem != null && this.data.bidDetailitem.length != 0) {
        godata = {
          id: this.data.bidDetailitem.id,
          Order_id: that.data.orderid,
          Shop_id: that.data.shop_id,
        }
      }
      //当有选寄存的情况下，判断是否有客户电话
      if (e.detail.value.checkbox_value.indexOf("寄存") != -1) {
        if (that.data.orderPayment.payment_status != 0) {
          if (that.data.guestInputPhone != '') {
            // 符合寄存条件，把上一个框去掉
            that.setData({
              guestNumInput: false,
            })
          } else {
            //弹出输入电话号码的框
            //清空保存的电话
            that.setData({
              guestNumInput: true,
              guestInputPhone: '',
              buxiBindsubmit: e,
              bidDetailitem: that.data.bidDetailitem,
              showModalQR: false
            })
            depositOpen = false
          }
        } else {
          wx.showToast({
            title: '只能在支付后才能寄存', //提示文字
            duration: 2000, //显示时长
            icon: 'none',
            mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false 
            success: function () {
              return -1;
            }
          })
          depositOpen = false
          godata.depositOrder = 0
        }
      }
      if (depositOpen) {
        if (e.detail.value.checkbox_value.indexOf("标单") != -1) {
          godata.freeOrder = 1
        } else {
          godata.freeOrder = 0
        }
        if (e.detail.value.checkbox_value.indexOf("补单") != -1) {
          godata.repairOrder = 1
        } else {
          godata.repairOrder = 0
        }
        if (e.detail.value.checkbox_value.indexOf("分席") != -1 && e.detail.value.checkbox_value.indexOf("不分席") == -1) {
          if (e.detail.value.splitInput != '') {
            godata.copyOrder = e.detail.value.splitInput
          } else {
            wx.showToast({
              title: '请输入分席数量', //提示文字
              duration: 2000, //显示时长
              icon: 'none',
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false 
              success: function () {
                return -1;
              }
            })
          }
        } else {
          godata.copyOrder = 1
        }
        if (e.detail.value.checkbox_value.indexOf("不分席") != -1) {
          godata.copyOrder = 1
        } else {
          godata.copyOrder = that.data.thisorderarry.copyOrderNum
        }

        if (e.detail.value.checkbox_value.indexOf("赠送") != -1) {
          godata.Item_type = 5
        } else if (that.data.bidDetailitem.item_type == 5) {
          //处于本来是赠送，但是有变回不赠送的状态，得把钱加回去
          var zssum = Number((Number(that.data.bidDetailitem.item_price) * Number(that.data.bidDetailitem.measurement_value)).toFixed(2));
          if (that.data.bidDetailitem.sideDisht) {
            var thisSideDisht = that.data.bidDetailitem.sideDisht
            if (typeof (thisSideDisht) === 'string') {
              thisSideDisht = JSON.parse(thisSideDisht)
            }
            for (var n = 0; n < thisSideDisht.length; n++) {
              if (thisSideDisht[n].orderDetailedNum > 0) {
                zssum += Number(Number(Number(thisSideDisht[n].sideDishdPrice) * Number(thisSideDisht[n].orderDetailedNum) / 100).toFixed(2))
              }
            }
          }
          godata.Item_type = 0
          wx.request({
            url: app.globalData.UpdateOrderDetailed_url,
            data: {
              id: that.data.bidDetailitem.id,
              Order_id: that.data.bidDetailitem.order_id,
              Shop_id: that.data.shop_id,
              Item_subtotal: zssum,
              operator: app.globalData.loginname, //operator
              Item_type: 0, //点餐类别：加餐id、点餐-0、退餐--1 赠送-5
            },
            success: function (res) {
              if (res.data.result.result == 1) {
                that.redress() //矫正金额和获取订单
                //修改成功
              } else {
                //修改失败
              }
            },
            fail: function (res) {
              //修改失败
            }
          })
        } else {
          godata.Item_type = 0
        }
        if (e.detail.value.checkbox_value.indexOf("叫起") != -1) {
          godata.waitOrder = 1
        }
        if (e.detail.value.checkbox_value.indexOf("即上") != -1) {
          godata.waitOrder = 0
        }
        if (e.detail.value.checkbox_value.indexOf("加急") != -1) {
          godata.waitOrder = 2
        }
        if (e.detail.value.checkbox_value.indexOf("催单") != -1) {
          if(UtilJS.timeDifferenceByMinute (that.data.thisorderarry.dinner_time,UtilJS.formatTime()) > that.data.normalServingTime){
            console.log("可以催单");
            godata.remindOrder = 1;
            var sendData = {
              cuidanNum: 1,			//1为单个催单，全催单大于1即可
              shop_id: that.data.shop_id,		//商家id
              order_id: parseInt(that.data.orderid),	//订单id  （必填）
              operator_id: '0',		//修改人表主id （必填）
              operator_name: ' ',	//修改人名称 （必填）
              user_id: parseInt(that.data.thisorderarry.user_id),			//修改人用户id （必填）
              dishes_id: that.data.bidDetailitem.dishes_id,	//id		（单菜品催单必填，全催单可不填）
              dishes_name: that.data.bidDetailitem.dishes_name,	//菜品名称	（单菜品催单必填，全催单可不填）
              id: that.data.bidDetailitem.id,			//dishes_inf的id	（单菜品催单必填，全催单可不填）
            }
            that.cuidanFunc(sendData);
          }else{
            wx.showModal({
              title: '提示',
              content: '对不起!还在正常上菜时间内,不能催单!',
              showCancel: false
            })
          }
          
        }else{
          godata.remindOrder = 0
        }

        if (e.detail.value.checkbox_value.indexOf("打包") != -1) {
          godata.baleOrder = 1
        } else {
          godata.baleOrder = 0
        }
        if (e.detail.value.checkbox_value.indexOf("转单") != -1) {
          godata.transferOrder = 1
        } else {
          godata.transferOrder = 0
        }
        if (e.detail.value.checkbox_value.indexOf("寄存") != -1) {
          // godata.depositOrder = 1
          //列表进来，可以直接进行操作
          if (e.detail.value.depositInput != '') {
            godata.depositOrder = e.detail.value.depositInput
            var bidDetailitem = that.data.bidDetailitem
            var detail_id = bidDetailitem.id
            var dishes_id = bidDetailitem.dishes_id
            var dishesNum = Number(godata.depositOrder) //数量
            var dNum = 0 //当前菜品的分数，当规格为2，3，5，6时，为一份，规格为4则取item_number逗号前的第一个为分数，其他直接是item_number
            if (bidDetailitem.spec_type == 2 || bidDetailitem.spec_type == 3 || bidDetailitem.spec_type == 5 || bidDetailitem.spec_type == 6) {
              dNum = 1
            } else if (bidDetailitem.spec_type == 4) {
              dNum = bidDetailitem.item_number.split(',')[0]
            } else {
              dNum = bidDetailitem.item_number
            }
            if (dishesNum <= dNum) { // 寄存的分数小于等于总分数
              if (bidDetailitem.depositOrder > 0) {
                //已经有相同的寄存数据了，不增加，进行修改
                //先查出当前有的寄存数据
                wx.request({
                  url: app.globalData.GetConsignOrder_url,
                  data: {
                    oldOrderInfId: that.data.thisorderarry.order_id,
                  },
                  success: function (res) {
                    if (res.data.object) {
                      var list = res.data.object
                      var consignId
                      for (var n = 0; n < list.length; n++) {
                        if (list[n].dishes_id == bidDetailitem.dishes_id) {
                          //寄存id获取
                          consignId = list[n].consignId
                          var consignStatus = 1 //默认为1-已寄存
                          if (dishesNum == 0) {
                            //数量为0，状态要变成3-删除
                            consignStatus = 3
                          }
                          //修改当前寄存状态
                          wx.request({
                            url: app.globalData.UpdateConsignOrder_url,
                            data: {
                              consignId: consignId,
                              dishesNum: dishesNum,
                              consignStatus: consignStatus,
                              initialDishesNum: dishesNum
                            },
                            success: function (res) {
                              that.getDepositList(false)
                            }
                          })
                          break;
                        }
                      }
                    } else {
                      //增加
                      that.addConsignOrder(detail_id, dishes_id, dishesNum, bidDetailitem)
                      that.getDepositList(false)
                    }
                  }
                })
              } else {
                //增加
                that.addConsignOrder(detail_id, dishes_id, dishesNum, bidDetailitem, bidDetailitem)
                that.getDepositList(false)
              }
            } else {
              //得把输入的数量清0
              godata.depositOrder = 0
              wx.showToast({
                title: '寄存数量不能超过菜品数量', //提示文字
                duration: 2000, //显示时长
                icon: 'none',
                mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false 
                success: function () {
                  return -1;
                }
              })
            }
          } else {
            wx.showToast({
              title: '请输入寄存数量', //提示文字
              duration: 2000, //显示时长
              icon: 'none',
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false 
              success: function () {
                return -1;
              }
            })
          }
        } else {
          godata.depositOrder = 0
        }
        if (godata != null) {
          wx.request({
            // url: app.globalData.UpdateOrderDetailedNew_url,
            // url:'https://test.fsmbdlkj.com/WX Restaurant/UpdateOrderDetailedOperation',
            url:app.globalData.UpdateOrderDetailedOperation,
            // url: 'http://localhost:8087/WX Restaurant/UpdateOrderDetailedOperation',
            data: godata,
            success: function (res) {
              if (res.data.result.result == 1) {
                //操作成功
                that.getThisOrderDetailAndInf();//2020-11-25 状态回显慢，强制先刷新，不好的方案
                that.setData({
                  bidDetailitem: [],
                  showModalQR: false
                })
                setTimeout(function () {
                  that.setData({
                    needToReconfirmOffer: true
                  })
                  that.redress()
                }, 300)
              } else {
                wx.showToast({
                  title: '网络异常,请刷新', //提示文字
                  duration: 2000, //显示时长
                  mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
                })
              }
            }
          })
          that.getThisOrderDetailAndInf();
          that.setData({
            bidDetailitem: [],
            showModalQR: false
          })
          setTimeout(function () {
            that.setData({
              needToReconfirmOffer: true
            })
            that.redress()
          }, 300)
          // wx.request({
          //   // url: app.globalData.UpdateOrderDetailed_url,
          //   url: 'http://localhost:8087/WX Restaurant/UpdateOrderDetailedForAll',

          //   data: godata,
          //   success: function (res) {
          //     if (res.data.result.result == 1) {
          //       //操作成功
          //       that.getThisOrderDetailAndInf();//2020-11-25 状态回显慢，强制先刷新，不好的方案
          //       that.setData({
          //         bidDetailitem: [],
          //         showModalQR: false
          //       })
          //       setTimeout(function () {
          //         that.setData({
          //           needToReconfirmOffer: true
          //         })
          //         that.redress()
          //       }, 300)
          //     } else {
          //       wx.showToast({
          //         title: '网络异常,请刷新', //提示文字
          //         duration: 2000, //显示时长
          //         mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
          //       })
          //     }
          //   }
          // })
        }
      }
    }
    this.redress()
  },
  //寄存新增相关方法开始
  gotoBuxiBindsubmit: function () {
    var that = this;
    //输入完手机号之后,进行手机号判断和方法的重调用
    var guestInputPhone = that.data.guestInputPhone
    var buxiBindsubmit = that.data.buxiBindsubmit
    if (guestInputPhone.length < 11) {
      wx.showToast({
        title: '请输入正确的电话号码', //提示文字
        duration: 2000, //显示时长
        icon: 'none',
        mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false 
        success: function () {
          return -1;
        }
      })
    } else {
      that.buxiBindsubmit(buxiBindsubmit)
    }
  },
  guestNumInput: function () {
    var that = this;
    that.setData({
      guestNumInput: false,
      guestInputPhone: ''
    })
  },
  //获取本单的寄存信息
  getDepositList: function (openPage) {
    var that = this;
    var guestPhone = that.data.guestPhone
    var openPage = openPage
    wx.request({
      url: app.globalData.GetConsignOrder_url,
      data: {
        // oldOrderInfId: order_id,
        userPhone: guestPhone,
        shop_id: app.globalData.shopdetail.shop_id
      },
      success: function (res) {
        that.setData({
          deposit_list: res.data.object
        })
        if (openPage) {
          that.deposit_details();
        }
      }
    })
  },
  bindDateChange: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var deposit_list = that.data.deposit_list
    deposit_list[index].date = e.detail.value
    that.setData({
      deposit_list: deposit_list
    })
  },
  bindNumChange: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var deposit_list = that.data.deposit_list
    var num = Number(e.detail.value)
    if (num > Number(deposit_list[index].dishesNum)) {
      time.show_NOCANCEL_Model("使用分数不可超过剩余量")
      deposit_list[index].user_deposit_num = 0
    } else {
      deposit_list[index].user_deposit_num = num
    }
    that.setData({
      deposit_list: deposit_list
    })
  },

  depositTap: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var deposit_list = that.data.deposit_list
    if (!deposit_list[index].date) {
      time.show_NOCANCEL_Model("请输入使用时间")
    } else if (!(deposit_list[index].user_deposit_num) || deposit_list[index].user_deposit_num == 0) {
      time.show_NOCANCEL_Model("请输入使用数量")
    } else {
      //执行修改方法
      var consignStatus
      var consignId = deposit_list[index].consignId
      var dishesNum = Number((Number(deposit_list[index].dishesNum) - Number(deposit_list[index].user_deposit_num)).toFixed(2))
      if (dishesNum == 0) {
        consignStatus = 2
      } else {
        consignStatus = 1
      }
      wx.request({
        url: app.globalData.UpdateConsignOrder_url,
        data: {
          consignId: consignId, //寄存的id
          dishesNum: dishesNum, //份数
          newOrderInfId: that.data.orderid, //新订单id，用当前订单id
          consignStatus: consignStatus, //状态
          usingTime: deposit_list[index].date, //消费时间
        },
        success: function (res) {
          time.show_NOCANCEL_Model("使用成功")
          that.getDepositList(false)
          that.recordConfirmationInf(3, '寄存菜品使用', deposit_list[index])
        }
      })
    }
  },
  //寄存详情的判断
  deposit_details: function () {
    var that = this;
    var deposit_list = that.data.deposit_list
    if (deposit_list && deposit_list.length > 0) {
      that.setData({
        showDepositDetail: true,
        showDepositPhone: false
      })
    } else {
      time.show_NOCANCEL_Model("当前客户没有寄存的菜品")
    }
  },
  //寄存弹出输入手机号的框
  showDepositPhone: function () {
    var that = this;
    var showDepositPhone = that.data.showDepositPhone;
    that.setData({
      showDepositPhone: !showDepositPhone
    })
  },
  //获取库存输入的手机号码
  changeDepositPhone: function (e) {
    var that = this;
    that.setData({
      guestPhone: Number(e.detail.value)
    })
  },
  //获取录入寄存的手机号码
  changeDepositInputPhone: function (e) {
    var that = this;
    that.setData({
      guestInputPhone: Number(e.detail.value)
    })
  },
  // //计时器，用于闪烁的红点
  // countDown: function () {
  //   var that = this
  //   that.setData({
  //     timer_shine: setInterval(function () {
  //       //获取当前时间戳
  //       var timestamp = Date.parse(new Date());
  //       timestamp = timestamp / 1000;
  //       //加一小时的时间戳：
  //       var tomorrow_timetamp = timestamp + (1 * 60 * 60);
  //       //加一小时的时间：
  //       var n_to = tomorrow_timetamp * 1000;
  //       var tomorrow_date = new Date(n_to);
  //       // 调用函数时，传入new Date()参数，返回值是日期和时间
  //       if (tomorrow_date && tomorrow_date != null && tomorrow_date != '') {
  //         var time = time.formatTime(tomorrow_date)
  //         var color = that.data.fackyousevencolor == "red" ? "white" : "red";
  //         that.setData({
  //           now: time.formatTime(new Date()),
  //           nowtime: time,
  //           // halftime: time_half,
  //           // fixtimes: time_fix
  //           fackyousevencolor: color,
  //         })
  //       }
  //       // 再通过setData更改Page()里面的data，动态更新页面的数据
  //     }, 500) //这里的单位是毫秒，是计时器在倒数时的间隔时间,如果想把闪烁速度调快，把这里的数值调低
  //   })
  // },
  //寄存新增相关方法结束
  //标单、补单、分席
  // freeOrder   标单：0-不是标单；1-是标单
  // repairOrder  补单：0-不是补单；1-是补单
  // copyOrder  分席单：0-不是分席单；1-是分席单；
  buxiBindsubmit_order: function (e) {
    console.log(e);
    var godata
    var that = this
    var cart_item = that.data.cart_item
    var cartList = that.data.cartList

    //选择订单属性
    if (e.detail.value.checkbox_value.length >= 0) {
      for (var i = 0; i < cartList.length; i++) {
        if (cartList[i].cartList_index == cart_item.cartList_index) {
          if (e.detail.value.checkbox_value.indexOf("标单") != -1) {
            cartList[i].freeOrder = 1
          } else {
            cartList[i].freeOrder = 0
            that.setData({
              allBiaoDan: false
            })
          }
          if (e.detail.value.checkbox_value.indexOf("补单") != -1) {
            cartList[i].repairOrder = 1
          } else {
            cartList[i].repairOrder = 0
            that.setData({
              allBuDan: false
            })
          }
          if (e.detail.value.checkbox_value.indexOf("分席") != -1 && e.detail.value.checkbox_value.indexOf("不分席") == -1) {
            if (e.detail.value.splitInput != '') {
              cartList[i].copyOrder = e.detail.value.splitInput
            } else {
              wx.showToast({
                title: '请输入分席数量', //提示文字
                duration: 2000, //显示时长
                icon: 'none',
                mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false
                success: function () {
                  return -1;
                }
              })
            }
          } else {
            cartList[i].copyOrder = 1
          }
          if (e.detail.value.checkbox_value.indexOf("不分席") != -1) {
            cartList[i].bufenxi = 1
          }
          if (e.detail.value.checkbox_value.indexOf("赠送") != -1) {
            cartList[i].Item_type = 5
          } else {
            cartList[i].Item_type = 0
          }
          if (e.detail.value.checkbox_value.indexOf("叫起") != -1) {
            cartList[i].waitOrder = 1
            that.setData({
              allJiaoQi: true,
              allJiShang: false,
              allJiaJi: false,
            })
          }
          if (e.detail.value.checkbox_value.indexOf("即上") != -1) {
            cartList[i].waitOrder = 0
            that.setData({
              allJiaoQi: false,
              allJiShang: true,
              allJiaJi: false,
            })
          }
          if (e.detail.value.checkbox_value.indexOf("加急") != -1) {
            cartList[i].waitOrder = 2
            that.setData({
              allJiaoQi: false,
              allJiShang: false,
              allJiaJi: true,
            })
          }
          if (e.detail.value.checkbox_value.indexOf("打包") != -1) {
            cartList[i].baleOrder = 1
          } else {
            cartList[i].baleOrder = 0
            that.setData({
              allDaBao: false
            })
          }
        }
      }
    } else {
      if (cartList[i].cartList_index == cart_item.cartList_index) {
        cartList[i].freeOrder = 0
        cartList[i].repairOrder = 0
        cartList[i].copyOrder = 1
        cartList[i].item_type = 0
        cartList[i].waitOrder = 0
        cartList[i].baleOrder = 0
        cartList[i].hadOrdered = 1
      }
    }
    that.setData({
      cart_item: [],
      showModalQR: false
    })
    that.mangnerCarList(cartList)
    if(!this.data.readyToOrder && !this.data.readyToAddMeals) {
      return false
    }
    
    const isCreateOrder = that.data.listData.some(item => {
      return item.value=='先出单' && item.checked
    })
    if(isCreateOrder) {
      this.createOrder()
    }
  },
  // 下单前，填写全分席，将所有的菜品设置为分析
  copyOrder_2: function (e) {
    var that = this
    if (that.data.allFenXi && e.detail.value != '') {
      //下单，执行分席
      var cartList = that.data.cartList
      var copyOrderNum = parseInt(e.detail.value)
      copyOrderNum = copyOrderNum > 0 ? copyOrderNum : 1
      for (var i = 0; i < cartList.length; i++) {
        cartList[i].copyOrder = copyOrderNum
      }
      that.setData({
        copyOrderNum: copyOrderNum,
      })
      that.mangnerCarList(cartList)
    } else if (!that.data.allFenXi) {
      //未选择分席
    }
  },
  copyOrder_1: function (num) {
    var that = this
    that.setData({
      copyOrderNum: num
    })
    wx.request({
      url: app.globalData.UpdateBiaoDan_url,
      data: {
        order_id: that.data.orderid,
        type: 2,
        copy_order_num: num
      },
      header: {
        'content-type': "application/x-www-form-urlencoded"
      },
      method: 'POST',
      success: function (res) {
        if (res.data.result == "success") {
          //设置成功
          that.redress()
          that.setData({
            needToReconfirmOffer: true,
          })
        } else {
          that.setData({
            copyOrderNum: 1
          })
        }
      }
    })
  },
  addDishesMaterial: function (dishes_id) { //当新增临时菜品的时候，顺便执行添加食材
    var that = this
    let formulas = that.data.wanggouarray
    var ingredients = that.data.ingredient
    var dishes_id = dishes_id

    formulas.map(function (formula) {
      ingredients.map(function (ingredient) {
        if (ingredient.scname === formula.hailname) {
          wx.request({
            url: app.globalData.AddDishesMaterial_url,
            data: {
              dishes_id: dishes_id,
              stuff_count: formula.hailnum,
              stuff_id: ingredient.scId,
            },
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data.result.result == 1) {
                //ingredient.scname + '添加成功
              } else {
                //ingredient.scname + '添加失败
              }
            }
          })
        }
      })
    });
    //添加菜单食材成功
  },
  updateDishesMaterial: function (dishes_id) {
    var that = this
    let formulas = that.data.wanggouarray
    var ingredients = that.data.ingredient
    var dishes_id = dishes_id
  },
  changeHidden: function () {
    let that = this
    that.setData({
      loading: false
    });
    //加载完成
  },
  // 选规格弹窗需要操作 称重单/多规格
  selectInfo_guige: function (e) {
    var that = this;
    var guige_Num = '';
    var guige_Num2 = '';
    //打开称重单/多规格的详情
    wx.showLoading({
      title: '加载中...',
    })
    that.setData({
      showModalStatus3: true
    })
    wx.hideLoading();
    var foodindex;
    var guigeList = e.currentTarget.dataset.item; //拿出这个菜的数据（包含着detailed和inf）
    var cartList = that.data.cartList
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].cartList_index == guigeList.cartList_index) {
        foodindex = i
      }
    }
    guige_Num = guigeList.item_number.split(',')[0]
    guige_Num2 = guigeList.item_number.split(',')[1]
    wx.request({
      url: app.globalData.GetDishesSpec_url,
      data: {
        Dishes_id: guigeList.dishes_id
      },
      success: function (res) {
        var dishesSpecArry = res.data.object //菜品的规格组合
        that.setData({
          dishesSpecArry: dishesSpecArry
        })
      }
    })
    that.setData({
      guigeList: guigeList,
      guige_Num: guige_Num,
      guige_Num2: guige_Num2,
      indexgg: foodindex,
      foodindex: foodindex,
      ch_guige: false,
      dishes_remark: guigeList.remark
    })
  },
  //叫起 即上
  changeradio_call: function (e) {
    var that = this;
    // var allowedsubmit = 'true'
    // that.timed_refresh(1)
    that.setData({
      order_wait: e.currentTarget.dataset.index,
      // allowedsubmit: allowedsubmit
    })
  },
  //获取当前选择的规格
  choose_guige: function (e) {
    var that = this;
    var guigeList = that.data.guigeList
    var thisGuige = e.currentTarget.dataset.item
    //判断是否在出单前
    guigeList.u_spec_name = thisGuige.spec_name
    guigeList.dishes_price = thisGuige.spec_price
    guigeList.price = thisGuige.spec_price
    guigeList.item_number = thisGuige.weightingMin + ',' + thisGuige.weightingMax
    // guigeList.number = thisGuige.weightingMin + ',' + thisGuige.weightingMax
    // guigeList.number = 1
    guigeList.showNumber = thisGuige.weightingMin + ',' + thisGuige.weightingMax
    that.setData({
      guigeList: guigeList,
      ch_guige: true
    })
  },
  //通过修改详情加入购物车（多规格称重）
  addToCart2: function (e) {
    //通过修改详情加入购物车（多规格称重）
    var that = this;
    // that.difference();
    var guigeList = that.data.guigeList
    var cartList = that.data.cartList
    // 把改过的数组放回到cartList中.
    for (var i = 0; i < cartList.length; i++) {
      if (cartList[i].id == guigeList.id) {
        cartList[i] = guigeList
        cartList[i].remark = that.data.dishes_remark
        break;
      }
    }
    that.mangnerCarList(cartList)
    that.setData({
      showModalStatus3: false,
    })
  },
  // 查询未确认项
  selectUncheckedNumber: function (order_id) {
    var that = this
    let unChecked = 0
    var object = {
      "order_ids": order_id,
      "level": app.globalData.level,
    }
    wx.request({
      url: app.globalData.selectUnCheckCountByOrderID_url,
      data: JSON.stringify(object),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data != null) {
          var infList = res.data
          unChecked = res.data[0].unconfirmedNumber
          that.setData({
            unCheck: unChecked
          })
        }
      },
      complete: function () {
        return unChecked
      }
    })
  },
  //记录主动下单的菜品记录
  recordActiveOrder: function (number, dishes_id) {
    var that = this
    var object = {
      "shop_id": app.globalData.shopdetail.shop_id,
      "order_id": that.data.orderid,
      "dishes_id": dishes_id,
      "dishes_quantity": number,
      "operator": app.globalData.loginname,
    }
    wx.request({
      url: app.globalData.InsertActiveOrderRecord_url,
      data: JSON.stringify(object),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        if (res.data == "success") {
          //主动下单记录成功
        } else {
          //记录失败
        }
      },
    })
  },
  // 取消菜品框内的下拉
  bindShowMsg() {
    this.setData({
      select_cancel: !this.data.select_cancel
    })
  },
  // 赠送菜品框内的下拉
  bindShowMsg_free() {
    this.setData({
      select_free: !this.data.select_free
    })
  },
  mySelect(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      cancellation: name,
      select_cancel: false
    })
  },

  mySelect_free(e) {
    var name = e.currentTarget.dataset.name
    this.setData({
      presentation: name,
      select_free: false
    })
  },

  vdeepEqual: function (x, y) {
    // 指向同一内存时
    if (x === y) {
      return true;
    } else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
      if (Object.keys(x).length != Object.keys(y).length)
        return false;
      for (var prop in x) {
        if (y.hasOwnProperty(prop)) {
          if (!deepEqual(x[prop], y[prop]))
            return false;
        } else
          return false;
      }
      return true;
    } else
      return false;
  },
  radiocon: function (e) {
    var that = this
    var type = e.currentTarget.dataset.type
    var point = 0
    var Tijiao = true

    switch (e.currentTarget.dataset.type) {
      case "0":
        point = !that.data.allBiaoDan ? 1 : 0
        that.setData({
          allBiaoDan: !that.data.allBiaoDan
        })
        break;
      case "1":
        point = !that.data.allBuDan ? 1 : 0
        that.setData({
          allBuDan: !that.data.allBuDan
        })
        break;
      case "2":
        point = !that.data.allFenXi ? 1 : 0
        that.setData({
          allFenXi: !that.data.allFenXi
        })
        Tijiao = false
        break;
      case "3":
        point = 1
        if (!that.data.allJiaoQi) {
          type = 3
        } else {
          type = 4
        }
        that.setData({
          allJiaoQi: !that.data.allJiaoQi,
          allCuiDan:false
        })
        break;
      case "4":
        point = 1
        if (!that.data.allJiShang) {
          type = 4
        } else {
          type = 3
        }
        that.setData({
          allJiShang: !that.data.allJiShang
        })
        break;
      case "5":
        point = !that.data.allDaBao ? 1 : 0
        that.setData({
          allDaBao: !that.data.allDaBao
        })
        break;
      case "6":
        //全加急
        var allJiaJi = !that.data.allJiaJi;
        if (allJiaJi) {
          that.setData({
            allJiaoQi: !allJiaJi,
            allJiShang: !allJiaJi,
            allJiaJi: allJiaJi,
            allCuiDan: !allJiaJi,
          })
        } else {
          that.setData({
            allJiaJi: allJiaJi,
          })
        }
        break;
      case "7":
        //全催单
        var allCuiDan = !that.data.allCuiDan;
        if (allCuiDan) {
          that.setData({
            allJiaoQi: !allCuiDan,
            allJiShang: !allCuiDan,
            allJiaJi: !allCuiDan,
            allCuiDan: allCuiDan,
          })
          var sendData = {
            cuidanNum: 2,			//1为单个催单，全催单大于1即可
            shop_id: that.data.shop_id,		//商家id
            order_id: parseInt(that.data.orderid),	//订单id  （必填）
            operator_id: app.globalData.staffDetail.id,		//修改人表主id （必填）
            operator_name: app.globalData.staffDetail.name,	//修改人名称 （必填）
            user_id: parseInt(that.data.thisorderarry.user_id),			//修改人用户id （必填）
          };
          that.cuidanFunc(sendData);
        } else {
          that.setData({
            allCuiDan: allCuiDan,
          })
        }
        break;
      default:
        point = 0
    }
    if (Tijiao) {
      wx.request({
        url: app.globalData.UpdateBiaoDan_url,
        data: {
          order_id: that.data.orderid,
          type: type,
          point: point
        },
        header: {
          "content-Type": "application/x-www-form-urlencoded"
        },
        method: 'POST',
        success: function (res) {
          if (res.data.result == "success") {
            //设置成功
            wx.showToast({
              title: '设置成功', //提示文字
              icon: 'success',
              duration: 2000, //显示时长
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
            })
            that.redress()
          } else {
            wx.showToast({
              title: '设置错误，请重试', //提示文字
              icon: 'none',
              duration: 2000, //显示时长
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
            })
          }
        }
      })
    }
  },
  radiocon_order: function (e) {
    var that = this
    var cartList = that.data.cartList
    switch (e.currentTarget.dataset.type) {
      case "0":
        for (var i = 0; i < cartList.length; i++) {
          cartList[i].freeOrder = !that.data.allBiaoDan ? 1 : 0
        }
        that.setData({
          all_free_order: !that.data.allBiaoDan ? 1 : 0,
          allBiaoDan: !that.data.allBiaoDan,
          // allBuDan: false,
        })
        break;
      case "1":
        for (var i = 0; i < cartList.length; i++) { // 全机上
          cartList[i].repairOrder = !that.data.allBuDan ? 1 : 0
        }
        that.setData({
          all_repair_order: !that.data.allBuDan ? 1 : 0,
          // allBiaoDan: false,
          allBuDan: !that.data.allBuDan,
        })
        break;
      case "2":
        //选择全分席
        for (var i = 0; i < cartList.length; i++) { // 全分席
          cartList[i].copyOrder = !that.data.allFenXi ? that.data.copyOrderNum : 1
        }
        that.setData({
          allFenXi: !that.data.allFenXi
        })
        break;
      case "3":
        var allJiaoQi = !that.data.allJiaoQi
        for (var i = 0; i < cartList.length; i++) { // 全叫起
          cartList[i].waitOrder = allJiaoQi ? 1 : cartList[i].waitOrder != 1 ? cartList[i].waitOrder : 0;
        }
        if(!allJiaoQi){
          that.setData({
            all_wait_order: allJiaoQi ? 1 : that.data.order_wait != 1 ? that.data.order_wait : 0,
            order_wait: allJiaoQi ? 1 : that.data.order_wait != 1 ? that.data.order_wait : 0,
            allJiaoQi: allJiaoQi,
            allJiShang: !allJiaoQi,
            // allJiaJi: !allJiaoQi,
          })
          break;
        }
        that.setData({
          all_wait_order: allJiaoQi ? 1 : that.data.order_wait != 1 ? that.data.order_wait : 0,
          order_wait: allJiaoQi ? 1 : that.data.order_wait != 1 ? that.data.order_wait : 0,
          allJiaoQi: allJiaoQi,
          allJiShang: !allJiaoQi,
          allJiaJi: !allJiaoQi,
        })
        break;
      case "4":
        var allJiShang = !that.data.allJiShang
        for (var i = 0; i < cartList.length; i++) {
          cartList[i].waitOrder = allJiShang ? 0 : cartList[i].waitOrder != 0 ? cartList[i].waitOrder : 1
        }

        if(!allJiShang){
          that.setData({
            all_wait_order: allJiShang ? 0 : that.data.order_wait != 0 ? that.data.order_wait : 1,
            order_wait: allJiShang ? 0 : that.data.order_wait != 0 ? that.data.order_wait : 1,
            allJiShang: allJiShang,
            allJiaoQi: !allJiShang,
            // allJiaJi: !allJiShang,
          })
          break;
        }
        that.setData({
          all_wait_order: allJiShang ? 0 : that.data.order_wait != 0 ? that.data.order_wait : 1,
          order_wait: allJiShang ? 0 : that.data.order_wait != 0 ? that.data.order_wait : 1,
          allJiShang: allJiShang,
          allJiaoQi: !allJiShang,
          allJiaJi: !allJiShang,
        })
        break;
      case "5":
        for (var i = 0; i < cartList.length; i++) {
          cartList[i].baleOrder = !that.data.allDaBao ? 1 : 0
        }
        that.setData({
          all_bale_order: !that.data.allDaBao ? 1 : 0,
          allDaBao: !that.data.allDaBao
        })
        break;
      case "6":
        //全加急 allJiaJi
        var allJiaJi = !that.data.allJiaJi;
        for (let i = 0; i < cartList.length; i++) {
          cartList[i].waitOrder = allJiaJi ? 2 : cartList[i].waitOrder != 2 ? cartList[i].waitOrder : 0;
        }
        if(!allJiaJi){
          that.setData({
            all_wait_order: allJiaJi ? 2 : that.data.order_wait != 2 ? that.data.order_wait : 0,
            order_wait: allJiaJi ? 2 : that.data.order_wait != 2 ? that.data.order_wait : 0,
            allJiaJi: allJiaJi,
            // allJiaoQi: !allJiaJi,
            allJiShang: !allJiaJi,
          })
          break;
        }
        that.setData({
          all_wait_order: allJiaJi ? 2 : that.data.order_wait != 2 ? that.data.order_wait : 0,
          order_wait: allJiaJi ? 2 : that.data.order_wait != 2 ? that.data.order_wait : 0,
          allJiaJi: allJiaJi,
          allJiaoQi: !allJiaJi,
          allJiShang: !allJiaJi,
        })
        break;
      case "7":
        //全催单 allCuiDan
        break;
      default:
    }
    that.mangnerCarList(cartList)
  },
  // 订单备注，直接点餐，提交订单前
  orderRemarkInput: function (e) {
    this.setData({
      Order_remark: e.detail.value,
    })
    app.globalData.Order_remark = e.detail.value
  },
  showChoose: function (e) {
    let that = this
    let detailsType = that.data.detailsType
    let detailsTypeOrder_id = -1
    let detailsTypeCode = -1
    if (detailsType == 0) {
      app.globalData.table_name = that.data.thisorderarry.table_name
    } else {
      app.globalData.table_name = that.data.table_name
    }
    if (detailsType != 1) {
      detailsTypeOrder_id = that.data.thisorderarry.order_id
      detailsTypeCode = that.data.thisorderarry.order_code.substring(14, 19);
    }
    wx.redirectTo({
      url: '../order_directly/order_directly?zhuantai=true&detailsType=' + detailsType + '&detailsTypeOrder_id=' + detailsTypeOrder_id + '&detailsTypeCode=' + detailsTypeCode,
    })
  },
  showChoose2: function (e) {
    let that = this
    let chosseType = that.data.chosseType
    let compartmentLists = that.data.compartmentLists
    let hallIndex = that.data.hallIndex
    let hallTablesArray = that.data.hallTablesArray
    let this_hall = hallTablesArray[hallIndex]
    let subSeatsChar = that.data.subSeatsChar;
    let subSeatsNum = that.data.subSeatsNum;
    let subSeatsBol = that.data.subSeatsBol;
    let subSeatsList = that.data.subSeatsList;
    let this_old_subList = that.data.this_old_subList
    let isHall = that.data.isHall
    if (chosseType == 1) {
      chosseType = -1
      //非已有分席就清空
      if (!subSeatsBol) {
        subSeatsNum = 0
        subSeatsList = []
        this_old_subList = []
      } else {
        subSeatsList = this_old_subList
      }
      for (let i = 0; i < hallTablesArray.length; i++) {
        for (let n = 0; n < hallTablesArray[i].length; n++) {
          if (hallTablesArray[i][n].checked == true && (hallTablesArray[i][n].order_id != that.data.thisorderarry.order_id)) {
            hallTablesArray[i][n].checked = false
            hallTablesArray[i][n].subSeatsId = ''
          } else if (hallTablesArray[i][n].order_id == that.data.thisorderarry.order_id) {
            for (let m = 0; m < this_old_subList.length; m++) {
              if (hallTablesArray[i][n].table_id == this_old_subList[m].table_id) {
                hallTablesArray[i][n].subSeatsId = this_old_subList[m].subSeatsId
              }
            }
          }
        }
      }
      for (let i = 0; i < compartmentLists.length; i++) {
        if (compartmentLists[i].checked == true && (compartmentLists[i].order_id != that.data.thisorderarry.order_id)) {
          compartmentLists[i].checked = false
          compartmentLists[i].subSeatsId = ''
        } else if (compartmentLists[i].order_id == that.data.thisorderarry.order_id) {
          for (let m = 0; m < this_old_subList.length; m++) {
            if (compartmentLists[i].table_id == this_old_subList[m].table_id) {
              compartmentLists[i].subSeatsId = this_old_subList[m].subSeatsId
            }
          }
        }
      }
    } else {
      chosseType = 1
      let list
      if (isHall) {
        list = that.showFenxiTip(this_hall, subSeatsBol, subSeatsChar, subSeatsNum, true)
        this_hall = list.list
      } else {
        list = that.showFenxiTip(compartmentLists, subSeatsBol, subSeatsChar, subSeatsNum, true)
        compartmentLists = list.list
      }
      subSeatsBol = list.subSeatsBol
      subSeatsChar = list.subSeatsChar
      subSeatsNum = list.subSeatsNum
      this_old_subList = JSON.parse(JSON.stringify(that.data.subSeatsList))
    }
    subSeatsNum = that.addZero(subSeatsNum)
    hallTablesArray[hallIndex] = this_hall
    that.setData({
      showChoose: !that.data.showChoose,
      chosseType: chosseType,
      hallTablesArray: hallTablesArray,
      subSeatsChar: subSeatsChar,
      subSeatsNum: subSeatsNum,
      subSeatsList: subSeatsList,
      this_old_subList: this_old_subList,
      compartmentLists: compartmentLists
    })
  },
  showChooseChange: function (e) {
    let that = this
    that.setData({
      showChooseChange: !that.data.showChooseChange,
    })
  },
  changeType: function (e) {
    let that = this
    let subSeatsBol = that.data.subSeatsBol
    let subSeatsChar = that.data.subSeatsChar
    let subSeatsNum = that.data.subSeatsNum
    let list = []
    //切换类型
    if (e.currentTarget.dataset.item.isHall) {
      that.setData({
        hall_id: e.currentTarget.dataset.item.Item_id,
        tableType: e.currentTarget.dataset.item.Item_Name,
        isHall: true,
        table_name: '',
        table_id: '',
        way: 2
      })
      that.bindPickerChange(e)
    } else {
      that.setData({
        hall_id: e.currentTarget.dataset.item.Item_id,
        tableType: e.currentTarget.dataset.item.Item_Name,
        isHall: false,
        table_name: '',
        table_id: '',
        way: 2
      })
    }
    let hallIndex = that.data.hallIndex
    let hallTablesArray = that.data.hallTablesArray
    let this_hall = hallTablesArray[hallIndex]
    let compartmentLists = that.data.compartmentLists
    if (e.currentTarget.dataset.item.isHall) {
      list = that.showFenxiTip(this_hall, subSeatsBol, subSeatsChar, subSeatsNum, false)//进行显示处理
      this_hall = list.list
      hallTablesArray[hallIndex] = this_hall
    } else {
      list = that.showFenxiTip(compartmentLists, subSeatsBol, subSeatsChar, subSeatsNum, false)//进行显示处理
    }
    subSeatsBol = list.subSeatsBol
    subSeatsChar = list.subSeatsChar
    subSeatsNum = that.addZero(list.subSeatsNum)

    that.setData({
      hallTablesArray: hallTablesArray,
      subSeatsChar: subSeatsChar,
      subSeatsNum: subSeatsNum,
      compartmentLists: compartmentLists
    })
  },
  bindPickerChange: function (e) {
    var that = this
    //picker发送选择改变，携带值为', e.target.dataset.item.id
    this.setData({
      hallIndex: e.target.dataset.item.Item_id
    })
  },
  table_ChangeSubmit: function (e) {
    let that = this
    var hallTablesArray = that.data.hallTablesArray
    var hallIndex = that.data.hallIndex
    var table_name = hallTablesArray[hallIndex][parseInt(e.detail.value.area_nameGroup)].table_nickname
    var table_id = hallTablesArray[hallIndex][parseInt(e.detail.value.area_nameGroup)].table_id

    if (table_id != '' && table_name != '') {
      var before_table_id = that.data.thisorderarry.table_id
      var before_table_name = that.data.thisorderarry.table_name
      wx.request({
        url: app.globalData.UpdateOrderInf_url,
        data: {
          Order_id: that.data.orderid,
          Shop_id: that.data.shop_id,
          table_id: table_id,
          table_name: table_name,
          before_table_id: before_table_id,
          before_table_name: before_table_name,
          change_order_status: 1, // 视为同意修改
        },
        success: function (res) {
          if (res.data.result.result == 1) {
            //修改成功
            wx.request({
              url: app.globalData.UpdateTableInf_url,
              data: {
                Table_id: before_table_id,
                Shop_id: that.data.shop_id,
                Table_status: 1
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
              },
              method: 'POST',
              success: function (res) { },
            });
            wx.request({
              url: app.globalData.UpdateTableInf_url,
              data: {
                Table_id: table_id,
                Shop_id: that.data.shop_id,
                Table_status: 0
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
              },
              method: 'POST',
              success: function (res) { },
            });
            that.setData({
              showChoose: !that.data.showChoose,
            })
            that.redress()
            that.selectting()
          } else {
            wx.showToast({
              title: '网络异常,请刷新', //提示文字
              icon: 'none',
              duration: 2000, //显示时长
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请选择座位号', //提示文字
        icon: 'none',
        duration: 2000, //显示时长
        mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
      })
    }
  },
  table_fenxi: function (e) {
    let that = this
    let subSeatsList = that.data.subSeatsList
    let thisTableArray = that.data.thisTableArray
    let subSeatsChar = that.data.subSeatsChar

    if (subSeatsChar == '') {
      subSeatsChar = 'A'
    } else {
      subSeatsChar = String.fromCharCode(Number(subSeatsChar.charCodeAt(0)) + 1)
    }
    if (that.data.thisorderarry.order_id) {
      thisTableArray.subSeatsId = subSeatsChar + '-01'
      subSeatsList.unshift(thisTableArray)//添加数据到数组第一位
      //先清空当前订单的所有餐桌
      if (that.data.thisorderarry) {
        wx.request({ //大厅信息回显
          url: app.globalData.updateTableSubSeatsId_url,
          data: {
            orderId: that.data.thisorderarry.order_id
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
          },
          method: 'POST',
          success: function (res) {
            // 把数组中所有的桌子的id和分席改到数据库
            for (let i = 0; i < subSeatsList.length; i++) {
              wx.request({ //大厅信息回显
                url: app.globalData.UpdateTableInf_url,
                data: {
                  Shop_id: that.data.thisorderarry.shop_id,
                  Table_id: subSeatsList[i].table_id,
                  Table_status: 0,
                  subSeatsId: subSeatsList[i].subSeatsId,
                  Order_id: subSeatsList[0].order_id
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                },
                method: 'POST',
                success: function (res) {
                  that.setData({
                    showChoose: false,
                    chosseType: -1,
                  })
                }
              })
            }
            wx.showToast({
              title: '分席成功', //提示文字
              icon: 'none',
              duration: 2000, //显示时长
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
            })
            that.copyOrder_1(subSeatsList.length)
            that.selectting();
          }
        })
      }
      //分席选择框
    } else {
      let subSeatsBol = that.data.subSeatsBol
      wx.showToast({
        title: '分席成功', //提示文字
        icon: 'none',
        duration: 2000, //显示时长
        mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
      })
      if (subSeatsBol) {
        subSeatsChar = String.fromCharCode(Number(subSeatsChar.charCodeAt(0)) - 1)
      } else {
        let beforelist = {
          order_id: 0,
          shop_id: that.data.shop_id,
          table_id: that.data.thisorderarry.table_id,
          table_name: that.data.thisorderarry.table_name,
          table_status: 1,
          user_count: that.data.thisorderarry.user_count,
          table_nickname: that.data.thisorderarry.table_name,
          field_name: that.data.thisorderarry.table_name,
          checked: true,
          subSeatsId: subSeatsChar + '-01'
        }
        subSeatsList.unshift(beforelist)//添加数据到数组第一位
        subSeatsBol = true
      }
      that.setData({
        copyOrderNum: subSeatsList.length,
        subSeatsChar: subSeatsChar
      })
      //出单前，把所有菜的分席数改变
      // that.selectting();
      that.changeBeforeCopyOrder(subSeatsList.length);
      that.setData({
        showChoose: false,
        chosseType: -1,
        subSeatsBol: subSeatsBol
      })
    }
    //把选好的分席送到app里面存着
    app.globalData.subSeatsBol = that.data.subSeatsBol
    app.globalData.subSeatsChar = that.data.subSeatsChar
    app.globalData.subSeatsNum = that.data.subSeatsNum
    app.globalData.subSeatsList = that.data.subSeatsList
    app.globalData.this_old_subList = that.data.this_old_subList
  },
  selectting: function (e) {
    var that = this;
    let hailArray = [] // 大厅信息
    let tableArray = [] // 桌位信息
    let tablebfArray = [] // 包房信息
    // let tablesLists = [] // 大厅座位信息
    let compartmentLists = [] //包房信息
    let hallArray = [] //大厅名字列表
    let hallTablesArray = [] //大厅名字列表
    let applyList = []
    let subSeatsChar = ''
    let subSeatsNum = ''
    let thisTableArray = that.data.thisTableArray
    let subSeatsList = []
    let this_old_subList = that.data.this_old_subList
    wx.request({ //大厅信息回显,
      url: app.globalData.GetTablesInf_url,
      data: {
        Shop_id: app.globalData.shopdetail.shop_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      method: 'POST',
      success: function (res) {
        if (res.data) {
          //查询所有的厅和包房，并分组
          let subSeatsBol = that.data.subSeatsBol;//是否有当前订单的，分过席的桌子，有的话，设为true，跳过不同订单桌子的判断
          for (var i = 0; i < res.data.object.length; i++) { //大厅信息
            if (res.data.object[i].field_type == 0 && res.data.object[i].field_status == 1) {
              hailArray.push(res.data.object[i]);
              // tableArray.push(res.data.object[i]);
              for (var y = 0; y < res.data.object[i].tableManage.length; y++) {
                res.data.object[i].tableManage[y].table_nickname = res.data.object[i].field_name + ' ' + res.data.object[i].tableManage[y].table_name
                res.data.object[i].tableManage[y].field_name = res.data.object[i].field_name
                // res.data.object[i].tableManage[y].table_nickname = res.data.object[i].field_name + ' ' + res.data.object[i].tableManage[y].table_name + '号桌'
                res.data.object[i].tableManage[y].checked = false
                //下单后
                // if(that.data.thisorderarry.order_id){
                //先判断这张桌子是不是当前订单
                if (res.data.object[i].tableManage[y].order_id == that.data.thisorderarry.order_id) {
                  if (res.data.object[i].tableManage[y].subSeatsId) {
                    // 处于当期订单中的桌子，而且有分席id,把字符锁定为当前分席的字符
                    subSeatsChar = res.data.object[i].tableManage[y].subSeatsId.substring(0, 1)
                    // 编号取最大的那个
                    if (Number(subSeatsNum) >= Number(res.data.object[i].tableManage[y].subSeatsId.substring(2))) { } else {
                      subSeatsNum = res.data.object[i].tableManage[y].subSeatsId.substring(2)
                    }
                    subSeatsBol = true
                    subSeatsList.push(res.data.object[i].tableManage[y])
                  }
                } else {
                  //订单不同，如果还没找到相同且有分席的订单，则继续算下去
                  if (!subSeatsBol) {
                    //在这里加上ascll码判断分席
                    //判断是否有分席编号
                    if (res.data.object[i].tableManage[y].subSeatsId) {
                      //判断当前页面是否有存着分席编号
                      if (subSeatsChar != '') {
                        //如果当前的分席编号的ascll码大于等于餐桌的ascll吗，不管；反之替代
                        if (Number(subSeatsChar.charCodeAt(0)) >= Number(res.data.object[i].tableManage[y].subSeatsId.charCodeAt(0))) { } else {
                          subSeatsChar = res.data.object[i].tableManage[y].subSeatsId.substring(0, 1)
                        }
                      } else {
                        subSeatsChar = res.data.object[i].tableManage[y].subSeatsId.substring(0, 1)
                      }
                    }
                    //如果没有遇到本单的，固定为1
                    subSeatsNum = '01'
                  }
                }
                // }
                if (that.data.thisorderarry.table_id == res.data.object[i].tableManage[y].table_id) {
                  thisTableArray = res.data.object[i].tableManage[y]
                }
              }
              hallArray.push(res.data.object[i].field_name)
              hallTablesArray.push(res.data.object[i].tableManage)
              var item = {
                Item_id: applyList.length,
                Item_Name: res.data.object[i].field_name,
                isHall: true,
                checked: false
              }
              applyList.push(item)
            } else if (res.data.object[i].field_type == 1 && res.data.object[i].field_status == 1) { // 字段类型:field_type
              for (var y = 0; y < res.data.object[i].tableManage.length; y++) {
                res.data.object[i].tableManage[y].table_nickname = res.data.object[i].field_name + '房' + res.data.object[i].tableManage[y].table_name
                res.data.object[i].tableManage[y].field_name = res.data.object[i].field_name + '房'
                res.data.object[i].tableManage[y].checked = false
                //下单后
                if (that.data.thisorderarry.order_id) {
                  //先判断这张桌子是不是当前订单
                  if (res.data.object[i].tableManage[y].order_id == that.data.thisorderarry.order_id) {
                    if (res.data.object[i].tableManage[y].subSeatsId) {
                      // 处于当期订单中的桌子，而且有分席id,把字符锁定为当前分席的字符
                      subSeatsChar = res.data.object[i].tableManage[y].subSeatsId.substring(0, 1)
                      // 编号取最大的那个
                      if (Number(subSeatsNum) >= Number(res.data.object[i].tableManage[y].subSeatsId.substring(2))) { } else {
                        subSeatsNum = res.data.object[i].tableManage[y].subSeatsId.substring(2)
                      }
                      subSeatsBol = true
                      subSeatsList.push(res.data.object[i].tableManage[y])
                    }
                  } else {
                    //订单不同，如果还没找到相同且有分席的订单，则继续算下去
                    if (!subSeatsBol) {
                      //在这里加上ascll码判断分席
                      //判断是否有分席编号
                      if (res.data.object[i].tableManage[y].subSeatsId) {
                        //判断当前页面是否有存着分席编号
                        if (subSeatsChar != '') {
                          //如果当前的分席编号的ascll码大于等于餐桌的ascll吗，不管；反之替代
                          if (Number(subSeatsChar.charCodeAt(0)) >= Number(res.data.object[i].tableManage[y].subSeatsId.charCodeAt(0))) { } else {
                            subSeatsChar = res.data.object[i].tableManage[y].subSeatsId.substring(0, 1)
                          }
                        } else {
                          subSeatsChar = res.data.object[i].tableManage[y].subSeatsId.substring(0, 1)
                        }
                      }
                      //如果没有遇到本单的，固定为1
                      subSeatsNum = '01'
                    }
                  }
                }
                compartmentLists.push(res.data.object[i].tableManage[y])

                if (that.data.thisorderarry.table_id == res.data.object[i].tableManage[y].table_id) {
                  thisTableArray = res.data.object[i].tableManage[y]
                }
              }
            }
          }
          var item = {
            Item_id: applyList.length,
            Item_Name: '包房',
            isHall: false,
            checked: false
          }
          applyList.push(item)
          subSeatsNum = that.addZero(subSeatsNum)
          if (app.globalData.subSeatsBol) {
            // 截胡:如果这个分席参数为true，则说明全局上有这分席的判断，可能离开这个页面去加菜了，导致当前页面data数据丢失，现在要重新拿出来
            subSeatsBol = app.globalData.subSeatsBol
            subSeatsChar = app.globalData.subSeatsChar
            subSeatsNum = app.globalData.subSeatsNum
            subSeatsList = app.globalData.subSeatsList
            this_old_subList = app.globalData.this_old_subList
          }
          that.setData({
            xql: tableArray, //原始信息
            tablebfArray: tablebfArray,
            tableArray: tableArray,
            hailArray: hailArray,
            // tablesLists: tablesLists,
            compartmentLists: compartmentLists,
            hallTablesArray: hallTablesArray,
            hallArray: hallArray,
            applyList: applyList,
            subSeatsChar: subSeatsChar,
            subSeatsNum: subSeatsNum,
            subSeatsBol: subSeatsBol,
            thisTableArray: thisTableArray,
            subSeatsList: subSeatsList,
            this_old_subList: this_old_subList
          })
        }
      },
    })
  },
  // 转单 转到包房订单
  hall_Bindsubmit: function (e) {
    let that = this
    var compartmentLists = that.data.compartmentLists
    compartmentLists[parseInt(e.detail.value.area_nameGroup)].checked = true
    var table_id = compartmentLists[parseInt(e.detail.value.area_nameGroup)].table_id
    var table_name = compartmentLists[parseInt(e.detail.value.area_nameGroup)].table_nickname
    var tableItem = compartmentLists[parseInt(e.detail.value.area_nameGroup)]

    if (table_id != '' && table_name != '') {
      var before_table_id = that.data.thisorderarry.table_id
      var before_table_name = that.data.thisorderarry.table_name
      wx.request({
        url: app.globalData.UpdateOrderInf_url,
        data: {
          Order_id: that.data.orderid,
          Shop_id: that.data.shop_id,
          table_id: table_id,
          table_name: table_name,
          before_table_id: before_table_id,
          before_table_name: before_table_name,
          change_order_status: 1, // 视为同意修改
        },
        success: function (res) {
          if (res.data.result.result == 1) {
            //修改成功
            that.setData({
              compartmentLists: compartmentLists,
              showChoose: !that.data.showChoose,
            })
            wx.request({
              url: app.globalData.UpdateTableInf_url,
              data: {
                Table_id: before_table_id,
                Shop_id: that.data.shop_id,
                Table_status: 1
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
              },
              method: 'POST',
              success: function (res) { },
            });
            wx.request({
              url: app.globalData.UpdateTableInf_url,
              data: {
                Table_id: table_id,
                Shop_id: that.data.shop_id,
                Table_status: 0
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
              },
              method: 'POST',
              success: function (res) { },
            });
            that.redress()
            that.selectting()
          } else {
            wx.showToast({
              title: '网络异常,请刷新', //提示文字
              icon: 'none',
              duration: 2000, //显示时长
              mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
            })
          }
        }
      })
    } else {
      wx.showToast({
        title: '请选择座位号', //提示文字
        icon: 'none',
        duration: 2000, //显示时长
        mask: true, //是否显示透明蒙层，防止触摸穿透，默认：false  
      })
    }
  },
  //显示菜品介绍的弹框
  showIntroduction: function () {
    this.setData({
      showIntroduction: !this.data.showIntroduction
    })
  },
  //没办法
  showIntroduction1: function () {
    this.setData({
      showIntroduction1: !this.data.showIntroduction1
    })
  },
  //+1
  showIntroduction2: function () {
    this.setData({
      showIntroduction2: !this.data.showIntroduction2
    })
  },
  change_hallcheck: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    if (e.currentTarget.dataset.type == "0") {
      var hallIndex = that.data.hallIndex
      var hallTablesArray = that.data.hallTablesArray
      var this_hall = hallTablesArray[hallIndex]
      var this_bol = this_hall[index].checked
      for (var i = 0; i < this_hall.length; i++) {
        this_hall[i].checked = false
      }
      if (this_bol) {
        this_hall[index].checked = false
      } else {
        this_hall[index].checked = true
      }
      hallTablesArray[hallIndex] = this_hall
      that.setData({
        hallTablesArray: hallTablesArray
      })
    } else {
      var compartmentLists = that.data.compartmentLists
      var this_hall = compartmentLists
      var this_bol = this_hall[index].checked
      for (var i = 0; i < this_hall.length; i++) {
        this_hall[i].checked = false
      }
      if (this_bol) {
        this_hall[index].checked = false
      } else {
        this_hall[index].checked = true
      }
      compartmentLists = this_hall
      that.setData({
        compartmentLists: compartmentLists
      })
    }
  },
  change_hallcheck1: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    var subSeatsChar = that.data.subSeatsChar
    let subSeatsNum = that.data.subSeatsNum
    let subSeatsList = that.data.subSeatsList

    if (e.currentTarget.dataset.type == "0") {
      var hallIndex = that.data.hallIndex
      var hallTablesArray = that.data.hallTablesArray
      var this_hall = hallTablesArray[hallIndex]
      var this_bol = this_hall[index].checked

      if (subSeatsChar == '') {
        subSeatsChar = 'A'
      } else {
        if (that.data.subSeatsBol) {
          //当前订单有分席，直接用subSeatsChar
        } else {
          subSeatsChar = String.fromCharCode(Number(subSeatsChar.charCodeAt(0)) + 1)
        }
      }
      if (e.currentTarget.dataset.item.table_status == 0 && (e.currentTarget.dataset.item.order_id != that.data.thisorderarry.order_id)) {
        // 使用中，不能分席
        wx.showToast({
          title: '请选择空桌', //提示文字
          icon: 'none',
          duration: 2000, //显示时长 
        })
      } else {
        if (this_bol) {
          this_hall[index].checked = false
          let changeSubNum = Number(this_hall[index].subSeatsId.substring(2))
          this_hall[index].subSeatsId = ''
          if (subSeatsList) {
            for (let i = 0; i < subSeatsList.length; i++) {
              if (subSeatsList[i].table_id == this_hall[index].table_id) {
                subSeatsList.splice(i, 1)
                for (let n = 0; n < subSeatsList.length; n++) {
                  // subSeatsList[i].subSeatsId = subSeatsChar + that.addZero(i+2)
                  if (Number(subSeatsList[n].subSeatsId.substring(2)) > changeSubNum) {
                    subSeatsList[n].subSeatsId = subSeatsChar + '-' + that.addZero(Number(subSeatsList[n].subSeatsId.substring(2)) - 1)
                  }
                }
                subSeatsNum = Number(subSeatsNum) - 1
                break;
              }
            }
          }
        } else {
          this_hall[index].checked = true
          subSeatsNum = Number(subSeatsNum) + 1
          this_hall[index].subSeatsId = subSeatsChar + '-' + that.addZero(subSeatsNum)
          //把选中的桌放入数组
          subSeatsList.push(this_hall[index])
        }
        hallTablesArray[hallIndex] = this_hall
        subSeatsNum = that.addZero(subSeatsNum)
        that.setData({
          hallTablesArray: hallTablesArray,
          subSeatsNum: subSeatsNum
        })
      }
    } else {
      var compartmentLists = that.data.compartmentLists
      var this_hall = compartmentLists
      var this_bol = this_hall[index].checked
      var subSeatsChar = that.data.subSeatsChar
      let subSeatsNum = that.data.subSeatsNum
      let subSeatsList = that.data.subSeatsList

      if (subSeatsChar == '') {
        subSeatsChar = 'A'
      } else {
        if (that.data.subSeatsBol) {
          //当前订单有分席，直接用subSeatsChar
        } else {
          subSeatsChar = String.fromCharCode(Number(subSeatsChar.charCodeAt(0)) + 1)
        }
      }
      if (e.currentTarget.dataset.item.table_status == 0 && (e.currentTarget.dataset.item.order_id != that.data.thisorderarry.order_id)) {
        // 使用中，不能分席
        wx.showToast({
          title: '请选择空桌', //提示文字
          icon: 'none',
          duration: 2000, //显示时长 
        })
      } else {
        if (this_bol) {
          this_hall[index].checked = false
          let changeSubNum = Number(this_hall[index].subSeatsId.substring(2))
          this_hall[index].subSeatsId = ''
          if (subSeatsList) {
            for (let i = 0; i < subSeatsList.length; i++) {
              if (subSeatsList[i].table_id == this_hall[index].table_id) {
                subSeatsList.splice(i, 1)
                for (let n = 0; n < subSeatsList.length; n++) {
                  // subSeatsList[i].subSeatsId = subSeatsChar + that.addZero(i+2)
                  if (Number(subSeatsList[n].subSeatsId.substring(2)) > changeSubNum) {
                    subSeatsList[n].subSeatsId = subSeatsChar + '-' + that.addZero(Number(subSeatsList[n].subSeatsId.substring(2)) - 1)
                  }
                }
                subSeatsNum = Number(subSeatsNum) - 1
                break;
              }
            }
          }
        } else {
          this_hall[index].checked = true
          subSeatsNum = Number(subSeatsNum) + 1
          this_hall[index].subSeatsId = subSeatsChar + '-' + that.addZero(subSeatsNum)
          //把选中的桌放入数组
          subSeatsList.push(this_hall[index])
        }
        compartmentLists[hallIndex] = this_hall
        subSeatsNum = that.addZero(subSeatsNum)
        that.setData({
          compartmentLists: compartmentLists,
          subSeatsNum: subSeatsNum
        })
      }
    }
  },

  changeOrder_hallcheck: function (e) {
    var that = this
    that.setData({
      zhandan_tableName: e.currentTarget.dataset.item.table_nickname,
      zhandan_tableId: e.currentTarget.dataset.item.table_id,
      // zhandan_orderId: e.currentTarget.dataset.item.order_id,
      xuanzezhege: e.currentTarget.dataset.index
    })
    that.whetherToOrderAccordingTheSeat(app.globalData.shopdetail.shop_id, e.currentTarget.dataset.item.table_id)
  },
  whetherToOrderAccordingTheSeat: function (shop_id, table_id) {
    var that = this
    //选择订单
    wx.request({
      url: app.globalData.whetherToOrderAccordingTheSeatInServer_url,
      data: {
        shop_id: shop_id,
        table_id: table_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      method: 'POST',
      success: function (res) {
        if (res.data.orders != "") {
          //存在订单
          var listOrderList = []
          for (var x of res.data.orders.orderId_dine) {
            listOrderList.push(x)
          }
          for (var x of res.data.orders.orderId_directy) {
            listOrderList.push(x)
          }
          for (var x of res.data.orders.orderId_online) {
            listOrderList.push(x)
          }
          if (listOrderList.length == 1) {
            that.setData({
              listOrderList: listOrderList,
              zhandan_orderId: listOrderList[0].orderId,
            })
            that.quedingzhuandan()
          } else {
            that.setData({
              listOrderList: listOrderList,
              showOrderList: true
            })
          }
        }
      },
      complete: function (res) {
      }
    })
  },
  chooseTaste: function (event) {
    var that = this
    if (!that.data.showTaste) {
      //打开口味
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
    } else {
      //关闭口味
      that.setData({
        showTaste: false
      })
    }
  },
  // 选择常用口味,还要回显到备注框里
  submitTaste: function (event) {
    var that = this;
    var tastesRemark = ''
    if (event.detail != null && event.detail != '') {
      var tastes = event.detail.split(',')
      for (var x = 0; x < tastes.length; x++) {
        tastes[x] = "[" + tastes[x] + "]"
      }
      tastesRemark = tastes.join(" ")
      //选择的口味：" + tastesRemark
      this.setData({
        tastes: event.detail,
        tastesRemark: tastesRemark,
        showTaste: !this.data.showTaste
      })
      this.commonSpecType8(3, event.detail)
    } else {
      wx.showToast({
        title: '请选择口味',
        icon: 'none',
        duration: 2000,
        success: function () { }
      })
    }
  },
  // 将tastes转为tastesRemark回显
  tastesRemark(tastes) {
    var tastesRemark = ""
    if (tastes != null && tastes != '') {
      var tastes = tastes.split(',')
      for (var x = 0; x < tastes.length; x++) {
        tastes[x] = "[" + tastes[x] + "]"
      }
      tastesRemark = tastes.join(" ")
    }
    return tastesRemark;
  },
  // 测试支付的方法
  pay_success: function () {
    var that = this;
    if (app.globalData.server_name == "test.fsmbdlkj.com") {
      wx.request({
        url: app.globalData.GetOrderPaymentInf_url,
        data: {
          Order_id: that.data.thisorderarry.order_id
        },
        success(res) {
          wx.request({
            url: app.globalData.UpdateOrderPaymentInf_url,
            data: {
              Order_payment_id: res.data.object[0].order_payment_id,
              Shop_id: that.data.shop_id,
              order_id: that.data.thisorderarry.order_id,
              Payment_status: 2
            },
            success(res) {
              if (res.data.result.result == 1) {
                wx.request({
                  url: app.globalData.UpdateOrderInf_url,
                  data: {
                    Order_id: that.data.thisorderarry.order_id,
                    Shop_id: that.data.shop_id,
                    Order_status: '已买单'
                  },
                  success(res) {
                    if (res.data.result.result == 1) {
                      //修改订单信息：", res 支付成功
                      wx.showToast({
                        title: '支付成功', //提示文字
                        duration: 2000, //显示时长
                      })
                      that.redress()
                    }
                  }
                }) //修改订单信息
              }
            }
          }) //修改订单支付状态
        }
      }) //GetOrderPaymentInf接口，获取order_payment_id
    } else {
      //正式服不生效
    }
  },
  //  多拼粥，关闭食材选择弹窗 
  closeMaterial: function () {
    var that = this
    that.setData({
      showMaterial: false,
      // porridgeObject:{},
      // porridgeObjectList:[],
    })
  },
  //  多拼粥，关闭食材选择弹窗 
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
  // 选择常用口味,还要回显到备注框里
  submitMaterial: function (event) {
    //关闭多拼粥材料
    this.setData({
      porridgeObjectList: event.detail.porridgeObjectList,
      porridgeObject: event.detail.porridgeObject,
      porridgeBackObject: event.detail.porridgeObject,
      showMaterial: !this.data.showMaterial
    })
  },
  //多规格多做法获取规格
  selectEatmethodAndSpec: function (e) {
    var that = this
    wx.request({
      url: app.globalData.SelectEatingMethodWithSpecification,
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
        var thisEMA = that.data.eatMethodArray
        var num1 = -1;
        var num2 = -1;
        if (res.data.object != null) {
          for (var i = 0; i < res.data.object.length; i++) {
            if (thisEMA[0].id == res.data.object[i].id) {
              num1 = i
              for (var n = 0; n < res.data.object[i].dishesSpec.length; n++) {
                if (res.data.object[i].dishesSpec[n].spec_id == thisEMA[0].dishesSpec.spec_id) {
                  num2 = n
                  thisEMA[0].checked = false
                  thisEMA[0].number = ''
                  thisEMA[0].place = thisEMA[0].em_name
                  thisEMA[0].additional = thisEMA[0].money
                  thisEMA[0].practice = thisEMA[0].eating_method
                  thisEMA[0].price = thisEMA[0].money
                  thisEMA[0].tastes = ""
                  thisEMA[0].tastesRemark = ""
                  thisEMA[0].remarks = ""
                  thisEMA[0].SideDishList = []
                  thisEMA[0].SideDishList_choose = []
                }
              }
            }
          }
        }
        //that.selectComponent('#SMEMV').temp2(num1,num2,true,res.data.object[num1].dishesSpec,thisEMA);
      }
    })
  },
  //来料加工，公用方法, type 1-快捷备注，2-输入备注 3-口味
  commonSpecType8: function (type, str) {
    if (this.data.dishesitem != null) {
      if (this.data.dishesitem.dishes_spec_type == 8 || this.data.dishesitem.dishes_spec_type == 2) {
        //来料加工
        var remark = '';
        if (this.data.eatMethodChooseIndex == -1) {
          //全部位 that.data.en_index, that.data.en_basicarry
          switch (type) {
            case 1:
              remark = remarkJS.joinRemarkStr(str, this.data.dishes_remark);
              this.data.dishesitem.dishes_remark = remark;
              break;
            case 2:
              remark = remarkJS.joinRemarkStr(this.data.quickRemark, str);
              this.data.dishesitem.dishes_remark = remark;
              break;
            case 3:
              this.data.dishesitem.tastesRemark = this.data.tastesRemark;
              break;
          }
        } else {
          //分部位 that.data.em_index, that.data.em_basicarry
          var chooseIndex = this.data.eatMethodChooseIndex;
          if (this.data.dishes.weighingByLocation == 1 && this.data.dishesitem.isWhole == false) {
            var chooseItem = this.data.em_index[chooseIndex];
            remark = remarkJS.splitRemarkStr(chooseItem.remarks, 1);
            var quickRemark = remarkJS.splitRemarkStr(chooseItem.remarks, 0);
            switch (type) {
              case 1:
                remark = remarkJS.joinRemarkStr(str, remark);
                this.data.em_index[chooseIndex].remarks = remark;
                this.data.em_basicarry[chooseIndex].remarks = remark;
                break;
              case 2:
                remark = remarkJS.joinRemarkStr(quickRemark, str);
                this.data.em_index[chooseIndex].remarks = remark;
                this.data.em_basicarry[chooseIndex].remarks = remark;
                break;
              case 3:
                this.data.em_index[chooseIndex].tastes = str;
                this.data.em_basicarry[chooseIndex].tastes = str;
                this.data.em_index[chooseIndex].tastesRemark = str;
                this.data.em_basicarry[chooseIndex].tastesRemark = str;
                break;
            }
          } else {
            var chooseItem = this.data.en_index[chooseIndex];
            remark = remarkJS.splitRemarkStr(chooseItem.remarks, 1);
            var quickRemark = remarkJS.splitRemarkStr(chooseItem.remarks, 0);
            switch (type) {
              case 1:
                remark = remarkJS.joinRemarkStr(str, remark);
                this.data.en_index[chooseIndex].remarks = remark;
                this.data.en_basicarry[chooseIndex].remarks = remark;
                break;
              case 2:
                remark = remarkJS.joinRemarkStr(quickRemark, str);
                this.data.en_index[chooseIndex].remarks = remark;
                this.data.en_basicarry[chooseIndex].remarks = remark;
                break;
              case 3:
                this.data.en_index[chooseIndex].tastes = str;
                this.data.en_basicarry[chooseIndex].tastes = str;
                this.data.en_index[chooseIndex].tastesRemark = str;
                this.data.en_basicarry[chooseIndex].tastesRemark = str;
                break;
            }
          }
        }
      }
    }
  },
  hideRemark: function () {
    //hideRemark
    this.setData({
      quickRemark: '',
      dishes_remark: ''
    })
  },
  //2020-11-26 取消订单(下单前）
  cancelOrderNoOrderId: function () {
    wx.showModal({
      title: '提示',
      content: '是否取消订单',
      cancelText: "否",
      confirmText: "是",
      success(res) {
        if (res.confirm) {
          //确认
          app.globalData.cartList = [];
          app.globalData.cupNumber = 0;
          app.globalData.sumMonney = 0;
          app.globalData.Order_remark = '';
          app.globalData.Order_quick_remark = '';
          wx.navigateBack({
            delta: 1
          })
        } else if (res.cancel) {
          //用户点击取消
        }
      }
    })
  },
  //2020-11-27 取消订单（下单后/加菜）
  cancelOrder: function () {
    //取消订单
    app.globalData.cartList = [];
    app.globalData.cupNumber = 0;
    app.globalData.sumMonney = 0;
    app.globalData.Order_remark = '';
    app.globalData.Order_quick_remark = '';
    var that = this;
    var orderId = that.data.orderid;
    wx.request({
      url: app.globalData.UpdateOrderInf_url,
      data: {
        Order_id: orderId,
        Shop_id: app.globalData.shopdetail.shop_id,
        Order_status: '已取消',
        operator: app.globalData.loginname,
        operation_time: time.formatTime(new Date())
      },
      success: function (res) {
        wx.showToast({
          title: '取消订单成功', //提示文字
          duration: 2000, //显示时长
          icon: 'none', //图标，支持"success"、"loading"
        })
        if (res.data.result.cause == "Update success.") {
          that.recordConfirmationInf(0, "取消订单", null);
          that.setData({
            showCancel: false,
            cancelFoodItem: '',
            cancelRemark: '',
            cancellation: '操作失误',
            cancelType: '',
            readyToAddMeals: false
          })
          that.redress() //矫正金额和获取订单
        }
      },
    })
  },
  showCancelOrderModel: function () {
    var orderId = this.data.orderid;
    var that = this;
    wx.showModal({
      title: '提示',
      content: '是否取消订单',
      cancelText: "否",
      confirmText: "是",
      success(res) {
        if (res.confirm) {
          if (orderId != null && orderId != "") {
            that.setData({
              showCancel: true,
              needToReconfirmOffer: true,
              cancelRemark: '',
              cancelType: 1
            })
          }
        } else if (res.cancel) {
          //用户点击取消
          that.setData({
            showCancel: false,
            cancelFoodItem: '',
            cancelRemark: '',
            cancellation: '操作失误',
            cancelType: ''
          })
        }
      }
    })
  },
  showFenxiTip: function (list, subSeatsBol, subSeatsChar, subSeatsNum, clearChoose) {
    let that = this
    let returnList = []
    let thisorderarry = that.data.thisorderarry
    let subSeatsList = JSON.parse(JSON.stringify(that.data.subSeatsList))
    if (that.data.thisorderarry.order_id) {
    } else {
      that.data.thisorderarry.table_id = app.globalData.locationid
    }
    if (list.length) {
      for (var i = 0; i < list.length; i++) {
        if (clearChoose) { //清空选择
          list[i].checked = false
        }
        if (list[i].order_id == that.data.thisorderarry.order_id) {
          list[i].checked = true
        }
        if (list[i].table_id == that.data.thisorderarry.table_id) {
          //如果id相同，则显示为当前桌为分席第一桌
          if (subSeatsChar) {
            //当前店铺有分席
            let num
            if (subSeatsBol) {
              //分席竟是我自己？
              num = subSeatsChar
            } else {
              //快乐都是别人的
              num = String.fromCharCode(Number(subSeatsChar.charCodeAt(0)) + 1)
              //  subSeatsChar = num
              if (clearChoose) {//清空选择
                subSeatsNum = '01'
              }
            }
            list[i].subSeatsId = num + '-01'
          } else {
            list[i].subSeatsId = 'A-01'
            if (clearChoose) {//清空选择
              subSeatsNum = '01'
            }
          }
          if (that.data.thisorderarry.order_id) {
          } else {
            //没有订单id，餐桌相同时，给个选择标识
            list[i].checked = true
          }
        } else {
          if (list[i].table_status != 0) {
            // 非使用状态,清空分席，防止二次打开标签残留
            if (clearChoose) { //清空选择
              list[i].subSeatsId = ''
            }
          }
        }
        if (that.data.thisorderarry.order_id) {
        } else {
          for (let n = 0; n < subSeatsList.length; n++) {
            if (subSeatsList[n].table_id == list[i].table_id) {
              list[i].subSeatsId = subSeatsList[n].subSeatsId
              list[i].checked = true
            }
          }
        }
      }
      returnList.list = list
      returnList.subSeatsBol = subSeatsBol
      returnList.subSeatsChar = subSeatsChar
      returnList.subSeatsNum = subSeatsNum
      return returnList
    }
  },
  addZero: function (e) {
    let num = e
    //补零操作
    if (Number(num) < 10) {
      num = '0' + num
    }
    return num
  },
  //2020-12-04 通用方法 菜品属性显示
  pageageCheckListData: function (listData, item) {
    if (listData != '') {
      for (var i = 0; i < listData.length; i++) {
        if (listData[i].value.indexOf("标单") != -1) {
          if (item.freeOrder == 1) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
        if (listData[i].value.indexOf("补单") != -1) {
          if (item.repairOrder == 1) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
        if (listData[i].value.indexOf("赠送") != -1) {
          if (item.item_type == 5) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
        if (listData[i].value.indexOf("分席") != -1 && listData[i].value.indexOf("不分席") == -1) {
          if (item.copyOrder > 1) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
        if (listData[i].value.indexOf("不分席") != -1) {
          if (item.copyOrder == 1 && item.bufenxi == 1) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
        if (listData[i].value.indexOf("叫起") != -1) {
          if (item.waitOrder == 1) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
        if (listData[i].value.indexOf("即上") != -1) {
          if (item.waitOrder == 0) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
        if (listData[i].value.indexOf("赠送") != -1) {
          if (item.item_type == 5) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
        if (listData[i].value.indexOf("打包") != -1) {
          if (item.baleOrder == 1) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
        if (listData[i].value.indexOf("转单") != -1) {
          if (item.transferOrder == 1) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
        if (listData[i].value.indexOf("加急") != -1) {
          if (item.waitOrder == 2) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
        if (listData[i].value.indexOf("先出单") != -1) {
          if (item.firstIssue == 1) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
        if (listData[i].value.indexOf("催单") != -1) {
          if (item.remindOrder == 1) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
        if (listData[i].value.indexOf("寄存") != -1 && app.globalData.listDataAll.indexOf("寄存")) {
          if (item.depositOrder > 0) {
            listData[i].checked = true
          } else {
            listData[i].checked = false
          }
        }
      }
    }
    return listData;
  },
  //改变下单前所有菜品的分席份数
  changeBeforeCopyOrder: function (copyNum) {
    let that = this;
    let cartList = that.data.cartList
    for (let i = 0; i < cartList.length; i++) {
      if (cartList[i].bufenxi == null || cartList[i].bufenxi == 0) {
        cartList[i].copyOrder = copyNum;
      }
    }
    that.mangnerCarList(cartList)//整理购物车
  },

  //权限不足时调用此方法
  jump: function (e) {
    jurisdiction.permissionShow()
  },

  //整合订单详情中的菜品信息
  createDetailItem: function (addTemp, cartListItem, orderId) {
    var that = this;
    var nowtime = time.formatTime(new Date);
    let item_type = cartListItem.item_type;
    if (item_type == 2 && that.data.firstIssue == 1) {
      //这是来料加工先出单，把菜品改回正常
      item_type = 0;
    }
    var item = {
      "user_id": app.globalData.user_id,
      "dishes_id": cartListItem.dishes_id,
      "dishes_status": 5,
      "item_type": item_type,
      "order_id": orderId,
      "spec_id": cartListItem.weighing,
      "praise_flag": 0,
      "userchecked": 0,
      "operatorchecked": 2,
      "dishes_img": cartListItem.img_url,
      "dishes_name": cartListItem.name,
      "dishes_metering_type": cartListItem.dishes_metering_type,
      "spec_name": cartListItem.spec_name,
      "operator": that.data.loginname, //操作人员记录
      "operation_time": nowtime, //订单操作时间
      "specal_type": cartListItem.specal_type,
      "u_item_number": 0, //初始化未减菜的份数0
      "u_measurement_value": 0, //初始化修改后的重量
      "dishes_index": cartListItem.dishes_index,
      "initial_number": 1, // 初始菜品份数,称重菜品视为一份
      "jointSet": '',
      "freeOrder": cartListItem.freeOrder,
      "repairOrder": cartListItem.repairOrder,
      "copyOrder": cartListItem.copyOrder,
      "waitOrder": cartListItem.waitOrder,
      "baleOrder": cartListItem.baleOrder,
      "transferOrder": cartListItem.transferOrder,
      "depositOrder": cartListItem.depositOrder,
      "weighingByLocation":cartListItem.weighingByLocation,
      "shop_id":that.data.shop_id,
      "spec_type": cartListItem.spec_type
    }
    item = Object.assign(item, addTemp);
    return item;
  },

//催单接口，全催单、单个菜品催单
allReminder(){
  let that = this 
  var sendData={
    cuidanNum: 2,			//1为单个催单，全催单大于1即可
    shop_id: that.data.shop_id,		//商家id
    order_id: parseInt(that.data.orderid),	//订单id  （必填）
    operator_id: "0",		//修改人表主id （必填）
    operator_name: " ",	//修改人名称 （必填）
    user_id: parseInt(that.data.thisorderarry.user_id),			//修改人用户id （必填）
  }
  console.log(sendData)
  // WXAPI.cuidanServlet(sendData).then(function (data) {
  // })
  // console.log(data);
  wx.request({
    url: app.globalData.CuidanServlet_url,
    data: sendData,
    success:res=>{
      console.log(res.data,'催单');
      if(res.data === 100){
        wx.showModal({
          title: '提示',
          content: '间隔时间未到不能催单!',
          showCancel: false
        })
      }else{
        wx.request({
          url: app.globalData.GetOrderDetails_url,
          data:{
           Order_id:parseInt(that.data.orderid)
          },
          success:res=>{
            wx.showToast({
              title: '催单成功',
            })
            setTimeout(function () {
              that.setData({
                needToReconfirmOffer: true
              })
              that.redress()
            }, 300)
            var minReminderNum = 0
             for(var i = 0;i < res.data.object.length; i++){
               console.log(res.data.object[i].reminderNum,'催单次数');
               var minReminderNum = res.data.object[i].reminderNum
               if (res.data.object[i].reminderNum < minReminderNum){ 
                minReminderNum = res.data.object[i].reminderNum; 
              } 
             }
             that.setData({
              minReminderNum: minReminderNum
             })
          }
        })
      }
    }
  })
},

  //催单接口，全催单、单个菜品催单
  cuidanFunc: function (sendData) {
    WXAPI.cuidanServlet(sendData).then(function (data) {
      console.log(data);
      if(data === 100){
         wx.showModal({
         title: '提示',
         content: '间隔时间未到不能催单!',
         showCancel: false
     }) 
    }else if(data === 101){
      wx.showToast({
        title: '催单成功',
      })
     
    }
    })
    
    // wx.request({
    //   url: 'http://localhost:8080/food_material/Servlet/cuidanServlet',
    //   data: sendData,
    //   success:res=>{
    //     console.log(res);
    //   }
    // })
  },
  changeLock: function () {
    this.setData({
      readonly: !this.data.readonly
    })
  },
  qitayuanyin: function () {
    this.setData({
      qitayuanyin: !this.data.qitayuanyin
    })
  },
  qitayuanyin1: function () {
    this.setData({
      qitayuanyin1: !this.data.qitayuanyin1
    })
  },

  toVipPhone:function(e){
    this.setData({vipPhone:e.detail.value})
    if(e.detail.value.length == 11 || e.detail.value.length == 0){
      if(this.data.vipCheck2){
        this.setData({
          vipCheck2: false
        })
      }
    }
  },
  toVipCard:function(e){
    this.setData({vipCard:e.detail.value})
  },

  choosePackage(e){
    if(e.currentTarget.dataset.dishesitem.id){
      wx.navigateTo({
        url: "../module_discount/pages/packagePage/packagePage?dishesId=" +  e.currentTarget.dataset.dishesitem.dishes_id +'&statu=0&id='+
        e.currentTarget.dataset.dishesitem.id + "&dishes_name=" +  e.currentTarget.dataset.dishesitem.dishes_name + "&item_subtotal=" + e.currentTarget.dataset.dishesitem.item_subtotal
        + "&item_number=" + e.currentTarget.dataset.dishesitem.item_number  + "&image=" + e.currentTarget.dataset.dishesitem.dishes_img
      })
    }else {
      wx.navigateTo({
        url: "../module_discount/pages/packagePage/packagePage?dishesId=" +  e.currentTarget.dataset.dishesitem.dishes_id +'&statu=0'
        + "&dishes_name=" +  e.currentTarget.dataset.dishesitem.name + "&item_subtotal=" + e.currentTarget.dataset.dishesitem.sum
        + "&item_number=" + e.currentTarget.dataset.dishesitem.number + "&constituteTypeList=" + JSON.stringify(e.currentTarget.dataset.dishesitem.constituteTypeList) + "&image=" + e.currentTarget.dataset.dishesitem.img_url
      })
    }
    
  }
})