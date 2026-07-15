// components/supercall.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
      wineList: {
        type: Array,
        value: []
      },
    },
  
    /**
     * 组件的初始数据
     */
    data: {
  
    },
    /**
     * 组件的方法列表
     */
    mounted() {
  
    },
    methods: {
      onReachBottom() {
        this.triggerEvent("onReachBottom")
      },
      toWineDetail(e){
        console.log(e,"跳转酒品详情");
        let item = e.currentTarget.dataset.item
        this.triggerEvent("toWineDetail",item)
      }
    },
  
  })