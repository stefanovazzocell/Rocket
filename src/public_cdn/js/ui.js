'use strict';

// Track for alertTimeout
var alertTimeout;

/*
* autoCollapse(id) - Set an event to collapse cards
*
* @requires id string to be id of element
*/
function autoCollapse(id) {
	// Get btn
	var btn = $$('#' + id + 'Btn');
	// Set event
	btn.onClick(function() {
		// Toggle classes
		$$('#' + id).toggleClass('show');
		btn.toggleClass('collapsed');
	});
}

/*
* hideAlert() - Hides an alert and stops the timer
*/
function hideAlert() {
	// Remove previous timer
	clearTimeout(alertTimeout);
	// Hide the alert
	$$('#alert').addClass('hidden');
	$$('#alert').removeClass('show');
}

/*
* msg(message) - Show an alert
*
* @requires message string to be message to show
*/
function msg(message) {
	// Log to console
	console.log(message);
	// Reset alert
	hideAlert();
	// Set alert message
	$$('#alert').html(message);
	// Show alert
	$$('#alert').addClass('show');
	$$('#alert').removeClass('hidden');
	// Hiden the alert after 5 seconds
	alertTimeout = setTimeout(hideAlert, 5000);
}

/*
* applyToAll(fn, obj) - Apply function to all objects
*
* @requires fn function to apply
* @requires obj array of a 2 elents array [[, ],[, ]] or strings [,]
*/
function applyToAll(fn, obj) {
	// For each element in the array
	for (var i = obj.length - 1; i >= 0; i--) {
		// Call function
		if (typeof obj[i] === 'string') {
			fn(obj[i]);
		} else {
			fn(obj[i][0], obj[i][1]);
		}
	}
}

/*
* toggleInput(id, forceClose) - set an event to toggle a password option and force closes others 
*
* @requires id string to be id of element
* @requires forceClose array of string id to be closed
*/
function toggleInput(id, forceClose) {
	// Get btn
	var btn = $$('#opt' + id);
	// Set event
	btn.event('change', function() {
		// Check if is checked
		if (btn.first().checked) {
			// Enabled
			$$('#opt' + id + 'Pass').first().disabled = false;
			// Close others
			applyToAll(function(elem) {
				$$('#opt' + elem).first().checked = false;
				$$('#opt' + elem + 'Pass').first().disabled = true;
			}, forceClose);
		} else {
			// Disable
			$$('#opt' + id + 'Pass').first().disabled = true;
		}
	});
}

// When page ready start functions
$$().ready(function() {
	// Auto Collapse options
	autoCollapse('opt');
	// Enable checkboxes
	applyToAll(toggleInput, [['Password',[]],['Edit',['Stats']],['Del',[]],['Stats',['Edit']]]);
	// Hide the alert if clicked
	$$('#alert').onClick(hideAlert);
});