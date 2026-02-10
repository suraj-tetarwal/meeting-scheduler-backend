function validateUpdateMeetingData(data) {
    const { title, startTime, endTime } = data;

    if (!title && !startTime && !endTime) {
        const error = new Error("Nothing to update");
        error.statusCode = 400;
        throw error;
    }

    return data;
}

module.exports = validateUpdateMeetingData;
