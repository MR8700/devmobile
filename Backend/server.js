const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ------------------ MIDDLEWARE ------------------
app.use(express.json()); // pour lire le JSON envoyé par Expo
app.use(cors());        // pour les requêtes Cross-Origin

// Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ------------------ ROUTES ------------------
const authRoutes = require('./routes/auth.routes');
const etudiantsRoutes = require('./routes/etudiants.routes');

app.use('/auth', authRoutes);
app.use('/etudiants', etudiantsRoutes);

// ------------------ ERREURS 404 ------------------
app.use((req, res, next) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// ------------------ LANCEMENT SERVEUR ------------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
  console.log(`Pour l'émulateur Android utilisez : http://10.0.2.2:${PORT}`);
});
