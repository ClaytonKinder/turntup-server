module.exports = function(app, mongoose){
  const MongoClient = require('mongodb').MongoClient;
  var mongoLink = "mongodb://";
  mongoLink += process.env.DB_USERNAME;
  mongoLink += ':';
  mongoLink += process.env.DB_PASSWORD;
  mongoLink += '@ds113282.mlab.com:13282/turntup';
  mongoose.connect(mongoLink, (err, database) => {
    if (err) return console.log(err)
    db = database;
    app.listen(8080, () => {
      console.log('Listening on 8080');
    })
  })
}
