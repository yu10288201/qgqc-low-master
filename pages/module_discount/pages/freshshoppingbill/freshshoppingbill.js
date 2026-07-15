const app = getApp()
// var util = require('../../../../utils/util.js');
// const wxpay = require('../../../../utils/wxpay')

//计算规则 待支付总金额  原单价*数量-实际优惠单价*数量-代金券额-星盾-充值金额=实际支付金额

Page({
  /**
   * 页面的初始数据
   */
  data: {	
    mall_password_dialog:false,
    buyer_password:'',
    remark:'',
    channel_type:0,
    //充电提成
    battery_total_amount:0,
    category_id:0,
	  showRemark: false,
	  currentShop: [],
    total_amount:0,
    total_actual_amount: 0,
    total_number: 0,  
    total_preferential_amount: 0, 
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
  
    mall_member_total_recharge_amount:0,//充值剩余金额
    mall_member_level_tag:'',//会员等级
    recharge_deduction_percentage:0,//充值会员抵扣比例
    mall_member_star:0,//剩余星盾 1=0.1元
    mall_member_rice_star:0,//剩余米顿 1=0.1元
    
    customer_total_amount:0,//客人价计算的总金额
    total_actual_amount:0,//实际价或者券后价计算的总金额
    deduction_amount:0,//客人价总金额-实际总金额
    deduction_recharge_total_amount:0,//抵扣的充值金额
    deduction_star:0,//抵扣的星盾
    deduction_shop_star:0,
    deduction_platform_star:0,

    deduction_color_global_total_voucher:0,//抵扣的代金券总额
    deduction_shop_color_global_total_voucher:0,//抵扣的店铺内代金券
    deduction_platform_color_global_total_voucher:0,//抵扣的平台代金券
    total_number: 0,//总数量


    mall_color_global_total_voucher:0,//平台总的代金券
    give_color_global_total_voucher:0,//赠送的多彩优惠券

    give_customer_color_global_voucher:0,
    give_customer_color_global_voucher_shop_id:0,
    mall_color_global_voucher_main_array:[],
    shop_ids:'0',
    total_color_global_voucher:0,
    is_merchant_procurement:0,
    use_shop_price:0,

  },
  selectBatteryTotalAmount(){
    var that=this;
    if(this.data.is_merchant_procurement>0&&this.data.use_shop_price>0){
      return;
    }
      wx.request({
        url: app.globalData.selectBatteryTotalAmount,
        method:'POST',
        dataType:'json',
        data:{
          lstMallBillShoppingCart:this.data.lstMallBillShoppingCart,
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

  checkShopIds(){

    var lstShoppingCart=this.data.lstShoppingCart;

    var lstMallBillShoppingCart=[];
    var shop_id_array=[];
    var is_exists=0;
		for(var i=0;i<lstShoppingCart.length;i++){

      var shop=lstShoppingCart[i];
      var shop_id=shop.shop_id;
      is_exists=0;
      for(var j=0;j<shop_id_array.length;j++){
        if(shop_id_array[j]==shop_id){
          is_exists=1;
        }
      }
      if(is_exists==0&&shop_id!=8888){
        shop_id_array.push(shop_id);
      }

    }		

    var shop_ids="0";
    for(var j=0;j<shop_id_array.length;j++){
       shop_ids+=","+shop_id_array[j];
    }
		this.setData({
      shop_ids:shop_ids,
    })   
  },

  checkTotal_UseCustomerColorGlobalVoucher(){
  
    if(this.data.is_merchant_procurement>0&&this.data.use_shop_price>0){
      //商家采购价
      return;
    }
    //需支付的现金
    var total_amount=0

    //总数量
    var total_number = 0

    var scan_staff_shop_id=this.data.scan_staff_shop_id;
    var scan_staff_shop_star=this.data.scan_staff_shop_star;
    var scan_staff_shop_voucher=this.data.scan_staff_shop_voucher;


    //多彩优惠券扣减

    var _deduction_color_global_total_voucher=0;
    var _deduction_shop_color_global_total_voucher=0;//店铺内使用的代金券
    var _deduction_platform_color_global_total_voucher=0;//平台使用的代金券


    //客人价计算的总金额
    var customer_total_amount=0;
    //实际使用价格计算的总金额
    var actual_total_amount=0;
    //主表 赠送的优惠券
    var main_give_color_global_total_voucher=0;

    //订单主表 抵扣的充值会员金额
    var deduction_recharge_total_amount=0;

    //抵扣的星盾 1=0.1元
    var _deduction_star=0;//抵扣的总星盾
    //店铺内使用的代金券
    var _deduction_shop_star=0;
    //平台内使用的代金券
    var _deduction_platform_star=0;

    //扫码使用的总数
    var _deduction_scan_shop_star=0;
    var _deduction_scan_shop_color_global_total_voucher=0;


    //系统剩余的总星盾数
    var mall_member_star=this.data.mall_member_star;//剩余星盾 1=0.1元
    
    console.log(mall_member_star)

    //平台剩余的总代金券
    var mall_color_global_total_voucher=this.data.mall_color_global_total_voucher;

    var lstShoppingCart=this.data.lstShoppingCart;
    var mall_color_global_voucher_main_array=this.data.mall_color_global_voucher_main_array;
    
    for(var j=0;j<lstShoppingCart.length;j++){
          var scartObj=lstShoppingCart[j];
          scartObj.total_color_global_voucher=0;
          scartObj.total_star=0;
    }
    if(mall_color_global_voucher_main_array&&mall_color_global_voucher_main_array.length>0){
      for(var i=0;i<mall_color_global_voucher_main_array.length;i++){
              var mcgvmObj=mall_color_global_voucher_main_array[i];
              for(var j=0;j<lstShoppingCart.length;j++){
                      var scartObj=lstShoppingCart[j];
                      if(mcgvmObj.shop_id==scartObj.shop_id&&scartObj.shop_id!=8888){
                        //店铺有的代金券
                        scartObj.total_color_global_voucher=mcgvmObj.total_color_global_voucher;
                        scartObj.total_star=mcgvmObj.total_star;
                      }
              }
        }
    }
    if(this.data.discount_name=='券后优惠'){
        for(var i=0;i<lstShoppingCart.length;i++){
          var shop=lstShoppingCart[i];
          if(shop.lstMallBillShoppingCart != []){
            for(var j=0; j<shop.lstMallBillShoppingCart.length; j++){
              var scObj=shop.lstMallBillShoppingCart[j];
                scObj.actual_price=scObj.preferential_price;
            } 
          }
        }
    }
    //判断是否是买一送多
    for(var i=0;i<lstShoppingCart.length;i++){
      var shop=lstShoppingCart[i];
      if(shop.lstMallBillShoppingCart != []){
        for(var j=0; j<shop.lstMallBillShoppingCart.length; j++){
          var scObj=shop.lstMallBillShoppingCart[j];
          if(scObj.buy_one_give_more_id==1)
          {
            scObj.actual_price=scObj.price;
            if(scObj.buy_one_give_more_id==1&&scObj.give_customer_color_global_voucher_shop_id==0){
              //设置之前的逻辑
              scObj.give_customer_color_global_voucher_shop_id=8888;
            }
          }
            
        } 
      }
    }
    this.setData({
      lstShoppingCart:lstShoppingCart,
    })



    var lstMallBillShoppingCart=[];

    for(var i=0;i<lstShoppingCart.length;i++){

      var shop_total_preferential_amount=0;
      var shop_customer_total_amount=0;
      var shop_actual_total_amount=0;
     
      var shop_deduction_recharge_total_amount=0;

      var shop_settlement_amount=0;
      var shop_deduction_amount=0;
      var shop_total_number=0;
      var shop_give_color_global_total_voucher=0;

      //订单内最多能使用多少星盾数
      var shop_max_total_use_star_commission=0;

      //最多可使用代金券

      var shop_deduction_shop_star=0;
      var shop_deduction_platform_star=0;
      var shop_deduction_scan_shop_star=0;//扫码店铺使用的星盾

      var shop_deduction_shop_color_global_total_voucher=0;//店铺内使用的代金券
      var shop_deduction_platform_color_global_total_voucher=0;//平台使用的代金券
      var shop_deduction_scan_shop_color_global_total_voucher=0;//扫码店铺使用的代金券

      var shop=lstShoppingCart[i];
      
			if(shop.lstMallBillShoppingCart != []){
				for(var j=0; j<shop.lstMallBillShoppingCart.length; j++){
          var scObj=shop.lstMallBillShoppingCart[j];
          lstMallBillShoppingCart.push(scObj);

          //计算店铺内的客人价支付金额
          shop_customer_total_amount+=scObj.number*scObj.price;

          if(scObj.shop_settlement_price_confirm==1){
            //计算店铺内的结算金额
            shop_settlement_amount+=(scObj.shop_settlement_price*scObj.number);

          }

          if(scObj.is_buy_gift==0){
              //计算实际价支付金额  不是赠送礼品 则计算实际金额
              shop_actual_total_amount+=scObj.number*scObj.actual_price;
          }


          scObj.give_color_global_total_voucher=scObj.number*scObj.give_customer_color_global_voucher;

          if(scObj.buy_one_give_more_id==1||scObj.give_customer_color_global_voucher_shop_id>0){
            //赠送代金券
            shop_give_color_global_total_voucher+=scObj.give_color_global_total_voucher;
          }

          if(scObj.use_star_commission>0){
              shop_max_total_use_star_commission+=(scObj.use_star_commission*scObj.number);
          }

          shop_total_number+=scObj.number;

          total_number +=scObj.number;
          total_number+=scObj.buy_one_give_number*scObj.number;

          if(scObj.lstGift&&scObj.lstGift.length>0){
            for(var k=0;k<scObj.lstGift.length;k++){
              var giftObj=scObj.lstGift[k];
              total_number +=giftObj.gift_number*scObj.number;
            }
          }
        } 

      }

      //店铺内计算 使用的代金券
      shop_deduction_amount=shop_customer_total_amount-shop_actual_total_amount;

      shop.customer_total_amount=shop_customer_total_amount;
      shop.actual_total_amount=shop_actual_total_amount;
      shop.deduction_amount=shop_deduction_amount;
      shop.deduction_recharge_total_amount=shop_deduction_recharge_total_amount;    
      shop.total_number=shop_total_number;
      
      shop.shop_settlement_amount=shop_settlement_amount;
      shop.give_color_global_total_voucher=shop_give_color_global_total_voucher;

      //根据店铺内数据，计算总数
      deduction_recharge_total_amount+=shop_deduction_recharge_total_amount;

      var shop_leave_total_amount=shop_actual_total_amount-shop_deduction_recharge_total_amount;

      //会员抵扣后，剩余部分计算星盾抵扣金额

      console.log("shop_leave_total_amount:"+shop_leave_total_amount);
      console.log("shop_max_total_use_star_commission:"+shop_max_total_use_star_commission);
      console.log("shop.total_star:"+shop.total_star);

      console.log("681行剩余金额："+shop_leave_total_amount);
      if(scan_staff_shop_id==0){

        //不是扫码的才允许使用 商品所在店的星盾和代金券

                  if(shop_leave_total_amount>0&&shop_max_total_use_star_commission>0&&shop.total_star>0&&shop_leave_total_amount>=shop_max_total_use_star_commission*0.1){
                            
                    //最多使用shop_max_total_use_star_commission个星盾
                    if(shop_max_total_use_star_commission>=shop.total_star){

                      //店铺内全部抵扣
                      shop_deduction_shop_star=shop.total_star;
                      shop_leave_total_amount=shop_leave_total_amount-shop.total_star*0.1;
                      shop_max_total_use_star_commission=shop_max_total_use_star_commission-shop.total_star;

                    }else{
                        //店铺内全部抵扣
                        shop_deduction_shop_star=shop_max_total_use_star_commission;
                        shop_leave_total_amount=shop_leave_total_amount-shop_max_total_use_star_commission*0.1;
                        shop_max_total_use_star_commission=0;
                    } 
          }
      }
      console.log("704行剩余金额："+shop_leave_total_amount);
       if(scan_staff_shop_id>0){
                //如果是扫码进入程序，使用扫码店铺的星盾和代金券
                if(shop_leave_total_amount>0&&shop_max_total_use_star_commission>0&&scan_staff_shop_star>0&&(shop_leave_total_amount>=shop_max_total_use_star_commission*0.1)){

                                  
                  if(shop_max_total_use_star_commission>=scan_staff_shop_star){
                    //平台星盾全部抵扣
                    shop_deduction_scan_shop_star=scan_staff_shop_star;
                    shop_leave_total_amount=shop_leave_total_amount-shop_deduction_scan_shop_star*0.1;
                    //平台有的星盾设置为0；使后面的店铺不能使用
                    shop_max_total_use_star_commission=shop_max_total_use_star_commission-scan_staff_shop_star;
                    scan_staff_shop_star=0;

                  }else{
                      //店铺内全部抵扣
                      shop_deduction_scan_shop_star=shop_max_total_use_star_commission;                   
                      shop_leave_total_amount=shop_leave_total_amount-shop_deduction_scan_shop_star*0.1;
                      scan_staff_shop_star=scan_staff_shop_star-shop_deduction_scan_shop_star;
                      shop_max_total_use_star_commission=0;
                  }
                }
       }
        

       console.log("729行剩余金额："+shop_leave_total_amount);
      //平台抵扣
      if(shop_leave_total_amount>0&&shop_max_total_use_star_commission>0&&mall_member_star>0&&(shop_leave_total_amount>=shop_max_total_use_star_commission*0.1)){

                 console.log("平台抵扣星盾");
                if(shop_max_total_use_star_commission>=mall_member_star){
                  //平台星盾全部抵扣
                  shop_deduction_platform_star=mall_member_star;
                  shop_leave_total_amount=shop_leave_total_amount-shop_deduction_platform_star*0.1;
                  //平台有的星盾设置为0；使后面的店铺不能使用
                  shop_max_total_use_star_commission=shop_max_total_use_star_commission-mall_member_star;
                  mall_member_star=0;


                }else{
                    //店铺内全部抵扣
                    shop_deduction_platform_star=shop_max_total_use_star_commission;                   
                    shop_leave_total_amount=shop_leave_total_amount-shop_deduction_platform_star*0.1;
                    mall_member_star=mall_member_star-shop_deduction_platform_star;
                    shop_max_total_use_star_commission=0;
                }
      }

      console.log("752行剩余金额："+shop_leave_total_amount);
      //使用店铺内代金券
      if(shop_leave_total_amount>0&&shop.total_color_global_voucher>0){
              //全额使用
            if(shop.total_color_global_voucher>=shop_leave_total_amount){
              shop_deduction_shop_color_global_total_voucher=shop_leave_total_amount;
              shop_leave_total_amount=0;

            }else{
              shop_deduction_shop_color_global_total_voucher=shop.total_color_global_voucher;
              shop_leave_total_amount=shop_leave_total_amount-shop.total_color_global_voucher;
            }
    }
    console.log("765行剩余金额："+shop_leave_total_amount);
    //使用扫码店铺代金券
    if(shop_leave_total_amount>0&&scan_staff_shop_voucher>0){
      console.log("使用扫码店铺的代金券："+scan_staff_shop_voucher)
      if(scan_staff_shop_voucher>=shop_leave_total_amount){
        shop_deduction_scan_shop_color_global_total_voucher=shop_leave_total_amount;
        scan_staff_shop_voucher=scan_staff_shop_voucher-shop_leave_total_amount;
        shop_leave_total_amount=0; 
      }else{
        console.log("不使用扫码店铺的代金券")
        shop_deduction_scan_shop_color_global_total_voucher=scan_staff_shop_voucher;
        shop_leave_total_amount=shop_leave_total_amount-scan_staff_shop_voucher;
        scan_staff_shop_voucher=0;
      }
    }


    //使用平台代金券
    if(shop_leave_total_amount>0&&mall_color_global_total_voucher>0){

        if(mall_color_global_total_voucher>=shop_leave_total_amount){

          shop_deduction_platform_color_global_total_voucher=shop_leave_total_amount;
          mall_color_global_total_voucher=mall_color_global_total_voucher-shop_leave_total_amount;
          shop_leave_total_amount=0; 
        }else{

          shop_deduction_platform_color_global_total_voucher=mall_color_global_total_voucher;
          shop_leave_total_amount=shop_leave_total_amount-mall_color_global_total_voucher;
          mall_color_global_total_voucher=0;

        }
      }

      shop.deduction_shop_star=shop_deduction_shop_star;
      shop.deduction_platform_star=shop_deduction_platform_star;
      shop.deduction_star=shop_deduction_shop_star+shop_deduction_platform_star;

      _deduction_shop_star+=shop.deduction_shop_star;
      _deduction_platform_star+=shop.deduction_platform_star;
      _deduction_star+=shop.deduction_star;

      shop.deduction_scan_shop_star=shop_deduction_scan_shop_star;
      shop.deduction_scan_shop_color_global_total_voucher=shop_deduction_scan_shop_color_global_total_voucher;


      _deduction_scan_shop_star+=shop.deduction_scan_shop_star;
      _deduction_scan_shop_color_global_total_voucher+=shop.deduction_scan_shop_color_global_total_voucher;

      shop.deduction_shop_color_global_total_voucher=shop_deduction_shop_color_global_total_voucher;
      shop.deduction_platform_color_global_total_voucher=shop_deduction_platform_color_global_total_voucher;
      shop.deduction_color_global_total_voucher=shop.deduction_shop_color_global_total_voucher+shop.deduction_platform_color_global_total_voucher;

      _deduction_shop_color_global_total_voucher+=shop.deduction_shop_color_global_total_voucher;
      _deduction_platform_color_global_total_voucher+=shop.deduction_platform_color_global_total_voucher;
      _deduction_color_global_total_voucher+=shop.deduction_color_global_total_voucher;

      //总金额-各种抵扣后最后剩余需要现金支付的金额。
      shop.total_amount=shop_leave_total_amount;

      customer_total_amount+=shop_customer_total_amount;
      actual_total_amount+=shop_actual_total_amount;
      total_amount+=shop.total_amount;

      deduction_recharge_total_amount+=shop_deduction_recharge_total_amount;
      main_give_color_global_total_voucher+=shop_give_color_global_total_voucher;

    }

    var deduction_amount=customer_total_amount-actual_total_amount;
    
		this.setData({
      customer_total_amount:customer_total_amount.toFixed(2),
      actual_total_amount:actual_total_amount.toFixed(2),
      deduction_amount:deduction_amount.toFixed(2),
      deduction_recharge_total_amount:deduction_recharge_total_amount.toFixed(2),
      deduction_star:(_deduction_star*0.1).toFixed(2),
      deduction_shop_star:(_deduction_shop_star*0.1).toFixed(2),
      deduction_platform_star:(_deduction_platform_star*0.1).toFixed(2),
      deduction_color_global_total_voucher:_deduction_color_global_total_voucher.toFixed(2),
      deduction_platform_color_global_total_voucher:_deduction_platform_color_global_total_voucher.toFixed(2),
      deduction_shop_color_global_total_voucher:_deduction_shop_color_global_total_voucher.toFixed(2),
      deduction_scan_shop_star:(_deduction_scan_shop_star*0.1).toFixed(2),
      deduction_scan_shop_color_global_total_voucher:_deduction_scan_shop_color_global_total_voucher.toFixed(2),
      
      total_number: total_number,
      total_amount:total_amount.toFixed(2),
      give_color_global_total_voucher:main_give_color_global_total_voucher.toFixed(2),
      lstMallBillShoppingCart:lstMallBillShoppingCart,

    })   

  },

  checkTotal_UseShopPrice(){
    if(this.data.is_merchant_procurement<=0&&this.data.use_shop_price<=0){
      //商家采购价
      return;
    }

    //需支付的现金
    var total_amount=0

    //总数量
    var total_number = 0

    //客人价计算的总金额
    var customer_total_amount=0;
    //实际使用价格计算的总金额
    var actual_total_amount=0;
   
    //订单主表 抵扣的充值会员金额
    var deduction_recharge_total_amount=0;

 
    var lstShoppingCart=this.data.lstShoppingCart;
    for(var j=0;j<lstShoppingCart.length;j++){
          var scartObj=lstShoppingCart[j];
          scartObj.total_color_global_voucher=0;
          scartObj.total_star=0;
    }

  
    if(this.data.discount_name=='商家采购'){
        for(var i=0;i<lstShoppingCart.length;i++){
          var shop=lstShoppingCart[i];
          if(shop.lstMallBillShoppingCart != []){
            for(var j=0; j<shop.lstMallBillShoppingCart.length; j++){
              var scObj=shop.lstMallBillShoppingCart[j];
                scObj.actual_price=scObj.shop_price;
            } 
          }
        }
    }

    //判断是否是买一送多
    for(var i=0;i<lstShoppingCart.length;i++){
      var shop=lstShoppingCart[i];
      if(shop.lstMallBillShoppingCart != []){
        for(var j=0; j<shop.lstMallBillShoppingCart.length; j++){
          var scObj=shop.lstMallBillShoppingCart[j];
          if(scObj.buy_one_give_more_id==1)
          {
            scObj.actual_price=scObj.price;
            if(scObj.buy_one_give_more_id==1&&scObj.give_customer_color_global_voucher_shop_id==0){
              //设置之前的逻辑
              scObj.give_customer_color_global_voucher_shop_id=8888;
            }
          }
            
        } 
      }
    }
    this.setData({
      lstShoppingCart:lstShoppingCart,
    })



    var lstMallBillShoppingCart=[];
    for(var i=0;i<lstShoppingCart.length;i++){

      var shop_customer_total_amount=0;
      var shop_actual_total_amount=0;
      var shop_total_number=0;
     
      var shop=lstShoppingCart[i];
      
			if(shop.lstMallBillShoppingCart != []){
				for(var j=0; j<shop.lstMallBillShoppingCart.length; j++){
          var scObj=shop.lstMallBillShoppingCart[j];
          lstMallBillShoppingCart.push(scObj);

          //计算店铺内的客人价支付金额
          shop_customer_total_amount+=scObj.number*scObj.price;

          if(scObj.shop_settlement_price_confirm==1){
            //计算店铺内的结算金额
            shop_settlement_amount+=(scObj.shop_settlement_price*scObj.number);

          }

          if(scObj.is_buy_gift==0){
              //计算实际价支付金额  不是赠送礼品 则计算实际金额
              shop_actual_total_amount+=scObj.number*scObj.actual_price;
          }

        
          shop_total_number+=scObj.number;

          total_number +=scObj.number;
          total_number+=scObj.buy_one_give_number*scObj.number;

          if(scObj.lstGift&&scObj.lstGift.length>0){
            for(var k=0;k<scObj.lstGift.length;k++){
              var giftObj=scObj.lstGift[k];
              total_number +=giftObj.gift_number*scObj.number;
            }
          }
        } 

      }

      //店铺内计算 使用的代金券
     

      shop.customer_total_amount=shop_customer_total_amount;
      shop.actual_total_amount=shop_actual_total_amount;
      shop.total_amount=shop_actual_total_amount;
      shop.total_number=shop_total_number;  
     


      customer_total_amount+=shop_customer_total_amount;
      actual_total_amount+=shop_actual_total_amount;
      total_amount+=actual_total_amount;
    }
    
    var deduction_amount=(customer_total_amount-actual_total_amount);

		this.setData({
      customer_total_amount:customer_total_amount.toFixed(2),
      actual_total_amount:actual_total_amount.toFixed(2),
       deduction_amount:deduction_amount.toFixed(2),
      // deduction_recharge_total_amount:deduction_recharge_total_amount.toFixed(2),
      // deduction_star:(_deduction_star*0.1).toFixed(2),
      // deduction_shop_star:(_deduction_shop_star*0.1).toFixed(2),
      // deduction_platform_star:(_deduction_platform_star*0.1).toFixed(2),
      // deduction_color_global_total_voucher:_deduction_color_global_total_voucher.toFixed(2),
      // deduction_platform_color_global_total_voucher:_deduction_platform_color_global_total_voucher.toFixed(2),
      // deduction_shop_color_global_total_voucher:_deduction_shop_color_global_total_voucher.toFixed(2),
      // deduction_scan_shop_star:(_deduction_scan_shop_star*0.1).toFixed(2),
      // deduction_scan_shop_color_global_total_voucher:_deduction_scan_shop_color_global_total_voucher.toFixed(2),
      
      total_number: total_number,
      total_amount:total_amount.toFixed(2),
      //give_color_global_total_voucher:main_give_color_global_total_voucher.toFixed(2),
      lstMallBillShoppingCart:lstMallBillShoppingCart,

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
  // insertMerchandiseBillMain: function () {
	//   console.log('insertMerchandiseBillMain:')
  //   var that = this 
  //   var lstShop = []

  //   var mall_member_total_recharge_amount=this.data.mall_member_total_recharge_amount;//充值剩余金额
  //   var mall_member_level_tag=this.data.mall_member_level_tag;//会员等级
  //   var recharge_deduction_percentage=this.data.recharge_deduction_percentage;//充值会员抵扣比例
  //   var mall_member_star=this.data.mall_member_star;//剩余星盾 1=0.1元
  //   var mall_member_rice_star=this.data.mall_member_rice_star;//剩余米顿 1=0.1元
  //   var mall_color_global_total_voucher=this.data.mall_color_global_total_voucher;//多彩优惠券剩余总额1=1元
   
    
  //   for(var i=0;  i<that.data.lstShoppingCart.length; i++){

  //     var shop = that.data.lstShoppingCart[i];
  //     var total_price = 0
  //     var lstDetail = []
  //     var deduction_amount = 0


  //     var customer_total_amount=0;//客人价计算的总金额
  //     var total_actual_amount=0;//实际价或者券后价计算的总金额
  //     var deduction_amount=0;//客人价总金额-实际总金额
  //     var deduction_recharge_total_amount=0;//抵扣的充值金额
  //     var deduction_star=0;//抵扣的星盾
  //     var deduction_color_global_total_voucher=0;//抵扣的多彩优惠券
  //     //var total_number=0;//总数量
  //     var give_color_global_total_voucher=0;//赠送的多彩优惠券
  //     var total_amount=0;

  //     var shop_settlement_amount=0;


  //     var max_total_use_star_commission=0;
  //     var max_use_color_global_voucher=0;


    
  //     for(var j=0; j<shop.lstMallBillShoppingCart.length; j++){
  //       var item = shop.lstMallBillShoppingCart[j];
  //       var lstGift=[];
  //       if(item.lstGift&&item.lstGift.length>0){
  //          for(var k=0;k<item.lstGift.length;k++)
  //          {
  //            var giftObj=item.lstGift[k];
  //            lstGift.push({
  //             bill_detail_id:0,
  //             main_sku_id:giftObj.main_sku_id,
  //             gift_sku_id:giftObj.gift_sku_id,
  //             gift_shop_id:giftObj.gift_shop_id,
  //             gift_number:giftObj.gift_number,
  //             gift_sku_price:giftObj.gift_sku_price,
  //             gift_goods_name:giftObj.gift_goods_name,
  //             gift_color:giftObj.gift_color,
  //             gift_spec:giftObj.gift_spec,
  //           })
  //          }
          
  //       }

  //       if(item.shop_settlement_price_confirm==1){
  //         shop_settlement_amount+=(item.shop_settlement_price*item.number);
  //       }
        
  //       lstDetail.push({			  
  //         shopping_cart_id:item.id,			 
  //         sku_id:item.goods_sku_id,
  //         goods_name:item.goods_name,
  //         number: item.number,
  //         price: item.actual_price,				 
  //         total_amount: item.number * item.actual_price,
  //         delivery_count:item.delivery_count,
  //         delivery_day:item.delivery_day,
  //         delivery_weight:item.delivery_weight,		
  //         give_color_global_total_voucher:item.give_color_global_total_voucher,

  //         lstGift:lstGift, 
  //       })
  //       customer_total_amount+= (item.number * item.price);
  //       total_actual_amount+=item.number * item.actual_price;


  //       max_total_use_star_commission+=item.use_star_commission;
  //       if(item.buy_one_give_more_id==0){
  //           max_use_color_global_voucher+=item.number * item.price;
  //       }



  //       total_price = total_price + (item.number * item.actual_price)
  //       var detail_total_amount=item.number * item.actual_price;
  //       give_color_global_total_voucher+=item.give_color_global_total_voucher;
  //       //只有在余额充足的情况下，才需要计算deduction amount也就是需要抵扣的数额，否则就为0 
  //     } 

  //     total_amount=total_actual_amount;
  //     if(mall_member_level_tag=='recharge_member_price'&&recharge_deduction_percentage>0){
  //         deduction_recharge_total_amount=total_actual_amount*recharge_deduction_percentage;
  //         total_amount=total_actual_amount-deduction_recharge_total_amount;
  //     }

  //     if(max_total_use_star_commission>0&&mall_member_star>0&&total_amount>0){
  //         if(mall_member_star<=max_total_use_star_commission){
  //               //星盾数<=最大可用数量
  //                 var tmp_mall_member_star_amount=0;
  //                 if(mall_member_star*0.1>=total_amount){
  //                   total_amount=0;
  //                   tmp_mall_member_star_amount=mall_member_star*0.1-total_amount;
  //                   deduction_star=mall_member_star-Math.floor(tmp_mall_member_star_amount/0.1);
  //                   mall_member_star=Math.floor(tmp_mall_member_star_amount/0.1);
  //                 }else{
  //                     total_amount=total_amount-mall_member_star*0.1;
  //                     deduction_star=mall_member_star;
  //                     mall_member_star=0;
  //                 } 
              
  //         }else{
  //               //星盾数>最大可用数量  使用 max_total_use_star_commission 做参考
  //               var tmp_mall_member_star_amount=0;
  //               if(max_total_use_star_commission*0.1>=total_amount){
  //                 total_amount=0;
  //                 tmp_mall_member_star_amount=max_total_use_star_commission*0.1-total_amount;
  //                 deduction_star=max_total_use_star_commission-Math.floor(tmp_mall_member_star_amount/0.1);
  //                 mall_member_star=mall_member_star-max_total_use_star_commission;
  //               }else{

  //                   total_amount=total_amount-max_total_use_star_commission*0.1;
  //                   deduction_star=max_total_use_star_commission;
  //                   mall_member_star=mall_member_star-max_total_use_star_commission;
  //               } 
  //         }
  //     }
  //     if(max_use_color_global_voucher>0&&total_amount>0&&mall_color_global_total_voucher>0){
  //             if(max_use_color_global_voucher>=mall_color_global_total_voucher){
  //               //使用自己剩余的代金券
  //               if(mall_color_global_total_voucher>=total_amount){
  //                   deduction_color_global_total_voucher=total_amount;
  //                   mall_color_global_total_voucher=mall_color_global_total_voucher-total_amount;
  //                   total_amount=0;
  //               }else{
  //                 deduction_color_global_total_voucher=mall_color_global_total_voucher;
  //                 total_amount=total_amount-mall_color_global_total_voucher;
  //                 mall_color_global_total_voucher=0;
  //               }

  //           }else{
  //             //使用 max_use_color_global_voucher 指定量的代金券
  //             if(max_use_color_global_voucher>=total_amount){
  //                 deduction_color_global_total_voucher=total_amount;
  //                 mall_color_global_total_voucher=mall_color_global_total_voucher-total_amount;
  //                 total_amount=0;
  //             }else{
  //                 deduction_color_global_total_voucher=max_use_color_global_voucher;
  //                 total_amount=total_amount-mall_color_global_total_voucher;
  //                 mall_color_global_total_voucher=mall_color_global_total_voucher-mall_color_global_total_voucher;
  //             }

  //           }
  //     }
     

  //     //优惠的金额
  //     deduction_amount=customer_total_amount-total_actual_amount;


  //     //bill_type==0 商城普通订单
  //     lstShop.push({
  //       shop_id: shop.shop_id,
  //       scan_staff_goods_id:app.globalData.scan_staff_goods_id,
  //       scan_staff_customer_id:app.globalData.scan_staff_customer_id,
  //       card_is_in_activity:app.globalData.card_is_in_activity,
  //       is_staff_special_commission:app.globalData.is_staff_special_commission,
  //       buyer_id: app.globalData.customerInf.id,
  //       buyer_type: 1,
  //       bill_type: 0,
  //       buyer_address_id: that.data.customer_address_id,
  //       remark: shop.remark,
  //       customer_total_amount:customer_total_amount.toFixed(2),
  //       total_actual_amount:total_actual_amount.toFixed(2),
  //       deduction_amount: deduction_amount.toFixed(2),
  //       deduction_star:deduction_star,
  //       deduction_color_global_total_voucher:deduction_color_global_total_voucher.toFixed(2),
  //       give_color_global_total_voucher:give_color_global_total_voucher,
  //       total_amount: total_amount.toFixed(2),    
  //       shop_settlement_amount:shop_settlement_amount.toFixed(2),   
  //       lstDetail: lstDetail,
    
        
  //     })
  //   }
    
  //   if(that.data.customer_address_id == 0){
  //     wx.showModal({
  //       title: '出错提示',
  //       content: '请选择收货地址。',
  //       showCancel: false
  //     })
  //     return
  //   }
  //   console.log(lstShop);
    

  //   wx.request({
  //     url:  app.globalData.insertMallBillMain_url,
  //     method: 'POST',
  //     data: lstShop,
  //     header: {
  //       'content-type': 'application/json'
  //     },
  //     success: function (res) {
  //       if(res.data.code == 1000){
  //         app.globalData.scan_staff_goods_id=0;
  //         app.globalData.scan_staff_customer_id=0;
  //         app.globalData.is_staff_special_commission=0;
  //         app.globalData.card_is_in_activity=0;
  //         var is_in_activity_staus=res.data.data.is_in_activity_staus;
  //         var is_in_activity_count_show_id=res.data.data.is_in_activity_count_show_id;

  //         if(that.data.deduction_recharge_total_amount>0){
  //           wx.reLaunch({
  //             url: '../paymerchandise/paymerchandise?bill_payment_id=' + res.data.data.id + '&out_trade_no=' + res.data.data.out_trade_no
  //             + '&total_amount=' + res.data.data.total_amount + '&profit_sharing=' + res.data.data.profit_sharing +'&deductBalance=' + (that.data.deduction_recharge_total_amount).toFixed(2)+'&is_in_activity_staus='+is_in_activity_staus+'&is_in_activity_count_show_id='+is_in_activity_count_show_id
  //           }) 
  //         }else{
  //           wx.reLaunch({
  //             url: '../paymerchandise/paymerchandise?bill_payment_id=' + res.data.data.id + '&out_trade_no=' + res.data.data.out_trade_no
  //             + '&total_amount=' + res.data.data.total_amount + '&profit_sharing=' + res.data.data.profit_sharing+'&is_in_activity_staus='+is_in_activity_staus+'&is_in_activity_count_show_id='+is_in_activity_count_show_id
  //           })
  //         }          
                   
  //       }else{
  //         if(res.data.code == 1111){  
  //           wx.showModal({
  //             title: '写入订单失败',
  //             content: res.data.msg,
  //             showCancel: false,
  //             complete: (res) => {            
  //               if (res.confirm) {                  
  //                 wx.reLaunch({
  //                   url: '/pages/mall/pages/index/index'
  //                 })             
  //               }
  //             }
  //           })
  //         } else{
  //           wx.showModal({
  //             title: '写入订单失败',
  //             content: res.data.msg,
  //             showCancel: false,
  //             complete: (res) => {            
  //               if (res.confirm) { 
  //                 if (res.confirm) {                  
  //                   wx.reLaunch({
  //                     url: '/pages/mall/pages/index/index'
  //                   })             
  //                 }                 
  //               }
  //             }
  //           })
  //         }        
  //       }
  //     }
	// })	
	
  // },

  

  insertMerchandiseBillMain_GiveCustomerColorGlobalVoucher: function (buyer_password) {
    
 
    var that = this 
    var lstShop = []
    

    for(var i=0;  i<that.data.lstShoppingCart.length; i++){

      var shop = that.data.lstShoppingCart[i];
     
      var lstDetail = []
  
      //店铺确认金额
    
      for(var j=0; j<shop.lstMallBillShoppingCart.length; j++){
        var item = shop.lstMallBillShoppingCart[j];
        var lstGift=[];
        if(item.lstGift&&item.lstGift.length>0){
           for(var k=0;k<item.lstGift.length;k++)
           {
             var giftObj=item.lstGift[k];
             lstGift.push({
              bill_detail_id:0,
              main_sku_id:giftObj.main_sku_id,
              gift_sku_id:giftObj.gift_sku_id,
              gift_shop_id:giftObj.gift_shop_id,
              gift_number:giftObj.gift_number,
              gift_sku_price:giftObj.gift_sku_price,
              gift_goods_name:giftObj.gift_goods_name,
              gift_color:giftObj.gift_color,
              gift_spec:giftObj.gift_spec,
            })
           }
        }

        if(item.shop_settlement_price_confirm==1){
          shop_settlement_amount+=(item.shop_settlement_price*item.number);
        }
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

          give_color_global_total_voucher:item.give_color_global_total_voucher,	
          give_customer_color_global_voucher:item.give_customer_color_global_voucher,
          give_customer_color_global_voucher_shop_id:item.give_customer_color_global_voucher_shop_id,
          form_id:item.form_id?item.form_id:0,
          lstGift:lstGift, 
        })
        
      } 
      //bill_type==0 商城普通订单
      var buyer_id=app.globalData.customerInf.id;
      //测试
      //buyer_id=5983;

      
      lstShop.push({
        shop_id: shop.shop_id,
        scan_staff_goods_id:app.globalData.scan_staff_goods_id,
        scan_staff_customer_id:app.globalData.scan_staff_customer_id,
        card_is_in_activity:app.globalData.card_is_in_activity,
        is_staff_special_commission:app.globalData.is_staff_special_commission,
        buyer_id: buyer_id,
        buyer_type: 1,
        bill_type: 0,
        buyer_address_id: that.data.customer_address_id,
        remark: shop.remark,
        customer_total_amount:shop.customer_total_amount?shop.customer_total_amount.toFixed(2):0,
        actual_total_amount:shop.actual_total_amount?shop.actual_total_amount.toFixed(2):0,
        deduction_amount:shop.deduction_amount?shop.deduction_amount.toFixed(2):0,
        deduction_shop_star:shop.deduction_shop_star?shop.deduction_shop_star:0,
        deduction_platform_star:shop.deduction_platform_star?shop.deduction_platform_star:0,
        deduction_star:shop.deduction_star?shop.deduction_star:0,
        deduction_shop_color_global_total_voucher:shop.deduction_shop_color_global_total_voucher?shop.deduction_shop_color_global_total_voucher.toFixed(2):0,
        deduction_platform_color_global_total_voucher:shop.deduction_platform_color_global_total_voucher?shop.deduction_platform_color_global_total_voucher.toFixed(2):0,
        deduction_color_global_total_voucher:shop.deduction_color_global_total_voucher?shop.deduction_color_global_total_voucher.toFixed(2):0,
        deduction_scan_shop_star:shop.deduction_scan_shop_star?shop.deduction_scan_shop_star:0,
        deduction_scan_shop_color_global_total_voucher:shop.deduction_scan_shop_color_global_total_voucher?shop.deduction_scan_shop_color_global_total_voucher.toFixed(2):0,
        deduction_scan_shop_id:that.data.scan_staff_shop_id,
        
        give_color_global_total_voucher:shop.give_color_global_total_voucher?shop.give_color_global_total_voucher:0,
        total_amount: shop.total_amount?shop.total_amount.toFixed(2):0,    
        shop_settlement_amount:shop.shop_settlement_amount?shop.shop_settlement_amount.toFixed(2):0, 
        buyer_password:this.data.buyer_password,  
        lstDetail: lstDetail,
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
    console.log(lstShop);
    wx.request({
      url:  app.globalData.insertMallBillMain_url,
      method: 'POST',
      data: lstShop,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.code == 1000){
          app.globalData.scan_staff_goods_id=0;
          app.globalData.scan_staff_customer_id=0;
          app.globalData.is_staff_special_commission=0;
          app.globalData.card_is_in_activity=0;
          app.globalData.scan_staff_shop_id=0;
          var is_in_activity_staus=res.data.data.is_in_activity_staus;
          var is_in_activity_count_show_id=res.data.data.is_in_activity_count_show_id;

          if(that.data.deduction_recharge_total_amount>0){
            wx.reLaunch({
              url: '../paymerchandise/paymerchandise?bill_payment_id=' + res.data.data.id + '&out_trade_no=' + res.data.data.out_trade_no
              + '&total_amount=' + res.data.data.total_amount + '&profit_sharing=' + res.data.data.profit_sharing +'&deductBalance=' + (that.data.deduction_recharge_total_amount).toFixed(2)+'&is_in_activity_staus='+is_in_activity_staus+'&is_in_activity_count_show_id='+is_in_activity_count_show_id
            }) 
          }else{
            wx.reLaunch({
              url: '../paymerchandise/paymerchandise?bill_payment_id=' + res.data.data.id + '&out_trade_no=' + res.data.data.out_trade_no
              + '&total_amount=' + res.data.data.total_amount + '&profit_sharing=' + res.data.data.profit_sharing+'&is_in_activity_staus='+is_in_activity_staus+'&is_in_activity_count_show_id='+is_in_activity_count_show_id
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
                  // if (res.confirm) {                  
                  //   wx.reLaunch({
                  //     url: '/pages/mall/pages/index/index'
                  //   })             
                  // }                 
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
        }else{
          for(var i=0;i<lstShoppingCart.length;i++){
             var shopObj=lstShoppingCart[i];
             if(shopObj.lstMallBillShoppingCart&&shopObj.lstMallBillShoppingCart.length>0){
                for(var j=0;j<shopObj.lstMallBillShoppingCart.length;j++){
                 
                  var cartObj=shopObj.lstMallBillShoppingCart[j];
                  console.log("test:")
                  console.log(cartObj);
                  if(cartObj.actual_price_name=='商家采购价'){
                      this.setData({
                        use_shop_price:1,
                      })
                  }
                  console.log(this.data.use_shop_price);
                  
                  cartObj.form_id=0;

                  var lstForm=[];
                  for(var k=0;k<cartObj.lstForm.length;k++){
                        if(cartObj.lstForm[k].is_checked==1){
                          cartObj.lstForm[k].is_checked=0;
                          lstForm.push(cartObj.lstForm[k]);
                        }
                  }
                  cartObj.lstForm=lstForm;
                }
             }
            
          }
        }

        // if(options.give_customer_color_global_voucher_shop_id&&Number(options.give_customer_color_global_voucher_shop_id)>0){
        //   if(lstShoppingCart.length==1){
        //       var give_customer_color_global_voucher=lstShoppingCart.get(0).give_customer_color_global_voucher;
        //       var give_customer_color_global_voucher_shop_id=lstShoppingCart.get(0).give_customer_color_global_voucher_shop_id;

        //       this.setData({
        //         give_customer_color_global_voucher:give_customer_color_global_voucher,
        //         give_customer_color_global_voucher_shop_id:give_customer_color_global_voucher_shop_id,
        //       });


        //   }
        // }
        
        that.setData({
          lstShoppingCart: lstShoppingCart,
        })
      that.checkShopIds();
      that.selectCustomerAddress()
      that.getMemberInfo()
    }    
  },
  getMemberInfo(){
    let that = this

    if(this.data.category_id==14){
      that.setData({
        discount_name: '券后优惠',
        actual_price: that.data.sku_preferential_price,                    
      })
      return;
    }

    var customer_openid=app.globalData.openid;
     //测试 老板手机
     //////customer_openid='ooTqv4pmYasTnEz5Nvn5nx13Fq10';


    wx.request({
      url: app.globalData.selectMallPlatformMemberInfo_url,				
      method: 'POST',
      data: {
        customer_openid: customer_openid,  
        shop_ids:that.data.shop_ids, 
        scan_staff_shop_id:app.globalData.scan_staff_shop_id,         
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.code == 1000){
          if(res.data.data){
            var data=res.data.data;
            that.setData({
              recharge_deduction_percentage:data.recharge_deduction_percentage,
              mall_member_star:data.mall_member_star,
              mall_member_rice_star:data.mall_member_rice_star,
              mall_color_global_total_voucher:data.mall_color_global_total_voucher,
              mall_color_global_voucher_main_array:data.lstMallColorGlobalVoucherMain,
              scan_staff_shop_id: data.scan_staff_shop_id,
              scan_staff_shop_star: data.scan_staff_shop_star,
              scan_staff_shop_voucher: data.scan_staff_shop_voucher
            })
            if(data.is_merchant_procurement){
              that.setData({
                is_merchant_procurement: Number(data.is_merchant_procurement),                    
              })
            }
          }

          if(that.data.is_merchant_procurement>0&&that.data.use_shop_price>0){
            that.setData({
              discount_name: '商家采购优惠',
              // actual_price: that.data.sku_shop_price,                    
            })
          }else{
            if(res.data.data.member_info != null){
              that.setData({
                discount_name: res.data.data.member_info.mall_member_level_name + '优惠',
                mall_member_level_tag:res.data.data.member_info.mall_member_level_tag,                    
              })
              if(res.data.data.member_info.mall_member_level_tag == 'recharge_member_price'){
                that.setData({
                  recharge_balance: res.data.data.member_info.mall_member_total_recharge_amount,
                  mall_member_total_recharge_amount:res.data.data.member_info.mall_member_total_recharge_amount,       
                })
              }
            }
            else{ 
              //非会员
              that.setData({
                discount_name: '券后优惠',
                // actual_price: that.data.sku_preferential_price,                    
              })
            }
          }
          
        }
        //要获取会员信息之后才可以计算总价
        //that.checkTotal();

        that.checkTotal_UseCustomerColorGlobalVoucher()
        that.selectBatteryTotalAmount();
        that.checkTotal_UseShopPrice();
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
  toGiftDetail(e){
      var item = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + item.gift_goods_id,
    })
  },
  closeIsInActivityContent(){
      this.setData({
        is_in_activity_content:0,
      })
  },
  checkBuyerPassword(){
      //检查是否传入了password
      if(this.data.buyer_password==''){
        wx.showToast({
          title: '请输入密码',
          icon:'none',
        })
        return;
      }
      this.setData({
        mall_password_dialog:false,
      })
      this.insertMerchandiseBillMain_GiveCustomerColorGlobalVoucher();
  },
  closeBuyerPasswordDialog(e){
    //关闭密码框
      this.setData({
        mall_password_dialog:false,
        buyer_password:'',
      })
  },
  insertMallBillMainCheck(){
    console.log("需要密码");
    var d_voucher=
    Number(this.data.deduction_shop_color_global_total_voucher)
    +Number(this.data.deduction_scan_shop_color_global_total_voucher)
    +Number(this.data.deduction_platform_color_global_total_voucher);
    console.log("d_voucher:"+d_voucher)


    if(d_voucher>0){
    
      this.setData({
        mall_password_dialog:true,
      })
     

    }else{
   
     
      this.insertMerchandiseBillMain_GiveCustomerColorGlobalVoucher();
    }
    

  },
  formChange(e){
      console.log(e);
      var shop_index=Number(e.currentTarget.dataset.sindex);
      var detail_index=Number(e.currentTarget.dataset.dindex);
      var form_id=Number(e.detail.value);

      var lstShoppingCart=this.data.lstShoppingCart;
      //shop.lstMallBillShoppingCart
      lstShoppingCart[shop_index].lstMallBillShoppingCart[detail_index].form_id=form_id;
      console.log(form_id)
      console.log(lstShoppingCart[shop_index].lstMallBillShoppingCart[detail_index].form_id)

      this.setData({
        lstShoppingCart:lstShoppingCart,
      })



  },
})