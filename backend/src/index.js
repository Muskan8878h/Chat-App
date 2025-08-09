// const express=require("express")  // used in common js
import express from "express"

import authRoutes from "./routes/auth.route"

const app=express();

app.use("/api/auth",authRoutes)

app.listen(5001,()=>{
    console.log("serevr is running on port 5001")
}) 
