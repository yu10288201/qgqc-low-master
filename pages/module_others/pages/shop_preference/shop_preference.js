const app = getApp();
var util = require('../../../../utils/util.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    isShowMore1: false,
    isShowMore2: false,
    webkitline1: 3,
    webkitline2: 3,
    textarea: true, //textarea层级太高，影响模态框的显示，动态显隐textarea
    shop_pre_save: true,
    shop_pre_alter: false,
    store_manager_value: '',
    store_manager_contact_number_value: '',
    contact_number_value: '',
    contact_phone_number_value: '',
    business_hours_value: '',
    latitude: '',
    longitude: '',
    GPSValue: '',
    shop_type_list: [],
    shop_name: '',
    shop_nickname_array: [],
    scroll_height: '',
    scroll_height2: 0,
    listIndex: 100000,
    shop_type_value: '',
    shop_nickname_value: '',
    shop_nickname_id: '',
    items: [], //店铺类型存放总列表
    hiddenview: false, //店铺类型模态框的显示与否
    prestoreMoneyStart: '', //预存金额1值
    prestoreMoneyEnd: '', //预存金额2值
    prestoreName: '', //预存活动名称
    givingAmount: '', //赠送金额
    preferentCount: '', //优惠券数值
    preferentMoney: '', //优惠券面值
    preferentDiscount: '', //折扣值
    describes_value: '', //优惠礼物值
    announcement_value: '', //优惠规则
    effectiveDay: '', //有效天数
    //店铺优惠
    describes: '', //打折礼物
    announcement: '', //优惠规则
    shop_pre_array: [], //店铺优惠信息
    shopId: '', //商品id
    deductionProportion: '', //抵扣比例
    pid: '', //优惠id
    statusSelect: ['启用', '停用'],
    useStatus: 0, //规则使用状态
    startTime: '',
    endTime: '',
    isSuper: [{
      name: 1,
      value: '是'
    }, {
      name: 0,
      value: '否',
      checked: 'true'
    }],
    chooseSuper: 0,
  },

  shop_pre_choice(e) { //店铺优惠信息选择触发函数
    var that = this;
    let a = e.currentTarget.dataset.index
    var superList = that.data.isSuper
    for (let i = 0, len = superList.length; i < len; ++i) {
      superList[i].checked = superList[i].name === that.data.shop_pre_array[a].isSuper
    }
    that.setData({
      isSuper: superList,
      chooseSuper: that.data.shop_pre_array[a].isSuper,
      listIndex: a,
      prestoreName: that.data.shop_pre_array[a].prestoreName, //优惠名称
      prestoreMoneyStart: that.data.shop_pre_array[a].prestoreMoneyStart, //预存金额1
      prestoreMoneyEnd: that.data.shop_pre_array[a].prestoreMoneyEnd, //预存金额2	
      givingAmount: that.data.shop_pre_array[a].givingAmount, //代金券
      preferentCount: that.data.shop_pre_array[a].preferentCount, //优惠券数
      preferentMoney: that.data.shop_pre_array[a].preferentMoney, //优惠券面值
      preferentDiscount: that.data.shop_pre_array[a].preferentDiscount, //优惠折扣
      deductionProportion: that.data.shop_pre_array[a].deductionProportion ? that.data.shop_pre_array[a].deductionProportion : 100, //优惠折扣
      shopId: that.data.shop_pre_array[a].shopId, //店铺id
      useStatus: that.data.shop_pre_array[a].useStatus ? that.data.shop_pre_array[a].useStatus : 0, //店铺id
      pid: that.data.shop_pre_array[a].pid,
      describes_value: that.data.shop_pre_array[a].preferentGift,
      effectiveDay: that.data.shop_pre_array[a].effectiveDay,
      startTime: that.data.shop_pre_array[a].startTime ? util.formatTime3(that.data.shop_pre_array[a].startTime, 'Y年M月D日') : "",
      endTime: that.data.shop_pre_array[a].endTime ? util.formatTime3(that.data.shop_pre_array[a].endTime, 'Y年M月D日') : "",
      shop_pre_save: false,
      shop_pre_alter: true,
      announcement_value: that.data.shop_pre_array[a].preferentRule,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    that.setData({
      shop_name: options.shop_name, //获取店名
      shop_id: options.shop_id, //获取店铺id
      shop_pre_save: true,
      shop_pre_alter: false,
      // scroll_height: windowHeight * 750 / windowWidth - (windowHeight * 1.78),
      scroll_height: windowHeight * 750 / windowWidth - (windowHeight * 1.55),
      scroll_height2: windowHeight * 750 / windowWidth - 550,
      items: [], //店铺类型存放总列表
      prestoreName: '',
      describes_value: '', //优惠礼物
      //店铺优惠
      describes: '', //打折礼物
      announcement: '', //优惠规则
      shop_pre_array: [], //店铺优惠信息
      shopId: '',
      pid: '',
      describes_value: '',
      item_id: options.item_id,
      maodian: options.maodian,
    })
    wx.setNavigationBarTitle({
      title: that.data.shop_name,
    })
    that.getShopPreferentid()
    // that.getDiscountRules()
  },
  //获取规则
  getDiscountRules() {
    let that = this
    var param = {
      "shop_id": that.data.shop_id
    };
    //加载优惠礼物与优惠规则
    wx.request({
      url: app.globalData.diancnaxing_domain_name + '/discount/discountRules',
      data: JSON.stringify(param),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        //礼物规则与预存优惠规则赋值
        that.setData({
          // describes_value: res.data.discount_rules, //优惠礼物
          announcement_value: res.data.gift_rules //优惠规则
        })
      }
    })
  },
  //获取列表信息
  getShopPreferentid() {
    let that = this
    wx.request({ //查询店铺优惠信息
      url: app.globalData.selectShopPreferentid_url,
      data: {
        shopId: that.data.shop_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      success: function (res) {
        console.log(res)
        that.setData({
          shop_pre_array: res.data
        },()=>{
          that.setData({
            maodian: that.data.maodian
          })
          let shopPreArray = that.data.shop_pre_array;
          for(let i=0;i<shopPreArray.length;i++){
            if(that.data.item_id == shopPreArray[i].pid){
              that.setData({
                listIndex: i
              },()=>{
                let e = {
                  currentTarget:{
                    dataset:{
                      index: that.data.listIndex
                    }
                  }
                }
                that.shop_pre_choice(e)
              })
              break;
            }
          }
        })
        that.ascending(); //升序
        console.log(that.data.shop_pre_array)
      }
    })
  },

  onShow: function () {
  },

  ascending(e) { //升序
    var that = this;
    var max = 0;
    var tmp = 0;
    var a = that.data.shop_pre_array;

    for (var i = 0; i < a.length; i++) {
      max = i; //
      /**查找第 i小的数，直到记下第 i小数的位置***/
      for (var j = i + 1; j < a.length; j++) {
        if (a[max].prestoreMoneyStart > a[j].prestoreMoneyStart)
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
      shop_pre_array: a
    })
  },

  toWeixinPay(){
    wx.navigateTo({
      url: '../weixinpay/weixinpay',
    })
  },

  showMore1(){
    let that = this;
    if(!that.data.isShowMore1){
      that.setData({
        isShowMore1: !that.data.isShowMore1,
        transform1: "rotate(180deg)",
        webkitline1: 100
      })
    }else{
      that.setData({
        isShowMore1: !that.data.isShowMore1,
        transform1: "rotate(0deg)",
        webkitline1: 3
      })
    }
    
  },

  showMore2(){
    let that = this;
    if(!that.data.isShowMore2){
      that.setData({
        isShowMore2: !that.data.isShowMore2,
        transform2: "rotate(180deg)",
        webkitline2: 100
      })
    }else{
      that.setData({
        isShowMore2: !that.data.isShowMore2,
        transform2: "rotate(0deg)",
        webkitline2: 3
      })
    }
    
  },
})