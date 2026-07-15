// components/popup_taste/popup_taste.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    tasteList: {
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
    tastes: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    i_close_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/i_close.png'
  },

  created() {
    // console.log(this.properties)
  },
  /**
   * @deprecated 旧式的定义方式，基础库 `2.2.3` 起请在 lifetimes 中定义
   *
   * 在组件实例进入页面节点树时执行
   *
   * 最低基础库版本：[`1.6.3`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  attached() {

    // console.log(this.properties)
  },
  /**
   * @deprecated 旧式的定义方式，基础库 `2.2.3` 起请在 lifetimes 中定义
   *
   * 在组件在视图层布局完成后执行
   *
   * 最低基础库版本：[`1.6.3`](https://developers.weixin.qq.com/miniprogram/dev/framework/compatibility.html)
   */
  ready() {
    // console.log(this.properties)
  },
  pageLifetimes: {
    show: function () {

    },

    hide: function () {
      // 页面被隐藏
    },

    resize: function (size) {
      // 页面尺寸变化
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {

    chooseTaste(e) {
      var tasteList = this.properties.tasteList
      tasteList[e.currentTarget.dataset.index].checked = !tasteList[e.currentTarget.dataset.index].checked
      this.setData({
        tasteList: tasteList
      })
    },

    submitTaste() {
        var taste = []
        var tastes = ""
        for (var x of this.properties.tasteList) {
          if (x.checked) {
            taste.push(x.value)
          }
        }
        tastes = taste.join(',')
        this.triggerEvent("submitTaste", tastes)
    },

    closeTaste(e){
      this.triggerEvent("closeTaste",null)
    }
  },

})