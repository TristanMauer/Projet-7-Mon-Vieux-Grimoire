// importatin des différents modules
const express = require('express');
const mongoose = require('mongoose');
const BodyParser = require('body-parser');
const path = require('path');
const userRoutes = require('./routes/user');
const bookRoutes = require('./routes/books');

// importation variables d'environnement pour l'information d'identification mongoDB
require('dotenv').config();
const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;
const dbCluster = process.env.DB_CLUSTER

// chaîne de connexion mongoDB
const connectionString = `mongodb+srv://${dbUser}:${dbPass}@${dbCluster}.mongodb.net/${dbName}?retryWrites=true&w=majority`;

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connexion à MongoDB réussie !');
  })
  .catch((error) => {
    console.log('Connexion à MongoDB échouée !', error);
  });

  //configuration de l'application express
const app = express();

// configuration des en-têtes CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });

  // Middleware pour analyser les données de requêtes
app.use(express.json());
app.use(BodyParser.json());

//configuration des routes
app.use('/api/books', bookRoutes);
app.use('/api/auth', userRoutes);
app.use('/images', express.static(path.join(__dirname,'images')));

// exportation de l'application Express
module.exports = app;

