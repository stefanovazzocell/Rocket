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