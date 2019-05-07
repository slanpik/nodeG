/**Importaciones */
const express = require('express');
/** @constant se importa la base de datos  mongoose */
let mongoose = require('mongoose');
/** @const User trae el modelo de usuarios  */
const User = require ('../models/user');
/** @const bcrypt es el modulo necesario para encriptar contraseñas por una sola via */
const bcrypt = require('bcryptjs');
/** @constant error es la funcion para mostrar la respuesta de error */
const { error } = require('../config/responses');
/** @const middleware es el modulo necesario para validar con un token */
const middleware = require ('../middlewares/middleware');

/** Declaraciones */
let app = express();


/** Funcion para obtener todos los usuarios */
app.get('/',middleware.verificarToken, (req, res) => {

    User.find({}, (err, users) => {

        if( err ) {

            /** @constant message es el mensaje de error */
            const message = 'Error al cargar los usuarios!';
            error(err, res, 500, message );
            return;
        }

        res.status(200).json({
            ok: true,
            usuarios: users
        });
    });
});

/** Funcion para obtener un usuario especifico */
app.get('/:id',middleware.verificarToken, (req, res) => {

    /** @constant id es el id del usuario el cual se esta realizando la peticion */
    const id = req.params.id;

    User.findById(id, (err, user) => {

        if( err ) {

            /** @constant message es el mensaje de error */
            const message = 'Error al cargar el usuario!';
            error(err, res, 500, message );
            return;
        }

        res.status(200).json({
            ok: true,
            usuario: user
        });
    });
});

/** Funcion para crear un usuario */
app.post('/', (req, res) => {

    /** @constant body son los datos que se actualizaran del usuario */
    const body = req.body;
    /** @constant pass es la contraseña del usuario con el bcrypt */
    const pass = bcrypt.hashSync(body.password, 10);

    // guardo los datos de un usuario
    let user = new User({
        first_name: body.nombre,
        last_name: body.apellido,
        email: body.email,    
        password: pass,    
        document: body.documento,
        phone: body.telefono,
        mphone: body.celular,
        img_path: body.img,
        type: body.tipo,
        address: body.direccion,
        city: body.ciudad,
        birth_date: body.birth_date,
        start_date: body.start_date,
        end_date: body.end_date,
    });


    // guardamos el usuario
    user.save( ( err, userSave) => {

        if( err ) {
            
            /** @constant message es el mensaje de error */
            const message = 'Error al crear el usuario!';
            error(err, res, 400, message );
            return;
        }
        
        // si no hay error devuelvo un status 201
        res.status(201).json({
            ok: true,
            usuario: userSave,
        });
        
    });
});

/** Funcion para actualizar un usuario especifico */
app.put('/:id',middleware.verificarToken, ( req, res ) => {

    /** @constant id es el id del usuario el cual se actualizara */
    const id = req.params.id;
    /** @constant body son los datos que se actualizaran del usuario */
    const body = req.body;
    /** @var pass es la contraseña del usuario con el bcrypt */
    let pass;

    if( body.password ) {
        pass = bcrypt.hashSync(body.password, 10);
    }
    User.findById( id, (err, user) => { 
        if( err ) {
            
            /** @constant message es el mensaje de error */
            const message = 'Error al crear el usuario!';
            error(err, res, 500, message );
            return;
        }         
        if( !user ) {
            
            /** @constant message es el mensaje de error */
            const message = `Error al buscar usuario con el id: ${ id } no existe`;
            /** @constant error es el error que se va a enviar */
            const error = { message: 'No existe un usuario con ese ID ' };
            error(error, res, 400, message );
            return;
        }

        /** Actualizando el usaurio */
        
        if(body.nombre && user.first_name != body.nombre) {
            user.first_name = body.nombre;
        }
        if(body.apellido && user.last_name != body.apellido) {        
            user.last_name = body.apellido;
        }
        if(body.correo && user.email != body.correo) {
            user.email = body.correo;
        }
        if(body.telefono && user.phone != body.telefono) {
            user.phone = body.telefono;
        }
        if( pass ) {
            user.password = pass;
        }
        if(body.documento && user.document != body.documento) {
            user.document = body.documento;
        }
        if(body.celular && user.mphone != body.celular) {
            user.mphone = body.celular;
        }
        if(body.direccion && user.address != body.direccion) {
            user.address = body.direccion;
        }
        if(body.ciudad && user.city != body.ciudad) {
            user.city = body.ciudad;
        }
        if(body.cumpleano && user.birth_date != body.cumpleano) {
            user.birth_date = body.cumpleano;
        }
        if(body.termino && user.end_date != body.termino) {
            user.end_date = body.termino;
        }    
        
        user.save( (err, userSave) => {
            
            if( err ) {
                        
                /** @constant message es el mensaje de error */
                const message = 'Error al actualizar el usuario!';
                error(err, res, 400, message );
                return;
            }

            // enviamos una carita feliz para mostrar el password en el response
            userSave.password = ':D';

            // si no hay error devuelvo un status 201
            res.status(201).json({
                ok: true,
                usuario: userSave,
            });
        });
    });
});

/** Funcion de eliminar un usuario */
app.delete('/:id',middleware.verificarToken,(req, res) => {
    
    /** @constant id es el id del usuario el cual se actualizara */
    const id = req.params.id;

    User.findByIdAndRemove(id, ( err, userDelete) => {
         
        if( err ) {
                        
            /** @constant message es el mensaje de error */
            const message = 'Error al borrar el usuario!';
            error(err, res, 500, message );
            return;
        }
 
        if( !userDelete ) {
            
            /** @constant message es el mensaje de error */
            const message = `Error al buscar usuario con el id: ${ id } no existe`;
            /** @constant error es el error que se va a enviar */
            const error = { message: 'No existe un usuario con ese ID ' };
            error(error, res, 400, message );
            return;
        }
        
        // si no hay error devuelvo un status 201
        res.status(201).json({
            ok: true,
            mensaje: 'Usuario Borrado',
            usuario: userDelete,
        });
    });
});

module.exports = app;