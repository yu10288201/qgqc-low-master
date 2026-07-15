// pages/order/order.js
//获取应用实例
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    from_page:'',
    customer_address_list: [],    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    if(options.from_page){
      this.setData({
        from_page:options.from_page,
      })
    }
  },
  freshshoppingbillCustomerAddress(e){
    var item=e.target.dataset.item;
    let pages = getCurrentPages();    
    let prevPage = pages[pages.length - 2]; 

    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
        mobile: item.mobile,
        name: item.name,
		    detail_address: item.detail_address,
		    customer_address_id: item.id,
    })

    wx.navigateBack({
      delta: 1  // 返回上一级页面。
      })
  },
  scancodedeductionCustomerAddress(e){
    var item=e.target.dataset.item;
    let pages = getCurrentPages();    
    let prevPage = pages[pages.length - 2]; 

    //prevPage 是获取上一个页面的js里面的pages的所有信息。 -2 是上一个页面，-3是上上个页面以此类推。
    
    prevPage.setData({  // 将我们想要传递的参数在这里直接setData。上个页面就会执行这里的操作。
        mobile: item.mobile,
        name: item.name,
		    detail_address: item.detail_address,
		    customer_address_id: item.id,
    })

    prevPage.updateMallMemberRechargeRecordBuyerAddressId();

    wx.navigateBack({
      delta: 1  // 返回上一级页面。
      })
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
    this.getData();
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

  getData:function(){
    var that=this;
   
     wx.request({
       url: app.globalData.allUrl.selectMallBaseBuyerAddress,
       method: 'GET',
       data: {
		buyer_id: app.globalData.customerInf.id,
	   },
       header: {
         'content-type': 'application/json'
       },
       success: function (res) {
        
         if(res.data.code==1){
            //要把默认地址放到第一个
            const sortedArray = res.data.data.sort((a, b) => b.is_default - a.is_default);
            that.setData({
              customer_address_list: sortedArray,
           })      
           
         }else{
           wx.showToast({
             title:''+res.data.result,
             icon:'error',
           });
         }
        
       }
     });
  },
  deleteCustomerAddress:function(e){
      var item=e.target.dataset.item;
      var that=this;
      wx.request({
        url: app.globalData.allUrl.deleteMallBaseBuyerAddress,
        method: 'POST',
        data: item
        ,
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {     
        
          if(res.data.code==1){
            wx.showToast({
              title: '删除成功',
          })
          that.getData();
          return;
          }else{
            wx.showToast({
              title:''+res.data.result,
              icon:'error',
            });
            return;
          }
         
        }
      });

  },
  updateCustomerAddress:function(e){
    var item = e.target.dataset.item;  
    
    wx.navigateTo({
      url: '../customeraddress/customeraddress?is_add=0&item='+JSON.stringify(item)+'&from_page='+this.data.from_page,
    })
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

  go_to_add:function(){
   
    wx.navigateTo({
      url: '../customeraddress/customeraddress?is_add=1'+'&from_page='+this.data.from_page,
    })
  },
})