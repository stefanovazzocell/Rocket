'use strict';

var selected = 'url';
var imgRender = '';
var baseUrl = 'http://localhost/public_html/';

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
						imgRender = reader.result;
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
	$$('.tabSwitch').onClick(function(event) {
		// Prevent default
		event.preventDefault();
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
	// Handle Create
	$$('#create').onClick(function() {
		// Hide UI while computing
		$$('#uiMakeLink').addClass('hidden');
		// Pick the data
		var data = $$('#inputDataUrl').val();
		if (selected == 'text') data = $$('#inputDataText').val();
		if (selected == 'img') data = imgRender;
		// Call helper
		apiSet(function(status) {
				if (status) {
					// Load link
					$$('#newLink').val(baseUrl +
						($$('#optStats').first().checked ? 'track/' : '') +
						'#' + $$('#inputLink').val());
					// Show UI
					$$('#uiNewLink').removeClass('hidden');
				} else {
					// If faild, fall back to 'make' UI
					$$('#uiMakeLink').removeClass('hidden');
				}
			},
			data,
			$$('#inputLink').val(),
			selected,
			parseInt($$('#inputClicks').val()),
			parseInt($$('#inputHours').val()) + 24 * parseInt($$('#inputDays').val()),
			($$('#optPassword').first().checked ? $$('#optPasswordVal').val() : false),
			($$('#optDel').first().checked ? $$('#optDelVal').val() : false),
			($$('#optEdit').first().checked ? $$('#optEditVal').val() : false),
			($$('#optStats').first().checked ? $$('#optStatsVal').val() : false),
			(selected == 'img'));		
	});
	// Copy link
	$$('#copy').onClick(function() {
		var toSelect = $$('#newLink').first();
		toSelect.setSelectionRange(0, toSelect.value.length);
		toSelect.select();
		document.execCommand("copy");
	});
	// Close new link ui
	$$('#close').onClick(function() {
		// Show UI
		$$('#uiMakeLink').removeClass('hidden');
		$$('#uiNewLink').addClass('hidden');
	});
});