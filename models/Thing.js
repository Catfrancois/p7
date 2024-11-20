const mongoose = require('mongoose');

const thingSchema = mongoose.Schema({
   title: { type: String, required: true },
   title1: { type: String, required: true },
   title2: { type: String, required: true },
   title3: { type: String, required: true },
   price: { type: Number, required: true },
});

module.exports = mongoose.model('Thing', thingSchema);