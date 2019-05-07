/**Importaciones */
const express = require('express');
// /** @constant error es la funcion para mostrar la respuesta de error */
const { error } = require('../config/responses');
// /** @constant se importa la base de datos  mongoose */
let mongoose = require('mongoose');
/** @const Person trae el modelo de  personas  */
const Person = require ('../models/person');

const middleware = require('../middlewares/middleware');
/** Declaraciones */
let app = express();

/**
 * Funcion para traer todas las personas
 */
app.get('/',middleware.verificarToken, (req, res) => { 
    Person.find({},       
            (err, person) => {

                if (err){
                    /** @constant message es el mensaje de error */
                    const message = 'Error cargando personas!';    
                    error(err, res, 500, message);
                    return;
                }

            res.status(200).json({
                ok: true,
                person: person,
            });            
        });    
});
/**
 * Funcion para traer una persona dado un id
 * @param id es el id de una persona
 */
app.get('/:id',middleware.verificarToken, (req, res) => { 
    const id = req.params.id;
    Person.findById( id, 
            (err, person) => {
                if (err){
                    /** @constant message es el mensaje de error */
                    const message = 'Error cargando una persona!';    
                    error(err, res, 500, message);
                    return;
                }

                res.status(200).json({
                    ok: true,
                    person: person,
                });            
        });    
});
/**
 * Funcion para crear una persona 
 * @var pesona sirve para guardar los datos en  el modelo Person
 */
app.post('/', (req, res) => {
    // inicializamos el body parser para obtener los datos
    var body = req.body;

    // guardo los datos de un usuario
    var person = new Person({
        first_name: body.nombre,
        last_name: body.apellido,
        email: body.email,        
        document: body.documento,
        type: body.tipo,
        img_path: body.img,
        birth_date: body.birth_date,
        facebook: body.facebook,
        twitter: body.twitter,
        skype: body.skype,
        linkedin: body.linkedin,
        web_page: body.pagina_web,
        secondary_email: body.secondary_email,
        appointment: body.appointment,
        create_by: body.create_by,
        converted: body.converted,
        reason: body.reason,
        commet: body.commet,
        mark: body.mark,
        numbers_phone: body.nemerotele,
        address: body.direccion,
        role: body.role
    });

    // guardamos  la persona
    person.save( ( err, personSave) => {
        if (err){
            /** @constant message es el mensaje de error */
            const message = 'Error al guardar persona!';
            error(err, res, 500, message);
            return;
        }

        res.status(201).json({
            ok: true,
            person: personSave
            
        });
        
    });
});

/**
 * Actualizar una persona 
 * @param id traen una persona dado un id
 * @var person actualiza la persona con el id expesificado eal modelo  Person
 */
app.put('/:id',middleware.verificarToken,(req, res) => {
    
    var id = req.params.id;
    // inicializamos el body parser para obtener los datos
    var body = req.body;

    Person.findById( id, (err, person) => {
        if (err){

            /** @constant message es el mensaje de error */
            const message = 'Error al buscar persona!';
            error(err, res, 500, message);
            return;
        }

        if( !person ) {
            /** @constant message es el mensaje de error */
            const message = `La persona con el id: ${ id }, no existe`;
            /** @constant err es el error que se genera */
            const err = { message: 'No existe una persona con ese ID' };
            error(err, res, 401, message);
            return;
        }

        person.first_name = body.nombre;
        person.last_name = body.apellido;
        person.document = body.documento;     

        person.save( (err, personSave) => {

            if (err) {
                /** @constant message es el mensaje de error */
                const message = 'Error al actualizar persona!';
                error(err, res, 500, message);
                return;
            }

            res.status(200).json({
                ok: true,
                person: personSave,
                persona: person
            });

        });
    });

});
/**
 * Funcion de  eliminar persona
 * @param id busca la persona con el id
 * 
 */
app.delete('/:id',middleware.verificarToken,(req, res) => {
    
    var id = req.params.id;

    Person.findByIdAndRemove(id, ( err, PersonDelete) => {
         if (err) {            
            /** @constant message es el mensaje de error */
            const message = 'Error al eliminar persona!';
            error(err, res, 500, message);
            return;
        }

        if( !PersonDelete ) {
           /** @constant message es el mensaje de error */
           const message = `la persona con el id: ${ id }, no existe`;
           /** @constant err es el error que se genera */
           const err = { message: 'No existe un la persona  con ese ID' };
           error(err, res, 401, message);
           return;
        }
        
        res.status(200).json({
            ok: true,
            mensaje: 'Persona Borrada',
            PersonDelete: PersonDelete,
        });
    });

});
module.exports = app;

