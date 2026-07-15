const app = getApp()

Page({

    /**
     * 页面的初始数据
     */
  data: {    
    shop_id: 0,
    shop_name: '',
    shop_description: '',
    shop_img:'', 
    lei_xing_id:0,
    lei_xing_id_name:'',
    def_shop_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/sszg/mall/index/home/shop_log_1000.png',
    starimage: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/index/' + '0' + 'star.png',   
  },  	

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {    
      this.setData({
        shop_id: options.shop_id,
        shop_name: options.shop_name,
        shop_img: options.shop_img
      })
      this.getShopDescription()
      this.getProducts()
	  },  

    getShopDescription() {
        let that = this
        wx.request({
            url: app.globalData.selectShopDescribes_url,        
            method: 'POST',
            data: {                
                shop_id: that.data.shop_id                
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                var starimagePre='https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/index/';
                that.setData({
                    shop_description: res.data.data.describes,
                    lei_xing_id:res.data.data.lei_xing_id,
                    starimage:starimagePre+res.data.data.star+'star.png',
                }) 
                var lei_xing_id_name='未知店铺类型';
                if(that.data.lei_xing_id==1){
                  lei_xing_id_name='餐饮';
                }else if(that.data.lei_xing_id==2){
                  lei_xing_id_name='商城';
                }else if(that.data.lei_xing_id==3){
                  lei_xing_id_name='餐饮及商城';
                }   
                that.setData({
                  lei_xing_id_name:lei_xing_id_name,
                })          
            }
        })
    },    

    getProducts() {
        let that = this
        wx.request({
            url: app.globalData.selectMallBaseGoodsList_url,        
            method: 'POST',
            data: {                
                shop_id: app.globalData.is_video_show ? that.data.shop_id : 19318,    
                category_id: 0,           
                page_size: 30,  //hardcode成每次拿30个
                page_index: 1              
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                if(res.data.code == 1000){
                    that.setData({
                        products: res.data.data,
                    })
                }                                
            }
        })
    },



    toDetail(e) {      
        let a = e.currentTarget.dataset.item      
        wx.navigateTo({
            url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + a.id
        })  
    },    
 
    onHide: function () {

    },
})