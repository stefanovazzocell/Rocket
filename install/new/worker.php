<?php

/*
* Settings
*/

define('__salt', array('', '', '', '')); // Salt Settings (2 for hash, 2 for ip)
define('__MySql', array('dbname' => '', 'host' => '', 'user' => '', 'password' => '')); // DB Settings
define('__tax_ban', array(10000, 50000)); // first prevents usage, second bans
/*Do not edit the following
*/
define('__real_IP', (isset($_SERVER["HTTP_CF_CONNECTING_IP"])?$_SERVER["HTTP_CF_CONNECTING_IP"]:$_SERVER['REMOTE_ADDR'])); // Get user ip with Cloudflare - or not


/*
*	Helpers
*/

function shait($stringtosha, $salt_adv = false, $cycles = 1000) {
	if ($salt_adv) {
		for ($i=0; $i < $cycles; $i++) { 
			return hash("sha512", __salt[2] . hash("sha512", $stringtosha, false) . __salt[3], false);
		}
	} else {
		for ($i=0; $i < $cycles; $i++) { 
			return hash("sha512", __salt[0] . hash("sha512", $stringtosha, false) . __salt[1], false);
		}
	}
}

function db_query()
{
	$sql = func_get_arg(0);
	$parameters = array_slice(func_get_args(), 1);
	static $handle;
	if (!isset($handle)) {
		try {
			$handle = new PDO('mysql:dbname=' . __MySql['dbname'] . ';host=' . __MySql['host'], __MySql['user'], __MySql['password']);
			$handle->setAttribute(PDO::ATTR_EMULATE_PREPARES, false); 
		}
		catch (Exception $e) {
			return false;
			exit;
		}
	}
	$statement = $handle->prepare($sql);
	if ($statement === false) {
		trigger_error($handle->errorInfo()[2], E_USER_ERROR);
		return false;
		exit;
	}
	$results = $statement->execute($parameters);
	if ($results !== false) {
		return $statement->fetchAll(PDO::FETCH_ASSOC);
	} else return false;
}

function randomString($max, $min){
	$result = "";
	$chars = "a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|A|B|C|D|E|F|G|H|I|J|K|L|M|N|O|P|Q|R|S|T|U|V|W|X|Y|Z|0|1|2|3|4|5|6|7|8|9|-|_";
	$charArray = explode("|", $chars);
	for($i = 0; $i < mt_rand($min, $max); $i++){
		$result .= $charArray[mt_rand(0, count($charArray) - 1)];
	}
	return $result;
}

function getWeek() {
	return date('WY'); //102016 - Tenth week of 2016
}

function getMonth() {
	return intval(date('ym', strtotime('+1 month', time()))); //1712 - Dec 2017
}

function tax($cost=1000, $full=true) {
	if ($full) {
		$db_response = db_query('SELECT * FROM `banned` WHERE `ip`=(?)', __real_IP);
		if (!empty($db_response)) exit('~'); // If the IP is banned, terminate the session 
	}
	$db_response = db_query('SELECT * FROM `logs` WHERE `id`=(?)', shait((__real_IP . getWeek()), true));
	if (empty($db_response)) {
		db_query('INSERT INTO `logs`(`id`, `tax`, `expire`) VALUES (?,?,?)', shait((__real_IP . getWeek()), true), $cost, getMonth());
	} else {
		// Check if time to ban (or block)
		if($db_response[0]['tax'] >= __tax_ban[0]) {
			if ($db_response[0]['tax'] >= __tax_ban[1]) { // Ban
				db_query('INSERT INTO `banned`(`ip`) VALUES (?)', __real_IP);
				exit('~');
			}
			db_query('UPDATE `logs` SET `tax`=`tax`+(?) WHERE `id`=(?)', $cost, shait((__real_IP . getWeek()), true));
			exit('-');
		}
		db_query('UPDATE `logs` SET `tax`=`tax`+(?) WHERE `id`=(?)', $cost, shait((__real_IP . getWeek()), true));
		return true;
	}
}

function checkInput() {
	if (empty($_POST['_s']) || empty($_POST['_h']) || empty($_POST['_d']) || empty($_POST['_v']) || empty($_POST['_e'])) {
		tax(100, false);
		clearDB();
		exit('~1');
	}
	if (!((strlen($_POST['_s']) === 88) && (strlen($_POST['_h']) === 88) && (strlen($_POST['_d']) >= 10) && ($_POST['_v'] >= 1) && (strlen($_POST['_e']) === 10) && (strlen($_POST['_d']) <= 2048) && ($_POST['_v'] <= 1000000000))) {
		tax(100, false);
		clearDB();
		exit('~1');
	}
}

function addLink() {
	checkInput();
	if (!empty(db_query('SELECT * FROM `links` WHERE `short`=(?)', $_POST['_s']))) {
		tax(100, false);
		clearDB();
		exit('~T');
	}
	db_query('INSERT INTO `links`(`short`, `data`, `hash`, `views`, `expiration`) VALUES (?,?,?,?,?)', $_POST['_s'], $_POST['_d'], $_POST['_h'], $_POST['_v'], $_POST['_e']);
}

function getLink() {
	$db_response = db_query('SELECT `data`,`hash` FROM `links` WHERE `short`=(?) AND `views`>0 AND `expiration` >= NOW()', $_POST['_s']);
	if (empty($db_response)) {
		tax(100, false);
		clearDB();
		exit('~E');
	}
	db_query('UPDATE `links` SET `views`=`views`-1 WHERE `short`=(?) AND `views`>0 AND `expiration` >= NOW()', $_POST['_s']);
	echo(json_encode(array("_d"=>$db_response[0]['data'], "_h"=>$db_response[0]['hash'])));
	exit();
}

function clearDB() {
	db_query('DELETE FROM `links` WHERE `views` <= 0 OR `expiration` < NOW()');
	db_query('DELETE FROM `logs` WHERE `expire` < (?)', getMonth());
}

/*
*	Main
*
POST
a - Action ('create', 'get')
v - Application Version
_s - Hashed Short Link
_h - Data Hash
_d - Encrypted Data
_v - Max Views
_e - Expiration Date
_u - [request] Short Url To Check

TAXING (10000 credits per month)
1 - Good Get
150 - Bad Get
100 - Good Create
200 - Bad Create

RESPONSE CODES
~ - Banned
~0 - Limit Reached
~1 - Bad data
~2 - DB Error
~T - Short URL Taken
~E - Expired
*/

if (empty($_POST["a"])) exit(); // If no action, exit
if (empty($_POST["v"]) or ($_POST["v"] !== "80")) exit();

switch ($_POST["a"]) {
	case 'create':
		tax(100);
		addLink();
		exit('ok');
		// if bad add tax(100);
		break;
	case 'get':
		if (empty($_POST["_s"])) {
			tax(150);
			exit();
		} else tax(1);
		getLink();
		// if bad add tax(149);
		break;
	default:
		exit();
		break;
	}

?>