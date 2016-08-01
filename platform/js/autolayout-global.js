'use strict';
define(function() {
	var Global = {

		lastId: 0, // 当前已用最大Id
		trimScreen: false, // 是否裁剪屏幕

		currentSelected: null, // 被选中的节点(Object or Screen)

		mouseOver: null, // 鼠标当前所在的元素
		mouseDownPosition: { x: 0, y: 0 }, // 鼠标单击时的位置
		keyDown: null, // 按下的键值

		screenLastPosition: { x: 50, y: 50 }, // Screen被选中时的位置
		screenMoving: false, // Screen当前是否在移动
		screenSize: { w: 414, h: 736 }, // Screen的大小
		screenScale: 1, // Screen的缩放比例

		objectLastPosition: { x: 0, y: 0 }, // Object被选中时的位置
		objectMoving: false, // Object是否在移动
		objectCount: 0, // 当前的元素个数

		layerSelected: null, // 被选中的Layer
		layerMoving: false, // Layer是否在移动

		objectList :{},

		canvasArea: document.getElementById('canvasArea'),
		screenArea: document.getElementById('screenArea'),
		scaleSmallBtn: document.getElementById("scaleSmall"),
		scaleLargeBtn: document.getElementById("scaleLarge"),
		scaleStatusSpan: document.getElementById("scaleStatus"),
		layerList: document.getElementById('layerList'),
		attributesEditor: document.getElementById('attributesEditor'),
	};

	return Global;
})
