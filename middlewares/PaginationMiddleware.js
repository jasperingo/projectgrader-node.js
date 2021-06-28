'use strict'

function pager(limit=2) {

	return (req, res, next) => {

		var page = req.query.page == undefined ? 1 : parseInt(''+req.query.page.replace(/[^0-9]/, ''));
		
		if (isNaN(page) || page <= 1) 
			var start = 0;
		else
			var start = (page * limit)-limit;

		req.pager = { page, start, limit, pagination : [start, limit] };

		next();
	}
}


module.exports = pager;






