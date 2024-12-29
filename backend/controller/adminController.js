import User from "../model/usermodel.js";
import bcryptjs from "bcryptjs";
import { v4 as uuidV4 } from "uuid";

export const addUser = async (req, res, next) => {
  const { email, password, role } = req.body;

  try {
    const missingFields = [];
    if (!email) missingFields.push("email");
    if (!password) missingFields.push("password");
    if (!role) missingFields.push("role");

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: `Bad Request. Missing fields: ${missingFields.join(", ")}`,
        error: null,
      });
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Bad Request. Invalid Email Format!",
        error: null,
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({
        status: 409,
        data: null,
        message: "Email Already Exists!",
        error: null,
      });
    }

    const allowedRoles = ["Editor", "Viewer"];
    if (!allowedRoles.includes(role)) {
      return res.status(403).json({
        status: 403,
        data: null,
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
      role,
    });

    await newUser.save();

    res.status(201).json({
      status: 201,
      data: null,
      message: "User created Successfully!",
      error: null,
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 5;
    const offset = parseInt(req.query.offset) || 0;

    const query = {
      role: { $in: ["Editor", "Viewer"] },
    };
    const totalUsers = await User.countDocuments(query);

    const users = await User.find(query)
      .sort({ createdAt: -1 })
      .skip(offset)
      .limit(limit)
      .select("user_id email role createdAt");

    const totalPages = Math.ceil(totalUsers / limit);

    const currentPage = Math.floor(offset / limit) + 1;

    res.status(200).json({
      data: users,
      total: totalUsers,
      totalPages: totalPages,
      currentPage: currentPage,
      pageSize: limit,
      message: "Users retrieved successfully!",
      error: null,
    });
  } catch (error) {
    next(error);

    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: null,
    });
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { user_id } = req.params;

    const deletedUser = await User.findOneAndDelete({ user_id });

    if (!deletedUser) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "User not found!",
        error: null,
      });
    }

    res.status(200).json({
      status: 200,
      data: null,
      message: "User deleted successfully",
      error: null,
    });
  } catch (error) {
    next(error);
    return res.status(400).json({
      status: 400,
      data: null,
      message: "Bad Request",
      error: null,
    });
  }
};

export const updatePassword = async (req, res, next) => {
  try {
    const { old_password, new_password } = req.body;

    const userId = req.user.user_id;
    console.log("User ID:", req.user.user_id);

    if (!old_password || !new_password) {
      return res.status(400).json({
        status: 400,
        data: null,
        message: "Bad Request. Missing Field",
        error: null,
      });
    }
    const user = await User.findOne({ user_id: userId });

    if (!user) {
      return res.status(404).json({
        status: 404,
        data: null,
        message: "User not found",
        error: null,
      });
    }

    const isMatch = await bcryptjs.compare(old_password, user.password);

    if (!isMatch) {
      return res.status(403).json({
        status: 403,
        data: null,
        message: "Forbidden Access. Old password is incorrect.",
        error: null,
      });
    }

    const hashedPassword = await bcryptjs.hash(new_password, 10);

    user.password = hashedPassword;

    await user.save();

    res.status(204).json({
      status: 204,
      data: null,
      message: "Password Updated Successfully",
      error: null,
    });
  } catch (error) {
    next(error);
  }
};
