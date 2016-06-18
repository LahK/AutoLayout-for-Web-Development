
// mode = Scale To Fill / Aspect Fit / Aspect Fill
var mode = "Aspect Fill";


function getImageDiv() {
	var ImageDiv = document.getElementById("Image-Container");
	return ImageDiv
}

function getImageImage() {
	var Image = document.getElementById("Image-Image");
	return Image
}

function updateURLForImage(event) {
	var url = event.target.value;
	redrawImage(url);
}

function redrawImage(url) {
	var ImageDiv = getImageDiv();
	var ImageDivStyle = window.getComputedStyle(ImageDiv);
	var Image = getImageImage();
	var ImageImageStyle = window.getComputedStyle(Image);
	console.log(ImageDiv);
	console.log(Image);
	Image.src = url;

	Image.onload = function() {
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

		if (mode == "Scale To Fill") {
			Image.style.width = imageDivWidthPX;
			Image.style.height = imageDivHeightPX;
		} else if (mode == "Aspect Fit") {
			if (imageImageRatio < imageDivRatio) {
				Image.style.width = imageDivHeight * imageImageRatio + "px";
				Image.style.height = imageDivHeightPX;
			} else {
				Image.style.width = imageDivWidthPX;
				Image.style.height = imageDivWidth / imageImageRatio + "px";
			}
		} else if (mode == "Aspect Fill") {
			if (imageImageRatio >= imageDivRatio) {
				Image.style.width = imageDivHeight * imageImageRatio + "px";
				Image.style.height = imageDivHeightPX;
			} else {
				Image.style.width = imageDivWidthPX;
				Image.style.height = imageDivWidth / imageImageRatio + "px";
			}
		}
		var imageFinalWidthPX = Image.style.width;
		var imageFinalHeightPX = Image.style.height;
		console.log("imageFinalWidthPX: "+imageFinalWidth);
		console.log("imageFinalHeightPX: "+imageFinalHeight);

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


}

function updateWidthForImage(event) {
	var newWidth = event.target.value;

	var ImageDiv = getImageDiv();
	ImageDiv.style.width = newWidth + "px";
}

function updateHeightForImage(event) {
	var newHeight = event.target.value;

	var ImageDiv = getImageDiv();
	ImageDiv.style.height = newHeight + "px";
}