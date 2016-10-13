'use strict';
define(["require"], function(require) {
	let label = document.createElement('div');
	label.className = 'AL-object AL-lable';
	label.setAttribute('al-text', 'Label');
	label.innerText = 'Label';

	return label;
})