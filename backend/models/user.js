// importation des modules 
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//création d'un schéma pour l'autenthification 
const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

// permet de vérifier qu'il n'existe pas  plusieur fois le même utilisateur dans la base de données
userSchema.plugin(uniqueValidator);

// exportation du schéma en tant que model User
module.exports = mongoose.model('User', userSchema);