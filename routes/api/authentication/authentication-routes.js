module.exports = function(app, router, User, jwt){

  function handleError(res, err, msg, status) {
    console.log("ERROR: " + err.errmsg);
    if (!err.errmsg) {
      err.errmsg = msg;
    }
    console.log(err);
    res.status(status || 400).json({"error": err.errmsg, "code": err.code});
  }

  function updateUser(original, updated) {
    original.firstName = updated.firstName;
    original.lastName = updated.lastName;
    original.email = updated.email;
    original.password = updated.password;
    return original;
  }

  var errorBodies = {
    incorrectEmailOrPassword: {
      code: 12000,
      message: 'The email or password you entered is incorrect.'
    }
  }

  app.post('/api/authentication/login', (req, res) => {
    var regex = new RegExp(["^", req.body.email, "$"].join(""), "i");
    console.log(req.body);
    User.findOne({ email: regex }, function(err, user) {
      console.log(user);
       if (err) handleError(res, err, 'The email or password that you provided is incorrect.');
       // test a matching password
       if (!user) {
        res.status(422).send(errorBodies.incorrectEmailOrPassword)
      } else {
        User.schema.methods.comparePassword(req.body.password, user.password, function(err, isMatch) {
            if (err) handleError(res, err, 'The email or password that you provided is incorrect.', 422);
            if (isMatch) {
              user.password = undefined;
              var obj = {};
              obj.token = jwt.sign(user, app.get('secret'), {
                expiresIn: 60 * 60 * 24 // expires in 24 hours
              });
              obj.user = user;
              console.log('USER WITH TOKEN', obj);
              res.status(200).send(obj);

            } else {
              res.status(422).send(errorBodies.incorrectEmailOrPassword);
            }
        });
      }
   });
  })

}
