const Book = require('../models/Book');
const fs = require('fs');

exports.addBook = (req, res) => {
    const bookObject = JSON.parse(req.body.book);
    delete bookObject._id;
    delete bookObject._userId;
    const book = new Book({
        ...bookObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });

    book.save()
        .then(() => { res.status(201).json({ message: 'Livre enregistré !'})})
        .catch(error => res.status(400).json({ error }));
};

exports.updateBook = (req, res) => {
    const bookId = req.params.id;
    const bookObject = req.file ? {
    ...JSON.parse(req.body.book),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        }
        : { ...req.body };

    delete bookObject.userId;
    Book.findOne({ _id: bookId })
        .then((book) => {
            if (book.userId.toString() !== req.auth.userId.toString()) {
                return res.status(401).json({ message: 'Non-autorisé' });
            }

            Book.updateOne({ _id: bookId }, { ...bookObject, _id: bookId })
                .then(() => {
                    Book.findOne({ _id: bookId })
                        .then((updatedBook) => res.status(200).json(updatedBook))
                        .catch((error) => res.status(400).json({ error }));
                })
                .catch((error) => res.status(400).json({ error }));
        })
        .catch((error) => {
            res.status(400).json({ error });
        });
};

exports.deleteBook = (req, res) => {
    Book.findOne({ _id: req.params.id})
        .then(book => {
            if (book.userId.toString() !== req.auth.userId.toString()) {
                return res.status(401).json({ message: 'Non-autorisé' });
            } else {
               const filename = book.imageUrl.split('/images/')[1];
               fs.unlink(`images/${filename}`, () => {
                   Book.deleteOne({_id: req.params.id})
                       .then(() => { res.status(200).json({message: 'Livre supprimé !'})})
                       .catch(error => res.status(401).json({ error }));
               });
           }
        })
        .catch(error => {
            res.status(500).json({ error });
        });
}

exports.getOneBook = (req, res) => {
    Book.findOne({ _id: req.params.id })
    .then(thing => res.status(200).json(thing))
    .catch(error => res.status(404).json({ error }));
};

exports.getAllBook = (req, res) => {
    Book.find()
    .then(books => res.status(200).json(books))
    .catch(error => res.status(400).json({ error }));
};

exports.rateOneBook = (req, res) => {
    const { userId, rating } = req.body;
    const grade = rating;
    Book.findOne({ _id: req.params.id })
        .then(book => {
            // enregistre si user n'a pas deja note le livre
            if (book.ratings.filter(rating => rating.userId === userId).length === 0) {
                // update average rating
                book.averageRating = book.ratings.reduce((acc, curr) => acc + curr.grade, 0) / book.ratings.length;
                book.ratings.push({ userId, grade });
                book.save()
                    .then(() => res.status(200).json(book))
                    .catch(error => res.status(502).json({ error }));
            }
        })
        .catch(error => res.status(501).json({ error }));
};

exports.getBestRatedBook = (req, res) => {
    Book.find()
        .then(books => {
            const sortedBooks = books.sort((a, b) => b.averageRating - a.averageRating);
            const topBooks = sortedBooks.slice(0, 3);
            res.status(200).json(topBooks);
        })
        .catch(error => res.status(500).json({ error }));
};
