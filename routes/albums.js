var express = require('express');
var router = express.Router();
var Album = require('../models/Album');

//INDEX - show all albums
router.get("/", function(req, res){
    // Get all albums from DB
    Campground.find({}, function(err, allAlbums){
       if(err){
           console.log(err);
       } else {
          res.render("albums/index",{albums:allAlbums, currentUser: req.user});
       }
    });
});

//CREATE - add new album to DB
router.post("/", function(req, res){
    // get data from form and add to campgrounds array
    var artist = req.body.artist;
    var cover = req.body.cover;
    var info = req.body.info;
	var year = req.body.year;
	var label = req.body.label;
	var tracks = req.body.tracks;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = {artist: artist, cover: cover, info: info, year: year, label: label, tracks: tracks, author: author}
    
    // Create a new campground and save to DB
    Campground.create(newAlbum, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to albums page
            res.redirect("/albums");
        }
    });
});

//NEW - show form to create new campground
router.get("/new", isLoggedIn, function(req, res){
   //creat empty .ejs file in views 
   res.render("albums/new.ejs"); 
});

// SHOW - shows more info about one album
router.get("/:id", isLoggedIn, function(req, res){
    //find the album with provided ID
    Album.findById(req.params.id).exec(function(err, foundAlbum){
        if(err){
            console.log(err);
        } else {
            console.log(foundAlbum)
            //render show template with that campground
            res.render("albums/show", {album: foundAlbum});
        }
    });
});

// EDIT ALBUM ROUTE
router.get("/:id/edit", checkAlbumOwnership, function(req, res){
    Album.findById(req.params.id, function(err, foundAlbum){
                res.render("albums/edit", {album: foundAlbum});
        });
});


// UPDATE ALBUM ROUTE
router.put("/:id", function(req, res){
    // find and update the correct album
    Album.findByIdAndUpdate(req.params.id, req.body.album, function(err, updatedAlbum){
       if(err){
           res.redirect("/albums");
       } else {
           //redirect somewhere(show page)
           res.redirect("/albums/" + req.params.id);
       }
    });
});

// Delete Album Route
router.delete('/:id', function(req, res) {
    Album.findByIdAndRemove(req.params.id, function(err) {
        if(err) {
            res.redirect('/albums');
        } else {
            res.redirect('/albums');
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
