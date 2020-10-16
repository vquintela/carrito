const Sequelize = require('sequelize');
const sequelize = require('../lib/sequelize');

const Itemventa = sequelize.define('itemventa', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true 
    },
    id_venta: {
        type: Sequelize.INTEGER
    },
    id_producto: {
        type: Sequelize.INTEGER
    },
    cantidad: {
        type: Sequelize.INTEGER
    }
}, {
    timestamps: false
})

// Itemventa.sync({
//     force: true
// })
// .then(() => {
//     console.log('tabla creada')
// });

module.exports = Itemventa;