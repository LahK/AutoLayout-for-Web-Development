# AutoLayout-for-Web-Development
A tool for web developers to fast set website UI using Xcode-like-AutoLayout.


## Related Links

- [野狗](https://www.wilddog.com/)
- [脑图](http://naotu.baidu.com/file/0df7e13496239b2a408d2c39e34529bb?token=074797cde5554e91)


## Reading List

*About Namespacing*
- [Namespacing in JavaScript](https://javascriptweblog.wordpress.com/2010/12/07/namespacing-in-javascript/)
- [【译】JavaScript 中的命名空间(Namespacing in JavaScript)](http://chengkang.me/2016/06/21/Namespacing%20in%20JavaScript/)
- [JavaScript Namespacing](http://peter.michaux.ca/articles/javascript-namespacing)
- [【译】JavaScript 命名空间](http://chengkang.me/2016/06/28/javascript-namespace-by-michaux/)
- [My Favorite JavaScript Design Pattern](https://www.sitepoint.com/my-favorite-javascript-design-pattern/)
- [【译】我最喜欢的 JavaScript 设计模式](http://chengkang.me/2016/07/02/my-favorite-javascript-pattern/)

## Watching List

*About Gulp*
- [Learning Gulp](https://www.youtube.com/playlist?list=PLLnpHn493BHE2RsdyUNpbiVn-cfuV7Fos)
- [Website Performance Tutorial](https://www.youtube.com/watch?v=aD94FQ-WsIg&list=PLLnpHn493BHGpGXukqYsxwQw3ziW3uti6)


## Useful Links
- [drag: DataTransfer](https://developer.mozilla.org/en-US/docs/Web/API/DataTransfer)
- [Browser Window Size in JavaScript](http://www.javascripter.net/faq/browserw.htm)


## Data Structure
1. 
```
{
	"objects": [
		{
			"id": "$id",
			"type": "Label/Image/Button/View",
			"width": "70",
			"...": "...",
			"relation": {
				"father": "$id",
				"children": ["$id", "$id","..."]
			}
		},
		{
			"id": "$id",
			"type": "Label/Image/Button/View",
			"width": "70",
			"...": "...",
			"relation": {
				"father": "$id",
				"children": ["$id", "$id","..."]
			}
		}
	],
	"constraints": [
		{
			"id": "$id",
			"type": "leadingEdge/trailingEdge/topEdge/bottomEdge/verticalCenter/horizentalCenter",
			"objectId": ["$id"],
			"...": "..."
		},
		{
			"id": "$id",
			"type": "leadingEdge/trailingEdge/topEdge/bottomEdge/verticalCenter/horizentalCenter",
			"objectId": ["$id","$id"],
			"...": "..."
		}
	]
}
```

2. 
```
-users
	-$user
		-documents
			-$documents
				-title
				-content
				-isReadable
				-createdAt
				-updatedAt
	-$user
		-documents
			-$documents
				-title
				-content
				-isReadable
				-createdAt
				-updatedAt
```


```
function createNewObject (type) {
	var id = nextId();
	var newObject = document.createElement("div");
	newObject.className = "module ";
	newObject.id = "M-" + id; 
	newObject.style.left = "0px";
	newObject.style.top = "0px";
	newObject.setAttribute("name","module");
	return newObject;
}
```

## 添加外边距约束 逻辑

每个元素有四条边属性，
- sideTop: {
	start: {
		x: Float, 
		y: Float
	}, 
	end: {
		x: Float, 
		y: Float
	}
}
- sideBottom: {
	start: {
		x: Float, 
		y: Float
	}, 
	end: {
		x: Float, 
		y: Float
	}
}
- sideLeft: {
	start: {
		x: Float, 
		y: Float
	}, 
	end: {
		x: Float, 
		y: Float
	}
}
- sideRight: {
	start: {
		x: Float, 
		y: Float
	}, 
	end: {
		x: Float, 
		y: Float
	}
}

有一个全局变量 elements（例），存储所有元素。添加约束时：

例如 添加下边距约束:

```
// 判断点是否在一条横向线的范围内
function isPointInLineX(point, line) {
	if point.x >= line.start.x && point =< line.end.x {
		return true
	} else {
		return false
	}
}

//判断点是否在一条竖向线的范围内
function isPointInLineY(point, line) {
	if point.y >= line.start.y && point =< line.end.y {
		return true
	} else {
		return false
	}
}

// 设置下边距约束
function setBottomMarginAuto() {
	// 当前选中元素
	var selectedElement
	// 初始化符合要求的附近元素列表
	var qualifiedElements = []
	
	for element in elements {
		if element != targetElement {
			// 判断元素是否位于选中元素的下方
			if element.sideTop.start.y <= selectedElement.sideBottom.start.y {
				// 判断两个元素是否有『重叠』
				if isPointInLineX(element.sideTop.start, selectedElement.sideBottom) {
					qualifiedElements.append(element)
				}
			}
		}
	}
	
	// 初始化目标元素
	var targetElement = nil
	if qualifiedElements.count > 1 {
		// 当有多个时，选择最近的元素
		// 初始化目标元素，方便之后比较
		targetElement = element[0]
		for element in qualifiedElements {
			if element.start.y < targetElement.start.y {
				targetElement = element
			}
		}
	} else if qualifiedElements.count == 1 {
		// 当只有一个时，直接设置为这一个
		targetElement = qualifiedElement
	} else {
		// 当没有符合要求的其他元素时，约束对象设置为容器
		targetElement = SuperView
	}
	
	// 存储约束值
	// 此处应该是有一个全局的约束变量，新增一组约束进去
}
```

所有约束在一个数组内，当我们读取约束生成页面时，遍历数组，一个一个按照约束修改元素位置。

## 生成 JSON 文件

- 遍历画板中对象数组
- 读取 al-type，读取对应配置参数（包含父元素属性、mask 元素属性和 resize-btn 元素属性）
- 遍历父元素属性数组（包含自定义属性 al-xxxx，原生属性），读取并添加到 json 数组
- 遍历 mask 元素属性数组，读取并添加到 json 数组
- 遍历 resize-btn 元素属性，读取并添加到 json 数组
- 

```
[
	{
		"al-id": "XXX",
		"al-type": "XXXX",
		"father": {
			"al": {
				"al-height": xxx,
				...
			},
			"or": {
				"background-color": #eee,
				...
			}
		},
		"mask": {
			"al": {
				"al-height": xxx,
				...
			},
			"or": {
				"background-color": #eee,
				...
			}
		},
		"resize-btn": {
			"al": {
				"al-height": xxx,
				...
			},
			"or": {
				"background-color": #eee,
				...
			}
		}
	}
]
```

## 移动元素逻辑思路

- 解决方案：将移动元素（由 onmousemove 事件）改成由 ondrag 事件控制，并且动态切换元素的 draggable 属性。
- 原本是添加一个 isMouseDown 状态变量来记录是否已经选中元素并且处于移动状态。理由是：
	记录当前被选中的元素的变量 currentSelected 应该有如下几种状态 currentSelectedState：
	- selected（此时有一个元素被选中）
	- moving（此时被选中元素正在移动或者将要移动）
	- unselected（此时未选中任何元素）
	对应的场景如下：
	- 最初的 **mouseUp** 状态，currentSelected = null, currentSelectedState = unselected
	- 第一次点击某个元素时 **mouseDown**，该元素 object 被选中， currentSelected = object
		- 在鼠标松开前、移动时 **mouseMove**，currentSelectedState = moving *
		- 松开时即 **mouseUp**，currentSelectedState = selected
	之所以需要 isMouseDown，是因为在上述 * 号标记的情况下，即移动元素时，如果鼠标滑到其他元素上，会触发其他元素的 mouseDown 和 mouseMove 方法。isMouseDown 用于阻止这个误触发。
	```
	object.onmousedown = function() {
		if(Global.multipleSelect){
			return;
		}

		if(Global.isMouseDown){return;}  // 防止二次选中元素

		Global.currentSelected = object;

		Global.isMouseDown = true; // 防止二次选中元素（在 MouseDown 情况下，移动到一个元素上会触发该元素的 MouseDown 方法。）
		Global.objectMoving = true;
		object.getElementsByTagName("rb")[0].style.display = "block";

		Global.objectLastStatus = {
			w: parseFloat(window.getComputedStyle(object).width),
			h: parseFloat(window.getComputedStyle(object).height),
			x: parseFloat(window.getComputedStyle(object).left) || 0,
			y: parseFloat(window.getComputedStyle(object).top) || 0
		}

		Update.updateEditor(Config.enableStyles, object);

	};
	```
	虽然这次没有用这个方法来解决问题，就当是一次积累了。以后碰到类似情况得考虑这个误触发情况。
- 注意一：在使用 onmousemove 时要注意，需要添加 `if(object != Global.currentSelected){return;}` 来防止触发其他元素的 onmousemove 方法。
	```
	object.onmousemove = function(event) {
		let e = event || window.event || arguments.callee.caller.arguments[0];
		if (Global.objectMoving) {
			if(object != Global.currentSelected){return;} // 避免移动错误元素
	
			object.style.left = ((e.pageX - Global.mouseDownPosition.x) / Global.screenScale + Global.objectLastStatus.x) + "px";
			object.style.top = ((e.pageY - Global.mouseDownPosition.y) / Global.screenScale + Global.objectLastStatus.y) + "px";
	
			Update.updateEditor(Config.enableStyles, object);
		}
	};
	```
- 注意二：在使用 ondrag 时要注意，松开鼠标时，pageX 和 pageY 会归零，导致计算错误。应使用 `if(e.pageX == 0 && e.pageY == 0){return;}` 来消除特殊情况。
- 
## Notes for members
### 2017.03.09
1. 将组件文字居中实现方法由~~通过 `lineHeight` 设置~~ 改为**通过 `flex` 设置**。
2. 结合 `Vue.js` 重构 Platform。

### 未知时间:
1. 修复了多选时不能取消选择的bug
2. 修复了编辑器生成的bug
3. 对单Object的约束作了输入框的动态更新和与json的数值绑定。但是由于json还没有做，因此只写了逻辑伪代码。
4. 下一步要需要实现json的生成、单约束的计算、多约束的更新、多约束的计算。
