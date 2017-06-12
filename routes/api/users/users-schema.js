module.exports = function(app, mongoose, bcrypt, SALT_WORK_FACTOR){
  // grab the things we need
  var Schema = mongoose.Schema;

  // create a schema
  var userSchema = new Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
  });

  userSchema.pre('save', function(next) {
      var user = this;

      // only hash the password if it has been modified (or is new)
      if (!user.isModified('password')) return next();

      // generate a salt
      bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
          if (err) return next(err);

          // hash the password along with our new salt
          bcrypt.hash(user.password, salt, function(err, hash) {
              if (err) return next(err);
              // override the cleartext password with the hashed one
              user.password = hash;
              next();
          });
      });
  });

  userSchema.methods.comparePassword = function(candidatePassword, dbPassword, cb) {
    bcrypt.compare(candidatePassword, dbPassword, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
  };
  // the schema is useless so far
  // we need to create a model using it
  var User = mongoose.model('User', userSchema);
  // make this available to our users in our Node applications
  return User;
}
