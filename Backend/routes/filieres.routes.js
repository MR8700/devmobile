const router = require('express').Router();
const db = require('../config/db');

// ------------------ GET FILIERES ------------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT DISTINCT filiere FROM etudiant ORDER BY filiere');
    const filieres = rows.map(r => r.filiere);
    res.json(filieres);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
