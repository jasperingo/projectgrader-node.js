


function auth(type, redirectOnSuccess) {

	return (req, res, next) => {

		if (redirectOnSuccess && req.session[type]) {
			res.redirect(req.baseUrl);
		} else if (!redirectOnSuccess && !req.session[type]) {
			res.redirect(`${req.baseUrl}/login`);
		} else {
			next();
		}

	}

}


module.exports = auth;



