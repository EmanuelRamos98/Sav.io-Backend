import nodemailer from 'nodemailer'
import ENVIRONMENT from '../../config/environment.config.js'

const trasnporterEmail = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: ENVIRONMENT.EMAIL_USER,
        pass: ENVIRONMENT.EMAIL_PASSWORD
    }
})

export default trasnporterEmail