/**Importaciones */
const express = require('express');
/** @const team trae el modelo de equipos  */
const Team = require ('../models/team');
/** @const bcrypt es el modulo necesario para encriptar contraseñas por una sola via */
const { error } = require('../config/responses');
/** @const middleware es el modulo necesario para validar con un token */
const middleware = require ('../middlewares/middleware');
/** @const TeamUser trae el modelo de equipos usuarios  */
const TeamUser = require ('../models/team_user');
/** Declaraciones */
let app = express();
/**
 * Funcion para traer todas las personas
 */
app.get('/', middleware.verificarToken,(req, res, ) => { 
    Team.find({},       
            (err, team) => {
                if (err){
                    /** @constant message es el mensaje de error */
                    const message = 'Error cargando personas!';    
                    error(err, res, 500, message);
                }
            res.status(200).json({
                ok: true,
                team: team,
            });            
        });    
});

/**
 * Funcion para traer un Equipo dado un id
 * @param id es el id de un Equipo
 */

app.get('/:id',middleware.verificarToken, (req, res) => { 
    const id = req.params.id;
    Team.findById( id,
    (err, team) => {
        
                if (err){
                    /** @constant message es el mensaje de error */
                    const message = 'Error cargando un Equipo!';    
                    error(err, res, 500, message);
                }

                if( !team ) {
                    /** @constant message es el mensaje de error */
                    const message = `el equipo con el id: ${ id }, no existe`;
                    /** @constant err es el error que se genera */
                    const err = { message: 'No existe el equipo  con ese ID' };
                    error(err, res, 401, message);
                    return;
                 }
                 
                 /** Se hace consulta para traer todos los usuarios que pertenecen al grupo  */
                 TeamUser.find({teamId: team._id}, '_id userId leader')
                    .populate('userId', 'first_name last_name email')               
                    .exec((err, team_user)=>{

                        if (err){
                            /** @constant message es el mensaje de error */
                            const message = 'Error cargando un Equipo!';    
                            error(err, res, 500, message);
                        }

                        if( team_user == '' ) {
                            /** @constant message es el mensaje de error */
                            const message = `El ${team.name} no contiene ningun usuario asignado`;
                            
                            res.status(200).json({
                                ok: true,
                                team,
                                message
                            });
                            return;                                                        
                         }

                        res.status(200).json({
                            ok: true,
                            team,
                            users: team_user
                        });           
                });                    
        });    
});

/**
 * Funcion para guardar un grupo 
 */
app.post('/',middleware.verificarToken,(req,res)=>{
    //inicialisamos el parser body para obtener los dato s
    var body =req.body;
    //guarda todos  los body en  team
    var team = new Team({   
    name:body.nombre,
    description:body.descripcion,
    created_at:body.created_at,
    updated_at:body.updated_at,
    group_task_id:body.group_task_id,
    created_by:body.created_by,
    updated_by:body.updated_by,
    });
    //guardamos el grupo 
    team.save((err,teamSave)=>{

        if (err){
            /** @constant message es el mensaje de error */
            const message = 'Error al guardar equipo!';
            error(err, res, 500, message);
            return;
        }      

        res.status(201).json({
            ok: true,
            team: teamSave
            
        });
    });
});

/**
 * Actualiza una equipo 
 * @param id traen una equipo dado un id
 * @var team actualiza un equipo con el id expecificado eal modelo  team
 */
app.put('/:id',middleware.verificarToken,(req, res) => {
    
    var id = req.params.id;
    // inicializamos el body parser para obtener los datos
    var body = req.body;

    Team.findById( id, (err, team) => {
        if (err){

            /** @constant message es el mensaje de error */
            const message = 'Error al buscar un Equipo!';
            error(err, res, 500, message);
            return;
        }
        if( !team ) {
            /** @constant message es el mensaje de error */
            const message = `el equipo con el id: ${ id }, no existe`;
            /** @constant err es el error que se genera */
            const err = { message: 'No existe un equipo con ese ID' };

            error(err, res, 401, message);
            return;
        }        
        team.name = body.nombre; 
        team.description = body.descripcion; 
        team.save( (err, teamSave) => {
            if (err) {
                /** @constant message es el mensaje de error */
                const message = 'Error al actualizar un equipo!';
                error(err, res, 500, message);
                return;
            }

            res.status(200).json({
                ok: true,
                team: teamSave,
            });
        });
    });

});
/**
 * Funcion de  eliminar un equipo
 * @param id busca un equipo con el id * 
 */
