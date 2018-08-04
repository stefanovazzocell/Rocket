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
		// Else show correct block
		$$('#' + type + 'Data').removeClass('hidden');
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
	var apiResponse = apiGet();
	// Process Response
	data = apiResponse['d'];
	parameters = JSON.parse(apiResponse['p']);
	type = parameters['t'];
	password = parameters.hasOwnProperty('p');
	// Hide welcome message
	$$('welcome').addClass('hidden');
	// Visualize Response
	showResults();
});