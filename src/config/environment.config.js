import dotenv from "dotenv";

dotenv.config()

const ENVIRONMENT = {
    EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
    EMAIL_USER: process.env.EMAIL_USER,
    SECRET_KEY: process.env.SECRET_KEY
}

export default ENVIRONMENT