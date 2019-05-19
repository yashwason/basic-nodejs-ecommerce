const mongoose = require(`mongoose`),
    bcrypt = require(`bcrypt-nodejs`);

const UserSchema = new mongoose.Schema({
    email: {type: String, required: true},
    password: {type: String, required: true}
});

UserSchema.methods.encryptPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};

UserSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

module.exports = mongoose.model(`User`, UserSchema);