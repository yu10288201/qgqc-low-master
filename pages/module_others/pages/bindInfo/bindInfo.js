// pages/module_others/pages/bindInfo/bindInfo.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bindingRole: ['平台现金', '平台星盾', '商家现金', '商家星盾'],
        bindingRoleIndex: 0,
        
        bindingType: ['全部', '平台','店铺','餐品'],
        bindingTypeIndex: 0,

        todayData: true,
        selectShopName: '',
        selectAreaName: '',
        beginCreateTime: '',
        endCreateTime: '',
        canPinListIndex: 0,
        canPinList: [],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        console.log(app.globalData.shopid)
        //返回块Top
        // console.log(wx.getSystemInfoSync().statusBarHeight)
        //返回块高度
        // console.log(wx.getMenuButtonBoundingClientRect().height + (wx.getMenuButtonBoundingClientRect().top - wx.getSystemInfoSync().statusBarHeight) * 2)
        let that = this
        that.setData({
            return_out_top: wx.getSystemInfoSync().statusBarHeight,
            return_out_height: (wx.getMenuButtonBoundingClientRect().height + (wx.getMenuButtonBoundingClientRect().top - wx.getSystemInfoSync().statusBarHeight) * 2),
        })
        
        
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
        },()=>{
            console.log("that.data.canPinList[index]:"+that.data.canPinList[index]);
            that.getBindCustomerRecordCount(that.data.canPinList[index].shop_id)
        })
    },
    getBelowList(){
        let that = this 
        wx.showLoading({
          title: '请稍后',
        })
        wx.request({
        //   url: 'http://localhost:8080/evaluation/selectBindCustomerRecordQgqcMainList_Customer',
          url: app.globalData.selectBindCustomerRecordQgqcMainList_Customer,
          data:{
            bind_person_id: app.globalData.customerInf.id,
            bind_person_type: 2,
            bind_type: that.data.bindingTypeIndex,
            shop_name: that.data.selectShopName,
            area_name: that.data.selectAreaName,
            begin_create_time: that.data.beginCreateTime,
            end_create_time: that.data.endCreateTime,
          },
          success: res=>{
            if(res.data.code == 1000){
                wx.hideLoading()
                that.setData({
                    canPinList: res.data.data
                },()=>{
                    if(that.data.canPinList.length>0){
                        that.getBindCustomerRecordCount(that.data.canPinList[that.data.canPinListIndex].shop_id)
                    }
                    
                })
            }
          }
        })
    },
    getBindCustomerRecordCount(shop_id) {
        let that = this
        wx.showLoading({
            title: '请稍后',
        })
        wx.request({
            url: app.globalData.selectBindCustomerRecordCount_Customer,
            // url: 'http://localhost:8080/evaluation/selectBindCustomerRecordCount_Customer',
            data: {
                shop_id: shop_id,
                main_customer_unionId: app.globalData.unionID,
                query_date_type: that.data.todayData ? 1 : 2,
            },
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
        that.setData({
            todayData: id == 0
        }, () => {
           that.getBindCustomerRecordCount(that.data.canPinList[that.data.canPinListIndex].shop_id)
        })
    },

    beginCreateTimeChange(e) {
        console.log(e.detail)
        this.setData({
            beginCreateTime: e.detail.value
        })
    },
    endCreateTimeChange(e) {
        console.log(e.detail)
        this.setData({
            endCreateTime: e.detail.value
        })
    },

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

    }
})