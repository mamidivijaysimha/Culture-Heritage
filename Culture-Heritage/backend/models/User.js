const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
    },
    uniqueId: {
        type: String,
        required: true,
        unique: true,
    },
    image: {
        type: String, // Field to store the image path
    },
}, {
    timestamps: true,
});

// Create the User model
const User = mongoose.model('User', userSchema);

// Export the model
module.exports = User;
