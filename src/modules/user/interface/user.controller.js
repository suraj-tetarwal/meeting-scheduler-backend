const validateCreateUserData = require("../dto/createUser.dto")
const userService = require("../service/user.service")

async function createUser(request, response, next) {
    try {
        const validatedData = validateCreateUserData(request.body)

        const user = await userService.createUser(validatedData)

        response.status(201).json(user)
    } catch (error) {
        next(error)
    }
}

async function fetchUser(request, response, next) {
    try {
        const {id} = request.params

        const user = await userService.getUserById(id)
        
        response.status(200).json(user)
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createUser,
    fetchUser
}