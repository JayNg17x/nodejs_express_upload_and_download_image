const Photo = require('../models/photo');
const path = require('path');
const fs = require('fs');

let join = path.join;

exports.list = function(req, res) {
    res.render('photos', {
        title: 'Photos',
        photos: photos
    });
};

exports.list = function(req, res) {
    // {} find record in photo collection
    Photo.find({}, (err, photos) => {
        if (err) return next(err);
        res.render('photos', {
            title: 'Photos',
            photos: photos
        });
    });
};

// handle form 
exports.form = function(req, res, next) {
    res.render('photos/upload', {
        title: 'Photo uploaded'
    });
};

// handle upload form
exports.submit = function(dir) {
    // callback route
    return function(req, res, next) {
        let img = req.files.photo.image;
        // default original file name
        let name = req.body.photo.name || img.name;
        let path = join(dir, img.name);

        // rename file
        fs.rename(img.path, path, (err) => {
            if (err) return next(err);

            Photo.create({
                name: name,
                path: img.name
            }, function(err) {
                if (err) return next(err);
                // perform http redirect to home page
                res.redirect('/');
            });
        });
    };
};

// handle resource download
// set directory you'll serve file to 
exports.download = function(dir) {
    return function(req, res, next) {
        let id = req.params.id;
        // load photo record
        Photo.findById(id, (err, photo) => {
            if (err) return next(err);
            // contruct absolute path to file
            let path = join(dir, photo.path);
            // transfer file
            res.download(path);
            // res.sendFile(path, photo.name  + 'jpeg');
        });
    }
};