var templates = {
	"ALView": "<div></div>",
	"ALLabel": "<div></div>",
	"ALImage": "<div></div>",
	"ALButton": "<div></div>",
	"ALTextarea": "<div></div>",
	"ALInput": "<div></div>",
};

var data = {
	"objects": [
		{
			"type": "ALView",
			"name": "navBgView",
			"bg-color": "#99E1D9"
		}, 
		{
			"type": "ALLabel",
			"name": "navTitle",
			"value": "Auto Layout"
		}, 
		{
			"type": "ALImage",
			"name": "logoImg",
			"src": "https://avatars0.githubusercontent.com/u/19899232?v=3&s=200"
		}, 
		{
			"type": "ALTextarea",
			"name": "descText",
			"value": "AutoLayout for Web Page Development aims to provide frontend developers another(simple) way to get pages done."
		}, 
		{
			"type": "ALInput",
			"name": "emailInput",
			"placeholder": "e.g. example@lahk.tech"
		}, 
		{
			"type": "ALButton",
			"name": "subscribeBtn",
			"title": "Subscribe"
		}
	],
	"constraints": [
		{
			"item": "navBgView",
			"attribute": "height",
			"relatedBy": "equal",
			"toItem": "",
			"toAttribute": "",
			"multiplier": 1,
			"constant": 60,
		},
		{
			"item": "navBgView",
			"attribute": "leading",
			"relatedBy": "equal",
			"toItem": "",
			"toAttribute": "leading",
			"multiplier": 1,
			"constant": 0,
		},
		{
			"item": "navBgView",
			"attribute": "trailing",
			"relatedBy": "equal",
			"toItem": "",
			"toAttribute": "trailing",
			"multiplier": 1,
			"constant": 0,
		},
		{
			"item": "navBgView",
			"attribute": "top",
			"relatedBy": "equal",
			"toItem": "",
			"toAttribute": "top",
			"multiplier": 1,
			"constant": 0,
		},
		{
			"item": "navTitle",
			"attribute": "leading",
			"relatedBy": "equal",
			"toItem": "navBgView",
			"toAttribute": "leading",
			"multiplier": 1,
			"constant": 20,
		},
		{
			"item": "navTitle",
			"attribute": "centerY",
			"relatedBy": "equal",
			"toItem": "navBgView",
			"toAttribute": "centerY",
			"multiplier": 1,
			"constant": 0,
		},
		{
			"item": "navTitle",
			"attribute": "height",
			"relatedBy": "equal",
			"toItem": "",
			"toAttribute": "",
			"multiplier": 1,
			"constant": 40,
		},
		{
			"item": "logoImg",
			"attribute": "top",
			"relatedBy": "equal",
			"toItem": "navBgView",
			"toAttribute": "bottom",
			"multiplier": 1,
			"constant": 75,
		},
		{
			"item": "logoImg",
			"attribute": "centerX",
			"relatedBy": "equal",
			"toItem": "",
			"toAttribute": "centerX",
			"multiplier": 1,
			"constant": 0,
		},
		{
			"item": "logoImg",
			"attribute": "width",
			"relatedBy": "equal",
			"toItem": "",
			"toAttribute": "",
			"multiplier": 1,
			"constant": 300,
		},
		{
			"item": "logoImg",
			"attribute": "height",
			"relatedBy": "equal",
			"toItem": "logoImg",
			"toAttribute": "width",
			"multiplier": 1,
			"constant": 0,
		},
		{
			"item": "descText",
			"attribute": "top",
			"relatedBy": "equal",
			"toItem": "logoImg",
			"toAttribute": "bottom",
			"multiplier": 1,
			"constant": 45,
		},
		{
			"item": "descText",
			"attribute": "leading",
			"relatedBy": "equal",
			"toItem": "logoImg",
			"toAttribute": "leading",
			"multiplier": 1,
			"constant": 0,
		},
		{
			"item": "descText",
			"attribute": "trailing",
			"relatedBy": "equal",
			"toItem": "logoImg",
			"toAttribute": "trailing",
			"multiplier": 1,
			"constant": 0,
		},
		{
			"item": "descText",
			"attribute": "height",
			"relatedBy": "equal",
			"toItem": "logoImg",
			"toAttribute": "height",
			"multiplier": 1,
			"constant": 0,
		},
		{
			"item": "subscribeBtn",
			"attribute": "height",
			"relatedBy": "equal",
			"toItem": "",
			"toAttribute": "",
			"multiplier": 1,
			"constant": 25,
		},
		{
			"item": "subscribeBtn",
			"attribute": "width",
			"relatedBy": "equal",
			"toItem": "",
			"toAttribute": "",
			"multiplier": 1,
			"constant": 75,
		},
		{
			"item": "subscribeBtn",
			"attribute": "top",
			"relatedBy": "equal",
			"toItem": "descText",
			"toAttribute": "bottom",
			"multiplier": 1,
			"constant": 45,
		},
		{
			"item": "subscribeBtn",
			"attribute": "trailing",
			"relatedBy": "equal",
			"toItem": "descText",
			"toAttribute": "trailing",
			"multiplier": 1,
			"constant": 0,
		},
		{
			"item": "emailInput",
			"attribute": "top",
			"relatedBy": "equal",
			"toItem": "subscribeBtn",
			"toAttribute": "top",
			"multiplier": 1,
			"constant": 0,
		},
		{
			"item": "emailInput",
			"attribute": "bottom",
			"relatedBy": "equal",
			"toItem": "subscribeBtn",
			"toAttribute": "bottom",
			"multiplier": 1,
			"constant": 0,
		},
		{
			"item": "emailInput",
			"attribute": "leading",
			"relatedBy": "equal",
			"toItem": "descText",
			"toAttribute": "leading",
			"multiplier": 1,
			"constant": 0,
		},
		{
			"item": "emailInput",
			"attribute": "trailing",
			"relatedBy": "equal",
			"toItem": "subscribeBtn",
			"toAttribute": "leading",
			"multiplier": 1,
			"constant": -15,
		},
	]
}

