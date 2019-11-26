var mongoose = require('mongoose');

var travelSchema = new mongoose.Schema({
    name: String,
    origin: String,
    description: String,
    url: String
})

var place = mongoose.model('place', travelSchema , 'try');
module.exports = place;
