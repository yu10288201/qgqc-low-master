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
    benefit_array:[],
    cut_introduction:'',
    enter_shop_id:0,//测试是否获取到了enter_shop_id
    associate_id: 0,
		associate_type: 0,
		bind_type: 0,
		shop_id: 0,
    goods_id: 0,
    name:'',
    article_template_main_id:0,
    benefit_item:{},
    video_first_img:'?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0,m_fast,ar_auto',
    only_title:false,
    is_single:false,
    only_index:0,
    cloudmsg_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/cloudmsg.png',
    main_uid:'',
    detail_uid:'',
    timer:null,
    is_to_detailed:0,
    benefit_type:0,
    is_from_ding:0,
    ding_not_read_count:0,
    dingDialog:false, 

    begin_date:'',
    end_date:'',
    query_benefit_array:['','1.分销提成平台现金','2.分销提成平台星盾','3.绑定奖励星盾','4.分销提成商家现金','5.分销提成商家星盾','6.员工分销提成平台现金','7.员工分销提成平台星盾','8.购物返佣平台代金券','9.购物返佣商家代金券'],
    query_benefit_name:'',
    query_benefit_type:0,
    downSVGIcon:'data:image/svg+xml,%3Csvg%20t%3D%221688612613352%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%221452%22%20width%3D%2264%22%20height%3D%2264%22%3E%3Cpath%20d%3D%22M517.688889%20796.444444c-45.511111%200-85.333333-17.066667-119.466667-51.2L73.955556%20381.155556c-22.755556-22.755556-17.066667-56.888889%205.688888-79.644445%2022.755556-22.755556%2056.888889-17.066667%2079.644445%205.688889l329.955555%20364.088889c5.688889%205.688889%2017.066667%2011.377778%2028.444445%2011.377778s22.755556-5.688889%2034.133333-17.066667l312.888889-364.088889c22.755556-22.755556%2056.888889-28.444444%2079.644445-5.688889%2022.755556%2022.755556%2028.444444%2056.888889%205.688888%2079.644445L637.155556%20739.555556c-28.444444%2039.822222-68.266667%2056.888889-119.466667%2056.888888%205.688889%200%200%200%200%200z%22%20fill%3D%22%23333333%22%20p-id%3D%221453%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
    
    b_query_shop_items_show:0,
    query_shop_array_select_name:[],
    query_shop_items:null,
    query_shop_array_select_index:-1,
    query_shop_name:'',
    cash_commission_total: 0,
    in_color_global_voucher_total: 0,
    star_commission_total: 0,
    total_color_global_voucher: 0,

    platform_cash_commission_total: 0,
    platform_star_commission_total: 0,
    shop_cash_commission_total: 0,
    shop_star_commission_total: 0,

    total_star_balance:0,
    shop_star_balance:0,
    platform_star_balance:0,

    platform_in_color_global_voucher_total:0,
    platform_total_color_global_voucher:0,
    shop_in_color_global_voucher_total:0,
    shop_total_color_global_voucher:0,
    buy_to_give_cash:0,
    buy_to_give_platform_cash:0,
    buy_to_give_shop_cash:0,

	},
 
	// 监听用户触底事件，加载下一页数据
	onPageScroll: function (e) {
		
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    var that = this;
    //this.initCurrentDate(); 
    this.selectMallPersonalBenefit();
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
  selectMallPersonalBenefit(){
    //分页查询已完成模板
    let that = this

    var associate_id=app.globalData.customerInf.id;

    //测试 
    //associate_id=5983;
    //associate_id=6108;

    if(associate_id<=0){
      wx.showToast({
        title: 'associate_id为空',
        icon:'none',
      })
      return;
    }
    wx.showLoading({
      title: '查询中',
    })
    wx.request({
        url: app.globalData.selectMallPersonalBenefit,        
        method: 'POST',
        data: {         
          associate_id:associate_id,
          shop_id:that.data.query_shop_id, 
          begin_date:that.data.begin_date,
          end_date:that.data.end_date,
          benefit_index:that.data.query_benefit_type,
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
          wx.hideLoading();
            if(res.data.code == 1000){
              var data = res.data.data;
              
              
              that.setData({
                cash_commission_total:data.cash_commission_total,
                in_color_global_voucher_total:data.in_color_global_voucher_total,
                star_commission_total:data.star_commission_total,
                total_color_global_voucher:data.total_color_global_voucher,
                platform_cash_commission_total: data.platform_cash_commission_total,
                platform_star_commission_total: data.platform_star_commission_total,
                shop_cash_commission_total: data.shop_cash_commission_total,
                shop_star_commission_total:data.shop_star_commission_total,

                total_star_balance:data.total_star_balance,
                shop_star_balance:data.shop_star_balance,
                platform_star_balance:data.platform_star_balance,

                platform_in_color_global_voucher_total:data.platform_in_color_global_voucher_total,
                platform_total_color_global_voucher:data.platform_total_color_global_voucher,
                shop_in_color_global_voucher_total:data.shop_in_color_global_voucher_total,
                shop_total_color_global_voucher:data.shop_total_color_global_voucher,

                buy_to_give_cash:data.buy_to_give_cash,
                buy_to_give_platform_cash:data.buy_to_give_platform_cash,
                buy_to_give_shop_cash:data.buy_to_give_shop_cash,
                
                benefit_array: data.lstMallPersonalBenefit,
              })
            }                                
        },
        fail(res){
          wx.hideLoading();
          wx.showToast({
            title: '获取失败:'+res.data.msg,
            icon:'error',
            duration: 2000,
          }) 
        }
      })

  },
  initCurrentDate(){
    var date=new Date();
    var year = date.getFullYear(); 
    var month = date.getMonth() + 1; 
    var day = date.getDate();
    var current_date=year+'-'+month+'-'+day;
    this.setData({
      begin_date:current_date,
      end_date:current_date,
    })
  },
  bindBeginDateChange: function(e) {
    this.setData({
      begin_date: e.detail.value
    })
  },
  bindEndDateChange: function(e) {
    this.setData({
      end_date: e.detail.value
    })
  },
  bindQueryBenefitPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      query_benefit_type: e.detail.value,
      query_benefit_name:this.data.query_benefit_array[e.detail.value],
    })
  },

  selectTop50Shop(){
    let that = this
		wx.request({
		  url: app.globalData.selectTop50Shop,
			method: 'GET',
			data: {
        shop_name:that.data.query_shop_name,
			},
			success(res){
				if(res.data.code == 1000){
          const items = res.data.data;
          if(items.length>0){
            that.setData({
              b_query_shop_items_show:true,
            })
          }else{
            wx.showToast({
              title: '未搜索到店铺',
              icon:'none',
            })
            that.setData({
              b_query_shop_items_show:false,
            })
          }
            that.setData({
              query_shop_array_select_name:[],
              query_shop_items:items,
              query_shop_array_select_index:-1,
            })
          }else{
            that.setData({
              query_shop_items:[],
              query_shop_array_select_index:-1,
            })	
          }
          	
			},
			fail(res){
        app.showFailMessage(3,res)			
        that.setData({
          query_shop_items:[],
          query_shop_array_select_index:-1,
        })	
      },
      complete(res){
      
      }
    })
  },
  reSetData(e){
    var that=this;
      that.setData({
        query_shop_id:0,
        begin_date:'',
        end_date:'',
        query_shop_name:'',
        query_benefit_name:'',
        query_benefit_type:0,

      })
    
  },
  selectData(){
    var that=this;
    if(this.data.query_shop_name==''){
      that.setData({
        query_shop_items:[],
        query_shop_array_select_index:-1,
        query_shop_id:0,
      })
    }

    this.selectMallPersonalBenefit();
  },
  btnShopSelectClick(e){
    this.setData({
      b_query_shop_items_show:1,
    })
    this.selectTop50Shop();
  },
  itemQueryClick(e) {
    var that = this;
    let i = e.currentTarget.dataset.index
    var current_query_item=that.data.query_shop_items[i];
    that.setData({
      query_shop_name:current_query_item.shop_name,
      query_shop_id:current_query_item.shop_id,
      b_query_shop_items_show:0,
    })
  },
})