const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize');
const bcrypt = require('bcryptjs');

const hashPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

const Usuario = sequelize.define('usuario', {
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
    password: {
        type: Sequelize.TEXT,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            },
            is: {
                args: /^(?=\w*\d)(?=\w*[A-Z])(?=\w*[a-z])\S{8,16}$/g,
                msg: 'La password no cumple los requisitos de seguridad'
            }
        }
    }
}, {
    timestamps: false
})

Usuario.beforeCreate(async (usuario, options) => {
    const hashedPassword = await hashPassword(usuario.password);
    usuario.password = hashedPassword;
})

// Usuario.sync({
//     force: true
// })
// .then(() => {
//     console.log('tabla creada')
// })

module.exports = Usuario;