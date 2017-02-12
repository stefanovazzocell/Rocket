<!DOCTYPE html>
<html>
<head>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Url Shortener - Interface</title>
	<style type="text/css">
		body {
			color: #fff;
			background: #000;
			margin: 0;
			resize: vertical;
			overflow: auto;
			text-align: center;
			font-family: Verdana, Helvetica, sans-serif;
		}
		/* Main body */
		.outer {
			position: absolute;
			top: 50%;
			height: 400px;
			margin-top: -180px;
			width: 100%;
		}
		.container {
			background: #a10;
			width: 320px;
			margin: 0 auto;
			height: 100%;
		}
		/* Blocks */
		.block_300 {
			height: 300px;
			line-height: 300px;
		}
		.block_250 {
			height: 250px;
			line-height: 250px;
		}
		.block_100 {
			height: 100px;
			line-height: 100px;
		}
		.block_50 {
			height: 50px;
			line-height: 50px;
		}
		.block_half {
			display: flex;
		}
		.block_half_block {
			margin: auto;
			width: 160px;
		}
		.block_half_center {
			margin: auto;
			width: 50px;
		}
		.block_half_side {
			margin: auto;
			width: 135px;
		}
		iframe {
			border: 0;
		}
		/* Special */
		.shadow:hover {
			background: #810;
		}
		.clickable {
			cursor: pointer;
		}
		.clickable:active {
			background: #610;
		}
		.hidden {
			display: none;
		}
		.loading_bar {
			background-color: #610;
			right: 0;
			height: 50px;
			width: 0;
		}
		/* Form and Inputs */
		input {
			background: #000;
			color: #fff;
			margin-top: 5px;
			border-style: none;
			height: 30px;
			width: 90%;
			padding: 5px;
			font-size: 120%;
			text-align: center;
		}
		input:hover {
			background: #111;
		}
		input:focus {
			background: #222;
			outline: none;
		}
		input:invalid {
			color: #e10;
		}
		.input_100 {
			margin-top: 30px;
		}
		.input_250 {
			margin-top: 105px;
		}
		/* Text */
		.txt {
			webkit-user-select:none;
			moz-user-select:none;
			ms-user-select:none;
			user-select:none;
		}
		.txt_major {
			font-size: 300%;
		}
		.txt_title {
			font-size: 160%;
		}
		.txt_capt {
			font-size: 70%;
		}
	</style>
</head>
<body>
	<div class="outer">
		<div class="container">
			<!-- Shortener Head -->
			<div id="ui_head" class="block_50 shadow clickable txt txt_title">🔗 Shortener</div>
			<!-- Reset Head -->
			<div id="ui_head_reset" class="block_50 shadow clickable txt_title hidden">Go Back</div>
			<!-- Short Link Input -->
			<div id="ui_short" class="block_100 block_half shadow hidden">
				<div class="block_half_block txt txt_capt">
					go.stefanovazzoler.com/#
				</div>
				<div class="block_half_block">
					<input type="text" id="input_short" minlength="2" autocomplete="off">
				</div>
			</div>
			<!-- Url Input -->
			<div id="ui_long" class="block_100 shadow hidden">
				<input type="text" class="input_100" id="input_long" minlength="5" maxlength="1024" autocomplete="off">
			</div>
			<!-- Maximum views -->
			<div id="ui_opt_views" class="block_50 block_half shadow hidden">
				<div class="block_half_block txt_capt">
					Maximum views
				</div>
				<div class="block_half_block">
					<input type="number" id="input_views" min="1" max="1000000000" autocomplete="off">
				</div>
			</div>
			<!-- Expiration Date -->
			<div id="ui_opt_date" class="block_50 block_half shadow hidden">
				<div class="block_half_block txt_capt">
					Expiration Date
				</div>
				<div class="block_half_block">
					<input type="date" id="input_date" autocomplete="off">
				</div>
			</div>
			<!-- Link Creation Button -->
			<div id="ui_btn_create" class="block_100 shadow clickable txt txt_major hidden">
				🚀
			</div>
			<!-- Loading Banner -->
			<div id="ui_banner" class="block_300 txt txt_title shadow">
				Loading...
			</div>
			<!-- Final Link -->
			<div id="ui_final" class="block_250 shadow hidden" onclick="copy_link();">
				<input type="text" class="input_250" id="input_final" readonly>
			</div>
			<!-- 'Copied to Clipboard' message -->
			<div id="ui_copied" class="block_50 txt txt_capt hidden"></div>
			<!-- External Page -->
			<iframe id="ui_external" class="block_300 hidden">
			</iframe>
			<!-- Loading Bar -->
			<div id="ui_loading" class="block_50 hidden">
				<div class="loading_bar"></div>
			</div>
			<!-- Ok Footer -->
			<div id="ui_footer_ok" class="block_50 txt shadow clickable hidden">✔</div>
			<!-- Footer -->
			<div id="ui_footer" class="block_50 block_half hidden">
				<div id="ui_btn_about" class="block_half_side shadow clickable txt">About</div>
				<div id="ui_btn_adv" class="block_half_center shadow clickable txt">➕</div>
				<div id="ui_btn_tos" class="block_half_side shadow clickable txt">TOS</div>
			</div>
		</div>
	</div>
