const app = getApp()
// var util = require('../../../../utils/util.js');
// const wxpay = require('../../../../utils/wxpay')

Page({
  /**
   * 页面的初始数据
   */
  data: {	
    remark:'',
    channel_type:0,
    battery_total_amount:0,
    mall_member_rice_star:0,
    mall_member_rice_star_amount:0,
    deduction_rice_star:0,
    deduction_rice_star_amount:0,
    category_id:0,
	  showRemark: false,
	  currentShop: [],
    total_amount:0,
    total_actual_amount: 0,
    total_actual_amount_deduction_rice_star_amount:0,
    //扣后余额个数
    mall_member_rice_star_amount_deduction_rice_star_amount_count:0,
    total_number: 0,  
    //total_preferential_amount: 0, 
    customer_address_id:0,//customer_address表的id
    name:'',//收件人姓名
    mobile:'',//收件人收件号
    detail_address:'',//收件人地址
    all_int_check:0,
    lstShoppingCart: [],
    lstMallBillShoppingCart:[],
    def_img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/smp/20230126_fc36b813007a4d39b046dc7e5d86465d.jpg',
    def_img_suffix:'?x-oss-process=image/resize,m_fill,h_72,w_82',
    discount_name: '',
    recharge_balance: -1,
    mall_color_global_total_voucher:0,
    leave_total_voucher:0,
    use_total_voucher:0,
  },
  selectBatteryTotalAmount(){
    var that=this;
      wx.request({
        url: app.globalData.selectBatteryTotalAmount,
        method:'POST',
        header: {
          'content-type': 'application/json'
        },
        data:{
          lstMallBillShoppingCart:that.data.lstMallBillShoppingCart,
          customer_openid: app.globalData.openid, 
        },
        success:res=>{
              if(res.data.code==1000){
                  that.setData({
                    battery_total_amount:Number(res.data.data.battery_total_amount),
                    channel_type:res.data.data.channel_type,
                  })
              }
        },
      })
  },
	checkTotal(){
    var total_amount=0
    var total_actual_amount = 0 
    var total_number = 0
    var use_total_voucher=this.data.mall_color_global_total_voucher-this.data.leave_total_voucher;
    //扣减合计金额
    var deduction_rice_star_amount=0;

    var color_global_voucher=0;
    var mall_member_rice_star_amount=this.data.mall_member_rice_star_amount;

    
    //var total_preferential_amount = 0
    var lstMallBillShoppingCart=[];
		var lstShoppingCart=this.data.lstShoppingCart;
		for(var i=0;i<lstShoppingCart.length;i++){
			var shop=lstShoppingCart[i];
			if(shop.lstMallBillShoppingCart != []){
				for(var j=0; j<shop.lstMallBillShoppingCart.length; j++){
          var scObj=shop.lstMallBillShoppingCart[j];
          lstMallBillShoppingCart.push(shop.lstMallBillShoppingCart[j]);	

          total_amount = total_amount + shop.lstMallBillShoppingCart[j].number*shop.lstMallBillShoppingCart[j].price;

          var tmp_actual_amount=		shop.lstMallBillShoppingCart[j].number*shop.lstMallBillShoppingCart[j].actual_price
          total_actual_amount = total_actual_amount + tmp_actual_amount;
       
          total_number = total_number + shop.lstMallBillShoppingCart[j].number;
          total_number=total_number+scObj.buy_one_give_number*scObj.number;
          color_global_voucher=color_global_voucher+scObj.color_global_voucher*scObj.number;
          if(scObj.lstGift&&scObj.lstGift.length>0){
            for(var k=0;k<scObj.lstGift.length;k++){
              var giftObj=scObj.lstGift[k];
              total_number = total_number + giftObj.gift_number*scObj.number;
            }
          }

            if(mall_member_rice_star_amount-deduction_rice_star_amount>=tmp_actual_amount){
              deduction_rice_star_amount+=tmp_actual_amount;
            }else if(mall_member_rice_star_amount>0 ){
              deduction_rice_star_amount=mall_member_rice_star_amount;
            }
          
         
                    

        }



			}
    }		
    var total_actual_amount_deduction_rice_star_amount=total_actual_amount-deduction_rice_star_amount;
    var mall_member_rice_star_amount_deduction_rice_star_amount_count
    =Math.floor((mall_member_rice_star_amount-deduction_rice_star_amount)*100)

		this.setData({
      total_amount: total_amount.toFixed(2),
      total_actual_amount:total_actual_amount.toFixed(2),        
      total_number: total_number,
      deduction_rice_star_amount:Number(deduction_rice_star_amount).toFixed(2),
      total_actual_amount_deduction_rice_star_amount:total_actual_amount_deduction_rice_star_amount.toFixed(2),
      mall_member_rice_star_amount_deduction_rice_star_amount_count:mall_member_rice_star_amount_deduction_rice_star_amount_count,
      lstMallBillShoppingCart:lstMallBillShoppingCart,
      color_global_voucher:color_global_voucher,
      use_total_voucher:use_total_voucher,
    })   
	},

	showRemark(e){
		this.setData({
			showRemark: true,
			currentShop: e.currentTarget.dataset.item,
      remark: e.currentTarget.dataset.item.remark,
      
		})	
	},

	closeShowRemark(){
		this.setData({
			showRemark: false,			
		})
	},

	remark_change(e){
		this.setData({
			remark: e.detail.value,			
		})
	},

	recordRemark:function(e){    
		var value=this.data.remark;
		if(value.length>400){
		  value=value.substring(0,399);
		}
		
		var copyCart = this.data.lstShoppingCart
		console.log('copyCart1: '+ JSON.stringify(copyCart))
		for(var i=0;  i<copyCart.length; i++){		
			if (copyCart[i].shop_id == this.data.currentShop.shop_id){
				copyCart[i].remark = value				
				break
			}
		}	
			
		this.setData({
			lstShoppingCart: copyCart
		})
		
		this.closeShowRemark()
		this.setData({
			remark: '',
		})
	  },

    goCustomerAddressList(){
      //打开地址列表，选择地址
        wx.navigateTo({
          url: '../customeraddresslist/customeraddresslist?from_page=freshshoppingbill',
        })
	},
	
  selectCustomerAddress: function (e) {
    //查询第一条地址
    var that = this   
    var url=app.globalData.selectDefaultMallBaseBuyerAddress_url   
   
    wx.request({
      url: url,
      method: 'GET',
      data: {
          buyer_id: app.globalData.customerInf.id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.code==1){
          console.log(res.data.data)
          var data=res.data.data;
          that.setData({
            customer_address_id:data.id,
            detail_address: data.detail_address,
            name:data.name,
            mobile:data.mobile,
		  })
		}
       
      }
    })
  },

  insertMerchandiseBillMain: function () {
	  
    var that = this 
    var lstShop = []
    //总可用星盾
    var mall_member_rice_star_amount=this.data.mall_member_rice_star_amount;


    //总可用代金券
    var mall_color_global_total_voucher=this.data.mall_color_global_total_voucher;
    
    //总抵扣星盾
    var total_deduction_rice_star_amount=0;

    for(var i=0;  i<that.data.lstShoppingCart.length; i++){
      var shop = that.data.lstShoppingCart[i];
      var total_price = 0
      var lstDetail = []
      var deduction_amount = 0;
      var deduction_rice_star_amount=0;
     
      for(var j=0; j<shop.lstMallBillShoppingCart.length; j++){
        var item = shop.lstMallBillShoppingCart[j];
        lstDetail.push({			  
          shopping_cart_id:item.id,			 
          sku_id:item.goods_sku_id,
          goods_name:item.goods_name,
          number: item.number,
          price: item.actual_price,				 
          total_amount: item.number * item.actual_price,
          delivery_count:item.delivery_count,
          delivery_day:item.delivery_day,
          delivery_weight:item.delivery_weight,			  
        })
        total_price = total_price + item.number * item.actual_price
        //只有在余额充足的情况下，才需要计算deduction amount也就是需要抵扣的数额，否则就为0      
        if(mall_member_rice_star_amount-total_deduction_rice_star_amount>=total_price){
          total_deduction_rice_star_amount+=total_price;
          deduction_rice_star_amount=deduction_rice_star_amount+total_price;
          total_price=0;
        }else if(mall_member_rice_star_amount-total_deduction_rice_star_amount>0) {
          deduction_rice_star_amount=mall_member_rice_star_amount-total_deduction_rice_star_amount;
          total_price=total_price-(mall_member_rice_star_amount-total_deduction_rice_star_amount);
          total_deduction_rice_star_amount=mall_member_rice_star_amount;
        }else if(mall_color_global_total_voucher>0) {
            //米盾使用完毕
            //使用代金券
            


        }
        //

      } 
      var tmp_deduction_rice_star=Math.floor((mall_member_rice_star_amount-deduction_rice_star_amount)*100);
      var deduction_rice_star=this.data.mall_member_rice_star-tmp_deduction_rice_star;
      
      //bill_type==2 大米订单
      lstShop.push({
        shop_id: shop.shop_id,
        buyer_id: app.globalData.customerInf.id,
        buyer_type: 1,
        bill_type:2,
        buyer_address_id: that.data.customer_address_id,
        remark: shop.remark,
        total_amount: total_price.toFixed(2),       
        lstDetail: lstDetail,
        deduction_amount: deduction_amount.toFixed(2),
        deduction_rice_star:deduction_rice_star,
        deduction_rice_star_amount:deduction_rice_star_amount.toFixed(2),
      })
    }
    
    
    if(that.data.customer_address_id == 0){
      wx.showModal({
        title: '出错提示',
        content: '请选择收货地址。',
        showCancel: false
      })
      return
    }

    wx.request({
      url:  app.globalData.insertMallBillMain_url,
      method: 'POST',
      data: lstShop,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.code == 1000){
          if(that.data.recharge_balance >= that.data.total_amount - that.data.total_actual_amount){
            wx.reLaunch({
              url: '../paymerchandise/paymerchandise?bill_payment_id=' + res.data.data.id + '&out_trade_no=' + res.data.data.out_trade_no
              + '&total_amount=' + res.data.data.total_amount + '&profit_sharing=' + res.data.data.profit_sharing +'&deductBalance=' + (that.data.total_amount - that.data.total_actual_amount).toFixed(2)
            }) 
          }else{
            wx.reLaunch({
              url: '../paymerchandise/paymerchandise?bill_payment_id=' + res.data.data.id + '&out_trade_no=' + res.data.data.out_trade_no
              + '&total_amount=' + res.data.data.total_amount + '&profit_sharing=' + res.data.data.profit_sharing
            })
          }          
                   
        }else{
          if(res.data.code == 1111){  
            wx.showModal({
              title: '写入订单失败',
              content: res.data.msg,
              showCancel: false,
              complete: (res) => {            
                if (res.confirm) {                  
                  wx.reLaunch({
                    url: '/pages/mall/pages/index/index'
                  })             
                }
              }
            })
          } else{
            wx.showModal({
              title: '写入订单失败',
              content: res.data.msg,
              showCancel: false,
              complete: (res) => {            
                if (res.confirm) { 
                  if (res.confirm) {                  
                    wx.reLaunch({
                      url: '/pages/mall/pages/index/index'
                    })             
                  }                 
                }
              }
            })
          }        
        }
      }
	})	
	
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
  allCheckedChange(e){
    if(this.data.all_int_check==1){
      this.setData({
        all_int_check:0,
      })
    }else{
      this.setData({
        all_int_check:1,
      })
    }

    var all_int_check=this.data.all_int_check;
    var lstShoppingCart=this.data.lstShoppingCart;
    for(var i=0;i<lstShoppingCart.length;i++){
      var shop=lstShoppingCart[i];
      shop.int_check= all_int_check;
      for(var j=0;j<shop.lstCustomerShoppingCart.length;j++){
       shop.lstCustomerShoppingCart[j].int_check= all_int_check;
       console.log( shop.lstCustomerShoppingCart[j].int_check);
       console.log( shop.lstCustomerShoppingCart[j].set_meal_name);
      }
    }

    this.setData({
      lstShoppingCart:lstShoppingCart,
    })
    console.log(this.data.lstShoppingCart);
    
  },
  shopCheckedChange(e){
    console.log(e);
    var shop_id=e.currentTarget.dataset.shop_id;
    var lstShoppingCart=this.data.lstShoppingCart;
    console.log(lstShoppingCart)
    for(var i=0;i<lstShoppingCart.length;i++){
      var shop=lstShoppingCart[i];
      if(shop.shop_id==shop_id){
        console.log(shop);
        var int_check=0;
        if(shop.int_check==0){
          int_check=1;
        }
        console.log(shop);
        for(var j=0;j<shop.lstCustomerShoppingCart.length;j++){
          console.log(shop.lstCustomerShoppingCart[j]);
          shop.lstCustomerShoppingCart[j].int_check=int_check;
          console.log(shop.lstCustomerShoppingCart[j].int_check)
          console.log(shop.lstCustomerShoppingCart[j].set_meal_name)
         }
         shop.int_check=int_check;
         break;
      }
    }
    this.setData({
      lstShoppingCart:lstShoppingCart,
    })

  },

  detailCheckdChanged(e){
    console.log(e);
    var shoppingchartid=e.currentTarget.dataset.shoppingchartid;
    var shop_id=e.currentTarget.dataset.shop_id;
    var lstShoppingCart=this.data.lstShoppingCart;
    for(var i=0;i<lstShoppingCart.length;i++){
        var shop=lstShoppingCart[i];
        if(shop.shop_id!=shop_id){
          continue;
        }
        for(var j=0;j<shop.lstCustomerShoppingCart.length;j++){
          if(shop.lstCustomerShoppingCart[j].id==shoppingchartid){
            var int_check=0;
            if(shop.lstCustomerShoppingCart[j].int_check==0){
              int_check=1;
            }
            shop.lstCustomerShoppingCart[j].int_check=int_check;
            console.log(shop.lstCustomerShoppingCart[j].int_check)
            console.log(shop.lstCustomerShoppingCart[j].set_meal_name)
          }
         }
    }
    this.setData({
      lstShoppingCart:lstShoppingCart,
    })
    this.checkNeedParentChecked();
  },

  checkNeedParentChecked(){
    //检查明细项，判断店铺层次是否需要全选
    var lstShoppingCart=this.data.lstShoppingCart;
    var all_int_check=1;
    for(var i=0;i<lstShoppingCart.length;i++){
        var shop=lstShoppingCart[i];
        var int_check=0;
        for(var j=0;j<shop.lstCustomerShoppingCart.length;j++){
            int_check=int_check+shop.lstCustomerShoppingCart[j].int_check;
            if(shop.lstCustomerShoppingCart[j].int_check==0){
              all_int_check=0;
            }
         }
         if(int_check==shop.lstCustomerShoppingCart.length){
           shop.int_check=1;
         }else{
           shop.int_check=0;
         }
    }
    
    this.setData({      
      lstShoppingCart:lstShoppingCart,
      all_int_check:all_int_check,
    })
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log("提交支付：onLoad");  
    console.log(options);
    if(options.category_id){
      //通过类型id判断是否是大米
      var category_id=Math.floor(options.category_id);
      this.setData({
        category_id:category_id,
      })
    }
    if(options.item){
      var cart = JSON.parse(options.item);
      
      var lstShoppingCart = cart.map(function(item) {
      return { ...item, remark: '' };
      })
      
        if(lstShoppingCart.length==0){
          wx.showToast({
            title: '传入商品列表为空',
            icon:'error',
          })
        }
        that.setData({
          lstShoppingCart: lstShoppingCart,
        })
      
      that.selectCustomerAddress()
      that.getMemberInfo()
    }    
  },
  getMemberInfo(){
    let that = this

    wx.request({
      url: app.globalData.selectMallPlatformMemberInfo_url,				
      method: 'POST',
      data: {
        customer_openid: app.globalData.openid,            
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.code == 1000){

          var mall_member_rice_star=res.data.data.mall_member_rice_star;
          var mall_member_rice_star_amount=(mall_member_rice_star/100).toFixed(2);

          that.setData({
            mall_member_rice_star: mall_member_rice_star,
            mall_member_rice_star_amount: mall_member_rice_star_amount,               
          })
      
        }
        //要获取会员信息之后才可以计算总价
        that.checkTotal()
        that.selectBatteryTotalAmount();
      }
    })
  },
 

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
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
  updateMallMemberConsumptionRecordBuyerAddressId(){
      //更新地址id
  },
})