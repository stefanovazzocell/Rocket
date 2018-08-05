'use strict';

var selected = 'stats';
var globalLink = '';
var globalOpt = [];

// Country Codes -> Names
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
		var map = $$('#worldMap').first().getSVGDocument();
		var allCountries = Object.keys(countries);
		for (var i = allCountries.length - 1; i >= 0; i--) {
			try {
				map.querySelector('[cc=' + allCountries[i].toLowerCase() + ']').style.fill = '#000';
			} catch (err) {
				// Failed ....
			}
		}
	} catch (err) {
		// Failed...
	}
	// Get Variables
	var statsCC = Object.keys(values);
	var max = 0;
	var min;
	var htmlList = '';
	// Get the html ready
	for (var i = statsCC.length - 1; i >= 0; i--) {
		// Update max min
		max = Math.max(max, values[statsCC[i]])
		if (min === undefined) {
			min = values[statsCC[i]];
		} else {
			min = Math.min(min, values[statsCC[i]])
		}
		// Add HTML
		htmlList += '<li class="list-group-item d-flex justify-content-between align-items-center">';
		htmlList += getCountryName(statsCC[i]);
		htmlList += '<span class="badge badge-primary badge-pill">' + values[statsCC[i]] + '</span></li>';
	}
	// Load the html
	$$('#countriesList').html(htmlList);
	// Update the map
	var delta = 0;
	if (min !== undefined) {
		delta = max - min;
	}
	try {
		var map = $$('#worldMap').first().getSVGDocument();
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
* resetUI() - Resets the UI to the initial state (all disabled / hidden)
*/
function resetUI() {
	$$('#optionsTab').addClass('hidden');
	$$('.optTab').addClass('hidden');
	$$('#statsView').addClass('hidden');
	$$('#statsPass').addClass('hidden');
	$$('#inputDelPass').addClass('hidden');
	$$('.tabSwitch').addClass('disabled');
	$$('input[type=number]').val(1);
	$$('input[type=password]').val('');
	$$('input[type=url]').val('');
	$$('textarea').val('');
	globalLink = '';
	globalOpt = [];
}

// When page ready start functions
$$().ready(function() {
	// Enable checkboxes
	applyToAll(toggleInput, [['Clicks',[]],['Url',['Text']],['Text',['Url']]]);
	// Handle tab switching
	$$('.tabSwitch').onClick(function(event) {
		// Prevent default
		event.preventDefault();
		// Check if active
		if (! event.target.classList.contains('disabled')) {
			// Clear all
			$$('.tabSwitch').removeClass('active');
			applyToAll(function(elem) {
				$$('#' + elem + 'Tab').addClass('hidden');
			}, ['stats', 'del', 'edit']);
			// Update selected
			selected = this.getAttribute('for');
			// Activate
			this.classList.add('active');
			$$('#' + selected + 'Tab').removeClass('hidden');
		}
	});
	// Handle URL Fetch
	$$('#btnManage').onClick(function() {
		// Disabled button
		$$('#btnManage').addClass('hidden');
		// Resets the UI
		resetUI();
		// Saves the link as global
		globalLink = hash($$('#inputLink').val());
		// Queries link info
		apiOpt(function(options) {
			if (options !== false) {
				// Update Edit
				if (options.includes('e')) {
					// Edit
					// Allow selection of edit
					$$('#EditSelector').removeClass('disabled');
				}
				// Update Delete
				if (options.includes('_d')) {
					// Public Delete
					// Allow selection of stats
					$$('#DelSelector').removeClass('disabled');
				} else if (options.includes('d')) {
					// Private Delete
					$$('#inputDelPass').removeClass('hidden');
					// Allow selection of stats
					$$('#DelSelector').removeClass('disabled');
				}
				// Update General UI
				if (options.includes('s')) {
					// Allow selection of stats
					$$('#StatsSelector').removeClass('disabled');
					// Set active tab
					$$('#StatsSelector').addClass('active');
					// Show Stats tab
					$$('#statsTab').removeClass('hidden');
				} else if (options.includes('d')) {
					// Set active tab
					$$('#delSelector').addClass('active');
					// Show Stats tab
					$$('#delTab').removeClass('hidden');
				} else if (options.includes('e')) {
					// Set active tab
					$$('#editSelector').addClass('active');
					// Show Edit tab
					$$('#editTab').removeClass('hidden');
				}
				// Update Stats
				if (options.includes('_s')) {
					// Public Stats
					$$('#statsView').removeClass('hidden');
					// Load Stats
					apiStats(function(output) {
						if (output !== false) {
							showStats(output);
						}
						// Enable button
						$$('#btnManage').removeClass('hidden');
					}, globalLink)
				} else if (options.includes('s')) {
					// Private Stats
					$$('#statsPass').removeClass('hidden');
					// Enable button
					$$('#btnManage').removeClass('hidden');
				} else {
					// Enable button
					$$('#btnManage').removeClass('hidden');
				}
				// Enabled Options
				$$('#optionsTab').removeClass('hidden');
			} else {
				// Enable button
				$$('#btnManage').removeClass('hidden');
			}
		}, globalLink);
	});
	$$('#btnDelete').onClick(function() {
		if (options.includes('_d')) {
			// Public Delete
			apiDel(function(result) {
				if (result) {
					resetUI();
				}
			}, globalLink);
		} else {
			// Private Delete
			apiDel(function(result) {
				if (result) {
					resetUI();
				}
			}, globalLink, $$('#inputDelPass').val())
		}
	});
});