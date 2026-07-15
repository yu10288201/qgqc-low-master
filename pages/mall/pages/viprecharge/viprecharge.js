var util = require('../../../../utils/util.js');
var app = getApp();


Page({

    /**
     * 页面的初始数据
     */
    data: {
        shop_id:8888,
        member_rule_content_sel:[],
        platform_member_rule_url:'',
    },
    showErrMsg(msg,icon='error'){
      wx.showToast({
        title: ''+msg,
        icon:icon,
      })
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
        wx.request({
          url: app.globalData.checkIsMallVip,                
          method: 'POST',
          data: {
            customer_openid: app.globalData.openid,            
          },
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {    
              if(res.data.code == 1000){
                if(res.data.data.is_vip == 1){
                  wx.showModal({
                    title: '您已经是VIP会员！有效期到：' + res.data.data.end_date,
                    showCancel: false
                  })
                }else{
                  that.insertMallMemberVipRechargeRecord(e);
                }
              } 
          }
        })
    },
    insertMallMemberVipRechargeRecord(e){
      var that = this;
      var member_rule_content_sel=this.data.member_rule_content_sel;
      if(member_rule_content_sel.length==0){

        that.showErrMsg("请勾选权益规则");
        return;
      }

    
      var customer_openid=app.globalData.openid;
      if(customer_openid==undefined||customer_openid==null||customer_openid==''){
          that.showErrMsg("unionid为空");
          return;
      }
      if(app.globalData.enter_shop_id){

      }else{
        app.globalData.enter_shop_id=8888;
      }

      var data={
          enter_shop_id:app.globalData.enter_shop_id,
          shop_id:8888,
          mobile:'',
          customer_id:0,
          customer_openid:customer_openid,
          vip_recharge_amount:299,
          pay_type:0,
          is_payed:0,
          is_delete:0,
      }

      console.log(data);

      wx.request({
        url: app.globalData.insertMallMemberVipRechargeRecord,
        data:data,
        method:"POST",
        header:{
          'content-type': 'application/json'
        },
        dataType:"json",
        success:function(res){
          if(res.data.code==1000){
                //添加记录成功
                var vip_recharge_record_item=res.data.data;
                console.log(vip_recharge_record_item);
  
                that.vip_recharge_record_wx_pay(vip_recharge_record_item);

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
    vip_recharge_record_wx_pay: function wechat_pay(vip_recharge_record_item) {
      var that = this;
      var item=vip_recharge_record_item;
      var total_amount=item.vip_recharge_amount;
      var total_fee=Math.round(total_amount*100.00);

      var profit_sharing=0;
      if(vip_recharge_record_item.is_ddsc_staff_income==1){
        profit_sharing=1;
      }
    
      var attach={member_vip_recharge_record_id:item.id};
          //新增预存优惠订单
          wx.request({
              url: app.globalData.allUrl.WxPayPlusMallMemberVipRechargeRecordWxPayService,
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
      this.selectSingleShop();
    },

    onLoad: function (options) {
        var that = this;

        this.initData();
        this.qgqcStaffBindCustomer(options);

    },
    initData(){
      this.setData({
        shop_id:8888,
        member_rule_content_sel:[],
      })
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
   
    returnBack: function () {
      wx.reLaunch({
        url: '/pages/mall/pages/index/index',
      })
    },

    checkChange(e){
      console.log(e);
      var sel=e.detail.value;
      this.setData({
        member_rule_content_sel:sel,
      })

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

