'use strict';

var data;
var type;
var password = false;

/*
* showResults() - Shows the results of the API call 
*/
function showResults() {
	if (password) {
		// If has password, ask for it
		$$('#addPassword').removeClass('hidden');
	} else {
		// Load Data
		switch (type) {
			case 'url':
				// Try to fix URL
				if(!/^(?:\w+:)?\/\/([^\s\.]+\.\S{2}|localhost[\:?\d]*)\S*$/.test(data)) data = "http://" + data;
				// Display
				$$('#urlDataShow').val(data);
				break;
			case 'text':
				// Display
				$$('#textDataShow').val(data);
				break;
			case 'img':
				// If not matching standards
				if (data.startsWith('data:image/jpeg;base64,/') == false) {
					// Protect the user (flush image)
					type = false;
					data = '';
					// Alert the user
					msg('The image is suspicious; for safety, it has been removed');
				}
				break;
		}
		// If possible, show correct block
		if (type) $$('#' + type + 'Data').removeClass('hidden');
	}
}

// When page ready start functions
$$().ready(function() {
	// Complete Decryption
	$$('#decrypt').onClick(function() {
		// Hide tab
		$$('#addPassword').addClass('hidden');
		// Try to decrypt
		var decrypted = decrypt(data, $$('#password').val());
		// Check if failed
		if (decrypted === false) {
			// If failed notify user
			msg('Wrong Password');
			$$('#addPassword').removeClass('hidden');
		} else {
			// If succeded, save new data
			data = decrypted;
			password = false;
			// Show form
			showResults();
		}
	});
	// Visit the link
	$$('#visit').onClick(function() {
		window.location.replace($$('#urlDataShow').val());
	});
	// Show Image
	$$('#show').onClick(function() {
		$$('#preview').prop('src',data);
	});
	// Call get
	apiGet(function(apiData) {	
		if (apiData !== false) {
			// Process Response
			data = apiData['d'];
			type = apiData['p']['t'];
			password = apiData['p'].hasOwnProperty('p');
			// Hide welcome message
			$$('#welcome').addClass('hidden');
			// Visualize Response
			showResults();
		} else {
			// Hide welcome message
			$$('#welcome').addClass('hidden');
		}
	});
});