// pages/mine/mine.js
const JSEncrypt = require('../utils/jsencrypt.min.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    publicKey:'-----BEGIN PUBLIC KEY-----MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC+2cwk61EWUYJ2ytyEv62e+ojcDOFqtXtkMr+TG57I4diaFBrxwuitddPHKQtkkdKa283Tugm3ARf/ekDnm5MKaDeGUaK5KZfC6GjA+MKU9VbgzdVybZBddLXi5+JubM/V307AtWkU7OJnwDSI10vTYHRsO9ACpnm0fkKsWAkehwIDAQAB-----END PUBLIC KEY-----',
    version: [{
      "number": "1.1.17",
      "date": "2020年10月23日"
    },{
      "number": "1.1.16",
      "date": "2020年10月12日"
    },{
      "number": "1.1.15",
      "date": "2020年08月29日"
    },{
      "number": "1.1.14",
      "date": "2020年08月14日"
    },{
      "number": "1.1.13",
      "date": "2020年08月12日"
    },{
      "number": "1.1.12",
      "date": "2020年08月10日"
    },{
      "number": "1.1.11",
      "date": "2020年08月08日"
    },{
      "number": "1.1.10",
      "date": "2020年08月05日"
    },{
      "number": "1.1.9",
      "date": "2020年08月03日"
    },{
      "number": "1.1.8",
      "date": "2020年08月01日"
    },{
      "number": "1.1.7",
      "date": "2020年07月29日"
    },{
      "number": "1.1.6",
      "date": "2020年07月24日"
    },{
      "number": "1.1.5",
      "date": "2020年07月21日"
    },{
      "number": "1.1.4",
      "date": "2020年07月20日"
    },{
      "number": "1.1.3",
      "date": "2020年07月18日"
    },{
      "number": "1.1.2",
      "date": "2020年07月17日"
    },{
      "number": "1.1.1",
      "date": "2020年07月16日"
    },{
      "number": "1.1.0",
      "date": "2020年07月15日"
    },{
      "number": "1.0.99",
      "date": "2020年07月13日"
    },{
      "number": "1.0.98",
      "date": "2020年07月12日"
    },{
      "number": "1.0.97",
      "date": "2020年07月11日"
    },{
      "number": "1.0.96",
      "date": "2020年07月10日"
    },{
      "number": "1.0.95",
      "date": "2020年07月9日"
    },{
      "number": "1.0.94",
      "date": "2020年07月8日"
    },{
      "number": "1.0.93",
      "date": "2020年07月7日"
    },{
      "number": "1.0.92",
      "date": "2020年07月6日"
    },{
      "number": "1.0.91",
      "date": "2020年07月4日"
    },{
      "number": "1.0.90",
      "date": "2020年07月2日"
    },{
      "number": "1.0.89",
      "date": "2020年06月30日"
    },{
      "number": "1.0.88",
      "date": "2020年06月24日"
    },{
      "number": "1.0.87",
      "date": "2020年06月23日"
    },{
      "number": "1.0.86",
      "date": "2020年06月19日"
    },{
      "number": "1.0.85",
      "date": "2020年06月18日"
    },{
      "number": "1.0.84",
      "date": "2020年06月17日"
    },{
      "number": "1.0.83",
      "date": "2020年06月16日"
    },{
      "number": "1.0.82",
      "date": "2020年06月15日"
    },{
      "number": "1.0.81",
      "date": "2020年06月13日"
    },{
      "number": "1.0.79",
      "date": "2020年06月12日"
    },{
      "number": "1.0.78",
      "date": "2020年06月11日"
    },{
      "number": "1.0.77",
      "date": "2020年06月10日"
    },{
      "number": "1.0.76",
      "date": "2020年06月8日"
    },{
      "number": "1.0.75",
      "date": "2020年06月6日"
    },{
      "number": "1.0.74",
      "date": "2020年06月5日"
    },{
      
      "number": "1.0.73",
      "date": "2020年06月4日"
    },{
      "number": "1.0.72",
      "date": "2020年06月3日"
    },{
      "number": "1.0.71",
      "date": "2020年06月2日"
    },{
      "number": "1.0.70",
      "date": "2020年05月30日"
    },{
      "number": "1.0.69",
      "date": "2020年05月29日"
    },{
      "number": "1.0.68",
      "date": "2020年05月28日"
    },{
      "number": "1.0.67",
      "date": "2020年05月25日"
    },{
      "number": "1.0.66",
      "date": "2020年05月23日"
    },{
      "number": "1.0.65",
      "date": "2020年05月22日"
    },{
      "number": "1.0.64",
      "date": "2020年05月21日"
    },{
      "number": "1.0.63",
      "date": "2020年05月20日"
    },{
      "number": "1.0.62",
      "date": "2020年05月18日"
    },{
      "number": "1.0.61",
      "date": "2020年05月16日"
    },{
      "number": "1.0.60",
      "date": "2020年05月15日"
    },{
      "number": "1.0.59",
      "date": "2020年05月14日"
    },{
      "number": "1.0.58",
      "date": "2020年05月12日"
    },{
      "number": "1.0.57",
      "date": "2020年05月09日"
    },{
      "number": "1.0.56",
      "date": "2020年05月08日"
    },{
      "number": "1.0.55",
      "date": "2020年05月07日"
    },{
      "number": "1.0.54",
      "date": "2020年05月06日"
    },{
      "number": "1.0.53",
      "date": "2020年05月05日"
    },{
      "number": "1.0.52",
      "date": "2020年04月28日"
    },{
      "number": "1.0.51",
      "date": "2020年04月27日"
    },{
      "number": "1.0.50",
      "date": "2020年04月25日"
    },{
      "number": "1.0.49",
      "date": "2020年04月24日"
    },{
      "number": "1.0.48",
      "date": "2020年04月23日"
    },{
      "number": "1.0.47",
      "date": "2020年04月22日"
    },{
      "number": "1.0.46",
      "date": "2020年04月18日"
    },{
      "number": "1.0.45",
      "date": "2020年04月17日"
    },{
      "number": "1.0.44",
      "date": "2020年04月16日"
    },{
      "number": "1.0.43",
      "date": "2020年04月16日"
    },{
      "number": "1.0.42",
      "date": "2020年04月14日"
    },{
      "number": "1.0.41",
      "date": "2020年04月11日"
    },{
      "number": "1.0.40",
      "date": "2020年04月8日"
    },{
      "number": "1.0.39",
      "date": "2020年04月6日"
    },{
      "number": "1.0.38",
      "date": "2020年04月2日"
    },{
      "number": "1.0.36",
      "date": "2020年03月27日"
    },{
      "number": "1.0.35",
      "date": "2020年03月26日"
    },{
      "number": "1.0.34",
      "date": "2020年03月25日"
    },{
      "number": "1.0.33",
      "date": "2020年03月24日"
    },{
      "number": "1.0.32",
      "date": "2020年03月21日"
    }, {
      "number": "1.0.25",
      "date": "2020年03月14日"
    }, {
        "number": "1.0.24",
        "date": "2020年03月14日"
      }, {
        "number": "1.0.23",
        "date": "2020年03月13日"
      },{
      "number": "1.0.22",
      "date": "2020年03月12日"
    },{
      "number": "1.0.21",
      "date": "2020年03月12日"
    },{
      "number": "1.0.20",
      "date": "2020年03月11日"
    },{
        "number": "1.0.19",
        "date": "2020年03月09日"
      },{
      "number": "1.0.18",
      "date": "2020年03月06日"
    },{
      "number": "1.0.17",
      "date": "2020年03月05日"
    },{
      "number": "1.0.16",
      "date": "2020年03月03日"
    },{
      "number": "1.0.15",
      "date": "2020年03月02日"
    }, {
        "number": "1.0.14",
        "date": "2020年02月29日"
      },
      {
      "number": "1.0.13",
      "date": "2020年02月29日"
      },{
        "number": "1.0.12",
        "date": "2020年01月20日"
      },
      {
        "number": "1.0.11",
        "date": "2020年01月13日"
      },
      {
        "number": "1.0.10",
        "date": "2020年01月08日"
      },
      {
        "number": "1.0.9",
        "date": "2020年01月03日"
      },
      {
        "number": "1.0.8",
        "date": "2019年12月30日"
      },
      {
        "number": "1.0.7",
        "date": "2019年12月24日"
      },
      {
        "number": "1.0.6",
        "date": "2019年12月11日"
      },
      {
        "number": "1.0.5",
        "date": "2019年12月06日"
      },
      {
        "number": "1.0.4",
        "date": "2019年11月22日"
      },
      {
        "number": "1.0.3",
        "date": "2019年11月20日"
      },
      {
        "number": "1.0.2",
        "date": "2019年11月16日"
      },
      {
        "number": "1.0.0",
        "date": "2019年11月11日"
      }
    ],
    isUpdatePwd: false, //修改密码控制
    i_close_img: 'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/IMG/切瓜切菜/images/i_close.png',
    passwordValue: '',
    number:'',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function() {
    var self = this
    wx.getSystemInfo({
      success: function(res) {
        if (res.SDKVersion >= "2.1.0") {
          self.setData({
            exitApp: true //data中的初始化变量
          })
        }
      }
    })
  },
  //获取密码
  getPwd(){
    let that = this
    wx.request({
      url: app.globalData.selectCustomerInfByOpenId_url,
      method: 'POST',
      data: {
        openid: app.globalData.openid,
      },
      header: {
        'content-type': 'application/json;charset=utf-8' // 默认值
      },
      success: function (res) {
        
        if (res.data.signIn == 1 ) {
          that.setData({
            passwordValue: res.data.password,
            number:res.data.phone
          })

          let isUpdatePwd = that.data.isUpdatePwd
          that.setData({
            isUpdatePwd: !isUpdatePwd
          })
          console.log(res.data,"查询回来的值");
        }else{
          wx.showModal({
            title: '提示',
            content: '您尚未注册，是否前往注册',
            success: res=>{
              if(res.confirm){
                wx.navigateTo({
                  url: '../register/register?openId=' + app.globalData.openid + '&unionId=' + app.globalData.unionID,
                })
              }
            }
          })
        }
      }
    })
  },
  //提交修改密码
  formSubmit(e){//UpdateCustomerByOpenId_Url
    console.log(e);
    let that = this

    let encrypt = new JSEncrypt();
    encrypt.setPublicKey(this.data.publicKey);
    let encrypted = encrypt.encrypt(e.detail.value.newpwd2);
    console.log("加密结果",encrypted);
    
    if(app.globalData.openid!=''){
        if( e.detail.value.oldpwd==this.data.passwordValue){
          if(e.detail.value.newpwd1!=''){
            if(e.detail.value.newpwd2!='' && e.detail.value.newpwd1 == e.detail.value.newpwd2){
                var data = {
                  openid: app.globalData.openid,
                  password: encrypted
                }
                wx.request({
                  url: app.globalData.UpdateCustomerByOpenId_Url,
                  method:'POST',
                  data: JSON.stringify(data),
                  success:res=>{
                    wx.showToast({
                      title: '修改成功',
                    })
                  }
                })
                that.updatePwd()
              }else{
              //确认新密码为空或错误
              wx.showModal({
                title: '提示',
                content:"确认新密码为空或与新密码不同"
              })
            }
          }else{
            //新密码为空
            wx.showModal({
              title: '提示',
              content:"新密码不能为空"
            })
          }
        }else{
          //旧密码为空
          wx.showModal({
            title: '提示',
            content:"旧密码输入错误"
          })
        }
    }
  },
  //控制修改密码弹窗
  updatePwd(){
    this.getPwd()

    
  },

  aaa() {
    return;
  },

  closeWindow(){
    this.setData({
      isUpdatePwd :false
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },



})