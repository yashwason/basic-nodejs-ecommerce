const express = require('express'),
	router = express.Router(),
	Product = require(`../models/product`),
	Cart = require(`../models/cart`),
	Order = require(`../models/order`);

const authMiddleware = require(`../middleware/auth`);

// Routes
router.get('/', async (req, res) => {
	let successMsg = req.flash(`success`)[0];
	let products = await Product.find()
	res.render('shop/home', {
		docTitle: 'Game Shop',
		products: products,
		successMsg: successMsg
	});
});

router.get(`/add-to-cart/:id`, (req, res) => {
	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	Product.findById(productId)
	.then((product) => {
		cart.add(product, productId);
		req.session.cart = cart;
		res.redirect(`/`);
	})
	.catch((err) => {
		console.log(`Error finding product: ${err}`);
	});
});

router.get(`/reduce/:id`, (req, res, next) => {
	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.reduceByOne(productId);
	req.session.cart = cart;
	res.redirect(`/cart`);
});

router.get(`/remove/:id`, (req, res, next) => {
	let productId = req.params.id;
	let cart = new Cart(req.session.cart ? req.session.cart : {});

	cart.removeItem(productId);
	req.session.cart = cart;
	res.redirect(`/cart`);
});

router.get(`/cart`, (req, res) => {
	if(!req.session.cart){
		return res.render(`shop/cart`, {
			docTitle: `Game Cart`,
			products: null
		});
	}
	let cart = new Cart(req.session.cart);
	res.render(`shop/cart`, {
		docTitle: `Game Cart`,
		products: cart.generateArray(),
		totalPrice: cart.totalPrice
	});
});

router.get(`/checkout`,
authMiddleware.handleAuthRedirect,
(req, res) => {
	if(!req.session.cart){
		return res.redirect(`/cart`);
	}
	let cart = new Cart(req.session.cart);
	let errMsg = req.flash(`error`)[0];

	res.render(`shop/checkout`, {
		docTitle: `Checkout`,
		total: cart.totalPrice,
		errMsg: errMsg
	});
});

router.post(`/checkout`,
authMiddleware.handleAuthRedirect,
(req, res) => {
	if(!req.session.cart){
		return res.redirect(`/cart`);
	}

	let cart = new Cart(req.session.cart);
	const stripe = require('stripe')('sk_test_VxesPDiZrOZOT6bGT6wZWV7200SoChqEoG');

	stripe.charges.create({
		amount: cart.totalPrice * 100,
		currency: `usd`,
		description: `Test Charge`,
		source: req.body.stripeToken,
	}, (err, charge) => {
		if(err){
			req.flash(`error`, err.message);
			return res.redirect(`/checkout`);
		}

		let order = new Order({
			user: req.user,
			cart: cart,
			address: req.body.address,
			name: req.body.name,
			paymentId: charge.id
		});
		order.save((err, result) => {
			if(err){
				console.log(err);
				return res.redirect(`/checkout`);
			}
			req.flash(`success`, `Order placed successfully`);
			req.session.cart = null;
			res.redirect(`/`);
		});
	});
});


module.exports = router;