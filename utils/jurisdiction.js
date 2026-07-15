/* 权限统一处理
 * 权限弹窗显示
 * 2020.12.24 扬衡
 */
function permissionShow() {
    wx.showModal({
        title: '提示',
        content: '对不起，您没有此功能权限',
        showCancel: false, //是否显示取消按钮
        confirmText: "确定", //默认是“确定”
      })
}
module.exports = {
  permissionShow : permissionShow
}