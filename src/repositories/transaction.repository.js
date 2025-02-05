import Transaction from '../models/transaction.model.js'

class TransactionRepository {

    static async createTransaction(new_data) {
        const transaction = new Transaction(new_data)
        return await transaction.save()
    }

    static async findTransaction(filter) {
        const transactions = await Transaction.find(filter).sort({ date: -1 })
        return transactions
    }

    static async updateTransaction(id, userId, data) {
        const trasactionUpdate = await Transaction.findOneAndUpdate({ _id: id, userId }, { $set: data }, { new: true })
        return trasactionUpdate
    }

    static async deleteTransaction(id, userId){
        const transaction = await Transaction.findOneAndDelete({ _id: id, userId: userId })
        return transaction
    }
}

export default TransactionRepository