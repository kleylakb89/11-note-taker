const express = require('express');
const path = require('path');
const uniqid = require('uniqid');
const fs = require('fs');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

app.get('/api/notes', (req, res) => {
    const notesData = fs.readFileSync('./db/db.json', 'utf8');
    const notesArr = notesData.length ? JSON.parse(notesData) : [];
    return res.json(notesArr);
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));

app.post('/api/notes', (req, res) => {
    if (req.body) {
        const notesData = fs.readFileSync('./db/db.json', 'utf8');
        const notesArr = notesData.length ? JSON.parse(notesData) : [];
        notesArr.push({ ...req.body, id: uniqid() })
        const notesString = JSON.stringify(notesArr, null, 2);

        fs.writeFile('./db/db.json', notesString, err => err ? console.log(err) : res.json('Note added!'));
    } else return res.json('Note must contain data.');
});

app.delete('/api/notes/:id', (req, res) => {
    const notesData = fs.readFileSync('./db/db.json', 'utf8');
    const notesArr = notesData.length ? JSON.parse(notesData) : [];
    const requestedNote = req.params.id;
    const notes = notesArr.filter(note => note.id !== requestedNote);
    const dbString = JSON.stringify(notes, null, 2);

    fs.writeFile('./db/db.json', dbString, err => err ? console.log(err) : res.json('Note deleted!'));
});

app.listen(PORT, () => console.log(`Page is at http://localhost:${PORT}`));