import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
  const token =
    req.cookies.access_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: 401,
      data: null,
      message: "Unauthorized Access",
      error: null,
    });
  }
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err)
      return res.status(403).json({
        status: 403,
        data: null,
        message: "Forbidden Access/Operation not allowed.",
        error: null,
      });

    console.log("Decoded token:", user);
    req.user = { user_id: user.id, role: user.role };
    next();
  });
};
