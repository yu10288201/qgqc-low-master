// pages/package_details/package_details.
const QRCode = require("../../../../utils/weapp-qrcode.js")
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dishes_index:-1,
    constituteTypeList_Fix:[],//固定列表
    constituteTypeList_Select:[],//选择列表
    
    ruleID:0,//使用规则
    is_video_show:app.globalData.is_video_show,
    shareCardInf: '',
    video_url: '',
    poster_url: '',
    shareImageDetail1: '',
    currentBlockColor: "#000000",
    blockColor: "#000000",
    colorGamut:"-webkit-linear-gradient(left, #ffffff 0%, #ff0000 100%)",
    colorGray:"-webkit-linear-gradient(left, #000000 0%, #ffffff 100%)",
    colorGamutTip:"#ff0000",
    colorGrayTip:"#ffffff",
    colorValue:0,
    colorGamutValue:0,
    colorGrayValue:0,
    showIndex: 0,
    shareContent: '',
    temporaryImage: '',
    temporaryVideo: '',
    temporaryImageOfVideo: '',
    loadImagePath: '',
    loadImagePath1: '',
    constituteByOrderIdList: [],
    shareDialog: false,
    shareTimeLineE: '',
    chooseWeek: 2,
    distributionList: '',
    uuid: '',
    ruleid: false,
    transform: 'rotate(0deg)',
    webkitline: 6,
    setMeal: '',
    setMealType: '',
    startData: '',
    endData: '',
    timeList: [],
    file_id: 0,
    id: 0,
    godappraise: -1,
    godappraise1: 6,
    width: parseInt(wx.getSystemInfoSync().windowWidth * 0.94 * 0.96),
    height: parseInt(wx.getSystemInfoSync().windowWidth * 0.94 * 0.96 * 1.3 / 2),
    show_rule: false,
    cusid: '',
    SYB_APPID: '',
    sub_merchants_id: '',
    picture: [{
        img: 'https://ss3.bdstatic.com/70cFv8Sh_Q1YnxGkpoWK1HF6hhy/it/u=3306430909,3982376892&fm=26&gp=0.jpg'
      },
      {
        img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3419315812,2223739414&fm=26&gp=0.jpg'
      },
      {
        img: 'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=4006551618,3513016832&fm=26&gp=0.jpg'
      },
      {
        img: 'https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=1682160878,3531013921&fm=26&gp=0.jpg'
      }
    ],
    setMealTypeList: [{
      id: 0,
      name: '小吃快餐'
    }, {
      id: 1,
      name: '粉面汤粥'
    }, {
      id: 2,
      name: '火锅烧烤'
    }, {
      id: 3,
      name: '生鲜蔬果'
    }, {
      id: 4,
      name: '日韩料理'
    }, {
      id: 5,
      name: '甜品饮品'
    }, {
      id: 6,
      name: '辣味特色'
    }, {
      id: 7,
      name: '自助套餐'
    }, {
      id: 8,
      name: '食品保健'
    }, {
      id: 9,
      name: '生鲜蔬果'
    }, {
      id: 10,
      name: '聚餐宴请'
    }, {
      id: 11,
      name: '海鲜'
    }, {
      id: 12,
      name: '粤菜'
    }, {
      id: 13,
      name: '福建菜'
    }, {
      id: 14,
      name: '山西菜'
    }, {
      id: 15,
      name: '川湘菜'
    }, {
      id: 16,
      name: '江浙菜'
    }, {
      id: 17,
      name: '湖北菜'
    }, {
      id: 18,
      name: '西北菜'
    }, {
      id: 19,
      name: '东北菜'
    }, {
      id: 20,
      name: '京菜鲁菜'
    }, {
      id: 21,
      name: '云贵菜'
    }, {
      id: 22,
      name: '新疆菜'
    }, {
      id: 23,
      name: '台湾菜'
    }, {
      id: 24,
      name: '东南亚菜'
    }, {
      id: 25,
      name: '西餐'
    }, {
      id: 26,
      name: '特色菜'
    }, {
      id: 27,
      name: '其他菜'
    }, ],
    Data: [{
        id: 1,
        name: '一'
      },
      {
        id: 2,
        name: '二'
      },
      {
        id: 3,
        name: '三'
      }, {
        id: 4,
        name: '四'
      },
      {
        id: 5,
        name: '五'
      },
      {
        id: 6,
        name: '六'
      },
      {
        id: 7,
        name: '日'
      }
    ],
    actionSheetItems: [{
        bindtap: 1,
        txt: '星期一',
        id: '一'
      },
      {
        bindtap: 2,
        txt: '星期二',
        id: '二'
      },
      {
        bindtap: 3,
        txt: '星期三',
        id: '三'
      },
      {
        bindtap: 4,
        txt: '星期四',
        id: '四'
      },
      {
        bindtap: 5,
        txt: '星期五',
        id: '五'
      },
      {
        bindtap: 6,
        txt: '星期六',
        id: '六'
      },
      {
        bindtap: 7,
        txt: '星期日',
        id: '日'
      }
    ]
  },
  ruletap: function (e) {
    this.setData({
      ruleid: !this.data.ruleid
    })
    if (this.data.ruleid == true) {
      this.setData({
        transform: 'rotate(180deg)',
        webkitline: 10000,
      })
    } else {
      this.setData({
        transform: 'rotate(0deg)',
        webkitline: 6,
      })
    }
  },                                
  Mealtap: function (e) {
    var that = this
    var dishes_index=this.data.dishes_index;
    wx.navigateTo({
      url: '../package_details_order/package_details_order?setMealID=' + this.data.setMealID + '&id=' + this.data.id + '&shop_id=' + this.data.shop_id+"&dishes_index="+dishes_index,
    })
  },


  bigimg2: function (e) { //查看照片大图                                       
    var that = this;
    var imgBox = []

    imgBox.push(e.currentTarget.dataset.src)
    that.setData({
      imgBox: imgBox
    })
    wx.previewImage({
      current: e.currentTarget.dataset.src, // 当前显示图片的http链接
      urls: imgBox // 需要预览的图片http链接列表
    })
  },
  select: function (e) {
    var that = this
    //console.log(that.data.setMealID)
    wx.request({
      url: app.globalData.selectSetMealInfo_url,
      method: 'POST',
      data: {
        setMealID: that.data.setMealID,
        shop_id: "",
        startUsing: "",
        typeForSetMeal: ''
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res)
        that.data.setMeal = res.data.selectResult
        that.setData({
          setMeal: that.data.setMeal
        })

        console.log("测试：res.data.selectResult")
        console.log(res.data.selectResult)
        if(res.data.selectResult.length>0){
            that.setData({
                ruleID: res.data.selectResult[0].ruleID,
              })

              that.selectRule();
        }

        var week = []
        var usefulDate = res.data.selectResult[0].usefulDate.toString()
        let text = ''
        var shit = ['1,2,3,4,5,6,7', '1,2,3,4,5,6', '1,2,3,4,5', '1,2,3,4', '1,2,3', '1,2', '2,3,4,5,6,7', '2,3,4,5,6', '2,3,4,5', '2,3,4', '2,3', '3,4,5,6,7', '3,4,5,6', '3,4,5', '4,5', '5,6,7', '5,6', '6,7']
        if (shit.indexOf(usefulDate) != -1) {
          var day = usefulDate.substring(0, 1).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六') + ' 至 星期' + usefulDate.substring(usefulDate.length - 1, usefulDate.length).replace('1', '一').replace('2', '二').replace('3', '三').replace('4', '四').replace('5', '五').replace('6', '六').replace('7', '日')
          text = '星期' + day + ' 可用'
        } else {
          var usefulDate = usefulDate.split(',')
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
          text = '星期' + day.substring(0, day.length - 1) + '可用'
        }

        //别人拉屎我也拉，我直接拉一大坨
        //var imgstr = that.data.setMeal[0].pageUrl
        var Data = that.data.setMeal[0].usefulDate
        var time = that.data.setMeal[0].timeForUse

        var s1 = Data.indexOf('~') //找到第一次出现下划线的位置
        var num = 1
        var endnum = 0
        //var imgstrid = 1
        //var imgstrendid = 0
        for (var i of time) {
          if (i == ';') {
            that.data.timeList.push(time.substring(endnum, num - 1))
            endnum = num
          }
          if (num == time.length) {
            that.data.timeList.push(time.substring(endnum, time.length))
          }
          num++
        }
        for (var y = 0; y < that.data.timeList.length; y++) {
          if (y % 2 == 0) {
            that.data.timeList[y] = that.data.timeList[y] + '~'
          } else {
            if (y == that.data.timeList.length - 1) {} else {
              if (y == 3) {
                that.data.timeList[y] = that.data.timeList[y] + '\n'
              } else {
                that.data.timeList[y] = that.data.timeList[y] + '|'
              }
            }
          }
        }
        that.setData({
          imgUrl: that.data.imgUrl,
          startData: Data.substring(0, s1),
          endData: Data.substring(s1 + 1),
          shitWeek: text,
          timeList: that.data.timeList
        })
        for (var x of that.data.setMealTypeList) {
          if (x.id == that.data.setMeal[0].setMealType) {
            that.data.setMealType = x.name
            that.setData({
              setMealType: that.data.setMealType
            })
          }
        }
        for (var t of that.data.Data) {
          if (that.data.startData == t.id) {
            that.setData({
              startData: t.name
            })
          } else if (that.data.endData == t.id) {
            that.setData({
              endData: t.name
            })
          }
        }
        that.selectshop()
      }
    })
  },

  selectConstitute: function (e) {
    var that = this

    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.taocan.select_constitute_url,
      method: 'POST',
      data: {
        setMealID: that.data.setMealID
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res)
        var constituteTypeList = []
        var stituteList = []
        var tapnum = ''
        var num = -1 //类别id
        for (var x of res.data.setmealConstituteUsers) {
          var List = {
            isCheck: false,
            constituteName: "",
            constituteUnit: "",
            constituteNum: "",
            constituteValue: ""
          }
          var TypeList = {
            constituteTypeName: '',
            constituteTypeCount: '',
            choosableCount: '',
            setMealConstituteList: [],
          }
          if (that.data.constituteByOrderIdList) {
            let constituteByOrderIdList = that.data.constituteByOrderIdList
            for (let i of constituteByOrderIdList) {
              if (i.constitute_id == x.constituteID) {
                List.isCheck = true
              }
            }
          }
          List.constituteName = x.constituteName
          List.constituteUnit = x.constituteUnit
          List.constituteNum = x.constituteNum
          List.constituteValue = x.constituteValue
          // 前面添加的类别，如果后面有相同的类，就放到前面那个相同的类里

          if (x.constituteTypeName != tapnum) { //判断前后两个类别是否相等

            var typename = '' //如果有相同的类，把那个类存到typename字段中

            if (tapnum == '') { //存储第一个字段
              TypeList.constituteTypeName = x.constituteTypeName
              TypeList.constituteTypeCount = x.constituteTypeCount
              TypeList.choosableCount = x.choosableCount
              constituteTypeList.push(TypeList)
              num++
              constituteTypeList[num].setMealConstituteList.push(List)
            } else { //如果不是第一个字段
              for (var t of constituteTypeList) {
                if (t.constituteTypeName == x.constituteTypeName) {
                  typename = t //循环判断是否有相同的类别名称
                }
              }
              if (typename != '') { //有相同的类时
                typename.setMealConstituteList.push(List)
              } else {
                TypeList.constituteTypeName = x.constituteTypeName
                TypeList.constituteTypeCount = x.constituteTypeCount
                TypeList.choosableCount = x.choosableCount
                constituteTypeList.push(TypeList)
                num++
                constituteTypeList[num].setMealConstituteList.push(List)
              }

            }
            that.setData({
              constituteTypeList: constituteTypeList
            })
          } else { //前后两个类别相同时
            var typename = ''
            for (var t of constituteTypeList) {
              //console.log(t.constituteTypeName)
              //console.log(x.constituteTypeName)
              if (t.constituteTypeName == x.constituteTypeName) {
                typename = t
              }
            }
            if (typename != '') {
              typename.setMealConstituteList.push(List)
            } else {
              stituteList.push(List)
              constituteTypeList[num].setMealConstituteList.push(List)
            }
            that.setData({
              constituteTypeList: constituteTypeList
            })


            if(constituteTypeList.length>0){

                var constituteTypeList_Fix=[];
                var constituteTypeList_Select=[];

                for(var i=0;i<constituteTypeList.length;i++){
                    var item=constituteTypeList[i];
                    if(item.constituteTypeCount ==-1){
                        constituteTypeList_Fix.push(item);
                    }else{
                        constituteTypeList_Select.push(item);
                    }
                   
                }
                that.setData({
                    constituteTypeList_Fix:constituteTypeList_Fix,
                    constituteTypeList_Select:constituteTypeList_Select,
                })

               
            

            }



          }


          //console.log(x)
          tapnum = x.constituteTypeName
        }
      },
      complete: res => {
        wx.hideLoading()
      }
    })
  },

  selectRule: function (e) {
    var that = this
    //console.log(that.data.setMealID)
    wx.request({
      url: app.globalData.selectRule_url,
      method: 'POST',
      data: {
        ruleID: that.data.ruleID
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        //console.log(res)
        if (res.data.length > 0) {

          var ruleList = ''
          var rule = ''
          rule = res.data[0].ruleContent.substring(0, 112)
          ruleList = res.data[0]
          that.setData({
            ruleList: ruleList,
            rule: rule
          })
        }
      }
    })
  },

  selectshop: function (e) {
    var that = this
    if (that.data.id == 0) {
      var setMealID = that.data.setMealID
      var coupon_id = ''
    } else {
      var setMealID = ''
      var coupon_id = that.data.coupon_id
    }
    wx.request({
      url: app.globalData.selectSetmeal_url,
      method: 'POST',
      data: {
        setMealID: setMealID,
        coupon_id: coupon_id

      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        var shopList = ''
        var shop = []
        for (var x of res.data) {
          if (x.shop_id == that.data.shop_id) {
            shop.push(x)
          }
        }
        console.log(shop)
        shopList = res.data
        var SYB_APPID = shopList[0].syb_APPID
        var cusid = shopList[0].cusid
        var sub_merchants_id = shopList[0].sub_merchants_id
        that.setData({
          shopList: shopList,
          shop: shop,
          SYB_APPID: SYB_APPID,
          cusid: cusid,
          sub_merchants_id: sub_merchants_id
        })
      }
    })
  },
  call: function (e) {
    //console.log(this.data.shop[0].contact_number)
    wx.makePhoneCall({
      phoneNumber: this.data.shop[0].contact_number,
    })
  },
  file: function (e) {
    var that = this
    var index = e.currentTarget.dataset.index
    that.setData({
      file_id: index,
    });
    if (index == 0) {
      that.setData({
        godappraise: -1,
        godappraise1: 6
      })
      that.selectAllEvaluation()
    } else if (index == 1) {
      that.setData({
        godappraise: 3,
        godappraise1: 6,
      })
      that.selectAllEvaluation()
    } else if (index == 2) {
      that.setData({
        godappraise: -1,
        godappraise1: 4,
      })
      that.selectAllEvaluation()
    } else {
      that.selectPicevaluation()
    }
  },
  selectAllEvaluation: function (res) {
    var that = this
    if (that.data.id == 0) {
      var dishes_id = that.data.setMealID
    } else {
      var dishes_id = that.data.coupon_id
    }
    wx.request({
      url: app.globalData.select_evaluation_url,
      data: {
        "shop_id": that.data.shop_id,
        "assess_surport": that.data.godappraise,
        "assess_surport1": that.data.godappraise1,
        "dishes_id": dishes_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          evaluations: res.data
        })
        wx.hideLoading()
      }
    })
  },
  selectPicevaluation: function (res) {
    var that = this
    if (that.data.id == 0) {
      var dishes_id = that.data.setMealID
    } else {
      var dishes_id = that.data.coupon_id
    }
    wx.request({
      url: app.globalData.select_picevaluation_url,
      data: {
        "shop_id": that.data.shop_id,
        "dishes_id": dishes_id
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          evaluations: res.data
        })
      }
    })
  },
  select_numvaluation: function (res) {
    var that = this

    wx.request({
      url: app.globalData.select_numvaluation_url,
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          numvaluation: res.data
        })
      }
    })
  },
  // selectDistributionList(){
  //   let that = this
  //   wx.request({
  //     url: app.globalData.getSettingList,
  //     data:{
  //       uuid: that.data.uuid,
  //     },
  //     success:res=>{
  //       console.log(res.data[0]);
  //       that.setData({
  //         distributionList: res.data[0]
  //       })
  //       that.getShopdetail(res.data[0].shopId)
  //     }
  //   })
  // },
  getShopdetail(shopId) {
    let that = this
    wx.request({
      url: app.globalData.Selectshopid_url,
      data: {
        shop_id: shopId
      },
      method: "POST",
      success: res => {
        console.log(res);
        that.setData({
          shop: res.data
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    app.globalData.is_set_meal_return=true;
    that.setData({
      setMealID: options.setMealID,
      id: options.id,
      dishes_index:Number(options.dishes_index),
      ruleID: options.ruleID,
      coupon_id: options.coupon_id,
      shop_id: options.shop_id,
      uuid: options.uuid
    })

      that.selectConstitute()
      that.select()
      
      that.selectAllEvaluation()
    

    setTimeout(function () {
      //创建节点选择器
      var query = wx.createSelectorQuery();
      query.select('#xxx').boundingClientRect()
      query.exec(function (res) {
        //res就是 所有标签为mjltest的元素的信息 的数组
        //取高度
        if (Math.round((wx.getSystemInfoSync().windowHeight) / (res[0].height)) <= 6) {
          that.setData({
            show_rule: true
          })
        }
      })
    }, 500)
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
    this.setData({
      is_video_show:app.globalData.is_video_show,
    })
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
  onShareAppMessage: function (e) {
    let that = this;
    let item = that.data.CouponList ? that.data.CouponList : that.data.setMeal[0];

    console.log("/pages/package_manage/pages/toqgqc/toqgqc?bind_type=3&bind_shop_id=" + app.globalData.shopDetail.shop_id + "&bind_staf_id=" + app.globalData.staffDetail.id + "&bind_meals_type=" + (item.coupon_id ? 3 : 2) + "&bind_meals_id=" + (item.coupon_id ? item.coupon_id : item.setMealID) + '&bind_person_name=' + app.globalData.staffDetail.name);

    return {
      title: that.data.shareImageTitle ? that.data.shareImageTitle : '推荐一个特有餐品,希望您喜欢',
      imageUrl: that.data.loadImagePath1 ? that.data.loadImagePath1 : 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/coupon_give.png',
      path: "/pages/package_manage/pages/toqgqc/toqgqc?bind_type=3&bind_shop_id=" + app.globalData.shopDetail.shop_id + "&bind_staf_id=" + app.globalData.staffDetail.id + "&bind_meals_type=" + (item.coupon_id ? 3 : 2) + "&bind_meals_id=" + (item.coupon_id ? item.coupon_id : item.setMealID) + '&bind_person_name=' + app.globalData.staffDetail.name + '&id=' + (that.data.shareCardInf ? that.data.shareCardInf.id : -1)
    }
  }
})