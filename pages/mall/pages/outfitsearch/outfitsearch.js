// pages/mall/pages/outfitpersonsearch/outfitpersonsearch.js
const app=getApp();
Page({


    /**
     * 页面的初始数据
     */
    data: {
      person_array:[],
      name:'',
      top_goods_name:'',
      bottom_goods_name:'',
      begin_date:'',
      end_date:'',
      isLoading:false,
      isOver:false,
      scrollTop:0,
      page_index:1,
      multi_show:0,
      multi_select_count:0,
      multi_select:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/common_img/multi_select.png',
      multi_notselect:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/common_img/multi_notselect.png',
      multi_select1:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/common_img/multi_select1.png?t=1',
      multi_notselect1:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/common_img/multi_notselect1.png?t=1',
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

      var that = this;
      var person_array=this.data.person_array;
      var ids='';
      var imageUrl='';
      for(var i=0;i<person_array.length;i++){
        if(person_array[i].checked==true){
          if(person_array[i].oss_image_url!=''){
            imageUrl=person_array[i].oss_image_url;
          }
          
          if(ids==''){
            ids=ids+person_array[i].id;
          }else{
            ids=ids+','+person_array[i].id;
          } 
        }
      }
      var title = 'AI试衣，你也来试试吧！' ;
      console.log('title:'+title)
      console.log(ids);
      let shareObj = {
          title: title,
          path: 'pages/mall/pages/outfitresultmulti/outfitresultmulti?ids='+ids+'&associate_id=' + app.globalData.customerInf.id,
          imageUrl: imageUrl,
          success: function (res) {
              if (res.errMsg == 'shareAppMessage:ok') {
                  that.hide();
              }
              wx.showToast({
                title: '发送成功！',
              })
          },
          fail: function (res) {
              if (res.errMsg == 'shareAppMessage:fail cancel') {
                  that.hide();
              } else if (res.errMsg == 'shareAppMessage:fail') {
                  that.hide();
              }
          },
      };              
      
      return shareObj;
    },
    queryClick(e){
      if(this.data.isLoading==true){
        return;
      }

    this.setData({
        page_index:1,
        isOver:false,
        isLoading:false,
    })
      this.mallOutfitAnyoneSelectMallOutfitAnyoneByCustomerId();
    },
    mallOutfitAnyoneSelectMallOutfitAnyoneByCustomerId(){
      //查询
          var that=this;
          if(this.data.isLoading||this.data.isOver){
            return;
          }
          var url=app.globalData.mallOutfitAnyoneSelectMallOutfitAnyoneByCustomerId;
          wx.showLoading({
            title: '加载中',
          })
          //var customer_id=6108;
          var customer_id=app.globalData.customerInf.id;

          var data={
            customer_id:customer_id,
            top_goods_name:this.data.top_goods_name,
            bottom_goods_name:this.data.bottom_goods_name,
            name:this.data.name,
            begin_outfit_date:this.data.begin_date,
            end_outfit_date:this.data.end_date,
            page_index:this.data.page_index,
          }
          console.log(url);
          that.setData({
            isLoading:true,
          })
          wx.request({
            url: url,
            data:data,
            method:'POST',
            success:function(res){
              wx.hideLoading();
              that.setData({
                isLoading:false,
              })
              that.checkMultiSelectCount();
              console.log(res)
              if(res.data.code!=1000){
                wx.showToast({
                  title: ''+res.data.msg,
                  icon:'none',
                })
              }else{
                if(res.data.data.length==0){
                    that.setData({
                      isOver:true,
                    })
                }
               
                  var new_array=res.data.data;
                  new_array.forEach(element => {
                    element.checked=false;
                  });
                  if(that.data.page_index==1){
                    that.setData({
                      person_array:new_array,
                    })
                  }else{
                      var   person_array=that.data.person_array;
                      for(var i=0;i<res.data.data.length;i++){
                        person_array.push(new_array[i]);
                      }
                      that.setData({person_array:person_array})
                  }
                  that.setData({
                    page_index:that.data.page_index+1,
                  })
                  
                
        
              }
    
            },
            fail:function(err){
              wx.hideLoading();
              console.log(err)
              that.setData({
                isLoading:false,
              })
             
            }
          })
      },
    toOutfitPreview(e) {  
        var img_url=e.currentTarget.dataset.img_url;
        var index=Number(e.currentTarget.dataset.index);
        var item=this.data.person_array[index];
        var top_goods_id=item.top_goods_id;
        var bottom_goods_id=item.bottom_goods_id;
        var top_goods_name=item.top_goods_name;
        var bottom_goods_name=item.bottom_goods_name;
        var top_shop_id=item.top_shop_id;
        var bottom_shop_id=item.bottom_shop_id;


        var parm="&top_goods_id="+top_goods_id;
         parm+="&bottom_goods_id="+bottom_goods_id;

         parm+="&top_shop_id="+top_shop_id;
         parm+="&bottom_shop_id="+bottom_shop_id;

         parm+="&top_goods_name="+top_goods_name;
         parm+="&bottom_goods_name="+bottom_goods_name;

        wx.navigateTo({
          url: '/pages/mall/pages/outfitpreview/outfitpreview?img_url='+img_url+parm,
        })

       
    },
    bindBeginDateChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        begin_date: e.detail.value
      })
    },
    bindEndDateChange: function(e) {
      console.log('picker发送选择改变，携带值为', e.detail.value)
      this.setData({
        end_date: e.detail.value
      })
    },
    // 加载下一页数据
	loadNextPage: function () {	
    console.log('loadNextPage')	

    if(this.data.isLoading||this.data.isOver){
      return;
    }
    this.mallOutfitAnyoneSelectMallOutfitAnyoneByCustomerId();
  },
  mallOutfitAnyoneDeleteMallOutfitAnyoneClick(e){
      var that=this;
        wx.showModal({
          title: '删除',
          content: '是否确认删除',
          showCancel:true,
          cancelText:'取消',
          complete: (res) => {
            if (res.confirm) {
                that.mallOutfitAnyoneDeleteMallOutfitAnyone(e);
            }
          }
        })
    },
    mallOutfitAnyoneDeleteMallOutfitAnyone(e){
          var index=e.currentTarget.dataset.index;
          var that=this;

          var person_array=this.data.person_array;
          var id=person_array[index].id;
          var url=app.globalData.mallOutfitAnyoneDeleteMallOutfitAnyone;
          var data={
            id:id,
          }

          console.log(url);
          wx.request({
            url: url,
            data:data,
            method:'POST',
            success:function(res){
              that.checkMultiSelectCount();
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
    clearClick(e){
      this.setData({
        name:'',
        top_goods_name:'',
        bottom_goods_name:'',
        begin_date:'',
        end_date:'',
      })
    },
    multiSelectClick(e){
      
        
        if(this.data.multi_show==1){
          this.setData({
            multi_show:0,
          })
        }else{
            var person_array=this.data.person_array;
             for(var i=0;i<person_array.length;i++){
              person_array[i].checked=false;
             }
             this.setData({
              person_array:person_array,
              multi_show:1,
            })
            this.checkMultiSelectCount();

         
        }
    },
    multiCheckChange(e){
      var index=e.currentTarget.dataset.index;
      var person_array=this.data.person_array;
      var checked=person_array[index].checked;
      if(checked){
        person_array[index].checked=false;
      }else{
        person_array[index].checked=true;
      }
      this.setData({
        person_array:person_array,
      })
      this.checkMultiSelectCount();
    },
    shareClick(e){
      wx.navigateTo({
        url: '/pages/mall/pages/outfitresultmulti/outfitresultmulti',
      })
    },
    checkMultiSelectCount(){
        
        var multi_select_count=0;
        var person_array=this.data.person_array;
        person_array.forEach(element => {
              if(element.checked){
                multi_select_count=multi_select_count+1;
              }
        });
        console.log(multi_select_count)
        this.setData({
          multi_select_count:multi_select_count,
        })
    },
})