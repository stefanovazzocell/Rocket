// The server address
var server = 'http://localhost:8080';

/*
* apiGet(callback, track) - Performs a GET request
*
* @requires callback Function to call when completed
* @requires track Boolean true if tracking enabled, false otherwise
*/
function apiGet(callback, track = false) {
	// Get the link from the hash
	var link = window.location.hash;
	// Check if link is present
	if (!link) {
		// If link not available, redirect
		window.location.replace('/create');
	}
	// Send request to server
	$$().post(server + '/api/000/',
		{
			"t": "get",
			"l": hash(link),
			"track": track
		},
		function (response) {
			// Parse response
			response = JSON.parse(response);
			// Get message
			var message = response['msg'];
			// If there's a message, report it
			if (message) {
				msg(message);
			}
			// Check if Present
			if (response['f'] === true) {
				// Decrypt Data
				var out = decryptData(response['d'], response['p'], link);
				// Callback
				callback(out);
			} else if (response['f'] === false) {
				// If not found, let the user know
				msg('Link expired');
				// Callback
				callback(false);
			} else {
				// If an error occurred, let the user know
				if (!message) {
					msg('An error has occurred, try again later');
				}
				// Callback
				callback(false);
			}
		},
		function (xhr) {
			// If an error occurred, let the user know
			try {
				var response = JSON.parse(xhr.responseText);
				msg(response['msg'] | 'An error has occurred, try again later');
			} catch (err) {
				msg('An error has occurred, try again later');
			}
			// Callback
			callback(false);
		});
}