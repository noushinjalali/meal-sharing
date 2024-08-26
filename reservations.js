import express from "express";
import knex from "../database_client.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const reservations = await knex("reservations").select("*");
    res.json(reservations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const reservation = await knex("reservations")
      .where({ id: req.params.id })
      .first();
    if (!reservation) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json(reservation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const [id] = await knex("reservations").insert(req.body);
    res.status(201).json({ message: "Reservation created", id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const count = await knex("reservations")
      .where({ id: req.params.id })
      .update(req.body);
    if (!count) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json({ message: "Reservation updated" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const count = await knex("reservations").where({ id: req.params.id }).del();
    if (!count) {
      return res.status(404).json({ message: "Reservation not found" });
    }
    res.json({ message: "Reservation deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
