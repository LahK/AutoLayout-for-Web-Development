'use strict';
define(function() {
	var Global = {

		lastId: 0, // 当前已用最大Id
		trimScreen: false, // 是否裁剪屏幕

		currentSelected: null, // 被选中的节点(Object or Screen)

		mouseOver: null, // 鼠标当前所在的元素
		mouseDownPosition: { x: 0, y: 0 }, // 鼠标单击时的位置
		keyDown: null, // 按下的键值

		screenLastStatus: { x: 50, y: 50, w: 414, h: 736 }, // Screen被选中时的状态
		screenMoving: false, // Screen当前是否在移动
		screenScale: 1, // Screen的缩放比例

		objectLastStatus: { x: 0, y: 0, w: 0, h: 0 }, // Object被选中时的状态
		objectMoving: false, // Object是否在移动
		objectCount: 0, // 当前的元素个数
		objectResizing: false,

		layerSelected: null, // 被选中的Layer
		layerMoving: false, // Layer是否在移动

		objectList :[],
		multipleSelect: false,

		canvasArea: document.getElementById('canvasArea'),
		screenArea: document.getElementById('screenArea'),
		scaleSmallBtn: document.getElementById("scaleSmall"),
		scaleLargeBtn: document.getElementById("scaleLarge"),
		scaleStatusSpan: document.getElementById("scaleStatus"),

		symbolList: document.querySelectorAll(".module-symbol"),
		layerList: document.getElementById('layerList'),

		getLastId: function () {
			return this.lastId ++;
		}

	};

	return Global;
})
