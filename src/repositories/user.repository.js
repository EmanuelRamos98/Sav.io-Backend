import User from "../models/users.model.js";

class UserRepository {

    static async createUser(new_user) {
        const user = new User(new_user)
        return await user.save()
    }

    static async findByIdentifier(identifier) {
        return await User.findOne({
            $or: [{ name: identifier }, { email: identifier }]
        });
    }

    static async userVarificated(email){
        const user_to_verify = await User.findOne({ email: email })
        if (!user_to_verify) {
            return next(new AppError('No se encontro el usuario a verificar', 404))
        }
        user_to_verify.emailVerificated = true
        return await user_to_verify.save()
    }

    static async updatePassword(email, password){
        const userUpdate = await User.findOne({ email })
        if (!userUpdate) {
            return next(new AppError('No se encontro el usuario a verificar', 404))
        }
        userUpdate.password = password
        return await userUpdate.save()
    }
}

export default UserRepository