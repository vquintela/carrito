const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const helperPws = require('../lib/password');
const errorMessage = require('../lib/errorMessageValidation');

router.get('/', async (req, res) => {
    const usuarios = await Usuario.findAll();
    res.render('usuarios/', {usuarios: usuarios.map(usuario => usuario.toJSON())})
})

router.get('/crear', async (req, res) => {
    res.render('usuarios/crear')
})

router.post('/crear', async (req, res) => {
    try {
        const values = req.body;
        await Usuario.create({...values});
        req.flash('success', 'Usuario creado de forma correcta');
        res.redirect('/usuarios');    
    } catch (error) {
        const e = errorMessage.crearMensaje(error)
        res.render('usuarios/crear', {e})
    }
})

router.get('/editar/:id', async (req, res) => {
    try {
        const user = await Usuario.findByPk(req.params.id);
        res.render('usuarios/editar', {user: user.toJSON()})
    } catch (error) {
        console.log(error)
    }
})

router.post('/editar/:id', async (req, res) => {
    try {
        const { nombre, apellido, email } = req.body;
        await Usuario.update({ nombre, apellido, email }, {where: {id: req.params.id}});
        req.flash('success', 'Usuario actualizado correctamente')
        res.redirect('/usuarios');
    } catch (error) {
        const user = await Usuario.findByPk(req.params.id);
        const e = errorMessage.crearMensaje(error)
        res.render('usuarios/editar', {user: user.toJSON(), e})
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        await Usuario.destroy({where: {id: req.params.id}})
        res.json({message: 'Usuario eliminado', css: 'success'})
    } catch (error) {
        console.log(error)
    }
})

router.get('/newpws', (req, res) => {
    res.render('usuarios/newpws')
})

router.post('/newpws', async (req, res) => {
    const { id, passwordActual, nuevaPass, repNuevaPass } = req.body
    if(!passwordActual.trim() || !nuevaPass.trim() || !repNuevaPass.trim()) {
        req.flash('message', 'Debe ingresar todos los campos')
        res.redirect('/usuarios/newpws')
        return
    }
    if(nuevaPass !== repNuevaPass) { 
        req.flash('message', 'Las contraseñas no coinciden')
        res.redirect('/usuarios/newpws')
        return
    }
    const user = await Usuario.findByPk(id)
    const value = await helperPws.matchPassword(passwordActual, user.password)
    if(value) {
        try {
            const newPass = await helperPws.encryptPassword(nuevaPass)
            await Usuario.update({ password: newPass }, {where: {id: id}});
            res.redirect('/logout')
            return
        } catch (error) {
            console.log(error)
        }
    } else {
        req.flash('message', 'Password incorrecta')
        res.redirect('/usuarios/newpws')
        return
    }
})

module.exports = router;