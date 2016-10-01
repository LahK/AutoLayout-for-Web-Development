'use strict';
define(["require"], function(require) {
    var UpdateObject = {
    	updateEditor:function () {
    		
    	},
    	updateStyleEditor: function(confObj, selectedObj) {

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
		updateSingleConstraintEditor:function (confObj, selectedObj) {
			let config  = confObj["Single"];
			if (!selectedObj || !config) return null;

			let editor = document.createElement("div");

			for(let type in config){
				let childNode = config[type];
				let fieldset = document.createElement('fieldset')
				fieldset.innerHTML = "<legend>"+ type +"</legend>";
				for(let key in childNode){
					let warp = document.createElement("div");
					warp.className = "constraint-warp";
					warp.innerHTML = "<input type='checkbox' value='"+ key +"' /><span>" + key + "</span>";

					let input = document.createElement('input');
					warp.appendChild(input);
					fieldset.appendChild(warp);
				}

				editor.appendChild(fieldset);
			}

			let constraintsEditor = document.getElementById('constraintsEditor');
			if (editor) {
				constraintsEditor.innerHTML = "";
				constraintsEditor.appendChild(editor);
			}
			
		},

		updateMultiConstraintEditor:function (confObj, multipleFirst, multipleSelected) {

			let config  = confObj["Multiple"];

			if (!multipleFirst || !multipleSelected  || !multipleSelected.size || !config) return null;

			let editor = document.createElement("div");
			for(let type in config){
				let childNode = config[type];
				let fieldset = document.createElement('fieldset')
				fieldset.innerHTML = "<legend>"+ type +"</legend>";
				for(let key in childNode){
					let warp = document.createElement("div");
					warp.className = "constraint-warp";
					warp.innerHTML = "<input type='checkbox' value='"+ key +"' /><span>" + key + "</span>";

					let input = document.createElement('input');
					warp.appendChild(input);
					fieldset.appendChild(warp);
				}

				editor.appendChild(fieldset);
			}

			let constraintsEditor = document.getElementById('constraintsEditor');
			if (editor) {
				constraintsEditor.innerHTML = "";
				constraintsEditor.appendChild(editor);
			}
		},

		updateCheck:function(argument) {
			// body...
		}
    };

    return UpdateObject;
})