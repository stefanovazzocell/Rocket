var encrypted_data;
var data;
var type;

/*
* showResults() - Shows the results of the API call 
*/
function showResults() {
	if (data === undefined) {
		// If has password, ask for it
		$$('form').removeClass('h');
	} else {
		// Load Data
		switch (type) {
			case 'url':
				// Try to fix URL
				if(!/^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(data)) data = "http://" + data;
				// Display
				$$('#url').val(data);
				$$('#isUrl').removeClass('h');
				break;
			case 'text':
				// Display
				$$('#text').val(data);
				$$('#isText').removeClass('h');
				break;
			case 'img':
				// If not matching standards
				// data:image/jpeg;base64,/
				if (data.startsWith('data:image/') == false) {
					// Protect the user (flush image)
					type = false;
					data = '';
					// Alert the user
					msg('Suspicious data; for safety, it has been removed');
				} else {
					$$('#isImg').removeClass('h');
				}
				break;
		}
		// If possible, show correct block
		if (type) $$('#' + type + 'Data').removeClass('hidden');
	}
}

$$().ready(function() {
	// Visit link
	$$('#visit').onClick(function(e) {
		try {
			var win = window.open($$('#url').val(), '_blank');
			win.focus();
			// Clear the current window (and don't store in history)
			window.location.replace('about:blank');
		} catch (err) {
			msg('Error - The link is not valid');
		}
	});
	// Show image
	$$('#show').onClick(function() {
		$$('#warning').addClass('h');
		$$('#preview').prop('src', data);
		$$('#preview').removeClass('h');
	});
	// Perform decryption
	$$('form').event('submit', function(event) {
		event.preventDefault();
		// Hide
		$$('form').addClass('h');
		// Try to decrypt
		var decrypted = decrypt(encrypted_data, $$('#password').val());
		// Check if failed
		if (decrypted === false) {
			// If failed notify user
			msg('Wrong Password');
			$$('form').removeClass('h');
		} else {
			// If succeded, save new data
			data = decrypted;
			// Show form
			showResults();
		}
	});
	// Load the data
	apiGet(function(apiData) {	
		// Hide welcome message
		$$('#isInit').addClass('h');
		if (apiData !== false) {
			// Process Response
			if (apiData['p'].hasOwnProperty('p')) {
				encrypted_data = apiData['d'];
			} else {
				data = apiData['d'];
			}
			type = apiData['p']['t'];
			// Visualize Response
			showResults();
		}
	});
});