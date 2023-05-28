const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
app.use(bodyParser.json());

const PORT = process.env.PORT || 4000;

app.get("/", (req, res) => {
  res.send("Hello from Nerdbord!");
});

app.post("/trains", (req, res) => {
  const createTrainPayload = req.body;
  const trainsFilePath = path.join(__dirname, "data", "trains.json");
  const trains = JSON.parse(fs.readFileSync(trainsFilePath));
  trains.push(createTrainPayload);
  fs.writeFileSync(trainsFilePath, JSON.stringify(trains));
  res.send("Train added successfully");
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});