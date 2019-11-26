var mongoose = require('mongoose');

var searchHistorySchema = new mongoose.Schema({
    email: String,
    place: String,
    lat: String,
    long: String,
    attraction1: String,
    attraction2: String,
    attraction3: String,
    attraction4: String,
    attraction5: String,
    restaurant1: String,
    restaurant2: String,
    restaurant3: String,
    restaurant4: String,
    restaurant5: String,
    weather: String,
    humidity: String,
    pressure: String,
    temperature: String,
    wind: String,
    dateCreated: Date
})

var searchHistory = mongoose.model('searchHistory', searchHistorySchema , 'searchHistory');
module.exports = searchHistory;
