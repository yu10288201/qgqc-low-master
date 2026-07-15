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
        ding_key_word:'',
        page_size:20,
        phone:'',//手机号
        nickname:'',//昵称
        tmp_nick_name:'',
        avatarUrl: defaultAvatarUrl,//默认头像
        def_avatar_url:defaultAvatarUrl,//默认头像
        chatCustomerList: [],
        dingYouList:[],
        total_not_read_count:0,//未读消息数
        
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      
        var pageIndex=0;
        if(options.pageIndex){
          pageIndex=Number(options.pageIndex);
        }
        this.setData({
          ding_associate_id:app.globalData.customerInf.id?Number(app.globalData.customerInf.id):0,
        })
        this.setData({
          pageIndex:pageIndex,
        })
        if(pageIndex==0){
          wx.setNavigationBarTitle({
            title: '叮聊搜索'
            })
            this.selectDingMsgRecordDingKeFromChat();
        }else if(pageIndex==1){
          wx.setNavigationBarTitle({
            title: '通讯录搜索'
            })
            this.selectDingMsgRecordDingKeFromMemberInfo();
          
        }
  
       
        
    },

    selectDingMsgRecordDingKeFromMemberInfo() {
        console.log("selectDingMsgRecordDingKeFromMemberInfo")
        let that = this
        
        wx.showLoading({
            title: '请稍后',
        })
        var ding_associate_id=this.data.ding_associate_id;
        var ding_key_word=this.data.ding_key_word;
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
                ding_key_word:ding_key_word,
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
      //是查询所有的聊天记录
      console.log("selectDingMsgRecordDingKeFromChat")
      let that = this
      var customer_code=Number(app.globalData.customerInf.userCode);
      var ding_key_word=this.data.ding_key_word;
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
      var chat_last_max_id=this.data.chat_last_max_id;
      var page_size=this.data.page_size;
      wx.request({
          url: app.globalData.selectDingMsgRecordDingKeFromChat,
        //url: 'http://localhost:8080/evaluation_war/mall/selectMallCsrCustomerByShopId',
          data: {
              last_max_id:chat_last_max_id,
              page_size:page_size,
              customer_code:customer_code,
              ding_key_word:ding_key_word,
          },
          method:'POST',
          success: res => {

              console.log("selectDingMsgRecordDingKeFromChat")
              console.log(res)
              if (res.data.code == 1000) {

                      var data=res.data.data;
                      var chatCustomerList=data.lstDingMsgRecordDingKe;
                      var total_not_read_count=data.not_read_count;
                      that.setData({
                        chat_last_max_id:chat_last_max_id,
                        chatCustomerList:chatCustomerList,
                        total_not_read_count:total_not_read_count,
                    })
                
               
                
                 // var new_chatCustomerList=that.data.chatCustomerList.concat(chatCustomerList);
                  
                  
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
    searchDingKe(e){
      var pageIndex=this.data.pageIndex;
      
      if(pageIndex==0){
        wx.setNavigationBarTitle({
          title: '叮聊搜索'
          })
          this.selectDingMsgRecordDingKeFromChat();
      }else if(pageIndex==1){
        wx.setNavigationBarTitle({
          title: '通讯录搜索'
          })
          this.setData({
            mi_last_max_id:INT_MAX,
          })
          this.selectDingMsgRecordDingKeFromMemberInfo();
        
      }
    }
})