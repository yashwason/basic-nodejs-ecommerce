const express = require(`express`),
    router = express.Router(),
    csrf = require(`csurf`),
	passport = require(`passport`),
	Order = require(`../models/order`),
	Cart = require(`../models/cart`);
	
const authMiddleware = require(`../middleware/auth`);

const csrfProtection = csrf();
router.use(csrfProtection);

router.get(`/signup`,
(req, res) => {
	res.render(`user/signup`, {
		docTitle: `Register Account`,
		csrfToken: req.csrfToken(),
		messages: req.flash(`error`)
	});
});

router.post(`/signup`,
passport.authenticate(`local.signup`, {
	failureRedirect: `/user/signup`,
	failureFlash: true
}),
authMiddleware.redirectAuthUser);

router.get(`/signin`,
(req, res) => {
	res.render(`user/signin`, {
		docTitle: `Login to Account`,
		csrfToken: req.csrfToken(),
		messages: req.flash(`error`)
	});
});

router.post(`/signin`,
passport.authenticate(`local.signin`, {
	failureRedirect: `/user/signin`,
	failureFlash: true
}),
authMiddleware.redirectAuthUser);

router.get(`/logout`,
(req, res) => {
	req.logout();
	res.redirect(`/`);
});

router.get(`/profile`,
authMiddleware.isLoggedIn,
(req, res) => {
	Order.find({user: req.user}, (err, orders) => {
		if(err){
			return res.send(err);
		}
		let cart;
		orders.forEach((order) => {
			cart = new Cart(order.cart);
			order.items = cart.generateArray();
		});
		console.log(orders);
		res.render(`user/profile`, {
			docTitle: `User Profile`,
			orders: orders
		});
	});
});


module.exports = router;