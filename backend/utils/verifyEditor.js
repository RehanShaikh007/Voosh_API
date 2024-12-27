import { errorHandler } from "./error.js";

export const verifyEditor = (req, res, next) => {
    if(req.user && req.user.role == 'Editor'){
        next();
    } else {
        return next(errorHandler(404, 'Editor Access Required!'));
    }
}