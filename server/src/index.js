import 'dotenv/config'
import connectDB from "./db/db.js";
import {app} from './app.js'


const port = process.env.PORT || 8000;


connectDB()
.then(()=>{
    app.listen(port, ()=>{
        console.log(`Server is running on : http://localhost:${port}`);
        console.log(`Swagger UI → http://localhost:${port}/api-docs`);
    })
})
.catch((err)=>{
    console.log("MONGODB connection failed !!! " ,err);
})