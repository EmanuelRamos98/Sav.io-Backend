import ApiResponse from "../helpers/api.response.helper.js";
import AppError from "../helpers/error.helpers.js";

const errorHandleMiddleware = (err, req, res, next) => {
    err.status_code = err.status_code || 500
    err.status = err.status || 'error'

    if (err.validationErrors && err.validationErrors.length > 0) {
        return res.status(err.status_code).json(new ApiResponse(err.status_code, 'Errores de validacion', err.validationErrors))
    }

    if (err.is_operational) {
        return res.status(err.status_code).json(new ApiResponse(err.status_code, err.message))
    }

    console.error('ERROR: 😢 😖 ', err)
    return res.status(500).json(new ApiResponse(500, 'Algo salio mal'))
}

export default errorHandleMiddleware