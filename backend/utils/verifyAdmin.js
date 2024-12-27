import { errorHandler } from "./error.js";

export const verifyAdmin = (req, res, next) => {
    if(req.user && req.user.role == 'Admin'){
        next();
    } else {
        return next(errorHandler(409, 'Admin Access Required!'));
    }
}