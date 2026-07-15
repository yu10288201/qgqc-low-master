// pages/mall/pages/outfitpreview/outfitpreview.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        img_url:'',
        ding_select_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ding_select.png',
        ding_not_select_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ding_not_select.png',
        buyDialogShow:false,
        top_goods_name:'',//上衣
        bottom_goods_name:'',//下衣
        select_buy:0,
        top_goods_id:0,
        top_shop_id:0,
        bottom_shop_id:0,
        bottom_goods_id:0,
 

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
          var img_url=options.img_url;
          var top_goods_id=Number(options.top_goods_id);
          var bottom_goods_id=Number(options.bottom_goods_id);
          var top_goods_name=options.top_goods_name;
          var bottom_goods_name=options.bottom_goods_name;

          var top_shop_id=Number(options.top_shop_id)
          var bottom_shop_id=Number(options.bottom_shop_id);
        

          this.setData({
            img_url:img_url,
            top_goods_id:top_goods_id,
            bottom_goods_id:bottom_goods_id,
            top_goods_name:top_goods_name,
            bottom_goods_name:bottom_goods_name,
            top_shop_id:top_shop_id,
            bottom_shop_id:bottom_shop_id,
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

        var that = this;

        var is_in_activity=0;    
        var title = 'AI试衣，你也来试试吧！' ;
        var card_is_in_activity=0;
        if(is_in_activity==1){
         
          card_is_in_activity=1;
        }
        var imgUrl = that.data.img_url;

        var shop_id=0;
        var goods_id=0;
        if(this.data.top_shop_id>0){

          shop_id=this.data.top_shop_id;
          goods_id=this.data.top_goods_id;
          
        }else if(this.data.bottom_shop_id>0){
          
          shop_id=this.data.bottom_shop_id;
          goods_id=this.data.bottom_goods_id;
          
        }
       
        console.log('title:'+title)
        let shareObj = {
            title: title,
            path: 'pages/mall/pages/outfitresult/outfitresult?bind_type=3&associate_type=2&' + 
            'shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +
            '&goods_id=' + goods_id+'&card_is_in_activity='+card_is_in_activity+'&img_url='+imgUrl,
            imageUrl: imgUrl,
            success: function (res) {
                if (res.errMsg == 'shareAppMessage:ok') {
                    that.hide();
                }
                wx.showToast({
                  title: '发送成功！',
                })
            },
            fail: function (res) {
                if (res.errMsg == 'shareAppMessage:fail cancel') {
                    that.hide();
                } else if (res.errMsg == 'shareAppMessage:fail') {
                    that.hide();
                }
            },
        };              
        
        return shareObj;


    },
    buyDialogShowChange(){
      this.setData({
        buyDialogShow:false,
      })

    },
   
    selectBuyConfirm(){
        var select_buy=this.data.select_buy;
        var top_goods_id=this.data.top_goods_id;
        var bottom_goods_id=this.data.bottom_goods_id;
        if(select_buy==1){
      
            wx.navigateTo({
              url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id='+top_goods_id,
            })
          
        }else if(select_buy==2){
          wx.navigateTo({
            url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id='+bottom_goods_id,
          })
        }else{
          wx.showToast({
            title: '请选择',
            icon:'none'
          })
        }
    },
    toMerchandise_details(e){
      var top_goods_id=this.data.top_goods_id;
      var bottom_goods_id=this.data.bottom_goods_id;

      console.log(top_goods_id)
      console.log(bottom_goods_id)

      if(top_goods_id>0&&bottom_goods_id>0){
        this.setData({
          select_buy:1,
          buyDialogShow:true,
        })
      }else{
        var goods_id=0;
        if(top_goods_id>0){
          goods_id=top_goods_id;
        }
        if(bottom_goods_id>0){
          goods_id=bottom_goods_id;
        }

        if(goods_id>0){
          wx.navigateTo({
            url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id='+goods_id,
          })
        }
       
      }



    }, 
    selectBuy(e){
        var select_buy=Number(e.currentTarget.dataset.select_buy);
        console.log(select_buy);

        this.setData({
          select_buy:select_buy,
        })
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

})