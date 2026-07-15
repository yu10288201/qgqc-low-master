// pages/order/order.js
//获取应用实例
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dishesId: '',
    statu: '', //判断是从menu进来的还是order_detail进来的    0：order_detail进来的   1：menu进来的
    num: 1,
    chooseMeal: [],
    constituteTypeList: [],
    totalPrice: 0,
    id: 0, //order_detail 的ID
    image:'',
  },
  onLoad: function (e) {
    this.setData({
      dishesId: e.dishesId,
      statu: e.statu
    })

    if (e.statu == 1) {
      this.getDishesInfo()
    } else {
      if (e.id) {
        wx.request({
          url: app.globalData.SelectDishesSetMealTypeSel,
          // url: 'http://192.168.8.163:8080/WX Restaurant/SelectDishesSetMealTypeSel',
          data:{
            order_detailed_id:e.id
          },
          success:res =>{
           if (res.data.result.result == 1) {
            this.setData({
              constituteTypeList:res.data.object
            })
           }
          }
        })



        this.setData({
          id: e.id,
          dishes_name: e.dishes_name,
          totalPrice: e.item_subtotal,
          num: e.item_number,
          image:e.image
        })
      }else {
        // let constituteTypeListTemp = JSON.parse(e.constituteTypeList)
      
      let constituteTypeList = JSON.parse(e.constituteTypeList)

      // let statu = true
      //   constituteTypeListTemp.forEach(e =>{
      //     let temp = {
      //       lstSetMealConstitute:[]
      //     }
          
      //     constituteTypeList.forEach(eee =>{
      //       if (eee.constituteTypeName == e.constituteTypeName) {
      //         statu = false;
      //       }
      //     })

      //     if (statu) {

      //       e.lstSetMealConstitute.forEach(el=>{
      //           temp.constituteTypeName = e.constituteTypeName
      //           if (!el.isChoose) {
      //             temp.lstSetMealConstitute.push(el)
      //           }
  
      //       })
            
  
      //       constituteTypeList.push(temp)
      //     }else {
      //       constituteTypeList.forEach(eaa =>{
      //         if (eaa.constituteTypeName == e.constituteTypeName) {
  
      //           e.lstSetMealConstitute.forEach(ee => {
      //             if (!ee.isChoose) {
      //               eaa.lstSetMealConstitute.push(ee)
      //             }
      //           })
      //         }
      //       })
      //     }
      //     statu = true
        
      // })

      this.setData({
        dishes_name: e.dishes_name,
        totalPrice: e.item_subtotal,
        num: e.item_number,
        constituteTypeList:constituteTypeList,
        image:e.image
      })
      }

      
    }
  },
  getDishesInfo() {
    wx.request({
      url: app.globalData.GetDishes,
      // url: 'https://test.fsmbdlkj.com/WX Restaurant/GetDishes',
      data: {
        Dishes_id: this.data.dishesId
      },
      success: res => {

        let lstSetMealConstituteType = res.data.object.lstSetMealConstituteType
        let list = []
        let statu = true
          
        lstSetMealConstituteType.forEach(e=>{
          if (e.constituteTypeCount == -1) {
            if (list.length > 0) {
            
              list.forEach(eee => {
                if (eee.constituteTypeName == e.constituteTypeName && eee.constituteTypeCount == -1) {
                  e.lstSetMealConstitute.forEach(el=>{
                    eee.lstSetMealConstitute.push(el)
                    statu = false
                  })
                }
              })

              if (statu) {
                list.push(e)
              }
             

            }else {
              list.push(e)
            }
            statu = true
          }else {
            list.push(e)
          }
        })
      

        this.setData({
          // list:list,
          dishes: res.data.object,
          dishes_name: res.data.object.dishes_name,
          totalPrice: res.data.object.dishes_price,
          // constituteTypeList: res.data.object.lstSetMealConstituteType
          constituteTypeList: list,
          image:res.data.object.big_dishes_img
        })
      }
    })
  },

  chooseChange: function (e) {
    // 直接拉一大坨shi
    var that = this
    var item = e.currentTarget.dataset.item //选中的  constituteTypeList
    var chooseindex = e.currentTarget.dataset.chooseindex // 选中 constituteTypeList.setMealConstituteList 的下标
    var chooseMeal = that.data.chooseMeal //已选的 constituteTypeList 的下标数组
    var index = e.currentTarget.dataset.index //选中的constituteTypeList 的下标
    var g = true
    var chooseMealIndex = []
    //切换数组
    if (chooseMeal[index]) {
      chooseMealIndex = chooseMeal[index]
    }
    //遍历数组，是否重新点
    for (let x = 0; x < chooseMealIndex.length; x++) {
      if (chooseMealIndex[x] == chooseindex) {
        chooseMealIndex.splice(x, 1)
        g = false
      }
    }
    if (g) {
      chooseMealIndex.push(chooseindex)
    }
    chooseMeal[index] = chooseMealIndex
    that.setData({
      chooseMeal: chooseMeal, // 已选constituteTypeList的下标
      chooseMealIndex: chooseMealIndex, //已选 constituteTypeList.lstSetMealConstitute的下标
    })
    let d = []
    //判断 已选个数 是否等于 可选数
    if (that.data.chooseMealIndex.length == item.choosableCount) {
      //遍历   constituteTypeList.lstSetMealConstitute 数组
      for (var i = 0; i < item.lstSetMealConstitute.length; i++) {
        //判断 已选数组是否含有 constituteTypeList.lstSetMealConstitute的下标
        if (that.data.chooseMealIndex.indexOf(i) == -1) {
          item.lstSetMealConstitute[i].isChoose = true
        } else {
          d.push(item.lstSetMealConstitute[i]) //d  已选的lstSetMealConstitute
          item.lstSetMealConstitute[i].isChoose = false
        }
      }
      var constituteTypeList1 = that.data.constituteTypeList //用于修改回显
      constituteTypeList1[index] = item
      that.setData({
        constituteTypeList: constituteTypeList1,
        chooseMealIndex: [],
      })
    } else {
      for (var i = 0; i < item.lstSetMealConstitute.length; i++) {
        item.lstSetMealConstitute[i].isChoose = false
      }
      var constituteTypeList1 = that.data.constituteTypeList
      constituteTypeList1[index] = item
      that.setData({
        constituteTypeList: constituteTypeList1
      })
    }
  },

  bindPlus() {
    let dishes = this.data.dishes
    let num = ++this.data.num


    this.setData({
      totalPrice: Number(dishes.dishes_price) * Number(num),
      num: num
    })
  },
  bindMinus() {
    let num = this.data.num
    if (num <= 1) {
      return;
    }
    num--;
    let dishes = this.data.dishes
    this.setData({
      num: num,
      totalPrice: Number(this.data.totalPrice) - Number(dishes.dishes_price)
    })
  },

  addDishNew: function (e) {
    var that = this

    if (that.data.constituteTypeList) {
      for (let x of that.data.constituteTypeList) {
        let num = 0
        if (x.choosableCount != -1) {
          for (let a of x.lstSetMealConstitute) {
            if (!a.isChoose) {
              num++
            }
          }
          if (num != x.choosableCount) {
            wx.hideLoading({
              success: (res) => {},
            })
            wx.showToast({
              title: '请选择菜品',
              duration: 1500,
              icon: "error"
            })
            return;
          }
        }
      }
    }

    const pages = getCurrentPages()
    const prevPage = pages[pages.length - 2]
    let cartList = prevPage.data.cartList




    const dishes = this.data.dishes


    let copyOrder = 1


    if (prevPage.data.difference_flag && prevPage.data.locationindex == 3) {
      var item_type = 2;
    } else {
      var item_type = 0;
      if (Number(app.globalData.subSeatsNum) > 1) {
        copyOrder = Number(app.globalData.subSeatsNum)
      }
    }


    var constituteTypeList = this.data.constituteTypeList

    constituteTypeList.forEach(e => {
      e.dishesId = this.data.dishesId
      e.shopId = app.globalData.shopid
      e.lstSetMealConstitute.forEach(el => {

        if (e.constituteTypeCount == -1) {
          el.isChoose = false

        }
      })

    })

    // this.setData({
    //   constituteTypeList
    // })
    // return;
    let newDish = {
      "name": dishes.dishes_name,
      "price": dishes.dishes_price ? dishes.dishes_price : 0,
      "dishes_price": dishes.dishes_price ? dishes.dishes_price : 0,
      "number": this.data.num,
      "tempNumber": this.data.num,
      "sum": this.data.totalPrice ? this.data.totalPrice : 0,
      "img_url": dishes.dishes_img,
      "big_img_url": dishes.big_dishes_img,
      "dishes_id": dishes.dishes_id,
      "spec_name": '套',
      "spec_type": dishes.spec_type,
      "dishes_metering_type": '套',
      "dishes_spec_type": dishes.spec_type, //是否多规格
      "disher_weight": 0,
      "specal_type": dishes.specal_type,
      "weighing": dishes.weighing,
      // "dishes_introduce": dishes_introduce,
      "remark": '',
      "decdishes_flag": 1, //1为此为减菜前点的商品，不能改动
      "adddishes_flag": 0, //1为此为加菜前点的商品，不能改
      "dishes_status": 0,
      "u_item_number": 0,
      "item_type": item_type,
      "sideDisht": '',
      "tastes": '',
      "tastesRemark": '',
      "hadOrdered": false,
      "freeOrder": 0,
      "repairOrder": 0,
      "copyOrder": copyOrder,
      "waitOrder": 0,
      "baleOrder": 0,
      "transferOrder": 0,
      "depositOrder": 0,
      "jointSet": '',
      "vip_price": dishes.vip_price ? dishes.vip_price : 0,
      constituteTypeList: constituteTypeList
    }

    prevPage.setData({
      // cartList:cartList,
      [`cartList[${cartList.length}]`]: newDish
    })

    // cartList.push(newDish)
    app.globalData.cartList = cartList


    wx.navigateBack({
      success: function () {}
    }); //关闭当前页面，返回上一个页面
  },

})