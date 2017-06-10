module.exports = function(app){

  function handleError(res, reason, message, code) {
    console.log("ERROR: " + reason);
    res.status(code || 500).json({"error": message});
  }

  // Add user
  app.post("/api/users", function(req, res) {
    var newUser = req.body;

    if (!(req.body.firstName || req.body.lastName)) {
      handleError(res, "Invalid user input", "Must provide a first or last name.", 400);
    }
    db.collection('users').insertOne(newUser, function(err, doc) {
      console.log(doc);
      if (err) {
        handleError(res, err.message, "Failed to create new user.");
      } else {
        res.status(201).json(doc.ops[0]);
      }
    });
  });

  // Get all users
  app.get('/api/users', (req, res) => {
    db.collection('users').find().toArray(function(err, results) {
      res.send(results);
    })
  });

  // Delete user
  // app.delete('/api/deleteuser', (req, res) => {
  //   var item = db.collection('users').findOne({'_id': req.body._id});
  //   console.log(item);
  //   db.collection('users').remove({_id: item._id}, true)
  // });

  app.delete('/api/deleteuser', (req, res) => {
    console.log(req);
    db.collection('users', function(err, collection){
        console.log(req.body.email);
        collection.remove({
            "email": req.body.email
        }, function(err, removed){
            if (err) {
              throw err;
            } else {
              res.send({
                result: removed,
              })
            }
        });
    });
  });


}
