// components/multipleEatMethodView/multipleEatMethodView.js
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    xdswidth: {
      type: Boolean,
    },
    eatMethodIndex:{
      type:Number,
      value:-1
    },
    eatAndSpecIndex:{
      type:Number,
      value:-1
    },
    em_arry: {
      type: Array,
      value: [],
    },
    dishesInfo: {
      type: Object,
    },
    partsName: {
      type: Array,
      value: []
    },
    eatMethodArray: {
      type: Array,
      value: []
    },
    isTable: {
      type: Boolean,
      value: false
    },
    needRemain: {
      type: Boolean,
      value: false
    },
    //多规格多做法判断参数
    isType10: {
      type: Boolean
      // value: false
    },
    isNotShow:{
      type: Boolean
      // value: false
    },
    //多规格多做法总数量
    eatMethodArrayNumber:{
      type: Number
    },
    //多规格多做法总价格
    eatMethodArraySum:{
      type: Number
    },
    //多规格多做法数组
    EatmethodAndSpec: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
        console.log(1)
      }
    },
    eamChoose:{
      type:Number,
      value:-1
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    xdswidth: false,
    partIndex: 0,
    i_close_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/i_close.png',
    canRemain: true,
    type10Window:false,
    eatMethodIndex: -1,
    eatAndSpecIndex:-1,
    isType:false,
    dishesSpecList:[],
    showChooseEatMethod:'',//选中的做法名称（显示用）
    showChooseSpec:'',//选中的规格名称（显示用）
    eatAndSpecNum:'',
  },
  /**
   * 组件的方法列表
   */
  methods: {
    temp:function(){
      this.setData({
        partIndex: 0,
        i_close_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/i_close.png',
        canRemain: true,
        type10Window:false,
        eatMethodIndex: -1,
        eatAndSpecIndex:-1,
        isType:false,
        showChooseEatMethod:'',//选中的做法名称（显示用）
        showChooseSpec:'',//选中的规格名称（显示用）
        eamChoose:-1,
      })
    },
    temp2:function(a,b,c,d,f){
      this.setData({
        partIndex: 0,
        canRemain: true,
        dishesSpecList:d,
        type10Window:c,
        eatMethodIndex: a,
        eatAndSpecIndex:b,
        eatMethodArray:f,
        isType:false,
      })
    },
    // 选择做法，现在全部位和分部位以及剩余部位都放在同一个页面，只能在选择做法的时候加判断
    // 选择全部位的时候，直接去除其他部位的做法，反之也是一样。当选择分部位的时候，去除全部位的做法
    chooseEatMethod: function (e) {
      var eatMethodArray = this.properties.eatMethodArray
      // var needRemain = this.properties.needRemain
      var partsName = this.properties.partsName
      var eatMethodIndex = this.properties.eatMethodIndex
      var eatAndSpecIndex = this.properties.eatAndSpecIndex
      var canRemain = true

      // 先区分是全部位还是分部位,如果是全部位的话，只选一个

      if (this.properties.em_arry[this.data.partIndex][e.currentTarget.dataset.index].em_name == "全部位") {
        if (e.currentTarget.dataset.index != eatMethodIndex) {
          eatMethodArray = []
          eatMethodArray.push(this.properties.em_arry[this.data.partIndex][e.currentTarget.dataset.index])
          eatMethodIndex = e.currentTarget.dataset.index
          if(this.properties.isType10){
            eatAndSpecIndex = 0
            //属于多规格多做法，弹出对应的弹窗
              // 设置一个变量来显示
              var showChooseEatMethod = this.properties.em_arry[this.data.partIndex][e.currentTarget.dataset.index].eating_method;
              this.setData({
                showChooseEatMethod:showChooseEatMethod
              })
              this.showSpecForEatMethodView(this.properties.em_arry[this.data.partIndex][e.currentTarget.dataset.index].id)
          }
        } else {
          eatMethodArray = []
          eatMethodIndex = -1
          eatAndSpecIndex = -1
          this.setData({
            type10Window:false
          })
        }
      } else { // 分部位
        if (e.currentTarget.dataset.index != eatMethodIndex) {
          for (var x = 0; x < eatMethodArray.length; x++) {
            if (eatMethodArray[x].count == this.properties.em_arry[this.data.partIndex][e.currentTarget.dataset.index].count) {
              eatMethodArray.splice(x, 1);
            }
          }
          eatMethodArray.push(this.properties.em_arry[this.data.partIndex][e.currentTarget.dataset.index])
          eatMethodIndex = e.currentTarget.dataset.index

          // 去除全部位
          for (var x = 0; x < eatMethodArray.length; x++) {
            if (eatMethodArray[x].em_name == "全部位") {
              eatMethodArray.splice(x, 1);
            }
          }
        } else {
          for (var x = 0; x < eatMethodArray.length; x++) {
            if (eatMethodArray[x].count == this.properties.em_arry[this.data.partIndex][e.currentTarget.dataset.index].count) {
              eatMethodArray.splice(x, 1);
            }
          }
          eatMethodIndex = -1
        }

        // 当除了剩余部位的分部位都选了的情况下,
        if (eatMethodArray.length >= this.properties.em_arry.length - 2) {
          var temp = false
          var temp_index = -1
          for (var x = 0; x < eatMethodArray.length; x++) {
            if (eatMethodArray[x].em_name == "剩余部位") {
              temp = true
              temp_index = x
            }
          }
          if (eatMethodArray.length > this.properties.em_arry.length - 2) {
            if (temp_index != -1) {
              eatMethodArray.splice(temp_index, 1);
              canRemain = false
            }
          } else {
            if (!temp) {
              canRemain = false
            }
          }
        } else {

        }
      }

      for (var x = 0; x < partsName.length; x++) {
        partsName[x].checked = false
        for (var y of eatMethodArray) {
          if (y.em_name == partsName[x].em_name) {
            partsName[x].checked = true
            break;
          }
        }
      }

      this.setData({
        eatMethodArray: eatMethodArray,
        canRemain: canRemain,
        partsName: partsName,
        eatMethodIndex: eatMethodIndex,
        eatAndSpecIndex:eatAndSpecIndex,
        defaultEatAndSpec:false
      })
    },
    chooseEatAndSpec:function(e){
      var that = this;
      var eatAndSpecIndex = this.properties.eatAndSpecIndex
      if (e.currentTarget.dataset.index != eatAndSpecIndex) {
      
        eatAndSpecIndex = e.currentTarget.dataset.index
        //执行选择方法
        that.setData({
          showChooseSpec : that.data.dishesSpecList[eatAndSpecIndex].spec_name
        })
      }else{
        eatAndSpecIndex = -1;
        that.setData({
          showChooseSpec : ''
        })
      }
      that.setData({
        eatAndSpecIndex : eatAndSpecIndex,
      })
    },
    // 选择分部位,然后把已经选择好的做法回显
    switchPart: function (e) {
      var eatMethodIndex = -1
      var eatMethodArray = this.data.eatMethodArray
      if (eatMethodArray.length != 0) {
        for (var x = 0; x < this.properties.em_arry[e.currentTarget.dataset.index].length; x++) {
          for (var y of eatMethodArray) {
            if (y.id == this.properties.em_arry[e.currentTarget.dataset.index][x].id) {
              eatMethodIndex = x
              break
            }
          }
        }
      }
      this.setData({
        partIndex: e.currentTarget.dataset.index,
        eatMethodIndex: eatMethodIndex
      })
    },

    submitEatMethod(e) {
      var that = this
      var eatMethodResult = {
        eatMethodArray: [],
        isWhole:false,
        result: -1, // 0-未选择,1-已选择,2-未选剩余部位,
        Type10:false,//是否多规格多做法
      }
      var needRemain = this.properties.needRemain
      if (this.properties.eatMethodArray.length == 0) {
        eatMethodResult.eatMethodArray = []
        eatMethodResult.result = 0
        this.triggerEvent("submitEatMethod", eatMethodResult)
      } else {
        var isWhole = false
        for (var x of this.properties.eatMethodArray) {
          if (x.em_name == '全部位') {
            isWhole = true
          }
        }
        if (isWhole) { //全部位
          console.log(this.properties.eatMethodArray)
          eatMethodResult.eatMethodArray = this.properties.eatMethodArray
          eatMethodResult.isWhole = isWhole
          eatMethodResult.result = 1
          if(this.properties.isType10){
            eatMethodResult.Type10=true
            // that.addEASSum()
            if(eatMethodResult.eatMethodArray.length==1){
              that.setData({eamChoose:0})
           }
          }
          this.triggerEvent("submitEatMethod", eatMethodResult)
        } else { // 分部位
          eatMethodResult.isWhole = isWhole
          for (var x of this.properties.partsName) {
            if (x.em_name == '剩余部位') {
              needRemain = this.properties.canRemain
            }
          }
          if (!needRemain) { // 分部位不需要剩余部位的情况下
            eatMethodResult.eatMethodArray = this.properties.eatMethodArray
            eatMethodResult.result = 1
            this.triggerEvent("submitEatMethod", eatMethodResult)
          } else {
            var hadRemain = false
            for (var x = 0; x < this.properties.eatMethodArray.length; x++) {
              if ("剩余部位" == this.properties.eatMethodArray[x].em_name) {
                hadRemain = true
              }
            }
            if (hadRemain) {
              eatMethodResult.eatMethodArray = this.properties.eatMethodArray
              eatMethodResult.result = 1
              this.triggerEvent("submitEatMethod", eatMethodResult)
            } else {
              eatMethodResult.eatMethodArray = []
              eatMethodResult.result = 2
              this.triggerEvent("submitEatMethod", eatMethodResult)
            }
            // --------------------------------------------------
          }
        }
      }
    },

    showMultipleEatMethodView(e) {
      this.triggerEvent("showMultipleEatMethodView", e.currentTarget.dataset.type)
      this.setData({
        type10Window:false
      })
    },
    // addEASSum(){
    //   //多规格多做法时，计算所有菜的金额与份数
    //   let that = this;
    //   this.triggerEvent("addEASSum")
    // },
    dmev(e){
      let that = this;
      let index = that.data.eamChoose
      let eatMethodArray = that.data.eatMethodArray
      //取消掉选中的菜
      eatMethodArray.splice(index,1);
      //回显并设置光标
      that.setData({
        eamChoose:-1,
        eatMethodArray:eatMethodArray
      })
      // that.addEASSum()
      this.triggerEvent("dmev", eatMethodArray)
    },
    
    showMultipleEatAndSpecView(e){
      this.triggerEvent("showMultipleEatAndSpecView", e.currentTarget.dataset.type)
      this.setData({
        type10Window:false
      })
    },
    //显示做法对应的规格
    showSpecForEatMethodView(id){
      this.properties.eatAndSpecIndex = 0
      var EatmethodAndSpec = this.properties.EatmethodAndSpec
      for(var x of EatmethodAndSpec){
        if(x.id == id){
          this.setData({
            dishesSpecList:x.dishesSpec,
            type10Window:true,
            eatAndSpecIndex:0
          })
        }
      }
    },
    closeType10Window(){
      this.setData({
        type10Window:false
      })
    },
    inputEatAndSpec(e){
      var that = this;
      //废弃，不需要输入数量了
      var eatAndSpecNum = e.detail.value
      that.setData({
        eatAndSpecNum:e.detail.value
      })
    },
    clickEatAndMethod(e){
      console.log(e)
      let that = this;
      that.setData({
        eamChoose : e.currentTarget.dataset.index
      })
      this.triggerEvent("clickEatAndMethod", e.currentTarget.dataset.index)
    },
    submitEatAndSpec(e){
      var that = this
      var eatMethodIndex = this.properties.eatMethodIndex
      var eatAndSpecIndex = that.properties.eatAndSpecIndex//选择的规格
      var dishesSpecList = that.properties.dishesSpecList//规格数组
        if(eatMethodIndex == -1){
          //没有选择做法
          wx.showToast({
            title: '请选择做法',
            icon: 'none',
            duration: 2000,
            success: function () {}
          })
        }else{
          that.properties.eatMethodArray[0].dishesSpec = dishesSpecList[eatAndSpecIndex]
          that.properties.eatMethodArray[0].Number = 1
          that.submitEatMethod();
          //
          // that.setData({
          //   eatAndSpecIndex :-1,
          //   eatMethodIndex : -1
          // })
          // that.closeType10Window()
        }
    },

    //取消选择做法
    cancelEatMethod(){
      var index = this.data.partIndex;
      var partsNameIndexCheck = 'partsName['+index+'].checked';
      var eatMethodArray = this.properties.eatMethodArray;
      var eatMethodIndex = this.properties.eatMethodIndex;
      for (var x = 0; x < eatMethodArray.length; x++) {
        if (eatMethodArray[x].count == this.properties.em_arry[this.data.partIndex][eatMethodIndex].count) {
          eatMethodArray.splice(x, 1);
        }
      }
      this.setData({
        eatMethodIndex : -1,
        [partsNameIndexCheck]:false,
        eatMethodArray:eatMethodArray,
        partIndex:0
      })
    }
  },
  lifetimes: {
    attached: function() {
      // 在组件实例进入页面节点树时执行
    var type10Window = false
    if(this.properties.eatMethodIndex!=-1 && this.properties.eatAndSpecIndex!=-1){
      type10Window = true
      if(this.properties.eatMethodArray.length>0)
      this.showSpecForEatMethodView(this.properties.eatMethodArray[0].id)
    }
    this.setData({
      xdswidth: this.properties.xdswidth,
      eatMethodArray: this.properties.eatMethodArray,
      type10Window:type10Window,
      isType10:this.properties.isType10,
      dishesSpecList:JSON.parse(JSON.stringify(this.data.dishesSpecList)),
      eatMethodIndex: this.data.eatMethodIndex,
      eatAndSpecIndex: this.data.eatAndSpecIndex
    })
    },
    detached: function() {
      // 在组件实例被从页面节点树移除时执行
    this.setData({
      eatMethodArray: this.properties.eatMethodArray,
      canRemain: this.properties.canRemain,
      partsName: this.properties.partsName,
      eatMethodIndex: -1,
      eatAndSpecIndex:-1
    })
    },
  },


})
