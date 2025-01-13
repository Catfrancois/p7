const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: function (email) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
            },
            message: 'Format invalide'
        }
    },
    password: {
        type: String,
        required: true
    }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
