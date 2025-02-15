import express from 'express';
import authMiddleware from '../middlewares/auth.middleware.js';
import {
    addTransactionController,
    deleteTransactionController,
    getTransactionController,
    updateTransactionController,
}
from '../controllers/transaction.controller.js';

const transactionRoute = express.Router()

transactionRoute.post('/', authMiddleware, addTransactionController)
transactionRoute.post('/search', authMiddleware, getTransactionController)
transactionRoute.put('/update/:id', authMiddleware, updateTransactionController)
transactionRoute.delete('/delete/:id', authMiddleware, deleteTransactionController)

export default transactionRoute 