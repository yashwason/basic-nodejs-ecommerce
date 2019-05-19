exports.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	return res.redirect(`/user/signin`);
}

exports.handleAuthRedirect = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}

	req.session.oldUrl = req.url;
	res.redirect(`/user/signin`);
}

exports.redirectAuthUser = function(req, res, next){
	if(req.session.oldUrl){
		const oldUrl = req.session.oldUrl;
		req.session.oldUrl = null;
		return res.redirect(oldUrl);
	}
	return res.redirect(`/user/profile`);
}