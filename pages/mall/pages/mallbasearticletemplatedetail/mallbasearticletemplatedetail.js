const app = getApp()
const QRCode = require("../../../../utils/weapp-qrcode.js")

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
    is_inited:false,
    showPoster:false,
    poster_bg_img_url:'',
    poster_url:'',
    temporaryVideo:'',
    loadImagePath2: '',
    loadImagePath: '',
    currentPoster: '',
    shareImageTitle: '测试图片标题',
    shareImageDetail: [],

    product_name:'',
    customer_preferential_price:0,
    recharge_member_price:0,
    vip_member_price:0,
    platform_cash_commission:0,

    b_share_dlg_show:false,
    b_share_ding_show:true,
    b_article_main_show:false,
    b_ding_main_show:false,
    b_article_template_main_show:false,
    b_sort_dlg_show:false,
    is_updated:0,
    dlg_sort_id:1,
    scoll_top:0,
    mall_base_goods_multimedia_array:[
    ],
    mall_base_goods_nine_array_selected:0,
    mall_base_goods_nine_array:[],
    current_goods_multimedia_id:-1,
    current_goods_multimedia_item:{},
    article_template_main_item:{
      id:0,
      article_main_id:0,
      goods_id:0,
      shop_id:0,
      article_type:0,
      name:'',
      key_word:'',
      share_img_url:'',
      cut_introduction:'',
    },
    article_template_main_id:0,
    detail_item:{},

    article_template_detail_array:[],
    article_template_detail_array_count:0,

    article_main_array:[],
    article_main_item:{},
    article_main_item_confirm:{},
    article_detail_array:[],

    s_article_template_main_array:[],
    s_article_template_main_array_count:0,
    s_article_template_main_item:{},
    s_article_template_main_item_confirm:{},


    id:-1,

    article_main_page_index: 1,
    article_main_page_size: 20,
    article_type:0,
    s_key_word:'',
    ding_key_word:'',

    s_article_template_main_page_index: 1,
    s_article_template_main_page_size: 20,
    s_template_key_word:'',
    s_article_type:0,

    mediaIsLoading:false,
    triggered:false,
    scrollTop:0,
    listIndexArticleMain:-1,
    listIndexArticleTemplateMain:-1,
    pageId: 'page_0',
    main_uid:'',
    dingYouList:[],
    ding_select_count:0,
    ding_select_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ding_select.png',
    ding_not_select_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ding_not_select.png',
	},
 
	// 监听用户触底事件，加载下一页数据
	onPageScroll: function (e) {
		
	},
  selectMallBaseArticleMainData(e){
    //查询素材文章
          var article_type=e.currentTarget.dataset.article_type;
          article_type=article_type?article_type:0;
          this.setData({
            article_main_page_index:1,
            article_main_page_size:20,
            article_main_array:[],
            listIndexArticleMain:-1,
            article_main_item:{},
            article_type:article_type,
          })
          this.selectMallBaseArticlePageData();
    },
    selectMallBaseArticlePageData(){
      //分页查询素材文章
        let that = this
        if(this.data.mediaIsLoading){
          return;
        }
        wx.request({
            url: app.globalData.selectMallBaseArticleMainByKeyWord,        
            method: 'POST',
            data: {                
                key_word:that.data.s_key_word, 
                article_type:that.data.article_type,           
                page_size: that.data.article_main_page_size,  //hardcode成每次拿16个
                page_index: that.data.article_main_page_index   //一开始每次只搞头16个           
            },
            header: {
                'content-type': 'application/json'
            },
            success: function (res) {
                that.setData({
                  mediaIsLoading:false,
                })
                if(res.data.code == 1000){
                  const article_main_array = res.data.data;
                  if(article_main_array.length>0){
                    wx.showToast({
                      title: '获取到'+article_main_array.length+'条数据',
                      icon:'none'
                    })
                  }else{
                    wx.showToast({
                      title: '无新数据',
                      icon:'none'
                    })
                  }
                  that.setData({
                    article_main_array: that.data.article_main_array.concat(article_main_array),
                    article_main_page_index:that.data.article_main_page_index+1,
                  })
                }                                
            },
            fail(res){
              that.setData({
                mediaIsLoading:false,
              })
              wx.showToast({
                title: '获取素材失败:'+res.data.msg,
                icon:'error',
                duration: 2000,
              }) 
            }
          })

    },



    selectMallBaseArticleTemplateMainData(e){

      var s_article_type=e.currentTarget.dataset.article_type;
      s_article_type=s_article_type?s_article_type:0;

      //查询已完成模板
      this.setData({
        s_article_template_main_page_index:1,
        s_article_template_main_page_size:20,
        s_article_template_main_array:[],
        listIndexArticleTemplateMain:-1,
        s_article_type:s_article_type,
        s_article_template_main_item:{},
      })
      this.selectMallBaseArticleTemplatePageData();
    },
    selectMallBaseArticleTemplatePageData(){
      //分页查询已完成模板
          let that = this
          if(this.data.mediaIsLoading){
            return;
          }
          var article_template_main_item=that.data.article_template_main_item;

          wx.request({
              url: app.globalData.selectMallBaseArticleTemplateMainByKeyWord,        
              method: 'POST',
              data: {         
                  goods_id:article_template_main_item.goods_id,       
                  key_word:that.data.s_template_key_word,
                  article_type:that.data.s_article_type,            
                  page_size: that.data.s_article_template_main_page_size,  //hardcode成每次拿16个
                  page_index: that.data.s_article_template_main_page_index   //一开始每次只搞头16个           
              },
              header: {
                  'content-type': 'application/json'
              },
              success: function (res) {
                  that.setData({
                    mediaIsLoading:false,
                  })
                  if(res.data.code == 1000){
                    const s_article_template_main_array = res.data.data;
                    
                  
                    if(s_article_template_main_array.length>0){
                      //判断是否已有
                      var s_article_template_main_array_count=that.data.s_article_template_main_array_count;
                      if(s_article_template_main_array_count==0){
                        s_article_template_main_array_count=s_article_template_main_array.length;
                        that.setData({s_article_template_main_array_count:s_article_template_main_array_count});
                        if(that.data.is_inited==false){
                          that.setData({
                            b_article_template_main_show:true,
                          })
                        }
                      }

                      wx.showToast({
                        title: '获取到'+s_article_template_main_array.length+'条数据',
                        icon:'none'
                      })

                    }else{
                      wx.showToast({
                        title: '无新数据',
                        icon:'none'
                      })
                    }
                    that.setData({
                      s_article_template_main_array: that.data.s_article_template_main_array.concat(s_article_template_main_array),
                      s_article_template_main_page_index:that.data.s_article_template_main_page_index+1,
                    })
                  }                                
              },
              fail(res){
                that.setData({
                  mediaIsLoading:false,
                })
                wx.showToast({
                  title: '获取素材失败:'+res.data.msg,
                  icon:'error',
                  duration: 2000,
                }) 
              }
            })
    },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {    
    console.log("detail onLoad")
    console.log(options)

    wx.showShareMenu({
      withShareTicket:true,
      menus:['shareAppMessage','shareTimeline']
      })

    var that=this
    var article_template_main_item=this.data.article_template_main_item;
    if(options.bind_type){
      wx.showToast({
        title: '获取到绑定类型',
        icon:'none',
      })
    }

    if(options.goods_id){

     var goods_id=Number(options.goods_id);
     var shop_id=Number(options.shop_id);

     article_template_main_item.goods_id=goods_id;
     article_template_main_item.shop_id=shop_id;
     article_template_main_item.cut_introduction=options.cut_introduction;

     this.setData({
      article_template_main_item:article_template_main_item,
      product_name:options.product_name,
      customer_preferential_price:Number(options.customer_preferential_price),
      recharge_member_price:Number(options.recharge_member_price),
      vip_member_price:Number(options.vip_member_price),
      platform_cash_commission:Number(options.platform_cash_commission),
     })

    }
    this.selectMallBaseGoodsMultiMediaByGoodsId();
    this.selectMallBaseGoodsNineByGoodsId();
    this.initSearchData();
  },
  initSearchData(){
    var e={
      currentTarget:{
        dataset:{
          article_type:0
        }
      }
  };
    this.selectMallBaseArticleMainData(e);
    this.selectMallBaseArticleTemplateMainData(e);
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
  // onShareAppMessage: function () {

  // },
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
  beforeAddShow(e){
    var item=e.currentTarget.dataset.item;
    var insert_type='before';
    if(this.data.id==item.id&&this.data.insert_type==insert_type){
      this.setData({
        id:0,
        insert_type:'last',
        detail_item:{},
      })
    }else{
      this.setData({
        id:item.id,
        insert_type:insert_type,
        detail_item:item,
      })
    }
    

  },
  afterAddShow(e){
    var item=e.currentTarget.dataset.item;
    var insert_type='after';
    if(this.data.id==item.id&&this.data.insert_type==insert_type){
      this.setData({
        id:0,
        insert_type:'last',
        detail_item:{},
      })
    }else{
      this.setData({
        id:item.id,
        insert_type:insert_type,
        detail_item:item,
      })
    }
    
  },
  // 下拉刷新
  onRefresh() {
  //   var self = this;
  //   console.log("onRefresh");
  //   self.setData({
  //     triggered: true, // 将triggered属性设置为true，表示下拉刷新已经被触发
  //   })
  //    this.selectData();

  //    setTimeout(function () {
  //     //  需要执行的代码
  //     console.log('定时器执行了')
  // }, 2000); // 2000为毫秒级参数，表示2秒
     
  //    wx.setTimeout(() => {
  //      console.log("setTimeout")
  //     self.setData({
  //       scrollTop:0,
  //       triggered: false, // 将triggered属性设置为true，表示下拉刷新已经被触发
  //     })
  //   }, 3000)
  },
  loadMore(){
    var self = this;
    this.selectMallBaseArticlePageData();
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
mainItemClick(e){
  var main_item=e.currentTarget.dataset.item;
  var article_detail_array=main_item.lstDetail;

  var article_template_main_item=this.data.article_template_main_item;
  article_template_main_item.article_main_id=main_item.id;
  article_template_main_item.name=main_item.name;
  article_template_main_item.key_word=main_item.key_word;

  console.log(article_template_main_item);

  this.setData({
    article_detail_array:article_detail_array,
    article_template_main_item:article_template_main_item,
    b_article_main_show:false,
  })

},
deleteMallBaseArticleTemplateMainAndRemoveSearch(e){
  var that = this;

  var index=this.data.listIndexArticleTemplateMain;
  var s_article_template_main_array=that.data.s_article_template_main_array;
  var s_article_template_main_item=that.data.s_article_template_main_array[index];


    if(index==-1){
      wx.showToast({
        title: '请先选择模板',
        icon:'none',
      })
      return;
    }

  
  var data={
    id:s_article_template_main_item.id,
    is_delete:1,
  }

  wx.request({
    url: app.globalData.deleteMallBaseArticleTemplateMain,
    method:"POST",
    header:{
        'content-type':'application/json'
    },
    data:data,
    success:res=>{
      wx.hideLoading();
        console.log(res);
        if(res&&res.data.code==1000){
          s_article_template_main_array.splice(index,1);
          that.setData({
            listIndexArticleTemplateMain: -1, //获取
            s_article_template_main_item:null,
            s_article_template_main_array:s_article_template_main_array,
          })
          wx.showToast({
            title: '删除成功',
          })
        }else{
          wx.showToast({
            title: ''+res.data.msg,
            icon: 'error',
          })
        }
    },
    fail:err=>{
      wx.hideLoading();
        wx.showToast({
          title: '网络异常',
          icon:'error',
        })
    },
  })

},
insertOrUpdateMallBaseArticleTemplateMain(e){

  var that=this;

  var article_template_main_item=this.data.article_template_main_item;
  var article_template_detail_array=this.data.article_template_detail_array;
  var item_count=0;
  var goods_img_count=0;
  for(var i=0;i<article_template_detail_array.length;i++){
      if(article_template_detail_array[i].is_delete==0){
        item_count=item_count+1;
        if(article_template_detail_array[i].source_type==2){
          goods_img_count=goods_img_count+1;
        }
      }
  }
  if(item_count==0){
    wx.showToast({
      title: '明细项为空',
      icon:'error',
    })
    return;
  }
  if(goods_img_count==0)
  {
    wx.showToast({
      title: '广告图片为空',
      icon:'error',
    })
    return;
  }

  article_template_main_item.lstDetail=article_template_detail_array;
  var data=article_template_main_item;
  console.log(data);
  var that=this;
    wx.showLoading({
      title: '保存中',
    })
    wx.request({
      url: app.globalData.insertOrUpdateMallBaseArticleTemplateMain,
      method:"POST",
      header:{
          'content-type':'application/json'
      },
      data:data,
      success:res=>{
        wx.hideLoading();
          console.log(res);
          if(res&&res.data&&res.data.code==1000){

            var res_data=res.data.data;
            var article_template_main_item=that.data.article_template_main_item;
         
            article_template_main_item.id=res_data.id;
            var article_template_detail_array=res_data.lstDetail;

            //更新本地数据
            that.setData({
              article_template_main_item:article_template_main_item,
              article_template_detail_array:article_template_detail_array,
              is_updated:0,
            })

            wx.showToast({
              title: '保存成功',
            })
          }else{
            wx.showToast({
              title: ''+res.data.msg,
              icon: 'error',
            })
          }
      },
      fail:err=>{
        wx.hideLoading();
          wx.showToast({
            title: '网络异常',
            icon:'error',
          })
      },
    })
},
deleteMallBaseArticleTemplateMainClick(){
  var that=this;
  var article_template_main_item=this.data.article_template_main_item;
  var id=article_template_main_item.id;
  if(id<=0){
    this.initData();
    return;
  }
  wx.showModal({
    title: '删除模板',
    content: '是否确认删除？',
    success(res) {
     if (res.confirm) {
      that.deleteMallBaseArticleTemplateMainAndInit();
     } 
    }
  });
},
deleteMallBaseArticleTemplateMainAndInit(){
    var that=this;
    var article_template_main_item=this.data.article_template_main_item;
    var id=article_template_main_item.id;
    if(id<=0){
      this.initData();
      return;
    }
 
    var data={
      id:id,
      is_delete:1,
    }

    var that=this;
      wx.showLoading({
        title: '删除中',
      })
      wx.request({
        url: app.globalData.deleteMallBaseArticleTemplateMain,
        method:"POST",
        header:{
            'content-type':'application/json'
        },
        data:data,
        success:res=>{
          wx.hideLoading();
            console.log(res);
            if(res&&res.data&&res.data.code==1000){

                that.initData();
            }else{
              wx.showToast({
                title: ''+res.data.msg,
                icon: 'error',
              })
            }
        },
        fail:err=>{
          wx.hideLoading();
            wx.showToast({
              title: '网络异常',
              icon:'error',
            })
        },
      })
},

showOrHideBArticleMainShow(e){
    console.log(e);
    var b_article_main_show=e.currentTarget.dataset.show;
    console.log(b_article_main_show);
    if(b_article_main_show==true){
      this.setData({
        b_article_template_main_show:false,
      })
    }
    this.setData({
      b_article_main_show:b_article_main_show,
    })

  },
  showOrHideBArticleTemplateMainShow(e){
    console.log(e);
    this.setData({
      is_inited:true,
    })

    var b_article_template_main_show=e.currentTarget.dataset.show;
    console.log(b_article_template_main_show);
    this.setData({
      b_article_template_main_show:b_article_template_main_show,
    })
  },
  scrollToLowerArticleMain(e){
    this.selectMallBaseArticlePageData();
  },
  scrollToLowerArticleTemplateMain(e){
    this.selectMallBaseArticleTemplatePageData();
  },
  itemClickArticleMain(e) {
    var that = this;
    let i = e.currentTarget.dataset.index
    var article_main_item=that.data.article_main_array[i];
    that.setData({
      listIndexArticleMain: i, //获取
      article_main_item:article_main_item,
    })
  },
  itemClickArticleTemplateMain(e) {
    var that = this;
    let i = e.currentTarget.dataset.index
    var s_article_template_main_item=that.data.s_article_template_main_array[i];
    that.setData({
      listIndexArticleTemplateMain: i, //获取
      s_article_template_main_item:s_article_template_main_item,
    })
  },
  clearSKeyWord(e){
    this.setData({
      s_key_word:'',
    })
  },
  clearDingKeyWord(e){
    this.setData({
      ding_key_word:'',
    })
  },
  clearSTemplateKeyWord(e){
    this.setData({
      s_template_key_word:'',
    })
  },
  
  previewArticleDetail(e){
      if(this.data.listIndexArticleMain>=0){
        if(this.data.article_main_item){
          if(this.data.article_main_item.lstDetail.length==0){
                wx.showToast({
                  title: '素材无内容',
                  icon:'error'
                })
          }else{
            var encodeStr=encodeURIComponent(JSON.stringify(this.data.article_main_item));
            var url='/pages/mall/pages/mallbasearticledetail/mallbasearticledetail';
            url+="?article_main_item="+encodeStr;
            wx.navigateTo({
              url: url,
            })
          }
          
        }
      }
  },
  toArticleTemplateDetailDescription(e){
    var url='/pages/mall/pages/mallbasearticletemplatedetaildescription/mallbasearticletemplatedetaildescription';
    wx.navigateTo({
      url: url,
    })
  },
  resultArticleTemplateDetail(e){

    var article_template_detail_array=this.data.article_template_detail_array;
    article_template_detail_array=article_template_detail_array.filter(item=>{
      return item.is_delete==0
    });
    if(article_template_detail_array.length==0){
      wx.showToast({
        title: '无可预览的明细项',
        icon:'none'
      })
      return;
    }

    var article_template_main_item=this.data.article_template_main_item;
    var goods_id=article_template_main_item.goods_id;
    var shop_id=article_template_main_item.shop_id;
    var article_template_main_id=article_template_main_item.id;
    var main_uid=this.data.main_uid;
    
     if(article_template_main_item.id<=0){

      wx.showToast({
        title: '请保存后预览',
        icon:'none',
      })
    }else{
      var url='/pages/mall/pages/mallbasearticletemplatedetailresult/mallbasearticletemplatedetailresult';
          url+="?bind_type=3&associate_type=2"+ '&shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +'&goods_id=' + goods_id+'&article_template_main_id='+article_template_main_id;
          url+="&detail_type=result";
          url+="&main_uid="+main_uid;
          wx.navigateTo({
            url: url,
          })
    }

    // var encodeStr=encodeURIComponent(JSON.stringify(article_template_detail_array));
    // var encodeStr1=encodeURIComponent(JSON.stringify(article_template_main_item));

    //       var url='/pages/mall/pages/mallbasearticletemplatedetailpreview/mallbasearticletemplatedetailpreview';
    //       url+="?article_template_detail_array="+encodeStr+"&article_template_main_item="+encodeStr1;

    //       wx.navigateTo({
    //         url: url,
    //       })
  },
  previewArticleTemplateDetail(e){
    var article_template_detail_array=this.data.article_template_detail_array;
    article_template_detail_array=article_template_detail_array.filter(item=>{
      return item.is_delete==0
    });
    if(article_template_detail_array.length==0){
      wx.showToast({
        title: '无可预览的明细项',
        icon:'none'
      })
      return;
    }

    var article_template_main_item=this.data.article_template_main_item;
    var goods_id=article_template_main_item.goods_id;
    var shop_id=article_template_main_item.shop_id;
    var article_template_main_id=article_template_main_item.id;
    
     if(article_template_main_item.id<=0){

      wx.showToast({
        title: '请保存后预览',
        icon:'none',
      })
    }else{
      var url='/pages/mall/pages/mallbasearticletemplatedetailresult/mallbasearticletemplatedetailresult';
          url+="?bind_type=3&associate_type=2"+ '&shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +'&goods_id=' + goods_id+'&article_template_main_id='+article_template_main_id;
          url+="&detail_type=preview";
          wx.navigateTo({
            url: url,
          })
    }
  },
  previewArticleTemplateResult(e){
          var url='/pages/mall/pages/mallbasearticletemplatedetailresult/mallbasearticletemplatedetailresult';
         
          wx.navigateTo({
            url: url,
          })
  },
  confirmArticleMain(e){
    if(this.data.listIndexArticleMain>=0){
      if(this.data.article_main_item){

        if(this.data.article_main_item.lstDetail.length==0){
          wx.showToast({
            title: '素材内容为空',
            icon:'none'
          })
          return;
        }
          //设置选择的素材文章
          var article_main_item=this.data.article_main_item;
          var article_template_main_item=this.data.article_template_main_item;

          //清除模板内容 
          if(this.data.article_template_main_item.article_main_id!=this.data.article_main_item.id){

            var article_template_main_item=this.data.article_template_main_item;

            article_template_main_item.article_main_id=this.data.article_main_item.id;

            article_template_main_item.share_img_url=article_main_item.main_img_url;

            article_template_main_item.article_type=article_main_item.article_type;
            

            var article_template_detail_array=[];

            if(this.data.article_template_main_item.id>0){
              var old_article_template_detail_array=this.data.article_template_detail_array;
              for(var i=0;i<old_article_template_detail_array.length;i++){
                if(old_article_template_detail_array[i].id>0){
                  old_article_template_detail_array[i].is_delete=1;
                  article_template_detail_array.push(old_article_template_detail_array[i]);
                }
              }
            }

            for(var i=0;i<article_main_item.lstDetail.length;i++){
              var item=article_main_item.lstDetail[i];
              var sort_id=i+1;
              var sort_id_str=''+sort_id;
              if(sort_id<10){
                sort_id_str='0'+sort_id;
              }

              var article_template_detail_item={
                id:0,
                article_template_main_id:article_template_main_item.id,
                sort_id:sort_id,
                sort_id_str:sort_id_str,
                item_sort_id:item.sort_id,
                item_sort_id_str:item.sort_id_str,
                item_main_id:item.article_main_id,
                item_detail_id:item.id,
                source_type:1,
                item_type:item.item_type,
                item_content:item.item_content,
                item_description:item.description,
                is_delete:0,
              }
              article_template_detail_array.push(article_template_detail_item);
        
            }

            this.setData({
              article_template_main_item:article_template_main_item,
              article_template_detail_array:article_template_detail_array,
            })
          }
          article_template_main_item.name=article_main_item.name;
          article_template_main_item.key_word=article_main_item.key_word;
          article_template_main_item.article_main_id=article_main_item.id;

          this.setData({
            article_main_item_confirm:this.data.article_main_item,
            article_detail_array:this.data.article_main_item.lstDetail,
            article_template_main_item:article_template_main_item,
            b_article_main_show:false,
            is_updated:1,
          })
          this.setShareImg();
  
      }
    }
  },

  confirmArticleTemplateMain(e){
    if(this.data.listIndexArticleTemplateMain>=0){
      if(this.data.s_article_template_main_item){

          //设置选择的素材文章
          var article_main_item=this.data.s_article_template_main_item.dtoMallBaseArticleMain;
          
          var article_template_main_item=this.data.article_template_main_item;
          article_template_main_item.name=article_main_item.name;
          article_template_main_item.key_word=article_main_item.key_word;
          article_template_main_item.article_main_id=article_main_item.id;
          article_template_main_item.share_img_url=this.data.s_article_template_main_item.share_img_url;
          article_template_main_item.id=this.data.s_article_template_main_item.id;
          article_template_main_item.article_type=this.data.s_article_template_main_item.article_type;

          this.setData({
            s_article_template_main_item_confirm:this.data.s_article_template_main_item,
            article_detail_array:article_main_item.lstDetail,
            article_template_main_item:article_template_main_item,
            article_template_detail_array:this.data.s_article_template_main_item.lstDetail,
            b_article_template_main_show:false,
            article_main_item:article_main_item,
          })
          this.setShareImg();

      }
    }
  },

  addToArticleTemplateDetailFromArticle(e){
      var item=e.currentTarget.dataset.item;

      var article_template_main_item=this.data.article_template_main_item;

      if(item.article_main_id!=article_template_main_item.article_main_id){
        wx.showToast({
          title: '文章内容跟标题不一致',
          icon:'none',
        })
        return;
      }
      var article_template_detail_item={
        id:0,
        article_template_main_id:article_template_main_item.id,
        sort_id:1,
        sort_id_str:'01',
        item_sort_id:item.sort_id,
        item_sort_id_str:item.sort_id_str,
        item_main_id:item.article_main_id,
        item_detail_id:item.id,
        source_type:1,
        item_type:item.item_type,
        item_content:item.item_content,
        item_description:item.description,
        is_delete:0,
      }

      var article_template_detail_array=this.data.article_template_detail_array;
      article_template_detail_array=article_template_detail_array.filter(item=>{
        return item.is_delete==0;
      })
      var dlg_sort_id=article_template_detail_array.length+1;

      this.setData({
        b_sort_dlg_show:true,
        dlg_sort_id:dlg_sort_id,
        article_template_detail_item:article_template_detail_item,
      })
      return;
  },
  goodsImgClick(e){
    var item=e.currentTarget.dataset.item;
    var article_template_main_item=this.data.article_template_main_item;
    if(article_template_main_item.article_main_id<=0){
        wx.showToast({
          title: '请先选择素材文章',
          icon:'none',
        })
        this.setData({
          current_goods_multimedia_id:-1,
          current_goods_multimedia_item:{},
        })
      return;
    }else{
      if(item.id==this.data.current_goods_multimedia_id){
        this.setData({
          current_goods_multimedia_id:-1,
          current_goods_multimedia_item:{},
        })
      }else{
        this.setData({
          current_goods_multimedia_id:item.id,
          mall_base_goods_nine_array_selected:0,
          current_goods_multimedia_item:item,
        })
      }
      

    }
    
  },
  goodsNineClick(e){
    var item=e.currentTarget.dataset.item;
    var article_template_main_item=this.data.article_template_main_item;
    if(article_template_main_item.article_main_id<=0){
        wx.showToast({
          title: '请先选择素材文章',
          icon:'none',
        })
        this.setData({
          mall_base_goods_nine_array_selected:0,
        })
      return;
    }else{
        if(this.data.mall_base_goods_nine_array.length>0){
          this.setData({
            current_goods_multimedia_id:-1,
            mall_base_goods_nine_array_selected:1,
            current_goods_multimedia_item:{},
          })

      }else{
        this.setData({
          mall_base_goods_nine_array_selected:0,
        })
    }
    
    }
    
  },
  addToArticleTemplateDetailFromGoodsImg_BAK(e){
    var item=e.currentTarget.dataset.item;
    var article_template_main_item=this.data.article_template_main_item;
    if(article_template_main_item.article_main_id<=0){
        wx.showToast({
          title: '请先选择素材文章',
          icon:'none',
        })
      return;
    }

    var article_template_detail_item={
      id:0,
      article_template_main_id:article_template_main_item.id,
      sort_id:1,
      sort_id_str:'01',
      item_sort_id:item.sort_id,
      item_sort_id_str:item.sort_id_str,
      item_main_id:0,
      item_detail_id:item.id,
      source_type:2,
      item_type:1,
      item_content:item.url,
      item_description:'',
      is_delete:0,
    }
    var article_template_detail_array=this.data.article_template_detail_array;
      article_template_detail_array=article_template_detail_array.filter(item=>{
        return item.is_delete==0;
      })
      var dlg_sort_id=article_template_detail_array.length+1;

    this.setData({
      b_sort_dlg_show:true,
      dlg_sort_id:dlg_sort_id,
      article_template_detail_item:article_template_detail_item,
    })
    return;
  },
  addToArticleTemplateDetailFromGoodsImg(e){

    if(this.data.mall_base_goods_nine_array_selected==1){
      this.addToArticleTemplateDetailFromGoodsNine(e);
     return;
   }

    if(this.data.current_goods_multimedia_id==-1){
      wx.showToast({
        title: '请先选择广告图片或者9宫格',
        icon:'none'
      })
      return;
    }
    
    var item=this.data.current_goods_multimedia_item;
   
    var article_template_main_item=this.data.article_template_main_item;

    if(article_template_main_item.article_main_id<=0){
        wx.showToast({
          title: '请先选择素材文章',
          icon:'none',
        })
      return;
    }

    
    var article_template_detail_item={
      id:0,
      article_template_main_id:article_template_main_item.id,
      sort_id:1,
      sort_id_str:'01',
      item_sort_id:item.sort_id,
      item_sort_id_str:item.sort_id_str,
      item_main_id:0,
      item_detail_id:item.id,
      source_type:2,
      item_type:1,
      lstNine:[],
      item_content:item.url,
      item_description:'',
      is_delete:0,
    }
    var article_template_detail_array=this.data.article_template_detail_array;
    var index=e.currentTarget.dataset.index;

    console.log(index);
    var tmpArray=[];

    if(index==-1){
      tmpArray=article_template_detail_array;
      tmpArray.push(article_template_detail_item);
    }else{
      for(var i=0;i<article_template_detail_array.length;i++){
        if(i==index){
          tmpArray.push(article_template_detail_item);
          tmpArray.push(article_template_detail_array[i]);
        }else{
          tmpArray.push(article_template_detail_array[i]);
        }
      }
    }
    var new_sort_id=1;
    tmpArray.forEach(item=>{
      item.sort_id=new_sort_id;
      if(new_sort_id>9){
        item.sort_id_str=''+new_sort_id;
      }else{
        item.sort_id_str='0'+new_sort_id;
      }
      new_sort_id=new_sort_id+1;
    })
    
    this.setData({
      article_template_detail_array:tmpArray,
      is_updated:1,
      current_goods_multimedia_id:-1,
      current_goods_multimedia_item:{},
    })
    this.setShareImg();
    return;
  },
  addToArticleTemplateDetailFromGoodsNine(e){
    console.log("addToArticleTemplateDetailFromGoodsNine开始");
    if(this.data.mall_base_goods_nine_array_selected!=1){
      wx.showToast({
        title: '请先选择9宫格',
        icon:'none'
      })
      return;
    }

    var article_template_main_item=this.data.article_template_main_item;

    if(article_template_main_item.article_main_id<=0){
        wx.showToast({
          title: '请先选择素材文章',
          icon:'none',
        })
      return;
    }

    var mall_base_goods_nine_array=this.data.mall_base_goods_nine_array;
    if(mall_base_goods_nine_array.length==0){
      wx.showToast({
        title: '无9宫格图片',
        icon:'none',
      })
      return;
    }

    for(var i=0;i<mall_base_goods_nine_array.length;i++){
      mall_base_goods_nine_array[i].id=0;
    }

    var article_template_detail_item={
      id:0,
      article_template_main_id:article_template_main_item.id,
      sort_id:1,
      sort_id_str:'01',
      item_sort_id:0,
      item_sort_id_str:'0',
      item_main_id:0,
      item_detail_id:0,
      source_type:2,
      item_type:4,
      item_content:'',
      item_description:'',
      lstNine:mall_base_goods_nine_array,
      is_delete:0,
    }
    var article_template_detail_array=this.data.article_template_detail_array;
    var index=e.currentTarget.dataset.index;

    console.log(index);
    var tmpArray=[];

    if(index==-1){
      tmpArray=article_template_detail_array;
      tmpArray.push(article_template_detail_item);
    }else{
      for(var i=0;i<article_template_detail_array.length;i++){
        if(i==index){
          tmpArray.push(article_template_detail_item);
          tmpArray.push(article_template_detail_array[i]);
        }else{
          tmpArray.push(article_template_detail_array[i]);
        }
      }
    }
    var new_sort_id=1;
    tmpArray.forEach(item=>{
      item.sort_id=new_sort_id;
      if(new_sort_id>9){
        item.sort_id_str=''+new_sort_id;
      }else{
        item.sort_id_str='0'+new_sort_id;
      }
      new_sort_id=new_sort_id+1;
    })
    
    this.setData({
      article_template_detail_array:tmpArray,
      is_updated:1,
      current_goods_multimedia_id:-1,
      current_goods_multimedia_item:{},
    })
    this.setShareImg();
    return;
  },
  
  setShareImg(){

      var article_template_main_item=this.data.article_template_main_item;
      var article_main_item=this.data.article_main_item;
      var article_template_detail_array=this.data.article_template_detail_array;

      if(article_template_main_item.article_type==1){
        //文章类型 1-文章 2-图片 3-视频
        if(article_main_item&&article_main_item.main_img_url){
          if(article_main_item.main_img_url.length>12){
            article_template_main_item.share_img_url=article_main_item.main_img_url;
            this.setData({
              article_template_main_item:article_template_main_item,
            })
            return;
          }
        }
      }
      for(var i=0;i<article_template_detail_array.length;i++){
         var item=article_template_detail_array[i];
         if((item.item_type==1||item.item_type==2)&&item.is_delete==0){
          article_template_main_item.share_img_url=item.item_content;
          if(item.item_type==2){
             article_template_main_item.share_img_url+="?x-oss-process=video/snapshot,t_1000,f_jpg,w_0,h_0,m_fast,ar_auto"
          }
          this.setData({
              article_template_main_item:article_template_main_item,
          })
          break;
         }
       }

    
  },
  addToArticleTemplateDetail(e){

    var that=this;
    var article_template_detail_item=this.data.article_template_detail_item;
    var article_template_detail_array=this.data.article_template_detail_array;

    var sort_id=this.getIntValue(this.data.dlg_sort_id);
    if(sort_id<=0){
      sort_id=1;
    }

    var not_delete_array = article_template_detail_array.filter(item => {
        return item.is_delete==0
      })
      var delete_array = article_template_detail_array.filter(item => {
        return item.is_delete==1
      })

      var bOk=true;

      for(var i=0;i<not_delete_array.length;i++){
        var tmpItem=not_delete_array[i];
        if(sort_id>=i+1){
            if(tmpItem.source_type==article_template_detail_item.source_type){
              if(tmpItem.item_sort_id>article_template_detail_item.item_sort_id){
                  bOk=false;
                  break;
              }
          }
        }
      }
      if(bOk==false){
        wx.showToast({
          title: '请选择后面的项目添加',
          icon:'none',
        })
        return;
      }

      var tmp_article_template_detail_array=[];
      var pageId='page_0';
      
      if(not_delete_array.length==0){
        tmp_article_template_detail_array.push(article_template_detail_item);
        pageId='page_0'

      }else{
        if(sort_id>not_delete_array.length){
          pageId='page_'+not_delete_array.length;
          tmp_article_template_detail_array=tmp_article_template_detail_array.concat(not_delete_array);
          tmp_article_template_detail_array.push(article_template_detail_item);
        }else{
          for(var i=0;i<not_delete_array.length;i++){
            var tmpItem=not_delete_array[i];
              if(i+1==sort_id){
                pageId='page_'+i;
                tmp_article_template_detail_array.push(article_template_detail_item);
              }
              tmp_article_template_detail_array.push(tmpItem)
          }
        }
      }

      tmp_article_template_detail_array=tmp_article_template_detail_array.concat(delete_array);
      var new_sort_id=1;
      tmp_article_template_detail_array.forEach(item=>{
        item.sort_id=new_sort_id;
        if(new_sort_id>9){
          item.sort_id_str=''+new_sort_id;
        }else{
          item.sort_id_str='0'+new_sort_id;
        }
        new_sort_id=new_sort_id+1;
      })
      this.setData({
        article_template_detail_array:tmp_article_template_detail_array,
        b_sort_dlg_show:false,
        is_updated:1,
      })
      setTimeout(function () {
        //  需要执行的代码
        console.log('定时器执行了'+pageId)
        that.setData({
          pageId: pageId,
        })
    }, 500); // 2000为毫秒级参数，表示2秒

 

  },
  hideSortDlgShow(e){
    this.setData({
      b_sort_dlg_show:false,
    })
  },
  deleteArticleTemplateDetailItem(e){
    //删除模板明细项
    var item=e.currentTarget.dataset.item;
    var index=e.currentTarget.dataset.index;

    var article_template_detail_array=this.data.article_template_detail_array;
    if(item.id>0){
      article_template_detail_array[index].is_delete=1;
    }else{
      article_template_detail_array.splice(index,1);
    }

    var new_sort_id=1;
    article_template_detail_array.forEach(item=>{
      item.sort_id=new_sort_id;
      if(new_sort_id>9){
        item.sort_id_str=''+new_sort_id;
      }else{
        item.sort_id_str='0'+new_sort_id;
      }
      new_sort_id=new_sort_id+1;
    })

    console.log(article_template_detail_array);
    this.setData({
      article_template_detail_array:article_template_detail_array,
      is_updated:1,
    })
  },
 
  selectMallBaseGoodsMultiMediaByGoodsId(){
    //查询商品图片
    let that = this
    var article_template_main_item=this.data.article_template_main_item;
    if(article_template_main_item.goods_id<=0){return;}
  
    wx.request({
        url: app.globalData.selectMallBaseGoodsMultiMediaByGoodsId,        
        method: 'POST',
        data: {                
          goods_id:article_template_main_item.goods_id,       
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
        
            if(res.data.code == 1000){
              const mall_base_goods_multimedia_array = res.data.data;
              that.setData({
                mall_base_goods_multimedia_array:mall_base_goods_multimedia_array,
              })
            }                                
        },
        fail(res){
          that.setData({
            mediaIsLoading:false,
          })
          wx.showToast({
            title: '获取素材失败:'+res.data.msg,
            icon:'error',
            duration: 2000,
          }) 
        }
      })
  },
  selectMallBaseGoodsNineByGoodsId(){
    //查询商品图片
    let that = this
    var article_template_main_item=this.data.article_template_main_item;
    if(article_template_main_item.goods_id<=0){return;}
  
    wx.request({
        url: app.globalData.selectMallBaseGoodsNineByGoodsId,        
        method: 'POST',
        data: {                
          goods_id:article_template_main_item.goods_id,       
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
        
            if(res.data.code == 1000){
              const mall_base_goods_nine_array = res.data.data;
              that.setData({
                mall_base_goods_nine_array:mall_base_goods_nine_array,
              })
            }                                
        },
        fail(res){
          that.setData({
            mediaIsLoading:false,
          })
          wx.showToast({
            title: '获取素材失败:'+res.data.msg,
            icon:'error',
            duration: 2000,
          }) 
        }
      })
  },
  onShareTimeline: function () {

    var that = this;   
          var article_template_main_item=this.data.article_template_main_item;
          var title = '' + article_template_main_item.name;
          var imgUrl = article_template_main_item.share_img_url;
          var goods_id=article_template_main_item.goods_id;
          var shop_id=article_template_main_item.shop_id;
          var article_template_main_id=article_template_main_item.id;

    return {
      title: '我是测试标题，你可以随便修改',
      path: 'bind_type=3&associate_type=2&' + 
      'shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +
      '&goods_id=' + goods_id+'&article_template_main_id='+article_template_main_id,
      imageUrl: imgUrl
    }
  },
  onShareAppMessage: function (e) {
    //   console.log('onShareAppMessage');
          var that = this;   
          var article_template_main_item=this.data.article_template_main_item;
          var title = '' + article_template_main_item.name;
          var imgUrl = article_template_main_item.share_img_url;
          var goods_id=article_template_main_item.goods_id;
          var shop_id=article_template_main_item.shop_id;
          var article_template_main_id=article_template_main_item.id;
          var main_uid=this.data.main_uid;

          var send_data={
            main_uid:main_uid,
            name:title,
            shop_id:shop_id,
            send_customer_id:app.globalData.customerInf.id,
            article_template_main_id:article_template_main_id,
            is_wx:1,
            is_pyq:0
          }
          var that=this;

          console.log(imgUrl);
          that.insertOrUpdateMallBaseArticleEffectMain(send_data);
          let shareObj = {
              title: title,
              path: 'pages/mall/pages/mallbasearticletemplatedetailresult/mallbasearticletemplatedetailresult?bind_type=3&associate_type=2&' + 
              'shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +
              '&goods_id=' + goods_id+'&article_template_main_id='+article_template_main_id+'&main_uid='+main_uid+"&wx_pyq_type=1",
              imageUrl: imgUrl,
              success: function (res) {
                console.log(res);
                console.log("res.errMsg:"+res.errMsg);
                  if (res.errMsg == 'shareAppMessage:ok') {
                    
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
        insertOrUpdateMallBaseArticleEffectMain(data){
            wx.request({
              url: app.globalData.insertOrUpdateMallBaseArticleEffectMain,
              method:"POST",
              header:{
                  'content-type':'application/json'
              },
              data:data,
              success:res=>{
                  console.log(res);
                  if(res&&res.data&&res.data.code!=1000){
                    wx.showToast({
                      title: ''+res.data.msg,
                      icon: 'error',
                    })
                  }
              },
              fail:err=>{
                wx.hideLoading();
                  wx.showToast({
                    title: '网络异常',
                    icon:'error',
                  })
              },
            })
        },
        initData(){
            var article_template_main_item=this.data.article_template_main_item;
            article_template_main_item.id=0;
            article_template_main_item.article_main_id=0;
            article_template_main_item.name='';
            article_template_main_item.key_word='';
            article_template_main_item.share_img_url='';
            //清空模板明细
            this.setData({
            article_template_main_item:article_template_main_item,
            detail_item:{},
            article_template_detail_array:[],
            article_detail_array:[],
            is_updated:0,
            pageId: 'page_0',
            s_key_word:'',
            key_word:'',
            });

            this.setData({
              article_main_page_index:1,
              article_main_page_size:20,
              article_main_array:[],
              listIndexArticleMain:-1,
              article_main_item:{},
            });
            this.setData({
              s_article_template_main_page_index:1,
              s_article_template_main_page_size:20,
              s_article_template_main_array:[],
              listIndexArticleTemplateMain:-1,
              s_article_template_main_item:{},
            });
            this.initSearchData();

        },
        showShareDlg(){
          this.setData({
            b_share_dlg_show:true,
          })
          var main_uid=this.genUUID();
          console.log(main_uid);
          this.setData({
            main_uid:main_uid,
          })

        },
        genUUID(){
          var s = [];
          var hexDigits = "0123456789abcdef";
          for (var i = 0; i < 36; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
          }
          s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
          s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
          s[8] = s[13] = s[18] = s[23] = "-";
        
          var uuid = s.join("");
          return uuid;
        },
        hideShareDlg(){
          this.setData({
            b_share_dlg_show:false,
          })
        },
        shareTimeLine(e){
          this.hideShareDlg();
          this.generatePoster(e);
      },   
      generatePoster_BAK(e) {
        
        let that = this    
        
        var article_template_main_item=this.data.article_template_main_item;
        var multimedia_url=article_template_main_item.share_img_url;
        var shop_id=article_template_main_item.shop_id;
        var goods_id=article_template_main_item.goods_id;

        
        // article_template_main_item:{
        //   id:0,
        //   article_main_id:0,
        //   goods_id:0,
        //   shop_id:0,
        //   name:'',
        //   key_word:'',
        //   share_img_url:'',
        //   cut_introduction:'',
        // },

        wx.createSelectorQuery()
          .select('#canvas')
          .fields({
            node: true,
            size: true,
          })
          .exec(res => {
            const canvas = res[0].node
            var ctx = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            console.log(dpr)
            const width = res[0].width
            const height = res[0].height
            console.log(width);
            console.log(height);

            canvas.width = width * dpr
            canvas.height = height * dpr
            console.log(canvas.width)
            console.log(canvas.height)

            ctx.scale(dpr, dpr)
    
            let imgUrl = 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/sszg/0' + (Math.ceil(Math.random() * 7)) + '.png';
    
            console.log(imgUrl)
            wx.downloadFile({
              url: imgUrl,
              success: res => {
                let img2 = canvas.createImage()
                img2.src = res.tempFilePath
                new Promise((a, b) => {
                  img2.onload = () => {
                    ctx.drawImage(img2, 0, 0, 621, 1099)
                    ctx.fillStyle = 'rgb(255, 255, 255)';
                    ctx.fillRect(430, 780, 210, 210);
                    a()
                  }
                }).then(res => {
                  that.getRandomImage()
                  wx.downloadFile({
                    url: that.data.poster_bg_img_url,
                    success: res => {
                      console.log("poster_bg_img_url:"+that.data.poster_bg_img_url+"下载成功")
                      let img = canvas.createImage()
                      img.src = res.tempFilePath
                      new Promise((a, b) => {
                        img.onload = () => {

                          //分享模板图
                          ctx.drawImage(img, 0, 0, 621, 1099)
                          
                          //let imgUrl2 = that.data.multimedia_url
                          let imgUrl2 = multimedia_url;

                          wx.downloadFile({
                            url: imgUrl2,
                            success: res =>{
                              console.log("imgUrl2:"+imgUrl2+"下载成功")
                              let img3 = canvas.createImage()
                              img3.src = res.tempFilePath;
                              

                              new Promise((a,b) =>{
                                img3.onload = () =>{
                                  ctx.drawImage(img3, 20, 50, 581, 581);
    
                                  //分享标题
                                  if (that.data.shareImageTitle) {
                                    // ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                                    // ctx.fillRect(20, 100, 581, 60);
                                    ctx.font = "60px nainao"
                                    ctx.textAlign = "center"
                                    ctx.fillStyle = "#FFFFFF"
                                    ctx.fillText(that.data.shareImageTitle, 310.5, 160)
                                    ctx.fillText(that.data.shareImageTitle, 311, 160.5)
                                  }
    
                                  a()
                                }
                              }).then(res =>{
                                //分享内容
                                if (that.data.shareImageDetail) {
                                  for (let i = 0; i < that.data.shareImageDetail.length; i++) {
                                    const element = that.data.shareImageDetail[i];
                                   
                                    ctx.font = "50px nainao"
                                    ctx.textAlign = "left"
                                    ctx.fillStyle = that.data.currentBlockColor
                                    ctx.fillText(element, 100, (225 + (i * 30)))
                                    ctx.fillText(element, 100.5, (225.5 + (i * 30)))
                                  }
                                }else{
                                  ctx.font = "45px nainao"
                                  ctx.textAlign = "left"
                                  ctx.fillStyle = that.data.currentBlockColor  
                                  
                                }
                              })
                            }
                          })
    
                          //阴影
                          ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                          ctx.fillRect(0, 630, 621, 510);
                          
                          ctx.font = "bold 36px SimHei"
                          ctx.textAlign = "left"
                          ctx.fillStyle = "#FFFFFF"
                          let product_name2 = ""
                          let product_name = that.data.product_name                       
                          
                          if (ctx.measureText(product_name).width > 587) {
                            product_name2 = product_name.slice(16)
                            product_name = product_name.substring(0, 16)
                          }                       
                          
                          ctx.fillText(product_name, 20, 686)                       
  
                          if (product_name2 != "") {
                            ctx.fillText(product_name2, 20, 736)                          
                          }                        
    
                          ctx.font = "bold 45px SimHei"
                          ctx.textAlign = "left"
                          ctx.fillStyle = "white"  
                         
                          ctx.fillText('￥' + that.data.product_price + "元", 35, 791)
  
                          ctx.font = "bold 36px SimHei"
                          ctx.textAlign = "left"
                          ctx.fillStyle = "white"  
  
                          ctx.fillText('券后价:' + '￥' + that.data.customer_preferential_price + "元", 35, 841)
                          ctx.fillText('充值会员价:' + '￥' + that.data.recharge_member_price + "元", 35, 891)
                          ctx.fillText('VIP价:' + '￥' + that.data.vip_member_price + "元", 40, 941)                                            
                         
    
                          ctx.font = "bold 36px SimHei"
                          let text = (that.data.platform_cash_commission > 0 ? that.data.platform_cash_commission + '元[平台现金]' : that.data.platform_star_commission > 0 ? that.data.platform_star_commission + '元[平台星盾]' : '') + (that.data.shop_cash_commission > 0 ? that.data.shop_cash_commission + '元[商家现金]' : that.data.shop_star_commission > 0 ? that.data.shop_star_commission + '元[商家星盾]' : '')
                          if (text != '') {
                            ctx.fillText("提成:" + text, 35, 991)                          
                          }  
                          
                          ctx.font = "36px SimHei"
                          ctx.textAlign = "left"
                          ctx.fillStyle = "#FFFFFF"                        
                          ctx.fillText('长按二维码进入弹叮商城购买', 20, 1060)
                          console.log("ctx.fillText:长按二维码进入弹叮商城购买")
                                              
                          a()
                        }
                      }).then(res => {
                        console.log("QRCode执行中")
                        new QRCode('myQrcode', {
                          text: 'https://mb.fsmbdlkj.com/QRCodeToDetail/?bind_type=3&associate_type=2&shop_id=' + shop_id + 
                          '&associate_id=' + app.globalData.customerInf.id + '&goods_id=' + goods_id,
                          width: 180, //canvas 画布的宽
                          height: 180, //canvas 画布的高
                          padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
                          correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
                          colorDark: "#000000", //分别为两种交替颜色
                          colorLight: "#FFFFFF",
                          callback: (e) => {  
                             console.log("二维码生成成功")
                            console.log(e)
                            wx.canvasToTempFilePath({
                              x: 0,
                              y: 0,
                              width: 300,
                              height: 300,
                              destWidth: 300,
                              destHeight: 300,
                              canvasId: 'myQrcode',
                              success(res) {
                                console.log(res)
                                let img3 = canvas.createImage()
                                img3.src = res.tempFilePath
                                new Promise((a, b) => {
                                  img3.onload = () => {
                                    ctx.drawImage(img3, 411, 815, 200, 200)
                                    a()
                                  }
                                }).then(res => {
                                  wx.canvasToTempFilePath({
                                    x: 0,
                                    y: 0,
                                    width: 621 * wx.getSystemInfoSync().pixelRatio,
                                    height: 1099 * wx.getSystemInfoSync().pixelRatio,
                                    destWidth: 621,
                                    destHeight: 1099,
                                    canvas: canvas,
                                    success: res2 => {
                                      wx.hideLoading()
                                      that.setData({
                                        showPoster: true,
                                        loadImagePath: res2.tempFilePath,
                                      });
                                      
                                      that.uploadShareCardFile(res2.tempFilePath,1)
                                    }
                                  })
                                })
                              }
                            })
                          }
                        })
                        
                      })
                    }
                  })
                })
              }
            })
          })
        
        wx.showLoading({
          title: '正在加载...',
          mask: true
        })      
      },  
      generatePoster(e) {
    
        let that = this    
        
        var article_template_main_item=this.data.article_template_main_item;

        var article_template_main_id=article_template_main_item.id;

        var multimedia_url=article_template_main_item.share_img_url;

        var shop_id=article_template_main_item.shop_id;
        var goods_id=article_template_main_item.goods_id;
        var cut_introduction=article_template_main_item.cut_introduction;

        var article_template_detail_array=this.data.article_template_detail_array;

        var first_article_template_detail_item=article_template_detail_array[0];
        var first_img_url='';
        //明细类型：1-图片 2-视频 3-文章
        if(first_article_template_detail_item.item_type==1){
          first_img_url=first_article_template_detail_item.item_content;
        }
        if(first_article_template_detail_item.item_type==2){
          first_img_url=first_article_template_detail_item.item_content;
        }
        if(first_article_template_detail_item.item_type==3){
          first_img_url=article_template_main_item.share_img_url;
        }

        var middle_img_url='';
        for(var i=0;i<article_template_detail_array.length;i++){
          var detailObj=article_template_detail_array[i];
          if(detailObj.source_type==2&&detailObj.item_type==1){
            middle_img_url=detailObj.item_content;
          }
        }

        if(!first_img_url){
            wx.showToast({
              title: '首图地址为空',
              icon:'error'
            })
            return;
        }
        if(!middle_img_url){
          wx.showToast({
            title: '广告图为空',
            icon:'error'
          })
          return;
        }

        console.log(first_img_url)
        console.log(middle_img_url)
        console.log(cut_introduction)
        if(middle_img_url==''){
          wx.showToast({
            title: '无标题图片',
          })
          return;
        }
        if(middle_img_url==''){
          wx.showToast({
            title: '无广告图片',
          })
          return;
        }
     
        
        // article_template_main_item:{
        //   id:0,
        //   article_main_id:0,
        //   goods_id:0,
        //   shop_id:0,
        //   name:'',
        //   key_word:'',
        //   share_img_url:'',
        //   cut_introduction:'',
        // },

        wx.createSelectorQuery()
          .select('#canvas')
          .fields({
            node: true,
            size: true,
          })
          .exec(res => {
            const canvas = res[0].node
            var ctx = canvas.getContext('2d')
            const dpr = wx.getSystemInfoSync().pixelRatio
            console.log(dpr)
            const width = res[0].width
            const height = res[0].height
            console.log(width);
            console.log(height);

            canvas.width = width * dpr
            canvas.height = height * dpr
            console.log(canvas.width)
            console.log(canvas.height)

            ctx.scale(dpr, dpr)


            that.getRandomImage()
            //背景图片
            //let imgUrl = 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/sszg/0' + (Math.ceil(Math.random() * 7)) + '.png';
    
            let imgUrl=that.data.poster_bg_img_url;
            console.log(imgUrl)
           

            wx.downloadFile({
              url: imgUrl,
              success: res => {
                let img2 = canvas.createImage()
                img2.src = res.tempFilePath
                new Promise((a, b) => {
                  img2.onload = () => {
                    ctx.drawImage(img2, 0, 0, 621, 1099)
                    // ctx.fillStyle = 'rgb(255, 255, 255)';
                    // ctx.fillRect(430, 780, 210, 210);
                    a()
                  }
                }).then(res => {
                  //首行图片
                  //that.getRandomImage()
                  wx.downloadFile({
                    //url: that.data.poster_bg_img_url,
                    url:first_img_url,
                    success: res => {
                      console.log("first_img_url:"+that.data.first_img_url+"下载成功")
                      let img = canvas.createImage()
                      img.src = res.tempFilePath
         
                      new Promise((a, b) => {
                        img.onload = () => {

                          ctx.drawImage(img, 20, 50, 581, 350)
                          
                          //let imgUrl2 = that.data.multimedia_url

                          //中间行图片
                          //let imgUrl2 = multimedia_url;
                          let imgUrl2=middle_img_url;

                          wx.downloadFile({
                            url: imgUrl2,
                            success: res =>{
                              console.log("imgUrl2:"+imgUrl2+"下载成功")
                              let img3 = canvas.createImage()
                              img3.src = res.tempFilePath;
                              new Promise((a,b) =>{
                                img3.onload = () =>{
                                  //ctx.drawImage(img3, 20, 50, 581, 581);
                                  ctx.drawImage(img3, 20, 430, 581, 350);
                                  a()
                                }
                              }).then(res =>{

                                //分享内容
                                // if (that.data.shareImageDetail) {
                                //   for (let i = 0; i < that.data.shareImageDetail.length; i++) {
                                //     const element = that.data.shareImageDetail[i];
                                   
                                //     ctx.font = "50px nainao"
                                //     ctx.textAlign = "left"
                                //     ctx.fillStyle = that.data.currentBlockColor
                                //     ctx.fillText(element, 100, (225 + (i * 30)))
                                //     ctx.fillText(element, 100.5, (225.5 + (i * 30)))
                                //   }
                                // }else{
                                //   ctx.font = "45px nainao"
                                //   ctx.textAlign = "left"
                                //   ctx.fillStyle = that.data.currentBlockColor  
                                  
                                // }
                              })
                            }
                          })
    
                          //阴影
                          // ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                          // ctx.fillRect(0, 630, 621, 510);
                          
                          // ctx.font = "bold 36px SimHei"
                          // ctx.textAlign = "left"
                          // ctx.fillStyle = "#FFFFFF"
                           let product_name2 = ""
                           let product_name = that.data.product_name                       
                          
                                              
                          
                          // ctx.fillText(product_name, 20, 686)                       
  
                          // if (product_name2 != "") {
                          //   ctx.fillText(product_name2, 20, 736)                          
                          // }                        
    
                          // ctx.font = "bold 45px SimHei"
                          // ctx.textAlign = "left"
                          // ctx.fillStyle = "white"  
                         
                          // ctx.fillText('￥' + that.data.product_price + "元", 35, 791)
  
                          
  
                          //ctx.fillText('券后价:' + '￥' + that.data.customer_preferential_price + "元", 35, 841)
                          //ctx.fillText('充值会员价:' + '￥' + that.data.recharge_member_price + "元", 35, 891)
                          if(product_name){
                            ctx.font = "bold 36px SimHei"
                            ctx.textAlign = "left"
                            ctx.fillStyle = "white" 
                            if (product_name.length>10) {
                              product_name2 = product_name.slice(10)
                              product_name = product_name.substring(0, 10)
                            }   
                            
                            ctx.fillText(product_name, 20, 845)
                            ctx.fillText(product_name2, 20, 890)
                          }

                          //cut_introduction='测试手机测试手机测试手机'
                          var cut_introduction2='';
                          if(cut_introduction){

                            ctx.font = "bold 32px SimHei"
                            ctx.textAlign = "left"
                            ctx.fillStyle = "white" 
                            if (cut_introduction.length>11) {
                              cut_introduction2 = cut_introduction.slice(11)
                              cut_introduction = cut_introduction.substring(0, 11)
                            }   
                            ctx.fillText(cut_introduction, 20, 955)
                            ctx.fillText(cut_introduction2, 20, 1000)

                          }
                          
                         
                          
                          //ctx.fillText('VIP价:' + '￥' + that.data.vip_member_price + "元", 40, 941)                                            
                         
    
                          // ctx.font = "bold 36px SimHei"
                          // let text = (that.data.platform_cash_commission > 0 ? that.data.platform_cash_commission + '元[平台现金]' : that.data.platform_star_commission > 0 ? that.data.platform_star_commission + '元[平台星盾]' : '') + (that.data.shop_cash_commission > 0 ? that.data.shop_cash_commission + '元[商家现金]' : that.data.shop_star_commission > 0 ? that.data.shop_star_commission + '元[商家星盾]' : '')
                          // if (text != '') {
                          //   ctx.fillText("提成:" + text, 35, 991)                          
                          // }  
                          
                          ctx.font = "36px SimHei"
                          ctx.textAlign = "left"
                          ctx.fillStyle = "#FFFFFF"                        
                          ctx.fillText('长按二维码进入弹叮商城购买', 20, 1060)
                          console.log("ctx.fillText:长按二维码进入弹叮商城购买")
                                              
                          a()
                        }
                      }).then(res => {
                        console.log("QRCode执行中")
                        new QRCode('myQrcode', {
                          text: app.getServerUrl()+'/QRCodeToArticleTemplate/?bind_type=3&associate_type=2&shop_id=' + shop_id + 
                          '&associate_id=' + app.globalData.customerInf.id + '&goods_id=' + goods_id+'&article_template_main_id='+article_template_main_id,
                          width: 180, //canvas 画布的宽
                          height: 180, //canvas 画布的高
                          padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
                          correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
                          colorDark: "#000000", //分别为两种交替颜色
                          colorLight: "#FFFFFF",
                          callback: (e) => {  
                             console.log("二维码生成成功")
                            console.log(e)
                            wx.canvasToTempFilePath({
                              x: 0,
                              y: 0,
                              width: 300,
                              height: 300,
                              destWidth: 300,
                              destHeight: 300,
                              canvasId: 'myQrcode',
                              success(res) {
                                console.log(res)
                                let img3 = canvas.createImage()
                                img3.src = res.tempFilePath
                                new Promise((a, b) => {
                                  img3.onload = () => {
                                    ctx.drawImage(img3, 411, 815, 200, 200)
                                    a()
                                  }
                                }).then(res => {
                                  wx.canvasToTempFilePath({
                                    x: 0,
                                    y: 0,
                                    width: 621 * wx.getSystemInfoSync().pixelRatio,
                                    height: 1099 * wx.getSystemInfoSync().pixelRatio,
                                    destWidth: 621,
                                    destHeight: 1099,
                                    canvas: canvas,
                                    success: res2 => {
                                      wx.hideLoading()
                                      that.setData({
                                        showPoster: true,
                                        loadImagePath: res2.tempFilePath,
                                      });
                                      
                                      that.uploadShareCardFile(res2.tempFilePath,1)
                                    }
                                  })
                                })
                              }
                            })
                          }
                        })
                        
                      })
                    }
                  })
                })
              }
            })
          })
        
        // wx.showLoading({
        //   title: '正在加载...',
        //   mask: true
        // })      
      },  
      closePosterWindow() {
        let that = this
        that.setData({
          showPoster: !that.data.showPoster,
          loadImagePath2: '',
          loadImagePath: '',
          currentPoster: '',
          shareImageTitle: '',
          shareImageDetail: []
        })
      },
      //随机选海报背景图片
    getRandomImage: function() {
      const images = [
        'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/bg1.png',
        'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/bg2.png',
        'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/bg3.png',
        'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/bg4.png',
        'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/bg5.png'
      ];
      const randomIndex = Math.floor(Math.random() * images.length);
      this.setData({
        poster_bg_img_url: images[randomIndex]
      });
    },
    uploadShareCardFile(e,f){
      let that = this;
      wx.uploadFile({
        url: app.globalData.UploadAliYunFile,
        filePath: e,
        name: 'file',
        success: res=>{
          let result = JSON.parse(res.data);
          if (result.lst[0].success) {
            let url = result.lst[0].url;
            let poster_url = that.data.poster_url;
            let video_url = that.data.temporaryVideo;
  
            that.setData({
              poster_url: f == 1 ? url : poster_url,
              video_url: video_url
            },()=>{
              if(f == 1 && !that.data.shareCardInf){
                that.addShareCardInf();
              }else if(f == 1 && that.data.shareCardInf){
                that.updateShareCardInf()
              }
            })
          }
        }
      })
    },
    addShareCardInf(){
      let that = this;
      let data = {
        shop_id: app.globalData.shopid,
        poster_url: that.data.poster_url,
        video_url: that.data.video_url
      }
  
      wx.request({
        url: app.globalData.addShareCardInf,
        method: 'POST',
        data: data,
        success: res=>{
          if(res.data.code == 1){
            let shareCardInf = res.data.data;
            that.setData({
              shareCardInf
            })
          }
        }
      })
    },
  
    updateShareCardInf(){
      let that = this;
      let data = {
        id: that.data.shareCardInf.id,
        poster_url: that.data.poster_url,
        video_url: that.data.video_url
      }
  
      wx.request({
        url: app.globalData.updateShareCardInf,
        method: 'POST',
        data: data,
        success: res=>{
          if(res.data.code == 1){
            console.log('updateShareCardInf is success');
          }else{
            console.log('updateShareCardInf is fail');
          }
        }
      })
    },
    showOrHideBDingMainShow(e){
      console.log(e);
      var b_ding_main_show=e.currentTarget.dataset.show;
      console.log(b_ding_main_show);
      if(b_ding_main_show==true){
        this.selectAllDingMsgRecordDingKeFromMemberInfo();
      }
      this.setData({
        b_ding_main_show:b_ding_main_show,
      })

  
    },
    changeDingSelect(e){
      var index=e.currentTarget.dataset.index;
      var dingYouList=this.data.dingYouList;
      var ding_select_count=0;
      for(var i=0;i<dingYouList.length;i++){
        if(dingYouList[i].is_select==1){
          ding_select_count+=1;
        }
      }
      if(dingYouList[index].is_select==0){
        if(ding_select_count>16){
          wx.showToast({
            title: '当前最多只能选择16人转发',
          })
          return;
        }
        dingYouList[index].is_select=1;
      }else{
        dingYouList[index].is_select=0;
      }

      ding_select_count=0;
      for(var i=0;i<dingYouList.length;i++){
        if(dingYouList[i].is_select==1){
          ding_select_count+=1;
        }
      }
      this.setData({
        dingYouList:dingYouList,
        ding_select_count:ding_select_count,
      })
    },
    selectAllDingMsgRecordDingKeFromMemberInfo(){
      var that=this;

      wx.request({
        url: app.globalData.selectAllDingMsgRecordDingKeFromMemberInfo,        
        method: 'POST',
        data: {                
            customer_name:that.data.ding_key_word, 
            ding_associate_id:app.globalData.customerInf.id, 
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
            if(res.data.code == 1000){
              var dingYouList = res.data.data;     
              for(var i=0;i<dingYouList.length;i++){
                dingYouList[i].is_select=0;
              }                 
              that.setData({
                dingYouList: dingYouList,
                ding_select_count:0,
              })
            }                                
        },
        fail(res){
          that.setData({
            mediaIsLoading:false,
          })
          wx.showToast({
            title: '获取叮友失败:'+res.data.msg,
            icon:'error',
            duration: 2000,
          }) 
        }
      })
    },

    sendMsgExec(){
      var that=this;
      var msg_type=5;
      var msg='';
      var duration=0;
      var dingYouList=this.data.dingYouList;
      var receiver_codes='';
      var task_queue_names='';


      var article_template_main_item=this.data.article_template_main_item;
      var title = '' + article_template_main_item.name;
      var imgUrl = article_template_main_item.share_img_url;
      var goods_id=article_template_main_item.goods_id;
      var shop_id=article_template_main_item.shop_id;
      var article_template_main_id=article_template_main_item.id;
      var main_uid=this.data.main_uid;

      var cardObj={
        id:0,
        msg_record_id:0,
        card_type:1,
        title:title,
        img_url:imgUrl,
        page_url:'/pages/mall/pages/mallbasearticletemplatedetailresult/mallbasearticletemplatedetailresult',
        page_param:'bind_type=3&associate_type=2' + '&shop_id=' + shop_id + '&associate_id=' + app.globalData.customerInf.id +'&goods_id=' + goods_id+'&article_template_main_id='+article_template_main_id+'&main_uid='+main_uid+"&wx_pyq_type=0&is_from_ding=1",
      }
      var lstDingMsgCard=[];
      lstDingMsgCard.push(cardObj);

      for(var i=0;i<dingYouList.length;i++){
          var dingObj=dingYouList[i];
          if(dingObj.is_select==1){
            if(receiver_codes==''){
                receiver_codes=dingObj.customer_code;
                task_queue_names=(app.globalData.hj + "_qgqc_" + dingObj.customer_id);
            }else{
              receiver_codes=receiver_codes+','+dingObj.customer_code;
              task_queue_names=task_queue_names+','+(app.globalData.hj + "_qgqc_" + dingObj.customer_id);
            }
          }
      }

      if(receiver_codes==''){
        wx.showToast({
          title: '请选择接收人',
          icon:'none'
        });
        return;
      }

      //msg_type 消息类型 1-文字 2-图片 3-语音 4-视频 5-卡片
      //msg 消息内容
      //wechat_type 聊天类型： 1-店员->客户 2-客户->店员
      var customer_code=Number(app.globalData.customerInf.userCode);
      
      var data={
        msg_type: msg_type,
        duration:duration,
        msg: title,
        sender_code: customer_code,
        receiver_code:0,
        receiver_codes: receiver_codes,
        lstDingMsgCard:lstDingMsgCard,
      };
      wx.showLoading({
        title: '发送中',
      })
      wx.request({
        url: app.globalData.insertDingMsgRecord,
        method: 'POST',
        data: data,
        success: res => {
          wx.hideLoading();
          if (res.data.code == 1000) {
              for(var i=0;i<dingYouList.length;i++){
                dingYouList[i].is_select=0;
              }
              that.setData({
                dingYouList:dingYouList,
                b_ding_main_show:false,
              })
              that.sendRabbitMqMsg(task_queue_names);
          } else {
            wx.showModal({
              title: '提示',
              content: '发送失败'+res.data.msg,
              showCancel: false
            })
            
          }
        },
        fail: res => {
          wx.hideLoading();
          wx.showModal({
            title: '提示',
            content: '发送失败',
            showCancel: false
          })
          
        }
      })
    },
    sendRabbitMqMsg(task_queue_names){
      console.log("sendRabbitMqMsg:");
      var meInfo=this.data.meInfo;
      var otherInfo=this.data.otherInfo;
  
      var that=this;
  
      var sender_id=app.globalData.customerInf.id;
      var receiver_id=0;
  
      var msgObj={
          data:{
              msg:{
                  type: "ding_ke_msg_record",
                  tg: "ding_ke_msg_record",
                  shop_id: 0,
                  wechat_type: 0,
                  sender_id: sender_id,
                  receiver_id: receiver_id,
              }
          }
      }
      var msgJson=JSON.stringify(msgObj);
      var data={
          task_queue_names:task_queue_names,
          msg:msgJson,
      }
      wx.request({
        url: app.globalData.SendRabbitMqMsg,
        method: 'POST',
        data: data,
        success: res => {
          console.log(res)
        },
        fail: res => {
          console.log(res)
        }
      })
  
      
    },


})