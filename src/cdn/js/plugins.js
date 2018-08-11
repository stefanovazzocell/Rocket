// A randomly generated salt
const salt = 't6IcYm1fvwo0O+NwEo9JAqKwcn88zeqO/U1DZvCsgzK3GGa1QzOZpRNs2/sr17d7HNsIsoXhaTbjMk7sMRr5Rw==';
// The server address
var server = 'http://localhost:8080';
var baseUrl = 'http://localhost/#';

/* Encryption Plugin */

/*
* encrypt(data, password) - AES-GCM Encryption
*
* @requires data String is data to be encrypted
* @requires password String is the password to use
* @returns String encrypted data
*/
function encrypt(data, password) {
	return sjcl.encrypt(password, data, {mode : 'gcm'});
}
/*
* decrypt(data, password) - AES Encryption
*
* @requires data String is data to be encrypted
* @requires password String is the password to use
* @returns String decrypted data or false
*/
function decrypt(data, password) {
	try {
		return sjcl.decrypt(password, data);
	} catch (err) {
		return false;
	}
}

/*
* hash(data) - PBKDF2 with the Rocket salt + sha512
*
* @requires data String is data to be hashed 
* @returns String hash
*/
function hash(data, iter = 100000) {
	return sjcl.codec.base64.fromBits(sjcl.hash.sha512.hash(sjcl.misc.pbkdf2(data, salt, iter)));
}

/*
* encryptData(data, parameters, link, bigData, addPassword) - Encryption Utility for Rocket
*
* @requires data String is primary data to be encrypted
* @requires parameters Object is secondary data to be encrypted
* @requires link String is short link to use
* @requires addPassword String is additional password or false
* @requires bigData Boolean true if using bigData standard
* @returns Object containing 'l', 'd', 'p', 'bd' parameters or false if data it too much
*/
function encryptData(data, parameters, link, bigData = false, addPassword = false) {
	// Set d to be data
	var d = data;
	// If addPassword is available, update d and parameters
	if (addPassword !== false) {
		d = encrypt(data, addPassword);
		parameters['p'] = true;
	}
	// Set p to parameters
	var p = JSON.stringify(parameters);
	// Encrypt d
	d = encrypt(d, hash(link, 100));
	// Encrypt p
	p = encrypt(p, hash(link, 100));
	// Set l to be hashed link
	var l = hash(link);
	// Check if values are within allowed limits
	if ((d.length > (bigData ? 55000 : 2048)) || p.length > 512) {
		// If outside of boundaries fail, return false
		return false;
	}
	// Prepare output object
	var out = { 'l': l, 'd': d, 'p': p };
	// If bigData add flag
	if (bigData) {
		out['bd'] = true;
	}
	// Return data to success function
	return out;
}

/*
* decryptData(data, parameters, link) - Decryption Utility for Rocket
*
* @requires data String is primary data to be decrypted
* @requires parameters Object is secondary data to be decrypted
* @requires link String is short link to use
* @returns Object containing ''d', 'p' parameters or false if fails
*/
function decryptData(data, parameters, link) {
	// Get decrypted data
	var d = decrypt(data, hash(link, 100));
	// Get decrypted parameters
	var p = decrypt(parameters, hash(link, 100));
	// If any decryption fails, fail
	if (d === false || p === false) {
		return false;
	}
	// parse parameters
	p = JSON.parse(p);
	// Return data
	return { 'd': d, 'p': p };
}

/* API Plugin */

/*
* getMsg(xhr, message) - Gets a message from the response, otherwise shows the default
*
* @requires xhr to be xhr from ajax call
* @requires message String message to show if no msg
*/
function getMsg(xhr, message = 'An error has occurred, try again later') {
	try {
		var response = JSON.parse(xhr.responseText);
		msg(response['msg'] | message);
	} catch (err) {
		msg(message);
	}
}

