// pages/mall/pages/outfitpreview/outfitpreview.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img_url:'',
        bind_type:0,
        associate_type:0,
        shop_id:0,
        associate_id:0,
        goods_id:0,
        card_is_in_activity:0,
    },
/**
 *  path: 'pages/mall/pages/outfitresult/outfitresult?bind_type=3&associate_type=2&' + 
            'shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +
            '&goods_id=' + goods_id+'&card_is_in_activity='+card_is_in_activity+'&img_url='+imgUrl,
            imageUrl: imgUrl,
 */
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
          var img_url=options.img_url;
          var bind_type=Number(options.bind_type);
          var associate_type=Number(options.bind_type);
          var shop_id=Number(options.shop_id);
          var associate_id=Number(options.associate_id);
          var goods_id=Number(options.goods_id);
          var card_is_in_activity=Number(options.card_is_in_activity);

          this.setData({
            img_url:img_url,
            bind_type:bind_type,
            associate_type:associate_type,
            shop_id:shop_id,
            associate_id:associate_id,
            goods_id:goods_id,
            card_is_in_activity:card_is_in_activity,
          })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

        // var that = this;

        // var is_in_activity=0;    
        // var title = 'AI试衣，你也来试试吧！' ;
        // var card_is_in_activity=0;
        // if(is_in_activity==1){
         
        //   card_is_in_activity=1;
        // }
        // var imgUrl = that.data.img_url;

        // var shop_id=0;
        // var goods_id=0;
        // if(this.data.top_shop_id>0){
        //   shop_id=this.data.top_shop_id;
        //   goods_id=this.data.top_goods_id;
          
        // }else if(this.data.bottom_shop_id>0){
        //   shop_id=this.data.bottom_shop_id;
        //   goods_id=this.data.bottom_shop_id;
          
        // }
       

        // console.log('title:'+title)
        // let shareObj = {
        //     title: title,
        //     path: 'pages/module_discount/pages/Merchandise_details/Merchandise_details?bind_type=3&associate_type=2&' + 
        //     'shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +
        //     '&goods_id=' + goods_id+'&card_is_in_activity='+card_is_in_activity+'&img_url='+imgUrl,
        //     imageUrl: imgUrl,
        //     success: function (res) {
        //         if (res.errMsg == 'shareAppMessage:ok') {
        //             that.hide();
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
  
    toMerchandise_details(e){
      var goods_id=this.data.goods_id;
      if(goods_id>0){
        wx.navigateTo({
          url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id='+goods_id,
        })
      }
    }, 
    saveToAlbum(e){
      var img_url=this.data.img_url;
      wx.downloadFile({
        url: img_url,
        success: function (res) {
          var temp = res.tempFilePath
          wx.saveImageToPhotosAlbum({
            filePath: temp,
            success: function (res) {
                wx.showToast({
                  title: '保存成功',
                  icon:'none'
                })
              
            },
            fail: function (err) {
                console.log(err);
            }
          })
        },
        fail: function (err) {
          reject(err)
        }
      })
  },
  toMallGuide(e){
    wx.navigateTo({
      url: '/pages/mall_guide/mall_guide?category_id=15&selected_category=sy',
    })
  }
   
})