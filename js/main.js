'use strict';

// 入口文件，用于配置requirejs
(function(win) {
    var config = {
        baseUrl: './js',
        paths: {
            objects: './objects'
        }
    };

    require.config(config);

    require(['autolayout-init'], function(Init) {

        // 引入 autolayout.js, 启动程序
        Init.initApp();
    });

})(window);
