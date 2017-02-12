<?php

function display_message($msg='Error') {
	exit('<p style="color: white; font-family: Verdana, Helvetica, sans-serif;">' . strip_tags($msg) . '</p>');
}
/*
RESPONSE CODES
~ - Banned
~0 - Limit Reached
~1 - Bad data
~2 - DB Error
~T - Short URL Taken
~E - Expired
*/
if(!empty($_GET['id'])) {
	switch ($_GET['id']) {
		case '~':
			display_message('Your IP is banned. If you think this is an error, contact the owner of the website');
			break;
		case '~0':
			display_message('You have maxed your weekly credits for this IP. Try again next week or from another device.');
			break;
		case '~1':
			display_message('Bad data; retry and make sure you enter all the required fields.');
			break;
		case '~2':
			display_message('A database error has occurred, try again later. If this error persist, contact the owner of this website.');
			break;
		case '~T':
			display_message('This short URL has been reserved. Try another.');
			break;
		default:
			display_message(urldecode($_GET['id']));
			break;
	}
}
?>