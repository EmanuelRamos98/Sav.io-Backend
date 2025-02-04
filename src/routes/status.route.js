import express from 'express'
import { statusController } from '../controllers/status.controller.js'

const statusRoute = express.Router()

statusRoute.get('/ping', statusController)

export default statusRoute