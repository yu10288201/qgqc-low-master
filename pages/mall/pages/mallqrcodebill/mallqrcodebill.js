const app = getApp()
Page({
	/**
	 * 页面的初始数据
	 */
	data: {
    //跳转传入
    customer_id: 0,
    //跳转传入
    shop_id: 0,
    shop_name:'',
    shop_total_color_global_voucher:0,
    shop_total_star:0,
    platform_total_color_global_voucher:0,
    platform_total_star: 0,

    //订单主表相关
    customer_total_amount:0,
    customer_total_amount_str:'',
    deduction_star:0,
    
    deduction_star_amount:0,
    deduction_star_amount_str:'',
    deduction_platform_color_global_total_voucher:0,
    deduction_shop_color_global_total_voucher:0,
    deduction_color_global_total_voucher:0,

    total_amount:0,
    deduction_shop_star:0,
    deduction_platform_star:0,
    show_insert_btn:true,
    code:'',
    staff_id:0,
    buyer_password:'',
    buyer_password_ok:0,
    gen_bill_main:0,
    //扫员工码抵扣生成的唯一码
    scan_uuid:'',
    
  },
  
 
	// 监听用户触底事件，加载下一页数据
	onPageScroll: function (e) {
		
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    var that = this;
    //this.genCode();
    this.execPGetBillDayCode();
    console.log(options);
    if(options.shop_id){
      this.setData({
        shop_id:Number(options.shop_id),
      })
    }
    if(options.customer_id){
      this.setData({
        customer_id:Number(options.customer_id),
      })
    }
    if(options.staff_id){
        this.setData({
            staff_id:Number(options.staff_id),
        })
    }
    if(options.scan_uuid){
        this.setData({
            scan_uuid:options.scan_uuid,
        })
    }
    //this.initCurrentDate(); 
    this.selectMallPersonelMemberInfo();
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
  onShareAppMessage: function (e) {

      
      
      // var that = this;   
      // var benefit_item=this.data.benefit_item;

      // if(!benefit_item){
      //   wx.showToast({
      //     title: '无分享内容',
      //   })
      //   return;
      // }

      // var title = '' + benefit_item.name;
      // var imgUrl = benefit_item.share_img_url;
      // var goods_id=benefit_item.goods_id;
      // var shop_id=benefit_item.shop_id;
      // var article_template_main_id=benefit_item.id;
      // var main_uid=this.data.main_uid;
      // var send_customer_id=this.data.associate_id;

      // console.log(imgUrl);
      // let shareObj = {
      //     title: title,
      //     path: 'pages/mall/pages/mallbasearticletemplatedetailresult/mallbasearticletemplatedetailresult?bind_type=3&associate_type=2&' + 
      //     'shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +
      //     '&goods_id=' + goods_id+'&article_template_main_id='+article_template_main_id+'&main_uid='+main_uid+'&send_customer_id='+send_customer_id,
      //     imageUrl: imgUrl,
      //     success: function (res) {
      //         if (res.errMsg == 'shareAppMessage:ok') {
                  
      //         }
      //         wx.showToast({
      //           title: '发送成功！',
      //         })
      //     },
      //     fail: function (res) {
      //         if (res.errMsg == 'shareAppMessage:fail cancel') {
      //             that.hide();
      //         } else if (res.errMsg == 'shareAppMessage:fail') {
      //             that.hide();
      //         }
      //     },
      // };              
      // return shareObj;
            
      
   },
  onShareTimeline: function () {
          
          // var that = this;   
          // var benefit_item=this.data.benefit_item;

          // console.log("onShareTimeline")
          // console.log(benefit_item)
          // if(!benefit_item){
          //   wx.showToast({
          //     title: '无分享内容',
          //   })
          //   return;
          // }

          // var title = '' + benefit_item.name;
          // var imgUrl = benefit_item.share_img_url;
          // var goods_id=benefit_item.goods_id;
          // var shop_id=benefit_item.shop_id;
          // var article_template_main_id=benefit_item.id;
          // var main_uid=this.data.main_uid;
          
          // if(this.data.is_single==false){
          //   var send_data={
          //     main_uid:main_uid,
          //     name:title,
          //     shop_id:shop_id,
          //     send_customer_id:app.globalData.customerInf.id,
          //     article_template_main_id:article_template_main_id,
          //     is_wx:0,
          //     is_pyq:1
          //   }
          //   this.insertOrUpdateMallBaseArticleEffectMain(send_data);
          // }
          
          // var path='bind_type=3&associate_type=2' + '&shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +'&goods_id=' + goods_id+'&article_template_main_id='+article_template_main_id+'&main_uid='+main_uid+"&benefit_type=2";

          // console.log("分享朋友圈:"+path);
          // console.log("广告图片:"+imgUrl);
          // return {
          //     title: title,
          //     path: path,
          //     imageUrl: imgUrl
          // }
  },
  
  // 下拉刷新
  onRefresh() {
    
  },
  loadMore(){
  
  },
  selectMallPersonelMemberInfo(){
    //分页查询已完成模板
    let that = this

    var customer_id=this.data.customer_id;
    var shop_id=this.data.shop_id;

    //测试

    
    //测试 
    if(customer_id<=0){
      wx.showToast({
        title: 'customer_id为空',
        icon:'none',
      })
      return;
    }
    if(shop_id<=0){
      wx.showToast({
        title: 'shop_id为空',
        icon:'none',
      })
      return;
    }

    wx.request({
        url: app.globalData.selectMallPersonelMemberInfo,        
        method: 'POST',
        data: {         
          customer_id:customer_id,
          shop_id:shop_id
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            if(res.data.code == 1000){
              var data = res.data.data;
              that.setData({
                shop_name:data.shop_name,
                shop_total_color_global_voucher:data.shop_total_color_global_voucher,
                shop_total_star:data.shop_total_star,
                platform_total_color_global_voucher:data.platform_total_color_global_voucher,
                platform_total_star: data.platform_total_star,
              })
              // that.setData({
              //   shop_total_color_global_voucher:15,
              //   shop_total_star:21,
              //   platform_total_color_global_voucher:22,
              //   platform_total_star: 13,
              // })
            }                                
        },
        fail(res){
          wx.showToast({
            title: '获取失败:'+res.data.msg,
            icon:'error',
            duration: 2000,
          }) 
        }
      })

  },
  getIntValue(value){
    var defValue=0;
    try{
      var rValue=parseInt(value);
      if(rValue){
        return rValue;
      }else{
        return defValue;
      }
    }catch(e){
      return defValue;
    }
  },
  getFloatValue(value){
    var defValue=0;
    try{
      var rValue=parseFloat(value);
      if(rValue){
        var strValue=rValue.toString();
        if(strValue.indexOf(".")>=0){
          var tmpStr=strValue.split('.')[1];
          if(tmpStr.length>2){
            return rValue.toFixed(2);
          }
        }
        return rValue;
      }else{
        return defValue;
      }
    }catch(e){
      return defValue;
    }
  },
  genBillMainParamPre(){
    //platform_total_color_global_voucher+shop_total_color_global_voucher
    


    var customer_total_amount= this.getFloatValue(this.data.customer_total_amount_str);
    if(customer_total_amount<=0){
      wx.showToast({
        title: '消费总金额异常！',
        icon:'error'
      })
      return false;
    }

    var deduction_star_amount=this.getIntValue(this.data.deduction_star_amount_str);
    if(deduction_star_amount<0){
        wx.showToast({
          title: '抵扣星盾异常！',
          icon:'error'
        })
        return false;
    }

    if(deduction_star_amount>customer_total_amount){
      wx.showToast({
        title: '抵扣星盾过多！',
        icon:'error'
      })
      return false;
    }

    if(this.data.platform_total_color_global_voucher>0||this.data.shop_total_color_global_voucher>0){
        this.checkCustomerPassword();
      }else{
        this.genBillMainParam();
      }
  },
  genBillMainParam(){
    //deduction_platform_color_global_total_voucher+deduction_shop_color_global_total_voucher==0
    var deduction_star_amount=this.getIntValue(this.data.deduction_star_amount_str);
    this.setData({
      deduction_star_amount:deduction_star_amount,
    })

    if(deduction_star_amount<0){
        wx.showToast({
          title: '抵扣星盾异常！',
          icon:'error'
        })
        return false;
    }

    deduction_star_amount=deduction_star_amount.toFixed(2);
    var platform_total_star=this.data.platform_total_star;
    var shop_total_star=this.data.shop_total_star;

    var customer_total_amount= this.getFloatValue(this.data.customer_total_amount_str);

    if(customer_total_amount<=0){
      wx.showToast({
        title: '消费总金额异常！',
        icon:'error'
      })
      return false;
    }
    if(deduction_star_amount<0){
      wx.showToast({
        title: '星盾抵扣金额异常！',
        icon:'error'
      })
      return false;
    }
    if(deduction_star_amount>customer_total_amount){
      wx.showToast({
        title: '抵扣星顿设置过多！',
        icon:'error'
      })
      return false;
    }
    var deduction_star=Math.ceil(deduction_star_amount*10);

    if( (platform_total_star+shop_total_star)<deduction_star){
      wx.showToast({
        title: '星盾不足！',
      })
      return false;
    }

    
    var actual_total_amount=customer_total_amount;
    var deduction_amount=0;

    var deduction_shop_star=0;
    var deduction_platform_star=0;

    if(shop_total_star>0){
          if(deduction_star<=shop_total_star){
            deduction_shop_star=deduction_star;
            deduction_platform_star=0;
        }else{
            deduction_shop_star=shop_total_star;
            
        }
    }

    var leave_star=deduction_star-deduction_shop_star;
    if(leave_star>0&&platform_total_star>0){
        if(leave_star<=platform_total_star){
          deduction_platform_star=leave_star;
          leave_star=0;
        }else{
            deduction_platform_star=platform_total_star;
            leave_star=leave_star-platform_total_star;
        }
    }
    if(deduction_shop_star+deduction_platform_star!=deduction_star){
      wx.showToast({
        title: '星盾抵扣计算异常！',
      })
      return false;
    }
    var leave_amount=customer_total_amount-deduction_amount-deduction_star_amount;

    var shop_total_color_global_voucher=this.data.shop_total_color_global_voucher;
    var platform_total_color_global_voucher=this.data.platform_total_color_global_voucher;

    var deduction_shop_color_global_total_voucher=0;
    var deduction_platform_color_global_total_voucher=0;

    var total_amount=0;

    if(leave_amount>0){
      //计算店铺的代金券
      if(leave_amount<=shop_total_color_global_voucher){
        deduction_shop_color_global_total_voucher=leave_amount;
        leave_amount=0;
      }else{
        leave_amount=leave_amount-shop_total_color_global_voucher;
        deduction_shop_color_global_total_voucher=shop_total_color_global_voucher;
      }
    }

    if(leave_amount>0){
      //计算平台的代金券
      if(leave_amount<=platform_total_color_global_voucher){
        deduction_platform_color_global_total_voucher=leave_amount;
        leave_amount=0;
      }else{
        leave_amount=leave_amount-platform_total_color_global_voucher;
        deduction_platform_color_global_total_voucher=shop_total_color_global_voucher;
      }
    }

    total_amount=leave_amount;
    this.setData({
      deduction_platform_color_global_total_voucher:deduction_platform_color_global_total_voucher,
      deduction_shop_color_global_total_voucher:deduction_shop_color_global_total_voucher,
      deduction_color_global_total_voucher:deduction_platform_color_global_total_voucher+deduction_shop_color_global_total_voucher,
      total_amount:total_amount,
      deduction_shop_star:deduction_shop_star,
      deduction_platform_star:deduction_platform_star,
      deduction_star:deduction_star,
      actual_total_amount:actual_total_amount,
      customer_total_amount:customer_total_amount,
      gen_bill_main:1,
    })

    return true;

  },
  insertQrCodeMallBillMain: function () {
	  console.log('insertQrCodeMallBillMain:')
     var that = this 
     //platform_total_color_global_voucher+shop_total_color_global_voucher
     if(this.data.platform_total_color_global_voucher>0
      ||this.data.shop_total_color_global_voucher>0){
        if(this.data.buyer_password_ok!=1){
          wx.showToast({
            title: '密码异常',
            icon:'error'
          })
          return;
        }
    }



    if(this.data.gen_bill_main==0){
      if(this.data.buyer_password_ok!=1){
        wx.showToast({
          title: '请先确定消费总金额',
          icon:'error'
        })
        return;
      }
    }
    if(this.genBillMainParam()==false){
      return;
    }


      var data={
        code:this.data.code,
        scan_uuid:this.data.scan_uuid,
        shop_id: this.data.shop_id,
        scan_staff_goods_id:0,
        scan_staff_customer_id:this.data.staff_id,
        card_is_in_activity:0,
        is_staff_special_commission:0,
        buyer_id: this.data.customer_id,
        buyer_password:this.data.buyer_password,
        buyer_type: 1,
        bill_type: 3,
        buyer_address_id: 0,
        remark: '',
        customer_total_amount:this.data.customer_total_amount,
        actual_total_amount:this.data.actual_total_amount,
        deduction_amount: this.data.deduction_amount,
        deduction_star:this.data.deduction_star,
        deduction_shop_star:this.data.deduction_shop_star,
        deduction_platform_star:this.data.deduction_platform_star,
        deduction_color_global_total_voucher:this.data.deduction_color_global_total_voucher,
        deduction_platform_color_global_total_voucher:this.data.deduction_platform_color_global_total_voucher,
        deduction_shop_color_global_total_voucher:this.data.deduction_shop_color_global_total_voucher,
        give_color_global_total_voucher:0,
        total_amount: this.data.total_amount,    
        shop_settlement_amount:0,   
      }
   
      wx.showLoading();
     wx.request({
      url:  app.globalData.insertQrCodeMallBillMain,
      method: 'POST',
      data: data,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();
        if(res.data.code == 1000){
            wx.showToast({
              title: '抵扣成功',
              icon:'none'
            })
            that.setData({
              show_insert_btn:false,
            })
          
      
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
      },
      fail:function(error){
        wx.hideLoading();
        wx.showToast({
          title: '网络异常',
        })
      }
	})	
  },
  execPGetBillDayCode(){
          console.log('insertQrCodeMallBillMain:')
          var that = this 
          var data={
            bill_type:'mall_bill_main',
          }
          wx.request({
          url:  app.globalData.execPGetBillDayCode,
          method: 'POST',
          data: data,
          header: {
            'content-type': 'application/json'
          },
          success: function (res) {
            wx.hideLoading();
            if(res.data.code == 1000){
                that.setData({
                  code:res.data.data,
                })
            }else{
                 
            }
          },
          fail:function(error){
            wx.hideLoading();
            wx.showToast({
              title: '网络异常',
            })
          }
      })	
  },

  checkCustomerPassword(){
    console.log('checkCustomerPassword:')
    var that = this 
    var buyer_id=this.data.customer_id;
    var buyer_password=this.data.buyer_password;

    if(buyer_password==''){
      wx.showToast({
        title: '请输入密码',
      })
      return;
    }

    var data={
      buyer_id:buyer_id,
      buyer_password:buyer_password,

    }
    wx.request({
    url:  app.globalData.checkCustomerPassword,
    method: 'POST',
    data: data,
    header: {
      'content-type': 'application/json'
    },
    success: function (res) {
      wx.hideLoading();
      if(res.data.code == 1000){
        that.setData({
          buyer_password_ok:1,
        })
        that.genBillMainParam();
           wx.showToast({
             title: '密码正确',
             icon:'none'
           })
           
      }else{
        wx.showToast({
          title: '密码错误',
          icon:'error'
        })
      }
    },
    fail:function(error){
      wx.hideLoading();
      wx.showToast({
        title: '网络异常',
      })
    }
})	
},
  genCode(){
        var s = [];

        var hexDigits = "0123456789abcdef";
      
        for (var i = 0; i < 36; i++) {
      
          s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      
        }
        s[14] = "4"; 
      
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
      
        s[8] = s[13] = s[18] = s[23] = "-";
      
        var uuid = s.join("");
        uuid=uuid.replace(/-/g, '').substring(0,20);
        this.setData({
          code:uuid,
        })
        return uuid
  },
})