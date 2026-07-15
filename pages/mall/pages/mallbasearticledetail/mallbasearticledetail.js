const app = getApp()

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
    article_detail_array:[],
	},
 
	// 监听用户触底事件，加载下一页数据
	onPageScroll: function (e) {
		
	},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    console.log("detail onLoad")
    console.log(options)
    var that=this
    if(options.article_main_item){
      var encodeMainStr=options.article_main_item;
      var decodeMainStr=decodeURIComponent(encodeMainStr);
      var article_main_item = JSON.parse(decodeMainStr);

      var article_detail_array=article_main_item.lstDetail;

      this.setData({
        article_detail_array:article_detail_array,
      })
    }
    
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
  onShareAppMessage: function () {

  },
  getIntValue(value){
    var defValue=0;
    try{
      var rValue=parseInt(value);
      if(rValue){
        return rValue;
      }else{
        return defValue;
      }
    }catch(e){
      return defValue;
    }
  },
  getFloatValue(value){
    var defValue=0;
    try{
      var rValue=parseFloat(value);
      if(rValue){
        var strValue=rValue.toString();
        if(strValue.indexOf(".")>=0){
          var tmpStr=strValue.split('.')[1];
          if(tmpStr.length>2){
            return rValue.toFixed(2);
          }
        }
        return rValue;
      }else{
        return defValue;
      }
    }catch(e){
      return defValue;
    }
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
})