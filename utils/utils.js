import { LETTERS, CITY_LIST } from '../locale/citydata'
import config from 'config'

// API
const getLocationUrl = (latitude, longitude) => (`https://apis.map.qq.com/ws/geocoder/v1/?location=${latitude},${longitude}&key=${config.key}`)
const getCountyListUrl = code => (`https://apis.map.qq.com/ws/district/v1/getchildren?&id=${code}&key=${config.key}`)
const getIndexUrl = () => ('../main/main')

// 安全地在深层嵌套对象中取值
const safeGet = (keyList, obj) => keyList.reduce((preValue, curKey) => ((preValue && preValue[curKey]) ? preValue[curKey] : null), obj)

const isNotEmpty = array => (Array.isArray(array) && array.length > 0)

const isChinese = str => (/^[\u4e00-\u9fa5]+$/.test(str))

// 城市名按首字母分组
const getCityListSortedByInitialLetter = () => (
  LETTERS.map(
    letter => ({
      initial: letter,
      cityInfo: CITY_LIST.filter(city => city.initial == letter)
    })
  )
)

const formatData1 = date => {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()
  
    return [year, month, day].map(formatNumber).join('-')
  }

export default {
  getLocationUrl,
  getCountyListUrl,
  getIndexUrl,
  safeGet,
  isNotEmpty,
  isChinese,
  getCityListSortedByInitialLetter,
  formatData1 ,
}
