const app = getApp();

// pages/service/service.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    shop_id: '',
    service_items: [],
    shop_address: '',
    shop_name: '',
    area: '',
    landmark_id: '',
    scroll_height: '',
    shop_photo: [],
    shop_photox: [],
    parking_photo: [],
    parking_photox: [],
    dishesx_photo: [],
    dishesx_photox: [],
    wifiName: "",
    wifiPW: "",
    xiayige: true,
    xiugaibaocun: false,

    hiddenDel: false,
    hiddenUp: true,
    hiddenUpImg: false,
    hidden: true,

    hiddenDel2: false,
    hiddenUp2: true,
    hiddenUpImg2: false,
    hidden2: true,

    hiddenDel3: false,
    hiddenUp3: true,
    hiddenUpImg3: false,
    hidden3: true,
    array: [],
    landmarkValue: '',
    meterValue: '',
    specialtyValue: '',
    specialty: '',
    landmark_idValue: '',
    items: [
      {
        value: '早茶',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/ll1.png'
      },
      {
        value: '午餐',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/ll2.png'
      },
      {
        value: '下午茶',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/ll3.png'
      },
      {
        value: '晚餐',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/ll4.png'
      },
      {
        value: '夜市',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/ll5.png'
      },
      {
        value: '外卖',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/ll6.png'
      },
    ],
    serverList: [],
    serviceList: [],
    serviceItems: [
      {
        value: '切瓜切菜',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/l9.png'
      },
      {
        value: '自助点餐',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/l5.png'
      },
      {
        value: '大型宴会',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/l4.png'
      },
      {
        value: '微信支付',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/l8.png'
      },
      {
        value: '支付宝',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/l7.png'
      },
      {
        value: '刷卡',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/l11.png'
      }, {
        value: '儿童乐园',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/l1.png'
      },
      {
        value: '宠物托管',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/l2.png'
      },
      {
        value: '充电宝',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/l3.png'
      },
      {
        value: '充电线',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/l6.png'
      },
      {
        value: '无烟区　',
        img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/shop_service/l10.png'
      },
    ],
    hardFacilities: [{
      value: '大中小厅',
      img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/e2d427621e0c96caf662389013636c7.png'
    }, {
      value: '灯光舞台',
      img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/345219662e46cc1fe4d780d3b1663fd.png'
    }, {
      value: '大屏幕',
      img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/f7c13ef67299e04f3378cbdfee0f0f6.png'
    }, {
      value: '大包房',
      img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/948f3c9295a8aaee3a7f8c5df440ef9.png'
    }, {
      value: '特大包房',
      img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/948f3c9295a8aaee3a7f8c5df440ef9.png'
    },],
    hotelStructure: [{
      value: '平房',
      img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/97de0c1819fe1a0a9bc2c64e20361d1.png'
    }, {
      value: '地下',
      img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/be107a5b73c295d1f6527decae92af7.png'
    }, {
      value: '',
      img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/11758ce9f94deb124d6a799edc6cc1a.png'
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    let windowHeight = wx.getSystemInfoSync().windowHeight // 屏幕的高度
    let windowWidth = wx.getSystemInfoSync().windowWidth // 屏幕的宽度
    this.setData({
      scroll_height: windowHeight * 750 / windowWidth - 300
    })
    that.setData({
      videoList1: [],
      videoList2: [],
      videoList3: [],
      area: app.globalData.shopdetail.area,
      shop_name: app.globalData.shopdetail.shop_name,
      shop_address: app.globalData.shopdetail.shop_address,
      shop_id: app.globalData.shopdetail.shop_id,
      hiddenDel: false,
      hiddenUp: true,
      hiddenUpImg: false,
      hidden: true,

      hiddenDel2: false,
      hiddenUp2: true,
      hiddenUpImg2: false,
      hidden2: true,

      hiddenDel3: false,
      hiddenUp3: true,
      hiddenUpImg3: false,
      hidden3: true,
      array: [],
      specialty: '',
      listIndex: 1000000,
      specialtyValue: '',
      landmark_idValue: '',
      shop_photo: [],
      shop_photox: [],
      wifiName: "",
      wifiPW: "",
      parking_photo: [],
      parking_photox: [],
      dishesx_photo: [],
      dishesx_photox: [],
      items: that.data.items,
      serviceItems: that.data.serviceItems
    })
    wx.setNavigationBarTitle({ //设置标题名字
      title: that.data.shop_name,
    })
    wx.request({ //服务信息回显
      url: app.globalData.SelectServeServlet_url,
      data: {
        shop_id: that.data.shop_id
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      method: 'POST',
      success: function (res) {
        let serverStr = res.data[0].service_items;
        let newList = serverStr.split(",");
        let serverList = [];
        let serviceList = [];
        let hardFacilities = [];
        let hotelStructure = [];

        for (let item1 of that.data.items) {
          for (let item2 of newList) {
            if (item1.value == item2) {
              serverList.push(item1);
            }
          }
        }

        for (let item1 of that.data.serviceItems) {
          for (let item2 of newList) {
            if (item1.value == item2) {
              serviceList.push(item1);
            }
          }
        }

        for (let item1 of that.data.hardFacilities) {
          for (let item2 of newList) {
            if (item1.value == item2) {
              hardFacilities.push(item1);
            }
          }
        }

        for (let item2 of newList) {
          for (let item1 of that.data.hotelStructure) {
            if (item1.value == item2) {
              hotelStructure.push(item1);
            }
          }
          if (item2.indexOf("层楼") != -1) {
            let obj = {
              value: item2,
              img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/11758ce9f94deb124d6a799edc6cc1a.png'
            }
            hotelStructure.push(obj);
          }
        }

        that.setData({
          serverList: serverList,
          serviceList: serviceList,
          hardFacilities: hardFacilities,
          hotelStructure: hotelStructure
        })
      },
    })

    wx.request({ //回显照片
      url: app.globalData.SelectPhoto,
      data: {
        shop_id: that.data.shop_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      method: 'POST',
      success: function (res) {

        if(res.data.result.result != 1){
          wx.showToast({
            title: '查询失败!',
          })
          wx.hideLoading()
          return;
        }

        let videoList1 = [];
        let videoList2 = [];
        let videoList3 = [];

        for (var i = 0; i < res.data.object.length; i++) {
          let data = {
            url: res.data.object[i].value,
            photo_id: res.data.object[i].photo_id,
            type_id: res.data.object[i].type_id
          }
          if (data.type_id == 1) {
            if (res.data.object[i].quyu.indexOf('环境') != -1) {
              that.data.shop_photox.push(data);
            } else if (res.data.object[i].quyu.indexOf('车场') != -1) {
              that.data.parking_photox.push(data);
            } else if (res.data.object[i].quyu.indexOf('菜单') != -1) {
              that.data.dishesx_photox.push(data);
            }
          }else if(data.type_id == 2){
            if (res.data.object[i].quyu.indexOf('环境') != -1) {
              videoList2.push(data);
              that.setData({
                videoList2: videoList2
              })
            } else if (res.data.object[i].quyu.indexOf('车场') != -1) {
              videoList3.push(data);
              that.setData({
                videoList3: videoList3
              })
            } else if (res.data.object[i].quyu.indexOf('菜单') != -1) {
              videoList1.push(data);
              that.setData({
                videoList1: videoList1
              })
            }
          }
        }
        that.setData({
          shop_photox: that.data.shop_photox,
          parking_photox: that.data.parking_photox,
          dishesx_photox: that.data.dishesx_photox,
        })
        if (that.data.shop_photox.length >= 1) {
          that.setData({
            hidden: false
          })
        }
        if (that.data.parking_photox.length >= 1) {
          that.setData({
            hidden2: false
          })
        }
        if (that.data.dishesx_photox.length >= 1) {
          that.setData({
            hidden3: false
          })
        }
      },
    })

    wx.request({ //地标信息回显
      url: app.globalData.SelectLandmarkServlet_url,
      data: {
        shop_id: that.data.shop_id,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
      },
      method: 'POST',
      success: function (res) {
        for (var i = 0; i < res.data.length; i++) {
          that.data.array.push({
            landmark: res.data[i].landmark,
            meter: res.data[i].meter,
            landmark_id: res.data[i].landmark_id
          });
        }
        that.setData({
          array: that.data.array,
        })
      },
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    that.setData({
      shop_address: app.globalData.shop_address,
    })
    this.selectYing()
  },

  selectYing:function(){
    wx.request({
      url: app.globalData.findTableDetail,
      // url: 'http://localhost:8081/evaluation/findTableDetail',
      data:{shopId:app.globalData.shopdetail.shop_id},
      success: res=>{
        console.log(res);
        this.setData({
          wifiName:res.data.params.wifi.wifiName,
          wifiPW:res.data.params.wifi.wifiPW,
          contact_number:res.data.params.wifi.contact_number,
          yingsheshi:res.data.params
        })
      }
    })
  },

  returnBack: function () {
    wx.navigateBack();
  },

  showImage(e) {
    let that = this;
    let img = e.currentTarget.dataset.image;
    let urlLis = e.currentTarget.dataset.urllist
    let list = [];

    for(let item of urlLis){
      list.push(item.url)
    }

    // wx.previewMedia({
    //   sources: [{
    //     url: img
    //   }],
    // })
    wx.previewImage({
      // current:  app.globalData.path + url, // 当前显示图片的http链接
      current: img,
      urls: list, // 需要预览的图片http链接列表
      success: res=>{
        console.log(1);
      }
    })
  },

  showVideo(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let videoList  = e.currentTarget.dataset.urllist;
    let list = [];
    let obj = {};

    for(let item of videoList){
      obj = {
        url: item.url,
        type: 'video',
      }
      list.push(obj)
    }

    wx.previewMedia({
      sources: list,
      current: index
    })
  }
})