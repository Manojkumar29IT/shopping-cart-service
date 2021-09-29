const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
    name: String,
    description: String,
    image_url: String,
    quantity: String
});

module.exports = ItemSchema;