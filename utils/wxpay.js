const app = getApp()
function pay(data){
  let sub_mch_id = data.sub_mch_id            //商家商户号 先写孟奔
  let body = data.body                        //说明
  let out_trade_no = data.out_trade_no        //订单号 20位
  let order_id = data.order_id                //订单id
  let shop_id = data.shop_id                  //店铺id
  let total_fee = data.total_fee              //支付金额  单位：分
  let openid = data.openid                    //消费者openid
  let di_id = data.di_id ? data.di_id : 0
  let t_o_id = data.t_o_id ? data.t_o_id : 0
  let sm_id = data.sm_id ? data.sm_id : 0
  let co_id = data.co_id ? data.co_id : 0
  let o_n_status = data.o_n_status ? data.o_n_status : 0
  let order_num = data.order_num ? data.order_num : 0
  let profit_sharing = data.profit_sharing    //是否分账  0-否 1-是
  let percent_pay = 0                         //分账费率
  let percent_total = 0                       //分账金额
  console.log(sub_mch_id)                     
  if (profit_sharing == 0) {
    percent_pay = 0
    percent_total = 0
  }else{
    percent_pay = data.percent_pay
    percent_total = data.percent_total
  }
  wx.request({
    url:  app.globalData.allUrl.wxPayPlusService,
    method: "GET",
    data: {
      appid: 'wx78455227a0fd853f',           //公众号appid
      mch_id: '1525534221',                  //服务商-诗么普id
      sub_appid: "wx7601bb0ab62f48aa",       //小程序appid
      sub_mch_id: sub_mch_id,               
      body: body,
      out_trade_no: out_trade_no,
    //   attach:"{order_id:"+order_id+",shop_id:"+shop_id+",percent_pay:"+percent_pay+",percent_total:"+percent_total+"}",
      attach:sm_id == 0 && co_id == 0 ? "{order_id:"+order_id+",shop_id:"+shop_id+",percent_pay:"+percent_pay+",percent_total:"+percent_total+"}" : JSON.stringify({
        di_id: di_id,
        t_o_id: t_o_id,
        sm_id: sm_id,
        co_id: co_id,
        o_n_status: o_n_status,
        order_num: order_num
      }),
      total_fee: total_fee,
      trade_type: 'JSAPI',
      openid: openid,
      profit_sharing: profit_sharing
    },
    success: function (res) {
      if (res.statusCode == 500){
        data.back({
          data: {
            msg: '商户id错误',
            WXPayCallBack: res,
          },
          result: 'fail'
        })
        return
      }else if (res.data[0].result_code == 'FAIL'){
        if(res.data[0].err_code_des == '该订单已支付'){
          data.back({
            data: {
              msg: '已支付完成,等待订单确认中...',
              WXPayCallBack: res,
            },
            result: 'success'
          })
        }else{
          data.back({
            data: {
              msg: '未知错误...',
              WXPayCallBack: res,
            },
            result: 'fail'
          })
        }
      }else{
        wx.requestPayment({
          'timeStamp': res.data[0].timeStamp,
          'nonceStr': res.data[0].nonceStr,
          'package': res.data[0].package,
          'signType': res.data[0].signType,
          'paySign': res.data[0].sign,
          'success': function (res) {
            data.back({
              data: {
                msg: '支付成功',
                WXPayCallBack: res,
              },
              result: 'success'
            })
          },'fail': function (res){
            data.back({
              data: {
                msg: '用户取消支付',
                WXPayCallBack: res,
              },
              result: 'fail'
            })
          }
        })
      }
    }
  })
}
function selectPay(data){
  let out_trade_no = data.out_trade_no
  wx.request({
    url: app.globalData.allUrl.selectOneWxPayDetailed,
    method: 'GET',
    data: {out_trade_no: out_trade_no},
    success(e){
      if(e.data.result != 0){
        data.back({
          data: {
            msg: '抓取成功',
            WXPayCallBack: e,
          },
          result: 'success'
        })
      }else{
        data.back({
          data: {
            msg: '抓取失败',
            WXPayCallBack: e,
          },
          result: 'fail'
        })
      }
    },
    fail(e){
      data.back({
        data: {
          msg: '访问超时',
          WXPayCallBack: e,
        },
        result: 'fail'
      })
    }
  })
}
function profitSharing(data){
  let out_trade_no = data.out_trade_no
  let sub_mch_id = data.sub_mch_id
  let openid = data.openid
  let description = data.description
  let amount = data.amount
  wx.request({
    url: app.globalData.allUrl.selectOneWxPayDetailed,
    method: 'GET',
    data: {out_trade_no:out_trade_no},
    success(e){
      if(e.data.result != 0){
        data.back({
          data: {
            msg: '有记录',
            WXPayCallBack: e,
          },
          result: 'success'
        })
      }else{
        data.back({
          data: {
            msg: '无记录',
            WXPayCallBack: e,
          },
          result: 'fail'
        })
        return
      }
      let transaction_id = e.data.object.transaction_id
      wx.request({
        url: app.globalData.allUrl.wxPayProfitsharing,
        method: 'GET',
        data: {
          appid:'wx78455227a0fd853f',
          sub_appid: 'wx7601bb0ab62f48aa',
          mch_id: '1525534221',
          sub_mch_id: sub_mch_id,
          open_id: openid,
          transaction_id: transaction_id,
          description: description,
          amount: amount
        },
        success(e){
          console.log(e)
          if (e.data[0].err_code == 'ORDER_NOT_READY') {
            profitSharing({
              out_trade_no: orderCode,//20位orderCode
              sub_mch_id: sub_mch_id,
              openid: openid,
              description: '分账百分之三十',
              amount: percent_total,
            })
          }
          data.back({
            data: {
              msg: '分账成功',
              WXPayCallBack: e,
            },
            result: 'success'
          })
        },
        fail(e){
          data.back({
            data: {
              msg: '访问超时',
              WXPayCallBack: e,
            },
            result: 'fail'
          })
        }
      })
    },
    fail(e){
      back('访问超时',e,'fail')
    }
  })
}
function version(res){
  res.back({
    data: {
      msg: 'WXPayV2 by ATim',
      WXPayCallBack: 'none',
    },
    result: 'success'
  })
}
module.exports = {
  pay: pay,
  version: version,
  profitSharing: profitSharing,
  selectPay: selectPay
}