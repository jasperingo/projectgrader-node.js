


function auth(type, shouldNotLogin) {

	return (req, res, next) => {

		if (!Array.isArray(type)) {
			type = [type]
		}
		
		var found = false;
		
		if (req.session.user) {
			for (let t of type) {
				if (req.session.user.type == t) {
					found = true;
					break;
				}
			}
		}
		

		if (shouldNotLogin && found) {
			res.redirect(req.baseUrl);
		} else if (!shouldNotLogin && !found) {
			res.redirect(`/${type[0]}/login`);
		} else {
			next();
		}

	}

}


module.exports = auth;



