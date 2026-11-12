import express from 'express';
import { students } from './data.js';
const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    const listString = students.map(({nev})=> `<li>${nev}</li>`).join('')
    const html = `
    <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Üdvözöllek</h1>
    <p>Ezt a tartalmat szerver állította elő és küldte a felhasználónak.</p>
    <ul>
        ${listString}
    </ul>
</body>
</html>
    `
    res.send(html);
})

app.use((req, res) => {
    res.status(404).send('Page not found');
});

app.listen(8000, () => {
    console.log('Server is running on port 8000');
});