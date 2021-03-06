'use strict';
define(function() {

	var PublicObject = {
		
		getObjectByTypeId: function(type, id) {

			var newObject = null;
			// var newObjectBR = document.createElement("div");
			switch (type) {
				case "Label":
					newObject = getLabel(id);
					break;
				case "Button":
					newObject = getButton(id);
					break;
				case "Image":
					newObject = getImage(id);
					break;
				case "View":
					newObject = getView(id);
					break;
				default:
					return null;
			}
			// newObject.setAttribute("draggable", "true");
			newObject.setAttribute("al-name", "object");
			newObject.setAttribute("al-type", type);
			newObject.id = "object-" + id;
			newObject.setAttribute("al-id", id);

			return newObject;

			function getLabel(id) {

				var tempObject = document.createElement("div");

				tempObject.className = "AL-object AL-lable";
				tempObject.setAttribute("al-text", "Label");
				// tempObject.setAttribute("al-label-type", "multiple");
				tempObject.innerText = "Label";
				// tempObject.appendChild(newObjectBR);

				// _view = tempObject;
				// _viewStyle = window.getComputedStyle(_view);

				// _viewBR = newObjectBR;

				return tempObject;
			}

			function getButton(id) {
				var tempObject = document.createElement("div");
				tempObject.className = "AL-object AL-button";
				tempObject.setAttribute("al-text", "Button");
				tempObject.innerText = "Button";

				// var contentObject = document.createElement("button");
				// // contentObject.disabled = true;

				// contentObject.innerText = "Button";
				// contentObject.type = "button"

				// tempObject.appendChild(contentObject);


				return tempObject;
			}

			function getImage(id) {
				var tempObject = document.createElement("div");

				tempObject.className = "AL-object AL-image";

				// tempObject.appendChild(getResizeButtonById(id));

				// tempObject.appendChild(newObjectBR);

				// _view = tempObject;
				// _viewStyle = window.getComputedStyle(_view);

				// _viewBR = newObjectBR;

				return tempObject;
			}

			function getView(id) {
				var tempObject = document.createElement("div");

				tempObject.className = "AL-object AL-view";

				// tempObject.appendChild(newObjectBR);

				// _view = tempObject;
				// _viewStyle = window.getComputedStyle(_view);

				// _viewBR = newObjectBR;

				return tempObject;
			}
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
