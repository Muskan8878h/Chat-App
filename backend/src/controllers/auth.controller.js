import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export const signup=async(req,res)=>{
    // res.send("signup router");

    const {fullName,email,password}=req.body;
    
    try{
        //password
        if(!fullName || !email || !password){
            return res.status(400).json({message: "All fields are required"});
        }

        if(password.length < 8){
            return res.status(400).json({message: "Password must be at least 8 characters"});
        }
        
        // email
        const user=await User.findOne({email})
        if(user) return res.status(400).json({message: "Email already exists"});

        // hash password
        const salt= await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        // new user data
        const newUser=new User({
            // fullName:fullName, this is old version
            fullName,
            email,
            password: hashedPassword
        })

        // is there any error
        if(newUser){
            // generate JWT token here
            await newUser.save()
            generateToken(newUser._id,res);

            // success
            res.status(201).json({
                _id:newUser._id,
                fullName: fullName,
                email: email,
                profilePic: newUser.profilePic,
            });
        }
        else{
            res.status(400).json({message: "Invalid user data"});
        }
    }catch(error){
        console.log("Error in signup controller",error.message); 
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const login=(req,res)=>{
    res.send("login router");
}

export const logout=(req,res)=>{
    res.send("logout router");
}