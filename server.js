// import required packages
const express = require("express");
const fs = require("fs");
const path = require('path')
const uuid = require('./public/assets/js/uuid')
const {readAndAppend, writeToFile} = require('./public/assets/js/fsUtils')

// set local port and app
const PORT = process.env.PORT || 3001;
const app = express();

// initialize app to receive requests
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());

// setup GET method to return notes and index.html
// get index
app.get('/notes', (req,res) =>
    res.sendFile(path.join(__dirname, "./public/notes.html"))
)


// read db.json and return all saved notes
app.get('/api/notes', (req,res) => 
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if( err ) return console.log(err);
    console.log(data)
    res.json(JSON.parse(data))
  })
)

// gets a specific note when clicked on in the sidebar
app.get('/api/notes/:id', (req,res) => {
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    const dataParse = JSON.parse(data)
    console.log(dataParse)
    for(var i = 0; i<dataParse.length; i++){
      if(req.params.id == dataParse[i].id){
        res.json(dataParse[i])
      }
    }
  })
})

// post /api/notes
// append to db.json and give a unique id
app.post('/api/notes', (req,res) => {
  const {title, text} = req.body;

  if(req.body){
    const newItem = {
      title,
      text,
      id: uuid(),
    }

    readAndAppend(newItem, './db/db.json');
    res.json("Added item to task list")

  } else {
    res.json("Could not add item to task list.")
  }
})

// wildcard route
app.get('*', (req,res) =>
    res.sendFile(path.join(__dirname, "./public/index.html"))
)

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
