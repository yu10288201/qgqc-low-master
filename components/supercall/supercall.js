// components/supercall.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    
  },

  /**
   * 组件的初始数据
   */
  data: {
    callShow: false,
    fackyousevencolor: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
    fackyousevencolor1: "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png",
    flash: Object,
    flash1: Object
  },
  /**
   * 组件的方法列表
   */
  methods: {
    callShow(){
      let that = !this.data.callShow
      this.setData({
        callShow: that
      })
      if (getApp().globalData.spcallback) {
        getApp().globalData.spcallback(true)
      }
    },
    callHide(){
      this.setData({
        callShow: false
      })
    },
    callBZ(){
      this.triggerEvent("callBZ")
    },
    callFWY(){
      this.triggerEvent("callFWY")
    },
    startFlash(){
      let that = this
      console.log("部长闪烁")
      this.setData({
        flash: setInterval(function (){
          that.setData({
            fackyousevencolor : that.data.fackyousevencolor == "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_red.png" ? "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png" : "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_red.png"
          })
        },1000)
      })
    },
    stopFlash(){
      console.log("部长收到")
      clearInterval(this.data.flash)
      this.setData({
        fackyousevencolor : "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png"
      })
    },
    startFlash1(){
      let that = this
      console.log("服务员闪烁")
      this.setData({
        flash1: setInterval(function (){
          that.setData({
            fackyousevencolor1 : that.data.fackyousevencolor1 == "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_red.png" ? "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png" : "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_red.png"
          })
        },1000)
      })
    },
    stopFlash1(){
      console.log("服务员收到")
      clearInterval(this.data.flash1)
      this.setData({
        fackyousevencolor1 : "https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/btn/button_mid_green.png"
      })
    },
  }
})
