// components/selectMaterial/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    porridgeObject: Object,
    porridgeObjectList: {
      type: Object,
      value: true
    },
    spec_type1:{
      type:Number,
      value:''
    },
    goodModel: Object,
    isTable: {
      type: Boolean,
      value: true
    },
    dishes:Object,
  },

  /**
   * 组件的初始数据
   */
  data: {
    spec_type1:'',
    currentPriceArray: [],
    currentSelName: [],
    // checked: true,
    i_close_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/i_close.png',
    showNu:false,
    num:1
  },
  //onShow
  
  lifetimes: {
    show:function(){
      this.setData({
        spec_type1 : this.properties.spec_type1
      })
    },
    attached: function() {
      // 在组件实例进入页面节点树时执行
      console.log('shabi')
      this.setData({
        spec_type1 : this.properties.spec_type1
      })
      //console.log(spec_type1)
    },
  },
  attached:function() {
  },
  ready(event) {
    // console.log('---------'+this.properties.propertiesObject)
    // this.setData({
    //   porridgeObject: this.properties.porridgeObject
    // })
  },
  /**
   * 组件的方法列表
   */
  methods: {
    chooseMaterial(e) {
      this.data.currentPriceArray = [];
      this.data.currentSelName = [];
      var porridgeObject = this.properties.porridgeObject
      var currentSelNum = 0
      // 取出当前点击位置
      const index = e.currentTarget.dataset.index;
      // //1、取出多拼粥的数量
      // console.log("当前几拼：" + this.properties.porridgeObject.currentNum + "拼")
      //2、判断当前已选择的数量
      // for (let i = 0; i < this.properties.porridgeObject.list.length; i++) {
      //   var porridgeGood = this.properties.porridgeObject.list[i]
      //   if (porridgeGood.selectStatus) {
      //     // 拼接已选中的内容，统计选中的价格
      //     if (index == i) {
      //       currentSelNum--;
      //     } else {
      //       currentSelNum++
      //     }
      //   }
      // }
      var jointSetUnit
      for (var x of porridgeObject.list) {
        if (x.selectStatus) {
          currentSelNum++
        }
      }
      console.log(this.properties.porridgeObject.currentNum+"拼粥：已选择" + currentSelNum + "拼")
      //3、进行比较，修改当前选择的状态
      // if (this.properties.porridgeObject.currentNum > currentSelNum) {
      //   this.properties.porridgeObject.list[index].selectStatus = !this.properties.porridgeObject.list[index].selectStatus;
      // } else {
      //   this.triggerEvent('selPorridgeBackObject', {
      //     result: -1
      //   }, {})
      //   return
      // }
      // ------------------------------

      if (!porridgeObject.list[e.currentTarget.dataset.index].selectStatus) {
        if (currentSelNum < Number(this.properties.porridgeObject.currentNum)) {
          porridgeObject.list[e.currentTarget.dataset.index].selectStatus = !porridgeObject.list[e.currentTarget.dataset.index].selectStatus
          jointSetUnit = porridgeObject.list[e.currentTarget.dataset.index].jointSetUnit
          this.setData({
            jointSetUnit:jointSetUnit,
            porridgeObject: porridgeObject,
            showNu:true,
            foodIndx:e.currentTarget.dataset.index,
            num:1
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '只能'+this.properties.porridgeObject.currentNum+'拼,不能再拼!',
            duration: 2000
          })
          // wx.showModal({
          //   content: '只能'+this.properties.porridgeObject.currentNum+'拼,不能再拼!',
          //   showCancel: false
          // })
          this.triggerEvent('selPorridgeBackObject', {
            result: -1
          }, {})
          return
        }
      } else {
        porridgeObject.list[e.currentTarget.dataset.index].selectStatus = !porridgeObject.list[e.currentTarget.dataset.index].selectStatus
        this.setData({
          porridgeObject: porridgeObject
        })
      }

      // 再次计算选中状态下的价格和字符串
      for (let i = 0; i < this.properties.porridgeObject.list.length; i++) {
        var porridgeGood = this.properties.porridgeObject.list[i]
        if (porridgeGood.selectStatus) {
          this.data.currentPriceArray.push(parseFloat(porridgeGood.jointSetDealPrice))
          this.data.currentSelName.push(porridgeGood.jointSetName)
        }
      }

      this.properties.porridgeObject.selName = this.data.currentSelName.join("+");
      // 求数组元素总和
      // var sum = this.data.currentPriceArray.reduce(function (a, b) {
      //   return a + b;
      // }, 0);
      // this.properties.porridgeObject.selAllPrice = sum
      //4、setData重新渲染
      this.setData({
        porridgeObject: this.properties.porridgeObject
      })
      //5、回传修改数值
      // this.triggerEvent('selPorridgeBackObject', {
      //   porridgeBackObject: this.properties.porridgeObject,
      //   result: 1
      // }, {})
      // -------------------------------------------------------------------
    },

    submitMaterial: function (event) {
      var porridgeObjectList = []
      var porridgeObject = this.data.porridgeObject
      var pri = "" 
      for (var x of this.properties.porridgeObject.list) {
        if (x.selectStatus) {
          if(x.foodNum == undefined){
            x.foodNum = this.data.num
          }
          x.totalPrice = (Number(x.jointSetDealPrice) * Number(x.foodNum)).toFixed(2)
          
          pri =(Number(pri) + (Number(x.foodNum) * Number(x.jointSetDealPrice))).toFixed(2)
          porridgeObject.selAllPrice = pri
          porridgeObjectList.push(x)
        }else{
          x.foodNum = 1
          porridgeObjectList.push(x)
        }
      }
     
       
      
      // porridgeObject.selAllPrice += parseInt(porridgeObject.list[this.data.foodIndx].foodNum) * parseInt(porridgeObject.list[this.data.foodIndx].jointSetDealPrice)
      this.triggerEvent('selPorridgeBackObject', {
        porridgeBackObject: porridgeObject,
        result: 1
      }, {})
      this.setData({
        porridgeObjectList: porridgeObjectList,
        showNu:false,
        num:1
      })
      this.triggerEvent('submitMaterial', {
        porridgeObjectList: porridgeObjectList,
        porridgeObject: this.properties.porridgeObject,
      }, {})
    },

    closeMaterial: function (event) {
      this.triggerEvent('closeMaterial', {}, {})
    },

    choose_whole: function (event) {

    },
    numberInput:function(e){
      var porridgeObject = this.data.porridgeObject
      porridgeObject.list[this.data.foodIndx].foodNum = e.detail.value

      this.setData({
        porridgeObject:porridgeObject
      })

    }
  }
})