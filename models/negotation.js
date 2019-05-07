let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

/** @var Schema es una clase que usaremos para crear el modelo para ventas */
let Schema = mongoose.Schema;

/** @var negotationSchema es el modelo de ventas */
let negotationSchema = new Schema({


    product: { type: String, required: [true, 'El producto es necesario'] },

    type: { type: String, required: [true, 'El tipo es requerido'] },
    status: { type: Number, required: false },
    currency: { type: String, required: false},
    person: { type: Schema.Types.ObjectId, ref: 'Person' },
    user: {	type: Schema.Types.ObjectId, ref: 'User' },

    
});


negotationSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' } );

module.exports = mongoose.model('Negotation', negotationSchema);