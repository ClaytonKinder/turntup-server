module.exports = function(app, bodyParser){
  app.use(bodyParser.urlencoded({extended: true}))
}
