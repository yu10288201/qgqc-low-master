const app = getApp()
// pages/mall_guide/mall_guide.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        to_mall_index_execed:false,
        q:'',
        current_count:3000,
        show_current_count:3,
        timer:null,
        is_give_vip:0,
        log_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/mall_log.png',
        is_voucher_deduction:0,
        scan_staff_shop_id:0,
        scan_staff_id:0,
        scan_uuid:'',
        category_id:0,
        selected_category:'qbsp',
    },
    toMallIndex(e){
      console.log("toMallIndex")
      if(app.globalData.isAuthorize==false){
        this.setData({
          current_count:1000,
          show_current_count:1,
        })
        console.log("toMallIndex 重新获取openid")
        app.selectUnionID();
        return;
      }else{
        console.log('this.data.is_give_vip==1');
        if(this.data.is_give_vip==1){
          this.setData({
            q:'this.data.is_give_vip==1',
          })
          //调用giveMallMemberVip后跳转
            this.giveMallMemberVip();
            return;
        }
      }
      this.end_exec();
    },
    end_exec(){
      if(this.data.timer!=null){
        clearInterval(this.data.timer);
        this.setData({
          timer:null,
        })
      }
      this.setData({
        to_mall_index_execed:true,
      })

      var is_voucher_deduction=this.data.is_voucher_deduction;
      var scan_staff_shop_id=this.data.scan_staff_shop_id;
      var scan_staff_id=this.data.scan_staff_id;
      var scan_uuid=this.data.scan_uuid;

      
      var url='/pages/mall/pages/index/index?is_voucher_deduction='+is_voucher_deduction+'&scan_staff_shop_id='+scan_staff_shop_id+"&scan_staff_id="+scan_staff_id+'&scan_uuid='+scan_uuid+'&category_id='+this.data.category_id+'&selected_category='+this.data.selected_category;
      
        wx.navigateTo({
          url: url,
        })

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
      var that=this;	
      console.log("mall_guid onLoad")
      console.log(options);
      if(options.category_id){
        this.setData({
          category_id:Number(options.category_id),
        })
      }
      if(options.selected_category){
        this.setData({
          selected_category:options.selected_category,
        })
      }
      if (options.q) {	
        // that.setData({
        //   is_give_vip:1,
        // })	
        let url = decodeURIComponent(options.q) 
        that.setData({
          q:url,
        })	  
        if (url.indexOf('https://') != -1 && url.indexOf('?is_give_vip=') != -1) {

          let str1 = decodeURIComponent(url).substring(decodeURIComponent(url).indexOf('?is_give_vip='))        
          console.log(str1)
          let a = JSON.parse(str1.replace(/\?/g, "{\"").replace(/=/g, "\":\"").replace(/&/g, "\",\"") + "\"}")			
          if(url.indexOf('is_give_vip')!= -1){
            var is_give_vip=Number(a.is_give_vip);
            if(is_give_vip==1){
              that.setData({
                is_give_vip:1,
              })
            }
          }

          if(url.indexOf('is_voucher_deduction')!= -1){
              var is_voucher_deduction=Number(a.is_voucher_deduction);
              if(is_voucher_deduction==1){
                that.setData({
                  is_voucher_deduction:1,
                })
              }
          }
          if(url.indexOf('scan_staff_shop_id')!= -1){
            var scan_staff_shop_id=Number(a.scan_staff_shop_id);
            if(scan_staff_shop_id>0){
              that.setData({
                scan_staff_shop_id:scan_staff_shop_id,
              })
            }
        }

        if(url.indexOf('scan_uuid')!= -1){
         
          var scan_uuid=a.scan_uuid;
          that.setData({
            scan_uuid:scan_uuid,
          })
      }

       
        if(url.indexOf('scan_staff_id')!= -1){
          var scan_staff_id=Number(a.scan_staff_id);
          if(scan_staff_id>0){
            that.setData({
              scan_staff_id:scan_staff_id,
            })
          }
      }
         

      }
    }
        

      if(app.globalData.enter_shop_id_inited==false){
        app.globalData.enter_shop_id_inited=true;
        app.globalData.enter_shop_id=8888;
      }

      var timer=setInterval(function(){
        var current_count=that.data.current_count;
        if(current_count>0){
          current_count=current_count-1000;
        }
        var show_current_count=Math.floor(current_count/1000);
        that.setData({
          current_count:current_count,
          show_current_count:show_current_count,
        });

        if(current_count==0){
          if(that.data.to_mall_index_execed==false){
            that.toMallIndex();
          }
        }
      },1000);
      this.setData({
        timer:timer
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
    giveMallMemberVip(){
      console.log('giveMallMemberVip:');
      let that = this
      var url=app.globalData.giveMallMemberVip;
      
      wx.request({
          url: url,
          method: "POST",
          data:{
            customer_openid:app.globalData.openid,
          },
          success(res) {
            that.end_exec();
            
             console.log(res)
          }
      })
    }
})