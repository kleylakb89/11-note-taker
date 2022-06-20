const express = require('express');
const path = require('path');
const uniqid = require('uniqid');
const db = require('./db/db.json');

const PORT = 3001;
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public/index.html')));
app.get('/notes', (req, res) => res.sendFile(path.join(__dirname, 'public/notes.html')));

app.get('/notes/db', (req, res) => res.json(db));

app.listen(PORT, () => console.log(`Page is at http://localhost:${PORT}`));