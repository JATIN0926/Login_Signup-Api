var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localStratergy = require('passport-local');
passport.use(new localStratergy(userModel.authenticate()));

router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/login', function(req, res, next) {
  res.render('login' , {error : req.flash('error')});
});
router.get("/profile",isLoggedIn, async function (req,res,next){
  const user = await userModel.findOne({
    username: req.session.passport.user
  })
  res.render("profile" , {user})
})
router.post('/register', function(req, res, next) {
  const userdata = new userModel({
    username : req.body.username,
    email : req.body.email,
    fullName : req.body.fullName,
  });

  userModel.register(userdata, req.body.password)
  .then(function(){
    passport.authenticate('local')(req,res,function(){
      res.redirect('/profile')
    })
  })
});

router.post('/login', passport.authenticate('local',{
  successRedirect : "/profile",
  failureRedirect : "/login",
  failureFlash : true
}) ,function(req, res, next) {
});

router.get('/logout', function(req, res) {
  req.logout(function (err){
    if(err) {return next(err)};
    res.redirect("/")
  })
});

function isLoggedIn(req , res , next){
    if(req.isAuthenticated()){
      return next();
    }
    res.redirect("/login")
}


module.exports = router;
