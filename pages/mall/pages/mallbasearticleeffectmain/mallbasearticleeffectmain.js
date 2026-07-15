const app = getApp()

Page({
  //初始数据
	data: {
    //0-明细 1-查询总数
    
    query_wx_pyq_type:-1,
    current_item:null,
    listIndex:1,

		items: [],
		isLoading: false,
    begin_date:'',
    end_date:'',
    page_size:10,
    page_index:1,
    shop_id:0,
    is_over:false,
    send_out_staff_id:0,
    send_out_staff_name:'',
    mall_battery_pct:0,
    buyer_name:'',
    buyer_mobile:'',
    name:'',
    battery_buyer_amount: 0,
    battery_company_amount: 0,
    buyer_count:0,
    query_wx_pyq_array:['全部','微信(群)','朋友圈','二维码'],
    query_wx_pyq_name:'全部',
    query_wx_pyq_type:0,
    downSVGIcon:'data:image/svg+xml,%3Csvg%20t%3D%221688612613352%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%221452%22%20width%3D%2264%22%20height%3D%2264%22%3E%3Cpath%20d%3D%22M517.688889%20796.444444c-45.511111%200-85.333333-17.066667-119.466667-51.2L73.955556%20381.155556c-22.755556-22.755556-17.066667-56.888889%205.688888-79.644445%2022.755556-22.755556%2056.888889-17.066667%2079.644445%205.688889l329.955555%20364.088889c5.688889%205.688889%2017.066667%2011.377778%2028.444445%2011.377778s22.755556-5.688889%2034.133333-17.066667l312.888889-364.088889c22.755556-22.755556%2056.888889-28.444444%2079.644445-5.688889%2022.755556%2022.755556%2028.444444%2056.888889%205.688888%2079.644445L637.155556%20739.555556c-28.444444%2039.822222-68.266667%2056.888889-119.466667%2056.888888%205.688889%200%200%200%200%200z%22%20fill%3D%22%23333333%22%20p-id%3D%221453%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
    
  },
	// 监听触底事件
	onPageScroll: function (e) {
		
  },
  //监听页面加载
  onLoad: function (options) {
  if(options.shop_id){
    this.setData({
      shop_id:Number(options.shop_id),
    })
  }
  this.selectSingleShop();
  //this.initCurrentDate();	
  this.selectData();		
  },
  /**
   * 监听页面隐藏
   */
  onHide: function () {

  },


  /**
   * 监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 监听用户下拉动作
   */
  onPullDownRefresh: function () {	  

  },

  /**
   * 上拉触底事件
   */
  onReachBottom: function () {
	  this.loadNextPage();
  },

  /**
   * 点击右上角分享
   */
  onShareAppMessage: function () {

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
  selectTotayData(){
    //当日查询
    this.initCurrentDate();	
    this.setData({
      page_size:10,
      page_index:1,
      is_over:false,
      listIndex:-1,
      items:[],
    })
    this.selectPageData();
  },
  selectData(){
    this.setData({
      page_size:10,
      page_index:1,
      is_over:false,
      listIndex:-1,
      items:[],
    })
    this.selectPageData();
  },
 	selectPageData(){
    let that = this
    if(that.data.is_over==true){
      return;
    }
    if(that.data.isLoading==true){
      return;
    }

		wx.request({
		  url: app.globalData.selectMallBaseArticleEffectMain,
			method: 'POST',
			data: {
         page_size:that.data.page_size,
         page_index:that.data.page_index,
         begin_date:that.data.begin_date,
         end_date:that.data.end_date,
         name:that.data.name,
         query_wx_pyq_type:that.data.query_wx_pyq_type,
         send_customer_id:app.globalData.customerInf.id,
			},
			success(res){
				if(res.data.code == 1000){
          const newitems = res.data.data;
          var items=that.data.items;
  
          items.push(...newitems);
          
          
					that.setData({
            items: items,    
          })
          if(newitems.length==0){
            that.setData({
              is_over:true,
            })
          }
        var page_index=that.data.page_index;
        if(that.data.items.length>0&&page_index==1){
            that.setData({
              listIndex:0,
              current_item:that.data.items[0],
            })
        }else{
          that.setData({
            listIndex:-1,
          })
        }
        if(newitems.length>0){
          page_index=page_index+1;
          that.setData({
            page_index:page_index,
          })
        }
        }				
			},
			fail(res){
				app.showFailMessage(3,res)				
      },
      complete(res){
        that.setData({
					isLoading: false
				});
      }
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
  itemClick(e) {
    var that = this;
    let i = e.currentTarget.dataset.index
    var current_item=that.data.items[i];
    that.setData({
      listIndex: i, //获取
      current_item:current_item,
    })
  },
  scrollToLower(e){
      //拉取到底部了
      console.log("拉取到底部了")
      console.log(e);
      this.selectPageData();
  },
  selectSingleShop(){
      var that=this;
      var shop_id=that.data.shop_id;

        wx.request({
          url: app.globalData.selectSingleShop,        
          method: 'GET',
          data: {                
              shop_id: shop_id,                       
          },
          header: {
              'content-type': 'application/json'
          },
          success: function (res) {
            console.log(res)
              if(res.data.code == 1000){
                
                  var shopVo=res.data.data;
                  var mall_battery_pct=shopVo.mall_battery_pct;
                  that.setData({
                    mall_battery_pct:mall_battery_pct,
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
    reSetData(){
      this.setData({
        begin_date:'',
        end_date:'',
        name:'',
        query_wx_pyq_type:0,
        query_wx_pyq_name:'全部'
      })
    },
    bindQueryQxPyqPickerChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        query_wx_pyq_type: e.detail.value,
        query_wx_pyq_name:this.data.query_wx_pyq_array[e.detail.value],
      })
    },
    toDetail(){
      if(this.listIndex<0){
        return;
      }
      var main_item=this.data.current_item;
      var json=JSON.stringify(main_item);
      var encodeStr=encodeURIComponent(json);
      wx.navigateTo({
        url: '/pages/mall/pages/mallbasearticleeffectdetail/mallbasearticleeffectdetail?main_item='+encodeStr,
      });
      
    },

})