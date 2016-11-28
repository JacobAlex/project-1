var express        = require('express');
var app            = express();
var bodyParser     = require('body-parser');
var mongoose       = require('mongoose');
var flash          = require('connect-flash');
var passport       = require('passport');
var LocalStrategy  = require('passport-local');
var methodOverride = require('method-override');

var Album     = require('./models/album');
var Genre     = require('./models/comment');
var User      = require('./models/user.js');

var routes = require('./routes/index');
var albums = require('./routes/albums');
var genres = require('./routes/genres');
var users  = require('./routes/users');


app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.set("view engine", "ejs");
mongoose.connect("mongodb://localhost/");


app.use(require("express-session")({
   secret: 'secret',
   resave: false,
   saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
   res.locals.currentUser = req.user;
   res.locals.error       = req.flash("error");
   res.locals.success     = req.flash("success");
   next();
});


app.use('/', routes);
app.use("/albums", albums);
app.use('/genres', genres);
app.use('/users', users);

app.listen(process.env.PORT, process.env.IP, function() {
   console.log('Server started');
});
