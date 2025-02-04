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
}

export default UserRepository