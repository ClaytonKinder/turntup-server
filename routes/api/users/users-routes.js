module.exports = function(app, router, User){

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

  app.post('/api/users/createuser', function(req, res) {
    var user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password,
      isTurnt: false
    });
    user.save(function(err, result) {
      if (err) handleError(res, err, 'Could not create user at this time.');
      res.send(result);
    });
  })

  app.get('/api/users/getusers', (req, res) => {
    User.find({}, {password: 0}, function(err, users) {
      if (err) handleError(res, err, 'Could not get users at this time.');
      // object of all the users
      res.send(users);
    });
  });

  app.post('/api/users/getuser', (req, res) => {
    var regex = new RegExp(["^", req.body.email, "$"].join(""), "i");
    User.findOne({ email: regex }, function(err, user) {
       if (err) handleError(res, err, 'The email or password that you provided is incorrect.');
       // test a matching password
       if (!user) {
        res.status(422).send(errorBodies.incorrectEmailOrPassword)
      } else {
        User.schema.methods.comparePassword(req.body.password, user.password, function(err, isMatch) {
            if (err) handleError(res, err, 'The email or password that you provided is incorrect.', 422);
            if (isMatch) {
              res.status(200).send(user);
            } else {
              res.status(422).send(errorBodies.incorrectEmailOrPassword);
            }
        });
      }
   });
  })

  app.post('/api/users/updateuser', (req, res) => {
    User.findById(req.body._id, function(err, user) {
      if (err) throw err;

      user = updateUser(user, req.body);
      user.save(function(err) {
        if (err) handleError(res, err, 'Could not update user at this time.');

        res.status(200).send(user);
      });
    });
  })

  app.delete('/api/users/deleteuser', (req, res) => {
    User.findByIdAndRemove(req.body._id, function(err, result) {
      if (err) handleError(res, err, 'Could not delete user at this time.');

      // we have deleted the user
      res.send(result);
    });
  });


}
