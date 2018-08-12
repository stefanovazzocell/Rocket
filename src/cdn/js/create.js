'use strict';

var type = '';
var imgRender = '';

/*
* randomString(length) - Generates a random string of given length
*
* @requires length Int to be the length of the string
*/
function randomString(length=10) {
	var out = "";
	// Removed: I l
	var pool = "ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz0123456789?/:@-._~!$&'()*+,;=";
	var random = undefined;

	for (var i = 0; i < length; i++) {
		try {
			random = (window.crypto.getRandomValues(new Uint8Array(1))[0]/255);
		} catch (err) {
			random = undefined;
		}
		// Check if not a valid number
		if (random === null || random === undefined || isNaN(random) || random > 1 || random < 0) {
			random = Math.random();
		}
		out += pool.charAt(Math.floor(random * pool.length));
		random = undefined;
	}

	return out;
}

/*
* resizeImg(file, source) - Resizes a given image
*
* @requires source String is image data
*/
function resizeImg(source) {
	// Hide form and alert the user
	$$('form').addClass('h');
	msg('Tuning the image, please wait...');
	// Create an image element
	var img = new Image();
	// Preparing variables
	var resize = 0;
	var size = 0;
	var minQuality = 0.3;
	var quality = minQuality;
	var previous = '';
	var current = '';
	// When teh image is loaded
	img.onload = function () {
		// Prepare a canvas
		var canvas = document.createElement('canvas');
		var ctx = canvas.getContext('2d');
		// Set the dimensions
		var width = img.width;
		var height = img.height;
		var original = height * width;
		canvas.width = width;
		canvas.height = height;
		// Prepare variables
		while (size <= 41100 && quality <= 1) {
			previous = current;
			ctx.clearRect(0, 0, width, height);
			ctx.drawImage(img, 0, 0, width, height);
			current = canvas.toDataURL('image/jpeg', quality);
			size = current.length;
			if (quality == minQuality && size > 41100) {
				resize += 1;
				// Cut the size
				width *= 0.8;
				height *= 0.8;
				canvas.width = width;
				canvas.height = height;
				size = 0;
			} else {
				quality += 0.01;
			}
		}
		msg('Image tuned: quality at ' + Math.round(quality * 100) + '%, and resized to ' + Math.round(100 * (width * height) / original) + '% the original size');
		// Show form
		$$('form').removeClass('h');
		// Save render
		imgRender = previous;
		// show Image
		$$('#preview').prop('src', previous);
	}
	img.src = source;
}

/*
* setInput(active) - Disables all inputs except for active one
*
* @requires active String to be id of input to activate
*/
function setInput(active) {
	// Disable all inputs
	$$('#url,#text,#img').each(function(x) {
		x.disabled = true;
	});
	// Enable specific input
	$$('#' + active).first().disabled = false;
	// Update type
	type = active;
}

