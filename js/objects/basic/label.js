'use strict';
define(["require"], function(require) {
    return function() {
        let label = document.createElement('div');
        label.className = 'AL-object AL-lable';
        label.setAttribute('al-text', 'Label');
        label.setAttribute("al-type", 'Label');

        let text = document.createElement('text');
        text.innerText = 'Label';

        label.appendChild(text);

        return label;
    }

})
