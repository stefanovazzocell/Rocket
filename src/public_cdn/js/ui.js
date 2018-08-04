'use strict';

// Track for alertTimeout
var alertTimeout;
var selected = 'url';

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
* editNum(btnId, parameters) - Changes a given input based on:
* - given value
* - max/min
*
* @requires btnId string to be a valid btn id
* @requires parameters array to contain ['targetId', delta]
*/
function editNum(btnId, parameters) {
	// Set event
	$$('#' + btnId).onClick(function() {
		// Is days/hours?
		if (parameters[0] === 'Days' || parameters[0] === 'Hours') {
			// Get days and hours
			var deltaHours = (btnId === 'Days' ? parameters[1] * 24 : parameters[1])
			var targetDays = $$('#inputDays');
			var targetHours = $$('#inputHours');
			var newVal = deltaHours + parseInt(targetHours.val()) + 24 * parseInt(targetDays.val());
			var targetMax = targetDays.prop('max') * 24;
			var targetMin = targetHours.prop('min');
			// Check boundaries
			if (newVal > targetMax) newVal = targetMax;
			if (newVal < targetMin) newVal = targetMin;
			// Assign correct values
			targetDays.val(Math.floor(newVal / 24));
			targetHours.val(newVal - 24 * Math.floor(newVal / 24));
		} else {
			// Get values
			var target = $$('#input' + parameters[0]);
			var targetMax = parseInt(target.prop('max'));
			var targetMin = parseInt(target.prop('min'));
			var newVal = parameters[1] + parseInt(target.val());
			// Check boundaries
			if (newVal > targetMax) newVal = targetMax;
			if (newVal < targetMin) newVal = targetMin;
			// Assign correct value
			target.val(newVal);
		}
	});
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
	// Enable add/remove from val
	applyToAll(editNum, [['rem10C',['Clicks',-10]], // Clicks
						 ['rem1C',['Clicks',-1]],
						 ['add10C',['Clicks',+10]],
						 ['add1C',['Clicks',+1]],
						 ['rem1D',['Days',-24]], // Days
						 ['add1D',['Days',+24]],
						 ['rem1H',['Hours',-1]], // Hours
						 ['add1H',['Hours',+1]]]);
	// Hide the alert if clicked
	$$('#alert').onClick(hideAlert);
	// Show file name when image selected
	$$('#inputDataImage').event('change', function() {
		// Get info
		var value = $$('#inputDataImage').val();
		value = value.split(/(\\|\/)/g).pop();
		var inputImageFile = $$('#inputDataImage').first().files[0];
		var fileSize = inputImageFile.size;
		// Process image
		if (value && fileSize > 70000) {
			// If too big
			$$('#inputDataImage').val('');
			value = 'error: image too big';
			$$('#preview').prop('src','');
			msg('The image is too big (' + Math.round(fileSize / 50000) + 'x the max)');
		} else if (value) {
			// Try to read
			try {
				var reader = new FileReader();
				reader.onloadend = function() {
					if (reader.result.length > 50000) {
						// If too big
						$$('#inputDataImage').val('');
						value = 'error: image too big';
						$$('#preview').prop('src','');
						msg('The image is too big (' + Math.round(fileSize / 50000) + 'x the max)');
					} else {
						$$('#preview').prop('src',reader.result);
					}
				}
				reader.readAsDataURL(inputImageFile);
			} catch (err) {
				console.log(err);
				msg('Your browser doesn\'t support this feature');
			}
		} else {
			// Nothing selected
			$$('#preview').prop('src','');
		}
		$$('#labelImage').html(value);
	});
	// Handle tab switching
	$$('.tabSwitch').onClick(function() {
		// Clear all
		$$('.tabSwitch').removeClass('active');
		applyToAll(function(elem) {
			$$('#' + elem + 'Data').addClass('hidden');
		}, ['url', 'text', 'img']);
		// If img disable special features
		selected = this.getAttribute('for');
		if (selected === 'img') {
			$$('.hideIfBig').style('display', 'none');
		} else {
			$$('.hideIfBig').style('display', 'initial');
		}
		// Activate
		this.classList.add('active');
		$$('#' + selected + 'Data').removeClass('hidden');
	});
});