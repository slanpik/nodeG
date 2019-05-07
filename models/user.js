let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

/** @var Schema es una clase que usaremos para crear el modelo para usuarios */
let Schema = mongoose.Schema;

/** @var userSchema es el modelo de usuario */
let userSchema = new Schema({

    first_name: { type: String, required: [true, 'El nombre es necesario'] },
    last_name: { type: String, required: [true, 'El apellido es necesario'] },
    document: { type: String, unique: true, required: [true, 'El documento de identidad es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'La contraseña es necesario'] },
    phone: { type: String, required: [true, 'El telefeno es necesario'] },
    mphone: { type: String, required: false },
    img_path: { type: String, required: false },
    type: { type: String, required: false },
    address: { type: String, required: false },
    city: { type: String, required: false },
    birth_date: { type: Date, required: false },
    start_date: { type: Date, required: false },
    end_date: { type: Date, required: false },
});

userSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' } );

module.exports = mongoose.model('User', userSchema);