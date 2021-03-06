'use strict';

// 入口文件，用于配置requirejs
(function (win) {
    var config = {
        baseUrl: './js',
    };

    require.config(config);

    require(['autolayout'], function(AL){

    	// 引入 autolayout.js, 启动程序
    	AL.Init.initApp(AL);
    });

})(window);