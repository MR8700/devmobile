const router = require('express').Router();
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require('../middleware/auth');

// SECRET JWT (à mettre dans un .env)
const JWT_SECRET = 'monsecret123';

// INSCRIPTION
router.post('/register', async (req, res) => {
  try {
    const { nom, prenom, email, password, role, photo } = req.body;
    if (!email || !password || !nom || !prenom)
      return res.status(400).json({ error: "Champs manquants" });

    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO users (nom, prenom, email, password, role, photo) VALUES (?, ?, ?, ?, ?, ?)",
      [nom, prenom, email, hash, role || 'admin', photo || null]
    );

    res.status(201).json({ id: result.insertId, message: "Compte créé" });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }
    res.status(500).json({ error: err.message });
  }
});

// CONNEXION
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Champs manquants" });

    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) return res.status(401).json({ error: "Utilisateur non trouvé" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ error: "Mot de passe incorrect" });

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, role: user.role, photo: user.photo, nom: user.nom, prenom: user.prenom, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Récupérer le profil de l'utilisateur connecté
router.get('/me', verifyToken, async (req, res) => {
  const userId = req.user.id; // injecté par le middleware

  try {
    const [rows] = await db.query(
      'SELECT id, nom, prenom, email, role, photo FROM users WHERE id = ?',
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error('Erreur récupération profil :', err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ===============================
// Mise à jour du profil utilisateur connecté
// ===============================
router.put('/me', verifyToken, async (req, res) => {
  const userId = req.user.id;

  try {
    const { nom, prenom, email, photo } = req.body;

    if (!nom || !prenom || !email) {
      return res.status(400).json({ error: "Champs obligatoires manquants" });
    }

    await db.query(
      `UPDATE users 
       SET nom = ?, prenom = ?, email = ?, photo = ?
       WHERE id = ?`,
      [nom, prenom, email, photo || null, userId]
    );

    // retourner utilisateur mis à jour
    const [rows] = await db.query(
      `SELECT id, nom, prenom, email, role, photo 
       FROM users WHERE id = ?`,
      [userId]
    );

    res.json(rows[0]);

  } catch (err) {
    console.error("Erreur update profil:", err);

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "Email déjà utilisé" });
    }

    res.status(500).json({ error: "Erreur serveur" });
  }
});

// Modifier email utilisateur
router.put('/users/:id/email', verifyToken, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email requis" });
    }

    // Vérifie que l'utilisateur modifie SON propre email
    if (req.user.id !== userId) {
      return res.status(403).json({ message: "Accès interdit" });
    }

    // Vérifier si email déjà utilisé
    const [exist] = await db.query(
      "SELECT id FROM users WHERE email = ? AND id != ?",
      [email, userId]
    );

    if (exist.length > 0) {
      return res.status(400).json({ message: "Email déjà utilisé" });
    }

    await db.query(
      "UPDATE users SET email = ? WHERE id = ?",
      [email, userId]
    );

    res.json({ email });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

module.exports = router;
