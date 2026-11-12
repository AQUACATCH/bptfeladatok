import express from 'express';
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Magyar péter egy ');
});

app.get('/about', (req, res) => {
    res.send('About page');
});

//Thunder: {"nev":"Gyula","kor":"18"}
app.post( '/', (req, res) => {
    console.log('Data received:', req.body);
    res.send(`Welcome, ${req.body.nev}! You are ${req.body.kor} years old.`);
});

app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(8000,() => {
    console.log('Server is running on port 8000');
});