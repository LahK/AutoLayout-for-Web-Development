'use strict';
define(["require"], function(require) {
	let button = document.createElement('div');
	button.className = 'AL-object AL-button';
	button.setAttribute('al-text', 'Button');
	button.innerText = 'Button';

	return button;
})