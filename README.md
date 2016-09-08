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
