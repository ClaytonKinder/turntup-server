module.exports = function(app, router, User){

  function handleError(res, err, status) {
    console.log("ERROR: " + err.errmsg);
    res.status(status || 400).json({"error": err.errmsg, "code": err.code});
  }

  var errorBodies = {
    incorrectUsernameOrPassword: {
      code: 12000,
      message: 'The username or password you entered is incorrect.'
    }
  }

  app.post('/api/users', function(req, res) {
    var user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      username: req.body.username,
      password: req.body.password
    });
    // call the built-in save method to save to the database
    user.save(function(err, result) {
      if (err) handleError(res, err);

      res.send(result);
    });
  })

  app.get('/api/users', (req, res) => {
    User.find({}, {password: 0}, function(err, users) {
      if (err) handleError(res, err);

      // object of all the users
      res.send(users);
    });
  });

  app.post('/api/user', (req, res) => {
    User.findOne({ username: req.body.username }, function(err, user) {
       if (err) handleError(res, err);
       // test a matching password
       if (!user) {
        res.status(400).send(errorBodies.incorrectUsernameOrPassword)
      } else {
        User.schema.methods.comparePassword(req.body.password, user.password, function(err, isMatch) {
            if (err) handleError(res, err);
            if (isMatch) {
              res.status(200).send(user);
            } else {
              res.status(400).send(errorBodies.incorrectUsernameOrPassword);
            }
        });
      }
   });
  })

  app.post('/api/updateuser', (req, res) => {
    User.findByIdAndUpdate(req.body._id, req.body, function(err, user) {
      if (err) handleError(res, err);

      res.status(200).send(user);
    });
  })

  app.delete('/api/deleteuser', (req, res) => {
    User.findByIdAndRemove(req.body._id, function(err, result) {
      if (err) handleError(res, err);

      // we have deleted the user
      res.send(result);
    });
  });


}
