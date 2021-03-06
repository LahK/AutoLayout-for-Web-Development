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
					handleObject(newObject, id);
					handleLayer(newLayer);

					Global.layerList.insertBefore(newLayer, Global.layerList.firstChild);
				}
			});

			function handleObject(object, id) {
				object.style.zIndex = Global.layerList.childElementCount

				let resizeButton = document.createElement("rb");
				resizeButton.className = "AL-resize-button";
				resizeButton.setAttribute("draggable", "true");
				resizeButton.id = "resize-" + id;

				let coverMask = document.createElement("cm");
				coverMask.className = "AL-cover-mask";
				coverMask.id = "cover-" + id;

				// WHY?
				// coverMask.style = object.style;

				resizeButton.ondragstart = function(event) {

					let e = event || window.event || arguments.callee.caller.arguments[0];
					object.setAttribute("draggable", "false");
					Global.objectMoving = false;
				}
				resizeButton.ondrag = function(event) {
					let e = event || window.event || arguments.callee.caller.arguments[0];
					// e.target.style.cursor = "nwse-resize";
					object.style.width = e.pageX - Global.mouseDownPosition.x + Global.objectLastStatus.w + "px";
					object.style.height = e.pageY - Global.mouseDownPosition.y + Global.objectLastStatus.h + "px";
					object.style.lineHeight = Global.currentSelected.style.height;


					// updateStyleEditor作用是新产生一个编辑器，
					// 并和传入的元素绑定，并不是和 currentSelected 绑定，
					// 因此，当手动清空currentSelected的时候，需要删除生成的editor
					Update.updateStyleEditor(Config.enableStyles, object);
				}

				resizeButton.ondragend = function(event) {
				    let e = event || window.event || arguments.callee.caller.arguments[0];
				    Update.updateSingleConstraintEditor(Config.enableConstraints, object, Global.screenArea.children);
				}
				object.appendChild(coverMask);
				object.appendChild(resizeButton);

				object.ondrag = function(event) {
					let e = event || window.event || arguments.callee.caller.arguments[0];
					
					if (Global.objectMoving) {
						if(e.pageX == 0 && e.pageY == 0){return;} // 消除特殊情况（鼠标松开时，有一个偏差坐标 (0，0)）

						let newX = (e.pageX - Global.mouseDownPosition.x) / Global.screenScale + Global.objectLastStatus.x,
							newY = (e.pageY - Global.mouseDownPosition.y) / Global.screenScale + Global.objectLastStatus.y;

						

						// Prevent objects from being dragged out of screen area
						let minX = - Global.objectLastStatus.w,
							minY = - Global.objectLastStatus.h;

						let maxX = Global.screenLastStatus.w,
							maxY = Global.screenLastStatus.h;

						newX = newX < minX ? minX : (newX > maxX ? maxX : newX);
						newY = newY < minY ? minY : (newY > maxY ? maxY : newY);

						object.style.left = newX+"px";
						object.style.top = newY+"px";
						Update.updateStyleEditor(Config.enableStyles, object);
					}
				};
				object.ondragend = function(event){
					// 重新获取附近元素
					Update.updateSingleConstraintEditor(Config.enableConstraints, object, Global.screenArea.children);
				}
				object.onmousedown = function() {

					// 在多选模式下，第一个被选中的元素会赋值给currentSelected，
					// 如果继续选第二个元素，则将第一个选择的元素(currentSelected)和之后的元素一并
					// 存储到multipleSelected中，
					// 如果不继续选，则第一个元素只存在currentSelected中，多选模式结束
					

					if(Global.multipleSelect && Global.currentSelected != object){
						// 能触发多选，说明完成了单选
						// 但是此状态下，还点击单选选中的元素，则无效（因为全程只有一个元素，没有多选）
						if (Global.currentSelected) {
							// 单选保存有元素，说明现在触发的是多选的第二个元素，
							// 则取出单选元素和当前元素，保存到多选元组中
							Global.currentSelected.className = (Global.currentSelected.className).replace('mark', 'first-mark');
							Global.multipleSelected.add(Global.currentSelected);

							object.className += ' mark';
							Global.multipleSelected.add(object);
							
							// multipleFirst记录下多选中第一个选中的元素
							Global.multipleFirst = Global.currentSelected;
							// 清空单选，清除绑定的编辑器
							Global.currentSelected.getElementsByTagName("rb")[0].style.display = "none";
							Global.currentSelected = null;

							document.getElementById('attributesEditor').innerHTML = "";
							document.getElementById('constraintsEditor').innerHTML = "";

						}else{
							// 多选模式开启，并且单选没有元素，说明正在多选第三个及之后的元素
							// 直接添加进元组即可
							if (object.className.indexOf(' mark') > -1) {

								object.className = (object.className).replace(' mark', '');
								Global.multipleSelected.delete(object);
							}else{

								object.className += ' mark';
								Global.multipleSelected.add(object);
							}
						}

						
						Update.updateMultiConstraintEditor(Config.enableConstraints, Global.multipleFirst, Global.multipleSelected);
					}else{
						// 有元素在单选模式下被点击
						// 或者多选模式下点击的第二个元素和第一个元素相同
						// 元组不为空说明刚刚退出多选，但多个元素还被选中，因此需要清空元组

						if(Global.multipleSelected.size){
							
							// forEach的回调会异步执行，因此需要在回调函数中一个一个删除元素，
							// 否则由于异步执行会导致元素删除了还没更新完成界面。
							Global.multipleSelected.forEach(function (elem) {


								elem.className = elem.className.replace(' mark', '').replace(' first-mark', '');
								// 更新一个删除一个
								Global.multipleSelected.delete(elem);
							});
							// 不可以在这里直接执行 Global.multipleSelected.clear()
							// 因为 forEach是异步操作，上面的display = "none" 还没有执行完，就直接clear了
							// 会导致异步错误

							// 清空
							Global.multipleFirst = null;
						}

						Global.objectMoving = true;
						object.setAttribute("draggable", "true");
						Global.objectLastStatus = {
							w: parseFloat(window.getComputedStyle(object).width),
							h: parseFloat(window.getComputedStyle(object).height),
							x: parseFloat(window.getComputedStyle(object).left) || 0,
							y: parseFloat(window.getComputedStyle(object).top) || 0
						}

						if (Global.currentSelected !== object) {


							if (Global.currentSelected) {
								Global.currentSelected.className = (Global.currentSelected.className).replace(' mark', '');
								Global.currentSelected.getElementsByTagName("rb")[0].style.display = "none";
							}

							object.querySelector("rb").style.display = "block";
							object.className += ' mark';
							Global.currentSelected = object;

							Update.updateStyleEditor(Config.enableStyles, object, true);

							Update.updateSingleConstraintEditor(Config.enableConstraints, object, Global.screenArea.children, true);
						};
					}
					// console.log(Global.multipleSelect);
					// console.log(Global.multipleSelected);
					// console.log(Global.currentSelected);
				};

				Global.objectList.add({ id: object })
				
			}

			function handleLayer(layer) {
				// select object when click on related layer
				layer.onclick = function(event) {
					var id = event.target.getAttribute("al-id");
					var obj = document.getElementById("object-"+id);
					obj.onmousedown();
				}

				// rearrange layers z-index by dragging
				layer.ondragstart = function(event) {
					layer.style.opacity = "0.5";
					layer.style.width = "97%";
					layer.style.borderLeft = "2px solid #777";
					layer.style.borderRight = "2px solid #777";
					layer.style.borderBottom = "2px solid #777";
					event.dataTransfer.setData("ondragLayerId",event.target.id)
				};

				layer.ondragend = function(event) {
					layer.style.opacity = "1";
					layer.style.width = "100%";
					layer.style.borderLeft = "";
					layer.style.borderRight = "";
					layer.style.borderBottom = "";
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
						obj.style.zIndex = Global.screenArea.childElementCount - 1 - i
					}
				}
			}

		}
	};

	return InitObject;
});
