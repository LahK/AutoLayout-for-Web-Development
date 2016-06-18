// 需要在 autolayout.js 中初始化：AutoLayout.initView = {};

// 被选中的元素
AutoLayout.selectedObjects = [];

AutoLayout.initview = function(type, id) {
	console.log("AutoLayout.initview");
	console.log("type: "+type);

	THIS = this;

	var _id = "M-" + id;


	var _viewMinWidth = 30;
	var _viewMinHeight = 30;
	var _viewMaxWidth = 500;
	var _viewMaxHeight = 500;

	var _isResizing = false;
	console.log("onInit: _isResizing: "+_isResizing);
	var _originalWidth = 0;
	var _originalHeight = 0;
	var _isStartResizing = false;
	var _originalPageX = 0;
	var _originalPageY = 0;

    var newObjectDiv = document.createElement("div");
	var newObjectBR = document.createElement("div");
	var _view = null;
	var _viewStyle = {};
	var _viewBRId = _id + "-BR";
	var _viewBR = null;

	// init BR
    newObjectBR.className = "Autolayout-View View-Resize-Button View-Resize-Button-BR";
    newObjectBR.id = _viewBRId; 
    newObjectBR.setAttribute("draggable", "true");

	if (type == "Button") {
		// init Button element
	    newObjectDiv.className = "Autolayout-View Autolayout-View-Button";
	    newObjectDiv.id = _id; 
	    newObjectDiv.setAttribute("al-type", "Button");
	    newObjectDiv.setAttribute("al-id", id);
	    newObjectDiv.innerText = "Button";
	    newObjectDiv.appendChild(newObjectBR);

		_view = newObjectDiv;
		_viewStyle = window.getComputedStyle(_view);

		_viewBR = newObjectBR;
	}

	if (type == "Image") {

		// init Image div
	    newObjectDiv.className = "Autolayout-View Autolayout-View-Image";
	    newObjectDiv.id = _id; 
	    newObjectDiv.setAttribute("al-type", "Image");
	    newObjectDiv.setAttribute("al-id", id);
	    newObjectDiv.setAttribute("al-mode", "Aspect Fit");
	    newObjectDiv.appendChild(newObjectBR);

		_view = newObjectDiv;
		_viewStyle = window.getComputedStyle(_view, null);

		// init Image element
		var newImage = document.createElement("img")
	    newImage.className = "Autolayout-View View-Content-Image";
	    newImage.id = _id + "-IMG"
	    newImage.src = "https://z.wilddog.com/images/logo.svg";

	    newImage.onload = function () {
	    	AutoLayout.updateview(newImage.parentElement);
	    }

	    _view.appendChild(newImage);

		_viewBR = newObjectBR;

	}

	if (type == "Label") {
		_viewMinWidth = 5;
		_viewMixHeight = 5;

		// init Label element
	    newObjectDiv.className = "Autolayout-View Autolayout-View-Label";
	    newObjectDiv.id = _id; 
	    newObjectDiv.setAttribute("al-type", "Label");
	    newObjectDiv.setAttribute("al-id", id);
	    newObjectDiv.setAttribute("al-text", "Label");
	    newObjectDiv.setAttribute("al-label-type", "multiple");
	    newObjectDiv.innerText = "Label";
	    newObjectDiv.appendChild(newObjectBR);

		_view = newObjectDiv;
		_viewStyle = window.getComputedStyle(_view);

		_viewBR = newObjectBR;
	}

	if (type == "View") {

		// init View element
	    newObjectDiv.className = "Autolayout-View Autolayout-View-View";
	    newObjectDiv.id = _id; 
	    newObjectDiv.setAttribute("al-type", "View");
	    newObjectDiv.setAttribute("al-id", id);
	    newObjectDiv.appendChild(newObjectBR);

		_view = newObjectDiv;
		_viewStyle = window.getComputedStyle(_view);

		_viewBR = newObjectBR;
	}


	var getViewById = function(viewId) {
		return document.getElementById(viewId);
	}

	var outsideViewOnclick = function(event) {
		// 当点击对象不是 View 时执行函数
		if (event.target.className.indexOf("Autolayout-View") == -1 ) {	
			console.log("outsideViewOnclick");
			while(AutoLayout.selectedObjects.length > 0){
				hideViewBR(AutoLayout.selectedObjects.pop());
			}
			AutoLayout.selectedObjects = [];
			console.log(AutoLayout.selectedObjects);
			_originalPageX = 0;
			_originalPageY = 0;
		}
	}

	var viewOnclick = function(event) {
		// 当点击对象不是拖动按钮时执行函数
		if (event.target.className.indexOf("View-Resize-Button") == -1) {
			console.log("viewOnclick");

			// unclick other selected elements
			while(AutoLayout.selectedObjects.length > 0){
				hideViewBR(AutoLayout.selectedObjects.pop());
			}
			AutoLayout.selectedObjects.push(_viewBR);
			console.log(AutoLayout.selectedObjects);

			_originalWidth = _viewStyle.width.substring(0, _viewStyle.width.length-2);
			_originalHeight = _viewStyle.height.substring(0, _viewStyle.height.length-2);
			console.log("_originalWidth: "+_originalWidth);
			console.log("_originalHeight: "+_originalHeight);

			showViewBR();
		}
	}

	var showViewBR = function() {
		console.log("showViewBR");
		_viewBR.style.display = "inherit";
	}

	var hideViewBR = function(BRView) {
		// 参数为需要隐藏的 BR Element
		console.log("hideViewBR");
		BRView.style.display = "none";
	}

	var viewButtonOndragstart = function (event) {
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

	var viewButtonOndrag = function(event) {
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

			var newWidth = (_originalWidth / 1 + offsetX / 1);
			var newHeight = (_originalHeight / 1 + offsetY / 1);
			console.log("newWidth: "+newWidth);
			console.log("newHeight: "+newHeight);
			_view.style.width = (_viewMinWidth > newWidth ? _viewMinWidth : newWidth ) + "px";
			_view.style.height = (_viewMinWidth > newHeight ? _viewMinWidth : newHeight ) + "px";
			console.log("View.style.width: "+_view.style.width);
			console.log("View.style.height: "+_view.style.height);
			if (type == "Label") {
				var lineHeight = _viewStyle.lineHeight;
				var lineHeightVal = lineHeight.substring(0, lineHeight.length - 2);
				_viewBR.style.margin = ((_viewMinHeight > newHeight ? _viewMinHeight : newHeight ) - lineHeightVal) + "px 0px 0px " + (_viewMinWidth > newWidth ? _viewMinWidth : newWidth ) + "px";
			} else {
				_viewBR.style.margin = (_viewMinHeight > newHeight ? _viewMinHeight : newHeight ) + "px 0px 0px " + (_viewMinWidth > newWidth ? _viewMinWidth : newWidth ) + "px";
			}

			// redraw
			if (type == "Image") {
		    	AutoLayout.updateview(_view);
			}
		}
	}

	var viewButtonOndragend = function(event) {
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
		_originalWidth = _viewStyle.width.substring(0, _viewStyle.width.length-2);
		_originalHeight = _viewStyle.height.substring(0, _viewStyle.height.length-2);
		console.log("Updated _originalWidth: "+_originalWidth);
		console.log("Updated _originalHeight: "+_originalHeight);

		// 这两个归零可以不用
		// _originalPageX = 0;
		// _originalPageY = 0;
		_isStartResizing = false;

	}


	var initView = function() {
		if (_view) {
			// init _view
			_view.onclick = function (event) {
				console.log(event.target);
				viewOnclick(event);
			};
			document.body.onclick = function (event) {
				console.log(event.target);
				outsideViewOnclick(event);
			};

			// init _viewBR
			_viewBR.ondragstart = function (event) {
				viewButtonOndragstart(event);
			}
			_viewBR.ondrag = function (event) {
				viewButtonOndrag(event);
			}
			_viewBR.ondragend = function (event) {
				viewButtonOndragend(event);
			}
			console.log("Init Done");
		} else {
			console.log("Invaild View ID");
		}
	}

	var returnElement = function () {
		return _view;
	}

	initView();

	document.getElementById("container-test").appendChild(_view);
	console.log("_viewStyle.height: "+_viewStyle.height);

	// 此处有 trick
	var BRMarginTop = type == "Label" ? "0px" : _viewStyle.height;
	var BRMarginLeft = _viewStyle.width;
	_viewBR.style.margin = BRMarginTop + " 0px 0px " + BRMarginLeft;

	// 调用方法 return _view;
};