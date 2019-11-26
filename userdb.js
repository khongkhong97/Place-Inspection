var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
    email: String,
    password: String    
})

var user = mongoose.model('user', userSchema , 'user');
module.exports = user;