var page = document.getElementById("page");
var objectNameList = [];

// get window width, and height
var winW, winH;
if (document.body && document.body.offsetWidth) {
 winW = document.body.offsetWidth;
 winH = document.body.offsetHeight;
}
if (document.compatMode=='CSS1Compat' &&
    document.documentElement &&
    document.documentElement.offsetWidth ) {
 winW = document.documentElement.offsetWidth;
 winH = document.documentElement.offsetHeight;
}
if (window.innerWidth && window.innerHeight) {
 winW = window.innerWidth;
 winH = window.innerHeight;
}

var pageAttributes = {
	"top": 0,
	"bottom": winH,
	"leading": 0,
	"trailing": winW,
	"centerX": winW / 2,
	"centerY": winH / 2,
	"width": winW,
	"height": winH
}


for (var i = 0; i < data.objects.length; i++) {
	var d = document.createElement('div');
	d.id = data.objects[i].name;
	d.setAttribute("AL-Type", data.objects[i].type);
	d.setAttribute("top", "");
	d.setAttribute("bottom", "");
	d.setAttribute("leading", "");
	d.setAttribute("trailing", "");
	d.setAttribute("centerX", "");
	d.setAttribute("centerY", "");
	d.setAttribute("width", "");
	d.setAttribute("height", "");

	d.style.position = "absolute";
	d.style.backgroundColor = "green";
	d.innerHTML = data.objects[i].name;

	page.appendChild(d);
	objectNameList.push(data.objects[i].name)
}

var constraintsToObjects = [];
for (var i = 0; i < data.constraints.length; i++) {
	var c = data.constraints[i]
	if (c.toItem === "") {
		var obj = document.getElementById(c.item)

		// console.log(obj);
		// console.log(c.attribute);
		// console.log(pageAttributes[c.toAttribute]);
		// console.log(c.multiplier);
		// console.log(c.constant);
		// console.log(pageAttributes[c.toAttribute]*c.multiplier+c.constant);

		if (c.toAttribute == "") {
			obj.setAttribute(c.attribute, c.constant);
		} else {
			console.log("to page");
			console.log(obj.id);
			console.log(c.toAttribute);
			console.log(pageAttributes[c.toAttribute]);
			console.log(c.multiplier);
			console.log(c.constant);
			console.log(pageAttributes[c.toAttribute]*c.multiplier+c.constant);
			obj.setAttribute(c.attribute, pageAttributes[c.toAttribute]*c.multiplier+c.constant);
		}
	} else {
		constraintsToObjects.push(c);
	}
}

function getAttributes(obj) {
	var attrs = {
		"top": obj.getAttribute("top"),
		"bottom": obj.getAttribute("bottom"),
		"leading": obj.getAttribute("leading"),
		"trailing": obj.getAttribute("trailing"),
		"centerX": obj.getAttribute("centerX"),
		"centerY": obj.getAttribute("centerY"),
		"width": obj.getAttribute("width"),
		"height": obj.getAttribute("height"),
	};
	return attrs;
}

