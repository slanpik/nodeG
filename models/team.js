let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');
/** @const User trae el modelo de usuarios  */
const Person = require ('../models/person');

/** @var Schema es una clase que usaremos para crear el modelo para de teams */
let Schema = mongoose.Schema;

/** @var teamSchema es el modelo de usuario */
let teamSchema = new Schema({
    name: { type: String, required: [true, 'El nombre es necesario'] },
    description:{ type: String,required:false},
    created_at: { type: Date, required: false }, 
    updated_at: { type: Date, required: false }, 
    group_task_id: { type: Number, required: false }, 
    created_by: { type: Number, required: false }, 
    updated_by: { type: Number, required: false },    
});
teamSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' } );

// module.exports = mongoose.model('User', userSchema);
module.exports = mongoose.model('Team', teamSchema);
