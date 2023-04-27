// import required packages
const express = require("express");
const fs = require("fs");
const path = require('path')
const uuid = require('./public/assets/js/uuid')
const {readAndAppend, writeToFile} = require('./public/assets/js/fsUtils')

// set local port and app
const PORT = 3001;
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

// get notes
app.get('*', (req,res) =>
    res.sendFile(path.join(__dirname, "./public/index.html"))
)

// read db.json and return all saved notes
app.get('/api/notes', (req,res) => 
  fs.readFile("./db/db.json").then((data) => res.json(JSON.parse(data)))
)

// post /api/notes
// append to db.json and give a unique id
app.post('/api/notes', (req,res) => {
  const {title, text} = req.body;

  if(req.body){
    const newItem = {
      title,
      text,
      item_id: uuid(),
    }

    readAndAppend(newItem, './db/db.json');
    res.json("Added item to task list")

  } else {
    res.json("Could not add item to task list.")
  }
})

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);
