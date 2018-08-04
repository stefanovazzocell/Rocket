const salt = "jj";

/*
* encrypt(data, password) - AES Encryption
*
* @requires data string is data to be encrypted
* @requires password string is data to be encrypted 
*/
function encrypt(data, password) {
	return sjcl.encrypt(password, data, {mode : "gcm"});
}

/*
* pbkdf2(data) - PBKDF2 with the Rocket salt, 100000 rounds
*
* @requires data string is data to be hashed 
*/
function pbkdf2(data) {
	return sjcl.misc.pbkdf2(password, salt, 100000);
}

/*
* pbkdf2(data) - PBKDF2 Hashing, 100000 rounds
*
* @requires data string is data to be hashed 
*/
function pbkdf2(data) {
	return sjcl.misc.pbkdf2(password, salt, 100000);
}

/*
* sha512(data) - sha256 Hashing
*
* @requires data string is data to be hashed 
*/
function sha512(data) {
	return sjcl.hash.sha512(data);
}

/*
* encryptData(data) - Encryption Utility for Rocket
*
* @requires data string is data to be encrypted
* @requires password string is data to be encrypted 
*/
function encryptData(data, s, hash) {
	//var data ;
}