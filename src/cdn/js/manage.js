'use strict';

var link = undefined;
var hashedLink = undefined;

// ISO Country Codes (Plus XX) -> Names (or Descr)
var countries = {AF:"Afghanistan",AX:"Aland Islands",AL:"Albania",DZ:"Algeria",AS:"American Samoa",AD:"Andorra",AO:"Angola",AI:"Anguilla",AQ:"Antarctica",AG:"Antigua And Barbuda",AR:"Argentina",AM:"Armenia",AW:"Aruba",AU:"Australia",AT:"Austria",AZ:"Azerbaijan",BS:"Bahamas",BH:"Bahrain",BD:"Bangladesh",BB:"Barbados",BY:"Belarus",BE:"Belgium",BZ:"Belize",BJ:"Benin",BM:"Bermuda",BT:"Bhutan",BO:"Bolivia",BA:"Bosnia And Herzegovina",BW:"Botswana",BV:"Bouvet Island",BR:"Brazil",IO:"British Indian Ocean Territory",BN:"Brunei Darussalam",BG:"Bulgaria",BF:"Burkina Faso",BI:"Burundi",KH:"Cambodia",CM:"Cameroon",CA:"Canada",CV:"Cape Verde",KY:"Cayman Islands",CF:"Central African Republic",TD:"Chad",CL:"Chile",CN:"China",CX:"Christmas Island",CC:"Cocos (Keeling) Islands",CO:"Colombia",KM:"Comoros",CG:"Congo",CD:"Congo, Democratic Republic",CK:"Cook Islands",CR:"Costa Rica",CI:"Cote D'Ivoire",HR:"Croatia",CU:"Cuba",CY:"Cyprus",CZ:"Czech Republic",DK:"Denmark",DJ:"Djibouti",DM:"Dominica",DO:"Dominican Republic",EC:"Ecuador",EG:"Egypt",SV:"El Salvador",GQ:"Equatorial Guinea",ER:"Eritrea",EE:"Estonia",ET:"Ethiopia",FK:"Falkland Islands (Malvinas)",FO:"Faroe Islands",FJ:"Fiji",FI:"Finland",FR:"France",GF:"French Guiana",PF:"French Polynesia",TF:"French Southern Territories",GA:"Gabon",GM:"Gambia",GE:"Georgia",DE:"Germany",GH:"Ghana",GI:"Gibraltar",GR:"Greece",GL:"Greenland",GD:"Grenada",GP:"Guadeloupe",GU:"Guam",GT:"Guatemala",GG:"Guernsey",GN:"Guinea",GW:"Guinea-Bissau",GY:"Guyana",HT:"Haiti",HM:"Heard Island & Mcdonald Islands",VA:"Holy See (Vatican City State)",HN:"Honduras",HK:"Hong Kong",HU:"Hungary",IS:"Iceland",IN:"India",ID:"Indonesia",IR:"Iran, Islamic Republic Of",IQ:"Iraq",IE:"Ireland",IM:"Isle Of Man",IL:"Israel",IT:"Italy",JM:"Jamaica",JP:"Japan",JE:"Jersey",JO:"Jordan",KZ:"Kazakhstan",KE:"Kenya",KI:"Kiribati",KR:"Korea",KW:"Kuwait",KG:"Kyrgyzstan",LA:"Lao People's Democratic Republic",LV:"Latvia",LB:"Lebanon",LS:"Lesotho",LR:"Liberia",LY:"Libyan Arab Jamahiriya",LI:"Liechtenstein",LT:"Lithuania",LU:"Luxembourg",MO:"Macao",MK:"Macedonia",MG:"Madagascar",MW:"Malawi",MY:"Malaysia",MV:"Maldives",ML:"Mali",MT:"Malta",MH:"Marshall Islands",MQ:"Martinique",MR:"Mauritania",MU:"Mauritius",YT:"Mayotte",MX:"Mexico",FM:"Micronesia, Federated States Of",MD:"Moldova",MC:"Monaco",MN:"Mongolia",ME:"Montenegro",MS:"Montserrat",MA:"Morocco",MZ:"Mozambique",MM:"Myanmar",NA:"Namibia",NR:"Nauru",NP:"Nepal",NL:"Netherlands",AN:"Netherlands Antilles",NC:"New Caledonia",NZ:"New Zealand",NI:"Nicaragua",NE:"Niger",NG:"Nigeria",NU:"Niue",NF:"Norfolk Island",MP:"Northern Mariana Islands",NO:"Norway",OM:"Oman",PK:"Pakistan",PW:"Palau",PS:"Palestinian Territory, Occupied",PA:"Panama",PG:"Papua New Guinea",PY:"Paraguay",PE:"Peru",PH:"Philippines",PN:"Pitcairn",PL:"Poland",PT:"Portugal",PR:"Puerto Rico",QA:"Qatar",RE:"Reunion",RO:"Romania",RU:"Russian Federation",RW:"Rwanda",BL:"Saint Barthelemy",SH:"Saint Helena",KN:"Saint Kitts And Nevis",LC:"Saint Lucia",MF:"Saint Martin",PM:"Saint Pierre And Miquelon",VC:"Saint Vincent And Grenadines",WS:"Samoa",SM:"San Marino",ST:"Sao Tome And Principe",SA:"Saudi Arabia",SN:"Senegal",RS:"Serbia",SC:"Seychelles",SL:"Sierra Leone",SG:"Singapore",SK:"Slovakia",SI:"Slovenia",SB:"Solomon Islands",SO:"Somalia",ZA:"South Africa",GS:"South Georgia And Sandwich Isl.",ES:"Spain",LK:"Sri Lanka",SD:"Sudan",SR:"Suriname",SJ:"Svalbard And Jan Mayen",SZ:"Swaziland",SE:"Sweden",CH:"Switzerland",SY:"Syrian Arab Republic",TW:"Taiwan",TJ:"Tajikistan",TZ:"Tanzania",TH:"Thailand",TL:"Timor-Leste",TG:"Togo",TK:"Tokelau",TO:"Tonga",TT:"Trinidad And Tobago",TN:"Tunisia",TR:"Turkey",TM:"Turkmenistan",TC:"Turks And Caicos Islands",TV:"Tuvalu",UG:"Uganda",UA:"Ukraine",AE:"United Arab Emirates",GB:"United Kingdom",US:"United States",UM:"United States Outlying Islands",UY:"Uruguay",UZ:"Uzbekistan",VU:"Vanuatu",VE:"Venezuela",VN:"Viet Nam",VG:"Virgin Islands, British",VI:"Virgin Islands, U.S.",WF:"Wallis And Futuna",EH:"Western Sahara",YE:"Yemen",ZM:"Zambia",ZW:"Zimbabwe",XX:"Unknown"};

