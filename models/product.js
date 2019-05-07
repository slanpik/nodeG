let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let productSchema = new Schema({

    name: { type: String, required: [true, 'El nombre es necesario'] },
    description: { type: String, required: false },
    type: { type: String, required: false },
    status: { type: String, required: false },
    price: { type: Number, required: false }
});

productSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' } );

module.exports = mongoose.model('Product', productSchema);