const express = require("express")
const router = express.Router()

const meetingController = require("../interface/meeting.controller")

router.post("/", meetingController.createMeeting)
router.get("/", meetingController.fetchMeetings)
router.get("/:id", meetingController.fetchMeeting)
router.put("/:id", meetingController.updateMeeting)
router.delete("/:id", meetingController.deleteMeeting)

module.exports = router