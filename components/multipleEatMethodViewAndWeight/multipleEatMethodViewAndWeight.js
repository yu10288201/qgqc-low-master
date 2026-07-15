// 来料加工专用多做法组件，因为来料加工的分部位，具有单独的数量输入，计价不同分别处理。
// 当单价为零的时候，金额等于做法的加收，
var app = getApp();
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    windowHeight:{
      type: Number,
    },
    em_arry: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
      }
    },
    inputAmount:{
      type:Number,
      value:0
    },
    inputAmountm:{
      type:Number,
      value:0
    },
    wholeValue: Number,
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
    partsName: {//部位 partsName[index].checked 控制按钮点亮
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
      }
    },
    readOnly: {
      type: Boolean,
      value: false
    },
    eatMethodChooseIndex: {
      type: Number,
      value: -1
    },
    eatMethodArray: {
      type: Array,
      value:[]
    },
    isTable: {
      type: Boolean,
      value: false,
      observer: function (newVal, oldVal) {
      }
    },
    needRemain: {
      type: Boolean,
      value: false
    },
    //多规格多做法判断参数
    isType10: {
      type: Boolean,
      observer: function (newVal, oldVal) {
      }
      // value: false
    },
    //多规格多做法数组
    EatmethodAndSpec: {
      type: Array,
      value: [],
      observer: function (newVal, oldVal) {
      }
    },
    partIndex:{//部位的下标
      type:Number,
    },
    eatMethodIndex:{//做法的下标
      type:Number,
      value:-1
    },
    isAddEat:{//是否显示新增部位、做法按钮
      type:Boolean,
    },
    addDishName:{//是否新增菜名
      type:Boolean,
    },
    dishes_name:{//手动输入的菜名
      type:Object,
    },
    showDishes:{//是否可以选中做法显示配菜
      type: Boolean,
      value: true
    },
  },

  /**
   * 组件的初始数据
   */
  data: {
    partIndex: 0,//选中的部位下标
    i_close_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/i_close.png',
    eatMethodIndex: -1,
    eatAndSpecIndex: -1,
    canRemain: true,
    isWhole: true,
    isType: false,
    dishesSpecList: [],
    showChooseEatMethod: '', //选中的做法名称（显示用）
    showChooseSpec: '', //选中的规格名称（显示用）
    eatMethodArray:[],
    isPlace:false,//是否点击了新增部位 true-是
    isEatMethod:false,//是否点击了新增做法 true-是
    addEatingMethod:[],//新增的做法
  },

  lifetimes: {
    attached: function () {
      // 在组件实例进入页面节点树时执行
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    // 选择做法，现在全部位和分部位以及剩余部位都放在同一个页面，只能在选择做法的时候加判断
    // 选择全部位的时候，直接去除其他部位的做法，反之也是一样。当选择分部位的时候，去除全部位的做法
    chooseEatMethod: function (e) {
      console.log(this.properties.eatMethodArray)
      var eatMethodArray = this.properties.eatMethodArray
      var wholeValue = this.properties.wholeValue
      // var needRemain = this.properties.needRemain
      var partsName = this.properties.partsName
      var eatMethodIndex = this.properties.eatMethodIndex
      var eatAndSpecIndex = this.properties.eatAndSpecIndex
      var em_arry = this.properties.em_arry
      var canRemain = true

      // 先区分是全部位还是分部位,如果是全部位的话，只选一个
      if (em_arry[this.data.partIndex][e.currentTarget.dataset.index].em_name == "全部位") {
        if (e.currentTarget.dataset.index != eatMethodIndex) {
          eatMethodArray = []
          eatMethodArray.push(em_arry[this.data.partIndex][e.currentTarget.dataset.index])
          if(eatMethodIndex != -1){
            em_arry[this.data.partIndex][eatMethodIndex].checked = false;
            em_arry[this.data.partIndex][eatMethodIndex].number = '';
          }

          em_arry[this.data.partIndex][0].number = wholeValue;
          em_arry[this.data.partIndex][e.currentTarget.dataset.index].number = wholeValue;
          em_arry[this.data.partIndex][e.currentTarget.dataset.index].checked = true;
          eatMethodIndex = e.currentTarget.dataset.index;
          this.setData({
            isWhole:true,
          })
        } else {
          eatMethodArray = []
          eatMethodIndex = -1
          eatAndSpecIndex = -1
        }
      } else { // 分部位
        if (e.currentTarget.dataset.index != eatMethodIndex) {
          for (var x = 0; x < eatMethodArray.length; x++) {
            if(eatMethodArray[x].count != -1){
              if (eatMethodArray[x].count == em_arry[this.data.partIndex][e.currentTarget.dataset.index].count) {
                eatMethodArray.splice(x, 1);
              }
            }else{
              if (eatMethodArray[x].em_name == em_arry[this.data.partIndex][e.currentTarget.dataset.index].em_name) {
                eatMethodArray.splice(x, 1);
              }
            }
          }
          if(this.data.dishesInfo.weighingByLocation == null || this.data.dishesInfo.weighingByLocation != 1){
            em_arry[this.data.partIndex][0].number = 1;
            em_arry[this.data.partIndex][e.currentTarget.dataset.index].number =1;
          }
          eatMethodArray.push(em_arry[this.data.partIndex][e.currentTarget.dataset.index])
          eatMethodIndex = e.currentTarget.dataset.index

          // 去除全部位
          for (var x = 0; x < eatMethodArray.length; x++) {
            if (eatMethodArray[x].em_name == "全部位") {
              eatMethodArray.splice(x, 1);
            }
          }
          for (var i = 0; i < em_arry.length; i++) {
            for (var j = 0; j < em_arry[i].length; j++) {
              if(em_arry[i][j].em_name == "全部位"){
                em_arry[i][j].checked = false;
                em_arry[i][j].number = '';
              }
            }
          }
          this.setData({
            isWhole:false
          })
        } else {
          for (var x = 0; x < eatMethodArray.length; x++) {
            if(eatMethodArray[x].count != -1){
              if (eatMethodArray[x].count == em_arry[this.data.partIndex][e.currentTarget.dataset.index].count) {
                eatMethodArray.splice(x, 1);
              }
            }else{
              if (eatMethodArray[x].em_name == em_arry[this.data.partIndex][e.currentTarget.dataset.index].em_name) {
                eatMethodArray.splice(x, 1);
              }
            }
          }
          eatMethodIndex = -1
          /**2020-11-17 取消选择 */
          for (var x = 0; x < em_arry[this.data.partIndex].length; x++) {
            em_arry[this.data.partIndex][x].number = "";
            em_arry[this.data.partIndex][x].checked = false;
          }
        }

        // 当除了剩余部位的分部位都选了的情况下,
        if (eatMethodArray.length >= em_arry.length - 2) {
          var temp = false
          var temp_index = -1
          for (var x = 0; x < eatMethodArray.length; x++) {
            if (eatMethodArray[x].em_name == "剩余部位") {
              temp = true
              temp_index = x
            }
          }
          if (eatMethodArray.length > em_arry.length - 2) {
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
      if(eatMethodIndex != -1){
        em_arry[this.data.partIndex][e.currentTarget.dataset.index].checked = true;
      }else{
        em_arry[this.data.partIndex][e.currentTarget.dataset.index].checked = false;
      }

      this.setData({
        eatMethodArray: eatMethodArray,
        canRemain: canRemain,
        em_arry: em_arry,
        partsName: partsName,
        eatMethodIndex: eatMethodIndex,
        eatAndSpecIndex: eatAndSpecIndex
      })
    },

    //2020-11-24 取消选择
    cancelEatMethod: function () {
      var partsName = this.data.partsName
      var em_arry = this.data.em_arry
      var eatMethodArray = this.data.eatMethodArray

      for (var x = 0; x < em_arry[this.data.partIndex].length; x++) {
        em_arry[this.data.partIndex][x].number = "";
        em_arry[this.data.partIndex][x].checked = false;
      };
      partsName[this.data.partIndex].checked = false;
      for (var x = 0; x < eatMethodArray.length; x++) {
        if(eatMethodArray[x].count != -1){
          if (eatMethodArray[x].count == em_arry[this.data.partIndex][this.data.eatMethodIndex].count) {
            eatMethodArray.splice(x, 1);
          }
        }else{
          if (eatMethodArray[x].em_name == em_arry[this.data.partIndex][e.currentTarget.dataset.index].em_name) {
            eatMethodArray.splice(x, 1);
          }
        }
      }
      this.setData({
        eatMethodIndex:-1,
        em_arry:em_arry,
        partsName :partsName,
        eatMethodArray:eatMethodArray
      });
    },


    chooseEatAndSpec: function (e) {
      var that = this;
      var eatAndSpecIndex = this.properties.eatAndSpecIndex
      if (e.currentTarget.dataset.index != eatAndSpecIndex) {

        eatAndSpecIndex = e.currentTarget.dataset.index
        //执行选择方法
        that.setData({
          showChooseSpec: that.data.dishesSpecList[eatAndSpecIndex].spec_name
        })
      } else {
        eatAndSpecIndex = -1;
        that.setData({
          showChooseSpec: ''
        })
      }
      that.setData({
        eatAndSpecIndex: eatAndSpecIndex,
      })
    },

    // 选中配菜
    eatMethodChoose: function (e) { 
      if(!this.properties.readOnly || !this.properties.showDishes){
        var eatMethodChooseIndex = e.currentTarget.dataset.index ==this.properties.eatMethodChooseIndex ? -1 : e.currentTarget.dataset.index
        this.setData({
          eatMethodChooseIndex: eatMethodChooseIndex
        })
        this.triggerEvent("eatMethodChoose", eatMethodChooseIndex)
      }
    },

    // 选择分部位,然后把已经选择好的做法回显
    switchPart: function (e) {
      var eatMethodIndex = -1
      // var eatMethodArray = this.data.eatMethodArray
      var eatMethodArray = this.properties.eatMethodArray
      //按部位称重
      if(this.properties.dishesInfo.weighingByLocation == 1 && this.data.eatMethodIndex != -1 && this.data.partIndex != -1 ){
        if(this.data.em_arry[this.data.partIndex][this.data.eatMethodIndex].number ==""){
          wx.showToast({
            title: '请输入重量',
            icon: 'none',
            duration: 2000,
            success: function () {}
          });
          return;//跳出方法
        }
      }
      if (eatMethodArray.length != 0) {
        for (var x = 0; x < this.properties.em_arry[e.currentTarget.dataset.index].length; x++) {
          for (var y of eatMethodArray) {
            if(y.id == -1){
              if(this.properties.em_arry[e.currentTarget.dataset.index][x].checked == true){
                eatMethodIndex = x
                break
              }
            }else{
              if (y.id == this.properties.em_arry[e.currentTarget.dataset.index][x].id) {
                eatMethodIndex = x
                break
              }
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
      var that = this;
      var eatMethodResult = {
        eatMethodArray: [],
        isWhole: false,
        result: -1, // 0-未选择,1-已选择,2-未选剩余部位,
      }
      var needRemain = this.properties.needRemain
      if (this.properties.eatMethodArray.length == 0) {
        eatMethodResult.eatMethodArray = []
        eatMethodResult.result = 0
        this.triggerEvent("submitEatMethod", eatMethodResult)
      } else {
        var isWhole = false
        var eatMethodArray = this.data.eatMethodArray
        for (var x = 0; x < eatMethodArray.length; x++) {
          var money = 0
            if(this.data.dishesInfo.weighingByLocation == 1){
            //来料加工
            money = eatMethodArray[x].price * 10000 * eatMethodArray[x].number /10000 //小数相乘会丢失精度
          }else{
            money = eatMethodArray[x].price
          }

          if(money>0){
            // money = Math.floor(money * 10000) / 10000
          }
          // 计算各个做法的加收钱
          eatMethodArray[x].money = money;
          eatMethodArray[x].no_sideDish_money = money;

          if (eatMethodArray[x].em_name == '全部位' && this.data.dishesInfo.weighingByLocation == 1 && eatMethodArray[x].number != null && eatMethodArray[x].number != '') {
            isWhole = true
            break;
          }else if(eatMethodArray[x].em_name == '全部位' && this.data.dishesInfo.weighingByLocation != 1){
            isWhole = true
            break;
          }
        }

        if (isWhole) { //全部位
          eatMethodResult.eatMethodArray = eatMethodArray
          eatMethodResult.isWhole = isWhole
          eatMethodResult.result = 1
          eatMethodResult.em_arry = that.data.em_arry,
          eatMethodResult.partsName = that.data.partsName,
          eatMethodResult.addEatingMethod = that.data.addEatingMethod
          this.triggerEvent("submitEatMethod", eatMethodResult)
        } else { // 分部位
          var allNumber = 0
          var hasNumber = true
          for (var x of eatMethodArray) {
            allNumber += Number(x.number)
          }
          if (allNumber.toFixed(2) != Number(this.properties.wholeValue).toFixed(2)) {
            hasNumber = false
          }

          if (!hasNumber && this.data.dishesInfo.weighingByLocation == 1) {
            wx.showModal({
              title: '温馨提示',
              content: '总数量为'+this.properties.wholeValue+'斤,分数量之和不等于总数量。',
              showCancel: false,
              confirmText: "确定",
            })
          }else{
            eatMethodResult.isWhole = isWhole
            var allNumber = true
            for (var x of this.properties.partsName) {
              if (x.em_name == '剩余部位') {
                needRemain = this.properties.canRemain
              }
            }
            for (var x of eatMethodArray) {
              if(x.checked){
                if(x.number<=0){
                  allNumber = false
                }
              }
            }
  
            if (!needRemain) { // 分部位不需要剩余部位的情况下
              eatMethodResult.eatMethodArray = eatMethodArray
              eatMethodResult.result = 1
              eatMethodResult.em_arry = that.data.em_arry
              eatMethodResult.partsName = that.data.partsName,
              eatMethodResult.addEatingMethod = that.data.addEatingMethod
              this.triggerEvent("submitEatMethod", eatMethodResult)
            } else {
              //2020-11-14 剩余部分非必选
              var hadRemain = true;
              if (hadRemain) {
                eatMethodResult.eatMethodArray = eatMethodArray
                eatMethodResult.result = 1
                if(eatMethodResult.eatMethodArray.length==1){
                   this.setData({
                     eatMethodChooseIndex:0
                  })
                }
                eatMethodResult.em_arry = that.data.em_arry
                eatMethodResult.partsName = that.data.partsName,
                eatMethodResult.addEatingMethod = that.data.addEatingMethod
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
      }
    },

    showMultipleEatMethodView(e) {
      if(!this.properties.readOnly){
        this.triggerEvent("showMultipleEatMethodView", e.currentTarget.dataset.type)
      }else{
        wx.showToast({
          title: '出单后不允许选做法',
          icon: 'none',
          duration: 2000,
          success: function () {}
        })
      }
    },

    // 做法输入数量
    keyInput(e) {
      var em_arry = this.properties.em_arry;
      var eatMethodArray = this.properties.eatMethodArray;
      if(this.data.dishesInfo.weighingByLocation == 1){
        for (var x = 0; x < em_arry[this.data.partIndex].length; x++) {
          em_arry[this.data.partIndex][x].number = e.detail.value
        }
        for (var y = 0; y < eatMethodArray.length; y++) {
          if(eatMethodArray[y].count != -1){
            if (eatMethodArray[y].count == em_arry[this.data.partIndex][this.data.eatMethodIndex].count) {
              eatMethodArray[y].number = e.detail.value;
            }
          }else{
            if (eatMethodArray[y].em_name == em_arry[this.data.partIndex][this.data.eatMethodIndex].em_name) {
              eatMethodArray[y].number = e.detail.value;
            }
          }
        }
      }
      this.setData({
        em_arry: em_arry
      })
    },

    showMultipleEatAndSpecView(e) {
      this.triggerEvent("showMultipleEatAndSpecView", e.currentTarget.dataset.type)
    },

    showSpecForEatMethodView(id) {
      var EatmethodAndSpec = this.properties.EatmethodAndSpec
      for (var x of EatmethodAndSpec) {
        if (x.id == id) {
          this.setData({
            dishesSpecList: x.dishesSpec
          })
        }

      }
    },

    submitEatAndSpec(e) {
      var that = this
      var eatAndSpecIndex = that.properties.eatAndSpecIndex //选择的规格
      var dishesSpecList = that.properties.dishesSpecList //规格数组
      if (eatAndSpecIndex == -1) {
        //没有选择规格
        wx.showToast({
          title: '请选择规格',
          icon: 'none',
          duration: 2000,
          success: function () {}
        })
      } else {
        that.properties.eatMethodArray[0].dishesSpec = dishesSpecList[eatAndSpecIndex]
        that.submitEatMethod();
      }
    },

    init:function(){
      let em_arry = this.data.em_arry;
      this.setData({
        em_arry:em_arry,
      })
    },

    //新增部位
    addEmArry:function(){
      var inputPlace = this.data.inputPlace;
      if(inputPlace != null && inputPlace != ''){
        let em_arry = this.data.em_arry;
        let partsName = this.data.partsName;
        var all = 0;
        if(inputPlace == "全部位"){
          all = 1;
        }
        var item = [{
          em_name:inputPlace,
          all:all,
          count:-1
        }];
        var partItem = {
          em_name:inputPlace,
          checked:false
        };
        em_arry.push(item);
        partsName.push(partItem);
        this.setData({
          em_arry:em_arry,
          inputPlace:'',
          partsName:partsName
        })
      }else{
        wx.showToast({
          title: '请输入部位',
          icon: 'none',
          duration: 2000,
          success: function () {}
        })
      }
    },

    //新增做法、加收价格
    addEatMethod: function (node, offset){
      var that = this;
      var inputEatMethod = that.data.inputEatMethod;
      var inputEatPrice = that.data.inputEatPrice;
      if(inputEatMethod != null && inputEatMethod != '' && inputEatPrice != null && inputEatPrice != ''){
          var em_arry = that.data.em_arry;
          var partIndex = that.data.partIndex;
          if(partIndex != null && partIndex != 'undefined' && partIndex != -1){
            var item = JSON.parse(JSON.stringify(em_arry[partIndex][0]));
            var addItem = {
              eating_method:inputEatMethod,//做法
              money:parseFloat(inputEatPrice),
              price:parseFloat(inputEatPrice),
              id:-1
            };
            addItem = Object.assign(item,addItem);
            if(em_arry[partIndex][0].eating_method != null && em_arry[partIndex][0].eating_method != undefined){
              em_arry[partIndex].push(addItem);
            }else{
              em_arry[partIndex][0] = addItem;
            }
            var addEatingMethod = that.data.addEatingMethod;
            addEatingMethod.push(addItem);
            this.setData({
              em_arry:em_arry,
              inputEatMethod:'',
              inputEatPrice:'',
              addEatingMethod:addEatingMethod
            });
          }
          else{
            wx.showToast({
              title: '请选择部位',
              icon: 'none',
              duration: 2000,
              success: function () {}
            })
          }
      }else{
        wx.showToast({
          title: '请输入做法或加收',
          icon: 'none',
          duration: 2000,
          success: function () {}
        })
      }
    },

    //点击新增部位按钮
    changeIsPlace:function(){
      this.setData({
        isPlace:!this.data.isPlace
      })
    },

    //点击删除部位按钮
    cancelIsPlace:function(){
      var that = this;
      var placeName = that.data.em_arry[that.data.partIndex][0].em_name;
      wx.showModal({
        title: '温馨提示',
        content: '是否确定删除['+placeName+']',
        success (res) {
          if (res.confirm) {
            var partIndex = that.data.partIndex;
            var em_arry = that.data.em_arry;
            var eatMethodArray = that.data.eatMethodArray;
            var partsName = that.data.partsName;
            for (var x = 0; x < eatMethodArray.length; x++) {
              if(eatMethodArray[x].count != -1){
                if (eatMethodArray[x].count == em_arry[that.data.partIndex][that.data.eatMethodIndex].count) {
                  eatMethodArray.splice(x, 1);
                }
              }else{
                if (eatMethodArray[x].em_name == em_arry[that.data.partIndex][that.data.eatMethodIndex].em_name) {
                  eatMethodArray.splice(x, 1);
                }
              }
            }
            em_arry.splice(partIndex, 1);//删除数组
            partsName.splice(partIndex,1);//删除数组
            if(em_arry == null &&em_arry.length == 0){
              partIndex = -1;
            }else{
              partIndex = 0;
            }
            that.setData({
              em_arry:em_arry,
              partIndex:partIndex,
              partsName:partsName,
              eatMethodArray:eatMethodArray,
              eatMethodIndex:-1,
            })
          } else if (res.cancel) {}
        }
      })
    },

    //点击新增做法按钮
    changeIsEatMethod:function(){
      this.setData({
        isEatMethod:!this.data.isEatMethod
      })
    },

    //点击删除做法按钮
    cancelIsEatMethod:function(){
      var that = this;
      var eatMethodIndex = that.data.eatMethodIndex;
      var partIndex = that.data.partIndex;
      var em_arry = that.data.em_arry;
      if(eatMethodIndex != -1){
        var methodName = em_arry[partIndex][eatMethodIndex].eating_method;
        wx.showModal({
          title: '温馨提示',
          content: '是否确定删除[' + methodName + ']',
          success(res) {
            if (res.confirm) {
              if(em_arry[partIndex].length == 1){
                em_arry[partIndex][0].eating_method = '';
                em_arry[partIndex][0].price = '';
              }else{
                em_arry[partIndex].splice(eatMethodIndex,1);//删除数组
              }
              that.setData({
                em_arry:em_arry,
                eatMethodIndex:-1
              })
            }else if (res.cancel) {}
          }
        });
      }else{
        wx.showToast({
          title: '请选择做法',
          icon: 'none',
          duration: 2000,
          success: function () {}
        })
      }

    },

  },
})