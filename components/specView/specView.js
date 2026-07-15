Component({
  properties: {
    choosedishesSpecArry:{
      type:Array,
      value:[]
    },
    choosedishesSpecIndex:{
      type:Number,
      value:-1
    },
    readOnly: {
      type: Boolean,
      value: false
    },
  },

  data: {

  },

  methods:{
    // 选中配菜
    chooseDishesSpec: function (e) {
      this.triggerEvent("chooseDishesSpec", e.currentTarget.dataset.index)
    },
  }

})