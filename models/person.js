let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let personSchema = new Schema({

    first_name: { type: String, required: [true, 'El nombre es necesario'] },
    last_name: { type: String, required: [true, 'El apellido es necesario'] },
    document: { type: String, unique: true, required: [true, 'El documento de identidad es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    type: { type: String, required: false },
    img_path: { type: String, required: false },
    birth_date: { type: Date, required: false },
    facebook: { type: String, required: false },
    twitter: { type: String, required: false },
    skype: { type: String, required: false },
    linkedin: { type: String, required: false },
    web_page: { type: String, required: false },
    secondary_email: { type: String, required: false },
    appointment: { type: String, required: false },
    create_by: { type: Date, required: false },
    converted: { type: Number, required: false },
    reason: { type: String, required: false },
    commet: { type: String, required: false },
    mark: { type: Boolean, required: false },
    numbers_phone: { type: String, required: false },
    address: { type: String, required: false },
});

personSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' } );

module.exports = mongoose.model('Person', personSchema);