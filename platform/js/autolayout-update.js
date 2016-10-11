'use strict';
define(["require"], function(require) {
    var UpdateObject = {
    	updateEditor:function () {
    		
    	},
    	updateStyleEditor: function(confObj, selectedObj, init=false) {
    		let attributesEditor = document.getElementById('attributesEditor');
    		let type = selectedObj.getAttribute("al-type");
    		let config  = confObj[type];

    		if (init == true) {
    			let editor = document.createElement("div");
    			for(let index in config){
    				for(let key in config[index]){

    					let warp = document.createElement("div");
						warp.className = "attribute-warp";
						warp.innerHTML = "<span>" + key + "</span>";

						let input = document.createElement('input');
						input.setAttribute("al-bind-type",index);
						input.setAttribute("al-bind",config[index][key]);
						input.onkeyup = function  () {
							let e = event || window.event;
							let bind = e.target.getAttribute("al-bind");
							let bindType = e.target.getAttribute('al-bind-type');

							if (bindType === 'Style') {
								selectedObj.style[bind] = e.target.value;
							}else if (bindType === 'Data') {
								// To Fix:should to check the value is valid or not
								selectedObj.setAttribute(bind, e.target.value);
								// this.updateCheck();

								// To Fix: just for test here,
								// need to build a function to update object
								selectedObj.firstChild.nodeValue = e.target.value;
							};
						}
    					warp.appendChild(input);
						editor.appendChild(warp);
    				}
    			}
    			
				if (editor) {
					attributesEditor.innerHTML = "";
					attributesEditor.appendChild(editor);
				}
    		}

			let inputList = attributesEditor.querySelectorAll('input');

			for(let i of inputList){
				let bindType = i.getAttribute('al-bind-type');
				let bind = i.getAttribute('al-bind');
				if (bindType === 'Style') {
					i.value =  window.getComputedStyle(selectedObj)[bind];
				}else if (bindType === 'Data') {
					i.value =  selectedObj.getAttribute(bind);
				};
    		}
		},
		updateSingleConstraintEditor:function (confObj, selectedObj, objectList, init=false) {

			let leftObj = null,
				rightObj = null,
				topObj = null,
				bottomObj = null,
				leftObjStatus = null,
				rightObjStatus = null,
				topObjStatus = null,
				bottomObjStatus = null;

			if(objectList!=null){
				for(let i=0; i<objectList.length; i++){
					if(selectedObj==objectList[i]){continue;}
					let selectedObjStatus = statusOf(selectedObj);
					let currentObjStatus = statusOf(objectList[i]);

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


			let config  = confObj["Single"];
			let constraintsEditor = document.getElementById('constraintsEditor');
			if (init) {
				let editor = document.createElement("div");
				for(let type in config){

					let fieldset = document.createElement('fieldset')

					fieldset.innerHTML = "<legend>"+ type +"</legend>";

					for(let key in config[type]){
						let warp = document.createElement("div");
						warp.className = "constraint-warp";

						let checkbox = document.createElement('input');
						checkbox.setAttribute('type', 'checkbox');
						checkbox.setAttribute('al-bind', config[type][key]);
						checkbox.setAttribute('al-bind-type', type)
						checkbox.className = 'al-enable';
						checkbox.onkeyup = function () {
							let e = event || window.event;

							let bind = e.target.getAttribute('al-bind'),
								bindType = e.target.getAttribute('al-bind-type');
							let input = e.target.parentNode.querySelector('input.al-value');

							// 对json进行处理，选中时添加json数据，否则删除json数据
							// e.target.checked ? (json.thisObject.bindType.bind = input.value) 
							// 	: (delete json.thisObject.bindType.bind);
						}
						
						let input = document.createElement('input');
						input.setAttribute('al-bind', config[type][key]);
						input.className = 'al-value';
						input.onkeyup = function () {
							let e = event || window.event;

							let bind = e.target.getAttribute('al-bind'),
								bindType = e.target.getAttribute('al-bind-type');

							let checkbox = e.target.parentNode.querySelector('input.al-enable');

							// // 当约束值手动修改时，自动勾选，并更新json数据。
							// checkbox.checked = true;
							// json.thisObject.bindType.bind = input.value;
							
						}

						// 当json中存在该值时，直接更新。
						// if (json.thisObject.bindType.bind) {
						// 
						// 	checkbox.checked = true;
						// 	input.value = json.thisObject[type][config[type][key]];
						// }
						warp.appendChild(checkbox);
						warp.innerHTML += "<span>" + key + "</span>";
						warp.appendChild(input);
						fieldset.appendChild(warp);
					}

					editor.appendChild(fieldset);
				}

				
				if (editor) {
					constraintsEditor.innerHTML = "";
					constraintsEditor.appendChild(editor);
				}
			} else{
				let warpList = constraintsEditor.querySelectorAll('div.constraint-warp');

				// 遍历更新数据
				;[].forEach.call(warpList, function (warp) {
					let checkbox = warp.querySelector('input.al-enable');

					// 如果当前约束已经生效，则不更新数据，直接跳过
					if (checkbox.checked == true) return;

					let bind = checkbox.getAttribute('al-bind'),
						bindType = checkbox.getAttribute('al-bind-type');

					let input = warp.querySelector('input.al-value');

					// 这里的0与true为示例值
					input.value = 0;
					checkbox.checked = true;


					// 伪代码，因为json还没有实现
					// if (json.thisObject.bindType.bind) {
					// 	// 当json中存在该值时，直接更新。
					// 	checkbox.checked = true;
					// 	input.value = json.thisObject.bindType.bind;
					// }else{
					// 	// json中不存在，则计算
					// 	if (bindType === 'Shape') {
					// 		input.value = document.getComputedStyle(selectedObj)[bind];
					// 	}else if (bindType === 'Margins') {
					// 		input.vaule = computeredMargins[bind];
					// 	}else if (bindType === 'Aligments') {
					// 		input.vaule = computeredAligments[bind];
					// 	};
					// }
				});
			}
		},

		// 多选的约束还没有做
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