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

function updateHours() {
	var hours = parseInt($$('#hours').val());
	var days = Math.floor(hours / 24);
	$$('#aDays').html(days);
	$$('#aHours').html(hours - 24 * days);
}

$$().ready(function() {
	$$('#alert').onClick(function() {
		$$('#alert').addClass('hidden');
		clearTimeout(messageTimer);
	});
	$$('input').event('focus', function() {
		$$('#footer').addClass('hidden');
		$$('#content').style('bottom', '0');
	});
	$$('input').event('blur', function() {
		$$('#footer').removeClass('hidden');
		$$('#content').style('bottom', '30px');
	});
	$$('#hours').event('input', function() {
		updateHours();
	});
	$$('.hours').event('click', function() {
		updateHours();
	});
});