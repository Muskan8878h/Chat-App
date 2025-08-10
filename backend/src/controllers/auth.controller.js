import cloudinary from '../lib/cloudinary.js';
import { generateToken } from '../lib/utils.js';
import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import cloudinary from '../lib/cloudinary.js';

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

export const login=async (req,res)=>{
    // res.send("login router");
    const {email,password}=req.body;

    try{
        const user=await User.findOne({email});
        // if not exist
        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"})
        }

        generateToken(user._id,res);
        // success
        res.status(200).json({
            _id:user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic,
        });
    }
    catch(error){
        console.log("Error in login controller" , error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
}

export const logout=(req,res)=>{
    // res.send("logout router");
    try{
        res.cookie("jwt","",{maxAge:0});
        res.status(200).json({message: "Logged out successfully"});
    }
    catch(error){
        console.log("Error in logout controller",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const updateProfile=async(req,res)=>{
    try{
        const {profilePic}=req.body;
        const userId=req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "Profile pic is required"})
        }

        const uploadResponse=await cloudinary.uploader.upload(profilePic);
        const updateUser=await User.findByIdAndUpdate(userId,{profilePic:uploadResponse.secure_url});

        res.status(200).json(updateUser);
    }
    catch(error){
        console.log("error in updaete profile ", error.message);
        return res.status(500).json({message: "Internal server error"});
    }
};

export const checkAuth=(req,res)=>{
    try{
        res.status(200).json(req.user);
    }
    catch(error){
        console.log("error in checkAuth controller ", error,message);
        return res.status(500).json({message: "Internal server error"});
    }
}