// importation des différents modules
const Book = require('../models/book');
const fs = require('fs');

// création d'un livre 
exports.createBook = (req, res, next) => {
    //analyse de book 
    const bookObject = JSON.parse(req.body.book);
    // suppression de la clé _id et du userId  évite tout modifcation non autorisée
    delete bookObject._id;
    delete bookObject.userId;
    
    // nouvel objet book en utilisant le modèle Book 
    const book = new Book({
      ...bookObject,
      userId: req.auth.userId,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename.split('.')[0]}compress.webp`,
    });
    // le livre est enregistré sur l'objet book
        book.save()
        .then(() => {res.status(201).json({message: 'Post saved successfully!' });
        }
        // en cas d'erreur il renvoi un statut 400
      ).catch( (error) => { res.status(400).json({error: error});} );
    };
    
    // Permet de récupérer un seul livre  précis
    exports.getOneBook = (req, res, next) => {
      //  récupère l'id  sur le modèle Book
      Book.findById(req.params.id)
      // si c'est bon renvoi  le statut 200
          .then(book => res.status(200).json(book))
      // dans le cas contraire renvoi le statut 400
          .catch(error => res.status(400).json({error}))
  }

  exports.modifyBook = (req, res, next) => {
    const {id} = req.params
    // Vérifie qu'il y a bien un fichier
    const bookObject = req.file ? {
        ...JSON.parse(req.body.book),
        imageUrl:  `${req.protocol}://${req.get('host')}/images/${req.file.filename.split('.')[0]}compress.webp`
    } : {...req.body}
    
    // suppression de la clé _id et du userId  évite tout modifcation non autorisée
    delete bookObject._userId
    Book.findById(id)
        .then(book => {
            // vérifie si l'utilisateur à bien l'autorisation de modifier le livre
            if (book.userId != req.auth.userId) {
                res.status(403).json({message:"Requête non-autorisée"})
            } else {
                Book.updateOne({_id: id}, {...bookObject, _id: id})
                .then(() => res.status(200).json({message : "Objet modifié!"}))
                .catch(error => res.status(401).json({error}))
            }
        })
        .catch(error => res.status(500).json({error}))
}

// définition de la note moyenne
exports.averageRating = (req, res, next) => {

  // définition d'un nouvel objet 
  const newRating = {
      userId: req.body.userId,
      grade: req.body.rating
  }

  // recherche du livre en passant par son id dans la base de données 
  Book.findById(req.params.id)
      .then(book => {
          // vérifie si l'utilisateur à déja noter où non le livre
          if (book.ratings.find(rating => rating.userId.toString() === req.body.userId)) {
          return res.status(400).json({message: "Vous avez déjà donné une note à ce livre"})

          } else {
       
          book.ratings.push(newRating)
          
          const ratings = book.ratings.map((rating) => rating.grade);
          const sum = ratings.reduce((acc, cur) => acc + cur, 0);
          const average = Math.ceil(sum / ratings.length)

          book.averageRating = average
          book.save()
              .then(book => res.status(200).json(book))
              .catch(error => res.status(400).json({error}))
          }
      })
      // si aucun livre n'est trouver renvoie le statut 500
      .catch(error => res.status(500).json({error}))
}
    // suppression d'un livre
    exports.deleteBook = (req, res, next) => {

      // recherche d'un livre en fonction de son id
      Book.findOne({ _id: req.params.id})
      //renvoie un promesse
      .then(book => {
        // si le user id et différent du user id du livre renvoi le statut 401 sinon permet la suppression du livre
          if (book.userId != req.auth.userId) {
              res.status(401).json({message: 'Not authorized'});
          } else {
              const filename = book.imageUrl.split('/images/')[1];
              fs.unlink(`images/${filename}`, () => {
                  Book.deleteOne({_id: req.params.id})
                      .then(() => { res.status(200).json({message: 'Objet supprimé !'})})
                      .catch(error => res.status(401).json({ error }));
              });
          }
      })
      .catch( error => {
          res.status(500).json({ error });
      });
      
      };
      
      // récupère tout les livres
      exports.getAllBook = (req, res, next) => { 
        // la méthodé find() étant sans argument récupère toutes les données de la collection books
        Book.find()
        // si la recherche est réussie renvoie la liste des livres
        .then((books) => {
           res.status(200).json(books);
        })  
        // si une erreur se produit renvoi le statut 500
        .catch((error) => {
           res.status(400).json({ error: error });
        });
      }
  
      // Récupère les 3 meilleurs livres
      exports.bestRating = (req, res, next) => {
        //définition de la constante maxResules sur 3
        const maxResults = 3; 
        // utilisation d'aggregate sur le modèle Book
        Book.aggregate([
          {
            // sort permet de trier les livre en fonction de averageRating de manière décroissante. Il mettra donc en permier les meilleures notes
            $sort: {averageRating: -1}
          },
          {
            // Limite étant définie sur maxResults vas renvoyer que 3 livres
            $limit: maxResults
          }
        ])
        // Renvoies les 3 meilleurs books
        .then(books => res.status(200).json(books))
        // en cas d'erreur renvoi un statut 400
        .catch(error => res.status(400).json({error: error.message}))
    }

    