/*
* getCountryName(cc) - Get a country name given a code
*
* @requires cc string to be a valid contry name
*/
function getCountryName(cc) {
	return countries[cc.toUpperCase()] || 'N/A';
}

/*
* showStats(values) - Shows the stats for each country
*
* @requires values object { "??": 1 }
*/
function showStats(values = {}) {
	// Try to reset map
	try {
		var map = $$('#preview').first().getSVGDocument();
		var allCountries = Object.keys(countries);
		for (var i = allCountries.length - 1; i >= 0; i--) {
			try {
				map.querySelector('[cc=' + allCountries[i].toLowerCase() + ']').style.fill = '#000';
			} catch (err) {
				// Soft fail
			}
		}
	} catch (err) {
		// Soft fail
	}
	// Get Variables
	var statsCC = Object.keys(values);
	var max = 0;
	var min;
	var htmlList = '';
	var sorted = [];
	// Get the html ready
	for (var i = statsCC.length - 1; i >= 0; i--) {
		// Update max min
		max = Math.max(max, values[statsCC[i]])
		if (min === undefined) {
			min = values[statsCC[i]];
		} else {
			min = Math.min(min, values[statsCC[i]])
		}
		// Prepare to sort
		sorted.push([getCountryName(statsCC[i]), values[statsCC[i]]]);
	}
	sorted.sort(function(a, b) {
		return a[1] - b[1];
	});
	for (var i = sorted.length - 1; i >= 0; i--) {
		// Add HTML
		htmlList += '<tr><td>' + sorted[i][1] + '</td><td>';
		htmlList += sorted[i][0] + '</td></tr>';
	}
	// Load the html
	$$('tbody').html(htmlList);
	// Update the map
	var delta = 0;
	if (min !== undefined) {
		delta = max - min;
	}
	try {
		var map = $$('#preview').first().getSVGDocument();
		for (var i = statsCC.length - 1; i >= 0; i--) {
			if (statsCC[i] != '??' && statsCC[i] != 'XX') {
				var strength = (delta > 0 ? ((values[statsCC[i]] - min) / delta) * 255 : 255);
				map.querySelector('[cc=' + statsCC[i].toLowerCase() + ']').style.fill = 'rgb(' + (255 - strength) + ',' + strength + ',0)';
			}
		}
	} catch (err) {
		msg('Couldn\'t paint the map');
	}
}

/*
* resetUI() - Reset UI
*/
function resetUI() {
	$$('.tabf').addClass('d');
	$$('#stats-tab, #edit-tab, #delete-tab, form[for=stats], .view, #delete').addClass('h');
	$$('.tabf').addClass('btn--gray');
	$$('.tabf').removeClass('btn--blue');
	$$('#delete').first().disabled = true;
}

/*
* getStats(passwd) - gets and loads the stats
*
* @requires passwd String with password 
*/
function getStats(passwd = false) {
	$$('#stats-tab').addClass('d');
	if (passwd) $$('.pass[for=stats]').addClass('h');
	apiStats(function(out) {
			if (out !== false) {
				if (passwd) $$('.view').removeClass('h');
				showStats(out);
			} else {
				if (passwd) $$('.pass[for=stats]').removeClass('h');
			}
			// Enable button
			$$('#stats-tab').removeClass('d');
		}, hashedLink, passwd);
}

$$().ready(function() {
	// Hide the alert on click
	$$('#alert').onClick(function() {
		closeAlert();
	});
	// Set a watch for tab change
	$$('.tabf').onClick(function(e) {
		e.preventDefault();
		// Is active
		var isActive = this.classList.contains('btn--blue');
		// Get target
		var target = this.getAttribute('for');
		var allButtons = $$('.tabf'); 
		// Change menu item
		allButtons.addClass('btn--gray');
		allButtons.removeClass('btn--blue');
		if (!isActive) this.classList.remove('btn--gray');
		if (!isActive) this.classList.add('btn--blue');
		// Change tab item
		$$('.tabt > div').addClass('h');
		if (!isActive) $$('#' + target + '-tab').removeClass('h');
	});
	// Toggle an option
	$$('input[type="checkbox"]').event('change', function() {
		// Disable/Enable based on if this is checked
		var target = this.getAttribute('for');
		if (target !== null) $$('#' + target).first().disabled = !this.checked;
		if (target === 'edit' && $$('#optStats').first().checked) $$('#optStats').select();
		if (target === 'stats') {
			if (this.checked) {
				$$('#clicks').first().min = 10;
			} else {
				$$('#clicks').first().min = 1;
			}
			if ($$('#optEdit').first().checked) $$('#optEdit').select();
		}
	});
	// Get stats with password
	$$('form[for=stats]').event('submit', function(event) {
		event.preventDefault();
		getStats($$('#stats').val());
	});
	// Delete Link
	$$('form[for=delete]').event('submit', function(event) {
		event.preventDefault();
		$$('#body').removeClass('d');
		apiDel(function(deleted) {
			if (deleted) {
				// Deleted Successfully
				resetUI();
			}
			$$('#body').removeClass('d');
		}, hashedLink, ($$('#delete').first().disabled ? false : $$('#delete').val()));
	});
	// Load options
	$$('form[for=link]').event('submit', function(event) {
		event.preventDefault();
		// Lock && Reset UI
		$$('#body').addClass('d');
		resetUI();
		// Prepare link
		link = $$('#link').val();
		hashedLink = hash(link);
		// Get options
		apiOpt(function(opt) {
			if (opt) {
				if (opt.includes('e')) {
					// Edit
					$$('.tabf[for=edit]').removeClass('d');
				}
				if (opt.includes('_s')) {
					// Public Stats
					$$('.tabf[for=stats]').removeClass('d');
					$$('.view').removeClass('h');
					// Get stats now
					getStats();
				} else if (opt.includes('s')) {
					// Private Stats
					$$('.tabf[for=stats]').removeClass('d');
					$$('form[for=stats]').removeClass('h');
				}
				if (opt.includes('_d')) {
					$$('.tabf[for=delete]').removeClass('d');
					// Public Delete
				} else if (opt.includes('d')) {
					// Private Delete
					$$('.tabf[for=delete]').removeClass('d');
					$$('#delete').removeClass('h');
					$$('#delete').first().disabled = false;
				}
			}
			// Unlock UI
			$$('#body').removeClass('d');
		}, hashedLink);
	});
	// Get the link from the hash
	link = window.location.hash;
	// Check if link is present
	if (link) {
		// If link exists, load stats
		link = link.substr(1);
		$$('#link').val(link);
		$$('#load').select();
	}
});