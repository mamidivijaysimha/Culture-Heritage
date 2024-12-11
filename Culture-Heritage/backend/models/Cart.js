const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    uniqueId: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true },
});

module.exports = mongoose.model('Cart', cartSchema);