/*
* apiGet(callback) - Performs a GET request
*
* @requires callback Function to call when completed
*/
function apiGet(callback) {
	// Get the link from the hash
	var link = window.location.hash;
	// Check if link is present
	if (!link) {
		// If link not available, redirect
		window.location.replace('/create');
	} else {
		// Polish link
		link = link.substr(1);
	}
	// Send request to server
	$$().post(server + '/api/000/',
		{
			"t": "get",
			"l": hash(link),
			"track": document.location.pathname.includes('track')
		},
		function (response) {
			// Parse response
			response = JSON.parse(response);
			// If there's a message, report it
			if (response['msg']) {
				msg(response['msg']);
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
				if (!response['msg']) {
					msg('An error has occurred, try again later');
				}
				// Callback
				callback(false);
			}
		},
		function (xhr) {
			// If an error occurred, let the user know
			getMsg(xhr);
			// Callback
			callback(false);
		});
}

/*
* apiSet(callback, data, link, type, clicks, hours, passw, del, edit, stats, bigData) - Performs a SET request
*
* @requires callback Function to call when completed
* @requires data String data value
* @requires type String type
* @requires clicks Integer number of clicks
* @requires hours Integer number of hours
* @requires passw String or false
* @requires del String or false
* @requires edit String or false
* @requires stats String or false
* @requires bigData Boolean
* @returns Boolean true if set, false otherwise
*/
function apiSet(callback, data, link, type, clicks, hours, passw, del, edit, stats, bigData = false) {
	// Check if link is empty
	if (link.length < 1) {
		msg('You must enter a short link');
		// Callback
		callback(false);
		return;
	}
	// Setup
	var sOptions = {};
	// If bigData, set policies
	if (bigData) {
		clicks = 1;
		hours = 1;
		del = false;
		edit = false;
		stats = false;
	}
	// If stats, set policies
	if (stats !== false) {
		edit = false;
		if (clicks < 10) clicks = 10;
		// Add to options
		if (stats === '') {
			sOptions['s'] = '';
		} else {
			sOptions['s'] = hash(stats);
		}
	}
	// If edit, set policies
	if (edit !== false) {
		// If does't match requirements exit
		if (edit == '') {
			msg('Edit must have a password');
			// Callback
			callback(false);
			return;
		}
		// Add to options
		sOptions['e'] = hash(edit);
	}
	// If delete
	if (del !== false) {
		// Add to options
		if (del === '') {
			sOptions['d'] = '';
		} else {
			sOptions['d'] = hash(del);
		}
	}
	// Encrypt
	var param = encryptData(data, { 't': type }, link, bigData, passw);
	// check answer
	if (param) {
		// Set final parameters
		param['t'] = 'set';
		param['c'] = clicks;
		param['e'] = hours;
		param['o'] = sOptions;
		// Query DB
		$$().post("http://localhost:8080/api/000/",
			param,
			function (response) {
				// Parse response
				response = JSON.parse(response);
				// If there's a message, report it
				if (response['msg']) {
					msg(response['msg']);
				}
				// Callback
				callback(response['a']);
			},
			function (xhr) {
				// If not found, let the user know
				msg('You are offline or temporarely banned');
				// Callback
				callback(false);
			});
	} else {
		msg('There is too much data, try to enter less data');
		callback(false);
	}
}

/*
* apiOpt(callback, link) - Performs a OPT request
*
* @requires callback Function to call when completed
* @requires link String to be the requested link (must be pre-hashed)
*/
function apiOpt(callback, link) {
	// Send request to server
	$$().post(server + '/api/000/',
		{
			"t": "opt",
			"l": link
		},
		function (response) {
			// Parse response
			response = JSON.parse(response);
			// If there's a message, report it
			if (response['msg']) {
				msg(response['msg']);
			}
			// Check if Present
			if (response['f'] === true) {
				// Callback
				callback(response['o']);
			} else if (response['f'] === false) {
				// If not found, let the user know
				msg('Link expired');
				// Callback
				callback(false);
			} else {
				// If an error occurred, let the user know
				if (!response['msg']) {
					msg('An error has occurred, try again later');
				}
				// Callback
				callback(false);
			}
		},
		function (xhr) {
			// If an error occurred, let the user know
			getMsg(xhr);
			// Callback
			callback(false);
		});
}

