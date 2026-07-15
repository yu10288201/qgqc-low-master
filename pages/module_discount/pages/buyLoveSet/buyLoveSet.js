const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isFoodOrCombo:true,
    foodList: [],
    pageIndex: 0,
    pageSize: 10,
    customerInf: {},
    pageUrl: ["https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/smp/20220210_d6f7f60d4935440e9a0ab0a19315f7e2.png"],
  },

  onLoad: function (options) {
    let that = this;

    that.setData({
      customerInf: JSON.parse(options.customerInf),
    })

    that.selectAllSetMeal();
  },

  onShow: function () {

  },

  downRefresh(){
    this.selectAllSetMeal();
  },

  selectAllSetMeal(){
    let that = this;

    wx.request({
      url: app.globalData.getSetMealByStartUsing3,
      // url: "http://192.168.8.7:8081/evaluation/getSetMealByStartUsing3",
      success: res=>{
        console.log(res);
        let foodList = that.data.foodList;
        let pageIndex = Number(that.data.pageIndex) + 1;
        foodList = foodList.concat(res.data.paramsList);
        that.setData({
          foodList: foodList,
          pageIndex: pageIndex
        })
      }
    })
  },

  toDetail(e){
    let that = this;
    let a = e.currentTarget.dataset.item;

    wx.navigateTo({
      url: '/pages/module_discount/pages/Package_details/Package_details?id=0&setMealID=' + a.setMealID + '&ruleID=' + a.ruleID + '&isFromBuyLoveSet=true' + '&customerInf=' +  JSON.stringify(that.data.customerInf),
    })

  },
})