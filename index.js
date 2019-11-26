const express = require('express')
const path = require('path')
const PORT = process.env.PORT || 5000
const axios = require('axios')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const session = require('express-session')

const db = "mongodb+srv://admin:admin@cluster0-6lzi6.mongodb.net/travelPlanner?retryWrites=true&w=majority"

mongoose.connect(db,{useUnifiedTopology: true,useNewUrlParser: true}).then(() =>{
    console.log('connected');
})

express()
    .use(express.static(path.join(__dirname, 'public')))
    .use(bodyParser())
    .use(session({secret: 'khong', saveUninitialized: true, resave: true}))
    .set('views', path.join(__dirname, 'views'))
    .set('view engine', 'ejs')
    .get('/', (req, res) => {
      res.render('pages/index',{
        id: req.session.Email
      })
    })
    
    .post('/search', (req, res) => {
        var lat = req.body.loc_lat
        var lon = req.body.loc_long
        var weatherapikey = '4de3768c62b67fe359758977a3efc069'
        var weatherapiString = 'http://api.openweathermap.org/data/2.5/weather?appid='+weatherapikey+'&lat='+lat+'&lon='+lon +'&units=metric'

        var googleApikey = 'AIzaSyD8GKLdUMBFIADPCKzFg-6_AmbuFv1TdJU'
        var googleAttractionapiString = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lon+'&radius=1500&type=attraction&key='+googleApikey
        
        var googleRestaurantapiString = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?location='+lat+','+lon+'&radius=1500&type=restaurant&key='+googleApikey
        axios.get(weatherapiString).then(response=>{
            axios.get(googleAttractionapiString).then(response2=>{
                axios.get(googleRestaurantapiString).then(response3=>{
                res.render('pages/result',{
                    weather: response.data,
                    attraction: response2.data.results,
                    restaurant: response3.data.results,
                    id: req.session.Email
                })
            })
            })            
        })

    })

    .get('/login', (req, res) => {
      res.render('pages/login',{
        id: req.session.Email
      });
    })
    .get('/viewRecentPlace', (req, res) => {
      var retrieveRecentDetails = require('./saveHistoryDb');
      retrieveRecentDetails.find({
        email: req.session.Email
      })
      .then((response) =>{
        res.render('pages/viewRecentPlace',{
          tempplace: response, 
          id: req.session.Email
        });
      })
    })

    .get('/register', (req, res) => {
      res.render('pages/register',{
        id: req.session.Email
      });
    })
    .post('/signup', (req,res) => {
      var newuser = require('./userdb');
      user = new newuser({
      email: req.body.Email,
      password: req.body.Password
      })
      user.save().then((result) => {
        console.log("Insert Sucessful");
    })
  })    // Redirect to home page
  .get('/logout', (req, res) => {
    req.session.destroy();    // Destroy session before redirect
    console.log('session destroy');
    res.render("pages/index",{
      id: req.body.Email
    });
})
    .post('/signin', (req,res) => {
      var user = require('./userdb');
      user.find({
        email: req.body.Email,
        password: req.body.Password
      })
      .then ((response) => {
        req.session.Email = response[0].email;
        res.render('pages/index',{
          id: req.session.Email
        });
      })
      .catch((error) =>{
        console.log("user not found");
        alert("Wrong Password or Email not registered");
        res.redirect("login");
        return false;
      })
    })
    .post('/saveDetails', (req, res) => {
      var saveSearchHistory = require('./saveHistoryDb');
      saveSearchHistory = new saveSearchHistory({
        email: req.body.user_email,
        place: req.body.location_name,
        lat: req.body.loc_lat,
        long: req.body.loc_long,
        attraction1: req.body.attraction1,
        attraction2: req.body.attraction2,
        attraction3: req.body.attraction3,
        attraction4: req.body.attraction4,
        attraction5: req.body.attraction5,
        restaurant1: req.body.restaurant1,
        restaurant2: req.body.restaurant2,
        restaurant3: req.body.restaurant3,
        restaurant4: req.body.restaurant4,
        restaurant5: req.body.restaurant5,
        weather: req.body.weather,
        humidity: req.body.humidity,
        pressure: req.body.pressure,
        temperature: req.body.temperature,
        wind: req.body.wind,
        dateCreated: req.body.dateCreated
      })
      saveSearchHistory.save().then((result) => {
        console.log("Save Location Sucessful");
        res.redirect('/')
      })
    })
    .post('/viewDetailPlaceHistory', (req, res) => {
      var retrieveRecentDetails = require('./saveHistoryDb');
      retrieveRecentDetails.find({
        email: req.session.Email
      })
      .then((response) =>{
        res.render('pages/viewDetailRecentPlace',{
          tempplace: response, 
          id: req.session.Email,
          arrayindex: req.body.uid
        });
      })
    })
    .post('/deleteDetails', (req, res) => {
      var deleteSearchHistory = require('./saveHistoryDb');
      // saveSearchHistory.remove({
      //   email: req.body.user_email,
      //   place: req.body.location_name,
      //   lat: req.body.loc_lat,
      //   long: req.body.loc_long,
      //   attraction1: req.body.attraction1,
      //   attraction2: req.body.attraction2,
      //   attraction3: req.body.attraction3,
      //   attraction4: req.body.attraction4,
      //   attraction5: req.body.attraction5,
      //   restaurant1: req.body.restaurant1,
      //   restaurant2: req.body.restaurant2,
      //   restaurant3: req.body.restaurant3,
      //   restaurant4: req.body.restaurant4,
      //   restaurant5: req.body.restaurant5,
      //   weather: req.body.weather,
      //   humidity: req.body.humidity,
      //   pressure: req.body.pressure,
      //   temperature: req.body.temperature,
      //   wind: req.body.wind,
      //   dateCreated: req.body.dateCreated
      // })
      deleteSearchHistory.remove({
        place: req.body.location_name,
        email: req.body.user_email
      }).then((result) => {
        console.log("Delete Location Sucessful");
        res.redirect('/')
      })
    })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`))

    
  
  
