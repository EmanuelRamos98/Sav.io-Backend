import express from 'express'
import {
    loginController,
    registerController,
    updatePasswordController,
    verifyEmailController
}
    from '../controllers/auth.controller.js'

const auhtRoute = express.Router()

auhtRoute.get('varify-email', verifyEmailController)
auhtRoute.post('/register', registerController)
auhtRoute.post('/login', loginController)
auhtRoute.put('/password', updatePasswordController)

export default auhtRoute