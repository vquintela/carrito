const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize');
const Producto = require('./Producto');

const Categoria = sequelize.define('categoria', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nombre: {
        type: Sequelize.TEXT,
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'No se permiten campos vacios'
            }
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
}, {
    timestamps: false
});

Categoria.hasMany(Producto, { foreignKey: 'id_categoria', sourceKey: 'id' })
Producto.belongsTo(Categoria, { foreignKey: 'id_categoria', sourceKey: 'id' })

// Categoria.sync({
//     force: true
// })
// .then(() => {
//     console.log('tabla creada')
// })

module.exports = Categoria;