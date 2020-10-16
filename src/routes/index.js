const express = require('express')
const router = express.Router()
const Producto = require('../models/Producto')
const Categoria = require('../models/Categoria')
const mercadopago = require ('mercadopago');
const Usuarioventa = require('../models/Usuarioventa');
const Itemventa = require('../models/Itemventa');

router.get('/', async (req, res) => {
    const productos = await Producto.findAll({include: { model: Categoria }})
    const categorias = await Categoria.findAll()
    res.render('index', {
        productos: productos.map(producto => producto.toJSON()),
        categorias: categorias.map(categoria => categoria.toJSON())
    })
})

router.get('/:id', async (req, res) => {
    const productos = await Producto.findAll({include: [{ model: Categoria, where: {id: req.params.id}}]})
    const categorias = await Categoria.findAll()
    res.render('index',{
        productos: productos.map(producto => producto.toJSON()),
        categorias: categorias.map(categoria => categoria.toJSON())
    })
})

router.get('/ver/:id', async (req, res) => {
    const producto = await Producto.findByPk(req.params.id)
    const categorias = await Categoria.findAll()
    res.render('vistaprod',{
        producto: producto.toJSON(),
        categorias: categorias.map(categoria => categoria.toJSON())
    })
})

router.post('/carrito', async (req, res) => {
    const prod = req.body
    const listId = prod.map(producto => producto.id)
    const items = await Producto.findAll({where: {id: listId}})
    const final = []
    let precio = 0
    items.forEach(item => {
        prod.forEach(pr => {
            if(pr.id.includes(item.id)) {
                final.push({item, cantidad: pr.cantidad, valor: item.precio * pr.cantidad})
            }            
        });
    })
    const precios = final.map(fin => fin.valor)
    if(final.length <= 1) {
        precio = precios
    } else {
        precio = precios.reduce((a, b) => a + b)
    }
    res.json({final, precio})
})

router.post('/confirmpago', async (req, res) => {
//     const prod = req.body.items
//     const {nombre, apellido, dni, email, telefono} = req.body.user
//     const listId = prod.map(producto => producto.id)
//     const items = await Producto.findAll({where: {id: listId}})
//     const itemsMP = []
//     let initPoint = null
//     items.forEach(item => {
//         prod.forEach(pr => {
//             if(pr.id.includes(item.id)) {
//                 itemsMP.push({
//                     id: item.id,
//                     title: item.nombre,
//                     category_id: `${item.id_categoria}`,
//                     quantity: parseInt(pr.cantidad), 
//                     currency_id: 'ARS',
//                     unit_price: item.precio
//                 })
//             }            
//         });
//     })
//     mercadopago.configure({
//         access_token: 'TEST-440134140448878-071921-444272ac11d039247b5e747c1e3f713e-611758351'
//     });
//     let preference = {
//         items: itemsMP,
//         payer: {
//             name: nombre,
//             surname: apellido,
//             email: email,
//             phone: {
//                 area_code: "",
//                 number: telefono
//             },
//             identification: {
//                 type: "DNI",
//                 number: dni
//             }
//         },
//         "back_urls": {
//             "success": "http://localhost:3000/pago/success",
//             "failure": "http://localhost:3000/pago/failure",
//             "pending": "http://localhost:3000/pago/pending"
//         },
//         "auto_return": "approved"
//     };
//     try {
//         const response = await mercadopago.preferences.create(preference)
//         initPoint = response.body.init_point;
//         const user = await Usuarioventa.create({nombre, apellido, dni, email, telefono})
//         await Itemventa.bulkCreate({
//             id_venta: user.id,
//             id_producto: prod.id,
//             cantidad: prod.cantidad
//         })
//         console.log(initPoint)
//     } catch (error) {
//         console.log(error)
//     }
//     res.json(initPoint)
})

module.exports = router