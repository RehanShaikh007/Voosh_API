import User from '../model/usermodel.js';
import bcryptjs from 'bcryptjs';


export const signup = async(req, res, next) => {
    const {email, password, role} = req.body;

    try {

        if(!email || !password || !role){
            return res.status(400).json({
                message: 'Bad Request, Missing Field!',
                success: false
            })
        }
    
        const existingUser = await User.findOne({email});
        if(existingUser){
            return res.status(409).json({
                message: 'Email Already Exists!',
                success: false
            })
        }
    
        const hashedPassword = await bcryptjs.hash(password, 10);
    
        const newUser = new User({email, password: hashedPassword, role });
    
        await newUser.save();
        res.status(201).json({
            message: 'User created successfully!',
            success: true
        })



    } catch (error) {
        next(error);
    }
}

