const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    type: { type: String, required: true },
    price: { type: Number, required: true },
    
    quantity: { type: Number, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true }, // Store the image filename or path as String
    uniqueId: { type: String, required: true } // Changed from uploadedBy to uniqueId
});

module.exports = mongoose.model('Product', productSchema);
