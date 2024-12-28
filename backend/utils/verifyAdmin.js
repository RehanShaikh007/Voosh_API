export const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role == "Admin") {
    next();
  } else {
    return res.status(403).json({
      status: 403,
      data: null,
      message: "Forbidden Access/Operation not allowed",
      error: null,
    });
  }
};
