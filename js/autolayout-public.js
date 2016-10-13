'use strict';
define(["require", "autolayout-update", "autolayout-global"], function(require, Update, Global) {

	var PublicObject = {
		handleObject: function(object, id) {
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
				Update.updateStyleEditor();
			}

			resizeButton.ondragend = function(event) {
			    let e = event || window.event || arguments.callee.caller.arguments[0];
			    Update.updateSingleConstraintEditor();
			}
			object.appendChild(coverMask);
			object.appendChild(resizeButton);

			

			// Global.objectList.add({ id: object })
		},
		handleLayer: function(layer) {
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
		},
		getObjectByTypeId: function(type, id) {
			var newObject = null;
			let defaultPath = 'objects/basic/' + type;

			require([defaultPath],function(object) {
				// handle the new object
				newObject = object;
				newObject.setAttribute("al-name", "object");
				newObject.setAttribute("al-type", type);
				newObject.id = "object-" + id;
				newObject.setAttribute("al-id", id);
				
				return newObject;
			},function (err) {
				let failedId = err.requireModules && err.requireModules[0];
				if (failedId === defaultPath) {
					requirejs.undef(failedId);

				}
			});
		},

		getLayerByTypeId: function (type, id) {
			var newLayer = document.createElement("div");
			newLayer.className = "layer-item";
			// newLayer.style.top = _ModuleCount * 50 + "px";
			newLayer.id = "layer-" + id;
			newLayer.setAttribute("al-id", id);
			newLayer.setAttribute("al-name", "layer");
			newLayer.setAttribute("draggable", "true");
			newLayer.innerText = type + "-" + id;

			return newLayer;
		},
		removeObject: function (obj) {
			obj.parentNode.removeChild(obj);
		},
		removeCurrentSelectedObject: function (obj) {
			let layer = document.getElementById("layer-"+obj.getAttribute("al-id"));
			layer.parentNode.removeChild(layer);
			obj.parentNode.removeChild(obj);
			// 删除当前元素的同时，需要删去关联的编辑器
			document.getElementById('attributesEditor').innerHTML = "";
		},

		getLayerByObject: function (obj) {
			var id = obj.getAttribute("al-id");
			var layer = document.getElementById('layer-' + id);

			if (layer) return layer;

			return null;
		},

		isChildOfParent: function (obj, parent) {


			while (obj && obj.nodeName.toLowerCase() != "body") {

				if (obj == parent) return true;

				obj = obj.parentNode;
			}
			return false;
		},

		isInScreen: function (obj, screenSize) {
			var objStatus = {
				x: parseFloat(window.getComputedStyle(obj).left) || 0,
				y: parseFloat(window.getComputedStyle(obj).top) || 0,
				w: parseFloat(window.getComputedStyle(obj).width) || 50,
				h: parseFloat(window.getComputedStyle(obj).height) || 50,
			};

			if (objStatus.x + objStatus.w <= 0 || objStatus.y + objStatus.h <= 0 || objStatus.x > screenSize.w || objStatus.y > screenSize.h) {
				return false;
			} else {
				return true;
			}
		},

		// get the computed size & location info
		statusOf: function (obj) {
			var objStatus = {
				x: parseFloat(window.getComputedStyle(obj).left) || 0,
				y: parseFloat(window.getComputedStyle(obj).top) || 0,
				w: parseFloat(window.getComputedStyle(obj).width) || 50,
				h: parseFloat(window.getComputedStyle(obj).height) || 50,
			};

			return objStatus;
		},


		// functions to determine position relation between two objects
		
		isTopOfAnotherObject: function (objStatus,anotherObjStatus) {
			if (anotherObjStatus.y < (objStatus.y + objStatus.h)) {return false;}
			if (anotherObjStatus.x > (objStatus.x + objStatus.w)) {return false;}
			if ((anotherObjStatus.x + anotherObjStatus.w) < objStatus.x) {return false;}

			return true;
		},
		isBottomOfAnotherObject: function (objStatus,anotherObjStatus) {
			if (objStatus.y < (anotherObjStatus.y + anotherObjStatus.h)) {return false;}
			if (objStatus.x > (anotherObjStatus.x + anotherObjStatus.w)) {return false;}
			if ((objStatus.x + objStatus.w) < anotherObjStatus.x) {return false;}

			return true;
		},
		isLeftOfAnotherObject: function (objStatus,anotherObjStatus) {
			if (anotherObjStatus.x < (objStatus.x + objStatus.w)) {return false;}
			if (anotherObjStatus.y > (objStatus.y + objStatus.h)) {return false;}
			if ((anotherObjStatus.y + anotherObjStatus.h) < objStatus.y) {return false;}

			return true;
		},
		isRightOfAnotherObject: function (objStatus,anotherObjStatus) {
			if (objStatus.x < (anotherObjStatus.x + anotherObjStatus.w)) {return false;}
			if (objStatus.y > (anotherObjStatus.y + anotherObjStatus.h)) {return false;}
			if ((objStatus.y + objStatus.h) < anotherObjStatus.y) {return false;}

			return true;
		},
	};

	return PublicObject;
});
