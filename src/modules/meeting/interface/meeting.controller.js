const validateCreateMeetingData = require("../dto/createMeeting.dto")
const validateUpdateMeetingData = require("../dto/updateMeeting.dto")
const meetingService = require("../service/meeting.service")

async function createMeeting(request, response, next) {
    try {
        const validatedData = validateCreateMeetingData(request.body)

        const meeting = await meetingService.createMeeting(validatedData)

        response.status(201).json(meeting)
    } catch (error) {
        next(error)
    }
}

async function fetchMeetings(request, response, next) {
    try {
        const meetings = await meetingService.fetchMeetings(request.query)

        response.status(200).json(meetings)
    } catch (error) {
        next(error)
    }
}

async function fetchMeeting(request, response, next) {
    try {
        const {id} = request.params

        const meeting = await meetingService.getMeetingById(id)
        
        response.status(200).json(meeting)
    } catch (error) {
        next(error)
    }
}

async function updateMeeting(request, response, next) {
    try {
        const { id } = request.params;

        const validatedData = validateUpdateMeetingData(request.body);

        const updatedMeeting = await meetingService.updateMeeting(id, validatedData);

        response.status(200).json(updatedMeeting);
    } catch (error) {
        next(error);
    }
}

async function deleteMeeting(request, response, next) {
    try {
        const {id} = request.params

        await meetingService.deleteMeeting(id)

        response.status(204).send()
    } catch (error) {
        next(error)
    }
}

module.exports = {
    createMeeting,
    fetchMeetings,
    fetchMeeting,
    updateMeeting,
    deleteMeeting
}