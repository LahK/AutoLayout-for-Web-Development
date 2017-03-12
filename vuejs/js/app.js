let vm = new Vue({
    el: '#al-lahk',
    data: {
        Config: ALConfig,

        // Attributes Inspector
        showAttrInspector: false,
        showOutlineMsg: true,

        isFocus: false, // 防止编辑 文字、属性 时，按下删除键触发删除元素事件
        focusInputName: '', // 当前 focus 的输入框的 name 属性，用于判断是否响应某些事件，如：移动选中对象
        isEditingObjectName: false, // 是否正在编辑 组件名称
        toolLastPos: { x: 0, y: 0 }, // 工具面板 被选中时的位置、大小
        isMouseDown: false, // 判断当前是否处于 mousedown 状态

        // 多选相关
        isMultiSelectMode: false, // 是否处于多选模式

        // 原 Global 部分
        screenArea: null, // 画板区
        objects: [], // 画板中所有 AL 组件
        constraints: [], // 所有存在的约束
        isSelectedObjectStatusSet: false,
        selectedObjectStatus: null,
        addConstraintSelectionSingle: [],
        addConstraintSelectionMulti: [],
        objectNames: new Set(),
        selectedObject: null, // （单选时）选中的组件；（多选时）选中的第一个组件
        selectedObjects: [], // 多选时选中的组件列表。注意：多选时，selectedObject 重置为 null
        objectsLastId: 1, // 当前可供新组件使用的 Id。 id 0 保留给画板，在设置约束时会用到。
        objectLastStatus: { x: 0, y: 0, w: 0, h: 0 }, // Object 被选中时的位置、大小
        selectedObjectsLastPos: [], // 记录拖动前被选中组件的位置
        objectMoving: false, // Object 是否可以被移动
        objectResizing: false, //元素是否在被拖拽放缩
        layerMoving: false, // Layer是否在移动
        mouseOverObject: null, // 鼠标当前所在的元素
        mouseDownPosition: { x: 0, y: 0 }, // 鼠标单击时的位置

        // 约束显示面板
        selectedConstraintEle: null, // 选中的约束 Dom 元素
        selectedConstraint: null, // 选中的约束数据
        isSelectedConstraintChanged: false, // 判断是否选中约束被修改，用于显示保存按钮

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
        },
        // 判断是否应该显示单选 Attribute Inspector
        canShowSignleModeAttributeInspector: function() {
          return this.selectedObjects.length === 0 && this.selectedObject !== null;
        },
        isMac: function() {
          return navigator.userAgent.indexOf('Mac OS X') !== -1
        },
        // 获取选中组件相关的约束
        constraintsOfSelectedObject: function() {
          let list = [];
          let id = this.selectedObject.getAttribute('al-id');
          for(let i=0;i<this.constraints.length;i++) {
            let c = this.constraints[i];
            if(c.item == id || c.toItem == id) {
              c.index = i;
              list.push(c);
            }
          }
          return list;
        },
    },
    mounted: function() {
        // 初始化 画板
        this.screenArea = document.getElementById('screen');

        // 全局 mousedown 事件
        this.screenArea.onmousedown = function(event) {
            let e = event || window.event || arguments.callee.caller.arguments[0];

            // 点击画板空白处时，取消 “组件选择”
            if (e.target === vm.screenArea) {
              // 当前为单选
              if (vm.selectedObject !== null) {
                // 取消 选中组件 选中状态
                ComponentsService.cancelObjectSelected(vm.selectedObject);

                // 终止 选中组件名称编辑 状态
                vm.endEditingSelectedObjectName();

                // 重置
                vm.selectedObject = null;
                // 重置 selectedObjectStatus
                vm.selectedObjectStatus = null;
                vm.isSelectedObjectStatusSet = false;
                // 重置 selectedConstraintEle
                vm.cancelSelectedConstraint();
              }

              // 当前为多选
              if (vm.selectedObjects.length > 0) {
                for(let i=0;i<vm.selectedObjects.length;i++) {
                  // 取消 组件 选中状态
                  let obj = vm.selectedObjects[i];
                  ComponentsService.cancelObjectSelected(obj);
                }
                // 重置
                vm.selectedObjects = []
              }
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
                // 重置 selectedObject
                vm.selectedObject = null;
                // 重置 selectedObjectStatus
                vm.selectedObjectStatus = null;
                vm.isSelectedObjectStatusSet = false;
                // 从 组件列表 移除
                vm.objects.splice(vm.objects.indexOf(objectToDelete), 1);

                let layerToDelete = ComponentsService.getLayerByObject(objectToDelete);
                objectToDelete.parentNode.removeChild(objectToDelete);
                layerToDelete.parentNode.removeChild(layerToDelete);

                // 更新 Objects Outline 提示信息显示状态
                if (vm.layersCount === 0) {
                    vm.showOutlineMsg = true
                }
            }

            if (e.key == 'Enter') {
              // 单选模式时，允许编辑选中组件名称
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

            // 退出多选模式

            if (e.key == 'Control' && !vm.isMac) {
              e.preventDefault();
              vm.isMultiSelectMode = false;

              // 如果松开 Control 时，多选组件只剩一个，则将其作为单选组件
              if (vm.selectedObjects.length === 1) {
                let temp = vm.selectedObjects[0];
                vm.selectedObjects = [];
                vm.selectedObject = temp;
                // 更新被选中组件状态，为添加约束面板备用
                vm.updateSelectedObjectStatus()
                // 隐藏 单选选中组件 的大小改变图标
                vm.selectedObject.querySelector('rb').style.display = 'block';
                ComponentsService.calcelObjectAsFirst(vm.selectedObject);
              }
            }
            if (e.key == 'Meta' && vm.isMac) {
              e.preventDefault();
              vm.isMultiSelectMode = false;

              // 如果松开 Control 时，多选组件只剩一个，则将其作为单选组件
              if (vm.selectedObjects.length === 1) {
                let temp = vm.selectedObjects[0];
                vm.selectedObjects = [];
                vm.selectedObject = temp;
                // 更新被选中组件状态，为添加约束面板备用
                vm.updateSelectedObjectStatus()
                // 隐藏 单选选中组件 的大小改变图标
                vm.selectedObject.querySelector('rb').style.display = 'block';
                ComponentsService.calcelObjectAsFirst(vm.selectedObject);
              }
            }
        };

        document.onkeydown = function(event) {
            let e = event || window.event || arguments.callee.caller.arguments[0];

            console.log('On Key Down');
            console.log(e.key);

            switch (e.key) {
              // 左
              case 'ArrowLeft':
                if (vm.canMoveSelectedObject()) {
                  vm.selectedObjectMoveLeft();
                }
                break;
              // 上
              case 'ArrowUp':
                if (vm.canMoveSelectedObject()) {
                  vm.selectedObjectMoveTop();
                }
                break;
              // 右
              case 'ArrowRight':
                if (vm.canMoveSelectedObject()) {
                  vm.selectedObjectMoveRight();
                }
                break;
              // 下
              case 'ArrowDown':
                if (vm.canMoveSelectedObject()) {
                  vm.selectedObjectMoveDown();
                }
                break;
              case 'Enter':
                // 当在编辑组件名称时，不允许换行。（只有单选模式可以编辑）
                if (vm.selectedObject != null) {
                  if (vm.isEditingObjectName) {
                    e.preventDefault();
                  }
                }
                break;
              case 'Control':
                if (!vm.isMac) {
                  e.preventDefault();
                  // 进入多选模式
                  vm.isMultiSelectMode = true;
                }
                break;
              case 'Meta':
                if (vm.isMac) {
                  e.preventDefault();
                  // 进入多选模式
                  vm.isMultiSelectMode = true;
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
            // 将组件添加到 组件列表
            this.objects.push(newObject);

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
            this.focusInputName = '';
        },
        // 当进入文字输入状态时
        // 设置 isFocus 为 true, “删除” 事件正常响应
        inputOnFocus: function(name) {
            this.isFocus = true;
            this.focusInputName = name;
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
        // 设置组件 al-name 属性
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
        // 更新组件 al-name 属性
        updateObjectName: function(object, newName) {
          let oldName = object.getAttribute('al-name');
          this.objectNames.delete(oldName);
          this.setObjectName(object, newName);
        },

        //
        // 约束相关方法
        //
        // 更新 selectedObjectStatus
        updateSelectedObjectStatus: function() {
          let temp = {};
          temp.width = parseFloat(window.getComputedStyle(this.selectedObject).width);
          temp.height = parseFloat(window.getComputedStyle(this.selectedObject).height);

          temp.leading = {
            toObject: '0',
            value: parseFloat(window.getComputedStyle(this.selectedObject).left)
          };
          temp.trailing = {
            toObject: '0',
            value: parseFloat(window.getComputedStyle(this.selectedObject).right)
          };
          temp.top = {
            toObject: '0',
            value: parseFloat(window.getComputedStyle(this.selectedObject).top)
          };
          temp.bottom = {
            toObject: '0',
            value: parseFloat(window.getComputedStyle(this.selectedObject).bottom)
          };
          let obj = this.selectedObject;
          for(let i=0;i<this.objects.length;i++) {
            let anotherObj = this.objects[i];
            if (anotherObj !== obj) {
              let leadingSpace = ComponentsService.isLeftOfAnotherObject(anotherObj, obj);
              let trailingSpace = ComponentsService.isRightOfAnotherObject(anotherObj, obj);
              let topSpace = ComponentsService.isTopOfAnotherObject(anotherObj, obj);
              let bottomSpace = ComponentsService.isBottomOfAnotherObject(anotherObj, obj);
              if (leadingSpace !== false && leadingSpace < temp.leading.value) {
                temp.leading.value = leadingSpace;
                temp.leading.toObject = anotherObj.getAttribute('al-id');
                continue;
              }
              if (trailingSpace !== false && trailingSpace < temp.trailing.value) {
                temp.trailing.value = trailingSpace;
                temp.trailing.toObject = anotherObj.getAttribute('al-id');
                continue;
              }
              if (topSpace !== false && topSpace < temp.top.value) {
                temp.top.value = topSpace;
                temp.top.toObject = anotherObj.getAttribute('al-id');
                continue;
              }
              if (bottomSpace !== false && bottomSpace < temp.bottom.value) {
                temp.bottom.value = bottomSpace;
                temp.bottom.toObject = anotherObj.getAttribute('al-id');
                continue;
              }
            }
          }

          // 同时更新所有状态
          this.selectedObjectStatus = temp;
          this.isSelectedObjectStatusSet = false; // 刷新一下
          this.isSelectedObjectStatusSet = true;
          console.log('selectedObjectStatus updated');
        },
        // 获取 Spacing Note 文字
        getConstraintToObjectMessage: function(which) {
          return this.selectedObjectStatus[which].toObject == 0 ? 'Screen' : document.getElementById('al-object-'+this.selectedObjectStatus[which].toObject).getAttribute('al-name');
        },
        addConstraint: function(toItem, attr) {
          console.log(toItem);
          console.log(attr);
          // toItem 是 约束第二方 的 id
          // attr 是 约束第一方 约束的属性名称
          let obj = this.selectedObject || this.getFirstSelectedObject();
          let status = this.selectedObjectStatus;

          let c = {};
          c.item = obj.getAttribute('al-id');
          c.attribute = this.getStandardConstraintName(attr);
          c.relatedBy = 'equal';
          c.toItem = toItem;
          if (attr.indexOf('space') !== -1 && attr.indexOf('align') === -1) {
            switch(c.attribute) {
              case 'leading':
                c.toAttribute = "trailing";
                break;
              case 'trailing':
                c.toAttribute = 'leading';
                break;
              case 'top':
                c.toAttribute = 'bottom';
                break;
              case 'bottom':
                c.toAttribute = 'top';
                break;
            }
          } else {
            c.toAttribute = c.attribute;
          }
          c.multiplier = 1;
          if (attr.indexOf('space') !== -1 && attr.indexOf('align') === -1) {
            c.constant = this.selectedObjectStatus[c.attribute].value;
          } else if (attr === 'c-width' || attr === 'c-height') {
            c.constant = this.selectedObjectStatus[c.attribute];
          } else {
            c.constant = 0;
          }
          this.constraints.push(c);
        },
        addConstraintSingleOnClick: function() {
          for(let i=0;i<this.addConstraintSelectionSingle.length;i++) {
            let attr = this.addConstraintSelectionSingle[i];
            let toItem = '';
            // 边距
            if (attr.indexOf('space') !== -1) {
              toItem = this.selectedObjectStatus[this.getStandardConstraintName(attr)].toObject;
            }
            // 与 Screen 对齐
            if (attr.indexOf('in-box') !== -1) {
              toItem = '0';
            }
            this.addConstraint(toItem, attr);
          }
          this.addConstraintSelectionSingle = [];
        },
        addConstraintMultiOnClick: function() {
          let firstObj = this.getFirstSelectedObject();
          for(let i=0;i<this.selectedObjects.length;i++) {
            if (this.selectedObjects[i] === firstObj) { continue; }
            let toItem = this.selectedObjects[i].getAttribute('al-id');
            for(let j=0;j<this.addConstraintSelectionMulti.length;j++) {
              let attr = this.addConstraintSelectionMulti[j];
              this.addConstraint(toItem, attr);
            }
          }
          this.addConstraintSelectionMulti = [];
        },
        getStandardConstraintName: function(name) {
          switch(name) {
            case 'c-width':
              return 'width';
            case 'c-height':
              return 'height';
            case 'c-leading-space':
              return 'leading';
            case 'c-trailing-space':
              return 'trailing';
            case 'c-top-space':
              return 'top';
            case 'c-bottom-space':
              return 'bottom';
            case 'c-herizontally-in-box':
              return 'centerX';
            case 'c-vertically-in-box':
              return 'centerY';
            case 'c-equal-width':
              return 'width';
            case 'c-equal-height':
              return 'height';
            case 'c-align-leading-edges':
              return 'leading';
            case 'c-align-top-edges':
              return 'top';
            case 'c-align-traling-edges':
              return 'trailing';
            case 'c-align-bottom-edges':
              return 'bottom';
            case 'c-horizontally-align':
              return 'centerX';
            case 'c-vertically-align':
              return 'centerY';
          }

        },
        getConstraintText: function(c) {
          switch (c.attribute) {
            case 'width':
              if (c.toItem === '') { return 'Width Equals'; }
              if (c.multiplier !== 1 || c.constant !== 0) { return 'Proportional Width to'; }
              return 'Equal Width to';
            case 'height':
              if (c.toItem === '') { return 'Height Equals'; }
              if (c.multiplier !== 1 || c.constant !== 0) { return 'Proportional Height to'; }
              return 'Equal Height to';
            case 'leading':
              return 'Leading Space to';
            case 'trailing':
              return 'Trailing Space to';
            case 'top':
              return 'Top Space to';
            case 'bottom':
              return 'Bottom Space to';
            case 'centerX':
              return 'Align Center X to';
            case 'centerY':
              return 'Align Center Y to';
          }
        },
        constraintOnClick: function(c, event) {
          this.selectedConstraint = c;
          // 找到对应约束 Element
          let ele = event.target;
          while(ele.tagName !== 'DIV' || ele.className.indexOf('-row') !== -1) {
            ele = ele.parentNode;
          }
          if (this.selectedConstraintEle === null) {
            this.setSelectedConstraint(ele);
          } else {
            if (ele === this.selectedConstraintEle) {
              this.cancelSelectedConstraint(); 
            } else {
              this.cancelSelectedConstraint(); 
              this.setSelectedConstraint(ele);
            }
          }
        },
        setSelectedConstraint: function(ele) {
          ele.className += ' AL-Constraint-Item-Selected';
          this.selectedConstraintEle = ele;
          console.log('Select Constraint');
        },
        cancelSelectedConstraint: function() {
          if (this.selectedConstraint !== null) {
            this.selectedConstraintEle.className = this.selectedConstraintEle.className.replace(' AL-Constraint-Item-Selected', '');
            this.selectedConstraintEle = null;
            this.isSelectedConstraintChanged = false;
            console.log('Deselect Constraint');
          }
        },
        editConstraintInputOnKeyUp: function(event) {
          if ('ArrowLeftArrowRightArrowUpArrowDownEnterCtrlMeta'.indexOf(event.key) === -1) {
            this.isSelectedConstraintChanged = true;
          }
        },
        saveConstraintChange: function() {
          let index = this.selectedConstraint.index;
          let constant = document.getElementsByName('c-constant')[0].value;
          let multiplier = document.getElementsByName('c-multiplier')[0].value;
          this.constraints[index].constant = constant;
          this.constraints[index].multiplier = multiplier;

          this.isSelectedConstraintChanged = false;
        },
        deleteSelectedConstraint: function() {
          this.cancelSelectedConstraint()
          this.constraints.splice(this.selectedConstraint.index, 1);
          this.selectedConstraint = null;
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
        // 方便方法，用于获取被选中组件的图层对象
        getSelectedObjectLayer: function() {
          return ComponentsService.getLayerByObject(this.selectedObject);
        },
        // 判断是否能够删除选中组件
        canDeleteSelectedObject: function() {
          // 当正在输入时不可删除
          return !this.isFocus && !this.isEditingObjectName && this.selectedConstraintEle == null;
        },
        // 判断是否能够移动选中组件
        canMoveSelectedObject: function() {
          // 1. 当不是在编辑组件名称，并且没有 focus 的时候
          // 2. 当处于 focus 状态，并且 focus 的输入框为 Left 或者 Top
          return this.selectedObject != null && ((!this.isFocus && !this.isEditingObjectName) || (this.isFocus && (this.focusInputName === 'Left' || this.focusInputName == 'Top') ))
        },
        // 获取第一个被选中的组件
        getFirstSelectedObject: function() {
          return document.getElementsByClassName('first-mark')[0];
        },
        // 通过 id 获取组件 al-name
        getALNameById: function(id) {
          console.log('----------');
          console.log(id);
          if (id=='') {return '';}
          console.log(document.getElementById('al-object-'+id).getAttribute('al-name'));
          return document.getElementById('al-object-'+id).getAttribute('al-name');
        },
        exportToJsonFile: function() {
          let jsonData = {};
          jsonData.objects = [];
          for(let i=0;i<this.objects.length;i++) {
            let item = this.objects[i];
            let obj = {};
            obj.type = item.getAttribute('al-type');
            obj.id = item.getAttribute('al-id');
            obj.name = item.getAttribute('al-name');
            obj.style = {};
            obj.data = {};

            let itemStyle = window.getComputedStyle(item);
            let styleObj = this.Config.attributes[obj.type].style;
            let dataObj = this.Config.attributes[obj.type].data;
            let styleKeys = Object.keys(styleObj);
            for(let j=0;j<styleKeys.length;j++) {
              obj.style[styleObj[styleKeys[j]]] = itemStyle[styleObj[styleKeys[j]]];
            }
            let dataKeys = Object.keys(dataObj);
            for(let j=0;j<dataKeys.length;j++) {
              obj.data[dataObj[dataKeys[j]]] = item.getAttribute(dataObj[dataKeys[j]]);
            }
            jsonData.objects.push(obj);
          }

          jsonData.constraints = [];
          for(let i=0;i<this.constraints.length;i++) {
            let item = this.constraints[i];
            let c = {};
            c.item = item.item;
            c.attribute = item.attribute;
            c.relatedBy = item.relatedBy;
            c.toItem = item.toItem;
            c.toAttribute = item.toAttribute;
            c.multiplier = item.multiplier;
            c.constant = item.constant;
            jsonData.constraints.push(c);
          }

          let dataStr = JSON.stringify(jsonData);
          let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
          
          let exportFileDefaultName = 'data.json';
          
          let linkElement = document.createElement('a');
          linkElement.setAttribute('href', dataUri);
          linkElement.setAttribute('download', exportFileDefaultName);
          linkElement.click();
        },
    }
})
