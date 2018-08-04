'use strict';

var selected = 'stats';

// When page ready start functions
$$().ready(function() {
	// Enable checkboxes
	applyToAll(toggleInput, [['Clicks',[]],['Url',['Text']],['Text',['Url']]]);
	// Handle tab switching
	$$('.tabSwitch').onClick(function(event) {
		// Prevent default
		event.preventDefault();
		// Check if active
		if (! event.target.classList.contains('disabled')) {
			// Clear all
			$$('.tabSwitch').removeClass('active');
			applyToAll(function(elem) {
				$$('#' + elem + 'Tab').addClass('hidden');
			}, ['stats', 'del', 'edit']);
			// Update selected
			selected = this.getAttribute('for');
			// Activate
			this.classList.add('active');
			$$('#' + selected + 'Tab').removeClass('hidden');
		}
	});
});