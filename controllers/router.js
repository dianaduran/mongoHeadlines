module.exports = function(app) {

    app.get('/', function(req, res) {
        res.render('index');
      });

    // app.get('/articlesPage', function(req, res) {
    //     res.render('articlesPage');
    //   });  

}