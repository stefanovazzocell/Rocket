const salt = 't6IcYm1fvwo0O+NwEo9JAqKwcn88zeqO/U1DZvCsgzK3GGa1QzOZpRNs2/sr17d7HNsIsoXhaTbjMk7sMRr5Rw==';

/*
* encrypt(data, password) - AES Encryption
*
* @requires data String is data to be encrypted
* @requires password String is the password to use
*/
function encrypt(data, password) {
	return sjcl.encrypt(password, data, {mode : 'gcm'});
}

/*
* hash(data) - PBKDF2 with the Rocket salt + sha512
*
* @requires data String is data to be hashed 
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
function encryptData(data, parameters, link, bigData = false, addPassword=false) {
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
	if ((d.length > 2048 || (bigData && d.length > 55000)) || p.length > 512) {
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