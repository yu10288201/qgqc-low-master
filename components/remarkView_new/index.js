// components/remarkView/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    lock:{
      type: Boolean,
      value:false
    },
    isIntroduction:{
      type: Boolean,
      value:false
    },
    remarkType:{  // 快捷备注的备注类型： 0-订单 1-菜品
      type: Boolean,
      value:false
    },
    onHide:{
      type: Boolean,
      value:false
    },
    tastesRemark:{
      type: String,
      value:''
    },
    readOnly:{
      type:Boolean,
      value:false
    },
    placeholderStr:String,
    remarkTitle:{
      type:String,
      value:"请输入备注。"
    },
    remarkValue:{
      type: String,
      value:''
    },
    quickRemark:{
      type:String,
      value:''
    },
    spec_type:{
      type:Number,
      value:''
    },
    specal_type:{
      type:Number,
      value:''
    },
    xdqspec_type:{ //多拼粥下单前
      type:Number,
      value:''
    },
    dggspec_type:{ //单规格
      type:Boolean,
      value:false
    },
    temp:{ //临时菜
      type:Boolean,
      value:false
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    menu_img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/膳食掌柜/index/menu.png',
    // placeholder:"."
  },

  lifetimes: {
    attached: function () {
      // var that = this
      // 在组件实例进入页面节点树时执行
      console.log("remarkView_new attached");
      // setTimeout(function(){
      //   that.setData({placeholder:""})
      //   console.log(that.data.placeholder)
      // },100)
    },
    detached: function () {
      // 在组件实例被从页面节点树移除时执行
      console.log("remarkView_new detached");
      this.triggerEvent("hideRemark");
    },
  },

  /**
   * 组件的方法列表
   */
  methods: {
    remarks: function (e) {
      this.triggerEvent('remarkBack', {
        remarkText: e.detail.value
      }, {})
    },
    
    showRemarkList: function (e) {
      this.triggerEvent('showRemarkList',{
        a:1
      })
    },
    showNoOpen:function(e){
      wx.showToast({
        icon: 'none',
        title: '不能操作',
      })
    },

    reInit:function(remarksStr){
      this.setData({
        remarkValue : remarksStr
      })
    },

    changeLock:function(){
      this.setData({
        lock:!this.data.lock
      })
    },
    dpzchangeLock:function(){
      this.setData({
        lock:!this.properties.lock
      })
    }
  }
})