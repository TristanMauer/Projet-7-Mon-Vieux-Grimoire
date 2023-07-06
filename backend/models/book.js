
const mongoose = require("mongoose")

// Schéma de données permetant la création d'un Book
const bookSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  year: {
    type: Number,
    required: true
  },
  genre: {
    type: String,
    required: true
  },
  ratings: [{
    userId: {
      type: String,
      required: true
    },
    grade: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  }
})

//exportation du schema en tant que model Book
module.exports = mongoose.model("Book", bookSchema)