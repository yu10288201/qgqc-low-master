// pages/shop_manage/pages/chatWithCust/chatWithCust.js
const app = getApp()
//const at = require('../utils/wechat.format.atim.js')

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

const INT_MAX=2147483647;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        ding_associate_id:0,
        pageIndex: 0,
        mi_last_max_id:INT_MAX,
        chat_last_max_id:0,

        page_size:20,
        phone:'',//手机号
        nickname:'',//昵称
        tmp_nick_name:'',
        avatarUrl: defaultAvatarUrl,//默认头像
        chatCustomerList: [],
        dingYouList:[],
        total_not_read_count:0,//未读消息数
        def_avatar_url:'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
        search_svg:'data:image/svg+xml,%3Csvg%20t%3D%221713582384819%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%221556%22%20width%3D%2248%22%20height%3D%2248%22%3E%3Cpath%20d%3D%22M417.408%20833.344a416.512%20416.512%200%200%201-416-416c0-229.376%20186.624-416%20416-416s416%20186.624%20416%20416c0%20229.312-186.624%20416-416%20416z%20m0-768c-194.112%200-352%20157.888-352%20352s157.888%20352%20352%20352c194.048%200%20352-157.888%20352-352s-157.888-352-352-352z%22%20p-id%3D%221557%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M990.592%201022.656a32%2032%200%200%201-22.272-9.024l-299.008-289.344a32%2032%200%200%201%2044.48-46.016l299.008%20289.344a32%2032%200%200%201-22.208%2055.04z%22%20p-id%3D%221558%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        let sis = wx.getSystemInfoSync()
        let mbbc = wx.getMenuButtonBoundingClientRect()
        this.setData({
            return_out_top: sis.statusBarHeight,
            return_out_height: (mbbc.height + (mbbc.top - sis.statusBarHeight) * 2),
            tabBarHeight: sis.screenHeight - sis.safeArea.bottom,
            swiperHeight: sis.safeArea.bottom - (sis.statusBarHeight + (mbbc.height + (mbbc.top - sis.statusBarHeight) * 2)) - 50,
            swiperTop: sis.statusBarHeight + (mbbc.height + (mbbc.top - sis.statusBarHeight) * 2)
        })

        console.log(app.globalData.customerInf);

        this.setData({
          ding_associate_id:app.globalData.customerInf.id?Number(app.globalData.customerInf.id):0,
        })
        //this.initChatList();
        
        this.selectDingMsgRecordDingKeFromMemberInfo();
        this.selectDingMsgRecordDingKeFromChat();
        //this.selectMallCsrCustomerByShopId();
    },

    selectDingMsgRecordDingKeFromMemberInfo() {
        console.log("selectDingMsgRecordDingKeFromMemberInfo")
        let that = this
        wx.showLoading({
            title: '请稍后',
        })
        var ding_associate_id=this.data.ding_associate_id;
        //测试代码：
        //ding_associate_id=6108;
        if(ding_associate_id<=0){
          wx.showToast({
            title: 'ding_associate_id为空',
            icon:'error'
          })
          return;
        }

        var mi_last_max_id=this.data.mi_last_max_id;
        var page_size=this.data.page_size;
        wx.showLoading({
          title: '加载中',
        })
        wx.request({
            url: app.globalData.selectDingMsgRecordDingKeFromMemberInfo,
          //url: 'http://localhost:8080/evaluation_war/mall/selectMallCsrCustomerByShopId',
            data: {
                last_max_id:mi_last_max_id,
                ding_associate_id:ding_associate_id,
                page_size:page_size,
            },
            method:'POST',
            success: res => {
              wx.hideLoading()
                console.log("selectDingMsgRecordDingKeFromMemberInfo")
                console.log(res)
                if (res.data.code == 1000) {

                  var dingYouList=res.data.data;
                  if(mi_last_max_id==INT_MAX){
                    if(dingYouList.length>0){
                      mi_last_max_id=dingYouList[dingYouList.length-1].customer_code-1;
                    }
                    var new_dingYouList=dingYouList;
                }else{
                    if(dingYouList.length>0){
                      mi_last_max_id=dingYouList[dingYouList.length-1].customer_code-1;
                    }
                    var new_dingYouList=that.data.dingYouList.concat(dingYouList);
                }
                that.setData({
                      mi_last_max_id:mi_last_max_id,
                      dingYouList:new_dingYouList,
                 
                  })
                   
                } else {
                    wx.showModal({
                        title: '提示',
                        content: '网络异常',
                        showCancel: false
                    })
                    
                }
            },
            fail: res => {
              wx.hideLoading()
                wx.showModal({
                    title: '提示',
                    content: '网络异常',
                    showCancel: false
                })
                
            }
        })
    },
    selectDingMsgRecordDingKeFromChat() {
      console.log("selectDingMsgRecordDingKeFromChat")
      let that = this
      var customer_code=Number(app.globalData.customerInf.userCode);
      //测试代码
      //customer_code=10246;

      console.log("customer_code:"+customer_code);
      if(customer_code<=0){
        wx.showToast({
          title: 'customer_code为空',
          icon:'error'
        })
        return;
      }
      var last_max_id=this.data.chat_last_max_id;
      var page_size=this.data.page_size;
      wx.request({
          url: app.globalData.selectDingMsgRecordDingKeFromChat,
        //url: 'http://localhost:8080/evaluation_war/mall/selectMallCsrCustomerByShopId',
          data: {
              last_max_id:last_max_id,
              page_size:page_size,
              customer_code:customer_code,
          },
          method:'POST',
          success: res => {

              console.log("selectDingMsgRecordDingKeFromChat")
              console.log(res)
              if (res.data.code == 1000) {

                var data=res.data.data;

                var chatCustomerList=data.lstDingMsgRecordDingKe;
                var total_not_read_count=data.not_read_count;
                var chat_last_max_id=0;
                if(chatCustomerList.length>0){
                  chat_last_max_id=chatCustomerList[chatCustomerList.length-1].id;
                }
                
                 // var new_chatCustomerList=that.data.chatCustomerList.concat(chatCustomerList);
                  that.setData({
                      chat_last_max_id:chat_last_max_id,
                      chatCustomerList:chatCustomerList,
                      total_not_read_count:total_not_read_count,
                  })
                  
              } else {
                  wx.showModal({
                      title: '提示',
                      content: '网络异常',
                      showCancel: false
                  })
                  
              }
          },
          fail: res => {
              wx.showModal({
                  title: '提示',
                  content: '网络异常',
                  showCancel: false
              })
              
          }
      })
  },
    selectMallCsrMsgRecord_Last(customer_id,shop_id) {
        //获取最新的消息
        var that = this
        wx.request({
            url: app.globalData.selectMallCsrMsgRecord_Last,
            //url: 'http://localhost:8080/evaluation_war/mall/selectMallCsrMsgRecord_Last',
            data: {
              customer_id: customer_id,
              shop_id: shop_id
            },
            method:'POST',
            success: res => {
                if (res.data.code == 1000) {
                    if(res.data.data!=null&&res.data.data.length>0){
                   
                        var msgRecord=res.data.data[0];
                        var chatCustomerList=that.data.chatCustomerList;
                        var total_is_not_read_count=0;
                        console.log(chatCustomerList)

                        var has_item=false;
                        for(var i=0;i<chatCustomerList.length;i++){
                            var oldItem=chatCustomerList[i];
                            if(
                              (msgRecord.wechat_type==1&&oldItem.customer_id==msgRecord.receiver_id)
                              ||
                              (msgRecord.wechat_type==2&&oldItem.customer_id==msgRecord.sender_id)
                              
                              ){
                                oldItem.lstMallCsrMsgRecord=res.data.data;
                                console.log("oldItem:",oldItem);
                                has_item=true;
                            }

                            if(oldItem.lstMallCsrMsgRecord.length!=0){

                                total_is_not_read_count=total_is_not_read_count+oldItem.lstMallCsrMsgRecord[0].customer_msg_not_read_count;
                            }
                        }

                        that.setData({
                            chatCustomerList:chatCustomerList,
                            total_is_not_read_count:total_is_not_read_count,
                        })

                        if(has_item==false){
                          //如果当前列表中，无客户信息，则查询最新记录
                          
                          that.selectMallCsrCustomerByShopId();
                        }
                        
                        
                    }
                }
            },
            fail: res => {
 
            }
        })
    },
    pageChangeEvent(e) {
        console.log(e)
        this.setData({
            pageIndex: e.currentTarget.dataset.current ? e.currentTarget.dataset.current : e.detail.current
        })
    },

    csrcustomerchat(e) {

      var mall_crs_customer=e.currentTarget.dataset.item;
      console.log(mall_crs_customer)
      var custInfo={
        avatar_url:mall_crs_customer.avatar_url,
        customer_id:mall_crs_customer.customer_id,
        customer_name:mall_crs_customer.customer_name,
        shop_id:mall_crs_customer.shop_id,
      };

      var staff=app.globalData.staffDetail;

      var staffInfo={
        staff_id:staff.id?staff.id:0,
        staff_name:staff.name?staff.name:'',
        shop_id:mall_crs_customer.shop_id,
        avatar_url:mall_crs_customer.avatar_url,
      }
      this.selectMallCsrCustomer_StorepersonnalDataShopId(custInfo,staffInfo);
        // wx.navigateTo({
        //     url: '../csrcustomerchat/csrcustomerchat?custInfo=' + JSON.stringify(custInfo)+'&staffInfo='+JSON.stringify(staffInfo),
        // })
    },

    selectMallCsrCustomer_StorepersonnalDataShopId(custInfo,staffInfo){

      wx.request({
        url: app.globalData.selectMallCsrCustomer_StorepersonnalDataShopId,	
        //url:'http://localhost:8080/evaluation_war/mall/selectMallCsrCustomer_StorepersonnalDataShopId',
        method: 'POST',
        data: {
          shop_id: custInfo.shop_id,
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {                  
          if(res.data.code!=1000){
            console.log(res.data.data);
            wx.showToast({
              title: '失败'+res.data.msg,
              icon:'error'
            })
          }else{
            var crsList=res.data.data.lstStorepersonnal;
            wx.navigateTo({
              url: '../csrcustomerchat/csrcustomerchat?custInfo=' + JSON.stringify(custInfo)+'&staffInfo='+JSON.stringify(staffInfo)+'&crsList='+JSON.stringify(crsList),
              })
          }      
        }
      })
    },

    returnBack() {
        wx.navigateBack({
            delta: 0,
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
    // initChatList(){
    //   var chatCustomerList=[];
    //     for(var i=0;i<30;i++){
    //       var item={
    //         customer_id:1,
    //         customer_code:300001,
    //         customer_name:'聊天客人'+i,
    //         avatar_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/smp/20240327_d001cbe1e94c4f889f0a52849f721f3c.jpeg',
    //       }
    //       chatCustomerList.push(item);
    //       item.customer_name='叮友'+i;
    //     }
    //     this.setData({
    //       chatCustomerList:chatCustomerList,
    //     })
    // },
    loadMoreDingChat(){
      var that=this;
      console.log("loadMoreDingChat")
      this.selectDingMsgRecordDingKeFromChat();
    },
    loadMoreDingYou(){
      var that=this;
      console.log("loadMoreDingYou")
      this.selectDingMsgRecordDingKeFromMemberInfo();
    },
    toDingKeChat(e) {
   
      var that=this;
      var meInfo={
            customer_id:this.data.ding_associate_id,
            customer_code:Number(app.globalData.customerInf.userCode),
            customer_name:app.globalData.customerInf.name?app.globalData.customerInf.name:'',
            avatar_url:app.globalData.customerInf.avatarUrl?app.globalData.customerInf.avatarUrl:this.data.avatarUrl,
      }
      var otherObj=e.currentTarget.dataset.item;
      var otherInfo={
        customer_id:otherObj.customer_id,
        customer_code:otherObj.customer_code,
        customer_name:otherObj.customer_name,
        avatar_url:otherObj.avatar_url,
      }
       wx.navigateTo({
             url: '/pages/mall/pages/dingkechat/dingkechat?&meInfo=' + JSON.stringify(meInfo)+'&otherInfo='+JSON.stringify(otherInfo),
         })
      
     
        
    },
    toDingKeSearch(e){
      var pageIndex=this.data.pageIndex;  
      if(pageIndex>1){
        return;
      }
       console.log("pageIndex:"+pageIndex)
        wx.navigateTo({
          url: '/pages/mall/pages/dingkesearch/dingkesearch?pageIndex='+pageIndex,
        })
    }
})