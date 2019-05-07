let mongoose = require('mongoose');
let uniqueValidator = require('mongoose-unique-validator');

/** @var Schema es una clase que usaremos para crear el modelo para usuarios */
let Schema = mongoose.Schema;
 teamUserSchema = new Schema ({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    teamId: {type: Schema.Types.ObjectId, ref: 'Team'},
    leader: {type: Boolean, required:false}
 });
teamUserSchema.plugin( uniqueValidator, { message: '{PATH} debe de ser unico' } );
module.exports = mongoose.model('TeamUser', teamUserSchema);
