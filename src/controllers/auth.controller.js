import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import ApiResponse from "../helpers/api.response.helper.js"
import AppError from "../helpers/error.helpers.js"
import Validations from "../helpers/validation.helpers.js"
import UserRepository from '../repositories/user.repository.js'
import ENVIRONMENT from '../config/environment.config.js'
import recuperationEmail from '../helpers/email/recuperation.email.helpers.js'

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

export const verifyEmailController = async (req, res, next) => {
    try {
        const { token_validation } = req.params
        if (!token_validation) {
            return next(new AppError('No se encontro el "token_validation"', 404))
        }

        const data = jwt.verify(token_validation, ENVIRONMENT.SECRET_KEY)
        if (!data) {
            return next(new AppError('Error Token', 400))
        }

        await UserRepository.userVarificated(data.email)
        return res.status(200).json(new ApiResponse(200, 'Se verifico el usuario con exito'))

    } catch (error) {
        next(error)
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
            { id: user._id, name: user.name, email: user.email },
            ENVIRONMENT.SECRET_KEY,
            { expiresIn: '1d' }
        )

        return res.status(200).json(new ApiResponse(200, 'Login exitoso', TOKEN))

    } catch (error) {
        return next(error)
    }
}


export const forgotPasswordController = async (req, res, next) => {
    try {
        const { email } = req.body
        if (!email) {
            return next(new AppError('Falta el email', 400))
        }

        const validador = new Validations({ email })
        validador
            .isEmail('email')
        const errores = validador.obtenerErrores()
        if (errores.length > 0) {
            return next(new AppError('Error de validacion', 400, errores))
        }

        await recuperationEmail(email)

        return res.status(200).json(new ApiResponse(200, `Email de recuperacion enviado a ${email}`))
    } catch (error) {
        next(error)
    }
}

export const updatePasswordController = async (req, res, next) => {
    try {
        const { token_recuperation } = req.params
        if (!token_recuperation) {
            return next(new AppError('Falta token_recuperation', 400))
        }

        const { password } = req.body
        if (!password) {
            return next(new AppError('Todos los campos deben estar llenos', 400))
        }

        const validador = new Validations({ password })
        validador
            .isString('password').min_max_length('password', 8, 30)
        const errores = validador.obtenerErrores()
        if (errores.length > 0) {
            return next(new AppError('Errores de validacion', 400, errores))
        }

        const data = jwt.verify(token_recuperation, ENVIRONMENT.SECRET_KEY)
        const passwordHased = await bcrypt.hash(password, 10)

        await UserRepository.updatePassword(data.email, passwordHased)

        return res.status(200).json(new ApiResponse(200, 'Password cambiada con exito'))
    } catch (error) {
        next(error)
    }
}