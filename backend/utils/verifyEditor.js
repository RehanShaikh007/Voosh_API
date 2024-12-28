

export const verifyEditor = (req, res, next) => {
    
    if (req.user && (req.user.role === "Editor" || req.user.role === "Admin")) {
        next();
    } else {
        return res.status(404).json({
            status: 404,
            data: null,
            message: "Forbidden Access/Operation not allowed",
            error: null,
          });
    }
}