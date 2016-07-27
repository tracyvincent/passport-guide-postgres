var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');

var UserSchema = new Schema({
  username: {type: String, require: true, index: {unique: true}},
  password: {type: String, required: true}
});

UserSchema.pre('save', function(next){
  var user = this;
  var SALT_WORK_FACTOR = 10;

  if (!user.isModified('password')){
    return next();
  }
  bcrypt.hash(user.password, SALT_WORK_FACTOR, function(err, hash){
    if(err){
      return next(err);
    }
    user.password = hash;
    next();
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, cb){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err){
      return cb(err);
    }
    cb(null, isMatch);
  });
};

module.exports = mongoose.model('User', UserSchema);
