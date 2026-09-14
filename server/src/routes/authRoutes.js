import { Router } from 'express';

const router = Router();

// In-memory demo store for portfolio demonstration (ready to be replaced with PostgreSQL/MongoDB)
const demoUsers = new Map([
  [
    'demo@duckingfon.app',
    {
      id: 'usr_demo_1',
      email: 'demo@duckingfon.app',
      name: 'Fon Explorer',
      avatar: '🦆',
      unitPreference: 'metric',
      themePreference: 'system',
      soundEnabled: true,
      savedLocations: [
        { name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', countryCode: 'GB' },
        { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', countryCode: 'JP' },
        { name: 'New York', latitude: 40.7128, longitude: -74.0060, country: 'United States', countryCode: 'US' },
        { name: 'Lahore', latitude: 31.5204, longitude: 74.3587, country: 'Pakistan', countryCode: 'PK' },
        { name: 'Dubai', latitude: 25.2048, longitude: 55.2708, country: 'United Arab Emirates', countryCode: 'AE' }
      ]
    }
  ]
]);

router.post('/login', (req, res) => {
  const { email, password } = req.body || {};
  if (!email) {
    return res.status(400).json({ success: false, error: { message: 'Email is required' } });
  }

  const existingUser = demoUsers.get(email.toLowerCase());
  if (existingUser) {
    return res.json({
      success: true,
      data: {
        token: `jwt_sim_${Buffer.from(email).toString('base64')}`,
        user: existingUser
      }
    });
  }

  // Create new profile on the fly for guest exploration
  const newUser = {
    id: `usr_${Date.now()}`,
    email: email.toLowerCase(),
    name: email.split('@')[0],
    avatar: '🦆',
    unitPreference: 'metric',
    themePreference: 'system',
    soundEnabled: false,
    savedLocations: [
      { name: 'London', latitude: 51.5074, longitude: -0.1278, country: 'United Kingdom', countryCode: 'GB' },
      { name: 'Tokyo', latitude: 35.6762, longitude: 139.6503, country: 'Japan', countryCode: 'JP' }
    ]
  };
  demoUsers.set(email.toLowerCase(), newUser);

  res.json({
    success: true,
    data: {
      token: `jwt_sim_${Buffer.from(email).toString('base64')}`,
      user: newUser
    }
  });
});

router.post('/sync-preferences', (req, res) => {
  const { email, preferences, savedLocations } = req.body || {};
  if (email && demoUsers.has(email.toLowerCase())) {
    const user = demoUsers.get(email.toLowerCase());
    if (preferences) Object.assign(user, preferences);
    if (savedLocations) user.savedLocations = savedLocations;
    demoUsers.set(email.toLowerCase(), user);
    return res.json({ success: true, data: user });
  }

  res.json({ success: true, message: 'Preferences updated locally' });
});

export default router;
