const createError = require('http-errors'),
    express = require('express'),
    path = require('path'),
    cookieParser = require('cookie-parser'),
    bodyParser = require(`body-parser`),
    session = require(`express-session`),
    logger = require('morgan'),
    mongoose = require(`mongoose`),
    passport = require(`passport`),
    flash = require(`connect-flash`),
    validator = require(`express-validator`),
    MongoStore = require(`connect-mongo`)(session);

const routes = require('./routes/index'),
	userRoutes = require(`./routes/user`);


const app = express();

mongoose.connect(`mongodb://localhost:27017/demo_shop`, {
	useNewUrlParser: true
});
// Configurating Passport
require(`./config/passport`);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(session({
    secret: `YeahYeahYeahYoYoYO`,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    cookie: {maxAge: 180 * 60 * 1000}
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); 
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    res.locals.isLoggedIn = req.isAuthenticated();
    res.locals.session = req.session;
    res.locals.cartSession = req.session.cart;
    next();
});

app.use(`/user`, userRoutes);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
