// const express=require("express")  // used in common js
import express from "express"

const app=express();

app.listen(5001,()=>{
    console.log("serevr is running on port 5001")
})