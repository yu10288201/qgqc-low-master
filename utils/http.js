import { Config } from 'config.js';
// # 解构
class HTTP{

    constructor() {

    }

    request({url,data={},method='GET'}){
        return new Promise((resolve, reject)=>{
            this._request(url,resolve,reject,data, method)
        })
    }
    _request(url,resolve, reject, data={}, method='GET'){
        wx.request({
            url:Config.restUrl + url,
            method:method,
            data:data,
            header:{
                'content-type':'application/json',
            },
            success:(response)=>{
                if (response.statusCode >= 200 && response.statusCode < 300) {
                    resolve(response);
                  } else{
                    this.errorHandler || this.errorHandler(response);
                    reject(response);
                  }

            },
            fail:(err)=>{
                this._show_error(err)
                reject(response);
            }
        })

    }

    _show_error(error_code){
        console.log(errorMsg);
    }


}

export {HTTP}


















