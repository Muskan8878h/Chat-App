import jwt from 'jsonwebtoken'

export const generateToken=(userId, res)=>{
    // token 
    const token=jwt.sign({userId}, process.env.JWT_SECRET,{
        expiresIn:"7d"
    })

    // cookie
    res.cookie("jwt",token, {
        maxAge: 7*24*60*60*1000, //ms
        httpOnly: true, //prevent XSS attacks cross-site scripting attacks
        sameSite: "strict", //CSRF attcks cross-site request forgrey attacks
        secure: process.env.NODE_ENV !=="development"
    })
}