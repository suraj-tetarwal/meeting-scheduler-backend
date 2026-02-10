const User = require("../model/user.model")

async function createUser(data) {
    const {name, email} = data

    const existingUser = await User.findOne({
        where: {email}
    })

    if (existingUser) {
        const error = new Error("Email already exists")
        error.statusCode = 400
        throw error
    }

    const user = await User.create({name: name, email: email})
    return user
}

async function getUserById(id) {
    const userId = Number(id)

    if (Number.isNaN(userId) || userId <= 0) {
        const error = new Error("Invalid user id")
        error.statusCode = 400
        throw error
    }

    const user = await User.findByPk(userId)

    if (!user) {
        const error = new Error("User not found")
        error.statusCode = 404
        throw error
    }

    return user
}

module.exports = {
    createUser,
    getUserById
}