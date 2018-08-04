'use strict';

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

$$().ready(function() {
	autoCollapse('opt');
});