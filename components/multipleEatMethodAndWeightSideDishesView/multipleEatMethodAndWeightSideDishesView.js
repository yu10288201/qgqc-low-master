// components/sideDishesView/sideDishesView.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    SideDishList: Object,
    SideDishList_choose: Object,
    isTable: Boolean,
    isTable: Boolean,
    /**2020-11-17 部位和做法 */
    eatMethodArray:Object,

    eatMethodChooseIndex: {
      type: Number,
      value: -1
    },
    dishes_type: {
      type: Number,
      value: 0
    },
    eatMethodRemark: {
      type: String,
      value: ""
    },
    eatMethodTastesRemark: {
      type: String,
      value: ""
    },
    tasteList: {
      type: Array,
      value: []
    },
    quickRemarkList: {
      type: Array,
      value: []
    },
    dishesInfo: {
      type: Object,
    },
    sideDishIndex:{
      type: Number,
    },
	spec_type:{
		type: Number,
		value: 0
	}
  },

  /**
   * 组件的初始数据
   */
  data: {
    i_close_img_url: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/%E8%86%B3%E9%A3%9F%E6%8E%8C%E6%9F%9C/img/i_close.png',
    menu_img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/index/menu.png',
    eatMethodTastesRemark: '',
    orderDetailedNum: 0,
    sideDishdPrice: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
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

    // 选择备注
    chooseRemark: function (e) {
      if (this.properties.eatMethodChooseIndex != -1 || this.properties.dishes_type!=0) {
        var quickRemarkList = this.properties.quickRemarkList
        var eatMethodRemark = this.properties.eatMethodRemark
        if (!quickRemarkList[e.currentTarget.dataset.index].checked) {
          if (eatMethodRemark != '') {
            eatMethodRemark = eatMethodRemark + "、" + quickRemarkList[e.currentTarget.dataset.index].value
          } else {
            eatMethodRemark = quickRemarkList[e.currentTarget.dataset.index].value
          }
        } else {
          eatMethodRemark = eatMethodRemark.replace(quickRemarkList[e.currentTarget.dataset.index].value, "");
        }
        quickRemarkList[e.currentTarget.dataset.index].checked = !quickRemarkList[e.currentTarget.dataset.index].checked
        this.setData({
          quickRemarkList: quickRemarkList,
          eatMethodRemark:eatMethodRemark
        })
      } else {
      }
    },

    // 选择口味
    chooseTaste(e) {
      if (this.properties.eatMethodChooseIndex != -1|| this.properties.dishes_type!=0) {
        var tasteList = this.properties.tasteList
        tasteList[e.currentTarget.dataset.index].checked = !tasteList[e.currentTarget.dataset.index].checked
        var tastesRemark = ''
        var tastes  = []
        for (var x = 0; x < tasteList.length; x++) {
          if(tasteList[x].checked){
            tastes.push("[" + tasteList[x].value + "]")
          }
        }
        if(tastes.length!=0){
          tastesRemark = tastes.join(" ")
        }
        this.setData({
          tasteList: tasteList,
          eatMethodTastesRemark:tastesRemark
        })
      } else {
      }
    },

    // 配菜框的选择
    changeBoxNum: function (e) {
      let index = e.currentTarget.dataset.index
      let SideDishList = this.properties.SideDishList
      let SideDishList_choose = this.properties.SideDishList_choose
      SideDishList_choose[index].orderDetailedNum = e.detail.value
      SideDishList_choose[index].orderDetailedSum = Number((Number(e.detail.value) * Number(SideDishList_choose[index].sideDishdPrice) / 100).toFixed(2))
      for (var x = 0; x < SideDishList.length; x++) {
        if (SideDishList_choose[index].ID == SideDishList[x].ID) {
          SideDishList[x] = SideDishList_choose[index]
        }
      }
      this.triggerEvent("changeBoxNum", {
        "SideDishList_choose": SideDishList_choose,
        "SideDishList": SideDishList
      })
    },

    chooseSideDish(e) {
      var SideDishList = this.properties.SideDishList
      var sideDishIndex = e.currentTarget.dataset.index
      for (var x = 0; x < SideDishList.length; x++) {
        if (SideDishList[x].orderDetailedNum <= 0 && x != sideDishIndex) {
          SideDishList[x].checked = false
        } else {
          //2020-11-18 选择配菜，如果原来未选择，则加一份（来料加工）
          if(!SideDishList[x].checked){
            SideDishList[x].checked = true
            if (x == sideDishIndex) {
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
      this.triggerEvent("returnSideDish", this.properties.SideDishList)
    },

    remarks: function (e) {
      this.setData({
        eatMethodRemark: e.detail.value
      })
    },

    addOReduce: function (e) {
      if (this.data.sideDishIndex != -1) {
        var SideDishList = this.data.SideDishList
        if (e.currentTarget.dataset.type == "1") {
          SideDishList[this.data.sideDishIndex].orderDetailedNum++
          SideDishList[this.data.sideDishIndex].orderDetailedSum = SideDishList[this.data.sideDishIndex].orderDetailedNum * 0.01 * SideDishList[this.data.sideDishIndex].sideDishdPrice
          SideDishList[this.data.sideDishIndex].orderDetailedSum = Number(SideDishList[this.data.sideDishIndex].orderDetailedSum.toFixed(2))
        } else if (e.currentTarget.dataset.type == "0") {
          if (SideDishList[this.data.sideDishIndex].orderDetailedNum > 0) {
            SideDishList[this.data.sideDishIndex].orderDetailedNum--
            SideDishList[this.data.sideDishIndex].orderDetailedSum = SideDishList[this.data.sideDishIndex].orderDetailedNum * 0.01 * SideDishList[this.data.sideDishIndex].sideDishdPrice
            SideDishList[this.data.sideDishIndex].orderDetailedSum = Number(SideDishList[this.data.sideDishIndex].orderDetailedSum.toFixed(2))
          } else {
          }
        }
        this.setData({
          orderDetailedNum: SideDishList[this.data.sideDishIndex].orderDetailedNum,
          SideDishList: SideDishList
        })
      }
    },

    //2020-11-18 取消选择(来料加工)
    cancelSideDish:function(){
      if (this.data.sideDishIndex != -1) {
        var SideDishList = this.data.SideDishList;
        SideDishList[this.data.sideDishIndex].orderDetailedNum = 0;
        SideDishList[this.data.sideDishIndex].checked = false;

        this.setData({
          orderDetailedNum: SideDishList[this.data.sideDishIndex].orderDetailedNum,
          SideDishList: SideDishList,
        })
      }
    },

    submitSideDish(e) {
      // 回调
      var SideDishList_choose = []
      var taste = []
      var tastes = ""
      var tastesRemark = ""
      var tasteList = this.data.tasteList
      var SideDishList = this.data.SideDishList
      var eatMethodRemark = this.data.eatMethodRemark
      var eatMethodTastesRemark = this.data.eatMethodTastesRemark
      for (var x = 0; x < tasteList.length; x++) {
        if (tasteList[x].checked) {
          taste.push(tasteList[x].value)
        }
      }
      if (taste.length != 0) {
        tastes = taste.join(",")
        for (var x = 0; x < taste.length; x++) {
          taste[x] = "[" + taste[x] + "]"
        }
        tastesRemark = taste.join(" ")
      }
      if(SideDishList != null && SideDishList.length != 0){
        for (var x = 0; x < SideDishList.length; x++) {
          if (SideDishList[x].checked && Number(SideDishList[x].orderDetailedNum) > 0) {
            SideDishList_choose.push(SideDishList[x])
          }
        }
      }
      this.triggerEvent("submitA", {
        "tastes": tastes,
        "tastesRemark": tastesRemark,
        "eatMethodRemark": eatMethodRemark,
        "eatMethodTastesRemark": eatMethodTastesRemark,
        "SideDishList_choose": SideDishList_choose,
        "SideDishList": SideDishList
      })
    },

    showpeicai(e) {
      this.triggerEvent("showpeicai", null)
    },


  },


})