// pages/Shop_ordering/Shop_ordering.js
const app = getApp(); //引入全局变量
import {
  $wuxFilterBar
} from '../../../../components/wuxfilterbar'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    file_id: 0,
    disTag: false,
    List: '',
    index: '',
    shop_id: '',
    showid: 1,
    couponid: 1,
    pageNum: 0,
    pageNum1: 0,
    List: [],
    CouponList: [],
    stopSelect: false,
    select_bol: false, //是否显示分类搜索
    stopSelectCoupon: false,
    stop_select1: false, //没有套餐了，不搜索
    stop_selectCoupon1: false, //没有优惠券了，不搜索
    select_coupon: false, //是否显示select出来的setmeal
    selfLatitude: 0, //当前用户经纬度
    selfLongitude: 0, //当前用户经纬度
    cusid: '',
    SYB_APPID: '',
    sub_merchants_id: '',
    typeList: [{
      id: 0,
      typeName: "类别",
      typeShowName: "全部",
      condition: ""
    }, {
      id: 1,
      typeName: "小吃快餐",
      typeShowName: "小吃快餐",
      condition: "category"
    }, {
      id: 2,
      typeName: "粉面汤粥",
      typeShowName: "粉面汤粥",
      condition: "priceAsc"
    }, {
      id: 3,
      typeName: "火锅烧烤",
      typeShowName: "火锅烧烤",
      condition: "priceDesc"
    }, {
      id: 4,
      typeName: "生鲜蔬果",
      typeShowName: "生鲜蔬果",
      condition: "salesAsc"
    }, {
      id: 5,
      typeName: "日韩料理",
      typeShowName: "日韩料理",
      condition: "salesDesc"
    }, {
      id: 6,
      typeName: "甜品饮品",
      typeShowName: "甜品饮品",
      condition: "fabulousAsc"
    }, {
      id: 7,
      typeName: "辣味特色",
      typeShowName: "辣味特色",
      condition: "fabulousDesc"
    }, {
      id: 8,
      typeName: "自助套餐",
      typeShowName: "自助套餐",
      condition: "fabulousDesc"
    }, {
      id: 9,
      typeName: "食品保健",
      typeShowName: "食品保健",
      condition: "fabulousDesc"
    }, {
      id: 10,
      typeName: "生鲜蔬果",
      typeShowName: "生鲜蔬果",
      condition: "fabulousDesc"
    }, {
      id: 11,
      typeName: "聚餐宴请",
      typeShowName: "聚餐宴请",
      condition: "fabulousDesc"
    }, {
      id: 12,
      typeName: "海鲜",
      typeShowName: "海鲜",
      condition: "fabulousDesc"
    }, {
      id: 13,
      typeName: "粤菜",
      typeShowName: "粤菜",
      condition: "fabulousDesc"
    }, {
      id: 14,
      typeName: "福建菜",
      typeShowName: "福建菜",
      condition: "fabulousDesc"
    }, {
      id: 15,
      typeName: "山西菜",
      typeShowName: "山西菜",
      condition: "fabulousDesc"
    }, {
      id: 16,
      typeName: "川湘菜",
      typeShowName: "川湘菜",
      condition: "fabulousDesc"
    }, {
      id: 17,
      typeName: "江浙菜",
      typeShowName: "江浙菜",
      condition: "fabulousDesc"
    }, {
      id: 18,
      typeName: "湖北菜",
      typeShowName: "湖北菜",
      condition: "fabulousDesc"
    }, {
      id: 19,
      typeName: "西北菜",
      typeShowName: "西北菜",
      condition: "fabulousDesc"
    }, {
      id: 20,
      typeName: "东北菜",
      typeShowName: "东北菜",
      condition: "fabulousDesc"
    }, {
      id: 21,
      typeName: "京菜鲁菜",
      typeShowName: "京菜鲁菜",
      condition: "fabulousDesc"
    }, {
      id: 22,
      typeName: "云贵菜",
      typeShowName: "云贵菜",
      condition: "fabulousDesc"
    }, {
      id: 23,
      typeName: "新疆菜",
      typeShowName: "新疆菜",
      condition: "fabulousDesc"
    }, {
      id: 24,
      typeName: "台湾菜",
      typeShowName: "台湾菜",
      condition: "fabulousDesc"
    }, {
      id: 25,
      typeName: "东南亚菜",
      typeShowName: "东南亚菜",
      condition: "fabulousDesc"
    }, {
      id: 26,
      typeName: "西餐",
      typeShowName: "西餐",
      condition: "fabulousDesc"
    }, {
      id: 27,
      typeName: "特色菜",
      typeShowName: "特色菜",
      condition: "fabulousDesc"
    }, {
      id: 28,
      typeName: "其他菜",
      typeShowName: "其他菜",
      condition: "fabulousDesc"
    }],
    shownavindex: '',
    //区域
    city: '全部',
    qyopen: false, //点击区域筛选滑动弹窗显示效果，默认不显示
    qyshow: true, //用户点击闭关区域的弹窗设置，默认不显示
    isfull: false,
    cityleft: {},
    citycenter: {},
    cityright: {},

    cityright: {}, //选择区域的中间内容部分后显示的右边内容
    select1: '',
    select2: '', //区域选择部分的中间
    select3: '全部', //区域选择部分的右边
    shownavindex: '',

    // 排序
    fileTxt: ['类别'],
    file: [true],
    fileid: 0,
    file_txt: '',
    tabTxt: ['排序'], //分类
    tab: [true],
    sort_id: 0, //价格
    sort_txt: '',
    discountList: [],
    // 筛选
    items: [{
      type: 'filter',
      label: '筛选',
      value: 'filter',
      children: [{
          type: 'radio',
          label: '可用时间',
          value: 'workingDay',
          children: [{
              label: '不限',
              value: '不限',
            },
            {
              label: '工作日',
              value: '工作日',
            },
            {
              label: '周末',
              value: '周末',
            },
          ],
        },
        //  {
        //    type: 'radio',
        //    label: '用餐时段',
        //    value: 'mealTime',
        //    children: [{
        //        label: '早餐',
        //        value: '早餐',
        //      },
        //      {
        //        label: '午餐',
        //        value: '午餐',
        //      },
        //      {
        //        label: '晚餐',
        //        value: '晚餐',
        //      },
        //      {
        //        label: '夜宵',
        //        value: '夜宵',
        //      }
        //    ],
        //  },
        {
          type: 'radio',
          label: '价格',
          value: 'prices',
          children: [{
              label: '50以下',
              value: '0,50',
            },
            {
              label: '50-100',
              value: '50,100',
            },
            {
              label: '100-300',
              value: '100,300',
            },
            {
              label: '300-500',
              value: '300,500',
            },
            {
              label: '500以上',
              value: '500,',
            },
          ],
        },
        {
          type: 'radio',
          label: '折扣',
          value: 'discount',
          children: [{
              label: '5折以下',
              value: '0,5',
            },
            {
              label: '5-8折',
              value: '5,8',
            },
            {
              label: '8-9折',
              value: '8,9',
            },
            {
              label: '9-9.5折',
              value: '9,9.5',
            },
            {
              label: '9.5折以上',
              value: '9.5,10',
            },
          ],
        },
      ],
      groups: ['001', '002', '003', '004'], //判断元素是否同组
    }, ],
    //剩余的搜索字段
    availableTime: '',
    highestPrice: '',
    lowestDiscount: '',
    maximumDiscount: '',
    mealTime: '',
    minimumPrice: '',
    couponTypeList: '',
    userNum: '',
    areaID: '',
    cityID: '',
    countyID: '',
    text: '',

    actionSheetItems: [{
        bindtap: 1,
        txt: '星期一',
        id: '一'
      },
      {
        bindtap: 2,
        txt: '星期二',
        id: '二'
      },
      {
        bindtap: 3,
        txt: '星期三',
        id: '三'
      },
      {
        bindtap: 4,
        txt: '星期四',
        id: '四'
      },
      {
        bindtap: 5,
        txt: '星期五',
        id: '五'
      },
      {
        bindtap: 6,
        txt: '星期六',
        id: '六'
      },
      {
        bindtap: 7,
        txt: '星期日',
        id: '日'
      }
    ]
  },
  file1: function (e) { //类别按钮
    var self = this,
      id = e.currentTarget.dataset.id
    switch (e.currentTarget.dataset.index) {
      case '0':
        self.setData({
          fileid: id
        });
        break;
    }
    console.log('排序选择的是：' + self.data.fileid)
  },

  clear: function (e) {
    this.setData({
      disTag: !this.data.disTag
    })
  },
  // tap: function (e) {
  //   var that = this
  //   let Index = e.currentTarget.dataset.index;
  //   that.setData({
  //     index: Index
  //   })
  //   console.log(that.data.List[that.data.index].setMealID)
  //   if(that.data.select_coupon){

  //   app.getManagementDataServlet(that.data.discountList[that.data.index].shopId)
  //     wx.navigateTo({
  //       url: '../Package_details/Package_details?id=' + that.data.file_id + '&setMealID=' + that.data.discountList[that.data.index].setMealID + '&ruleID=' + that.data.discountList[that.data.index].ruleID + '&shop_id=' + that.data.discountList[that.data.index].shopId,
  //     })
  //   }else{
  //     app.getManagementDataServlet(that.data.List[that.data.index].shop_id)
  //     wx.navigateTo({
  //       url: '../Package_details/Package_details?id=' + that.data.file_id + '&setMealID=' + that.data.List[that.data.index].setMealID + '&ruleID=' + that.data.List[that.data.index].ruleID + '&shop_id=' + that.data.List[that.data.index].shop_id,
  //     })
  //   }


  // },
  top: function (e) {
    var that = this
    let Index = e.currentTarget.dataset.index;
    that.setData({
      index: Index
    })
    if (that.data.select_coupon) {
      wx.navigateTo({
        url: '../Package_details/Package_details?id=1&coupon_id=' + that.data.discountList[that.data.index].coupon_id + '&ruleID=' + that.data.discountList[that.data.index].coupon_allrule + '&shop_id=' + that.data.discountList[that.data.index].shopId,
      })
    } else {
      wx.navigateTo({
        url: '../Package_details/Package_details?id=1&coupon_id=' + that.data.CouponList[that.data.index].coupon_id + '&ruleID=' + that.data.CouponList[that.data.index].coupon_allrule + '&shop_id=' + that.data.CouponList[that.data.index].shop_id,
      })
    }

  },
  goorder: function (e) {
    var that = this
    let Index = e.currentTarget.dataset.index;
    that.setData({
      index: Index
    })
    if (that.data.file_id == 0) {
      if (that.data.select_coupon) {
        that.selectshop(that.data.discountList[Index].setMealID)
        app.getManagementDataServlet(that.data.discountList[that.data.index].shopId)
        // })
      } else {
        that.selectshop(that.data.List[Index].setMealID)
        app.getManagementDataServlet(that.data.List[that.data.index].shop_id)
      }
    } else {
      that.selectshop(that.data.CouponList[Index].coupon_id)
    }
  },
  // select: function (e) { //查询规则
  //   var that = this
  //   wx.request({
  //     // url: 'https://test.fsmbdlkj.com/diancanxing/setMeal/selectSetMealInfo',
  //     url:  app.globalData.selectSetMealInfo_url,
  //     method: 'POST',
  //     data: {
  //       shop_id: that.data.shop_id,
  //       setMealID: '',
  //       startUsing: 1,
  //       typeForSetMeal: ''
  //     },
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function (res) {
  //       console.log(res)
  //       console.log(res.data.selectResult)
  //       that.data.List = res.data.selectResult
  //       that.setData({
  //         List: that.data.List
  //       })
  //       if (res.data.selectResult != undefined) {
  //       } else {
  //         that.setData({
  //           showid: 0
  //         })
  //       }
  //     }
  //   })
  // },

  // select1: function (e) { //查询规则
  //   var that = this
  //   var pageNum = that.data.pageNum
  //   if(!that.data.stop_select1){
  //     wx.request({
  //       url: app.globalData.selectSetmealForNum_url,
  //       method: 'POST',
  //       data: {
  //         "shop_id": '',
  //         "pageNum": pageNum
  //       },
  //       header: {
  //         'content-type': 'application/json'
  //       },
  //       success: function (res) {
  //         console.log(res)
  //         console.log(res.data.selectResult)
  //         if(res.data.selectResult.length<20){
  //           //没有套餐了，暂停继续查询规则
  //           that.setData({
  //             stop_select1:true
  //           })
  //         }
  //         var List = that.data.List
  //         var NewList = res.data.selectResult
  //         for(var i =0 ;i<NewList.length;i++){
  //           List.push(NewList[i])
  //         }

  //         if(res.data.selectResult.length<20){
  //           that.setData({
  //             stopSelect:true
  //           })
  //         }
  //         // that.data.List = res.data.selectResult
  //         that.setData({
  //           List: that.data.List,
  //           select_coupon:false,
  //           showid:1,
  //           pageNum: pageNum+20
  //         })
  //         if (res.data.selectResult != undefined) {
  //         } else {
  //           that.setData({
  //             showid: 0
  //           })
  //         }
  //       }
  //     })
  //   }
  // },

  selectCoupon: function (e) { //查询规则
    // var that = this
    // var selfLatitude = that.data.selfLatitude
    // var selfLongitude = that.data.selfLongitude
    // if(selfLatitude=='' || selfLatitude==null || selfLatitude==undefined||selfLongitude=='' || selfLongitude==null || selfLongitude==undefined){
    //   //没有地理位置信息
    //   //去申请授权
    //   that.getSelfLocation(1);
    // }else{
    //   wx.request({
    //     // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectCoupon',
    //     url:  app.globalData.taocan.selectCoupon_url,
    //     method: 'POST',
    //     data: {
    //       shop_id: that.data.shop_id,
    //       coupon_id: ''
    //     },
    //     header: {
    //       'content-type': 'application/json'
    //     },
    //     success: function (res) {
    //       var CouponList = res.data
    //       that.setData({
    //         CouponList: CouponList
    //       })
    //       if (CouponList == '') {
    //         that.setData({
    //           couponid: 0
    //         })
    //       } else {
    //         var week = []
    //         for (var x of res.data) {
    //           var weekList = {
    //             starweek: '',
    //             endweek: ''
    //           }
    //           for (var y of that.data.actionSheetItems) {
    //             if (x.coupon_ruleweekstar == y.bindtap) {
    //               console.log(y.id)
    //               weekList.starweek = y.id
    //             }
    //             if (x.coupon_ruleweekend == y.bindtap) {
    //               weekList.endweek = y.id
    //             }
    //           }
    //           week.push(weekList)
    //         }
    //         that.setData({
    //           week: week
    //         })
    //       }
    //     }
    //   })
    // }
    var that = this
    var pageNum1 = that.data.pageNum1
    var selfLatitude = that.data.selfLatitude
    var selfLongitude = that.data.selfLongitude
    if (selfLatitude == '' || selfLatitude == null || selfLatitude == undefined || selfLongitude == '' || selfLongitude == null || selfLongitude == undefined) {
      //没有地理位置信息
      //去申请授权
      that.getSelfLocation(1);
    } else {
      wx.request({
        url: app.globalData.SelectcouponInfForNum_url,
        // url: 'http://localhost:8087/WX Restaurant/SelectcouponInfForNum',
        method: 'POST',
        data: {
          "pageNum": pageNum1,
          "shop_id": that.data.shop_id,
          "latitude": selfLatitude,
          "longitude": selfLongitude,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        success: function (res) {
          var CouponList = that.data.CouponList
          var NewCouponList = res.data.object
          if (!that.data.stop_selectCoupon1) {

            if (res.data.result.cause == "Fail." || res.data.object.length < 20) {
              that.setData({
                stop_selectCoupon1: true
              })
            }
            if (NewCouponList != null) {
              for (var i = 0; i < NewCouponList.length; i++) {
                if (NewCouponList[i].coupon_type != '45336A43-93C8-48A1-8DE9-90C0258FA548') {
                  NewCouponList[i].coupon_original = NewCouponList[i].coupon_original.toFixed(2);
                  CouponList.push(NewCouponList[i])
                }
              }
              that.setData({
                select_coupon: false,
                showid: 1,
                CouponList: CouponList,
                pageNum1: pageNum1 + 20
              })
              if (NewCouponList.length < 20) {
                that.setData({
                  stopSelectCoupon: true
                })
              }
            }
            if (CouponList == '' || CouponList == undefined) {
              that.setData({
                couponid: 0
              })
            } else {
              var week = []
              for (var x of res.data.object) {
                var weekList = {
                  starweek: '',
                  endweek: ''
                }
                for (var y of that.data.actionSheetItems) {
                  if (x.coupon_ruleweekstar == y.bindtap) {
                    console.log(y.id)
                    weekList.starweek = y.id
                  }
                  if (x.coupon_ruleweekend == y.bindtap) {
                    weekList.endweek = y.id
                  }
                }
                week.push(weekList)
              }
              that.setData({
                week: week
              })
            }
          }
        }
      })
    }
  },
  selectCoupon1: function (e) { //查询规则
    var that = this
    var pageNum1 = that.data.pageNum1
    var selfLatitude = that.data.selfLatitude
    var selfLongitude = that.data.selfLongitude
    if (selfLatitude == '' || selfLatitude == null || selfLatitude == undefined || selfLongitude == '' || selfLongitude == null || selfLongitude == undefined) {
      //没有地理位置信息
      //去申请授权
      that.getSelfLocation(0);
    } else {
      wx.request({
        url: app.globalData.SelectcouponInfForNum_url,
        // url: 'http://localhost:8087/WX Restaurant/SelectcouponInfForNum',
        method: 'POST',
        data: {
          "pageNum": pageNum1,
          "shop_id": "",
          "latitude": selfLatitude,
          "longitude": selfLongitude,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        success: function (res) {
          var CouponList = that.data.CouponList
          var NewCouponList = res.data.object
          if (!that.data.stop_selectCoupon1) {

            if (res.data.result.cause == "Fail." || res.data.object.length < 20) {
              that.setData({
                stop_selectCoupon1: true
              })
            }
            if (NewCouponList != null) {
              for (var i = 0; i < NewCouponList.length; i++) {
                if (NewCouponList[i].coupon_type != '45336A43-93C8-48A1-8DE9-90C0258FA548') {
                  NewCouponList[i].coupon_original = NewCouponList[i].coupon_original.toFixed(2)
                  CouponList.push(NewCouponList[i])
                }
              }
              that.setData({
                select_coupon: false,
                showid: 1,
                CouponList: CouponList,
                pageNum1: pageNum1 + 20
              })
              if (NewCouponList.length < 20) {
                that.setData({
                  stopSelectCoupon: true
                })
              }
            }
            if (CouponList == '' || CouponList == undefined) {
              that.setData({
                couponid: 0
              })
            } else {
              var week = []
              for (var x of res.data.object) {
                var weekList = {
                  starweek: '',
                  endweek: ''
                }
                for (var y of that.data.actionSheetItems) {
                  if (x.coupon_ruleweekstar == y.bindtap) {
                    console.log(y.id)
                    weekList.starweek = y.id
                  }
                  if (x.coupon_ruleweekend == y.bindtap) {
                    weekList.endweek = y.id
                  }
                }
                week.push(weekList)
              }
              that.setData({
                week: week
              })
            }


          }
        }
      })
    }
  },

  //搜索区域

  filetab: function (e) {
    var data = [true],
      index = e.currentTarget.dataset.index;
    data[index] = !this.data.file[index];
    this.setData({
      tab: [true],
      file: data,
      qyopen: false,
      qyshow: true,
      isfull: false,
      pageNum: 0,
      shownavindex: 0,
    })
  },

  // 排序
  filterTab: function (e) {
    var data = [true],
      index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      file: [true],
      tab: data,
      qyopen: false,
      qyshow: true,
      isfull: false,
      pageNum: 0,
      shownavindex: 0,
    })
  },
  //类别选择
  file: function (e) {
    var self = this,
      id = e.currentTarget.dataset.id,
      txt = e.currentTarget.dataset.txt,
      condition = e.currentTarget.dataset.condition,
      fileTxt = this.data.fileTxt;

    switch (e.currentTarget.dataset.index) {
      case '0':
        fileTxt[0] = txt;
        self.setData({
          // tab: [true],
          fileTxt: fileTxt,
          fileid: id,
          couponTypeList: id == 0 ? '' : id,
          condition: condition,
          file_txt: txt
        });
        break;
    }
    console.log('类别选择的是：' + fileTxt + ' ' + condition)
  },

  //排序点击操作
  filter: function (e) {
    var self = this,
      id = e.currentTarget.dataset.id,
      txt = e.currentTarget.dataset.txt,
      condition = e.currentTarget.dataset.condition,
      tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          // tab: [true],
          tabTxt: tabTxt,
          sort_id: id,
          condition: condition,
          sort_txt: txt
        });
        break;
    }
    console.log('排序选择的是：' + tabTxt + ' ' + condition)
    //数据排序筛选
    // self.getDataList();
  },

  reset: function (e) {
    var that = this;

    that.setData({
      sort_id: "0",
      fileid: 0,
      sort_txt: '',
      file_txt: '',
      couponTypeList: '',
      highestPrice: '',
      availableTime: '',
      mealTime: '',
      lowestDiscount: 0,
      maximumDiscount: 10,
      userNum: "",
      condition: "defaultSort",
      tabTxt: ['排序'], //分类
      fileTxt: ['类别'],
    })
    console.log('排序选择的是：' + that.data.tabTxt + ' ' + that.data.condition + ' ' + that.data.id + ' ' + that.data.txt)
  },

  submit: function (e) {
    var self = this;
    self.setData({
      tab: [true],
      file: [true]
    })
    self.getDataList();
  },

  // 区域列表下拉框是否隐藏
  listqy: function (e) {
    if (this.data.qyopen) {
      this.setData({
        qyopen: false,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        qyopen: true,
        qyshow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav,
        tab: [true],
        file: [true]
      })
    }

  },

  // 区域左边选择内容
  selectleft: function (e) {
    console.log('选中市：' + e.target.dataset.city + '城市索引：' + e.target.dataset.id);
    this.setData({

      //select1、2与countyName与areaName不是重复多余，是为了解决页面显示与查询的冲突
      select1: e.target.dataset.city,
      select2: e.target.dataset.city,
      select2: '',
      select3: '',
      cityright: {},
      cityName: e.target.dataset.city,
      cityID: e.target.dataset.id.toString(),
      city: e.target.dataset.city,
      countyID: '', //清空缓存
      countyName: '',
      areaID: '',
    });
    this.selectCounty();

  },
  // 区域中间栏选择的内容
  selectcenter: function (e) {
    console.log('选中市区：' + e.target.dataset.city);
    this.setData({
      select2: e.target.dataset.city,
      countyName: e.target.dataset.city,
      countyID: e.target.dataset.id.toString(),
      city: e.target.dataset.city,
      areaID: '',
      areaName: '',
      select3: '',
    });
    this.selectArea();
  },

  // 区域右边栏选择的内容
  selectright: function (e) {
    console.log('选中商业区：' + e.target.dataset.city);
    this.setData({
      select3: e.target.dataset.city,
      // countyName: e.target.dataset.city,
      // countyID: e.target.dataset.id.toString(),
      city: e.target.dataset.city,
      areaID: e.target.dataset.id.toString(),
    });
  },

  // 区域清空筛选项
  quyuEmpty: function () {
    var that = this;
    this.setData({
      select1: '',
      select2: '',
      select3: '',
      cityright: {},
      citycenter: {},
      city: '全部',
      cityName: app.globalData.defaultCity,
      countyName: '',
      countyID: '',
      areaID: '',

    })
  },
  // 区域选择筛选项后，点击提交
  submitFilter: function (e) {
    var that = this
    console.log('选择的市区索引是：' + this.data.cityID);
    console.log('选择的地区索引是：' + this.data.countyID);
    console.log('选择的商业区索引是：' + this.data.areaID);


    that.setData({
      qyopen: false,
      qyshow: true,
      isfull: false,
      shownavindex: 0,

      cityID: this.data.cityID,
      countyID: this.data.countyID,
      areaID: this.data.areaID,

      paheNum: 0,
      hidden: !that.data.hidden,
      discountList: [], //再次查询清空缓存
      hiddenStore: true,
    })
    that.selectCouponInfo()
  },

  closeOther: function (e) {
    var that = this;
    console.log("筛选")
    that.setData({
      file: [true],
      qyopen: false,
      qyshow: true,
      isfull: false,
      loadcompleted: true,
      shownavindex: 0,
      tab: [true]
    })
  },

  //搜索区域end
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    if (options.clip) {
      if (wx.getStorageSync('clip')) {
        wx.removeStorageSync('clip')
        wx.setClipboardData({
          data: ' ',
          complete: res => {
            wx.hideToast({
              success: (res) => {},
            })
          }
        })
      } else {
        wx.setStorageSync('clip', options.clip)
      }
    }
    if (options.shop_id == undefined) {

      // this.select1()
      this.selectCoupon1()
    } else {
      this.setData({
        shop_id: options.shop_id,
        shop_name: options.shop_name,
      })
      // this.select()
      this.selectCoupon()
    }

    if (options.file_id) {
      that.setData({
        file_id: options.file_id
      })
    }
    // that.getSelfLocation()
    this.$wuxFilterBar = $wuxFilterBar.init({
      items: this.data.items,
      onChange: (checkedItems, data, items) => {
        console.log(this, checkedItems, items)
        const params = {}
        checkedItems.forEach((n) => {
          if (n.value === 'filter') {
            console.log("选中的标题内容为：" + n.value);
            n.children.filter((n) => n.selected).forEach((n) => {
              if (n.value === 'workingDay') {
                console.log("选中的可用时间为：" + n.value);
                const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
                params.workingDay = selected;
                console.log(typeof params.workingDay);
                console.log("最终选中的可用时间为：" + params.workingDay);

              } else if (n.value === 'mealTime') {
                console.log("选中的用餐时段为：" + n.value);
                const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
                params.mealTime = selected;
                console.log(typeof params.mealTime);
                console.log("最终选中的用餐时段为：" + params.mealTime);
              } else if (n.value === 'prices') {
                console.log("选中的价格区间为：" + n.value);
                const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
                params.prices = selected;
                var arr = params.prices;
                var newarr = arr.split(",");
                params.prices = newarr;
                console.log(typeof params.prices);
                console.log("最终选中的价格区间为：" + params.prices);
              } else if (n.value === 'discount') {
                console.log("选中的折扣区间为：" + n.value);
                const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
                params.discount = selected;
                var arr = params.discount;
                var newarr = arr.split(",");
                params.discount = newarr;
                console.log(typeof params.discount);
                console.log("最终选中的折扣区间为：" + params.discount);
              }
            })
          }
        })
        that.data.workingDay = params.workingDay ? params.workingDay : "";
        that.data.mealTime = params.mealTime ? params.mealTime : "";
        that.data.minimumPrice = params.prices ? params.prices[0] : "";
        that.data.highestPrice = params.prices ? params.prices[1] : "";
        that.data.lowestDiscount = params.discount ? params.discount[0] : "";
        that.data.maximumDiscount = params.discount ? params.discount[1] : "";
        // lowestDiscount: '', // 最低折扣
        // maximumDiscount: '', // 最大折扣
        // console.log(params.prices);
        that.setRepos(data);
      },
    })
  },
  selectshop: function (e) {
    var that = this
    if (that.data.file_id == 0) {
      var setMealID = e
      var coupon_id = ''
    } else {
      var setMealID = ''
      var coupon_id = e
    }
    wx.request({
      // url: 'https://test.fsmbdlkj.com/wx_table/testBoot/selectSetmeal',
      url: app.globalData.taocan.selectSetmeal_url,
      method: 'POST',
      data: {
        setMealID: setMealID,
        coupon_id: coupon_id

      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var shopList = res.data
        var shop_id = res.data[0].shop_id
        var SYB_APPID = shopList[0].syb_APPID
        var cusid = shopList[0].cusid
        var sub_merchants_id = shopList[0].sub_merchants_id
        that.setData({
          SYB_APPID: SYB_APPID,
          cusid: cusid,
          sub_merchants_id: sub_merchants_id
        })

        if (that.data.file_id == 0) {
          wx.navigateTo({
            url: '../order/order?setMealID=' + e + '&id=' + that.data.file_id + '&shop_id=' + shop_id + '&cusid=' + cusid + '&SYB_APPID=' + SYB_APPID + '&sub_merchants_id=' + sub_merchants_id
          })
        } else {
          wx.navigateTo({
            url: '../order/order?coupon_id=' + e + '&id=' + that.data.file_id + '&shop_id=' + shop_id + '&cusid=' + cusid + '&SYB_APPID=' + SYB_APPID + '&sub_merchants_id=' + sub_merchants_id
          })
        }
      }
    })
  },

  bigimg2: function (e) { //查看照片大图
    // console.log(e)
    var that = this;
    var imgBox = []
    if (e.currentTarget.dataset.src.substring(e.currentTarget.dataset.src.length - 2, e.currentTarget.dataset.src.length) != '\r\n') {
      imgBox.push(e.currentTarget.dataset.src.substring(0, e.currentTarget.dataset.src.length - 4) + 'big')
    } else {
      imgBox.push(e.currentTarget.dataset.src.substring(0, e.currentTarget.dataset.src.length - 6) + 'big')
    }
    that.setData({
      imgBox: imgBox
    })
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: imgBox // 需要预览的图片http链接列表
    })
  },
  selectJump: function () {
    wx.navigateTo({
      url: '../../../search/search',
    })
    //触发基础的搜索方法，按照名字搜索套餐/优惠券

  },
  //加载数据
  getDataList: function (e) {
    //调用数据接口，获取数据
    var that = this
    console.log(that.data.condition)
    this.setData({
      qyopen: false,
      qyshow: true,
      isfull: false,
      shownavindex: 0,
      sort: that.data.condition,
      hidden: !that.data.hidden,
      discountList: [], //再次查询清空缓存
      hiddenStore: true,
      loadcompleted: true,
    })
    that.selectCouponInfo()
  },
  // 市区
  selectCity: function (e) {
    var that = this;
    wx.request({
      // url: 'https://mb.fsmbdlkj.com/diancanxing/shop/queryCity',
      url: app.globalData.allUrl.defaultQueryCity,
      data: {},
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          cityleft: res.data
        })
        console.log(that.data.cityleft)
      }
    })
  },
  //排序操作
  setRepos(data) {
    var that = this
    console.log('排序操作');
    that.setData({
      qyopen: false,
      qyshow: true,
      isfull: false,

      shownavindex: 0,
      pageNum: 0,

      discountList: [], //再次查询清空缓存
      hidden: !that.data.hidden,
      hiddenStore: true,
    })

    that.selectCouponInfo()
  },
  // 超值代金券的搜索
  selectCouponInfo: function (e) { // 第一次查询
    var that = this;
    var pageNum1 = 0;
    var discountList = [];
    that.data.discountList = [];
    var pageNumS = pageNum1.toString();
    var object = {
      "keyWord": that.data.text,
      "areaID": that.data.areaID,
      "countyID": that.data.countyID,
      "cityID": that.data.cityID,
      "longitude": that.data.selfLongitude.toFixed(10),
      "latitude": that.data.selfLatitude.toFixed(10),
      "cityIDResult": app.globalData.cityIDResult,
      "pageNum": pageNumS,
      "sort": that.data.sort_id,
      "minimumPrice": that.data.minimumPrice,
      "couponTypeList": that.data.couponTypeList, ////
      "highestPrice": that.data.highestPrice,
      "availableTime": that.data.availableTime,
      // "mealTime": that.data.mealTime, // --------------0-不限，1-早餐，2-午餐，3-晚餐，4-宵夜
      "lowestDiscount": that.data.lowestDiscount,
      "maximumDiscount": that.data.maximumDiscount,
      // "selfLongitude": that.data.selfLongitude,
      // "selfLatitude": that.data.selfLatitude,
      // "userNum": that.data.userNum,
      "Preferentialdeposit": '', ////
      "coupon_superposition": "", //(券叠加情况：0-不可叠加、1-可叠加、空-不限)
      "coupon_purchaselimitation": "" //(券限购情况：0-不限购、1-有限购、空-不限)

      // ---------1-单人；2-双人；3-3~4人；4-5~6人；5-7~8人；6-9~10人；7-10人以上
    }
    console.log(that.data.selfLongitude)
    console.log(that.data.selfLatitude)
    wx.request({
      // url: "https://test.fsmbdlkj.com/diancanxing/setMeal/keyWordSearchSetMealInfo",
      url: app.globalData.keyWordSearchCouponInfo_url,
      data: JSON.stringify(object),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        var sendAfter = new Date();
        console.log(JSON.stringify(object))

        console.log(sendAfter.getSeconds() + ":" + sendAfter.getMilliseconds());
        var isnull
        if (res.data.CouponInfoOResultMap == undefined || Object.getOwnPropertyNames(res.data.CouponInfoOResultMap).length === 0) {
          isnull = true
        } else {
          isnull = false
        }
        for (var x in res.data.CouponInfoOResultMap) {
          discountList.push(res.data.CouponInfoOResultMap[x]);
        }
        for (var i = 0; i < discountList.length; i++) {
          if (discountList[i].coupon_ruleweekstar == 1) {
            discountList[i].coupon_ruleweekstar = '一'
          } else if (discountList[i].coupon_ruleweekstar == 2) {
            discountList[i].coupon_ruleweekstar = '二'
          } else if (discountList[i].coupon_ruleweekstar == 3) {
            discountList[i].coupon_ruleweekstar = '三'
          } else if (discountList[i].coupon_ruleweekstar == 4) {
            discountList[i].coupon_ruleweekstar = '四'
          } else if (discountList[i].coupon_ruleweekstar == 5) {
            discountList[i].coupon_ruleweekstar = '五'
          } else if (discountList[i].coupon_ruleweekstar == 6) {
            discountList[i].coupon_ruleweekstar = '六'
          } else if (discountList[i].coupon_ruleweekstar == 7) {
            discountList[i].coupon_ruleweekstar = '日'
          }

          if (discountList[i].coupon_ruleweekend == 1) {
            discountList[i].coupon_ruleweekend = '一'
          } else if (discountList[i].coupon_ruleweekend == 2) {
            discountList[i].coupon_ruleweekend = '二'
          } else if (discountList[i].coupon_ruleweekend == 3) {
            discountList[i].coupon_ruleweekend = '三'
          } else if (discountList[i].coupon_ruleweekend == 4) {
            discountList[i].coupon_ruleweekend = '四'
          } else if (discountList[i].coupon_ruleweekend == 5) {
            discountList[i].coupon_ruleweekend = '五'
          } else if (discountList[i].coupon_ruleweekend == 6) {
            discountList[i].coupon_ruleweekend = '六'
          } else if (discountList[i].coupon_ruleweekend == 7) {
            discountList[i].coupon_ruleweekend = '日'
          }
        }

        if (isnull) {
          console.log('没有搜索该关键词')
          that.setData({
            discountList: discountList,
            hidden: true,
            hiddenStore: false,
            loadcompleted: true,
            select_coupon: true,
            showid: 0
          })
        } else {
          that.setData({
            discountList: discountList,
            hidden: true,
            hiddenStore: true,
            select_coupon: true,
            showid: 1
            // loadcompleted: true,
          })
          //that.resultSum()
        }

        console.log('第' + pageNum1 + '页');
        console.log(discountList);
        var last = new Date();
        console.log(last.getSeconds() + ":" + last.getMilliseconds());

      },
      fail: function (res) {
        console.log('失败啦')
        that.setData({
          rquestFail: false,
        })
      },
    })
  },

  // 商业区
  selectArea: function (e) {
    var that = this;
    var countyObject = {
      "countyID": that.data.countyID
    }

    console.log(JSON.stringify(countyObject))

    wx.request({
      // url: 'https://mb.fsmbdlkj.com/diancanxing/shop/countyIDQueryArea',
      url: app.globalData.allUrl.defaultQueryArea,

      data: JSON.stringify(countyObject),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          cityright: res.data
        })
        console.log(that.data.cityright)
      }
    })
  },
  // 区域
  selectCounty: function (cityID) {
    var that = this;
    var countyObject = {
      "cityID": this.data.cityID
    }

    console.log(JSON.stringify(countyObject))

    wx.request({
      // url: 'https://mb.fsmbdlkj.com/diancanxing/shop/cityIDQueryCounty',
      url: app.globalData.allUrl.defaultQueryCounty,
      data: JSON.stringify(countyObject),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          citycenter: res.data
        })
        console.log(that.data.citycenter)
      }
    })
  },
  wxSearchInput: function (e) {
    var that = this;
    console.log(e)
    var key_word = e.detail.value
    that.setData({
      text: key_word
    })
  },
  wxSearchConfirm: function (e) {
    var that = this;
    var text = that.data.text
    if (text != '') {
      //先清空选择的选项
      that.reset()

      that.selectCouponInfo()
      that.setData({
        select_bol: true
      })
    } else {
      //把页数清零，当搜索为空的时候，显示原来的随机数组
      that.setData({
        pageNum1: 0,
        // pageNum:0,
        // stop_select1:false,
        stop_selectCoupon1: false
      })
      // this.select1()
      this.selectCoupon1()
      that.setData({
        select_bol: false
      })
    }
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var that = this
    that.selectCity();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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
    var that = this;
    if (that.data.shop_id == '') {
      // if(that.data.file_id == 0 && !that.data.stopSelect && !that.data.select_coupon){
      //   that.select1()
      // }
      if (that.data.file_id == 1 && !that.data.stopSelectCoupon) {
        that.selectCoupon1()
      }
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  getSelfLocation: function (into) {
    var that = this;
    //用户授权过可以直接获取位置
    wx.getLocation({
      //type: 'wgs84',
      type: 'gcj02',
      success: function (res) {
        var latitude = res.latitude;
        var longitude = res.longitude;
        that.setData({
          selfLongitude: longitude, //经度
          selfLatitude: latitude, //纬度        
        });
        if (into == 1) {
          that.selectCoupon()
        } else {
          that.selectCoupon1()
        }
      },
      fail: function (res) {
        setTimeout(function () {
          //需要用户授权获取位置
          wx.getSetting({
            success: (res) => {
              if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) { //非初始化进入该页面,且未授权
                wx.showModal({
                  title: '是否授权当前位置',
                  content: '需要获取您的地理位置，请确认授权，否则无法获取您所需数据',
                  success: function (res) {
                    if (res.cancel) {
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
                            wx.getLocation({
                              success: function (res) {
                                var latitude = res.latitude;
                                var longitude = res.longitude;
                                that.setData({
                                  selfLongitude: longitude, //经度
                                  selfLatitude: latitude, //纬度        
                                });
                                if (into == 1) {
                                  that.selectCoupon()
                                } else {
                                  that.selectCoupon1()
                                }
                              }
                            })
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
                wx.getLocation({
                  success: function (res) {
                    var latitude = res.latitude;
                    var longitude = res.longitude;
                    that.setData({
                      selfLongitude: longitude, //经度
                      selfLatitude: latitude, //纬度        
                    });
                  }
                })
                if (into == 1) {
                  that.selectCoupon()
                } else {
                  that.selectCoupon1()
                }
              } else { //授权后默认加载
                wx.getLocation({
                  success: function (res) {
                    var latitude = res.latitude;
                    var longitude = res.longitude;
                    that.setData({
                      selfLongitude: longitude, //经度
                      selfLatitude: latitude, //纬度        
                    });
                  }
                })
                if (into == 1) {
                  that.selectCoupon()
                } else {
                  that.selectCoupon1()
                }
              }
            }
          })
        }, 1000);
      }
    });
   },
})