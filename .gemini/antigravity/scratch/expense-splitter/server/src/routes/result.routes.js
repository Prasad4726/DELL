import express from 'express';
import { getResults } from '../controllers/result.controller.js';

const router = express.Router();

router.get('/calculate', getResults);

export default router;
