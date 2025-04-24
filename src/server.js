import mongoose from "./config/db.config.js";
import express from "express";
import cors from 'cors';
import statusRoute from "./routes/status.route.js";
import auhtRoute from "./routes/auth.route.js";
import errorHandleMiddleware from "./middlewares/error.handle.meddleware.js";
import transactionRoute from "./routes/transaction.route.js";


const PORT = 3030
const app = express()
app.use(cors())
app.use(express.json());

app.use('/api/status', statusRoute)
app.use('/api/auth', auhtRoute)
app.use('/api/transaction', transactionRoute)

app.use(errorHandleMiddleware)
app.listen(PORT, () => {
    console.log(`El servidor se esta ejecutando en http://localhost:${PORT}`)
})
