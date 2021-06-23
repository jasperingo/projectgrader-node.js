


function auth(type, redirectOnSuccess) {

	return (req, res, next) => {

		if (redirectOnSuccess && req.session[type]) {
			res.redirect('./');
		} else if (!redirectOnSuccess && !req.session[type]) {
			res.redirect('login');
		} else {
			next();
		}

	}

}


module.exports = auth;


