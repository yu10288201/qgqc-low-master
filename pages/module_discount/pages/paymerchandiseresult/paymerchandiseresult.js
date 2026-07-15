const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
    data: {
		
		payment_success_img: app.globalData.payment_success_img,
		bind_type:0,
		is_video_show:app.globalData.is_video_show,
		is_fresh_distribution:0,
		is_set_meal_weight:0,
		shop_description: '',		
		other_products: [],
		currentBlockColor: "#000000",
		blockColor: "#000000",
		colorGamut:"-webkit-linear-gradient(left, #ffffff 0%, #ff0000 100%)",
		colorGray:"-webkit-linear-gradient(left, #000000 0%, #ffffff 100%)",
		colorGamutTip:"#ff0000",
		colorGrayTip:"#ffffff",
		colorValue:0,
		colorGamutValue:0,
      	colorGrayValue:0,
        isShowGetAvatar:false,
        constituteByOrderIdList: [],
        ticket_order_id:0,
        fromMenu: false,
        refund: 0,
        private_room: 0,
        holidays: 0,
        past_refund: 0,
        isFromBuyLoveSet: false,
        customerInf: '',
        inviterOpenid: '',
        moreInf: true,
        ruleid: false,
        transform: 'rotate(0deg)',
        webkitline: 6,
        setMeal: '',
        setMealType: '',
        startData: '',
        endData: '',
        timeList: [],
        file_id: 0,
        id: 0,
        godappraise: -1,
        godappraise1: 6,
        ladderStart: false,
        width: parseInt(wx.getSystemInfoSync().windowWidth * 0.94 * 0.96),
        height: parseInt(wx.getSystemInfoSync().windowWidth * 0.94 * 0.96 * 1.3 / 2),
        show_rule: false,
        cusid: '',
        SYB_APPID: '',
        sub_merchants_id: '',
        picture: [{
                img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3306430909,3982376892&fm=26&gp=0.jpg'
            },
            {
                img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3419315812,2223739414&fm=26&gp=0.jpg'
            },
            {
                img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4006551618,3513016832&fm=26&gp=0.jpg'
            }, 
            {
                img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1682160878,3531013921&fm=26&gp=0.jpg'
            }
        ],
	},

	toDetail(e) {      
        let a = e.currentTarget.dataset.item  
        console.log('商品id:' + a.id)    
        wx.navigateTo({
            url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + a.id
        })  
    },
	
	getOtherProducts(shopID) {
        let that = this
        wx.request({
            url: app.globalData.selectMallBaseGoodsList_url,        
            method: 'POST',
            data: {                
              shop_id: app.globalData.is_video_show? 0 : 19318,    
              category_id: 0,               
              page_size: 30,  //hardcode成每次拿30个
              page_index: 1   //           
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
	
  goHome: function (e) {        
      wx.reLaunch({
        url: '/pages/mall/pages/index/index',
    })
  },
    
	goBill: function (e) {		
		wx.navigateTo({
      url: '/pages/module_discount/pages/allorders/allorders?status=0',
    })
  },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {       
      this.getOtherProducts(0)
	},	
        
	
    
    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        let that = this
        this.setData({
          is_video_show:app.globalData.is_video_show,
        })
    },

    selectComboFrom(orderId){
        let that =  this
        //从menu跳转进来查看已选择菜品
        wx.request({
          url: app.globalData.selectComboConstitute,
          data:{
            orderId: orderId
          },
          success:res=>{
            console.log(res);
            if(res.data.code == 1){
              that.setData({
                constituteByOrderIdList: res.data.paramsList
              },()=>{
                that.selectConstitute()
              })
            }
          }
        })
      },

 

   

   
    
  //秘邻视频审核失败回调方法
    videoVertifyFailed(e){
      console.log(e)
    },
    // 秘邻视频审核通过回调方法
    videoVertifySuccess(e){
      console.log(e)
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
})