import mongoose from "mongoose"
import ApiResponse from "../helpers/api.response.helper.js"
import AppError from "../helpers/error.helpers.js"
import Validations from "../helpers/validation.helpers.js"
import Transaction from "../models/transaction.model.js"
import TransactionRepository from "../repositories/transaction.repository.js"

export const addTransactionController = async (req, res, next) => {
    try {
        const userId = req.user.id
        if (!userId) {
            return next(new AppError('Falta el id de usuario', 400))
        }

        const { type, category, amount, description } = req.body
        if (!type || !category || !amount) {
            return next(new AppError('Hay campos que son obligatorios', 400))
        }

        const validTypes = ["income", "expense"]
        if (!validTypes.includes(type)) {
            return next(new AppError('El tipo de transaction no es valido', 400))
        }

        const validador = new Validations({ category, amount, description })

        validador
            .isString('category').min_max_length('category', 0, 20)
            .isString('description').min_max_length('description', 0, 100)
            .isNumber('amount')

        const errores = validador.obtenerErrores()
        if (errores.length > 0) {
            return next(new AppError('Errores de validacion', 400, errores))
        }

        const amuntEnCentavos = Math.round(Number(amount) * 100)

        const newTransaction = {
            userId: userId,
            type: type,
            category: category,
            amount: amuntEnCentavos,
            description: description
        }

        await TransactionRepository.createTransaction(newTransaction)

        return res.status(201).json(new ApiResponse(201, 'Transaction creada con exito', newTransaction))

    } catch (error) {
        next(error)
    }
}

export const getTransactionController = async (req, res, next) => {
    try {
        const user = req.user.id
        if (!user) {
            return next(new AppError('Falta el id de usuario', 400))
        }

        const userId = mongoose.Types.ObjectId.createFromHexString(user)
        const filter = { userId }

        const { type, category, starDate, endDate } = req.body

        if (type) {
            if (!["income", "expense"].includes(type)) {
                return next(new AppError('El tipo de transaction no es valido', 400))
            }
            filter.type = type
        }

        if (category) {
            filter.category = category
        }

        if (starDate || endDate) {
            if (typeof starDate !== 'string' || typeof endDate !== 'string') {
                return next(new AppError('Las fechas deben ser en formato "YYYY-MM-DD"', 400))
            }

            const start = new Date(starDate)
            const end = new Date(endDate)
            if (isNaN(start.getTime()) && isNaN(end.getTime())) {
                return next(new AppError('Formato fecha invalido', 400))

            }
            start.setUTCHours(0, 0, 0, 0)
            end.setUTCHours(23, 59, 59, 999)
            filter.date = {
                $gte: start, $lte: end
            }
        }

        const transactions = await TransactionRepository.findTransaction(filter)

        if (!transactions.length) {
            return next(new AppError('No se encontro una transaction con esos parametros', 400))
        }
        
        return res.status(200).json(new ApiResponse(200, 'Busqueda realizada con exito', transactions))

    } catch (error) {
        next(error)
    }
}

export const updateTransactionController = async (req, res, next) => {
    try {
        const userId = req.user.id
        if (!userId) {
            return next(new AppError('Falta el id de usuario', 400))
        }

        const { id } = req.params
        if (!id) {
            return next(new AppError('Falta id de la transaction', 400))
        }

        const { type, category, amount, date, description } = req.body

        const validatior = new Validations({ category, amount, description })

        const update = {}

        if (type) {
            if (!["income", "expense"].includes(type)) {
                return next(new AppError('El tipo de transaction no es valido', 400))
            }
            update.type = type
        }

        if (category) {
            update.category = category
            validatior.isString('category').min_max_length('category', 0, 20)
        }

        if (amount) {
            update.amount = amount
            validatior.isNumber('amount')
        }

        if (description) {
            update.description = description
            validatior.isString('description').min_max_length('description', 0, 100)
        }

        const errores = validatior.obtenerErrores()
        if (errores.length > 0) {
            return next(new AppError('Error de validacion', 400, errores))
        }

        if (date) {
            const newDate = new Date(date)
            if (!isNaN(newDate.getTime())) {
                newDate.getUTCHours(0, 0, 0, 0)
                update.date = newDate
            } else {
                return next(new AppError('Formato fecha invalido', 400))
            }
        }

        const amuntEnCentavos = Math.round(Number(update.amount) * 100)
        update.amount = amuntEnCentavos

        const transaction = TransactionRepository.updateTransaction(id, userId, update)

        if (!transaction) {
            return next(new AppError('No se encontro la transaction', 400))
        }

        return res.status(200).json(new ApiResponse(200, 'Update con exito', transaction))

    } catch (error) {
        next(error)
    }
}

export const deleteTransactionController = async (req, res, next) => {
    try {
        const userId = req.user.id
        if (!userId) {
            return next(new AppError('Falta el id de usuario', 400))
        }

        const { id } = req.params

        if (!id) {
            return next(new AppError('Falta id de la transaction', 400))
        }

        const transaction = await TransactionRepository.deleteTransaction(id, userId)

        if (!transaction) {
            return next(new AppError('No se encontro la transaction a eliminar', 400))
        }

        return res.status(200).json(new ApiResponse(200, 'Eliminado con exito'))

    } catch (error) {
        next(error)
    }
}