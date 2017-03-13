var ComponentsService = {
	// 通过 type 和 id 获得一个新的组件
	// 返回值为该组件 node 对象
	// 注意：创建新组件后应调用 handleObject 方法进行初始化
	// 		并添加对应新图层，调用 handleLayer 进行图层初始化
	newObjectByTypeId: function(type, id) {
		var newObject = null;
		switch (type) {
			case 'AL-Label':
				newObject = getLabel(id);
				break;
			case 'AL-Button':
				newObject = getButton(id);
				break;
			case 'AL-Image':
				newObject = getImage(id);
				break;
			case 'AL-View':
				newObject = getView(id);
				break;
			default:
				return null;
		}
		newObject.setAttribute('al-type', type);
		newObject.id = 'al-object-' + id;
		newObject.setAttribute('al-id', id);

		return newObject;

		function getLabel(id) {

			var tempObject = document.createElement('div');

			tempObject.className = 'AL-Object AL-Label';
			tempObject.setAttribute('al-text', 'Label');
			tempObject.innerText = 'Label';

			return tempObject;
		}

		function getButton(id) {
			var tempObject = document.createElement('div');
			tempObject.className = 'AL-Object AL-Button';
			tempObject.setAttribute('al-text', 'Button');
			tempObject.innerText = 'Button';

			return tempObject;
		}

		function getImage(id) {
			var tempObject = document.createElement('div');

			tempObject.className = 'AL-Object AL-Image';

			return tempObject;
		}

		function getView(id) {
			var tempObject = document.createElement('div');

			tempObject.className = 'AL-Object AL-View';

			return tempObject;
		}
	},
	handleObject: function(object, id, zIndex) {
		object.style.zIndex = zIndex

		let resizeButton = document.createElement('rb');
		resizeButton.className = 'AL-Resize-Button';
		resizeButton.setAttribute('draggable', 'true');
		resizeButton.id = 'al-resize-' + id;

		let coverMask = document.createElement('cm');
		coverMask.className = 'AL-Cover-Mask';
		coverMask.id = 'al-cover-' + id;

		resizeButton.ondragstart = function(event) {

			let e = event || window.event || arguments.callee.caller.arguments[0];
			object.setAttribute('draggable', 'false');
			vm.objectMoving = false;
		};
		resizeButton.ondrag = function(event) {
			let e = event || window.event || arguments.callee.caller.arguments[0];
			if(e.pageX == 0 && e.pageY == 0){return;}
			console.log('Reset Object Size');
			// e.target.style.cursor = 'nwse-resize';
			object.style.width = e.pageX - vm.mouseDownPosition.x + vm.objectLastStatus.w + 'px';
			object.style.height = e.pageY - vm.mouseDownPosition.y + vm.objectLastStatus.h + 'px';
			// object.style.lineHeight = vm.selectedObject.style.height; // 保证文字居中 （新方案：通过 flex 实现）

			// 手动更新 Attribute Inspector 
			// width 和 height
			document.getElementsByName('width')[0].value = vm.selectedObjectComputedStyle.width;
			document.getElementsByName('height')[0].value = vm.selectedObjectComputedStyle.height;
		};

		resizeButton.ondragend = function(event) {
		    let e = event || window.event || arguments.callee.caller.arguments[0];
		    // Update.updateSingleConstraintEditor(Config.enableConstraints, object, vm.ScreenArea.children);
		};
		object.appendChild(coverMask);
		object.appendChild(resizeButton);

		object.ondrag = function(event) {
			let e = event || window.event || arguments.callee.caller.arguments[0];
			
			if (vm.objectMoving) {
				if(e.pageX == 0 && e.pageY == 0){return;} // 消除特殊情况（鼠标松开时，有一个偏差坐标 (0，0)）

				// 单选模式拖动
				if (vm.selectedObject !== null) {
					console.log('Reset Object Position');
					let newX = e.pageX - (vm.mouseDownPosition.x - vm.objectLastStatus.x),
						newY = e.pageY - (vm.mouseDownPosition.y - vm.objectLastStatus.y);

					vm.selectedObject.style.left = newX+'px';
					vm.selectedObject.style.top = newY+'px';

					// 手动更新 Attribute Inspector 
					// left 和 top
					document.getElementsByName('left')[0].value = vm.selectedObjectComputedStyle.left;
					document.getElementsByName('top')[0].value = vm.selectedObjectComputedStyle.top;
				}

				// 多选模式拖动
				if (vm.selectedObjects.length !== 0) {
					console.log('Reset Objects Position');
					let newX = e.pageX - (vm.mouseDownPosition.x - vm.objectLastStatus.x),
						newY = e.pageY - (vm.mouseDownPosition.y - vm.objectLastStatus.y);

					object.style.left = newX+'px';
					object.style.top = newY+'px';

					for(let i=0;i<vm.selectedObjects.length;i++) {
						let obj = vm.selectedObjects[i];
						if (obj !== object) {
							let pos = vm.selectedObjectsLastPos[i];
							let newX = pos.x + (e.pageX - vm.mouseDownPosition.x),
								newY = pos.y + (e.pageY - vm.mouseDownPosition.y);
							obj.style.left = newX+'px';
							obj.style.top = newY+'px';
						}
					}
				}

			}
		};
		object.ondragend = function(event){
			// 重新获取附近元素
			if (object === vm.selectedObject) {
				vm.updateSelectedObjectStatus()
			}
		};
		object.onmousedown = function(event) {
			console.log('Mouse Down!');
			let e = event || window.event || arguments.callee.caller.arguments[0];
			let newObject = e.target; // 新选中的组件

			vm.objectMoving = true; // 当鼠标在组件本身上时，设置选中组件可以被移动
			object.setAttribute('draggable', 'true');

			// Reset mouseDownPosition
			vm.mouseDownPosition = { x: e.pageX, y: e.pageY };
			// reset objectLastStatus
			vm.objectLastStatus = {
				w: parseFloat(window.getComputedStyle(object).width),
				h: parseFloat(window.getComputedStyle(object).height),
				x: parseFloat(window.getComputedStyle(object).left) || 0,
				y: parseFloat(window.getComputedStyle(object).top) || 0
			};

			if (vm.selectedObjects.length > 0) {
				vm.selectedObjectsLastPos = [];
				for(let i=0;i<vm.selectedObjects.length;i++) {
					vm.selectedObjectsLastPos.push(vm.getObjectPosition(vm.selectedObjects[i]))
				}
			}

			// 在多选模式下，第一个被选中的元素会赋值给selectedObject，
			// 如果继续选第二个元素，则将第一个选择的元素(selectedObject)和之后的元素一并
			// 存储到selectedObjects中，
			// 如果不继续选，则第一个元素只存在selectedObject中，多选模式结束
			if(vm.isMultiSelectMode) {
				// 多选模式下，如果已有 “单选选中组件”，将其加入多选数组，并将 selectedObject 重置为 null
				if (vm.selectedObject !== null) {
					// 隐藏 单选选中组件 的大小改变图标
					vm.selectedObject.getElementsByTagName('rb')[0].style.display = 'none';
					// 将其标记为 第一个选中组件
					ComponentsService.setObjectAsFirst(vm.selectedObject);

					// 将该组件加入多选列表，并重置 selectedObject
					vm.selectedObjects.push(vm.selectedObject);
	                // 重置 selectedConstraintEle
	                vm.cancelSelectedConstraint();
					vm.selectedObject = null;
					vm.selectedObjectStatus = null;
          			vm.isSelectedObjectStatusSet = false;
				}

				// 如果选中组件已经在 选中组件列表，则移除
				if (vm.selectedObjects.indexOf(object) !== -1) {
					// 取消 选中状态
					ComponentsService.cancelObjectSelected(object);

					// 移除
					vm.selectedObjects.splice(vm.selectedObjects.indexOf(object), 1);

					// 当选中组件列表只有一个时，标记为 第一个选中组件
					if (vm.selectedObjects.length === 1) {
						ComponentsService.setObjectAsFirst(vm.selectedObjects[0]);
					}
				// 如果是新选中组件，则加入 选中组件列表
				} else {
					// 将新点击的组件加入 选中组件列表
					vm.selectedObjects.push(object);

					// 设置选中状态
					ComponentsService.setObjectSelected('Multi', object);

					// 当选中组件列表只有一个时，标记为 第一个选中组件
					if (vm.selectedObjects.length === 1) {
						ComponentsService.setObjectAsFirst(object);
					}
				}

			} else {
				// 单选模式下，如果多选数组长度大于 0，则应清空多选列表
				if(vm.selectedObjects.length > 0){
					// 该判断用于排除 “由于多选状态下错误按键等情况，导致最后一个元素没有退出多选列表” 的 bug 状态
					// 正常情况，此处 多选列表长度 应该大于 1.
					// 因此当长度为 1 时，跳过 “不响应检测”，直接将其清空
					if (vm.selectedObjects.length > 1) {
						// 如果已选中多个组件，并且点击事件发生在其中一个上，则不响应
						for(let i=0;i<vm.selectedObjects.length;i++) {
							if (object === vm.selectedObjects[i]) {
								return;
							}
						}
					}

					// 如果点击的 未选中组件，清空多选列表
					for(let i=0;i<vm.selectedObjects.length;i++) {
						let obj = vm.selectedObjects[i];
						// 取消选中状态
						ComponentsService.cancelObjectSelected(obj);
					}
					vm.selectedObjects = [];
				}

				// 新选中组件 不为 原选中组件 时，进行处理
				if (vm.selectedObject === null || (vm.selectedObject !== null && vm.selectedObject !== object)) {
					// 取消原选中组件的 选中状态
					if (vm.selectedObject !== null) {
		                // 重置 selectedConstraintEle
		                if (vm.selectedConstraintEle !== null) {
		                	vm.cancelSelectedConstraint();
		                }
						ComponentsService.cancelObjectSelected(vm.selectedObject);
					}

					vm.selectedObject = object;
					ComponentsService.setObjectSelected('Single', object);

					// 更新被选中组件状态，为添加约束面板备用
					vm.updateSelectedObjectStatus()
				};
			}
		};

		vm.objects[id] = object; // 此处为一个 bug，单独创建一个 issue 移除
	},
	newLayerByObject: function (object) {
		let id = object.getAttribute('al-id');
		let type = object.getAttribute('al-type');
		let name = object.getAttribute('al-name');

		var newLayer = document.createElement('div');
		newLayer.className = 'AL-Layer-Item';
		newLayer.id = 'al-layer-' + id;
		newLayer.setAttribute('al-id', id);
		newLayer.setAttribute('al-type', type);
		newLayer.setAttribute('draggable', 'true');
		newLayer.innerText = name;

		return newLayer;
	},
	handleLayer: function(layer) {
		// select object when click on related layer
		layer.onclick = function(event) {
			var id = event.target.getAttribute('al-id');
			var obj = document.getElementById('al-object-'+id);
			obj.onmousedown();
		}

		// rearrange layers z-index by dragging
		layer.ondragstart = function(event) {
			layer.style.opacity = '0.5';
			layer.style.borderLeft = '2px solid #777';
			layer.style.borderRight = '2px solid #777';
			layer.style.borderBottom = '2px solid #777';
			event.dataTransfer.setData('ondragLayerId',event.target.id)
		};

		layer.ondragend = function(event) {
			layer.style.opacity = '1';
			layer.style.borderLeft = '';
			layer.style.borderRight = '';
			layer.style.borderBottom = '';
		}

		layer.ondragover = function(event) {
			event.preventDefault();
		}

		layer.ondrop = function (event) {
			event.preventDefault();
			var ondragLayerId = event.dataTransfer.getData('ondragLayerId');
			var ondragLayer = document.getElementById(ondragLayerId);

			vm.layerList.insertBefore(ondragLayer, event.target);

			for (var i = 0; i < vm.layerList.childElementCount; i++) {
				var id = vm.layerList.children[i].getAttribute('al-id');
				var obj = document.getElementById('al-object-'+id);
				obj.style.zIndex = vm.layerList.childElementCount - 1 - i
			}
		}
	},
	// 获取 组件 对应 图层对象
	getLayerByObject: function(obj) {
		return document.getElementById('al-layer-'+obj.getAttribute('al-id'));
	},
	// 设置 组件 al-text 属性
	setObjectALText: function(obj, text) {
		obj.setAttribute('al-text', text);
		obj.childNodes[0].nodeValue = text;
	},
	// 将 组件 设置为被选中状态
	setObjectSelected: function(mode, obj) {
		obj.className += ' mark';
		if (mode === 'Single') {
			obj.querySelector('rb').style.display = 'block';
		}
		ComponentsService.highlightObjectLayer(obj);
	},
	// 取消 组件 选中状态
	cancelObjectSelected: function(obj) {
		obj.className = obj.className.replace(' mark', '').replace(' first-mark', '');
		obj.getElementsByTagName('rb')[0].style.display = 'none';
		ComponentsService.dehighlightObjectLayer(obj);
	},
	// 设置组件为 第一个被选中的组件
	setObjectAsFirst: function(obj) {
		obj.className = obj.className.replace(' mark', ' first-mark');
	},
	// 设置组件为 第一个被选中的组件
	cancelObjectAsFirst: function(obj) {
		obj.className = obj.className.replace(' first-mark', ' mark');
	},
	// 设置组件图层高亮
	highlightObjectLayer: function(obj) {
		let layer = ComponentsService.getLayerByObject(obj);
		layer.className += ' AL-Layer-Selected';
	},
	// 取消组件图层高亮
	dehighlightObjectLayer: function(obj) {
		let layer = ComponentsService.getLayerByObject(obj);
		layer.className = (layer.className).replace(' AL-Layer-Selected', '');
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
	isTopOfAnotherObject: function (obj,anotherObj) {
		let objStatus = ComponentsService.statusOf(obj);
		let anotherObjStatus = ComponentsService.statusOf(anotherObj);
		if (anotherObjStatus.y < (objStatus.y + objStatus.h)) {return false;}
		if (anotherObjStatus.x > (objStatus.x + objStatus.w)) {return false;}
		if ((anotherObjStatus.x + anotherObjStatus.w) < objStatus.x) {return false;}
		console.log((objStatus.y + objStatus.h) - anotherObjStatus.y);

		return Math.abs((objStatus.y + objStatus.h) - anotherObjStatus.y);
	},
	isBottomOfAnotherObject: function (obj,anotherObj) {
		// let objStatus = ComponentsService.statusOf(obj);
		// let anotherObjStatus = ComponentsService.statusOf(anotherObj);
		// if (objStatus.y < (anotherObjStatus.y + anotherObjStatus.h)) {return false;}
		// if (objStatus.x > (anotherObjStatus.x + anotherObjStatus.w)) {return false;}
		// if ((objStatus.x + objStatus.w) < anotherObjStatus.x) {return false;}

		// return (anotherObjStatus.y + anotherObjStatus.h) - objStatus.y;
		return ComponentsService.isTopOfAnotherObject(anotherObj, obj);
	},
	isLeftOfAnotherObject: function (obj,anotherObj) {
		let objStatus = ComponentsService.statusOf(obj);
		let anotherObjStatus = ComponentsService.statusOf(anotherObj);
		if (anotherObjStatus.x < (objStatus.x + objStatus.w)) {return false;}
		if (anotherObjStatus.y > (objStatus.y + objStatus.h)) {return false;}
		if ((anotherObjStatus.y + anotherObjStatus.h) < objStatus.y) {return false;}

		return Math.abs((objStatus.x + objStatus.w) - anotherObjStatus.x);
	},
	isRightOfAnotherObject: function (obj,anotherObj) {
		// let objStatus = ComponentsService.statusOf(obj);
		// let anotherObjStatus = ComponentsService.statusOf(anotherObj);
		// if (objStatus.x < (anotherObjStatus.x + anotherObjStatus.w)) {return false;}
		// if (objStatus.y > (anotherObjStatus.y + anotherObjStatus.h)) {return false;}
		// if ((objStatus.y + objStatus.h) < anotherObjStatus.y) {return false;}

		// return (anotherObjStatus.x + anotherObjStatus.w) - objStatus.x;
		return ComponentsService.isLeftOfAnotherObject(anotherObj, obj);
	},
};