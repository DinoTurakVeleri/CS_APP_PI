const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized - No token provided.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const JWT_SECRET = process.env.JWT_SECRET || 'tajna_lozinka';
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Forbidden - Invalid token.' });
  }
};

const checkRole = (allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user?.role?.toUpperCase(); // Normalize user role
    const normalizedRoles = allowedRoles.map(r => r.toUpperCase()); // Normalize allowed roles

    console.log('checkRole -> user role:', userRole);
    console.log('checkRole -> allowed roles:', normalizedRoles);

    if (!userRole || !normalizedRoles.includes(userRole)) {
      console.log('Access denied by checkRole middleware');
      return res.status(403).json({ error: 'Access denied - Insufficient permissions.' });
    }

    next();
  };
};

module.exports = {
  verifyToken,
  checkRole,
};
