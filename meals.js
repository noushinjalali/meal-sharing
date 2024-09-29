import express from 'express';
import knex from '../database_client';

const router = express.Router();

router.get('/meals', async (req, res) => {
  try {
    let query = knex('meals');

    if (req.query.maxPrice) {
      query = query.where('price', '<=', req.query.maxPrice);
    }

    if (req.query.availableReservations === 'true') {
      query = query.join('reservations', 'meals.id', '=', 'reservations.meal_id')
                   .groupBy('meals.id')
                   .having(knex.raw('max_reservations - COUNT(reservations.id)'), '>', 0);
    } else if (req.query.availableReservations === 'false') {
      query = query.join('reservations', 'meals.id', '=', 'reservations.meal_id')
                   .groupBy('meals.id')
                   .having(knex.raw('max_reservations - COUNT(reservations.id)'), '<=', 0);
    }

    if (req.query.title) {
      query = query.where('title', 'like', `%${req.query.title}%`);
    }

    if (req.query.dateAfter) {
      query = query.where('when', '>', req.query.dateAfter);
    }

    if (req.query.dateBefore) {
      query = query.where('when', '<', req.query.dateBefore);
    }

    if (req.query.sortKey) {
      const sortDir = req.query.sortDir || 'asc';
      query = query.orderBy(req.query.sortKey, sortDir);
    }

    if (req.query.limit) {
      query = query.limit(parseInt(req.query.limit));
    }

    const meals = await query.select('*');
    res.json(meals);

  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve meals' });
  }
});

export default router;
