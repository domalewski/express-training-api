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

app.put("/trains/:id", (req, res) => {
  const newData = req.body;

  const filePath = path.join(__dirname, "data", "trains.json");

  let id;
  const idParams = req.params.id;
  const idBody = req.body.id;

  if (idParams !== idBody) {
    res.status(500).send("Ids in params and body do not match");
    return;
  } else {
    id = idParams;
  }

  if (!id) {
    res.status(500).send("No id provided");
    return;
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      // handle error
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }

    let trains = JSON.parse(data);

    let trainToModify = trains.find((train) => train.id === id);

    if (!trainToModify) {
      res.status(500).send(`No train with id ${id} found`);
      return;
    } else {
      for (let property in newData) {
        trainToModify[property] = newData[property];
      }
    }
    fs.writeFile(filePath, JSON.stringify(trains, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing file");
        return;
      }

      res.status(200).send(`Successfully modified train with id ${id}`);
    });
  });
});

app.delete("/trains/:id", (req, res) => {
  const filePath = path.join(__dirname, "data", "trains.json");

  const id = req.params.id;
  if (!id) {
    res.status(500).send("No id provided");
    return;
  }

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
      return;
    }

    let trains = JSON.parse(data);

    let trainIndex = trains.findIndex((train) => train.id === id);

    if (trainIndex === -1) {
      res.status(500).send(`No train with id ${id} found`);
      return;
    } else {
      trains.splice(trainIndex, 1);
    }

    fs.writeFile(filePath, JSON.stringify(trains, null, 2), (err) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error writing file");
        return;
      }

      res.status(200).send(`Successfully deleted train with id ${id}`);
    });
  });
});