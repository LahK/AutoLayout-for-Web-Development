'use strict';
define(["require"], function(require) {
    var UpdateObject = {
    	updateEditor: function(confObj, selectedObj) {

			if (selectedObj === null) {return null};
			let type = selectedObj.getAttribute("al-type");
			let config  = confObj[type];
			if (!selectedObj || !config || config.length) return null;

			let styleConfig = config["style"];
			let dataConfig = config["data"];
			let editor = document.createElement("div");

			for (let key in styleConfig) {
				let warp = document.createElement("div");
				warp.className = "attribute-warp";
				warp.innerHTML = "<span>" + key + "</span>";

				let input = document.createElement('input');
				input.setAttribute("al-bind",styleConfig[key]);
				// console.log(window.getComputedStyle(selectedObj),styleConfig[key])
				input.value =  window.getComputedStyle(selectedObj)[styleConfig[key]];
				input.onkeyup = function () {
					let e = event || window.event;
					let bind = e.target.getAttribute("al-bind");
					selectedObj.style[bind] = e.target.value;
				}
				warp.appendChild(input);

				editor.appendChild(warp);
			};


			for (let key in dataConfig) {
				let warp = document.createElement("div");
				warp.className = "attribute-warp";
				warp.innerHTML = "<span>" + key + "</span>";

				let input = document.createElement('input');
				input.setAttribute("al-bind",dataConfig[key]);
				input.value =  selectedObj.getAttribute(dataConfig[key]);
				input.onkeyup = function () {
					let e = event || window.event;
					let bind = e.target.getAttribute("al-bind");

					// To Fix:should to check the value is valid or not
					selectedObj.setAttribute(bind, e.target.value);
					// this.updateCheck();

					// To Fix: just for test here,
					// need to build a function to update object
					selectedObj.firstChild.nodeValue = e.target.value;
				}
				warp.appendChild(input);

				editor.appendChild(warp);
			};
			
			let attributesEditor = document.getElementById('attributesEditor');
			if (editor) {
				attributesEditor.innerHTML = "";
				attributesEditor.appendChild(editor);
			}
		},

		updateCheck:function(argument) {
			// body...
		}
    };

    return UpdateObject;
})