module.exports = function(app, mongoose){
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
  // the schema is useless so far
  // we need to create a model using it
  var User = mongoose.model('User', userSchema);
  // make this available to our users in our Node applications
  return User;
}
