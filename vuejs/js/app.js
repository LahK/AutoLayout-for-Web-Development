let vm = new Vue({
    el: '#al-lahk',
    data: {
        Config: ALConfig,

        // Attributes Inspector
        showAttrInspector: false,
        showOutlineMsg: true,

        isFocus: false, // 防止编辑 文字、属性 时，按下删除键触发删除元素事件
        isEditingObjectName: false, // 是否正在编辑 组件名称
        toolLastPos: { x: 0, y: 0 }, // 工具面板 被选中时的位置、大小

        // 原 Global 部分
        screenArea: null, // 画板区
        objects: {}, // 画板中所有 AL 组件
        objectNames: new Set(),
        selectedObject: null, // （单选时）选中的组件；（多选时）选中的第一个组件
        selectedObjects: [], // 多选时，选中的其他组件
        objectsLastId: 0, // 当前可供新组件使用的 Id
        objectLastStatus: { x: 0, y: 0, w: 0, h: 0 }, // Object 被选中时的位置、大小
        objectMoving: false, // Object 是否在移动
        objectResizing: false, //元素是否在被拖拽放缩
        layerMoving: false, // Layer是否在移动
        mouseOverObject: null, // 鼠标当前所在的元素
        mouseDownPosition: { x: 0, y: 0 }, // 鼠标单击时的位置
    },
    computed: {
        selectedObjectComputedStyle: function() {
            return window.getComputedStyle(this.selectedObject);
        },
        // 画板中所有 AL 组件 对应图层列表
        // layerList 为一个 dom 元素
        // 如需获取图层个数，使用：this.layerList.childElementCount / vm.layerList.childElementCount
        layerList: function() {
            return document.getElementById('layer-list');
        },
        // 获取图层个数的方便方法
        layersCount: function() {
            return this.layerList.childElementCount;
        }
    },
    mounted: function() {
        // 初始化 画板
        this.screenArea = document.getElementById('screen');
        this.screenArea.onmousedown = function(event) {
            let e = event || window.event || arguments.callee.caller.arguments[0];

            // 点击画板空白处时，取消 “组件选择”
            if (vm.selectedObject && e.target === vm.screenArea && vm.selectedObjects.length == 0) {
                vm.selectedObject.getElementsByTagName('rb')[0].style.display = 'none';
                vm.selectedObject.className = (vm.selectedObject.className).replace(' mark', '');

                // 取消对应图层 高亮
                let layer = ComponentsService.getLayerByObject(vm.selectedObject);
                layer.className = (layer.className).replace(' AL-Layer-Selected', '');

                // 终止 选中组件名称编辑 状态
                vm.endEditingSelectedObjectName();

                vm.selectedObject = null;
            }

        };

        // 全局按键事件
        document.onkeyup = function(event) {
            let e = event || window.event || arguments.callee.caller.arguments[0];

            console.log('On Key Up');
            console.log(e.key);

            // Delete selected object by press 'Delete'/'Backspace' key
            if (vm.canDeleteSelectedObject() && (e.key == 'Backspace' || e.key == 'Delete')) {
                let objectToDelete = vm.selectedObject;
                vm.selectedObject = null;
                let layerToDelete = ComponentsService.getLayerByObject(objectToDelete);
                objectToDelete.parentNode.removeChild(objectToDelete);
                layerToDelete.parentNode.removeChild(layerToDelete);
                vm.selectedObject = null;

                // 更新 Objects Outline 提示信息显示状态
                if (vm.layersCount === 0) {
                    vm.showOutlineMsg = true
                }
            }

            if (e.key == 'Enter') {
              if (vm.selectedObject != null) {
                // 编辑选中组件名称 事件
                if (vm.isEditingObjectName) {
                  e.preventDefault();
                  vm.endEditingSelectedObjectName();
                } else {
                  vm.startEditingSelectedObjectName();
                }
              }
            }

            // if (e.key == 17) {
            //  // Ctrl
            //  Global.multipleSelect = false;
            // };
        };

        document.onkeydown = function(event) {
            let e = event || window.event || arguments.callee.caller.arguments[0];

            console.log('On Key Down');
            console.log(e.key);

            switch (e.key) {
              // 左
              case 'ArrowLeft':
                vm.selectedObjectMoveLeft();
                break;
              // 上
              case 'ArrowUp':
                vm.selectedObjectMoveTop();
                break;
              // 右
              case 'ArrowRight':
                vm.selectedObjectMoveRight();
                break;
              // 下
              case 'ArrowDown':
                vm.selectedObjectMoveDown();
                break;
              case 'Enter':
                if (e.key == 'Enter') {
                  if (vm.selectedObject != null) {
                    if (vm.isEditingObjectName) {
                      e.preventDefault();
                    }
                  }
                }
                break;
            }
        };

        document.onkeypress = function(event) {
            let e = event || window.event || arguments.callee.caller.arguments[0];
            console.log('On Key Press');
            console.log(e.key);
        }
    },
    methods: {
        // 用于获取新的 Object Id
        newObjectId: function() {
            return this.objectsLastId++;
        },
        // 通过组件类型生成新组件
        // 注意：此处 组件 指代 AL-组件，非 vue components
        addNewObjectByType: function(type) {
            let newId = this.newObjectId();

            let newObject = ComponentsService.newObjectByTypeId(type, newId);

            // 为防止组件重名，在此统一设置初始命名 al-name
            let newName = type+'-'+newId;
            this.setObjectName(newObject, newName)
            // 将组件添加到画板
            this.screenArea.appendChild(newObject);

            let newLayer = ComponentsService.newLayerByObject(newObject);
            // 将图层添加到 图层操作面板
            this.layerList.insertBefore(newLayer, this.layerList.firstChild);

            // 初始化组件相关样式、事件
            ComponentsService.handleObject(newObject, newId, this.layerList.childElementCount);
            // 初始化图层相关事件
            ComponentsService.handleLayer(newLayer);

            // 更新 Objects Outline 提示信息显示状态
            if (this.layersCount !== 0) {
                this.showOutlineMsg = false
            }
        },
        // 属性观察器（Attributes Inspector）中输入框 keyup 事件
        // 即 用户修改属性值时 keyup 事件
        attributesInspectorItemOnKeyUp: function(type, name, event) {
            // 此处为 Input -> style 单向绑定
            // 即 修改 Input 值时，对应 sytle 更新。反之不成立。
            // 当通过 JS 直接修改 style 时，须手动更新 Input value （Inspector）
            if (type === 'style') {
              this.selectedObject.style[name] = event.target.value;
            }
            if (type === 'data') {
              if (name === 'al-text') {
                ComponentsService.setObjectALText(this.selectedObject, event.target.value);
              }
            }
        },
        // 当退出文字输入状态时
        // 重置 isFocus 为 false，保证 “删除” 事件正常响应
        inputOnBlur: function() {
            this.isFocus = false;
        },
        // 当进入文字输入状态时
        // 设置 isFocus 为 true, “删除” 事件正常响应
        inputOnFocus: function() {
            this.isFocus = true;
        },
        // 工具面板 ondragStart 事件
        toolOnDragStart: function(event) {
            let object = event.target;
            // 记录开始拖动时，鼠标位置
            this.mouseDownPosition = { x: event.pageX, y: event.pageY };
            // 记录开始拖动时，工具面板位置
            vm.toolLastPos = vm.getObjectPosition(object);
        },
        // 工具面板 ondrag 事件
        toolOnDrag: function(event) {
            if (event.pageX == 0 && event.pageY == 0) {
                return; } // 消除特殊情况（鼠标松开时，有一个偏差坐标 (0，0)）
            let object = event.target;

            let newX = event.pageX - (this.mouseDownPosition.x - this.toolLastPos.x),
                newY = event.pageY - (this.mouseDownPosition.y - this.toolLastPos.y);

            // 更新工具面板位置
            object.style.left = newX + 'px';
            object.style.top = newY + 'px';
            // 针对已设置 right/bottom 的元素，初始化，消除 right/bottom 对元素样式的影响
            object.style.right = 'initial';
            object.style.bottom = 'initial';
        },
        // 方向键控制选中组件移动
        // 该组方法只有在组件被选中时调用，因此不验证 selectedObject 是否存在
        selectedObjectMoveLeft: function() {
          let pos = this.getObjectPosition(this.selectedObject);
          let newValue = (pos.x-1)+'px';
          this.updateSelectedObjectStyle('left', newValue);
        },
        selectedObjectMoveTop: function() {
          let pos = this.getObjectPosition(this.selectedObject);
          let newValue = (pos.y-1)+'px';
          this.updateSelectedObjectStyle('top', newValue);
        },
        selectedObjectMoveRight: function() {
          let pos = this.getObjectPosition(this.selectedObject);
          let newValue = (pos.x+1)+'px';
          this.updateSelectedObjectStyle('left', newValue);
        },
        selectedObjectMoveDown: function() {
          let pos = this.getObjectPosition(this.selectedObject);
          let newValue = (pos.y+1)+'px';
          this.updateSelectedObjectStyle('top', newValue);
        },

        // 编辑组件名称相关方法
        // 开始选中组件名称编辑状态
        startEditingSelectedObjectName: function() {
          this.isEditingObjectName = true;

          let layer = this.getSelectedObjectLayer();
          layer.contentEditable = true;
          layer.focus();
        },
        // 终止选中组件名称编辑状态
        endEditingSelectedObjectName: function() {
          this.isEditingObjectName = false;

          let layer = this.getSelectedObjectLayer();
          layer.contentEditable = false;
          this.updateObjectName(this.selectedObject, layer.innerHTML)
        },
        // 设置
        setObjectName: function(object, newName) {
          while(this.objectNames.has(newName)) {
            newName += '-new';
          }
          object.setAttribute('al-name', newName);

          // 如果对应图层对象存在，更新图层显示文字
          let layer = ComponentsService.getLayerByObject(object);
          if (layer != null) {
            layer.innerHTML = newName;
          }

          // 将新名称添加到名称集合
          this.objectNames.add(newName);
        },
        updateObjectName: function(object, newName) {
          let oldName = object.getAttribute('al-name');
          this.objectNames.delete(oldName);
          this.setObjectName(object, newName);
        },

        // 
        // 一些 工具/辅助 方法
        //

        // 获取组件当前位置
        getObjectPosition: function(object) {
          return {
                x: parseFloat(window.getComputedStyle(object).left),
                y: parseFloat(window.getComputedStyle(object).top)
            };
        },
        // 更新选中组件样式
        // 备注：此方法会同时更新对应 Attribute Inspector 项目
        updateSelectedObjectStyle: function(attrName, newValue) {
          // 更新 style
          this.selectedObject.style[attrName] = newValue;
          // 更新 Attributes Inspector
          document.getElementsByName(attrName)[0].value = newValue;
        },
        getSelectedObjectLayer: function() {
          return ComponentsService.getLayerByObject(this.selectedObject);
        },
        canDeleteSelectedObject: function() {
          return !this.isFocus && !this.isEditingObjectName;
        }
    }
})
