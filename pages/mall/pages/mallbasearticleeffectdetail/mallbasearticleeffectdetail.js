const app = getApp()

Page({
  //初始数据
	data: {
    //0-明细 1-查询总数
    main_item:{},
    current_item:null,
    listIndex:-1,
		items: [],
  },
	// 监听触底事件
	onPageScroll: function (e) {
		
  },
  //监听页面加载
  onLoad: function (options) {
  if(options.main_item){
    var encode_str=options.main_item;
    var decode_str=decodeURIComponent(encode_str);
    var main_item=JSON.parse(decode_str);
    this.setData({
      main_item:main_item,
    })
    this.selectData();	
  }
  	
  },
  /**
   * 监听页面隐藏
   */
  onHide: function () {

  },


  /**
   * 监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 监听用户下拉动作
   */
  onPullDownRefresh: function () {	  

  },

  /**
   * 上拉触底事件
   */
  onReachBottom: function () {
	  this.loadNextPage();
  },

  /**
   * 点击右上角分享
   */
  onShareAppMessage: function () {

  },
  selectData(){
    this.setData({
      listIndex:-1,
      items:[],
    })
    this.selectPageData();
  },
 	selectPageData(){
    let that = this;
    var query_wx_pyq_type=this.data.main_item.query_wx_pyq_type;
		wx.request({
		  url: app.globalData.selectMallBaseArticleEffectDetailByMainId,
			method: 'POST',
			data: {
        article_effect_main_id:this.data.main_item.id,
        wx_pyq_type:query_wx_pyq_type
			},
			success(res){
				if(res.data.code == 1000){
          var newitems = res.data.data;

					that.setData({
            items: newitems,
          })
          if(newitems.length>0){
            that.setData({
              listIndex: 0,
              current_item:items[0],
            })

          }
        }				
			},
			fail(res){
				app.showFailMessage(3,res)				
      },
      complete(res){
        that.setData({
					isLoading: false
				});
      }
    })
  },
  itemClick(e) {
    var that = this;
    let i = e.currentTarget.dataset.index
    var current_item=that.data.items[i];
    that.setData({
      listIndex: i, //获取
      current_item:current_item,
    })
  },
  scrollToLower(e){
      //拉取到底部了
      console.log("拉取到底部了")
      console.log(e);
  },
})