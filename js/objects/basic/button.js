'use strict';
define(["require"], function(require) {
	let button = document.createElement('div');
	button.className = 'AL-object AL-button';
	button.setAttribute('al-text', 'Button');
	button.setAttribute("al-type", 'Button');
	let text = document.createElement('text');
	text.innerText = 'Button';

	button.appendChild(text);

	return button;
})