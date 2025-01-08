const express = require('express');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const nameCtrl = require('../controlers/books');
const router = express.Router();

router.post('/', auth, multer, nameCtrl.addBook);
router.put('/:id', auth, multer, nameCtrl.updateBook);
router.delete('/:id', auth, nameCtrl.deleteBook);
router.get('/:id', nameCtrl.getOneBook);
router.get('/', nameCtrl.getAllBook);
router.post('/:id/rating', auth, nameCtrl.rateOneBook);
router.get('/bestrating', nameCtrl.getBestRatedBook);

module.exports = router;
