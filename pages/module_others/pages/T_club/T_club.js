// pages/module_others/pages/T_club/T_club.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        imageUrl:[
            'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/T_club/T_01.png',
            'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/T_club/T_02.png',
            'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/T_club/T_03.png',
            'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/T_club/T_04.png',
            'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/T_club/T_05.png',
            'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/T_club/T_06.png',
            'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/T_club/T_07.png',
            'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/T_club/T_08.png',
            'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/T_club/T_09.png',

        ]
    },
    jumpCoupon(){
        let that = this 
        wx.navigateTo({
          url: '/pages/module_discount/pages/Shop_ordering_couponid/Shop_ordering_couponid?file_id=1&shop_id=21404&shop_name=T馆国际运动馆',
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {

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