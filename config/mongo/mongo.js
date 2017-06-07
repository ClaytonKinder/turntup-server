module.exports = function(app){
  const MongoClient = require('mongodb').MongoClient;
  // var mongoLink = "mongodb://ClaytonKinder:Holland0ate";
  var mongoLink = "mongodb://";
  mongoLink += process.env.DB_USERNAME;
  mongoLink += ':';
  mongoLink += process.env.DB_PASSWORD;
  mongoLink += '@ds113282.mlab.com:13282/turntup';
  console.log(mongoLink);

  MongoClient.connect(mongoLink, (err, database) => {
    if (err) return console.log(err)
    db = database
    app.listen(8080, () => {
      console.log('listening on 8080')
    })
  })
}
