const app = getApp()

Page({
  data: {
    detailList: [],
    shopId: '',
    isShowDetail: false,
    selectDate: '',
    selectName: '',
  },

  onLoad: function (options) {
    let that = this
    that.setData({
      shopId: options.shopId ? options.shopId : ''
    })

    that.getDistributionInCome()
  },

  onShow: function () {

  },

  getDistributionInCome(){
    let that = this

    wx.request({
      url: app.globalData.getDistributionInCome,
      // url: 'http://192.168.8.5:8088/evaluation/getDistributionInCome',
      method: 'GET',
      data: {
        openid: app.globalData.openid,
        shopId: that.data.shopId ? that.data.shopId : '',
        createTime: that.data.selectDate ? that.data.selectDate : '',
        goodsName: that.data.selectName ? that.data.selectName : '',
      },
      success: res=>{
        console.log(res,"查询的分销收入信息");
        that.setData({
          detailList: res.data.list
        })
      }
    })
  },

  returnBack: function () {
    var pages = getCurrentPages(); //当前页面
    var beforePage = pages[pages.length - 2]; //前一页
    wx.navigateBack({
      success: function () {
        // beforePage.onLoad(); // 执行前一个页面的onLoad方法
      }
    });
  },

  showDetail(e){
    if(this.data.isShowDetail){
      this.setData({
        isShowDetail: !this.data.isShowDetail,
        createTime: '',
        goodsName: '',
        distributionPrice: '',
        commissionPrice: '',
        orderNum: '',
        buyCode: '',
        buyNickName: '',
        commissionTotal: ''
      })
      return;
    }
    let item = e.currentTarget.dataset.item
    this.setData({
      isShowDetail: !this.data.isShowDetail,
      createTime: item.createTime,
      goodsName: item.goodsName,
      distributionPrice: item.distributionPrice,
      commissionPrice: item.commissionPrice,
      orderNum: item.orderNum,
      buyCode: item.buyCode,
      buyNickName: item.buyNickName,
      commissionTotal: item.commissionTotal
    })

  },

  selectDate(e){
    let selectDate = e.detail.value;
    this.setData({
      selectDate
    })
  },

  selectName(e){
    let selectName = e.detail.value;
    this.setData({
      selectName
    })
  },
})

