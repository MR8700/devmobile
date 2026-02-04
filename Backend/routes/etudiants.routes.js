const router = require('express').Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// ------------------ Multer ------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `photo_${req.params.id}_${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Fichier non image"));
    }
    cb(null, true);
  },
});

// ------------------ LISTE DES ÉTUDIANTS ------------------
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query("SELECT * FROM etudiant ORDER BY id DESC");
    
    // Transformer le chemin de la photo en URL complète
    const host = req.protocol + '://' + req.get('host');
    const data = rows.map(r => ({
      ...r,
      photo: r.photo ? host + r.photo : null
    }));

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ AJOUTER UN ÉTUDIANT ------------------
router.post('/', async (req, res) => {
  try {
    const { ine, nom, prenom, age, telephone, sexe, filiere, photo } = req.body;
    if (!ine || !nom || !prenom) return res.status(400).json({ error: "Champs manquants" });

    const [result] = await db.query(
      "INSERT INTO etudiant (ine, nom, prenom, age, telephone, sexe, filiere, photo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [ine, nom, prenom, age, telephone, sexe, filiere, photo || null]
    );

    res.status(201).json({ id: result.insertId, ...req.body });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') return res.status(400).json({ error: "INE déjà utilisé" });
    res.status(500).json({ error: err.message });
  }
});

// ------------------ MISE À JOUR D'UN ÉTUDIANT ------------------
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { ine, nom, prenom, age, telephone, sexe, filiere, photo } = req.body;

    const [result] = await db.query(
      `UPDATE etudiant
       SET ine=?, nom=?, prenom=?, age=?, telephone=?, sexe=?, filiere=?, photo=?
       WHERE id=?`,
      [ine, nom, prenom, age, telephone, sexe, filiere, photo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Étudiant introuvable" });
    }

    res.json({ message: "Étudiant mis à jour" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ------------------ SUPPRIMER UN ÉTUDIANT ------------------
router.delete('/:id', async (req, res) => {
  try {
    const [result] = await db.query("DELETE FROM etudiant WHERE id = ?", [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Étudiant non trouvé" });
    res.json({ message: "Supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------ UPLOAD PHOTO ------------------
router.put('/:id/photo', upload.single('photo'), async (req, res) => {
  try {
    const id = req.params.id;

    if (!req.file) return res.status(400).json({ error: "Photo manquante" });

    const host = req.protocol + '://' + req.get('host');
    const photoPath = `/uploads/${req.file.filename}`;

    // Supprimer ancienne photo si existante
    const [old] = await db.query("SELECT photo FROM etudiant WHERE id=?", [id]);
    if (old[0]?.photo) {
      const oldPath = '.' + old[0].photo;
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    // Mise à jour en BD
    const [result] = await db.query(
      "UPDATE etudiant SET photo=? WHERE id=?",
      [photoPath, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ error: "Étudiant introuvable" });

    res.json({ id, photo: host + photoPath });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
