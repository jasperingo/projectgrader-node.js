'use strict'


var bcrypt = require('bcrypt');



function hashPassword(password, callback) {
	return bcrypt.hash(password, 10);
};

function comparePassword(plain, hash) {
    return bcrypt.compare(plain, hash);
};



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



function sessionSetter(req, type, data) {
	req.session[type] = { 
  	 	id : data.id,
  	 	name : data.name
  	};
}


function postFlasher (body, errs=[], form=null) {

	var inputs = Object.entries(body);

	var formData = {};

	for (let [i, v] of inputs) {
	    formData[i] = {value : v};
	    for (let e of errs) {
	    	if (i == e.param) {
	    		formData[i].error = e.msg;
		    }
		}
	}

	if (form && form.error) {
		formData.form_error = form.error;
	}

	if (form && form.success) {
		formData.form_success = form.success;
	}

	return formData;
}



module.exports = {
	getPagination,
	postFlasher,
	hashPassword,
	comparePassword,
	sessionSetter
}











