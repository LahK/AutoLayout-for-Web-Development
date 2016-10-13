'use strict';
define(["require", "autolayout-init", "autolayout-update", "autolayout-global", "autolayout-config","autolayout-public"],
    function(require, alInit, alUpdate, alGlobal, alConfig, alPublic) {

        var AutoLayout = {

            // 初始化功能
            "Init": alInit,

            // 更新功能
            "Update": alUpdate,

            // 全局变量
            "Global": alGlobal,

            // 功能配置
            "Config": alConfig,

            // 公用方法
            "Public": alPublic,
        };
        window.AL = AutoLayout;
        return AutoLayout;
    }
    
);
