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
		updateSingleConstraintEditor:function (confObj, selectedObj, objectList=null) {
			let config  = confObj["Single"];
			if (!selectedObj || !config) return null;

			var leftObj = null;
			var rightObj = null;
			var topObj = null;
			var bottomObj = null;
			var leftObjStatus = null;
			var rightObjStatus = null;
			var topObjStatus = null;
			var bottomObjStatus = null;
			if(objectList!=null){
				for(var i=0; i<objectList.length; i++){
					if(selectedObj==objectList[i]){continue;}
					var selectedObjStatus = statusOf(selectedObj);
					var currentObjStatus = statusOf(objectList[i]);

					if(isLeftOfAnotherObject(currentObjStatus, selectedObjStatus)){
						if(leftObj!=null){
							if((leftObjStatus.x+leftObjStatus.w) < (currentObjStatus.x+currentObjStatus.w)){
								leftObj = objectList[i];
								leftObjStatus = currentObjStatus;
							}
						} else {
							leftObj = objectList[i];
							leftObjStatus = currentObjStatus;
						}

						continue;
					}
					if(isRightOfAnotherObject(currentObjStatus, selectedObjStatus)){
						if(leftObj!=null){
							if((rightObjStatus.x) > (currentObjStatus.x)){
								rightObj = objectList[i];
								rightObjStatus = currentObjStatus;
							}
						} else {
							rightObj = objectList[i];
							rightObjStatus = currentObjStatus;
						}

						continue;
					}
					if(isTopOfAnotherObject(currentObjStatus, selectedObjStatus)){
						if(topObj!=null){
							if((topObjStatus.y+topObjStatus.h) < (currentObjStatus.y+currentObjStatus.h)){
								topObj = objectList[i];
								topObjStatus = currentObjStatus;
							}
						} else {
							topObj = objectList[i];
							topObjStatus = currentObjStatus;
						}

						continue;
					}
					if(isBottomOfAnotherObject(currentObjStatus, selectedObjStatus)){
						if(bottomObj!=null){
							if((bottomObjStatus.y+bottomObjStatus.h) > (currentObjStatus.y+currentObjStatus.h)){
								bottomObj = objectList[i];
								bottomObjStatus = currentObjStatus;
							}
						} else {
							bottomObj = objectList[i];
							bottomObjStatus = currentObjStatus;
						}

						continue;
					}
				}
			}
			if(leftObj!=null){
				console.log("left:")
				console.log(leftObj);
			}
			if(rightObj!=null){
				console.log("right:")
				console.log(rightObj);
			}
			if(topObj!=null){
				console.log("top:")
				console.log(topObj);
			}
			if(bottomObj!=null){
				console.log("bottom:")
				console.log(bottomObj);
			}

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


	// get the computed size & location info
	function statusOf(obj) {
		var objStatus = {
			x: parseFloat(window.getComputedStyle(obj).left) || 0,
			y: parseFloat(window.getComputedStyle(obj).top) || 0,
			w: parseFloat(window.getComputedStyle(obj).width) || 50,
			h: parseFloat(window.getComputedStyle(obj).height) || 50,
		};

		return objStatus;
	};


	// functions to determine position relation between two objects
	
	function isTopOfAnotherObject(objStatus,anotherObjStatus) {
		if (anotherObjStatus.y < (objStatus.y + objStatus.h)) {return false;}
		if (anotherObjStatus.x > (objStatus.x + objStatus.w)) {return false;}
		if ((anotherObjStatus.x + anotherObjStatus.w) < objStatus.x) {return false;}

		return true;
	};
	function isBottomOfAnotherObject(objStatus,anotherObjStatus) {
		if (objStatus.y < (anotherObjStatus.y + anotherObjStatus.h)) {return false;}
		if (objStatus.x > (anotherObjStatus.x + anotherObjStatus.w)) {return false;}
		if ((objStatus.x + objStatus.w) < anotherObjStatus.x) {return false;}

		return true;
	};
	function isLeftOfAnotherObject(objStatus,anotherObjStatus) {
		if (anotherObjStatus.x < (objStatus.x + objStatus.w)) {return false;}
		if (anotherObjStatus.y > (objStatus.y + objStatus.h)) {return false;}
		if ((anotherObjStatus.y + anotherObjStatus.h) < objStatus.y) {return false;}

		return true;
	};
	function isRightOfAnotherObject(objStatus,anotherObjStatus) {
		if (objStatus.x < (anotherObjStatus.x + anotherObjStatus.w)) {return false;}
		if (objStatus.y > (anotherObjStatus.y + anotherObjStatus.h)) {return false;}
		if ((objStatus.y + objStatus.h) < anotherObjStatus.y) {return false;}

		return true;
	};

    return UpdateObject;
})