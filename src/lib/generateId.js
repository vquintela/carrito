const generate = require('generate-password');

const generateId = {}

generateId.name = () => {
    return generate.generate({
        length: 15,
        numbers: true
    })
}

module.exports = generateId
