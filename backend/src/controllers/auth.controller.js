export const signup=(req,res)=>{
    // res.send("signup router");
    const {fullName,password,email}=req.body;
    try{
        //hash password
        
    }catch(error){

    }
}

export const login=(req,res)=>{
    res.send("login router");
}

export const logout=(req,res)=>{
    res.send("logout router");
}