function validateCreateUserData(data) {
    const {name, email} = data

    if (!name || !email) {
        const error = new Error("Name and email are required")
        error.statusCode = 400
        throw error
    }
    
    if (typeof(name) !== "string" || typeof(email) !== "string") {
        const error = new Error("Name and email must be string")
        error.statusCode = 400
        throw error
    }
    
    const trimmedName = name.trim()
    const trimmedEmail = email.trim()
    
    if (!trimmedName || !trimmedEmail) {
        const error = new Error("Name and email cannot be empty")
        error.statusCode = 400
        throw error
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailRegex.test(trimmedEmail)) {
        const error = new Error("Invalid email format")
        error.statusCode = 400
        throw error
    }

    return {
        name: trimmedName,
        email: trimmedEmail
    }
}

module.exports = validateCreateUserData