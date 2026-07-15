const app = getApp()

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
    current_item:null,
    listIndex:1,
		currentTab: 'all',	
		orders: [],
		isLoading: false,
    begin_date:'',
    end_date:''
  },
  initCurrentDate(){
    var date=new Date();
    var year = date.getFullYear(); //获取当前年份
    var month = date.getMonth() + 1; //获取当前月份
    var day = date.getDate(); //获取当前日期
    var current_date=year+'-'+month+'-'+day;
    if(this.data.begin_date==''){
      this.setData({
        begin_date:current_date,
      })
    }
    if(this.data.end_date==''){
      this.setData({
        end_date:current_date,
      })
    }
    

  },
	//确认收货
	confirmReceipt(e){		
    let that = this
		wx.request({
			url: app.globalData.updateMallBillMainStatus_url,
			method: 'POST',
			data: {
				id: e.currentTarget.dataset.id,
				status: 4,				
			},
			success(res){
				if(res.data.code == 1000){
					wx.showToast({
					  title: '确认收货成功',
					  duration: 2000
					})
				} else {
					wx.showToast({
						title: '确认收货失败：' + res.data.msg,
						duration: 2000
					})
        }
        that.setData({
          fresh: 1
        })
        that.selectData()
			},
			fail(res){
				wx.showModal({
					title: '确认收货失败, 服务器失联，请截图找客服',
					showCancel: false
				})
			}

		})
	},
	// 监听用户触底事件，加载下一页数据
	onPageScroll: function (e) {
		
  },
  selectTop1Data(){
    let that = this
		wx.request({
		  url: app.globalData.selectTop1MallBillRiceDeliverySetList,
			method: 'POST',
			data: {
         buyer_id: app.globalData.customerInf.id,
         buyer_type: 1,
         begin_date:that.data.begin_date,
	       end_date:that.data.end_date
			},
			success(res){
				if(res.data.code == 1000){
          const newOrders = res.data.data;
          
          
					that.setData({
            orders: newOrders,              
          })
          var count=newOrders.length;
          wx.showToast({
            title: '查询到'+count+"条记录",
            icon:'none',
          })
        }
        if(that.data.orders.length>0){
            that.setData({
              listIndex:0,
              current_item:that.data.orders[0],
            })
        }else{
          that.setData({
            listIndex:-1,
          })
        }
        				
			},
			fail(res){
				app.showFailMessage(3,res)				
      },
      complete(res){
        that.setData({
					isLoading: false // 设置isLoading为false，表示数据加载完成（或加载失败）
				});
      }
    })
    
    
  },
 	selectData(){
    let that = this
    this.initCurrentDate();
    //that.getAllOrdersNum();

		wx.request({
		  url: app.globalData.selectMallBillRiceDeliverySetList,
			method: 'POST',
			data: {
				 buyer_id: app.globalData.customerInf.id,
         buyer_type: 1,
         begin_date:that.data.begin_date,
	       end_date:that.data.end_date
			},
			success(res){
				if(res.data.code == 1000){
          const newOrders = res.data.data;
          
					that.setData({
            orders: newOrders,              
          })
          var count=newOrders.length;
          wx.showToast({
            title: '查询到'+count+"条记录",
            icon:'none',
          })
        }
        if(that.data.orders.length>0){
            that.setData({
              listIndex:0,
              current_item:that.data.orders[0],
            })
        }else{
          that.setData({
            listIndex:-1,
          })
        }
        				
			},
			fail(res){
				app.showFailMessage(3,res)				
      },
      complete(res){
        that.setData({
					isLoading: false // 设置isLoading为false，表示数据加载完成（或加载失败）
				});
      }
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  //初始化日期
  	
	this.selectTop1Data();		
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
  bindBeginDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      begin_date: e.detail.value
    })
  },
  bindEndDateChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      end_date: e.detail.value
    })
  },
  itemClick(e) {
    var that = this;
    let i = e.currentTarget.dataset.index
    var current_item=that.data.orders[i];
    that.setData({
      listIndex: i, //获取
      current_item:current_item,
    })
  },
  updateReceiveGoodsStatus:function(e){
   
    let that = this
    
    if(this.data.listIndex<0){
      return;
    }

    var current_item=this.data.current_item;
    var status=current_item.status;

    if(status!=3){
      wx.showToast({
        title: '当前不可签收！',
        icon:'error'
      })
      return;
    }
    that.updateMallBillRiceDeliverySetStatusExec(current_item,4);
    },
    updateMallBillRiceDeliverySetStatusExec(current_item,status){
      var that=this;
            wx.request({
              url: app.globalData.updateMallBillRiceDeliverySetStatus,
            method: 'POST',
            data: {
              id: current_item.id,
              //状态为0代表想获取所有状态的订单
              //订单状态 1-已付款待接单 2-已接单待配送 3-配送中待收货 4-已收货 
              status: status, 
            },
            success(res){
              if(res.data.code == 1000){

                if(status==4){
                  wx.showToast({
                    title: '已签收',
                  })
                }

                var date=new Date();
                var year = date.getFullYear(); //获取当前年份
                var month = date.getMonth() + 1; //获取当前月份
                var day = date.getDate(); //获取当前日期
                var current_date=year+'-'+month+'-'+day;

                var orders=that.data.orders;
                for(var i=0;i<orders.length;i++){
                  if(orders[i].id==current_item.id){
                    orders[i].status=status;
                    orders[i].receive_goods_date=current_date;
                    that.setData({
                      current_item:orders[i],
                    })
                    break;
                  }
                }
                that.setData({
                  orders:orders,
                })
              
              }else{
                wx.showToast({
                  title: '操作失败:'+res.data.data.msg,
                  icon:'error',
                  duration: 2000,
                }) 
              }
            },
            fail(res){
              wx.showToast({
                title: '访问接口失败',
                icon:'error',
                duration: 2000,
              }) 
            }
          })

    },

})