// pages/order/order.js
//获取应用实例

var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.js');
var qqmap = new QQMapWX({
  //在腾讯地图开放平台申请密钥 http://lbs.qq.com/mykey.html

  key: 'V2QBZ-KVOKQ-3QS5T-GDXJD-SNQFQ-GKBVE' //此处为个人秘钥,可用老板手机号申请公司的秘钥

});

const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    is_add: 1,
    from_page: '',
    //地址选择相关
    downSVGIcon:'data:image/svg+xml,%3Csvg%20t%3D%221688612613352%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%221452%22%20width%3D%2264%22%20height%3D%2264%22%3E%3Cpath%20d%3D%22M517.688889%20796.444444c-45.511111%200-85.333333-17.066667-119.466667-51.2L73.955556%20381.155556c-22.755556-22.755556-17.066667-56.888889%205.688888-79.644445%2022.755556-22.755556%2056.888889-17.066667%2079.644445%205.688889l329.955555%20364.088889c5.688889%205.688889%2017.066667%2011.377778%2028.444445%2011.377778s22.755556-5.688889%2034.133333-17.066667l312.888889-364.088889c22.755556-22.755556%2056.888889-28.444444%2079.644445-5.688889%2022.755556%2022.755556%2028.444444%2056.888889%205.688888%2079.644445L637.155556%20739.555556c-28.444444%2039.822222-68.266667%2056.888889-119.466667%2056.888888%205.688889%200%200%200%200%200z%22%20fill%3D%22%23333333%22%20p-id%3D%221453%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
    region: ['全部', '全部', '全部'],
    location_show:'',
    customItem: '全部',
    customer_address:{
      id:0,	 
	    buyer_id: app.globalData.customerInf.id,
      customer_id:0,
      is_default:0,
      is_delete:0,
      name:'',
      province:'',
      city:'',
      county:'',
      apartment_complex:'',
      location:'',
      detail_address:'',
      mobile:'',
      create_datetime:''
    },
    is_default_check: false,
  },
  bindinputName:function(e){
    this.setData({
      "customer_address.name":e.detail.value,
    })
  },
  bindinputMobile:function(e){
    this.setData({
      "customer_address.mobile":e.detail.value,
    })
  },
  bindinputApartmentComplex:function(e){
    this.setData({
      "customer_address.apartment_complex":e.detail.value,
    })
  },
  
  bindinputLocation:function(e){
    this.setData({
      "customer_address.location":e.detail.value,
    })
  },
  bindinputDetailAddress:function(e){
    this.setData({
      "customer_address.detail_address":e.detail.value,
    })
  },
  isDefaultCheckChange:function(){
    
    var is_default=0;
    if(this.data.customer_address.is_default==0){
      is_default=1;
    }
    this.setData({
      "customer_address.is_default":is_default,
    })
    

  },
  locationTap:function(){
    console.log(this.data.customer_address.mobile);   
    this.setData({
      "customer_address.mobile":"测试手机号",
    })
    
  },
  remarkInput(e) {
    let that = this;
    that.setData({
      goods_remark: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.from_page){
      this.setData({
        from_page:options.from_page,
      })
    }  
    var is_add=options.is_add;
    this.setData({
      is_add:is_add,
    })
    if(is_add==0){
      let item=JSON.parse(options.item);
      this.setData({
        customer_address:item,
      })
      var region=["全部","全部","全部"]
      if(item.province!=""&&item.province!="全部"){
        region[0]=item.province;
      }
      if(item.city!=""&&item.city!="全部"){
        region[1]=item.city;
      }
      if(item.county!=""&&item.county!="全部"){
        region[2]=item.county;
      }
      this.setRegionData(region);
     

    }else{
      this.selectCustomerInfByOpenIdNew();
    }

    // console.log(JSON.stringify(options))
    // this.setData({
    //   focus_path: JSON.stringify(options)
    // })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
  },

  selectConstitute: function (e) { //阶梯价
    var that = this
    that.setData({
      chooseMealIndex: [],
      chooseMeal: [],
    })

    
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    app.globalData.deliveryAddressInf = '';
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  getLocation:function(){
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
          console.log("经纬度：" + "(" + res.latitude + "," + res.longitude+")")
          var result1 = require('../../../../utils/util').transformFromWGSToGCJ( res.latitude, res.longitude);
          that.setData({
            myLatitude: result1.latitude,
            myLongitude: result1.longitude
          })
        //用腾讯地图的api，根据经纬度获取城市
        qqmap.reverseGeocoder({
          location: {
            latitude: result1.latitude,
            longitude: result1.longitude
          },
          success: function (res) {
            console.log(res,"所在地地图位置111");
            var a = res.result.address_component
            //获取市和区（区可能为空）
            that.setData({
              "customer_address.location": a.province+a.city,
            }) 
          },
          fail: function (res) {
            console.log('获取地址失败' + res);
          },
          complete: function (res) {
     
          }
        })

      },fail : function(res){
        console.log(res);
        
      }
    })
  },
  save_address:function(){
    let that = this
    var url=app.globalData.allUrl.updateMallBaseBuyerAddress;
    if(this.data.is_add==1){
      url=app.globalData.allUrl.insertMallBaseBuyerAddress;
    }    
   
    var customer_address=this.data.customer_address;

    customer_address.customer_id=app.globalData.customerInf.id;
    customer_address.buyer_id=app.globalData.customerInf.id;

    var region=this.data.region;

    if(region[0]=="全部"||region[1]=="全部"||region[2]=="全部"){
      wx.showToast({
        title: '请选择完整所在地',
        icon:'error',
      })
      return;
    }


    wx.request({
      
      url:url,
      method: 'POST',
	    data: customer_address,	 
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
         if(res.data.code==1){
          wx.showToast({
            title: '操作成功',
            complete:function(){
              wx.navigateBack({ 
                delta: 1, 
                })
            },
          })
           
         }else{
           wx.showToast({
             title: '操作失败',
             icon:'error',
           })
         }
      }
    });


  
  },
  getPhoneNumber (e) {

    var that = this
   
    wx.login({
    success: function (res) {
        if (res.code) {
        var code = res.code
        wx.request({
            url: app.globalData.allUrl.QGQCPhoneServlet,
            data: {
            code: code,
            encryptedData: e.detail.encryptedData,
            iv: e.detail.iv,
            wechatAppId: app.globalData.wechatAppId,
            },
            dataType:'json',
            header: {
                //'content-type': 'application/x-www-form-urlencoded;charset=utf-8' // 默认值
                'content-type': 'application/json'
              },
            method: 'POST',
            success: function (res) {
            console.log(res)
            if (res.errMsg == 'request:ok') {
                if (res.data.code!=1000) {
                    wx.showModal({
                        title: '提示',
                        content: ''+res.data.data.msg,
                        showCancel: false,
                        confirmText: '好的'
                    })
                    return;
                }
                that.setData({
                  "customer_address.mobile": res.data.data.phoneNumber
                })
                var data={
                    openid: app.globalData.openid,
                    phone:res.data.data.phoneNumber
                }
                var url=app.globalData.updateCustomerPhoneByOpenId;
                that.updateCustomerByOpenId(data,url);

            } else {
                wx.showModal({
                title: '错误',
                content: '获取失败',
                })
            }
            }
        })
        }
    }
    })

  },
  updateCustomerByOpenId(data,url){
    //avatarUrl  name phone  更新接口 
    var that =this;
    wx.showLoading("提交中");
       wx.request({
           //url: app.globalData.UpdateCustomerByOpenId_Url,
           url:url,
           data: data,
           method: 'POST',
           dataType:'json',
           success: res => {
            wx.hideLoading();
                   console.log(res);
                   if(res.data.code==1000){
                       //成功
                       that.selectCustomerInfByOpenIdNew();
                       console.log("成功")
                   }else{
                       wx.showToast({
                         title: '失败'+res.data.result,
                       })
                   }
                   //获取头像等信息     
           },
           fail:function(err){
              wx.hideLoading();
              wx.showToast({
                title: '网络异常',
                icon:'error'
              })
           }
       });

 },
 selectCustomerInfByOpenIdNew(){
   console.log("selectCustomerInfByOpenIdNew");
   var data={
       openid: app.globalData.openid,
   }
   var that=this;
       wx.request({
           //url: app.globalData.UpdateCustomerByOpenId_Url,
           url:app.globalData.selectCustomerInfByOpenIdNew,
           data: data,
           method: 'POST',
           dataType:'json',
           success: res => {
                   console.log(res);
                   if(res.data.code==1000){
                       //成功
                       console.log("成功")
                       var mobile=res.data.data.phone;
                       var name =res.data.data.name;
                       var avatarUrl=res.data.data.avatarUrl;
                       that.setData({
                        "customer_address.mobile": mobile
                      })
                   }
                   //获取头像等信息     
           },
           complete:res=>{
            
           }
       });

 },
 bindRegionChange: function (e) {
  console.log('picker发送选择改变，携带值为', e.detail.value)
  var region=e.detail.value;
  if(region.length!=3){
    return;
  }
  this.setRegionData(region);

  // var location=region[0]+" "+region[1]+" "+region[2];
  // var location_show="";
  // location_show+=(region[0]!="全部"?region[0]:'')
  // location_show+=" "+(region[1]!="全部"?region[1]:'')
  // location_show+=" "+(region[2]!="全部"?region[2]:'')

  // that.setData({
  //   "customer_address.province": region[0]!="全部"?region[0]:'',
  //   "customer_address.city": region[1]!="全部"?region[1]:'',
  //   "customer_address.county": region[2]!="全部"?region[2]:'',
  // })

  // this.setData({
  //   region: region,
  //   location:location,
  //   location_show:location_show,
  // })

},
setRegionData(region){
  var that=this;
      var location=region[0]+" "+region[1]+" "+region[2];
      var location_show="";
      location_show+=(region[0]!="全部"?region[0]:'')
      location_show+=" "+(region[1]!="全部"?region[1]:'')
      location_show+=" "+(region[2]!="全部"?region[2]:'')
      that.setData({
        "customer_address.province": region[0]!="全部"?region[0]:'',
        "customer_address.city": region[1]!="全部"?region[1]:'',
        "customer_address.county": region[2]!="全部"?region[2]:'',
      })
      this.setData({
        region: region,
        location:location,
        location_show:location_show,
      })
},
  chooseAddr(e){
    var that=this;
    wx.chooseAddress({
      success (res) {
      
        console.log("wx.chooseAddress 成功");
        console.log(res)
        console.log(res.userName)
        console.log(res.postalCode)
       
//         customer_address.name
// customer_address.mobile
// location_show
// customer_address.apartment_complex
// customer_address.detail_address

        if(res.provinceName&&res.cityName&&res.countyName){
          var region=[];          
          region.push(res.provinceName);
          region.push(res.cityName);
          region.push(res.countyName);
          that.setRegionData(region);
        }

        var customer_address=that.data.customer_address;
        customer_address.name=res.userName;
        customer_address.mobile=res.telNumber;
        customer_address.detail_address=res.provinceName+res.cityName+res.countyName+res.detailInfo;

        that.setData({
          customer_address:customer_address,
        })
        
        console.log(res.provinceName)
        console.log(res.cityName)
        console.log(res.countyName)

        console.log(res.detailInfo)
        console.log(res.nationalCode)
        console.log(res.telNumber)

        // var content="userName:"+res.userName
        // +"   postalCode:"+res.postalCode
        // +"   nprovinceName:"+res.provinceName
        // +"   cityName:"+res.cityName
        // +"   countyName:"+res.countyName
        // +"   detailInfo:"+res.detailInfo
        // +"   nationalCode:"+res.nationalCode
        // +"  telNumber:"+res.telNumber

        // wx.showModal({
        //   title: '选取收货地址',
        //   content: ''+content,
        //   showCancel:false,
        //   complete: (res) => {
        //     if (res.cancel) {
              
        //     }
        
        //     if (res.confirm) {
              
        //     }
        //   }
        // })


      },
      fail(err){
        console.log("wx.chooseAddress 失败");
        console.log(err)
      }
      
    })
  },

})