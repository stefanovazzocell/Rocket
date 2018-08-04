'use strict';

var data;
var type;



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
			// Show form
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
});