import {
  $wuxFilterBar
} from '../../components/wuxfilterbar'

const appInstance = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {

    facilities: "",

    hidden: false,
    hiddenStore: true,
    rquestFail: true,
    loadcompleted: true,

    isNeaby: false, //是否为附近搜索

    // 城市选择
    cityName: '', //市名
    countyName: '', //县名
    areaName: '祖庙', //区域名
    city: '全部', //显示的城市

    searchValue: '', //需要搜索的字符
    storeNameList: '', //商业区
    longitude: '', //经度
    latitude: '', //维度

    describes: "", //介绍
    per_capita_price: "", //人均
    shop_address: "", //地址
    shop_id: "", //商品ID
    shop_name: "", //商品名称
    shop_type: "", //商品类型
    store_img: "", //图片
    distance: "", //距离

    prices: "", //价格区间

    getInputMin: null, //价格最大值
    getInputMax: null, //价格最小值
    telValueMin: '', //价格最大值
    telValueMax: '', //价格最小值

    result_sum: 0,


    storeNameLists: [],
    star: 0,
    provinceID: '',
    cityID: '',
    countyID: '',
    areaID: "",
    //star,distance,priceAsc,priceDesc,popularity,category,defaultSort,
    sort: "defaultSort",
    minimumPrice: "",
    highestPrice: "",
    serviceItems: "",
    freeLobster: "",
    starNum: 0,

    //区域
    qyopen: false, //点击区域筛选滑动弹窗显示效果，默认不显示
    qyshow: true, //用户点击闭关区域的弹窗设置，默认不显示
    isfull: false,
    cityleft: [],
    citycenter: [],
    cityright: [],

    select1: '',
    select2: '', //区域选择部分的右边
    select3: '全部',
    shownavindex: '',

    // 排序
    tabTxt: ['排序'], //分类
    tab: [true],
    sort_id: 0, //价格
    sort_txt: '',
    condition: 'defaultSort',

    //分页加载
    pageNum: 0, //页数
    totalDataCount: 0,
    dataArray: [],
    pageNumA: 0,

    // 筛选
    items: [{
      type: 'filter',
      label: '筛选',
      value: 'filter',
      children: [{
          type: 'checkbox',
          label: '优惠活动',
          value: 'discount',
          children: [{
            label: '免费大龙虾',
            value: '1',
          }, {
            label: '促销优惠',
            value: '0',
          }, ],
        },
        {
          type: 'checkbox',
          label: '服务',
          value: 'serviceItems',
          children: [{
              label: '线上支付',
              value: '线上支付',
            },
            {
              label: '外卖',
              value: '外卖',
            },
            {
              label: '早茶',
              value: '早茶',
            },
            {
              label: '下午茶',
              value: '下午茶',
            },
            {
              label: '夜市',
              value: '夜市',
            },
            {
              label: '自助餐',
              value: '自助餐',
            },
          ],
        },
        {
          type: 'checkbox',
          label: '设施',
          value: 'facilities',
          children: [{
              label: '豪华包房',
              value: '豪华包房',
            },
            {
              label: '宴会厅',
              value: '宴会厅',
            },
            {
              label: '停车场',
              value: '停车场',
            },
            {
              label: '充电宝',
              value: '充电宝',
            },
            {
              label: 'wifi',
              value: 'wifi',
            },
          ],
        },
        {
          type: 'radio',
          label: '价格',
          value: 'prices',
          children: [{
              label: '50以下',
              value: '0,50',
            },
            {
              label: '50-100',
              value: '50,100',
            },
            {
              label: '100-300',
              value: '100,300',
            },
            {
              label: '300-500',
              value: '300,500',
            },
            {
              label: '500以上',
              value: '500,',
            },
          ],
        },

      ],
      groups: ['001', '002', '003'], //判断元素是否同组
    }, ],
  },

  errImage(e){
    let that = this 
    let index = e.currentTarget.dataset.index
    let storeNameLists = that.data.storeNameLists
    storeNameLists[index].shop_img = ''
    that.setData({
        storeNameLists: storeNameLists
    })
  },

  // 排序
  filterTab: function(e) {
    var data = [true],
      index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data,
      qyopen: false,
      qyshow: true,
      isfull: false,
      shownavindex: 0,
    })
  },

  //排序点击操作
  filter: function(e) {
    var self = this,
      id = e.currentTarget.dataset.id,
      txt = e.currentTarget.dataset.txt,
      condition = e.currentTarget.dataset.condition,
      tabTxt = this.data.tabTxt;
    switch (e.currentTarget.dataset.index) {
      case '0':
        tabTxt[0] = txt;
        self.setData({
          // tab: [true],
          tabTxt: tabTxt,
          sort_id: id,
          condition: condition,
          sort_txt: txt
        });
        break;
    }
    console.log('排序选择的是：' + typeof tabTxt + ' ' + typeof condition + ' ' + typeof id + ' ' + typeof txt)
    //数据排序筛选
    // self.getDataList();
  },

  reset: function(e) {
    var that = this;

    that.setData({
      sort_id: "0",
      tabTxt: ['排序'],
      sort_txt: '',
      condition: "defaultSort",

    })
    console.log('排序选择的是：' + that.data.tabTxt + ' ' + that.data.condition + ' ' + that.data.id + ' ' + that.data.txt)
  },

  submit: function(e) {
    var self = this;
    self.getDataList();
    self.setData({
      tab: [true],

    })
  },


  //加载数据
  getDataList: function(e) {
    //调用数据接口，获取数据
    var that = this
    console.log(that.data.condition)
    this.setData({
      qyopen: false,
      qyshow: true,
      isfull: false,
      shownavindex: 0,

      sort: that.data.condition,
      pageNum: 0,
      storeNameLists: [], //再次查询清空缓存

      hidden: !that.data.hidden,
      hiddenStore: true,
      loadcompleted: true,


    })
    if (that.data.isNeaby) {
      that.selectNearby();
    } else {
      that.select();
    }
  },

  // 区域列表下拉框是否隐藏
  listqy: function(e) {
    if (this.data.qyopen) {
      this.setData({
        qyopen: false,
        qyshow: true,
        isfull: false,
        loadcompleted: true,
        shownavindex: 0
      })
    } else {
      this.setData({
        qyopen: true,
        qyshow: false,
        isfull: true,
        loadcompleted: true,
        shownavindex: e.currentTarget.dataset.nav,
        tab: [true]
      })
    }

  },

  // 区域最左边选择省
  selectLefts(e){
    console.log(e);
    this.setData({
      select0: e.target.dataset.province,
      select1: '',
      select2: '',
      select3: '',
      provinceName: e.target.dataset.province,
      provinceID: e.target.dataset.id.toString(),
      city: e.target.dataset.province,
      provinceCode: e.target.dataset.provincecode,
      cityID: '',
      countyID: '',
      areaID: '',
      citycenter: [],
      cityright: [],
    });
    this.selectCity();
  },

  // 区域左边选择内容
  selectleft: function(e) {
    console.log('选中市：' + e.target.dataset.city + '城市索引：' + e.target.dataset.id);
    this.setData({

      //select1、2与countyName与areaName不是重复多余，是为了解决页面显示与查询的冲突
      select1: e.target.dataset.city,
      cityright: {},
      cityName: e.target.dataset.city,
      cityID: e.target.dataset.id.toString(),
      city: e.target.dataset.city,
      countyID: '', //清空缓存
      countyName: '',
      areaID: '',
    });
    this.selectCounty();
  },

  // 区域中间栏选择的内容
  selectcenter: function(e) {
    console.log('选中市区：' + e.target.dataset.city);
    this.setData({
      select2: e.target.dataset.city,
      countyName: e.target.dataset.city,
      countyID: e.target.dataset.id.toString(),
      city: e.target.dataset.city,
      areaID: '',
      areaName: '',
      select3: '',
    });
    this.selectArea();
  },

  // 区域右边栏选择的内容
  selectright: function(e) {
    console.log('选中商业区：' + e.target.dataset.city);
    this.setData({
      select3: e.target.dataset.city,
      // countyName: e.target.dataset.city,
      // countyID: e.target.dataset.id.toString(),
      city: e.target.dataset.city,
      areaID: e.target.dataset.id.toString(),
    });
  },



  // 区域清空筛选项
  quyuEmpty: function() {
    var that = this;
    this.setData({
      select1: '',
      select2: '',
      select3: '',
      cityright: {},
      citycenter: {},
      city: '全部',
      cityName: appInstance.globalData.defaultCity,
      countyName: '',
      countyID: '',
      areaID: '',

    })
  },

  // 区域选择筛选项后，点击提交
  submitFilter: function(e) {
    var that = this
    console.log('选择的市区索引是：' + this.data.cityID);
    console.log('选择的地区索引是：' + this.data.countyID);
    console.log('选择的商业区索引是：' + this.data.areaID);

    if(this.data.cityID != '' && this.data.countyID != ''){
      that.setData({
        qyopen: false,
        qyshow: true,
        isfull: false,
        shownavindex: 0,
        cityID: this.data.cityID,
        countyID: this.data.countyID,
        areaID: this.data.areaID,
        hidden: !that.data.hidden,
        pageNum: 0,
        storeNameLists: [], //再次查询清空缓存
        hiddenStore: true,
      })
      that.select();
    }else{
      wx.showModal({
        title: '提示',
        content: '请选择市或区/县'
      })
    }
  },


  closeOther: function() {
    this.setData({
      qyopen: false,
      qyshow: true,
      isfull: false,
      loadcompleted: true,
      shownavindex: 0,
      tab: [true]
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this;

    this.setData({
      cityID: appInstance.globalData.defaultCityID,
      countyID: appInstance.globalData.defaultCountyID
    })

    // 搜索 && options.searchValue
    if (options.searchValue != "" && options.searchValue != "undefined") {
      // 搜索时间
      // var sendBefore = new Date();
      // console.log(sendBefore.getSeconds() + ":" + sendBefore.getMilliseconds());
      if (options.searchValue == '附近') {
        console.log('查询附近的商铺')
        that.setData({
          text: '',
          cityName: appInstance.globalData.defaultCity,
          countyName: appInstance.globalData.defaultCounty,
          searchValue: '',
          sort: "distance",
        });
        that.select();
      } else {
        that.setData({
          text: options.searchValue,
          cityName: appInstance.globalData.defaultCity,
          countyName: appInstance.globalData.defaultCounty,
          searchValue: options.searchValue,
        });
        console.log('你搜索的的是：' + that.data.text)
        that.select();
      }
    } else if (options.searchValue == "" || options.searchValue == "undefined") {
      // 当搜索栏为空的时候，就查询定位位置的市区店铺
      that.setData({
        text: '',
        cityName: appInstance.globalData.defaultCity,
        countyName: appInstance.globalData.defaultCounty,
        sort: "distance",
      });
      that.select();
    }


    this.$wuxFilterBar = $wuxFilterBar.init({
      items: this.data.items,
      onChange: (checkedItems, data, items) => {
        console.log(this, checkedItems, items)
        const params = {}
        checkedItems.forEach((n) => {
          if (n.value === 'filter') {
            console.log("选中的标题内容为：" + n.value);
            n.children.filter((n) => n.selected).forEach((n) => {
              if (n.value === 'discount') {
                console.log("选中的优惠内容为：" + n.value);
                const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
                params.discount = selected;
                console.log("选中的优惠内容为：" + params.discount);

              } else if (n.value === 'serviceItems') {
                console.log("选中的服务内容为：" + n.value);
                const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(',')
                params.serviceItems = selected;
                console.log("选中的服务项目为：" + params.serviceItems);

              } else if (n.value === 'facilities') {
                console.log("选中的设施内容为：" + n.value);
                const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(',')
                params.facilities = selected;
                console.log("选中的设施内容为：" + params.facilities);

              } else if (n.value === 'prices') {
                console.log("选中的价格区间为：" + n.value);
                const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(',')
                params.prices = selected;
                var arr = params.prices;
                var newarr = arr.split(",");
                params.prices = newarr;
                console.log("选中的价格区间为：" + params.prices);
              }
            })
          }
        })
        that.data.freeLobster = that.data.freeLobster ? "1" : "";
        that.data.facilities = params.facilities ? params.facilities : "";
        that.data.serviceItems = params.serviceItems ? params.serviceItems : "";

        that.data.minimumPrice = params.prices ? params.prices[0] : "";
        that.data.highestPrice = params.prices ? params.prices[1] : "";

        // if (params.prices!=null) {
        //   that.data.minimumPrice = params.prices[0];
        //   that.data.highestPrice = params.prices[1];
        // };
        that.setRepos();
      },

    })
  },

  setRepos() {
    var that = this
    console.log('排序操作');
    that.setData({
      qyopen: false,
      qyshow: true,
      isfull: false,
      shownavindex: 0,
      hidden: !that.data.hidden,
      pageNum: 0,
      storeNameLists: [], //再次查询清空缓存

      hiddenStore: true,
    })
    that.select();
  },





  //-------------------------------------------------========================================
  // selectMore: function(e) {
  //   // 上拉加载更多
  //   var that = this

  //   var pageNum = that.data.pageNum; // 加载当前页面的下一页数据
  //   if (pageNum < 10) {
  //     pageNum += 1
  //   } else {
  //     that.setData({
  //       loadcompleted: false,
  //     })
  //     return -1;
  //   }
  //   var tips = "加载更多内容！";
  //   console.log("load page" + (pageNum + 1));
  //   that.setData({
  //     pageNum: pageNum,
  //   })

  //   var pageNumS = pageNum.toString();

  //   var object = {
  //     "keyWord": that.data.text,
  //     "cityID": that.data.cityID,
  //     "countyID": that.data.countyID,
  //     "areaID": that.data.areaID,
  //     "longitude": appInstance.globalData.myLongitude.toFixed(10),
  //     "latitude": appInstance.globalData.myLatitude.toFixed(10),
  //     "cityIDResult": appInstance.globalData.cityIDResult,
  //     "sort": that.data.sort,
  //     "minimumPrice": that.data.minimumPrice,
  //     "highestPrice": that.data.highestPrice,
  //     "facilities": that.data.facilities,
  //     "serviceItems": that.data.serviceItems,
  //     "freeLobster": that.data.freeLobster,
  //     "pageNum": pageNumS,
  //   }

  //   wx.showLoading({
  //     title: tips,
  //   })

  //   //封装自己的网络请求接口，这里作为示例就直接使用了wx.request
  //   wx.request({
  //     url: appInstance.globalData.allUrl.defaultStoreSelect,

  //     data: JSON.stringify(object),

  //     header: {
  //       'contentType': 'application/x-www-form-urlencoded;charset=utf-8',
  //     },
  //     dataType: 'json',
  //     method: 'POST',

  //     success: function(res) {

  //       console.log(JSON.stringify(object));
  //       // 搜索记录所用时间用
  //       // var sendAfter = new Date();
  //       // console.log(sendAfter.getSeconds() + ":" + sendAfter.getMilliseconds());
  //       wx.hideLoading();
  //       var isnull = (Object.getOwnPropertyNames(res.data.shopDetailResultMap).length === 0)

  //       var storeNameList = res.data.shopDetailResultMap;
  //       var oldStoreNameLists = that.data.storeNameLists;
  //       var newStoreNameList = oldStoreNameLists.concat(storeNameList);

  //       console.log(typeof oldStoreNameList + ' ' + typeof storeNameLists);
  //       console.log(newStoreNameList)

  //       if (isnull) {
  //         console.log('所有数据加载完了')
  //         that.setData({
  //           // hiddenStore: false,
  //           loadcompleted: false,
  //         })
  //       } else if (that.data.loadcompleted == true) {
  //         // for(let i in newStoreNameList[0]){
  //         //   if(newStoreNameList[0][i].store_img == ""){
  //         //     newStoreNameList[0][i].store_img = "https://mb.fsmbdlkj.com/WX%20Restaurant/door_photo_img/1.jpg"
  //         //   }
  //         // }
  //         that.setData({
  //           storeNameLists: newStoreNameList,
  //           pageNum: pageNum,

  //           hiddenStore: true,
  //           loadcompleted: true,
  //         })
  //         that.resultSum();
  //       }

  //       console.log('第' + pageNum + '页');
  //       var last = new Date();

  //       // console.log(last.getSeconds() + ":" + last.getMilliseconds());

  //     },
  //     fail: function() {
  //       console.log('失败啦')
  //       that.setData({
  //         rquestFail: false,
  //       })
  //     },

  //   })
  // },

  //关键字查询
  select: function(e) {
    // 第一次加载
    wx.showLoading({
      title: '请稍后...',
      mask: true
    })
    console.log(appInstance.globalData.myLongitude)
    console.log(appInstance.globalData.myLatitude)
    var that = this;
    var object = {
      "keyWord": that.data.text,
      "cityID": appInstance.globalData.cityCode,
      "countyID": that.data.countyID,
      "areaID": that.data.areaID,
      "sort": that.data.sort,
      "longitude": appInstance.globalData.myLongitude,
      "latitude": appInstance.globalData.myLatitude,
      "cityIDResult": appInstance.globalData.cityIDResult,
      "minimumPrice": that.data.minimumPrice,
      "highestPrice": that.data.highestPrice,
      "facilities": '',
      "serviceItems": that.data.facilities,
      "freeLobster": that.data.freeLobster,
      "pageNum": that.data.pageNum,
    }

    wx.request({
    //   url:'http://localhost:8087/WX Restaurant/GetQgqcKeyWordQueryShopFrom',
      url: appInstance.globalData.allUrl.defaultStoreSelect,

      data: JSON.stringify(object),
      dataType: 'json',

      //这里接口返回的数据是什么类型，直接解析数据
      header: {
        'contentType': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      method: 'POST',
      success: function(res) {
        console.log(res,"搜索店铺的结果");
        if(res.data.object != null){
          var storeNameList = res.data.object;
          var oldStoreNameLists = that.data.storeNameLists;
          var newStoreNameList = oldStoreNameLists.concat(storeNameList)

          if(storeNameList.length == 0){
            that.setData({
              hiddenStore: false,
            })
            wx.hideLoading({
              success: (res) => {},
            })
          }else{
            that.setData({
              storeNameLists: newStoreNameList,
              pageNum: Number(that.data.pageNum)+1,
              hidden: true,
              hiddenStore: true,
            },()=>{
              wx.hideLoading({
                success: (res) => {},
              })
            })
          }
          that.resultSum();

          console.log("第"+that.data.pageNum+"页");
          console.log(newStoreNameList);
        }else{
          wx.showModal({
            title: '提示',
            content: '请重新搜索'
          })
        }
      },
      fail: function() {
        console.log('失败啦')
        that.setData({
          rquestFail: false,
        })
      },
    })
  },

  //查询附近
  selectNearby: function(e) {
    // 第一次加载
    var that = this;

    var object = {
      "countyName": appInstance.globalData.localtionCounty,
      "longitude": appInstance.globalData.myLongitude.toFixed(10),
      "latitude": appInstance.globalData.myLatitude.toFixed(10),
      "pageNum": that.data.pageNum,
      "sort": that.data.sort,
      "minimumPrice": that.data.minimumPrice,
      "highestPrice": that.data.highestPrice,
      "facilities": that.data.facilities,
      "serviceItems": that.data.serviceItems,
      "freeLobster": that.data.freeLobster,
    }

    wx.request({
      url: appInstance.globalData.allUrl.defaultShopNearby,

      data: JSON.stringify(object),
      dataType: 'json',

      //这里接口返回的数据是什么类型，直接解析数据
      header: {
        'contentType': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      method: 'POST',
      success: function(res) {
        var isnull = (Object.getOwnPropertyNames(res.data.shopDetailResultMap).length === 0)
        var storeNameList = res.data.shopDetailResultMap;
        var oldStoreNameLists = that.data.storeNameLists;
        var newStoreNameList = oldStoreNameLists.concat(storeNameList)

        if (isnull) {
          console.log('附近没有店铺')
          that.setData({
            storeNameLists: [],
            hidden: true,
            hiddenStore: false,
            loadcompleted: true,
          })

        } else {
          that.setData({
            storeNameLists: newStoreNameList,
            pageNum: Number(that.data.pageNum)+1,
            hidden: true,
            hiddenStore: true,
          })
          that.resultSum()
        }

        console.log('第' + that.data.pageNum + '页');
        console.log(newStoreNameList);
      },
      fail: function() {
        console.log('失败啦')
        that.setData({
          rquestFail: false,
        })
      },
    })

  },

  // selectNearbyMore: function(e) {
  //   // 上拉加载更多
  //   var that = this

  //   var pageNum = that.data.pageNum; // 加载当前页面的下一页数据
  //   if (pageNum < 10) {
  //     pageNum += 1
  //   } else {
  //     that.setData({
  //       loadcompleted: false,
  //     })
  //     return -1;
  //   }
  //   var tips = "加载更多内容！";
  //   console.log("load page" + (pageNum + 1));
  //   that.setData({
  //     pageNum: pageNum,
  //   })

  //   var pageNumS = pageNum.toString();

  //   var object = {
  //     "countyName": appInstance.globalData.localtionCounty,
  //     "longitude": appInstance.globalData.myLongitude.toFixed(10),
  //     "latitude": appInstance.globalData.myLatitude.toFixed(10),
  //     "pageNum": pageNumS,
  //     "sort": that.data.sort,
  //     "minimumPrice": that.data.minimumPrice,
  //     "highestPrice": that.data.highestPrice,
  //     "facilities": that.data.facilities,
  //     "serviceItems": that.data.serviceItems,
  //     "freeLobster": that.data.freeLobster,
  //   }

  //   wx.showLoading({
  //     title: tips,
  //   })

  //   //封装自己的网络请求接口，这里作为示例就直接使用了wx.request
  //   wx.request({
  //     url: appInstance.globalData.allUrl.defaultShopNearby,

  //     data: JSON.stringify(object),

  //     header: {
  //       'contentType': 'application/x-www-form-urlencoded;charset=utf-8',
  //     },
  //     dataType: 'json',
  //     method: 'POST',

  //     success: function(res) {

  //       console.log(object);
  //       // var sendAfter = new Date();
  //       // console.log(sendAfter.getSeconds() + ":" + sendAfter.getMilliseconds());
  //       wx.hideLoading();
  //       var isnull = (Object.getOwnPropertyNames(res.data.shopDetailResultMap).length === 0)
  //       var storeNameList = res.data.shopDetailResultMap;
  //       var oldStoreNameLists = that.data.storeNameLists;
  //       var newStoreNameList = oldStoreNameLists.concat(storeNameList);

  //       console.log(typeof oldStoreNameList + ' ' + typeof storeNameLists);
  //       console.log(newStoreNameList)

  //       if (isnull) {
  //         console.log('所有数据加载完了')
  //         that.setData({

  //           // hiddenStore: false,
  //           loadcompleted: false,
  //         })

  //       } else if (that.data.loadcompleted == true) {
  //         // for(let i in newStoreNameList[0]){
  //         //   if(newStoreNameList[0][i].store_img == ""){
  //         //     newStoreNameList[0][i].store_img = "https://mb.fsmbdlkj.com/WX%20Restaurant/door_photo_img/1.jpg"
  //         //   }
  //         // }
  //         that.setData({
  //           storeNameLists: newStoreNameList,
  //           pageNum: pageNum,
  //           hiddenStore: true,
  //           loadcompleted: true,
  //         })
  //         that.resultSum();
  //       }

  //       console.log('第' + pageNum + '页');
  //       // var last = new Date();
  //       // console.log(last.getSeconds() + ":" + last.getMilliseconds());

  //     },
  //     fail: function() {
  //       console.log('失败啦')
  //       that.setData({

  //         rquestFail: false,
  //       })
  //     },

  //   })
  // },

  //省
  selectProvince(){
    let that = this;
    wx.request({
      // url: 'http://192.168.8.5:8087/WX Restaurant/getAllProvince',
      url: appInstance.globalData.allUrl.getAllProvince,
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      success: res=>{
        that.setData({
          provinceList: res.data.object
        })
      }
    })
  },

  // 市区
  selectCity: function(e) {
    var that = this;
    wx.request({
      // url: 'http://192.168.8.5:8087/WX Restaurant/GetAllCityByProvince',
      url: appInstance.globalData.allUrl.defaultQueryCity,
      data: {
        provinceCode: that.data.provinceCode
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      method: 'POST',
      success: function(res) {
        console.log(res,"市区");
        that.setData({
          cityleft: res.data.object
        })
      }
    })
  },

  // 区域
  selectCounty: function(cityID) {
    var that = this;
    var countyObject = {
      "cityID": this.data.cityID
    }

    console.log(JSON.stringify(countyObject))

    wx.request({
      // url: 'https://mb.fsmbdlkj.com/diancanxing/shop/cityIDQueryCounty',
      url: appInstance.globalData.allUrl.defaultQueryCounty,
      data: JSON.stringify(countyObject),
      header: {
        'contentType': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      method: 'POST',
      success: function(res) {
        that.setData({
          citycenter: res.data
        })
        console.log(that.data.citycenter)
      }
    })
  },

  //  商业区 
  selectArea: function(e) {
    var that = this;
    var countyObject = {
      "countyID": that.data.countyID
    }

    console.log(JSON.stringify(countyObject))

    wx.request({
      // url: 'https://mb.fsmbdlkj.com/diancanxing/shop/countyIDQueryArea',
      url: appInstance.globalData.allUrl.defaultQueryArea,

      data: JSON.stringify(countyObject),
      header: {
        'contentType': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      method: 'POST',
      success: function(res) {
        console.log(res,"cityright");
        that.setData({
          cityright: res.data
        })

      }
    })
  },

  //搜索入口  
  wxSearchTab: function() {
    console.log(111)
    wx.navigateBack({
      url: '../search/search'
    })
    // wx.redirectTo({
    //   url: '../search/search'
    // })
  },
  
  store: function(e) { //没用的
    var that = this
    var StoreID = e.currentTarget.dataset.id 
    let arr = wx.getStorageSync('ResentStoreID') || [];
    for (let i in arr) {
      if (arr[i] == StoreID) {
        arr.splice(i, 1);
      }
    }
    arr.unshift(e.currentTarget.dataset.id)
    if (arr.length > 6) {
      arr.splice(-1, 1);
    }

    try {
      wx.setStorage({
        key: 'ResentStoreID',
        data: arr
      })
      console.log("arr,{}", arr);
      wx.setStorage({
        key: 'ResentStoreID',
        data: arr
      })

    } catch (e) {

    }
    appInstance.globalData.shopid = e.currentTarget.dataset.id
    appInstance.getManagementDataServlet() //获取店铺设置信息
    wx.navigateTo({
      url: '../index/index',
    })
    this.setData({
      qyopen: false,
      qyshow: true,
      isfull: false,
      shownavindex: 0,
      tab: [true],
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    var that = this;
    that.selectProvince();
  },


  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this
    // 城市选择
    this.setData({
      cityName: appInstance.globalData.defaultCity,
      countyName: appInstance.globalData.defaultCounty,
    })
  },

  resultSum() {
    var that = this
    var sum = 0

    if(that.data.storeNameLists.length!=0){
      var arr = that.data.storeNameLists;
      sum += arr.length;
      that.setData({
        result_sum: sum
      })
    }else{
      that.setData({
        result_sum: 0
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {
    this.select();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }

})