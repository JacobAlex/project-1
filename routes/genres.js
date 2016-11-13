var express = require('express');
var router = express.Router();

//INDEX - show genres
router.get("/", function(req, res){
    // Get genres from DB
    Genre.find({}, function(err, allGenres){
       if(err){
           console.log(err);
       } else {
          res.render("genres/index",{genres:allGenres, currentUser: req.user});
       }
    });
});

//CREATE - add new genre to DB
router.post("/", function(req, res){
    var name = req.body.name;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newGenre = {name: name, author: author}
    
    // Create a new genre and save to DB
    Genre.create(newGenre, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to genres page
            res.redirect("/genres");
        }
    });
});

//NEW - show form to create new genre
router.get("/new", isLoggedIn, function(req, res){
   //creat empty .ejs file in views 
   res.render("genres/new.ejs"); 
});



// EDIT GENER ROUTE
router.get("/:id/edit", checkGenreOwnership, function(req, res){
    Genre.findById(req.params.id, function(err, foundGenre){
                res.render("genres/edit", {genre: foundGenre});
        });
});


// UPDATE GENRE ROUTE
router.put("/:id", function(req, res){
    // find and update the correct genre
    Genre.findByIdAndUpdate(req.params.id, req.body.genre, function(err, updatedGenre){
       if(err){
           res.redirect("/genres");
       } else {
           //redirect somewhere(show page)
           res.redirect("/genre/" + req.params.id);
       }
    });
});

// Delete Genre Route
router.delete('/:id', function(req, res) {
    Genre.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect('/genres');
        } else {
            res.redirect('/genres');
        }
    });
});

// middleware
function isLoggedIn(req, res, next) {
  if(req.isAuthenticated()) {
    req.flash('success_msg', 'You logged in');
    return next();
  }
  res.redirect('/login');
}

module.exports = router;
