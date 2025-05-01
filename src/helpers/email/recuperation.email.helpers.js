import jwt from "jsonwebtoken";
import ENVIRONMENT from "../../config/environment.config.js";
import trasnporterEmail from "./transporter.email.helpers.js";

const recuperationEmail = async (email) => {
    const token_recuperation = jwt.sign(
        { email: email },
        ENVIRONMENT.SECRET_KEY,
        { expiresIn: "1d" }
    );

    const redirect_url = `http://localhost:5173/recovery-password/${token_recuperation}`;

    const send = await trasnporterEmail.sendMail({
        subject: "Validacion",
        to: email,
        html: `
            <h1>Recuperar Contraseña</h1>
            <p>Para recuperar tu contraseña da click <a href='${redirect_url}'>aqui</a></p>
            `,
    });

    return send;
};

export default recuperationEmail;
