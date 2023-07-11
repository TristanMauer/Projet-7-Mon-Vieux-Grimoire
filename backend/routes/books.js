// importation des modules
const express = require('express');
const router = express.Router();
const auth =  require('../middleware/auth');
const multer = require('../middleware/multer-config');
const middlewaresharp = require('../middleware/sharp');
const bookCtrl =  require('../controllers/book');

// les différentes routes de l'api
router.get('/bestrating' ,bookCtrl.bestRating);
router.post('/:id/rating', auth , bookCtrl.averageRating)
router.get('/', bookCtrl.getAllBook);
router.get('/:id', bookCtrl.getOneBook);
router.post('/',auth, multer,middlewaresharp,  bookCtrl.createBook);
router.put('/:id',auth, multer,middlewaresharp, bookCtrl.modifyBook);
router.delete('/:id',  auth, bookCtrl.deleteBook);

// exportation du routeur
module.exports = router;