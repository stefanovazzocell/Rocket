/*
* apiGet() - Performs a GET request
*/
function apiGet() {
	// Get the link from the hash
	var link = window.location.hash;
	// Check if link is present
	if (!link) {
		// If link not available, redirect
		window.location.replace('/create');
	}
}