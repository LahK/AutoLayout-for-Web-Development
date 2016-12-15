'use strict';
define(["require"], function(require) {
    return function() {
        let view = document.createElement('div');
        view.className = 'AL-object AL-view';
        view.setAttribute("al-type", 'view');

        return view;
    }
})
