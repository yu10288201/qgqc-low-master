// pages/freshorder/freshorder.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    minusStatus: 'disable',
    setMealID:0,
    shop_id:0,
    pageURL:'',
    is_fresh_distribution:1,
    is_set_meal_weight:0,
    company_price:0,
    price:0,
    dishes_unit:'',
    spreads:0,//库存
    setMealAbout:'',
    setMealName:'',
    min_weight:0,
    max_weight:0,
    buy_min_weight:0,
    buy_max_weight:0,
    item_number:1,
    estimate_amount:0,//预付金额
    total_amount:0,//总金额
    remark:'',

    
  },
  buy_min_weight_change:function(e){
    console.log(e.detail.value);
    var value=Number(e.detail.value)
    if(value<this.data.min_weight){
      value=this.data.min_weight;
    }
    else if(value>this.data.max_weight){
      value=this.data.max_weight;
    }else if(value>buy_max_weight){
      value=buy_max_weight
    }
    this.setData({
      buy_min_weight:value
    })
    this.cal_total_amount();
  },
  buy_max_weight_change:function(e){
    console.log(e.detail.value);
    var value=Number(e.detail.value)
    if(value<this.data.min_weight){
      value=this.data.min_weight;
    }
    else if(value>this.data.max_weight){
      value=this.data.max_weight;
    }else if(value<buy_min_weight){
      value=buy_min_weight
    }
    this.setData({
      buy_max_weight:value
    })
    this.cal_total_amount();
  },

  bindMinus: function () {    
    var num = this.data.item_number;
    if (num > 1) {
      num--;
    }
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
      item_number: num,
      minusStatus: minusStatus
    })  
    this.cal_total_amount();  
  },

  bindPlus: function () {   
    var num = this.data.item_number;
    num++;
    var minusStatus = num > 1 ? 'normal' : 'disable';
    this.setData({
        item_number: num,
        minusStatus: minusStatus
    })
    this.cal_total_amount();  
  },

  item_number_change:function(e){    
    var value=Number(e.detail.value);    
    this.setData({
      item_number:value,
    })
    this.cal_total_amount();
  },

  cal_total_amount(){
    var is_set_meal_weight=this.data.is_set_meal_weight;
    var buy_max_weight=this.data.buy_max_weight;
    var buy_min_weight=this.data.buy_min_weight;
    var item_number=this.data.item_number;
    var price=this.data.price;

    var estimate_amount=0;
    var total_amount=0;

      if(is_set_meal_weight==1){
        if(buy_max_weight>this.buy_min_weight){
          estimate_amount=(buy_max_weight-buy_min_weight)*item_number*price;
          total_amount=estimate_amount;
        }else{
          estimate_amount=0;
          total_amount=0;
        }
      }else{
        total_amount=item_number*price;
        estimate_amount=0;
      }
      estimate_amount=total_amount.toFixed(2);
      total_amount=total_amount.toFixed(2);
      
      this.setData({
        total_amount:total_amount,
        estimate_amount:estimate_amount,
      })
  },

  remark_change:function(e){
    console.log(e.detail.value);
    var value=e.detail.value;
    if(value.length>100){
      value=value.substring(0,99);
    }
    this.setData({
      remark:value
    })
  },
  select: function (e) {
    var that = this
    wx.request({
      url: app.globalData.selectSetMealInfo_url,
      method: 'POST',
      data: {
        isOrder: 1,
        setMealID: that.data.setMealID,
        shop_id: "",
        startUsing: "",
        typeForSetMeal: ''
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.result==1){
          let setMeal = res.data.selectResult[0];
          let pageURL='';          
          if(setMeal.pageUrl&&setMeal.pageUrl.length>0){
            pageURL=setMeal.pageUrl[0].pageURL;
          }
          let is_fresh_distribution=setMeal.is_fresh_distribution;
          let is_set_meal_weight=setMeal.is_set_meal_weight;
          let company_price=setMeal.company_price;
          let price=setMeal.price;
          let min_weight=0;
          let max_weight=0;
          let dishes_unit=setMeal.dishes_unit;
          let spreads=setMeal.spreads;
          let setMealAbout=setMeal.setMealAbout;
          let setMealName=setMeal.setMealName;

          if(is_set_meal_weight==1){
             min_weight=setMeal.min_weight;
             max_weight=setMeal.max_weight;
          }

          that.setData({
            pageURL:pageURL,
            is_fresh_distribution:is_fresh_distribution,
            is_set_meal_weight:is_set_meal_weight,
            company_price:company_price.toFixed(2),
            price:price.toFixed(2),
            min_weight:min_weight.toFixed(2),
            max_weight:max_weight.toFixed(2),
            dishes_unit:dishes_unit,
            spreads:spreads,
            setMealAbout:setMealAbout,
            setMealName:setMealName,
            min_weight:min_weight.toFixed(2),
            max_weight:max_weight.toFixed(2),
          })
          that.cal_total_amount()
          return;

        }else{
            wx.showToast({
              title: '获取菜品失败',
              icon:'error',
            })
            return;
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
    var that = this;
    that.setData({
      setMealID: options.setMealID,
      shop_id: options.shop_id,
    })
    that.select()    
  },

  bigimg2: function (e) { //查看照片大图
    // console.log(e)
    var that = this;
    var imgBox = []
    var src=e.currentTarget.dataset.src;
    if(src.length<=10){
      return;
    }
    imgBox.push(e.currentTarget.dataset.src);
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: imgBox // 需要预览的图片http链接列表
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.deliveryAddressInf = '';
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  insertCustomerShoppingCart: function (e) {
    var that = this
    //先计算
    this.cal_total_amount();

    let customer_id=0;
    let openid=app.globalData.openid;
    let set_meal_id=this.data.setMealID;
    let shop_id=this.data.shop_id;
    let page_url=this.data.pageURL;
    let is_fresh_distribution=this.data.is_fresh_distribution;
    let is_set_meal_weight=this.data.is_set_meal_weight;
    let company_price=this.data.company_price;
    let price=this.data.price;
    let dishes_unit=this.data.dishes_unit;
    let spreads=this.data.spreads;
    let set_meal_about=this.data.setMealAbout;
    let set_meal_name=this.data.setMealName;
    let min_weight=this.data.min_weight;
    let max_weight=this.data.max_weight;
    let buy_min_weight=this.data.buy_min_weight;
    let buy_max_weight=this.data.buy_max_weight;
    let item_number=this.data.item_number;
    let estimate_amount=this.data.estimate_amount;
    let total_amount=this.data.total_amount;
    let remark=this.data.remark;

    if(item_number<=0){
      wx.showToast({
        title: '请录入购买数量',
        icon:'error',
      })
      return;
    }
    if(is_set_meal_weight==1){
      if(buy_min_weight<=0||buy_max_weight<=0){
        wx.showToast({
          title: '请录入重量范围',
          icon:'error',
        })
        return;
      }
    }    
    
    const data={
      customer_id:customer_id,
      openid:openid,
      set_meal_id:set_meal_id,
      shop_id:shop_id,
      page_url:page_url,
      is_fresh_distribution:is_fresh_distribution,
      is_set_meal_weight:is_set_meal_weight,
      company_price:company_price,
      price:price,
      dishes_unit:dishes_unit,
      spreads:spreads,
      set_meal_about:set_meal_about,
      set_meal_name:set_meal_name,
      min_weight:min_weight,
      max_weight:max_weight,
      buy_min_weight:buy_min_weight,
      buy_max_weight:buy_max_weight,
      item_number:item_number,
      estimate_amount:estimate_amount,
      total_amount:total_amount,
      remark:remark
    }
  
    wx.request({
      url: app.globalData.insertCustomerShoppingCart_url,
      //url:'http://localhost:8083/evaluation_war/insertCustomerShoppingCart',
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.code==1){
          wx.navigateTo({
            url: '../freshshoppingcart/freshshoppingcart',
          })
        }else{
          console.log(res.data.result)
            wx.showToast({
              title: '加入购物车失败',
              icon:'error',
            })
            return;
        }
      }
    })
  },
  testNav(){
    wx.navigateTo({
      url: '../freshshoppingcart/freshshoppingcart',
    })
  },
})