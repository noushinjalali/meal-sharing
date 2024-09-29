import express from 'express';
import knex from '../database_client.js';

const router = express.Router();

// GET /api/reviews - Returns all reviews
router.get('/', async (req, res) => {
  try {
    const reviews = await knex('reviews').select('*');
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
});

// GET /api/meals/:meal_id/reviews - Returns all reviews for a specific meal
router.get('/meals/:meal_id/reviews', async (req, res) => {
  try {
    const { meal_id } = req.params;
    const reviews = await knex('reviews').where('meal_id', meal_id);
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve reviews' });
  }
});

// POST /api/reviews - Adds a new review
router.post('/', async (req, res) => {
  try {
    const newReview = req.body;
    const [id] = await knex('reviews').insert(newReview);
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

// GET /api/reviews/:id - Returns a review by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const review = await knex('reviews').where('id', id).first();
    if (review) {
      res.json(review);
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve review' });
  }
});

// PUT /api/reviews/:id - Updates the review by id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedReview = req.body;
    const rowsAffected = await knex('reviews').where('id', id).update(updatedReview);
    if (rowsAffected) {
      res.json({ message: 'Review updated successfully' });
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update review' });
  }
});

// DELETE /api/reviews/:id - Deletes the review by id
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const rowsAffected = await knex('reviews').where('id', id).del();
    if (rowsAffected) {
      res.json({ message: 'Review deleted successfully' });
    } else {
      res.status(404).json({ error: 'Review not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete review' });
  }
});

export default router;

