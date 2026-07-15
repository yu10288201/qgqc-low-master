// pages/module_others/pages/bindInfo/bindInfo.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bindingRole: ['平台现金', '平台星盾', '商家现金', '商家星盾'],
        bindingRoleIndex: 0,
        
        bindingType: ['全部', '平台','店铺','商品'],
        bindingTypeIndex: 0,

        todayData: true,
        selectShopName: '',
        selectAreaName: '',
        beginCreateTime: '',
        endCreateTime: '',
        canPinListIndex: -1,
        canPinList: [],
        begin_date:'',
        end_date:'',
        query_date_type:3,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(app.globalData.shopid)
        this.initToday();
        //返回块Top
        // console.log(wx.getSystemInfoSync().statusBarHeight)
        //返回块高度
        // console.log(wx.getMenuButtonBoundingClientRect().height + (wx.getMenuButtonBoundingClientRect().top - wx.getSystemInfoSync().statusBarHeight) * 2)
        let that = this
        that.setData({
            return_out_top: wx.getSystemInfoSync().statusBarHeight,
            return_out_height: (wx.getMenuButtonBoundingClientRect().height + (wx.getMenuButtonBoundingClientRect().top - wx.getSystemInfoSync().statusBarHeight) * 2),
        })
        
        that.getBindCustomerRecordCount();
        that.getBelowList()
        
    },
    goToRule(){
        wx.navigateTo({
          url: '../../../help/help',
        })
    },
    clearSelectKey(){
        let that = this
        that.setData({
            beginCreateTime:'',
            endCreateTime: '',
            selectAreaName: '',
            selectShopName: '',
            bindingTypeIndex: 0,
            bindingRoleIndex: 0,
        })
    },
    
    selectCanPin(e){
        let that = this 
        let index = e.currentTarget.dataset.index
        that.setData({
            canPinListIndex: index,
        })
    },
    getBelowList(){
        let that = this 
        wx.showLoading({
          title: '请稍后',
        })

        var data={
          associate_id: app.globalData.customerInf.id,
          associate_type: 2,
          bind_type: that.data.bindingTypeIndex,
          shop_name: that.data.selectShopName,
          area_name: that.data.selectAreaName,
          begin_create_time: that.data.beginCreateTime,
          end_create_time: that.data.endCreateTime,
        }

        //切瓜切菜微信号 测试
        // data={
        //   associate_id: 6108,
        //   associate_type: 2,
        //   bind_type: that.data.bindingTypeIndex,
        //   shop_name: that.data.selectShopName,
        //   area_name: that.data.selectAreaName,
        //   begin_create_time: that.data.beginCreateTime,
        //   end_create_time: that.data.endCreateTime,
        // }
        
        wx.request({
        //   url: 'http://localhost:8080/evaluation/selectBindCustomerRecordQgqcMainList_Customer',
          url: app.globalData.selectMallBindRecordGoodsList_FenXiaoShouYi_Qgqc,
          data:data,
          success: res=>{
            wx.hideLoading()
            if(res.data.code == 1000){
                if(res.data.data.length>0){
                  that.setData({
                    canPinListIndex:0,
                  })
                }
                that.setData({
                    canPinList: res.data.data
                })
            }
          },
          fail:res=>{
            wx.hideLoading()
            console.log(res);
          }
        })
    },
    getBindCustomerRecordCount() {
        let that = this
        wx.showLoading({
            title: '请稍后',
        })
        var data={
                main_customer_unionId: app.globalData.unionID,
                query_date_type: that.data.query_date_type,
                begin_date:that.data.beginCreateTime,
                end_date:that.data.endCreateTime,
        }
        //切瓜切菜微信号测试
        // data={
        //         main_customer_unionId: 'oDQ5O57__HCOUkT_IJIhaa9DcxC0',
        //         query_date_type: that.data.query_date_type,
        //         begin_date:that.data.beginCreateTime,
        //         end_date:that.data.endCreateTime,
        // }

        wx.request({
            url: app.globalData.selectMallBindRecordCount_FenXiaoShouYi_Qgqc,
            data: data,
            method: 'GET',
            success: res => {
                // console.log(res)
                if (res.data.code == 1000) {
                    this.setData({
                        saleDataInf: res.data.data
                    })
                    wx.hideLoading()
                }else{
                    wx.showModal({
                      title: '提示',
                      content: '网络异常',
                      showCancel: false,
                    })
                    wx.hideLoading()
                }
            },
            fail: res=>{
                wx.showModal({
                    title: '提示',
                    content: '网络异常',
                    showCancel: false,
                  })
                wx.hideLoading()
            }
        })
    },
    returnBack(){
        wx.navigateBack()
    },
    toBindingCustomerDetail() {
        wx.navigateTo({
            url: '../BindingCustomerDetail/BindingCustomerDetail',
        })
    },

    changeToadyData(e) {
        let that = this 
        let id = e.currentTarget.dataset.id
        if(id==1){
          this.initToday();
        }else if(id==2){
          this.initMonth();
        }
        that.getBindCustomerRecordCount();
        that.getBelowList()

        //that.getBindCustomerRecordCount(that.data.canPinList[that.data.canPinListIndex].shop_id)
        //that.getBindCustomerRecordCount();
    },

    beginCreateTimeChange(e) {
        console.log(e.detail)
        this.setData({
            beginCreateTime: e.detail.value
        })
    },
    // beginDateChange(e){
    //   console.log(e.detail)
    //     this.setData({
    //         begin_date: e.detail.value
    //     })
    // },
    endCreateTimeChange(e) {
        console.log(e.detail)
        this.setData({
            endCreateTime: e.detail.value
        })
    },
    // endDateChange(e) {
    //     console.log(e.detail)
    //     this.setData({
    //         end_date: e.detail.value
    //     })
    // },
    selectBindingType(e) {
        console.log(e.detail)
        this.setData({
            bindingTypeIndex: e.detail.value
        })
    },

    selectBindingRole(e) {
        console.log(e.detail)
        this.setData({
            bindingRoleIndex: e.detail.value
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },
    initToday(){
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      var sMonth=''+month;
      if(month<10){
        sMonth='0'+sMonth;
      }
      var sDay=''+day;
      if(day<10){
        sDay='0'+day;
      }
      var today=year+"-"+sMonth+'-'+sDay;
      this.setData({
        beginCreateTime:today,
        endCreateTime:today,
      })

    },
    initMonth(){
      var date = new Date()
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var sMonth=''+month;
      if(month<10){
        sMonth='0'+sMonth;
      }
      var sDay='01';
      var today=year+"-"+sMonth+'-'+sDay;
      console.log(today);
      var lDay=date.getDate();
      var sLDay=''+lDay;
      var lastDay=year+"-"+sMonth+'-'+sLDay;
      this.setData({
        beginCreateTime:today,
        endCreateTime:lastDay,
      })
    },
    getConditionCust(e){
      var that=this;
      that.getBindCustomerRecordCount();
        that.getBelowList()
    },
    toMallArticleEffectMain(){
      wx.navigateTo({
        url: '/pages/mall/pages/mallbasearticleeffectmain/mallbasearticleeffectmain',
      })
    },
    toMallPersonalBenefit(){
      wx.navigateTo({
        url: '/pages/mall/pages/mallpersonalbenefit/mallpersonalbenefit',
      })
    },
})