var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var passport = require('passport');
var session = require('express-session');
var localStrategy = require('passport-local').Strategy;
var User = require('./models/user');
var register = require('./routes/register');
var login = require('./routes/login');


var app = express();

app.use(session({
  secret: 'secret',
  key: 'user',
  resave: true,
  saveUninitialized: false,
  cookie: {maxAge: 60000, secure: false}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new localStrategy({
  usernameField: 'username',
  passwordField: 'password'
  },
  function(username, password, done){
    User.passwordCheck(username, password, function(err,isMatch, user) {
      if (err) {
         return done(err);
      };

      if (isMatch) {
        return done(null, user);
      }else{
        return done(null, false);
      }
    });
  })
);

passport.serializeUser(function(user, done) {
   done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findId(id, function(err,user){
    if(err) {
      return done(err);
    }
    done(null,user);
  });
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));

app.get("/", function(req,res,next){
  res.sendFile(path.resolve(__dirname, 'public/views/login.html'));
});

app.use('/register', register);
app.use('/login', login);

var port = process.env.PORT || 3000;
var server = app.listen(port, function() {
  console.log('server listening on ' + server.address().port);
})
