// pages/dishes/dishes.js
import { $wuxFilterBar } from '../../../../components/wuxfilterbar'
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSelected: true,
    isSelectedSearchType: true,
    // 城市选择

    searchicon: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/search.png",
    // dianzan: true,


    hidden: false,
    hiddenStore: true,
    rquestFail: true,
    loadcompleted: true,


    // 城市选择
    cityName: app.globalData.defaultCity,
    countyName: app.globalData.defaultCounty,
    areaName: '',
    searchValue: '',

    //菜品
    dishesNameList: '',
    dishesNameLists: [],

    praise_points: "",  //点赞数
    area_name: "",      //商业区
    type_name: "",      //类型
    star: "",           //星星
    distance: "",       //距离
    dishes_img: "",     //图片地址
    dishes_introduce: "", //菜品介绍
    dishes_name: "",    //菜名
    dishes_statu: "",    //菜品状态
    shop_name: "",      //店铺名
    dishes_price: "",   //菜品价格
    commercial_area_id: "",  //商业区ID 
    total: "",          //月销量
    dishes_id: 0,       //菜品ID


    keyWord: "",
    cityID: "",
    countyID: "",
    areaID: "",
    sort: "",
    //category、priceAsc、priceDesc、salesAsc、salesDesc、
    //fabulousAsc、fabulousDesc、dishesName、shop、place
    minimumPrice: "",
    highestPrice: "",
    longitude: "",
    nature: "",
    latitude: "",
    longitude: "",
    birthplace: "",

    result_sum:0,

    pageNum: 0,//页数


    //区域
    city: '全部',
    qyopen: false, //点击区域筛选滑动弹窗显示效果，默认不显示
    qyshow: true, //用户点击闭关区域的弹窗设置，默认不显示
    isfull: false,
    cityleft: {},
    citycenter: {},
    cityright: {},

    cityright: {}, //选择区域的中间内容部分后显示的右边内容
    select1: '',
    select2: '', //区域选择部分的中间
    select3: '全部', //区域选择部分的右边
    shownavindex: '',

    // 排序
    tabTxt: ['排序'],//分类
    tab: [true],
    sort_id: 0,//价格
    sort_txt: '',

    // 筛选
    items: [
      {
        type: 'filter',
        label: '筛选',
        value: 'filter',
        children: [
          {
            type: 'checkbox',
            label: '优惠类型',
            value: 'searchType',
            children: [],
          },
        ],
        groups: ['001', '002', '003'],//判断元素是否同组
      },
    ],
  },

  


  // 排序
  filterTab: function (e) {
    var data = [true], index = e.currentTarget.dataset.index;
    data[index] = !this.data.tab[index];
    this.setData({
      tab: data,
      qyopen: false,
      qyshow: true,
      isfull: false,
      pageNum: 0,
      shownavindex: 0,
    })
  },

  //排序点击操作
  filter: function (e) {
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
    console.log('排序选择的是：' + tabTxt + ' ' + condition)
    //数据排序筛选
    // self.getDataList();
  },
  reset: function (e) {
    var that = this;

    that.setData({
      sort_id: "0",
      sort_txt: '',
      condition: "defaultSort",
      tabTxt: ['排序'],//分类
    })
    console.log('排序选择的是：' + that.data.tabTxt + ' ' + that.data.condition + ' ' + that.data.id + ' ' + that.data.txt)
  },

  submit: function (e) {
    var self = this;
    self.getDataList();
    self.setData({
      tab: [true],
    })
  },

  //加载数据
  getDataList: function (e) {
    //调用数据接口，获取数据
    var that = this

    this.setData({
      qyopen: false,
      qyshow: true,
      isfull: false,
      shownavindex: 0,

      sort: that.data.condition,
      hidden: !that.data.hidden,
      dishesNameLists: [],//再次查询清空缓存
      hiddenStore: true,
      loadcompleted: true,
      isSelected: true,
    },() =>{
      that.select();
    })
  },

  // 区域列表下拉框是否隐藏
  listqy: function (e) {
    if (this.data.qyopen) {
      this.setData({
        qyopen: false,
        qyshow: true,
        isfull: false,
        shownavindex: 0
      })
    } else {
      this.setData({
        qyopen: true,
        qyshow: false,
        isfull: true,
        shownavindex: e.currentTarget.dataset.nav,
        tab: [true]
      })
    }
  },

  // 区域最左边选择省
  selectLefts(e){
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
  selectleft: function (e) {
    console.log('选中市：' + e.target.dataset.city + '城市索引：' + e.target.dataset.id);
    this.setData({

      //select1、2与countyName与areaName不是重复多余，是为了解决页面显示与查询的冲突
      select1: e.target.dataset.city,
      select2: e.target.dataset.city,
      select3: '',
      cityright: {},
      cityName: e.target.dataset.city,
      cityID: e.target.dataset.id.toString(),
      city: e.target.dataset.city,
      countyID: '',
      areaID: '',
      cityright: [],
    });
    this.selectCounty();

  },
  // 区域中间栏选择的内容
  selectcenter: function (e) {
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
  selectright: function (e) {
    console.log('选中商业区：' + e.target.dataset.city);
    this.setData({
      select3: e.target.dataset.city,
      // countyName: e.target.dataset.city,
      // countyID: e.target.dataset.id.toString(),
      city: e.target.dataset.city,
      areaID: e.target.dataset.id.toString(),
    });
  },

  toDetails: function (e) { 
    let that = this;
    let shopId = e.currentTarget.dataset.id;
    let shopName = e.currentTarget.dataset.shopname;

    console.log(shopId);
    wx.navigateTo({
      url: '/pages/module_others/pages/discount_info/discount_info?shopId=' + shopId + '&shopName=' + shopName,
    })


  },
  // 区域清空筛选项
  quyuEmpty: function () {
    var that = this;
    this.setData({
      select1: '',
      select2: '',
      select3: '',
      cityright: {},
      citycenter: {},
      city: '全部',
      cityName: app.globalData.defaultCity,
      countyName: '',
      countyID: '',
      areaID: '',

    })
  },
  // 区域选择筛选项后，点击提交
  submitFilter: function (e) {
    var that = this
    console.log('选择的市区索引是：' + this.data.cityID);
    console.log('选择的地区索引是：' + this.data.countyID);
    console.log('选择的商业区索引是：' + this.data.areaID);
    
    if(this.data.cityID != '' && this.data.countyID != ''){
      that.setData({
        isSelected: true,
        qyopen: false,
        qyshow: true,
        isfull: false,
        shownavindex: 0,
        cityID: this.data.cityID,
        countyID: this.data.countyID,
        areaID: this.data.areaID,
        pageNum: 0,
        hidden: !that.data.hidden,
        dishesNameLists: [],//再次查询清空缓存
        hiddenStore: true,
      },()=>{
        that.select()
      })
      
    }else{
      wx.showModal({
        title: '提示',
        content: '请选择市或区/县'
      })
    }
  },

  closeOther: function () {
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
  onLoad: function (options) {
    var that = this

    // 搜索 && options.searchValue
    if (options && options.searchValue) {
      var sendBefore = new Date();
      var that = this;
      that.setData({
        // hidden:!that.data.hidden,
        text: options.searchValue,
        cityName: app.globalData.defaultCity,
        countyName: app.globalData.defaultCounty,
        cityID: app.globalData.defaultCityID,
        countyID: app.globalData.defaultCountyID,
        searchValue: options.searchValue,
      });
      console.log('你搜索的的是：' + that.data.text)
      that.select();
    }

    

  },

  setRepos(data) {
    var that = this
    console.log('排序操作');
    that.setData({
      qyopen: false,
      qyshow: true,
      isfull: false,

      shownavindex: 0,
      pageNum: 0,

      dishesNameLists: [],//再次查询清空缓存
      hidden: !that.data.hidden,
      hiddenStore: true,
    })

    that.select();
  },

  //搜索入口  
  wxSearchTab: function () {
    // wx.switchTab({
    //   url: '../search/search'
    // })
    wx.redirectTo({
      url: '../../../search/search'
    })
  },

  //点赞 不用的
  // dianzan: function () {
  //   var that = this
  //   that.setData({
  //     dianzan: !that.data.dianzan,
  //   })
  // },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.selectProvince();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 城市选择
    this.setData({
      location: app.globalData.defaultCity,
      county: app.globalData.defaultCounty
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
    var that = this;

    that.select();


  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  resultSum() {
    var that = this
    var sum = 0

    if(that.data.dishesNameLists.length!=0){
      var arr = that.data.dishesNameLists;
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

  select: function (e) {
    var that = this;

    if(!that.data.isSelected){
      return;
    }

    wx.showLoading({
      title: '请稍后...',
      mask: true,
    })

    var object = {
      "keyWord": that.data.text,
      "cityID": that.data.cityID,
      "countyID": that.data.countyID,
      "areaID": that.data.areaID,
      "sort": that.data.sort,
      // "minimumPrice": that.data.minimumPrice,
      // "cityIDResult": app.globalData.cityIDResult,
      // "nature": that.data.nature,
      "highestPrice": that.data.highestPrice,
      "longitude": app.globalData.myLongitude.toFixed(10),
      "latitude": app.globalData.myLatitude.toFixed(10),
      // "birthplace": that.data.birthplace,
      "pageNum": that.data.pageNum,
      "filter": '',
    }

    wx.request({
      // url: 'http://localhost:8087/WX Restaurant/GetQgqcDiscountSearchKeyWordDetailVo',
      url: app.globalData.GetQgqcDiscountSearchKeyWordDetailVo,
      data: JSON.stringify(object),
      dataType: 'json',
      //这里接口返回的数据是什么类型，直接解析数据
      header: {
        'contentType': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      method: 'POST',
      success: function (res) {
        console.log(res,"查询菜品的结果");

        var isnull = (Object.getOwnPropertyNames(res.data.object).length === 0)
        var dishesNameList = res.data.object;
        var oldDishesNameLists = that.data.dishesNameLists;
        var newDishesNameList = oldDishesNameLists.concat(dishesNameList)

        if(res.data.object.length == 0 || res.data.object.length < 10){
          that.setData({
            isSelected: false
          })
        }

        console.log(newDishesNameList)
        if (isnull) {
          that.setData({
            dishesNameLists: [],
            hidden: true,
            hiddenStore: false,
            loadcompleted: true,

          })
        } else {
          that.setData({
            dishesNameLists: newDishesNameList,
            hidden: true,
            hiddenStore: true,
            pageNum: Number(that.data.pageNum) + 1
          })
          that.resultSum()
        }
        wx.hideLoading({
          success: (res) => {},
        })

        
      },
      fail: function (res) {
        console.log('失败啦')
        that.setData({
          rquestFail: false,
        })
      },
      // complete: res=>{
      //   if(that.data.isSelectedSearchType){
      //     wx.request({
      //       url: 'http://localhost:8087/wx_restaurant/SelectDiscountSearchType',
      //       success: res=>{
      //         let searchTypeList = res.data.object;
      //         let items = that.data.items;
      //         let child = that.data.items[0].children[0].children;
      //         let searchType = {};
  
      //         for(let i=0;i<searchTypeList.length;i++){
      //           searchType = {
      //             label: searchTypeList[i].typeName,
      //             value: searchTypeList[i].id,
      //           };
      //           child.push(searchType);
      //         };
  
      //         items[0].children[0].children = child;
      //         that.setData({
      //           items: items,
      //           isSelectedSearchType: false
      //         },()=>{
      //           that.$wuxFilterBar = $wuxFilterBar.init({
      //             items: that.data.items,
      //             onChange: (checkedItems, data, items) => {
      //               const params = {}
      //               checkedItems.forEach((n) => {
      //                 if (n.value === 'filter') {
      //                   n.children.filter((n) => n.selected).forEach((n) => {
      //                     if (n.value === 'searchType') {
      //                       const selected = n.children.filter((n) => n.checked).map((n) => n.value).join(' ')
      //                       params.searchType = selected;
      //                     }
      //                   })
      //                 }
      //               })
      //               that.data.searchType = params.searchType ? params.searchType : "";
      //               that.setRepos(data);
      //             },
      //           })
      //         })
      //       }
      //     })
      //   }
      // }
    })

  },

  selectMore: function (e) {
    var that = this;

    that.data.dishesNameList = ''
    var pageNum = that.data.pageNum;


    if (pageNum < 10) {
      pageNum += 1
    } else {
      that.setData({
        loadcompleted: false,
      })
      return -1;
    }

    var tips = "正在加载更多内容！";
    console.log("load page" + (pageNum + 1));
    that.setData({
      pageNum: pageNum,
    })

    var pageNumS = pageNum.toString();

    var object = {
      "keyWord": that.data.text,
      "cityID": that.data.cityID,
      "countyID": that.data.countyID,
      "areaID": that.data.areaID,
      "sort": that.data.sort,
      "minimumPrice": that.data.minimumPrice,
      "cityIDResult": app.globalData.cityIDResult,
      "nature": that.data.nature,
      "highestPrice": that.data.highestPrice,
      "longitude": app.globalData.myLongitude.toFixed(10),
      "latitude": app.globalData.myLatitude.toFixed(10),
      "birthplace": that.data.birthplace,
      "pageNum": pageNumS,
    }

    wx.showLoading({
      title: tips,
    })
    console.log(object)

    wx.request({
      // url: 'https://mb.fsmbdlkj.com/diancanxing/dishes/keyWordQueryDishesFrom',
      url: app.globalData.allUrl.defaultDishesSelect,

      data: JSON.stringify(object),

      dataType: 'json',

      //这里接口返回的数据是什么类型，直接解析数据
      header: {
        'contentType': 'application/x-www-form-urlencoded;charset=utf-8',
      },
      method: 'POST',
      success: function (res) {
        var sendAfter = new Date();
        wx.hideLoading();
        console.log(sendAfter.getSeconds() + ":" + sendAfter.getMilliseconds());
        var isnull = (Object.getOwnPropertyNames(res.data.dishesDetailResultMap).length === 0)

        var dishesNameList = res.data.dishesDetailResultMap;
        var oldDishesNameLists = that.data.dishesNameLists;
        var newDishesNameList = oldDishesNameLists.concat(dishesNameList)

        if (isnull) {
          console.log('没有搜索该关键词')
          that.setData({
            // dishesNameLists: [],

            // hiddenStore: false,
            loadcompleted: false,
            hidden: true,
          })
        } else {
          that.setData({
            dishesNameLists: newDishesNameList,
            hidden: true,
            pageNum: pageNum,
            hiddenStore: true,
            loadcompleted: true,
          })
          that.resultSum()
        }

        console.log('第' + pageNum + '页');
        console.log(newDishesNameList);
        var last = new Date();
        console.log(last.getSeconds() + ":" + last.getMilliseconds());

      },
      fail: function (res) {
        console.log('失败啦')
        console.log(res)
        that.setData({

          rquestFail: false,
        })
      },
    })
  },

  //省
  selectProvince(){
    let that = this;
    wx.request({
      // url: 'http://192.168.8.5:8087/WX Restaurant/getAllProvince',
      url: app.globalData.allUrl.getAllProvince,
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
      url: app.globalData.allUrl.defaultQueryCity,
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
  selectCounty: function (cityID) {
    var that = this;
    var countyObject = {
      "cityID": this.data.cityID
    }

    console.log(JSON.stringify(countyObject))

    wx.request({
      // url: 'https://mb.fsmbdlkj.com/diancanxing/shop/cityIDQueryCounty',
      url: app.globalData.allUrl.defaultQueryCounty,
      data: JSON.stringify(countyObject),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          citycenter: res.data
        })
        console.log(that.data.citycenter)
      }
    })
  },

  // 商业区
  selectArea: function (e) {
    var that = this;
    var countyObject = {
      "countyID": that.data.countyID
    }

    console.log(JSON.stringify(countyObject))

    wx.request({
      // url: 'https://mb.fsmbdlkj.com/diancanxing/shop/countyIDQueryArea',
      url: app.globalData.allUrl.defaultQueryArea,

      data: JSON.stringify(countyObject),
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success: function (res) {
        that.setData({
          cityright: res.data
        })
        console.log(that.data.cityright)
      }
    })
  }
})