const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CookieSchema = new Schema({
    cookie: {
        type: String,
        required: true
    },
    block: {
        type: Boolean,
        required: true
    }
});

module.exports = mongoose.model('Cookie', CookieSchema);