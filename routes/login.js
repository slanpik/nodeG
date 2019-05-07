/**Importaciones */
const express = require('express');
// /** @constant error es la funcion para mostrar la respuesta de error */
const { error } = require('../config/responses');
/** @const User trae el modelo de  Usuarios  */
const User = require ('../models/user');
/** @const bcrypt es el modulo necesario para encriptar contraseñas por una sola via */
const bcrypt = require('bcryptjs');
/**@const jwt es moduli necesario para crear el token */
var jwt = require('jsonwebtoken');
/** Declaraciones */
let app = express();
/**funcion para loguear en la aplicacion  */

app.post('/',(req,res) => {
// inicializamos el body parser para obtener los datos
    var body = req.body;
    User.findOne({email: body.email},(err,user) =>{
       
        if(err) {

            /** @constant message es el mensaje de error */
            const message = 'Ocurrio un error al buscar el usuario';
            error(err, res, 500, message);
            return ;
        }

        if(!user){
            /** @constant message es el mensaje de error */
            const message = `El usuario con el email: ${body.email}, no existe`;
            /** @constant err es el error que se genera */
            const err = { message: 'No existe un usuario con ese email' };
            error(err, res, 401, message);
            return;
        }

        if ( !bcrypt.compareSync( body.password, user.password ) ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Credenciales incorrectas - password',
                errors: err
            });
        } 
        
       // Crear un token
       user.password = '****';
       var token = jwt.sign({ user: user},'@novalpixel-g3z7404:', { expiresIn: 14400 }); // vence en 4 horas

       res.status(200).json({
           ok: true,
            mensaje: 'token creado',
           token: token,
          
       });
    });
});

module.exports = app;