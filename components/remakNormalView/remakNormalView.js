// components/remakNormalView/remakNormalView.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    quickRemarkList: {
      type: Array,
      value: []
    },
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
    i_close_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/i_close.png'
  },

  /**
   * 组件的方法列表
   */
  methods: {
    chooseRemark: function (e) {
      var quickRemarkList = this.properties.quickRemarkList
      quickRemarkList[e.currentTarget.dataset.index].checked = !quickRemarkList[e.currentTarget.dataset.index].checked
      console.log(111)
      console.log(quickRemarkList)
      this.setData({
        quickRemarkList: quickRemarkList
      })
      app.globalData.remark_normal = quickRemarkList
    },
    quickRemarkConfirm(e) {
      var remark = []
      var remarks = ""
      for (var x of this.properties.quickRemarkList) {
        if (x.checked) {
          remark.push(x.value)
        }
      }
      remarks = remark.join("、")
      this.triggerEvent("quickRemarkConfirm", remarks)
    },

    hideModal(e){
      this.triggerEvent("hideModal",null)
    }
  }
})