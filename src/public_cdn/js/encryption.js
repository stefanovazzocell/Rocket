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
* encryptData(data, parameters, link, onSuccess, onFailure, addPassword) - Encryption Utility for Rocket
*
* @requires data String is primary data to be encrypted
* @requires parameters Object is secondary data to be encrypted
* @requires link String is short link to use
* @requires addPassword String is additional password or false
* @requires onSuccess Function to call if Success
* @requires onFailure Function to call if Failure
* @returns Object containing 'l', 'd', 'p' parameters
*/
function encryptData(data, parameters, link, onSuccess, onFailure = msg, addPassword=false) {
	if (addPassword !== false) {
		
	}
	//var data ;
}