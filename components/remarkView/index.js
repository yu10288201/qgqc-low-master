// components/remarkView/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
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
    like:{
      type: Boolean,
    },
    isIntroduction:{
      type: Boolean,
      value:false
    },
    remarkType:{  // 快捷备注的备注类型： 0-订单 1-菜品
      type: Boolean,
      value:false
    },
    onHide:{
      type: Boolean,
      value:false
    },
    tastesRemark:{
      type: String,
      value:''
    },
    readOnly:{
      type:Boolean
    },
    placeholderStr:String,
    remarkTitle:{
      type:String,
      value:"请输入备注。"
    },
    remarkValue:{
      type: String,
      value:''
    },
    spec_type:{
      type:Number
    }

  },

  /**
   * 组件的初始数据
   */
  data: {
    menu_img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/index/menu.png',
  },

  /**
   * 组件的方法列表
   */
  methods: {
    remarks: function (e) {
      this.triggerEvent('remarkBack', {
        remarkText: e.detail.value
      }, {})
    },
    
    showRemarkList: function (e) {
      this.triggerEvent('showRemarkList',{
        a:1
      })
    },

    init:function(remarksStr){
      this.setData({
        remarkValue : remarksStr
      })
    }
  }
})