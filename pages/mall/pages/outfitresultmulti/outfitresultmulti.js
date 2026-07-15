// pages/mall/pages/outfitpersonsearch/outfitpersonsearch.js
const app=getApp();
Page({


    /**
     * 页面的初始数据
     */
    data: {
      associate_id:0,
      ids:'',
      person_array:[],
      scrollTop:0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
       console.log("测试多分享：")
       console.log(options)
          if(options.associate_id){
            this.setData({
              associate_id:Number(options.associate_id),
            })
          }
          if(options.ids){
            console.log(options.ids);
            this.setData({ids:options.ids,})
          }
          this.mallOutfitAnyoneSelectMallOutfitAnyoneByIds();
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
    },
   
    mallOutfitAnyoneSelectMallOutfitAnyoneByIds(){
      //查询
          var that=this;
          var url=app.globalData.mallOutfitAnyoneSelectMallOutfitAnyoneByIds;
          wx.showLoading({
            title: '加载中',
          })
          var data={
            ids:this.data.ids,
          }
          console.log(url);
      
          wx.request({
            url: url,
            data:data,
            method:'POST',
            success:function(res){
              wx.hideLoading();
              if(res.data.code!=1000){
                wx.showToast({
                  title: ''+res.data.msg,
                  icon:'none',
                })
              }else{
                  var new_array=res.data.data;
                  that.setData({
                    person_array:new_array,
                  })
        
              }
    
            },
            fail:function(err){
              wx.hideLoading();
              console.log(err)
            }
          })
      },
    toOutfitResult(e){

        console.log('toOutfitResult')
        var that = this;
        var img_url=e.currentTarget.dataset.img_url;
        var index=Number(e.currentTarget.dataset.index);
        var item=this.data.person_array[index];
        var top_goods_id=item.top_goods_id;
        var bottom_goods_id=item.bottom_goods_id;
        var top_goods_name=item.top_goods_name;
        var bottom_goods_name=item.bottom_goods_name;
        var top_shop_id=item.top_shop_id;
        var bottom_shop_id=item.bottom_shop_id;

      var is_in_activity=0;    
      var card_is_in_activity=0;
      if(is_in_activity==1){
        card_is_in_activity=1;
      }
      var imgUrl = img_url;

      var shop_id=0;
      var goods_id=0;
      if(top_shop_id>0){
        shop_id=top_shop_id;
        goods_id=top_goods_id;
      }else if(bottom_shop_id>0){
        shop_id=bottom_shop_id;
        goods_id=bottom_goods_id
      }
      //app.globalData.customerInf.id
      var page_url='/pages/mall/pages/outfitresult/outfitresult?bind_type=3&associate_type=2&' + 
      'shop_id=' + shop_id + '&associate_id=' + this.data.associate_id +
      '&goods_id=' + goods_id+'&card_is_in_activity='+card_is_in_activity+'&img_url='+imgUrl;

      console.log(page_url);
      wx.navigateTo({
        url: page_url,
      })
    }
   
   
   
})