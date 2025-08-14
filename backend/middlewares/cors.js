const corsMiddleware = (req, res, next) => {
  const allowedOrigins = [
    'https://pomodoro-frontend-s9yn.onrender.com',
    'http://localhost:3000'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
  }

  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.header('Access-Control-Expose-Headers', 'Authorization'); // 👈 NUEVA LÍNEA
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Vary', 'Origin'); // 👈 NUEVA LÍNEA

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  next();
};

module.exports = corsMiddleware;