import "dotenv/config";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import knex from "./database_client.js";
import nestedRouter from "./routers/nested.js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

const apiRouter = express.Router();


apiRouter.get("/future-meals", async (req, res) => {
  try {
    const meals = await knex.raw("SELECT * FROM Meal WHERE meal_datetime > NOW()");
    res.json(meals[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get("/past-meals", async (req, res) => {
  try {
    const meals = await knex.raw("SELECT * FROM Meal WHERE meal_datetime < NOW()");
    res.json(meals[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get("/all-meals", async (req, res) => {
  try {
    const meals = await knex.raw("SELECT * FROM Meal ORDER BY id");
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


apiRouter.get("/first-meal", async (req, res) => {
  try {
    const meals = await knex.raw("SELECT * FROM Meal ORDER BY id ASC LIMIT 1");
    if (meals.length === 0) {
      res.status(404).json({ error: "No meals found" });
    } else {
      res.json(meals[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


apiRouter.get("/last-meal", async (req, res) => {
  try {
    const meals = await knex.raw("SELECT * FROM Meal ORDER BY id DESC LIMIT 1");
    if (meals.length === 0) {
      res.status(404).json({ error: "No meals found" });
    } else {
      res.json(meals[0]);
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get("/test-meals", async (req, res) => {
  try {
      const meals = await knex.raw("SELECT * FROM Meal");
      res.json(meals[0]);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

app.use("/api", apiRouter);

app.listen(process.env.PORT, () => {
  console.log(`API listening on port ${process.env.PORT}`);
});