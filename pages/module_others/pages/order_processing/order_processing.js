/**
 *  选择来料加工的页面，具有三种做法：选择做法、修改做法、新增做法
 * 1、选择做法的情况下是直接加入购物车的，类似多种做法的加入,按照全部位还是分部位的情况下区分。
 *  （1）全部位的情况下，
 * 2、修改做法的情况下，是新增一道相似的菜，菜名会加上“-n”，以此类推。修改了的金额、做法、配菜写入菜谱。并直接加入购物车
 * 3、新增菜品，顾名思义就是新增一道包括做法的菜，并直接加入购物车。包括新增部位和做法。必须要有一个全部位，否则会影响后面的操作。
 */
var app = getApp();
var UtilJS = require('../../../../utils/util.js');
const WXAPI = require('../../../../wxapi/main.js');
var remarkJS = require('../../../../utils/remark.js');

Page({
  /**
   * 页面的初始数据
   */
  data: {
    quedin:false,//新增名称控制
    show: false,
    display: "none",
    ingredientDisplay: 'none',
    hidden: true,
    typeHidden: true,
    fullHidden: true,
    partHidden: true,
    ingredientShow: false,
    hasSideDish: false,
    practiceList: [], //  全部位做法
    practiceList_all: [], // 所有分部位做法
    radio_on_url: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/radio_on.png",
    radio_off_url: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/radio_off.png",
    i_close_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/i_close.png',
    menu_img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/index/menu.png',
    shop_id: '',
    inputUnit: "斤",
    inputUnitprice: '',
    sideDishList: [],
    thisorderarry: [],
    partsName: [],
    eatingMethodCount: '',
    quickRemarkType: 0,
    sideDishMoney: 0,
    eatingMethodId: '',
    eatMethodArray: [],
    shrinkIntrIntroduction:true,
    eatMethodMoney: 0,
    order_id: "",
    remarks: "",
    tastes: "",
    tastesRemark: "",
    inputAmount: 0,
    min_wish_weight: '',
    max_wish_weight:'',
    sideDishesMoney: 0,
    dishes_inf: [],
    needRemain: false,
    sideDishList_choose: [],
    dishes_type: 0,
    menu_img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/index/menu.png',
    ordertype: 0, // 订单状态,  0-点餐 1-加餐
    showMultipleEatMethodView: false,
    showTaste: false,
    showpeicai: false,
    showRemarkList: false,
    practiceItem: '',
    practiceItems: [],
    eatMethodChooseIndex: -1,
    eatMethodRemark: "",
    eatMethodTastesRemark: "",
    hasWhole: true,
    ingredientsAmount: '',  //2020-12-15 好像是做法的金额
    money: 0,
    quickRemarkList: [],
    quickRemark:'', //2020-11-19 快捷备注，显示用
    addDishName:false,//是否新增菜名
    em_id_obj : [],//分部位的做法数组
    en_id_obj : [],//全部位的做法数组
    printArray:[],//打印机数组
    printShowArray:[],//打印机选择显示数组
    printIndex:-1,
    showPrint:false,//打印机弹窗
    code:'',//打印机编号
    AllNumber:0,//多规格多做法总数量
    presentation: '主动赠送',
  },

  inputName(e) {
    var that = this
    that.setData({
      inputName: e.detail.value
    })
  },

  inputUnit(e) {
    var that = this
    that.setData({
      inputUnit: e.detail.value
    })
  },

  inputUnitprice(e) {
    var that = this
    var money = 0
    money = Number(that.data.eatMethodMoney + Number(e.detail.value)) * Number(that.data.inputAmount) + that.data.sideDishMoney
    that.setData({
      inputUnitprice: e.detail.value,
      money: money
    })
  },

  // 显示多种做法的弹窗
  showMultipleEatMethodView(event) {
    var that = this;
    if (this.data.min_wish_weight != '' && this.data.max_wish_weight != '') {
      if (Number(this.data.min_wish_weight) > 0 && Number(this.data.max_wish_weight) > 0) {
        that.echoEatMothod(event);//选部位选做法回显
      }else if(Number(this.data.min_wish_weight) < Number(this.data.max_wish_weight)){
        wx.showModal({
          content: "请填写正确的数量范围!",
          confirmText: '关闭',
          showCancel: false
        })
      }else {
        wx.showModal({
          content: "数量必须大于零！",
          confirmText: '关闭',
          showCancel: false
        })
        //UtilJS.show_NOCANCEL_Model("数量必须大于零！");
      }
    } else {
      wx.showModal({
        content: "请填写数量！",
        confirmText: '关闭',
        showCancel: false
      })
      //UtilJS.show_NOCANCEL_Model("请填写数量！");
    }
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

  inputAmount(e) {
    var that = this
    if (that.data.practiceItem == '' || that.data.practiceItem == null) {
      that.setData({
        inputAmount: e.detail.value,
      })
    } else {
      that.setData({
        inputAmount: e.detail.value,
      })
    }
  },

  // inputAmountHasWhole(e) {
  //   var that = this
  //   if (that.data.hasWhole) {
  //     if (that.data.dishes_type == 0) {
  //       if (that.data.eatMethodArray.length != 0) {
  //         var eatMethodArray = that.data.eatMethodArray
  //         var practiceList = that.data.practiceList
  //         money = 0
  //         var ingredientsAmount = (that.data.dishes_inf.dishes_price*Number(e.detail.value)).toFixed(2)
  //         money = ingredientsAmount
  //         for(var i of eatMethodArray){
  //           money=Number(money)+Number(i.price)
  //         }
  //         money = Number(money).toFixed(2)
  //         // money = (Number(e.detail.value) * eatMethodArray[0].price).toFixed(2)
  //         // eatMethodArray[0].number = Number(e.detail.value)
  //         // eatMethodArray[0].money = Math.floor(Number(money) * 100) / 100

  //         // for (var x = 0; x < practiceList[0].length; x++) {
  //         //   if (practiceList[0][x].id == eatMethodArray[0].id) {
  //         //     practiceList[0][x].number = Number(e.detail.value)
  //         //     practiceList[0][x].money = Math.floor(Number(money) * 100) / 100
  //         //   } else {
  //         //     practiceList[0][x].number = ''
  //         //     practiceList[0][x].money = ''
  //         //   }
  //         // }

  //         that.setData({
  //           money: money,
  //           // practiceList: practiceList,
  //           ingredientsAmount: ingredientsAmount,
  //           eatMethodArray: eatMethodArray
  //         })
  //       }
  //     } else {
  //       var practiceItem = that.data.practiceItem

  //       if (practiceItem.place == "全部位") {
  //         var money = 0
  //         money = Number(that.data.inputUnitprice) * Number(e.detail.value) + that.data.sideDishMoney
  //         that.setData({
  //           money: money,
  //         })
  //       }
  //       that.setData({
  //         inputAmount: e.detail.value,
  //       })
  //     }

  //   }
  //   that.setData({
  //     inputAmount: e.detail.value,
  //   })
  // },
  //输入的最大重量
  inputAmountHasWhole(e) {
    var that = this
    if (that.data.hasWhole) {
      if (that.data.dishes_type == 0) {
        if (that.data.eatMethodArray.length != 0) {
          var eatMethodArray = that.data.eatMethodArray
          var practiceList = that.data.practiceList
          var money = 0
          money = Number(this.data.inputAmount) * eatMethodArray[0].price
          eatMethodArray[0].number = Number(this.data.inputAmount)
          eatMethodArray[0].money = Math.floor(Number(money) * 100) / 100

          for (var x = 0; x < practiceList[0].length; x++) {
            if (practiceList[0][x].id == eatMethodArray[0].id) {
              practiceList[0][x].number = Number(this.data.inputAmount)
              practiceList[0][x].money = Math.floor(Number(money) * 100) / 100
            } else {
              practiceList[0][x].number = ''
              practiceList[0][x].money = ''
            }
          }

          that.setData({
            money: money,
            practiceList: practiceList,
            //ingredientsAmount: ingredientsAmount,
            eatMethodArray: eatMethodArray
          })
        }
      } else {
        var practiceItem = that.data.practiceItem

        if (practiceItem.place == "全部位") {
          var money = 0
          money = Number(that.data.inputUnitprice) * Number(this.data.inputAmount) + that.data.sideDishMoney
          that.setData({
            money: money,
          })
        }
        that.setData({
          inputAmount: this.data.inputAmount,
        })
      }

    }
    that.setData({
      max_wish_weight:e.detail.value,
      inputAmount: this.data.inputAmount,
    })
  },
  // 输入的最小重量
  inputAmountHasWhole1: function (e) {
    console.log(e.detail.value)
    this.setData({
      min_wish_weight: e.detail.value
    })
  },


  // 显示选择配菜组件
  showpeicai: function (e) {
    if (this.data.eatMethodChooseIndex != -1 || this.data.dishes_type != 0) {
      var SelectSideDish = JSON.parse(JSON.stringify(this.data.SelectSideDish))
      var sideDishList_choose = this.data.sideDishList_choose
      var quickRemarkList = this.data.quickRemarkList
      var tasteList = JSON.parse(JSON.stringify(this.data.tasteList));
      var sideDishIndex = this.data.sideDishIndex;
      if(SelectSideDish != null){
        for (var x = 0; x < SelectSideDish.length; x++) {
          SelectSideDish[x].checked = false
          SelectSideDish[x].orderDetailedSum = 0
          SelectSideDish[x].orderDetailedNum = 0
          if (sideDishList_choose != '' && sideDishList_choose != undefined) {
            for (var y of sideDishList_choose) {
              if (y.ID == SelectSideDish[x].ID) {
                SelectSideDish[x].checked = y.checked
                SelectSideDish[x].orderDetailedSum = y.orderDetailedSum
                SelectSideDish[x].orderDetailedNum = y.orderDetailedNum
                sideDishIndex = x;
              }
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
      if(this.data.eatMethodChooseIndex != -1){
        for (var x = 0; x < tasteList.length; x++) {
          tasteList[x].checked = false
          var tastes = this.data.eatMethodArray[this.data.eatMethodChooseIndex].tastes;
          if (tastes != '' && tastes !== undefined) {
            var taste = tastes.split(',')
            for (var k of taste) {
              if (tasteList[x].value === k ) {
                tasteList[x].checked = true
              }
            }
          }
        }
      } else{
        for (var x = 0; x < tasteList.length; x++) {
          tasteList[x].checked = false
          if (this.data.tastes != '') {
            var taste = this.data.tastes(',');
            for(var k of taste){
              if (tasteList[x].value === k) {
                tasteList[x].checked = true
              }
            }
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
          sideDishIndex:sideDishIndex,
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

  inputPlace(e) {
    var that = this
    that.setData({
      inputPlace: e.detail.value
    })
  },
  inputPractice(e) {
    var that = this
    that.setData({
      inputPractice: e.detail.value
    })
  },

  inputAdditional(e) {
    var that = this
    that.setData({
      inputAdditional: e.detail.value
    })
  },

  cleanPractice(e) {
    var that = this
    that.setData({
      inputPlace: '',
      inputPractice: '',
      inputAdditional: '',
      eatingMethodCount: '',
      eatingMethodId: '',
      practiceItem: '',
      practiceIndex: ''
    })
  },

  selectIngredientType(e) {
    var that = this
    that.setData({
      ingredientShow: !that.data.ingredientShow,
      typeHidden: !that.data.typeHidden
    })
    if (that.data.ingredientShow == false) {
      that.setData({
        ingredientDisplay: "none"
      })
    } else {
      that.setData({
        ingredientDisplay: "flex"
      })
    }
  },

  ingredientTap(e) {
    var that = this
    that.setData({
      selectIngredientType: e.currentTarget.dataset.c.type_name
    })
    that.selectIngredientType()
    that.SelectSideDish(e.currentTarget.dataset.c.parent_type_id)
  },

  checkboxChange(e) {
    var that = this
    that.setData({
      practiceCheckbox: e.detail.value
    })
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
      if(that.data.eatMethodChooseIndex != -1){
          let tastes = that.data.eatMethodArray[that.data.eatMethodChooseIndex].tastes != undefined ? that.data.eatMethodArray[that.data.eatMethodChooseIndex].tastes : "";
          let tastesRemark = that.data.eatMethodArray[that.data.eatMethodChooseIndex].tastesRemark != undefined ? that.data.eatMethodArray[that.data.eatMethodChooseIndex].tastesRemark : "";
          this.data.eatMethodArray[that.data.eatMethodChooseIndex].tastes = tastes;
          this.data.eatMethodArray[that.data.eatMethodChooseIndex].tastesRemark = tastesRemark;
      }
      this.setData({
        tastes: event.detail,
        tastesRemark: tastesRemark,
        showTaste: !this.data.showTaste
      })
    } else {
      wx.showToast({
        title: '请选择口味',
        icon: 'none',
        duration: 2000,
        success: function () {}
      })
    }
  },

  checkbox(e) {
    var that = this
    var sideDishList = that.data.sideDishList
    var SelectSideDish = that.data.SelectSideDish
    var temp = SelectSideDish[e.currentTarget.dataset.index]
    var sideDishMoney = 0
    for (var x of that.data.practiceCheckbox) {
      if (x == temp.ID) {
        var medium = 1
      }
    }
    for (var x = 0; x < SelectSideDish.length; x++) {
      if (SelectSideDish[x].checked) {
        if (SelectSideDish[x].orderDetailedNum == '') {
          SelectSideDish[x].orderDetailedNum = 0
        }
        sideDishMoney += SelectSideDish[x].orderDetailedNum * SelectSideDish[x].sideDishdPrice * 0.01
      }
    }
    if (medium == 1) {
      SelectSideDish.splice(e.currentTarget.dataset.index, 1)
      SelectSideDish.unshift(temp)
      temp.checked = true
      sideDishList.push(temp)
      that.setData({
        sideDishMoney: sideDishMoney,
        SelectSideDish: SelectSideDish,
        sideDishList: sideDishList
      })
    } else {
      SelectSideDish.splice(e.currentTarget.dataset.index, 1)
      SelectSideDish.push(temp)
      temp.checked = false
      for (var x = 0; x < sideDishList.length; x++) {
        if (sideDishList[x].ID == temp.ID) {
          sideDishList.splice(x, 1)
        }
      }
      that.setData({
        sideDishMoney: sideDishMoney,
        SelectSideDish: SelectSideDish,
        sideDishList: sideDishList
      })
    }
  },

  // 备注内容回显
  remarks(event) {
    var that = this;
    this.setData({
      remarks: event.detail.remarkText
    })
    if(this.data.eatMethodChooseIndex != -1){
        var remarks = that.data.eatMethodArray[that.data.eatMethodChooseIndex].remarks != undefined ? that.data.eatMethodArray[that.data.eatMethodChooseIndex].remarks : "";
        var quickRemark = remarkJS.splitRemarkStr(remarks,0);
        this.data.eatMethodArray[this.data.eatMethodChooseIndex].remarks = remarkJS.joinRemarkStr(quickRemark,event.detail.remarkText);
    }
  },

  fullCheckboxChange(e) {
    var that = this
    that.setData({
      fullCheckboxChange: e.detail.value
    })
  },

  fullCheckbox(e) {
    var that = this
    that.setData({
      Item: e.currentTarget.dataset.c
    })
  },

  partCheckboxChange(e) {
    var that = this
    that.setData({
      partCheckboxChange: e.detail.value
    })
  },

  partCheckbox(e) {
    var that = this
    that.setData({
      Item: e.currentTarget.dataset.c
    })
  },

  fullPopup(e) {
    var that = this
    that.setData({
      hidden: !that.data.hidden,
      fullHidden: !that.data.fullHidden,
    })
  },
  partPopup(e) {
    var that = this
    that.setData({
      hidden: !that.data.hidden,
      partHidden: !that.data.partHidden
    })
  },
  hidden(e) {
    var that = this
    that.setData({
      hidden: true,
      fullHidden: true,
      partHidden: true
    })
  },
  typeHidden(e) {
    var that = this
    that.setData({
      hidden: true,
      typeHidden: true,
      fullHidden: true,
      partHidden: true,
      show: false,
      display: 'none',
      ingredientShow: false,
      ingredientDisplay: 'none'
    })
  },

  popupSure(e) {
    var that = this
    if (that.data.GetEmAndEaBySubclassTypeId != '' && that.data.GetEmAndEaBySubclassTypeId != undefined) {
      if (that.data.Item != '' && that.data.Item != undefined) {
        var Item = that.data.Item
        if (Item.all == 1) {
          var inputPlace = '全部位'
        } else {
          var inputPlace = Item.em_name
        }
        that.setData({
          inputPlace: inputPlace,
          inputPractice: Item.eating_method,
          inputAdditional: Item.money,
          eatingMethodCount: Item.count,
          eatingMethodId: Item.id,
        })
      }
    }
    that.hidden()
  },

  //处理新增的部位/做法
  itemize(dishesId) {
    var that = this
    var addEatingMethod;
    var addEatingMethodList = null;
    if(that.data.addDishName){
      addEatingMethodList = JSON.parse(JSON.stringify(that.data.practiceList));
    }else{
      addEatingMethod = JSON.parse(JSON.stringify(that.data.addEatingMethod));
    }
    if(addEatingMethodList != null){
      // for (var i = 0;i < addEatingMethodList.length;i++){
        that.insertEatingMethod(addEatingMethodList,dishesId);
      // }
    }else{
      that.insertEatingMethod1(addEatingMethod,dishesId);
    }
//17ms
  },

  reorder(e) {
    var that = this
    var SelectSideDish = []
    for (var x of that.data.sideDishList) {
      for (var y of e) {
        if (x.ID == y.ID) {
          y.checked = true
          y.orderDetailedNum = x.orderDetailedNum
          break
        }
      }
    }
    for (var z of e) {
      if (z.checked == true) {
        SelectSideDish.push(z)
      }
    }
    for (var x of e) {
      if (x.checked == false || x.checked == undefined) {
        SelectSideDish.push(x)
      }
    }
    that.setData({
      SelectSideDish: SelectSideDish
    })
    wx.hideLoading()
  },

  // 显示配菜组件 确认配菜
  submitSideDish: function (event) {
    var sideDishList_choose = event.detail.SideDishList_choose
    var sideDishMoney = 0

    if (sideDishList_choose.length != 0) {
      for (var x of sideDishList_choose) {
        sideDishMoney += x.money
      }

      if (that.data.dishes_type != 0) {
        var money = that.data.practiceItem.price
        money = Number(that.data.inputUnitprice) * Number(that.data.inputAmount) + sideDishMoney
        that.setData({
          money: money
        })
      } else {
        this.correctionAmount(this.data.eatMethodArray)
      }
      this.setData({
        sideDishMoney: sideDishMoney,
        sideDishList_choose: sideDishList_choose,
        sideDishList: event.detail.SideDishList,
        showpeicai: false,
      })
    } else {
      wx.showToast({
        icon: 'none',
        title: '没有选择配菜',
        duration: 3000
      })
    }
  },

  // 选择配菜的确认
  submitA: function (event) {
      var money = 0
      var sideDishesMoney = 0
      var methodMoney = 0
      var eatMethodArray = this.data.eatMethodArray
      for (var x of event.detail.SideDishList_choose) {
        sideDishesMoney += x.orderDetailedSum
      }
      if(this.data.dishes_inf.weighingByLocation == 1) {
        //来料加工
        methodMoney = eatMethodArray[this.data.eatMethodChooseIndex].price * eatMethodArray[this.data.eatMethodChooseIndex].number
      }else{
        methodMoney = eatMethodArray[this.data.eatMethodChooseIndex].price
      }

      money = methodMoney + sideDishesMoney

      eatMethodArray[this.data.eatMethodChooseIndex].tastes = event.detail.tastes
      eatMethodArray[this.data.eatMethodChooseIndex].tastesRemark = event.detail.tastesRemark
      eatMethodArray[this.data.eatMethodChooseIndex].remarks = event.detail.eatMethodRemark
      eatMethodArray[this.data.eatMethodChooseIndex].SideDishList = event.detail.SideDishList
      eatMethodArray[this.data.eatMethodChooseIndex].SideDishList_choose = event.detail.SideDishList_choose
      eatMethodArray[this.data.eatMethodChooseIndex].money = money

      this.setData({
        eatMethodArray: eatMethodArray,
        sideDishList_choose: event.detail.SideDishList_choose,
        tastesRemark: event.detail.tastesRemark,
        tastes: event.detail.tastes,
        remarks: event.detail.eatMethodRemark,
        showpeicai: false,
        SelectSideDish:event.detail.SideDishList
      })
      this.correctionAmount(eatMethodArray)
  },

  //获取备注模板 (常用、取消菜品理由、赠送理由)
  getRemarkNormal: function () {
    var that = this

    WXAPI.getDefaultRemark({
      shop_id: that.data.shop_id,
      remarkType: 1
    }).then(function (data) {
      var remark_normal = []
      if (data.result.result == 1) {
        for (var x of data.object) {
          var item = {
            value: x.defaultRemark,
            checked: false
          }
          remark_normal.push(item)
        }
      }
      app.globalData.remark_normal = remark_normal
      that.setData({
        quickRemarkList: remark_normal
      })
    })

    WXAPI.getDefaultRemark({
      shop_id: 19318,
      remarkType: 4
    }).then(function (data) {
      var remark_taste = []
      if (data.result.result == 1) {
        for (var x = 0; x < data.object.length; x++) {
          var item = {
            value: data.object[x].defaultRemark,
            checked: false
          }
          remark_taste.push(item)
        }
      }
      app.globalData.remark_taste = remark_taste
      that.setData({
        tasteList: remark_taste
      })
    })

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    // that.getRemarkNormal()
    var listData = app.globalData.listData;
    var bidDetailitem = {
          freeOrder: 0,
          repairOrder: 0,
          copyOrder: 1,
          waitOrder: 0,
          baleOrder: 0,
          transferOrder: 0,
          depositOrder: 0,
          firstIssue:1,
        };
    listData = that.pageageCheckListData(listData,bidDetailitem);
    that.setData({
      windowHeight:windowHeight,
      scroll_height: windowHeight * 750 / windowWidth - 330,
      remark_height: windowHeight * 750 / windowWidth - 330,
      // shop_id: app.globalData.shopDetail.shop_id,
      shop_id: app.globalData.shopdetail.shop_id,
      // shop_id: 19318,
      inputName: '',
      inputUnit: '',
      inputUnitprice: '',
      inputAmount: '',
      inputPlace: '',
      inputPractice: '',
      inputAdditional: '',
      eatingMethodCount: '',
      eatingMethodId: '',
      practiceList: [],
      practiceCheckbox: '',
      sideDishList: [],
      remarks: '',
      money: '',
      selectIngredientType: '',
      GetEmAndEaBySubclassTypeId: '',
      Item: '',
      itemizeList: [],
      cartList: [],
      quickRemarkList: app.globalData.remark_normal,
      tasteList: app.globalData.remark_taste,
      SelectSideDish: '',
      listData: listData ,
      bidDetailitem : bidDetailitem,
      ListOfPresentation: app.globalData.remark_gift,
    })

    if (options) {

      var dishes_inf = app.globalData.lailiaojiagongdishesinf

      if(dishes_inf.spec_type == 2){
        wx.setNavigationBarTitle({title: '多计量多做法'})
      }
      that.setData({
        dishes_inf: dishes_inf,
        shrinkIntrIntroduction:dishes_inf.sideDishes!=0,
        inputName: dishes_inf.dishes_name,
        inputUnit: dishes_inf.dishes_metering_type,
        inputUnitprice: dishes_inf.dishes_price,
        ordertype: options.ordertype,
        hasSideDish: dishes_inf.sideDishes != 0,
        cartList: app.globalData.cartList,
        order_id: options.orderid || app.globalData.order_id,
        firstIssue:options.firstIssue?options.firstIssue:0,
      })
      if (dishes_inf.sideDishes != 0) { // 存在配菜
        that.SelectSideDish(dishes_inf.sideDishes)
      }
      that.GetEatMethod(dishes_inf.dishes_id);

    }
    that.SelectDishesPC()
    that.SelectDishesSC()
    if(dishes_inf.spec_type == 8){
      let addtobuyarry = [];
      for (let i = 0; i < app.globalData.cartList.length; i++) {
        let cartListItem = app.globalData.cartList[i];
        if(!cartListItem.hadOrdered){
          addtobuyarry.push(cartListItem);
        }
      }
      that.setData({
        addtobuyarry:addtobuyarry,
      })
      that.SelectPrinter(app.globalData.shopDetail.shop_id);
    }
  },

  SelectDishesPC: function (e) { //二级菜单
    var that = this
    WXAPI.selectDishesPC({
      shop_id: that.data.shop_id,
      sideDish: 1
    }).then(function (data) {
      if (data.result.result == 1) {
        that.setData({
          SelectDishesPC: data.object
        })
      } else {
        that.setData({
          SelectDishesPC: ''
        })
      }
    }).catch(res => {
    })
  },

  SelectDishesSC: function (e) { //三级菜单
    var that = this
    WXAPI.selectDishesSC({
      shop_id: that.data.shop_id
    }).then(function (data) {
      if (data.result.result == 1) {
        that.setData({
          SelectDishesSC: data.object
        })
      } else {
        that.setData({
          SelectDishesSC: ''
        })
      }
    }).catch(res => {
    })
  },

  GetEmAndEaBySubclassTypeId: function (subclass_type_id) { //查询部位
    var that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    WXAPI.getEmAndEaBySubclassTypeId({
      subclass_type_id: subclass_type_id
    }).then(function (data) {
      if (data.result.result == 1) {
        that.setData({
          GetEmAndEaBySubclassTypeId: data.object
        })
      } else {
        that.setData({
          GetEmAndEaBySubclassTypeId: ''
        })
      }
      wx.hideLoading()
    }).catch(res => {
    })
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
        var list = []
        list = data.object.map(item => ({
          ...item,
          checked: false,
          orderDetailedSum: 0,
          orderDetailedNum: 0
        }))
        that.setData({
          SelectSideDish: list
        })
        // that.reorder(data.object)
      } else {
        that.setData({
          SelectSideDish: []
        })
      }
      wx.hideLoading()
    }).catch(res => {
    })
  },

//  AddEmBlock: function (e) { //添加部位
//     var that = this
//     var temp = []
//     for(var a of e){
//       var temp1={
//         em_name :a.em_name,
//         all: a.all,
//       }
//       temp.push(temp1)
//     }
//   //   WXAPI.addEmBlock({
//   //     emBlock:jsonStr,
//   //     shop_id: that.data.shop_id,
//   //     dishes_id: e[0].dishes_id
//   //  })
//     if(temp.length!=0){
//       var list1 = []
//       var jsonStr = JSON.stringify(temp)
//       wx.request({
//         header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
//         url: 'http://localhost:8080/WX%20Restaurant/AddEmBlock',
//         dataType:"json",
//         method:"POST",
//         data:{
//           emBlock:jsonStr,
//           shop_id: that.data.shop_id,
//           dishes_id: e[0].dishes_id
//         },
//         success: (res) => {
//           if (res.data.result.result == 1) {
//             for(var b of e)       
//               var list = {
//                 id: res.data.object.id,
//                 method: b.method
//               }
//               list1.push(list)
//               that.AddEatingMethod(list1,e[0].dishes_id)
//           } else {
//             wx.showToast({
//               title: '信息不完整',
//               icon: 'success',
//               duration: 3000
//             })
//           }
//         }
//       })
//     }
     
//   },

  AddEatingMethod: function (e,dishesId,onlyEatmethod) { //添加吃法
    let that=this
    var temp = []
    var jsonStr;
    var data1 = []
    if(onlyEatmethod==1){
      for(var a of e){
        var temp1={
          eating_method:a.method[0].eating_method,
          price:a.method[0].price,
          count:a.id
        }
        temp.push(temp1)
      }
      jsonStr = JSON.stringify(temp)
      data1={
        eating_method: jsonStr,
        dishes_id: dishesId,
        onlyEatmethod:onlyEatmethod
      }
    }else{
      e
      jsonStr = JSON.stringify(e)
      data1={
        eating_method: jsonStr,
        shop_id: that.data.shop_id,
        dishes_id: dishesId,
        onlyEatmethod:onlyEatmethod
      }
    }
    wx.request({
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
      // url: 'http://192.168.8.3:8080/WX%20Restaurant/AddEatingMethodXCX',
      url: app.globalData.AddEatingMethod_url, //不新增菜  只新增部位或做法调这个接口
      dataType:"json",
      method:"POST",
      data:data1
    })
   
      // for(var i = 0;i <e.method.length ; i++){
      //   if (e.method[i].eating_method && e.id && e.method[i].money) {
          // WXAPI.addEatingMethod({
          //   eating_method: jsonStr,
          //   dishes_id: dishesId,
          //   count:e.id,
          // }).then(res=> {
          //   if (res.result.result == 1) {

          //   } else {
          //   }
          // }).catch(res => {
          // })
          
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

  //添加菜品到购物车(新增菜名、新增部位、新增做法才使用)
  WriteDishesToCartList: function (e) {
    console.log("触发123456798465123165468432165798321234654987")
    var time1 = Date.now()
    var that = this
    wx.showLoading({
      title: '上传中',
      mask: true
    })

    var dishes_id = -1
    var sideDishList = that.data.sideDishList
    var SelectSideDish = that.data.SelectSideDish

    var number = that.data.eatMethodArray.length?that.data.eatMethodArray.length:1;
    var dish = that.createDish();
    if(that.data.addDishName){
      wx.request({
        url: app.globalData.WriteDishes_url,
        method: 'GET',
        data: dish,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          if (res.data.result.result == 1) {
            dishes_id = res.data.object.dishes_id
            app.globalData.dishes_inf = res.data.object
            app.globalData.newTemp = true
            //app.globalData.dishes_inf.dishes_id = dishes_id
            that.itemize(dishes_id) //17ms
            var isWhole = that.insertBasicarry(dishes_id); //16ms左右
            that.finalNavigateBack(isWhole,number,dishes_id,sideDishList);//操作完成返回上一页
            var time2 = Date.now()
            console.log("WriteDishesToCartList:"+(time2-time1))
          } else if (res.data.result.result != 1) {
          }
        }
      })
    }else{
      dishes_id = that.data.dishes_inf.dishes_id;
      that.itemize(dishes_id,SelectSideDish);
      var isWhole = that.insertBasicarry(dishes_id);
      that.finalNavigateBack(isWhole,number,dishes_id,SelectSideDish);//操作完成返回上一页
    }
   //79ms
  },

  //显示菜品介绍的弹框
  showIntroduction: function () {
    this.setData({
      showIntroduction: !this.data.showIntroduction
    })
  },

  /**
   * 2021-01-08 矫正金额，重写金额，因为来料加工跟称重多做法合并了，
   * @param eatMethodArray
   * 单价 hasWhole?inputUnitprice:dishes_inf!=''?dishes_inf.dishes_price!=0?dishes_inf.dishes_price:'':''
   * 金额 ingredientsAmount
   * 总金额 money
   * 做法 eatMethodArray{
   *      单价/加收 price
   *      重量/数量 number
   *      不含配菜的价格 no_sideDish_money
   *      含配菜的价格 money
   * }
   */
  correctionAmount: function (eatMethodArray) {
    var that = this
    var money = 0
    var ingredientsAmount = 0
    var sideDishesMoney = 0
    // 数量 * 单价 + 做法的加收 + 加收
    if (eatMethodArray.length != 0) {
      for (var x of this.data.eatMethodArray) {
        money += x.money
        if(that.data.dishes_inf.weighingByLocation == 1){
          ingredientsAmount += x.price * x.number
        }else{
          //不算加收的价格
          //ingredientsAmount += x.price
          ingredientsAmount += 0
        }

        if(x.SideDishList_choose != null && x.SideDishList_choose.length != 0){
          for (let i = 0; i < x.SideDishList_choose.length; i++) {
            sideDishesMoney += Number(x.SideDishList_choose[i].orderDetailedNum) * Number(x.SideDishList_choose[i].orderDetailedSum)
          }
        }
      }
    }
    var dishesPrice = that.data.dishes_inf.dishes_price * that.data.inputAmount;
    that.setData({
      money: money + Number(dishesPrice),
      ingredientsAmount: ingredientsAmount + Number(dishesPrice)
      // ingredientsAmount:ingredientsAmount
    })
  },

  // 新的加入购物车，因为各个部位做法都是单独的一道菜，所以
  addToCartList_new: function (e) {
    console.log("触发123456789456465798413156468")
    var that = this
    var cartList = that.data.cartList
    var eatMethodArray = that.data.eatMethodArray
    var money = 0
    var number = 0
    var dishesInToCart = '';
    var remarkStr = '';

    if (eatMethodArray == '' || eatMethodArray == null) {
      // UtilJS.show_NOCANCEL_Model("请选择吃法！");
    } 
    // else if (that.data.inputAmount === '' || that.data.inputAmount === null) {
    //   UtilJS.show_NOCANCEL_Model("请输入数量！");
    // } 
    // else if (that.data.inputAmount == 0) {
    //   UtilJS.show_NOCANCEL_Model("数量不能为零！");
    // } 
    else {
      var hasNumber = true
      if (!that.data.hasWhole) {
        var allNumber = 0
        for (var x of eatMethodArray) {
          allNumber += Number(x.number)
        }
        if (allNumber.toFixed(2) != Number(that.data.inputAmount).toFixed(2)) {
          hasNumber = false
        }
      }
      if (!hasNumber && that.data.dishes_inf.weighingByLocation == 1) {
        UtilJS.show_NOCANCEL_Model("分部位数量之和不等于总数量!");
      } else {
        if (that.data.hasWhole) { // 全部位
          //2020-11-19 快捷备注重写
          remarkStr = that.data.remarks
          if(that.data.quickRemark != undefined && that.data.quickRemark != "" && that.data.quickRemark != null){
            let quickRemark = that.data.quickRemark
            remarkStr = quickRemark + ";" + that.data.remarks
          }
          var em_id_obj = []
          var en_id_obj = []
          var sideDisht = ''
          if (eatMethodArray[0].SideDishList != '' && eatMethodArray[0].SideDishList != null) { // 记录配菜
            for (var i = 0; i < eatMethodArray[0].SideDishList.length; i++) {
              if (eatMethodArray[0].SideDishList[i].checked) {
                sideDisht = sideDisht + eatMethodArray[0].SideDishList[i].ID + '-' + eatMethodArray[0].SideDishList[i].orderDetailedNum + ','
              }
            }
          }
          en_id_obj = eatMethodArray;
          em_id_obj = []
          var addTemp = {
            isWhole: true,
            ingredientsAmount:that.data.ingredientsAmount,//食材的钱
            SideDishList: eatMethodArray[0].SideDishList,
            item_number: eatMethodArray[0].number + ',' + eatMethodArray[0].number,
            remark: remarkStr,
            sideDisht: sideDisht,
            sum: Number(that.data.money),
            em_index: em_id_obj,
            em_basicarry: em_id_obj,//部位、做法信息，购物车用到，下单详情用到
            en_basicarry: en_id_obj,//部位、做法信息，购物车用到，下单详情用到
            en_index: en_id_obj,
            weighingByLocation:that.data.dishes_inf.weighingByLocation,
            vip_price:that.data.dishes_inf.vip_price,
            inline_price:that.data.dishes_inf.inline_price,
            max_wish_weight:that.data.max_wish_weight,
            min_wish_weight:that.data.min_wish_weight
          }
          if(addTemp.weighingByLocation==0){
            let num = 1;
            eatMethodArray.forEach((e,i)=>{
              e.em_count = num+'/'+eatMethodArray.length
              num++;
            })
            addTemp.em_count = 1+'/'+eatMethodArray.length
          }
        } else {
          var em_id_obj = []
          var en_id_obj = []
          var sideDisht = ''

          en_id_obj = []
          em_id_obj = eatMethodArray;

          var addTemp = {
            isWhole: false,
            ingredientsAmount:that.data.ingredientsAmount,//食材的钱
            SideDishList: [],
            item_number: that.data.inputAmount,
            remark: remarkStr,
            sideDisht: sideDisht,
            sum: Number(that.data.money),
            em_index: em_id_obj,
            em_basicarry: em_id_obj,//部位、做法信息，购物车用到，下单详情用到
            en_basicarry: en_id_obj,//部位、做法信息，购物车用到，下单详情用到
            en_index: en_id_obj,
            weighingByLocation:that.data.dishes_inf.weighingByLocation,
            vip_price:that.data.dishes_inf.vip_price,
            inline_price:that.data.dishes_inf.inline_price,
            max_wish_weight:that.data.max_wish_weight,
            min_wish_weight:that.data.min_wish_weight
          }
        }
        var temp = that.createCartListTemp(addTemp);
        money += that.data.money
        dishesInToCart = temp;
        number = eatMethodArray.length;
        if(that.data.ordertype == 0 &&that.data.dishes_inf.spec_type == 8) {//0-下单、1-加餐
          that.writeOrder(dishesInToCart,number,money);
        }else if(that.data.ordertype == 1 && that.data.dishes_inf.spec_type == 8){
          that.updateOrder(dishesInToCart,number,money);
        }else{
          cartList.push(temp)
          that.navigateBack(cartList,number,money);
        }
      }
    }
  },

  // 获取吃法
  GetEatMethod: function (dishes_id) {
    var that = this
    if (dishes_id != '') {
      WXAPI.selectEatingMethod({
        dishes_id: dishes_id
      }).then(function (data) {
        var partsName = []
        var practiceList = []
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
                partsName.push({
                  "em_name": em_arry[x][0].em_name,
                  "checked": false
                })
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
              }
              if (that.data.dishes_type == 1) {
                for (var x = 0; x < em_arry.length; x++) {
                  for (var y = 0; y < em_arry[x].length; y++) {
                    practiceList.push(em_arry[x][y])
                  }
                }
              } else {
                practiceList = em_arry
              }

            } else {
            }
          }
        } else {
        }

        that.setData({
          partsName: partsName,
          needRemain: needRemain,
          practiceList: practiceList,
        })
        wx.hideLoading()
      }).catch(res => {
        wx.hideLoading({
          complete: (res) => {},
        })
      })
    } else {
      consol.log("不存在dishes_id")
    }
  },

  // 常用口味选择
  chooseTaste: function () {
    var that = this
    if (!that.data.showTaste) {
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
      that.setData({
        showTaste: false
      })
    }
  },

  //确认做法
  submitEatMethod: function (event) {
    var that = this
    if (event.detail.result == 0) {
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
      wx.showToast({
        icon: 'none',
        title: '请选择剩余部位的做法！',
        duration: 3000
      })
    } else if (event.detail.result == 1) {
      var eatMethodArray = event.detail.eatMethodArray;
      var em_arry = event.detail.em_arry;
      var inputUnitprice = 0;
      if (eatMethodArray[0].place == '全部位') {
        inputUnitprice = that.data.inputUnitprice != '' ? Number(that.data.inputUnitprice) : 0;
        eatMethodArray[0].tastes = that.data.tastes != '' ? that.data.tastes : ''
        eatMethodArray[0].tastesRemark = that.data.tastesRemark != '' ? that.data.tastesRemark : ''
        eatMethodArray[0].remarks = that.data.remarks != '' ? that.data.remarks : ''
        eatMethodArray[0].SideDishList = that.data.SelectSideDish != '' ? that.data.SelectSideDish : []
        eatMethodArray[0].SideDishList_choose = that.data.sideDishList_choose != '' ? that.data.sideDishList_choose : []
        //把配菜金额赋值回去
        if (eatMethodArray[0].SideDishList_choose) {
          if (eatMethodArray[0].SideDishList_choose != '') {
            var money = 0
            var add = 0
            for (var y of eatMethodArray[0].SideDishList_choose) {
              add += y.orderDetailedSum
            }
            if(that.data.dishes_inf.spec_type == 8){
              //来料加工
              money = eatMethodArray[0].price * Number(eatMethodArray[0].number);
            }else{
              money = eatMethodArray[0].price
            }
            money = money + add
            // money = Math.floor(Number(money) * 100) / 100
            eatMethodArray[0].money = money
          }
        }
        that.setData({
          eatMethodArray: eatMethodArray,
          hasWhole: true,
          inputAmount: eatMethodArray[0].number,
          inputUnitprice: inputUnitprice,
          en_index: event.detail.isWhole ? eatMethodArray : [],
          en_basicarry: event.detail.isWhole ? eatMethodArray : [],
          em_index: !event.detail.isWhole ? eatMethodArray : [],
          em_basicarry: !event.detail.isWhole ? eatMethodArray : [],
          eatMethodChooseIndex: 0,
          practiceItem: eatMethodArray[0],
          showMultipleEatMethodView: false,
          practiceList:em_arry,
          partsName:event.detail.partsName,
          addEatingMethod:event.detail.addEatingMethod
        })
        that.correctionAmount(eatMethodArray)

      } else {
        if(this.data.eatMethodChooseIndex==-1){
          this.setData({eatMethodChooseIndex:0})
        }
        // var eatMethodArrayR = that.data.eatMethodArray
        // if(that.data.dishes_inf.weighingByLocation == 1){
        //   eatMethodArrayR = []
        // }
        var eatMethodArrayR = []
        var inputUnitprice = that.data.inputUnitprice != '' ? Number(that.data.inputUnitprice) : 0;
        var hasWhole = false;
        for (var x = 0; x < eatMethodArray.length; x++) {
          if (eatMethodArray[x].number > 0 && that.data.dishes_inf.weighingByLocation == 1) {
            if (eatMethodArray[x].SideDishList_choose) {
              if (eatMethodArray[x].SideDishList_choose != '') {
                var money = 0
                var add = 0
                for (var y of eatMethodArray[x].SideDishList_choose) {
                  add += y.orderDetailedSum
                }
                money = eatMethodArray[x].price * Number(eatMethodArray[x].number) + add
                // money = Math.floor(Number(money) * 100) / 100
                eatMethodArray[x].money = money
              }
            }
            eatMethodArrayR.push(eatMethodArray[x])
          }else if(that.data.dishes_inf.weighingByLocation == null || that.data.dishes_inf.weighingByLocation != 1){
            hasWhole = true;
            if (eatMethodArray[x].SideDishList_choose) {
              if (eatMethodArray[x].SideDishList_choose != '') {
                var money = 0
                var add = 0
                for (var y of eatMethodArray[x].SideDishList_choose) {
                  add += y.orderDetailedSum
                }
                // money = Math.floor(Number(add) * 100) / 100
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
          sideDishList: eatMethodArrayR[this.data.eatMethodChooseIndex].SideDishList,
          sideDishList_choose: eatMethodArrayR[this.data.eatMethodChooseIndex].SideDishList_choose,
          en_index: event.detail.isWhole ? eatMethodArrayR : [],
          en_basicarry: event.detail.isWhole ? eatMethodArrayR : [],
          em_index: !event.detail.isWhole ? eatMethodArrayR : [],
          em_basicarry: !event.detail.isWhole ? eatMethodArrayR : [],
          showMultipleEatMethodView: false,
          practiceList:em_arry,
          partsName:event.detail.partsName,
        })
        this.correctionAmount(eatMethodArrayR)
        this.setData({
          eatMethodChooseIndex: 0,
          practiceItem: eatMethodArrayR[0],
          addEatingMethod:event.detail.addEatingMethod
        })
      }
    }
  },

  //弹窗--打印机， alex
  showPrint:function(){
    var that = this;
    if (that.data.eatMethodArray.length == 0) {
      wx.showToast({
        title: '请选择做法',
        icon: 'none',
        duration: 2000,
      })
    }else{
      if(that.data.dishes_inf.spec_type == 8) {//0-下单、1-加餐
        this.setData({
          showPrint:!this.data.showPrint,
        })
      }else{
        that.submit();
      }
    } 
  },

  /**
   * 1.先记录打印机编号
   * 2.如果未出单，则先出单
   * 3.继续执行之后的逻辑
   */
  submitTheOrder:function(){
    var that = this;
    var code = '';//打印机编号
    if(that.data.showPrint){
      if(that.data.printIndex>-1){
        code = that.data.printArray[that.data.printIndex].printer_id;
        that.setData({
          showPrint:!that.data.showPrint,
          code:code,
        })
        that.submit();
      }else {
        UtilJS.show_NOCANCEL_Model("请选择打印机！");
      }
    }
  },
  //提交
  submit: function (e) {
    var time1 = Date.now()
    var that = this
    if(that.data.addDishName == false && that.data.addEatingMethod.length == 0){
      // 新的加入购物车，因为各个部位做法都是单独的一道菜
      that.addToCartList_new();   
    }
    else{
      // 添加菜品到购物车(新增菜名、新增部位、新增做法才使用)
      that.WriteDishesToCartList();  
    }
    var time2 = Date.now()
    console.log("submit:"+(time2-time1))
    //82ms
  },

  showRemarkList: function (e) {
    var that = this
    var quickRemarkList = that.data.quickRemarkList
    for (var x = 0; x < quickRemarkList.length; x++) {
      quickRemarkList[x].checked = false
    }

    that.setData({
      showRemarkList: !that.data.showRemarkList,
      quickRemarkList: quickRemarkList,
      quickRemarkType: 0,
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

  hideModal: function (e) {
    var that = this
    that.setData({
      showRemarkList: false,
      quickRemarkList: app.globalData.remark_normal,
    })
  },

  // 快捷备注，区分订单和菜品
  quickRemarkConfirm: function (event) {
    var that = this
    var temps = event.detail;
    if (temps == '') {
      wx.showToast({
        title: '未选择常用备注！',
        icon: 'none',
        duration: 2000,
      })
    } else {
      if (that.data.quickRemarkType == 0) {
        if(that.data.eatMethodChooseIndex != -1){
          var tempArray = temps.split("、")
          var remarks = that.data.eatMethodArray[that.data.eatMethodChooseIndex].remarks != undefined ? that.data.eatMethodArray[that.data.eatMethodChooseIndex].remarks : "";
          temps = app.tempArray(remarks, tempArray)
          remarks = remarkJS.splitRemarkStr(remarks,1);
          var quickRemarkList = app.globalData.remark_normal;
          that.data.eatMethodArray[that.data.eatMethodChooseIndex].quickRemark = temps;
          that.data.eatMethodArray[that.data.eatMethodChooseIndex].remarks = remarkJS.joinRemarkStr(temps,remarks);
        }else{
          var tempArray = temps.split("、")
          var remarks = that.data.remarks != undefined ? that.data.remarks : ""
          var quickRemarkList = app.globalData.remark_normal
          temps = app.tempArray(remarks, tempArray)
        }
        that.setData({
          quickRemark:event.detail,
          quickRemarkList: quickRemarkList,
          showRemarkList: false
        })
      } else {
      }
    }
  },
  //选择做法
  eatMethodChoose: function (event) {
    var SideDishList_choose = this.data.eatMethodArray[event.detail].SideDishList_choose;
    if (event.detail != -1) {
      var remarks = remarkJS.splitRemarkStr(this.data.eatMethodArray[event.detail].remarks,1);
      var quickRemark = remarkJS.splitRemarkStr(this.data.eatMethodArray[event.detail].remarks,0);
      this.setData({
        eatMethodChooseIndex: event.detail,
        sideDishList_choose: SideDishList_choose != null ? SideDishList_choose: [],
        tastesRemark: this.data.eatMethodArray[event.detail].tastesRemark,
        remarks: remarks,
        quickRemark:quickRemark
      })
    } else {
      this.setData({
        eatMethodChooseIndex: event.detail,
        sideDishList_choose: [],
        tastesRemark: "",
        remarks: "",
        quickRemark:event.quickRemark
      })
    }
  },

  //点击新增菜品按钮
  changeAddName:function(){
    var that = this;
    var dishes_inf = that.data.dishes_inf;
    that.setData({
      quedin:!that.data.quedin,
    })
    if(dishes_inf.dishes_name!=that.data.inputName){
      that.setData({
        addDishName:!that.data.addDishName,
      })
      if(that.data.addDishName){
        that.GetEatMethod(dishes_inf.dishes_id);
      }
    }
  },

  //菜品常用参数
  createDish:function(){
    var that = this;
    var temp = {
      sales_category: 0,
      dishes_img: that.data.dishes_inf.dishes_img,
      dishes_introduce: '',
      dishes_metering_type: that.data.inputUnit,
      dishes_name: that.data.inputName,
      dishes_price: that.data.inputUnitprice != '' ? Number(that.data.inputUnitprice) : 0,
      dishesNum: 1,
      dishes_pricing: 1,
      dishes_recommend: 0,
      dishes_specialty: 0,
      dishes_statu: 2,
      subclass_type_id: that.data.dishes_inf.subclass_type_id,
      parent_type_id: that.data.dishes_inf.parent_type_id,
      class_i_id: that.data.dishes_inf.class_i_id,
      sideDishes: that.data.dishes_inf.sideDishes,
      shop_id: that.data.shop_id,
      dishes_discount: 0,
      spec_type: 8,
      commercial_area_id: 17,
      county_id: 1,
      city_id: 1,
      preferential: 0,
      xd: 0,
      monthly_sales_volume: 0,
      nature: '饲养',
      place_of_origin: '省内',
      position: 3,
      weighing: 1,
      specal_type: 5,
      big_dishes_img: that.data.dishes_type == 1 ? that.data.dishes_inf.big_dishes_img : 'https://test.fsmbdlkj.com/wx_official/web/images/image/lljg.png',
      dishes_controller: '',
      querendengji: 0,
      xiugaidengji: 0,
      finished_product: 0,
      reduce_flag: 0,
      residual_alarm: 0,
      weighingByLocation:that.data.dishes_inf.weighingByLocation,//是否按部位称重-开关
    }
    return temp;
  },

  //购物车常用参数
  createCartListTemp:function(addTemp){
    var that = this;
    let item_type = that.data.item_type;
    if(item_type == null){
      if(that.data.ordertype == 1 || that.data.ordertype == "1"){
        item_type = 2;
      }else{
        item_type = 0;
      }
    }
    if(item_type == 2 && that.data.firstIssue == 1){
      item_type = 0;
    }
    var temp = {
      id: 0,
      name: that.data.inputName,
      price: Number(that.data.inputUnitprice),
      measurement_value: that.data.inputAmount,
      dishes_price: Number(that.data.inputUnitprice),
      // number: 1,
      number:that.data.eatMethodArray.length,
      img_url: !that.data.addDishName ? that.data.dishes_inf.big_dishes_img : 'https://test.fsmbdlkj.com/wx_official/web/images/image/lljg.png',
      big_img_url: !that.data.addDishName ? that.data.dishes_inf.big_dishes_img : 'https://test.fsmbdlkj.com/wx_official/web/images/image/lljg.png',
      dishes_id: that.data.dishes_inf.dishes_id,
      spec_name: "称重",
      // spec_type: that.data.inputUnit,
      spec_type:that.data.dishes_inf.spec_type,
      dishes_spec_type: that.data.dishes_inf.spec_type,
      dishes_metering_type: that.data.inputUnit,
      disher_weight: Number(that.data.inputAmount),
      specal_type: 5,
      weighing: 1,
      adddishes_flag: 0,
      disher_weight_ceiling: Number(that.data.inputAmount),
      em_index: that.data.em_id_obj,//部位、做法信息，购物车用到，下单详情用到，对应下单页面的eatMethodArray，配菜用到
      em_basicarry: that.data.em_id_obj,//部位、做法信息，购物车用到，下单详情用到,对应下单页面的eatMethodArray
      en_basicarry: that.data.en_id_obj,//部位、做法信息，购物车用到，下单详情用到,对应下单页面的eatMethodArray
      en_index: that.data.en_id_obj,//部位、做法信息，购物车用到，下单详情用到，对应下单页面的eatMethodArray，配菜用到
      dishes_status: 5,
      dishes_index: 1,
      item_type: item_type,
      tastes: that.data.tastes,
      tastesRemark: that.data.tastesRemark,
      jointSet: "",
      hadOrdered: false,
      freeOrder: that.data.bidDetailitem.freeOrder,
      repairOrder: that.data.bidDetailitem.repairOrder,
      copyOrder: that.data.bidDetailitem.copyOrder,
      waitOrder: that.data.bidDetailitem.waitOrder,
      baleOrder: that.data.bidDetailitem.baleOrder,
      transferOrder: that.data.bidDetailitem.transferOrder,
      depositOrder: that.data.bidDetailitem.depositOrder,
      cartList_index: -1,
      listData: "",
      dishes_introduce: that.data.dishes_inf.dishes_introduce,
    }
    temp = Object.assign(temp,addTemp);
    return temp;
  },

  //最后操作，操作完成返回上一页
  finalNavigateBack:function(isWhole,number,dishesId,SideDishList){
    var time1 = Date.now()
    var that = this;
    var sum = Number(that.data.money + that.data.sideDishMoney).toFixed(2);
    var inputAmount = that.data.inputAmount + ',' + that.data.inputAmount;

    var sideDisht = '';
    var sideDishList_choose = that.data.sideDishList_choose;
    if (sideDishList_choose != null && sideDishList_choose != '') { // 记录配菜
      for (var i = 0; i < sideDishList_choose.length; i++) {
        if (sideDishList_choose[i].checked) {
          sideDisht = sideDisht + sideDishList_choose[i].ID + '-' + sideDishList_choose[i].orderDetailedNum + ',',
              sideDishList_choose[i].orderDetailedSum = Number((Number(sideDishList_choose[i].orderDetailedNum) * Number(sideDishList_choose[i].sideDishdPrice) / 100).toFixed(2))
        }
        sideDishList_choose[i].orderDetailedNum = Number(sideDishList_choose[i].orderDetailedNum)
      }
    }

    app.getmenu() //获取菜单, 有个问题，因为菜单具有状态，所以每次必须重新获取
    var addTemp = {
      isWhole:isWhole,
      SideDishList:SideDishList,//配菜信息，包括选中的信息，下单详情用到
      dishes_id:dishesId,
      item_number:inputAmount,
      sideDisht: sideDisht,//好像没有用到
      sum: Number(sum),
      ingredientsAmount:Number(sum),
      weighingByLocation:that.data.dishes_inf.weighingByLocation
    }
    var temp = that.createCartListTemp(addTemp);
    // var cartList = that.data.cartList;
    if(that.data.ordertype == 0 &&that.data.dishes_inf.spec_type == 8) {//0-下单、1-加餐
      that.writeOrder(temp,number,sum);
    }else if(that.data.ordertype == 1 && that.data.dishes_inf.spec_type == 8){
      that.updateOrder(temp,number,sum);
    }
    var time2 = Date.now()
    console.log("finalNavigateBack:"+(time2-time1))
 //39ms
  },

  //新增部位、做法通用方法
  // insertEatingMethod:function(addEatingMethod,dishesId){
  //   var that = this;
  //   var temp1 =[]
    // if(addEatingMethod != null && addEatingMethod.length != 0){
    //   var list = [];//新增部位
    //   var hasEmBlock = false;//是否有相同名字的新增部位
    //   for (let i = 0; i < addEatingMethod.length; i++) {
    //     if(addEatingMethod[i].count != null && addEatingMethod[i].count != "" && !that.data.addDishName && addEatingMethod[i].count != -1){
    //       //部位没有新增
    //       var tempList = [];
    //       tempList.push(JSON.parse(JSON.stringify(addEatingMethod[i])));
    //       var temp = {
    //         id: addEatingMethod[i].count,
    //         method:tempList
    //       };
    //       temp1 .push(temp)
    //       if(i==addEatingMethod.length-1){
    //         that.AddEatingMethod(temp1,dishesId);
    //       }
    //     }else{
    //       //有新增部位
    //       for (var y of list) {
    //         if (addEatingMethod[i].em_name == y.em_name) {
    //           y.method.push(addEatingMethod[i]);
    //           hasEmBlock = true;
    //         }
    //       }
    //       if(!hasEmBlock){
    //         addEatingMethod[i].dishes_id = dishesId;
    //         var tempList = [];
    //         tempList.push(JSON.parse(JSON.stringify(addEatingMethod[i])));
    //         addEatingMethod[i].method = tempList;
    //         list.push(addEatingMethod[i]);
    //       }
    //       hasEmBlock = false;
    //     }
    //   }
    //   if(list.length != 0){
    //     // for (var z of list){
    //       that.AddEmBlock(list); 
    //     // }
    //   }
    // }
  // },
  insertEatingMethod:function(addEatingMethod,dishesId){
    var that = this;
     // 转换格式
     let arr = []
     addEatingMethod.forEach((item, index) => {
        arr[index] = {}
        arr[index].em_name = item[0].em_name
        arr[index].all = item[0].all
        arr[index].eating_method = item
     })
     console.log(arr);
    var jsonStr = JSON.stringify(arr);
    wx.request({
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
      url: app.globalData.AddEmBlock_url,//新增菜的部位和做法的添加调这个接口
      // url:"http://192.168.8.3:8080/WX%20Restaurant/AddEmBlockXCX",
      dataType:"json",
      method:"POST",
      data:{
        emBlock:jsonStr,
        shop_id: that.data.shop_id,
        dishes_id: dishesId
      },
      // success: (res) => {
      //   if (res.data.result.result == 1) {
      //     for(var b of e)       
      //       var list = {
      //         id: res.data.object.id,
      //         method: b.method
      //       }
      //       list1.push(list)
      //       that.AddEatingMethod(list1,e[0].dishes_id)
      //   } else {
      //     wx.showToast({
      //       title: '信息不完整',
      //       icon: 'success',
      //       duration: 3000
      //     })
      //   }
      // }
    })
  },
  insertEatingMethod1:function(addEatingMethod,dishesId){
    var that = this
    var temp1 =[]
    if(addEatingMethod != null && addEatingMethod.length != 0){
      var list = [];//新增部位
      var hasEmBlock = false;//是否有相同名字的新增部位
      for (let i = 0; i < addEatingMethod.length; i++) {
        if(addEatingMethod[i].count != null && addEatingMethod[i].count != "" && !that.data.addDishName && addEatingMethod[i].count != -1){
          //部位没有新增
          var tempList = [];
          tempList.push(JSON.parse(JSON.stringify(addEatingMethod[i])));
          var temp = {
            id: addEatingMethod[i].count,
            method:tempList
          };
          temp1 .push(temp)
          if(i==addEatingMethod.length-1){
            var onlyEatmethod = 1
            that.AddEatingMethod(temp1,dishesId,onlyEatmethod);
          }
        }else{
          //有新增部位
          for (var y of list) {
            if (addEatingMethod[i].em_name == y.em_name) {
              y.method.push(addEatingMethod[i]);
              hasEmBlock = true;
            }
          }
          if(!hasEmBlock){
            addEatingMethod[i].dishes_id = dishesId;
            var tempList = [];
            tempList.push(JSON.parse(JSON.stringify(addEatingMethod[i])));
            addEatingMethod[i].method = tempList;
            list.push(addEatingMethod[i]);
          }
          hasEmBlock = false;
        }
      }
      if(list.length != 0){
        // for (var z of list){
          that.AddEatingMethod(list,dishesId,0); 
        // }
      }
    }
  },

  //重新赋值做法id，并返回isWhole
  insertBasicarry: function(dishesId){
    var that = this;
    var isWhole = false;
    var oldPracticeList = JSON.parse(JSON.stringify(that.data.practiceList));
    this.GetEatMethod(dishesId);
    var temp = []
    if(oldPracticeList.length != 0){
      for (var y = 0;y < oldPracticeList.length; y++){
        for (var x of oldPracticeList[y]) {
          if (x.checked) {
            x.dishes_id = dishesId;
            temp.push(x);
          }
        }
      }
    }
    if (temp.length != 0) {
      for (let i = 0; i < temp.length; i++) {
        if(temp[i].id == -1){
          for (let j = 0; j < that.data.practiceList.length; j++) {
            for(var x of that.data.practiceList[j]){
              if(temp[i].eating_method == x.eating_method && temp[i].em_name == x.em_name){
                temp[i].id = x.id;
                temp[i].count = x.count;
              }
            }
          }
        }
      }
      if (temp[0].em_name == "全部位") {
        that.data.en_id_obj = temp;
        isWhole = true;
      } else {
        that.data.em_id_obj = temp
      }
    }
    return isWhole;
  },

  //回显部位、做法
  echoEatMothod:function(event){
    var that = this;
    //2020-12-05
    var eatMethodArray = JSON.parse(JSON.stringify(that.data.eatMethodArray));
    var partsName = that.data.partsName;
    var em_arry = JSON.parse(JSON.stringify(that.data.practiceList));
    // var partIndex = -1;//2021-01-07 莫名其妙又不需要默认选中第一个
    var partIndex = 0;//2021-02-03 莫名其妙又需要默认选中第一个
    var eatMethodIndex = -1;

    if(event.detail == "0"){
      if(eatMethodArray != null && eatMethodArray.length != 0){
        //2020-11-24 选做法回显
        var n = true;
        for (var x = 0; x < em_arry.length; x++) {
          for (var z of eatMethodArray) {
            for (var y = 0; y < em_arry[x].length; y++) {
              // em_arry[x][y].checked = false;//全部为false
              //em_arry[x][y].number = '';
              if (em_arry[x][y].id == z.id) {
                if(em_arry[x][y].id != -1){
                  em_arry[x][y] = JSON.parse(JSON.stringify(z));
                }else{
                  //新增的部位或者做法
                  if(em_arry[x][y].eating_method == z.eating_method && em_arry[x][y].em_name == z.em_name){
                    em_arry[x][y] = JSON.parse(JSON.stringify(z));
                  }
                }
                if(n){
                  eatMethodIndex = y;
                  n = false;
                }
              }
            }
          }
        }
        //2020-11-24 选部位回显
        var i = true;
        for (var x = 0; x < partsName.length; x++) {
          partsName[x].checked = false
          for (var z of eatMethodArray) {
            if (z.em_name == partsName[x].em_name) {
              partsName[x].checked = true;
              if(i){
                partIndex = x;
                i = false;
              }
            }
          }
        }
      }
    }
    let min_wish_weight = Number(this.data.min_wish_weight)
    let max_wish_weight = Number(this.data.max_wish_weight)

    let inputAmount = min_wish_weight + ((max_wish_weight - min_wish_weight) / 2)
    this.setData({
      practiceList: em_arry,
      partsName: partsName,
      partIndex: partIndex,
      eatMethodIndex:eatMethodIndex,
      showMultipleEatMethodView: !this.data.showMultipleEatMethodView,
      inputAmount:inputAmount.toFixed(2)
    })
  },

  //操作完成返回上一页
  navigateBack:function(cartList,number,sum){
    var time1 = Date.now()
    //关闭当前页面，返回上一个页面
    let pages = getCurrentPages(); //获取上一个页面信息栈(a页面)
    let prevPage = pages[pages.length - 2]; //给上一页面的tel赋值
    app.globalData.cartList = cartList
    app.globalData.cupNumber = Number(app.globalData.cupNumber) + Number(number)
    app.globalData.sumMonney = Number(app.globalData.sumMonney) + Number(sum)
    if(this.data.dishes_inf.spec_type == 8) {
      prevPage.setData({
        "cartList": cartList,
        "processing":true,
        // "addtobuyarry":this.data.addtobuyarry,
        "locationindex":4,
        // "firstIssue":this.data.firstIssue,
        "firstIssue":1,
        "ordertype":1,
        "xuanhaole":true,
        "processing_orderid":this.data.order_id,
        "orderid":this.data.order_id
      })
    }else{
      prevPage.setData({
        "cartList": cartList,
        "processing":false,
        "processing_orderid":'',
      })
    }
    wx.navigateBack({
      success: function () {}
    }); //关闭当前页面，返回上一个页面
    var time2 = Date.now()
    console.log("navigateBack:"+(time2-time1))
//157ms
  },

  //创建订单--从orderdetail页面搬过来的
  writeOrder1: function (dishesInToCart,number,money) {
    var time1 = Date.now()
    var that = this
    //locationindex  写入数据库后的操作 1-复制订单，需要写入，2-更换桌号 ，3-加菜
    //order_type 订单类型：0-堂食、1-预定、2-外卖、3-外卖自提
    wx.showLoading({
      title: '加载中',
    })
      var arrivaltime = String(app.globalData.date) + ' ' + String(app.globalData.time) //差一个日期
      var nowtime = UtilJS.formatTime(new Date)
      var order_updata = {
        Order_type: 0, //订单类型：0-堂食、1-预定、2-外卖
        Shop_id: app.globalData.shopDetail.shop_id,
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
        firstIssue:1
      }

      // wx.request({ // 创建订单
      //   url: app.globalData.WriteOrder_url,
      //   //url:"http://localhost:8080/WX Restaurant/WriteOrder",
      //   data: order_updata,
      //   success: function (res) {
      //     if (res.data.result.result == '1') {
      //       //把缓存的暂时修改的餐桌编号清空
      //       app.globalData.temporaryTableId = ''
      //       that.setData({
      //         order_code: res.data.object[0].order_code,
      //         order_id: res.data.object[0].order_id,
      //         firstIssue:1,
      //       })

            
//res.data.object[0].order_id
            var orderdetail = that.createOrderDetail(dishesInToCart,0);

            that.navigateBack(that.data.cartList,number,money);

            // wx.request({
            //   // url: "http://192.168.1.2:8080/WX%20Restaurant/WriteOrderDetails",
            //   url: app.globalData.WriteOrderDetails_url,
            //   data: {
            //     OrderDetaileds: JSON.stringify(orderdetail)
            //   },
            //   method: "POST",
            //   header: {
            //     "Content-Type": "application/x-www-form-urlencoded"
            //   },
            //   success: function (res) {
            //     if (res.data.result.result == '1') {
            //       //app.resetOrderInf(1) //清空订单信息
            //       // app.recordConfirmationInf(0, "直接点餐", null, that.data.order_id, app.globalData.user_id) //记录直接点餐的确认信息
            //       // recordConfirmationInf: function (type, value, item, order_id, user_id) 
                  var object = {
                    "operator_type": 0,
                    "shop_id": app.globalData.shopDetail.shop_id,
                    "order_id": that.data.order_id,
                    "user_id": app.globalData.user_id,
                    "operator_id": app.globalData.staffDetail.id,
                    "operator_name": app.globalData.staffDetail.name,
                    "order_operator": "直接点餐",
                  }
                  wx.request({
                    header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
                    // url:"http://192.168.8.3:8080/WX%20Restaurant/ProcessWriteOrder",
                    url:app.globalData.ProcessWriteOrder_url,
                    method:"POST",
                    dataType:"json",
                    data:{
                      order_updata: JSON.stringify(order_updata),
                      OrderDetaileds: JSON.stringify(orderdetail),
                      object: JSON.stringify(object),
                    },success:res =>{
                      if(res.data.result.result=="1"){
                        that.setData({
                          order_code: res.data.object[0].order_code,
                          order_id: res.data.object[0].order_id,
                          firstIssue:1,
                        })
                        app.globalData.order_id = res.data.object[0].order_id
                        let pages = getCurrentPages(); //获取上一个页面信息栈(a页面)
                        let prevPage = pages[pages.length - 1]; //给上一页面的tel赋值
                        prevPage.setData({"orderid":res.data.object[0].order_id,xuanhaole:true})
                                             
                        var time2 = Date.now()
                        console.log("writeOrder:"+(time2-time1))
                        app.globalData.temporaryTableId = ''
                        WXAPI.updateOrderPayment({
                          order_id: res.data.object[0].order_id,
                          actual_total: money
                        })
                      }else{
                        console.log(res.data.result.cause)
                      }
                    }
                  })
                  
      //           } else {
      //           }
      //         },
      //         fail: function (res) {
      //         },
      //         complete() {
      //           wx.hideLoading()
      //         }
      //       // })
      //     } else {
      //       wx.hideLoading()
      //     }
      //   },
      //   fail: function (res) {
      //     wx.hideLoading()
      //   }
      // })
//26ms
  },
writeOrder: function (dishesInToCart,number,money) {
  var that = this
  //locationindex  写入数据库后的操作 1-复制订单，需要写入，2-更换桌号 ，3-加菜
  //order_type 订单类型：0-堂食、1-预定、2-外卖、3-外卖自提
  wx.showLoading({
    title: '加载中',
  })
    var arrivaltime = String(app.globalData.date) + ' ' + String(app.globalData.time) //差一个日期
    var nowtime = UtilJS.formatTime(new Date)
    var order_updata = {
      Order_type: 0, //订单类型：0-堂食、1-预定、2-外卖
      Shop_id: app.globalData.shopDetail.shop_id,
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
      firstIssue:1,
      order_equipment_type:1
    }

    wx.request({ // 创建订单
      url: app.globalData.WriteOrder_url,
      header: { 'content-type': 'application/x-www-form-urlencoded;charset=utf-8' },
      // url:"http://localhost:8090/WX Restaurant/WriteOrderNew",
      method:"POST",
      data: order_updata,
      success: function (res) {
        if (res.data.result.result == '1') {
          //把缓存的暂时修改的餐桌编号清空
          app.globalData.temporaryTableId = ''
          that.setData({
            order_code: res.data.object[0].order_code,
            order_id: res.data.object[0].order_id,
            firstIssue:1,
          })
          WXAPI.updateOrderPayment({
            order_id: res.data.object[0].order_id,
            actual_total: money
          }).then(function (data) {
            if (data.result == "success") {
            } else {
            }
          }).catch(res => {
          })

          var orderdetail = that.createOrderDetail(dishesInToCart,res.data.object[0].order_id);
          that.navigateBack(that.data.cartList,number,money);
          wx.request({
            // url: "http://192.168.8.3:8090/WX%20Restaurant/WriteOrderDetailsNew",
            url: app.globalData.WriteOrderDetails_url,
            data: {
              OrderDetaileds: JSON.stringify(orderdetail)
            },
            method: "POST",
            header: {
              "Content-Type": "application/x-www-form-urlencoded"
            },
            success: function (res) {
              if (res.data.result.result == '1') {
                //app.resetOrderInf(1) //清空订单信息
                app.recordConfirmationInf(0, "直接点餐", null, that.data.order_id, app.globalData.user_id) //记录直接点餐的确认信息
                // that.navigateBack(that.data.cartList,number,money);
              } else {
              }
            },
            fail: function (res) {
            },
            complete() {
              wx.hideLoading()
            }
          })
        } else {
          wx.hideLoading()
        }
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
},

  //更新订单--从orderdetail页面搬过来的
  updateOrder:function(dishesInToCart,number,money){
    var that = this;
    wx.showLoading({
      title: '加载中',
    })
    var orderdetail = that.createOrderDetail(dishesInToCart,that.data.order_id);

    that.navigateBack(that.data.cartList,number,money);

    wx.request({
      // url: "http://192.168.8.3:8090/WX%20Restaurant/WriteOrderDetailsNew",
      url: app.globalData.WriteOrderDetails_url,
      data: {
        OrderDetaileds: JSON.stringify(orderdetail)
      },
      method: "POST",
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      success: function (res) {
        if (res.data.result.result == '1') {
          wx.request({
            url: app.globalData.UpdateOrderInf_url,
            data: {
              Shop_id: app.globalData.shopDetail.shop_id,
              Order_id: that.data.order_id,
              // Total_amount: Number(app.globalData.sumMonney) + Number(money),
              // dishes_count: Number(app.globalData.cupNumber)+Number(number),
              Total_amount: app.globalData.sumMonney,
              dishes_count: app.globalData.cupNumber,
            },
            success: function (res) {
              if (res.data.result.result == 1) {
                let pages = getCurrentPages(); //获取上一个页面信息栈(a页面)
                let prevPage = pages[pages.length - 1]; //给上一页面的tel赋值
                prevPage.setData({xuanhaole:true})
                WXAPI.updateOrderPayment({
                  order_id: that.data.order_id,
                  // actual_total: Number(app.globalData.sumMonney) + Number(money)
                  actual_total: app.globalData.sumMonney
                }).then(function (data) {
                  if (data.result == "success") {
                    
                    wx.hideLoading()
                  } else {
                    console("更新订单出现异常")
                  }
                }).catch(res => {
                })
              } else {
              }
              // wx.hideLoading()
            },
            fail: function (res) {
              wx.hideLoading()
            }
          })
        } else {
        }
      },
      fail: function (res) {
      },
      // complete() {
      //   wx.hideLoading()
      // }
    })
  },

  SelectPrinter:function(shop_id){
    //查询当前商家打印机信息
    var that = this
    wx.request({
      url: app.globalData.SelectPrinter_url,
      data: {
        shop_id: shop_id
      },
      success: function (res) {
        let printShowArray = []
        let printArray = res.data.object
        for(let i = 0;i<printArray.length;i++){
          if(printArray[i].status == 1){
            let list = {
              'name' : printArray[i].name,
              'num'  : that.addzero2(printArray[i].printer_num),
              'check':false,
              'id'   : printArray[i].printer_id,
              'connect_status':printArray[i].connect_status,
              'paper_state':printArray[i].paper_state,//纸是否没了,0缺纸，1有纸
            }
            printShowArray.push(list)
          }
        }
        that.setData({
          printArray:printArray,
          printShowArray:printShowArray
        })
      }
    })
  },

  // 位数补零
  addzero2:function(num){
    if(Number(num)>10){
      return '0'+ num
    }else{
      return '00'+ num
    }
  },

  //整合订单详情中的菜品信息 
  createOrderDetail:function(dishesInToCart,orderId){
    var orderdetail = [];
    var that = this;
    var cartList = this.data.cartList
    var number = 1
    if (!dishesInToCart.isWhole) {
      var eatMethodArray1 = dishesInToCart.em_index
      if (eatMethodArray1) {
        if (eatMethodArray1.length != 0) {
          var em_num = 0;
          for (var x of eatMethodArray1) {
            var sideDisht1 = '';
            var sideDishtStr = [];
            if (x.SideDishList != null && x.SideDishList != '') { // 记录配菜asdasd
              for (var k = 0; k < x.SideDishList.length; k++) {
                if (x.SideDishList[k].checked) {
                  sideDisht1 = sideDisht1 + x.SideDishList[k].ID + '-' + x.SideDishList[k].orderDetailedNum + ','
                }
              }
            }
            if(x.SideDishList_choose != null && x.SideDishList_choose != ''){
              for (let k = 0; k < x.SideDishList_choose.length; k++) {
                var str = x.SideDishList_choose[k].sideDishName+'*'+x.SideDishList_choose[k].orderDetailedNum;
                sideDishtStr.push(str);
              }
            }
            em_num ++;
            var eatMethodArray_temp = []
            eatMethodArray_temp.push({
              "all": x.all,
              "count": x.count,
              "dishes_id": x.dishes_id,
              "eating_method": x.eating_method,
              "em_name": x.em_name,
              "id": x.id,
              "money": x.money,
              "price":x.price,
              "number":x.number,
              "remarks": x.remarks,
              "no_sideDish_money":x.no_sideDish_money,
              "SideDishList":x.SideDishList,
              "SideDishList_choose":x.SideDishList_choose,
              "tastes": x.tastes,
              "sideDishtStr":sideDishtStr.join(),
              "em_num":em_num+"/"+eatMethodArray1.length,
            })
            let dishePrice = 0;
            if(dishesInToCart.dishes_price){
              dishePrice = Number(dishesInToCart.dishes_price);
            }

            var addItem = {
              "item_price": dishePrice != 0? dishePrice : x.price,
              // "dishes_price": x.price + dishePrice * x.number,
              "dishes_price": dishePrice != 0? dishePrice : x.price,
              "item_subtotal": x.money + dishePrice * x.number,
              "measurement_value": x.number,
              "item_number": dishesInToCart.measurement_value + "," + dishesInToCart.measurement_value,
              "remarks": x.remarks,
              "em_id": JSON.stringify(eatMethodArray_temp),
              "disher_weight_ceiling": x.number,
              "sideDisht": sideDisht1,
              "tastes": x.tastes,
              "sum": x.money + dishePrice * x.number,
              "weighingByLocation": dishesInToCart.weighingByLocation,
              "weighing": dishesInToCart.weighing,
              "dishes_spec_type": that.data.dishes_inf.spec_type,
              "en_index": eatMethodArray_temp,
              "en_basicarry": eatMethodArray_temp,
              "em_index": [],
              "em_basicarry": [],
              "em_count":number+'/'+eatMethodArray1.length
            }
            number++
            var item =that.createDetailItem(addItem,dishesInToCart,orderId);
            cartList.push(item)
            // orderdetail.push(item)
          }
        }
      }
    }
    //这里是全部位 //现在分部位和全部位用同一种数据格式 //上面分部位的代码前端显示用
    var em_id;
    var em_result = dishesInToCart.em_basicarry.every(function (item, index, array) {
      return item != -1
    })
    var en_result = dishesInToCart.en_basicarry.every(function (item, index, array) {
      return item != -1
    })
    var dishesPrice = dishesInToCart.dishes_price;
    if (en_result && dishesInToCart.en_basicarry != 0) {
      em_id = dishesInToCart.en_basicarry;
    } else if (em_result && dishesInToCart.em_basicarry != 0) {
      em_id = dishesInToCart.em_basicarry;
    } else {
      em_id = dishesInToCart.en_basicarry;
    }
    if(em_id != null){
      let em_count = 0;
      for (let j = 0; j < em_id.length; j++) {
        em_count++;
        em_id[j].em_count = em_count+"/"+em_id.length;
        var sideDishtStr = [];
        if(em_id[j].SideDishList_choose != null && em_id[j].SideDishList_choose != "" && em_id[j].SideDishList_choose.length != 0){
          for (let k = 0; k < em_id[j].SideDishList_choose.length; k++) {
            var str = em_id[j].SideDishList_choose[k].sideDishName+'*'+em_id[j].SideDishList_choose[k].orderDetailedNum;
            sideDishtStr.push(str);
          }
        }
        em_id[j].sideDishtStr = sideDishtStr.join();
      }
    }
    if(dishesPrice == null || dishesPrice == 0){
      dishesPrice = em_id[0].price
    }
    var addItem = {
      "item_price": dishesPrice,
      // "dishes_price": dishesPrice * dishesInToCart.measurement_value,
      "dishes_price":dishesPrice,
      "item_subtotal": dishesInToCart.sum,
      "measurement_value": dishesInToCart.measurement_value,
      "item_number": dishesInToCart.disher_weight + "," + dishesInToCart.disher_weight_ceiling,
      "remarks": dishesInToCart.remark,
      "em_id": JSON.stringify(em_id),
      "disher_weight_ceiling": dishesInToCart.disher_weight_ceiling,
      "sideDisht": dishesInToCart.sideDisht,
      "tastes": dishesInToCart.tastes,
      "sum": dishesInToCart.sum,
      "weighingByLocation": dishesInToCart.weighingByLocation,
      "weighing": dishesInToCart.weighing,
      "dishes_spec_type": that.data.dishes_inf.spec_type,
      "en_index": em_id,
      "en_basicarry": em_id,
      "em_index": [],
      "em_basicarry": [],
      "em_count":""
    }
    var item =that.createDetailItem(addItem,dishesInToCart,orderId);
    orderdetail.push(item)
    if(dishesInToCart.isWhole){
      cartList.push(item)
    }
    this.setData({cartList:cartList})
    return orderdetail;
  },

  //整合订单详情中的菜品信息  orderId
  createDetailItem:function(addTemp,cartListItem,orderId){
    var that = this;
    var nowtime = UtilJS.formatTime(new Date);
    var item = {
      "user_id": app.globalData.user_id,
      "dishes_id": cartListItem.dishes_id,
      "dishes_status": 5,
      "item_type": cartListItem.item_type,
      "order_id": orderId,
      "spec_id": cartListItem.weighing,
      "praise_flag": 0,
      "userchecked": 0,
      "operatorchecked":2,
      "dishes_img": cartListItem.img_url,
      "dishes_name": cartListItem.name,
      "dishes_metering_type": that.data.inputUnit,
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
      "firstIssue": that.data.firstIssue == 'undefined' ? 1: that.data.firstIssue,
      "detailed_choose_printer":that.data.code,
      "img_url": cartListItem.img_url,
      "name": cartListItem.name,
      "spec_type": cartListItem.spec_type,
      "hadOrdered" :true,
      "number":1,
      "weighingByLocation":cartListItem.weighingByLocation,
      "shop_id":app.globalData.shopDetail.shop_id
    }
    item = Object.assign(item,addTemp);
    return item;
  },
  chooseOnePrint:function(e){
    // 选择单个打印机
    var that = this;
    var printShowArray = that.data.printShowArray
    let id = e.currentTarget.dataset.item.id
    let printIndex = -1
    //打印机只能选一个
    for (let i = 0, len = printShowArray.length; i < len; ++i) {
      printShowArray[i].check = printShowArray[i].id === id
      if(printShowArray[i].id === id){
        printIndex =i
      }
    }
    that.setData({
      printShowArray:printShowArray,
      printIndex:printIndex
    })
  },
  // 标单、补单、分席、叫起、即上、赠送、打包、转单、寄存
  noycts: function (e) {
    var that = this;
    var bidDetailitem = that.data.bidDetailitem;
    var listData = that.data.listData
    listData = that.pageageCheckListData(listData,bidDetailitem);
    that.setData({
      showModalQR: !that.data.showModalQR,
      listData: listData
    })
  },
  //2021-01-21 从订单详情页面搬运过来的
  pageageCheckListData:function(listData,item){
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
          if (item.waitOrder == 3) {
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

  buxiCheckBoxChange: function (e) {
    var that = this
    var listData = that.data.listData
    var idx = e.currentTarget.dataset.idx
    console.log("选中:" + e.currentTarget.dataset.item.value + "，为" + !listData[idx].checked)

    if (e.currentTarget.dataset.item.value == "赠送" ) {
      if(!listData[idx].checked){
        that.setData({
          showPresentation: true,
        });
        for (var x = 0; x < listData.length; x++) {
          if (listData[x].value == "标单") {
            listData[x].checked = listData[idx].checked
          }
        }
      }
    } else if (e.currentTarget.dataset.item.value == "叫起") {
      if(!listData[idx].checked){
        for (var x = 0; x < listData.length; x++) {
          if (listData[x].value == "即上") {
            listData[x].checked = listData[idx].checked
          }
          if (listData[x].value == "加急") {
            listData[x].checked = listData[idx].checked
          }
          if (listData[x].value == "催单") {
            listData[x].checked = listData[idx].checked
          }
        }
      }else{
        for (var x = 0; x < listData.length; x++) {
          if (listData[x].value == "即上") {
            listData[x].checked = listData[idx].checked
          }
        }
      }
      listData[idx].checked = !listData[idx].checked
    } else if (e.currentTarget.dataset.item.value == "即上") {
      if(!listData[idx].checked){
        for (var x = 0; x < listData.length; x++) {
          if (listData[x].value == "叫起") {
            listData[x].checked = listData[idx].checked
          }
          if (listData[x].value == "加急") {
            listData[x].checked = listData[idx].checked
          }
          if (listData[x].value == "催单") {
            listData[x].checked = listData[idx].checked
          }
        }
      }else{
        for (var x = 0; x < listData.length; x++) {
          if (listData[x].value == "叫起") {
            listData[x].checked = listData[idx].checked
          }
        }
      }
      listData[idx].checked = !listData[idx].checked
    }else if (e.currentTarget.dataset.item.value == "加急") {
      if(!listData[idx].checked){
        for (var x = 0; x < listData.length; x++) {
          if (listData[x].value == "叫起") {
            listData[x].checked = listData[idx].checked
          }
          if (listData[x].value == "即上") {
            listData[x].checked = listData[idx].checked
          }
          if (listData[x].value == "催单") {
            listData[x].checked = listData[idx].checked
          }
        }
      }else{
        for (var x = 0; x < listData.length; x++) {
          if (listData[x].value == "即上") {
            listData[x].checked = listData[idx].checked
          }
        }
      }
      listData[idx].checked = !listData[idx].checked
    }else if (e.currentTarget.dataset.item.value == "催单") {
      if(!listData[idx].checked){
        for (var x = 0; x < listData.length; x++) {
          if (listData[x].value == "叫起") {
            listData[x].checked = listData[idx].checked
          }
          if (listData[x].value == "即上") {
            listData[x].checked = listData[idx].checked
          }
          if (listData[x].value == "加急") {
            listData[x].checked = listData[idx].checked
          }
        }
      }
      listData[idx].checked = !listData[idx].checked;
    } else if (e.currentTarget.dataset.item.value == "分席") {
      for (var x = 0; x < listData.length; x++) {
        if (listData[x].value == "不分席") {
          listData[x].checked = listData[idx].checked
        }
      }
      listData[idx].checked = !listData[idx].checked;
    } else if (e.currentTarget.dataset.item.value == "不分席") {
      for (var x = 0; x < listData.length; x++) {
        if (listData[x].value == "分席") {
          listData[x].checked = listData[idx].checked
        }
      }
      listData[idx].checked = !listData[idx].checked;
    }else if (e.currentTarget.dataset.item.value == "标单") {
      if(!listData[idx].checked){
        for (var x = 0; x < listData.length; x++) {
          if (listData[x].value == "赠送") {
            listData[x].checked = listData[idx].checked
          }
        }
      }
      listData[idx].checked = !listData[idx].checked;
    }else{
      listData[idx].checked = !listData[idx].checked
    }

    that.setData({
      listData: listData
    })
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
    console.log("记录赠送理由")
    var that = this
    that.timed_refresh(1)
    that.setData({
      freeDishRemark: e.detail.value
    })
  },
  // 赠送弹框 的确认按钮
  freeDishConfirm: function (e) {
    var that = this
    console.log('赠送菜品')
    if (that.data.presentation == '其他原因' && that.data.freeDishRemark == '') {
      wx.showToast({
        title: '其他理由不能为空',
        icon: 'none',
        duration: 2000,
      })
    } else {
      console.log('确认赠送赠送')
      that.data.item_type = 5;//点餐类别：加餐id、点餐-0、退餐--1 赠送-5
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
    }
  },
  // 赠送菜品框内的下拉
  bindShowMsg_free:function() {
    this.setData({
      select_free: !this.data.select_free
    })
  },

  //标单、补单、分席
  // freeOrder   标单：0-不是标单；1-是标单
  // repairOrder  补单：0-不是补单；1-是补单
  // copyOrder  分席单：0-不是分席单；1-是分席单；
  buxiBindsubmit_order: function (e) {
    var that = this
    console.log("选择订单属性")
    if (e.detail.value.checkbox_value.length >= 0) {
        if (e.detail.value.checkbox_value.indexOf("标单") != -1) {
          that.data.bidDetailitem.freeOrder = 1
        } else {
          that.data.bidDetailitem.freeOrder = 0
        }
        if (e.detail.value.checkbox_value.indexOf("补单") != -1) {
          that.data.bidDetailitem.repairOrder = 1
        } else {
          that.data.bidDetailitem.repairOrder = 0
        }
        if (e.detail.value.checkbox_value.indexOf("分席") != -1 && e.detail.value.checkbox_value.indexOf("不分席") == -1) {
          if (e.detail.value.splitInput != '') {
            that.data.bidDetailitem.copyOrder = e.detail.value.splitInput;
            that.setData({
              "bidDetailitem.copyOrder":e.detail.value.splitInput
            })
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
          that.data.bidDetailitem.copyOrder = 1
        }
        if(e.detail.value.checkbox_value.indexOf("不分席") != -1){
          that.data.bidDetailitem.bufenxi = 1
        }

        if (e.detail.value.checkbox_value.indexOf("赠送") != -1) {
          that.data.bidDetailitem.Item_type = 5
        } else {
          that.data.bidDetailitem.Item_type = 0
        }

        if (e.detail.value.checkbox_value.indexOf("叫起") != -1) {
          that.data.bidDetailitem.waitOrder = 1
        }

        if (e.detail.value.checkbox_value.indexOf("即上") != -1) {
          that.data.bidDetailitem.waitOrder = 0
        }

        if (e.detail.value.checkbox_value.indexOf("加急") != -1) {
          that.data.bidDetailitem.waitOrder = 2
        }

        if (e.detail.value.checkbox_value.indexOf("打包") != -1) {
          that.data.bidDetailitem.baleOrder = 1
        } else {
          that.data.bidDetailitem.baleOrder = 0
        }
    } else {
        that.data.bidDetailitem.freeOrder = 0
        that.data.bidDetailitem.repairOrder = 0
        that.data.bidDetailitem.copyOrder = 1
        that.data.bidDetailitem.waitOrder = 0
        that.data.bidDetailitem.baleOrder = 0
        that.data.bidDetailitem.transferOrder = 0;
        that.data.bidDetailitem.depositOrder = 0;
    }
    that.setData({
      showModalQR: false
    })
  },
})