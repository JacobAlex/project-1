// Setup
var express = require("express");
var router = express.Router();
var Album = require("../models/album.js");
var middleware = require("../middleware");

router.get("/", function(req, res, next) {
    Album.find({}, function(err, albums){
        if (err) {
            console.log(err);
        } else {
            res.render("albums/index.ejs", {albums: albums});
        }
    });
});

router.get("/add", function(req, res) {
    res.render("albums/add.ejs");
});

router.post("/add", function(req, res){
    
    var artist = req.body.artist;
    var title = req.body.title;
    var genre = req.body.genre;
    var info = req.body.info;
    var year = req.body.year;
    var label = req.body.label;
    var tracks = req.body.tracks;
    var cover = req.body.cover;

    var newAlbum = {
        artist: artist,
        title: title,
        genre: genre,
        info: info,
        year: year,
        label: label, 
        tracks: tracks,
        cover: cover
    };

    Album.create(newAlbum, function(err, newlyCreated){
        if (err) {
            console.log(err);
        } else {
            res.redirect("/albums");
        }
    });
});

router.get("/details/:id", function(req, res){
    var id = req.params.id;
    
    Album.findById(id, function(err, album){
        if (err) {
            console.log(err);
        } else {
            res.render("albums/details", {album: album, id: id});
        }
    });
});

router.get("/edit/:id", function(req, res){
    var id = req.params.id;

    Album.findById(id, function(err, album){
        if (err) {
            req.flash('error', "Album was not found in the database");
        } else {
            res.render('albums/edit.ejs', {album: album});
        }
    });
});

router.post("/edit/:id", function(req, res){
    var id = req.params.id;

    Album.findByIdAndUpdate(id, function(err, album){
        if (err) {
            console.log(err);
            res.redirect('/albums');
        } else {
            res.redirect('/albums/' + id);
        }
    });
});

router.delete("/delete/:id", function(req, res){
    var id = req.params.id;

    Album.findByIdAndRemove(id, function(err) {
        if (err) {
            console.log(err);
        }
        res.redirect("/albums");
    });
});

module.export = router;
