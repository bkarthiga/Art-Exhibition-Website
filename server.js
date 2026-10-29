
const express = require('express');
const app = express();
const mc = require("mongodb").MongoClient;

var ObjectId = require('mongodb').ObjectId;

//process.env.PORT will see if there is a specific port set in the environment
const PORT = process.env.PORT || 3000
const ROOT_DIR_JS = '/public'; //root directory for javascript files

//
app.use(function (req, res, next) {
    console.log(req.url);
    next();
    });

//Setting pug as our template engineapp
app.set("view engine","pug")
app.use(express.static("public"));
app.use(express.static("views"))
app.use(express.json())
app.use(express.urlencoded({extended:true}));

const artworkRouter = require('./public/artWorkRouter.js'); //
const artistRouter = require('./public/artistRouter');
//const userRouter = require('./public/userRouter')

app.use("/artworks",artworkRouter);  //
app.use("/artists", artistRouter);
//app.use("/users", userRouter);

app.use(express.static("." + ROOT_DIR_JS));  //register


//Convert any JSON stringified strings in a POST request to JSON.


//Variable to store reference to database
let db;

//Define route handlers here
//This get method has two endpoints going to the same rendered pug file
app.get(['/', '/home'], (req, res)=>{
	res.render('home', {})
})

//define the url for new artwork
app.get("/newartwork", function(req,res){
    res.status(200).render('newartwork.pug')
})

//Adding a user renders an HTML form with a submit button
app.get('/addUser', (req, res)=>{
	res.render('addUser', {})
})


//Adding a user renders an HTML form with a submit button
app.get('/users', (req, res)=>{
	res.render('users', {})
})
//Adding a user renders an HTML form with a submit button
app.get('/artists', (req, res)=>{
	req.app.locals.db.collection("artists").find().toArray(function(err,result){
        if (err){
            console.log('Error')
        }
        else{
            console.log("success");
            console.log(result);
            res.render("artists", {artists:result})
        }
    })
})

//Retreiving all the users in the the families collection of the demo database
app.get('/users', (req, res)=>{
    //Notice that the find function has an empty object {}
    //this means find all the documents in the families collection.
    //The find function may have numerous documents returned then when need
    //to convert the "searchResult" into an array -- toArray()
    db.collection("families").find({}).toArray(function(err, searchResult) {
        //Notice that this work will only be done once the db find function has
        //returned.  The find is an async functions.
        if (err) throw err;
        console.log(searchResult);
        //Create an HTML page with all the users in bedrock
        res.render('users', {users: searchResult})
    });
})

//Delete the user associated with the userID (which is the Object_id for the document).
//Notice we use the delete method.
app.delete('/user/:userID', (req, res)=>{
    console.log("Delete user")
    console.log(req.params.userID)
    let obj_id = new ObjectId(req.params.userID)

    db.collection("families").deleteOne({"_id": obj_id}, function (err, result) {
        //Notice that this work will only be done once the db deleteOne function 
        //has returned.  The deleteOne is an async functions.
		if (err) throw err;

		console.log(result);
        res.send()
	});
})

//Find the user associated with the userID (which is the Object_id for the document).
app.get('/user/:userID', (req, res)=>{
    console.log(req.params.userID)
    let obj_id = new ObjectId(req.params.userID)
    db.collection("families").findOne({"_id": obj_id}, function(err, searchResult) {
        //Notice that this work will only be done once the db findOne function 
        //has returned.  The findOne is an async functions.
        if (err) throw err;
        console.log(searchResult);
        res.render('user', {user: searchResult})
    });

})

//Save the new user to the database and then retrieve the user from the
//database.  You may need to do a retrieval once you save because there may be 
//other functions that add information to the document. 
app.post("/addUser", (req, res)=>{
    let userInfo = req.body
    console.log(JSON.stringify(userInfo))
    db.collection("families").insertOne(userInfo, function(err,result){
        //Notice that this work will only be done once the db insertOne function 
        //has returned.  The insertOne is an async functions.
        //Also notice the the findOne function is only called once the 
        //insertOnce async function has completed.
		if(err) throw err;
		
		console.log(result);
        console.log(result.insertedId);

        db.collection("families").findOne({"_id": result.insertedId}, function(err, searchResult) {
            if (err) throw err;
            console.log(searchResult);
            res.json(searchResult)
        });
    });
});

//Connect to database
//Nothing happens until we are connected to the database then
//the server will start listening.
mc.connect("mongodb://127.0.0.1:27017", { useNewUrlParser: true }, function(err, client) {
	if (err) {
		console.log("Error in connecting to database");
		console.log(err);
		return;
	}
	//Get the database and save it to a variable
	db = client.db("project");
    app.locals.db = db;
	
	//Only start listening now, when we know the database is available
	app.listen(PORT);
	console.log("Server listening on port 3000");
})

//*************************

// Rendering the registration page.
app.get("/register", (req, res) => {

	res.render("users/register", { session: req.session });
     
});

// Saving the user registration to the database.
app.post("/register", async (req, res) => {

    let newUser = req.body;

    try{
        const searchResult = await User.findOne({ username: newUser.username});
        if(searchResult == null) {
            console.log("registering: " + JSON.stringify(newUser));
            await User.create(newUser);
            res.status(200).send();
        } else {
            console.log("Send error.");
            res.status(404).json({'error': 'Exists'});
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: "Error registering" });
    }  

});

// Search the database to match the username and password .
app.post("/login", async (req, res) => {

	let username = req.body.username;
	let password = req.body.password;

    try {
        const searchResult = await User.findOne({ username: username });
        if(searchResult != null) { 
            if(searchResult.password === password) {
                // If we successfully match the username and password
                // then set the session properties.  We add these properties
                // to the session object.
                req.session.loggedin = true;
                req.session.username = searchResult.username;
                req.session.userid = searchResult._id;
                res.render('pages/home', { session: req.session })
            } else {
                res.status(401).send("Not authorized. Invalid password.");
            }
        } else {
            res.status(401).send("Not authorized. Invalid password.");
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({ error: "Error logging in."});
    }    

});

// Adding a person renders an HTML form with a submit button.
app.get('/addUser', (req, res) => {

	res.render('addUser', { session: req.session });

});
/*
// Log the user out of the application.
app.get("/logout", (req, res) => {

    // Set the session loggedin property to false.
	if(req.session.loggedin) {
		req.session.loggedin = false;
	}
	res.redirect(`http://${host[0]}:3000/home`);

});

*/




/*

br
	|Image #{artwork.image}
	br
	br
	br
	if artwork.users.length > 0
		|Registered By:
		br
		each user in artwork.users
			a(href=user) #{user}
			br
		br
		br
	if artwork.reviews.length > 0
		|Reviews:
		br
		each review in artwork.reviews
			a(href=review) #{review}
			br


*/