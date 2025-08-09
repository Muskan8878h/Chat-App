import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'

export const signup=async(req,res)=>{
    // res.send("signup router");

    const {fullName,password,email}=req.body;
    
    try{
        //password
        if(password.length < 8){
            return re.status(400).json({message: "Password must be at least 8 characters"});
        }
        
        // email
        const user=await User.findOne(email)
        if(user) return res.status(400).json({message: "Email already exists"});

        // hash password
        const salt= await bcrypt.genSalt(10);
        const hashedPassword=await bcrypt.hash(password,salt);

        // new user data
        const newUser=new User({
            fullName: fullName,
            email: email,
            password: hashedPassword
        })

        // is there any error
        if(newUser){
            // generate JWT token here

        }
        else{
            res.status(400).json({message: "Invalid user data"});
        }



    }catch(error){

    }
}

export const login=(req,res)=>{
    res.send("login router");
}

export const logout=(req,res)=>{
    res.send("logout router");
}