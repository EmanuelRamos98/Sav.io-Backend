import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ApiResponse from "../helpers/api.response.helper.js"
import AppError from "../helpers/error.helpers.js"
import Validations from "../helpers/validation.helpers.js"
import UserRepository from '../repositories/user.repository.js'
import User from '../models/users.model.js'
import ENVIRONMENT from '../config/environment.config.js'

export const registerController = async (req, res, next) => {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return next(new AppError('Todos los campos deben estar completos', 400))
        }

        const validador = new Validations({ name, email, password })

        validador
            .isString('name').min_max_length('name', 4, 20)
            .isEmail('email')
            .isString('password').min_max_length('password', 8, 30)

        const errores = validador.obtenerErrores()
        if (errores.length > 0) {
            return next(new AppError('Errores de validacion', 400, errores))
        }

        const passwordHased = await bcrypt.hash(password, 10)

        const newUser = {
            name: name,
            password: passwordHased,
            email: email
        }
        await UserRepository.createUser(newUser)
        return res.status(201).json(new ApiResponse(201, 'Registro exitoso'))

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0]
            return next(new AppError(`El ${field} ya esta en uso`))
        }
        return next(error)
    }
}

export const loginController = async (req, res, next) => {
    try {
        const { identifier, password } = req.body

        if (!identifier || !password) {
            return next(new AppError('Todos los campos deben estar completos', 400))
        }

        const user = await UserRepository.findByIdentifier(identifier)

        if (!user) {
            return next(new AppError('Usuario o contraseña incorrectos', 401))
        }

        const passwordMach = await bcrypt.compare(password, user.password)

        if (!passwordMach) {
            return next(new AppError('Usuario o contraseña incorrectos', 401))
        }

        const TOKEN = jwt.sign(
            {id: user._id, name: user.name, email: user.email},
            ENVIRONMENT.SECRET_KEY,
            {expiresIn: '1d'}
        )

        return res.status(200).json(new ApiResponse(200, 'Login exitoso', TOKEN))

    } catch (error) {
        return next(error)
    }
}