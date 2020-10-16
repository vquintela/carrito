const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize');
const Itemventa = require('./Itemventa');

const Producto = sequelize.define('producto', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            min: {
                args: 3,
                msg: 'Nombre demasiado corto'
            },
            max: {
                args: 15,
                msg: 'Nombre demasiado largo'
            }
        }
    },
    precio: {
        type: Sequelize.DOUBLE,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            isNumeric: {
                msg: 'Precio solo en numeros'
            }
        }
    },
    descripcion: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            min: {
                args: 10,
                msg: 'Descripcion demasiado corto'
            },
            max: {
                args: 100,
                msg: 'Descripcion demasiado larga'
            }
        }
    },
    image: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            }
        }
    },
    stock: {
        type: Sequelize.INTEGER,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            isNumeric: {
                msg: 'Stock solo en numeros'
            }
        }
    }, 
    id_categoria: {
        type: Sequelize.INTEGER,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            }
        }
    }
}, {
    timestamps: false
});

Producto.hasMany(Itemventa, { foreignKey: 'id_producto', sourceKey: 'id' })
Itemventa.belongsTo(Producto, { foreignKey: 'id_producto', sourceKey: 'id' })

// Producto.sync({
//     force: true
// })
// .then(() => {
//     console.log('tabla creada')
// })

module.exports = Producto;