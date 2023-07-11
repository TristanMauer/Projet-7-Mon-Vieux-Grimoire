// importation des modules
const sharp = require('sharp');
const fs = require('fs');

// définition du middleware
const compressImage = async (req, res, next) => {
    // vérigication de la présence du fichier
    if(!req.file) {
        return next();
    };
   try {
    // compression de l'image
        await sharp(req.file.path) 
            .resize({
                width: 500,
                height: 700,
            })
            .webp({ quality: 80 })
            .toFile(`${req.file.path.split('.')[0]}compress.webp`);
        
          // suppresion du fichier d'origine et mise à jour du chemin du fichier  
            fs.unlink(req.file.path, (err) => {
                req.file.path = `${req.file.path.split('.')[0]}compress.webp`;
                if(err) {
                    console.log(err);
                };
                next();
            });

        } catch (error) {
             res.status(500).json({ error });
        };
};

module.exports = compressImage;