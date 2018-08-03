'use strict';

var messageTimer;

function msg(message) {
	clearTimeout(messageTimer);
	console.log(message);
	$$('#alert').html(message);
	$$('#alert').removeClass('hidden');
	messageTimer = setTimeout(function() {
		$$('#alert').addClass('hidden');
	}, 5000);
}

$$().ready(function() {
	$$('#alert').onClick(function() {
		$$('#alert').addClass('hidden');
		clearTimeout(messageTimer);
	});
});