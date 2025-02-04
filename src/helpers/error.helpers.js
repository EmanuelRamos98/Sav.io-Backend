class AppError extends Error {
    constructor(message, status_code, validationErrors){
        super(message)
        this.status_code = status_code
        this.status = String(status_code).startsWith('4')?'fail':'error'
        this.is_operational = true
        this.validationErrors = validationErrors
        Error.captureStackTrace(this, this.constructor)
    }
}

export default AppError 