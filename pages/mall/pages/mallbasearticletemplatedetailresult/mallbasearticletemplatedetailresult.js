const app = getApp()

//const { noneParamsEaseFuncs } = require('XrFrame/xrFrameSystem');
var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.js');

var qqmap = new QQMapWX({
  //在腾讯地图开放平台申请密钥 http://lbs.qq.com/mykey.html
  key: 'V2QBZ-KVOKQ-3QS5T-GDXJD-SNQFQ-GKBVE' //此处为个人秘钥,可用老板手机号申请公司的秘钥
});


Page({
	/**
	 * 页面的初始数据
	 */
	data: {
    article_template_detail_array:[],
    cut_introduction:'',
    enter_shop_id:0,//测试是否获取到了enter_shop_id
    associate_id: 0,
		associate_type: 0,
		bind_type: 0,
		shop_id: 0,
    goods_id: 0,
    name:'',
    article_template_main_id:0,
    article_template_main_item:{},
    video_first_img:'?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0,m_fast,ar_auto',
    only_title:false,
    is_single:false,
    only_index:0,
    cloudmsg_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/cloudmsg.png',
    main_uid:'',
    detail_uid:'',
    timer:null,
    is_to_detailed:0,
    wx_pyq_type:0,
    is_from_ding:0,
    ding_not_read_count:0,
    dingDialog:false, 

	},
 
	// 监听用户触底事件，加载下一页数据
	onPageScroll: function (e) {
		
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    
    var that = this;   	
    console.log("detail onLoad")
    console.log(options)
    console.log('mallbasearticletemplatedetailresult 场景值：'+wx.getLaunchOptionsSync().scene);
    var is_single=false;
    var sc=wx.getLaunchOptionsSync().scene
   
    // if(sc){
    //   wx.showToast({
    //     title: 'sc:'+sc+' '+options.bind_type,
    //   })
    // }
   
  

    this.setData({
      sc:sc,
    })

    if(sc == 1154){
      //单页
      is_single=true;
      this.setData({
        only_title:true,
        is_single:is_single,
      })
    }else{
      wx.showShareMenu({
        withShareTicket:true,
        menus:['shareAppMessage','shareTimeline']
        })
    }

    // if(options.detail_type){
    //   detail_type=preview
    // }
    if(options.article_template_main_id){
      //所有跳转方式都要传入的参数
      //小程序内 预览、朋友圈跳转预览、单页、单页进入小程序 
      this.setData({
        article_template_main_id:Number(options.article_template_main_id),
        goods_id:Number(options.goods_id),
        main_uid:options.main_uid,
      })
    } 

    if(options.is_from_ding){
      this.setData({
        is_from_ding:Number(options.is_from_ding)
      })
    }
         

		if (is_single==false&&options.q) {
      //二维码
      this.setData({
        wx_pyq_type:4,
      })  
      // wx.showToast({
      //   title: '从二维码进来',
      //   icon:'none'
      // })
      let url = decodeURIComponent(options.q)      
			console.log('url' + url)
			if (url.indexOf('https://') != -1 && url.indexOf('?bind_type=') != -1) {			
        let str1 = decodeURIComponent(url).substring(decodeURIComponent(url).indexOf('?bind_type='))  
           
				let a = JSON.parse(str1.replace(/\?/g, "{\"").replace(/=/g, "\":\"").replace(/&/g, "\",\"") + "\"}")				

        if(app.globalData.enter_shop_id_inited==false){
          app.globalData.enter_shop_id=Number(a.shop_id);
          that.setData({enter_shop_id:app.globalData.enter_shop_id})
        }
        that.setData({                
					associate_id: Number(a.associate_id),
					associate_type: Number(a.associate_type),
					bind_type: Number(a.bind_type),
          shop_id: Number(a.shop_id),  
          article_template_main_id:Number(a.article_template_main_id), 
          goods_id: Number(a.goods_id),    
          main_uid:a.main_uid          
				}, () => {
          that.selectUnionIDAndBind();
				})
      }  
      
    }
    
    if((sc==1155||sc==1007||sc==1008)&&options.bind_type){
         
          //通过分享过来的 1155 单页-》进入小程序 1007个微 1008-微信群 微信卡片分享-》结果页
          //
          if(app.globalData.enter_shop_id_inited==false){
            app.globalData.enter_shop_id=Number(options.shop_id);
            that.setData({enter_shop_id:app.globalData.enter_shop_id})
          }
          that.setData({                
              associate_id: Number(options.associate_id),
              associate_type: Number(options.associate_type),
              bind_type: Number(options.bind_type),
              shop_id: Number(options.shop_id), 
              article_template_main_id:Number(options.article_template_main_id), 
              goods_id: Number(options.goods_id)                  
          }, () => {				
            that.selectUnionIDAndBind()
          })

    }
    if(options.wx_pyq_type){
      this.setData({
        wx_pyq_type:Number(options.wx_pyq_type),
      })
      if(sc==1007){
        this.setData({
          wx_pyq_type:1,
        })
      }else if(sc==1008){
        this.setData({
          wx_pyq_type:3,
        })
      }
    }else if(sc==1155){
      this.setData({
        wx_pyq_type:2,
      })
    }else if(sc==1007){
      this.setData({
        wx_pyq_type:1,
      })
    }else if(sc==1008){
      this.setData({
        wx_pyq_type:3,
      })
    }


   
    this.selectMallBaseArticleTemplateMainById();
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

    /**
     * 用户点击右上角分享
     */
  onShareAppMessage: function (e) {

      
      
      var that = this;   
      var article_template_main_item=this.data.article_template_main_item;

      if(!article_template_main_item){
        wx.showToast({
          title: '无分享内容',
        })
        return;
      }

      var title = '' + article_template_main_item.name;
      var imgUrl = article_template_main_item.share_img_url;
      var goods_id=article_template_main_item.goods_id;
      var shop_id=article_template_main_item.shop_id;
      var article_template_main_id=article_template_main_item.id;
      var main_uid=this.data.main_uid;
      var send_customer_id=this.data.associate_id;

      console.log(imgUrl);
      let shareObj = {
          title: title,
          path: 'pages/mall/pages/mallbasearticletemplatedetailresult/mallbasearticletemplatedetailresult?bind_type=3&associate_type=2&' + 
          'shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +
          '&goods_id=' + goods_id+'&article_template_main_id='+article_template_main_id+'&main_uid='+main_uid+'&send_customer_id='+send_customer_id,
          imageUrl: imgUrl,
          success: function (res) {
              if (res.errMsg == 'shareAppMessage:ok') {
                  
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
  onShareTimeline: function () {
          
          var that = this;   
          var article_template_main_item=this.data.article_template_main_item;

          console.log("onShareTimeline")
          console.log(article_template_main_item)
          if(!article_template_main_item){
            wx.showToast({
              title: '无分享内容',
            })
            return;
          }

          var title = '' + article_template_main_item.name;
          var imgUrl = article_template_main_item.share_img_url;
          var goods_id=article_template_main_item.goods_id;
          var shop_id=article_template_main_item.shop_id;
          var article_template_main_id=article_template_main_item.id;
          var main_uid=this.data.main_uid;
          
          if(this.data.is_single==false){
            var send_data={
              main_uid:main_uid,
              name:title,
              shop_id:shop_id,
              send_customer_id:app.globalData.customerInf.id,
              article_template_main_id:article_template_main_id,
              is_wx:0,
              is_pyq:1
            }
            this.insertOrUpdateMallBaseArticleEffectMain(send_data);
          }
          
          var path='bind_type=3&associate_type=2' + '&shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +'&goods_id=' + goods_id+'&article_template_main_id='+article_template_main_id+'&main_uid='+main_uid+"&wx_pyq_type=2";

          console.log("分享朋友圈:"+path);
          console.log("广告图片:"+imgUrl);
          return {
              title: title,
              path: path,
              imageUrl: imgUrl
          }
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
 
  // 下拉刷新
  onRefresh() {
    
  },
  loadMore(){
  
  },
  showBigImg: function (e) { //查看照片大图                                       
    var that = this;
    var current=e.currentTarget.dataset.src;
    //  }
    var imgArray =[];
    imgArray.push(current);
    if(imgArray.length==0){
        return;
    }
    wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: imgArray // 需要预览的图片http链接列表
    })
  },
  showNineImg: function (e) { //查看照片大图                                       
    var that = this;
    var current=e.currentTarget.dataset.src;
    var nine_array=e.currentTarget.dataset.nine_array;
    //  }

    if(nine_array.length==0){
        return;
    }
    console.log("showNineImg")
    console.log(nine_array);
    var urls=[];
    for(var i=0;i<nine_array.length;i++){
      urls.push(nine_array[i].url);
    }
    wx.previewImage({
      current:current,
      urls: urls,
    })
    // wx.previewImage({
    //     current: current, // 当前显示图片的http链接
    //     urls: nine_array // 需要预览的图片http链接列表
    // })
  },
  selectMallBaseArticleTemplateMainById(){
    //分页查询已完成模板
    let that = this

    var article_template_main_id=this.data.article_template_main_id;

    if(article_template_main_id<=0){
      wx.showToast({
        title: 'article_template_main_id为空',
        icon:'none',
      })
      return;
    }

    wx.request({
        url: app.globalData.selectMallBaseArticleTemplateMainById,        
        method: 'POST',
        data: {         
            id:article_template_main_id,       
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            that.setData({
              mediaIsLoading:false,
            })
            if(res.data.code == 1000){
              var article_template_main_item = res.data.data;
              var cut_introduction=article_template_main_item.cut_introduction;

              var only_index=0;
              //文章类型 1-文章 2-图片 3-视频
              if(article_template_main_item.article_type==2){
                for(var i=0;i<article_template_main_item.lstDetail.length;i++){
                  var item=article_template_main_item.lstDetail[i];
                  if(i>0&&item.is_delete==0&&item.item_type==1){
                    //是图片 查找第一张图片对应位置
                    only_index=i;
                    break;
                  }
                }
              }
              if(article_template_main_item.article_type==3){
                for(var i=0;i<article_template_main_item.lstDetail.length;i++){
                  var item=article_template_main_item.lstDetail[i];
                  if(i>0&&item.is_delete==0&&item.item_type==2){
                    //是视频 查找第一个视频对应位置
                    only_index=i;
                    break;
                  }
                }
              }
              that.setData({
                article_template_main_item: article_template_main_item,
                cut_introduction:cut_introduction,
                name:article_template_main_item.name,
                article_template_detail_array:article_template_main_item.lstDetail,
                only_index:only_index,
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
                                    var wx_pyq_type=that.data.wx_pyq_type;
                                    that.selectDingMsgRecordNotReadTotal();
                                    if(wx_pyq_type>0){
                                     
                                      that.init_timer();
                                      that.insertOrUpdateMallBaseArticleEffectDetailCheck();
                                    }
                                    
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
        that.getLocation();
			},
			fail: res=>{
        that.getLocation();
        that.showMsg("网络异常");
			   console.log("绑定失败:" + res.data.msg)
			}
		})
  },
  toDetail(e){
      var goods_id=this.data.goods_id;
      var send_customer_id=this.data.associate_id;
      var main_uid=this.data.main_uid;
      var wx_pyq_type=this.data.wx_pyq_type;
      var is_from_ding=this.data.is_from_ding;

      var url='/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + goods_id;
      if(this.data.is_to_detailed==0){
        url='/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + goods_id+'&send_customer_id='+send_customer_id+'&main_uid='+main_uid+"&wx_pyq_type="+wx_pyq_type+"&is_from_ding="+is_from_ding;
          this.setData({
            is_to_detailed:1,
          })
      }
      if(goods_id>0){
        wx.navigateTo({
          url: url,
        })
      }else{
        wx.showToast({
          title: 'goods_id为空',
          icon:'error',
        })
      }
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
    var app_goods_type=1;
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
      send_customer_id:this.data.associate_id,
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
      },2500);
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
  getLocation(){
    var that=this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        //添加进入小程序的记录(获取经纬度)
        qqmap.reverseGeocoder({
          location: {
              latitude: res.latitude,
              longitude: res.longitude
          },
          success: function (res1) {
              console.log("获取到经纬度")
              var a = res1.result.address_component
              //获取市和区（区可能为空）
              var provinceName = a.province
              var cityName = a.city
              var countyName = a.district
              var isPosition = true
             
              that.updateDingKeLocation(cityName+countyName,res.latitude,res.longitude);
              //控制台输出结果
              console.log(provinceName,cityName, countyName, res.latitude+'', res.longitude+'')
              // that.selectCityID()
          },
          fail: function (res) {
              console.log('获取地址失败' + res);
          },
          complete: function (res) {
              console.log(res);
          }
      })
      }
    })
  },
  updateDingKeLocation(region,latitude,longitude){
      let that = this
      wx.request({
        url: app.globalData.updateDingKeLocation,                               
        data: {   
          associate_id: that.data.associate_id,				
          target_union_id: app.globalData.unionID,
          region:region,
          latitude:latitude,
          longitude:longitude,
        },
        method: 'POST',
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: res => {
        },
        fail: res=>{
          that.showMsg("网络异常");
          console.log("更新位置失败:" + res.data.msg)
        }
      })
  },


  selectDingMsgRecordNotReadTotal(){

    var that = this
    var receiver_code=app.globalData.customerInf.userCode;

    //测试代码
    ////receiver_code='300021';
    wx.request({
        url: app.globalData.selectDingMsgRecordNotReadTotal,
        data: {
            receiver_code:receiver_code,
        },
        method:'POST',
        success: res => {

            if (res.data.code == 1000) {

              var ding_not_read_count=res.data.data;

               // var new_chatCustomerList=that.data.chatCustomerList.concat(chatCustomerList);
                that.setData({
                  ding_not_read_count:ding_not_read_count,
                  dingDialog:ding_not_read_count>0?true:false,
                })
                
            } else {
                wx.showModal({
                    title: '提示',
                    content: '网络异常',
                    showCancel: false
                })
                
            }
        },
        fail: res => {
            wx.showModal({
                title: '提示',
                content: '网络异常',
                showCancel: false
            })
            
        }
    })
  },
  closeDingDialog(e){
    this.setData({
      dingDialog:false,
    })
  },
  toDingKe(){
    wx.navigateTo({url: '/pages/mall/pages/dingke/dingke',}); 
  }

  
})