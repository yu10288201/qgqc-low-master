const BASE_URL = 'https://mb.fsmbdlkj.com/theme' // 生产环境
// const BASE_URL = 'http://localhost:8090' // 测试环境

const TOKEN_KEY = 'theme_token'
const OPENID_KEY = 'theme_openid'

function getToken() {
  return wx.getStorageSync(TOKEN_KEY) || ''
}

function setToken(token) {
  wx.setStorageSync(TOKEN_KEY, token)
}

function getOpenId() {
  return wx.getStorageSync(OPENID_KEY) || ''
}

function setOpenId(openId) {
  wx.setStorageSync(OPENID_KEY, openId)
}

function authHeader() {
  const token = getToken()
  return token
    ? { 'Authorization': token, 'content-type': 'application/json' }
    : { 'content-type': 'application/json' }
}

function doLogin(resolve, reject) {
  wx.login({
    success: res => {
      if (!res.code) return reject(new Error('wx.login failed'))
      console.log('[themeApi] wx.login code:', res.code)
      wx.request({
        url: BASE_URL + '/wx/login',
        method: 'GET',
        header: { 'content-type': 'application/json' },
        data: { code: res.code },
        success: r => {
          console.log('[themeApi] /wx/login 返回:', r.data)
          if (r.data && r.data.code === 200 && r.data.data) {
            const token = r.data.data.token || r.data.data
            const openId = r.data.data.openId || r.data.data.openid || ''
            console.log('[themeApi] token 获取成功:', token)
            console.log('[themeApi] openId:', openId)
            setToken(token)
            setOpenId(openId)
            resolve(token)
          } else {
            console.error('[themeApi] 登录失败:', r.data)
            reject(new Error(r.data && r.data.msg || '登录失败'))
          }
        },
        fail: reject
      })
    },
    fail: reject
  })
}

// 有缓存 token 时先校验有效性，无效则清空重新登录
function login() {
  return new Promise((resolve, reject) => {
    const cached = getToken()
    if (cached) {
      wx.request({
        url: BASE_URL + '/wx/checkToken',
        method: 'GET',
        header: { 'content-type': 'application/json', 'Authorization': cached },
        success: r => {
          if (r.data && r.data.code === 200) {
            console.log('[themeApi] token 有效，复用缓存')
            resolve(cached)
          } else {
            console.log('[themeApi] token 已失效，重新登录')
            setToken('')
            doLogin(resolve, reject)
          }
        },
        fail: () => {
          // 网络异常时复用缓存，避免影响正常使用
          console.log('[themeApi] token 校验网络异常，复用缓存')
          resolve(cached)
        }
      })
    } else {
      doLogin(resolve, reject)
    }
  })
}

// 通用 request，自动带 token；若 401 则清掉 token 重新登录再试一次
function request({ url, method = 'GET', data = {} }) {
  return new Promise((resolve, reject) => {
    wx.request({
      url: BASE_URL + url,
      method,
      header: authHeader(),
      data,
      success: res => {
        if (res.statusCode === 401) {
          setToken('')
          login().then(() => {
            wx.request({
              url: BASE_URL + url,
              method,
              header: authHeader(),
              data,
              success: r => resolve(r.data),
              fail: reject
            })
          }).catch(reject)
        } else {
          resolve(res.data)
        }
      },
      fail: reject
    })
  })
}

// 上传文件，自动带 token
function upload({ filePath, type }) {
  return new Promise((resolve, reject) => {
    const token = getToken()
    wx.uploadFile({
      url: BASE_URL + '/file/upload',
      filePath,
      name: 'file',
      formData: { type },
      header: token ? { 'Authorization': token } : {},
      success: res => {
        try {
          const result = JSON.parse(res.data)
          if (result.code === 200 && result.data) {
            resolve(result.data)
          } else {
            reject(new Error(result.msg || '上传失败'))
          }
        } catch {
          reject(new Error('上传失败'))
        }
      },
      fail: reject
    })
  })
}

module.exports = { login, request, upload, getToken, getOpenId, BASE_URL }
