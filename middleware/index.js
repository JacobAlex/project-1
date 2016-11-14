module.exports = function (app, express) {
    var expressValidator = require('express-validator');
    var session = require('express-session');
    var path = require('path');
    var logger = require('morgan');
    var flash = require('connect-flash');
    var bodyParser = require("body-parser");
    var cookieParser = require("cookie-parser");

    // Routes files
    var routes = require('./controllers/index.js');
    var albums = require('./controllers/albums.js');
    var genres = require('./controllers/genres.js');
    var users = require('./controllers/users.js');

    // View Engine
    app.set('views', path.join(__dirname, 'views'));
    app.set('view engine', 'ejs');

    // Logger 
    app.use(logger('dev'));

    // Body parser
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false}));
    app.use(cokieParser());

    // Handle Sessions
    app.use(session({
        secret:'secret',
        saveUnininitialized: true,
        resave: true
    }));

    // Validator
    app.use(expressValidator({
        errorFormatter: function(param, msg, value) {
            var namespace = param.split('.')
            , root = namespace.shift()
            , formParam = root;

          while(namespace.length) {
              formParam += '[' + namespace.shift() + ']';
          }
          return {
              param : formParam,
              msg : msg,
              value : value
          };
        }
    }));    

    // Static Folder
    app.use(express.static(path.join(__dirname, 'public')));

    // Connect flash
    app.use(flash());

    // Global vars
    app.use(function (req, res, next) {
        res.locals.success_msg = req.flash('success_msg');
        res.locals.error_msg = req.flash('error_msg');
        res.locals.error = req.flash('error');
        res.locale.page = req.url;
        next();
    });

    // Routes
    app.use('/', routes);
    app.use('/albums', albums);
    app.use('/genres', genres);
    app.use('/users', users);
};
