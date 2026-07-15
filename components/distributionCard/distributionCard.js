// components/supercall.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    foodList: {
      type: Array,
      value: []
    },
    isFoodOrCombo: {
      type: Boolean,
      value: true
    },
    showButton: {
      type: Boolean,
      value: true
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件的方法列表
   */
  mounted() {

  },
  methods: {
    onShare(e){
      console.log(e,"子组件接受的分享值");
      this.triggerEvent("onShare",e)
    },
    downRefresh() {
      this.triggerEvent("downRefresh")
    },
    toDetail(e) {      
      let a = e.currentTarget.dataset.item
      let b = e.currentTarget.dataset.isfoodorcombo
    
      if(b){
        if(a.is_fresh_distribution){           
            wx.navigateTo({
                url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?id=0&setMealID=' + a.setMealID + '&ruleID=' + a.ruleID + '&shopID=' + a.shop_id,
			  })
			// wx.navigateTo({
			// url: '/pages/module_discount/pages/paymerchandiseresult/paymerchandiseresult',
			// })  
        }else{  
            wx.navigateTo({
                url: '/pages/module_discount/pages/Package_details/Package_details?id=0&setMealID=' + a.setMealID + '&ruleID=' + a.ruleID ,
            })            
        }
      }
      else{
        wx.navigateTo({
          url: '/pages/module_discount/pages/Package_details/Package_details?id=1&coupon_id=' + a.coupon_id + '&ruleID=' + a.coupon_allrule + '&shop_id=' + a.shop_id,
        })
      }
      
    }
  },

})