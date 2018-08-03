'use strict';

/*
* NJQ (Version 0.1.0)
* by Stefano Vazzoler (stefanovazzocell@gmail.com)
* https://stefanovazzoler.com/
*/

(function(window,document,undefined){
	var $$ = function(selector) {
		if (!(this instanceof $$)) // If it's a new instance,
			return new $$(selector); // initialize it with the given selector
		if (typeof selector == 'string') { // If selector has string
			this.selector = document.querySelectorAll(selector); // Attempt to find it
		} else this.selector = selector; // Else, just assume it to be a valid obj
	};
	window.$$ = $$;
	$$.fn = $$.prototype = {
		/*
		* ready(callback) - Executes callback when document is loaded
		* 
		* @param callback is a function that will be called when DOM Loaded
		*/
		ready: function (callback) {
			if(document.readyState === 'interactive' || document.readyState === 'complete') {
				try {
					callback(); // Try calling the callback
				} catch(error) { // Otherwise log error
					console.warn('$$.ready(callback) - callback throwed error:');
					console.error(error);
				}
			} else document.addEventListener('DOMContentLoaded', callback);
		},
		/*
		* each(fn) - Calls a given function on every selected element
		* 
		* @param fn is a function with two parameters: an element and a index number
		*/
		each: function (fn) {
			if (this.selector == null) return; // If null stop execution
			try {
				Array.from(this.selector).forEach(fn); // Assume is an NodeList
			} catch (error) {
				fn(this.selector,0);
			}
		},
		/*
		* log() - Prints every element that is currently selected on the console
		*         NOTE: This is primarly for debugging purposes
		*/
		log: function () {
			this.each(function (element, index) { // Loop through every element
				console.log('Element ' + index + ' is ' + element); // Log the element
			});
		},
		/*
		* first() - Return the first selected element
		* 
		* @return selector is the first selector in the list
		*/
		first: function () {
			var toReturn = null;
			try {
				toReturn = this.selector[0]; // Try to get the first element in the list
			} catch (error) {
				try {
					toReturn = this.selector; // Try to get the only selector
				} catch (newError) {
					console.error('$$.first() - No element selected');
				}
			}
			return toReturn;
		},
		/*
		* select() - Simulates an user click on the element
		*/
		select: function () {
			this.first().click(); // Click on the first element
		},
		/*
		* html(newHtml) - Sets OR returns the inner HTML
		*                 IF parameter passed, changes the inner html of each element selected
		*                 ELSE returns the inner HTML of the first element selected, if any
		* 
		* @param  newHtml (optinal) new html for elements
		* @return html if no parameter is passed, returns first element's html
		*/
		html: function (newHtml) {
			if (newHtml == undefined) return this.first().innerHTML; // Returns the innerHTML for the first element
			this.each(function (element) {	
				element.innerHTML = newHtml; // Set the inner html given parameter
			});
		},
		/*
		* addClass(newClass) - Adds a given class to every selected element
		* 
		* @param  class string containing the name of the class to add
		*/
		addClass: function (newClass) {
			this.each(function (element) { // Go to each element
				element.classList.add(newClass); // Add the given class to the element
			});
		},
		/*
		* removeClass(oldClass) - Removes a given class to every selected element
		* 
		* @param  class string containing the name of the class to remove
		*/
		removeClass: function (oldClass) {
			this.each(function (element) { // Go to every selected element
				element.classList.remove(oldClass); // Remove the given class
			});
		},
		/*
		* toggleClass(className) - Toggles a given class to every selected element
		* 
		* @param  class string containing the name of the class to toggle
		*/
		toggleClass: function (className) {
			this.each(function (element) { // For each element
				element.classList.toggle(className); // Toggle the class
			});
		},
		/*
		* style(property, newValue) - Sets OR returns the given style property
		*                 IF newValue passed, changes all the instances to the new newValue
		*                 ELSE returns the velue for the given style property of the first element
		* 
		* @param  property is a style property
		* @param  newValue (optinal) new value to appy
		* @return string if no newValue parameter, returns first element's property's value
		*/
		style: function (property, newValue) {
			if (newValue == undefined) return this.first().style[property]; // If no newValue, reurn the property
			this.each(function (element) { // Otherwise, 
				element.style[property] = newValue; // Set the new value
			});
		},
		/*
		* val(newValue) - Gets the value of the first selected element
		*                 or changes all the selected elements values to the given
		* 
		* @param  newValue (optional) string with the new value's name
		* @return string if no new value given, returns cirrent value
		*/
		val: function (newValue) {
			if (newValue == undefined) return this.first().value; // Get the value of the first element
			this.each(function (element) {
				element.value = newValue; // Sets the vealue of every element selected
			});
		},
		/*
		* prop(property, newValue) - Gets the requested attribute of the first selected element
		*                 or changes all the selected elements values to the given
		* 
		* @param  newValue (optional) string with the new attribute's value
		* @return string with the current attribute if no newValue set
		*/
		prop: function (property, newValue) {
			if (newValue == undefined) return this.first().getAttribute(property); // Gents the prop of first
			this.each(function (element) {property
				element.setAttribute(property, newValue); // Sets the property of every element
			});
		},
		/*
		* event(event, callback) - Sets a callback for an event
		* 
		* @param  event string that specificies which event to attach che callback to
		* @param  callback function to call back
		*/
		event: function (event, callback) {
			this.each(function (element) { // For every element
				element.addEventListener(event, callback); // Sets the listener and passes the callback
			});
		},
		/*
		* onClick(callback) - Sets a click callback
		* 
		* @param  callback function to callback
		*/
		onClick: function (callback) {
			this.event('click', callback); // Sets a click callback
		},
		/*
		* post(url, data, onSuccess, onFail, isJson) - Performs a POST request
		* 
		* @param  url string the url that is being called
		* @param  data (optional) object containing the body of the post request
		* @param  onSuccess(response,xhr) (optional) function called if success
		* @param  onFail(xhr) (optional) function function called in case of failure
		* @param  isJson (optional) bool true if there is the need to encode data as json, false otherwise
		*/
		post: function (url, data={}, onSuccess=function(){}, onFail=function(){console.error('NJQ POST Error');}, isJson=false) {
			this.ajax(url, 'POST', data, onSuccess, onFail, '', isJson); // Make ajax POST request
		},
		/*
		* get(url, data, onSuccess, onFail) - Performs a GET request
		* 
		* @param  url string the url that is being called
		* @param  data (optional) object containing the data of the get request (passed as parameters)
		* @param  onSuccess(response,xhr) (optional) function called if success
		* @param  onFail(xhr) (optional) function function called in case of failure
		*/
		get: function (url, data={}, onSuccess=function(){}, onFail=function(){console.error('NJQ POST Error');}) {
			var par = '';
			if (!this.isEmptyObject(data)) { // If any data is passed
				par = '?' + this.encodeDataForURI(data); // Add to par after encoding it
			}
			this.ajax(url + par, 'GET', {}, onSuccess, onFail); // Make ajax GET request
		},
		/*
		* ajax(url, method, data, onSuccess, onFail, contentType, isJson) - Performs a request
		* 
		* @param  url string the url that is being called
		* @param  method (optional) string specifies the method of the request
		* @param  data (optional) object containing the body of the ajax request
		* @param  onSuccess(response,xhr) (optional) function called if success
		* @param  onFail(xhr) (optional) function function called in case of failure
		* @param  contentType (optional) string specifies the content type header
		* @param  isJson (optional) bool true if data is json, false otherwise
		a*/
		ajax: function (url, method='GET', data={}, onSuccess=function(){}, onFail=function(){console.error('NJQ Ajax Error');}, contentType='', isJson=false) {
			var xhr = new XMLHttpRequest(); // Initialize a XMLHttpRequest
			if (method == 'GET' && !this.isEmptyObject(data)) method='POST'; // Try to guess the method
			xhr.open(method, url); // Prepare the request - isJson
			// Try to guess the content type header
			if (contentType == '' && method == 'POST' && !isJson) contentType = 'application/x-www-form-urlencoded'; // "application/json"
			if (contentType == '' && method == 'POST' && isJson) contentType = 'application/json';
			// Set the header if necessary
			if (contentType != '') xhr.setRequestHeader('Content-Type', contentType);
			xhr.onload = function() { // Prepares the request callbacks
				if (xhr.status === 200) { // If successful
					onSuccess(xhr.responseText, xhr); // Callback to onSuccess
				} else onFail(xhr); // else callback to onFail
			};
			if (data != {}) { // If there is any data to pass in the body
				if (isJson) {
					xhr.send(JSON.stringify(data)); // Send the encoded URI back (json mode)
				} else xhr.send(this.encodeDataForURI(data)); // Send the encoded URI back
			} else {
				xhr.send(); // Else, just send the request
			}
		},
		/*
		* encodeDataForURI(data) - Encodes the data for URI
		* 
		* @param  data (optional) object containing the data to encode
		* @return string with the data object encoded for URI
		*/
		encodeDataForURI: function (data={}) {
			var out = new Array();
			for(var key in data){ // Add all data in an array
				out.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
			}
			return encodeURI(out.join('&')); // Return the value by joining it
		},
		/*
		* isEmptyObject(obj) - Checks if an object is empty
		* 
		* @param  obj object containing the data to check
		* @return boolean true if is empty and false if has element
		*/
		isEmptyObject: function (obj) {
			for (var key in obj) {
				return false; // If any key is found
			}
			return true;
		}
	};
})(this,document);