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
			console.log(e.pageX);
			console.log(e.pageY);
			console.log(vm.mouseDownPosition.x);
			console.log(vm.mouseDownPosition.y);
			console.log(vm.objectLastStatus.x);
			console.log(vm.objectLastStatus.y);
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

				console.log('Reset Object Position');
				console.log(e.pageX);
				console.log(e.pageY);
				console.log(vm.mouseDownPosition.x);
				console.log(vm.mouseDownPosition.y);
				console.log(vm.objectLastStatus.x);
				console.log(vm.objectLastStatus.y);

				let newX = e.pageX - (vm.mouseDownPosition.x - vm.objectLastStatus.x),
					newY = e.pageY - (vm.mouseDownPosition.y - vm.objectLastStatus.y);

				object.style.left = newX+'px';
				object.style.top = newY+'px';
				console.log(newX+'px');
				console.log(newY+'px');

				// 手动更新 Attribute Inspector 
				// left 和 top
				document.getElementsByName('left')[0].value = vm.selectedObjectComputedStyle.left;
				document.getElementsByName('top')[0].value = vm.selectedObjectComputedStyle.top;
			}
		};
		object.ondragend = function(event){
			// 重新获取附近元素
			// Update.updateSingleConstraintEditor(Config.enableConstraints, object, vm.ScreenArea.children);
		};
		object.onmousedown = function(event) {
			let e = event || window.event || arguments.callee.caller.arguments[0];

			// 在多选模式下，第一个被选中的元素会赋值给selectedObject，
			// 如果继续选第二个元素，则将第一个选择的元素(selectedObject)和之后的元素一并
			// 存储到selectedObjects中，
			// 如果不继续选，则第一个元素只存在selectedObject中，多选模式结束
			if(vm.MultipleSelect && vm.selectedObject != null && vm.selectedObject != object) {
				// 能触发多选，说明完成了单选
				// 但是此状态下，还点击单选选中的元素，则无效（因为全程只有一个元素，没有多选）
				if (vm.selectedObject) {
					// 单选保存有元素，说明现在触发的是多选的第二个元素，
					// 则取出单选元素和当前元素，保存到多选元组中
					vm.selectedObject.className = (vm.selectedObject.className).replace('mark', 'first-mark');
					vm.selectedObjects.add(vm.selectedObject);

					object.className += ' mark';
					vm.selectedObjects.add(object);
					
					// multipleFirst记录下多选中第一个选中的元素
					vm.MultipleFirst = vm.selectedObject;
					// 清空单选，清除绑定的编辑器
					vm.selectedObject.getElementsByTagName('rb')[0].style.display = 'none';
					vm.selectedObject = null;

				} else {
					// 多选模式开启，并且单选没有元素，说明正在多选第三个及之后的元素
					// 直接添加进元组即可
					if (object.className.indexOf(' mark') > -1) {

						object.className = (object.className).replace(' mark', '');
						vm.selectedObjects.delete(object);
					}else{

						object.className += ' mark';
						vm.selectedObjects.add(object);
					}
				}

				
				// Update.updateMultiConstraintEditor(Config.enableConstraints, vm.MultipleFirst, vm.selectedObjects);
			} else {
				// 有元素在单选模式下被点击
				// 或者多选模式下点击的第二个元素和第一个元素相同
				// 元组不为空说明刚刚退出多选，但多个元素还被选中，因此需要清空元组

				if(vm.selectedObjects.size){
					
					// forEach的回调会异步执行，因此需要在回调函数中一个一个删除元素，
					// 否则由于异步执行会导致元素删除了还没更新完成界面。
					vm.selectedObjects.forEach(function (elem) {


						elem.className = elem.className.replace(' mark', '').replace(' first-mark', '');
						// 更新一个删除一个
						vm.selectedObjects.delete(elem);
					});
					// 不可以在这里直接执行 vm.selectedObjects.clear()
					// 因为 forEach是异步操作，上面的display = 'none' 还没有执行完，就直接clear了
					// 会导致异步错误

					// 清空
					vm.MultipleFirst = null;
				}

				vm.objectMoving = true;
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

				if (vm.selectedObject !== object) {
					// 取消原选中组件的 选中状态
					if (vm.selectedObject) {
						vm.selectedObject.className = (vm.selectedObject.className).replace(' mark', '');
						vm.selectedObject.getElementsByTagName('rb')[0].style.display = 'none';

						// 取消对应图层 高亮
						let layer = ComponentsService.getLayerByObject(vm.selectedObject);
						layer.className = (layer.className).replace(' AL-Layer-Selected', '');
					}

					object.querySelector('rb').style.display = 'block';
					object.className += ' mark';
					vm.selectedObject = object;

					// 选中时高亮对应图层
					let layer = ComponentsService.getLayerByObject(object);
					layer.className += ' AL-Layer-Selected';
				};
			}
		};

		vm.objects[id] = object;
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
	getLayerByObject: function(obj) {
		return document.getElementById('al-layer-'+obj.getAttribute('al-id'));
	},
	setObjectALText: function(obj, text) {
		obj.setAttribute('al-text', text);
		obj.childNodes[0].nodeValue = text;
	}
};