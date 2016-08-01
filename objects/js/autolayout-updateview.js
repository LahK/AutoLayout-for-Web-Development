// 需要在 autolayout.js 中初始化：AutoLayout.updateview = {};

// updateview 用于对象属性发生变化时，重新绘制对象
AutoLayout.updateview = function(element) {
	var _type = element.getAttribute("al-type");
	var _id = element.id;

	if (_type == "Button") {

	}
	
	if (_type == "Image") {

		var ImageDiv = element;
		var ImageDivStyle = window.getComputedStyle(ImageDiv);
		var Image = element.children[_id+"-IMG"];
		var ImageImageStyle = window.getComputedStyle(Image);
		console.log(ImageDiv);
		console.log(Image);

		var ImageMode = ImageDiv.getAttribute("al-mode");

		var imageDivWidthPX = ImageDivStyle.width;
		var imageDivHeightPX = ImageDivStyle.height;
		console.log("imageDivWidthPX: "+imageDivWidthPX);
		console.log("imageDivHeightPX: "+imageDivHeightPX);
		var imageDivWidth = imageDivWidthPX.substring(0, imageDivWidthPX.length - 2);
		var imageDivHeight = imageDivHeightPX.substring(0, imageDivHeightPX.length - 2);
		console.log("imageDivWidth: "+imageDivWidth);
		console.log("imageDivHeight: "+imageDivHeight);

		var imageNaturalWidth = Image.naturalWidth;
		var imageNaturalHeight = Image.naturalHeight;
		console.log("imageNaturalWidth: "+imageNaturalWidth);
		console.log("imageNaturalHeight: "+imageNaturalHeight);

		var imageDivRatio = imageDivWidth / imageDivHeight;
		var imageImageRatio = imageNaturalWidth / imageNaturalHeight;
		console.log("imageDivRatio: "+imageDivRatio);
		console.log("imageImageRatio: "+imageImageRatio);

		if (ImageMode == "Scale To Fill") {
			Image.style.width = imageDivWidthPX;
			Image.style.height = imageDivHeightPX;
		} else if (ImageMode == "Aspect Fit") {
			if (imageImageRatio < imageDivRatio) {
				Image.style.width = imageDivHeight * imageImageRatio + "px";
				Image.style.height = imageDivHeightPX;
			} else {
				Image.style.width = imageDivWidthPX;
				Image.style.height = imageDivWidth / imageImageRatio + "px";
			}
		} else if (ImageMode == "Aspect Fill") {
			if (imageImageRatio >= imageDivRatio) {
				Image.style.width = imageDivHeight * imageImageRatio + "px";
				Image.style.height = imageDivHeightPX;
			} else {
				Image.style.width = imageDivWidthPX;
				Image.style.height = imageDivWidth / imageImageRatio + "px";
			}
		}
		console.log(Image.style);
		var imageFinalWidthPX = Image.style.width;
		var imageFinalHeightPX = Image.style.height;
		console.log("imageFinalWidthPX: "+imageFinalWidthPX);
		console.log("imageFinalHeightPX: "+imageFinalHeightPX);

		var imageFinalWidth = imageFinalWidthPX.substring(0, imageFinalWidthPX.length - 2);
		var imageFinalHeight = imageFinalHeightPX.substring(0, imageFinalHeightPX.length - 2);
		console.log("imageFinalWidth: "+imageFinalWidth);
		console.log("imageFinalHeight: "+imageFinalHeight);

		var widthDifference = imageFinalWidth - imageDivWidth;
		var heightDifference = imageFinalHeight - imageDivHeight;
		console.log("widthDifference: "+widthDifference);
		console.log("heightDifference: "+heightDifference);

		// reset margin
		Image.style.marginLeft = "";
		Image.style.marginTop = "";

		console.log((widthDifference > 0 ? "-" : "") + Math.abs(widthDifference) / 2 + "px");
		Image.style.marginLeft = (widthDifference > 0 ? "-" : "") + Math.abs(widthDifference) / 2 + "px";
		Image.style.marginTop = (heightDifference > 0 ? "-" : "") + Math.abs(heightDifference) / 2 + "px";
	}
	
	if (_type == "Label") {

		var Label = element;
		var LabelStyle = window.getComputedStyle(Label);
		var LabelHeight = LabelStyle.height.substring(0, LabelStyle.height.length - 2) / 1;
		var LabelWidth = LabelStyle.width.substring(0, LabelStyle.width.length - 2) / 1;
		var LabelType = Label.getAttribute("al-label-type");

		var LabelBR = document.getElementById(_id+"-BR");

		console.log("LabelType: "+LabelType);
		console.log("LabelHeight: "+LabelHeight);
		console.log("LabelWidth: "+LabelWidth);


		var testTextDiv = document.getElementById("Test");
		// testTextDiv.style.font = LabelStyle.font;

		var text = Label.getAttribute("al-text");
		console.log("text: "+text);

		testTextDiv.innerText = text;
		var textLength = text.length;
		var textHeight = testTextDiv.clientHeight;
		var textWidth = testTextDiv.clientWidth;

		console.log("textHeight: "+textHeight);
		console.log("textWidth: "+textWidth);


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

		if (LabelType == "single") {
			var shouldHideOverflow = textLength > maxCharCountPerLine;
			if (shouldHideOverflow) {
				labelText += text.substring(0, maxCharCountPerLine - 2) + "...";
			} else {
				labelText += text;
			}

			Label.style.lineHeight = LabelHeight + "px";
			LabelBR.style.marginTop = "0px";
		} else if (LabelType == "multiple") {	
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
			// console.log(LabelStyle);
			var labelHeight = LabelStyle.height;
			var labelHeightVal = labelHeight.substring(0, labelHeight.length - 2);
			var labelLineHeight = LabelStyle.lineHeight;
			var labelLineHeightVal = labelLineHeight.substring(0, labelLineHeight.length - 2);

			LabelBR.style.marginTop = (labelHeightVal/1 - labelLineHeightVal/1) + "px";
		}

		console.log(labelText)
		// Label.innerText = labelText;
		// Label.childNodes[0].nodeValue = labelText;

		// 需要添加不同组件的全局参数
		var _viewMinWidth = 5;
		var _viewMinHeight = 5;

		var LabelBRTemp = Label.lastChild;
		var lineHeight = LabelStyle.lineHeight;
		var lineHeightVal = lineHeight.substring(0, lineHeight.length - 2);
		var labelWidthVal = LabelStyle.width.substring(0, LabelStyle.width.length - 2);
		var labelHeightVal = LabelStyle.height.substring(0, LabelStyle.height.length - 2);
		// 每一个文本换行导致 div 实际高度增高一个行高，所以此处计算行数用于减去多余高度
		var displayLineCount = lineCountCeil < maxLineCountInLabel ? lineCountCeil : maxLineCountInLabel;
		console.log(displayLineCount);
		console.log(((_viewMinHeight > labelHeightVal ? _viewMinHeight : labelHeightVal ) - (lineHeightVal * displayLineCount)))
		LabelBRTemp.style.margin = ((_viewMinHeight > labelHeightVal ? _viewMinHeight : labelHeightVal ) - (lineHeightVal * displayLineCount)) + "px 0px 0px " + (_viewMinWidth > labelWidthVal ? _viewMinWidth : labelWidthVal ) + "px";

		// console.log(LabelBRTemp);
		Label.innerHTML = labelText;
		Label.appendChild(LabelBRTemp);


	}
	
	if (_type == "View") {

	}

}