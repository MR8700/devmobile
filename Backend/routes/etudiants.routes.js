const router = require('express').Router();
const db = require('../config/db');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

/* ======================================================
   GARANTIR DOSSIER UPLOADS
====================================================== */

if (!fs.existsSync('uploads')) {
  fs.mkdirSync('uploads');
}

/* ======================================================
   MULTER CONFIG
====================================================== */

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
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Fichier non image'));
    }
    cb(null, true);
  },
});

/* ======================================================
   LISTE ETUDIANTS
====================================================== */

router.get('/', async (req, res) => {
  try {

    const [rows] = await db.query(
      "SELECT * FROM etudiant ORDER BY id DESC"
    );

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

/* ======================================================
   AJOUT ETUDIANT
====================================================== */

router.post('/', async (req, res) => {
  try {

    const {
      ine,
      nom,
      prenom,
      age,
      telephone,
      sexe,
      filiere
    } = req.body;

    if (!ine || !nom || !prenom) {
      return res.status(400).json({ error: "Champs manquants" });
    }

    const [result] = await db.query(
      `INSERT INTO etudiant 
      (ine, nom, prenom, age, telephone, sexe, filiere, photo)
      VALUES (?, ?, ?, ?, ?, ?, ?, NULL)`,
      [ine, nom, prenom, age, telephone, sexe, filiere]
    );

    res.status(201).json({
      id: result.insertId,
      ine,
      nom,
      prenom,
      age,
      telephone,
      sexe,
      filiere,
      photo: null
    });

  } catch (err) {

    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: "INE déjà utilisé" });
    }

    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   DETAIL ETUDIANT
====================================================== */

router.get('/:id', async (req, res) => {
  try {

    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

    const [rows] = await db.query(
      "SELECT * FROM etudiant WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    const host = req.protocol + '://' + req.get('host');

    const student = {
      ...rows[0],
      photo: rows[0].photo ? host + rows[0].photo : null
    };

    res.json(student);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   UPDATE ETUDIANT
====================================================== */

router.put('/:id', async (req, res) => {
  try {

    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

    const {
      ine,
      nom,
      prenom,
      age,
      telephone,
      sexe,
      filiere,
      photo
    } = req.body;

    const [result] = await db.query(
      `UPDATE etudiant
       SET ine=?, nom=?, prenom=?, age=?, telephone=?, sexe=?, filiere=?, photo=?
       WHERE id=?`,
      [ine, nom, prenom, age, telephone, sexe, filiere, photo, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Étudiant introuvable" });
    }

    res.json({ message: "Étudiant mis à jour" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   DELETE ETUDIANT
====================================================== */

router.delete('/:id', async (req, res) => {
  try {

    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

    const [result] = await db.query(
      "DELETE FROM etudiant WHERE id=?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Étudiant non trouvé" });
    }

    res.json({ message: "Supprimé avec succès" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ======================================================
   UPLOAD PHOTO
====================================================== */

router.put('/:id/photo', upload.single('photo'), async (req, res) => {
  try {

    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ error: "ID invalide" });

    if (!req.file) {
      return res.status(400).json({ error: "Photo manquante" });
    }

    // Vérifier étudiant existe
    const [rows] = await db.query(
      "SELECT photo FROM etudiant WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: "Étudiant introuvable" });
    }

    // Supprimer ancienne photo
    if (rows[0].photo) {

      const oldPath = path.join(
        process.cwd(),
        rows[0].photo
      );

      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }

    const photoPath = `/uploads/${req.file.filename}`;
    const host = req.protocol + '://' + req.get('host');

    await db.query(
      "UPDATE etudiant SET photo=? WHERE id=?",
      [photoPath, id]
    );

    res.json({
      id,
      photo: host + photoPath
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
