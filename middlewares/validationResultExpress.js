import { validationResult } from "express-validator";

export const validationResultExpress = (req, res, next) => { //el next es para decir continue con el siguiente metodo
    const errors = validationResult(req);

    if (!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    next()
};