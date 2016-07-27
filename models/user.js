var pg = require('pg');
var bcrypt = require('bcrypt');

var SALT_WORK_FACTOR = 10;

var config = {
  database: 'passport',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000
};

var pool = new pg.Pool(config);

function makeUser(username, password, callback){
  bcrypt.hash(password, SALT_WORK_FACTOR, function(err, hash){
    pool.connect(function(err, client, done){
      if(err) {
        done();
        return callback(err);
      }
      client.query('INSERT INTO postgresusers (username, password) VALUES ($1, $2) RETURNING id, username;', [username, hash], function(err, result){
        if(err) {
          done();
          return callback(err);
        }
        callback(null, result.rows[0]);
        done();
      });
    });
  });
}
function findUsername(username, callback){
  pool.connect(function(err, client, done){
    if (err){
      done();
      return callback(err);
    }

    client.query('SELECT * FROM postgresusers WHERE username=$1', [username], function(err, result){
      if (err){
        done();
        return callback(err);
      }
      callback(null, result.rows[0]);
      done();
    });
  });
}
function passwordCheck(username, possiblePassword, callback){
  findUsername(username, function(err, user){
    if(!user) {
      return callback(null);
    }
    if (err){
      return callback(err);
    }
    bcrypt.compare(possiblePassword, user.password, function(err, isMatch){
      if (err){
        console.log(err);
        return callback(err);
      }
      console.log('isMatch', isMatch);
      callback(null, isMatch, user);
    });
  });
}

function findId(id, callback){
  pool.connect(function(err, client, done){
    if (err){
      done();
      return callback(err);
    }
    client.query('SELECT * FROM postgresusers WHERE id=$1;', [id], function(err, result){
      if (err) {
        done();
        return callback(err);
      }
      callback(null, result.rows[0]);
      done();
    });
  });
}

module.exports = {
  makeUser: makeUser,
  findUsername: findUsername,
  passwordCheck: passwordCheck,
  findId: findId
};