app.delete('/:id',middleware.verificarToken,(req, res) => {
    
    var id = req.params.id;

    Team.findByIdAndRemove(id, ( err, teamDelete) => {
         if (err) {
            /** @constant message es el mensaje de error */
            const message = 'Error al eliminar un equipo!';
            error(err, res, 500, message);
            return;
        }

        if( !teamDelete ) {
           /** @constant message es el mensaje de error */
           const message = `el equipo con el id: ${ id }, no existe`;
           /** @constant err es el error que se genera */
           const err = { message: 'No existe el equipo  con ese ID' };
           error(err, res, 401, message);
           return;
        }    

        res.status(200).json({
            ok: true,
            mensaje: 'equipo Borrado',
            teamDelete: teamDelete,
        });
    });
});
/**
 * Funcion para traer un Equipo dado un id
 * @param id es el id de un Equipo
 */
app.get('/teamUser/:id',middleware.verificarToken, (req, res) => { 
    const id = req.params.id;
    TeamUser.findById( id )
            .populate('userId')
            .populate('teamId')
            .exec((err, team) => {            
                if (err){
                    /** @constant message es el mensaje de error */
                    const message = 'Error cargando un Equipo!';    
                    error(err, res, 500, message);
                    return;
                }

                if( !team ) {
                    /** @constant message es el mensaje de error */
                    const message = `el equipo con el id: ${ id }, no existe`;
                    /** @constant err es el error que se genera */
                    const err = { message: 'No existe el equipo  con ese ID' };
                    error(err, res, 401, message);
                    return;
                 }

            res.status(200).json({
                ok: true,
                team: team,
            });            
        });    
});


//Funcion para unir  usuario con team
app.post('/teamUser/',middleware.verificarToken,(req,res)=>{
    //inicialisamos el parser body para obtener los dato s
    var body =req.body;
    //guarda todos  los body en  team
    var teamuser = new TeamUser({   
    userId:body.userId,
    teamId:body.equipoId,
    leader:body.lider,
    });
    //guardamos el grupo 
    teamuser.save((err,teamuserSave)=>{
        if (err){
            /** @constant message es el mensaje de error */
            const message = 'Error al guardar la relacion con el equipo!';
            error(err, res, 500, message);
            return;
        }

        res.status(201).json({
            ok: true,
            teamuser: teamuserSave
            
        });
    });
});
/**
 * Actualiza una equipo 
 * @param id traen una  relacion de equipo dado un id
 * @var team actualiza la relacion del  equipo con el id expesificado eal modelo  teamUser
 */
app.put('/teamUser/:id',middleware.verificarToken,(req, res) => {
    
    var id = req.params.id;
    // inicializamos el body parser para obtener los datos
    var body = req.body;

    TeamUser.findById( id, (err, teamuser) => {
        if (err){

            /** @constant message es el mensaje de error */
            const message = 'Error al buscar la relacion del Equipo!';
            error(err, res, 500, message);
            return;
        }

        if( !teamuser ) {
            /** @constant message es el mensaje de error */
            const message = `el la relacion  con el id: ${ id }, no existe`;
            /** @constant err es el error que se genera */
            const err = { message: 'No existe la relacion  con ese ID' };
            error(err, res, 401, message);
            return;
        } 

        teamuser.userId = body.userId; 
        teamuser.teamId = body.equipoId; 
        teamuser.leader = body.lider; 
        teamuser.save( (err, teamuserSave) => {
            if (err) {
                /** @constant message es el mensaje de error */
                const message = 'Error al actualizar la relacion !';
                error(err, res, 500, message);
                return;
            }

            res.status(200).json({
                ok: true,
                teamuser: teamuserSave,
            });
        });
    });

});
/**
 * Funcion de  eliminar un la relacion de un equipo
 * @param id busca un equipo con el id
 * 
 */
app.delete('/teamUser/:id',middleware.verificarToken,(req, res) => {
    
    var id = req.params.id;

    TeamUser.findByIdAndRemove(id, ( err, teamUserDelete) => {

         if (err) {           
            /** @constant message es el mensaje de error */
            const message = 'Error al eliminar un una relacion entre usuario y equipo!';
            error(err, res, 500, message);
            return;           
        }

        if( !teamUserDelete ) {
           /** @constant message es el mensaje de error */
           const message = `la relacion con el id: ${ id }, no existe`;
           /** @constant err es el error que se genera */
           const err = { message: 'No existe la relacion con ese ID' };
           error(err, res, 401, message);
           return;
        }   

        res.status(200).json({
            ok: true,
            mensaje: 'relacion  Borrada',
            teamUserDelete: teamUserDelete,
        });
    });
});
module.exports = app;