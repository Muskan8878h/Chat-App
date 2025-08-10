// const express=require("express")  // used in common js
import express from "express"
import dotenv from "dotenv"
import authRoutes from "./routes/auth.route.js"
import { connectDB } from "./lib/db.js";
import cookieParser from "cookie-parser"
import messageRoutes from "./routes/message.route.js"
import cors from "cors"
import { createServer } from "http"
import { Server } from "socket.io"

const app=express();
const server = createServer(app);

dotenv.config()
const PORT=process.env.PORT

// CORS middleware must come BEFORE routes
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
}));

app.use(express.json()); //middleware
app.use(cookieParser());

// Socket.IO setup
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        credentials: true,
    }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);
    
    socket.on("join", (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });
    
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

// Make io accessible to routes
app.use((req, res, next) => {
    req.io = io;
    next();
});

app.use("/api/auth",authRoutes)
app.use("/api/message",messageRoutes)

server.listen(PORT,()=>{
    console.log("server is running on port: "+PORT);
    connectDB();
}) 
