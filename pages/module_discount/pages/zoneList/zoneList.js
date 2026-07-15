let app = getApp();
Page({
  data: {
    addressList: [],
  },

  onLoad(options) {
    
  },

  onShow() {
    let that = this;
    
    that.selectTicketCustomerAddress();
  },

  toAddZone(e){
    let item = e.currentTarget.dataset.item;
    let index = e.currentTarget.dataset.index;
    wx.navigateTo({
      url: '../addZone/addZone?index=' + index + '&userInf=' + (item ? JSON.stringify(item) : ''),
    })
  },

  selectTicketCustomerAddress(){
    let that = this;

    wx.showLoading({
      title: '请稍等！',
    })

    wx.request({
      url: app.globalData.selectTicketCustomerAddress,
      data: {
        unionid: app.globalData.unionID
      },
      success: res=>{
        if(res.data.code == 1){
          let addressList = res.data.data;
          
          that.setData({
            addressList
          })
          wx.hideLoading()
        }else{
          wx.showToast({
            title: '查询失败',
            icon: 'error'
          })
          wx.hideLoading()
        }
      }
    })
  },

  navigateBack(e){
    app.globalData.deliveryAddressInf = e.currentTarget.dataset.item;
    wx.navigateBack();
  }

})