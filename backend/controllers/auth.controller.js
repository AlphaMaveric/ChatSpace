import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";


export const signup = async(req, res) => {
    try {
        const { fullName, username, password, confirmPassword, gender }= req.body;

        if(password !== confirmPassword)
        {
            return res.status(400).json({error: "Passwords dont match"});
        }

        const user = await User.findOne({username});

        if(user){
            return res.status(400).json({error: "Username already exists"});
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const maleProfilePic = `https://avatar.iran.liara.run/public/boy?username=${username}`;
        const femaleProfilePic = `https://avatar.iran.liara.run/public/girl?username=${username}`;

        const newUser = new User({
            fullname: fullName,
            username,
            password: hashedPassword,
            gender,
            profilePicture: gender === "male"? maleProfilePic : femaleProfilePic
        })
                
        if(newUser)
        {
            //Generate JWT token and set cookie
             generateTokenAndSetCookie(newUser._id, res);

            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                fullname: newUser.fullname,
                username: newUser.username,
                profilePicture: newUser.profilePicture
            });

        } else{
            res.status(400).json({error: "Invalid user data"});
        }
    }
    catch (error) {
        console.log("Error in sign up path", error.message);
        res.status(500).json({error: "Internal server error"});
    }
}

export const login = (req, res) => {
    console.log("Login User");
}

export const logout = (req, res) => {
    console.log("Logout User");
}