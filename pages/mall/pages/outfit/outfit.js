
const app=getApp();
Page({

    data: {
          person_image_url:'',
          showLoading:false,
          top_goods_id:0,
          top_goods_img_url:'',
          top_goods_name:'',
          bottom_goods_name:'',
          tmp_top_goods_name:'',
          tmp_bottom_goods_name:'',
          tmp_top_outfit_type:0,
          top_outfit_type:1,
          top_shop_id:0,
          bottom_shop_id:0,
          bottom_goods_id:0,
          bottom_goods_img_url:'',
          result_image_url:'',
          personDialogShow:false,
          ding_select_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ding_select.png',
          ding_not_select_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ding_not_select.png',
        
          outfit_person_id:0,
          tmp_name:'',
          name:'',
          tmp_remark:'',
          remark:'',
          typeDialogShow:false,//人像选择弹窗
          topDialogShow:false,//上衣选择弹窗
          bottomDialogShow:false,//下衣选择弹窗
          personNameDialogShow:false,//人名对话框
          topGoodsNameDialogShow:false,//上衣名称
          bottomGoodsNameDialogShow:false,//下衣名称

          select_type:0,//人像选择方式
          select_top:0,//上衣选择方式
          select_bottom:0,//下衣选择方式

          search_name:'',
          search_remark:'',
          person_array:[],
          searchDialogShow:true,
          task_id:'',
          timer:null,
          rechargeDialogShow:false,
          recharge_type:0,
          is_default:0,

    },
  /**
     * 生命周期函数--监听页面加载
     */
  onLoad: function (options) {	
      if(options.outfit_type){
        //url: '/pages/mall/pages/outfit/outfit?outfit_type='+outfit_type+'&goods_id='+goods_id+'&goods_img_url='+goods_img_url,
        var outfit_type=Number(options.outfit_type);
        var goods_id=Number(options.goods_id);
        var shop_id=Number(options.shop_id);
        var goods_img_url=options.goods_img_url;
        var goods_name=options.goods_name;
         
        if(outfit_type==1){
          this.setData({
            top_outfit_type:1,
            top_goods_id:goods_id,
            top_shop_id:shop_id,
            top_goods_name:goods_name,
            top_goods_img_url:goods_img_url,
          })

        }else if(outfit_type==2){
          this.setData({
            bottom_goods_id:goods_id,
            bottom_shop_id:shop_id,
            bottom_goods_name:goods_name,
            bottom_goods_img_url:goods_img_url,
          })
        }else if(outfit_type==3){
          this.setData({
            top_outfit_type:3,
            top_goods_id:goods_id,
            top_shop_id:shop_id,
            top_goods_name:goods_name,
            top_goods_img_url:goods_img_url,
          })
        }else if(outfit_type==4){
            //4 套装 上衣 下衣都填充
            this.setData({
              top_outfit_type:4,
              top_goods_id:goods_id,
              top_shop_id:shop_id,
              top_goods_name:goods_name,
              top_goods_img_url:goods_img_url,
            })
            //4 套装 上衣 下衣都填充
            this.setData({
              bottom_goods_id:goods_id,
              bottom_shop_id:shop_id,
              bottom_goods_name:goods_name,
              bottom_goods_img_url:goods_img_url,
            })

        }
     
      }

      this.mallOutfitPersonSelectDefaultMallOutfitPersonByCustomerId();
  },
  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    this.clearOTimer();
  },
    // toSearch(e){
    //   var search_outfit_type=Number(e.currentTarget.dataset.search_outfit_type);
    //   console.log(search_outfit_type)
    //   wx.navigateTo({
    //     url: '/pages/mall/pages/search/search?search_outfit_type='+search_outfit_type,
    //   })
    // },
    setPersonData(person_image_url,name){
      console.log(person_image_url);
      this.setData({
        person_image_url:person_image_url,
        name:name,
      })    
    },
    setOutfitData(search_outfit_type,outfit_type,goods_id,shop_id,goods_name,goods_img_url){

          if(outfit_type==1){
            this.setData({
              top_outfit_type:1,
            })
          }else if(outfit_type==3){
            this.setData({
              top_outfit_type:3,
            })
          }else if(outfit_type==4){
            //上衣 下衣都可试
            this.setData({
              top_outfit_type:4,
            })
          }

          if(outfit_type==1){
            //上衣
            this.setData({
              top_goods_id:goods_id,
              top_shop_id:shop_id,
              top_goods_name:goods_name,
              top_goods_img_url:goods_img_url,
            })
          }else if(outfit_type==2){
            //下衣
            this.setData({
              bottom_goods_id:goods_id,
              bottom_shop_id:shop_id,
              bottom_goods_name:goods_name,
              bottom_goods_img_url:goods_img_url,
            })

          }else if(outfit_type==3){
            //连衣裙
            this.setData({
              top_goods_id:goods_id,
              top_shop_id:shop_id,
              top_goods_name:goods_name,
              top_goods_img_url:goods_img_url,
            })
            this.setData({
              bottom_goods_id:0,
              bottom_shop_id:0,
              bottom_goods_name:'',
              bottom_goods_img_url:'',
            })
          }else if(outfit_type==4){
            //上下套装
            this.setData({
              top_goods_id:goods_id,
              top_shop_id:shop_id,
              top_goods_name:goods_name,
              top_goods_img_url:goods_img_url,
            })

            this.setData({
              bottom_goods_id:goods_id,
              bottom_shop_id:shop_id,
              bottom_goods_name:goods_name,
              bottom_goods_img_url:goods_img_url,
            })

          }
          
    },
    choosePersonImageClick(e) {
      this.setData({
        typeDialogShow:true,
      })
    },
    chooseTopImageClick(e) {
      this.setData({
        topDialogShow:true,
        tmp_top_outfit_type:1,
      })
    },
    chooseBottomImageClick(e) {
      this.setData({
        bottomDialogShow:true,
      })
    },
    uploadPersonImage(filePath) {
      let that = this
        wx.uploadFile({
          filePath: filePath,
          name: 'file',
          url: app.globalData.UploadFile,
          formData: {
            oldUrl: '',
          },
          success: res => {
            console.log(res);
            let a = JSON.parse(res.data);
            console.log(a)
            console.log(a.object)
            if(a.object){
              console.log(a.object)
              if(a.object.length>10){
                console.log(a.object)
                that.setData({
                  person_image_url:a.object,
                  personDialogShow:true,
                  tmp_name:'',
                  tmp_remark:'',
                  name:'',
                  remark:'',
                })
  
              }else{
                console.log('异常')
              }
            }
          },
        })
      
    },

    uploadTopImage(filePath) {
      let that = this
        wx.uploadFile({
          filePath: filePath,
          name: 'file',
          url: app.globalData.UploadFile,
          formData: {
            oldUrl: '',
          },
          success: res => {
            console.log(res);
            let a = JSON.parse(res.data);
            console.log(a)
            console.log(a.object)
            if(a.object){
              console.log(a.object)
              if(a.object.length>10){
                console.log(a.object)
                that.setData({
                  top_goods_img_url:a.object,
                  top_goods_id:0,
                  top_shop_id:0,
                  topDialogShow:false,
                  is_default:0,
                  topGoodsNameDialogShow:true,
                })
  
              }else{
                console.log('异常')
              }
            }
          },
        })
      
    },

    uploadBottomImage(filePath) {
      let that = this
        wx.uploadFile({
          filePath: filePath,
          name: 'file',
          url: app.globalData.UploadFile,
          formData: {
            oldUrl: '',
          },
          success: res => {
            console.log(res);
            let a = JSON.parse(res.data);
            console.log(a)
            console.log(a.object)
            if(a.object){
              console.log(a.object)
              if(a.object.length>10){
                console.log(a.object)
                that.setData({
                  bottom_goods_img_url:a.object,
                  bottom_goods_id:0,
                  bottom_shop_id:0,
                  bottomDialogShow:false,
                  bottomGoodsNameDialogShow:true,
                })
  
              }else{
                console.log('异常')
              }
            }
          },
        })
      
    },

    insertMallOutfitPerson(){
        var that=this;

        if(this.data.tmp_name==''){
          wx.showToast({
            title: '用户名必填',
            icon:'none',
          })
          return;
        }

        var name=this.data.tmp_name;
        var remark=this.data.tmp_remark;
        var is_default=this.data.is_default;
        this.setData({
          name:name,
          remark:remark,
         
        })
        
        var url=app.globalData.insertMallOutfitPerson;
        var data={
          customer_id:app.globalData.customerInf.id,
          name:name,
          remark:remark,
          img_url:this.data.person_image_url,
          is_default:is_default,
        }
        console.log(url);
        wx.request({
          url: url,
          data:data,
          method:'POST',
          success:function(res){
            if(res.data.code!=1000){
              wx.showToast({
                title: ''+res.data.data.msg,
                icon:'none',
              })
            }else{
              that.setData({
                personDialogShow:false,
              })
              wx.showToast({
                title: '保存成功',
                icon:'none',
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
    

    mallOutfitAnyoneSendTask(){
      var that=this;
     
      var url=app.globalData.mallOutfitAnyoneSendTask;
      var top_goods_img_url=this.data.top_goods_img_url;
      console.log(top_goods_img_url);

      var top_outfit_type=this.data.top_outfit_type;
      if(top_outfit_type!=1&&top_outfit_type!=3){
        top_outfit_type=1;
      }

      if(top_goods_img_url==''){
        wx.showToast({
          title: '请选择上衣',
          icon:'none',
        })
        return;
      }

      var data={
        customer_id:app.globalData.customerInf.id,
        name:this.data.name,
        //customer_id:6108,
        top_outfit_type:top_outfit_type,
        outfit_person_id:this.data.outfit_person_id,
        top_goods_id:this.data.top_goods_id,
        bottom_goods_id:this.data.bottom_goods_id,
        top_goods_name:this.data.top_goods_name,
        bottom_goods_name:this.data.bottom_goods_name,
        top_garment_url:top_goods_img_url,
        bottom_garment_url:this.data.bottom_goods_img_url,
        person_image_url:this.data.person_image_url,
        request_id:'',
        task_id:'',
        rq_task_status:'',
        rs_task_status:'',
        rs_code:'',
        rs_message:'',
        result_image_url:'',
        oss_image_url:'',
      }
      this.clearOTimer();
      this.setData({
        showLoading:true,
      })
      console.log(url);
      wx.request({
        url: url,
        data:data,
        method:'POST',
        success:function(res){
          console.log(res)
          if(res.data.code!=1000){
            that.setData({
              showLoading:false,
              result_image_url:'',
              oss_image_url:'',
            })
            that.showModalMsg(res.data.code,res.data.msg);
            return;
       

          }else{
            var data=res.data.data;
            var task_id=data.task_id;
            that.setData({
              task_id:task_id,
              result_image_url:'',
              oss_image_url:'',
              showLoading:true,
            })
            var timer=setInterval(() => {
              that.mallOutfitAnyoneGetTaskResult();
            }, 5000);
            that.setData({
              timer:timer,
            })
           
          }
  
        },
        fail:function(err){
          that.showModalMsg(1000,'网络错误');
        }
      })
  },
  showModalMsg(code,msg){
    var that=this;
      if(code==1005){
          //余额不足
          wx.showModal({
            title: '余额不足',
            content: ''+msg,
            showCancel:true,
            cancelText:'确定',
            confirmText:'去充值',
            complete: (res) => {
              if (res.confirm) {
                //跳转
                // wx.navigateTo({
                //   url: '/pages/mall/pages/scancodedeductionnew/scancodedeductionnew',
                // })
                that.setData({
                  rechargeDialogShow:true,
                })
              }
            }
          })

      }else{
        wx.showModal({
          title: '错误',
          content: ''+msg,
          showCancel:false,
          complete: (res) => {
          
          }
        })
      }
  },
  toScan(e){
   this.setData({
     rechargeDialogShow:true,
   })
   
  },
  clearOTimer(){
      try{
        var timer=this.data.timer;
       
          clearInterval(timer);
          timer=null;
          this.setData({
            showLoading:false,
          })
      }catch(e){
        console.log(e)
      }
  },
    mallOutfitAnyoneGetTaskResult(){
      var that=this;
      
      var url=app.globalData.mallOutfitAnyoneGetTaskResult;
      var data={
        task_id:this.data.task_id,
      }
      console.log(url);
      wx.request({
        url: url,
        data:data,
        method:'POST',
        success:function(res){
          console.log(res)
          if(res.data.code!=1000){
            that.clearOTimer();
            wx.showToast({
              title: ''+res.data.msg,
              icon:'none',
            })
          }else{

            var data=res.data.data;
            var result_image_url=data.result_image_url;
            var oss_image_url=data.oss_image_url;
            if(data.rs_task_status=='SUCCEEDED'){
              that.setData({
                result_image_url:result_image_url,
                oss_image_url:oss_image_url,
              })
             
              that.setData({
                showLoading:false,
              })
              that.clearOTimer();
            }
        
          }

        },
        fail:function(err){
          that.setData({
            showLoading:false,
          })
          that.clearOTimer();
          console.log(err)
        }
      })
  },
  typeDialogShowChange(e){
    this.setData({
      typeDialogShow:false,
    })
  },
  topDialogShowChange(e){
    this.setData({
      topDialogShow:false,
    })
  },
  bottomDialogShowChange(e){
    this.setData({
      bottomDialogShow:false,
    })
  },
  selectType(e){
    var select_type=e.currentTarget.dataset.select_type;
    console.log(select_type);
    this.setData({
      select_type:select_type,
    })
  },
  selectTop(e){
    var select_top=e.currentTarget.dataset.select_top;
    console.log(select_top);
    this.setData({
      select_top:select_top,
    })
  },
  selectBottom(e){
    var select_bottom=e.currentTarget.dataset.select_bottom;
    console.log(select_bottom);
    this.setData({
      select_bottom:select_bottom,
    })
  },
  selectTypeConfirm(e){
      this.setData({
        typeDialogShow:false,
      })

      var select_type=this.data.select_type;
      
      if(this.data.select_type==0){
          //从服务器选择
          wx.navigateTo({
            url: '/pages/mall/pages/outfitpersonsearch/outfitpersonsearch',
          })
      }else{
          this.choosePersonImage();
      }
  },
  selectTopConfirm(e){
      this.setData({
        topDialogShow:false,
      })
      var select_top=this.data.select_top;
      if(this.data.select_top==0){
          //从服务器选择
          //从服务器选择
          var search_outfit_type=1;
          console.log(search_outfit_type)
          wx.navigateTo({
            url: '/pages/mall/pages/search/search?search_outfit_type='+search_outfit_type,
          })
      }else{
          this.chooseTopImage();
      }
  },
  selectBottomConfirm(e){
      this.setData({
        bottomDialogShow:false,
      })
      var select_bottom=this.data.select_bottom;
      if(this.data.select_bottom==0){
          //从服务器选择
          var search_outfit_type=2;
          console.log(search_outfit_type)
          wx.navigateTo({
            url: '/pages/mall/pages/search/search?search_outfit_type='+search_outfit_type,
          })

      }else{
          this.chooseBottomImage();
      }
  },


  choosePersonImage(e){
        //
        var that=this;
        wx.chooseMedia({
          count: 1,
          mediaType: ['image'],
          sourceType: ['album', 'camera'],
          maxDuration: 60,
          camera: 'back',
          success: res => {
            console.log(res);
            if(res.tempFiles){
              if(res.tempFiles.length==0){
                  console.log("选择了0个文件")
              }else{
                var filePath=res.tempFiles[0].tempFilePath;
                that.uploadPersonImage(filePath);
                
              }
            }
            console.log(res.tempFiles.tempFilePath)
            console.log(res.tempFiles.size)
          }
        })
  },
    chooseTopImage(e){
      //
      var that=this;
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: res => {
          console.log(res);
          if(res.tempFiles){
            if(res.tempFiles.length==0){
                console.log("选择了0个文件")
            }else{
              var filePath=res.tempFiles[0].tempFilePath;
              that.uploadTopImage(filePath);
              
            }
          }
          console.log(res.tempFiles.tempFilePath)
          console.log(res.tempFiles.size)
        }
      })
  },
    chooseBottomImage(e){
      //
      var that=this;
      wx.chooseMedia({
        count: 1,
        mediaType: ['image'],
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: res => {
          console.log(res);
          if(res.tempFiles){
            if(res.tempFiles.length==0){
                console.log("选择了0个文件")
            }else{
              var filePath=res.tempFiles[0].tempFilePath;
              that.uploadBottomImage(filePath);
              
            }
          }
          console.log(res.tempFiles.tempFilePath)
          console.log(res.tempFiles.size)
        }
      })
  },
  showBigImg: function (e) { //查看照片大图                                       
      var that = this;
      var current=e.currentTarget.dataset.src;
      var imgArray =[];
      imgArray.push(current)
      wx.previewImage({
          current: current, // 当前显示图片的http链接
          urls: imgArray // 需要预览的图片http链接列表
      })
  },
  topGoodsNameDialogShowChange(e){
      this.setData({
        topGoodsNameDialogShow:false,
      })
  },
  bottomGoodsNameDialogShowChange(e){
    this.setData({
      bottomGoodsNameDialogShow:false,
    })
  },
  topGoodsNameConfirm(e){
    this.setData({
      top_goods_name:this.data.tmp_top_goods_name,
      topGoodsNameDialogShow:false,
    })
  },
  bottomGoodsNameConfirm(e){
    this.setData({
      bottom_goods_name:this.data.tmp_bottom_goods_name,
      bottomGoodsNameDialogShow:false,
    })
  },
  selectTmpTopOutfitType(e){
    var tmp_top_outfit_type=e.currentTarget.dataset.tmp_top_outfit_type;
    this.setData({
      tmp_top_outfit_type:tmp_top_outfit_type,
    })
  },
  rechargeDialogShowChange(e){
      this.setData({
        rechargeDialogShow:false,
      })
  },
  rechargeType(e){
    var recharge_type=e.currentTarget.dataset.recharge_type;
    this.setData({
      recharge_type:recharge_type,
    })
  },
  rechargeTypeConfirm(e){
    var recharge_type=this.data.recharge_type;
    console.log(recharge_type)
    if(recharge_type==0){
      wx.navigateTo({
        url: '/pages/mall/pages/scancodedeductionoutfit/scancodedeductionoutfit',
      })
    }else{
      wx.navigateTo({
        url: '/pages/mall/pages/scancodedeductionnew/scancodedeductionnew',
      })
    }
  },
      toOutfitPreview(e) {  
        var img_url=this.data.oss_image_url;
      
        var top_goods_id=this.data.top_goods_id;
        var bottom_goods_id=this.data.bottom_goods_id;
        var top_goods_name=this.data.top_goods_name;
        var bottom_goods_name=this.data.bottom_goods_name;
        var top_shop_id=this.data.top_shop_id;
        var bottom_shop_id=this.data.bottom_shop_id;


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
    isDefaultTap(e){
      var is_default=this.data.is_default;
      if(is_default==1){
        is_default=0;
      }else{
        is_default=1;
      }
      this.setData({
        is_default:is_default,
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

  mallOutfitPersonSelectDefaultMallOutfitPersonByCustomerId(){
        //查询
        var that=this;
        var url=app.globalData.mallOutfitPersonSelectDefaultMallOutfitPersonByCustomerId;
        var data={
          customer_id:app.globalData.customerInf.id,
        }

        console.log(url);
        wx.request({
          url: url,
          data:data,
          method:'POST',
          success:function(res){
            console.log(res)
            if(res.data.code!=1000){
              wx.showToast({
                title: ''+res.data.data.msg,
                icon:'none',
              })
            }else{
              if(res.data.data.length>0){
                var item=res.data.data[0];
                that.setData({
                  person_image_url:item.img_url,
                  name:item.name,
                })    
              }
            }
  
          },
          fail:function(err){
            console.log(err)
          }
        })
    },

})