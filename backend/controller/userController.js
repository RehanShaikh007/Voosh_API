import User from "../model/usermodel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (!role) missingFields.push("role");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Bad Request. Missing fields: ${missingFields.join(", ")}`,
        success: false,
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid Email Format!",
        success: false,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        message: "Email Already Exists!",
        success: false,
      });
    }

    const validRoles = ["Admin", "Editor", "Viewer"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: `Invalid role. Allowed roles are: ${validRoles.join(", ")}`,
        success: false,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword, role });

    await newUser.save();
    res.status(201).json({
      message: "User created successfully!",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");

    if (missingFields.length > 0) {
      return res.status(400).json({
        message: `Bad Request. Missing fields: ${missingFields.join(", ")}`,
        success: false,
      });
    }

    const validUser = await User.findOne({ email });

    if (!validUser) {
      return res.status(404).json({
        message: "User not found!",
        success: false
      });
    }

    const validPassword = await bcryptjs.compare(password, validUser.password);

    if (!validPassword) {
      return res.status(404).json({
        message: "Wrong password!",
        success: false
      });
    }

    const token = jwt.sign(
      { id: validUser.user_id, role: validUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const { password: pass, ...rest } = validUser._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({
        message: "Login Successful",
        success: true,
        data: {
          token,
        },
        rest,
      });
  } catch (error) {
    next(error);
  }
};


export const logout = async(req, res, next) => {
    try {
        res.cookie('access_token',"", {
            httpOnly: true,
            expires: new Date(Date.now()),
        });

        res.status(200).json({
            message: 'User logged out successfully!',
            success: true
        })

    } catch (error) {
        next(error);
        return res.status(400).json({
            message: 'Bad Request',
            success: false
        })
    }
}