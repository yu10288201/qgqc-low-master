// pages/shop_manage/pages/BindingCustomerDetail/BindingCustomerDetail.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        bindingType: ['全部', '平台', '店铺', '餐品'],
        bindingTypeIndex: 0,
        detailList: [],
        beginCreateTime: '',
        endCreateTime: '',
        selectUserCode: '',
        selectNickName: '',
        selectDistance: '',
        selectAreaName: '',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        // console.log(app.globalData.shopid)
        // //返回块Top
        // console.log(wx.getSystemInfoSync().statusBarHeight)
        // //返回块高度
        // console.log(wx.getMenuButtonBoundingClientRect().height + (wx.getMenuButtonBoundingClientRect().top - wx.getSystemInfoSync().statusBarHeight) * 2)
        this.setData({
            return_out_top: wx.getSystemInfoSync().statusBarHeight,
            return_out_height: (wx.getMenuButtonBoundingClientRect().height + (wx.getMenuButtonBoundingClientRect().top - wx.getSystemInfoSync().statusBarHeight) * 2),
        })
        this.initDetail()
        if (options.bind_type) {
            this.setData({
                bind_type: options.bind_type,
                bind_shop_id: options.bind_shop_id,
                bind_staf_id: options.bind_staf_id,
                bind_meals_type: options.bind_meals_type,
                bind_meals_id: options.bind_meals_id
            })
        }
    },
    showWriteDetailDialog(e) {

    },
    sendMessageToCust(e) {

    },
    selectAllCust(e) {
        let that = this
        let detailList = that.data.detailList
        for (const x of detailList) {
            x.selected = true
        }
        that.setData({
            detailList
        })
    },
    getConditionCust(e) {


    },

    choosePeople(e) {
        let that = this
        let index = e.currentTarget.dataset.index
        let detailList = that.data.detailList
        if (detailList[index].selected) {
            detailList[index].selected = !detailList[index].selected
        } else {
            detailList[index].selected = true
        }
        that.setData({
            detailList
        })
    },
    clearInputContent(e) {
        this.setData({
            beginCreateTime: '',
            endCreateTime: '',
            selectUserCode: '',
            selectNickName: '',
            selectDistance: '',
            selectAreaName: '',
            bindingTypeIndex: 0,
        })
    },
    toChatWithCust() {
        wx.navigateTo({
            url: '../chatWithCust/chatWithCust',
        })
    },
    selectBindingRole(e) {
        console.log(e.detail)
        this.setData({
            bindingRoleIndex: e.detail.value
        })

    },
    selectBindingType(e) {
        console.log(e.detail)
        this.setData({
            bindingTypeIndex: e.detail.value
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

    initDetail() {
        let that = this
        wx.showLoading({
            title: '请稍后',
        })
        wx.request({
            url: app.globalData.selectBindCustomerRecordDetailList_StorePersonnal,
            // url: 'http://localhost:8080/evaluation/selectBindCustomerRecordDetailList_StorePersonnal',
            data: {
                area_name: that.data.selectAreaName,
                distance: that.data.selectDistance ? that.data.selectDistance : 0,
                bind_person_id: app.globalData.customerInf.id,
                bind_person_type: 2,
                bind_type: that.data.bindingTypeIndex,
                shop_id: app.globalData.shopdetail ? 0 : app.globalData.shopdetail.shop_id,
                bind_person_code: that.data.selectUserCode,
                begin_create_time: that.data.beginCreateTime,
                end_create_time: that.data.endCreateTime,
            },
            header: {
                'content-type': 'application/x-www-form-urlencoded' // 默认值
            },
            success: res => {
                if (res.data.code == 1000) {
                    this.setData({
                        detailList: res.data.data
                    })
                    wx.hideLoading()
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '网络异常',
                        showCancel: false,
                    })
                    wx.hideLoading()
                }
            },
            fail: res => {
                wx.showModal({
                    title: '提示',
                    content: '网络异常',
                    showCancel: false,
                })
                wx.hideLoading()
            }
        })
    },
    returnBack() {
        wx.navigateBack({
            delta: 0,
        })
    },
    chooseDetail(e) {

    }
})