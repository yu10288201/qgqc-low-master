// components/myOrderList/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    xdswidth: {
      type: Boolean
    },
    goodModel: {
      type:Object,
      value:''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {},

  attached: function () {

  },
  ready: function () {

    // if(this.properties.goodModel!= null) {
    //   var dishes_img = this.properties.goodModel.dishes_img;
    //   dishes_img = dishes_img.replace('\n\r','');
    //   this.properties.goodModel.dishes_img = dishes_img;
    //   this.setData({
    //     goodModel:this.properties.goodModel
    //   })
    // }

  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 关闭整个弹窗
    closeClick: function (event) {
      this.triggerEvent('closePopupView', {}, {})
    },
    keyinput: function (event) {
      var num = event.detail.value
      this.properties.goodModel.poridgeNum = num != '' ? parseInt(num) : 0;
      this.properties.goodModel.poridgeAllPrice = (this.properties.goodModel.poridgeNum * this.properties.goodModel.dishes_price).toFixed(2)
      this.setData({
        goodModel: this.properties.goodModel
      })
      this.triggerEvent('currentBackGoodModel', {
        currentBackGoodModel: this.properties.goodModel
      }, {})
    }
  },

})