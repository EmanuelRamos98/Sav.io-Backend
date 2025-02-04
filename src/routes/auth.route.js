import express from 'express'
import { loginController, registerController } from '../controllers/auth.controller.js'

const auhtRoute = express.Router()

auhtRoute.post('/register', registerController)
auhtRoute.post('/login', loginController)

export default auhtRoute