import mongoose from "mongoose";

const MONGO_URI = 'mongodb://localhost:27017/' + 'Dashboard'


mongoose.connect(MONGO_URI, {})
    .then(
        () => {
            console.log('Se establecio la conexion con mongoDB')

        }
    )
    .catch(
        (error) => {
            console.error('La conexion con mongoDB ha fallado', error)
        }
    )
    .finally(
        () => {
            console.log('El proceso de conexion con la DB esta finalizado')
        }
    )

export default mongoose