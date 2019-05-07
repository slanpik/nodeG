/**Importaciones */
let express = require('express');
let bodyParser = require('body-parser');
let mongoose = require('mongoose');


// Conexion a la base de datos
mongoose.connection.openUri('mongodb://localhost:27017/gesthorDB', (err, res) => {
    
    if( err ) throw err;

    console.log('base de datos 27017: \x1b[32m%s\x1b[0m', 'online');
});

/** Inicializamos varibles */

/** @var app es la varible con la que vamos a usar el express */
let app = express();

/** Body Parser */ 
app.use(bodyParser.urlencoded({ extended: false })); 
app.use(bodyParser.json())

/** Importaciones de las rutas */
let loginRoutes = require('./routes/login');
let negotationRoutes = require('./routes/negotation');
let personRoutes = require('./routes/persons');
let productRoutes = require('./routes/products');
let teamRoutes = require('./routes/team');
let userRoutes = require('./routes/user');

/** Rutas */
app.use('/login',loginRoutes);
app.use('/negotations', negotationRoutes);
app.use('/persons', personRoutes);
app.use('/products', productRoutes);
app.use('/teams',teamRoutes);
app.use('/users', userRoutes);


/** Escuchar peticiones */
app.listen(3000, () => {
    console.log('express server corriendo en el puerto 3000: \x1b[32m%s\x1b[0m', 'online');
    
    
});