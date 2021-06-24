'use strict'


function getPagination(page, maxPages, url) {
	
	var data = { page, url };

	
	if (page-1 < 1) {
		data.previous = false;
	} else {
		data.previous = true;
	}
	
	if (page == 1) {
		data.start = 1;
	} else if (page >= maxPages) {
		if (maxPages > 2) {
			data.start = maxPages-2;
		} else {
			data.start = 1;
		}
	} else {
		data.start = page-1;
	}
	
	if (maxPages == 0) {
		data.len = 0;
	} else if (maxPages < 3) {
		data.len = maxPages+1;
	} else {
		data.len = data.start+3;
	}
	
	
	if (page+1 > maxPages) {
		data.next = false;
	} else {
		data.next = true;
	}
	
	return data;
}







module.exports = {
	getPagination
}











