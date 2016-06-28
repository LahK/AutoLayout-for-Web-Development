// var test = document.getElementById("Test");
// var fontSize = "serif 12px"
// test.style.fontSize = fontSize;
// var height = (test.clientHeight + 1) + "px";
// var width = (test.clientWidth + 1) + "px";

// console.log(height);
// console.log(width);

function setLabelAlignmentWithRadios() {
	var radios = document.getElementsByName("label-alignment");
	var prev = null;
	for(var i = 0; i < radios.length; i++) {
	    radios[i].onclick = function() {
	        // (prev)? console.log(prev.value):null;
	        if(this !== prev) {
	            prev = this;
	        }
	        console.log(this.value);

			var Label = document.getElementById("Label");
			Label.style.textAlign = this.value;
	    };
	}
}

var labelType = "multiple";
function setLabelTypeWithRadios() {
	var radios = document.getElementsByName("label-type");
	var prev = null;
	for(var i = 0; i < radios.length; i++) {
	    radios[i].onclick = function() {
	        // (prev)? console.log(prev.value):null;
	        if(this !== prev) {
	            prev = this;
	        }
	        console.log(this.value);

			labelType = this.value;
	    };
	}
}

// 需要注意：
// 当 Label 的 css 样式发生改变时
// (宽高、行高、字占位等)
// 应触发 redrawLabel 函数
// 

function onInputEvent(event) {
	redrawLabel(event.target.value);
}

function redrawLabel(eventTargetValue) {

	var testTextDiv = document.getElementById("Test");
	var fontSize = "serif 12px";
	testTextDiv.style.font = fontSize;

	var text = eventTargetValue

	testTextDiv.innerHTML = text;
	var textLength = text.length;
	var textHeight = testTextDiv.clientHeight;
	var textWidth = testTextDiv.clientWidth;

	console.log("textHeight: "+textHeight);
	console.log("textWidth: "+textWidth);

	var Label = document.getElementById("Label");
	var LabelStyle = window.getComputedStyle(Label);
	var LabelHeight = LabelStyle.height.substring(0, LabelStyle.height.length - 2) / 1;
	var LabelWidth = LabelStyle.width.substring(0, LabelStyle.width.length - 2) / 1;

	console.log("LabelHeight: "+LabelHeight);
	console.log("LabelWidth: "+LabelWidth);

	var maxLineCountInLabel = Math.ceil(LabelHeight / textHeight);
	var lineCount = textWidth / LabelWidth;
	var lineCountCeil = Math.ceil(lineCount);

	console.log("maxLineCountInLabel: "+maxLineCountInLabel);
	console.log("lineCount: "+lineCount);

	var maxCharCount = text.length * lineCountCeil / lineCount;
	var maxCharCountPerLine = Math.floor(maxCharCount / Math.ceil(lineCount));

	console.log("textLength: "+textLength);
	console.log("lineCount: "+lineCount);
	console.log("lineCountCeil: "+lineCountCeil);
	console.log("maxCharCount: "+maxCharCount);
	console.log("maxCharCountPerLine: "+maxCharCountPerLine);

	var labelText = "";

	if (labelType == "single") {
		var shouldHideOverflow = textLength > maxCharCountPerLine;
		if (shouldHideOverflow) {
			labelText += text.substring(0, maxCharCountPerLine - 2) + "...";
		} else {
			labelText += text;
		}

		Label.style.lineHeight = LabelHeight + "px";
	} else if (labelType == "multiple") {	
		var displayLineCount = lineCountCeil < maxLineCountInLabel ? lineCountCeil : maxLineCountInLabel;
		var shouldHideOverflow = lineCountCeil > maxLineCountInLabel;
		console.log("shouldHideOverflow: "+shouldHideOverflow);
		for (var i = 1; i <= displayLineCount; i++) {
			if (i < displayLineCount) {
				labelText += text.substring(maxCharCountPerLine*(i-1), maxCharCountPerLine*i) + "<br>"
			} else {
				if (shouldHideOverflow) {
					labelText += text.substring(maxCharCountPerLine*(i-1), maxCharCountPerLine*i - 2) + "...";
				} else {
					labelText += text.substring(maxCharCountPerLine*(i-1));
				}
			}
		}
		Label.style.lineHeight = "inherit";
	}

	console.log(labelText)
	Label.innerHTML = labelText;
}

function onPropChangedEvent(event) {
	// body...
}

setLabelAlignmentWithRadios();
setLabelTypeWithRadios();