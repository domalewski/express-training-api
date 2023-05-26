const express = require('express');
const app = express();

const PORT = process.env.PORT || 4000;

app.use(express.json());

const dataTrains = require('./data/trains.json');

app.get('/', (req, res) => {
    res.send('Hello from Nerdbord!');
});


app.get('/trains', (req, res) => {
    res.status(200).send(JSON.stringify(dataTrains));
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
