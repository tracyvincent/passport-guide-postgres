var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Users = require('../models/user');

router.get('/', function(req, res, next){
   res.sendFile(path.join(__dirname, '../public/views/register.html'));
});

router.post('/', function(req,res,next) {
  Users.makeUser(req.body.username, req.body.password, function (err) {
    if (err) {
      next(err);
    } else {
      // we registered the user, but they haven't logged in yet.
      // redirect them to the login page
      res.redirect('/');
    }
  })
});

module.exports = router;
