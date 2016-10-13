'use strict';
define(["require", "autolayout-update", "autolayout-global", "autolayout-public"],
    function(require, Update, Global, Public){

	var InitObject = {

		//*************************
		// 初始化应用
		// 参数传入Autolayout对象
		//*************************
		initApp: function() {

			document.onmouseover = function(event) {
				var e = event || window.event || arguments.callee.caller.arguments[0];
				Global.mouseOver = e.target;
			};

			document.addEventListener("mouseup", function() {
				Global.screenMoving = false;
				Global.objectMoving = false;
				Global.isMouseDown = false; // 重置 isMouseDown
			}, true);

			document.onkeydown = function(event) {
				let e = event || window.event || arguments.callee.caller.arguments[0];
				Global.keyDown = e.keyCode;
				if (Public.isChildOfParent(Global.mouseOver, Global.screenArea) && e.keyCode == 32) {
					Global.screenArea.style.cursor = "move";
				};

				if (e.keyCode == 17) {
					// Ctrl
					if (Global.currentSelected||Global.multipleSelected.size) {
						// 当单选都没选的时候不触发多选
						// 当多选列表中有元素时（最少2个）时，也可以触发
						Global.multipleSelect = true;
					};
				};

				if (e.keyCode == 86) {
					// V
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
				let e = event || window.event || arguments.callee.caller.arguments[0];
				Global.keyDown = null;

				// delete selected object by press "Delete" key
				if (e.keyCode == 46) {
					// fixed to "Delete" key instead "BcakSpace"
					Public.removeCurrentSelectedObject(Global.currentSelected);
				}

				if (e.keyCode == 32) {
					// Spacebar
					Global.screenArea.style.cursor = "auto"
				};

				if (e.keyCode == 17) {
					// Ctrl
					Global.multipleSelect = false;
				};
			}
			Global.screenArea.onmousedown = function(event) {
				let e = event || window.event || arguments.callee.caller.arguments[0];
				Global.mouseDownPosition = { x: e.pageX, y: e.pageY };

				Global.screenLastStatus.x = parseFloat(window.getComputedStyle(Global.screenArea).left) || 50;
				Global.screenLastStatus.y = parseFloat(window.getComputedStyle(Global.screenArea).top) || 50;
				if (Global.keyDown == 32) {
					Global.screenMoving = true;
				} else if(Global.currentSelected && e.target === Global.screenArea && !Global.multipleSelect){
					Global.currentSelected.getElementsByTagName('rb')[0].style.display = "none";
					Global.currentSelected.className = (Global.currentSelected.className).replace(' mark', '');
					Global.currentSelected = null;
					document.getElementById('attributesEditor').innerHTML = "";
					document.getElementById('constraintsEditor').innerHTML = "";
				}

			}
			Global.screenArea.onmousemove = function(event) {

				let e = event || window.event || arguments.callee.caller.arguments[0];
				if (Global.screenMoving && Global.keyDown == 32) {
					Global.screenArea.style.left = ((e.pageX - Global.mouseDownPosition.x) / Global.screenScale + Global.screenLastStatus.x) + "px";
					Global.screenArea.style.top = ((e.pageY - Global.mouseDownPosition.y) / Global.screenScale + Global.screenLastStatus.y) + "px";
				}
			}


			Global.scaleSmallBtn.onclick = function() {
				Global.scaleSmallBtn.blur()
				Global.scaleStatusSpan.textContent =
					Global.screenArea.style.zoom = (Global.screenScale = (parseFloat(Global.scaleStatusSpan.textContent) - 0.1).toFixed(1)) + "";
			}

			Global.scaleLargeBtn.onclick = function() {
				Global.scaleLargeBtn.blur()
				Global.scaleStatusSpan.textContent =
					Global.screenArea.style.zoom = (Global.screenScale = (parseFloat(Global.scaleStatusSpan.textContent) + 0.1).toFixed(1)) + "";
			}

			// 点击添加按钮时，弹出module列表
			document.getElementById("moduleList").onclick = function (event) {
				document.getElementById("moduleListCont").style.display = "block";
			}
			// 关闭module列表
			document.getElementById("moduleListCont").onclick = function (event) {

				let e = event || window.event || arguments.callee.caller.arguments[0];
				document.getElementById("moduleListCont").style.display = "none";
				if (e.target.id === "moduleListCont") {

				}
			}
			// Global.symbolList是一个nodelist类型的对象，无法直接forEach
			// 
			;[].forEach.call(Global.symbolList, function(symbol) {
				symbol.onclick = function() {
					let type = symbol.getAttribute("al-type"),
						id = Global.getLastId(),
						newObject = Public.getObjectByTypeId(type, id),
						newLayer = Public.getLayerByTypeId(type, id);

					Global.screenArea.appendChild(newObject);
					Public.handleObject(newObject, id);
					Public.handleLayer(newLayer);

					Global.layerList.insertBefore(newLayer, Global.layerList.firstChild);
				}
			});
		}
	};

	return InitObject;
});
