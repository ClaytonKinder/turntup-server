module.exports = function(app){

  app.post('/users', (req, res) => {
    console.log(req);
    db.collection('users').save(req.body, (err, result) => {
      if (err) return console.log(err)

      console.log('saved to database');
      res.redirect('/')
    })
  })

  app.get('/users', (req, res) => {
    db.collection('Users').find().toArray(function(err, results) {
      console.log(results);

      res.send(results);
    })
  });
}
