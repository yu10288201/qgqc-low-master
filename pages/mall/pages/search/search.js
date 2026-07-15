// pages/search/search.js
const appInstance = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
  keywords:'',
  search_keywords_array:[],
  search_outfit_type:0,
  isLoading:false,
  isOver:false,
  scrollTop:0,
  page_index:1,      
  },

  getProducts() {		
    let that = this
    if(this.data.isLoading==true||this.data.isOver==true){
      return;
    }

    var category_id=0;
    if(this.data.search_outfit_type>0){
        //如果是试衣界面过来的。
        category_id=15;
    }
    wx.showLoading({
      title: '加载中',
    })
    wx.request({
      url: appInstance.globalData.selectMallBaseGoodsList_url,        
      method: 'POST',
      data: {                
        shop_id: appInstance.globalData.is_video_show ? 0 : 19318,    
        category_id: category_id,        
        page_size: 10,  
        page_index: this.data.page_index, 
        keywords: that.data.keywords,              
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        wx.hideLoading();	
        that.setData({
          isLoading:false,
        })			    
        if(res.data.code == 1000){
            that.mallOutfitGoodsKeywordsInsertMallOutfitGoodsKeywords();	
              if(res.data.data.length==0){
                that.setData({
                  isOver:true,
                })
              }
              if(that.data.page_index==1){
                that.setData({
                  products:res.data.data,
                })
              }else{
                var products=that.data.products; 
                  for(var i=0;i<res.data.data.length;i++){
                    products.push(res.data.data[i]);
                  }
                  that.setData({
                    products:products,
                  })
              }  
                
        }	                           
      },
      fail(res){
        wx.hideLoading();	
        that.setData({
          isLoading:false,
        })
        wx.showToast({
          title: '获取商品失败:'+res.data.msg,
          icon:'error',
          duration: 2000,
        }) 
        
      }
    })
},
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this; 
    this.setData({
      keywords:appInstance.globalData.search_keywords,
    })
    
    var search_outfit_type=0;
    if(options.search_outfit_type){
      search_outfit_type=Number(options.search_outfit_type);
      this.setData({
        search_outfit_type:search_outfit_type
      });
    }
   
    that.mallOutfitGoodsKeywordsSelectMallOutfitGoodsKeywordsByCustomerId();
	  that.queryClick();
  },
 
  // 转发函数,固定部分
  // wxSearchInput: WxSearch.wxSearchInput,  // 输入变化时的操作
  // wxSearchKeyTap: WxSearch.wxSearchKeyTap,  // 点击提示或者关键字、历史记录时的操作
  // wxSearchDeleteAll: WxSearch.wxSearchDeleteAll, // 删除所有的历史记录
  // wxSearchConfirm: WxSearch.wxSearchConfirm,  // 搜索函数
  // wxSearchClear: WxSearch.wxSearchClear,  // 清空函数

  searchInput(e){
    this.setData({
      keywords: e.detail.value,			
    })
  },

  toDetail(e){
    var item=e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + item.id+'&search_outfit_type='+this.data.search_outfit_type,
    })
  },
  queryClick(e){
    if(this.data.isLoading==true){
      return;
    }
    this.setData({
      isLoading:false,
      isOver:false,
      scrollTop:0,
      page_index:1,
    })
    this.getProducts();
  },
  keywordsClick(e){
      var index=e.currentTarget.dataset.index;
      var search_keywords_array=this.data.search_keywords_array;
      var keywords=search_keywords_array[index].keywords;
      this.setData({keywords:keywords});
      this.queryClick();
  },
  // searchProducts(){
  //   let that = this
  //   if(this.data.isLoading==true||this.data.isOver==true){
  //     return;
  //   }
	 
	// 	wx.request({
	// 		url: appInstance.globalData.selectMallBaseGoodsList_url,        
	// 		method: 'POST',
	// 		data: {                
	// 			shop_id: appInstance.globalData.is_video_show ? 0 : 19318,    
	// 			category_id: 0,        
	// 			page_size: 10,  
	// 			page_index: 1, 
	// 			keywords: that.data.keywords,             
	// 		},
	// 		header: {
	// 			'content-type': 'application/json'
	// 		},
	// 		success: function (res) {				    
	// 			if(res.data.code == 1000){				
	// 				that.setData({
	// 					products: res.data.data,					
  //         })
  //         if(that.data.products.length==0){
  //           wx.showModal({
  //             title: '搜索',
  //             content: '对不起，没有你搜的商品，请换关键字再搜',
  //             complete: (res) => {
  //               if (res.cancel) {
                  
  //               }
            
  //               if (res.confirm) {
                  
  //               }
  //             }
  //           })
  //         }
	// 			}	                           
	// 		},
	// 	})
	  	  
  // },

  showTemp:function(){
    wx.showModal({
      title: '提示',
      content: '正在调试中，敬请期待',
    })
  },  



  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

    // this.setData({
    //   longitude: appInstance.globalData.myLongitude, //经度
    //   latitude: appInstance.globalData.myLatitude, //维度
    // })

  },

  /**
   * 生命周期函数--监听页面显示
   */
  // onShow: function () {
  //   var that = this;
  //   // 城市选择
  //   this.setData({
  //     cityName: appInstance.globalData.defaultCity,
  //     countyName: appInstance.globalData.defaultCounty,
  //     selectStore: appInstance.globalData.selectStore,
  //   })
  //   wx.getStorage({
  //     key: "showModalQR",
  //     success (res) {
  //       appInstance.globalData.showModalQR = res.data
  //       if(appInstance.globalData.showModalQR == true){
  //         that.setData({
  //           showModalQR:true
  //         })
  //       }else{
  //         that.setData({
  //           showModalQR:false
  //         })
  //       }
  //     }
  //   })  

  //   appInstance.globalData.needOpenSocket = false // 不需要连接
  //   if(appInstance.globalData.isOpenSocket == true){ // 处于开启时
  //     console.log("关闭店铺呼叫连接")
  //     // appInstance.closeSocket()
  //   }

  //   var that = this
  //   // that.storeCacheselect()
  //   appInstance.delBtnClick();
  //   // appInstance.closeSocket();
  // },

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
  onShareAppMessage: function () { 

  },
 // 加载下一页数据
  loadNextPage: function () {	
    console.log('loadNextPage')	

    if(this.data.isOver==true){
      return;
    }
    if(this.data.isLoading==true){
      return;
    }
    this.setData({
      page_index:this.data.page_index+1,
    });
    this.getProducts();
    //this.mallOutfitAnyoneSelectMallOutfitAnyoneByCustomerId();
  },

  mallOutfitGoodsKeywordsSelectMallOutfitGoodsKeywordsByCustomerId() {		
      let that = this
      var customer_id=Number(appInstance.globalData.customerInf.id?appInstance.globalData.customerInf.id:0);
      if(customer_id<=0){
        return;
      }

      wx.request({
        url: appInstance.globalData.mallOutfitGoodsKeywordsSelectMallOutfitGoodsKeywordsByCustomerId,        
        method: 'POST',
        data: {                
          customer_id: customer_id,                  
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {	
          console.log(res);
          

          if(res.data.code == 1000){	
            that.setData({
              search_keywords_array:res.data.data,
            })
            if(res.data.data.length>0){
              var k1=res.data.data[0].keywords;
              if(that.data.keywords==''){
                that.setData({
                  keywords:k1,
                })
              }
            }
          }	                           
        },
        fail(res){
           console.log(res)
        }
      })
  },
  mallOutfitGoodsKeywordsInsertMallOutfitGoodsKeywords(e){
    var that=this;
      var keywords=this.data.keywords;
      appInstance.globalData.search_keywords=keywords;
      if(keywords==''){
        return;
      }
     

      var customer_id=Number(appInstance.globalData.customerInf.id?appInstance.globalData.customerInf.id:0);
      if(customer_id<=0){
        return;
      }

      wx.request({
        url: appInstance.globalData.mallOutfitGoodsKeywordsInsertMallOutfitGoodsKeywords,        
        method: 'POST',
        data: {                
          customer_id: customer_id,   
          keywords:keywords,               
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {	
          if(res.data.code == 1000){	
            that.setData({
              search_keywords_array:res.data.data,
            })
          }	                                
        },
        fail(res){
           console.log(res)
          
        }
      })
  },
})