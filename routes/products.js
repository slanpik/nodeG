/**Importaciones */
const express = require('express');
// /** @constant error es la funcion para mostrar la respuesta de error */
const { error } = require('../config/responses');
// /** @constant se importa la base de datos  mongoose */
let mongoose = require('mongoose');
/** @const Product trae el modelo de productos  */
const Product = require ('../models/product');
/** @constant middleware es la funcion para verificar el token */
const middleware = require('../middlewares/middleware');

/** Declaraciones */
let app = express();

/**
 * Funcion para traer todos los productos
 */
app.get('/', middleware.verificarToken, (req, res, ) => { 
    Product.find({},       
            (err, product) => {
                if (err){
                    /** @constant message es el mensaje de error */
                    const message = 'Error cargando productos!';    
                    error(err, res, 500, message);
                    return;
                }
            res.status(200).json({
                ok: true,
                product: product,
            });            
        });    
});
/**
 * Funcion para traer un producto dado un id
 * @param id es el id de un producto
 */
app.get('/:id', middleware.verificarToken, (req, res) => { 
    const id = req.params.id;
    Product.findById( id, 
            (err, product) => {
                if (err){
                    /** @constant message es el mensaje de error */
                    const message = 'Error cargando un producto!';    
                    error(err, res, 500, message);
                    return;
                }
            res.status(200).json({
                ok: true,
                product: product,
            });            
        });    
});
/**
 * Funcion para crear un producto
 * @var product sirve para guardar los datos en  el modelo Product
 */
app.post('/', middleware.verificarToken, (req, res) => {
    // inicializamos el body parser para obtener los datos
    var body = req.body;

    // guardo los datos de un producto
    var product = new Product({
        name: body.name,
        description: body.description,
        status: body.status,
        price: body.price,

    });

    // guardamos el producto
    product.save( ( err, productSave) => {
        if (err){
            /** @constant message es el mensaje de error */
            const message = 'Error al guardar producto!';
            error(err, res, 500, message);
            return;
        }
        
        res.status(201).json({
            ok: true,
            product: productSave
            
        });
        
    });
});

/**
 * Actualizar un producto
 * @param id traen un producto dado un id
 * @var product actualiza el producto con el id especificado en el modelo Product
 */
app.put('/:id', middleware.verificarToken,(req, res) => {
    
    var id = req.params.id;
    // inicializamos el body parser para obtener los datos
    var body = req.body;

    Product.findById( id, (err, product) => {
        if (err){

            /** @constant message es el mensaje de error */
            const message = 'Error al buscar producto!';
            error(err, res, 500, message);
            return;
        }

        if( !product ) {
            /** @constant message es el mensaje de error */
            const message = `El producto con el id: ${ id }, no existe`;
            /** @constant err es el error que se genera */
            const err = { message: 'No existe un producto con ese ID' };
            error(err, res, 401, message);
            return;
        }

        product.name = body.name;
        product.description= body.description;
        product.status= body.status;
        product.price= body.price;
       

        product.save( (err, productSave) => {

            if (err) {
                /** @constant message es el mensaje de error */
                const message = 'Error al actualizar producto!';
                error(err, res, 500, message);
                return;
            }

            res.status(200).json({
                ok: true,
                product: productSave,
                product: product
            });

        });
    });

});
/**
 * Funcion de  eliminar producto
 * @param id busca el producto con el id
 * 
 */
app.delete('/:id', middleware.verificarToken, (req, res) => {
    
    var id = req.params.id;

    Product.findByIdAndRemove(id, ( err, ProductDelete) => {

        if (err) {
            /** @constant message es el mensaje de error */
            const message = 'Error al eliminar producto!';
            error(err, res, 500, message);
            return;
        }

        if( !ProductDelete ) {
           /** @constant message es el mensaje de error */
           const message = `el producto con el id: ${ id }, no existe`;
           /** @constant err es el error que se genera */
           const err = { message: 'No existe un producto con ese ID' };
           error(err, res, 401, message);
           return;
        }
        
        res.status(200).json({
            ok: true,
            mensaje: 'Producto Borrado',
            ProductDelete: ProductDelete,
        });
    });

});



module.exports = app;

