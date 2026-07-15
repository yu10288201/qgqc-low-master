const app = getApp()
const QRCode = require("../../../../utils/weapp-qrcode.js")
var util = require('../../../../utils/util.js');
//const { noneParamsEaseFuncs } = require("XrFrame/xrFrameSystem");

var lstNine=[];
Page({

    /**
     * 页面的初始数据
     */
  data: {
    lstForm:[],
    enter_shop_id:0,//测试是否获取到了enter_shop_id
    ///商品基本信息新增的
    customer_preferential_price:0,
    recharge_member_price:0,
    vip_member_price:0,
    shop_price:0,//商家采购价
    total_sales_count:0,//总销量
    sales_count:0,//销量
    use_star_commission:0,
		//商品基本信息
    goods_id:'',
    //类别id 14--现碾大米
    category_id:0,
    //配送间隔天数
    delivery_day:0,
    //配送重量（斤）
    delivery_weight:0,
    //配送次数
    delivery_count:0,
    delivery_day_str:'',
    delivery_weight_str:'',
    //选择 一个月 一个季度 半年期 一年期 零售
    b_14_sel_spec_name:'',
    product_name:'',
    cut_introduction:'',
    img_text_description:'',
		multi_media: [],
		product_spec: [],
		product_color: [],
		description_img: [],
		sku:[],
		product_price:0,
    platform_cash_commission:0,
    shop_cash_commission: 0, 
    platform_star_commission: 0,  
    shop_star_commission: 0,
		ship_from: '',
		is_provide_invoices: 0,
		is_seven_without_reason: 0,
		param_img_url: '',
    shop_id: 0,

    is_in_activity:0,//是否是参加抢购礼品活动
    card_is_in_activity:0,
    is_in_activity_dlg_show:0,
    shop_name: '',
    shop_img: '',
    def_shop_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/smp/20221031_b55b78edef204fa8a26cc7218e108af6.jpg',
    home_img:'data:image/svg+xml,%3Csvg%20t%3D%221689642582122%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%2210918%22%20width%3D%2248%22%20height%3D%2248%22%3E%3Cpath%20d%3D%22M362.666667%20895.914667V639.850667c0-36.266667%2033.109333-63.850667%2072.533333-63.850667h153.6c39.253333%200%2072.533333%2027.648%2072.533333%2063.850667v256.064h59.904c61.269333%200%20110.762667-47.957333%20110.762667-106.730667V414.165333L557.162667%20139.328a63.808%2063.808%200%200%200-90.325334%200L192%20414.165333v375.018667c0%2058.88%2049.386667%20106.730667%20110.762667%20106.730667H362.666667z%20m42.666666%200h213.333334V639.850667c0-10.709333-12.586667-21.184-29.866667-21.184h-153.6c-17.408%200-29.866667%2010.389333-29.866667%2021.184v256.064z%20m469.333334-439.082667v332.352c0%2082.645333-68.885333%20149.397333-153.429334%20149.397333H302.762667C218.133333%20938.581333%20149.333333%20871.936%20149.333333%20789.184V456.832l-27.584%2027.584a21.333333%2021.333333%200%201%201-30.165333-30.165333L436.672%20109.162667a106.474667%20106.474667%200%200%201%20150.656%200l345.088%20345.088a21.333333%2021.333333%200%200%201-30.165333%2030.165333L874.666667%20456.832z%22%20fill%3D%22%23515151%22%20p-id%3D%2210919%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
    shoucang_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/shoucang.png',
    //会员相关
    actual_price_name:'',
    actual_price: 0,

		//弹出的‘加入购物车’页面相关信息
    selectedQuantity: 1,
    selectedQuantityStr:'1',
    selectedRiceAmount:0,
    selectedRiceStar:0,
    selectedColor: '',
		selectedSpec: '',
    selectedSKU: '',
    selectedSKUEntity:null,
    selectedGift:[],
    showAddtoCart: false,
    directBuy: false,
    sku_preferential_price: 0,
    sku_vip_price: 0,    
    sku_recharge_price: 0,
    sku_platform_cash_commission:0,    
    sku_shop_cash_commission: 0, 
    sku_platform_star_commission: 0,  
    sku_shop_star_commission: 0,
    sku_sales_count:0,
    sku_shop_price:0,
    sku_use_star_commission:0,

    sku_img_url:'',
		multimedia_url: '',
		minusStatus: '',

		//小图标svg码
		shopping_cart_img: app.globalData.shopping_cart_img,
		share_img: app.globalData.share_img,
		customer_service_img: app.globalData.customer_service_img,

		//置顶条相关的
    currentTab: 'basics',		
		inputValue: '',

		//用户评价相关的
		comments: [],
		comments_num: 0,

		//其它
		bind_type: 0,
		associate_id: 0, 
		associate_type: 0,
        is_video_show:app.globalData.is_video_show,
        is_fresh_distribution:0,
        is_set_meal_weight:0,
        shop_description: '',
        top_products: [],
        other_products: [],
        currentBlockColor: "#000000",
        blockColor: "#000000",
        colorGamut:"-webkit-linear-gradient(left, #ffffff 0%, #ff0000 100%)",
        colorGray:"-webkit-linear-gradient(left, #000000 0%, #ffffff 100%)",
        colorGamutTip:"#ff0000",
        colorGrayTip:"#ffffff",
        colorValue:0,
        colorGamutValue:0,
        colorGrayValue:0,
        isShowGetAvatar:false,
        constituteByOrderIdList: [],
        ticket_order_id:0,
        fromMenu: false,
        refund: 0,
        private_room: 0,
        holidays: 0,
        past_refund: 0,
        isFromBuyLoveSet: false,
        customerInf: '',
        inviterOpenid: '',
        moreInf: true,
        ruleid: false,
        transform: 'rotate(0deg)',
        webkitline: 6,
        setMeal: '',
        setMealType: '',
        startData: '',
        endData: '',
        timeList: [],
        file_id: 0,
        id: 0,
        godappraise: -1,
        godappraise1: 6,
        ladderStart: false,
        width: parseInt(wx.getSystemInfoSync().windowWidth * 0.94 * 0.96),
        height: parseInt(wx.getSystemInfoSync().windowWidth * 0.94 * 0.96 * 2 / 2),
        show_rule: false,
        cusid: '',
        SYB_APPID: '',
		sub_merchants_id: '',
		m_right_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/m_right.png',
		showQR: false, //是否显示商品绑定二维码
    mall_bill_shopping_cart_total_number:0,//购物车数量
    poster_bg_img_url: '', //海报背景图案
    infotips:[{
      title: '123456',
      content: 'skdjhfaslkdjflksdjf;aslkdjf;alkjf;lksdjf;alkdjf',
      img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/bg1.png'
    },
    {
      title: '654321',
      content: '爱上了立刻搭街坊教室里的咖啡机看了电视剧',
      img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/bg2.png'
    },
    {
      title: '342343',
      content: '阿萨微软陪我而疯狂阿里决定离开房间啊我俄军方势力扩大解放今晚i积分建瓯爱问金融i为',
      img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/bg3.png'
    }
    ],
    showCustomise: false,
    main_uid:'',
    detail_uid:'',
    timer:null,
    article_effect_main_id:0,
    wx_pyq_type:0,
    send_customer_id:0,
    is_from_ding:0,
    b_ding_main_show:false,
    ding_select_count:0,
    dingYouList:[],
    ding_select_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ding_select.png',
    ding_not_select_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ding_not_select.png',
    def_avatar_url:'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
    is_fenxiangpengyouquan:0,
    search_svg:'data:image/svg+xml,%3Csvg%20t%3D%221714210353096%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%226272%22%20id%3D%22mx_n_1714210353097%22%20width%3D%2248%22%20height%3D%2248%22%3E%3Cpath%20d%3D%22M1001.472%20917.504L731.136%20647.168c-5.12-5.12-11.264-9.216-17.408-12.288%2049.152-65.536%2078.848-147.456%2078.848-236.544C792.576%20181.248%20616.448%205.12%20399.36%205.12S5.12%20181.248%205.12%20399.36c0%20217.088%20176.128%20394.24%20394.24%20394.24%2089.088%200%20171.008-29.696%20236.544-78.848%203.072%206.144%207.168%2012.288%2012.288%2017.408l270.336%20270.336c23.552%2023.552%2060.416%2023.552%2083.968%200%2022.528-24.576%2022.528-61.44-1.024-84.992zM399.36%20713.728c-174.08%200-315.392-141.312-315.392-314.368%200-174.08%20141.312-315.392%20315.392-315.392S713.728%20225.28%20713.728%20399.36c0%20173.056-141.312%20314.368-314.368%20314.368z%22%20p-id%3D%226273%22%20fill%3D%22%23808080%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
    spec_word_count:0,
    color_word_count:0,
    scan_staff_customer_id:0,
    scan_staff_goods_id:0,
    is_staff_special_commission:0,

    s_article_template_main_page_index: 1,
    s_article_template_main_page_size: 20,
    s_template_key_word:'',
    s_article_type:0,
    b_article_template_main_show:false,
    s_article_template_main_item:{},
    listIndexArticleTemplateMain:-1,
    lstNines:[],
    search_outfit_type:0,
    is_merchant_procurement:0,
    },

    customiseShare(){
      let that = this
      that.closeShareDialog()
      that.showCustomiseDialog()
    },

    showCustomiseDialog(){
      this.setData({
        showCustomise: true,
      })
    },

    closeCustomiseDialog(){
      this.setData({
        showCustomise: false,
      })
    },    

    //随机选海报背景图片
    getRandomImage: function() {
      const images = [
        'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/bg1.png',
        'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/bg2.png',
        'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/bg3.png',
        'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/bg4.png',
        'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/bg5.png'
      ];
      
      const randomIndex = Math.floor(Math.random() * images.length);
      this.setData({
        poster_bg_img_url: images[randomIndex]
      });
    },
    
    showAddtoCart() {
      if(this.data.sku.length==1&&this.data.category_id!=14){
        //只有1个规格直接加入购物车
        this.addToCartWithNoPopWindow();
      }else{
        //未知情况 打开弹窗
        this.setData({
          showAddtoCart: true,
        });
      }     
    },	

    goToSearch(){
      wx.navigateTo({
        url: '/pages/mall/pages/search/search',
      })
    },
    
    showDirectBuy(){
      if(this.data.category_id!=14&&this.data.sku.length==1){
        //只有1个规格直接跳到结算页面 
        this.directBuy()       
      }else{
        //未知情况 打开弹窗
        this.setData({
          showAddtoCart: true,
          directBuy: true
        });
      }     
    },
    
    customerService(){

      var customerInfo = app.globalData.customerInf
      if(!customerInfo){
        wx.showToast({
          title: '请重新获取登陆信息',
          icon:'error',
        })
        return;
      }
      var shop_id=this.data.shop_id;

      if(shop_id<=0){
        wx.showToast({
          title: '店铺id为空',
          icon:'error',
        })
        return;
      }

      console.log(customerInfo);

      var customer_name='';
      var avatar_url='';

      avatar_url=customerInfo.avatarUrl?customerInfo.avatarUrl:'';
      customer_name=customerInfo.name?customerInfo.name:'';
     
      var custInfo={
        avatar_url:avatar_url,
        customer_name:customer_name,
        shop_id:shop_id,
      }
      this.selectMallCsrCustomer_StorepersonnalDataShopId(custInfo);
    },
    selectMallCsrCustomer_StorepersonnalDataShopId(custInfo){

      wx.request({
        url: app.globalData.selectMallCsrCustomer_StorepersonnalDataShopId,	
        //url:'http://localhost:8080/evaluation_war/mall/selectMallCsrCustomer_StorepersonnalDataShopId',
        method: 'POST',
        data: {
          shop_id: custInfo.shop_id,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {                  
          if(res.data.code!=1000){
            console.log(res.data.data);
            wx.showToast({
              title: '失败'+res.data.msg,
              icon:'error'
            })
          }else{

            wx.navigateTo({
              url: '/pages/mall/pages/chatwithcrs/chatwithcrs?custInfo='+JSON.stringify(custInfo)+'&staffInfo='+JSON.stringify(res.data.data),
            })      
           
          }      
        }
      })
    },
    hideAddtoCart(){
      this.setData({
        showAddtoCart: false,
      });
    },
    onLoadSelectMallPlatformMemberInfo(){
      var that=this;
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
              console.log("onLoadSelectMallPlatformMemberInfo:");
              console.log(res.data.data);
              if(res.data.data.is_merchant_procurement){
                that.setData({
                  is_merchant_procurement: Number(res.data.data.is_merchant_procurement),                    
                })
              }
             
            }
        }
       })
    },

    directBuy(){

      console.log("directBuy");

      let that = this        
      let customerInfo = app.globalData.customerInf       
      var selectedSpec=that.data.selectedSpec;

    

      if(customerInfo.id && customerInfo.id > 0){
        //所需参数OK 不处理
      }else{
        that.setData({
          showAddtoCart: false,
          directBuy: false
        })
        wx.showToast({
          title: '请重新打开小程序！',
        })
        return;
      }
        		
      if(that.data.sku.length > 1 && that.data.selectedSKU == ''){			
        wx.showToast({
          title: '请选择具体种类',
          icon: 'none',
          duration: 2000
        })
        return
      }else{
        var selSkuObj=this.data.selectedSKUEntity;
        if(that.data.sku.length==1){
          selSkuObj=that.data.sku[0];
        }

        if(this.data.selectedQuantity>selSkuObj.stock){
          console.log("selectedQuantity:"+this.data.selectedQuantity+" stock:"+selSkuObj.stock);
          wx.showToast({
            title: '库存不足',
            icon:'error',
          })
          return;
        }
         //先发请求看当前用户是否会员，是什么会员
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
  
                if(that.data.category_id!=14&&res.data.data.member_info !=null){
                  that.setData({
                    actual_price_name: res.data.data.member_info.mall_member_level_name + '价',                    
                  })
                  // 是充值会员
                  if(res.data.data.member_info.mall_member_level_tag == 'recharge_member_price'){
                    that.setData({
                      actual_price: that.data.sku_recharge_price ? that.data.sku_recharge_price : that.data.sku[0].recharge_member_price,                    
                    })                    
                  }else{
                    that.setData({
                      actual_price: that.data.sku_vip_price ? that.data.sku_vip_price : that.data.sku[0].vip_member_price,                    
                    })
                  }
                  //实际价格不能为0，所以如果充值会员价和vip价为0，就要用券后价
                  if(that.data.actual_price == 0){
                    that.setData({
                      actual_price_name: '券后价',
                      actual_price: that.data.sku_preferential_price ? that.data.sku_preferential_price : that.data.sku[0].customer_preferential_price,                    
                    })
                  }
                }
                //非会员
                else{
                  that.setData({
                    actual_price_name: '券后价',
                    actual_price: that.data.sku_preferential_price ? that.data.sku_preferential_price : that.data.sku[0].customer_preferential_price,                    
                  })
                }
              }

              if(that.data.category_id==14){
                //大米的价格等单独计算
                //单价
                var actual_price=0;
               
                if(selectedSpec=='一个月'){
                  if(that.data.sku_preferential_price>0){
                    actual_price=that.data.sku_preferential_price;
                  }
                }else if(selectedSpec=='一个季度'){
                  if(that.data.sku_recharge_price>0){
                    actual_price=that.data.sku_recharge_price;
                  }
                }else if(selectedSpec=='半年期'){
                  if(that.data.sku_vip_price>0){
                    actual_price=that.data.sku_vip_price;
                  }
                }else if(selectedSpec=='零售'){
                  if(that.data.product_price>0){
                    actual_price=that.data.product_price;
                  }
                }else{
                  console.log("当前选择397："+selectedSpec)
                      // 如果连券后价都没设，那只能报错
                      wx.showModal({
                        title: '出错',
                        content: '请选择订购期限',
                        showCancel: false
                      })
                      return
                }
                if(actual_price<=0){
                    wx.showModal({
                      title: '出错',
                      content: '价格异常',
                      showCancel: false
                    })
                    return
                }
                that.setData({
                  actual_price_name: selectedSpec+'价',
                  actual_price: actual_price,   
                })  



              }

              
              console.log("that.data.category_id:"+that.data.category_id);
              console.log("that.data.is_merchant_procurement:"+that.data.is_merchant_procurement);
              if(that.data.category_id!=14&&that.data.is_merchant_procurement>0&&that.data.sku_shop_price>0){
                that.setData({
                  actual_price_name:'商家采购价',
                  actual_price: that.data.sku_shop_price,   
                })  
              }


              if(that.data.actual_price == 0){
                // 如果连券后价都没设，那只能报错
                wx.showModal({
                  title: '出错',
                  content: '商品价格出错，请截图发给客服',
                  showCancel: false
                })
                return
              }
             if(app.globalData.card_is_in_activity>0&&that.data.selectedQuantity!=1){
                wx.showModal({
                  title: '出错',
                  content: '抢礼品活动只允许购买数量1',
                  showCancel: false
                })
                return
             }

                var give_customer_color_global_voucher=0;
                var give_customer_color_global_voucher_shop_id=0;
                var give_color_global_total_voucher=0;

                  for(var j=0;j<selSkuObj.lstGiveShop.length;j++){
                    var giveShopObj=selSkuObj.lstGiveShop[j];
                    if(giveShopObj.give_shop_id==8888){
                          give_customer_color_global_voucher_shop_id=giveShopObj.give_shop_id;
                          give_customer_color_global_voucher=giveShopObj.give_customer_color_global_voucher;
                    }
              }

                if(app.globalData.scan_staff_shop_id>0){
                        for(var j=0;j<selSkuObj.lstGiveShop.length;j++){
                          var giveShopObj=selSkuObj.lstGiveShop[j];
                          if(giveShopObj.give_shop_id!=8888&&giveShopObj.give_shop_id==app.globalData.scan_staff_shop_id){
                            give_customer_color_global_voucher_shop_id=giveShopObj.give_shop_id;
                            give_customer_color_global_voucher=giveShopObj.give_customer_color_global_voucher;
                          }
                    }
                }

              give_color_global_total_voucher=give_customer_color_global_voucher*that.data.selectedQuantity;
              //不通过购物车，直接构造一个购物车项出来        
              var shopItem = {
                buyer_id: app.globalData.customerInf.id,
                color: that.data.selectedColor ? that.data.selectedColor : '',
                create_time:'',
                goods_multimedia_url: that.data.multimedia_url,
                goods_sku_id:  that.data.selectedSKU ? that.data.selectedSKU : that.data.sku[0].id,
                
                goods_name: that.data.product_name,
                id:'',
                number: that.data.selectedQuantity,
                price: that.data.product_price,
                actual_price_name: that.data.actual_price_name,
                actual_price: that.data.actual_price,
                preferential_price: that.data.sku_preferential_price ? that.data.sku_preferential_price : that.data.sku[0].customer_preferential_price,
                remark: '',
                shop_id: that.data.shop_id,
                shop_name: that.data.shop_name,
                shop_img: that.data.shop_img,
                spec: that.data.selectedSpec ? that.data.selectedSpec : '',
                delivery_count:that.data.delivery_count,
                delivery_day:that.data.delivery_day,
                delivery_weight:that.data.delivery_weight,
                category_id:that.data.category_id,

                shop_settlement_price_confirm:selSkuObj.shop_settlement_price_confirm,
                shop_settlement_price:selSkuObj.shop_settlement_price,
                average_unit_price:selSkuObj.average_unit_price,
                buy_one_give_more_id:selSkuObj.buy_one_give_more_id,
                buy_one_give_number:selSkuObj.buy_one_give_number,
               // color_global_voucher:selSkuObj.color_global_voucher,
                give_customer_color_global_voucher:give_customer_color_global_voucher,
                give_customer_color_global_voucher_shop_id:give_customer_color_global_voucher_shop_id,
                give_color_global_total_voucher:give_color_global_total_voucher,
                is_buy_gift:selSkuObj.is_buy_gift,
                lstGift:selSkuObj.lstGift,
                lstGiveShop:selSkuObj.lstGiveShop,
                lstForm:that.data.lstForm?that.data.lstForm:[],
                use_star_commission:selSkuObj.use_star_commission,
              }	

              
          



              if(shopItem.buy_one_give_more_id==1||that.data.give_customer_color_global_voucher_shop_id>0){
                shopItem.price=selSkuObj.customer_price;
                shopItem.actual_price=selSkuObj.customer_price;
              }
              console.log(selSkuObj);
              console.log(shopItem);

              var lstMallBillShoppingCart = []
              lstMallBillShoppingCart.push(shopItem)
              var theShop = {
                lstMallBillShoppingCart: lstMallBillShoppingCart,
                //give_customer_color_global_voucher_shop_id:give_customer_color_global_voucher_shop_id,
                shop_id: that.data.shop_id,
                shop_name: that.data.shop_name,
              }
              var theWholeCart = []
              theWholeCart.push(theShop)

              console.log(theWholeCart)

              if(that.data.category_id==14){
                wx.navigateTo({
                  url: '../freshshoppingricebill/freshshoppingricebill?item='+JSON.stringify(theWholeCart)+"&category_id="+that.data.category_id,
                })
              }else{
                wx.navigateTo({
                  url: '../freshshoppingbill/freshshoppingbill?item='+JSON.stringify(theWholeCart)+"&category_id="+that.data.category_id,
                })
              }
              
          }
         })
      }	
      that.setData({
        directBuy: false,
        showAddtoCart: false
      })
    },

    selectGuanz: function () {
        let that = this
        wx.request({
            url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
            data: {
                unionId: this.data.unionId
            },
            success: res => {
                this.setData({
                    checkWxpublic: res.data.list != null && res.data.list != "" && res.data.list.isFocus != '0'
                }, () => {
                    if (that.focusCB) {
                        that.focusCB(true)
                    }
                })
            }
        })
    },

    addToCart: function (e) {
      let that = this        
      let customerInfo = app.globalData.customerInf       
      var selectedSpec=that.data.selectedSpec;

      if(customerInfo.id && customerInfo.id > 0){
        //所需参数OK 不处理
      }else{
        that.setData({
          showAddtoCart: false
        })
        wx.showToast({
          title: '请重新打开小程序！',
        })
        return;
      }
      		
      if(that.data.selectedSKU == ''){			
        wx.showToast({
          title: '请选择具体种类',
          icon: 'none',
          duration: 2000
        })
        return
      }else{       

        let tempSKU =  that.data.selectedSKU
        let tempQuantity = that.data.selectedQuantity
        //先发请求看当前用户是否会员，是什么会员
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
                //是平台的会员
                if(that.data.category_id!=14&&res.data.data.member_info !=null){
                  that.setData({
                    actual_price_name: res.data.data.member_info.mall_member_level_name + '价',                    
                  })
                  //是充值会员
                  if(res.data.data.member_info.mall_member_level_tag == 'recharge_member_price'){
                    if(that.data.sku_recharge_price > 0){
                      that.setData({
                        actual_price: that.data.sku_recharge_price,                    
                      })
                    // 若该商品没有设置充值会员价，即使是会员也只能用券后价
                    } else {
                      that.setData({
                        actual_price_name: '券后价',
                        actual_price: that.data.sku_preferential_price,                    
                      })
                    }
                  // 是vip会员（默认不是充值会员的会员肯定是vip会员，因为只有这两种）  
                  }else{
                    if(that.data.sku_vip_price > 0){
                      that.setData({
                        actual_price: that.data.sku_vip_price,                    
                      }) 
                    // 若该商品没有设置vip会员价，即使是会员也只能用券后价                     
                    } else {
                      that.setData({
                        actual_price_name: '券后价',
                        actual_price: that.data.sku_preferential_price,                    
                      })
                    }                    
                  }
                }
                //非会员
                else{
                  that.setData({
                    actual_price_name: '券后价',
                    actual_price: that.data.sku_preferential_price,                    
                  })
                }
              }

              if(that.data.category_id==14){
                //大米的价格等单独计算
                //单价
                var actual_price=0;
               
                if(selectedSpec=='一个月'){
                  if(that.data.sku_preferential_price>0){
                    actual_price=that.data.sku_preferential_price;
                  }
                }else if(selectedSpec=='一个季度'){
                  if(that.data.sku_recharge_price>0){
                    actual_price=that.data.sku_recharge_price;
                  }
                }else if(selectedSpec=='半年期'){
                  if(that.data.sku_vip_price>0){
                    actual_price=that.data.sku_vip_price;
                  }
                }else if(selectedSpec=='零售'){
                  if(that.data.product_price>0){
                    actual_price=that.data.product_price;
                  }
                }else{

                  console.log("当前选择601："+selectedSpec)
                      // 如果连券后价都没设，那只能报错
                      wx.showModal({
                        title: '出错',
                        content: '请选择订购期限',
                        showCancel: false
                      })
                      return
                }
                if(actual_price<=0){
                    wx.showModal({
                      title: '出错',
                      content: '价格异常',
                      showCancel: false
                    })
                    return
                }
                that.setData({
                  actual_price_name: selectedSpec+'价',
                  actual_price: actual_price,   
                })  
              }


              if(that.data.category_id!=14
                &&res.data.data.is_merchant_procurement>0
                && that.data.sku_shop_price>0
                ){
                  wx.showModal({
                    title: '出错',
                    content: '商家采购商品不允许放入购物车',
                    showCancel: false
                  })
                  return;
              }


             
              // if(that.data.category_id!=14&&res.data.data.is_merchant_procurement>0){
              //   that.setData({
              //     actual_price_name:'商家采购价',
              //     actual_price: that.data.sku_shop_price,   
              //   })  
              // }

              // if(that.data.category_id!=14&&that.data.is_merchant_procurement>0){
              //   that.setData({
              //     actual_price_name:'商家采购价',
              //     actual_price: that.data.sku_shop_price,   
              //   })  
              // }
              if(that.data.actual_price == 0){
                // 如果连券后价都没设，那只能报错
                wx.showModal({
                  title: '出错',
                  content: '商品价格出错，请截图发给客服',
                  showCancel: false
                })
                return
              }

              //成功获取会员信息后，插入购物车                         
              wx.request({
                url: app.globalData.insertMallBillShoppingCart_url,				
                method: 'POST',
                data: {
                  buyer_id: app.globalData.customerInf.id,
                  shop_id: that.data.shop_id,
                  goods_sku_id: tempSKU,
                  goods_name: that.data.product_name,
                  goods_multimedia_url: that.data.sku_img_url ? that.data.sku_img_url : that.data.multimedia_url,
                  price: that.data.product_price,
                  preferential_price: that.data.sku_preferential_price,
                  actual_price_name: that.data.actual_price_name,
                  actual_price: that.data.actual_price,
                  number: tempQuantity,
                  delivery_count:that.data.delivery_count,
                  delivery_day:that.data.delivery_day,
                  delivery_weight:that.data.delivery_weight,
                  category_id:that.data.category_id
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {                  
                  that.selectMallBillShoppingCartTotalNumber();
                  if(res.data.code!=1000){
                    wx.showToast({
                      title: ''+res.data.msg,
                      icon:'error'
                    })
                  }else{
                    wx.showToast({
                      title: '加入购物车成功',
                      duration: 2000
                    })
                  }      
                }
              })
          }
        })        	
		} 

		this.setData({
			showAddtoCart: false,
			selectedColor: '',
			selectedSpec: '',
			selectedSKU: '', 
      selectedQuantity: 1,
		});
    this.initAddCart();
  },

  //不让滑动的动作到原来页面，而是在选购弹出框里滑动
  preventDefault(e) {
    e.preventDefault();
  },

  //直接加购物车
  addToCartWithNoPopWindow: function (e) {
		    let that = this        
        let customerInfo = app.globalData.customerInf     
        //读取选择项
        var selectedSpec=that.data.selectedSpec;
        var category_id=that.data.category_id;

        if(customerInfo.id&&customerInfo.id>0){
          //所需参数OK 不处理
        }else{
          that.setData({
            showAddtoCart: false
          })
          wx.showToast({
            title: '请重新打开小程序！',
          })
          return;
        }

        if(this.data.sku.length!=1){
          wx.showToast({
            title: '规格长度异常！',
          })
          return;
        }

        this.setData({
          selectedSKU: this.data.sku[0].id,
          product_price: this.data.sku[0].customer_price,
          sku_preferential_price: this.data.sku[0].customer_preferential_price,
          sku_vip_price: this.data.sku[0].vip_member_price,
          sku_recharge_price: this.data.sku[0].recharge_member_price,
          sku_platform_cash_commission: this.data.sku[0].platform_cash_commission,
          sku_shop_cash_commission: this.data.sku[0].shop_cash_commission, 
          sku_platform_star_commission: this.data.sku[0].platform_star_commission,  
          sku_shop_star_commission: this.data.sku[0].shop_star_commission,
          sku_use_star_commission:this.data.sku[0].use_star_commission,
          sku_shop_price:this.data.sku[0].shop_price,
          sku_sales_count:this.data.sku[0].sales_count
          
        })	

        let tempSKU =  that.data.selectedSKU
        //先发请求看当前用户是否会员，是什么会员
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
                if(category_id!=14&&res.data.data.member_info !=null){
                  that.setData({
                    actual_price_name: res.data.data.member_info.mall_member_level_name + '价',                    
                  })
                  //是充值会员
                  if(res.data.data.member_info.mall_member_level_tag == 'recharge_member_price'){
                    if(that.data.sku_recharge_price > 0){
                      that.setData({
                        actual_price: that.data.sku_recharge_price,                    
                      })
                    // 没有设充值会员价的商品也只能用券后价  
                    } else {
                      that.setData({
                        actual_price_name: '券后价',
                        actual_price: that.data.sku_preferential_price,                    
                      })
                    }
                  //只有两种会员，不是充值会员就是vip
                  }else{
                    if (that.data.sku_vip_price > 0){ 
                      that.setData({
                        actual_price: that.data.sku_vip_price,                    
                      })
                    // 没有设vip会员价的商品也只能用券后价 
                    } else {
                      that.setData({
                        actual_price_name: '券后价',
                        actual_price: that.data.sku_preferential_price,                    
                      })
                    }
                  }
                }
                //非会员
                else{
                  that.setData({
                    actual_price_name: '券后价',
                    actual_price: that.data.sku_preferential_price,                    
                  })
                }
              }
              if(that.data.category_id==14){
                //大米的价格等单独计算
                //单价
                var actual_price=0;
               
                if(selectedSpec=='一个月'){
                  if(that.data.sku_preferential_price>0){
                    actual_price=that.data.sku_preferential_price;
                  }
                }else if(selectedSpec=='一个季度'){
                  if(that.data.sku_recharge_price>0){
                    actual_price=that.data.sku_recharge_price;
                  }
                }else if(selectedSpec=='半年期'){
                  if(that.data.sku_vip_price>0){
                    actual_price=that.data.sku_vip_price;
                  }
                }else if(selectedSpec=='零售'){
                  if(that.data.product_price>0){
                    actual_price=that.data.product_price;
                  }
                }else{
                      // 如果连券后价都没设，那只能报错
                      console.log("当前选择806："+selectedSpec)
                      wx.showModal({
                        title: '出错',
                        content: '请选择订购期限',
                        showCancel: false
                      })
                      return
                }
                if(actual_price<=0){
                    wx.showModal({
                      title: '出错',
                      content: '价格异常',
                      showCancel: false
                    })
                    return
                }
                that.setData({
                  actual_price_name: selectedSpec+'价',
                  actual_price: actual_price,   
                })  



              }


              if(that.data.actual_price == 0){
                // 如果连券后价都没设，那只能报错
                wx.showModal({
                  title: '出错',
                  content: '商品价格出错，请截图发给客服',
                  showCancel: false
                })
                return
              }

              //成功获取会员信息后，插入购物车  	
              wx.request({
                url: app.globalData.insertMallBillShoppingCart_url,				
                method: 'POST',
                data: {
                  buyer_id: app.globalData.customerInf.id,
                  shop_id: that.data.shop_id,
                  goods_sku_id: tempSKU,
                  goods_name: that.data.product_name,
                  goods_multimedia_url: that.data.multimedia_url,
                  price: that.data.product_price,
                  actual_price_name: that.data.actual_price_name,
                  actual_price: that.data.actual_price,
                  preferential_price: that.data.sku_preferential_price,
                  number: 1,
                  category_id:that.data.category_id,
                },
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  //获取购物车数量
                  that.selectMallBillShoppingCartTotalNumber();
                  if(res.data.code!=1000){
                    wx.showToast({
                      title: '出错:' + res.data.msg,
                      icon:'error'
                    })
                  }else{
                    wx.showToast({
                      title: '加入购物车成功',
                      duration: 2000
                    })
                  }                  
                }
              })
          }
        })

		this.setData({
			showAddtoCart: false,
			selectedColor: '',
			selectedSpec: '',
			selectedSKU: '',       
		});
        
	},
	
	selectColor(e) {
		this.setData({
		  	selectedColor: e.currentTarget.dataset.color,
    });	    
    	
		//判断是否需要选规格，如果不需要，可直接确定sku
		if (this.data.product_spec.length == 0) {
			for(var i = 0; i < this.data.sku.length; i++){
				if(this.data.selectedColor == this.data.sku[i].color){
					this.setData({
            selectedSKU: this.data.sku[i].id,
            selectedSKUEntity:this.data.sku[i],
            selectedGift:this.data.sku[i].lstGift,
            product_price: this.data.sku[i].customer_price,
            sku_preferential_price: this.data.sku[i].customer_preferential_price,
            sku_vip_price: this.data.sku[i].vip_member_price,
            sku_recharge_price: this.data.sku[i].recharge_member_price,
            sku_platform_cash_commission: this.data.sku[i].platform_cash_commission,            
            sku_shop_cash_commission: this.data.sku[i].shop_cash_commission, 
            sku_platform_star_commission: this.data.sku[i].platform_star_commission,  
            sku_shop_star_commission: this.data.sku[i].shop_star_commission, 
            sku_img_url: this.data.sku[i].sku_img_url,
            sku_use_star_commission:this.data.sku[i].use_star_commission,
            sku_shop_price:this.data.sku[i].shop_price,
            sku_sales_count:this.data.sku[i].sales_count
					})					
					break
				}
			}		
		}
		//如果需要，则判断是否已选规格，若已选，也可直接确定sku
		else if (this.data.selectedSpec != ''){
			for(var i = 0; i < this.data.sku.length; i++){
				if(this.data.selectedColor == this.data.sku[i].color && this.data.selectedSpec == this.data.sku[i].spec){
					this.setData({
            selectedSKU: this.data.sku[i].id,
            selectedGift:this.data.sku[i].lstGift,
            selectedSKUEntity:this.data.sku[i],
            product_price: this.data.sku[i].customer_price,
            sku_preferential_price: this.data.sku[i].customer_preferential_price,
            sku_vip_price: this.data.sku[i].vip_member_price,
            sku_recharge_price: this.data.sku[i].recharge_member_price,
            sku_platform_cash_commission: this.data.sku[i].platform_cash_commission,           
            sku_shop_cash_commission: this.data.sku[i].shop_cash_commission, 
            sku_platform_star_commission: this.data.sku[i].platform_star_commission,  
            sku_shop_star_commission: this.data.sku[i].shop_star_commission,
            sku_img_url: this.data.sku[i].sku_img_url,
            sku_use_star_commission:this.data.sku[i].use_star_commission,
            sku_shop_price:this.data.sku[i].shop_price,
            sku_sales_count:this.data.sku[i].sales_count
					})					
					break
				}
			}
		}		
	},
	
	selectSpec(e) {

    var selectedSpec=e.currentTarget.dataset.spec
		this.setData({
		  	selectedSpec: selectedSpec,
    });

    if(this.data.category_id==14){
      this.setData({
        b_14_sel_spec_name:''+selectedSpec,
      })
        if(selectedSpec=='零售'){
          this.setData({
            delivery_day_str:'',
            delivery_day:0,
            delivery_count:0,
            delivery_weight_str:'',
            delivery_weight:0,
            selectedQuantity:1,
            selectedQuantityStr:'1',
          })
      }else{
        this.calRiceDeliveryCount();
        this.calRiceSelectedQuantity();
      }
      
    } 
		//判断是否需要选颜色，如果不需要，可直接确定sku
		if (this.data.product_color.length == 0) {			
			for(var i = 0; i < this.data.sku.length; i++){
				if(this.data.selectedSpec == this.data.sku[i].spec){
          console.log('当前选择的sku');
          console.log(this.data.sku[i]);
					this.setData({
            selectedSKU: this.data.sku[i].id,
            selectedGift:this.data.sku[i].lstGift,
            selectedSKUEntity:this.data.sku[i],
            product_price: this.data.sku[i].customer_price,
            sku_preferential_price: this.data.sku[i].customer_preferential_price,
            sku_vip_price: this.data.sku[i].vip_member_price,
            sku_recharge_price: this.data.sku[i].recharge_member_price,
            sku_platform_cash_commission: this.data.sku[i].platform_cash_commission,
            sku_shop_cash_commission: this.data.sku[i].shop_cash_commission, 
            sku_platform_star_commission: this.data.sku[i].platform_star_commission,  
            sku_shop_star_commission: this.data.sku[i].shop_star_commission,
            sku_img_url: this.data.sku[i].sku_img_url,
            sku_use_star_commission:this.data.sku[i].use_star_commission,
            sku_shop_price:this.data.sku[i].shop_price,
            sku_sales_count:this.data.sku[i].sales_count
					})					
					break
				}
			}		
		}
		//如果需要，则判断是否已选颜色，若已选，也可直接确定sku
		else if (this.data.selectedColor != ''){
			for(var i = 0; i < this.data.sku.length; i++){
				if(this.data.selectedColor == this.data.sku[i].color && this.data.selectedSpec == this.data.sku[i].spec){
					this.setData({
            selectedSKU: this.data.sku[i].id,
            selectedGift:this.data.sku[i].lstGift,
            selectedSKUEntity:this.data.sku[i],
            product_price: this.data.sku[i].customer_price,
            sku_preferential_price: this.data.sku[i].customer_preferential_price,
            sku_vip_price: this.data.sku[i].vip_member_price,
            sku_recharge_price: this.data.sku[i].recharge_member_price,
            sku_platform_cash_commission: this.data.sku[i].platform_cash_commission,
            sku_shop_cash_commission: this.data.sku[i].shop_cash_commission, 
            sku_platform_star_commission: this.data.sku[i].platform_star_commission,  
            sku_shop_star_commission: this.data.sku[i].shop_star_commission,
            sku_img_url: this.data.sku[i].sku_img_url,
            sku_use_star_commission:this.data.sku[i].use_star_commission,
            sku_shop_price:this.data.sku[i].shop_price,
            sku_sales_count:this.data.sku[i].sales_count
					})					
					break
				}
			}
    }	
    //需要等价格设置完毕后计算才准确
    this.calRiceTotal();
  },
  initAddCart(){
    if(this.data.product_color&&this.data.product_color.length>0){
        var e={
          currentTarget:{
            dataset:{
              color:this.data.product_color[0].name
            }
          }
        }
        this.selectColor(e);
    }
    if(this.data.product_spec&&this.data.product_spec.length>0){
      var e={
        currentTarget:{
          dataset:{
            spec:this.data.product_spec[0].name
          }
        }
      }
      this.selectSpec(e);
    }

  },
  showBigImage(){  
    
    let arr = []
    arr.push(this.data.sku_img_url ? this.data.sku_img_url : this.data.multimedia_url)
    wx.previewImage({
      urls: arr,
    })
    
  },

	bindMinus: function () {    
		var num = this.data.selectedQuantity;
		if (num > 1) {
		  num--;
		}
		var minusStatus = num > 1 ? 'normal' : 'disable';
		this.setData({
			selectedQuantity: num,
		  minusStatus: minusStatus
		})  
		 
	},

	bindPlus: function () {   
		var num = this.data.selectedQuantity;
		num++;
		var minusStatus = num > 1 ? 'normal' : 'disable';
		this.setData({
			selectedQuantity: num,
			minusStatus: minusStatus
		})
		
	},	

    refreshAvatar(){
      let that = this 
      if(that.data.id == 0){
        if(!that.data.isFromBuyLoveSet){
          wx.navigateTo({
            url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&setMealID=' + that.data.setMeal[0].setMealID + '&id=' + that.data.id + '&shop_id=' + that.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) + (that.data.DYUid ? '&DYUid=' + that.data.DYUid : ''),
        })
        }else{
          wx.navigateTo({
            url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&setMealID=' + this.data.setMeal[0].setMealID + '&id=' + this.data.id + '&shop_id=' + this.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) +
                '&isFromBuyLoveSet=' + that.data.isFromBuyLoveSet,
        })
        }
      }else if(that.data.id == 1){
        wx.navigateTo({
          url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&coupon_id=' + that.data.coupon_id + '&id=' + that.data.id + '&shop_id=' + that.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) + (that.data.DYUid ? '&DYUid=' + that.data.DYUid : ''),
        })
      }
      
    },

    Mealtap1() {
        var that = this
        app.getManagementDataServlet(this.data.shop_id)
        wx.navigateTo({
            url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&setMealID=' + this.data.setMeal[0].setMealID + '&id=' + this.data.id + '&shop_id=' + this.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) +
                '&isFromBuyLoveSet=' + that.data.isFromBuyLoveSet,
        })
    },

    show_param_img: function (e) { //查看产品属性图片                                       
        wx.previewImage({
			current: e.currentTarget.dataset.src,			 
            urls: [e.currentTarget.dataset.src] 
        })
    },

    //获取商城里的商品详情信息
	getGoodsInfo: function(e){		
		var that = this 		
        wx.request({
            url: app.globalData.selectSingleMallBaseGoods_url,            
            method: 'GET',
            data: {
                goods_id: that.data.goods_id ? that.data.goods_id : '1'
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                console.log("selectSingleMallBaseGoods:")
                var spec_array=res.data.data.lstSpec;
                var spec_word_count=0;
                console.log(spec_array);
                for(var i=0;i<spec_array.length;i++){
                  console.log(spec_array[i].name+' '+spec_array[i].name.length+' '+spec_word_count)
                  if(spec_array[i].name.length>spec_word_count){
                    spec_word_count=spec_array[i].name.length;
                  }
                }

                var color_array=res.data.data.lstColor;
                var color_word_count=0;
                for(var i=0;i<color_array.length;i++){
                  if(color_array[i].name.length>color_word_count){
                    color_word_count=color_array[i].name.length;
                  }
                }

                lstNine=res.data.data.lstNine;

                var lstForm=res.data.data.lstForm;
                

                that.setData({
                category_id:res.data.data.category_id,
                product_name: res.data.data.name,
                img_text_description:res.data.data.img_text_description,
                cut_introduction:res.data.data.cut_introduction,
                multi_media: res.data.data.lstMultimedia,
                product_color: res.data.data.lstColor,
                product_spec: res.data.data.lstSpec,
                product_price: res.data.data.customer_price,
                description_img: res.data.data.lstDescriptionImg,
                sku: res.data.data.lstSKU,
                ship_from: res.data.data.location,
                is_provide_invoices: res.data.data.is_provide_invoices,
                is_seven_without_reason: res.data.data.is_seven_without_reason,
                param_img_url: res.data.data.param_img_url,
                platform_cash_commission: res.data.data.platform_cash_commission,
                shop_cash_commission: res.data.data.shop_cash_commission, 
                platform_star_commission: res.data.data.platform_star_commission,  
                shop_star_commission: res.data.data.shop_star_commission,
                shop_id: res.data.data.shop_id,
                is_in_activity:res.data.data.is_in_activity,
                shop_name: res.data.data.shop_name,
                customer_preferential_price:res.data.data.customer_preferential_price,
                recharge_member_price:res.data.data.recharge_member_price,
                vip_member_price:res.data.data.vip_member_price,
                shop_price:res.data.data.shop_price,
                sales_count:res.data.data.sales_count,
                total_sales_count:res.data.data.total_sales_count,
                use_star_commission:res.data.data.use_star_commission,	
                spec_word_count:spec_word_count,
                color_word_count:color_word_count,
                lstNines:lstNine,
                lstForm:lstForm,
        })

        //that.downLoadNineImg1();

        //显示出赠送最多和提成最多的项
       var use_star_commission=res.data.data.use_star_commission;
       var platform_cash_commission=res.data.data.platform_cash_commission;
       var shop_cash_commission=res.data.data.shop_cash_commission;
       var platform_star_commission=res.data.data.platform_star_commission;
       var shop_star_commission=res.data.data.shop_star_commission;

        var sku=res.data.data.lstSKU;
        if(sku&&sku.length>0){
            for(var i=0;i<sku.length;i++){
              var skuObj=sku[i];
              if(skuObj.use_star_commission>use_star_commission){
                  use_star_commission=skuObj.use_star_commission;
              }
              if(skuObj.platform_cash_commission+skuObj.shop_cash_commission>platform_cash_commission+shop_cash_commission){
                platform_cash_commission=skuObj.platform_cash_commission;
                shop_cash_commission=skuObj.shop_cash_commission;
                platform_star_commission=skuObj.platform_star_commission;
                shop_star_commission=skuObj.shop_star_commission;
              }
            }
        }

        that.setData({
          use_star_commission:use_star_commission,
          platform_cash_commission:platform_cash_commission,
          shop_cash_commission:shop_cash_commission,
          platform_star_commission:platform_star_commission,
          shop_star_commission:shop_star_commission,
        })



       
				var multimedia_url = ''
				for(var i = 0; i < res.data.data.lstMultimedia.length; i++){					
					var item = res.data.data.lstMultimedia[i];
					if(item.multimedia_type == 1){
						multimedia_url = item.url											
						break;
					}
				}
				that.setData({
					multimedia_url: multimedia_url
        })	
        that.initAddCart();
        that.getOtherProducts()
			}
		})
                
	},   
	
	//获取商品评论信息
	//暂时只获取最近的30条
	getComments: function(e){
		var that = this 		
        wx.request({
            url: app.globalData.selectMallBillCommentList_url,            
            method: 'GET',
            data: {
				goods_id: that.data.goods_id ? that.data.goods_id : '1',
				commentator_id: 0,
				page_size: 30,
				page_index: 1,
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
					comments: res.data.data,
					comments_num: res.data.total,
				})
			}
		})
	},

    getUserInfo(shopId) {
        var that = this
        var unionID = app.globalData.unionID
        if (unionID != undefined && unionID != null) {
            wx.request({
                url: app.globalData.UserLogin_url,
                data: {
                    Open_id: unionID,
                    Shop_id: shopId
                },
                success: function (res) {
                    // app.getCustomerInfo(unionID) //获取用户信息
                    if (res.data.result == null || res.data.result.result == 0) {
                        wx.request({
                            url: app.globalData.UserRegistration_url,
                            data: {
                                Head_portrait_img: app.globalData.customerInf.avatarUrl ? app.globalData.customerInf.avatarUrl : "normal",
                                User_nickname: app.globalData.customerInf.name,
                                Wx_openid: unionID,
                                Shop_id: shopId
                            },
                            success: function (res) {
                                app.globalData.user_id = res.data.object.user_id
                                wx.setStorage({
                                    key: "user_id",
                                    data: res.data.object.user_id
                                })
                                that.setData({
                                    user_id: res.data.object.user_id
                                })
                            },
                        })
                    } else {
                        app.globalData.user_id = res.data.object[0].user_id
                        that.setData({
                            user_id: res.data.object[0].user_id
                        })
                        wx.setStorage({
                            key: "user_id",
                            data: res.data.object[0].user_id
                        })
                    }
                }
            })
        } else {
            console.log("你的unionId为undefined或null")
        }

    },   

    file: function (e) {
        var that = this
        var index = e.currentTarget.dataset.index
        that.setData({
            file_id: index,
        });
        if (index == 0) {
            that.setData({
                godappraise: -1,
                godappraise1: 6
            })
            that.selectAllEvaluation()
        } else if (index == 1) {
            that.setData({
                godappraise: 3,
                godappraise1: 6,
            })
            that.selectAllEvaluation()
        } else if (index == 2) {
            that.setData({
                godappraise: -1,
                godappraise1: 4,
            })
            that.selectAllEvaluation()
        } else {
            that.selectPicevaluation()
        }
    },

    selectAllEvaluation: function (res) {
        var that = this
        if (that.data.id == 0) {
            var dishes_id = that.data.setMealID
        } else {
            var dishes_id = that.data.coupon_id
        }
        wx.request({
            url: app.globalData.taocan.select_evaluation_url,
            // url: 'http://localhost:8088/evaluation/select_evaluation',
            data: {
                "shop_id": that.data.shop_id,
                "assess_surport": that.data.godappraise,
                "assess_surport1": that.data.godappraise1,
                // "dishes_id": dishes_id
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
                that.setData({
                    evaluations: res.data
                })
            }
        })
    },

    selectPicevaluation: function (res) {
        var that = this
        if (that.data.id == 0) {
            var dishes_id = that.data.setMealID
        } else {
            var dishes_id = that.data.coupon_id
        }
        wx.request({
            url: app.globalData.taocan.select_evaluation_url,
            // url: 'http://localhost:8088/evaluation/select_evaluation',
            data: {
                "shop_id": that.data.shop_id,
                "isImage": 1,
            },
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
                that.setData({
                    evaluations: res.data
                })
            }
        })
    },

    select_numvaluation: function (res) {
        var that = this

        wx.request({
            url: app.globalData.taocan.select_numvaluation_url,           
            data: {},
            header: {
                'content-type': 'application/json'
            },
            method: 'POST',
            success: function (res) {
                that.setData({
                    numvaluation: res.data
                })
            }
        })
    },      

    scroll: function(e) {
        const scrollPositions = ['basics', 'comments', 'details', 'recommend'];
		const scrollTop = e.detail.scrollTop;
		const windowHeight = e.detail.scrollHeight;
		const menuHeight = windowHeight / scrollPositions.length;
		const currentIndex = Math.floor(scrollTop / menuHeight);

		this.setData({
			currentTab: scrollPositions[currentIndex]
		});
    },

	scrollToSection: function(e) {
		const tab = e.currentTarget.dataset.tab;
		this.setData({
		  currentTab: tab
		});	
    
    if(tab=='search'){
        this.goToSearch();
    }else if(tab=='shop'){
        this.goToShop();
    }else{
      wx.pageScrollTo({
        selector: '#' + tab,
        duration: 500
      });
    }
		
	},	
	
	inputChange: function(e) {
		this.setData({
		  inputValue: e.detail.value
		});
	},
	
	search: function() {
		const value = this.data.inputValue;
		// 执行搜索操作
		
	},

    /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {
    
    console.log("app.getServerUrl():"+app.getServerUrl());
    var that = this; 

    var search_outfit_type=0;
    if(options.search_outfit_type){
      search_outfit_type=Number(options.search_outfit_type);
      this.setData({
        search_outfit_type:search_outfit_type,
      })
    }
    
    console.log("Mechandise_details:"+options);
    console.log(options);

    


    if(options.is_from_ding){
      this.setData({
        is_from_ding:Number(options.is_from_ding),
      })
    }
    if(options.card_is_in_activity){
      this.setData({
        card_is_in_activity:Number(options.card_is_in_activity),
      })
      app.globalData.card_is_in_activity=this.data.card_is_in_activity;
    }
    if(this.data.card_is_in_activity==1){
      this.setData({
        is_in_activity_dlg_show:1,
      })
    }

    if(options.wx_pyq_type){
        this.setData({
          main_uid:options.main_uid,
          wx_pyq_type:Number(options.wx_pyq_type),
          send_customer_id:Number(options.send_customer_id),
      });

        this.setData({
          wx_pyq_type:Number(options.wx_pyq_type),
        })
        if(this.data.wx_pyq_type>0){
          this.insertOrUpdateMallBaseArticleEffectDetailCheck();
          this.init_timer();
        }
      }
    
    console.log('Merchandise_details 场景值：'+wx.getLaunchOptionsSync().scene);
		if (options.q) {		
      let url = decodeURIComponent(options.q)      
			console.log('url' + url)
			if (url.indexOf('https://') != -1 && url.indexOf('?bind_type=') != -1) {			
				let str1 = decodeURIComponent(url).substring(decodeURIComponent(url).indexOf('?bind_type='))        
				let a = JSON.parse(str1.replace(/\?/g, "{\"").replace(/=/g, "\":\"").replace(/&/g, "\",\"") + "\"}")				
        that.setData({
          goods_id: Number(a.goods_id),
          scan_staff_goods_id:Number(a.goods_id),
        })

        var is_staff_special_commission=Number(a.is_staff_special_commission);
        var scan_staff_shop_id=Number(a.scan_staff_shop_id);

        app.globalData.scan_staff_goods_id=that.data.goods_id;
        app.globalData.is_staff_special_commission=is_staff_special_commission;
        app.globalData.scan_staff_shop_id=scan_staff_shop_id;
        

        if(app.globalData.enter_shop_id_inited==false){
          app.globalData.enter_shop_id=Number(options.shop_id);
          that.setData({enter_shop_id:app.globalData.enter_shop_id})
        }
        app.globalData.scan_staff_customer_id=Number(a.associate_id);
        that.setData({                
          associate_id: Number(a.associate_id),
          scan_staff_customer_id:Number(a.associate_id),
          is_staff_special_commission:Number(a.is_staff_special_commission),
					associate_type: Number(a.associate_type),
					bind_type: Number(a.bind_type),
					shop_id: Number(a.shop_id),  
					goods_id: Number(a.goods_id)              
				}, () => {
          that.selectUnionIDAndBind();
				})
      }  
     
		}     

        if (options.clip) {
            if (wx.getStorageSync('clip')) {
                wx.removeStorageSync('clip')
                wx.setClipboardData({
                    data: ' ',
                    complete: res => {
                        wx.hideToast({
                            success: (res) => {},
                        })
                    }
                })
            } else {
                wx.setStorageSync('clip', options.clip)
            }
        } else {
            if (wx.getStorageSync('clip')) {
                wx.removeStorageSync('clip')
                wx.setClipboardData({
                    data: ' ',
                    complete: res => {
                        wx.hideToast({
                            success: (res) => {},
                        })
                    }
                })
            }
        }
        if (options.moreInf != null) { //订单详情跳转
            that.setData({
                moreInf: false
            })
        }  		

		if(options.goods_id){
			that.setData({
				goods_id: options.goods_id
			})
		}

        if (options.bind_type) {
          if(app.globalData.enter_shop_id_inited==false){
            app.globalData.enter_shop_id=Number(options.shop_id);
            that.setData({enter_shop_id:app.globalData.enter_shop_id})
          }
          that.setData({                
            associate_id: options.associate_id,
            associate_type: options.associate_type,
            bind_type: options.bind_type,
            shop_id: options.shop_id,                
          }, () => {				
            that.selectUnionIDAndBind()
            // if (!app.globalData.unionID) {
            //   //同步异步问题，            
            //   that.selectUnionIDAndBind()
            //   // that.getUnionIDCallBack = (bool) => {
            //   //     if (bool) {
            //   //         console.log("成功获取unionID");
            //   //         that.bindCustomer(app.globalData.unionID)
            //   //     }
            //   // }
            // } else {
            //   that.bindCustomer(app.globalData.unionID)                   
				    // }
				
          })
        }
        
        if (options.DYUid) {
            this.setData({
                DYUid: options.DYUid
            })
        }
        if (options.fromMenu) {
            that.setData({
                fromMenu: true,
                ticket_order_id: options.orderId,
            })
        }
        setTimeout(function () { //创建节点选择器
            var query = wx.createSelectorQuery();
            query.select('#xxx').boundingClientRect()
            query.exec(function (res) {
                //res就是 所有标签为mjltest的元素的信息 的数组
                console.log(res);
                //取高度
                //console.log(res[0].height);
                console.log(wx.getSystemInfoSync().windowHeight)
                console.log(Math.round((wx.getSystemInfoSync().windowHeight) / (res[0].height)))
                if (Math.round((wx.getSystemInfoSync().windowHeight) / (res[0].height)) <= 6) {
                    that.setData({
                        show_rule: true
                    })
                }
            })
        }, 500)

        that.getGoodsInfo() 		
        that.getComments() 
        that.onLoadSelectMallPlatformMemberInfo();
  },
  
  goToShop(){      
    wx.navigateTo({
      url: '/pages/mall/pages/shop_details/shop_details?shop_id=' + this.data.shop_id + '&shop_name=' + this.data.shop_name + '&shop_img=' + this.data.shop_img
    })    
  },
	
	bindCustomer(unionID){    
    if(unionID){
    }else{
      this.showMsg("unionID为空");
    }

		let that = this
		wx.request({
			url: app.globalData.insertMallBindRecord_url,                               
			data: {   
				shop_id: that.data.shop_id,
				bind_type: that.data.bind_type,
				associate_type: that.data.associate_type,
				associate_id: that.data.associate_id,
				goods_id: that.data.goods_id,						
				target_union_id: unionID,
			},
			method: 'POST',
			header: {
				'content-type': 'application/json' // 默认值
			},
			success: res => {
        // if(res.data.code==1000){

        //   wx.showToast({
        //     title: '绑定成功',
        //   })

        // }else{

        //   that.showMsg(res.data.msg);
        // }
				
			},
			fail: res=>{
        that.showMsg("网络异常");
			   console.log("绑定失败:" + res.data.msg)
			}
		})
  },
    selectUnionIDAndBind: function () {
        var that = this
        wx.login({
            success: function (res) {
                if (res.code) {
                    var code = res.code
                    wx.getUserInfo({
                        success: function (res) {
                            wx.request({
                                url: app.globalData.allUrl.getUnionID,
                                data: {
                                    code: code,
                                    encryptedData: res.encryptedData,
                                    iv: res.iv,
                                    wechatAppId: app.getWechatAppId(),
                                },
                                header: {
                                    'content-type': 'application/json;charset=utf-8' // 默认值
                                },
                                method: 'POST',
                                success: function (res) {
                                    app.globalData.unionID = res.data.data.unionId
                                    app.globalData.openid = res.data.data.openid
                                    var customerInfo=res.data.data.customer;
                                      console.log('customerInfo:');
                                      console.log(customerInfo);
                                      app.globalData.caustomerId = customerInfo.id
                                      app.globalData.customerInf = customerInfo
                                      app.globalData.user_phone = customerInfo.phone
                                      app.globalData.user_name = customerInfo.name
                                      
                                      that.bindCustomer(app.globalData.unionID)
                                }
                            })
                        },
                        fail: function (res) {
                            console.log('获取unionId失败，用户未授权')
                        },
                    })
                }
            }
        })
    },
   

    selectUnionIDAndBindCustomerAndNav: function () {
        var that = this
        wx.login({
            success: function (res) {
                if (res.code) {
                    var code = res.code
                    wx.getUserInfo({
                        success: function (res) {
                            wx.request({
                                url: app.globalData.allUrl.getUnionID,
                                data: {
                                    code: code,
                                    encryptedData: res.encryptedData,
                                    iv: res.iv,
                                    wechatAppId: app.getWechatAppId(),
                                },
                                header: {
                                    'content-type': 'application/json;charset=utf-8' // 默认值
                                },
                                method: 'POST',
                                success: function (res) {
                                    app.globalData.unionID = res.data.data.unionId
                                    app.globalData.openid = res.data.data.openid
                                    insertBindCustomerRecordAndNav();
                                }
                            })
                        },
                        fail: function (res) {
                            console.log('获取unionId失败，用户未授权')
                        },
                    })
                }
            }
        })
	},
	
    insertBindCustomerRecordAndNav(){
      var that=this;
            wx.request({
              url: app.globalData.insertBindCustomerRecord,
              data: {
                  shop_id: parseInt(that.data.bind_shop_id),
                  bind_type: parseInt(that.data.bind_type),
                  bind_person_type: that.data.bind_staf_id ?1:2,
                  bind_person_id: that.data.bind_staf_id ? parseInt(that.data.bind_staf_id) : parseInt(that.data.bind_customer_id),
                  bind_person_name: that.data.bind_person_name,
                  customer_code: app.globalData.customerInf.userCode,
                  customer_name: app.globalData.customerInf.name,
                  customer_id: app.globalData.customerInf.id,
                  meals_id: parseInt(that.data.bind_meals_id),
                  meals_type: parseInt(that.data.bind_meals_type),
                  customer_unionId: app.globalData.unionID,
              },
              method: 'POST',
              header: {
                  'content-type': 'application/json' // 默认值
              },
              success: res => {
                  wx.navigateTo({
                    url: '../order/order?inviteOpenId=' + that.data.inviterOpenid + '&setMealID=' + that.data.setMeal[0].setMealID + '&id=' + that.data.id + '&shop_id=' + that.data.shop_id + '&SYB_APPID=' + that.data.SYB_APPID + '&cusid=' + that.data.cusid + '&sub_merchants_id=' + that.data.sub_merchants_id + '&customerInf=' + JSON.stringify(that.data.customerInf) + (that.data.DYUid ? '&DYUid=' + that.data.DYUid : ''),
                });
  
              },
              fail: res=>{
                console.log("绑定失败");
              }
          })
  
    },
  
    getOpenIdByCustomerId(customerId) { //通过customerId获取openid
        wx.request({            
            url: app.globalData.allUrl.getOpenIdByCustomerId_url,
            data: {
                customerId: customerId,
            },
            success: res => {
                if (res.data.code == 1) {
                    this.setData({
                        inviterOpenid: res.data.openId,
                    })
                    app.globalData.loveInviterOpenid = res.data.openId;
                }
            }
        })
    },

    getShopDescription(shopId) {
        let that = this
        wx.request({
            url: app.globalData.selectShopDescribes_url,        
            method: 'POST',
            data: {                
                shop_id: shopId                
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                    shop_description: res.data.data.describes,
                })                
            }
        })
    },    

    getOtherProducts() {
        let that = this
        wx.request({
            url: app.globalData.selectMallBaseGoodsList_url,        
            method: 'POST',
            data: {                
                shop_id: app.globalData.is_video_show ? that.data.shop_id : 19318,    
                category_id: 0,           
                page_size: 30,  //hardcode成每次拿30个
                page_index: 1              
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if(res.data.code == 1000){
                    that.setData({
                        other_products: res.data.data,
                    })
                }                                
            }
        })
    },

	goToCart(){
		wx.navigateTo({
			url: '../freshshoppingcart/freshshoppingcart',
		})
	},

    toDetail(e) {      
        let a = e.currentTarget.dataset.item      
        wx.navigateTo({
            url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + a.id
        })  
    },
    toOutfit(e) {  
      var goods_img_url=e.currentTarget.dataset.goods_img_url;
      var outfit_type=Number(e.currentTarget.dataset.outfit_type);
      var goods_id=this.data.goods_id;
      var shop_id=this.data.shop_id;
      var goods_name=this.data.product_name;

      console.log(outfit_type);
      console.log(goods_img_url);

      var search_outfit_type=this.data.search_outfit_type;
      console.log(search_outfit_type);
      if(search_outfit_type>0){
        if(search_outfit_type==1){
           if(outfit_type!=1&&outfit_type!=3&&outfit_type!=4){
             wx.showToast({
               title: '只能选择上衣连衣裙上下套装',
               icon:'none'
             })
            return;
           }

         
        }
        if(search_outfit_type==2){
          if(outfit_type!=2&&outfit_type!=4){
            wx.showToast({
              title: '只能选择下衣上下套装',
              icon:'none'
            })
           return;
          }
          
        }

        let pages = getCurrentPages(); //获取当前界面的所有信息
        console.log(pages);
        if(pages.length<3){
          return;
        }
        var prePage= pages[pages.length - 3];
        if(prePage){
            if(prePage.route){
                
                if(prePage.route.indexOf('pages/outfit/outfit')>=0){

                console.log("查找到试衣界面")
                
               
                prePage.setOutfitData(search_outfit_type,outfit_type,goods_id,shop_id,goods_name,goods_img_url);
                wx.navigateBack({delta:2});
                }

            }
        }
      }else{
        wx.navigateTo({
          url: '/pages/mall/pages/outfit/outfit?outfit_type='+outfit_type+'&goods_id='+goods_id+'&shop_id='+shop_id+'&goods_img_url='+goods_img_url+'&goods_name='+goods_name,
        })
      }    
      
  },
    selectFocus() {
        let that = this
        wx.request({
            url: 'https://mb.fsmbdlkj.com/wxpublic/WXPublic/getList', //公众号关注固定正式库
            data: {
                unionId: app.globalData.unionID
            },
            success: res => {
                if (res.data.list != undefined && res.data.list != "" && res.data.list.isFocus != '0') {
                    console.log("关注成功")
                    wx.request({ //已经关注后绑定关系
                        url: app.globalData.bindingRelationship_Url,
                        data: {
                            primaryBindingOpenId: that.data.inviterOpenid,
                            passiveBindingOpenId: that.data.openid,
                            shopId: that.data.shop_id ? that.data.shop_id : 0,
                        },
                    })                    
                }
            }
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
      
      this.selectMallBillShoppingCartTotalNumber();
      this.setData({
        is_video_show:app.globalData.is_video_show,
        scan_staff_goods_id:app.globalData.scan_staff_goods_id,
        scan_staff_customer_id:app.globalData.scan_staff_customer_id,
        card_is_in_activity:app.globalData.card_is_in_activity,
        is_staff_special_commission:app.globalData.is_staff_special_commission,
      })    
      if(app.globalData.enter_shop_id_inited==true&&app.globalData.enter_shop_id>0){
        if(app.globalData.openid){
          app.insertMemberInfoExec(app.globalData.enter_shop_id,app.globalData.openid)
        }
      }
    },
    

    onShareAppMessage: function (e) {

        var that = this;

        var is_in_activity=this.data.is_in_activity;
        that.closeShareDialog();        
        var title = '推荐一个好东西给你：' + that.data.product_name;
        var card_is_in_activity=0;
        if(is_in_activity==1){
          title="[抢礼品活动]："+ that.data.product_name;
          card_is_in_activity=1;
        }
        var imgUrl = that.data.multimedia_url;
  
        let shareObj = {
            title: title,
            path: 'pages/module_discount/pages/Merchandise_details/Merchandise_details?bind_type=3&associate_type=2&' + 
            'shop_id=' + that.data.shop_id + '&associate_id=' + app.globalData.customerInf.id +
            '&goods_id=' + that.data.goods_id+'&card_is_in_activity='+card_is_in_activity,
            imageUrl: imgUrl,
            success: function (res) {
                if (res.errMsg == 'shareAppMessage:ok') {
                    that.hide();
                }
                wx.showToast({
                  title: '发送成功！',
                })
            },
            fail: function (res) {
                if (res.errMsg == 'shareAppMessage:fail cancel') {
                    that.hide();
                } else if (res.errMsg == 'shareAppMessage:fail') {
                    that.hide();
                }
            },
        };              
        
        return shareObj;
	},

	closeQRCode(){
		this.setData({
			showQR: false
		})
		this.closeShareDialog()
	},
	
	showQRCode(is_staff_special_commission,scan_staff_shop_id) {           
    this.setData({
        showQR: true,
    }, () => {
        wx.showLoading({
            title: '生成中...',
        })
    })
    this.closeShareDialog();
		let qrt = app.getServerUrl()+'/QRCodeToDetail/?bind_type=3&associate_type=2&shop_id=' + this.data.shop_id + 
		'&associate_id=' + app.globalData.customerInf.id + '&goods_id=' + this.data.goods_id+'&is_staff_special_commission='+is_staff_special_commission+'&scan_staff_shop_id='+scan_staff_shop_id	
    require('../../../../utils/qrcode.min.atim.js')({
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      canvasId: 'productQrcode',
      typeNumber: 13,
      text: qrt,
      image: {
          imageResource:'',
          dx: 70,
          dy: 70,
          dWidth: 60,
          dHeight: 60
      },
      callback(e) {                    
          wx.hideLoading({
              success: (res) => {},
          })
      }
  })
    
    
    // wx.downloadFile({
    //     url: 'https://mb.fsmbdlkj.com/IMG/%E5%88%87%E7%93%9C%E5%88%87%E8%8F%9C/logo.png',
    //     success: res => {            
            
    //     }
    // })
  },


  showQRCodeToMallGuide() {           
    this.setData({
        showQR: true,
    }, () => {
        wx.showLoading({
            title: '生成中...',
        })
    })
		let qrt = app.getServerUrl()+'/QRCodeToMallGuide?is_give_vip=1'		
    require('../../../../utils/qrcode.min.atim.js')({
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      canvasId: 'productQrcode',
      typeNumber: 13,
      text: qrt,
      image: {
          imageResource:'',
          dx: 70,
          dy: 70,
          dWidth: 60,
          dHeight: 60
      },
      callback(e) {                    
          wx.hideLoading({
              success: (res) => {},
          })
      }
  })
    
    
    // wx.downloadFile({
    //     url: 'https://mb.fsmbdlkj.com/IMG/%E5%88%87%E7%93%9C%E5%88%87%E8%8F%9C/logo.png',
    //     success: res => {            
            
    //     }
    // })
  },

    shareSelect(e){
        console.log(e)
        this.setData({
            shareDialog:true,
            shareTimeLineE: e
        })
	},
	
    closeShareDialog(){
        this.setData({
            shareDialog:false,
        })
    },

    shareTimeLine(e){
        this.closeShareDialog()
        this.setData({
          is_fenxiangpengyouquan:1,
        })

        wx.showShareMenu({
          withShareTicket:true,
          menus:['shareAppMessage','shareTimeline']
          })
          
    },   
    
    generatePosterClick_ToResult(e){
      this.closeShareDialog()
        this.setData({
          b_article_template_main_show:true,
        })
    },
    generatePosterClick_ToDetail(e){
     
       //普通海报，跳转到详情页
       this.closeShareDialog();
       this.setData({
        b_article_template_main_show:false,
        showIndex: e.currentTarget.dataset.index,
        showShareImageWindow: true,
      })        
      this.generatePoster(e);
    },
    generatePoster(e) {
      
      let that = this     
      wx.createSelectorQuery()
        .select('#canvas')
        .fields({
          node: true,
          size: true,
        })
        .exec(res => {
          const canvas = res[0].node
          var ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio
          console.log(dpr)
          const width = res[0].width
          const height = res[0].height
          canvas.width = width * dpr
          canvas.height = height * dpr
          ctx.scale(dpr, dpr)
  
          let imgUrl = 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/sszg/0' + (Math.ceil(Math.random() * 7)) + '.png';
  
          wx.downloadFile({
            url: imgUrl,
            success: res => {
              let img2 = canvas.createImage()
              img2.src = res.tempFilePath
              new Promise((a, b) => {
                img2.onload = () => {
                  ctx.drawImage(img2, 0, 0, 621, 1099)
                  ctx.fillStyle = 'rgb(255, 255, 255)';
                  ctx.fillRect(430, 780, 210, 210);
                  a()
                }
              }).then(res => {
                that.getRandomImage()
                wx.downloadFile({
                  url: that.data.poster_bg_img_url,
                  success: res => {
                    let img = canvas.createImage()
                    img.src = res.tempFilePath
                    new Promise((a, b) => {
                      img.onload = () => {
                        //分享模板图
                        ctx.drawImage(img, 0, 0, 621, 1099)
                        
                        let imgUrl2 = that.data.multimedia_url
  
                        wx.downloadFile({
                          url: imgUrl2,
                          success: res =>{
                            let img3 = canvas.createImage()
                            img3.src = res.tempFilePath;
  
                            new Promise((a,b) =>{
                              img3.onload = () =>{
                                ctx.drawImage(img3, 20, 20, 581, 581);
  
                                //分享标题
                                if (that.data.shareImageTitle) {
                                  // ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                                  // ctx.fillRect(20, 100, 581, 60);
                                  ctx.font = "60px nainao"
                                  ctx.textAlign = "center"
                                  ctx.fillStyle = "#FFFFFF"
                                  ctx.fillText(that.data.shareImageTitle, 310.5, 160)
                                  ctx.fillText(that.data.shareImageTitle, 311, 160.5)
                                }
  
                                a()
                              }
                            }).then(res =>{
                              //分享内容
                              if (that.data.shareImageDetail) {
                                for (let i = 0; i < that.data.shareImageDetail.length; i++) {
                                  const element = that.data.shareImageDetail[i];
                                 
                                  ctx.font = "50px nainao"
                                  ctx.textAlign = "left"
                                  ctx.fillStyle = that.data.currentBlockColor
                                  ctx.fillText(element, 100, (225 + (i * 30)))
                                  ctx.fillText(element, 100.5, (225.5 + (i * 30)))
                                }
                              }else{
                                ctx.font = "45px nainao"
                                ctx.textAlign = "left"
                                ctx.fillStyle = that.data.currentBlockColor  
                                
                              }
                            })
                          }
                        })
  
                        //阴影
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                        ctx.fillRect(0, 630, 621, 510);
                        
                        ctx.font = "bold 36px SimHei"
                        ctx.textAlign = "left"
                        ctx.fillStyle = "#FFFFFF"
                        let product_name2 = ""
                        let product_name = that.data.product_name                       
                        
                        if (ctx.measureText(product_name).width > 587) {
                          product_name2 = product_name.slice(16)
                          product_name = product_name.substring(0, 16)
                        }                       
                        
                        ctx.fillText(product_name, 20, 686)                       

                        if (product_name2 != "") {
                          ctx.fillText(product_name2, 20, 736)                          
                        }                        
  
                        ctx.font = "bold 45px SimHei"
                        ctx.textAlign = "left"
                        ctx.fillStyle = "white"  
                       
                        ctx.fillText('￥' + that.data.product_price + "元", 35, 791)

                        ctx.font = "bold 36px SimHei"
                        ctx.textAlign = "left"
                        ctx.fillStyle = "white"  

                        ctx.fillText('券后价:' + '￥' + that.data.customer_preferential_price + "元", 35, 841)
                        ctx.fillText('充值会员价:' + '￥' + that.data.recharge_member_price + "元", 35, 891)
                        ctx.fillText('VIP价:' + '￥' + that.data.vip_member_price + "元", 40, 941)                                            
                       
  
                        ctx.font = "bold 36px SimHei"
                        let text = (that.data.platform_cash_commission > 0 ? that.data.platform_cash_commission + '元[平台现金]' : that.data.platform_star_commission > 0 ? that.data.platform_star_commission + '元[平台星盾]' : '') + (that.data.shop_cash_commission > 0 ? that.data.shop_cash_commission + '元[商家现金]' : that.data.shop_star_commission > 0 ? that.data.shop_star_commission + '元[商家星盾]' : '')
                        if (text != '') {
                          ctx.fillText("提成:" + text, 35, 991)                          
                        }  
                        
                        ctx.font = "36px SimHei"
                        ctx.textAlign = "left"
                        ctx.fillStyle = "#FFFFFF"                        
                        ctx.fillText('长按二维码进入弹叮商城购买', 20, 1060)
                                            
                        a()
                      }
                    }).then(res => {
                     
                      var qr_url=''+app.getServerUrl()+'/QRCodeToDetail/?bind_type=3&associate_type=2&shop_id=' + this.data.shop_id + 
                      '&associate_id=' + app.globalData.customerInf.id + '&goods_id=' + this.data.goods_id;

                      console.log(qr_url);

                      new QRCode('myQrcode', {
                        text: qr_url,
                        width: 180, //canvas 画布的宽
                        height: 180, //canvas 画布的高
                        padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
                        correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
                        colorDark: "#000000", //分别为两种交替颜色
                        colorLight: "#FFFFFF",
                        callback: (e) => {  
                          
                          console.log(e)
                          wx.canvasToTempFilePath({
                            x: 0,
                            y: 0,
                            width: 300,
                            height: 300,
                            destWidth: 300,
                            destHeight: 300,
                            canvasId: 'myQrcode',
                            success(res) {
                              console.log(res)
                              let img3 = canvas.createImage()
                              img3.src = res.tempFilePath
                              new Promise((a, b) => {
                                img3.onload = () => {
                                  ctx.drawImage(img3, 411, 815, 200, 200)
                                  a()
                                }
                              }).then(res => {
                                wx.canvasToTempFilePath({
                                  x: 0,
                                  y: 0,
                                  width: 621 * wx.getSystemInfoSync().pixelRatio,
                                  height: 1099 * wx.getSystemInfoSync().pixelRatio,
                                  destWidth: 621,
                                  destHeight: 1099,
                                  canvas: canvas,
                                  success: res2 => {
                                    wx.hideLoading()
                                    that.setData({
                                      showPoster: true,
                                      loadImagePath: res2.tempFilePath,
                                    });
                                    
                                    that.uploadShareCardFile(res2.tempFilePath,1)
                                  }
                                })
                              })
                            }
                          })
                        }
                      })
                      
                    })
                  }
                })
              })
            }
          })
        })
      
      wx.showLoading({
        title: '正在加载...',
        mask: true
      })      
    },   
    uploadShareCardFile(e,f){
      let that = this;
      wx.uploadFile({
        url: app.globalData.UploadAliYunFile,
        filePath: e,
        name: 'file',
        success: res=>{
          let result = JSON.parse(res.data);
          if (result.lst[0].success) {
            let url = result.lst[0].url;
            let poster_url = that.data.poster_url;
            let video_url = that.data.temporaryVideo;
  
            that.setData({
              poster_url: f == 1 ? url : poster_url,
              video_url: video_url
            },()=>{
              if(f == 1 && !that.data.shareCardInf){
                that.addShareCardInf();
              }else if(f == 1 && that.data.shareCardInf){
                that.updateShareCardInf()
              }
            })
          }
        }
      })
    },
  
    addShareCardInf(){
      let that = this;
      var article_template_main_item=this.data.article_template_main_item;

      let data = {
        shop_id: article_template_main_item.shop_id,
        poster_url: that.data.poster_url,
        video_url: that.data.video_url
      }
  
      wx.request({
        url: app.globalData.addShareCardInf,
        method: 'POST',
        data: data,
        success: res=>{
          if(res.data.code == 1){
            let shareCardInf = res.data.data;
            that.setData({
              shareCardInf
            })
          }
        }
      })
    },
  
    updateShareCardInf(){
      let that = this;
      let data = {
        id: that.data.shareCardInf.id,
        poster_url: that.data.poster_url,
        video_url: that.data.video_url
      }
  
      wx.request({
        url: app.globalData.updateShareCardInf,
        method: 'POST',
        data: data,
        success: res=>{
          if(res.data.code == 1){
            console.log('updateShareCardInf is success');
          }else{
            console.log('updateShareCardInf is fail');
          }
        }
      })
    },
    
    uploadImageOrVideo(){
      let that = this;
      wx.chooseMedia({
        count: 1,
        success: res1=>{
          let filePath = res1.tempFiles[0].tempFilePath;
  
          wx.uploadFile({
            filePath: filePath,
            name: 'file',
            url: app.globalData.UploadVideo_url,
            formData: {
              oldUrl: '',
            },
            success: res => {
              let a = JSON.parse(res.data);
              if(a.object){
                that.setData({
                  temporaryImage: res1.tempFiles[0].fileType == 'image' ? a.object : '',
                  temporaryVideo: res1.tempFiles[0].fileType == 'video' ? a.object : '',
                  temporaryImageOfVideo: res1.tempFiles[0].fileType == 'video' ? (a.object + '?x-oss-process=video/snapshot,t_1000,f_jpg,w_500,h_400,m_fast') : ''
                })
              }else{
                wx.showModal({
                  title: '提示',
                  content: '文件过大，上传失败',
                  showCancel: false
                })
              }
            }
          })
        }
      })
    },

    cancelTemporaryImage(){
      let that = this;
      that.setData({
        temporaryImage: '',
        temporaryVideo: '',
        temporaryImageOfVideo: '',
        loadImagePath: '',
        loadImagePath1: '',
      })
    },

    shareImageConfirm() {
      this.setData({
        showShareImageWindow: false,
        isShareToPYQ: true
      }, () => {
        this.onShare(this.data.shareTimeLineE)
      })
    },

    shareImageConfirm1() {
      this.setData({
        // showShareImageWindow: false,
        isShareToPYQ: true
      }, () => {
        this.onShare1(this.data.shareTimeLineE)
      })
    },

    tips(){
      wx.showModal({
        title: '提示',
        content: '请先确认生成卡片',
        showCancel: false
      })
    },    

    showChangeFontColorDialog(e){
      let that = this;
      let index = e.currentTarget.dataset.index;
      let currentBlockColor = that.data.currentBlockColor;
      let blockColor = that.data.blockColor;
  
      that.setData({
        isShowChangeFontColorDialog: index == 1,
        currentBlockColor: index == 2 ? blockColor : currentBlockColor,
      })
    },

    shareImageTitleConfirm(e) {
      console.log(e)
      this.setData({
        shareImageTitle: e.detail.value
      })
    },

    changeCorlor(e) {
      var value = e.detail.value
      var colors = []
      if (value >= 0 && value < 17) {
        colors = this.gradientColors("#ff0000", "#ffff00", 17, 2.2)
        value = value
      } else if (value >= 17 && value < 33) {
        colors = this.gradientColors("#ffff00", "#00ff00", 17, 2.2)
        value = value - 17
      } else if (value >= 33 && value < 50) {
        colors = this.gradientColors("#00ff00", "#00ffff", 17, 2.2)
        value = value - 33
      } else if (value >= 50 && value < 67) {
        colors = this.gradientColors("#00ffff", "#0000ff", 17, 2.2)
        value = value - 50
      } else if (value >= 67 && value < 83) {
        colors = this.gradientColors("#0000ff", "#ff00ff", 17, 2.2)
        value = value - 67
      } else {
        colors = this.gradientColors("#ff00ff", "#ff0000", 17, 2.2)
        value = value - 83
      }
      if (value >= colors.length) {
        value = value - 1
      }
      this.setData({
        colorValue:value,
        colorGamutTip: colors[value],
        colorGamut: "-webkit-linear-gradient(left, #ffffff 0%," + colors[value] + " 100%)"
      })
  
      var colorGamuts=[]
      colorGamuts = this.gradientColors("#ffffff", this.data.colorGamutTip, 100, 2.2)
      this.setData({
        colorGrayTip: colorGamuts[this.data.colorGamutValue],
        colorGray: "-webkit-linear-gradient(left, #000000 0%," + colorGamuts[this.data.colorGamutValue] + " 100%)"
      })
  
  
      var colorGrays=[]
      colorGrays = this.gradientColors("#000000",this.data.colorGrayTip,100,2.2)
      this.setData({
        blockColor:colorGrays[this.data.colorGrayValue]
      })
	},
	
    changeCorlorGamut(e){
      var value = e.detail.value
      var colorGamuts = []
      colorGamuts = this.gradientColors("#ffffff", this.data.colorGamutTip, 100, 2.2)
      if (value >= colorGamuts.length) {
        value = value - 1
      }
      this.setData({
        colorGamutValue:value,
        colorGrayTip: colorGamuts[value],
        colorGray: "-webkit-linear-gradient(left, #000000 0%," + colorGamuts[value] + " 100%)"
      })
  
      var colorGrays = []
      colorGrays = this.gradientColors("#000000", this.data.colorGrayTip, 100, 2.2)
      this.setData({
        blockColor: colorGrays[this.data.colorGrayValue]
      })
	},
	
    changeCorlorGray(e){
      var value = e.detail.value
      var colorGrays = []
      colorGrays = this.gradientColors("#000000", this.data.colorGrayTip, 100, 2.2)
      if (value >= colorGrays.length) {
        value = value - 1
      }
      this.setData({
        colorGrayValue:value,
        blockColor: colorGrays[value],
      })
    },
    
    parseColor: function (hexStr) {
      return hexStr.length === 4 ? hexStr.substr(1).split('').map(function (s) {
        return 0x11 * parseInt(s, 16);
      }) : [hexStr.substr(1, 2), hexStr.substr(3, 2), hexStr.substr(5, 2)].map(function (s) {
        return parseInt(s, 16);
      })
    },
  
    // zero-pad 1 digit to 2
    pad: function (s) {
      return (s.length === 1) ? '0' + s : s;
    },
  
    gradientColors: function (start, end, steps, gamma) {
      var i, j, ms, me, output = [],
        so = [];
      gamma = gamma || 1;
      var normalize = function (channel) {
        return Math.pow(channel / 255, gamma);
      };
      start = this.parseColor(start).map(normalize);
      end = this.parseColor(end).map(normalize);
      for (i = 0; i < steps; i++) {
        ms = i / (steps - 1);
        me = 1 - ms;
        for (j = 0; j < 3; j++) {
          so[j] = this.pad(Math.round(Math.pow(start[j] * me + end[j] * ms, 1 / gamma) * 255).toString(16));
        }
        output.push('#' + so.join(''));
      }
      return output;
    },
  
    closeShareImageDetail(e){
      let that = this;
  
      that.setData({
        showShareImageWindow: false,
        loadImagePath: '',
        loadImagePath1: '',
        shareImageTitle: '',
        shareContent: '',
        temporaryImage: '',
        temporaryVideo: '',
        fromOnShare1: false
      })
	},
	
    closePosterWindow() {
      let that = this
      that.setData({
        showPoster: !that.data.showPoster,
        loadImagePath2: '',
        loadImagePath: '',
        currentPoster: '',
        shareImageTitle: '',
        shareImageDetail: []
      })
    },

    init(res) {
        let that = this
        const width = res[0].width
        const height = res[0].height
        this.setData({
            canvas: res[0].node,
            loadImagePath: '',
            loadImagePath2: '',
        })
        const canvas = res[0].node
        const ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        that.drawBackground().then(function () {
            that.drawQRCode().then(function () {
                wx.canvasToTempFilePath({
                    x: 0,
                    y: 0,
                    width: 621 * wx.getSystemInfoSync().pixelRatio,
                    height: 1099 * wx.getSystemInfoSync().pixelRatio,
                    destWidth: 621,
                    destHeight: 1099,
                    canvas: that.data.canvas,
                    success: function (res) {
                        console.log(res)
                        that.setData({
                            loadImagePath: res.tempFilePath,
                        });
                        wx.hideLoading({
                            success: (res) => {},
                        })
                    },
                    fail: res => {
                        console.log(res)
                        wx.hideLoading({
                            success: (res) => {},
                        })
                    }
                })
            })
        })
	},
	
    drawQRCode() {
        const that = this
        const canvas = this.data.canvas
        const ctx = canvas.getContext('2d')
        const img2 = canvas.createImage()
        return new Promise(function (resolve, reject) {
            that.waitImage = (bool) => {
                if (bool) {
                    img2.src = that.data.loadImagePath2

                    img2.onload = () => {
                        ctx.drawImage(img2, 505, 1000, 90, 90)
                        resolve()
                    }
                }
            }
        })
	},
	
    drawBackground() {
        const that = this
        const canvas = this.data.canvas
        const ctx = canvas.getContext('2d')
        const img = canvas.createImage()
        img.src = that.data.currentPoster
        return new Promise(function (resolve, reject) {
            img.onload = () => {
                ctx.drawImage(img, 0, 0, 621, 1099)
                resolve()
            }
        })
	},	
   

  selectMallBillShoppingCartTotalNumber() {		
    let that = this
 
    console.log("selectMallBillShoppingCartTotalNumber()被调用")
    var buyer_id=0;
    if(app.globalData.customerInf&&app.globalData.customerInf.id){
      buyer_id=app.globalData.customerInf.id
    }
    if(buyer_id<=0){
      return;
    }
    wx.request({
      url: app.globalData.selectMallBillShoppingCartTotalNumber,        
      method: 'POST',
      data: {                
        buyer_id: buyer_id,               
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {				    
        if(res.data.code == 1000){
          var mall_bill_shopping_cart_total_number=res.data.data;
          that.setData({
            mall_bill_shopping_cart_total_number:mall_bill_shopping_cart_total_number,
          })
        }	                           
      },
      fail(res){
      },
      complete(res){
        //回调函数每次执行完毕后，间隔5秒后执行
      }
    })

    
	},
	
//秘邻视频审核失败回调方法
    videoVertifyFailed(e){
      console.log(e)
    },
    // 秘邻视频审核通过回调方法
    videoVertifySuccess(e){
      console.log(e)
    },
    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
      this.insertOrUpdateMallBaseArticleEffectDetailCheck();
      this.exit_timer();
    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {
      this.exit_timer();
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
    
    delivery_day_strChange(e){
      console.log(e);
      try{
          var value=e.detail.value;
          var intValue=Math.floor(value);
          if(intValue&&intValue>0){
            this.setData({
              delivery_day_str:''+intValue,
              delivery_day:intValue
            })
          }else{
            this.setData({
              delivery_day:0
            })
          }
      }catch(e){
        this.setData({
          delivery_day:0
        })
      }
      this.calRiceDeliveryCount();
      this.calRiceSelectedQuantity();
    },
    delivery_weight_strChange(e){
      console.log(e);
      try{
        var value=e.detail.value;
        var intValue=Math.floor(value);
        if(intValue&&intValue>0){
          this.setData({
            delivery_weight_str:''+intValue,
            delivery_weight:value
          })
        }else{
          this.setData({
            delivery_weight:0
          })
        }
      }catch(e){
        this.setData({
          delivery_weight:0
        })
      }
      this.calRiceSelectedQuantity();
  },
  selectedQuantityStrChange(e){
    try{
      //零售 手动填入数量

      var value=e.detail.value;
      var intValue=Math.floor(value);
      if(intValue&&intValue>0){
        this.setData({
          selectedQuantityStr:''+intValue,
          selectedQuantity:intValue
        })
      }else{
        this.setData({
          selectedQuantity:1,
          selectedQuantityStr:'',
        })
      }
    }catch(e){
      this.setData({
        selectedQuantity:1,
        selectedQuantityStr:'',
      })
    }
    this.calRiceTotal();
  },
  calRiceDeliveryCount(){
    var delivery_count=0;
    var delivery_day=this.data.delivery_day;
    var selectedSpec=this.data.selectedSpec;
  
    if(delivery_day>0){
        
        if(selectedSpec=='一个月'){
          console.log(delivery_count);
          delivery_count=Math.floor(30/delivery_day);
          console.log(delivery_count);
          if(delivery_count<=1)
          {
            delivery_count=1;
          }
        }else if(selectedSpec=='一个季度'){
          console.log(delivery_count);
          delivery_count=Math.floor(90/delivery_day);
          console.log(delivery_count);
          if(delivery_count<=1)
          {
            delivery_count=1;
          }
        }else if(selectedSpec=='半年期'){
  
          delivery_count=Math.floor(180/delivery_day);
          if(delivery_count<=1)
          {
            delivery_count=1;
          }
        }
    }
    this.setData({
      delivery_count:delivery_count,
    })
    this.calRiceTotal();
  },
  calRiceSelectedQuantity(){
    if(this.data.category_id!=14||this.data.selectSpec==''){
      return;
    }
    var selectedQuantity=1; 
    if(this.data.selectSpec=='零售'){
       return;
     }
      var delivery_day=this.data.delivery_day;
        if(delivery_day>0){
          selectedQuantity=this.data.delivery_weight*this.data.delivery_count;
          
        }else{
          selectedQuantity=0;
        }
        this.setData({
          selectedQuantity:selectedQuantity,
        })
        this.calRiceTotal();
  },
  calRiceTotal(){
    if(this.data.category_id!=14||this.data.selectSpec==''){
      return;
    }
    //数量
    var selectedQuantity=this.data.selectedQuantity;
    var selectedSpec=this.data.selectedSpec;
    //单价
    var price=this.data.product_price;
    if(selectedSpec=='一个月'){
      if(this.data.sku_preferential_price>0){
        price=this.data.sku_preferential_price;
      }
    }else if(selectedSpec=='一个季度'){
      if(this.data.sku_recharge_price>0){
        price=this.data.sku_recharge_price;
      }
    }else if(selectedSpec=='半年期'){
      if(this.data.sku_vip_price>0){
        price=this.data.sku_vip_price;
      }
    }else if(selectedSpec=='零售'){
      if(this.data.product_price>0){
        price=this.data.product_price;
      }
    }

    console.log("当前价格："+selectedSpec+" "+price);
    var selectedRiceAmount=(price*selectedQuantity).toFixed(2);
    var selectedRiceStar=Math.floor((this.data.sku_platform_star_commission+this.data.sku_shop_star_commission)*selectedQuantity)

    this.setData({
      selectedRiceAmount:selectedRiceAmount,
      selectedRiceStar:selectedRiceStar,
    })
  },
  insertMallBaseGoodsCollect(){
    var that=this;
    wx.request({
      url: app.globalData.insertMallBaseGoodsCollect,				
      method: 'POST',
      data: {
        customer_openid: app.globalData.openid, 
        goods_id:that.data.goods_id,           
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
          if(res.data.code == 1000){
              wx.showToast({
                title: '收藏成功',
              })
          }else{
            wx.showToast({
              title: ''+res.data.msg,
              icon:'error'
            })
          }

      }
     })

  },
  toMallBaseArticleTemplateMain(e){
      
    var goods_id=this.data.goods_id;
    var shop_id=this.data.shop_id;
    var cut_introduction=this.data.cut_introduction;

    var product_name=this.data.product_name;
    var customer_preferential_price=this.data.customer_preferential_price;
    var recharge_member_price=this.data.recharge_member_price;
    var vip_member_price=this.data.vip_member_price;
    var platform_cash_commission=this.data.platform_cash_commission;

  

    var url='/pages/mall/pages/mallbasearticletemplatedetail/mallbasearticletemplatedetail';
    url+="?goods_id="+goods_id+"&shop_id="+shop_id+"&cut_introduction="+cut_introduction
    +"&product_name="+product_name+"&customer_preferential_price="+customer_preferential_price
    +"&recharge_member_price="+recharge_member_price+"&vip_member_price="+vip_member_price
    +"&platform_cash_commission="+platform_cash_commission;

    wx.navigateTo({
      url: url,
    })
  },
  insertOrUpdateMallBaseArticleEffectDetailCheck(){
    var is_from_ding=this.data.is_from_ding;
    if(is_from_ding==1){
      return;
    }
    
    var main_uid=this.data.main_uid;
    if(main_uid==''){
      return;
    }
    var detail_uid=this.data.detail_uid;
    if(detail_uid==''){
        var detail_uid=this.genUUID();
        this.setData({
          detail_uid:detail_uid,
        })
    }
    var app_goods_type=2;
    var wx_pyq_type=this.data.wx_pyq_type;
    if(wx_pyq_type<=0){
      return;
    }
    var data={
      article_effect_main_id:this.data.article_effect_main_id,
      main_uid:main_uid,
      detail_uid:detail_uid,
      wx_pyq_type:wx_pyq_type,
      app_goods_type:app_goods_type,
      send_customer_id:this.data.send_customer_id,
      open_customer_id:app.globalData.customerInf.id
    }
    this.insertOrUpdateMallBaseArticleEffectDetail(data)
  },
  insertOrUpdateMallBaseArticleEffectDetail(data){
      wx.request({
        url: app.globalData.insertOrUpdateMallBaseArticleEffectDetail,
        method:"POST",
        header:{
            'content-type':'application/json'
        },
        data:data,
        success:res=>{
            console.log(res);
            // if(res&&res.data&&res.data.code!=1000){
            //   wx.showToast({
            //     title: ''+res.data.msg,
            //     icon: 'error',
            //   })
            // }
        },
        fail:err=>{
          wx.hideLoading();
            wx.showToast({
              title: '网络异常',
              icon:'error',
            })
        },
      })
  },
  genUUID(){
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
  
    var uuid = s.join("");
    return uuid;
  },
  init_timer(){

    
    var wx_pyq_type=this.data.wx_pyq_type;
    if(wx_pyq_type<=0){
      return;
    }
    
      var main_uid=this.data.main_uid;
      if(main_uid==''){
        return;
      }
     var that=this;
      var timer=setInterval(function(){
        that.insertOrUpdateMallBaseArticleEffectDetailCheck();
      },3000);
      this.setData({
        timer:timer
      })
  },
  exit_timer(){
    if(this.data.timer!=null){
      clearInterval(this.data.timer);
      this.setData({
        timer:null,
      })
    }
  },
  toDingKe(){
    // wx.navigateTo({
    //   url: '/pages/mall/pages/dingke/dingke',
    // })
    this.closeShareDialog();
    this.setData({
      b_ding_main_show:true,
      dingYouList:[],
      ding_select_count:0,
    })

    this.selectAllDingMsgRecordDingKeFromMemberInfo();
  },
  clearDingKeyWord(e){
    this.setData({
      ding_key_word:'',
    })
  },
  selectAllDingMsgRecordDingKeFromMemberInfo(){
    var that=this;

    wx.request({
      url: app.globalData.selectAllDingMsgRecordDingKeFromMemberInfo,        
      method: 'POST',
      data: {                
          customer_name:that.data.ding_key_word, 
          ding_associate_id:app.globalData.customerInf.id, 
      },
      header: {
          'content-type': 'application/json'
      },
      success: function (res) {
          if(res.data.code == 1000){
            var dingYouList = res.data.data;     
            for(var i=0;i<dingYouList.length;i++){
              dingYouList[i].is_select=0;
            }        
          
            that.setData({
              dingYouList: dingYouList,
              ding_select_count:0,
            })
          }                                
      },
      fail(res){
        that.setData({
          mediaIsLoading:false,
        })
        wx.showToast({
          title: '获取叮友失败:'+res.data.msg,
          icon:'error',
          duration: 2000,
        }) 
      }
    })
  },
  changeDingSelect(e){
    var index=e.currentTarget.dataset.index;
    var dingYouList=this.data.dingYouList;
    var ding_select_count=0;
    for(var i=0;i<dingYouList.length;i++){
      if(dingYouList[i].is_select==1){
        ding_select_count+=1;
      }
    }
    if(dingYouList[index].is_select==0){
      if(ding_select_count>16){
        wx.showToast({
          title: '当前最多只能选择16人转发',
        })
        return;
      }
      dingYouList[index].is_select=1;
    }else{
      dingYouList[index].is_select=0;
    }

    ding_select_count=0;
    for(var i=0;i<dingYouList.length;i++){
      if(dingYouList[i].is_select==1){
        ding_select_count+=1;
      }
    }
    this.setData({
      dingYouList:dingYouList,
      ding_select_count:ding_select_count,
    })
  },
  sendMsgExec(){
    var that=this;
    var msg_type=5;
    var msg='';
    var duration=0;
    var dingYouList=this.data.dingYouList;
    var receiver_codes='';
    var task_queue_names='';

    var multi_media=this.data.multi_media;
    var imgUrl='';
    for(var i=0;i<multi_media.length;i++){
      if(multi_media[i].multimedia_type==1&&multi_media[i].url){
        imgUrl=multi_media[i].url;
        break;
      }
    }
 
    var title = '' +this.data.product_name;
    var goods_id=this.data.goods_id;
    var shop_id=this.data.shop_id;
  
    var cardObj={
      id:0,
      msg_record_id:0,
      card_type:1,
      title:title,
      img_url:imgUrl,
      page_url:'/pages/module_discount/pages/Merchandise_details/Merchandise_details',
      page_param:'bind_type=3&associate_type=2' + '&shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +'&goods_id=' + goods_id,
    }

    var lstDingMsgCard=[];
    lstDingMsgCard.push(cardObj);

    for(var i=0;i<dingYouList.length;i++){
        var dingObj=dingYouList[i];
        if(dingObj.is_select==1){
          if(receiver_codes==''){
              receiver_codes=dingObj.customer_code;
              task_queue_names=(app.globalData.hj + "_qgqc_" + dingObj.customer_id);
          }else{
            receiver_codes=receiver_codes+','+dingObj.customer_code;
            task_queue_names=task_queue_names+','+(app.globalData.hj + "_qgqc_" + dingObj.customer_id);
          }
        }
    }

    if(receiver_codes==''){
      wx.showToast({
        title: '请选择接收人',
        icon:'none'
      });
      return;
    }

    //msg_type 消息类型 1-文字 2-图片 3-语音 4-视频 5-卡片
    //msg 消息内容
    //wechat_type 聊天类型： 1-店员->客户 2-客户->店员
    var customer_code=Number(app.globalData.customerInf.userCode);
    
    var data={
      msg_type: msg_type,
      duration:duration,
      msg: title,
      sender_code: customer_code,
      receiver_code:0,
      receiver_codes: receiver_codes,
      lstDingMsgCard:lstDingMsgCard,
    };
    wx.showLoading({
      title: '发送中',
    })
    wx.request({
      url: app.globalData.insertDingMsgRecord,
      method: 'POST',
      data: data,
      success: res => {
        wx.hideLoading();
        if (res.data.code == 1000) {
            for(var i=0;i<dingYouList.length;i++){
              dingYouList[i].is_select=0;
            }
            that.setData({
              dingYouList:dingYouList,
              b_ding_main_show:false,
            })
            that.sendRabbitMqMsg(task_queue_names);
        } else {
          wx.showModal({
            title: '提示',
            content: '发送失败'+res.data.msg,
            showCancel: false
          })
          
        }
      },
      fail: res => {
        wx.hideLoading();
        wx.showModal({
          title: '提示',
          content: '发送失败',
          showCancel: false
        })
        
      }
    })
  },
  sendRabbitMqMsg(task_queue_names){
    console.log("sendRabbitMqMsg:");
    var meInfo=this.data.meInfo;
    var otherInfo=this.data.otherInfo;

    var that=this;

    var sender_id=app.globalData.customerInf.id;
    var receiver_id=0;

    var msgObj={
        data:{
            msg:{
                type: "ding_ke_msg_record",
                tg: "ding_ke_msg_record",
                shop_id: 0,
                wechat_type: 0,
                sender_id: sender_id,
                receiver_id: receiver_id,
            }
        }
    }
    var msgJson=JSON.stringify(msgObj);
    var data={
        task_queue_names:task_queue_names,
        msg:msgJson,
    }
    wx.request({
      url: app.globalData.SendRabbitMqMsg,
      method: 'POST',
      data: data,
      success: res => {
        console.log(res)
      },
      fail: res => {
        console.log(res)
      }
    })

    
  },
  showOrHideBDingMainShow(e){
    console.log(e);
    var b_ding_main_show=e.currentTarget.dataset.show;
    console.log(b_ding_main_show);
    if(b_ding_main_show==true){
      this.selectAllDingMsgRecordDingKeFromMemberInfo();
    }
    this.setData({
      b_ding_main_show:b_ding_main_show,
    })


  },

    onShareTimeline: function () {
            
      var multi_media=this.data.multi_media;
      var imgUrl='';
      for(var i=0;i<multi_media.length;i++){
        if(multi_media[i].multimedia_type==1&&multi_media[i].url){
          imgUrl=multi_media[i].url;
          break;
        }
      }

     var title = '' +this.data.product_name;
     var goods_id=this.data.goods_id;
     var shop_id=this.data.shop_id;

      var path='bind_type=3&associate_type=2' + '&shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +'&goods_id=' + goods_id;

      console.log("分享朋友圈:"+path);
      console.log("广告图片:"+imgUrl);
      return {
          title: title,
          path: path,
          imageUrl: imgUrl
      }
  },
  hideFenXiangPengYouQuan(e){
      this.setData({
        is_fenxiangpengyouquan:0,
      })
  },
  toGiftDetail(e){
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + item.gift_goods_id,
  })
  },

  selectCustomerIsStaff(){

    var that=this;
    var customer_id=app.globalData.customerInf.id;
    var goods_id =this.data.goods_id;

    wx.request({
      url: app.globalData.selectCustomerIsStaff,	
      //url:'http://localhost:8080/evaluation_war/mall/selectMallCsrCustomer_StorepersonnalDataShopId',
      method: 'POST',
      data: {
        customer_id: customer_id,
        goods_id:goods_id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {                  
        if(res.data.code!=1000){
          console.log(res.data.data);
          wx.showToast({
            title: '失败'+res.data.msg,
            icon:'error'
          })
        }else{
          if(res.data.code==1000&&res.data.data.is_exists==1){
            //showQRCode
            //是员工
            that.showQRCode(1,res.data.data.scan_staff_shop_id);

          }else{
            //不是员工
            that.showQRCode(0,0);
          }
        }      
      }
    })
  },
  closeIsInActivityDlgShow(){
    this.setData({
      is_in_activity_dlg_show:0,
    })
  },
  downloadFileNine(url,index,canvas,ctx) {
    var that=this;

    try {
     wx.downloadFile({
        url: url,
        success: function (res) {
          // 这里通常不需要处理什么，‌因为await已经等待了成功的结果
          lstNine[index].tempFilePath=res.tempFilePath
          console.log('下载成功', res.tempFilePath);
          let img = canvas.createImage()
          img.src = res.tempFilePath

          new Promise((a, b) => {
            img.onload = () => {
              ctx.drawImage(img, 0+index*10, 0+index*10, 190, 190)
             
              a()
            }
          })
        },
        fail: function (err) {
          // 处理下载失败的情况
          console.log('下载失败', err);
          throw err; // 抛出错误，‌以便在调用处可以捕获
        }
      });
     
    } catch (error) {
      // 捕获并处理错误
      console.log('下载过程中发生错误', error);
      throw error; // 可以选择重新抛出错误
    }
  },

  downLoadNineImg(canvas,ctx){
      var that=this;
      for(var i=0;i<lstNine.length;i++){
        console.log("正在下载"+i+""+lstNine[i].url);
        try{
          this.downloadFileNine(lstNine[i].url,i,canvas,ctx);
        }catch(e){
            console.log(e);
        }
     
        
      }
  }, 


  selectMallBaseArticleTemplatePageData(){
    //分页查询已完成模板
        let that = this
        if(this.data.mediaIsLoading){
          return;
        }
     

        wx.request({
            url: app.globalData.selectMallBaseArticleTemplateMainByKeyWord,        
            method: 'POST',
            data: {         
                goods_id:that.data.goods_id,       
                key_word:that.data.s_template_key_word,
                article_type:that.data.s_article_type,            
                page_size: that.data.s_article_template_main_page_size,  //hardcode成每次拿16个
                page_index: that.data.s_article_template_main_page_index   //一开始每次只搞头16个           
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                  mediaIsLoading:false,
                })
                if(res.data.code == 1000){
                  const s_article_template_main_array = res.data.data;
                  
                
                  if(s_article_template_main_array.length>0){
                    //判断是否已有
                    var s_article_template_main_array_count=that.data.s_article_template_main_array_count;
                    if(s_article_template_main_array_count==0){
                      s_article_template_main_array_count=s_article_template_main_array.length;
                      that.setData({s_article_template_main_array_count:s_article_template_main_array_count});
                      if(that.data.is_inited==false){
                        that.setData({
                          b_article_template_main_show:true,
                        })
                      }
                    }

                    wx.showToast({
                      title: '获取到'+s_article_template_main_array.length+'条数据',
                      icon:'none'
                    })

                  }else{
                    wx.showToast({
                      title: '无新数据',
                      icon:'none'
                    })
                  }
                  that.setData({
                    s_article_template_main_array: that.data.s_article_template_main_array.concat(s_article_template_main_array),
                    s_article_template_main_page_index:that.data.s_article_template_main_page_index+1,
                  })
                }                                
            },
            fail(res){
              that.setData({
                mediaIsLoading:false,
              })
              wx.showToast({
                title: '获取素材失败:'+res.data.msg,
                icon:'error',
                duration: 2000,
              }) 
            }
          })
  },
  clearSTemplateKeyWord(e){
    this.setData({
      s_template_key_word:'',
    })
  },
  selectMallBaseArticleTemplateMainData(e){
    var s_article_type=e.currentTarget.dataset.article_type;
    s_article_type=s_article_type?s_article_type:0;
    //查询已完成模板
    this.setData({
      s_article_template_main_page_index:1,
      s_article_template_main_page_size:20,
      s_article_template_main_array:[],
      listIndexArticleTemplateMain:-1,
      s_article_type:s_article_type,
      s_article_template_main_item:{},
    })
    this.selectMallBaseArticleTemplatePageData();
  },
  confirmArticleTemplateMain(e){
    if(this.data.listIndexArticleTemplateMain>=0){
      if(this.data.s_article_template_main_item){

          //设置选择的素材文章
          var article_main_item=this.data.s_article_template_main_item.dtoMallBaseArticleMain;
          console.log(article_main_item)
          var article_template_main_item={
            name:article_main_item.name,
            key_word:article_main_item.key_word,
            article_main_id:article_main_item.id,
            share_img_url:this.data.s_article_template_main_item.share_img_url,
            id:this.data.s_article_template_main_item.id,
            article_type:this.data.s_article_template_main_item.article_type,
          }
         

          this.setData({
            s_article_template_main_item_confirm:this.data.s_article_template_main_item,
            article_detail_array:article_main_item.lstDetail,
            article_template_main_item:article_template_main_item,
            article_template_detail_array:this.data.s_article_template_main_item.lstDetail,
            b_article_template_main_show:false,
            article_main_item:article_main_item,
          })
          //this.setShareImg();
          this.posterArticleTemplateDetail();
          
      }
    }else{
       wx.showToast({
         title: '请选择素材',
         icon:'none',
       })
    }
  },
  scrollToLowerArticleTemplateMain(e){
    this.selectMallBaseArticleTemplatePageData();
  },
  itemClickArticleTemplateMain(e) {
    var that = this;
    let i = e.currentTarget.dataset.index
    var s_article_template_main_item=that.data.s_article_template_main_array[i];
    that.setData({
      listIndexArticleTemplateMain: i, //获取
      s_article_template_main_item:s_article_template_main_item,
    })
  },
  posterArticleTemplateDetail(){
    var article_template_detail_array=this.data.article_template_detail_array;
    article_template_detail_array=article_template_detail_array.filter(item=>{
      return item.is_delete==0
    });
    if(article_template_detail_array.length==0){
      wx.showToast({
        title: '无明细项',
        icon:'none'
      })
      return;
    }
    var article_template_main_item=this.data.article_template_main_item;
    var article_template_main_id=article_template_main_item.id; 
    
   

      let that = this     
      wx.createSelectorQuery()
        .select('#canvas')
        .fields({
          node: true,
          size: true,
        })
        .exec(res => {
          const canvas = res[0].node
          var ctx = canvas.getContext('2d')
          const dpr = wx.getSystemInfoSync().pixelRatio
          console.log(dpr)
          const width = res[0].width
          const height = res[0].height
          canvas.width = width * dpr
          canvas.height = height * dpr
          ctx.scale(dpr, dpr)
  
          let imgUrl = 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/sszg/0' + (Math.ceil(Math.random() * 7)) + '.png';
  
          wx.downloadFile({
            url: imgUrl,
            success: res => {
              let img2 = canvas.createImage()
              img2.src = res.tempFilePath
              new Promise((a, b) => {
                img2.onload = () => {
                  ctx.drawImage(img2, 0, 0, 621, 1099)
                  ctx.fillStyle = 'rgb(255, 255, 255)';
                  ctx.fillRect(430, 780, 210, 210);
                  a()
                }
              }).then(res => {
                that.getRandomImage()
                wx.downloadFile({
                  url: that.data.poster_bg_img_url,
                  success: res => {
                    let img = canvas.createImage()
                    img.src = res.tempFilePath
                    new Promise((a, b) => {
                      img.onload = () => {
                        //分享模板图
                        ctx.drawImage(img, 0, 0, 621, 1099)
                        
                        let imgUrl2 = that.data.multimedia_url
  
                        wx.downloadFile({
                          url: imgUrl2,
                          success: res =>{
                            let img3 = canvas.createImage()
                            img3.src = res.tempFilePath;
  
                            new Promise((a,b) =>{
                              img3.onload = () =>{
                                ctx.drawImage(img3, 20, 20, 581, 581);
  
                                //分享标题
                                if (that.data.shareImageTitle) {
                                  // ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                                  // ctx.fillRect(20, 100, 581, 60);
                                  ctx.font = "60px nainao"
                                  ctx.textAlign = "center"
                                  ctx.fillStyle = "#FFFFFF"
                                  ctx.fillText(that.data.shareImageTitle, 310.5, 160)
                                  ctx.fillText(that.data.shareImageTitle, 311, 160.5)
                                }
  
                                a()
                              }
                            }).then(res =>{
                              //分享内容
                              if (that.data.shareImageDetail) {
                                for (let i = 0; i < that.data.shareImageDetail.length; i++) {
                                  const element = that.data.shareImageDetail[i];
                                 
                                  ctx.font = "50px nainao"
                                  ctx.textAlign = "left"
                                  ctx.fillStyle = that.data.currentBlockColor
                                  ctx.fillText(element, 100, (225 + (i * 30)))
                                  ctx.fillText(element, 100.5, (225.5 + (i * 30)))
                                }
                              }else{
                                ctx.font = "45px nainao"
                                ctx.textAlign = "left"
                                ctx.fillStyle = that.data.currentBlockColor  
                                
                              }
                            })
                          }
                        })
  
                        //阴影
                        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                        ctx.fillRect(0, 630, 621, 510);
                        
                        ctx.font = "bold 36px SimHei"
                        ctx.textAlign = "left"
                        ctx.fillStyle = "#FFFFFF"
                        let product_name2 = ""
                        let product_name = that.data.product_name                       
                        
                        if (ctx.measureText(product_name).width > 587) {
                          product_name2 = product_name.slice(16)
                          product_name = product_name.substring(0, 16)
                        }                       
                        
                        ctx.fillText(product_name, 20, 686)                       

                        if (product_name2 != "") {
                          ctx.fillText(product_name2, 20, 736)                          
                        }                        
  
                        ctx.font = "bold 45px SimHei"
                        ctx.textAlign = "left"
                        ctx.fillStyle = "white"  
                       
                        ctx.fillText('￥' + that.data.product_price + "元", 35, 791)

                        ctx.font = "bold 36px SimHei"
                        ctx.textAlign = "left"
                        ctx.fillStyle = "white"  

                        ctx.fillText('券后价:' + '￥' + that.data.customer_preferential_price + "元", 35, 841)
                        ctx.fillText('充值会员价:' + '￥' + that.data.recharge_member_price + "元", 35, 891)
                        ctx.fillText('VIP价:' + '￥' + that.data.vip_member_price + "元", 40, 941)                                            
                       
  
                        ctx.font = "bold 36px SimHei"
                        let text = (that.data.platform_cash_commission > 0 ? that.data.platform_cash_commission + '元[平台现金]' : that.data.platform_star_commission > 0 ? that.data.platform_star_commission + '元[平台星盾]' : '') + (that.data.shop_cash_commission > 0 ? that.data.shop_cash_commission + '元[商家现金]' : that.data.shop_star_commission > 0 ? that.data.shop_star_commission + '元[商家星盾]' : '')
                        if (text != '') {
                          ctx.fillText("提成:" + text, 35, 991)                          
                        }  
                        
                        ctx.font = "36px SimHei"
                        ctx.textAlign = "left"
                        ctx.fillStyle = "#FFFFFF"                        
                        ctx.fillText('长按二维码进入弹叮商城购买', 20, 1060)
                                            
                        a()
                      }
                    }).then(res => {
                     
                      var main_uid=that.genUUID();
                      var qr_text='';
                      qr_text=app.getServerUrl()+'/QRCodeToArticleTemplate/?bind_type=3&associate_type=2&shop_id=' 
                      + this.data.shop_id + 
                      '&associate_id=' + app.globalData.customerInf.id 
                      + '&goods_id=' + this.data.goods_id
                      +'&article_template_main_id='+article_template_main_id
                      +'&main_uid='+main_uid
                      ;
                      var send_data={
                        main_uid:main_uid,
                        name:article_template_main_item.name,
                        shop_id:that.data.shop_id,
                        send_customer_id:app.globalData.customerInf.id,
                        article_template_main_id:article_template_main_id,
                        is_wx:0,
                        is_pyq:0
                      }
                      that.insertOrUpdateMallBaseArticleEffectMain(send_data);

                      console.log(qr_text);
                      new QRCode('myQrcode', {
                        text: qr_text,
                        width: 180, //canvas 画布的宽
                        height: 180, //canvas 画布的高
                        padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
                        correctLevel: QRCode.CorrectLevel.Q, // 二维码可辨识度
                        colorDark: "#000000", //分别为两种交替颜色
                        colorLight: "#FFFFFF",
                        callback: (e) => {  
                          
                          console.log(e)
                          wx.canvasToTempFilePath({
                            x: 0,
                            y: 0,
                            width: 300,
                            height: 300,
                            destWidth: 300,
                            destHeight: 300,
                            canvasId: 'myQrcode',
                            success(res) {
                              console.log(res)
                              let img3 = canvas.createImage()
                              img3.src = res.tempFilePath
                              new Promise((a, b) => {
                                img3.onload = () => {
                                  ctx.drawImage(img3, 406, 765, 210, 210)
                                  a()
                                }
                              }).then(res => {
                                wx.canvasToTempFilePath({
                                  x: 0,
                                  y: 0,
                                  width: 621 * wx.getSystemInfoSync().pixelRatio,
                                  height: 1099 * wx.getSystemInfoSync().pixelRatio,
                                  destWidth: 621,
                                  destHeight: 1099,
                                  canvas: canvas,
                                  success: res2 => {
                                    wx.hideLoading()
                                    that.setData({
                                      showPoster: true,
                                      loadImagePath: res2.tempFilePath,
                                    });
                                    
                                    that.uploadShareCardFile(res2.tempFilePath,1)
                                  }
                                })
                              })
                            }
                          })
                        }
                      })
                      
                    })
                  }
                })
              })
            }
          })
        })
      
     
      

      wx.showLoading({
        title: '正在加载...',
        mask: true
      })    
    
  },
  posterArticleTemplateDetail_Nine_BAK(e) {

    var article_template_detail_array=this.data.article_template_detail_array;
    article_template_detail_array=article_template_detail_array.filter(item=>{
      return item.is_delete==0
    });
    if(article_template_detail_array.length==0){
      wx.showToast({
        title: '无明细项',
        icon:'none'
      })
      return;
    }
    var article_template_main_item=this.data.article_template_main_item;
    var article_template_main_id=article_template_main_item.id;

    let that = this     
    wx.createSelectorQuery()
      .select('#canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec(res => {
        const canvas = res[0].node
        var ctx = canvas.getContext('2d')
        const dpr = wx.getSystemInfoSync().pixelRatio
        console.log(dpr)
        const width = res[0].width
        const height = res[0].height
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)
        let imgUrl = 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/sszg/0' + (Math.ceil(Math.random() * 7)) + '.png';

        wx.downloadFile({
          url: imgUrl,
          success: res => {
            let img2 = canvas.createImage()
            img2.src = res.tempFilePath
            new Promise((a, b) => {
              
              img2.onload = () => {
                console.log("写入背景图片0")
                ctx.drawImage(img2, 0, 0, 621, 1099)
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillRect(430, 780, 210, 210);
  
          
                
        
                //that.downLoadNineImg(canvas,ctx);
                a()
              }
            }).then(res => {
              that.getRandomImage()
              wx.downloadFile({
                url: that.data.poster_bg_img_url,
                success: res => {
                  let img = canvas.createImage()
                  img.src = res.tempFilePath
                  new Promise((a, b) => {
                    img.onload = () => {
                      //分享模板图
                      ctx.drawImage(img, 0, 0, 621, 1099)
                      console.log("写入背景图片1")
                      if(lstNine.length>1){
                        wx.downloadFile({
                          url: ''+lstNine[0].url,
                          success:res=>{
                            let nimg0 = canvas.createImage()
                             nimg0.src = res.tempFilePath;
                             new Promise((a,b) =>{
                              nimg0.onload = () =>{
                                ctx.drawImage(nimg0, 20, 30, 187, 187);
                                a()
                              }
                            })
                          }
                        })
                      }
                     
                      if(lstNine.length>2){
                        wx.downloadFile({
                          url: ''+lstNine[1].url,
                          success:res=>{
                            let nimg1 = canvas.createImage()
                             nimg1.src = res.tempFilePath;
                             new Promise((a,b) =>{
                              nimg1.onload = () =>{
                                ctx.drawImage(nimg1, 20+187+10, 30, 187, 187);
                                a()
                              }
                            })
                          }
                        })
                      }
                      

                      if(lstNine.length>3){
                        wx.downloadFile({
                          url: ''+lstNine[2].url,
                          success:res=>{
                            let nimg2 = canvas.createImage()
                             nimg2.src = res.tempFilePath;
                             new Promise((a,b) =>{
                              nimg2.onload = () =>{
                                ctx.drawImage(nimg2, 20+187*2+10*2, 30, 187, 187);
                                a()
                              }
                            })
                          }
                        })
                      }
                      
                      if(lstNine.length>4){
                        wx.downloadFile({
                          url: ''+lstNine[3].url,
                          success:res=>{
                            let nimg3 = canvas.createImage()
                             nimg3.src = res.tempFilePath;
                             new Promise((a,b) =>{
                              nimg3.onload = () =>{
                                ctx.drawImage(nimg3, 20, 30+187+10, 187, 187);
                                a()
                              }
                            })
                          }
                        })
                      }
                      
                      if(lstNine.length>4){
                        wx.downloadFile({
                          url: ''+lstNine[4].url,
                          success:res=>{
                            let nimg4 = canvas.createImage()
                             nimg4.src = res.tempFilePath;
                             new Promise((a,b) =>{
                              nimg4.onload = () =>{
                                ctx.drawImage(nimg4, 20+187+10, 30+187+10, 187, 187);
                                a()
                              }
                            })
                          }
                        })
                      }
                      
                      if(lstNine.length>5){
                        wx.downloadFile({
                          url: ''+lstNine[5].url,
                          success:res=>{
                            let nimg5 = canvas.createImage()
                             nimg5.src = res.tempFilePath;
                             new Promise((a,b) =>{
                              nimg5.onload = () =>{
                                ctx.drawImage(nimg5, 20+187*2+10*2, 30+187+10, 187, 187);
                                a()
                              }
                            })
                          }
                        })
                      }
                     
                      if(lstNine.length>6){
                        wx.downloadFile({
                          url: ''+lstNine[6].url,
                          success:res=>{
                            let nimg6 = canvas.createImage()
                             nimg6.src = res.tempFilePath;
                             new Promise((a,b) =>{
                              nimg6.onload = () =>{
                                ctx.drawImage(nimg6, 20, 30+187*2+10*2, 187, 187);
                                a()
                              }
                            })
                          }
                        })
                      }
                      
                      if(lstNine.length>7){
                        wx.downloadFile({
                          url: ''+lstNine[7].url,
                          success:res=>{
                            let nimg7 = canvas.createImage()
                             nimg7.src = res.tempFilePath;
                             new Promise((a,b) =>{
                              nimg7.onload = () =>{
                                ctx.drawImage(nimg7, 20+187+10, 30+187*2+10*2, 187, 187);
                                a()
                              }
                            })
                          }
                        })
                      }
                     
                      var last_index=lstNine.length-1;
                      var imgUrl2=lstNine[last_index].url;
                      wx.downloadFile({
                        url: imgUrl2,
                        success: res =>{
                          let img3 = canvas.createImage()
                          img3.src = res.tempFilePath;
                          console.log(res.tempFilePath);

                          console.log("写入实际图片")
                          new Promise((a,b) =>{
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
                            ctx.fillRect(10, 20, 600, 600);

                            img3.onload = () =>{
                              //that.downLoadNineImg(canvas,ctx);
                              //ctx.drawImage(img3, 20, 50, 581, 581);
                              if(last_index==0){
                                ctx.drawImage(nimg0, 20, 30, 187, 187);
                              }
                              if(last_index==1){
                                ctx.drawImage(nimg1, 20+187+10, 30, 187, 187);
                              }
                              if(last_index==2){
                                ctx.drawImage(nimg2, 20+187*2+10*2, 30, 187, 187);
                              }
                              if(last_index==3){
                                ctx.drawImage(nimg3, 20, 30+187+10, 187, 187);
                              }
                              if(last_index==4){
                                ctx.drawImage(nimg4, 20+187+10, 30+187+10, 187, 187);
                              }
                              if(last_index==5){
                                ctx.drawImage(nimg5, 20+187*2+10*2, 30+187+10, 187, 187);
                              }
                              if(last_index==6){
                                ctx.drawImage(nimg6, 20, 30+187*2+10*2, 187, 187);
                              }
                              if(last_index==7){
                                ctx.drawImage(nimg7, 20+187+10, 30+187*2+10*2, 187, 187);
                              }
                              if(last_index==8){
                                ctx.drawImage(img3, 20+187*2+10*2, 30+187*2+10*2, 187, 187);
                              }
                             

                              //分享标题
                              if (that.data.shareImageTitle) {
                                // ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                                // ctx.fillRect(20, 100, 581, 60);
                                ctx.font = "60px nainao"
                                ctx.textAlign = "center"
                                ctx.fillStyle = "#FFFFFF"
                                ctx.fillText(that.data.shareImageTitle, 310.5, 160)
                                ctx.fillText(that.data.shareImageTitle, 311, 160.5)
                              }

                              a()
                            }
                          }).then(res =>{
                            //分享内容
                            if (that.data.shareImageDetail) {
                              for (let i = 0; i < that.data.shareImageDetail.length; i++) {
                                const element = that.data.shareImageDetail[i];
                               
                                ctx.font = "50px nainao"
                                ctx.textAlign = "left"
                                ctx.fillStyle = that.data.currentBlockColor
                                ctx.fillText(element, 100, (225 + (i * 30)))
                                ctx.fillText(element, 100.5, (225.5 + (i * 30)))
                              }
                            }else{
                              ctx.font = "45px nainao"
                              ctx.textAlign = "left"
                              ctx.fillStyle = that.data.currentBlockColor  
                              
                            }
                          })
                        }
                      })

                      //阴影

                      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                      ctx.fillRect(0, 630, 621, 510);
                      
                      ctx.font = "bold 36px SimHei"
                      ctx.textAlign = "left"
                      ctx.fillStyle = "#FFFFFF"
                      let product_name2 = ""
                      let product_name = that.data.product_name                       
                      
                      if (ctx.measureText(product_name).width > 587) {
                        product_name2 = product_name.slice(16)
                        product_name = product_name.substring(0, 16)
                      }                       
                      
                      ctx.fillText(product_name, 20, 686)                       

                      if (product_name2 != "") {
                        ctx.fillText(product_name2, 20, 736)                          
                      }                        

                      ctx.font = "bold 45px SimHei"
                      ctx.textAlign = "left"
                      ctx.fillStyle = "white"  
                     
                      ctx.fillText('￥' + that.data.product_price + "元", 35, 791)

                      ctx.font = "bold 36px SimHei"
                      ctx.textAlign = "left"
                      ctx.fillStyle = "white"  

                      ctx.fillText('券后价:' + '￥' + that.data.customer_preferential_price + "元", 35, 841)
                      ctx.fillText('充值会员价:' + '￥' + that.data.recharge_member_price + "元", 35, 891)
                      ctx.fillText('VIP价:' + '￥' + that.data.vip_member_price + "元", 40, 941)                                            
                     

                      ctx.font = "bold 36px SimHei"
                      let text = (that.data.platform_cash_commission > 0 ? that.data.platform_cash_commission + '元[平台现金]' : that.data.platform_star_commission > 0 ? that.data.platform_star_commission + '元[平台星盾]' : '') + (that.data.shop_cash_commission > 0 ? that.data.shop_cash_commission + '元[商家现金]' : that.data.shop_star_commission > 0 ? that.data.shop_star_commission + '元[商家星盾]' : '')
                      if (text != '') {
                        ctx.fillText("提成:" + text, 35, 991)                          
                      }  
                      
                      ctx.font = "36px SimHei"
                      ctx.textAlign = "left"
                      ctx.fillStyle = "#FFFFFF"                        
                      ctx.fillText('长按二维码进入弹叮商城购买', 20, 1060)
                                          
                      a()
                    }
                  }).then(res => {
                   

                    var main_uid=that.genUUID();
                      var qr_text='';
                      qr_text=app.getServerUrl()+'/QRCodeToArticleTemplate/?bind_type=3&associate_type=2&shop_id=' 
                      + this.data.shop_id + 
                      '&associate_id=' + app.globalData.customerInf.id 
                      + '&goods_id=' + this.data.goods_id
                      +'&article_template_main_id='+article_template_main_id
                      +'&main_uid='+main_uid
                      ;
                      var send_data={
                        main_uid:main_uid,
                        name:article_template_main_item.name,
                        shop_id:that.data.shop_id,
                        send_customer_id:app.globalData.customerInf.id,
                        article_template_main_id:article_template_main_id,
                        is_wx:0,
                        is_pyq:0
                      }
                      that.insertOrUpdateMallBaseArticleEffectMain(send_data);

                      console.log(qr_text);

                    new QRCode('myQrcode', {
                      text: qr_text,
                      width: 180, //canvas 画布的宽
                      height: 180, //canvas 画布的高
                      padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
                      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
                      colorDark: "#000000", //分别为两种交替颜色
                      colorLight: "#FFFFFF",
                      callback: (e) => {  
                        
                        console.log(e)
                        wx.canvasToTempFilePath({
                          x: 0,
                          y: 0,
                          width: 300,
                          height: 300,
                          destWidth: 300,
                          destHeight: 300,
                          canvasId: 'myQrcode',
                          success(res) {
                            console.log(res)
                            let img3 = canvas.createImage()
                            img3.src = res.tempFilePath
                            new Promise((a, b) => {
                              img3.onload = () => {
                                ctx.drawImage(img3, 406, 765, 210, 210)
                                a()
                              }
                            }).then(res => {
                              wx.canvasToTempFilePath({
                                x: 0,
                                y: 0,
                                width: 621 * wx.getSystemInfoSync().pixelRatio,
                                height: 1099 * wx.getSystemInfoSync().pixelRatio,
                                destWidth: 621,
                                destHeight: 1099,
                                canvas: canvas,
                                success: res2 => {
                                  wx.hideLoading()
                                  that.setData({
                                    showPoster: true,
                                    loadImagePath: res2.tempFilePath,
                                  });
                                  
                                  that.uploadShareCardFile(res2.tempFilePath,1)
                                }
                              })
                            })
                          }
                        })
                      }
                    })
                    
                  })
                }
              })
            })
          }
        })
      })
    
    wx.showLoading({
      title: '正在加载...',
      mask: true
    })      
  },
  genUUID(){
    var s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) {
      s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    }
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
  
    var uuid = s.join("");
    return uuid;
  },
  insertOrUpdateMallBaseArticleEffectMain(data){
    wx.request({
      url: app.globalData.insertOrUpdateMallBaseArticleEffectMain,
      method:"POST",
      header:{
          'content-type':'application/json'
      },
      data:data,
      success:res=>{
          console.log(res);
          if(res&&res.data&&res.data.code!=1000){
            wx.showToast({
              title: ''+res.data.msg,
              icon: 'error',
            })
          }
      },
      fail:err=>{
        wx.hideLoading();
          wx.showToast({
            title: '网络异常',
            icon:'error',
          })
      },
    })
  },
  hideBArticleTemplateMainShow(e){
    this.setData({
      b_article_template_main_show:false,
    })
},
 

})