var tt = 1;
while (constraintsToObjects.length > 0) {
// while (tt--) {
	var constraintsLeft = [];
	for (var i = 0; i < constraintsToObjects.length; i++) {
		var c = constraintsToObjects[i];

		var obj = document.getElementById(c.item);
		var toObj = document.getElementById(c.toItem);
		var toObjAttrs = getAttributes(toObj);

		var toAttr = c.toAttribute;
		var toAttrValue = "";
		if (toAttr == "top") {
			if (toObjAttrs.top != "") {
				toAttrValue = parseFloat(toObjAttrs.top);
			} else if (toObjAttrs.bottom != "" && toObjAttrs.height != "") {
				toAttrValue = parseFloat(toObjAttrs.bottom) - parseFloat(toObjAttrs.height);
			} else if (toObjAttrs.centerY != "" && toObjAttrs.height != "") {
				toAttrValue = parseFloat(toObjAttrs.centerY) - parseFloat(toObjAttrs.height) / 2;
			} else if (toObjAttrs.centerY != "" && toObjAttrs.bottom != "") {
				toAttrValue = parseFloat(toObjAttrs.centerY) - (parseFloat(toObjAttrs.bottom) - parseFloat(toObjAttrs.centerY)) ;
			}
		} else if (toAttr == "bottom") {
			if (toObjAttrs.bottom != "") {
				toAttrValue = parseFloat(toObjAttrs.bottom);
			} else if (toObjAttrs.top != "" && toObjAttrs.height != "") {
				toAttrValue = parseFloat(toObjAttrs.top) + parseFloat(toObjAttrs.height);
			} else if (toObjAttrs.centerY != "" && toObjAttrs.height != "") {
				toAttrValue = parseFloat(toObjAttrs.centerY) + parseFloat(toObjAttrs.height) / 2;
			} else if (toObjAttrs.centerY != "" && toObjAttrs.top != "") {
				toAttrValue = parseFloat(toObjAttrs.centerY) + (parseFloat(toObjAttrs.top) - parseFloat(toObjAttrs.centerY)) * 2 ;
			}
		} else if (toAttr == "leading") {
			if (toObjAttrs.leading != "") {
				toAttrValue = parseFloat(toObjAttrs.leading);
			} else if (toObjAttrs.trailing != "" && toObjAttrs.width != "") {
				toAttrValue = parseFloat(toObjAttrs.trailing) - parseFloat(toObjAttrs.width);
			} else if (toObjAttrs.centerX != "" && toObjAttrs.width != "") {
				toAttrValue = parseFloat(toObjAttrs.centerX) - parseFloat(toObjAttrs.width) / 2;
			} else if (toObjAttrs.centerX != "" && toObjAttrs.trailing != "") {
				toAttrValue = parseFloat(toObjAttrs.centerX) - (parseFloat(toObjAttrs.trailing) - parseFloat(toObjAttrs.centerX)) ;
			}
		} else if (toAttr == "trailing") {
			if (toObjAttrs.trailing != "") {
				toAttrValue = parseFloat(toObjAttrs.trailing);
			} else if (toObjAttrs.leading != "" && toObjAttrs.width != "") {
				toAttrValue = parseFloat(toObjAttrs.leading) + parseFloat(toObjAttrs.width);
			} else if (toObjAttrs.centerX != "" && toObjAttrs.width != "") {
				toAttrValue = parseFloat(toObjAttrs.centerX) + parseFloat(toObjAttrs.width) / 2;
			} else if (toObjAttrs.centerX != "" && toObjAttrs.leading != "") {
				toAttrValue = parseFloat(toObjAttrs.centerX) + (parseFloat(toObjAttrs.leading) - parseFloat(toObjAttrs.centerX)) * 2 ;
			}
		} else if (toAttr == "centerX") {
			if (toObjAttrs.centerX != "") {
				toAttrValue = parseFloat(toObjAttrs.centerX);
			} else if (toObjAttrs.leading != "" && toObjAttrs.width != "") {
				toAttrValue = parseFloat(toObjAttrs.leading) + parseFloat(toObjAttrs.width) / 2;
			} else if (toObjAttrs.trailing != "" && toObjAttrs.width != "") {
				toAttrValue = parseFloat(toObjAttrs.trailing) - parseFloat(toObjAttrs.width) / 2;
			}
		} else if (toAttr == "centerY") {
			if (toObjAttrs.centerY != "") {
				toAttrValue = parseFloat(toObjAttrs.centerY);
			} else if (toObjAttrs.top != "" && toObjAttrs.height != "") {
				toAttrValue = parseFloat(toObjAttrs.top) + parseFloat(toObjAttrs.height) / 2;
			} else if (toObjAttrs.bottom != "" && toObjAttrs.height != "") {
				toAttrValue = parseFloat(toObjAttrs.bottom) - parseFloat(toObjAttrs.height) / 2;
			}
		} else if (toAttr == "width") {
			if (toObjAttrs.width != "") {
				toAttrValue = parseFloat(toObjAttrs.width);
			} else if (toObjAttrs.leading != "" && toObjAttrs.trailing != "") {
				toAttrValue = parseFloat(toObjAttrs.trailing) - parseFloat(toObjAttrs.leading);
			} else if (toObjAttrs.trailing != "" && toObjAttrs.centerX != "") {
				toAttrValue = (parseFloat(toObjAttrs.trailing) - parseFloat(toObjAttrs.centerX))*2;
			} else if (toObjAttrs.leading != "" && toObjAttrs.centerX != "") {
				toAttrValue = (parseFloat(toObjAttrs.centerX) - parseFloat(toObjAttrs.leading))*2;
			}
		} else if (toAttr == "height") {
			if (toObjAttrs.height != "") {
				toAttrValue = parseFloat(toObjAttrs.height);
			} else if (toObjAttrs.top != "" && toObjAttrs.bottom != "") {
				toAttrValue = parseFloat(toObjAttrs.bottom) - parseFloat(toObjAttrs.top);
			} else if (toObjAttrs.bottom != "" && toObjAttrs.centerY != "") {
				toAttrValue = (parseFloat(toObjAttrs.bottom) - parseFloat(toObjAttrs.centerY))*2;
			} else if (toObjAttrs.top != "" && toObjAttrs.centerY != "") {
				toAttrValue = (parseFloat(toObjAttrs.centerY) - parseFloat(toObjAttrs.top))*2;
			}
		}

		if (toAttrValue !== "") {
			console.log(obj.id);
			console.log(c);
			console.log(toAttrValue);
			obj.setAttribute(c.attribute, toAttrValue*c.multiplier+c.constant);
		} else {
			console.log("No ToAttrValue");
			console.log(obj.id);
			console.log(c);
			console.log(toAttrValue);
			constraintsLeft.push(c);
		}
	}

	constraintsToObjects = constraintsLeft;
}

