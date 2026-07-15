// pages/mall/pages/outfitpersonsearch/outfitpersonsearch.js
const app=getApp();
Page({


    /**
     * 页面的初始数据
     */
    data: {
      person_array:[],
      
      
      name:'',
      remark:'',
      isLoading:false,
      isOver:false,
      scrollTop:0,
      page_index:1,
      personDialogShow:false,
      tmp_name:'',

      ding_select_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ding_select.png',
      ding_not_select_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ding_not_select.png',
      is_default:1,
      index:0,
     
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
       this.queryClick();
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
    queryClick(e){
      if(this.data.isLoading==true){
        return;
      }

      this.setData({
        isLoading:false,
        isOver:false,
        scrollTop:0,
        page_index:1,
      })
      this.mallOutfitPersonSelectAllMallOutfitPersonByCustomerId();
  

    },
    mallOutfitPersonSelectAllMallOutfitPersonByCustomerId(){
      //查询
          var that=this;
          if(this.data.isLoading==true||this.data.isOver==true){
            return;
          }

          var url=app.globalData.mallOutfitPersonSelectAllMallOutfitPersonByCustomerId;
       
          var data={
            customer_id:app.globalData.customerInf.id,
            name:this.data.name,
            remark:this.data.remark,
            page_index:that.data.page_index,
          }

          console.log(url);
          wx.showLoading({
            title: '加载中',
          })
          wx.request({
            url: url,
            data:data,
            method:'POST',
            success:function(res){
              console.log(res)
              wx.hideLoading();
              that.setData({
                isLoading:false,
              })
              if(res.data.code!=1000){
                wx.showToast({
                  title: ''+res.data.data.msg,
                  icon:'none',
                })
              }else{
                if(res.data.data.length==0){
                    that.setData({
                      isOver:true,
                    })
                }
                if(that.data.page_index==1){
                  that.setData({
                    person_array:res.data.data,
                  })
                }else{
                   var person_array=that.data.person_array; 
                    for(var i=0;i<res.data.data.length;i++){
                      person_array.push(res.data.data[i]);
                    }
                    that.setData({
                      person_array:person_array,
                    })
                }

                
                
                console.log(that.data.person_array);
              }
    
            },
            fail:function(err){
              wx.hideLoading();
              that.setData({
                isLoading:false,
              })
              console.log(err)
            }
          })
      },
      mallOutfitPersonDeleteMallOutfitPersonClick(e){
        var that=this;
          wx.showModal({
            title: '删除',
            content: '是否确认删除',
            showCancel:true,
            cancelText:'取消',
            complete: (res) => {
              if (res.confirm) {
                  that.mallOutfitPersonDeleteMallOutfitPerson(e);
              }
            }
          })
      },
      mallOutfitPersonDeleteMallOutfitPerson(e){
          var index=e.currentTarget.dataset.index;
          var that=this;

          var person_array=this.data.person_array;
          var id=person_array[index].id;
          var url=app.globalData.mallOutfitPersonDeleteMallOutfitPerson;
          var data={
            id:id,
          }

          console.log(url);

          // person_array.splice(index,1);
          //       that.setData({
          //         person_array:person_array,
          //       })

          //       return;
          wx.request({
            url: url,
            data:data,
            method:'POST',
            success:function(res){
              console.log(res)
              if(res.data.code!=1000){
                wx.showToast({
                  title: ''+res.data.msg,
                  icon:'none',
                })
              }else{
                person_array.splice(index,1);
                that.setData({
                  person_array:person_array,
                })
              }
    
            },
            fail:function(err){
              console.log(err)
            }
          })
      },
    toOutfit(e) {  
          var person_image_url=e.currentTarget.dataset.img_url;
          var name=e.currentTarget.dataset.name;

          let pages = getCurrentPages(); //获取当前界面的所有信息
          var prePage= pages[pages.length -2];
          if(prePage){
              if(prePage.route){
                  if(prePage.route.indexOf('pages/outfit/outfit')>=0){
                  console.log("查找到试衣界面")
                  prePage.setPersonData(person_image_url,name);
                  wx.navigateBack({delta:1});
                  }
              }
          }
    },
     // 加载下一页数据
	loadNextPage: function () {	
    console.log('loadNextPage')	

    if(this.data.isOver==true){
      return;
    }
    if(this.data.isLoading==true){
      return;
    }
    this.setData({
      page_index:this.data.page_index+1,
    });
    this.mallOutfitPersonSelectAllMallOutfitPersonByCustomerId();
  },
  personDialogShowChange(e){
    this.setData({
      personDialogShow:false,
    })
  },
  personDialogShowShow(e){
    var tmp_name=e.currentTarget.dataset.name;
    var index=Number(e.currentTarget.dataset.index);
    var person_array=this.data.person_array;
    var is_default=person_array[index].is_default;
    this.setData({
      personDialogShow:true,
      tmp_name:tmp_name,
      index:index,
      is_default:is_default,
    })
  },
  mallOutfitPersonUpdateMallOutfitPersonSetIsDefault(e){

    var that=this;
    var index=this.data.index;
    var person_array=this.data.person_array;
    var id=person_array[index].id;

    var is_default=this.data.is_default;

    var url=app.globalData.mallOutfitPersonUpdateMallOutfitPersonSetIsDefault;

    var data={
      id:id,
      is_default:is_default,
    }

    wx.request({
      url: url,
      data:data,
      method:'POST',
      success:function(res){
        console.log(res);
        if(res.data.code==1000){

          person_array[index].is_default=is_default;
          that.setData({
            person_array:person_array,
          })
          that.personDialogShowChange();

          wx.showToast({
            title: '设置成功',
            icon:'none'
          })
        }else{
            wx.showToast({
              title: ''+res.data.msg,
              icon:'none'
            })
        }

      },
      fail:function(err){
        console.log(err)
      }
    })




  },
  personDialogShowChange(e){
    this.setData({
      personDialogShow:false,
    })
  },
  isDefaultTap(e){
    if(this.data.is_default==1){
        this.setData({
          is_default:0,
        })
    }else{
      this.setData({
        is_default:1,
      })
    }
  },
  updateMallOutfitPersonIsDefault(e){

  },
})