const express = require('express')
const router = express.Router()
const emmisionController = require('../controllers/Emmision')

router.post('/create-emission-record', emmisionController.recordEmmision)
router.get('/get-all-records', emmisionController.fetchAllRecords)
router.post('/get-dynamic-records', emmisionController.fetchDynamicRecords)
router.post("/get-all-user-records", emmisionController.fetchAllRecordsBasedOnUser)
router.post("/get-user-stats", emmisionController.fetchEmissionStatistics)
router.post("/get-records-year", emmisionController.getRecordsByYear)
router.post("/get-records-month", emmisionController.getRecordsByMonth)
router.post("/get-records-product", emmisionController.getStatsByFilterParams)

module.exports = router
