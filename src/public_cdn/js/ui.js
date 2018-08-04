'use strict';

/*
* autoCollapse(id) - Set an event to collapse cards
*
* @requires id string to be id of element
*/
function autoCollapse(id) {
	var btn = $$('#' + id + 'Btn');
	btn.onClick(function() {
		$$('#' + id).toggleClass('show');
		btn.toggleClass('collapsed');
		if (btn.html() == 'Less options') {
			btn.html('More options');
		} else btn.html('Less options');
	});
}

/*
* applyToAll(fn, obj) - Apply function to all objects
*
* @requires fn function to apply
* @requires obj array of a 2 elents array [[id, param],[id, param]]
*/
function applyToAll(fn, obj) {
	for (var i = obj.length - 1; i >= 0; i--) {
		fn(obj[i][0], obj[i][1]);
	}
}

$$().ready(function() {
	// Auto Collapse
	autoCollapse('opt');
});