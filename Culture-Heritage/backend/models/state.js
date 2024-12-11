const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
    stateName: { type: String, required: true },
    introduction: { type: String, required: true },
    history: { type: [String], required: true },
    artsAndCrafts: { type: [String], required: true },
    food: { type: [String], required: true },
    festivals: { type: [String], required: true },
    touristPlaces: { type: [String], required: true }, // Added this field
    images: { type: [String], required: true },
});

module.exports = mongoose.model('State', stateSchema);
