import dotenv from 'dotenv'
import app from './src/app.js'
import connectDB from './src/DataBase/Conection.js'

dotenv.config();

const PORT = Number(process.env.PORT) || 5000;
const startServer = async() => {
    try{
        await connectDB(process.env.MONGO_URI);
        app.listen(PORT), ()=>{
            console.log(`El servidor esta Corriendo en el puerto ${PORT}`)
        }
    } catch(error){
        console.error('Fallo en iniciar el servidor');
        process.exit(1);
    }
}

startServer();