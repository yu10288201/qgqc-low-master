var util = require('../../../../utils/util.js');
var app = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        
        log_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/mall_log.png',
        //当前余额
        //领取方式
        receive_type:0,
        channel_type:0,
        showDQQR:false,
        showLPQR:false,
        showQR: false,
        mall_member_total_recharge_amount:0,
        mall_member_total_recharge_amount_after:0,
        submit_gift:'',
        //规则列表
        rule_array:[],
        id:0,
        shop_id:8888,
        rule_name:'',
        rule_content:'',
        gift_content:'',
        //预存金额
        recharge_amount:'',
        //赠送金额
        give_amount:'',
        //有效天数
        effective_day_count:'',
        deduction_percentage:'',
        state_id:1,
        state_id_array: ['停用', '启用'],
        scroll_height: 0,
        scroll_height2: 0,
        listIndex:-1,
        member_rule_content_sel:[],
        mall_member_consumption_record_item:null,

        //如果充值后礼品领取方式为邮寄所需要的信息
        customer_address_id:0,//customer_address表的id
        name:'',//收件人姓名
        mobile:'',//收件人收件号
        detail_address:'',//收件人地址
        recharge_record_item:null,
        platform_member_rule_url:'',
    },

    wxLoginSelectMallMemberTotalRechargeAmount(){
      var that=this;
      wx.login({
        success: function (res) {
          if (res.code) {
            console.log(res)
            var code = res.code
            wx.request({
              url: app.globalData.allUrl.getUnionID,
              data: {
                wechatAppId: app.getWechatAppId(),                  
                code: code,
                encryptedData: '',
                iv: '',
              },
              header: {
                'content-type': 'application/json;charset=utf-8' // 默认值
              },
              method: 'POST',
              success: function (res) {
                console.log(res, "unionId和openId")
                app.globalData.unionID = res.data.data.unionId
                app.globalData.openid = res.data.data.openid 
                
                that.selectMallMemberTotalRechargeAmount();
                
              }
            })
          }
        }
      })

    },

    showErrMsg(msg,icon='error'){
      wx.showToast({
        title: ''+msg,
        icon:icon,
      })
    },

    closeQRCode(){
      this.setData({
        showQR: false
      })
    },

    showQRCode() {           
      this.setData({
          showQR: true,
      }, () => {
          wx.showLoading({
              title: '生成中...',
          })
      })
      let qrt = app.getServerUrl()+'/QRCodeToRecharge/'		
      wx.downloadFile({
          url: app.getServerUrl()+'/IMG/%E5%88%87%E7%93%9C%E5%88%87%E8%8F%9C/logo.png',
          success: res => {            
              require('../../../../utils/qrcode.min.atim.js')({
                  width: 200,
                  height: 200,
                  x: 0,
                  y: 0,
                  canvasId: 'rechargeQrcode',
                  typeNumber: 13,
                  text: qrt,
                  image: {
                      imageResource: res.tempFilePath,
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
          }
      })
    },

    itemClick(e){
      var item=e.currentTarget.dataset.item;
      var index=e.currentTarget.dataset.index;

     
      if(item){
        this.setData({
          id:item.id,
          shop_id:item.shop_id,
          rule_name:item.name?item.name:'',
          rule_content:item.rule_content?item.rule_content:'',
          gift_content:item.gift_content?item.gift_content:'',
          //预存金额
          recharge_amount:item.recharge_amount>0?item.recharge_amount:'',
          //赠送金额
          give_amount:item.give_amount>0?item.give_amount:'',
          //有效天数
          effective_day_count:item.effective_day_count>0?item.effective_day_count:'',
          deduction_percentage:item.deduction_percentage>0?item.deduction_percentage:'',
          state_id:item.state_id,
          listIndex:index,

        });


        var mall_member_total_recharge_amount_after=Number(this.data.mall_member_total_recharge_amount)
        +Number(this.data.give_amount)+Number(this.data.recharge_amount);
        
        mall_member_total_recharge_amount_after=Number(mall_member_total_recharge_amount_after).toFixed(2);
        
        this.setData({
          mall_member_total_recharge_amount_after:mall_member_total_recharge_amount_after,
        })

      }
    },
    openRuleFile(e){
    
      var that=this;
      var ruleFileAddress='https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/XDYT/upload/20903/file/113513充整预存优惠规则.docx';
      ruleFileAddress=this.data.platform_member_rule_url;
      
      wx.downloadFile({ //运用微信自带的方法对该链接进行下载转换获取到临时的可供微信使用的链接
        url: ruleFileAddress,
  
        success(res2) {
          that.setData({
            tempFilePath: res2.tempFilePath
          })
          wx.openDocument({ //打开这个临时链接，也就是打开文件，这里可以两个方法整合在一起，作为一个打开文件按钮
            filePath: that.data.tempFilePath,
            success: function (res3) {
            },
            fail: function () {
              wx.showModal({
                title: '提示',
                content: '没有找到可以使用的打开工具',
              })
            }
          })
  
        }
      })

    },
    checkIsVip(e){

      
      var that=this;
      that.insertMallMemberRechargeRecord(e);
        // wx.request({
        //   url: app.globalData.checkIsMallVip,                
        //   method: 'POST',
        //   data: {
        //     customer_openid: app.globalData.openid,            
        //   },
        //   header: {
        //     'content-type': 'application/json'
        //   },
        //   success: function (res) {    
        //       if(res.data.code == 1000){
        //         if(res.data.data.is_vip == 1){
        //           wx.showModal({
        //             title: '您已经是VIP会员！有效期到：' + res.data.data.end_date,
        //             showCancel: false
        //           })
        //         }else{
                 
        //         }
        //       } 
        //   }
        // })
    },
    insertMallMemberRechargeRecord(e){

      var that = this;
      var lst=this.data.rule_array;
      var listIndex=this.data.listIndex;

      if(listIndex<0){
        that.showErrMsg("请选择充值套餐");
          return;
      }

      if(this.data.member_rule_content_sel.length==0){

        wx.showToast({
          title: '请先同意会员规则',
          icon:'none'
        })
        return;
    }

      if(lst.length<listIndex+1){
        wx.showModal({
          title: '提示',
          content: '请选择充值套餐!',
        })
        return;
      }
      //当前选择的充值套餐
      var item=lst[listIndex];
      
      if(item){
        
        if(this.data.channel_type!=2&&item.name=='充电充值会员'){
            wx.showToast({
              title: '充电会员才能选择该项',
              icon:'none'
            })
            return;
        }
      }else{

        that.showErrMsg("请选择充值套餐");
        return;
      }

      var customer_openid=app.globalData.openid;
      if(customer_openid==undefined||customer_openid==null||customer_openid==''){
          that.showErrMsg("openid为空");
          return;
      }

      console.log("app.globalData.enter_shop_id"+app.globalData.enter_shop_id)
      if(app.globalData.enter_shop_id){

      }else{
        app.globalData.enter_shop_id=8888;
      }

      var gift_content=item.rule_content?item.rule_content:'';
      var submit_gift=this.data.submit_gift?this.data.submit_gift:'';

      var receive_type=this.data.receive_type;
      if(gift_content!=''){
      
        if(submit_gift==''){
          wx.showToast({
            title: '请录入礼品序号',
            icon:'error',
          })
          return ;
        }
        if(receive_type==0){
          wx.showToast({
            title: '请选择礼品获取方式',
            icon:'error',
          })
          return ;
        }

      }


      var data={
          enter_shop_id:app.globalData.enter_shop_id,
          shop_id:item.shop_id,
          mobile:'',
          customer_id:0,
          customer_openid:customer_openid,
          member_recharge_rule_id:item.id,
          submit_gift:submit_gift,
          recharge_amount:item.recharge_amount,
          give_amount:item.give_amount,
          deduction_percentage:item.deduction_percentage,
          effective_day_count:item.effective_day_count,
          pay_type:0,
          receive_type:receive_type,
          is_payed:0,
          is_delete:0,
      }

      console.log(data);

      wx.request({
        url: app.globalData.insertMallMemberRechargeRecord,
        data:data,
        method:"POST",
        header:{
          'content-type': 'application/json'
        },
        dataType:"json",
        success:function(res){
          if(res.data.code==1000){
                //添加记录成功
                var recharge_record_item=res.data.data;
                console.log(recharge_record_item);
    
                that.recharge_record_wx_pay(recharge_record_item);

            }else{
                  that.showErrMsg(""+res.data.msg);
            }
        },
        fail:function(res){
          that.showErrMsg("网络异常");
        },
        complete:function(res){

        },
      })
      return;

    },
    //微信存入
    recharge_record_wx_pay: function wechat_pay(recharge_record_item) {
      var that = this;
      var item=recharge_record_item;
      this.setData({
        recharge_record_item:item,
      })
      var total_amount=item.recharge_amount;
      var receive_type=item.receive_type;
      var total_fee=parseInt(total_amount*100);

      var address_count=item.address_count;
      
      //测试代码开始----------
      //var total_fee=parseInt(0.39*100);
      //测试代码结束----------
      var profit_sharing=0;
      if(recharge_record_item.is_ddsc_staff_income==1){
        profit_sharing=1;
      }
      
      var attach={member_recharge_record_id:item.id};
          //新增预存优惠订单
          wx.request({
              url: app.globalData.allUrl.WxPayPlusMallMemberRechargeRecordWxPayService,
              method: "GET",
              data: {
                  //公众号appid
                  appid: 'wx78455227a0fd853f',
                  //商户号 诗么普
                  mch_id: '1525534221',
                  //小程序id
                  sub_appid: "wx7601bb0ab62f48aa",
                  //孟贲账户
                  sub_mch_id: app.globalData.shopdetail.sub_merchants_id ? app.globalData.shopdetail.sub_merchants_id : '1615440524',
                  //支付说明
                  body: '充值金额存入',
                  //订单号
                  out_trade_no: item.out_trade_no,
                  //支付接口
                  trade_type: 'JSAPI',
                  //支付金额(单位分)
                  total_fee: total_fee,                    
                  //用户openid
                  openid: app.globalData.openid,
                  profit_sharing:profit_sharing,
                  attach:attach,

              },
              success: function (res) {
                  console.log(res)
                  if (res.statusCode == 500) {
                      wx.showToast({
                          title: '服务器错误',
                          icon: 'none',
                          showCancel: false,
                          duration: 1000
                      })
                      return;
                  }
                  wx.requestPayment({
                      'timeStamp': res.data[0].timeStamp,
                      'nonceStr': res.data[0].nonceStr,
                      'package': res.data[0].package,
                      'signType': res.data[0].signType,
                      'paySign': res.data[0].sign,
                      'success': function (res) {
                          console.log(res)
                          wx.showToast({
                              title: '支付成功',
                              icon: 'success',
                              showCancel: false,
                              duration: 2000,
                              success:(e)=>{
                                wx.navigateTo({
                                  url: '/pages/module_discount/pages/customeraddresslist/customeraddresslist?from_page=scancodededuction',
                                })
                                // if(receive_type==2&&address_count<=0){

                                //   wx.navigateTo({
                                //     url: '/pages/module_discount/pages/customeraddress/customeraddress',
                                //   })
                                // }else{
                                //   that.jumpmingxi();
                                // }
                                
                              }
                          })
                         
                      },
                      'fail': function (res) {
                          console.log(res)
                          // wx.showModal({
                          //     title: '提示',
                          //     content: '支付失败',
                          //     showCancel: false,
                          // })
                        

                      }
                  })
              }
          })
    },

    onShow: function () {
       //查询总金额
       //this.selectMallMemberTotalRechargeAmount();
       this.wxLoginSelectMallMemberTotalRechargeAmount();
       this.selectSingleShop();
    },

    onLoad: function (options) {
        var that = this;
        if(options.channel_type){
          this.setData({
            channel_type:Number(options.channel_type),
          })
        }
        
        this.initData();
        this.qgqcStaffBindCustomer(options);

    },
    qgqcStaffBindCustomer(options){
      console.log("options:")
      console.log(options);
      var that=this;
      if (options.q) {		
        let url = decodeURIComponent(options.q)      
        console.log('url' + url)
        if (url.indexOf('https://') != -1 && url.indexOf('bind_type=') != -1 && url.indexOf('associate_type=') != -1) {			
          let str1 = decodeURIComponent(url).substring(decodeURIComponent(url).indexOf('?bind_type='))        
          let a = JSON.parse(str1.replace(/\?/g, "{\"").replace(/=/g, "\":\"").replace(/&/g, "\",\"") + "\"}")				
         
        
          app.globalData.enter_shop_id=Number(a.shop_id);
          app.globalData.enter_shop_id_inited=true;

          console.log("app.globalData.enter_shop_id:bindStaff"+app.globalData.enter_shop_id);
          
          var data={
            associate_id:Number(a.associate_id),
            associate_type: Number(a.associate_type),
            bind_type: Number(a.bind_type),
            shop_id: Number(a.shop_id),  
            goods_id: Number(a.goods_id),
            target_union_id:''     
          }

          if(app.globalData.unionID&&app.globalData.unionID!=''){
            data.target_union_id=app.globalData.unionID;
            //员工绑定客户
            that.bindCustomer(data);
            
          }else{

            
            that.wxLoginStaffBindCustomer(data)
          }
        }  
      }
    },
    wxLoginStaffBindCustomer(data){
      var that=this;
      wx.login({
        success: function (res) {
          if (res.code) {
            console.log(res)
            var code = res.code
            wx.request({
              url: app.globalData.allUrl.getUnionID,
              data: {
                wechatAppId: app.getWechatAppId(),                  
                code: code,
                encryptedData: '',
                iv: '',
              },
              header: {
                'content-type': 'application/json;charset=utf-8' // 默认值
              },
              method: 'POST',
              success: function (res) {
                console.log(res, "unionId和openId")

                app.globalData.unionID = res.data.data.unionId
                app.globalData.openid = res.data.data.openid 

                data.target_union_id=app.globalData.unionID;
                that.bindCustomer(data);
                
              }
            })
          }
        }
      })

    },
    bindCustomer(data){
      // var data={
      //   shop_id: that.data.shop_id,
      //   bind_type: that.data.bind_type,
      //   associate_type: that.data.associate_type,
      //   associate_id: that.data.associate_id,
      //   goods_id: that.data.goods_id,						
      //   target_union_id: unionID,
      // }

      let that = this
      wx.request({
        url: app.globalData.insertMallBindRecord_url,                               
        data: data,
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
            console.log(res);
        },
        fail: res=>{
          that.showMsg("网络异常");
           console.log("绑定失败:" + res.data.msg)
        }
      })
    },
    initData(){
      this.setData({
        showDQQR:false,
        showLPQR:false,
        mall_member_total_recharge_amount:0,
        submit_gift:'',
        //规则列表
        rule_array:[],
        id:0,
        shop_id:8888,
        name:'',
        rule_content:'',
        gift_content:'',
        //预存金额
        recharge_amount:'',
        //赠送金额
        give_amount:'',
        //有效天数
        effective_day_count:'',
        deduction_percentage:'',
        mall_member_consumption_record_item:null,
        listIndex:-1,
      })
      this.selectMallMemberRechargeRuleShopUse(); 
     
    },
    selectMallMemberRechargeRuleShopUse(){
      var that=this;
      wx.request({
        url: app.globalData.selectMallMemberRechargeRuleShopUse,
        data: {shop_id:8888},
        header: {
            'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
            
            if(res.data.code==1000){
                  var rule_array=res.data.data;
                  that.setData({
                    rule_array:rule_array,
                  })

            }else{
                  that.showErrMsg(""+res.data.msg);
            }
        }
      })

    },
    selectMallMemberTotalRechargeAmount(){
      var that=this;

      var customer_openid=app.globalData.openid;
      if(customer_openid==undefined||customer_openid==null||customer_openid==''){
          that.showErrMsg("openid为空");
          return;
      }
      wx.request({
        url: app.globalData.selectMallMemberTotalRechargeAmount,
        data: {customer_openid:customer_openid},
        header: {
            'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
            if(res.data.code==1000){
                  var mall_member_total_recharge_amount=res.data.data;
                  mall_member_total_recharge_amount=Number(mall_member_total_recharge_amount).toFixed(2);

                  that.setData({
                    mall_member_total_recharge_amount:mall_member_total_recharge_amount,
                  })

            }else{
                  that.showErrMsg(""+res.data.msg);
            }
        }
      })

    },
    selectMallMemberConsumptionRecordByOpenid(){
      console.log("selectMallMemberConsumptionRecordByOpenid")
      var that=this;
      var customer_openid=app.globalData.openid;
      if(customer_openid==undefined||customer_openid==null||customer_openid==''){
          that.showErrMsg("openid为空");
          return;
      }
      var showDQQR=this.data.showDQQR;
      console.log("showDQQR:"+showDQQR)
      if(showDQQR==false){
        return;
      }
      var mall_member_consumption_record_item=this.data.mall_member_consumption_record_item;
      console.log("mall_member_consumption_record_item："+mall_member_consumption_record_item)
      if(mall_member_consumption_record_item){
        if(mall_member_consumption_record_item.is_customer_confirm==0){
          return;
        }
      }

      console.log("开始调用selectMallMemberConsumptionRecordByOpenid")

      wx.request({
        url: app.globalData.allUrl.selectMallMemberConsumptionRecordByOpenid,
        data: {customer_openid:customer_openid},
        header: {
            'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          console.log("selectMallMemberConsumptionRecordByOpenid")
            console.log(res)
            if(res.data.code==1000){
                  var mall_member_consumption_record_item=res.data.data;

                  that.setData({
                    mall_member_consumption_record_item:mall_member_consumption_record_item,
                  })

            }else{
              that.setData({
                mall_member_consumption_record_item:null,
              })
            }
            setTimeout(function(){
              that.selectMallMemberConsumptionRecordByOpenid();
            },3500);
        },
        fail:function(res){
          console.log(res);
        },
        complete:function(res){
          console.log(res)
        },
      })

    },
    updateMallMemberConsumptionRecordIsCustomerConfirm(e){
      var that=this;
      var mall_member_consumption_record_item=this.data.mall_member_consumption_record_item;
      console.log("mall_member_consumption_record_item："+mall_member_consumption_record_item)
      if(mall_member_consumption_record_item){
        if(mall_member_consumption_record_item.is_customer_confirm==1){
          this.showErrMsg("请勿重复确认")
          return;
        }
      }else{
        return;
      }

      wx.request({
        url: app.globalData.allUrl.updateMallMemberConsumptionRecordIsCustomerConfirm,
        data: {id:mall_member_consumption_record_item.id},
        header: {
            'content-type': 'application/json'
        },
        method: 'POST',
        success: function (res) {
          console.log("selectMallMemberConsumptionRecordByOpenid")
            console.log(res)
            if(res.data.code==1000){
                  that.setData({
                    mall_member_consumption_record_item:null,
                  })
                  that.selectMallMemberConsumptionRecordByOpenid();

            }else{
              that.showErrMsg(""+res.data.msg);
            }
        },
        fail:function(res){
          console.log(res);
        },
        complete:function(res){
          console.log(res)
        },
      })



    },
    jumpmingxi: function () {
        wx.navigateTo({
            url: '/pages/mall/pages/balance_list/balance_list',
        });
    },
    returnBack: function () {
      wx.reLaunch({
        url: '/pages/mall/pages/index/index',
      })
    },

    closeDQQRCode(){
      this.setData({
        showDQQR: false
      })
    },
	  showDQQRCode() {    
      var that=this;    
        var log_img=this.data.log_img;  
        var openid=app.globalData.openid;
        if(openid){

        }else{
          this.showErrMsg("openid异常")
          return;

        }
        
        this.setData({
                    showDQQR: true,
                }, () => {
                  that.selectMallMemberConsumptionRecordByOpenid();
                    wx.showLoading({
                        title: '生成中...',
                    })
                })

            let qrt = 'openid='+app.globalData.openid;

            console.log('qrt:' + qrt)
                wx.downloadFile({
                    //url: 'https://mb.fsmbdlkj.com/IMG/%E5%88%87%E7%93%9C%E5%88%87%E8%8F%9C/logo.png',
                    url:log_img,
                    success: res => {
                        console.log(res.tempFilePath)
                        require('../../../../utils/qrcode.min.atim.js')({
                            width: 200,
                            height: 200,
                            x: 0,
                            y: 0,
                            canvasId: 'dqQrcode',
                            typeNumber: 13,
                            text: qrt,
                            image: {
                                imageResource: res.tempFilePath,
                                dx: 70,
                                dy: 70,
                                dWidth: 60,
                                dHeight: 60
                            },
                            callback(e) {
                                console.log('e: ', e)
                                wx.hideLoading({
                                    success: (res) => {},
                                })
                            }
                        })
                    }
                })
            },
    closeLPQRCode(){
              this.setData({
                showLPQR: false
              })
            },
    showLPQRCode() {   
                var log_img=this.data.log_img;       
                var openid=app.globalData.openid;
                if(openid){
        
                }else{
        
                  this.showErrMsg("openid异常")
                  return;
        
                }
                this.setData({
                            showLPQR: true,
                        }, () => {
                            wx.showLoading({
                                title: '生成中...',
                            })
                        })
        
                    let qrt = 'openid='+app.globalData.openid;
        
                    console.log('qrt:' + qrt)
                        wx.downloadFile({
                            // url: 'https://mb.fsmbdlkj.com/IMG/%E5%88%87%E7%93%9C%E5%88%87%E8%8F%9C/logo.png',
                            url:log_img,
                            success: res => {
                                console.log(res.tempFilePath)
                                require('../../../../utils/qrcode.min.atim.js')({
                                    width: 200,
                                    height: 200,
                                    x: 0,
                                    y: 0,
                                    canvasId: 'lpQrcode',
                                    typeNumber: 13,
                                    text: qrt,
                                    image: {
                                        imageResource: res.tempFilePath,
                                        dx: 70,
                                        dy: 70,
                                        dWidth: 60,
                                        dHeight: 60
                                    },
                                    callback(e) {
                                        console.log('e: ', e)
                                        wx.hideLoading({
                                            success: (res) => {},
                                        })
                                    }
                                })
                            }
                        })
                    },
            checkChange(e){
              console.log(e);
              var sel=e.detail.value;
              this.setData({
                member_rule_content_sel:sel,
              })

            },
            radioChanged(e){
              console.log(e)
              let receive_type = e.detail.value;
                this.setData({
                  receive_type : Number(receive_type)
                });

            },
            toAddressList(){
              wx.navigateTo({
                url: '/pages/module_discount/pages/customeraddresslist/customeraddresslist?from_page=scancodededuction',
              })
            },
            updateMallMemberRechargeRecordBuyerAddressId(){
              var that=this;
              var recharge_record_item=this.data.recharge_record_item;
              if(recharge_record_item==null){
                that.showErrMsg("无充值信息");
                return;
              }
              var buyer_address_id=this.data.customer_address_id;

              if(buyer_address_id<=0){
                that.showErrMsg("未选择地址");
                return;
              }
              recharge_record_item.buyer_address_id=buyer_address_id;

              wx.showLoading({
                title: '更新中',
              })

              wx.request({
                url: app.globalData.updateMallMemberRechargeRecordBuyerAddressId,
                data:recharge_record_item,
                method:"POST",
                header:{
                  'content-type': 'application/json'
                },
                dataType:"json",
                success:function(res){
                  wx.hideLoading();
                  if(res.data.code==1000){
                     
                       wx.showToast({
                         title: '更新地址成功',
                         icon:'success'
                       })        
                    }
                    // else{
                    //       that.showErrMsg(""+res.data.msg);
                    // }
                },
                fail:function(res){

                  wx.hideLoading();
                  that.showErrMsg("网络异常");
                  
                },
                complete:function(res){
        
                },
              })
              return;
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

})

