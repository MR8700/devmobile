const jwt = require('jsonwebtoken');

// SECRET JWT — à mettre dans un fichier .env pour plus de sécurité
const JWT_SECRET = process.env.JWT_SECRET || 'monsecret123';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader) {
    return res.status(401).json({ error: 'Token manquant' });
  }

  // Format attendu : "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Token invalide' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // injecte { id, role } dans req.user
    next();
  } catch (err) {
    console.error('Erreur token:', err);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

module.exports = { verifyToken };
