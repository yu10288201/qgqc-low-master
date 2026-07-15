import { LETTERS, CITY_LIST, HOT_CITY_LIST } from '../../locale/citydata'
import utils from '../../utils/utils'
const {
  isNotEmpty,
  isChinese,
  safeGet,
  getCityListSortedByInitialLetter,
  getLocationUrl,
  getCountyListUrl,
  getIndexUrl
} = utils;
const appInstance = getApp();

Page({
  data: {
    tap: false,
    sideBarLetterList: [],
    winHeight: 0,
    province: '',
    cityList: [],
    hotCityList: HOT_CITY_LIST,
    showChosenLetterToast: false,
    scrollTop: 0,//置顶高度
    scrollTopId: '',//置顶id
    locationCity: "当前定位的城市:",
    city: "定位中",
    currentCityCode: '',
    inputName: '',
    completeList: [],
    county: '',
    showCountyPicker: true,

    num: '',
  },

  changeStyle: function (e) {
    console.log(e);
    this.setData({
      num: e.currentTarget.dataset.num
    })
  },

  onLoad: function () {
    // 生命周期函数--监听页面加载
    const cityListSortedByInitialLetter = getCityListSortedByInitialLetter();
    const sysInfo = wx.getSystemInfoSync();
    const winHeight = sysInfo.windowHeight;
    const sideBarLetterList = LETTERS.map(letter => ({ name: letter }));
    this.setData({
      winHeight,
      // itemH: itemH,
      sideBarLetterList,
      province: appInstance.globalData.defaultProvince,
      cityList: cityListSortedByInitialLetter
    });
    if (appInstance.globalData.myLatitude == 0 && appInstance.globalData.myLongitude == 0){
      console.log(111)
    }
    // 定位
    this.getLocation();
  },
  onReady: function () {
    // 生命周期函数--监听页面初次渲染完成

  },
  onShow: function () {
    // 生命周期函数--监听页面显示

  },
  onHide: function () {
    // 生命周期函数--监听页面隐藏

  },
  onUnload: function () {
    // 生命周期函数--监听页面卸载

  },
  onPullDownRefresh: function () {
    // 页面相关事件处理函数--监听用户下拉动作

  },
  onReachBottom: function () {
    // 页面上拉触底事件的处理函数

  },

  touchSideBarLetter: function (e) {
    const chosenLetter = safeGet(['currentTarget', 'dataset', 'letter'], e)
    // const chosenLetter = e.currentTarget.dataset.letter;
    this.setData({
      toastShowLetter: chosenLetter,
      showChosenLetterToast: true,
      scrollTopId: chosenLetter,
    })
    // close toast of chosenLetter
    setTimeout(() => { this.setData({ showChosenLetterToast: false }) }, 500)
  },
  //选择城市
  chooseCity: function (e) {
    const { city, code } = safeGet(['currentTarget', 'dataset'], e)
    // const { city, code } = e.currentTarget.dataset
    this.setData({
      showCountyPicker: true,
      city,
      currentCityCode: code,
      scrollTop: 0,
      completeList: [],
      locationCity: "当前选择的城市:"
    })
    this.getCountyList()
  },
  //这里
  chooseCounty: function (e) {
    const county = safeGet(['currentTarget', 'dataset', 'city'], e)
    console.log(county)
    this.setData({
      county,
    })
  },

  //点击热门城市回到顶部
  hotCity: function () {
    this.setData({ scrollTop: 0 })
  },
  bindScroll: function (e) {
    // console.log(e.detail)
  },
  getCountyList: function () {
    let that = this
    console.log("正在获取区县");
    const code = this.data.currentCityCode

    // wx.request({
    //   url: getCountyListUrl(code),
    //   success: res => {
    //     const resultArray = safeGet(['data', 'result'], res)
    //     const countyList = isNotEmpty(resultArray) ? resultArray[0] : []
    //     console.log(countyList)
    //     this.setData({ countyList })
    //   },
    //   fail: () => { console.error("请求区县失败，请重试") }
    // })

    wx.request({
      url: appInstance.globalData.allUrl.defaultCityID,
      data: {
        provinceName: that.data.province,
        cityName: that.data.city
      },
      success:res=>{
                if(res.data.object != null){
          let allArea = res.data.object
          that.setData({
            cityID: allArea.city.id,
            provinceID : allArea.province.id,
            cityCode: res.data.object.city.cityCode
          })
          appInstance.globalData.defaultProvinceID = that.data.provinceID;
          appInstance.globalData.defaultCityID = that.data.cityID;
          appInstance.globalData.cityIDResult = that.data.cityID.toString();
          appInstance.globalData.countyList = allArea.county;
          appInstance.globalData.areaList = allArea.area;
          appInstance.globalData.cityCode = that.data.cityCode
          this.setData({ countyList: allArea.county})
          // for(let item of appInstance.globalData.countyList){
          //   if(appInstance.globalData.defaultCounty == item.countyName){
          //     appInstance.globalData.defaultCountyID = item.id
          //   }
          // }
        }
      }
    })

  },

  getLocation: function () {
    console.log("正在定位城市");
    this.setData({
      county: '',
      tap: false,
      locationCity: "当前定位的城市:",
      num: ''
    })

    wx.getLocation({
      type: 'wgs84',
      success: res => {
        const { latitude, longitude } = res
        console.log(res)
        wx.request({
          url: getLocationUrl(latitude, longitude),
          success: res => {
            const { city, adcode, district } = safeGet(['data', 'result', 'ad_info'], res)
            //将地区代码最后两位置零就能得到区县级
            var adcodeI = parseInt(parseInt(adcode) / 100) * 100

            this.setData({
              city,
              currentCityCode: adcodeI,
              // county: district,
            })

            appInstance.globalData.isPosition = true
            // appInstance.globalData.defaultCounty = ''//清空进入城市选择，不做操作，而直接返回后的数据缓存

            this.getCountyList();

          }
        })
      },
      fail: () => { console.error("定位失败，请重试") }
    })
  },
  // 重置
  reGetLocation: function () {
    const { city, county } = this.data;
    appInstance.globalData.defaultCounty = '';
    // console.log(appInstance.globalData.defaultCountyCache);
    console.log(appInstance.globalData.defaultCounty);

    this.setData({
      county: '',
    })
    //返回首页
    // wx.switchTab({ url: getIndexUrl() })
  },

  goBack: function () {
    if(this.data.city != ''){
      appInstance.globalData.defaultCity = this.data.city
      // if(this.data.county != ''){
        appInstance.globalData.defaultCounty = this.data.county
        if(!appInstance.globalData.defaultCounty){
          appInstance.globalData.defaultCountyID=0
        }else{
          for(let item of this.data.countyList){
          if(appInstance.globalData.defaultCounty == item.countyName || appInstance.globalData.defaultCounty == item.fullname){
            appInstance.globalData.defaultCountyID = item.id
          }
        }
        }
        

        // if(appInstance.globalData.defaultCounty == '') appInstance.globalData.defaultCountyID=0

        wx.navigateBack({
          url: '../search/search',
        })

      // }else{
      //   wx.showModal({
      //     title: '提示',
      //     content: '请选择区/县'
      //   })
      // }
    }
  },

  // 失焦时清空输入框
  bindBlur: function (e) {
    this.setData({ inputName: '' })
  },
  // 输入框输入时
  bindKeyInput: function (e) {
    this.setData({ inputName: e.detail.value })
    this.associativeSearch()
  },
  // 输入框自动联想搜索
  associativeSearch: function () {
    let inputContent = this.data.inputName.trim()
    let content = inputContent.toLowerCase()
    if (!content) {
      this.setData({ completeList: [] })
      return
    }
    // search
    let resultList = this.searchList(content)
    // show
    this.showList(resultList)
  },
  searchList: function (str) {
    let targetCity
    return CITY_LIST.filter(
      city => {
        targetCity = this.getTargetCity(str, city)
        return (targetCity && targetCity == str)
      }
    )
  },
  getTargetCity: function (str, cityObj) {
    if (isChinese(str)) {
      const slicedChineseName = cityObj.city && cityObj.city.slice(0, str.length)
      return slicedChineseName
    } else {
      const slicedPinyinName = cityObj.short && cityObj.short.slice(0, str.length).toLowerCase()
      return slicedPinyinName
    }
    // 在城市数据中，添加简拼到“shorter”属性，就可以实现简拼搜索
    // cityObj.shorter.slice(0, len).toLowerCase()
  },
  showList: function (array) {
    if (isNotEmpty(array)) {
      let finalCityList = array.map(item => ({ city: item.city, code: item.code }))
      this.setData({ completeList: finalCityList })
    } else {
      this.setData({ completeList: [{ city: '无匹配城市', code: "000" }] })
    }
  },
})
