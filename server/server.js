import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './config/db.js'


//Initialize Express
const app = express()

//connect to database
await connectDB();

//Middlewares
app.use(cors())
app.use(express.json())

//Routes
app.get('/',(req,res)=> res.send("API Working"))

//Port
const PORT = process.env.PORT || 5001

app.listen(PORT,()=>{
    console.log(`Server is runing on port ${PORT}`)
})