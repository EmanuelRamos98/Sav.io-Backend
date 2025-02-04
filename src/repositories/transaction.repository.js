import Transaction from '../models/transaction.model.js'

class TransactionRepository {

    static async createTransaction(new_data) {
        const transaction = new Transaction(new_data)
        return await transaction.save()
    }
}

export default TransactionRepository