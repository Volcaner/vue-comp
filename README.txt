/*编译*/

/**线下234**/
...............webpack.config.js
publicPath: '/yich/redev/wechat_for_comp/dist/',

...............main.js
window.publicPath = "/yich/redev/wechat_for_comp";
window.publicPath1 = "/yich/redev/circle";
window.publicPath2 = "/yich";
window.publicPath3 = "/yich/redev/wechat_service";
window.publicPath4 = "/yich/static";
window.appId = 'wx430f51525b70e9c4';  // 线下234

...............index.html
<link href="/yich/redev/wechat_for_comp/lib/font/iconfont.css" rel="stylesheet">
<script type="text/javascript" src="/yich/redev/wechat_for_comp/lib/hotcss.js"></script>


/**线上**/
...............webpack.config.js
publicPath: '/redev/wechat_for_comp/dist',

...............main.js
window.publicPath = "/redev/wechat_for_comp";
window.publicPath1 = "/redev/circle";
window.publicPath2 = "";
window.publicPath3 = "/redev/wechat_service";
window.publicPath4 = "/static";
window.appId = 'wx347f32ce0465e678';  // 线上

...............webpack.config.js
<link href="/redev/wechat_for_comp/lib/font/iconfont.css" rel="stylesheet">
<script type="text/javascript" src="/redev/wechat_for_comp/lib/hotcss.js"></script>