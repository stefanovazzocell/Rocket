<!DOCTYPE html>
<html>
<head>
	<title>Rocket</title>
</head>
<body style="background-color: #000; color: #a10; text-align: center; font-size: 160%;">
Redirecting...
<script src="../sjcl.js"></script>
<script>
	if (location.hash.substring(1) == "") location.replace("https://go.stefanovazzoler.com/new/#redirect");
	var server_worker = "worker.php";
	var app_version = '80';
	var server_hash = ['',
				'',
				'',
				''];
	// Hash data
	function helper_hash(data = '', number = 1000, hash = ['', '']) {
		var hash = data;
		for (var i = 0; i < number; i++) {
			hash = sjcl.codec.base64.fromBits(sjcl.hash.sha512.hash(hash[0] + hash + hash[1]));
		}
		return hash;
	}
	// Decrypt Data
	function helper_decrypt(data = '', password = '', hash = ['', '']) {
		return sjcl.decrypt(helper_hash(password, 50, hash), data);
	}
	// Request Data
	function request() {
		xhr = new XMLHttpRequest();
		xhr.open('POST', server_worker);
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
		xhr.onload = function() {
			if (xhr.status === 200 && xhr.responseText.length > 2) {
				var data = JSON.parse(xhr.responseText);
				location.replace(helper_decrypt(data['data'], location.hash.substring(1) + data['hash'], [server_hash[2],server_hash[3]]));
			} else alert('Error, try to reload.');
		};
		xhr.send(encodeURI('a=get&_s=' + helper_hash(location.hash.substring(1),1000,[server_hash[0],server_hash[1]])));
	}
</script>
</body>
</html>