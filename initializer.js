
const express = require('express');
let app = express();
let fs = require('fs');
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;

let artWork = [];

fs.readdir("./database",(err,files)=>{
    if(err){
        return console.log(err);
    }
    else{
        for(let i=0; i<files.length; i++){
            let file = require("./database/"+files[i]);
            for (let j=0; j < file.length; ++j){
                artWork.push(file[j])
                console.log(file[j])
            }
        }
    }
});


MongoClient.connect("mongodb://localhost:27017/",  function(err,client){

    if (err)  throw err;

    db = client.db('project')
    app.locals.db=db;

    app.locals.db.listCollections().toArray(function(err,result){
        if(result.length==0){
            app.locals.db.collection("artworks").insertMany(artWork, function(err,result){
                if(err){
                    throw err;
                }
                console.log(result.insertedCount)
                client.close();

            })
            return;
        }
    })
})