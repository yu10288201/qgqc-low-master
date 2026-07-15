//分解 0-快捷备注  1-输入备注
function splitRemarkStr(remarks,type){
    let str = '';
    if(remarks != null && remarks != "" && remarks != undefined){
        if(remarks && remarks.indexOf(";") != -1){
            str = remarks.split(";")[type];
        }else{
            if(type == 1) {
                str = remarks;
            }
        }
    }
    return str;
}

//合并字符串
function joinRemarkStr(quickRemark,remarkStr){
    if(remarkStr == null || remarkStr == undefined || remarkStr == "undefined"){
        remarkStr = "";
    }
    if(quickRemark != undefined && quickRemark != "" && quickRemark != null) {
        remarkStr = quickRemark + ";" + remarkStr;
    }
    return remarkStr;
}

//导出方法或常量
module.exports = {
    splitRemarkStr : splitRemarkStr,
    joinRemarkStr : joinRemarkStr,
}