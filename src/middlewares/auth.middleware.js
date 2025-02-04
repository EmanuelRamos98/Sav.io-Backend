import jwt from 'jsonwebtoken';
import AppError from '../helpers/error.helpers.js';
import ENVIRONMENT from '../config/environment.config.js';

const authMiddleware = (req, res, next) => {
    try {
        const auth_header = req.headers['authorization']
        if (!auth_header) {
            return next(new AppError('Falta token de autorizacion', 401))
        }

        const token = auth_header.split(' ')[1]
        if (!token) {
            return next(new AppError('El token de autorizacion esta mal formado', 400))
        }

        const user_session_payload_decoded = jwt.verify(token, ENVIRONMENT.SECRET_KEY)
        req.user = user_session_payload_decoded
        next()

    } catch (error) {
        next(error)
    }
}

export default authMiddleware