// This module is cached as it has already been loaded
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
let router = express.Router();
const mc = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId;


app.use(express.json()); // body-parser middleware

// Get /artists and return the all of the artists based on requested format
router.get('/', (req,res)=> {

    req.app.locals.db.collection("artworks").find().toArray(function(err,result){
        if (err){
            console.log('Error')
        }
        else{
            console.log("success");
            console.log(result);
            res.render("artists", {artists:result})
        }
    })

});

//each artist
router.get("/:id", (req,res) => {

    let id = req.params.id;
    let oid = new ObjectId(id)
    console.log(id)
    req.app.locals.db.collection("artworks").findOne({"_id":oid}, function(err,result){
        if(err){
            console.log(err)
        }
        else{
            console.log(result);
            res.render("artist",{artist:result});
        }
    })
})

router.get("/newartist", (req,res) => {

    let id = req.params.newartist;
    let oid = new ObjectId(newartist)
    console.log(newartist)
    req.app.locals.db.collection("artworks").findOne({"newartist":oid}, function(err,result){
        if(err){
            console.log(err)
        }
        else{
            console.log(result);
            res.render("artist",{artist:result});
        }
    })
})

router.post("artist", (req,res) => {

    console.log(req.body)
    let name = req.body.name;
    let artist= req.body.artist;
    let year = req.body.year;
    let category = req.body.category;
    let medium = req.body.medium;
    let description = req.body.description;
	let image = req.body.image;

    let data = {name, artist, year, category, medium, description,image};

    req.app.locals.db.collection("artworks").insertOne(data,  function(err,result){
        console.log(result);
        if (err){
            console.log(err);
        }
        else{
            res.status(200).end(JSON.stringify(req.body));
        }
    })
})



module.exports = router;
