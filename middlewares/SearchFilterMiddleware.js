

function filer(filterBy) {

	return (req, res, next) => {

		var page = req.query[filterBy];

		next();
	}
}


module.exports = filter;





