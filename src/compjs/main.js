// import hotcss from './../lib/hotcss.js';

/*判断手机系统*/
var u = navigator.userAgent;
window.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
window.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端

/*publicPath*/
window.publicPath = "../../../../redev/wechat_for_comp";
window.publicPath1 = "../../../circle";
window.publicPath2 = "../../../..";
window.publicPath3 = "../../../../redev/wechat_service";
window.publicPath4 = "../../../../static";
window.publicPath5 = "../../../../redev/wechat_for_comp/directory/comp";

/*oss*/
window.ossFileHead = "http://ngsimage.oss-cn-hangzhou.aliyuncs.com";
window.region = 'oss-cn-hangzhou';
window.bucket = 'ngsimage';
window.accessKeyId = '';
window.securityToken = '';
window.accessKeySecret = '';