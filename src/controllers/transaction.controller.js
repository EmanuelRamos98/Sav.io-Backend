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

        const newTransaction = {
            userId: userId,
            type: type,
            category: category,
            amount: amount,
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
        const userId = req.user.id
        if (!userId) {
            return next(new AppError('Falta el id de usuario', 400))
        }

        const { type, category, starDate, endDate } = req.body

        let filter = { userId }

        if (type) {
            if (!["income", "expense"].includes(type)) {
                return next(new AppError('El tipo de transaction no es valido', 400))
            }
            filter.type = type
        }

        if (category) {
            filter.category = category
        }

        if (typeof starDate === 'string' && typeof endDate === 'string') {
            const start = new Date(starDate)
            const end = new Date(endDate)

            if (!isNaN(start.getTime()) && !isNaN(end.getTime())) {
                start.setUTCHours(0, 0, 0, 0)
                end.setUTCHours(23, 59, 59, 999)

                filter.date = { $gte: start, $lte: end }
            } else {
                return next(new AppError('Formato fecha invalido', 400))
            }

        } else if ((starDate && typeof starDate !== 'string') || (endDate && typeof endDate !== 'string')) {
            return next(new AppError('Las fechas deben ser en formato "YYYY-MM-DD"', 400))
        }

        const transactions = await Transaction.find(filter).sort({ date: -1 })

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
            return next(new AppError('Error de validacion', 400))
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

        const transaction = await Transaction.findOneAndUpdate(
            { _id: id, userId },
            { $set: update },
            { new: true }
        )

        if (!transaction) {
            return next(new AppError('No se encontro la transaction', 400))
        }

        return res.status(200).json(new ApiResponse(200, 'Update con exito', transaction))

    } catch (error) {
        next(error)
    }
}

export const deleteTransactionController = (req, res, next) => {
    try {

    } catch (error) {
        next(error)
    }
}