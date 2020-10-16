const express = require('express');
const morgan = require('morgan');
const path = require('path');
const exphbs = require('express-handlebars');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const multer = require('multer');

//Iniciar Servidor
const app = express();
require('./lib/passport')

//Settings
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');
app.use(multer({dest: path.join(__dirname, 'public/img')}).single('image'));

//Middlewares
app.use(session({
    secret: 'Logueo-Node',
    resave: true,
    saveUninitialized: true,
}))
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//Variables globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Routes
app.use('/productos', require('./routes/productos'));
app.use('/categorias', require('./routes/categorias'));
app.use('/usuarios', require('./routes/usuarios'));
app.use(require('./routes/auth'));
app.use(require('./routes/index'));

//archivos publicos
app.use(express.static(path.join(__dirname, 'public')));

//Iniciar Servidor
app.listen(app.get('port'), () => {
    console.log('Servidor en puerto', app.get('port'))
});