// components/sideDishesView/sideDishesView.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    SideDishList: Object,
    SideDishList_choose: Object,
    isTable: Boolean,
    eatMethodChooseIndex:Number,
    eatMethodArray:Object,
    dishesInfo: {
      type: Object,
      value: {
        "big_dishes_img": "",
        "canuse_xd": "",
        "city_id": "",
        "class_i_id": "",
        "commercial_area_id": "",
        "county_id": "",
        "create_date": {
          "date": "",
          "day": "",
          "hours": "",
          "minutes": "",
          "month": "",
          "seconds": "",
          "time": "",
          "timezoneOffset": "",
          "year": ""
        },
        "day_sales": "",
        "defaultEquip": "",
        "defaultTea": "",
        "dishesNum": "",
        "dishes_controller": "",
        "dishes_discount": "",
        "dishes_id": "",
        "dishes_img": "",
        "dishes_introduce": "",
        "dishes_metering_type": "",
        "dishes_name": "菜品名称",
        "dishes_price": "",
        "dishes_pricing": "",
        "dishes_recommend": "",
        "dishes_recommendSequence": "",
        "dishes_specialty": "",
        "dishes_specialtySequence": "",
        "dishes_specialty_price": "",
        "dishes_statu": "",
        "extraValueMeal": "",
        "extraValueMealSequence": "",
        "finished_product": "",
        "jointSetValuation": "",
        "jointsetNumForNum": "",
        "jointsetNumForOne": "",
        "monthly_sales_volume": "",
        "nature": "",
        "newDishes": "",
        "newDishesSequence": "",
        "parent_type_id": "",
        "place_of_origin": "",
        "position": "",
        "praise_points": "",
        "preferential": "",
        "present": "",
        "printer_id": "",
        "productionDepartmentId": "",
        "querendengji": "",
        "recommendRoyalty": "",
        "reduce_flag": "",
        "residual_alarm": "",
        "residual_remind": "",
        "royaltyMoney": "",
        "sales_category": "",
        "sellingTime": "",
        "sellingTimeEnd": "",
        "sellingTimeStrat": "",
        "shop_id": "",
        "sideDishes": "",
        "spec_type": "",
        "specal_type": "",
        "stock": "",
        "subclass_type_id": "",
        "takeOut": "",
        "takeOutSequence": "",
        "takeOutStyle": "",
        "total": "",
        "voucher": "",
        "voucherSequence": "",
        "weighing": "",
        "weighing_error": "",
        "xd": "",
        "xdSequence": "",
        "xiugaidengji": ""
      }
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    i_close_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/i_close.png',
    orderDetailedNum: 0,
    sideDishdPrice: 0,
    sideDishIndex: -1,
    SideDishList:[]
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
      console.log("sideDishesView attached");
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.log("sideDishesView detached");

    },
  },

  /**
   * 组件的方法列表
   */
  methods: {

    //2020-11-17
    init: function () {
      console.log("init");
      var that = this;
      const items = this.data.SideDishList
      const values = this.data.SideDishList_choose
      let orderDetailedNum = 0;
      let sideDishIndex = -1;
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].checked = false
        items[i].orderDetailedNum = 0
        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (parseInt(items[i].ID) == values[j].ID) {
            items[i].checked = true;
            items[i].orderDetailedNum = values[j].orderDetailedNum;
            if(orderDetailedNum == 0 && sideDishIndex == -1){
              orderDetailedNum = values[j].orderDetailedNum;
              sideDishIndex = i;
            }
          }
        }
      }
      that.setData({
        SideDishList: items,
        orderDetailedNum:orderDetailedNum,
        sideDishIndex:sideDishIndex
      })
      console.log(items);
      console.log(this.data.sideDishIndex)
      that.returnSideDish()
    },

    checkboxChange: function (e) {
      var that = this;
      const items = this.properties.SideDishList
      const values = e.detail.value
      for (let i = 0, lenI = items.length; i < lenI; ++i) {
        items[i].checked = false
        for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
          if (parseInt(items[i].ID) == values[j]) {
            items[i].checked = true
          }
        }
      }
      that.setData({
        SideDishList: items
      })
      that.returnSideDish()
    },

    // 配菜框的选择
    changeBoxNum: function (e) {
      let index = e.currentTarget.dataset.index
      let SideDishList = this.properties.SideDishList
      let SideDishList_choose = this.properties.SideDishList_choose
      SideDishList_choose[index].orderDetailedNum = e.detail.value
      SideDishList_choose[index].orderDetailedSum = Number((Number(e.detail.value) * Number(SideDishList_choose[index].sideDishdPrice) / 100).toFixed(2))
      for(var x = 0; x<SideDishList.length;x++){
        if(SideDishList_choose[index].ID == SideDishList[x].ID){
          SideDishList[x] = SideDishList_choose[index]
        }
      }
      this.triggerEvent("changeBoxNum",{
        "SideDishList_choose":SideDishList_choose,
        "SideDishList":SideDishList
      })
    },

    chooseSideDish(e) {
      console.log(this.properties.SideDishList);
      console.log(this.data.SideDishList);
      var SideDishList = this.properties.SideDishList
      var sideDishIndex = e.currentTarget.dataset.index
      for(var x = 0;x<SideDishList.length;x++){
        if(SideDishList[x].orderDetailedNum <= 0 && x != sideDishIndex){
          SideDishList[x].checked = false
        }else{
          //2020-11-18 选择配菜，如果原来未选择，则加一份（多拼粥）
          if(!SideDishList[x].checked){
            SideDishList[x].checked = true
            if(x == sideDishIndex){
              console.log(SideDishList[sideDishIndex].sideDishName+"执行加一份操作。")
              SideDishList[sideDishIndex].orderDetailedNum++
              SideDishList[sideDishIndex].orderDetailedSum = SideDishList[sideDishIndex].orderDetailedNum * 0.01 * SideDishList[sideDishIndex].sideDishdPrice
              SideDishList[sideDishIndex].orderDetailedSum = Number(SideDishList[sideDishIndex].orderDetailedSum.toFixed(2))
            }
          }
        }
      }
      this.setData({
        SideDishList: SideDishList,
        sideDishIndex: sideDishIndex,
        sideDishdPrice: SideDishList[sideDishIndex].sideDishdPrice * 0.01,
        orderDetailedNum: SideDishList[sideDishIndex].orderDetailedNum
      })
    },

    returnSideDish(e) {
      console.log("转发")
      this.triggerEvent("returnSideDish", this.properties.SideDishList)
    },

    addOReduce: function (e) {
      if (this.data.sideDishIndex != -1) {
        var SideDishList = this.data.SideDishList
        if (e.currentTarget.dataset.type == "1") {
          console.log("加一份")
          SideDishList[this.data.sideDishIndex].orderDetailedNum++
          SideDishList[this.data.sideDishIndex].orderDetailedSum = SideDishList[this.data.sideDishIndex].orderDetailedNum * 0.01 * SideDishList[this.data.sideDishIndex].sideDishdPrice
          SideDishList[this.data.sideDishIndex].orderDetailedSum = Number(SideDishList[this.data.sideDishIndex].orderDetailedSum.toFixed(2))
        } else if (e.currentTarget.dataset.type == "0") {
          if(SideDishList[this.data.sideDishIndex].orderDetailedNum>0){
            console.log("减一份")
            SideDishList[this.data.sideDishIndex].orderDetailedNum--
            SideDishList[this.data.sideDishIndex].orderDetailedSum = SideDishList[this.data.sideDishIndex].orderDetailedNum * 0.01 * SideDishList[this.data.sideDishIndex].sideDishdPrice
            SideDishList[this.data.sideDishIndex].orderDetailedSum = Number(SideDishList[this.data.sideDishIndex].orderDetailedSum.toFixed(2))
          }else{
            console.log("不能减为0")
          }
        }
        this.setData({
          orderDetailedNum: SideDishList[this.data.sideDishIndex].orderDetailedNum,
          SideDishList: SideDishList
        })
      }
    },

    //2020-11-18 取消选择(多拼粥)
    cancelSideDish:function(){
      if (this.data.sideDishIndex != -1) {
        console.log("取消选择");
        var SideDishList = this.data.SideDishList;
        SideDishList[this.data.sideDishIndex].orderDetailedNum = 0;
        SideDishList[this.data.sideDishIndex].checked = false;
        /**
         * 抄减法的方法，不知道有什么用
         SideDishList[this.data.sideDishIndex].orderDetailedSum = SideDishList[this.data.sideDishIndex].orderDetailedNum * 0.01 * SideDishList[this.data.sideDishIndex].sideDishdPrice
         SideDishList[this.data.sideDishIndex].orderDetailedSum = Number(SideDishList[this.data.sideDishIndex].orderDetailedSum.toFixed(2))
         */
        this.setData({
          orderDetailedNum: SideDishList[this.data.sideDishIndex].orderDetailedNum,
          SideDishList: SideDishList,
          sideDishIndex:-1
        })
      }
    },

    submitSideDish(e){
      // 回调
      console.log("确认回调")
      var SideDishList = []
      for(var x of this.data.SideDishList){
        if(x.checked && Number(x.orderDetailedNum)>0){
          SideDishList.push(x)
        }
      }

      this.triggerEvent("submitSideDish",{
        "SideDishList_choose":SideDishList,
        "SideDishList":this.data.SideDishList
      })
    },

    showpeicai(e){
      this.triggerEvent("showpeicai",null)
    }
  },


})