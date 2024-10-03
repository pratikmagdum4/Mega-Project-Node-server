
import jwt from "jsonwebtoken";
import UserSchema from "../models/UserModel.js";

const CreateUser  = async (req,res)=>{
    const {name,email,password,phone} = req.body;
    try{
        const existingClerk = await UserSchema.findOne({
            email
        })
        if(existingClerk)
        {
            return res.status(400).json({msg:"User Already Exists"})
        }
        const newUser = new UserSchema({
            name,
            email,
            phone,
            password
        })
        await newUser.save();

        const token = jwt.sign({
            id:newUser._id,role: "user"
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"1h"
        }
    );

    res.status(201).json({id:newUser._id,name:newUser.name,role: "user",token})
    }
    catch(err)
    {
        console.log("Error is ",err)
        res.status(500).json({msg:"Server Error"})
    }
}

export {CreateUser};