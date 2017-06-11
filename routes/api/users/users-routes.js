module.exports = function(app, router, User){

  function handleError(res, err, status) {
    console.log("ERROR: " + err.errmsg);
    res.status(status || 400).json({"error": err.errmsg, "code": err.code});
  }

  // Add user
  // app.post("/api/users", function(req, res) {
  //   var newUser = req.body;
  //
  //   if (!(req.body.firstName || req.body.lastName)) {
  //     handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
  //   }
  //   db.collection('users').insertOne(newUser, function(err, doc) {
  //     console.log(doc);
  //     if (err) {
  //       handleError(res, err.message, "Failed to create new user.");
  //     } else {
  //       res.status(201).json(doc.ops[0]);
  //     }
  //   });
  // });

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
    User.find({}, function(err, users) {
      if (err) handleError(res, err);

      // object of all the users
      res.send(users);
    });
  });

  app.delete('/api/deleteuser', (req, res) => {
    User.findByIdAndRemove(req.body._id, function(err, result) {
      if (err) handleError(res, err);

      // we have deleted the user
      res.send(result);
    });
  });


}
