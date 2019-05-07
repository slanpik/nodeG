
/** @var error es la variable que controlara todos los errores */
let error = (err, res, code, message) => {
    
    return res.status(code).json({
                ok: false,
                message,
                error: err
            });
}



/** @var success es la variable que controlara las respuestas que tengan exito */
let success = (res, code, message) => {
    
    return res.status(code).json({
                ok: true,
                message
            });

}




module.exports = {
    error,
    success
}