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
				var tempObject = document.createElement("button");

				tempObject.className = "AL-object AL-button";
				tempObject.setAttribute("al-text", "Button");
				tempObject.setAttribute("type", "button")
					// tempObject.setAttribute("al-label-type", "multiple");
				tempObject.innerText = "Button";
				// tempObject.appendChild(newObjectBR);

				// _view = tempObject;
				// _viewStyle = window.getComputedStyle(_view);

				// _viewBR = newObjectBR;

				return tempObject;
			}

			function getImage(id) {
				var tempObject = document.createElement("div");

				tempObject.className = "AL-object AL-image";

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
			newLayer.innerText = type + "-" + id;
			return newLayer;
		},
		removeObject: function (obj) {
			obj.parentNode.removeChild(obj);
		},

		getLayerByObject: function (obj) {
			var id = obj.getAttribute("al-id");
			var layer = document.getElementById('layer-' + id);

			if (layer) return layer;

			return null;
		},

		getEditor: function(confObj, selectedObj) {
			var type = selectedObj.getAttribute("al-type");
			var config  = confObj[type];
			if (!selectedObj || !config || config.length) return null;

			var styleConfig = config["style"];
			var dataConfig = config["data"];
			var editor = document.createElement("div");

			for (var key in styleConfig) {
				var warp = document.createElement("div");
				warp.className = "attribute-warp";
				warp.innerHTML = "<span>" + key + "</span>";

				var input = document.createElement('input');
				input.setAttribute("al-bind",styleConfig[key]);
				// console.log(window.getComputedStyle(selectedObj),styleConfig[key])
				input.value =  window.getComputedStyle(selectedObj)[styleConfig[key]];
				input.onkeyup = function () {
					var e = event || window.event;
					var bind = e.target.getAttribute("al-bind");
					selectedObj.style[bind] = e.target.value;
				}
				warp.appendChild(input);

				editor.appendChild(warp);
			};


			for (var key in dataConfig) {
				var warp = document.createElement("div");
				warp.className = "attribute-warp";
				warp.innerHTML = "<span>" + key + "</span>";

				var input = document.createElement('input');
				input.value =  selectedObj.getAttribute(dataConfig[key]);
				input.addEventListener("onchange",function () {
					var e = event || window.event;
					selectedObj.setAttribute(dataConfig[key], e.target.value);
				});
				warp.appendChild(input);

				editor.appendChild(warp);
			};
			
			return editor;
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
		}
	};


	return PublicObject;
});
