import jwt from "jsonwebtoken";
import ENVIRONMENT from "../../config/environment.config.js";
import trasnporterEmail from "./transporter.email.helpers.js";

const validationEmail = async (email, name) => {
    const token_validation = jwt.sign(
        { email: email },
        ENVIRONMENT.SECRET_KEY,
        { expiresIn: "1d" }
    );

    const redirect_url = `http://localhost:3030/api/auth/verify-email/${token_validation}`;

    const send = await trasnporterEmail.sendMail({
        subject: "Validacion",
        to: email,
        html: `
                <h1>Valida tu email</h1>
                <h2>Bienvenido ${name}</h2/>
                <p>Para validar tu email da click <a href=${redirect_url}>aqui</a></p>
            `,
    });

    return send;
};

export default validationEmail;
