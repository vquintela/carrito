const errorMessageValidation = {}

errorMessageValidation.crearMensaje = (error) => {
    let errors = {}
    const errores = error.errors
    errores.map(error => {
        const [key, value] = [error.path, error.message]
        errors[key] = value
    })
    return errors
}

module.exports = errorMessageValidation;