import dotenv from 'dotenv'
import setConnection from './src/db/index.js'

dotenv.config({path: "./.env"})
import { app } from './app.js'



setConnection()
.then(()=>{
    app.listen(process.env.PORT || 8000,()=>{
        console.log(`Server is running on port ${process.env.PORT}`)
    })
})
.catch((error)=>{
    console.error("Server failed to start")
    
})
