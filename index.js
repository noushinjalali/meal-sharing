import express from 'express';
import mealsRouter from './meals';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use('/api', mealsRouter);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
