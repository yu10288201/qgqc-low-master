const app = getApp()
// pages/mall_guide/mall_guide.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        to_mall_index_execed:false,
        current_count:5,
        timer:null,
        timer1:null,
        log_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/mall_log.png',
        content_text:'本平台与广东容易新能源有限公司确立了战略合作伙伴关系。为此，特别为“容易公司”的“充电会员”设置了一个“充电充值会员”的特别优惠的会员级别：“充电会员”只需在平台充值￥199.00元。就可获得1000.00元的购物卡，还可获得平台赠送的100.00元“充电券”（可在“容易公司”的充电平台充电使用），也能享受平台的“充值会员”同等的购物优惠，还可以在每次购物时获取平台赠送的“充电券”，可谓是多重优惠。',
        platform_member_rule_url:'',
        xxm_log:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/xxm_log.png?t=123',
        xxm_text:'“鲜仙米”的鲜米配送模式是最新的大米营销模式，可让千家万户十分方便的天天吃到新鲜的优质大米...'
    },
    toMallIndex(e){
      console.log("toMallIndex")
      if(app.globalData.isAuthorize==false){
        this.setData({
          current_count:5,
        })
        console.log("toMallIndex 重新获取openid")
        wx.showModal({
          title: '请稍后',
          content: '数据加载中，请稍后。。。',
          showCancel:false,
        })
        app.selectUnionID();
        return;
      }

      if(this.data.timer!=null){
        clearInterval(this.data.timer);
        this.setData({
          timer:null,
        })
      }
      if(this.data.timer1!=null){
        clearInterval(this.data.timer1);
        this.setData({
          timer1:null,
        })
      }
      this.setData({
        to_mall_index_execed:true,
      })
      
      var url='/pages/mall/pages/index/index'
        wx.navigateTo({
          url: url,
        })
    },

    toMallXXMIndex(e){
      //鲜仙米
      console.log("toMallXXMIndex")
      if(app.globalData.isAuthorize==false){
        this.setData({
          current_count:5,
        })
        console.log("toMallIndex 重新获取openid")
        wx.showModal({
          title: '请稍后',
          content: '数据加载中，请稍后。。。',
          showCancel:false,
        })
        app.selectUnionID();
        return;
      }

      if(this.data.timer!=null){
        clearInterval(this.data.timer);
        this.setData({
          timer:null,
        })
      }
      if(this.data.timer1!=null){
        clearInterval(this.data.timer1);
        this.setData({
          timer1:null,
        })
      }

      this.setData({
        to_mall_index_execed:true,
      })
      
      var url='/pages/mall/pages/index/index?categoryID=14&selectedCategory=xndm'
        wx.navigateTo({
          url: url,
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      var that=this;
      app.globalData.enter_shop_id_inited=true;
      app.globalData.enter_shop_id=21433;
      app.globalData.channel_type_path='/pages/mall/pages/batteryrecharge/batteryrecharge';

      var timer1=setInterval(function(){

          if(app.globalData.openid){

            app.insertMemberInfoExec(app.globalData.enter_shop_id,app.globalData.openid)
            if(that.data.timer1!=null){
              clearInterval(that.data.timer1);
              that.setData({
                timer1:null,
              })
            }
            
          }

      },1000);
      this.setData({
        timer1:timer1
      })

      // var timer=setInterval(function(){
      //   var current_count=that.data.current_count;
      //   if(current_count>0){
      //     current_count=current_count-1;
      //   }
      //   that.setData({
      //     current_count:current_count,
      //   });

      //   if(current_count==0){
      //     if(that.data.to_mall_index_execed==false){
      //       that.toMallIndex();
      //     }
      //   }
      // },1000);
      // this.setData({
      //   timer:timer
      // })

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
      
      app.globalData.channel_type_path='/pages/mall/pages/batteryrecharge/batteryrecharge';
      this.selectSingleShop();
        
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
    selectSingleShop(){
      var that=this;
      wx.request({
        url: app.globalData.selectSingleShop,        
        method: 'GET',
        data: {                
            shop_id: 8888,                       
        },
        header: {
            'content-type': 'application/json'
        },
        success: function (res) {
          console.log(res)
            if(res.data.code == 1000){
                 console.log(res.data.data);
                 var shopVo=res.data.data;
                 that.setData({
                    platform_member_rule_url:shopVo.platform_member_rule_url,
                 })
            }                                
        },
        fail:function(err){
          wx.showToast({
            title: '网络异常1',
            icon:'error'
          })
        },
    })
    },
    openRuleFile(e){
    
      var that=this;
      var ruleFileAddress='https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/XDYT/upload/20903/file/113513充整预存优惠规则.docx';
      ruleFileAddress=this.data.platform_member_rule_url;
      
      wx.downloadFile({ //运用微信自带的方法对该链接进行下载转换获取到临时的可供微信使用的链接
        url: ruleFileAddress,
  
        success(res2) {
          that.setData({
            tempFilePath: res2.tempFilePath
          })
          wx.openDocument({ //打开这个临时链接，也就是打开文件，这里可以两个方法整合在一起，作为一个打开文件按钮
            filePath: that.data.tempFilePath,
            success: function (res3) {
            },
            fail: function () {
              wx.showModal({
                title: '提示',
                content: '没有找到可以使用的打开工具',
              })
            }
          })
  
        }
      })

    },
})