const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

/* ================= CONFIG ================= */

const PORT = process.env.PORT || 3000;

/* ================= CREATION DOSSIER UPLOAD ================= */

const uploadsDir = path.join(__dirname, 'uploads');

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir);
  console.log("📂 Dossier uploads créé");
}

/* ================= MIDDLEWARE ================= */

app.use(helmet()); // sécurité headers
app.use(morgan('dev')); // logs requêtes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ================= FICHIERS STATIQUES ================= */

app.use('/uploads', express.static(uploadsDir));

/* ================= ROUTES ================= */

const authRoutes = require('./routes/auth.routes');
const etudiantsRoutes = require('./routes/etudiants.routes');
const filieresRoutes = require('./routes/filieres.routes');

app.use('/auth', authRoutes);
app.use('/etudiants', etudiantsRoutes);
app.use('/filieres', filieresRoutes);

/* ================= ROUTE TEST ================= */

app.get('/', (req, res) => {
  res.json({ message: "API Gestion Étudiants opérationnelle" });
});

/* ================= GESTION 404 ================= */

app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

/* ================= GESTION ERREURS GLOBALES ================= */

app.use((err, req, res, next) => {
  console.error("Erreur serveur :", err);

  res.status(err.status || 500).json({
    error: err.message || "Erreur interne serveur"
  });
});

/* ================= DEMARRAGE SERVEUR ================= */

app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré`);
  console.log(`🌍 Local : http://localhost:${PORT}`);
  console.log(`📱 Android Emulator : http://10.0.2.2:${PORT}`);
});
