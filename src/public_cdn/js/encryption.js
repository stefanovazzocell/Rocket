const salt = 't6IcYm1fvwo0O+NwEo9JAqKwcn88zeqO/U1DZvCsgzK3GGa1QzOZpRNs2/sr17d7HNsIsoXhaTbjMk7sMRr5Rw==';

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
	if ((d.length > (bigData ? 55000 : 2048)) || p.length > 512) {
		console.log('data length: ' + d.length + ', parameters length: ' + p.length);
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