$$().ready(function() {
	// Hide the alert on click
	$$('#alert').onClick(function() {
		closeAlert();
	});
	// Set a watch for tab change
	$$('.tabf').onClick(function(e) {
		e.preventDefault();
		// Get target
		var target = this.getAttribute('for');
		var allButtons = $$('.tabf');
		// If image
		if (target == 'img') {
			$$('.noImage').addClass('h');
		} else {
			$$('.noImage').removeClass('h');
		}
		// Change menu item
		allButtons.addClass('btn--gray');
		allButtons.removeClass('btn--blue');
		this.classList.remove('btn--gray');
		this.classList.add('btn--blue');
		// Change tab item
		$$('.tabt > div').addClass('h');
		$$('#' + target + '-tab').removeClass('h');
		// Disable all inputs but target
		setInput(target);
	});
	// Show extra when required
	$$('#showopt').onClick(function(e) {
		e.preventDefault();
		$$('#extras').toggleClass('h');
	});
	// Auto change vals
	$$('.change').onClick(function(e) {
		e.preventDefault();
		var target = $$('#' + this.getAttribute('data-target'));
		var change = parseInt(this.getAttribute('data-delta')) + parseInt(target.val());
		// Check boundaries
		if (change > target.prop('max')) {
			target.val(target.prop('max'));
		} else if (change < target.prop('min')) {
			target.val(target.prop('min'));
		} else {
			target.val(change)
		}
	});
	// Toggle an option
	$$('input[type="checkbox"]').event('change', function() {
		// Disable/Enable based on if this is checked
		var target = this.getAttribute('for');
		if (target !== null) $$('#' + target).first().disabled = !this.checked;
		if (target === 'edit' && $$('#optStats').first().checked) $$('#optStats').select();
		if (target === 'stats') {
			if (this.checked) {
				$$('#clicks').first().min = 10;
			} else {
				$$('#clicks').first().min = 1;
			}
			if ($$('#optEdit').first().checked) $$('#optEdit').select();
		}
	});
	// Show image when one is selected
	$$('#img').event('change', function() {
		// Check if image selected
		if ($$('#img').val().length < 3) {
			// Nothing selected
			$$('#preview').prop('src','');
			// Stop
			return;
		}
		// Get image
		var imgFile = $$('#img').first().files[0];
		// Try to read
		try {
			var reader = new FileReader();
			reader.onloadend = function() {
				if (reader.result.length > 41100) {
					// Too big
					if ($$('#autoresize').first().checked) {
						// Resize
						resizeImg(reader.result);
					} else {
						// reset
						$$('#img').val('');
						// Show a message
						msg('The image is too big (' + Math.round(reader.result.length / 411) + '%), try the auto resize');
					}
				} else {
					// Save render
					imgRender = reader.result;
					// Show result
					$$('#preview').prop('src',reader.result);
				}
			}
			reader.readAsDataURL(imgFile);
		} catch (err) {
			console.log(err);
			msg('Your browser doesn\'t support this feature');
		}
	});
	// Catch submit
	$$('form').event('submit', function(e) {
		// Prevent from reloading
		e.preventDefault();
		// Hide UI
		$$('form').addClass('h');
		closeAlert();
		// Pick the data
		var clicks = parseInt($$('#clicks').val())
		var hours = parseInt($$('#hours').val())
		var data = $$('#url').val();
		if (type == 'text') data = $$('#text').val();
		if (type == 'img') {
			data = imgRender;
			clicks = 1;
			hours = 1;
		}
		// Call helper
		apiSet(function(status) {
				if (status) {
					// Load link
					$$('#final').val(baseUrl +
						($$('#stats').first().checked ? 'track/' : '') +
						$$('#link').val());
					// Load other things to remember
					var remember = '';
					if ($$('#optPassword').first().checked) remember += 'Your link password is <code>' + $$('#password').val() + '</code>';
					if ($$('#optDel').first().checked && $$('#del').val() !== '') remember += 'Your delete password is <code>' + $$('#del').val() + '</code>';
					if ($$('#optDel').first().checked && $$('#del').val() === '') remember += 'You have enabled public deletion';
					if ($$('#optEdit').first().checked) remember += 'Your edit password is <code>' + $$('#edit').val() + '</code>';
					if ($$('#optStats').first().checked && $$('#stats').val() !== '') remember += 'Your stats password is <code>' + $$('#stats').val() + '</code>';
					if ($$('#optStats').first().checked && $$('#stats').val() === '') remember += 'You have enabled public stats';
					$$('#remember').html(remember);
					// Show UI
					$$('.ready').removeClass('h');
				} else {
					// If no error logged, ask for new link
					msg('Link taken, try another link', false);
					// If faild, fall back to main UI
					$$('form').removeClass('h');
				}
			},
			data,
			$$('#link').val(),
			type,
			clicks,
			hours,
			($$('#optPassword').first().checked ? $$('#password').val() : false),
			($$('#optDel').first().checked ? $$('#del').val() : false),
			($$('#optEdit').first().checked ? $$('#edit').val() : false),
			($$('#optStats').first().checked ? $$('#stats').val() : false),
			(type == 'img'));	
	});
	// Copy link
	$$('#copy').onClick(function(e) {
		e.preventDefault();
		var toSelect = $$('#final').first();
		toSelect.setSelectionRange(0, toSelect.value.length);
		toSelect.select();
		document.execCommand("copy");
	});
	// Close new link ui
	$$('#close').onClick(function(e) {
		e.preventDefault();
		// Rnadom link
		$$('#link').val(randomString());
		// Show UI
		$$('form').removeClass('h');
		$$('.final').addClass('h');
	});
	// Generate random passwords
	$$('.random').onClick(function(e) {
		e.preventDefault();
		// Generate and set random password
		$$('#' + this.getAttribute('for')).val(randomString(30));
	})
	// Rnadom link
	$$('#link').val(randomString());
	// Setup inputs
	setInput('url');
	// Disable uneccessary inputs
	$$('.disOnStart').each(function(toDisable) {
		toDisable.disabled = true;
	});
});