/*
* apiStats(callback, link, passw) - Performs a STATS request
*
* @requires callback Function to call when completed
* @requires link String to be the requested link (must be pre-hashed)
* @requires passw String or False to be the password 
*/
function apiStats(callback, link, passw = false) {
	// update passw
	if (passw) {
		passw = hash(passw);
	} else {
		passw = '';
	}
	// Send request to server
	$$().post(server + '/api/000/',
		{
			"t": "stats",
			"p": passw,
			"l": link
		},
		function (response) {
			// Parse response
			response = JSON.parse(response);
			// If there's a message, report it
			if (response['msg']) {
				msg(response['msg']);
			}
			// Check if Present
			if (response['f'] === true && response['p'] === true) {
				// Callback
				callback(response['s']);
			} else if (response['f'] === false) {
				// If not found, let the user know
				msg('Link expired');
				// Callback
				callback(false);
			} else if (response['p'] === false) {
				// If wrong password, let the user know
				msg('Wrong Password');
				// Callback
				callback(false);
			} else {
				// If an error occurred, let the user know
				if (!response['msg']) {
					msg('An error has occurred, try again later');
				}
				// Callback
				callback(false);
			}
		},
		function (xhr) {
			// If an error occurred, let the user know
			getMsg(xhr);
			// Callback
			callback(false);
		});
}

/*
* apiDel(callback, link, passw) - Performs a DEL request
*
* @requires callback Function to call when completed
* @requires link String to be the requested link (must be pre-hashed)
* @requires passw String or False to be the password 
*/
function apiDel(callback, link, passw = false) {
	// update passw
	if (passw) {
		passw = hash(passw);
	} else {
		passw = '';
	}
	// Send request to server
	$$().post(server + '/api/000/',
		{
			"t": "del",
			"p": passw,
			"l": link
		},
		function (response) {
			// Parse response
			response = JSON.parse(response);
			// If there's a message, report it
			if (response['msg']) {
				msg(response['msg']);
			}
			// Check if Present
			if (response['f'] === true && response['p'] === true) {
				// Callback
				callback(true);
			} else if (response['f'] === false) {
				// If not found, let the user know
				msg('Link expired');
				// Callback
				callback(true); // False trigger true to reset the UI
			} else if (response['p'] === false) {
				// If wrong password, let the user know
				msg('Wrong Password');
				// Callback
				callback(false);
			} else {
				// If an error occurred, let the user know
				if (!response['msg']) {
					msg('An error has occurred, try again later');
				}
				// Callback
				callback(false);
			}
		},
		function (xhr) {
			// If an error occurred, let the user know
			getMsg(xhr);
			// Callback
			callback(false);
		});
}

/*
* apiEdit(callback, editPass, link, rawLink, dataPass, data, parameters, clicks) - Performs a EDIT request
*
* @requires callback Function to call when completed
* @requires editPass String or False to be the password
* @requires link String to be the requested link (must be pre-hashed)
* @requires rawLink String to be the requested link
* @requires dataPass String or False to be the password
* @requires data String or False is data to be updated
* @requires clicks Numver or False is clicks to be updated
*/
function apiEdit(callback, editPass, link, rawLink, dataPass, data, parameters, clicks) {
	// update editPass
	editPass = hash(editPass);
	// Preparing editing options
	var edit = {};
	// Run checks
	if (data === false && clicks === false) {
		msg('At least one of link/text or clicks should be changed');
		callback(false);
		return;
	}
	if (clicks !== false) {
		edit['c'] = clicks;
		if (clicks < 1) edit['c'] = 1;
		if (clicks > 1000) edit['c'] = 1000;
	}
	if (data !== false) {
		var returned = encryptData(data, parameters, rawLink, false, dataPass);
		if (returned === false) {
			// failed
			callback(false);
			return;
		}
		// Add data
		edit['d'] = returned['d'];
		edit['p'] = returned['p'];
	}
	// Send request to server
	$$().post(server + '/api/000/',
		{
			"t": "edit",
			"p": editPass,
			"l": link,
			"e": edit
		},
		function (response) {
			// Parse response
			response = JSON.parse(response);
			// If there's a message, report it
			if (response['msg']) {
				msg(response['msg']);
			}
			// Check if Present
			if (response['f'] === true && response['p'] === true) {
				// Callback
				callback(true);
			} else if (response['f'] === false || response['p'] === false) {
				// Callback
				callback(false);
			} else {
				// If an error occurred, let the user know
				if (!response['msg']) {
					msg('An error has occurred, try again later');
				}
				// Callback
				callback(false);
			}
		},
		function (xhr) {
			// If an error occurred, let the user know
			getMsg(xhr);
			// Callback
			callback(false);
		});
}