var app = getApp()
var Stomp = require('./stomp').Stomp
var client = Object
var ws = {
  send: sendSocketMessage,
  onopen: null,
  onmessage: null,
  close: SocketClose,
}
function sendSocketMessage(msg) {
  var app = getApp()
  if (app.socketOpen) {
    wx.sendSocketMessage({
      data: msg
    })
  }
}
function SocketClose(e){
  console.log(e)
  wx.closeSocket()
}
function stdebug(e){
  console.log(e)
}
function initSocket(caustomerId){
  var app = getApp()
  wx.request({
    url: 'https://test.fsmbdlkj.com/WX%20Restaurant/SelectRabbitmqSetting',
    success (res) {
      console.log(res)
      app.globalData.mqtt_password = res.data.object.mqtt_password,
      app.globalData.mqtt_url = res.data.object.mqtt_url,
      app.globalData.mqtt_username = res.data.object.mqtt_username,
      app.globalData.mqtt_queue_pre = res.data.object.mqtt_queue_pre,
      app.globalData.mqtt_port = res.data.object.mqtt_port
      let s = [];
      let hexDigits = "0123456789abcdef";
      for (var i = 0; i < 32; i++) {
        s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
      }
      s[14] = "4";
      s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1);
      let uuid = s.join("").replace("-","");
      wx.connectSocket({
        url: 'wss://'+app.globalData.mqtt_url+'/ws',
        header: {
          login: app.globalData.mqtt_username,
          passcode: app.globalData.mqtt_password,
          'client-id': uuid
        },
        success() {
          initRabbitMQ(caustomerId,res.data.object.mqtt_queue_pre)
        }
      })
    }
  })
}
function initRabbitMQ(caustomerId,hj){
  var app = getApp()
  console.log('ATim--进入通信服务初始化')
  let that = this
  wx.onSocketOpen(function (res) {
    console.log('ATim--WS连接已打开！')
    app.socketOpen = true
    ws.onopen && ws.onopen()
  })
  wx.onSocketClose(function (res) {
    client._cleanUp()
    SocketClose()
    app.socketOpen = false
    console.log('ATim--WS已关闭！')
    if (app.screenShow) {
        console.log('ATim--WS将在5秒后重连！')
        ws.onclose && ws.onclose(res)
        if(app.globalData.customerInf.userCode){
          if(app.globalData.customerInf.userCode!=''){
            setTimeout(()=>{initSocket(app.globalData.customerInf.userCode)},5000)
          }
      }
      
    }
  })
  wx.onSocketError((result) => {
    console.log(result)
    client._cleanUp()
    SocketClose()
    app.socketOpen = false
    console.log('ATim--WS已关闭！')
    if (app.screenShow) {
      console.log('ATim--WS将在5秒后重连！')
      ws.onclose && ws.onclose(res)

      if(app.globalData.customerInf.userCode){
        if(app.globalData.customerInf.userCode!=''){
          setTimeout(()=>{initSocket(app.globalData.customerInf.userCode)},5000)
        }
    }

      //setTimeout(()=>{initSocket(app.globalData.caustomerId)},5000)
    }
  })
  wx.onSocketMessage(function (res) {
    console.log('ATim--收到消息',res)
    if (res && res.data) {
      let value = res.data;
      let code = value.charCodeAt(value.length - 1);
      if (code !== 0x00) {
        value += String.fromCharCode(0x00);
        res.data = value;
      }
    }
    ws.onmessage && ws.onmessage(res)
    if (res.data.charCodeAt(res.data) != 10){
       
      app.globalData.RMQCallBack(res)
      
    }
  })
  client = Stomp.over(ws);
  console.log(app)
  console.log(hj)
  let destination = hj + "qgqc_" + app.globalData.caustomerId;
  console.log('ATim--用户标识' + destination)
  client.connect('smp', 'smp83131326', function (sessionId) {
    client.subscribe(destination, function (body, headers) {
        console.log("body:")
        console.log(body);
      if(body.body.charCodeAt(0) == "123"){
         
        app.globalData.RMQCallBack(JSON.parse(body.body))
      }
    },{'auto-delete':false,'x-message-ttl':30000,exclusive:false});
  })
  client.debug = stdebug
}
function sendRabbitMQMsg(data){
  var app = getApp()
  let msg_id = data.msg_id
  let from_user = data.from_user
  let to_user = data.to_user
  let msg = data.msg
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