// pages/module_others/pages/distributionReward/distributionReward.js
const app = getApp()
const utils= require("../../../../utils/util.js")
const qr = require("../../../../utils/QRCode.js")
// const generateQLCode = require("../../../../utils/generateQRCode.js")
Page({

  /**
   * 页面的初始数据
   */
  data: {
    loadImagePath: '',
    canvas: Object,
    loadImagePath2: '',
    titleName: ['超值菜品', '超值套餐', '优惠券', '酒水'],
    chooseIndex: 0,
    height: wx.getSystemInfoSync().windowHeight,
    i_close_img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/i_close.png',

    drinksList: [], //酒水
    pageIndex4: 0,

    couponList: [], // 优惠券
    couponRefresh: true,
    pageIndex3: 0,

    comboList: [], //超值套餐
    comboRefresh: true,
    pageIndex2: 0,

    foodList: [], //超值菜品
    foodRefresh: true,
    pageIndex1: 0,

    pageSize: 20, // 分页大小
    access_token: '', 
    showPoster: false,
    customerId: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    that.setData({
      customerId: options.customerId
    })
    that.getList()

    // let a = setInterval(function(){
    //   that.getAccessToken()
    // },7200000)
    
    // that.getAccessToken()
  },

  getAccessToken(){
    let that = this
    generateQLCode.getMessage({
      back: res=>{
        that.setData({
          access_token: res.data.access_token
        })
      }
    })
  },

  // 导航栏切换
  clickChange(e) {
    let that = this
    let a = e.currentTarget.dataset.index
    console.log(a);
    that.setData({
      chooseIndex: a
    })
    switch (a) {
      case 0:
        if (that.data.foodList.length == 0) {
          that.getList()
        }
        break;
      case 1:
        if (that.data.comboList.length == 0) {
          that.getList()
        }
        break;
      case 2:
        if (that.data.couponList.length == 0) {
          that.getList()
        }
        break;
      case 3:
        if (that.data.drinksList.length == 0) {
          that.getList()
        }
        break;
      default:
        break;
    }

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    that.distributionCard = that.selectComponent("#distributionCard");
    that.couponCard = that.selectComponent("#couponCard");
  },

  downRefresh() {
    let that = this
    console.log(that.data.chooseIndex);
    if(that.data.chooseIndex == 0){
      if (that.data.foodRefresh) {
        that.getList()
      }
    }
    if(that.data.chooseIndex == 1){
      if (that.data.comboRefresh) {
        that.getList()
      }
    }
    if(that.data.chooseIndex == 2){
      if (that.data.couponRefresh) {
        that.getList()
      }
    }
    
  },
  getList() {
    let that = this
    let pageNum = 0
    let itemType = 1
    let ListA = []
    let ListB = []
    let ListC = []
    let ListD = []
    switch (that.data.chooseIndex) {
      case 0: //超值菜品
        pageNum = that.data.pageIndex1;
        itemType = 2;
        ListA = that.data.foodList;
        wx.request({
          url: app.globalData.selectAllSetMealInfo_url,
          // url: 'http://192.168.8.5:8088/evaluation/selectAllSetMealInfo',
          data: {
            shopId: '',
            typeForSetMeal: itemType,
            pageIndex: pageNum,
            pageSize: that.data.pageSize,
          },
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            console.log(res);
            if (res.data.result == 0) {
              that.setData({
                foodRefresh: false
              })
            } else {
              pageNum = Number(that.data.pageIndex1) + 1;
              for (const x of res.data.selectResult) {
                if(x.useTimeType){
                  let usefulDate = x.useTimeType
                  if(usefulDate.substr(usefulDate.length-1 , 1) == ','){
                    usefulDate = usefulDate.substr(0,usefulDate.length-1)
                  }
                  var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5','3,4','4,5,6,7','4,5,6', '4,5', '5,6,7', '5,6', '6,7']
                  if (shit.indexOf(usefulDate) != -1) {
                    var day = usefulDate.substring(0, 1).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六') + ' 至 星期' + usefulDate.substring(usefulDate.length - 1, usefulDate.length).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六').replace('7', '日')
                    x.useTimeType = '星期' + day + ' 可用'
                  } else {
                    usefulDate = usefulDate.split(',')
                    var day = ''
                    if (usefulDate.indexOf('1') != -1) {
                      day += '一、'
                    }
                    if (usefulDate.indexOf('2') != -1) {
                      day += '二、'
                    }
                    if (usefulDate.indexOf('3') != -1) {
                      day += '三、'
                    }
                    if (usefulDate.indexOf('4') != -1) {
                      day += '四、'
                    }
                    if (usefulDate.indexOf('5') != -1) {
                      day += '五、'
                    }
                    if (usefulDate.indexOf('6') != -1) {
                      day += '六、'
                    }
                    if (usefulDate.indexOf('7') != -1) {
                      day += '日、'
                    }
                    // console.log(day)
                    x.useTimeType = '星期' + day.substring(0, day.length - 1) + '可用'
                  }
                }
                ListA.push(x);
              }
              that.setData({
                pageIndex1: pageNum,
                foodList: ListA,
              })
            }
          }
        })
        break;
      case 1: //超值套餐
        pageNum = that.data.pageIndex2;
        itemType = 1;
        ListB = that.data.comboList;
        wx.request({
          url: app.globalData.selectAllSetMealInfo_url,
          // url: 'http://192.168.8.5:8088/evaluation/selectAllSetMealInfo',
          data: {
            shopId: '',
            typeForSetMeal: itemType,
            pageIndex: pageNum,
            pageSize: that.data.pageSize,
          },
          method: "POST",
          header: {
            'content-type': 'application/json'
          },
          success: res => {
            console.log(res);
            if (res.data.result == 0) {
              that.setData({
                comboRefresh: false
              })
            } else {
              pageNum = Number(that.data.pageIndex2) + 1;
              for (const x of res.data.selectResult) {
                if(x.useTimeType){
                  let usefulDate = x.useTimeType
                  if(usefulDate.substr(usefulDate.length-1 , 1) == ','){
                    usefulDate = usefulDate.substr(0,usefulDate.length-1)
                  }
                var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5','3,4','4,5,6,7','4,5,6', '4,5', '5,6,7', '5,6', '6,7']
                if (shit.indexOf(usefulDate) != -1) {
                  var day = usefulDate.substring(0, 1).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六') + ' 至 星期' + usefulDate.substring(usefulDate.length - 1, usefulDate.length).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六').replace('7', '日')
                  x.useTimeType = '星期' + day + ' 可用'
                } else {
                  usefulDate = usefulDate.split(',')
                  var day = ''
                  if (usefulDate.indexOf('1') != -1) {
                    day += '一、'
                  }
                  if (usefulDate.indexOf('2') != -1) {
                    day += '二、'
                  }
                  if (usefulDate.indexOf('3') != -1) {
                    day += '三、'
                  }
                  if (usefulDate.indexOf('4') != -1) {
                    day += '四、'
                  }
                  if (usefulDate.indexOf('5') != -1) {
                    day += '五、'
                  }
                  if (usefulDate.indexOf('6') != -1) {
                    day += '六、'
                  }
                  if (usefulDate.indexOf('7') != -1) {
                    day += '日、'
                  }
                  x.useTimeType = '星期' + day.substring(0, day.length - 1) + '可用'
                }
                }
                ListB.push(x);
              }
              that.setData({
                pageIndex2: pageNum,
                comboList: ListB,
              })
            }
          }
        })
        break;
      case 2:
        pageNum = that.data.pageIndex3;
        ListC = that.data.couponList;
        //TODO 优惠券样式
        wx.request({
          url: app.globalData.getCouponAllPage_url,
          data: {
            shopId: '',
            pageSize: that.data.pageSize,
            pageIndex: pageNum,
          },
          success: res=>{
            if(res.data.paramsList.length == 0){
              that.setData({
                couponRefresh: false
              })
            }else{
              for (const x of res.data.paramsList) {
                if(x.coupon_ruleweekstar){
                  let usefulDate = x.coupon_ruleweekstar
                  if(usefulDate.substr(usefulDate.length-1 , 1) == ','){
                    usefulDate = usefulDate.substr(0,usefulDate.length-1)
                  }
                var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5','3,4','4,5,6,7','4,5,6', '4,5', '5,6,7', '5,6', '6,7']
                if (shit.indexOf(usefulDate) != -1) {
                  var day = usefulDate.substring(0, 1).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六') + ' 至 周' + usefulDate.substring(usefulDate.length - 1, usefulDate.length).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六').replace('7', '日')
                  x.coupon_ruleweekstar = '周' + day + ' 可用'
                } else {
                  usefulDate = usefulDate.split(',')
                  var day = ''
                  if (usefulDate.indexOf('1') != -1) {
                    day += '一、'
                  }
                  if (usefulDate.indexOf('2') != -1) {
                    day += '二、'
                  }
                  if (usefulDate.indexOf('3') != -1) {
                    day += '三、'
                  }
                  if (usefulDate.indexOf('4') != -1) {
                    day += '四、'
                  }
                  if (usefulDate.indexOf('5') != -1) {
                    day += '五、'
                  }
                  if (usefulDate.indexOf('6') != -1) {
                    day += '六、'
                  }
                  if (usefulDate.indexOf('7') != -1) {
                    day += '日、'
                  }
                  x.coupon_ruleweekstar = '周' + day.substring(0, day.length - 1) + '可用'
                }
                }
                x.coupon_validityend = utils.formatTime3(x.coupon_validityend,'Y-M-D')
                x.coupon_facevalue = utils.toFix(x.coupon_facevalue)
                ListC.push(x)
              }
              pageNum = Number(that.data.pageIndex3) + 1;
              that.setData({
                pageIndex3: pageNum,
                couponList: ListC
              })
            }
          }
        })
        break;
      case 3:
        pageNum = that.data.pageIndex4;
        itemType = 4;
        ListD = that.data.drinksList;
        break;
      default:
        break;
    }
  },

  closePosterWindow(){
    let that = this
    that.setData({
      showPoster: !that.data.showPoster,
      loadImagePath2: '',
      loadImagePath: '',
      currentPoster: ''
    })
    switch(that.data.chooseIndex){
      case 0:
         that.setData({
           foodList: [],
           pageIndex1: 0,
         },()=>{
          that.getList()
        })
        break;
      case 1:  
          that.setData({
            comboList: [],
            pageIndex2: 0,
          },()=>{
          that.getList()
        })
        break;
      case 2: 
        that.setData({
          couponList: [], 
          pageIndex3: 0,
        },()=>{
          that.getList()
        })
        break;
      case 3: 
        that.setData({
          drinksList: [], 
          pageIndex4: 0,
        },()=>{
          that.getList()
        })
        break;
    }
   
  },

  showBigImage(){
    let that = this
    let arr = []
    arr.push(that.data.loadImagePath)
    wx.previewImage({
      urls: arr,
    })
  },

  onShare(e) {
    console.log("进来了",e);
    let that = this
    let item = e.detail.currentTarget.dataset.item
    let page = 'pages/module_discount/pages/Package_details/Package_details'
    let id = e.detail.currentTarget.dataset.id
    let i = e.detail.currentTarget.dataset.indexshare
    wx.request({
      url: app.globalData.getImageCode_url + '?page=' + page + '&a=a=' + (id == 0 ? item.setMealID : item.coupon_id) + '&version=' + app.globalData.QRCodeVersion + '&b=b='+ id +'&c=c=' + app.globalData.customerInf.id,
      method: "POST",
      responseType: 'arraybuffer',
      success: res =>{
        const fsm = wx.getFileSystemManager();
        const fileName = wx.env.USER_DATA_PATH + '/share_img.jpeg';
        fsm.writeFile({//获取到的数据写入临时路径
          filePath: fileName,//临时路径
          encoding: 'binary',//编码方式，二进制
          data: res.data,//请求到的数据
          success: res => {
            console.log(res)
            console.log(fileName)//打印路径
            that.setData({
              loadImagePath2: fileName,
            },() => {
              if (that.waitImage) {
                that.waitImage(true)
              }
            });
          },
        })
      }
    })
    wx.showLoading({
      title: '正在加载...',
      mask:true
    })
    let isPic = id == 0 ? !item.posterUrl : !item.share_url
    if(isPic){
      wx.showModal({
        title:'提示',
        content: '该超值优惠暂无海报!',
        showCancel: false
      })
      wx.hideLoading({
        success: (res) => {},
      })
      return;
    }else{
      wx.request({
        url: app.globalData.addShareNum_url,
        data: {
            shareId: id == 0 ? item.setMealID : item.coupon_id,
            isCombo: id,
        },
        success: res => {

        }
    })
    }
    that.setData({
        spawnSetMealID: id == 0 ? item.setMealID : item.coupon_id,
        showPoster: !that.data.showPoster,
        currentPoster: id == 0 ? item.posterUrl : item.share_url
    })
    wx.createSelectorQuery()
      .select('#canvas')
      .fields({
        node: true,
        size: true,
      })
      .exec(that.init.bind(that))

  },
  init(res) {
    let that = this
    const width = res[0].width
    const height = res[0].height
    this.setData({
      canvas: res[0].node
    })
    const canvas = res[0].node
    const ctx = canvas.getContext('2d')
    const dpr = wx.getSystemInfoSync().pixelRatio
    canvas.width = width * dpr
    canvas.height = height * dpr
    ctx.scale(dpr, dpr)
    that.drawBackground().then(function(){
      that.drawQRCode().then(function(){
        wx.canvasToTempFilePath({
          x: 0,
          y: 0,
          width: 621 * wx.getSystemInfoSync().pixelRatio,
          height: 1104 * wx.getSystemInfoSync().pixelRatio,
          destWidth: 621,
          destHeight: 1104,
          canvas: that.data.canvas,
          success: function(res) {
            console.log(res)
            that.setData({
              loadImagePath: res.tempFilePath,
            });
            wx.hideLoading({
              success: (res) => {},
            })
          },
          fail: res => {
            console.log(res)
            wx.hideLoading({
              success: (res) => {},
            })
          }
        })
      })
    })
  },
  drawQRCode(){
    const that = this
    const canvas = this.data.canvas
    const ctx = canvas.getContext('2d')
    const img2 = canvas.createImage()
    return new Promise(function (resolve, reject) {
      that.waitImage = (bool) => {
        if (bool) {
          img2.src = that.data.loadImagePath2
          
            img2.onload = () => {
              ctx.drawImage(img2, 500, 990, 100, 100)
              resolve()
            }
        }
      }
    })
  },
  drawBackground(){
    const that = this
    const canvas = this.data.canvas
    const ctx = canvas.getContext('2d')
    const img = canvas.createImage()
    img.src = that.data.currentPoster
    return new Promise(function (resolve, reject) {
      img.onload = () => {
        ctx.drawImage(img, 0, 0, 621, 1104)
        resolve()
      }
    })
  },
  

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (e) {
  },

  //预览照片
  photo: function (e) {
    var arry = []
    var img = e.currentTarget.dataset.bigimage
    img = img.replace('\r\n', '')
    arry.push(img)
    wx.previewImage({
      urls: arry,
      success: function (res) {}
    })
  },

  //看视频
  video_play: function (e) {
    var that = this;
    console.log(e)

    let testurl = e.currentTarget.dataset.src.replace("mb", "test");
    if (e.currentTarget.dataset.src != '') {
      console.log("播放视频")
      that.setData({
        video_open: true,
        video_src: testurl,
        video_name: e.currentTarget.dataset.video_name
      })
    }
  },

  closeWindow_video() {
    this.setData({
      video_open: false,
    })
  }
})