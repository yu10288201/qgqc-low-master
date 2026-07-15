// pages/pay/pay.js
const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
        wechatAppId: "wx7601bb0ab62f48aa", //APPID
        //wsk: "b7362e5e2b5f32d9c314655b7b28de43", //SecretKey
        //公众号appid(诗么普科技)
        appid: 'wx78455227a0fd853f',
        //服务商户号(诗么普科技公司)
        //mch_id: '1525534221',
        // 旧的
        // mch_id: '1509704181',
        // 孟奔特约商户
        mch_id: '1509776181',
        sub_merchants_id: '',
        payment_address: '',
        actualSum: 0,
        shopName: '',
        topimage:'',
        inviteOpenId: '', //邀请人openid
        commission_price: 0,
        order_total: 0,
      //////////////////////
        out_trade_no:'',//订单支付号
        
        bill_payment_id:0,//订单支付表id
        bill_main_id:0,//订单主表id
        total_amount:0,//支付金额
        openid:'',//支付人openid
        profit_sharing:0,//是否分账
        shop_id:0,
        percent_total:0,//分账金额
        lstInviteVo:[],//待分账数组
        set_meal_id:0,
        inter:'',
        deductBalance: 0, //针对充值会员需要在支付成功后扣掉相应的余额来抵扣差值
        isPostPay: 0, //是否从订单列表点的付款
        platform_member_rule_url:'',

        is_in_activity_staus:0,
        is_in_activity_content:'',
        is_in_activity_count_show_id:0,
        is_hide_pay:0,
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        var is_hide_pay=0;
        console.log(options)
        if(options.is_in_activity_staus){
            var is_in_activity_staus=Number(options.is_in_activity_staus);
            var is_in_activity_count_show_id=Number(options.is_in_activity_count_show_id);
            var is_in_activity_content='';
           
            if(is_in_activity_staus==1){
              is_hide_pay=1;
              is_in_activity_content='恭喜你抢领成功。你是今天抢领的第'+is_in_activity_count_show_id+'个幸运儿，希望再邀请好友入群抢领礼品，谢谢你的支持！';
            }else if(is_in_activity_staus==2){
              is_hide_pay=1;
              is_in_activity_content='抱歉，你已领过一次。本次活动每人只能领取一次。请邀请好友入群抢领，谢谢！';
            }else if(is_in_activity_staus==3){
              is_hide_pay=1;
              is_in_activity_content='抱歉，今天的礼品已抢领完毕，请明天继续抢领，谢谢！';
            }
            that.setData({
              is_in_activity_staus:is_in_activity_staus,
              is_in_activity_count_show_id:is_in_activity_count_show_id,
              is_in_activity_content:is_in_activity_content,
              is_hide_pay:is_hide_pay,
            })
        }
        that.setData({
          bill_payment_id:Number(options.bill_payment_id),
          out_trade_no: options.out_trade_no,
          total_amount: options.total_amount,
          profit_sharing: options.profit_sharing,
          deductBalance: options.deductBalance,
          isPostPay: options.isPostPay,
          bill_main_id: Number(options.bill_main_id),
        })
        //this.selectMerchandiseBillMainPayVo();
	},
	
    selectMerchandiseBillMainPayVo(){
      //var url=app.globalData.selectMerchandiseBillMainPayVo_url;
      var that=this;
      wx.request({
        url: app.globalData.selectMerchandiseBillMainPayVo_url,
        header: {
          'content-type': 'application/json;charset=utf-8' // 默认值
      },
      method: 'POST',
        data: {
          merchandise_bill_main_id: that.data.merchandise_bill_main_id
        },
        success: res => {
          console.log(res);
          if(res.data.code==1){
            var obj=res.data.data;
            var profit_sharing=0;
            if(obj.lstInviteVo.length>0){
              profit_sharing=1;
              that.setData({
                set_meal_id:obj.lstInviteVo[0].set_meal_id,
              })
            }
            that.setData({
              out_trade_no:obj.out_trade_no,//订单号
              sub_merchants_id:obj.sub_merchants_id,//商家商户号
              merchandise_bill_main_id:obj.id,//主表id
              total_amount:obj.total_amount,//支付金额
              openid:obj.openid,//支付人openid
              profit_sharing:profit_sharing,//是否分账
              shop_id:obj.shop_id,
              percent_total:obj.percent_total,//分账金额
              invite_openid:obj.invite_openid,
              shopName:obj.shop_name,
              topimage:obj.topimage,
              lstInviteVo:obj.lstInviteVo,
              set_meal_id:obj.set_meal_id
             })
          }   
        }
    })

	},
	
    startInter : function(){
        var that = this;
        if(that.data.inter!=null){
            return;
        }
        that.data.inter= setInterval(
            function () {
                // TODO 你需要无限循环执行的任务
                that.selectMerchandiseWxPayDetailedExists();
                console.log('setInterval 每过2000毫秒执行一次任务')
            }, 5000);    
	},
	
    endInter: function(){
          try{
            var that = this;
            that.clearInterval(that.data.inter)
            that.data.inter=null;
            
          }catch(e){

          }
	},
	
    selectMerchandiseWxPayDetailedExists(){
        //实际支付过程中，用户支付完毕，不点击确定按钮，则支付成功，也不会有成功回调
        //

      var that=this;
      wx.request({
        url: app.globalData.selectMerchandiseWxPayDetailedExists_url,
        header: {
          'content-type': 'application/json;charset=utf-8' // 默认值
      },
      method: 'POST',
        data: {
            out_trade_no: that.data.out_trade_no
        },
        success: res => {       
          if(res.data.code==1){
              if(res.data.data>0){
                that.goResult();
              }
          }   
        }
    })

    },
 
    goHome: function (e) {        
      wx.reLaunch({
        url: '/pages/mall/pages/index/index',
      })
    },
    
    goBill: function (e) {		
      wx.navigateTo({
        url: '/pages/module_discount/pages/allorders/allorders?status=0',
      })
    },

    pay1: function () {
      //this.startInter();
      this.pay()
	  },
	
    pay: function () {
      var that=this;
      var attachObj={
        bill_payment_id: that.data.bill_payment_id,  
        bill_main_id: that.data.bill_main_id      
      };      
      var attach=JSON.stringify(attachObj);        
      var payParmData={
        appid: 'wx78455227a0fd853f',           //公众号appid-诗么普id
        // appid: 'wx91f23c5fa6378695',           //公众号appid-孟奔id
        mch_id: '1525534221',                  //服务商-诗么普id
        // mch_id: '1509704181',                  //服务商-孟奔id
        //mch_id: '1509776181',
        // sub_appid: "wx7601bb0ab62f48aa",       //小程序appid
        sub_appid: "wx7601bb0ab62f48aa",       //小程序appid
        sub_mch_id: '1615440524',           //特约商户-孟奔id
        body: '请到订单详情查看',
        out_trade_no: that.data.out_trade_no,
        attach:attach,
        total_fee: parseInt(that.data.total_amount*100),
        trade_type: 'JSAPI',
        openid: app.globalData.openid,
        profit_sharing: that.data.profit_sharing,
        isPostPay: that.data.isPostPay
      }
     
      wx.request({
        url:  app.globalData.allUrl.wxPayPlusMallService,
        method: "GET",
        data: payParmData,
        success: function (res) {
          console.log(res);
          if (res.statusCode == 500){
            wx.showToast({
              title: '服务器错误',
              icon:'error',
            })
            return
          }else if (res.data[0].result_code == 'FAIL'){
            if(res.data[0].err_code_des == '该订单已支付'){
              wx.showToast({
                title: '已支付完成',
              })
            }else{
              wx.showToast({
                title: '未知错误...',
                icon:'error'
              })
            }

            return;
          }else{
            //支付
            wx.requestPayment({
              'timeStamp': res.data[0].timeStamp,
              'nonceStr': res.data[0].nonceStr,
              'package': res.data[0].package,
              'signType': res.data[0].signType,
              'paySign': res.data[0].sign,
              'success': function (res) {
                wx.showToast({
                  title: '支付成功',
                }) 
                that.deductBalance();
                that.goResult();
               
              },'fail': function (res){
                wx.showToast({
                  title: '支付失败',
                  icon:'error'
                })

              }
            })
          }
        }
      })
  },
  
  deductBalance(){
    let that = this
    //已在写单时处理
    return;

    var bill_payment_id=this.data.bill_payment_id?this.data.bill_payment_id:0;
    var bill_main_id=this.data.bill_main_id?this.data.bill_main_id:0;
      wx.request({
        url: app.globalData.deductionMallMemberTotalRechargeAmount_url,
        method: "POST",
        data: {
          customer_openid: app.globalData.openid,
          deduction_amount: that.data.deductBalance,
          bill_payment_id:bill_payment_id,
          bill_main_id:bill_main_id
        },
        success: function (res) {
        }
      })

    
  },
	
    goResult(){
        //this.endInter();
        var resultUrl='../paymerchandiseresult/paymerchandiseresult'
        wx.navigateTo({
          url: resultUrl,
        })
        
	},
	
    selectOneMerchandiseWxPayDetailed:function(out_trade_no,sub_mch_id){
      console.log("selectOneMerchandiseWxPayDetailed");
      var that=this;
      wx.request({
        url: app.globalData.allUrl.selectOneMerchandiseWxPayDetailed,
        method: 'GET',
        data: {out_trade_no:out_trade_no},
        success(e){
          if(e.data.result != 0){
            let transaction_id = e.data.object.transaction_id;
            for(var i=0;i<that.data.lstInviteVo.length;i++){
              console.log("进入循环");
              var inviteObj=that.data.lstInviteVo[i];
              that.wxProfitSharing(out_trade_no,sub_mch_id,inviteObj.invite_openid,inviteObj.percent_total,transaction_id)
            }
            
          }else{
            console.log(e)
            return
          }
        },
        fail(e){
          back('访问超时',e,'fail')
        }
      })
	},
	
    wxProfitSharing:function(out_trade_no,sub_mch_id,inviteOpenId,percent_total,transaction_id){
        console.log("进入分销");
        console.log("out_trade_no:"+out_trade_no);
        console.log("sub_mch_id:"+sub_mch_id);
        console.log("openid:"+inviteOpenId);
        
        percent_total=percent_total*100;
        percent_total=parseInt(percent_total);

        console.log("percent_total："+percent_total);
        //selectOneMerchandiseWxPayDetailed
        var that=this;

        wx.request({
          url: app.globalData.allUrl.wxPayProfitsharing,
          method: 'GET',
          data: {
            appid:'wx78455227a0fd853f',
            sub_appid: 'wx7601bb0ab62f48aa',
            //mch_id: '1525534221',
            mch_id: '1509776181',
            sub_mch_id: sub_mch_id,
            open_id: inviteOpenId,
            transaction_id: transaction_id,
            description: '分账',
            amount: percent_total
          },
          success(e){
            console.log(e)
            if (e.data[0].err_code == 'ORDER_NOT_READY') {
              that.wxProfitSharing(out_trade_no,sub_mch_id,inviteOpenId,percent_total,transaction_id);
            }else{
              console.log("分账成功")
            }
          },
          fail(e){
            console.log("访问超时")
          }
        })
    },
    
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },
    //selectCustomerShoppingCartExists
    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      //this.selectSingleShop();
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
        this.endInter()
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
    selectSingleShop(){
      var that=this;
      wx.request({
        url: app.globalData.selectSingleShop,        
        method: 'GET',
        data: {                
            shop_id: 8888,                       
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
            if(res.data.code == 1000){
                 console.log(res.data.data);
                 var shopVo=res.data.data;
                 that.setData({
                    platform_member_rule_url:shopVo.platform_member_rule_url,
                 })
            }                                
        },
        fail:function(err){
          wx.showToast({
            title: '网络异常1',
            icon:'error'
          })
        },
    })
    },
    closeIsInActivityStaus(){
      this.setData({
        is_in_activity_staus:0,
      })
    },
})