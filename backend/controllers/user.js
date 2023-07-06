// importation des modules
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('../models/user');
require('dotenv').config()

// gère l'inscription d'un nouvel utilisateur 
exports.signup = (req, res, next) => {
    // permet de hasher le mdp 10 fois
    bcrypt.hash(req.body.password, 10)
    // création du nouvelle user avec son email et le mdp qui est hasher
    .then(hash => {

      const user = new User({

        email: req.body.email,

        password: hash

      });
      // sauvegarde dans la base de donnée
      user.save()

        .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
      // en cas d'erreur renvoi le statut 402
        .catch(error => res.status(402).json({ error : `message d'erreur`, message : "remplisser carractère" }));

    })

    .catch(error => res.status(500).json({ error : error.message }));
};

// gère l'authetification d'un utilisateur 
exports.login = (req, res, next) => {
 // recherche de l'utilisateur grâce à son email
    User.findOne({ email: req.body.email })
    // renvois un promesse
        .then(user => {
            // si l'utilisateur n'xiste pas renvoie le status 401
            if (!user) {
                return res.status(401).json({ message: 'Paire login/mot de passe incorrecte'});
            }
            // sinon vérifie le mot de passe 
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ message: 'Paire login/mot de passe incorrecte' });
                    }
                    // si tout est correcte renvois un token de connexion qui expire au bout de 24h
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            process.env.RANDOM_TOKEN_SECRET,
                            { expiresIn: '24h'}
                        )
                    });
                })
                // en cas d'erreur renvoi le status 500
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };