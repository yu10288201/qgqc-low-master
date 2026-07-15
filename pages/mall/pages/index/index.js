// pages/mall/pages/index/index.js

const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

var util = require('../../../../utils/util.js');

const app = getApp()

const sceneValue = wx.getLaunchOptionsSync()

var QQMapWX = require('../../../../utils/qqmap-wx-jssdk.js');
var qqmap = new QQMapWX({
  //在腾讯地图开放平台申请密钥 http://lbs.qq.com/mykey.html
  key: 'V2QBZ-KVOKQ-3QS5T-GDXJD-SNQFQ-GKBVE' //此处为个人秘钥,可用老板手机号申请公司的秘钥
});

Page({

    /**
     * 页面的初始数据
     */
    data: {         
      
      //显示会员弹框
          //head_get_dialog_show:false,
          envVersion:'',
          version_date:'2024-11-23',
          version:'1.0.9',
          typeDialogShow:false,//试衣选择弹窗
          ding_select_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ding_select.png',
          ding_not_select_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ding_not_select.png',

          scrollTop:0,
          channel_type:0,        
          mall_set_dialog:false,
          random_number:3,
          head_portrait_new_show:false,
          //设置窗体
          mall_member_dialog:false,
          mall_member_level_name:'',//会员类型名称
          mall_member_end_date:'',//截止日期
          mall_member_level_tag:'',//会员类型标签
          func_item:[
               {type:'qbsp',name:'全部商品',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/qbsp.png?x=1'}
              ,{type:'fzsp',name:'服装饰品',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/fzsp.png?x=1'}
              ,{type:'theme_dating',name:'主题交友',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_vip.png?x=1'}
              ,{type:'ysbj',name:'养生保健',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ysbj.png?x=1'}
              ,{type:'smjd',name:'数码家电',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/smjd.png?x=1'}             
              ,{type:'fxzq',name:'分享赚钱',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/fxzq.png?x=1'}


              ,{type:'zght',name:'中国航天',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/zght.png?x=1'}
              ,{type:'hfp',name:'精品粽子',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/hfp.png?x=1'}
              ,{type:'ryp',name:'日用品',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/ryp.png?x=1'}
              ,{type:'mj',name:'名酒',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/mj.png?x=1'}             
              // ,{type:'mc',name:'名茶',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/mc.png?x=1'}



              ,{type:'sxps',name:'生鲜配送',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/sxps.png?x=1'}
              // ,{type:'hxgh',name:'海鲜干货',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/hxgh.png'}
              ,{type:'xndm',name:'鲜仙米',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/xndm.png?x=1'} 
              ,{type:'yxsp',name:'优品优选',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/yxsp.png?x=1'}
              ,{type:'qgqc',name:'会员卡',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/hyk.png?x=1'}
              
              ,{type:'bzzx',name:'帮助中心',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bzzx.png?x=1'}                
			    ],
      
          customerInf:null,
          //屏幕相关高度获取
          return_out_top: 10,
          return_out_height:10,
          tabBarHeight: 10,
          swiperHeight: 10,
          swiperTop: 10,

          //当前选中的页
          pageIndex: 0,

          def_avatar:defaultAvatarUrl,
          nick_name:'',
          total_is_not_read_count:33,

          shopping_cart_img: app.globalData.shopping_cart_img,
          share_img: app.globalData.share_img,
          customer_service_img: app.globalData.customer_service_img,
          downSVGIcon:'data:image/svg+xml,%3Csvg%20t%3D%221688612613352%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%221452%22%20width%3D%2264%22%20height%3D%2264%22%3E%3Cpath%20d%3D%22M517.688889%20796.444444c-45.511111%200-85.333333-17.066667-119.466667-51.2L73.955556%20381.155556c-22.755556-22.755556-17.066667-56.888889%205.688888-79.644445%2022.755556-22.755556%2056.888889-17.066667%2079.644445%205.688889l329.955555%20364.088889c5.688889%205.688889%2017.066667%2011.377778%2028.444445%2011.377778s22.755556-5.688889%2034.133333-17.066667l312.888889-364.088889c22.755556-22.755556%2056.888889-28.444444%2079.644445-5.688889%2022.755556%2022.755556%2028.444444%2056.888889%205.688888%2079.644445L637.155556%20739.555556c-28.444444%2039.822222-68.266667%2056.888889-119.466667%2056.888888%205.688889%200%200%200%200%200z%22%20fill%3D%22%23333333%22%20p-id%3D%221453%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
          home_img:'data:image/svg+xml,%3Csvg%20t%3D%221689642582122%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%2210918%22%20width%3D%2248%22%20height%3D%2248%22%3E%3Cpath%20d%3D%22M362.666667%20895.914667V639.850667c0-36.266667%2033.109333-63.850667%2072.533333-63.850667h153.6c39.253333%200%2072.533333%2027.648%2072.533333%2063.850667v256.064h59.904c61.269333%200%20110.762667-47.957333%20110.762667-106.730667V414.165333L557.162667%20139.328a63.808%2063.808%200%200%200-90.325334%200L192%20414.165333v375.018667c0%2058.88%2049.386667%20106.730667%20110.762667%20106.730667H362.666667z%20m42.666666%200h213.333334V639.850667c0-10.709333-12.586667-21.184-29.866667-21.184h-153.6c-17.408%200-29.866667%2010.389333-29.866667%2021.184v256.064z%20m469.333334-439.082667v332.352c0%2082.645333-68.885333%20149.397333-153.429334%20149.397333H302.762667C218.133333%20938.581333%20149.333333%20871.936%20149.333333%20789.184V456.832l-27.584%2027.584a21.333333%2021.333333%200%201%201-30.165333-30.165333L436.672%20109.162667a106.474667%20106.474667%200%200%201%20150.656%200l345.088%20345.088a21.333333%2021.333333%200%200%201-30.165333%2030.165333L874.666667%20456.832z%22%20fill%3D%22%23515151%22%20p-id%3D%2210919%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
          qgqc_img:'data:image/svg+xml,%3Csvg%20t%3D%221689642340968%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%229795%22%20width%3D%2248%22%20height%3D%2248%22%3E%3Cpath%20d%3D%22M961.495434%20569.698097c0-46.329165-24.746614-83.740216-58.366316-91.661629%2014.832823-19.019169%2022.953781-43.330878%2022.953781-69.222571%200-68.674079-44.526099-143.574976-119.109772-200.36233-80.052221-60.953234-183.820586-94.52177-292.187689-94.52177-108.367103%200-212.135468%2033.568537-292.187689%2094.52177C148.015102%20265.23892%20103.487979%20340.139817%20103.487979%20408.813896c0%2024.414039%208.532327%2049.196469%2024.278963%2068.922742-34.293037%207.238868-59.690474%2045.024449-59.690474%2091.961458%200%2036.45426%200.044002%2093.915973%2045.191248%20109.612467%202.240017%208.280594%205.619998%2016.299221%2010.917654%2023.444968-0.86981%202.272763-1.866511%204.729721-1.866511%207.308453l0%2084.014462c0%2062.144362%2051.559283%20112.179942%20113.703645%20112.179942L793.383622%20906.258389c62.144362%200%20111.763456-50.036603%20111.763456-112.179942l0-84.014462c0-1.39272%200.327458-2.75167%200.063445-4.066619%205.557576-7.416923%209.590426-16.394389%2011.498892-26.751271C961.223235%20663.771659%20961.495434%20608.327906%20961.495434%20569.698097zM247.424182%20241.057171c72.959685-55.552224%20167.910221-86.144986%20267.36228-86.144986s194.401572%2030.592762%20267.361257%2086.144986c64.466244%2049.084928%20102.953813%20111.288642%20102.953813%20167.248142%200%2046.731324-34.140565%2067.141166-67.977207%2067.141166L212.308407%20475.446479c-33.346479%200-67.838038-24.795732-67.838038-67.141166C144.470369%20352.346837%20182.958962%20290.1421%20247.424182%20241.057171zM139.795906%20516.377704l72.512501%200%20604.813872%200%2072.652693%200c17.59268%200%2030.737048%2028.120454%2030.737048%2052.786227%200%2062.72253-8.585539%2071.743998-25.102724%2072.856331-9.705036-0.743944-17.955954-4.508687-26.078958-11.07115-7.852852-7.251148-16.011672-16.892739-23.642466-25.979698-5.676279-6.757914-11.56029-13.726629-17.776875-20.337187-14.745842-16.594957-32.04688-31.153534-55.762001-32.267914-1.081635-0.064468-2.171456-0.094144-3.272533-0.094144-31.381731%200-53.488215%2025.338085-74.866105%2049.838082-2.131547%202.441609-4.270257%204.89345-6.41613%207.315616-15.771195%2017.185404-31.78696%2032.781614-46.61876%2033.002648-0.966001-0.007163-1.927909-0.073678-2.886747-0.197498-14.170744-2.184759-31.262004-21.629623-46.444798-38.911218-1.673106-1.904373-3.350304-3.811816-5.03569-5.714142-18.645662-22.240537-39.998993-45.326325-69.857021-45.326325-0.188288%200-0.372483%200.01228-0.559748%200.014326-0.178055-0.002047-0.353041-0.014326-0.532119-0.014326-29.965475%200-52.426023%2024.391527-74.147744%2047.978734-18.576077%2020.169365-37.766139%2041.001833-57.387012%2042.129516-19.370163-0.580215-37.173644-20.029172-55.999408-40.642652-11.82635-12.948917-23.867594-26.130124-37.446867-35.627429-10.644431-7.810896-22.252817-13.106506-35.513842-13.641695-1.552356-0.11768-3.120061-0.196475-4.717442-0.196475-34.564213%200-57.103556%2029.239951-75.18026%2053.92312-13.974269%2017.913998-27.2619%2034.612309-41.981137%2036.090986-14.386662-1.013073-24.228821-9.575076-24.228821-73.129554C109.058858%20544.499182%20122.203226%20516.377704%20139.795906%20516.377704zM847.61885%20688.293145%20179.603541%20688.293145c-9.021467%200-16.219403-3.584642-21.049409-9.198499%2019.542078-7.962346%2033.914414-27.291576%2047.913243-46.447868%200.49221-0.673335%200.985444-1.188058%201.478677-1.862417%200.118704-0.153496%200.2415-0.228197%200.360204-0.381693%2014.758122-18.922978%2028.706809-36.742832%2044.288692-37.015032%205.176906%200.621147%2010.629081%203.436262%2016.228613%207.573489%208.242731%206.64535%2017.187451%2016.765849%2025.962302%2026.706245%2023.066345%2026.130124%2049.210795%2055.751768%2087.679945%2055.751768%200.425695%200%200.841158-0.020466%201.263783-0.027629%200.427742%200.007163%200.848321%200.031722%201.280156%200.031722%2038.228673%200%2064.285119-29.191856%2087.273692-54.94745%2015.22782-17.059538%2030.959106-34.654264%2043.889603-35.164894%2011.103896%200.453325%2025.731034%2015.673981%2039.401382%2031.069623%201.284249%201.535983%202.568499%203.076058%203.847631%204.615111%2019.891026%2023.925922%2042.269709%2050.846038%2075.065649%2054.102199%202.0241%200.214894%204.079922%200.328481%206.169513%200.328481%200.081864%200%200.160659-0.00614%200.243547-0.00614%200.083911%200%200.164752%200.00614%200.249687%200.00614%2032.633235%200%2056.297191-23.342638%2076.900438-46.573735%202.403746-2.619664%204.76963-5.239328%207.102768-7.822153%2015.127536-16.749476%2032.273031-35.735899%2044.071751-35.735899%200.445138%200%200.884137%200.052189%201.327228%200.082888%208.052396%200.957815%2017.271362%208.590656%2026.521027%2018.312064%203.831258%204.319375%207.927553%209.293667%2012.446473%2014.887059%209.485025%2011.740392%2020.062941%2024.792663%2032.985252%2035.438117%209.496282%208.562003%2019.820418%2014.903431%2031.335682%2018.377556C868.843244%20687.202301%20859.853499%20688.293145%20847.61885%20688.293145zM864.21483%20794.077424c0%2039.545668-31.28554%2071.247694-70.831208%2071.247694L236.021481%20865.325118c-39.545668%200-72.771397-31.702026-72.771397-71.247694l0-63.828724%2016.353456%200L847.61885%20730.248699l16.59598%200L864.21483%20794.077424z%22%20fill%3D%22%23515151%22%20p-id%3D%229796%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M415.662885%20262.32966c11.863189%200%2021.516036-9.650801%2021.516036-21.516036s-9.651824-21.516036-21.516036-21.516036c-11.864212%200-21.516036%209.650801-21.516036%2021.516036S403.797649%20262.32966%20415.662885%20262.32966z%22%20fill%3D%22%23515151%22%20p-id%3D%229797%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M307.058374%20377.080148c11.863189%200%2021.516036-9.650801%2021.516036-21.516036s-9.651824-21.516036-21.516036-21.516036c-11.864212%200-21.516036%209.650801-21.516036%2021.516036S295.194162%20377.080148%20307.058374%20377.080148z%22%20fill%3D%22%23515151%22%20p-id%3D%229798%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M618.526175%20262.32966c11.863189%200%2021.516036-9.650801%2021.516036-21.516036s-9.651824-21.516036-21.516036-21.516036c-11.864212%200-21.516036%209.650801-21.516036%2021.516036S606.66094%20262.32966%20618.526175%20262.32966z%22%20fill%3D%22%23515151%22%20p-id%3D%229799%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M517.094018%20377.080148c11.863189%200%2021.516036-9.650801%2021.516036-21.516036s-9.651824-21.516036-21.516036-21.516036c-11.864212%200-21.516036%209.650801-21.516036%2021.516036S505.229806%20377.080148%20517.094018%20377.080148z%22%20fill%3D%22%23515151%22%20p-id%3D%229800%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M727.129662%20377.080148c11.863189%200%2021.516036-9.650801%2021.516036-21.516036s-9.651824-21.516036-21.516036-21.516036c-11.864212%200-21.516036%209.650801-21.516036%2021.516036S715.26545%20377.080148%20727.129662%20377.080148z%22%20fill%3D%22%23515151%22%20p-id%3D%229801%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
          me_img:'data:image/svg+xml,%3Csvg%20t%3D%221689642783627%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%2212915%22%20width%3D%2248%22%20height%3D%2248%22%3E%3Cpath%20d%3D%22M498.176%20546.304c-133.12%200-241.152-108.032-241.152-241.152s108.032-241.152%20241.152-241.152%20241.152%20108.032%20241.152%20241.152-108.032%20241.152-241.152%20241.152z%20m0-431.104c-104.96%200-189.952%2084.992-189.952%20189.952s84.992%20189.952%20189.952%20189.952%20189.952-84.992%20189.952-189.952-84.992-189.952-189.952-189.952z%22%20fill%3D%22%23515151%22%20p-id%3D%2212916%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M856.576%20920.064c-14.336%200-25.6-11.264-25.6-25.6%200-183.808-149.504-332.8-332.8-332.8s-332.8%20149.504-332.8%20332.8c0%2014.336-11.264%2025.6-25.6%2025.6s-25.6-11.264-25.6-25.6c0-211.968%20172.544-384%20384-384%20211.968%200%20384%20172.544%20384%20384%200%2013.824-11.264%2025.6-25.6%2025.6z%22%20fill%3D%22%23515151%22%20p-id%3D%2212917%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
          wx_img:'data:image/svg+xml,%3Csvg%20t%3D%221689734267586%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%223207%22%20width%3D%2264%22%20height%3D%2264%22%3E%3Cpath%20d%3D%22M512%20136c-208%200-376%20144-376%20320%200%20108.8%2064%20209.6%20172.8%20268.8%2011.2%206.4%2025.6%201.6%2032-9.6%206.4-11.2%201.6-25.6-9.6-32-92.8-51.2-147.2-136-147.2-227.2%200-150.4%20147.2-272%20328-272s328%20121.6%20328%20272-147.2%20272-328%20272c-6.4%200-12.8%203.2-17.6%206.4l-86.4%2086.4V752c0-12.8-11.2-24-24-24s-24%2011.2-24%2024v128c0%209.6%206.4%2019.2%2014.4%2022.4%203.2%201.6%206.4%201.6%209.6%201.6%206.4%200%2012.8-3.2%2017.6-6.4l121.6-121.6c203.2-4.8%20366.4-145.6%20366.4-320-1.6-176-169.6-320-377.6-320z%22%20p-id%3D%223208%22%20fill%3D%22%23515151%22%3E%3C%2Fpath%3E%3Cpath%20d%3D%22M312%20424h400c12.8%200%2024-11.2%2024-24s-11.2-24-24-24h-400c-12.8%200-24%2011.2-24%2024s11.2%2024%2024%2024zM312%20568H624c12.8%200%2024-11.2%2024-24s-11.2-24-24-24H312c-12.8%200-24%2011.2-24%2024s11.2%2024%2024%2024z%22%20p-id%3D%223209%22%20fill%3D%22%23515151%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',
          products: [],
          loading_products:[{id:1},{id:2},{id:3},{id:4},{id:5},{id:6}],
          me_cs_img:'data:image/svg+xml,%3Csvg%20t%3D%221689841739117%22%20class%3D%22icon%22%20viewBox%3D%220%200%201024%201024%22%20version%3D%221.1%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20p-id%3D%225533%22%20id%3D%22mx_n_1689841739118%22%20width%3D%2264%22%20height%3D%2264%22%3E%3Cpath%20d%3D%22M448%20917.376C448%20917.333333%20576%20917.333333%20576%20917.333333c0.085333%200%200-42.709333%200-42.709333C576%20874.666667%20448%20874.666667%20448%20874.666667c-0.085333%200%200%2042.709333%200%2042.709333z%20m371.349333-173.034667C809.6%20745.877333%20799.573333%20746.666667%20789.333333%20746.666667a21.333333%2021.333333%200%200%201-21.333333-21.333334V384a21.333333%2021.333333%200%200%201%2021.333333-21.333333%20191.146667%20191.146667%200%200%201%2092.373334%2023.637333C828.202667%20234.517333%20681.045333%20128%20511.296%20128%20341.290667%20128%20193.749333%20234.816%20140.458667%20387.328A191.125333%20191.125333%200%200%201%20234.666667%20362.666667a21.333333%2021.333333%200%200%201%2021.333333%2021.333333v341.333333a21.333333%2021.333333%200%200%201-21.333333%2021.333334%20192%20192%200%200%201-148.906667-313.216%2021.269333%2021.269333%200%200%201%200.042667-8.682667C127.36%20228.288%20304.469333%2085.333333%20511.274667%2085.333333c209.706667%200%20388.544%20146.944%20427.008%20347.093334l0.213333%201.344A191.210667%20191.210667%200%200%201%20981.333333%20554.666667c0%2070.4-37.909333%20131.968-94.421333%20165.397333-57.642667%20100.693333-154.752%20174.762667-268.778667%20204.074667A42.517333%2042.517333%200%200%201%20576%20960h-128c-23.573333%200-42.666667-19.157333-42.666667-42.624v-42.752c0-23.552%2018.922667-42.624%2042.666667-42.624h128c23.573333%200%2042.666667%2019.157333%2042.666667%2042.624v5.141333a392.810667%20392.810667%200%200%200%20200.682666-135.424zM85.333333%20554.666667c0.298667%20133.589333%20128%20148.949333%20128%20148.949333V406.144s-128.298667%2014.933333-128%20148.522667z%20m853.333334%200c0.298667-133.589333-128-148.522667-128-148.522667v297.472s127.701333-15.36%20128-148.949333z%22%20fill%3D%22%23171008%22%20p-id%3D%225534%22%3E%3C%2Fpath%3E%3C%2Fsvg%3E',

          avatar_url:defaultAvatarUrl,
          // me_rule_array:[
          //   {type:'me_rule',name:'平台规则',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_rule.png'}
          //  ,{type:'me_recharge',name:'充值会员',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_recharge.png'}
          //  ,{type:'me_vip',name:'VIP会员',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_vip.png'}
          //  ,{type:'me_set',name:'设置',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_set.png'}
          //   ],
          // me_bill_array:[
          //     {type:'me_needpay',name:'待付款',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_needpay.png', number:0}
          //     ,{type:'me_needsendgoods',name:'待发货',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_needsendgoods.png', number:0}
          //     ,{type:'me_needreceivegoods',name:'待收货',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_needreceivegoods.png', number:0}
          //     ,{type:'me_needcomment',name:'待评价',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_needcomment.png', number:0}
          //     ,{type:'me_returngoodsservice',name:'退货/售后',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_returngoodsservice.png', number:0}
          //   ],
          me_rule_array:[
         
           {type:'me_recharge',name:'充值会员',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_recharge.png?x=1'}
           ,{type:'me_vip',name:'VIP会员',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_vip.png?x=1'}
           ,{type:'me_dingke',name:'叮客管理',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_dingke.png?x=1'}
           ,{type:'me_benefit',name:'我的收益',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_dingke.png?x=1'}
          //  ,{type:'me_outfit',name:'试衣',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_dingke.png?x=1'}
          //  ,{type:'me_mallqrcodebill',name:'代金券收取',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_dingke.png?x=1'}

           
            ],
          me_bill_array:[
              {type:'me_mall_bill',name:'商城订单',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_mall_bill.png', number:0}
              ,{type:'me_rice_bill',name:'鲜仙米订单',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_rice_bill.png?=1', number:0}
              ,{type:'me_mall_goods_collect',name:'收藏商品',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_shoucang.png', number:0}
              ,{type:'me_rule',name:'平台规则',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_rule.png?x=1'}
              ,{type:'me_set',name:'设置',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_set.png?x=1'}
              // ,{type:'me_voucher_qrcode_code',name:'收取代金券',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_rice_bill.png?=1', number:0}              
            ],
          me_share_array:[
              {type:'me_budget',name:'收支',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_budget.png'}
             ,{type:'me_cash',name:'现金',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_cash.png'}
             ,{type:'me_star',name:'星盾',url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/me_star.png'}
          ],
		  m_right_img:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me/m_right.png',
		  
		  //显示商品分页属性
		  page_index: 1,
		  page_size: 20,
		  isLoading: false,
		  isOver: false, 
      categoryID: 0,
      selectedCategory: 'qbsp',
      mall_bill_shopping_cart_total_number:0,//购物车数量
      platform_member_rule_url:'',
      buyer_id:0,
      buyer_user_code:'',
      categories_is_loading:0,//商品是否正在加载
      isOldLoading:false,
      ding_not_read_count:0,
      dingDialog:false,
      is_group_qrcode_scan:1,
      showQR:false,
      outfit_rule:'',
      
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) { 
      var that=this;   
      console.log("mall/index");
      console.log(options);

      if(options.category_id){
        this.setData({
          categoryID:Number(options.category_id),
        })
      }
      if(options.selected_category){
        this.setData({
          selectedCategory:options.selected_category,
        })
      }
      

      if(options.is_voucher_deduction&&options.scan_staff_shop_id&&options.scan_staff_id){

          var is_voucher_deduction=Number(options.is_voucher_deduction);
          var scan_staff_shop_id=Number(options.scan_staff_shop_id);
          var scan_staff_id=Number(options.scan_staff_id);

          
            if(is_voucher_deduction>0&&scan_staff_shop_id>0&&scan_staff_id>0){

              var scan_uuid=options.scan_uuid;
             
              //查询指定店铺可使用的代金券
              var shop_id=scan_staff_shop_id;
              var  customer_id=app.globalData.customerInf.id;
              var  staff_id= scan_staff_id;

              if(shop_id>0&&customer_id>0){
                wx.navigateTo({
                  url: '/pages/mall/pages/mallqrcodebill/mallqrcodebill?shop_id='+shop_id+'&customer_id='+customer_id+'&staff_id='+staff_id+'&scan_uuid='+scan_uuid,
                })
              }

              
            }


      }
     
      this.setRandomNumber();
      
      that.initMallData(options);
      that.initRestaurantData(options);      
      //从main.js复制过来     
      that.selectDingMsgRecordNotReadTotal();

      if(app.globalData.is_video_show == 0){
        that.setData({
          func_item: [
            {type:'qbsp',name:'全部商品',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/tcsj.png'}           
                        
           ,{type:'fxzq',name:'分享赚钱',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/fxzq.png'}           
           ,{type:'qgqc',name:'切瓜切菜',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/qgqc.png'}
           ,{type:'bzzx',name:'帮助中心',img_url:'https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/bzzx.png'}              
          ],
        })
      }
	},

	// 加载下一页数据
	loadNextPage: function () {	
		console.log('loadNextPage')	
		if (this.data.isLoading || this.data.isOver) {
			// 防止重复加载
			return;
		}
		// 加载下一页数据
		const nextPageIndex = this.data.page_index + 1;		
		this.setData({
			isLoading: true, // 设置isLoading为true，表示正在加载数据
			page_index: nextPageIndex,
		});		
		this.getCategories();
	},
	
	goToAllOrders(){		
		wx.navigateTo({
		  url: '../../../module_discount/pages/allorders/allorders?status=0',
		})
	},

	goToSearch(){
		wx.navigateTo({
			url: '../search/search',
		  })
	},

	goToOrders(e){
    
    var that=this;
		var status = 0
		if(e.currentTarget.dataset.type == 'me_needpay'){
			status = 1
		} else if (e.currentTarget.dataset.type == 'me_needsendgoods'){
			status = 2
		} else if (e.currentTarget.dataset.type == 'me_needreceivegoods'){
			status = 3
		} else if (e.currentTarget.dataset.type == 'me_needcomment'){
			status = 4
		} else if (e.currentTarget.dataset.type == 'me_returngoodsservice'){
			status = 5
    } 	
    if(e.currentTarget.dataset.type=='me_mall_bill'){
      wx.navigateTo({
        url: '../../../module_discount/pages/allorders/allorders?status=0',
      })
    }else if(e.currentTarget.dataset.type=='me_rice_bill'){
      //暂无功能
      wx.navigateTo({
        url: '/pages/mall/pages/riceorders/riceorders?status=0',
      })
      //me_article_effect_main
      //yxsp
    }else if(e.currentTarget.dataset.type=='me_mall_goods_collect'){
      if(app.globalData.openid){
        wx.navigateTo({
          url: '/pages/mall/pages/goodscollect/goodscollect?customer_openid='+app.globalData.openid,
        })
      }else{
        wx.showToast({
          title: 'openid为空',
          icon:'none'
        })
      }
    }else if(e.currentTarget.dataset.type=='me_rule'){

      wx.navigateTo({
        url: '/pages/help/help?from_page=mall_index',
      })
      return;
    } else if(e.currentTarget.dataset.type=='me_set'){

      that.showMallSetDialog();
    }
		
	},

    initMallData(options){
      if(options.selectedCategory){
        this.setData({
          selectedCategory:options.selectedCategory
        })
      }   
      if(options.categoryID){
        this.setData({
          categoryID:Number(options.categoryID)
        })
      }  
      this.getCategories();
      var sis = wx.getSystemInfoSync()
      var mbbc = wx.getMenuButtonBoundingClientRect()
      this.setData({
          return_out_top: sis.statusBarHeight,
          return_out_height: (mbbc.height + (mbbc.top - sis.statusBarHeight) * 2),
          tabBarHeight: sis.screenHeight - sis.safeArea.bottom,
          swiperHeight: sis.safeArea.bottom - (sis.statusBarHeight + (mbbc.height + (mbbc.top - sis.statusBarHeight) * 2)) - 50,
          swiperTop: sis.statusBarHeight + (mbbc.height + (mbbc.top - sis.statusBarHeight) * 2)
      })
	},
	
    initRestaurantData(options){

      //bind开始
    if (options.q) {
      let url = decodeURIComponent(options.q)
      if (url.indexOf('https://') != -1 && url.indexOf('?uuid=') != -1) {
        if (url.indexOf(app.globalData.QRCodeUrl) != -1) {
          let a = url.substring(url.indexOf('?') + 6)
          wx.request({
            url: app.globalData.getOneQrUuid,
            data: {
              qrUuid: a
            },
            method: 'POST',
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: res => {
                      //微信界面扫码进来处理逻辑更改  先读取是否有订单，如果有，则进入选择订单界面
                      let a = res.data.data.miniProgram
                      var parameter = a.split("=")[1]
                      var parameter_arry = parameter.split("_")
                      console.log(parameter_arry[0])

                      if (parameter_arry[0].search(",") != -1) {
                        var arr = parameter_arry[0].split(",")
                      } else if (parameter_arry[0].search("%2C") != -1) {
                        var arr = parameter_arry[0].split("%2C")
                      }
                      console.log(arr)
                      if (arr != undefined) {
                        var shopid = parseInt(arr[1])
                        var tableid = parseInt(arr[2])
                        that.setData({
                          shopid: shopid,
                          tableid: tableid
                        })
                        that.setAppShopId(shopid)
                     
                        that.getFocusList(shopid, tableid)

                        console.log("店名ID:" + shopid + "桌位ID:" + tableid)
                      }else{
                        wx.navigateTo({
                            url: '/' + res.data.data.miniProgram,
                        })
                              
                      }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '请扫描' + (res.result.indexOf(app.globalData.QRCodeUrl) != -1 ? '正式服' : '测试服') + '二维码',
            success(res) {
       
            }
          })
        }
      } else if (url.indexOf('https://') != -1 && url.indexOf('?dyToMeal=') != -1) {
        if (url.indexOf(app.globalData.QRCodeUrl) != -1) {
        
          let str1 = decodeURIComponent(url).substring(decodeURIComponent(url).indexOf('?dyToMeal=') + 10)
          wx.request({
           
            url: app.globalData.selectTiktokVideoManagementByTiktokVideoName,
            data: {
              tiktok_video_name: str1
            },
            method: 'GET',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: res => {
              if (res.data.code == 1) {
                if (res.data.data != null) {
                  let inf = res.data.data;
                  let file_id = inf.setMeal_id ? 0 : 1;

                  let mini_program_page = '';
                  let data = '';

                  if (inf.setMeal_id > 0 || inf.coupon_id > 0) {
                    if (inf.setMeal_id > 0) data = '?id=0&setMealID=' + inf.setMeal_id + '&ruleID=' + inf.rule_id + '&clip=' + str1;
                    if (inf.coupon_id > 0) data = '?id=1&coupon_id=' + inf.coupon_id + '&ruleID=' + inf.rule_id + '&shop_id=' + inf.shop_id + '&clip=' + str1;
                  } else {
                    if (inf.setMeal_id == 0) data = '?shop_id=' + inf.shop_id + '&shop_name=' + inf.shop_name + '&clip=' + str1;
                    if (inf.coupon_id == 0) data = '?shop_id=' + inf.shop_id + '&shop_name=' + inf.shop_name + '&file_id=' + file_id + '&clip=' + str1;
                  }

                  mini_program_page = '/' + inf.mini_program_page + data;

                  wx.navigateTo({
                    url: mini_program_page,
                  })
                }
              } else {
                wx.showToast({
                  title: '查询失败',
                  icon: 'error'
                })
              }
            }
          })
          return
        } else {
          wx.showModal({
            title: '提示',
            content: '请扫描' + (res.result.indexOf(app.globalData.QRCodeUrl) != -1 ? '正式服' : '测试服') + '二维码',
            success(res) {
   
            }
          })
          return
        }
      }
      else if (url.indexOf('https://') != -1 && url.indexOf('?bind_type=') != -1) {
      
        let str1 = decodeURIComponent(url).substring(decodeURIComponent(url).indexOf('?bind_type='))
        
        let a = JSON.parse(str1.replace(/\?/g, "{\"").replace(/=/g, "\":\"").replace(/&/g, "\",\"") + "\"}")
        this.setData({
          bind_type: a.bind_type,
          bind_shop_id: a.bind_shop_id,
          bind_customer_id: a.bind_customer_id ? a.bind_customer_id : 0,
          bind_staf_id: a.bind_staf_id ? a.bind_staf_id : 0,
          bind_meals_type: a.bind_meals_type,
          bind_meals_id: a.bind_meals_id,
          bind_person_name: a.bind_person_name,
          bind_dbo_order_inf_order_id:a.bind_dbo_order_inf_order_id?a.bind_dbo_order_inf_order_id:0,
        })
   
        wx.navigateTo({
            url: '/pages/module_others/pages/QRCodeToPage/QRCodeToPage?nostr='+JSON.stringify(a),
        })

      }
    }
    //bind结束

    if (options.focus_path) {
      console.log(options.focus_path.replace(/{"/g, "?").replace(/":"/g, "=").replace(/","/g, "&").replace(/"}/g, "").replace(/\\"/g, ""))
      wx.navigateTo({
        url: "/pages/module_discount/pages/order/order" + options.focus_path.replace(/{"/g, "?").replace(/":"/g, "=").replace(/","/g, "&").replace(/"}/g, "").replace(/\\"/g, ""),
      })
    } else {
    //   wx.getClipboardData({
    //     success: res => {
    //       wx.hideToast({
    //         success: (res) => {},
    //       })
    //       let str = res.data;
    //       if (str) {
    //         let str1 = ''
    //         let cutstr = new Promise((a, b) => {
    //           let tmp = new RegExp('[\\】].*?[\\\s|\.|#]{1}');
    //           let list = str.match(tmp);
    //           if (!list) {
    //             return;
    //           }
    //           str1 = list[0].substring(1, list[0].length - 1);
    //           if (str1 == '{0}') {
    //             wx.request({
    //               url: 'https://api.atim2k.top/takeTikTokTitle',
    //               data: {
    //                 url: 'https://' + str.split('https://')[1]
    //               },
    //               method: 'GET',
    //               success: res => {
    //                 str1 = res.data.title
    //                 a()
    //               }
    //             })
    //           } else {
    //             a()
    //           }
    //         })
    //         cutstr.then(res => {
    //           if (!str1) {
    //             return;
    //           }
    //           if (wx.getStorageSync('clip') && wx.getStorageSync('clip') != str1) {
    //             wx.removeStorageSync('clip')
    //           }
    //           wx.request({
    //             url: app.globalData.selectTiktokVideoManagementByTiktokVideoName,
    //             data: {
    //               tiktok_video_name: str1
    //             },
    //             success: res => {
    //               if (res.data.code == 1) {
    //                 if (res.data.data != null) {
    //                   let inf = res.data.data;
    //                   let file_id = inf.setMeal_id ? 0 : 1;

    //                   let mini_program_page = '';
    //                   let data = '';

    //                   if (inf.setMeal_id > 0 || inf.coupon_id > 0) {
    //                     if (inf.setMeal_id > 0) data = '?id=0&setMealID=' + inf.setMeal_id + '&ruleID=' + inf.rule_id + '&clip=' + str1;
    //                     if (inf.coupon_id > 0) data = '?id=1&coupon_id=' + inf.coupon_id + '&ruleID=' + inf.rule_id + '&shop_id=' + inf.shop_id + '&clip=' + str1;
    //                   } else {
    //                     if (inf.setMeal_id == 0) data = '?shop_id=' + inf.shop_id + '&shop_name=' + inf.shop_name + '&clip=' + str1;
    //                     if (inf.coupon_id == 0) data = '?shop_id=' + inf.shop_id + '&shop_name=' + inf.shop_name + '&file_id=' + file_id + '&clip=' + str1;
    //                   }

    //                   mini_program_page = '/' + inf.mini_program_page + data;

    //                   wx.navigateTo({
    //                     url: mini_program_page,
    //                   })
    //                 }
    //               } else {
    //                 wx.showToast({
    //                   title: 'dy查询失败',
    //                   icon: 'error'
    //                 })
    //               }
    //             }
    //           })
    //         })
    //       }
    //     },
    //     complete: res => {
    //       wx.hideToast({
    //         success: (res) => {},
    //       })
    //     }
    //   })
     }

    if (options.toshopid) {
      wx.navigateTo({
        url: '/pages/module_others/pages/QR_to_shop/QR_to_shop?shopid=' + options.toshopid,
      })
    }
    
    var that = this
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res)
          var code = res.code
          wx.request({
            url: app.globalData.allUrl.getUnionID,
            data: {
              wechatAppId: app.getWechatAppId(),                  
              code: code,
              encryptedData: '',
              iv: '',
            },
            header: {
              'content-type': 'application/json;charset=utf-8' // 默认值
            },
            method: 'POST',
            success: function (res) {
              console.log(res, "unionId和openId")
              var openid = res.data.data.openid
              var unionID = res.data.data.unionId
              let promise = new Promise(resolve => {
                app.getCustomerInfo(res.data.data.openid)
                resolve();
              })
              promise.then(resolve => {
                wx.getLocation({
                  type: 'wgs84',
                  success: function (res) {
                    //添加进入小程序的记录(获取经纬度)

                    qqmap.reverseGeocoder({
                      location: {
                          latitude: res.latitude,
                          longitude: res.longitude
                      },
                      success: function (res1) {
                          console.log("获取到经纬度")
                          var a = res1.result.address_component
                          //获取市和区（区可能为空）
                          var provinceName = a.province
                          var cityName = a.city
                          var countyName = a.district
                          var isPosition = true
                          //赋值给全局变量
                          var defaultProvince = provinceName
                          var defaultCity = cityName
                          var defaultCounty = countyName
                          var localtionCounty = countyName
                          var isPosition = isPosition
                          //控制台输出结果
                          console.log(provinceName,cityName, countyName, res.latitude+'', res.longitude+'')
                          // that.selectCityID()
                      },
                      fail: function (res) {
                          console.log('获取地址失败' + res);
                      },
                      complete: function (res) {
                          console.log(res);
                      }
                  })


                    wx.request({                          
                      url: app.globalData.addLocationHistory,
                      method: 'POST',
                      data: {
                        customerId: app.globalData.customerInf.id,
                        longitude: res.longitude,
                        latitude: res.latitude
                      },
                      success: res => {                           
                      }
                    })
                  }
                })


                
              })

              that.setData({
                openId: openid,
                unionID: unionID
              }, () => {
                console.log(sceneValue.scene, "场景值-1");
                if (sceneValue.scene == 1011) {
                  that.getFocusList("", "")
                }
              })

              app.globalData.unionID = res.data.data.unionId
              app.globalData.openid = res.data.data.openid             
            }
          })
        }
      }
    })

    if (app.globalData.username === '') {
      wx.getStorage({
        key: "userInfoName",
        success: res => {
          app.globalData.username = res.data
        }
      })
    }
    if (options.jump == '0') {
      console.log(options.user_id)
      console.log(options.userInfoName)
      console.log(options.phonenumber)
      console.log(options.jump)
      wx.setStorageSync('user_id', options.user_id)

      wx.setStorageSync('phonenumber', options.phonenumber)
      wx.navigateTo({
        url: '/pages/search/search?jump=' + 0,
      })
    }
    if (options.dyuserid) {
      that.jump_taocan_list(options.dyuserid)
    }
    // 当首次登录带有邀请者id的时候，在授权之后记录新用户信息，邀请者加星盾
    // 当登录是带有堂食二维码、获取id，跳转到相对应的店铺
    // 首先获取用户unionId，如果获取不到即视为未登录/未授权，获得到即为登录
    // 而且如果user_code不为null的时候，则为注册
    // 解决背景图无法显示问题
    var that = this;
    if (options.scene != null) {
      console.log(options)
      if (options.scene.indexOf(",") != -1 || options.scene.indexOf("%2C") != -1) {
        wx.redirectTo({
          url: '../guide/guide?scene=' + options.scene,
        })
      } else {
        console.log("部长绑定")
        //店员id和用户id
        var staff_id = options.scene.split("=")[1]
        var union_id = app.globalData.unionID
        that.BindingCustomer(staff_id, union_id)
      }
    }
    //获取中间的图片判断
    wx.request({
      url: app.globalData.ManagementGetDataServlet_url,
      data: {
        shop_id: 20903
      },
      success: function (res) {
        console.log(res.data.mornibg_tea)
        var img_Url = -1;
        if (res.data.data.mornibg_tea == 1) {
          img_Url = 1
        } else {
          img_Url = 0
        }
        that.setData({
          img_Url: img_Url
        })
      }
    })

    if (options.shopid != null) {
      console.log(options.shopid)
      console.log("options============" + options.shopid + "店铺程序跳转")
      app.globalData.shopid = options.shopid
      wx.navigateTo({
        url: '../index/index',
      })
    }

    that.setData({
      isPosition: app.globalData.isPosition
    });

    app.globalData.background2 = that.data.background2

    //自动跳转到店铺首页
    if (app.globalData.jump == true) {
      app.globalData.jump = false
      wx.navigateTo({
        // url: '../index/index',
        url:'/pages/index/index'
      })
    }
  
    if (options.toLove) {
      wx.navigateTo({
        url: '/pages/module_discount/pages/loveSet/loveSet',
      })
    }

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {
        //
      



    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
      this.setRandomNumber();
      this.setData({
        page_index: 1,
      })
      this.getCategories();
      this.getCurrentVersion();

      this.selectMallBillShoppingCartTotalNumber();
      this.initHeadIcon();
      this.initMemberLevelName();
      this.getAllOrdersNum();
      this.selectSingleShop();
      if(app.globalData.enter_shop_id_inited==true&&app.globalData.enter_shop_id>0){
        if(app.globalData.openid){
          app.insertMemberInfoExec(app.globalData.enter_shop_id,app.globalData.openid)
        }
      }
      
      
    },
    initHeadIcon(){
      //从本地获取
      var that=this;
      let customerInfo = app.globalData.customerInf
   
      if(customerInfo.id && customerInfo.id > 0){
          console.log(customerInfo)
          var avatar_url=customerInfo.avatarUrl?customerInfo.avatarUrl:defaultAvatarUrl;
          var nick_name=customerInfo.name?customerInfo.name:'';
          this.setData({
            nick_name:nick_name,
            avatar_url:avatar_url,
            buyer_id:customerInfo.id,
            buyer_user_code:customerInfo.userCode
          })
      }

      var data={
          openid: app.globalData.openid,
      }
      var that=this;
          wx.request({
              url:app.globalData.selectCustomerInfByOpenIdNew,
              data: data,
              method: 'POST',
              dataType:'json',
              success: res => {
                      console.log(res);
                      if(res.data.code==1000){
                          //成功
                          console.log("成功")
                          //var phone=res.data.data.phone;
                          var name =res.data.data.name;
                          var avatarUrl=res.data.data.avatarUrl;                 
                          if(name&&name.length>0){
                              that.setData({
                                nick_name:name,
                              })
                          }
                          if(avatarUrl&&avatarUrl.length>10){
                              that.setData({
                                avatar_url:avatarUrl,
                              })
                          }
                      }else{
                          wx.showToast({
                            title: '失败'+res.data.result,
                          })
                      }
                      //获取头像等信息     
              },
              complete:res=>{
               
              }
          });

    },
    initHeadIcon_Old(){

      var that=this;
      let customerInfo = app.globalData.customerInf
      if(customerInfo.id && customerInfo.id > 0){
          console.log(customerInfo)
          var avatar_url=customerInfo.avatarUrl?customerInfo.avatarUrl:defaultAvatarUrl;
          var nick_name=customerInfo.name?customerInfo.name:'';
          this.setData({
            nick_name:nick_name,
            avatar_url:avatar_url
          })
      }
      
    },


    initMemberLevelName(){
      var that=this;
      //先发请求看当前用户是否会员，是什么会员
      wx.request({
        url: app.globalData.selectMallPlatformMemberInfo_url,				
        method: 'POST',
        data: {
          customer_openid: app.globalData.openid,            
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
            var mall_member_level_tag='';
            var mall_member_level_name='';
            var mall_member_end_date='';
            if(res.statusCode != 200){
              app.showFailMessage(1, res)
            } else if(res.data.code == 1000){
              that.setData({
                channel_type:res.data.data.channel_type,
              })
              if(res.data.data.member_info !=null){                
                if(res.data.data.member_info.mall_member_level_id>0){
                  mall_member_level_tag=res.data.data.member_info.mall_member_level_tag;
                  mall_member_level_name=res.data.data.member_info.mall_member_level_name;
                  mall_member_end_date=res.data.data.member_info.mall_member_end_date;
                  that.setData({
                    mall_member_end_date:mall_member_end_date,
                    mall_member_level_name:mall_member_level_name,
                    mall_member_level_tag:mall_member_level_tag,
                  })  
                }                
              }
            }else{
              app.showFailMessage(2, res)
            } 
        },
        fail: function (err) {
         app.showFailMessage(3, err)
        }
      })

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {
    
    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {
		
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {	
		
	},
	

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    },

    customerService(){

      wx.navigateTo({
        url: '/pages/mall/pages/batteryrecharge/batteryrecharge',
      })
      return;
      wx.showModal({
        title: '功能实现中',
        content: '在弹叮商城客服功能实现之前，使用小程序遇到任何问题，请截图通过微信联系人反馈',
        showCancel: false
      })

    },

    pageChangeEvent(e) {
      console.log(e)
      var currentIndex=e.currentTarget.dataset.current;
      if(currentIndex==1||currentIndex==2||currentIndex==3){

        if(currentIndex==1){
            //跳转切瓜切菜           
            wx.navigateTo({url: '/pages/main/main',});
            return;
        }
        if(currentIndex==2){
            //跳转叮信
            wx.navigateTo({url: '/pages/mall/pages/dingke/dingke',});           
        }
        if(currentIndex==3){
            //跳转购物车
            wx.navigateTo({url: '/pages/module_discount/pages/freshshoppingcart/freshshoppingcart',});
            return;
        }

        return;
      }

      this.setData({
          pageIndex: e.currentTarget.dataset.current ? e.currentTarget.dataset.current : e.detail.current          
      })      
  },

  getAllOrdersNum(){
		let that = this
		wx.request({
		  url: app.globalData.selectMallBillMainStatusCount_url,
			method: 'POST',
			data: {
				 buyer_id: app.globalData.customerInf.id,				
				 buyer_type: 1,				 			 
			},
			success(res){
				if(res.data.code == 1000){
          var new_me_bill_array = that.data.me_bill_array
          //订单状态 1-已下单待付款 9-已付款待接单 2-已接单待发货 3-已发货待收货 4-已收货待评价 5-已评论订单完成 6-申请退款退货 7-同意退款退货 8-退款退货成功	
          new_me_bill_array[0].number = res.data.data.status_1_count
   
					that.setData({
						me_bill_array: new_me_bill_array						
					})
				}				
			},			
		})
  },

    getCategories() {		
    let that = this
    var categoryID=this.data.categoryID?this.data.categoryID:0;
    console.log('getCategories()'+categoryID)
    that.setData({
      categories_is_loading:1,
      isOldLoading:true,
    })
		wx.request({
			url: app.globalData.selectIndexMallBaseGoodsList_url,        
			method: 'POST',
			data: {                
				shop_id: app.globalData.is_video_show? 0 : 19318,    
				category_id: that.data.categoryID,        
				page_size: that.data.page_size,  
        page_index: that.data.page_index,
        random_number:that.data.random_number,              
			},
			header: {
				'content-type': 'application/json'
			},
			success: function (res) {	
        that.setData({
          categories_is_loading:0,
          isOldLoading:false,
        })
        if(res.statusCode != 200){
          app.showFailMessage(1, res) 
        } else if(res.data.code == 1000){
					const newProducts = res.data.data;
					if(newProducts.length == 0){
						that.setData({
							isOver: true,
						})
          }
          if(that.data.page_index==1){
            that.setData({
              products: newProducts,
              isLoading: false,
            })
          }else{
            that.setData({
              products: that.data.products.concat(newProducts),
              isLoading: false,
            })
          }
				
				}else{
          app.showFailMessage(2, res)
        }	                           
			},
			fail(res){
        that.setData({
          categories_is_loading:0,
          isOldLoading:false,
        })
				app.showFailMessage(3, res)
				that.setData({
					isLoading: false // 设置isLoading为false，表示数据加载完成（或加载失败）
				});
			}
		})
  },

  selectMallBillShoppingCartTotalNumber() {		
    let that = this
    console.log("selectMallBillShoppingCartTotalNumber()被调用")
    var buyer_id=0;
    if(app.globalData.customerInf&&app.globalData.customerInf.id){
      buyer_id=app.globalData.customerInf.id
    }
    if(buyer_id<=0){
      return;
    }
    wx.request({
      url: app.globalData.selectMallBillShoppingCartTotalNumber,        
      method: 'POST',
      data: {                
        buyer_id: buyer_id,               
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {				    
        if(res.data.code == 1000){
          var mall_bill_shopping_cart_total_number=Number(res.data.data);
          that.setData({
            mall_bill_shopping_cart_total_number:mall_bill_shopping_cart_total_number,
          })
        }	                           
      },
      fail(res){
      },
      complete(res){
        //回调函数每次执行完毕后，间隔5秒后执行
      }
    })

    
	},

    clickFunc(e){ 
      var that = this;     
      var type = e.currentTarget.dataset.type;     
      that.setData({
        selectedCategory: type,
      })

      if(type=="qgqc"){
        //跳转切瓜切菜
        //wx.navigateTo({url: '/pages/main/main',});
        //跳转到vip卡充值页面
        wx.navigateTo({
          url: '/pages/mall/pages/qgqcstaffqrcode/qgqcstaffqrcode',
        })
        return;
	  }

	  if(type=="fxzq"){		
        //跳转分享赚钱
        wx.navigateTo({url: '../bindInfo/bindInfo',});
        return;
	  }

	  if(type=="bzzx"){
        //跳转帮助中心
        wx.navigateTo({url: '/pages/help/help',});
        return;
    }   
   

	  this.setData({		
      page_index: 1,
      isOver: false,
    });
    
	  if(type=="zght"){
      //只显示中国航天
      this.setData({
        categoryID: 16
      })
      this.getCategories()
      return;
    }
    if(type=="hfp"){
      //只显示护肤品  改成精品粽子
      this.setData({
        categoryID: 21
      })
      this.getCategories()
      return;
    }
    if(type=="ryp"){
      //只显示日用品
      this.setData({
        categoryID: 18
      })
      this.getCategories()
      return;
    }

    if(type=="mj"){
      //只显示日用品
      this.setData({
        categoryID: 19
      })
      this.getCategories()
      return;
    }
    
    if(type=="mc"){
      //只显示名茶
      this.setData({
        categoryID: 20
      })
      this.getCategories()
      return;
    }

	  if(type=="fzsp"){
      //只显示野服装饰品
      this.setData({
        categoryID: 15
      })
      this.getCategories()
      return;
    }

    if(type=='theme_dating'){
      wx.navigateTo({
        url: '/pages/mall/pages/themedating/themedating',
      })
      return;
    }
    
	  if(type=="ysbj"){
      //只显示养生保健商品
      this.setData({
        categoryID: 8
      })
      this.getCategories()
      return;
    }
    
    if(type=="smjd"){
      //只显示数码家电商品
      this.setData({
        categoryID: 10
      })
      this.getCategories()
      return;
    }

    if(type=="qbsp"){
      //显示全部商品
      this.setData({
        categoryID: 0
      })
      this.getCategories()
      return;
    }
    
    if(type=="sxps"){
      //只显示生鲜配送商品
      this.setData({
        categoryID: 7
      })
      this.getCategories()
      return;
    }
    
    if(type=="hxgh"){
      //只显示海鲜干货商品
      this.setData({
        categoryID: 11
      })
      this.getCategories()
      return;
    }
    
	  if(type=="yxsp"){
      //只显示优品优选
      this.setData({
        categoryID: 12
      })
      this.getCategories()
      return;
    }
    if(type=="xndm"){
      //只显示优品优选
      this.setData({
        categoryID: 14
      })
      this.getCategories()
      return;
    }
	},
	
    toDetail(e){
      var item = e.currentTarget.dataset.item;
      wx.navigateTo({
        url: '/pages/module_discount/pages/Merchandise_details/Merchandise_details?goods_id=' + item.id,
	  })

	},
	
    catchTouchMove() {
      return false;
    },
    meRuleArrayClick(e){
      var that=this;
      var item =e.currentTarget.dataset.item;

  
      if(item.type=='me_recharge'){
        that.toScanCodeDeduction()
        return;
      }

      if(item.type=='me_vip'){
        that.toVipRecharge();
        return;
      }

      if(item.type=='me_dingke'){
        wx.navigateTo({
          url: '/pages/mall/pages/dingkemanage/dingkemanage',
        })
        return;
      }

      if(item.type=='me_benefit'){
        wx.navigateTo({
          url: '/pages/mall/pages/mallpersonalbenefit/mallpersonalbenefit',
        })
        return;
      }
      // if(item.type=='me_outfit'){
      //   this.setData({
      //     typeDialogShow:true,
      //   })
        
      //   return;
      // }
      if(item.type=='me_mallqrcodebill'){
        this.selectCustomerIsStaff(); 
        return;
      }
   
    },

    openRuleFile(e){
    
      var that=this;
      var ruleFileAddress='https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/zsfiles/XDYT/upload/20903/file/113513充整预存优惠规则.docx';
      ruleFileAddress=this.data.platform_member_rule_url;

      wx.downloadFile({ //运用微信自带的方法对该链接进行下载转换获取到临时的可供微信使用的链接
        url: ruleFileAddress,
  
        success(res2) {
          that.setData({
            tempFilePath: res2.tempFilePath
          })
          wx.openDocument({ //打开这个临时链接，也就是打开文件，这里可以两个方法整合在一起，作为一个打开文件按钮
            filePath: that.data.tempFilePath,
            success: function (res3) {
            },
            fail: function () {
              wx.showModal({
                title: '提示',
                content: '没有找到可以使用的打开工具',
              })
            }
          })
  
        }
      })

    },

    showMallMemberDialog(){
      var that=this;
      var mall_member_level_tag=this.data.mall_member_level_tag;

      
      if(mall_member_level_tag==''){
        // this.setData({
        //   mall_member_dialog:true,
        // })
        this.openRuleFile();
      }else{
       
        if(mall_member_level_tag=='recharge_member_price'){

          that.toScanCodeDeduction();
        }else if(mall_member_level_tag=='vip_member_price'){

          that.toVipRecharge();
        }
      }
     

    },
    showMallSetDialog(){
      this.setData({
        mall_set_dialog:true,
      })
    },

    closeMallMemberDialog(){
      this.setData({
        mall_member_dialog:false,
      })
    },

    closeMallSetDialog(){
      this.setData({
        mall_set_dialog:false,
      })
    },

    toScanCodeDeduction(){
      var param='channel_type='+this.data.channel_type;
      var toUrl='/pages/mall/pages/scancodedeductionnew/scancodedeductionnew?'+param;
      this.clickCheckIsMallVip(toUrl);
    },

    toVipRecharge(){      
      var toUrl='/pages/mall/pages/viprecharge/viprecharge';
      this.clickCheckIsMallVip(toUrl);   
    },

    clickCheckIsMallVip(toUrl){

      wx.navigateTo({
        url: ''+toUrl,
      })
      // wx.request({
      //   url: app.globalData.checkIsMallVip,                
      //   method: 'POST',
      //   data: {
      //     customer_openid: app.globalData.openid,            
      //   },
      //   header: {
      //     'content-type': 'application/json'
      //   },
      //   success: function (res) {    
      //       if(res.data.code == 1000){
      //         if(res.data.data.is_vip == 1){
      //           wx.showModal({
      //             title: '您已经是VIP会员！有效期到：' + res.data.data.end_date,
      //             showCancel: false
      //           })
      //         }else{
      //           wx.navigateTo({
      //             url: ''+toUrl,
      //           })
      //         }
      //       } 
      //   }
      // })
    },
    refreshAvatar() {
      console.log(123111111111111)
      this.initHeadIcon();
      if(app.globalData.enter_shop_id_inited==true&&app.globalData.enter_shop_id>0){
        if(app.globalData.openid){
          app.insertMemberInfoExec(app.globalData.enter_shop_id,app.globalData.openid)
        }
      }

      if(this.data.is_group_qrcode_scan==1){
        var path="https://smp-south-china.oss-cn-shenzhen.aliyuncs.com/qgqc/mall/me_group_qrcode.jpg";
        this.showGroupQrCodeImg(path);
      }

      wx.showToast({
        title: '点击了更新按钮',
      })
  },
  showGroupQrCodeImg: function (current) { //查看照片大图                                       
    var that = this;
    var imgArray =[];
    imgArray.push(current);
    if(imgArray.length==0){
        return;
    }
    wx.previewImage({
        current: current, // 当前显示图片的http链接
        urls: imgArray // 需要预览的图片http链接列表
    })
  },
  head_portrait_new_show_click(e){
    if(app.globalData.openid&&app.globalData.openid!=''){
      
          this.setData({
            head_portrait_new_show:true,
          })

    }else{
        wx.showToast({
          title: 'openid异常',
          icon:'error'
        })
    }
  },
  toAddressList(){
    wx.navigateTo({
      url: '/pages/module_discount/pages/customeraddresslist/customeraddresslist',
    })
  },
  getCurrentVersion(){
    //获取小程序版本号
    const accountInfo = wx.getAccountInfoSync();
    console.log(accountInfo)
    if(accountInfo){
     
      var version=accountInfo.miniProgram.version;
      var env=accountInfo.miniProgram.envVersion;
      var envVersion='';
      if(env=='develop')
      {
        envVersion='开发版';

      }else if(env=='trial'){
        envVersion='体验版';
      }else if(env=="release"){
        envVersion='正式版';
      }
      this.setData({
        version:version,
        envVersion:envVersion,
      });
    }

      

     

  },
  selectSingleShop(){
    var that=this;
    wx.request({
      url: app.globalData.selectSingleShop,        
      method: 'GET',
      data: {                
          shop_id: 8888,                       
      },
      header: {
          'content-type': 'application/json'
      },
      success: function (res) {
        console.log(res)
          if(res.data.code == 1000){
               console.log(res.data.data);
               var shopVo=res.data.data;
               that.setData({
                  platform_member_rule_url:shopVo.platform_member_rule_url,
               })
          }                                
      },
      fail:function(err){
        wx.showToast({
          title: '网络异常1',
          icon:'error'
        })
      },
  })
  },
  goTopTop: function (e) { // 一键回到顶部
    this.setData({
      scrollTop: 0,
      })
  },
  setRandomNumber(){
    var r=Math.floor(Math.random()*30 + 1);
    this.setData({
      random_number:r,
    })
  },
  selectDingMsgRecordNotReadTotal(){
    let that = this
    var receiver_code=app.globalData.customerInf.userCode;

    //测试代码
    //receiver_code='300021';
    wx.request({
        url: app.globalData.selectDingMsgRecordNotReadTotal,
        data: {
            receiver_code:receiver_code,
        },
        method:'POST',
        success: res => {

            if (res.data.code == 1000) {

              var ding_not_read_count=res.data.data;

               // var new_chatCustomerList=that.data.chatCustomerList.concat(chatCustomerList);
                that.setData({
                  ding_not_read_count:ding_not_read_count,
                  dingDialog:ding_not_read_count>0?true:false,
                })
                
            } else {
                wx.showModal({
                    title: '提示',
                    content: '网络异常',
                    showCancel: false
                })
                
            }
        },
        fail: res => {
            wx.showModal({
                title: '提示',
                content: '网络异常',
                showCancel: false
            })
            
        }
    })
  },
  closeDingDialog(e){
    this.setData({
      dingDialog:false,
    })
  },
  toDingKe(){
    wx.navigateTo({url: '/pages/mall/pages/dingke/dingke',}); 
  },
  selectCustomerIsStaff(){

    var that=this;
    var customer_id=app.globalData.customerInf.id;
   
    wx.request({
      url: app.globalData.selectCustomerIsStaff1,	
      //url:'http://localhost:8080/evaluation_war/mall/selectMallCsrCustomer_StorepersonnalDataShopId',
      method: 'POST',
      data: {
        customer_id: customer_id,
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {                  
        if(res.data.code!=1000){
          console.log(res.data.data);
          wx.showToast({
            title: '失败'+res.data.msg,
            icon:'error'
          })
        }else{
          if(res.data.code==1000&&res.data.data.is_exists==1){
            //showQRCode
            //是员工
            that.showQRCodeToMallGuide(1,res.data.data.scan_staff_shop_id);

          }else{
            //不是员工
            wx.showToast({
              title: '您还未绑定员工',
              icon:'error'
            })
          }
        }      
      }
    })
  },
  mallOutfitRuleSelectMallOutfitRule(){
      var that=this;
      wx.request({
        url: app.globalData.mallOutfitRuleSelectMallOutfitRule,	
        method: 'POST',
        data: {
        },
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {                  
          if(res.data.code==1000){
            var outfit_rule=res.data.data.outfit_rule;
            that.setData({
              outfit_rule:outfit_rule,
            })
          }   
        }
      })

  },
  showQRCodeToMallGuide(is_staff,scan_staff_shop_id) {         
    this.setData({
        showQR: true,
    }, () => {
        wx.showLoading({
            title: '生成中...',
        })
    })

    let qrt = app.getServerUrl()+'/QRCodeToMallGuide?is_give_vip=0&is_voucher_deduction=1&scan_staff_shop_id='+scan_staff_shop_id+'&scan_staff_id=383';
    		
    require('../../../../utils/qrcode.min.atim.js')({
      width: 200,
      height: 200,
      x: 0,
      y: 0,
      canvasId: 'productQrcode',
      typeNumber: 13,
      text: qrt,
      image: {
          imageResource:'',
          dx: 70,
          dy: 70,
          dWidth: 60,
          dHeight: 60
      },
      callback(e) {                    
          wx.hideLoading({
              success: (res) => {},
          })
      }
  })
  },
  closeQRCode(){
    this.setData({
      showQR:false,
    })
  },
  typeDialogShowChange(e){
    this.setData({
      typeDialogShow:false,
    })
  },
  toOutfit(e){
    wx.navigateTo({
      url: '/pages/mall/pages/outfit/outfit',
    })
  },
  toOutfitSearch(e){
    wx.navigateTo({
      url: '/pages/mall/pages/outfitsearch/outfitsearch',
    })
  },
  toScanDodeDeductionOutfit(e){
    wx.navigateTo({
      url: '/pages/mall/pages/scancodedeductionoutfit/scancodedeductionoutfit',
    })
  },

})