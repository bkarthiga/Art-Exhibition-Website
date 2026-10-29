// This module is cached as it has already been loaded
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
let router = express.Router();
const mc = require("mongodb").MongoClient;
var ObjectId = require('mongodb').ObjectId;


app.use(express.json()); // body-parser middleware

// Get /artworks and return the all of the artworks based on requested format
router.get('/', (req,res)=> {

    req.app.locals.db.collection("artworks").find().toArray(function(err,result){
        if (err){
            console.log('Error')
        }
        else{
            console.log(result);
            res.render("artworks", {artworks:result})
        }
    })

});

//each artwork
router.get("/:id", (req,res) => {

    let id = req.params.id;
    let oid = new ObjectId(id)

    req.app.locals.db.collection("artworks").findOne({"_id":oid}, function(err,result){
        if(err){
            console.log(err)
        }
        else{
            res.render("artwork",{artwork:result});
        }
    })
})

router.post("/", (req,res) => {

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


/*
// helper route, which returns the accepted types currently available in our application. This is used by the addArtwork.html page
router.get("/types", function(req, res, next){
	let types = [];
  Object.entries(req.app.locals.names).forEach(([key, value]) => {
    if(!types.includes(value["type"])){
      types.push(value["type"]);
    }
  });
	res.status(200).set("Content-Type", "application/json").json(types);
});



// Middleware function: this function validates the contents of the request body associated with adding a new artwork into the application. At the minimimum, it currently validates that all the required fields for a new artwork are provided.
function validateArtworkBody(req,res,next){
    let properties = ['name','artist','year','category','medium','description','image'];

    for(property of properties){
      // hasOwnProperty method of an object checks if a specified property exists in the object. If a property does not exist, then we return a 400 bad request error
        if (!req.body.hasOwnProperty(property)){
            return res.status(400).send("Bad request");
        }
    }
    // if all the required properties were provided, then we move to the next set of middleware and continue program execution.
    next();
}
// Middleware function: this validates the contents of request body, verifies name data
function validateNameBody(req,res,next){
    let properties = ['id','quantity'];
    for (property of properties){
        if (!req.body.hasOwnProperty(property))
			return res.status(400).send("Bad request");
    }
    next();
}
// Adds a new artwork, returns newly created artwork
router.post('/', validateArtworkBody, (req,res)=> {
	// Make local changes
	req.app.locals.artworks.push({id:`fg-${req.app.locals.artworks.length+1}`, ...req.body, names:[]});

	// Update 'database'
	fs.writeFile(path.join(__dirname, 'data','gallery.json'),JSON.stringify(req.app.locals.artworks, null, 4), (err)=>{
        if (err)
            return res.status(500).send("Database error");
        res.status(201).json({id:`fg-${req.app.locals.artworks.length}`, ...req.body});
    });
});

// Get /artworks/{artworkID}. Returns the data associated with the requested artwork.
router.get("/:artworkId", function(req, res, next){
	const artworks = req.app.locals.artworks;
	const names = req.app.locals.names;

	// Find artwork in 'database'
	const artworkFound = artworks.find(f => f.id == req.params.artworkId);
	if(!artworkFound) return res.status(404).send('Not Found');

	// Make deep copy of artworks data
	let artwork = {...artworkFound};

	// Populate names array with name data matched with nameID
	// TODO: IS THIS NEEDED??
	for (let i = 0; i < artwork.names.length; i++) {
		artwork.names[i] = {...names[artwork.names[i].id], ...artwork.names[i]};
	}

	res.json(gallery);
});

// Updates a artwork and returns the data associated.
// Should probably also validate the name data if any is sent, oh well :)
router.put("/:artworkId", (req, res) =>{
	const artworks = req.app.locals.artworks;
	const names = req.app.locals.names;

	// Find artwork in 'database'
	let indexFound = artworks.findIndex(f => f.id == req.params.artworkId);
	if(indexFound < 0) return res.status(404).send('Not Found');
	req.app.locals.artworks[indexFound] = {...req.app.locals.artworks[indexFound], ...req.body} // Should not need old attributes i.e. ...artworkFound

	// Update 'database'
	fs.writeFile(path.join(__dirname, 'data','gallery.json'),JSON.stringify(req.app.locals.artworks, null, 4), (err)=>{
		if (err)
			return res.status(500).send("Database error");

		// Populate names array with name data matched with nameID
		// TODO: is this needed?
		let artwork = req.app.locals.artworks[indexFound];
		for (let i = 0; i < artwork.names.length; i++) {
			artwork.names[i] = {...names[artwork.names[i].id], ...artwork.names[i]};
		}

        res.json(req.app.locals.artworks[indexFound]); // Status 200 is default
    });

});

// Adds an name to specified artwork
router.post("/:artworkId/names", validateNameBody, (req,res)=>{
	const artworks = req.app.locals.artworks;
	const names = req.app.locals.names;

	// Find artwork in 'database'
	let indexFound = artworks.findIndex(f => f.id == req.params.artworkId);
	if(indexFound < 0) return res.status(404).send('Not Found');

	// Find name in 'database'
	if(!names.hasOwnProperty(req.body.id)) return res.status(404).send('Not Found');

	// Add name to artwork
	// ASSUMES NAME DOES NOT EXIST IN ARRAY
	req.app.locals.artworks[indexFound].names.push(req.body)

	// Update 'database'
	fs.writeFile(path.join(__dirname, 'data','gallery.json'),JSON.stringify(req.app.locals.artworks, null, 4), (err)=>{
		if (err)
			return res.status(500).send("Database error");

		res.json(req.body);
    });

})

// Deletes an name from specified artwork
router.delete("/:artworkId/names/:nameId", (req,res)=>{
	const artworks = req.app.locals.artworks;
	const names = req.app.locals.names;

	// Find artwork in 'database'
	let indexFound = artworks.findIndex(f => f.id == req.params.artworkId);
	if(indexFound < 0) return res.status(404).send('Not Found');

	// Find name in 'database'
	if(!names.hasOwnProperty(req.params.nameId)) return res.status(404).send('Not Found');

	// Remove name from artwork
	artworks[indexFound].names = artworks[indexFound].names.filter(name=> name.id != req.params.nameId)

	// Update 'database'
	fs.writeFile(path.join(__dirname, 'data','gallery.json'),JSON.stringify(req.app.locals.artworks, null, 4), (err)=>{
		if (err)
			return res.status(500).send("Database error");

		res.status(204).send();
    });

})

router.delete("/:artworkId/names", (req,res)=>{
	const artworks = req.app.locals.artworks;

	// Find artwork in 'database'
	let indexFound = artworks.findIndex(f => f.id == req.params.artworkId);
	if(indexFound < 0) return res.status(404).send('Not Found');

	// Delete all names in artwork
	if (!req.query.hasOwnProperty('id')){
		artworks[indexFound].names = [];
	}
	// Remove specific names from artwork
	else{
		artworks[indexFound].names = artworks[indexFound].names.filter(name=> !req.query.id.includes(name.id));
	}
	// Update 'database'
	fs.writeFile(path.join(__dirname, 'data','gallery.json'),JSON.stringify(req.app.locals.artworks, null, 4), (err)=>{
		if (err)
			return res.status(500).send("Database error");

		res.status(204).send();
    });
})
*/


module.exports = router;
