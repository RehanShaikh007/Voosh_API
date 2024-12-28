import User from "../model/usermodel.js";
import bcryptjs from 'bcryptjs';
import { v4 as uuidV4 } from 'uuid';

export const addUser = async (req, res, next) => {
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

    const allowedRoles = ["Editor", "Viewer"];
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        status: 403,
        message: "Forbidden Access/Operation not allowed",
        error: `Invalid role specified. Allowed roles are: ${allowedRoles.join(
          ", "
        )}`,
      });
    }

    const hashedPassword = await bcryptjs.hash(password, 10);

    const newUser = new User({
        user_id: uuidV4(),
        email,
        password: hashedPassword,
        role
    });

    await newUser.save();

    res.status(201).json({
        message: 'User created Successfully!',
        success: true
    })

  } catch (error) {
    next(error);
  }
};
