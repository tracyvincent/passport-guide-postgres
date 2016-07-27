var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');


router.get("/", function(req,res,next){
  res.sendFile(path.resolve(__dirname, '../views/login.html'));
});
router.get('/', function(req, res, next) {
  res.json(req.isAuthenticated());
});

router.post('/',
  passport.authenticate('local', {
    successRedirect: '/views/success.html',
    failureRedirect: '/views/failure.html'
  })
);


module.exports = router;
