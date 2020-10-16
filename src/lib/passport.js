const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Usuario = require('../models/Usuario')
const helpers = require('../lib/password')

passport.use('local.signin', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, email, password, done) => {
    const user = await Usuario.findOne({where: {email: email}});
    if(user){
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword) {
            done(null, user, req.flash('success', 'Bienvenido ' + user.nombre));
        } else {
            done(null, false, req.flash('message', 'Usuario o Password Incorrecta'));
        }
    } else {
        done(null, false, req.flash('message', 'Usuario o Password Incorrecta'));
    }
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const user = await (await Usuario.findByPk(id)).toJSON()
    done(null, user);
});