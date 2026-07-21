var Stomp = require('./stomp').Stomp
var rmqData = []

var ws = {
  send: sendSocketMessage,
  close: SocketClose,
}
function sendSocketMessage(msg) {
  // console.log(msg);
  wx.sendSocketMessage({
    data: msg
  })
}
function SocketClose(e){
  wx.closeSocket()
  console.log('ATim--SocketClose')
  console.log('ATim--WS将在10秒后重连！')
  var app=getApp();
  if(app.globalData.customerInf.userCode){
    if(app.globalData.customerInf.userCode!=''){
      setTimeout(()=>{ initSocket(app.globalData.customerInf.userCode)},10000)
    }
}
  
}
function spawnUUID(){
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (var i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4";
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
  return s.join("").replace("-","");
}
function initSocket(userCode){
  var app = getApp()
  if (app.globalData.RMQclient.connected) {
    return;
  }
  app.globalData.RMQclient = null
  rmqData = app.globalData.rmqData
  var rq_rul='wss://'+rmqData.mqtt_url+'/ws';
  //var rq_rul='wss://'+'124.71.208.212:443/ws';
  console.log(rq_rul);
  wx.connectSocket({
    url: rq_rul,
    header: {
      login: rmqData.mqtt_username,
      passcode: rmqData.mqtt_password,
      'client-id': spawnUUID()
    },
    success() {
      initRabbitMQ(userCode,rmqData.mqtt_queue_pre)
    }
  })
}
function initRabbitMQ(userCode,hj){
  var app = getApp()
  console.log('ATim--进入通信服务初始化'+userCode)
  let that = this
  wx.onSocketOpen(function (res) {
    console.log('wx.onSocketOpen成功')
    ws.onopen();
  })
  wx.onSocketClose(function (res) {
    
    app.globalData.RMQclient.disconnect()
  })
  wx.onSocketError((result) => {
    
    app.globalData.RMQclient.disconnect()
  })
  wx.onSocketMessage(function (res) {
      
    if (res && res.data) {
      let value = res.data;
      let code = value.charCodeAt(value.length - 1);
      
      if (code !== 0x00) {
        value += String.fromCharCode(0x00);
        res.data = value;
       
      }
    }
    console.log(res);
     ws.onmessage(res)
 
  })
  app.globalData.RMQclient = Stomp.over(ws);
  Stomp.setInterval = function (interval, f) {
    return setInterval(f, interval);
  };
  Stomp.clearInterval = function (id) {
    return clearInterval(id);
  };
  let destination = hj + "qgqc_" + userCode;
  console.log('ATim--用户标识' + destination)
  app.globalData.RMQclient.connect('smp', 'smp83131326', function (sessionId) {

    app.globalData.RMQclient.subscribe(destination, function (body, headers) {

      console.log("app.globalData.RMQclient.subscribe:",body)
      var dataTest={data:{
        msg:{
            type:"wechat",
            tg:"wechat",
            wechat_type:1,
            sender_type:2,
        }
      }
    }
    
    var testJson=JSON.stringify(dataTest);
    console.log(testJson);
      if(body.body.charCodeAt(0) == "123"){
        
        let a = JSON.parse(body.body)
        console.log("JSON.parse(body.body):",a);
   
        
       

        if(typeof(a.data.msg) == "string")
        {
            a.data.msg = JSON.parse(a.data.msg)
        }
        
        console.log(a.data.msg);
        if(a.data.msg.type=='wechat'){
            app.chatWithCustDetail_GetNewMsg(a.data.msg);
            console.log("收到聊天消息");
            return;
        }

        if(a.data.msg.type=='mall_csr_msg_record'){
          app.chatwithcrs_GetNewMsg(a.data.msg);
          console.log("收到聊天消息");
          return;
         }
         if(a.data.msg.type=='ding_ke_msg_record'){
          app.chatwithdingke_GetNewMsg(a.data.msg);
          
          // wx.showToast({
          //   title: 'ding_ke_msg_record',
          // })
          console.log(a.data.msg);
          console.log("收到聊天消息");
          return;
         }
        if (a.data.msg.type == 'refresh') {
          app.globalData.RMQRefreshCB(a)
          return;
        }
        if (a.data.tg == "bz" && a.data.msg_id == app.globalData.RMQmsg_id && a.data.msg.text == '部长收到') {
            app.globalData.countDown_minister = false
            app.globalData.cbz = ''
            wx.showToast({
                title: '部长收到',
                icon: 'success',
                duration: 2000
              })
        }
        if (a.data.tg == "fw" && a.data.msg_id == app.globalData.RMQmsg_id && a.data.msg.text == '服务员收到') {
            app.globalData.countDown_waiter = false
            app.globalData.cfw = ''
            wx.showToast({
                title: '服务员收到',
                icon: 'success',
                duration: 2000
              })
        }

        app.globalData.RMQCallBack(a)
      }
    },{'auto-delete':false,'x-message-ttl':30000,exclusive:false});
    var customerId = app.globalData.customerInf.id;
    if (customerId && String(customerId) !== String(userCode)) {
      var dest2 = hj + "qgqc_" + customerId;
      console.log('ATim--额外订阅队列:' + dest2);
      app.globalData.RMQclient.subscribe(dest2, function (body, headers) {
        if(body.body.charCodeAt(0) == "123"){
          let a = JSON.parse(body.body)
          console.log("JSON.parse(body.body):",a)
          if(typeof(a.data.msg) == "string"){
            a.data.msg = JSON.parse(a.data.msg)
          }
          if(a.data.msg.type=='wechat'){
            app.chatWithCustDetail_GetNewMsg(a.data.msg)
            console.log("收到聊天消息")
            return
          }
          app.globalData.RMQCallBack(a)
        }
      },{'auto-delete':false,'x-message-ttl':30000,exclusive:false})
    }
  })
  app.globalData.RMQclient.debug = !app.globalData.RMQDebug ? '' : function(res){
    console.log(res)
  }
}
function sendRabbitMQMsg(data){
  var app = getApp()
  let msg_id = data.msg_id
  let from_user = data.from_user
  let msg = JSON.stringify(data.msg)
  let table_name = data.table_name
  let table_id = data.table_id
  let tg = data.tg
  let shop_id = data.shop_id
  let call = {
    msg_id: msg_id,
    from_user: from_user,
    to_user: from_user,
    msg: msg,
    table_name: table_name,
    table_id: table_id,
    tg: tg,
    shop_id: shop_id
  }
  wx.request({
    url: tg == 'bz' ? app.globalData.callBz_url : app.globalData.callFw_url,
    data: JSON.stringify(call),
    method:"POST",
    success: function (res) {
      console.log(res);
      if(res.data.result == '成功'){
        data.back({
          data: {
            msg: '发送成功!',
            RMQCallBack: res,
          },
          result: 'success'
        })
      }else{
        data.back({
          data: {
            msg: '发送失败!',
            RMQCallBack: res,
          },
          result: 'fail'
        })
      }
    }
  })
}
module.exports = {
  initSocket: initSocket,
  sendRabbitMQMsg: sendRabbitMQMsg,
}