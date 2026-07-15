const app = getApp()

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		currentTab: 'all',	
		orders: [],
		pageIndex: 1,
		pageSize: 10,
		isLoading: false,
		isOver: false,
    status: 0,
    fresh: 0, //是否重新刷新页面的标记，1是删除订单后需要重新刷新页面，默认0则是下拉获取更多订单而已，不是刷新
    comment:'',
    showComment: false,
    item: {},
    shop: {},
    gift_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/smp/20221031_b55b78edef204fa8a26cc7218e108af6.jpg', 
    status_1_count:0,
    status_2_count:0,
    status_3_count:0,
    status_4_count:0,
    status_5_count:0,
    status_6_count:0,
    status_7_count:0,
    status_8_count:0,
    status_9_count:0,
    status_10_count:0,
  },

  showSubmitComment(e){
		this.setData({
      showComment: true,
      item: e.currentTarget.dataset.item,
      shop: e.currentTarget.dataset.shop
		})	
	}, 

	closeShowComment(){
		this.setData({
			showComment: false,			
		})
	},

	comment_change(e){
		this.setData({
			comment: e.detail.value,			
		})
	},

	submitComment:function(e){  
    let that = this  
		var value = that.data.comment;
		if(value.length>400){
		  value = value.substring(0,399);
		}
		
    wx.request({
      url: app.globalData.insertMallBillComment_url,
      method: 'POST',
			data: {
        commentator_id: app.globalData.customerInf.id,
        sku_id: that.data.item.sku_id,
        bill_main_id: that.data.shop.id,
        goods_id: that.data.item.goods_id,
        shop_id: that.data.shop.shop_id,
        img_count: 0,
        tag: '',
        comment: that.data.comment,
        lstImg: [],
      },
      success(res){
        if(res.data.code !=1000){
          wx.showToast({
            title: res.data.msg,
          })
        }else{
          wx.showToast({
					  title: '提交评论成功！',
					  duration: 2000
					})
          that.closeShowComment()
          that.setData({
            comment: '',          
          })
        } 
        that.setData({
          fresh: 1
        })
        that.selectData()      
      }
    })	
	
	},
  
  toDetail(e) {
    wx.navigateTo({
      url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + e.currentTarget.dataset.id 
    })  
  },

  deleteOrder(e){
    let that = this
    wx.request({
      url: app.globalData.deleteMallBillMain_url,
      method: 'POST',
			data: {
        id: e.currentTarget.dataset.id
      },
      success(res){
        if(res.data.code == 1000){
          wx.showToast({
            title: '删除成功！',
            duration: 1000
          })
        }else{
          wx.showToast({
            title: '删除失败：' + res.data.msg,
            duration: 2000
          })
        }
        that.setData({
          fresh: 1
        })
        that.selectData()
      }
    })    
  },

  pay(e){
    wx.request({
			url: app.globalData.selectMallBillMainPaymentInfo_url,
			method: 'POST',
			data: {
        bill_main_id: e.currentTarget.dataset.item.id,
        bill_payment_id: e.currentTarget.dataset.item.bill_payment_id,
				customer_openid: app.globalData.openid,				
			},
			success(res){
        if(res.data.code == 1000){
          //是充值会员的情况
          if(res.data.data.member_info != null && res.data.data.member_info.mall_member_level_tag == 'recharge_member_price'){
            //充值账户余额不足的情况
            if(res.data.data.member_info.mall_member_total_recharge_amount < res.data.data.deduction_amount){
              wx.showModal({
                title: '出错提示',
                content: '充值账户余额不足(差额：' + (res.data.data.deduction_amount - res.data.data.member_info.mall_member_total_recharge_amount).toFixed(2) + '元），不可用充值会员价结算，请充值后再支付',
                showCancel: false                  
              })
            //充值账户余额足够的情况
            }else{
              wx.navigateTo({
                url: '../paymerchandise/paymerchandise?bill_payment_id=' + e.currentTarget.dataset.item.bill_payment_id + '&out_trade_no=' + res.data.data.out_trade_no
                + '&total_amount=' + e.currentTarget.dataset.item.total_amount + '&profit_sharing=' + res.data.data.profit_sharing + '&deductBalance=' + res.data.data.deduction_amount.toFixed(2) + '&bill_main_id=' + e.currentTarget.dataset.item.id + '&isPostPay=1'
              }) 
            }
          //不是充值会员的情况              
          }else{
            wx.navigateTo({
              url: '../paymerchandise/paymerchandise?bill_payment_id=' + e.currentTarget.dataset.item.bill_payment_id + '&out_trade_no=' + res.data.data.out_trade_no
              + '&total_amount=' + e.currentTarget.dataset.item.total_amount + '&profit_sharing=' + res.data.data.profit_sharing + '&bill_main_id=' + e.currentTarget.dataset.item.id + '&isPostPay=1'
            }) 
          }
        }else{
          if(res.data.code == 1111){
            wx.showModal({
              title: '出错提示',
              content: '此单已支付！',
              showCancel: false                  
            })
          }else{
            wx.showModal({
              title: '未知错误',
              content: res.data.msg,
              showCancel: false                  
            })
          }
        }
      }
    })
  },
  applyRefund(e){
    var bill_detail_item=e.currentTarget.dataset.item;
    var bill_main_id=e.currentTarget.dataset.id;
    var that=this;

    wx.showModal({
      editable:true,//显示输入框
      placeholderText:'输入退款备注',//显示输入框提示信息
      success: res => {
        if (res.confirm) { //点击了确认
          console.log(res.content)//用户输入的值
          var refund_submit_remark= res.content;
          that.applyRefundExec(bill_detail_item,bill_main_id,refund_submit_remark);
        } 
      }
    })
    
  },
  applyRefundExec(bill_detail_item,bill_main_id,refund_submit_remark){
    let that = this
    wx.request({
			url: app.globalData.updateMallBillDetailRefund,
			method: 'POST',
			data: {
        id: bill_detail_item.id,	
        refund_status:1,
        refund_submit_remark:refund_submit_remark		
			},
			success(res){
				if(res.data.code == 1000){
          bill_detail_item.refund_status=1;
          var orders=that.data.orders;
          orders.forEach(m => {
            if(m.id==bill_main_id){
              m.lstDetail.forEach(d => {
                  if(d.id==bill_detail_item.id){
                      d.refund_status=1;
                  }
              });
            }
           
          });
          that.setData({
            orders:orders,
          })
					wx.showToast({
					  title: '已提交退货/款申请',
					  duration: 2000
					})
				} else {
					wx.showModal({
            title: '出错信息',
            content: '申请失败：' + res.data.msg,
            showCancel: false
          })
        }
        that.setData({
          fresh: 1
        })
        that.selectData()
			},
			fail(res){
				app.showFailMessage()
			}

		})
  },

  confirmRefund(e){
    let that = this
    wx.request({
			url: app.globalData.updateMallBillMainStatus_url,
			method: 'POST',
			data: {
				id: e.currentTarget.dataset.id,
				status: 8,				
			},
			success(res){
				if(res.data.code == 1000){
					wx.showToast({
					  title: '退货/款完成',
					  duration: 2000
					})
				} else {
					wx.showModal({
            title: '出错信息',
            content: '申请失败：' + res.data.msg,
            showCancel: false
          })
        }
        that.setData({
          fresh: 1
        })
        that.selectData()
			},
			fail(res){
				wx.showModal({
					title: '确认退款失败, 服务器失联，请截图找客服',
					showCancel: false
				})
			}

		})
  },

  pushShipping(){
    wx.showModal({
      title: '程序猿正快马加鞭实现这个功能，敬请期待',
      showCancel: false
    })
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

   // 切换订单状态菜单
   	switchTab(event) {
    	const activeTab = event.currentTarget.dataset.tab;
    	this.setData({ 
        currentTab: activeTab,
        pageIndex: 1,
        orders: [],
        isOver: false,
		});
		
		if(activeTab=='all'){			
			this.setData({
				status: 0
			})
			this.selectData()
		}else if(activeTab=='toPay'){
			this.setData({
				status: 1
			})
			this.selectData()
		}else if(activeTab=='toShip'){			
			this.setData({
				status: 2
			})
			this.selectData()
		}else if(activeTab=='toReceive'){
			this.setData({
				status: 3
			})
			this.selectData()
		}else if(activeTab=='toComment'){			
			this.setData({
				status: 4
			})
			this.selectData()
    }	else if(activeTab=='refund'){			
			this.setData({
				status: 5
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

 	selectData(){
    let that = this
    let fresh = that.data.fresh
    var statuses = [that.data.status]
    if(that.data.status == 2){
      statuses = [9,2]
    }else if(that.data.status == 5){
      statuses = [6,7,8,10]
    }else if(that.data.status == 0){
      statuses = []
    }
    that.getAllOrdersNum();

		wx.request({
		  url: app.globalData.selectMallBillMainList_url,
			method: 'POST',
			data: {
         buyer_id: app.globalData.customerInf.id,
				 buyer_type: 1,
				 //状态为0代表想获取所有状态的订单
				 //订单状态 1-已下单待付款 9-已付款待接单 2-已接单待发货 3-已发货待收货 4-已收货待评价 5-已评论订单完成 6-申请退款退货 7-同意退款退货 8-退款退货成功 10-商家拒绝退款退货
         statuses: statuses,          
				 page_size: that.data.pageSize,
				 page_index: fresh ? 1 : that.data.pageIndex,
			},
			success(res){
				if(res.data.code == 1000){
					const newOrders = res.data.data;
					if(newOrders.length == 0){
						that.setData({
							isOver: true,
						})
          }
          if(that.data.fresh == 1){
            that.setData({
              orders: newOrders,              
              fresh: 0
            })
          }else{
            that.setData({
              orders: that.data.orders.concat(newOrders),              
            })
          }
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
	this.setData({
		status: options.status
	})
	
	if(this.data.status == 0){
		this.setData({
			currentTab: 'all'
		})
	} else if(this.data.status == 1){
		this.setData({
			currentTab: 'toPay'
		})
	} else if(this.data.status == 2){
		this.setData({
			currentTab: 'toShip'
		})
	}
	else if(this.data.status == 3){
		this.setData({
			currentTab: 'toReceive'
		})
	} else if(this.data.status == 4){
		this.setData({
			currentTab: 'toComment'
		})
  }
  
  else if(this.data.status == 5){
		this.setData({
			currentTab: 'refund'
		})
	}
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
  getAllOrdersNum(){
		let that = this
		wx.request({
		  url: app.globalData.selectMallBillMainStatusCount_url,
			method: 'POST',
			data: {
				 buyer_id: app.globalData.customerInf.id,				
				 buyer_type: 1,				 			 
			},
			success(res){
				if(res.data.code == 1000){
         
          //订单状态 1-已下单待付款 9-已付款待接单 2-已接单待发货 3-已发货待收货 4-已收货待评价 5-已评论订单完成 6-申请退款退货 7-同意退款退货 8-退款退货成功
          var item=res.data.data;
          that.setData({
            status_1_count:item.status_1_count,
            status_2_count:item.status_2_count,
            status_3_count:item.status_3_count,
            status_4_count:item.status_4_count,
            status_5_count:item.status_5_count,
            status_6_count:item.status_6_count,
            status_7_count:item.status_7_count,
            status_8_count:item.status_8_count,
            status_9_count:item.status_9_count,
            status_10_count:item.status_10_count,
          })	
          
				}				
			},			
		})
  },
})