console.log(constraintsToObjects);


for (var i = objectNameList.length - 1; i >= 0; i--) {
	var obj = document.getElementById(objectNameList[i]);

	var objAttrs = getAttributes(obj);
	console.log(obj);
	console.log(objAttrs);

	if (objAttrs.top != "") {
		obj.style.top = objAttrs.top + "px";
	} else if (objAttrs.bottom != "" && objAttrs.height != "") {
		obj.style.top = parseFloat(objAttrs.bottom) - parseFloat(objAttrs.height) + "px";
	} else if (objAttrs.centerY != "" && objAttrs.height != "") {
		obj.style.top = parseFloat(objAttrs.centerY) - parseFloat(objAttrs.height) / 2 + "px";
	} else if (objAttrs.centerY != "" && objAttrs.bottom != "") {
		obj.style.top = parseFloat(objAttrs.centerY) - (parseFloat(objAttrs.bottom) - parseFloat(objAttrs.centerY)) + "px";
	}

	if (objAttrs.leading != "") {
		obj.style.left = objAttrs.leading + "px";
	} else if (objAttrs.trailing != "" && objAttrs.width != "") {
		obj.style.left = parseFloat(objAttrs.trailing) - parseFloat(objAttrs.width) + "px";
	} else if (objAttrs.centerX != "" && objAttrs.width != "") {
		obj.style.left = parseFloat(objAttrs.centerX) - parseFloat(objAttrs.width) / 2 + "px";
	} else if (objAttrs.centerX != "" && objAttrs.trailing != "") {
		obj.style.left = parseFloat(objAttrs.centerX) - (parseFloat(objAttrs.trailing) - parseFloat(objAttrs.centerX)) + "px";
	}

	if (objAttrs.width != "") {
		obj.style.width = objAttrs.width + "px";
	} else if (objAttrs.leading != "" && objAttrs.trailing != "") {
		obj.style.width = parseFloat(objAttrs.trailing) - parseFloat(objAttrs.leading) + "px";
	} else if (objAttrs.trailing != "" && objAttrs.centerX != "") {
		obj.style.width = (parseFloat(objAttrs.trailing) - parseFloat(objAttrs.centerX))*2 + "px";
	} else if (objAttrs.leading != "" && objAttrs.centerX != "") {
		obj.style.width = (parseFloat(objAttrs.centerX) - parseFloat(objAttrs.leading))*2 + "px";
	}

	if (objAttrs.height != "") {
		obj.style.height = objAttrs.height + "px";
	} else if (objAttrs.top != "" && objAttrs.bottom != "") {
		obj.style.height = parseFloat(objAttrs.bottom) - parseFloat(objAttrs.top) + "px";
	} else if (objAttrs.bottom != "" && objAttrs.centerY != "") {
		obj.style.height = (parseFloat(objAttrs.bottom) - parseFloat(objAttrs.centerY))*2 + "px";
	} else if (objAttrs.top != "" && objAttrs.centerY != "") {
		obj.style.height = (parseFloat(objAttrs.centerY) - parseFloat(objAttrs.top))*2 + "px";
	}
}





















