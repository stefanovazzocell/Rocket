function msg(message) {
	console.log(message);
	$$('#alert').html(message);
	$$('#alert').addClass('show');
}

$$().ready(function() {
	$$('#alert').onClick(function() {
		$$('#alert').removeClass('show');
	});
});