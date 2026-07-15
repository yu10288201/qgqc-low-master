import {
  HTTP
}
from '../utils/http.js'
class MorePorridgeModel extends HTTP {

  //获取多品粥的食材
  getPorridgMaterial(data) {
    return this.request({
      url: `SelectJointSet?shop_id=${data.shop_id}&dishes_id=${data.dishes_id}`,
      method: 'POST'
    })
  }
}

export {
  MorePorridgeModel
}