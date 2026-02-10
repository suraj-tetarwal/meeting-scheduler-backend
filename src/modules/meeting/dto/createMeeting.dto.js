function validateCreateMeetingData(data) {
    const {userId, title, startTime, endTime} = data

    if (!userId || !title || !startTime || !endTime) {
        const error = new Error("userId, title, startTime and endTime are required")
        error.statusCode = 400
        throw error
    }

    const parsedUserId = Number(userId)
    if (Number.isNaN(parsedUserId) || parsedUserId <= 0) {
        const error = new Error("Invalid userId")
        error.statusCode = 400
        throw error
    }

    const trimmedTitle = title.trim()
    if (typeof(trimmedTitle) !== "string" || !trimmedTitle) {
        const error = new Error("Title must be non-empty string")
        error.statusCode = 400
        throw error
    }
    
    const start = new Date(startTime)
    const end = new Date(endTime)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
        const error = new Error("Invalid startTime or endTime")
        error.statusCode = 400
        throw error
    }

    if (start >= end) {
        const error = new Error("startTime must be before endTime")
        error.statusCode = 400
        throw error
    }

    return {
        userId: parsedUserId,
        title: trimmedTitle,
        startTime: start,
        endTime: end
    }
}

module.exports = validateCreateMeetingData