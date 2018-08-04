'use strict';

var selected = 'stats';

/*
* showStats(values) - Shows the stats for each country
*
* @requires values object { "??": 1 }
*/
function showStats(values = {}) {
	var countries = Object.keys(values);
	var sum = 0;
	var htmlList = '';
	// Get the html ready
	for (var i = countries.length - 1; i >= 0; i--) {
		sum += values[countries[i]];
		htmlList += '<li class="list-group-item d-flex justify-content-between align-items-center">';
		if (countries[i] == '??') {
			htmlList += 'N/A';
		} else if (countries[i] == 'XX') {
			htmlList += 'Unknown';
		} else {
			htmlList += countries[i];
		}
		htmlList += '<span class="badge badge-primary badge-pill">' + values[countries[i]] + '</span></li>';
	}
	// Load the html
	$$('#countriesList').html(htmlList);
	// Update the map
	try {
		var map = $$('#worldMap').first().getSVGDocument();
		for (var i = countries.length - 1; i >= 0; i--) {
			if (countries[i] != '??' && countries[i] != 'XX') {
				var strength = (values[countries[i]]/sum) * 255;
				map.querySelector('[cc=' + countries[i].toLowerCase() + ']').style.fill = 'rgb(' + (255 - strength) + ',' + strength + ',255)';
			}
		}
	} catch (err) {
		msg('Couldn\'t paint the map');
	}
}

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