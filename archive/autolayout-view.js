var _viewMinWidth = 30;
var _viewMinHeight = 30;
var _viewMaxWidth = 500;
var _viewMaxHeight = 500;

var _isResizing = false;
var _currentResizingViewId = "";
var _originalWidth = 0;
var _originalHeight = 0;
var _isStartResizing = false;
var _originalPageX = 0;
var _originalPageY = 0;

function initView(viewId) {
	var View = document.getElementById(viewId);

	if (View) {
		// View.innerHTML += '<div class="View-Resize-Button View-Resize-Button-TL" id="'+viewId+'-TL"></div><div class="View-Resize-Button View-Resize-Button-TR" id="'+viewId+'-TR"></div><div class="View-Resize-Button View-Resize-Button-BL" id="'+viewId+'-BL"></div><div class="View-Resize-Button View-Resize-Button-BR" id="'+viewId+'-BR"></div>';
		View.innerHTML += '<div class="Autolayout-View View-Resize-Button View-Resize-Button-BR" id="'+viewId+'-BR" draggable="true"></div>';
		View.onclick = function (event) {
			console.log(event.target);
			viewOnclick(event);
		};
		document.body.onclick = function (event) {
			console.log(event.target);
			outsideViewOnclick(event);
		};

		var viewBRId = viewId+"-BR";
		var viewBR = document.getElementById(viewBRId);

		viewBR.ondragstart = function (event) {
			viewButtonOndragstart(event);
		}
		viewBR.ondrag = function (event) {
			viewButtonOndrag(event);
		}
		viewBR.ondragend = function (event) {
			viewButtonOndragend(event);
		}
		console.log("Init done");
	} else {
		console.log("Invaild View ID");
	}
}

function outsideViewOnclick(event) {
	// 当点击对象不是 View 时执行函数
	if (event.target.className.indexOf("Autolayout-View") == -1 ) {	
		console.log("outsideViewOnclick");
		if (_isResizing) {
			_isResizing = false;
			hideViewBR(_currentResizingViewId);
			_currentResizingViewId = "";
			_originalPageX = 0;
			_originalPageY = 0;
		}
	}
}

function viewOnclick(event) {
	// 当点击对象不是拖动按钮时执行函数
	if (event.target.className.indexOf("View-Resize-Button") == -1) {
		console.log("viewOnclick");
		var View = event.target;
		var ViewStyle = window.getComputedStyle(View)
		var viewId = event.target.id;
		_isResizing = true;
		_currentResizingViewId = viewId;

		_originalWidth = ViewStyle.width.substring(0, ViewStyle.width.length-2);
		_originalHeight = ViewStyle.height.substring(0, ViewStyle.height.length-2);
		console.log("_originalWidth: "+_originalWidth);
		console.log("_originalHeight: "+_originalHeight);

		showViewBR(viewId);
	}
}

function showViewBR(viewId) {
	console.log("showViewBR");
	var viewBRId = viewId + "-BR";

	var viewBR = document.getElementById(viewBRId);
	viewBR.style.display = "inherit";
}

function hideViewBR(viewId) {
	console.log("hideViewBR");
	var viewBRId = viewId + "-BR";

	var viewBR = document.getElementById(viewBRId);
	viewBR.style.display = "none";
}

function viewButtonMousedown(event) {
}

function viewButtonMousemove(event) {
}

function viewButtonMouseUp(event) {
}

function viewButtonOndragstart(event) {
	console.log("viewButtonOndragstart");
	var pageX = event.pageX;
	var pageY = event.pageY;
	console.log("pageX:"+pageX);
	console.log("pageY:"+pageY);

	_originalPageX = pageX;
	_originalPageY = pageY;
	console.log("_originalPageX: "+_originalPageX);
	console.log("_originalPageY: "+_originalPageY);

	_isStartResizing = true;
}

function viewButtonOndrag(event) {
	console.log("viewButtonOndrag");
	var pageX = event.pageX;
	var pageY = event.pageY;
	console.log("pageX:"+pageX);
	console.log("pageY:"+pageY);

	if (_isStartResizing && pageX && pageY) {
		var offsetX = pageX - _originalPageX;
		var offsetY = pageY - _originalPageY;
		console.log("offsetX: "+offsetX);
		console.log("offsetY: "+offsetY);

		var View = getViewById(_currentResizingViewId);
		var newWidth = (_originalWidth / 1 + offsetX / 1);
		var newHeight = (_originalHeight / 1 + offsetY / 1);
		console.log("newWidth: "+newWidth);
		console.log("newHeight: "+newHeight);
		View.style.width = (_viewMinWidth > newWidth ? _viewMinWidth : newWidth ) + "px";
		View.style.height = (_viewMinWidth > newHeight ? _viewMinWidth : newHeight ) + "px";
		console.log("View.style.width: "+View.style.width);
		console.log("View.style.height: "+View.style.height);
	}
}

function viewButtonOndragend(event) {
	console.log("viewButtonOndragend");
	var pageX = event.pageX;
	var pageY = event.pageY;
	console.log("pageX:"+pageX);
	console.log("pageY:"+pageY);

	var offsetX = pageX - _originalPageX;
	var offsetY = pageY - _originalPageY;
	console.log("offsetX: "+offsetX);
	console.log("offsetY: "+offsetY);

	// 更新当前 View 宽高原始值
	var View = getViewById(_currentResizingViewId);
	var ViewStyle = window.getComputedStyle(View);
	_originalWidth = ViewStyle.width.substring(0, ViewStyle.width.length-2);
	_originalHeight = ViewStyle.height.substring(0, ViewStyle.height.length-2);
	console.log("Updated _originalWidth: "+_originalWidth);
	console.log("Updated _originalHeight: "+_originalHeight);

	// 这两个归零可以不用
	// _originalPageX = 0;
	// _originalPageY = 0;
	_isStartResizing = false;
}

function getViewById(viewId) {
	return document.getElementById(viewId);
}

initView("View");
initView("Button");
































