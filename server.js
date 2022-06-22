// requiring packages for use in server
const express = require('express');
const path = require('path');
// uniqid will create a randomized id for every note
const uniqid = require('uniqid');
const fs = require('fs');

// setting port so it will either run on Heroku host or locally
const PORT = process.env.PORT || 3001;
const app = express();

// middleware for use app.post and accessing public folder
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// setting the landing page and /notes pages to their respective HTMLs
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

// will read the json file and return a response of that data array
app.get('/api/notes', (req, res) => {
    const notesData = fs.readFileSync('./db/db.json', 'utf8');
    const notesArr = notesData.length ? JSON.parse(notesData) : [];
    return res.json(notesArr);
});

// bad paths will lead to the index page
app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

// allows user to post new notes - first reads the json file and creates a data array, then pushes the new note with a unique id into that array, stringifies it, and then writes to file
app.post('/api/notes', (req, res) => {
    if (req.body) {
        const notesData = fs.readFileSync('./db/db.json', 'utf8');
        const notesArr = notesData.length ? JSON.parse(notesData) : [];
        notesArr.push({ ...req.body, id: uniqid() })
        const notesString = JSON.stringify(notesArr, null, 2);

        fs.writeFile('./db/db.json', notesString, err => err ? console.log(err) : res.json('Note added!'));
    } else return res.json('Note must contain data.');
});

// delete request for specific notes. Reads the file and makes a data array, filters the array based on the searched for id value, stringfies the new notes without the searched note, and writes to file so the searched note is removed from the json.
app.delete('/api/notes/:id', (req, res) => {
    const notesData = fs.readFileSync('./db/db.json', 'utf8');
    const notesArr = notesData.length ? JSON.parse(notesData) : [];
    const requestedNote = req.params.id;
    const notes = notesArr.filter(note => note.id !== requestedNote);
    const dbString = JSON.stringify(notes, null, 2);

    fs.writeFile('./db/db.json', dbString, err => err ? console.log(err) : res.json('Note deleted!'));
});

// listening for responses
app.listen(PORT, () => console.log(`Page is at http://localhost:${PORT}`));