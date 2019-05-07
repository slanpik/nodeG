/**Importaciones */
var express = require('express');
/** @var app es el modulo de express */
var app = express();
/** @var Negotation es el modelo de ventas */
var Negotation = require('../models/negotation');
/** @constant middleware es la funcion para verificar el token */
const middleware = require ('../middlewares/middleware');

/** Funcion para obtener todas las ventas */
app.get('/', middleware.verificarToken, (req, res) => {
    
    // Busco todos las ventas
    Negotation.find({})
        .populate('user', 'first_name last_name')
        .populate('person')
        .exec((err, negotations) => {
        
            if( err ) {
                return res.status(500).json({
                    ok: false,
                    mensajes: 'Error cargando las Ventas!!',
                    error: err
                });
            }

            // retorno la petición con un estado 200
            res.status(200).json({
                ok: true,
                negotations
            });

        });

});

/** Funcion para obtener una venta */
app.get('/:id', middleware.verificarToken, (req, res) => {
    
    /** @var id es el id de la venta para actualizar */
    var id = req.params.id;

    Negotation.findById(id)
            .populate('user', 'first_name last_name')
            .populate('person')
            .exec((err, negotation) => {

                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error al buscar la venta!',
                        errors: err
                    });
                }

                if ( !negotation ) {
                    return res.status(400).json({
                        ok: false,
                        mensaje: 'Error al encontrar la venta con la id ' + id ,
                        errors: { message: 'No existe una venta con ese ID ' }
                    });
                }

                 // retorno la petición con un estado 200
                res.status(200).json({
                    ok:true,
                    negotation
                });
            });
});

/** Funcion para crear una venta */
app.post('/', middleware.verificarToken, (req, res) => {

    // obtengo los datos con el body parser
    var body = req.body;

    /** @var venta Seteo los datos para guardarlo */ 
    var venta = new Negotation({
        currency: body.currency,
        status: body.status,
        product: body.product,
        type: body.type,
        user: req.user.user._id,
        person: body.person
    });

    // guardo la venta
    venta.save( (err, negotationSave ) => {

        if( err ) {
            return res.status(400).json({
                ok: false,
                mensajes: 'Error al guardar la venta!!',
                error: err
            });
        }

        // retorno la petición con un estado 200
        res.status(200).json({
            ok:true,
            negotation: negotationSave
        });
    });

});

/** Funcion para actualizar una venta */
app.put('/:id', middleware.verificarToken, (req, res) => {

    /** @var id es el id de la venta para actualizar */
    var id = req.params.id;

    /** @var body son los datos que se van a actualizar */
    var body = req.body;

    // conseguimos la venta
    Negotation.findById(id, (err, negotation) => {
        
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar la venta!',
                errors: err
            });
        }

        if ( !negotation ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error al encontrar la venta con la id ' + id ,
                errors: { message: 'No existe una venta con ese ID ' }
            });
        }

        /** Actualizamo los datos */
        if ( body.currency != null ) {

        negotation.currency = body.currency;
        }

        if ( body.product != null ) {
            
        negotation.product = body.product;
        }

        if ( body.status != null ) {

        negotation.status = body.status;
        }

        if ( body._idUser != null ) {
            
            negotation.user = body._idUser;            
        }         

        if ( body.person != null ) {
            
            negotation.person = body.person;            
        }         
        
        // salvo los cambios de la venta
        negotation.save( (err, negotationSave) => {

            if( err ) {
                return res.status(400).json({
                    ok: false,
                    mensajes: 'Error al cargar la Venta!!',
                    error: err
                });
            }

            // retorno la petición con un estado 200
            res.status(200).json({
                ok:true,
                negotation: negotationSave
            });
        });
    });
});

/** Funcion para borrar una venta */
app.delete('/:id', middleware.verificarToken, (req, res) => {
    
    /** @var id es el id de la venta para eliminar */
    var id = req.params.id;

    Negotation.findByIdAndRemove(id, (err, negotationDelete) => {
        
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar la venta!',
                errors: err
            });
        }

        if( !negotationDelete ) {
            return res.status(400).json({
                ok:false,
                mensaje: 'Error al encontrar la venta con la id ' + id ,
                errors: { message: 'No existe una venta con ese ID ' }
            })

        }
        // retorno la petición con un estado 200        
        res.status(200).json({
            ok: true,
            mensaje: 'Venta Borrada',
            negotation: negotationDelete
        });
    });
});

module.exports = app;