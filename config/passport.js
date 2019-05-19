const passport = require(`passport`),
    User = require(`../models/user`),
    localStrategy = require(`passport-local`).Strategy;

passport.serializeUser((user, done) => {
    done(null, user.id);
});
passport.deserializeUser((id, done) => {
    User.findById(id, (err, user) => {
        done(err, user);
    });
});

const strategyOptions = {
    usernameField: `email`,
    passwordField: `password`,
    passReqToCallback: true
};

passport.use(`local.signup`,
new localStrategy(strategyOptions, async (req, email, password, done) => {
    let validationResult = await validateUserData(req, done);
    if(validationResult === `ok`){
        User.findOne({'email': email})
        .then((user) => {
            if(user) return done(null, false, {message: `Email is already in use!`});
            const newUser = new User();
            newUser.email = email;
            newUser.password = newUser.encryptPassword(password);
            return newUser.save();
        })
        .then((newUser) => {
            done(null, newUser);
        })
        .catch((err) => {
            return done(err);
        });
    }
}));


passport.use(`local.signin`,
new localStrategy(strategyOptions, async (req, email, password, done) => {
    let validationResult = await validateUserData(req, done);
    if(validationResult === `ok`){
        User.findOne({'email': email})
        .then((user) => {
            if(!user){
                return done(null, false, {message: `No user found`});
            }
            if(!user.validPassword(password)){
                return done(null, false, {message: `Wrong Password`});
            }
            return done(null, user);
        })
        .catch((err) => {
            return done(err);
        });
    }
}));


function validateUserData(req, done){
    req.checkBody(`email`, `Invalid Email`).notEmpty().isEmail();
    req.checkBody(`password`, `Invalid Password`).isLength({min:6});
    let errors = req.validationErrors();
    let messages = [];
    if(errors.length > 0){
        errors.forEach((error) => {
            messages.push(error.msg);
        });
        return done(null, false, req.flash(`error`, messages));
    }
    return `ok`;
}