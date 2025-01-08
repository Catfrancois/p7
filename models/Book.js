const mongoose = require('mongoose');

const bookSchema = mongoose.Schema({
   title: { type: String, required: true },
   author: { type: String, required: true },
   year: { type: Number, required: true },
   genre: { type: String, required: true },
   imageUrl: { type: String, required: false },
   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
   ratings: [
      {
         userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
         grade: { type: Number, required: true, min: 0, max: 5 }
      }
   ],
   averageRating: { type: Number, default: 0 }
});

bookSchema.pre('save', function (next) {
   if (this.isModified('ratings') && this.ratings.length > 0) {
      this.averageRating = this.ratings.reduce((acc, rating) => acc + rating.grade, 0) / this.ratings.length;
   }
   next();
});

module.exports = mongoose.model('Book', bookSchema);
