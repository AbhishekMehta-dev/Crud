import express from "express"
import cookieParser from "cookie-parser"
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

const app = express()

app.use(cors()); 
app.use(express.json())
app.use(express.urlencoded({extended:true,limit:"20kb"}))
app.use(cookieParser())



// Define __dirname in ES6 module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the "public/temp" folder
app.use('/temp', express.static(path.join(__dirname, 'public/temp')));

import router from "./src/routes/api.routes.js"


app.use("/api", router)


export {app}


