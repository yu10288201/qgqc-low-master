const app = getApp()
const QRCode = require("../../../../utils/weapp-qrcode.js")

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
    //是否显示分享窗体
    share_dialog:false,
    showQR:false,//二维码窗体
    income_type:0,
    goods_id:0,
    shop_item:null,

    share_type:1,//1充值会员 2 vip会员
    shop_list: [],
    shop_name:'',
		pageIndex: 1,
		pageSize: 10,
		isLoading: false,
    isOver: false,
    def_shop_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/smp/20221031_b55b78edef204fa8a26cc7218e108af6.jpg',
    item: {},
    shop: {},
    poster_bg_img_url: '', //海报背景图案
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

  generatePoster(e) {
    console.log('generatePoster')
    var associate_id=0;
    var goods_id=0;
    var shop_id=this.data.shop_item.shop_id;
    var shop_name=this.data.shop_item.shop_name;

    var customerInf=app.globalData.customerInf;
    associate_id=customerInf.id?customerInf.id:0;

    if(this.data.income_type==1){
      goods_id=1;
    }else if(this.data.income_type==2){
      goods_id=2;
    }   

    var qrt = 'https://mb.fsmbdlkj.com/QRCodeToRecharge/?bind_type=3&associate_type=3&associate_id=' + associate_id +"&goods_id="+goods_id+"&shop_id="+shop_id;
    var cardImg = 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/recharge.png'
    var product_name = '弹叮商城充值会员'

    if(goods_id==2){
      qrt = 'https://mb.fsmbdlkj.com/QRCodeToVip?bind_type=3&associate_type=3&associate_id=' + associate_id + "&goods_id="+goods_id+"&shop_id="+shop_id;
      cardImg = 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/vip.png'
      product_name = '弹叮商城vip会员'
    }

    this.closeShareDialog()

    let that = this     
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
        const width = res[0].width
        const height = res[0].height
        canvas.width = width * dpr
        canvas.height = height * dpr
        ctx.scale(dpr, dpr)

        let imgUrl = 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/sszg/0' + (Math.ceil(Math.random() * 7)) + '.png';

        wx.downloadFile({
          url: imgUrl,
          success: res => {
            
            let img2 = canvas.createImage()
            img2.src = res.tempFilePath
            new Promise((a, b) => {
              img2.onload = () => {
                ctx.drawImage(img2, 0, 0, 621, 999)
                ctx.fillStyle = 'rgb(255, 255, 255)';
                ctx.fillRect(430, 780, 210, 210);
                a()
              }
            }).then(res => {
              
              that.getRandomImage()
              wx.downloadFile({
                url: that.data.poster_bg_img_url,
                success: res => {
                  
                  let img = canvas.createImage()
                  img.src = res.tempFilePath
                  new Promise((a, b) => {
                    img.onload = () => {
                      //分享模板图
                      ctx.drawImage(img, 0, 0, 621, 999)                      
                      let imgUrl2 = cardImg
                      wx.downloadFile({
                        url: imgUrl2,
                        success: res =>{
                          
                          let img3 = canvas.createImage()
                          img3.src = res.tempFilePath;

                          new Promise((a,b) =>{
                            img3.onload = () =>{
                              ctx.drawImage(img3, 20, 50, 581, 581);
                              a()
                            }
                          }).then(res =>{
                            
                            // 分享内容
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
                      
                      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
                      ctx.fillRect(0, 630, 621, 410);
                      
                      ctx.font = "45px SimHei"
                      ctx.textAlign = "left"
                      ctx.fillStyle = "#FFFFFF"
                      ctx.fillText(product_name, 40, 686)
                      ctx.fillText(product_name, 40.5, 686.5)                      

                      ctx.font = "45px SimHei"
                      ctx.textAlign = "left"
                      ctx.fillStyle = "white"  
                     
                      // ctx.fillText(that.data.customer_preferential_price + "元", 40, 751)
                      // ctx.fillText(that.data.customer_preferential_price + "元", 40.5, 751.5)
                      // ctx.fillText(that.data.customer_preferential_price + "元", 41, 752)
                      // ctx.fillText(that.data.customer_preferential_price + "元", 39, 750)
                      // ctx.fillText(that.data.customer_preferential_price + "元", 39.5, 750.5)               

                      //店铺名
                      ctx.font = "36px SimHei"
                      ctx.textAlign = "left"
                      ctx.fillStyle = "#FFFFFF"
                      ctx.fillText(shop_name + '入口', 40, 960)
                      ctx.fillText(shop_name + '入口', 40.5, 960.5)                        
                      a()
                    }
                  }).then(res => {    
                                   
                    new QRCode('myQrcode', {
                      text: qrt,
                      width: 180, //canvas 画布的宽
                      height: 180, //canvas 画布的高
                      padding: 0, // 生成二维码四周自动留边宽度，不传入默认为0
                      correctLevel: QRCode.CorrectLevel.L, // 二维码可辨识度
                      colorDark: "#000000", //分别为两种交替颜色
                      colorLight: "#FFFFFF",
                      callback: (e) => {                          
                        wx.canvasToTempFilePath({
                          x: 0,
                          y: 0,
                          width: 300,
                          height: 300,
                          destWidth: 300,
                          destHeight: 300,
                          canvasId: 'myQrcode',
                          success(res) {
                            
                            let img3 = canvas.createImage()
                            img3.src = res.tempFilePath
                            new Promise((a, b) => {
                              img3.onload = () => {
                                ctx.drawImage(img3, 411, 715, 200, 200)
                                a()
                              }
                            }).then(res => {
                              wx.canvasToTempFilePath({
                                x: 0,
                                y: 0,
                                width: 621 * wx.getSystemInfoSync().pixelRatio,
                                height: 999 * wx.getSystemInfoSync().pixelRatio,
                                destWidth: 621,
                                destHeight: 999,
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

  searchClick(e){
    this.setData({
      pageIndex:1,
      shop_list:[],
    })
    this.selectData();
  },
	
	// 加载下一页数据
	loadNextPage: function () {		
		if (this.data.isLoading || this.data.isOver) {
			// 防止重复加载
			return;
		}
		// 加载下一页数据
		const nextPageIndex = this.data.pageIndex + 1;		
		this.setData({
			isLoading: true, // 设置isLoading为true，表示正在加载数据
			pageIndex: nextPageIndex,
		});		
		this.selectData();
	},

 	selectData(){
    let that = this
		wx.request({
		  url: app.globalData.selectMallMemberStaffShopVo,
			method: 'POST',
			data: {  
         shop_name:that.data.shop_name,   
				 page_size: that.data.pageSize,
				 page_index: that.data.pageIndex,
			},
			success(res){
				if(res.data.code == 1000){
          const shop_list = res.data.data;
          that.setData({
            shop_list: that.data.shop_list.concat(shop_list),
          })
				}				
			},
			fail(res){
				wx.showToast({
					title: '获取失败:'+res.data.msg,
					icon:'error',
					duration: 2000,
				}) 
			},complete:function(e){
        that.setData({
          isLoading:false,
        })
      }
		})
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {	
	  this.selectData();		
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
	  this.loadNextPage();
  },

  closePosterWindow(){
    this.setData({
      showPoster: false
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

    var associate_id=0;
    var goods_id=0;
    var shop_id=this.data.shop_item.shop_id;

    var customerInf=app.globalData.customerInf;
    associate_id=customerInf.id?customerInf.id:0;

    if(this.data.income_type==1){
      goods_id=1;
    }else if(this.data.income_type==2){
      goods_id=2;
    }    

    var qrt = '/pages/mall/pages/scancodededuction/scancodededuction?bind_type=3&associate_type=3&associate_id=' + associate_id+"&goods_id="+goods_id+"&shop_id="+shop_id;
    var imgUrl = 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/recharge.png'
    var title = '推荐你充值弹叮商城'

    if(goods_id==2){
      qrt = '/pages/mall/pages/viprecharge/viprecharge?bind_type=3&associate_type=3&associate_id=' + associate_id+"&goods_id="+goods_id+"&shop_id="+shop_id;
      imgUrl = 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bg/vip.png'
      title = '推荐你成为弹叮商城vip会员'
    }
  
    var that = this;
    that.closeShareDialog();   
    let shareObj = {
        title: title,
        path: qrt,
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

  showShareDialog:function(e){
    console.log(e);

    if(app.globalData.customerInf){
      console.log(app.globalData.customerInf)
    }else{
      wx.showToast({
        title: '人员信息为空',
        icon:'error'
      })
      return;
    }
    var type=e.currentTarget.dataset.type;
    var shop_item=e.currentTarget.dataset.item;

    var income_type=Number(type);
    if(income_type!=1&&income_type!=2){
      return;
    }
    if(shop_item==undefined||shop_item==null){
      return;
    }
    this.setData({
      income_type:income_type,
      shop_item:shop_item,
    })
    this.setData({
      share_dialog:true,
    })
  },

  //关闭会员二维码
  closeQRCode(){
    this.setData({
      showQR: false
    })
    this.closeShareDialog()
  },

  //显示会员二维码
  showQRCode() {  
    var associate_id=0;
    var goods_id=0;
    var shop_id=this.data.shop_item.shop_id;

    var customerInf=app.globalData.customerInf;
    associate_id=customerInf.id?customerInf.id:0;

    if(this.data.income_type==1){
      goods_id=1;
    }else if(this.data.income_type==2){
      goods_id=2;
    }   

    this.setData({
        showQR: true,
    }, () => {
        wx.showLoading({
            title: '生成中...',
        })
    })

    var qrt = 'https://mb.fsmbdlkj.com/QRCodeToRecharge/?bind_type=3&associate_type=3&associate_id=' + associate_id+"&goods_id="+goods_id+"&shop_id="+shop_id;

    if(goods_id==2){
      qrt = 'https://mb.fsmbdlkj.com/QRCodeToVip?bind_type=3&associate_type=3&associate_id=' + associate_id+"&goods_id="+goods_id+"&shop_id="+shop_id;
    }
  
    wx.downloadFile({
        url: app.getServerUrl()+'/IMG/%E5%88%87%E7%93%9C%E5%88%87%E8%8F%9C/logo.png',
        success: res => {            
            require('../../../../utils/qrcode.min.atim.js')({
                width: 200,
                height: 200,
                x: 0,
                y: 0,
                canvasId: 'rechargeQrcode',
                typeNumber: 13,
                text: qrt,
                image: {
                    imageResource: res.tempFilePath,
                    dx: 70,
                    dy: 70,
                    dWidth: 60,
                    dHeight: 60
                },
                callback(e) {                    
                    wx.hideLoading({
                        success: (res) => {},
                    })
                }
            })
        }
    })
  },

  closeShareDialog(e){     
      this.setData({
        share_dialog: false,
      })
  },
})