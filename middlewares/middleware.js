/**Importaciones */
/**@const jwt es moduli necesario para crear el token */
var jwt = require('jsonwebtoken');
/** @constant error es la funcion para mostrar la respuesta de error */
const { error } = require('../config/responses');

exports.verificarToken = ( req, res,next) =>{
     /**@var token trae el token  y lo guarda en la variable token  */
     var token  = req.query.token;
     jwt.verify(token,'@novalpixel-g3z7404:',(err,decoded)=>{
         if(err){
             /**@constant message  es el mensaje de error */
             const message = 'Token invalido';
             error(err,res,401,message)
             return;    
         }
     req.user = decoded;
     next();
     });
}