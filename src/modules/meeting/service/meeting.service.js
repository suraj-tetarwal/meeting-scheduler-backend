const {Op} = require("sequelize")
const Meeting = require("../model/meeting.model")
const User = require("../../user/model/user.model");

async function hasConflict(meetingData) {
    const {userId, startTime, endTime, excludeId} = meetingData
    
    const condition = {
        userId,
        startTime: {[Op.lt]: endTime},
        endTime: {[Op.gt]: startTime}
    }

    if (excludeId) {
        condition.id = {
            [Op.ne]: excludeId
        }
    }

    return Meeting.findOne({where: condition})
}

async function createMeeting(data) {
    const {userId, title, startTime, endTime} = data

    const user = await User.findByPk(userId)
    if (!user) {
        const error = new Error("User not found")
        error.statusCode = 404
        throw error
    }

    const isConflictExist = await hasConflict({userId, startTime, endTime})

    if (isConflictExist) {
        const error = new Error("Time slot already booked")
        error.statusCode = 400
        throw error
    }

    const meeting = await Meeting.create({
        userId,
        title,
        startTime,
        endTime
    })

    return meeting
}

async function fetchMeetings(query) {
    const { userId = null, startDate = null, endDate = null } = query;

    const filteringConditions = {};

    let start = null;
    let end = null;

    if (userId !== null) {
        const parsedUserId = Number(userId);
        if (Number.isNaN(parsedUserId) || parsedUserId <= 0) {
            const error = new Error("Invalid user id");
            error.statusCode = 400;
            throw error;
        }

        filteringConditions.userId = parsedUserId;
    }

    if (startDate) {
        if (typeof startDate !== "string" || !startDate.includes("T")) {
            const error = new Error("Invalid startDate");
            error.statusCode = 400;
            throw error;
        }

        start = new Date(startDate);
        if (Number.isNaN(start.getTime())) {
            const error = new Error("Invalid startDate");
            error.statusCode = 400;
            throw error;
        }
    }

    if (endDate) {
        if (typeof endDate !== "string" || !endDate.includes("T")) {
            const error = new Error("Invalid endDate");
            error.statusCode = 400;
            throw error;
        }

        end = new Date(endDate);
        if (Number.isNaN(end.getTime())) {
            const error = new Error("Invalid endDate");
            error.statusCode = 400;
            throw error;
        }
    }

    if (start && end && start >= end) {
        const error = new Error("startDate must be before endDate");
        error.statusCode = 400;
        throw error;
    }

    if (start) {
        filteringConditions.startTime = { [Op.gte]: start };
    }

    if (end) {
        filteringConditions.endTime = { [Op.lte]: end };
    }

    const meetings = await Meeting.findAll({
        where: filteringConditions,
    });

    return meetings;
}

async function getMeetingById(id) {
    const meetingId = Number(id)

    if (Number.isNaN(meetingId) || meetingId <= 0) {
        const error = new Error("Invalid meeting id")
        error.statusCode = 400
        throw error
    }

    const meeting = await Meeting.findByPk(meetingId)

    if (!meeting) {
        const error = new Error("Meeting not found")
        error.statusCode = 404
        throw error
    }

    return meeting
}

async function updateMeeting(id, data) {    
    const parsedMeetingId = Number(id);
    
    if (Number.isNaN(parsedMeetingId) || parsedMeetingId <= 0) {
        const error = new Error("Invalid meeting id");
        error.statusCode = 400;
        throw error;
    }

    const { title, startTime, endTime } = data;

    if (!title && !startTime && !endTime) {
        const error = new Error("Nothing to update");
        error.statusCode = 400;
        throw error;
    }

    const meeting = await Meeting.findByPk(parsedMeetingId);

    if (!meeting) {
        const error = new Error("Meeting not found");
        error.statusCode = 404;
        throw error;
    }

    let updatedStartTime = meeting.startTime;
    let updatedEndTime = meeting.endTime;

    if (startTime) {
        if (typeof startTime !== "string" || !startTime.includes("T")) {
            const error = new Error("Invalid startTime");
            error.statusCode = 400;
            throw error;
        }

        updatedStartTime = new Date(startTime);
        if (Number.isNaN(updatedStartTime.getTime())) {
            const error = new Error("Invalid startTime");
            error.statusCode = 400;
            throw error;
        }
    }

    if (endTime) {
        if (typeof endTime !== "string" || !endTime.includes("T")) {
            const error = new Error("Invalid endTime");
            error.statusCode = 400;
            throw error;
        }

        updatedEndTime = new Date(endTime);
        if (Number.isNaN(updatedEndTime.getTime())) {
            const error = new Error("Invalid endTime");
            error.statusCode = 400;
            throw error;
        }
    }

    if (updatedStartTime >= updatedEndTime) {
        const error = new Error("startTime must be before endTime");
        error.statusCode = 400;
        throw error;
    }

    if (startTime || endTime) {
        const isConflictExist = await hasConflict({
            userId: meeting.userId,
            startTime: updatedStartTime,
            endTime: updatedEndTime,
            excludeId: parsedMeetingId
        });

        if (isConflictExist) {
            const error = new Error("Time slot already booked");
            error.statusCode = 400;
            throw error;
        }
    }

    await meeting.update({
        title: title ?? meeting.title,
        startTime: updatedStartTime,
        endTime: updatedEndTime
    });

    return meeting;
}


async function deleteMeeting(id) {
    const parsedMeetingId = Number(id)

    if (Number.isNaN(parsedMeetingId) || parsedMeetingId <= 0) {
        const error = new Error("Invalid meeting id")
        error.statusCode = 400
        throw error
    }

    const meeting = await Meeting.findByPk(parsedMeetingId)

    if (!meeting) {
        const error = new Error("Meeting not found")
        error.statusCode = 404
        throw error
    }

    await meeting.destroy()
}

module.exports = {
    createMeeting,
    fetchMeetings,
    getMeetingById,
    updateMeeting,
    deleteMeeting
}