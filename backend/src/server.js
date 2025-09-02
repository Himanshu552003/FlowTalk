import express from "express"
import {ENV} from "./config/env.js"
import connectDB from "./config/db.js"

import cors from "cors"


const app =express()



connectDB()
  .then(()=>{
    app.listen(ENV.PORT,()=>{
      console.log(`Server is running on port: ${ENV.PORT}`);
      
    })
  })
  .catch((err)=>{
    console.error("MongoDb connection error", err);
    process.exit(1)
    
  });

app.get('/',(req, res)=>{
    res.send("Hello ")
})

app.listen(ENV.PORT, () => {
  console.log(`Server is running on port ${ENV.PORT}`);
});