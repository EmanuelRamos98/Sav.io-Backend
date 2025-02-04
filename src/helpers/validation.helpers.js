class Validations {

    constructor(valor) {
        this.valor = valor
        this.error = []
    }

    isString(field_name) {
        const valor = this.valor[field_name]
        if (typeof valor !== 'string') {
            this.error.push({
                field: field_name,
                message: `El valor de ${field_name} debe ser un string`
            })
        }
        return this
    }

    isNumber(field_name) {
        const valor = this.valor[field_name]
        if (typeof valor !== 'number') {
            this.error.push({
                field: field_name,
                message: `El valor de ${field_name} debe ser un number`
            })
        }
        return this
    }

    min_max_length(field_name, min_lenght, max_length) {
        const valor = this.valor[field_name]
        if (valor.length < min_lenght) {
            this.error.push({
                field: field_name,
                message: `El valor de ${field_name} es demasiado corto. Minimo permitido: ${min_lenght}`
            })
        }
        if (valor.length > max_length) {
            this.error.push({
                field: field_name,
                message: `El valor de ${field_name} es demasiado largo. Maximo permitido: ${max_length}`
            })
        }
        return this
    }

    isEmail(field_name) {
        const valor = this.valor[field_name]
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!regex.test(valor)) {
            this.error.push({
                field: field_name,
                message: `El formato del correo eletronico no es valido`
            })
        }
        return this
    }

    isBase64(field_name) {
        const valor = this.valor[field_name]
        const regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/
        if (!regex.test(valor)) {
            this.error.push({
                field: field_name,
                message: `El formato base 64 no es valido`
            })
        }
        return this
    }

    obtenerErrores() {
        return this.error
    }
}

export default Validations