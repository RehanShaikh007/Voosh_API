

export const verifyAdmin = (req, res, next) => {
    if(req.user && req.user.role == 'Admin'){
        next();
    } else {
        return res.status(401).json({
            message: 'Admin Access Required!',
            success: false
        });
    }
}