const app = getApp()

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
    b_spec_show:false,
    b_spec_stock_show:false,
    //待修改的商品记录
    goods_id:0,
    customer_openid:'',
    goods_item:null,
    sku_array:[],
    b_update_mode:'',//1价格  2 库存
    //设置规格的库存及价格
    //设置当前规格的位置
    param_index:0,
    param_shop_price:0,
    param_customer_price:0,
    param_customer_preferential_price:0,
    param_recharge_member_price:0,
    param_vip_member_price:0,
    param_platform_cash_commission:0,
    param_shop_cash_commission:0,
    param_platform_star_commission:0,
    param_shop_star_commission:0,
    param_platform_cut_rate:0,
    param_stock:0,


		currentTab: 'all',
    goods_array:[],
		pageIndex: 1,
		pageSize: 10,
		isLoading: false,
		isOver: false,
    state_id:-1,
  
	},

   // 切换订单状态菜单
   	switchTab(event) {
    	const activeTab = event.currentTarget.dataset.tab;
    	this.setData({ 
			currentTab: activeTab,
			pageIndex: 1,
			goods_array: [],
			isOver: false,
		});
		
		if(activeTab=='all'){			
			this.setData({
				state_id: -1
			})
			this.selectData()
		}else if(activeTab=='toSale'){
			this.setData({
				state_id: 1
			})
			this.selectData()
		}else if(activeTab=='toOffSale'){			
			this.setData({
				state_id: 2
			})
			this.selectData()
    }
    
   	},      
   
	// 监听用户触底事件，加载下一页数据
	onPageScroll: function (e) {
		
	},
	
	// 加载下一页数据
	loadNextPage: function () {		
		if (this.data.isLoading || this.data.isOver) {
			// 防止重复加载
			return;
		}
		// 加载下一页数据
		const nextPageIndex = this.data.pageIndex + 1;		
		this.setData({
			isLoading: true, // 设置isLoading为true，表示正在加载数据
			pageIndex: nextPageIndex,
    });		

		this.selectData();
  },
  getOtherProducts(shopID) {

    //测试数据
    let that = this
        wx.request({
            url: app.globalData.selectMallBaseGoodsList,        
            method: 'POST',
            data: {                
                shop_id: shopID,               
                page_size: 16,  //hardcode成每次拿16个
                page_index: 1   //一开始每次只搞头16个           
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
            },
            fail:function(err){
              wx.showToast({
                title: '网络异常',
                icon:'error'
              })
            },
        })
    },

 	selectData(){
    let that = this
    if(!this.data.customer_openid){
      return;
    }
    wx.request({
        url: app.globalData.selectMallBaseGoodsCollectList,        
        method: 'POST',
        data: {                
            customer_openid: that.data.customer_openid,
            keywords:'',
            state_id:that.data.state_id,               
            page_size: that.data.pageSize,  //hardcode成每次拿16个
            page_index: that.data.pageIndex   //一开始每次只搞头16个           
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            if(res.data.code == 1000){

              const newGoods = res.data.data;
              if(newGoods.length == 0){
                that.setData({
                  isOver: true,
                })
              }
              that.setData({
                goods_array: that.data.goods_array.concat(newGoods),
                isLoading: false,
              })


            }                                
        },
        fail(res){
          wx.showToast({
            title: '获取商品失败:'+res.data.msg,
            icon:'error',
            duration: 2000,
          }) 
          that.setData({
            isLoading: false // 设置isLoading为false，表示数据加载完成（或加载失败）
          });
        }
      })

    },
   
    updateMallBaseGoods:function(e){
      var item=e.currentTarget.dataset.item;
      if(item){
        this.selectSingleShopMallBaseGoods(item.id);
      }
    },
     deleteBtnClick:function(e){
       //删除按钮点击事件
      var item=e.currentTarget.dataset.item;
      var index=e.currentTarget.dataset.index;
      var that=this;
      console.log(index);

      if(item){
        wx.showModal({
          title: '删除商品',
          content: '是否确认删除',
          success(res) {
           if (res.confirm) {
            that.deleteMallBaseGoodsCollect(item.id,index);
           } 
          }
        });
      }
    },
    deleteMallBaseGoodsCollect:function(goods_id,index){
        var that=this;
        wx.showLoading({
          title: '删除中',
        })
        wx.request({
          url: app.globalData.deleteMallBaseGoodsCollect,
          method:"POST",
          header:{
              'content-type':'application/json'
          },
          data:{
            goods_id:goods_id,
            customer_openid:that.data.customer_openid,
          },
          success:res=>{
            wx.hideLoading();
              console.log(res);
              if(res&&res.data&&res.data.code==1000){
               
                var goods_array=that.data.goods_array;
                if(goods_array.length>=index+1){
                  goods_array.splice(index,1);
                }
                that.setData({
                  goods_array:goods_array,
                })
                wx.showToast({
                  title: '操作成功',
                })
              }else{
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
    //获取商城里的商品详情信息
    selectSingleShopMallBaseGoods: function(goods_id){		
    if(goods_id<=0){
      return;
    }
		var that = this 		
        wx.request({
            url: app.globalData.selectSingleShopMallBaseGoods,            
            method: 'GET',
            data: {
                goods_id:goods_id
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if(res.data.code==1000){
                  var update_mall_base_goods_item=res.data.data;
                  app.globalData.update_mall_base_goods_item=update_mall_base_goods_item;
                  wx.navigateTo({url: '/pages/mall/pages/add_goods/add_goods?goods_id='+goods_id,})
                }else{
                  wx.showToast({
                    title: ''+res.data.msg,
                    icon:'error',
                  })
                }     		
      },
      fail:function(err){
        wx.showToast({
          title: '网络异常',
          icon:'error'
        })
      },
		})
                
  },
  //获取商城里的商品详情信息
  selectSingleShopMallBaseGoodsForPriceUpdate: function(goods_id){		
    console.log(goods_id);

    if(goods_id<=0){
      return;
    }
		var that = this 		
        wx.request({
            url: app.globalData.selectSingleShopMallBaseGoods,            
            method: 'GET',
            data: {
                goods_id:goods_id
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if(res.data.code==1000){

                  var goods_item=res.data.data;
                  var goods_id=goods_item.id;               
                  that.setData({
                    goods_item:goods_item,
                    goods_id:goods_id,
                    b_spec_show:true,
                    sku_array:goods_item.lstSKU,
                  })


                }else{
                  wx.showToast({
                    title: ''+res.data.msg,
                    icon:'error',
                  })
                }     		
      },
      fail:function(err){
        wx.showToast({
          title: '网络异常',
          icon:'error'
        })
      },
		})
                
	},
  gotoFreshShoppingBill:function(e){
   
	if(this.data.total_amount==0){
		wx.showToast({
			title: '请先选择商品',
			icon:'error'
		})
		return;
	}

	var lstShoppingCart = JSON.parse(JSON.stringify(this.data.lstShoppingCart));
	for(var i=0;i<lstShoppingCart.length;i++){			
		lstShoppingCart[i].lstMallBillShoppingCart=lstShoppingCart[i].lstMallBillShoppingCart.filter(item=>item.int_check==1)	
	}	

	wx.navigateTo({
		url: '../freshshoppingbill/freshshoppingbill?item='+JSON.stringify(lstShoppingCart),
	})
  },
  goAddGoods(){

    wx.navigateTo({url: '/pages/mall/pages/add_goods/add_goods',})
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    

  console.log(options)
	this.setData({
    customer_openid:options.customer_openid,
  })
  this.selectData();
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
	this.loadNextPage();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  showSpecPopup(e){
		this.setData({
			b_spec_show:true,
		})
  },
	closeSpecPopup(e){
		this.setData({
			b_spec_show:false,
		})
  },
  showSpecStockPopup(e){
    var index=e.currentTarget.dataset.index;
    console.log(index)

    var sku_array=this.data.sku_array;
    console.log(sku_array);
    if(sku_array.length<index+1){
      return;
    }

    var paramObj=sku_array[index];

    console.log("当前显示："+paramObj)


		this.setData({
      param_index:index,
      param_shop_price:paramObj.shop_price>0?paramObj.shop_price:'',
      param_customer_price:paramObj.customer_price>0?paramObj.customer_price:'',
      param_customer_preferential_price:paramObj.customer_preferential_price>0?paramObj.customer_preferential_price:'',
      param_recharge_member_price:paramObj.recharge_member_price>0?paramObj.recharge_member_price:'',
      param_vip_member_price:paramObj.vip_member_price>0?paramObj.vip_member_price:'',
      
      param_platform_cut_rate:paramObj.platform_cut_rate>0?paramObj.platform_cut_rate:'',

      param_platform_cash_commission:paramObj.platform_cash_commission>0?paramObj.platform_cash_commission:'',
      param_shop_cash_commission:paramObj.shop_cash_commission>0?paramObj.shop_cash_commission:'',
      param_platform_star_commission:paramObj.platform_star_commission>0?paramObj.platform_star_commission:'',
      param_shop_star_commission:paramObj.shop_star_commission>0?paramObj.shop_star_commission:'',
      param_stock:paramObj.stock>0?paramObj.stock:'',
			b_spec_stock_show:true,
		})
	},
	closeSpecStockPopup(e){
		this.setData({
			b_spec_stock_show:false,
		})
  },
  saveSpecStockPopup(e){

    var param_index=this.data.param_index;
    var sku_array=this.data.sku_array;
    
    console.log("保存前:",sku_array);
    if(sku_array.length<param_index+1){
      return;
    }

    var param_shop_price=this.data.param_shop_price;
    
    var param_platform_cut_rate=this.data.param_platform_cut_rate;
    var param_customer_price=this.data.param_customer_price;
    var param_customer_preferential_price=this.data.param_customer_preferential_price;
    var param_recharge_member_price=this.data.param_recharge_member_price;
    var param_vip_member_price=this.data.param_vip_member_price;

    var param_platform_cash_commission=this.data.param_platform_cash_commission;
    var param_shop_cash_commission=this.data.param_shop_cash_commission;
    var param_platform_star_commission=this.data.param_platform_star_commission;
    var param_shop_star_commission=this.data.param_shop_star_commission;
    var param_stock=this.data.param_stock;


    var paramObj=sku_array[param_index];
    paramObj.shop_price=this.getFloatValue(param_shop_price);
    paramObj.customer_price=this.getFloatValue(param_customer_price);
    paramObj.customer_preferential_price=this.getFloatValue(param_customer_preferential_price);
    paramObj.recharge_member_price=this.getFloatValue(param_recharge_member_price);
    paramObj.vip_member_price=this.getFloatValue(param_vip_member_price);
    
    paramObj.platform_cut_rate=this.getFloatValue(param_platform_cut_rate);

    paramObj.platform_cash_commission=this.getFloatValue(param_platform_cash_commission);
    paramObj.shop_cash_commission=this.getFloatValue(param_shop_cash_commission);
    paramObj.platform_star_commission=this.getFloatValue(param_platform_star_commission);
    paramObj.shop_star_commission=this.getFloatValue(param_shop_star_commission);
    paramObj.stock=this.getIntValue(param_stock);

    console.log(sku_array);

    //保存
    this.setData({
      sku_array:sku_array,
			b_spec_stock_show:false,
    })
    this.closeSpecStockPopup();

    console.log("保存后：",this.data.sku_array);
    
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
  toDetail(e){
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + item.id,
  });
  },

})