</body>
<script src="sjcl.js"></script>
<script src="jquery.js"></script>
<script>
	/* Variables (Edit this)
	*/
	var server_worker = "worker.php";
	var server_shortlink = "https://go.stefanovazzoler.com/"; // Without '#'
	var server_about = "https://stefanovazzoler.com";
	var server_tos = "https://cdn.stefanovazzoler.com/tos.txt";
	var app_version = '80'; // Major Minor Changes
	var server_hash = ['',
				'',
				'',
				''];
	var temp_trial = 0; // Do not change
	var temp_data = ''; // Do not change
	/* Functions
	*/
	// Generate a random url-friendly string
	function random_string(len=14) {
		var output = "";
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-";
		for( var i=0; i < len; i++ ) output += chars.charAt(Math.floor(Math.random() * chars.length));
		return output;
	}
	// Generate Random Dates
	function random_date() {
		var initialDate = new Date(new Date().setFullYear(new Date().getFullYear() + 1)); // 1 year from now
		var finalDate = new Date(new Date().setFullYear(new Date().getFullYear() + 3)); // 3 years from now
		var randomDt = new Date(initialDate.getTime() + Math.random() * (finalDate.getTime() - initialDate.getTime()));
		var Dday = randomDt.getDate();
		var Dmonth = randomDt.getMonth() + 1;
		if (Dmonth < 10) Dmonth = "0" + Dmonth;
		if (Dday < 10) Dday = "0" + Dday;
		return (randomDt.getFullYear() + "-" + Dmonth + "-" + Dday);
	}
	function copy_link() {
		$("#input_final").select();
		document.execCommand("copy");
		$('#ui_copied').html('Link copied to clipboard');
	}
	// Reset the UI
	function reset() {
		$('.container > div, #ui_external').addClass('hidden'); // hide everything
		$('#ui_short, #ui_long').removeClass('block_50').addClass('block_100'); // Resize ui_short
		$('input').val(''); // Reset all inputs
		$('#input_short').val(random_string());
		$('#ui_external').prop('src', '');
		$('#ui_copied').html('');
		$('#input_views').val(1000);
		$('#input_date').val(random_date());
		$('.loading_bar').width('0');
		$('#ui_head, #ui_short, #ui_long, #ui_btn_create, #ui_footer').removeClass('hidden');
		//if (session_reset) $.get(server_worker + '?reset');
	}
	// Toggle Advance Settings
	function ui_advanced_toggle() {
		if ($('#ui_btn_adv').html()=='➕') {
			// Show Advance Settings
			$('#ui_short, #ui_long').removeClass('block_100').addClass('block_50'); // Resize ui_short
			$('#input_long').removeClass('input_100');
			$('#ui_opt_views, #ui_opt_date').removeClass('hidden'); // Show extra settings
			$('#ui_btn_adv').html('➖');
		} else {
			// Hide Advance Settings
			$('#ui_short, #ui_long').removeClass('block_50').addClass('block_100'); // Resize ui_short
			$('#input_long').addClass('input_100');
			$('#ui_opt_views, #ui_opt_date').addClass('hidden'); // Hide extra settings
			$('#ui_btn_adv').html('➕');
		}
	}
	// Show loading UI
	function ui_loading() {
		$('.container > div').addClass('hidden'); // hide everything
		$('.ui_short, #ui_long').removeClass('block_50').addClass('block_100'); // Resize inputs
		$('.loading_bar').width('0');
		$('#ui_banner').html('Feeding the monkeys...'); // Loading message
		$('#ui_head_reset, #ui_banner, #ui_loading').removeClass('hidden');
	}
	// Show Error UI
	function ui_error(error = "Error") {
		ui_open_link('error.php?id=' + encodeURI(error));
	}
	// Show Created Link
	function ui_done(link = '') {
		$('.container > div').addClass('hidden'); // hide everything
		$('#input_final').val(link); // Showing link
		$('#ui_head, #ui_final, #ui_copied, #ui_footer_ok').removeClass('hidden');
	}
	// Open Link
	function ui_open_link(link = '') {
		$('.container > div').addClass('hidden'); // hide everything
		$('#ui_external').prop('src', link);
		$('#ui_head, #ui_external, #ui_footer_ok').removeClass('hidden');
	}
	// Hash data
	function helper_hash(data = '', number = 5000, hash = ['', '']) {
		var hash = data;
		for (var i = 0; i < number; i++) {
			hash = sjcl.codec.base64.fromBits(sjcl.hash.sha512.hash(hash[0] + hash + hash[1]));
		}
		return hash;
	}
	// Encrypt Data
	function helper_encrypt(data = '', password = '', hash = ['', '']) {
		return sjcl.encrypt(helper_hash(password, 50, hash), data);
	}
	// Decrypt Data
	function helper_decrypt(data = '', password = '', hash = ['', '']) {
		return sjcl.decrypt(helper_hash(password, 50, hash), data);
	}
	// Create Link
	function link_make(short = $('#input_short').val(), long = $('#input_long').val(), max_views = $('#input_views').val(), max_date = $('#input_date').val(), server = server_worker) {
		ui_loading();
		setTimeout(function() {link_make_0(short, long, max_views, max_date, server);}, 10);
	}
	// Link Make Step 0
	function link_make_0(short, long, max_views, max_date, server) {
		var request_short = helper_hash(short, 1000, [server_hash[0], server_hash[1]]);
		$('.loading_bar').width('20%');
		setTimeout(function() {link_make_1(short, long, max_views, max_date, server, request_short);}, 10);
	}
	// Link Make Step 1
	function link_make_1(short, long, max_views, max_date, server, request_short) {
		var request_hash = helper_hash(random_string(10240), 10);
		$('.loading_bar').width('30%');
		setTimeout(function() {link_make_2(short, long, max_views, max_date, server, request_short, request_hash);}, 10);
	}
	// Link Make Step 2
	function link_make_2(short, long, max_views, max_date, server, request_short, request_hash) {
		var request_data = helper_encrypt(long, short + request_hash, [server_hash[2], server_hash[3]])
		$('.loading_bar').width('50%');
		var request_max_views = max_views;
		var request_exp_date = max_date;
		temp_data = short;
		$('.loading_bar').width('60%');
		$.post( server, { a: "create", v: app_version, _s: request_short, _h: request_hash, _d: request_data, _v: request_max_views, _e: request_exp_date } )
			.done(function( data ) {
				$('.loading_bar').width('90%');
				if ( data == 'ok' ) {
					$('.loading_bar').width('99%');
					temp_trial = 0;
					ui_done(server_shortlink + '#' + temp_data);
					temp_data = '';
				} else {
					console.log('Retrying');
					temp_trial += 1; // Retry +1 trial
					if (temp_trial > 5) {
						console.log('Error: 5 Trials Failed');
						ui_error(data);
						return false;
					}
					link_make(temp_data + random_string(1));
				}
			})
			.fail(function() {
				console.log('Error: The POST request failed');
				ui_error('Connection Error, Retry.');
				temp_trial = 0;
			});
	}
	/* JQuery Ready
	*/
	$(function() {
		// Initialize interface at the end of loading
		if (location.hash.substring(1) == "expired") {
			ui_error('Link Expired');
		} else reset();
		// Reset interface on request
		$('#ui_head, #ui_head_reset, #ui_footer_ok').click(function() { reset(); });
		// Change between Advanced/Simple settings
		$('#ui_btn_adv').click(function() { ui_advanced_toggle(); });
		// Show TOS and About page
		$('#ui_btn_tos').click(function() {
			ui_open_link(server_tos);
		});
		$('#ui_btn_about').click(function() {
			ui_open_link(server_about);
		});
		// Create URL
		$('#ui_btn_create').click(function() {
			link_make();
		});
	});
	/*
	* Notes
	
	errors = ['Wrong Request', 'Bad Connection, Retry', 'IP Reached Limit'];

	*/
</script>
</html>