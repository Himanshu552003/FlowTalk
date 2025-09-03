import express from "express"
import {ENV} from "./config/env.js"
import connectDB from "./config/db.js"
import { serve } from "inngest/express";
import {clerkMiddleware} from "@clerk/express"
import { functions, inngest } from "./config/inngest.js"


const app =express()
app.use(clerkMiddleware())  // req.auth will be available in the req obj

app.use(express.json());

// connectDB()
//   .then(()=>{
//     app.listen(ENV.PORT,()=>{
//       console.log(`Server is running on port: ${ENV.PORT}`);
      
//     })
//   })
//   .catch((err)=>{
//     console.error("MongoDb connection error", err);
//     process.exit(1)
    
//   });

app.use("/api/inngest", serve({ client: inngest, functions }));

app.get('/',(req, res)=>{
    res.send("Hello ")
})

const startServer= async () => {
  try {
    await connectDB();
    if(ENV.NODE_ENV!=="production"){
      app.listen(ENV.PORT, ()=>{
        console.log("Server started on port: ", ENV.PORT);
        
      });
    }
    
  } catch (error) {
    console.error("Error starting server:", error);
    process.exit(1)
    
    
  }
  
};

startServer();

export default app;

