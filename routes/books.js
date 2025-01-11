const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const nameCtrl = require('../controlers/books');
const router = express.Router();

router.get('/bestrating', nameCtrl.getBestRatedBook);
router.get('/', nameCtrl.getAllBook);
router.get('/:id', nameCtrl.getOneBook);
router.post('/:id/rating', auth, nameCtrl.rateOneBook);
router.put('/:id', auth, multer, nameCtrl.updateBook);
router.delete('/:id', auth, nameCtrl.deleteBook);
router.post('/', auth, multer, nameCtrl.addBook);

module.exports = router;
