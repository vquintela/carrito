const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize');
const Itemventa = require('./Itemventa');

const Usuarioventa = sequelize.define('usuarioventa', {
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
    apellido: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            min: {
                args: 3,
                msg: 'Apellido demasiado corto'
            },
            max: {
                args: 20,
                msg: 'Apellido demasiado largo'
            }
        }
    },
    email: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            isEmail: {
                msg: 'Formato no valido'
            }
        }
    },
    telefono: {
        type: Sequelize.INTEGER,
        isNumeric: {
            msg: 'El telefono debe ser numerico'
        },
        min: {
            args: 8,
            msg: 'Telefono demasiado corto'
        },
        max: {
            args: 15,
            msg: 'Telefono demasiado largo'
        }
    },
    dni: {
        type: Sequelize.TEXT,
        isNumeric: {
            msg: 'El DNI debe ser numerico'
        },
        min: {
            args: 7,
            msg: 'DNI demasiado corto'
        },
        max: {
            args: 10,
            msg: 'DNI demasiado largo'
        }
    },
    estado: {
        type: Sequelize.ENUM,
        values: ['success', 'failure', 'pending', 'sinestado'],
        default: 'sinestado'
    }
}, {
    timestamps: false
})

Usuarioventa.hasMany(Itemventa, { foreignKey: 'id_venta', sourceKey: 'id' })
Itemventa.belongsTo(Usuarioventa, { foreignKey: 'id_venta', sourceKey: 'id' })

// Usuarioventa.sync({
//     force: true
// })
// .then(() => {
//     console.log('Tabla creada')
// })

module.exports = Usuarioventa;