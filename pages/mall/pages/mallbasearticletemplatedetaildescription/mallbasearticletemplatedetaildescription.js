const app = getApp()

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
    mall_base_description_array:[],
	},
 
	// 监听用户触底事件，加载下一页数据
	onPageScroll: function (e) {
		
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {   
    
    var that = this;   	
    this.selectSingleMallBaseDescription();
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

    
      
   },
  onShareTimeline: function () {
          
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
  selectSingleMallBaseDescription(){
    //分页查询已完成模板
    let that = this

    wx.request({
        url: app.globalData.selectSingleMallBaseDescription,        
        method: 'POST',
        data: {         
          description_type:1,       
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            that.setData({
              mediaIsLoading:false,
            })
            if(res.data.code == 1000){
              var mall_base_description_array = res.data.data;
              that.setData({
                mall_base_description_array: mall_base_description_array,
              })
            }                                
        },
        fail(res){
          that.setData({
            mediaIsLoading:false,
          })
          wx.showToast({
            title: '获取操作说明失败:'+res.data.msg,
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
			},
			fail: res=>{
        that.showMsg("网络异常");
			   console.log("绑定失败:" + res.data.msg)
			}
		})
  },
  toDetail(e){
      var goods_id=this.data.goods_id;

      if(goods_id>0){
        wx.navigateTo({
          url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + goods_id,
        })
      }else{
        wx.showToast({
          title: 'goods_id为空',
          icon:'error',
        })
      }
     

  },
})