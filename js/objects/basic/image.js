'use strict';
define(["require"], function(require) {
	return function() {
		let image = document.createElement('div');
		image.className = 'AL-object AL-image';
		image.setAttribute("al-type", 'Image');

		console.log(image);
		return image;
	}
	// let image = document.createElement('div');
	// image.className = 'AL-object AL-image';
	// image.setAttribute("al-type", 'Image');

	// console.log(image);
	// return image;
})