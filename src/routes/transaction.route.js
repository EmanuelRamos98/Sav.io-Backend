import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    addTransactionController,
    deleteTransactionController,
    getTransactionCategory,
    getTransactionController,
    getTransactionMovementsController,
    updateTransactionController,
}
from '../controllers/transaction.controller.js';

const transactionRoute = express.Router()

transactionRoute.post('/', authMiddleware, addTransactionController)
transactionRoute.get('/search', authMiddleware, getTransactionController)
transactionRoute.get('/movements', authMiddleware, getTransactionMovementsController)
transactionRoute.get('/category', authMiddleware, getTransactionCategory)
transactionRoute.put('/update/:id', authMiddleware, updateTransactionController)
transactionRoute.delete('/delete/:id', authMiddleware, deleteTransactionController)

export default transactionRoute 