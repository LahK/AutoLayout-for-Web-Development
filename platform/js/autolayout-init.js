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
			var Update = AL.Update;
			var Public = AL.Public;
			window.Auto = AL;
			document.onmouseover = function(event) {
				var e = event || window.event || arguments.callee.caller.arguments[0];
				Global.mouseOver = e.target;
			};

			document.addEventListener("mousedown", function(event) {
				if (Global.currentSelected) {
					Global.currentSelected.getElementsByTagName('rb')[0].style.display = "none";

					Global.currentSelected.setAttribute("draggable", "false");
				}
				let e = event || window.event || arguments.callee.caller.arguments[0];

				Global.mouseDownPosition = { x: e.pageX, y: e.pageY };
			}, true);

			document.addEventListener("mouseup", function() {
				Global.screenMoving = false;
				Global.objectMoving = false;
				Global.isMouseDown = false; // 重置 isMouseDown
			}, true);

			document.onkeydown = function(event) {
				let e = event || window.event || arguments.callee.caller.arguments[0];
				Global.keyDown = e.keyCode;
				console.log(e.keyCode);
				if (Public.isChildOfParent(Global.mouseOver, Global.screenArea) && e.keyCode == 32) {
					Global.screenArea.style.cursor = "move";
				};

				if (e.keyCode == 17) {
					
					Global.multipleSelect = true;

				};

				if (e.keyCode == 86) {
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
				if (e.keyCode == 32) {
					Global.screenArea.style.cursor = "auto"
				};

				if (e.keyCode == 17) {
					Global.multipleSelect = false;
				};
			}
			Global.screenArea.onmousedown = function(event) {
				let e = event || window.event || arguments.callee.caller.arguments[0];

				Global.screenLastStatus.x = parseFloat(window.getComputedStyle(Global.screenArea).left) || 50;
				Global.screenLastStatus.y = parseFloat(window.getComputedStyle(Global.screenArea).top) || 50;
				if (Global.keyDown == 32) {
					Global.screenMoving = true;
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

			Global.symbolList.forEach(function(symbol) {
				symbol.onclick = function() {
					let type = symbol.getAttribute("al-type"),
						id = Global.getLastId(),
						newObject = Public.getObjectByTypeId(type, id),
						newLayer = Public.getLayerByTypeId(type, id);

					Global.screenArea.appendChild(newObject);
					handleObject(newObject, id);
					handleLayer(newLayer);

					Global.layerList.insertBefore(newLayer, Global.layerList.firstChild);
				}
			});

			function handleObject(object, id) {
				let resizeButton = document.createElement("rb");
				resizeButton.className = "AL-resize-button";
				resizeButton.setAttribute("draggable", "true");
				resizeButton.id = "resize-" + id;

				let coverMask = document.createElement("cm");
				coverMask.className = "AL-cover-mask";
				coverMask.id = "cover-" + id;
				coverMask.style = object.style;
				resizeButton.ondragstart = function(event) {
					let e = event || window.event || arguments.callee.caller.arguments[0];

					Global.objectMoving = false;
				}
				resizeButton.ondrag = function(event) {
					let e = event || window.event || arguments.callee.caller.arguments[0];
					// e.target.style.cursor = "nwse-resize";
					object.style.width = e.pageX - Global.mouseDownPosition.x + Global.objectLastStatus.w + "px";
					object.style.height = e.pageY - Global.mouseDownPosition.y + Global.objectLastStatus.h + "px";
					object.style.lineHeight = Global.currentSelected.style.height;

					Update.updateEditor(Config.enableStyles, object);
				}

				// resizeButton.ondragend = function(event) {
				//     let e = event || window.event || arguments.callee.caller.arguments[0];

				// }
				object.appendChild(coverMask);
				object.appendChild(resizeButton);

				object.ondrag = function(event) {
					let e = event || window.event || arguments.callee.caller.arguments[0];
					if (Global.objectMoving) {
						if(e.pageX == 0 && e.pageY == 0){return;} // 消除特殊情况（鼠标松开时，有一个偏差坐标 (0，0)）

						object.style.left = ((e.pageX - Global.mouseDownPosition.x) / Global.screenScale + Global.objectLastStatus.x) + "px";
						object.style.top = ((e.pageY - Global.mouseDownPosition.y) / Global.screenScale + Global.objectLastStatus.y) + "px";

						Update.updateEditor(Config.enableStyles, object);
					}
				};
				object.onmousedown = function() {
					if(Global.multipleSelect){
						return;
					}

					Global.currentSelected = object;

					object.setAttribute("draggable", "true"); // 元素被选中时，设置为可拖动

					Global.objectMoving = true;
					object.getElementsByTagName("rb")[0].style.display = "block";

					Global.objectLastStatus = {
						w: parseFloat(window.getComputedStyle(object).width),
						h: parseFloat(window.getComputedStyle(object).height),
						x: parseFloat(window.getComputedStyle(object).left) || 0,
						y: parseFloat(window.getComputedStyle(object).top) || 0
					}

					Update.updateEditor(Config.enableStyles, object);

				};

				Global.objectList.push({ id: object })
			}

			function handleLayer(layer) {
				// rearrange layers z-index by dragging
				layer.ondragstart = function(event) {
					layer.style.opacity = "0.5";
					event.dataTransfer.setData("ondragLayerId",event.target.id)
				};

				layer.ondragend = function(event) {
					layer.style.opacity = "1";
				}

				layer.ondragover = function(event) {
					event.preventDefault();
				}

				layer.ondrop = function (event) {
					event.preventDefault();
					var ondragLayerId = event.dataTransfer.getData("ondragLayerId");
					var ondragLayer = document.getElementById(ondragLayerId);

					Global.layerList.insertBefore(ondragLayer, event.target);

					for (var i = 0; i < Global.layerList.childElementCount; i++) {
						var id = Global.layerList.children[i].getAttribute("al-id");
						var obj = document.getElementById("object-"+id);
						obj.style.zIndex = Global.objectList.length - 1 - i
					}
				}
			}

		}
	};

	return InitObject;
});
