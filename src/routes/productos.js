const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Categoria = require('../models/Categoria');
const path = require('path');
const fs = require('fs-extra');
const generateId = require('../lib/generateId');
const { isLoggedIn } = require('../lib/auth');
const errorMessage = require('../lib/errorMessageValidation');

router.get('/', async (req, res) => {
    const productos = await Producto.findAll({ include: { model: Categoria } })
    const categorias = await Categoria.findAll();
    res.render('productos/', { 
        productos: productos.map(producto => producto.toJSON()),
        categorias: categorias.map(categoria => categoria.toJSON())
    })
})

router.get('/crear', async (req, res) => {
    const categorias = await Categoria.findAll();
    res.render('productos/crear', { categorias: categorias.map(categoria => categoria.toJSON()) })
})

router.post('/crear', async (req, res) => {
    const values = req.body;
    const producto = await Producto.build({ ...values });
    let imagePath
    if(req.file) {
        const name = await generateId.name();
        imagePath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.resolve(`src/public/img/${name}${ext}`);
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.webp') {
            await fs.rename(imagePath, targetPath);
            const nombArch = name + ext;
            producto.image = nombArch
            try {
                await producto.save();
                req.flash('success', 'Producto creado')
                res.redirect('/productos');
            } catch (error) {
                await fs.unlink(path.resolve('./src/public/img/' + nombArch))
                const e = errorMessage.crearMensaje(error)
                const categorias = await Categoria.findAll();
                res.render('productos/crear', {
                    e,
                    categorias: categorias.map(categoria => categoria.toJSON())
                })     
            }
        } else {
            await fs.unlink(imagePath);
            req.flash('message', 'Imagen no soportada')
            res.redirect('/productos/crear');
        }
    } else {
        req.flash('message', 'Ingrese una imagen al producto')
        res.redirect('/productos/crear');
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const prod = await Producto.findByPk(req.params.id)
        const del = await Producto.destroy({where: {id: req.params.id}})
        if(del > 0) await fs.unlink(path.resolve('./src/public/img/' + prod.image));
        res.json({message: 'Producto eliminado', css: 'success'})
    } catch (error) {
        console.log(error)
    }
})

router.get('/editar/:id', async (req, res) => {
    try {
        const prod = await Producto.findByPk(req.params.id, { include: { model: Categoria } })
        const categorias = await Categoria.findAll();
        res.render('productos/editar', { 
            prod: prod.toJSON(), 
            categorias: categorias.map(categoria => categoria.toJSON()) 
        })
    } catch (error) {
        console.log(error)
    }
})

router.post('/editar/:id', async (req, res) => {
    let { precio, nombre, descripcion, stock, id_categoria, oldimg } = req.body;
    let image
    if(req.file){
        const name = await generateId.name();
        const imagePath = req.file.path;
        const ext = path.extname(req.file.originalname).toLowerCase();
        const targetPath = path.resolve(`src/public/img/${name}${ext}`);
        if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
            await fs.unlink(path.resolve('./src/public/img/' + oldimg));
            await fs.rename(imagePath, targetPath);
            image = name + ext;
        } else {
            await fs.unlink(imagePath);
            image = oldimg
            req.flash('message', 'Imagen no soportada')
            res.redirect('/productos');
        }
    } else {
        image = oldimg
    }
    try {
        await Producto.update({ precio, nombre, descripcion, stock, id_categoria, image }, {where: {id: req.params.id}});
        req.flash('success', 'Producto actualizado correctamente')
        res.redirect('/productos');
    } catch (error) {
        const e = errorMessage.crearMensaje(error)
        const categorias = await Categoria.findAll();
        const prod = await Producto.findByPk(req.params.id, { include: { model: Categoria } })
        res.render('productos/editar', {
            prod: prod.toJSON(), 
            e,
            categorias: categorias.map(categoria => categoria.toJSON())
        })     
    }
})

router.get('/filtro/:filtro', async (req, res) => {
    const productos = await Producto.findAll({include: [{ model: Categoria, where: {id: req.params.filtro}}]})
    res.json(productos)
});

module.exports = router