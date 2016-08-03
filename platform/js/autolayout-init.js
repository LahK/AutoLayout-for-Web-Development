'use strict';
define(function() {

    var InitObject = {

        //*************************
        // 初始化应用
        // 参数传入Autolayout对象
        //*************************
        initApp: function(AL) {


            var Global = AL.Global;
            var Init = AL.Init;
            var Config = AL.Config;
            var Updata = AL.Update;
            var Public = AL.Public;


            // 全局绑定，返回鼠标当前所悬浮的元素
            document.onmouseover = function(event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                Global.mouseOver = e.target;
            };

            // 全局绑定，鼠标移动
            document.onmousemove = function(event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];


                if (Global.keyDown == 32 && Global.screenMoving) {
                    // 选中screeArea同时按空格，可移动screeArea

                    Global.screenArea.style.left = ((e.pageX - Global.mouseDownPosition.x) / Global.screenScale + Global.screenLastPosition.x) + "px";
                    Global.screenArea.style.top = ((e.pageY - Global.mouseDownPosition.y) / Global.screenScale + Global.screenLastPosition.y) + "px";
                    // updateEditor();
                } else if (Global.objectMoving) {
                    // 选中object，可移动object

                    Global.currentSelected.style.left = ((e.pageX - Global.mouseDownPosition.x) / Global.screenScale + Global.objectLastPosition.x) + "px";
                    Global.currentSelected.style.top = ((e.pageY - Global.mouseDownPosition.y) / Global.screenScale + Global.objectLastPosition.y) + "px";
                    Global.attributesEditor.innerHTML = "";
                    Global.attributesEditor.appendChild(Public.getEditor(Config.enableStyles, Global.currentSelected));
                    // updateEditor();
                } else if (Global.layerMoving) {
                    // 选中layer，可移动layer

                    // _LayerSelected.style.position = "absolute";
                    // _LayerSelected.style.top  = (e.pageY - _MouseDownPosition.y) + "px";
                    // _LayerSelected.style.zIndex = "999";
                }
            };

            // 全局绑定 鼠标按下事件
            document.onmousedown = function(event) {

                var e = event || window.event || arguments.callee.caller.arguments[0];

                // 保存鼠标按下位置和选中元素的
                Global.mouseDownPosition = { x: e.pageX, y: e.pageY };
                if (Global.currentSelected) {
                    Global.objectLastSize = {
                        w: parseFloat(window.getComputedStyle(Global.currentSelected).width),
                        h: parseFloat(window.getComputedStyle(Global.currentSelected).height)
                    }
                }


                if (Public.isChildOfParent(e.target, Global.screenArea) && Global.keyDown == 32) {
                    Global.screenMoving = true;
                    Global.screenLastPosition.x = parseFloat(window.getComputedStyle(Global.screenArea).left) || 50;
                    Global.screenLastPosition.y = parseFloat(window.getComputedStyle(Global.screenArea).top) || 50;
                    // Global.currentSelected = Global.screenArea;


                    ////////////////////    TODO   ///////////////////////  
                    // alInit.showEditor();
                    // alInit.showSelected();

                } else if (e.target == Global.scaleSmallBtn) {
                    // 点击缩小屏幕按钮

                    Global.scaleSmallBtn.blur()
                    Global.scaleStatusSpan.textContent =
                        Global.screenArea.style.zoom = (Global.screenScale = (parseFloat(Global.scaleStatusSpan.textContent) - 0.1).toFixed(1)) + "";

                } else if (e.target == Global.scaleLargeBtn) {
                    // 点击放大屏幕按钮

                    Global.scaleLargeBtn.blur()
                    Global.scaleStatusSpan.textContent =
                        Global.screenArea.style.zoom = (Global.screenScale = (parseFloat(Global.scaleStatusSpan.textContent) + 0.1).toFixed(1)) + "";

                } else if (e.target == Global.canvasArea || e.target.parentNode == Global.canvasArea) {
                    // 默认选中screenArea

                    // Global.currentSelected = Global.screenArea;

                    // showEditor();
                    // showSelected();
                    // showEditor("Screen");
                } else if (e.target.getAttribute("al-name") == "object-symbol") {
                    var type = e.target.getAttribute("al-type");
                    // var currentId = getCurrentId();
                    var newObject = Public.getObjectByTypeId(type, Global.lastId);
                    var newLayer = Public.getLayerByTypeId(type, Global.lastId);

                    appendResizeButton(newObject, Global.lastId);
                    Global.lastId += 1;

                    Global.screenArea.appendChild(newObject);
                    Global.objectCount += 1;
                    Global.layerList.insertBefore(newLayer, Global.layerList.firstChild);

                    if (Global.currentSelected) {
                        Global.currentSelected.getElementsByTagName('rb')[0].style.display = "none";
                    };

                    newObject.getElementsByTagName('rb')[0].style.display = "block";

                    Global.currentSelected = newObject;

                    // showEditor();
                    // showSelected();

                } else if (e.target.getAttribute("al-name") == "object") {
                    Global.currentSelected.getElementsByTagName('rb')[0].style.display = "none";
                    e.target.getElementsByTagName('rb')[0].style.display = "block";
                    Global.currentSelected = e.target;
                    Global.objectMoving = true;
                    Global.objectLastPosition.x = parseFloat(window.getComputedStyle(Global.currentSelected).left) || 0;
                    Global.objectLastPosition.y = parseFloat(window.getComputedStyle(Global.currentSelected).top) || 0;



                    // showEditor();
                    // showSelected();
                } else if (e.target.getAttribute("al-name") == "layer") {
                    // var idStr = e.target.getAttribute("al-id");
                    // _ModuleSelected = document.getElementById("M-" + idStr);
                    // _LayerSelected = document.getElementById("L-" + idStr);
                    // _LayerMoving = true;
                    // showEditor();
                    // showSelected();
                }

                if (e.target.getAttribute("al-type")) {
                    Global.attributesEditor.innerHTML = "";
                    Global.attributesEditor.appendChild(Public.getEditor(Config.enableStyles, Global.currentSelected));
                };


                // updateLayer();
            }

            document.onmouseup = function(event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];

                if (Global.objectMoving && !Public.isInScreen(Global.currentSelected, Global.screenSize)) {
                    var choice = confirm("要删除该元素吗?");
                    if (choice) {

                        Public.removeObject(Global.currentSelected);
                        Public.removeObject(Public.getLayerByObject(Global.currentSelected));

                        Global.currentSelected = null;
                        Global.objectCount -= 1;
                    } else {
                        Global.currentSelected.style.left = Global.objectLastPosition.x + "px";
                        Global.currentSelected.style.top = Global.objectLastPosition.y + "px";
                    }
                }
                Global.screenMoving = false;
                Global.objectMoving = false;
                // _LayerMoving = false;
            }
            document.onkeydown = function(event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                Global.keyDown = e.keyCode;

                if (Public.isChildOfParent(Global.mouseOver, Global.screenArea) && e.keyCode == 32) {
                    Global.screenArea.style.cursor = "move";
                } else if (e.keyCode == 86) {
                    if (Global.trimScreen) {
                        Global.screenArea.style.overflow = "hidden";
                        Global.trimScreen = false
                    } else {
                        Global.screenArea.style.overflow = ""
                        Global.trimScreen = true;
                    }
                }
            }

            document.onkeyup = function(event) {
                var e = event || window.event || arguments.callee.caller.arguments[0];
                Global.keyDown = null;
                if (e.keyCode == 32) {
                    Global.screenArea.style.cursor = "auto"
                }
            }

            function appendResizeButton(obj, id) {
                var resizeButton = document.createElement("rb");
                resizeButton.className = "AL-resize-button";
                resizeButton.setAttribute("draggable", "true");
                resizeButton.id = "resize-" + id;
                resizeButton.ondragstart = function(event) {
                    var e = event || window.event || arguments.callee.caller.arguments[0];
                    
                }
                resizeButton.ondrag = function(event) {
                    var e = event || window.event || arguments.callee.caller.arguments[0];

                    Global.currentSelected.style.width = e.pageX - Global.mouseDownPosition.x + Global.objectLastSize.w + "px";
                    Global.currentSelected.style.height = e.pageY - Global.mouseDownPosition.y + Global.objectLastSize.h + "px";
                    // console.log(e.pageX)
                }

                resizeButton.ondragend = function(event) {
                    var e = event || window.event || arguments.callee.caller.arguments[0];

                }
                obj.appendChild(resizeButton);
            }

        },


    };


    return InitObject;
});
