const express = require('express');
const path = require('path');
const http = require('http');
const routes = require('./routes');
const user = require('./routes/user');
const photos = require('./routes/photos');


const app = express();

app.set('port', process.env.PORT || 2002);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.set('photos', __dirname + '/public/photos');

// favicon
app.use(express.favicon());
// logger
app.use(express.logger());
// bodyParser 
app.use(express.bodyParser());
// methodOverride
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

if ('development' === app.get('env')) {
    app.use(express.errorHandler());
}

// specify routes 
app.get('/users', user.list);
app.get('/', photos.list);
app.get('/upload', photos.form);
app.post('/upload', photos.submit(app.get('photos')));
app.get('/photo/:id/download', photos.download(app.get('photos')));



http.createServer(app).listen(app.get('port'), () => {
    console.log('Express server is running on port', app.get('port'));
});