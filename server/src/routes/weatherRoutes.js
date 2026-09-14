import { Router } from 'express';
import { fetchWeatherData } from '../services/weatherService.js';
import { evaluateWeatherAlerts } from '../services/alertService.js';

const router = Router();

router.get('/', async (req, res, next) => {
  try {
    const { lat, lon, units } = req.query;

    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: { message: 'Parameters "lat" and "lon" are required' }
      });
    }

    const weatherData = await fetchWeatherData({ lat, lon, units });
    const alerts = evaluateWeatherAlerts(weatherData);

    res.json({
      success: true,
      data: {
        ...weatherData,
        alerts
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
