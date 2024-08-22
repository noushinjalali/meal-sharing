import express from "express";
import knex from "../database_client.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const meals = await knex("meals").select("*");
    res.json(meals);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const meal = await knex("meals").where({ id: req.params.id }).first();
    if (!meal) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.json(meal);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const [id] = await knex("meals").insert(req.body);
    res.status(201).json({ message: "Meal created", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const count = await knex("meals")
      .where({ id: req.params.id })
      .update(req.body);
    if (!count) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.json({ message: "Meal updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const count = await knex("meals").where({ id: req.params.id }).del();
    if (!count) {
      return res.status(404).json({ message: "Meal not found" });
    }
    res.json({ message: "Meal deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
