const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const { isLoggedIn } = require('../lib/auth');
const errorMessage = require('../lib/errorMessageValidation');

router.get('/', async (req, res) => {
    const categorias = await Categoria.findAll()
    res.render('categorias/', { categorias: categorias.map(categoria => categoria.toJSON()) })
})

router.post('/', async (req, res) => {
    try {
        const data = req.body;
        await Categoria.create({...data});
        req.flash('success', 'Categoria agregada de forma correcta');
        res.redirect('/categorias');
    } catch (error) {
        const e = errorMessage.crearMensaje(error)
        const categorias = await Categoria.findAll()
        res.render('categorias/', { categorias: categorias.map(categoria => categoria.toJSON()), e })
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        await Categoria.destroy({where: {id: req.params.id}})
        res.json({message: 'Categoria eliminada', css: 'success'})
    } catch (error) {
        console.log(error)
    }
})

router.get('/editar/:id', async (req, res) => {
    try {
        const categoria = await Categoria.findByPk(req.params.id)
        res.json(categoria)
    } catch (error) {
        console.log(error)
    }
})

router.post('/editar/:id', async (req, res) => {
    try {
        const { nombre } = req.body;
        await Categoria.update({ nombre }, {where: {id: req.params.id}});
        req.flash('success', 'Categoria actualizada correctamente')
        res.redirect('/categorias');
    } catch (error) {
        const e = errorMessage.crearMensaje(error)
        req.flash('message', e.nombre);
        res.redirect('/categorias');
    }
})

module.exports = router;