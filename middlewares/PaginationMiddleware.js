

function pager(limit=2) {

	return (req, res, next) => {

		var page = req.query.page == undefined ? 1 : parseInt(''+req.query.page.replace(/[^0-9]/, ''));

		if (isNaN(page) || page <= 1) 
			page = 0;
		else
			page = (page * limit)-limit;

		req.myPager = [page, limit];

		next();
	}
}


module.exports = pager;






