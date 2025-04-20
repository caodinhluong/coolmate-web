import express from 'express';
import { body, validationResult } from 'express-validator';

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    logger.warn(`Validation failed for auth: ${JSON.stringify(errors.array())}`, { method: req.method, url: req.url });
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};



export default router;