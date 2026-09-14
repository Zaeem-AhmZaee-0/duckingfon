import { Router } from 'express';
import { searchLocations, reverseGeocode } from '../services/geocodingService.js';

const router = Router();

router.get('/search', async (req, res, next) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.json({ success: true, data: [] });
    }

    const results = await searchLocations(query);
    res.json({
      success: true,
      data: results
    });
  } catch (err) {
    next(err);
  }
});

router.get('/reverse', async (req, res, next) => {
  try {
    const { lat, lon } = req.query;
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: { message: 'Parameters "lat" and "lon" are required for reverse geocoding' }
      });
    }

    const location = await reverseGeocode({ lat, lon });
    res.json({
      success: true,
      data: location
    });
  } catch (err) {
    next(err);
  }
});

export default router;
