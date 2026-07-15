const app = getApp()
var util = require('../../../../utils/util.js');
const wxpay = require('../../../../utils/wxpay')
Page({
  /**
   * 页面的初始数据
   */
  data: {

	other_products:[],
    total_amount:0.00,
    total_item_number:0,
    all_int_check:0,
    lstShoppingCart: [],    
    def_img_suffix:'?x-oss-process=image/resize,m_fill,h_72,w_82',
    img_shoppingcart:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/shoppingcart.png',  
  },

  toDetail(e) {      
    let a = e.currentTarget.dataset.item      
    wx.navigateTo({
      url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + a.id
    })  
  },
  toGiftDetail(e){
    var item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + item.gift_goods_id,
  })

},

  checkTotal(){
   var total_amount=0;
   var total_item_number=0;
   var lstShoppingCart=this.data.lstShoppingCart;
    for(var i=0;i<lstShoppingCart.length;i++){
      var shop=lstShoppingCart[i];
      for(var j=0;j<shop.lstMallBillShoppingCart.length;j++){
        if(shop.lstMallBillShoppingCart[j].int_check==1){
          total_item_number=total_item_number+shop.lstMallBillShoppingCart[j].number;          
          total_amount=total_amount+shop.lstMallBillShoppingCart[j].number*shop.lstMallBillShoppingCart[j].price;
        }
      }
    }
    
    this.setData({
      total_amount:total_amount.toFixed(2),
      total_item_number:total_item_number
    })        
  },

  selectData: function (e) {	
	var that = this	
	wx.request({
      url: app.globalData.selectMallBillShoppingCart_url,
      method: 'GET',
      data: {
		    buyer_id: app.globalData.customerInf.id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if(res.data.code == 1000){         
          var lstShoppingCart = res.data.data.map(function(item) {
          return { ...item, int_check: 0 };
        })

        for (var i=0; i<lstShoppingCart.length; i++){
          var eachShopCart = lstShoppingCart[i].lstMallBillShoppingCart.map(function(item) {
          return { ...item, int_check: 0 }
          
        })
            if(eachShopCart&&eachShopCart.length>0){
              that.setData({
                category_id:eachShopCart[0].eachShopCart,
              })
            }
            lstShoppingCart[i].lstMallBillShoppingCart = eachShopCart
        }		 

        that.setData({
              lstShoppingCart: lstShoppingCart,
        })
        
        that.checkTotal()
         
        }else{
            wx.showToast({
              title: '获取购物车商品失败'+res.data.result,
              icon:'error',
            })                    
        }
      },
      fail: function (res) {
        app.showFailMessage(3, res)
      }
    })
  },
 
  deleteData: function () {
    var that = this
    var all_int_check=this.data.all_int_check;
    var shop_ids='';
    var ids='';
    if(all_int_check==0){
            var lstShoppingCart=this.data.lstShoppingCart;
            for(var i=0;i<lstShoppingCart.length;i++){
              var shop=lstShoppingCart[i];
              if(shop.int_check==1){
                if(shop_ids==''){
                    shop_ids=''+shop.shop_id;
                }else{
                  shop_ids=shop_ids+','+shop.shop_id;
                }
              }
              for(var j=0;j<shop.lstMallBillShoppingCart.length;j++){
                if(shop.lstMallBillShoppingCart[j].int_check==1){
                    if(ids==''){
                      ids=''+shop.lstMallBillShoppingCart[j].id;
                    }else{
                        ids=ids+','+shop.lstMallBillShoppingCart[j].id;
                    }
                }
              }
            }
  
    }
    
    if(all_int_check==0&&shop_ids==''&&ids==''){
      wx.showToast({
        title: '未选中商品',
        icon:'error'
      })
      return;
    }   
    that.deleteExec(all_int_check,shop_ids,ids);
  },

  clearData: function () {
    var that = this
    var all_int_check=1;
    var shop_ids='';
    var ids='';
    that.deleteExec(all_int_check,shop_ids,ids);
  },

  deleteOneItem(e){
    let that = this  
    var id = e.currentTarget.dataset.id  
    wx.showModal({
        title: '提示',
        content: '确定要删除此商品吗？',
        success: function (res) {
          if (res.confirm) {
            wx.request({
				url: app.globalData.deleteMallBillShoppingCart_url,
				method: 'POST',
				data: {
				  id:id,				  
				},
				header: {
				  'content-type': 'application/json'
				},
				success: function (res) {
					that.selectData()
				},
				fail: function (res){
					console.log('删除购物车项失败！')
				}
			})
          }
        }
      })      
  },

  deleteExec: function (all_int_check,shop_ids,ids) {
    var that = this
    var openid=app.globalData.openid;
    var url=app.globalData.deleteCustomerShoppingCart_url;  

    if(all_int_check==0&&shop_ids==''&&ids==''){
      wx.showToast({
        title: '未选中商品',
        icon:'error'
      })
      return;
    }

    wx.request({
      url: url,
      method: 'POST',
      data: {
        openid:openid,
        shop_ids:shop_ids,
        ids:ids,
        all_int_check:all_int_check,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if(res.data.code==1){
          console.log('res.data.code==1')
          console.log(res.data.data)
          that.selectData();
          return;
        }else{
            wx.showToast({
              title: '操作失败'+res.data.result,
              icon:'error',
            })
            return;
        }
      }
    })
  },

  bigimg2: function (e) { //查看照片大图   
    var imgBox = []    
    imgBox.push(e.currentTarget.dataset.src);
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: imgBox // 需要预览的图片http链接列表
    })
  },

  bindMinus: function (e) {	
	var copyCart = this.data.lstShoppingCart
	for(var i=0; i<copyCart.length; i++){
		var shop = copyCart[i]
		for(var j=0; j<shop.lstMallBillShoppingCart.length; j++){
			var item = shop.lstMallBillShoppingCart[j]
			if(item.id == e.currentTarget.dataset.id){
				if(item.number > 1){
					item.number = item.number - 1
					wx.request({
						url: app.globalData.updateMallBillShoppingCart_url,        
						method: 'POST',
						data: {                
							id: item.id,               
							number: item.number,  							           
						},
						header: {
							'content-type': 'application/json'
						},
						
					})
				}
				break
			}
		}
	}
	this.setData({
		lstShoppingCart: copyCart
  })	
  this.checkTotal();	
	
  },

	bindPlus: function (e) {  		
		var copyCart = this.data.lstShoppingCart
		for(var i=0; i<copyCart.length; i++){
			var shop = copyCart[i]
			for(var j=0; j<shop.lstMallBillShoppingCart.length; j++){
				var item = shop.lstMallBillShoppingCart[j]
				if(item.id == e.currentTarget.dataset.id){
					item.number = item.number + 1
					wx.request({
						url: app.globalData.updateMallBillShoppingCart_url,        
						method: 'POST',
						data: {                
							id: item.id,               
							number: item.number,  							           
						},
						header: {
							'content-type': 'application/json'
						},
						
					})
					break
				}
			}
		}

		this.setData({
			lstShoppingCart: copyCart
    })
    this.checkTotal();		
	},

  allCheckedChange(e){
    if(this.data.all_int_check==1){
      this.setData({
        all_int_check:0,
      })
    }else{
      this.setData({
        all_int_check:1,
      })
    }

    var all_int_check=this.data.all_int_check;
    var lstShoppingCart=this.data.lstShoppingCart;
    for(var i=0;i<lstShoppingCart.length;i++){
      var shop=lstShoppingCart[i];
      shop.int_check= all_int_check;
      for(var j=0;j<shop.lstMallBillShoppingCart.length;j++){
       shop.lstMallBillShoppingCart[j].int_check= all_int_check;       
      }
    }

    this.setData({
      lstShoppingCart:lstShoppingCart,
    })
    this.checkTotal();   
    
  },

  shopCheckedChange(e){
    console.log(e);
    var shop_id=e.currentTarget.dataset.shop_id;
    var lstShoppingCart=this.data.lstShoppingCart;
    console.log(lstShoppingCart)
    for(var i=0;i<lstShoppingCart.length;i++){
      var shop=lstShoppingCart[i];
      if(shop.shop_id==shop_id){
        console.log(shop);
        var int_check=0;
        if(shop.int_check==0){
          int_check=1;
        }
        console.log(shop);
        for(var j=0;j<shop.lstMallBillShoppingCart.length;j++){          
          shop.lstMallBillShoppingCart[j].int_check=int_check;          
        }
         shop.int_check=int_check;
         break;
      }
    }
    this.setData({
      lstShoppingCart:lstShoppingCart,
    })
    this.checkTotal();
  },

  detailCheckdChanged(e){
    console.log(e);
    var shoppingchartid=e.currentTarget.dataset.shoppingchartid;
    var shop_id=e.currentTarget.dataset.shop_id;
    var lstShoppingCart=this.data.lstShoppingCart;
    for(var i=0;i<lstShoppingCart.length;i++){
        var shop=lstShoppingCart[i];
        if(shop.shop_id!=shop_id){
          continue;
        }
        for(var j=0;j<shop.lstMallBillShoppingCart.length;j++){
          if(shop.lstMallBillShoppingCart[j].id==shoppingchartid){
            var int_check=0;
            if(shop.lstMallBillShoppingCart[j].int_check==0){
              int_check=1;
            }
            shop.lstMallBillShoppingCart[j].int_check=int_check;           
          }
         }
    }
    this.setData({
      lstShoppingCart:lstShoppingCart,
    })
    this.checkNeedParentChecked();
    this.checkTotal();
  },

  checkNeedParentChecked(){

    //检查明细项，判断店铺层次是否需要全选
    var lstShoppingCart=this.data.lstShoppingCart;
    var all_int_check=1;
    for(var i=0;i<lstShoppingCart.length;i++){
        var shop=lstShoppingCart[i];
        var int_check=0;
        for(var j=0;j<shop.lstMallBillShoppingCart.length;j++){
            int_check=int_check+shop.lstMallBillShoppingCart[j].int_check;
            if(shop.lstMallBillShoppingCart[j].int_check==0){
              all_int_check=0;
            }
         }
         if(int_check==shop.lstMallBillShoppingCart.length){
           shop.int_check=1;
         }else{
           shop.int_check=0;
         }
    }
    
    this.setData({      
      lstShoppingCart:lstShoppingCart,
      all_int_check:all_int_check,
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
  var no_goods=false;

  var lstShoppingCartSubmit=[];
  var category_id=0;

  for(var i=0;i<lstShoppingCart.length;i++){			
    lstShoppingCart[i].lstMallBillShoppingCart=lstShoppingCart[i].lstMallBillShoppingCart.filter(item=>item.int_check==1)
    if(lstShoppingCart[i].lstMallBillShoppingCart.length>0){
      //此处需要去除没选择商品的店铺
      lstShoppingCartSubmit.push(lstShoppingCart[i]);
      for(var j=0;j<lstShoppingCart[i].lstMallBillShoppingCart.length;j++){
          var goods_item=lstShoppingCart[i].lstMallBillShoppingCart[j];
          goods_item.give_color_global_total_voucher=0;//赠送代金券设置为0
          var tmp_amount=goods_item.actual_price*goods_item.number;
      }
      category_id=lstShoppingCart[i].lstMallBillShoppingCart[0].category_id;
    }    
  }	


  if(lstShoppingCartSubmit.length==0){
    wx.showToast({
			title: '请先选择商品',
			icon:'error'
		})
    return;
    
  }
  console.log("category_id="+category_id);
  if(category_id==14){
    //大米单独的购物页面
    wx.navigateTo({
      url: '../freshshoppingricebill/freshshoppingricebill?item='+JSON.stringify(lstShoppingCartSubmit),
    })
  }else{
    wx.navigateTo({
      url: '../freshshoppingbill/freshshoppingbill?item='+JSON.stringify(lstShoppingCartSubmit),
    })
  }
  

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    var that = this;
    that.selectData();
    that.getOtherProducts(0)
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  getOtherProducts(shopID) {
    let that = this
    wx.request({
      url: app.globalData.selectMallBaseGoodsList_url,        
      method: 'POST',
      data: {                
        shop_id: app.globalData.is_video_show ? 0 : 19318,  
        category_id: 0,         
        page_size: 30,  //hardcode成每次拿30个
        page_index: 1   //一开始每次只搞头30个           
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
})